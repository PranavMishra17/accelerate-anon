# Exercise: a bag-of-words intent classifier (naive Bayes) with an out-of-scope cutoff, per-intent thresholds,
# and a demo that a raw score is not a calibrated probability.
# Run its test: python interviews/vanguard_builds/intent_classifier_test.py
import math
import re
from collections import Counter

STOP = {"the", "a", "an", "to", "is", "my", "i", "me", "of", "it", "for", "on", "do", "can", "you", "what", "please", "and"}

TRAIN = {
    "check_balance": [
        "what is my balance", "how much money do i have", "check my balance", "show me my account balance",
        "balance in my checking account", "how much is in savings", "tell me my balance please",
        "what is the balance on my account", "how much cash is available", "can you check my balance",
        "current balance of my savings account", "what do i have in my account",
    ],
    "transfer_money": [
        "transfer money to savings", "move 200 dollars from checking to savings", "send money to my brother",
        "i want to transfer funds", "move money between my accounts", "transfer 50 to my savings account",
        "send 100 dollars to john", "can you move some money for me", "wire money to another account",
        "i need to transfer money", "put 300 from checking into savings", "pay my friend 40 dollars",
    ],
    "card_lost": [
        "i lost my card", "my debit card is missing", "my credit card was stolen", "i cannot find my card",
        "block my lost card", "card stolen please freeze it", "i think someone stole my wallet and card",
        "freeze my card now", "lost my debit card yesterday", "report a stolen credit card",
        "my card is gone", "cancel my lost card and send a new one",
    ],
    "dispute_charge": [
        "i did not make this charge", "dispute a charge on my card", "there is a wrong charge on my statement",
        "i was charged twice", "this transaction is not mine", "i want to dispute a transaction",
        "unauthorized charge on my account", "i see a charge i do not recognize", "refund a wrong charge",
        "merchant charged me the wrong amount", "challenge a payment on my statement", "double charged at a store",
    ],
    "branch_hours": [
        "when does the branch open", "what time does the branch close", "branch hours on saturday",
        "is the branch open today", "opening hours of the nearest branch", "when do you close on sunday",
        "what are your branch hours", "is the bank open on holidays", "what time do you open tomorrow",
        "hours for the downtown branch", "when is the branch open", "branch closing time",
    ],
}


def tokens(text: str) -> list[str]:
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP]


class IntentClassifier:
    def __init__(self, train: dict[str, list[str]], cutoff: float = 0.6, per_intent: dict[str, float] | None = None):
        self.cutoff = cutoff
        self.per_intent = per_intent or {}  # a risky intent can demand more confidence than a harmless one
        self.counts = {i: Counter(w for u in us for w in tokens(u)) for i, us in train.items()}
        self.vocab = {w for c in self.counts.values() for w in c}
        self.totals = {i: sum(c.values()) for i, c in self.counts.items()}

    def scores(self, text: str) -> dict[str, float]:
        words = [w for w in tokens(text) if w in self.vocab]  # unseen words carry no evidence
        logp = {}
        for i, c in self.counts.items():
            logp[i] = sum(math.log((c[w] + 1) / (self.totals[i] + len(self.vocab))) for w in words)  # +1 smoothing
        m = max(logp.values())
        exp = {i: math.exp(v - m) for i, v in logp.items()}
        z = sum(exp.values())
        return {i: v / z for i, v in exp.items()}  # softmax: sums to 1, but it is a score, not a probability

    def classify(self, text: str) -> tuple[str | None, float]:
        if not any(w in self.vocab for w in tokens(text)):
            return None, 0.0
        s = self.scores(text)
        best = max(s, key=s.get)
        if s[best] < self.per_intent.get(best, self.cutoff):
            return None, s[best]  # below the line: say "not sure" instead of guessing
        return best, s[best]


def overconfidence_demo(clf: IntentClassifier) -> tuple[float, float]:
    # Naive Bayes multiplies word evidence as if words were independent. Repeating one word adds the same
    # evidence again, so the score climbs toward 1.0 though we learned nothing new: not a calibrated probability.
    once = clf.scores("balance savings")["check_balance"]
    five = clf.scores("balance savings " * 5)["check_balance"]
    return once, five


if __name__ == "__main__":
    c = IntentClassifier(TRAIN)
    for u in ["how much is in my savings", "what is the weather", "I lost my card"]:
        print(u, "->", c.classify(u))
    print(overconfidence_demo(c))
