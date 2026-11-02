# Brief for writing an LLD problem file

You write one Python file per problem in `interviews/coding/lld/problems/<id>.py`, exporting a dict `PROBLEM`.
**Copy the shape of `problems/locker.py` exactly.** It is the reference. Read it fully, and read `lib.py` to see
how every field is rendered (`mock_part` for a staged round, `cheat_tab` for a one-screen sheet). Do not edit
`lib.py`, `build.py`, `overview.py` or `locker.py`; if something in them blocks you, say so in your report.

## The bar
Pranav learns from these. His own Locker answer (3 classes + an enum) is the minimum that passes. Each file is
**a little more than the minimum**: one or two extra classes or behaviours so he can infer the rest of the
problem, never the old pattern-heavy design. Rough size: 3 to 5 classes plus enums; core code 70 to 120 lines;
3 to 5 public methods; private helpers named in the main methods and written after. No pre-emptive interfaces,
strategies, notifiers, clocks or dependency injection in the core unless the requirements force them; patterns
appear in the extensions, each tied to the change that needs it. A round is about 40 minutes.

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
- **Cheat only** (one screen in part 0.5): `id, title, prompt, evidence, clarify, requirements, out_of_scope,
  entities, classes, map, methods, extensions, golden` (and `drill` if a full practice exists). Methods have
  `name` and `logic` (a list of steps) and no code. Check with:
  `python -c "import sys; sys.path.insert(0,'interviews/coding/lld'); import lib, importlib.util as u; s=u.spec_from_file_location('p','interviews/coding/lld/problems/<id>.py'); m=u.module_from_spec(s); s.loader.exec_module(m); lib.cheat_tab(m.PROBLEM,1); print('ok')"`

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
