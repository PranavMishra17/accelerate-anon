"""Builds interviews/coding/amazon-lld-top10.js: part 0.5 of the Amazon LLD tab, the ten most reported Amazon LLD
questions as one-screen cheat sheets. Evidence gathered 1 Nov 2026 from first-hand reports (LeetCode Discuss, roundz,
GeeksforGeeks, Taro, PracHub, TechPrep, 1point3acres). Every skeleton is run here before the file is written."""
import json, os, subprocess, sys, tempfile, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "amazon-lld-top10.js")


def check(src):
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write(src)
    r = subprocess.run([sys.executable, "-I", f.name], capture_output=True, text=True)
    os.unlink(f.name)
    assert r.returncode == 0, r.stderr


def box(x, y, w, h, title, sub, cls="d-box"):
    return (f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="6"/>'
            f'<text class="d-b" x="{x + 10}" y="{y + 20}">{title}</text>'
            f'<text class="d-s" x="{x + 10}" y="{y + 38}">{sub}</text>\n')


def class_map(label, center, owned, uses, links=()):
    """center: (title, sub). owned: composition, drawn left. uses: injected or strategy, drawn right, dashed.
    links: (i, label) draws an arrow from owned[i] down to owned[i+1]."""
    n = max(len(owned), len(uses))
    h = 100 + n * 72
    s = [f'<svg viewBox="0 0 420 {h}" role="img" aria-label="{label}">\n', box(115, 6, 190, 48, *center, "d-acc")]
    for i, (t, sub) in enumerate(owned):
        y = 100 + i * 72
        s.append(box(20, y, 190, 48, t, sub))
        s.append(f'<path class="d-ar" d="M115 30 L10 30 L10 {y + 24} L18 {y + 24}"/>\n')
    for i, (t, sub) in enumerate(uses):
        y = 100 + i * 72
        s.append(box(224, y, 180, 48, t, sub, "d-dashbox"))
        s.append(f'<path class="d-ar" d="M305 30 L412 30 L412 {y + 24} L406 {y + 24}"/>\n')
    for i, lab in links:
        y = 100 + i * 72
        s.append(f'<path class="d-ar" d="M115 {y + 48} L115 {y + 70}"/><text class="d-a" x="122" y="{y + 64}">{lab}</text>\n')
    if owned:
        s.append('<text class="d-a" x="14" y="22">owns</text>\n')
    if uses:
        s.append('<text class="d-a" x="352" y="22">uses</text>\n')
    s.append("</svg>")
    return "".join(s)


def tab(pid, title, ask, evidence, clarify, classes, cmap, flow, edges, patterns, extension, skeleton, drill=None):
    skeleton = textwrap.dedent(skeleton)
    check(skeleton)
    blocks = [
        {"t": "p", "text": f"**What they ask:** {ask}"},
        {"t": "p", "text": f"**Reported:** {evidence}" + (f" **Full practice:** {drill}" if drill else "")},
        {"t": "table", "head": ["Ask", "Usual answer", "What it changes"], "rows": clarify},
        {"t": "table", "head": ["Class", "Holds", "Does"], "rows": classes},
        {"t": "svg", "svg": cmap, "alt": "Class map"},
        {"t": "p", "text": "**Core flow**"},
        {"t": "list", "items": flow},
        {"t": "p", "text": "**Edge cases to raise**"},
        {"t": "list", "items": edges},
        {"t": "table", "head": ["Idea", "Where it shows"], "rows": patterns},
        {"t": "p", "text": f"**Likely extension:** {extension}"},
        {"t": "code", "id": f"{pid}-skel", "title": "Skeleton: signatures only", "code": skeleton, "notes": {}},
    ]
    return {"id": pid, "title": title, "blocks": blocks}


S = []

