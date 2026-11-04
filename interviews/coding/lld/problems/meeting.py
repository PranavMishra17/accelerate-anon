"""Meeting room reservation. A drill in the Locker shape: RoomScheduler, Room, Booking and one error.
Booking picks the smallest free room by a plain loop; the overlap rule is one line on Booking over half-open [start, end)."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the scheduler: booking ----
BOOK = method('''
    def book(self, organiser: str, start: datetime, end: datetime, attendees: int) -> Booking:
        """
        Core logic:
          1. Check the times and the head count
          2. Find the smallest room that fits and is free for the slot
          3. No such room -> error
          4. Create the booking in that room and return it
        Edge cases:
          1. Start not before end -> error
          2. Fewer than one attendee -> error
          3. Every room too small or busy -> error
        """
        self._check_request(start, end, attendees)         # Edge 1 and 2: bad input never reaches the rooms
        room = self._find_room(start, end, attendees)      # Step 2: the hard part, named now, written next
        if room is None:                                   # Edge 3
            raise MeetingError(f"no room fits {attendees} people at that time")
        return self._create(room, organiser, start, end, attendees)   # Step 4
''')

FIND_ROOM = method('''
    def _find_room(self, start: datetime, end: datetime, attendees: int) -> Room | None:
        """
        Core logic:
          1. Look at every room
          2. Skip a room that is too small
          3. Skip a room that has a booking in the slot
          4. Keep the smallest one that is left; one pass, O(rooms x bookings)
        Edge cases:
          1. Two rooms of the same size -> the one added first wins
          2. Nothing qualifies -> None, and book raises
        """
        best = None
        for room in self.rooms.values():                   # Step 1: dict order is the order the rooms were added
            if room.capacity < attendees:                  # Step 2
                continue
            if not room.is_free(start, end):               # Step 3: the room answers for its own bookings
                continue
            if best is None or room.capacity < best.capacity:
                best = room                                # Step 4 / Edge 1: strictly smaller, so a tie keeps the first
        return best                                        # Edge 2
''')

IS_FREE = method('''
    def is_free(self, start: datetime, end: datetime) -> bool:
        """
        Core logic:
          1. Ask each booking in this room whether it overlaps the slot
          2. Any overlap -> not free; none -> free
        Edge cases:
          1. A booking that ends exactly when the slot starts does not overlap (half-open)
          2. An empty room is free
        """
        for booking in self.bookings:                      # Step 1: the room only loops, the booking knows the rule
            if booking.overlaps(start, end):
                return False                               # Step 2
        return True                                        # Edge 2: nothing to clash with
''')

OVERLAPS = method('''
    def overlaps(self, start: datetime, end: datetime) -> bool:
        """
        Core logic:
          1. Treat both as half-open: [start, end)
          2. They overlap when each one starts before the other ends
        Edge cases:
          1. One ends at 10:00 and the other starts at 10:00 -> no overlap, so back-to-back works
          2. One slot inside the other -> overlap (both tests hold)
        """
        # Step 2: a < d and c < b. Strict "<" is what makes Edge 1 pass; "<=" would block back-to-back
        return self.start < end and start < self.end
''')

BOOK_ROOM = method('''
    def book_room(self, organiser: str, room_id: str, start: datetime, end: datetime, attendees: int) -> Booking:
        """
        Core logic:
          1. Check the times and the head count
          2. Look the room up, check it fits and is free
          3. Create the booking in it and return it
        Edge cases:
          1. Unknown room -> error
          2. Room too small -> error
          3. Room busy in the slot -> error
        """
        self._check_request(start, end, attendees)         # same gate as book
        room = self.rooms.get(room_id)
        if room is None:                                   # Edge 1
            raise MeetingError(f"no room {room_id}")
        if room.capacity < attendees:                      # Edge 2
            raise MeetingError(f"room {room_id} holds {room.capacity}")
        if not room.is_free(start, end):                   # Edge 3: same question _find_room asks
            raise MeetingError(f"room {room_id} is busy")
        return self._create(room, organiser, start, end, attendees)   # Step 3
''')

CANCEL = method('''
    def cancel(self, booking_id: str) -> None:
        """
        Core logic:
          1. Look the booking up by id
          2. Remove it from its room and from the map
        Edge cases:
          1. Unknown id, or already cancelled -> error
        """
        booking = self.bookings.pop(booking_id, None)      # Step 1: pop, so a second cancel finds nothing
        if booking is None:                                # Edge 1
            raise MeetingError(f"no booking {booking_id}")
        booking.room.remove(booking)                       # Step 2: the slot is free again for the next search
''')

FREE_ROOMS = method('''
    def free_rooms(self, start: datetime, end: datetime, attendees: int = 1) -> list:
        """
        Core logic:
          1. Collect the rooms that fit and are free for the slot
          2. Order them smallest first, ties by id
        Edge cases:
          1. Nothing free -> empty list
        """
        found = []
        for room in self.rooms.values():                   # Step 1: the same two tests as _find_room
            if room.capacity >= attendees and room.is_free(start, end):
                found.append(room)
        found.sort(key=lambda r: (r.capacity, r.room_id))  # Step 2: a fixed order, so a run is the same every time
        return [r.room_id for r in found]                  # Edge 1: an empty list falls out
''')

SCHED_HELPERS = method('''
    def schedule(self, room_id: str) -> list:
        """A room's day: its bookings, earliest first."""
        if room_id not in self.rooms:
            raise MeetingError(f"no room {room_id}")
        return sorted(self.rooms[room_id].bookings, key=lambda b: b.start)

    def _check_request(self, start: datetime, end: datetime, attendees: int) -> None:
        if start >= end:                                   # equal is empty, and an empty slot overlaps nothing
            raise MeetingError("start must be before end")
        if attendees < 1:
            raise MeetingError("need at least one attendee")

    def _create(self, room: Room, organiser: str, start: datetime, end: datetime, attendees: int) -> Booking:
        booking = Booking(f"b{self.next_id}", room, start, end, organiser, attendees)
        self.next_id += 1                                  # ids are never reused, even after a cancel
        room.add(booking)
        self.bookings[booking.booking_id] = booking        # cancel only has the id
        return booking
