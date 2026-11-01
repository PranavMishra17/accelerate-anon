"""Builds interviews/coding/amazon-lld-mock.js: the Amazon Locker LLD round, disclosed stage by stage, in the order
Pranav uses (from his notes, after Hello Interview's Amazon Locker video):
a) clarify in three buckets, b) requirements, c) entities, d) class design (- state, + behaviour),
e) implementation (core logic as comments, edge cases, then code), f) extensibility.
Edit this file, then run it; every code block is run here before the file is written."""
import json, os, subprocess, sys, tempfile, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "amazon-lld-mock.js")


def run(src, expect):
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write(src)
    out = subprocess.run([sys.executable, "-I", f.name], capture_output=True, text=True)
    os.unlink(f.name)
    assert out.returncode == 0, out.stderr
    assert out.stdout == expect, (out.stdout, expect)


D = textwrap.dedent

# ---------- the core design, as written in the round ----------
HEAD = D('''\
    import secrets
    from datetime import datetime, timedelta
    from enum import Enum
    ''')

SIZE = D('''\
    class Size(Enum):
        SMALL = "small"
        MEDIUM = "medium"
        LARGE = "large"
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

LOCKER_INIT = D('''\
    class Locker:
        TOKEN_LIFETIME = timedelta(days=7)

        def __init__(self, compartments: list, now=datetime.now):
            self.compartments = compartments
            self.access_tokens = {}          # code -> AccessToken
            self.now = now                   # a clock we can fake in a test
    ''')

DEPOSIT = '''
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
'''

PICKUP = '''
    def pickup(self, code: str) -> None:
        """
        Core logic:
          1. Look up the code to get its access token
          2. Get the compartment
          3. Open it (the customer takes the package)
          4. Mark it free and remove the token
        Edge cases:
          1. Code empty or not in the map -> invalid code
          2. Token expired -> expired error; the package stays for staff
        """
        token = self.access_tokens.get(code)
        if not code or token is None:
            raise LockerError("invalid code")
        if token.is_expired(self.now()):
            raise LockerError("code expired")
        compartment = token.get_compartment()
        compartment.open()
        self._clear_deposit(token)
'''

EXPIRED = '''
    def open_expired_compartments(self) -> None:
        """
        Core logic: for every expired token, open its compartment so staff can take the package.
        State is not cleared here: staff clear it once the package is out of the door.
        """
        for token in self.access_tokens.values():
            if token.is_expired(self.now()):
                token.get_compartment().open()
'''

HELPERS = '''
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
'''

ERR = "class LockerError(Exception):\n    pass\n"

CORE = HEAD + "\n\n" + SIZE + "\n\n" + ERR + "\n\n" + COMPARTMENT + "\n\n" + TOKEN + "\n\n" + LOCKER_INIT + DEPOSIT + PICKUP + EXPIRED + HELPERS

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
    print("picked up; M1 free:", not locker.compartments[1].is_occupied())
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
    print("S1 still occupied:", locker.compartments[0].is_occupied())
    ''')
DEMO_OUT = ("no available compartment of size medium\npicked up; M1 free: True\ninvalid code\n"
            "code expired\nS1 still occupied: True\n")
run(CORE + DEMO, DEMO_OUT)

# ---------- extensions ----------
EXT_FALLBACK = '''SIZE_ORDER = [Size.SMALL, Size.MEDIUM, Size.LARGE]


class Locker:
    ...

    def _get_available_compartment(self, size: Size):
        """Try the exact size first, then each larger size. Never a smaller one."""
        for s in SIZE_ORDER[SIZE_ORDER.index(size):]:
            for c in self.compartments:
                if c.get_size() == s and not c.is_occupied():
                    return c
        return None
'''

