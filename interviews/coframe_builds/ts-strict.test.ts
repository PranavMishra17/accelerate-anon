// Tests for ts-strict.ts: each unsound-but-compiling line fails at runtime; absent vs undefined differ.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-strict.test.ts
import assert from "node:assert/strict";
import { Animal, animalMethod, covariantArrays, narrowingAcrossCalls } from "./ts-strict.ts";

assert.throws(() => animalMethod.handle(new Animal()), TypeError);   // d.bark is not a function
assert.throws(() => covariantArrays(), TypeError);
assert.throws(() => narrowingAcrossCalls(), TypeError);              // null.length

// Why exactOptionalPropertyTypes exists: an explicit undefined is a present key.
const explicit = { title: undefined };
assert.equal("title" in explicit, true);
assert.equal(JSON.stringify(explicit), "{}");                         // JSON drops it
assert.equal(JSON.stringify({ title: null }), '{"title":null}');     // null is kept
console.log("ts-strict: ok");
