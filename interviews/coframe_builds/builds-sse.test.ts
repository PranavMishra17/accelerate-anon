// Tests for builds-sse.ts: one recorded stream, cut at every chunk size, plus hang, cancel and truncation cases.
// Run: node --experimental-strip-types interviews/coframe_builds/builds-sse.test.ts
import assert from "node:assert/strict";
import { consume, Reply, SSEParser } from "./builds-sse.ts";

const chunk = (delta: object) => JSON.stringify({ choices: [{ delta }] });
const STREAM =
  ": keep-alive\n\n" +
  `id: 1\ndata: ${chunk({ content: "Naïve café " })}\n\n` +
  // one JSON payload over two data lines: joined with \n, which JSON reads as whitespace
  'data: {"choices": [{"delta":\ndata: {"content": "✓ ok"}}]}\n\n' +
  `data: ${chunk({ tool_calls: [{ index: 0, id: "call_1", function: { name: "search", arguments: '{"q": "ole' } }] })}\n\n` +
  `data: ${chunk({ tool_calls: [{ index: 0, function: { arguments: 'd 65"}' } }] })}\n\n` +
  "data: [DONE]\n\n" +
  `data: ${chunk({ content: "after done" })}\n\n`;
const enc = new TextEncoder();
const bytes = enc.encode(STREAM);

/** A fake fetch body: yields byte slices, can hang at the end, honours the signal, records closing. */
function source(data: Uint8Array, size: number, hang = false) {
  const state = { closed: false };
  async function* gen(signal: AbortSignal) {
    try {
      for (let i = 0; i < data.length; i += size) { yield data.slice(i, i + size); await Promise.resolve(); }
      if (hang) await new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }));
    } finally { state.closed = true; }
  }
  return { state, open: gen };
}

// Every chunk size, LF and CRLF: splits inside multi-byte UTF-8 and inside the blank line.
for (let size = 1; size < 40; size++) {
  for (const data of [bytes, enc.encode(STREAM.replaceAll("\n", "\r\n"))]) {
    const s = source(data, size);
    const r = await consume(s.open, new Reply(), { deadlineMs: 5000 });
    assert.equal(r.status, "done");
    assert.equal(r.text, "Naïve café ✓ ok");
    assert.deepEqual(r.toolCalls(), [{ id: "call_1", name: "search", args: { q: "oled 65" } }]);
    assert.ok(s.state.closed);                           // [DONE] closed the upstream
  }
}

// Parser details.
{
  const p = new SSEParser();
  const evs = p.feed(enc.encode("event: ping\n\n: hi\nevent: delta\nid: 7\ndata:a\ndata: b\n\n"));
  assert.deepEqual(evs, [{ event: "delta", data: "a\nb", id: "7" }]);
  assert.deepEqual(p.feed(enc.encode("data: x\r")), []);
  assert.deepEqual(p.feed(enc.encode("\n\r\n")).map((e) => e.data), ["x"]);
}

const cut = enc.encode(STREAM.slice(0, STREAM.indexOf("d 65")));       // stops inside the second tool delta

// Timeout: partial text kept, no executable tool call, upstream closed.
{
  const s = source(cut, 16, true);
  const r = await consume(s.open, new Reply(), { deadlineMs: 20 });
  assert.equal(r.status, "timeout");
  assert.ok(r.text.endsWith("✓ ok"));
  assert.deepEqual(r.toolCalls(), []);
  assert.ok(s.state.closed);
}

// User cancel.
{
  const s = source(cut, 16, true);
  const user = new AbortController();
  const reply = new Reply();
  const p = consume(s.open, reply, { deadlineMs: 5000, signal: user.signal });
  while (!reply.text.endsWith("ok")) await new Promise((r) => setImmediate(r));
  user.abort();
  assert.equal((await p).status, "cancelled");
  assert.ok(s.state.closed);
}

// Server hung up without [DONE]: truncated, half-arrived arguments not run.
{
  const s = source(cut, 16);
  const r = await consume(s.open, new Reply(), { deadlineMs: 5000 });
  assert.equal(r.status, "truncated");
  assert.deepEqual(r.toolCalls(), []);
  assert.equal(r.calls.get(0)?.args, '{"q": "ole');
}

// Finished but malformed arguments come back as null.
{
  const r = new Reply();
  r.add({ choices: [{ delta: { tool_calls: [{ index: 0, id: "c", function: { name: "f", arguments: "{oops" } }] } }] });
  r.status = "done";
  assert.deepEqual(r.toolCalls(), [{ id: "c", name: "f", args: null }]);
}
console.log("builds-sse.ts: all tests passed");
