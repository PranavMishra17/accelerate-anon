// Test for async-structured.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-structured.test.ts
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import { scope } from "./async-structured.ts";

function tool(ms: number, log: string[], fail = false) {
  return async (signal: AbortSignal) => {
    try {
      await sleep(ms, undefined, { signal });
    } catch (e) {
      log.push(`tool ${ms} aborted`);
      throw e;
    }
    if (fail) throw new Error(`tool ${ms} failed`);
    log.push(`tool ${ms} done`);
    return ms;
  };
}

// All succeed: the scope returns the body's result.
let log: string[] = [];
const sum = await scope(async (spawn) => {
  const [a, b] = await Promise.all([spawn(tool(5, log)), spawn(tool(10, log))]);
  return a + b;
});
assert.equal(sum, 15);

// One fails: the sibling is aborted and has finished before scope rejects.
log = [];
await assert.rejects(
  scope(async (spawn, signal) => {
    spawn(tool(5, log, true));
    spawn(tool(1000, log));
    await sleep(2000, undefined, { signal }); // the body is waiting too; it is aborted with the rest
  }),
  /tool 5 failed/,
);
assert.deepEqual(log, ["tool 1000 aborted"]);

// The caller presses Stop: every child stops, and the scope rejects with the caller's reason.
log = [];
const user = new AbortController();
setTimeout(() => user.abort(new Error("user pressed stop")), 5);
await assert.rejects(
  scope(async (spawn) => {
    await Promise.all([spawn(tool(1000, log)), spawn(tool(1000, log))]);
  }, user.signal),
  /user pressed stop/,
);
assert.deepEqual(log, ["tool 1000 aborted", "tool 1000 aborted"]);
console.log("ok");
