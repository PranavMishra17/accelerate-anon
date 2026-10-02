# Exercise: exception groups from a TaskGroup, except*, chaining and notes, and the return-in-finally trap.
# Run its test: python interviews/coframe_builds/python-errors_test.py
import asyncio
from contextlib import contextmanager


async def boom(exc):
    await asyncio.sleep(0)
    raise exc


async def run_tools():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(boom(ValueError("bad args")))
        tg.create_task(boom(TimeoutError("slow upstream")))


async def caller_wrong():
    try:
        await run_tools()
    except ValueError:  # never matches: the TaskGroup raises an ExceptionGroup
        return "caught"


async def caller_right():
    seen = []
    try:
        await run_tools()
    except* ValueError as eg:
        seen += [str(e) for e in eg.exceptions]
    except* TimeoutError as eg:
        seen += [str(e) for e in eg.exceptions]
    return sorted(seen)


def finally_wins():
    try:
        return "try"
    finally:
        return "finally"  # overrides the try's return (and would swallow an exception)


class ToolError(Exception):
    pass


def call_tool(run_id):
    try:
        {}["missing"]
    except KeyError as e:
        err = ToolError("lookup failed")
        err.add_note(f"run={run_id} step=3")
        raise err from e  # sets __cause__


@contextmanager
def tx(log):
    log.append("begin")
    try:
        yield
    except Exception:
        log.append("rollback")
        raise
    else:
        log.append("commit")
    finally:
        log.append("release")
