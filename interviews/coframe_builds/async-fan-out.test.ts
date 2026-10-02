// Test for async-fan-out.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-fan-out.test.ts
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import { all, allOrAbort, any, raceVsAny, settled } from "./async-fan-out.ts";

let log: string[] = [];
assert.equal(await all(log), "boom 5");
assert.deepEqual(log, []); // the slow one has not finished yet...
await sleep(40);
assert.deepEqual(log, ["done 30"]); // ...but it was never stopped

log = [];
assert.equal(await allOrAbort(log), "boom 5");
assert.deepEqual(log, ["aborted 30"]); // stopped, and awaited before we returned

assert.deepEqual(await settled(), ["fulfilled", "rejected"]);
assert.equal(await any(), "AggregateError 2");
assert.deepEqual(await raceVsAny(), ["boom 1", 10]);
console.log("ok");
