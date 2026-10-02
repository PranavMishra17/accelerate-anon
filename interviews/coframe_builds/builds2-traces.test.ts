// Test for builds2-traces.ts: node:assert on a hand-built trace.
// Run: node --experimental-strip-types interviews/coframe_builds/builds2-traces.test.ts
import assert from "node:assert/strict";
import { analyse, build, report, type Span } from "./builds2-traces.ts";

const sp = (run_id: string, span_id: string, parent_id: string | null, name: string, kind: Span["kind"], start: number, end: number,
  extra: Partial<Span> = {}): Span => ({ run_id, span_id, parent_id, name, kind, start, end, tokens: 0, cost: 0, status: "ok", ...extra });

const SPANS: Span[] = [
  sp("r1", "a", null, "variant_run", "agent", 0, 10, { cost: 0.036, status: "error" }),
  sp("r1", "b", "a", "plan", "llm", 0, 1, { tokens: 1200, cost: 0.006 }),
  sp("r1", "c", "a", "fetch_page", "tool", 1, 3, { status: "error", error: "timeout after 2s" }),
  sp("r1", "d", "a", "lint", "tool", 1, 2),
  sp("r1", "e", "a", "fetch_page", "tool", 3, 5),
  sp("r1", "f", "a", "write_variant", "llm", 5, 9, { tokens: 3000, cost: 0.03 }),
  sp("r1", "g", "a", "run_tests", "tool", 9, 10, { status: "error", error: "2 failed: test_cta_visible" }),
  sp("r1", "b", "a", "plan", "llm", 0, 1, { tokens: 1200, cost: 0.006 }),
  sp("r2", "s0", null, "research", "agent", 0, 4),
  sp("r2", "s1", "s0", "subagent", "agent", 0, 4),
  sp("r2", "s2", "s1", "plan", "llm", 0, 1, { tokens: 500, cost: 0.002 }),
  sp("r2", "s3", "s1", "search_a", "tool", 1, 3, { cost: 0.001 }),
  sp("r2", "s4", "s1", "search_b", "tool", 1, 4, { cost: 0.001 }),
  sp("r3", "x0", null, "run", "agent", 0, 2),
  sp("r3", "x1", "ghost", "late_tool", "tool", 1, 2),
];

const runs = build(SPANS);
const r1 = analyse("r1", runs.get("r1")!);
assert.equal(r1.spans, 7);
assert.equal(r1.wall, 10);
assert.ok(Math.abs(r1.cost - 0.036) < 1e-9);
assert.equal(r1.tokens, 4200);
assert.deepEqual(r1.path.map((s) => s.span_id), ["b", "c", "e", "f", "g"]);
assert.deepEqual(r1.failures.map((f) => [f.span.span_id, f.recovered]), [["c", true], ["g", false]]);
assert.equal(r1.status, "error");

const r2 = analyse("r2", runs.get("r2")!);
assert.equal(r2.wall, 4);
assert.deepEqual(r2.path.map((s) => s.name), ["plan", "search_b"]);
assert.ok(Math.abs(r2.cost - 0.004) < 1e-9);

const r3 = analyse("r3", runs.get("r3")!);
assert.deepEqual(r3.orphans, ["x1"]);
assert.deepEqual(r3.path, []);

const text = report(SPANS);
console.log(text);
assert.ok(text.includes("run r1: error | wall 10.0s | cost $0.0360 | tokens 4,200 | 7 spans"));
assert.ok(text.includes("critical path: plan (llm 1.0s) > fetch_page (tool 2.0s) > fetch_page (tool 2.0s) > write_variant (llm 4.0s) > run_tests (tool 1.0s)"));
assert.ok(text.includes("failed tool: run_tests at +9.0s: 2 failed: test_cta_visible (NOT recovered)"));
assert.ok(text.includes("warning: 1 span(s) with a missing parent: x1"));
console.log("builds2-traces.ts: ok");
