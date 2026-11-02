"""Parking lot. A drill in the Locker shape: Spot, Ticket, ParkingLot and a Size enum; fees by the hour."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


ENTER = method('''
    def enter(self, plate: str, size: Size, now: datetime) -> Ticket:
        """
        Core logic:
          1. Find the smallest free spot the vehicle fits in
          2. Park the vehicle there
          3. Create a ticket (id, plate, size, spot, entry time) and store it
          4. Return the ticket
        Edge cases:
          1. Plate already parked -> error
          2. No free spot that fits -> error
        """
        if self._is_parked(plate):
            raise ParkingError(f"{plate} is already parked")
        spot = self._find_spot(size)
        if spot is None:
            raise ParkingError(f"no free spot for {size.name.lower()}")
        spot.park(plate)
        ticket = Ticket(self.next_id, plate, size, spot, now)
        self.next_id += 1
        self.tickets[ticket.ticket_id] = ticket
        return ticket
''')

EXIT = method('''
    def exit(self, ticket_id: int, now: datetime) -> int:
        """
        Core logic:
          1. Look up the ticket
          2. Work out the fee from the time parked
          3. Free the spot and close the ticket
          4. Return the fee in cents
        Edge cases:
          1. Unknown or already used ticket -> error
        """
        ticket = self.tickets.get(ticket_id)
        if ticket is None:
            raise ParkingError("unknown ticket")
        fee = self._fee(ticket, now)
        ticket.spot.leave()
        del self.tickets[ticket_id]
        return fee
''')

FREE_COUNT = method('''
    def free_count(self, size: Size) -> int:
        """
        Core logic:
          1. Count the free spots a vehicle of this size fits in
        Edge cases:
          1. None free -> 0
        """
        return sum(1 for s in self.spots if s.fits(size))
''')

HELPERS_COMMON = method('''
    def _find_spot(self, size: Size):
        """Smallest free spot that fits; ties go to the first one listed (the lowest level)."""
        candidates = [s for s in self.spots if s.fits(size)]
        return min(candidates, key=lambda s: s.size, default=None)

    def _is_parked(self, plate: str) -> bool:
        return any(t.plate == plate for t in self.tickets.values())
''')

FEE = method('''
    def _fee(self, ticket: Ticket, now: datetime) -> int:
        """Every started hour counts; the rate depends on the vehicle's size."""
        hours = max(1, ceil((now - ticket.entered_at) / timedelta(hours=1)))
        return hours * self.RATE_PER_HOUR[ticket.size]
