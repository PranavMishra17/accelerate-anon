# Exercise: one blocking call stalls every task; to_thread keeps the loop free and copies contextvars, run_in_executor does not.
# Run its test: python interviews/coframe_builds/async-blocking_test.py
import asyncio
import contextvars
import time

run_id: contextvars.ContextVar[str] = contextvars.ContextVar("run_id", default="-")


async def ticks_during(blocking: bool) -> int:
    ticks = 0

    async def ticker():
        nonlocal ticks
        while True:
            await asyncio.sleep(0.01)
            ticks += 1

    t = asyncio.create_task(ticker())
    await asyncio.sleep(0)
    if blocking:
        time.sleep(0.1)  # a sync call inside async code: the loop is frozen
    else:
        await asyncio.to_thread(time.sleep, 0.1)  # a pool thread waits, the loop keeps running
    t.cancel()
    return ticks


async def context_in_threads() -> tuple[str, str, str]:
    run_id.set("run-42")
    loop = asyncio.get_running_loop()
    a = await asyncio.to_thread(run_id.get)  # context copied
    b = await loop.run_in_executor(None, run_id.get)  # context NOT copied
    c = await loop.run_in_executor(None, contextvars.copy_context().run, run_id.get)  # the fix
    return a, b, c


async def child_sets_do_not_leak() -> tuple[tuple[str, str], str]:
    run_id.set("parent")

    async def child(v):
        run_id.set(v)  # visible only inside this task's copy
        await asyncio.sleep(0)
        return run_id.get()

    async with asyncio.TaskGroup() as tg:
        a = tg.create_task(child("A"))
        b = tg.create_task(child("B"))
    return (a.result(), b.result()), run_id.get()
