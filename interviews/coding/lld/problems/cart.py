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
        if qty <= 0:
            raise CartError("qty must be positive")
        line = self.lines.setdefault(item.sku, Line(item, 0))
        line.qty += qty
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
        line = self.lines.get(sku)
        if line is None:
            raise CartError(f"{sku} is not in the cart")
        if qty <= 0 or qty > line.qty:
            raise CartError(f"cannot remove {qty} of {sku}")
        line.qty -= qty
        if line.qty == 0:
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
        return sum(l.item.price * l.qty for l in self.lines.values())
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
        total = self.subtotal()
        return total if discount is None else discount.apply(total)
''')

HEAD = D('''\
    from dataclasses import dataclass
    from enum import Enum


    class Kind(Enum):
        PERCENT = "percent"
        FLAT = "flat"


    class CartError(Exception):
        pass
    ''')

ITEM_LINE = D('''\


    @dataclass(frozen=True)
    class Item:
        sku: str
        name: str
        price: int           # cents


    @dataclass
    class Line:
        item: Item
        qty: int
    ''')

DISCOUNT = D('''\


    class Discount:
        def __init__(self, kind: Kind, value: int):
            if value < 0 or (kind is Kind.PERCENT and value > 100):
                raise CartError("bad discount value")
            self.kind = kind
            self.value = value       # a percent (0 to 100) or cents

        def apply(self, total: int) -> int:
            if self.kind is Kind.PERCENT:
                return total - total * self.value // 100     # the discount rounds down to a whole cent
            return max(0, total - self.value)
    ''')

CART = D('''\


    class Cart:
        def __init__(self):
            self.lines = {}          # sku -> Line
    ''')

CORE = HEAD + ITEM_LINE + DISCOUNT + CART + in_class(ADD, REMOVE, SUBTOTAL, CHECKOUT)

DEMO = D('''\


    # ---- a quick run ----
    cart = Cart()
    cart.add(Item("p1", "pen", 250), 4)
    cart.add(Item("b1", "book", 1999))
    print(cart.subtotal())
    print(cart.checkout(Discount(Kind.PERCENT, 10)))
    print(cart.checkout(Discount(Kind.FLAT, 500)))
    print(cart.checkout(Discount(Kind.FLAT, 5000)))
    for bad in (lambda: cart.add(Item("x", "x", 1), 0), lambda: cart.remove("zz")):
        try:
            bad()
        except CartError as e:
            print(e)
    one = Cart()
    one.add(Item("c1", "cup", 999))
    print(one.checkout(Discount(Kind.PERCENT, 10)))
    ''')
DEMO_OUT = "2999\n2700\n2499\n0\nqty must be positive\nzz is not in the cart\n900\n"

# ---- extensions ----
EXT_BOGO = D('''\
    class Discount:                      # now a base class; each rule is a subclass
        def apply(self, lines: list, total: int) -> int:
            raise NotImplementedError


    class Percent(Discount):
        def __init__(self, pct: int):
            self.pct = pct

        def apply(self, lines, total):
            return total - total * self.pct // 100


    class BuyOneGetOne(Discount):
        def __init__(self, sku: str):
            self.sku = sku

        def apply(self, lines, total):
            line = next((l for l in lines if l.item.sku == self.sku), None)
            if line is None:
                return total
            return total - (line.qty // 2) * line.item.price    # every second one is free


    # Cart.checkout passes the lines as well: discount.apply(list(self.lines.values()), total)
    ''')

EXT_STACK = D('''\
    def checkout(self, discounts: list) -> int:
        """Apply each discount to the running total, in the order given."""
        lines = list(self.lines.values())
        total = self.subtotal()
        for d in discounts:
            total = d.apply(lines, total)
        return total
    ''')

EXT_COUPON = D('''\
    class Discount:
        def __init__(self, expires: datetime | None = None):
            self.expires = expires

        def is_expired(self, now: datetime) -> bool:
            return self.expires is not None and now > self.expires


    def checkout(self, discounts: list, now: datetime) -> int:
        lines = list(self.lines.values())
        total = self.subtotal()
        for d in discounts:
            if d.is_expired(now):
                raise CartError("coupon expired")
            total = d.apply(lines, total)
        return total
    ''')

FINAL_HEAD = D('''\
    from dataclasses import dataclass
    from datetime import datetime


    class CartError(Exception):
        pass
    ''')

FINAL_DISCOUNTS = D('''\


    class Discount:
        def __init__(self, expires: datetime | None = None):
            self.expires = expires

        def is_expired(self, now: datetime) -> bool:
            return self.expires is not None and now > self.expires

        def apply(self, lines: list, total: int) -> int:
            raise NotImplementedError


    class Percent(Discount):
        def __init__(self, pct: int, expires: datetime | None = None):
            if not 0 <= pct <= 100:
                raise CartError("percent must be 0 to 100")
            super().__init__(expires)
            self.pct = pct

        def apply(self, lines, total):
            return total - total * self.pct // 100


    class Flat(Discount):
        def __init__(self, cents: int, expires: datetime | None = None):
            super().__init__(expires)
            self.cents = cents

        def apply(self, lines, total):
            return max(0, total - self.cents)


    class BuyOneGetOne(Discount):
        def __init__(self, sku: str, expires: datetime | None = None):
            super().__init__(expires)
            self.sku = sku

        def apply(self, lines, total):
            line = next((l for l in lines if l.item.sku == self.sku), None)
            if line is None:
                return total
            return total - (line.qty // 2) * line.item.price
    ''')

FINAL_CHECKOUT = method('''
    def checkout(self, discounts: list, now: datetime) -> int:
        """Apply each discount to the running total, in the order given; an expired coupon is an error."""
        lines = list(self.lines.values())
        total = self.subtotal()
        for d in discounts:
            if d.is_expired(now):
                raise CartError("coupon expired")
            total = d.apply(lines, total)
        return total
''')

FINAL = FINAL_HEAD + ITEM_LINE + FINAL_DISCOUNTS + CART + in_class(ADD, REMOVE, SUBTOTAL, FINAL_CHECKOUT)
FINAL_DEMO = D('''\


    # ---- a quick run ----
    cart = Cart()
    cart.add(Item("p1", "pen", 250), 4)
    cart.add(Item("b1", "book", 1999))
    now = datetime(2026, 11, 2)
    bogo = BuyOneGetOne("p1")
    print(cart.checkout([bogo], now))
    print(cart.checkout([bogo, Percent(10), Flat(500)], now))
    print(cart.checkout([Flat(500), Percent(10)], now))
    try:
        cart.checkout([Percent(10, expires=datetime(2026, 11, 1))], now)
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
    "req_why": "Each requirement maps to a method: 1 is add, 2 is remove, 3 is subtotal, 4 is checkout and Discount.apply.",

    "entities": [("Item", True, "A sku, a name and a price in cents; shared by every line that holds it"),
                 ("Line", True, "An item and a quantity: what the cart actually stores"),
                 ("Cart", True, "Runs add, remove, subtotal and checkout"),
                 ("Discount", True, "A kind and a value; turns a total into a smaller total"),
                 ("Customer / Order / Payment", False, "External or out of scope; not modelled")],
    "ent_hint": "What does the cart store? What does a discount need to know? What about the customer and payment?",
    "ent_why": "Four small classes and an enum. Discount is a class, not an if inside checkout, because the next question is always 'now add another kind'.",

    "classes": [
        {"name": "Cart", "state": ["lines: Map<sku, Line>"],
         "behaviour": ["add(item, qty) -> void | error", "remove(sku, qty) -> void | error", "subtotal() -> cents", "checkout(discount) -> cents"]},
        {"name": "Line", "state": ["item: Item", "qty: int"], "behaviour": []},
        {"name": "Item", "state": ["sku: string", "name: string", "price: int  (cents)"], "behaviour": []},
        {"name": "Discount", "state": ["kind: Kind  (PERCENT, FLAT -> enum)", "value: int  (a percent or cents)"],
         "behaviour": ["apply(total) -> cents"]},
    ],
    "class_hint": "The cart holds lines by sku. A line holds an item and a quantity. A discount holds a kind and a value.",
    "class_why": "A map by sku makes 'add the same item again' one lookup. Item and Line carry data only; the rules live in Cart and Discount.",
    "class_qa": [{"ask": "Why is money an int and not a float?",
                  "say": "A float can't hold most decimal prices exactly, so totals drift and comparisons fail. **I hold cents as an int and only convert to dollars when I print.** Where I divide, for a percentage, I round the discount down, so the customer never gets more than the stated percent.",
                  "explain": ["10 percent of 999 cents is 99.9. Rounding the discount down takes off 99, so 900 is paid."]}],

    "map": {"center": ("Cart", "add, remove, checkout"),
            "owned": [("Line", "item, qty")],
            "uses": [("Discount", "kind, value"), ("Kind (enum)", "PERCENT, FLAT")]},

    "methods": [
        {"name": "add", "q": "add(item, qty): core logic and edge cases as comments, then the code.",
         "hint": "Find or start the line, raise the quantity. Edge: quantity not positive.", "code": ADD,
         "why": "setdefault gives 'add again raises the quantity' with no branch."},
        {"name": "remove", "q": "remove(sku, qty): core logic, edge cases, code.",
         "hint": "Find the line, lower it, drop it at zero. Edges: not in the cart, bad quantity.", "code": REMOVE,
         "why": "Dropping the line at zero keeps subtotal and the line count honest."},
        {"name": "subtotal", "q": "subtotal(): what does it add up?",
         "hint": "Price times quantity, summed, in cents.", "code": SUBTOTAL,
         "why": "Checkout builds on it, so discounts never touch line prices."},
        {"name": "checkout", "q": "checkout(discount): what does the discount get, and what comes back?",
         "hint": "Take the subtotal, let the discount change it, return it. None means no change.", "code": CHECKOUT,
         "why": "The cart doesn't know which rule it was given. The 'never below zero' rule lives in Discount.apply, in one place."},
    ],

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
