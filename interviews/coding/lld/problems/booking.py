"""Ticket booking (movie or train). A drill in the Locker shape: BookingService, Show, Hold, Booking.
A hold is a noun with a rule (its expiry), so it is a class. Time is passed in as now; expired holds release when a show is read.
One lock per show is in the core: two users grabbing the same seat is part of the question."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the service: hold, confirm, cancel ----
HOLD_SEATS = method('''
    def hold_seats(self, show_id: str, seats: list, user: str, now: int) -> str:
        """
        Core logic:
          1. Find the show and check the seats are a sensible request
          2. Under the show's lock, release holds that have expired
          3. If every chosen seat is free, create a Hold that ends hold_minutes from now
          4. Mark the seats held, remember the hold, return its id
        Edge cases:
          1. Unknown show -> error
          2. No seats, a seat listed twice, or a seat the show doesn't have -> error
          3. Any seat booked or held by someone else -> error, and nothing is held
        """
        show = self._get_show(show_id)                     # Edge 1
        self._check_seats(show, seats)                     # Edge 2
        with show.lock:                                    # check and mark are one step, so two users can't both win
            show.release_expired(now)                      # Step 2: an abandoned hold frees its seats here, no timer
            if not show.all_free(seats):                   # Edge 3: nothing has been changed yet, so nothing to undo
                raise BookingError("a seat is not available")
            hold = Hold(self._new_id("h"), show_id, user, list(seats), now + self.hold_minutes)   # Step 3
            show.place(hold)                               # Step 4
            self.holds[hold.hold_id] = hold
        return hold.hold_id
''')

CONFIRM = method('''
    def confirm(self, hold_id: str, user: str, now: int) -> Booking:
        """
        Core logic:
          1. Find the hold and check it is this user's
          2. Under the show's lock, release expired holds, then check this hold is still alive
          3. Turn its held seats into booked seats
          4. Drop the hold, create and store the Booking
        Edge cases:
          1. Unknown hold, or someone else's -> error
          2. The hold has expired -> error: its seats were released and may be taken by now
          3. The hold was used a moment ago by another call -> error
        """
        hold = self._get_hold(hold_id, user)               # Edge 1
        show = self.shows[hold.show_id]
        with show.lock:
            if hold_id not in self.holds:                  # Edge 3: another call confirmed it while we waited for the lock
                raise BookingError("unknown hold")
            show.release_expired(now)
            if hold.is_expired(now):                       # Edge 2: the expiry rule lives on the Hold
                del self.holds[hold_id]
                raise BookingError("hold expired")
            show.book(hold)                                # Step 3: held -> booked
            del self.holds[hold_id]                        # Step 4: a hold is used once
            booking = Booking(self._new_id("b"), hold.show_id, user, hold.seats)
            self.bookings[booking.booking_id] = booking
        return booking
''')

CANCEL = method('''
    def cancel(self, booking_id: str) -> None:
        """
        Core logic:
          1. Find the booking and its show
          2. Under the lock, mark the booking cancelled
          3. Put its seats back on sale
        Edge cases:
          1. Unknown booking -> error
          2. Already cancelled -> error (raised by Booking.cancel)
        """
        booking = self.bookings.get(booking_id)
        if booking is None:                                # Edge 1
            raise BookingError("unknown booking")
        show = self.shows[booking.show_id]
        with show.lock:                                    # two cancels of one booking can't both free the seats
            booking.cancel()                               # Step 2 and Edge 2: the booking knows if it is already cancelled
            show.free(booking.seats)                       # Step 3
''')

# ---- the show: expiry and availability ----
SHOW_RELEASE = method('''
    def release_expired(self, now: int) -> None:
        """
        Core logic:
          1. Find the seats whose hold has expired
          2. Remove them from held, so they count as free again
        Edge cases:
          1. A hold that ends exactly at now counts as expired (Hold.is_expired)
        """
        expired = [seat for seat, hold in self.held.items() if hold.is_expired(now)]   # collect first: no editing while looping
        for seat in expired:
            del self.held[seat]
''')

SHOW_ALL_FREE = method('''
    def all_free(self, seats: list) -> bool:
        """
        Core logic:
          1. Look at every chosen seat
          2. Any seat booked or held -> False
        Edge cases:
          1. Call release_expired first: this method trusts held to be current
        """
        for seat in seats:
            if not self.is_free(seat):
                return False
        return True
''')

SHOW_HELPERS = method('''
    def is_free(self, seat: str) -> bool:
        return seat not in self.booked and seat not in self.held

    def place(self, hold: Hold) -> None:
        for seat in hold.seats:                            # every seat points at the one Hold, so release is per seat
            self.held[seat] = hold

    def book(self, hold: Hold) -> None:
        for seat in hold.seats:
            del self.held[seat]
            self.booked.add(seat)

    def free(self, seats: list) -> None:
        for seat in seats:
            self.booked.discard(seat)                      # discard: no error if a seat is already gone
''')

SVC_ADD_SHOW = method('''
    def add_show(self, show_id: str, seats: list) -> None:
        self.shows[show_id] = Show(show_id, seats)         # setup: nobody books a show that doesn't exist
''')

SVC_HELPERS = method('''
    def available_seats(self, show_id: str, now: int) -> list:
        show = self._get_show(show_id)
        with show.lock:
            show.release_expired(now)                      # a read frees expired holds too
            return [seat for seat in sorted(show.seats) if show.is_free(seat)]

    def _get_show(self, show_id: str) -> Show:
        if show_id not in self.shows:
            raise BookingError(f"no show {show_id}")
        return self.shows[show_id]

    def _check_seats(self, show: Show, seats: list) -> None:
        if not seats:
            raise BookingError("pick at least one seat")
        if len(set(seats)) != len(seats):                  # a set drops repeats, so a shorter set means a repeat
            raise BookingError("a seat is listed twice")
        for seat in seats:
            if seat not in show.seats:
                raise BookingError(f"no seat {seat}")

    def _get_hold(self, hold_id: str, user: str) -> Hold:
        hold = self.holds.get(hold_id)
        if hold is None:
            raise BookingError("unknown hold")
        if hold.user != user:                              # a hold belongs to whoever made it
            raise BookingError("not your hold")
        return hold

    def _new_id(self, prefix: str) -> str:
        return f"{prefix}{next(self._ids)}"                # next() on a count is one step, safe across threads
''')

HEAD = D('''\
    from itertools import count
    from threading import Lock


    class BookingError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

HOLD = D('''\


    class Hold:
        """Seats kept for one user until a time. Not a booking yet: it ends by itself."""

        def __init__(self, hold_id: str, show_id: str, user: str, seats: list, expires_at: int):
            self.hold_id = hold_id           # what hold_seats returns and confirm takes
            self.show_id = show_id           # confirm finds the show from the hold alone
            self.user = user                 # confirm checks the hold is theirs
            self.seats = seats               # seat ids, all held or none
            self.expires_at = expires_at     # minutes; the one number that makes a hold temporary

        def is_expired(self, now: int) -> bool:
            return now >= self.expires_at    # the rule lives here, once; nobody compares times elsewhere
    ''')

BOOKING = D('''\


    class Booking:
        """A confirmed purchase. It can be cancelled once."""

        def __init__(self, booking_id: str, show_id: str, user: str, seats: list):
            self.booking_id = booking_id     # cancel gets only this
            self.show_id = show_id           # cancel finds the show from it
            self.user = user
            self.seats = seats               # cancel frees exactly these
            self.cancelled = False

        def cancel(self) -> None:
            if self.cancelled:
                raise BookingError("already cancelled")
            self.cancelled = True
    ''')

SHOW = D('''\


    class Show:
        """One screening: which seats it has and which are held or booked. It does not know about users."""

        def __init__(self, show_id: str, seats: list):
            self.show_id = show_id
            self.seats = set(seats)          # every seat id the show has
            self.held = {}                   # seat id -> the Hold keeping it; empty means not held
            self.booked = set()              # seat ids sold
            self.lock = Lock()               # one per show, so two shows never wait on each other
    ''')

SERVICE = D('''\


    class BookingService:
        """The entry point: holds seats, confirms holds, cancels bookings."""

        def __init__(self, hold_minutes: int = 5):
            self.hold_minutes = hold_minutes # how long a hold lasts
            self.shows = {}                  # show id -> Show; hold starts from a show id
            self.holds = {}                  # hold id -> Hold; confirm gets only a hold id
            self.bookings = {}               # booking id -> Booking; cancel gets only a booking id
            self._ids = count(1)             # h1, b2, h3...: unique across both kinds
    ''')

CORE = (HEAD + HOLD + BOOKING + SHOW + in_class(SHOW_RELEASE, SHOW_ALL_FREE, SHOW_HELPERS)
        + SERVICE + in_class(HOLD_SEATS, CONFIRM, CANCEL, SVC_ADD_SHOW + "\n" + SVC_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    svc = BookingService(hold_minutes=5)
    svc.add_show("s1", ["A1", "A2", "A3", "A4"])
    h1 = svc.hold_seats("s1", ["A1", "A2"], "ann", now=0)       # ann holds two seats until minute 5
    print("ann holds", h1, "free:", svc.available_seats("s1", 0))
    for attempt in (lambda: svc.hold_seats("s1", ["A2", "A3"], "bob", now=1),   # A2 is ann's: bob gets nothing
                    lambda: svc.hold_seats("s1", ["A9"], "bob", now=1)):
        try:
            attempt()
        except BookingError as e:
            print(e)
    print("after bob's try:", svc.available_seats("s1", 1))     # A3 is still free: bob's hold was all or nothing
    print("at minute 6:", svc.available_seats("s1", 6))         # ann never paid, so her seats are back
    h2 = svc.hold_seats("s1", ["A2", "A3"], "bob", now=6)
    b = svc.confirm(h2, "bob", now=7)
    print("bob booked", b.seats, "free:", svc.available_seats("s1", 7))
    try:
        svc.confirm(h1, "ann", now=7)                           # ann comes back too late
    except BookingError as e:
        print(e)
    svc.cancel(b.booking_id)
    print("after cancel:", svc.available_seats("s1", 7))
    try:
        svc.cancel(b.booking_id)
    except BookingError as e:
        print(e)
    ''')
DEMO_OUT = ("ann holds h1 free: ['A3', 'A4']\na seat is not available\nno seat A9\nafter bob's try: ['A3', 'A4']\n"
            "at minute 6: ['A1', 'A2', 'A3', 'A4']\nbob booked ['A2', 'A3'] free: ['A1', 'A4']\nhold expired\n"
            "after cancel: ['A1', 'A2', 'A3', 'A4']\nalready cancelled\n")

# ---- extensions ----
EXT_PRICE = D('''\
    class Show:
        def __init__(self, show_id: str, prices: dict, starts_at: int):
            ...
            self.seats = set(prices)         # the seats are the keys
            self.prices = prices             # seat id -> price; a premium row costs more

        def total(self, seats: list) -> int:
            total = 0
            for seat in seats:
                total += self.prices[seat]
            return total


    class Booking:
        def __init__(self, booking_id, show_id, user, seats, total):
            ...
            self.total = total               # the price paid, stored: a later price change doesn't rewrite it


    class BookingService:
        def confirm(self, hold_id: str, user: str, now: int) -> Booking:
            ...
            booking = Booking(self._new_id("b"), hold.show_id, user, hold.seats, show.total(hold.seats))
    ''')

EXT_REFUND = D('''\
    class Show:
        def refund(self, paid: int, now: int) -> int:
            """The rule moves with the show's start, so it lives on Show."""
            if now <= self.starts_at - 60:
                return paid                  # an hour or more before: everything back
            if now < self.starts_at:
                return paid // 2             # inside the hour: half
            return 0                         # after it starts: nothing


    class BookingService:
        def cancel(self, booking_id: str, now: int) -> int:
            ...
            with show.lock:
                booking.cancel()
                show.free(booking.seats)
            return show.refund(booking.total, now)
    ''')

# the final file: core + prices + refunds
F_BOOKING = D('''\


    class Booking:
        """A confirmed purchase. It can be cancelled once."""

        def __init__(self, booking_id: str, show_id: str, user: str, seats: list, total: int):
            self.booking_id = booking_id
            self.show_id = show_id
            self.user = user
            self.seats = seats
            self.total = total               # the price paid, stored so a later price change doesn't rewrite it
            self.cancelled = False

        def cancel(self) -> None:
            if self.cancelled:
                raise BookingError("already cancelled")
            self.cancelled = True
    ''')

F_SHOW = D('''\


    class Show:
        """One screening: its seats with prices, and which are held or booked."""

        def __init__(self, show_id: str, prices: dict, starts_at: int):
            self.show_id = show_id
            self.prices = prices             # seat id -> price
            self.seats = set(prices)
            self.starts_at = starts_at       # minutes; the refund rule reads it
            self.held = {}
            self.booked = set()
            self.lock = Lock()
    ''')

F_SHOW_NEW = method('''
    def total(self, seats: list) -> int:
        total = 0
        for seat in seats:
            total += self.prices[seat]
        return total

    def refund(self, paid: int, now: int) -> int:
        if now <= self.starts_at - 60:
            return paid                      # an hour or more before: everything back
        if now < self.starts_at:
            return paid // 2                 # inside the hour: half
        return 0                             # after it starts: nothing
