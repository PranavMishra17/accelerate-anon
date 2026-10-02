// Exercise: retry with full jitter and an abortable sleep; parse an SSE body with for await, and stop the upstream on break.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-retries-streaming.test.ts
import { setTimeout as sleep } from "node:timers/promises";

export interface RetryOpts {
  retries: number;
  baseMs: number;
  maxMs: number;
  signal?: AbortSignal;
  shouldRetry?: (e: unknown) => boolean;
  random?: () => number;
}

export async function retry<T>(fn: (attempt: number) => Promise<T>, o: RetryOpts): Promise<T> {
  const rand = o.random ?? Math.random;
  for (let attempt = 0; ; attempt++) {
    o.signal?.throwIfAborted();
    try {
      return await fn(attempt); // return await, so the catch below sees the rejection
    } catch (e) {
      if (attempt >= o.retries || (o.shouldRetry && !o.shouldRetry(e))) throw e;
      const cap = Math.min(o.maxMs, o.baseMs * 2 ** attempt);
      await sleep(rand() * cap, undefined, { signal: o.signal }); // full jitter, and Stop still works mid-wait
    }
  }
}

// Yield each event's data until [DONE]. Frames end at a blank line; several data lines join with a newline.
export async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  let buf = "";
  let data: string[] = [];
  for await (const chunk of body.pipeThrough(new TextDecoderStream())) {
    buf += chunk;
    let i: number;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).replace(/\r$/, "");
      buf = buf.slice(i + 1);
      if (line === "") {
        if (data.length) {
          const d = data.join("\n");
          data = [];
          if (d === "[DONE]") return;
          yield d;
        }
      } else if (line.startsWith("data:")) {
        data.push(line.slice(5).replace(/^ /, ""));
      } // ":" lines are heartbeats
    }
  }
}
