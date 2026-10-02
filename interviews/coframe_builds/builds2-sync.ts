// Exercise: two-way sync between an approval sheet and a variants API that forgets its state on restart: reconcile, idempotent writes, a conflict rule, dry run, a report.
// Run its test: node --experimental-strip-types interviews/coframe_builds/builds2-sync.test.ts

export const REVIEWERS = ["product", "brand", "design", "legal"] as const;
export type Status = "ready_for_review" | "approved" | "launched" | "cancelled" | "need_fixes";
export type Variant = { id: string; name: string; status: Status };
export type Row = { variant_id: string; name: string; status: string } & Partial<Record<(typeof REVIEWERS)[number], string>>;
export type Change =
  | { action: "add_row"; variantId: string; after: Status; why: string }
  | { action: "set_status"; variantId: string; before: Status; after: Status; why: string }
  | { action: "set_sheet_status"; variantId: string; before: string; after: Status; why: string }
  | { action: "conflict"; variantId: string; before: Status; after: Status; why: string }
  | { action: "orphan"; variantId: string; why: string };

export interface Sheet {
  rows(): Promise<Row[]>;
  append(row: Row): Promise<void>;
  update(variantId: string, col: string, value: string): Promise<void>;
}
export interface Api {
  listVariants(): Promise<Variant[]>;
  patchStatus(id: string, status: Status): Promise<void>;
}

const TERMINAL = new Set<Status>(["launched", "cancelled"]);
const REVIEWABLE = new Set<Status>(["ready_for_review", "need_fixes", "approved"]);

// A blank is not a No: no decision yet.
export function decision(row: Row): Status | null {
  const votes = REVIEWERS.map((r) => (row[r] ?? "").trim().toLowerCase());
  if (votes.includes("no")) return "need_fixes";
  if (votes.every((v) => v === "yes" || v === "skip") && votes.includes("yes")) return "approved";
  return null;
}

// Pure: compare the full state of both sides, return the writes that make them agree.
export function plan(rows: Row[], variants: Variant[]): Change[] {
  const byId = new Map(rows.map((r) => [r.variant_id, r]));
  const out: Change[] = [];
  for (const v of variants) {
    const row = byId.get(v.id);
    byId.delete(v.id);
    if (!row) {
      out.push({ action: "add_row", variantId: v.id, after: v.status, why: "new in the API" });
      continue;
    }
    let status = v.status;
    const want = decision(row);
    if (want && want !== status) {
      if (TERMINAL.has(status)) out.push({ action: "conflict", variantId: v.id, before: status, after: want, why: "API is terminal, sheet not applied" });
      else if (REVIEWABLE.has(status)) {
        out.push({ action: "set_status", variantId: v.id, before: status, after: want, why: "sheet decision" });
        status = want;
      }
    }
    if (row.status !== status) out.push({ action: "set_sheet_status", variantId: v.id, before: row.status, after: status, why: "API owns status" });
  }
  for (const id of byId.keys()) out.push({ action: "orphan", variantId: id, why: "missing from API (restart?), row kept" });
  return out;
}

export type Result = { dryRun: boolean; counts: Record<string, number>; changes: Change[]; errors: { variantId: string; action: string; error: string }[] };

export async function sync(sheet: Sheet, api: Api, dryRun = false): Promise<Result> {
  const variants = await api.listVariants();
  const changes = plan(await sheet.rows(), variants);
  const names = new Map(variants.map((v) => [v.id, v.name]));
  const errors: Result["errors"] = [];
  const failed = new Set<string>();
  if (!dryRun) {
    // Sequential on purpose: a sheet API rate-limits hard, and order keeps the report readable.
    for (const c of changes) {
      if (failed.has(c.variantId)) continue; // do not mirror a status the API never took
      try {
        if (c.action === "add_row") {
          await sheet.append({ variant_id: c.variantId, name: names.get(c.variantId) ?? "", status: c.after, product: "", brand: "", design: "", legal: "" });
        } else if (c.action === "set_status") await api.patchStatus(c.variantId, c.after); // a set, not a toggle
        else if (c.action === "set_sheet_status") await sheet.update(c.variantId, "status", c.after);
      } catch (e) {
        errors.push({ variantId: c.variantId, action: c.action, error: e instanceof Error ? e.message : String(e) });
        failed.add(c.variantId);
      }
    }
  }
  const counts: Record<string, number> = {};
  for (const c of changes) counts[c.action] = (counts[c.action] ?? 0) + 1;
  return { dryRun, counts, changes, errors };
}

export function report(r: Result): string {
  const body = Object.entries(r.counts).sort().map(([k, v]) => `${k} ${v}`).join(", ") || "in sync";
  const lines = [(r.dryRun ? "DRY RUN " : "") + body];
  for (const c of r.changes) {
    const move = "after" in c ? ` ${"before" in c ? c.before : "none"} -> ${c.after}` : "";
    lines.push(`  ${c.action} ${c.variantId}:${move} (${c.why})`);
  }
  for (const e of r.errors) lines.push(`  ERROR ${e.action} ${e.variantId}: ${e.error}`);
  return lines.join("\n");
}

// Fakes for both sides. The real ones are a Google Sheets client and the Coframe variants API.
export class FakeSheet implements Sheet {
  data: Row[];
  writes = 0;
  constructor(rows: Row[] = []) {
    this.data = rows.map((r) => ({ ...r }));
  }
  async rows() {
    return this.data.map((r) => ({ ...r }));
  }
  async append(row: Row) {
    this.data.push({ ...row });
    this.writes++;
  }
  async update(id: string, col: string, value: string) {
    const r = this.data.find((x) => x.variant_id === id);
    if (!r) throw new Error(`no row ${id}`);
    (r as Record<string, string>)[col] = value;
    this.writes++;
  }
}

export class FakeApi implements Api {
  seed: Variant[];
  v = new Map<string, Variant>();
  failIds = new Set<string>();
  writes = 0;
  constructor(seed: Variant[]) {
    this.seed = seed.map((x) => ({ ...x }));
    this.restart();
  }
  restart() {
    // The mock API resets state on restart: every write since boot is gone.
    this.v = new Map(this.seed.map((x) => [x.id, { ...x }]));
  }
  async listVariants() {
    return [...this.v.values()].map((x) => ({ ...x }));
  }
  async patchStatus(id: string, status: Status) {
    if (this.failIds.has(id)) throw new Error("503");
    const x = this.v.get(id);
    if (!x) throw new Error("404");
    x.status = status;
    this.writes++;
  }
}
