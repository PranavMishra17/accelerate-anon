"""Elevator system. A drill in the Locker shape: Car, ElevatorSystem and a Direction enum; one step() advances time."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


REQUEST = method('''
    def request(self, floor: int, direction: Direction) -> int:
        """
        Core logic:
          1. Check the floor exists
          2. Choose a car for the hall call
          3. Add the floor to that car's stops
          4. Return the car's id
        Edge cases:
          1. Floor outside the building -> error
        """
        self._check_floor(floor)                           # Step 1 / Edge 1: refuse a floor that doesn't exist
        car = self._choose_car(floor, direction)           # Step 2: the one line a new dispatch policy replaces
        car.add_stop(floor)                                # Step 3: the car will stop here on its way
        return car.car_id                                  # Step 4: so the caller knows which car is coming
''')

SELECT_FLOOR = method('''
    def select_floor(self, car_id: int, floor: int) -> None:
        """
        Core logic:
          1. Check the floor exists
          2. Add it to that car's stops
        Edge cases:
          1. Floor outside the building -> error
          2. Unknown car -> error
        """
        self._check_floor(floor)                           # Step 1 / Edge 1
        if not 0 <= car_id < len(self.cars):               # Edge 2: car ids are list positions, so check the range
            raise ElevatorError(f"no car {car_id}")
        self.cars[car_id].add_stop(floor)                  # Step 2: no choosing, the rider is already in this car
''')

STEP = method('''
    def step(self) -> None:
        """
        Core logic:
          1. Advance every car by one tick
        Edge cases:
          1. A car with no stops stays where it is
        """
        for car in self.cars:                              # Step 1: all cars move in the same tick
            car.step()                                     # Edge 1 is handled inside Car.step
''')

STATUS = method('''
    def status(self) -> str:
        """
        Core logic:
          1. One short entry per car: id, floor, direction
        Edge cases:
          1. Idle cars show I
        """
        # "0@3I" = car 0 at floor 3, direction's first letter (U, D or I for idle); joined with spaces
        return " ".join(f"{c.car_id}@{c.floor}{c.direction.name[0]}" for c in self.cars)
''')

HELPERS = method('''
    def _check_floor(self, floor: int) -> None:
        if not 0 <= floor < self.floors:                   # floors are numbered 0 to floors - 1
            raise ElevatorError(f"no floor {floor}")

    def _choose_car(self, floor: int, direction: Direction) -> Car:
        """Idle cars, or cars coming towards this floor in the same direction; else any. Nearest wins, first car on a tie."""
        def can_pick_up(c: Car) -> bool:
            # idle, or going the same way with the floor still ahead: (distance to floor) x (direction sign) >= 0
            return c.direction is Direction.IDLE or (c.direction is direction and (floor - c.floor) * direction.value >= 0)
        candidates = [c for c in self.cars if can_pick_up(c)] or self.cars   # nobody suitable: any car, it gets there later
        # min keeps the first of equal distances, so the lowest car id wins a tie
        return min(candidates, key=lambda c: abs(c.floor - floor))
''')

HEAD = D('''\
    from enum import Enum


    class Direction(Enum):
        UP = 1                       # the values are floor steps: floor += direction.value moves the car
        DOWN = -1
        IDLE = 0                     # zero, so an idle car would not move even if asked


    class ElevatorError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

CAR = D('''\


    class Car:
        """One elevator car. It moves itself; it does not know about other cars or who called it."""

        def __init__(self, car_id: int, floor: int = 0):
            self.car_id = car_id             # the system returns it to say which car is coming
            self.floor = floor               # where the car is now
            self.direction = Direction.IDLE  # which way it moves next; IDLE when nothing is left to do
            self.stops = set()               # floors this car must stop at; a set, so a double press adds nothing

        def add_stop(self, floor: int) -> None:
            self.stops.add(floor)

        def step(self) -> None:
            """One tick: open the doors if we are at a stop, else move one floor towards the next one."""
            if self.floor in self.stops:
                self.stops.remove(self.floor)        # doors open for this tick
                if not self.stops:                   # that was the last stop, so rest
                    self.direction = Direction.IDLE
                return                               # opening the doors uses the whole tick
            if not self.stops:                       # nothing to do: stay put
                return
            self.direction = self._pick_direction()
            self.floor += self.direction.value       # +1 up, -1 down: one floor per tick

        def _pick_direction(self) -> Direction:
            """Keep going while there are stops ahead (the SCAN idea); otherwise turn towards the nearest one."""
            # a stop is ahead when (distance) x (direction sign) is positive; an idle car has sign 0, so none is ahead
            ahead = [s for s in self.stops if (s - self.floor) * self.direction.value > 0]
            if ahead:                                # keep going: don't reverse while riders are waiting ahead
                return self.direction
            nearest = min(self.stops, key=lambda s: abs(s - self.floor))   # nothing ahead: turn to the closest stop
            return Direction.UP if nearest > self.floor else Direction.DOWN
    ''')

SYSTEM = D('''\


    class ElevatorSystem:
        def __init__(self, cars: int, floors: int):
            self.floors = floors                            # request and select_floor check a floor against it
            self.cars = [Car(i) for i in range(cars)]       # every car starts at floor 0; the id is its list position
    ''')

CORE = HEAD + CAR + SYSTEM + in_class(REQUEST, SELECT_FLOOR, STEP, STATUS, HELPERS)

DEMO = D('''\


    # ---- a quick run ----
    system = ElevatorSystem(cars=2, floors=10)
    system.cars[1].floor = 9                      # park car 1 at the top, so car 0 is clearly nearer to floor 3
    print("call from 3 goes to car", system.request(3, Direction.UP))
    for _ in range(4):                            # 3 ticks to climb to floor 3, 1 tick with the doors open
        system.step()
    print(system.status())                        # car 0 is at 3 with its doors open
    system.select_floor(0, 6)                     # the rider gets in and presses 6
    for _ in range(4):                            # 3 ticks up to 6, 1 tick with the doors open
        system.step()
    print(system.status())
    try:
        system.request(12, Direction.DOWN)        # the building has floors 0 to 9
    except ElevatorError as e:
        print(e)
    system.step()                                 # no stops anywhere, so nothing moves
    print(system.status())
    ''')
DEMO_OUT = "call from 3 goes to car 0\n0@3I 1@9I\n0@6I 1@9I\nno floor 12\n0@6I 1@9I\n"

# ---- extensions ----
EXT_STRATEGY = D('''\
    def nearest_car(cars: list, floor: int, direction: Direction) -> Car:
        """The old _choose_car, now a plain function. Priority or express cars are another function like it."""
        def can_pick_up(c: Car) -> bool:
            # idle, or going the same way with the floor still ahead
            return c.direction is Direction.IDLE or (c.direction is direction and (floor - c.floor) * direction.value >= 0)
        candidates = [c for c in cars if can_pick_up(c)] or cars
        return min(candidates, key=lambda c: abs(c.floor - floor))    # nearest wins, first car on a tie


    class ElevatorSystem:
        def __init__(self, cars: int, floors: int, choose=nearest_car):
            ...
            self.choose = choose                 # was the method _choose_car; any function with this signature fits

        def request(self, floor: int, direction: Direction) -> int:
            ...
            car = self.choose(self.cars, floor, direction)    # was self._choose_car(floor, direction)
    ''')

EXT_RECALL = D('''\
    class ElevatorSystem:
        ...

        def recall(self) -> None:
            """Emergency: forget every stop and send every car to the ground floor."""
            for car in self.cars:
                car.stops = {0}          # replaces the set; Car.step already walks to its nearest (only) stop
    ''')

FINAL_REQUEST = method('''
    def request(self, floor: int, direction: Direction) -> int:
        """Same steps; the strategy picks the car."""
        self._check_floor(floor)
        car = self.choose(self.cars, floor, direction)     # whichever policy the system was given
        car.add_stop(floor)
        return car.car_id
''')

RECALL = method('''
    def recall(self) -> None:
        """Emergency: forget every stop and send every car to the ground floor."""
        for car in self.cars:
            car.stops = {0}                  # the old stops are dropped; Car.step does the walking
''')

FINAL_HELPERS = method('''
    def _check_floor(self, floor: int) -> None:
        if not 0 <= floor < self.floors:                   # floors are numbered 0 to floors - 1
            raise ElevatorError(f"no floor {floor}")
''')

NEAREST = D('''\


    def nearest_car(cars: list, floor: int, direction: Direction) -> Car:
        """The default dispatch policy: a plain function, so another policy is another function."""
        def can_pick_up(c: Car) -> bool:
            # idle, or going the same way with the floor still ahead
            return c.direction is Direction.IDLE or (c.direction is direction and (floor - c.floor) * direction.value >= 0)
        candidates = [c for c in cars if can_pick_up(c)] or cars   # nobody suitable: any car, it gets there later
        return min(candidates, key=lambda c: abs(c.floor - floor))   # nearest wins, first car on a tie
    ''')

FINAL_SYSTEM = D('''\


    class ElevatorSystem:
        def __init__(self, cars: int, floors: int, choose=nearest_car):
            self.floors = floors
            self.cars = [Car(i) for i in range(cars)]
            self.choose = choose             # (cars, floor, direction) -> Car; the system is given its policy
    ''')

FINAL = HEAD + CAR + NEAREST + FINAL_SYSTEM + in_class(FINAL_REQUEST, SELECT_FLOOR, STEP, STATUS, RECALL, FINAL_HELPERS)

FINAL_DEMO = D('''\


    # ---- a quick run ----
    def always_car_zero(cars, floor, direction):     # a stand-in policy: proves the system uses the function it is given
        return cars[0]


    system = ElevatorSystem(cars=2, floors=10, choose=always_car_zero)
    system.cars[1].floor = 9
    print("call from 8 goes to car", system.request(8, Direction.DOWN))   # car 1 is nearer, but the policy says car 0
    system.cars[1].stops.add(2)                      # car 1 gets a stop below, so it heads down
    system.step()
    print(system.status())                           # car 0 climbed to 1 (U); car 1 came down to 8 (D)
    system.recall()
    for _ in range(9):                               # 9 ticks is enough for the farthest car to reach floor 0
        system.step()
    print(system.status())
    ''')
FINAL_OUT = "call from 8 goes to car 0\n0@1U 1@8D\n0@0I 1@0I\n"


PROBLEM = {
    "id": "elevator", "title": "Elevator system", "part_id": "lld-elevator", "n": 6,
    "part_title": "Elevator system", "minutes": 40,
    "lead": "An elevator round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. A deterministic simulation: one step() moves every car one tick. Two classes and an enum, then a swappable dispatch and an emergency recall. Try each box before you open the answer.",
    "prompt": "Design an elevator system for a building.",
    "evidence": "roundz May 2025 (SDE2, LLD round, priority follow-up); PracHub Oct 2025 (onsite).",
    "drill": "part 6, Elevator system.",

    "clarify": {
        "capabilities": [("How many cars and floors?", "Several cars and ten floors; both are parameters"),
                         ("What kinds of request are there?", "A hall call is a floor and a direction; a car call is a destination floor pressed inside"),
                         ("Who decides which car answers a hall call?", "The system: the nearest suitable car; expect a different policy later")],
        "errors": [("A floor that doesn't exist?", "Return an error"),
                   ("Does a car stop for floors on the way?", "Yes, if it is heading that way, it stops there first"),
                   ("Weight limits, jammed doors?", "No: one floor per tick, doors open for one tick")],
        "scope": [("How does time work? Threads or a real clock?", "Neither: a step() method advances every car one tick, so a run is deterministic"),
                  ("A display or a user interface?", "No: print each car's floor and direction")],
    },
    "clarify_hint": "Cars and floors, the two kinds of button, who picks the car. A floor that doesn't exist, stopping on the way, weight and jams. How time works, and a display.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** I ask about the two kinds of button first, because they become two methods. Then bad floors, and last how time works, since a tick method makes the whole thing easy to trace.",
    "clarify_why": "Every question changes a class or a method. The two buttons give request and select_floor. The tick question is the one that matters: a step() method makes the whole system deterministic and easy to trace on a whiteboard.",
    "answers": "Several cars and ten floors, both parameters. A hall call has a floor and a direction; a car call is a destination floor. The system picks the nearest suitable car. A floor outside the building returns an error. A car stops for requested floors on its way. No weight and no jams, one floor per tick, doors open for one tick. Time is a step() method that moves every car one tick, with no threads. No display or UI.",
    "playback": ["Thanks, that's clear. **So: hall calls and car calls, a nearest-car pick, SCAN-style stops, an error for a bad floor, and one step() that moves everything one tick.** Out of scope: weight, real speeds, doors that jam, a UI, threads."],

    "requirements": [
        ["Someone presses a hall button (a floor and a direction).", "The system chooses a car and adds the floor to its stops", "Returns the car's id, or an error if the floor doesn't exist"],
        ["A rider presses a floor inside a car.", "The system adds the floor to that car's stops", "An error if the floor or the car doesn't exist"],
        ["Time advances with step().", "Each car stops at its requested floors, keeps its direction while stops are ahead, then turns, and goes idle when none are left"],
        ["Anyone can read each car's floor and direction."],
    ],
    "out_of_scope": ["weight and capacity", "real speeds", "doors that jam", "a display or UI", "threads and a real clock"],
    "req_hint": "A hall call, a car call, time passing, reading the state.",
    "req_say": "From your answers I get four requirements. **Each one is something that happens, and each becomes a method: request, select_floor, step, status.** I say the error case with each one, like a floor that does not exist.",
    "req_why": "Each requirement maps to a method: 1 is request, 2 is select_floor, 3 is step and Car.step, 4 is status.",

    "entities": [("Building", False, "Only the number of floors matters; it is a parameter"),
                 ("Elevator car", True, "Has a floor, a direction and the floors it must stop at"),
                 ("Elevator system", True, "Routes hall calls and car calls and runs the tick"),
                 ("Request", False, "A hall call is just a floor and a direction, handed straight to a method"),
                 ("Door, button, display", False, "No behaviour in this scope: doors are one tick, buttons are method calls"),
                 ("Rider", False, "External; not modelled")],
    "ent_hint": "What does a request need to carry? Do doors and buttons do anything in this scope?",
    "ent_say": "I underline the nouns. **The car and the system carry data and behaviour, so they stay.** A request is only a floor and a direction passed to a method, and doors and buttons do nothing in this scope. A building is only a floor count, so it is a parameter.",
    "ent_why": "Two classes and one enum. Dropping Request, Door and Display is the move interviewers notice: nothing in the requirements gives them behaviour.",

    "classes": [
        {"name": "ElevatorSystem", "state": ["floors: int  # request and select_floor check a floor against it",
                                            "cars: Car[]  # request scans these to pick one; step moves each"],
         "behaviour": ["request(floor, direction) -> car id | error  # req 1: pick a car for a hall call",
                       "select_floor(car_id, floor) -> void | error  # req 2: a button inside a car",
                       "step() -> void  # req 3: advance every car one tick",
                       "status() -> string  # req 4: each car's floor and direction"]},
        {"name": "Car", "state": ["car_id: int  # request returns it; select_floor gets it",
                                  "floor: int  # where the car is now",
                                  "direction: Direction  (UP, DOWN, IDLE -> enum)  # decides which way step moves",
                                  "stops: Set<floor>  # a set, so pressing twice costs nothing"],
         "behaviour": ["add_stop(floor) -> void  # a call lands here once a car is chosen",
                       "step() -> void  # req 3: the car moves itself, not the system"]},
    ],
    "class_hint": "The system holds the cars and the building height. A car holds where it is, which way it is going and the floors it must stop at.",
    "class_say": "**I start from the four methods and ask what each one has to read.** A hall call has to choose among cars, so the system keeps a list of cars and the floor count to reject bad floors. Step moves a car, so a car needs its floor, its direction and the floors it must stop at. A set holds those stops, so a double press adds nothing.",
    "class_why": "A set of stops cannot hold duplicates, so pressing a button twice costs nothing. The car decides its own movement; the system only decides which car.",
    "class_qa": [{"ask": "Why does the car move itself, and not the system?",
                  "say": "Because moving is about one car's floor, direction and stops, and nothing else. **The system decides which car; the car decides how it gets there.** That is also why a new dispatch policy never touches movement.",
                  "explain": ["The tick is what makes it testable: ten calls to step() give the same result every run."]}],

    "map": {"center": ("ElevatorSystem", "request, select_floor, step"),
            "owned": [("Car", "floor, direction, stops")],
            "uses": [("Direction (enum)", "UP, DOWN, IDLE")]},

    "skeleton": {"q": "First the small pieces: Direction, ElevatorError, Car, and the system's __init__. Each line from the class design.",
                 "hint": "Car holds its floor, direction and a set of stops, and moves itself. The system holds the floor count and the list of cars.",
                 "code": HEAD + CAR + SYSTEM,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "request", "q": "request(floor, direction): core logic and edge cases as comments, then the code.",
         "hint": "Check the floor, choose a car, add the stop, return the id. Edge: bad floor.", "code": REQUEST,
         "why": "_check_floor and _choose_car are named here and written after. The choice of car is the line a new policy replaces."},
        {"name": "select_floor", "q": "select_floor(car_id, floor): the button inside a car.",
         "hint": "Check the floor and the car, add the stop. Edges: bad floor, bad car.", "code": SELECT_FLOOR,
         "why": "No choosing here: the rider already picked the car by getting into it."},
        {"name": "step", "q": "step(): what does one tick do?",
         "hint": "Every car takes its own step.", "code": STEP,
         "why": "Three lines, because Car.step owns the movement. The system never looks at floors here."},
        {"name": "status", "q": "status(): print each car's floor and direction.",
         "hint": "One short entry per car.", "code": STATUS,
         "why": "It makes the run visible, which is how you trace it on a whiteboard."},
    ],
    "helpers": {"q": "Now the helpers: _check_floor and _choose_car.",
                "starter": "def _check_floor(self, floor):\n    ...\n",
                "hint": "Floor between 0 and floors minus one. Idle cars and cars coming towards the floor the same way; nearest wins.",
                "code": HELPERS,
                "why": "Ties go to the first car, so the run is deterministic. If nothing is suitable the nearest car still takes the call and gets to it later."},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Car owns its floor, stops and movement in step(), ElevatorSystem chooses the car in request and select_floor."),
            ("Open/closed", "A new dispatch policy is a new function given to the system. request, step and Car are not edited."),
            ("Liskov substitution", "Any policy with the nearest_car signature works in place of it: (cars, floor, direction) returns a Car."),
            ("Interface segregation", "Nothing to segregate yet: no interfaces. A policy is one function."),
            ("Dependency inversion", "ElevatorSystem is handed choose instead of hard-coding nearest_car."),
        ],
        "varies": [
            ("Which car answers a call (priority, express)", "Strategy", "nearest_car passed in as choose; each policy is another function"),
            ("Car in service, out of service or full", "State, only if each state behaves differently", "today a status on Car would be enough"),
            ("Fire recall", "No pattern: a method", "recall() replaces every car's stops with floor 0"),
            ("Doors that hold open", "No pattern: a field", "a door counter on Car, no moving while open"),
        ],
    },
    "extensions": [
        {"ask": "Now add priority scheduling: some calls must be answered first, or a different policy altogether.",
         "say": "Only the choice of car changes. I turn _choose_car into a function the system is given, nearest_car by default. **Priority, express or rush-hour policies are more functions like it,** and request, step and Car don't change.",
         "code": EXT_STRATEGY, "code_title": "Dispatch passed in as a function",
         "short_q": "Priority or other policy", "short_a": "_choose_car becomes a function given to the system; each policy is another function"},
        {"ask": "Fire alarm: every car goes to the ground floor.",
         "say": "A recall method that replaces every car's stops with floor 0. **The car's own step does the rest,** because it already moves towards its nearest stop. Doors opening on the way would need a car state.",
         "code": EXT_RECALL, "code_title": "Emergency recall",
         "short_q": "Fire mode", "short_a": "recall() replaces every car's stops with the ground floor; Car.step already goes there"},
        {"ask": "A car goes into maintenance. Or a car is full.",
         "say": "A status on the car, in place of a bare direction: in service, out of service, full. **The dispatch skips cars that aren't in service,** and Car.step only checks the status. If states each get their own behaviour, they become State classes.",
         "short_q": "Maintenance or full car", "short_a": "a status on Car; dispatch skips cars not in service; State classes if each state differs"},
        {"ask": "Doors and a door-open button.",
         "say": "The doors open on the stop's tick today. I'd give the car a door state with a counter: open for N ticks, held open by the button, and a car doesn't move while the doors are open.",
         "short_q": "Doors that hold", "short_a": "a door state with a tick counter on Car; no moving while open"},
    ],
    "faq": [("What about a rider going down who is picked up by a car going up?", "A hall call adds only the floor, so the car stops and the rider gets in. Tracking the direction the rider wants means storing it per stop: Car keeps two sets, up stops and down stops."),
            ("Real time and threads?", "Keep step() as the one place time moves. A real loop calls step() every second, and the lock goes around step and the request methods.")],

    "summary": ["**Two classes and an enum.** The ElevatorSystem is the entry point: a hall call picks the nearest suitable car, a car call adds a stop to one car, and step() moves every car one tick. A Car holds its floor, its direction and its set of stops, and decides its own movement: it keeps going while stops are ahead, then turns.",
                "**It extends in one place each time:** a new scheduling policy replaces the car choice, a fire recall replaces every car's stops, and maintenance or doors become a status on Car."],

    "golden": [
        ("One step() moves everything one tick, with no threads and no real clock.", "the run is deterministic, so you can trace it by hand and anyone can check it."),
        ("The system chooses the car; the car chooses how to move.", "a new scheduling policy never touches movement, and interviewers probe exactly this split."),
        ("A hall call is a floor and a direction; a car call is a floor. They are different methods.", "the destination is unknown until the rider gets in."),
        ("The stops are a set and the car keeps its direction while stops are ahead.", "that is the SCAN idea in six lines, and duplicate presses cost nothing."),
        ("Car choice is a single function, so priority scheduling is a new function.", "the follow-up in the reports is always a new policy; the answer is one swap."),
        ("Request, Door and Display aren't classes; nothing in the scope gives them behaviour.", "it shows scope judgment and keeps the round to two classes."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with both extensions applied (dispatch passed in as a function, and an emergency recall), and a run at the bottom.",
    "final_title": "elevator.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "car 0 takes the call from 8 because the policy always picks it; the recall sends every car to floor 0 and the cars end idle there.",
}
