// Exercise: a promise is eager (the call starts the work); sequential awaits add up, Promise.all overlaps; forEach(async) waits for nothing.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-coroutines-promises.test.ts
import { setTimeout as sleep } from "node:timers/promises";

export async function call(name: string, log: string[], ms = 50): Promise<string> {
  log.push(`start ${name}`);
  await sleep(ms);
  return name;
}

export function eagerCall(): string[] {
  const log: string[] = [];
  const p = call("x", log); // the body already ran up to its first await
  const seen = [...log];
  void p;
  return seen;
}

export async function sequential(log: string[]): Promise<[string[], number]> {
  const t0 = performance.now();
  const out: string[] = [];
  for (const n of ["a", "b"]) out.push(await call(n, log));
  return [out, performance.now() - t0];
}

export async function parallel(log: string[]): Promise<[string[], number]> {
  const t0 = performance.now();
  const out = await Promise.all(["a", "b"].map((n) => call(n, log)));
  return [out, performance.now() - t0];
}

export function forEachAsync(): string[] {
  const done: string[] = [];
  ["a", "b"].forEach(async (n) => {
    await sleep(1);
    done.push(n);
  });
  return done; // returned before any callback finished
}