S.append({"id": "t10-overview", "title": "The ten, and the five shapes", "blocks": [
    {"t": "p", "text": "These are the LLD questions Amazon candidates actually reported, counted from first-hand write-ups (LeetCode Discuss, roundz, GeeksforGeeks, Taro, PracHub, TechPrep, 1point3acres), mostly 2024 to 2026. **No source ranks Amazon's questions by frequency, so the counts are lower bounds**, but the top of the list is clear: Amazon Locker shows up more than anything else."},
    {"t": "table", "head": ["#", "Question", "Reports found", "Shape"], "rows": [
        ["1", "Amazon Locker (and 'find space for an incoming package')", "about 7, Apr 2024 to Apr 2026", "Container of slots"],
        ["2", "Parking lot or garage", "about 4", "Container of slots"],
        ["3", "Chess", "about 4", "Turn-based game"],
        ["4", "Splitwise (expense sharing)", "3, Dec 2024 to Apr 2026", "Ledger"],
        ["5", "Ticket booking: movie or train", "3", "Container of slots, with holds"],
        ["6", "Vending machine", "about 3", "State machine"],
        ["7", "Elevator", "2", "State machine plus scheduler"],
        ["8", "Rate limiter", "2", "Pluggable algorithm"],
        ["9", "Meeting room reservation", "2", "Container of slots, over time"],
        ["10", "File search, like Unix find", "2, mostly older", "Composable filters"]]},
    {"t": "p", "text": "Also reported once each: LRU cache, pub/sub, digital wallet, issue management with escalation, restaurant management, school management, library, a chat messenger, a calculator. Your drills already cover LRU and the key-value cache (part 7), library (part 5) and the shopping cart (part 4)."},
    {"t": "table", "head": ["Shape", "Questions", "The skeleton you reuse"], "rows": [
        ["Container of slots", "Locker, parking, booking, meeting rooms", "A container owns resources; an allocation Strategy picks one; a reservation records who has it until when; a lock around choose-and-reserve; physical state on the resource, relational state in the container"],
        ["State machine", "Vending machine, elevator", "One object whose behaviour depends on its state; State classes or an enum with guarded transitions; illegal moves raise"],
        ["Turn-based game", "Chess", "Game owns Board and players; an abstract Piece with polymorphic moves; Move objects for history and undo"],
        ["Ledger", "Splitwise", "Money in integer cents; transactions append; balances derived; a Strategy per split type"],
        ["Pluggable rules", "Rate limiter, file search", "One interface, many interchangeable implementations (algorithms or filters); composites for AND/OR; new rule = new class"]]},
    {"t": "p", "text": "**What interviewers probed across the reports:** a reason for every class and where each method lives (chess, elevator), extensibility and SOLID by name, concurrency (parking garage, locker), and a twist mid-round (priority scheduling, currency conversion, events instead of movies). The round is often 30 minutes beside two leadership questions, and it is sometimes labelled HLD. Code is written, not run."}
]})

S.append(tab("t10-locker", "1 Amazon Locker",
    "'Design Amazon Locker.' Drivers drop packages into compartments; customers pick up with a code.",
    "LeetCode Discuss Mar 2025, Jun 2025 (bar raiser), Apr 2024, Apr 2026; roundz May 2025; PracHub Jul 2026; a bar raiser asking for 'the function that returns the locker to open'.",
    [["Compartment sizes?", "Small, medium, large", "Size enum; fits()"],
     ["Which compartment?", "Smallest that fits; fall back to bigger", "Assignment Strategy"],
     ["How does the customer prove it's theirs?", "One-time 6-digit code", "Code to reservation map; delete on use"],
     ["Uncollected?", "Expires after 3 to 7 days; staff remove or it returns", "Clock; expiry sweep"],
     ["Broken compartments?", "Yes, out of service", "A status on the compartment"],
     ["Two drivers at once?", "Yes", "Lock around choose and reserve"]],
    [["Locker", "compartments, codes, lock", "deposit, pickup, expire"],
     ["Compartment", "size, state, package", "fits, reserve, store, release"],
     ["Package", "id, size, customer", "data only (frozen)"],
     ["Reservation", "code, package, compartment, expiry", ""],
     ["SlotAssigner", "", "choose(compartments, package)"],
     ["Notifier, CodeGenerator, Clock", "", "notify, new_code, now"]],
    class_map("Locker class map", ("Locker", "deposit, pickup, expire"),
              [("Compartment", "guards its own state"), ("Reservation", "code, expires_at"), ("Package", "frozen data")],
              [("SlotAssigner", "smallest fit"), ("Notifier", "text, email"), ("CodeGenerator", "one-time codes"), ("Clock", "fake in tests")],
              links=[(1, "refers to")]),
    ["deposit: under the lock, assigner picks the smallest free fit; compartment FREE to RESERVED; make a unique code; store; save reservation; notify after unlocking.",
     "pickup: code exists and not expired; delete it; release the compartment.",
     "expire: nightly, release late reservations and tell the customer."],
    ["No compartment fits: fall back to a larger size, else 'locker full'.",
     "Door never closes after reserve: a timeout returns RESERVED to FREE.",
     "Code reused or guessed: one-time, same error for wrong and used, rate-limit attempts.",
     "A valid code must not mean a free slot: the slot frees only on pickup or staff removal."],
    [["Encapsulation", "Compartment changes its own state through guarded methods"],
     ["Strategy, open-closed", "Assignment rule behind SlotAssigner"],
     ["Dependency inversion", "Notifier, codes and clock passed into Locker"],
     ["Facade", "Locker is the one entry point"]],
    "Refrigerated compartments (features as data, a new assigner), returns, many lockers (a network that tries the nearest).",
    '''
    from abc import ABC, abstractmethod
    from enum import Enum

    class Size(Enum):
        SMALL = 1; MEDIUM = 2; LARGE = 3

    class Compartment:
        def __init__(self, cid: str, size: Size): ...
        def fits(self, package) -> bool: ...
        def reserve(self) -> None: ...
        def store(self, package) -> None: ...
        def release(self): ...

    class SlotAssigner(ABC):
        @abstractmethod
        def choose(self, compartments, package): ...

    class Locker:
        def __init__(self, compartments, assigner, notifier, codes, clock): ...
        def deposit(self, package): ...
        def pickup(self, code: str): ...
        def expire(self) -> list: ...
    ''',
    drill="part 8, the whole mock round."))

