# Test for python-errors.py: plain asserts.
# Run: python interviews/coframe_builds/python-errors_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("python-errors.py")
_s = importlib.util.spec_from_file_location("python_errors", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

try:
    asyncio.run(m.caller_wrong())
    raise AssertionError("should not get here")
except ExceptionGroup as eg:
    assert {type(e) for e in eg.exceptions} == {ValueError, TimeoutError}

assert asyncio.run(m.caller_right()) == ["bad args", "slow upstream"]

# unmatched part of a group is re-raised in a new group
try:
    try:
        raise ExceptionGroup("g", [OSError(1), ValueError(2)])
    except* OSError:
        pass
except ExceptionGroup as rest:
    assert [type(x) for x in rest.exceptions] == [ValueError]

# a bare exception reaching except* is wrapped into a group
try:
    raise ValueError("x")
except* ValueError as eg:
    assert isinstance(eg, ExceptionGroup)

# split does the same programmatically
match, rest = ExceptionGroup("g", [OSError(1), ValueError(2)]).split(OSError)
assert [type(x) for x in match.exceptions] == [OSError]
assert [type(x) for x in rest.exceptions] == [ValueError]

assert m.finally_wins() == "finally"

try:
    m.call_tool("r1")
except m.ToolError as e:
    assert isinstance(e.__cause__, KeyError)
    assert e.__notes__ == ["run=r1 step=3"]

try:
    try:
        raise KeyError("k")
    except KeyError:
        raise RuntimeError("clean") from None
except RuntimeError as e:
    assert e.__cause__ is None and e.__suppress_context__

log = []
with m.tx(log):
    pass
assert log == ["begin", "commit", "release"]
log = []
try:
    with m.tx(log):
        raise ValueError
except ValueError:
    pass
assert log == ["begin", "rollback", "release"]
print("ok")
