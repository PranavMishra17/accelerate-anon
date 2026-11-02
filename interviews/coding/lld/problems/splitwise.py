"""Splitwise. A drill in the Locker shape: Splitwise, Group, Split, Expense and Ledger, plus a SplitKind enum.
add_expense asks the Split for each person's share; the Split rule decides how (equal, exact, percent); one Ledger keeps the net per pair."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the entry class: recording an expense ----
ADD_EXPENSE = method('''
    def add_expense(self, group_id: str, payer: str, amount_cents: int, split: Split) -> Expense:
        """
        Core logic:
          1. Check the group, the amount, and that the payer and everyone in the split are members
          2. Ask the split for each person's share of the amount
          3. Record the expense and update the ledger
        Edge cases:
          1. Unknown group -> error
          2. Amount zero or negative -> error
          3. Payer or participant not in the group -> error
          4. Shares that don't total the amount -> error (the Split raises it)
        """
        group = self._get_group(group_id)                  # Edge 1
        if amount_cents <= 0:                              # Edge 2: an expense moves money forward
            raise SplitwiseError("amount must be positive")
        outsiders = [u for u in (payer, *split.values) if not group.has(u)]
        if outsiders:                                      # Edge 3
            raise SplitwiseError(f"not in {group_id}: {', '.join(outsiders)}")
        shares = split.shares(amount_cents)                # Step 2: how to divide is the Split's rule, named now, written next
        return self._record(group_id, payer, amount_cents, shares)   # Step 3
''')

# ---- the split: how shares are computed ----
SPLIT_SHARES = method('''
    def shares(self, amount_cents: int) -> dict:
        """
        Core logic:
          1. Check there is someone to split with, and no negative number
          2. Equal: divide evenly; the leftover cents go one each to the first people
          3. Exact: the amounts are the shares, and must total the expense
          4. Percent: percents must total 100; floor each share, leftover cents as in equal
        Edge cases:
          1. Nobody in the split, or a negative value -> error
          2. Exact amounts or percents that don't add up -> error
          3. The result always totals amount_cents, to the cent
        """
        if not self.values or any(v < 0 for v in self.values.values()):   # Edge 1
            raise SplitwiseError("a split needs people and no negative values")
        if self.kind is SplitKind.EQUAL:                   # Step 2
            return self._equal_shares(amount_cents)
        if self.kind is SplitKind.EXACT:                   # Step 3
            return self._exact_shares(amount_cents)
        return self._percent_shares(amount_cents)          # Step 4
''')

EQUAL_SHARES = method('''
    def _equal_shares(self, amount_cents: int) -> dict:
        """
        Core logic:
          1. Divide with a remainder: base cents each, and a few cents left over
          2. Walk the people in the order given; the first ones get one extra cent
        Edge cases:
          1. Divides evenly -> leftover is 0, everyone gets base
        """
        people = list(self.values)                         # dict order is the order the caller gave
        base, leftover = divmod(amount_cents, len(people)) # Step 1: 1000 over 3 is 333 with 1 left
        shares = {}
        for i, user in enumerate(people):
            shares[user] = base + (1 if i < leftover else 0)   # Step 2: leftover < len(people), so one extra each at most
        return shares
''')

PERCENT_SHARES = method('''
    def _percent_shares(self, amount_cents: int) -> dict:
        """
        Core logic:
          1. The percents must total 100
          2. Each share is the amount times the percent, floored to a whole cent
          3. Floors lose under a cent each: hand the lost cents out one by one, in order
        Edge cases:
          1. Percents total 99 or 101 -> error
          2. A 0 percent person never receives a leftover cent
        """
        if sum(self.values.values()) != 100:               # Edge 1
            raise SplitwiseError("percents must total 100")
        shares = {user: amount_cents * pct // 100 for user, pct in self.values.items()}   # Step 2: integers, no float drift
        leftover = amount_cents - sum(shares.values())     # Step 3: less than the number of people
        for user in shares:
            if leftover == 0:
                break
            if self.values[user] > 0:                      # Edge 2
                shares[user] += 1
                leftover -= 1
        return shares
''')

EXACT_SHARES = method('''
    def _exact_shares(self, amount_cents: int) -> dict:
        total = sum(self.values.values())
        if total != amount_cents:                          # the caller did the maths; we only check it
            raise SplitwiseError(f"shares total {total}, expense is {amount_cents}")
        return dict(self.values)                           # a copy, so the Expense owns its numbers
''')

# ---- the ledger: balances ----
LEDGER_BALANCES = method('''
    def balances(self, user: str) -> dict:
        """
        Core logic:
          1. Find everyone this user has a pair entry with
          2. For each, take the net between them, skipping zero
          3. Return them in name order
        Edge cases:
          1. A user with no entries -> empty dict
          2. Positive means the user owes them; negative means they owe the user
        """
        others = set()
        for debtor, creditor in self.net:                  # Step 1: the keys are the pairs that ever had an entry
            if debtor == user:
                others.add(creditor)
            elif creditor == user:
                others.add(debtor)
        result = {}
        for other in sorted(others):                       # Step 3: sorted, so a run prints the same every time
            cents = self.owed(user, other)                 # Step 2: derived each time, never stored a second time
            if cents != 0:
                result[other] = cents
        return result
''')

# ---- the entry class: settle, reading balances ----
SETTLE = method('''
    def settle(self, from_user: str, to_user: str, amount_cents: int) -> None:
        """
        Core logic:
          1. Check both users are known and the amount is positive
          2. Record it as a debt the other way: to_user now owes from_user that much
        Edge cases:
          1. Unknown user, same user twice, or amount not positive -> error
          2. Paying more than owed is not rejected: the other person now owes the difference
        """
        if amount_cents <= 0 or from_user == to_user:      # Edge 1
            raise SplitwiseError("a payment is a positive amount between two people")
        self._check_known(from_user, to_user)
        # Step 2: one write path. The payment cancels debt exactly because owed() nets both directions
        self.ledger.add(to_user, from_user, amount_cents)
''')

BALANCE = method('''
    def balance(self, a: str, b: str) -> int:
        """
        Core logic:
          1. Check both users are known
          2. Ask the ledger what a owes b, net of what b owes a
        Edge cases:
          1. Positive: a owes b. Negative: b owes a. Zero: settled
        """
        self._check_known(a, b)
        return self.ledger.owed(a, b)                      # Step 2: the ledger already holds the net
''')

BALANCES = method('''
    def balances(self, user: str) -> dict:
        """
        Core logic:
          1. Check the user is known
          2. Ask the ledger for this user's net against everyone else
        Edge cases:
          1. Everyone settled -> empty dict
        """
        self._check_known(user)
        return self.ledger.balances(user)                  # Step 2: Ledger.balances has the loop
''')

SPLITWISE_HELPERS = method('''
    def create_group(self, group_id: str, members: list) -> None:
        if group_id in self.groups or not members:         # a group id is unique and a group is not empty
            raise SplitwiseError("a new group needs an unused id and members")
        self.groups[group_id] = Group(set(members))

    def _record(self, group_id: str, payer: str, amount_cents: int, shares: dict) -> Expense:
        expense = Expense(group_id, payer, amount_cents, shares)
        self.expenses.append(expense)                      # history first: balances can always be rebuilt from this
        for user, cents in shares.items():
            if user != payer and cents > 0:                # the payer owes themselves nothing
                self.ledger.add(user, payer, cents)
        return expense

    def _get_group(self, group_id: str) -> Group:
        if group_id not in self.groups:
            raise SplitwiseError(f"no group {group_id}")
        return self.groups[group_id]

    def _check_known(self, *users: str) -> None:
        for user in users:
            if not any(g.has(user) for g in self.groups.values()):
                raise SplitwiseError(f"unknown user {user}")
''')

HEAD = D('''\
    from dataclasses import dataclass
    from enum import Enum


    class SplitKind(Enum):
        EQUAL = "equal"              # same share each; leftover cents go to the first people
        EXACT = "exact"              # the caller gives each person's cents
        PERCENT = "percent"          # the caller gives whole percents that total 100


    class SplitwiseError(Exception):   # one error type the caller can catch for every refusal
        pass
    ''')

SPLIT_HEAD = D('''\


    @dataclass
    class Split:
        """How an expense is divided. The kind decides how shares are computed; the values say who is in it."""
        kind: SplitKind
        values: dict                 # user -> cents (EXACT) or percent (PERCENT); for EQUAL only the keys matter

        @classmethod
        def equal(cls, *users: str) -> "Split":
            return cls(SplitKind.EQUAL, {u: 1 for u in users})

        @classmethod
        def exact(cls, cents: dict) -> "Split":
            return cls(SplitKind.EXACT, cents)

        @classmethod
        def percent(cls, percents: dict) -> "Split":
            return cls(SplitKind.PERCENT, percents)
    ''')

EXPENSE = D('''\


    @dataclass(frozen=True)              # a record of what happened; never edited, a correction is a new entry
    class Expense:
        group_id: str
        payer: str                       # who paid, and is owed the shares
        amount_cents: int                # integer cents, so no float drift
        shares: dict                     # user -> cents, totals amount_cents
    ''')

GROUP = D('''\


    class Group:
        """The people an expense can involve."""

        def __init__(self, members: set):
            self.members = members       # a set: membership is the only question asked of it

        def has(self, user: str) -> bool:
            return user in self.members
    ''')

LEDGER = D('''\


    class Ledger:
        """What people owe each other, as one number per ordered pair."""

        def __init__(self):
            self.net = {}                # (debtor, creditor) -> cents; entries only grow, a payment is an entry the other way

        def add(self, debtor: str, creditor: str, cents: int) -> None:
            self.net[(debtor, creditor)] = self.net.get((debtor, creditor), 0) + cents   # the one write

        def owed(self, a: str, b: str) -> int:
            """What a owes b, net of what b owes a."""
            return self.net.get((a, b), 0) - self.net.get((b, a), 0)
    ''')

SPLITWISE = D('''\


    class Splitwise:
        """The entry point: groups, expenses, payments and balances."""

        def __init__(self):
            self.groups = {}             # group_id -> Group
            self.expenses = []           # Expense records, append-only
            self.ledger = Ledger()       # the net owed per pair; every balance is read from here
    ''')

CORE = (HEAD + SPLIT_HEAD + in_class(SPLIT_SHARES, EQUAL_SHARES, PERCENT_SHARES, EXACT_SHARES)
        + EXPENSE + GROUP + LEDGER + in_class(LEDGER_BALANCES)
        + SPLITWISE + in_class(ADD_EXPENSE, SETTLE, BALANCE, BALANCES, SPLITWISE_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    sw = Splitwise()
    sw.create_group("trip", ["ann", "bob", "cy"])
    e = sw.add_expense("trip", "ann", 1000, Split.equal("ann", "bob", "cy"))
    print(e.shares)                                # 1000 over 3: ann gets the leftover cent
    sw.add_expense("trip", "bob", 900, Split.exact({"ann": 300, "bob": 200, "cy": 400}))
    print("bob owes ann", sw.balance("bob", "ann"))   # 333 owed to ann, 300 owed back: 33
    e = sw.add_expense("trip", "cy", 1001, Split.percent({"ann": 50, "bob": 30, "cy": 20}))
    print(e.shares)                                # floors give 500, 300, 200; ann takes the lost cent
    print(sw.balances("cy"))                       # negative: ann owes cy 168; positive: cy owes bob 100
    for bad in (lambda: sw.add_expense("trip", "ann", 500, Split.exact({"ann": 200, "bob": 200})),
                lambda: sw.add_expense("trip", "ann", 500, Split.percent({"ann": 60, "bob": 60})),
                lambda: sw.add_expense("trip", "dee", 500, Split.equal("ann", "bob")),
                lambda: sw.add_expense("gym", "ann", 500, Split.equal("ann", "bob"))):
        try:
            bad()
        except SplitwiseError as err:
            print(err)
    sw.settle("cy", "bob", 100)
    print("cy owes bob", sw.balance("cy", "bob"))   # settled
    sw.settle("ann", "cy", 200)                    # ann pays more than the 168 she owes cy
    print("cy owes ann", sw.balance("cy", "ann"))   # the difference flips direction
    ''')
DEMO_OUT = ("{'ann': 334, 'bob': 333, 'cy': 333}\nbob owes ann 33\n{'ann': 501, 'bob': 300, 'cy': 200}\n"
            "{'ann': -168, 'bob': 100}\nshares total 400, expense is 500\npercents must total 100\n"
            "not in trip: dee\nno group gym\ncy owes bob 0\ncy owes ann 32\n")

# ---- extensions ----
EXT_SIMPLIFY = D('''\
    class Ledger:
        def positions(self) -> dict:
            """Each user's net across everyone: positive is owed money, negative owes it."""
            pos = {}
            for (debtor, creditor), cents in self.net.items():
                pos[debtor] = pos.get(debtor, 0) - cents
                pos[creditor] = pos.get(creditor, 0) + cents
            return pos


    class Splitwise:
        def simplify_debts(self) -> list:
            """Fewest payments (greedy): the biggest debtor pays the biggest creditor, until nobody owes."""
            pos = self.ledger.positions()
            debtors = {u: -v for u, v in pos.items() if v < 0}
            creditors = {u: v for u, v in pos.items() if v > 0}
            payments = []
            while debtors:                      # totals match, so creditors empty at the same moment
                d = sorted(debtors, key=lambda u: (-debtors[u], u))[0]       # biggest, lower name on a tie
                c = sorted(creditors, key=lambda u: (-creditors[u], u))[0]
                pay = min(debtors[d], creditors[c])
                payments.append((d, c, pay))
                debtors[d] -= pay
                creditors[c] -= pay
                if debtors[d] == 0:
                    del debtors[d]
                if creditors[c] == 0:
                    del creditors[c]
            return payments
    ''')

EXT_WEIGHTED = D('''\
    class SplitKind(Enum):
        ...
        SHARES = "shares"            # weights: 2 for a double share

    class Split:
        @classmethod
        def weighted(cls, weights: dict) -> "Split":
            return cls(SplitKind.SHARES, weights)

        def _weighted_shares(self, amount_cents: int) -> dict:
            total = sum(self.values.values())
            if total == 0:
                raise SplitwiseError("weights must not all be zero")
            return self._proportional(amount_cents, total)   # percent is the same with total 100
    ''')

EXT_LOCK = D('''\
    from threading import Lock


    class Splitwise:
        def __init__(self):
            ...
            self.lock = Lock()

        def add_expense(self, group_id: str, payer: str, amount_cents: int, split: Split) -> Expense:
            with self.lock:              # the ledger write and the expense append happen together
                ...

        def settle(self, from_user: str, to_user: str, amount_cents: int) -> None:
            with self.lock:
                ...
    ''')

# ---- the final file: core + simplify debts + weighted shares ----
F_HEAD = HEAD.replace('PERCENT = "percent"          # the caller gives whole percents that total 100',
                      'PERCENT = "percent"          # the caller gives whole percents that total 100\n'
                      '    SHARES = "shares"            # the caller gives weights: 2 for a double share')

F_SPLIT_HEAD = SPLIT_HEAD + textwrap.indent(D('''
    @classmethod
    def weighted(cls, weights: dict) -> "Split":
        return cls(SplitKind.SHARES, weights)
    '''), "    ")

F_SPLIT_SHARES = method('''
    def shares(self, amount_cents: int) -> dict:
        """Same steps as before, plus the weighted kind."""
        if not self.values or any(v < 0 for v in self.values.values()):
            raise SplitwiseError("a split needs people and no negative values")
        if self.kind is SplitKind.EQUAL:
            return self._equal_shares(amount_cents)
        if self.kind is SplitKind.EXACT:
            return self._exact_shares(amount_cents)
        if self.kind is SplitKind.SHARES:
            return self._weighted_shares(amount_cents)
        return self._percent_shares(amount_cents)
