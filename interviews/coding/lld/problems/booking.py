"""Ticket booking (movie or train). Cheat only: one screen in part 0.5."""

PROBLEM = {
    "id": "booking", "title": "Ticket booking (movie or train)",
    "prompt": "Design BookMyShow, or a railway reservation system.",
    "evidence": "roundz Mar 2025 (SDE2, a BookMyShow class diagram); GeeksforGeeks (railway booking twice); a reported follow-up: extend from movies to events.",

    "clarify": {
        "capabilities": [("What is being booked?", "Seats for one show (a train journey works the same way)"),
                         ("Hold seats while the user pays?", "Yes, for a few minutes, then they go back on sale"),
                         ("Can one booking take several seats?", "Yes, and it is all or nothing")],
        "errors": [("Two people want the same seat?", "It must never be double-booked"),
                   ("What if the user never pays?", "The hold expires and the seats are free again")],
        "scope": [("Search, payments, prices, cancellation?", "Search and payment are out; prices are a follow-up; cancel before the show is in")],
    },

    "requirements": [
        ["A user holds one or more seats for a show.", "The system marks them held with an expiry, all or none", "A seat that is taken or already held is an error and nothing is held"],
        ["The user confirms the booking.", "The held seats become booked and a Booking is returned", "A hold that expired or is not theirs is an error"],
        ["A hold expires after a few minutes.", "The seats become available again without anyone calling"],
        ["A user cancels a booking.", "The seats become available", "Cancelling twice is an error"],
    ],
    "out_of_scope": ["search and browsing", "payment", "pricing (an extension)", "notifications"],

    "entities": [("Show", True, "A movie at a time on a screen; owns its per-show seats"),
                 ("Seat", True, "A physical seat: row and number; the same for every show"),
                 ("ShowSeat", True, "One seat for one show: its state (available, held, booked) and who holds it until when"),
                 ("Booking", True, "The user, the show and the seats they confirmed"),
                 ("Theatre / Screen", False, "Only where seats live; a Show can carry its seat list"),
                 ("User, Payment", False, "External; a user id is enough")],

    "classes": [
        {"name": "BookingService", "state": ["shows: Map<show_id, Show>", "bookings: Map<id, Booking>"],
         "behaviour": ["hold(show_id, seat_ids, user) -> hold_id | error", "confirm(hold_id, user) -> Booking | error", "cancel(booking_id) -> void | error"]},
        {"name": "Show", "state": ["show_id: string", "show_seats: Map<seat_id, ShowSeat>"],
         "behaviour": ["get_seat(seat_id) -> ShowSeat"]},
        {"name": "Seat", "state": ["row: string", "number: int"], "behaviour": []},
        {"name": "ShowSeat", "state": ["seat: Seat", "state: SeatState", "held_by: string | None", "held_until: timestamp | None"],
         "behaviour": ["is_available(now) -> boolean", "hold(user, until) -> void", "book() -> void", "release() -> void"]},
        {"name": "Booking", "state": ["booking_id: string", "user: string", "show_seats: ShowSeat[]"], "behaviour": []},
    ],

    "map": {"center": ("BookingService", "hold, confirm, cancel"),
            "owned": [("Show", "its show seats"), ("ShowSeat", "state, held_until"), ("Booking", "user, seats")],
            "uses": [("Seat", "row, number"), ("SeatState (enum)", "AVAILABLE, HELD, BOOKED")]},

    "methods": [
        {"name": "hold",
         "logic": ["Look up the show and every ShowSeat first, before changing anything",
                   "If any seat is not available (booked, or held and not expired), raise and hold nothing",
                   "Mark every seat held for this user until now plus the hold time, in one locked step",
                   "Return a hold id that names the seats"]},
        {"name": "confirm",
         "logic": ["Look up the hold; error if unknown or held by someone else",
                   "Error if any seat's hold has expired (it may be taken by now)",
                   "Mark every seat booked; create and store the Booking"]},
        {"name": "cancel", "logic": ["Look up the booking; error if unknown or already cancelled", "Release every ShowSeat and mark the booking cancelled"]},
        {"name": "is_available (on ShowSeat)",
         "logic": ["Available if state is AVAILABLE", "Or HELD with held_until in the past: an expired hold counts as free, so no timer thread is needed"]},
    ],

    "extensions": [
        {"ask": "Different seat types and prices.",
         "say": "Seat gets a type, and **a PricingStrategy takes the show seats and returns a total**. Booking stores the price it was confirmed at so later price changes don't rewrite history.",
         "short_q": "Seat types and prices", "short_a": "type on Seat; a PricingStrategy computes the total; Booking stores the price paid"},
        {"ask": "Two users click the same seat at the same moment.",
         "say": "Checking all seats and marking them held is one step: **one lock per show, or in a database a conditional update that sets held where available.** Because hold checks everything first and then writes, a failure holds nothing.",
         "short_q": "Two users, same seat", "short_a": "check-all-then-mark under one lock per show, or a conditional update; all or nothing"},
        {"ask": "Cancel with a refund rule.",
         "say": "Booking gets a state, BOOKED or CANCELLED, and a RefundPolicy takes the show start and now and returns the amount. **cancel releases the seats and asks the policy**; the policy is the only thing that changes.",
         "short_q": "Cancellation and refunds", "short_a": "a Booking state plus a RefundPolicy by time before the show"},
        {"ask": "Extend it from movies to trains or events.",
         "say": "Show becomes a generic Event, or a train Journey with a source, destination and date. **Seat and ShowSeat stay the same**, because seat-per-event state is the real idea.",
         "short_q": "Movies to trains or events", "short_a": "Show becomes Event or Journey; Seat and ShowSeat unchanged"},
    ],

    "golden": [
        ("Seat is physical and the same for every show; ShowSeat is that seat in one show, with its state.", "this split is the whole design: state per show means one seat can sell again at the next screening."),
        ("A hold takes all the chosen seats or none: check every seat first, then mark them together.", "partial holds strand a user with half a booking."),
        ("A hold carries an expiry, and an expired hold counts as available when we check.", "no background timer is needed, and abandoned carts free themselves."),
        ("Confirm re-checks that the hold is still theirs and not expired.", "someone else may have taken the seat after the hold lapsed."),
        ("Check and mark happen as one step: one lock per show, or a conditional update.", "it is the senior signal for two users at once."),
    ],
}
