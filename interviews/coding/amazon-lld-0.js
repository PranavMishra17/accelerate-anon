/* Amazon loop, LLD part 0: the building blocks, ported from Pranav's own lld-path.html (29 Oct 2026).
   Edit this file directly; the source page is no longer read. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-0-oop",
 "n": 0.1,
 "one": true,
 "title": "OOP basics",
 "minutes": 60,
 "lead": "The building blocks under every design drill: class, object, constructor, static, final, overloading, overriding. One idea a screen: the figure, the code, the rules, the questions they ask, then a check.",
 "sections": [
  {
   "id": "l0-class",
   "title": "Class",
   "blocks": [
    {
     "t": "p",
     "text": "A blueprint. It declares the data (attributes) and behavior (methods) every object of that type will have. Defining a class creates no instances."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 210\" role=\"img\" aria-label=\"One Car class, three Car objects\">\n<rect class=\"d-box\" x=\"10\" y=\"40\" width=\"124\" height=\"128\" rx=\"6\"/>\n<text class=\"d-b\" x=\"72\" y=\"62\" text-anchor=\"middle\">Car</text>\n<line class=\"d-ln\" x1=\"10\" y1=\"74\" x2=\"134\" y2=\"74\"/>\n<text class=\"d-t\" x=\"22\" y=\"94\">model</text><text class=\"d-t\" x=\"22\" y=\"112\">speed</text>\n<line class=\"d-ln\" x1=\"10\" y1=\"124\" x2=\"134\" y2=\"124\"/>\n<text class=\"d-t\" x=\"22\" y=\"148\">accelerate()</text>\n<path class=\"d-ar\" d=\"M134 104 L196 35\"/><path class=\"d-ar\" d=\"M134 104 L196 105\"/><path class=\"d-ar\" d=\"M134 104 L196 175\"/>\n<text class=\"d-a\" x=\"146\" y=\"62\">Car()</text>\n<rect class=\"d-acc\" x=\"200\" y=\"12\" width=\"130\" height=\"46\" rx=\"6\"/><text class=\"d-b\" x=\"212\" y=\"32\">civic</text><text class=\"d-s\" x=\"212\" y=\"49\">speed = 40</text>\n<rect class=\"d-acc\" x=\"200\" y=\"82\" width=\"130\" height=\"46\" rx=\"6\"/><text class=\"d-b\" x=\"212\" y=\"102\">model3</text><text class=\"d-s\" x=\"212\" y=\"119\">speed = 0</text>\n<rect class=\"d-acc\" x=\"200\" y=\"152\" width=\"130\" height=\"46\" rx=\"6\"/><text class=\"d-b\" x=\"212\" y=\"172\">corolla</text><text class=\"d-s\" x=\"212\" y=\"189\">speed = 25</text>\n</svg>",
     "alt": "Class"
    },
    {
     "t": "code",
     "code": "class Car:\n    wheels = 4                    # class attribute: shared by all cars\n\n    def __init__(self, model):\n        self.model = model        # instance attribute: one per car\n        self.speed = 0\n\n    def accelerate(self, by):     # self is the object the method runs on\n        self.speed += by"
    },
    {
     "t": "list",
     "items": [
      "`car.accelerate(10)` is exactly `Car.accelerate(car, 10)`. That is all `self` is.",
      "Attribute lookup goes instance first, then class, then parents. Assigning on the instance never touches the class."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Parking Lot opens with nouns turned into classes: `ParkingLot`, `Level`, `Spot`, `Vehicle`, `Ticket`. Name them out loud before you write code."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Class vs object in one line?",
       "a": "A class is the type definition. An object is one instance of it, with its own attribute values."
      },
      {
       "q": "What exactly is self?",
       "a": "The instance the method was called on, passed in automatically as the first argument. The name is only a convention."
      },
      {
       "q": "Where are attributes stored?",
       "a": "Instance attributes in `obj.__dict__`, class attributes in `Car.__dict__`. `__slots__` replaces the per-object dict to save memory and block new attributes."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **datetime.date** holds year, month, day and exposes behavior like `weekday()` and `isoformat()`."
    },
    {
     "t": "mcq",
     "id": "l0p-class",
     "q": "Right after `class Car: pass` runs, how many Car instances exist?",
     "o": [
      "One",
      "Zero",
      "One per method"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-object",
   "title": "Object",
   "blocks": [
    {
     "t": "p",
     "text": "An instance created by calling the class. Variables are names that point at objects. Assignment never copies."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Names a and b point to the same object, c to another\">\n<text class=\"d-s\" x=\"50\" y=\"20\" text-anchor=\"middle\">names</text><text class=\"d-s\" x=\"265\" y=\"20\" text-anchor=\"middle\">objects</text>\n<rect class=\"d-box\" x=\"10\" y=\"36\" width=\"80\" height=\"34\" rx=\"6\"/><text class=\"d-t\" x=\"50\" y=\"58\" text-anchor=\"middle\">a</text>\n<rect class=\"d-box\" x=\"10\" y=\"86\" width=\"80\" height=\"34\" rx=\"6\"/><text class=\"d-t\" x=\"50\" y=\"108\" text-anchor=\"middle\">b</text>\n<rect class=\"d-box\" x=\"10\" y=\"136\" width=\"80\" height=\"34\" rx=\"6\"/><text class=\"d-t\" x=\"50\" y=\"158\" text-anchor=\"middle\">c</text>\n<rect class=\"d-acc\" x=\"200\" y=\"40\" width=\"130\" height=\"62\" rx=\"6\"/><text class=\"d-b\" x=\"214\" y=\"64\">Car #1</text><text class=\"d-s\" x=\"214\" y=\"84\">speed = 50</text>\n<rect class=\"d-box\" x=\"200\" y=\"128\" width=\"130\" height=\"52\" rx=\"6\"/><text class=\"d-b\" x=\"214\" y=\"150\">Car #2</text><text class=\"d-s\" x=\"214\" y=\"168\">speed = 0</text>\n<path class=\"d-ara\" d=\"M90 53 L196 64\"/><path class=\"d-ara\" d=\"M90 103 L196 80\"/><path class=\"d-ar\" d=\"M90 153 L196 153\"/>\n</svg>",
     "alt": "Object"
    },
    {
     "t": "code",
     "code": "a = Car(\"Civic\")     # object #1, a points to it\nb = a                # no copy: b points to #1 too\nb.speed = 50\n\nprint(a.speed)       # 50, same object\nprint(a is b)        # True, same identity\n\nc = Car(\"Civic\")     # object #2\nprint(a is c)        # False, different objects\nprint(a == c)        # False too, until Car defines __eq__"
    },
    {
     "t": "list",
     "items": [
      "`is` compares identity. `==` calls `__eq__`, which defaults to identity.",
      "An object is freed when nothing points to it: reference counting plus a cycle collector."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** In Amazon Locker, one `Package` object is referenced by the order, the slot and the pickup code. A change through any reference is seen by all of them, which is exactly what you want there."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Pass by value or by reference?",
       "a": "Neither. Python passes object references (call by sharing). A function can mutate the object it receives, but rebinding the parameter does nothing to the caller."
      },
      {
       "q": "Mutable vs immutable?",
       "a": "`int`, `str`, `tuple`, `frozenset` can't change. `list`, `dict`, `set` and most of your classes can. Only immutable (hashable) objects make safe dict keys."
      },
      {
       "q": "How do you copy an object?",
       "a": "`copy.copy(obj)` is shallow: nested objects stay shared. `copy.deepcopy(obj)` copies all the way down."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** In the REPL, **a = 256; b = 256; a is b** is True but with 257 it is False: CPython caches small ints as shared objects."
    },
    {
     "t": "mcq",
     "id": "l0p-object",
     "q": "What prints?",
     "code": "a = Car(\"Civic\")\nb = a\nb.speed = 50\nprint(a.speed)",
     "o": [
      "0",
      "50",
      "AttributeError"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-constructor",
   "title": "Constructor",
   "blocks": [
    {
     "t": "p",
     "text": "__init__ runs right after the object is created, to put it in a valid state. __new__ is the step that actually creates it; you rarely touch it."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 276\" role=\"img\" aria-label=\"What happens on Car(&quot;Civic&quot;)\">\n<rect class=\"d-acc\" x=\"20\" y=\"8\" width=\"300\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"36\" y=\"29\">Car(\"Civic\")</text><path class=\"d-ar\" d=\"M170 40 L170 52\"/><rect class=\"d-box\" x=\"20\" y=\"54\" width=\"300\" height=\"32\" rx=\"6\"/><text class=\"d-t\" x=\"36\" y=\"75\">Car.__new__(Car)</text><path class=\"d-ar\" d=\"M170 86 L170 98\"/><rect class=\"d-box\" x=\"20\" y=\"100\" width=\"300\" height=\"32\" rx=\"6\"/><text class=\"d-t\" x=\"36\" y=\"121\">empty object exists</text><path class=\"d-ar\" d=\"M170 132 L170 144\"/><rect class=\"d-acc\" x=\"20\" y=\"146\" width=\"300\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"36\" y=\"167\">Car.__init__(obj, \"Civic\")</text><path class=\"d-ar\" d=\"M170 178 L170 190\"/><rect class=\"d-box\" x=\"20\" y=\"192\" width=\"300\" height=\"32\" rx=\"6\"/><text class=\"d-t\" x=\"36\" y=\"213\">self.model = \"Civic\"</text><path class=\"d-ar\" d=\"M170 224 L170 236\"/><rect class=\"d-box\" x=\"20\" y=\"238\" width=\"300\" height=\"32\" rx=\"6\"/><text class=\"d-t\" x=\"36\" y=\"259\">object returned</text>\n</svg>",
     "alt": "Constructor"
    },
    {
     "t": "code",
     "code": "class Car:\n    def __init__(self, model=\"Unknown\", speed=0):  # defaults replace extra constructors\n        self.model = model\n        self.speed = speed\n\n    @classmethod\n    def from_string(cls, text):    # alternative constructor: Car.from_string(\"Civic:40\")\n        model, speed = text.split(\":\")\n        return cls(model, int(speed))\n\nclass Tesla(Car):\n    def __init__(self, autopilot=True):\n        super().__init__(\"Tesla\")  # parent __init__ runs only if you call it\n        self.autopilot = autopilot"
    },
    {
     "t": "list",
     "items": [
      "A class has one `__init__`. Use default arguments or `@classmethod` factories for other ways to build it.",
      "A subclass `__init__` replaces the parent's. Without `super().__init__(...)` the parent's attributes never get set."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** A `Ticket` without a spot or entry time should never exist. Validate in `__init__`, and use a classmethod like `Ticket.issue(spot)` when creating one takes several steps."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "__new__ vs __init__?",
       "a": "`__new__(cls)` creates and returns the instance. `__init__(self)` fills it in and returns None. Override `__new__` for singletons or when subclassing immutables like `str`."
      },
      {
       "q": "Can __init__ return a value?",
       "a": "No. Returning anything other than None raises `TypeError`."
      },
      {
       "q": "Private constructor in Python?",
       "a": "There isn't one. Signal intent with a classmethod factory, or control creation in `__new__` for a singleton."
      },
      {
       "q": "What happens on Car(\"Civic\")?",
       "a": "`Car.__new__` makes an empty object, `Car.__init__` runs on it with \"Civic\", and the object is returned."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **dict.fromkeys()** and **datetime.fromtimestamp()** are classmethod alternative constructors."
    },
    {
     "t": "mcq",
     "id": "l0p-constructor",
     "q": "What happens?",
     "code": "class Car:\n    def __init__(self, model):\n        self.model = model\n\nCar()",
     "o": [
      "A Car with model None",
      "TypeError",
      "A Car with model \"\""
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-static",
   "title": "static",
   "blocks": [
    {
     "t": "p",
     "text": "Python has no static keyword. Class attributes are shared by every instance, and @staticmethod / @classmethod are methods that don't need an instance."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Three objects share one class attribute count\">\n<rect class=\"d-acc\" x=\"95\" y=\"10\" width=\"150\" height=\"62\" rx=\"6\"/>\n<text class=\"d-a\" x=\"170\" y=\"34\" text-anchor=\"middle\">Car.count</text><text class=\"d-big\" x=\"170\" y=\"62\" text-anchor=\"middle\">3</text>\n<path class=\"d-dash\" d=\"M60 136 L150 72\"/><path class=\"d-dash\" d=\"M170 136 L170 72\"/><path class=\"d-dash\" d=\"M280 136 L190 72\"/>\n<rect class=\"d-box\" x=\"10\" y=\"136\" width=\"100\" height=\"52\" rx=\"6\"/><text class=\"d-b\" x=\"22\" y=\"158\">car 1</text><text class=\"d-s\" x=\"22\" y=\"176\">model = A</text>\n<rect class=\"d-box\" x=\"120\" y=\"136\" width=\"100\" height=\"52\" rx=\"6\"/><text class=\"d-b\" x=\"132\" y=\"158\">car 2</text><text class=\"d-s\" x=\"132\" y=\"176\">model = B</text>\n<rect class=\"d-box\" x=\"230\" y=\"136\" width=\"100\" height=\"52\" rx=\"6\"/><text class=\"d-b\" x=\"242\" y=\"158\">car 3</text><text class=\"d-s\" x=\"242\" y=\"176\">model = C</text>\n</svg>",
     "alt": "static"
    },
    {
     "t": "code",
     "code": "class Car:\n    count = 0                    # class attribute: one shared copy\n\n    def __init__(self, model):\n        self.model = model\n        Car.count += 1           # update the class, not self\n\n    @staticmethod\n    def is_valid_plate(plate):   # no self, no cls: a plain helper\n        return len(plate) == 7\n\n    @classmethod\n    def total(cls):              # receives the class, works for subclasses\n        return cls.count\n\nCar(\"A\"); Car(\"B\"); Car(\"C\")\nprint(Car.total())               # 3"
    },
    {
     "t": "list",
     "items": [
      "`self.count += 1` creates a new instance attribute that hides the shared one.",
      "A mutable class attribute like `items = []` is one list shared by every instance."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** A class-level `next_id` counter is fine in the round. Expect the follow-up \"two kiosks issue tickets at once?\" and mention a lock."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "staticmethod vs classmethod?",
       "a": "A staticmethod gets no automatic argument; it's a function grouped in the class. A classmethod gets `cls`, so it respects inheritance: use it for factories and class-level state."
      },
      {
       "q": "When to use which?",
       "a": "Needs object state: instance method. Builds instances: classmethod. Pure helper: staticmethod, or simply a module-level function."
      },
      {
       "q": "Simplest singleton in Python?",
       "a": "A module-level instance. Modules are imported once, so every import gets the same object."
      },
      {
       "q": "Cost of class-level state in LLD?",
       "a": "It's global mutable state: hard to test, hard to swap, not thread-safe. Pass dependencies in instead."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **int.from_bytes()** and **dict.fromkeys()** are classmethods. **str.maketrans()** is a staticmethod."
    },
    {
     "t": "mcq",
     "id": "l0p-static",
     "q": "What prints?",
     "code": "class Car:\n    count = 0\n    def __init__(self):\n        Car.count += 1\n\nCar(); Car(); Car()\nprint(Car.count)",
     "o": [
      "1",
      "3",
      "0"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-final",
   "title": "final",
   "blocks": [
    {
     "t": "p",
     "text": "Python doesn't enforce final at runtime. typing.Final and @final mark intent for type checkers like mypy. For real immutability use tuples, frozen dataclasses or read-only properties."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 176\" role=\"img\" aria-label=\"Three ways to lock things in Python\">\n<rect class=\"d-box\" x=\"10\" y=\"8\" width=\"320\" height=\"44\" rx=\"6\"/>\n  <rect class=\"d-lock\" x=\"24\" y=\"28\" width=\"16\" height=\"13\" rx=\"2\"/><path class=\"d-lock\" d=\"M27 28 v-4 a5 5 0 0 1 10 0 v4\"/>\n  <text class=\"d-t\" x=\"56\" y=\"35\">MAX: Final = 4</text><text class=\"d-s\" x=\"318\" y=\"35\" text-anchor=\"end\">checker only</text><rect class=\"d-box\" x=\"10\" y=\"64\" width=\"320\" height=\"44\" rx=\"6\"/>\n  <rect class=\"d-lock\" x=\"24\" y=\"84\" width=\"16\" height=\"13\" rx=\"2\"/><path class=\"d-lock\" d=\"M27 84 v-4 a5 5 0 0 1 10 0 v4\"/>\n  <text class=\"d-t\" x=\"56\" y=\"91\">@final class</text><text class=\"d-s\" x=\"318\" y=\"91\" text-anchor=\"end\">checker only</text><rect class=\"d-acc\" x=\"10\" y=\"120\" width=\"320\" height=\"44\" rx=\"6\"/>\n  <rect class=\"d-lock\" x=\"24\" y=\"140\" width=\"16\" height=\"13\" rx=\"2\"/><path class=\"d-lock\" d=\"M27 140 v-4 a5 5 0 0 1 10 0 v4\"/>\n  <text class=\"d-t\" x=\"56\" y=\"147\">frozen dataclass</text><text class=\"d-a\" x=\"318\" y=\"147\" text-anchor=\"end\">enforced</text>\n</svg>",
     "alt": "final"
    },
    {
     "t": "code",
     "code": "from dataclasses import dataclass\nfrom typing import Final, final\n\nMAX_SEATS: Final = 4         # constant: mypy flags any reassignment\n\n@final\nclass Money:                 # mypy: Money can't be subclassed\n    ...\n\n@dataclass(frozen=True)\nclass Point:                 # immutability enforced at runtime\n    x: int\n    y: int\n\np = Point(1, 2)\n# p.x = 5                    # FrozenInstanceError\n\nTAGS: Final = [\"sale\"]\nTAGS.append(\"new\")           # allowed: Final locks the name, not the list"
    },
    {
     "t": "list",
     "items": [
      "`Final` stops rebinding the name, and only under a type checker. The object stays mutable.",
      "UPPER_CASE names are constants by convention. Python itself never stops reassignment."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Make small value objects frozen: `@dataclass(frozen=True)` for `Size` or `Location`. Fewer moving parts when the interviewer starts adding requirements."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "How do you make an immutable class?",
       "a": "`@dataclass(frozen=True)` or `typing.NamedTuple`. Manually: private attributes, read-only `@property`, no setters, plus `__slots__`."
      },
      {
       "q": "Why is str immutable?",
       "a": "So strings are hashable (safe dict keys), can be interned and shared, and are safe across threads."
      },
      {
       "q": "How do you stop a method being overridden?",
       "a": "`@typing.final` on the method, enforced by the type checker only. Nothing stops it at runtime."
      },
      {
       "q": "Can a tuple hold something mutable?",
       "a": "Yes. `t = ([1],)` then `t[0].append(2)` works. That tuple is then unhashable."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **str**, **tuple**, **frozenset** and **datetime.date** are the immutable built-ins you use daily."
    },
    {
     "t": "mcq",
     "id": "l0p-final",
     "q": "What prints?",
     "code": "from typing import Final\nLIMIT: Final = 10\nLIMIT = 20\nprint(LIMIT)",
     "o": [
      "10",
      "20",
      "Runtime error"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-overloading",
   "title": "Overloading",
   "blocks": [
    {
     "t": "p",
     "text": "Python has no Java-style overloading: a second def with the same name replaces the first. You get the same effect with default arguments, *args, or singledispatch."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 210\" role=\"img\" aria-label=\"The second def add replaces the first\">\n<rect class=\"d-dim\" x=\"10\" y=\"10\" width=\"200\" height=\"34\" rx=\"6\"/><text class=\"d-s\" x=\"22\" y=\"32\">def add(self, a, b)</text><line class=\"d-ln\" x1=\"20\" y1=\"28\" x2=\"170\" y2=\"28\"/>\n<rect class=\"d-acc\" x=\"10\" y=\"58\" width=\"200\" height=\"34\" rx=\"6\"/><text class=\"d-a\" x=\"22\" y=\"80\">def add(self, a, b, c)</text>\n<text class=\"d-s\" x=\"222\" y=\"54\">last def wins</text>\n<rect class=\"d-box\" x=\"10\" y=\"128\" width=\"200\" height=\"34\" rx=\"6\"/><text class=\"d-t\" x=\"22\" y=\"150\">calc.add(2, 3)</text>\n<path class=\"d-ar\" d=\"M110 128 L110 96\"/>\n<text class=\"d-a\" x=\"10\" y=\"190\" style=\"fill:var(--bad)\">TypeError: missing 'c'</text>\n</svg>",
     "alt": "Overloading"
    },
    {
     "t": "code",
     "code": "class Calc:\n    def add(self, a, b, c=0):    # one def covers 2 or 3 numbers\n        return a + b + c\n\n    def total(self, *nums):      # any count\n        return sum(nums)\n\nfrom functools import singledispatchmethod\n\nclass Printer:\n    @singledispatchmethod\n    def show(self, x):           # fallback for any type\n        return f\"thing {x}\"\n\n    @show.register\n    def _(self, x: int):         # chosen when x is an int\n        return f\"int {x}\"\n\n    @show.register\n    def _(self, x: str):\n        return f\"str {x}\"\n\nPrinter().show(5)                # 'int 5', chosen at call time by type"
    },
    {
     "t": "list",
     "items": [
      "Defining `add` twice keeps only the last one, with no error or warning.",
      "`typing.overload` only describes signatures for type checkers. It doesn't dispatch anything."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** When a new option arrives mid-round, a default argument like `park(vehicle, level=None)` adds it without breaking existing calls."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Does Python support method overloading?",
       "a": "Not by signature. A name points to one function object. Use defaults, `*args`/`**kwargs`, or `functools.singledispatch`."
      },
      {
       "q": "What about operator overloading?",
       "a": "Fully supported: define `__add__`, `__eq__`, `__lt__`, `__len__`. Often this is what an interviewer means in Python."
      },
      {
       "q": "singledispatch vs an isinstance chain?",
       "a": "New types register without editing the original function, so it stays open for extension. That is the Open/Closed principle from SOLID."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **a + b** calls `a.__add__(b)`, and **len(x)** calls `x.__len__()`. Every built-in type uses operator overloading."
    },
    {
     "t": "mcq",
     "id": "l0p-overloading",
     "q": "What happens?",
     "code": "class Calc:\n    def add(self, a, b): return a + b\n    def add(self, a, b, c): return a + b + c\n\nCalc().add(1, 2)",
     "o": [
      "Returns 3",
      "TypeError",
      "SyntaxError"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-overriding",
   "title": "Overriding",
   "blocks": [
    {
     "t": "p",
     "text": "A subclass defines a method with the same name as its parent. Python looks the method up on the actual object's class first, at runtime."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Lookup finds Dog.sound before Animal.sound\">\n<text class=\"d-a\" x=\"10\" y=\"74\">a.sound()</text>\n<rect class=\"d-box\" x=\"10\" y=\"86\" width=\"104\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"62\" y=\"110\" text-anchor=\"middle\">a: Animal</text>\n<path class=\"d-ara\" d=\"M114 106 L168 106\"/>\n<rect class=\"d-box\" x=\"172\" y=\"20\" width=\"158\" height=\"168\" rx=\"8\"/><text class=\"d-b\" x=\"186\" y=\"44\">Dog object</text>\n<rect class=\"d-acc\" x=\"184\" y=\"60\" width=\"134\" height=\"52\" rx=\"6\"/><text class=\"d-a\" x=\"196\" y=\"82\">1. Dog.sound()</text><text class=\"d-s\" x=\"196\" y=\"100\">\"Woof\"  found</text>\n<rect class=\"d-dim\" x=\"184\" y=\"124\" width=\"134\" height=\"36\" rx=\"6\"/><text class=\"d-s\" x=\"196\" y=\"147\">2. Animal.sound()</text>\n<text class=\"d-s\" x=\"186\" y=\"178\">order = Dog.__mro__</text>\n</svg>",
     "alt": "Overriding"
    },
    {
     "t": "code",
     "code": "from typing import override      # Python 3.12+\n\nclass Animal:\n    def sound(self):\n        return \"...\"\n\nclass Dog(Animal):\n    @override                      # type checker confirms a parent has sound()\n    def sound(self):\n        return \"Woof\"\n\na: Animal = Dog()\nprint(a.sound())                   # Woof: decided by the object"
    },
    {
     "t": "list",
     "items": [
      "Lookup follows the MRO: `Dog.__mro__` is Dog, Animal, object. The first match wins.",
      "Parameters aren't checked at runtime. An override with a different signature silently breaks callers."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** This is what keeps follow-ups to a one-line change: `fits(spot)` overridden in `Bike`, `Car`, `Truck`. Adding `ElectricCar` is one new class, not an edited if-chain."
    },
    {
     "t": "table",
     "head": [
      "",
      "Overloading",
      "Overriding"
     ],
     "rows": [
      [
       "Where",
       "Same class",
       "Subclass"
      ],
      [
       "How in Python",
       "Defaults, *args, singledispatch, dunders",
       "Same method name in the subclass"
      ],
      [
       "Decided",
       "At call time, by arguments or their type",
       "At call time, by the object's class (MRO)"
      ],
      [
       "Two defs, same name",
       "Last one silently wins",
       "Child wins over parent"
      ],
      [
       "In Java, for contrast",
       "By signature, compile time",
       "Same as Python, runtime"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Why use @override?",
       "a": "A typo like `def sond(self)` quietly adds a new method. With `@override`, mypy or pyright flag it. Built in since 3.12; use `typing_extensions` before that."
      },
      {
       "q": "How do you call the parent version?",
       "a": "`super().sound()`. With multiple inheritance, `super()` follows the MRO, not just the direct parent."
      },
      {
       "q": "Overriding __eq__: any catch?",
       "a": "Yes. Defining `__eq__` sets `__hash__` to None, so instances can't go in sets or be dict keys until you define `__hash__` too."
      },
      {
       "q": "Can classmethods and staticmethods be overridden?",
       "a": "Yes in Python, unlike Java. They are looked up through the class like any other attribute."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **collections.OrderedDict** subclasses `dict` and overrides methods like `popitem()`. Every custom exception overrides `__str__` or `__init__`."
    },
    {
     "t": "mcq",
     "id": "l0p-overriding",
     "q": "What prints?",
     "code": "class Animal:\n    def sound(self): return \"...\"\nclass Dog(Animal):\n    def sound(self): return \"Woof\"\n\na = Dog()\nprint(a.sound())",
     "o": [
      "...",
      "Woof",
      "Both"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-oop-bugs",
   "title": "Find the bug",
   "blocks": [
    {
     "t": "p",
     "text": "Each snippet has one line that causes the error. Click it; the fix appears after."
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-0",
     "code": "class Car:\n    def __init__(self, model):\n        model = model\n\nc = Car(\"Civic\")\nprint(c.model)",
     "ask": {
      "q": "AttributeError: Car has no attribute model.",
      "lines": [
       3
      ],
      "why": "This only rebinds the local parameter. Write `self.model = model`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-1",
     "code": "class Car:\n    def __int__(self, model):\n        self.model = model\n\nCar(\"Civic\")",
     "ask": {
      "q": "TypeError: Car() takes no arguments.",
      "lines": [
       2
      ],
      "why": "`__int__` is the int-conversion hook. The constructor is `__init__`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-2",
     "code": "class Counter:\n    def __init__(self):\n        self.count = 0\n    def bump():\n        self.count += 1\n\nCounter().bump()",
     "ask": {
      "q": "TypeError: bump() takes 0 positional arguments.",
      "lines": [
       4
      ],
      "why": "Instance methods need `self` as the first parameter: `def bump(self):`"
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-3",
     "code": "class Order:\n    def __init__(self, items=[]):\n        self.items = items\n\na = Order(); a.items.append(\"pen\")\nb = Order()\nprint(b.items)   # ['pen']",
     "ask": {
      "q": "A new Order already has items in it.",
      "lines": [
       2
      ],
      "why": "The default list is created once and shared by every call. Use `items=None`, then `self.items = items or []`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-4",
     "code": "class Area:\n    def calc(self, r):\n        return 3.14 * r * r\n    def calc(self, w, h):\n        return w * h\n\nArea().calc(2)",
     "ask": {
      "q": "TypeError: calc() missing 1 required argument.",
      "lines": [
       4
      ],
      "why": "The second `def calc` replaces the first. Use separate names or one method with a default, e.g. `calc(self, w, h=None)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-5",
     "code": "class Car:\n    count = 0\n    def __init__(self):\n        self.count += 1\n\nCar(); Car()\nprint(Car.count)   # 0",
     "ask": {
      "q": "Car.count stays 0 after two cars.",
      "lines": [
       4
      ],
      "why": "This reads the class value, then writes a new instance attribute. Write `Car.count += 1` or `type(self).count += 1`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-oop-6",
     "code": "class Animal:\n    def sound(self):\n        return \"...\"\nclass Dog(Animal):\n    def sond(self):\n        return \"Woof\"\n\nprint(Dog().sound())",
     "ask": {
      "q": "Dog().sound() returns \"...\" instead of \"Woof\".",
      "lines": [
       5
      ],
      "why": "A typo adds a new method instead of overriding. `@override` plus mypy would have caught it."
     }
    }
   ]
  },
  {
   "id": "l0-oop-final",
   "title": "Final check",
   "blocks": [
    {
     "t": "p",
     "text": "One question per idea, mixed up. Answer before you look back."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-0",
     "q": "What prints?",
     "code": "class Car:\n    wheels = 4\n\na = Car(); b = Car()\na.wheels = 3\nprint(b.wheels, Car.wheels)",
     "o": [
      "3 3",
      "4 4",
      "3 4"
     ],
     "a": 1,
     "why": "`a.wheels = 3` creates an instance attribute on `a` only. `b` and the class still see 4."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-1",
     "q": "What prints?",
     "code": "def reset(car):\n    car.speed = 0\n    car = Car(\"New\")\n    car.speed = 99\n\nc = Car(\"Civic\")\nc.speed = 40\nreset(c)\nprint(c.speed)",
     "o": [
      "40",
      "0",
      "99"
     ],
     "a": 1,
     "why": "The function mutates the object it was given (0). Rebinding `car` only moves the local name."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-2",
     "q": "What happens?",
     "code": "class Car:\n    def __init__(self):\n        self.speed = 0\n\nclass Tesla(Car):\n    def __init__(self):\n        self.autopilot = True\n\nprint(Tesla().speed)",
     "o": [
      "0",
      "AttributeError",
      "None"
     ],
     "a": 1,
     "why": "Tesla's `__init__` replaces Car's and never calls `super().__init__()`, so `speed` is never set."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-3",
     "q": "What prints?",
     "code": "class Cart:\n    items = []\n    def add(self, x):\n        self.items.append(x)\n\na = Cart(); b = Cart()\na.add(\"pen\")\nprint(b.items)",
     "o": [
      "[]",
      "['pen']",
      "AttributeError"
     ],
     "a": 1,
     "why": "`items` is one list on the class. Appending mutates it, so every Cart sees it. Create it in `__init__` instead."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-4",
     "q": "What happens on the last line?",
     "code": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass P:\n    x: int\n\np = P(1)\np.x = 2",
     "o": [
      "p.x becomes 2",
      "FrozenInstanceError",
      "Only a mypy warning"
     ],
     "a": 1,
     "why": "`frozen=True` is enforced at runtime, unlike `Final` and `@final`."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-5",
     "q": "What prints?",
     "code": "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n    def __add__(self, other):\n        return Money(self.cents + other.cents)\n\nprint((Money(5) + Money(7)).cents)",
     "o": [
      "12",
      "57",
      "TypeError"
     ],
     "a": 0,
     "why": "`+` calls `__add__`. That is operator overloading."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-6",
     "q": "What prints?",
     "code": "class A:\n    def hi(self): return \"A\"\nclass B(A):\n    def hi(self): return \"B\"\nclass C(B):\n    pass\n\nprint(C().hi())",
     "o": [
      "A",
      "B",
      "AttributeError"
     ],
     "a": 1,
     "why": "The MRO is C, B, A, object. C has no `hi`, so B's is found first."
    },
    {
     "t": "mcq",
     "id": "l0f-oop-7",
     "q": "What happens?",
     "code": "class P:\n    def __init__(self, x): self.x = x\n    def __eq__(self, other): return self.x == other.x\n\ns = {P(1)}",
     "o": [
      "A set with one P",
      "TypeError: unhashable",
      "An empty set"
     ],
     "a": 1,
     "why": "Overriding `__eq__` sets `__hash__` to None. Add `def __hash__(self): return hash(self.x)`."
    }
   ]
  },
  {
   "id": "l0-oop-run",
   "title": "Run it, then go deeper",
   "blocks": [
    {
     "t": "p",
     "text": "Save this as `main.py` and run `python3 main.py`."
    },
    {
     "t": "code",
     "title": "main.py",
     "code": "# main.py   run with:  python3 main.py\nclass Car:\n    def __init__(self, model):\n        self.model = model\n        self.speed = 0\n\n    def accelerate(self, by):\n        self.speed += by\n\n\nif __name__ == \"__main__\":         # runs only when you execute this file\n    c = Car(\"Civic\")\n    c.accelerate(40)\n    print(c.model, c.speed)         # Civic 40"
    },
    {
     "t": "p",
     "text": "**Book:** Fluent Python (2nd ed.) by Luciano Ramalho. Chapters 1, 5, 11 and 14 cover the data model, dataclasses, Pythonic classes and inheritance."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "video",
       "req": true,
       "label": "Python OOP Tutorial 1: Classes and Instances",
       "url": "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
       "yt": {
        "id": "ZDa-Z5JzLYM",
        "ch": "Corey Schafer"
       },
       "m": 16,
       "why": "Classes, instances, __init__ and self, typed out step by step."
      },
      {
       "kind": "read",
       "req": true,
       "label": "Python docs: Classes, sections 9.3 to 9.5",
       "url": "https://docs.python.org/3/tutorial/classes.html",
       "m": 25,
       "why": "The official chapter; these sections cover this whole part."
      },
      {
       "kind": "video",
       "req": false,
       "label": "__new__ vs __init__ in Python",
       "url": "https://www.youtube.com/watch?v=-zsV0_QrfTw",
       "yt": {
        "id": "-zsV0_QrfTw",
        "ch": "mCoding"
       },
       "m": 11,
       "why": "What happens between Car() and a ready object."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Real Python: Object-oriented programming in Python",
       "url": "https://realpython.com/python3-object-oriented-programming/",
       "m": 30,
       "why": "A longer walkthrough with exercises."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Python Tutor: visualize your code",
       "url": "https://pythontutor.com/python-compiler.html",
       "m": 10,
       "why": "Paste any snippet here and watch names point at objects."
      }
     ]
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-0-pillars",
 "n": 0.2,
 "one": true,
 "title": "Pillars and relationships",
 "minutes": 60,
 "lead": "The building blocks under every design drill: encapsulation, abstraction, inheritance, polymorphism, association, aggregation, composition, ABC vs Protocol. One idea a screen: the figure, the code, the rules, the questions they ask, then a check.",
 "sections": [
  {
   "id": "l0-encapsulation",
   "title": "Encapsulation",
   "blocks": [
    {
     "t": "p",
     "text": "Keep an object's data behind its methods, so the object enforces its own rules. Callers ask the object to do something; they don't reach in and change its fields."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Callers use Spot's methods; the internal _vehicle is not touched directly\">\n<rect class=\"d-box\" x=\"10\" y=\"70\" width=\"74\" height=\"36\" rx=\"6\"/><text class=\"d-t\" x=\"47\" y=\"93\" text-anchor=\"middle\">caller</text>\n<rect class=\"d-box\" x=\"118\" y=\"14\" width=\"212\" height=\"152\" rx=\"8\"/><text class=\"d-b\" x=\"130\" y=\"34\">Spot</text>\n<rect class=\"d-acc\" x=\"130\" y=\"46\" width=\"92\" height=\"28\" rx=\"5\"/><text class=\"d-a\" x=\"142\" y=\"65\">park()</text>\n<rect class=\"d-acc\" x=\"130\" y=\"84\" width=\"92\" height=\"28\" rx=\"5\"/><text class=\"d-a\" x=\"142\" y=\"103\">leave()</text>\n<rect class=\"d-acc\" x=\"130\" y=\"122\" width=\"92\" height=\"28\" rx=\"5\"/><text class=\"d-a\" x=\"142\" y=\"141\">is_free</text>\n<rect class=\"d-dim\" x=\"240\" y=\"70\" width=\"78\" height=\"56\" rx=\"6\"/><text class=\"d-s\" x=\"279\" y=\"102\" text-anchor=\"middle\">_vehicle</text>\n<path class=\"d-ara\" d=\"M84 82 L128 62\"/><path class=\"d-ara\" d=\"M84 90 L128 98\"/><path class=\"d-ara\" d=\"M84 98 L128 134\"/>\n<path class=\"d-ln\" d=\"M222 60 L240 84\"/><path class=\"d-ln\" d=\"M222 98 L240 98\"/><path class=\"d-ln\" d=\"M222 136 L240 112\"/>\n<path class=\"d-bad\" d=\"M47 106 V186 H279 V132\"/><text class=\"d-x\" x=\"279\" y=\"196\" text-anchor=\"middle\">no direct writes</text>\n</svg>",
     "alt": "Encapsulation"
    },
    {
     "t": "code",
     "code": "class Spot:\n    def __init__(self, spot_id, size):\n        self.spot_id = spot_id\n        self.size = size\n        self._vehicle = None          # leading _ means internal: don't touch from outside\n\n    @property\n    def is_free(self):                # read-only view, computed from state\n        return self._vehicle is None\n\n    def park(self, vehicle):          # the only way in, so the rule lives here\n        if not self.is_free:\n            raise ValueError(f\"spot {self.spot_id} is taken\")\n        self._vehicle = vehicle\n\n    def leave(self):\n        vehicle = self._vehicle\n        self._vehicle = None\n        return vehicle"
    },
    {
     "t": "list",
     "items": [
      "`_name` means internal by convention. `__name` is renamed to `_Spot__name` to avoid clashes in subclasses; it isn't security.",
      "Use `@property` when a value has a rule or is computed. A plain attribute is fine until then, and switching later doesn't change callers."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Interviewers notice reach-ins like `lot.levels[0].spots[3]._vehicle = car`. Give each object a verb instead: `level.park(car)`, and keep the \"spot already taken\" check in one place."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Python has no private. How do you encapsulate?",
       "a": "By convention (`_name`), properties, and methods that guard the object's rules. What matters is that every state change goes through a method that can check it."
      },
      {
       "q": "Getters and setters, or @property?",
       "a": "Start with a plain attribute. If it later needs validation, turn it into a `@property` with a setter; callers keep writing `obj.x`. Java-style `get_x()` methods aren't idiomatic."
      },
      {
       "q": "Why does it matter in LLD?",
       "a": "Rules live in one place. A spot can't hold two cars and a locker slot can't be assigned twice, because only the owning object changes that state."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **list** hides its internal array: you call `append()`, never set its length. **datetime** exposes `year` as a read-only property."
    },
    {
     "t": "mcq",
     "id": "l0p-encapsulation",
     "q": "A class keeps its balance in `self._balance`. From outside you write `acct._balance = 0`. What happens?",
     "o": [
      "AttributeError",
      "It works; _ is only a convention",
      "It works only inside subclasses"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-abstraction",
   "title": "Abstraction",
   "blocks": [
    {
     "t": "p",
     "text": "Expose what something does and hide how it does it. Callers depend on a small, stable contract, and the details behind it can change freely."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"checkout depends only on PaymentMethod.pay; Card, Cash and a later UPI plug in\">\n<rect class=\"d-box\" x=\"70\" y=\"8\" width=\"200\" height=\"34\" rx=\"6\"/><text class=\"d-t\" x=\"170\" y=\"30\" text-anchor=\"middle\">checkout(ticket, method)</text>\n<path class=\"d-ar\" d=\"M170 42 L170 62\"/>\n<rect class=\"d-acc\" x=\"70\" y=\"64\" width=\"200\" height=\"40\" rx=\"6\"/><text class=\"d-a\" x=\"170\" y=\"89\" text-anchor=\"middle\">PaymentMethod.pay()</text>\n<rect class=\"d-box\" x=\"10\" y=\"150\" width=\"100\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"60\" y=\"175\" text-anchor=\"middle\">Card</text>\n<rect class=\"d-box\" x=\"120\" y=\"150\" width=\"100\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"175\" text-anchor=\"middle\">Cash</text>\n<rect class=\"d-dashbox\" x=\"230\" y=\"150\" width=\"100\" height=\"40\" rx=\"6\"/><text class=\"d-s\" x=\"280\" y=\"175\" text-anchor=\"middle\">UPI (later)</text>\n<path class=\"d-tri\" d=\"M60 150 L130 106\"/><path class=\"d-tri\" d=\"M170 150 L170 106\"/><path class=\"d-tri d-dashed\" d=\"M280 150 L210 106\"/>\n</svg>",
     "alt": "Abstraction"
    },
    {
     "t": "code",
     "code": "from abc import ABC, abstractmethod\n\nclass PaymentMethod(ABC):\n    @abstractmethod\n    def pay(self, amount):            # the contract: every payment method can pay\n        ...\n\nclass Card(PaymentMethod):\n    def __init__(self, number):\n        self._number = number\n\n    def pay(self, amount):\n        # card network call, retries, fraud checks: all hidden in here\n        return True\n\nclass Cash(PaymentMethod):\n    def pay(self, amount):\n        return amount > 0\n\ndef checkout(ticket, method):         # knows only the contract\n    return method.pay(ticket.fee())"
    },
    {
     "t": "list",
     "items": [
      "A class with an unimplemented `@abstractmethod` can't be created: `PaymentMethod()` raises `TypeError`.",
      "A subclass that skips an abstract method fails when you create it, not later when the method is called."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** `checkout` takes any `PaymentMethod`. When the interviewer adds \"support UPI\" or \"gift cards\", you add one class and change nothing else."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Abstraction vs encapsulation?",
       "a": "Abstraction decides what to expose: the contract. Encapsulation protects the state behind it. One is a design decision, the other an implementation technique."
      },
      {
       "q": "A real example from Python itself?",
       "a": "`open()` gives you a file object with `read()` and `write()`. Disk, pipe or in-memory `io.BytesIO`, your code doesn't change."
      },
      {
       "q": "How much should you abstract?",
       "a": "Abstract what is likely to vary: payment methods, pricing rules, slot assignment. Don't add an ABC for something with one implementation and no expected variety."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **collections.abc.Mapping** is an ABC: implement three methods and you get `get()`, `keys()`, `items()` and `in` for free."
    },
    {
     "t": "mcq",
     "id": "l0p-abstraction",
     "q": "What happens?",
     "code": "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\n\nShape()",
     "o": [
      "A Shape is created",
      "TypeError",
      "Error only when area() is called"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-inheritance",
   "title": "Inheritance",
   "blocks": [
    {
     "t": "p",
     "text": "A subclass reuses and extends a parent. Use it for a real is-a relationship, where the child can stand in anywhere the parent is expected."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 196\" role=\"img\" aria-label=\"Bike, Car and Truck inherit from Vehicle\">\n<rect class=\"d-acc\" x=\"100\" y=\"10\" width=\"140\" height=\"56\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"34\" text-anchor=\"middle\">Vehicle</text><text class=\"d-s\" x=\"170\" y=\"54\" text-anchor=\"middle\">plate · fits()</text>\n<rect class=\"d-box\" x=\"10\" y=\"130\" width=\"100\" height=\"54\" rx=\"6\"/><text class=\"d-b\" x=\"60\" y=\"152\" text-anchor=\"middle\">Bike</text><text class=\"d-s\" x=\"60\" y=\"171\" text-anchor=\"middle\">size=small</text>\n<rect class=\"d-box\" x=\"120\" y=\"130\" width=\"100\" height=\"54\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"152\" text-anchor=\"middle\">Car</text><text class=\"d-s\" x=\"170\" y=\"171\" text-anchor=\"middle\">size=medium</text>\n<rect class=\"d-box\" x=\"230\" y=\"130\" width=\"100\" height=\"54\" rx=\"6\"/><text class=\"d-b\" x=\"280\" y=\"152\" text-anchor=\"middle\">Truck</text><text class=\"d-s\" x=\"280\" y=\"171\" text-anchor=\"middle\">fits() own</text>\n<path class=\"d-tri\" d=\"M60 130 L140 68\"/><path class=\"d-tri\" d=\"M170 130 L170 68\"/><path class=\"d-tri\" d=\"M280 130 L200 68\"/>\n<text class=\"d-s\" x=\"250\" y=\"104\">is-a</text>\n</svg>",
     "alt": "Inheritance"
    },
    {
     "t": "code",
     "code": "class Vehicle:\n    size = \"medium\"\n\n    def __init__(self, plate):\n        self.plate = plate\n\n    def fits(self, spot):\n        return spot.size == self.size\n\nclass Bike(Vehicle):\n    size = \"small\"                    # change data, reuse fits() as is\n\nclass Truck(Vehicle):\n    size = \"large\"\n\n    def __init__(self, plate, axles):\n        super().__init__(plate)       # parent sets plate\n        self.axles = axles\n\n    def fits(self, spot):             # extend behavior\n        return spot.size == \"large\" and self.axles <= 3"
    },
    {
     "t": "list",
     "items": [
      "A child must keep the parent's promises (Liskov substitution). If a subclass has to disable a parent method, it isn't a real is-a.",
      "Keep hierarchies shallow. Two levels is normal; four is a warning sign."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** `Vehicle` with `Bike`, `Car`, `Truck` is where interviewers expect inheritance. Spot types are a judgment call: a `size` field often beats a subclass per size. Say which you picked and why."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Does Python have multiple inheritance?",
       "a": "Yes. The MRO (C3 linearization) decides lookup order, and `super()` follows it. Use it for small mixins, not deep trees."
      },
      {
       "q": "When is inheritance the wrong tool?",
       "a": "When the link is really has-a (Car extends Engine), when it's only for code reuse, or when the child breaks parent behavior (Square extends Rectangle and changes `set_width`)."
      },
      {
       "q": "What is a mixin?",
       "a": "A small class that adds one capability and is meant to be combined: `class Report(JsonMixin, Base)`. It has no state of its own."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **Exception** hierarchies are the textbook case: `KeyError` is-a `LookupError` is-a `Exception`, so `except LookupError` catches both `KeyError` and `IndexError`."
    },
    {
     "t": "mcq",
     "id": "l0p-inheritance",
     "q": "What prints?",
     "code": "class Vehicle:\n    def wheels(self): return 4\n\nclass Bike(Vehicle):\n    pass\n\nprint(Bike().wheels())",
     "o": [
      "4",
      "AttributeError",
      "None"
     ],
     "a": 0
    }
   ]
  },
  {
   "id": "l0-polymorphism",
   "title": "Polymorphism",
   "blocks": [
    {
     "t": "p",
     "text": "One call, many behaviors. The same method name does the right thing for whichever object receives it, so the calling code never checks types."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"One call pricing.fee(3) gives different results per pricing class\">\n<rect class=\"d-acc\" x=\"10\" y=\"80\" width=\"128\" height=\"40\" rx=\"6\"/><text class=\"d-a\" x=\"74\" y=\"105\" text-anchor=\"middle\">pricing.fee(3)</text>\n<rect class=\"d-box\" x=\"190\" y=\"14\" width=\"140\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"202\" y=\"39\">Hourly</text><text class=\"d-a\" x=\"318\" y=\"39\" text-anchor=\"end\">9</text>\n<rect class=\"d-box\" x=\"190\" y=\"80\" width=\"140\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"202\" y=\"105\">FlatDaily</text><text class=\"d-a\" x=\"318\" y=\"105\" text-anchor=\"end\">20</text>\n<rect class=\"d-box\" x=\"190\" y=\"146\" width=\"140\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"202\" y=\"171\">Weekend</text><text class=\"d-a\" x=\"318\" y=\"171\" text-anchor=\"end\">6</text>\n<path class=\"d-ar\" d=\"M138 92 L188 38\"/><path class=\"d-ar\" d=\"M138 100 L188 100\"/><path class=\"d-ar\" d=\"M138 108 L188 162\"/>\n</svg>",
     "alt": "Polymorphism"
    },
    {
     "t": "code",
     "code": "class Hourly:\n    def fee(self, hours):\n        return 3 * hours\n\nclass FlatDaily:\n    def fee(self, hours):\n        return 20\n\nclass Weekend:\n    def fee(self, hours):\n        return 2 * hours\n\ndef bill(pricing, hours):\n    return pricing.fee(hours)         # works for any object with fee()\n\nbill(Hourly(), 3)       # 9\nbill(FlatDaily(), 3)    # 20\n\n# without polymorphism, this grows with every new rule:\n# if kind == \"hourly\": ... elif kind == \"daily\": ... elif ..."
    },
    {
     "t": "list",
     "items": [
      "Duck typing: Python needs no shared parent. Any object with a matching `fee()` works.",
      "An `isinstance` or `if kind ==` chain that picks behavior is the signal to switch to polymorphism."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** The most common follow-up is a new pricing or assignment rule. With polymorphism that's a new class. With an if-chain it's an edit to tested code, and interviewers mark that down."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "What kinds of polymorphism does Python have?",
       "a": "Runtime polymorphism through overriding and duck typing, and operator overloading through dunder methods (`+` on int vs str). No compile-time method overloading."
      },
      {
       "q": "Duck typing vs an ABC?",
       "a": "Duck typing works if the method exists and fails late, when called. An ABC fails early, when you create the object. A Protocol fails in the type checker."
      },
      {
       "q": "How does this connect to SOLID?",
       "a": "New behavior means a new class, and existing callers stay untouched. That is the Open/Closed principle."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **len()** works on lists, dicts, strings and your own classes because each defines `__len__`. **sorted()** works on anything with `__lt__`."
    },
    {
     "t": "mcq",
     "id": "l0p-polymorphism",
     "q": "Which design adds a new pricing rule without editing existing code?",
     "o": [
      "An if/elif on a kind string inside bill()",
      "One class per rule, each with fee()",
      "A global dict edited for every rule"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-association",
   "title": "Association",
   "blocks": [
    {
     "t": "p",
     "text": "Two objects know about each other and work together, but neither owns the other. Each can exist on its own."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 160\" role=\"img\" aria-label=\"Ticket refers to a Vehicle and a Spot; all three exist independently\">\n<rect class=\"d-box\" x=\"10\" y=\"56\" width=\"90\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"55\" y=\"83\" text-anchor=\"middle\">Vehicle</text>\n<rect class=\"d-acc\" x=\"125\" y=\"56\" width=\"90\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"83\" text-anchor=\"middle\">Ticket</text>\n<rect class=\"d-box\" x=\"240\" y=\"56\" width=\"90\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"285\" y=\"83\" text-anchor=\"middle\">Spot</text>\n<path class=\"d-ar\" d=\"M125 78 L102 78\"/><path class=\"d-ar\" d=\"M215 78 L238 78\"/>\n<text class=\"d-s\" x=\"113\" y=\"48\" text-anchor=\"middle\">.vehicle</text><text class=\"d-s\" x=\"227\" y=\"48\" text-anchor=\"middle\">.spot</text>\n<text class=\"d-s\" x=\"170\" y=\"136\" text-anchor=\"middle\">delete the ticket: car and spot remain</text>\n</svg>",
     "alt": "Association"
    },
    {
     "t": "code",
     "code": "class Ticket:\n    def __init__(self, vehicle, spot, entry_time):\n        self.vehicle = vehicle        # refers to a Vehicle, doesn't own it\n        self.spot = spot              # refers to a Spot, doesn't own it\n        self.entry_time = entry_time\n\ncar = Car(\"NY-123\")                   # existed before the ticket\nticket = Ticket(car, spot, now)\ndel ticket                            # car and spot are untouched"
    },
    {
     "t": "list",
     "items": [
      "Store a reference to the other object (or its id across systems). Don't copy its data.",
      "Prefer one direction. `Ticket` to `Vehicle` is enough unless a vehicle really needs to find its tickets."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** `Ticket`, `Reservation` and `Order` are link objects: they connect things that live independently. Make them explicit classes instead of hiding the link inside `Vehicle`."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Association vs dependency?",
       "a": "Association is kept as an attribute and lives long. Dependency is brief use, usually as a parameter: `checkout(ticket, method)` depends on a payment method without storing it."
      },
      {
       "q": "One-way or two-way links?",
       "a": "One-way by default. Two-way links have to be kept in sync and create reference cycles."
      },
      {
       "q": "Store the object or its id?",
       "a": "Within one program, the object. Across a database or another service, the id."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **Django models** use `ForeignKey` for exactly this: an order points to a customer, and deleting the order leaves the customer."
    },
    {
     "t": "mcq",
     "id": "l0p-association",
     "q": "A Ticket stores a vehicle and a spot. You delete the ticket. What happens to the vehicle?",
     "o": [
      "It still exists",
      "It is deleted too",
      "It becomes None"
     ],
     "a": 0
    }
   ]
  },
  {
   "id": "l0-aggregation",
   "title": "Aggregation",
   "blocks": [
    {
     "t": "p",
     "text": "A whole has parts, but the parts are created elsewhere and can live without the whole. Remove the whole and the parts survive."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"ParkingLot holds Attendants created outside it\">\n<rect class=\"d-acc\" x=\"10\" y=\"74\" width=\"120\" height=\"50\" rx=\"6\"/><text class=\"d-b\" x=\"70\" y=\"104\" text-anchor=\"middle\">ParkingLot</text>\n<rect class=\"d-box\" x=\"210\" y=\"14\" width=\"120\" height=\"36\" rx=\"6\"/><text class=\"d-t\" x=\"270\" y=\"37\" text-anchor=\"middle\">Alice</text><path class=\"d-agg\" d=\"M130 99 L208 32\"/><rect class=\"d-box\" x=\"210\" y=\"82\" width=\"120\" height=\"36\" rx=\"6\"/><text class=\"d-t\" x=\"270\" y=\"105\" text-anchor=\"middle\">Bo</text><path class=\"d-agg\" d=\"M130 99 L208 100\"/><rect class=\"d-box\" x=\"210\" y=\"150\" width=\"120\" height=\"36\" rx=\"6\"/><text class=\"d-t\" x=\"270\" y=\"173\" text-anchor=\"middle\">Chen</text><path class=\"d-agg\" d=\"M130 99 L208 168\"/>\n<text class=\"d-s\" x=\"70\" y=\"150\" text-anchor=\"middle\">hollow ◇ = parts</text><text class=\"d-s\" x=\"70\" y=\"166\" text-anchor=\"middle\">outlive the whole</text>\n</svg>",
     "alt": "Aggregation"
    },
    {
     "t": "code",
     "code": "class Attendant:\n    def __init__(self, name):\n        self.name = name\n\nclass ParkingLot:\n    def __init__(self, attendants):\n        self.attendants = attendants  # passed in: someone else created them\n\nalice = Attendant(\"Alice\")\nlot = ParkingLot([alice])\ndel lot                               # alice still exists and can join another lot"
    },
    {
     "t": "list",
     "items": [
      "The test: the parts are created outside and passed in.",
      "UML: a hollow diamond on the whole's side."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** In Amazon Locker, a `LockerLocation` aggregates packages: they exist before they arrive and leave when picked up."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Aggregation vs association?",
       "a": "Aggregation is association with a whole-part meaning: a team and its players. Plain association links peers: a ticket and a car."
      },
      {
       "q": "Typical examples?",
       "a": "Team has players, playlist has songs, department has employees. The parts exist without the whole."
      },
      {
       "q": "Do interviewers care about the term?",
       "a": "Less than the decision behind it: who creates the part and who ends it. Say it in those words."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** A **logging.Logger** aggregates handlers: you create a `FileHandler` yourself and attach it with `addHandler()`."
    },
    {
     "t": "mcq",
     "id": "l0p-aggregation",
     "q": "Players can leave one team and join another. Team to Player is:",
     "o": [
      "Aggregation",
      "Composition",
      "Inheritance"
     ],
     "a": 0
    }
   ]
  },
  {
   "id": "l0-composition",
   "title": "Composition",
   "blocks": [
    {
     "t": "p",
     "text": "A whole owns its parts: it creates them, and they end with it. The parts make no sense on their own."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"ParkingLot contains Levels which contain Spots\">\n<rect class=\"d-acc\" x=\"10\" y=\"8\" width=\"320\" height=\"184\" rx=\"8\"/><text class=\"d-b\" x=\"24\" y=\"30\">ParkingLot</text>\n<rect class=\"d-box\" x=\"22\" y=\"40\" width=\"296\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"34\" y=\"65\">Level 0</text><rect class=\"d-spot\" x=\"108\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"128\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"148\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"168\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"188\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"208\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"228\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"248\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"268\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"288\" y=\"54\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-box\" x=\"22\" y=\"92\" width=\"296\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"34\" y=\"117\">Level 1</text><rect class=\"d-spot\" x=\"108\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"128\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"148\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"168\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"188\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"208\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"228\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"248\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"268\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"288\" y=\"106\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-box\" x=\"22\" y=\"144\" width=\"296\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"34\" y=\"169\">Level 2</text><rect class=\"d-spot\" x=\"108\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"128\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"148\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"168\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"188\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"208\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"228\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"248\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"268\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/><rect class=\"d-spot\" x=\"288\" y=\"158\" width=\"12\" height=\"12\" rx=\"2\"/>\n</svg>",
     "alt": "Composition"
    },
    {
     "t": "code",
     "code": "class Level:\n    def __init__(self, number, spot_count):\n        self.number = number\n        self.spots = []\n        for i in range(spot_count):              # created here, owned here\n            self.spots.append(Spot(f\"{number}-{i}\", \"medium\"))\n\nclass ParkingLot:\n    def __init__(self, level_count, spots_per_level, pricing):\n        self.levels = []\n        for n in range(level_count):             # the lot builds its levels\n            self.levels.append(Level(n, spots_per_level))\n        self.pricing = pricing                   # a part that does a job\n\n    def set_pricing(self, pricing):              # swap behavior, no subclass\n        self.pricing = pricing"
    },
    {
     "t": "list",
     "items": [
      "The test: the whole calls the parts' constructors itself.",
      "Composition over inheritance: give the object a part that does the job (`self.pricing`) instead of subclassing to change behavior."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** When the interviewer says \"weekends are priced differently\", a lot that holds `self.pricing` swaps one object. A `WeekendParkingLot(ParkingLot)` subclass is the answer they mark down."
    },
    {
     "t": "table",
     "head": [
      "",
      "Association",
      "Aggregation",
      "Composition"
     ],
     "rows": [
      [
       "Meaning",
       "Uses / knows",
       "Has, parts shared",
       "Owns, parts private"
      ],
      [
       "Who creates the part",
       "Someone else",
       "Someone else",
       "The whole"
      ],
      [
       "Part outlives the whole",
       "Yes",
       "Yes",
       "No"
      ],
      [
       "Parking Lot example",
       "Ticket → Vehicle",
       "Lot → Attendants",
       "Lot → Levels → Spots"
      ],
      [
       "UML",
       "Plain line",
       "Hollow ◇",
       "Filled ◆"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Composition vs aggregation in one line?",
       "a": "Who controls the part's lifetime: the whole (composition) or someone else (aggregation)."
      },
      {
       "q": "Why \"composition over inheritance\"?",
       "a": "You can swap behavior at runtime, avoid deep fragile hierarchies, and combine behaviors (pricing × payment × notifier) without a subclass for every combination."
      },
      {
       "q": "Is pricing composition or aggregation here?",
       "a": "The lot doesn't create it, so strictly aggregation. In interviews both get called \"composition over inheritance\". What matters is holding a part instead of subclassing."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **http.client.HTTPResponse** owns its socket file and closes it when it closes. **dataclasses** with `field(default_factory=list)` give every object its own list."
    },
    {
     "t": "mcq",
     "id": "l0p-composition",
     "q": "A house builds its rooms, and they're gone when it's demolished. House to Room is:",
     "o": [
      "Aggregation",
      "Composition",
      "Association"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-abc",
   "title": "ABC vs Protocol",
   "blocks": [
    {
     "t": "p",
     "text": "Python's two ways to define a contract. An ABC is a parent you inherit from, and it can carry shared code. A Protocol describes a shape: any class with the right methods matches, with no inheritance."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"ABC: subclasses inherit. Protocol: unrelated classes match by shape\">\n<text class=\"d-s\" x=\"80\" y=\"16\" text-anchor=\"middle\">inherit</text><text class=\"d-s\" x=\"260\" y=\"16\" text-anchor=\"middle\">match the shape</text>\n<rect class=\"d-acc\" x=\"10\" y=\"26\" width=\"140\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"80\" y=\"47\" text-anchor=\"middle\">Vehicle</text><text class=\"d-s\" x=\"80\" y=\"64\" text-anchor=\"middle\">ABC · has code</text>\n<rect class=\"d-box\" x=\"10\" y=\"140\" width=\"66\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"43\" y=\"165\" text-anchor=\"middle\">Bike</text>\n<rect class=\"d-box\" x=\"84\" y=\"140\" width=\"66\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"117\" y=\"165\" text-anchor=\"middle\">Car</text>\n<path class=\"d-tri\" d=\"M43 140 L70 76\"/><path class=\"d-tri\" d=\"M117 140 L90 76\"/>\n<rect class=\"d-dashbox\" x=\"190\" y=\"26\" width=\"140\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"260\" y=\"47\" text-anchor=\"middle\">Notifier</text><text class=\"d-s\" x=\"260\" y=\"64\" text-anchor=\"middle\">Protocol · send()</text>\n<rect class=\"d-box\" x=\"190\" y=\"140\" width=\"66\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"223\" y=\"165\" text-anchor=\"middle\">Sms</text>\n<rect class=\"d-box\" x=\"264\" y=\"140\" width=\"66\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"297\" y=\"165\" text-anchor=\"middle\">Email</text>\n<path class=\"d-ln d-dashed\" d=\"M223 140 L250 76\"/><path class=\"d-ln d-dashed\" d=\"M297 140 L270 76\"/>\n<line class=\"d-ln\" x1=\"170\" y1=\"20\" x2=\"170\" y2=\"190\"/>\n</svg>",
     "alt": "ABC vs Protocol"
    },
    {
     "t": "code",
     "code": "from abc import ABC, abstractmethod\nfrom typing import Protocol\n\nclass Vehicle(ABC):                   # abstract class: shared state and code\n    def __init__(self, plate):\n        self.plate = plate            # every vehicle has a plate\n\n    @abstractmethod\n    def size(self): ...\n\n    def describe(self):               # shared method, inherited by all\n        return f\"{self.plate} ({self.size()})\"\n\nclass Notifier(Protocol):             # interface: just a shape\n    def send(self, to: str, msg: str) -> None: ...\n\nclass SmsNotifier:                    # no inheritance, still a Notifier\n    def send(self, to, msg):\n        print(\"SMS\", to, msg)\n\ndef notify(n: Notifier):              # mypy accepts SmsNotifier here\n    n.send(\"555-0100\", \"Your package is ready\")"
    },
    {
     "t": "list",
     "items": [
      "Pick an ABC when subclasses share state or code. Pick a Protocol when unrelated classes only need the same method.",
      "Several small contracts beat one big one: `Payable` and `Refundable`, not `PaymentEverything`. That's the I in SOLID."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Use an ABC for `Vehicle` (shared plate, shared `describe`) and Protocols for plug-in roles like `Notifier` or `PricingRule`. Explaining that choice out loud is exactly the judgment they score."
    },
    {
     "t": "table",
     "head": [
      "",
      "ABC",
      "Protocol"
     ],
     "rows": [
      [
       "Relationship",
       "is-a (you inherit)",
       "can-do (shape matches)"
      ],
      [
       "Shared code and state",
       "Yes",
       "No, signatures only"
      ],
      [
       "Checked",
       "At creation, at runtime",
       "By the type checker"
      ],
      [
       "Classes you don't own",
       "Must subclass, so no",
       "Match automatically"
      ],
      [
       "Java equivalent",
       "abstract class",
       "interface"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "When abstract class, when interface?",
       "a": "Abstract class when children share data or code and form a true family. Interface when you only need a capability across unrelated classes. In Java a class extends one class but implements many interfaces."
      },
      {
       "q": "Can an ABC have __init__ and normal methods?",
       "a": "Yes. Only the methods marked `@abstractmethod` must be implemented by subclasses."
      },
      {
       "q": "Can isinstance check a Protocol?",
       "a": "Only if the Protocol is decorated with `@runtime_checkable`, and then it checks method names, not signatures."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **collections.abc** is all ABCs (`Iterable`, `Mapping`). **typing.SupportsInt** and **SupportsAbs** are Protocols."
    },
    {
     "t": "mcq",
     "id": "l0p-abc",
     "q": "Classes from three libraries you don't control all have `send()`. You want one type that covers them. Best fit?",
     "o": [
      "An ABC they inherit from",
      "A Protocol",
      "A shared base class you edit into each library"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-pillars-bugs",
   "title": "Find the bug",
   "blocks": [
    {
     "t": "p",
     "text": "Each snippet has one line that causes the error. Click it; the fix appears after."
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-0",
     "code": "class Level:\n    def __init__(self):\n        self.spots = [Spot(\"1\", \"small\"), Spot(\"2\", \"medium\")]\n\ndef park(level, car):\n    level.spots[1]._vehicle = car",
     "ask": {
      "q": "A second car can overwrite a parked one.",
      "lines": [
       6
      ],
      "why": "This reaches past `Spot.park()` and skips its \"already taken\" check. Call `level.spots[1].park(car)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-1",
     "code": "from abc import ABC\n\nclass Payment(ABC):\n    def pay(self, amount):\n        raise NotImplementedError\n\nclass Upi(Payment):\n    def refund(self, amount): ...\n\nUpi()",
     "ask": {
      "q": "Upi() is created without pay() and fails only at checkout.",
      "lines": [
       4
      ],
      "why": "`pay` isn't marked `@abstractmethod`, so nothing forces subclasses to implement it. Add the decorator and `Upi()` fails immediately."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-2",
     "code": "class Engine:\n    def start(self):\n        return \"vroom\"\n\nclass Car(Engine):\n    def __init__(self, plate):\n        self.plate = plate",
     "ask": {
      "q": "This hierarchy fails design review.",
      "lines": [
       5
      ],
      "why": "A car has an engine; it isn't one. Use composition: `self.engine = Engine()`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-3",
     "code": "def fee(vehicle, hours):\n    if isinstance(vehicle, Bike):\n        return 1 * hours\n    elif isinstance(vehicle, Car):\n        return 3 * hours\n    elif isinstance(vehicle, Truck):\n        return 5 * hours",
     "ask": {
      "q": "Adding a Bus means editing this function.",
      "lines": [
       2
      ],
      "why": "Type checks that pick behavior. Give each vehicle class a `rate` and write `return vehicle.rate * hours`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-4",
     "code": "DEFAULT_SPOTS = [Spot(\"A\", \"small\"), Spot(\"B\", \"small\")]\n\nclass Level:\n    def __init__(self, number):\n        self.number = number\n        self.spots = DEFAULT_SPOTS",
     "ask": {
      "q": "Parking on level 1 also fills level 2.",
      "lines": [
       6
      ],
      "why": "Every level shares one list of spots. Composition means each level creates its own: build the list inside `__init__`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-5",
     "code": "class Spot:\n    @property\n    def size(self):\n        return self._size\n\n    @size.setter\n    def size(self, value):\n        self.size = value",
     "ask": {
      "q": "RecursionError when setting size.",
      "lines": [
       8
      ],
      "why": "`self.size = ...` calls the setter again, forever. Store to the internal name: `self._size = value`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-pillars-6",
     "code": "class Vehicle(ABC):\n    def __init__(self, plate):\n        self.plate = plate\n\nclass Truck(Vehicle):\n    def __init__(self, plate, axles):\n        self.axles = axles\n\nprint(Truck(\"NY1\", 3).plate)",
     "ask": {
      "q": "AttributeError: Truck has no attribute plate.",
      "lines": [
       6
      ],
      "why": "This `__init__` replaces Vehicle's. Start it with `super().__init__(plate)`."
     }
    }
   ]
  },
  {
   "id": "l0-pillars-final",
   "title": "Final check",
   "blocks": [
    {
     "t": "p",
     "text": "One question per idea, mixed up. Answer before you look back."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-0",
     "q": "What prints?",
     "code": "class A:\n    def __init__(self):\n        self.__x = 1\n\na = A()\nprint(a._A__x)",
     "o": [
      "AttributeError",
      "1",
      "None"
     ],
     "a": 1,
     "why": "`__x` is name-mangled to `_A__x`. It prevents accidental clashes in subclasses; it doesn't hide anything."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-1",
     "q": "What happens on the last line?",
     "code": "class Temp:\n    def __init__(self):\n        self._c = 0\n\n    @property\n    def c(self):\n        return self._c\n\nt = Temp()\nt.c = 5",
     "o": [
      "t.c becomes 5",
      "AttributeError",
      "A new attribute c is created"
     ],
     "a": 1,
     "why": "A property without a setter is read-only. Add `@c.setter` to allow writes, ideally with validation."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-2",
     "q": "What happens?",
     "code": "class Shape(ABC):\n    @abstractmethod\n    def area(self): ...\n    @abstractmethod\n    def perimeter(self): ...\n\nclass Square(Shape):\n    def area(self): return 4\n\nSquare()",
     "o": [
      "Works until perimeter() is called",
      "TypeError when creating Square",
      "Works; perimeter() returns None"
     ],
     "a": 1,
     "why": "Every abstract method must be implemented before the class can be instantiated. The error comes at creation time."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-3",
     "q": "`Square(Rectangle)` overrides `set_width` to also set height. Code that sets width 2 and height 5 expects area 10 and gets 25. What broke?",
     "o": [
      "Encapsulation",
      "Liskov substitution",
      "Composition"
     ],
     "a": 1,
     "why": "A subclass must work anywhere its parent does. Square changes Rectangle's behavior, so it isn't a safe is-a. Model them as separate shapes."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-4",
     "q": "What prints?",
     "code": "class A:\n    def hi(self): return \"A\"\nclass B(A):\n    def hi(self): return \"B\" + super().hi()\nclass C(A):\n    def hi(self): return \"C\" + super().hi()\nclass D(B, C):\n    pass\n\nprint(D().hi())",
     "o": [
      "BA",
      "BCA",
      "CBA"
     ],
     "a": 1,
     "why": "The MRO of D is D, B, C, A. `super()` in B moves to the next class in that order, which is C, not A."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-5",
     "q": "What prints?",
     "code": "class Duck:\n    def sound(self): return \"quack\"\nclass Robot:\n    def sound(self): return \"beep\"\n\nfor x in [Duck(), Robot()]:\n    print(x.sound())",
     "o": [
      "TypeError: Robot is not a Duck",
      "quack, then beep",
      "quack twice"
     ],
     "a": 1,
     "why": "Duck typing: only the method matters, not a shared parent."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-6",
     "q": "Ticket points to Vehicle and Vehicle points back to Ticket. Main risk?",
     "o": [
      "Slower attribute lookups",
      "The two links drift out of sync",
      "Python forbids reference cycles"
     ],
     "a": 1,
     "why": "Every update must change both sides. Keep links one-way unless both directions are really needed."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-7",
     "q": "Which relationship is this?",
     "code": "class Library:\n    def __init__(self, books):\n        self.books = books",
     "o": [
      "Aggregation",
      "Composition",
      "Inheritance"
     ],
     "a": 0,
     "why": "The books are created elsewhere and passed in, so they can outlive the library."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-8",
     "q": "Pricing must switch between weekday and weekend rules at midnight. Best design?",
     "o": [
      "WeekdayLot and WeekendLot subclasses",
      "The lot holds a pricing object and swaps it",
      "An if on the day inside every method"
     ],
     "a": 1,
     "why": "Composition lets behavior change at runtime. A subclass can't change on an existing object."
    },
    {
     "t": "mcq",
     "id": "l0f-pillars-9",
     "q": "What happens?",
     "code": "from typing import Protocol\n\nclass Notifier(Protocol):\n    def send(self, msg: str) -> None: ...\n\nclass Email:\n    def send(self, msg): print(msg)\n\nprint(isinstance(Email(), Notifier))",
     "o": [
      "True",
      "False",
      "TypeError"
     ],
     "a": 2,
     "why": "Plain Protocols are for type checkers. Runtime `isinstance` needs `@runtime_checkable` on the Protocol."
    }
   ]
  },
  {
   "id": "l0-pillars-run",
   "title": "Run it, then go deeper",
   "blocks": [
    {
     "t": "p",
     "text": "Every concept on this tab in one runnable mini parking lot. Save as `parking.py`, run `python3 parking.py`, then try changing it."
    },
    {
     "t": "code",
     "title": "parking.py",
     "code": "# parking.py   run with:  python3 parking.py\n# All eight ideas from this tab in one small parking lot.\nfrom abc import ABC, abstractmethod\nfrom typing import Protocol\n\n\nclass Vehicle(ABC):                     # abstraction + inheritance\n    def __init__(self, plate):\n        self.plate = plate\n\n    @abstractmethod\n    def size(self): ...\n\n\nclass Bike(Vehicle):\n    def size(self): return \"small\"\n\n\nclass Car(Vehicle):\n    def size(self): return \"medium\"\n\n\nclass Spot:                             # encapsulation\n    def __init__(self, spot_id, size):\n        self.spot_id = spot_id\n        self.size = size\n        self._vehicle = None\n\n    @property\n    def is_free(self):\n        return self._vehicle is None\n\n    def park(self, vehicle):\n        if not self.is_free:\n            raise ValueError(\"spot taken\")\n        self._vehicle = vehicle\n\n    def leave(self):\n        vehicle = self._vehicle\n        self._vehicle = None\n        return vehicle\n\n\nclass Pricing(Protocol):                # interface for plug-in rules\n    def fee(self, hours: int) -> int: ...\n\n\nclass Hourly:                           # polymorphism: same fee(), its own rule\n    def fee(self, hours): return 3 * hours\n\n\nclass Weekend:\n    def fee(self, hours): return 2 * hours\n\n\nclass Ticket:                           # association: links a vehicle and a spot\n    def __init__(self, vehicle, spot):\n        self.vehicle = vehicle\n        self.spot = spot\n\n\nclass ParkingLot:\n    def __init__(self, sizes, pricing):\n        self.spots = []                 # composition: the lot creates its spots\n        for i in range(len(sizes)):\n            self.spots.append(Spot(i, sizes[i]))\n        self.pricing = pricing          # composition over inheritance: swappable\n\n    def park(self, vehicle):\n        for spot in self.spots:\n            if spot.is_free and spot.size == vehicle.size():\n                spot.park(vehicle)\n                return Ticket(vehicle, spot)\n        return None                     # no free spot of that size\n\n    def leave(self, ticket, hours):\n        ticket.spot.leave()\n        return self.pricing.fee(hours)\n\n\nif __name__ == \"__main__\":\n    lot = ParkingLot([\"small\", \"medium\", \"medium\"], Hourly())\n    t = lot.park(Car(\"NY-123\"))\n    print(\"spot\", t.spot.spot_id)       # spot 1\n    print(\"fee\", lot.leave(t, 2))       # fee 6\n\n    lot.pricing = Weekend()             # follow-up: weekend pricing, one line\n    t = lot.park(Bike(\"NY-7\"))\n    print(\"fee\", lot.leave(t, 2))       # fee 4"
    },
    {
     "t": "p",
     "text": "**Book:** Fluent Python (2nd ed.), chapter 13 (interfaces, protocols and ABCs) and chapter 14 (inheritance: for better or for worse)."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "video",
       "req": true,
       "label": "Composition Is Better Than Inheritance in Python",
       "url": "https://www.youtube.com/watch?v=0mcP8ZpUR38",
       "yt": {
        "id": "0mcP8ZpUR38",
        "ch": "ArjanCodes"
       },
       "m": 24,
       "why": "One example refactored from inheritance to composition."
      },
      {
       "kind": "read",
       "req": true,
       "label": "Real Python: Inheritance and composition",
       "url": "https://realpython.com/inheritance-composition-python/",
       "m": 35,
       "why": "Is-a against has-a, and how to choose."
      },
      {
       "kind": "video",
       "req": false,
       "label": "Protocols vs ABCs in Python: when to use which one",
       "url": "https://www.youtube.com/watch?v=dryNwWvSd4M",
       "yt": {
        "id": "dryNwWvSd4M",
        "ch": "ArjanCodes"
       },
       "m": 16,
       "why": "Nominal against structural typing, with the trade-off."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Python Patterns Guide: Composition over inheritance",
       "url": "https://python-patterns.guide/gang-of-four/composition-over-inheritance/",
       "m": 20,
       "why": "Why subclass explosions happen and the four ways out."
      },
      {
       "kind": "read",
       "req": false,
       "label": "CPython source: _collections_abc.py",
       "url": "https://github.com/python/cpython/blob/main/Lib/_collections_abc.py",
       "m": 15,
       "why": "Real ABCs: abstract methods plus mixin methods built on them."
      }
     ]
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-0-solid",
 "n": 0.3,
 "one": true,
 "title": "SOLID and patterns",
 "minutes": 75,
 "lead": "The building blocks under every design drill: the five SOLID rules, then Strategy, Factory, Observer, Singleton and State. One idea a screen: the figure, the code, the rules, the questions they ask, then a check.",
 "sections": [
  {
   "id": "l0-srp",
   "title": "Single responsibility",
   "blocks": [
    {
     "t": "p",
     "text": "A class should have one reason to change. If two different people could ask you to change it for unrelated reasons, split it."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"One class with three jobs split into three classes\"><rect class=\"d-badbox\" x=\"10\" y=\"60\" width=\"130\" height=\"80\" rx=\"6\"/><text class=\"d-b\" x=\"75\" y=\"97\" text-anchor=\"middle\">Ticket</text><text class=\"d-s\" x=\"75\" y=\"113\" text-anchor=\"middle\">fee · print · save</text><path class=\"d-ara\" d=\"M140 100 L180 100\"/><rect class=\"d-acc\" x=\"190\" y=\"10\" width=\"140\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"260\" y=\"31\" text-anchor=\"middle\">Ticket</text><text class=\"d-s\" x=\"260\" y=\"47\" text-anchor=\"middle\">vehicle, spot, time</text><rect class=\"d-acc\" x=\"190\" y=\"76\" width=\"140\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"260\" y=\"97\" text-anchor=\"middle\">FeeCalculator</text><text class=\"d-s\" x=\"260\" y=\"113\" text-anchor=\"middle\">fee()</text><rect class=\"d-acc\" x=\"190\" y=\"142\" width=\"140\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"260\" y=\"163\" text-anchor=\"middle\">ReceiptPrinter</text><text class=\"d-s\" x=\"260\" y=\"179\" text-anchor=\"middle\">print()</text></svg>",
     "alt": "Single responsibility"
    },
    {
     "t": "code",
     "code": "# before: one class prices, prints and stores\nclass Ticket:\n    def fee(self): ...\n    def print_receipt(self): ...   # changes when the receipt format changes\n    def save_to_db(self): ...      # changes when storage changes\n\n# after: each class has one job\nclass Ticket:\n    def __init__(self, vehicle, spot, entry_time):\n        self.vehicle = vehicle\n        self.spot = spot\n        self.entry_time = entry_time\n\nclass FeeCalculator:\n    def __init__(self, pricing):\n        self.pricing = pricing\n\n    def fee(self, ticket, now):\n        hours = (now - ticket.entry_time) // 3600 + 1\n        return self.pricing.fee(hours)\n\nclass ReceiptPrinter:\n    def print(self, ticket, amount):\n        print(ticket.vehicle.plate, amount, \"USD\")"
    },
    {
     "t": "list",
     "items": [
      "Test: describe the class in one sentence without \"and\".",
      "It's about reasons to change, not the number of methods. Ten small methods about one thing is fine."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Interviewers often ask \"where does billing live?\" A `ParkingLot` that also prices, prints and saves is the god class they're probing for. Name a `FeeCalculator` early."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "How small is too small?",
       "a": "Split when parts change for different reasons. Don't split one idea into classes that always change together."
      },
      {
       "q": "What is a god class?",
       "a": "One class that knows and does everything, often named `Manager`. The symptom: every new requirement edits it."
      },
      {
       "q": "Does SRP apply to functions?",
       "a": "Yes. One function, one job, one level of detail."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **Django** separates models, forms, views and templates because each changes for a different reason."
    },
    {
     "t": "mcq",
     "id": "l0p-srp",
     "q": "ParkingLot parks cars, computes fees, prints receipts and writes to the database. Which principle does it break most?",
     "o": [
      "Liskov substitution",
      "Single responsibility",
      "Interface segregation"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-ocp",
   "title": "Open/closed",
   "blocks": [
    {
     "t": "p",
     "text": "Open for extension, closed for modification. New behavior should come from adding code, not from editing code that already works."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"fee() stays closed while new vehicle classes plug in\"><rect class=\"d-acc\" x=\"110\" y=\"76\" width=\"120\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"97\" text-anchor=\"middle\">fee(vehicle)</text><text class=\"d-s\" x=\"170\" y=\"113\" text-anchor=\"middle\">unchanged</text><rect class=\"d-box\" x=\"10\" y=\"10\" width=\"100\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"60\" y=\"29\" text-anchor=\"middle\">Bike</text><text class=\"d-s\" x=\"60\" y=\"45\" text-anchor=\"middle\">rate 1</text><rect class=\"d-box\" x=\"230\" y=\"10\" width=\"100\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"280\" y=\"29\" text-anchor=\"middle\">Car</text><text class=\"d-s\" x=\"280\" y=\"45\" text-anchor=\"middle\">rate 3</text><rect class=\"d-box\" x=\"10\" y=\"146\" width=\"100\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"60\" y=\"165\" text-anchor=\"middle\">Truck</text><text class=\"d-s\" x=\"60\" y=\"181\" text-anchor=\"middle\">rate 5</text><rect class=\"d-dashbox\" x=\"230\" y=\"146\" width=\"100\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"280\" y=\"165\" text-anchor=\"middle\">Bus</text><text class=\"d-s\" x=\"280\" y=\"181\" text-anchor=\"middle\">added later</text><path class=\"d-ln\" d=\"M110 54 L130 76\"/><path class=\"d-ln\" d=\"M230 54 L210 76\"/><path class=\"d-ln\" d=\"M110 146 L130 124\"/><path class=\"d-ln d-dashed\" d=\"M230 146 L210 124\"/></svg>",
     "alt": "Open/closed"
    },
    {
     "t": "code",
     "code": "# before: every new vehicle type edits this function\ndef rate(vehicle):\n    if vehicle.kind == \"bike\": return 1\n    if vehicle.kind == \"car\": return 3\n    if vehicle.kind == \"truck\": return 5\n\n# after: each type carries its own rate\nclass Vehicle:\n    rate = 3\n\nclass Bike(Vehicle):\n    rate = 1\n\nclass Truck(Vehicle):\n    rate = 5\n\nclass Bus(Vehicle):              # new requirement: one new class, nothing edited\n    rate = 8\n\ndef fee(vehicle, hours):\n    return vehicle.rate * hours"
    },
    {
     "t": "list",
     "items": [
      "Extension points: subclasses, strategy objects passed in, and dicts of handlers you register into.",
      "Don't build extension points everywhere. Add them where change is likely: pricing, assignment, notification."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** This is the rule behind \"each follow-up should be a one-line change\". When they add a vehicle type, a payment method or a pricing rule, say out loud that you're adding a class, not editing one."
    },
    {
     "t": "table",
     "head": [
      "",
      "Pattern",
      "What you add"
     ],
     "rows": [
      [
       "\"New pricing rule\"",
       "Strategy",
       "One pricing class"
      ],
      [
       "\"Add buses\"",
       "Subclass + Factory",
       "One class, one register() line"
      ],
      [
       "\"Notify on arrival, then also by email\"",
       "Observer",
       "One subscriber"
      ],
      [
       "\"Slots expire after 3 days\"",
       "State",
       "One state class"
      ],
      [
       "\"Switch payment provider\"",
       "Dependency inversion",
       "One adapter, injected"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Is a dict of handlers just as good?",
       "a": "Yes. `HANDLERS = {\"bike\": BikeRule()}` is an extension point: registering a new key doesn't edit the logic."
      },
      {
       "q": "Can you never edit existing code?",
       "a": "You can. Bug fixes and refactors are normal. OCP is about keeping the stable core stable as features grow."
      },
      {
       "q": "Which patterns are OCP in action?",
       "a": "Strategy, Observer, Decorator, and a factory with a registry."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **json.JSONEncoder**: subclass it and override `default()` to serialize new types without touching the json module."
    },
    {
     "t": "mcq",
     "id": "l0p-ocp",
     "q": "Adding a Bus means editing a function full of `if vehicle.kind == ...`. Which principle?",
     "o": [
      "Open/closed",
      "Single responsibility",
      "Dependency inversion"
     ],
     "a": 0
    }
   ]
  },
  {
   "id": "l0-lsp",
   "title": "Liskov substitution",
   "blocks": [
    {
     "t": "p",
     "text": "A subclass must work anywhere its parent is used, with no surprises: it accepts the same inputs and keeps the same promises."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Spot and EvSpot honor park; ReservedSpot raises\"><rect class=\"d-box\" x=\"10\" y=\"78\" width=\"110\" height=\"44\" rx=\"6\"/><text class=\"d-t\" x=\"65\" y=\"105\" text-anchor=\"middle\">spot.park(v)</text><rect class=\"d-acc\" x=\"220\" y=\"12\" width=\"110\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"275\" y=\"33\" text-anchor=\"middle\">Spot</text><text class=\"d-s\" x=\"275\" y=\"49\" text-anchor=\"middle\">parks</text><rect class=\"d-acc\" x=\"220\" y=\"76\" width=\"110\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"275\" y=\"97\" text-anchor=\"middle\">EvSpot</text><text class=\"d-s\" x=\"275\" y=\"113\" text-anchor=\"middle\">parks</text><rect class=\"d-badbox\" x=\"220\" y=\"140\" width=\"110\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"275\" y=\"161\" text-anchor=\"middle\">ReservedSpot</text><text class=\"d-s\" x=\"275\" y=\"177\" text-anchor=\"middle\">raises</text><path class=\"d-ara\" d=\"M120 92 L218 36\"/><path class=\"d-ara\" d=\"M120 100 L218 100\"/><path class=\"d-bad\" d=\"M120 108 L218 164\"/></svg>",
     "alt": "Liskov substitution"
    },
    {
     "t": "code",
     "code": "# violation: a subclass refuses what the parent promises\nclass Spot:\n    def park(self, vehicle):\n        self.vehicle = vehicle\n\nclass ReservedSpot(Spot):\n    def park(self, vehicle):\n        raise Exception(\"reserved\")      # code written for Spot now breaks\n\n# fix: model the rule so every spot honors park()\nclass Spot:\n    def __init__(self, reserved_for=None):\n        self.reserved_for = reserved_for\n        self.vehicle = None\n\n    def can_park(self, vehicle):\n        return self.reserved_for is None or vehicle.plate == self.reserved_for\n\n    def park(self, vehicle):\n        if not self.can_park(vehicle):\n            return False                 # same contract for every spot\n        self.vehicle = vehicle\n        return True"
    },
    {
     "t": "list",
     "items": [
      "Warning signs: an override that raises `NotImplementedError`, or callers checking `isinstance` before calling.",
      "A subclass may accept more and promise more, never less."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Electric, accessible and reserved spots are common follow-ups. If your subclass would refuse `park()`, use a field and a `can_park()` check instead."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Classic examples?",
       "a": "Square extending Rectangle, and Penguin extending a Bird that has `fly()`."
      },
      {
       "q": "How do you fix a violation?",
       "a": "Split the hierarchy (`FlyingBird`), or turn the varying part into data or a composed object."
      },
      {
       "q": "LSP and exceptions?",
       "a": "A subclass shouldn't raise new kinds of errors that callers of the parent aren't prepared for."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **io** streams advertise `readable()` and `writable()`, so callers can check before writing instead of being surprised."
    },
    {
     "t": "mcq",
     "id": "l0p-lsp",
     "q": "A subclass overrides `park()` to always raise. Code written for the parent now crashes. Which principle?",
     "o": [
      "Open/closed",
      "Interface segregation",
      "Liskov substitution"
     ],
     "a": 2
    }
   ]
  },
  {
   "id": "l0-isp",
   "title": "Interface segregation",
   "blocks": [
    {
     "t": "p",
     "text": "Don't force a class to depend on methods it doesn't use. Several small interfaces beat one big one."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"One fat interface split into small roles\"><rect class=\"d-badbox\" x=\"10\" y=\"40\" width=\"130\" height=\"120\" rx=\"6\"/><text class=\"d-b\" x=\"75\" y=\"97\" text-anchor=\"middle\">Machine</text><text class=\"d-s\" x=\"75\" y=\"113\" text-anchor=\"middle\">print · card · scan</text><path class=\"d-ara\" d=\"M140 100 L190 100\"/><rect class=\"d-acc\" x=\"200\" y=\"10\" width=\"130\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"265\" y=\"37\" text-anchor=\"middle\">TicketPrinter</text><rect class=\"d-acc\" x=\"200\" y=\"78\" width=\"130\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"265\" y=\"105\" text-anchor=\"middle\">CardReader</text><rect class=\"d-acc\" x=\"200\" y=\"146\" width=\"130\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"265\" y=\"173\" text-anchor=\"middle\">PlateScanner</text></svg>",
     "alt": "Interface segregation"
    },
    {
     "t": "code",
     "code": "from typing import Protocol\n\n# before: one fat interface\nclass Machine(Protocol):\n    def print_ticket(self): ...\n    def take_card(self): ...\n    def scan_plate(self): ...    # an exit gate doesn't print, a kiosk doesn't scan\n\n# after: small roles, combined as needed\nclass TicketPrinter(Protocol):\n    def print_ticket(self): ...\n\nclass CardReader(Protocol):\n    def take_card(self): ...\n\nclass EntryKiosk:                # implements only what it does\n    def print_ticket(self): ...\n    def take_card(self): ...\n\nclass ExitGate:\n    def take_card(self): ..."
    },
    {
     "t": "list",
     "items": [
      "Smell: methods written as `pass` or `raise NotImplementedError` only to satisfy an interface.",
      "Protocols make this cheap in Python: a class satisfies every small Protocol it happens to match."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** In Amazon Locker, a delivery agent drops packages and a customer only picks up. Separate `Depositor` and `Picker` roles are an easy ISP point to make."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "ISP vs SRP?",
       "a": "SRP is about a class's reasons to change. ISP is about what each caller sees: keep the interface it depends on minimal."
      },
      {
       "q": "Does it matter in Python without interfaces?",
       "a": "Yes. A fat base class forces stub methods. One Protocol or ABC per role keeps it clean."
      },
      {
       "q": "A standard library example?",
       "a": "`collections.abc.Collection` is just `Sized` + `Iterable` + `Container`, three tiny interfaces."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **collections.abc** is ISP in practice: `Sized` needs only `__len__`, `Iterable` only `__iter__`."
    },
    {
     "t": "mcq",
     "id": "l0p-isp",
     "q": "ExitGate implements `print_ticket()` as `pass` just to satisfy an interface. Which principle?",
     "o": [
      "Single responsibility",
      "Interface segregation",
      "Dependency inversion"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-dip",
   "title": "Dependency inversion",
   "blocks": [
    {
     "t": "p",
     "text": "High-level logic should depend on roles, not on concrete details. Pass the details in, so they can be swapped."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"ParkingLot depends on a payments role; Stripe and a fake both fit\"><rect class=\"d-acc\" x=\"100\" y=\"8\" width=\"140\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"35\" text-anchor=\"middle\">ParkingLot</text><path class=\"d-ar\" d=\"M170 52 L170 74\"/><rect class=\"d-dashbox\" x=\"90\" y=\"76\" width=\"160\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"97\" text-anchor=\"middle\">payments</text><text class=\"d-s\" x=\"170\" y=\"113\" text-anchor=\"middle\">anything with charge()</text><rect class=\"d-box\" x=\"10\" y=\"150\" width=\"140\" height=\"42\" rx=\"6\"/><text class=\"d-b\" x=\"80\" y=\"176\" text-anchor=\"middle\">StripeClient</text><rect class=\"d-box\" x=\"190\" y=\"150\" width=\"140\" height=\"42\" rx=\"6\"/><text class=\"d-b\" x=\"260\" y=\"176\" text-anchor=\"middle\">FakePayments</text><path class=\"d-tri\" d=\"M80 150 L130 126\"/><path class=\"d-tri\" d=\"M260 150 L210 126\"/></svg>",
     "alt": "Dependency inversion"
    },
    {
     "t": "code",
     "code": "# before: ParkingLot builds its own concrete dependencies\nclass ParkingLot:\n    def __init__(self):\n        self.payments = StripeClient()    # stuck with Stripe, hard to test\n\n# after: depend on roles, inject the concrete ones\nclass ParkingLot:\n    def __init__(self, payments, notifier):\n        self.payments = payments          # anything with charge()\n        self.notifier = notifier          # anything with send()\n\n    def checkout(self, ticket, amount):\n        if self.payments.charge(ticket.plate, amount):\n            self.notifier.send(ticket.phone, \"Thanks for parking\")\n\nclass FakePayments:                       # test double: no network, no charges\n    def charge(self, plate, amount):\n        return True\n\nclass PrintNotifier:\n    def send(self, to, msg):\n        print(to, msg)\n\nlot = ParkingLot(FakePayments(), PrintNotifier())"
    },
    {
     "t": "list",
     "items": [
      "Dependency injection is just passing objects in through `__init__`. No framework needed.",
      "Wire the concrete classes in one place, such as `main`, not deep inside business logic."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Saying \"I'd inject the payment gateway so we can test without real charges\" is a strong, cheap signal. It also answers \"how would you test this?\""
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "DIP vs dependency injection?",
       "a": "DIP is the principle: depend on abstractions. Dependency injection is the technique: pass dependencies in."
      },
      {
       "q": "How does it help testing?",
       "a": "You swap real services for fakes. No mocking library needed."
      },
      {
       "q": "What counts as high-level?",
       "a": "Business rules like parking and billing. Low-level: the SMS vendor, the database driver, the payment API."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **logging**: your code calls `logger.info()`, and whether that goes to a file, the console or a server is configured outside your code."
    },
    {
     "t": "mcq",
     "id": "l0p-dip",
     "q": "`ParkingLot.__init__` does `self.pay = StripeClient()`. Which fix follows dependency inversion?",
     "o": [
      "Subclass ParkingLot per payment provider",
      "Pass the payment client into __init__",
      "Make StripeClient a singleton"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-strategy",
   "title": "Strategy",
   "blocks": [
    {
     "t": "p",
     "text": "Put each interchangeable algorithm in its own object and let the main object hold one. Swap the object to change behavior."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"ParkingLot holds one assigner strategy and can swap it\"><rect class=\"d-box\" x=\"10\" y=\"70\" width=\"140\" height=\"60\" rx=\"6\"/><text class=\"d-b\" x=\"80\" y=\"97\" text-anchor=\"middle\">ParkingLot</text><text class=\"d-s\" x=\"80\" y=\"113\" text-anchor=\"middle\">assigner</text><rect class=\"d-acc\" x=\"200\" y=\"16\" width=\"130\" height=\"54\" rx=\"6\"/><text class=\"d-b\" x=\"265\" y=\"40\" text-anchor=\"middle\">NearestFirst</text><text class=\"d-s\" x=\"265\" y=\"56\" text-anchor=\"middle\">in use</text><rect class=\"d-dim\" x=\"200\" y=\"130\" width=\"130\" height=\"54\" rx=\"6\"/><text class=\"d-b\" x=\"265\" y=\"154\" text-anchor=\"middle\">SpreadOut</text><text class=\"d-s\" x=\"265\" y=\"170\" text-anchor=\"middle\">swap in anytime</text><path class=\"d-ara\" d=\"M150 92 L198 46\"/><path class=\"d-ln d-dashed\" d=\"M150 108 L198 156\"/></svg>",
     "alt": "Strategy"
    },
    {
     "t": "code",
     "code": "class NearestFirst:\n    def pick(self, spots, vehicle):\n        for spot in spots:                       # spots kept in distance order\n            if spot.is_free and spot.size == vehicle.size:\n                return spot\n        return None\n\nclass SpreadOut:                                 # fill the emptiest level first\n    def pick(self, spots, vehicle):\n        best = None\n        for spot in spots:\n            if spot.is_free and spot.size == vehicle.size:\n                if best is None or spot.level.free_count > best.level.free_count:\n                    best = spot\n        return best\n\nclass ParkingLot:\n    def __init__(self, spots, assigner):\n        self.spots = spots\n        self.assigner = assigner                 # the strategy\n\n    def park(self, vehicle):\n        spot = self.assigner.pick(self.spots, vehicle)\n        if spot:\n            spot.park(vehicle)\n        return spot\n\n# lot = ParkingLot(spots, NearestFirst())\n# lot.assigner = SpreadOut()                     # change behavior at runtime"
    },
    {
     "t": "list",
     "items": [
      "Reach for it when \"it depends\" how something is computed: pricing, slot assignment, routing, retries.",
      "In Python a strategy can be a plain function. Use a class when it needs settings or state."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** The most useful pattern for Amazon follow-ups. \"Assign the nearest locker\", then \"prefer lockers with fewer packages\": each one is a new strategy class."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Strategy vs State?",
       "a": "In Strategy, the caller picks the algorithm. In State, the object switches its own behavior as its status changes."
      },
      {
       "q": "Function or class?",
       "a": "`assigner=nearest_first` works fine. A class wins when the strategy carries settings, like a rate."
      },
      {
       "q": "Which SOLID rules does it serve?",
       "a": "Open/closed (new rule, new class) and dependency inversion (the lot depends on \"something with pick()\")."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **sorted(items, key=...)**: the key function is a strategy for ordering."
    },
    {
     "t": "mcq",
     "id": "l0p-strategy",
     "q": "Pricing rules change often and must switch at runtime. Which pattern?",
     "o": [
      "Singleton",
      "Factory",
      "Strategy"
     ],
     "a": 2
    }
   ]
  },
  {
   "id": "l0-factory",
   "title": "Factory",
   "blocks": [
    {
     "t": "p",
     "text": "Put object creation in one place, so callers ask for what they want without knowing which class gets built."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"A factory turns the string car into a Car object\"><rect class=\"d-box\" x=\"10\" y=\"80\" width=\"70\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"45\" y=\"105\" text-anchor=\"middle\">\"car\"</text><path class=\"d-ar\" d=\"M80 100 L108 100\"/><rect class=\"d-acc\" x=\"110\" y=\"70\" width=\"120\" height=\"60\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"97\" text-anchor=\"middle\">VehicleFactory</text><text class=\"d-s\" x=\"170\" y=\"113\" text-anchor=\"middle\">create()</text><rect class=\"d-dim\" x=\"260\" y=\"14\" width=\"70\" height=\"40\" rx=\"6\"/><text class=\"d-s\" x=\"295\" y=\"39\" text-anchor=\"middle\">Bike</text><rect class=\"d-acc\" x=\"260\" y=\"80\" width=\"70\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"295\" y=\"105\" text-anchor=\"middle\">Car</text><rect class=\"d-dim\" x=\"260\" y=\"146\" width=\"70\" height=\"40\" rx=\"6\"/><text class=\"d-s\" x=\"295\" y=\"171\" text-anchor=\"middle\">Truck</text><path class=\"d-ln\" d=\"M230 92 L258 38\"/><path class=\"d-ara\" d=\"M230 100 L258 100\"/><path class=\"d-ln\" d=\"M230 108 L258 162\"/></svg>",
     "alt": "Factory"
    },
    {
     "t": "code",
     "code": "class VehicleFactory:\n    _types = {\"bike\": Bike, \"car\": Car, \"truck\": Truck}    # registry\n\n    @classmethod\n    def create(cls, kind, plate):\n        if kind not in cls._types:\n            raise ValueError(f\"unknown vehicle type: {kind}\")\n        return cls._types[kind](plate)\n\n    @classmethod\n    def register(cls, kind, vehicle_class):    # new type, no edit to create()\n        cls._types[kind] = vehicle_class\n\ncar = VehicleFactory.create(\"car\", \"NY-123\")\nVehicleFactory.register(\"bus\", Bus)"
    },
    {
     "t": "list",
     "items": [
      "Use it when the class depends on input (a string from a sensor or an API) or when creation takes several steps.",
      "A classmethod like `Ticket.issue()` is the lightest factory. Don't build a factory class for one constructor call."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** The entry gate gets a raw type string from a sensor. A factory turns it into the right `Vehicle`, and `register()` makes \"add buses\" a one-liner."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Simple factory, factory method, abstract factory?",
       "a": "Simple factory: one function picks a class. Factory method: subclasses override a create method. Abstract factory: one object creates a family of related objects."
      },
      {
       "q": "Factory vs constructor?",
       "a": "A constructor builds one known class. A factory decides which class, and can cache or reuse objects."
      },
      {
       "q": "Where should it live?",
       "a": "At the boundary where raw input arrives (a gate, an API handler), not inside business logic."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **logging.getLogger(name)** is a factory that also caches: the same name always returns the same logger."
    },
    {
     "t": "mcq",
     "id": "l0p-factory",
     "q": "A gate sensor sends \"car\", \"bike\" or \"truck\", and you need the matching Vehicle object. Which pattern?",
     "o": [
      "Factory",
      "Observer",
      "State"
     ],
     "a": 0
    }
   ]
  },
  {
   "id": "l0-observer",
   "title": "Observer",
   "blocks": [
    {
     "t": "p",
     "text": "Let an object announce events to subscribers without knowing who they are. Subscribers sign up and get called when the event happens."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Locker publishes package_arrived to three subscribers\"><rect class=\"d-acc\" x=\"10\" y=\"76\" width=\"110\" height=\"48\" rx=\"6\"/><text class=\"d-b\" x=\"65\" y=\"97\" text-anchor=\"middle\">Locker</text><text class=\"d-s\" x=\"65\" y=\"113\" text-anchor=\"middle\">publish()</text><text class=\"d-s\" x=\"170\" y=\"68\" text-anchor=\"middle\">package_arrived</text><rect class=\"d-box\" x=\"220\" y=\"12\" width=\"110\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"275\" y=\"39\" text-anchor=\"middle\">SMS</text><rect class=\"d-box\" x=\"220\" y=\"78\" width=\"110\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"275\" y=\"105\" text-anchor=\"middle\">Email</text><rect class=\"d-dashbox\" x=\"220\" y=\"144\" width=\"110\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"275\" y=\"163\" text-anchor=\"middle\">App</text><text class=\"d-s\" x=\"275\" y=\"179\" text-anchor=\"middle\">added later</text><path class=\"d-ara\" d=\"M120 94 L218 34\"/><path class=\"d-ara\" d=\"M120 100 L218 100\"/><path class=\"d-ara\" d=\"M120 106 L218 166\"/></svg>",
     "alt": "Observer"
    },
    {
     "t": "code",
     "code": "class EventBus:\n    def __init__(self):\n        self._subs = {}                       # event name -> list of functions\n\n    def subscribe(self, event, fn):\n        if event not in self._subs:\n            self._subs[event] = []\n        self._subs[event].append(fn)\n\n    def publish(self, event, data):\n        for fn in self._subs.get(event, []):\n            fn(data)\n\ndef send_sms(package):\n    print(\"SMS: your package\", package, \"has arrived\")\n\ndef send_email(package):\n    print(\"Email: package\", package, \"is ready\")\n\nbus = EventBus()\nbus.subscribe(\"package_arrived\", send_sms)\nbus.subscribe(\"package_arrived\", send_email)  # new channel: one line\nbus.publish(\"package_arrived\", \"p-42\")        # both run"
    },
    {
     "t": "list",
     "items": [
      "The publisher never imports or names its subscribers. A new reaction is a new subscriber.",
      "Pass the function itself (`send_sms`), not its result (`send_sms()`)."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Amazon Locker: \"notify the customer when the package arrives\", then \"also email\", then \"also update the app\". With Observer each is one `subscribe` call."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Observer vs pub/sub?",
       "a": "Observer is in-process: the subject holds its observers. Pub/sub puts a broker in between (SNS, Kafka), usually across services."
      },
      {
       "q": "Push or pull?",
       "a": "Push sends the data with the event. Pull sends only a signal and observers fetch what they need. Push is simpler in an interview."
      },
      {
       "q": "Risks?",
       "a": "One failing subscriber can stop the rest (wrap calls in try/except), observers never unsubscribed, and control flow that's hard to trace."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **Django signals** like `post_save`, and every GUI button's click handler, are observers."
    },
    {
     "t": "mcq",
     "id": "l0p-observer",
     "q": "When a package arrives, SMS, email and the app must all be told, and more channels will come. Which pattern?",
     "o": [
      "Strategy",
      "Observer",
      "Singleton"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-singleton",
   "title": "Singleton",
   "blocks": [
    {
     "t": "p",
     "text": "Guarantee exactly one instance of a class. Useful for a truly shared resource, overused for everything else."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Three callers share one ParkingLot instance\"><rect class=\"d-box\" x=\"10\" y=\"14\" width=\"90\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"55\" y=\"39\" text-anchor=\"middle\">gate 1</text><rect class=\"d-box\" x=\"10\" y=\"80\" width=\"90\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"55\" y=\"105\" text-anchor=\"middle\">gate 2</text><rect class=\"d-box\" x=\"10\" y=\"146\" width=\"90\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"55\" y=\"171\" text-anchor=\"middle\">display</text><rect class=\"d-acc\" x=\"200\" y=\"70\" width=\"130\" height=\"60\" rx=\"6\"/><text class=\"d-b\" x=\"265\" y=\"97\" text-anchor=\"middle\">ParkingLot</text><text class=\"d-s\" x=\"265\" y=\"113\" text-anchor=\"middle\">one instance</text><path class=\"d-ara\" d=\"M100 34 L198 88\"/><path class=\"d-ara\" d=\"M100 100 L198 100\"/><path class=\"d-ara\" d=\"M100 166 L198 112\"/></svg>",
     "alt": "Singleton"
    },
    {
     "t": "code",
     "code": "# Pythonic: a module-level instance (a module is imported once)\n# config.py\nclass _Config:\n    def __init__(self):\n        self.rates = {\"car\": 3}\n\nconfig = _Config()        # every \"from config import config\" gets this one\n\n# Classic version, if they ask for it\nclass ParkingLot:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\na = ParkingLot()\nb = ParkingLot()\nprint(a is b)             # True"
    },
    {
     "t": "list",
     "items": [
      "With `__new__`, `__init__` still runs on every call and can reset state. Set state up once, inside the `if`.",
      "Not thread-safe as written. Put a `threading.Lock` around the check if asked."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Expect \"should ParkingLot be a singleton?\" A strong answer: one lot per process is fine, but pass that one instance around rather than reaching for a global, so tests and a second lot stay possible."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Why is it called an anti-pattern?",
       "a": "It's hidden global state: hard to test, and it ties every caller to one instance."
      },
      {
       "q": "How do you make it thread-safe?",
       "a": "A lock around creation, or create it at import time as a module-level object."
      },
      {
       "q": "Alternatives?",
       "a": "A module-level instance, or create one object in `main` and inject it."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **None**, **True** and **False** are singletons, which is why you write `x is None`."
    },
    {
     "t": "mcq",
     "id": "l0p-singleton",
     "q": "What prints?",
     "code": "class Lot:\n    _i = None\n    def __new__(cls):\n        if cls._i is None:\n            cls._i = super().__new__(cls)\n        return cls._i\n\nprint(Lot() is Lot())",
     "o": [
      "True",
      "False",
      "TypeError"
     ],
     "a": 0
    }
   ]
  },
  {
   "id": "l0-state",
   "title": "State",
   "blocks": [
    {
     "t": "p",
     "text": "When behavior depends on status, give each status its own class. The object hands each action to its current state, and the state decides the next one."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 200\" role=\"img\" aria-label=\"Locker slot states: Available, Occupied, Expired\"><ellipse class=\"d-acc\" cx=\"70\" cy=\"60\" rx=\"58\" ry=\"26\"/><text class=\"d-b\" x=\"70\" y=\"65\" text-anchor=\"middle\">Available</text>\n   <ellipse class=\"d-box\" cx=\"270\" cy=\"60\" rx=\"58\" ry=\"26\"/><text class=\"d-b\" x=\"270\" y=\"65\" text-anchor=\"middle\">Occupied</text>\n   <ellipse class=\"d-badbox\" cx=\"170\" cy=\"166\" rx=\"58\" ry=\"26\"/><text class=\"d-b\" x=\"170\" y=\"171\" text-anchor=\"middle\">Expired</text><path class=\"d-ara\" d=\"M128 50 L210 50\"/><text class=\"d-s\" x=\"170\" y=\"42\" text-anchor=\"middle\">assign</text><path class=\"d-ar\" d=\"M212 72 L128 72\"/><text class=\"d-s\" x=\"170\" y=\"88\" text-anchor=\"middle\">pick_up</text><path class=\"d-ar\" d=\"M256 86 L208 144\"/><text class=\"d-s\" x=\"252\" y=\"124\">3 days</text><path class=\"d-ar\" d=\"M132 144 L86 86\"/><text class=\"d-s\" x=\"102\" y=\"124\" text-anchor=\"end\">returned</text></svg>",
     "alt": "State"
    },
    {
     "t": "code",
     "code": "class Available:\n    def assign(self, slot, package):\n        slot.package = package\n        slot.state = Occupied()          # move to the next state\n\n    def pick_up(self, slot):\n        raise ValueError(\"slot is empty\")\n\nclass Occupied:\n    def assign(self, slot, package):\n        raise ValueError(\"slot is full\")\n\n    def pick_up(self, slot):\n        package = slot.package\n        slot.package = None\n        slot.state = Available()\n        return package\n\nclass LockerSlot:\n    def __init__(self):\n        self.package = None\n        self.state = Available()\n\n    def assign(self, package):\n        self.state.assign(self, package)  # the current state decides\n\n    def pick_up(self):\n        return self.state.pick_up(self)"
    },
    {
     "t": "list",
     "items": [
      "Two states? An Enum and an `if` is fine. Use the pattern at three or more states with different rules.",
      "Each state class handles every action, so an illegal move fails loudly in one place."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Locker slots (available, occupied, expired), elevators (idle, moving, doors open) and vending machines (idle, has money, dispensing) are all state machines. \"Expire after 3 days\" becomes one new state class."
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Enum + if vs State pattern?",
       "a": "An Enum for a few states with simple rules. The pattern when each state behaves differently across many actions."
      },
      {
       "q": "Who changes the state?",
       "a": "Either the state classes (shown here) or the main object. Letting states decide keeps each transition next to its rule."
      },
      {
       "q": "How do you draw it?",
       "a": "Ovals for states, arrows labeled with actions. Interviewers sometimes ask for exactly this."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **TCP connections** (LISTEN, ESTABLISHED, CLOSED) and **asyncio** tasks (pending, done, cancelled) are state machines."
    },
    {
     "t": "mcq",
     "id": "l0p-state",
     "q": "A locker slot behaves differently when available, occupied or expired. Which pattern?",
     "o": [
      "Factory",
      "Observer",
      "State"
     ],
     "a": 2
    }
   ]
  },
  {
   "id": "l0-solid-bugs",
   "title": "Find the bug",
   "blocks": [
    {
     "t": "p",
     "text": "Each snippet has one line that causes the error. Click it; the fix appears after."
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-0",
     "code": "class Notifier:\n    def send(self, channel, msg):\n        if channel == \"sms\":\n            send_sms(msg)\n        elif channel == \"email\":\n            send_email(msg)",
     "ask": {
      "q": "Adding push notifications means editing send().",
      "lines": [
       3
      ],
      "why": "Branching on a type string breaks open/closed. Make one class per channel with `send(msg)`, and pick or inject the one you need."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-1",
     "code": "class LockerService:\n    def __init__(self):\n        self.db = PostgresClient(\"prod-host\")\n\n    def assign(self, package):\n        slot = self.db.find_free_slot()\n        return slot",
     "ask": {
      "q": "Tests hit the production database.",
      "lines": [
       3
      ],
      "why": "The service builds its own dependency. Pass it in: `def __init__(self, db)`, so tests can hand it a fake."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-2",
     "code": "class Spot:\n    def park(self, v):\n        self.v = v\n\nclass ElectricSpot(Spot):\n    def park(self, v):\n        if not v.is_electric:\n            raise TypeError(\"EV only\")\n        self.v = v",
     "ask": {
      "q": "Code written for Spot crashes on ElectricSpot.",
      "lines": [
       8
      ],
      "why": "The subclass refuses what the parent accepts. Add `can_park(v)` to every spot and return False instead of raising."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-3",
     "code": "class Lot:\n    def __init__(self):\n        self.pricing = \"hourly\"\n\n    def bill(self, hours):\n        if self.pricing == \"hourly\":\n            return 3 * hours\n        return 20",
     "ask": {
      "q": "Every new pricing rule edits bill().",
      "lines": [
       3
      ],
      "why": "Store a strategy object, not a name: `self.pricing = Hourly()`, and `bill` returns `self.pricing.fee(hours)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-4",
     "code": "bus = EventBus()\n\ndef alert(level):\n    print(\"FULL\", level)\n\nbus.subscribe(\"lot_full\", alert())\nbus.publish(\"lot_full\", 2)",
     "ask": {
      "q": "TypeError: alert() missing 1 required positional argument.",
      "lines": [
       6
      ],
      "why": "This calls `alert` right away. Subscribe the function itself: `bus.subscribe(\"lot_full\", alert)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-5",
     "code": "class Registry:\n    _inst = None\n\n    def __new__(cls):\n        if cls._inst is None:\n            cls._inst = super().__new__(cls)\n        return cls._inst\n\n    def __init__(self):\n        self.items = {}",
     "ask": {
      "q": "Registry() loses its items every time it's called.",
      "lines": [
       10
      ],
      "why": "`__init__` runs on every call. Set `cls._inst.items = {}` inside the `if` in `__new__` and drop `__init__`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-6",
     "code": "def make_vehicle(kind, plate):\n    if kind == \"car\":\n        Car(plate)\n    elif kind == \"bike\":\n        return Bike(plate)",
     "ask": {
      "q": "make_vehicle(\"car\", \"NY1\") returns None.",
      "lines": [
       3
      ],
      "why": "The Car is built and thrown away. `return Car(plate)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-solid-7",
     "code": "class Available:\n    def assign(self, slot, package):\n        slot.package = package\n\nclass LockerSlot:\n    def __init__(self):\n        self.package = None\n        self.state = Available()",
     "ask": {
      "q": "A slot accepts a second package on top of the first.",
      "lines": [
       3
      ],
      "why": "The state never changes. After storing the package, move on: `slot.state = Occupied()`."
     }
    }
   ]
  },
  {
   "id": "l0-solid-final",
   "title": "Final check",
   "blocks": [
    {
     "t": "p",
     "text": "One question per idea, mixed up. Answer before you look back."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-0",
     "q": "Which design follows single responsibility?",
     "o": [
      "One TicketManager with fee(), print() and save()",
      "Ticket, FeeCalculator and ReceiptPrinter",
      "Ticket plus a PrintableTicket subclass"
     ],
     "a": 1,
     "why": "Each class has one reason to change: data, pricing rules, or receipt format."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-1",
     "q": "To add buses, you add `\"bus\": 8` to RATES. Does this follow open/closed?",
     "code": "RATES = {\"bike\": 1, \"car\": 3}\n\ndef fee(kind, hours):\n    return RATES[kind] * hours",
     "o": [
      "No, fee() must be edited",
      "Yes: you add data and fee() stays untouched",
      "Only if RATES becomes a class"
     ],
     "a": 1,
     "why": "A registry or dict of rules is an extension point. The logic in `fee()` never changes."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-2",
     "q": "Best fix?",
     "code": "class Bird:\n    def fly(self): return \"flying\"\n\nclass Penguin(Bird):\n    def fly(self): raise NotImplementedError",
     "o": [
      "Catch the exception wherever fly() is called",
      "Split into Bird and FlyingBird; only FlyingBird has fly()",
      "Make Penguin.fly() return None"
     ],
     "a": 1,
     "why": "Penguin can't keep Bird's promise, so the promise belongs to a narrower class."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-3",
     "q": "A Protocol has 8 methods, and most classes implement only 2 of them. Best move?",
     "o": [
      "Keep it and add pass to the rest",
      "Split it into small role Protocols",
      "Turn it into an ABC"
     ],
     "a": 1,
     "why": "Each caller should depend only on the methods it actually uses."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-4",
     "q": "How does dependency inversion make ParkingLot easier to test?",
     "o": [
      "Tests can pass a FakePayments that never charges a card",
      "It makes the code run faster",
      "It removes the need for tests"
     ],
     "a": 0,
     "why": "Because the lot receives its payment client, a test can hand it a fake."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-5",
     "q": "What prints?",
     "code": "class Lot:\n    def __init__(self, pricing):\n        self.pricing = pricing\n    def bill(self, hours):\n        return self.pricing(hours)\n\ndef hourly(h): return 3 * h\ndef flat(h): return 20\n\nlot = Lot(hourly)\nlot.pricing = flat\nprint(lot.bill(5))",
     "o": [
      "15",
      "20",
      "TypeError"
     ],
     "a": 1,
     "why": "A strategy can be a plain function. Swapping it changes behavior at runtime."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-6",
     "q": "\"Weekend rates differ, and members get 10% off.\" How do you combine both without a class per combination?",
     "o": [
      "A WeekendMemberPricing subclass",
      "Wrap one strategy in another: Discount(Weekend(), 0.10)",
      "An if/elif chain in bill()"
     ],
     "a": 1,
     "why": "A wrapper that holds another pricing object and adjusts its result (the Decorator pattern) combines rules freely."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-7",
     "q": "What happens?",
     "code": "class VehicleFactory:\n    _types = {\"car\": Car}\n\n    @classmethod\n    def create(cls, kind, plate):\n        return cls._types[kind](plate)\n\nVehicleFactory.create(\"bus\", \"NY1\")",
     "o": [
      "Creates a Vehicle",
      "KeyError",
      "Returns None"
     ],
     "a": 1,
     "why": "Unknown keys fail. Check first and raise a clear `ValueError`, or `register(\"bus\", Bus)`."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-8",
     "q": "Does b run?",
     "code": "def a(x): raise ValueError(\"boom\")\ndef b(x): print(\"b got\", x)\n\nsubs = [a, b]\nfor fn in subs:\n    fn(1)",
     "o": [
      "Yes",
      "No, the error stops the loop before b",
      "Yes, Python skips failing functions"
     ],
     "a": 1,
     "why": "One failing subscriber stops the rest. In real code, wrap each call in try/except and log the error."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-9",
     "q": "What prints?",
     "code": "class Lot:\n    _i = None\n    def __new__(cls):\n        if cls._i is None:\n            cls._i = super().__new__(cls)\n        return cls._i\n    def __init__(self):\n        self.cars = []\n\na = Lot()\na.cars.append(\"NY1\")\nb = Lot()\nprint(a.cars)",
     "o": [
      "['NY1']",
      "[]",
      "AttributeError"
     ],
     "a": 1,
     "why": "`__init__` runs again on every `Lot()` call and resets `cars`. a and b are the same object, now with an empty list."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-10",
     "q": "With the LockerSlot from the State card, what happens?",
     "code": "slot = LockerSlot()\nslot.assign(\"pkg1\")\nslot.assign(\"pkg2\")",
     "o": [
      "pkg2 replaces pkg1",
      "ValueError: slot is full",
      "The slot holds both"
     ],
     "a": 1,
     "why": "After the first assign, the state is Occupied, and Occupied refuses assign."
    },
    {
     "t": "mcq",
     "id": "l0f-solid-11",
     "q": "Strategy vs State: who decides when behavior switches?",
     "o": [
      "Strategy: the caller picks. State: the object moves itself between states.",
      "Strategy: the object moves itself. State: the caller picks.",
      "They are the same pattern"
     ],
     "a": 0,
     "why": "Same structure, different intent. A strategy is chosen from outside; states transition from inside."
    }
   ]
  },
  {
   "id": "l0-solid-run",
   "title": "Run it, then go deeper",
   "blocks": [
    {
     "t": "p",
     "text": "Strategy, Factory, Observer and State on one tiny locker, ending with three follow-ups done in one line each. Save as `patterns.py` and run `python3 patterns.py`."
    },
    {
     "t": "code",
     "title": "patterns.py",
     "code": "# patterns.py   run with:  python3 patterns.py\n# Strategy, Factory, Observer and State on one tiny locker, plus three follow-ups.\n\n\nclass EventBus:                                  # observer\n    def __init__(self):\n        self.subs = {}\n\n    def subscribe(self, event, fn):\n        if event not in self.subs:\n            self.subs[event] = []\n        self.subs[event].append(fn)\n\n    def publish(self, event, data):\n        for fn in self.subs.get(event, []):\n            fn(data)\n\n\nclass Available:                                 # state\n    def assign(self, slot, package):\n        slot.package = package\n        slot.state = Occupied()\n\n    def pick_up(self, slot):\n        raise ValueError(\"empty\")\n\n\nclass Occupied:\n    def assign(self, slot, package):\n        raise ValueError(\"full\")\n\n    def pick_up(self, slot):\n        package = slot.package\n        slot.package = None\n        slot.state = Available()\n        return package\n\n\nclass Slot:\n    def __init__(self, slot_id, size):\n        self.slot_id = slot_id\n        self.size = size\n        self.package = None\n        self.state = Available()\n\n\nclass SmallestFit:                               # strategy\n    def pick(self, slots, size):\n        best = None\n        for s in slots:\n            if s.package is None and s.size >= size:\n                if best is None or s.size < best.size:\n                    best = s\n        return best\n\n\nclass FirstFree:\n    def pick(self, slots, size):\n        for s in slots:\n            if s.package is None and s.size >= size:\n                return s\n        return None\n\n\nclass SlotFactory:                               # factory\n    SIZES = {\"S\": 1, \"M\": 2, \"L\": 3}\n\n    @classmethod\n    def create(cls, slot_id, code):\n        return Slot(slot_id, cls.SIZES[code])\n\n\nclass Locker:\n    def __init__(self, layout, picker, bus):\n        self.slots = []\n        for i in range(len(layout)):\n            self.slots.append(SlotFactory.create(i, layout[i]))\n        self.picker = picker\n        self.bus = bus\n\n    def deposit(self, package, size):\n        slot = self.picker.pick(self.slots, size)\n        if slot is None:\n            return None\n        slot.state.assign(slot, package)\n        self.bus.publish(\"arrived\", package)\n        return slot.slot_id\n\n\nif __name__ == \"__main__\":\n    bus = EventBus()\n    bus.subscribe(\"arrived\", lambda p: print(\"SMS:\", p, \"arrived\"))\n    locker = Locker(\"LSM\", SmallestFit(), bus)\n    print(\"slot\", locker.deposit(\"p1\", 1))       # slot 1: smallest that fits\n\n    # follow-up 1: \"also email the customer\"  -> one subscriber\n    bus.subscribe(\"arrived\", lambda p: print(\"Email:\", p, \"arrived\"))\n    # follow-up 2: \"fill slots in order\"       -> swap the strategy\n    locker.picker = FirstFree()\n    print(\"slot\", locker.deposit(\"p2\", 1))       # slot 0\n    # follow-up 3: \"add XL slots\"              -> one dict entry\n    SlotFactory.SIZES[\"XL\"] = 4"
    },
    {
     "t": "p",
     "text": "**Book:** Head First Design Patterns (2nd ed.). Read the Strategy, Observer, Factory, Singleton and State chapters. The examples are Java; the designs carry straight over."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "video",
       "req": true,
       "label": "Uncle Bob's SOLID principles made easy, in Python",
       "url": "https://www.youtube.com/watch?v=pTB30aXS77U",
       "yt": {
        "id": "pTB30aXS77U",
        "ch": "ArjanCodes"
       },
       "m": 20,
       "why": "All five rules applied to one small order system."
      },
      {
       "kind": "read",
       "req": true,
       "label": "Real Python: SOLID principles in Python",
       "url": "https://realpython.com/solid-principles-python/",
       "m": 30,
       "why": "Each principle with a before and after."
      },
      {
       "kind": "video",
       "req": false,
       "label": "The Strategy Pattern: Write better Python code, part 3",
       "url": "https://www.youtube.com/watch?v=WQ8bNdxREHU",
       "yt": {
        "id": "WQ8bNdxREHU",
        "ch": "ArjanCodes"
       },
       "m": 16,
       "why": "The pattern you reach for most in a design round."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Refactoring Guru: Strategy in Python",
       "url": "https://refactoring.guru/design-patterns/strategy/python/example",
       "m": 10,
       "why": "The pattern's structure and a runnable example."
      },
      {
       "kind": "read",
       "req": false,
       "label": "GitHub: faif/python-patterns",
       "url": "https://github.com/faif/python-patterns",
       "m": 15,
       "why": "Every pattern as short, idiomatic Python."
      }
     ]
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-0-problems",
 "n": 0.4,
 "one": true,
 "title": "Practice problems",
 "minutes": 90,
 "lead": "The building blocks under every design drill: the 40-minute plan, then Parking Lot, Amazon Locker, Unix file search and LRU cache with their follow-ups. One idea a screen: the figure, the code, the rules, the questions they ask, then a check.",
 "sections": [
  {
   "id": "l0-playbook",
   "title": "The 40-minute plan",
   "blocks": [
    {
     "t": "p",
     "text": "Every problem below follows the same clock. With Leadership Principles questions first, you may get only 35 to 40 minutes for design, so practice to that time."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 206\" role=\"img\" aria-label=\"Forty-minute plan in five steps\"><rect class=\"d-box\" x=\"10\" y=\"8\" width=\"320\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"22\" y=\"29\">0–5</text><text class=\"d-t\" x=\"92\" y=\"29\">Requirements, said back</text><rect class=\"d-box\" x=\"10\" y=\"47\" width=\"320\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"22\" y=\"68\">5–10</text><text class=\"d-t\" x=\"92\" y=\"68\">Classes and their jobs</text><rect class=\"d-acc\" x=\"10\" y=\"86\" width=\"320\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"22\" y=\"107\">10–30</text><text class=\"d-t\" x=\"92\" y=\"107\">Core flow, working code</text><rect class=\"d-box\" x=\"10\" y=\"125\" width=\"320\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"22\" y=\"146\">30–35</text><text class=\"d-t\" x=\"92\" y=\"146\">Walk one example through</text><rect class=\"d-box\" x=\"10\" y=\"164\" width=\"320\" height=\"32\" rx=\"6\"/><text class=\"d-a\" x=\"22\" y=\"185\">35–40</text><text class=\"d-t\" x=\"92\" y=\"185\">Follow-up requirements</text></svg>",
     "alt": "The 40-minute plan"
    },
    {
     "t": "code",
     "code": "# 0-5 min: say requirements back, write them as comments\n# - park and unpark vehicles of 3 sizes\n# - fee by hours and size\n# - out of scope for now: reservations, payment UI\n\n# 5-10 min: nouns become classes, each with a one-line job\nclass Vehicle: ...      # plate, size\nclass Spot: ...         # size, holds at most one vehicle\nclass Ticket: ...       # vehicle + spot + entry time\nclass ParkingLot: ...   # finds spots, issues tickets, computes fees\n\n# 10-30 min: core flow first, working code before anything clever\n#   park(vehicle) -> Ticket or None\n#   leave(plate)  -> fee\n\n# 30-35 min: walk one example through the code out loud\n# 35-40 min: follow-ups. For each: \"this changes in one place: <class>\""
    },
    {
     "t": "list",
     "items": [
      "Code beats diagrams. Amazon asks for syntactically correct code; a box drawing is optional.",
      "Say trade-offs out loud: what you chose, what you'd change at larger scale, what you left out on purpose."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Your interviews are on LiveCode, a shared editor. Practice in a plain editor with autocomplete off, and type the code yourself, since GenAI tools are not allowed during the interview."
    },
    {
     "t": "table",
     "head": [
      "",
      "Minutes",
      "Do",
      "Say"
     ],
     "rows": [
      [
       "Requirements",
       "0–5",
       "List features, ask about scale and edge cases",
       "\"Three sizes, hourly price, one entrance for now. Right?\""
      ],
      [
       "Classes",
       "5–10",
       "Name classes and their one-line jobs",
       "\"Spot owns one vehicle. The lot only finds spots.\""
      ],
      [
       "Core code",
       "10–30",
       "Write the main flow with simple structures",
       "\"Free spots per size in a dict, so park is O(1).\""
      ],
      [
       "Walkthrough",
       "30–35",
       "Trace one example through your code",
       "\"Car enters, gets spot 4, leaves after 2 hours, pays 6.\""
      ],
      [
       "Follow-ups",
       "35–40",
       "Absorb new requirements",
       "\"That's a new pricing class. Nothing else changes.\""
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "What if I can't finish?",
       "a": "Get the core flow (park and leave) working end to end. Stub the rest with clear method names and say what each would do."
      },
      {
       "q": "How many classes?",
       "a": "Usually 4 to 7, each with its data and 1 to 3 methods. Skip getter and setter boilerplate."
      },
      {
       "q": "They start asking about databases and servers?",
       "a": "Answer briefly: storage sits behind an injected repository, and in a database you'd lock the row or use a conditional update. Then steer back to the classes."
      },
      {
       "q": "Enums and dataclasses?",
       "a": "Yes. `Enum` for sizes and statuses, `@dataclass` for plain records. It saves time and shows Python fluency."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **Do each problem below twice:** once reading the solution, once two days later from a blank file with a 40-minute timer, talking out loud."
    },
    {
     "t": "mcq",
     "id": "l0p-playbook",
     "q": "The first 5 minutes of a design problem should go to:",
     "o": [
      "Writing class definitions",
      "Clarifying requirements",
      "Drawing a server architecture"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-parking",
   "title": "Parking Lot",
   "blocks": [
    {
     "t": "p",
     "text": "Design a parking lot with small, medium and large spots. Vehicles park in a spot of their size, get a ticket, and pay by the hour when they leave."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 206\" role=\"img\" aria-label=\"Parking Lot classes and how they connect\"><rect class=\"d-acc\" x=\"100\" y=\"8\" width=\"140\" height=\"46\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"28\" text-anchor=\"middle\">ParkingLot</text><text class=\"d-s\" x=\"170\" y=\"44\" text-anchor=\"middle\">free spots by size</text><rect class=\"d-box\" x=\"10\" y=\"96\" width=\"96\" height=\"42\" rx=\"6\"/><text class=\"d-b\" x=\"58\" y=\"122\" text-anchor=\"middle\">Spot</text><rect class=\"d-box\" x=\"122\" y=\"96\" width=\"96\" height=\"42\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"122\" text-anchor=\"middle\">Ticket</text><rect class=\"d-dashbox\" x=\"234\" y=\"96\" width=\"96\" height=\"42\" rx=\"6\"/><text class=\"d-b\" x=\"282\" y=\"114\" text-anchor=\"middle\">Pricing</text><text class=\"d-s\" x=\"282\" y=\"130\" text-anchor=\"middle\">strategy</text><rect class=\"d-box\" x=\"122\" y=\"164\" width=\"96\" height=\"36\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"187\" text-anchor=\"middle\">Vehicle</text><path class=\"d-ln\" d=\"M130 54 L70 94\"/><path class=\"d-ln\" d=\"M170 54 L170 94\"/><path class=\"d-ln\" d=\"M210 54 L270 94\"/><path class=\"d-ar\" d=\"M170 138 L170 162\"/><path class=\"d-ar\" d=\"M122 117 L108 117\"/></svg>",
     "alt": "Parking Lot"
    },
    {
     "t": "code",
     "code": "import time\nimport threading\nfrom enum import Enum\n\n\nclass Size(Enum):\n    SMALL = 1\n    MEDIUM = 2\n    LARGE = 3\n\n\nclass Vehicle:\n    size = Size.MEDIUM\n\n    def __init__(self, plate):\n        self.plate = plate\n\nclass Bike(Vehicle):\n    size = Size.SMALL\n\nclass Car(Vehicle):\n    size = Size.MEDIUM\n\nclass Truck(Vehicle):\n    size = Size.LARGE\n\n\nclass Spot:\n    def __init__(self, spot_id, size):\n        self.spot_id = spot_id\n        self.size = size\n        self.vehicle = None\n\n\nclass Ticket:\n    def __init__(self, vehicle, spot, entry):\n        self.vehicle = vehicle\n        self.spot = spot\n        self.entry = entry\n\n    def hours(self, now):\n        return max(1, int((now - self.entry + 3599) // 3600))   # round up, min 1\n\n\nclass HourlyPricing:                        # strategy: swap for other rules\n    RATES = {Size.SMALL: 1, Size.MEDIUM: 3, Size.LARGE: 5}\n\n    def fee(self, ticket, now):\n        return self.RATES[ticket.spot.size] * ticket.hours(now)\n\n\nclass ParkingLot:\n    def __init__(self, spots, pricing):\n        self.pricing = pricing\n        self.free = {}                      # size -> list of free spots\n        for size in Size:\n            self.free[size] = []\n        for spot in spots:\n            self.free[spot.size].append(spot)\n        self.active = {}                    # plate -> ticket\n        self.lock = threading.Lock()        # two gates can't take the same spot\n\n    def park(self, vehicle, now=None):\n        with self.lock:\n            if vehicle.plate in self.active:\n                raise ValueError(\"already parked\")\n            if not self.free[vehicle.size]:\n                return None                 # full for this size\n            spot = self.free[vehicle.size].pop()\n            spot.vehicle = vehicle\n            ticket = Ticket(vehicle, spot, now if now is not None else time.time())\n            self.active[vehicle.plate] = ticket\n            return ticket\n\n    def leave(self, plate, now=None):\n        with self.lock:\n            if plate not in self.active:\n                raise ValueError(\"no such ticket\")\n            ticket = self.active.pop(plate)\n            ticket.spot.vehicle = None\n            self.free[ticket.spot.size].append(ticket.spot)   # spot is free again\n            return self.pricing.fee(ticket, now if now is not None else time.time())\n\n\nif __name__ == \"__main__\":\n    spots = [Spot(1, Size.MEDIUM), Spot(2, Size.MEDIUM), Spot(3, Size.SMALL)]\n    lot = ParkingLot(spots, HourlyPricing())\n    t = lot.park(Car(\"NY-1\"), now=0)\n    print(\"spot\", t.spot.spot_id)                   # spot 2\n    print(\"fee\", lot.leave(\"NY-1\", now=2 * 3600))   # fee 6"
    },
    {
     "t": "list",
     "items": [
      "Ask first: which vehicle and spot sizes? Can a small vehicle take a bigger spot? Several levels or gates?",
      "Ask about money: hourly or flat? Different by size? What about a lost ticket? How do people pay?"
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** The most reported Amazon design problem. Expect these follow-ups in roughly this order; each row in the table is one small change."
    },
    {
     "t": "table",
     "head": [
      "",
      "Follow-up",
      "Change"
     ],
     "rows": [
      [
       "1",
       "\"Bikes can use any spot, cars medium or large\"",
       "In park(), try free lists from vehicle.size upward"
      ],
      [
       "2",
       "\"Weekend pricing\"",
       "New pricing class; lot.pricing = WeekendPricing()"
      ],
      [
       "3",
       "\"Several levels, each with a free-count display\"",
       "Level class owns spots; publish count changes to displays (Observer)"
      ],
      [
       "4",
       "\"EV charging spots\"",
       "Spot gets a features set; free lists keyed by (size, ev)"
      ],
      [
       "5",
       "\"Pay by card or cash\"",
       "PaymentMethod passed into leave() (Strategy / DIP)"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Why free lists per size instead of scanning?",
       "a": "Scanning is O(n) per car. Popping from a list per size is O(1), and the list gets the spot back on leave()."
      },
      {
       "q": "Two gates at once?",
       "a": "The lock makes find-and-take atomic. At larger scale: one lock per size, or a database row lock or conditional update."
      },
      {
       "q": "Unknown plate at exit?",
       "a": "Raise a clear error and fall back to a lost-ticket flow, usually a flat daily maximum."
      },
      {
       "q": "How would you store this?",
       "a": "Behind a repository interface passed into the lot, so it can be in memory for tests and a database in production."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **Compare your version** against the Python Parking Lot in ashishps1/awesome-low-level-design on GitHub. The class list should look similar; the follow-up handling is where answers differ."
    },
    {
     "t": "mcq",
     "id": "l0p-parking",
     "q": "Fastest way to find a free medium spot as the lot grows?",
     "o": [
      "Scan all spots on each car",
      "Keep a list of free spots per size",
      "Sort all spots on every park"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-locker",
   "title": "Amazon Locker",
   "blocks": [
    {
     "t": "p",
     "text": "Design a locker location. A delivery agent drops off a package in a slot that fits; the customer gets a code and picks it up within 3 days, or the package is returned."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 206\" role=\"img\" aria-label=\"A small package goes to the smallest slot that fits, and the customer gets a code\"><rect class=\"d-box\" x=\"100\" y=\"8\" width=\"140\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"170\" y=\"25\" text-anchor=\"middle\">Locker</text><text class=\"d-s\" x=\"170\" y=\"41\" text-anchor=\"middle\">deposit · pick_up</text><rect class=\"d-acc\" x=\"30\" y=\"78\" width=\"60\" height=\"44\" rx=\"6\"/><text class=\"d-b\" x=\"60\" y=\"97\" text-anchor=\"middle\">S1</text><text class=\"d-s\" x=\"60\" y=\"113\" text-anchor=\"middle\">small</text><rect class=\"d-box\" x=\"110\" y=\"72\" width=\"80\" height=\"56\" rx=\"6\"/><text class=\"d-b\" x=\"150\" y=\"97\" text-anchor=\"middle\">M1</text><text class=\"d-s\" x=\"150\" y=\"113\" text-anchor=\"middle\">medium</text><rect class=\"d-box\" x=\"210\" y=\"64\" width=\"100\" height=\"70\" rx=\"6\"/><text class=\"d-b\" x=\"260\" y=\"96\" text-anchor=\"middle\">L1</text><text class=\"d-s\" x=\"260\" y=\"112\" text-anchor=\"middle\">large</text><rect class=\"d-box\" x=\"20\" y=\"160\" width=\"80\" height=\"32\" rx=\"6\"/><text class=\"d-t\" x=\"60\" y=\"181\" text-anchor=\"middle\">p1 · small</text><path class=\"d-ara\" d=\"M60 160 L60 124\"/><text class=\"d-a\" x=\"130\" y=\"182\">code 048213 → customer</text></svg>",
     "alt": "Amazon Locker"
    },
    {
     "t": "code",
     "code": "import secrets\n\nSMALL, MEDIUM, LARGE = 1, 2, 3\n\n\nclass Package:\n    def __init__(self, package_id, size):\n        self.package_id = package_id\n        self.size = size\n\n\nclass Slot:\n    def __init__(self, slot_id, size):\n        self.slot_id = slot_id\n        self.size = size\n        self.package = None\n        self.code = None\n        self.deadline = None\n\n    def clear(self):\n        self.package = None\n        self.code = None\n        self.deadline = None\n\n\nclass Locker:\n    PICKUP_DAYS = 3\n\n    def __init__(self, slots):\n        self.slots = sorted(slots, key=lambda s: s.size)   # smallest first\n        self.by_code = {}                                  # code -> slot\n\n    def deposit(self, package, now):\n        for slot in self.slots:\n            if slot.package is None and slot.size >= package.size:  # smallest fit\n                slot.package = package\n                slot.code = self._new_code()\n                slot.deadline = now + self.PICKUP_DAYS * 86400\n                self.by_code[slot.code] = slot\n                return slot.code            # sent to the customer\n        return None                         # nothing fits: reroute the package\n\n    def pick_up(self, code, now):\n        slot = self.by_code.get(code)\n        if slot is None or now > slot.deadline:\n            raise ValueError(\"invalid or expired code\")\n        del self.by_code[code]\n        package = slot.package\n        slot.clear()\n        return package\n\n    def expire(self, now):                  # run daily: free overdue slots\n        returned = []\n        for slot in self.slots:\n            if slot.package is not None and now > slot.deadline:\n                returned.append(slot.package)\n                del self.by_code[slot.code]\n                slot.clear()\n        return returned\n\n    def _new_code(self):\n        while True:\n            code = f\"{secrets.randbelow(10**6):06d}\"   # 6 digits, unguessable\n            if code not in self.by_code:\n                return code\n\n\nif __name__ == \"__main__\":\n    locker = Locker([Slot(\"L1\", LARGE), Slot(\"S1\", SMALL), Slot(\"M1\", MEDIUM)])\n    code = locker.deposit(Package(\"p1\", SMALL), now=0)\n    print(locker.by_code[code].slot_id)                # S1\n    print(locker.pick_up(code, now=3600).package_id)   # p1"
    },
    {
     "t": "list",
     "items": [
      "Ask first: slot sizes? One location or many? Who deposits, who picks up, and how is the customer told?",
      "Ask about limits: pickup window? What if nothing fits? Can a code be reused, and how many wrong attempts are allowed?"
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Amazon's own product, and often reported. Interviewers like to see smallest-fit assignment, unguessable codes, and an expiry path. Each follow-up maps to one pattern from tab 3."
    },
    {
     "t": "table",
     "head": [
      "",
      "Follow-up",
      "Change"
     ],
     "rows": [
      [
       "1",
       "\"Many locker locations: pick the nearest with space\"",
       "LockerService over Lockers, with a location-picking strategy"
      ],
      [
       "2",
       "\"Notify by SMS and email\"",
       "Publish package_arrived; channels subscribe (Observer)"
      ],
      [
       "3",
       "\"Slots can be out of service\"",
       "Slot status (State, or an Enum with three values)"
      ],
      [
       "4",
       "\"Lock out after 5 wrong codes\"",
       "Attempt counter per location; reject while locked"
      ],
      [
       "5",
       "\"Returns: customers drop items off\"",
       "Deposit flow reused with a different package source"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Why smallest fit?",
       "a": "It keeps large slots free for large packages. Largest-first fills the locker with small packages and rejects the next big one."
      },
      {
       "q": "Why secrets, not random?",
       "a": "`random` is predictable. `secrets` is made for codes people shouldn't guess."
      },
      {
       "q": "Faster slot lookup?",
       "a": "Keep a free list per size, like the parking lot. Then deposit tries sizes from the package size upward."
      },
      {
       "q": "What runs expire()?",
       "a": "A scheduled job, such as daily. Mention it; you don't need to build the scheduler."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **HelloInterview's Amazon Locker breakdown** (linked in Go deeper) walks the same problem and says what's expected at each level."
    },
    {
     "t": "mcq",
     "id": "l0p-locker",
     "q": "A small package arrives. Free slots: large and small. Where should it go?",
     "o": [
      "Large, to be safe",
      "Small: the smallest slot that fits",
      "Whichever is closer to the door"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-unixfind",
   "title": "Unix file search",
   "blocks": [
    {
     "t": "p",
     "text": "Design an API like Unix find: search a directory tree for files matching criteria such as minimum size and extension, combined with AND and OR, and easy to extend with new criteria."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 206\" role=\"img\" aria-label=\"A file tree searched with And(MinSize, Extension), returning big.xml\"><text class=\"d-t\" x=\"16\" y=\"30\">/</text><text class=\"d-t\" x=\"16\" y=\"58\">├ logs/</text><text class=\"d-a\" x=\"16\" y=\"86\">│  ├ big.xml  8 MB</text>\n   <text class=\"d-s\" x=\"16\" y=\"114\">│  └ small.xml 10 B</text><text class=\"d-s\" x=\"16\" y=\"142\">└ photo.jpg  9 MB</text><rect class=\"d-acc\" x=\"210\" y=\"14\" width=\"120\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"270\" y=\"39\" text-anchor=\"middle\">And</text><rect class=\"d-box\" x=\"200\" y=\"96\" width=\"64\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"232\" y=\"121\" text-anchor=\"middle\">MinSize</text><rect class=\"d-box\" x=\"272\" y=\"96\" width=\"64\" height=\"40\" rx=\"6\"/><text class=\"d-t\" x=\"304\" y=\"121\" text-anchor=\"middle\">Ext xml</text><path class=\"d-ln\" d=\"M250 54 L232 94\"/><path class=\"d-ln\" d=\"M290 54 L304 94\"/><text class=\"d-a\" x=\"270\" y=\"176\" text-anchor=\"middle\">→ [big.xml]</text></svg>",
     "alt": "Unix file search"
    },
    {
     "t": "code",
     "code": "from abc import ABC, abstractmethod\n\n\nclass File:\n    def __init__(self, name, size=0, is_dir=False):\n        self.name = name\n        self.size = size\n        self.is_dir = is_dir\n        self.children = []\n\n    def add(self, child):\n        self.children.append(child)\n        return child\n\n    @property\n    def extension(self):\n        if \".\" not in self.name:\n            return \"\"\n        return self.name.rsplit(\".\", 1)[1]\n\n\nclass Filter(ABC):\n    @abstractmethod\n    def matches(self, file): ...\n\n\nclass MinSize(Filter):\n    def __init__(self, min_bytes):\n        self.min_bytes = min_bytes\n\n    def matches(self, file):\n        return file.size >= self.min_bytes\n\n\nclass Extension(Filter):\n    def __init__(self, ext):\n        self.ext = ext\n\n    def matches(self, file):\n        return file.extension == self.ext\n\n\nclass And(Filter):                         # composite: combine any filters\n    def __init__(self, *filters):\n        self.filters = filters\n\n    def matches(self, file):\n        for f in self.filters:\n            if not f.matches(file):\n                return False\n        return True\n\n\nclass Or(Filter):\n    def __init__(self, *filters):\n        self.filters = filters\n\n    def matches(self, file):\n        for f in self.filters:\n            if f.matches(file):\n                return True\n        return False\n\n\ndef find(root, flt):\n    results = []\n    stack = [root]                         # explicit stack: no recursion limit\n    while stack:\n        node = stack.pop()\n        if node.is_dir:\n            stack.extend(node.children)\n        elif flt.matches(node):\n            results.append(node)\n    return results\n\n\nif __name__ == \"__main__\":\n    root = File(\"/\", is_dir=True)\n    logs = root.add(File(\"logs\", is_dir=True))\n    logs.add(File(\"big.xml\", 8_000_000))\n    logs.add(File(\"small.xml\", 10))\n    root.add(File(\"photo.jpg\", 9_000_000))\n    hits = find(root, And(MinSize(5_000_000), Extension(\"xml\")))\n    print([f.name for f in hits])          # ['big.xml']"
    },
    {
     "t": "list",
     "items": [
      "Ask first: which criteria (size, extension, name, modified date)? AND only, or AND and OR? Directories in results?",
      "Ask about scale: tree depth? Symbolic links that could loop? Results sorted or streamed?"
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** A long-running Amazon favorite. What's scored is the Filter interface: a new criterion should be a new class, and And/Or should combine any filters, including other And/Or."
    },
    {
     "t": "table",
     "head": [
      "",
      "Follow-up",
      "Change"
     ],
     "rows": [
      [
       "1",
       "\"Filter by name pattern\"",
       "NameMatches(Filter) using fnmatch; nothing else changes"
      ],
      [
       "2",
       "\"NOT\"",
       "Not(Filter) wrapping one filter"
      ],
      [
       "3",
       "\"Skip some directories\"",
       "A second filter applied to directories in find()"
      ],
      [
       "4",
       "\"Huge trees: return results as found\"",
       "Make find() a generator with yield"
      ],
      [
       "5",
       "\"Symlinks can loop\"",
       "Track visited ids in a set and skip repeats"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Why classes, not one function with many parameters?",
       "a": "A parameter per criterion means editing `find()` for every new one. Filter classes keep it open/closed, and And/Or nest freely."
      },
      {
       "q": "Which pattern is And/Or?",
       "a": "Composite: a group of filters is itself a filter. Each filter alone is a Specification."
      },
      {
       "q": "Why an explicit stack?",
       "a": "Python's recursion limit is about 1000 frames. A stack avoids `RecursionError` on deep trees."
      },
      {
       "q": "Cheapest filter first?",
       "a": "Yes. Put cheap checks (extension) before costly ones (reading file contents) inside And, since it stops at the first False."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **pathlib.Path.rglob()** and **os.walk()** are the real-world versions of the traversal; the filter design is yours to add."
    },
    {
     "t": "mcq",
     "id": "l0p-unixfind",
     "q": "Search for files over 5 MB AND ending in .xml, and new criteria must be easy to add. Best design?",
     "o": [
      "One function with an optional parameter per criterion",
      "Filter objects with matches(file), combined by And/Or",
      "A regular expression on the full path"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-lru",
   "title": "LRU cache",
   "blocks": [
    {
     "t": "p",
     "text": "Design a cache with a fixed capacity. get and put must be O(1), and when it's full, the least recently used key is evicted."
    },
    {
     "t": "svg",
     "svg": "<svg viewBox=\"0 0 340 206\" role=\"img\" aria-label=\"Doubly linked list from most recent to least recent, plus a dict, with key 2 evicted\"><text class=\"d-s\" x=\"84\" y=\"30\">most recent</text><text class=\"d-s\" x=\"296\" y=\"30\" text-anchor=\"end\">least recent</text><rect class=\"d-dim\" x=\"10\" y=\"40\" width=\"64\" height=\"40\" rx=\"6\"/><text class=\"d-s\" x=\"42\" y=\"65\" text-anchor=\"middle\">head</text><rect class=\"d-acc\" x=\"84\" y=\"40\" width=\"64\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"116\" y=\"65\" text-anchor=\"middle\">3:c</text><rect class=\"d-acc\" x=\"158\" y=\"40\" width=\"64\" height=\"40\" rx=\"6\"/><text class=\"d-b\" x=\"190\" y=\"65\" text-anchor=\"middle\">1:a</text><rect class=\"d-dim\" x=\"232\" y=\"40\" width=\"64\" height=\"40\" rx=\"6\"/><text class=\"d-s\" x=\"264\" y=\"65\" text-anchor=\"middle\">tail</text><path class=\"d-ar\" d=\"M74 56 L82 56\"/><path class=\"d-ar\" d=\"M148 56 L156 56\"/><path class=\"d-ar\" d=\"M222 56 L230 56\"/><path class=\"d-ar\" d=\"M84 66 L76 66\"/><path class=\"d-ar\" d=\"M158 66 L150 66\"/><path class=\"d-ar\" d=\"M232 66 L224 66\"/><rect class=\"d-badbox\" x=\"158\" y=\"116\" width=\"64\" height=\"36\" rx=\"6\"/><text class=\"d-b\" x=\"190\" y=\"131\" text-anchor=\"middle\">2:b</text><text class=\"d-s\" x=\"190\" y=\"147\" text-anchor=\"middle\">evicted</text><text class=\"d-s\" x=\"10\" y=\"190\">map = {1: node, 3: node}   get and put are O(1)</text></svg>",
     "alt": "LRU cache"
    },
    {
     "t": "code",
     "code": "class Node:\n    def __init__(self, key, value):\n        self.key = key\n        self.value = value\n        self.prev = None\n        self.next = None\n\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.map = {}                       # key -> node, O(1) lookup\n        self.head = Node(None, None)        # sentinel on the most-recent side\n        self.tail = Node(None, None)        # sentinel on the least-recent side\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def _remove(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def _add_front(self, node):\n        node.prev = self.head\n        node.next = self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n\n    def get(self, key):\n        if key not in self.map:\n            return None\n        node = self.map[key]\n        self._remove(node)                  # mark as most recently used\n        self._add_front(node)\n        return node.value\n\n    def put(self, key, value):\n        if key in self.map:\n            self._remove(self.map[key])\n        node = Node(key, value)\n        self.map[key] = node\n        self._add_front(node)\n        if len(self.map) > self.capacity:\n            lru = self.tail.prev            # least recently used\n            self._remove(lru)\n            del self.map[lru.key]\n\n\nif __name__ == \"__main__\":\n    c = LRUCache(2)\n    c.put(1, \"a\")\n    c.put(2, \"b\")\n    c.get(1)                                # 1 becomes most recent\n    c.put(3, \"c\")                           # evicts 2\n    print(c.get(2), c.get(1), c.get(3))     # None a c"
    },
    {
     "t": "list",
     "items": [
      "Ask first: what to return on a miss? Capacity in items or bytes? Single thread or many?",
      "Sentinel head and tail nodes remove every \"is the list empty?\" edge case. Mention that as you write them."
     ]
    },
    {
     "t": "p",
     "text": "**In your Amazon round.** Comes up both as a coding problem and as design. If asked whether you can use `OrderedDict`, say yes (`move_to_end`, `popitem(last=False)`), then offer to write the linked list, since that's usually what they want to see."
    },
    {
     "t": "table",
     "head": [
      "",
      "Follow-up",
      "Change"
     ],
     "rows": [
      [
       "1",
       "\"Entries expire after N seconds\"",
       "Store an expiry time in each node; on get, treat expired as a miss"
      ],
      [
       "2",
       "\"Thread-safe\"",
       "One lock around get and put"
      ],
      [
       "3",
       "\"Evict the least frequently used instead\"",
       "Swap the eviction policy (Strategy); LFU needs frequency buckets"
      ],
      [
       "4",
       "\"Load from the database on a miss\"",
       "Inject a loader function; get() calls it and caches the result"
      ],
      [
       "5",
       "\"Report hit rate\"",
       "Two counters updated in get()"
      ]
     ]
    },
    {
     "t": "faq",
     "prose": true,
     "title": "Interview questions",
     "items": [
      {
       "q": "Why a doubly linked list?",
       "a": "Removing a node from the middle in O(1) needs a pointer to its previous node."
      },
      {
       "q": "Why store the key inside the node?",
       "a": "On eviction you only have the node, and you need its key to delete it from the dict."
      },
      {
       "q": "Complexity?",
       "a": "get and put are O(1) time. Space is O(capacity)."
      },
      {
       "q": "Where are LRU caches used?",
       "a": "CPU caches, database buffer pools, CDNs, and Python's own `functools.lru_cache`."
      }
     ]
    },
    {
     "t": "p",
     "text": "**In the wild.** **functools.lru_cache** in CPython is a real LRU built on a circular doubly linked list, the same idea as here."
    },
    {
     "t": "mcq",
     "id": "l0p-lru",
     "q": "O(1) get and put for an LRU cache needs:",
     "o": [
      "A list only",
      "A dict plus a doubly linked list",
      "A heap"
     ],
     "a": 1
    }
   ]
  },
  {
   "id": "l0-problems-bugs",
   "title": "Find the bug",
   "blocks": [
    {
     "t": "p",
     "text": "Each snippet has one line that causes the error. Click it; the fix appears after."
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-0",
     "code": "def park(self, vehicle):\n    spot = self.free[vehicle.size].pop()\n    spot.vehicle = vehicle\n    return Ticket(vehicle, spot, time.time())\n\ndef leave(self, ticket):\n    ticket.spot.vehicle = None\n    return self.pricing.fee(ticket, time.time())",
     "ask": {
      "q": "After a few hours the lot says full while half the spots are empty.",
      "lines": [
       7
      ],
      "why": "The spot is emptied but never returned to its free list. Add `self.free[ticket.spot.size].append(ticket.spot)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-1",
     "code": "def park(self, vehicle):\n    with self.lock:\n        spot = self.free[vehicle.size].pop()\n        spot.vehicle = vehicle\n        return Ticket(vehicle, spot, time.time())",
     "ask": {
      "q": "IndexError when the lot fills up.",
      "lines": [
       3
      ],
      "why": "Popping from an empty list raises. Check `if not self.free[vehicle.size]: return None` first."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-2",
     "code": "def deposit(self, package, now):\n    for slot in sorted(self.slots, key=lambda s: s.size, reverse=True):\n        if slot.package is None and slot.size >= package.size:\n            slot.package = package\n            return slot",
     "ask": {
      "q": "Small packages keep filling the large slots.",
      "lines": [
       2
      ],
      "why": "`reverse=True` tries the largest slots first. Sort smallest first so the first fit is the smallest fit."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-3",
     "code": "def find(root, flt):\n    results = []\n    stack = [root]\n    while stack:\n        node = stack.pop()\n        if node.is_dir:\n            stack.extend(node.children)\n        elif flt.matches(node):\n            results.append(node)\n            return results\n    return results",
     "ask": {
      "q": "find() returns only the first match.",
      "lines": [
       10
      ],
      "why": "The early return stops the search. Remove it so the loop keeps going."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-4",
     "code": "class Or(Filter):\n    def __init__(self, *filters):\n        self.filters = filters\n\n    def matches(self, file):\n        for f in self.filters:\n            if not f.matches(file):\n                return False\n        return True",
     "ask": {
      "q": "Or(...) behaves like And(...).",
      "lines": [
       7
      ],
      "why": "This is And's logic. Or returns True on the first match: `if f.matches(file): return True`, then `return False` at the end."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-5",
     "code": "def get(self, key):\n    if key not in self.map:\n        return None\n    node = self.map[key]\n    return node.value",
     "ask": {
      "q": "Keys you just read still get evicted first.",
      "lines": [
       5
      ],
      "why": "A read must count as use. Before returning, move the node to the front: `self._remove(node)` and `self._add_front(node)`."
     }
    },
    {
     "t": "code",
     "quiz": true,
     "id": "l0b-problems-6",
     "code": "def put(self, key, value):\n    node = Node(key, value)\n    self.map[key] = node\n    self._add_front(node)\n    if len(self.map) > self.capacity:\n        lru = self.tail.prev\n        self._remove(lru)\n        del self.map[lru.key]",
     "ask": {
      "q": "Updating an existing key makes the cache grow past capacity.",
      "lines": [
       2
      ],
      "why": "The old node for this key stays in the list as a ghost. First `if key in self.map: self._remove(self.map[key])`."
     }
    }
   ]
  },
  {
   "id": "l0-problems-final",
   "title": "Final check",
   "blocks": [
    {
     "t": "p",
     "text": "One question per idea, mixed up. Answer before you look back."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-0",
     "q": "At minute 35 the interviewer adds \"support EV charging spots\". Best response?",
     "o": [
      "Start over with a cleaner design",
      "Name the class that changes, make the small change, mention how you'd test it",
      "Say it's out of scope"
     ],
     "a": 1,
     "why": "Follow-ups test extensibility. Pointing at the one place that changes is the signal they want."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-1",
     "q": "Two entry gates try to take the last medium spot at the same moment. Fix in an in-memory design?",
     "o": [
      "Ignore it; it's rare",
      "A lock around find-and-take so it's atomic",
      "Give each gate its own copy of the spots"
     ],
     "a": 1,
     "why": "Without the lock both gates can pop from the same list state. At database scale, use a row lock or conditional update."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-2",
     "q": "A car stays 3601 seconds. With `max(1, int((secs + 3599) // 3600))`, how many hours are billed?",
     "o": [
      "1",
      "2",
      "3"
     ],
     "a": 1,
     "why": "3601 + 3599 = 7200, and 7200 // 3600 = 2. Any part of an hour rounds up."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-3",
     "q": "A customer hasn't picked up after 3 days. Cleanest design?",
     "o": [
      "A script edits slot fields directly in storage",
      "A deadline on each slot, and an expire() job that frees overdue slots",
      "Delete the package record"
     ],
     "a": 1,
     "why": "The rule stays inside Locker, and the job only calls it."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-4",
     "q": "How should pickup codes be generated?",
     "o": [
      "Sequential numbers",
      "secrets, plus a check that the code isn't already in use",
      "The customer's phone number"
     ],
     "a": 1,
     "why": "Sequential or personal data can be guessed. Unique random codes from `secrets` can't."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-5",
     "q": "What does this return?",
     "code": "f = And(MinSize(5_000_000), Extension(\"xml\"))\nf.matches(File(\"a.xml\", 1_000))",
     "o": [
      "True",
      "False",
      "TypeError"
     ],
     "a": 1,
     "why": "The extension matches but the size doesn't, and And needs both."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-6",
     "q": "The tree is thousands of directories deep. Risk with a recursive find()?",
     "o": [
      "RecursionError past about 1000 levels; use an explicit stack",
      "No risk in Python",
      "Python optimizes tail calls, so it's fine"
     ],
     "a": 0,
     "why": "Python has a recursion limit and no tail-call optimization. A list used as a stack has no such limit."
    },
    {
     "t": "mcq",
     "id": "l0f-problems-7",
     "q": "What prints?",
     "code": "c = LRUCache(2)\nc.put(1, \"a\")\nc.put(2, \"b\")\nc.get(1)\nc.put(3, \"c\")\nprint(c.get(2))",
     "o": [
      "b",
      "None",
      "KeyError"
     ],
     "a": 1,
     "why": "Reading 1 made it most recent, so 2 was least recent when 3 arrived and got evicted."
    }
   ]
  },
  {
   "id": "l0-problems-run",
   "title": "Run it, then go deeper",
   "blocks": [
    {
     "t": "p",
     "text": "A blank page for one timed run. Save as `practice.py`, set a 40-minute timer, and fill it in out loud."
    },
    {
     "t": "code",
     "title": "practice.py",
     "code": "# practice.py   a blank page for one timed 40-minute run\n# Set a timer. Talk out loud. Don't look at the solution until the timer ends.\n\n# PROBLEM: (paste one: Parking Lot / Amazon Locker / Unix find / LRU cache)\n\n# 0-5 min  REQUIREMENTS, said back to the interviewer\n# -\n# -\n# - out of scope:\n\n# 5-10 min  CLASSES: name + one-line job\n# class ...:      #\n# class ...:      #\n\n\n# 10-30 min  CORE FLOW: write working code here\n\n\n# 30-35 min  WALKTHROUGH: one example, traced through the code\nif __name__ == \"__main__\":\n    pass\n\n# 35-40 min  FOLLOW-UPS: for each, which class changes?\n# 1.\n# 2.\n# 3."
    },
    {
     "t": "p",
     "text": "**Routine for your two weeks:** one problem every other day from a blank file, timed. Then watch one mock interview of the same problem and note what the interviewer pushed on."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "video",
       "req": true,
       "label": "Mock LLD interview: design Amazon Locker",
       "url": "https://www.youtube.com/watch?v=s6nGkoGJhXk",
       "yt": {
        "id": "s6nGkoGJhXk",
        "ch": "Hello Interview"
       },
       "m": 51,
       "why": "An Amazon favourite, from requirements to code and extensions."
      },
      {
       "kind": "read",
       "req": true,
       "label": "Hello Interview: LLD interviews in a hurry",
       "url": "https://www.hellointerview.com/learn/low-level-design/in-a-hurry/introduction",
       "m": 20,
       "why": "The delivery framework the 40-minute plan follows."
      },
      {
       "kind": "video",
       "req": false,
       "label": "LRU Cache, LeetCode 146",
       "url": "https://www.youtube.com/watch?v=7ABFKPK2hD4",
       "yt": {
        "id": "7ABFKPK2hD4",
        "ch": "NeetCode"
       },
       "m": 18,
       "why": "The dict plus doubly linked list, drawn and coded."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Hello Interview: Amazon Locker breakdown",
       "url": "https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/amazon-locker",
       "m": 25,
       "why": "The full write-up of the Locker problem, with expectations by level."
      },
      {
       "kind": "read",
       "req": false,
       "label": "GitHub: awesome-low-level-design",
       "url": "https://github.com/ashishps1/awesome-low-level-design",
       "m": 15,
       "why": "More problems with solutions, once these four feel easy."
      }
     ]
    }
   ]
  }
 ]
});
