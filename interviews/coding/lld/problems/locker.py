"""Amazon Locker. THE REFERENCE PROBLEM: every other file in this folder copies this shape.
Pranav's bar: this is a little more than the minimum answer that passes (3 classes + an enum, ~70 lines of core),
never the pattern-heavy version. Methods are written once below and assembled into CORE, so the page shows
exactly the code that runs."""
import textwrap

D = textwrap.dedent


def method(src):
    """Dedent a method written at class level; the page shows it like this, and CORE indents it back."""
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


DEPOSIT = method('''
    def deposit_package(self, size: Size) -> str:
        """
        Core logic:
          1. Find a free compartment of the right size
          2. Open it (the driver puts the package in)
          3. Mark it occupied
          4. Generate and store an access token
          5. Return the code
        Edge cases:
          1. No free compartment of that size -> error
        """
        compartment = self._get_available_compartment(size)
        if compartment is None:
            raise LockerError(f"no available compartment of size {size.value}")
        compartment.open()
        compartment.mark_occupied()
        token = self._generate_access_token(compartment)
        self.access_tokens[token.get_code()] = token
        return token.get_code()
''')

PICKUP = method('''
    def pickup(self, code: str) -> None:
        """
        Core logic:
          1. Look up the code to get its access token
          2. Get the compartment and open it (the customer takes the package)
          3. Mark it free and remove the token
        Edge cases:
          1. Code empty or not in the map -> invalid code
          2. Token expired -> expired error; the package stays for staff
        """
        token = self.access_tokens.get(code)
        if not code or token is None:
            raise LockerError("invalid code")
        if token.is_expired(self.now()):
            raise LockerError("code expired")
        token.get_compartment().open()
        self._clear_deposit(token)
''')

OPEN_EXPIRED = method('''
    def open_expired_compartments(self) -> list:
        """
        Core logic:
          1. For every expired token, open its compartment so staff can take the package
          2. Return the codes, so staff can clear each one after emptying it
        Edge cases:
          1. Nothing expired -> nothing opens
        """
        expired = [t for t in self.access_tokens.values() if t.is_expired(self.now())]
        for token in expired:
            token.get_compartment().open()
        return [t.get_code() for t in expired]
''')

STAFF_CLEAR = method('''
    def staff_clear(self, code: str) -> None:
        """
        Core logic:
          1. Staff have taken the package out: free the compartment and drop the token
        Edge cases:
          1. Unknown code -> error
        """
        token = self.access_tokens.get(code)
        if token is None:
            raise LockerError("invalid code")
        self._clear_deposit(token)
''')

HELPERS = method('''
    def _get_available_compartment(self, size: Size):
        """Scan all compartments; return the first free one of this size, else None."""
        for c in self.compartments:
            if c.get_size() == size and not c.is_occupied():
                return c
        return None

    def _generate_access_token(self, compartment: Compartment) -> AccessToken:
        """A random six-digit code that isn't live, valid for seven days."""
        code = f"{secrets.randbelow(10**6):06d}"
        while code in self.access_tokens:
            code = f"{secrets.randbelow(10**6):06d}"
        return AccessToken(code, self.now() + self.TOKEN_LIFETIME, compartment)

    def _clear_deposit(self, token: AccessToken) -> None:
        token.get_compartment().mark_free()
        del self.access_tokens[token.get_code()]
''')

HEAD = D('''\
    import secrets
    from datetime import datetime, timedelta
    from enum import Enum


    class Size(Enum):
        SMALL = "small"
        MEDIUM = "medium"
        LARGE = "large"


    class LockerError(Exception):
        pass
    ''')

COMPARTMENT = D('''\


    class Compartment:
        def __init__(self, compartment_id: str, size: Size):
            self.compartment_id = compartment_id
            self.size = size
            self.occupied = False

        def get_size(self) -> Size:
            return self.size

        def is_occupied(self) -> bool:
            return self.occupied

        def mark_occupied(self) -> None:
            self.occupied = True

        def mark_free(self) -> None:
            self.occupied = False

        def open(self) -> None:
            pass  # tells the hardware to unlock this door
    ''')

TOKEN = D('''\


    class AccessToken:
        def __init__(self, code: str, expiration: datetime, compartment: Compartment):
            self.code = code
            self.expiration = expiration
            self.compartment = compartment

        def is_expired(self, now: datetime) -> bool:
            return now > self.expiration

        def get_compartment(self) -> Compartment:
            return self.compartment

        def get_code(self) -> str:
            return self.code
    ''')