''')

F_PERCENT_SHARES = method('''
    def _percent_shares(self, amount_cents: int) -> dict:
        if sum(self.values.values()) != 100:
            raise SplitwiseError("percents must total 100")
        return self._proportional(amount_cents, 100)       # the floor-and-leftover loop moved here to be shared
''')

F_WEIGHTED_SHARES = method('''
    def _weighted_shares(self, amount_cents: int) -> dict:
        total = sum(self.values.values())
        if total == 0:
            raise SplitwiseError("weights must not all be zero")
        return self._proportional(amount_cents, total)
''')

F_PROPORTIONAL = method('''
    def _proportional(self, amount_cents: int, total: int) -> dict:
        """Each share is amount * value / total, floored; lost cents go out one by one, in order."""
        shares = {user: amount_cents * v // total for user, v in self.values.items()}
        leftover = amount_cents - sum(shares.values())
        for user in shares:
            if leftover == 0:
                break
            if self.values[user] > 0:
                shares[user] += 1
                leftover -= 1
        return shares
''')

F_LEDGER = LEDGER + textwrap.indent(D('''
    def positions(self) -> dict:
        """Each user's net across everyone: positive is owed money, negative owes it."""
        pos = {}
        for (debtor, creditor), cents in self.net.items():
            pos[debtor] = pos.get(debtor, 0) - cents
            pos[creditor] = pos.get(creditor, 0) + cents
        return pos
    '''), "    ")

F_SIMPLIFY = method('''
    def simplify_debts(self) -> list:
        """Fewest payments (greedy): the biggest debtor pays the biggest creditor, until nobody owes."""
        pos = self.ledger.positions()
        debtors = {u: -v for u, v in pos.items() if v < 0}
        creditors = {u: v for u, v in pos.items() if v > 0}
        payments = []
        while debtors:                                     # totals match, so creditors empty at the same moment
            d = sorted(debtors, key=lambda u: (-debtors[u], u))[0]       # biggest, lower name on a tie
            c = sorted(creditors, key=lambda u: (-creditors[u], u))[0]
            pay = min(debtors[d], creditors[c])
            payments.append((d, c, pay))
            debtors[d] -= pay
            creditors[c] -= pay
            if debtors[d] == 0:
                del debtors[d]
            if creditors[c] == 0:
                del creditors[c]
        return payments
''')

FINAL = (F_HEAD + F_SPLIT_HEAD
         + in_class(F_SPLIT_SHARES, EQUAL_SHARES, F_PERCENT_SHARES, F_WEIGHTED_SHARES, F_PROPORTIONAL, EXACT_SHARES)
         + EXPENSE + GROUP + F_LEDGER + in_class(LEDGER_BALANCES)
         + SPLITWISE + in_class(ADD_EXPENSE, SETTLE, BALANCE, BALANCES, F_SIMPLIFY, SPLITWISE_HELPERS))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    sw = Splitwise()
    sw.create_group("flat", ["ann", "bob", "cy"])
    sw.add_expense("flat", "ann", 600, Split.exact({"bob": 600}))      # bob owes ann 600
    sw.add_expense("flat", "bob", 600, Split.exact({"cy": 600}))       # cy owes bob 600
    print(sw.simplify_debts())                    # one payment, cy to ann, instead of two
    e = sw.add_expense("flat", "cy", 1000, Split.weighted({"ann": 2, "bob": 1}))
    print(e.shares)                               # 2 parts to 1: 667 and 333, ann takes the lost cent
    print(sw.simplify_debts())                    # cy now owed 1000, owes ann 600 less 667: ann pays cy 67
    ''')