EXT_STATUS_CLASS = D('''\
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

EXT_STATUS_DEPOSIT = '''
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
'''

# The final file: the core with both extensions applied.
FINAL = (HEAD + "\n\n" + SIZE + "\n\nSIZE_ORDER = [Size.SMALL, Size.MEDIUM, Size.LARGE]\n\n\n" + ERR + "\n\n"
         + EXT_STATUS_CLASS + "\n\n" + TOKEN + "\n\n" + LOCKER_INIT
         + EXT_STATUS_DEPOSIT + PICKUP + EXPIRED
         + HELPERS[HELPERS.index("    def _generate_access_token"):])
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
run(FINAL + FINAL_DEMO, FINAL_OUT)
FINAL_FILE = FINAL + FINAL_DEMO


# ---------- page blocks ----------
def turn(ask, say, check=None, explain=None, who="Interviewer"):
    t = {"t": "turn", "who": who, "ask": ask, "say": say}
    if check: t["check"] = check
    if explain: t["explain"] = explain
    return t


def code(cid, title, src):
    return {"t": "code", "id": cid, "title": title, "code": src.strip("\n") + "\n", "notes": {}}


def box(x, y, w, h, title, sub, cls="d-box"):
    return (f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="6"/>'
            f'<text class="d-b" x="{x + 10}" y="{y + 20}">{title}</text>'
            f'<text class="d-s" x="{x + 10}" y="{y + 38}">{sub}</text>\n')


def arrow(x1, y1, x2, y2, label=None, lx=0, ly=0):
    s = f'<path class="d-ar" d="M{x1} {y1} L{x2} {y2}"/>'
    if label:
        s += f'<text class="d-a" x="{lx}" y="{ly}">{label}</text>'
    return s + "\n"


MAP_SVG = ('<svg viewBox="0 0 420 250" role="img" aria-label="Locker class map">\n'
           + box(115, 6, 190, 48, "Locker", "deposit, pickup, expired", "d-acc")
           + box(14, 120, 180, 48, "Compartment", "size, occupied")
           + box(226, 120, 180, 48, "AccessToken", "code, expiration")
           + box(14, 196, 180, 44, "Size (enum)", "SMALL, MEDIUM, LARGE", "d-dashbox")
           + arrow(160, 54, 110, 118, "has many", 84, 92)
           + arrow(260, 54, 310, 118, "map by code", 292, 92)
           + arrow(226, 150, 196, 150, "points to its compartment", 200, 190)
           + arrow(104, 168, 104, 194)
           + '</svg>')

FLOW_SVG = ('<svg viewBox="0 0 420 330" role="img" aria-label="deposit and pickup">\n'
            + box(6, 6, 196, 44, "deposit_package(size)", "the carrier")
            + box(6, 70, 196, 44, "free compartment?", "exact size")
            + box(222, 70, 192, 44, "LockerError", "none free", "d-badbox")
            + box(6, 134, 196, 44, "open, mark occupied", "package goes in")
            + box(6, 198, 196, 44, "make token, store", "code, 7 days")
            + box(6, 262, 196, 44, "return the code", "to the carrier", "d-acc")
            + arrow(104, 50, 104, 68) + arrow(202, 92, 220, 92, "no", 204, 84)
            + arrow(104, 114, 104, 132, "yes", 110, 128) + arrow(104, 178, 104, 196) + arrow(104, 242, 104, 260)
            + box(222, 150, 192, 44, "pickup(code)", "the customer")
            + box(222, 214, 192, 44, "valid, not expired?", "else a clear error")
            + box(222, 278, 192, 44, "open, mark free", "remove the token", "d-acc")
            + arrow(318, 194, 318, 212) + arrow(318, 258, 318, 276)
            + '</svg>')

S = []

S.append({"id": "lldm-prompt", "title": "The prompt", "blocks": [
    {"t": "p", "text": "One round, the way you'd run it: **a) clarify, b) requirements, c) entities, d) class design, e) implementation, f) extensibility.** About 40 minutes. At each stage try the box first, then open the answer. Set the switch above to Try first."},
    turn("Design a locker system where delivery drivers deposit packages and customers pick them up using a code.",
         ["Sounds good. **Before requirements, I'd like to clarify a few things in three areas: what the system must do, how it handles errors, and where the scope stops.** Then I'll list requirements, pull out the entities, design the classes and implement the main methods."],
         check=["Do you clarify before you design?", "Do you say your plan out loud?"],
         explain=["Saying the order lets the interviewer steer you early. It also keeps you from jumping to classes."])
]})

S.append({"id": "lldm-clarify", "title": "a) Clarify", "blocks": [
    {"t": "p", "text": "Three buckets. **Primary capabilities:** what it must do. **Error handling:** what goes wrong. **Scope boundaries:** what you will not build."},
    {"t": "write", "id": "lldm-clarify-w", "q": "Write your questions under each bucket.",
     "starter": "1. Primary capabilities\n- \n- \n- \n\n2. Error handling\n- \n- \n- \n\n3. Scope boundaries\n- ",
     "hint": "Sizes, how the customer gets the code, how the driver gets a compartment. Many packages per customer, expiry, all full. The whole delivery flow, or only placement and pickup?",
     "solution": "1. Primary capabilities\n- Are there different sized compartments?\n- How does the customer get the code?\n- How does the delivery driver get a compartment?\n\n2. Error handling\n- Can one customer have multiple packages?\n- Do codes expire? What happens to a package left too long?\n- What if all compartments of a size are full?\n\n3. Scope boundaries\n- Do we model the whole delivery flow, or only delivery, placement, pickup and recovery?",
     "why": "Every question here changes a class or a method. Sizes give an enum. 'How does the customer get the code' tells you the system only returns it. Multiple packages give one token per package. Expiry and recovery give the expired path."}
]})

S.append({"id": "lldm-reqs", "title": "b) Requirements", "blocks": [
    {"t": "p", "text": "**The interviewer answers your questions:**"},
    turn("Small, medium and large compartments. The driver says the size; the system picks a compartment and opens it. The system returns a code, and getting it to the customer is someone else's job. Yes, a customer can have several packages, one code each. Codes expire after 7 days; the package stays until staff take it out. If every compartment of that size is full, return an error. Only placement, pickup and recovery; not delivery or notifications.",
         ["Thanks, that's clear. **So: three sizes, exact match, one token per package, 7-day expiry with staff recovery, an error when full.** Out of scope: the delivery system, notifications, and how the token reaches the user."]),
    {"t": "table", "head": ["Bucket", "Question", "Answer"], "rows": [
        ["Primary capabilities", "Different sized compartments?", "Yes: small, medium, large"],
        ["Primary capabilities", "How does the customer get the code?", "The system returns it; delivery of the code is out of scope"],
        ["Primary capabilities", "How does the driver get a compartment?", "Says the size; the system assigns one and opens it"],
        ["Error handling", "One customer, multiple packages?", "Yes, one access token per package"],
        ["Error handling", "Code expiry? Left packages?", "7 days; the package stays until staff remove it"],
        ["Error handling", "All compartments full?", "Return an error"],
        ["Scope boundaries", "Whole delivery flow?", "No: only delivery, placement, pickup and recovery"]]},
    {"t": "p", "text": "Turn the answers into numbered requirements. **Each one: who does what, what the system does, and what can go wrong.** Then list what's out of scope."},
    {"t": "write", "id": "lldm-reqs-w", "q": "Write the requirements, numbered, then out of scope.",
     "starter": "1. \n2. \n3. \n4. \n5. \n6. Out of scope: ",
     "hint": "Carrier deposits, a successful deposit, user retrieves, expiry, staff, out of scope.",
     "solution": "1. Carrier deposits a package of a specific size (S, M, L).\n   - The system assigns an available compartment.\n   - Opens the compartment and returns an access token, or an error.\n2. Successful deposit: an access token is generated and returned.\n   - One access token per package.\n3. User retrieves a package by entering the access token.\n   - The system validates the code and opens the compartment.\n   - A specific error if the code is expired or invalid.\n4. Access tokens expire after 7 days.\n   - Expired tokens are rejected.\n   - The package stays in the compartment until staff remove it.\n5. Staff can open all expired compartments.\n6. Out of scope: the delivery system, the notification system, how the token gets to the user.",
     "why": "Each requirement maps to something you'll build: 1 and 2 are deposit_package, 3 is pickup, 4 is is_expired, 5 is open_expired_compartments. If a requirement doesn't map to a method, question it."}
]})

S.append({"id": "lldm-entities", "title": "c) Entities", "blocks": [
    {"t": "p", "text": "Underline the nouns in the requirements. **Keep a noun only if the design needs its data or behaviour.**"},
    {"t": "write", "id": "lldm-ent-w", "q": "List the nouns. For each, keep or drop, and why.",
     "starter": "Package: \nCompartment: \nLocker: \nAccessToken: \nCarrier / User: ",
     "hint": "What do we need to know about a package? About the carrier or the user?",
     "solution": "Package: drop. It has lots of metadata we don't need; we only need its size, so size is a parameter of deposit.\nCompartment: keep. It has a size and is occupied or free.\nLocker: keep. It runs deposit, pickup and the expired path.\nAccessToken: keep. A code, when it expires, and which compartment it opens.\nCarrier / User: drop. Not modelled here; they're external.",
     "why": "Three classes and one enum. Dropping Package is the move interviewers notice: you modelled what the requirements need, not everything that exists."}
]})

S.append({"id": "lldm-classes", "title": "d) Class design", "blocks": [
    {"t": "p", "text": "For each class, think **requirements (−)**: the state it holds, set in __init__; and **behaviour (+)**: its methods, with what they return."},
    {"t": "write", "id": "lldm-classes-w", "q": "Write Locker, AccessToken and Compartment as − state and + behaviour.",
     "starter": "class Locker\n- \n+ \n\nclass AccessToken\n- \n+ \n\nclass Compartment\n- \n+ ",
     "hint": "Locker holds compartments and tokens. A token holds a code, an expiration and a compartment. A compartment holds a size and occupied.",
     "solution": "class Locker\n- compartments: Compartment[]\n- access_tokens: AccessToken[]  ->  better: Map<code, AccessToken>\n+ deposit_package(size) -> string | error\n+ pickup(code) -> void | error\n+ open_expired_compartments() -> void\n\nclass AccessToken\n- code: string\n- expiration: timestamp\n- compartment: Compartment\n+ is_expired() -> boolean\n+ get_compartment() -> Compartment\n+ get_code() -> string\n\nclass Compartment\n- size: Size   (SMALL, MEDIUM, LARGE -> enum)\n- occupied: boolean\n+ is_occupied() -> boolean\n+ mark_occupied() -> void\n+ mark_free() -> void\n+ open() -> void\n+ get_size() -> Size",
     "why": "Start with a list of tokens if that's what comes to mind, then switch to a map from code to token: pickup looks a token up by its code, and a map makes that one step."},
    turn("Why does the token hold the compartment, and not the other way round?",
         ["Because the token is what the customer brings, and pickup has to get from the code to the door. **Each class owns what it knows best:** the locker finds compartments and looks up tokens, the token knows when it expires and which door it opens, and the compartment knows its size and whether it's occupied. That's the Information Expert idea."],
         explain=["Keep occupied on the compartment, not derived from tokens. An expired token still means a package is physically inside, so token state and physical state can differ."])
]})

S.append({"id": "lldm-impl", "title": "e) Implementation", "blocks": [
    {"t": "svg", "svg": MAP_SVG, "alt": "Class map"},
    {"t": "p", "text": "One method at a time. **Write the core logic as comments, list the edge cases, then write the code.** Push details into private helpers and implement them only if there's time or you're asked."},
    {"t": "write", "id": "lldm-dep-w", "q": "deposit_package(size): write the core logic and edge cases as comments, then the code.",
     "starter": "def deposit_package(self, size):\n    \"\"\"\n    Core logic:\n      1.\n    Edge cases:\n      1.\n    \"\"\"\n",
     "hint": "Find, open, mark occupied, make and store the token, return the code. Edge: none free.",
     "solution": D(DEPOSIT).strip("\n"),
     "why": "_get_available_compartment and _generate_access_token are named but not written yet. That keeps the main flow readable, and you can fill them in after."},
    {"t": "write", "id": "lldm-pick-w", "q": "pickup(code): core logic, edge cases, code.",
     "starter": "def pickup(self, code):\n    \"\"\"\n    Core logic:\n      1.\n    Edge cases:\n      1.\n    \"\"\"\n",
     "hint": "Look up, check expired, open, mark free, remove the token. Edges: missing code, expired.",
     "solution": D(PICKUP).strip("\n"),
     "why": "Two specific errors, as requirement 3 says. An expired code leaves the compartment occupied, so staff can recover the package."},
    {"t": "write", "id": "lldm-help-w", "q": "Now the helpers: _get_available_compartment, _generate_access_token, _clear_deposit, and open_expired_compartments.",
     "starter": "def _get_available_compartment(self, size):\n    ...\n",
     "hint": "Scan for the right size and not occupied. A random code that isn't live, now plus 7 days. Mark free and delete from the map. Open every expired token's compartment.",
     "solution": (D(HELPERS).strip("\n") + "\n\n" + D(EXPIRED).strip("\n")),
     "why": "A linear scan is fine: a locker has tens of compartments. If asked, index free compartments by size, but then the state lives in two places."}
]})

S.append({"id": "lldm-extend", "title": "f) Extensibility", "blocks": [
    {"t": "p", "text": "The interviewer changes the rules. **For each change, say which class it touches and what stays the same.** A good design changes in one place."},
    turn("What if a small package can go in a larger compartment when no small one is free?",
         ["Only _get_available_compartment changes. It tries the exact size first, then each larger size, never a smaller one. **deposit_package and every other class stay the same,** because finding a compartment was already in one helper."],
         check=["Does the change land in one place?"]),
    code("lldm-ext-fallback", "Size fallback: one helper changes", EXT_FALLBACK),
    turn("Some compartments break: the door won't open. How do you handle that?",
         ["The two-state occupied flag isn't enough any more, so it becomes a status: available, occupied or out of service. **Allocation only picks available ones.** If a door won't open during a deposit, mark it out of service and try the next compartment. Staff can mark one out of service, or back in, from the same status."],
         explain=["Swapping a boolean for an enum when a third state appears is a common follow-up. Callers that used is_occupied keep working, which is the point of hiding the field behind methods."]),
    code("lldm-ext-status", "Out of service: Compartment gets a status", EXT_STATUS_CLASS),
    code("lldm-ext-deposit", "deposit_package skips a jammed door", EXT_STATUS_DEPOSIT),
    {"t": "faq", "items": [
        {"q": "What if a door jams at pickup?", "a": "Tell the customer to contact support, keep the token alive, and mark the compartment out of service so staff can recover the package. Don't delete the token until the package is out."},
        {"q": "How do you know the package actually went in?", "a": "Split deposit in two: reserve_compartment(size) opens the door and returns a reservation; confirm_deposit(id) issues the token once the door closes; cancel_reservation(id) frees it, with a timeout for drivers who walk away. Add a RESERVED status."},
        {"q": "Two drivers at the same locker at once?", "a": "Finding a compartment and marking it occupied must happen together: wrap them in one lock, or in a database do a conditional update (set occupied where free) so only one wins."},
        {"q": "Many lockers?", "a": "A LockerNetwork that tries lockers nearest first and calls each one's deposit_package. The Locker class doesn't change."},
        {"q": "Who clears an expired compartment?", "a": "Staff, after removing the package: a staff_clear(code) that marks it free and drops the token. open_expired_compartments only opens the doors."}]}
]})

S.append({"id": "lldm-explain", "title": "Explain it back", "blocks": [
    turn("Give me a summary.",
         ["**Three classes and an enum.** The Locker is the entry point: deposit by size returns a code, pickup by code opens the door, and staff can open expired compartments. An AccessToken holds the code, its expiry and its compartment. A Compartment holds its size and whether it's occupied. Each class owns what it knows best.",
          "**It extends in one place each time:** size fallback changes one helper, broken doors turn occupied into a status, and a two-phase deposit or a lock handles a door that never closes or two drivers at once."],
         check=["Under a minute?", "Do you end on what it can grow into?"])
]})

S.append({"id": "lldm-final", "title": "The final code, in one file", "blocks": [
    {"t": "p", "text": "The core with both extensions applied (size fallback and out-of-service compartments), and a run at the bottom."},
    {"t": "svg", "svg": MAP_SVG, "alt": "Class map"},
    {"t": "svg", "svg": FLOW_SVG, "alt": "Deposit and pickup flow"},
    code("lldm-final-code", "locker.py", FINAL_FILE),
    {"t": "p", "text": "The run prints: occupied, out of service, occupied (the second small package fell back to medium, skipped the jammed M0 and went into M1); available after pickup; code expired."}
]})

part = {"tab": "lld", "id": "lld-mock-locker", "n": 8, "one": True,
        "title": "Mock: Amazon Locker, the whole round",
        "minutes": 45,
        "lead": "A full locker round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. Three classes and an enum; about 40 minutes. Try each box before you open the answer.",
        "sections": S}

head = ("/* Amazon loop, LLD mock: Amazon Locker end to end. Generated by interviews/coding/amazon_lld_mock_gen.py;\n"
        "   edit that, not this file. Every code sample was run with Python 3.12 by the generator. */\n"
        "window.LOOP_CODING = window.LOOP_CODING || { parts: [] };\n")
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write(head + "window.LOOP_CODING.parts.push(" + json.dumps(part, ensure_ascii=False, indent=1) + ");\n")
print("wrote", OUT)