S.append(tab("t10-parking", "2 Parking lot",
    "'Design a parking lot', sometimes 'a scalable, concurrent parking garage'.",
    "roundz Jul 2025 (SDE2, concurrency was the headline); LeetCode Discuss Jun 2025 and Apr 2026 ('a system like a library or parking lot'); TechPrep.",
    [["Vehicle types?", "Bike, car, truck", "Vehicle type enum; spot sizes"],
     ["Floors and gates?", "Several floors, several entry and exit gates", "Level class; gates call the lot concurrently"],
     ["How is a spot chosen?", "Nearest free spot that fits", "SpotFinder Strategy"],
     ["How is it priced?", "Hourly, by vehicle type", "PricingStrategy"],
     ["Show free counts?", "Per floor, per type", "Counters kept on each level"],
     ["Lost ticket?", "Flat fee", "One rule in pricing"]],
    [["ParkingLot", "levels, active tickets, lock", "enter, exit"],
     ["Level", "spots, free counts", "free_spot(vehicle)"],
     ["Spot", "size, vehicle", "fits, park, leave"],
     ["Vehicle", "plate, type", "data only"],
     ["Ticket", "id, vehicle, spot, entered_at", ""],
     ["SpotFinder, PricingStrategy", "", "find(levels, vehicle), fee(ticket, now)"]],
    class_map("Parking lot class map", ("ParkingLot", "enter, exit"),
              [("Level", "spots, free counts"), ("Spot", "size, vehicle"), ("Ticket", "who, where, since")],
              [("SpotFinder", "nearest that fits"), ("PricingStrategy", "hourly by type"), ("Clock", "now()")],
              links=[(0, "has many")]),
    ["enter(vehicle): under the lot's lock, the finder picks a spot; spot.park; issue a ticket.",
     "exit(ticket): fee = pricing.fee(ticket, now); take payment; spot.leave; close the ticket."],
    ["Lot full for that type: say so at the gate.",
     "Two gates pick the same spot: choose and park under one lock, or a lock per level.",
     "A truck in a car spot: fits() checks size order.",
     "Overnight or across a price change: pricing reads entry time, not a running meter."],
    [["Strategy, open-closed", "Spot choice and pricing are swappable"],
     ["Single responsibility", "Level counts spots; pricing knows money; the lot coordinates"],
     ["Composition", "Lot has levels, levels have spots"],
     ["Avoid", "A Singleton lot; pass it in instead"]],
    "EV charging spots, reservations, monthly passes (a new pricing strategy).",
    '''
    from abc import ABC, abstractmethod
    from enum import Enum

    class VehicleType(Enum):
        BIKE = 1; CAR = 2; TRUCK = 3

    class Spot:
        def __init__(self, sid: str, size: VehicleType): ...
        def fits(self, vehicle) -> bool: ...
        def park(self, vehicle) -> None: ...
        def leave(self): ...

    class SpotFinder(ABC):
        @abstractmethod
        def find(self, levels, vehicle): ...

    class PricingStrategy(ABC):
        @abstractmethod
        def fee(self, ticket, now: int) -> int: ...

    class ParkingLot:
        def __init__(self, levels, finder, pricing, clock): ...
        def enter(self, vehicle): ...
        def exit(self, ticket) -> int: ...
    ''',
    drill="part 2, Parking lot."))

