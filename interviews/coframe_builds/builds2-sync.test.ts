// Test for builds2-sync.ts: node:assert against fake sheet and fake API.
// Run: node --experimental-strip-types interviews/coframe_builds/builds2-sync.test.ts
import assert from "node:assert/strict";
import { decision, FakeApi, FakeSheet, report, sync, type Row, type Variant } from "./builds2-sync.ts";

const SEED: Variant[] = [
  { id: "v1", name: "Hero copy A", status: "ready_for_review" },
  { id: "v2", name: "Pricing table", status: "ready_for_review" },
  { id: "v3", name: "Old banner", status: "launched" },
];
const row = (id: string, status: string, product: string, brand: string, design: string, legal: string): Row =>
  ({ variant_id: id, name: id, status, product, brand, design, legal });
const statusOf = async (api: FakeApi) => Object.fromEntries((await api.listVariants()).map((v) => [v.id, v.status]));
const sheetStatus = async (s: FakeSheet, id: string) => (await s.rows()).find((r) => r.variant_id === id)?.status;

assert.equal(decision(row("x", "", "Yes", "Yes", "Skip", "Yes")), "approved");
assert.equal(decision(row("x", "", "Yes", "No", "Yes", "Yes")), "need_fixes");
assert.equal(decision(row("x", "", "Yes", "", "Yes", "Yes")), null);
assert.equal(decision(row("x", "", "Skip", "Skip", "Skip", "Skip")), null);

const api = new FakeApi(SEED);
const sheet = new FakeSheet([
  row("v1", "ready_for_review", "Yes", "Yes", "Skip", "Yes"),
  row("v3", "launched", "No", "Yes", "Yes", "Yes"),
  row("v9", "approved", "Yes", "Yes", "Yes", "Yes"),
]);

const expected = { add_row: 1, conflict: 1, orphan: 1, set_sheet_status: 1, set_status: 1 };
const dry = await sync(sheet, api, true);
assert.deepEqual(dry.counts, expected);
assert.equal(api.writes + sheet.writes, 0);
assert.ok(report(dry).startsWith("DRY RUN "));

const res = await sync(sheet, api);
assert.deepEqual(res.counts, expected);
assert.deepEqual(await statusOf(api), { v1: "approved", v2: "ready_for_review", v3: "launched" });
assert.equal(await sheetStatus(sheet, "v2"), "ready_for_review");
assert.equal(await sheetStatus(sheet, "v9"), "approved"); // orphan kept

const writes = api.writes + sheet.writes;
const again = await sync(sheet, api);
assert.equal(api.writes + sheet.writes, writes);
assert.deepEqual(Object.keys(again.counts).sort(), ["conflict", "orphan"]);

api.restart();
assert.equal((await statusOf(api)).v1, "ready_for_review");
const after = await sync(sheet, api);
assert.equal(after.counts.set_status, 1);
assert.equal((await statusOf(api)).v1, "approved");

await sheet.update("v2", "product", "Yes");
await sheet.update("v2", "brand", "No");
api.failIds.add("v2");
const bad = await sync(sheet, api);
assert.deepEqual(bad.errors.map((e) => e.variantId), ["v2"]);
assert.equal(await sheetStatus(sheet, "v2"), "ready_for_review");
api.failIds.clear();
const good = await sync(sheet, api);
assert.equal(good.errors.length, 0);
assert.equal((await statusOf(api)).v2, "need_fixes");
assert.equal(await sheetStatus(sheet, "v2"), "need_fixes");

console.log(report(good));
console.log("builds2-sync.ts: ok");
