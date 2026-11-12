"""Reservations: seats, rooms and copies. One round for ticket booking, meeting rooms and a library.
The core is ticket booking in the Locker shape: BookingService, Show, Hold, Booking.
A hold is a noun with a rule (its expiry), so it is a class. Time is passed in as now; expired holds release when a show is read.
One lock per show is in the core. Rooms (a time interval), recurring bookings, library copies with a queue and a late fine
are extensions of the same design, each with a short runnable sample."""
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

# ---- extensions: the same design with a different resource ----
# 1. reserve by time interval (meeting rooms). The classes are complete and run on their own.
ROOMS_BASE = D('''\
    from threading import Lock


    class BookingError(Exception):
        pass


    class Booking:
        """A room kept for one organiser over a half-open slot [start, end)."""

        def __init__(self, room_id: str, start: int, end: int, who: str):
            self.room_id = room_id
            self.start = start
            self.end = end
            self.who = who

        def overlaps(self, start: int, end: int) -> bool:
            return self.start < end and start < self.end    # one line; back-to-back (end == start) does not clash


    class Room:
        def __init__(self, room_id: str, capacity: int):
            self.room_id = room_id
            self.capacity = capacity
            self.bookings = []

        def is_free(self, start: int, end: int) -> bool:
            for booking in self.bookings:
                if booking.overlaps(start, end):
                    return False
            return True

        def is_free_for(self, slots: list) -> bool:
            for start, end in slots:
                if not self.is_free(start, end):
                    return False
            return True


    class RoomScheduler:
        def __init__(self):
            self.rooms = []                  # in the order they were added, so a tie goes to the first
            self.lock = Lock()               # choosing a room and adding the booking are one step

        def add_room(self, room_id: str, capacity: int) -> None:
            self.rooms.append(Room(room_id, capacity))

        def book(self, start: int, end: int, people: int, who: str) -> Booking:
            if start >= end:
                raise BookingError("start must be before end")
            with self.lock:
                room = self._find_room([(start, end)], people)
                booking = Booking(room.room_id, start, end, who)
                room.bookings.append(booking)
            return booking

        def _find_room(self, slots: list, people: int) -> Room:
            best = None
            for room in self.rooms:
                if room.capacity < people or not room.is_free_for(slots):
                    continue
                if best is None or room.capacity < best.capacity:    # strictly smaller, so the first added wins a tie
                    best = room
            if best is None:
                raise BookingError("no room free")
            return best
    ''')

EXT_ROOMS = D('''\
    class Booking:                           # the Hold with a time window instead of an expiry
        def overlaps(self, start: int, end: int) -> bool:
            return self.start < end and start < self.end

    class Room:                              # the Show: it answers "is this time free?" instead of "is this seat free?"
        def is_free(self, start: int, end: int) -> bool:
            for booking in self.bookings:
                if booking.overlaps(start, end):
                    return False
            return True

    class RoomScheduler:                     # the BookingService: the same lock around check and add
        def _find_room(self, slots: list, people: int) -> Room:
            ...                              # the smallest room that fits: replace the best on a strictly smaller capacity
    ''')

ROOMS_DEMO = D('''\


    # ---- a quick run ----
    sched = RoomScheduler()
    sched.add_room("A", 4)
    sched.add_room("B", 8)
    print("ann", sched.book(9, 10, 3, "ann").room_id)       # the smallest room that fits
    print("bob", sched.book(9, 10, 3, "bob").room_id)       # A is busy, so B
    print("cy", sched.book(10, 11, 3, "cy").room_id)        # starts when ann's ends: A is free again
    try:
        sched.book(9, 10, 3, "dee")
    except BookingError as e:
        print(e)
    ''')
ROOMS_OUT = "ann A\nbob B\ncy A\nno room free\n"

