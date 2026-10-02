# Test for async-fan-out.py: plain asserts.
# Run: python interviews/coframe_builds/async-fan-out_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-fan-out.py")
_s = importlib.util.spec_from_file_location("async_fan_out", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)


async def main():
    err, log, still_running = await m.with_gather()
    assert err == "boom 0.01" and still_running and log == ["done 0.1"]

    out = await m.with_gather_settled()
    assert isinstance(out[0], ValueError) and out[1] == 0.02

    errs, log = await m.with_taskgroup()
    assert errs == ["boom 0.01"] and log == ["cancelled 5"]  # the sibling was cancelled, nothing leaked

    first, n_pending, log = await m.with_wait()
    assert first == 0.01 and n_pending == 1 and log == ["done 0.01", "cancelled 5"]


asyncio.run(main())
print("ok")
