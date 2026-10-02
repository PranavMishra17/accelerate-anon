# Test for python-data-model.py: plain asserts.
# Run: python interviews/coframe_builds/python-data-model_test.py
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("python-data-model.py")
_s = importlib.util.spec_from_file_location("python_data_model", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

m.bad_append(1)
assert m.bad_append(2) == [1, 2]  # same list every call
assert m.bad_append.__defaults__ == ([1, 2],)  # it lives on the function object
m.good_append(1)
assert m.good_append(2) == [2]

assert [f() for f in m.late_bound()] == [2, 2, 2]
assert [f() for f in m.bound_now()] == [0, 1, 2]
assert [f() for f in m.bound_partial()] == [0, 1, 2]

rows = m.aliased_rows(2)
rows[0].append(1)
assert rows == [[0, 1], [0, 1]]
rows = m.fresh_rows(2)
rows[0].append(1)
assert rows == [[0, 1], [0]]

t, raised = m.tuple_iadd()
assert raised and t[0] == [1, 3]  # error AND mutation

x, y = [1], [1]
assert x == y and x is not y
assert m._MISSING is m._MISSING

a = [[1], [2]]
shallow, deep = m.copies(a)
a[0].append(99)
assert shallow[0] == [1, 99] and deep[0] == [1]

print("ok")
