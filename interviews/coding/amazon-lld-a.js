/* Amazon loop, LLD kit, parts 1 to 4. Every code sample and solution was run with Python 3.12. */
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
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-parking",
 "n": 2,
 "title": "Parking lot",
 "minutes": 40,
 "lead": "After this part you can take 'design a parking lot' from questions to running code in about 40 minutes, add a second pricing rule and a second garage without touching the lot, and make the last spot safe when two cars arrive together.",
 "sections": [
  {
   "id": "lld-parking-reqs",
   "title": "The prompt and the requirements you elicit",
   "blocks": [
    {
     "t": "p",
     "text": "The interviewer says: 'Design a parking lot.' That is all you get. Ask before you draw. These are the questions to ask and the answers an interviewer tends to give."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "Which vehicles park here, and does size matter?",
       "a": "Motorcycles, cars and trucks. A motorcycle fits any spot, a car needs a medium or large spot, and a truck needs a large spot."
      },
      {
       "q": "How is the lot laid out?",
       "a": "Several levels, each with numbered spots of three sizes: small, medium and large. The layout is fixed when the lot is built."
      },
      {
       "q": "Does the driver choose a spot, or does the system?",
       "a": "The system assigns the smallest free spot the vehicle fits, scanning from the lowest level."
      },
      {
       "q": "What does the driver get on entry, and what happens on exit?",
       "a": "A ticket with an id, the spot and the entry time. On exit they hand the ticket back and are told the amount owed. Taking the money is out of scope."
      },
      {
       "q": "How is the price decided?",
       "a": "By the time parked, at a rate per hour for now. Expect another rule to come later."
      },
      {
       "q": "What if the lot is full for that vehicle?",
       "a": "Refuse entry and tell the driver. No waiting list."
      },
      {
       "q": "Is it one garage? Can two cars arrive at the same moment?",
       "a": "One garage to start. Expect me to ask about more garages, and about two cars arriving together, later."
      },
      {
       "q": "Does it need to survive a restart?",
       "a": "No, in memory is fine."
      }
     ]
    },
    {
     "t": "list",
     "items": [
      "In scope: vehicle sizes, levels and spots, entering and getting a ticket, exiting and getting the amount owed, a pricing rule that can change.",
      "Out of scope: taking payment, reservations, plate recognition, a UI or API layer, saving to a database.",
      "Later (they will ask): hourly versus flat pricing, several garages, two cars racing for the last spot."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-parking-reqs-mcq",
     "q": "The interviewer says 'assume whatever you like' about how drivers pay. What is the best response?",
     "o": [
      "Skip payment and say nothing about it, since they did not seem to care",
      "Say you will return the amount owed in cents and leave taking the money out of scope",
      "Build a Payment class with card and cash subclasses so every case is covered",
      "Ask three more questions about payment providers until they name one"
     ],
     "a": 1,
     "why": "A stated assumption is a requirement. The lot's job ends at the amount owed. A Payment hierarchy builds code nobody asked for, and silence makes the gap look like a miss."
    }
   ]
  },
  {
   "id": "lld-parking-model",
   "title": "Entities and relationships",
   "blocks": [
    {
     "t": "p",
     "text": "Read your requirements and underline the nouns. Each noun that owns data or a rule is a class candidate. Then ask who owns whom."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Who owns whom",
       "parts": [
        [
         "ParkingLot",
         "levels, tickets, a pricing rule",
         true
        ],
        [
         "Level",
         "numbered spots"
        ],
        [
         "Spot",
         "size, and the vehicle in it"
        ],
        [
         "Vehicle",
         "plate and size"
        ],
        [
         "Ticket",
         "id, vehicle, spot, entry time"
        ],
        [
         "Pricing",
         "price(minutes, size)"
        ]
       ],
       "note": "A lot has levels, a level has spots, a ticket points at a vehicle and a spot. Pricing is passed to the lot; the lot never builds it."
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
       "ParkingLot",
       "Levels, the open tickets, a Pricing",
       "enter(vehicle, now) returns a Ticket or None; exit(ticket id, now) returns the amount owed"
      ],
      [
       "Level",
       "Its Spots",
       "find(vehicle) returns the smallest free Spot that fits"
      ],
      [
       "Spot",
       "Level number, number, size, current vehicle",
       "fits(vehicle): free, and the vehicle is not bigger than the spot"
      ],
      [
       "Vehicle",
       "Plate and a Size",
       "Nothing. It is a value."
      ],
      [
       "Ticket",
       "Id, vehicle, spot, entry time",
       "Nothing. It is a record."
      ],
      [
       "Pricing",
       "A rate",
       "price(minutes, size) returns cents"
      ]
     ]
    },
    {
     "t": "mcq",
     "id": "lld-parking-model-mcq1",
     "q": "Should Car, Motorcycle and Truck be three subclasses of Vehicle?",
     "o": [
      "No, a Size enum on one Vehicle class is enough, because nothing else about them differs",
      "No, a vehicle should be a plain string such as 'car', and the lot should check the string",
      "Yes, one subclass per type, so each can have its own parking rules",
      "Yes, because Python can only compare two vehicles that share a parent class"
     ],
     "a": 0,
     "why": "Make a subclass when behaviour differs. Here only the size differs, and the spot check uses the size. Three empty subclasses add files and no ideas. If trucks later need their own rule, split them then."
    },
    {
     "t": "mcq",
     "id": "lld-parking-model-mcq2",
     "q": "Which class should hold the loop that finds a free spot on one floor?",
     "o": [
      "Vehicle",
      "Ticket",
      "Level",
      "Pricing"
     ],
     "a": 2,
     "why": "The Level owns its spots, so it is the one that knows how to search them. The lot only decides which level to ask. This keeps each class's job to one sentence."
    }
   ]
  },
  {
   "id": "lld-parking-code",
   "title": "The core code",
   "blocks": [
    {
     "t": "p",
     "text": "Read it once through, then answer the questions under Practise. It runs as written. Money is integer cents. Time is minutes since opening, passed in, so there is no clock to fake."
    },
    {
     "t": "code",
     "id": "lld-parking-code-core",
     "title": "Parking lot: enter, exit, pricing as a strategy",
     "code": "from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\nfrom enum import IntEnum\nimport itertools\n\nclass Size(IntEnum):\n    SMALL = 1\n    MEDIUM = 2\n    LARGE = 3\n\n@dataclass(frozen=True)\nclass Vehicle:\n    plate: str\n    size: Size\n\nclass Spot:\n    def __init__(self, level, number, size):\n        self.level, self.number, self.size = level, number, size\n        self.vehicle = None\n\n    def fits(self, v):\n        return self.vehicle is None and v.size <= self.size\n\nclass Level:\n    def __init__(self, number, spots):\n        self.number, self.spots = number, spots\n\n    def find(self, v):\n        fits = [s for s in self.spots if s.fits(v)]\n        return min(fits, key=lambda s: s.size, default=None)\n\n@dataclass\nclass Ticket:\n    id: int\n    vehicle: Vehicle\n    spot: Spot\n    entered: int\n\nclass Pricing(ABC):\n    @abstractmethod\n    def price(self, minutes: int, size: Size) -> int: ...\n\nclass Hourly(Pricing):\n    def __init__(self, cents_per_hour):\n        self.rate = cents_per_hour\n\n    def price(self, minutes, size):\n        hours = -(-minutes // 60)\n        return hours * self.rate\n\nclass ParkingLot:\n    def __init__(self, levels, pricing: Pricing):\n        self.levels = levels\n        self.pricing = pricing\n        self.tickets = {}\n        self._ids = itertools.count(1)\n\n    def enter(self, v, now):\n        for level in self.levels:\n            spot = level.find(v)\n            if spot:\n                spot.vehicle = v\n                t = Ticket(next(self._ids), v, spot, now)\n                self.tickets[t.id] = t\n                return t\n        return None\n\n    def exit(self, ticket_id, now):\n        t = self.tickets.pop(ticket_id)\n        t.spot.vehicle = None\n        return self.pricing.price(now - t.entered, t.vehicle.size)\n\nif __name__ == \"__main__\":\n    lot = ParkingLot([Level(1, [Spot(1, 1, Size.SMALL), Spot(1, 2, Size.LARGE)])], Hourly(300))\n    t1 = lot.enter(Vehicle(\"B-1\", Size.SMALL), now=0)\n    t2 = lot.enter(Vehicle(\"T-9\", Size.LARGE), now=10)\n    print(t1.spot.number, t2.spot.number)\n    print(lot.enter(Vehicle(\"B-2\", Size.SMALL), now=20))\n    print(lot.exit(t1.id, now=130))",
     "notes": {
      "22": "A vehicle fits a spot its own size or larger.",
      "30": "The smallest spot that fits, so a motorcycle does not take a large spot.",
      "39": "The strategy interface: one method.",
      "48": "Round up to whole hours with negative floor division.",
      "52": "The pricing rule is passed in. The lot never says Hourly.",
      "66": "Full for this vehicle: refuse.",
      "71": "The only place the lot uses the rule. It does not know which rule it is."
     },
     "ask": {
      "q": "Click the line where the lot receives its pricing rule.",
      "lines": [
       52
      ],
      "why": "The constructor takes any Pricing. Hourly is chosen by whoever builds the lot, which is why a flat rate or a second garage later needs no edit here."
     }
    },
    {
     "t": "predict",
     "id": "lld-parking-code-p",
     "code": "if __name__ == \"__main__\":\n    lot = ParkingLot([Level(1, [Spot(1, 1, Size.SMALL), Spot(1, 2, Size.LARGE)])], Hourly(300))\n    t1 = lot.enter(Vehicle(\"B-1\", Size.SMALL), now=0)\n    t2 = lot.enter(Vehicle(\"T-9\", Size.LARGE), now=10)\n    print(t1.spot.number, t2.spot.number)\n    print(lot.enter(Vehicle(\"B-2\", Size.SMALL), now=20))\n    print(lot.exit(t1.id, now=130))",
     "q": "Run the file. What prints?",
     "answer": "1 2\nNone\n900",
     "why": "The bike (small) takes the small spot 1 and the truck (large) takes spot 2. A second small vehicle finds no free small-or-larger spot, so enter returns None. The bike left after 130 minutes: 130 / 60 rounds up to 3 hours at 300 cents, which is 900."
    }
   ]
  },
  {
   "id": "lld-parking-ext",
   "title": "The extension follow-ups",
   "blocks": [
    {
     "t": "p",
     "text": "Each of these arrives as a spoken follow-up. Before you edit, say which class changes and which stay the same. If your answer is 'the lot stays', the design held."
    },
    {
     "t": "write",
     "id": "lld-parking-ext-flat",
     "q": "Add a flat-rate pricing: one fixed amount per visit, however long. The ParkingLot class must not change.",
     "starter": "class Pricing(ABC):\n    @abstractmethod\n    def price(self, minutes: int, size: Size) -> int: ...\n\nclass Hourly(Pricing):\n    def __init__(self, cents_per_hour):\n        self.rate = cents_per_hour\n\n    def price(self, minutes, size):\n        hours = -(-minutes // 60)\n        return hours * self.rate",
     "solution": "class Pricing(ABC):\n    @abstractmethod\n    def price(self, minutes: int, size: Size) -> int: ...\n\nclass Hourly(Pricing):\n    def __init__(self, cents_per_hour):\n        self.rate = cents_per_hour\n\n    def price(self, minutes, size):\n        hours = -(-minutes // 60)\n        return hours * self.rate\n\nclass Flat(Pricing):\n    def __init__(self, cents):\n        self.cents = cents\n\n    def price(self, minutes, size):\n        return self.cents\n\nlot = ParkingLot([Level(1, [Spot(1, 1, Size.LARGE)])], Flat(500))\nt = lot.enter(Vehicle(\"C-1\", Size.MEDIUM), now=0)\nprint(lot.exit(t.id, now=300))",
     "hint": "A new subclass of Pricing. Nothing else.",
     "why": "ParkingLot is untouched because it depends on Pricing, not on Hourly. That is open-closed and dependency inversion in one move. Name it Strategy and stop: do not add a PricingFactory or a config file unless they ask."
    },
    {
     "t": "write",
     "id": "lld-parking-ext-garages",
     "q": "The owner opens a second garage. Support several garages, each with its own levels and pricing, and let a car enter whichever has room.",
     "starter": "class Campus:\n    ...",
     "solution": "class Campus:\n    def __init__(self, garages):\n        self.garages = garages\n\n    def enter(self, v, now):\n        for name, lot in self.garages.items():\n            t = lot.enter(v, now)\n            if t:\n                return name, t\n        return None\n\n    def exit(self, name, ticket_id, now):\n        return self.garages[name].exit(ticket_id, now)\n\na = ParkingLot([Level(1, [Spot(1, 1, Size.SMALL)])], Hourly(300))\nb = ParkingLot([Level(1, [Spot(1, 1, Size.SMALL)])], Hourly(200))\ncampus = Campus({\"north\": a, \"south\": b})\nprint(campus.enter(Vehicle(\"B-1\", Size.SMALL), 0)[0])\nprint(campus.enter(Vehicle(\"B-2\", Size.SMALL), 0)[0])\nprint(campus.enter(Vehicle(\"B-3\", Size.SMALL), 0))",
     "hint": "A thin class on top. It holds several ParkingLots by name and asks each in turn.",
     "why": "Easy because a ParkingLot keeps all its state in itself: no global, no Singleton. Each lot is one object, so five lots are five objects. Ticket ids restart in every lot, so the campus returns the garage name with the ticket and needs it again on exit. You could add a rule for which garage to try first (nearest, cheapest); that would be a Strategy too, and you say so without building it."
    },
    {
     "t": "write",
     "id": "lld-parking-ext-race",
     "q": "Two cars arrive at the same moment for the last spot. Make sure only one of them gets it.",
     "starter": "class ParkingLot:\n    def __init__(self, levels, pricing: Pricing):\n        self.levels = levels\n        self.pricing = pricing\n        self.tickets = {}\n        self._ids = itertools.count(1)\n\n    def enter(self, v, now):\n        for level in self.levels:\n            spot = level.find(v)\n            if spot:\n                spot.vehicle = v\n                t = Ticket(next(self._ids), v, spot, now)\n                self.tickets[t.id] = t\n                return t\n        return None\n\n    def exit(self, ticket_id, now):\n        t = self.tickets.pop(ticket_id)\n        t.spot.vehicle = None\n        return self.pricing.price(now - t.entered, t.vehicle.size)",
     "solution": "import threading\n\nclass ParkingLot:\n    def __init__(self, levels, pricing: Pricing):\n        self.levels = levels\n        self.pricing = pricing\n        self.tickets = {}\n        self._ids = itertools.count(1)\n        self._lock = threading.Lock()\n\n    def enter(self, v, now):\n        with self._lock:\n            for level in self.levels:\n                spot = level.find(v)\n                if spot:\n                    spot.vehicle = v\n                    t = Ticket(next(self._ids), v, spot, now)\n                    self.tickets[t.id] = t\n                    return t\n        return None\n\n    def exit(self, ticket_id, now):\n        with self._lock:\n            t = self.tickets.pop(ticket_id)\n            t.spot.vehicle = None\n        return self.pricing.price(now - t.entered, t.vehicle.size)\n\nresults = []\n\ndef arrive(i):\n    results.append(lot.enter(Vehicle(\"C-\" + str(i), Size.MEDIUM), now=0))\n\nlot = ParkingLot([Level(1, [Spot(1, 1, Size.LARGE)])], Hourly(300))\nthreads = [threading.Thread(target=arrive, args=(i,)) for i in range(20)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(sum(1 for r in results if r))",
     "hint": "The find and the claim must happen as one step. Wrap both in one lock.",
     "why": "The danger is a check-then-act gap: car A finds spot 1 free, car B finds spot 1 free, both claim it. The lock covers the find and the claim together. A lock only around the claim would still let both find the same spot. exit takes the same lock because it changes the same spot. One lock per lot is the simple answer. A lock per level would let different levels fill in parallel; say that, and do not build it unless asked."
    }
   ]
  },
  {
   "id": "lld-parking-listen",
   "title": "What they listen for",
   "blocks": [
    {
     "t": "list",
     "items": [
      "Strategy for pricing: the rate rule changes more often than the lot, so it sits behind one method. You can say what you did not add: no factory, no config file.",
      "Open-closed: flat pricing and a second garage were new classes. ParkingLot did not change.",
      "Dependency inversion: the lot receives its Pricing. Nothing inside the lot says Hourly.",
      "Single responsibility: Level finds spots, Spot knows if a vehicle fits, Pricing prices. The lot coordinates and holds the tickets.",
      "Not over-built: a Size enum, not three Vehicle subclasses; no Singleton; payment named and left out.",
      "Concurrency: you named the check-then-act gap and put one lock around the find and the claim."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-parking-listen-mcq",
     "q": "Why is a Singleton ParkingLot a poor answer to 'support several garages'?",
     "o": [
      "A singleton is slower than a normal class because every call goes through a lookup",
      "A singleton cannot hold levels, spots or tickets because it has no fields",
      "One shared global instance leaves a second garage nowhere to live without rewriting every call site",
      "Python does not support singletons, so the pattern cannot be written there"
     ],
     "a": 2,
     "why": "A Singleton hard-wires 'there is one'. The follow-up says there are several. A lot that is an ordinary object, passed to whoever needs it, becomes five lots by building four more."
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-files",
 "n": 3,
 "title": "File management system (no requirements given)",
 "minutes": 40,
 "lead": "After this part you can start from a one-line prompt with no requirements, ask until you have a scope, model files and folders as one kind of entry, and add search filters and combinations of filters without changing the file system.",
 "sections": [
  {
   "id": "lld-files-reqs",
   "title": "No requirements given: the prompt and what you elicit",
   "blocks": [
    {
     "t": "p",
     "text": "The prompt is one line: 'Design a file management system.' A 2026 candidate report of this round says nothing else was given, and that asking for the requirements was the test. If you start drawing classes at once, you skip the part they are marking."
    },
    {
     "t": "p",
     "text": "Use the seven areas from Part 1 and fit them to files. The answers below are what an interviewer might give. A real one may differ, so listen and adjust."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "Is this a real disk or a model in memory?",
       "a": "A model in memory. You do not call the operating system."
      },
      {
       "q": "What can a user do?",
       "a": "Create folders, create files, list a folder, and find files by conditions. Delete and move come later if there is time."
      },
      {
       "q": "How are items addressed?",
       "a": "By path from a root, such as /docs/notes/todo.txt. Absolute paths only."
      },
      {
       "q": "What does a file hold?",
       "a": "A name and a size. You do not need the contents. Say if you would add them."
      },
      {
       "q": "What can a search match on?",
       "a": "Name or extension, and a minimum size to start. More conditions may come, and they may need combining."
      },
      {
       "q": "Does a folder have a size?",
       "a": "Yes, the total of everything inside it."
      },
      {
       "q": "Several users? Permissions?",
       "a": "One user for now. Permissions are a follow-up."
      },
      {
       "q": "How large can a folder get, and can two things happen at once?",
       "a": "Assume ordinary sizes, and I may ask what changes for a million entries. Single-threaded."
      }
     ]
    },
    {
     "t": "list",
     "items": [
      "In scope: one tree of files and folders, mkdir, add a file with a size, ls, find with filters on extension and size, the size of a folder.",
      "Out of scope: file contents, a real disk, delete and move, symlinks, users and permissions, concurrency.",
      "Later (they will ask): combining filters with AND and OR, permissions, very large folders."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-files-reqs-mcq",
     "q": "You ask each clarifying question and the interviewer answers 'what do you think?'. What now?",
     "o": [
      "Stop asking and design for every case you can think of, so nothing is missed",
      "Ask for a different problem that has a clearer statement",
      "Pick sensible answers, say each aloud as an assumption, write the scope down, and invite corrections",
      "Wait in silence until they give a real answer, since guessing looks careless"
     ],
     "a": 2,
     "why": "Their reply is data too: they want to see you decide. Stated assumptions turn guesses into a scope they can correct. Designing for every case is exactly the over-building this question tests against."
    }
   ]
  },
  {
   "id": "lld-files-model",
   "title": "Entities and relationships",
   "blocks": [
    {
     "t": "p",
     "text": "A file and a folder look different, but a caller who asks 'how big is it?' or 'walk everything under it' does not care which one it holds. That is the Composite pattern: both are an Entry, and a folder is an Entry that contains Entries."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "One kind of entry, any depth",
       "parts": [
        [
         "Entry",
         "size() and walk()",
         true
        ],
        [
         "File",
         "a size of its own"
        ],
        [
         "Directory",
         "children by name; size is their sum"
        ],
        [
         "FileSystem",
         "root; mkdir, add_file, ls, find"
        ],
        [
         "Filter",
         "matches(entry): yes or no"
        ]
       ],
       "note": "File and Directory are both Entries, and a Directory holds Entries, so it nests to any depth. A Filter looks at one Entry. find hands it every Entry under the start path."
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
       "Entry",
       "Nothing",
       "The shared contract: size() and walk(path)"
      ],
      [
       "File",
       "Its own size",
       "size() returns it; walk yields itself"
      ],
      [
       "Directory",
       "Children, a dict from name to Entry",
       "size() adds up the children; walk yields itself, then everything below"
      ],
      [
       "FileSystem",
       "The root Directory",
       "Turns a path into an Entry (resolve), makes folders and files, lists, finds"
      ],
      [
       "Filter",
       "Its condition (an extension, a size)",
       "matches(entry) returns True or False"
      ]
     ]
    },
    {
     "t": "mcq",
     "id": "lld-files-model-mcq1",
     "q": "Directory.size() calls size() on each child without checking whether the child is a File or a Directory. Why does that work?",
     "o": [
      "Because files have no size, so there is nothing to check",
      "Because Python skips the type check inside recursive calls",
      "Because directories cannot contain other directories, only files",
      "Because both are Entries with a size() method, so the same call works on either"
     ],
     "a": 3,
     "why": "That is what Composite buys: the caller treats one thing and a group of things the same way. Without it you would write isinstance checks in every method that touches the tree."
    },
    {
     "t": "mcq",
     "id": "lld-files-model-mcq2",
     "q": "Where should the code that splits '/docs/notes/todo.txt' into parts live?",
     "o": [
      "In File",
      "In Directory",
      "In FileSystem",
      "In Filter"
     ],
     "a": 2,
     "why": "A path is how a caller names an entry from the root, and only the FileSystem holds the root. Entries know their own name and children, not the way you reached them."
    }
   ]
  },
  {
   "id": "lld-files-code",
   "title": "The core code",
   "blocks": [
    {
     "t": "p",
     "text": "The file system below is about 80 lines. `walk` is a generator, so `find` never builds a list of the whole tree. Filters are separate objects, so a new condition is a new class."
    },
    {
     "t": "code",
     "id": "lld-files-code-core",
     "title": "File system: composite entries, path resolution, find with filters",
     "code": "from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\n\nclass Entry(ABC):\n    @abstractmethod\n    def size(self): ...\n    def walk(self, path):\n        yield path, self\n\nclass File(Entry):\n    def __init__(self, name, nbytes):\n        self.name, self.nbytes = name, nbytes\n\n    def size(self):\n        return self.nbytes\n\nclass Directory(Entry):\n    def __init__(self, name):\n        self.name, self.children = name, {}\n\n    def size(self):\n        return sum(c.size() for c in self.children.values())\n\n    def walk(self, path):\n        yield path, self\n        for name in sorted(self.children):\n            yield from self.children[name].walk(path.rstrip(\"/\") + \"/\" + name)\n\nclass Filter(ABC):\n    @abstractmethod\n    def matches(self, entry): ...\n\n@dataclass\nclass Ext(Filter):\n    ext: str\n    def matches(self, entry):\n        return entry.name.endswith(self.ext)\n\n@dataclass\nclass MinSize(Filter):\n    nbytes: int\n    def matches(self, entry):\n        return entry.size() >= self.nbytes\n\nclass FileSystem:\n    def __init__(self):\n        self.root = Directory(\"\")\n\n    def mkdir(self, path):\n        return self.resolve(path, create=True)\n\n    def add_file(self, path, nbytes):\n        folder, _, name = path.rpartition(\"/\")\n        self.mkdir(folder).children[name] = File(name, nbytes)\n\n    def resolve(self, path, create=False):\n        node = self.root\n        for part in filter(None, path.split(\"/\")):\n            if not isinstance(node, Directory):\n                raise NotADirectoryError(path)\n            if part not in node.children and not create:\n                raise FileNotFoundError(path)\n            node = node.children.setdefault(part, Directory(part))\n        return node\n\n    def ls(self, path=\"/\"):\n        node = self.resolve(path)\n        return sorted(node.children) if isinstance(node, Directory) else [node.name]\n\n    def find(self, path, flt):\n        walk = self.resolve(path).walk(\"/\" + path.strip(\"/\"))\n        next(walk)\n        return [p for p, e in walk if flt.matches(e)]\n\nif __name__ == \"__main__\":\n    fs = FileSystem()\n    for p, n in [(\"/docs/notes/todo.txt\", 120), (\"/docs/notes/ideas.txt\", 80), (\"/docs/report.pdf\", 5000)]:\n        fs.add_file(p, n)\n    print(fs.ls(\"/docs\"), fs.resolve(\"/docs\").size())\n    print(fs.find(\"/\", Ext(\".txt\")), fs.find(\"/docs\", MinSize(1000)))",
     "notes": {
      "4": "The shared contract. Any Entry can report its size and walk what is under it.",
      "22": "A folder asks each child for its size. No check for File or Directory: that is Composite.",
      "27": "Recursion through the same call. It works at any depth and builds no list.",
      "29": "One method. A new condition is a new class.",
      "59": "The one place that must ask what kind it holds: a path cannot go through a file.",
      "63": "Steps into the child. With create=True (mkdir) a missing folder is made on the way.",
      "72": "Skips the start entry itself, so find lists what is below it.",
      "73": "The filter is asked about each entry. find does not know what a filter checks."
     },
     "ask": {
      "q": "Click the line where find decides whether an entry matches, without knowing what the condition is.",
      "lines": [
       73
      ],
      "why": "find calls flt.matches(e) and nothing else about the condition. Ext and MinSize are invisible to it, which is why a new filter, or a combination of filters, needs no change here."
     }
    },
    {
     "t": "predict",
     "id": "lld-files-code-p",
     "code": "if __name__ == \"__main__\":\n    fs = FileSystem()\n    for p, n in [(\"/docs/notes/todo.txt\", 120), (\"/docs/notes/ideas.txt\", 80), (\"/docs/report.pdf\", 5000)]:\n        fs.add_file(p, n)\n    print(fs.ls(\"/docs\"), fs.resolve(\"/docs\").size())\n    print(fs.find(\"/\", Ext(\".txt\")), fs.find(\"/docs\", MinSize(1000)))",
     "q": "Run the file. What prints?",
     "answer": "['notes', 'report.pdf'] 5200\n['/docs/notes/ideas.txt', '/docs/notes/todo.txt'] ['/docs/report.pdf']",
     "why": "ls lists the names under /docs in sorted order: the folder notes and the file report.pdf. The size of /docs is 120 + 80 + 5000 = 5200. The first find walks the whole tree and keeps names ending in .txt, in sorted order: ideas.txt before todo.txt. The second find keeps entries of at least 1000 bytes under /docs: only report.pdf, since notes holds 200. Both find results are on one line, separated by a space."
    }
   ]
  },
  {
   "id": "lld-files-ext",
   "title": "The extension follow-ups",
   "blocks": [
    {
     "t": "p",
     "text": "Say which class changes before you edit. For filters the answer is 'none of the existing ones'."
    },
    {
     "t": "write",
     "id": "lld-files-ext-and-or",
     "q": "Support combining filters: find the .log files of at least 100 bytes (AND), and the files that are .log or .txt (OR). find and the existing filters must not change.",
     "starter": "class Filter(ABC):\n    @abstractmethod\n    def matches(self, entry): ...\n\n@dataclass\nclass Ext(Filter):\n    ext: str\n    def matches(self, entry):\n        return entry.name.endswith(self.ext)\n\n@dataclass\nclass MinSize(Filter):\n    nbytes: int\n    def matches(self, entry):\n        return entry.size() >= self.nbytes",
     "solution": "class Filter(ABC):\n    @abstractmethod\n    def matches(self, entry): ...\n\n@dataclass\nclass Ext(Filter):\n    ext: str\n    def matches(self, entry):\n        return entry.name.endswith(self.ext)\n\n@dataclass\nclass MinSize(Filter):\n    nbytes: int\n    def matches(self, entry):\n        return entry.size() >= self.nbytes\n\nclass And(Filter):\n    def __init__(self, *parts):\n        self.parts = parts\n\n    def matches(self, entry):\n        return all(p.matches(entry) for p in self.parts)\n\nclass Or(Filter):\n    def __init__(self, *parts):\n        self.parts = parts\n\n    def matches(self, entry):\n        return any(p.matches(entry) for p in self.parts)\n\nfs = FileSystem()\nfs.add_file(\"/a/big.log\", 900)\nfs.add_file(\"/a/small.log\", 10)\nfs.add_file(\"/a/big.txt\", 900)\nprint(fs.find(\"/\", And(Ext(\".log\"), MinSize(100))))\nprint(fs.find(\"/\", Or(Ext(\".log\"), Ext(\".txt\"))))",
     "hint": "A Filter that holds other Filters. It is itself a Filter.",
     "why": "And and Or are Filters that hold Filters, so they nest: And(Or(...), MinSize(...)). find does not change because it only ever calls matches. Not(...) is the same shape in four lines. One trap: a folder has a size, so MinSize alone also matches folders; add an IsFile filter and And it in, which is again a new class."
    },
    {
     "t": "write",
     "id": "lld-files-ext-perms",
     "q": "Add permissions: only the owner of a folder may create things under it. Keep File, Directory and the filters unchanged.",
     "starter": "class FileSystem:\n    def __init__(self):\n        self.root = Directory(\"\")\n\n    def mkdir(self, path):\n        return self.resolve(path, create=True)\n\n    def add_file(self, path, nbytes):\n        folder, _, name = path.rpartition(\"/\")\n        self.mkdir(folder).children[name] = File(name, nbytes)",
     "solution": "class AllowAll:\n    def can_write(self, user, path):\n        return True\n\nclass OwnerOnly:\n    def __init__(self, owners):\n        self.owners = owners\n\n    def can_write(self, user, path):\n        for prefix, owner in self.owners.items():\n            if path == prefix or path.startswith(prefix + \"/\"):\n                return user == owner\n        return True\n\nclass FileSystem:\n    def __init__(self, policy=AllowAll()):\n        self.root = Directory(\"\")\n        self.policy = policy\n\n    def _guard(self, user, path):\n        if not self.policy.can_write(user, \"/\" + path.strip(\"/\")):\n            raise PermissionError(path)\n\n    def mkdir(self, path, user=None):\n        self._guard(user, path)\n        return self.resolve(path, create=True)\n\n    def add_file(self, path, nbytes, user=None):\n        self._guard(user, path)\n        folder, _, name = path.rpartition(\"/\")\n        self.mkdir(folder, user).children[name] = File(name, nbytes)\n\nfs = FileSystem(OwnerOnly({\"/home/ann\": \"ann\"}))\nfs.add_file(\"/home/ann/a.txt\", 5, user=\"ann\")\ntry:\n    fs.add_file(\"/home/ann/b.txt\", 5, user=\"bob\")\nexcept PermissionError:\n    print(\"denied\")\nprint(fs.ls(\"/home/ann\"))",
     "hint": "Make the rule an object you pass in, like pricing. Each method that changes the tree asks it first.",
     "why": "The entries are unchanged: permission is a policy passed in, the same move as pricing in the parking lot. The cost is real and you say it: every method that changes the tree takes a user and calls one guard. Reads (ls, find) would need the same guard if reading can be denied; here they are left open, and you say so. Later rules (groups, read-write-execute bits) change OwnerOnly or add a sibling, not the tree."
    },
    {
     "t": "write",
     "id": "lld-files-ext-limit",
     "q": "A folder holds millions of entries and the caller wants only the first few matches. Change find so it can stop early, with an optional limit.",
     "starter": "    def find(self, path, flt):\n        walk = self.resolve(path).walk(\"/\" + path.strip(\"/\"))\n        next(walk)\n        return [p for p, e in walk if flt.matches(e)]",
     "solution": "    def find(self, path, flt, limit=None):\n        walk = self.resolve(path).walk(\"/\" + path.strip(\"/\"))\n        next(walk)\n        hits = (p for p, e in walk if flt.matches(e))\n        return list(itertools.islice(hits, limit))\n\nfs = FileSystem()\nfs.add_file(\"/docs/a.txt\", 1)\nfs.add_file(\"/docs/b.txt\", 2)\nfs.add_file(\"/docs/c.txt\", 3)\nprint(fs.find(\"/\", Ext(\".txt\"), limit=2))",
     "hint": "A generator expression is lazy. Cut it with itertools.islice.",
     "why": "walk was a generator from the start, so the work stops as soon as the limit is reached; nothing else in find needed to change. The first design choice paid for the follow-up. Put import itertools at the top of the file."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "The folder has a million entries. What is slow, and what do you change?",
       "a": "Three things. ls sorts every name on every call, so keep the names in a sorted list as you insert (bisect.insort) and return a page with a cursor: ls(path, after, limit). size() re-adds the whole subtree on every call, so cache each folder's size and update it up the chain of parents when a file changes. find already walks lazily, so a limit stops it early."
      },
      {
       "q": "Why not store the full path on each entry?",
       "a": "A path is where an entry sits, not what it is. Moving a folder would then mean rewriting every path below it. The tree already encodes the path, and walk builds it on demand."
      }
     ]
    }
   ]
  },
  {
   "id": "lld-files-listen",
   "title": "What they listen for",
   "blocks": [
    {
     "t": "list",
     "items": [
      "You asked first: with no requirements given, six to eight questions and a stated scope were the test.",
      "Composite: File and Directory share Entry, so size() and walk() work the same way at any depth and no caller checks the kind.",
      "Open-closed through Filter: Ext and MinSize were two classes; And and Or arrived later as two more, and find did not change.",
      "Dependency inversion: permissions came in as a policy object and the tree did not change.",
      "Not over-built: no contents, no symlinks, no delete or move, no Singleton file system.",
      "Scale: you can say why ls sorts on every call and size() re-adds the subtree, and what you would change (sorted names with a cursor, a cached size)."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-files-listen-mcq",
     "q": "A new condition arrives: files modified in the last 7 days. What is the smallest change?",
     "o": [
      "Add one more if-branch to find, as for every other kind of condition",
      "Make File a subclass of Filter so a file can test itself",
      "Add a days parameter to find and filter on it inside the loop",
      "Add a modified time to File and a new Filter subclass that checks it"
     ],
     "a": 3,
     "why": "A condition is a Filter. The only new data is the time on File. find stays as it is, and the new filter combines with the others through And and Or for free."
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-cart",
 "n": 4,
 "title": "Shopping cart with discounts",
 "minutes": 40,
 "lead": "After this part you can take a cart-with-discounts prompt from questions to running code, explain why money is integer cents and never float, put discounts behind one interface, and add buy-one-get-one, stacking and an expiring coupon without rewriting the cart.",
 "sections": [
  {
   "id": "lld-cart-reqs",
   "title": "The prompt and the requirements you elicit",
   "blocks": [
    {
     "t": "p",
     "text": "A 2026 offer-holder was asked to build a shopping cart whose total can apply a percentage discount, a flat discount, or no discount. The prompt can arrive that short. Everything else comes from your questions."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "What is in the cart: items with quantities?",
       "a": "Yes, each item has an id, a name and a price. Adding the same item again raises its quantity."
      },
      {
       "q": "How is money held, and is there tax or shipping?",
       "a": "One currency with two decimals, and no tax or shipping."
      },
      {
       "q": "What does the percentage apply to: each item or the whole total?",
       "a": "The whole cart total, before any other discount."
      },
      {
       "q": "Can a flat discount push the total below zero?",
       "a": "No, the total never goes below zero."
      },
      {
       "q": "Can discounts be combined?",
       "a": "One at a time for now. Expect me to ask about more than one."
      },
      {
       "q": "How is the cart used?",
       "a": "Add and remove items, then checkout returns the amount to pay. Checkout does not empty the cart."
      },
      {
       "q": "What if a percentage does not divide evenly?",
       "a": "Your call. Say what you pick and why."
      },
      {
       "q": "Persistence or concurrency?",
       "a": "In memory, one cart at a time."
      }
     ]
    },
    {
     "t": "list",
     "items": [
      "In scope: items, quantities, add, remove, subtotal, checkout with one discount (none, percent or flat). Money in integer cents, with the discount rounded down to a whole cent.",
      "Out of scope: tax, shipping, payment, stock levels, user accounts, saving carts.",
      "Later (they will ask): buy-one-get-one, stacking several discounts in a set order, a coupon that expires."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-cart-reqs-mcq",
     "q": "10 percent off 999 cents is 99.9 cents. What do you do?",
     "o": [
      "Round the final total to the nearest dollar and move on",
      "Use a float and print two decimals, since the display hides the error",
      "Ask the interviewer to use prices that always divide evenly",
      "Pick a rule (round the discount down), say it aloud, and use integer arithmetic"
     ],
     "a": 3,
     "why": "A rounding rule is a requirement you choose and state. Rounding the discount down means the customer never gets more than the stated percent. Floats hide the question instead of answering it."
    }
   ]
  },
  {
   "id": "lld-cart-model",
   "title": "Entities and relationships",
   "blocks": [
    {
     "t": "p",
     "text": "A cart is a set of lines. A discount is a rule that turns a total into a smaller total. Keep those two ideas apart and the design is mostly done."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Cart and discounts",
       "parts": [
        [
         "Item",
         "sku, name, price in cents"
        ],
        [
         "Line",
         "an item and a quantity"
        ],
        [
         "Cart",
         "lines; add, remove, subtotal, checkout",
         true
        ],
        [
         "Discount",
         "apply(lines, total) gives a new total"
        ],
        [
         "NoDiscount, Percent, Flat",
         "the rules, one class each"
        ]
       ],
       "note": "The cart owns its lines. It does not know which discount it was given: checkout takes one and asks it."
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
       "Item",
       "Sku, name, price in cents",
       "Nothing. A frozen value."
      ],
      [
       "Line",
       "An Item and a quantity",
       "Nothing. A record."
      ],
      [
       "Cart",
       "A dict of Lines by sku",
       "add, remove, subtotal, checkout(discount)"
      ],
      [
       "Discount",
       "Nothing",
       "apply(lines, total) returns the new total in cents"
      ],
      [
       "NoDiscount, Percent, Flat",
       "A percentage or an amount",
       "One rule each"
      ]
     ]
    },
    {
     "t": "mcq",
     "id": "lld-cart-model-mcq1",
     "q": "Why does Discount.apply receive the lines as well as the total?",
     "o": [
      "Python cannot pass a single number to a method of another class",
      "Percent needs the lines to compute its percentage of each item",
      "Some rules, such as buy-one-get-one, depend on what was bought and not only on the sum",
      "So the discount can edit the cart and remove items itself"
     ],
     "a": 2,
     "why": "Passing only the total is the narrowest interface that works today and the first to break. Buy-one-get-one cannot be written from a total. Passing the lines costs one parameter now and saves changing every discount later. Percent and Flat ignore the lines, and that is fine."
    },
    {
     "t": "mcq",
     "id": "lld-cart-model-mcq2",
     "q": "Why a NoDiscount class instead of discount=None and an if inside checkout?",
     "o": [
      "None cannot be passed to a function as a default argument",
      "Python requires a class for every possible case of an argument",
      "checkout then has no branch for 'no discount'; it calls apply every time, like any other rule",
      "It is faster, because None checks are slow in Python"
     ],
     "a": 2,
     "why": "It removes a special case from the one place that would otherwise need it. Do not push the idea further: a NullLogger for every optional thing is the same over-building the interviewer is watching for."
    }
   ]
  },
  {
   "id": "lld-cart-code",
   "title": "The core code, and why money is integer cents",
   "blocks": [
    {
     "t": "p",
     "text": "Money first, because it is the first thing they check. A float cannot hold most decimal prices exactly, so totals drift and comparisons fail. Hold money as integer cents and convert to dollars only when you print."
    },
    {
     "t": "table",
     "head": [
      "Choice",
      "How 10 cents is held",
      "Problem or cost"
     ],
     "rows": [
      [
       "float",
       "0.1",
       "Binary cannot hold 0.1 exactly. 0.1 + 0.2 is 0.30000000000000004, so comparing totals with == fails."
      ],
      [
       "int cents",
       "10",
       "No problem for add, subtract and compare. You choose a rounding rule only where you divide, such as a percentage."
      ],
      [
       "Decimal",
       "Decimal('0.10')",
       "Exact in decimal and fine when fractions of a cent matter (tax tables), but slower, and every value must be built from a string."
      ]
     ]
    },
    {
     "t": "predict",
     "id": "lld-cart-code-pf",
     "code": "print(0.1 + 0.2 == 0.3)\nprint(0.1 + 0.2)",
     "q": "What prints?",
     "answer": "False\n0.30000000000000004",
     "why": "0.1 and 0.2 are stored in binary with a tiny error, and the error shows up in the sum. This is why a total built from floats should never be compared with ==."
    },
    {
     "t": "predict",
     "id": "lld-cart-code-pd",
     "code": "from decimal import Decimal\nprint(Decimal(\"0.1\") + Decimal(\"0.2\") == Decimal(\"0.3\"))\nprint(Decimal(0.1) == Decimal(\"0.1\"))",
     "q": "What prints?",
     "answer": "True\nFalse",
     "why": "Strings give Decimal an exact start, so the sum is exact. Decimal(0.1) copies the float's error into the Decimal, so it is not equal to Decimal('0.1'). Build a Decimal from a string, never from a float."
    },
    {
     "t": "code",
     "id": "lld-cart-code-core",
     "title": "Cart: lines, a discount strategy, integer cents",
     "code": "from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Item:\n    sku: str\n    name: str\n    price: int\n\n@dataclass\nclass Line:\n    item: Item\n    qty: int\n\nclass Discount(ABC):\n    @abstractmethod\n    def apply(self, lines, total): ...\n\nclass NoDiscount(Discount):\n    def apply(self, lines, total):\n        return total\n\nclass Percent(Discount):\n    def __init__(self, pct):\n        if not 0 <= pct <= 100:\n            raise ValueError(\"pct must be 0 to 100\")\n        self.pct = pct\n\n    def apply(self, lines, total):\n        return total - total * self.pct // 100\n\nclass Flat(Discount):\n    def __init__(self, cents):\n        self.cents = cents\n\n    def apply(self, lines, total):\n        return max(0, total - self.cents)\n\nclass Cart:\n    def __init__(self):\n        self.lines = {}\n\n    def add(self, item, qty=1):\n        if qty <= 0:\n            raise ValueError(\"qty must be positive\")\n        line = self.lines.setdefault(item.sku, Line(item, 0))\n        line.qty += qty\n\n    def remove(self, sku, qty=1):\n        line = self.lines[sku]\n        line.qty -= qty\n        if line.qty <= 0:\n            del self.lines[sku]\n\n    def subtotal(self):\n        return sum(l.item.price * l.qty for l in self.lines.values())\n\n    def checkout(self, discount=NoDiscount()):\n        return discount.apply(list(self.lines.values()), self.subtotal())\n\nif __name__ == \"__main__\":\n    cart = Cart()\n    cart.add(Item(\"p1\", \"pen\", 250), 4)\n    cart.add(Item(\"b1\", \"book\", 1999))\n    print(cart.subtotal())\n    for d in (NoDiscount(), Percent(10), Flat(500)):\n        print(type(d).__name__, cart.checkout(d))",
     "notes": {
      "8": "Cents. Never a float.",
      "17": "One method. Every discount, now or later, has this shape.",
      "30": "Integer arithmetic. The discount rounds down, so the customer never gets more than the stated percent.",
      "37": "A flat discount cannot push the total below zero.",
      "46": "Adding the same item again raises its quantity.",
      "59": "The only place the cart uses a discount. It does not know which one."
     },
     "ask": {
      "q": "Click the line where the cart hands the total to whichever discount it was given.",
      "lines": [
       59
      ],
      "why": "checkout passes the lines and the subtotal to apply and returns the result. Percent, Flat and NoDiscount are invisible to it, which is why each new discount is a new class and nothing else."
     }
    },
    {
     "t": "predict",
     "id": "lld-cart-code-p",
     "code": "if __name__ == \"__main__\":\n    cart = Cart()\n    cart.add(Item(\"p1\", \"pen\", 250), 4)\n    cart.add(Item(\"b1\", \"book\", 1999))\n    print(cart.subtotal())\n    for d in (NoDiscount(), Percent(10), Flat(500)):\n        print(type(d).__name__, cart.checkout(d))",
     "q": "Run the file. What prints?",
     "answer": "2999\nNoDiscount 2999\nPercent 2700\nFlat 2499",
     "why": "4 pens at 250 is 1000, plus the book at 1999, so the subtotal is 2999. NoDiscount returns the total unchanged. Percent(10) takes 2999 * 10 // 100 = 299 off, which leaves 2700. Flat(500) leaves 2499."
    }
   ]
  },
  {
   "id": "lld-cart-ext",
   "title": "The extension follow-ups",
   "blocks": [
    {
     "t": "p",
     "text": "Say which class changes before you edit. Here the answer each time is 'a new Discount, and the cart stays'."
    },
    {
     "t": "write",
     "id": "lld-cart-ext-bogo",
     "q": "Add a rule: for one sku, every second unit is free (buy one, get one). Cart.checkout must not change.",
     "starter": "class BuyOneGetOne(Discount):\n    ...",
     "solution": "class BuyOneGetOne(Discount):\n    def __init__(self, sku):\n        self.sku = sku\n\n    def apply(self, lines, total):\n        free = sum(l.item.price * (l.qty // 2) for l in lines if l.item.sku == self.sku)\n        return total - free\n\ncart = Cart()\ncart.add(Item(\"p1\", \"pen\", 250), 5)\nprint(cart.checkout(BuyOneGetOne(\"p1\")))",
     "hint": "The rule needs quantities, and apply already receives the lines.",
     "why": "It was easy because apply receives the lines. Had the interface been apply(total), the rule could not be written, and widening it would have changed every discount. That is the cost of guessing too narrow, and it is why you passed the lines at the start. With five pens the rule frees two of them. One pen frees none."
    },
    {
     "t": "write",
     "id": "lld-cart-ext-stack",
     "q": "Apply 10 percent and 500 cents off together. Show that the order changes the total, and let one discount hold several others in a set order.",
     "starter": "class Stack(Discount):\n    ...",
     "solution": "class Stack(Discount):\n    def __init__(self, *parts):\n        self.parts = parts\n\n    def apply(self, lines, total):\n        for d in self.parts:\n            total = d.apply(lines, total)\n        return total\n\ncart = Cart()\ncart.add(Item(\"p1\", \"pen\", 250), 4)\ncart.add(Item(\"b1\", \"book\", 1999))\nprint(cart.checkout(Stack(Percent(10), Flat(500))))\nprint(cart.checkout(Stack(Flat(500), Percent(10))))",
     "hint": "A Discount that holds other Discounts and feeds each one the total left by the one before.",
     "why": "Order is a business rule, not a coding detail: percent first leaves 2200, flat first leaves 2250. Ask which one, say it aloud, and make it visible in the code (the argument order, or a priority field). Stack is itself a Discount, so checkout is unchanged. A list argument on checkout would also work, but then the cart carries the policy."
    },
    {
     "t": "write",
     "id": "lld-cart-ext-coupon",
     "q": "Add a coupon: it wraps any discount and stops working after an expiry time. It must be testable without waiting.",
     "starter": "class Coupon(Discount):\n    ...",
     "solution": "class Coupon(Discount):\n    def __init__(self, inner, expires, clock):\n        self.inner, self.expires, self.clock = inner, expires, clock\n\n    def apply(self, lines, total):\n        if self.clock() >= self.expires:\n            return total\n        return self.inner.apply(lines, total)\n\nnow = [100]\ncoupon = Coupon(Flat(500), expires=200, clock=lambda: now[0])\ncart = Cart()\ncart.add(Item(\"b1\", \"book\", 1999))\nprint(cart.checkout(coupon))\nnow[0] = 200\nprint(cart.checkout(coupon))",
     "hint": "Pass the clock in as an argument. Do not call time.time() inside.",
     "why": "The clock comes in as an argument (dependency inversion), so a test moves it by changing one number. Calling time.time() inside would force a real wait. The coupon wraps another Discount, so it works for Percent or BuyOneGetOne too. Decide what an expired coupon does: here the cart quietly ignores it. The interviewer may want an error or a message instead, so ask."
    }
   ]
  },
  {
   "id": "lld-cart-listen",
   "title": "What they listen for",
   "blocks": [
    {
     "t": "list",
     "items": [
      "Strategy for discounts: percent, flat and none are interchangeable behind apply, and the caller picks one.",
      "Money as integer cents, with one named rounding rule where you divide. You can say why not float.",
      "Open-closed: buy-one-get-one, stacking and the coupon were new classes. Cart did not change.",
      "Interface width: you passed the lines as well as the total, so quantity rules fit. Say why you did.",
      "Dependency inversion: the coupon's clock is passed in, so expiry is testable.",
      "Not over-built: no DiscountFactory, no event system, no tax or payment classes."
     ]
    },
    {
     "t": "mcq",
     "id": "lld-cart-listen-mcq",
     "q": "Two stacked discounts give a different total depending on their order. What is the best way to handle it in the interview?",
     "o": [
      "Pick any order silently and hope the interviewer does not notice",
      "Refuse to stack discounts, since order makes the total unpredictable",
      "Always sort the discounts by amount, largest first, so the customer wins",
      "Ask which order the business wants, say it aloud, and make it explicit in the code"
     ],
     "a": 3,
     "why": "The order is a requirement. Asking shows you saw the trap. Stating your choice and making it visible lets the interviewer correct it in one sentence."
    }
   ]
  }
 ]
});
