"""Library management. A drill, same shape as locker.py. Dates are passed in (`today`), so the demo is stable.
Core: Book (a title), Copy (one physical copy), Member, Library. Reservations and the per-member fine arrive as extensions."""
import textwrap

D = textwrap.dedent


def method(src):
    """Dedent a method written at class level; the page shows it like this, and CORE indents it back."""
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


ADD_COPY = method('''
    def add_copy(self, book: Book, barcode: str) -> None:
        """
        Core logic:
          1. Remember the title by its isbn
          2. Create the copy and link it to its title
        Edge cases:
          1. Barcode already used -> error
        """
        if barcode in self.copies:                         # Edge 1: a barcode names exactly one copy
            raise LibraryError(f"barcode {barcode} already exists")
        self.books[book.isbn] = book                       # Step 1: keyed by isbn, so a second copy reuses the title
        copy = Copy(barcode, book)                         # Step 2: the copy points back to its title...
        book.copies.append(copy)                           # ...and the title lists its copies
        self.copies[barcode] = copy                        # by barcode: checkout and return only get a barcode
''')

SEARCH = method('''
    def search(self, text: str) -> list:
        """
        Core logic:
          1. Lower-case the text
          2. Keep every title whose title or author contains it
          3. Return titles, not copies
        Edge cases:
          1. No match -> empty list
        """
        t = text.lower()                                   # Step 1: compare in lower case so "DUNE" finds "Dune"
        # Steps 2 and 3: "in" is a substring test (part of a word); titles, not copies; no match gives []
        return [b for b in self.books.values() if t in b.title.lower() or t in b.author.lower()]
''')

CHECKOUT = method('''
    def checkout(self, member_id: str, barcode: str, today: date) -> date:
        """
        Core logic:
          1. Find the member and the copy
          2. Check the copy is free and the member is under the loan limit
          3. Record the borrower and the due date, and add the copy to the member's loans
          4. Return the due date
        Edge cases:
          1. Unknown member or barcode -> error
          2. Copy already on loan -> error
          3. Member already holds the maximum -> error
        """
        # Step 1: .get gives None instead of a KeyError, so both lookups can fail into one check
        member, copy = self.members.get(member_id), self.copies.get(barcode)
        if member is None or copy is None:                 # Edge 1
            raise LibraryError("unknown member or copy")
        if copy.borrower is not None:                      # Edge 2: a borrower means it is out
            raise LibraryError(f"copy {barcode} is on loan")
        if len(member.loans) >= self.MAX_LOANS:            # Edge 3: the loans list length is the count
            raise LibraryError("loan limit reached")
        copy.borrower = member                             # Step 3: the copy remembers who has it...
        copy.due = today + timedelta(days=self.LOAN_DAYS)  # ...and when it is due (the date is passed in)
        member.loans.append(copy)                          # the member remembers it too, for the limit check
        return copy.due                                    # Step 4
''')

RETURN = method('''
    def return_copy(self, barcode: str, today: date) -> int:
        """
        Core logic:
          1. Find the copy and its borrower
          2. Work out the days late and the fine
          3. Add the fine to the member and free the copy
          4. Return the fine in cents
        Edge cases:
          1. Unknown barcode, or the copy is not on loan -> error
          2. Returned on or before the due date -> fine 0
        """
        copy = self.copies.get(barcode)                    # Step 1
        if copy is None or copy.borrower is None:          # Edge 1: unknown, or already on the shelf
            raise LibraryError(f"copy {barcode} is not on loan")
        member = copy.borrower                             # the copy knows its borrower, so no member id is needed
        # Step 2: (today - due) is a timedelta, .days its whole days; max(0, ...) is Edge 2, on time costs nothing
        fine = self._fine_for(member, max(0, (today - copy.due).days))
        member.fines += fine                               # Step 3: fines add up on the member
        member.loans.remove(copy)                          # the loan ends on both sides
        copy.borrower = copy.due = None                    # back on the shelf: no borrower, no due date
        return fine                                        # Step 4
''')