''')


# ---- the classes ----
HEAD = D('''\
    from datetime import datetime


    class MeetingError(Exception):     # one error type the caller can catch for every refusal
        pass
    ''')

BOOKING = D('''\


    class Booking:
        """One meeting in one room, over the half-open slot [start, end)."""

        def __init__(self, booking_id: str, room: "Room", start: datetime, end: datetime, organiser: str, attendees: int):
            self.booking_id = booking_id   # the key cancel uses
            self.room = room               # cancel removes the booking from this room
            self.start = start             # first moment the room is taken
            self.end = end                 # first moment it is free again, so a meeting starting here is fine
            self.organiser = organiser     # who booked it
            self.attendees = attendees     # head count, for the size check
    ''')

BOOKING_LABEL = method('''
    def label(self) -> str:
        return f"{self.booking_id} {self.room.room_id} {self.start:%H:%M}-{self.end:%H:%M}"
''')

ROOM = D('''\


    class Room:
        """One bookable room. It knows its own bookings, so it can say whether a slot is free."""

        def __init__(self, room_id: str, capacity: int):
            self.room_id = room_id         # names the room in errors and in free_rooms
            self.capacity = capacity       # most people it holds
            self.bookings = []             # Booking objects; is_free reads them

        def add(self, booking: Booking) -> None:
            self.bookings.append(booking)

        def remove(self, booking: Booking) -> None:
            self.bookings.remove(booking)
    ''')

SCHEDULER = D('''\


    class RoomScheduler:
        """The entry point: finds a room for each request and keeps the booking list."""

        def __init__(self, rooms: list):
            self.rooms = {r.room_id: r for r in rooms}   # by id, in the order added; the tie-break relies on that order
            self.bookings = {}                           # booking id -> Booking; cancel gets only an id
            self.next_id = 1                             # the next booking id is "b1", "b2", ...
    ''')

CORE = (HEAD + BOOKING + in_class(OVERLAPS, BOOKING_LABEL) + ROOM + in_class(IS_FREE)
        + SCHEDULER + in_class(BOOK, FIND_ROOM, BOOK_ROOM, CANCEL, FREE_ROOMS, SCHED_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    def t(h, m=0):
        return datetime(2026, 1, 5, h, m)

    s = RoomScheduler([Room("C", 12), Room("A", 4), Room("B", 8)])   # added in this order; sizes 12, 4, 8
    print(s.book("ann", t(9), t(10), 3).label())          # all three fit; A is the smallest
    print(s.book("bob", t(9, 30), t(10, 30), 3).label())  # A is busy from 9:30, so the next smallest, B
    try:
        s.book_room("cy", "A", t(9, 30), t(10, 30), 2)    # asking for A by name: it overlaps ann's meeting
    except MeetingError as e:
        print(e)
    print(s.book("cy", t(10), t(11), 3).label())          # back-to-back: A's meeting ends at 10:00, this starts at 10:00
    print(s.free_rooms(t(9), t(10)))                      # A and B are busy somewhere in 9-10; only C is free
    s.cancel("b1")
    print(s.free_rooms(t(9), t(10)))                      # the cancel freed A for 9-10
    print(s.book("dee", t(9), t(10), 3).label())          # A is the smallest again
    print([b.label() for b in s.schedule("A")])           # earliest first
    for bad in (lambda: s.book("eve", t(9), t(10), 20),
                lambda: s.book("eve", t(10), t(9), 2),
                lambda: s.cancel("b9")):
        try:
            bad()
        except MeetingError as e:
            print(e)
    ''')
