// Test for builds2-bandit.ts: node:assert, seeded randomness.
// Run: node --experimental-strip-types interviews/coframe_builds/builds2-bandit.test.ts
import assert from "node:assert/strict";
import { addArm, applyBatch, assign, beta, bucket, newState, retireArm, rng, type State } from "./builds2-bandit.ts";

function shares(st: State, n: number, hour: number, prefix = "v"): Record<string, number> {
  const c: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const [arm] = assign(`${prefix}${i}`, st, new Map(), hour);
    c[arm] = (c[arm] ?? 0) + 1 / n;
  }
  return c;
}

// The beta sampler has the right mean: Beta(2, 8) has mean 0.2; Beta(0.5, 0.5) exercises shape < 1.
{
  const r = rng(42);
  let s = 0;
  for (let i = 0; i < 20000; i++) s += beta(2, 8, r);
  assert.ok(Math.abs(s / 20000 - 0.2) < 0.01);
  let t = 0;
  for (let i = 0; i < 20000; i++) t += beta(0.5, 0.5, r);
  assert.ok(Math.abs(t / 20000 - 0.5) < 0.02);
}

// Bucketing: stable, independent across experiments, holdout about 10%.
assert.equal(bucket("hero", "u1"), bucket("hero", "u1"));
assert.notEqual(bucket("hero", "u1"), bucket("other", "u1"));
{
  const st = newState("hero", { control: [1, 1], v1: [1, 1] });
  let h = 0;
  for (let i = 0; i < 20000; i++) if (assign(`h${i}`, st, new Map(), 100)[1] === "holdout") h++;
  assert.ok(h / 20000 > 0.09 && h / 20000 < 0.11);
}

// Sticky: posteriors move, the first assignment does not.
{
  const st = newState("hero", { control: [1, 1], v1: [1, 1] });
  const sticky = new Map<string, string>();
  const first = new Map<string, string>();
  for (let i = 0; i < 200; i++) first.set(`s${i}`, assign(`s${i}`, st, sticky, 100)[0]);
  applyBatch(st, Array.from({ length: 500 }, (_, i) => ({ id: `e${i}`, arm: "v1", converted: true })));
  for (const [v, arm] of first) assert.equal(assign(v, st, sticky, 101)[0], arm);
  assert.deepEqual(assign("r1", st, new Map(), 101), assign("r1", st, new Map(), 101));
}

// Replaying a batch is a no-op.
{
  const st = newState("hero", { control: [1, 1], v1: [1, 1] });
  const batch = Array.from({ length: 100 }, (_, i) => ({ id: `b${i}`, arm: "v1", converted: i % 10 === 0 }));
  assert.deepEqual(applyBatch(st, batch), { applied: 100, duplicate: 0, unknownArm: 0 });
  assert.deepEqual(applyBatch(st, batch), { applied: 0, duplicate: 100, unknownArm: 0 });
  const v1 = st.arms.get("v1")!;
  assert.deepEqual([v1.a, v1.b, st.version], [11, 91, 1]);
}

// Thompson favours the better arm; the incubation floor protects a young unlucky arm.
{
  const st = newState("hero", { control: [501, 9501], v1: [801, 9201] });
  assert.ok(shares(st, 5000, 100).v1 > 0.85);
  addArm(st, "v2", 100, [1, 61]);
  const young = shares(st, 5000, 110).v2 ?? 0;
  const old = shares(st, 5000, 130).v2 ?? 0;
  assert.ok(young > 0.07 && young < 0.13, String(young));
  assert.ok(old < 0.03, String(old));
}

// Fail to control; retired arm.
assert.deepEqual(assign("x", null, new Map([["x", "v1"]]), 100), ["control", "fallback"]);
{
  const st = newState("hero", { control: [1, 1], v1: [1, 1] });
  retireArm(st, "v1");
  assert.deepEqual(assign("x", st, new Map([["x", "v1"]]), 100), ["control", "retired"]);
}

// End to end: ten hourly batches against true rates, seeded.
{
  const r = rng(7);
  const truth: Record<string, number> = { control: 0.04, v1: 0.07 };
  const st = newState("hero", { control: [1, 1], v1: [1, 1] });
  let id = 0;
  for (let hour = 100; hour < 110; hour++) {
    const events = [];
    for (let i = 0; i < 2000; i++) {
      const [arm] = assign(`h${hour}-${i}`, st, new Map(), hour);
      events.push({ id: `ev${id++}`, arm, converted: r() < truth[arm] });
    }
    applyBatch(st, events);
  }
  assert.ok(shares(st, 2000, 110, "final").v1 > 0.7);
}

console.log("builds2-bandit.ts: ok");