''')

HEAD = D('''\
    from datetime import datetime, timedelta
    from enum import IntEnum
    from math import ceil


    class Size(IntEnum):
        SMALL = 1
        MEDIUM = 2
        LARGE = 3


    class ParkingError(Exception):
        pass
    ''')

SPOT = D('''\


    class Spot:
        def __init__(self, spot_id: str, size: Size):
            self.spot_id = spot_id
            self.size = size
            self.plate = None            # the vehicle in it, or None

        def fits(self, size: Size) -> bool:
            return self.plate is None and self.size >= size

        def park(self, plate: str) -> None:
            self.plate = plate

        def leave(self) -> None:
            self.plate = None
    ''')

TICKET = D('''\


    class Ticket:
        def __init__(self, ticket_id: int, plate: str, size: Size, spot: Spot, entered_at: datetime):
            self.ticket_id = ticket_id
            self.plate = plate
            self.size = size
            self.spot = spot
            self.entered_at = entered_at
    ''')

LOT = D('''\


    class ParkingLot:
        RATE_PER_HOUR = {Size.SMALL: 100, Size.MEDIUM: 200, Size.LARGE: 400}   # cents

        def __init__(self, spots: list):
            self.spots = spots               # listed lowest level first
            self.tickets = {}                # ticket_id -> Ticket
            self.next_id = 1
    ''')

CORE = HEAD + SPOT + TICKET + LOT + in_class(ENTER, EXIT, FREE_COUNT, HELPERS_COMMON, FEE)

DEMO = D('''\


    # ---- a quick run ----
    lot = ParkingLot([Spot("S1", Size.SMALL), Spot("M1", Size.MEDIUM), Spot("L1", Size.LARGE)])
    t0 = datetime(2026, 11, 1, 9, 0)
    bike = lot.enter("BIKE-1", Size.SMALL, t0)
    car = lot.enter("CAR-1", Size.MEDIUM, t0)
    print(bike.spot.spot_id, car.spot.spot_id)
    print(lot.enter("CAR-2", Size.MEDIUM, t0).spot.spot_id)      # medium is taken, so a car uses the large spot
    try:
        lot.enter("TRUCK-1", Size.LARGE, t0)
    except ParkingError as e:
        print(e)
    print(lot.exit(car.ticket_id, t0 + timedelta(hours=2, minutes=20)))
    print(lot.free_count(Size.MEDIUM))
    try:
        lot.exit(car.ticket_id, t0)
    except ParkingError as e:
        print(e)
    ''')
DEMO_OUT = "S1 M1\nL1\nno free spot for large\n600\n1\nunknown ticket\n"

# ---- extensions ----
EXT_PRICING = D('''\
    class Pricing:
        RATE_PER_HOUR = {Size.SMALL: 100, Size.MEDIUM: 200, Size.LARGE: 400}

        def fee(self, ticket: Ticket, now: datetime) -> int:
            hours = max(1, ceil((now - ticket.entered_at) / timedelta(hours=1)))
            return hours * self.RATE_PER_HOUR[ticket.size]


    class CappedPricing(Pricing):
        def __init__(self, cap: int):
            self.cap = cap

        def fee(self, ticket: Ticket, now: datetime) -> int:
            return min(super().fee(ticket, now), self.cap)


    class ParkingLot:
        def __init__(self, spots: list, pricing: Pricing = None):
            ...
            self.pricing = pricing or Pricing()

        def exit(self, ticket_id: int, now: datetime) -> int:
            ...
            fee = self.pricing.fee(ticket, now)      # was self._fee(ticket, now)
    ''')

FINAL_ENTER = method('''
    def enter(self, plate: str, size: Size, now: datetime) -> Ticket:
        """Same steps; choosing a spot and parking in it happen under one lock."""
        with self.lock:
            if self._is_parked(plate):
                raise ParkingError(f"{plate} is already parked")
            spot = self._find_spot(size)
            if spot is None:
                raise ParkingError(f"no free spot for {size.name.lower()}")
            spot.park(plate)
            ticket = Ticket(self.next_id, plate, size, spot, now)
            self.next_id += 1
            self.tickets[ticket.ticket_id] = ticket
            return ticket
''')

FINAL_EXIT = method('''
    def exit(self, ticket_id: int, now: datetime) -> int:
        """Same steps; the fee comes from the pricing rule, and closing the ticket is under the lock."""
        with self.lock:
            ticket = self.tickets.get(ticket_id)
            if ticket is None:
                raise ParkingError("unknown ticket")
            fee = self.pricing.fee(ticket, now)
            ticket.spot.leave()
            del self.tickets[ticket_id]
            return fee
