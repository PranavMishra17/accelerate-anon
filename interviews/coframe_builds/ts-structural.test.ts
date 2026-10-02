// Tests for ts-structural.ts: extra keys survive a Point-typed parameter at runtime.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-structural.test.ts
import assert from "node:assert/strict";
import { norm, serialise, exactPoint, keysOf } from "./ts-structural.ts";

const withSecret = { x: 3, y: 4, token: "s3cret" };
assert.equal(norm(withSecret), 5);                       // accepted: it has the shape
assert.match(serialise(withSecret), /s3cret/);           // the extra key leaks through
assert.deepEqual(exactPoint(withSecret), { x: 3, y: 4 }); // copying the declared keys drops it
assert.deepEqual(keysOf(withSecret), ["x", "y", "token"]);
console.log("ts-structural: ok");
