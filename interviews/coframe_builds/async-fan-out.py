# Exercise: who gets cancelled when one child fails: gather (nobody), TaskGroup (the siblings), wait (nobody, you clean up).
# Run its test: python interviews/coframe_builds/async-fan-out_test.py
import asyncio


async def child(n: float, log: list[str], fail: bool = False) -> float:
    try:
        await asyncio.sleep(n)
        if fail:
            raise ValueError(f"boom {n}")
        log.append(f"done {n}")
        return n
    except asyncio.CancelledError:
        log.append(f"cancelled {n}")
        raise


async def with_gather() -> tuple[str, list[str], bool]:
    log: list[str] = []
    slow = asyncio.ensure_future(child(0.1, log))
    try:
        await asyncio.gather(child(0.01, log, fail=True), slow)
    except ValueError as e:
        err = str(e)
    still_running = not slow.done()  # gather raised, but did not cancel its sibling
    await slow
    return err, log, still_running


async def with_gather_settled() -> list[object]:
    log: list[str] = []
    return await asyncio.gather(child(0.01, log, fail=True), child(0.02, log), return_exceptions=True)


async def with_taskgroup() -> tuple[list[str], list[str]]:
    log: list[str] = []
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(child(0.01, log, fail=True))
            tg.create_task(child(5, log))
    except* ValueError as eg:
        errs = [str(e) for e in eg.exceptions]
    return errs, log


async def with_wait() -> tuple[float, int, list[str]]:
    log: list[str] = []
    ts = [asyncio.create_task(child(d, log)) for d in (0.01, 5)]
    done, pending = await asyncio.wait(ts, return_when=asyncio.FIRST_COMPLETED)
    n_pending = len(pending)
    for p in pending:
        p.cancel()  # wait() never cancels for you
    await asyncio.gather(*pending, return_exceptions=True)
    return done.pop().result(), n_pending, log