S.append(tab("t10-chess", "3 Chess",
    "'Design chess for two players.' Probed hard: a reason for every class and method placement.",
    "GeeksforGeeks (three loops, one a bar raiser where the LLD caused the rejection); LeetCode Discuss Jun 2025 (L5, with an API and request/response per call).",
    [["Local or online?", "Two players; online if asked", "Player class; maybe a Game API"],
     ["Full rules?", "Yes: castling, en passant, promotion", "Special moves inside the pieces"],
     ["Check and checkmate?", "Detect and end the game", "A check test after each simulated move"],
     ["Undo and history?", "Keep the moves", "Move objects in a list"],
     ["Timers?", "Not at first", "Leave room for a Clock"]],
    [["Game", "board, players, turn, status, moves", "make_move, status"],
     ["Board", "8x8 cells", "piece_at, move, path_clear"],
     ["Piece (abstract)", "colour", "can_move(board, frm, to)"],
     ["King, Queen, Rook, Bishop, Knight, Pawn", "", "their own can_move"],
     ["Move", "piece, from, to, captured", "apply, undo"],
     ["Player", "name, colour", ""]],
    class_map("Chess class map", ("Game", "turns, status, history"),
              [("Board", "8x8 cells"), ("Move", "from, to, captured"), ("Player", "name, colour")],
              [("Piece (abstract)", "can_move(board,...)"), ("King ... Pawn", "override can_move")]),
    ["make_move(player, frm, to): is it their turn and their piece?",
     "piece.can_move(board, frm, to): each subclass checks its own shape; the board checks the path is clear.",
     "Simulate the move; if their own king is in check, undo and reject.",
     "Record the Move, then test check, checkmate, stalemate for the other side; switch turns."],
    ["Pinned piece: legal shape, but exposes the king.",
     "Castling: not through, out of or into check; neither piece moved before.",
     "En passant: only on the very next move.",
     "Promotion: the player chooses the piece.",
     "Draws: stalemate, repetition, fifty moves."],
    [["Polymorphism", "board asks piece.can_move; no if-chain on piece type"],
     ["Liskov", "Any Piece works wherever Piece is expected"],
     ["Command", "Move objects make undo and history easy"],
     ["State", "Game status: active, check, checkmate, stalemate"]],
    "Timers per player, online play, an AI player (Strategy for choosing a move).",
    '''
    from abc import ABC, abstractmethod
    from enum import Enum

    class Colour(Enum):
        WHITE = 1; BLACK = 2

    class Piece(ABC):
        def __init__(self, colour: Colour): ...
        @abstractmethod
        def can_move(self, board, frm, to) -> bool: ...

    class Knight(Piece):
        def can_move(self, board, frm, to) -> bool: ...

    class Board:
        def piece_at(self, square): ...
        def path_clear(self, frm, to) -> bool: ...

    class Move:
        def __init__(self, piece, frm, to, captured=None): ...

    class Game:
        def __init__(self, white, black): ...
        def make_move(self, player, frm, to) -> None: ...
        def status(self): ...
    ''',
    drill=None))

S.append(tab("t10-splitwise", "4 Splitwise",
    "'Design Splitwise': groups, shared expenses, who owes whom.",
    "LeetCode Discuss Dec 2024, May 2025 (currency conversion was the sticking point), Apr 2026 (entities, APIs and a strategy pattern, pseudocode only).",
    [["Split types?", "Equal, exact amounts, percentages, shares", "SplitStrategy per type"],
     ["Groups?", "Yes, plus one-to-one", "Group holds members and expenses"],
     ["Currencies?", "Often the twist", "Convert at the time of the expense; store the rate"],
     ["Settle up?", "Record a payment", "A settlement is a transaction too"],
     ["Simplify debts?", "Nice to have", "Net balances, then greedy matching"]],
    [["ExpenseService", "users, groups, ledger", "add_expense, settle, balances"],
     ["Expense", "payer, amount_cents, currency, splits", ""],
     ["SplitStrategy (abstract)", "", "shares(amount, participants, params)"],
     ["Equal, Exact, Percent", "", "compute and validate shares"],
     ["Ledger", "net balance per pair", "apply(expense), owes(a, b)"],
     ["CurrencyConverter", "", "convert(amount, frm, to, at)"]],
    class_map("Splitwise class map", ("ExpenseService", "add, settle, balances"),
              [("Group", "members, expenses"), ("Expense", "payer, cents, splits"), ("Ledger", "net per pair")],
              [("SplitStrategy", "equal, exact, percent"), ("CurrencyConverter", "rate at the time"), ("Notifier", "tell participants")]),
    ["add_expense(payer, amount, participants, type, params): the strategy computes each share and validates (percents total 100, exacts total the amount).",
     "Convert to the group currency at today's rate and store the rate on the expense.",
     "The ledger moves each participant's share onto their balance with the payer.",
     "settle(a, b, amount) is a transaction in the other direction."],
    ["Rounding: amounts in integer cents; the leftover cent goes to a fixed person.",
     "Percents that don't add to 100, exacts that don't add to the total: reject.",
     "Rates change: store the rate used, never recompute history.",
     "A member leaves with a balance: block or settle first."],
    [["Strategy, open-closed", "A new split type is a new class"],
     ["Single responsibility", "Expense records; Ledger keeps balances; converter knows rates"],
     ["Immutability", "Expenses append; corrections are new transactions"],
     ["Factory", "Pick the split strategy from the type"]],
    "Simplify debts (net balances, match largest creditor with largest debtor), recurring expenses, receipts.",
    '''
    from abc import ABC, abstractmethod

    class SplitStrategy(ABC):
        @abstractmethod
        def shares(self, amount_cents: int, participants: list, params: dict) -> dict: ...

    class EqualSplit(SplitStrategy):
        def shares(self, amount_cents, participants, params): ...

    class Expense:
        def __init__(self, payer, amount_cents: int, currency: str, shares: dict, rate: float): ...

    class Ledger:
        def apply(self, expense: Expense) -> None: ...
        def owes(self, a, b) -> int: ...

    class ExpenseService:
        def __init__(self, ledger, converter, strategies: dict): ...
        def add_expense(self, payer, amount_cents, currency, participants, kind, params=None): ...
        def settle(self, frm, to, amount_cents) -> None: ...
    ''',
    drill=None))

