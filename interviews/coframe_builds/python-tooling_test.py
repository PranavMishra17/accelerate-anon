# Test for python-tooling.py: plain asserts (pytest would use a fixture and monkeypatch for the same).
# Run: python interviews/coframe_builds/python-tooling_test.py
import importlib.util
import pathlib
import sys
from unittest import mock

_p = pathlib.Path(__file__).with_name("python-tooling.py")
_s = importlib.util.spec_from_file_location("python_tooling", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

# patching the original name does not reach a from-import
with mock.patch("os.getcwd", return_value="/fake"):
    assert m.where() != "/fake"
with mock.patch.object(m, "getcwd", return_value="/fake"):
    assert m.where() == "/fake"

# fake at the boundary: no network, no tokens
calls = []
agent = m.Agent(lambda hist: calls.append(list(hist)) or f"answer {len(hist)}")
assert agent.ask("hi") == "answer 1"
assert agent.ask("again") == "answer 2"
assert calls == [["hi"], ["hi", "again"]]
assert m.Agent(lambda h: "x").history == []  # no leak between instances

stat = m.top_growth(m.handle, 2000)
assert stat.traceback[0].filename.endswith("python-tooling.py")
assert stat.size_diff > 2000 * 1000  # about 2 MB held by the unbounded dict
assert sys.getsizeof([[0] * 10_000]) < 100  # shallow: counts the outer list only
print("ok")
