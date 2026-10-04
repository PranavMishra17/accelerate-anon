# Exercise: answer only from approved FAQ passages, with BM25 written by hand, a citation to the passage id,
# and a refusal when the best score is below a threshold.
# Run its test: python interviews/vanguard_builds/grounded_faq_test.py
import math
import re
from collections import Counter

PASSAGES = {
    "faq-01": "Wire transfers sent before 4 pm Eastern on a business day usually arrive the same day.",
    "faq-02": "To report a lost or stolen debit card, call the number on our website. We freeze the card at once and mail a replacement in five business days.",
    "faq-03": "You can dispute a card charge within 60 days of the statement date. Provisional credit may be issued while we investigate.",
    "faq-04": "Branches are open Monday to Friday from 9 am to 5 pm, and Saturday from 9 am to 1 pm. Branches are closed on Sunday.",
    "faq-05": "A savings account earns interest that is paid monthly. Rates can change, so check the current rate on our website.",
    "faq-06": "Monthly maintenance fees on a checking account are waived when your daily balance stays above 1,500 dollars.",
}
STOP = {"the", "a", "an", "to", "is", "are", "of", "on", "in", "my", "i", "do", "how", "what", "can", "you", "at", "and", "or", "we", "our", "for", "it"}
REFUSAL = "I can't find that in our approved answers."


def tokens(text: str) -> list[str]:
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP]


class BM25:
    def __init__(self, docs: dict[str, str], k1: float = 1.5, b: float = 0.75):
        self.k1, self.b = k1, b
        self.tf = {i: Counter(tokens(t)) for i, t in docs.items()}
        self.len = {i: sum(c.values()) for i, c in self.tf.items()}
        self.avg = sum(self.len.values()) / len(docs)
        df = Counter(w for c in self.tf.values() for w in c)
        n = len(docs)
        self.idf = {w: math.log(1 + (n - d + 0.5) / (d + 0.5)) for w, d in df.items()}  # rare words weigh more

    def score(self, query: str) -> dict[str, float]:
        out = {}
        for i, c in self.tf.items():
            s = 0.0
            for w in tokens(query):
                if w in c:
                    f = c[w]
                    s += self.idf[w] * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * self.len[i] / self.avg))
            out[i] = s
        return out


def answer(index: BM25, passages: dict[str, str], question: str, threshold: float = 2.0) -> dict:
    scores = index.score(question)
    best = max(scores, key=scores.get)
    if scores[best] < threshold:
        return {"text": REFUSAL, "cite": None, "score": scores[best]}  # no passage earned it: say so, never improvise
    return {"text": passages[best], "cite": best, "score": scores[best]}  # the passage itself, not a paraphrase


if __name__ == "__main__":
    idx = BM25(PASSAGES)
    for q in ["when are branches open on saturday", "what is the best stock to buy"]:
        print(q, "->", answer(idx, PASSAGES, q))
