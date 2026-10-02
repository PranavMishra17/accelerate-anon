// Test for async-cancellation.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-cancellation.test.ts
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import { callModel, raceTimeout, steps } from "./async-cancellation.ts";

assert.equal(await callModel(1, new AbortController().signal, 1000), "ok");
assert.equal(await callModel(1000, new AbortController().signal, 10), "timed out");

const user = new AbortController();
setTimeout(() => user.abort(new Error("user pressed stop")), 5);
assert.equal(await callModel(1000, user.signal, 1000), "stopped: user pressed stop");

const plain = new AbortController();
plain.abort();
assert.equal((plain.signal.reason as DOMException).name, "AbortError"); // abort() with no argument

const ac = new AbortController();
const log: string[] = [];
const run = steps(100, ac.signal, log);
await sleep(12);
ac.abort(new Error("stop"));
await assert.rejects(run, /stop/);
assert.ok(log.length >= 1 && log.length < 10, String(log.length));

const rlog: string[] = [];
assert.equal(await raceTimeout(rlog), "timeout");
assert.deepEqual(rlog, ["slow work finished"]);
console.log("ok");
