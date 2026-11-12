"""File system and find, one round. No requirements are given for the file system, so asking is the test; then the
interviewer asks for a find API. Entry, File, Directory and FileSystem are the tree; Filter, its conditions and
And, Or, Not are the search. Delete, move, an explicit-stack walk and a new condition are extensions."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the file system: paths ----
MKDIR = method('''
    def mkdir(self, path: str) -> None:
        """
        Core logic:
          1. Split the path into names
          2. Walk down from the root, making each missing folder
          3. Stop with an error if a name on the way is a file
        Edge cases:
          1. Path not absolute -> error
          2. The folder already exists -> nothing happens
        """
        node = self.root                                   # every absolute path starts at the root
        for name in self._parts(path):                     # Step 1: Edge 1 is raised inside _parts
            child = node.children.get(name)                # .get gives None when the name is new
            if child is None:
                child = Directory(name)                    # Step 2: make the missing folder
                node.children[name] = child                # and hang it under its parent
            if not isinstance(child, Directory):           # Step 3: a file is in the way
                raise FsError(f"not a folder: {name}")
            node = child                                   # Edge 2: an existing folder is walked through
''')

ADD_FILE = method('''
    def add_file(self, path: str, nbytes: int) -> None:
        """
        Core logic:
          1. Find the folder the file goes in, and its name
          2. Put a File with that size in the folder
        Edge cases:
          1. Folder missing, or the name is taken -> error
          2. Negative size -> error
        """
        if nbytes < 0:                                     # Edge 2: checked first, before anything changes
            raise FsError("size cannot be negative")
        parent, name = self._split(path)                   # Step 1: Edge 1 (missing folder) is raised inside _split
        if name in parent.children:                        # Edge 1: the name is taken
            raise FsError(f"already exists: {path}")
        parent.children[name] = File(name, nbytes)         # Step 2: stored under its name, the way lookups find it
''')

LS = method('''
    def ls(self, path: str = "/") -> list:
        """
        Core logic:
          1. Resolve the path to an entry
          2. A folder gives its sorted child names; a file gives its own name
        Edge cases:
          1. Path does not exist -> error
        """
        node = self._resolve(path)                         # Step 1: Edge 1 is raised inside _resolve
        if isinstance(node, Directory):
            return sorted(node.children)                   # Step 2: sorted, so the output is the same every run
        return [node.name]                                 # a file lists as itself, like Unix ls
''')

SIZE_OF = method('''
    def size_of(self, path: str) -> int:
        """
        Core logic:
          1. Resolve the path to an entry
          2. Ask it for its size (a folder adds up what is inside)
        Edge cases:
          1. Path does not exist -> error
        """
        # Step 1 and 2: a File returns its bytes, a Directory adds up its children; no type check here
        return self._resolve(path).size()
''')

RESOLVE = method('''
    def _resolve(self, path: str) -> Entry:
        """
        Core logic:
          1. Split the path into names
          2. Start at the root and step into the child with each name
          3. Return the entry the last name points at
        Edge cases:
          1. A name is missing -> error
          2. A name on the way is a file, so it has no children -> error
        """
        node = self.root                                   # every absolute path starts at the root
        for name in self._parts(path):                     # Step 1
            # Edge 2: a file has no children, so "not a Directory" also means the path goes through a file
            if not isinstance(node, Directory) or name not in node.children:
                raise FsError(f"no such path: {path}")     # Edge 1
            node = node.children[name]                     # Step 2: one step down per name
        return node                                        # Step 3
''')

HELPERS = method('''
    def _parts(self, path: str) -> list:
        """The one place a path string is split: names between slashes, or an error if not absolute."""
        if not path.startswith("/"):
            raise FsError(f"path must be absolute: {path}")
        return [p for p in path.split("/") if p]           # drops empty names, so "/a//b/" is ["a", "b"]

    def _normal(self, path: str) -> str:
        return "/" + "/".join(self._parts(path))           # a clean path: "/" for the root, no trailing slash

    def _split(self, path: str):
        """The folder that holds this path, and the last name in it."""
        parts = self._parts(path)
        if not parts:                                      # "/" has no last name and no parent
            raise FsError("the root cannot be used here")
        parent = self._resolve("/" + "/".join(parts[:-1]))     # everything but the last name
        if not isinstance(parent, Directory):
            raise FsError(f"not a folder: {path}")
        return parent, parts[-1]                           # the folder, and the name inside it
''')

# ---- the tree: size and walk ----
DIR_SIZE = method('''
    def size(self) -> int:
        """
        Core logic:
          1. Start a total at zero
          2. Add each child's size; a child folder adds up its own children the same way
          3. Return the total
        Edge cases:
          1. An empty folder -> 0
        """
        total = 0                                          # Edge 1: no children leaves this at 0
        for child in self.children.values():               # Step 2: File.size is its bytes, Directory.size recurses
            total += child.size()
        return total
''')

DIR_WALK = method('''
    def walk(self, path: str):
        """
        Core logic:
          1. Yield this folder with its path
          2. For each child in name order, walk it with the path extended by its name
        Edge cases:
          1. The root path "/" must not produce "//docs"
        """
        yield path, self                                   # Step 1: a generator, one entry at a time, never a whole list
        for name in sorted(self.children):                 # sorted, so the order is the same every run
            child_path = path.rstrip("/") + "/" + name     # Edge 1: rstrip drops the slash the root already has
            yield from self.children[name].walk(child_path)   # Step 2: the child yields itself, then what is below it
''')

# ---- find and the filters ----
FIND = method('''
    def find(self, path: str, condition: Filter) -> list:
        """
        Core logic:
          1. Resolve the start path
          2. Walk everything under it
          3. Keep the path of each file the condition accepts
        Edge cases:
          1. Start path does not exist -> error
          2. Nothing matches -> an empty list
        """
        found = []                                         # Edge 2: stays empty when nothing matches
        # Step 1 and 2: walk yields (full path, entry) for everything under the start; Edge 1 is raised in _resolve
        for p, entry in self._resolve(path).walk(self._normal(path)):
            if not isinstance(entry, File):                # folders are walked through, never returned
                continue
            if condition.matches(entry):                   # Step 3: find knows only Filter, never a kind of filter
                found.append(p)
        return found
''')

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
          1. Case and a leading dot are cleaned in __init__, so "XML" and ".xml" both match xml files
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
        return file.size() >= self.limit
''')

MAX_MATCHES = method('''
    def matches(self, file: File) -> bool:
        """
        Core logic:
          1. The file is no bigger than our limit
        Edge cases:
          1. A file of exactly the limit matches: the check is <=
        """
        return file.size() <= self.limit
''')

# ---- the classes ----
HEAD = D('''\
    class FsError(Exception):     # one error type the caller can catch for every refusal
        pass


    class Entry:
        """A file or a folder. Both answer size() and walk(), so callers need not tell them apart.
        It holds a name and the shared defaults; it is not a place to keep contents or children."""
        def __init__(self, name: str):
            self.name = name             # the key its parent stores it under

        def size(self) -> int:
            raise NotImplementedError    # each kind answers for itself

        def walk(self, path: str):
            yield path, self             # a file is a leaf: only itself; Directory adds what is below
    ''')

FILE = D('''\


    class File(Entry):
        """A leaf. A name and a size, no contents; it never holds other entries."""
        def __init__(self, name: str, nbytes: int):
            super().__init__(name)
            self.nbytes = nbytes         # the size in bytes; the contents are out of scope

        def size(self) -> int:
            return self.nbytes

        def extension(self) -> str:
            """The text after the last dot, lowercase. No dot, or only a leading dot: no extension."""
            dot = self.name.rfind(".")
            if dot <= 0:                 # -1 is no dot; 0 is a name like .bashrc
                return ""
            return self.name[dot + 1:].lower()
    ''')

DIRECTORY = D('''\


    class Directory(Entry):
        """A folder. It holds children by name and adds them up; path rules live in FileSystem."""
        def __init__(self, name: str):
            super().__init__(name)
            self.children = {}               # name -> Entry; a dict, so a lookup by name is one step
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

FS = D('''\


    class FileSystem:
        def __init__(self):
            self.root = Directory("")        # the top folder; its name is empty because "/" is its path
    ''')

FILTERS_FULL = (FILTER + in_class(FILTER_MATCHES) + EXT_F + in_class(EXT_MATCHES) + NAME_F + in_class(NAME_MATCHES)
                + MIN_F + in_class(MIN_MATCHES) + MAX_F + in_class(MAX_MATCHES) + AND_F + in_class(AND_MATCHES)
                + OR_F + in_class(OR_MATCHES) + NOT_F + in_class(NOT_MATCHES))

CORE = (HEAD + FILE + DIRECTORY + in_class(DIR_SIZE, DIR_WALK) + FILTERS_FULL + FS
        + in_class(FIND, SIZE_OF, RESOLVE, MKDIR, ADD_FILE, LS, HELPERS))

SKELETON = HEAD + FILE + DIRECTORY + FILTER + EXT_F + NAME_F + MIN_F + MAX_F + AND_F + OR_F + NOT_F + FS

HELPERS_FILTERS = (OR_F + in_class(OR_MATCHES) + NOT_F + in_class(NOT_MATCHES) + NAME_F + in_class(NAME_MATCHES)
                   + MIN_F + in_class(MIN_MATCHES) + MAX_F + in_class(MAX_MATCHES))

DEMO = D('''\


    # ---- a quick run ----
    fs = FileSystem()
    fs.mkdir("/docs/notes")                      # makes /docs on the way, then notes
    fs.mkdir("/logs")
    fs.add_file("/docs/notes/todo.txt", 120)
    fs.add_file("/docs/notes/ideas.txt", 80)
    fs.add_file("/docs/report.pdf", 5000)
    fs.add_file("/docs/spec.xml", 2000)
    fs.add_file("/docs/big.xml", 6_000_000)
    fs.add_file("/logs/app.log", 9_000_000)
    print(fs.ls("/docs"), fs.size_of("/docs"))   # 120 + 80 + 5000 + 2000 + 6,000,000
    print(fs.find("/", ExtensionFilter("xml")))                                   # all XML files
    print(fs.find("/", MinSizeFilter(5_000_000)))                                 # all files from 5 MB up
    print(fs.find("/", AndFilter(ExtensionFilter("xml"), MinSizeFilter(5_000_000))))   # both conditions
    print(fs.find("/docs", NotFilter(OrFilter(ExtensionFilter("xml"), ExtensionFilter("txt")))))   # neither
    # each of these hits one edge case: name taken, no such path, a file in the way
    for bad in (lambda: fs.add_file("/docs/report.pdf", 1), lambda: fs.ls("/nope"), lambda: fs.mkdir("/docs/report.pdf/x")):
        try:
            bad()
        except FsError as e:
            print(e)
    ''')
DEMO_OUT = ("['big.xml', 'notes', 'report.pdf', 'spec.xml'] 6007200\n"
            "['/docs/big.xml', '/docs/spec.xml']\n"
            "['/docs/big.xml', '/logs/app.log']\n"
            "['/docs/big.xml']\n"
            "['/docs/report.pdf']\n"
            "already exists: /docs/report.pdf\nno such path: /nope\nnot a folder: report.pdf\n")

# ---- extensions ----
STACK_WALK = method('''
    def walk(self, path: str):
        """The same order as before, with a stack of (path, entry) the code owns, so depth is not limited."""
        stack = [(path, self)]
        while stack:
            p, entry = stack.pop()
            yield p, entry                                 # each entry is yielded as it is popped
            if isinstance(entry, Directory):
                # pushed in reverse name order, so the stack pops them in name order
                for name in sorted(entry.children, reverse=True):
                    stack.append((p.rstrip("/") + "/" + name, entry.children[name]))
''')

EXT_STACK = D('''\
    class Directory(Entry):
        ...
''') + in_class(STACK_WALK) + "\n    # find, the filters and every other method: no edit\n"

# a chain 3000 folders deep: the recursive walk would hit Python's limit of about 1000 calls
STACK_RUN = (CORE.replace(textwrap.indent(DIR_WALK, "    "), textwrap.indent(STACK_WALK, "    "))
             + D('''\


    fs = FileSystem()
    node = fs.root
    for _ in range(3000):                        # built by hand: mkdir with 3000 names would work too
        child = Directory("d")
        node.children["d"] = child
        node = child
    node.children["x.txt"] = File("x.txt", 1)
    found = fs.find("/", ExtensionFilter("txt"))
    print(len(found), found[0].count("/"))
    '''))
STACK_RUN_OUT = "1 3001\n"

DELETE = method('''
    def delete(self, path: str) -> None:
        """A file, or a folder with everything in it."""
        parent, name = self._split(path)                   # the same helper add_file uses
        if name not in parent.children:
            raise FsError(f"no such path: {path}")
        del parent.children[name]                          # a folder takes its whole subtree with it
''')

MOVE = method('''
    def move(self, src: str, dst_folder: str) -> None:
        """Detach the entry from its folder and attach it to another, under the same name."""
        parent, name = self._split(src)
        if name not in parent.children:
            raise FsError(f"no such path: {src}")
        target = self._resolve(dst_folder)
        if not isinstance(target, Directory):
            raise FsError(f"not a folder: {dst_folder}")
        if name in target.children:                        # would overwrite something
            raise FsError(f"already exists: {dst_folder}/{name}")
        # the trailing "/" makes "/a/b" not count as inside "/a/bc"; a folder can't go under itself
        if (self._normal(dst_folder) + "/").startswith(self._normal(src) + "/"):
            raise FsError("cannot move a folder into itself")
        target.children[name] = parent.children.pop(name)  # pop and attach last, after every check has passed
''')

EXT_MODIFIED = D('''\
    class File(Entry):
        def __init__(self, name: str, nbytes: int, modified: int = 0):
            ...
            self.modified = modified     # days since some date; the one new field


    class ModifiedAfterFilter(Filter):   # a new kind of condition is a new class
        def __init__(self, day: int):
            self.day = day

        def matches(self, file: File) -> bool:
            return file.modified > self.day

    # FileSystem.find, the walk and every other Filter: no edit
    ''')

# ---- the final file: core + stack walk + delete and move + a modified-time filter ----
FILE_F = D('''\


    class File(Entry):
        """A leaf. A name, a size and the day it was last changed; no contents."""
        def __init__(self, name: str, nbytes: int, modified: int = 0):
            super().__init__(name)
            self.nbytes = nbytes
            self.modified = modified     # days since some date; ModifiedAfterFilter reads it

        def size(self) -> int:
            return self.nbytes

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

FINAL = (HEAD + FILE_F + DIRECTORY + in_class(DIR_SIZE, STACK_WALK) + FILTERS_FULL + MOD_F + in_class(MOD_MATCHES) + FS
         + in_class(FIND, SIZE_OF, RESOLVE, MKDIR, ADD_FILE, LS, DELETE, MOVE, HELPERS))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    fs = FileSystem()
    fs.mkdir("/docs/notes")
    fs.mkdir("/tmp")
    fs.add_file("/docs/notes/todo.txt", 120)
    fs.add_file("/docs/notes/ideas.txt", 80)
    fs.add_file("/docs/report.pdf", 5000)
    fs.add_file("/docs/spec.xml", 2000)
    print(fs.find("/", OrFilter(ExtensionFilter("txt"), MinSizeFilter(5000))))   # a combined query
    print(fs.find("/docs", NotFilter(NameContainsFilter("RE"))))   # case is ignored
    fs.move("/docs/notes/todo.txt", "/tmp")      # /docs loses 120 bytes
    print(fs.ls("/tmp"), fs.size_of("/docs"))    # 7200 - 120 = 7080
    fs.delete("/docs/notes")                     # takes ideas.txt with it
    print(fs.ls("/docs"))
    try:
        fs.move("/docs", "/docs")                # the trap: a folder into itself
    except FsError as e:
        print(e)
    ''')
FINAL_OUT = ("['/docs/notes/ideas.txt', '/docs/notes/todo.txt', '/docs/report.pdf']\n"
             "['/docs/notes/ideas.txt', '/docs/notes/todo.txt', '/docs/spec.xml']\n"
             "['todo.txt'] 7080\n['report.pdf', 'spec.xml']\ncannot move a folder into itself\n")

PROBLEM = {
    "id": "filesystem", "title": "File system and find", "part_id": "lld-files", "n": 3,
    "part_title": "File system and find", "minutes": 50,
    "lead": "One round with two asks. First a file system with no requirements given, so asking is the test; then a find API for files by size, extension and combinations. A full round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design, e) implementation, f) extensibility. Files and folders are one kind of entry (a Composite). find takes a Filter, and And, Or and Not combine filters, so a new condition never edits find. Try each box before you open the answer.",
    "prompt": "Design a file management system. Once it exists: add a find API, so I can get all files over 5 MB, all XML files, and combinations of those.",
    "opening": "Sounds good. **That's the whole prompt for the file system, so I'll ask before I design: what the system must do, how it handles errors, and where the scope stops.** Then I'll write requirements, pull out the entities, design the classes and implement the main methods, with find as the part I spend the most time on.",
    "evidence": "A 2026 candidate report: the interviewer gave only the one-line file system prompt and the questions were the test. The find API is a long-known Amazon favourite (PracHub onsite, hard; a Hello Interview community report; LeetCode posts from 2019 and a 2024 write-up), thin in 2024 to 2026 reports. Amazon reports probe the Filter family, so it is part of the core design.",
    "drill": "part 2, File system and find.",

    "clarify": {
        "capabilities": [("What can a user do?", "Make folders, add a file with a size, list a folder, ask the size of something, and find files"),
                         ("How are things addressed, and what does a file hold?", "By absolute path from a root, such as /docs/notes/todo.txt. A file is a name and a size, not the contents"),
                         ("Which conditions can find use?", "Extension, name contains, minimum size and maximum size to start"),
                         ("Can conditions combine?", "Yes: and, or and not, nested to any depth")],
        "errors": [("Make a folder that already exists?", "Fine, nothing happens. An error only if a file is in the way"),
                   ("Add a file whose name is taken?", "Error"),
                   ("List, size or search a path that does not exist?", "Error"),
                   ("Nothing matches a search?", "An empty list, not an error")],
        "scope": [("A real disk, or a model in memory?", "In memory"),
                  ("Delete and move?", "Later, if there is time"),
                  ("Huge or very deep trees, symlinks?", "Return a list first; deep trees and links are follow-ups"),
                  ("Several users, permissions, two things at once?", "One user, one thread, no permissions")],
    },
    "clarify_hint": "What a user does, how a thing is addressed, what a file holds, which conditions find has and whether they combine. Folder exists, name taken, bad path, no match. A real disk, delete and move, huge trees, users.",
    "clarify_say": "**I group my questions in three buckets: what it must do, what goes wrong, where scope stops.** The prompt is one line, so I start with what a user does, how things are addressed and what a file holds. The one that shapes the design is whether conditions combine, because that decides whether a condition is a function or a class. Then a folder that exists, a taken name, a bad path and an empty result. Last, real disk, delete and move, and huge trees.",
    "clarify_why": "With no requirements given, the questions are the answer. Paths give a resolve step, a size and no contents give a tiny File, and combining conditions is the whole find design: it is why Filter is a class with And, Or and Not beside the simple ones. 'Delete and move later' tells you where the design must stay open.",
    "answers": "Make folders, add a file with a size, list a folder, ask the size of something, and find files. Things are addressed by absolute path. A file is a name and a size. Find conditions are extension, name contains, minimum size and maximum size, and they combine with and, or, not to any depth. Making a folder that exists does nothing, unless a file is in the way. A taken name, or a path that does not exist, is an error; no match is an empty list. In memory, one user, one thread, no permissions. Delete and move are for later if there is time, and so are huge or deep trees.",
    "playback": ["Thanks, that's clear. **So: an in-memory tree addressed by absolute path, files with a name and a size, a folder's size is what is inside it, and find takes a condition that can combine with and, or, not.** A new kind of condition must not change find. Out of scope are contents, real disks, links, users and threads."],

    "requirements": [
        ["User makes folders and adds files by absolute path.", "The system makes the missing folders on the way; a file needs its folder to exist", "Error if the path is not absolute, the name is taken, or a file is in the way"],
        ["User lists a folder.", "Returns the child names, sorted", "Error if the path does not exist"],
        ["User asks the size of a file or a folder.", "A folder's size is the total of everything inside it"],
        ["User finds files under a path with a condition.", "Returns the full path of each matching file, in name order", "Error if the start path does not exist; an empty list if nothing matches"],
        ["A condition tests one file: extension, name contains, minimum size, maximum size.", "Conditions combine with and, or and not, to any depth; extension and name checks ignore case", "A new kind of condition is added without editing find"],
    ],
    "out_of_scope": ["file contents", "a real disk", "delete and move (extensions)", "symlinks", "users and permissions", "threads"],
    "req_hint": "Make folders and files, list, size, find. Then the conditions and how they combine. Each with its error.",
    "req_say": "From your answers I get five requirements. **The first four are things a user does, and each becomes a method; the fifth is the design: a condition tests one file, conditions combine, and a new condition must not touch find.** That is why find is handed a Filter and only ever calls matches. I say the error case with each so I don't forget it in the code.",
    "req_why": "Requirements 1 to 4 are methods: mkdir and add_file, ls, size_of, find. Requirement 3 points at a Composite. Requirement 5 is the Filter base class, the concrete filters, and And, Or and Not.",

    "entities": [("User", False, "External actor; not modelled"),
                 ("Path", False, "A string; the file system turns it into an entry"),
                 ("File", True, "A name and a size; the extension comes from the name, so it answers extension() itself"),
                 ("Directory", True, "A name and its children, by name"),
                 ("Entry", True, "The shared base: size() and walk() work on a file or a folder, so callers need no type checks"),
                 ("FileSystem", True, "Holds the root, turns a path into an entry and runs find"),
                 ("Filter", True, "One question about a file: matches(file). The type of condition changes the answer, so each kind is a class"),
                 ("And, Or, Not", True, "Combinations are Filters that hold Filters, so a query is a tree of the same class"),
                 ("File contents", False, "Only the size matters here"),
                 ("Result list", False, "A plain list of strings")],
    "ent_hint": "Which nouns carry data or a rule the design needs? Is a path an object? What does a condition need so that two can be combined?",
    "ent_say": "I underline the nouns. **File and directory carry data I need, and a shared Entry base lets size and walk work on either.** A filter looks like a function, but a class lets a combination hold other filters, and lets a new kind be added without touching find, so Filter and And, Or and Not stay. A path is only a string and the result is a list.",
    "ent_why": "Entry, File, Directory and FileSystem make the tree. Filter earns its class because the conditions combine and grow: three simple kinds plus three combinations is what the requirements already force. Path and result list carry data only and nobody asks them anything.",

    "classes": [
        {"name": "FileSystem", "state": ["root: Directory  # every absolute path starts here"],
         "behaviour": ["mkdir(path) -> void | error  # req 1: make folders on the way",
                       "add_file(path, nbytes) -> void | error  # req 1: put a file in its folder",
                       "ls(path) -> names | error  # req 2: the child names, sorted",
                       "size_of(path) -> int | error  # req 3: file or folder size",
                       "find(path, condition) -> paths | error  # req 4: walk, and keep what the condition accepts"]},
        {"name": "Entry", "state": ["name: string  # the key its parent stores it under"],
         "behaviour": ["size() -> int  # req 3: file or folder, no type check",
                       "walk(path) -> (path, entry) pairs  # req 4: find visits both kinds alike"]},
        {"name": "File (is an Entry)", "state": ["nbytes: int  # a file is a name and a size, no contents"],
         "behaviour": ["size() -> nbytes  # req 3: a file knows its own size",
                       "extension() -> string  # req 5: lowercase text after the last dot; ExtensionFilter asks the file"]},
        {"name": "Directory (is an Entry)", "state": ["children: Map<name, Entry>  # lookup by name; a taken name is an error"],
         "behaviour": ["size() -> sum of the children  # req 3: a folder is what is inside it",
                       "walk(path) -> itself, then everything below  # req 4: find needs every path"]},
        {"name": "Filter (base)", "state": [],
         "behaviour": ["matches(file) -> bool  # req 5: one yes or no question about one file"]},
        {"name": "ExtensionFilter, NameContainsFilter", "state": ["extension or text: string  # lowercased once, in the constructor"],
         "behaviour": ["matches(file) -> bool  # each kind answers its own question"]},
        {"name": "MinSizeFilter, MaxSizeFilter", "state": ["limit: int  # bytes"],
         "behaviour": ["matches(file) -> bool  # size >= limit, or size <= limit"]},
        {"name": "AndFilter, OrFilter", "state": ["filters: Filter[]  # the children; they can be combinations too"],
         "behaviour": ["matches(file) -> bool  # all children say yes, or any child says yes"]},
        {"name": "NotFilter", "state": ["inner: Filter  # the one filter it flips"],
         "behaviour": ["matches(file) -> bool  # not inner.matches(file)"]},
    ],
    "class_hint": "FileSystem holds the root. File and Directory share a base with size and walk. A directory holds children by name. A filter holds the one value it compares, or the filters it combines.",
    "class_say": "**I start from the methods the requirements gave me, then ask what each one has to read.** Every method gets a path, so the file system holds a root and walks down from it. A folder's size is what is inside it, and find visits every entry, so both kinds answer size and walk. A folder looks a child up by name, so it holds a map by name. Every condition answers matches(file) from its own value, a limit or an extension, and And, Or and Not answer by asking the filters they hold, which is why they are Filters too.",
    "class_why": "The base class is the only extra idea in the tree: because both kinds answer size() and walk(), a folder's size and find need no isinstance checks. Behaviour sits with its data: File knows its extension, each filter knows its limit, and a combination knows its children.",
    "class_qa": [{"ask": "Why make File and Directory share a base? Two plain classes would work.",
                  "say": "Because a folder holds both, and a folder's size has to add up whatever is inside it. **If both answer size() and walk(), the folder never asks which kind a child is.** That's the Composite pattern, and I only need it because requirement 3 says a folder has a size.",
                  "explain": ["Without it, size and find each need an isinstance check on every child, and a third kind of entry means touching both."]},
                 {"ask": "Why are And, Or and Not subclasses of Filter and not a list of filters passed to find?",
                  "say": "Because then they nest. **A combination that is itself a Filter can sit inside another combination,** so not(and(xml, big)) needs nothing extra. find still sees one Filter and calls matches once per file.",
                  "explain": ["A lambda also works for simple cases. A class lets And, Or and Not be built, printed and tested, and it names each condition."]}],

    "map": {"center": ("FileSystem", "mkdir, ls, find"),
            "owned": [("Directory", "children by name"), ("File", "name, nbytes")],
            "uses": [("Entry (base)", "size(), walk()"), ("Filter (base)", "matches(file)"), ("Ext, Name, Size", "one class each"), ("And, Or, Not", "hold Filters")],
            "links": [(0, "contains")]},

    "skeleton": {"q": "First the small pieces: FsError, Entry, File, Directory's fields, the Filter base class, every filter's constructor, and the file system's __init__.",
                 "hint": "Entry holds a name and the shared size and walk. File adds a size and extension(). Directory holds children by name. Each filter holds the one value it compares; And and Or hold a list, Not holds one filter.",
                 "code": SKELETON,
                 "why": "These come straight from the - state lines. The filters have no matches yet: writing them first means each method after only has to do its steps."},
    "methods": [
        {"name": "find", "q": "Start with the most interesting method: find(path, condition). Core logic and edge cases as comments, then the code. Name the walk.",
         "hint": "Resolve the start, walk everything under it, keep the path of each file the condition accepts. Edges: no such path, no match.", "code": FIND,
         "why": "find knows only Filter and calls matches, so a new condition never edits it. Walking the tree is the hard part, so it is a call to walk, written next. Only files are returned."},
        {"name": "Directory.walk", "q": "Directory.walk(path): how does a folder yield everything below it?",
         "hint": "Yield itself, then walk each child in name order with the path extended.", "code": DIR_WALK,
         "why": "A generator, so the tree is never built as a list. Sorted children make every run the same. The root path needs rstrip so it does not make //docs."},
        {"name": "AndFilter.matches", "q": "The combination: AndFilter.matches(file). Ask each child.",
         "hint": "Loop over the children. The first no returns False. If none said no, True.", "code": AND_MATCHES,
         "why": "Children are Filters, so each could be an Or or a Not. The loop never cares. Or and Not are the same idea turned around."},
        {"name": "ExtensionFilter.matches", "q": "One concrete filter: ExtensionFilter.matches(file).",
         "hint": "Compare the file's extension with the one this filter holds.", "code": EXT_MATCHES,
         "why": "One line, because the file knows its own extension. The other simple filters are the same shape."},
        {"name": "size_of", "q": "size_of(path): where does the adding up happen?",
         "hint": "Resolve, then call size() on the entry.", "code": SIZE_OF,
         "why": "One line, because Directory.size() already adds up its children. That is the payoff of the shared base."},
        {"name": "Directory.size", "q": "Directory.size(): a folder is what is inside it. Write the adding up.",
         "hint": "A total, plus each child's size. A child folder does the same.", "code": DIR_SIZE,
         "why": "The recursion hides in child.size(): a File returns bytes, a Directory calls this method. No isinstance check."},
        {"name": "_resolve", "q": "_resolve(path): turn a path into an entry.",
         "hint": "Start at the root, step into the child with each name. Edges: missing name, a file in the way.", "code": RESOLVE,
         "why": "Every method but mkdir goes through it, so path errors are raised in one place."},
        {"name": "mkdir", "q": "mkdir(path): core logic and edge cases as comments, then the code.",
         "hint": "Split into names, walk down, make what is missing. Edges: relative path, a file in the way.", "code": MKDIR,
         "why": "_parts is named but not written yet. Making a folder that exists is not an error, as agreed."},
        {"name": "add_file", "q": "add_file(path, nbytes): core logic, edge cases, code.",
         "hint": "Find the folder and the name, then put a File there. Edges: folder missing, name taken, negative size.", "code": ADD_FILE,
         "why": "_split gives the folder and the last name, so add_file and later delete and move share it."},
        {"name": "ls", "q": "ls(path): what does a folder give, and a file?",
         "hint": "Resolve; a folder gives sorted names. Edge: no such path.", "code": LS,
         "why": "Listing a file returns its own name, like Unix ls. Say that you chose it."},
    ],
    "helpers": [
        {"q": "The other filters: Or, Not, name contains, minimum size, maximum size.",
         "hint": "Or: the first yes returns True. Not: flip the one filter it holds. Name: our lowercased text is in the lowercased name. Min is >=, max is <=.",
         "code": HELPERS_FILTERS,
         "why": "An empty Or matches nothing and an empty And matches everything, the usual logic for empty sets. The size boundaries are included: a file of exactly 5 MB matches 'at least 5 MB'. A range is an And of the two."},
        {"q": "Now the path helpers: _parts, _normal, _split.",
         "starter": "def _parts(self, path):\n    ...\n",
         "hint": "Split on slashes and drop empty names. _normal rebuilds a clean path. _split resolves everything but the last name.",
         "code": HELPERS,
         "why": "Every path rule lives in _parts, _resolve and these. If paths later gain '..' or relative forms, only _parts changes."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "File and Directory know their own size, FileSystem turns a path into an entry, a Filter answers one question, and _parts, _resolve and _split hold every path rule."),
            ("Open/closed", "A new condition is a new Filter class handed to find. find, the walk and the existing filters are not edited."),
            ("Liskov substitution", "File and Directory both work wherever an Entry does, and every filter and combination works wherever a Filter does."),
            ("Interface segregation", "Entry has two methods, size and walk. Filter has one, matches. Nothing wider to split."),
            ("Dependency inversion", "find depends on the Filter base, not on a concrete extension or size rule."),
        ],
        "varies": [
            ("File and folder behave alike", "Composite", "Entry, with File and Directory under it; Directory.size adds up its children"),
            ("New conditions (owner, modified time)", "Strategy, as classes", "each is a new Filter class; find does not change"),
            ("Combined queries (and, or, not)", "Composite", "And, Or and Not are Filters that hold Filters"),
            ("Million entries, size cached", "No pattern: a field", "a total on each Directory, updated up the parent chain"),
        ],
    },
    "extensions": [
        {"ask": "The tree can be very deep. What goes wrong with your walk?",
         "say": "The walk calls itself once per level, and Python stops at about a thousand calls, so a deep chain of folders fails. **I swap the recursion for a stack of (path, entry) that my code owns.** Pushing children in reverse name order makes them pop in name order, so the output is the same. find, the filters and every other method do not change.",
         "code": EXT_STACK, "code_title": "Walk with an explicit stack",
         "run": STACK_RUN, "run_out": STACK_RUN_OUT,
         "short_q": "A very deep tree", "short_a": "swap the recursive walk for a stack of (path, entry); push children in reverse name order"},
        {"ask": "Now add delete and move.",
         "say": "Both use _split, which already gives the folder and the name. Delete removes the name from its folder; move pops it from one folder and puts it in another. **The one trap is moving a folder into itself,** so move checks that first.",
         "code": method(DELETE + "\n" + MOVE), "code_title": "delete and move: two methods on FileSystem",
         "short_q": "Delete and move", "short_a": "both use _split; move refuses a folder into itself and a taken name"},
        {"ask": "Add a new condition: files changed in the last week.",
         "say": "A File gets a modified field and there is one new Filter class. **find, the walk and every other filter stay exactly as they are,** which is the point of handing find a Filter.",
         "code": EXT_MODIFIED, "code_title": "A new filter",
         "short_q": "New condition", "short_a": "a new Filter class (plus a File field); find untouched"},
        {"ask": "Folders hold a million entries and size_of is called constantly. What changes?",
         "say": "size() walks everything below, so it is O(entries). **I'd keep a total on each Directory and update it up the chain on every add, delete and move.** That makes size_of O(1) and writes O(depth).",
         "short_q": "A million entries", "short_a": "store a size on each Directory; update up the parent chain on writes"},
    ],
    "faq": [("Why sorted names in walk and ls?", "So the output is the same every run. A test, and a person, can rely on the order."),
            ("Why a Filter class and not a lambda?", "A lambda works for the simple cases, and it is a fine answer to say aloud. A class lets And, Or and Not be built, printed and tested, and it names each condition."),
            ("What about os.walk and fnmatch?", "Both are the real tools in Python. Here the tree is in memory and the filters are the question, so I write the walk and the matching myself and mention the stdlib after."),
            ("Symbolic links?", "An entry that points at another path. find then needs a visited set of real paths to skip a folder seen twice, or a loop never ends; I left links out of scope."),
            ("Permissions?", "An owner and a mode on Entry, and one _check(user, entry, action) before every operation, so the rules live in one place and the entries stay plain.")],

    "summary": ["**A tree, and a Filter class.** A FileSystem holds the root and turns an absolute path into an entry. File and Directory share a base, so a folder's size and a search over the tree work without asking which kind of entry they have. find walks every entry under a start path and keeps the path of each file a Filter accepts. Each simple filter answers matches(file) from one value, and And, Or and Not are Filters that hold Filters, so any query is a tree of the same class.",
                "**It grows in one place at a time:** a deep tree needs a stack in the walk, delete and move reuse the split helper, a new condition is a new Filter class, and a cached size per folder fixes huge trees. find only ever calls matches."],

    "apart": [
        "**The prompt is one line, so your questions are the design.** Ask what operations, what a path looks like, and whether find conditions combine, before any class.",
        "**A file and a folder are both an Entry.** A folder holds entries, so its size is the sum of its children's, asked without checking their type: that is the whole tree.",
        "**A filter is one question about one file; combining filters is a filter that holds filters.** find is handed a Filter and only calls matches, so a new condition is a new class.",
        "**And stops at the first no, Or at the first yes, Not flips.** Name the walk traps before they do: a deep tree needs an explicit stack, and a folder moved into itself."
    ],
    "golden": [
        ("Ask first. The prompt is one line, so the questions are the first thing marked.", "no requirements given means scope is the test; designing at once skips what they are grading."),
        ("File and Directory are both Entries: a folder's size adds up its children without asking their type.", "that is the Composite, justified by one requirement instead of dropped in as a pattern."),
        ("A filter is one question about one file; combining filters is a filter that holds filters.", "any query is built from the same two ideas, and find never changes."),
        ("And stops at the first no, Or at the first yes, Not flips.", "short-circuit is the whole logic, and an empty And is true while an empty Or is false."),
        ("Every path rule lives in one resolve step; no other method splits a string.", "relative paths or '..' later change one helper."),
        ("Name the traps before they do: a folder moved into itself, and a tree deeper than the call stack.", "it shows you thought about the tree, not only the happy path."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with the extensions applied (an explicit-stack walk, delete and move, and a modified-time filter), and a run at the bottom.",
    "final_title": "filesystem.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "a combined search, the case-insensitive name search, the move into /tmp and the new size of /docs, the listing after deleting the notes folder, and the error for moving a folder into itself.",
}
