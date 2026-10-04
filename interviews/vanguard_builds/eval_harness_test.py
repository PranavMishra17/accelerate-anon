# Test for eval_harness.py: plain asserts.
# Run: python interviews/vanguard_builds/eval_harness_test.py
import os
import tempfile

from eval_harness import OOS, TESTSET, evaluate, gate, load_baseline, report, save_baseline
from intent_classifier import TRAIN, IntentClassifier

good = evaluate(IntentClassifier(TRAIN, cutoff=0.6), TESTSET)
m = good["matrix"]
assert sum(sum(row.values()) for row in m.values()) == len(TESTSET)
assert all(good["per_intent"][i]["recall"] >= 0.6 for i in good["per_intent"]), good["per_intent"]
assert good["oos_accuracy"] == 1.0
assert "precision" in report(good) and "out-of-scope accuracy" in report(good)

# precision and recall are computed from the matrix, not copied from it
tiny = evaluate(IntentClassifier(TRAIN), [("check my balance", "check_balance"), ("check my balance", "card_lost")])
assert tiny["per_intent"]["check_balance"] == {"precision": 0.5, "recall": 1.0}
assert tiny["per_intent"]["card_lost"] == {"precision": 0.0, "recall": 0.0}

# the gate: same model passes, a damaged model fails
path = os.path.join(tempfile.mkdtemp(), "baseline.json")
save_baseline(good, path)
base = load_baseline(path)
assert gate(good, base) == []
broken_train = {i: us for i, us in TRAIN.items() if i != "card_lost"}  # lose a whole intent
bad = evaluate(IntentClassifier(broken_train), TESTSET)
fails = gate(bad, base)
assert any(f.startswith("card_lost recall") for f in fails)
# a strict cutoff makes everything out-of-scope: recall collapses and the gate says so
nervous = evaluate(IntentClassifier(TRAIN, cutoff=0.9999), TESTSET)
assert gate(nervous, base)
# a small wobble inside the margin does not fail
wobble = {"per_intent": {i: {k: v - 0.04 for k, v in d.items()} for i, d in good["per_intent"].items()}, "oos_accuracy": 1.0}
assert gate(wobble, base) == []
print("ok")
