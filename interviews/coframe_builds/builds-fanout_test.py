# Tests for builds-fanout.py: a fake API and a fake clock; only the per-call and caller timeouts use real (tiny) time.
# Run: python interviews/coframe_builds/builds-fanout_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("builds-fanout.py")
_spec = importlib.util.spec_from_file_location("fanout", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["fanout"] = m
_spec.loader.exec_module(m)


class Clock:
    """now() never moves; sleep() records what was asked for and yields once."""

    def __init__(self):
        self.slept = []

    def now(self):
        return 0.0

    async def sleep(self, d):
        self.slept.append(round(d, 6))
        await asyncio.sleep(0)


def roomy():
    return m.TokenBucket(rate=1000, burst=1000)


async def main():
    # Concurrency is bounded.
    inflight = peak = 0

    async def work(x):
        nonlocal inflight, peak
        inflight += 1
        peak = max(peak, inflight)
        for _ in range(3):
            await asyncio.sleep(0)
        inflight -= 1
        return x * 2

    assert await m.fan_out(range(10), work, limit=3, bucket=roomy()) == [x * 2 for x in range(10)]
    assert peak == 3

    # Rate: burst 2 then one token per 0.2 s at 5/s. Each wait is booked in order.
    c = Clock()

    async def instant(x):
        return x

    await m.fan_out(range(10), instant, limit=10, bucket=m.TokenBucket(5, 2, now=c.now, sleep=c.sleep))
    assert c.slept == [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6]

    # Retryable twice then success; full jitter with rand pinned to 1.0 shows the exponential ceiling.
    c = Clock()
    tries = {}

    async def flaky(x):
        tries[x] = tries.get(x, 0) + 1
        if tries[x] <= 2:
            raise m.Retryable("503")
        return "ok"

    assert await m.fan_out(["a"], flaky, limit=1, bucket=roomy(), sleep=c.sleep, rand=lambda: 1.0) == ["ok"]
    assert c.slept == [0.5, 1.0] and tries["a"] == 3

    # Jitter scales the ceiling; the cap holds; exhausting attempts returns the last error.
    c = Clock()

    async def down(x):
        raise m.Retryable("503")

    [r] = await m.fan_out(["a"], down, limit=1, bucket=roomy(), attempts=6, cap=2.0, sleep=c.sleep, rand=lambda: 0.5)
    assert isinstance(r, m.Retryable) and c.slept == [0.25, 0.5, 1.0, 1.0, 1.0]

    # Retry-After wins over the computed delay.
    c = Clock()
    tries.clear()

    async def limited(x):
        tries[x] = tries.get(x, 0) + 1
        if tries[x] == 1:
            raise m.Retryable("429", retry_after=7)
        return "ok"

    assert await m.fan_out(["a"], limited, limit=1, bucket=roomy(), sleep=c.sleep) == ["ok"] and c.slept == [7]

    # Fatal is never retried, and one bad item does not sink the others.
    calls = []

    async def mixed(x):
        calls.append(x)
        if x == "bad":
            raise m.Fatal("400")
        return x

    res = await m.fan_out(["a", "bad", "b"], mixed, limit=2, bucket=roomy())
    assert res[0] == "a" and res[2] == "b" and isinstance(res[1], m.Fatal) and calls.count("bad") == 1

    # Per-call timeout: the first attempt hangs, the second answers.
    c = Clock()
    tries.clear()

    async def hangs_once(x):
        tries[x] = tries.get(x, 0) + 1
        if tries[x] == 1:
            await asyncio.Event().wait()
        return "ok"

    assert await m.fan_out(["a"], hangs_once, limit=1, bucket=roomy(), timeout=0.01, sleep=c.sleep) == ["ok"]
    assert len(c.slept) == 1

    # The caller gives up: in-flight calls are cancelled, queued items never start.
    started, cancelled = [], []

    async def forever(x):
        started.append(x)
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            cancelled.append(x)
            raise

    try:
        async with asyncio.timeout(0.05):
            await m.fan_out(range(5), forever, limit=2, bucket=roomy())
        raise AssertionError("should have timed out")
    except TimeoutError:
        pass
    assert started == [0, 1] and sorted(cancelled) == [0, 1]

    # Same with an explicit cancel of the caller's task.
    started.clear(), cancelled.clear()
    task = asyncio.create_task(m.fan_out(range(5), forever, limit=2, bucket=roomy()))
    while len(started) < 2:                                # wait on state, not a timer: Windows timers are coarse
        await asyncio.sleep(0)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    assert started == [0, 1] and sorted(cancelled) == [0, 1]

    # A cancelled wait on the bucket gives its booking back.
    b = m.TokenBucket(1, 1, now=lambda: 0.0, sleep=lambda d: asyncio.Event().wait())
    await b.take()
    waiter = asyncio.create_task(b.take())
    await asyncio.sleep(0)
    assert b.tokens == -1
    waiter.cancel()
    try:
        await waiter
    except asyncio.CancelledError:
        pass
    assert b.tokens == 0
    print("builds-fanout: all tests passed")


asyncio.run(main())
