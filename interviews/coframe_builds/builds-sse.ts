// Exercise: parse a streamed server-sent-events response incrementally (chunks split anywhere, multi-line data, [DONE]), assemble text and tool-call deltas, and stop cleanly on timeout or user cancel.
// Run the test: node --experimental-strip-types interviews/coframe_builds/builds-sse.test.ts

export type SSEEvent = { event: string; data: string; id?: string };

export class SSEParser {
  private dec = new TextDecoder();          // { stream: true } below holds half of a multi-byte character
  private buf = "";
  private data: string[] = [];
  private event = "";
  private lastId: string | undefined;

  feed(chunk: Uint8Array): SSEEvent[] {
    this.buf += this.dec.decode(chunk, { stream: true });
    const out: SSEEvent[] = [];
    const re = /\r\n|\r|\n/g;
    let start = 0;
    for (let m = re.exec(this.buf); m; m = re.exec(this.buf)) {
      if (m[0] === "\r" && re.lastIndex === this.buf.length) break;   // maybe half of \r\n: wait
      const ev = this.line(this.buf.slice(start, m.index));
      if (ev) out.push(ev);
      start = re.lastIndex;
    }
    this.buf = this.buf.slice(start);
    return out;
  }

  private line(line: string): SSEEvent | undefined {
    if (line === "") {                                   // a blank line ends the event
      if (this.data.length === 0) { this.event = ""; return undefined; }
      const ev: SSEEvent = { event: this.event || "message", data: this.data.join("\n"), id: this.lastId };
      this.data = []; this.event = "";
      return ev;
    }
    if (line.startsWith(":")) return undefined;          // comment, often a keep-alive ping
    const i = line.indexOf(":");
    const name = i < 0 ? line : line.slice(0, i);
    let value = i < 0 ? "" : line.slice(i + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (name === "data") this.data.push(value);
    else if (name === "event") this.event = value;
    else if (name === "id") this.lastId = value;         // resume point for Last-Event-ID
    return undefined;
  }
}

type Delta = { content?: string | null; tool_calls?: { index: number; id?: string; function?: { name?: string; arguments?: string } }[] };
export type ToolCall = { id: string | undefined; name: string; args: Record<string, unknown> | null };
export type Status = "streaming" | "done" | "truncated" | "timeout" | "cancelled";

export class Reply {
  text = "";
  calls = new Map<number, { id?: string; name: string; args: string }>();
  status: Status = "streaming";

  /** OpenAI-style chunk: choices[0].delta carries content and/or tool_calls fragments. */
  add(payload: { choices: { delta?: Delta }[] }): void {
    const delta = payload.choices[0]?.delta ?? {};
    this.text += delta.content ?? "";
    for (const tc of delta.tool_calls ?? []) {
      const c = this.calls.get(tc.index) ?? { name: "", args: "" };
      c.id = tc.id ?? c.id;
      c.name += tc.function?.name ?? "";
      c.args += tc.function?.arguments ?? "";            // JSON text in pieces: parse only at the end
      this.calls.set(tc.index, c);
    }
  }

  /** Only a finished stream yields calls to execute; arguments must parse as a JSON object. */
  toolCalls(): ToolCall[] {
    if (this.status !== "done") return [];
    return [...this.calls.entries()].sort(([a], [b]) => a - b).map(([, c]) => {
      let args: unknown = null;
      try { args = JSON.parse(c.args || "{}"); } catch { /* left null: send the error back to the model */ }
      const ok = typeof args === "object" && args !== null && !Array.isArray(args);
      return { id: c.id, name: c.name, args: ok ? (args as Record<string, unknown>) : null };
    });
  }
}

/** open(signal) is the fetch: it must honour the signal, so an abort rejects the pending read.
 *  The caller cancels with its own signal; the deadline is a ref'd timer joined to it. */
export async function consume(open: (signal: AbortSignal) => AsyncIterable<Uint8Array>, reply: Reply,
  o: { deadlineMs: number; signal?: AbortSignal }): Promise<Reply> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(new DOMException("stream deadline", "TimeoutError")), o.deadlineMs);
  const signal = o.signal ? AbortSignal.any([o.signal, ac.signal]) : ac.signal;
  const parser = new SSEParser();
  try {
    // break and return inside for await call the iterator's return(): the upstream closes on [DONE] too.
    for await (const chunk of open(signal)) {
      for (const ev of parser.feed(chunk)) {
        if (ev.data === "[DONE]") { reply.status = "done"; return reply; }
        reply.add(JSON.parse(ev.data));
      }
    }
    reply.status = "truncated";                          // the connection ended without [DONE]
  } catch (e) {
    if (!signal.aborted) throw e;                        // a real error (bad JSON, network): surface it
    reply.status = (signal.reason as Error)?.name === "TimeoutError" ? "timeout" : "cancelled";
  } finally {
    clearTimeout(timer);
  }
  return reply;
}
