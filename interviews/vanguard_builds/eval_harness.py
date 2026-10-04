# Exercise: run a labelled set through the classifier, print a confusion matrix and per-intent precision and
# recall, measure out-of-scope accuracy, and fail a regression gate against a stored baseline.
# Run its test: python interviews/vanguard_builds/eval_harness_test.py
import json

from intent_classifier import TRAIN, IntentClassifier

OOS = "out_of_scope"  # the label for "the classifier returned None"

TESTSET = [
    ("show my balance", "check_balance"), ("how much do i have in checking", "check_balance"),
    ("what is the balance of my savings", "check_balance"),
    ("send 50 dollars to savings", "transfer_money"), ("i want to move money to my savings", "transfer_money"),
    ("transfer funds please", "transfer_money"),
    ("i lost my debit card", "card_lost"), ("my card was stolen", "card_lost"), ("freeze my lost card", "card_lost"),
    ("i do not recognize this charge", "dispute_charge"), ("dispute this charge", "dispute_charge"),
    ("i was charged twice at a store", "dispute_charge"),
    ("when does the branch open", "branch_hours"), ("branch hours on sunday", "branch_hours"),
    ("what time does the branch close", "branch_hours"),
    ("play jazz music", OOS), ("who won the football game", OOS), ("recommend a good pizza place", OOS),
]


def evaluate(clf: IntentClassifier, testset) -> dict:
    intents = sorted((set(clf.counts) | {t for _, t in testset}) - {OOS})  # an intent the model lost still gets a row
    labels = intents + [OOS]
    matrix = {t: {p: 0 for p in labels} for t in labels}  # matrix[true][predicted]
    for text, truth in testset:
        pred, _ = clf.classify(text)
        matrix[truth][pred or OOS] += 1
    per = {}
    for i in intents:
        tp = matrix[i][i]
        predicted = sum(matrix[t][i] for t in labels)
        actual = sum(matrix[i].values())
        per[i] = {"precision": tp / predicted if predicted else 0.0, "recall": tp / actual if actual else 0.0}
    oos_total = sum(matrix[OOS].values())
    return {"matrix": matrix, "per_intent": per, "oos_accuracy": matrix[OOS][OOS] / oos_total if oos_total else 1.0}


def report(result: dict) -> str:
    labels = list(result["matrix"])
    lines = ["rows = truth, columns = predicted", " " * 16 + "".join(f"{l[:7]:>8}" for l in labels)]
    for t in labels:
        lines.append(f"{t:<16}" + "".join(f"{result['matrix'][t][p]:>8}" for p in labels))
    lines.append("")
    for i, m in result["per_intent"].items():
        lines.append(f"{i:<16} precision {m['precision']:.2f}  recall {m['recall']:.2f}")
    lines.append(f"out-of-scope accuracy {result['oos_accuracy']:.2f}")
    return "\n".join(lines)


def gate(result: dict, baseline: dict, margin: float = 0.05) -> list[str]:
    # Returns the failures. An empty list means the change may ship. A drop within the margin is noise on a small set.
    fails = []
    for i, base in baseline["per_intent"].items():
        for metric in ("precision", "recall"):
            drop = base[metric] - result["per_intent"][i][metric]
            if drop > margin:
                fails.append(f"{i} {metric} fell {drop:.2f} (from {base[metric]:.2f})")
    if baseline["oos_accuracy"] - result["oos_accuracy"] > margin:
        fails.append("out-of-scope accuracy fell")
    return fails


def save_baseline(result: dict, path: str) -> None:
    with open(path, "w") as f:
        json.dump({"per_intent": result["per_intent"], "oos_accuracy": result["oos_accuracy"]}, f, indent=1)


def load_baseline(path: str) -> dict:
    with open(path) as f:
        return json.load(f)


if __name__ == "__main__":
    res = evaluate(IntentClassifier(TRAIN, cutoff=0.6), TESTSET)
    print(report(res))
