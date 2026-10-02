// Test for async-blocking.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-blocking.test.ts
import assert from "node:assert/strict";
import { spinInWorker, timerLateness } from "./async-blocking.ts";

const late = await timerLateness(100);
assert.ok(late >= 95, String(late)); // the 0 ms timer waited for the whole busy loop

let ticks = 0;
const iv = setInterval(() => ticks++, 10);
assert.equal(await spinInWorker(150), 150);
clearInterval(iv);
assert.ok(ticks >= 5, String(ticks)); // the main thread kept running timers
console.log("ok");
