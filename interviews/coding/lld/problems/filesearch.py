"""File search, like Unix find. A drill: File and Directory form a small tree, FileSearcher.find walks it with an explicit stack,
and a Filter base class with concrete filters plus And, Or and Not answers 'does this file match?'. A new filter never edits find."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the searcher: the walk ----
FIND = method('''
    def find(self, root: Directory, condition: Filter) -> list[str]:
        """
        Core logic:
          1. Check the start is a folder
          2. Walk the tree, getting every file with its path
          3. Keep the path of each file the condition accepts
        Edge cases:
          1. Start is missing or is a file -> error
          2. Nothing matches -> an empty list
        """
        if not isinstance(root, Directory):                # Edge 1
            raise SearchError("the start must be a folder")
        found = []
        for path, file in self._walk(root):                # Step 2: the walk is the higher logic, written next
            if condition.matches(file):                    # Step 3: find knows only Filter, never a kind of filter
                found.append(path)
        return found
''')

WALK = method('''
    def _walk(self, root: Directory) -> list:
        """
        Core logic:
          1. Start a stack with the root folder and its path
          2. Pop one entry. A file is recorded with its path
          3. A folder pushes its children, each with its own path
          4. Stop when the stack is empty
        Edge cases:
          1. An empty folder pushes nothing
          2. Children are pushed in reverse name order, so they pop in name order and every run is the same
        """
        files = []
        stack = [(root.name, root)]                        # Step 1: a stack of (path, entry) instead of recursion
        while stack:                                       # Step 4
            path, entry = stack.pop()                      # Step 2
            if isinstance(entry, File):
                files.append((path, entry))
                continue
            children = sorted(entry.children, key=lambda c: c.name)   # Edge 2: a list has the order we gave it, so sort
            for child in reversed(children):               # Step 3: reversed, because the stack pops the last one first
                stack.append((path + "/" + child.name, child))
        return files
''')

# ---- the filters ----
FILTER_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. Answer one yes or no question about one file
        Edge cases:
          1. The base class has no question of its own -> error, so a forgotten override shows at once
        """
        raise NotImplementedError("each filter answers its own question")
''')

EXT_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. Compare the file's extension with ours
        Edge cases:
          1. Case and a leading dot are already cleaned in __init__, so "XML" and ".xml" both match xml files
        """
        return file.extension() == self.extension          # the file knows its own extension; the filter only compares
''')

AND_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. Ask each child filter about the file
          2. The first no ends it: the file does not match
          3. Every child said yes: it matches
        Edge cases:
          1. No children -> True, because nothing ruled the file out
          2. A child can be an And, Or or Not, so queries nest to any depth
        """
        for f in self.filters:
            if not f.matches(file):                        # Step 2: stop at the first no
                return False
        return True                                        # Step 3 and Edge 1
''')

OR_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. Ask each child filter about the file
          2. The first yes ends it: the file matches
          3. Every child said no: it does not match
        Edge cases:
          1. No children -> False, because nothing accepted the file
        """
        for f in self.filters:
            if f.matches(file):                            # Step 2: stop at the first yes
                return True
        return False                                       # Step 3 and Edge 1
''')

NOT_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. Flip the answer of the one filter we hold
        Edge cases:
          1. The inner filter can itself be a combination, so Not(And(a, b)) works
        """
        return not self.inner.matches(file)
''')

NAME_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. Is our text anywhere in the file's name, ignoring case
        Edge cases:
          1. Empty text -> matches every file, as "" is inside any name
        """
        return self.text in file.name.lower()              # text was lowercased in __init__
''')

MIN_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. The file is at least as big as our limit
        Edge cases:
          1. A file of exactly the limit matches: the check is >=
        """
        return file.size >= self.limit
''')

MAX_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. The file is no bigger than our limit
        Edge cases:
          1. A file of exactly the limit matches: the check is <=
        """
        return file.size <= self.limit
''')