''')

F_ADD_SHOW = method('''
    def add_show(self, show_id: str, prices: dict, starts_at: int) -> None:
        self.shows[show_id] = Show(show_id, prices, starts_at)
''')

F_CONFIRM = method('''
    def confirm(self, hold_id: str, user: str, now: int) -> Booking:
        """Same steps as before; the booking now carries the total."""
        hold = self._get_hold(hold_id, user)
        show = self.shows[hold.show_id]
        with show.lock:
            if hold_id not in self.holds:
                raise BookingError("unknown hold")
            show.release_expired(now)
            if hold.is_expired(now):
                del self.holds[hold_id]
                raise BookingError("hold expired")
            show.book(hold)
            del self.holds[hold_id]
            booking = Booking(self._new_id("b"), hold.show_id, user, hold.seats, show.total(hold.seats))   # new: the price
            self.bookings[booking.booking_id] = booking
        return booking
''')

F_CANCEL = method('''
    def cancel(self, booking_id: str, now: int) -> int:
        """Same steps as before; it now returns the refund."""
        booking = self.bookings.get(booking_id)
        if booking is None:
            raise BookingError("unknown booking")
        show = self.shows[booking.show_id]
        with show.lock:
            booking.cancel()
            show.free(booking.seats)
        return show.refund(booking.total, now)             # new: the show's start decides how much comes back
