// Tests for ts-satisfies.ts: brands are erased, as const does not freeze, as does not convert, readonly aliases.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-satisfies.test.ts
import assert from "node:assert/strict";
import { MODELS, TOOL_NAMES, isToolName, RunId, cancelRun, retriesPlusOne, readonlyAlias } from "./ts-satisfies.ts";

assert.equal(MODELS.heavy.maxTokens, 8192);

const id = RunId("run_ab12");
assert.equal(typeof id, "string");                 // the brand does not exist at runtime
assert.equal(cancelRun(id), "cancelled run_ab12");
assert.throws(() => RunId("ab12"), /not a run id/);

assert.equal(Object.isFrozen(TOOL_NAMES), false);  // as const is a compile-time claim
assert.equal(isToolName("fetch"), true);
assert.equal(isToolName("exec"), false);

assert.equal(retriesPlusOne('{"retries": "3"}'), "31"); // string concatenation, not 4
assert.equal(readonlyAlias(), 3);
console.log("ts-satisfies: ok");
