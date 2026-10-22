/* Amazon LLD kit, part B: library management, elevator system, key-value cache. Every code sample, predict answer and solution was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-library",
 "n": 5,
 "title": "Library management",
 "minutes": 35,
 "lead": "After this part you can take the prompt 'design a library management system' from one vague sentence to a working model in 35 minutes: ask the questions that fix the scope, keep a title apart from its copies, put each rule in one place, and then add a notification and a per-member fine rule without rewriting anything.",
 "sections": [
  {
   "id": "lld-library-reqs",
   "title": "The prompt and the requirements you elicit",
   "blocks": [
    {
     "t": "p",
     "text": "The prompt, as an interviewer gives it: **Design a library management system.** That is all you get. The first five minutes are yours. Ask, then say the scope back in your own words before you draw a single class."
    },
    {
     "t": "p",
     "text": "Ask about the things that change the model, not about screens or databases. Below are the questions that matter, with the answers a helpful interviewer gives. Open one at a time and say your own answer aloud first."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "Is a book the same thing as a copy of a book?",
       "a": "A title and a copy are different. The library owns several physical copies of one title, each with its own barcode. A member borrows a copy. Searching and reserving work on the title."
      },
      {
       "q": "Who uses the system?",
       "a": "Members borrow, return and reserve. They are adults or students, under the same rules for now. Librarians add books and copies. Treat both as callers of the same API, with no logins or roles."
      },
      {
       "q": "What are the loan rules?",
       "a": "A loan lasts 14 days. A member can hold at most 2 loans at once. There are no renewals for now."
      },
      {
       "q": "What happens when every copy of a title is out?",
       "a": "The member joins a queue for that title, first come first served. When a copy comes back it is held for the first person in line."
      },
      {
       "q": "What about late returns?",
       "a": "A fine of 25 cents a day, charged when the copy comes back. Paying fines is out of scope."
      },
      {
       "q": "How do people find books?",
       "a": "Search by title or author, part of a word, any case. It returns titles, not copies."
      },
      {
       "q": "Do we persist anything, and do we care about threads?",
       "a": "Everything stays in memory, with one desk and one thread. Say so if you would change that."
      },
      {
       "q": "How should the code know today's date?",
       "a": "Your call. Passing the date into the methods that need it makes the fines easy to test."
      }
     ]
    },
    {
     "t": "p",
     "text": "Now say the scope back. It protects you: anything not on the in-scope list is something you can politely decline when the interviewer drifts."
    },
    {
     "t": "list",
     "items": [
      "In scope: titles and copies, members, checkout and return, a reservation queue per title, a fine on late return, search by title or author",
      "Out of scope: logins and roles, paying fines, renewals, e-books, persistence, threads, a user interface",
      "Decided: a loan is 14 days, 2 loans per member, 25 cents a day, today's date is passed in"
     ]
    },
    {
     "t": "mcq",
     "id": "lld-library-reqs-mcq",
     "q": "Which clarifying question changes the class model the most?",
     "o": [
      "Should members get a web page?",
      "Which database stores the loans?",
      "Can the library own several copies of the same title?",
      "Should the code be in Java or Python?"
     ],
     "a": 2,
     "why": "It decides whether you need two classes, a title and a copy, or one. The rest follows: loans attach to a copy and reservations attach to a title. The other three are real questions, but they change the edges of the design, not its shape."
    }
   ]
  },
  {
   "id": "lld-library-entities",
   "title": "Entities and relationships",
   "blocks": [
    {
     "t": "fig",
     "key": "lldLibrary"
    },
    {
     "t": "p",
     "text": "Name the nouns, then decide who owns what. Two decisions carry this design. A loan and a hold attach to a **copy**, while a reservation attaches to a **title**. And the rules (limits, fines, the queue) each live in one place instead of being spread over the data classes."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Who owns what",
       "parts": [
        [
         "Library",
         "the one entry point: checkout, return, reserve, search; enforces the rules",
         true
        ],
        [
         "Book",
         "a title: isbn, title, author"
        ],
        [
         "BookItem",
         "one copy: barcode, and who it is held for"
        ],
        [
         "Member",
         "id, type (adult or student), fines owed"
        ],
        [
         "Loan",
         "a copy, a member, a due date"
        ],
        [
         "Reservations",
         "a queue of member ids per title"
        ]
       ]
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Class",
      "Owns",
      "Does"
     ],
     "rows": [
      [
       "`Library`",
       "books, copies, members, open loans",
       "checkout, return, reserve, search; the only class that enforces rules"
      ],
      [
       "`Book`",
       "isbn, title, author",
       "identifies a title; frozen, so it can sit in a set"
      ],
      [
       "`BookItem`",
       "barcode, its book, `on_hold_for`",
       "one physical copy; says who may take it next"
      ],
      [
       "`Member`",
       "id, name, kind, fines",
       "holds the fines owed; does not know its loans"
      ],
      [
       "`Loan`",
       "item, member, due date",
       "one open loan; exists only while the copy is out"
      ],
      [
       "`Reservations`",
       "one queue per title",
       "adds a member to a queue; holds a returned copy for the first in line"
      ],
      [
       "`fine_for`",
       "nothing",
       "the one place the fine rule lives"
      ]
     ]
    },
    {
     "t": "p",
     "text": "Notice what is missing: no `Librarian`, no `Account`, no `Notification`. Nothing in the scope needs them. A class you cannot give a job to is a class you do not write."
    },
    {
     "t": "mcq",
     "id": "lld-library-entities-mcq",
     "q": "A member wants a title whose copies are all out. Where does the reservation attach?",
     "o": [
      "To a BookItem, because that is what is borrowed",
      "To the Book (the title), because any returned copy will do",
      "To the Loan that is closest to being returned",
      "To the Member, as a list of barcodes"
     ],
     "a": 1,
     "why": "The member does not care which copy comes back, so the queue is per title. If you attach it to a copy you must pick a copy now, and a wrong pick makes them wait longer than they need to."
    }
   ]
  },
  {
   "id": "lld-library-core",
   "title": "The core code",
   "blocks": [
    {
     "t": "p",
     "text": "One file, standard library only. Read it top to bottom once, then use the notes. The demo plays one story: Ann borrows Dune, Bob reserves it, and Ann returns it 3 days late."
    },
    {
     "t": "code",
     "id": "lld-library-code",
     "title": "library.py: titles, copies, loans, reservations, fines",
     "code": "from collections import defaultdict, deque\nfrom dataclasses import dataclass\nfrom datetime import date, timedelta\n\nLOAN_DAYS, MAX_LOANS = 14, 2\n\n@dataclass(frozen=True)\nclass Book:                          # a title, shared by all its copies\n    isbn: str\n    title: str\n    author: str\n\n@dataclass\nclass BookItem:                      # one physical copy\n    barcode: str\n    book: Book\n    on_hold_for: str | None = None   # member id\n\n@dataclass\nclass Member:\n    id: str\n    name: str\n    kind: str = \"adult\"              # \"adult\" or \"student\"\n    fines: int = 0                   # cents\n\n@dataclass\nclass Loan:\n    item: BookItem\n    member: Member\n    due: date\n\ndef fine_for(member, days_late):\n    return days_late * 25            # cents per day\n\nclass Reservations:\n    def __init__(self):\n        self.queues = defaultdict(deque)   # isbn -> member ids, first in line first\n\n    def add(self, isbn, member_id):\n        self.queues[isbn].append(member_id)\n\n    def on_return(self, item):\n        queue = self.queues[item.book.isbn]\n        if queue:\n            item.on_hold_for = queue.popleft()\n\nclass Library:\n    def __init__(self):\n        self.books, self.items, self.members, self.loans = {}, {}, {}, {}   # loans: barcode -> Loan\n        self.reservations = Reservations()\n\n    def add_copy(self, book, barcode):\n        self.books[book.isbn] = book\n        self.items[barcode] = BookItem(barcode, book)\n\n    def search(self, text):\n        t = text.lower()\n        return [b for b in self.books.values() if t in b.title.lower() or t in b.author.lower()]\n\n    def checkout(self, member_id, barcode, today):\n        member, item = self.members[member_id], self.items[barcode]\n        if barcode in self.loans:\n            raise ValueError(\"copy is on loan\")\n        if item.on_hold_for not in (None, member_id):\n            raise ValueError(\"copy is held for someone else\")\n        if sum(ln.member is member for ln in self.loans.values()) >= MAX_LOANS:\n            raise ValueError(\"loan limit reached\")\n        item.on_hold_for = None\n        self.loans[barcode] = Loan(item, member, today + timedelta(days=LOAN_DAYS))\n        return self.loans[barcode]\n\n    def reserve(self, member_id, isbn):\n        if any(i.book.isbn == isbn and i.barcode not in self.loans and i.on_hold_for is None\n               for i in self.items.values()):\n            raise ValueError(\"a copy is on the shelf, borrow it\")\n        self.reservations.add(isbn, member_id)\n\n    def return_item(self, barcode, today):\n        loan = self.loans.pop(barcode)\n        fine = fine_for(loan.member, max(0, (today - loan.due).days))\n        loan.member.fines += fine\n        self.reservations.on_return(loan.item)\n        return fine\n\nif __name__ == \"__main__\":\n    lib = Library()\n    lib.add_copy(Book(\"111\", \"Dune\", \"Herbert\"), \"D1\")\n    lib.add_copy(Book(\"222\", \"Emma\", \"Austen\"), \"E1\")\n    for m in (Member(\"ann\", \"Ann\"), Member(\"bob\", \"Bob\")):\n        lib.members[m.id] = m\n    day1 = date(2026, 11, 2)\n    lib.checkout(\"ann\", \"D1\", day1)\n    lib.reserve(\"bob\", \"111\")\n    print(lib.return_item(\"D1\", day1 + timedelta(days=17)))   # due on day 14, so 3 days late\n    print(lib.items[\"D1\"].on_hold_for, [b.title for b in lib.search(\"her\")])",
     "notes": {
      "7": "Frozen means hashable: a Book can sit in a set or be a dict key. A title never changes.",
      "17": "This one field is the whole reservation hand-off: a returned copy waits for exactly one member.",
      "32": "The fine rule lives in one function. Extension 2 replaces it with a strategy without touching Library.",
      "37": "A first-in-first-out queue per title. `popleft` on a deque is O(1); `pop(0)` on a list is O(n).",
      "45": "A returned copy does not go back on the shelf. It is held for the first member in line.",
      "64": "A held copy can only be taken by the member it is held for.",
      "73": "Reserve only when no copy is free. Otherwise tell them to borrow one.",
      "80": "Never negative: an early return owes nothing. The date is a parameter, so the demo prints the same thing every run.",
      "82": "Library tells the queue a copy came back. It does not look inside the queue."
     },
     "ask": {
      "q": "Click the line where Library tells the reservation queue that a copy came back.",
      "lines": [
       82
      ],
      "why": "Library does not touch the queue itself. It reports the return, and Reservations decides who gets the copy. That split is what makes the notification extension a change to one class."
     }
    },
    {
     "t": "predict",
     "id": "lld-library-predict",
     "q": "What does the demo print? Two lines.",
     "answer": "75\nbob ['Dune']",
     "why": "Due on 16 Nov (2 Nov plus 14 days), returned on 19 Nov: 3 days late, 3 times 25 is 75 cents. The copy is now held for bob. Searching 'her' matches the author Herbert, so the title Dune comes back."
    }
   ]
  },
  {
   "id": "lld-library-ext",
   "title": "Extension follow-ups",
   "blocks": [
    {
     "t": "p",
     "text": "The interviewer adds one requirement at a time and watches how much of your code has to move. Try each change on the code above before you open the solution."
    },
    {
     "t": "write",
     "id": "lld-library-w-observer",
     "q": "Bob should be told as soon as the copy he reserved comes back, and Library must not know how he is told (email, text). Change `Reservations` so that anyone can subscribe, and every subscriber is called with the member id and the copy at the moment a copy is held.",
     "starter": "class Reservations:\n    def __init__(self):\n        self.queues = defaultdict(deque)   # isbn -> member ids, first in line first\n\n    def add(self, isbn, member_id):\n        self.queues[isbn].append(member_id)\n\n    def on_return(self, item):\n        queue = self.queues[item.book.isbn]\n        if queue:\n            item.on_hold_for = queue.popleft()",
     "solution": "class Reservations:\n    def __init__(self):\n        self.queues = defaultdict(deque)   # isbn -> member ids, first in line first\n        self.listeners = []                # callables: fn(member_id, item)\n\n    def subscribe(self, fn):\n        self.listeners.append(fn)\n\n    def add(self, isbn, member_id):\n        self.queues[isbn].append(member_id)\n\n    def on_return(self, item):\n        queue = self.queues[item.book.isbn]\n        if queue:\n            item.on_hold_for = queue.popleft()\n            for fn in self.listeners:\n                fn(item.on_hold_for, item)",
     "hint": "Keep a list of callables on Reservations. Call each one right after you set `on_hold_for`.",
     "why": "Observer, at its smallest: Reservations makes the event, so it owns the subscribers, and it does not know what 'telling a member' means. A list of callables is the whole pattern in Python; a Listener interface class would add nothing. Subscribing on Reservations rather than Library keeps Library unchanged. What you would not add: an event bus, a queue of notifications, or a Notification class."
    },
    {
     "t": "write",
     "id": "lld-library-w-fines",
     "q": "Students pay 10 cents a day, adults still pay 25, and a new member type, staff, pays nothing. Replace `fine_for` so that each member type is one entry in a table, not another `if` in `return_item`.",
     "starter": "def fine_for(member, days_late):\n    return days_late * 25            # cents per day",
     "solution": "class PerDay:\n    def __init__(self, cents):\n        self.cents = cents\n\n    def fine(self, days_late):\n        return days_late * self.cents\n\nPOLICIES = {\"adult\": PerDay(25), \"student\": PerDay(10), \"staff\": PerDay(0)}\n\ndef fine_for(member, days_late):\n    return POLICIES[member.kind].fine(days_late)",
     "hint": "A dict from member kind to a policy object with a `fine(days_late)` method.",
     "why": "Strategy, because the rule really does vary by member type. `return_item` still calls `fine_for` and did not change, so open/closed holds. One `PerDay` class covers all three policies because they differ by a number. Add a second class only when a policy differs in logic, for example a cap or a grace period."
    }
   ]
  },
  {
   "id": "lld-library-listen",
   "title": "What they listen for",
   "blocks": [
    {
     "t": "list",
     "items": [
      "Single responsibility: Library enforces the rules, Reservations owns the queues, `fine_for` owns the fine. Each has one reason to change.",
      "Open/closed: a new fine rule is a new dict entry, and `return_item` did not change.",
      "Strategy, once: the fine varies by member type, so it earns a strategy. The loan length is a constant, and a strategy for it would be speculation.",
      "Observer, kept small: Reservations calls whatever was subscribed. A list of callables is enough; no event bus.",
      "A date you can control: `today` is a parameter, so the same input always gives the same output and a demo can be traced by hand.",
      "What you would not add: a Librarian class, a LoanFactory, an abstract Account, a Singleton for Library. Nothing in the scope uses them.",
      "Trade-offs to say aloud: availability is a scan over the copies of a title, O(copies); index copies by isbn if the catalogue is big. The loan count per member is a scan of open loans; keep a counter if it ever shows up."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-library-listen-mcq",
     "q": "Why is the fine behind a strategy while the loan length is a plain constant?",
     "o": [
      "Fines are money, and money always needs its own class",
      "Only the fine varies by member type; a strategy for the loan length would guard against a change nobody asked for",
      "A constant cannot be read by more than one class",
      "A strategy is the only pattern that works with dataclasses"
     ],
     "a": 1,
     "why": "Reach for a pattern where the requirements show a variation. Fines differ by member type, so a strategy pays for itself. The loan length does not vary, and adding a strategy there is the over-design interviewers mark down."
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-elevator",
 "n": 6,
 "title": "Elevator system",
 "minutes": 40,
 "lead": "After this part you can design an elevator system as a small deterministic simulation: each car is a state machine, the choice of which car answers a call sits in a swappable strategy, and a second policy, an emergency stop and express cars are each added without touching the states you already wrote.",
 "sections": [
  {
   "id": "lld-elevator-reqs",
   "title": "The prompt and the requirements you elicit",
   "blocks": [
    {
     "t": "p",
     "text": "The prompt, as an interviewer gives it: **Design an elevator system for a building.** Elevator problems drift into hardware, physics and scheduling theory within a minute. Your job in the first five minutes is to fix a small world that you can finish in 40."
    },
    {
     "t": "p",
     "text": "The question that matters most is how time works. If one `tick()` moves every car one small step, the whole thing is deterministic, easy to trace on a whiteboard and easy to test. Say that you want that, and ask if it is acceptable."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "How many cars and floors?",
       "a": "Three cars and ten floors, but make both of them parameters. The demo can use two cars."
      },
      {
       "q": "What kinds of request are there?",
       "a": "A hall call is a button in the hallway: a floor and a direction, up or down. A car call is a button inside a car: a destination floor."
      },
      {
       "q": "Who decides which car answers a hall call?",
       "a": "A dispatcher decides. Start with the nearest idle car. I may ask for a different policy later."
      },
      {
       "q": "How does time work?",
       "a": "Your call. A step-based simulation is fine: on each tick, every car does one thing."
      },
      {
       "q": "Does a car stop for floors on the way?",
       "a": "Yes, if a car is going up and someone above it wants to go up too, it picks them up on the way."
      },
      {
       "q": "Do I model weight, speed, or doors that jam?",
       "a": "No weight, no jams, no real speed. A floor takes one tick to cross, and doors stay open for one tick."
      },
      {
       "q": "Threads or a real clock?",
       "a": "No threads and no real clock. One method advances the whole simulation by one tick."
      },
      {
       "q": "Do I need a display or a user interface?",
       "a": "No display. Print the floor and state of each car after each tick."
      }
     ]
    },
    {
     "t": "p",
     "text": "Say the scope back. Elevators have a hundred features, so name the few you will build."
    },
    {
     "t": "list",
     "items": [
      "In scope: cars as state machines, hall calls and car calls, a dispatcher that picks a car, a tick that advances every car one step",
      "Out of scope: weight and capacity, real speeds, fire mode and key access, a user interface, threads",
      "Decided: 3 cars and 10 floors (the demo uses 2 cars), one floor per tick, doors open for one tick"
     ]
    },
    {
     "t": "mcq",
     "id": "lld-elevator-reqs-mcq",
     "q": "Someone on floor 4 presses the up button in the hallway. What does the system know at that moment?",
     "o": [
      "The floor and the direction, but not the destination",
      "The floor and the destination, but not the direction",
      "Only the destination",
      "The floor, the direction and the destination"
     ],
     "a": 0,
     "why": "A hall call carries a floor and a direction. The destination is only known once the rider gets in and presses a button inside the car, which is a car call. Your dispatcher has to work with a floor and a direction only."
    }
   ]
  },
  {
   "id": "lld-elevator-entities",
   "title": "Entities and relationships: cars, states, a dispatcher",
   "blocks": [
    {
     "t": "fig",
     "key": "lldElevator"
    },
    {
     "t": "p",
     "text": "Three ideas. A **car** is a floor, a set of floors it must stop at, and a current state. A **state** decides what happens on the next tick. A **dispatcher** is a strategy that picks which car answers a hall call. A controller holds the cars and the strategy and routes the buttons."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "What a car does, tick by tick",
       "flow": [
        "Idle",
        "Moving up or down",
        "Doors open",
        "Moving again, or Idle"
       ],
       "note": "Idle picks the nearest stop. Moving goes one floor per tick and stops at a requested floor. Doors stay open for one tick, then the car keeps its direction if stops remain ahead of it."
      },
      {
       "title": "Who owns what",
       "parts": [
        [
         "Controller",
         "owns the cars and the dispatch strategy; routes button presses; runs tick()",
         true
        ],
        [
         "Dispatch",
         "strategy: choose(cars, floor, direction) returns one car"
        ],
        [
         "Car",
         "floor, set of stops, current state"
        ],
        [
         "State",
         "interface with one method: step(car)"
        ],
        [
         "Idle, Moving, DoorsOpen",
         "the concrete states; each decides the next state"
        ]
       ]
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Class",
      "Owns",
      "Does"
     ],
     "rows": [
      [
       "`Controller`",
       "the cars, the strategy",
       "`hall_call` picks a car through the strategy; `car_call` presses a button in a car; `tick` steps every car"
      ],
      [
       "`Dispatch`",
       "nothing",
       "chooses one car for a hall call; `NearestIdle` is the first policy"
      ],
      [
       "`Car`",
       "id, floor, stops, state",
       "holds data and small helpers (`ahead`, `open_doors`, `press`); makes no decisions"
      ],
      [
       "`Idle`",
       "nothing",
       "picks the nearest stop; opens the doors there, or starts moving toward it"
      ],
      [
       "`Moving`",
       "its direction, +1 or -1",
       "goes one floor; at a requested floor it opens the doors"
      ],
      [
       "`DoorsOpen`",
       "the direction it arrived in",
       "closes; keeps going the same way if stops remain ahead, else rests"
      ]
     ]
    },
    {
     "t": "mcq",
     "id": "lld-elevator-entities-mcq",
     "q": "A car going up opens its doors at floor 3. It still has a stop at 7. What state follows DoorsOpen?",
     "o": [
      "Idle, and then it decides again",
      "Moving up, because it keeps its direction while stops remain ahead",
      "Moving down, toward the nearest stop",
      "DoorsOpen again"
     ],
     "a": 1,
     "why": "DoorsOpen remembers the direction it arrived in. If a stop remains ahead the car keeps going. If it went Idle instead, the nearest-stop rule could send it back down, and the rider going to 7 would wait for a round trip."
    }
   ]
  },
  {
   "id": "lld-elevator-core",
   "title": "The core code: a step-based simulation",
   "blocks": [
    {
     "t": "p",
     "text": "One file. Read the states first: each is a class with one method, and each decides what the next state is. The demo has two cars. Car 1 waits at floor 6 while car 0 answers a call from floor 2, and the rider then presses 4."
    },
    {
     "t": "code",
     "id": "lld-elevator-code",
     "title": "elevator.py: states, cars, a dispatcher, a controller",
     "code": "from abc import ABC, abstractmethod\n\nclass State(ABC):\n    @abstractmethod\n    def step(self, car): ...             # one tick of work for this state\n\nclass Idle(State):\n    name = \"idle\"\n    def step(self, car):\n        if not car.stops:\n            return\n        target = min(car.stops, key=lambda f: (abs(f - car.floor), f))\n        if target == car.floor:\n            car.open_doors(0)\n        else:\n            car.state = UP if target > car.floor else DOWN\n            car.state.step(car)\n\nclass Moving(State):\n    def __init__(self, d, name):\n        self.d, self.name = d, name      # d is +1 (up) or -1 (down)\n\n    def step(self, car):\n        if car.floor in car.stops:\n            car.open_doors(self.d)\n        else:\n            car.floor += self.d\n\nclass DoorsOpen(State):\n    name = \"doors\"\n    def __init__(self, d):\n        self.d = d                       # the direction the car arrived in\n\n    def step(self, car):                 # close, then keep going if stops remain ahead\n        car.state = (UP if self.d > 0 else DOWN) if car.ahead(self.d) else IDLE\n\nIDLE, UP, DOWN = Idle(), Moving(1, \"up\"), Moving(-1, \"down\")\n\nclass Car:\n    def __init__(self, id, floor=0):\n        self.id, self.floor, self.stops, self.state = id, floor, set(), IDLE\n\n    def ahead(self, d):                  # any stop beyond this floor in direction d?\n        return any((f - self.floor) * d > 0 for f in self.stops)\n\n    def open_doors(self, d):\n        self.stops.discard(self.floor)\n        self.state = DoorsOpen(d)\n\n    def press(self, floor):\n        self.stops.add(floor)\n\nclass Dispatch(ABC):\n    @abstractmethod\n    def choose(self, cars, floor, direction): ...\n\nclass NearestIdle(Dispatch):\n    def choose(self, cars, floor, direction):\n        pool = [c for c in cars if c.state is IDLE] or cars\n        return min(pool, key=lambda c: (abs(c.floor - floor), c.id))\n\nclass Controller:\n    def __init__(self, n_cars, strategy):\n        self.cars = [Car(i) for i in range(n_cars)]\n        self.strategy = strategy\n\n    def hall_call(self, floor, direction):          # a button in the hallway\n        self.strategy.choose(self.cars, floor, direction).press(floor)\n\n    def car_call(self, car_id, floor):              # a button inside a car\n        self.cars[car_id].press(floor)\n\n    def tick(self):\n        for car in self.cars:\n            car.state.step(car)\n\nif __name__ == \"__main__\":\n    ctl = Controller(2, NearestIdle())\n    ctl.cars[1].floor = 6                # car 1 waits at floor 6\n    ctl.hall_call(2, +1)                 # someone on floor 2 presses up\n    for t in range(1, 8):\n        ctl.tick()\n        if t == 3:\n            ctl.car_call(0, 4)           # the rider gets in at floor 2 and presses 4\n        print(t, [(c.floor, c.state.name) for c in ctl.cars])",
     "notes": {
      "5": "The whole State interface is one method. A new behaviour is a new class with this method.",
      "12": "Idle is the only state that chooses where to go: the nearest stop, the lower floor on a tie, so the result never depends on set order.",
      "16": "A state change is an assignment. The next tick calls the new state's `step`.",
      "27": "The only line that moves a car: one floor per tick.",
      "35": "Close the doors. Keep the direction while stops remain ahead; otherwise rest.",
      "37": "These states hold no per-car data, so one shared instance of each is enough.",
      "43": "Is any stop beyond this floor in direction d? It is what stops a car turning back while riders are still ahead.",
      "59": "The policy: prefer an idle car, else any car. Ties go to the lowest id, so the same calls always pick the same car.",
      "68": "The controller asks the strategy, then presses the button on the car it returns. It does not know how the choice is made.",
      "74": "One step for every car, in car order. The same calls in give the same prints out."
     },
     "ask": {
      "q": "Click the line where the policy for picking a car is called.",
      "lines": [
       68
      ],
      "why": "`hall_call` hands the decision to `self.strategy`. Swap the object and the policy changes; Controller does not. That is the Strategy pattern in one line."
     }
    },
    {
     "t": "predict",
     "id": "lld-elevator-predict",
     "q": "What does the demo print? Trace car 0 by hand: it starts at floor 0 and its stop set holds floor 2.",
     "answer": "1 [(1, 'up'), (6, 'idle')]\n2 [(2, 'up'), (6, 'idle')]\n3 [(2, 'doors'), (6, 'idle')]\n4 [(2, 'up'), (6, 'idle')]\n5 [(3, 'up'), (6, 'idle')]\n6 [(4, 'up'), (6, 'idle')]\n7 [(4, 'doors'), (6, 'idle')]",
     "why": "Tick 1: the idle car picks floor 2 and moves to 1 in the same tick. Tick 2: it reaches 2 and the state is still up. Tick 3: it sees its stop and opens the doors; the rider presses 4. Tick 4: the doors close, a stop is ahead, so the state is up, with no movement yet. Ticks 5 and 6: floors 3 and 4. Tick 7: doors at 4. Car 1 never moves."
    }
   ]
  },
  {
   "id": "lld-elevator-ext",
   "title": "Extension follow-ups",
   "blocks": [
    {
     "t": "p",
     "text": "Each follow-up is a new requirement on the code above. Try it, and notice how many classes you had to open."
    },
    {
     "t": "write",
     "id": "lld-elevator-w-dispatch",
     "q": "Add a second policy. A hall call going up should prefer a car that is already heading up and has not passed that floor yet (the same for down). If there is none, use the first policy. `Controller` must not change.",
     "starter": "class NearestIdle(Dispatch):\n    def choose(self, cars, floor, direction):\n        pool = [c for c in cars if c.state is IDLE] or cars\n        return min(pool, key=lambda c: (abs(c.floor - floor), c.id))",
     "solution": "class NearestIdle(Dispatch):\n    def choose(self, cars, floor, direction):\n        pool = [c for c in cars if c.state is IDLE] or cars\n        return min(pool, key=lambda c: (abs(c.floor - floor), c.id))\n\nclass SameDirection(Dispatch):\n    \"\"\"Prefer a car already heading the call's way that has not passed the floor.\"\"\"\n    def __init__(self, fallback):\n        self.fallback = fallback\n\n    def choose(self, cars, floor, direction):\n        on_the_way = [c for c in cars if getattr(c.state, \"d\", 0) == direction\n                      and (floor - c.floor) * direction >= 0]\n        return self.fallback.choose(on_the_way or cars, floor, direction)",
     "hint": "Compose: the new strategy takes the first one as a fallback and calls it on a shorter list of cars.",
     "why": "Open/closed: one new class, and the controller is handed a different object at construction. Taking the old policy as a fallback keeps 'prefer idle cars' in one place instead of copying it. To use it: `Controller(3, SameDirection(NearestIdle()))`."
    },
    {
     "t": "write",
     "id": "lld-elevator-w-halt",
     "q": "A technician presses an emergency stop on car 0. It must stop moving and receive no new hall calls until it is resumed. Add it without changing any existing state class.",
     "starter": "class Controller:\n    def __init__(self, n_cars, strategy):\n        self.cars = [Car(i) for i in range(n_cars)]\n        self.strategy = strategy\n\n    def hall_call(self, floor, direction):          # a button in the hallway\n        self.strategy.choose(self.cars, floor, direction).press(floor)\n\n    def car_call(self, car_id, floor):              # a button inside a car\n        self.cars[car_id].press(floor)\n\n    def tick(self):\n        for car in self.cars:\n            car.state.step(car)",
     "solution": "class Halted(State):\n    name = \"halted\"\n    def step(self, car):\n        pass                             # frozen until resume()\n\nclass Controller:\n    def __init__(self, n_cars, strategy):\n        self.cars = [Car(i) for i in range(n_cars)]\n        self.strategy = strategy\n\n    def hall_call(self, floor, direction):\n        live = [c for c in self.cars if not isinstance(c.state, Halted)]\n        self.strategy.choose(live, floor, direction).press(floor)\n\n    def car_call(self, car_id, floor):\n        self.cars[car_id].press(floor)\n\n    def emergency_stop(self, car_id):\n        self.cars[car_id].state = Halted()\n\n    def resume(self, car_id):\n        self.cars[car_id].state = IDLE   # keeps its stops; Idle picks them up\n\n    def tick(self):\n        for car in self.cars:\n            car.state.step(car)",
     "hint": "A new state whose `step` does nothing. The controller only needs to leave cars in that state out of the list it gives the strategy.",
     "why": "Because behaviour lives in the states, `Halted` is one new class and Idle, Moving and DoorsOpen are untouched. Say the decisions aloud: the halted car keeps its stops and serves them after `resume()`; if the interviewer wants them reassigned, loop over them in `emergency_stop` and call `hall_call`. And if every car is halted, `min()` on an empty list raises, so say whether you raise or queue the call."
    },
    {
     "t": "write",
     "id": "lld-elevator-w-express",
     "q": "Car 0 is an express car that serves only floors 0, 5 and 10. Hall calls for other floors must never go to it, and pressing another floor inside it must be refused.",
     "starter": "class Car:\n    def __init__(self, id, floor=0):\n        self.id, self.floor, self.stops, self.state = id, floor, set(), IDLE\n\n    def ahead(self, d):                  # any stop beyond this floor in direction d?\n        return any((f - self.floor) * d > 0 for f in self.stops)\n\n    def open_doors(self, d):\n        self.stops.discard(self.floor)\n        self.state = DoorsOpen(d)\n\n    def press(self, floor):\n        self.stops.add(floor)\n\n# ... Dispatch, NearestIdle and the top of Controller are unchanged ...\n\n    def hall_call(self, floor, direction):          # a button in the hallway\n        self.strategy.choose(self.cars, floor, direction).press(floor)",
     "solution": "class Car:\n    def __init__(self, id, floor=0, floors=None):\n        self.id, self.floor, self.stops, self.state = id, floor, set(), IDLE\n        self.floors = floors             # the floors it serves; None means all of them\n\n    def serves(self, floor):\n        return self.floors is None or floor in self.floors\n\n    def ahead(self, d):                  # any stop beyond this floor in direction d?\n        return any((f - self.floor) * d > 0 for f in self.stops)\n\n    def open_doors(self, d):\n        self.stops.discard(self.floor)\n        self.state = DoorsOpen(d)\n\n    def press(self, floor):\n        if not self.serves(floor):\n            raise ValueError(f\"car {self.id} does not stop at {floor}\")\n        self.stops.add(floor)\n\n# ... Dispatch, NearestIdle and the top of Controller are unchanged ...\n\n    def hall_call(self, floor, direction):          # a button in the hallway\n        able = [c for c in self.cars if c.serves(floor)]\n        self.strategy.choose(able, floor, direction).press(floor)",
     "hint": "Give Car a set of floors it serves (None means all) and a `serves(floor)` method. Filter in `hall_call` before the strategy runs.",
     "why": "The strategies do not change: they only ever see cars that can serve the call. The filter belongs in the controller because it is a fact about the request, not a preference of one policy. `press` refuses unserved floors as a second guard, so a wrong button cannot strand a rider."
    }
   ]
  },
  {
   "id": "lld-elevator-listen",
   "title": "What they listen for",
   "blocks": [
    {
     "t": "list",
     "items": [
      "State pattern: each state owns its behaviour, so adding Halted touched no other state. The alternative is a string field and an if-chain in one big `step`, which changes everywhere for every new state.",
      "Strategy pattern: the choice of car is a policy that can vary, so it sits behind `choose()`. The mechanism, pressing the button on that car, stays in the controller.",
      "Determinism: a tick advances everything one step, ties break by floor and by id, and there is no real clock. You can trace the demo on paper, which is also how you debug it in the room.",
      "Keeping direction: the car keeps going while stops remain ahead. This is the idea behind the SCAN and LOOK disk-scheduling algorithms. Without it, a nearest-stop rule makes the car oscillate.",
      "What you would not add: a Request class hierarchy, an observer for floor displays, a Singleton controller, a thread per car. The scope does not need them, and you can say how you would add each.",
      "Trade-offs to say aloud: `stops` is a set of floors, so an up call and a down call at one floor are one stop; keep two sets if the direction at the stop matters. Dispatch looks at every car per call, which is fine for a handful of cars. Nothing checks that a floor exists; `Car.press` is the place for that check."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-elevator-listen-mcq",
     "q": "You add a Halted state for the emergency stop. Which existing classes should have to change?",
     "o": [
      "Idle, Moving and DoorsOpen, so each can check for Halted",
      "Only the controller, to leave halted cars out when it picks one",
      "Car, to add an is_halted flag that each state reads",
      "Every class, because the State interface changes"
     ],
     "a": 1,
     "why": "The point of the State pattern is that a new state is a new class. The States do not need to know about Halted. Only the controller, which chooses among cars, has to skip the ones that cannot take a call."
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-kvstore",
 "n": 7,
 "title": "A key-value cache, built in layers",
 "minutes": 40,
 "lead": "After this part you can build a time-aware cache one layer at a time and, at each step, name the data structure and its cost: a dict, a sorted list per key with bisect, insort for late writes, an OrderedDict for LRU eviction, and a clock for a TTL. You can also say where the lock goes.",
 "sections": [
  {
   "id": "lld-kvstore-reqs",
   "title": "The prompt and the requirements you elicit",
   "blocks": [
    {
     "t": "p",
     "text": "The reported Amazon prompt starts small: **design a cache that stores the latest value of a key.** Then the interviewer adds a layer every few minutes: timestamps and history, the value at or before a time, timestamps that arrive out of order, then a capacity with LRU eviction and a TTL. Do not build layer 6 first. Build what is asked, say what it costs, and keep the next layer easy."
    },
    {
     "t": "p",
     "text": "The requirements arrive in layers too. Ask now what you can, and expect some of the answers below to be given only when that layer comes up."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "What is a timestamp here?",
       "a": "An integer the caller sends with each write: the time the event happened. It is not the time the write arrives."
      },
      {
       "q": "What does get return for a key that was never written?",
       "a": "It returns None. Values are never None, so None can mean missing."
      },
      {
       "q": "What does 'the value at a time' mean?",
       "a": "The value written with the largest timestamp that is not after the time you ask about. If every write for that key is later, the answer is None."
      },
      {
       "q": "Can writes for one key arrive out of order?",
       "a": "Not at first. Assume they arrive in order, and I will tell you when that changes."
      },
      {
       "q": "What if two writes have the same key and the same timestamp?",
       "a": "The later write wins."
      },
      {
       "q": "How big can this get?",
       "a": "Many keys, and some keys get many writes. Once you add a capacity, the limit is a number of keys."
      },
      {
       "q": "What does the capacity count, and what is evicted?",
       "a": "It counts keys. When a new key would go over the capacity, evict the least recently used key together with its whole history. A read and a write both count as a use."
      },
      {
       "q": "What is the TTL measured against?",
       "a": "Wall-clock seconds since the key was last written, not the event timestamp. Make the clock injectable so it can be tested."
      }
     ]
    },
    {
     "t": "p",
     "text": "Say the scope back, and mark what you are leaving for later."
    },
    {
     "t": "list",
     "items": [
      "In scope, grown by layer: put(key, value, ts), get(key), get(key, at), writes out of order, a capacity with LRU eviction, a TTL",
      "Out of scope: persistence, networking, values that are None, deleting a key, a background thread for expiry (expiry is checked when a key is touched)",
      "Expect later: thread safety, and a TTL per key"
     ]
    },
    {
     "t": "mcq",
     "id": "lld-kvstore-reqs-mcq",
     "q": "A key was written at ts 100, 200 and 300. What does get(key, at=270) return?",
     "o": [
      "The value written at 300, the closest to 270",
      "The value written at 200, the newest write not after 270",
      "None, because nothing was written at exactly 270",
      "The value written at 100, the oldest"
     ],
     "a": 1,
     "why": "At or before means: the newest write whose timestamp is 270 or less. That is the write at 200. Closest is a different question, and you should ask which one is meant."
    }
   ]
  },
  {
   "id": "lld-kvstore-shape",
   "title": "The shape: one class, six layers",
   "blocks": [
    {
     "t": "fig",
     "key": "lldKvstore"
    },
    {
     "t": "p",
     "text": "You will write one class and change it five times. Each layer swaps in a data structure, and you say its cost out loud. Know this table before you start. It is also your answer to 'what is the complexity?' at each step."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Six layers, one class",
       "flow": [
        "1 dict: latest",
        "2 list per key: history",
        "3 bisect: value at a time",
        "4 insort: late writes",
        "5 OrderedDict: LRU",
        "6 clock: TTL"
       ],
       "note": "Each step keeps the previous one working. The only thing thrown away along the way is the assumption that writes arrive in order."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Layer",
      "Structure",
      "put",
      "get",
      "Memory"
     ],
     "rows": [
      [
       "1 Latest value",
       "`dict`, key to value",
       "O(1)",
       "O(1)",
       "one value per key"
      ],
      [
       "2 History",
       "`dict` of lists of (ts, value), appended",
       "O(1) amortised",
       "O(1) for the latest",
       "grows with every write, never shrinks"
      ],
      [
       "3 Value at a time",
       "the same lists, `bisect_right`",
       "O(1)",
       "O(log n) for n writes to that key",
       "the same"
      ],
      [
       "4 Late writes",
       "`insort` into the sorted list",
       "O(log n) to find the place, O(n) to shift; no shift when in order",
       "O(log n)",
       "the same"
      ],
      [
       "5 Capacity, LRU",
       "`OrderedDict`: `move_to_end`, `popitem(last=False)`",
       "adds O(1)",
       "adds O(1)",
       "bounded: at most capacity keys"
      ],
      [
       "6 TTL",
       "an `Entry` with a stamp, and an injected clock",
       "adds one clock read",
       "adds one clock read; an expired key is removed when touched",
       "expired keys stay until touched or evicted"
      ]
     ]
    },
    {
     "t": "p",
     "text": "Keep one assumption in your head: layers 2 and 3 are correct only while writes arrive in order. Layer 4 removes that assumption."
    },
    {
     "t": "mcq",
     "id": "lld-kvstore-shape-mcq",
     "q": "A key has 1,000,000 writes stored in order (layer 3). Roughly how many comparisons does get(key, at=...) make?",
     "o": [
      "About 20",
      "About 1,000",
      "About 1,000,000",
      "One"
     ],
     "a": 0,
     "why": "Binary search halves the range at every step, and log base 2 of a million is about 20. A scan from the start would be up to a million. That gap is why layer 3 exists."
    }
   ]
  },
  {
   "id": "lld-kvstore-l1",
   "title": "Layer 1: the latest value",
   "blocks": [
    {
     "t": "p",
     "text": "The prompt, literally: store the latest value of a key. A dict does it. Say so in one sentence and write it in under a minute."
    },
    {
     "t": "code",
     "id": "lld-kvstore-l1-code",
     "title": "Layer 1: a dict",
     "code": "class Cache:\n    def __init__(self):\n        self.data = {}                       # key -> latest value\n\n    def put(self, key, value):\n        self.data[key] = value\n\n    def get(self, key):\n        return self.data.get(key)            # None when the key is missing\n\nif __name__ == \"__main__\":\n    c = Cache()\n    c.put(\"a\", 1)\n    c.put(\"a\", 2)\n    print(c.get(\"a\"), c.get(\"zz\"))",
     "notes": {
      "6": "A later put overwrites the earlier one. The dict keeps only the latest value.",
      "9": "None for a missing key, as agreed. This is why values may not be None."
     }
    },
    {
     "t": "p",
     "text": "Cost: put and get are O(1) on average, and memory is one value per key. Say that, then say what you are not doing yet: no history, no limit."
    },
    {
     "t": "predict",
     "id": "lld-kvstore-l1-predict",
     "q": "What does the demo print?",
     "answer": "2 None",
     "why": "The second put overwrites the first, so get('a') is 2. 'zz' was never written, so it is None."
    }
   ]
  },
  {
   "id": "lld-kvstore-l2",
   "title": "Layer 2: timestamps and history",
   "blocks": [
    {
     "t": "p",
     "text": "Now every write carries a timestamp and the old values must be kept. One value per key is no longer enough, so each key maps to a list of (ts, value) pairs, oldest first. `get(key)` still returns the latest: the last pair."
    },
    {
     "t": "code",
     "id": "lld-kvstore-l2-code",
     "title": "Layer 2: a list of pairs per key",
     "code": "class Cache:\n    def __init__(self):\n        self.data = {}                       # key -> [(ts, value), ...], oldest first\n\n    def put(self, key, value, ts):\n        self.data.setdefault(key, []).append((ts, value))\n\n    def get(self, key):\n        history = self.data.get(key)\n        return history[-1][1] if history else None\n\nif __name__ == \"__main__\":\n    c = Cache()\n    c.put(\"a\", \"v1\", 100)\n    c.put(\"a\", \"v2\", 200)\n    print(c.get(\"a\"), c.data[\"a\"])",
     "notes": {
      "6": "Append is O(1) amortised. The list stays sorted only because writes arrive in order. Layer 4 removes that assumption.",
      "10": "The latest value is the last pair: O(1)."
     }
    },
    {
     "t": "p",
     "text": "Cost: put is O(1) amortised and get is O(1). Memory now grows with every write and never shrinks. That is the reason capacity exists in layer 5."
    },
    {
     "t": "mcq",
     "id": "lld-kvstore-l2-mcq",
     "q": "Layer 2 returns history[-1] as the latest value. What does that rely on?",
     "o": [
      "Values are never None",
      "Writes for a key arrive in timestamp order, so the last pair is the newest",
      "The dict keeps its keys in sorted order",
      "Every key has at least two writes"
     ],
     "a": 1,
     "why": "A late write with an older timestamp would sit at the end of the list and be returned as the latest. Layer 4 fixes this by keeping each list sorted by ts, not by arrival."
    }
   ]
  },
  {
   "id": "lld-kvstore-l3",
   "title": "Layer 3: the value at or before a time",
   "blocks": [
    {
     "t": "p",
     "text": "`get(key, at)` asks for the value as of a time. The history is sorted by timestamp, so use binary search instead of a scan: O(log n) instead of O(n). The standard library has it: `bisect`."
    },
    {
     "t": "p",
     "text": "The detail that catches people: you want the last pair whose ts is **less than or equal to** `at`. `bisect_right` returns the index right after the last pair with ts <= at, so the answer is the pair at index i - 1. If i is 0, nothing was written by then."
    },
    {
     "t": "code",
     "id": "lld-kvstore-l3-code",
     "title": "Layer 3: bisect",
     "code": "from bisect import bisect_right\nfrom operator import itemgetter\n\nts_of = itemgetter(0)                        # the sort key of a (ts, value) pair\n\nclass Cache:\n    def __init__(self):\n        self.data = {}                       # key -> [(ts, value), ...], oldest first\n\n    def put(self, key, value, ts):\n        self.data.setdefault(key, []).append((ts, value))\n\n    def get(self, key, at=None):\n        history = self.data.get(key, [])\n        i = len(history) if at is None else bisect_right(history, at, key=ts_of)\n        return history[i - 1][1] if i else None\n\nif __name__ == \"__main__\":\n    c = Cache()\n    for ts, v in ((100, \"v1\"), (200, \"v2\"), (300, \"v3\")):\n        c.put(\"a\", v, ts)\n    print(c.get(\"a\", at=250), c.get(\"a\", at=200), c.get(\"a\", at=50), c.get(\"a\"))",
     "notes": {
      "4": "`bisect` compares pairs by timestamp only. The `key=` argument needs Python 3.10 or later.",
      "15": "`bisect_right`, not `bisect_left`: a write exactly at `at` must be included. With no time given, everything is included, which is the latest.",
      "16": "`i` counts the pairs at or before `at`. Zero means none, so return None."
     }
    },
    {
     "t": "p",
     "text": "Cost: get is O(log n), where n is the number of writes to that key. put is unchanged."
    },
    {
     "t": "predict",
     "id": "lld-kvstore-l3-predict",
     "q": "The demo writes v1 at 100, v2 at 200 and v3 at 300. What does it print for get at 250, at 200, at 50, and with no time?",
     "answer": "v2 v2 None v3",
     "why": "At 250 the newest write not after it is v2. At 200 the write at exactly 200 counts, so v2 again; this is the line that would be wrong with bisect_left. At 50 nothing exists yet, so None. With no time, the latest: v3."
    }
   ]
  },
  {
   "id": "lld-kvstore-l4",
   "title": "Layer 4: timestamps that arrive out of order",
   "blocks": [
    {
     "t": "p",
     "text": "Now a write for ts 200 can arrive after the write for ts 300. Appending breaks the sorted order, and `bisect` would then return wrong answers without any error. Insert at the right place instead: `insort` does a binary search and then inserts."
    },
    {
     "t": "code",
     "id": "lld-kvstore-l4-code",
     "title": "Layer 4: insort",
     "code": "from bisect import bisect_right, insort\nfrom operator import itemgetter\n\nts_of = itemgetter(0)\n\nclass Cache:\n    def __init__(self):\n        self.data = {}                       # key -> [(ts, value), ...], sorted by ts\n\n    def put(self, key, value, ts):\n        insort(self.data.setdefault(key, []), (ts, value), key=ts_of)\n\n    def get(self, key, at=None):\n        history = self.data.get(key, [])\n        i = len(history) if at is None else bisect_right(history, at, key=ts_of)\n        return history[i - 1][1] if i else None\n\nif __name__ == \"__main__\":\n    c = Cache()\n    for ts, v in ((100, \"v1\"), (300, \"v3\"), (200, \"v2\")):     # v2 arrives late\n        c.put(\"a\", v, ts)\n    c.put(\"a\", \"v3b\", 300)                                    # same ts: the later write wins\n    print(c.get(\"a\", at=250), c.get(\"a\"), c.data[\"a\"])",
     "notes": {
      "11": "The only changed line. `insort` finds the place by ts and inserts there. Equal timestamps go after the existing pair, so the later write wins on a read.",
      "22": "Same ts as an existing pair: both are kept, and `bisect_right` makes the later one win."
     }
    },
    {
     "t": "p",
     "text": "Cost: finding the place is O(log n). The insert shifts every pair after it, which is O(n) in the worst case. When writes arrive in order the shift is zero, so the common case stays cheap. Say the worst case and why it is acceptable: it is a pointer move in C. The real alternative is a balanced tree or a skip list, and the standard library has neither, so you name it and move on."
    },
    {
     "t": "mcq",
     "id": "lld-kvstore-l4-mcq",
     "q": "A key holds 100,000 pairs and a write arrives with the oldest timestamp so far. What does insort cost?",
     "o": [
      "O(1)",
      "O(log n) to find the place and O(n) to shift 100,000 pairs",
      "O(n log n), because it sorts the list",
      "O(log n) in total, since the insert is free"
     ],
     "a": 1,
     "why": "Binary search finds position 0 quickly, but the insert moves every pair one slot. It is still fast in C, but it is O(n), and you should say so. In-order writes insert at the end and shift nothing."
    }
   ]
  },
  {
   "id": "lld-kvstore-l5",
   "title": "Layer 5: capacity and LRU eviction",
   "blocks": [
    {
     "t": "p",
     "text": "Memory grows with every key and every write. Add a capacity, counted in keys, and evict the least recently used key when it is exceeded. A read and a write both count as a use. A dict that remembers order does this: `OrderedDict` has `move_to_end` (mark as the most recent) and `popitem(last=False)` (remove the oldest), both O(1)."
    },
    {
     "t": "code",
     "id": "lld-kvstore-l5-code",
     "title": "Layer 5: OrderedDict as the LRU",
     "code": "from bisect import bisect_right, insort\nfrom collections import OrderedDict\nfrom operator import itemgetter\n\nts_of = itemgetter(0)\n\nclass Cache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = OrderedDict()            # key -> sorted [(ts, value)], least recently used first\n\n    def put(self, key, value, ts):\n        insort(self.data.setdefault(key, []), (ts, value), key=ts_of)\n        self.data.move_to_end(key)           # a write counts as a use\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)    # drop the least recently used key and its history\n\n    def get(self, key, at=None):\n        if key not in self.data:\n            return None\n        self.data.move_to_end(key)           # so does a read\n        history = self.data[key]\n        i = len(history) if at is None else bisect_right(history, at, key=ts_of)\n        return history[i - 1][1] if i else None\n\nif __name__ == \"__main__\":\n    c = Cache(capacity=2)\n    c.put(\"a\", 1, 10)\n    c.put(\"b\", 2, 10)\n    c.get(\"a\")                               # a is now newer than b\n    c.put(\"c\", 3, 10)                        # over capacity: b goes\n    print(list(c.data), c.get(\"b\"))",
     "notes": {
      "10": "The order of this dict is recency order: least recently used first, most recent last.",
      "14": "A write is a use, so the key moves to the recent end.",
      "16": "Evicts from the front: the least recently used key, with its whole history.",
      "21": "A read changes the order too. Remember this at thread safety: `get` writes to the OrderedDict."
     }
    },
    {
     "t": "p",
     "text": "Cost: both moves are O(1), so put and get cost what they did before. Memory is now bounded by the capacity, in keys, each with its full history."
    },
    {
     "t": "predict",
     "id": "lld-kvstore-l5-predict",
     "q": "The demo reads 'a' before it writes 'c'. What does it print: the keys left, then what get('b') returns?",
     "answer": "['a', 'c'] None",
     "why": "Writing a then b gives the order a, b. Reading a moves it to the end: b, a. Writing c gives b, a, c, which is over the capacity of 2, so the front (b) is dropped. The keys left are a and c, and b is gone."
    }
   ]
  },
  {
   "id": "lld-kvstore-l6",
   "title": "Layer 6: a TTL, and the finished file",
   "blocks": [
    {
     "t": "p",
     "text": "A TTL means a key stops being readable some time after it was written. Decide three things out loud. What does the time count from? Here, the last write. Which clock? Wall time, injected so a test can move it. When is an expired key removed? Lazily, when someone touches it, which costs nothing when nobody does. The honest cost is that expired keys sit in memory until they are touched or evicted."
    },
    {
     "t": "p",
     "text": "The cache now needs a stamp per key next to its history, so a small `Entry` replaces the bare list. This is the whole file."
    },
    {
     "t": "code",
     "id": "lld-kvstore-l6-code",
     "title": "Layer 6: the finished file",
     "code": "import time\nfrom bisect import bisect_right, insort\nfrom collections import OrderedDict\nfrom dataclasses import dataclass, field\nfrom operator import itemgetter\n\nts_of = itemgetter(0)\n\n@dataclass\nclass Entry:\n    hist: list = field(default_factory=list)   # sorted (ts, value) pairs\n    stamp: float = 0.0                         # clock() at the last write\n\nclass Cache:\n    def __init__(self, capacity, ttl, clock=time.monotonic):\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.data = OrderedDict()              # key -> Entry, least recently used first\n\n    def _live(self, key):                      # the entry, or None if missing or expired\n        e = self.data.get(key)\n        if e and self.clock() - e.stamp > self.ttl:\n            del self.data[key]\n            return None\n        return e\n\n    def put(self, key, value, ts):\n        e = self._live(key) or self.data.setdefault(key, Entry())\n        insort(e.hist, (ts, value), key=ts_of)\n        e.stamp = self.clock()\n        self.data.move_to_end(key)\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)\n\n    def get(self, key, at=None):\n        e = self._live(key)\n        if e is None:\n            return None\n        self.data.move_to_end(key)\n        i = len(e.hist) if at is None else bisect_right(e.hist, at, key=ts_of)\n        return e.hist[i - 1][1] if i else None\n\nif __name__ == \"__main__\":\n    now = [0.0]                                # a fake clock we can move\n    c = Cache(capacity=2, ttl=10, clock=lambda: now[0])\n    c.put(\"a\", \"v1\", ts=100)\n    c.put(\"a\", \"v3\", ts=300)\n    c.put(\"a\", \"v2\", ts=200)                   # arrives late\n    print(c.get(\"a\"), c.get(\"a\", at=250), c.get(\"a\", at=50))\n    c.put(\"b\", \"x\", ts=1)\n    now[0] = 5\n    c.put(\"c\", \"y\", ts=1)                      # capacity 2: a is the least recently used\n    print(c.get(\"a\"), c.get(\"b\"))\n    now[0] = 11                                # b is 11 old (> ttl 10), c is 6 old\n    print(c.get(\"b\"), c.get(\"c\"))",
     "notes": {
      "12": "When this key was last written, by the injected clock. This is not the event timestamp `ts`.",
      "15": "The clock is a parameter. The demo passes a fake one, so the output is always the same.",
      "19": "The one place that answers 'is this key readable?'. An expired entry is deleted here, on access.",
      "27": "An expired key is treated as new: its old history is gone.",
      "29": "Every write restarts the TTL. A read does not extend a key's life."
     },
     "ask": {
      "q": "Click the line where an expired key is actually removed.",
      "lines": [
       22
      ],
      "why": "Lazy expiry: nothing sweeps the dict. A key is deleted only when someone touches it, inside `_live`, which both `put` and `get` call. That is why expired keys can sit in memory until they are touched or evicted."
     }
    },
    {
     "t": "predict",
     "id": "lld-kvstore-l6-predict",
     "q": "Trace the demo with its fake clock. What are the three lines it prints?",
     "answer": "v3 v2 None\nNone x\nNone y",
     "why": "Line 1: after the late v2 is slotted in, the latest is v3, the value as of 250 is v2, and nothing exists as of 50. Line 2: with a capacity of 2, writing c pushes out a, the least recently used. Key b is still alive, 5 seconds old. Line 3: at time 11, b is 11 seconds old, over the ttl of 10, so it is gone. Key c was written at time 5, so it is 6 seconds old and alive."
    }
   ]
  },
  {
   "id": "lld-kvstore-ext",
   "title": "Extension follow-ups",
   "blocks": [
    {
     "t": "p",
     "text": "Two follow-ups the interviewer is likely to ask on the finished file. Try each before you open the solution."
    },
    {
     "t": "write",
     "id": "lld-kvstore-w-lock",
     "q": "Many threads share one Cache. Make it safe without editing `Cache`: wrap it. Where does the lock go, and why is one lock for both methods the right size here?",
     "starter": "class SafeCache:\n    \"\"\"Many threads share one Cache. Wrap it; do not edit Cache.\"\"\"\n    def __init__(self, cache):\n        self._cache = cache\n\n    def put(self, key, value, ts):\n        return self._cache.put(key, value, ts)\n\n    def get(self, key, at=None):\n        return self._cache.get(key, at)",
     "solution": "import threading\n\nclass SafeCache:\n    def __init__(self, cache):\n        self._cache = cache\n        self._lock = threading.Lock()\n\n    def put(self, key, value, ts):\n        with self._lock:\n            return self._cache.put(key, value, ts)\n\n    def get(self, key, at=None):\n        with self._lock:                 # a read reorders the LRU, so it needs the lock too\n            return self._cache.get(key, at)",
     "hint": "One lock object, held in a `with` block in both put and get. Reads need it too.",
     "why": "A read is a write here: `get` calls `move_to_end` and may delete an expired entry, so it needs the lock as much as `put`. One lock for the whole cache is the simple, correct answer, because the LRU order is a single shared structure that per-key locks cannot protect. If one lock becomes the bottleneck, shard: N independent caches, each with its own lock, chosen by `hash(key) % N`, with the capacity split between them. A wrapper leaves the single-threaded logic untouched and testable. Putting the lock inside `Cache` is also possible, but then `get` holds it while calling `_live`, and a plain `Lock` taken a second time there would deadlock."
    },
    {
     "t": "write",
     "id": "lld-kvstore-w-ttl",
     "q": "Some keys need their own TTL. Let `put` take an optional `ttl` that applies to that key, and fall back to the cache default when it is not given.",
     "starter": "@dataclass\nclass Entry:\n    hist: list = field(default_factory=list)   # sorted (ts, value) pairs\n    stamp: float = 0.0                         # clock() at the last write\n\nclass Cache:\n    def __init__(self, capacity, ttl, clock=time.monotonic):\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.data = OrderedDict()              # key -> Entry, least recently used first\n\n    def _live(self, key):                      # the entry, or None if missing or expired\n        e = self.data.get(key)\n        if e and self.clock() - e.stamp > self.ttl:\n            del self.data[key]\n            return None\n        return e\n\n    def put(self, key, value, ts):\n        e = self._live(key) or self.data.setdefault(key, Entry())\n        insort(e.hist, (ts, value), key=ts_of)\n        e.stamp = self.clock()\n        self.data.move_to_end(key)\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)",
     "solution": "@dataclass\nclass Entry:\n    hist: list = field(default_factory=list)   # sorted (ts, value) pairs\n    stamp: float = 0.0                         # clock() at the last write\n    ttl: float | None = None                   # this key's own ttl; None means the default\n\nclass Cache:\n    def __init__(self, capacity, ttl, clock=time.monotonic):\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.data = OrderedDict()              # key -> Entry, least recently used first\n\n    def _live(self, key):                      # the entry, or None if missing or expired\n        e = self.data.get(key)\n        if e and self.clock() - e.stamp > (self.ttl if e.ttl is None else e.ttl):\n            del self.data[key]\n            return None\n        return e\n\n    def put(self, key, value, ts, ttl=None):\n        e = self._live(key) or self.data.setdefault(key, Entry())\n        insort(e.hist, (ts, value), key=ts_of)\n        e.stamp, e.ttl = self.clock(), ttl\n        self.data.move_to_end(key)\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)",
     "hint": "The TTL belongs on the entry, next to the stamp it is compared with.",
     "why": "Put the data next to the thing it is compared with: the stamp and the key's own ttl both live on the Entry, and `_live` is still the only place that decides expiry. One choice to say aloud: a put without a ttl sets the key back to the default. If the interviewer wants the earlier per-key value kept, only the line `e.stamp, e.ttl = self.clock(), ttl` changes."
    }
   ]
  },
  {
   "id": "lld-kvstore-listen",
   "title": "What they listen for",
   "blocks": [
    {
     "t": "list",
     "items": [
      "Start simple, then grow: you built what was asked at each step and said what it cost. You did not write the final class first.",
      "Name the structure and its cost each time: dict O(1), sorted list with bisect O(log n), insort O(n) shift, OrderedDict O(1) for recency.",
      "Say the assumption each layer rests on: layers 2 and 3 need writes in order, and layer 4 removes that need.",
      "bisect_right minus one: the detail that answers 'at or before' correctly, including a write exactly at the time.",
      "Reads are writes in an LRU: `get` reorders the structure, so a thread-safe version locks both methods.",
      "Lazy expiry: simple, and free when idle. The cost is memory held until a key is touched. A background sweeper or a heap of expiry times is the next step, and you name it without building it.",
      "What you would not add: a Storage interface, generics, a class per layer, a decorator framework. One class that grows is the right size."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-kvstore-listen-mcq",
     "q": "Why does the thread-safe version lock get as well as put?",
     "o": [
      "get could return a half-written value from the dict",
      "get moves the key to the recent end and may delete an expired key, so it changes shared state",
      "Python requires a lock for every dict access",
      "get is slower than put, so it needs more protection"
     ],
     "a": 1,
     "why": "In a plain dict a read is harmless. In an LRU cache a read reorders the OrderedDict, and with a TTL it may also delete an entry. Two threads doing that at once can corrupt the recency order, so both methods take the lock."
    }
   ]
  }
 ]
});