DEMO_OUT = ("b1 A 09:00-10:00\nb2 B 09:30-10:30\nroom A is busy\nb3 A 10:00-11:00\n['C']\n['A', 'C']\n"
            "b4 A 09:00-10:00\n['b4 A 09:00-10:00', 'b3 A 10:00-11:00']\n"
            "no room fits 20 people at that time\nstart must be before end\nno booking b9\n")

# ---- extensions ----
RECURRING = method('''
    def book_recurring(self, organiser: str, start: datetime, end: datetime, attendees: int, weeks: int) -> list:
        """Every week for `weeks` weeks, all in one room, or none at all."""
        self._check_request(start, end, attendees)
        if weeks < 1:
            raise MeetingError("need at least one week")
        slots = [(start + timedelta(weeks=k), end + timedelta(weeks=k)) for k in range(weeks)]
        room = self._find_room_for_all(slots, attendees)   # check every week before any booking is made
        if room is None:
            raise MeetingError(f"no room fits {attendees} people every week")
        return [self._create(room, organiser, s, e, attendees) for s, e in slots]
''')

FIND_ALL = method('''
    def _find_room_for_all(self, slots: list, attendees: int) -> Room | None:
        best = None
        for room in self.rooms.values():
            if room.capacity < attendees:
                continue
            if not all(room.is_free(s, e) for s, e in slots):   # the same is_free, once per week
                continue
            if best is None or room.capacity < best.capacity:
                best = room
        return best
''')

EXT_RECURRING = "class RoomScheduler:\n    ...\n" + in_class(RECURRING, FIND_ALL)

EXT_NOTIFY = D('''\
    class RoomScheduler:
        def __init__(self, rooms: list, notifier):
            ...
            self.notifier = notifier         # handed in: anything with notify(user, message)

        def book(self, organiser, start, end, attendees) -> Booking:
            ...
            booking = self._create(room, organiser, start, end, attendees)
            self.notifier.notify(organiser, f"booked {booking.label()}")   # after the booking exists
            return booking                   # a failed send must never undo a booking: catch and log inside notify

        def cancel(self, booking_id: str) -> None:
            ...
            self.notifier.notify(booking.organiser, f"cancelled {booking.booking_id}")
    ''')

EXT_LOCK = D('''\
    from threading import Lock


    class RoomScheduler:
        def __init__(self, rooms: list):
            ...
            self.lock = Lock()

        def book(self, organiser, start, end, attendees) -> Booking:
            self._check_request(start, end, attendees)
            with self.lock:                  # choosing the room and adding the booking is one step
                room = self._find_room(start, end, attendees)
                if room is None:
                    raise MeetingError(f"no room fits {attendees} people at that time")
                return self._create(room, organiser, start, end, attendees)
    ''')

# the final file: core + recurring meetings
F_HEAD = HEAD.replace("from datetime import datetime", "from datetime import datetime, timedelta")
FINAL = (F_HEAD + BOOKING + in_class(OVERLAPS, BOOKING_LABEL) + ROOM + in_class(IS_FREE)
         + SCHEDULER + in_class(BOOK, FIND_ROOM, BOOK_ROOM, CANCEL, FREE_ROOMS, RECURRING, FIND_ALL, SCHED_HELPERS))