HEAD = D('''\
    class SearchError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

FILE = D('''\


    class File:
        """A leaf in the tree: a name and a size in bytes."""

        def __init__(self, name: str, size: int):
            self.name = name            # the last part of the path; the extension comes from it
            self.size = size            # bytes; the size filters read it

        def extension(self) -> str:
            """The text after the last dot, lowercase. No dot, or only a leading dot: no extension."""
            dot = self.name.rfind(".")
            if dot <= 0:                # -1 is no dot; 0 is a name like .bashrc
                return ""
            return self.name[dot + 1:].lower()
    ''')

DIRECTORY = D('''\


    class Directory:
        """A folder: a name and the files and folders inside it. It nests, so it is a tree."""

        def __init__(self, name: str, children: list | None = None):
            self.name = name                                          # part of every path below it
            self.children = children if children is not None else []   # File and Directory objects mixed
    ''')

FILTER = D('''\


    class Filter:
        """One yes or no question about one file. Every condition, simple or combined, is a Filter."""
    ''')

EXT_F = D('''\


    class ExtensionFilter(Filter):
        def __init__(self, extension: str):
            self.extension = extension.lstrip(".").lower()   # ".XML" and "xml" mean the same thing
    ''')

NAME_F = D('''\


    class NameContainsFilter(Filter):
        def __init__(self, text: str):
            self.text = text.lower()                         # compared against a lowercased name
    ''')

MIN_F = D('''\


    class MinSizeFilter(Filter):
        def __init__(self, limit: int):
            self.limit = limit                               # bytes
    ''')

MAX_F = D('''\


    class MaxSizeFilter(Filter):
        def __init__(self, limit: int):
            self.limit = limit                               # bytes
    ''')

AND_F = D('''\


    class AndFilter(Filter):
        """Matches when every child filter matches."""

        def __init__(self, *filters: Filter):
            self.filters = list(filters)                     # children are Filters too, so these nest
    ''')

OR_F = D('''\


    class OrFilter(Filter):
        """Matches when any child filter matches."""

        def __init__(self, *filters: Filter):
            self.filters = list(filters)
    ''')

NOT_F = D('''\


    class NotFilter(Filter):
        """Matches when the filter it holds does not."""

        def __init__(self, inner: Filter):
            self.inner = inner
    ''')

SEARCHER = D('''\


    class FileSearcher:
        """The entry point: walks a tree and keeps the files a Filter accepts. It holds no state."""
    ''')

CORE = (HEAD + FILE + DIRECTORY
        + FILTER + in_class(FILTER_MATCHES)
        + EXT_F + in_class(EXT_MATCHES)
        + NAME_F + in_class(NAME_MATCHES)
        + MIN_F + in_class(MIN_MATCHES)
        + MAX_F + in_class(MAX_MATCHES)
        + AND_F + in_class(AND_MATCHES)
        + OR_F + in_class(OR_MATCHES)
        + NOT_F + in_class(NOT_MATCHES)
        + SEARCHER + in_class(FIND, WALK))

SKELETON = HEAD + FILE + DIRECTORY + FILTER + EXT_F + NAME_F + MIN_F + MAX_F + AND_F + OR_F + NOT_F + SEARCHER

DEMO = D('''\


    # ---- a quick run ----
    root = Directory("root", [
        File("readme.md", 1_200),
        File("build.xml", 300),
        Directory("docs", [File("guide.xml", 2_000), File("big.xml", 6_000_000), File("notes.TXT", 500)]),
        Directory("logs", [File("app.log", 9_000_000), File("old.log", 100)]),
        Directory("empty"),
    ])
    s = FileSearcher()
    print(s.find(root, ExtensionFilter("xml")))                                  # three xml files, in name order
    print(s.find(root, MinSizeFilter(5_000_000)))                                # anything from 5 MB up
    print(s.find(root, AndFilter(ExtensionFilter("xml"), MinSizeFilter(5_000_000))))   # both conditions
    print(s.find(root, NotFilter(ExtensionFilter("xml"))))                       # every file that is not xml
    print(s.find(root, OrFilter(NameContainsFilter("LOG"), MaxSizeFilter(500))))   # a log by name, or a small file
    print(s.find(root, ExtensionFilter("py")))                                   # nothing matches
    try:
        s.find(None, ExtensionFilter("xml"))
    except SearchError as e:
        print(e)
    ''')
DEMO_OUT = ("['root/build.xml', 'root/docs/big.xml', 'root/docs/guide.xml']\n"
            "['root/docs/big.xml', 'root/logs/app.log']\n"
            "['root/docs/big.xml']\n"
            "['root/docs/notes.TXT', 'root/logs/app.log', 'root/logs/old.log', 'root/readme.md']\n"
            "['root/build.xml', 'root/docs/notes.TXT', 'root/logs/app.log', 'root/logs/old.log']\n"
            "[]\n"
            "the start must be a folder\n")

# ---- extensions ----
EXT_NEW_FILTER = D('''\
    class File:
        def __init__(self, name: str, size: int, modified: int = 0):
            ...
            self.modified = modified     # days since some date; the one new field


    class ModifiedAfterFilter(Filter):   # a new kind of condition is a new class
        def __init__(self, day: int):
            self.day = day

        def matches(self, file: File) -> bool:
            return file.modified > self.day

    # FileSearcher.find, _walk and every other Filter: no edit
    ''')

EXT_STREAM = D('''\
    class FileSearcher:
        def find(self, root: Directory, condition: Filter):
            if not isinstance(root, Directory):
                raise SearchError("the start must be a folder")   # raised now, not on the first next()
            # a generator expression: nothing runs until the caller asks for the next path
            return (path for path, file in self._walk(root) if condition.matches(file))

        def _walk(self, root: Directory):
            ...
            if isinstance(entry, File):
                yield path, entry        # was files.append: one file out per request, no list kept
                continue
    ''')

EXT_HIDDEN = D('''\
    class FileSearcher:
        def _walk(self, root: Directory):
            ...
            path, entry, depth = stack.pop()
            ...
            if depth > 0 and entry.name.startswith("."):
                continue                 # a hidden folder is skipped with everything inside it
    ''')

EXT_DEPTH = D('''\
    class FileSearcher:
        def find(self, root: Directory, condition: Filter, max_depth: int | None = None):
            ...

        def _walk(self, root: Directory, max_depth: int | None = None):
            stack = [(root.name, root, 0)]           # each entry now carries its depth
            ...
            if max_depth is not None and depth > max_depth:
                continue                             # too deep: do not enter or push its children
            ...
                stack.append((path + "/" + child.name, child, depth + 1))
    ''')

# ---- the final file: core + new filter, generator, hidden folders, max depth ----
F_HEAD = "from collections.abc import Iterator\n\n\n" + HEAD

F_FILE = D('''\


    class File:
        """A leaf in the tree: a name, a size in bytes, and a day it was last changed."""

        def __init__(self, name: str, size: int, modified: int = 0):
            self.name = name
            self.size = size
            self.modified = modified    # days since some date; ModifiedAfterFilter reads it

        def extension(self) -> str:
            dot = self.name.rfind(".")
            if dot <= 0:
                return ""
            return self.name[dot + 1:].lower()
    ''')

MOD_F = D('''\


    class ModifiedAfterFilter(Filter):
        def __init__(self, day: int):
            self.day = day
    ''')

MOD_MATCHES = method('''
    def matches(self, file: File) -> bool:
        return file.modified > self.day
''')

F_FIND = method('''
    def find(self, root: Directory, condition: Filter, max_depth: int | None = None) -> Iterator[str]:
        """Same steps as before, but it hands back a generator. The error is still raised at once."""
        if not isinstance(root, Directory):
            raise SearchError("the start must be a folder")
        # a generator expression: no file is tested until the caller asks for the next path
        return (path for path, file in self._walk(root, max_depth) if condition.matches(file))
''')

F_WALK = method('''
    def _walk(self, root: Directory, max_depth: int | None = None) -> Iterator[tuple]:
        stack = [(root.name, root, 0)]                     # the third part is how many folders below the start
        while stack:
            path, entry, depth = stack.pop()
            if isinstance(entry, File):
                yield path, entry                          # one file out per request; no list is kept
                continue
            if max_depth is not None and depth > max_depth:    # too deep: skip this folder
                continue
            if depth > 0 and entry.name.startswith("."):   # hidden folder: skip it and everything inside
                continue
            children = sorted(entry.children, key=lambda c: c.name)
            for child in reversed(children):
                stack.append((path + "/" + child.name, child, depth + 1))
''')

FINAL = (F_HEAD + F_FILE + DIRECTORY
         + FILTER + in_class(FILTER_MATCHES)
         + EXT_F + in_class(EXT_MATCHES)
         + NAME_F + in_class(NAME_MATCHES)
         + MIN_F + in_class(MIN_MATCHES)
         + MAX_F + in_class(MAX_MATCHES)
         + MOD_F + in_class(MOD_MATCHES)
         + AND_F + in_class(AND_MATCHES)
         + OR_F + in_class(OR_MATCHES)
         + NOT_F + in_class(NOT_MATCHES)
         + SEARCHER + in_class(F_FIND, F_WALK))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    root = Directory("root", [
        File("a.xml", 100, modified=10),
        Directory(".git", [File("config.xml", 50, modified=90)]),
        Directory("src", [File("b.xml", 200, modified=80), Directory("deep", [File("c.xml", 300, modified=95)])]),
    ])
    s = FileSearcher()
    print(list(s.find(root, ExtensionFilter("xml"))))                    # .git is skipped
    print(list(s.find(root, ExtensionFilter("xml"), max_depth=0)))       # only files directly in root
    print(list(s.find(root, ExtensionFilter("xml"), max_depth=1)))       # one folder level below: not deep
    print(list(s.find(root, ModifiedAfterFilter(85))))                   # the new filter, find unchanged
    it = s.find(root, ExtensionFilter("xml"))
    print(next(it))                                                      # one result, the walk stopped after it
    try:
        s.find(File("x.xml", 1), ExtensionFilter("xml"))                 # an error now, before any next()
    except SearchError as e:
        print(e)
    ''')