S.append(tab("t10-booking", "5 Ticket booking (movie or train)",
    "'Design BookMyShow', or a railway reservation system.",
    "roundz Mar 2025 (SDE2, a BookMyShow class diagram); GeeksforGeeks (railway booking twice); a reported follow-up: extend from movies to events.",
    [["What's being booked?", "Seats for a show (or a train journey)", "Show and ShowSeat"],
     ["Hold while paying?", "Yes, for a few minutes", "HELD state with an expiry"],
     ["Two people, same seat?", "Must never double-book", "Atomic hold on all chosen seats"],
     ["Seat types and prices?", "Regular, premium", "Pricing Strategy"],
     ["Cancellation?", "Before the show, with a refund rule", "Booking states; refund policy"]],
    [["BookingService", "", "search, hold, confirm, cancel"],
     ["Theatre, Screen", "screens, seats", ""],
     ["Show", "movie, screen, start, show seats", ""],
     ["Seat", "row, number, type", "physical seat"],
     ["ShowSeat", "seat, state, held_until", "hold, book, release"],
     ["Booking", "user, show, seats, state", ""]],
    class_map("Booking class map", ("BookingService", "search, hold, confirm"),
              [("Show", "movie, screen, time"), ("ShowSeat", "state per show"), ("Booking", "user, seats, state")],
              [("SeatLock", "atomic holds"), ("Pricing", "by seat type"), ("Payment", "charge, refund")],
              links=[(0, "has many")]),
    ["hold(user, show, seats): atomically move every chosen ShowSeat FREE to HELD with an expiry; if any isn't free, hold none.",
     "Pay. On success, HELD to BOOKED and the booking is confirmed; on failure or timeout, release.",
     "cancel(booking): BOOKED to FREE, refund by policy."],
    ["Two users pick the same seat: the hold is all-or-nothing and atomic.",
     "Payment succeeds after the hold expired: check the hold is still yours before booking.",
     "Abandoned holds: a sweep releases them.",
     "Train variant: a seat is free per segment of the route, not per train."],
    [["Physical vs per-show state", "Seat is the chair; ShowSeat is that chair for one show (same idea as Locker)"],
     ["State", "ShowSeat FREE, HELD, BOOKED"],
     ["Strategy", "Pricing by type, time or demand"],
     ["Observer", "Confirmations and reminders"]],
    "Events instead of movies (Show becomes Event at a Venue), dynamic pricing, a waitlist.",
    '''
    from enum import Enum

    class SeatState(Enum):
        FREE = 1; HELD = 2; BOOKED = 3

    class ShowSeat:
        def __init__(self, seat, show): ...
        def hold(self, user, until: int) -> None: ...
        def book(self, user) -> None: ...
        def release(self) -> None: ...

    class Show:
        def __init__(self, movie, screen, start: int): ...
        def seats(self) -> list: ...

    class BookingService:
        def __init__(self, seat_lock, pricing, payment, clock): ...
        def hold(self, user, show, seat_ids: list): ...
        def confirm(self, hold_id, payment_info): ...
        def cancel(self, booking_id) -> None: ...
    ''',
    drill=None))

