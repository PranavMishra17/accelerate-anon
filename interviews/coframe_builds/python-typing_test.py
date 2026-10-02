# Test for python-typing.py: plain asserts.
# Run: python interviews/coframe_builds/python-typing_test.py
import asyncio
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("python-typing.py")
_s = importlib.util.spec_from_file_location("python_typing", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

x: int = "a"  # type: ignore  # annotations are not enforced at runtime
assert x == "a"

bad: m.Msg = {"role": "banana", "content": 1}  # type: ignore
assert type(bad) is dict  # a TypedDict is a plain dict at runtime
assert type(m.Msg(role="user", content="hi")) is dict

assert m.register(m.Echo()) == "echo"
assert asyncio.run(m.Echo()(q=1)) == "{'q': 1}"
assert isinstance(m.Impostor(), m.Tool)  # runtime_checkable checks members exist, not signatures
assert not isinstance(object(), m.Tool)

assert m.first([3, 4]) == 3
assert m.Vec.__value__ == list[float]

assert m.divide(1, 2) == m.Result(True, 0.5)
r = m.divide(1, 0)
assert not r.ok and r.error == "division by zero"
assert m.divide.__name__ == "divide"

assert m.parse(5) == "5" and m.parse("5") == 5
print("ok")
