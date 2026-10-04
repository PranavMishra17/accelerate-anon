# Exercise: a slot-filling state machine for a transfer. Collect from, to, amount; read back; accept a correction,
# a digression and a handoff after two failed turns. Money moves only on an explicit yes.
# Run its test: python interviews/vanguard_builds/dialogue_test.py
import re

from entities import extract_money, find_accounts

ASK = {"from": "Which account should it come from?", "to": "Which account should it go to?", "amount": "How much?"}


def amount_in(text: str, bare_ok: bool) -> dict | None:
    money = extract_money(text)
    bare = re.fullmatch(r"\W*(?:no\W+)?\$?(\d+(?:\.\d+)?)\W*", text.lower())
    if not money and bare and bare_ok:  # a bare "300" answers "How much?"; "no, 500" fixes the readback
        money = {"cents": round(float(bare.group(1)) * 100)}
    return money


class Transfer:
    def __init__(self, gazetteer: dict[str, list[str]], balances: dict[str, int], execute):
        self.g, self.balances, self.execute = gazetteer, balances, execute  # execute(from, to, cents) is the only way money moves
        self.slots = {"from": None, "to": None, "amount": None}
        self.state = "FILLING"  # FILLING, CONFIRM, DONE, HANDOFF
        self.fails = 0
        self.opened = False

    def _missing(self):
        return next((k for k, v in self.slots.items() if v is None), None)

    def _readback(self) -> str:
        s = self.slots
        return f"Move ${s['amount'] / 100:,.2f} from {s['from'].split('_')[-1]} to {s['to'].split('_')[-1]}. Say yes to confirm."

    def _next_prompt(self) -> str:
        missing = self._missing()
        if missing is None:
            self.state = "CONFIRM"
            return self._readback()
        return ASK[missing]

    def _fill(self, text: str) -> bool:
        before = dict(self.slots)
        money = amount_in(text, bare_ok=self._missing() == "amount")
        if money:
            self.slots["amount"] = money["cents"]
        left, _, right = text.lower().partition(" to ")
        if right:
            for key, part in (("from", left), ("to", right)):
                hits = find_accounts(part, self.g)
                if len(hits) == 1:
                    self.slots[key] = hits[0]
        else:
            hits = find_accounts(text, self.g)
            missing = self._missing()
            if len(hits) == 1 and missing in ("from", "to"):
                self.slots[missing] = hits[0]
        if self.slots["from"] and self.slots["from"] == self.slots["to"]:
            self.slots["to"] = None  # same account both ways makes no sense; ask again
        return self.slots != before

    def _digression(self, text: str) -> str | None:
        if "balance" not in text.lower():
            return None
        hits = find_accounts(text, self.g)
        if len(hits) != 1:
            return "Which account's balance?"
        return f"Your {hits[0].split('_')[-1]} balance is ${self.balances[hits[0]] / 100:,.2f}."

    def say(self, text: str) -> str:
        if self.state in ("DONE", "HANDOFF"):
            return "This transfer is finished."
        side = self._digression(text)
        if side:  # answer it, keep the slots, then pick the flow back up where it was
            return side + " " + (self._readback() if self.state == "CONFIRM" else self._next_prompt())
        if self.state == "CONFIRM":
            return self._confirm_turn(text)
        filled = self._fill(text)
        first, self.opened = not self.opened, True
        if filled or first:  # the opening turn ("i want to transfer") fills nothing and is not a failure
            self.fails = 0
            return self._next_prompt()
        return self._fail()

    def _confirm_turn(self, text: str) -> str:
        t = text.lower().strip()
        if re.match(r"(yes|yeah|yep|confirm|go ahead)\b", t) and not amount_in(t, True):
            self.execute(self.slots["from"], self.slots["to"], self.slots["amount"])
            self.state = "DONE"
            return "Done. The transfer is complete."
        if t.startswith("no") and (money := amount_in(t, True)):
            self.slots["amount"] = money["cents"]  # "no, 500" fixes the amount and asks again
            return self._readback()
        if re.match(r"(no|cancel|stop)\b", t):
            self.state = "DONE"
            return "Okay, I cancelled it. Nothing was moved."
        return self._fail()  # anything but a clear yes is not a yes

    def _fail(self) -> str:
        self.fails += 1
        if self.fails >= 2:
            self.state = "HANDOFF"
            return "I'm having trouble, so I'll connect you to a person."
        return "Sorry, I didn't get that. " + (self._readback() if self.state == "CONFIRM" else self._next_prompt())


if __name__ == "__main__":
    g = {"acct_checking": ["checking"], "acct_savings": ["savings"]}
    d = Transfer(g, {"acct_checking": 120000, "acct_savings": 50000}, lambda *a: print("MOVE", a))
    for u in ["transfer from checking to savings", "300", "no, 500", "yes"]:
        print(u, "->", d.say(u))