# 2. recurring bookings, all or none
RECUR_METHOD = method('''
    def book_weekly(self, start: int, end: int, people: int, who: str, weeks: int) -> list:
        if start >= end or weeks < 1:
            raise BookingError("bad request")
        slots = [(start + 168 * k, end + 168 * k) for k in range(weeks)]   # 168 hours in a week
        with self.lock:
            room = self._find_room(slots, people)      # one room that is free for every week, or an error
            made = []
            for s, e in slots:                         # the check is done, so nothing below can fail halfway
                booking = Booking(room.room_id, s, e, who)
                room.bookings.append(booking)
                made.append(booking)
        return made
''')

EXT_RECUR = D('''\
    class RoomScheduler:
        def book_weekly(self, start, end, people, who, weeks) -> list:
            slots = [(start + 168 * k, end + 168 * k) for k in range(weeks)]
            with self.lock:
                room = self._find_room(slots, people)  # checks every slot first
                ...                                    # only then adds them all: all or none, no rollback
    ''')

RECUR_DEMO = D('''\


    # ---- a quick run ----
    sched = RoomScheduler()
    sched.add_room("A", 4)
    sched.add_room("B", 8)
    sched.book(9 + 168, 10 + 168, 3, "ann")             # A is taken in week 2
    made = sched.book_weekly(9, 10, 3, "bob", 3)
    print("bob", made[0].room_id, len(made))            # A fails one week, so all three weeks go to B
    try:
        sched.book_weekly(9, 10, 3, "dee", 3)           # B is busy in every week, A in week 2
    except BookingError as e:
        print(e)
    print("bookings:", len(sched.rooms[0].bookings) + len(sched.rooms[1].bookings))
    ''')
RECUR_OUT = "bob B 3\nno room free\nbookings: 4\n"

# 3. many copies of one thing and a waiting queue
COPIES = D('''\
    class LibraryError(Exception):
        pass


    class Title:
        """One title with several copies. A copy is a count, because nobody asks a copy anything yet."""

        def __init__(self, title_id: str, copies: int):
            self.title_id = title_id
            self.copies = copies
            self.on_loan = []                # members who have a copy out
            self.waiting = []                # members who reserved, first come first served

        def free(self) -> int:
            return self.copies - len(self.on_loan)

        def can_borrow(self, member: str) -> bool:
            if member in self.waiting:
                ahead = self.waiting.index(member)   # people before them in the queue
            else:
                ahead = len(self.waiting)            # someone who never reserved stands behind everyone
            return self.free() > ahead               # a copy is theirs only if there is one beyond those ahead


    class Library:
        def __init__(self):
            self.titles = {}

        def add_title(self, title_id: str, copies: int) -> None:
            self.titles[title_id] = Title(title_id, copies)

        def reserve(self, title_id: str, member: str) -> None:
            title = self.titles[title_id]
            if member not in title.waiting:
                title.waiting.append(member)

        def borrow(self, title_id: str, member: str) -> None:
            title = self.titles[title_id]
            if not title.can_borrow(member):
                raise LibraryError("no copy for you yet")
            if member in title.waiting:
                title.waiting.remove(member)         # their turn is used
            title.on_loan.append(member)

        def give_back(self, title_id: str, member: str) -> str:
            title = self.titles[title_id]
            title.on_loan.remove(member)
            if title.waiting:
                return title.waiting[0]              # the member to tell that a copy is ready
            return ""
    ''')

EXT_COPIES = D('''\
    class Title:                             # the Show: a resource with a count of free places
        def can_borrow(self, member: str) -> bool:
            ...                              # a copy is free only if there is one beyond the people ahead in the queue

    class Library:                           # the BookingService: reserve joins the queue, give_back names who is next
        def reserve(self, title_id: str, member: str) -> None:
            ...
    ''')

COPIES_DEMO = D('''\


    # ---- a quick run ----
    lib = Library()
    lib.add_title("dune", 1)
    lib.borrow("dune", "ann")
    lib.reserve("dune", "bob")
    try:
        lib.borrow("dune", "cy")                        # no copy is free
    except LibraryError as e:
        print("cy:", e)
    print("next:", lib.give_back("dune", "ann"))        # a copy is free, and bob is first in line
    try:
        lib.borrow("dune", "cy")                        # a copy is free, but bob is ahead of cy
    except LibraryError as e:
        print("cy again:", e)
    lib.borrow("dune", "bob")
    print("on loan:", lib.titles["dune"].on_loan)
    ''')
