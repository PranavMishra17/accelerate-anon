"""File search, like Unix find. Cheat only (one screen in part 0.5). The full practice is the File management drill."""

PROBLEM = {
    "id": "filesearch", "title": "File search, like Unix find",
    "prompt": "Design an API to find files: all files over 5 MB, all XML files, and combinations of those.",
    "evidence": "PracHub (onsite, hard) and a Hello Interview community report; LeetCode posts from 2019 and a 2024 write-up. Long known as an Amazon favourite, but thin in 2024 to 2026 reports.",
    "drill": "part 3, File management.",

    "clarify": {
        "capabilities": [("Which filters?", "Size, extension, name pattern, modified time to start"),
                         ("Combine them?", "AND, OR and NOT"),
                         ("What does search return?", "Each matching file's path")],
        "errors": [("Start path missing?", "Error"),
                   ("Symlinks, with possible cycles?", "Out of scope; say how you would stop a loop"),
                   ("A folder you cannot read?", "Skip it and keep going")],
        "scope": [("A real disk, or a tree already in memory?", "A tree in memory"),
                  ("Huge trees?", "Yes: results should stream, not wait for the whole walk")],
    },

    "requirements": [
        ["User searches under a start folder with a condition.", "The system walks everything below it and returns the files that match", "Error if the start folder does not exist"],
        ["A condition tests one file: size, extension or name.", "Conditions combine with AND, OR and NOT"],
        ["Results come out as the walk finds them.", "A huge tree does not wait to finish, or fill memory"],
    ],
    "out_of_scope": ["a real disk", "symlinks", "permissions", "searching file contents"],

    "entities": [("User", False, "External; not modelled"),
                 ("File", True, "A name and a size; the extension comes from the name"),
                 ("Directory", True, "A name and its children; files and folders form a Composite tree"),
                 ("Filter", True, "One question about a file: matches(file); size, extension and name are its subclasses"),
                 ("FileSearcher", True, "Walks the tree and asks the filter about each file"),
                 ("Query / result list", False, "Results are yielded one by one; no list class")],

    "classes": [
        {"name": "FileSearcher", "behaviour": ["search(root, filter) -> files, one at a time  # req 1 and 3: walk the tree and yield matches"]},
        {"name": "Directory", "state": ["name: string  # part of the path we return",
                                        "children: Entry[]  # files and folders, so the tree nests"],
         "behaviour": ["contains files and folders  # the walk pushes its children"]},
        {"name": "File", "state": ["name: string  # the extension comes from it",
                                   "size: int  # req 2: size conditions read it"],
         "behaviour": ["extension() -> string  # ExtensionFilter asks the file"]},
        {"name": "Filter (base)", "behaviour": ["matches(file) -> boolean  # req 2: one question about one file"]},
        {"name": "SizeFilter, ExtensionFilter", "state": ["the limit or the extension  # the value each one compares against"],
         "behaviour": ["matches(file) -> boolean  # each kind answers its own question"]},
    ],
    "class_say": "**I start from the one method the requirements gave me: search(root, filter), which yields matching files.** It has to walk a tree, so folders hold children and files hold a name and a size. Each condition is a Filter with one method, matches(file). That way And, Or and Not can combine them, and the walk never needs to know the kind.",

    "map": {"center": ("FileSearcher", "search(root, filter)"),
            "owned": [("Directory", "children"), ("File", "name, size")],
            "uses": [("Filter", "matches(file)"), ("Size, Ext", "one class each")],
            "links": [(0, "contains")]},

    "methods": [
        {"name": "search", "logic": ["Start a stack with the root folder", "Pop one; a file is tested, a folder pushes its children", "Test with filter.matches(file)", "Yield each match as it is found"]},
        {"name": "matches", "logic": ["Each filter answers one question about one file", "SizeFilter compares the size; ExtensionFilter compares the end of the name"]},
        {"name": "combine", "logic": ["And asks all its children, Or asks any, Not flips one", "They are Filters too, so they nest to any depth"]},
    ],

    "design_check": {
        "lead": "Check each choice against SOLID in a minute. Here the patterns are the design: a tree of files and a Filter per question.",
        "solid": [
            ("Single responsibility", "File and Directory hold the tree, Filter answers one question, FileSearcher walks and yields."),
            ("Open/closed", "A new criterion is a new Filter class. search and the existing filters stay as they are."),
            ("Liskov substitution", "SizeFilter, ExtensionFilter and And, Or, Not all work wherever Filter does: matches(file) returns a boolean."),
            ("Interface segregation", "Filter has one method, matches. No searcher is forced to know about size or extension."),
            ("Dependency inversion", "search is handed a Filter instead of building the test itself."),
        ],
        "varies": [
            ("New criteria (owner, modified)", "Strategy", "each a new Filter; the searcher is untouched"),
            ("Combined queries (and, or, not)", "Composite", "And, Or, Not are Filters that hold Filters"),
            ("Files inside folders", "Composite", "Directory holds Files and Directories, walked with a stack"),
            ("Symlink loops, huge trees", "No pattern: a set and a generator", "visited set of real paths; yield matches"),
        ],
    },
    "extensions": [
        {"ask": "Find XML files over 5 MB, or any file named like a log.",
         "say": "Filters combine. And, Or and Not are Filters that hold other Filters, so **any query is a small tree of the same class,** and the searcher never changes.",
         "short_q": "Combine filters", "short_a": "And, Or, Not are Filters that hold Filters; any query is a tree of them"},
        {"ask": "The tree has symlinks, and one points back up.",
         "say": "Keep a set of folders already visited, and skip a folder you have seen. **Without it a loop never ends.** Key the set on the real path, not the link's name.",
         "short_q": "Symlink loops", "short_a": "a visited set of real paths; skip a folder already seen"},
        {"ask": "Add owner, modified time and permissions as conditions.",
         "say": "Each is one new Filter class. **The searcher and the existing filters stay exactly as they are,** which is the open-closed point of the design.",
         "short_q": "New criteria", "short_a": "each is a new Filter class; nothing else changes"},
        {"ask": "The tree is huge. Search faster?",
         "say": "Stream the matches with a generator, walk with an explicit stack so depth cannot overflow, and then search subtrees in parallel, merging their results. **A result limit stops the walk early.**",
         "short_q": "Huge trees", "short_a": "stream with a generator; explicit stack; parallel subtrees; a result limit"},
    ],

    "golden": [
        ("A filter is one question about one file; combining filters is a filter that holds filters.", "any query is built from the same two ideas, so the searcher never changes."),
        ("Files and folders are one tree; the searcher only walks and asks.", "walking and testing are separate, so each can change alone."),
        ("Yield matches as the walk finds them; don't build a list first.", "a huge tree starts answering at once and never fills memory."),
        ("Walk with an explicit stack, not recursion.", "a deep tree cannot overflow the call stack."),
        ("Remember visited folders if there are links.", "it is the one failure that never ends, so name it before they do."),
    ],
}
