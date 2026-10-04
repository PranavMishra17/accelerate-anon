# Test for entities.py: plain asserts.
# Run: python interviews/vanguard_builds/entities_test.py
from datetime import date

from entities import extract_date, extract_money, find_accounts, resolve_account

assert extract_money("send $1,250.50 now") == {"cents": 125050, "currency": "USD"}
assert extract_money("move 500 dollars") == {"cents": 50000, "currency": "USD"}
assert extract_money("pay £20") == {"cents": 2000, "currency": "GBP"}
assert extract_money("30 euros please") == {"cents": 3000, "currency": "EUR"}
assert extract_money("move some money") is None

sat = date(2026, 10, 3)  # a Saturday
assert extract_date("tomorrow", sat) == date(2026, 10, 4)
assert extract_date("on the 5th", sat) == date(2026, 10, 5)
assert extract_date("the 2nd", sat) == date(2026, 11, 2)  # already past this month
assert extract_date("friday", sat) == date(2026, 10, 9)
assert extract_date("the 31st", date(2026, 11, 10)) is None  # November has 30 days
assert extract_date("whenever", sat) is None

g = {"acct_checking": ["checking", "everyday"], "acct_savings": ["savings", "rainy day"]}
assert find_accounts("from my rainy day fund", g) == ["acct_savings"]
assert resolve_account("use everyday", g) == {"account": "acct_checking"}
r = resolve_account("transfer from checking to savings", g)  # both match, so the question names both
assert r["ask"] == "Checking or savings?" and r["options"] == ["acct_checking", "acct_savings"]
assert resolve_account("my account", g)["ask"] == "Which account do you mean?"
print("ok")
