"""Vending machine. A drill in the Locker shape: VendingMachine, Slot and two enums (Denomination, State).
select() is the most interesting method; making change is a real loop over the machine's own coins, largest first."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the machine: the sale ----
SELECT = method('''
    def select(self, code: str) -> tuple:
        """
        Core logic:
          1. Only with money in, and only for a slot that exists and has stock
          2. The balance must cover the price
          3. Work out the change from the coins inside, the customer's coins included
          4. No exact change: refund everything and refuse the sale
          5. Dispense: take the product, move the money into the box, pay out the change
          6. Back to idle; return the product name and the change
        Edge cases:
          1. Nothing inserted -> error
          2. Unknown code, or sold out -> error, the money stays in
          3. Balance below the price -> error, the money stays in
          4. Exact change impossible -> refund, then error
        """
        if self.state is not State.HAS_MONEY:              # Edge 1: the state guard, one line
            raise VendingError("insert money first")
        slot = self.slots.get(code)
        if slot is None:                                   # Edge 2
            raise VendingError(f"no slot {code}")
        if not slot.is_available():
            raise VendingError(f"{slot.name} is sold out")
        balance = self.balance()                           # Step 1 done: now the money
        if balance < slot.price:                           # Edge 3: the customer can add more or cancel
            raise VendingError(f"{slot.name} costs {slot.price}, you put in {balance}")
        change = self._make_change(balance - slot.price)   # Step 3: the hard part, named now and written next
        if change is None:                                 # Edge 4: nothing has moved yet, so the refund is exact
            refund = self.cancel()
            raise VendingError(f"no exact change, refunded {self._value(refund)}")
        slot.take()                                        # Step 5: the product leaves
        for coin in Denomination:
            self.coins[coin] += self.inserted[coin] - change[coin]   # their coins join the box, the change leaves it
        self.inserted = self._empty()
        self.state = State.IDLE                            # Step 6
        return slot.name, change
''')

MAKE_CHANGE = method('''
    def _make_change(self, amount: int) -> dict | None:
        """
        Core logic:
          1. Start from the largest denomination
          2. Take as many of it as fit in the amount and as the machine has (the box plus this customer's coins)
          3. Carry the rest to the next smaller one
          4. Something left after the smallest -> None, the sale is refused
        Edge cases:
          1. Amount is 0 -> no coins, an all-zero dict
          2. This only plans: nothing moves until select commits, so a None leaves the machine as it was
        """
        change = self._empty()
        remaining = amount
        for coin in sorted(Denomination, key=lambda c: c.value, reverse=True):   # Step 1: largest first
            have = self.coins[coin] + self.inserted[coin]
            use = min(remaining // coin.value, have)       # Step 2: as many as fit, and no more than we hold
            change[coin] = use
            remaining -= use * coin.value                  # Step 3
        if remaining > 0:                                  # Step 4 / Edge 2: ran out of coins before the amount
            return None
        return change
''')

INSERT = method('''
    def insert(self, coin: Denomination) -> int:
        """
        Core logic:
          1. Check it is a denomination the machine takes
          2. Hold it with the customer's other coins
          3. Move to HAS_MONEY
          4. Return the new balance
        Edge cases:
          1. Not a Denomination -> error
        """
        if not isinstance(coin, Denomination):             # Edge 1
            raise VendingError("not a coin or note we take")
        self.inserted[coin] += 1                           # Step 2: held apart, so a cancel can give the same coins back
        self.state = State.HAS_MONEY                       # Step 3
        return self.balance()                              # Step 4
''')

CANCEL = method('''
    def cancel(self) -> dict:
        """
        Core logic:
          1. Hand back exactly the coins the customer inserted
          2. Clear them and go back to idle
        Edge cases:
          1. Nothing inserted -> an all-zero refund, no error
        """
        refund = self.inserted                             # Step 1: the same coins, so no change problem on a cancel
        self.inserted = self._empty()                      # Step 2
        self.state = State.IDLE                            # Edge 1: idle stays idle
        return refund
''')

RESTOCK = method('''
    def restock(self, code: str, count: int) -> None:
        """
        Core logic:
          1. Operator only: not while a customer is mid-purchase
          2. Add the count to the slot
        Edge cases:
          1. Money is waiting -> error
          2. Unknown code, or a count of zero or less -> error
        """
        self._require_idle()                               # Edge 1
        slot = self.slots.get(code)
        if slot is None or count <= 0:                     # Edge 2
            raise VendingError("unknown slot or bad count")
        slot.refill(count)                                 # Step 2
''')

LOAD_COINS = method('''
    def load_coins(self, coin: Denomination, count: int) -> None:
        """
        Core logic:
          1. Operator only: not while a customer is mid-purchase
          2. Add the coins to the change box
        Edge cases:
          1. Money is waiting, or a count of zero or less -> error
        """
        self._require_idle()                               # Edge 1
        if count <= 0:
            raise VendingError("bad count")
        self.coins[coin] += count                          # Step 2
''')

HELPERS = method('''
    def balance(self) -> int:
        return self._value(self.inserted)                  # derived from the held coins, never stored twice

    def _require_idle(self) -> None:
        if self.state is not State.IDLE:                   # a customer has money in: the operator waits
            raise VendingError("a customer is mid-purchase")

    @staticmethod
    def _value(coins: dict) -> int:
        return sum(coin.value * n for coin, n in coins.items())

    @staticmethod
    def _empty() -> dict:
        return {coin: 0 for coin in Denomination}          # every denomination present, so no key checks anywhere
''')

HEAD = D('''\
    from enum import Enum


    class Denomination(Enum):
        NICKEL = 5                   # the values are cents: summing coins and making change both read them
        DIME = 10
        QUARTER = 25
        DOLLAR = 100                 # a note and a coin are the same thing here: a value the machine can hold


    class State(Enum):
        IDLE = "idle"                # nothing inserted: only the operator can act
        HAS_MONEY = "has money"      # a balance is waiting for a choice


    class VendingError(Exception):     # one error type the caller can catch for every refusal
        pass
    ''')

SLOT = D('''\


    class Slot:
        """One column: one product at one price. It answers whether it can sell."""

        def __init__(self, name: str, price: int, count: int):
            self.name = name                 # shown in the error messages and returned from select
            self.price = price               # select compares it with the balance
            self.count = count               # sold out when it reaches zero

        def is_available(self) -> bool:
            return self.count > 0

        def take(self) -> None:
            self.count -= 1                  # one product leaves

        def refill(self, count: int) -> None:
            self.count += count
    ''')

MACHINE = D('''\


    class VendingMachine:
        """The entry point: holds the slots and the coins, and runs insert, select and cancel."""

        def __init__(self, slots: dict):
            self.slots = slots                        # code -> Slot; select looks the product up by code
            self.coins = self._empty()                # the change box: denomination -> how many are inside
            self.inserted = self._empty()             # this customer's coins, held until a sale or a cancel
            self.state = State.IDLE                   # which actions are allowed right now
    ''')

CORE = (HEAD + SLOT + MACHINE
        + in_class(SELECT, MAKE_CHANGE, INSERT, CANCEL, RESTOCK, LOAD_COINS, HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    def show(coins):
        return ", ".join(f"{c.name.lower()} x{n}" for c, n in coins.items() if n) or "none"


    m = VendingMachine({"A1": Slot("chips", 75, 2), "A2": Slot("gum", 35, 1), "B1": Slot("candy", 60, 3)})
    m.load_coins(Denomination.QUARTER, 2)
    m.load_coins(Denomination.DIME, 2)
    m.load_coins(Denomination.NICKEL, 1)


    def buy(code):
        try:
            name, change = m.select(code)
            print(f"{name}, change: {show(change)}")
        except VendingError as e:
            print(e)


    m.insert(Denomination.DOLLAR)
    buy("A1")                                     # a sale with change: 100 - 75 = 25, one quarter from the box
    m.insert(Denomination.QUARTER)
    buy("A1")                                     # 25 in, price 75: error, and the money stays
    print("balance:", m.balance())
    print("refund:", show(m.cancel()))            # cancel hands back the same quarter
    m.insert(Denomination.QUARTER)
    m.insert(Denomination.QUARTER)
    buy("A2")                                     # gum is 35: 15 back as a dime and a nickel, the last gum
    m.insert(Denomination.QUARTER)
    buy("A2")                                     # sold out, and the quarter stays in
    print("refund:", show(m.cancel()))
    m.insert(Denomination.DOLLAR)
    buy("B1")                                     # candy is 60: 40 back needs a nickel, and the box has none
    buy("B1")                                     # the money was refunded, so nothing is waiting
    ''')
DEMO_OUT = ("chips, change: quarter x1\nchips costs 75, you put in 25\nbalance: 25\nrefund: quarter x1\n"
            "gum, change: nickel x1, dime x1\ngum is sold out\nrefund: quarter x1\nno exact change, refunded 100\n"
            "insert money first\n")

# ---- extensions ----
EXT_STATES = D('''\
    class IdleState:
        def insert(self, machine, coin):
            machine.hold(coin)
            machine.state = HasMoneyState()
        def select(self, machine, code):
            raise VendingError("insert money first")
        def cancel(self, machine):
            return machine.refund()           # nothing held: an empty refund


    class HasMoneyState:
        def insert(self, machine, coin):
            machine.hold(coin)
        def select(self, machine, code):
            ...                               # the sale: the body of today's select
        def cancel(self, machine):
            machine.state = IdleState()
            return machine.refund()


    class VendingMachine:
        def select(self, code):
            return self.state.select(self, code)   # every public method hands over to the current state
    ''')

EXT_CHANGE = D('''\
    class VendingMachine:
        def _make_change(self, amount: int) -> dict | None:
            coins = sorted(Denomination, key=lambda c: c.value, reverse=True)
            have = {c: self.coins[c] + self.inserted[c] for c in coins}
            return self._search(amount, coins, 0, have)    # the greedy loop becomes a search; select is unchanged

        def _search(self, remaining, coins, i, have):
            ...                                            # try the most of coins[i], then fewer; first split that reaches 0
    ''')

EXT_PAYMENT = D('''\
    class CashPayment:
        def charge(self, amount: int) -> bool: ...   # the held coins cover it

    class CardPayment:
        def charge(self, amount: int) -> bool: ...   # the reader approves it

    # select asks self.payment.charge(slot.price) instead of reading the balance;
    # change is the cash path only, so CardPayment returns an empty change dict
    ''')

# the final file: core + backtracking change + a low-stock report
F_MAKE_CHANGE = method('''
    def _make_change(self, amount: int) -> dict | None:
        """Same contract as before. Greedy gave up on 30 from one quarter and three dimes; this does not."""
        coins = sorted(Denomination, key=lambda c: c.value, reverse=True)
        have = {c: self.coins[c] + self.inserted[c] for c in coins}
        return self._search(amount, coins, 0, have)
''')

F_SEARCH = method('''
    def _search(self, remaining: int, coins: list, i: int, have: dict) -> dict | None:
        """Try the most of coins[i] first, then fewer. The first split that reaches 0 wins, so large coins still lead."""
        if remaining == 0:
            return self._empty()
        if i == len(coins):                                # no denominations left and something still owed
            return None
        coin = coins[i]
        most = min(remaining // coin.value, have[coin])
        for n in range(most, -1, -1):
            rest = self._search(remaining - n * coin.value, coins, i + 1, have)
            if rest is not None:
                rest[coin] = n
                return rest
        return None
''')

F_LOW_STOCK = method('''
    def low_stock(self, limit: int) -> list:
        """Slot codes with at most `limit` left, in code order, for the operator's round."""
        return [code for code in sorted(self.slots) if self.slots[code].count <= limit]
''')

FINAL = (HEAD + SLOT + MACHINE
         + in_class(SELECT, F_MAKE_CHANGE, F_SEARCH, INSERT, CANCEL, RESTOCK, LOAD_COINS, HELPERS, F_LOW_STOCK))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    def show(coins):
        return ", ".join(f"{c.name.lower()} x{n}" for c, n in coins.items() if n) or "none"


    m = VendingMachine({"T1": Slot("tea", 70, 1), "T2": Slot("juice", 90, 5)})
    m.load_coins(Denomination.QUARTER, 1)
    m.load_coins(Denomination.DIME, 3)
    m.insert(Denomination.DOLLAR)
    name, change = m.select("T1")                 # 30 back: greedy takes the quarter and is stuck; the search finds 3 dimes
    print(name, "change:", show(change))
    print("low stock:", m.low_stock(1))
    m.insert(Denomination.QUARTER)
    try:
        m.restock("T1", 4)
    except VendingError as e:
        print(e)
    m.cancel()
    m.restock("T1", 4)
    print("low stock:", m.low_stock(1))
    ''')
