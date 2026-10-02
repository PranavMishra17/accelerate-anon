# Exercise: bound concurrency with a Semaphore, and push slowness upstream with a bounded asyncio.Queue.
# Run its test: python interviews/coframe_builds/async-backpressure_test.py
import asyncio


async def bounded_map(items, fn, limit: int) -> tuple[list, int]:
    sem = asyncio.Semaphore(limit)
    in_flight = peak = 0

    async def one(x):
        nonlocal in_flight, peak
        async with sem:  # at most `limit` inside at once; the rest wait here
            in_flight += 1
            peak = max(peak, in_flight)
            try:
                return await fn(x)
            finally:
                in_flight -= 1

    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(one(x)) for x in items]
    return [t.result() for t in tasks], peak


async def pipeline(n: int, maxsize: int) -> tuple[list[int], int, list[str]]:
    q: asyncio.Queue[int | None] = asyncio.Queue(maxsize=maxsize)
    got: list[int] = []
    events: list[str] = []
    peak = 0

    async def producer():
        nonlocal peak
        for i in range(n):
            await q.put(i)  # waits while the queue is full: the producer slows to the consumer's pace
            events.append(f"put {i}")
            peak = max(peak, q.qsize())
        await q.put(None)  # sentinel; 3.13 adds q.shutdown()

    async def consumer():
        while (item := await q.get()) is not None:
            await asyncio.sleep(0.005)  # a slow sink: a database, a websocket
            got.append(item)
            events.append(f"got {item}")

    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())
    return got, peak, events
