// Tests for ts-unknown.ts: any compiles and misbehaves, unknown makes you check.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-unknown.test.ts
import assert from "node:assert/strict";
import { toError, countFromAny, countFromUnknown } from "./ts-unknown.ts";

assert.ok(Number.isNaN(countFromAny("{}")));            // undefined + 1, silently NaN
assert.equal(countFromUnknown('{"count": 2}'), 3);
assert.throws(() => countFromUnknown("{}"), /count missing/);

try { throw "a string"; } catch (e) {
  assert.equal(e instanceof Error, false);
  assert.equal(toError(e).message, "a string");
}
const original = new TypeError("t");
assert.equal(toError(original), original);
console.log("ts-unknown: ok");
