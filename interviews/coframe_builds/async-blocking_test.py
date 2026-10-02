# Test for async-blocking.py: plain asserts.
# Run: python interviews/coframe_builds/async-blocking_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-blocking.py")
_s = importlib.util.spec_from_file_location("async_blocking", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)


async def main():
    frozen = await m.ticks_during(blocking=True)
    free = await m.ticks_during(blocking=False)
    assert frozen == 0, frozen  # nothing else ran for 100 ms
    assert free >= 4, free
    assert await m.context_in_threads() == ("run-42", "-", "run-42")
    assert await m.child_sets_do_not_leak() == (("A", "B"), "parent")


asyncio.run(main())
print("ok")