HELPERS = method('''
    def _fine_for(self, member: Member, days_late: int) -> int:
        """Cents owed for a late return: a flat rate per day."""
        # member is unused today; it is here so a per-member rate is a change to this helper only
        return days_late * self.FINE_PER_DAY
''')

HEAD = D('''\
    from datetime import date, timedelta


    class LibraryError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

CLASSES = D('''\


    class Book:
        """A title, shared by all its copies. Only data, no behaviour: the library searches, the book remembers."""

        def __init__(self, isbn: str, title: str, author: str):
            self.isbn = isbn             # the key every copy of this title shares
            self.title = title           # search matches on this
            self.author = author         # and on this
            self.copies = []             # list of Copy: the title knows its physical copies


    class Copy:
        """One physical copy. Only data, no behaviour: it knows its borrower and due date, the library enforces the rules."""

        def __init__(self, barcode: str, book: Book):
            self.barcode = barcode       # the key a borrower presents at the desk
            self.book = book             # points back to the title
            self.borrower = None         # Member, or None when on the shelf; no separate on-loan flag
            self.due = None              # date, set while on loan; return compares today to it


    class Member:
        """A person who borrows. Only data, no behaviour: the library checks the limit and adds the fines."""

        def __init__(self, member_id: str, name: str):
            self.member_id = member_id   # the key in the library's members map
            self.name = name
            self.loans = []              # list of Copy; its length is checked against the loan limit
            self.fines = 0               # cents; a late return adds to it
    ''')

LIBRARY = D('''\


    class Library:
        LOAN_DAYS = 14                   # the rules live here, in one place
        MAX_LOANS = 2
        FINE_PER_DAY = 25                # cents

        def __init__(self, members: list):
            self.members = {m.member_id: m for m in members}   # id -> Member: checkout gets an id, one lookup
            self.books = {}              # isbn -> Book
            self.copies = {}             # barcode -> Copy: checkout and return get only a barcode
    ''')

CORE = HEAD + CLASSES + LIBRARY + in_class(ADD_COPY, SEARCH, CHECKOUT, RETURN, HELPERS)

DEMO = D('''\


    # ---- a quick run ----
    today = date(2026, 11, 1)                # a fixed date, so every run prints the same thing
    ann = Member("m1", "Ann")
    lib = Library([ann, Member("m2", "Bob")])
    dune = Book("i1", "Dune", "Frank Herbert")
    lib.add_copy(dune, "c1")
    lib.add_copy(Book("i2", "Emma", "Jane Austen"), "c2")
    lib.add_copy(Book("i3", "Ulysses", "James Joyce"), "c3")
    print(lib.checkout("m1", "c1", today))   # due 14 days out: 2026-11-15
    lib.checkout("m1", "c2", today)          # Ann now holds 2, the limit
    for who, barcode in (("m1", "c3"), ("m2", "c1")):   # Ann is at the limit; c1 is already out
        try:
            lib.checkout(who, barcode, today)
        except LibraryError as e:
            print(e)
    print(lib.return_copy("c1", today + timedelta(days=17)))   # 3 days late x 25 = 75
    print(ann.fines, [b.title for b in lib.search("DUNE")])    # the fine is on Ann; search ignores case
    print(lib.return_copy("c2", today + timedelta(days=10)))   # early, so max(0, ...) gives no fine
    ''')
DEMO_OUT = "2026-11-15\nloan limit reached\ncopy c1 is on loan\n75\n75 ['Dune']\n0\n"

# ---- extensions ----
EXT_RESERVE = D('''\
    class Book:
        def __init__(self, isbn, title, author):
            ...
            self.waiting = deque()           # member ids, first in line first; a deque pops from the left in O(1)


    class Copy:
        def __init__(self, barcode, book):
            ...
            self.held_for = None             # member id, set when a returned copy goes to the queue


    class Library:
        def reserve(self, member_id: str, isbn: str) -> None:
            book = self.books[isbn]                  # the queue is per title: people want the title, not one copy
            # a copy that is neither lent nor held is free to borrow, so there is nothing to queue for
            if any(c.borrower is None and c.held_for is None for c in book.copies):
                raise LibraryError("a copy is on the shelf; borrow it")
            book.waiting.append(member_id)           # join the back of the line

        # checkout: also reject when copy.held_for is set and is not this member; clear it when the holder borrows
        # return_copy, last step: if copy.book.waiting: copy.held_for = copy.book.waiting.popleft()
    ''')

EXT_NOTIFY = D('''\
    class Library:
        def __init__(self, members, on_hold_ready=lambda member_id, barcode: None):
            ...
            self.on_hold_ready = on_hold_ready     # a plain callable; email, SMS or a log line plugs in here

        # return_copy, after setting copy.held_for:
        #     self.on_hold_ready(copy.held_for, copy.barcode)
    ''')

EXT_FINE = D('''\
    class Kind(Enum):                 # the kinds of member that pay different rates
        ADULT = "adult"
        STUDENT = "student"


    class Library:
        FINE_PER_DAY = {Kind.ADULT: 25, Kind.STUDENT: 10}     # cents; was one number, now a lookup by kind

        def _fine_for(self, member: Member, days_late: int) -> int:
            return days_late * self.FINE_PER_DAY[member.kind]  # the member argument finally earns its place


    # Member gets one more field: self.kind = kind. return_copy does not change.
    ''')

FINAL_HEAD = D('''\
    from collections import deque
    from datetime import date, timedelta
    from enum import Enum


    class Kind(Enum):                 # the kinds of member that pay different rates
        ADULT = "adult"
        STUDENT = "student"


    class LibraryError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

FINAL_CLASSES = D('''\


    class Book:
        """A title, shared by all its copies. Only data, no behaviour: the library searches, the book remembers."""

        def __init__(self, isbn: str, title: str, author: str):
            self.isbn = isbn
            self.title = title
            self.author = author
            self.copies = []                 # the title knows its physical copies
            self.waiting = deque()           # member ids, first in line first; popleft is O(1)


    class Copy:
        """One physical copy. Only data, no behaviour: it knows its borrower and due date, the library enforces the rules."""

        def __init__(self, barcode: str, book: Book):
            self.barcode = barcode
            self.book = book
            self.borrower = None             # None means on the shelf
            self.due = None
            self.held_for = None             # member id the copy is kept for; None when nobody is waiting


    class Member:
        """A person who borrows. Only data, no behaviour: the library checks the limit and adds the fines."""

        def __init__(self, member_id: str, name: str, kind: Kind = Kind.ADULT):
            self.member_id = member_id
            self.name = name
            self.kind = kind                 # picks the fine rate; adult by default, so old callers still work
            self.loans = []
            self.fines = 0
    ''')

FINAL_LIBRARY = D('''\


    class Library:
        LOAN_DAYS = 14
        MAX_LOANS = 2
        FINE_PER_DAY = {Kind.ADULT: 25, Kind.STUDENT: 10}      # cents, by member kind

        def __init__(self, members: list):
            self.members = {m.member_id: m for m in members}   # id -> Member
            self.books = {}                  # isbn -> Book
            self.copies = {}                 # barcode -> Copy
    ''')

FINAL_CHECKOUT = method('''
    def checkout(self, member_id: str, barcode: str, today: date) -> date:
        member, copy = self.members.get(member_id), self.copies.get(barcode)
        if member is None or copy is None:
            raise LibraryError("unknown member or copy")
        if copy.borrower is not None:
            raise LibraryError(f"copy {barcode} is on loan")
        # new check: a held copy goes only to the member it is held for; None means not held
        if copy.held_for not in (None, member_id):
            raise LibraryError(f"copy {barcode} is held for another member")
        if len(member.loans) >= self.MAX_LOANS:
            raise LibraryError("loan limit reached")
        copy.held_for = None                               # the holder borrowed it, so the hold is used up
        copy.borrower = member
        copy.due = today + timedelta(days=self.LOAN_DAYS)
        member.loans.append(copy)
        return copy.due
''')

FINAL_RETURN = method('''
    def return_copy(self, barcode: str, today: date) -> int:
        copy = self.copies.get(barcode)
        if copy is None or copy.borrower is None:
            raise LibraryError(f"copy {barcode} is not on loan")
        member = copy.borrower
        fine = self._fine_for(member, max(0, (today - copy.due).days))   # days late, never negative
        member.fines += fine
        member.loans.remove(copy)
        copy.borrower = copy.due = None
        if copy.book.waiting:                              # new last step: someone is queued for this title
            copy.held_for = copy.book.waiting.popleft()    # first in line gets the copy, not the shelf
        return fine
''')

RESERVE = method('''
    def reserve(self, member_id: str, isbn: str) -> None:
        book = self.books[isbn]                            # the queue is per title, not per copy
        # a copy that is neither lent nor held is free to borrow, so there is nothing to queue for
        if any(c.borrower is None and c.held_for is None for c in book.copies):
            raise LibraryError("a copy is on the shelf; borrow it")
        book.waiting.append(member_id)                     # join the back of the line
''')

FINAL_HELPERS = method('''
    def _fine_for(self, member: Member, days_late: int) -> int:
        return days_late * self.FINE_PER_DAY[member.kind]   # rate looked up by the member's kind
''')

FINAL = FINAL_HEAD + FINAL_CLASSES + FINAL_LIBRARY + in_class(ADD_COPY, SEARCH, FINAL_CHECKOUT, RESERVE, FINAL_RETURN, FINAL_HELPERS)
FINAL_DEMO = D('''\


    # ---- a quick run ----
    today = date(2026, 11, 1)
    ann, bob = Member("m1", "Ann"), Member("m2", "Bob", Kind.STUDENT)   # Bob pays the student rate
    lib = Library([ann, bob, Member("m3", "Cy")])
    lib.add_copy(Book("i1", "Dune", "Frank Herbert"), "c1")
    lib.checkout("m1", "c1", today)
    lib.reserve("m2", "i1")                                  # the only copy is out, so Bob queues
    print(lib.return_copy("c1", today + timedelta(days=17)))   # Ann is 3 days late: 3 x 25 = 75; copy held for Bob
    try:
        lib.checkout("m3", "c1", today + timedelta(days=17))   # Cy is not first in line
    except LibraryError as e:
        print(e)
    lib.checkout("m2", "c1", today + timedelta(days=17))
    print(lib.return_copy("c1", today + timedelta(days=33)))   # due day 31, so 2 days late x 10 = 20
    print(ann.fines, bob.fines)
    ''')
FINAL_OUT = "75\ncopy c1 is held for another member\n20\n75 20\n"

PROBLEM = {
    "id": "library", "title": "Library management", "part_id": "lld-library", "n": 5,
    "part_title": "Library management", "minutes": 40,
    "lead": "A full library round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. A title and its copies are different things. Dates are passed in, so fines can be traced by hand.",
    "prompt": "Design a library management system.",
    "evidence": "Reported once or twice as 'a system like a library or parking lot' (LeetCode Discuss Jun 2025 and Apr 2026; TechPrep). The follow-ups are a reservation queue, a notification and a fine rule that varies by member.",
    "drill": "part 5, the whole round.",

    "clarify": {
        "capabilities": [("Is a book the same as a copy of a book?", "No: a title has several physical copies, each with a barcode. A member borrows a copy; searching works on the title"),
                         ("What are the loan rules?", "14 days, at most 2 loans at once, no renewals"),
                         ("How do people find books?", "Search by title or author, part of a word, any case; it returns titles")],
        "errors": [("What happens on a late return?", "A fine of 25 cents a day, added to the member when the copy comes back"),
                   ("A copy that is already out, or a member at the limit?", "Return an error"),
                   ("How does the code know today's date?", "Your call; passing it in makes fines easy to trace")],
        "scope": [("Reservations, paying fines, logins, notifications?", "Out of scope for now; expect a reservation queue as a follow-up"),
                  ("Persistence or threads?", "In memory, one desk, one thread")],
    },
    "clarify_hint": "A book versus a copy, loan length and limit, search. Late returns, a copy already out, today's date. Reservations, payment, logins, threads.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** I ask first whether a book and a copy are the same thing, because that decides the classes. Then the loan rules and a late return, then what I will leave out, like reservations.",
    "clarify_why": "A title and its copies give two classes. The limit and the fine give constants and the one place they live. Passing the date in decides how the demo and any test stay stable.",
    "answers": "A title has several physical copies, each with a barcode, and a member borrows a copy. A loan lasts 14 days, a member holds at most 2, and there are no renewals. Search is by title or author, part of a word, any case, and returns titles. A late return costs 25 cents a day, added to the member's fines when the copy comes back. A copy that is out, or a member at the limit, is an error. I pass today's date in. No reservations, fine payment, logins or threads for now.",
    "playback": ["Thanks, that's clear. **So: titles and copies kept apart, 14 days, 2 loans, a fine of 25 cents a day on return, and the date passed in.** Out of scope: reservations, paying fines, logins, notifications. I expect a reservation queue next."],

    "requirements": [
        ["Librarian adds a copy of a title.", "The system links the copy to its title by isbn", "A repeated barcode is an error"],
        ["User searches by title or author.", "The system returns matching titles, any case, part of a word"],
        ["Member borrows a copy.", "The system records the borrower and a due date 14 days out", "A copy already on loan, an unknown copy, or a member already at 2 loans is an error"],
        ["Member returns a copy.", "The system frees it and adds a fine of 25 cents per late day to the member", "A copy that is not on loan is an error; on time means no fine"],
    ],
    "out_of_scope": ["reservations (they will ask)", "paying fines", "logins and roles", "persistence and threads"],
    "req_hint": "Add a copy, search, borrow, return with a fine.",
    "req_say": "From your answers I get four requirements. **Each one is something a person does, and each becomes a method: add_copy, search, checkout, return_copy.** I say the error case beside each one, so the code handles it.",
    "req_why": "Each requirement maps to a method: 1 is add_copy, 2 is search, 3 is checkout, 4 is return_copy and _fine_for.",

    "entities": [("Book (a title)", True, "isbn, title and author, shared by all its copies; search works on it"),
                 ("Copy", True, "One physical copy with a barcode; it knows who has it and when it is due"),
                 ("Member", True, "Holds their current loans and the fines they owe"),
                 ("Library", True, "Runs add, search, checkout and return, and owns the rules"),
                 ("Loan", False, "Only a borrower and a due date; both live on the Copy"),
                 ("Librarian", False, "A caller of the same methods; not modelled")],
    "ent_hint": "Is a book one thing or two? What does a loan add that the copy doesn't already hold?",
    "ent_say": "I underline the nouns. **A title and a copy are two things, so Book and Copy both stay,** along with Member and Library. A loan is only a borrower and a due date, and both sit on the copy, so it is not a class. A librarian calls the same methods, so no class.",
    "ent_why": "Four classes. Dropping Loan keeps the borrower and due date on the copy, and the member's loans are a list of copies. Splitting title from copy is the move interviewers look for.",

    "classes": [
        {"name": "Library", "state": ["members: Map<id, Member>  # borrow gets a member id; a map finds them in one step",
                                      "books: Map<isbn, Book>  # add_copy links a copy to its title by isbn",
                                      "copies: Map<barcode, Copy>  # checkout and return get only a barcode",
                                      "LOAN_DAYS, MAX_LOANS, FINE_PER_DAY: constants  # the rules in one place"],
         "behaviour": ["add_copy(book, barcode) -> void | error  # req 1: a repeated barcode is an error",
                       "search(text) -> Book[]  # req 2: titles, any case, part of a word",
                       "checkout(member_id, barcode, today) -> due date | error  # req 3: 14 days, 2 loans max",
                       "return_copy(barcode, today) -> fine cents | error  # req 4: late days times 25 cents"]},
        {"name": "Book", "state": ["isbn: string  # the key that all copies of a title share",
                                   "title: string  # search matches on this",
                                   "author: string  # search matches on this too",
                                   "copies: Copy[]  # a title knows its physical copies"], "behaviour": []},
        {"name": "Copy", "state": ["barcode: string  # the key a borrower presents",
                                   "book: Book  # a copy points back to its title",
                                   "borrower: Member | None  # None means on the shelf; no separate flag",
                                   "due: date | None  # return compares today to this for the fine"], "behaviour": []},
        {"name": "Member", "state": ["member_id: string  # the key in the library's map",
                                     "name: string  # who the loans belong to",
                                     "loans: Copy[]  # its length is checked against the 2-loan limit",
                                     "fines: int  (cents)  # a late return adds to it"], "behaviour": []},
    ],
    "class_hint": "The library holds members, titles and copies by key. A copy knows its title, its borrower and its due date. A member holds loans and fines.",
    "class_say": "**I start from the four methods and ask what each one has to read.** Checkout and return get only a barcode, so the library keeps copies in a map by barcode. Checkout also gets a member id, so members are a map too, and the limit check needs the member's loans. Return needs the due date to price a late fine, so the copy stores its borrower and due date.",
    "class_why": "Maps by key make borrow and return one lookup. The rules (14 days, 2 loans, the fine) sit in the Library, so the data classes stay plain.",
    "class_qa": [{"ask": "Why is there no Loan class?",
                  "say": "A loan would hold a copy, a member and a due date, and the copy already holds the member and the due date. **A Loan class would be a second place to keep the same fact.** If a loan needed history or its own rules, it would earn a class.",
                  "explain": ["If they ask for loan history later, a Loan record appended on return is a small addition, not a redesign."]}],

    "map": {"center": ("Library", "borrow, return, search"),
            "owned": [("Book", "isbn, title, copies"), ("Copy", "borrower, due"), ("Member", "loans, fines")],
            "uses": [("Constants", "14 days, 2, 25 cents")]},

    "skeleton": {"q": "First the small classes: LibraryError, Book, Copy, Member, and the library's __init__. Each line from the class design.",
                 "hint": "Book, Copy and Member only store data. The library holds the members, titles and copies in maps by key, and the rules as constants.",
                 "code": HEAD + CLASSES + LIBRARY,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "add_copy", "q": "add_copy(book, barcode): core logic and edge cases as comments, then the code.",
         "hint": "Remember the title, make the copy, link both ways. Edge: barcode already used.", "code": ADD_COPY,
         "why": "The title keeps its copies list, so 'is a copy on the shelf' is a scan over a few copies."},
        {"name": "search", "q": "search(text): what does it return?",
         "hint": "Lower-case, match title or author, return titles.", "code": SEARCH,
         "why": "It returns titles, not copies, because that is what people look for."},
        {"name": "checkout", "q": "checkout(member_id, barcode, today): core logic, edge cases, code.",
         "hint": "Find both, check free and under the limit, record borrower and due, return the due date.", "code": CHECKOUT,
         "why": "Three specific errors, and the due date comes from the date passed in, so a run is repeatable."},
        {"name": "return_copy", "q": "return_copy(barcode, today): how is the fine worked out?",
         "hint": "Days late, never negative, times the rate; add to the member, free the copy.", "code": RETURN,
         "why": "max(0, ...) makes on time cost nothing. The fine rule is one helper, so changing it never touches this method."},
    ],
    "helpers": {"q": "Now the helper: _fine_for.",
                "starter": "def _fine_for(self, member, days_late):\n    ...\n",
                "hint": "Days late times a flat rate per day, in cents.",
                "code": HELPERS,
                "why": "It takes the member even though the core ignores it. That is the seam the per-member fine plugs into."},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Book is the title, Copy is one physical copy and its borrower, Member holds loans and fines, Library runs checkout and return_copy."),
            ("Open/closed", "A different fine is a change inside _fine_for alone. return_copy is not edited."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses."),
            ("Interface segregation", "Nothing to segregate yet: no interfaces. The notification callable has one call, on_hold_ready."),
            ("Dependency inversion", "Library is handed a notifier callable and today's date, and does not know if it is email, SMS or a log line."),
        ],
        "varies": [
            ("Fine by member kind", "Strategy, only if rules grow", "today a lookup by Kind inside _fine_for"),
            ("Tell the member a copy is ready", "Observer, only if several things react", "today one injected callable, on_hold_ready"),
            ("Queue for a title that is out", "No pattern: a field", "a queue on Book and a held_for on Copy"),
            ("Two desks at once", "No pattern: a lock", "check free and set borrower as one step under a lock"),
        ],
    },
    "extensions": [
        {"ask": "All copies of a title are out. Members should be able to queue for it.",
         "say": "The title gets a queue of member ids and each copy gets a held_for. **Returning a copy hands it to the first in line instead of the shelf.** Checkout refuses a held copy to anyone else. The queue is per title, because people want the title, not a specific copy.",
         "code": EXT_RESERVE, "code_title": "Reservations: a queue on Book, a hold on Copy",
         "short_q": "Reserve a title that is out", "short_a": "a queue on Book; a returned copy is held for the first in line; checkout respects the hold"},
        {"ask": "Tell the member when their copy is ready.",
         "say": "return_copy already knows who the copy is held for, so it calls a callable it was given. **The library doesn't know whether that is email, SMS or a log line.** A plain function is enough; I'd add an event system only if several things needed to react.",
         "code": EXT_NOTIFY, "code_title": "Notification: one callable",
         "short_q": "Notify when the copy is ready", "short_a": "the library calls an injected callable when it sets a hold; no event system"},
        {"ask": "Students pay a lower fine than adults.",
         "say": "Member gets a kind, and the rate becomes a lookup by kind. **Only _fine_for changes**; return_copy and every other method stay the same. The loan length stays a constant: a strategy for it would be speculation.",
         "code": EXT_FINE, "code_title": "Fine by member kind: one helper",
         "short_q": "Different fine per member", "short_a": "Member gets a kind; the rate becomes a lookup by kind; only _fine_for changes"},
        {"ask": "Two desks borrow the same copy at the same moment.",
         "say": "Check-free and set-borrower must happen together: one lock around checkout and return, or in a database a conditional update, set borrower where it is null, so only one wins.",
         "short_q": "Two desks at once", "short_a": "check and set the borrower as one step: a lock, or a conditional update"},
    ],
    "faq": [("A member loses a copy?", "A mark on the copy (lost) so it is never lent again, and a replacement fine on the member. Both are small additions to Copy and the fine helper."),
            ("A big catalogue?", "Search is a scan over titles. Index by word, or push it to a search store; the Library interface doesn't change.")],

    "summary": ["**Four classes.** The Library is the entry point: add a copy, search titles, borrow a copy for 14 days up to two at a time, and return it with a fine of 25 cents a day if late. A Book is the title, a Copy is one physical copy that knows its borrower and due date, and a Member holds their loans and fines. Today's date is passed in.",
                "**It grows in one place each time:** reservations add a queue on the title and a hold on the copy, a notification is one callable, and a different fine per member changes only _fine_for."],

    "golden": [
        ("A title and a copy are different things: the title is searched and reserved, the copy is borrowed.", "it is the first modelling call, and it is what makes reservations possible later."),
        ("The borrower and due date live on the Copy; there is no Loan class.", "one place for each fact, and four small classes carry the whole design."),
        ("Every rule sits in the Library: the loan length, the limit and the fine, and the fine is its own helper.", "a per-member fine changes one function and nothing else."),
        ("Today's date is a parameter, so the same input gives the same due date and fine.", "you can trace a demo by hand, and a test needs no fake clock."),
        ("Check-free and set-borrower happen as one step, or two desks can both borrow the same copy.", "it is the senior signal: the concurrency answer, not only the happy path."),
        ("No Librarian class, no LoanFactory, no Singleton for the library.", "nothing in the scope uses them."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with reservations and the per-member fine applied (the notification stays a one-callable sketch above), and a run at the bottom.",
    "final_title": "library.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "75 (Ann returns 3 days late at 25 cents); copy c1 is held for another member (Bob reserved it, so Cy is refused); 20 (Bob, a student, returns 2 days late at 10 cents); then Ann and Bob's fines, 75 20.",
}
