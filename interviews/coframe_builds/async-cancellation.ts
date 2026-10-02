// Exercise: cancellation in JS is a signal you pass down: AbortController, AbortSignal.timeout, AbortSignal.any, and reading the reason.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-cancellation.test.ts
import { setTimeout as sleep } from "node:timers/promises";

// One deadline plus the caller's stop button, flowing into every awaited call.
export async function callModel(ms: number, user: AbortSignal, deadlineMs: number): Promise<string> {
  const signal = AbortSignal.any([user, AbortSignal.timeout(deadlineMs)]);
  try {
    await sleep(ms, undefined, { signal }); // stands in for fetch(url, { signal })
    return "ok";
  } catch (e) {
    if (!signal.aborted) throw e;
    const r = signal.reason; // the source signal's reason: a TimeoutError, or what the user passed
    return r instanceof DOMException && r.name === "TimeoutError" ? "timed out" : `stopped: ${(r as Error).message}`;
  }
}

// A loop that does its own work must check the signal itself: cancellation is cooperative.
export async function steps(n: number, signal: AbortSignal, log: string[]): Promise<void> {
  for (let i = 0; i < n; i++) {
    signal.throwIfAborted();
    log.push(`step ${i}`);
    await sleep(5);
  }
}

// Promise.race against a timer gives up waiting; the work itself carries on.
export async function raceTimeout(log: string[]): Promise<string> {
  const slow = sleep(30).then(() => log.push("slow work finished"));
  const timer = sleep(5).then(() => "timeout");
  const r = await Promise.race([slow.then(() => "done"), timer]);
  await slow;
  return r;
}
