# Test for async-backpressure.py: plain asserts.
# Run: python interviews/coframe_builds/async-backpressure_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-backpressure.py")
_s = importlib.util.spec_from_file_location("async_backpressure", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)


async def double(x):
    await asyncio.sleep(0.005)
    return x * 2


async def main():
    out, peak = await m.bounded_map(range(20), double, 3)
    assert out == [x * 2 for x in range(20)] and peak == 3

    got, peak, events = await m.pipeline(6, 2)
    assert got == list(range(6)) and peak <= 2
    assert events.index("put 5") > events.index("got 2")  # the last put had to wait for the consumer


asyncio.run(main())
print("ok")
