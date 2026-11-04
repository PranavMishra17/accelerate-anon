"""Library management. A drill, same shape as locker.py. Dates are passed in (`today`), so the demo is stable.
Core: Book (a title), Copy (one physical copy), Member, Loan (copy, member, due date: it prices its own lateness), Library.
Reservations and the per-member fine arrive as extensions."""
import textwrap

D = textwrap.dedent


def method(src):
    """Dedent a method written at class level; the page shows it like this, and CORE indents it back."""
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the library: the two things people do at the desk ----
CHECKOUT = method('''
    def checkout(self, member_id: str, barcode: str, today: date) -> date:
        """
        Core logic:
          1. Find the member and the copy
          2. Check the copy is free and the member is under the loan limit
          3. Open a Loan: this copy, this member, due in 14 days
          4. Hang the loan on both the copy and the member, return the due date
        Edge cases:
          1. Unknown member or barcode -> error
          2. Copy already on loan -> error
          3. Member already holds the maximum -> error
        """
        member = self._get_member(member_id)               # Step 1 / Edge 1: the helpers raise if unknown
        copy = self._get_copy(barcode)
        if copy.is_on_loan():                              # Edge 2: a loan on the copy means it is out
            raise LibraryError(f"copy {barcode} is on loan")
        if len(member.loans) >= self.MAX_LOANS:            # Edge 3: open loans are the count
            raise LibraryError("loan limit reached")
        loan = Loan(copy, member, today + timedelta(days=self.LOAN_DAYS))   # Step 3: the date is passed in
        copy.loan = loan                                   # Step 4: the copy remembers its loan...
        member.loans.append(loan)                          # ...and the member remembers it, for the limit check
        return loan.due
''')

RETURN = method('''
    def return_copy(self, barcode: str, today: date) -> int:
        """
        Core logic:
          1. Find the copy and its open loan
          2. Ask the loan for the fine, at this member's rate
          3. Add the fine to the member and close the loan on both sides
          4. Return the fine in cents
        Edge cases:
          1. Unknown barcode, or the copy is not on loan -> error
          2. Returned on or before the due date -> fine 0 (inside Loan.days_late)
        """
        copy = self._get_copy(barcode)                     # Step 1
        if not copy.is_on_loan():                          # Edge 1: already on the shelf
            raise LibraryError(f"copy {barcode} is not on loan")
        loan = copy.loan                                   # the loan knows its member, so no member id is needed
        fine = loan.fine(today, self._rate_for(loan.member))   # Step 2: Loan does the date maths, the library picks the rate
        loan.member.fines += fine                          # Step 3: fines add up on the member
        loan.member.loans.remove(loan)                     # the loan ends on both sides
        copy.loan = None                                   # back on the shelf
        return fine                                        # Step 4
''')

# ---- the loan: its own lateness ----
DAYS_LATE = method('''
    def days_late(self, today: date) -> int:
        """
        Core logic:
          1. Whole days between the due date and today
          2. Never negative
        Edge cases:
          1. Returned early or on the due day -> 0
        """
        return max(0, (today - self.due).days)             # Step 1: timedelta.days; max(0, ...) is Edge 1
''')

FINE = method('''
    def fine(self, today: date, rate_per_day: int) -> int:
        """Cents owed: late days times the rate. The rate is passed in, so the loan never learns about member kinds."""
        return self.days_late(today) * rate_per_day
''')

# ---- the library: the rest ----
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

HELPERS = method('''
    def _get_member(self, member_id: str) -> Member:
        if member_id not in self.members:
            raise LibraryError(f"unknown member {member_id}")
        return self.members[member_id]

    def _get_copy(self, barcode: str) -> Copy:
        if barcode not in self.copies:
            raise LibraryError(f"unknown copy {barcode}")
        return self.copies[barcode]

    def _rate_for(self, member: Member) -> int:
        """Cents per late day. The member is unused today; it is here so a per-member rate changes this helper only."""
        return self.FINE_PER_DAY
''')