FINAL_OUT = "tea change: dime x3\nlow stock: ['T1']\na customer is mid-purchase\nlow stock: []\n"


PROBLEM = {
    "id": "vending", "title": "Vending machine", "part_id": "lld-vending", "n": 12,
    "part_title": "Vending machine", "minutes": 45,
    "lead": "A vending machine round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The modes are a State enum with guards, not State classes. Implementation starts with select, names the change-making as a helper, then writes it as a loop over the machine's own coins.",
    "prompt": "Design a vending machine (one report: 'snacks vending machine, classes, fields, methods').",
    "evidence": "GeeksforGeeks Sept 2022 (SDE-2); 1point3acres Feb 2026 (SDE2); TechPrep.",
    "drill": "part 12, Vending machine.",

    "clarify": {
        "capabilities": [("What does the customer put in, and how do they choose?", "Coins and one-dollar notes, as denominations; then a slot code"),
                         ("Is change given, and from where?", "Yes, from the coins inside the machine, largest first"),
                         ("Can the customer back out?", "Yes: cancel returns what they inserted")],
        "errors": [("Sold out or unknown slot?", "Return an error and keep the money in the balance"),
                   ("Not enough money inserted?", "Return an error; the customer can add more or cancel"),
                   ("Exact change can't be made?", "Refuse the sale and refund everything inserted")],
        "scope": [("Cards, remote stock reports, a screen?", "No: cash only, in memory"),
                  ("Who restocks, and when?", "An operator refills slots and loads coins, only when no customer is mid-purchase")],
    },
    "clarify_hint": "What goes in, how they choose, change and where it comes from, cancel. Sold out, too little money, change impossible. Cards, reports, restocking.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** Change comes first, because it must come from coins inside the machine, and that is the hard part. Then the errors, and the one I most want pinned down is what happens to the customer's money when change is impossible.",
    "clarify_why": "Every question changes a class or a method. Where change comes from gives the coin box and _make_change. The error answers say which refusals keep the money and which refund it. The restocking answer gives the operator methods and the guard that keeps them out of a purchase.",
    "answers": "Coins and one-dollar notes, as denominations, then a slot code. Change comes from the coins inside, largest first. Cancel returns what was inserted. Unknown or sold out: error, money stays. Too little money: error, money stays. Exact change impossible: refuse and refund everything. Cash only, in memory, no reports or screen. An operator restocks and loads coins when no customer is mid-purchase.",
    "playback": ["Thanks, that's clear. **So: insert money, pick a slot, get the product and change from the machine's own coins, or cancel for a refund.** If the change can't be made I refuse the sale and refund. The operator restocks only between customers. Out of scope: cards, reports, a screen."],

    "requirements": [
        ["A customer inserts coins or notes.", "The machine holds them and adds them to the balance", "An error for something that is not a denomination it takes"],
        ["A customer selects a slot.", "If the balance covers the price, the machine dispenses the product and pays out the change from its coins", "An error if nothing is inserted, the slot is unknown or sold out, or the balance is too low (money stays); exact change impossible refunds everything"],
        ["A customer cancels.", "The machine returns exactly the coins that were inserted"],
        ["An operator restocks slots and loads coins.", "The machine adds them", "An error while a customer has money in"],
    ],
    "out_of_scope": ["card payments", "remote stock reports", "promotions", "a screen or UI", "threads and power cuts"],
    "req_hint": "Insert, select, cancel, the operator.",
    "req_say": "From your answers I get four requirements. **Each is something that happens, and each becomes a method: insert, select, cancel, and the operator's restock and load_coins.** Requirement 2 is the hard one: pay the change out of coins the machine really has, or refuse and refund.",
    "req_why": "Each requirement maps to a method: 1 is insert, 2 is select, 3 is cancel, 4 is restock and load_coins. The errors in 2 are the edge cases of select.",

    "entities": [("Product", False, "Only a name and a price, and those live on the slot"),
                 ("Slot", True, "A product name, a price and a count; it answers whether it can sell"),
                 ("VendingMachine", True, "Holds the slots and coins, and runs insert, select and cancel"),
                 ("Denomination (coin or note)", True, "A fixed set of values, read both to add up the balance and to make change: an enum"),
                 ("State", True, "Idle or has money: which actions are allowed. An enum with guards"),
                 ("Change", False, "A dict of denomination to count; nothing asks it a question"),
                 ("Customer / Operator", False, "External; not modelled")],
    "ent_hint": "Does a product need its own class? What carries the rule that decides whether a restock is allowed?",
    "ent_say": "I underline the nouns. **The machine, the slot and the denomination stay, and the state stays as an enum.** A product is only a name and a price, and those live on the slot. A denomination is a fixed set of values, and change-making reads them, so it is an enum. Change itself is a count per denomination.",
    "ent_why": "Two classes and two enums. Slot earns its class because select asks it whether it can sell. Denomination is an enum because the set is fixed and the value is read in two places.",

    "classes": [
        {"name": "VendingMachine", "state": ["slots: Map<code, Slot>  # select looks the product up by code",
                                             "coins: Map<Denomination, int>  # the change box; change can only come from coins inside",
                                             "inserted: Map<Denomination, int>  # this customer's coins, held so a cancel gives the same ones back",
                                             "state: State  (IDLE, HAS_MONEY -> enum)  # decides which actions are allowed"],
         "behaviour": ["insert(coin) -> balance | error  # req 1",
                       "select(code) -> (name, change) | error  # req 2: dispense and pay out the change",
                       "cancel() -> refund  # req 3: the coins that were inserted",
                       "restock(code, count) -> void | error  # req 4: operator",
                       "load_coins(coin, count) -> void | error  # req 4: operator",
                       "balance() -> int  # the value of the held coins",
                       "_make_change(amount) -> change | None  # largest coin first; None when it can't be made"]},
        {"name": "Slot", "state": ["name: string  # the product it holds",
                                   "price: int  # select compares it with the balance",
                                   "count: int  # sold out when it reaches zero"],
         "behaviour": ["is_available() -> bool  # select asks the slot, not its count",
                       "take() -> void  # one product leaves",
                       "refill(count) -> void  # req 4"]},
    ],
    "class_hint": "The machine holds the slots, the coin box, the customer's coins and a state. A slot holds a name, a price and a count.",
    "class_say": "**I start from the methods and ask what each one has to read.** Select has to read the price, so a slot keeps a price and a count. It has to read the balance, so the machine holds the customer's coins. It makes change from coins already inside, so there is a coin box, a count per denomination. And which action is allowed depends on the mode, so that is a State enum.",
    "class_why": "The machine orchestrates; the slot answers questions about itself. The customer's coins are held apart from the box so a cancel can return exactly those coins and never has to make change.",
    "class_qa": [{"ask": "Why keep the customer's coins apart from the change box?",
                  "say": "Because a cancel should give back the coins that went in. **If they were mixed into the box, a cancel would have to make change too, and could fail.** They join the box only when the sale goes through.",
                  "explain": ["The change search still counts them as available: a customer who pays with a dollar may get a quarter that was theirs."]},
                 {"ask": "Is the State enum needed, when the balance already says whether money is in?",
                  "say": "The state names the mode, and the guards read it. **Balance and state can drift apart in a bigger machine, and the enum is where the next mode goes.** Today it is two values, so it is an enum and two ifs, not classes.",
                  "explain": ["Only the state is stored as a flag. The balance is always computed from the held coins."]}],

    "map": {"center": ("VendingMachine", "insert, select, cancel"),
            "owned": [("Slot", "name, price, count")],
            "uses": [("Denomination (enum)", "NICKEL to DOLLAR"), ("State (enum)", "IDLE, HAS_MONEY")]},

    "skeleton": {"q": "First the small pieces: the two enums, the error, Slot, and the machine's __init__.",
                 "hint": "Denomination has the cent values. Slot holds a name, a price and a count, with is_available, take and refill. The machine holds the slots, the coin box, the customer's coins and a state.",
                 "code": HEAD + SLOT + MACHINE,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "select", "q": "Start with the most interesting method: select(code). Core logic and edge cases as comments, then the code. Name the hard part as a helper.",
         "hint": "Guard the state, find the slot, check stock and price, change = self._make_change(...), refuse and refund if None, then take the product, move the money, return.", "code": SELECT,
         "why": "Real work in a dozen lines, and the order matters: every check comes before anything moves. Making change is the higher logic, so it gets a name here and its own method next."},
        {"name": "_make_change", "q": "_make_change(amount): pay it out of the machine's own coins. Write the loop.",
         "hint": "Largest denomination first. Take as many as fit and as many as the machine holds. Carry the rest down. Anything left at the end: None.", "code": MAKE_CHANGE,
         "why": "It only plans and moves nothing, so a None leaves the machine exactly as it was and the refund is exact. Greedy is right for ordinary denominations; the faq covers where it is not."},
        {"name": "insert", "q": "insert(coin): what does a coin do?",
         "hint": "Check it is a Denomination, hold it with the customer's coins, go to HAS_MONEY, return the balance.", "code": INSERT,
         "why": "Held apart from the box, so cancel is a plain hand-back."},
        {"name": "cancel", "q": "cancel(): give the money back.",
         "hint": "Return the held coins, clear them, go idle. Nothing inserted gives an empty refund.", "code": CANCEL,
         "why": "Works from every state, so money can never get stuck. select reuses it for the no-change refund."},
        {"name": "restock", "q": "restock(code, count): the operator refills a slot.",
         "hint": "Not while money is waiting. Unknown slot or a count of zero or less is an error.", "code": RESTOCK,
         "why": "The same state guard that select uses, now keeping the operator out of a purchase."},
        {"name": "load_coins", "q": "load_coins(coin, count): the operator fills the change box.",
         "hint": "Same guard as restock, then add to the box.", "code": LOAD_COINS,
         "why": "Without it the machine could never give change in a test or a demo."},
    ],
    "helpers": {"q": "The helpers: balance, _require_idle, _value and _empty.",
                "hint": "Sum the held coins. Raise unless idle. Value is the sum of value times count. Empty is a zero for every denomination.",
                "code": HELPERS,
                "why": "_empty gives every denomination a key, so no code checks whether a coin is in the dict."},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute. The modes get an enum and guards now, and State classes only if each mode grows its own behaviour.",
        "solid": [
            ("Single responsibility", "The slot knows its stock, the machine runs the sale, and change-making is one method that only plans."),
            ("Open/closed", "A new denomination is one line in the enum: the balance and the change loop read the enum, so neither is edited."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses. State classes would each answer insert, select and cancel."),
            ("Interface segregation", "No interfaces. A payment method would have one job: charge an amount or fail."),
            ("Dependency inversion", "The machine owns its coins. A Payment object would be handed in once card payments arrive."),
        ],
        "varies": [
            ("More modes (maintenance, card reader waiting)", "State, once each mode behaves differently in three or more methods", "today two values and two guards; Dispensing never exists between calls, because the sale is one call"),
            ("Card payments", "Strategy", "cash and card both charge an amount or fail"),
            ("Change algorithm (greedy, then exact search)", "No pattern: replace one method", "_make_change keeps its contract"),
            ("Two customers on real threads", "No pattern: a lock", "one Lock around the public methods"),
        ],
    },
    "extensions": [
        {"ask": "The greedy loop says no change for 30 when the box has one quarter and three dimes.",
         "say": "Greedy takes the quarter and is stuck with 5. **I keep the contract and replace the body with a search: try the most of the largest coin, then fewer, and take the first split that reaches zero.** Select does not change.",
         "code": EXT_CHANGE, "code_title": "Exact change by search",
         "short_q": "Greedy fails", "short_a": "replace _make_change's body with a search over counts; the contract and select stay"},
        {"ask": "More modes, each with its own rules: maintenance, a card reader waiting, a door open.",
         "say": "When the ifs on the state grow, **each mode becomes a class with the same methods** (insert, select, cancel), and the machine hands every call to its current state. A new mode is a new class and the sale logic moves into one of them.",
         "code": EXT_STATES, "code_title": "State classes",
         "short_q": "Many more modes", "short_a": "each mode becomes a class with insert, select and cancel; the machine delegates to the current one"},
        {"ask": "Add card payments.",
         "say": "A payment method with one job: charge an amount, or fail. Cash and card are two of them, and **select asks the payment instead of reading the balance.** Card has no change, so its change is empty.",
         "code": EXT_PAYMENT, "code_title": "A payment strategy",
         "short_q": "Card payments", "short_a": "a Payment strategy: cash and card both charge an amount or fail; select asks it"},
        {"ask": "The operator wants to know what is running low.",
         "say": "A low_stock(limit) on the machine that asks each slot for its count. **Slot already owns the count, so nothing else changes.**",
         "short_q": "Low stock report", "short_a": "low_stock(limit) returns the slot codes at or under the limit"},
    ],
    "faq": [("Why not State classes from the start?", "There are two modes and the difference is one guard in select and one in restock. Classes would spread the sale logic over files to avoid two ifs. Pull them out when each mode needs different behaviour in most methods."),
            ("Why a State enum when the balance already says it?", "The balance is derived and the enum is the mode the guards read. They agree today. The enum is the place a mode that is not about money, like maintenance, would go."),
            ("Does largest-first always find change when it exists?", "No. It is exact for ordinary denominations with enough of each, but a limited box can break it: 30 from one quarter and three dimes. Say that, and offer the search in the first extension."),
            ("What about DISPENSING as a state?", "The sale is one call, so no other call can arrive in the middle. It becomes real with hardware that takes time, or with threads."),
            ("Could the loop use a stdlib shortcut?", "divmod gives the quotient and the remainder in one call. Spelled out as min and subtract, each step is visible, and that is what the interviewer wants to read.")],

    "summary": ["**Two classes and two enums.** The VendingMachine holds the slots, a coin box, the customer's coins and a state. Select checks the state, the slot and the price, asks _make_change for the change, and only then moves anything. _make_change walks the denominations from the largest, using the box plus the customer's coins, and returns None when it can't. A None refunds the customer and refuses the sale.",
                "**It extends in one place each time:** a smarter change search replaces one method, more modes turn the enum into State classes, card payments are a strategy that select asks, and a low-stock report asks each slot for its count."],

    "golden": [
        ("select checks everything before it moves anything.", "a refusal then leaves the machine as it was, which makes the refund exact and the money never stuck."),
        ("Change is a real loop over the machine's own coins, largest first.", "the interviewer's first probe is what if you can't make change, and the answer is None, refuse and refund."),
        ("The customer's coins are held apart until the sale goes through.", "a cancel is then a plain hand-back, and it can never fail for lack of change."),
        ("An enum with guards first; State classes only when the modes grow their own behaviour.", "it shows you don't reach for a pattern before the requirements need it."),
        ("_make_change only plans; select commits.", "that separation is the senior signal: a failure in the middle can't charge a customer without giving the product."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (exact change by search, a low-stock report), and a run at the bottom.",
    "final_title": "vending.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "30 back from one quarter and three dimes is found by the search (three dimes) where greedy would fail; tea is then low; the operator is refused while a quarter is in, and after a cancel the restock clears the low-stock list.",
}
