// Exercise: from flat span events, build each run's tree; wall time, cost, tokens, the critical path, failing tool calls; a summary an agent can read to fix itself.
// Run its test: node --experimental-strip-types interviews/coframe_builds/builds2-traces.test.ts

export type Span = {
  run_id: string;
  span_id: string;
  parent_id: string | null;
  name: string;
  kind: "llm" | "tool" | "agent";
  start: number; // seconds
  end: number;
  tokens?: number;
  cost?: number;
  status: "ok" | "error";
  error?: string;
};
type Run = { spans: Map<string, Span>; kids: Map<string, Span[]>; roots: Span[]; orphans: string[] };
export type Failure = { span: Span; recovered: boolean };
export type Analysis = {
  runId: string;
  status: "ok" | "error";
  wall: number;
  cost: number;
  tokens: number;
  spans: number;
  path: Span[];
  failures: Failure[];
  orphans: string[];
  t0: number;
};

const isLeaf = (s: Span) => s.kind === "llm" || s.kind === "tool"; // a parent may carry a roll-up: never sum it

export function build(spans: Span[]): Map<string, Run> {
  const runs = new Map<string, Run>();
  for (const s of spans) {
    let run = runs.get(s.run_id);
    if (!run) runs.set(s.run_id, (run = { spans: new Map(), kids: new Map(), roots: [], orphans: [] }));
    if (!run.spans.has(s.span_id)) run.spans.set(s.span_id, s); // duplicate delivery: keep the first
  }
  for (const run of runs.values()) {
    for (const s of run.spans.values()) {
      if (s.parent_id === null) run.roots.push(s);
      else if (run.spans.has(s.parent_id)) {
        const k = run.kids.get(s.parent_id) ?? [];
        k.push(s);
        run.kids.set(s.parent_id, k);
      } else {
        run.roots.push(s); // parent dropped by sampling or still in flight
        run.orphans.push(s.span_id);
      }
    }
  }
  return runs;
}

// Walk back from the span's end: the child that finished last is what it waited for; repeat before its start.
export function criticalPath(span: Span, kids: Map<string, Span[]>): Span[] {
  const children = kids.get(span.span_id) ?? [];
  let t = Math.max(span.end, ...children.map((c) => c.end));
  const chosen: Span[] = [];
  for (const c of [...children].sort((x, y) => y.end - x.end)) {
    if (c.end <= t) {
      chosen.unshift(c);
      t = c.start;
    }
  }
  return [span, ...chosen.flatMap((c) => criticalPath(c, kids))];
}

export function analyse(runId: string, run: Run): Analysis {
  const spans = [...run.spans.values()];
  const root = run.roots.reduce((a, b) => (b.start < a.start ? b : a));
  const path = run.roots.length === 1 ? criticalPath(root, run.kids) : [];
  const failures: Failure[] = spans
    .filter((s) => s.kind === "tool" && s.status === "error")
    .map((s) => ({
      span: s,
      recovered: spans.some((o) => o.name === s.name && o.parent_id === s.parent_id && o.start >= s.end && o.status === "ok"),
    }))
    .sort((a, b) => a.span.start - b.span.start);
  const t0 = Math.min(...spans.map((s) => s.start));
  const failed = root.status === "error" || failures.some((f) => !f.recovered);
  return {
    runId,
    status: failed ? "error" : "ok",
    wall: Math.max(...spans.map((s) => s.end)) - t0, // not the sum: parallel calls overlap
    cost: spans.filter(isLeaf).reduce((n, s) => n + (s.cost ?? 0), 0),
    tokens: spans.filter((s) => s.kind === "llm").reduce((n, s) => n + (s.tokens ?? 0), 0),
    spans: spans.length,
    path: path.filter(isLeaf),
    failures,
    orphans: run.orphans,
    t0,
  };
}

// Compact on purpose: it goes into an agent's context, so every line must earn its tokens.
export function summary(a: Analysis): string {
  const lines = [
    `run ${a.runId}: ${a.status} | wall ${a.wall.toFixed(1)}s | cost $${a.cost.toFixed(4)} | tokens ${a.tokens.toLocaleString("en-US")} | ${a.spans} spans`,
    a.path.length
      ? "critical path: " + a.path.map((s) => `${s.name} (${s.kind} ${(s.end - s.start).toFixed(1)}s)`).join(" > ")
      : "critical path: unknown (several roots)",
  ];
  for (const { span: s, recovered } of a.failures) {
    lines.push(`failed tool: ${s.name} at +${(s.start - a.t0).toFixed(1)}s: ${s.error ?? "no message"} (${recovered ? "recovered by retry" : "NOT recovered"})`);
  }
  if (a.orphans.length) lines.push(`warning: ${a.orphans.length} span(s) with a missing parent: ${a.orphans.join(", ")}`);
  return lines.join("\n");
}

export function report(spans: Span[]): string {
  const runs = build(spans);
  return [...runs.keys()].sort().map((id) => summary(analyse(id, runs.get(id)!))).join("\n\n");
}
