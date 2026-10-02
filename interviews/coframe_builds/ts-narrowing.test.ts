// Tests for ts-narrowing.ts: exhaustive rendering, the runtime default branch, a lying guard.
// Run: node --experimental-strip-types interviews/coframe_builds/ts-narrowing.test.ts
import assert from "node:assert/strict";
import { render, isTextLoose, assertString, type Ev } from "./ts-narrowing.ts";

const events: Ev[] = [
  { type: "text", delta: "Hi" },
  { type: "tool_call", id: "t1", name: "search", args: { q: "x" } },
  { type: "done", reason: "length" },
];
assert.equal(events.map(render).join(""), "Hi[search] (cut off)");

// A newer server sends an event this build does not know: the never branch throws, loudly.
const fromWire = JSON.parse('{"type":"thinking","text":"..."}') as Ev;
assert.throws(() => render(fromWire), /unhandled event/);

// The guard passes an object with no delta, so a string-typed value is undefined at runtime.
const junk: unknown = { type: "text" };
if (isTextLoose(junk)) assert.equal(junk.delta, undefined);
else assert.fail("guard should have passed");

const v: unknown = "ok";
assertString(v);
assert.equal(v.toUpperCase(), "OK");
assert.throws(() => assertString(3), /expected a string/);
console.log("ts-narrowing: ok");