''')

FINAL = (HEAD + HOLD + F_BOOKING + F_SHOW + in_class(SHOW_RELEASE, SHOW_ALL_FREE, SHOW_HELPERS, F_SHOW_NEW)
         + SERVICE + in_class(HOLD_SEATS, F_CONFIRM, F_CANCEL, F_ADD_SHOW + "\n" + SVC_HELPERS))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    svc = BookingService(hold_minutes=5)
    svc.add_show("s1", {"A1": 100, "A2": 100, "B1": 150}, starts_at=120)     # row B costs more
    h = svc.hold_seats("s1", ["A1", "B1"], "ann", now=0)
    b = svc.confirm(h, "ann", now=2)
    print("ann paid", b.total)
    print("cancel at 30 refunds", svc.cancel(b.booking_id, now=30))          # more than an hour before the start
    h = svc.hold_seats("s1", ["A2"], "bob", now=40)
    b = svc.confirm(h, "bob", now=41)
    print("cancel at 90 refunds", svc.cancel(b.booking_id, now=90))          # inside the last hour
    h = svc.hold_seats("s1", ["A1", "A2"], "cy", now=100)
    b = svc.confirm(h, "cy", now=101)
    print("cancel at 125 refunds", svc.cancel(b.booking_id, now=125))        # after the start
    ''')
