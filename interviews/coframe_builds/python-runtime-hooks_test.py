# Test for python-runtime-hooks.py: plain asserts.
# Run: python interviews/coframe_builds/python-runtime-hooks_test.py
import asyncio
import inspect
import contextvars
import dataclasses
import importlib.util
import pathlib
import sys
import threading

_p = pathlib.Path(__file__).with_name("python-runtime-hooks.py")
_s = importlib.util.spec_from_file_location("python_runtime_hooks", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

# descriptors
c = m.Cfg(3)
assert c.retries == 3
try:
    m.Cfg(0)
    raise AssertionError
except ValueError:
    pass
c.__dict__["retries"] = 99
assert c.retries == 3  # data descriptor wins over the instance dict


class P:
    @property
    def x(self):
        return 1


p = P()
p.__dict__["x"] = 2
assert p.x == 1  # property is a data descriptor too

# __slots__
s = m.Span("llm")
assert not hasattr(s, "__dict__")
try:
    object.__setattr__(s, "typo", 1)  # bypass frozen to show slots alone rejects it
    raise AssertionError
except AttributeError:
    pass
try:
    s.name = "x"
    raise AssertionError
except dataclasses.FrozenInstanceError:
    pass


# naive decorator on async: measures nothing
async def slow():
    await asyncio.sleep(0.05)
    return "done"


log = []
naive = m.naive_timed(slow, log)
coro = naive()
assert inspect.iscoroutine(coro) and log[0] < 0.01  # timer stopped before any work
assert asyncio.run(coro) == "done"

log = []
good = m.traced(slow, log)
assert inspect.iscoroutinefunction(good) and good.__name__ == "slow"
assert asyncio.run(good()) == "done" and log[0][1] >= 0.04


# contextvars: per-task copies, to_thread propagates, run_in_executor and bare threads do not
async def child(n):
    m.run_id.set(n)
    await asyncio.sleep(0.01)
    return m.run_id.get()


async def main():
    m.run_id.set("parent")
    async with asyncio.TaskGroup() as tg:
        a = tg.create_task(child("A"))
        b = tg.create_task(child("B"))
    assert (a.result(), b.result()) == ("A", "B")
    assert m.run_id.get() == "parent"  # child set() did not leak upward
    assert await asyncio.to_thread(m.run_id.get) == "parent"
    loop = asyncio.get_running_loop()
    assert await loop.run_in_executor(None, m.run_id.get) == "-"
    ctx = contextvars.copy_context()
    assert await loop.run_in_executor(None, ctx.run, m.run_id.get) == "parent"
    out = []
    t = threading.Thread(target=lambda: out.append(m.run_id.get()))
    t.start()
    t.join()
    assert out == ["-"]  # default build: a new thread starts with an empty context
    tlog = []
    await m.traced(slow, tlog)()
    assert tlog[0][0] == "parent"


asyncio.run(main())
print("ok")
