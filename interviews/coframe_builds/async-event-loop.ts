// Exercise: what runs when on the JS event loop (sync code, microtasks, a timer, an async function body).
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-event-loop.test.ts

export async function order(): Promise<string[]> {
  const log: string[] = [];
  const done = new Promise<void>((r) => setTimeout(r, 5));
  setTimeout(() => log.push("timeout"), 0); // a macrotask: waits for every microtask
  Promise.resolve().then(() => log.push("then")); // a microtask, queued now
  queueMicrotask(() => log.push("microtask")); // a microtask, queued second
  async function af(): Promise<void> {
    log.push("af start"); // runs synchronously, at the call
    await null; // the rest is queued as a microtask, third
    log.push("af after await");
  }
  void af();
  log.push("sync");
  await done;
  return log;
}

// A promise is eager: the executor runs inside the constructor, before the caller continues.
export function eager(): string[] {
  const log: string[] = [];
  const p = new Promise<void>((resolve) => {
    log.push("executor");
    resolve();
  });
  log.push("after new Promise");
  void p;
  return log;
}
