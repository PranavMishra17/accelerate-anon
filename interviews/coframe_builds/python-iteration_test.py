# Test for python-iteration.py: plain asserts.
# Run: python interviews/coframe_builds/python-iteration_test.py
import importlib.util
import io
import itertools
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("python-iteration.py")
_s = importlib.util.spec_from_file_location("python_iteration", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

src = io.StringIO('{"a": 1}\n\n{"a": 2}\n{"a": 3}\n')
assert list(m.pipeline(src, 2)) == [({"a": 1}, {"a": 2}), ({"a": 3},)]

it = iter(range(3))
assert list(it) == [0, 1, 2] and list(it) == []  # iterators are single-pass
g = (x * x for x in range(3))
assert (sum(g), sum(g)) == (5, 0)

g = m.outer()
assert next(g) == 1
assert g.send("hi") == "inner got hi"

log = []
g = m.cleanup_gen(log)
next(g)
g.close()
assert log == ["closed"]

assert [k for k, _ in itertools.groupby("aabaa")] == ["a", "b", "a"]  # consecutive only
assert [k for k, _ in itertools.groupby(sorted("aabaa"))] == ["a", "b"]
assert list(itertools.batched(range(5), 2)) == [(0, 1), (2, 3), (4,)]
assert list(itertools.pairwise("abc")) == [("a", "b"), ("b", "c")]

assert m.count_sessions(["s1,x", "s2,y", "s1,z"]) == {"s1": 2, "s2": 1}
print("ok")
