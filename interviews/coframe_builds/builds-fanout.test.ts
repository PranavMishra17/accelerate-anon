// Tests for builds-fanout.ts: a fake API and a fake clock; only the per-call and caller timeouts use real (tiny) time.
// Run: node --experimental-strip-types interviews/coframe_builds/builds-fanout.test.ts
import assert from "node:assert/strict";
import { fanOut, FatalError, RetryableError, TokenBucket, type Sleep } from "./builds-fanout.ts";

function clock() {
  const slept: number[] = [];
  const sleep: Sleep = async (ms) => { slept.push(Math.round(ms * 1000) / 1000); await Promise.resolve(); };
  return { slept, sleep, now: () => 0 };
}
const roomy = () => new TokenBucket(1e6, 1e6);
const hang = (signal: AbortSignal) => new Promise<never>((_, reject) =>
  signal.addEventListener("abort", () => reject(signal.reason), { once: true }));
const values = <R>(rs: { ok: boolean; value?: R }[]) => rs.map((r) => r.value);

// Concurrency is bounded.
{
  let inflight = 0, peak = 0;
  const work = async (x: number) => {
    inflight++; peak = Math.max(peak, inflight);
    for (let i = 0; i < 3; i++) await Promise.resolve();
    inflight--; return x * 2;
  };
  const rs = await fanOut([...Array(10).keys()], work, { limit: 3, bucket: roomy() });
  assert.deepEqual(values(rs), [...Array(10).keys()].map((x) => x * 2));
  assert.equal(peak, 3);
}

// Rate: burst 2, then one token per 200 ms at 5/s, booked in order.
{
  const c = clock();
  await fanOut([...Array(10).keys()], async (x) => x, { limit: 10, bucket: new TokenBucket(5, 2, c.now, c.sleep) });
  assert.deepEqual(c.slept, [200, 400, 600, 800, 1000, 1200, 1400, 1600]);
}

// Retryable twice then success; rand pinned to 1 shows the exponential ceiling.
{
  const c = clock(); let tries = 0;
  const flaky = async () => { if (++tries <= 2) throw new RetryableError("503"); return "ok"; };
  const rs = await fanOut(["a"], flaky, { limit: 1, bucket: roomy(), sleep: c.sleep, rand: () => 1 });
  assert.deepEqual(values(rs), ["ok"]);
  assert.deepEqual(c.slept, [500, 1000]);
}

// Jitter scales the ceiling, the cap holds, exhausting attempts returns the last error.
{
  const c = clock();
  const [r] = await fanOut(["a"], async () => { throw new RetryableError("503"); },
    { limit: 1, bucket: roomy(), attempts: 6, capMs: 2000, sleep: c.sleep, rand: () => 0.5 });
  assert.ok(!r.ok && r.error instanceof RetryableError);
  assert.deepEqual(c.slept, [250, 500, 1000, 1000, 1000]);
}

// Retry-After wins over the computed delay.
{
  const c = clock(); let tries = 0;
  const limited = async () => { if (++tries === 1) throw new RetryableError("429", 7000); return "ok"; };
  await fanOut(["a"], limited, { limit: 1, bucket: roomy(), sleep: c.sleep });
  assert.deepEqual(c.slept, [7000]);
}

// Fatal is never retried; one bad item does not sink the rest.
{
  const calls: string[] = [];
  const mixed = async (x: string) => { calls.push(x); if (x === "bad") throw new FatalError("400"); return x; };
  const rs = await fanOut(["a", "bad", "b"], mixed, { limit: 2, bucket: roomy() });
  assert.deepEqual([rs[0].ok, rs[1].ok, rs[2].ok], [true, false, true]);
  assert.equal(calls.filter((x) => x === "bad").length, 1);
}

// Per-call timeout: the first attempt hangs, the second answers.
{
  const c = clock(); let tries = 0;
  const hangsOnce = (_: string, signal: AbortSignal) => (++tries === 1 ? hang(signal) : Promise.resolve("ok"));
  const rs = await fanOut(["a"], hangsOnce, { limit: 1, bucket: roomy(), timeoutMs: 10, sleep: c.sleep });
  assert.deepEqual(values(rs), ["ok"]);
  assert.equal(c.slept.length, 1);
}

// The caller gives up: in-flight calls see the abort, queued items never start, the promise rejects.
{
  const started: number[] = [], aborted: number[] = [];
  const forever = (x: number, signal: AbortSignal) => {
    started.push(x);
    return hang(signal).catch((e) => { aborted.push(x); throw e; });
  };
  const user = new AbortController();
  setTimeout(() => user.abort(new Error("user left")), 20);
  await assert.rejects(fanOut([0, 1, 2, 3, 4], forever, { limit: 2, bucket: roomy(), signal: user.signal }), /user left/);
  await new Promise((r) => setTimeout(r, 5));                  // let queued items drain their slots
  assert.deepEqual(started, [0, 1]);
  assert.deepEqual(aborted.sort(), [0, 1]);
}

// A cancelled wait on the bucket gives its booking back.
{
  const b = new TokenBucket(1, 1, () => 0, (_ms, signal) => hang(signal!));
  await b.take();
  const ac = new AbortController();
  const waiting = b.take(ac.signal);
  assert.equal(b.tokens, -1);
  ac.abort();
  await assert.rejects(waiting);
  assert.equal(b.tokens, 0);
}
console.log("builds-fanout.ts: all tests passed");
