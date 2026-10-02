# Exercise: validate tool arguments once at the trust boundary; a hand validator standing in for pydantic v2.
# Run its test: python interviews/coframe_builds/python-validation_test.py
# In real code: a pydantic BaseModel with ConfigDict(extra="forbid", strict=True), Field(ge=1, le=300),
# and Annotated[Union[Click, Type_], Field(discriminator="kind")]; this file mimics those rules.
import json
from dataclasses import dataclass


@dataclass
class Step:  # stdlib dataclass: no validation at all
    name: str


@dataclass(frozen=True)
class Click:
    selector: str


@dataclass(frozen=True)
class Type_:
    text: str


SCHEMAS = {  # discriminator value -> (class, {field: type})
    "click": (Click, {"selector": str}),
    "type": (Type_, {"text": str}),
}


class ValidationError(Exception):
    pass


def parse_action(raw: str):
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValidationError(f"not JSON: {e.msg}") from None
    if not isinstance(data, dict):
        raise ValidationError("expected an object")
    kind = data.get("kind")
    if kind not in SCHEMAS:  # one precise error instead of a wall of union failures
        raise ValidationError(f"kind must be one of {sorted(SCHEMAS)}, got {kind!r}")
    cls, fields = SCHEMAS[kind]
    extra = set(data) - set(fields) - {"kind"}
    if extra:  # like extra="forbid" (pydantic's default is "ignore")
        raise ValidationError(f"unknown fields: {sorted(extra)}")
    for f, t in fields.items():
        if f not in data:
            raise ValidationError(f"{f}: required")
        if type(data[f]) is not t:  # strict: no "10" -> 10 coercion
            raise ValidationError(f"{f}: expected {t.__name__}, got {type(data[f]).__name__}")
    return cls(**{f: data[f] for f in fields})


def tool_turn(raw: str):
    """Return (action, None) or (None, error text to hand back to the model for a bounded retry)."""
    try:
        return parse_action(raw), None
    except ValidationError as e:
        return None, f"Your tool call was invalid: {e}. Fix it and call again."


def run_with_retries(model, max_tries=2):
    feedback = None
    for _ in range(max_tries):
        action, feedback = tool_turn(model(feedback))
        if action is not None:
            return action
    raise ValidationError(f"gave up after {max_tries} tries: {feedback}")
