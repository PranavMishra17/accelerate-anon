# Exercise: parse a streamed server-sent-events response incrementally (chunks split anywhere, multi-line data, [DONE]), assemble text and tool-call deltas, and stop cleanly on timeout or user cancel.
# Run the test: python interviews/coframe_builds/builds-sse_test.py
import asyncio
import codecs
import contextlib
import json
import re
from dataclasses import dataclass, field

LINE_END = re.compile(r"\r\n|\r|\n")


@dataclass
class Event:
    event: str
    data: str
    id: str | None = None


class SSEParser:
    """Feed it bytes as they arrive; it returns the events completed so far."""

    def __init__(self):
        self.dec = codecs.getincrementaldecoder("utf-8")()   # holds half of a multi-byte character
        self.buf, self.data, self.event, self.last_id = "", [], "", None

    def feed(self, chunk: bytes) -> list[Event]:
        self.buf += self.dec.decode(chunk)
        out = []
        while m := LINE_END.search(self.buf):
            if m.group() == "\r" and m.end() == len(self.buf):
                break                                       # maybe the first half of \r\n: wait
            line, self.buf = self.buf[:m.start()], self.buf[m.end():]
            if ev := self._line(line):
                out.append(ev)
        return out

    def _line(self, line):
        if line == "":                                      # a blank line ends the event
            if not self.data:
                self.event = ""
                return None
            ev = Event(self.event or "message", "\n".join(self.data), self.last_id)
            self.data, self.event = [], ""
            return ev
        if line.startswith(":"):
            return None                                     # comment, often a keep-alive ping
        name, _, value = line.partition(":")
        value = value[1:] if value.startswith(" ") else value
        if name == "data":
            self.data.append(value)
        elif name == "event":
            self.event = value
        elif name == "id":
            self.last_id = value                            # resume point for Last-Event-ID
        return None


@dataclass
class Reply:
    text: str = ""
    calls: dict = field(default_factory=dict)              # index -> {id, name, args}
    status: str = "streaming"                               # done | truncated | timeout | cancelled

    def add(self, payload):
        """OpenAI-style chunk: choices[0].delta has content and/or tool_calls fragments."""
        delta = payload["choices"][0].get("delta", {})
        self.text += delta.get("content") or ""
        for tc in delta.get("tool_calls") or []:
            c = self.calls.setdefault(tc["index"], {"id": None, "name": "", "args": ""})
            c["id"] = tc.get("id") or c["id"]
            fn = tc.get("function") or {}
            c["name"] += fn.get("name") or ""
            c["args"] += fn.get("arguments") or ""         # JSON text arrives in pieces: parse only at the end

    def tool_calls(self):
        """Only a finished stream yields calls to execute; arguments must parse as a JSON object."""
        if self.status != "done":
            return []
        out = []
        for _, c in sorted(self.calls.items()):
            try:
                args = json.loads(c["args"] or "{}")
            except json.JSONDecodeError:
                args = None
            out.append({"id": c["id"], "name": c["name"], "args": args if isinstance(args, dict) else None})
        return out


async def consume(source, reply, *, deadline_s):
    """Read an async iterator of bytes into reply. A user cancel is task.cancel(): reply keeps the partial text."""
    parser = SSEParser()
    try:
        async with asyncio.timeout(deadline_s):
            # aclosing: leaving an async for early does NOT close an async generator in Python
            # (unlike JavaScript's for await); this closes the upstream on [DONE], error or cancel.
            async with contextlib.aclosing(source) as chunks:
                async for chunk in chunks:
                    for ev in parser.feed(chunk):
                        if ev.data == "[DONE]":
                            reply.status = "done"
                            return reply
                        reply.add(json.loads(ev.data))
        reply.status = "truncated"                          # the connection ended without [DONE]
    except TimeoutError:
        reply.status = "timeout"
    except asyncio.CancelledError:
        reply.status = "cancelled"
        raise                                               # never swallow a cancel
    return reply