S.append(tab("t10-vending", "6 Vending machine",
    "'Design a vending machine' (one report: 'snacks vending machine, classes, fields, methods').",
    "GeeksforGeeks Sept 2022 (SDE-2); 1point3acres Feb 2026 (SDE2); TechPrep.",
    [["Payment?", "Coins and notes; card later", "Payment Strategy"],
     ["Change?", "Yes, from coins inside", "ChangeMaker with coin counts"],
     ["Sold out?", "Show it; refund if chosen", "Inventory per slot"],
     ["Cancel?", "Refund what was inserted", "A cancel in every state"],
     ["Restock?", "An admin mode", "OutOfService or Maintenance state"]],
    [["VendingMachine", "state, inventory, coin box, balance", "select, insert, cancel"],
     ["State (abstract)", "", "select, insert, dispense, cancel"],
     ["Idle, HasMoney, Dispensing, OutOfService", "", "their own rules"],
     ["Inventory", "slot to product and count", "available, take"],
     ["CoinBox / ChangeMaker", "coin counts", "make_change(amount)"]],
    class_map("Vending machine class map", ("VendingMachine", "select, insert, cancel"),
              [("Inventory", "slot, product, count"), ("CoinBox", "coin counts")],
              [("State", "Idle, HasMoney ..."), ("ChangeMaker", "greedy, checks stock")]),
    ["select(slot): Idle checks stock and price, remembers the choice.",
     "insert(coin): HasMoney adds to the balance; when it covers the price, check change can be made.",
     "Dispensing: take the product, return change, back to Idle.",
     "cancel(): refund the balance from any state that holds money."],
    ["Can't make change: refund, or ask for exact money.",
     "Sold out after selection: refund.",
     "Coins from another country: reject.",
     "Power cut mid-dispense: the balance must not be lost."],
    [["State", "Each state class answers the same actions differently; no if-chain on a status string"],
     ["Single responsibility", "Inventory knows stock, CoinBox knows money"],
     ["Strategy", "Coins today, card tomorrow"],
     ["Open-closed", "A new state is a new class"]],
    "Card payments, remote stock reports, promotions.",
    '''
    from abc import ABC, abstractmethod

    class State(ABC):
        def __init__(self, machine): ...
        @abstractmethod
        def select(self, slot: str) -> None: ...
        @abstractmethod
        def insert(self, coin: int) -> None: ...
        @abstractmethod
        def cancel(self) -> int: ...

    class Idle(State):
        def select(self, slot): ...
        def insert(self, coin): ...
        def cancel(self): ...

    class VendingMachine:
        def __init__(self, inventory, coin_box): ...
        def set_state(self, state: State) -> None: ...
        def select(self, slot: str) -> None: ...
        def insert(self, coin: int) -> None: ...
        def cancel(self) -> int: ...
    ''',
    drill=None))

S.append(tab("t10-elevator", "7 Elevator",
    "'Design an elevator system', then 'add priority scheduling'.",
    "roundz May 2025 (SDE2, LLD round, priority follow-up); PracHub Oct 2025 (onsite).",
    [["Floors and cars?", "N floors, M cars", "Controller owns cars"],
     ["Buttons?", "Up/down in halls, floor buttons in cars", "HallRequest and CarRequest"],
     ["Scheduling goal?", "Short waits; then priority", "Scheduler Strategy"],
     ["Capacity?", "Weight limit", "Overload state"],
     ["Maintenance and fire?", "Take a car out; fire returns all to ground", "Car states"]],
    [["ElevatorController", "cars, scheduler", "request(floor, direction)"],
     ["Elevator", "floor, direction, state, stops", "add_stop, step"],
     ["Door", "open or closed", "open, close"],
     ["Request", "floor, direction, priority", ""],
     ["Scheduler (abstract)", "", "pick(cars, request)"],
     ["Display", "", "show(floor, direction)"]],
    class_map("Elevator class map", ("ElevatorController", "request(floor, dir)"),
              [("Elevator", "floor, dir, stops"), ("Door", "open, closed")],
              [("Scheduler", "nearest, same dir"), ("Display", "observes cars")],
              links=[(0, "has a")]),
    ["A hall call goes to the scheduler, which picks a car: idle and nearest, or moving towards the floor in the same direction.",
     "The car keeps two sorted stop sets, up and down, and serves one direction at a time (the SCAN idea).",
     "Each step moves one floor; at a stop, open, wait, close; when a direction's stops run out, turn or go idle."],
    ["A call for a floor the car just passed: it waits for the return trip.",
     "Door blocked: reopen, don't move.",
     "Overload: don't close.",
     "All cars busy: queue the call.",
     "Fire mode: cancel everything, go to the ground floor."],
    [["State", "Car: idle, moving up, moving down, maintenance"],
     ["Strategy", "Scheduling algorithms swap; priority is a new one"],
     ["Observer", "Displays follow car position"],
     ["Single responsibility", "Controller assigns; car moves; scheduler decides"]],
    "Priority or VIP calls, express cars for some floors, rush-hour mode.",
    '''
    from abc import ABC, abstractmethod
    from enum import Enum

    class Direction(Enum):
        UP = 1; DOWN = -1; IDLE = 0

    class Elevator:
        def __init__(self, eid: int, floors: int): ...
        def add_stop(self, floor: int) -> None: ...
        def step(self) -> None: ...

    class Scheduler(ABC):
        @abstractmethod
        def pick(self, cars: list, floor: int, direction: Direction): ...

    class ElevatorController:
        def __init__(self, cars: list, scheduler: Scheduler): ...
        def request(self, floor: int, direction: Direction) -> None: ...
        def tick(self) -> None: ...
    ''',
    drill="part 6, Elevator system."))

