# Test for async-retries-streaming.py: plain asserts.
# Run: python interviews/coframe_builds/async-retries-streaming_test.py
import asyncio
import importlib.util
import pathlib
import random
import sys

_p = pathlib.Path(__file__).with_name("async-retries-streaming.py")
_s = importlib.util.spec_from_file_location("async_retries_streaming", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

rng = random.Random(7)
for n in range(8):
    d = m.full_jitter(n, 0.5, 20.0, rng)
    assert 0 <= d <= min(20.0, 0.5 * 2**n)


def fake(responses):
    calls = []

    async def send():
        calls.append(1)
        r = responses[len(calls) - 1]
        if isinstance(r, Exception):
            raise r
        return r

    return send, calls


async def main():
    slept = []

    async def sleep(s):
        slept.append(s)

    send, calls = fake([ConnectionError(), m.Resp(429, {"retry-after": "3"}), m.Resp(200)])
    r = await m.with_retries(send, sleep=sleep, rng=random.Random(1))
    assert r.status == 200 and len(calls) == 3 and slept[1] == 3.0  # Retry-After honoured

    send, calls = fake([m.Resp(400), m.Resp(200)])
    assert (await m.with_retries(send, sleep=sleep)).status == 400 and len(calls) == 1  # never retry a 4xx

    send, calls = fake([m.Resp(503)] * 4)
    assert (await m.with_retries(send, sleep=sleep)).status == 503 and len(calls) == 4  # bounded

    closed = []

    async def upstream(lines, gap=0.0):
        try:
            for ln in lines:
                await asyncio.sleep(gap)
                yield ln
        finally:
            closed.append(True)  # where a real client returns the connection to the pool

    frames = [": ping", "", "data: hel", "data: lo", "", "data: world", "", "data: [DONE]", "", "data: never"]
    assert await m.read_stream(upstream(frames), total=1) == ["hel\nlo", "world"]
    assert closed == [True]

    closed.clear()
    try:
        await m.read_stream(upstream(["data: a", ""] * 50, gap=0.01), total=0.05)
        raise AssertionError("expected a timeout")
    except TimeoutError:
        pass
    assert closed == [True]  # the stalled stream was still closed


asyncio.run(main())
print("ok")