COPIES_OUT = "cy: no copy for you yet\nnext: bob\ncy again: no copy for you yet\non loan: ['bob']\n"

# 4. a rule that depends on time: late fine (runs) and refund (shown)
FINE = D('''\
    class Loan:
        """A copy out to one member until a day. It knows how late it is, so the rule sits next to the date."""

        def __init__(self, member: str, due_day: int):
            self.member = member
            self.due_day = due_day

        def days_late(self, today: int) -> int:
            if today <= self.due_day:
                return 0                     # on the due day itself is on time
            return today - self.due_day

        def fine(self, today: int, cents_per_day: int) -> int:
            return self.days_late(today) * cents_per_day
    ''')

FINE_DEMO = D('''\


    # ---- a quick run ----
    loan = Loan("ann", due_day=14)
    print(loan.fine(17, 25))                            # 3 days late at 25 cents
    print(loan.fine(14, 25))                            # on the due day: nothing
    print(loan.fine(17, 10))                            # the rate is an argument, so a student rate is one call
    ''')
FINE_OUT = "75\n0\n30\n"

EXT_FINE = FINE + "\n\n" + D('''\
    class Show:                              # a refund is the same kind of rule, on the thing that has the start time
        def refund(self, paid: int, now: int) -> int:
            if now <= self.starts_at - 60:
                return paid                  # an hour or more before: everything back
            if now < self.starts_at:
                return paid // 2             # inside the hour: half
            return 0                         # after it starts: nothing
    ''')

# the final file: the core with a run that sends eight threads at one seat
FINAL_DEMO = D('''\


    # ---- eight users, one seat ----
    from threading import Thread

    svc = BookingService(hold_minutes=5)
    svc.add_show("s1", ["A1"])
    winners = []

    def grab(name):
        try:
            svc.hold_seats("s1", ["A1"], name, now=0)
            winners.append(name)             # list.append is one step, safe across threads
        except BookingError:
            pass

    threads = [Thread(target=grab, args=(f"user{i}",)) for i in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print("winners:", len(winners))
    print("A1 free at minute 1:", "A1" in svc.available_seats("s1", 1))
    print("A1 free at minute 5:", "A1" in svc.available_seats("s1", 5))
    ''')
FINAL_OUT = "winners: 1\nA1 free at minute 1: False\nA1 free at minute 5: True\n"


