# Exercise: a coroutine is lazy (nothing runs until it is awaited or made a task); sequential awaits add up, a TaskGroup overlaps.
# Run its test: python interviews/coframe_builds/async-coroutines-promises_test.py
import asyncio
import time


async def call(name: str, log: list[str], delay: float = 0.05) -> str:
    log.append(f"start {name}")
    await asyncio.sleep(delay)
    return name


def lazy() -> list[str]:
    log: list[str] = []
    c = call("x", log)  # creates a coroutine object; the body has not started
    seen = list(log)
    c.close()
    return seen


async def sequential(log: list[str]) -> tuple[list[str], float]:
    t0 = time.perf_counter()
    out = [await call("a", log), await call("b", log)]  # b starts only after a finishes
    return out, time.perf_counter() - t0


async def concurrent(log: list[str]) -> tuple[list[str], float]:
    t0 = time.perf_counter()
    async with asyncio.TaskGroup() as tg:
        ta = tg.create_task(call("a", log))
        tb = tg.create_task(call("b", log))
    return [ta.result(), tb.result()], time.perf_counter() - t0


_background: set[asyncio.Task] = set()


def fire_and_forget(coro) -> asyncio.Task:
    # The loop keeps only a weak reference to a task: hold a strong one until it is done.
    t = asyncio.create_task(coro)
    _background.add(t)
    t.add_done_callback(_background.discard)
    return t
