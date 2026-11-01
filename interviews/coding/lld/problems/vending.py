"""Vending machine. Cheat only (part 0.5): Slot, VendingMachine and a State enum with guarded transitions."""

PROBLEM = {
    "id": "vending", "title": "Vending machine",
    "prompt": "Design a vending machine (one report: 'snacks vending machine, classes, fields, methods').",
    "evidence": "GeeksforGeeks Sept 2022 (SDE-2); 1point3acres Feb 2026 (SDE2); TechPrep.",

    "clarify": {
        "capabilities": [("What does the customer put in, and how do they choose?", "Coins first, then a slot code"),
                         ("Is change given?", "Yes, from the coins inside the machine"),
                         ("Can the customer back out?", "Yes: cancel returns what they inserted")],
        "errors": [("Sold out or unknown slot?", "Return an error and keep the money in the balance"),
                   ("Not enough money inserted?", "Return an error; the customer can add more or cancel"),
                   ("Change can't be made?", "Refuse the sale; the customer can cancel")],
        "scope": [("Cards, notes, remote stock reports?", "No: coins only, in memory"),
                  ("Restocking?", "An admin mode takes the machine out of service while it happens")],
    },

    "requirements": [
        ["A customer inserts coins.", "The machine adds them to the balance", "Rejects them if the machine is out of service"],
        ["A customer selects a slot.", "If the balance covers the price, the machine dispenses the product and returns change", "An error if the slot is unknown, sold out, too expensive for the balance, or change can't be made"],
        ["A customer cancels.", "The machine returns the whole balance"],
        ["An admin restocks and loads coins.", "The machine is out of service until the admin is done"],
    ],
    "out_of_scope": ["card and note payments", "remote stock reports", "promotions", "a UI"],

    "entities": [("Product", False, "Only a name and a price, and those live on the slot"),
                 ("Slot", True, "A product name, a price and how many are left"),
                 ("VendingMachine", True, "Holds the slots and coins, and runs insert, select and cancel"),
                 ("State", True, "Idle, has money or out of service: which actions are allowed"),
                 ("Coin", False, "An integer value in cents"),
                 ("Customer / Admin", False, "External; not modelled")],

    "classes": [
        {"name": "VendingMachine", "state": ["slots: Map<code, Slot>", "coins: Map<value, count>  (change comes from here)", "balance: int", "state: State"],
         "behaviour": ["insert_coin(value) -> void | error", "select(code) -> product | error", "cancel() -> refund in cents", "set_out_of_service(flag) -> void"]},
        {"name": "Slot", "state": ["name: string", "price: int", "count: int"],
         "behaviour": ["is_available() -> boolean", "take() -> void"]},
        {"name": "State", "state": ["IDLE", "HAS_MONEY", "OUT_OF_SERVICE  (enum)"], "behaviour": []},
    ],

    "map": {"center": ("VendingMachine", "insert, select, cancel"),
            "owned": [("Slot", "name, price, count")],
            "uses": [("State (enum)", "IDLE, HAS_MONEY, ..."), ("Coins", "value to count")]},

    "methods": [
        {"name": "insert_coin", "logic": ["Refuse if the state is out of service", "Add the coin to the coin box and the value to the balance", "Move to has money"]},
        {"name": "select", "logic": ["Look up the slot; error if unknown or sold out", "Error if the balance is below the price", "Work out the change from the coin box; error if it can't be made", "Take one product, remove the change coins, reset the balance, return to idle", "Return the product"]},
        {"name": "cancel", "logic": ["Return the whole balance and reset it", "Move back to idle", "Nothing inserted: return 0"]},
        {"name": "set_out_of_service", "logic": ["Admin switches the state to out of service, or back to idle", "Refund any balance first"]},
    ],

    "extensions": [
        {"ask": "The machine has too few coins to make change.",
         "say": "Change-making becomes its own helper that works on coin counts and can say no. **select asks it before dispensing,** and refuses the sale when it can't be made.",
         "short_q": "Can't make change", "short_a": "a change helper on the coin counts that can say no; select asks it first and refuses the sale"},
        {"ask": "More states, each with its own rules: dispensing, maintenance, a card reader waiting.",
         "say": "When the if-chain on the state grows, **each state becomes a class** with the same methods (insert_coin, select, cancel), and the machine hands every call to its current state. A new state is a new class.",
         "short_q": "Many more states", "short_a": "each state becomes a class with the same methods; the machine delegates to the current one"},
        {"ask": "Add card payments.",
         "say": "A payment method with one job: take the amount, or fail. Coins and card are two of them, and **the machine asks the payment method instead of reading its balance.**",
         "short_q": "Card payments", "short_a": "a Payment strategy: coins and card both take an amount or fail; select asks it"},
        {"ask": "Power cut while dispensing.",
         "say": "Take the product and clear the balance as one step, so a cut can't charge twice or lose the money. The balance is saved before the motor runs, and a restart refunds anything unfinished.",
         "short_q": "Power cut mid-dispense", "short_a": "update product count and balance as one step; a restart refunds unfinished sales"},
    ],

    "golden": [
        ("The balance is the state: money in means HAS_MONEY, nothing means IDLE, and every action checks the state first.", "illegal moves become errors in one place, not a pile of ifs."),
        ("Coins are counts in the machine, so change comes from what is physically inside.", "the interviewer's first probe is always: what if you can't make change?"),
        ("Cancel works from every state that holds money.", "customers lose trust when money gets stuck, and interviewers check for it."),
        ("An enum with guarded transitions first; State classes only when the states grow their own behaviour.", "it shows you don't reach for a pattern before the requirements need it."),
        ("Take the product and clear the balance in one step.", "the senior signal: a failure in the middle can't charge a customer without giving the product."),
    ],
}
