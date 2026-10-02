# Test for python-gil.py: plain asserts.
# Run: python interviews/coframe_builds/python-gil_test.py
import asyncio
import importlib.util
import pathlib
import sys
import time

_p = pathlib.Path(__file__).with_name("python-gil.py")
_s = importlib.util.spec_from_file_location("python_gil", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

assert sys.getswitchinterval() == 0.005  # the running thread is asked to yield every 5 ms
assert m.hammer(m.Counter()) == 40_000  # with the lock, always exact

t0 = time.perf_counter()
out = asyncio.run(m.fan_out_blocking(4, 0.2))
elapsed = time.perf_counter() - t0
assert out == [0.2] * 4
assert elapsed < 0.6, elapsed  # overlapped, not 0.8 s in series
print("ok")