FINAL_OUT = "ann paid 250\ncancel at 30 refunds 250\ncancel at 90 refunds 50\ncancel at 125 refunds 0\n"


PROBLEM = {
    "id": "booking", "title": "Ticket booking (movie or train)", "part_id": "lld-booking", "n": 11,
    "part_title": "Ticket booking (movie or train)", "minutes": 45,
    "lead": "A booking round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The heart is the hold: seats kept for a few minutes, released by themselves, and taken by one user even when two click at once. Time is passed in as now, so a run is deterministic. Implementation starts with hold_seats and names its helpers before writing them.",
    "prompt": "Design BookMyShow, or a railway reservation system.",
    "evidence": "roundz Mar 2025 (SDE2, a BookMyShow class diagram); GeeksforGeeks (railway booking twice); a reported follow-up: extend from movies to events.",
    "drill": "part 11, Ticket booking (movie or train).",

    "clarify": {
        "capabilities": [("What is being booked?", "Seats for one show; a train journey works the same way"),
                         ("Hold seats while the user pays?", "Yes, for a few minutes, then they go back on sale"),
                         ("Can one booking take several seats?", "Yes, and it is all or nothing")],
        "errors": [("Two people want the same seat?", "It must never be double-booked, even at the same moment"),
                   ("What if the user never pays?", "The hold expires and the seats are free again"),
                   ("A seat that doesn't exist, or the same seat twice?", "Reject it")],
        "scope": [("Search, payments, prices, cancellation?", "Search and payment are out; prices are a follow-up; cancel before the show is in"),
                  ("How does time work?", "The caller passes in the current time, in minutes, so a run is deterministic and needs no timer thread")],
    },
    "clarify_hint": "What is booked and for how long it is held. Two people and one seat. A user who never pays. Search, payment, price. How time works.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The hold comes first, because it makes seats temporary and that decides the whole design. Then the clash: two people and one seat. And last, how time works, since passing the time in means I need no timer thread and the run is easy to trace.",
    "clarify_why": "The hold gives a Hold class with an expiry. All or nothing gives the check-then-mark step. Two people at once gives the lock. Time passed in as now means an expired hold is released when we look, not by a thread.",
    "answers": "Seats for one show; trains work the same way. A user holds one or more seats for a few minutes, and a booking is all or nothing. A seat is never double-booked, even at the same moment. A hold nobody confirms expires and the seats go back on sale. A seat that doesn't exist, or listed twice, is rejected. Cancel before the show is in. Search, payment and prices are out. The caller passes in the time in minutes, with no timer thread.",
    "playback": ["Thanks, that's clear. **So: hold some seats for a few minutes, all or none; confirm turns the hold into a booking; cancel frees the seats; two users can never win the same seat.** An abandoned hold frees itself when we next look, because time is passed in. Out of scope: search, payment, prices."],

    "requirements": [
        ["A user holds one or more seats for a show.", "The system keeps them held until a time, all or none", "A seat that is taken or held, an unknown seat, or a seat listed twice is an error and nothing is held"],
        ["The user confirms the hold.", "The held seats become booked and a Booking is returned", "A hold that expired, is unknown or is not theirs is an error"],
        ["A hold runs out.", "The seats become available again the next time anyone looks, without a timer"],
        ["A user cancels a booking.", "The seats become available", "Cancelling twice is an error"],
        ["Two users go for the same seat at once.", "Exactly one of them gets it"],
    ],
    "out_of_scope": ["search and browsing", "payment", "pricing (an extension)", "notifications", "a real clock or timer thread"],
    "req_hint": "Hold, confirm, a hold running out, cancel, and a clash.",
    "req_say": "From your answers I get five requirements. **Each is something that happens, and the first four become methods: hold_seats, confirm, cancel, and the expiry that both of them trigger.** Requirement 5 is the senior one: check and mark must be one step, so a lock around each show.",
    "req_why": "Each requirement maps to code: 1 is hold_seats, 2 is confirm, 3 is Hold.is_expired plus Show.release_expired, 4 is cancel, 5 is the lock in all three.",

    "entities": [("Show", True, "A screening or a journey: owns its seats, and which are held or booked"),
                 ("Seat", False, "An id string like A1; nothing asks a seat anything"),
                 ("Hold", True, "Seats, a user and an expiry: the expiry is the rule that makes it temporary"),
                 ("Booking", True, "The confirmed seats; it can be cancelled once, and cancel asks it"),
                 ("Booking service", True, "Entry point: hold, confirm, cancel"),
                 ("Theatre / Screen", False, "Only where seats live; a Show carries its seat ids"),
                 ("User, Payment", False, "External; a user id is enough")],
    "ent_hint": "What makes a hold different from a booking? Does anything ask a seat a question?",
    "ent_say": "I underline the nouns. **Show, Hold, Booking and the service stay.** A hold looks like data, but it carries an expiry and answers is_expired, so it earns a class. A seat is an id and nothing asks it anything, so it stays a string. Theatre and screen only say where seats live, and user and payment are external.",
    "ent_why": "Four classes. Hold earns its class because the expiry decides when seats come back, and Booking because it knows if it was cancelled. Seat is dropped: row and number are part of its id.",

    "classes": [
        {"name": "BookingService", "state": ["hold_minutes: int  # how long a hold lasts",
                                             "shows: Map<show_id, Show>  # hold_seats starts from a show id",
                                             "holds: Map<hold_id, Hold>  # confirm gets only a hold id",
                                             "bookings: Map<id, Booking>  # cancel gets only a booking id"],
         "behaviour": ["hold_seats(show_id, seats, user, now) -> hold_id | error  # req 1 and 5: all seats or none, under the lock",
                       "confirm(hold_id, user, now) -> Booking | error  # req 2: held seats become booked",
                       "cancel(booking_id) -> void | error  # req 4: seats go back on sale",
                       "available_seats(show_id, now) -> string[]  # a read also frees expired holds (req 3)"]},
        {"name": "Show", "state": ["show_id: string  # the key the service looks it up by",
                                   "seats: Set<seat_id>  # every seat the show has",
                                   "held: Map<seat_id, Hold>  # which hold keeps a seat; absent means not held",
                                   "booked: Set<seat_id>  # seats sold",
                                   "lock: Lock  # one per show: check and mark are one step"],
         "behaviour": ["release_expired(now) -> void  # req 3: drop holds that ran out",
                       "all_free(seats) -> bool  # hold_seats: every chosen seat is free",
                       "place(hold), book(hold), free(seats) -> void  # the three state changes",
                       "is_free(seat) -> bool  # not booked and not held"]},
        {"name": "Hold", "state": ["hold_id: string  # what hold_seats returns",
                                   "show_id: string  # confirm finds the show from the hold",
                                   "user: string  # confirm checks the hold is theirs",
                                   "seats: string[]  # held together or not at all",
                                   "expires_at: int  # minutes; the rule that makes it temporary"],
         "behaviour": ["is_expired(now) -> bool  # req 3: the one place the time is compared"]},
        {"name": "Booking", "state": ["booking_id: string  # the key in the service's map",
                                      "show_id: string  # cancel finds the show from it",
                                      "user: string  # who confirmed it",
                                      "seats: string[]  # cancel frees exactly these",
                                      "cancelled: bool  # cancelling twice is an error"],
         "behaviour": ["cancel() -> void | error  # req 4: marks itself, refuses a second time"]},
    ],
    "class_hint": "The service holds shows, holds and bookings by id. A show holds its seats, which are held, and which are booked. A hold is seats plus an expiry.",
    "class_say": "**I start from the methods and ask what each one has to read.** Hold has to find a show and know which seats are taken, so the show keeps held and booked, and a lock so two users can't both win. Confirm gets only a hold id, so the service keeps a map of holds, and each hold remembers its show, its user and when it ends. Cancel gets only a booking id, so a second map.",
    "class_why": "The service looks things up by id; the show knows its seats; the hold knows when it ends. Nothing runs a timer: every method that reads a show first calls release_expired, so an abandoned hold frees its seats the next time anyone looks.",
    "class_qa": [{"ask": "Why release expired holds when you read, and not on a timer?",
                  "say": "Because a timer is a second thread that also has to take the lock. **Releasing on read means a hold is only ever stale between two calls, and every call cleans up first,** so the answer is always right and the run is deterministic.",
                  "explain": ["hold_seats, confirm and available_seats each call release_expired before they look at a seat."]},
                 {"ask": "Why is a hold a class and not a status on the seat?",
                  "say": "Because a hold carries three things that belong together: the user, the seats and the expiry. **With a Hold object, expiry is one question, is_expired, and release is one loop.** A status on each seat would repeat the user and the time on every seat."}],

    "map": {"center": ("BookingService", "hold_seats, confirm, cancel"),
            "owned": [("Show", "seats, held, booked, lock"), ("Hold", "user, seats, expires_at"), ("Booking", "user, seats, cancelled")],
            "uses": [("BookingError", "every refusal"), ("Lock", "one per show")]},

    "skeleton": {"q": "First the small pieces: the error, Hold with is_expired, Booking, Show's __init__ and the service's __init__.",
                 "hint": "Hold holds the user, the seats and expires_at, and answers is_expired. Booking can cancel itself once. Show holds seats, held, booked and a lock. The service holds three maps and a counter.",
                 "code": HEAD + HOLD + BOOKING + SHOW + SERVICE,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "hold_seats", "q": "Start with the most interesting method: hold_seats(show_id, seats, user, now). Core logic and edge cases as comments, then the code. Name the hard parts as helpers.",
         "hint": "Find the show, check the seats, then under the show's lock: release expired holds, check every seat is free, create a Hold, place it.", "code": HOLD_SEATS,
         "why": "Check and mark sit inside one lock, so two users can't both pass the check. The checks come first, so a failure has changed nothing. Releasing and checking are named now and written next."},
        {"name": "confirm", "q": "confirm(hold_id, user, now): turn a hold into a booking.",
         "hint": "Find the hold, check it is theirs. Under the lock: release expired holds, check this one hasn't expired, book the seats, drop the hold, create the Booking.", "code": CONFIRM,
         "why": "The expiry check is after release_expired, and is_expired decides it. The check for a missing hold inside the lock catches two calls confirming the same hold."},
        {"name": "cancel", "q": "cancel(booking_id): give the seats back.",
         "hint": "Find the booking and its show. Under the lock: the booking cancels itself, the show frees the seats.", "code": CANCEL,
         "why": "Booking.cancel raises on a second cancel, so the rule is where the flag is. The lock stops two cancels freeing the seats twice."},
        {"name": "Show.release_expired", "q": "Show.release_expired(now): free the seats whose hold has run out.",
         "hint": "Collect the seats whose Hold says it is expired, then delete them from held. Collect first.", "code": SHOW_RELEASE,
         "why": "This replaces the timer thread. Collecting first matters: deleting from a dict while looping over it raises an error."},
        {"name": "Show.all_free", "q": "Show.all_free(seats): are all the chosen seats free?",
         "hint": "Look at each seat; one taken means False.", "code": SHOW_ALL_FREE,
         "why": "All or nothing: it answers for the whole list, before anything is marked."},
    ],
    "helpers": [
        {"q": "Show's helpers: is_free, place, book and free.",
         "hint": "Free is not booked and not held. Place points each seat at the hold. Book moves held seats to booked. Free discards.",
         "code": SHOW_HELPERS,
         "why": "Each is a few lines. They are the only places held and booked change, so the invariant (a seat is never both) is easy to check."},
        {"q": "The service's helpers: add_show, available_seats, _get_show, _check_seats, _get_hold and _new_id.",
         "hint": "Look a show up or raise. Reject empty, repeated or unknown seats. Find a hold and check the user. Count up for ids.",
         "code": SVC_ADD_SHOW + "\n" + SVC_HELPERS,
         "why": "All the checks that need no lock live here. available_seats is a read, and a read releases expired holds too."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute. Pricing and refunds are the rules that move, and nothing else needs a pattern.",
        "solid": [
            ("Single responsibility", "Hold knows when it ends, Booking knows if it was cancelled, Show knows which seats are free, the service finds and orchestrates."),
            ("Open/closed", "Pricing and refunds are not in hold_seats or confirm yet. A PricingStrategy or RefundPolicy is added, not edited in."),
            ("Liskov substitution", "Not yet: no subclasses. A PricingStrategy would return a total for the chosen seats."),
            ("Interface segregation", "No interface until something varies. Each policy would have one method."),
            ("Dependency inversion", "The service builds its own Shows. Once policies exist they are handed to it."),
        ],
        "varies": [
            ("Seat types and prices", "Strategy", "a PricingStrategy takes the seats, returns a total"),
            ("Cancellation refunds", "Strategy", "a RefundPolicy by time before the show"),
            ("Two users, same seat", "No pattern: a lock", "already in the core: one Lock per show around check and mark"),
            ("Trains or events", "No pattern: rename", "Show becomes Event or Journey; holds and bookings stay"),
        ],
    },
    "extensions": [
        {"ask": "Different seat types and prices.",
         "say": "The show keeps a price per seat, and **Booking stores the total it was confirmed at,** so a later price change doesn't rewrite history. If prices get rules, like peak hours, the total becomes a PricingStrategy. confirm adds one argument and nothing else moves.",
         "code": EXT_PRICE, "code_title": "Prices",
         "short_q": "Seat types and prices", "short_a": "price per seat on Show; Booking stores the total paid; a PricingStrategy if rules grow"},
        {"ask": "Cancel with a refund rule.",
         "say": "The show knows when it starts, so **a refund method on Show takes the amount paid and now and returns what comes back:** all of it an hour before, half inside the hour, nothing after. cancel frees the seats as before and returns that number. A RefundPolicy class is the next step if rules differ by ticket.",
         "code": EXT_REFUND, "code_title": "Refunds",
         "short_q": "Cancellation and refunds", "short_a": "Show.refund(paid, now) by time before the start; cancel returns it; RefundPolicy if rules vary"},
        {"ask": "The service runs on several servers.",
         "say": "A lock in memory only protects one process. **The database does the check-and-mark in one conditional update: set held where the seat is free or its hold has expired,** and count the rows changed. If fewer than the seats asked for, roll back. The all-or-nothing rule stays the same, only where it runs changes.",
         "short_q": "Many servers", "short_a": "conditional update in the database: set held where free or expired; roll back if the count is short"},
        {"ask": "Extend it from movies to trains or events.",
         "say": "Show becomes a generic Event, or a train Journey with a source, destination and date. **Hold, Booking and the lock stay the same,** because a hold on seats with an expiry is the real idea. A train adds coaches, which only changes how seat ids are made.",
         "short_q": "Movies to trains or events", "short_a": "Show becomes Event or Journey; Hold, Booking and the lock unchanged"},
    ],
    "faq": [("Why check every seat before marking any?", "So a failure has changed nothing. If you marked as you went, a clash on the third seat would leave two seats held and you would have to undo them."),
            ("Why release on read and not use a timer?", "A timer is a second thread that needs the same lock, and a run stops being deterministic. Releasing on read gives the same answers with no thread. The cost is that an expired hold sits in memory until someone looks."),
            ("What about expired holds in the service's holds map?", "They stay until confirm meets them and deletes them. If that matters, release_expired can return the Holds it dropped and the service removes them."),
            ("Why a Lock and not a stdlib queue or a database?", "One process and one show at a time: the lock is the smallest thing that is right. The extension covers when the lock stops being enough.")],

    "summary": ["**Four classes.** The BookingService finds a show and orchestrates. A Show knows which seats are held or booked, and each Hold carries its own expiry. hold_seats takes the show's lock, releases expired holds, checks every seat is free, and only then marks them. Confirm turns a live hold into a Booking, cancel frees the seats, and a Booking can be cancelled once.",
                "**It extends in one place each time:** prices are a map on Show, refunds a method on Show, many servers move the check into one conditional update, and trains rename Show."],

    "golden": [
        ("A Hold is a class with an expiry, and is_expired is the only place time is compared.", "the rule that makes a hold temporary lives with the data it is about, so confirm and the show's release never disagree."),
        ("hold_seats checks every seat first, then marks them all, inside one lock per show.", "check and mark are one step, so two users can't both win, and a failure holds nothing."),
        ("Expired holds are released when anyone looks, not by a timer.", "no thread, no second lock, and the run is deterministic; abandoned carts free themselves."),
        ("Confirm releases expired holds, then re-checks the hold is still alive.", "someone else may have taken the seat after the hold lapsed."),
        ("Booking.cancel refuses a second cancel, and the lock stops two cancels freeing the seats twice.", "a cancel that works twice would put a seat on sale that someone else holds."),
        ("Time is passed in as now.", "tests and the whiteboard trace need no real clock."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (prices and refunds), and a run at the bottom.",
    "final_title": "booking.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "ann pays 100 + 150 and gets it all back with 90 minutes to spare; bob cancels inside the last hour and gets half of 100; cy cancels after the start and gets nothing.",
}
