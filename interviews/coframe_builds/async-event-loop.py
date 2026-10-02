# Exercise: what runs when on one asyncio loop (a coroutine call, call_soon, create_task, await, eager tasks).
# Run its test: python interviews/coframe_builds/async-event-loop_test.py
import asyncio


async def order(eager: bool = False) -> list[str]:
    log: list[str] = []
    loop = asyncio.get_running_loop()
    if eager:
        loop.set_task_factory(asyncio.eager_task_factory)  # 3.12: run a new task until its first suspension

    async def child(name: str) -> None:
        log.append(f"{name} start")
        await asyncio.sleep(0)  # one trip round the loop
        log.append(f"{name} resumed")

    coro = child("never")  # a coroutine object: its body has not run
    coro.close()  # close it, or Python warns "coroutine was never awaited"
    loop.call_soon(log.append, "call_soon")
    t = asyncio.create_task(child("task"))  # scheduled for the next iteration, not started (unless eager)
    log.append("sync")
    await child("awaited")  # awaiting a coroutine runs it inline, in this task, with no loop trip
    await t
    loop.set_task_factory(None)
    return log