HEAD = D('''\
    from datetime import date, timedelta


    class LibraryError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

BOOK = D('''\


    class Book:
        """A title, shared by all its copies. The library searches it; it remembers its copies."""

        def __init__(self, isbn: str, title: str, author: str):
            self.isbn = isbn             # the key every copy of this title shares
            self.title = title           # search matches on this
            self.author = author         # and on this
            self.copies = []             # list of Copy: the title knows its physical copies
    ''')

COPY = D('''\


    class Copy:
        """One physical copy. It knows its title and its open loan, and says whether it is out."""

        def __init__(self, barcode: str, book: Book):
            self.barcode = barcode       # the key a borrower presents at the desk
            self.book = book             # points back to the title
            self.loan = None             # the open Loan, or None when on the shelf; no separate on-loan flag

        def is_on_loan(self) -> bool:
            return self.loan is not None   # checkout and return both ask the copy, not its fields
    ''')

MEMBER = D('''\


    class Member:
        """A person who borrows. The library checks the limit against loans and adds the fines."""

        def __init__(self, member_id: str, name: str):
            self.member_id = member_id   # the key in the library's members map
            self.name = name
            self.loans = []              # list of open Loan; its length is checked against the loan limit
            self.fines = 0               # cents; a late return adds to it
    ''')

LOAN_INIT = D('''\


    class Loan:
        """One borrowing: a copy, a member and a due date. It knows how late it is, so the library does no date maths."""

        def __init__(self, copy: Copy, member: Member, due: date):
            self.copy = copy             # what was lent
            self.member = member         # who has it; return needs no member id
            self.due = due               # return compares today to it for the fine
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

CORE = (HEAD + BOOK + COPY + MEMBER + LOAN_INIT + in_class(DAYS_LATE, FINE) + LIBRARY
        + in_class(CHECKOUT, RETURN, ADD_COPY, SEARCH, HELPERS))

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
    print(lib.return_copy("c2", today + timedelta(days=10)))   # early, so days_late is 0 and there is no fine
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
            if any(not c.is_on_loan() and c.held_for is None for c in book.copies):
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

        def _rate_for(self, member: Member) -> int:
            return self.FINE_PER_DAY[member.kind]              # the member argument finally earns its place


    # Member gets one more field: self.kind = kind. return_copy and Loan.fine do not change.
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

FINAL_BOOK = D('''\


    class Book:
        """A title, shared by all its copies. The library searches it; it remembers its copies."""

        def __init__(self, isbn: str, title: str, author: str):
            self.isbn = isbn
            self.title = title
            self.author = author
            self.copies = []                 # the title knows its physical copies
            self.waiting = deque()           # member ids, first in line first; popleft is O(1)
    ''')

FINAL_COPY = D('''\


    class Copy:
        """One physical copy. It knows its title and its open loan, and says whether it is out."""

        def __init__(self, barcode: str, book: Book):
            self.barcode = barcode
            self.book = book
            self.loan = None                 # None means on the shelf
            self.held_for = None             # member id the copy is kept for; None when nobody is waiting

        def is_on_loan(self) -> bool:
            return self.loan is not None
    ''')

FINAL_MEMBER = D('''\


    class Member:
        """A person who borrows. The library checks the limit against loans and adds the fines."""

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
        member = self._get_member(member_id)
        copy = self._get_copy(barcode)
        if copy.is_on_loan():
            raise LibraryError(f"copy {barcode} is on loan")
        # new check: a held copy goes only to the member it is held for; None means not held
        if copy.held_for not in (None, member_id):
            raise LibraryError(f"copy {barcode} is held for another member")
        if len(member.loans) >= self.MAX_LOANS:
            raise LibraryError("loan limit reached")
        copy.held_for = None                               # the holder borrowed it, so the hold is used up
        loan = Loan(copy, member, today + timedelta(days=self.LOAN_DAYS))
        copy.loan = loan
        member.loans.append(loan)
        return loan.due
''')

FINAL_RETURN = method('''
    def return_copy(self, barcode: str, today: date) -> int:
        copy = self._get_copy(barcode)
        if not copy.is_on_loan():
            raise LibraryError(f"copy {barcode} is not on loan")
        loan = copy.loan
        fine = loan.fine(today, self._rate_for(loan.member))   # days late never negative, inside Loan
        loan.member.fines += fine
        loan.member.loans.remove(loan)
        copy.loan = None
        if copy.book.waiting:                              # new last step: someone is queued for this title
            copy.held_for = copy.book.waiting.popleft()    # first in line gets the copy, not the shelf
        return fine
''')

RESERVE = method('''
    def reserve(self, member_id: str, isbn: str) -> None:
        book = self.books[isbn]                            # the queue is per title, not per copy
        # a copy that is neither lent nor held is free to borrow, so there is nothing to queue for
        if any(not c.is_on_loan() and c.held_for is None for c in book.copies):
            raise LibraryError("a copy is on the shelf; borrow it")
        book.waiting.append(member_id)                     # join the back of the line
''')

FINAL_HELPERS = HELPERS.replace(
    '''def _rate_for(self, member: Member) -> int:
    """Cents per late day. The member is unused today; it is here so a per-member rate changes this helper only."""
    return self.FINE_PER_DAY
''',
    '''def _rate_for(self, member: Member) -> int:
    return self.FINE_PER_DAY[member.kind]              # rate looked up by the member's kind
''')

FINAL = (FINAL_HEAD + FINAL_BOOK + FINAL_COPY + FINAL_MEMBER + LOAN_INIT + in_class(DAYS_LATE, FINE) + FINAL_LIBRARY
         + in_class(FINAL_CHECKOUT, FINAL_RETURN, RESERVE, ADD_COPY, SEARCH, FINAL_HELPERS))
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
    "lead": "A full library round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. A title and its copies are different things, and a loan is a thing too: it owns the due date and the lateness. Dates are passed in, so fines can be traced by hand.",
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
    "clarify_why": "A title and its copies give two classes. The due date and the late fine give a Loan. The limit and the rate give constants and the one place they live. Passing the date in keeps the demo stable.",
    "answers": "A title has several physical copies, each with a barcode, and a member borrows a copy. A loan lasts 14 days, a member holds at most 2, and there are no renewals. Search is by title or author, part of a word, any case, and returns titles. A late return costs 25 cents a day, added to the member's fines when the copy comes back. A copy that is out, or a member at the limit, is an error. I pass today's date in. No reservations, fine payment, logins or threads for now.",
    "playback": ["Thanks, that's clear. **So: titles and copies kept apart, a loan with a due date 14 days out, 2 loans per member, a fine of 25 cents a day on return, and the date passed in.** Out of scope: reservations, paying fines, logins, notifications. I expect a reservation queue next."],

    "requirements": [
        ["Librarian adds a copy of a title.", "The system links the copy to its title by isbn", "A repeated barcode is an error"],
        ["User searches by title or author.", "The system returns matching titles, any case, part of a word"],
        ["Member borrows a copy.", "The system opens a loan with a due date 14 days out", "A copy already on loan, an unknown copy, or a member already at 2 loans is an error"],
        ["Member returns a copy.", "The system closes the loan and adds a fine of 25 cents per late day to the member", "A copy that is not on loan is an error; on time means no fine"],
    ],
    "out_of_scope": ["reservations (they will ask)", "paying fines", "logins and roles", "persistence and threads"],
    "req_hint": "Add a copy, search, borrow, return with a fine.",
    "req_say": "From your answers I get four requirements. **Each one is something a person does, and each becomes a method: add_copy, search, checkout, return_copy.** I say the error case beside each one, so the code handles it.",
    "req_why": "Each requirement maps to a method: 1 is add_copy, 2 is search, 3 is checkout, 4 is return_copy with Loan.fine.",

    "entities": [("Book (a title)", True, "isbn, title and author, shared by all its copies; search works on it"),
                 ("Copy", True, "One physical copy with a barcode; it knows its open loan, or None on the shelf"),
                 ("Member", True, "Holds their open loans and the fines they owe"),
                 ("Loan", True, "A copy, a member and a due date; the due date gives days late, so it earns a class"),
                 ("Library", True, "Runs add, search, checkout and return, and owns the rules"),
                 ("Librarian", False, "A caller of the same methods; not modelled")],
    "ent_hint": "Is a book one thing or two? What does a loan add that the copy doesn't already hold? Who works out how late it is?",
    "ent_say": "I underline the nouns. **A title and a copy are two things, so Book and Copy both stay, and so does Loan.** A loan looks like only a borrower and a due date, but the due date is what gives days late, so the loan answers that question and the library doesn't do date maths. A librarian calls the same methods, so no class.",
    "ent_why": "Five classes. Loan keeps the due date next to the rule that reads it (days late). Splitting title from copy is the move interviewers look for.",

    "classes": [
        {"name": "Library", "state": ["members: Map<id, Member>  # checkout gets a member id; a map finds them in one step",
                                      "books: Map<isbn, Book>  # add_copy links a copy to its title by isbn",
                                      "copies: Map<barcode, Copy>  # checkout and return get only a barcode",
                                      "LOAN_DAYS, MAX_LOANS, FINE_PER_DAY: constants  # the rules in one place"],
         "behaviour": ["checkout(member_id, barcode, today) -> due date | error  # req 3: opens a Loan, 2 loans max",
                       "return_copy(barcode, today) -> fine cents | error  # req 4: closes the loan, asks it for the fine",
                       "add_copy(book, barcode) -> void | error  # req 1: a repeated barcode is an error",
                       "search(text) -> Book[]  # req 2: titles, any case, part of a word",
                       "_rate_for(member) -> cents  # the one place a per-member rate would go"]},
        {"name": "Loan", "state": ["copy: Copy  # what was lent",
                                   "member: Member  # who has it, so return needs no member id",
                                   "due: date  # the date days late is measured from"],
         "behaviour": ["days_late(today) -> int  # never negative",
                       "fine(today, rate_per_day) -> cents  # days late times the rate"]},
        {"name": "Copy", "state": ["barcode: string  # the key a borrower presents",
                                   "book: Book  # a copy points back to its title",
                                   "loan: Loan | None  # None means on the shelf; no separate flag"],
         "behaviour": ["is_on_loan() -> bool  # checkout and return ask the copy"]},
        {"name": "Member", "state": ["member_id: string  # the key in the library's map",
                                     "name: string  # who the loans belong to",
                                     "loans: Loan[]  # its length is checked against the 2-loan limit",
                                     "fines: int  (cents)  # a late return adds to it"], "behaviour": []},
        {"name": "Book", "state": ["isbn: string  # the key that all copies of a title share",
                                   "title: string  # search matches on this",
                                   "author: string  # search matches on this too",
                                   "copies: Copy[]  # a title knows its physical copies"], "behaviour": []},
    ],
    "class_hint": "The library holds members, titles and copies by key. A loan holds a copy, a member and a due date, and knows its days late. A copy knows its title and its loan. A member holds loans and fines.",
    "class_say": "**I start from the methods and ask what each one has to read.** Checkout and return get only a barcode, so the library keeps copies in a map by barcode. Checkout also gets a member id, so members are a map too, and the limit check needs the member's loans. Return needs the due date to price a late fine, and that belongs to a Loan that holds the copy, the member and the date.",
    "class_why": "Maps by key make borrow and return one lookup. The rules (14 days, 2 loans, the rate) sit in the Library; the date maths sits in Loan, next to the due date it reads.",
    "class_qa": [{"ask": "Why a Loan class and not a borrower and a due date on the Copy?",
                  "say": "Because the due date has a rule attached: how many days late, and what that costs. **Putting the rule next to the date makes the library only orchestrate.** It also gives loan history a place to grow, and a copy on the shelf is a copy with no loan.",
                  "explain": ["If they ask for loan history later, a closed Loan appended to the member on return is a small addition, not a redesign."]}],

    "map": {"center": ("Library", "checkout, return_copy"),
            "owned": [("Loan", "copy, member, due"), ("Copy", "loan, is_on_loan"), ("Member", "loans, fines"), ("Book", "isbn, title, copies")],
            "uses": [("Constants", "14 days, 2, 25 cents")]},

    "skeleton": {"q": "First the small pieces: LibraryError, Book, Copy, Member, Loan's __init__ and the library's __init__. Each line from the class design.",
                 "hint": "Book and Member store data. Copy holds its title and its loan and says if it is out. Loan holds a copy, a member and a due date. The library holds the members, titles and copies in maps by key, and the rules as constants.",
                 "code": HEAD + BOOK + COPY + MEMBER + LOAN_INIT + LIBRARY,
                 "why": "These come straight from the - state lines. Loan's two methods are the next boxes, since the late rule is the interesting part."},
    "methods": [
        {"name": "checkout", "q": "Start with the most interesting method: checkout(member_id, barcode, today). Core logic and edge cases as comments, then the code. Name the lookups as helpers.",
         "hint": "Find both with helpers, check free and under the limit, open a Loan, hang it on the copy and the member, return the due date.", "code": CHECKOUT,
         "why": "Three specific errors, and the due date comes from the date passed in, so a run is repeatable. The loan is the new object that records the whole fact."},
        {"name": "return_copy", "q": "return_copy(barcode, today): who works out the fine, and who picks the rate?",
         "hint": "Get the copy and its loan, loan.fine(today, rate), add to the member, close the loan on both sides.", "code": RETURN,
         "why": "The loan does the date maths, the library only picks the rate, so a per-member rate never touches Loan. The loan knows its member, so return needs only a barcode."},
        {"name": "Loan.days_late", "q": "Now the rule that earned Loan its class: Loan.days_late(today).",
         "hint": "Whole days between the due date and today, never below zero.", "code": DAYS_LATE,
         "why": "max(0, ...) makes on time cost nothing. The date maths lives next to the due date, in one place."},
        {"name": "Loan.fine", "q": "Loan.fine(today, rate_per_day): what does it return?",
         "hint": "Days late times the rate, in cents.", "code": FINE,
         "why": "The rate is passed in, so Loan never learns about member kinds. That is the seam the per-member fine plugs into."},
        {"name": "add_copy", "q": "add_copy(book, barcode): core logic and edge cases as comments, then the code.",
         "hint": "Remember the title, make the copy, link both ways. Edge: barcode already used.", "code": ADD_COPY,
         "why": "The title keeps its copies list, so 'is a copy on the shelf' is a scan over a few copies."},
        {"name": "search", "q": "search(text): what does it return?",
         "hint": "Lower-case, match title or author, return titles.", "code": SEARCH,
         "why": "It returns titles, not copies, because that is what people look for."},
    ],
    "helpers": {"q": "Last, the plain helpers: _get_member, _get_copy and _rate_for.",
                "starter": "def _get_member(self, member_id):\n    ...\n",
                "hint": "Two lookups that raise on an unknown key. A rate helper that returns cents per day for a member.",
                "code": HELPERS,
                "why": "_rate_for takes the member even though the core ignores it. That is the seam the per-member fine plugs into."},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Book is the title, Copy is one physical copy, Loan is one borrowing and its lateness, Member holds loans and fines, Library runs checkout and return_copy."),
            ("Open/closed", "A different fine is a change inside _rate_for alone. return_copy and Loan.fine are not edited."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses."),
            ("Interface segregation", "Nothing to segregate yet: no interfaces. The notification callable has one call, on_hold_ready."),
            ("Dependency inversion", "Library is handed a notifier callable and today's date, and does not know if it is email, SMS or a log line."),
        ],
        "varies": [
            ("Fine by member kind", "Strategy, only if rules grow", "today a lookup by Kind inside _rate_for"),
            ("Tell the member a copy is ready", "Observer, only if several things react", "today one injected callable, on_hold_ready"),
            ("Queue for a title that is out", "No pattern: a field", "a queue on Book and a held_for on Copy"),
            ("Two desks at once", "No pattern: a lock", "check free and open the loan as one step under a lock"),
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
         "say": "Member gets a kind, and the rate becomes a lookup by kind. **Only _rate_for changes**; return_copy and Loan.fine stay the same, because the loan is handed the rate. The loan length stays a constant: a strategy for it would be speculation.",
         "code": EXT_FINE, "code_title": "Fine by member kind: one helper",
         "short_q": "Different fine per member", "short_a": "Member gets a kind; the rate becomes a lookup by kind; only _rate_for changes"},
        {"ask": "Two desks borrow the same copy at the same moment.",
         "say": "Check-free and open-the-loan must happen together: one lock around checkout and return, or in a database a conditional update, set the loan where it is null, so only one wins.",
         "short_q": "Two desks at once", "short_a": "check and open the loan as one step: a lock, or a conditional update"},
    ],
    "faq": [("A member loses a copy?", "A mark on the copy (lost) so it is never lent again, and a replacement fine on the member. Both are small additions to Copy and Loan."),
            ("A big catalogue?", "Search is a scan over titles. Index by word, or push it to a search store; the Library interface doesn't change."),
            ("Why does Loan.fine take the rate and not look at the member?", "So the loan stays about dates. Who pays what is a library rule, and it lives in one helper, _rate_for.")],

    "summary": ["**Five classes.** The Library is the entry point: add a copy, search titles, borrow a copy for 14 days up to two at a time, and return it with a fine of 25 cents a day if late. A Book is the title, a Copy is one physical copy that knows its open loan, a Loan holds the copy, the member and the due date and works out its own days late, and a Member holds their loans and fines. Today's date is passed in.",
                "**It grows in one place each time:** reservations add a queue on the title and a hold on the copy, a notification is one callable, and a different fine per member changes only _rate_for."],

    "apart": [
        "**A title and a copy are different things.** The title is searched and reserved; a copy is what you borrow.",
        "**A loan is a class:** a copy, a member and a due date, and it answers days late. The fine follows from it.",
        "**Today's date is a parameter,** so the same input always gives the same due date and the same fine.",
        "**Check the copy is free and open the loan as one step,** or two desks can lend the same copy."
    ],
    "golden": [
        ("A title and a copy are different things: the title is searched and reserved, the copy is borrowed.", "it is the first modelling call, and it is what makes reservations possible later."),
        ("Loan is a class: a copy, a member and a due date, and it answers days_late.", "the rule sits next to the date it reads, so the library only orchestrates, and loan history has a home."),
        ("Every rule sits in the Library: the loan length, the limit and the rate, and the rate is its own helper.", "a per-member fine changes one function and nothing else."),
        ("Today's date is a parameter, so the same input gives the same due date and fine.", "you can trace a demo by hand, and a test needs no fake clock."),
        ("Check-free and open-the-loan happen as one step, or two desks can both borrow the same copy.", "it is the senior signal: the concurrency answer, not only the happy path."),
        ("No Librarian class, no LoanFactory, no Singleton for the library.", "nothing in the scope uses them."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with reservations and the per-member fine applied (the notification stays a one-callable sketch above), and a run at the bottom.",
    "final_title": "library.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "75 (Ann returns 3 days late at 25 cents); copy c1 is held for another member (Bob reserved it, so Cy is refused); 20 (Bob, a student, returns 2 days late at 10 cents); then Ann and Bob's fines, 75 20.",
}
