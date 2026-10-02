# Tests for builds-sse.py: one recorded stream, cut at every chunk size, plus hang, cancel and truncation cases.
# Run: python interviews/coframe_builds/builds-sse_test.py
import asyncio
import importlib.util
import json
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("builds-sse.py")
_spec = importlib.util.spec_from_file_location("sse", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["sse"] = m
_spec.loader.exec_module(m)


def chunk(delta):
    return json.dumps({"choices": [{"delta": delta}]}, ensure_ascii=False)


STREAM = (
    ": keep-alive\n\n"
    "id: 1\ndata: " + chunk({"content": "Naïve café "}) + "\n\n"
    # one JSON payload over two data lines: joined with \n, which JSON reads as whitespace
    'data: {"choices": [{"delta":\ndata: {"content": "✓ ok"}}]}\n\n'
    "data: " + chunk({"tool_calls": [{"index": 0, "id": "call_1", "function": {"name": "search", "arguments": '{"q": "ole'}}]}) + "\n\n"
    "data: " + chunk({"tool_calls": [{"index": 0, "function": {"arguments": 'd 65"}'}}]}) + "\n\n"
    "data: [DONE]\n\n"
    "data: " + chunk({"content": "after done"}) + "\n\n"
).encode("utf-8")


class Source:
    """An async generator over byte chunks that records whether it was closed, and can hang at the end."""

    def __init__(self, data, size, hang=False):
        self.closed = False
        self.gen = self._run(data, size, hang)

    async def _run(self, data, size, hang):
        try:
            for i in range(0, len(data), size):
                yield data[i:i + size]
                await asyncio.sleep(0)
            if hang:
                await asyncio.Event().wait()
        finally:
            self.closed = True


async def main():
    # Every chunk size, including 1 byte (splits inside multi-byte UTF-8 and inside "\n\n").
    for size in range(1, 40):
        for data in (STREAM, STREAM.replace(b"\n", b"\r\n")):
            src = Source(data, size)
            r = await m.consume(src.gen, m.Reply(), deadline_s=5)
            assert r.status == "done", (size, r.status)
            assert r.text == "Naïve café ✓ ok", (size, r.text)
            assert r.tool_calls() == [{"id": "call_1", "name": "search", "args": {"q": "oled 65"}}]
            assert src.closed                               # [DONE] closed the upstream

    # Parser details: event names, ids, comments, a blank line with no data dispatches nothing.
    p = m.SSEParser()
    evs = p.feed(b"event: ping\n\n: hi\nevent: delta\nid: 7\ndata:a\ndata: b\n\n")
    assert [(e.event, e.data, e.id) for e in evs] == [("delta", "a\nb", "7")]
    assert p.feed(b"data: x\r") == [] and [e.data for e in p.feed(b"\n\r\n")] == ["x"]

    # Timeout: the partial text survives, no tool call is executable, the upstream is closed.
    cut = STREAM[:STREAM.index(b'd 65')]
    src = Source(cut, 16, hang=True)
    r = await m.consume(src.gen, m.Reply(), deadline_s=0.02)
    assert r.status == "timeout" and r.text.endswith("✓ ok") and r.tool_calls() == [] and src.closed

    # User cancel: the caller cancels the task; status says so, the cancel still propagates.
    src = Source(cut, 16, hang=True)
    reply = m.Reply()
    task = asyncio.create_task(m.consume(src.gen, reply, deadline_s=5))
    while not reply.text.endswith("ok"):                    # wait on state, not on a timer: Windows timers are coarse
        await asyncio.sleep(0)
    task.cancel()
    try:
        await task
        raise AssertionError("cancel was swallowed")
    except asyncio.CancelledError:
        pass
    assert reply.status == "cancelled" and src.closed

    # The server hung up without [DONE]: truncated, and half-arrived tool arguments are not run.
    src = Source(cut, 16)
    r = await m.consume(src.gen, m.Reply(), deadline_s=5)
    assert r.status == "truncated" and r.tool_calls() == [] and r.calls[0]["args"] == '{"q": "ole'

    # Finished but malformed arguments: surfaced as None for the caller to send back as an error.
    r = m.Reply(status="done")
    r.add({"choices": [{"delta": {"tool_calls": [{"index": 0, "id": "c", "function": {"name": "f", "arguments": "{oops"}}]}}]})
    assert r.tool_calls() == [{"id": "c", "name": "f", "args": None}]
    print("builds-sse: all tests passed")


asyncio.run(main())