''')

FINAL_HEAD = HEAD.replace("from math import ceil\n", "from math import ceil\nfrom threading import Lock, Thread\n")

PRICING = D('''\


    class Pricing:
        RATE_PER_HOUR = {Size.SMALL: 100, Size.MEDIUM: 200, Size.LARGE: 400}   # cents

        def fee(self, ticket: Ticket, now: datetime) -> int:
            hours = max(1, ceil((now - ticket.entered_at) / timedelta(hours=1)))
            return hours * self.RATE_PER_HOUR[ticket.size]


    class CappedPricing(Pricing):
        def __init__(self, cap: int):
            self.cap = cap

        def fee(self, ticket: Ticket, now: datetime) -> int:
            return min(super().fee(ticket, now), self.cap)
    ''')

FINAL_LOT = D('''\


    class ParkingLot:
        def __init__(self, spots: list, pricing: Pricing = None):
            self.spots = spots
            self.tickets = {}
            self.next_id = 1
            self.pricing = pricing or Pricing()
            self.lock = Lock()               # one gate at a time chooses and parks
    ''')

FINAL = FINAL_HEAD + SPOT + TICKET + PRICING + FINAL_LOT + in_class(FINAL_ENTER, FINAL_EXIT, FREE_COUNT, HELPERS_COMMON)

FINAL_DEMO = D('''\


    # ---- a quick run ----
    lot = ParkingLot([Spot("M1", Size.MEDIUM)], CappedPricing(cap=1500))
    t0 = datetime(2026, 11, 1, 9, 0)
    results = []


    def arrive(plate):
        try:
            results.append(lot.enter(plate, Size.MEDIUM, t0))
        except ParkingError:
            results.append(None)


    gates = [Thread(target=arrive, args=(p,)) for p in ("A", "B")]
    for g in gates:
        g.start()
    for g in gates:
        g.join()
    winners = [r for r in results if r]
    print(len(winners), "of 2 got the last spot")
    print(lot.exit(winners[0].ticket_id, t0 + timedelta(hours=10)))
    ''')
FINAL_OUT = "1 of 2 got the last spot\n1500\n"

PROBLEM = {
    "id": "parking", "title": "Parking lot", "part_id": "lld-parking", "n": 2,
    "part_title": "Parking lot", "minutes": 40,
    "lead": "A parking lot round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. Three classes and an enum, then a second pricing rule and two gates racing for the last spot. Try each box before you open the answer.",
    "prompt": "Design a parking lot.",
    "evidence": "roundz Jul 2025 (SDE2, concurrency was the headline); LeetCode Discuss Jun 2025 and Apr 2026 ('a system like a library or parking lot'); TechPrep.",
    "drill": "part 2, Parking lot.",

    "clarify": {
        "capabilities": [("Which vehicles park here, and does size matter?", "Motorcycles, cars and trucks. Spots are small, medium or large; a vehicle fits a spot its size or bigger"),
                         ("Does the driver choose a spot, or does the system?", "The system assigns the smallest free spot that fits, lowest level first"),
                         ("What does the driver get on entry and exit?", "A ticket on entry; on exit they hand it back and are told the amount owed")],
        "errors": [("What if the lot is full for that vehicle?", "Refuse entry with an error; no waiting list"),
                   ("A lost or already used ticket?", "Return an error"),
                   ("How is the price decided?", "Every started hour, at a rate per vehicle size; expect another rule later")],
        "scope": [("Taking payment, reservations, plate recognition?", "No: the lot returns the amount owed and stops"),
                  ("Many gates, or one garage?", "One garage, in memory. Expect me to ask about gates racing later")],
    },
    "clarify_hint": "Vehicle sizes and how a spot is chosen. What a ticket is. Full lot, lost ticket, how the price works. Payment, reservations, many gates.",
    "clarify_say": "**I group my questions in three buckets: what it must do, what goes wrong, where scope stops.** Sizes and how a spot is chosen first, because they decide the classes. Then a full lot and a bad ticket. Then what I will not build.",
    "clarify_why": "Every question changes a class or a method. Sizes give an enum and the fits rule. The ticket gives a class. Pricing gives the fee helper that the first extension replaces.",
    "answers": "Motorcycles, cars and trucks; small, medium and large spots, and a vehicle takes a spot its size or bigger. The system assigns the smallest free spot that fits, lowest level first. The driver gets a ticket on entry and is told the amount owed on exit. A full lot returns an error, and so does an unknown ticket. The fee is every started hour at a rate by vehicle size. Payment, reservations and plate recognition are out of scope. One garage, in memory.",
    "playback": ["Thanks, that's clear. **So: three sizes, the smallest spot that fits, a ticket in and an amount owed out, errors for full and unknown ticket, hourly fee.** Out of scope: payment, reservations, plate recognition, saving to a database."],

    "requirements": [
        ["A vehicle of a given size enters the lot.", "The system assigns the smallest free spot it fits in", "Parks it and returns a ticket, or an error if none fits or the plate is already parked"],
        ["A driver exits by handing back the ticket.", "The system frees the spot and returns the amount owed", "An error if the ticket is unknown or already used"],
        ["The fee is every started hour at a rate by vehicle size."],
        ["Anyone can ask how many free spots fit a size."],
    ],
    "out_of_scope": ["taking payment", "reservations", "plate recognition", "a UI or API layer", "saving to a database"],
    "req_hint": "A vehicle enters, a vehicle exits, the fee, free counts.",
    "req_say": "From your answers I get four requirements. **Each one is a thing someone does, and each becomes a method: enter, exit, the fee, free counts.** I say the error case with each so I don't forget it in the code.",
    "req_why": "Each requirement maps to a method: 1 is enter, 2 and 3 are exit and its fee helper, 4 is free_count.",

    "entities": [("Vehicle", False, "Only its plate and size matter, and both are parameters of enter"),
                 ("Spot", True, "Has a size and holds a vehicle or is free"),
                 ("Ticket", True, "Id, plate, size, spot and entry time: what exit needs to price the stay"),
                 ("ParkingLot", True, "Runs enter, exit and the free counts"),
                 ("Level", False, "Only an ordering of spots here; a prefix in the spot id and the order of the list cover it"),
                 ("Driver / Gate", False, "External; not modelled")],
    "ent_hint": "What do we need to know about a vehicle? Does a level do anything the list of spots doesn't?",
    "ent_say": "I underline the nouns. **Spot, ticket and the lot carry data or behaviour I need, so they stay.** A vehicle is only a plate and a size, so those become parameters. A level only orders spots, so the list order covers it.",
    "ent_why": "Three classes and one enum. Dropping Vehicle and Level is the move interviewers notice: you modelled what the requirements need, and Level comes back only if the requirements give it behaviour.",

    "classes": [
        {"name": "ParkingLot", "state": ["spots: Spot[]  (lowest level first)  # enter scans in order for the first free fit",
                                         "tickets: Map<ticket_id, Ticket>  # exit only gets an id; a map finds it in one step",
                                         "next_id: int  # every ticket needs a unique id; a counter hands out the next"],
         "behaviour": ["enter(plate, size, now) -> Ticket | error  # req 1",
                       "exit(ticket_id, now) -> fee in cents | error  # req 2 and 3: free the spot, price the stay",
                       "free_count(size) -> int  # req 4: the sign at the gate"]},
        {"name": "Spot", "state": ["spot_id: string  # printed on the ticket so the driver finds the car",
                                   "size: Size  (SMALL, MEDIUM, LARGE -> enum)  # decides what fits",
                                   "plate: string | None  # None means free; no separate flag"],
         "behaviour": ["fits(size) -> boolean  # the size rule lives in one place",
                       "park(plate) -> void  # the spot changes its own state",
                       "leave() -> void  # exit calls it to free the spot"]},
        {"name": "Ticket", "state": ["ticket_id: int  # the key in the lot's map",
                                     "plate: string  # catches the same car entering twice",
                                     "size: Size  # the fee rate, without a second lookup",
                                     "spot: Spot  # exit frees this spot directly",
                                     "entered_at: datetime  # fee = now - entered_at"],
         "behaviour": []},
    ],
    "class_hint": "The lot holds spots and open tickets. A spot holds a size and who is in it. A ticket holds what exit needs for the fee.",
    "class_say": "**I start from the methods the requirements gave me, then ask what each one has to read.** Enter needs the spots in order, so the lot holds a list. Exit gets only a ticket id, so the lot keeps tickets in a map by id, and a counter to make new ids. The ticket carries what the fee needs: size, spot and entry time.",
    "class_why": "Exit looks a ticket up by id, so a map keeps it to one step. The ticket stores the vehicle size so the fee needs no second lookup.",
    "class_qa": [{"ask": "Why is the vehicle not a class?",
                  "say": "Because the lot only ever needs its plate and its size, and both come in as arguments. **I'd add a Vehicle class when a vehicle has behaviour,** say a truck that needs two spots. Until then it's a class that only carries data.",
                  "explain": ["Say the same about Car, Motorcycle and Truck as subclasses: only the size differs, so a Size enum does the job."]}],

    "map": {"center": ("ParkingLot", "enter, exit, free_count"),
            "owned": [("Spot", "size, plate"), ("Ticket", "plate, spot, entry time")],
            "uses": [("Size (enum)", "SMALL, MEDIUM, LARGE")]},

    "methods": [
        {"name": "enter", "q": "enter(plate, size, now): core logic and edge cases as comments, then the code.",
         "hint": "Find the smallest spot that fits, park, make and store the ticket, return it. Edges: already parked, none free.", "code": ENTER,
         "why": "_find_spot and _is_parked are named here and written after. The flow reads in four lines."},
        {"name": "exit", "q": "exit(ticket_id, now): core logic, edge cases, code.",
         "hint": "Look up, price it, free the spot, close the ticket. Edge: unknown ticket.", "code": EXIT,
         "why": "The fee is computed before the spot is freed and the ticket deleted, so an error can't leave a half-closed ticket."},
        {"name": "free_count", "q": "free_count(size): how many spots can take this vehicle?",
         "hint": "Count the spots whose fits() is true.", "code": FREE_COUNT,
         "why": "It reuses fits(), the same rule enter uses, so the count and the allocation can never disagree."},
    ],
    "helpers": {"q": "Now the helpers: _find_spot, _is_parked, _fee.",
                "starter": "def _find_spot(self, size):\n    ...\n",
                "hint": "The free spots that fit, then the smallest. Any open ticket with this plate. Started hours times the rate for the size.",
                "code": HELPERS_COMMON + "\n" + FEE,
                "why": "A linear scan is fine for a lot with hundreds of spots. Keeping a free list per size is faster but puts state in two places."},

    "extensions": [
        {"ask": "Pricing changes: a daily cap now, a flat weekend rate next month. What do you touch?",
         "say": "Only the fee. I move it out of the lot into a Pricing class that the lot is given, and the daily cap is a subclass. **enter, exit's steps and every other class stay the same,** and a weekend rate is one more subclass.",
         "code": EXT_PRICING, "code_title": "Pricing passed to the lot",
         "short_q": "New pricing rule", "short_a": "move _fee into a Pricing class given to the lot; each rule is a subclass"},
        {"ask": "Two cars reach the last spot at the same moment from two gates.",
         "say": "Choosing the spot and parking in it must happen as one step, or both cars get the same spot. **I'd put one lock around finding and parking,** and around closing a ticket in exit. A lock per level is the next step if one lock becomes the bottleneck.",
         "short_q": "Two gates, last spot", "short_a": "find a spot and park as one step under a lock; a lock per level if it bottlenecks"},
        {"ask": "The garage has several levels and the driver wants the spot nearest the entrance.",
         "say": "Spots already carry an order, so this is a different choice in _find_spot: the smallest size, then the lowest distance from the entrance. If levels need free counts or their own rules, **Level becomes a class that owns its spots** and the lot asks each level.",
         "short_q": "Levels and nearest spot", "short_a": "only _find_spot changes; Level becomes a class when it needs counts or rules"},
        {"ask": "A driver loses the ticket.",
         "say": "Look the ticket up by plate, which is why tickets store it, and charge a flat lost-ticket fee. It is one more rule in Pricing.",
         "short_q": "Lost ticket", "short_a": "find the ticket by plate, charge a flat fee from Pricing"},
    ],
    "faq": [("What if a truck needs two adjacent spots?", "A spot gets a neighbour link and fits() checks a run of spots. Only Spot and _find_spot change."),
            ("Many garages?", "A garage network that tries each lot and calls its enter. ParkingLot doesn't change.")],

    "summary": ["**Three classes and an enum.** The ParkingLot is the entry point: a vehicle enters by size and gets a ticket for the smallest free spot that fits, and exits with the ticket to get the amount owed. A Spot holds its size and who is in it. A Ticket holds the plate, size, spot and entry time.",
                "**It extends in one place each time:** a new pricing rule is a Pricing class given to the lot, nearest spot changes one helper, and two gates racing for the last spot are one lock around choose-and-park."],

    "golden": [
        ("Choosing a spot and parking in it is one step. With two gates, anything less gives one spot to two cars.", "it is the concurrency headline in the reports, and the senior signal."),
        ("Vehicle isn't a class and Car, Truck aren't subclasses; the size is a parameter and an enum.", "it shows scope judgment: you model behaviour, not nouns."),
        ("The ticket stores everything exit needs, and tickets live in a map by id.", "exit is one lookup, and a used ticket is an error because it is gone."),
        ("The fee sits in one helper, so a new rule changes one place.", "interviewers always ask for a second pricing rule, and the answer is a swap, not a rewrite."),
        ("fits() is the one rule for both allocation and free counts.", "the count can't disagree with what enter does."),
        ("Fee is computed before the spot is freed, so an error never leaves a half-closed ticket.", "it shows you thought about order of steps, not only the happy path."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with both extensions applied (a Pricing rule given to the lot, and a lock around choose-and-park), and a run at the bottom.",
    "final_title": "parking.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "one of the two cars got the last spot (the lock made the other fail with an error); the ten-hour stay costs 1500 because the cap beats 10 hours at 200.",
}
