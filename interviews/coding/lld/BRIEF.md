# Brief for writing an LLD problem file

You write one Python file per problem in `interviews/coding/lld/problems/<id>.py`, exporting a dict `PROBLEM`.
**Copy the shape of `problems/elevator.py` exactly.** It is the reference for both the fields and, above all,
how the implementation is decomposed. Read it fully, and read `lib.py` to see how every field is rendered
(`mock_part` for a staged round, `cheat_tab` for a one-screen sheet). Do not edit `lib.py`, `build.py`,
`overview.py`, `locker.py` or `elevator.py`; if something in them blocks you, say so in your report.

## The bar
Pranav learns from these. **Each file is the standard design a strong candidate draws for this question** (the
one a Hello Interview or a good LeetCode Discuss write-up lands on), not the smallest thing that runs. Rough size:
3 to 6 classes plus enums; core code 90 to 170 lines; 3 to 6 public methods. No pre-emptive interfaces,
strategies, notifiers or dependency injection unless the requirements force them; patterns appear in the
extensions, each tied to the change that needs it. A round is about 45 minutes.

## The five rules the old files broke (read twice)
1. **Keep a noun when it carries a rule.** A noun becomes a class when it holds a type, a date or a condition
   that changes behaviour, even if it looks like "only data": Request (its type decides whether a passing elevator
   stops), Loan (its due date gives days late), Move (history and undo), Filter (conditions combine). Drop a noun
   only when nothing in the requirements reads it.
2. **Top-down, most interesting method first.** The first method box is the most interesting public method,
   written at the level you'd say out loud, naming the hard part as a private helper (`best =
   self._select_best_elevator(request)`). The next box is that helper, written the same way, naming its own
   helpers (`_find_moving_towards`, `_find_nearest_idle`, `_find_nearest`). The most interesting of those gets
   its own box. Plain helpers (checks, lookups, status) go last, in `helpers` (a list of boxes is fine).
3. **Core logic in a supporting class gets its own method box.** Name it `Class.method` (`Elevator.step`,
   `Piece.can_move`, `Loan.days_late`). Never leave the heart of the problem in the skeleton.
4. **No tricks for the logic that matters.** No sign multiplication, no `or` fallbacks over lists, no chained
   assignment, no stdlib structure that IS the answer (OrderedDict for LRU, Counter, bisect): write the loop or
   the structure, and mention the stdlib shortcut in a faq. Ties are broken explicitly so runs are deterministic.
5. **Behaviour lives where its data is.** A supporting class answers questions about itself (`serves`,
   `is_expired`, `days_late`, `can_move`); the entry class orchestrates. No "only data" class unless it truly is a
   record nobody asks anything of.

## The order (the page renders it; you supply the content)
a) Clarify in three buckets: capabilities, errors, scope. 2 to 4 questions each, each with the interviewer's answer.
b) Requirements, numbered: `[headline, sub, sub]`, each "who does what; what the system does; what can go wrong",
   then `out_of_scope`.
c) Entities: every noun from the requirements, keep or drop, with a reason (drop what only carries data the
   design doesn't need; external actors are dropped).
d) Classes: `state` (the "-" lines, what __init__ sets, with types) and `behaviour` (the "+" lines, with return types).
   Every state and behaviour line ends with `  # why it exists`, under a line (see parking.py).
   Spoken `clarify_say`, `req_say`, `ent_say`, `class_say` (cheat-only files: `class_say`): 2 to 4 sentences, one **bold** idea;
   `class_say` walks from the methods to what each must read, which gives the state.
e) Methods: each public method's code starts with a docstring holding "Core logic:" numbered steps and
   "Edge cases:" numbered steps, then the code. Helpers go in `helpers.code`.
e0) `skeleton` {q, hint, code, why}: the head and every supporting class implemented, the entry class's __init__; built from CORE's constants.
   All code carries short why-comments on the lines that need them.
f) Extensions: 3 or 4 interviewer follow-ups: `ask`, `say` (first person), optional `code` + `code_title`,
   and `short_q` / `short_a` for the cheat sheet.
`design_check` {lead, solid: five (principle, where it shows here), varies: 3 or 4 (what could change, pattern, in this design)}, rendered inside Extensibility.
Then `summary` (2 spoken paragraphs), `golden` (4 to 6 pairs: the line, then why it matters; the first 4 show on
the cheat sheet, so put the strongest first), and the final file (core with the extensions applied) + a demo.

## Two kinds of file
- **Drill** (a full staged round): every field in locker.py, including `core_code`, `demo`, `demo_out`,
  `final_code`, `final_demo`, `final_out`, `final_out_note`. Assemble CORE from the method strings like
  locker.py does, so the page shows exactly the code that runs. Check with:
  `python interviews/coding/lld/build.py check <id>` (must print `ok <id>`).
- **Order**: `ORDER` in build.py sets each drill's number and group on the LLD tab. One home per problem: a near-duplicate ask becomes an extension of the drill that owns its shape (meeting rooms and library copies live in Reservations; file search lives in File system and find), never a second drill.

## Writing rules
- Plain sentence case, short sentences. No em dashes, no emojis, no "just" or "simply", no marketing words.
- Spoken lines (`say`, `summary`, `playback`) are first person, how he would say them; **bold** only the one key idea.
- Python 3.12, standard library only, snake_case, type hints on signatures. The demo prints a few lines that show
  the happy path and the main errors; `demo_out` must match exactly.
- Map: `center` is the entry class; `owned` are classes it holds (drawn left); `uses` are enums or helpers (dashed,
  right). Titles under 20 characters, subs under 24.
- Evidence and drill strings for the ten: copy them from `interviews/coding/amazon_lld_top10_gen.py` (the
  `tab(...)` calls), keeping the facts.
- For problems that were already drills, read the old part in `interviews/coding/amazon-lld-a.js` or
  `amazon-lld-b.js` (`node -e "global.window={};require('./interviews/coding/amazon-lld-b.js');..."`) to keep its
  problem statement and twists; rewrite it in the new shape.

Report: the files you wrote, the check output for each, and anything you were unsure about. Under 200 words.
