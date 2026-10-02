// Test for async-retries-streaming.ts: node:assert.
// Run: node --experimental-strip-types interviews/coframe_builds/async-retries-streaming.test.ts
import assert from "node:assert/strict";
import { retry, sseData } from "./async-retries-streaming.ts";

class HttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`http ${status}`);
    this.status = status;
  }
}
const retryable = (e: unknown) => e instanceof HttpError && [408, 429, 500, 502, 503, 504].includes(e.status);

let calls = 0;
const ok = await retry(
  async () => {
    if (++calls < 3) throw new HttpError(503);
    return "ok";
  },
  { retries: 4, baseMs: 1, maxMs: 5, shouldRetry: retryable },
);
assert.equal(ok, "ok");
assert.equal(calls, 3);

calls = 0;
await assert.rejects(
  retry(async () => { calls++; throw new HttpError(400); }, { retries: 4, baseMs: 1, maxMs: 5, shouldRetry: retryable }),
  /http 400/,
);
assert.equal(calls, 1); // a 400 will not get better

const ac = new AbortController();
setTimeout(() => ac.abort(new Error("stop")), 10);
await assert.rejects(
  retry(async () => { throw new HttpError(503); }, { retries: 10, baseMs: 1000, maxMs: 1000, random: () => 1, signal: ac.signal, shouldRetry: retryable }),
  (e: Error) => e.name === "AbortError" || /stop/.test(e.message), // aborted during the 1 s backoff, not after it
);

function body(text: string[], onCancel: () => void): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let i = 0;
  return new ReadableStream<Uint8Array>({
    pull(c) {
      if (i < text.length) c.enqueue(enc.encode(text[i++]));
      else c.close();
    },
    cancel: onCancel,
  });
}

const got: string[] = [];
for await (const d of sseData(body([": ping\n\ndata: hel", "\ndata: lo\n\n", "data: world\r\n\r\n", "data: [DONE]\n\n"], () => {}))) got.push(d);
assert.deepEqual(got, ["hel\nlo", "world"]);

let cancelled = false;
for await (const d of sseData(body(Array(100).fill("data: x\n\n"), () => { cancelled = true; }))) if (d === "x") break;
assert.equal(cancelled, true); // break returned the generator, which cancelled the body: stop paying for tokens
console.log("ok");