LOCKER = D('''\


    class Locker:
        TOKEN_LIFETIME = timedelta(days=7)

        def __init__(self, compartments: list, now=datetime.now):
            self.compartments = compartments
            self.access_tokens = {}          # code -> AccessToken
            self.now = now                   # a clock we can fake in a test
    ''')

CORE = HEAD + COMPARTMENT + TOKEN + LOCKER + in_class(DEPOSIT, PICKUP, OPEN_EXPIRED, STAFF_CLEAR, HELPERS)

DEMO = D('''\


    # ---- a quick run ----
    class FakeClock:
        def __init__(self):
            self.t = datetime(2026, 11, 1)

        def __call__(self):
            return self.t


    clock = FakeClock()
    locker = Locker([Compartment("S1", Size.SMALL), Compartment("M1", Size.MEDIUM)], now=clock)
    code = locker.deposit_package(Size.MEDIUM)
    try:
        locker.deposit_package(Size.MEDIUM)
    except LockerError as e:
        print(e)
    locker.pickup(code)
    try:
        locker.pickup(code)
    except LockerError as e:
        print(e)
    late = locker.deposit_package(Size.SMALL)
    clock.t += timedelta(days=8)
    try:
        locker.pickup(late)
    except LockerError as e:
        print(e)
    opened = locker.open_expired_compartments()
    locker.staff_clear(opened[0])
    print("S1 free again:", not locker.compartments[0].is_occupied())
    ''')
DEMO_OUT = "no available compartment of size medium\ninvalid code\ncode expired\nS1 free again: True\n"

# ---- extensions ----
EXT_FALLBACK = D('''\
    SIZE_ORDER = [Size.SMALL, Size.MEDIUM, Size.LARGE]


    class Locker:
        ...

        def _get_available_compartment(self, size: Size):
            """Try the exact size first, then each larger size. Never a smaller one."""
            for s in SIZE_ORDER[SIZE_ORDER.index(size):]:
                for c in self.compartments:
                    if c.get_size() == s and not c.is_occupied():
                        return c
            return None
    ''')

STATUS_COMPARTMENT = D('''\


    class Status(Enum):
        AVAILABLE = "available"
        OCCUPIED = "occupied"
        OUT_OF_SERVICE = "out of service"


    class DoorJammed(Exception):
        pass


    class Compartment:
        def __init__(self, compartment_id: str, size: Size):
            self.compartment_id = compartment_id
            self.size = size
            self.status = Status.AVAILABLE      # was: occupied = False

        def get_size(self) -> Size:
            return self.size

        def is_available(self) -> bool:
            return self.status is Status.AVAILABLE

        def is_occupied(self) -> bool:
            return self.status is Status.OCCUPIED

        def mark_occupied(self) -> None:
            self.status = Status.OCCUPIED

        def mark_free(self) -> None:
            self.status = Status.AVAILABLE

        def mark_out_of_service(self) -> None:
            self.status = Status.OUT_OF_SERVICE

        def open(self) -> None:
            pass  # the hardware raises DoorJammed if the door won't open
    ''')

STATUS_DEPOSIT = method('''
    def deposit_package(self, size: Size) -> str:
        """Same steps; a door that won't open is taken out of service and we try the next compartment."""
        while True:
            compartment = self._get_available_compartment(size)
            if compartment is None:
                raise LockerError(f"no available compartment of size {size.value}")
            try:
                compartment.open()
            except DoorJammed:
                compartment.mark_out_of_service()
                continue
            compartment.mark_occupied()
            token = self._generate_access_token(compartment)
            self.access_tokens[token.get_code()] = token
            return token.get_code()

    def _get_available_compartment(self, size: Size):
        for s in SIZE_ORDER[SIZE_ORDER.index(size):]:
            for c in self.compartments:
                if c.get_size() == s and c.is_available():
                    return c
        return None
''')

FINAL = (HEAD + "\n\nSIZE_ORDER = [Size.SMALL, Size.MEDIUM, Size.LARGE]\n" + STATUS_COMPARTMENT + TOKEN + LOCKER
         + in_class(STATUS_DEPOSIT, PICKUP, OPEN_EXPIRED, STAFF_CLEAR,
                    HELPERS[HELPERS.index("def _generate_access_token"):]))
