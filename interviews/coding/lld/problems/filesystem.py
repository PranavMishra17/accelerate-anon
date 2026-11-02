"""File management system, no requirements given. A drill: asking for the scope is half the mark.
Three classes with a shared base (Composite) and a FileSystem; filters, delete and move are extensions."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


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
                child = node.children[name] = Directory(name)   # Step 2: make the missing folder
            if not isinstance(child, Directory):           # Step 3: a file is in the way
                raise FsError(f"not a folder: {name}")
            node = child                                   # Edge 2: an existing folder is just walked through
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
        # Step 2: sorted() so the output is the same every run; a file lists as itself, like Unix ls
        return sorted(node.children) if isinstance(node, Directory) else [node.name]
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

FIND = method('''
    def find(self, path: str = "/", ext: str | None = None, min_size: int = 0) -> list:
        """
        Core logic:
          1. Resolve the start path
          2. Walk everything under it
          3. Keep each file that has the extension and is big enough
          4. Return the full paths
        Edge cases:
          1. Start path does not exist -> error
          2. No filters given -> every file
        """
        found = []
        # Step 1 and 2: walk yields (full path, entry) for everything under the start; Edge 1 is raised in _resolve
        for p, entry in self._resolve(path).walk(self._normal(path)):
            if not isinstance(entry, File):                # folders are walked through, never returned
                continue
            if ext and not entry.name.endswith("." + ext):    # Edge 2: ext=None skips this filter
                continue
            if entry.size() >= min_size:                   # Edge 2: min_size=0 keeps every file
                found.append(p)                            # Step 3 and 4: the full path, not the name
        return found
''')

HELPERS = method('''
    def _parts(self, path: str) -> list:
        """The one place a path string is split: names between slashes, or an error if not absolute."""
        if not path.startswith("/"):
            raise FsError(f"path must be absolute: {path}")
        return [p for p in path.split("/") if p]           # drops empty names, so "/a//b/" is ["a", "b"]

    def _normal(self, path: str) -> str:
        return "/" + "/".join(self._parts(path))           # a clean path: "/" for the root, no trailing slash

    def _resolve(self, path: str) -> Entry:
        """Walk down from the root; error if any name is missing or a file is in the way."""
        node = self.root
        for name in self._parts(path):
            # a file has no children, so "not a Directory" also means the path goes through a file
            if not isinstance(node, Directory) or name not in node.children:
                raise FsError(f"no such path: {path}")
            node = node.children[name]                     # one step down per name
        return node

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
            yield path, self             # a file is a leaf: just itself; Directory adds what is below


    class File(Entry):
        """A leaf. A name and a size, no contents; it never holds other entries."""
        def __init__(self, name: str, nbytes: int):
            super().__init__(name)
            self.nbytes = nbytes         # the size in bytes; the contents are out of scope

        def size(self) -> int:
            return self.nbytes


    class Directory(Entry):
        """A folder. It holds children by name and adds them up; path rules live in FileSystem."""
        def __init__(self, name: str):
            super().__init__(name)
            self.children = {}               # name -> Entry; a dict, so a lookup by name is one step

        def size(self) -> int:
            # a folder is what is inside it; a child folder adds up its own children the same way
            return sum(c.size() for c in self.children.values())

        def walk(self, path: str):
            yield path, self                 # a generator: one entry at a time, never the whole tree in a list
            for name in sorted(self.children):     # sorted, so the order is the same every run
                # rstrip("/") so the root "/" does not produce "//docs"
                yield from self.children[name].walk(path.rstrip("/") + "/" + name)
    ''')

FS = D('''\


    class FileSystem:
        def __init__(self):
            self.root = Directory("")        # the top folder; its name is empty because "/" is its path
    ''')

CORE = HEAD + FS + in_class(MKDIR, ADD_FILE, LS, SIZE_OF, FIND, HELPERS)

DEMO = D('''\


    # ---- a quick run ----
    fs = FileSystem()
    fs.mkdir("/docs/notes")                      # makes /docs on the way, then notes
    fs.add_file("/docs/notes/todo.txt", 120)
    fs.add_file("/docs/notes/ideas.txt", 80)
    fs.add_file("/docs/report.pdf", 5000)
    print(fs.ls("/docs"), fs.size_of("/docs"))   # 120 + 80 + 5000 = 5200
    print(fs.find("/", ext="txt"))
    print(fs.find("/docs", min_size=1000))
    # each of these hits one edge case: name taken, no such path, a file in the way
    for bad in (lambda: fs.add_file("/docs/report.pdf", 1), lambda: fs.ls("/nope"), lambda: fs.mkdir("/docs/report.pdf/x")):
        try:
            bad()
        except FsError as e:
            print(e)
    ''')
DEMO_OUT = ("['notes', 'report.pdf'] 5200\n['/docs/notes/ideas.txt', '/docs/notes/todo.txt']\n['/docs/report.pdf']\n"
            "already exists: /docs/report.pdf\nno such path: /nope\nnot a folder: report.pdf\n")

# ---- extensions ----
EXT_FILTERS = D('''\
    # a filter is any function: entry -> bool
    def ext(x: str):
        return lambda e: e.name.endswith("." + x)     # returns a function, so it can be passed to find

    def min_size(n: int):
        return lambda e: e.size() >= n

    def all_of(*filters):                    # AND: every filter must accept
        return lambda e: all(f(e) for f in filters)

    def any_of(*filters):                    # OR: one accepting filter is enough
        return lambda e: any(f(e) for f in filters)

    def not_(f):                             # NOT: flips one filter
        return lambda e: not f(e)


    class FileSystem:
        ...

        def find(self, path: str = "/", keep=lambda e: True) -> list:     # default keeps every file
            return [p for p, e in self._resolve(path).walk(self._normal(path))
                    if isinstance(e, File) and keep(e)]       # the walk is unchanged; only the test is a parameter

    # fs.find("/", all_of(ext("log"), not_(min_size(10**6))))
    ''')

FIND_FINAL = method('''
    def find(self, path: str = "/", keep=lambda e: True) -> list:
        """Every file under path for which keep(file) is true."""
        # same walk as before; the whole test is one call to the filter
        return [p for p, e in self._resolve(path).walk(self._normal(path))
                if isinstance(e, File) and keep(e)]
''')

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

FILTER_FUNCS = D('''\


    def ext(x: str):
        return lambda e: e.name.endswith("." + x)     # each filter builds a function entry -> bool


    def min_size(n: int):
        return lambda e: e.size() >= n


    def all_of(*filters):                             # AND
        return lambda e: all(f(e) for f in filters)


    def any_of(*filters):                             # OR
        return lambda e: any(f(e) for f in filters)


    def not_(f):                                      # NOT
        return lambda e: not f(e)
    ''')

FINAL = HEAD + FILTER_FUNCS + FS + in_class(MKDIR, ADD_FILE, LS, SIZE_OF, FIND_FINAL, DELETE, MOVE, HELPERS)
FINAL_DEMO = D('''\


    # ---- a quick run ----
    fs = FileSystem()
    fs.mkdir("/docs/notes")
    fs.mkdir("/tmp")
    fs.add_file("/docs/notes/todo.txt", 120)
    fs.add_file("/docs/notes/ideas.txt", 80)
    fs.add_file("/docs/report.pdf", 5000)
    print(fs.find("/", all_of(any_of(ext("txt"), ext("pdf")), min_size(100))))   # (txt OR pdf) AND >= 100 bytes
    print(fs.find("/", all_of(ext("txt"), not_(min_size(100)))))                 # txt files under 100 bytes
    fs.move("/docs/notes/todo.txt", "/tmp")      # /docs loses 120 bytes
    print(fs.ls("/tmp"), fs.size_of("/docs"))    # 5200 - 120 = 5080
    fs.delete("/docs/notes")                     # takes ideas.txt with it
    print(fs.ls("/docs"))
    try:
        fs.move("/docs", "/docs")                # the trap: a folder into itself
    except FsError as e:
        print(e)
    ''')
FINAL_OUT = ("['/docs/notes/todo.txt', '/docs/report.pdf']\n['/docs/notes/ideas.txt']\n['todo.txt'] 5080\n"
             "['report.pdf']\ncannot move a folder into itself\n")

PROBLEM = {
    "id": "filesystem", "title": "File management system", "part_id": "lld-files", "n": 3,
    "part_title": "File management system (no requirements given)", "minutes": 40,
    "lead": "The prompt is one line and nothing else is given: asking is the test. A full round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design, e) implementation, f) extensibility. Files and folders are one kind of entry (a Composite), and the file system looks things up by path. Try each box before you open the answer.",
    "prompt": "Design a file management system.",
    "opening": "Sounds good. **That's the whole prompt, so I'll ask before I design: what the system must do, how it handles errors, and where the scope stops.** Then I'll write requirements, pull out the entities, design the classes and implement the main methods.",
    "evidence": "A 2026 candidate report: the interviewer gave only this one line and the questions were the test. Part of the ten Amazon asks as File search.",
    "drill": "this part.",

    "clarify": {
        "capabilities": [("What can a user do?", "Make folders, add a file with a size, list a folder, ask the size of something, and find files"),
                         ("How are things addressed?", "By absolute path from a root, such as /docs/notes/todo.txt"),
                         ("What does a file hold?", "A name and a size. Not the contents"),
                         ("What can find match on?", "The extension and a minimum size to start")],
        "errors": [("Make a folder that already exists?", "Fine, nothing happens. An error only if a file is in the way"),
                   ("Add a file whose name is taken?", "Error"),
                   ("List or search a path that does not exist?", "Error")],
        "scope": [("A real disk, or a model in memory?", "In memory"),
                  ("Delete and move?", "Later, if there is time"),
                  ("Several users, permissions, two things at once?", "One user, one thread, no permissions")],
    },
    "clarify_hint": "What a user does, how a thing is addressed, what a file holds, what find matches on. Folder exists, name taken, bad path. A real disk, delete and move, users.",
    "clarify_say": "**I group my questions in three buckets: what it must do, what goes wrong, where scope stops.** The prompt is one line, so I start with what a user does, how things are addressed and what a file holds. Then a folder that exists, a taken name and a bad path. Then real disk, delete and move.",
    "clarify_why": "With no requirements given, the questions are the answer. Paths give a resolve step, a size and no contents give a tiny File, and 'delete and move later' tells you where the design must stay open.",
    "answers": "Make folders, add a file with a size, list a folder, ask the size of something, and find files by extension and minimum size. Things are addressed by absolute path. A file is a name and a size. Making a folder that exists does nothing, unless a file is in the way. A taken name, or a path that does not exist, is an error. In memory, one user, one thread, no permissions. Delete and move are for later if there is time.",
    "playback": ["Thanks, that's clear. **So: an in-memory tree addressed by absolute path, files with a name and a size, a folder's size is what is inside it, and find by extension and minimum size.** Delete and move come later, and out of scope are contents, real disks, users and threads."],

    "requirements": [
        ["User makes folders and adds files by absolute path.", "The system makes the missing folders on the way; a file needs its folder to exist", "Error if the path is not absolute, the name is taken, or a file is in the way"],
        ["User lists a folder.", "Returns the child names, sorted", "Error if the path does not exist"],
        ["User asks the size of a file or a folder.", "A folder's size is the total of everything inside it"],
        ["User finds files under a path by extension and minimum size.", "Returns the full path of each match", "Error if the start path does not exist"],
    ],
    "out_of_scope": ["file contents", "a real disk", "delete and move (extensions)", "users and permissions", "threads"],
    "req_hint": "Make folders and files, list, size, find. Each with its error.",
    "req_say": "From your answers I get four requirements. **Each one is a thing a user does, and each becomes a method: make folders and files, list, size, find.** I say the error case with each so I don't forget it in the code.",
    "req_why": "Each requirement is a method: 1 is mkdir and add_file, 2 is ls, 3 is size_of, 4 is find. Requirement 3 is the one that points at a Composite.",

    "entities": [("User", False, "External actor; not modelled"),
                 ("Path", False, "A string; the file system turns it into an entry"),
                 ("File", True, "A name and a size"),
                 ("Directory", True, "A name and its children, by name"),
                 ("Entry", True, "The shared base: size() and walk() work on a file or a folder, so callers need no type checks"),
                 ("FileSystem", True, "Holds the root and turns a path into an entry"),
                 ("File contents", False, "Only the size matters here"),
                 ("Filter", False, "Two parameters on find are enough for now; it becomes a class when conditions combine")],
    "ent_hint": "Which nouns carry data the design needs? Is a path an object? Is a filter a class yet?",
    "ent_say": "I underline the nouns. **File and directory carry data I need, and a shared Entry base lets size and walk work on either.** A path is only a string that the file system turns into an entry. A filter stays two parameters on find until conditions combine.",
    "ent_why": "Four classes: Entry, File, Directory and FileSystem. A filter is not one yet: it earns its place only when the interviewer asks to combine conditions.",

    "classes": [
        {"name": "FileSystem", "state": ["root: Directory  # every absolute path starts here"],
         "behaviour": ["mkdir(path) -> void | error  # req 1: make folders on the way",
                       "add_file(path, nbytes) -> void | error  # req 1: put a file in its folder",
                       "ls(path) -> names | error  # req 2: the child names, sorted",
                       "size_of(path) -> int | error  # req 3: file or folder size",
                       "find(path, ext, min_size) -> paths | error  # req 4: walk and filter"]},
        {"name": "Entry", "state": ["name: string  # the key its parent stores it under"],
         "behaviour": ["size() -> int  # req 3: file or folder, no type check",
                       "walk(path) -> (path, entry) pairs  # req 4: find visits both kinds alike"]},
        {"name": "File (is an Entry)", "state": ["nbytes: int  # a file is a name and a size, no contents"], "behaviour": ["size() -> nbytes  # req 3: a file knows its own size"]},
        {"name": "Directory (is an Entry)", "state": ["children: Map<name, Entry>  # lookup by name; a taken name is an error"],
         "behaviour": ["size() -> sum of the children  # req 3: a folder is what is inside it",
                       "walk(path) -> itself, then everything below  # req 4: find needs every path"]},
    ],
    "class_hint": "FileSystem holds the root. File and Directory share a base with size and walk. A directory holds children by name.",
    "class_say": "**I start from the methods the requirements gave me, then ask what each one has to read.** Every method gets a path, so the file system holds a root and walks down from it. A folder's size is what is inside it, and find visits every entry, so both kinds answer size and walk. A folder looks a child up by name, so it holds a map by name.",
    "class_why": "The base class is the only extra idea. Because both answer size() and walk(), a folder's size and find need no isinstance checks.",
    "class_qa": [{"ask": "Why make File and Directory share a base? Two plain classes would work.",
                  "say": "Because a folder holds both, and a folder's size has to add up whatever is inside it. **If both answer size() and walk(), the folder never asks which kind a child is.** That's the Composite pattern, and I only need it because requirement 3 says a folder has a size.",
                  "explain": ["Without it, size and find each need an isinstance check on every child, and a third kind of entry means touching both."]}],

    "map": {"center": ("FileSystem", "mkdir, add, ls, find"),
            "owned": [("Directory", "children by name"), ("File", "name, nbytes")],
            "uses": [("Entry (base)", "size(), walk()")],
            "links": [(0, "contains")]},

    "skeleton": {"q": "First the small classes: FsError, Entry, File, Directory, and the file system's __init__. Each line from the class design.",
                 "hint": "Entry holds a name and the shared size and walk. File adds a size. Directory holds children by name and adds them up. The file system holds the root.",
                 "code": HEAD + FS,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "mkdir", "q": "mkdir(path): core logic and edge cases as comments, then the code.",
         "hint": "Split into names, walk down, make what is missing. Edges: relative path, a file in the way.", "code": MKDIR,
         "why": "_parts is named but not written yet. Making a folder that exists is not an error, as agreed."},
        {"name": "add_file", "q": "add_file(path, nbytes): core logic, edge cases, code.",
         "hint": "Find the folder and the name, then put a File there. Edges: folder missing, name taken, negative size.", "code": ADD_FILE,
         "why": "_split gives the folder and the last name, so add_file and later delete and move share it."},
        {"name": "ls", "q": "ls(path): what does a folder give, and a file?",
         "hint": "Resolve; a folder gives sorted names. Edge: no such path.", "code": LS,
         "why": "Listing a file returns its own name, like Unix ls. Say that you chose it."},
        {"name": "size_of", "q": "size_of(path): where does the adding up happen?",
         "hint": "Resolve, then call size() on the entry.", "code": SIZE_OF,
         "why": "One line, because Directory.size() already adds up its children. That is the payoff of the shared base."},
        {"name": "find", "q": "find(path, ext, min_size): core logic, edge cases, code.",
         "hint": "Resolve, walk, keep the files that match. Edges: no such path, no filters.", "code": FIND,
         "why": "Directory.walk is a generator, so it never builds the whole tree in memory. Only files are returned."},
    ],
    "helpers": {"q": "Now the helpers: _parts, _normal, _resolve, _split.",
                "starter": "def _resolve(self, path):\n    ...\n",
                "hint": "Split on slashes and drop empty names. Walk down from the root. _split resolves everything but the last name.",
                "code": HELPERS,
                "why": "Every path rule lives in these four. If paths later gain '..' or relative forms, only _parts changes."},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "File and Directory know their own size, FileSystem turns a path into an entry, and _parts, _resolve and _split hold every path rule."),
            ("Open/closed", "A new filter is a new function handed to find. find is not edited."),
            ("Liskov substitution", "File and Directory both work wherever an Entry does: size() returns bytes and walk() yields files."),
            ("Interface segregation", "Entry has two methods, size and walk. Nothing wider to split yet."),
            ("Dependency inversion", "find depends on a keep(entry) function, not on a concrete extension or size rule."),
        ],
        "varies": [
            ("File and folder behave alike", "Composite", "Entry, with File and Directory under it; Directory.size adds up its children"),
            ("Combining search conditions", "Strategy, as functions", "ext, min_size, all_of, any_of and not_ passed to find"),
            ("Million entries, size cached", "No pattern: a field", "a total on each Directory, updated up the parent chain"),
            ("Permissions", "No pattern: one helper", "_check(user, entry, action) before every operation"),
        ],
    },
    "extensions": [
        {"ask": "Find files that are .txt or .pdf and bigger than 100 bytes. How do you combine conditions?",
         "say": "A condition becomes a small function from an entry to true or false, and find takes one. **AND, OR and NOT are functions that wrap other conditions,** so any combination is built from the same pieces and find never changes again.",
         "code": EXT_FILTERS, "code_title": "Filters as functions: find keeps what they accept",
         "short_q": "Combine conditions", "short_a": "a filter is entry -> bool; all_of, any_of, not_ wrap filters; find takes one"},
        {"ask": "Now add delete and move.",
         "say": "Both use _split, which already gives the folder and the name. Delete removes the name from its folder; move pops it from one folder and puts it in another. **The one trap is moving a folder into itself,** so move checks that first.",
         "code": method(DELETE + "\n" + MOVE), "code_title": "delete and move: two methods on FileSystem",
         "short_q": "Delete and move", "short_a": "both use _split; move refuses a folder into itself and a taken name"},
        {"ask": "Folders hold a million entries and size_of is called constantly. What changes?",
         "say": "size() walks everything below, so it is O(entries). **I'd keep a total on each Directory and update it up the chain on every add, delete and move.** That makes size_of O(1) and writes O(depth).",
         "short_q": "A million entries", "short_a": "store a size on each Directory; update up the parent chain on writes"},
        {"ask": "Add permissions, with a few users.",
         "say": "Each Entry gets an owner and a mode, and FileSystem methods take a user. **One helper, _check(user, entry, action), runs before every read or write,** so the rules live in one place and the entries stay plain.",
         "short_q": "Permissions", "short_a": "owner and mode on Entry; one _check(user, entry, action) before every operation"},
    ],
    "faq": [("Why sorted names in walk and ls?", "So the output is the same every run. A test, and a person, can rely on the order."),
            ("Symbolic links?", "An entry that points at another path. find then needs a visited set to avoid loops; I left links out of scope.")],

    "summary": ["**Four classes.** A FileSystem holds the root and turns an absolute path into an entry. File and Directory share a base, so a folder's size and a search over the tree work without asking which kind of entry they have. Make, add, list, size and find are each a short method on top of one resolve step.",
                "**It grows in one place at a time:** combining conditions makes find take a filter function, delete and move reuse the split helper, a cached size per folder fixes huge trees, and permissions become one check before every operation."],

    "golden": [
        ("Ask first. The prompt is one line, so the questions are the first thing marked.", "no requirements given means scope is the test; designing at once skips what they are grading."),
        ("File and Directory are both Entries: a folder's size adds up its children without asking their type.", "that is the Composite, justified by one requirement instead of dropped in as a pattern."),
        ("Every path rule lives in one resolve step; no other method splits a string.", "relative paths or '..' later change one helper."),
        ("find walks with a generator and takes a condition; conditions are functions that combine.", "new filters and AND, OR, NOT arrive without touching the file system."),
        ("Name the trap before they do: a folder moved into itself.", "it shows you thought about the tree, not just the happy path."),
        ("A size per folder, kept up the parent chain, answers the million-entry follow-up.", "it trades writes for reads and says what each costs."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with both file-system extensions applied (conditions as combinable functions, and delete and move), and a run at the bottom.",
    "final_title": "filesystem.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the .txt or .pdf files of at least 100 bytes, the small .txt, the move into /tmp and the new size of /docs, the listing after deleting the notes folder, and the error for moving a folder into itself.",
}
