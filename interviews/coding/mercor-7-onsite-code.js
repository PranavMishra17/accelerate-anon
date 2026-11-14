/* Mercor coding tab, part 7: the onsite coding round. A no-IDE drill kit, a referral network in three parts and a task scheduler in two, then eight more Mercor-shaped builds (expert-skill graph, project planner, contractor assignment, interview slot scheduler, profile deduplication, rate-limited crawler, LRU cache with expiry, leaderboard), each laid out in the order you solve it (clarify, requirements, entities, core logic, code, review) with a live extension, then what the reviewer asks. Rebuilt from candidate reports (AceOffer's synthesis of 20 reports, a Blind post from 26 Aug 2026, two public candidate repositories, FastPrep); Mercor's prompts are not public, so the prompts in sections 4 to 11 are invented in the same shape. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-code",
 "n": 7,
 "flow": true,
 "title": "Onsite coding round: referral network, task scheduler and eight more builds",
 "minutes": 600,
 "lead": "After this part you can work the coding round reported for Mercor's Applied AI onsite: alone, about 60 minutes, screen recorded, no AI, real data, no stubs, then about 30 minutes where a person reviews your code. Reports describe two prompts, a referral network in three parts and a task scheduler in two. Each one is laid out in the order you solve it: a) clarify, b) requirements, c) entities, d) core logic in plain English, e) code, f) review. You write each stage in a box, open the answer and the Say it sheet, then run the whole problem in the workbench. Mercor's own prompts are not public, so these are rebuilt from candidate reports and the numbers are mine. Before the problems comes a no-IDE drill kit that sets the hour up like the real one: a plain editor, Python in a terminal, one file layout, a timer, a way out when stuck, a checklist and a way to grade yourself. After the two reported prompts come eight more builds in the same shape. Each prompt is left vague on purpose, like a real one, with a list of what it leaves unsaid, then the six stages, then a Live extension box for the 30-minute review, a runnable workbench and related problems.",
 "sections": [
  {
   "id": "onsite-round",
   "title": "0. How the round runs",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You work alone for about 60 minutes with your screen recorded. In the Applied AI version you may search for syntax, but you may not use an LLM, and no tests are given. You write real code on real data from an empty file: no stubbing a function to come back to it. Then about 30 minutes of review, where a person goes through your code and asks why. These are the same minutes the coding exercise in Mercor's own prep document grades: break the problem down, weigh alternatives, recover when stuck, and deliver something that works."
    },
    {
     "t": "p",
     "text": "**How to pace the hour.** The aim is a working core by minute 35. A part that runs and is checked beats a bigger part that does not."
    },
    {
     "t": "list",
     "items": [
      "Minutes 0 to 5, clarify: ask the three buckets (what it must do, what goes wrong, where it stops) and write the answers as comments at the top of the file. Say them out loud: the recording is part of the grade.",
      "Minutes 5 to 15, data model: pick the dicts and the one class. Write the rules that decide the structure (one referrer per user, a dependency counts once) as comments.",
      "Minutes 15 to 35, core path: part 1 and the first queries, slow and obvious first. Run it on a six-item example you worked out by hand before you move on.",
      "Minutes 35 to 45, your own checks: plain asserts under the code. Include one for each refusal and one that compares the fast version with the slow one.",
      "Minutes 45 to 57, extensions: part 3, or retries. State your choice in a comment before you write it.",
      "Minutes 57 to 60, read it as the reviewer: go through your own code line by line and fix what you cannot explain."
     ]
    },
    {
     "t": "p",
     "text": "**If you are behind at minute 35,** cut extensions, never checks. Hand over a clean part 2 with asserts and say what you would build next. That is a scoping choice, not a miss."
    },
    {
     "t": "p",
     "text": "**What is reported, and how much to trust it.** Everything below is secondhand: candidate reports and two candidates' public repositories, not Mercor's prompt. AceOffer's synthesis of 20 reports names a three-part referral network with 'flow centrality' left open on purpose and a two-part task scheduler. A Blind post from 26 August 2026 says the first part had to work end to end with no stubbing and no AI, and was then reviewed with someone. AceOffer gives no detail for the scheduler, so failures and retries as part 2 is my reading, backed only by FastPrep's practice page, which lists bounded retries. The two repositories disagree on the exact score, which is the point: ask before you code."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "AceOffer: Mercor interview process, from 20 candidate reports",
       "url": "https://aceoffer.app/interviews/mercor/interview-process",
       "m": 10,
       "why": "Names the three-part referral network, the open flow centrality definition and the two-part task scheduler."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Blind: a Mercor experience, 26 August 2026",
       "url": "https://www.teamblind.com/post/mercor-experience-vv02w0gy",
       "m": 3,
       "why": "Solo first part, end to end, no stubbing; then a review of the code with someone."
      },
      {
       "kind": "read",
       "req": false,
       "label": "A candidate's public repo: Mercor referral network (Manyachandra/Mercor)",
       "url": "https://github.com/Manyachandra/Mercor",
       "m": 6,
       "why": "One person's reading: a graph with no self-referrals, one referrer and no cycles; reach; top k; flow centrality as shortest paths through a node. Not the official statement."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Another candidate repo: Referral Network System (BishtAmi)",
       "url": "https://github.com/BishtAmi/Referral-Network-System",
       "m": 4,
       "why": "A different reading: flow centrality as how much a user connects parts of the network, scored with subtree sizes."
      },
      {
       "kind": "read",
       "req": false,
       "label": "FastPrep: Mercor practice questions",
       "url": "https://www.fastprep.io/mercor-interview",
       "m": 4,
       "why": "Lists a dependency-aware workflow with bounded retries, cancellation and backpressure, the shape part 2 of the scheduler follows."
      }
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think I would tell them at the start what I am going to do: ask, write the slow version, check it on a small example, then tighten.",
      "Every few minutes I would say what I finished and what comes next, so the recording makes sense to someone who did not watch me think.",
      "If time runs short, I would hand over a clean earlier part with its checks and say what I would do next, not a rushed last part."
     ]
    }
   ]
  },
  {
   "id": "onsite-kit",
   "title": "1. The no-IDE drill kit",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** The real hour is a skill as well as a problem: you type in a plain setting, with no help, while a recording runs, and you leave code that a stranger can read. Practise those conditions on their own, not only the problems. This kit sets the hour up the way the round is described, gives you one file layout to use every time, a timer, a way out when you are stuck, a checklist, and a way to grade your own hour. The conditions are Mercor's stated ones: about 60 minutes alone, screen recorded, no LLM tools, no Google search or Gemini, no IDE plugins, Python recommended. Then 30 minutes of live review where the reviewer discusses and extends your code."
    },
    {
     "t": "p",
     "text": "**Set up the room.** Do this once, in about 15 minutes. Then every drill starts from the same place."
    },
    {
     "t": "list",
     "items": [
      "An editor with no plugins and no completion. The simplest ones are Notepad, Notepad++ or nano. If you use VS Code, start it with `code --disable-extensions` and turn off `editor.quickSuggestions`, `editor.suggestOnTriggerCharacters`, `editor.parameterHints.enabled` and `editor.inlineSuggest.enabled`. Ask on the day which editor you get, and practise in the plainest one.",
      "Python 3 in a terminal next to the editor. After every change, `python solution.py`. Use `python -i solution.py` to try a function by hand. Standard library only.",
      "No search engine, no AI. The confirmed rules say no Google search or Gemini. If you need a signature, ask the terminal: `python -c \"import heapq; help(heapq)\"`. Practise with only that, so a lookup is a habit you do not need.",
      "A screen recorder, and talk to it. On Windows, Win+G opens the Game Bar recorder; OBS also works. Watch ten minutes of one drill: you will hear where you go quiet, and the round's recording hears it too.",
      "A visible 60-minute countdown (a phone face up is enough) and the split below on a sticky note.",
      "Notifications off. One screen if the round is on one screen. A glass of water. Nothing else open."
     ]
    },
    {
     "t": "p",
     "text": "**What you may look up, in the drill.** The standard library pages below are the ones these problems use. Read them once before the first drill, not during it."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Python docs: heapq (push, pop, nsmallest, heapify)",
       "url": "https://docs.python.org/3/library/heapq.html",
       "m": 5,
       "why": "The heap calls the scheduler, assignment, rooms and leaderboard builds use. Tuples compare left to right, which is how the tie-breaks work."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Python docs: collections (deque)",
       "url": "https://docs.python.org/3/library/collections.html",
       "m": 5,
       "why": "deque is the queue behind every breadth-first search and counting order here. Read only deque; the rest is not needed."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Python docs: dataclasses",
       "url": "https://docs.python.org/3/library/dataclasses.html",
       "m": 4,
       "why": "A small result class in five lines. Read the first example and stop."
      }
     ]
    },
    {
     "t": "p",
     "text": "**The one-file layout.** Use it for every problem, so you never decide where things go. The data model sits at the top, the main function comes next and names its helpers before they exist, the helpers follow, and a block of small asserts at the bottom runs when you run the file. The comment block at the very top is your README: what you asked, what you assumed, what you did not do. The reviewer reads it first. Try to write the skeleton from memory; it is a real file and it runs."
    },
    {
     "t": "write",
     "id": "onsite-kit-layout",
     "q": "Write the skeleton of your one file from memory: the README block, the four sections, and the checks at the bottom.",
     "starter": "\"\"\"<name of the problem>. Run it with:  python solution.py\n\nCLARIFIED (asked, or assumed and said aloud):\n- \nDATA MODEL: \nNOT DONE / NEXT: \n\"\"\"\n\n\n# ---- 1. data model ----\n\n\n# ---- 2. main function ----\n\n\n# ---- 3. helpers ----\n\n\n# ---- 4. checks ----\nif __name__ == \"__main__\":\n    ...\n",
     "hint": "Four sections in a fixed order: data model, main function, helpers, checks. The README block names the assumptions and what is not done. The checks sit under if __name__ == \"__main__\" so importing the file does not run them.",
     "solution": "\"\"\"Referral counter (a drill example). Run it with:  python solution.py\n\nCLARIFIED (asked, or assumed and said aloud):\n- An event is (referrer, user), both non-empty strings. A repeated event counts once.\n- A broken row (an empty name) is skipped, not an error.\nDATA MODEL: referred = dict referrer -> set of users, so a repeat is free.\nNOT DONE / NEXT: deleting a referral; reach below the first level.\n\"\"\"\n\n\n# ---- 1. data model: the dicts and classes, and the rule each one protects ----\n# referred: dict referrer -> set of users they referred\n\n\n# ---- 2. main function, top-down: it names its helpers before they exist ----\ndef count_referrals(events):\n    \"\"\"events: list of (referrer, user). Returns dict referrer -> number of different users referred.\"\"\"\n    referred = {}\n    for referrer, user in events:\n        if not referrer or not user:\n            continue                                   # a broken row: skip it\n        referred.setdefault(referrer, set()).add(user)\n    return {r: len(us) for r, us in referred.items()}\n\n\n# ---- 3. helpers: small, each with a docstring saying what it returns ----\n\n\n# ---- 4. checks: they run when you run the file, and finish in under a second ----\nif __name__ == \"__main__\":\n    assert count_referrals([(\"a\", \"b\"), (\"a\", \"b\"), (\"a\", \"c\"), (\"\", \"d\")]) == {\"a\": 2}\n    assert count_referrals([]) == {}\n    print(\"ok\")\n",
     "why": "The README block is written in the first five minutes and edited in the last three. The main function comes before the helpers because the reviewer reads from the top, and a function that names its helpers reads like a plan. The checks live in the same file so one command runs everything. This tiny example prints ok when run.",
     "say": "**I use the same file every time, so I never spend a minute on where things go.** A README block at the top with what I asked and what I assumed. The data model next, with the rule each dict protects. The main function, which names its helpers before they exist. The helpers. And a block of asserts at the bottom under main, which runs when I run the file. When I am done the reviewer can read it top to bottom like a short document."
    },
    {
     "t": "p",
     "text": "**The 60-minute split, and what to do at each checkpoint.** The pacing is the one in section 0. This table adds the question to ask yourself at each point and what to cut."
    },
    {
     "t": "table",
     "head": [
      "Minute",
      "Do",
      "At the checkpoint, ask",
      "If you are behind"
     ],
     "rows": [
      [
       "0 to 5",
       "Read the prompt twice. Write the three buckets as comments at the top: what it must do, what goes wrong, where it stops. Say them aloud.",
       "Have I written down every assumption I would be annoyed to be wrong about?",
       "Write the assumption and move on. A stated assumption is fine; a silent one is not."
      ],
      [
       "5 to 15",
       "Data model: the dicts and the one class. Write the function signatures with docstrings and `...` bodies.",
       "Could I explain each structure by the lookup it makes cheap?",
       "Cut the class; use dicts. Keep the docstrings."
      ],
      [
       "15 to 35",
       "The core path, slow and obvious first. Run it on a six-item example you worked out by hand.",
       "Does it run, and does it give the answer I worked out by hand?",
       "This is the line that matters. A working core by minute 35. Cut everything else before this."
      ],
      [
       "35 to 45",
       "Checks: one assert per rule and per refusal, and one that compares the fast code with the slow code.",
       "Is there a check for every requirement I wrote in the first five minutes?",
       "Cut extensions, never checks."
      ],
      [
       "45 to 57",
       "The next part or the extension. State your choice in a comment before you write it.",
       "Is this the most valuable next thing, or the most fun?",
       "Stop at the part boundary. Leave a note in the README: not done, and how I would do it."
      ],
      [
       "57 to 60",
       "Read it as the reviewer. Fix names. Update the README block. Run it once more.",
       "Which line can I not explain in one sentence?",
       "Rename or comment it. Do not start anything new."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**When you are stuck.** Everyone gets stuck; the round watches how you recover. In order:"
    },
    {
     "t": "list",
     "items": [
      "Say what you are stuck on, aloud, in one sentence. Then write the sentence as a comment. Half the time that is the answer.",
      "Shrink it. Work a three-item example by hand in a comment and write what the function must return. Then make the code do that.",
      "Write the slow, obviously right version and make it pass. Tighten it later, or say that you would.",
      "Print the state at the point it goes wrong. A print is allowed. It is faster than staring.",
      "Put a five-minute cap on one bug. At the cap, write a TODO with what you know, and move to the next part.",
      "After minute 30, do not rewrite from scratch. Fix, cut or hand over the earlier part cleanly."
     ]
    },
    {
     "t": "p",
     "text": "**Leave the code reviewable.** The reviewer reads your code for 30 minutes and asks about lines. Write for that reader."
    },
    {
     "t": "list",
     "items": [
      "Names say what a thing is or returns: `count_referrals`, `_closes_loop`, `ready`, not `f`, `helper2`, `data`.",
      "A one-line docstring on every function: what it takes, what it returns, what it raises.",
      "A comment wherever you made a choice the prompt did not make: the tie rule, whether an end is included, what an empty input gives. Comment the why, not the what.",
      "No dead code and no commented-out experiments. If it is not used, delete it.",
      "The README block at the top: what I asked, what I assumed, how to run, what is not done, what I would do next.",
      "The checks finish in under a second and print ok. If a reviewer runs the file, they see ok first."
     ]
    },
    {
     "t": "p",
     "text": "**The printable checklist.** Copy it to paper or print this section. Tick it at each point of the hour."
    },
    {
     "t": "table",
     "head": [
      "When",
      "Check",
      "Done"
     ],
     "rows": [
      [
       "Before",
       "Plain editor. Python runs. Recorder on. Timer visible. Notifications off. Split on a sticky note.",
       "[ ]"
      ],
      [
       "Minute 5",
       "Three buckets written as comments, answers said aloud. Assumptions written.",
       "[ ]"
      ],
      [
       "Minute 15",
       "Data model chosen, signatures and docstrings in place. Slow plan is clear.",
       "[ ]"
      ],
      [
       "Minute 35",
       "Core path runs on a hand-worked example. This is the cut line.",
       "[ ]"
      ],
      [
       "Minute 45",
       "One assert per requirement and per refusal. Fast equals slow on random input.",
       "[ ]"
      ],
      [
       "Minute 57",
       "Names fixed. README block updated. Every line explainable. File runs and prints ok.",
       "[ ]"
      ],
      [
       "After",
       "Saved. Graded with the table below. Review drill done (see below).",
       "[ ]"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**How to grade your own hour.** Four things, 0 to 2 each, total out of 8. Be harsh: the reviewer will be. Do it right after the hour, while you remember where you hesitated."
    },
    {
     "t": "table",
     "head": [
      "Criterion",
      "0",
      "1",
      "2",
      "How to check"
     ],
     "rows": [
      [
       "Correct on the given cases",
       "The example in the prompt does not run or is wrong.",
       "The example works; one of your own does not.",
       "The prompt's example and every example you wrote give the answer you worked out by hand.",
       "Run the file. A part that does not run scores 0, even if the idea was right."
      ],
      [
       "Edge cases tested",
       "No checks, or only the happy path.",
       "Checks for the main rules; a refusal or an empty input is missing.",
       "One assert for every rule and refusal, the empty input, and a comparison with a slow version on random input.",
       "List your own requirements from minute 5. Is there an assert for each?"
      ],
      [
       "Explained in comments",
       "No README block; names like data2.",
       "README or comments, but a choice with no why.",
       "README block, a one-line docstring on every function, and a comment at every decision the prompt did not make.",
       "Cover the code and read only the comments. Can you rebuild the plan?"
      ],
      [
       "Extension-ready",
       "An extension needs a rewrite.",
       "An extension needs a change in several functions.",
       "A likely extension is a change in one place, and you can say which.",
       "Take the Live extension of a similar build below. Time it. Ten minutes or less scores 2."
      ]
     ]
    },
    {
     "t": "write",
     "id": "onsite-kit-log",
     "q": "Fill in the log for your last drill. Keep one line per drill. Look at the last three before you start the next.",
     "starter": "Prompt: \nMinute the core ran: \nAsserts written: \nGrade (out of 8): \nThe line I could not explain: \nThe one thing I do differently next time: ",
     "hint": "Be specific: a minute, a number, a line, a change. 'Be faster' is not a change; 'write the README block in the first five minutes' is.",
     "solution": "Prompt: expert-skill graph\nMinute the core ran: 41 (target 35)\nAsserts written: 9, none for the empty candidate list\nGrade: 5 out of 8 (correct 2, edge cases 1, comments 1, extension 1)\nThe line I could not explain: why level is 1 + the maximum and not the count of prerequisites\nThe one thing I do differently next time: write the data model as comments before any code, and stop at minute 35 to run the example",
     "why": "A log makes the next drill better than the last one. Specific beats ambitious: one change per drill.",
     "say": "**After each drill I write one line: the minute the core ran, how many asserts I wrote, my grade, the line I could not explain, and one change.** Before the next drill I read the last three lines. The change is always something I can do in the first five minutes, like writing the README block, not a promise to be faster."
    },
    {
     "t": "p",
     "text": "**The review drill, 30 minutes.** After the hour, do the review as well. Without it you have practised half of the round."
    },
    {
     "t": "list",
     "items": [
      "Minutes 0 to 10: read your code aloud, top to bottom, as if to a stranger. Whenever you hear yourself say 'um', the line needs a comment or a rename.",
      "Minutes 10 to 20: open the f) Review box of the build you used and answer each question from your own code. Mark the ones you could not.",
      "Minutes 20 to 30: open the Live extension box. Close the answer. Add the extension to your own file. Stop at 10 minutes; if it is not done, write down why: the design, or the typing."
     ]
    },
    {
     "t": "p",
     "text": "**The order to use the builds.** Do the referral network and the task scheduler first, with their boxes open, to learn the shape. Then pick the other builds in any order, but for each one, read only the prompt and run the full hour before you open a single box. Open the clarify box last, and compare its questions with the ones you asked. The questions you missed are the lesson."
    },
    {
     "t": "say",
     "lines": [
      "I think the hour is won in the first five minutes: I ask, I write my assumptions as comments, and I say them aloud.",
      "When I am stuck I say it, shrink it, write the slow version and keep going. I do not stare.",
      "At the end I read my code as the reviewer will, and I fix every line I cannot explain."
     ]
    }
   ]
  },
  {
   "id": "onsite-io",
   "title": "1b. Read the input, run the file",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** One first-hand report says the deciding twist of the solo hour was that the code had to run on the provided input, end to end, with nothing stubbed. So before any algorithm there are four small jobs: get the data in (a file path, stdin, or a literal in the prompt), turn text into the types you need, refuse or skip bad rows, and print an answer when the file is run. None of it is hard and all of it is easy to fumble with no search. This section is the Python for it, standard library only, written so you can type it from memory in five minutes."
    },
    {
     "t": "p",
     "text": "**Where the input comes from.** Ask in the first minute, or read the prompt for it. It is one of three, and one function covers the first two."
    },
    {
     "t": "table",
     "head": [
      "The input is",
      "You run",
      "You read it with"
     ],
     "rows": [
      [
       "A file they give you",
       "`python solution.py input.csv`",
       "`open(sys.argv[1], newline=\"\", encoding=\"utf-8\")`"
      ],
      [
       "Piped in",
       "`python solution.py < input.csv`",
       "`sys.stdin` (it is already an open file: loop over it, or pass it to `json.load` or `csv.DictReader`)"
      ],
      [
       "Typed at a prompt",
       "`python solution.py`, then type",
       "`input()` for one line; rare in this round"
      ],
      [
       "A literal in the prompt",
       "`python solution.py`",
       "Paste it as a constant at the top, and still write `load()` so the reviewer can swap in a file"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The three readers.** Lines of fields, JSON, and CSV cover every report. Each one returns plain Python (lists, tuples, dicts) and says on stderr what it skipped, so standard output stays clean for the answer."
    },
    {
     "t": "code",
     "id": "onsite-io-readers",
     "title": "Three readers, with their checks (runs as it is)",
     "code": "import csv, io, json, sys\n\ndef read_lines(stream):\n    \"\"\"'USD GBP 0.77' per line -> [('USD', 'GBP', 0.77)]. Blank lines and # comments are skipped.\"\"\"\n    out = []\n    for n, line in enumerate(stream, 1):\n        line = line.strip()\n        if not line or line.startswith(\"#\"):\n            continue\n        parts = line.split()\n        if len(parts) != 3:\n            print(f\"line {n}: expected 3 fields, got {len(parts)}\", file=sys.stderr)\n            continue\n        try:\n            out.append((parts[0], parts[1], float(parts[2])))\n        except ValueError:\n            print(f\"line {n}: bad number {parts[2]!r}\", file=sys.stderr)\n    return out\n\ndef read_json(stream):\n    \"\"\"{\"tasks\": [{\"id\": \"a\", \"deps\": [\"b\"]}]} -> the list of task dicts.\"\"\"\n    data = json.load(stream)               # json.loads(text) for a string\n    return data[\"tasks\"] if isinstance(data, dict) else data\n\ndef read_csv(stream):\n    \"\"\"A header row, then rows -> a list of dicts. Every value is a string: convert it yourself.\"\"\"\n    return [{k: (v or \"\").strip() for k, v in rec.items()} for rec in csv.DictReader(stream)]\n\nif __name__ == \"__main__\":\n    assert read_lines(io.StringIO(\"USD GBP 0.77\\n\\n# note\\nbad row\\nEUR USD x\\n\")) == [(\"USD\", \"GBP\", 0.77)]\n    assert read_json(io.StringIO('{\"tasks\": [{\"id\": \"a\", \"deps\": []}]}')) == [{\"id\": \"a\", \"deps\": []}]\n    assert read_csv(io.StringIO(\"id,score\\n a , 3\\n\")) == [{\"id\": \"a\", \"score\": \"3\"}]\n    print(\"ok\")\n"
    },
    {
     "t": "list",
     "items": [
      "**Everything arrives as text.** `int(x)` and `float(x)` raise `ValueError` on junk: catch it per row, not around the whole loop.",
      "**`line.split()` with no argument** splits on any run of spaces or tabs and drops the newline. `line.split(\",\")` keeps spaces and the newline: `strip()` first.",
      "**CSV: pass `newline=\"\"` to `open`** and let the `csv` module handle quotes and commas inside fields. Do not split CSV by hand.",
      "**`csv.DictReader`** uses the first row as keys. A short row gives `None` for the missing fields, which is why the reader does `(v or \"\").strip()`.",
      "**JSON:** `json.load(stream)` for a file, `json.loads(text)` for a string. Keys are always strings, so `{\"1\": ...}` needs `int(k)`.",
      "**Print diagnostics to stderr** (`print(..., file=sys.stderr)`), the answer to stdout. Then `python solution.py in.csv > out.txt` still shows you the counts."
     ]
    },
    {
     "t": "p",
     "text": "**The whole file, once.** The same four sections as the kit's layout, with reading as section 1. The checks run first on a small sample held in a string (`io.StringIO` turns a string into a stream, so `load` does not care where its input comes from), and then the real run happens. If a check fails, the file stops before it prints a wrong answer."
    },
    {
     "t": "code",
     "id": "onsite-io-file",
     "title": "solution.py: read, build, answer, checks (runs as it is)",
     "code": "\"\"\"Referral reach from a file. Run it with:\n    python solution.py referrals.csv        (a path as the first argument)\n    python solution.py < referrals.csv      (or the same data on stdin)\n\nCLARIFIED (asked, or assumed and said aloud):\n- A row is referrer,candidate. The first line is a header.\n- A bad row (a missing name, a self-referral, a second referrer) is skipped and counted, not an error.\nDATA MODEL: children = dict referrer -> list of candidates; parent = dict candidate -> referrer.\n\"\"\"\nimport csv\nimport sys\nfrom collections import defaultdict, deque\n\n\n# ---- 1. read ----\ndef open_input(argv):\n    \"\"\"The file named on the command line, or stdin when there is none.\"\"\"\n    if len(argv) > 1:\n        return open(argv[1], newline=\"\", encoding=\"utf-8\")\n    return sys.stdin\n\n\ndef load(stream):\n    \"\"\"Rows of the CSV as (referrer, candidate), stripped. Returns (rows, skipped).\"\"\"\n    rows, skipped = [], 0\n    for rec in csv.DictReader(stream):\n        a = (rec.get(\"referrer\") or \"\").strip()\n        b = (rec.get(\"candidate\") or \"\").strip()\n        if not a or not b:\n            skipped += 1          # a missing field\n            continue\n        rows.append((a, b))\n    return rows, skipped\n\n\n# ---- 2. build ----\ndef build(rows):\n    \"\"\"The graph, refusing a self-referral and a second referrer. Returns (children, parent, refused).\"\"\"\n    children, parent, refused = defaultdict(list), {}, 0\n    for a, b in rows:\n        if a == b or b in parent:\n            refused += 1\n            continue\n        parent[b] = a\n        children[a].append(b)\n    return children, parent, refused\n\n\n# ---- 3. answer ----\ndef reach(children, start):\n    \"\"\"How many people sit under start, by BFS.\"\"\"\n    seen, queue = set(), deque([start])\n    while queue:\n        for c in children.get(queue.popleft(), []):\n            if c not in seen:\n                seen.add(c)\n                queue.append(c)\n    return len(seen)\n\n\ndef main(argv):\n    stream = open_input(argv)\n    try:\n        rows, skipped = load(stream)\n    finally:\n        if stream is not sys.stdin:\n            stream.close()\n    children, parent, refused = build(rows)\n    print(f\"read {len(rows)} rows, skipped {skipped}, refused {refused}\", file=sys.stderr)\n    for name in sorted(children, key=lambda n: (-reach(children, n), n)):\n        print(name, reach(children, name))\n\n\n# ---- 4. checks, then the real run ----\nif __name__ == \"__main__\":\n    import io\n    sample = \"referrer,candidate\\nana,ben\\nana,cy\\nben,dee\\n,eve\\ncy,cy\\ndee,ben\\n\"\n    rows, skipped = load(io.StringIO(sample))\n    assert skipped == 1, skipped\n    children, parent, refused = build(rows)\n    assert refused == 2, refused                   # cy,cy and the second referrer for ben\n    assert reach(children, \"ana\") == 3 and reach(children, \"ben\") == 1\n    main(sys.argv)\n"
    },
    {
     "t": "table",
     "head": [
      "When it breaks",
      "What you see",
      "What to do, with no search"
     ],
     "rows": [
      [
       "Wrong path",
       "`FileNotFoundError`",
       "Run from the folder the file is in; `python -c \"import os; print(os.listdir())\"` shows what is there."
      ],
      [
       "Nothing printed",
       "The file ends without calling `main`",
       "Check the last lines sit under `if __name__ == \"__main__\":` and are indented."
      ],
      [
       "A traceback",
       "The last line is the error, the lines above are the path to it",
       "Read from the bottom: the error, then the first frame that is your file and its line number."
      ],
      [
       "A wrong number",
       "No error",
       "`python -i solution.py input.csv`, then call your functions by hand; or put `breakpoint()` on the line and use `p name`, `n`, `c`."
      ],
      [
       "A signature you forgot",
       "",
       "`python -c \"import csv; help(csv.DictReader)\"`. It is allowed: it is not a search."
      ],
      [
       "Deep recursion on a long chain",
       "`RecursionError`",
       "Use a loop with a stack or a deque; that is why the reach above is BFS."
      ]
     ]
    },
    {
     "t": "write",
     "q": "Drill, 15 minutes, no search: from a blank file, read referrals.csv (header referrer,candidate), skip rows with a missing name, refuse a self-referral and a second referrer, and print each referrer with their reach, largest first. It must run both as `python solution.py referrals.csv` and with the file piped in.",
     "starter": "\"\"\"Referral reach from a file. Run it with:\n    python solution.py referrals.csv\n    python solution.py < referrals.csv\n\"\"\"\nimport csv\nimport sys\n\n\n# ---- 1. read ----\ndef open_input(argv):\n    ...\n\n\ndef load(stream):\n    ...\n\n\n# ---- 2. build ----\n\n\n# ---- 3. answer ----\n\n\n# ---- 4. checks, then the real run ----\nif __name__ == \"__main__\":\n    ...\n",
     "hint": "open_input returns open(argv[1]) or sys.stdin. load loops over csv.DictReader(stream) and returns the good rows and a skipped count. build keeps parent (candidate to referrer) and children (referrer to list). reach is BFS over children. Checks use io.StringIO on a six-line sample, then main(sys.argv).",
     "solution": "\"\"\"Referral reach from a file. Run it with:\n    python solution.py referrals.csv        (a path as the first argument)\n    python solution.py < referrals.csv      (or the same data on stdin)\n\nCLARIFIED (asked, or assumed and said aloud):\n- A row is referrer,candidate. The first line is a header.\n- A bad row (a missing name, a self-referral, a second referrer) is skipped and counted, not an error.\nDATA MODEL: children = dict referrer -> list of candidates; parent = dict candidate -> referrer.\n\"\"\"\nimport csv\nimport sys\nfrom collections import defaultdict, deque\n\n\n# ---- 1. read ----\ndef open_input(argv):\n    \"\"\"The file named on the command line, or stdin when there is none.\"\"\"\n    if len(argv) > 1:\n        return open(argv[1], newline=\"\", encoding=\"utf-8\")\n    return sys.stdin\n\n\ndef load(stream):\n    \"\"\"Rows of the CSV as (referrer, candidate), stripped. Returns (rows, skipped).\"\"\"\n    rows, skipped = [], 0\n    for rec in csv.DictReader(stream):\n        a = (rec.get(\"referrer\") or \"\").strip()\n        b = (rec.get(\"candidate\") or \"\").strip()\n        if not a or not b:\n            skipped += 1          # a missing field\n            continue\n        rows.append((a, b))\n    return rows, skipped\n\n\n# ---- 2. build ----\ndef build(rows):\n    \"\"\"The graph, refusing a self-referral and a second referrer. Returns (children, parent, refused).\"\"\"\n    children, parent, refused = defaultdict(list), {}, 0\n    for a, b in rows:\n        if a == b or b in parent:\n            refused += 1\n            continue\n        parent[b] = a\n        children[a].append(b)\n    return children, parent, refused\n\n\n# ---- 3. answer ----\ndef reach(children, start):\n    \"\"\"How many people sit under start, by BFS.\"\"\"\n    seen, queue = set(), deque([start])\n    while queue:\n        for c in children.get(queue.popleft(), []):\n            if c not in seen:\n                seen.add(c)\n                queue.append(c)\n    return len(seen)\n\n\ndef main(argv):\n    stream = open_input(argv)\n    try:\n        rows, skipped = load(stream)\n    finally:\n        if stream is not sys.stdin:\n            stream.close()\n    children, parent, refused = build(rows)\n    print(f\"read {len(rows)} rows, skipped {skipped}, refused {refused}\", file=sys.stderr)\n    for name in sorted(children, key=lambda n: (-reach(children, n), n)):\n        print(name, reach(children, name))\n\n\n# ---- 4. checks, then the real run ----\nif __name__ == \"__main__\":\n    import io\n    sample = \"referrer,candidate\\nana,ben\\nana,cy\\nben,dee\\n,eve\\ncy,cy\\ndee,ben\\n\"\n    rows, skipped = load(io.StringIO(sample))\n    assert skipped == 1, skipped\n    children, parent, refused = build(rows)\n    assert refused == 2, refused                   # cy,cy and the second referrer for ben\n    assert reach(children, \"ana\") == 3 and reach(children, \"ben\") == 1\n    main(sys.argv)\n",
     "why": "The reading is separate from the building, so each has its own check and the reviewer can see where a bad row goes. The loader takes a stream, not a path, which is what lets one function serve a file, stdin and a test string. The real referral problem adds the cycle check (walk up from the referrer before adding an edge); here a second referrer is refused, which already keeps this small graph a forest.",
     "say": "**I get the data in first and print what I built, before any algorithm.** One function opens the file named on the command line or falls back to stdin. One reads rows and counts what it skipped. One builds the graph and refuses what breaks a rule. Then the answer, and asserts on a small sample that run before the real input. So when I run it on their file, the first line tells me how many rows I read and how many I refused."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": true,
       "label": "Python docs: csv (reader, DictReader, the newline rule)",
       "url": "https://docs.python.org/3/library/csv.html",
       "m": 5,
       "why": "The two calls you need and why open() takes newline=\"\". Read the DictReader paragraph once."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Python docs: json (load, loads, what maps to what)",
       "url": "https://docs.python.org/3/library/json.html",
       "m": 5,
       "why": "The conversion table: JSON objects become dicts with string keys, arrays become lists."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Python docs: sys (argv, stdin, stderr)",
       "url": "https://docs.python.org/3/library/sys.html",
       "m": 3,
       "why": "Only three names from this page: sys.argv, sys.stdin, sys.stderr."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-scheduler",
   "title": "3. Task scheduler",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** You get tasks and what each needs finished first. Return an order in which they can all run, and refuse a loop. Then a second constraint arrives: durations, a limited number of workers, priorities, or failures and retries. 45 minutes, alone, nothing to ask. This is Course Schedule II with a business name. The prompt is reconstructed from reports, and the second part is a reading, not a fact."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**It is a DAG, and the order is a topological sort.** Everything else is a variation on the same pass.",
      "**What is undefined:** which way a need points, what a loop does, what a bad name does, and what the second constraint is.",
      "**The size:** about 10,000 tasks means iterative code, no recursion.",
      "**The trap:** a loop is a data error, not a rare case. Leftover tasks after the pass are the sign, and a message that names the loop is the polish.",
      "**Part 2 is a test of extension:** it should reuse the order, not rewrite it."
     ]
    },
    {
     "t": "table",
     "head": [
      "The gap in the prompt",
      "I decide, and write at the top",
      "If the reviewer wanted otherwise"
     ],
     "rows": [
      [
       "Which way does 'A: [B]' point?",
       "deps[t] is what t needs first. B runs before A.",
       "Flip the map; users already holds the other direction."
      ],
      [
       "A need that is not a task",
       "Raise KeyError naming both, before anything runs.",
       "Skip it with a warning."
      ],
      [
       "A loop (including a task needing itself)",
       "Raise CycleError naming the loop. Nothing runs.",
       "Return the partial order plus the stuck set."
      ],
      [
       "A need listed twice",
       "Counts once (the set).",
       "Reject as bad input."
      ],
      [
       "Order among tasks that are ready together",
       "Lower priority number, then name. Same answer every run.",
       "Input order, or any order."
      ],
      [
       "What the second constraint is: durations, workers, priorities, failures",
       "Durations and the slowest chain first, workers if time. Written at the top.",
       "Same skeleton: change the heap key or what rides on a task."
      ],
      [
       "Zero or negative days",
       "Zero allowed, negative raises.",
       "Allow it."
      ],
      [
       "Empty input, tasks with no links",
       "Empty gives []. Unlinked tasks all appear.",
       "-"
      ],
      [
       "Size",
       "Up to ~10,000 tasks: iterative, no recursion.",
       "DFS with three colours, recursion limit permitting."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Count how many tasks each one still waits for, queue those at zero, and let each finished task lower its waiters. That is Kahn's algorithm at O(V + E). Two facts do the rest: fewer tasks out than in means a loop, and every second constraint is a small change to the same pass. A priority is the heap key. Durations add finish = max(finish of needs) + days, which is the longest path in a DAG. Workers add a second heap of running tasks."
    },
    {
     "t": "list",
     "items": [
      "**The hour, in order.**",
      "**5 minutes:** read both parts. List what is undefined: direction, loops, ties, what part 2 means.",
      "**5 minutes:** write the table decisions as a comment at the top.",
      "**Data model:** plain dicts, deps and days. No Task class.",
      "**Part 1:** run_order with its two checks. Run it on the sample, then a loop, then an unknown need.",
      "**Part 2:** finish_times on the same order. Check the total by hand on three tasks.",
      "**Checks:** asserts for empty, repeated need, self-need and a random graph where every need comes first.",
      "**If time is left:** the worker version, or the retry rule. Otherwise say it in a comment."
     ]
    },
    {
     "t": "write",
     "id": "onsite-scheduler-a",
     "q": "Try it first. Say the order algorithm in numbered steps, then what the second constraint changes.",
     "starter": "1. \n2. \n3. \n\nSecond constraint:\n",
     "hint": "Count what each task waits for, keep a reverse map, queue the tasks at zero. If fewer come out than exist, there is a loop.",
     "solution": "1. waiting[t] = how many different tasks t needs. users[d] = who waits for d.\n2. Put every task with waiting 0 into the ready heap.\n3. Pop one, add it to the order, lower the count of each waiter, push those that reach 0.\n4. If fewer tasks came out than exist, the rest are on or behind a loop. Follow stuck needs until a name repeats: that is the loop.\nSecond constraint: priority is the heap key; durations add finish = max(finish of needs) + days; workers add a second heap of running tasks. O(V + E) for the order.",
     "say": [
      "**I count what each task still waits for and queue the ones at zero.** Finishing a task lowers its waiters. If fewer tasks come out than exist, the rest are on or behind a loop, and I name it by following stuck needs until a name repeats.",
      "Whatever the second constraint is, it only changes what the ready queue is keyed on, or what I carry along a task. I would write which one I assumed at the top."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-scheduler-p",
     "title": "Task scheduler: order, loop, then durations",
     "source": "Mercor-style scheduler round, rebuilt",
     "d": "medium",
     "lc": "course-schedule-ii",
     "yt": [
      "Akt3glAwyfY",
      "NeetCode",
      18
     ],
     "minutes": 45,
     "why": "The core is Kahn's algorithm. The second part changes what you carry along it.",
     "statement": "Part 1. Tasks with a list of the tasks each needs first. Return an order in which all can run. A loop raises an error naming it and runs nothing. A need that is not a task raises an error naming both.\n\nPart 2 (your pick, written at the top): each task takes some days; return the total time and the slowest chain.",
     "examples": [
      {
       "input": "build needs lint and fetch; lint needs fetch; test needs build; docs needs nothing",
       "output": "docs, fetch, lint, build, test",
       "note": "docs and fetch are ready together and pop by name. Any order with fetch before lint before build before test is valid."
      },
      {
       "input": "a needs b, b needs c, c needs a, d needs nothing",
       "output": "CycleError: a -> b -> c -> a",
       "note": "d is fine, but nothing runs because the loop is found first."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 10,000 tasks, so no recursion",
      "a need may repeat in a list"
     ],
     "starter": "def run_order(deps, priority=None):\n    ...\n",
     "hints": [
      "A task can run when everything it needs is done. Count how many it still waits for.",
      "Also keep a reverse map, task to the tasks that wait for it. At zero, queue it.",
      "Fewer tasks out than in means a loop. For durations, finish = max(finish of needs) + days."
     ],
     "solution": "import heapq\n\n\nclass CycleError(ValueError):\n    pass\n\n\ndef run_order(deps, priority=None):\n    # deps: task -> tasks it needs first. priority: task -> number, lower goes first among ready tasks.\n    for t, needs in deps.items():\n        for d in needs:\n            if d not in deps:\n                raise KeyError(f\"{t} needs {d}, which is not a task\")\n    waiting = {t: len(set(n)) for t, n in deps.items()}  # set: a repeated need counts once\n    users = {t: [] for t in deps}                         # users[d]: tasks waiting for d\n    for t, needs in deps.items():\n        for d in set(needs):\n            users[d].append(t)\n    key = (lambda t: priority[t]) if priority else (lambda t: 0)\n    ready = [(key(t), t) for t in deps if waiting[t] == 0]\n    heapq.heapify(ready)                                  # ties break by name: same answer every run\n    order = []\n    while ready:\n        _, t = heapq.heappop(ready)\n        order.append(t)\n        for u in users[t]:                                # t is done: u waits for one fewer\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                heapq.heappush(ready, (key(u), u))\n    if len(order) < len(deps):                            # leftovers are on a loop or behind one\n        raise CycleError(\" -> \".join(find_cycle(deps, waiting)))\n    return order\n\n\ndef find_cycle(deps, waiting):\n    stuck = [t for t, n in waiting.items() if n > 0]\n    path, t = [], stuck[0]\n    while t not in path:                                  # every stuck task needs a stuck task\n        path.append(t)\n        t = next(d for d in deps[t] if waiting[d] > 0)\n    return path[path.index(t):] + [t]\n\n\ndef finish_times(deps, days):\n    # second constraint: each task takes days[t]. Longest path in a DAG, in the same order.\n    finish, via = {}, {}\n    for t in run_order(deps):\n        via[t] = max(deps[t], key=lambda d: finish[d], default=None)   # the need that ends last\n        finish[t] = (finish[via[t]] if via[t] is not None else 0) + days[t]\n    path, t = [], max(finish, key=finish.get, default=None)\n    while t is not None:                                  # walk back the slowest chain\n        path.append(t)\n        t = via[t]\n    return (finish[path[0]] if path else 0), path[::-1]\n",
     "tests": "deps = {\"build\": [\"lint\", \"fetch\"], \"lint\": [\"fetch\"], \"fetch\": [], \"test\": [\"build\"], \"docs\": []}\nprint(\"order:\", run_order(deps))\nprint(\"docs last:\", run_order(deps, {\"fetch\": 0, \"lint\": 1, \"build\": 2, \"test\": 3, \"docs\": 9}))\nfor bad in ({\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"a\"], \"d\": []}, {\"a\": [\"a\"]}, {\"x\": [\"a\"], \"a\": [\"b\"], \"b\": [\"a\"]}):\n    try:\n        run_order(bad)\n    except CycleError as e:\n        print(\"cycle:\", e)\ntry:\n    run_order({\"a\": [\"zz\"]})\nexcept KeyError as e:\n    print(\"unknown:\", e)\nassert run_order({\"a\": [], \"b\": [\"a\", \"a\"]}) == [\"a\", \"b\"] and run_order({}) == []\ndays = {\"fetch\": 2, \"lint\": 1, \"build\": 4, \"test\": 3, \"docs\": 2}\nprint(\"duration, critical path:\", finish_times(deps, days))\nassert finish_times(deps, days) == (10, [\"fetch\", \"lint\", \"build\", \"test\"])\nimport random\nrng = random.Random(5)\nfor _ in range(300):\n    names = [f\"t{i}\" for i in range(rng.randint(1, 9))]\n    d = {t: [x for x in names if rng.random() < 0.25] for t in names}\n    try:\n        order = run_order(d)\n    except CycleError:\n        continue\n    pos = {t: i for i, t in enumerate(order)}\n    assert sorted(order) == sorted(names) and all(pos[x] < pos[t] for t in d for x in d[t])\nprint(\"300 random graphs: every need comes before its task\")",
     "complexity": "run_order is O((V + E) log V) with the heap, O(V + E) with a plain queue. find_cycle is O(V). finish_times adds O(V + E).",
     "explain": [
      "waiting counts different needs; the set makes a repeat count once. users lets a finished task reach only its waiters.",
      "The heap holds tasks ready now. Its key is the priority, then the name, so ties never depend on dict order.",
      "Everything is checked before anything runs, so a bad input fails with a clear message.",
      "finish_times reuses the order: a task's finish is known once its needs are done, and via remembers which need ended last."
     ]
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "order: ['docs', 'fetch', 'lint', 'build', 'test']\ndocs last: ['fetch', 'lint', 'build', 'test', 'docs']\ncycle: a -> b -> c -> a\ncycle: a -> a\ncycle: a -> b -> a\nunknown: 'a needs zz, which is not a task'\nduration, critical path: (10, ['fetch', 'lint', 'build', 'test'])\n300 random graphs: every need comes before its task"
    },
    {
     "t": "code",
     "title": "Follow-up: only w people (runs together with the solution above)",
     "code": "def with_workers(deps, days, w):\n    # only w people. Start the ready task with the longest chain behind it, whenever someone is free.\n    users = {t: [] for t in deps}\n    for t, needs in deps.items():\n        for d in set(needs):\n            users[d].append(t)\n    tail = {}                                             # own days + the longest chain after it\n    for t in reversed(run_order(deps)):\n        tail[t] = days[t] + max((tail[u] for u in users[t]), default=0)\n    waiting = {t: len(set(n)) for t, n in deps.items()}\n    ready = [(-tail[t], t) for t in deps if waiting[t] == 0]\n    heapq.heapify(ready)\n    running, now, free, start = [], 0, w, {}\n    while ready or running:\n        while ready and free:\n            _, t = heapq.heappop(ready)\n            start[t] = now\n            heapq.heappush(running, (now + days[t], t))\n            free -= 1\n        now = running[0][0]                               # jump to the next finish\n        while running and running[0][0] == now:\n            _, t = heapq.heappop(running)\n            free += 1\n            for u in users[t]:\n                waiting[u] -= 1\n                if waiting[u] == 0:\n                    heapq.heappush(ready, (-tail[u], u))\n    return max((start[t] + days[t] for t in deps), default=0)\n\n\nfor w in (1, 2, 5):\n    print(w, \"people:\", with_workers(deps, days, w), \"days\")\nassert with_workers(deps, days, 1) == sum(days.values())\nassert with_workers(deps, days, 5) == finish_times(deps, days)[0]"
    },
    {
     "t": "code",
     "title": "Output of the workers block",
     "code": "1 people: 12 days\n2 people: 10 days\n5 people: 10 days"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "Run independent tasks at the same time",
       "Process in waves: everything ready now, then lower the counts. Or start each task when ready.",
       "Same O(V + E). Waves are easier to reason about."
      ],
      [
       "Tasks take days: how long, and which tasks matter",
       "finish_times above: the slowest chain.",
       "O(V + E) extra."
      ],
      [
       "Only w people",
       "Second heap of running tasks, start the ready task with the longest chain behind it. Block above.",
       "O((V + E) log V)."
      ],
      [
       "A task can fail",
       "Retry up to a cap. Still failing: mark it failed and skip everything behind it, naming the failure that blocked it.",
       "O(V + E) plus at most 1 + retries calls per task."
      ],
      [
       "Retries must be safe",
       "Task is idempotent, or carries an idempotency key. Retry only errors that can pass, with backoff and jitter.",
       "Code and discipline, no new structure."
      ],
      [
       "Rerun after a crash",
       "Save each task's status when it changes. On restart treat ok as done.",
       "One write per task."
      ],
      [
       "Slack: which tasks could slip",
       "Backward pass in reverse order: late finish = min(late finish of waiters - their days).",
       "O(V + E)."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "The code review: every decision, and how to stand behind it",
     "prose": true,
     "items": [
      {
       "q": "1. Counting waits, not depth-first search",
       "a": "**Decided.** Kahn's algorithm: counts and a queue.\n\n**Instead of.** A DFS with three colours.\n\n**Why.** It gives the order and the loop with no recursion, so a long chain cannot hit Python's limit of about a thousand frames. The leftover tasks tell me a loop exists.\n\n**What it costs.** The loop is found only after the pass, and I rebuild its path from the leftovers.\n\n**If they push.** \"A DFS is also fine: meeting a task still being visited is the loop. I picked counting because the same pass gives me waves and durations.\""
      },
      {
       "q": "2. A heap for the ready set",
       "a": "**Decided.** A heap keyed by (priority, name).\n\n**Instead of.** A plain deque.\n\n**Why.** Ties would depend on dict order otherwise. With the name as the last key the output is the same on every run, and a priority costs nothing extra.\n\n**What it costs.** O(log V) per task instead of O(1).\n\n**If they push.** \"With no priority a deque is enough and O(V + E). I kept the heap so the priority part is one lambda.\""
      },
      {
       "q": "3. Check everything before running anything",
       "a": "**Decided.** Unknown needs and loops raise before the first task runs.\n\n**Instead of.** Failing halfway.\n\n**Why.** A half-run plan with side effects is worse than a clear error up front. The message names both tasks, or the loop.\n\n**What it costs.** A pass over the input first.\n\n**If they push.** \"If partial progress is wanted, return the order of the runnable tasks and the stuck set.\""
      },
      {
       "q": "4. The loop is named, not only detected",
       "a": "**Decided.** Follow a stuck need from a leftover task until a name repeats.\n\n**Instead of.** Raising a bare error.\n\n**Why.** Every leftover task has a leftover need, so the walk must end in a loop. A named loop is something a person can fix.\n\n**What it costs.** It names one loop, not all of them.\n\n**If they push.** \"All of them is strongly connected components: Tarjan, O(V + E). I would name it and not write it.\""
      },
      {
       "q": "5. Durations ride on the same order",
       "a": "**Decided.** finish = max(finish of needs) + days, and via remembers which need ended last.\n\n**Instead of.** A second traversal, or recursion with memory.\n\n**Why.** Once a task's needs are done their finish is known, so one pass is enough. via gives the slowest chain by walking back.\n\n**What it costs.** Only one slowest chain is returned when several tie.\n\n**If they push.** \"For every task on any slowest chain, add the backward pass for slack: zero slack means critical.\""
      },
      {
       "q": "6. Workers: greedy, and not claimed optimal",
       "a": "**Decided.** Start the ready task with the longest chain behind it.\n\n**Instead of.** Claiming the best schedule.\n\n**Why.** Minimising the finish time with two or more workers is NP-hard. This list scheduling never takes more than total days / w + the slowest chain, and it is easy to explain.\n\n**What it costs.** Not always the best possible.\n\n**If they push.** \"Exact is a search or an integer program. For an hour, greedy with its bound.\""
      },
      {
       "q": "7. Plain dicts and functions",
       "a": "**Decided.** deps is a dict of lists, days a dict. No Task class.\n\n**Instead of.** A Task class with a status.\n\n**Why.** The data is two maps and the logic is one pass. A class would hold fields nothing reads.\n\n**What it costs.** No encapsulation.\n\n**If they push.** \"If tasks carried state, such as retries and status, I would add a small dataclass for the result. Not before.\""
      },
      {
       "q": "8. What I tested",
       "a": "**Decided.** Plain asserts: the sample, each error, an empty input, a repeated need, and 300 random graphs where every need comes before its task.\n\n**Instead of.** A test framework.\n\n**Why.** None is provided, and exact outputs are easy to write because everything is deterministic.\n\n**What it costs.** Does not cover big inputs.\n\n**If they push.** \"I did not time 10,000 tasks. The loops are linear, so I expect it to be fine.\""
      },
      {
       "q": "What I would do with another hour",
       "a": "1. The failure and retry rule, with status and which task blocked each skipped one.\n\n2. Waves, so independent tasks run together.\n\n3. Slack, so the reviewer can see which tasks may slip.\n\n4. A real test file with a 10,000 task chain.\n\nClose with one plain line: \"I kept it small so every part runs, and I know where each part breaks first.\""
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Course Schedule",
       "d": "medium",
       "lc": "course-schedule",
       "yt": [
        "EgI5nU9etnU",
        "NeetCode",
        16
       ],
       "why": "Loop detection with a leftover count. This is part 1 as yes or no."
      },
      {
       "n": "Course Schedule II",
       "d": "medium",
       "lc": "course-schedule-ii",
       "yt": [
        "Akt3glAwyfY",
        "NeetCode",
        18
       ],
       "why": "Return the order, not only yes or no. Exactly what run_order returns."
      },
      {
       "n": "Parallel Courses III",
       "d": "hard",
       "lc": "parallel-courses-iii",
       "yt": [
        "a_NlRPnqCrg",
        "NeetCodeIO",
        12
       ],
       "why": "The harder follow-up: with unlimited workers, how long does the whole job take? The longest chain, found in the same pass. It is what 'run independent tasks together' turns into."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-skillgraph",
   "title": "4. Expert-skill graph",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** A file describes a small domain: here skills with their prerequisites, and experts with their skills. Part 1 parses it, part 2 builds the structure and rejects a bad one, part 3 answers queries, part 4 answers the real question: which experts can review a candidate. 60 minutes, alone, nothing to ask, four parts each easy to medium. Reported variants: the same shape over referrals, tasks or products. The prompt is reconstructed from reports."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**It runs like a product on their input.** Pace and completeness across all four parts count more than one clever idea.",
      "**Read all four parts first,** then pick data structures that serve every part: two dicts, skill to prerequisites and expert to skills.",
      "**Hidden structure:** a DAG. Order, closure and level all come from one topological pass.",
      "**What is undefined:** the format details, what a bad line does, what holding a skill implies, all or any, what level means.",
      "**The trap:** parsing last. Write the parser first and print what it built, or every later bug hides behind it."
     ]
    },
    {
     "t": "table",
     "head": [
      "The gap in the prompt",
      "I decide, and write at the top",
      "If the reviewer wanted otherwise"
     ],
     "rows": [
      [
       "The file format: separators, comments, blank lines",
       "Two sections split by ---, lines as name,a;b, # comments and blank lines skipped.",
       "csv.reader or json.load. Only parse changes."
      ],
      [
       "A bad line: empty name, repeated name",
       "Skip it, count it, first repeat wins.",
       "Raise on the first, or the last one wins."
      ],
      [
       "A prerequisite that is not in the catalog",
       "Raise KeyError naming both skills.",
       "Add it as a skill with no prerequisites."
      ],
      [
       "A loop, or a skill that needs itself",
       "Raise CycleError naming the loop, at build time.",
       "Allow it and group each loop into one node."
      ],
      [
       "An expert skill that is not in the catalog",
       "Drop it and count it.",
       "Raise, or keep it as an unknown skill."
      ],
      [
       "Does holding a skill mean holding what it builds on?",
       "Yes: covers adds everything below.",
       "No: exact match, set(candidate) <= set(held)."
      ],
      [
       "Can review: every candidate skill, or one?",
       "Every skill.",
       "any(): a one-line change, and I would rename the method."
      ],
      [
       "How advanced is a skill?",
       "The longest chain under it.",
       "The count of all prerequisites, or a given number."
      ],
      [
       "An empty candidate list",
       "Everyone can review.",
       "Nobody can."
      ],
      [
       "File size",
       "Small: read the whole text.",
       "Stream the lines. parse already works line by line."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Two ideas. First, split the work into stages that each fail their own way: parse the syntax and count bad lines, build and validate the meaning, then answer queries. After that the logic never meets a bad input. Second, the skills form a DAG, so in topological order a skill's closure is its prerequisites' closures plus themselves, and its level is one more than the highest prerequisite. Then needs is a lookup, and can_review is a subset check against what the reviewer covers."
    },
    {
     "t": "list",
     "items": [
      "**The hour, in order.**",
      "**5 minutes:** read all four parts. Pick dicts that serve every part: skill to prerequisites, expert to skills.",
      "**5 minutes:** write the table decisions as a comment at the top.",
      "**Part 1, the parser first:** print what it built and how many lines it skipped, before any logic. Run it.",
      "**Part 2:** SkillGraph with the two checks and the order. Print the levels.",
      "**Parts 3 and 4:** requires, needs, covers, reviewers. Check one candidate by hand.",
      "**Checks:** asserts for each error, an empty candidate and a repeated prerequisite, then the real run on the file.",
      "**If a part is cut,** leave one line in the file saying what is missing. Part 1 working beats all four half done."
     ]
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-a",
     "q": "Try it first. Write the stages from file to answer, and what each stage does with a bad line.",
     "starter": "Stage 1:\n\nStage 2:\n\nStage 3:\n\nCost:\n",
     "hint": "Syntax first (split lines), then meaning (unknown names, loops), then the queries. Each stage fails in its own way.",
     "solution": "1. parse: split the file, skip blanks and comments, split each line on the first comma and on semicolons. A bad line (empty or repeated name) is skipped and counted.\n2. SkillGraph: check every prerequisite is a skill, order the skills by counting what each waits for, and name a loop if skills are left over. Then, in that order, each skill's closure is its prerequisites' closures plus themselves.\n3. load: drop expert skills not in the catalog, counted. Print the counts before any query.\n4. Queries read the closure: needs is a lookup, can_review is a subset check against covers.\nCost: parse O(lines), order O(V + E), closure O(V x E) worst case.",
     "say": [
      "**I read the file in three stages: parse, build, load.** Each stage fails its own way: a bad line is skipped and counted, a bad catalog raises with the names, and the queries can trust what they get.",
      "The closure is stored in topological order, so needs is a lookup and can_review is a subset check. I wrote the rules I assumed at the top of the file."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-skillgraph-p",
     "title": "Skills from a file: parse, build, query, review",
     "source": "Mercor-style file build, rebuilt (four parts)",
     "d": "medium",
     "minutes": 60,
     "why": "A file in, answers out. Parsing and validation come first, then a small graph idea. Pace across the parts matters more than any one hard step.",
     "statement": "A file lists skills with their prerequisites, a line with ---, then experts with their skills. Part 1: parse it, skipping and counting bad lines. Part 2: build the skill graph, rejecting an unknown prerequisite or a loop, naming it. Part 3: requires, needs and the level of a skill. Part 4: which experts can review a candidate who lists some skills.",
     "examples": [
      {
       "input": "api builds on django and postgres; django on python and http; postgres on sql",
       "output": "api requires: django, http, postgres, python, sql",
       "note": "All depths, sorted."
      },
      {
       "input": "experts ana [api], bo [tuning, django], cy [python], dee [api, tuning]; candidate [django, postgres]",
       "output": "ana, bo, dee",
       "note": "bo holds tuning, which builds on postgres, and django. cy covers neither."
      },
      {
       "input": "a builds on b, b on c, c on a",
       "output": "CycleError: a -> b -> c -> a",
       "note": "The loop is named."
      }
     ],
     "constraints": [
      "standard library only",
      "read the whole file as text",
      "a prerequisite may repeat on a line"
     ],
     "starter": "def parse(text):\n    ...\n\nclass SkillGraph:\n    ...\n",
     "hints": [
      "Split lines, then split each on the first comma and on semicolons. Count what you skip.",
      "Order skills by counting what each still waits for. Leftovers mean a loop.",
      "In that order, a skill's closure is the union of its prerequisites' closures plus themselves."
     ],
     "solution": "from collections import deque\n\n\nclass CycleError(ValueError):\n    pass\n\n\ndef parse(text):\n    # Stage 1, syntax only. Catalog lines \"skill,pre1;pre2\", a line \"---\", then expert lines \"name,skill1;skill2\".\n    # Blank lines and # comments are skipped. An empty or repeated name is skipped and counted: the first one wins.\n    prereqs, experts, bad = {}, {}, 0\n    target = prereqs\n    for line in text.splitlines():\n        line = line.strip()\n        if not line or line.startswith(\"#\"):\n            continue\n        if line == \"---\":\n            target = experts\n            continue\n        name, _, rest = line.partition(\",\")\n        name = name.strip()\n        if not name or name in target:\n            bad += 1\n            continue\n        target[name] = [x.strip() for x in rest.split(\";\") if x.strip()]\n    return prereqs, experts, bad\n\n\nclass SkillGraph:\n    # Stage 2, meaning. A bad catalog fails here, so every query below can trust it.\n    def __init__(self, prereqs):\n        for s, ps in prereqs.items():\n            for p in ps:\n                if p not in prereqs:\n                    raise KeyError(f\"{s} builds on {p}, which is not in the catalog\")\n        self.direct = {s: list(dict.fromkeys(ps)) for s, ps in prereqs.items()}  # a repeat counts once\n        waiting = {s: len(ps) for s, ps in self.direct.items()}\n        users = {s: [] for s in self.direct}\n        for s, ps in self.direct.items():\n            for p in ps:\n                users[p].append(s)\n        ready = deque(s for s in self.direct if waiting[s] == 0)\n        self.order = []                                   # every skill after its prerequisites\n        while ready:\n            s = ready.popleft()\n            self.order.append(s)\n            for u in users[s]:\n                waiting[u] -= 1\n                if waiting[u] == 0:\n                    ready.append(u)\n        if len(self.order) < len(self.direct):            # leftovers are on a loop or above one\n            raise CycleError(\" -> \".join(find_loop(self.direct, waiting)))\n        self.below, self.level = {}, {}                   # everything a skill needs, and its longest chain\n        for s in self.order:                              # prerequisites are done first\n            self.below[s], self.level[s] = set(), 0\n            for p in self.direct[s]:\n                self.below[s] |= self.below[p] | {p}\n                self.level[s] = max(self.level[s], self.level[p] + 1)\n\n    def requires(self, skill):\n        return sorted(self.below[skill])\n\n    def needs(self, a, b):                                # is a required, at any depth, for b?\n        return a in self.below[b]\n\n    def covers(self, held):                               # holding a skill means holding what it builds on\n        have = set(held)\n        for s in held:\n            have |= self.below[s]\n        return have\n\n    def can_review(self, reviewer, candidate):            # every skill the candidate lists\n        return set(candidate) <= self.covers(reviewer)\n\n    def reviewers(self, candidate, experts):\n        return sorted(n for n, held in experts.items() if self.can_review(held, candidate))\n\n\ndef find_loop(direct, waiting):\n    path, s = [], next(s for s, n in waiting.items() if n > 0)\n    while s not in path:                                  # a leftover skill needs a leftover skill\n        path.append(s)\n        s = next(p for p in direct[s] if waiting[p] > 0)\n    return path[path.index(s):] + [s]\n\n\ndef load(text):\n    # Stage 3: parse, build, then drop expert skills that are not in the catalog, counted.\n    prereqs, experts, bad = parse(text)\n    g = SkillGraph(prereqs)\n    for name, held in experts.items():\n        keep = [s for s in held if s in g.direct]\n        bad += len(held) - len(keep)\n        experts[name] = keep\n    return g, experts, bad\n",
     "tests": "FILE = \"\"\"\n# skills\npython,\nsql,\nhttp,\ndjango,python;http\npostgres,sql\ntuning,postgres\napi,django;postgres\n---\n# experts\nana,api\nbo,tuning;django\ncy,python\ndee,api;tuning;rust\n,oops\ncy,sql\n\"\"\"\ng, experts, bad = load(FILE)\nprint(\"skills:\", len(g.direct), \"experts:\", len(experts), \"bad lines:\", bad)\nprint(\"api requires:\", g.requires(\"api\"))\nprint(\"levels:\", {s: g.level[s] for s in g.order})\nassert g.needs(\"sql\", \"api\") and not g.needs(\"tuning\", \"api\") and not g.needs(\"api\", \"api\")\nprint(\"reviewers for [django, postgres]:\", g.reviewers([\"django\", \"postgres\"], experts))\nprint(\"reviewers for [tuning]:\", g.reviewers([\"tuning\"], experts))\nassert g.reviewers([], experts) == [\"ana\", \"bo\", \"cy\", \"dee\"]     # empty candidate: everyone\nfor text in (\"a,b\\nb,c\\nc,a\\nd,\", \"a,a\", \"a,zz\"):\n    try:\n        load(text)\n    except (CycleError, KeyError) as e:\n        print(type(e).__name__ + \":\", e)\nassert load(\"a,\\nb,a;a\")[0].level[\"b\"] == 1                      # a repeated prerequisite counts once\nimport random\nrng = random.Random(11)\nfor _ in range(300):\n    names = [f\"s{i}\" for i in range(rng.randint(1, 9))]\n    cat = {s: [p for p in names if rng.random() < 0.2] for s in names}\n    try:\n        h = SkillGraph(cat)\n    except CycleError:\n        continue\n    assert all(h.order.index(p) < h.order.index(s) for s in cat for p in cat[s])\nprint(\"300 random catalogs: every prerequisite comes first\")",
     "complexity": "parse is O(lines). The order is O(V + E). The closure is O(V x E) time and O(V squared) space in the worst case. requires sorts its answer. can_review is O(candidate skills) after covers.",
     "explain": [
      "parse never raises on a bad line. It counts it, so one typo does not throw away a good file.",
      "SkillGraph checks every name first, so a typo fails with both names rather than a KeyError later.",
      "The order counts what each skill waits for. If fewer skills come out than exist, the rest are on a loop or above one, and find_loop follows them until a name repeats.",
      "below[s] is built in order, so each prerequisite's closure is ready when it is needed. level is the longest chain under the skill.",
      "load is the only place that knows about the file and the graph together. Expert skills not in the catalog are dropped and counted."
     ],
     "lc": "course-schedule-iv",
     "yt": [
      "cEW05ofxhn0",
      "NeetCodeIO",
      18
     ]
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "skills: 7 experts: 4 bad lines: 3\napi requires: ['django', 'http', 'postgres', 'python', 'sql']\nlevels: {'python': 0, 'sql': 0, 'http': 0, 'postgres': 1, 'django': 1, 'tuning': 2, 'api': 2}\nreviewers for [django, postgres]: ['ana', 'bo', 'dee']\nreviewers for [tuning]: ['bo', 'dee']\nCycleError: a -> b -> c -> a\nCycleError: a -> a\nKeyError: 'a builds on zz, which is not in the catalog'\n300 random catalogs: every prerequisite comes first"
    },
    {
     "t": "code",
     "title": "Follow-up: add a link online, and suggest the next skills (runs together with the solution above)",
     "code": "def next_skills(graph, held):\n    # what to learn next: not yet covered, and every prerequisite already covered\n    have = graph.covers(held)\n    return [s for s in graph.order if s not in have and all(p in have for p in graph.direct[s])]\n\n\ndef add_prereq(graph, skill, prereq):\n    # a link arrives online: refuse it if it would close a loop, else rebuild (simplest correct)\n    if skill == prereq or skill in graph.below[prereq]:\n        raise CycleError(f\"{skill} -> {prereq} would close a loop\")\n    new = {s: list(ps) for s, ps in graph.direct.items()}\n    new[skill].append(prereq)\n    return SkillGraph(new)\n\n\nprint(\"cy holds python, next:\", next_skills(g, [\"python\"]))\ng2 = add_prereq(g, \"sql\", \"python\")\nprint(\"sql level before and after:\", g.level[\"sql\"], g2.level[\"sql\"], \"| tuning:\", g.level[\"tuning\"], g2.level[\"tuning\"])\nfor edge in ((\"python\", \"api\"), (\"python\", \"python\")):\n    try:\n        add_prereq(g, *edge)\n    except CycleError as e:\n        print(\"refused:\", e)"
    },
    {
     "t": "code",
     "title": "Output of the follow-up block",
     "code": "cy holds python, next: ['sql', 'http']\nsql level before and after: 0 1 | tuning: 2 3\nrefused: python -> api would close a loop\nrefused: python -> python would close a loop"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "A new link arrives while it runs",
       "Refuse it if the skill is the prerequisite or already below it. Otherwise rebuild. Block above.",
       "O(V + E) plus the closure per link."
      ],
      [
       "What should this expert learn next",
       "Skills not covered whose prerequisites are all covered, in order. Block above.",
       "O(V + E)."
      ],
      [
       "A million skills",
       "Stop storing the closure. Answer needs by a search with a visited set and cache the common answers.",
       "Time per query, memory saved."
      ],
      [
       "Rank the reviewers",
       "Ask what better means. Score by the highest level held, or by how many covered skills the candidate lacks.",
       "O(experts x skills)."
      ],
      [
       "The file is huge",
       "Stream it line by line. parse already works one line at a time, so it only keeps the maps.",
       "Constant memory per line."
      ],
      [
       "CSV or JSON instead",
       "Swap parse for csv.reader or json.load. Nothing after it changes.",
       "None."
      ],
      [
       "Show why one skill needs another",
       "Keep a parent in the search and print the chain.",
       "O(V + E) per question."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "The code review: every decision, and how to stand behind it",
     "prose": true,
     "items": [
      {
       "q": "1. Parse, build and load are three stages",
       "a": "**Decided.** parse handles syntax, SkillGraph handles meaning, load joins them.\n\n**Instead of.** One function that reads and validates together.\n\n**Why.** Each stage can be run and printed alone, and a failure says which kind it is. The queries never see a bad input.\n\n**What it costs.** Three names to read instead of one.\n\n**If they push.** \"For an hour it was the quickest way to keep every part running. I printed the counts after stage one before writing the next.\""
      },
      {
       "q": "2. Bad lines are skipped and counted",
       "a": "**Decided.** An empty or repeated name is skipped, counted, and the first repeat wins.\n\n**Instead of.** Raising on the first bad line, or skipping silently.\n\n**Why.** One typo should not throw away a good file, and a silent skip hides bugs. The count comes back with the result.\n\n**What it costs.** The count says how many, not which.\n\n**If they push.** \"If silent loss matters I would log each line with its reason, or add a strict flag that raises.\""
      },
      {
       "q": "3. A bad catalog raises; a bad expert skill is dropped",
       "a": "**Decided.** An unknown prerequisite or a loop raises. An unknown expert skill is dropped and counted.\n\n**Instead of.** One rule for both.\n\n**Why.** The catalog is the source of truth and everything depends on it, so it must be right. An expert list is user input, and one odd skill should not stop the rest.\n\n**What it costs.** An expert may lose a skill without anyone noticing, except in the count.\n\n**If they push.** \"If the reviewer wants strict, load raises on both. It is one line.\""
      },
      {
       "q": "4. The loop is caught at build and named",
       "a": "**Decided.** Count what each skill waits for, and name the loop from the leftovers.\n\n**Instead of.** Checking at query time.\n\n**Why.** Every query assumes a DAG. If a loop got in, requires could list a skill as its own prerequisite and a level would not exist. One check at the door keeps every later line simple.\n\n**What it costs.** Names one loop, not all.\n\n**If they push.** \"A depth-first search with three colours also finds it. I used counting because it gives the order I need anyway.\""
      },
      {
       "q": "5. The closure is stored in order",
       "a": "**Decided.** below[s] is the union of its prerequisites' closures plus themselves, built once.\n\n**Instead of.** Walking down on every query.\n\n**Why.** needs becomes a lookup and can_review a subset check. The order guarantees each prerequisite is ready first.\n\n**What it costs.** O(V squared) memory in a long chain.\n\n**If they push.** \"At a million skills I would stop storing it and search on demand with a cache.\""
      },
      {
       "q": "6. Holding a skill means holding what it builds on",
       "a": "**Decided.** covers adds everything below the held skills.\n\n**Instead of.** Exact match.\n\n**Why.** Someone who can do an API can do the SQL under it. Without this, the senior experts would never qualify.\n\n**What it costs.** If the data lists every skill already, this is redundant.\n\n**If they push.** \"If exact match is wanted, covers returns set(held). One line.\""
      },
      {
       "q": "7. Can review needs every candidate skill",
       "a": "**Decided.** A subset check.\n\n**Instead of.** any().\n\n**Why.** Reviewing a skill you do not cover is a guess. All is the safe reading.\n\n**What it costs.** Strict: a candidate with one odd skill has no reviewers.\n\n**If they push.** \"I would ask which they meant. any() is a one-line change, and I would rename the method so nobody mixes them up.\""
      },
      {
       "q": "8. An empty candidate list gives everyone",
       "a": "**Decided.** The subset check is true for an empty set.\n\n**Instead of.** Nobody.\n\n**Why.** It falls out of the definition, and I state it in a comment so it is not a surprise.\n\n**What it costs.** Looks odd in a report.\n\n**If they push.** \"Easy to special-case if they want nobody.\""
      },
      {
       "q": "9. What I tested",
       "a": "**Decided.** Plain asserts: each error, the empty candidate, a repeated prerequisite, and 300 random catalogs where every prerequisite comes first.\n\n**Instead of.** A framework.\n\n**Why.** None is provided, and outputs are exact because everything is deterministic.\n\n**What it costs.** No big file was timed.\n\n**If they push.** \"The loops are linear in the file. I expect it to be fine, and I would time it with a generated file.\""
      },
      {
       "q": "What I would do with another hour",
       "a": "1. next_skills and add_prereq as real functions, with the loop check.\n\n2. Reviewer ranking, once the product meaning is clear.\n\n3. csv and json readers behind the same parse.\n\n4. A test file that includes a generated large catalog.\n\nClose with one plain line: \"I kept each stage small so it runs on its own, and I know where each part breaks first.\""
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Find if Path Exists in Graph",
       "d": "easy",
       "lc": "find-if-path-exists-in-graph",
       "yt": [
        "knLFe7hEp3Y",
        "Greg Hogg",
        13
       ],
       "why": "Reachability between two nodes. The needs(a, b) question without the precomputed sets."
      },
      {
       "n": "All Ancestors of a Node in a Directed Acyclic Graph",
       "d": "medium",
       "lc": "all-ancestors-of-a-node-in-a-directed-acyclic-graph",
       "why": "Everything that builds up to each node in a DAG: the closure you precompute, as one problem."
      },
      {
       "n": "Course Schedule IV",
       "d": "medium",
       "lc": "course-schedule-iv",
       "yt": [
        "cEW05ofxhn0",
        "NeetCodeIO",
        18
       ],
       "why": "Many yes or no reachability queries on a prerequisite graph. Exactly needs(a, b) at scale, and why you precompute."
      },
      {
       "n": "Find Eventual Safe States",
       "d": "medium",
       "lc": "find-eventual-safe-states",
       "yt": [
        "Re_v0j0CRsg",
        "NeetCode",
        14
       ],
       "why": "Which nodes never reach a loop. Loops and reachability together, which is what the build must decide."
      },
      {
       "n": "Largest Color Value in a Directed Graph",
       "d": "hard",
       "lc": "largest-color-value-in-a-directed-graph",
       "yt": [
        "xLoDjKczUSk",
        "NeetCodeIO",
        23
       ],
       "why": "The harder follow-up: a value carried along every path of a DAG, and -1 when there is a loop. The level computation, with a table per node."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-assign",
   "title": "6. Contractor-to-task assignment",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A matching problem in business clothes: people with skills and limited hours, tasks that need one skill and some hours. The first version is a greedy rule with a heap. The reviewer will then ask where greedy is wrong, and the honest answer is a short example. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"Contractors each have some skills and a number of hours free this week. Tasks each need one skill, some hours and have a priority. Assign tasks to contractors. Tell us who got what and what could not be placed.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "Can a task be split across contractors, or does one person take it whole?",
      "Does a contractor need the task's skill, or any one of several?",
      "What counts as better: more tasks placed, or higher priority placed first?",
      "When several contractors qualify, who gets it: the one with the most hours left, the tightest fit, the first by name?",
      "What does 'could not be placed' mean: nobody has the skill, or everybody with the skill is full?",
      "What are bad inputs: zero or negative hours, a repeated task id, a contractor with no skills?",
      "How many tasks and contractors, and does the answer need to be the same every run?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-assign-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: the shape of tasks and contractors, whole or split, which order, which contractor when several qualify, what the result holds. Errors: no one has the skill, everyone is full, bad hours, repeated ids. Scope: optimal or good, size.",
     "solution": "1. Primary capabilities\n- What do the inputs look like?  Likely: tasks as (id, skill, hours, priority); contractors as name -> (set of skills, hours free).\n- Whole or split?  Whole. A task goes to one contractor.\n- Which tasks first?  Higher priority first, ties by id, so the output is the same every run.\n- Who gets it when several qualify?  The one with the most hours left, ties by name. This spreads the work. Ask: or the tightest fit, or fill one person first?\n- What does the result hold?  Who got each task, which tasks were not placed and why, and the hours left per contractor.\n\n2. Error handling\n- Nobody has the skill?  Unplaced, reason no_qualified.\n- People have the skill but not the hours?  Unplaced, reason no_capacity. Two reasons, because the fix differs: hire or free up hours.\n- Zero or negative hours on a task?  ValueError. Negative hours on a contractor: ValueError.\n- A repeated task id?  ValueError.\n- Does a refused task change anything?  No.\n\n3. Scope boundaries\n- Optimal assignment?  No. Greedy by priority is a good answer, not a best one. Say that and offer a repair for the simple case.\n- How big?  Say 100,000 tasks and 1,000 contractors. That rules out a scan of every contractor for every task.\n- Rescheduling when a person drops out, preferences, costs?  Out of scope.",
     "why": "'Most hours left' is a decision, not a fact, and it is the reason a heap fits. 'Two reasons for unplaced' is a small question that makes the output useful. 'Greedy, not optimal' is the honest scope the reviewer will test.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First I ask whether a task goes whole to one person, which order to take tasks in, and who gets it when several qualify. I would say most hours left, because it spreads the work and a heap can find it. Then the failures: nobody has the skill, or everybody with it is full. I would report those as two reasons. And I say now that greedy is a good answer, not the best one, and that I can show where it breaks."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-assign-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One each for the order of tasks, the choice of contractor, the result, the two reasons, the bad inputs, determinism, the fast version equalling a scan, and size.",
     "solution": "1. assign(tasks, contractors) takes tasks by priority, highest first, ties by id.\n2. A task goes whole to the qualified contractor with the most hours left, ties by name.\n   - Test: a task is never given to someone without its skill\n   - Test: no contractor's total hours are exceeded\n3. A task nobody can take is unplaced with a reason.\n   - no_qualified when nobody has the skill\n   - no_capacity when the roomiest qualified contractor has too few hours\n4. Every task appears in exactly one of assigned and unplaced.\n5. Bad input raises ValueError: non-positive task hours, negative contractor hours, a repeated id.\n6. Two runs on the same input give the same answer.\n7. The heap version equals a plain scan on random inputs.\n8. 100,000 tasks and 1,000 contractors finish quickly.\n9. Out of scope: splitting tasks, costs, preferences, an optimal assignment.",
     "why": "7 is the check without an answer key: the heap against a three-line scan with the same rule. 4 and 2 are properties that hold for any input, so they can be asserted on random data.",
     "say": "From the answers I get nine requirements and can test each one. **The ones I would not skip are that nobody is over their hours, that every task has an answer, and that the heap version equals a plain scan on random inputs.** Those hold for any input, so random data can check them. Out of scope: splitting tasks, costs, and an optimal assignment."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here the rule is the choice of contractor, and it lives in a heap."
    },
    {
     "t": "write",
     "id": "onsite-assign-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Task: \nContractor: \nSkill: \nHours left: \nPriority: \nQualified set: \nResult: \nUnplaced reason: ",
     "hint": "What do you look up most often? 'Who is the roomiest person with skill s?' What data structure answers that, and what happens when someone's hours change?",
     "solution": "Task: drop as a class. A tuple (id, skill, hours, priority), sorted once by (-priority, id).\nContractor: drop as a class. A name with (set of skills, hours). The set gives O(1) 'has the skill'.\nSkill: keep as an index. A dict skill -> heap of (-hours left, name). The top is the roomiest qualified contractor: one peek.\nHours left: keep as one dict, the truth. The heaps may hold older numbers; an entry is valid only if it matches this dict.\nPriority: drop. A sort key.\nQualified set: drop. It is the heap for the task's skill.\nResult: keep. A small dataclass: assigned, unplaced, left.\nUnplaced reason: drop as a class. A string, two values.",
     "why": "The idea to defend is the lazy heap: when a contractor's hours change, their old entries in the other heaps are wrong. Fixing them in place is expensive, so leave them and throw them away when they reach the top.",
     "say": "I underline the nouns. **The structure that matters is one heap per skill, with the roomiest contractor on top, and one dict that holds the real hours.** When someone takes a task their hours change, so I push a new entry into each of their skill heaps. The old entries are now wrong, and I do not hunt for them. I check at the top: if the entry does not match the dict, I pop it and look again. That is lazy deletion."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-assign-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "assign:\n  1.\n\n_best:\n  1.\n  Edge cases:\n\n_skill_heaps:\n  1.\n\nassign_slow:\n  1.\n",
     "hint": "Sort tasks once. For each, look at the top of the skill's heap after throwing out stale entries. If the top is too full, nobody qualified is roomy enough. After an assignment push fresh entries.",
     "solution": "assign(tasks, contractors):\n  1. _check the inputs\n  2. left = each contractor's hours; heaps = one per skill from _skill_heaps\n  3. Sort tasks by (-priority, id)\n  4. For each task: who = _best(the heap for its skill)\n  5. No heap or no one: unplaced no_qualified\n  6. left[who] < task hours: unplaced no_capacity (the roomiest is too full, so everyone is)\n  7. Otherwise assign, subtract the hours, push (-left, who) into each of who's skill heaps\n  Edge cases: a skill nobody has has no heap; a contractor with 0 hours is in heaps but never fits a positive task\n\n_best(heap, left):\n  1. While the top's hours do not match left, pop it\n  2. Return the top's name, or None if the heap is empty\n  Edge case: None heap (unknown skill) is handled by the caller\n\n_skill_heaps(contractors):\n  1. For every skill of every contractor add (-hours, name) to that skill's list\n  2. Heapify each list\n\nassign_slow(tasks, contractors):\n  1. Same sort; for each task list the qualified contractors as (-left, name)\n  2. min of that list is the roomiest, ties by name\n  3. Same two reasons, same subtraction",
     "why": "Step 6 is a small proof worth saying out loud: if the roomiest qualified contractor cannot fit the task, no other qualified contractor can. That is why the heap is enough.",
     "say": "**Before any code I write the steps.** Sort the tasks once. For each task, find the top of its skill's heap after throwing away stale entries. If the top person cannot fit it, nobody qualified can, because they are the roomiest. Otherwise assign, subtract, and push a fresh entry into each of that person's heaps. I also write the scan version, with the same rule, so I can check the heap against it."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-assign-e1",
     "q": "Code, top-down. Result and assign, naming _check, _skill_heaps and _best.",
     "starter": "@dataclass\nclass Result:\n    ...\n\ndef assign(tasks, contractors):\n    ...\n",
     "hint": "Sort once. In the loop: ask _best, three branches (nobody, too full, assign). On assign, push into every heap of that contractor's skills.",
     "solution": "import heapq\nfrom dataclasses import dataclass\n\n@dataclass\nclass Result:\n    assigned: dict     # task id -> contractor name\n    unplaced: dict     # task id -> \"no_qualified\" or \"no_capacity\"\n    left: dict         # contractor -> hours still free\n\n\ndef assign(tasks, contractors):\n    \"\"\"tasks: list of (id, skill, hours, priority). contractors: name -> (set of skills, hours free).\n    Highest priority first; each task goes to the qualified contractor with the most hours left.\"\"\"\n    _check(tasks, contractors)\n    left = {c: hours for c, (skills, hours) in contractors.items()}\n    heaps = _skill_heaps(contractors)                      # skill -> heap of (-hours left, name)\n    result = Result({}, {}, left)\n    for tid, skill, hours, _ in sorted(tasks, key=lambda t: (-t[3], t[0])):   # priority, then id: repeatable\n        who = _best(heaps.get(skill), left)                # most hours left among the qualified, or None\n        if who is None:\n            result.unplaced[tid] = \"no_qualified\"          # nobody has this skill at all\n        elif left[who] < hours:\n            result.unplaced[tid] = \"no_capacity\"           # the roomiest qualified person is too full\n        else:\n            result.assigned[tid] = who\n            left[who] -= hours\n            for s in contractors[who][0]:                  # their hours changed: a new entry in each of their heaps\n                heapq.heappush(heaps[s], (-left[who], who))\n    return result\n",
     "why": "assign reads like the requirements: order, choice, two reasons, assignment. The three branches are the whole policy.",
     "say": "I write the result class and assign, and name the helpers. **The loop has three branches: nobody has the skill, the roomiest person is too full, or assign.** On an assignment I push a fresh entry into each skill heap of that person. I have not written the stale check yet. I name it _best and write it next."
    },
    {
     "t": "write",
     "id": "onsite-assign-e2",
     "q": "The helpers: _check, _skill_heaps, _best (throw out stale entries). Then the slow version with a scan.",
     "starter": "def _check(tasks, contractors):\n    ...\n\ndef _skill_heaps(contractors):\n    ...\n\ndef _best(heap, left):\n    ...\n\ndef assign_slow(tasks, contractors):\n    ...\n",
     "hint": "An entry is stale when -entry[0] != left[name]. The slow version is a min over (-left, name) for the qualified.",
     "solution": "\n\ndef _check(tasks, contractors):\n    seen = set()\n    for tid, skill, hours, priority in tasks:\n        if tid in seen:\n            raise ValueError(f\"duplicate task id: {tid}\")\n        if hours <= 0:\n            raise ValueError(f\"{tid} needs {hours} hours; it must be positive\")\n        seen.add(tid)\n    for c, (skills, hours) in contractors.items():\n        if hours < 0:\n            raise ValueError(f\"{c} has negative hours: {hours}\")\n\n\ndef _skill_heaps(contractors):\n    \"\"\"One heap per skill of (-hours left, name): the top is the roomiest qualified contractor.\"\"\"\n    heaps = {}\n    for c, (skills, hours) in contractors.items():\n        for s in skills:\n            heaps.setdefault(s, []).append((-hours, c))\n    for h in heaps.values():\n        heapq.heapify(h)\n    return heaps\n\n\ndef _best(heap, left):\n    \"\"\"Top of a heap that may hold out-of-date entries. An entry is stale when the hours no longer match.\"\"\"\n    while heap and -heap[0][0] != left[heap[0][1]]:\n        heapq.heappop(heap)                                # lazy deletion: thrown away only when it reaches the top\n    return heap[0][1] if heap else None\n\n\ndef assign_slow(tasks, contractors):\n    \"\"\"First version: for every task, scan every contractor. O(tasks x contractors). Same rule, so same answers.\"\"\"\n    _check(tasks, contractors)\n    left = {c: hours for c, (skills, hours) in contractors.items()}\n    result = Result({}, {}, left)\n    for tid, skill, hours, _ in sorted(tasks, key=lambda t: (-t[3], t[0])):\n        able = [(-left[c], c) for c, (skills, _) in contractors.items() if skill in skills]\n        if not able:\n            result.unplaced[tid] = \"no_qualified\"\n            continue\n        _, who = min(able)                                 # most hours left, then name\n        if left[who] < hours:\n            result.unplaced[tid] = \"no_capacity\"\n        else:\n            result.assigned[tid] = who\n            left[who] -= hours\n    return result\n",
     "why": "_best is four lines and carries the lazy deletion. The slow version uses the same rule, so the two must give identical results, which is a strong test.",
     "say": "_best is the small loop: while the top does not match the real hours, pop it. **The slow version uses the same rule with a scan, so it must give exactly the same answers, and I compare the two on random inputs.** If they ever differ, one of them has a bug, and the scan is short enough to trust."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** assign sorts tasks in O(T log T). Each task does one _best, which pops stale entries (each entry is pushed once and popped once), and each assignment pushes one entry into each of the contractor's S skill heaps: O((T + A x S) log C) overall for A assignments. Space is O(sum of skills per contractor). assign_slow is O(T x C). max_assign (the extension) is O(tasks x contractors x slots) in the worst case."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-assign-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the sort key, why peek and not pop, why push to every skill heap, the stale test, why the top being too full is enough.",
     "solution": "1. Why sort by (-priority, id)?  Higher priority first, and the id makes ties repeatable. Without it two runs could differ.\n2. Why peek at the top and not pop it?  The same contractor may take more tasks. A pop would remove them. I only remove entries that are wrong.\n3. Why push a new entry into every heap of that contractor?  Their hours changed, and they sit in one heap per skill. Each heap needs the current number.\n4. What makes an entry stale?  Its hours differ from left[name]. Hours only go down, so an old entry always has more hours than the truth.\n5. Why not remove stale entries when the hours change?  A heap cannot remove from the middle cheaply. Throwing them away at the top costs the same in the end and is far simpler.\n6. Why is 'the roomiest is too full' enough for no_capacity?  If the person with the most hours left cannot fit the task, nobody qualified can.\n7. Why two reasons for unplaced?  The fix is different: hire someone with the skill, or free up hours.\n8. Can the heap grow without bound?  Each assignment adds at most S entries, so it is bounded by T x S. If that matters, rebuild a heap when stale entries outnumber live ones.\n9. Why a set of skills in the tuple?  has-the-skill is one lookup in the scan version, and the heap is built from it.\n10. What did you not test?  Speed at 100,000 tasks, and a contractor with many skills.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups on where greedy fails, best-fit and priority versus count.",
     "say": "**In the review I answer from the lines on the screen.** The sort key makes the output repeatable. I peek and do not pop, because the same person may take more. Stale entries are the ones whose hours do not match the dict, and I throw them away at the top. If the roomiest qualified person is too full, so is everyone else. What I did not test is speed at 100,000 tasks."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-assign-ext",
     "q": "Live extension. The reviewer says: 'Your greedy gave one person a task that only they could do for another. Show me a case where it places fewer tasks than possible, and fix it for the case where every task takes one slot.' Write how your design takes it, then the code.",
     "starter": "def max_assign(tasks, contractors):\n    ...\n",
     "hint": "Greedy commits early. When a task cannot be placed, see whether any contractor who could take it holds a task that someone else could take instead. Try that move, recursively, never trying the same contractor twice in one attempt.",
     "solution": "The failing case: ana has skills x and y, bo only x, one slot each. Tasks: t1 needs x, t2 needs y. Greedy gives t1 to ana (the roomiest, ties by name), and t2 has nobody left. The best answer is t1 to bo, t2 to ana.\n\nWhy the design takes it: the greedy needs no change, it stays as the fast first answer. The fix is a second function for the simple case where every task is one slot. It tries to place each task; if every qualified contractor is full, it asks whether one of the tasks they hold can move to someone else, and that is the same question again. A visited set stops it trying a contractor twice, so each attempt is O(contractors x slots). This is an augmenting path in a bipartite matching, and with it the count of placed tasks is the maximum.\n\nWith real hours and many sizes it is a packing problem, NP-hard, so say you would keep the greedy, put the big tasks first, and measure how often it loses.\n\nThe code is in the block under the workbench. It prints the fooling case and then checks the count against a brute force on 300 small random cases.",
     "why": "The reviewer is not asking for the hard version. They want to hear that you know where greedy fails, can show it in four lines, and know which easier case has an exact answer.",
     "say": "**Greedy commits early, and here is the case: ana has x and y, bo has only x, one slot each, a task for x and a task for y.** The roomiest rule gives the x task to ana, and the y task is stuck. The fix for one-slot tasks is to try a move: if everyone who can take a task is full, ask whether one of their tasks can go elsewhere, and keep a visited set so I never try someone twice. That gives the most tasks placed. With real hours it is a packing problem and I keep the greedy."
    },
    {
     "t": "problem",
     "id": "onsite-assign-p",
     "title": "Contractor-to-task assignment",
     "source": "Mercor-style assignment prompt, rebuilt (left vague on purpose)",
     "minutes": 60,
     "why": "A greedy rule with a heap, and an honest answer about where it fails. The round grades the choice rule and the reasons you report.",
     "statement": "\"Contractors each have some skills and a number of hours free this week. Tasks each need one skill, some hours and have a priority. Assign tasks to contractors. Tell us who got what and what could not be placed.\"",
     "examples": [
      {
       "input": "ana {python, sql} 10h, bo {python} 6h, cy {design} 8h; t1 python 5h p3, t2 python 4h p3, t3 sql 6h p2, t4 design 9h p2, t5 go 1h p1, t6 python 3h p1",
       "output": "assigned t1 ana, t2 bo, t6 ana; unplaced t3 no_capacity, t4 no_capacity, t5 no_qualified",
       "note": "t1 goes to ana (10 hours left, more than bo's 6)."
      },
      {
       "input": "ana {x, y} 3h, bo {x} 3h; t1 x 3h p2, t2 y 3h p1",
       "output": "t1 ana; t2 unplaced (no_capacity)",
       "note": "The greedy case that loses: t1 to bo would let ana take t2."
      },
      {
       "input": "a task with 0 hours",
       "output": "ValueError",
       "note": "Hours must be positive."
      },
      {
       "input": "no tasks",
       "output": "nothing assigned, hours unchanged",
       "note": "Say it aloud."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 100,000 tasks and 1,000 contractors",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def assign(tasks, contractors):\n    ...",
     "hints": [
      "Level 1: do the obvious thing first: for each task in priority order, scan the contractors who have the skill and pick one. Get that running on the example.",
      "Level 2: to avoid the scan, keep one heap per skill of (-hours left, name). The top is the roomiest. When someone's hours change, push a fresh entry and leave the old ones.",
      "Level 3: before you read the top, pop entries whose hours do not match the real hours. If the top cannot fit the task, nobody can."
     ],
     "solution": "import heapq\nfrom dataclasses import dataclass\n\n@dataclass\nclass Result:\n    assigned: dict     # task id -> contractor name\n    unplaced: dict     # task id -> \"no_qualified\" or \"no_capacity\"\n    left: dict         # contractor -> hours still free\n\n\ndef assign(tasks, contractors):\n    \"\"\"tasks: list of (id, skill, hours, priority). contractors: name -> (set of skills, hours free).\n    Highest priority first; each task goes to the qualified contractor with the most hours left.\"\"\"\n    _check(tasks, contractors)\n    left = {c: hours for c, (skills, hours) in contractors.items()}\n    heaps = _skill_heaps(contractors)                      # skill -> heap of (-hours left, name)\n    result = Result({}, {}, left)\n    for tid, skill, hours, _ in sorted(tasks, key=lambda t: (-t[3], t[0])):   # priority, then id: repeatable\n        who = _best(heaps.get(skill), left)                # most hours left among the qualified, or None\n        if who is None:\n            result.unplaced[tid] = \"no_qualified\"          # nobody has this skill at all\n        elif left[who] < hours:\n            result.unplaced[tid] = \"no_capacity\"           # the roomiest qualified person is too full\n        else:\n            result.assigned[tid] = who\n            left[who] -= hours\n            for s in contractors[who][0]:                  # their hours changed: a new entry in each of their heaps\n                heapq.heappush(heaps[s], (-left[who], who))\n    return result\n\n\n\ndef _check(tasks, contractors):\n    seen = set()\n    for tid, skill, hours, priority in tasks:\n        if tid in seen:\n            raise ValueError(f\"duplicate task id: {tid}\")\n        if hours <= 0:\n            raise ValueError(f\"{tid} needs {hours} hours; it must be positive\")\n        seen.add(tid)\n    for c, (skills, hours) in contractors.items():\n        if hours < 0:\n            raise ValueError(f\"{c} has negative hours: {hours}\")\n\n\ndef _skill_heaps(contractors):\n    \"\"\"One heap per skill of (-hours left, name): the top is the roomiest qualified contractor.\"\"\"\n    heaps = {}\n    for c, (skills, hours) in contractors.items():\n        for s in skills:\n            heaps.setdefault(s, []).append((-hours, c))\n    for h in heaps.values():\n        heapq.heapify(h)\n    return heaps\n\n\ndef _best(heap, left):\n    \"\"\"Top of a heap that may hold out-of-date entries. An entry is stale when the hours no longer match.\"\"\"\n    while heap and -heap[0][0] != left[heap[0][1]]:\n        heapq.heappop(heap)                                # lazy deletion: thrown away only when it reaches the top\n    return heap[0][1] if heap else None\n\n\ndef assign_slow(tasks, contractors):\n    \"\"\"First version: for every task, scan every contractor. O(tasks x contractors). Same rule, so same answers.\"\"\"\n    _check(tasks, contractors)\n    left = {c: hours for c, (skills, hours) in contractors.items()}\n    result = Result({}, {}, left)\n    for tid, skill, hours, _ in sorted(tasks, key=lambda t: (-t[3], t[0])):\n        able = [(-left[c], c) for c, (skills, _) in contractors.items() if skill in skills]\n        if not able:\n            result.unplaced[tid] = \"no_qualified\"\n            continue\n        _, who = min(able)                                 # most hours left, then name\n        if left[who] < hours:\n            result.unplaced[tid] = \"no_capacity\"\n        else:\n            result.assigned[tid] = who\n            left[who] -= hours\n    return result\n",
     "complexity": "O((T + A x S) log C) for T tasks, A assignments, S skills per contractor and C contractors. The scan version is O(T x C).",
     "explain": [
      "_check rejects non-positive hours and repeated ids before anything is placed.",
      "left is the one true record of hours. The heaps are only an index and may hold older numbers.",
      "Tasks are taken by priority, then id, so the answer is the same every run.",
      "_best pops stale entries from the top and returns the roomiest qualified name.",
      "If the roomiest qualified contractor is too full, no_capacity; if there is nobody, no_qualified.",
      "After an assignment, a fresh entry goes into each of that contractor's skill heaps.",
      "assign_slow scans every contractor with the same rule and is used only to check the heap version.",
      "What the checks print: assigned: {'t1': 'ana', 't2': 'bo', 't6': 'ana'} | unplaced: {'t3': 'no_capacity', 't4': 'no_capacity', 't5': 'no_qualified'} | left: {'ana': 2, 'bo': 2, 'cy': 8} | error: a needs 0 hours; it must be positive | error: duplicate task id: a | greedy: {'t1': 'ana'} {'t2': 'no_capacity'} | 400 random cases: heap equals the scan, skills match, nobody over hours, every task answered"
     ],
     "tests": "contractors = {\"ana\": ({\"python\", \"sql\"}, 10), \"bo\": ({\"python\"}, 6), \"cy\": ({\"design\"}, 8)}\ntasks = [(\"t1\", \"python\", 5, 3), (\"t2\", \"python\", 4, 3), (\"t3\", \"sql\", 6, 2),\n         (\"t4\", \"design\", 9, 2), (\"t5\", \"go\", 1, 1), (\"t6\", \"python\", 3, 1)]\nr = assign(tasks, contractors)\nprint(\"assigned:\", r.assigned)\nprint(\"unplaced:\", r.unplaced)\nprint(\"left:\", r.left)\nassert r.assigned == {\"t1\": \"ana\", \"t2\": \"bo\", \"t6\": \"ana\"}\nassert r.unplaced == {\"t3\": \"no_capacity\", \"t4\": \"no_capacity\", \"t5\": \"no_qualified\"}\nassert assign_slow(tasks, contractors) == r\nfor bad in ([(\"a\", \"x\", 0, 1)], [(\"a\", \"x\", 1, 1), (\"a\", \"y\", 1, 1)]):\n    try:\n        assign(bad, contractors)\n    except ValueError as e:\n        print(\"error:\", e)\nassert assign([], contractors).assigned == {}\n\n# where greedy fails: the roomiest rule gives t1 to ana, and then nobody can do the y task\nc2 = {\"ana\": ({\"x\", \"y\"}, 3), \"bo\": ({\"x\"}, 3)}\nt2 = [(\"t1\", \"x\", 3, 2), (\"t2\", \"y\", 3, 1)]\nr2 = assign(t2, c2)\nprint(\"greedy:\", r2.assigned, r2.unplaced)\nassert r2.assigned == {\"t1\": \"ana\"} and r2.unplaced == {\"t2\": \"no_capacity\"}\n\nimport random\nrng = random.Random(4)\nSK = [\"a\", \"b\", \"c\", \"d\"]\nfor trial in range(400):\n    cs = {f\"c{i}\": (set(rng.sample(SK, rng.randint(0, 3))), rng.randint(0, 12)) for i in range(rng.randint(1, 5))}\n    ts = [(f\"t{i}\", rng.choice(SK + [\"z\"]), rng.randint(1, 8), rng.randint(1, 3)) for i in range(rng.randint(0, 12))]\n    fast, slow = assign(ts, cs), assign_slow(ts, cs)\n    assert fast == slow                                                   # heap version equals the scan\n    used = {c: 0 for c in cs}\n    info = {t[0]: t for t in ts}\n    for tid, who in fast.assigned.items():\n        assert info[tid][1] in cs[who][0]                                 # the contractor has the skill\n        used[who] += info[tid][2]\n    assert all(used[c] <= cs[c][1] for c in cs)                           # nobody is over their hours\n    assert set(fast.assigned) | set(fast.unplaced) == set(info)           # every task has an answer\n    assert not set(fast.assigned) & set(fast.unplaced)\nprint(\"400 random cases: heap equals the scan, skills match, nobody over hours, every task answered\")\n",
     "followups": [
      {
       "q": "Show me a case where your answer is not the best.",
       "a": "Two contractors, ana with x and y, bo with x only, one slot each. A task for x and a task for y. The roomiest rule gives x to ana, so y has nobody. The best answer gives x to bo. For one-slot tasks the augmenting-path version fixes it, in the code under the workbench."
      },
      {
       "q": "Would a different choice rule place more?",
       "a": "Often. With hours, the tightest fit (the contractor with the fewest hours left that still fit) packs better: in the example, t1 to bo, t2 to ana, and t3 fits ana too, so three tasks including the priority-2 one. A heap cannot find the tightest fit; a sorted list of hours can. Ask which they prefer: spread the work or pack it."
      },
      {
       "q": "Priority or number of tasks: which do you maximise?",
       "a": "Priority first, as written: a high-priority task is placed before any lower one even if that fits fewer tasks in total. If they want the count, sort by hours ascending instead. Name the trade."
      },
      {
       "q": "What if a task could run on any of several skills?",
       "a": "Make skill a set. The task is then a candidate for several heaps; take the roomiest top among them. The rest is unchanged."
      },
      {
       "q": "Why not sort everything and be done?",
       "a": "Sorting contractors by hours once is not enough, because the order changes after every assignment. A heap keeps the roomiest on top at O(log C) per change."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the code. The six-task example by hand, one assert per error, the greedy-fooling case, and a random check on 400 cases: the heap version equals the scan, no one is over their hours, every task is in exactly one of assigned and unplaced."
      }
     ],
     "d": "medium",
     "lc": "process-tasks-using-servers",
     "yt": [
      "XKA22PecuMQ",
      "NeetCode",
      18
     ]
    },
    {
     "t": "code",
     "id": "onsite-assign-ext-code",
     "title": "Live extension: the best placement when every task takes one slot (runs together with the solution above)",
     "code": "def max_assign(tasks, contractors):\n    \"\"\"Every task takes one slot. Places as many tasks as possible, using augmenting paths.\n    tasks: list of (id, skill). contractors: name -> (set of skills, slots). Returns (assigned, unplaced ids).\"\"\"\n    holders = {c: [] for c in contractors}                  # contractor -> the tasks it holds now\n    able = {t: sorted(c for c, (skills, _) in contractors.items() if s in skills) for t, s in tasks}\n\n    def place(t, seen):\n        for c in able[t]:\n            if c in seen:\n                continue\n            seen.add(c)                                     # each contractor is tried once per attempt\n            if len(holders[c]) < contractors[c][1]:\n                holders[c].append(t)\n                return True\n            for other in list(holders[c]):                  # full: can one of its tasks move to someone else?\n                if place(other, seen):\n                    holders[c].remove(other)\n                    holders[c].append(t)\n                    return True\n        return False\n\n    unplaced = [t for t, _ in tasks if not place(t, set())]\n    assigned = {t: c for c, ts in holders.items() for t in ts}\n    return assigned, unplaced\n\n\nc2 = {\"ana\": ({\"x\", \"y\"}, 1), \"bo\": ({\"x\"}, 1)}\nprint(\"unit slots, greedy-fooling case:\", max_assign([(\"t1\", \"x\"), (\"t2\", \"y\")], c2))\n\nimport itertools\nimport random\nrng = random.Random(12)\nSK = [\"a\", \"b\", \"c\"]\nfor trial in range(300):\n    cs = {f\"c{i}\": (set(rng.sample(SK, rng.randint(0, 3))), rng.randint(0, 2)) for i in range(rng.randint(1, 3))}\n    ts = [(f\"t{i}\", rng.choice(SK)) for i in range(rng.randint(0, 6))]\n    got, lost = max_assign(ts, cs)\n    best = 0                                                # brute force: try every choice of contractor or none\n    names = list(cs) + [None]\n    for pick in itertools.product(names, repeat=len(ts)):\n        load = {c: 0 for c in cs}\n        ok = True\n        for (t, s), c in zip(ts, pick):\n            if c is None:\n                continue\n            load[c] += 1\n            if s not in cs[c][0] or load[c] > cs[c][1]:\n                ok = False\n                break\n        if ok:\n            best = max(best, sum(1 for c in pick if c is not None))\n    assert len(got) == best\nprint(\"300 random small cases: augmenting paths place exactly as many tasks as brute force\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Assign Cookies",
       "d": "easy",
       "lc": "assign-cookies",
       "yt": [
        "JW8fgvoxPTg",
        "NeetCodeIO",
        10
       ],
       "why": "Match people to items by size, greedily after sorting. The smallest version of the idea."
      },
      {
       "n": "Most Profit Assigning Work",
       "d": "medium",
       "lc": "most-profit-assigning-work",
       "why": "Workers with a skill limit, jobs with a difficulty and a profit: sort and sweep. Skill and capacity in one problem."
      },
      {
       "n": "Process Tasks Using Servers",
       "d": "medium",
       "lc": "process-tasks-using-servers",
       "yt": [
        "XKA22PecuMQ",
        "NeetCode",
        18
       ],
       "why": "Two heaps: free servers by weight and busy servers by time. The structure behind assign, with a clock added."
      },
      {
       "n": "Maximum Number of Tasks You Can Assign",
       "d": "hard",
       "lc": "maximum-number-of-tasks-you-can-assign",
       "why": "The harder follow-up: greedy fails unless you also choose how many tasks, by binary search. It shows how much care greedy needs."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-intervals",
   "title": "7. Interview slot scheduler",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Intervals: merge, clash, gaps and how many rooms. It looks like four small problems, and the trap is in the edges: does a slot that ends at 10:00 clash with one that starts at 10:00? The solo hour rewards deciding that once, out loud, and keeping it everywhere. No class is needed here, which is itself a choice to say. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"Interviewers book slots as a start and an end, in minutes since midnight. Build helpers for the scheduling team: merge a person's slots into busy blocks, find which slots clash, find the free time in a working day, and say how many rooms are needed.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "Does a slot that ends at 10:00 clash with one that starts at 10:00? Is the end included?",
      "Should two slots that only touch be merged into one busy block?",
      "What is 'which slots clash': pairs, groups, or the slots that are in any clash? Identified how?",
      "What is a valid slot: can it be empty, can the end come before the start, can the times be fractions?",
      "Is it one person's calendar or the whole panel's?",
      "'Free time in a working day': the day's start and end are given? What about a slot that starts before the day or ends after it?",
      "'Rooms': the fewest so that no overlapping slots share one? How many slots, and in what order do they arrive?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-intervals-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: the slot shape, touching, what each of the four helpers returns. Errors: empty or backwards slots, a slot outside the day. Scope: size, one person or many, rooms by room features.",
     "solution": "1. Primary capabilities\n- What is a slot?  Likely: a pair of integers (start, end), minutes since midnight, the end not included. So [9:00, 10:00) and [10:00, 11:00) do not overlap.\n- Do touching slots clash?  No. They are back to back.\n- Do touching slots merge into one busy block?  Yes for busy blocks: the person is busy from 9 to 11 without a break. Different question, different answer, so say it.\n- What does 'clash' return?  Pairs of positions (i, j) in the input, so duplicates and identical times can still be told apart.\n- What does free return?  The gaps inside the day, as (start, end) pairs, sorted.\n- What does rooms return?  A number: the most slots running at the same moment.\n\n2. Error handling\n- An empty or backwards slot (start >= end)?  ValueError, naming it.\n- A slot partly outside the working day?  Clip it. It still blocks the part inside the day.\n- A day that ends before it starts?  ValueError.\n- An empty list?  merge gives [], free gives the whole day, rooms gives 0.\n\n3. Scope boundaries\n- Whose calendar?  One list at a time. For a panel, put every slot in one list: the live extension.\n- How many slots?  Say 100,000. That rules out comparing every pair.\n- Room features, travel time, time zones, repeating slots?  Out of scope.",
     "why": "'End not included' is the decision that everything else leans on. Two answers about touching (clash: no, merge: yes) look inconsistent unless you say why: one asks whether people overlap, the other whether they ever get a break.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** The first question is the edge: does a slot that ends at ten clash with one that starts at ten? I would say no, the end is not included, and I write that as a comment at the top. Then I ask what each helper returns. Then bad slots, and slots that stick out of the day. And I say that for a panel I would put everyone's slots into one list, so I do not need a second function."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-intervals-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One for the slot rule, one each for merge, clash, free, rooms; the edges; fast equals slow; size.",
     "solution": "1. A slot is (start, end) with start < end. Anything else raises ValueError naming it.\n2. merge(slots) returns the busy blocks, sorted, where overlapping or touching slots are one.\n   - Test: blocks never overlap or touch each other; the minutes covered are the same as by the slots\n3. conflicts(slots) returns the pairs of positions (i, j), i < j, whose times overlap.\n   - Touching slots are not a conflict\n   - Test: equals comparing every pair\n4. free(slots, day_start, day_end) returns the gaps inside the day, sorted.\n   - Test: the gaps are exactly the minutes no slot covers\n5. rooms(slots) returns the most slots running at the same moment.\n   - Touching slots can share a room\n6. Empty input: [], [], the whole day, 0.\n7. 100,000 slots finish quickly.\n8. Out of scope: time zones, repeating slots, room features, travel time.",
     "why": "Every line has an example in the edges: 3 and 5 depend on 'touching is not a clash'; 2 depends on 'touching merges'. 4's test, minute by minute, is the cheapest way to check free without an answer key.",
     "say": "From the answers I get eight requirements and can test each one. **The check I trust most is the minute by minute one: free must be exactly the minutes that no slot covers, and the merged blocks must cover the same minutes as the slots.** Then fast conflicts and rooms against the all-pairs versions. Out of scope: time zones, repeating slots and room features."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here nothing does, and that is the decision."
    },
    {
     "t": "write",
     "id": "onsite-intervals-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Slot: \nBusy block: \nGap (free time): \nWorking day: \nClash: \nRoom: \nHeap of end times: ",
     "hint": "Is any noun a thing with behaviour that must be protected, or are they all values? What do you sort by, and what do you keep while sweeping?",
     "solution": "Slot: drop as a class. A (start, end) tuple. Tuples sort by start, then end, which is what every helper needs.\nBusy block: drop. A (start, end) tuple built by merge. Merge keeps the last block as a list so its end can be extended, then turns them back into tuples.\nGap: drop. A (start, end) tuple.\nWorking day: drop. Two numbers.\nClash: drop. A pair of positions (i, j), so two identical slots can still be told apart.\nRoom: drop. Only a count is asked for. If they ask who sits in which room, a room becomes an id returned from a heap of (end time, room id).\nHeap of end times: keep, as a local. A min-heap of the end times of the slots running now; its size is the number of rooms in use.\nA class: none. There is no state that outlives one call, and no rule to protect, so four functions are enough.",
     "why": "Saying 'no class' with a reason is the answer. The heap of end times is the only structure to explain: it answers 'is the earliest-ending slot over?' in one peek.",
     "say": "I underline the nouns. **Nothing here has behaviour, so I write four functions and no class, and I say why.** Slots, blocks and gaps are all pairs of numbers. The one structure to explain is the heap of end times in rooms: it keeps the slots running right now, and its size is how many rooms are in use. If they ask who sits in which room, the heap grows an id."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-intervals-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "merge:\n  1.\n\nfree:\n  1.\n  Edge cases:\n\nconflicts:\n  1.\n\nrooms:\n  1.\n",
     "hint": "Sort first. Merge extends the last block or starts a new one. Free walks the merged blocks with a cursor. Conflicts stops looking when the next start is past this end. Rooms keeps a heap of end times.",
     "solution": "merge(slots):\n  1. Check every slot\n  2. Sort by start\n  3. For each slot: if it starts at or before the end of the last block, extend that block to the larger end; else start a new block\n  Edge cases: touching (start equals the last end) extends; an empty list gives []\n\nfree(slots, day_start, day_end):\n  1. Merge the slots\n  2. Keep a cursor at day_start: everything before it is accounted for\n  3. For each block: skip it if it ends at or before the cursor; stop if it starts at or after the day's end; if it starts after the cursor, record the gap; move the cursor to the larger of its end and the cursor\n  4. If the cursor is still before the day's end, record the last gap\n  Edge cases: a block that starts before the day only moves the cursor; no slots gives the whole day; a block covering the whole day gives []\n\nconflicts(slots):\n  1. Order the positions by slot\n  2. For each slot, look at the slots after it in that order\n  3. Stop at the first whose start is at or after this slot's end: later ones start even later\n  4. Otherwise record the pair, smaller position first; sort the pairs\n  Edge case: touching slots never pair\n\nrooms(slots):\n  1. Sort by start; keep a min-heap of end times\n  2. For each slot: pop every end that is at or before this start; push this end\n  3. The answer is the largest the heap ever got\n  Edge case: popping with <= is what lets touching slots share a room",
     "why": "Every sort uses the same key, and every comparison uses the same rule (end not included). 'Pop while the end is at or before the start' in rooms and 'start at or after the end' in conflicts are the same edge written twice.",
     "say": "**Before any code I write the steps for each function.** Merge sorts and extends the last block. Free walks the merged blocks with a cursor and records the space between the cursor and the next block. Conflicts sorts by start and stops looking as soon as a later slot starts at or after this one's end. Rooms keeps the end times of what is running, drops those already over, and records the biggest size. The edge, end not included, is the same line in all four."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-intervals-e1",
     "q": "Code, top-down: merge, free and the slot check.",
     "starter": "def merge(slots):\n    ...\n\ndef free(slots, day_start, day_end):\n    ...\n",
     "hint": "merge keeps blocks as small lists so the last one can be extended in place. free calls merge and walks it with a cursor.",
     "solution": "import heapq\n\ndef merge(slots):\n    \"\"\"Busy blocks: slots that overlap or touch become one block. Sorted by start.\"\"\"\n    _check(slots)\n    blocks = []\n    for start, end in sorted(slots):\n        if blocks and start <= blocks[-1][1]:              # overlaps or touches the last block: extend it\n            blocks[-1][1] = max(blocks[-1][1], end)\n        else:\n            blocks.append([start, end])\n    return [tuple(b) for b in blocks]\n\n\ndef free(slots, day_start, day_end):\n    \"\"\"The gaps inside the working day [day_start, day_end) that no slot covers.\"\"\"\n    if day_start >= day_end:\n        raise ValueError(\"the day must end after it starts\")\n    gaps, cursor = [], day_start                           # cursor: everything before it is already accounted for\n    for start, end in merge(slots):\n        if end <= cursor:\n            continue                                       # the block is over before the cursor\n        if start >= day_end:\n            break                                          # the block starts after the day\n        if start > cursor:\n            gaps.append((cursor, start))\n        cursor = max(cursor, end)\n    if cursor < day_end:\n        gaps.append((cursor, day_end))\n    return gaps\n\n\ndef _check(slots):\n    for start, end in slots:\n        if start >= end:\n            raise ValueError(f\"slot ({start}, {end}) must end after it starts\")\n",
     "why": "free is short because merge already did the hard part: after merging, blocks are sorted and apart, so a cursor is enough.",
     "say": "I write merge first, because free builds on it. **Merge sorts, then either extends the last block or starts a new one, and touching counts as extending.** Free reuses it: with blocks sorted and apart, a cursor walks the day and records what is between it and the next block. The edges are a block that starts before the day, one after it, and none at all."
    },
    {
     "t": "write",
     "id": "onsite-intervals-e2",
     "q": "conflicts and rooms: the slow versions first (every pair, every start), then the fast ones (sort, then stop early; a heap of end times).",
     "starter": "def conflicts_slow(slots):\n    ...\n\ndef rooms_slow(slots):\n    ...\n\ndef conflicts(slots):\n    ...\n\ndef rooms(slots):\n    ...\n",
     "hint": "Overlap test: a starts before b ends and b starts before a ends. Fast conflicts: sorted by start, break at the first later slot that starts at or after this end. Rooms: pop ends <= this start, push this end, track the size.",
     "solution": "\n\ndef conflicts_slow(slots):\n    \"\"\"First version: compare every pair. O(n^2) always.\"\"\"\n    _check(slots)\n    return [(i, j) for i in range(len(slots)) for j in range(i + 1, len(slots))\n            if slots[i][0] < slots[j][1] and slots[j][0] < slots[i][1]]\n\n\ndef rooms_slow(slots):\n    \"\"\"First version: at every start time, count the slots running. O(n^2).\"\"\"\n    _check(slots)\n    return max((sum(1 for s, e in slots if s <= t < e) for t, _ in slots), default=0)\n\n\ndef conflicts(slots):\n    \"\"\"Pairs of slot positions (i, j), i < j, whose times overlap. Touching is not a clash.\"\"\"\n    _check(slots)\n    by_start = sorted(range(len(slots)), key=lambda i: slots[i])\n    pairs = []\n    for a, i in enumerate(by_start):\n        for b in range(a + 1, len(by_start)):\n            j = by_start[b]\n            if slots[j][0] >= slots[i][1]:\n                break                                      # sorted by start: no later slot can reach slot i\n            pairs.append((min(i, j), max(i, j)))\n    return sorted(pairs)\n\n\ndef rooms(slots):\n    \"\"\"Fewest rooms so that no two overlapping slots share one = the most slots running at the same moment.\"\"\"\n    _check(slots)\n    ends, most = [], 0                                     # a min-heap of the end times of the slots running now\n    for start, end in sorted(slots):\n        while ends and ends[0] <= start:                   # that slot is over: touching does not overlap\n            heapq.heappop(ends)\n        heapq.heappush(ends, end)\n        most = max(most, len(ends))\n    return most\n",
     "why": "The slow versions are two lines each and obviously right. The fast ones are the same rule with a sort, so they can be checked against them on random days.",
     "say": "The slow versions come first: compare every pair, and at every start time count what is running. **They are obviously right and quadratic, so they are my checker for the fast ones.** The fast ones sort by start. Conflicts stops looking as soon as a later slot starts past this end. Rooms keeps the end times of what is running, so its size is the number of rooms in use."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** merge is O(n log n) for the sort. free is O(n log n). conflicts is O(n log n + k) where k is the number of clashing pairs: if everything overlaps, k is about n squared and nothing can beat that because the answer is that big. rooms is O(n log n) time and O(n) space. The slow versions are O(n squared)."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-intervals-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: <= in merge, the break in conflicts, why a list for blocks, popping with <=, how free treats a block before the day.",
     "solution": "1. Why start <= blocks[-1][1] in merge?  Equal means touching. The person is busy without a break, so it is one block. A strict < would leave a zero-length gap.\n2. Why are blocks lists and not tuples while merging?  The last block's end changes. Tuples cannot change, so I rebuild tuples at the end.\n3. Why can conflicts break out of the inner loop?  The slots are sorted by start. Once one starts at or after this slot's end, every later one does too.\n4. Why return positions and not slots?  Two slots with the same times would otherwise be one pair, and the caller cannot tell which one clashes.\n5. Why pop with <= in rooms?  A slot that ends at 10:00 and one that starts at 10:00 can share a room. Popping only on < would count them as two.\n6. Why is the answer the largest size of the heap?  The heap holds the slots running right now. Its largest size is the most that ever ran together.\n7. What does free do with a block that starts before the day?  It only moves the cursor. The gap before it is outside the day.\n8. Why does free not need to check the end of the day inside the loop?  A block that starts at or after the end stops the loop, and the last gap is added after it.\n9. What if a slot is (10, 10)?  ValueError. A zero-length slot is almost certainly a data error.\n10. What did you not test?  100,000 slots for speed, and a day with a single block that covers everything.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about panels, who sits in which room and repeating slots.",
     "say": "**In the review I answer from the lines on the screen.** The less-than-or-equal in merge means touching is one block. Conflicts can stop early because the slots are sorted by start. Rooms pops with less-than-or-equal because back-to-back slots can share a room. Free treats a block before the day as only moving the cursor. What I did not test is 100,000 slots for speed."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-intervals-ext",
     "q": "Live extension. The reviewer says: 'Now there is a panel of three interviewers, each with their own calendar. Find the times when all of them are free for at least 45 minutes, and the earliest start for a 45-minute interview.' Write how your design takes it, then the code.",
     "starter": "def common_free(people, day_start, day_end, length):\n    ...\n\ndef first_slot(people, day_start, day_end, length):\n    ...\n",
     "hint": "Busy for anyone is busy for the panel. Put every slot in one list and use what you have.",
     "solution": "Why the design takes it: free already merges overlapping and touching slots, so a panel is the same problem with everyone's slots in one list. Busy for anyone means busy for the panel. Then keep the gaps that are long enough. The earliest start is the first such gap's start.\n\nThere is no new algorithm and no second sort, which is the point: four small functions with the same edge rule compose. The cost is O(total slots log total slots).\n\nIf the reviewer then asks 'what if each interviewer works a different day length', pass the intersection of their day windows as the day, which is two max and min calls.\n\nThe code is in the block under the workbench. It prints the windows, the first 45-minute slot, the first 90-minute slot and what happens for four hours (None), and checks the earliest start against a minute by minute search on 300 random panels.",
     "why": "This is the question that shows whether four helpers were designed as one small toolbox. If free took a person and not a list, the panel would need a rewrite.",
     "say": "**Busy for anyone is busy for the panel, so I put everyone's slots in one list and call free.** Then I keep the gaps that are at least as long as the interview, and the first gap's start is the earliest time. There is no new algorithm. If the panel has different working days, the day is the intersection of them. I check the earliest start against a minute by minute search on random panels."
    },
    {
     "t": "problem",
     "id": "onsite-intervals-p",
     "title": "Interview slot scheduler",
     "source": "Mercor-style interval prompt, rebuilt (left vague on purpose)",
     "minutes": 45,
     "why": "Four small interval problems that share one edge rule. The round grades whether you decide touching once and apply it everywhere.",
     "statement": "\"Interviewers book slots as a start and an end, in minutes since midnight. Build helpers for the scheduling team: merge a person's slots into busy blocks, find which slots clash, find the free time in a working day, and say how many rooms are needed.\"",
     "examples": [
      {
       "input": "slots 9:00-10:00, 9:30-10:30, 10:00-11:00, 12:00-13:00, 12:30-13:30, 15:00-16:00",
       "output": "merge: 9:00-11:00, 12:00-13:30, 15:00-16:00",
       "note": "The first three chain together, the last two overlap."
      },
      {
       "input": "the same slots",
       "output": "clashes: (0,1), (1,2), (3,4)",
       "note": "(0,2) only touches at 10:00, so it is not a clash."
      },
      {
       "input": "the same slots, working day 8:00 to 17:00",
       "output": "free: 8:00-9:00, 11:00-12:00, 13:30-15:00, 16:00-17:00",
       "note": "Four gaps."
      },
      {
       "input": "the same slots",
       "output": "2 rooms",
       "note": "At most two run at once; back-to-back slots share a room."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 100,000 slots",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def merge(slots):\n    ...\n\ndef conflicts(slots):\n    ...\n\ndef free(slots, day_start, day_end):\n    ...\n\ndef rooms(slots):\n    ...",
     "hints": [
      "Level 1: write the all-pairs versions first. Two slots overlap when each one starts before the other ends.",
      "Level 2: sort by start. Merging then needs only the last block. Conflicts can stop looking early.",
      "Level 3: for rooms, keep a heap of the end times of what is running. Pop the ones that are over before you push the new end. The largest heap size is the answer."
     ],
     "solution": "import heapq\n\ndef merge(slots):\n    \"\"\"Busy blocks: slots that overlap or touch become one block. Sorted by start.\"\"\"\n    _check(slots)\n    blocks = []\n    for start, end in sorted(slots):\n        if blocks and start <= blocks[-1][1]:              # overlaps or touches the last block: extend it\n            blocks[-1][1] = max(blocks[-1][1], end)\n        else:\n            blocks.append([start, end])\n    return [tuple(b) for b in blocks]\n\n\ndef free(slots, day_start, day_end):\n    \"\"\"The gaps inside the working day [day_start, day_end) that no slot covers.\"\"\"\n    if day_start >= day_end:\n        raise ValueError(\"the day must end after it starts\")\n    gaps, cursor = [], day_start                           # cursor: everything before it is already accounted for\n    for start, end in merge(slots):\n        if end <= cursor:\n            continue                                       # the block is over before the cursor\n        if start >= day_end:\n            break                                          # the block starts after the day\n        if start > cursor:\n            gaps.append((cursor, start))\n        cursor = max(cursor, end)\n    if cursor < day_end:\n        gaps.append((cursor, day_end))\n    return gaps\n\n\ndef _check(slots):\n    for start, end in slots:\n        if start >= end:\n            raise ValueError(f\"slot ({start}, {end}) must end after it starts\")\n\n\n\ndef conflicts_slow(slots):\n    \"\"\"First version: compare every pair. O(n^2) always.\"\"\"\n    _check(slots)\n    return [(i, j) for i in range(len(slots)) for j in range(i + 1, len(slots))\n            if slots[i][0] < slots[j][1] and slots[j][0] < slots[i][1]]\n\n\ndef rooms_slow(slots):\n    \"\"\"First version: at every start time, count the slots running. O(n^2).\"\"\"\n    _check(slots)\n    return max((sum(1 for s, e in slots if s <= t < e) for t, _ in slots), default=0)\n\n\ndef conflicts(slots):\n    \"\"\"Pairs of slot positions (i, j), i < j, whose times overlap. Touching is not a clash.\"\"\"\n    _check(slots)\n    by_start = sorted(range(len(slots)), key=lambda i: slots[i])\n    pairs = []\n    for a, i in enumerate(by_start):\n        for b in range(a + 1, len(by_start)):\n            j = by_start[b]\n            if slots[j][0] >= slots[i][1]:\n                break                                      # sorted by start: no later slot can reach slot i\n            pairs.append((min(i, j), max(i, j)))\n    return sorted(pairs)\n\n\ndef rooms(slots):\n    \"\"\"Fewest rooms so that no two overlapping slots share one = the most slots running at the same moment.\"\"\"\n    _check(slots)\n    ends, most = [], 0                                     # a min-heap of the end times of the slots running now\n    for start, end in sorted(slots):\n        while ends and ends[0] <= start:                   # that slot is over: touching does not overlap\n            heapq.heappop(ends)\n        heapq.heappush(ends, end)\n        most = max(most, len(ends))\n    return most\n",
     "complexity": "merge, free and rooms are O(n log n). conflicts is O(n log n + k) for k clashing pairs. The slow versions are O(n^2).",
     "explain": [
      "The end of a slot is not included, so back-to-back slots do not clash but do merge into one busy block.",
      "merge sorts and extends the last block when a slot starts at or before its end.",
      "free reuses merge and walks the blocks with a cursor; the last gap is added after the loop.",
      "conflicts sorts positions by slot and breaks out of the inner loop at the first later slot that starts at or after this end.",
      "rooms keeps a heap of end times; popping with <= lets back-to-back slots share a room.",
      "The slow versions compare every pair or count at every start and exist only to check the fast ones.",
      "What the checks print: merge: [(540, 660), (720, 810), (900, 960)] | conflicts: [(0, 1), (1, 2), (3, 4)] | free 8:00-17:00: [(480, 540), (660, 720), (810, 900), (960, 1020)] | rooms: 2 | error: slot (10, 10) must end after it starts | error: slot (30, 20) must end after it starts | 400 random days: free is exactly the uncovered minutes, blocks are separate, fast equals slow"
     ],
     "tests": "slots = [(540, 600), (570, 630), (600, 660), (720, 780), (750, 810), (900, 960)]   # minutes since midnight\nprint(\"merge:\", merge(slots))\nprint(\"conflicts:\", conflicts(slots))\nprint(\"free 8:00-17:00:\", free(slots, 480, 1020))\nprint(\"rooms:\", rooms(slots))\nassert merge(slots) == [(540, 660), (720, 810), (900, 960)]\nassert conflicts(slots) == [(0, 1), (1, 2), (3, 4)]          # (0, 2) only touches at 10:00\nassert free(slots, 480, 1020) == [(480, 540), (660, 720), (810, 900), (960, 1020)]\nassert rooms(slots) == 2 and rooms([(0, 10), (10, 20)]) == 1 and rooms([]) == 0\nassert merge([]) == [] and free([], 0, 10) == [(0, 10)] and free([(0, 100)], 10, 20) == []\nfor bad in ([(10, 10)], [(30, 20)]):\n    try:\n        merge(bad)\n    except ValueError as e:\n        print(\"error:\", e)\n\nimport random\nrng = random.Random(9)\nfor trial in range(400):\n    sl = []\n    for _ in range(rng.randint(0, 8)):\n        a = rng.randint(0, 28)\n        sl.append((a, rng.randint(a + 1, 30)))\n    busy = [any(s <= t < e for s, e in sl) for t in range(30)]          # the timeline, minute by minute\n    day = (rng.randint(0, 10), rng.randint(11, 30))\n    got = set()\n    for a, b in free(sl, *day):\n        got |= set(range(a, b))\n    assert got == {t for t in range(*day) if not busy[t]}                  # free is exactly the uncovered minutes\n    blocks = merge(sl)\n    assert all(blocks[k][1] < blocks[k + 1][0] for k in range(len(blocks) - 1))   # separate, not even touching\n    assert {t for a, b in blocks for t in range(a, b)} == {t for t in range(30) if busy[t]}\n    assert conflicts(sl) == conflicts_slow(sl)\n    assert rooms(sl) == rooms_slow(sl) == max((sum(1 for s, e in sl if s <= t < e) for t in range(30)), default=0)\nprint(\"400 random days: free is exactly the uncovered minutes, blocks are separate, fast equals slow\")\n",
     "followups": [
      {
       "q": "Who sits in which room?",
       "a": "Keep a second heap of free room ids. When a slot ends, its room id goes back to the free heap. A new slot takes the smallest free id, or a new id if none. The count of ids ever created is the answer to rooms."
      },
      {
       "q": "What if a slot repeats every week?",
       "a": "Expand it into the slots that fall in the window you are asked about, then use the same code. Do not teach the algorithm about calendars."
      },
      {
       "q": "Why return positions for conflicts and not the slots?",
       "a": "Two identical slots would collapse into one pair of values. Positions point to the exact inputs, and the caller can map them back to names or ids."
      },
      {
       "q": "How would you book a new slot only if it fits?",
       "a": "With the merged blocks sorted, find the place where it would go with a binary search and check the neighbours: its start must be at or after the previous block's end, and its end at or before the next block's start. That is O(log n) per booking."
      },
      {
       "q": "Why is conflicts not O(n log n)?",
       "a": "Because the answer can have about n squared pairs. If every slot overlaps every other, there is that much to output. The work is the sort plus the number of pairs found."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the code. The six-slot example by hand, touching slots, empty input, bad slots, and a random check on 400 days that compares minute by minute: free is exactly the uncovered minutes, blocks do not touch, and the fast conflicts and rooms equal the slow ones."
      }
     ],
     "d": "medium",
     "lc": "merge-intervals",
     "yt": [
      "44H3cEC2fFM",
      "NeetCode",
      11
     ]
    },
    {
     "t": "code",
     "id": "onsite-intervals-ext-code",
     "title": "Live extension: a time when the whole panel is free (runs together with the solution above)",
     "code": "def common_free(people, day_start, day_end, length):\n    \"\"\"Windows inside the day, at least `length` long, where nobody on the panel is busy.\n    people: name -> list of slots.\"\"\"\n    everyone = [slot for slots in people.values() for slot in slots]       # one pile: busy for anyone = busy\n    return [(a, b) for a, b in free(everyone, day_start, day_end) if b - a >= length]\n\n\ndef first_slot(people, day_start, day_end, length):\n    \"\"\"The earliest `length`-minute interview everyone can attend, or None.\"\"\"\n    windows = common_free(people, day_start, day_end, length)\n    return (windows[0][0], windows[0][0] + length) if windows else None\n\n\npanel = {\"ana\": [(540, 600), (660, 720)], \"bo\": [(570, 630)], \"cy\": [(780, 840)]}\nprint(\"windows of 45+:\", common_free(panel, 540, 900, 45))\nprint(\"first 45-minute slot:\", first_slot(panel, 540, 900, 45))\nprint(\"first 90-minute slot:\", first_slot(panel, 540, 900, 90), \"| 4 hours:\", first_slot(panel, 540, 900, 240))\nassert common_free({}, 0, 100, 10) == [(0, 100)]\n\nimport random\nrng = random.Random(2)\nfor trial in range(300):\n    pp = {f\"p{i}\": [(a, rng.randint(a + 1, 30)) for a in [rng.randint(0, 28) for _ in range(rng.randint(0, 3))]] for i in range(rng.randint(1, 4))}\n    L = rng.randint(1, 6)\n    slot = first_slot(pp, 0, 30, L)\n    ok = [t for t in range(0, 30 - L + 1) if all(not (s < t + L and t < e) for sl in pp.values() for s, e in sl)]\n    assert (slot[0] if slot else None) == (ok[0] if ok else None)           # earliest start everyone is free for L minutes\nprint(\"300 random panels: the first slot is the earliest start time where nobody overlaps\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Merge Intervals",
       "d": "medium",
       "lc": "merge-intervals",
       "yt": [
        "44H3cEC2fFM",
        "NeetCode",
        11
       ],
       "why": "Sort and extend the last block. This is merge, nearly line for line."
      },
      {
       "n": "Insert Interval",
       "d": "medium",
       "lc": "insert-interval",
       "yt": [
        "A8NUOmlwOlM",
        "NeetCode",
        12
       ],
       "why": "Merge with one new slot: the booking question. Before, overlapping, after."
      },
      {
       "n": "Divide Intervals Into Minimum Number of Groups",
       "d": "medium",
       "lc": "divide-intervals-into-minimum-number-of-groups",
       "yt": [
        "FVjKrhdMutc",
        "NeetCodeIO",
        12
       ],
       "why": "The fewest rooms, exactly. A heap of end times, or a sweep over starts and ends."
      },
      {
       "n": "Meeting Rooms III",
       "d": "hard",
       "lc": "meeting-rooms-iii",
       "yt": [
        "2VLwjvODQbA",
        "NeetCodeIO",
        17
       ],
       "why": "The harder follow-up: which room each meeting gets, with delays when all rooms are busy. Two heaps: free ids and busy rooms."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-dedupe",
   "title": "8. Candidate profile deduplication",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Group records that describe the same person. The data structure is union-find, but the real work is the part before it: what counts as the same key, and what happens when a key is shared by people who are not the same. The solo hour rewards the person who writes down the matching rules first. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"Candidate profiles come in from several sources, so one person often appears more than once. Each profile has an id, a name, and some emails, phones and links. Group together the profiles that are the same person.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "When are two profiles the same person: one shared email, phone or link, or more than one? Does the name matter?",
      "If A shares an email with B, and B shares a phone with C, are A and C the same person?",
      "What counts as the same email, phone or link: capital letters, +tags, dashes, a country code, http against https, a trailing slash?",
      "Some keys are shared by many people: an info@ mailbox, an agency switchboard. What then?",
      "What is returned: groups of ids, in what order? Do single profiles appear? Is one profile chosen as the real one?",
      "How many profiles? Do they arrive all at once or one at a time?",
      "A repeated id, a profile with no keys, a bad email or phone: what then?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what makes two profiles the same, transitive or not, normalisation rules, what is returned. Errors: duplicate id, empty or bad keys, generic keys. Scope: size, batch or stream.",
     "solution": "1. Primary capabilities\n- When are two profiles the same person?  Likely: they share at least one normalised email, phone or link. The name is not a key: different people share names.\n- Is it transitive?  Yes. A and B share an email, B and C share a phone: all three are one person. Ask, because this is the whole reason for union-find.\n- What is the same email?  Lower case, no +tag. Dots kept. Say that removing dots is a Gmail-only rule and would merge strangers on other providers.\n- Same phone?  Digits only, a leading 1 dropped when there are 11 digits, at least 7 digits to count.\n- Same link?  No http or https, no www, no query or fragment, no trailing slash, lower case.\n- What is returned?  A list of groups, each a list of ids in input order; groups ordered by their first profile. Singletons included.\n- Which profile is the real one?  Not asked. The first of each group is a fair default; say how you would score completeness if asked.\n\n2. Error handling\n- A repeated id?  ValueError.\n- A bad email, a short phone, an empty link?  Not a key. Ignore it; it links nothing.\n- A profile with no keys?  Its own group.\n- A key shared by many profiles (info@, a switchboard)?  A real risk: it merges strangers. Say it now; the guarded version in the live extension handles it.\n\n3. Scope boundaries\n- How big?  Say 1,000,000 profiles. That rules out comparing every pair.\n- Batch or stream?  A batch first. A stream is the extension.\n- Fuzzy name matching, typos, scoring?  Out of scope. Matching is exact on normalised keys.",
     "why": "'Transitive' is the sentence that tells the reviewer you know why a plain dict of key to profile is not enough. 'Generic keys' is the sentence that tells them you have seen real data. 'Dots kept' shows the normalisation is a decision, with a reason.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First I ask what counts as the same person. I would say any shared normalised email, phone or link, never the name, and I would say it is transitive, which is why this is a union-find problem. Then the normalisation rules, one by one. Then the danger: a key shared by many people, like a switchboard. I say now that it would merge strangers and that I have a guard for it. Last, size, and batch or stream."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One each for the key rule, normalisation, transitivity, the output, the bad inputs, fast equals slow, and size.",
     "solution": "1. Two profiles are the same person if they share at least one normalised email, phone or link.\n   - Test: different groups never share a key\n2. Normalisation: emails lower case without +tag; phones digits only without a leading US 1, at least 7 digits; links without scheme, www, query, fragment or trailing slash.\n   - Tests: Ana.R+jobs@Example.com equals ana.r@example.com; +1 (415) 555-0100 equals 415-555-0100\n3. Sharing is transitive: if A shares with B and B with C, all three are one group.\n4. dedupe returns groups of ids in input order, groups ordered by first profile, singletons included. Every id appears exactly once.\n5. A repeated id raises ValueError. A bad key is ignored. A profile with no keys is a group of one.\n6. The union-find version equals comparing every pair on random inputs.\n7. 1,000,000 profiles with about 3 keys each finish in seconds.\n8. Out of scope: name matching, typos, scoring, choosing the real profile, generic keys (live extension).",
     "why": "3 is why the structure is union-find. 1's test, different groups share nothing, is a property that holds for any input, so random data can check it. 2 gives each normalisation rule a one-line example the reviewer can read.",
     "say": "From the answers I get eight requirements and can test each one. **The ones I would not skip are that sharing is transitive, that profiles in different groups share no key, and that union-find equals comparing every pair on random input.** The normalisation rules get one example each. Out of scope: names, typos, and generic keys, which I will show as the live extension."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here the rule is the matching key and the group."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Profile: \nEmail, phone, link: \nNormalised key: \nGroup: \nKey owner (first profile seen): \nUnion-find: \nCanonical profile: ",
     "hint": "What do you compare? A key, not a profile. What do you remember between profiles? Who had the key first.",
     "solution": "Profile: drop as a class. A dict with an id and optional lists. Real data is JSON, and a missing field is a missing key.\nEmail, phone, link: drop as classes. Strings, normalised by three small functions.\nNormalised key: keep as a tagged string ('email:ana.r@example.com'). Tagging stops a phone and a link from ever being equal by accident.\nGroup: keep as the union-find root. Groups are never stored as lists while merging; they are read off at the end.\nKey owner: keep. A dict key -> the first profile that had it. When a second profile has the key, union the two. This is what avoids comparing every pair.\nUnion-find: keep. The one class. Two dicts, parent and size, with path halving and union by size.\nCanonical profile: drop. Not asked. If asked, a score per profile and a max per group.",
     "why": "The key owner dict is the idea of the solution: it turns 'which profiles share a key' from a pair search into one lookup per key. Union-find then keeps the groups as keys link them.",
     "say": "I underline the nouns. **The idea is the key owner dict: for each key I remember the first profile that had it, so a new profile with the same key is one lookup away from its group.** Union-find holds the groups. It has two dicts, a parent and a size, and two tricks: path halving on find, and hanging the smaller group under the larger on union. Together they make each call close to constant."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "dedupe:\n  1.\n  Edge cases:\n\nmatch_keys / the three normalisers:\n  1.\n\nUnionFind.find and union:\n  1.\n\ndedupe_slow:\n  1.\n",
     "hint": "Per profile: its keys. Per key: first owner or union with the owner. Groups are read off at the end by root, in input order.",
     "solution": "dedupe(profiles):\n  1. _check: ids must be unique\n  2. Make a union-find with every id as its own group\n  3. For each profile, for each of its keys: if some profile already owns the key, union the two; else this profile owns it\n  4. Walk the ids in input order, group them by root\n  Edge cases: a profile with no keys stays alone; the same key twice in one profile unions it with itself, which is a no-op\n\nmatch_keys(profile):\n  1. For each email, phone and link, normalise it; if the result is not None, add it, tagged by its type\n\n_email: strip and lower-case; no @ gives None; drop everything after the first + in the local part; an empty local part or domain gives None\n_phone: keep digits; 11 digits starting with 1 lose the 1; fewer than 7 digits give None\n_link: strip and lower-case; remove http:// or https://, then www.; cut at ? and #; drop trailing slashes; empty gives None\n\nUnionFind:\n  find(x): follow parents to the root; on the way, point each node at its grandparent\n  union(a, b): find both roots; if equal, do nothing; else hang the smaller group under the larger and add the sizes\n\ndedupe_slow(profiles):\n  1. Every pair of profiles: if their key sets intersect, merge their two groups\n  2. Read the groups in input order",
     "why": "Step 3 is the whole algorithm, and it is five lines. Everything else is rules about what a key is, and they are small functions so each can be tested on its own.",
     "say": "**Before any code I write the steps.** For each profile and each of its keys, I check whether someone already owns the key. If so, I union the two profiles; if not, this profile owns it. At the end I read the groups by root, in input order, so the output is repeatable. The three normalisers are small functions, each returning None for a bad value, so a bad key links nothing. The slow version compares every pair, and I keep it to check the fast one."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-e1",
     "q": "Code, top-down: dedupe first, naming _check, match_keys and _groups, then the UnionFind class.",
     "starter": "def dedupe(profiles):\n    ...\n\nclass UnionFind:\n    ...\n",
     "hint": "owner = {}. For each key: union with the owner or become it. The union-find has find with path halving and union by size.",
     "solution": "def dedupe(profiles):\n    \"\"\"profiles: list of dicts with an \"id\" and optional \"emails\", \"phones\", \"links\".\n    Returns groups of ids that are the same person: they share at least one normalised key, directly or\n    through other profiles. Groups come in the order of their first profile; ids inside in input order.\"\"\"\n    ids = _check(profiles)\n    parts = UnionFind(ids)\n    owner = {}                                             # key -> the first profile seen with it\n    for p in profiles:\n        for key in match_keys(p):\n            if key in owner:\n                parts.union(owner[key], p[\"id\"])           # they share a key: same person\n            else:\n                owner[key] = p[\"id\"]\n    return _groups(ids, parts)\n\n\nclass UnionFind:\n    \"\"\"Which group each item is in. find and union cost close to O(1) each.\"\"\"\n\n    def __init__(self, items):\n        self.up = {}                                       # item -> its parent; a root is its own parent\n        self.size = {}                                     # root -> how many items it holds\n        for x in items:\n            self.add(x)\n\n    def add(self, x):\n        self.up.setdefault(x, x)\n        self.size.setdefault(x, 1)\n\n    def find(self, x):\n        while self.up[x] != x:\n            self.up[x] = self.up[self.up[x]]               # path halving keeps the chains short\n            x = self.up[x]\n        return x\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False\n        if self.size[ra] < self.size[rb]:                  # hang the smaller group under the larger\n            ra, rb = rb, ra\n        self.up[rb] = ra\n        self.size[ra] += self.size[rb]\n        return True\n",
     "why": "dedupe is ten lines and reads like the steps. UnionFind is the standard class, written once, with comments on the two tricks.",
     "say": "I write dedupe first, because it is the whole algorithm: for each key, union with the owner or become the owner. **Then the union-find class, with two tricks that I can explain in one sentence each: path halving makes later finds shorter, and hanging the smaller group under the larger keeps the trees flat.** Together they make each call close to constant time."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-e2",
     "q": "The helpers: match_keys with the three normalisers, _check, _groups. Then the slow version that compares every pair.",
     "starter": "def match_keys(profile):\n    ...\n\ndef _email(e):\n    ...\n\ndef _phone(p):\n    ...\n\ndef _link(url):\n    ...\n\ndef dedupe_slow(profiles):\n    ...\n",
     "hint": "Each normaliser returns None for a bad value. match_keys tags what it keeps. The slow version keeps one shared set per group and swaps it for the merged set.",
     "solution": "\n\ndef match_keys(profile):\n    \"\"\"The set of things that can link this profile to another. Tagged, so an email never equals a phone.\"\"\"\n    out = set()\n    for e in profile.get(\"emails\", []):\n        k = _email(e)\n        if k:\n            out.add(\"email:\" + k)\n    for ph in profile.get(\"phones\", []):\n        k = _phone(ph)\n        if k:\n            out.add(\"phone:\" + k)\n    for url in profile.get(\"links\", []):\n        k = _link(url)\n        if k:\n            out.add(\"link:\" + k)\n    return out\n\n\ndef _email(e):\n    \"\"\"Lower case, no +tag. Dots are kept: removing them is a Gmail-only rule and would merge strangers.\"\"\"\n    e = e.strip().lower()\n    if \"@\" not in e:\n        return None\n    local, domain = e.rsplit(\"@\", 1)\n    local = local.split(\"+\")[0]\n    return local + \"@\" + domain if local and domain else None\n\n\ndef _phone(p):\n    \"\"\"Digits only, a leading US country code dropped. Fewer than 7 digits is not a usable key.\"\"\"\n    digits = \"\".join(ch for ch in p if ch.isdigit())\n    if len(digits) == 11 and digits[0] == \"1\":\n        digits = digits[1:]\n    return digits if len(digits) >= 7 else None\n\n\ndef _link(url):\n    \"\"\"No scheme, no www, no query or fragment, no trailing slash, lower case.\"\"\"\n    u = url.strip().lower()\n    for scheme in (\"https://\", \"http://\"):\n        if u.startswith(scheme):\n            u = u[len(scheme):]\n    if u.startswith(\"www.\"):\n        u = u[4:]\n    u = u.split(\"?\")[0].split(\"#\")[0].rstrip(\"/\")\n    return u or None\n\n\ndef _check(profiles):\n    ids = []\n    for p in profiles:\n        if p[\"id\"] in ids:                                  # fine for small lists; see the review questions\n            raise ValueError(f\"duplicate profile id: {p['id']}\")\n        ids.append(p[\"id\"])\n    return ids\n\n\ndef _groups(ids, parts):\n    groups = {}\n    for pid in ids:                                        # input order, so the output is repeatable\n        groups.setdefault(parts.find(pid), []).append(pid)\n    return list(groups.values())\n\n\ndef dedupe_slow(profiles):\n    \"\"\"First version: compare every pair of profiles and merge their groups when they share a key. O(n^2).\"\"\"\n    ids = _check(profiles)\n    key_sets = {p[\"id\"]: match_keys(p) for p in profiles}\n    group = {pid: {pid} for pid in ids}                    # id -> the set it is in (one shared object per group)\n    for i, a in enumerate(ids):\n        for b in ids[i + 1:]:\n            if key_sets[a] & key_sets[b] and group[a] is not group[b]:\n                merged = group[a] | group[b]\n                for x in merged:\n                    group[x] = merged\n    seen, out = set(), []\n    for pid in ids:\n        if id(group[pid]) not in seen:\n            seen.add(id(group[pid]))\n            out.append([x for x in ids if x in group[pid]])\n    return out\n",
     "why": "The normalisers are where the real decisions live, so each is a function you can point at in the review. The slow version is the checker.",
     "say": "Each normaliser returns None for a value that cannot be a key, so a bad email or a short phone links nothing. **match_keys tags each key with its type, so a phone can never equal a link by accident.** The slow version compares every pair of key sets and merges the two groups, and I use it only to check the fast one on random input."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** dedupe is O(total keys x alpha(n)) time and O(n + total keys) space, where alpha is the inverse Ackermann function, below 5 for any real n: close to linear. The normalisers are O(length of the string). _check as written is O(n^2) because of the list lookup; use a set for a million profiles. dedupe_slow is O(n^2 x keys)."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the tags, why dots are kept, the owner dict, path halving, union by size, _check's list lookup.",
     "solution": "1. Why tag the keys with email:, phone: and link:?  A phone number's digits and a link could be equal strings by accident. A tag makes that impossible.\n2. Why keep dots in the local part of an email?  Removing them is Gmail's rule. On other providers a.b and ab are different people, so removing them would merge strangers.\n3. Why an owner dict and not comparing every pair?  The dict finds a shared key in one lookup. Comparing pairs is quadratic, and a million profiles would take days.\n4. Why union-find and not a dict of key to group?  Groups merge when a profile links two of them. Union-find merges in near constant time; merging dicts means copying.\n5. What is path halving?  On find, each node is pointed at its grandparent. Later finds on that path are shorter.\n6. Why union by size?  It hangs the smaller tree under the larger one, so trees stay shallow.\n7. Why read the groups at the end and not keep them as lists?  Lists would have to be merged on every union. Roots are free; one pass at the end builds the lists.\n8. Why is _check slow as written?  `p['id'] in ids` scans a list: O(n^2). A set fixes it. I kept the list to keep the order and the message simple, and I would change it for a million.\n9. What if two different people share a key?  They are merged. This is the generic-key problem: the guard drops keys shared by more than a limit.\n10. What did you not test?  A million profiles for speed, and unusual phone formats such as extensions.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about generic keys, incremental arrival and choosing the real profile.",
     "say": "**In the review I answer from the lines on the screen.** The keys are tagged so a phone can never equal a link. Dots in emails stay because removing them is a Gmail-only rule. The owner dict finds a shared key in one lookup, which is why it is not quadratic. Union-find merges groups in near constant time. What I would change for a million is the duplicate check, which scans a list. And what I did not test is phone extensions."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-dedupe-ext",
     "q": "Live extension. The reviewer says: 'Recruiters use an agency switchboard and one info@ address on dozens of profiles. Stop that from merging strangers. And profiles arrive one at a time now.' Write how your design takes it, then the code.",
     "starter": "def dedupe_guarded(profiles, max_share=3):\n    ...\n\nclass LiveDedupe:\n    ...\n",
     "hint": "Count how many profiles each key appears in. A key above a limit links nothing. For a stream, keep the union-find and the owner dict between calls.",
     "solution": "Why the design takes it: keys are already separate strings, so a guard is a pass that counts them and a skip in the main loop. Nothing else changes. The limit is a judgement: say you would pick it from the data, for example the 99th percentile of how many profiles share a real person's key.\n\nA caution to say aloud: union-find cannot undo a union. A stream version that learns a key is generic after it has already merged people must keep the links it made and rebuild. So the guard is easy in a batch and awkward in a stream; keep a list of the reasons for each merge if you need to undo.\n\nFor a stream the union-find and the owner dict live between calls: add the profile as its own group, then for each key union with its owner or become it, and return the group. Reading one group is O(group size) here; keeping member lists on the roots would make it faster.\n\nThe code is in the block under the workbench. It prints the switchboard case with and without the guard, a three-profile stream, and checks both against the batch version on 300 random sets.",
     "why": "This is the question that tells the reviewer whether you have thought about real data. A union that cannot be undone is the kind of limit you should name before they do.",
     "say": "**Keys are separate strings, so a guard is a pass that counts how many profiles share each key and skips keys above a limit.** Nothing else changes. I pick the limit from the data. For a stream, the union-find and the owner dict stay alive between calls. What I would say honestly is that a union cannot be undone: if a key turns generic after it has merged people, I have to keep the reasons for each merge and rebuild."
    },
    {
     "t": "problem",
     "id": "onsite-dedupe-p",
     "title": "Candidate profile deduplication",
     "source": "Mercor-style dedupe prompt, rebuilt (left vague on purpose)",
     "minutes": 60,
     "why": "Union-find with a rule-heavy front end. The round grades whether you ask what 'the same person' means, and whether you see that sharing is transitive.",
     "statement": "\"Candidate profiles come in from several sources, so one person often appears more than once. Each profile has an id, a name, and some emails, phones and links. Group together the profiles that are the same person.\"",
     "examples": [
      {
       "input": "Ana.R@Example.com / ana.r+jobs@example.com / +1 (415) 555-0100 / 415-555-0100",
       "output": "same email, same phone",
       "note": "Normalisation: case, +tag, punctuation, country code."
      },
      {
       "input": "profile 3 links to linkedin.com/in/ana-r?trk=x; profile 1 links to https://www.linkedin.com/in/ana-r/",
       "output": "the same link",
       "note": "No scheme, no www, no query, no trailing slash."
      },
      {
       "input": "nine profiles from the example in the checks",
       "output": "[[1,2,3,6,9],[4,5],[7,8]]",
       "note": "Profile 6 joins Ana's group through profile 9 (same email as 6, same phone as 1)."
      },
      {
       "input": "no profiles",
       "output": "[]",
       "note": "Say it aloud."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 1,000,000 profiles",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def dedupe(profiles):\n    ...",
     "hints": [
      "Level 1: write the all-pairs version first. Two profiles are the same if their sets of normalised keys intersect. Merge groups as you find pairs.",
      "Level 2: avoid the pairs. Keep a dict from each key to the first profile that had it. A second profile with the same key joins the first one's group.",
      "Level 3: groups merge as you go, so use union-find (a parent dict, find with path halving, union by size). Read the groups at the end, in input order."
     ],
     "solution": "\n\ndef dedupe(profiles):\n    \"\"\"profiles: list of dicts with an \"id\" and optional \"emails\", \"phones\", \"links\".\n    Returns groups of ids that are the same person: they share at least one normalised key, directly or\n    through other profiles. Groups come in the order of their first profile; ids inside in input order.\"\"\"\n    ids = _check(profiles)\n    parts = UnionFind(ids)\n    owner = {}                                             # key -> the first profile seen with it\n    for p in profiles:\n        for key in match_keys(p):\n            if key in owner:\n                parts.union(owner[key], p[\"id\"])           # they share a key: same person\n            else:\n                owner[key] = p[\"id\"]\n    return _groups(ids, parts)\n\n\nclass UnionFind:\n    \"\"\"Which group each item is in. find and union cost close to O(1) each.\"\"\"\n\n    def __init__(self, items):\n        self.up = {}                                       # item -> its parent; a root is its own parent\n        self.size = {}                                     # root -> how many items it holds\n        for x in items:\n            self.add(x)\n\n    def add(self, x):\n        self.up.setdefault(x, x)\n        self.size.setdefault(x, 1)\n\n    def find(self, x):\n        while self.up[x] != x:\n            self.up[x] = self.up[self.up[x]]               # path halving keeps the chains short\n            x = self.up[x]\n        return x\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False\n        if self.size[ra] < self.size[rb]:                  # hang the smaller group under the larger\n            ra, rb = rb, ra\n        self.up[rb] = ra\n        self.size[ra] += self.size[rb]\n        return True\n\n\n\ndef match_keys(profile):\n    \"\"\"The set of things that can link this profile to another. Tagged, so an email never equals a phone.\"\"\"\n    out = set()\n    for e in profile.get(\"emails\", []):\n        k = _email(e)\n        if k:\n            out.add(\"email:\" + k)\n    for ph in profile.get(\"phones\", []):\n        k = _phone(ph)\n        if k:\n            out.add(\"phone:\" + k)\n    for url in profile.get(\"links\", []):\n        k = _link(url)\n        if k:\n            out.add(\"link:\" + k)\n    return out\n\n\ndef _email(e):\n    \"\"\"Lower case, no +tag. Dots are kept: removing them is a Gmail-only rule and would merge strangers.\"\"\"\n    e = e.strip().lower()\n    if \"@\" not in e:\n        return None\n    local, domain = e.rsplit(\"@\", 1)\n    local = local.split(\"+\")[0]\n    return local + \"@\" + domain if local and domain else None\n\n\ndef _phone(p):\n    \"\"\"Digits only, a leading US country code dropped. Fewer than 7 digits is not a usable key.\"\"\"\n    digits = \"\".join(ch for ch in p if ch.isdigit())\n    if len(digits) == 11 and digits[0] == \"1\":\n        digits = digits[1:]\n    return digits if len(digits) >= 7 else None\n\n\ndef _link(url):\n    \"\"\"No scheme, no www, no query or fragment, no trailing slash, lower case.\"\"\"\n    u = url.strip().lower()\n    for scheme in (\"https://\", \"http://\"):\n        if u.startswith(scheme):\n            u = u[len(scheme):]\n    if u.startswith(\"www.\"):\n        u = u[4:]\n    u = u.split(\"?\")[0].split(\"#\")[0].rstrip(\"/\")\n    return u or None\n\n\ndef _check(profiles):\n    ids = []\n    for p in profiles:\n        if p[\"id\"] in ids:                                  # fine for small lists; see the review questions\n            raise ValueError(f\"duplicate profile id: {p['id']}\")\n        ids.append(p[\"id\"])\n    return ids\n\n\ndef _groups(ids, parts):\n    groups = {}\n    for pid in ids:                                        # input order, so the output is repeatable\n        groups.setdefault(parts.find(pid), []).append(pid)\n    return list(groups.values())\n\n\ndef dedupe_slow(profiles):\n    \"\"\"First version: compare every pair of profiles and merge their groups when they share a key. O(n^2).\"\"\"\n    ids = _check(profiles)\n    key_sets = {p[\"id\"]: match_keys(p) for p in profiles}\n    group = {pid: {pid} for pid in ids}                    # id -> the set it is in (one shared object per group)\n    for i, a in enumerate(ids):\n        for b in ids[i + 1:]:\n            if key_sets[a] & key_sets[b] and group[a] is not group[b]:\n                merged = group[a] | group[b]\n                for x in merged:\n                    group[x] = merged\n    seen, out = set(), []\n    for pid in ids:\n        if id(group[pid]) not in seen:\n            seen.add(id(group[pid]))\n            out.append([x for x in ids if x in group[pid]])\n    return out\n",
     "complexity": "O(total keys x alpha(n)), close to linear, and O(n + total keys) space. The pair scan is O(n^2 x keys).",
     "explain": [
      "match_keys normalises emails, phones and links, drops bad values and tags the rest by type.",
      "owner remembers the first profile that had each key, so a shared key is found in one lookup.",
      "UnionFind keeps the groups. find halves paths; union hangs the smaller group under the larger.",
      "dedupe unions a profile with the owner of each of its keys, then reads the groups by root in input order.",
      "Because sharing is transitive, profile 6 joins Ana's group through profile 9.",
      "dedupe_slow compares every pair and exists only to check the fast version.",
      "What the checks print: groups: [[1, 2, 3, 6, 9], [4, 5], [7, 8]] | keys of profile 1: ['email:ana.r@example.com', 'link:linkedin.com/in/ana-r', 'phone:4155550100'] | error: duplicate profile id: 1 | 400 random sets: union-find equals the pair scan, everyone in one group, groups share no key"
     ],
     "tests": "profiles = [\n    {\"id\": 1, \"name\": \"Ana R\", \"emails\": [\"Ana.R@Example.com\"], \"phones\": [\"+1 (415) 555-0100\"], \"links\": [\"https://www.linkedin.com/in/ana-r/\"]},\n    {\"id\": 2, \"name\": \"A. Rao\", \"emails\": [\"ana.r+jobs@example.com\"]},\n    {\"id\": 3, \"name\": \"Ana Rao\", \"phones\": [\"415-555-0100\"], \"links\": [\"linkedin.com/in/ana-r?trk=x\"]},\n    {\"id\": 4, \"name\": \"Bo Li\", \"emails\": [\"bo@corp.io\"], \"phones\": [\"555-0199\"]},\n    {\"id\": 5, \"name\": \"Bobby Li\", \"phones\": [\"(555) 0199\"]},\n    {\"id\": 6, \"name\": \"Cy Xu\", \"emails\": [\"cy@x.org\"]},\n    {\"id\": 7, \"name\": \"Dee\", \"emails\": [\"info@agency.com\"]},\n    {\"id\": 8, \"name\": \"Eve\", \"emails\": [\"INFO@agency.com\"]},\n    {\"id\": 9, \"name\": \"Cyrus Xu\", \"emails\": [\"cy@x.org\"], \"phones\": [\"4155550100\"]},\n]\ngroups = dedupe(profiles)\nprint(\"groups:\", groups)\nassert groups == [[1, 2, 3, 6, 9], [4, 5], [7, 8]]                    # 6 joins Ana's group through profile 9\nassert dedupe_slow(profiles) == groups\nprint(\"keys of profile 1:\", sorted(match_keys(profiles[0])))\nassert dedupe([]) == [] and dedupe([{\"id\": \"solo\"}]) == [[\"solo\"]]\nassert _email(\"not-an-email\") is None and _phone(\"123\") is None and _link(\"  \") is None\ntry:\n    dedupe([{\"id\": 1}, {\"id\": 1}])\nexcept ValueError as e:\n    print(\"error:\", e)\n\nimport random\nrng = random.Random(13)\nEM = [f\"e{i}@x.com\" for i in range(6)]\nPH = [f\"555-010{i}\" for i in range(5)]\nLK = [f\"site.com/u{i}\" for i in range(5)]\nfor trial in range(400):\n    ps = []\n    for i in range(rng.randint(0, 12)):\n        p = {\"id\": i}\n        if rng.random() < 0.5: p[\"emails\"] = [rng.choice(EM).upper()]\n        if rng.random() < 0.3: p[\"phones\"] = [rng.choice(PH)]\n        if rng.random() < 0.3: p[\"links\"] = [\"https://www.\" + rng.choice(LK) + \"/\"]\n        ps.append(p)\n    g = dedupe(ps)\n    assert g == dedupe_slow(ps)                                          # union-find equals comparing every pair\n    flat = [x for grp in g for x in grp]\n    assert sorted(flat) == list(range(len(ps)))                          # everyone appears once\n    ks = {p[\"id\"]: match_keys(p) for p in ps}\n    where = {x: n for n, grp in enumerate(g) for x in grp}\n    assert all(not (ks[a] & ks[b]) for a in ks for b in ks if where[a] != where[b])   # different groups share nothing\nprint(\"400 random sets: union-find equals the pair scan, everyone in one group, groups share no key\")\n",
     "followups": [
      {
       "q": "A key shared by many unrelated people merges them. What do you do?",
       "a": "Count how many profiles share each key and ignore keys above a limit, chosen from the data. Say that a union cannot be undone, so in a stream you need to keep the reasons and rebuild. The code is in the live extension block."
      },
      {
       "q": "Which profile do you keep as the real one?",
       "a": "Ask what 'real' is for. A fair default is the most complete one: score each profile by how many fields it has, most recent update as a tie-break, take the max per group. Keep the others as aliases."
      },
      {
       "q": "Why not use the name too?",
       "a": "Names collide ('A. Rao' and 'Ana Rao' are probably one person; two 'John Smith' are not). Using names as a key merges strangers. If they want it, use it as a second signal that needs a key to agree, not as a key itself."
      },
      {
       "q": "Profiles arrive one at a time. What changes?",
       "a": "Nothing in the structure. The union-find and the owner dict live between calls. add() unions the new profile with the owner of each key and returns its group. Reading a whole group is O(group size) unless you keep member lists on the roots."
      },
      {
       "q": "Why path halving and union by size?",
       "a": "Without them a chain of unions can make a tree as tall as the number of items and each find slow. With both, find is close to constant time. Either alone is already good; I use both because each is one line."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the code. The nine-profile example by hand, each normaliser, empty input, a duplicate id, and a random check on 400 sets: union-find equals the pair scan, everyone is in one group, and profiles in different groups share no key."
      }
     ],
     "d": "medium",
     "lc": "accounts-merge",
     "yt": [
      "6st4IxEF-90",
      "NeetCodeIO",
      18
     ]
    },
    {
     "t": "code",
     "id": "onsite-dedupe-ext-code",
     "title": "Live extension: ignore generic keys, and add profiles one at a time (runs together with the solution above)",
     "code": "def dedupe_guarded(profiles, max_share=3):\n    \"\"\"Like dedupe, but a key shared by more than max_share profiles is generic (info@, a switchboard) and links nothing.\"\"\"\n    ids = _check(profiles)\n    count = {}\n    for p in profiles:\n        for key in match_keys(p):\n            count[key] = count.get(key, 0) + 1\n    parts, owner = UnionFind(ids), {}\n    for p in profiles:\n        for key in match_keys(p):\n            if count[key] > max_share:\n                continue                                       # too common to mean one person\n            if key in owner:\n                parts.union(owner[key], p[\"id\"])\n            else:\n                owner[key] = p[\"id\"]\n    return _groups(ids, parts)\n\n\nclass LiveDedupe:\n    \"\"\"Profiles arrive one at a time. Union-find keeps the groups up to date without starting over.\"\"\"\n\n    def __init__(self):\n        self.ids, self.parts, self.owner = [], UnionFind([]), {}\n\n    def add(self, profile):\n        \"\"\"Add one profile. Returns the ids now in its group, in arrival order.\"\"\"\n        pid = profile[\"id\"]\n        if pid in self.parts.up:\n            raise ValueError(f\"duplicate profile id: {pid}\")\n        self.ids.append(pid)\n        self.parts.add(pid)\n        for key in match_keys(profile):\n            if key in self.owner:\n                self.parts.union(self.owner[key], pid)\n            else:\n                self.owner[key] = pid\n        root = self.parts.find(pid)\n        return [x for x in self.ids if self.parts.find(x) == root]\n\n    def groups(self):\n        return _groups(self.ids, self.parts)\n\n\nagency = [{\"id\": i, \"emails\": [f\"rec{i}@agency.com\"], \"phones\": [\"+1 800 555 0000\"]} for i in range(4)]\nprint(\"switchboard shared by 4, plain:  \", dedupe(agency))\nprint(\"switchboard shared by 4, guarded:\", dedupe_guarded(agency, max_share=3))\nlive = LiveDedupe()\nfor p in [{\"id\": \"a\", \"emails\": [\"x@y.com\"]}, {\"id\": \"b\", \"phones\": [\"555 0101\"]}, {\"id\": \"c\", \"emails\": [\"X@y.com\"], \"phones\": [\"5550101\"]}]:\n    print(\"add\", p[\"id\"], \"->\", live.add(p))\nassert live.groups() == [[\"a\", \"b\", \"c\"]]\n\nimport random\nrng = random.Random(5)\nfor trial in range(300):\n    ps = [{\"id\": i, \"emails\": [f\"e{rng.randint(0, 5)}@x.com\"], \"phones\": [f\"555-010{rng.randint(0, 4)}\"]} for i in range(rng.randint(0, 10))]\n    lv = LiveDedupe()\n    for p in ps:\n        lv.add(p)\n    assert lv.groups() == dedupe(ps)                                     # arriving one by one equals all at once\n    assert dedupe_guarded(ps, max_share=len(ps)) == dedupe(ps)           # a limit nobody reaches changes nothing\nprint(\"300 random streams: one at a time equals all at once; a limit nobody reaches changes nothing\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Number of Provinces",
       "d": "medium",
       "lc": "number-of-provinces",
       "why": "Connected components: groups of nodes joined by links. The same idea with the links given."
      },
      {
       "n": "Accounts Merge",
       "d": "medium",
       "lc": "accounts-merge",
       "yt": [
        "6st4IxEF-90",
        "NeetCodeIO",
        18
       ],
       "why": "Almost exactly this problem: accounts that share an email are one person. Union-find over a key to owner map."
      },
      {
       "n": "Most Stones Removed with Same Row or Column",
       "d": "medium",
       "lc": "most-stones-removed-with-same-row-or-column",
       "why": "Group by shared row or column: two kinds of keys, one union-find. Same shape, different words."
      },
      {
       "n": "Remove Max Number of Edges to Keep Graph Fully Traversable",
       "d": "hard",
       "lc": "remove-max-number-of-edges-to-keep-graph-fully-traversable",
       "yt": [
        "booGwg5wYm4",
        "NeetCodeIO",
        18
       ],
       "why": "The harder follow-up: two union-finds at once and a reason to refuse a union. It shows what the return value of union is for."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-crawler",
   "title": "9. Rate-limited crawler",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A breadth-first search over a graph you discover as you go, with politeness added: no site is hit too often. The shape is the frontier and the visited set, and the interest is in what you do when the limit says 'not now'. It is also the problem where the clock is a decision: you simulate it, you do not sleep. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"You are given a function fetch(url) that returns the links found on a page. Starting from one URL, crawl the pages you can reach. Be polite to the sites you visit. Stop after a limit. Return what you fetched.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "What is 'polite'? At most how many fetches per host, per second?",
      "Do we really wait, or simulate a clock? What does the result say about time?",
      "What is 'a limit': pages fetched, pages seen, depth, time?",
      "Follow links to any host, or stay on the seed's site?",
      "What is the same page: capitals, a #fragment, a trailing slash, a query, http against https? Relative links?",
      "What if fetch raises? Retry, skip, record? What about the links of a page that failed?",
      "In what order: breadth-first or depth-first? What is returned: urls, with times, with failures?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-crawler-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what polite means in numbers, real or simulated time, what the limit counts, which hosts, what is the same page. Errors: a page that fails, a bad link, a loop. Scope: size, retries, robots.txt.",
     "solution": "1. Primary capabilities\n- What is polite?  Likely: at most per_host fetches per host in one second. Say you will make it a parameter.\n- Real time or simulated?  Simulated: a counter that goes up by one each second. Sleeping makes tests slow and unrepeatable. The result says which second each page was fetched in.\n- What is the limit?  The number of pages fetched. Say pages seen or depth are the other readings and cheap to add.\n- Which hosts?  Any, following links. Staying on the seed's site is one filter on the link.\n- What is the same page?  Lower-case scheme and host; no #fragment; no trailing slash except the root; the query is kept. http and https are different. Say that.\n- Relative links?  fetch returns absolute ones. Say urljoin is the next step if not.\n- Order and output?  Breadth-first. Return each page fetched with its second, the failures with their errors, and the number of seconds taken.\n\n2. Error handling\n- fetch raises?  Record the page as failed, never retry in the first version, and its links are lost. A failed try still counts against the host's limit: the request was sent.\n- A link that is not a web link (mailto:, empty)?  Ignored.\n- A loop of links?  The seen set stops it.\n- max_pages is 0, or per_host below 1?  0 returns nothing; per_host below 1 is a ValueError.\n\n3. Scope boundaries\n- How big?  Say a million pages. That rules out recursion.\n- Retries with backoff, robots.txt, threads, content duplicates?  Out of scope; the crawl delay is the live extension.",
     "why": "'Simulated clock' is the answer that makes the crawler testable. 'A failed try still counts' is a small point the reviewer notices. 'Marked seen when queued' (see the code) is the line that stops a page being queued many times, and the reason is in the review questions.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First, what polite means in numbers, and whether time is real or simulated. I would say simulated, a counter of seconds, so tests are fast and repeatable. Then what the limit counts and what the same page is: no fragment, no trailing slash, lower-case host. Then the failures: a page that fails is recorded, not retried, and still counts against the host. Last, size, and I say retries and robots.txt come next."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-crawler-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One each for BFS and the seen set, the clock, the per-host limit, the page limit, the result, failures, normalisation, size.",
     "solution": "1. crawl(seed, fetch, max_pages, per_host) is breadth-first from the seed.\n   - Test: with no real limit, every page is fetched in the tick equal to its depth\n2. A page is never fetched twice, whatever links point to it.\n3. In one tick, no host is fetched more than per_host times.\n   - Test: count per host per tick on random webs\n4. At most max_pages pages are fetched; max_pages of 0 fetches none.\n5. The result lists each fetched page with its tick, the failed pages with their errors, and the number of ticks.\n6. A fetch that raises is recorded as failed, counts against its host's limit for that tick, is not retried, and its links are lost.\n7. Urls are normalised before they are compared: scheme and host lower case, no fragment, no trailing slash (except the root). Non-web links are ignored.\n8. The rate-limited crawl fetches the same pages as a plain crawl, only more slowly.\n9. A million pages finish without recursion.\n10. Out of scope: real sleeping, retries, robots.txt, threads (crawl delay is the live extension).",
     "why": "1, 3 and 8 are checks without an answer key: depth equals tick when the limit is gone, the per-host count is a property of any run, and the plain crawl is the reference. They all run on random webs.",
     "say": "From the answers I get ten requirements and can test each one. **Three of them check themselves on random webs: with no real limit a page is fetched in the tick equal to its depth, no host is hit more than the limit in any tick, and the slow crawl fetches the same pages as the plain one.** Out of scope: real sleeping, retries, robots.txt, threads. The crawl delay I will show as the live extension."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here the structures matter more than the classes."
    },
    {
     "t": "write",
     "id": "onsite-crawler-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "URL: \nHost: \nLink graph / fetch: \nFrontier: \nSeen set: \nClock (tick): \nRate limit: \nResult: ",
     "hint": "What do you look up most often? 'Is this url already queued?' and 'which url does this host fetch next?'",
     "solution": "URL: drop as a class. A string. norm() gives it one spelling, so equal pages are equal strings.\nHost: drop as a class. A string from urlsplit, the key of the frontier.\nLink graph / fetch: not stored. fetch(url) is the only way to learn the graph, and it is passed in. That makes the crawler testable with a dict.\nFrontier: keep. A dict host -> deque of waiting urls. Per-host queues let one host's backlog never block another, and the per-host limit is a pop count.\nSeen set: keep. Every url ever queued. Marking when queued, not when fetched, keeps a page that is linked from a hundred places out of the queue 99 times.\nClock: keep as an int. One tick is one second. No sleeping.\nRate limit: drop as a class. The parameter per_host and a loop of that many pops per host per tick.\nResult: keep. A small dataclass: fetched with ticks, failed with errors, ticks.",
     "why": "The frontier as one deque per host is the idea to defend. A single shared queue would force you to rescan it for each tick to find what a host may fetch.",
     "say": "I underline the nouns. **The structure that matters is the frontier: one queue per host, so the rate limit is 'pop at most k from each queue each tick'.** The seen set marks a url when it is queued, not when it is fetched, so a page linked from many places is queued once. The clock is an integer. And fetch is passed in, which is how I test with a dict and why I never sleep."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-crawler-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "crawl:\n  1.\n  Edge cases:\n\nnorm:\n  1.\n\ncrawl_plain:\n  1.\n",
     "hint": "One tick per outer loop. In it, visit each host with work and pop up to per_host urls. Each fetch yields links; normalise, skip the seen, queue by host. Remove empty queues.",
     "solution": "crawl(seed, fetch, max_pages, per_host):\n  1. Reject per_host below 1 or negative max_pages\n  2. Normalise the seed; seen = {seed}; frontier = one queue with the seed under its host\n  3. While the frontier has hosts and fewer than max_pages are fetched: tick += 1\n  4. For each host that has work, in the order they first had work: pop up to per_host urls\n  5. For each url: call fetch. If it raises, record the error, move on (the try still counted). Otherwise record (tick, url)\n  6. For each link: normalise; if it is a web url not in seen, add it to seen and to the queue of its host\n  7. When a host's queue is empty, remove it from the frontier\n  Edge cases: stop in the middle of a host when max_pages is reached; a link that points to a host removed earlier in this tick recreates it; a seed that is not a web url normalises to None and should raise\n\nnorm(url):\n  1. Split the url; scheme must be http or https and there must be a host, else None\n  2. Lower-case scheme and host; drop the fragment; strip trailing slashes from the path, but keep '/' for the root\n  3. Keep the query\n\ncrawl_plain(seed, fetch, max_pages):\n  1. The same, with one queue, no ticks and no host limit",
     "why": "Step 4's order (hosts in the order they first had work) is what makes two runs give the same output. Step 6 is the line the review questions will ask about: seen is updated when queued.",
     "say": "**Before any code I write the steps.** One loop turn is one second. In it I visit every host that has work and pop up to the limit from its queue. A fetch that raises is recorded and still counts. For each link I normalise it, skip it if it was seen, and otherwise mark it seen and queue it under its host. A host with an empty queue is removed. I also write the plain crawl first, with one queue and no limit, because the rate-limited one has to fetch the same pages."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-crawler-e1",
     "q": "First idea: crawl_plain, a plain breadth-first crawl with a seen set and no politeness.",
     "starter": "def crawl_plain(seed, fetch, max_pages=100):\n    ...\n",
     "hint": "A queue, a seen set, mark seen when you queue. fetch can raise.",
     "solution": "from collections import deque\nfrom dataclasses import dataclass\nfrom urllib.parse import urlsplit, urlunsplit\n\ndef crawl_plain(seed, fetch, max_pages=100):\n    \"\"\"First version: plain breadth-first, no politeness. Returns the urls fetched, in order.\n    Marks a url as seen when it is queued, not when it is fetched, so it is never queued twice.\"\"\"\n    start = norm(seed)\n    if start is None:\n        raise ValueError(f\"the seed is not an absolute web url: {seed}\")\n    seen, queue, out = {start}, deque([start]), []\n    while queue and len(out) < max_pages:\n        url = queue.popleft()\n        try:\n            links = fetch(url)\n        except Exception:\n            continue                                       # a page that fails is skipped, and its links are lost\n        out.append(url)\n        for link in links:\n            u = norm(link)\n            if u and u not in seen:\n                seen.add(u)\n                queue.append(u)\n    return out\n",
     "why": "This is Number of Islands with a function instead of a grid. It is short, and it is the reference for the rate-limited version.",
     "say": "I start with the plain version. A queue, a seen set, and I mark a page seen when I queue it, so it never goes in twice. **It is correct but it would hit one site as fast as it can, so the next version adds a queue per host and a clock.** I keep this one because the rate-limited crawl must fetch the same pages, which I can check on random webs."
    },
    {
     "t": "write",
     "id": "onsite-crawler-e2",
     "q": "The rate-limited crawl: the Crawl result and crawl(), with one queue per host and a simulated clock.",
     "starter": "@dataclass\nclass Crawl:\n    ...\n\ndef crawl(seed, fetch, max_pages=100, per_host=2):\n    ...\n",
     "hint": "Outer loop: one tick. Inside: for host in list(queues), pop up to per_host. A failed fetch uses up one of the tries. Delete a host when its queue is empty.",
     "solution": "\n\n@dataclass\nclass Crawl:\n    fetched: list      # (tick, url) in the order fetched\n    failed: dict       # url -> the error, for pages whose fetch raised\n    ticks: int         # how many ticks (seconds) the crawl took\n\n\ndef crawl(seed, fetch, max_pages=100, per_host=2):\n    \"\"\"Breadth-first from `seed`. In each tick a host is fetched at most `per_host` times.\n    fetch(url) returns the links on the page, or raises. Stops at max_pages fetched or when nothing is left.\"\"\"\n    if max_pages < 0 or per_host < 1:\n        raise ValueError(\"max_pages must be >= 0 and per_host >= 1\")\n    start = norm(seed)\n    if start is None:\n        raise ValueError(f\"the seed is not an absolute web url: {seed}\")\n    seen = {start}                                         # every url ever queued: the guard against loops\n    queues = {host_of(start): deque([start])}              # host -> its waiting urls, oldest first\n    out, tick = Crawl([], {}, 0), 0\n    while queues and len(out.fetched) < max_pages:\n        tick += 1                                          # one second passes\n        found = []                                         # links found this second wait until the next one\n        for host in list(queues):                          # hosts in the order they first had work\n            q = queues[host]\n            for _ in range(per_host):                      # a try counts against the limit even if it fails\n                if not q or len(out.fetched) >= max_pages:\n                    break\n                url = q.popleft()\n                try:\n                    links = fetch(url)\n                except Exception as e:                     # not BaseException: Ctrl-C must still stop us\n                    out.failed[url] = f\"{type(e).__name__}: {e}\"\n                    continue\n                out.fetched.append((tick, url))\n                for link in links:\n                    u = norm(link)\n                    if u and u not in seen:\n                        seen.add(u)\n                        found.append(u)\n            if not q:\n                del queues[host]                           # nothing left for this host for now\n        for u in found:                                    # the new second starts: the found pages join their hosts\n            queues.setdefault(host_of(u), deque()).append(u)\n    out.ticks = tick\n    return out\n",
     "why": "crawl is the plain version with one structural change: the queue is split by host and the pop count is capped per tick. Everything else is the same code.",
     "say": "The change from the plain version is one structural step: the queue is split by host and each host is popped at most per_host times per tick. **A try that fails still counts, because the request was sent.** I walk over a copy of the host list so I can delete empty hosts while I loop. The clock is an integer, so a test of a thousand seconds takes no time."
    },
    {
     "t": "write",
     "id": "onsite-crawler-e3",
     "q": "The helpers: norm (one spelling per page) and host_of.",
     "starter": "def norm(url):\n    ...\n\ndef host_of(url):\n    ...\n",
     "hint": "urlsplit gives scheme, netloc, path, query, fragment. Lower-case scheme and host, drop the fragment, strip trailing slashes but keep '/' for the root, keep the query.",
     "solution": "\n\ndef norm(url):\n    \"\"\"One spelling per page: lower-case scheme and host, no fragment, no trailing slash except the root.\n    Returns None for anything that is not an absolute http or https url.\"\"\"\n    parts = urlsplit(url.strip())\n    if parts.scheme.lower() not in (\"http\", \"https\") or not parts.netloc:\n        return None\n    path = parts.path.rstrip(\"/\") or \"/\"\n    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path, parts.query, \"\"))\n\n\ndef host_of(url):\n    return urlsplit(url).netloc\n",
     "why": "norm is where 'the same page' is decided, so it is small, documented and tested on its own.",
     "say": "norm is where I decide what the same page is. **Lower-case scheme and host, no fragment, no trailing slash except the root, the query stays.** Anything that is not an absolute web url returns None and is ignored. I say that http and https are different pages on purpose, and that relative links would need urljoin."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** Every page is queued once and fetched at most once. Work is O(pages + links) for queueing, plus O(ticks x active hosts) for walking the hosts: each tick visits every host that has work. Memory is the seen set and the frontier, O(pages + links in the worst case). crawl_plain is O(pages + links)."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-crawler-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: where seen is updated, list(queues), the try inside range(per_host), norm, Exception, the dataclass.",
     "solution": "1. Why mark a url seen when you queue it and not when you fetch it?  If it is marked at fetch, a page linked from a hundred places is queued a hundred times before the first fetch. It would be fetched many times, or checked many times.\n2. Why for host in list(queues)?  I delete from queues inside the loop. Looping over a copy avoids 'dictionary changed size during iteration'.\n3. Why does a failed fetch use up a try?  The request was sent to the host. A polite crawler counts attempts, not successes.\n4. Why continue and not retry?  A first version records the failure and moves on. A retry needs a count per url and a wait, which is the next feature.\n5. Why is the clock an int?  Sleeping makes tests slow and unrepeatable. An int is the same logic and a thousand seconds cost nothing.\n6. Why break on max_pages inside the inner loop?  The limit is on pages fetched, so stop mid-host rather than finish the host's turn.\n7. Why one queue per host?  The limit is per host. With one shared queue I would rescan it every tick to find what each host may fetch.\n8. Why is the order of hosts repeatable?  A dict keeps insertion order, so hosts are visited in the order they first had work.\n9. What does norm do with 'http://a.com/x/'?  Lower-case, no fragment, trailing slash stripped: 'http://a.com/x'. The root keeps its slash.\n10. What did you not test?  A million pages for speed and memory, and relative links.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about threads, retries, robots.txt and huge crawls.",
     "say": "**In the review I answer from the lines on the screen.** A url is marked seen when it is queued, so a page linked from many places goes in once. I loop over a copy of the hosts because I delete from the dict. A failed fetch counts against the host, because the request was sent. The clock is an integer so tests are fast. What I did not test is a million pages for speed, and relative links."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-crawler-ext",
     "q": "Live extension. The reviewer says: 'Some hosts publish a Crawl-delay in robots.txt, say 2 seconds between hits. Add that.' Write how your design takes it, then the code.",
     "starter": "def crawl_polite(seed, fetch, max_pages=100, per_host=1, delay=None):\n    ...\n",
     "hint": "Keep a dict host -> the first tick it may be hit again. Skip the host in the tick loop while it rests. Set it after the host's turn.",
     "solution": "Why the design takes it: the frontier is already per host and the clock is already an integer. A delay is one more dict, ready_at: host -> the first tick the host may be hit again. In the tick loop a host that is still resting is skipped (its queue stays as it is), and after a host's turn its ready time is set to now + 1 + delay.\n\nThe diff is three lines, marked NEW in the code. The loop, the seen set and the result are unchanged. With no delays it must give the same output as crawl, which the code checks.\n\nWhat to say about the cost: a resting host is still visited every tick, which is O(hosts) per tick. With thousands of hosts keep a heap of (ready tick, host) and jump the clock to the next ready tick.\n\nThe code is in the block under the workbench. It prints a case with and without a 2-tick delay on a.com, checks that no delay gives the old crawl, and checks on 200 random webs that no host is hit before its gap has passed.",
     "why": "This is the 'does your structure bend' question. Because the frontier is per host and the clock is a number, a policy per host is a dict and an if. A shared queue would have needed a rewrite.",
     "say": "**The frontier is already per host and the clock is already a number, so a crawl delay is one more dict: the first tick each host may be hit again.** In the tick loop I skip a host that is resting, and after its turn I set its ready time. It is a three-line change and with no delays it gives the same output as before, which I check. If there are thousands of hosts I would keep a heap of ready times and jump the clock, instead of visiting resting hosts every tick."
    },
    {
     "t": "problem",
     "id": "onsite-crawler-p",
     "title": "Rate-limited crawler",
     "source": "Mercor-style crawler prompt, rebuilt (left vague on purpose)",
     "minutes": 60,
     "why": "Breadth-first search with a frontier, a visited set and a limit. The round grades the marking of seen, the per-host queues and the decision to simulate time.",
     "statement": "\"You are given a function fetch(url) that returns the links found on a page. Starting from one URL, crawl the pages you can reach. Be polite to the sites you visit. Stop after a limit. Return what you fetched.\"",
     "examples": [
      {
       "input": "a.com/ links to a.com/x, b.com/, a.com/y#top, HTTP://A.COM/x/ and mailto:me@a.com; per_host 1",
       "output": "tick 1: a.com/; tick 2: a.com/x, b.com/; tick 3: a.com/y, c.com/, b.com/p; tick 4: a.com/z",
       "note": "The fragment and the capitals are the same page; mailto is ignored."
      },
      {
       "input": "c.com/ links to c.com/q, which is not on the web",
       "output": "c.com/q is in failed",
       "note": "It counted against c.com's limit and was not retried."
      },
      {
       "input": "max_pages 3",
       "output": "a.com/, a.com/x, b.com/",
       "note": "The crawl stops mid-tick when the limit is reached."
      },
      {
       "input": "per_host 0",
       "output": "ValueError",
       "note": "Say it aloud."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 1,000,000 pages, so no recursion",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def crawl(seed, fetch, max_pages=100, per_host=2):\n    ...",
     "hints": [
      "Level 1: write a plain breadth-first crawl first, with a queue and a set of urls seen. Mark a url seen when you queue it.",
      "Level 2: to be polite, split the queue by host (a dict of host to deque) and count time in ticks: each tick, each host with work may fetch at most per_host urls.",
      "Level 3: normalise urls (lower case host, no fragment, no trailing slash) before you compare them. A failed fetch still counts against the host. Delete a host's queue when it is empty."
     ],
     "solution": "from collections import deque\nfrom dataclasses import dataclass\nfrom urllib.parse import urlsplit, urlunsplit\n\ndef crawl_plain(seed, fetch, max_pages=100):\n    \"\"\"First version: plain breadth-first, no politeness. Returns the urls fetched, in order.\n    Marks a url as seen when it is queued, not when it is fetched, so it is never queued twice.\"\"\"\n    start = norm(seed)\n    if start is None:\n        raise ValueError(f\"the seed is not an absolute web url: {seed}\")\n    seen, queue, out = {start}, deque([start]), []\n    while queue and len(out) < max_pages:\n        url = queue.popleft()\n        try:\n            links = fetch(url)\n        except Exception:\n            continue                                       # a page that fails is skipped, and its links are lost\n        out.append(url)\n        for link in links:\n            u = norm(link)\n            if u and u not in seen:\n                seen.add(u)\n                queue.append(u)\n    return out\n\n\n\n@dataclass\nclass Crawl:\n    fetched: list      # (tick, url) in the order fetched\n    failed: dict       # url -> the error, for pages whose fetch raised\n    ticks: int         # how many ticks (seconds) the crawl took\n\n\ndef crawl(seed, fetch, max_pages=100, per_host=2):\n    \"\"\"Breadth-first from `seed`. In each tick a host is fetched at most `per_host` times.\n    fetch(url) returns the links on the page, or raises. Stops at max_pages fetched or when nothing is left.\"\"\"\n    if max_pages < 0 or per_host < 1:\n        raise ValueError(\"max_pages must be >= 0 and per_host >= 1\")\n    start = norm(seed)\n    if start is None:\n        raise ValueError(f\"the seed is not an absolute web url: {seed}\")\n    seen = {start}                                         # every url ever queued: the guard against loops\n    queues = {host_of(start): deque([start])}              # host -> its waiting urls, oldest first\n    out, tick = Crawl([], {}, 0), 0\n    while queues and len(out.fetched) < max_pages:\n        tick += 1                                          # one second passes\n        found = []                                         # links found this second wait until the next one\n        for host in list(queues):                          # hosts in the order they first had work\n            q = queues[host]\n            for _ in range(per_host):                      # a try counts against the limit even if it fails\n                if not q or len(out.fetched) >= max_pages:\n                    break\n                url = q.popleft()\n                try:\n                    links = fetch(url)\n                except Exception as e:                     # not BaseException: Ctrl-C must still stop us\n                    out.failed[url] = f\"{type(e).__name__}: {e}\"\n                    continue\n                out.fetched.append((tick, url))\n                for link in links:\n                    u = norm(link)\n                    if u and u not in seen:\n                        seen.add(u)\n                        found.append(u)\n            if not q:\n                del queues[host]                           # nothing left for this host for now\n        for u in found:                                    # the new second starts: the found pages join their hosts\n            queues.setdefault(host_of(u), deque()).append(u)\n    out.ticks = tick\n    return out\n\n\n\ndef norm(url):\n    \"\"\"One spelling per page: lower-case scheme and host, no fragment, no trailing slash except the root.\n    Returns None for anything that is not an absolute http or https url.\"\"\"\n    parts = urlsplit(url.strip())\n    if parts.scheme.lower() not in (\"http\", \"https\") or not parts.netloc:\n        return None\n    path = parts.path.rstrip(\"/\") or \"/\"\n    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path, parts.query, \"\"))\n\n\ndef host_of(url):\n    return urlsplit(url).netloc\n",
     "complexity": "O(pages + links) for queueing plus O(ticks x active hosts) for visiting hosts. Memory is the seen set and the frontier.",
     "explain": [
      "norm gives each page one spelling, so the seen set can compare strings.",
      "seen is updated when a url is queued, so a page linked from many places is queued once.",
      "queues maps each host to its waiting urls. A tick lets each host fetch at most per_host of them.",
      "A fetch that raises is recorded in failed, counts against the host, and is not retried.",
      "Links found in a tick join the queues at the end of it, so a page found now is fetched next second at the earliest.",
      "The loop stops at max_pages, even in the middle of a host's turn, or when no host has work.",
      "crawl_plain has one queue and no limit; the rate-limited crawl must fetch the same pages.",
      "What the checks print: norm: http://a.com/x http://a.com/ http://a.com/y None | tick 1 http://a.com/ | tick 2 http://a.com/x | tick 2 http://b.com/ | tick 3 http://a.com/y | tick 3 http://c.com/ | tick 3 http://b.com/p"
     ],
     "tests": "web = {\n    \"http://a.com/\": [\"http://a.com/x\", \"http://b.com/\", \"http://a.com/y#top\", \"HTTP://A.COM/x/\", \"mailto:me@a.com\"],\n    \"http://a.com/x\": [\"http://a.com/\", \"http://c.com/\"],\n    \"http://a.com/y\": [\"http://a.com/z\"],\n    \"http://a.com/z\": [],\n    \"http://b.com/\": [\"http://b.com/p\", \"http://a.com/x\"],\n    \"http://b.com/p\": [],\n    \"http://c.com/\": [\"http://c.com/q\"],                   # c.com/q is not in the dict: fetching it fails\n}\ndef fetch(url):\n    return web[url]                                        # a KeyError stands in for a 404\n\nprint(\"norm:\", norm(\"HTTP://A.COM/x/\"), norm(\"http://a.com\"), norm(\"http://a.com/y#top\"), norm(\"mailto:me@a.com\"))\nr = crawl(\"http://a.com/\", fetch, per_host=1)\nfor tick, url in r.fetched:\n    print(\"tick\", tick, url)\nprint(\"failed:\", r.failed, \"| ticks:\", r.ticks)\nassert [u for _, u in r.fetched] == [\"http://a.com/\", \"http://a.com/x\", \"http://b.com/\", \"http://a.com/y\", \"http://c.com/\",\n                                     \"http://b.com/p\", \"http://a.com/z\"]\nassert list(r.failed) == [\"http://c.com/q\"]\nr2 = crawl(\"http://a.com/\", fetch, per_host=1, max_pages=3)\nprint(\"max_pages 3:\", [u for _, u in r2.fetched])\nassert len(r2.fetched) == 3 and crawl(\"http://a.com/\", fetch, max_pages=0).fetched == []\ntry:\n    crawl(\"http://a.com/\", fetch, per_host=0)\nexcept ValueError as e:\n    print(\"error:\", e)\n\nimport random\nrng = random.Random(17)\nHOSTS = [\"a.com\", \"b.com\", \"c.com\", \"d.com\"]\nfor trial in range(300):\n    pages = [f\"http://{rng.choice(HOSTS)}/p{i}\" for i in range(rng.randint(1, 14))]\n    pages = list(dict.fromkeys(pages))\n    links = {p: [rng.choice(pages) + rng.choice([\"\", \"/\", \"#x\"]) for _ in range(rng.randint(0, 4))] for p in pages}\n    broken = {p for p in pages if rng.random() < 0.15}\n    def fetch2(url):\n        if url in broken or url not in links:\n            raise IOError(\"down\")\n        return links[url]\n    k = rng.randint(1, 3)\n    res = crawl(pages[0], fetch2, max_pages=1000, per_host=k)\n    urls = [u for _, u in res.fetched]\n    assert len(urls) == len(set(urls))                                          # no page twice\n    for tick in {t for t, _ in res.fetched}:\n        per = {}\n        for t, u in res.fetched:\n            if t == tick:\n                per[host_of(u)] = per.get(host_of(u), 0) + 1\n        assert max(per.values()) <= k                                           # nobody hit more than k times a tick\n    plain = crawl_plain(pages[0], fetch2, max_pages=1000)\n    assert set(urls) == set(plain)                                              # same pages as a plain crawl, only slower\n    assert set(res.failed) == {p for p in (set(plain) | set(res.failed)) if p in broken}\n    big = crawl(pages[0], fetch2, max_pages=1000, per_host=1000)               # no real limit: one tick per level\n    depth = {norm(pages[0]): 0}\n    queue = deque([norm(pages[0])])\n    while queue:\n        u = queue.popleft()\n        if u in broken:\n            continue\n        for l in links[u]:\n            v = norm(l)\n            if v not in depth:\n                depth[v] = depth[u] + 1\n                queue.append(v)\n    assert {u: t - 1 for t, u in big.fetched} == {u: depth[u] for u in urls if u in depth and u not in broken}\nprint(\"300 random webs: no page twice, no host over its limit, same pages as plain, a limitless crawl is one tick per level\")\n",
     "followups": [
      {
       "q": "How would you make it multi-threaded?",
       "a": "A pool of workers pulling from the frontier, with a lock on the seen set and the per-host state, or a coordinator thread that owns them and hands urls to workers. The per-host rule becomes a token bucket per host, shared by all workers. Say you would measure first, because the network is the bottleneck, not the CPU."
      },
      {
       "q": "How do you retry?",
       "a": "Keep an attempt count per url. On failure, if the count is below a cap, push it back on its host's queue with a ready tick of now plus a backoff that grows, say 1, 2, 4 seconds with a little jitter. Retry only errors that can pass, such as a timeout, not a 404."
      },
      {
       "q": "The seen set grows with the web. What then?",
       "a": "For a few million urls a set of hashes is fine. Beyond memory, use a Bloom filter (a small chance of skipping a page it has not seen) or a disk-backed set, and say which error you can live with."
      },
      {
       "q": "Breadth-first or depth-first?",
       "a": "Breadth-first reaches the near pages first and spreads load across hosts early. Depth-first can sink into one site and hammer it. Neither matters for correctness; the rate limit does."
      },
      {
       "q": "What about two urls with the same content?",
       "a": "Hash the content and keep a set of hashes. It needs the body, so fetch would return it, and it saves following the same links twice. Out of scope for the first version."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the code. A seven-page web with a failing page, normalisation cases, the page limit, a bad limit, and a random check on 300 webs: no page twice, no host over its limit in any tick, the same pages as the plain crawl, and a limitless crawl takes one tick per level."
      }
     ],
     "d": "medium",
     "lc": "number-of-islands",
     "yt": [
      "pV2kpPD66nE",
      "NeetCode",
      12
     ]
    },
    {
     "t": "code",
     "id": "onsite-crawler-ext-code",
     "title": "Live extension: a crawl delay per host (runs together with the solution above)",
     "code": "def crawl_polite(seed, fetch, max_pages=100, per_host=1, delay=None):\n    \"\"\"Like crawl, plus a gap between hits on a host: delay maps host -> ticks to wait after each fetch\n    (a robots.txt Crawl-delay). A host with no entry has no gap.\"\"\"\n    delay = delay or {}\n    start = norm(seed)\n    seen = {start}\n    queues = {host_of(start): deque([start])}\n    ready_at = {}                                          # NEW: host -> the first tick it may be hit again\n    out, tick = Crawl([], {}, 0), 0\n    while queues and len(out.fetched) < max_pages:\n        tick += 1\n        found = []\n        for host in list(queues):\n            if tick < ready_at.get(host, 0):               # NEW: still resting, leave its queue alone\n                continue\n            q = queues[host]\n            for _ in range(per_host):\n                if not q or len(out.fetched) >= max_pages:\n                    break\n                url = q.popleft()\n                try:\n                    links = fetch(url)\n                except Exception as e:\n                    out.failed[url] = f\"{type(e).__name__}: {e}\"\n                    continue\n                out.fetched.append((tick, url))\n                for link in links:\n                    u = norm(link)\n                    if u and u not in seen:\n                        seen.add(u)\n                        found.append(u)\n            ready_at[host] = tick + 1 + delay.get(host, 0)  # NEW: rest after this turn\n            if not q:\n                del queues[host]\n        for u in found:\n            queues.setdefault(host_of(u), deque()).append(u)\n    out.ticks = tick\n    return out\n\n\nweb = {\n    \"http://a.com/\": [\"http://a.com/x\", \"http://a.com/y\", \"http://b.com/\"],\n    \"http://a.com/x\": [], \"http://a.com/y\": [], \"http://b.com/\": [],\n}\nr = crawl_polite(\"http://a.com/\", lambda u: web[u], per_host=1, delay={\"a.com\": 2})\nprint(\"a.com waits 2 ticks between hits:\", r.fetched)\nr0 = crawl_polite(\"http://a.com/\", lambda u: web[u], per_host=1)\nprint(\"no delay:\", r0.fetched)\nassert r0.fetched == crawl(\"http://a.com/\", lambda u: web[u], per_host=1).fetched   # no delay equals the first crawl\n\nimport random\nrng = random.Random(3)\nfor trial in range(200):\n    pages = list(dict.fromkeys(f\"http://{rng.choice('abc')}.com/p{i}\" for i in range(rng.randint(1, 10))))\n    links = {p: [rng.choice(pages) for _ in range(rng.randint(0, 3))] for p in pages}\n    d = {h: rng.randint(0, 3) for h in (\"a.com\", \"b.com\", \"c.com\")}\n    res = crawl_polite(pages[0], lambda u: links[u], max_pages=1000, delay=d)\n    last = {}\n    for t, u in res.fetched:\n        h = host_of(u)\n        assert h not in last or t - last[h] > d[h]                 # a host is never hit before its gap is over\n        last[h] = t\nprint(\"200 random webs: no host is hit again before its crawl delay has passed\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Number of Islands",
       "d": "medium",
       "lc": "number-of-islands",
       "yt": [
        "pV2kpPD66nE",
        "NeetCode",
        12
       ],
       "why": "The visited set and the queue, with cells instead of urls. Mark seen when you queue."
      },
      {
       "n": "Clone Graph",
       "d": "medium",
       "lc": "clone-graph",
       "yt": [
        "mQeF6bN8hMk",
        "NeetCode",
        12
       ],
       "why": "Walk a graph you only reach through neighbours, with a map so nothing is done twice."
      },
      {
       "n": "Rotting Oranges",
       "d": "medium",
       "lc": "rotting-oranges",
       "yt": [
        "y704fEOx0s0",
        "NeetCode",
        13
       ],
       "why": "A breadth-first search counted in minutes: the level is the clock, as in the no-limit check."
      },
      {
       "n": "Word Ladder",
       "d": "hard",
       "lc": "word-ladder",
       "yt": [
        "h9iTnkgv05E",
        "NeetCode",
        18
       ],
       "why": "The harder follow-up: breadth-first over a graph that is built as you go, and the shortest number of steps. Normalise and mark seen when queued."
      },
      {
       "n": "Shortest Path in Binary Matrix",
       "d": "medium",
       "lc": "shortest-path-in-binary-matrix",
       "yt": [
        "YnxUdAO7TAo",
        "NeetCodeIO",
        13
       ],
       "why": "Grid BFS with a visited set: the base for the next one."
      },
      {
       "n": "Shortest Path in a Grid with Obstacles Elimination",
       "d": "hard",
       "lc": "shortest-path-in-a-grid-with-obstacles-elimination",
       "yt": [
        "ID9YJXy3OJk",
        "Algorithms Made Easy",
        17
       ],
       "why": "Practice only: its title appears in a Mercor question bank (30 Aug 2026) with no spec. BFS where the state is (row, column, eliminations left)."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-ttlcache",
   "title": "10. LRU cache with expiry",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A cache for model calls written by hand: a dict for lookup and a doubly linked list for order, plus an expiry time on each entry. It is the classic LRU Cache with one rule more, and the extra rule is where the bugs are: does reading extend life, and is an entry expired at exactly its ttl? The solo hour grades correctness under constraints, so you test it on a clock you control. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"We call a language model with the same prompts again and again. Build a cache for the answers by hand. get(key) returns a stored answer, put(key, value) stores one. It holds at most N entries and drops the least recently used first. Entries should expire after a while. Show that it is correct.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "Does reading an entry extend its life, or only writing it? Is the expiry counted from the write?",
      "Is an entry expired at exactly its ttl, or one tick later?",
      "What does get return on a miss? Can a stored value be None?",
      "Where does time come from? How do you test expiry without sleeping?",
      "When the cache is full, and an old entry has expired but nobody has looked at it, what is evicted?",
      "What counts as a size: one per entry, or the size of the answer?",
      "Should a failed model call be cached? Several threads? What do you count (hits, misses)?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: get, put, what a read does, when an entry expires, what a miss returns, where time comes from. Errors: bad capacity, a failing model, expired but untouched entries. Scope: size by count or by cost, threads.",
     "solution": "1. Primary capabilities\n- What do get and put do?  put(key, value) stores; get(key, default) returns the value or the default. A read makes the entry the most recent.\n- Does a read extend its life?  No. An answer from the model is as old as its write whether or not someone read it. A write starts the ttl again.\n- When does an entry expire?  Good while now < written + ttl. At exactly ttl it is gone. Say it aloud and test the boundary.\n- What does a miss return?  The default the caller passes, so a stored None is not mistaken for a miss.\n- Where does time come from?  A clock function passed in. A fake clock in the tests, so expiry needs no sleeping.\n- What is evicted when full?  The least recently used. Say that an expired entry nobody has touched can still be sitting in the middle, and that a purge removes those.\n\n2. Error handling\n- Capacity below 1, or ttl at or below 0?  ValueError.\n- The model raises?  The wrapper stores nothing, so the next call tries again.\n- An expired entry read by get?  Removed on the spot, counted as expired and as a miss.\n\n3. Scope boundaries\n- Size?  One per entry in the first version. By cost (tokens) is the live extension.\n- Threads?  Not thread-safe. Say a lock around get and put is the first step, and that two threads asking the same prompt at once is the stampede problem.\n- Persistence, per-entry ttl, async?  Out of scope.",
     "why": "'Read does not extend the ttl' and 'expired at exactly ttl' are the two lines the reviewer will test with a number. 'Default argument' is the small detail that avoids the stored-None bug. 'Fake clock' is what makes every claim checkable.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First the rules that decide behaviour: a read makes an entry recent but does not extend its life, an entry is good while now is below write time plus ttl, and a miss returns a default the caller passes. Then where time comes from: a clock I pass in, so tests use a fake one. Then failures: a bad capacity, a model that raises, and expired entries nobody has touched. Last, size by count now, by cost as the extension."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One each for get and put, capacity and the order of eviction, expiry and its boundary, reads versus writes, the default, the model wrapper, stats, and the check against a plain dict.",
     "solution": "1. put(key, value) stores or replaces; get(key, default) returns the value, or the default on a miss.\n   - A stored None is not a miss\n2. The cache never holds more than capacity entries. A new key over capacity evicts the least recently used.\n   - A get or a put of an existing key makes it the most recent\n3. An entry is good while now < written + ttl.\n   - Test at ttl - 1 (hit) and at ttl (expired)\n   - Reading does not extend it; writing again does\n4. get on an expired entry removes it and counts it as expired and as a miss.\n5. purge() removes all expired entries; len() counts live entries only.\n6. cached_call(cache, model, prompt) calls the model once for repeated prompts and does not cache a call that raised.\n7. stats count hits, misses, expired and evicted.\n8. capacity < 1 or ttl <= 0 raises ValueError.\n9. A plain-dict version with the same rules gives the same answers and the same order on random runs.\n10. The dict and the list never disagree, whatever the sequence of calls.\n11. Out of scope: threads, persistence, per-entry ttl.",
     "why": "3 is the pair of tests a reviewer will ask for. 9 and 10 are the checks without an answer key: a three-line scan against your list, and an invariant that must hold after every call.",
     "say": "From the answers I get eleven requirements and can test each one. **The two that I would not skip are the ttl boundary on a fake clock, one second before and exactly at the ttl, and a random run against a plain dict version, where the answers and the order must match after every call.** The third is the invariant that the dict and the list agree. Out of scope: threads, persistence and a ttl per entry."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here two structures work together, and the class owns the rule that they agree."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Entry: \nKey, value: \nLookup: \nOrder of use: \nSentinels: \nExpiry time: \nClock: \nStats: \nCache: ",
     "hint": "What do you need in O(1)? Find an entry by key, and move or remove an entry given a reference to it. Which structures do each?",
     "solution": "Entry: keep as a small node class with __slots__: key, value, expires, cost, prev, next. The node holds its own place in the list, so removing it needs no search.\nKey, value: key is a hashable; value is anything. Not classes.\nLookup: keep. A dict key -> node: find by key in O(1).\nOrder of use: keep. A doubly linked list, most recent next to the head, least recent next to the tail. Moving a node to the front and removing it are pointer moves, O(1).\nSentinels: keep. A head and a tail node that hold no data, so every real node has a neighbour on both sides and no insert or remove has an 'if empty' case.\nExpiry time: keep, as a field on the node: written time + ttl.\nClock: drop as a class. A function passed in, so a test can pass a fake.\nStats: keep as a small dict of four counters.\nCache: keep. The one class; it owns the rule that the dict and the list always hold the same nodes.",
     "why": "The reviewer's first question is why a list as well as a dict. The answer: the dict finds, the list orders, and only a doubly linked list can move a node it already holds in O(1). The sentinels are the second question.",
     "say": "I underline the nouns. **The idea is two structures that point at the same nodes: a dict to find an entry by key, and a doubly linked list to keep the order of use.** The list lets me move a node to the front or remove it without searching, because the node knows its neighbours. Sentinels at both ends mean no insert or remove ever has to ask if the list is empty. The clock is a function I pass in, so the tests can control time."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "get:\n  1.\n  Edge cases:\n\nput:\n  1.\n\npurge / len:\n  1.\n\nlist helpers:\n  1.\n\ncached_call:\n  1.\n",
     "hint": "get: look up, check expiry, move to the front. put: replace in place or insert at the front, then evict the tail if over capacity. The helpers are pointer moves in a fixed order.",
     "solution": "get(key, default):\n  1. Look up the node by key; none: count a miss, return the default\n  2. If now >= expires: remove the node, count expired and a miss, return the default\n  3. Otherwise unlink the node and push it to the front; count a hit; return the value\n  Edge cases: the boundary now == expires is expired; a stored None comes back as None, not as the default\n\nput(key, value):\n  1. expires = now + ttl\n  2. If the key exists: set value and expires, move the node to the front, return (no growth, no eviction)\n  3. Else make a node, add it to the dict and push it to the front\n  4. If the dict is now over capacity: remove the node next to the tail; count it as expired if its time is up, else evicted\n  Edge case: a replace of a full cache evicts nothing\n\npurge():\n  1. For every node whose time is up, remove it and count expired\n  Edge case: expired entries can sit anywhere in the list, so it must look at all of them\n\nlen: purge, then the size of the dict.\n\n_unlink(node): prev.next = next; next.prev = prev. _push_front(node): node goes between head and head.next, four pointer assignments. _remove: unlink, then delete from the dict.\n\ncached_call(cache, model, prompt):\n  1. Ask the cache with a private sentinel as the default\n  2. If it is not the sentinel: return it\n  3. Call the model (if it raises, nothing is stored); put the answer; return it",
     "why": "The order of the four pointer assignments in _push_front is the place bugs hide, so say them in order. The private sentinel in cached_call is what lets a stored None be a real answer.",
     "say": "**Before any code I write the steps.** Get looks up the node, checks the time, and moves it to the front. Put either replaces in place, with a fresh expiry, or inserts at the front and then evicts the node next to the tail if the dict is over capacity. The pointer helpers are each a few assignments in a fixed order. The wrapper asks the cache with a private default, calls the model on a miss, and stores nothing if the model raises."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-e1",
     "q": "Code, top-down. The node and the TTLCache class: __init__, get, put, purge, __len__, keys. Name the list helpers you have not written yet.",
     "starter": "class _Node:\n    ...\n\nclass TTLCache:\n    def __init__(self, capacity, ttl, clock):\n        ...\n\n    def get(self, key, default=None):\n        ...\n\n    def put(self, key, value):\n        ...\n",
     "hint": "Sentinels first: head.next = tail, tail.prev = head. get and put call _unlink, _push_front and _remove.",
     "solution": "class _Node:\n    \"\"\"One cached entry, and its place in the list of entries from most to least recently used.\"\"\"\n    __slots__ = (\"key\", \"value\", \"expires\", \"cost\", \"prev\", \"next\")\n\n    def __init__(self, key=None, value=None, expires=0):\n        self.key, self.value, self.expires, self.cost = key, value, expires, 1\n        self.prev = self.next = None\n\n\nclass TTLCache:\n    \"\"\"At most `capacity` entries; the least recently used goes first. An entry is good for `ttl` seconds\n    after it was written. Reading does not extend that; writing again does. `clock()` gives the time.\"\"\"\n\n    def __init__(self, capacity, ttl, clock):\n        if capacity < 1 or ttl <= 0:\n            raise ValueError(\"capacity must be at least 1 and ttl above 0\")\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.nodes = {}                                    # key -> its node: the lookup\n        self.head, self.tail = _Node(), _Node()            # sentinels, so the list is never empty at an end\n        self.head.next, self.tail.prev = self.tail, self.head    # head.next is the most recent entry\n        self.stats = {\"hits\": 0, \"misses\": 0, \"expired\": 0, \"evicted\": 0}\n\n    def get(self, key, default=None):\n        \"\"\"The stored value, or `default` on a miss or an expired entry. A hit makes the entry most recent.\"\"\"\n        node = self.nodes.get(key)\n        if node is None:\n            self.stats[\"misses\"] += 1\n            return default\n        if self.clock() >= node.expires:                   # good while now < expires\n            self._remove(node)\n            self.stats[\"expired\"] += 1\n            self.stats[\"misses\"] += 1\n            return default\n        self._unlink(node)\n        self._push_front(node)                             # most recently used\n        self.stats[\"hits\"] += 1\n        return node.value\n\n    def put(self, key, value):\n        \"\"\"Store or replace. The entry is most recent and its ttl starts now. Over capacity, the oldest goes.\"\"\"\n        expires = self.clock() + self.ttl\n        node = self.nodes.get(key)\n        if node is not None:                               # replace in place: no growth, nothing evicted\n            node.value, node.expires = value, expires\n            self._unlink(node)\n            self._push_front(node)\n            return\n        node = _Node(key, value, expires)\n        self.nodes[key] = node\n        self._push_front(node)\n        if len(self.nodes) > self.capacity:\n            oldest = self.tail.prev                        # the least recently used\n            self._remove(oldest)\n            self.stats[\"expired\" if self.clock() >= oldest.expires else \"evicted\"] += 1\n\n    def purge(self):\n        \"\"\"Drop every expired entry, wherever it sits. O(n): expiry order is not use order.\"\"\"\n        now = self.clock()\n        for node in [n for n in self.nodes.values() if now >= n.expires]:\n            self._remove(node)\n            self.stats[\"expired\"] += 1\n\n    def __len__(self):\n        \"\"\"The number of live entries. Purges first, so it is O(n).\"\"\"\n        self.purge()\n        return len(self.nodes)\n\n    def keys(self):\n        \"\"\"Stored keys, most recent first. Expired entries nobody has touched are still stored.\"\"\"\n        out, node = [], self.head.next\n        while node is not self.tail:\n            out.append(node.key)\n            node = node.next\n        return out\n",
     "why": "The public methods are short because the list moves are helpers. Each reads as a sentence: unlink, push to the front, remove the oldest.",
     "say": "I write the node and the class, and call helpers I have not written yet: unlink, push front and remove. **get checks the boundary with greater-or-equal, so an entry is expired exactly at its ttl.** put replaces in place, with a new expiry, or inserts at the front and drops the oldest if the dict is over capacity. Purge looks at every node, because an expired entry can sit anywhere in the list."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-e2",
     "q": "The list helpers (_unlink, _push_front, _remove), cached_call and a FakeClock. Then the plain-dict SlowCache with a scan, for checking.",
     "starter": "    def _unlink(self, node):\n        ...\n\n    def _push_front(self, node):\n        ...\n\n    def _remove(self, node):\n        ...\n\ndef cached_call(cache, model, prompt):\n    ...\n",
     "hint": "_unlink: node.prev.next and node.next.prev. _push_front: set the node's two pointers, then the neighbours'. SlowCache keeps a use counter and evicts min().",
     "solution": "\n\n    # The list. Each of these is a few pointer moves; none loops.\n    def _unlink(self, node):\n        node.prev.next, node.next.prev = node.next, node.prev\n\n    def _push_front(self, node):\n        node.prev, node.next = self.head, self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n\n    def _remove(self, node):\n        self._unlink(node)\n        del self.nodes[node.key]\n\n\ndef cached_call(cache, model, prompt):\n    \"\"\"The stored answer for this prompt, or call the model and store its answer.\n    A call that raises stores nothing, so the next try calls the model again.\"\"\"\n    miss = object()                                        # not None: None could be a real stored answer\n    got = cache.get(prompt, miss)\n    if got is not miss:\n        return got\n    answer = model(prompt)\n    cache.put(prompt, answer)\n    return answer\n\n\nclass FakeClock:\n    \"\"\"Time that moves only when the test says so. No sleeping, so the tests are fast and repeatable.\"\"\"\n\n    def __init__(self):\n        self.now = 0\n\n    def __call__(self):\n        return self.now\n\n    def advance(self, seconds):\n        self.now += seconds\n\n\nclass SlowCache:\n    \"\"\"First version: a plain dict with a use counter. Same rules, but eviction scans every entry: O(n) per put.\"\"\"\n\n    def __init__(self, capacity, ttl, clock):\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.data, self.uses = {}, 0                       # key -> [value, expires, order of last use]\n\n    def get(self, key, default=None):\n        entry = self.data.get(key)\n        if entry is None:\n            return default\n        if self.clock() >= entry[1]:\n            del self.data[key]\n            return default\n        self.uses += 1\n        entry[2] = self.uses\n        return entry[0]\n\n    def put(self, key, value):\n        self.uses += 1\n        self.data[key] = [value, self.clock() + self.ttl, self.uses]\n        if len(self.data) > self.capacity:\n            del self.data[min(self.data, key=lambda k: self.data[k][2])]\n\n    def keys(self):\n        return sorted(self.data, key=lambda k: -self.data[k][2])\n",
     "why": "With sentinels the helpers have no if. The slow version is a dict and a counter, so it is short enough to trust, and it must agree with the fast one after every call.",
     "say": "Unlink is two assignments. Push front is four, in a fixed order: the node's two pointers, then its neighbours'. With sentinels there is no empty case. **The plain version keeps a use counter and evicts the smallest, so it is obviously right and slow, and the fast one must match it after every call on random runs.** The wrapper uses a private object as the default, so a cached None is not mistaken for a miss."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** get and put are O(1): a dict lookup and a few pointer moves. _unlink, _push_front and _remove are O(1). purge and __len__ are O(n) because expiry order is not use order. keys is O(n). Space is O(capacity). SlowCache.put is O(n) because of the scan for the oldest."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: >= in get, the sentinels, the order of the pointer moves, replace-in-place, the private default, purge being O(n).",
     "solution": "1. Why now >= expires?  An entry is good for ttl seconds from its write. At exactly ttl it is gone. With > it would live one tick longer than promised.\n2. Why sentinels?  Every real node has a neighbour on both sides, so unlink and push have no 'is it first or last' case. Fewer branches, fewer bugs.\n3. Why does put replace in place?  A new node for an existing key would leave the old one in the list with the same key. In place keeps one node per key.\n4. Why does replacing in a full cache evict nothing?  The count did not grow.\n5. Why does a read not extend the ttl?  The answer is as old as its write whether or not someone read it. Extending on read would keep a stale answer alive forever if it is popular.\n6. Why a private object as the default in cached_call?  The model may return None. With None as the default I could not tell a cached None from a miss.\n7. Why is the model call outside any try?  If it raises, nothing is stored and the error reaches the caller. Catching it would hide failures.\n8. Why is purge O(n)?  Expiry order is write order, use order is read order, and they differ. An expired entry can be anywhere.\n9. What would you do to make purge cheap?  A min-heap of (expires, key) with lazy deletion, like a leaderboard: stale heap entries are skipped when they reach the top.\n10. What did you not test?  A million entries for memory and speed, and many threads.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about threads, stampedes and eviction policy.",
     "say": "**In the review I answer from the lines on the screen.** Greater-or-equal means an entry is gone exactly at its ttl. The sentinels remove every empty-list case. put replaces in place so there is one node per key. A read does not extend the ttl, because otherwise a popular stale answer would never die. The private default in the wrapper lets a cached None be a real answer. What I did not test is many threads."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-ttlcache-ext",
     "q": "Live extension. The reviewer says: 'Answers differ a lot in size. Make the capacity a budget of tokens instead of a number of entries, so a big answer pushes out several small ones.' Write how your design takes it, then the code.",
     "starter": "class CostCache(TTLCache):\n    ...\n",
     "hint": "The node already has a cost field. Keep a running total. After inserting, evict from the tail while the total is over the budget. A replaced entry gives its cost back first.",
     "solution": "Why the design takes it: eviction is already 'remove the node next to the tail', and the node already carries a cost field (set to 1 in the first version). The new rule is a loop instead of an if: while the total is over the budget, evict from the tail. A running total is kept up to date in the one function that removes nodes.\n\nTwo details to say aloud. An entry bigger than the whole budget is refused, otherwise the loop would evict everything and then the entry itself. A replaced entry gives its old cost back before the new one is added.\n\nThe subclass overrides put and _remove only. get, purge, keys and the list are unchanged. The books-balance invariant, used equals the sum of stored costs, is checked after every call on 300 random runs.\n\nThe code is in the block under the workbench. It prints the three entries of cost 4 under a budget of 10, then a read and an entry of cost 5, then a refused entry of cost 50.",
     "why": "This is the 'does your design bend' question again. Because removal goes through one function and the node has a field for it, a different capacity rule is a subclass of twenty lines.",
     "say": "**Eviction is already remove the node next to the tail, and the node already has a cost field, so a budget is a running total and a loop instead of an if.** I keep the total up to date in the one function that removes nodes. An entry bigger than the whole budget is refused, or the loop would evict everything and then the new entry too. A replaced entry gives its old cost back first. I check that the total always equals the sum of the stored costs."
    },
    {
     "t": "problem",
     "id": "onsite-ttlcache-p",
     "title": "LRU cache with expiry",
     "source": "Mercor-style cache prompt, rebuilt (left vague on purpose)",
     "minutes": 60,
     "why": "A dict and a doubly linked list written by hand, with time. The round grades correctness under constraints, so the tests run on a fake clock.",
     "statement": "\"We call a language model with the same prompts again and again. Build a cache for the answers by hand. get(key) returns a stored answer, put(key, value) stores one. It holds at most N entries and drops the least recently used first. Entries should expire after a while. Show that it is correct.\"",
     "examples": [
      {
       "input": "capacity 2, ttl 10. put a, put b, get a, put c",
       "output": "b is evicted; keys most recent first: c, a",
       "note": "The read of a made it recent, so b was the least recent."
      },
      {
       "input": "written at t=0, read at t=9 and at t=10",
       "output": "hit at 9, expired at 10",
       "note": "Good while now is below write time plus ttl."
      },
      {
       "input": "put a at t=10, put a again at t=18, read at t=26 and t=28",
       "output": "hit at 26, expired at 28",
       "note": "The second write started the ttl again. Reads did not."
      },
      {
       "input": "a model that raises on the prompt 'boom', called twice",
       "output": "the model is called twice",
       "note": "A failed call is not cached."
      }
     ],
     "constraints": [
      "standard library only",
      "write the list by hand; no OrderedDict or lru_cache",
      "O(1) get and put",
      "no AI; search for syntax only"
     ],
     "starter": "class TTLCache:\n    def __init__(self, capacity, ttl, clock):\n        ...\n\n    def get(self, key, default=None):\n        ...\n\n    def put(self, key, value):\n        ...",
     "hints": [
      "Level 1: write the slow version first: a dict of key to [value, expires, last use number]. Evict by scanning for the smallest last use.",
      "Level 2: for O(1), keep a doubly linked list of nodes, most recent at the front, and a dict from key to node. A node knows its neighbours, so it can be moved without a search.",
      "Level 3: put two sentinel nodes at the ends so no insert or remove has an empty case. Compare time with >=, so an entry is gone exactly at its ttl. Pass the clock in, and test with a fake one."
     ],
     "solution": "\n\nclass _Node:\n    \"\"\"One cached entry, and its place in the list of entries from most to least recently used.\"\"\"\n    __slots__ = (\"key\", \"value\", \"expires\", \"cost\", \"prev\", \"next\")\n\n    def __init__(self, key=None, value=None, expires=0):\n        self.key, self.value, self.expires, self.cost = key, value, expires, 1\n        self.prev = self.next = None\n\n\nclass TTLCache:\n    \"\"\"At most `capacity` entries; the least recently used goes first. An entry is good for `ttl` seconds\n    after it was written. Reading does not extend that; writing again does. `clock()` gives the time.\"\"\"\n\n    def __init__(self, capacity, ttl, clock):\n        if capacity < 1 or ttl <= 0:\n            raise ValueError(\"capacity must be at least 1 and ttl above 0\")\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.nodes = {}                                    # key -> its node: the lookup\n        self.head, self.tail = _Node(), _Node()            # sentinels, so the list is never empty at an end\n        self.head.next, self.tail.prev = self.tail, self.head    # head.next is the most recent entry\n        self.stats = {\"hits\": 0, \"misses\": 0, \"expired\": 0, \"evicted\": 0}\n\n    def get(self, key, default=None):\n        \"\"\"The stored value, or `default` on a miss or an expired entry. A hit makes the entry most recent.\"\"\"\n        node = self.nodes.get(key)\n        if node is None:\n            self.stats[\"misses\"] += 1\n            return default\n        if self.clock() >= node.expires:                   # good while now < expires\n            self._remove(node)\n            self.stats[\"expired\"] += 1\n            self.stats[\"misses\"] += 1\n            return default\n        self._unlink(node)\n        self._push_front(node)                             # most recently used\n        self.stats[\"hits\"] += 1\n        return node.value\n\n    def put(self, key, value):\n        \"\"\"Store or replace. The entry is most recent and its ttl starts now. Over capacity, the oldest goes.\"\"\"\n        expires = self.clock() + self.ttl\n        node = self.nodes.get(key)\n        if node is not None:                               # replace in place: no growth, nothing evicted\n            node.value, node.expires = value, expires\n            self._unlink(node)\n            self._push_front(node)\n            return\n        node = _Node(key, value, expires)\n        self.nodes[key] = node\n        self._push_front(node)\n        if len(self.nodes) > self.capacity:\n            oldest = self.tail.prev                        # the least recently used\n            self._remove(oldest)\n            self.stats[\"expired\" if self.clock() >= oldest.expires else \"evicted\"] += 1\n\n    def purge(self):\n        \"\"\"Drop every expired entry, wherever it sits. O(n): expiry order is not use order.\"\"\"\n        now = self.clock()\n        for node in [n for n in self.nodes.values() if now >= n.expires]:\n            self._remove(node)\n            self.stats[\"expired\"] += 1\n\n    def __len__(self):\n        \"\"\"The number of live entries. Purges first, so it is O(n).\"\"\"\n        self.purge()\n        return len(self.nodes)\n\n    def keys(self):\n        \"\"\"Stored keys, most recent first. Expired entries nobody has touched are still stored.\"\"\"\n        out, node = [], self.head.next\n        while node is not self.tail:\n            out.append(node.key)\n            node = node.next\n        return out\n\n\n\n    # The list. Each of these is a few pointer moves; none loops.\n    def _unlink(self, node):\n        node.prev.next, node.next.prev = node.next, node.prev\n\n    def _push_front(self, node):\n        node.prev, node.next = self.head, self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n\n    def _remove(self, node):\n        self._unlink(node)\n        del self.nodes[node.key]\n\n\ndef cached_call(cache, model, prompt):\n    \"\"\"The stored answer for this prompt, or call the model and store its answer.\n    A call that raises stores nothing, so the next try calls the model again.\"\"\"\n    miss = object()                                        # not None: None could be a real stored answer\n    got = cache.get(prompt, miss)\n    if got is not miss:\n        return got\n    answer = model(prompt)\n    cache.put(prompt, answer)\n    return answer\n\n\nclass FakeClock:\n    \"\"\"Time that moves only when the test says so. No sleeping, so the tests are fast and repeatable.\"\"\"\n\n    def __init__(self):\n        self.now = 0\n\n    def __call__(self):\n        return self.now\n\n    def advance(self, seconds):\n        self.now += seconds\n\n\nclass SlowCache:\n    \"\"\"First version: a plain dict with a use counter. Same rules, but eviction scans every entry: O(n) per put.\"\"\"\n\n    def __init__(self, capacity, ttl, clock):\n        self.capacity, self.ttl, self.clock = capacity, ttl, clock\n        self.data, self.uses = {}, 0                       # key -> [value, expires, order of last use]\n\n    def get(self, key, default=None):\n        entry = self.data.get(key)\n        if entry is None:\n            return default\n        if self.clock() >= entry[1]:\n            del self.data[key]\n            return default\n        self.uses += 1\n        entry[2] = self.uses\n        return entry[0]\n\n    def put(self, key, value):\n        self.uses += 1\n        self.data[key] = [value, self.clock() + self.ttl, self.uses]\n        if len(self.data) > self.capacity:\n            del self.data[min(self.data, key=lambda k: self.data[k][2])]\n\n    def keys(self):\n        return sorted(self.data, key=lambda k: -self.data[k][2])\n",
     "complexity": "get and put are O(1). purge and len are O(n). Space is O(capacity). The plain-dict version is O(n) per put.",
     "explain": [
      "The dict finds an entry by key; the list keeps the order of use. Each node is in both.",
      "head and tail are sentinels, so unlink and push-front never ask whether the list is empty.",
      "get removes an expired entry and counts it; a hit moves the node to the front but does not touch its expiry.",
      "put replaces in place with a new expiry, or inserts at the front and evicts the node next to the tail when over capacity.",
      "purge looks at every node because expiry order is write order, not use order.",
      "cached_call uses a private default so a cached None is not a miss, and stores nothing if the model raises.",
      "SlowCache has the same rules with a use counter and a scan, and is used only to check the list version.",
      "What the checks print: after c: ['c', 'a'] | b: None | t=10 a: None c: None | stats: {'hits': 2, 'misses': 6, 'expired': 2, 'evicted': 1} | len (live): 1 | stored keys: ['d'] | model calls for two identical prompts: ['hi'] | error: capacity must be at least 1 and ttl above 0 | error: capacity must be at least 1 and ttl above 0"
     ],
     "tests": "clock = FakeClock()\nc = TTLCache(capacity=2, ttl=10, clock=clock)\nc.put(\"a\", 1); c.put(\"b\", 2)\nassert c.get(\"a\") == 1                                     # a is now the most recent\nc.put(\"c\", 3)                                              # over capacity: b is the least recent, so b goes\nprint(\"after c:\", c.keys(), \"| b:\", c.get(\"b\"))\nassert c.keys() == [\"c\", \"a\"] and c.get(\"b\") is None\nclock.advance(9)\nassert c.get(\"a\") == 1                                     # 9 seconds old: still good\nclock.advance(1)                                           # now t = 10: written at 0, so expired exactly now\nprint(\"t=10 a:\", c.get(\"a\"), \"c:\", c.get(\"c\"))\nassert c.get(\"a\") is None and c.get(\"c\") is None\nprint(\"stats:\", c.stats)\nc.put(\"a\", 1)                                              # t = 10, good until 20\nclock.advance(8); c.put(\"a\", 2)                            # t = 18: a write refreshes the ttl, to 28\nclock.advance(8)                                           # t = 26\nassert c.get(\"a\") == 2                                     # reading did not matter; the write did\nclock.advance(2)\nassert c.get(\"a\") is None                                  # t = 28: expired\nassert c.get(\"zzz\", \"none-found\") == \"none-found\"\nc.put(\"n\", None)\nassert c.get(\"n\", \"miss\") is None                          # a stored None is not a miss\n\nc2 = TTLCache(3, 5, clock)\nfor k in \"abc\":\n    c2.put(k, k)\nclock.advance(5)\nc2.put(\"d\", \"d\")                                           # a, b, c are all expired but not noticed yet\nprint(\"len (live):\", len(c2), \"| stored keys:\", c2.keys())\nassert len(c2) == 1 and c2.keys() == [\"d\"]\n\ncalls = []\ndef model(prompt):\n    calls.append(prompt)\n    if prompt == \"boom\":\n        raise RuntimeError(\"model down\")\n    return prompt.upper()\nc3 = TTLCache(10, 60, FakeClock())\nassert cached_call(c3, model, \"hi\") == \"HI\" and cached_call(c3, model, \"hi\") == \"HI\"\nprint(\"model calls for two identical prompts:\", calls)\nassert calls == [\"hi\"]\nfor _ in range(2):\n    try:\n        cached_call(c3, model, \"boom\")\n    except RuntimeError:\n        pass\nassert calls == [\"hi\", \"boom\", \"boom\"]                     # a failure is not cached\nfor bad in ((0, 5), (3, 0)):\n    try:\n        TTLCache(bad[0], bad[1], clock)\n    except ValueError as e:\n        print(\"error:\", e)\n\nimport random\nrng = random.Random(23)\nfor trial in range(500):\n    clk = FakeClock()\n    cap, ttl = rng.randint(1, 4), rng.randint(1, 6)\n    fast, slow = TTLCache(cap, ttl, clk), SlowCache(cap, ttl, clk)\n    for step in range(rng.randint(1, 40)):\n        op = rng.random()\n        k = rng.choice(\"abcde\")\n        if op < 0.4:\n            v = rng.randint(0, 99)\n            fast.put(k, v); slow.put(k, v)\n        elif op < 0.8:\n            assert fast.get(k, \"miss\") == slow.get(k, \"miss\")             # same answers, hit or miss\n        else:\n            clk.advance(rng.randint(1, 4))\n        assert fast.keys() == slow.keys()                                  # same entries in the same order\n        assert len(fast.nodes) <= cap\n        walk = []\n        node = fast.head.next\n        while node is not fast.tail:                                       # the list and the dict agree\n            assert fast.nodes[node.key] is node and node.next.prev is node\n            walk.append(node.key)\n            node = node.next\n        assert len(walk) == len(fast.nodes)\nprint(\"500 random runs on a fake clock: same answers and order as the plain dict, list and dict always agree\")\n",
     "followups": [
      {
       "q": "Two threads ask for the same prompt at once. What happens?",
       "a": "Both miss, both call the model, and the second answer overwrites the first. That is a stampede, and it costs twice. The fix is single-flight: the first caller registers an in-flight marker for the key; the others wait for it instead of calling. The stampede session (wc33) goes through it. A lock around get and put is the first step and is separate."
      },
      {
       "q": "Expired entries waste space. What do you do?",
       "a": "Purge is O(n). A min-heap of (expires, key), with entries skipped when they do not match the node (lazy deletion), gives O(log n) per expiry and lets you drop expired entries before you evict a live one. Say you would measure how many expired entries sit in a real cache before you add it."
      },
      {
       "q": "Why not collections.OrderedDict?",
       "a": "It is the right tool in production: move_to_end and popitem(last=False) are the whole LRU. I wrote the list by hand because the question asks to show the structure. In real code I would use OrderedDict, and I would say so."
      },
      {
       "q": "What is a good cache key for a model call?",
       "a": "Everything that changes the answer: the model name and version, the prompt, the temperature and other settings. Two calls with different settings must not share an entry. A tuple of those, or a hash of them."
      },
      {
       "q": "Is caching model answers even correct?",
       "a": "Only if the answer does not need to be fresh or random. At a temperature above 0 the model gives different answers on purpose, so a cache changes behaviour. For a cache to be safe the caller must accept a repeated answer. Ask who uses it."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the code, on a fake clock so nothing sleeps. The eviction example, the ttl boundary one second before and exactly at, the refresh by a write, a stored None, the failing model, and a random check on 500 runs: the same answers and order as a plain-dict version after every call, and the dict and the list always agree."
      }
     ],
     "d": "medium",
     "lc": "lru-cache",
     "yt": [
      "7ABFKPK2hD4",
      "NeetCode",
      18
     ]
    },
    {
     "t": "code",
     "id": "onsite-ttlcache-ext-code",
     "title": "Live extension: capacity as a budget of tokens (runs together with the solution above)",
     "code": "class CostCache(TTLCache):\n    \"\"\"Capacity is a budget of cost units, say tokens, not a number of entries. Big answers push out more.\"\"\"\n\n    def __init__(self, budget, ttl, clock):\n        super().__init__(10 ** 9, ttl, clock)              # the count limit is out of the way\n        self.budget, self.used = budget, 0\n\n    def put(self, key, value, cost=1):\n        \"\"\"Returns False, and stores nothing, if this entry alone is bigger than the whole budget.\"\"\"\n        if cost > self.budget:\n            return False\n        old = self.nodes.get(key)\n        if old is not None:\n            self._remove(old)                              # a replaced entry gives its cost back first\n        super().put(key, value)\n        self.nodes[key].cost = cost\n        self.used += cost\n        while self.used > self.budget:\n            victim = self.tail.prev                        # least recently used; never the new entry, which fits alone\n            self._remove(victim)\n            self.stats[\"expired\" if self.clock() >= victim.expires else \"evicted\"] += 1\n        return True\n\n    def _remove(self, node):\n        self.used -= node.cost\n        super()._remove(node)\n\n\nclock = FakeClock()\ncc = CostCache(budget=10, ttl=60, clock=clock)\nfor key, cost in ((\"a\", 4), (\"b\", 4), (\"c\", 4)):\n    cc.put(key, key, cost)\nprint(\"a, b, c cost 4 each, budget 10:\", cc.keys(), \"used\", cc.used)\ncc.get(\"b\")\ncc.put(\"d\", \"d\", 5)\nprint(\"get b, then d costs 5:\", cc.keys(), \"used\", cc.used)\nprint(\"a 50-unit answer:\", cc.put(\"big\", \"x\", 50), cc.keys())\nassert cc.keys() == [\"d\", \"b\"] and cc.used == 9\n\nimport random\nrng = random.Random(10)\nfor trial in range(300):\n    clk = FakeClock()\n    cc = CostCache(rng.randint(5, 15), rng.randint(2, 8), clk)\n    for step in range(rng.randint(1, 40)):\n        op = rng.random()\n        k = rng.choice(\"abcdef\")\n        if op < 0.5:\n            cc.put(k, 1, rng.randint(1, 8))\n        elif op < 0.8:\n            cc.get(k)\n        else:\n            clk.advance(rng.randint(1, 4))\n        assert cc.used == sum(n.cost for n in cc.nodes.values()) and cc.used <= cc.budget   # the books always balance\nprint(\"300 random runs: used always equals the sum of stored costs and never passes the budget\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Design HashMap",
       "d": "easy",
       "lc": "design-hashmap",
       "yt": [
        "cNWsgbKwwoU",
        "NeetCodeIO",
        15
       ],
       "why": "A dict written by hand: buckets and a hash. The lookup half of the cache."
      },
      {
       "n": "Time Based Key-Value Store",
       "d": "medium",
       "lc": "time-based-key-value-store",
       "yt": [
        "fu2cD_6E8Hw",
        "NeetCode",
        18
       ],
       "why": "Values with timestamps, read by time. The expiry question from the other side."
      },
      {
       "n": "LRU Cache",
       "d": "medium",
       "lc": "lru-cache",
       "yt": [
        "7ABFKPK2hD4",
        "NeetCode",
        18
       ],
       "why": "This problem without the ttl. Dict plus doubly linked list, with sentinels."
      },
      {
       "n": "LFU Cache",
       "d": "hard",
       "lc": "lfu-cache",
       "yt": [
        "bLEIHn-DgoA",
        "NeetCodeIO",
        15
       ],
       "why": "The harder follow-up: evict the least frequently used, ties by recency. Another policy, same nodes and lists."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-leaderboard",
   "title": "11. Leaderboard with top-k and updates",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Scores change all the time and someone keeps asking who is on top. The first answer is to sort on every question; the real one is a heap that is allowed to hold old entries. The bug people write is the old entry that looks right again after a score goes 5, 7, 5, so the version stamp is the part to get right. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"Contractors earn rating points on tasks. Keep a leaderboard. Record points as they are earned, and sometimes taken away. Answer 'who are the top k' quickly, many times.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "Are points added to a score, or does each update set it? Can a score go down, or below zero?",
      "What is a tie: who comes first? Is it the same every run?",
      "What does top(k) return: names, or names and scores? What if k is bigger than the number of players, zero or negative?",
      "Can a player be removed? What happens if they come back?",
      "Is it read-heavy or write-heavy? How many players, updates and questions?",
      "Does anybody ask 'what is my rank'? Are scores whole numbers in a known range?",
      "One thread, or many?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: add or set, ties, what top returns, removal, rank. Errors: k at the edges, an unknown name, a name that comes back. Scope: size, which side is hot, a rank query.",
     "solution": "1. Primary capabilities\n- Add or set?  Likely: add(name, points); negative points take them away; a new name starts at 0.\n- Ties?  The name decides, ascending, so the answer is the same every run.\n- What does top(k) return?  A list of (name, score), best first.\n- k larger than the player count?  Everyone. k of 0 or below: an empty list.\n- Can a player be removed?  Yes. remove(name) returns whether they were there.\n- A rank query?  Not in the first version. rank(name) is the live extension, and it needs scores to be whole numbers in a known range.\n- Which side is hot?  Assume many updates and many questions. That rules out sorting on every question.\n\n2. Error handling\n- An unknown name in remove?  Return False, no exception.\n- An unknown name in score?  None.\n- A player removed and added again?  They start from 0, not from their old score.\n\n3. Scope boundaries\n- How big?  Say 1,000,000 players, 10 million updates, 100,000 questions with k up to 100.\n- Threads, persistence, time windows?  Out of scope.",
     "why": "'Starts from 0 when re-added' and 'ties by name' are the two details a reviewer tests. 'Which side is hot' is what decides between a heap and a sorted structure.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First, does an update add or replace, how ties are broken, and what top returns for a k at the edges. Then removal: a player who comes back starts from zero. Then what is hot. If updates and questions are both frequent, sorting on every question is out. Last, rank: I say that needs a different structure and I will show it as the extension."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One each for add, ties, top, removal, rank later, determinism, stale entries, the check against sorting, size.",
     "solution": "1. add(name, points) adds to the score, creates the player at 0, and returns the new score.\n2. top(k) returns the k best as (name, score), best first, ties by name.\n   - k larger than the number of players returns everyone; k <= 0 returns []\n   - Calling top does not change the board\n3. remove(name) takes the player off and returns True, or False if they were not there. A player who comes back starts at 0.\n4. Nobody appears twice in top, whatever sequence of changes led there.\n   - Test: a score that goes 5, 7, 5\n5. top equals sorting all players, on random sequences of adds and removes.\n6. Old heap entries do not pile up: the heap stays within a constant factor of the number of players.\n7. Two runs on the same input give the same answer.\n8. 1,000,000 players and 10 million updates run in seconds; top(100) is fast.\n9. Out of scope: threads, persistence, time windows (rank is the live extension).",
     "why": "4 is the requirement most people miss, and it is a one-line test. 5 is the check without an answer key. 6 is the cost of the clever version, written as a requirement so it is not forgotten.",
     "say": "From the answers I get nine requirements and can test each one. **The ones I would not skip are that top never lists a player twice, which I test with a score that goes 5, 7, 5, and that top equals a full sort on random sequences.** The sixth is that stale entries do not pile up. Out of scope: threads and time windows. Rank I will show as the live extension."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here the rule is that a stale heap entry must never be believed."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Player, score: \nLeaderboard: \nHeap entry: \nStale entry: \nVersion stamp: \nTie-break: \nRank: ",
     "hint": "What is the single truth, and what is only an index of it? How does an index entry know it is out of date?",
     "solution": "Player, score: keep as one dict name -> score. This is the truth. Everything else can be wrong; this cannot.\nLeaderboard: keep. The one class; it owns the dict, the heap and the rule that the heap is only an index.\nHeap entry: keep as a tuple (-score, name, stamp). A min-heap pops the smallest, so the negative score puts the best on top; the name breaks ties; the stamp says which change made it.\nStale entry: drop as a thing; it is a state. An entry is stale when its stamp is not the player's latest stamp. Stale entries are not removed when they go stale; they are dropped when they reach the top.\nVersion stamp: keep. A counter that goes up on every change, and a dict name -> latest stamp. Comparing scores instead of stamps is the 5, 7, 5 bug: the old entry for 5 looks valid again.\nTie-break: drop as a thing. The name inside the tuple.\nRank: not stored. Computed by a Fenwick tree in the extension.",
     "why": "The stamp is the answer to the most likely trap. A reviewer who sees you compare scores will ask what happens when a score returns to an old value. The stamp makes the question disappear.",
     "say": "I underline the nouns. **The truth is one dict of scores. The heap is only an index, and an index entry is believed only if its stamp is the player's latest stamp.** I do not compare scores, because a score that goes 5, 7, 5 would make the old entry look right again and the player would appear twice. Stale entries are not hunted down. They are thrown away when they reach the top, and the heap is rebuilt when they outnumber the live ones."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "add:\n  1.\n\nremove:\n  1.\n\ntop:\n  1.\n  Edge cases:\n\n_tidy:\n  1.\n",
     "hint": "Every change gets a new stamp and a new heap entry. top pops until it has k live entries, drops stale ones, and pushes the live ones back.",
     "solution": "add(name, points):\n  1. stamp += 1\n  2. scores[name] = old score (0 if new) + points\n  3. version[name] = stamp\n  4. Push (-score, name, stamp) on the heap; the old entry stays and is now stale\n  5. _tidy; return the score\n  Edge case: points of 0 still makes a new stamp, which is harmless\n\nremove(name):\n  1. Unknown name: return False\n  2. Delete the score and the version; its entries are stale because no stamp matches\n  3. _tidy; return True\n  Edge case: adding the name again gets a new, larger stamp, so old entries never revive\n\ntop(k):\n  1. Pop entries off the heap until k live ones are found or the heap is empty\n  2. A popped entry is live if version[name] equals its stamp; otherwise drop it for good\n  3. Push the live ones back\n  4. Return (name, -negative score) for the live ones, in the order popped\n  Edge cases: k <= 0 pops nothing; a heap with fewer live entries than k returns what there is; the heap is the same set of live entries after the call\n\n_tidy():\n  1. If the heap has more than twice the players plus 16 entries, rebuild it from the dict and heapify",
     "why": "Step 3 of top is the part people forget, and the test 'calling top twice gives the same answer' catches it. The rebuild in _tidy is what keeps memory bounded when the same few players are updated millions of times.",
     "say": "**Before any code I write the steps.** Every change gets a new stamp and a new heap entry, and the old entry stays where it is. Top pops entries until it has k live ones. An entry is live if its stamp is the player's latest stamp, and a stale one is dropped for good. Then the live ones go back, so asking does not change the board. When stale entries outnumber live ones, I rebuild the heap from the dict."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-e1",
     "q": "Code, top-down. The Leaderboard class: __init__, add, remove, score and top, naming _tidy as a helper.",
     "starter": "class Leaderboard:\n    def __init__(self):\n        ...\n\n    def add(self, name, points):\n        ...\n\n    def top(self, k):\n        ...\n",
     "hint": "Four fields: scores, stamp, version, heap. add: bump the stamp, update the dict, push a tuple. top: pop, keep the live, push back.",
     "solution": "import heapq\n\nclass Leaderboard:\n    \"\"\"Scores by name, best first. The dict is the truth. The heap is an index that may hold old entries.\"\"\"\n\n    def __init__(self):\n        self.scores = {}              # name -> current score\n        self.stamp = 0                # goes up on every change: tells a live heap entry from an old one\n        self.version = {}             # name -> the stamp of its latest change\n        self.heap = []                # (-score, name, stamp): best score on top, ties by name\n\n    def add(self, name, points):\n        \"\"\"Add points (negative takes them away). A new name starts at 0. Returns the new score.\"\"\"\n        self.stamp += 1\n        self.scores[name] = self.scores.get(name, 0) + points\n        self.version[name] = self.stamp\n        heapq.heappush(self.heap, (-self.scores[name], name, self.stamp))   # the old entry is now stale: leave it\n        self._tidy()\n        return self.scores[name]\n\n    def remove(self, name):\n        \"\"\"Take a player off the board. Returns False if they were not on it.\"\"\"\n        if name not in self.scores:\n            return False\n        del self.scores[name]\n        del self.version[name]                             # every heap entry of theirs is now stale\n        self._tidy()\n        return True\n\n    def score(self, name):\n        return self.scores.get(name)                       # None for a name nobody has added\n\n    def top(self, k):\n        \"\"\"The k best as (name, score), best first, ties by name. Fewer if there are fewer players.\"\"\"\n        live = []\n        while self.heap and len(live) < k:\n            entry = heapq.heappop(self.heap)\n            if self.version.get(entry[1]) != entry[2]:\n                continue                                   # stale: a later change or a removal replaced it, drop it for good\n            live.append(entry)\n        for entry in live:\n            heapq.heappush(self.heap, entry)               # the live ones go back: the board is unchanged\n        return [(name, -neg) for neg, name, _ in live]\n",
     "why": "add is five lines and does not touch the heap's old entries. top is where the stamp check lives, in one if.",
     "say": "I write the class and name the helper. **add never searches for the old heap entry: it bumps the stamp, updates the dict and pushes a new tuple, so it is O(log n).** top pops until it has k live entries, drops the stale ones, and pushes the live ones back, so asking a question does not change the board. The stamp is a counter for the whole board, not per player, so a removed player who comes back cannot revive an old entry."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-e2",
     "q": "The helper _tidy (rebuild when stale entries pile up), then the slow version that sorts everything.",
     "starter": "    def _tidy(self):\n        ...\n\ndef top_slow(board, k):\n    ...\n",
     "hint": "Rebuild when len(heap) > 2 * players + 16: a list comprehension over the dict, then heapify. The slow version is sorted with the key (-score, name).",
     "solution": "\n\n    def _tidy(self):\n        \"\"\"Stale entries pile up with every change. When they outnumber the live ones, rebuild the heap from the dict.\"\"\"\n        if len(self.heap) > 2 * len(self.scores) + 16:\n            self.heap = [(-s, n, self.version[n]) for n, s in self.scores.items()]\n            heapq.heapify(self.heap)\n\n\ndef top_slow(board, k):\n    \"\"\"First version: sort every player on every question. O(n log n) per call. The same order, so same answers.\"\"\"\n    ranked = sorted(board.scores.items(), key=lambda kv: (-kv[1], kv[0]))\n    return ranked[:max(k, 0)]\n",
     "why": "_tidy is four lines and is the difference between a heap that works for a minute and one that works for a month. The slow version is two lines and uses the same order, so the two must agree.",
     "say": "_tidy is the answer to 'what stops the heap growing for ever': when stale entries outnumber live ones, I rebuild the heap from the dict in O(n). **The slow version sorts everything with the same key, so it must give the same answer, and I compare the two on random sequences.** The sixteen is there so a tiny board does not rebuild on every change."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** add and remove are O(log n) amortised (a push; _tidy's O(n) rebuild happens only after about n changes). top(k) is O(k log n) plus the stale entries it drops, each dropped once. score is O(1). Space is O(players), because _tidy keeps the heap within about twice the number of players. top_slow is O(n log n) per call."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the stamp, pushing back after top, the 2n+16, the tuple order, what remove leaves behind, why not compare scores.",
     "solution": "1. Why a stamp and not 'does the score match'?  If a score goes 5, 7, 5 the first heap entry matches again, and the player would be listed twice. The stamp only matches the latest change.\n2. Why is the stamp global and not per player?  A removed player who is added again must not revive an old entry. A per-player counter would restart at 1 and match.\n3. Why push the live entries back after top?  top must not change the board. They were popped to look at them.\n4. Why is the old entry not deleted when a score changes?  A heap cannot delete from the middle cheaply. Dropping at the top costs the same overall and is far simpler.\n5. Why 2 * players + 16?  When stale entries are as many as live ones, popping costs double. The 16 stops a tiny board from rebuilding on every change.\n6. Why negative scores in the tuple?  heapq is a min-heap. The negative puts the best on top.\n7. Why is the name in the tuple?  It breaks ties by name. It is also the key to look the player up in the version dict.\n8. What does remove leave behind?  Stale heap entries. Their stamp matches nothing, so top drops them.\n9. What if k is bigger than the number of players?  top returns everyone: the loop ends when the heap is empty.\n10. What did you not test?  A million players for speed, and many threads.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about rank, a sorted structure, sliding windows and scale.",
     "say": "**In the review I answer from the lines on the screen.** The stamp is global so a removed player who returns cannot revive an old entry. I do not delete old entries, because a heap cannot; I drop them when they reach the top. Top pushes the live entries back so asking does not change the board. The 2n+16 rebuild keeps the heap from growing for ever. What I did not test is a million players for speed."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-leaderboard-ext",
     "q": "Live extension. The reviewer says: 'Now also give me a player's rank. Scores are whole numbers from 0 to 100.' Write how your design takes it, then the code.",
     "starter": "class Fenwick:\n    ...\n\nclass RankedBoard(Leaderboard):\n    def rank(self, name):\n        ...\n",
     "hint": "A heap cannot answer 'how many are above me'. Keep a count of players per score in a structure that gives prefix sums fast: a Fenwick tree. Rank is 1 + the number with a higher score.",
     "solution": "Why the design takes it, and where it does not: the dict of scores is the truth, so a second index can be kept beside the heap and updated in the same two places, add and remove. The heap is the wrong tool for rank: it knows who is best, not how many are above someone.\n\nThe tool is a count of players per score, with prefix sums. A Fenwick tree gives both in O(log M) for scores up to M: add(score, +1 or -1) on a change, and upto(s) for the number at or below s. The number above is the total minus that, and the rank is one more. Players with the same score share a rank.\n\nTwo honest limits to say. It needs whole-number scores in a known range; with arbitrary scores you would use a balanced tree or a skip list, or compress scores to ranks offline. And a sorted list with binary search gives the same answer with O(n) inserts, which is fine for a few thousand players.\n\nThe code is in the block under the workbench. It prints the ranks for a board with a tie, one update, a refused out-of-range add, and checks rank against the definition counted the long way on 300 random boards.",
     "why": "This is the 'build the sorted structure by hand' question. The Fenwick tree is about fifteen lines and is the answer to rank, count smaller, and order statistics in general.",
     "say": "**A heap knows who is best but not how many are above someone, so rank needs a second index.** The dict of scores is the truth, so I keep a count of players per score in a Fenwick tree, updated in the same two places as the heap, add and remove. The number above a player is the total minus the number at or below, and rank is one more. It needs whole scores in a known range. For anything else I would use a balanced tree, and I say so."
    },
    {
     "t": "problem",
     "id": "onsite-leaderboard-p",
     "title": "Leaderboard with top-k and updates",
     "source": "Mercor-style leaderboard prompt, rebuilt (left vague on purpose)",
     "minutes": 45,
     "why": "Updates and top-k together. The round grades whether you know why sorting on every question is out, and whether you see the stale-entry trap.",
     "statement": "\"Contractors earn rating points on tasks. Keep a leaderboard. Record points as they are earned, and sometimes taken away. Answer 'who are the top k' quickly, many times.\"",
     "examples": [
      {
       "input": "ana +10, bo +7, cy +7, ana +5, bo +3, dee +12; top(3)",
       "output": "ana 15, dee 12, bo 10",
       "note": "cy has 7. Scores add up."
      },
      {
       "input": "then cy +3; top(4)",
       "output": "ana 15, dee 12, bo 10, cy 10",
       "note": "Tie at 10: the name decides."
      },
      {
       "input": "x +5, x +2, x -2; top(5)",
       "output": "x 5, once",
       "note": "The old entry for 5 looks valid again unless you compare stamps."
      },
      {
       "input": "top(0), top on an empty board",
       "output": "[] and []",
       "note": "Say it aloud."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 1,000,000 players and 10 million updates",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "class Leaderboard:\n    def __init__(self):\n        ...\n\n    def add(self, name, points):\n        ...\n\n    def top(self, k):\n        ...",
     "hints": [
      "Level 1: a dict of scores, and top(k) as sorted(...)[:k]. Get that running on the example first.",
      "Level 2: to avoid sorting on every question, keep a heap of (-score, name). When a score changes, push a new entry and leave the old one.",
      "Level 3: an old entry is believed only if it is the player's latest. Do not compare scores (5, 7, 5 breaks it); keep a counter that goes up on every change and store it in the entry. Rebuild the heap when stale entries outnumber live ones."
     ],
     "solution": "import heapq\n\nclass Leaderboard:\n    \"\"\"Scores by name, best first. The dict is the truth. The heap is an index that may hold old entries.\"\"\"\n\n    def __init__(self):\n        self.scores = {}              # name -> current score\n        self.stamp = 0                # goes up on every change: tells a live heap entry from an old one\n        self.version = {}             # name -> the stamp of its latest change\n        self.heap = []                # (-score, name, stamp): best score on top, ties by name\n\n    def add(self, name, points):\n        \"\"\"Add points (negative takes them away). A new name starts at 0. Returns the new score.\"\"\"\n        self.stamp += 1\n        self.scores[name] = self.scores.get(name, 0) + points\n        self.version[name] = self.stamp\n        heapq.heappush(self.heap, (-self.scores[name], name, self.stamp))   # the old entry is now stale: leave it\n        self._tidy()\n        return self.scores[name]\n\n    def remove(self, name):\n        \"\"\"Take a player off the board. Returns False if they were not on it.\"\"\"\n        if name not in self.scores:\n            return False\n        del self.scores[name]\n        del self.version[name]                             # every heap entry of theirs is now stale\n        self._tidy()\n        return True\n\n    def score(self, name):\n        return self.scores.get(name)                       # None for a name nobody has added\n\n    def top(self, k):\n        \"\"\"The k best as (name, score), best first, ties by name. Fewer if there are fewer players.\"\"\"\n        live = []\n        while self.heap and len(live) < k:\n            entry = heapq.heappop(self.heap)\n            if self.version.get(entry[1]) != entry[2]:\n                continue                                   # stale: a later change or a removal replaced it, drop it for good\n            live.append(entry)\n        for entry in live:\n            heapq.heappush(self.heap, entry)               # the live ones go back: the board is unchanged\n        return [(name, -neg) for neg, name, _ in live]\n\n\n\n    def _tidy(self):\n        \"\"\"Stale entries pile up with every change. When they outnumber the live ones, rebuild the heap from the dict.\"\"\"\n        if len(self.heap) > 2 * len(self.scores) + 16:\n            self.heap = [(-s, n, self.version[n]) for n, s in self.scores.items()]\n            heapq.heapify(self.heap)\n\n\ndef top_slow(board, k):\n    \"\"\"First version: sort every player on every question. O(n log n) per call. The same order, so same answers.\"\"\"\n    ranked = sorted(board.scores.items(), key=lambda kv: (-kv[1], kv[0]))\n    return ranked[:max(k, 0)]\n",
     "complexity": "add and remove O(log n) amortised; top(k) O(k log n) plus the stale entries dropped; space O(players). Sorting every question is O(n log n).",
     "explain": [
      "scores is the truth; the heap is an index that may hold old entries.",
      "Every change takes a new stamp and pushes (-score, name, stamp). The old entry becomes stale.",
      "top pops entries, drops stale ones (stamp is not the player's latest), keeps k live ones and pushes them back.",
      "Because the stamp is global and never reused, a removed player who returns cannot revive an old entry.",
      "_tidy rebuilds the heap from the dict when it holds more than twice the players plus 16.",
      "top_slow sorts everything with the same key and exists to check top.",
      "What the checks print: top 3: [('ana', 15), ('dee', 12), ('bo', 10)] | top 4: [('ana', 15), ('dee', 12), ('bo', 10), ('cy', 10)] | after removing dee, top 2: [('ana', 15), ('bo', 10)] | removing a stranger: False | x went 5, 7, 5 -> top: [('x', 5)] | 400 random boards: top equals the full sort, nobody twice, the heap never runs away"
     ],
     "tests": "lb = Leaderboard()\nfor name, pts in ((\"ana\", 10), (\"bo\", 7), (\"cy\", 7), (\"ana\", 5), (\"bo\", 3), (\"dee\", 12)):\n    lb.add(name, pts)\nprint(\"top 3:\", lb.top(3))\nassert lb.top(3) == [(\"ana\", 15), (\"dee\", 12), (\"bo\", 10)] and lb.top(0) == [] and lb.top(-1) == []\nlb.add(\"cy\", 3)                                            # cy and bo tie at 10: the name decides\nprint(\"top 4:\", lb.top(4))\nassert lb.top(4) == [(\"ana\", 15), (\"dee\", 12), (\"bo\", 10), (\"cy\", 10)]\nassert lb.top(99) == top_slow(lb, 99) and len(lb.top(99)) == 4\nlb.remove(\"dee\")\nprint(\"after removing dee, top 2:\", lb.top(2), \"| removing a stranger:\", lb.remove(\"zed\"))\nassert lb.top(2) == [(\"ana\", 15), (\"bo\", 10)] and lb.score(\"dee\") is None\nlb.add(\"dee\", 5)                                           # back at 5, not at the old 12\nassert lb.score(\"dee\") == 5 and lb.top(10)[-1] == (\"dee\", 5)\nlb2 = Leaderboard()                                        # 5 -> 7 -> 5: the old entry for 5 looks right again\nlb2.add(\"x\", 5); lb2.add(\"x\", 2); lb2.add(\"x\", -2)\nprint(\"x went 5, 7, 5 -> top:\", lb2.top(5))\nassert lb2.top(5) == [(\"x\", 5)]                            # once, not twice\nassert Leaderboard().top(3) == []\n\nimport random\nrng = random.Random(31)\nfor trial in range(400):\n    b = Leaderboard()\n    for step in range(rng.randint(1, 80)):\n        name = rng.choice(\"abcdef\")\n        if rng.random() < 0.15:\n            b.remove(name)\n        else:\n            b.add(name, rng.randint(-3, 5))\n        k = rng.randint(0, 8)\n        got = b.top(k)\n        assert got == top_slow(b, k)                                       # heap equals sorting everything\n        assert len({n for n, _ in got}) == len(got)                        # nobody twice\n        assert len(b.heap) <= 2 * len(b.scores) + 17                       # stale entries stay under control\nprint(\"400 random boards: top equals the full sort, nobody twice, the heap never runs away\")\n",
     "followups": [
      {
       "q": "Why not keep a sorted list and insert with bisect?",
       "a": "It works and is simple. Each update is O(n) because a list insert moves the tail. For a few thousand players that is fine and clearer. For a million players and many updates, a heap or a balanced tree is needed. State the numbers and choose."
      },
      {
       "q": "How do you get a player's rank?",
       "a": "A heap cannot. Keep a count of players per score in a Fenwick tree, updated in add and remove. Rank is one plus the number of players above. It needs whole scores in a known range. The code is in the live extension block."
      },
      {
       "q": "Scores are floats or unbounded. What then?",
       "a": "A balanced tree or a skip list with subtree counts, or compress the scores to ranks offline when the board is rebuilt. Python has no balanced tree in the standard library, which is why I would say so and describe the sorted-container approach."
      },
      {
       "q": "What if only the last hour of updates counts?",
       "a": "Each update gets a time. Keep the updates in a queue, and when an update is older than an hour, apply its negative. That is the same board with a second stream of changes. The Sliding Window Median problem uses the same lazy deletion."
      },
      {
       "q": "Can many threads use it?",
       "a": "A lock around add, remove and top is the first step: top pops and pushes back, so it must not run beside an add. If reads dominate, keep a snapshot of the top 100 that a writer replaces, and let readers use it without a lock."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the class. The example by hand, a tie, a removal and re-add, the 5, 7, 5 case, k at the edges, and a random check on 400 boards: top equals sorting everything, nobody is listed twice, and the heap stays within twice the players plus 16."
      }
     ],
     "d": "medium",
     "lc": "stock-price-fluctuation",
     "yt": [
      "eDRrjGphRgI",
      "Cracking FAANG",
      19
     ]
    },
    {
     "t": "code",
     "id": "onsite-leaderboard-ext-code",
     "title": "Live extension: rank with a Fenwick tree (runs together with the solution above)",
     "code": "class Fenwick:\n    \"\"\"Counts of players per score, with prefix sums in O(log n). A sorted structure, built by hand.\"\"\"\n\n    def __init__(self, n):\n        self.n, self.tree = n, [0] * (n + 1)\n\n    def add(self, i, delta):                               # i is a position 0 .. n-1\n        i += 1\n        while i <= self.n:\n            self.tree[i] += delta\n            i += i & -i                                    # jump to the next node that covers i\n\n    def upto(self, i):\n        \"\"\"How many are at positions 0 .. i.\"\"\"\n        i += 1\n        total = 0\n        while i > 0:\n            total += self.tree[i]\n            i -= i & -i                                    # drop the lowest set bit\n        return total\n\n\nclass RankedBoard(Leaderboard):\n    \"\"\"Scores are whole numbers from 0 to max_score. Adds rank(name): 1 + the number with a higher score.\"\"\"\n\n    def __init__(self, max_score):\n        super().__init__()\n        self.max_score, self.counts = max_score, Fenwick(max_score + 1)\n\n    def add(self, name, points):\n        old = self.scores.get(name)\n        new = (old or 0) + points\n        if not 0 <= new <= self.max_score:\n            raise ValueError(f\"{name} would have {new}; scores run from 0 to {self.max_score}\")\n        super().add(name, points)\n        if old is not None:\n            self.counts.add(old, -1)\n        self.counts.add(new, 1)\n        return new\n\n    def remove(self, name):\n        old = self.scores.get(name)\n        if not super().remove(name):\n            return False\n        self.counts.add(old, -1)\n        return True\n\n    def rank(self, name):\n        \"\"\"1 for the best. Players with the same score share a rank. None for a name not on the board.\"\"\"\n        s = self.scores.get(name)\n        if s is None:\n            return None\n        return 1 + len(self.scores) - self.counts.upto(s)  # everyone minus those at or below s = those above s\n\n\nrb = RankedBoard(max_score=100)\nfor name, pts in ((\"ana\", 90), (\"bo\", 70), (\"cy\", 70), (\"dee\", 40)):\n    rb.add(name, pts)\nprint(\"ranks:\", {n: rb.rank(n) for n in (\"ana\", \"bo\", \"cy\", \"dee\", \"zed\")})\nassert [rb.rank(n) for n in (\"ana\", \"bo\", \"cy\", \"dee\")] == [1, 2, 2, 4]\nrb.add(\"dee\", 40)\nprint(\"dee rises to 80:\", rb.rank(\"dee\"), \"| bo:\", rb.rank(\"bo\"))\ntry:\n    rb.add(\"ana\", 20)\nexcept ValueError as e:\n    print(\"error:\", e)\n\nimport random\nrng = random.Random(14)\nfor trial in range(300):\n    b = RankedBoard(20)\n    for step in range(rng.randint(1, 60)):\n        name = rng.choice(\"abcdefg\")\n        if rng.random() < 0.15:\n            b.remove(name)\n        else:\n            try:\n                b.add(name, rng.randint(-4, 6))\n            except ValueError:\n                pass\n        for n in b.scores:\n            assert b.rank(n) == 1 + sum(1 for s in b.scores.values() if s > b.scores[n])   # the definition, counted the long way\n        assert b.top(3) == top_slow(b, 3)\nprint(\"300 random boards: rank equals the definition counted the long way, and top still equals the full sort\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Kth Largest Element in a Stream",
       "d": "easy",
       "lc": "kth-largest-element-in-a-stream",
       "yt": [
        "hOjcdrqMoQ8",
        "NeetCode",
        12
       ],
       "why": "A heap that keeps the best k as scores arrive. The top-k idea with no updates."
      },
      {
       "n": "Top K Frequent Elements",
       "d": "medium",
       "lc": "top-k-frequent-elements",
       "yt": [
        "YPTqKIgVk-k",
        "NeetCode",
        14
       ],
       "why": "Count, then take the top k. The count is the score, and the heap or a bucket does the rest."
      },
      {
       "n": "Stock Price Fluctuation",
       "d": "medium",
       "lc": "stock-price-fluctuation",
       "yt": [
        "eDRrjGphRgI",
        "Cracking FAANG",
        19
       ],
       "why": "A price at a time can be corrected later. Two heaps with lazy deletion: this is the stale-entry trap, with a dict as the truth."
      },
      {
       "n": "Sliding Window Median",
       "d": "hard",
       "lc": "sliding-window-median",
       "yt": [
        "oKwmSnmEFpY",
        "Cracking FAANG",
        31
       ],
       "why": "The harder follow-up: delete from heaps as the window moves, with lazy deletion and a balance count. The same idea at full strength."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-carpark",
   "title": "12. Car parking, forward only",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** Cars arrive one at a time on a one-way street with numbered spots. Each car tries its preferred spot and, if it is taken, moves only forward. Decide whether every car parks, and where each one ends up.\n\nReported variants: the same street where each car accepts a list of spots; cars that leave. PracHub reconstruction (25 Sep 2026), round not stated, so practise it as a solo hour but do not assume it is."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**The input** is a list of preferences in arrival order. Order decides where a car lands. It does not decide whether everyone parks.",
      "**The hidden structure** is a pointer per spot to the first free spot at or after it. Taking a spot moves its pointer forward by one. That is union-find.",
      "**What is undefined:** the output, a car that runs off the end, a bad preference, more cars than spots, whether cars can leave.",
      "**The size that decides it** is the input. Walking forward costs O(n) per car, so a million cars that all want spot 0 is the trap.",
      "**Write the slow walk first.** It is your spec and your oracle for the fast version."
     ]
    },
    {
     "t": "table",
     "head": [
      "The gap in the prompt",
      "I decide, and write at the top",
      "If the reviewer wanted otherwise"
     ],
     "rows": [
      [
       "What does it return?",
       "The spot each car got, None for a car that did not park. all_park gives the yes or no.",
       "Only a bool: all_park already is that. Only a count: count the non-None."
      ],
      [
       "A car runs off the end",
       "It does not park and gets None. Not an error.",
       "Raise: one line where the sentinel is hit."
      ],
      [
       "A preference outside 0 to n-1",
       "Raise ValueError. It is a caller bug, not a car.",
       "Treat it as None: drop the check."
      ],
      [
       "More cars than spots",
       "Allowed. The extra cars get None.",
       "Reject up front: compare len(prefs) with n."
      ],
      [
       "How big is the input",
       "Up to about a million. The fast version is the answer, the slow walk is the oracle.",
       "A hundred cars: keep only the walk, it is clearer."
      ],
      [
       "Can cars leave",
       "No. Out of scope, and I say so in a comment.",
       "Yes: union-find cannot free a spot, so switch to a sorted set of free spots."
      ],
      [
       "One preferred spot, or a list",
       "One spot. A list is a different problem (a matching).",
       "A list: augmenting paths, in the follow-ups."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Do not walk. Keep nxt[i], the first free spot at or after i, with n meaning off the end. A car jumps to the root of its preference, takes it, and points it at the next spot. Path compression keeps every jump short, so the whole run is close to O(n + m). For the yes or no alone there is a second idea: with n cars and n spots, everyone parks if and only if for every k at least k cars prefer one of the first k spots. Arrival order never changes that answer."
    },
    {
     "t": "list",
     "items": [
      "**The hour, in order.**",
      "Read the prompt twice and every part. Write the decisions above as a comment block at the top, before any code.",
      "Data model: no classes. A list nxt of size n + 1 and a list of results. Say so in the comment.",
      "Write the slow walk, run it on the example, keep it as the oracle.",
      "Write the fast version with first_free and path compression. Check it equals the walk on random inputs.",
      "Add the counting check for the yes or no and compare it with the simulation.",
      "Leave ten minutes: read every line as the reviewer, fix names, write the what-I-would-do-next note."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-carpark-p",
     "title": "Car parking, forward only",
     "source": "PracHub reconstruction, 25 Sep 2026 (round not stated)",
     "minutes": "45",
     "d": "medium",
     "statement": "Cars arrive one at a time on a one-way street with spots 0 to n-1. Each car tries its preferred spot and moves only forward when it is taken. Return the spot each car got (None if it could not park), and decide whether all cars parked.",
     "examples": [
      {
       "input": "n = 5, prefs = [2, 2, 0, 4, 4]",
       "output": "[2, 3, 0, 4, None]",
       "note": "The second car wanted 2 and moved to 3; the last car found 4 taken and fell off the end."
      },
      {
       "input": "n = 3, prefs = [1, 1, 2] and [1, 0, 0]",
       "output": "all_park: False, True",
       "note": "In the first, nobody can take spot 0."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about a million cars",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def park(n, prefs):\n    ...\n",
     "hints": [
      "Level 1: write the walk-forward version first; it is your spec.",
      "Level 2: keep a pointer from each spot to the next free one, with n meaning off the end.",
      "Level 3: follow the pointers and compress the path; taking s sets its pointer to s + 1."
     ],
     "solution": "def park(n, prefs):\n    \"\"\"One-way street, spots 0..n-1. Car i takes the first free spot at or after prefs[i].\n    Returns the spot each car got, None if it ran off the end.\"\"\"\n    nxt = list(range(n + 1))           # nxt[i]: first free spot >= i; n = past the end\n\n    def first_free(i):\n        root = i\n        while nxt[root] != root:       # follow pointers to a free spot\n            root = nxt[root]\n        while nxt[i] != root:          # compress the path for later cars\n            nxt[i], i = root, nxt[i]\n        return root\n\n    got = []\n    for p in prefs:\n        if not 0 <= p < n:\n            raise ValueError(f\"no spot {p}\")\n        s = first_free(p)\n        got.append(s if s < n else None)\n        if s < n:\n            nxt[s] = s + 1             # taken: next free is after it\n    return got\n\n\ndef all_park(n, prefs):\n    return None not in park(n, prefs)\n\n\ndef all_park_counting(n, prefs):\n    \"\"\"n cars, n spots: everyone parks iff for every k, at least k cars prefer the first k spots.\"\"\"\n    count = [0] * n\n    for p in prefs:\n        count[p] += 1\n    seen = 0\n    for k in range(n):\n        seen += count[k]\n        if seen < k + 1:\n            return False\n    return True\n\n\ndef match(ok, n):\n    \"\"\"Follow-up: car i accepts any spot in ok[i]. A car may push the holder of its spot elsewhere.\"\"\"\n    owner = [None] * n\n\n    def try_car(c, seen):\n        for s in ok[c]:\n            if s not in seen:\n                seen.add(s)\n                if owner[s] is None or try_car(owner[s], seen):\n                    owner[s] = c\n                    return True\n        return False\n\n    for c in range(len(ok)):\n        if not try_car(c, set()):\n            return None                # car c cannot be placed\n    got = [None] * len(ok)\n    for s, c in enumerate(owner):\n        if c is not None:\n            got[c] = s\n    return got\n",
     "tests": "import random\nprint(park(5, [2, 2, 0, 4, 4]))\nprint(all_park(3, [1, 1, 2]), all_park(3, [1, 0, 0]))\nfor _ in range(500):\n    n = random.randint(1, 8)\n    prefs = [random.randrange(n) for _ in range(n)]\n    assert all_park(n, prefs) == all_park_counting(n, prefs)\nprint(\"counting agrees with simulation on 500 random cases\")\nprint(match([[0, 1], [0]], 2))\nprint(match([[0, 1], [0, 1], [0, 1]], 2))\n",
     "complexity": "Walk: O(n x m) worst case. park: about O(n + m) with path compression. Counting check: O(n + m). match (a list of spots per car): O(cars x total list length).",
     "explain": [
      "The sentinel spot n means no bounds check.",
      "Path compression keeps every later car's jump short.",
      "match is the follow-up where each car accepts a list: a car may push the holder of its spot to another spot it accepts."
     ]
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "[2, 3, 0, 4, None]\nFalse True\ncounting agrees with simulation on 500 random cases\n[1, 0]\nNone"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "Cars can leave",
       "Keep free spots in a sorted set (balanced tree or segment tree). Arrival takes the first free at or after p, departure inserts.",
       "O(log n) per event. Union-find cannot un-take a spot."
      ],
      [
       "Each car accepts a list of spots",
       "Bipartite matching: try a spot, if held ask its holder to move, with a seen set. Greedy fails: cars [0, 1] and [0] give [0, None] but [1, 0] works.",
       "O(cars x total list length). Backtracking is exponential on a no."
      ],
      [
       "The list is a run of spots",
       "Greedy is right again: sweep spots left to right, give each to the waiting car whose run ends soonest (a heap).",
       "O((cars + spots) log cars)"
      ],
      [
       "Why a no, not only a no",
       "The car that failed plus the holders of every spot its search visited accept fewer spots than they have cars.",
       "Same search, a little bookkeeping"
      ],
      [
       "The street is a circle",
       "nxt of n - 1 points to 0. Stop when you come back to the start.",
       "One line, one more stop condition"
      ],
      [
       "A million cars",
       "Already the design: park is near linear, and first_free is iterative so there is no recursion limit.",
       "O(n) memory"
      ]
     ]
    },
    {
     "t": "faq",
     "title": "The code review: every decision, and how to stand behind it",
     "prose": true,
     "items": [
      {
       "q": "1. A next-free pointer per spot, not the walk",
       "a": "**Decided.** A pointer per spot, compressed as I follow it. The slow walk stayed as my test oracle.\n\n**Instead of.** Walking forward spot by spot.\n\n**Why.** The walk is O(n) per car, so a million cars that all want spot 0 is about a trillion steps. The pointers make each car close to constant.\n\n**What it costs.** More code, and it only moves forward: a spot can never be freed.\n\n**If they push.** \"For a hundred cars I would ship the walk. It is shorter and obviously right. The fast one is for the stated size.\""
      },
      {
       "q": "2. None for a car that runs off the end",
       "a": "**Decided.** None in its slot. all_park is None not in the result.\n\n**Instead of.** Raising, or a special spot number.\n\n**Why.** Running out of street is a normal outcome, not a bug. A list with None keeps the position of every car.\n\n**What it costs.** The caller must check for None.\n\n**If they push.** \"If you want an error, it is one line at the sentinel.\""
      },
      {
       "q": "3. ValueError for a preference outside 0 to n-1",
       "a": "**Decided.** Raise.\n\n**Instead of.** Clamping it, or skipping the car.\n\n**Why.** Clamping hides a caller bug and changes who parks.\n\n**What it costs.** One bad row stops the batch.\n\n**If they push.** \"If bad rows are expected I would return them in a second list, and say how many I dropped.\""
      },
      {
       "q": "4. No classes",
       "a": "**Decided.** Two lists and functions.\n\n**Instead of.** A Street class with park and leave.\n\n**Why.** The state is one list. A class would be a wrapper with no behaviour of its own.\n\n**What it costs.** No encapsulation if this grows.\n\n**If they push.** \"The moment cars can leave I would make it a class, because there is state to protect.\""
      },
      {
       "q": "5. A second method for the yes or no",
       "a": "**Decided.** The counting check, tested against the simulation on random inputs.\n\n**Instead of.** One method and trusting it.\n\n**Why.** Two independent methods that agree on 500 random cases is cheap evidence the pointers are right.\n\n**What it costs.** Extra code the answer does not need.\n\n**If they push.** \"In real code I would keep it as a test only.\""
      },
      {
       "q": "6. Path compression written with loops, not recursion",
       "a": "**Decided.** Two while loops.\n\n**Instead of.** A recursive find.\n\n**Why.** A chain of a million spots would hit Python's recursion limit.\n\n**What it costs.** A little harder to read.\n\n**If they push.** \"I put a one-line comment on each loop for that reason.\""
      },
      {
       "q": "7. The list-of-spots follow-up is a different algorithm",
       "a": "**Decided.** If asked, say greedy fails, then move to matching with a seen set.\n\n**Instead of.** Greedy 'first free spot it accepts', or backtracking.\n\n**Why.** Cars [0, 1] and [0] break greedy. Backtracking is exponential on a no: it took 986,409 tries on 10 cars sharing 9 spots. Matching does not search like that.\n\n**What it costs.** Matching is O(cars x total list length), slower than the one-spot case.\n\n**If they push.** \"A run of spots has a greedy that is right, with a heap. I would ask which shape the lists have.\""
      },
      {
       "q": "What I would do with another hour",
       "a": "Tests for an invalid preference, an empty street and n = 0. Cars leaving, with a sorted set. A short comment on why arrival order never changes the yes or no. And one line in the header for every decision above."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-gridk",
   "title": "13. Shortest grid path, removing at most k walls",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** A grid of 0s (open) and 1s (walls). Walk from the top-left to the bottom-right, one step up, down, left or right at a time. You may remove at most k walls. Return the fewest steps, or -1 if it cannot be done. Only the title was reported (a GitHub bank, 30 Aug 2026), with no spec, role or stage: this wording is LeetCode 1293's, not Mercor's, so treat the shape as the practice and the details as yours to decide."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**The hidden structure** is BFS, but a cell alone is not a state: reaching a cell with 2 removals left is better than with 0. The state is (row, col, removals left).",
      "**What is undefined:** the grid format, whether the start or end can be a wall, what an impossible case returns, a 1 x 1 grid.",
      "**The size that decides it** is rows x cols x (k + 1) states. With k up to rows + cols the plain state BFS is fine for 40 x 40, and two shortcuts make it fast.",
      "**Write the full-state BFS first.** It is short, obviously right, and it is the oracle for the pruned version."
     ]
    },
    {
     "t": "table",
     "head": [
      "The gap in the prompt",
      "I decide, and write at the top",
      "If the reviewer wanted otherwise"
     ],
     "rows": [
      [
       "The grid format",
       "A list of lists of 0 and 1.",
       "Strings like '0101': read each row with [int(ch) for ch in row]."
      ],
      [
       "The start or end is a wall",
       "Treated like any cell: entering a wall costs a removal. The start is where you stand, so it costs nothing.",
       "Charge the start too: begin with k - grid[0][0], and return -1 if that is negative."
      ],
      [
       "Impossible",
       "Return -1.",
       "Raise: one line at the end."
      ],
      [
       "A 1 x 1 grid",
       "0 steps.",
       "Same."
      ],
      [
       "Diagonal moves",
       "No, four directions.",
       "Add the four diagonal offsets; the BFS is unchanged."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** BFS over (row, col, removals left), so the first time you reach the end is the fewest steps. Two shortcuts. First, if k is at least rows + cols - 2, you can remove every wall on a straight path, so the answer is rows + cols - 2 without searching. Second, keep best[r][c], the most removals left you have reached that cell with. BFS reaches cells in order of steps, so a later arrival with no more removals left is never better: skip it. That turns rows x cols x k states into close to rows x cols in practice."
    },
    {
     "t": "list",
     "items": [
      "**The hour, in order.**",
      "Write the decisions above as a comment block at the top.",
      "Write slow(grid, k): BFS with a seen set of (r, c, left). Run it on the example.",
      "Write shortest_path with the straight-line shortcut and the best[r][c] pruning. Assert it equals slow on random grids.",
      "Leave ten minutes: read every line as the reviewer, name the state out loud, write the what-I-would-do-next note."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-gridk-p",
     "title": "Shortest grid path, removing at most k walls",
     "source": "Title only in a GitHub bank, 30 Aug 2026; wording from LeetCode 1293",
     "minutes": "40",
     "d": "hard",
     "statement": "Given a grid of 0s and 1s and an integer k, return the fewest steps from the top-left to the bottom-right cell, moving up, down, left or right, if you may remove at most k walls (1s). Return -1 if it cannot be done.",
     "examples": [
      {
       "input": "grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1",
       "output": "6",
       "note": "Remove the wall at (3, 2): 6 steps. With k = 0 the walk round takes 10."
      },
      {
       "input": "grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1",
       "output": "-1",
       "note": "Every path crosses at least two walls."
      }
     ],
     "constraints": [
      "standard library only",
      "grid up to 40 x 40, k up to rows x cols",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def shortest_path(grid, k):\n    ...\n",
     "hints": [
      "A cell is not enough as a BFS state: add the removals left.",
      "If k covers a straight path, return rows + cols - 2. Otherwise, skip any arrival with no more removals left than the best seen at that cell."
     ],
     "solution": "from collections import deque\n\n# Decisions, written before the code (no one to ask):\n# - grid is a list of lists of 0 (open) and 1 (wall); move up, down, left, right.\n# - Return the fewest steps from top-left to bottom-right, removing at most k walls; -1 if impossible.\n# - A 1 x 1 grid is 0 steps. The start and end cells are treated like any other cell.\n\n\ndef shortest_path(grid, k):\n    rows, cols = len(grid), len(grid[0])\n    if rows == 1 and cols == 1:\n        return 0\n    # Enough removals to walk straight there: the shortest possible path is the answer.\n    if k >= rows + cols - 2:\n        return rows + cols - 2\n    # BFS over states (row, col, removals left). best[r][c] is the most removals left\n    # with which we have reached (r, c). BFS reaches cells in order of steps, so arriving\n    # later with no more removals left can never do better: skip it.\n    best = [[-1] * cols for _ in range(rows)]\n    best[0][0] = k\n    queue = deque([(0, 0, k, 0)])\n    while queue:\n        r, c, left, steps = queue.popleft()\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if not (0 <= nr < rows and 0 <= nc < cols):\n                continue\n            nleft = left - grid[nr][nc]          # a wall costs one removal\n            if nleft < 0 or nleft <= best[nr][nc]:\n                continue\n            if nr == rows - 1 and nc == cols - 1:\n                return steps + 1\n            best[nr][nc] = nleft\n            queue.append((nr, nc, nleft, steps + 1))\n    return -1\n\n\ndef slow(grid, k):\n    \"\"\"The oracle: BFS over every (row, col, left) state, no pruning.\"\"\"\n    rows, cols = len(grid), len(grid[0])\n    seen = {(0, 0, k)}\n    queue = deque([(0, 0, k, 0)])\n    while queue:\n        r, c, left, steps = queue.popleft()\n        if (r, c) == (rows - 1, cols - 1):\n            return steps\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols:\n                nleft = left - grid[nr][nc]\n                if nleft >= 0 and (nr, nc, nleft) not in seen:\n                    seen.add((nr, nc, nleft))\n                    queue.append((nr, nc, nleft, steps + 1))\n    return -1\n",
     "tests": "import random\n\ng1 = [[0, 0, 0], [1, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 0]]\ng2 = [[0, 1, 1], [1, 1, 1], [1, 0, 0]]\nprint(shortest_path(g1, 1), shortest_path(g1, 0), shortest_path(g2, 1), shortest_path(g2, 2))\nassert shortest_path(g1, 1) == 6 and shortest_path(g2, 1) == -1 and shortest_path([[0]], 0) == 0\nrng = random.Random(7)\nfor _ in range(400):\n    r, c = rng.randint(1, 6), rng.randint(1, 6)\n    g = [[1 if rng.random() < 0.4 else 0 for _ in range(c)] for _ in range(r)]\n    g[0][0] = 0\n    k = rng.randint(0, 4)\n    assert shortest_path(g, k) == slow(g, k), (g, k)\nprint(\"fast agrees with the oracle on 400 random grids\")\n",
     "complexity": "O(rows x cols x (k + 1)) states in the worst case; the pruning keeps it near O(rows x cols) in practice. Space the same.",
     "explain": [
      "The straight-line shortcut is exact: a path of rows + cols - 2 steps crosses at most that many walls.",
      "best[r][c] stores removals left, and a bigger number is better, so it starts at -1.",
      "The oracle has no pruning and checks every state; the random test compares the two on 400 grids."
     ]
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "6 10 -1 4\nfast agrees with the oracle on 400 random grids"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "Return the path, not the length",
       "Store the parent state for each state you push; walk back from the end.",
       "A dict of parents, O(states)."
      ],
      [
       "Walls cost different amounts",
       "The cost is no longer one per step: Dijkstra on (cost, r, c, left) with a heap.",
       "O(states log states)."
      ],
      [
       "Many queries on the same grid",
       "Precompute nothing general; cache answers per (k) if k repeats. Say the honest limit.",
       "Memory per cached k."
      ],
      [
       "Minimise walls removed instead of steps",
       "0-1 BFS: open cells cost 0, walls cost 1, a deque with appendleft for 0.",
       "O(rows x cols)."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "The code review: every decision, and how to stand behind it",
     "prose": true,
     "items": [
      {
       "q": "1. The state is (row, col, removals left)",
       "a": "**Decided.** BFS over three-part states.\n\n**Instead of.** BFS over cells with a visited set.\n\n**Why.** Two arrivals at the same cell can differ in what they can still do. A plain visited set would throw away the one with more removals left and miss the shortest path.\n\n**What it costs.** Up to k + 1 times the states.\n\n**If they push.** \"A cell-only visited set is wrong here: I can show a grid where it returns -1 and the answer exists.\""
      },
      {
       "q": "2. best[r][c] instead of a seen set of triples",
       "a": "**Decided.** Keep the most removals left per cell and skip anything not better.\n\n**Instead of.** seen = set of (r, c, left), which the oracle uses.\n\n**Why.** BFS reaches cells in order of steps, so a later arrival with fewer or equal removals left is dominated. That cuts the states sharply.\n\n**What it costs.** An argument the reviewer has to follow; the oracle and the random test are my evidence.\n\n**If they push.** \"Both are correct; the triple set is simpler to read, and I would ship it for small grids.\""
      },
      {
       "q": "3. The straight-line shortcut",
       "a": "**Decided.** If k >= rows + cols - 2, return rows + cols - 2 at once.\n\n**Why.** No path is shorter than that, and that path crosses at most that many walls. It turns the worst case (huge k) into constant time.\n\n**If they push.** \"It is an optimisation, not needed for correctness; the BFS gives the same answer.\""
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Shortest Path in Binary Matrix",
       "d": "medium",
       "lc": "shortest-path-in-binary-matrix",
       "yt": [
        "YnxUdAO7TAo",
        "NeetCodeIO",
        13
       ],
       "why": "Grid BFS with a visited set: the base for this one."
      },
      {
       "n": "Shortest Path in a Grid with Obstacles Elimination",
       "d": "hard",
       "lc": "shortest-path-in-a-grid-with-obstacles-elimination",
       "yt": [
        "ID9YJXy3OJk",
        "Algorithms Made Easy",
        17
       ],
       "why": "This problem exactly."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-review",
   "title": "13. What the reviewer asks",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** About 30 minutes where a person goes through your code. They ask about lines, not about theory: why this, what happens here, what would break. The answers below are short on purpose. You say them looking at your own code. Open each question, say your answer aloud, then compare. The first five rows are for the referral network, the next five for the scheduler, the rest for both."
    },
    {
     "t": "p",
     "text": "**The other eight builds.** Each build in sections 4 to 11 ends its worked stages with an f) Review box and a Live extension box. They are this same drill: answer the review questions from your own code, then add the extension to your own file in ten minutes."
    },
    {
     "t": "faq",
     "title": "Line by line, across both problems",
     "items": [
      {
       "q": "Referral: why is the check for a second referrer after the check for a duplicate?",
       "a": "The same referrer again is harmless. A different one is a conflict. To tell them apart, the equal case must come first."
      },
      {
       "q": "Referral: why does add return a string and not raise?",
       "a": "A bad row is normal in real data. Raising would stop a batch at the first one. A reason lets the loop carry on and report counts."
      },
      {
       "q": "Referral: what happens if the walk up in the loop check is very long?",
       "a": "It costs the depth for that event. On a chain of 100,000 the stream costs about n squared. Union-find makes it close to constant, and I can show it."
      },
      {
       "q": "Referral: why compute reach on demand instead of storing it?",
       "a": "A stored count is wrong after the next accepted event. Computing it keeps one source of truth. If queries dominate, I update the ancestors on every add."
      },
      {
       "q": "Referral: where does flow stop being correct?",
       "a": "When a user can have two referrers. The product of above and below assumes one chain between two users. Then I would count shortest paths with their multiplicities."
      },
      {
       "q": "Scheduler: what is the first thing that goes wrong if I remove the set in the count?",
       "a": "A task that lists a dependency twice waits for a count that never reaches zero, and is reported as part of a loop. The set makes it count once."
      },
      {
       "q": "Scheduler: why check for a loop before running anything?",
       "a": "Running half of a graph with a loop leaves a state nobody can describe. Failing first leaves the system untouched."
      },
      {
       "q": "Scheduler: why is a skipped task not called?",
       "a": "Its input is not there. Calling it would either fail again or do something on stale data. It is recorded with blocked_by so the report says why."
      },
      {
       "q": "Scheduler: what does a retry do to a task that was half done?",
       "a": "It repeats the half. The task has to be idempotent, or check what is done. This is the first point to raise in a real design."
      },
      {
       "q": "Scheduler: why catch Exception and not everything?",
       "a": "A KeyboardInterrupt or SystemExit must stop the run. They are not task failures."
      },
      {
       "q": "Both: which line are you least sure of?",
       "a": "Say a real one and what you did about it. For example: the loop message when a task is behind a loop, which I checked with a three-task case. Naming a doubt and a check is stronger than saying there is none."
      },
      {
       "q": "Both: what would you do with another hour?",
       "a": "Name two things in order: the speed check on a long chain, then the next feature. For the network, the faster loop check or a second referrer. For the scheduler, waves on a pool or saved state."
      },
      {
       "q": "Both: why did you name that function that way?",
       "a": "Say what it returns or does in plain words: reach returns a count, _closes_loop answers a yes or no, _attempt is one retry loop. If the name is wrong, say so and rename it. That is a good sign, not a bad one."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Three questions you will get in some form.** Write your own answer in each box before you open the model one."
    },
    {
     "t": "write",
     "id": "onsite-review-structure",
     "q": "Write your answer to 'Why this structure?' for the referral network. Then for the scheduler. Two or three sentences each.",
     "starter": "Referral network: \n\nTask scheduler: ",
     "hint": "Name what you look up most often, what it costs, and what you gave up. For each: the lookup, the cost, the alternative.",
     "solution": "Referral network: 'I look up in both directions all the time: who referred this user, and who did they refer. Two dicts make each one a single lookup, and I paid memory for the second. I used one class because it owns the rule that no loop forms, so no caller can break it. The alternative was an edge list, which is smaller but makes every query a scan.'\n\nTask scheduler: 'The thing I need most is, when a task finishes, which tasks were waiting for it. The reverse map answers that directly, so each finish costs the number of waiters, not all tasks. I used functions and one small result class, because the state does not outlive one call. The alternative was a scheduler class, which would have held state I never reuse.'",
     "why": "The pattern is the same twice: name the lookup you do most, name the cost you paid for it, name the alternative you did not take. The reviewer is checking that the structure came from the problem.",
     "say": "**For 'why this structure' I name the lookup I do most, what it costs, and what I did not choose.** In the network it is who referred me and who did I refer, so two dicts, and I paid memory. In the scheduler it is who is waiting for this task, so a reverse map. The alternative was simpler in both, an edge list or a scan, and slower in the same place."
    },
    {
     "t": "write",
     "id": "onsite-review-million",
     "q": "Write your answer to 'What breaks at a million events?' for each problem. Say what breaks first, the fix, and what you would measure.",
     "starter": "Referral network: \n\nTask scheduler: ",
     "hint": "Referral: the loop check on a long chain, then memory. Scheduler: the slow order if you wrote it, recursion if you used it, and the memory of one result per task.",
     "solution": "Referral network: 'First the loop check. It walks up the referrer chain, so on a long chain each event costs the depth and the stream costs about n squared. I would use union-find, which is close to constant per event. Second, memory: two dicts of strings. I would map names to integer ids and read the events from a stream. I would measure the time on a chain of a million before I changed anything.'\n\nTask scheduler: 'The counting order is linear, so a million tasks is fine in time. The slow rescan would not be, which is why I kept it only as a check. Memory is a few dicts and one result per task. The bigger problem is that one process cannot run that many tasks, so I would move to waves on a worker pool and save each status so a crash does not start over.'",
     "why": "The shape: name the first thing to break and why, the fix, and what you measure. 'It depends' with no number is the weak answer. The honest strong answer is the order of magnitude and a plan to measure.",
     "say": "**For 'what breaks at a million events' I name the first thing to break, the fix and what I would measure.** In the network, the loop check walks up the chain, so a long chain is quadratic, and union-find fixes it. Names should become integer ids. In the scheduler, the counting order is linear, so the real limit is running the tasks, which needs waves on a pool and saved statuses. In both, I measure before I change anything."
    },
    {
     "t": "write",
     "id": "onsite-review-test",
     "q": "Write your answer to 'How did you test it?' with no framework and no tests given. Name the checks, one case that would catch a real bug, and what you did not test.",
     "starter": "Checks: \nA bug it would catch: \nNot tested: ",
     "hint": "Plain asserts under the code. One per rule, one hand-worked example, one comparison of two implementations on random input.",
     "solution": "Checks: 'Plain asserts under the code, run after every change. A six-item example I worked out by hand first. One assert for every refusal or error. And a comparison of the fast code with the slow code, or with the definition counted by brute force, on a few hundred random inputs.'\n\nA bug it would catch: 'The check that flow equals its brute-force definition would catch the product formula being wrong, for example if I let a user have two referrers. The check that a refused add changes nothing would catch a half-written edge.'\n\nNot tested: 'Speed on a very long chain, and an odd exception in a task function. I would add both next.'",
     "why": "Reviewers ask this to see if you know what a test is for. The best answer has one example that would have caught a real mistake, and an honest list of what was left out.",
     "say": "**For 'how did you test it' I say plain asserts, a hand-worked example first, one check per rule, and a comparison of the fast version with the slow or brute-force one on random input.** The comparison is the one I trust most, because it catches a mistake in either side. I give one bug it would catch, and I say what I did not test, which is speed on a long chain and an odd exception."
    },
    {
     "t": "say",
     "lines": [
      "I think the review is the same conversation I have been having while I build: why this, what it costs, what I left out.",
      "When I am asked about a line, I read it aloud and say what it does on an empty input and on an unknown name.",
      "When I do not know, I say what I would check and how, and I do it, if there is time."
     ]
    }
   ]
  },
  {
   "id": "rv-cache",
   "title": "Review extension: make this cache thread-safe",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** \"Here is your code. It has a cache or a memoizer around a slow call. Make it thread-safe. Where does the lock go?\" They want the exact race named, not only the word lock.\n\nReported variants: a memoizer decorator; a cache with expiry; the same across several processes."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**The race** is check then act. Two threads see a miss, both compute, both write. A single dict read or write is fine in CPython; the two steps together are not.",
      "**The lock protects the decision, not the call.** A lock held during the slow call blocks every other key.",
      "**What is undefined:** one process or many, how long the compute takes, how often the same key repeats, whether the value can be computed twice.",
      "**The trap** is one global lock around everything. It is correct, and it is also serial.",
      "**The second trap** is the missing second check: after you win the key lock, another thread may already have stored the value."
     ]
    },
    {
     "t": "table",
     "head": [
      "What I must establish",
      "If they say",
      "Then I"
     ],
     "rows": [
      [
       "One process or many",
       "One process, threads",
       "Python locks are enough. Go on."
      ],
      [
       "One process or many",
       "Many processes or machines",
       "A lock in my memory protects nothing. The cache needs a shared store with an atomic add-if-absent (Redis SET NX, or an insert with a unique key in the database)."
      ],
      [
       "Read-heavy or not",
       "Mostly hits, few misses",
       "A hit takes only the short guard and returns. The key lock is only on a miss."
      ],
      [
       "Read-heavy or not",
       "Many misses on different keys",
       "Per-key locks, so different keys compute in parallel. One global lock would serialise them."
      ],
      [
       "Can the value be computed twice",
       "No: it costs money or has side effects",
       "One lock per key and a second check inside it, so the compute runs once."
      ],
      [
       "Can the value be computed twice",
       "Yes: it is cheap and pure",
       "Skip the key locks. Guard only the dict and let the last write win. Say it is a decision."
      ],
      [
       "Does the value expire",
       "Yes",
       "Store an expiry time and check it inside the key lock. Expired means recompute under the same lock."
      ],
      [
       "What if the compute raises",
       "Do not cache the error",
       "Store nothing and release the lock. The next caller retries."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Two locks with two jobs. A short guard protects the dicts and is never held during the slow call. A lock per key makes the slow call run once for that key. Inside the key lock, check again, because another thread may have finished while you waited. Then eight threads asking for one key compute once, and different keys compute in parallel."
    },
    {
     "t": "list",
     "items": [
      "**The conversation, in order.**",
      "Say the race in one sentence: both threads miss, both compute, both write.",
      "Ask the questions above. If there is no answer, say my assumption: threads, one process, the value must be computed once.",
      "Offer the simple fix first: one lock around the whole get. Correct and serial. Say what it costs.",
      "Move to the guard plus a lock per key with the second check. About 15 lines.",
      "Test: eight threads on one key, count the calls. Then four keys, check they overlap in time.",
      "Follow-ups: expiry, errors, many processes, memory growth."
     ]
    },
    {
     "t": "problem",
     "id": "rv-cache-p",
     "title": "Make the memoizer thread-safe",
     "minutes": "20",
     "d": "medium",
     "statement": "A memoizer wraps a slow function. Make it safe to call from many threads so the slow function runs once per key, without blocking other keys.",
     "examples": [
      {
       "input": "8 threads ask for key 1",
       "output": "fn runs once",
       "note": "With no lock it ran 8 times in the test below."
      }
     ],
     "constraints": [
      "standard library only",
      "threading"
     ],
     "starter": "class Memo:\n    def __init__(self, fn):\n        ...\n\n    def get(self, key):\n        ...\n",
     "hints": [
      "Level 1: name the race first.",
      "Level 2: one lock per key, and a short guard for the dicts.",
      "Level 3: check again after you get the key lock."
     ],
     "solution": "import threading\n\n\nclass Memo:\n    \"\"\"Compute fn(key) once per key, even with many threads asking at the same time.\"\"\"\n\n    def __init__(self, fn):\n        self.fn = fn\n        self.vals = {}\n        self.locks = {}\n        self.guard = threading.Lock()       # protects the two dicts only, never held during fn\n\n    def get(self, key):\n        with self.guard:\n            if key in self.vals:\n                return self.vals[key]\n            lock = self.locks.setdefault(key, threading.Lock())\n        with lock:                          # one thread per key computes, the rest wait here\n            with self.guard:\n                if key in self.vals:        # someone finished while we waited\n                    return self.vals[key]\n            v = self.fn(key)                # slow call: other keys are not blocked\n            with self.guard:\n                self.vals[key] = v\n            return v                        # if fn raised, nothing is stored and the next caller retries\n",
     "tests": "import time\n\ncalls = []\n\ndef slow(k):\n    calls.append(k)\n    time.sleep(0.2)\n    return k * 2\n\ndef run(keys):\n    m = Memo(slow)\n    ts = [threading.Thread(target=m.get, args=(k,)) for k in keys]\n    t0 = time.time()\n    [t.start() for t in ts]\n    [t.join() for t in ts]\n    return round(time.time() - t0, 1)\n\nrun([1] * 8)\nprint(\"same key x8: fn ran\", len(calls), \"time\")\ncalls.clear()\nsecs = run([1, 2, 3, 4])\nprint(\"4 different keys: fn ran\", len(calls), \"times in about\", secs, \"s (parallel)\")\n\nplain = {}\ncalls2 = []\ndef racy(k):\n    if k not in plain:\n        calls2.append(k)\n        time.sleep(0.05)\n        plain[k] = k\nts = [threading.Thread(target=racy, args=(1,)) for _ in range(8)]\n[t.start() for t in ts]; [t.join() for t in ts]\nprint(\"no lock, same key x8: fn ran\", len(calls2), \"times\")\n",
     "complexity": "O(1) per hit. A miss waits only for the same key. Memory grows by one lock per key.",
     "explain": [
      "The guard is never held during fn.",
      "The second check is what makes it once-only.",
      "The locks dict grows with the keys: delete the lock after the value is stored if keys are unbounded."
     ]
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "same key x8: fn ran 1 time\n4 different keys: fn ran 4 times in about 0.2 s (parallel)\nno lock, same key x8: fn ran 8 times"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "A future per key instead of a lock",
       "Store a Future in the dict under the guard. The first caller computes, the rest wait on it.",
       "No lock per key, same result. Cancelling and errors need care."
      ],
      [
       "Expiry",
       "Store (value, expires_at). Check inside the key lock. Expired means recompute under the same lock.",
       "A timestamp per key; use a monotonic clock."
      ],
      [
       "Memory grows forever",
       "Bound the size. functools.lru_cache is thread-safe but can still compute a key twice, so wrap it or evict by hand.",
       "An eviction policy to choose"
      ],
      [
       "Many processes",
       "Atomic add-if-absent in Redis or the database. The winner computes, the others wait or poll.",
       "A network call per miss. A winner that dies needs a lock timeout."
      ],
      [
       "The compute raises",
       "Do not store. The next caller retries. Optionally cache the failure briefly.",
       "Risk of a retry storm"
      ],
      [
       "Async code instead of threads",
       "Same shape with an asyncio.Lock per key, or a task per key.",
       "Do not mix thread locks into the event loop."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "Why not one lock around everything?",
       "a": "**Decided.** A guard for the dicts and a lock per key.\n\n**Instead of.** A single global lock.\n\n**Why.** The global lock is correct but serial: a 2-second compute for key A blocks key B.\n\n**What it costs.** More code, and one lock per key in memory.\n\n**If they push.** \"If the cache is hit often and computed rarely, the global lock is fine. I would say that and pick it if they confirm.\""
      },
      {
       "q": "Why check again inside the key lock?",
       "a": "**Decided.** A second check.\n\n**Instead of.** Trusting the first check.\n\n**Why.** Between the first check and getting the key lock, another thread may have stored the value. Without the second check the compute runs twice, a moment later.\n\n**What it costs.** One more dict lookup under the guard.\n\n**If they push.** \"It is the double-checked pattern. Both checks take the guard, so it is safe.\""
      },
      {
       "q": "Is a plain dict safe in CPython?",
       "a": "I think a single get or set is, because of the GIL, and check then act is not, because it is two operations. I do not lean on the GIL for correctness: it is an implementation detail and free-threaded builds remove it."
      },
      {
       "q": "What if there are many worker processes?",
       "a": "Then the lock is wasted, since each process has its own memory. I would move the add-if-absent into Redis (SET with NX and a timeout) or into a unique row in the database, and say what happens if the winner dies: the timeout expires and another worker takes over."
      },
      {
       "q": "What I would do with another hour",
       "a": "Add expiry and a size bound, delete the per-key lock once the value is stored, and write a test with a function that raises once and then works."
      }
     ]
    }
   ]
  },
  {
   "id": "rv-refund",
   "title": "Review extension: the refund or payment can run twice",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** \"Your code issues a refund (or a payment). A client retry, a double click or a crashed worker can make it run twice. Fix it.\" The answer is not a lock. It is making the second call a safe replay.\n\nReported variants: a refund endpoint; a queue consumer that gets the same message twice; a payment retried after a timeout."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**The input** is a request that moves money, sent by a client that cannot tell whether the first try worked.",
      "**The hidden structure** is at-least-once delivery. Retries are normal, so the receiver must make a repeat harmless.",
      "**What is undefined:** who makes the key, how long keys are kept, what a key reused with different data means, whether the gateway also dedupes.",
      "**The trap** is check then insert: read, see nothing, insert. Two callers do it at once. The unique constraint, not the check, is the guard.",
      "**The second trap** is the crash between moving the money and recording it."
     ]
    },
    {
     "t": "table",
     "head": [
      "What I must establish",
      "If they say",
      "Then I"
     ],
     "rows": [
      [
       "Who makes the key",
       "The client, one per logical request",
       "Store it with a unique constraint. A retry carries the same key."
      ],
      [
       "Who makes the key",
       "The server, from the request contents",
       "Hash of order id and amount. Say the risk: two real refunds of the same amount collapse into one."
      ],
      [
       "Same key, different data",
       "It can happen",
       "Reject with an error. Never silently return the first result."
      ],
      [
       "Does the gateway take a key",
       "Yes",
       "Pass mine through. A crash between the call and my record is then safe: the retry reaches the gateway with the same key."
      ],
      [
       "Does the gateway take a key",
       "No",
       "Record intent, call, record the result, and reconcile pending rows by asking the gateway. This is the hard case, and I say so."
      ],
      [
       "A crash left a pending row",
       "Retries must finish it",
       "A retry finds pending, calls the gateway with the same key, marks it done."
      ],
      [
       "Two requests at the same instant",
       "Both arrive together",
       "The unique insert lets one in. The other finds the row and follows the same path."
      ],
      [
       "How long keys live",
       "Days",
       "A TTL or a cleanup job, longer than the longest client retry window."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Write the intent first, then act. A row keyed by an idempotency key with a unique constraint decides who owns the request, in the database, atomically. A repeat finds the row and returns its result, or finishes the work if the first attempt died. Passing the same key to the gateway makes the crash window safe. Exactly once is built from at-least-once plus a safe replay."
    },
    {
     "t": "list",
     "items": [
      "**The conversation, in order.**",
      "Say the failure: the request runs twice and the money moves twice.",
      "Ask who makes the key, what the gateway does, and what happens on a crash. State my assumption if there is no answer.",
      "Reject the obvious fix: check then insert has the same race. Use a unique constraint.",
      "Write the table and the function. States: pending, then done.",
      "Test: call twice, then crash once and retry. Count what the gateway actually did.",
      "Follow-ups: key expiry, queue consumers, reconciliation, a state machine for refund states."
     ]
    },
    {
     "t": "problem",
     "id": "rv-refund-p",
     "title": "Make the refund idempotent",
     "minutes": "20",
     "d": "medium",
     "statement": "refund(db, key, order_id, amount, gateway) moves money through a gateway. It may be called twice with the same key, or die after the money moved. Make the money move once.",
     "examples": [
      {
       "input": "refund with key k1 twice",
       "output": "same ref, one transfer"
      },
      {
       "input": "gateway fails after moving money, then a retry",
       "output": "the retry returns the ref, still one transfer"
      }
     ],
     "constraints": [
      "standard library only",
      "sqlite3 stands in for the real database"
     ],
     "starter": "def refund(db, key, order_id, amount, gateway):\n    ...\n",
     "hints": [
      "Level 1: add a table with the key as the primary key.",
      "Level 2: insert pending before you call the gateway.",
      "Level 3: on a repeat, return the stored result, or finish the pending one with the same key."
     ],
     "solution": "import sqlite3\n\n\ndef setup():\n    db = sqlite3.connect(\":memory:\")\n    db.execute(\"\"\"CREATE TABLE refunds (\n        idem_key TEXT PRIMARY KEY,          -- the unique constraint is the lock\n        order_id TEXT, amount INTEGER, status TEXT, ref TEXT)\"\"\")\n    return db\n\n\ndef refund(db, key, order_id, amount, gateway):\n    \"\"\"Safe to call twice, or after a crash. gateway(key, amount) must also dedupe on key.\"\"\"\n    try:\n        db.execute(\"INSERT INTO refunds VALUES (?, ?, ?, 'pending', NULL)\", (key, order_id, amount))\n        db.commit()                         # the intent is on disk before any money moves\n    except sqlite3.IntegrityError:          # this key was seen before\n        pass\n    oid, amt, status, ref = db.execute(\n        \"SELECT order_id, amount, status, ref FROM refunds WHERE idem_key = ?\", (key,)).fetchone()\n    if (oid, amt) != (order_id, amount):\n        raise ValueError(\"key reused for a different request\")\n    if status == \"done\":\n        return ref                          # replay: return the first result\n    ref = gateway(key, amount)              # pending (first call, or a crash left it): same key, safe\n    db.execute(\"UPDATE refunds SET status = 'done', ref = ? WHERE idem_key = ?\", (ref, key))\n    db.commit()\n    return ref\n",
     "tests": "moved = {}                                  # what the fake gateway actually did, by key\nfail_once = [True]\n\ndef gateway(key, amount):\n    moved.setdefault(key, amount)           # a real gateway ignores a repeated key\n    if fail_once[0] and key == \"k2\":\n        fail_once[0] = False\n        raise TimeoutError(\"died after the money moved\")\n    return \"ref-\" + key\n\ndb = setup()\nprint(refund(db, \"k1\", \"o1\", 500, gateway), refund(db, \"k1\", \"o1\", 500, gateway))\ntry:\n    refund(db, \"k2\", \"o2\", 700, gateway)\nexcept TimeoutError as e:\n    print(\"first try failed:\", e)\nprint(\"retry:\", refund(db, \"k2\", \"o2\", 700, gateway))\nprint(\"money moved once per key:\", moved)\ntry:\n    refund(db, \"k1\", \"o1\", 999, gateway)\nexcept ValueError as e:\n    print(\"rejected:\", e)\n",
     "complexity": "One insert, one read, one update and one gateway call per request.",
     "explain": [
      "The primary key is the lock.",
      "pending is written before money moves, so a crash leaves a trace to finish.",
      "The gateway gets the same key, so its own dedupe covers the window between the call and our record."
     ]
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "ref-k1 ref-k1\nfirst try failed: died after the money moved\nretry: ref-k2\nmoney moved once per key: {'k1': 500, 'k2': 700}\nrejected: key reused for a different request"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "A queue delivers the message twice",
       "Same idea: the message id is the key, and the consumer is the same function.",
       "A processed-messages table"
      ],
      [
       "A state machine for the refund",
       "States pending, done, failed, with allowed moves. An update is guarded by the current state in its WHERE clause.",
       "More states to test"
      ],
      [
       "How long do I keep keys",
       "Longer than the longest retry window, then delete by age.",
       "A cleanup job. A key reused after expiry is a new request."
      ],
      [
       "The gateway does not dedupe",
       "Record intent, call, record result, and reconcile old pending rows against the gateway on a timer.",
       "A reconciliation job and a window of uncertainty"
      ],
      [
       "Retries with backoff",
       "The client retries with the same key and waits longer each time, with jitter.",
       "Latency for the user"
      ],
      [
       "Two requests with the same key at once",
       "The unique insert admits one. The other waits for done or returns pending.",
       "A pending response to handle"
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "Why a unique constraint and not a check in code?",
       "a": "**Decided.** The primary key on the idempotency key.\n\n**Instead of.** SELECT then INSERT.\n\n**Why.** Two callers can both see no row and both insert. The database decides it atomically.\n\n**What it costs.** An IntegrityError path to handle.\n\n**If they push.** \"A lock in code only works inside one process. The constraint works for everything that uses the database.\""
      },
      {
       "q": "Why write pending before calling the gateway?",
       "a": "**Decided.** Record the intent first.\n\n**Instead of.** Call the gateway, then record.\n\n**Why.** If the process dies after the call and before the record, there is no trace and the retry moves the money again.\n\n**What it costs.** A pending row that may need finishing.\n\n**If they push.** \"The retry finishes it with the same key, so the gateway dedupes.\""
      },
      {
       "q": "What if the same key comes with a different amount?",
       "a": "**Decided.** Raise an error.\n\n**Instead of.** Return the first result.\n\n**Why.** It is a client bug. Returning the first result hides it, and the client thinks the new amount went through.\n\n**What it costs.** A rejected request.\n\n**If they push.** \"The last line of the test shows it.\""
      },
      {
       "q": "Is this exactly once?",
       "a": "No. Delivery is at least once. The effect is once, because a repeat is a safe replay. Exactly-once delivery does not exist over a network, and I say that."
      },
      {
       "q": "What I would do with another hour",
       "a": "Add key expiry, a state machine with a failed state and a retry limit, a reconciliation job for pending rows older than a minute, and a test with two threads using the same key at once."
      }
     ]
    }
   ]
  }
 ]
});
