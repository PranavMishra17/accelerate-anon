// Tests for ts-boundary.ts: defaults, stripping, readable errors back to the model, thrown non-Errors handled.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-boundary.test.ts
import assert from "node:assert/strict";
import { parseSearchArgs, runSearchTool } from "./ts-boundary.ts";

assert.deepEqual(parseSearchArgs({ query: "q", extra: true }), { ok: true, value: { query: "q", limit: 10 } });
assert.deepEqual(parseSearchArgs({ query: "q", limit: 999 }), { ok: false, error: "limit: expected an integer from 1 to 50" });
assert.equal(parseSearchArgs([]).ok, false);
assert.equal(parseSearchArgs(null).ok, false);

const echo = async (a: { query: string; limit: number }) => `${a.query}:${a.limit}`;
assert.deepEqual(await runSearchTool("t1", { query: "evals", limit: 3 }, echo),
  { type: "tool_result", tool_use_id: "t1", content: "evals:3" });

const bad = await runSearchTool("t2", { query: "" }, echo);
assert.equal(bad.is_error, true);
assert.match(bad.content, /query: expected a non-empty string/);

const throwsString = async () => { throw "quota exceeded"; };
const failed = await runSearchTool("t3", { query: "x" }, throwsString);
assert.deepEqual(failed, { type: "tool_result", tool_use_id: "t3", content: "quota exceeded", is_error: true });
console.log("ts-boundary: ok");
