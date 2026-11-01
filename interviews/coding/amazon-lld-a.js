/* Amazon loop, LLD kit, part 1: how the round runs. Every code sample was run with Python 3.12. Parts 2 to 7 are built by interviews/coding/lld/build.py into amazon-lld-drills.js. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-round",
 "n": 1,
 "title": "How the LLD round runs",
 "minutes": 30,
 "lead": "After this part you can run the 45 minutes of a design round in order, turn a vague prompt into a scope by asking, write clean Python classes in a shared editor, and say which pattern you used and what you left out.",
 "sections": [
  {
   "id": "lld-round-shape",
   "title": "The 45-minute shape",
   "blocks": [
    {
     "t": "fig",
     "key": "lldRound"
    },
    {
     "t": "p",
     "text": "The object-oriented design round gives you one short prompt, such as 'design a parking lot', and about 45 minutes of the hour. Nobody expects a perfect design. They watch whether you ask before you build, keep the design small, write code that runs in your head, and stay calm when they change the problem."
    },
    {
     "t": "p",
     "text": "Use the same seven steps every time. The order matters more than the speed: each step gives the next one something to stand on."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "The seven steps",
       "flow": [
        "1 clarify",
        "2 use cases",
        "3 entities",
        "4 relations",
        "5 sketch",
        "6 core code",
        "7 extend"
       ],
       "note": "Say the step you are on out loud. The interviewer sees the plan and can steer you early."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Step",
      "Minutes",
      "What you produce"
     ],
     "rows": [
      [
       "1 Clarify and elicit requirements",
       "5 to 8",
       "Six to eight questions asked, then an agreed scope: in and out"
      ],
      [
       "2 Use cases",
       "3",
       "Three to five verbs the system must do, as short sentences (park a car, pay and leave)"
      ],
      [
       "3 Entities",
       "3",
       "The nouns that own data or rules; each one is a class candidate"
      ],
      [
       "4 Relationships",
       "3",
       "Who owns whom: has-a and uses, almost never is-a"
      ],
      [
       "5 Class sketch",
       "5",
       "Class names, fields and method signatures, no bodies"
      ],
      [
       "6 Core code",
       "15",
       "The main flow in running Python, then a dry run on one example"
      ],
      [
       "7 Extensions",
       "5 to 8",
       "The follow-up they add; show which class changes and which do not"
      ]
     ]
    },
    {
     "t": "p",
     "text": "The minutes add up to 39 at the short end and 45 at the long end. Any slack goes to dry-running your code, not to adding features."
    },
    {
     "t": "mcq",
     "id": "lld-round-shape-mcq",
     "q": "You are 20 minutes in. You have a long class diagram and no code. What is the best move?",
     "o": [
      "Pick the one main flow, write it as running code, and say what you will leave out",
      "Ask the interviewer to skip the code and review the diagram instead",
      "Add more classes until the design is complete, then write code with whatever time is left",
      "Start again with a simpler diagram so the next 20 minutes go into a cleaner version"
     ],
     "a": 0,
     "why": "They grade code that runs in your head. A thin working flow beats a complete diagram, and naming the parts you leave out turns the gap into a decision instead of a miss."
    }
   ]
  },
  {
   "id": "lld-round-elicit",
   "title": "Eliciting requirements when none are given",
   "blocks": [
    {
     "t": "p",
     "text": "Sometimes the prompt is one line and nothing else. A 2026 candidate report of the file system round says exactly that: no requirements were given, and asking for them was the test. If you start drawing classes at once, you skip the part they are marking."
    },
    {
     "t": "p",
     "text": "You do not need a clever list. Use the same seven areas every time and fit them to the problem."
    },
    {
     "t": "list",
     "items": [
      "Actors: who uses it? A customer, an admin, another service? Does each one see something different?",
      "Core use cases: what are the three or four things it must do? Which one is the main flow?",
      "Scale: how many items, users or requests? Is one machine enough? This decides whether a plain dict will do.",
      "Concurrency: can two people act on the same thing at once? What must never happen twice?",
      "Persistence: does it survive a restart? In memory is fine unless they say otherwise.",
      "Money: is a price or a charge involved? If so, ask the currency and the rounding, then hold it as integer cents.",
      "Failure: when a request is invalid or a resource is gone, do you raise, return None, or retry?"
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "rule": "If they answer 'up to you', pick one option, say it out loud, and move on. A stated assumption counts as a requirement."
      }
     ]
    },
    {
     "t": "p",
     "text": "Then say the scope back in two lists: in scope and out of scope. Write it at the top of the editor. It is your contract for the next 40 minutes, and it is what you point at when an extension arrives."
    },
    {
     "t": "write",
     "id": "lld-round-elicit-w",
     "q": "Write six questions you would ask for 'design a vending machine'. One per line, each about a different area from the list above.",
     "starter": "1. \n2. \n3. \n4. \n5. \n6. ",
     "solution": "1. Who uses it: only buyers, or also someone who restocks it? (actors)\n2. What must it do: show products, take money, give the product and change? (core use cases)\n3. How many slots, and does each slot hold one product with a count? (scale)\n4. Coins only, or notes and cards too? Do we give change? (money)\n5. If the product is sold out, or we cannot make change, do we refund or ask for another coin? (failure)\n6. Is this one machine, or many that report stock to a server? Must state survive a power cut? (concurrency, persistence)",
     "hint": "One question per area: actors, use cases, scale, money, failure, and one of persistence or concurrency.",
     "why": "A good question changes the design. Money gives you the change-making rule, failure gives you the sold-out path, and 'who restocks' adds an actor with a second set of methods. If an answer would not change anything you draw, skip the question."
    },
    {
     "t": "mcq",
     "id": "lld-round-elicit-mcq",
     "q": "You ask which payment methods the system supports. The interviewer says 'whatever you like'. What do you do?",
     "o": [
      "Skip payment and say nothing about it, since they did not seem to care",
      "Say you will return the amount owed in cents and leave taking the money out of scope, then continue",
      "Ask three more questions about payment providers until they name one",
      "Build a Payment class with card and cash subclasses so every case is covered"
     ],
     "a": 1,
     "why": "A stated assumption is a requirement. Here the system's job ends at the amount owed. A Payment hierarchy builds code nobody asked for, and silence makes the gap look like a miss."
    }
   ]
  },
  {
   "id": "lld-round-python",
   "title": "Python OOP you need on the board",
   "blocks": [
    {
     "t": "p",
     "text": "You will write in a shared editor with no autocomplete and often no run button. Five Python tools cover almost every design. Know them well enough to write each one from memory."
    },
    {
     "t": "list",
     "items": [
      "`abc.ABC` and `@abstractmethod`: a base class that cannot be built, only subclassed. A subclass that forgets an abstract method cannot be built either, which is how you say 'every pricing rule must have price()'.",
      "Enum: a fixed set of named values, such as a vehicle size. Use it instead of the strings 'small' and 'large', which hide typos.",
      "`@dataclass`: writes `__init__`, `repr` and `==` for a class that mostly holds data. Add `frozen=True` for a value that must not change; it also becomes hashable.",
      "Composition over inheritance: give a class the thing it needs as a field (a lot has levels, a cart has lines) instead of making it a subclass. Inherit only for a real 'is a', where every parent method still makes sense.",
      "`typing.Protocol`: describes the methods a thing needs, without a base class. Any class with a matching method fits. Good for a small dependency such as a clock."
     ]
    },
    {
     "t": "code",
     "id": "lld-round-python-code",
     "title": "All five in one small file",
     "code": "from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\nfrom enum import Enum\nfrom typing import Protocol\n\nclass Urgency(Enum):\n    ROUTINE = 1\n    URGENT = 2\n\n@dataclass(frozen=True)\nclass Message:\n    text: str\n    urgency: Urgency = Urgency.ROUTINE\n\nclass Channel(ABC):\n    @abstractmethod\n    def send(self, msg: Message) -> str: ...\n\nclass Email(Channel):\n    def send(self, msg: Message) -> str:\n        return \"email: \" + msg.text\n\nclass Sms(Channel):\n    def send(self, msg: Message) -> str:\n        return \"sms \" + msg.urgency.name.lower() + \": \" + msg.text\n\nclass Clock(Protocol):\n    def now(self) -> int: ...\n\nclass FixedClock:\n    def now(self) -> int:\n        return 100\n\nclass Notifier:\n    def __init__(self, channel: Channel, clock: Clock):\n        self.channel = channel\n        self.clock = clock\n\n    def notify(self, text: str, urgency: Urgency = Urgency.ROUTINE) -> str:\n        stamp = \"[\" + str(self.clock.now()) + \"] \"\n        return stamp + self.channel.send(Message(text, urgency))\n\ntry:\n    Channel()\nexcept TypeError as e:\n    print(\"cannot build Channel:\", \"send\" in str(e))\nprint(Notifier(Sms(), FixedClock()).notify(\"door open\", Urgency.URGENT))",
     "notes": {
      "6": "Enum: a fixed set of named values. No typo like 'urgnt'.",
      "10": "Dataclass: init, repr and == written for you. frozen=True makes it unchangeable and hashable.",
      "16": "Abstract: every Channel subclass must supply send().",
      "23": "A subclass fills in the contract.",
      "27": "Protocol: any object with now() fits. No base class needed.",
      "35": "Composition: a Notifier has a channel and a clock. It is not one.",
      "44": "An abstract class cannot be built: TypeError."
     },
     "ask": {
      "q": "Click the line that gives Notifier the channel and the clock it uses, instead of making it a kind of channel.",
      "lines": [
       35
      ],
      "why": "Composition over inheritance: the dependencies arrive as fields, so the same Notifier works with Email, Sms or a test double. Inheriting from Channel would say a notifier is a channel, which it is not."
     }
    },
    {
     "t": "predict",
     "id": "lld-round-python-p1",
     "code": "try:\n    Channel()\nexcept TypeError as e:\n    print(\"cannot build Channel:\", \"send\" in str(e))\nprint(Notifier(Sms(), FixedClock()).notify(\"door open\", Urgency.URGENT))",
     "q": "Using the classes above, what prints?",
     "answer": "cannot build Channel: True\n[100] sms urgent: door open",
     "why": "The base class cannot be built because send() is abstract, so `Channel()` raises TypeError and the message names send. Then the Notifier asks the clock for 100 and the channel for its text, and an SMS adds the urgency in lower case."
    },
    {
     "t": "predict",
     "id": "lld-round-python-p2",
     "code": "from dataclasses import dataclass\n\n@dataclass\nclass Spot:\n    level: int\n    number: int\n\na = Spot(1, 7)\nb = Spot(1, 7)\nprint(a == b, a is b)\nprint(a)",
     "q": "What prints?",
     "answer": "True False\nSpot(level=1, number=7)",
     "why": "A dataclass writes `==` to compare field by field, so the two spots are equal. They are still two objects, so `is` is False. It also writes a readable repr."
    },
    {
     "t": "predict",
     "id": "lld-round-python-p3",
     "code": "from dataclasses import dataclass\n\n@dataclass\nclass Spot:\n    level: int\n    number: int\n\ntaken = set()\ntry:\n    taken.add(Spot(1, 7))\nexcept TypeError as e:\n    print(e)",
     "q": "What prints?",
     "answer": "unhashable type: 'Spot'",
     "why": "A dataclass that defines `==` and is not frozen sets its hash to None, because a changeable object cannot safely be a set member or a dict key. Use frozen=True for values you put in sets (a Vehicle), or key by a field such as the spot number."
    },
    {
     "t": "mcq",
     "id": "lld-round-python-mcq",
     "q": "You need a Clock so tests can fix the time. Which is the lighter way to describe it in Python?",
     "o": [
      "A typing.Protocol with now(), so any object that has now() fits",
      "A global variable that holds the current time, which tests overwrite",
      "An ABC with an abstract now(), and every clock must inherit from it",
      "A Singleton Clock class that every module imports"
     ],
     "a": 0,
     "why": "Both ABC and Protocol work. Protocol is lighter because a fake clock needs no inheritance. Use ABC when you want subclasses declared and a hard error if one forgets a method (a pricing rule, a filter). A global or a Singleton makes every test share state."
    }
   ]
  },
  {
   "id": "lld-round-solid",
   "title": "SOLID, one line each",
   "blocks": [
    {
     "t": "p",
     "text": "Name a principle only where it applies. Reciting all five letters over a three-class design sounds rehearsed. One correct sentence about the one that matters sounds like you built it."
    },
    {
     "t": "table",
     "head": [
      "Principle",
      "One line",
      "Where it shows up"
     ],
     "rows": [
      [
       "Single responsibility",
       "A class has one reason to change.",
       "Order holds the data; a receipt function formats it. A new receipt layout does not touch Order."
      ],
      [
       "Open-closed",
       "Add behaviour by adding a class, not by editing a working one.",
       "A new shipping type is a new Shipping subclass. Order has no if-chain to edit. Strategy is how you get here."
      ],
      [
       "Liskov substitution",
       "A subclass works anywhere its parent does.",
       "If Square extends Rectangle and breaks set_width, the hierarchy is wrong. Prefer composition."
      ],
      [
       "Interface segregation",
       "Small interfaces; no class is forced to fake a method.",
       "A Printer base class with fax() makes a basic printer raise NotImplementedError. Split it."
      ],
      [
       "Dependency inversion",
       "Depend on an abstraction and pass it in.",
       "Order takes a Shipping in its constructor and never builds a Standard itself."
      ]
     ]
    },
    {
     "t": "code",
     "id": "lld-round-solid-code",
     "title": "Three of the five in one small example",
     "code": "from abc import ABC, abstractmethod\n\nclass Shipping(ABC):\n    @abstractmethod\n    def cost(self, grams: int) -> int: ...\n\nclass Standard(Shipping):\n    def cost(self, grams):\n        return 400 + grams // 100\n\nclass Express(Shipping):\n    def cost(self, grams):\n        return 900 + grams // 50\n\nclass Order:\n    def __init__(self, grams, shipping: Shipping):\n        self.grams = grams\n        self.shipping = shipping\n\n    def shipping_cost(self):\n        return self.shipping.cost(self.grams)\n\ndef receipt(order):\n    return \"shipping: \" + str(order.shipping_cost()) + \" cents\"\n\nclass Drone(Shipping):\n    def cost(self, grams):\n        return 1500\n\nprint(receipt(Order(2000, Standard())))\nprint(receipt(Order(2000, Express())))\nprint(receipt(Order(2000, Drone())))",
     "notes": {
      "3": "The abstraction. Order depends on this, not on a concrete rate.",
      "16": "Dependency inversion: the rule is passed in.",
      "21": "Open-closed: no if on the type, so a new type needs no edit here.",
      "23": "Single responsibility: formatting lives outside Order.",
      "26": "Added later. Nothing above this line was edited."
     },
     "ask": {
      "q": "Click the line where Order gets its shipping rule instead of building one.",
      "lines": [
       16
      ],
      "why": "The constructor receives the rule. Order never says Standard or Express, so any Shipping, including a test fake, works."
     }
    },
    {
     "t": "write",
     "id": "lld-round-solid-w",
     "q": "This Order chooses its shipping rate with an if-chain on a string. Rewrite it so adding 'drone' touches no existing class.",
     "starter": "class Order:\n    def __init__(self, grams, kind):\n        self.grams = grams\n        self.kind = kind\n\n    def shipping_cost(self):\n        if self.kind == \"standard\":\n            return 400 + self.grams // 100\n        if self.kind == \"express\":\n            return 900 + self.grams // 50\n        raise ValueError(self.kind)",
     "solution": "from abc import ABC, abstractmethod\n\nclass Shipping(ABC):\n    @abstractmethod\n    def cost(self, grams: int) -> int: ...\n\nclass Standard(Shipping):\n    def cost(self, grams):\n        return 400 + grams // 100\n\nclass Express(Shipping):\n    def cost(self, grams):\n        return 900 + grams // 50\n\nclass Order:\n    def __init__(self, grams, shipping: Shipping):\n        self.grams = grams\n        self.shipping = shipping\n\n    def shipping_cost(self):\n        return self.shipping.cost(self.grams)\n\n\nclass Drone(Shipping):\n    def cost(self, grams):\n        return 1500\n\nprint(Order(2000, Standard()).shipping_cost())\nprint(Order(2000, Express()).shipping_cost())\nprint(Order(2000, Drone()).shipping_cost())",
     "hint": "Make the rate an object that Order receives, with one method, cost(grams).",
     "why": "The if-chain breaks open-closed: every new type edits Order. With a Shipping object passed in, Drone is one new class and Order knows only the abstraction. Say what you left out: no factory that maps the string 'drone' to a class, because the caller already knows which one it wants."
    },
    {
     "t": "mcq",
     "id": "lld-round-solid-mcq",
     "q": "A Bird base class has fly(). Penguin extends Bird and raises an error in fly(). Which principle is broken?",
     "o": [
      "Single responsibility",
      "Open-closed",
      "Liskov substitution",
      "Interface segregation",
      "Dependency inversion"
     ],
     "a": 2,
     "why": "Code that works with any Bird now fails for a Penguin, so the subclass cannot stand in for its parent. The fix is a different split, for example Bird without fly() and a FlyingBird that adds it, or composition."
    }
   ]
  },
  {
   "id": "lld-round-patterns",
   "title": "The patterns that actually come up",
   "blocks": [
    {
     "t": "p",
     "text": "Five patterns cover nearly every design round. For each one, know the one-sentence reason to use it and the case where it would be too much."
    },
    {
     "t": "table",
     "head": [
      "Pattern",
      "In one sentence",
      "Use it when",
      "Do not use it when"
     ],
     "rows": [
      [
       "Strategy",
       "Put each way of doing one job in its own class behind one interface, and pass in the one you want.",
       "A rule has several versions that change on their own: pricing, discounts, which spot to pick.",
       "There is one rule and no sign of a second. A plain function does the job."
      ],
      [
       "Factory",
       "One function decides which class to build and returns it.",
       "The caller knows a name or a type, not the class: a Vehicle from 'car', a parser from a file extension.",
       "The caller already knows the class. Calling the constructor is clearer."
      ],
      [
       "Observer",
       "An object keeps a list of listeners and calls each one when something happens.",
       "Several parts react to one event: stock low, order placed, file changed.",
       "Only one thing ever reacts. Call it directly."
      ],
      [
       "State",
       "The current state is an object, and each state decides what the next action does.",
       "Behaviour depends on a mode with clear transitions: vending machine, order status, elevator.",
       "Two states and a flag. An enum and an if read better."
      ],
      [
       "Singleton",
       "Exactly one shared instance, reachable from anywhere.",
       "Almost never in a design round. Mention it only to say why you avoided it.",
       "Nearly always: it is a hidden global, tests share its state, and it blocks 'a second garage'. Pass the one instance in."
      ]
     ]
    },
    {
     "t": "p",
     "text": "State and Strategy look alike: both put behaviour in an object. The difference is who changes it. With Strategy the caller picks the object and it stays. With State the object swaps itself for the next state as events arrive."
    },
    {
     "t": "code",
     "id": "lld-round-patterns-state",
     "title": "State: a vending machine that changes its own behaviour",
     "code": "from abc import ABC, abstractmethod\n\nclass State(ABC):\n    @abstractmethod\n    def insert(self, m, cents): ...\n\n    @abstractmethod\n    def select(self, m): ...\n\nclass Idle(State):\n    def insert(self, m, cents):\n        m.credit += cents\n        m.state = HasMoney()\n        return \"credit \" + str(m.credit)\n\n    def select(self, m):\n        return \"insert money first\"\n\nclass HasMoney(State):\n    def insert(self, m, cents):\n        m.credit += cents\n        return \"credit \" + str(m.credit)\n\n    def select(self, m):\n        change = m.credit - m.price\n        if change < 0:\n            return \"need \" + str(-change) + \" more\"\n        m.credit = 0\n        m.state = Idle()\n        return \"dispensed, change \" + str(change)\n\nclass Machine:\n    def __init__(self, price):\n        self.price = price\n        self.credit = 0\n        self.state = Idle()\n\n    def insert(self, cents):\n        return self.state.insert(self, cents)\n\n    def select(self):\n        return self.state.select(self)\n\nm = Machine(150)\nfor step in (m.select, lambda: m.insert(100), m.select, lambda: m.insert(100), m.select, m.select):\n    print(step())",
     "notes": {
      "10": "No money yet. select() refuses.",
      "13": "The state swaps itself. The machine never has an if on the mode.",
      "19": "Money is in. select() can sell.",
      "29": "After a sale the machine goes back to Idle.",
      "39": "The machine hands every action to its current state."
     },
     "ask": {
      "q": "Click the line where the machine changes its own state after a sale.",
      "lines": [
       29
      ],
      "why": "The sale code in HasMoney sets the machine's state back to Idle. The Machine class itself holds no if on the mode; the state objects carry that logic."
     }
    },
    {
     "t": "predict",
     "id": "lld-round-patterns-p",
     "code": "class Stock:\n    def __init__(self):\n        self.listeners = []\n        self.qty = 5\n\n    def subscribe(self, fn):\n        self.listeners.append(fn)\n\n    def take(self, n):\n        self.qty -= n\n        for fn in self.listeners:\n            fn(self.qty)\n\ns = Stock()\ns.subscribe(lambda q: print(\"low\" if q < 3 else \"ok\", q))\ns.subscribe(lambda q: print(\"logged\", q))\ns.take(1)\ns.take(3)",
     "q": "What prints?",
     "answer": "ok 4\nlogged 4\nlow 1\nlogged 1",
     "why": "take() lowers the quantity, then calls every listener in the order they subscribed. 5 minus 1 is 4, so the first listener says ok and the second logs. 4 minus 3 is 1, below 3, so the first says low. The stock never knows what its listeners do."
    },
    {
     "t": "mcq",
     "id": "lld-round-patterns-mcq1",
     "q": "A discount can be a percentage, a flat amount or buy-one-get-one, and more will come. Which pattern fits?",
     "o": [
      "Strategy",
      "Factory",
      "Observer",
      "State",
      "Singleton"
     ],
     "a": 0,
     "why": "Each discount is one way of doing the same job, so each is a class behind one method and the caller passes in the one it wants. Factory only helps if something must pick the class from a name."
    },
    {
     "t": "mcq",
     "id": "lld-round-patterns-mcq2",
     "q": "A support ticket goes New, Assigned, Resolved, Closed, and 'close' does something different in each one. Which pattern fits?",
     "o": [
      "Strategy",
      "Factory",
      "Observer",
      "State",
      "Singleton"
     ],
     "a": 3,
     "why": "The behaviour depends on a mode, and the ticket moves itself from one mode to the next. With only two modes and no side logic, an enum and an if would do."
    }
   ]
  },
  {
   "id": "lld-round-talk",
   "title": "How to talk",
   "blocks": [
    {
     "t": "p",
     "text": "Silence is the most common way to lose points in this round. Narrate the whole time."
    },
    {
     "t": "list",
     "items": [
      "Say the choice, the reason and the cost: 'I will use a Strategy for pricing because the rate rules will change. The cost is one more class and one more argument.'",
      "Name what you leave out: 'I am not modelling payment, only the amount owed.' A named gap is a decision. An unnamed gap looks like a miss.",
      "Check in at the end of steps 1, 4 and 5: 'Does this scope match what you had in mind?' It costs ten seconds and saves a wrong turn.",
      "Keep the design on screen: the class list at the top, code below. Point at the line when you explain it.",
      "Dry-run out loud: with no run button, walk one example through the code and say each value.",
      "When an extension lands, say which class changes and which stay the same, then edit. That sentence is the real answer.",
      "If you forget a name, say 'I do not remember the name, but the idea is...'. They grade the idea, not the label."
     ]
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "What if I run out of time before the code?",
       "a": "Write the main flow in the time you have, even rough, and name the gaps. A thin core that runs beats a full diagram with no code."
      },
      {
       "q": "What if the interviewer disagrees with a choice?",
       "a": "Ask what worries them. If their way is reasonable, switch and say what it costs. Defend a choice when you have a reason, and drop it when you only have a preference."
      },
      {
       "q": "Do I need to write tests?",
       "a": "Not unless asked. Write one or two example calls under the class and walk them through. That is your test."
      },
      {
       "q": "Do I need thread safety?",
       "a": "Only if they ask or the problem has shared state under load. Name the risk, put one lock around the check and the change together, and say what a finer lock would do."
      }
     ]
    },
    {
     "t": "write",
     "id": "lld-round-talk-w",
     "q": "You used a Strategy for pricing in a parking lot. Say, in three sentences, what you chose, the cost, and what you left out.",
     "starter": "",
     "solution": "I will make pricing a Strategy: the lot asks a Pricing object for the amount, so hourly and flat rates are separate classes. The cost is one extra class and one constructor argument, which is more than a single if for one rule. I am leaving out payment, discounts and taxes, so the lot only returns the amount owed in cents.",
     "hint": "One sentence each: the choice and why, the cost, the gap.",
     "why": "The shape is choice, cost, gap. It shows you weighed it and that you stopped on purpose. Practise saying it aloud; written down it looks easy and out loud it is not."
    }
   ]
  }
 ]
});
