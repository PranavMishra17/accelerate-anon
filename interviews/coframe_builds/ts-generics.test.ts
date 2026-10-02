// Tests for ts-generics.ts: dispatch parses untrusted args, applies defaults, rejects junk and unknown names.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-generics.test.ts
import assert from "node:assert/strict";
import { dispatch, isToolName } from "./ts-generics.ts";

assert.equal(await dispatch("search", { query: "evals" }), "searched evals");
assert.equal(await dispatch("run_tests", { path: "src" }), "src watch=false");   // default applied
await assert.rejects(dispatch("search", { query: 42 }), /query must be a string/);

const fromModel: string = "delete_repo";
assert.equal(isToolName(fromModel), false);
assert.equal(isToolName("toString"), false);   // own keys only, not the prototype
assert.equal(isToolName("search"), true);
console.log("ts-generics: ok");
