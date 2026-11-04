"""Shopping cart with discounts. A drill, same shape as locker.py. Money is integer cents everywhere.
Core: Item, Line, Discount (a kind and a value), Cart. Strategy classes arrive only in the extensions."""
import textwrap

D = textwrap.dedent


def method(src):
    """Dedent a method written at class level; the page shows it like this, and CORE indents it back."""
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


ADD = method('''
    def add(self, item: Item, qty: int = 1) -> None:
        """
        Core logic:
          1. Find the line for this item, or start one at quantity 0
          2. Raise its quantity
        Edge cases:
          1. Quantity zero or negative -> error
        """
        if qty <= 0:                                       # Edge 1: nothing to add, or a hidden remove
            raise CartError("qty must be positive")
        line = self.lines.get(item.sku)                    # Step 1: .get gives None for an item not yet in the cart
        if line is None:
            line = Line(item, 0)                           # a new line starts at 0, then Step 2 raises it
            self.lines[item.sku] = line
        line.qty += qty                                    # Step 2: adding again raises the count
''')

REMOVE = method('''
    def remove(self, sku: str, qty: int = 1) -> None:
        """
        Core logic:
          1. Find the line
          2. Lower its quantity
          3. Drop the line when it reaches zero
        Edge cases:
          1. Item not in the cart -> error
          2. Quantity zero, negative, or more than the cart holds -> error
        """
        line = self.lines.get(sku)                         # Step 1: .get gives None instead of a KeyError
        if line is None:                                   # Edge 1: nothing to remove
            raise CartError(f"{sku} is not in the cart")
        if qty <= 0 or qty > line.qty:                     # Edge 2: checked before changing anything
            raise CartError(f"cannot remove {qty} of {sku}")
        line.qty -= qty                                    # Step 2
        if line.qty == 0:                                  # Step 3: no empty lines, so subtotal stays honest
            del self.lines[sku]
''')

SUBTOTAL = method('''
    def subtotal(self) -> int:
        """
        Core logic:
          1. Add up price times quantity over every line, in cents
        Edge cases:
          1. Empty cart -> 0
        """
        total = 0                                          # Edge 1: an empty cart never enters the loop, so it stays 0
        for line in self.lines.values():                   # Step 1: the line knows its own price times quantity
            total += line.total()
        return total
''')

CHECKOUT = method('''
    def checkout(self, discount: Discount | None = None) -> int:
        """
        Core logic:
          1. Take the subtotal
          2. Ask the discount for the new total; no discount means no change
          3. Return the cents to pay; the cart is not emptied
        Edge cases:
          1. Empty cart -> 0
          2. A flat discount bigger than the total -> 0, never negative (inside Discount.apply)
        """
        total = self.subtotal()                            # Step 1: an empty cart gives 0 here (Edge 1)
        if discount is None:                               # Step 2: no discount, no change
            return total
        # the cart doesn't know which rule it got; it hands over a total and takes one back
        return discount.apply(total)
''')

LINE_TOTAL = method('''
    def total(self) -> int:
        """What this line costs in cents: the item's price for each unit bought."""
        return self.item.price * self.qty                  # the line owns both numbers, so the cart never reaches in
''')

DISCOUNT_APPLY = method('''
    def apply(self, total: int) -> int:
        """
        Core logic:
          1. A percent takes value / 100 of the total off, rounded down to a whole cent
          2. A flat discount takes value cents off
          3. Return the new total
        Edge cases:
          1. A flat discount bigger than the total -> 0, never negative
          2. A percent rounds the discount down, so 10 percent of 999 takes 99
        """
        if self.kind is Kind.PERCENT:
            off = total * self.value // 100                # Step 1 and Edge 2: whole-number division rounds down
            return total - off
        return max(0, total - self.value)                  # Step 2 and Edge 1: clamp at zero
''')

