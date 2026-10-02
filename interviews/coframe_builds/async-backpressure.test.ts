// Test for async-backpressure.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-backpressure.test.ts
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import { counted, limiter, produce } from "./async-backpressure.ts";

const limit = limiter(3);
let inFlight = 0;
let peak = 0;
const out = await Promise.all(
  Array.from({ length: 20 }, (_, i) =>
    limit(async () => {
      peak = Math.max(peak, ++inFlight);
      await sleep(2);
      inFlight--;
      return i * 2;
    }),
  ),
);
assert.deepEqual(out, Array.from({ length: 20 }, (_, i) => i * 2));
assert.equal(peak, 3);

const log: string[] = [];
for await (const i of produce(log)) if (i === 2) break; // break calls return(): the generator stops
assert.deepEqual(log, ["made 0", "made 1", "made 2"]); // never ran ahead of the consumer

const { stream, pulls } = counted(2);
await sleep(0);
assert.equal(pulls(), 2); // filled to the highWaterMark, then stopped
const reader = stream.getReader();
await reader.read();
await sleep(0);
assert.equal(pulls(), 3); // one read made room for one more
await reader.cancel();
console.log("ok");
