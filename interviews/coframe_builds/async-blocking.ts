// Exercise: CPU work on the main thread delays every timer and request; a worker thread keeps the loop free.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-blocking.test.ts
import { Worker } from "node:worker_threads";

function spin(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // stands in for parsing a huge trace or diffing big files
}

// How late does a 0 ms timer fire while the main thread is busy?
export function timerLateness(busyMs: number): Promise<number> {
  const t0 = performance.now();
  const p = new Promise<number>((r) => setTimeout(() => r(performance.now() - t0), 0));
  spin(busyMs);
  return p;
}

// The same CPU work in a worker thread: the main thread keeps ticking meanwhile.
export function spinInWorker(ms: number): Promise<number> {
  const src = `const { parentPort, workerData } = require("node:worker_threads");
const end = Date.now() + workerData; while (Date.now() < end) {}
parentPort.postMessage(workerData);`;
  return new Promise((resolve, reject) => {
    const w = new Worker(src, { eval: true, workerData: ms });
    w.once("message", resolve);
    w.once("error", reject);
  });
}
