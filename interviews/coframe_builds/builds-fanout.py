# Exercise: call a flaky, rate-limited model API for N items with bounded concurrency, a token bucket, retries with full jitter on retryable errors only, a per-call timeout, and cancellation of the rest when the caller gives up.
# Run the test: python interviews/coframe_builds/builds-fanout_test.py
import asyncio
import random
import time


class Retryable(Exception):
    """429, 5xx, a dropped connection. retry_after carries the server's Retry-After, in seconds."""

    def __init__(self, msg="", retry_after=None):
        super().__init__(msg)
        self.retry_after = retry_after


class Fatal(Exception):
    """400, 401, a schema error: retrying sends the same bad request again."""


class TokenBucket:
    """Reservation style: take() books a token now (tokens may go negative) and sleeps until it is due.
    No lock needed: the check and the booking happen with no await between them."""

    def __init__(self, rate, burst, now=time.monotonic, sleep=asyncio.sleep):
        self.rate, self.burst, self.tokens = rate, burst, float(burst)
        self.now, self.sleep, self.t = now, sleep, now()

    async def take(self):
        t = self.now()
        self.tokens = min(self.burst, self.tokens + (t - self.t) * self.rate)
        self.t = t
        self.tokens -= 1
        if self.tokens < 0:
            try:
                await self.sleep(-self.tokens / self.rate)
            except asyncio.CancelledError:
                self.tokens += 1                           # give the booking back
                raise


async def fan_out(items, call, *, limit, bucket, attempts=4, base=0.5, cap=8.0, timeout=30.0,
                  sleep=asyncio.sleep, rand=random.random):
    """Returns one result per item, in order: the value or the final exception. Cancelling the caller
    (or an outer asyncio.timeout) cancels every in-flight call and starts no new ones."""
    sem = asyncio.Semaphore(limit)

    async def one(item):
        for n in range(attempts):
            async with sem:                                # a slot only while calling, not while backing off
                await bucket.take()                        # every attempt spends rate, retries included
                try:
                    async with asyncio.timeout(timeout):
                        return await call(item)
                except (Retryable, TimeoutError) as e:     # an outer cancel arrives as CancelledError: not caught
                    err = e
                except Exception as e:
                    return e                               # Fatal and bugs: no retry
            if n == attempts - 1:
                return err
            ra = getattr(err, "retry_after", None)
            await sleep(ra if ra is not None else rand() * min(cap, base * 2 ** n))   # full jitter

    async with asyncio.TaskGroup() as tg:                  # siblings never outlive this block
        tasks = [tg.create_task(one(i)) for i in items]
    return [t.result() for t in tasks]
