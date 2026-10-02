# Exercise: a variant assignment service: sticky hash bucketing, Thompson sampling over Beta posteriors, idempotent hourly batches, an incubation floor, fail to control.
# Run its test: python interviews/coframe_builds/builds2-bandit_test.py
import hashlib
import random
from dataclasses import dataclass, field

CONTROL = "control"


def bucket(*parts: str) -> float:
    """Stable uniform in [0, 1) from the parts. No lookup table, same input same answer."""
    h = hashlib.sha256(":".join(parts).encode()).digest()
    return int.from_bytes(h[:8], "big") / 2**64


@dataclass
class Arm:
    a: float = 1.0          # 1 + conversions (Beta prior a0 = 1)
    b: float = 1.0          # 1 + non-conversions
    born_hour: int = 0      # for the incubation period


@dataclass
class State:
    experiment: str
    arms: dict[str, Arm]
    holdout: float = 0.10           # always control, for an unbiased baseline
    incubation_hours: int = 24
    floor: float = 0.10             # share each incubating arm is guaranteed
    version: int = 0                # bumps on every batch that changes a posterior
    seen: set[str] = field(default_factory=set)
    # ponytail: an in-memory seen set grows forever; in production it is a table with a
    # unique constraint on event_id (INSERT ... ON CONFLICT DO NOTHING) in the same transaction as the counts.


def assign(visitor: str, state: State | None, sticky: dict[str, str], hour: int) -> tuple[str, str]:
    """Return (arm, reason). sticky is the visitor's first assignment (a cookie or a row)."""
    if state is None:
        return CONTROL, "fallback"           # state unavailable: control, not sticky, not an exposure
    first = sticky.get(visitor)
    if first is not None:
        return (first, "sticky") if first in state.arms else (CONTROL, "retired")
    if bucket(state.experiment, "holdout", visitor) < state.holdout:
        arm, reason = CONTROL, "holdout"
    else:
        arm, reason = _draw(visitor, state, hour), "thompson"
    sticky[visitor] = arm
    return arm, reason


def _draw(visitor: str, state: State, hour: int) -> str:
    # Seeded by visitor and posterior version: a retry before the sticky write lands gets the same arm.
    rng = random.Random(int(bucket(state.experiment, str(state.version), visitor) * 2**53))
    young = sorted(k for k, arm in state.arms.items() if hour - arm.born_hour < state.incubation_hours)
    u = rng.random()
    if u < state.floor * len(young):
        return young[int(u / state.floor)]
    return max(sorted(state.arms), key=lambda k: rng.betavariate(state.arms[k].a, state.arms[k].b))


def apply_batch(state: State, events: list[dict]) -> dict[str, int]:
    """Hourly update. events: {id, arm, converted}. Replaying a batch changes nothing."""
    out = {"applied": 0, "duplicate": 0, "unknown_arm": 0}
    for e in events:
        if e["id"] in state.seen:
            out["duplicate"] += 1
            continue
        state.seen.add(e["id"])
        arm = state.arms.get(e["arm"])
        if arm is None:
            out["unknown_arm"] += 1
            continue
        if e["converted"]:
            arm.a += 1
        else:
            arm.b += 1
        out["applied"] += 1
    if out["applied"]:
        state.version += 1
    return out


def add_arm(state: State, name: str, hour: int, prior: tuple[float, float] = (1.0, 1.0)) -> None:
    state.arms[name] = Arm(prior[0], prior[1], hour)


def retire_arm(state: State, name: str) -> None:
    if name != CONTROL:
        state.arms.pop(name, None)
