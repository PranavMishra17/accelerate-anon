# Test for async-event-loop.py: plain asserts.
# Run: python interviews/coframe_builds/async-event-loop_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-event-loop.py")
_s = importlib.util.spec_from_file_location("async_event_loop", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

# Default: the task only starts once the current task yields; the ready queue is FIFO.
assert asyncio.run(m.order()) == [
    "sync",
    "awaited start",
    "call_soon",
    "task start",
    "awaited resumed",
    "task resumed",
], asyncio.run(m.order())

# Eager task factory: create_task runs the body at once, up to the first real suspension.
assert asyncio.run(m.order(eager=True)) == [
    "task start",
    "sync",
    "awaited start",
    "call_soon",
    "task resumed",
    "awaited resumed",
], asyncio.run(m.order(eager=True))

print("ok")
