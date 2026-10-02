# Test for python-validation.py: plain asserts.
# Run: python interviews/coframe_builds/python-validation_test.py
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("python-validation.py")
_s = importlib.util.spec_from_file_location("python_validation", _p)
m = importlib.util.module_from_spec(_s)
sys.modules[_s.name] = m
_s.loader.exec_module(m)

assert m.Step(name=3).name == 3  # dataclass accepts the wrong type

assert m.parse_action('{"kind": "click", "selector": "#a"}') == m.Click("#a")
assert m.parse_action('{"kind": "type", "text": "hi"}') == m.Type_("hi")


def err(raw):
    a, e = m.tool_turn(raw)
    assert a is None
    return e


assert "kind must be one of" in err('{"kind": "scroll"}')
assert "unknown fields" in err('{"kind": "click", "selector": "#a", "force": true}')
assert "text: expected str, got int" in err('{"kind": "type", "text": 1}')
assert "selector: required" in err('{"kind": "click"}')
assert "not JSON" in err("{kind: click}")

replies = iter(['{"kind": "click"}', '{"kind": "click", "selector": "#b"}'])
seen = []


def fake_model(feedback):
    seen.append(feedback)
    return next(replies)


assert m.run_with_retries(fake_model) == m.Click("#b")
assert seen[0] is None and "selector: required" in seen[1]  # the error became the next prompt

try:
    m.run_with_retries(lambda fb: "nope", max_tries=2)
    raise AssertionError("should give up")
except m.ValidationError as e:
    assert "gave up after 2 tries" in str(e)
print("ok")