HEAD = D('''\
    from dataclasses import dataclass
    from enum import Enum


    class Kind(Enum):        # the two discount kinds; a typo'd string can't slip through
        PERCENT = "percent"
        FLAT = "flat"


    class CartError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

ITEM_LINE = D('''\


    @dataclass(frozen=True)
    class Item:
        """A product as the shop sells it. A record of what it is and costs; the quantity lives on the Line."""
        sku: str             # the key the cart finds a line by
        name: str
        price: int           # cents, an int so totals never drift like floats


    @dataclass
    class Line:
        """One row of the cart: an item and how many. The cart changes qty; the line says what it costs."""
        item: Item           # frozen Item, so the price can't change after it was added
        qty: int             # not frozen: add and remove raise and lower it
    ''')

DISCOUNT = D('''\


    class Discount:
        """One price rule, a kind and a value. It turns a total into a smaller total and knows nothing of the cart."""

        def __init__(self, kind: Kind, value: int):
            # reject bad values at creation, so apply never sees one
            if value < 0 or (kind is Kind.PERCENT and value > 100):
                raise CartError("bad discount value")
            self.kind = kind
            self.value = value       # a percent (0 to 100) or cents
    ''')

CART = D('''\


    class Cart:
        """The shopper's basket. It owns the lines and the sums; the pricing rule lives in Discount."""

        def __init__(self):
            self.lines = {}          # sku -> Line: adding the same item again is one lookup
    ''')

CORE = (HEAD + ITEM_LINE + in_class(LINE_TOTAL) + DISCOUNT + in_class(DISCOUNT_APPLY) + CART
        + in_class(CHECKOUT, ADD, REMOVE, SUBTOTAL))

DEMO = D('''\


    # ---- a quick run ----
    cart = Cart()
    cart.add(Item("p1", "pen", 250), 4)                  # 4 x 250 = 1000
    cart.add(Item("b1", "book", 1999))                   # qty defaults to 1
    print(cart.subtotal())
    print(cart.checkout(Discount(Kind.PERCENT, 10)))     # 2999 - 299 (rounded down) = 2700
    print(cart.checkout(Discount(Kind.FLAT, 500)))
    print(cart.checkout(Discount(Kind.FLAT, 5000)))      # bigger than the total: clamped to 0
    for bad in (lambda: cart.add(Item("x", "x", 1), 0), lambda: cart.remove("zz")):   # the two error paths
        try:
            bad()
        except CartError as e:
            print(e)
    one = Cart()
    one.add(Item("c1", "cup", 999))
    print(one.checkout(Discount(Kind.PERCENT, 10)))      # 10 percent of 999 is 99.9: takes 99, pays 900
    ''')
DEMO_OUT = "2999\n2700\n2499\n0\nqty must be positive\nzz is not in the cart\n900\n"

# ---- extensions ----
EXT_BOGO = D('''\
    class Discount:                      # now a base class; each rule is a subclass
        def apply(self, lines: list, total: int) -> int:
            raise NotImplementedError    # a rule must say how it changes the total


    class Percent(Discount):
        def __init__(self, pct: int):
            self.pct = pct

        def apply(self, lines, total):
            return total - total * self.pct // 100          # same maths as before, lines unused


    class BuyOneGetOne(Discount):
        def __init__(self, sku: str):
            self.sku = sku               # which item the offer is for

        def apply(self, lines, total):
            # this rule needs the lines: it must know how many of the item are in the cart
            for line in lines:
                if line.item.sku == self.sku:
                    return total - (line.qty // 2) * line.item.price    # every second one is free
            return total                                    # item not in the cart: no change


    # Cart.checkout passes the lines as well: discount.apply(list(self.lines.values()), total)
    ''')

EXT_STACK = D('''\
    def checkout(self, discounts: list) -> int:
        """Apply each discount to the running total, in the order given."""
        lines = list(self.lines.values())                   # taken once, every discount sees the same lines
        total = self.subtotal()
        for d in discounts:
            total = d.apply(lines, total)                   # each rule starts from the last rule's result
        return total
    ''')

EXT_COUPON = D('''\
    class Discount:
        def __init__(self, expires: datetime | None = None):
            self.expires = expires       # None means it never expires

        def is_expired(self, now: datetime) -> bool:
            return self.expires is not None and now > self.expires


    def checkout(self, discounts: list, now: datetime) -> int:    # now is passed in, never read here
        lines = list(self.lines.values())
        total = self.subtotal()
        for d in discounts:
            if d.is_expired(now):                           # an error, not a silent skip
                raise CartError("coupon expired")
            total = d.apply(lines, total)
        return total
    ''')

FINAL_HEAD = D('''\
    from dataclasses import dataclass
    from datetime import datetime


    class CartError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

FINAL_DISCOUNTS = D('''\


    class Discount:
        """The base of every rule: carries the optional expiry, leaves apply to the subclasses."""

        def __init__(self, expires: datetime | None = None):
            self.expires = expires       # None means it never expires

        def is_expired(self, now: datetime) -> bool:
            return self.expires is not None and now > self.expires

        def apply(self, lines: list, total: int) -> int:
            raise NotImplementedError    # each subclass says how it changes the total


    class Percent(Discount):
        """A percentage off the running total."""

        def __init__(self, pct: int, expires: datetime | None = None):
            if not 0 <= pct <= 100:                         # reject a bad percent at creation
                raise CartError("percent must be 0 to 100")
            super().__init__(expires)
            self.pct = pct

        def apply(self, lines, total):
            return total - total * self.pct // 100          # rounds the discount down to a whole cent


    class Flat(Discount):
        """A fixed number of cents off, never taking the total below zero."""

        def __init__(self, cents: int, expires: datetime | None = None):
            super().__init__(expires)
            self.cents = cents

        def apply(self, lines, total):
            return max(0, total - self.cents)               # clamp: the total is never negative


    class BuyOneGetOne(Discount):
        """Every second unit of one sku is free."""

        def __init__(self, sku: str, expires: datetime | None = None):
            super().__init__(expires)
            self.sku = sku               # the item the offer is for

        def apply(self, lines, total):
            # the only rule that reads the lines: it needs the quantity of its sku
            for line in lines:
                if line.item.sku == self.sku:
                    return total - (line.qty // 2) * line.item.price    # pairs of units, one of each pair free
            return total                                    # item not in the cart: no change
    ''')

FINAL_CHECKOUT = method('''
    def checkout(self, discounts: list, now: datetime) -> int:
        """Apply each discount to the running total, in the order given; an expired coupon is an error."""
        lines = list(self.lines.values())                   # taken once, every discount sees the same lines
        total = self.subtotal()
        for d in discounts:
            if d.is_expired(now):                           # now is passed in, so expiry is testable
                raise CartError("coupon expired")
            total = d.apply(lines, total)                   # the order of the list is the order of the maths
        return total
''')

FINAL = FINAL_HEAD + ITEM_LINE + in_class(LINE_TOTAL) + FINAL_DISCOUNTS + CART + in_class(FINAL_CHECKOUT, ADD, REMOVE, SUBTOTAL)
FINAL_DEMO = D('''\


    # ---- a quick run ----
    cart = Cart()
    cart.add(Item("p1", "pen", 250), 4)
    cart.add(Item("b1", "book", 1999))
    now = datetime(2026, 11, 2)                              # a fixed time, so the run is repeatable
    bogo = BuyOneGetOne("p1")
    print(cart.checkout([bogo], now))                        # 2 free pens: 2999 - 500
    print(cart.checkout([bogo, Percent(10), Flat(500)], now))
    print(cart.checkout([Flat(500), Percent(10)], now))      # same rules, other order, other total
    try:
        cart.checkout([Percent(10, expires=datetime(2026, 11, 1))], now)     # expired yesterday
    except CartError as e:
        print(e)
    ''')
FINAL_OUT = "2499\n1750\n2250\ncoupon expired\n"

PROBLEM = {
    "id": "cart", "title": "Shopping cart", "part_id": "lld-cart", "n": 4,
    "part_title": "Shopping cart with discounts", "minutes": 40,
    "lead": "A full cart round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. Money is integer cents. Discounts stay one small class until buy-one-get-one forces a family of them.",
    "prompt": "Design a shopping cart whose total can apply a percentage discount, a flat discount, or no discount.",
    "evidence": "A 2026 offer-holder was given this prompt; the discount twists (buy-one-get-one, stacking, a coupon that expires) are the usual follow-ups.",
    "drill": "part 4, the whole round.",

    "clarify": {
        "capabilities": [("What is in the cart: items with quantities?", "Yes: an id, a name and a price per item. Adding the same item again raises its quantity"),
                         ("What does the percentage apply to?", "The whole cart total"),
                         ("How is the cart used?", "Add and remove items, then checkout returns the amount to pay. Checkout does not empty the cart")],
        "errors": [("Can a flat discount push the total below zero?", "No, the total never goes below zero"),
                   ("What if a percentage does not divide evenly?", "Your call. Say what you pick and why"),
                   ("Bad input: zero quantity, removing something not in the cart?", "Return an error")],
        "scope": [("Can discounts be combined?", "One at a time for now. Expect me to ask about more"),
                  ("Tax, shipping, payment, stock?", "Out of scope. One currency, two decimals, in memory, one cart")],
    },
    "clarify_hint": "Items and quantities, what a percentage applies to, how the cart is used. Below zero, rounding, bad input. Combining discounts, tax and shipping.",
    "clarify_say": "**I group my questions in three buckets: what it must do, what goes wrong, where scope stops.** What is in the cart and what a percentage applies to first, because they decide the classes. Then a total below zero, rounding and bad input. Then combining discounts, tax and shipping.",
    "clarify_why": "Each question changes a class or a rule. Quantities give a line. 'What it applies to' fixes the discount's input. Rounding is the first thing they check, and it is yours to choose.",
    "answers": "Each item has an id, a name and a price, and adding it again raises its quantity. A percentage applies to the whole cart total. I add and remove items, and checkout returns the amount to pay without emptying the cart. A flat discount never takes the total below zero. If a percentage doesn't divide evenly, I pick the rule and say why. Zero quantities and removing something that isn't there are errors. One discount at a time for now. No tax, shipping, payment or stock.",
    "playback": ["Thanks, that's clear. **So: lines with quantities, money in integer cents, one discount at checkout that never goes below zero, and I'll round the discount down.** Out of scope: tax, shipping, payment, stock, and combining discounts, which I expect you to ask about."],

    "requirements": [
        ["User adds an item with a quantity.", "The cart keeps one line per item and raises its quantity", "Zero or negative quantity is an error"],
        ["User removes some or all of an item.", "The line shrinks and is dropped at zero", "An item not in the cart, or more than it holds, is an error"],
        ["The cart reports a subtotal in integer cents."],
        ["Checkout applies one discount (none, a percent or a flat amount) and returns the cents to pay.", "A percent is taken off the whole total and rounded down to a whole cent", "A flat discount never takes the total below zero; the cart is not emptied"],
    ],
    "out_of_scope": ["tax and shipping", "payment", "stock levels", "combining discounts (they will ask)"],
    "req_hint": "Add, remove, subtotal, checkout with one discount.",
    "req_say": "From your answers I get four requirements. **Each one is a thing the shopper does, and each becomes a method: add, remove, subtotal, checkout with one discount.** I say the error case with each so I don't forget it in the code.",
    "req_why": "Each requirement maps to a method: 1 is add, 2 is remove, 3 is subtotal, 4 is checkout and Discount.apply.",

    "entities": [("Item", True, "A sku, a name and a price in cents; shared by every line that holds it"),
                 ("Line", True, "An item and a quantity, and what that costs: what the cart actually stores"),
                 ("Cart", True, "Runs add, remove, subtotal and checkout"),
                 ("Discount", True, "A kind and a value; turns a total into a smaller total"),
                 ("Customer / Order / Payment", False, "External or out of scope; not modelled")],
    "ent_hint": "What does the cart store? What does a discount need to know? What about the customer and payment?",
    "ent_say": "I underline the nouns. **Item, line, cart and discount all carry data or a rule I need, so they stay.** The customer and payment are outside the system. Discount is a class, not an if in checkout, because the next question is another kind.",
    "ent_why": "Four small classes and an enum. Discount is a class, not an if inside checkout, because the next question is always 'now add another kind'.",

    "classes": [
        {"name": "Cart", "state": ["lines: Map<sku, Line>  # one line per item; adding again is one lookup"],
         "behaviour": ["add(item, qty) -> void | error  # req 1: raise the quantity",
                       "remove(sku, qty) -> void | error  # req 2: shrink, drop at zero",
                       "subtotal() -> cents  # req 3: sum of every line's total",
                       "checkout(discount) -> cents  # req 4: subtotal, then the discount"]},
        {"name": "Line", "state": ["item: Item  # what is being bought",
                                   "qty: int  # how many; the cart raises and lowers it"],
         "behaviour": ["total() -> cents  # req 3: price times quantity, so the cart never reaches inside"]},
        {"name": "Item", "state": ["sku: string  # the key the cart finds a line by",
                                   "name: string  # what the shopper sees",
                                   "price: int  (cents)  # subtotal needs it; an int avoids float drift"], "behaviour": []},
        {"name": "Discount", "state": ["kind: Kind  (PERCENT, FLAT -> enum)  # decides how apply works",
                                       "value: int  (a percent or cents)  # the amount that kind uses"],
         "behaviour": ["apply(total) -> cents  # req 4: smaller total, never below zero"]},
    ],
    "class_hint": "The cart holds lines by sku. A line holds an item and a quantity. A discount holds a kind and a value.",
    "class_say": "**I start from the methods the requirements gave me, then ask what each one has to read.** Add the same item again must raise a quantity, so the cart keeps lines in a map by sku. Subtotal needs a price and a quantity, so a line holds an item and a qty, and it answers total() itself. Checkout needs a kind and a value, so a discount holds those two.",
    "class_why": "A map by sku makes 'add the same item again' one lookup. Item is a record; the line prices itself, the cart sums the lines, and Discount holds the price rule.",
    "class_qa": [{"ask": "Why is money an int and not a float?",
                  "say": "A float can't hold most decimal prices exactly, so totals drift and comparisons fail. **I hold cents as an int and only convert to dollars when I print.** Where I divide, for a percentage, I round the discount down, so the customer never gets more than the stated percent.",
                  "explain": ["10 percent of 999 cents is 99.9. Rounding the discount down takes off 99, so 900 is paid."]}],

    "map": {"center": ("Cart", "add, remove, checkout"),
            "owned": [("Line", "item, qty, total()")],
            "uses": [("Discount", "kind, value"), ("Kind (enum)", "PERCENT, FLAT")]},

    "skeleton": {"q": "First the small classes: Kind, CartError, Item, Line, Discount's __init__, and the cart's __init__. Each line from the class design.",
                 "hint": "Item is frozen data. Line is an item and a quantity, and prices itself. Discount holds a kind and a value and checks them; apply comes later. The cart holds lines by sku.",
                 "code": HEAD + ITEM_LINE + in_class(LINE_TOTAL) + DISCOUNT + CART,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "checkout", "q": "Start with the most interesting method: checkout(discount). What does the discount get, and what comes back? Name the hard part.",
         "hint": "Take the subtotal, let the discount change it, return it. None means no change.", "code": CHECKOUT,
         "why": "The cart doesn't know which rule it was given. subtotal and Discount.apply are named here and written next."},
        {"name": "Discount.apply", "q": "Discount.apply(total): how does each kind turn a total into a smaller one?",
         "hint": "Percent: take value / 100 off, rounded down. Flat: take value cents off, never below zero.", "code": DISCOUNT_APPLY,
         "why": "The rounding and the clamp both live here, in one place. A new kind in the extension becomes a subclass and this branch goes away."},
        {"name": "add", "q": "add(item, qty): core logic and edge cases as comments, then the code.",
         "hint": "Find or start the line, raise the quantity. Edge: quantity not positive.", "code": ADD,
         "why": "A missing line starts at 0, so 'add again raises the quantity' is the same step for a new and an old item."},
        {"name": "remove", "q": "remove(sku, qty): core logic, edge cases, code.",
         "hint": "Find the line, lower it, drop it at zero. Edges: not in the cart, bad quantity.", "code": REMOVE,
         "why": "Dropping the line at zero keeps subtotal and the line count honest."},
    ],
    "helpers": {"q": "Now the helpers: subtotal and Line.total.",
                "starter": "def subtotal(self):\n    ...\n",
                "hint": "A line costs price times quantity. The subtotal adds the lines up, in cents.",
                "code": SUBTOTAL + "\n" + LINE_TOTAL,
                "why": "Checkout builds on subtotal, so discounts never touch line prices. (sum() over the lines does the same in one line.)"},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Item is a product, Line is one quantity, Discount is one price rule, Cart owns the lines and the sums."),
            ("Open/closed", "Core: a new kind edits Discount.apply. After buy-one-get-one, a new rule is a new Discount subclass and Cart.checkout is untouched."),
            ("Liskov substitution", "Percent, Flat and BuyOneGetOne work anywhere a Discount does: same apply(lines, total), still returns cents."),
            ("Interface segregation", "Nothing to segregate yet: Discount has one method, apply."),
            ("Dependency inversion", "checkout depends on the Discount it is handed, not on any one rule."),
        ],
        "varies": [
            ("A new discount rule (buy-one-get-one)", "Strategy", "Discount base class with Percent, Flat, BuyOneGetOne"),
            ("Stacking several discounts", "No pattern: a list", "checkout loops over the discounts in the order given"),
            ("A coupon that expires", "No pattern: a field", "optional expires on Discount, with now passed in"),
            ("How a percentage rounds", "No pattern: one line", "total * pct // 100 in Percent.apply"),
        ],
    },
    "extensions": [
        {"ask": "Add buy-one-get-one: every second pen is free.",
         "say": "A rule that depends on the lines can't take only the total, so **Discount becomes a base class with one method, apply(lines, total), and each rule is a subclass.** Percent and Flat move over unchanged; BuyOneGetOne is new. Cart changes in one spot: it passes the lines as well.",
         "code": EXT_BOGO, "code_title": "BOGO: Discount becomes a family",
         "short_q": "Buy one, get one", "short_a": "Discount becomes a base class with apply(lines, total); BuyOneGetOne is a new subclass"},
        {"ask": "Now stack several discounts, in a set order.",
         "say": "checkout takes a list and applies each to the running total, in the order given. **The order is the rule:** 10 percent then 500 off is not the same as 500 off then 10 percent, so I'd confirm the order with you.",
         "code": EXT_STACK, "code_title": "Stacking: checkout loops",
         "short_q": "Stack discounts", "short_a": "checkout takes a list and applies each to the running total in order; the order is a requirement"},
        {"ask": "A coupon that expires.",
         "say": "Every discount gets an optional expiry, and checkout is handed the time. **I pass the time in, so the same input gives the same total and I can test expiry with a fixed date.** An expired coupon is an error, not a silent skip.",
         "code": EXT_COUPON, "code_title": "Expiry: the time is passed in",
         "short_q": "Expiring coupon", "short_a": "an optional expires on Discount; checkout takes now and rejects an expired coupon"},
    ],
    "faq": [("Two customers share one cart?", "Out of scope here. If asked: one lock around add, remove and checkout, or a version number on the cart."),
            ("Prices change while the cart is open?", "The Item is frozen at add time, so the cart keeps the price the customer saw. A refresh would be an explicit new call.")],

    "summary": ["**Four small classes and an enum.** A Cart holds a Line per item; each Line is an Item and a quantity. Checkout takes the subtotal and lets one Discount, a kind and a value, change it. Money is integer cents and a percentage rounds down.",
                "**It grows by adding classes, not editing the cart:** buy-one-get-one turns Discount into a family that sees the lines, stacking is a loop over a list, and an expiring coupon is one field plus the time passed in."],

    "apart": [
        "**Money is integer cents, and you say your rounding rule where you divide.**",
        "**The cart does not know which discount it has.** Checkout hands the discount a total and takes a total back; a new discount is a new class, not an edit.",
        "**Each rule lives in one place:** 'never below zero' in the discount, the stacking order said back to them before you code it.",
        "**Pass the time in;** a discount with an end date never reads the clock itself."
    ],
    "golden": [
        ("Money is integer cents, and I name my rounding rule where I divide: the discount rounds down.", "it is the first thing they check, and floats hide the question instead of answering it."),
        ("The cart doesn't know which discount it was given; checkout hands it the total and takes back a total.", "every new rule is a new subclass and Cart stays the same."),
        ("The 'never below zero' rule lives in the discount, in one place.", "callers can't forget it, and a new rule has one obvious home."),
        ("Stacking order is part of the requirement: I say it back before I code it.", "10 percent then 500 off differs from 500 off then 10 percent."),
        ("The time is passed in, not read inside the discount.", "expiry becomes testable with a fixed date."),
        ("No factory, no event system, no tax or payment classes.", "it shows you built what the requirements need and nothing speculative."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with all three extensions applied (buy-one-get-one, stacking and an expiring coupon), and a run at the bottom.",
    "final_title": "cart.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "2499 (two pens free: 2999 minus 500); 1750 (then 10 percent off, then 500 off); 2250 (500 off first, then 10 percent: the order matters); coupon expired.",
}
