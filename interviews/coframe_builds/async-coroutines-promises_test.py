# Test for async-coroutines-promises.py: plain asserts.
# Run: python interviews/coframe_builds/async-coroutines-promises_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-coroutines-promises.py")
_s = importlib.util.spec_from_file_location("async_coroutines_promises", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

assert m.lazy() == []  # calling an async def ran nothing


async def main():
    log = []
    out, t = await m.sequential(log)
    assert out == ["a", "b"] and t >= 0.095, t
    out, t = await m.concurrent(log)
    assert out == ["a", "b"] and t < 0.095, t

    seen = []
    t = m.fire_and_forget(m.call("bg", seen, 0.01))
    assert t in m._background
    await t
    assert t not in m._background and seen == ["start bg"]


asyncio.run(main())
print("ok")