FINAL_OUT = ("['root/a.xml', 'root/src/b.xml', 'root/src/deep/c.xml']\n"
             "['root/a.xml']\n"
             "['root/a.xml', 'root/src/b.xml']\n"
             "['root/src/deep/c.xml']\n"
             "root/a.xml\n"
             "the start must be a folder\n")


PROBLEM = {
    "id": "filesearch", "title": "File search, like Unix find", "part_id": "lld-filesearch", "n": 15,
    "part_title": "File search (find)", "minutes": 45,
    "lead": "A find round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The tree is small and built by hand. The question is the filters: a Filter base class, concrete filters, and And, Or and Not that combine them, so a new condition never edits find. Implementation starts with find, then the walk, then the filters.",
    "prompt": "Design an API to find files: all files over 5 MB, all XML files, and combinations of those.",
    "evidence": "PracHub (onsite, hard) and a Hello Interview community report; LeetCode posts from 2019 and a 2024 write-up. Long known as an Amazon favourite, but thin in 2024 to 2026 reports.",
    "drill": "part 15, File search.",

    "clarify": {
        "capabilities": [("Which conditions?", "Extension, name contains, minimum size and maximum size to start"),
                         ("Can conditions combine?", "Yes: and, or and not, nested to any depth"),
                         ("What does a search return?", "The path of each matching file, in name order")],
        "errors": [("The start is missing, or is a file?", "Error"),
                   ("Nothing matches?", "An empty result, not an error"),
                   ("Symlinks with cycles, or a folder you cannot read?", "Out of scope; say how you would stop a loop")],
        "scope": [("A real disk, or a tree already in memory?", "A tree in memory, built by hand in the demo"),
                  ("Huge trees?", "Return a list first; streaming is a follow-up"),
                  ("Case in names and extensions?", "Ignore case")],
    },
    "clarify_hint": "Which conditions and how they combine, what comes back. A missing start, no match, links. A real disk or memory, huge trees, case.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The one that shapes the design is whether conditions combine, because that decides whether a condition is a function or a class. Then the start and the empty result, and last memory or disk, since an in-memory tree lets me spend the time on the filters.",
    "clarify_why": "Combining conditions is the whole design: it is why Filter is a class with And, Or and Not beside the simple ones. The empty result being an empty list, not an error, is an edge to code. Asking about huge trees now lets me answer the generator follow-up calmly.",
    "answers": "Conditions are extension, name contains, minimum size and maximum size, and they combine with and, or, not to any depth. A search returns the paths of matching files in name order. A missing start or a start that is a file is an error; no match is an empty list. Symlinks and unreadable folders are out of scope. The tree is in memory. Return a list first. Ignore case.",
    "playback": ["Thanks, that's clear. **So: a tree of files and folders, a search that returns paths, and conditions that combine to any depth.** A new kind of condition must not change the search. Out of scope: a real disk, symlinks, permissions, file contents."],

    "requirements": [
        ["User gives a start folder and a condition.", "The system walks every folder below it and returns the paths of matching files, in name order", "Error if the start is not a folder; an empty list if nothing matches"],
        ["A condition tests one file: extension, name contains, minimum size, maximum size.", "Conditions combine with and, or and not, to any depth", "A new kind of condition is added without editing find"],
        ["Extension and name checks ignore case.", "ReadMe.MD matches the extension md and the text readme"],
    ],
    "out_of_scope": ["a real disk", "symlinks and cycles", "permissions", "searching file contents", "streaming (a follow-up)"],
    "req_hint": "A search with a start and a condition, the conditions themselves and how they combine, case.",
    "req_say": "From your answers I get three requirements. **The second is the design: a condition tests one file, conditions combine, and a new condition must not touch find.** That is why find is handed a Filter and only ever calls matches. Requirement 1 is the walk, requirement 3 is a detail inside the filters.",
    "req_why": "Requirement 1 is FileSearcher.find and its walk. Requirement 2 is the Filter base class, the concrete filters, and And, Or and Not. Requirement 3 lives inside File.extension and the filters' constructors.",

    "entities": [("User", False, "External; not modelled"),
                 ("File", True, "A name and a size; the extension comes from the name, so it answers extension() itself"),
                 ("Directory", True, "A name and its children; files and folders form a tree, so it nests"),
                 ("Filter", True, "One question about a file: matches(file). The type of condition changes the answer, so each kind is a class"),
                 ("And, Or, Not", True, "Combinations are Filters that hold Filters, so a query is a tree of the same class"),
                 ("FileSearcher", True, "The entry point: walks the tree and asks the filter about each file"),
                 ("Path", False, "A string built while walking; nothing asks it a question"),
                 ("Result list", False, "A plain list of strings")],
    "ent_hint": "What does a condition need so that two of them can be combined? Does a path need its own class?",
    "ent_say": "I underline the nouns. **File, Directory, Filter and the searcher stay, and And, Or and Not stay too, because combining is in the requirements.** A filter looks like a function, but a class lets a combination hold other filters, and lets a new kind be added without touching find. A path is a string and the result is a list.",
    "ent_why": "Filter earns its class because the conditions combine and grow. Three simple kinds plus three combinations is why the requirements already force it. Path and result list carry data only and nobody asks them anything.",

    "classes": [
        {"name": "FileSearcher", "state": [],
         "behaviour": ["find(root, condition) -> string[] | error  # req 1: the paths of matching files",
                       "_walk(root) -> (path, File)[]  # req 1: every file below root with its path"]},
        {"name": "File", "state": ["name: string  # the extension comes from it",
                                   "size: int  # bytes; size filters read it"],
         "behaviour": ["extension() -> string  # req 3: lowercase text after the last dot; ExtensionFilter asks the file"]},
        {"name": "Directory", "state": ["name: string  # part of every path below it",
                                        "children: Entry[]  # File and Directory, so the tree nests"],
         "behaviour": ["no methods  # the walk reads children; it is a record the walk asks nothing of"]},
        {"name": "Filter (base)", "state": [],
         "behaviour": ["matches(file) -> bool  # req 2: one yes or no question about one file"]},
        {"name": "ExtensionFilter, NameContainsFilter", "state": ["extension or text: string  # lowercased once, in the constructor"],
         "behaviour": ["matches(file) -> bool  # each kind answers its own question"]},
        {"name": "MinSizeFilter, MaxSizeFilter", "state": ["limit: int  # bytes"],
         "behaviour": ["matches(file) -> bool  # size >= limit, or size <= limit"]},
        {"name": "AndFilter, OrFilter", "state": ["filters: Filter[]  # the children; they can be combinations too"],
         "behaviour": ["matches(file) -> bool  # all children say yes, or any child says yes"]},
        {"name": "NotFilter", "state": ["inner: Filter  # the one filter it flips"],
         "behaviour": ["matches(file) -> bool  # not inner.matches(file)"]},
    ],
    "class_hint": "The searcher holds nothing. A folder holds children. A filter holds the one value it compares, or the filters it combines.",
    "class_say": "**I start from the methods and ask what each one has to read.** find has to walk a tree, so folders hold children and files hold a name and a size. Every condition answers matches(file) from its own value, a limit or an extension. And, Or and Not answer by asking the filters they hold, which is why they are Filters too.",
    "class_why": "The searcher holds no state, so one searcher can serve any number of trees. Behaviour sits with its data: File knows its extension, each filter knows its limit, and a combination knows its children.",
    "class_qa": [{"ask": "Why are And, Or and Not subclasses of Filter and not a list of filters passed to find?",
                  "say": "Because then they nest. **A combination that is itself a Filter can sit inside another combination,** so not(and(xml, big)) needs nothing extra. find still sees one Filter and calls matches once per file."},
                 {"ask": "Why is Directory a class with no methods?",
                  "say": "It is a record: a name and children. **The walk reads it, and nobody asks a folder a question,** so it stays that small. If I needed total size, that would be a method on it."}],

    "map": {"center": ("FileSearcher", "find, _walk"),
            "owned": [("Directory", "name, children"), ("File", "name, size")],
            "uses": [("Filter (base)", "matches(file)"), ("Ext, Name, Size", "one class each"), ("And, Or, Not", "hold Filters")],
            "links": [(0, "contains")]},

    "skeleton": {"q": "First the small pieces: the error, File, Directory, the Filter base class, every filter's constructor, and the searcher class.",
                 "hint": "File has a name, a size and extension(). Directory has a name and children. Each filter holds the one value it compares; And and Or hold a list, Not holds one filter.",
                 "code": SKELETON,
                 "why": "These come straight from the - state lines. The filters have no matches yet: writing them first means each method after only has to do its steps."},
    "methods": [
        {"name": "find", "q": "Start with the most interesting method: find(root, condition). Core logic and edge cases as comments, then the code. Name the walk as a helper.",
         "hint": "Check the start is a folder, walk to get every file with its path, keep the path when condition.matches(file).", "code": FIND,
         "why": "find knows only Filter and calls matches. That is why a new condition never edits it. The walk is the higher logic, so it gets a name here and its own box next."},
        {"name": "_walk", "q": "_walk(root): visit every file below the start with an explicit stack, and build each path.",
         "hint": "Stack of (path, entry). Pop one. A file is recorded; a folder pushes its children in reverse name order.", "code": WALK,
         "why": "A stack holds the work still to do, so a deep tree cannot overflow the call stack. Pushing in reverse order makes the output come out in name order."},
        {"name": "Filter.matches", "q": "The Filter base class: matches(file).",
         "hint": "One question about one file. The base class has no question of its own.", "code": FILTER_MATCHES,
         "why": "It is the contract every filter and combination keeps. Raising in the base means a subclass that forgets to override fails loudly."},
        {"name": "ExtensionFilter.matches", "q": "One concrete filter: ExtensionFilter.matches(file).",
         "hint": "Compare the file's extension with the one this filter holds.", "code": EXT_MATCHES,
         "why": "One line, because the file knows its own extension. The other simple filters are the same shape."},
        {"name": "AndFilter.matches", "q": "The combination: AndFilter.matches(file). Ask each child.",
         "hint": "Loop over the children. The first no returns False. If none said no, True.", "code": AND_MATCHES,
         "why": "Children are Filters, so each could be an Or or a Not. The loop never cares. Or and Not are the same idea turned around."},
    ],
    "helpers": [
        {"q": "OrFilter.matches(file): the mirror of And.",
         "hint": "The first yes returns True. If none said yes, False.", "code": OR_MATCHES,
         "why": "An empty Or matches nothing and an empty And matches everything, which is the usual logic for empty sets."},
        {"q": "NotFilter.matches(file): flip the one filter it holds.",
         "hint": "not inner.matches(file).", "code": NOT_MATCHES,
         "why": "One line, and it works on a combination too."},
        {"q": "NameContainsFilter.matches(file).",
         "hint": "Our lowercased text is somewhere in the lowercased name.", "code": NAME_MATCHES,
         "why": "The constructor lowercased the text once, so only the file name is lowercased per file."},
        {"q": "MinSizeFilter.matches(file).",
         "hint": "size >= limit.", "code": MIN_MATCHES,
         "why": "The boundary is included: a file of exactly 5 MB matches 'at least 5 MB'."},
        {"q": "MaxSizeFilter.matches(file).",
         "hint": "size <= limit.", "code": MAX_MATCHES,
         "why": "The mirror of the minimum. A range is an And of the two."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "File and Directory hold the tree, a Filter answers one question, FileSearcher walks and collects."),
            ("Open/closed", "A new condition is a new Filter class. find, _walk and the existing filters are not edited."),
            ("Liskov substitution", "Every filter and every combination works wherever a Filter does: matches(file) returns a bool."),
            ("Interface segregation", "Filter has one method. The searcher is not forced to know about size or extension."),
            ("Dependency inversion", "find is handed a Filter, so it depends on the idea of a condition and not on any kind."),
        ],
        "varies": [
            ("New conditions (owner, modified time)", "Strategy", "each is a new Filter class; find does not change"),
            ("Combined queries (and, or, not)", "Composite", "And, Or and Not are Filters that hold Filters"),
            ("Files inside folders", "Composite, in the data", "Directory holds File and Directory; the walk uses a stack"),
            ("Huge trees, deep trees, hidden folders", "No pattern: a generator and a check", "yield matches; skip a folder in _walk"),
        ],
    },
    "extensions": [
        {"ask": "Add a new condition: files changed in the last week.",
         "say": "A File gets a modified field and there is one new Filter class. **find, _walk and every other filter stay exactly as they are,** which is the point of handing find a Filter.",
         "code": EXT_NEW_FILTER, "code_title": "A new filter",
         "short_q": "New condition", "short_a": "a new Filter class (plus a File field); find untouched"},
        {"ask": "The tree is huge. Don't wait for the whole walk.",
         "say": "Make the walk a generator: yield each file instead of appending to a list, and find returns a generator expression over it. **Results start at once and no list of files is kept,** and a caller who wants only the first stops early. I keep the folder check in find so the error is raised at the call, not on the first next().",
         "code": EXT_STREAM, "code_title": "Stream the results",
         "short_q": "Huge trees", "short_a": "_walk yields; find returns a generator expression; check the start eagerly"},
        {"ask": "Skip hidden folders.",
         "say": "One check in the walk when a folder is popped: if its name starts with a dot and it is not the start, continue. **Skipping it also skips everything inside,** because its children are never pushed.",
         "code": EXT_HIDDEN, "code_title": "Skip hidden folders",
         "short_q": "Hidden folders", "short_a": "in _walk, continue on a folder named .x; its children are never pushed"},
        {"ask": "Limit how deep the search goes.",
         "say": "The stack carries a depth with each entry, and a folder deeper than max_depth is skipped. **Depth is state of the walk, not of the filters,** so only _walk and find's signature change.",
         "code": EXT_DEPTH, "code_title": "Max depth",
         "short_q": "Max depth", "short_a": "the stack entry carries a depth; skip a folder past max_depth"},
    ],
    "faq": [("Why a stack and not recursion?", "Both work. Recursion is shorter, but a very deep tree can overflow the call stack. A stack of (path, entry) makes the order explicit, so it is easy to trace and to turn into a generator."),
            ("Why does find take a Filter and not a lambda?", "A lambda works for the simple cases, and Python allows it. A class lets And, Or and Not be built, printed and tested, and it names each condition. A lambda is a fine answer to say aloud as well."),
            ("What about os.walk and fnmatch?", "Both are the real tools in Python. Here the tree is in memory and the filters are the question, so I write the walk and the matching myself and mention the stdlib after."),
            ("Symlinks that point back up?", "Keep a set of the real paths already visited and skip any folder seen twice. Without it a loop never ends.")],

    "summary": ["**One searcher, a small tree, and a Filter class.** FileSearcher.find checks the start, walks every folder with a stack of (path, entry), and keeps the path of each file a Filter accepts. File knows its extension. Each simple filter answers matches(file) from one value, and And, Or and Not are Filters that hold Filters, so any query is a tree of the same class.",
                "**It extends in one place each time:** a new condition is a new Filter class, streaming is a yield in the walk, hidden folders and max depth are checks in the walk. find only ever calls matches."],

    "apart": [
        "**A filter is one question about one file.** Combining filters is a filter that holds filters: And, Or, Not.",
        "**find is handed a filter and only calls matches.** A new condition is a new class; find never changes.",
        "**And stops at the first no, Or at the first yes, Not flips.**",
        "**Walk with an explicit stack, and yield as you go** for a tree too big to hold."
    ],
    "golden": [
        ("A filter is one question about one file; combining filters is a filter that holds filters.", "any query is built from the same two ideas, so find never changes."),
        ("find is handed a Filter and only calls matches.", "a new condition is a new class, and nothing already written is edited."),
        ("And stops at the first no, Or at the first yes, Not flips.", "short-circuit is the whole logic, and an empty And is true while an empty Or is false."),
        ("Walk with an explicit stack of (path, entry); push children in reverse name order.", "a deep tree cannot overflow, and the output is in name order every run."),
        ("File answers extension() itself.", "behaviour sits with its data, so ExtensionFilter is one line."),
        ("To stream, yield in the walk and return a generator from find.", "results start at once and memory stays flat; check the start folder eagerly."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with all four extensions applied (a modified-time filter, streaming results, hidden folders skipped, a max depth), and a run at the bottom.",
    "final_title": "filesearch.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the hidden .git folder never appears; max_depth 0 keeps only the root's own file; the new filter finds files changed after day 85; next() returns one path; a non-folder start fails at the call.",
}
