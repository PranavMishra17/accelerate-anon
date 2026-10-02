# Test for async-cancellation.py: plain asserts.
# Run: python interviews/coframe_builds/async-cancellation_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-cancellation.py")
_s = importlib.util.spec_from_file_location("async_cancellation", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

assert issubclass(asyncio.CancelledError, BaseException) and not issubclass(asyncio.CancelledError, Exception)


async def main():
    cancelled, log = await m.cancel_cleanly()
    assert cancelled and log == ["save checkpoint", "release lease"]
    assert await m.timeout_fires() == "TimeoutError"
    assert await m.swallow_breaks_timeout() == "no timeout"
    cancelled, log = await m.shield_commit()
    assert cancelled and log == ["committed"]


asyncio.run(main())
print("ok")
