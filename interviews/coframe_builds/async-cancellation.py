# Exercise: cooperative cancellation: clean up and re-raise, what swallowing CancelledError breaks, timeout(), shield().
# Run its test: python interviews/coframe_builds/async-cancellation_test.py
import asyncio


async def cancel_cleanly() -> tuple[bool, list[str]]:
    log: list[str] = []

    async def worker():
        try:
            await asyncio.sleep(10)
        except asyncio.CancelledError:
            log.append("save checkpoint")
            raise  # always re-raise
        finally:
            log.append("release lease")

    t = asyncio.create_task(worker())
    await asyncio.sleep(0)  # let it reach its await
    t.cancel()
    try:
        await t
    except asyncio.CancelledError:
        pass
    return t.cancelled(), log


async def timeout_fires() -> str:
    try:
        async with asyncio.timeout(0.02):
            await asyncio.sleep(1)
    except TimeoutError:  # the CancelledError became TimeoutError at the edge of the block
        return "TimeoutError"
    return "no timeout"


async def swallow_breaks_timeout() -> str:
    try:
        async with asyncio.timeout(0.02):
            try:
                await asyncio.sleep(1)
            except asyncio.CancelledError:
                pass  # the bug: the deadline is eaten
            await asyncio.sleep(0.01)  # carries on past the deadline
    except TimeoutError:
        return "TimeoutError"
    return "no timeout"


async def shield_commit() -> tuple[bool, list[str]]:
    log: list[str] = []

    async def commit():
        await asyncio.sleep(0.02)
        log.append("committed")

    inner = asyncio.create_task(commit())  # keep a reference to the inner task

    async def caller():
        await asyncio.shield(inner)

    c = asyncio.create_task(caller())
    await asyncio.sleep(0)
    c.cancel()  # the caller is cancelled, the commit carries on
    try:
        await c
    except asyncio.CancelledError:
        pass
    await inner  # someone must still await it
    return c.cancelled(), log
