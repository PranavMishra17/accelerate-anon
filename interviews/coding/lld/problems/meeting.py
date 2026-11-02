"""Meeting room reservation. Cheat only: one screen in part 0.5."""

PROBLEM = {
    "id": "meeting", "title": "Meeting room reservation",
    "prompt": "Design a meeting room reservation system (or a meeting app).",
    "evidence": "LeetCode Discuss May 2025 (L5, LLD round); Taro Sep 2025 (SDE2, a meeting app).",

    "clarify": {
        "capabilities": [("What does a room have?", "An id and a capacity"),
                         ("What does a booking need?", "A time range, an organiser and the number of attendees"),
                         ("Which room does the system pick?", "The smallest free room that fits the attendees")],
        "errors": [("Two meetings in one room at the same time?", "Not allowed; one ending at 10:00 and one starting at 10:00 is fine"),
                   ("No room is free or big enough?", "Return an error")],
        "scope": [("Recurring meetings, equipment, invites?", "Not at first; recurring is the likely follow-up")],
    },

    "requirements": [
        ["A user books a room for a start and end time and a number of attendees.", "The system picks the smallest room that fits and has no overlapping booking", "No room free is an error"],
        ["A booking must have its start before its end.", "Anything else is rejected"],
        ["Back-to-back meetings are allowed.", "A meeting ending at 10:00 does not overlap one starting at 10:00"],
        ["The organiser cancels a booking.", "The room is free for that time again", "An unknown booking is an error"],
    ],
    "out_of_scope": ["recurring meetings (an extension)", "equipment filters", "invites and notifications", "calendars of attendees"],

    "entities": [("Room", True, "An id, a capacity and its bookings; knows if it is free for an interval"),
                 ("Booking", True, "The room, the interval and the organiser"),
                 ("Interval", True, "A start and end; the overlap check lives here"),
                 ("Scheduler (service)", True, "Entry point: finds the smallest room that fits and books it"),
                 ("User / Attendee", False, "An organiser id is enough; attendees are a count"),
                 ("Notifier", False, "Out of scope")],

    "classes": [
        {"name": "Scheduler", "state": ["rooms: Room[]  (sorted by capacity)  # book takes the first room that fits, which is the smallest",
                                        "bookings: Map<id, Booking>  # req 4: cancel gets only a booking id"],
         "behaviour": ["book(organiser, start, end, attendees) -> Booking | error  # req 1 to 3",
                       "cancel(booking_id) -> void | error  # req 4: the room is free again"]},
        {"name": "Room", "state": ["room_id: string  # names the room in a booking",
                                   "capacity: int  # req 1: must hold the attendees",
                                   "bookings: Booking[]  # is_free checks the new interval against these"],
         "behaviour": ["is_free(interval) -> boolean  # req 1: no overlapping booking",
                       "add(booking) -> void  # book stores it here",
                       "remove(booking) -> void  # req 4"]},
        {"name": "Booking", "state": ["booking_id: string  # the key in the scheduler's map",
                                      "room: Room  # cancel removes it from this room",
                                      "interval: Interval  # when the room is taken",
                                      "organiser: string  # who booked it"], "behaviour": []},
        {"name": "Interval", "state": ["start: datetime  # req 2: must come before end",
                                       "end: datetime  (half-open: [start, end))  # req 3: back-to-back is allowed"],
         "behaviour": ["overlaps(other) -> boolean  # the one place the overlap rule lives"]},
    ],
    "class_say": "**I start from the methods the requirements gave me: book and cancel, and book has to read room sizes and existing bookings.** So the scheduler keeps rooms sorted by capacity, and each room holds its own bookings and answers is_free. Cancel gets only an id, so the scheduler keeps a map of bookings. The overlap rule goes in one Interval class, half-open so back-to-back is fine.",

    "map": {"center": ("Scheduler", "book, cancel"),
            "owned": [("Room", "capacity, bookings"), ("Booking", "room, interval")],
            "uses": [("Interval", "[start, end)")]},

    "methods": [
        {"name": "book",
         "logic": ["Reject if start is not before end, or attendees is below one",
                   "Rooms are sorted by capacity; take the first with capacity at least attendees and is_free(interval)",
                   "No such room: raise an error",
                   "Create the Booking, add it to the room and to the map, return it"]},
        {"name": "cancel", "logic": ["Look up the booking; error if unknown", "Remove it from its room and from the map"]},
        {"name": "is_free (on Room)", "logic": ["Free if no existing booking's interval overlaps the new one"]},
        {"name": "overlaps (on Interval)",
         "logic": ["Half-open: [a, b) and [c, d) overlap exactly when a < d and c < b",
                   "So end equal to start does not overlap, and back-to-back meetings pass"]},
    ],

    "design_check": {
        "lead": "Check each choice against SOLID in a minute. Room choice and notification are the parts that may vary.",
        "solid": [
            ("Single responsibility", "Interval owns overlap, Room owns is_free, Booking records one booking, Scheduler picks a room and books it."),
            ("Open/closed", "A new room rule is a RoomSelector, added not edited. book is not changed."),
            ("Liskov substitution", "Not yet: no subclasses. Any RoomSelector would take rooms and needs and return one room."),
            ("Interface segregation", "No interface until something varies. A Notifier would have one call, notify."),
            ("Dependency inversion", "Scheduler holds its rooms and picks the smallest itself. A selector or Notifier would be handed in."),
        ],
        "varies": [
            ("Equipment and room rules", "Strategy, only if rules grow", "a RoomSelector takes rooms and needs"),
            ("Notify on book and cancel", "Observer", "a Notifier called after book and cancel succeed"),
            ("Recurring meetings", "No pattern: a list", "expand to intervals; check all, book all or none"),
            ("Two people, last room", "No pattern: a lock", "choose and add as one step"),
        ],
    },
    "extensions": [
        {"ask": "Add recurring meetings, like every Monday for ten weeks.",
         "say": "A recurrence rule expands to a list of intervals. **The booking checks every occurrence with is_free and books all or none**, so book takes a list of intervals, and Interval, Room and the room choice stay the same.",
         "short_q": "Recurring meetings", "short_a": "a rule expands to intervals; check all, book all or none"},
        {"ask": "Two people book the last room at the same time.",
         "say": "Choosing a room and adding the booking is one step. **One lock around book, or per room**, or a database constraint on room and interval. The second caller then sees the room as busy.",
         "short_q": "Two people, one room", "short_a": "choose-and-add as one step: a lock (per room), or a database constraint"},
        {"ask": "Rooms have equipment, and the user needs a projector.",
         "say": "Room gets a set of equipment, and **book filters rooms by capacity and needed equipment before picking the smallest**. If the filters multiply, a RoomSelector takes the rooms and the needs and returns one.",
         "short_q": "Equipment filter", "short_a": "a set on Room; filter, then pick the smallest; a RoomSelector if rules grow"},
        {"ask": "Notify attendees on booking and cancellation.",
         "say": "A Notifier with a notify(users, message) call, **called after book and cancel succeed**, so a failed send never undoes a booking.",
         "short_q": "Notifications", "short_a": "a Notifier called after book and cancel succeed"},
    ],

    "golden": [
        ("Intervals are half-open: [start, end). They overlap when a.start < b.end and b.start < a.end.", "end equals start is allowed, and it is one line instead of a pile of cases."),
        ("The overlap check lives on Interval, and is_free on Room.", "each class answers a question about itself, and the scheduler reads like a sentence."),
        ("Keep rooms sorted by capacity and take the first that fits and is free.", "that is the smallest room that fits, without a comparison in the loop."),
        ("Validate start before end first.", "bad input never reaches the room logic."),
        ("Choose a room and add the booking as one step under a lock.", "it is the senior signal for two people on the last room."),
    ],
}
