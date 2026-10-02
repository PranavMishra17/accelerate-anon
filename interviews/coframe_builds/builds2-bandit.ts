// Exercise: a variant assignment service: sticky hash bucketing, Thompson sampling (Beta via gamma variates), idempotent hourly batches, an incubation floor, fail to control.
// Run its test: node --experimental-strip-types interviews/coframe_builds/builds2-bandit.test.ts
import { createHash } from "node:crypto";

export const CONTROL = "control";

export type Arm = { a: number; b: number; bornHour: number };
export type State = {
  experiment: string;
  arms: Map<string, Arm>;
  holdout: number;
  incubationHours: number;
  floor: number;
  version: number;
  seen: Set<string>; // ponytail: grows forever; a unique event_id column in production
};
export type Event = { id: string; arm: string; converted: boolean };
export type Reason = "fallback" | "sticky" | "retired" | "holdout" | "thompson";

export function newState(experiment: string, arms: Record<string, [number, number]>): State {
  const m = new Map<string, Arm>();
  for (const [k, [a, b]] of Object.entries(arms)) m.set(k, { a, b, bornHour: 0 });
  return { experiment, arms: m, holdout: 0.1, incubationHours: 24, floor: 0.1, version: 0, seen: new Set() };
}

// Sync sha256 from node:crypto. At the edge (Workers) it is crypto.subtle.digest, which is async.
export function bucket(...parts: string[]): number {
  const h = createHash("sha256").update(parts.join(":")).digest();
  return h.readUInt32BE(0) / 2 ** 32;
}

// mulberry32: a small seeded PRNG, so a draw is reproducible. Math.random cannot be seeded.
export function rng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 2 ** 32;
  };
}

function normal(r: () => number): number {
  const u = 1 - r(); // (0, 1], so log is finite
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

// Marsaglia and Tsang (2000). For shape < 1, boost: Gamma(k) = Gamma(k + 1) * U^(1/k).
export function gamma(k: number, r: () => number): number {
  if (k < 1) return gamma(k + 1, r) * Math.pow(1 - r(), 1 / k);
  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do {
      x = normal(r);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = 1 - r();
    if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
  }
}

// Beta(a, b) = X / (X + Y) with X ~ Gamma(a), Y ~ Gamma(b).
export function beta(a: number, b: number, r: () => number): number {
  const x = gamma(a, r);
  return x / (x + gamma(b, r));
}

export function assign(visitor: string, state: State | null, sticky: Map<string, string>, hour: number): [string, Reason] {
  if (state === null) return [CONTROL, "fallback"]; // not sticky, not an exposure
  const first = sticky.get(visitor);
  if (first !== undefined) return state.arms.has(first) ? [first, "sticky"] : [CONTROL, "retired"];
  let out: [string, Reason];
  if (bucket(state.experiment, "holdout", visitor) < state.holdout) out = [CONTROL, "holdout"];
  else out = [draw(visitor, state, hour), "thompson"];
  sticky.set(visitor, out[0]);
  return out;
}

function draw(visitor: string, state: State, hour: number): string {
  const r = rng(Math.floor(bucket(state.experiment, String(state.version), visitor) * 2 ** 32));
  const names = [...state.arms.keys()].sort();
  const young = names.filter((k) => hour - state.arms.get(k)!.bornHour < state.incubationHours);
  const u = r();
  if (u < state.floor * young.length) return young[Math.floor(u / state.floor)];
  let best = names[0];
  let top = -1;
  for (const k of names) {
    const arm = state.arms.get(k)!;
    const s = beta(arm.a, arm.b, r);
    if (s > top) [best, top] = [k, s];
  }
  return best;
}

export function applyBatch(state: State, events: Event[]): { applied: number; duplicate: number; unknownArm: number } {
  const out = { applied: 0, duplicate: 0, unknownArm: 0 };
  for (const e of events) {
    if (state.seen.has(e.id)) {
      out.duplicate++;
      continue;
    }
    state.seen.add(e.id);
    const arm = state.arms.get(e.arm);
    if (!arm) {
      out.unknownArm++;
      continue;
    }
    if (e.converted) arm.a++;
    else arm.b++;
    out.applied++;
  }
  if (out.applied) state.version++;
  return out;
}

export function addArm(state: State, name: string, hour: number, prior: [number, number] = [1, 1]): void {
  state.arms.set(name, { a: prior[0], b: prior[1], bornHour: hour });
}

export function retireArm(state: State, name: string): void {
  if (name !== CONTROL) state.arms.delete(name);
}
