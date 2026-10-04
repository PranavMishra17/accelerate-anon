# Exercise: slot extraction (money, date, account nickname) with normalisation to canonical values,
# and entity resolution that asks a question when two accounts match.
# Run its test: python interviews/vanguard_builds/entities_test.py
import re
from datetime import date, timedelta

WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
SYMBOLS = {"$": "USD", "£": "GBP", "€": "EUR"}
WORDS = {"dollars": "USD", "dollar": "USD", "usd": "USD", "bucks": "USD", "pounds": "GBP", "gbp": "GBP", "euros": "EUR", "eur": "EUR"}
NUM = r"\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?"


def extract_money(text: str) -> dict | None:
    t = text.lower()
    m = re.search(rf"([$£€])\s?({NUM})", t)
    if m:
        cur, num = SYMBOLS[m.group(1)], m.group(2)
    else:
        m = re.search(rf"({NUM})\s?(dollars?|usd|bucks|pounds|gbp|euros|eur)\b", t)
        if not m:
            return None
        num, cur = m.group(1), WORDS[m.group(2)]
    cents = round(float(num.replace(",", "")) * 100)  # integer cents: never float money
    return {"cents": cents, "currency": cur}


def extract_date(text: str, today: date) -> date | None:
    t = text.lower()
    if re.search(r"\btoday\b", t):
        return today
    if re.search(r"\btomorrow\b", t):
        return today + timedelta(days=1)
    for i, d in enumerate(WEEKDAYS):
        if re.search(rf"\b{d}\b", t):
            return today + timedelta(days=(i - today.weekday()) % 7 or 7)  # the next one, never today
    m = re.search(r"\b(\d{1,2})(?:st|nd|rd|th)\b", t)
    if m:
        day = int(m.group(1))
        y, mo = today.year, today.month
        if day <= today.day:  # "the 5th" said on the 20th means next month
            y, mo = (y + 1, 1) if mo == 12 else (y, mo + 1)
        try:
            return date(y, mo, day)
        except ValueError:
            return None  # no 31st in that month: ask, do not invent
    return None


def find_accounts(text: str, gazetteer: dict[str, list[str]]) -> list[str]:
    # gazetteer: canonical account id -> the nicknames this user has for it
    t = text.lower()
    return [acct for acct, names in gazetteer.items() if any(re.search(rf"\b{re.escape(n)}\b", t) for n in names)]


def resolve_account(text: str, gazetteer: dict[str, list[str]]) -> dict:
    hits = find_accounts(text, gazetteer)
    if len(hits) == 1:
        return {"account": hits[0]}
    if not hits:
        return {"ask": "Which account do you mean?"}
    return {"ask": " or ".join(h.split("_")[-1] for h in hits).capitalize() + "?", "options": hits}


if __name__ == "__main__":
    g = {"acct_checking": ["checking", "everyday"], "acct_savings": ["savings", "rainy day"]}
    print(extract_money("send $1,250.50"), extract_date("the 5th", date(2026, 10, 3)), resolve_account("my account", g))