FINAL_DEMO = D('''\


    # ---- a quick run ----
    def t(h, m=0, day=5):
        return datetime(2026, 1, day, h, m)

    s = RoomScheduler([Room("A", 4), Room("B", 8)])
    s.book_room("ann", "A", t(9, day=19), t(10, day=19), 3)       # A is taken on the third Monday
    got = s.book_recurring("bob", t(9), t(10), 3, weeks=3)         # A fails in week 3, so all three weeks go to B
    print([f"{b.room.room_id} {b.start:%d}" for b in got])
    try:
        s.book_recurring("dee", t(9), t(10), 6, weeks=2)           # needs B, and B is taken in week 1
    except MeetingError as e:
        print(e)
    print(len(s.bookings))                                         # still 4: nothing from dee's try was kept
    ''')
FINAL_OUT = "['B 05', 'B 12', 'B 19']\nno room fits 6 people every week\n4\n"


PROBLEM = {
    "id": "meeting", "title": "Meeting room reservation", "part_id": "lld-meeting", "n": 14,
    "part_title": "Meeting room reservation", "minutes": 45,
    "lead": "A meeting room round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The interesting method is book, which names the room search as a helper. The overlap rule is one line on Booking over half-open slots, so back-to-back meetings pass.",
    "prompt": "Design a meeting room reservation system (or a meeting app).",
    "evidence": "LeetCode Discuss May 2025 (L5, LLD round); Taro Sep 2025 (SDE2, a meeting app).",
    "drill": "part 14, Meeting room reservation.",

    "clarify": {
        "capabilities": [("What does a room have?", "An id and a capacity"),
                         ("What does a booking need?", "A time range, an organiser and the number of attendees"),
                         ("Which room does the system pick?", "The smallest free room that fits; on a tie, the one added first"),
                         ("Can a user ask for a particular room, or see what is free?", "Yes: book a named room, see a room's schedule, and list the free rooms for a slot")],
        "errors": [("Two meetings in one room at the same time?", "Not allowed; one ending at 10:00 and one starting at 10:00 is fine"),
                   ("No room is free or big enough?", "Return an error"),
                   ("A start that is not before the end?", "Reject it"),
                   ("Cancel a booking that doesn't exist?", "Return an error")],
        "scope": [("Recurring meetings, equipment, invites?", "Not at first; recurring is the likely follow-up"),
                  ("Time zones, or bookings in the past?", "One time zone, and no check on the past"),
                  ("Is this one process, or many users at once?", "One process, one caller at a time; threads are a follow-up")],
    },
    "clarify_hint": "What a room and a booking hold, who picks the room, asking for a room by name. Overlap, no room free, a bad time range, cancelling a missing booking. Recurring, equipment, invites, time zones, threads.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** First what a room and a booking hold and who picks the room, because that decides what book has to read. Then the edges of time: does 10:00 to 10:00 clash? Last scope, since recurring meetings and invites are easy to drift into.",
    "clarify_why": "The answers shape the classes. Capacity and attendees make the room search a size check, the tie-break question makes it deterministic, and the back-to-back answer is why the interval is half-open.",
    "answers": "A room has an id and a capacity. A booking has a start, an end, an organiser and an attendee count. The system picks the smallest free room that fits, the first added on a tie, and a user can also book a named room, see a room's schedule and list free rooms. Two meetings can't overlap, but one ending at 10:00 and one starting at 10:00 is fine. No room free, a bad time range and an unknown booking are errors. Recurring meetings, equipment and invites are out for now; one time zone, no threads.",
    "playback": ["Thanks, that's clear. **So: rooms with a capacity, bookings over half-open slots, the system picks the smallest free room that fits, and back-to-back is allowed.** You can also book a named room, cancel, and ask what is free. Out of scope: recurring meetings, equipment, invites, time zones, threads."],

    "requirements": [
        ["A user books a room for a start, an end and a number of attendees.", "The system picks the smallest room that fits and has no overlapping booking, the first added on a tie", "Returns the booking; an error if the times are bad or no room is free"],
        ["A user books a named room for the same details.", "The system checks that the room fits and is free", "An error for an unknown room, a room that is too small, or one that is busy"],
        ["Back-to-back meetings are allowed.", "A meeting ending at 10:00 does not overlap one starting at 10:00"],
        ["The organiser cancels a booking.", "The room is free for that time again", "An unknown booking is an error"],
        ["Anyone can see a room's schedule, and which rooms are free for a slot."],
    ],
    "out_of_scope": ["recurring meetings (an extension)", "equipment filters", "invites and notifications", "calendars of attendees", "time zones", "threads"],
    "req_hint": "Booking by size, booking a named room, the back-to-back rule, cancelling, reading the state.",
    "req_say": "From your answers I get five requirements. **Each one is something that happens, and each becomes a method: book, book_room, cancel, schedule and free_rooms.** The back-to-back rule is not a method, it is a decision about how an overlap is defined, and it sits in one line.",
    "req_why": "1 is book, 2 is book_room, 3 is Booking.overlaps, 4 is cancel, 5 is schedule and free_rooms.",

    "entities": [("Room", True, "Has an id, a capacity and its bookings, and says whether it is free for a slot"),
                 ("Booking", True, "A room, a start, an end, an organiser and a head count; it knows whether it overlaps a slot"),
                 ("Scheduler (service)", True, "Entry point: finds the smallest room that fits and books it, cancels, lists"),
                 ("Interval", False, "Two datetimes on Booking are enough; the overlap rule lives there"),
                 ("User / Attendee", False, "An organiser name is enough; attendees are a count"),
                 ("Notifier", False, "Out of scope"),
                 ("Calendar", False, "A room's schedule is its sorted bookings; no class")],
    "ent_hint": "Which nouns hold a rule? What does a room need to answer, and where does the overlap check belong?",
    "ent_say": "I underline the nouns. **Room, Booking and the scheduler stay.** A booking carries the slot, so the overlap rule goes on it: a booking can say whether it overlaps another slot. Users are a name and attendees are a count. I'd skip a separate Interval class because nothing else uses it.",
    "ent_why": "Three classes and one error. Booking earns its class because it owns the overlap rule. Room owns is_free, so it reads like a question the room answers about itself.",

    "classes": [
        {"name": "RoomScheduler", "state": ["rooms: Map<id, Room>  # in the order added; the search keeps the first of equal sizes",
                                            "bookings: Map<id, Booking>  # req 4: cancel gets only a booking id",
                                            "next_id: int  # ids are never reused"],
         "behaviour": ["book(organiser, start, end, attendees) -> Booking | error  # req 1",
                       "book_room(organiser, room_id, start, end, attendees) -> Booking | error  # req 2",
                       "cancel(booking_id) -> void | error  # req 4",
                       "schedule(room_id) -> Booking[]  # req 5: earliest first",
                       "free_rooms(start, end, attendees) -> string[]  # req 5",
                       "_find_room(start, end, attendees) -> Room | None  # the smallest free room that fits"]},
        {"name": "Room", "state": ["room_id: string  # names the room in errors and lists",
                                   "capacity: int  # req 1: must hold the attendees",
                                   "bookings: Booking[]  # is_free checks the new slot against these"],
         "behaviour": ["is_free(start, end) -> bool  # req 1 and 2: no overlapping booking",
                       "add(booking) -> void  # book stores it here",
                       "remove(booking) -> void  # req 4"]},
        {"name": "Booking", "state": ["booking_id: string  # the key in the scheduler's map",
                                      "room: Room  # cancel removes it from this room",
                                      "start: datetime  # first moment the room is taken",
                                      "end: datetime  # first moment it is free: half-open [start, end), so req 3 holds",
                                      "organiser: string  # who booked it",
                                      "attendees: int  # head count"],
         "behaviour": ["overlaps(start, end) -> bool  # req 3: the one place the overlap rule lives"]},
    ],
    "class_hint": "The scheduler holds rooms and bookings. A room holds its capacity and its own bookings. A booking holds its slot and knows whether another slot overlaps it.",
    "class_say": "**I start from the methods and ask what each one has to read.** Book has to compare room sizes and check existing bookings, so each room holds its own bookings and answers is_free, which in turn asks each booking whether it overlaps. Cancel gets only an id, so the scheduler keeps a map of bookings. And the slot is half-open, so back-to-back is allowed with one strict comparison.",
    "class_why": "The scheduler chooses a room, the room knows its bookings, the booking knows the overlap rule. Each question is answered by the class that holds the data.",
    "class_qa": [{"ask": "Why is the overlap rule on Booking, and not a function in the scheduler?",
                  "say": "Because a booking holds the start and the end it compares. **The booking answers whether it overlaps a slot, the room asks every booking, the scheduler asks every room.** If the rule changes, one line changes.",
                  "explain": ["Booking.overlaps is one line; Room.is_free is a loop over it."]},
                 {"ask": "Why [start, end) and not [start, end]?",
                  "say": "Because with a closed end, a meeting ending at 10:00 would clash with one starting at 10:00. **Half-open means the end is the first free moment,** so back-to-back is allowed and the check is one strict comparison on each side."}],

    "map": {"center": ("RoomScheduler", "book, cancel, free_rooms"),
            "owned": [("Room", "capacity, bookings, is_free"), ("Booking", "slot, overlaps")],
            "uses": [("MeetingError", "every refusal")]},

    "skeleton": {"q": "First the small pieces: the error, Booking's __init__, Room with add and remove, and the scheduler's __init__.",
                 "hint": "Booking holds its id, room, start, end, organiser and head count. A room holds its id, capacity and a list of bookings. The scheduler holds rooms by id, bookings by id and the next id.",
                 "code": HEAD + BOOKING + ROOM + SCHEDULER,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "book", "q": "Start with the most interesting method: book(organiser, start, end, attendees). Core logic and edge cases as comments, then the code. Name the room search as a helper.",
         "hint": "Check the request, room = self._find_room(...), raise if there is none, create the booking.", "code": BOOK,
         "why": "Four lines of real work. Choosing the room is the higher logic, so it gets a name here and its own method next."},
        {"name": "_find_room", "q": "_find_room(start, end, attendees): which room should take it? One loop, no sorted list, ties explicit.",
         "hint": "Skip rooms that are too small or busy. Keep the one with the smallest capacity; strictly smaller, so the first added wins a tie.", "code": FIND_ROOM,
         "why": "Smallest means a strict comparison on capacity, and the strictness is the tie-break. Asking the room is_free keeps this loop about size only."},
        {"name": "Room.is_free", "q": "Room.is_free(start, end): is the slot free in this room?",
         "hint": "Ask each booking whether it overlaps. Any yes means not free.", "code": IS_FREE,
         "why": "The room loops and the booking decides. An empty room is free without a special case."},
        {"name": "Booking.overlaps", "q": "Booking.overlaps(start, end): the rule that makes back-to-back work.",
         "hint": "Half-open slots overlap when each starts before the other ends. Strict comparisons.", "code": OVERLAPS,
         "why": "One line. With less-than and not less-or-equal, a meeting ending at 10:00 does not clash with one starting at 10:00."},
        {"name": "book_room", "q": "book_room(organiser, room_id, start, end, attendees): the user names the room.",
         "hint": "Same check, then look the room up. Unknown, too small and busy are three errors.", "code": BOOK_ROOM,
         "why": "No search, so no choice to make. It asks the same is_free question the search asks."},
        {"name": "cancel", "q": "cancel(booking_id): free the slot again.",
         "hint": "Pop the booking from the map, error if missing, remove it from its room.", "code": CANCEL,
         "why": "Pop makes a second cancel an error. Because the booking holds its room, the room needs no search."},
        {"name": "free_rooms", "q": "free_rooms(start, end, attendees): which rooms could take this slot?",
         "hint": "The same two tests as the search, collect them, order smallest first and then by id.", "code": FREE_ROOMS,
         "why": "The same questions as _find_room, but it keeps every answer and fixes the order, so a run is the same every time."},
    ],
    "helpers": [
        {"q": "Booking's helper: label(), the short text the demo prints.",
         "hint": "Id, room id, then start and end as HH:MM.",
         "code": BOOKING_LABEL,
         "why": "A display line only. Nothing in the logic reads it."},
        {"q": "The scheduler's helpers: schedule, _check_request and _create.",
         "hint": "Sort a room's bookings by start. Reject start not before end, or fewer than one attendee. Build the booking, bump the id, store it in the room and the map.",
         "code": SCHED_HELPERS,
         "why": "_check_request and _create are shared by book and book_room, so the validation and the storing live once."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Booking owns overlap, Room owns is_free, the scheduler picks a room and records the booking."),
            ("Open/closed", "A new room rule is a new test in _find_room, or later a RoomSelector. Booking.overlaps and Room.is_free are not edited."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses. Any RoomSelector would take rooms and needs and return one room."),
            ("Interface segregation", "No interfaces yet. A Notifier would have one call, notify."),
            ("Dependency inversion", "The scheduler picks the smallest room itself. A selector or a Notifier would be handed in."),
        ],
        "varies": [
            ("Equipment and room rules", "Strategy, only if rules grow", "a RoomSelector takes rooms and needs"),
            ("Notify on book and cancel", "Observer", "a Notifier called after book and cancel succeed"),
            ("Recurring meetings", "No pattern: a list", "expand to slots; check all, book all or none"),
            ("Two people, last room", "No pattern: a lock", "choose and add as one step"),
        ],
    },
    "extensions": [
        {"ask": "Add recurring meetings, like every Monday for ten weeks.",
         "say": "A rule expands to a list of slots. **The scheduler finds one room that is free for every slot, then books all of them,** so nothing is half done. Booking.overlaps and Room.is_free don't change.",
         "code": EXT_RECURRING, "code_title": "Recurring meetings",
         "short_q": "Recurring meetings", "short_a": "a rule expands to slots; one room free for all, then book all or none"},
        {"ask": "Notify attendees on booking and cancellation.",
         "say": "A Notifier with a notify(user, message) call, handed to the scheduler and **called after book and cancel succeed,** so a failed send never undoes a booking.",
         "code": EXT_NOTIFY, "code_title": "Notifications",
         "short_q": "Notifications", "short_a": "a Notifier handed in; called after book and cancel succeed"},
        {"ask": "Two people book the last room at the same time.",
         "say": "Choosing a room and adding the booking is one step. **One lock around that step,** or per room, or a database constraint on room and slot. The second caller then sees the room as busy.",
         "code": EXT_LOCK, "code_title": "One lock",
         "short_q": "Two people, one room", "short_a": "choose-and-add as one step: a lock (per room), or a database constraint"},
        {"ask": "Rooms have equipment, and the user needs a projector.",
         "say": "Room gets a set of equipment, and **_find_room skips rooms that lack what is needed before it compares sizes.** If the filters multiply, a RoomSelector takes the rooms and the needs and returns one.",
         "short_q": "Equipment filter", "short_a": "a set on Room; skip rooms that lack it; a RoomSelector if rules grow"},
    ],
    "faq": [("Why not keep each room's bookings sorted and binary search?", "A room has a handful of meetings a day, so a loop is fine. With thousands per room, keep them sorted by start and use bisect to check only the two neighbours."),
            ("Why is the slot half-open?", "So the end is the first free moment. A meeting ending at 10:00 and one starting at 10:00 don't clash, and the overlap test needs only strict comparisons."),
            ("What if two rooms are the same size?", "The one added first wins, because the search only replaces the best on a strictly smaller capacity. The order is stable, so a run is repeatable.")],

    "summary": ["**Three classes and one error.** The RoomScheduler checks the request, then _find_room loops over the rooms and keeps the smallest one that fits and is free. Each Room asks its bookings whether they overlap, and Booking.overlaps is one line over half-open slots, so back-to-back meetings pass. Cancel pops the booking and removes it from its room.",
                "**It extends in one place each time:** recurring meetings are a list of slots checked before any booking, notifications are a call after success, threads are a lock around choose-and-add, and equipment is one more skip in the search."],

    "apart": [
        "**Slots are half-open, [start, end).** Two overlap when a.start < b.end and b.start < a.end, so back-to-back is allowed.",
        "**The overlap check lives on the booking, is_free on the room,** and book reads like a sentence.",
        "**Pick the smallest room that fits:** keep the best so far and replace it only on a strictly smaller capacity.",
        "**Choose the room and add the booking as one step;** a recurring meeting checks every slot first, then books them all."
    ],
    "golden": [
        ("Slots are half-open: [start, end). They overlap when a.start < b.end and b.start < a.end.", "end equals start is allowed, and it is one line instead of a pile of cases."),
        ("The overlap check lives on Booking, is_free on Room, and book reads like a sentence.", "each class answers a question about itself, and the scheduler only orchestrates."),
        ("The search keeps the best so far and replaces it only on a strictly smaller capacity.", "that is the smallest room and the tie-break in one comparison, so the result is deterministic."),
        ("Validate start before end first.", "bad input never reaches the room logic."),
        ("Choose a room and add the booking as one step under a lock.", "it is the senior signal for two people on the last room."),
        ("Recurring meetings: check every slot first, then book them all.", "all or none, with no rollback code."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with recurring meetings applied (one room free for every week, all or none), and a run at the bottom.",
    "final_title": "meeting.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "A is taken in week 3, so bob's three weekly meetings all go to B; dee's request fails because B is busy in week 1, and nothing of it is kept (4 bookings).",
}