S.append(tab("t10-ratelimiter", "8 Rate limiter",
    "'Design a rate limiter', then more algorithms, then distributed.",
    "LeetCode Discuss Mar 2025 (token bucket, then sliding window) and Aug 2026 (fixed window, sliding window, token bucket, then Redis and distributed).",
    [["Limit by what?", "User, API key or IP", "The key you count on"],
     ["Which limit?", "N requests per window, per rule", "Rule config"],
     ["Bursts allowed?", "Some", "Token bucket over fixed window"],
     ["One server or many?", "Start with one", "A Store interface: memory now, Redis later"],
     ["When limited?", "429 with retry-after", "allow() returns a decision, not only a bool"]],
    [["RateLimiter", "rules, algorithm per rule", "allow(key)"],
     ["Rule", "limit, window, scope", ""],
     ["Algorithm (abstract)", "", "try_acquire(key, now)"],
     ["TokenBucket, FixedWindow, SlidingWindow", "per-key state", "their own math"],
     ["Store", "", "get, set, atomic increment"],
     ["Clock", "", "now()"]],
    class_map("Rate limiter class map", ("RateLimiter", "allow(key)"),
              [("Rule", "limit, window, scope")],
              [("Algorithm", "bucket, window ..."), ("Store", "memory or Redis"), ("Clock", "now()")]),
    ["allow(key): find the rule for the key's scope.",
     "algorithm.try_acquire(key, now): token bucket refills by elapsed time, takes one token if any.",
     "Return allowed, or denied with retry-after."],
    ["Fixed window lets 2N through at a window boundary: say why sliding windows or tokens fix it.",
     "Idle keys pile up: evict by last use.",
     "Two requests for one key at once: lock per key, or an atomic store operation.",
     "Many servers: counters in Redis with atomic scripts; clocks differ, so use the store's time."],
    [["Strategy", "Algorithms are interchangeable behind one interface"],
     ["Dependency inversion", "Store and clock injected; tests fake time"],
     ["Open-closed", "A new algorithm is a new class"],
     ["Factory", "Build limiters from config"]],
    "Distributed limiting with Redis, tiers per customer plan, limiting by cost instead of count.",
    '''
    from abc import ABC, abstractmethod

    class Algorithm(ABC):
        @abstractmethod
        def try_acquire(self, key: str, now: float) -> bool: ...

    class TokenBucket(Algorithm):
        def __init__(self, capacity: int, refill_per_sec: float, store): ...
        def try_acquire(self, key, now): ...

    class Rule:
        def __init__(self, scope: str, limit: int, window_sec: int): ...

    class RateLimiter:
        def __init__(self, rules: list, algorithms: dict, clock): ...
        def allow(self, key: str, scope: str) -> bool: ...
    ''',
    drill=None))

S.append(tab("t10-meeting", "9 Meeting room reservation",
    "'Design a meeting room reservation system' (or a meeting app).",
    "LeetCode Discuss May 2025 (L5, LLD round); Taro Sep 2025 (SDE2, a meeting app).",
    [["Rooms?", "Capacity and equipment", "Room fields; a filter"],
     ["Booking?", "A time range, organiser, attendees", "Interval; Booking"],
     ["Conflicts?", "No overlap in one room; end equals start is fine", "Half-open intervals"],
     ["Recurring?", "Maybe later", "Leave room for a rule"],
     ["Notify?", "Invite and cancel notices", "Notifier"]],
    [["BookingService", "rooms, lock", "find_rooms, book, cancel"],
     ["Room", "id, capacity, equipment, bookings", "is_free(interval)"],
     ["Booking", "room, interval, organiser, attendees", ""],
     ["Interval", "start, end", "overlaps(other)"],
     ["RoomSelector", "", "choose(rooms, needs)"],
     ["Notifier", "", "notify(users, message)"]],
    class_map("Meeting rooms class map", ("BookingService", "find, book, cancel"),
              [("Room", "capacity, bookings"), ("Booking", "interval, people")],
              [("RoomSelector", "smallest that fits"), ("Notifier", "invites"), ("Clock", "now()")],
              links=[(0, "has many")]),
    ["book(organiser, start, end, attendees, needs): filter rooms by capacity and equipment.",
     "Under the lock, the selector picks a free room (smallest that fits); check no overlap.",
     "Save the booking in the room (kept sorted by start) and notify attendees."],
    ["Back-to-back meetings: use half-open [start, end).",
     "Time zones: store UTC, show local.",
     "Two people book the last room: check and add under one lock.",
     "Overlap check: sorted list and a binary search, not a full scan, if asked about scale."],
    [["Container of slots, over time", "Same shape as Locker, with intervals instead of compartments"],
     ["Strategy", "Room choice: smallest, nearest, least used"],
     ["Observer", "Attendees notified on change"],
     ["Single responsibility", "Interval knows overlap; Room knows its bookings"]],
    "Recurring meetings, a waitlist, suggesting the next free slot for everyone.",
    '''
    from abc import ABC, abstractmethod

    class Interval:
        def __init__(self, start: int, end: int): ...
        def overlaps(self, other: "Interval") -> bool: ...

    class Room:
        def __init__(self, rid: str, capacity: int, equipment: set): ...
        def is_free(self, interval: Interval) -> bool: ...

    class RoomSelector(ABC):
        @abstractmethod
        def choose(self, rooms: list, needs: dict): ...

    class BookingService:
        def __init__(self, rooms: list, selector: RoomSelector, notifier): ...
        def book(self, organiser, start: int, end: int, attendees: list, needs: dict): ...
        def cancel(self, booking_id: str) -> None: ...
    ''',
    drill=None))

