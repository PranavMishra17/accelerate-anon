# Exercise: what the GIL does not protect (a shared counter), and keeping a blocking call off the event loop.
# Run its test: python interviews/coframe_builds/python-gil_test.py
import asyncio
import threading
import time


class Counter:
    def __init__(self):
        self.n = 0
        self._lock = threading.Lock()

    def incr_unsafe(self):
        self.n += 1  # read, add, store: a thread switch can land between them

    def incr(self):
        with self._lock:
            self.n += 1


def hammer(counter, threads=4, each=10_000):
    ts = [threading.Thread(target=lambda: [counter.incr() for _ in range(each)]) for _ in range(threads)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()
    return counter.n


def blocking_sdk_call(s):
    time.sleep(s)  # stands in for a sync SDK with no async API
    return s


async def fan_out_blocking(n, s):
    # to_thread runs each call in the default thread pool; the GIL is released while it sleeps
    return await asyncio.gather(*(asyncio.to_thread(blocking_sdk_call, s) for _ in range(n)))
