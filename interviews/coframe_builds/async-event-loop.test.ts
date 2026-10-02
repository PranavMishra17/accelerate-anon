// Test for async-event-loop.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-event-loop.test.ts
import assert from "node:assert/strict";
import { eager, order } from "./async-event-loop.ts";

assert.deepEqual(await order(), ["af start", "sync", "then", "microtask", "af after await", "timeout"]);
assert.deepEqual(eager(), ["executor", "after new Promise"]);
console.log("ok");
