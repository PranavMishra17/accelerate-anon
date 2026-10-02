// Test for async-coroutines-promises.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-coroutines-promises.test.ts
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import { eagerCall, forEachAsync, parallel, sequential } from "./async-coroutines-promises.ts";

assert.deepEqual(eagerCall(), ["start x"]);

let [out, ms] = await sequential([]);
assert.deepEqual(out, ["a", "b"]);
assert.ok(ms >= 95, String(ms));

[out, ms] = await parallel([]);
assert.deepEqual(out, ["a", "b"]);
assert.ok(ms < 95, String(ms));

const done = forEachAsync();
assert.equal(done.length, 0);
await sleep(20);
assert.equal(done.length, 2); // they did finish, but nobody waited for them
console.log("ok");