S.append(tab("t10-filesearch", "10 File search, like Unix find",
    "'Design an API to find files: all files over 5 MB, all XML files, and combinations.'",
    "PracHub (onsite, hard) and a Hello Interview community report; LeetCode posts from 2019 and a 2024 write-up. Long known as an Amazon favourite, but thin in 2024 to 2026 reports.",
    [["Which filters?", "Size, extension, name pattern, modified time", "One class per filter"],
     ["Combine them?", "AND, OR, NOT", "Composite filters"],
     ["Directories?", "Recurse, maybe a depth limit", "Iterative traversal"],
     ["Symlinks?", "Possible cycles", "A visited set"],
     ["Huge trees?", "Yes", "Stream results, don't build a list"]],
    [["FileSearcher", "", "search(root, filter)"],
     ["Node, File, Directory", "name, size, children", "Composite file tree"],
     ["Filter (abstract)", "", "matches(file)"],
     ["SizeFilter, ExtensionFilter, NameFilter", "params", "their own test"],
     ["And, Or, Not", "child filters", "combine"],
     ["SearchBuilder", "", "fluent: .size_gt(5MB).ext('xml')"]],
    class_map("File search class map", ("FileSearcher", "search(root, filter)"),
              [("Directory", "children"), ("File", "name, size, ext")],
              [("Filter", "matches(file)"), ("Size, Ext, Name", "one class each"), ("And, Or, Not", "composites")],
              links=[(0, "contains")]),
    ["search(root, filter): walk with an explicit stack (no recursion limit).",
     "For each file, filter.matches(file); yield matches as found.",
     "Composite filters ask their children: And all, Or any, Not the opposite."],
    ["Symlink loops: remember visited directories.",
     "Permission denied: skip and report, don't crash.",
     "Very deep trees: iterative, not recursive.",
     "Case sensitivity in names and extensions: decide and say."],
    [["Specification plus Composite", "Small filters combine into any query"],
     ["Open-closed", "A new criterion is a new Filter class; the searcher never changes"],
     ["Iterator", "Results stream lazily"],
     ["Builder", "A readable way to assemble a query"]],
    "New criteria (owner, permissions), parallel search across subtrees, a result limit.",
    '''
    from abc import ABC, abstractmethod

    class File:
        def __init__(self, name: str, size: int): ...
        @property
        def extension(self) -> str: ...

    class Filter(ABC):
        @abstractmethod
        def matches(self, f: File) -> bool: ...

    class SizeGreater(Filter):
        def __init__(self, n: int): ...
        def matches(self, f): ...

    class And(Filter):
        def __init__(self, *parts: Filter): ...
        def matches(self, f): ...

    class FileSearcher:
        def search(self, root, flt: Filter): ...
    ''',
    drill="part 3, File management."))

part = {"tab": "lld", "id": "lld-top10", "n": 0.5, "one": True,
        "title": "The ten Amazon asks, as patterns",
        "minutes": 60,
        "lead": "The ten LLD questions Amazon candidates actually reported, one tab each: what to clarify and the usual answers, the classes and a class map, the core flow, the edge cases to raise, the pattern and SOLID idea that carry it, the likely extension, and a skeleton. The first tab groups them into five shapes, so a new question starts from a shape you already know.",
        "sections": S}

head = ("/* Amazon loop, LLD part 0.5: the ten most reported Amazon LLD questions as cheat sheets. Generated by\n"
        "   interviews/coding/amazon_lld_top10_gen.py; edit that, not this file. Every skeleton runs under Python 3.12. */\n"
        "window.LOOP_CODING = window.LOOP_CODING || { parts: [] };\n")
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write(head + "window.LOOP_CODING.parts.push(" + json.dumps(part, ensure_ascii=False, indent=1) + ");\n")
print("wrote", OUT)
