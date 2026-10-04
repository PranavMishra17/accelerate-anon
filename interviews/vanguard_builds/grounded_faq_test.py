# Test for grounded_faq.py: plain asserts.
# Run: python interviews/vanguard_builds/grounded_faq_test.py
from grounded_faq import PASSAGES, REFUSAL, BM25, answer

idx = BM25(PASSAGES)
cases = {
    "when are the branches open on saturday": "faq-04",
    "how do i report my stolen debit card": "faq-02",
    "how long do i have to dispute a charge": "faq-03",
    "how can i avoid the checking account fee": "faq-06",
    "when do wire transfers arrive": "faq-01",
}
for q, want in cases.items():
    r = answer(idx, PASSAGES, q)
    assert r["cite"] == want and r["text"] == PASSAGES[want], (q, r)

# off-topic questions are refused with no citation
for q in ["what is the best stock to buy", "who won the game last night", "hello"]:
    r = answer(idx, PASSAGES, q)
    assert r["text"] == REFUSAL and r["cite"] is None, (q, r)

# every answer is verbatim from an approved passage
assert all(answer(idx, PASSAGES, q)["text"] in PASSAGES.values() for q in cases)

# BM25 weighs a rare word above a common one
assert idx.idf["wire"] > idx.idf["card"]
print("ok")
