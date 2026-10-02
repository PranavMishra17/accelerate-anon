# Test for builds2-bandit.py: plain asserts, seeded randomness.
# Run: python interviews/coframe_builds/builds2-bandit_test.py
import importlib.util
import pathlib
import random
import sys

_p = pathlib.Path(__file__).with_name("builds2-bandit.py")
_spec = importlib.util.spec_from_file_location("builds2_bandit", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["builds2_bandit"] = m
_spec.loader.exec_module(m)


def state(**arms):
    return m.State("hero", {k: m.Arm(a, b, 0) for k, (a, b) in arms.items()})


def shares(st, n, hour, prefix="v"):
    count = {}
    for i in range(n):
        arm, _ = m.assign(f"{prefix}{i}", st, {}, hour)
        count[arm] = count.get(arm, 0) + 1
    return {k: v / n for k, v in count.items()}


# Bucketing: stable, in range, and the holdout is about 10% of traffic.
assert m.bucket("hero", "u1") == m.bucket("hero", "u1")
assert m.bucket("hero", "u1") != m.bucket("other", "u1")   # experiments are independent
st = state(control=(1, 1), v1=(1, 1))
reasons = [m.assign(f"h{i}", st, {}, 100)[1] for i in range(20000)]
assert 0.09 < reasons.count("holdout") / 20000 < 0.11

# Sticky: posteriors move, the first assignment does not.
st = state(control=(1, 1), v1=(1, 1))
sticky = {}
first = {f"s{i}": m.assign(f"s{i}", st, sticky, 100)[0] for i in range(200)}
m.apply_batch(st, [{"id": f"e{i}", "arm": "v1", "converted": True} for i in range(500)])
assert all(m.assign(v, st, sticky, 101)[0] == arm for v, arm in first.items())

# Same visitor, same posterior version, no sticky record yet: the draw repeats (retry safe).
assert m.assign("r1", st, {}, 101) == m.assign("r1", st, {}, 101)

# Replaying a batch is a no-op.
st = state(control=(1, 1), v1=(1, 1))
batch = [{"id": f"b{i}", "arm": "v1", "converted": i % 10 == 0} for i in range(100)]
assert m.apply_batch(st, batch) == {"applied": 100, "duplicate": 0, "unknown_arm": 0}
snap = (st.arms["v1"].a, st.arms["v1"].b, st.version)
assert m.apply_batch(st, batch) == {"applied": 0, "duplicate": 100, "unknown_arm": 0}
assert (st.arms["v1"].a, st.arms["v1"].b, st.version) == snap == (11, 91, 1)

# Thompson sampling sends most traffic to the clearly better arm (8% vs 5%, strong posteriors).
st = state(control=(501, 9501), v1=(801, 9201))
s = shares(st, 5000, 100)
assert s["v1"] > 0.85, s

# Incubation floor: an unlucky new arm keeps about its floor while young, then starves.
st = state(control=(501, 9501), v1=(801, 9201))
m.add_arm(st, "v2", hour=100, prior=(1, 61))
young = shares(st, 5000, 110).get("v2", 0)
old = shares(st, 5000, 130).get("v2", 0)
assert 0.07 < young < 0.13, young
assert old < 0.03, old

# Fail to control when state is unavailable; a retired arm sends its sticky visitors to control.
assert m.assign("x", None, {"x": "v1"}, 100) == ("control", "fallback")
st = state(control=(1, 1), v1=(1, 1))
m.retire_arm(st, "v1")
assert m.assign("x", st, {"x": "v1"}, 100) == ("control", "retired")

# End to end: ten hourly batches against true rates (seeded), the better arm takes the most traffic.
rng = random.Random(7)
true = {"control": 0.04, "v1": 0.07}
st = state(control=(1, 1), v1=(1, 1))
eid = 0
for hour in range(100, 110):
    events = []
    for i in range(2000):
        arm, reason = m.assign(f"h{hour}-{i}", st, {}, hour)
        events.append({"id": f"ev{eid}", "arm": arm, "converted": rng.random() < true[arm]})
        eid += 1
    m.apply_batch(st, events)
last = shares(st, 2000, 110, prefix="final")
assert last["v1"] > 0.7, last

print("builds2-bandit: ok")
