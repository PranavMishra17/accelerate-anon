"""Elevator system. A drill in the Locker shape: ElevatorController, Elevator, Request and two enums; one step() advances time.
Dispatch in three tiers (moving towards, nearest idle, nearest), movement as SCAN inside Elevator.step."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the controller: dispatch ----
REQUEST_ELEVATOR = method('''
    def request_elevator(self, floor: int, kind: RequestType) -> int:
        """
        Core logic:
          1. Check the floor, and that a hall call has a direction
          2. Wrap it in a Request
          3. Pick the best elevator for it
          4. Give that elevator the request, return its id
        Edge cases:
          1. Floor outside the building -> error
          2. DESTINATION from a hall button -> error: hall buttons are up or down
        """
        self._check_floor(floor)                           # Edge 1
        if kind is RequestType.DESTINATION:                # Edge 2: only a rider inside picks a destination
            raise ElevatorError("a hall call is up or down")
        request = Request(floor, kind)                     # Step 2: the floor and why we stop there, as one value
        best = self._select_best_elevator(request)         # Step 3: the higher logic, named now, written next
        best.add_request(request)                          # Step 4: the elevator owns its requests from here
        return best.elevator_id
''')

SELECT_BEST = method('''
    def _select_best_elevator(self, request: Request) -> Elevator:
        """
        Core logic:
          1. An elevator already moving towards the floor, the same way the caller wants to go
          2. Else the nearest idle elevator
          3. Else the nearest elevator of all; it gets there after its current trip
        Edge cases:
          1. Every tier can come back empty except the last, so the last always answers
        """
        best = self._find_moving_towards(request)          # Tier 1: it is coming anyway, so the wait is shortest
        if best is None:
            best = self._find_nearest_idle(request.floor)  # Tier 2: free now
        if best is None:
            best = self._find_nearest(request.floor, self.elevators)   # Tier 3: everyone is busy; never refuse a call
        return best
''')

FIND_MOVING = method('''
    def _find_moving_towards(self, request: Request) -> Elevator | None:
        """
        Core logic:
          1. Scan every elevator moving the way the caller wants to go
          2. Keep it only if it hasn't passed the floor yet
          3. And only if it has a stop at or beyond the floor, so it won't turn around before reaching it
          4. Track the closest one and return it: one pass, O(n)
        Edge cases:
          1. None qualifies -> None, and the next tier runs
        """
        want = request.heading()                           # UP for a PICKUP_UP call, DOWN for PICKUP_DOWN
        closest = None
        for e in self.elevators:                           # Step 1
            if e.direction is not want:
                continue
            not_passed = e.floor <= request.floor if want is Direction.UP else e.floor >= request.floor
            if not not_passed:                             # Step 2: already gone by
                continue
            if not e.has_stops_at_or_beyond(request.floor, want):   # Step 3: it would reverse first
                continue
            if closest is None or abs(e.floor - request.floor) < abs(closest.floor - request.floor):
                closest = e                                # Step 4: strictly closer, so the lower id wins a tie
        return closest
''')

PRESS_FLOOR = method('''
    def press_floor(self, elevator_id: int, floor: int) -> None:
        """
        Core logic:
          1. Check the floor and the elevator
          2. Add a DESTINATION request to that elevator
        Edge cases:
          1. Floor outside the building -> error
          2. Unknown elevator -> error
        """
        self._check_floor(floor)                           # Edge 1
        if not 0 <= elevator_id < len(self.elevators):     # Edge 2: ids are list positions, so check the range
            raise ElevatorError(f"no elevator {elevator_id}")
        # Step 2: no choosing, the rider is already inside; a destination stops whichever way the car is going
        self.elevators[elevator_id].add_request(Request(floor, RequestType.DESTINATION))
''')

CTRL_STEP = method('''
    def step(self) -> None:
        """
        Core logic:
          1. Every elevator takes its own step, in the same tick
        Edge cases:
          1. An elevator with nothing to do stays where it is (inside Elevator.step)
        """
        for e in self.elevators:                           # the controller only iterates; elevators own movement
            e.step()
''')

CTRL_HELPERS = method('''
    def _find_nearest_idle(self, floor: int) -> Elevator | None:
        idle = [e for e in self.elevators if e.direction is Direction.IDLE]
        return self._find_nearest(floor, idle)             # same rule as tier 3, on fewer elevators

    def _find_nearest(self, floor: int, elevators: list) -> Elevator | None:
        # closest by floors; min keeps the first on a tie (lowest id), default=None for an empty list
        return min(elevators, key=lambda e: abs(e.floor - floor), default=None)

    def _check_floor(self, floor: int) -> None:
        if not 0 <= floor < self.floors:                   # floors are numbered 0 to floors - 1
            raise ElevatorError(f"no floor {floor}")

    def status(self) -> str:
        # "0@3U" = elevator 0 at floor 3 going up (U, D, or I for idle); one entry per elevator
        return " ".join(f"{e.elevator_id}@{e.floor}{e.direction.name[0]}" for e in self.elevators)
''')

# ---- the elevator: movement ----
ELEV_STEP = method('''
    def step(self) -> None:
        """
        Core logic:
          1. No requests: go idle and stay
          2. Idle with requests: point towards the nearest request
          3. A request on this floor that this trip serves: open the doors, remove it, stay this tick
          4. Nothing ahead in this direction: reverse, stay this tick
          5. Otherwise move one floor
        Edge cases:
          1. Top and bottom floors need no check: nothing is ever ahead there, so step 4 turns the car
          2. A down call passed on the way up waits for the way back (SCAN)
        """
        if not self.requests:                              # Step 1
            self.direction = Direction.IDLE
            return
        if self.direction is Direction.IDLE:               # Step 2: the only time direction is chosen fresh
            self.direction = self._direction_to_nearest()
        if self._stop_here():                              # Step 3: stopping is direction-aware
            if not self.requests:                          # that was the last one, so rest here
                self.direction = Direction.IDLE
            return
        if not self.has_requests_ahead(self.direction):    # Step 4: travelling is not; any request ahead keeps us going
            self.direction = Direction.DOWN if self.direction is Direction.UP else Direction.UP
            return
        self.floor += self.direction.value                 # Step 5: +1 up, -1 down
''')

ELEV_HELPERS = method('''
    def _direction_to_nearest(self) -> Direction:
        # nearest request; on a tie the lower floor, so a run is the same every time (a set has no order)
        nearest = min(self.requests, key=lambda r: (abs(r.floor - self.floor), r.floor))
        if nearest.floor > self.floor:
            return Direction.UP
        if nearest.floor < self.floor:
            return Direction.DOWN
        # it is on this floor: face the way the caller wants to go, so step 3 serves it now
        return nearest.heading() if nearest.heading() is not Direction.IDLE else Direction.UP

    def _stop_here(self) -> bool:
        """Serve the requests on this floor that match the trip. True if the doors open."""
        here = {r for r in self.requests if r.floor == self.floor and r.serves(self.direction)}
        self.requests -= here                              # served, so forget them
        return bool(here)

    def has_requests_ahead(self, direction: Direction) -> bool:
        if direction is Direction.UP:
            return any(r.floor > self.floor for r in self.requests)
        return any(r.floor < self.floor for r in self.requests)

    def has_stops_at_or_beyond(self, floor: int, direction: Direction) -> bool:
        """Will this elevator keep going this way at least as far as floor? Tier 1 of dispatch asks."""
        if direction is Direction.UP:
            return any(r.floor >= floor for r in self.requests)
        return any(r.floor <= floor for r in self.requests)
''')

HEAD = D('''\
    from dataclasses import dataclass
    from enum import Enum


    class Direction(Enum):
        UP = 1                       # the values are floor steps: floor += direction.value moves the car
        DOWN = -1
        IDLE = 0


    class RequestType(Enum):
        PICKUP_UP = "up"             # hall button: someone on a floor wants to go up
        PICKUP_DOWN = "down"         # hall button: wants to go down
        DESTINATION = "dest"         # car button: a rider inside picked this floor; no direction


    class ElevatorError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

REQUEST = D('''\


    @dataclass(frozen=True)              # frozen gives == and a hash, so a Request can live in a set
    class Request:
        """A stop an elevator owes: a floor, and why it stops there."""
        floor: int
        kind: RequestType

        def heading(self) -> Direction:
            """Which way the caller wants to go. A destination has none."""
            if self.kind is RequestType.PICKUP_UP:
                return Direction.UP
            if self.kind is RequestType.PICKUP_DOWN:
                return Direction.DOWN
            return Direction.IDLE

        def serves(self, direction: Direction) -> bool:
            """Does stopping here help, for a car going this way? A rider getting off: always."""
            return self.kind is RequestType.DESTINATION or self.heading() is direction
    ''')

ELEVATOR = D('''\


    class Elevator:
        """One car. It moves itself; it does not know about other cars or who called it."""

        def __init__(self, elevator_id: int, floor: int = 0):
            self.elevator_id = elevator_id   # the controller returns it to say which car is coming
            self.floor = floor               # where the car is now
            self.direction = Direction.IDLE  # which way it is travelling; IDLE when nothing is left
            self.requests = set()            # Request objects; a set, so a double press adds nothing

        def add_request(self, request: Request) -> None:
            self.requests.add(request)
    ''')

CONTROLLER = D('''\


    class ElevatorController:
        """The entry point: chooses an elevator for each hall call and runs the clock."""

        def __init__(self, elevators: int, floors: int):
            self.floors = floors                                      # every request is checked against it
            self.elevators = [Elevator(i) for i in range(elevators)]  # all start idle at floor 0; id = list position
    ''')

CORE = (HEAD + REQUEST + ELEVATOR + in_class(ELEV_STEP, ELEV_HELPERS)
        + CONTROLLER + in_class(REQUEST_ELEVATOR, SELECT_BEST, FIND_MOVING, PRESS_FLOOR, CTRL_STEP, CTRL_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    c = ElevatorController(elevators=2, floors=10)
    c.elevators[1].floor = 6                      # park elevator 1 at floor 6, idle
    c.press_floor(0, 8)                           # a rider in elevator 0 wants floor 8
    c.step()
    c.step()
    print(c.status())                             # 0 is climbing (at 2), 1 is idle at 6
    # tier 1: 0 is moving up, below 5, with a stop at 8 beyond it; it wins over idle 1, which is nearer
    print("up call from 5 goes to", c.request_elevator(5, RequestType.PICKUP_UP))
    # nobody is moving down, so tier 2: the nearest idle elevator
    print("down call from 4 goes to", c.request_elevator(4, RequestType.PICKUP_DOWN))
    for _ in range(3):
        c.step()
    print(c.status())                             # 0 reached 5; 1 came down to 4, served the call, now idle

    # SCAN with one car: a down call passed on the way up is served on the way back
    s = ElevatorController(elevators=1, floors=10)
    s.press_floor(0, 8)
    s.step()
    s.request_elevator(4, RequestType.PICKUP_DOWN)
    for _ in range(4):
        s.step()
    print(s.status())                             # at 5 going up: it went past 4 without stopping
    for _ in range(10):
        s.step()
    print(s.status())                             # up to 8, turned, back down to 4, now idle there
    for bad in (lambda: c.request_elevator(12, RequestType.PICKUP_UP),
                lambda: c.request_elevator(3, RequestType.DESTINATION)):
        try:
            bad()
        except ElevatorError as e:
            print(e)
    ''')
DEMO_OUT = ("0@2U 1@6I\nup call from 5 goes to 0\ndown call from 4 goes to 1\n0@5U 1@4I\n"
            "0@5U\n0@4I\nno floor 12\na hall call is up or down\n")

# ---- extensions ----
EXT_CANCEL = D('''\
    class Elevator:
        ...

        def remove_request(self, request: Request) -> bool:
            """The inverse of add_request. Request is a value with ==, so an equal one finds it."""
            if request not in self.requests:
                return False
            self.requests.remove(request)
            return True              # step() needs no change: it reads whatever requests are left
    ''')

EXT_EXPRESS = D('''\
    class Elevator:
        def __init__(self, elevator_id: int, floor: int = 0, stops_at: set | None = None):
            ...
            self.stops_at = stops_at         # None means every floor; an express car serves a few

        def can_stop_at(self, floor: int) -> bool:
            return self.stops_at is None or floor in self.stops_at


    class ElevatorController:
        def _select_best_elevator(self, request: Request) -> Elevator:
            able = [e for e in self.elevators if e.can_stop_at(request.floor)]   # the one new line
            best = self._find_moving_towards(request, able)                       # each finder now takes the list
            ...
    ''')

EXT_LOCK = D('''\
    from threading import Lock


    class ElevatorController:
        def __init__(self, elevators: int, floors: int):
            ...
            self.lock = Lock()

        def request_elevator(self, floor: int, kind: RequestType) -> int:
            with self.lock:              # a call can't land while a tick is moving the cars
                ...

        def step(self) -> None:
            with self.lock:
                for e in self.elevators:
                    e.step()
    ''')

# the final file: core + cancel + express cars
F_ELEVATOR = D('''\


    class Elevator:
        """One car. It moves itself; it does not know about other cars or who called it."""

        def __init__(self, elevator_id: int, floor: int = 0, stops_at: set | None = None):
            self.elevator_id = elevator_id
            self.floor = floor
            self.direction = Direction.IDLE
            self.requests = set()            # Request objects
            self.stops_at = stops_at         # None = every floor; an express car serves only these

        def add_request(self, request: Request) -> None:
            self.requests.add(request)

        def remove_request(self, request: Request) -> bool:
            if request not in self.requests:
                return False
            self.requests.remove(request)    # step() reads whatever is left, so nothing else changes
            return True

        def can_stop_at(self, floor: int) -> bool:
            return self.stops_at is None or floor in self.stops_at
    ''')

F_CONTROLLER = D('''\


    class ElevatorController:
        """The entry point: chooses an elevator for each hall call and runs the clock."""

        def __init__(self, elevators: list, floors: int):
            self.floors = floors
            self.elevators = elevators       # built by the caller now, since cars differ (express or not)
    ''')

F_REQUEST_ELEVATOR = method('''
    def request_elevator(self, floor: int, kind: RequestType) -> int:
        """Same steps as before."""
        self._check_floor(floor)
        if kind is RequestType.DESTINATION:
            raise ElevatorError("a hall call is up or down")
        request = Request(floor, kind)
        best = self._select_best_elevator(request)
        if best is None:                                   # new edge: no car stops at this floor at all
            raise ElevatorError(f"no elevator stops at {floor}")
        best.add_request(request)
        return best.elevator_id
''')

F_SELECT_BEST = method('''
    def _select_best_elevator(self, request: Request) -> Elevator | None:
        able = [e for e in self.elevators if e.can_stop_at(request.floor)]   # the express change lives here
        best = self._find_moving_towards(request, able)
        if best is None:
            best = self._find_nearest([e for e in able if e.direction is Direction.IDLE], request.floor)
        if best is None:
            best = self._find_nearest(able, request.floor)
        return best
''')

F_FIND_MOVING = method('''
    def _find_moving_towards(self, request: Request, elevators: list) -> Elevator | None:
        want = request.heading()
        closest = None
        for e in elevators:
            if e.direction is not want:
                continue
            not_passed = e.floor <= request.floor if want is Direction.UP else e.floor >= request.floor
            if not not_passed or not e.has_stops_at_or_beyond(request.floor, want):
                continue
            if closest is None or abs(e.floor - request.floor) < abs(closest.floor - request.floor):
                closest = e
        return closest
''')

F_REST = method('''
    def cancel(self, elevator_id: int, floor: int, kind: RequestType) -> bool:
        """A rider changes their mind. An equal Request finds the stored one."""
        return self.elevators[elevator_id].remove_request(Request(floor, kind))

    def press_floor(self, elevator_id: int, floor: int) -> None:
        self._check_floor(floor)
        if not self.elevators[elevator_id].can_stop_at(floor):   # an express car refuses a floor it skips
            raise ElevatorError(f"elevator {elevator_id} does not stop at {floor}")
        self.elevators[elevator_id].add_request(Request(floor, RequestType.DESTINATION))

    def step(self) -> None:
        for e in self.elevators:
            e.step()

    def _find_nearest(self, elevators: list, floor: int) -> Elevator | None:
        return min(elevators, key=lambda e: abs(e.floor - floor), default=None)

    def _check_floor(self, floor: int) -> None:
        if not 0 <= floor < self.floors:
            raise ElevatorError(f"no floor {floor}")

    def status(self) -> str:
        return " ".join(f"{e.elevator_id}@{e.floor}{e.direction.name[0]}" for e in self.elevators)
''')

FINAL = (HEAD + REQUEST + F_ELEVATOR + in_class(ELEV_STEP, ELEV_HELPERS)
         + F_CONTROLLER + in_class(F_REQUEST_ELEVATOR, F_SELECT_BEST, F_FIND_MOVING, F_REST))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    c = ElevatorController([Elevator(0), Elevator(1, stops_at={0, 5, 9})], floors=10)   # 1 is an express car
    c.elevators[1].floor = 5
    print("up call from 3 goes to", c.request_elevator(3, RequestType.PICKUP_UP))   # 1 is nearer but skips 3
    print("up call from 5 goes to", c.request_elevator(5, RequestType.PICKUP_UP))   # 1 is idle at 5
    try:
        c.press_floor(1, 7)
    except ElevatorError as e:
        print(e)
    c.press_floor(0, 6)
    print("cancel 6:", c.cancel(0, 6, RequestType.DESTINATION), "again:", c.cancel(0, 6, RequestType.DESTINATION))
    for _ in range(6):
        c.step()
    print(c.status())
    ''')
FINAL_OUT = ("up call from 3 goes to 0\nup call from 5 goes to 1\nelevator 1 does not stop at 7\n"
             "cancel 6: True again: False\n0@3I 1@5I\n")


PROBLEM = {
    "id": "elevator", "title": "Elevator system", "part_id": "lld-elevator", "n": 6,
    "part_title": "Elevator system", "minutes": 45,
    "lead": "An elevator round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. A deterministic simulation: one step() moves every elevator one tick. Dispatch is three tiers; movement is SCAN inside the elevator. Implementation starts with the most interesting method and names its helpers before writing them.",
    "prompt": "Design an elevator system for a building.",
    "evidence": "roundz May 2025 (SDE2, LLD round, priority follow-up); PracHub Oct 2025 (onsite).",
    "drill": "part 6, Elevator system.",

    "clarify": {
        "capabilities": [("How many elevators and floors?", "Three elevators and ten floors, 0 to 9; keep both as parameters"),
                         ("What kinds of request are there?", "A hall call is a floor and up or down; a car call is a destination floor pressed inside"),
                         ("Who decides which elevator answers a hall call?", "The system; nobody picks an elevator by hand")],
        "errors": [("A floor that doesn't exist?", "Reject it"),
                   ("A hall call for the floor the elevator is already on?", "Serve it: the doors open"),
                   ("Weight limits, jammed doors, an emergency stop?", "Out of scope")],
        "scope": [("How does time work? Threads or a real clock?", "Neither: a step() method advances every elevator one tick, so a run is deterministic"),
                  ("A display or a user interface?", "No: print each elevator's floor and direction")],
    },
    "clarify_hint": "Elevators and floors, the two kinds of button, who picks the elevator. A floor that doesn't exist, a call on the current floor, weight and jams. How time works, and a display.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The two kinds of button come first, because a hall call has a direction and a car call doesn't, and that changes when the elevator stops. Then bad floors, and last how time works, since a tick method makes the whole thing easy to trace.",
    "clarify_why": "Every question changes a class or a method. The two buttons give request_elevator and press_floor, and the direction on a hall call is why Request becomes a class. The tick question makes the whole system deterministic and easy to trace on a whiteboard.",
    "answers": "Three elevators and ten floors, kept as parameters. A hall call is a floor and up or down; a car call is a destination floor. The system picks the elevator. A floor outside the building is rejected; a call on the current floor is served. No weight, jams or emergency stop. Time is a step() method that moves every elevator one tick, with no threads. No display or UI.",
    "playback": ["Thanks, that's clear. **So: hall calls with a direction, car calls without one, the system picks the elevator, and one step() moves everything one tick.** An elevator stops only for calls going its way and turns when nothing is ahead. Out of scope: weight, jams, emergency stop, a UI, threads."],

    "requirements": [
        ["Someone presses up or down on a floor.", "The system picks the best elevator and gives it the request", "Returns the elevator's id; an error for a floor that doesn't exist"],
        ["A rider inside presses a floor.", "That elevator gets a destination request", "An error for a bad floor or a bad elevator"],
        ["Time advances with step().", "Each elevator stops for requests that match its direction, keeps going while requests are ahead, turns when none are, and goes idle when it has none"],
        ["Anyone can read each elevator's floor and direction."],
    ],
    "out_of_scope": ["weight and capacity", "door mechanics", "an emergency stop", "a display or UI", "threads and a real clock"],
    "req_hint": "A hall call, a car call, time passing, reading the state.",
    "req_say": "From your answers I get four requirements. **Each is something that happens, and each becomes a method: request_elevator, press_floor, step, status.** Requirement 3 is the hard one: stop only for calls going my way, keep going while there is work ahead.",
    "req_why": "Each requirement maps to a method: 1 is request_elevator, 2 is press_floor, 3 is the controller's step and Elevator.step, 4 is status.",

    "entities": [("Building", False, "Only the number of floors matters; it is a parameter"),
                 ("Elevator", True, "Has a floor, a direction and the requests it owes, and moves itself"),
                 ("Elevator controller", True, "Picks an elevator for each hall call and runs the tick"),
                 ("Request", True, "A floor and a type (up, down or destination); the type decides whether a passing elevator stops"),
                 ("Floor", False, "No behaviour; an int"),
                 ("Door, button, display", False, "No behaviour in this scope: doors are one tick, buttons are method calls"),
                 ("Rider", False, "External; not modelled")],
    "ent_hint": "What does a request need to carry? Does an elevator going up stop for someone who wants to go down?",
    "ent_say": "I underline the nouns. **The elevator, the controller and the request stay.** A request looks like only a floor, but it also carries a type, up, down or destination, and the elevator needs that to decide whether to stop on the way. A floor is an int, and doors and buttons do nothing in this scope.",
    "ent_why": "Three classes and two enums. Request earns its class because stopping depends on its type: going up, an elevator stops for an up call or a destination, never for a down call.",

    "classes": [
        {"name": "ElevatorController", "state": ["floors: int  # every request is checked against it",
                                                "elevators: Elevator[]  # dispatch scans these; step moves each"],
         "behaviour": ["request_elevator(floor, type) -> elevator id | error  # req 1: a hall call",
                       "press_floor(elevator_id, floor) -> void | error  # req 2: a button inside",
                       "step() -> void  # req 3: one tick for every elevator",
                       "status() -> string  # req 4",
                       "_select_best_elevator(request) -> Elevator  # three tiers, each a finder"]},
        {"name": "Elevator", "state": ["elevator_id: int  # what request_elevator returns",
                                       "floor: int  # where it is now",
                                       "direction: Direction  (UP, DOWN, IDLE -> enum)  # which way it travels",
                                       "requests: Set<Request>  # what it owes; a set, so a double press adds nothing"],
         "behaviour": ["add_request(request) -> void  # dispatch and press_floor land here",
                       "step() -> void  # req 3: SCAN, the elevator moves itself",
                       "has_requests_ahead(direction) -> bool  # step: keep going or turn",
                       "has_stops_at_or_beyond(floor, direction) -> bool  # dispatch: will it really reach the caller"]},
        {"name": "Request", "state": ["floor: int",
                                      "kind: RequestType  (PICKUP_UP, PICKUP_DOWN, DESTINATION -> enum)  # why it stops there"],
         "behaviour": ["heading() -> Direction  # which way the caller wants to go",
                       "serves(direction) -> bool  # does a car going this way stop for it"]},
    ],
    "class_hint": "The controller holds the elevators. An elevator holds where it is, which way it is going and a set of requests. A request is a floor plus a type.",
    "class_say": "**I start from the methods and ask what each one has to read.** A hall call has to choose among elevators, so the controller keeps the list. Step has to know where the elevator is, which way it is going and what it owes, so those three are its state. And to stop only for calls going its way, each stop has to remember its type, so the stops are Request objects, not floors.",
    "class_why": "The controller decides which elevator; the elevator decides how it moves. A frozen dataclass gives Request equality and a hash, so the set of requests ignores a double press and cancelling is a plain remove.",
    "class_qa": [{"ask": "Why does the elevator move itself, and not the controller?",
                  "say": "Because moving only needs one elevator's floor, direction and requests. **The controller decides which elevator; the elevator decides how it gets there.** That is why a new dispatch rule never touches movement.",
                  "explain": ["The controller's step is a for loop; Elevator.step holds the SCAN logic."]},
                 {"ask": "Why is hall-call type an enum of three and not a Direction?",
                  "say": "Because Direction has IDLE, and nobody presses an idle button. **RequestType says exactly what was pressed: up, down, or a floor inside.** heading() turns it into a Direction when the elevator needs one."}],

    "map": {"center": ("ElevatorController", "request_elevator, step"),
            "owned": [("Elevator", "floor, direction, step"), ("Request", "floor, kind, serves")],
            "uses": [("Direction (enum)", "UP, DOWN, IDLE"), ("RequestType (enum)", "UP, DOWN, DESTINATION")]},

    "skeleton": {"q": "First the small pieces: the two enums, the error, Request, Elevator's __init__ and add_request, and the controller's __init__.",
                 "hint": "Request is a frozen dataclass with heading() and serves(). Elevator holds its floor, direction and a set of requests. The controller holds the floor count and the elevators.",
                 "code": HEAD + REQUEST + ELEVATOR + CONTROLLER,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "request_elevator", "q": "Start with the most interesting method: request_elevator(floor, type). Core logic and edge cases as comments, then the code. Name the hard part as a helper.",
         "hint": "Check the floor and the type, build a Request, best = self._select_best_elevator(request), add it, return the id.", "code": REQUEST_ELEVATOR,
         "why": "Four lines of real work. Choosing the elevator is the higher logic, so it gets a name here and its own method next."},
        {"name": "_select_best_elevator", "q": "_select_best_elevator(request): which elevator should answer? Write the tiers, each as a named finder.",
         "hint": "Moving towards the floor the same way, else the nearest idle, else the nearest of all.", "code": SELECT_BEST,
         "why": "It reads like the rule you would say out loud. Each tier is one finder, so a new rule is a new tier."},
        {"name": "_find_moving_towards", "q": "_find_moving_towards(request): the interesting finder. Which moving elevators qualify, and which one wins?",
         "hint": "Same direction as the caller, hasn't passed the floor, has a stop at or beyond it. Track the closest in one loop.", "code": FIND_MOVING,
         "why": "The third check is the one people miss: an elevator going up with no stop above the caller turns around before it gets there. One pass, O(n)."},
        {"name": "Elevator.step", "q": "Now the movement: Elevator.step(). One tick for one elevator.",
         "hint": "No requests: idle. Idle: face the nearest request. A matching request here: stop. Nothing ahead: reverse. Else move one floor.", "code": ELEV_STEP,
         "why": "This is SCAN. Stopping is direction-aware (serves), travelling is not (any request ahead keeps it going). The top and bottom floors need no special case."},
        {"name": "step", "q": "The controller's step(): what does one tick do?",
         "hint": "Every elevator takes its own step.", "code": CTRL_STEP,
         "why": "Two lines, because each elevator owns its movement."},
        {"name": "press_floor", "q": "press_floor(elevator_id, floor): the button inside an elevator.",
         "hint": "Check the floor and the elevator, add a DESTINATION request. Edges: bad floor, bad elevator.", "code": PRESS_FLOOR,
         "why": "No choosing: the rider already picked the elevator by getting in. A destination stops the elevator whichever way it is going."},
    ],
    "helpers": [
        {"q": "Elevator's helpers: _direction_to_nearest, _stop_here, has_requests_ahead, has_stops_at_or_beyond.",
         "hint": "Nearest request with ties to the lower floor. Remove the requests here that serve the direction. Any request above or below. Any request at or past a floor.",
         "code": ELEV_HELPERS,
         "why": "Each is a few lines of comparison. The tie-break matters: a set has no order, so without it two runs could differ."},
        {"q": "The controller's helpers: _find_nearest_idle, _find_nearest, _check_floor and status.",
         "hint": "Idle elevators, then the nearest of a list (None if empty). Floor between 0 and floors minus one.",
         "code": CTRL_HELPERS,
         "why": "_find_nearest serves tiers 2 and 3, so the nearest rule lives in one place."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "The controller chooses an elevator, the elevator moves, the request knows whether it is served by a direction."),
            ("Open/closed", "A new dispatch rule is a new tier or finder in _select_best_elevator. Elevator.step is not edited."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses. An express car is the same Elevator with stops_at set."),
            ("Interface segregation", "Nothing to segregate yet: no interfaces."),
            ("Dependency inversion", "Not needed at this size. Once dispatch rules multiply, the controller is handed a dispatcher object."),
        ],
        "varies": [
            ("The dispatch rule (express, priority, rush hour)", "Strategy, once there are two rules", "today three tiers in _select_best_elevator"),
            ("The movement rule (SCAN, LOOK, first come)", "Strategy, only if asked", "today one Elevator.step"),
            ("Elevator in service, maintenance or fire mode", "State, if each state moves differently", "today direction alone"),
            ("Two calls at once on real threads", "No pattern: a lock", "one Lock around request_elevator and step"),
        ],
    },
    "extensions": [
        {"ask": "A rider cancels a floor they pressed.",
         "say": "A remove_request on Elevator, the inverse of add_request. **Because Request is a value with equality, an equal Request finds the stored one,** and step needs no change since it reads whatever is left.",
         "code": EXT_CANCEL, "code_title": "Cancel a request",
         "short_q": "Cancel a floor", "short_a": "Elevator.remove_request; an equal Request finds it; step unchanged"},
        {"ask": "Add express elevators that serve only floors 0, 5 and 9.",
         "say": "The elevator gets the set of floors it stops at. **Dispatch filters to elevators that can stop at the floor, then runs the same three tiers,** and press_floor refuses a floor the car skips. Movement doesn't change.",
         "code": EXT_EXPRESS, "code_title": "Express elevators",
         "short_q": "Express cars", "short_a": "stops_at on Elevator; dispatch filters by can_stop_at, then the same tiers"},
        {"ask": "Calls come in from many threads at once.",
         "say": "The simple answer is one lock around request_elevator and step, so a call can't land halfway through a tick. **If that blocks too much, calls go into a thread-safe queue that step drains at the start of each tick.**",
         "code": EXT_LOCK, "code_title": "One lock",
         "short_q": "Concurrent calls", "short_a": "one Lock around request_elevator and step; or a queue step drains each tick"},
        {"ask": "Fire alarm: every elevator goes to the ground floor.",
         "say": "A recall method that replaces every elevator's requests with one destination at floor 0. **Elevator.step already walks to its only request,** so movement doesn't change. Ignoring new calls during the alarm would need a mode on the elevator.",
         "short_q": "Fire mode", "short_a": "replace every elevator's requests with a destination at 0; step already goes there"},
    ],
    "faq": [("Why does an elevator going up pass a down call?", "Because the rider wants to go down. Stopping would open the doors for someone who can't get on going the right way. The elevator serves it on the way back, after it turns: that is SCAN."),
            ("Why does tier 1 check for a stop at or beyond the floor?", "An elevator going up to floor 3 is moving up, but a caller at floor 7 would wait while it turns at 3. The commitment check keeps tier 1 honest."),
            ("Real time and threads?", "Keep step() as the one place time moves. A real loop calls step() every second, and the lock goes around step and request_elevator.")],

    "summary": ["**Three classes and two enums.** The ElevatorController takes hall calls and picks an elevator in three tiers: one already coming the caller's way that will reach the floor, else the nearest idle, else the nearest. Each elevator holds a set of Requests and moves itself with SCAN: it stops for requests that match its direction, keeps going while any are ahead, turns when none are.",
                "**It extends in one place each time:** cancelling is remove_request, express cars are a filter before the tiers, threads are one lock, and a fire recall replaces the requests."],

    "golden": [
        ("Request is a class: a floor and a type. The type decides whether a passing elevator stops.", "without it an elevator going up stops for someone going down, which is the bug interviewers look for."),
        ("Dispatch reads as three tiers, each a named finder: moving towards, nearest idle, nearest.", "the high-level method says the rule out loud; the interesting finder is one O(n) loop."),
        ("Stopping is direction-aware, travelling is not.", "that one sentence is SCAN, and it is all of Elevator.step."),
        ("The controller's step is a loop; each elevator owns its own step.", "the controller chooses, the elevator moves, so a new dispatch rule never touches movement."),
        ("Tier 1 checks the elevator has a stop at or beyond the caller.", "otherwise the chosen elevator turns around before it arrives."),
        ("One step() moves everything one tick, with no threads and no real clock.", "the run is deterministic, so you can trace it by hand."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (cancel a request, express elevators), and a run at the bottom.",
    "final_title": "elevator.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the express car is nearer to 3 but doesn't stop there, so elevator 0 takes it; the express car takes 5, refuses 7; the cancel works once; both end idle.",
}
