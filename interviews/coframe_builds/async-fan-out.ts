// Exercise: Promise.all, allSettled, race and any cancel nothing; a shared AbortController is how the losers stop.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-fan-out.test.ts
import { setTimeout as sleep } from "node:timers/promises";

export function work(ms: number, log: string[], fail = false, signal?: AbortSignal): Promise<number> {
  return sleep(ms, undefined, { signal }).then(
    () => {
      if (fail) throw new Error(`boom ${ms}`);
      log.push(`done ${ms}`);
      return ms;
    },
    (e: unknown) => {
      log.push(`aborted ${ms}`);
      throw e;
    },
  );
}

// Promise.all rejects on the first rejection; the other promise keeps running.
export async function all(log: string[]): Promise<string> {
  try {
    await Promise.all([work(5, log, true), work(30, log)]);
    return "fulfilled";
  } catch (e) {
    return (e as Error).message;
  }
}

// Fail fast and actually stop the rest: one signal for the group, aborted on the first failure.
export async function allOrAbort(log: string[]): Promise<string> {
  const ac = new AbortController();
  const tasks = [work(5, log, true, ac.signal), work(30, log, false, ac.signal)].map((p) =>
    p.catch((e: unknown) => {
      ac.abort(e);
      throw e;
    }),
  );
  const settled = await Promise.allSettled(tasks); // wait for every child before leaving
  const first = settled.find((s) => s.status === "rejected");
  return first ? (ac.signal.reason as Error).message : "fulfilled";
}

export async function settled(): Promise<string[]> {
  const r = await Promise.allSettled([work(1, []), work(1, [], true)]);
  return r.map((s) => s.status);
}

export async function any(): Promise<string> {
  try {
    await Promise.any([work(1, [], true), work(2, [], true)]);
    return "fulfilled";
  } catch (e) {
    return e instanceof AggregateError ? `AggregateError ${e.errors.length}` : "other";
  }
}

// race: first to settle wins, rejection included. any: first to fulfil wins.
export async function raceVsAny(): Promise<[string, number]> {
  const r = await Promise.race([work(1, [], true), work(10, [])]).catch((e: Error) => e.message);
  const a = await Promise.any([work(1, [], true), work(10, [])]);
  return [String(r), a];
}
