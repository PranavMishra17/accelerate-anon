# Test for intent_classifier.py: plain asserts.
# Run: python interviews/vanguard_builds/intent_classifier_test.py
from intent_classifier import TRAIN, IntentClassifier, overconfidence_demo

c = IntentClassifier(TRAIN)
assert c.classify("how much is in my savings account")[0] == "check_balance"
assert c.classify("i lost my card")[0] == "card_lost"
assert c.classify("when does the branch close")[0] == "branch_hours"
assert c.classify("i was charged twice")[0] == "dispute_charge"

# nothing in the vocabulary: None, never a guess
assert c.classify("play jazz music") == (None, 0.0)

# a high cutoff turns a fairly confident answer into None
strict = IntentClassifier(TRAIN, cutoff=0.99)
assert strict.classify("how much is in my savings")[0] is None
# per-intent threshold: money movement asks for more than the default
risky = IntentClassifier(TRAIN, cutoff=0.5, per_intent={"transfer_money": 0.999})
label, conf = c.classify("move money to savings")
assert label == "transfer_money" and 0.5 < conf < 0.999
assert risky.classify("move money to savings")[0] is None

# the score is overconfident: repeating a word pushes it up with no new information
once, five = overconfidence_demo(c)
assert five > once and five > 0.999
print("ok")