FINAL_OUT = "[('cy', 'ann', 600)]\n{'ann': 667, 'bob': 333}\n[('bob', 'cy', 333), ('ann', 'cy', 67)]\n"


PROBLEM = {
    "id": "splitwise", "title": "Splitwise", "part_id": "lld-splitwise", "n": 10,
    "part_title": "Splitwise", "minutes": 45,
    "lead": "A Splitwise round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. Money is integer cents. The split kind carries the rule for computing shares; one ledger keeps the net per pair. Implementation starts with add_expense and names the share computation before writing it.",
    "prompt": "'Design Splitwise': groups, shared expenses, who owes whom.",
    "evidence": "LeetCode Discuss Dec 2024, May 2025 (currency conversion was the sticking point), Apr 2026 (entities, APIs and a strategy pattern, pseudocode only).",
    "drill": "part 10, Splitwise.",

    "clarify": {
        "capabilities": [("How are expenses split?", "Equally, by exact amounts, or by percentages"),
                         ("Who is in an expense?", "A payer and some participants, all members of one group; two friends are a group of two"),
                         ("How does someone settle up?", "They record a payment to the person they owe")],
        "errors": [("Exact amounts or percentages that don't add up?", "Reject the expense"),
                   ("An amount that doesn't divide evenly?", "Your call; say the rule")],
        "scope": [("Currencies, simplifying debts?", "One currency for now; expect them as follow-ups"),
                  ("Login, notifications, persistence?", "Out of scope; in memory")],
    },
    "clarify_hint": "How an expense is split and who is in it. Splits that don't add up, and leftover cents. Currencies, simplifying debts, accounts.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The split types come first, because how shares are computed is the heart of the design. Then bad totals and the leftover cent, since money in floats would hide that. Last, currencies and simplifying debts, which I expect as follow-ups.",
    "clarify_why": "The split types are why a Split is a class that carries a rule. Bad totals put a check in one place. The leftover-cent question forces integer cents and a stated rule, which is the first thing an interviewer probes.",
    "answers": "Equal, exact and percent splits. The payer and participants are members of one group. Settling is recording a payment. A split that doesn't add up is rejected. When an amount doesn't divide, I state the rule. One currency, no debt simplification yet, no login or notifications, in memory.",
    "playback": ["Thanks, that's clear. **So: expenses in a group, split three ways, tracked as net amounts per pair, in integer cents, with settle-up as a payment the other way.** Bad splits are rejected. Out of scope: currencies, simplifying debts, login, notifications, persistence."],

    "requirements": [
        ["User adds an expense: a payer, an amount in cents, a group and a split.", "The system computes each person's share by the split type and records what each owes the payer", "Shares that don't total the amount, an unknown group or a non-member is an error"],
        ["User asks who owes whom.", "The system returns the net amount between two users, or one user's net against everyone"],
        ["User settles up by paying someone they owe.", "The system records it as a debt in the other direction", "Paying more than owed leaves the other person owing"],
    ],
    "out_of_scope": ["currencies (they will ask)", "simplifying debts (they will ask)", "login and notifications", "persistence"],
    "req_hint": "Adding an expense, reading who owes whom, settling up.",
    "req_say": "From your answers I get three requirements. **Each is something that happens, and each becomes a method: add_expense, balance and balances, settle.** Requirement 1 is the hard one: three ways to divide an amount that always total it exactly.",
    "req_why": "1 is add_expense, with the share rule inside the Split. 2 is balance and balances, both reads of the ledger. 3 is settle, which writes to the same ledger.",

    "entities": [("User", False, "Only a name is needed, and a string is enough"),
                 ("Group", True, "Holds the members; an expense is checked against it"),
                 ("Expense", True, "A payer, an amount and the shares: the record of what happened"),
                 ("Split", True, "Its kind decides how shares are computed: equal, exact or percent"),
                 ("Ledger", True, "The net amount owed between each pair of users"),
                 ("Splitwise", True, "Entry point: add_expense, settle, balance"),
                 ("Currency / Notification", False, "Out of scope; not modelled")],
    "ent_hint": "What does an expense need to know to divide itself? Where are the net balances kept?",
    "ent_say": "I underline the nouns. **Splitwise, Group, Expense, Split and Ledger stay.** A split looks like only a label, but its kind decides how each share is computed, so it carries a rule and earns a class. A user is only a name, so it stays a string.",
    "ent_why": "Four classes and one enum. Split carries the rule, Ledger holds the net per pair, Expense keeps history, and Group answers whether someone belongs.",

    "classes": [
        {"name": "Splitwise", "state": ["groups: Map<id, Group>  # every payer and participant is checked against one",
                                        "expenses: Expense[]  # append-only record of what happened",
                                        "ledger: Ledger  # req 2: the net owed per pair, so balances are one read"],
         "behaviour": ["create_group(group_id, members) -> void | error  # members for add_expense to check against",
                       "add_expense(group_id, payer, amount_cents, split) -> Expense | error  # req 1",
                       "settle(from_user, to_user, amount_cents) -> void | error  # req 3: a payment the other way",
                       "balance(a, b) -> cents  (positive: a owes b)  # req 2: net between two users",
                       "balances(user) -> Map<user, cents>  # req 2: one user against everyone"]},
        {"name": "Split", "state": ["kind: SplitKind  (EQUAL, EXACT, PERCENT -> enum)  # which rule computes the shares",
                                    "values: Map<user, number>  # who is in it, and cents or percent for them"],
         "behaviour": ["shares(amount_cents) -> Map<user, cents> | error  # req 1: always totals the amount"]},
        {"name": "Expense", "state": ["group_id: string  # where it happened",
                                      "payer: string  # who is owed the shares",
                                      "amount_cents: int  # integer cents, so no float drift",
                                      "shares: Map<user, cents>  # what each person owes the payer"], "behaviour": []},
        {"name": "Group", "state": ["members: Set<string>  # who an expense may involve"],
         "behaviour": ["has(user) -> bool  # add_expense checks every person"]},
        {"name": "Ledger", "state": ["net: Map<(debtor, creditor), cents>  # one number per pair; settling is an entry the other way"],
         "behaviour": ["add(debtor, creditor, cents) -> void  # the one write, for expenses and payments",
                       "owed(a, b) -> cents  # net of what b owes a",
                       "balances(user) -> Map<user, cents>  # req 2: the non-zero nets for one user"]},
    ],
    "class_hint": "Splitwise holds groups, expenses and a ledger. A split is a kind plus who is in it. The ledger is a map of pairs to cents.",
    "class_say": "**I start from the methods and ask what each one has to read.** Add_expense has to check membership, so it reads groups, and it has to divide the amount, so the split carries a kind and the people. It records an expense and updates who owes whom, so I keep a list of expenses and a ledger. Settle is a payment in the other direction, so it goes into the same ledger.",
    "class_why": "The Split decides the numbers, the Ledger holds them, and Splitwise only orchestrates. A new split kind touches Split alone.",
    "class_qa": [{"ask": "Why does the Ledger keep one number per ordered pair?",
                  "say": "Because every write is the same: someone owes someone more. **A payment is an entry the other way, and owed() nets both directions,** so settling needs no special path.",
                  "explain": ["Entries only grow. owed(a, b) is net[(a, b)] minus net[(b, a)]."]},
                 {"ask": "Why is the split a class and not a function per type?",
                  "say": "Because the kind and the people travel together. **Split knows who is in it and how to divide,** so add_expense reads split.values for membership and calls split.shares for the numbers."}],

    "map": {"center": ("Splitwise", "add_expense, settle"),
            "owned": [("Group", "members, has"), ("Ledger", "net per pair"), ("Expense", "payer, shares")],
            "uses": [("Split", "kind, values, shares"), ("SplitKind (enum)", "EQUAL, EXACT, PERCENT")]},

    "skeleton": {"q": "First the small pieces: the enum, the error, Split's fields and constructors, Expense, Group, Ledger, and Splitwise's __init__.",
                 "hint": "Split is a kind plus values. Expense is a frozen record. Group answers has(). Ledger keeps a map of pairs to cents with add and owed. Splitwise holds groups, expenses and a ledger.",
                 "code": HEAD + SPLIT_HEAD + EXPENSE + GROUP + LEDGER + SPLITWISE,
                 "why": "These come straight from the - state lines. Ledger.add and owed are two lines each, so they go here; the money logic is in the boxes after."},
    "methods": [
        {"name": "add_expense", "q": "Start with the most interesting method: add_expense(group_id, payer, amount_cents, split). Core logic and edge cases as comments, then the code. Name the hard part as a helper.",
         "hint": "Check the group, the amount and the members, shares = split.shares(amount), then record the expense.", "code": ADD_EXPENSE,
         "why": "Three steps at the level you would say out loud. How to divide the amount is the Split's job, so it is named here and written next."},
        {"name": "Split.shares", "q": "Split.shares(amount_cents): which rule runs for which kind?",
         "hint": "Check there is someone to split with. Then equal, exact or percent, each with its own helper.", "code": SPLIT_SHARES,
         "why": "This is the rule that makes Split a class. The kind picks the computation, and every branch returns shares that total the amount."},
        {"name": "Split._equal_shares", "q": "Split._equal_shares(amount_cents): 1000 cents over 3 people. Where does the leftover cent go?",
         "hint": "divmod gives a base and a leftover. The first people in the order given get one extra cent each.", "code": EQUAL_SHARES,
         "why": "The rule is stated and deterministic: base each, then one extra cent to the first people. 334, 333, 333 totals 1000. A set would make this order random, so the values are a dict."},
        {"name": "Split._percent_shares", "q": "Split._percent_shares(amount_cents): percents of an amount, in whole cents.",
         "hint": "Percents total 100. Floor each share with integer maths. The lost cents go out one by one, like the equal split.", "code": PERCENT_SHARES,
         "why": "Floors lose less than a cent each, so the leftover is smaller than the number of people and one pass hands it out. No float anywhere."},
        {"name": "Ledger.balances", "q": "Ledger.balances(user): everyone this user owes or is owed by, net.",
         "hint": "Collect the other side of every pair this user is in. For each, owed(), skipping zero.", "code": LEDGER_BALANCES,
         "why": "Balances are derived from the ledger on every read, never stored a second time, so they cannot drift from it."},
        {"name": "settle", "q": "settle(from_user, to_user, amount_cents): one person pays another.",
         "hint": "Check the people and the amount, then add a debt the other way.", "code": SETTLE,
         "why": "One write path. To_user now owes from_user, which cancels the debt because owed() nets both directions. Overpaying flips it."},
        {"name": "balance", "q": "balance(a, b): the net between two users.",
         "hint": "Check both are known, then ask the ledger.", "code": BALANCE,
         "why": "Positive means a owes b. The sign carries the direction."},
        {"name": "balances", "q": "balances(user): one user's net against everyone.",
         "hint": "Check the user, ask the ledger.", "code": BALANCES,
         "why": "Two lines, because the ledger owns the loop."},
    ],
    "helpers": [
        {"q": "Split._exact_shares: the amounts are given. What do you check?",
         "hint": "Their total must equal the expense. Return a copy.",
         "code": EXACT_SHARES,
         "why": "The caller did the maths; the Split only checks it. This is the rejected-expense case."},
        {"q": "Splitwise's helpers: create_group, _record, _get_group, _check_known.",
         "hint": "A unique id and members. Append the Expense, then one ledger entry per person who is not the payer. Lookups that raise.",
         "code": SPLITWISE_HELPERS,
         "why": "_record writes history first and then the ledger. The payer owes themselves nothing, and a zero share writes nothing."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Split computes shares, Ledger keeps net balances, Expense records an event, Splitwise orchestrates."),
            ("Open/closed", "A new split kind is a new branch in Split.shares and one helper. The ledger and Splitwise are not edited."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses. Every future split kind must return shares that total the amount."),
            ("Interface segregation", "Nothing to segregate yet: no interfaces."),
            ("Dependency inversion", "Splitwise builds its Ledger. Nothing is injected at this size."),
        ],
        "varies": [
            ("Split types (weights, adjustments)", "Strategy, once the if chain grows past four kinds", "today one dispatch in Split.shares"),
            ("Currencies", "No pattern: a field", "a rate stored on Expense, converted at add time"),
            ("Simplify debts", "No pattern: a read", "net each user over the Ledger; nothing written changes"),
            ("Two people adding at once", "No pattern: a lock", "one Lock around add_expense and settle"),
        ],
    },
    "extensions": [
        {"ask": "Simplify debts: the fewest payments to settle everyone.",
         "say": "From the ledger I net each user to one position, then match the biggest debtor with the biggest creditor until all are zero. It is a read over the ledger, so **nothing already written changes.** It gives few payments, not a proven minimum, since the exact minimum is NP-hard.",
         "code": EXT_SIMPLIFY, "code_title": "Simplify debts",
         "short_q": "Simplify debts", "short_a": "net each user, then match biggest debtor with biggest creditor; a read over the ledger"},
        {"ask": "Add a shares split: 2 parts for one person, 1 for another.",
         "say": "A new kind, SHARES, with weights as values. **It is the percent split with the weights' total in place of 100,** so I move the floor-and-leftover loop into one helper both use. Nothing outside Split changes.",
         "code": EXT_WEIGHTED, "code_title": "Weighted split",
         "short_q": "More split types", "short_a": "a new SplitKind; weights over their total; one shared helper; only Split changes"},
        {"ask": "Expenses in different currencies.",
         "say": "I convert to the group's currency when the expense is added and store the rate on the Expense. **Rates change, so I never recompute history.** Amounts stay integer cents in the group currency, and a CurrencyConverter is the only class that knows rates.",
         "short_q": "Currencies", "short_a": "convert at add time with a CurrencyConverter and store the rate on the expense; never recompute history"},
        {"ask": "Two people add expenses at the same time.",
         "say": "One lock around add_expense and settle, so the expense append and the ledger writes happen together. **If that blocks too much, I lock per group,** since groups share no ledger entries in practice.",
         "code": EXT_LOCK, "code_title": "One lock",
         "short_q": "Concurrent writes", "short_a": "one Lock around add_expense and settle; per-group locks if it blocks"},
    ],
    "faq": [("Why integer cents?", "Floats cannot hold 0.10 exactly, so thirds and percents drift. Cents are ints, and the leftover rule makes every split total the amount to the cent."),
            ("Why does the leftover go to the first people?", "Any fixed rule works if it is stated and deterministic. First in the order given means the same input always gives the same shares."),
            ("Is there a stdlib shortcut for the leftover?", "Yes: the largest remainder method, or Decimal quantize. Writing the divmod loop shows the rule, and it is four lines."),
            ("Why net per pair instead of per user?", "Per pair answers 'who owes me' directly. Net per user loses who, which is why simplify_debts is a separate read.")],

    "summary": ["**Five classes and one enum.** Splitwise checks the group and the amount, asks the Split for each share, and records the Expense. The Split's kind decides the rule: equal divides with the leftover cents going to the first people, exact checks its total, percent floors and hands out the lost cents. The Ledger holds one net number per pair, and settling is an entry the other way.",
                "**It extends in one place each time:** simplifying debts is a read over the ledger, a new split kind is one branch in Split, currencies are a rate on the Expense, and threads are one lock."],

    "golden": [
        ("Money is integer cents, and I say where the leftover cent goes: to the first people in the order given.", "it is the first thing they probe, and floats hide it."),
        ("Split is a class: a kind and who is in it. The kind decides how shares are computed.", "add_expense never knows the rules, so a new split kind touches one class."),
        ("Settling up is a debt the other way, so there is no special path.", "the ledger has one write, which keeps balances easy to trust."),
        ("Every split returns shares that total the amount to the cent, or raises.", "bad data is rejected at the one place that understands it."),
        ("Expenses are append-only records; balances are derived from the ledger, and a correction is a new entry.", "history stays true, and you can answer 'how did we get here'."),
        ("Simplify debts is a read over net positions, not a change to what is stored.", "it shows the ledger design pays off."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (simplify debts, a weighted shares split), and a run at the bottom.",
    "final_title": "splitwise.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the chain bob owes ann, cy owes bob collapses to one payment, cy to ann; 1000 split 2 to 1 gives 667 and 333; then cy is owed 400 net, paid by bob 333 and ann 67.",
}