FINAL_DEMO = D('''\


    # ---- a quick run ----
    class FakeClock:
        def __init__(self):
            self.t = datetime(2026, 11, 1)

        def __call__(self):
            return self.t


    class JammedCompartment(Compartment):
        def open(self):
            raise DoorJammed(self.compartment_id)


    clock = FakeClock()
    small, medium = Compartment("S1", Size.SMALL), Compartment("M1", Size.MEDIUM)
    broken = JammedCompartment("M0", Size.MEDIUM)
    locker = Locker([small, broken, medium], now=clock)
    a = locker.deposit_package(Size.SMALL)                # S1
    b = locker.deposit_package(Size.SMALL)                # small full: falls back to medium; M0 jams, so M1
    print(small.status.value, broken.status.value, medium.status.value)
    locker.pickup(b)
    print(medium.status.value)
    clock.t += timedelta(days=8)
    try:
        locker.pickup(a)
    except LockerError as e:
        print(e)
    ''')
FINAL_OUT = "occupied out of service occupied\navailable\ncode expired\n"

PROBLEM = {
    "id": "locker", "title": "Amazon Locker", "part_id": "lld-mock-locker", "n": 8,
    "part_title": "Mock: Amazon Locker, the whole round", "minutes": 45,
    "lead": "A full locker round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. Three classes and an enum. Try each box before you open the answer.",
    "prompt": "Design a locker system where delivery drivers deposit packages and customers pick them up using a code.",
    "evidence": "LeetCode Discuss Mar 2025, Jun 2025 (bar raiser), Apr 2024, Apr 2026; roundz May 2025; PracHub Jul 2026. The most reported Amazon LLD question.",
    "drill": "part 8, the whole mock round.",

    "clarify": {
        "capabilities": [("Are there different sized compartments?", "Yes: small, medium, large"),
                         ("How does the customer get the code?", "The system returns it; sending it is out of scope"),
                         ("How does the driver get a compartment?", "Says the size; the system assigns one and opens it")],
        "errors": [("Can one customer have multiple packages?", "Yes, one access token per package"),
                   ("Do codes expire? What happens to a package left too long?", "7 days; the package stays until staff remove it"),
                   ("What if all compartments of a size are full?", "Return an error")],
        "scope": [("Whole delivery flow, or only delivery, placement, pickup and recovery?", "Only placement, pickup and recovery")],
    },
    "clarify_hint": "Sizes, how the customer gets the code, how the driver gets a compartment. Many packages per customer, expiry, all full. The whole delivery flow, or only placement and pickup?",
    "clarify_say": "**I group my questions in three buckets: what it must do, what goes wrong, where scope stops.** Sizes and how the driver gets a compartment first, because they decide the classes. Then many packages, expiry and a full locker. Then whether this is the whole delivery flow.",
    "clarify_why": "Every question changes a class or a method. Sizes give an enum. Multiple packages give one token per package. Expiry and recovery give the expired path.",
    "answers": "Small, medium and large compartments. The driver says the size; the system picks a compartment and opens it. The system returns a code, and getting it to the customer is someone else's job. Yes, a customer can have several packages, one code each. Codes expire after 7 days; the package stays until staff take it out. If every compartment of that size is full, return an error. Only placement, pickup and recovery; not delivery or notifications.",
    "playback": ["Thanks, that's clear. **So: three sizes, exact match, one token per package, 7-day expiry with staff recovery, an error when full.** Out of scope: the delivery system, notifications, and how the token reaches the user."],

    "requirements": [
        ["Carrier deposits a package of a specific size (S, M, L).", "The system assigns an available compartment", "Opens it and returns an access token, or an error"],
        ["Successful deposit: an access token is generated and returned.", "One access token per package"],
        ["User retrieves a package by entering the access token.", "The system validates the code and opens the compartment", "A specific error if the code is expired or invalid"],
        ["Access tokens expire after 7 days.", "Expired tokens are rejected", "The package stays until staff remove it"],
        ["Staff can open all expired compartments, then clear each one."],
    ],
    "out_of_scope": ["the delivery system", "the notification system", "how the token gets to the user"],
    "req_hint": "Carrier deposits, a successful deposit, user retrieves, expiry, staff.",
    "req_say": "From your answers I get five requirements. **Each one is a thing a driver, customer or staff member does, and each becomes a method: deposit, pickup, expiry, the staff path.** I say the error case with each so I don't forget it in the code.",
    "req_why": "Each requirement maps to a method: 1 and 2 are deposit_package, 3 is pickup, 4 is is_expired, 5 is open_expired_compartments and staff_clear.",

    "entities": [("Package", False, "Lots of metadata we don't need; only its size, so size is a parameter of deposit"),
                 ("Compartment", True, "Has a size and is occupied or free"),
                 ("Locker", True, "Runs deposit, pickup and the expired path"),
                 ("AccessToken", True, "A code, when it expires, and which compartment it opens"),
                 ("Carrier / User", False, "External; not modelled")],
    "ent_hint": "What do we need to know about a package? About the carrier or the user?",
    "ent_say": "I underline the nouns. **Compartment, locker and access token carry data or behaviour I need, so they stay.** A package is only a size, so that becomes a parameter of deposit. The carrier and the user are outside the system.",
    "ent_why": "Three classes and one enum. Dropping Package is the move interviewers notice: you modelled what the requirements need.",

    "classes": [
        {"name": "Locker", "state": ["compartments: Compartment[]  # deposit scans these for a free one of the size",
                                      "access_tokens: Map<code, AccessToken>  (a list first is fine; a map makes pickup one step)  # pickup gets only a code; a map finds its token"],
         "behaviour": ["deposit_package(size) -> string | error  # req 1 and 2: assign, open, return the code",
                       "pickup(code) -> void | error  # req 3: code to token to door",
                       "open_expired_compartments() -> codes  # req 5: staff open every expired door",
                       "staff_clear(code) -> void  # req 5: staff empty one and free it"]},
        {"name": "AccessToken", "state": ["code: string  # what the customer brings; the map key",
                                          "expiration: timestamp  # req 4: seven days after deposit",
                                          "compartment: Compartment  # pickup must get from the code to the door"],
         "behaviour": ["is_expired() -> boolean  # req 4: one place for the expiry rule",
                       "get_compartment() -> Compartment  # pickup opens this door",
                       "get_code() -> string  # deposit returns it to the carrier"]},
        {"name": "Compartment", "state": ["size: Size  (SMALL, MEDIUM, LARGE -> enum)  # deposit matches on it",
                                          "occupied: boolean  # free or taken, nothing more is needed"],
         "behaviour": ["is_occupied() -> boolean  # deposit skips taken doors",
                       "mark_occupied() -> void  # deposit takes the door",
                       "mark_free() -> void  # pickup and staff_clear give it back",
                       "open() -> void  # req 1 and 3: the door opens for deposit and pickup",
                       "get_size() -> Size  # deposit compares it to the requested size"]},
    ],
    "class_hint": "Locker holds compartments and tokens. A token holds a code, an expiration and a compartment. A compartment holds a size and occupied.",
    "class_say": "**I start from the methods the requirements gave me, then ask what each one has to read.** Pickup gets only a code, so the locker keeps tokens in a map by code. The token has to reach the door, so it holds its compartment, and it holds an expiry for requirement 4. Deposit needs to find a free door of a size, so the locker holds the compartments, each with a size and an occupied flag.",
    "class_why": "Pickup looks a token up by its code, so a map from code to token makes it one step.",
    "class_qa": [{"ask": "Why does the token hold the compartment, and not the other way round?",
                  "say": "Because the token is what the customer brings, and pickup has to get from the code to the door. **Each class owns what it knows best:** the locker finds compartments and looks up tokens, the token knows when it expires and which door it opens, and the compartment knows its size and whether it's occupied.",
                  "explain": ["Keep occupied on the compartment, not derived from tokens. An expired token still means a package is physically inside."]}],

    "map": {"center": ("Locker", "deposit, pickup, expired"),
            "owned": [("Compartment", "size, occupied"), ("AccessToken", "code, expiration")],
            "uses": [("Size (enum)", "SMALL, MEDIUM, LARGE")]},

    "methods": [
        {"name": "deposit_package", "q": "deposit_package(size): core logic and edge cases as comments, then the code.",
         "hint": "Find, open, mark occupied, make and store the token, return the code. Edge: none free.", "code": DEPOSIT,
         "why": "_get_available_compartment and _generate_access_token are named but not written yet. That keeps the main flow readable."},
        {"name": "pickup", "q": "pickup(code): core logic, edge cases, code.",
         "hint": "Look up, check expired, open, mark free, remove the token. Edges: missing code, expired.", "code": PICKUP,
         "why": "Two specific errors, as requirement 3 says. An expired code leaves the compartment occupied, so staff can recover the package."},
        {"name": "open_expired_compartments", "q": "open_expired_compartments(): what does staff get?",
         "hint": "Open every expired compartment; don't clear state yet.", "code": OPEN_EXPIRED,
         "why": "Opening doesn't mean empty. Staff clear each one after the package is out of the door."},
        {"name": "staff_clear", "q": "staff_clear(code): free it once the package is out.",
         "hint": "Look up, error if unknown, clear.", "code": STAFF_CLEAR,
         "why": "Reuses _clear_deposit, the same step pickup ends with."},
    ],
    "helpers": {"q": "Now the helpers: _get_available_compartment, _generate_access_token, _clear_deposit.",
                "starter": "def _get_available_compartment(self, size):\n    ...\n",
                "hint": "Scan for the right size and not occupied. A random code that isn't live, now plus 7 days. Mark free and delete from the map.",
                "code": HELPERS,
                "why": "A linear scan is fine: a locker has tens of compartments. Indexing free ones by size is faster but keeps state in two places."},

    "extensions": [
        {"ask": "What if a small package can go in a larger compartment when no small one is free?",
         "say": "Only _get_available_compartment changes. It tries the exact size first, then each larger size, never a smaller one. **deposit_package and every other class stay the same.**",
         "code": EXT_FALLBACK, "code_title": "Size fallback: one helper changes",
         "short_q": "Smaller package in a bigger compartment", "short_a": "only _get_available_compartment changes: exact size, then larger, never smaller"},
        {"ask": "Some compartments break: the door won't open. How do you handle that?",
         "say": "The occupied flag becomes a status: available, occupied or out of service. **Allocation only picks available ones.** If a door won't open during a deposit, mark it out of service and try the next.",
         "explain": ["Callers that used is_occupied keep working, which is the point of hiding the field behind methods."],
         "code": STATUS_COMPARTMENT + "\n" + STATUS_DEPOSIT, "code_title": "Out of service: a status, and deposit skips a jammed door",
         "short_q": "Broken doors", "short_a": "occupied becomes a status with OUT_OF_SERVICE; allocation skips it; a jam at deposit tries the next compartment"},
        {"ask": "How do you know the package actually went in?",
         "say": "Split deposit in two: reserve_compartment(size) opens the door; confirm_deposit(id) issues the token once the door closes; cancel_reservation(id) frees it, with a timeout for drivers who walk away. Add a RESERVED status.",
         "short_q": "Did the package go in?", "short_a": "two-phase deposit: reserve, confirm, cancel on timeout; a RESERVED status"},
        {"ask": "Two drivers at the same locker at once?",
         "say": "Finding a compartment and marking it occupied must happen together: one lock around them, or in a database a conditional update, set occupied where free, so only one wins.",
         "short_q": "Two drivers at once", "short_a": "find and mark occupied as one step: a lock, or a conditional update"},
    ],
    "faq": [("What if a door jams at pickup?", "Tell the customer to contact support, keep the token alive, and mark the compartment out of service so staff can recover the package."),
            ("Many lockers?", "A LockerNetwork that tries lockers nearest first and calls each one's deposit_package. Locker doesn't change.")],

    "summary": ["**Three classes and an enum.** The Locker is the entry point: deposit by size returns a code, pickup by code opens the door, and staff open expired compartments and clear them. An AccessToken holds the code, its expiry and its compartment. A Compartment holds its size and whether it's occupied.",
                "**It extends in one place each time:** size fallback changes one helper, broken doors turn occupied into a status, and a two-phase deposit or a lock handles a door that never closes or two drivers at once."],

    "golden": [
        ("The compartment owns what's physically inside it; the token is only a key. Deposit sets occupied, and only pickup or staff clear it.", "an expired code still means a package is in the box; interviewers probe exactly that."),
        ("Package isn't a class; its size is a parameter. Carrier and user are external.", "it shows scope judgment and keeps it to three classes in 40 minutes."),
        ("Tokens live in a map by code; codes are one-time and errors are specific (invalid, expired).", "pickup is one lookup, codes can't be reused, and requirement 3 asks for specific errors."),
        ("Every allocation decision goes through one helper, _get_available_compartment.", "size fallback, broken doors and indexing by size each change only that function."),
        ("Finding a compartment and marking it occupied happen as one step; a door that never closes needs reserve, confirm and a timeout.", "it's the senior signal: two drivers and a driver who walks away, not only the happy path."),
        ("Expired doesn't mean deleted: open the doors for staff, clear state only after the package is out.", "it follows the requirement exactly and ties back to the first line."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with both extensions applied (size fallback and out-of-service compartments), and a run at the bottom.",
    "final_title": "locker.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "occupied, out of service, occupied (the second small package fell back to medium, skipped the jammed M0 and went into M1); available after pickup; code expired.",
}