PROBLEM = {
    "id": "booking", "title": "Reservations: seats, rooms and copies", "part_id": "lld-booking", "n": 11,
    "part_title": "Reservations: seats, rooms and copies", "minutes": 50,
    "lead": "One round for three questions that share a shape: reserve a thing for a time and never double book it. You design ticket booking (the most reported of the three), then show that a meeting room booker and a library are the same design with a different resource. The heart is the hold: seats kept for a few minutes, released by themselves, and taken by one user even when two click at once. Time is passed in as now, so a run is deterministic. Implementation starts with hold_seats and names its helpers before writing them.",
    "prompt": "Design BookMyShow or a railway reservation system. (The same shape is asked as a meeting room booker or a library.)",
    "evidence": "Ticket booking: roundz Mar 2025 (SDE2, a BookMyShow class diagram); GeeksforGeeks (railway booking twice); a reported follow-up: extend from movies to events. Meeting rooms: LeetCode Discuss May 2025 (L5, LLD round); Taro Sep 2025 (SDE2, a meeting app). Library: LeetCode Discuss Jun 2025 and Apr 2026 and TechPrep, as 'a system like a library or parking lot', with a reservation queue, a notification and a fine rule as follow-ups.",
    "drill": "part 9, Reservations.",

    "clarify": {
        "capabilities": [("What is being booked?", "Seats for one show; a train journey works the same way. Rooms for a time slot and copies of a book are the same idea"),
                         ("Hold seats while the user pays?", "Yes, for a few minutes, then they go back on sale"),
                         ("Can one booking take several seats?", "Yes, and it is all or nothing")],
        "errors": [("Two people want the same seat?", "It must never be double-booked, even at the same moment"),
                   ("What if the user never pays?", "The hold expires and the seats are free again"),
                   ("A seat that doesn't exist, or the same seat twice?", "Reject it")],
        "scope": [("Search, payments, prices, cancellation?", "Search and payment are out; prices and refunds are a follow-up; cancel before the show is in"),
                  ("Is it always seats, or can it be a time slot or a copy of a title?", "Seats first; rooms by time and library copies come as follow-ups on the same design"),
                  ("How does time work?", "The caller passes in the current time, in minutes, so a run is deterministic and needs no timer thread")],
    },
    "clarify_hint": "What is booked and for how long it is held. Two people and one seat. A user who never pays. Search, payment, price. Seats, time slots or copies. How time works.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The hold comes first, because it makes seats temporary and that decides the whole design. Then the clash: two people and one seat. Then I ask whether it is always seats, since rooms and library copies change what a reservation covers. And last, how time works, since passing the time in means I need no timer thread and the run is easy to trace.",
    "clarify_why": "The hold gives a Hold class with an expiry. All or nothing gives the check-then-mark step. Two people at once gives the lock. Asking about the kind of resource tells you whether to keep the design open for time slots and copies. Time passed in as now means an expired hold is released when we look, not by a thread.",
    "answers": "Seats for one show; trains work the same way. A user holds one or more seats for a few minutes, and a booking is all or nothing. A seat is never double-booked, even at the same moment. A hold nobody confirms expires and the seats go back on sale. A seat that doesn't exist, or listed twice, is rejected. Cancel before the show is in. Search, payment and prices are out. Rooms by time slot and library copies are follow-ups. The caller passes in the time in minutes, with no timer thread.",
    "playback": ["Thanks, that's clear. **So: hold some seats for a few minutes, all or none; confirm turns the hold into a booking; cancel frees the seats; two users can never win the same seat.** An abandoned hold frees itself when we next look, because time is passed in. Out of scope: search, payment, prices. I'll keep the design open for time slots and copies."],

    "requirements": [
        ["A user holds one or more seats for a show.", "The system keeps them held until a time, all or none", "A seat that is taken or held, an unknown seat, or a seat listed twice is an error and nothing is held"],
        ["The user confirms the hold.", "The held seats become booked and a Booking is returned", "A hold that expired, is unknown or is not theirs is an error"],
        ["A hold runs out.", "The seats become available again the next time anyone looks, without a timer"],
        ["A user cancels a booking.", "The seats become available", "Cancelling twice is an error"],
        ["Two users go for the same seat at once.", "Exactly one of them gets it"],
    ],
    "out_of_scope": ["search and browsing", "payment", "pricing and refunds (an extension)", "notifications", "a real clock or timer thread"],
    "req_hint": "Hold, confirm, a hold running out, cancel, and a clash.",
    "req_say": "From your answers I get five requirements. **Each is something that happens, and the first four become methods: hold_seats, confirm, cancel, and the expiry that both of them trigger.** Requirement 5 is the senior one: check and mark must be one step, so a lock around each show.",
    "req_why": "Each requirement maps to code: 1 is hold_seats, 2 is confirm, 3 is Hold.is_expired plus Show.release_expired, 4 is cancel, 5 is the lock in all three.",

    "entities": [("Show", True, "A screening or a journey: owns its seats, and which are held or booked. The resource that rooms and titles replace later"),
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
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute. All three questions are one shape: a resource, a reservation with a time window and a state, and a service that checks for conflicts under a lock. Only the resource changes.",
        "solid": [
            ("Single responsibility", "Hold knows when it ends, Booking knows if it was cancelled, Show knows which seats are free, the service finds and orchestrates."),
            ("Open/closed", "Prices, refunds and fines are not in hold_seats or confirm. A rule is added beside them, not edited in."),
            ("Liskov substitution", "Not yet: no subclasses. A room or a title would be a new resource with the same questions, not a subclass."),
            ("Interface segregation", "No interface until something varies. Each rule would have one method."),
            ("Dependency inversion", "The service builds its own Shows. Once policies exist they are handed to it."),
        ],
        "varies": [
            ("What is reserved: seat, room or copy", "No pattern: a new resource class", "same questions (is it free, take it, give it back); the hold, the lock and the service stay"),
            ("A time window instead of a seat", "No pattern: one overlap line", "start < other_end and other_start < end, on the reservation"),
            ("Prices, refunds, fines", "Strategy, once rules differ", "a rule on the class that holds the date, a policy class if they vary by customer"),
            ("Two users, same resource", "No pattern: a lock", "already in the core: one Lock around check and mark"),
        ],
    },
    "extensions": [
        {"ask": "Make it a meeting room booker: rooms are reserved over a time interval, and the system picks the smallest room that fits.",
         "say": "Same design, so I'd say which class changes. **The reservation takes a start and an end instead of a seat, and the check becomes one line: start < other_end and other_start < end.** Half-open slots mean a meeting ending at 10 and one starting at 10 don't clash. The Show becomes a Room that answers is_free for a time. The service picks the smallest room that fits, keeping the best so far and replacing it only on a strictly smaller capacity, so a tie goes to the first added. The lock around check and add stays exactly as it was.",
         "code": EXT_ROOMS, "code_title": "Rooms: the same shape over a time window",
         "run": ROOMS_BASE + ROOMS_DEMO, "run_out": ROOMS_OUT,
         "short_q": "Rooms by time interval", "short_a": "Booking has start and end; overlap is start < other_end and other_start < end; smallest room that fits; same lock"},
        {"ask": "Recurring meetings: every week for N weeks, all or none.",
         "say": "**The service builds every slot first and finds one room that is free for all of them, and only then adds the bookings.** The check is finished before anything is added, so a clash in week three leaves nothing behind and there is no rollback code. That is the same all-or-nothing rule as holding several seats. Only RoomScheduler changes: a new method and a search that takes a list of slots.",
         "code": EXT_RECUR, "code_title": "Recurring: check every slot, then add them all",
         "run": ROOMS_BASE + in_class(RECUR_METHOD) + RECUR_DEMO, "run_out": RECUR_OUT,
         "short_q": "Recurring bookings", "short_a": "build all slots, find one room free for every slot, then add; all or none, no rollback"},
        {"ask": "Make it a library: a title has several copies, and members can queue for it.",
         "say": "The resource now has a count, not a single owner. **A Title keeps how many copies it has, who has one out and who is waiting, and a member may borrow only if a copy is free beyond the people ahead in the queue.** Reserve joins the queue, and give_back names the member to tell. A copy stays a count until something asks a copy a question, like a barcode or a lost mark. The rule that decides who gets a free copy sits on Title, and the library only orchestrates.",
         "code": EXT_COPIES, "code_title": "Copies and a waiting queue",
         "run": COPIES + COPIES_DEMO, "run_out": COPIES_OUT,
         "short_q": "Copies and a queue", "short_a": "Title keeps copies, on_loan and waiting; borrow only if a copy is free beyond those ahead"},
        {"ask": "A late fine for a loan, or a refund when a booking is cancelled.",
         "say": "Both are a rule that reads a date, so it lives on the class that holds the date. **A Loan knows its due day and answers days_late, and the fine is days late times a rate;** the rate is an argument, so a student rate is one call. A refund is the same idea on the Show, which knows when it starts: all of it an hour before, half inside the hour, nothing after. If rules differ by customer, they become a policy class handed to the service.",
         "code": EXT_FINE, "code_title": "A rule beside its date: fine and refund",
         "run": FINE + FINE_DEMO, "run_out": FINE_OUT,
         "short_q": "Late fine or refund", "short_a": "Loan.days_late and fine(today, rate); Show.refund(paid, now) by time before start; a policy class if rules vary"},
        {"ask": "The service runs on several servers.",
         "say": "A lock in memory only protects one process. **The database does the check-and-mark in one conditional update: set held where the seat is free or its hold has expired,** and count the rows changed. If fewer than the seats asked for, roll back. For rooms the same update checks no overlapping row exists. The all-or-nothing rule stays the same, only where it runs changes.",
         "short_q": "Many servers", "short_a": "conditional update in the database: set held where free or expired; roll back if the count is short"},
    ],
    "faq": [("Why check every seat before marking any?", "So a failure has changed nothing. If you marked as you went, a clash on the third seat would leave two seats held and you would have to undo them."),
            ("Why release on read and not use a timer?", "A timer is a second thread that needs the same lock, and a run stops being deterministic. Releasing on read gives the same answers with no thread. The cost is that an expired hold sits in memory until someone looks."),
            ("What about expired holds in the service's holds map?", "They stay until confirm meets them and deletes them. If that matters, release_expired can return the Holds it dropped and the service removes them."),
            ("Why a Lock and not a stdlib queue or a database?", "One process and one show at a time: the lock is the smallest thing that is right. The extension covers when the lock stops being enough."),
            ("Why is the slot half-open?", "So the end is the first free moment. A meeting ending at 10:00 and one starting at 10:00 don't clash, and the overlap test needs only strict comparisons."),
            ("Rooms: keep each room's bookings sorted and binary search?", "A room has a handful of meetings a day, so a loop is fine. With thousands per room, keep them sorted by start and check only the two neighbours. The stdlib bisect is the shortcut to mention."),
            ("Library: a member loses a copy?", "Make a copy a small class with a lost mark so it is never lent again, and put a replacement fine on the member. Both are small additions to Title and Loan.")],

    "summary": ["**Four classes.** The BookingService finds a show and orchestrates. A Show knows which seats are held or booked, and each Hold carries its own expiry. hold_seats takes the show's lock, releases expired holds, checks every seat is free, and only then marks them. Confirm turns a live hold into a Booking, cancel frees the seats, and a Booking can be cancelled once.",
                "**It extends in one place each time:** a room is a Show that checks a time window with one overlap line, recurring bookings check every slot before adding any, library copies are a count and a queue on the title, a fine or refund sits beside its date, and many servers move the check into one conditional update."],

    "apart": [
        "**A hold is a class with an expiry.** The seats are held for N minutes, and is_expired is the only place time is compared.",
        "**Check every seat first, then mark them all, under one lock per show.** That is what stops two people taking the same seat.",
        "**Expired holds are released when someone looks,** not by a timer. Confirm re-checks the hold is still alive.",
        "**Rooms and copies are the same design:** a time window is one overlap line, recurring is check all slots then add, copies are a count and a queue.",
        "**Pass the time in as now,** so expiry is testable."
    ],
    "golden": [
        ("A Hold is a class with an expiry, and is_expired is the only place time is compared.", "the rule that makes a hold temporary lives with the data it is about, so confirm and the show's release never disagree."),
        ("hold_seats checks every seat first, then marks them all, inside one lock per show.", "check and mark are one step, so two users can't both win, and a failure holds nothing."),
        ("Expired holds are released when anyone looks, not by a timer.", "no thread, no second lock, and the run is deterministic; abandoned carts free themselves."),
        ("Confirm releases expired holds, then re-checks the hold is still alive.", "someone else may have taken the seat after the hold lapsed."),
        ("Booking.cancel refuses a second cancel, and the lock stops two cancels freeing the seats twice.", "a cancel that works twice would put a seat on sale that someone else holds."),
        ("Time slots are half-open: they overlap when a.start < b.end and b.start < a.end.", "back-to-back is allowed, and the whole rule is one line on the reservation."),
        ("Recurring bookings: check every slot first, then add them all.", "all or none, with no rollback code."),
        ("A title and a copy are different things, and a loan is a class that answers days_late.", "the title is searched and queued for, the loan sits next to the date its fine reads."),
        ("Time is passed in as now.", "tests and the whiteboard trace need no real clock."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core as one file, with a run at the bottom that sends eight threads at one seat.",
    "final_title": "booking.py", "final_code": CORE, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "exactly one of the eight users wins the seat, and it is free again at minute 5 because nobody confirmed the hold.",
}
