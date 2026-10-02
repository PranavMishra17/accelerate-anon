# Test for async-structured.py: plain asserts.
# Run: python interviews/coframe_builds/async-structured_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("async-structured.py")
_s = importlib.util.spec_from_file_location("async_structured", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)


async def main():
    store, log = {}, []
    await m.run_agent(store, [0.01, 0.02], log)
    assert log == ["tool 0.01 done", "tool 0.02 done"] and store["checkpoint"] == log

    store, log = {}, []
    run = asyncio.create_task(m.run_agent(store, [0.01, 5, 5], log))
    await asyncio.sleep(0.03)
    run.cancel()  # the user pressed Stop
    try:
        await run
    except asyncio.CancelledError:
        pass
    await asyncio.sleep(0.02)
    assert sorted(log) == ["tool 0.01 done", "tool 5 cancelled", "tool 5 cancelled"], log
    assert store["checkpoint"] == log  # saved on the way out
    beats = store["beats"]
    await asyncio.sleep(0.03)
    assert store["beats"] == beats  # the heartbeat died with the run
    assert asyncio.all_tasks() == {asyncio.current_task()}  # nothing leaked


asyncio.run(main())
print("ok")
