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
   "id": "onsite-referral",
   "title": "2. Referral network",
   "blocks": [
    {
     "t": "p",
     "text": "**Your worked version of a referral-network round is in [Your worked solutions, Q1 Referral network](#/coding/yours-q1).** It has the try-first box, your thinking and what to say, and the full code with its output. This section keeps the three-part event-and-flow version with its answer boxes."
    },
    {
     "t": "p",
     "text": "**What it is.** Three parts that build on each other. Part 1 builds a network from referral events and has to survive messy data. Part 2 answers queries on it. Part 3 adds a 'flow centrality' score, and the prompt does not say what that means. That gap is deliberate: the round is checking whether you ask before you code. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "Solve it in your order. At each stage try the box first, then open the answer and the Say it sheet. Set the switch above to Try first if you want the answers shut."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-referral-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what an event is, how names arrive, which queries, what 'reach' means, what part 3 means. Errors: every kind of bad row, and a query about someone unknown. Scope: one referrer per user or several, how big, a stream or a batch.",
     "solution": "1. Primary capabilities\n- What is an event, and how do they arrive?  Likely: a (referrer, user) pair of strings, in a list, in time order.\n- Do names appear for the first time in events, or is there a user list?  Likely: first time in events. If a list is given, a name outside it is unknown.\n- Which queries in part 2?  Likely: who referred a user, direct referrals, the chain above a user, reach, top k by reach.\n- Does 'reach' mean direct referrals or everyone below?  Everyone below, at any depth. Name both: direct is one level, reach is all levels.\n- What does 'flow centrality' mean?  The prompt leaves it open on purpose. Do not guess: use the three readings below, ask which, and pick one if there is no answer.\n\n2. Error handling\n- Someone refers themselves?  Refuse, reason 'self'.\n- The same event twice?  Ignore the second, reason 'duplicate'. It is harmless, but count it.\n- A second, different referrer for a user?  The first event wins. Refuse, reason 'second_referrer'.\n- An event that closes a loop (a refers b, then b refers a)?  Refuse, reason 'cycle'.\n- An empty name, or a name outside the user list?  Refuse, reasons 'bad_event' and 'unknown_user'.\n- A query about a user nobody has heard of?  Neutral answers: None, an empty list, 0. Ask, because the other choice is to raise.\n- Does a refused event leave anything behind?  No. Nothing is changed.\n\n3. Scope boundaries\n- Can a user have two referrers?  No. One referrer each makes the network a forest, and the part 3 formula depends on that.\n- How big?  Say up to 100,000 users. That rules out recursion, which stops near 1,000 levels.\n- A stream or a batch?  A batch in memory. Say what changes for a stream.\n- Saving to disk, threads, deleting or editing a referral?  Out of scope.",
     "why": "Every question changes a line of code. 'Duplicate' and 'second referrer' are different answers, so they are different reasons. 'One referrer each' decides the data structure and part 3. 'Up to 100,000' decides an iterative walk. The unknown-user answer decides what every query returns.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First, I ask what an event looks like, which queries part 2 wants, and whether reach means direct or everyone below. Then the bad rows: self-referral, a repeat, a second referrer, a loop, an empty or unknown name. I would like each refusal to have a reason, so I can report them. Last, I check that each user has one referrer and about how many users, because that decides the structure. And I ask what 'flow centrality' means, because I would rather ask than guess."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-referral-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One for add and its six outcomes, one for build and the report, one each for the queries, one for the fast reach, one for top k, one for flow, one for size.",
     "solution": "1. add(referrer, user) returns \"ok\" or the reason it refused.\n   - Reasons: bad_event, unknown_user, self, duplicate, second_referrer, cycle\n   - A refused add changes nothing (test: queries before and after are equal)\n2. build(events) feeds the events in order and returns the network and the refused events grouped by reason.\n   - The first event wins when two disagree (test: a>b then c>b leaves b's referrer as a)\n3. who_referred(u), direct(u) and upline(u) read the network.\n   - Unknown user: None, [], []\n4. reach(u) is the number of users below u at any depth, not counting u.\n   - Test: a leaf is 0, the example root is 6\n5. all_reach() gives every user's reach in one pass and equals reach(u) for each u.\n6. top_k(k) lists the k largest reaches, ties broken by name, and k larger than the user count returns everyone.\n7. flow() gives the chosen centrality for every user, and equals its definition counted by brute force on small networks.\n8. A chain of 100,000 users does not hit the recursion limit.\n9. Out of scope: two referrers per user, deleting a referral, saving, threads.",
     "why": "Each line becomes a test. 1 and 2 are the messy data, 5 and 7 compare two implementations, 8 is the iterative walk. Requirement 7 is how you check part 3 without an answer key.",
     "say": "From the answers I get nine requirements, and I can test each one. **The two that I would not skip are 5 and 7: the fast reach has to equal the slow reach, and the flow score has to equal its own definition counted the long way.** That is how I check part 3 when nobody gives me an answer key. The rest are the refusals, the queries and the size. Out of scope: two referrers per user, deleting, saving and threads."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Everything else is a key, a dict or a list."
    },
    {
     "t": "write",
     "id": "onsite-referral-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Event: \nUser: \nReferrer link: \nReferred list: \nNetwork: \nUser list (roster): \nRefusal reason: \nReach, depth, flow score: \nChain (upline): \nLoop: ",
     "hint": "Ask of each noun: does it have behaviour, or is it only a value? A value becomes a dict, a list or a string, not a class.",
     "solution": "Event: drop as a class. It is a (referrer, user) tuple, read once and never kept.\nUser: drop as a class. It is a name, used as the key in every dict.\nReferrer link: keep. dict user -> referrer. One entry per user is the rule 'one referrer each'.\nReferred list: keep. dict user -> list of users, in event order. The same edges seen from the other side, so 'who did I refer' is one lookup.\nNetwork: keep. The one class. It owns both dicts, the user list and the rule that no loop forms, so no outside code can break the rule.\nUser list (roster): keep. A set of allowed names, or None when any name is allowed.\nRefusal reason: drop as a class. A string returned by add; build groups the refused events by it in a dict.\nReach, depth, flow score: drop as stored state. Dicts computed on demand, because stored counts go stale the moment an event is added.\nChain (upline): drop. A list built by walking up the referrer dict.\nLoop: drop. It is not a thing in the data, only a reason to refuse an event.",
     "why": "One class and two dicts carry the whole problem. The reviewer's first question is 'why two dicts' and the answer is in the Referred list line: both directions cost one lookup, and you pay memory for it.",
     "say": "I underline the nouns. **Only the network earns a class, because it is the only noun that has a rule to protect: no loops and one referrer each.** An event is a pair, a user is a name, and a refusal reason is a string, so I do not make classes for them. The two dicts are the same edges from both sides, so that 'who referred me' and 'who did I refer' are both one lookup. I compute reach and the score on demand instead of storing them, because a stored count is wrong after the next event."
    },
    {
     "t": "p",
     "text": "**Part 3 first: which flow centrality?** Decide this before the core logic, because it changes what you build. Three readings are plausible. Here they are on one seven-person example (a refers b and c; b refers d and e; d refers f; c refers g)."
    },
    {
     "t": "table",
     "head": [
      "Reading",
      "What it counts",
      "On the example",
      "What to ask",
      "The trap"
     ],
     "rows": [
      [
       "1. Reach",
       "People below you",
       "a 6, b 3, c 1, d 1, rest 0",
       "Do you mean how many people someone brought in?",
       "Part 2 already computes it, so part 3 would add nothing. A root always wins."
      ],
      [
       "2. Chains through you",
       "(people above you) x (people below you): referral chains that pass through you",
       "b 3, d 2, c 1, rest 0",
       "Do chains follow the direction of a referral, and are the two ends excluded?",
       "Running a breadth-first search from every user is O(n x (n + edges)), about 10^10 steps at 100,000 users. Or using the product when a user can have two referrers: it is then wrong."
      ],
      [
       "3. Betweenness, direction ignored",
       "Pairs of people whose path passes through you, either way",
       "a 8, b 11, c 5, d 5, rest 0",
       "Can influence run both ways, and would losing this person split the network?",
       "A different number, not a different spelling. On a tree it is the sum over pairs of the pieces left when you are removed. Reading 2 code gives the wrong answer for it."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**What candidates report.** One public repo counts shortest paths with dist(s, v) + dist(v, t) = dist(s, t) from a breadth-first search at every node, and excludes the two ends. On a forest where each user has one referrer, that is reading 2. Another repo scores with subtree sizes and calls it 'edge cut contribution', which reads like reading 3 or reading 1. Neither is the official statement. So ask, and say which you picked and why."
    },
    {
     "t": "write",
     "id": "onsite-referral-readings",
     "q": "Write the three readings of 'flow centrality' with the score each gives on the example, the one question you ask, which you pick and one line why.",
     "starter": "Reading 1: \nReading 2: \nReading 3: \n\nI ask: \nI pick: \nBecause: \nIf there is no answer I say: ",
     "hint": "Start from what already exists: reach is part 2. Then count pairs of people with a chain between them that passes through the user, once along the referral direction and once ignoring direction.",
     "solution": "Example: a>b, a>c, b>d, b>e, d>f, c>g\n\nReading 1, reach: people below you. a 6, b 3, c 1, d 1, rest 0.\nReading 2, chains through you along the referral direction: (people above you) x (people below you). b 3, d 2, c 1, rest 0.\nReading 3, betweenness ignoring direction: pairs of people whose path passes through you. a 8, b 11, c 5, d 5, rest 0.\n\nI ask: 'Do you want the number of people someone brought in, or how many referral chains pass through them? And do chains follow the arrows, or can influence run both ways?'\nI pick: reading 2.\nBecause: it matches the shortest-path-through-a-node definition candidates report, it follows the direction of a referral, it costs O(n) with one referrer each, and I can check it against its own definition on small networks.\nIf there is no answer I say: 'I am going with reading 2, chains through a user along the referral direction. Here is the one-line change for the other two.'",
     "why": "The pick is not the point. Asking, showing the readings on one example, and writing down what you chose is. Reading 2 also has a clean check: count, by brute force, the pairs (s, t) where dist(s, v) + dist(v, t) = dist(s, t), and compare.",
     "say": "**The prompt leaves flow centrality open, so I would ask, and I would show three readings on one example.** Reach is people below you, which is part 2 again. Chains through you is people above times people below, and it follows the arrows. Betweenness ignoring direction is a different number: b is 11, not 3. If nobody answers, I pick chains through you, because it is the shortest-path definition along the referral direction, and I say what changes if a user could have two referrers. I would write the choice as a comment before I code it."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per method, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-referral-d",
     "q": "Core logic in plain English, numbered, for each method, and the edge cases. No code yet.",
     "starter": "add:\n  1.\n  Edge cases:\n\n_closes_loop:\n  1.\n\nall_reach:\n  1.\n\nflow:\n  1.\n",
     "hint": "add checks in an order from cheapest to dearest. The loop check walks up. all_reach needs parents before children. flow needs the count above each user.",
     "solution": "add(referrer, user):\n  1. If either name is empty, return \"bad_event\"\n  2. If a roster exists and either name is not in it, return \"unknown_user\"\n  3. If referrer equals user, return \"self\"\n  4. If user already has this same referrer, return \"duplicate\"\n  5. If user already has a different referrer, return \"second_referrer\"\n  6. If _closes_loop(referrer, user), return \"cycle\"\n  7. Store the link in both dicts, add both names to the user list, return \"ok\"\n  Edge cases: the checks run from cheapest to dearest; nothing is written until the last line; a user seen only as a referrer is still a user\n\n_closes_loop(referrer, user):\n  1. Start at the referrer and walk up through the referrer dict\n  2. If the walk meets user, user would become their own ancestor: True\n  3. If the walk reaches someone with no referrer, False\n  Edge case: a chain of 100,000 is a loop, not recursion\n\nreach(user), the slow one:\n  1. Queue the user's direct referrals\n  2. Pop one, count it, queue its referrals\n  3. Return the count\n  Edge case: unknown user gives 0\n\nall_reach, the fast one:\n  1. List every user with each one after their referrer (breadth first from the roots)\n  2. Go through that list backwards, so all of a user's referrals are finished first\n  3. For each user, add their reach plus one to their referrer's reach\n  Edge case: a user nobody referred and who referred nobody has 0\n\ntop_k(k):\n  1. Compute all_reach\n  2. Take the k smallest by (minus reach, name), so the largest reach comes first and ties go alphabetical\n\nflow, reading 2:\n  1. Walk parents first: above[u] = above[referrer] + 1, and 0 for a root\n  2. Multiply above[u] by reach[u] for each user\n  Edge cases: a root has 0 above, a leaf has 0 below, both score 0\n\nflow_bruteforce, for checking only:\n  1. Breadth first from every user to get the distances\n  2. For each pair (s, t) and each other user v, count v when dist(s, v) + dist(v, t) = dist(s, t)",
     "why": "The order of the checks in add is a design choice you can defend: the cheap ones first, the walk up last, and nothing written before the end. Step 2 of all_reach is the trick that avoids a quadratic walk.",
     "say": "**Before any code I write the steps for each method in plain English.** For add, the checks go from cheapest to dearest, and nothing is written until the last line, so a refused event leaves no half-edge. The loop check walks up from the referrer, and meeting the new user means a loop. For the fast reach, I list users parents first, then go backwards, so that each user is finished before their parent adds them. The score is the count above times the count below, and I will check it against a brute-force count of the definition."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main method first, naming its helpers. Slow then fast. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-referral-e1",
     "q": "Code, top-down. The class with __init__ and add first, naming the loop check as a helper; then the helper; then build.",
     "starter": "class ReferralNetwork:\n    def __init__(self, known_users=None):\n        ...\n\n    def add(self, referrer, user):\n        ...\n",
     "hint": "Six returns in the order you wrote them, then the two stores. add calls self._closes_loop before it writes anything.",
     "solution": "class ReferralNetwork:\n    \"\"\"Who referred whom. Every user has at most one referrer, so the network is a forest.\"\"\"\n\n    def __init__(self, known_users=None):\n        self.known = None if known_users is None else set(known_users)   # None: any name is allowed\n        self.referrer = {}                  # user -> the one person who referred them\n        self.referred = {}                  # user -> list of users they referred, in event order\n        self.users = dict.fromkeys(known_users or ())   # everyone seen; a dict keeps insertion order\n\n    def add(self, referrer, user):\n        \"\"\"Record 'referrer referred user'. Return \"ok\", or the reason it was refused. Refusing changes nothing.\"\"\"\n        if not referrer or not user:\n            return \"bad_event\"                              # None or empty name: a broken row\n        if self.known is not None and (referrer not in self.known or user not in self.known):\n            return \"unknown_user\"\n        if referrer == user:\n            return \"self\"\n        if self.referrer.get(user) == referrer:\n            return \"duplicate\"                              # the same event again: harmless, counted once\n        if user in self.referrer:\n            return \"second_referrer\"                        # a different referrer: the first event wins\n        if self._closes_loop(referrer, user):\n            return \"cycle\"\n        self.referrer[user] = referrer\n        self.referred.setdefault(referrer, []).append(user)\n        self.users[referrer] = self.users[user] = None\n        return \"ok\"\n\n    def _closes_loop(self, referrer, user):\n        \"\"\"Walk up from the referrer. Meeting `user` means user would become their own ancestor.\"\"\"\n        cur = referrer\n        while cur is not None:\n            if cur == user:\n                return True\n            cur = self.referrer.get(cur)\n        return False\n\n\ndef build(events, known_users=None):\n    \"\"\"Feed every event in order. Return the network and the refused events grouped by reason.\"\"\"\n    net, refused = ReferralNetwork(known_users), {}\n    for referrer, user in events:\n        why = net.add(referrer, user)\n        if why != \"ok\":\n            refused.setdefault(why, []).append((referrer, user))\n    return net, refused\n",
     "why": "add reads like the requirements: six refusals, then the write. The loop check has a name, so add stays short and the walk is written once, below it. build is eight lines because add already says why it refused.",
     "say": "**add is the method they will read first, so it reads like the list of rules.** Empty name, unknown name, self, same event again, a different referrer, a loop, and only then do I write to the two dicts. The loop check is a helper that walks up from the referrer. If it meets the new user, that user would become their own ancestor. build feeds events in order and groups the refusals by reason."
    },
    {
     "t": "write",
     "id": "onsite-referral-e2",
     "q": "The queries, slow then fast: who_referred, direct, upline, reach (the obvious walk), then all_reach (one pass), top_k and the helper that lists parents first.",
     "starter": "    def who_referred(self, user):\n        ...\n\n    def reach(self, user):\n        ...\n\n    def all_reach(self):\n        ...\n",
     "hint": "reach is a queue over the referred dict. all_reach goes backwards over a parents-first list and adds reach + 1 to the parent. top_k is heapq.nsmallest with a key of (-reach, name).",
     "solution": "    # Part 2: queries. An unknown user gets a neutral answer: None, [], 0.\n    def who_referred(self, user):\n        return self.referrer.get(user)\n\n    def direct(self, user):\n        return list(self.referred.get(user, []))\n\n    def upline(self, user):\n        \"\"\"The chain of referrers above `user`, nearest first.\"\"\"\n        chain, cur = [], self.referrer.get(user)\n        while cur is not None:\n            chain.append(cur)\n            cur = self.referrer.get(cur)\n        return chain\n\n    def reach(self, user):\n        \"\"\"Slow first version: walk the subtree under `user`. O(size of that subtree) per call.\"\"\"\n        count, queue = 0, deque(self.direct(user))\n        while queue:\n            u = queue.popleft()\n            count += 1\n            queue.extend(self.referred.get(u, ()))\n        return count\n\n    def all_reach(self):\n        \"\"\"Fast version for many queries: every user's reach in one pass, O(n).\"\"\"\n        reach = dict.fromkeys(self.users, 0)\n        for u in reversed(self._parents_first()):      # a child is finished before its parent\n            p = self.referrer.get(u)\n            if p is not None:\n                reach[p] += reach[u] + 1               # the parent gains the child and the child's reach\n        return reach\n\n    def top_k(self, k):\n        \"\"\"The k users with the largest reach, ties broken by name. O(n log k).\"\"\"\n        return heapq.nsmallest(k, self.all_reach().items(), key=lambda kv: (-kv[1], kv[0]))\n\n    def _parents_first(self):\n        \"\"\"Every user, each one after their referrer: a breadth-first walk from the roots.\"\"\"\n        queue = deque(u for u in self.users if u not in self.referrer)\n        order = []\n        while queue:\n            u = queue.popleft()\n            order.append(u)\n            queue.extend(self.referred.get(u, ()))\n        return order\n",
     "why": "reach is correct and costs the size of the subtree on every call, which on a chain of 100,000 is quadratic over all users. all_reach costs one pass. Keeping both lets the fast one be checked against the slow one.",
     "say": "I write the obvious version first: a queue walk that counts the subtree under one user. **It is correct, and it is slow when I call it for every user, so the fast version is one pass backwards over the users, parents first.** By the time I reach a user, all their referrals have already added themselves, so adding reach plus one to the parent is final. I keep the slow one to check the fast one against. top k uses a heap, so it is n log k, not a full sort."
    },
    {
     "t": "write",
     "id": "onsite-referral-e3",
     "q": "Part 3, reading 2: flow() in two passes, then flow_bruteforce() as the definition counted the long way.",
     "starter": "    # Part 3: flow centrality, reading 2 (chains through a user)\n    def flow(self):\n        ...\n",
     "hint": "above[u] = above[parent] + 1 on a parents-first list; the score is above times reach. The brute force runs a breadth-first search from every user and counts v when dist(s, v) + dist(v, t) = dist(s, t).",
     "solution": "    # Part 3: flow centrality, reading B: how many (upstream, downstream) pairs have a chain through you\n    def flow(self):\n        \"\"\"flow(u) = (people above u) * (people below u). Both counts come from one pass each, so O(n).\"\"\"\n        order = self._parents_first()\n        reach = self.all_reach()\n        above = {}\n        for u in order:                                # parents first, so the parent's count is ready\n            p = self.referrer.get(u)\n            above[u] = 0 if p is None else above[p] + 1\n        return {u: above[u] * reach[u] for u in order}\n\n    def flow_bruteforce(self):\n        \"\"\"The definition, word for word: count pairs (s, t) with v on a shortest s-to-t chain. For checking only.\"\"\"\n        dist = {s: self._distances(s) for s in self.users}\n        score = dict.fromkeys(self.users, 0)\n        for s, from_s in dist.items():\n            for t, d_st in from_s.items():\n                for v, d_sv in from_s.items():\n                    if v in (s, t):\n                        continue\n                    d_vt = dist[v].get(t)\n                    if d_vt is not None and d_sv + d_vt == d_st:\n                        score[v] += 1\n        return score\n\n    def _distances(self, start):\n        \"\"\"Breadth-first distances from `start`, following referrals downward.\"\"\"\n        dist, queue = {start: 0}, deque([start])\n        while queue:\n            u = queue.popleft()\n            for c in self.referred.get(u, ()):\n                if c not in dist:\n                    dist[c] = dist[u] + 1\n                    queue.append(c)\n        return dist\n",
     "why": "flow is two O(n) passes and a multiplication. The product is right only because each user has one referrer, so there is one chain between two users. flow_bruteforce does not use that fact, so if it agrees with flow on random networks, the shortcut is correct.",
     "say": "**The score is the number above you times the number below you, and the reason it works is that each user has one referrer, so there is exactly one chain between two people.** I computed the number above in one pass and the number below with the fast reach. Then I wrote the definition the long way, a breadth-first search from every user, and compared the two on a few hundred random networks. If a user could have two referrers, the product is wrong and I would count shortest paths with their multiplicities instead."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** add is O(depth of the referrer) because of the loop check: O(1) on a shallow network, O(n) on a chain, so O(n squared) for 100,000 events on a chain. who_referred is O(1), direct is O(children), upline is O(depth). reach(u) is O(size of u's subtree) per call. all_reach, flow and _parents_first are O(n) time and O(n) space. top_k is O(n log k). flow_bruteforce is O(n cubed) and is for checking only."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-referral-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the order of the checks in add, setdefault, why a dict for users, why a queue not recursion, what the unknown-user answer is.",
     "solution": "1. Why is 'duplicate' checked before 'second_referrer'?  The same referrer again is harmless and the other is a conflict, so they must be told apart, and the equal case has to come first.\n2. Why do the checks run in that order?  Cheapest first and the walk up last, so the common bad rows never pay for it.\n3. What does add leave behind when it refuses?  Nothing. Every return happens before the first write.\n4. Why setdefault(referrer, []).append(user)?  A referrer seen for the first time has no list yet. setdefault makes it and returns it in one step.\n5. Why is users a dict and not a set?  Two reasons: a root with referrals is only a key in one dict, so I need one place to loop over everyone, and a dict keeps insertion order, so the output is the same every run.\n6. Why a queue and not recursion?  A chain of 100,000 users is far past Python's recursion limit. The queue lives on the heap.\n7. Why does all_reach go backwards?  A user's reach is final only after all their referrals have added themselves. Parents-first reversed gives children first.\n8. What does reach return for a name nobody has seen?  0, by the answer we agreed in the clarify stage.\n9. Where does flow depend on 'one referrer each'?  In the product: above times below counts chains only when there is one chain between two users.\n10. What would you check with another ten minutes?  A long chain for speed, and add after a refused event to prove the network is unchanged.",
     "why": "These are the questions asked of the code on screen. The workbench below has the follow-ups about size and changes. Together they cover what the 30-minute review reports describe.",
     "say": "**In the review I answer from the lines on the screen.** The checks are in a cheap-to-dear order and a refusal writes nothing. setdefault creates the list the first time a referrer appears. The queue is there because a long chain would break recursion. And flow is above times below only because each user has one referrer. If they ask what I would do with more time, I say a speed check on a long chain, and the proof that a refused add changes nothing."
    },
    {
     "t": "problem",
     "id": "onsite-referral-p",
     "title": "Referral network",
     "source": "Mercor-style referral round, rebuilt (three parts)",
     "minutes": 60,
     "why": "Part 1 is data modelling on messy rows, part 2 is two walks, part 3 is the question 'what does the interviewer mean'. The round grades that third thing.",
     "statement": "Part 1. You get a list of referral events, each a pair (referrer, user) meaning the referrer brought in that user. The data is messy. Build the network and refuse, with a reason, any event that is empty, names an unknown user, refers a user to themselves, repeats an event, gives a user a second referrer, or closes a loop. Report how many events were refused for each reason.\n\nPart 2. Answer queries on the network: who referred a user, who a user referred directly, the chain of referrers above a user, the reach of a user (everyone below them at any depth), and the top k users by reach.\n\nPart 3. Add a flow centrality score for every user. The prompt does not say what that means. Ask, name the readings you see, pick one, say why, and implement it cleanly.",
     "examples": [
      {
       "input": "events: a>b, a>c, b>d, b>e, d>f, c>g",
       "output": "reach(a) = 6, reach(b) = 3, reach(e) = 0",
       "note": "Reach counts every level below, not only direct referrals."
      },
      {
       "input": "then: x>b",
       "output": "refused: second_referrer",
       "note": "b already has a referrer, a. The first event wins."
      },
      {
       "input": "then: f>a",
       "output": "refused: cycle",
       "note": "a > b > d > f is already a chain, so f>a would close a loop."
      },
      {
       "input": "ann>bob, ann>bob, cy>bob, bob>bob, bob>ann, (empty)>dee, ann>zed, with roster ann, bob, cy, dee, eve",
       "output": "ok, duplicate, second_referrer, self, cycle, bad_event, unknown_user",
       "note": "Every kind of bad row, each with its own reason."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 100,000 users, so no recursion",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "class ReferralNetwork:\n    ...\n\ndef build(events, known_users=None):\n    ...",
     "hints": [
      "Level 1: keep two dicts, user to referrer and user to the list of people they referred. Return a reason string from add, and \"ok\" when it worked.",
      "Level 2: to refuse a loop, walk up from the referrer through the referrer dict. If you meet the new user, refuse the edge. Check duplicate before second_referrer.",
      "Level 3: for every user's reach at once, list users parents first with a queue, go through that list backwards and add reach + 1 to each parent. The score is (users above) x reach."
     ],
     "solution": "from collections import deque\nimport heapq\n\nclass ReferralNetwork:\n    \"\"\"Who referred whom. Every user has at most one referrer, so the network is a forest.\"\"\"\n\n    def __init__(self, known_users=None):\n        self.known = None if known_users is None else set(known_users)   # None: any name is allowed\n        self.referrer = {}                  # user -> the one person who referred them\n        self.referred = {}                  # user -> list of users they referred, in event order\n        self.users = dict.fromkeys(known_users or ())   # everyone seen; a dict keeps insertion order\n\n    def add(self, referrer, user):\n        \"\"\"Record 'referrer referred user'. Return \"ok\", or the reason it was refused. Refusing changes nothing.\"\"\"\n        if not referrer or not user:\n            return \"bad_event\"                              # None or empty name: a broken row\n        if self.known is not None and (referrer not in self.known or user not in self.known):\n            return \"unknown_user\"\n        if referrer == user:\n            return \"self\"\n        if self.referrer.get(user) == referrer:\n            return \"duplicate\"                              # the same event again: harmless, counted once\n        if user in self.referrer:\n            return \"second_referrer\"                        # a different referrer: the first event wins\n        if self._closes_loop(referrer, user):\n            return \"cycle\"\n        self.referrer[user] = referrer\n        self.referred.setdefault(referrer, []).append(user)\n        self.users[referrer] = self.users[user] = None\n        return \"ok\"\n\n    def _closes_loop(self, referrer, user):\n        \"\"\"Walk up from the referrer. Meeting `user` means user would become their own ancestor.\"\"\"\n        cur = referrer\n        while cur is not None:\n            if cur == user:\n                return True\n            cur = self.referrer.get(cur)\n        return False\n\n    # Part 2: queries. An unknown user gets a neutral answer: None, [], 0.\n    def who_referred(self, user):\n        return self.referrer.get(user)\n\n    def direct(self, user):\n        return list(self.referred.get(user, []))\n\n    def upline(self, user):\n        \"\"\"The chain of referrers above `user`, nearest first.\"\"\"\n        chain, cur = [], self.referrer.get(user)\n        while cur is not None:\n            chain.append(cur)\n            cur = self.referrer.get(cur)\n        return chain\n\n    def reach(self, user):\n        \"\"\"Slow first version: walk the subtree under `user`. O(size of that subtree) per call.\"\"\"\n        count, queue = 0, deque(self.direct(user))\n        while queue:\n            u = queue.popleft()\n            count += 1\n            queue.extend(self.referred.get(u, ()))\n        return count\n\n    def all_reach(self):\n        \"\"\"Fast version for many queries: every user's reach in one pass, O(n).\"\"\"\n        reach = dict.fromkeys(self.users, 0)\n        for u in reversed(self._parents_first()):      # a child is finished before its parent\n            p = self.referrer.get(u)\n            if p is not None:\n                reach[p] += reach[u] + 1               # the parent gains the child and the child's reach\n        return reach\n\n    def top_k(self, k):\n        \"\"\"The k users with the largest reach, ties broken by name. O(n log k).\"\"\"\n        return heapq.nsmallest(k, self.all_reach().items(), key=lambda kv: (-kv[1], kv[0]))\n\n    def _parents_first(self):\n        \"\"\"Every user, each one after their referrer: a breadth-first walk from the roots.\"\"\"\n        queue = deque(u for u in self.users if u not in self.referrer)\n        order = []\n        while queue:\n            u = queue.popleft()\n            order.append(u)\n            queue.extend(self.referred.get(u, ()))\n        return order\n\n    # Part 3: flow centrality, reading B: how many (upstream, downstream) pairs have a chain through you\n    def flow(self):\n        \"\"\"flow(u) = (people above u) * (people below u). Both counts come from one pass each, so O(n).\"\"\"\n        order = self._parents_first()\n        reach = self.all_reach()\n        above = {}\n        for u in order:                                # parents first, so the parent's count is ready\n            p = self.referrer.get(u)\n            above[u] = 0 if p is None else above[p] + 1\n        return {u: above[u] * reach[u] for u in order}\n\n    def flow_bruteforce(self):\n        \"\"\"The definition, word for word: count pairs (s, t) with v on a shortest s-to-t chain. For checking only.\"\"\"\n        dist = {s: self._distances(s) for s in self.users}\n        score = dict.fromkeys(self.users, 0)\n        for s, from_s in dist.items():\n            for t, d_st in from_s.items():\n                for v, d_sv in from_s.items():\n                    if v in (s, t):\n                        continue\n                    d_vt = dist[v].get(t)\n                    if d_vt is not None and d_sv + d_vt == d_st:\n                        score[v] += 1\n        return score\n\n    def _distances(self, start):\n        \"\"\"Breadth-first distances from `start`, following referrals downward.\"\"\"\n        dist, queue = {start: 0}, deque([start])\n        while queue:\n            u = queue.popleft()\n            for c in self.referred.get(u, ()):\n                if c not in dist:\n                    dist[c] = dist[u] + 1\n                    queue.append(c)\n        return dist\n\n\ndef build(events, known_users=None):\n    \"\"\"Feed every event in order. Return the network and the refused events grouped by reason.\"\"\"\n    net, refused = ReferralNetwork(known_users), {}\n    for referrer, user in events:\n        why = net.add(referrer, user)\n        if why != \"ok\":\n            refused.setdefault(why, []).append((referrer, user))\n    return net, refused\n",
     "complexity": "add is O(depth of the referrer), O(n) on a chain. who_referred O(1), direct O(children), upline O(depth). reach(u) is O(subtree under u) per call; looping it over all users is O(n^2) on a chain. all_reach, flow and top_k's input are one O(n) pass; top_k is O(n log k). Space is O(n). flow_bruteforce is O(n^3) and only for checking.",
     "explain": [
      "Two dicts store the same edges from both sides. The cost is memory; the gain is that 'who referred me' and 'who did I refer' are each one lookup.",
      "add returns a reason, not a bool. Every refusal returns before the first write, so a rejected event never leaves a half-edge, and build can report the counts.",
      "Duplicate comes before second_referrer: the same referrer again is harmless, a different one is a conflict.",
      "The loop check walks up from the referrer. If it reaches the new user, the new edge would make the user their own ancestor.",
      "reach is the slow, obvious version, a queue over the subtree. all_reach does the same work for every user in one pass, backwards over a parents-first list.",
      "flow multiplies the number of people above by the number below. A root has none above and a leaf none below, so both score 0.",
      "flow_bruteforce counts the definition directly. flow and flow_bruteforce must agree on every network, which the random check tests.",
      "Output on the example: reach a=6, b=3, c=1, d=1, rest 0; flow b=3, d=2, c=1, rest 0."
     ],
     "tests": "events = [(\"a\", \"b\"), (\"a\", \"c\"), (\"b\", \"d\"), (\"b\", \"e\"), (\"d\", \"f\"), (\"c\", \"g\")]\nnet, refused = build(events)\nassert not refused\nassert net.add(\"x\", \"b\") == \"second_referrer\"      # b already has a referrer, a\nassert net.add(\"f\", \"a\") == \"cycle\"                # a > b > d > f is a chain\nassert net.add(\"z\", \"z\") == \"self\"\nassert net.add(\"a\", \"b\") == \"duplicate\"\nassert net.add(\"\", \"q\") == \"bad_event\"\nassert net.who_referred(\"f\") == \"d\" and net.who_referred(\"a\") is None\nassert net.direct(\"b\") == [\"d\", \"e\"] and net.upline(\"f\") == [\"d\", \"b\", \"a\"]\nassert net.reach(\"a\") == 6 and net.reach(\"b\") == 3 and net.reach(\"e\") == 0 and net.reach(\"nobody\") == 0\nreach = net.all_reach()\nassert reach == {u: net.reach(u) for u in net.users}\nprint(\"reach:\", dict(sorted(reach.items())))\nprint(\"flow: \", dict(sorted(net.flow().items())))\nassert net.flow() == net.flow_bruteforce()\nprint(\"top 2:\", net.top_k(2))\n\n# messy real data: every kind of bad row, then the report\nrows = [(\"ann\", \"bob\"), (\"ann\", \"bob\"), (\"cy\", \"bob\"), (\"bob\", \"bob\"), (\"bob\", \"ann\"), (\"\", \"dee\"), (\"bob\", \"eve\"), (\"ann\", \"zed\")]\nnet2, refused2 = build(rows, known_users=[\"ann\", \"bob\", \"cy\", \"dee\", \"eve\"])\nprint({why: len(rs) for why, rs in sorted(refused2.items())})\nprint(\"ok\")\n\nimport random\n\ndef random_events(rng, n_users, n_events):\n    names = [f\"u{i}\" for i in range(n_users)]\n    return [(rng.choice(names + [\"\"]), rng.choice(names)) for _ in range(n_events)]\n\nrng = random.Random(7)\nfor trial in range(300):\n    net, _ = build(random_events(rng, rng.randint(2, 12), rng.randint(1, 30)))\n    for u in net.users:                                       # no loops: a walk up always ends\n        assert u not in net.upline(u)\n        assert len(set(net.upline(u))) == len(net.upline(u))\n    assert net.all_reach() == {u: net.reach(u) for u in net.users}\n    assert net.flow() == net.flow_bruteforce()\nprint(\"300 random networks: loops never form, fast equals slow, flow equals its definition\")\n",
     "followups": [
      {
       "q": "What breaks at a million events?",
       "a": "Two things. The loop check walks up the referrer chain, so a long chain costs O(depth) per event and about n squared over the stream. And memory: two dicts of strings and a list per referrer is a lot of Python objects, so use integer ids for names and read events from a stream instead of holding the list. The loop check is fixed with union-find, which is the next question. Say the order of magnitude, then say you would measure it before you changed anything."
      },
      {
       "q": "How would you make the loop check fast?",
       "a": "Use union-find over the trees. The new user has no referrer yet, so they are the root of their own tree. The event closes a loop exactly when the referrer is already in that tree, so the check is find(referrer) == find(user), which is close to O(1). After an accepted event, union the two trees. The code is in the block below this list, and it agrees with the walk up on random streams."
      },
      {
       "q": "Why a queue and not recursion?",
       "a": "A chain of 100,000 users is far past Python's recursion limit of about 1,000. A queue lives on the heap and has no such limit. Say you know the recursive version is shorter and why you did not use it."
      },
      {
       "q": "What changes if a user can have two referrers?",
       "a": "It becomes a graph, not a forest. The loop check searches up every parent. Reach counts each user once, with a visited set. And the product formula is no longer right, because there can be several shortest chains between two users: count shortest paths with their multiplicities (Brandes) and say it costs more. Ask before you build it."
      },
      {
       "q": "What if events arrive one at a time and queries are mixed in?",
       "a": "Keep the counts up to date on every add: walk up from the referrer and add one plus the new user's reach to every ancestor. That makes add O(depth) and reach O(1). Or keep the lazy version and cache all_reach until the next accepted event."
      },
      {
       "q": "Why return a reason and not raise an exception?",
       "a": "A bad row in real data is expected, not exceptional. Raising would stop a batch of 100,000 rows at the first bad one. A reason lets the loop carry on and report the counts at the end."
      },
      {
       "q": "How did you test it, with no test framework?",
       "a": "Plain asserts under the class. The seven-person example, one assert per refusal, a check that a refused add changes nothing, and two comparisons of the fast code with the slow code: all_reach with reach, and flow with its brute-force definition on a few hundred random networks. Comparing two implementations catches mistakes in either."
      }
     ],
     "d": "medium",
     "lc": "employee-importance"
    },
    {
     "t": "code",
     "id": "onsite-referral-uf",
     "title": "Faster loop check with union-find (follow-up; runs together with the solution above)",
     "code": "class Components:\n    \"\"\"Union-find: which tree each user is in, in near O(1) per call.\"\"\"\n\n    def __init__(self):\n        self.up = {}\n\n    def find(self, x):\n        self.up.setdefault(x, x)\n        while self.up[x] != x:\n            self.up[x] = self.up[self.up[x]]          # path halving keeps the chains short\n            x = self.up[x]\n        return x\n\n    def union(self, a, b):\n        self.up[self.find(a)] = self.find(b)\n\n\n# The new user has no referrer yet, so they are the root of their own tree.\n# The event closes a loop exactly when the referrer is already in that tree.\ndef closes_loop_fast(parts, referrer, user):\n    return parts.find(referrer) == parts.find(user)\n\nimport random\nrng = random.Random(3)\nfor trial in range(200):\n    slow, parts = ReferralNetwork(), Components()\n    for _ in range(40):\n        r, u = f\"u{rng.randrange(10)}\", f\"u{rng.randrange(10)}\"\n        if r == u or u in slow.referrer:\n            continue\n        fast = closes_loop_fast(parts, r, u)\n        assert fast == slow._closes_loop(r, u)\n        if slow.add(r, u) == \"ok\":\n            parts.union(r, u)\nprint(\"union-find loop check agrees with the walk up on 200 random streams\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Employee Importance",
       "d": "medium",
       "lc": "employee-importance",
       "why": "Reach of one node down a manager tree. This is part 2 with other names."
      },
      {
       "n": "Time Needed to Inform All Employees",
       "d": "medium",
       "lc": "time-needed-to-inform-all-employees",
       "yt": [
        "zdBYi0p4L5Q",
        "NeetCodeIO",
        11
       ],
       "why": "Depth along referral chains. The same walk, now carrying a number down."
      },
      {
       "n": "Redundant Connection",
       "d": "medium",
       "lc": "redundant-connection",
       "yt": [
        "FXWRE67PLL0",
        "NeetCode",
        17
       ],
       "why": "Union-find to refuse an edge that closes a loop. This is the fast loop check from the follow-up."
      },
      {
       "n": "Redundant Connection II",
       "d": "hard",
       "lc": "redundant-connection-ii",
       "yt": [
        "U7_ynlauYh0",
        "InterviewDose",
        6
       ],
       "why": "A directed graph where one node gets two parents or an edge closes a loop. Your add() rules, as one problem."
      },
      {
       "n": "Sum of Distances in Tree",
       "d": "hard",
       "lc": "sum-of-distances-in-tree",
       "yt": [
        "OCGPug-KirQ",
        "Timothy H Chang",
        13
       ],
       "why": "The harder follow-up: a score per node from counts below and above it, in O(n). The shape of reading 3."
      }
     ]
    },
    {
     "t": "predict",
     "id": "onsite-referral-pred",
     "code": "parent = {\"b\": \"a\", \"c\": \"b\"}\ncur, chain = \"c\", []\nwhile cur is not None:\n    chain.append(cur)\n    cur = parent.get(cur)\nprint(chain)\nprint(\"a\" in chain)",
     "q": "This is the loop check for the event 'c referred a'. What does it print, and is the event accepted?",
     "answer": "['c', 'b', 'a']\nTrue",
     "why": "Walking up from c gives c, b, a. The new user a is in the chain, so adding c>a would make a its own ancestor. The event is refused with reason cycle."
    }
   ]
  },
  {
   "id": "onsite-scheduler",
   "title": "3. Task scheduler",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A two-part prompt in the same solo hour. Part 1 runs tasks that depend on each other, in order, and refuses a loop. Part 2 adds failures and retries. The graph idea is topological order, which you may know as Course Schedule. The new part is deciding what a failure means for everything behind it. Reports name the two parts but not what part 2 holds, so failures and retries is a reading, not a fact. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what a task is, how dependencies are written, what part 1 returns, one at a time or in parallel. Errors: a loop, an unknown dependency, a task that raises, the tasks behind it. Scope: backoff, timeouts, saving state.",
     "solution": "1. Primary capabilities\n- What is a task, and how are dependencies given?  Likely: a name, with a dict name -> list of names it needs; the functions are in a second dict.\n- What does part 1 return?  The order as a list. Ties go in input order, so the answer is the same every run.\n- One task at a time, or in parallel?  One at a time. Say that the groups that could run together fall out of the same algorithm.\n- Can a dependency be listed twice?  Yes. Count it once.\n- What does part 2 return?  A result for every task, so nothing is silently missing: status, attempts, last error, and for a skipped task which failure blocked it.\n\n2. Error handling\n- A loop in the dependencies?  Raise before running anything, and name the loop: a -> b -> c -> a.\n- A task needs a name that is not a task?  Raise, naming both.\n- A task has no function?  Raise before running anything.\n- A task raises?  Retry up to a cap, say 2 retries, so 3 calls. Then it is failed.\n- What happens to the tasks that need a failed task?  They are skipped without being run, and so are theirs, all the way down.\n- Do tasks that do not need it still run?  Yes. Failing everything on the first error is the other reading, so ask.\n\n3. Scope boundaries\n- Waiting between retries, or a timeout per call?  Not in the first version. Say backoff with jitter is what you add next.\n- Saving state so a crash does not rerun finished tasks?  Out of scope. Say it is the start of a durable scheduler.\n- Passing one task's result to the next, or cancelling a run?  Out of scope.",
     "why": "Every question picks a line of code. The cycle answer decides when the error is raised. The failure answers decide the whole of part 2: skip, not stop, and a result per task.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, where it stops.** A task is a name with a list of what it needs, and part 1 returns an order. Then the failures, which are most of the problem: a loop, an unknown name, a task that raises, and what that does to the tasks behind it. I would like the answer to be that independent tasks still run. Last, I ask to leave backoff and saving state out of the first version, and I say I know they come next."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable. Part 2 is written as rules first."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "Order, the two errors, deterministic output, the retry cap, skipping, the result for every task.",
     "solution": "1. run_order(deps) returns every task once, each after all the tasks it needs.\n   - Test: for every task, its dependencies come earlier in the list\n   - A dependency listed twice counts once\n   - Ties keep input order, so two runs give the same list\n2. A loop raises CycleError that names the loop (a -> b -> a), before anything runs.\n   - A task that needs itself is a loop\n   - Tasks that are only behind a loop are not in the message\n3. A dependency that is not a task raises KeyError naming both. A task with no function raises before anything runs.\n4. run_all(deps, funcs, max_retries) runs tasks in that order.\n   - A task that raises is called again, at most 1 + max_retries calls in all, and stops at the first success\n5. A task that fails every call is 'failed', with the last error and the number of calls.\n6. Every task that needs a failed or skipped task is 'skipped', is never called, and names the failed task at the start of the chain.\n7. Tasks that do not need a failed task still run.\n8. run_all returns a result for every task, so len(results) equals len(deps).\n9. Out of scope: parallel runs, waiting between tries, timeouts, saving state, passing results between tasks.",
     "why": "2 and 3 are part 1. 4 to 8 are part 2, and they are written as rules before any code. That is what the reviewer wants to see: the failure behaviour decided in words, then implemented.",
     "say": "I get nine requirements, and I can test each one. **Requirements 6 and 7 are the heart of part 2: a task behind a failure is skipped and never called, and a task that does not need it still runs.** I also want 8: a result for every task, so nothing disappears from the report. Out of scope: parallel runs, waiting between tries, timeouts and saving state."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Few classes here, and that is a decision you say out loud."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-c",
     "q": "List the nouns. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Task: \nDependency: \nOrder: \nCycle: \nAttempt, retry cap: \nStatus: \nResult: \nReady queue: \nScheduler: ",
     "hint": "A name with a list is a dict entry. What carries a rule, or is returned to the caller, may be a small class.",
     "solution": "Task: drop as a class. A name (the dict key) with a list of needs (deps) and a function (funcs). Two dicts, so the order can be tested with no functions at all.\nDependency: keep as data. deps[t] is the list of names t needs. The reverse map users[d], the tasks that wait for d, is built once so a finished task reaches only its waiters.\nOrder: drop as a class. A list returned by run_order.\nCycle: keep as an error. CycleError, whose message is the loop. It is raised, not stored.\nAttempt, retry cap: drop. An int in a loop and a parameter max_retries.\nStatus: drop as a class. One of three strings: ok, failed, skipped.\nResult: keep. A small dataclass: status, attempts, error, blocked_by. It is what the caller reads and it is the same shape for every task.\nReady queue: keep as a local. A deque of tasks whose waiting count is zero; it never leaves run_order.\nScheduler: drop. Three functions are enough; a class would only hold state that does not outlive one call.",
     "why": "No big class here, and that is a decision you say out loud: the state lives for one call, so functions and one dataclass do the work. The one structure to defend is the reverse map: it is why a finished task costs the number of its waiters, not the number of tasks.",
     "say": "I underline the nouns. **Only the result earns a class, because it is what the caller reads, and the same shape for every task makes a missing task impossible to miss.** A task is a name with a list and a function, so I keep them as two dicts, which lets me test the order without running anything. The reverse map is the one structure worth explaining: it tells a finished task exactly who is waiting for it. I do not write a scheduler class, because nothing needs to outlive one call."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "run_order:\n  1.\n  Edge cases:\n\n_find_cycle:\n  1.\n\nrun_all:\n  1.\n\n_attempt:\n  1.\n",
     "hint": "Count open dependencies, start from zero, lower the count of the waiters when a task finishes. Leftovers are a cycle or behind one. Retries are a loop of 1 + max_retries calls that stops at the first success.",
     "solution": "run_order(deps):\n  1. Check every dependency is a task; if not, raise KeyError naming both\n  2. waiting[t] = number of different tasks t needs; users[d] = tasks that need d\n  3. Queue every task with waiting 0, in input order\n  4. Pop one, add it to the order; for each task that waits for it, lower its count, and queue it when it reaches 0\n  5. If the order has fewer tasks than there are, raise CycleError with the loop\n  Edge cases: a repeated dependency counts once (use a set); a task that needs itself never reaches 0; an empty dict gives []\n\n_find_cycle(deps, waiting):\n  1. The leftover tasks are the ones with waiting above 0, in input order\n  2. Every leftover task needs at least one other leftover task\n  3. Start at the first leftover and follow 'needs' links until a name repeats\n  4. The names from the first visit of the repeated one to the repeat are the loop\n  Edge cases: a task behind a loop is not in the message; a self-loop is 'a -> a'\n\nrun_all(deps, funcs, max_retries):\n  1. If any task has no function, raise before running anything\n  2. Get the order; a loop raises here, so nothing has run\n  3. For each task, in order: look for a dependency whose result is not ok\n  4. If there is one: the task is skipped; blocked_by is that dependency if it failed, else whatever blocked it. Do not call it\n  5. Otherwise call _attempt and store its result\n  Edge case: a dependency always has a result already, because the order puts it first\n\n_attempt(fn, max_retries):\n  1. Start with a failed result\n  2. Call fn up to 1 + max_retries times, counting calls\n  3. On an exception, keep its text and go again; on success mark ok, clear the error and stop\n  Edge cases: max_retries 0 means one call; catch Exception, not BaseException, so Ctrl-C still stops the run",
     "why": "Writing blocked_by as 'the failed task at the start of the chain' is a decision made in step 4. It costs one line and it answers the first question after a failure: why was this skipped?",
     "say": "**Before any code I write the steps for each function.** For the order, I count what each task still waits for and start from zero, and a repeated dependency counts once. If tasks are left over, they are on a loop or behind one, so I follow needs links from the first leftover until a name repeats, and that is the loop. For running, I decide in words that a task behind a failure is never called, and that it records which failure is to blame. A retry is a loop of one plus the cap, and it stops at the first success."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-e1",
     "q": "Code, top-down. First the slow order (keep scanning), then run_order (count open dependencies) naming its helpers, then the three helpers.",
     "starter": "def order_slow(deps):\n    ...\n\ndef run_order(deps):\n    ...\n",
     "hint": "order_slow loops until nothing is left, taking every task whose dependencies are done. run_order calls _check_known and _count_open, then queues zeros. A leftover count means a loop, and _find_cycle names it.",
     "solution": "from collections import deque\nfrom dataclasses import dataclass\n\n\nclass CycleError(ValueError):\n    \"\"\"The tasks depend on each other in a loop. The message names the loop.\"\"\"\n\n\ndef run_order(deps):\n    \"\"\"An order in which every task comes after the tasks it needs. deps: task -> list of tasks it needs first.\n    Raises KeyError for an unknown dependency and CycleError for a loop, before anything runs. O(tasks + edges).\"\"\"\n    _check_known(deps)\n    waiting, users = _count_open(deps)\n    ready = deque(t for t in deps if waiting[t] == 0)      # no open dependency: can go now\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:                                 # t is done: one fewer thing for u to wait for\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                ready.append(u)\n    if len(order) < len(deps):                             # something never became ready\n        raise CycleError(\" -> \".join(_find_cycle(deps, waiting)))\n    return order\n\n\ndef _check_known(deps):\n    for t, needs in deps.items():\n        for d in needs:\n            if d not in deps:\n                raise KeyError(f\"{t} needs {d}, which is not a task\")\n\n\ndef _count_open(deps):\n    \"\"\"waiting[t]: how many different tasks t still needs. users[d]: the tasks that wait for d.\"\"\"\n    waiting = {t: len(set(needs)) for t, needs in deps.items()}   # set: a repeated dependency counts once\n    users = {t: [] for t in deps}\n    for t, needs in deps.items():\n        for d in set(needs):\n            users[d].append(t)\n    return waiting, users\n\n\ndef _find_cycle(deps, waiting):\n    \"\"\"Leftover tasks are on a loop or behind one. Follow 'needs' links until a name repeats: that is the loop.\"\"\"\n    stuck = [t for t, n in waiting.items() if n > 0]       # a list in input order, so the message is the same every run\n    path, t = [], stuck[0]\n    while t not in path:\n        path.append(t)\n        t = next(d for d in deps[t] if waiting[d] > 0)     # every stuck task has a stuck dependency\n    return path[path.index(t):] + [t]\n\n\ndef order_slow(deps):\n    \"\"\"First version: keep scanning for tasks whose dependencies are all done. O(n^2) on a chain.\"\"\"\n    done, order = set(), []\n    while len(order) < len(deps):\n        ready = [t for t in deps if t not in done and all(d in done for d in deps[t])]\n        if not ready:\n            raise CycleError(\"stuck: \" + \", \".join(sorted(t for t in deps if t not in done)))\n        for t in ready:\n            done.add(t)\n            order.append(t)\n    return order\n",
     "why": "The slow version is five lines and obviously right, so it checks the fast one. run_order reads like the steps: check, count, queue, drain, and complain about leftovers. The loop message comes from a helper, not from a guess.",
     "say": "I write the slow version first: keep scanning for tasks whose dependencies are done. **It is correct and it is quadratic on a chain, so the fast one counts open dependencies and lowers the count of the waiters.** Both are short, and I keep the slow one to check the fast one. If tasks are left over, I do say more than that there is a cycle. I follow needs links from the first leftover until a name repeats, and print that loop, so the person reading the error knows what to fix."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-e2",
     "q": "Part 2: Result, then run_all (skip what is behind a failure), then _attempt (the retry loop).",
     "starter": "@dataclass\nclass Result:\n    ...\n\ndef run_all(deps, funcs, max_retries=2):\n    ...\n\ndef _attempt(fn, max_retries):\n    ...\n",
     "hint": "run_all gets the order first so a loop raises before anything runs. For each task look for a dependency that is not ok. _attempt is a for loop over range(1, max_retries + 2) with try, except Exception, else.",
     "solution": "@dataclass\nclass Result:\n    status: str              # \"ok\", \"failed\" or \"skipped\"\n    attempts: int = 0        # times the function was called; 0 for a skipped task\n    error: str = \"\"          # the last error, for a failed task\n    blocked_by: str = \"\"     # for a skipped task: the failed task at the start of the chain\n\n\ndef run_all(deps, funcs, max_retries=2):\n    \"\"\"Run every task in dependency order. Returns task -> Result, in the order they were reached.\"\"\"\n    missing = deps.keys() - funcs.keys()\n    if missing:\n        raise KeyError(\"no function for: \" + \", \".join(sorted(missing)))\n    results = {}\n    for t in run_order(deps):                              # a cycle raises here, before anything has run\n        bad = next((d for d in deps[t] if results[d].status != \"ok\"), None)\n        if bad is not None:                                # a dependency failed or was skipped\n            root = bad if results[bad].status == \"failed\" else results[bad].blocked_by\n            results[t] = Result(\"skipped\", blocked_by=root)\n            continue\n        results[t] = _attempt(funcs[t], max_retries)\n    return results\n\n\ndef _attempt(fn, max_retries):\n    \"\"\"Call fn up to 1 + max_retries times; stop at the first success.\"\"\"\n    result = Result(\"failed\")\n    for n in range(1, max_retries + 2):\n        result.attempts = n\n        try:\n            fn()\n        except Exception as e:                             # not BaseException: Ctrl-C must still stop us\n            result.error = f\"{type(e).__name__}: {e}\"\n        else:\n            result.status, result.error = \"ok\", \"\"\n            return result\n    return result\n",
     "why": "run_all is the whole policy in nine lines: order first, skip behind a failure, otherwise attempt. _attempt is the whole retry rule. The for-else shape means a success returns at once and a final failure falls out of the loop already marked failed.",
     "say": "**run_all gets the order first, so a loop raises before anything has run.** Then for each task I look for a dependency that is not ok. If there is one, the task is skipped, never called, and it records the failed task at the start of the chain. Otherwise I call _attempt, which tries up to one plus the cap and stops at the first success. I catch Exception and not BaseException, so Ctrl-C still stops the run. And the result for every task is stored, so nothing goes missing from the report."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** order_slow rescans every task each round: O(n squared) on a chain. run_order visits each task and each dependency once: O(tasks + dependencies) time and space. _find_cycle is O(tasks). run_all adds the work of the functions themselves: at most 1 + max_retries calls per task, and the checks around them are O(dependencies) in all."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the set in the count, the reverse map, why leftovers mean a loop, where status is set to failed, why Exception, what blocked_by holds.",
     "solution": "1. Why len(set(needs)) and not len(needs)?  A task that lists a dependency twice would wait for a count that never reaches zero and be reported as part of a loop.\n2. Why build the reverse map users?  A finished task then reaches only the tasks that wait for it. Without it every finish would scan all tasks.\n3. Why do leftover tasks mean a loop?  A task is queued only when all its dependencies are done. A task left over has a dependency that never finished, which is a loop or a path from one.\n4. Why does the cycle message not include the tasks behind the loop?  Because _find_cycle follows needs links until a name repeats, and a name repeats only on the loop itself.\n5. Why is the cycle raised before anything runs?  Half a run of a graph with a loop is worse than none: you cannot tell what state it left.\n6. Why range(1, max_retries + 2)?  The first call plus max_retries more: with 2 retries that is 3 calls.\n7. Why except Exception and not BaseException?  A KeyboardInterrupt must stop the run, not be counted as a failed attempt.\n8. Why is a dependency's result always there in run_all?  The order puts every dependency before the task that needs it.\n9. What is blocked_by for a task two steps behind the failure?  The failed task at the start of the chain, copied forward from the skipped one.\n10. What did you not test?  A task that raises something odd, and a very long chain for speed. I would add both with more time.",
     "why": "These are the questions asked of the code on screen. The workbench below has the follow-ups about parallel runs, backoff and saving state.",
     "say": "**In the review I answer from the lines on the screen.** The set stops a repeated dependency from waiting forever. The reverse map is why a finished task costs its waiters, not all tasks. Leftover tasks have a dependency that never finished, so the loop is somewhere in what remains, and I follow the links to name it. The retry range is one plus the cap, and I catch Exception so that Ctrl-C still works. If they ask what I did not test, I say a very long chain for speed and an unusual exception, and I would add both next."
    },
    {
     "t": "problem",
     "id": "onsite-scheduler-p",
     "title": "Task scheduler",
     "source": "Mercor-style scheduler round, rebuilt (two parts)",
     "minutes": 45,
     "why": "Dependency order is a standard graph problem. The value is in part 2: stating the failure rules clearly, which is the same thinking as a real job orchestrator.",
     "statement": "Part 1. You have tasks, each with a name and a list of the tasks it needs to finish first. Return an order in which all of them can run. If tasks depend on each other in a loop, raise an error that names the loop and run nothing. If a task needs one that does not exist, raise an error that names both.\n\nPart 2. Each task also has a function. Run the tasks in dependency order. If a task raises, retry it up to a cap. If it still fails, mark it failed and skip every task that depends on it, directly or not. Tasks that do not depend on it still run. Return a result for every task: its status, how many times it was called, the last error, and for a skipped task which failure blocked it.",
     "examples": [
      {
       "input": "build needs lint and fetch; lint needs fetch; test needs build; docs needs nothing",
       "output": "fetch, docs, lint, build, test",
       "note": "Any order with fetch before lint before build before test is valid. Ties keep input order."
      },
      {
       "input": "a needs b, b needs c, c needs a, d needs nothing",
       "output": "CycleError: a -> b -> c -> a",
       "note": "d is fine, but nothing runs because the loop is found first."
      },
      {
       "input": "fetch fails twice then works; build always fails; max_retries = 2",
       "output": "fetch ok (3 calls), build failed (3 calls), test skipped, blocked by build",
       "note": "Docs and lint do not need build and still run."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 10,000 tasks",
      "dependencies may repeat in a list",
      "functions take no arguments"
     ],
     "starter": "def run_order(deps):\n    ...\n\ndef run_all(deps, funcs, max_retries=2):\n    ...",
     "hints": [
      "Level 1: a task can run when every task it needs is done. Count how many it still waits for.",
      "Level 2: also build the reverse map, task to the tasks that wait for it. When a task finishes, lower each waiter's count and queue it at zero.",
      "Level 3: when the queue is empty and fewer tasks came out than exist, the rest are on or behind a loop. For retries, loop over 1 + max_retries calls with try, except Exception and else, and stop at the first success."
     ],
     "solution": "from collections import deque\nfrom dataclasses import dataclass\n\n\nclass CycleError(ValueError):\n    \"\"\"The tasks depend on each other in a loop. The message names the loop.\"\"\"\n\n\ndef run_order(deps):\n    \"\"\"An order in which every task comes after the tasks it needs. deps: task -> list of tasks it needs first.\n    Raises KeyError for an unknown dependency and CycleError for a loop, before anything runs. O(tasks + edges).\"\"\"\n    _check_known(deps)\n    waiting, users = _count_open(deps)\n    ready = deque(t for t in deps if waiting[t] == 0)      # no open dependency: can go now\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:                                 # t is done: one fewer thing for u to wait for\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                ready.append(u)\n    if len(order) < len(deps):                             # something never became ready\n        raise CycleError(\" -> \".join(_find_cycle(deps, waiting)))\n    return order\n\n\ndef _check_known(deps):\n    for t, needs in deps.items():\n        for d in needs:\n            if d not in deps:\n                raise KeyError(f\"{t} needs {d}, which is not a task\")\n\n\ndef _count_open(deps):\n    \"\"\"waiting[t]: how many different tasks t still needs. users[d]: the tasks that wait for d.\"\"\"\n    waiting = {t: len(set(needs)) for t, needs in deps.items()}   # set: a repeated dependency counts once\n    users = {t: [] for t in deps}\n    for t, needs in deps.items():\n        for d in set(needs):\n            users[d].append(t)\n    return waiting, users\n\n\ndef _find_cycle(deps, waiting):\n    \"\"\"Leftover tasks are on a loop or behind one. Follow 'needs' links until a name repeats: that is the loop.\"\"\"\n    stuck = [t for t, n in waiting.items() if n > 0]       # a list in input order, so the message is the same every run\n    path, t = [], stuck[0]\n    while t not in path:\n        path.append(t)\n        t = next(d for d in deps[t] if waiting[d] > 0)     # every stuck task has a stuck dependency\n    return path[path.index(t):] + [t]\n\n\n@dataclass\nclass Result:\n    status: str              # \"ok\", \"failed\" or \"skipped\"\n    attempts: int = 0        # times the function was called; 0 for a skipped task\n    error: str = \"\"          # the last error, for a failed task\n    blocked_by: str = \"\"     # for a skipped task: the failed task at the start of the chain\n\n\ndef run_all(deps, funcs, max_retries=2):\n    \"\"\"Run every task in dependency order. Returns task -> Result, in the order they were reached.\"\"\"\n    missing = deps.keys() - funcs.keys()\n    if missing:\n        raise KeyError(\"no function for: \" + \", \".join(sorted(missing)))\n    results = {}\n    for t in run_order(deps):                              # a cycle raises here, before anything has run\n        bad = next((d for d in deps[t] if results[d].status != \"ok\"), None)\n        if bad is not None:                                # a dependency failed or was skipped\n            root = bad if results[bad].status == \"failed\" else results[bad].blocked_by\n            results[t] = Result(\"skipped\", blocked_by=root)\n            continue\n        results[t] = _attempt(funcs[t], max_retries)\n    return results\n\n\ndef _attempt(fn, max_retries):\n    \"\"\"Call fn up to 1 + max_retries times; stop at the first success.\"\"\"\n    result = Result(\"failed\")\n    for n in range(1, max_retries + 2):\n        result.attempts = n\n        try:\n            fn()\n        except Exception as e:                             # not BaseException: Ctrl-C must still stop us\n            result.error = f\"{type(e).__name__}: {e}\"\n        else:\n            result.status, result.error = \"ok\", \"\"\n            return result\n    return result\n\n\ndef order_slow(deps):\n    \"\"\"First version: keep scanning for tasks whose dependencies are all done. O(n^2) on a chain.\"\"\"\n    done, order = set(), []\n    while len(order) < len(deps):\n        ready = [t for t in deps if t not in done and all(d in done for d in deps[t])]\n        if not ready:\n            raise CycleError(\"stuck: \" + \", \".join(sorted(t for t in deps if t not in done)))\n        for t in ready:\n            done.add(t)\n            order.append(t)\n    return order\n",
     "complexity": "order_slow is O(n^2) on a chain. run_order is O(tasks + dependencies) time and space. _find_cycle is O(tasks). run_all adds at most (1 + max_retries) calls per task plus O(dependencies) for the checks.",
     "explain": [
      "order_slow is the first version: loop until nothing is left, taking every task whose dependencies are all done. It is correct, and it re-checks the same tasks again and again.",
      "run_order first checks that every dependency exists. A typo should fail with a clear message, not a KeyError deep inside.",
      "waiting holds the number of different tasks still needed. The set makes a repeated dependency count once.",
      "users is the reverse map, so a finished task reaches only the tasks that wait for it.",
      "The queue holds tasks that are ready now. When a count reaches zero its last dependency has finished.",
      "If fewer tasks came out than exist, the rest are on or behind a loop. _find_cycle follows needs links from the first leftover until a name repeats, and that slice is the loop.",
      "run_all gets the order first, so a loop raises before anything has run. A task with a failed or skipped dependency is skipped and never called, so failure flows forward through everything behind it.",
      "Output on the example: order fetch, docs, lint, build, test; fetch ok in 3 calls, docs ok, lint ok, build failed in 3 calls, test skipped and blocked by build."
     ],
     "tests": "deps = {\"build\": [\"lint\", \"fetch\"], \"lint\": [\"fetch\"], \"fetch\": [], \"test\": [\"build\"], \"docs\": []}\norder = run_order(deps)\nassert order.index(\"fetch\") < order.index(\"lint\") < order.index(\"build\") < order.index(\"test\")\nprint(\"order:\", order)\nfor bad in ({\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"a\"], \"d\": []}, {\"a\": [\"a\"]}, {\"x\": [\"a\"], \"a\": [\"b\"], \"b\": [\"a\"]}):\n    try:\n        run_order(bad)\n    except CycleError as e:\n        print(\"cycle:\", e)\ntry:\n    run_order({\"a\": [\"zz\"]})\nexcept KeyError as e:\n    print(\"unknown:\", e)\nassert run_order({\"a\": [], \"b\": [\"a\", \"a\"]}) == [\"a\", \"b\"]       # a repeated dependency is fine\n\ncalls = {\"fetch\": 0}\ndef flaky():\n    calls[\"fetch\"] += 1\n    if calls[\"fetch\"] < 3:\n        raise RuntimeError(\"timeout\")\ndef broken():\n    raise RuntimeError(\"disk full\")\nok = lambda: None\nfuncs = {\"fetch\": flaky, \"lint\": ok, \"build\": broken, \"test\": ok, \"docs\": ok}\nresults = run_all(deps, funcs, max_retries=2)\nfor t, r in results.items():\n    print(t, r)\nassert [results[t].status for t in (\"fetch\", \"lint\", \"build\", \"test\", \"docs\")] == [\"ok\", \"ok\", \"failed\", \"skipped\", \"ok\"]\nassert results[\"fetch\"].attempts == 3 and results[\"build\"].attempts == 3 and results[\"test\"].attempts == 0\nassert results[\"test\"].blocked_by == \"build\"\nprint(\"ok\")\n\nimport random\nrng = random.Random(5)\nfor trial in range(300):\n    n = rng.randint(1, 9)\n    names = [f\"t{i}\" for i in range(n)]\n    deps = {t: [d for d in names if rng.random() < 0.25] for t in names}\n    try:\n        order = run_order(deps)\n    except CycleError:\n        try:\n            order_slow(deps)\n        except CycleError:\n            continue\n        raise AssertionError(\"fast says cycle, slow does not\")\n    assert sorted(order) == sorted(names)\n    pos = {t: i for i, t in enumerate(order)}\n    assert all(pos[d] < pos[t] for t in deps for d in deps[t])      # every dependency comes first\n    assert sorted(order_slow(deps)) == sorted(order)\nprint(\"300 random graphs: order valid, cycles agree with the slow version\")\n",
     "followups": [
      {
       "q": "How do you run independent tasks at the same time?",
       "a": "Process the queue in waves. A wave is the set of tasks ready right now. Submit the whole wave to a thread pool, wait for it, lower the counts for what finished and form the next wave. The code for the waves is in the block below this list. The other way is to submit each task as soon as it is ready and lower the counts in a callback, with a lock around the counts. The wave version is easier to reason about; the callback version wastes less time when task lengths differ."
      },
      {
       "q": "What should the retry do between calls?",
       "a": "Wait with exponential backoff and a little random jitter, so many retrying tasks do not hit the same service at the same moment. Retry only errors that can pass on a second try, such as a timeout, and not ones that cannot, such as bad input. Both are a line or two, and neither is in the solution so that it stays readable."
      },
      {
       "q": "A task is retried but did half its work the first time. What then?",
       "a": "It needs to be idempotent: running it twice has the same effect as once. Examples are writing to a file named after the task, or sending an idempotency key with an API call. At work I have written idempotent migrations, so this is the first point I would raise in a real design review."
      },
      {
       "q": "How would you save state so a crash does not rerun finished tasks?",
       "a": "Write each task's status to disk or a database when it changes. On restart load the statuses, treat ok as done, and continue from the queue. That is the seed of a durable orchestrator, and it leads straight to the job-scheduler design on the system design side."
      },
      {
       "q": "The caller wants to rerun only the failed branch. How?",
       "a": "Keep failed and skipped as separate statuses, as here, and keep blocked_by. A rerun starts from the tasks that are failed or skipped and treats ok as already done."
      },
      {
       "q": "Why not a depth-first search?",
       "a": "A depth-first search with three colours (new, visiting, done) also finds loops and gives an order, and names the loop when it meets a visiting node. The cost is recursion depth on a long chain, and it does not give you the groups that could run together for free. Either is acceptable. Say why you picked one."
      },
      {
       "q": "How did you test it, with no test framework?",
       "a": "Plain asserts under the code. The five-task example, each of the errors, a flaky function that fails twice then works, and a random-graph check: for 300 random graphs every dependency comes before its task, and the fast order agrees with the slow one on whether there is a loop."
      }
     ],
     "d": "medium",
     "lc": "course-schedule-ii",
     "yt": [
      "Akt3glAwyfY",
      "NeetCode",
      18
     ]
    },
    {
     "t": "code",
     "id": "onsite-scheduler-waves",
     "title": "Follow-up: the groups that could run together (runs together with the solution above)",
     "code": "def waves(deps):\n    \"\"\"Groups of tasks that could run at the same time: each group needs only earlier groups.\"\"\"\n    _check_known(deps)\n    waiting, users = _count_open(deps)\n    wave, out, seen = [t for t in deps if waiting[t] == 0], [], 0\n    while wave:\n        out.append(wave)\n        seen += len(wave)\n        nxt = []\n        for t in wave:\n            for u in users[t]:\n                waiting[u] -= 1\n                if waiting[u] == 0:\n                    nxt.append(u)\n        wave = nxt\n    if seen < len(deps):\n        raise CycleError(\" -> \".join(_find_cycle(deps, waiting)))\n    return out\n\ndeps = {\"build\": [\"lint\", \"fetch\"], \"lint\": [\"fetch\"], \"fetch\": [], \"test\": [\"build\"], \"docs\": []}\nprint(waves(deps))\nassert waves(deps) == [[\"fetch\", \"docs\"], [\"lint\"], [\"build\"], [\"test\"]]\n"
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
    },
    {
     "t": "predict",
     "id": "onsite-scheduler-pred",
     "code": "deps = {\"a\": [], \"b\": [\"a\"], \"c\": [\"a\", \"b\", \"b\"]}\nwaiting = {t: len(set(ds)) for t, ds in deps.items()}\nprint(waiting)",
     "q": "What does this print? Why does the set matter?",
     "answer": "{'a': 0, 'b': 1, 'c': 2}",
     "why": "c lists b twice, but it waits for b once. The reverse map also adds c to b's list once because it loops over the set. If you counted the duplicate, c would wait for 3 and the count would never reach zero, so c would be reported as part of a loop."
    }
   ]
  },
  {
   "id": "onsite-skillgraph",
   "title": "4. Expert-skill graph",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A graph problem in a business costume. Skills build on other skills, and the question is who is qualified to review whom. The graph ideas are a DAG, reachability and levels, plus what to do when the data has a loop. The solo hour rewards the person who writes the rules down first: the code is short once the rules are clear. The prompt is not public, so the shape is right and the details are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"Every expert on the platform lists skills. Some skills build on others: you need SQL before query tuning, Python before Django. You get the catalog as skill and prerequisites pairs, and each expert's skills. Build a SkillGraph. It should tell us what a skill requires, whether one skill is needed for another, how advanced a skill is, and which experts can review a candidate. Reject a catalog that does not make sense.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "Does holding a skill mean you also hold what it builds on?",
      "What does 'can review' need: every skill the candidate lists, or one of them?",
      "What is 'how advanced'? The longest chain under it, the count of prerequisites, or something given?",
      "'What a skill requires': only the direct ones, or all of them at any depth?",
      "What is 'a catalog that does not make sense'? A loop, a name that is not a skill, a skill that needs itself, a repeated prerequisite?",
      "How many skills, and is the catalog fixed or does it change while the program runs?",
      "Can the candidate be an expert in the list? What should an empty candidate list mean?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what a catalog row looks like, direct or all prerequisites, what 'holding' means, what 'review' needs, what 'level' is. Errors: every kind of bad catalog and a query about an unknown skill. Scope: size, a fixed catalog or a live one.",
     "solution": "1. Primary capabilities\n- What does the catalog look like?  Likely: a dict, skill -> list of skills it builds on, with every skill as a key. A skill with no prerequisites has an empty list.\n- Does holding a skill imply its prerequisites?  Yes. Someone who holds 'api' is taken to know python and sql. I call this covering.\n- What does 'requires' return?  Everything at any depth, sorted. I will also offer direct ones: they are already stored.\n- What does 'can review' need?  The reviewer's covered skills must include every skill the candidate lists. Ask: one skill or all?\n- What is 'level'?  0 for a skill with no prerequisites, otherwise 1 + the highest level among its prerequisites: the longest chain under it.\n- What does an empty candidate list mean?  Nothing to review, so every expert can. Say it aloud.\n\n2. Error handling\n- A loop?  Raise CycleError at build time and name it: a -> b -> c -> a.\n- A prerequisite that is not a skill?  Raise KeyError naming both.\n- A skill that needs itself?  A loop of one: a -> a.\n- A prerequisite listed twice?  Count it once.\n- A query about a skill that is not in the catalog?  Raise KeyError. A typo should be loud, not an empty answer.\n\n3. Scope boundaries\n- How big?  Say up to 2,000 skills. A closure per skill is at most 4 million entries, fine for one process.\n- Does the catalog change?  Fixed after build. Say what changes if links arrive later: the live extension.\n- Skill levels per person, expiry, weights?  Out of scope.",
     "why": "Each answer is a line of code. 'Holding implies prerequisites' decides covers. 'All of the candidate's skills' decides the subset test. A bad catalog is rejected when built, so every query after that can trust the graph.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First I ask whether holding a skill means holding what it builds on, what review needs, and what level means, because those three decide the code. Then the bad catalogs: a loop, an unknown name, a repeat. I would like each to fail when the graph is built, with a message that names the problem. Last, I ask how big it is and whether it changes, and I say that I will build it fixed and show how a new link would go in."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One for building and refusing, one each for requires, needs, levels, covers and review, one for the unknown query, one for size.",
     "solution": "1. SkillGraph(catalog) builds the graph or refuses a bad catalog.\n   - A loop raises CycleError that names the loop, before any query is answered\n   - A prerequisite that is not a skill raises KeyError naming both\n   - A repeated prerequisite counts once\n2. requires(s) returns every skill s builds on, at any depth, sorted.\n   - Test: api requires django, http, postgres, python, sql in the example\n3. needs(a, b) says whether a is required, at any depth, for b. A skill does not need itself.\n4. level[s] is 0 with no prerequisites, else 1 + the largest level among them. by_level groups skills by level.\n5. covers(held) is what the person holds plus everything those build on.\n6. can_review(reviewer, candidate) is true when the candidate's skills are all covered by the reviewer.\n7. reviewers(candidate, experts) lists the experts who can review, sorted by name.\n8. A query that names an unknown skill raises KeyError.\n9. The fast requires equals a plain walk down on every skill of random catalogs.\n10. Out of scope: changing the catalog after build (extension), weights, expiry.",
     "why": "3 and 5 are the reachability questions. 9 is how you check the fast code without an answer key. 1 puts all the validation in one place, so nothing after it has to check again.",
     "say": "From the answers I get ten requirements and can test each one. **The two I would not skip are the loop being named at build time, and the fast requires equalling a plain walk on random catalogs.** Then covers and can_review, which is where the business rule lives. Out of scope: changing the catalog after the build, which I will show as the live extension."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Everything else is a key, a dict or a list."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Skill: \nPrerequisite link: \nCatalog: \nLevel: \nClosure (everything below): \nExpert: \nCandidate: \nSkills held: \nOrder: \nLoop: ",
     "hint": "Ask of each noun: does it have behaviour, or is it only a value? Then ask which lookups you do most.",
     "solution": "Skill: drop as a class. A string, the key in every dict.\nPrerequisite link: keep as data. direct[skill] is the list of skills it builds on, with repeats removed.\nCatalog: keep. The graph is the one class. It owns the dicts and the rule that the graph has no loop, so no caller can hold a bad one.\nLevel: drop as a class. A dict skill -> int, computed once in the build because the graph does not change.\nClosure: keep as a precomputed dict skill -> set of everything below it. It turns 'what does it need' and 'is a needed for b' into one lookup. The price is memory.\nExpert and candidate: drop as classes. A name and a list of skills; experts is a dict name -> list.\nSkills held: drop. A list given to covers, which returns a set.\nOrder: keep as a list on the graph, prerequisites first. It is how the closure and the levels are built in one pass.\nLoop: drop. It is not data, only a reason to refuse the catalog.",
     "why": "One class and four dicts carry the problem. The reviewer's first question is why you precompute the closure. The answer: queries are many and the graph is fixed, so you pay once at build, and you say what the memory costs.",
     "say": "I underline the nouns. **Only the graph earns a class, because it is the one thing with a rule to protect: no loops.** A skill is a string, an expert is a name with a list, and a loop is a reason to refuse. The one structure to defend is the closure. I compute it once, in prerequisite order, because the catalog does not change and queries are many. I keep a slow walk beside it so the two can be compared."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "SkillGraph.__init__:\n  1.\n\n_order:\n  1.\n  Edge cases:\n\n_find_loop:\n  1.\n\ncovers / can_review / reviewers:\n  1.\n",
     "hint": "Count what each skill still waits for and start from zero. Closure and level are filled in that order. A loop leaves skills over. covers is a union of closures.",
     "solution": "__init__(prereqs):\n  1. _clean: every prerequisite must be a key, else KeyError naming both; drop repeats, keep order\n  2. _order: prerequisites first, or raise CycleError\n  3. For each skill in that order: below = union of (below[p] + p) over its prerequisites; level = 1 + the largest level of them, or 0 if none\n  Edge cases: a repeat counts once; a skill with no prerequisites has an empty set and level 0\n\n_order(direct):\n  1. waiting[s] = number of prerequisites; users[p] = skills that build on p\n  2. Queue every skill with waiting 0\n  3. Pop one, append to the order, lower the count of every skill that builds on it, queue at 0\n  4. If fewer skills came out than exist, raise CycleError with the loop\n  Edge cases: a self-loop never reaches 0; an empty catalog gives []\n\n_find_loop(direct, waiting):\n  1. Start at any skill with waiting above 0\n  2. Follow a prerequisite that is also left over, until a name repeats\n  3. The names from the first visit of the repeated one, plus the repeat, are the loop\n  Edge cases: skills above a loop are not in the message; a self-loop is 'a -> a'\n\ncovers(held):\n  1. Check every name is a skill\n  2. Start with the held skills; add below[s] for each\n  Edge case: an empty list covers nothing\n\ncan_review(reviewer, candidate):\n  1. Check the candidate's names are skills\n  2. True when every candidate skill is in covers(reviewer)\n\nreviewers(candidate, experts):\n  1. Keep the experts for whom can_review is true; sort by name\n  Edge case: an empty candidate list returns every expert",
     "why": "Computing below and level in one pass over the order is the design choice. Because each skill's prerequisites are done before it, their sets and levels are final when you read them.",
     "say": "**Before any code I write the steps for each function.** For the build, I count what each skill still waits for and start from zero, so by the time I reach a skill all its prerequisites have their sets and levels ready. A loop leaves skills over, and I follow links from one of them until a name repeats, and print that. Covering is a union of the sets below what you hold. Reviewing is a subset test against that."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-e1",
     "q": "Code, top-down. The class first: __init__, requires, needs, by_level, covers, can_review, reviewers, naming _clean and _order as helpers. Add the slow requires beside it.",
     "starter": "class SkillGraph:\n    def __init__(self, prereqs):\n        ...\n\n    def requires(self, skill):\n        ...\n",
     "hint": "__init__ calls _clean, then _order, then loops over the order filling below and level. can_review is a subset test against covers.",
     "solution": "from collections import deque\n\nclass CycleError(ValueError):\n    \"\"\"The catalog has a loop. The message names it.\"\"\"\n\n\nclass SkillGraph:\n    \"\"\"Skills and what each one builds on. Fixed when built: a bad catalog fails here, not later.\"\"\"\n\n    def __init__(self, prereqs):\n        self.direct = _clean(prereqs)                    # skill -> list of skills it builds on, no repeats\n        self.order = _order(self.direct)                 # every skill after its prerequisites; raises on a loop\n        self.below = {}                                  # skill -> set of everything it needs, at any depth\n        self.level = {}                                  # skill -> length of the longest chain under it\n        for s in self.order:                             # prerequisites come first, so theirs are ready\n            self.below[s], self.level[s] = set(), 0\n            for p in self.direct[s]:\n                self.below[s] |= self.below[p] | {p}\n                self.level[s] = max(self.level[s], self.level[p] + 1)\n\n    def requires(self, skill):\n        \"\"\"Everything `skill` builds on, at any depth, sorted. A lookup, not a walk.\"\"\"\n        self._known([skill])\n        return sorted(self.below[skill])\n\n    def needs(self, a, b):\n        \"\"\"Is `a` required, at any depth, for `b`?\"\"\"\n        self._known([a, b])\n        return a in self.below[b]\n\n    def by_level(self):\n        \"\"\"Level 0 has no prerequisites; level n sits on a chain of n skills. {level: [skills]}\"\"\"\n        groups = {}\n        for s in self.order:\n            groups.setdefault(self.level[s], []).append(s)\n        return {n: sorted(g) for n, g in sorted(groups.items())}\n\n    def covers(self, held):\n        \"\"\"Everything someone with these skills is taken to have: what they hold, plus all that builds on.\"\"\"\n        self._known(held)\n        have = set(held)\n        for s in held:\n            have |= self.below[s]\n        return have\n\n    def can_review(self, reviewer, candidate):\n        \"\"\"A reviewer can review a candidate if they cover every skill the candidate lists.\"\"\"\n        self._known(candidate)\n        return set(candidate) <= self.covers(reviewer)\n\n    def reviewers(self, candidate, experts):\n        \"\"\"Names of the experts who can review `candidate`, sorted. experts: name -> list of skills.\"\"\"\n        return sorted(name for name, held in experts.items() if self.can_review(held, candidate))\n\n    def _known(self, skills):\n        for s in skills:\n            if s not in self.direct:\n                raise KeyError(f\"unknown skill: {s}\")\n\n    def requires_slow(self, skill):\n        \"\"\"First version: walk down from the skill on every call. O(skills + links) per call.\"\"\"\n        seen, stack = set(), list(self.direct[skill])\n        while stack:\n            s = stack.pop()\n            if s not in seen:\n                seen.add(s)\n                stack.extend(self.direct[s])\n        return sorted(seen)\n",
     "why": "The class reads like the requirements. __init__ is the only place that does work; every query after it is a lookup or a union. The slow requires is five lines and obviously right, so it checks the fast one.",
     "say": "I write the class first and name the helpers I have not written yet. **The build does all the work: clean, order, then one pass that fills the sets and the levels.** After that every query is a lookup, a union or a subset test. I keep the slow walk-down as a method so I can check the fast answer against it on random catalogs."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-e2",
     "q": "The helpers: _clean (names and repeats), _order (count what each skill waits for) and _find_loop (name the loop).",
     "starter": "def _clean(prereqs):\n    ...\n\ndef _order(direct):\n    ...\n\ndef _find_loop(direct, waiting):\n    ...\n",
     "hint": "Same shape as a task scheduler: waiting counts, a reverse map, a queue. Left-over skills have a left-over prerequisite, so you can always follow one.",
     "solution": "\n\ndef _clean(prereqs):\n    \"\"\"Check every name is a skill and drop repeats. A skill that needs an unknown name is a data error.\"\"\"\n    direct = {}\n    for s, ps in prereqs.items():\n        for p in ps:\n            if p not in prereqs:\n                raise KeyError(f\"{s} builds on {p}, which is not in the catalog\")\n        direct[s] = list(dict.fromkeys(ps))               # keeps the order, counts a repeat once\n    return direct\n\n\ndef _order(direct):\n    \"\"\"Skills with prerequisites first, by counting what each still waits for. A loop leaves skills over.\"\"\"\n    waiting = {s: len(ps) for s, ps in direct.items()}\n    users = {s: [] for s in direct}                        # users[p]: the skills that build on p\n    for s, ps in direct.items():\n        for p in ps:\n            users[p].append(s)\n    ready = deque(s for s in direct if waiting[s] == 0)\n    order = []\n    while ready:\n        s = ready.popleft()\n        order.append(s)\n        for u in users[s]:\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                ready.append(u)\n    if len(order) < len(direct):\n        raise CycleError(\" -> \".join(_find_loop(direct, waiting)))\n    return order\n\n\ndef _find_loop(direct, waiting):\n    \"\"\"Skills left over are on a loop or above one. Follow 'builds on' links until a name repeats.\"\"\"\n    path, s = [], next(s for s, n in waiting.items() if n > 0)\n    while s not in path:\n        path.append(s)\n        s = next(p for p in direct[s] if waiting[p] > 0)  # a left-over skill always has a left-over prerequisite\n    return path[path.index(s):] + [s]\n",
     "why": "This is the counting order you know from Course Schedule. The new part is _find_loop, which turns 'there is a loop' into 'here it is'.",
     "say": "The order is a queue of skills that wait for nothing, and each finished skill lowers the count of the skills built on it. **If skills are left over, each of them has a prerequisite that is also left over, so I can follow those links until a name repeats and that is the loop.** The message then says what to fix, not only that something is wrong."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** Building is O(skills + links) for the order, plus the closure: each union costs the size of the set, so the worst case is O(skills x links) time and O(skills squared) space. requires is O(answer size log answer size) because it sorts; needs is O(1); level is O(1). covers is O(held x skills). reviewers is O(experts x held x skills). requires_slow is O(skills + links) per call."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: why a precomputed closure, why a list for order, why the subset test, why sorted, what the empty candidate means, why unknown skills raise.",
     "solution": "1. Why precompute the closure and not walk down on each call?  The graph is fixed and queries are many. I pay O(links x size) once and every query is a lookup. If the graph changed often I would walk on demand.\n2. What does the closure cost?  Memory: up to skills squared entries in a chain. At 2,000 skills that is 2 million, fine. At a million I would not.\n3. Why is level 1 + max and not a count of prerequisites?  Level is the longest chain under the skill. A skill with two level-0 prerequisites is level 1, not 2.\n4. Why does the loop leave skills over?  A skill is queued only after all its prerequisites are done. A loop never finishes, so its skills and the skills above it stay waiting.\n5. Why is the message only the loop and not every left-over skill?  _find_loop follows links until a name repeats, which can only happen on the loop itself.\n6. Why a subset test for review?  A reviewer must cover everything the candidate lists. One missing skill means they cannot judge the candidate.\n7. Why check the candidate's names in can_review?  A typo in the candidate's skills would otherwise be silently uncovered and the answer would be a quiet no.\n8. Why sorted in requires?  A set has no order. Sorted output is the same every run, so tests and logs do not flicker.\n9. What does reviewers return for an empty candidate list?  Every expert. An empty set is a subset of anything. I said so in the clarify stage.\n10. What did you not test?  A very large catalog for speed and memory. I would build a chain of 2,000 and time it.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about size, changes and the other readings of 'review'.",
     "say": "**In the review I answer from the lines on the screen.** The closure is precomputed because the graph is fixed and queries are many. Level is the longest chain, so it is 1 plus the maximum. A loop leaves skills over, and following their links names it. Review is a subset test, and an empty candidate list passes everybody, which I agreed in the clarify stage. If they ask what I did not test, it is a chain of 2,000 skills for speed and memory."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-skillgraph-ext",
     "q": "Live extension. The reviewer says: 'New links arrive while the program runs. Add a prerequisite to an existing skill, refuse it if it would make a loop, and tell me what an expert should learn next.' Write how your design takes it, then the code.",
     "starter": "def add_prereq(graph, skill, prereq):\n    ...\n\ndef next_skills(graph, held):\n    ...\n",
     "hint": "A new link skill -> prereq closes a loop exactly when prereq already builds on skill. You already have that set. Next skills: not covered, and every prerequisite is covered.",
     "solution": "Why the design takes it: the closure that answers 'is a needed for b' also answers 'would this link close a loop'. The link skill -> prereq makes a loop when prereq already builds on skill, which is one lookup: skill in below[prereq].\n\nThe simplest correct version rebuilds the graph from the changed catalog and leaves the old graph untouched, so a refused or half-finished change never corrupts it. The faster version updates only the skills that build on `skill`: add below[prereq] and prereq to their sets and recompute their levels in order. Say that, and say you would measure before writing it.\n\nNext skills is covers plus a filter over the order: a skill not covered, with every prerequisite covered. Because the order has prerequisites first, easier skills come first.\n\nThe code is in the block under the workbench. It prints the next skills for someone who holds python, the levels before and after sql gets a prerequisite, and the two refusals.",
     "why": "The extension tests the design, not the typing. If the closure is a lookup, the loop check is free. If the order is kept, 'next' is a filter. A design built only to answer the first questions would need a rewrite here.",
     "say": "**The closure I built for 'is a needed for b' also answers 'would this link close a loop': the link makes a loop when the prerequisite already builds on the skill.** That is one lookup. For a first version I rebuild the graph and keep the old one, so a refusal cannot corrupt anything. Then I say the faster way, which updates only the skills above the changed one, and that I would measure first. For 'what next', I filter the order for skills not covered whose prerequisites all are."
    },
    {
     "t": "problem",
     "id": "onsite-skillgraph-p",
     "title": "Expert-skill graph",
     "source": "Mercor-style graph prompt, rebuilt (left vague on purpose)",
     "minutes": 60,
     "why": "A DAG with reachability, levels and bad data. The reviewer watches whether you decide what 'holds', 'level' and 'review' mean before you write the first line.",
     "statement": "\"Every expert on the platform lists skills. Some skills build on others: you need SQL before query tuning, Python before Django. You get the catalog as skill and prerequisites pairs, and each expert's skills. Build a SkillGraph. It should tell us what a skill requires, whether one skill is needed for another, how advanced a skill is, and which experts can review a candidate. Reject a catalog that does not make sense.\"",
     "examples": [
      {
       "input": "catalog: python, sql, http need nothing; django needs python and http; postgres needs sql; tuning needs postgres; api needs django and postgres",
       "output": "levels: 0: http, python, sql; 1: django, postgres; 2: api, tuning",
       "note": "Level is the longest chain under a skill."
      },
      {
       "input": "api requires",
       "output": "django, http, postgres, python, sql",
       "note": "All depths, sorted."
      },
      {
       "input": "experts ana [api], bo [tuning, django], cy [python], dee [api, tuning]; candidate [django, postgres]",
       "output": "ana, bo, dee",
       "note": "bo holds tuning, which builds on postgres, and django. cy covers neither."
      },
      {
       "input": "a needs b, b needs c, c needs a, d needs nothing",
       "output": "CycleError: a -> b -> c -> a",
       "note": "The loop is named; d plays no part."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 2,000 skills",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "class SkillGraph:\n    def __init__(self, prereqs):\n        ...\n\n    def requires(self, skill):\n        ...\n\n    def reviewers(self, candidate, experts):\n        ...",
     "hints": [
      "Level 1: store the catalog as a dict. Decide what 'holds' means before you write a query. Reject a bad catalog in __init__.",
      "Level 2: put the skills in an order where each comes after its prerequisites (count what each waits for). Then fill each skill's set of everything below it from its prerequisites' sets.",
      "Level 3: a reviewer covers their skills plus everything below them. The candidate's skills must all be in that set. A leftover count after the order means a loop: follow links until a name repeats."
     ],
     "solution": "from collections import deque\n\nclass CycleError(ValueError):\n    \"\"\"The catalog has a loop. The message names it.\"\"\"\n\n\nclass SkillGraph:\n    \"\"\"Skills and what each one builds on. Fixed when built: a bad catalog fails here, not later.\"\"\"\n\n    def __init__(self, prereqs):\n        self.direct = _clean(prereqs)                    # skill -> list of skills it builds on, no repeats\n        self.order = _order(self.direct)                 # every skill after its prerequisites; raises on a loop\n        self.below = {}                                  # skill -> set of everything it needs, at any depth\n        self.level = {}                                  # skill -> length of the longest chain under it\n        for s in self.order:                             # prerequisites come first, so theirs are ready\n            self.below[s], self.level[s] = set(), 0\n            for p in self.direct[s]:\n                self.below[s] |= self.below[p] | {p}\n                self.level[s] = max(self.level[s], self.level[p] + 1)\n\n    def requires(self, skill):\n        \"\"\"Everything `skill` builds on, at any depth, sorted. A lookup, not a walk.\"\"\"\n        self._known([skill])\n        return sorted(self.below[skill])\n\n    def needs(self, a, b):\n        \"\"\"Is `a` required, at any depth, for `b`?\"\"\"\n        self._known([a, b])\n        return a in self.below[b]\n\n    def by_level(self):\n        \"\"\"Level 0 has no prerequisites; level n sits on a chain of n skills. {level: [skills]}\"\"\"\n        groups = {}\n        for s in self.order:\n            groups.setdefault(self.level[s], []).append(s)\n        return {n: sorted(g) for n, g in sorted(groups.items())}\n\n    def covers(self, held):\n        \"\"\"Everything someone with these skills is taken to have: what they hold, plus all that builds on.\"\"\"\n        self._known(held)\n        have = set(held)\n        for s in held:\n            have |= self.below[s]\n        return have\n\n    def can_review(self, reviewer, candidate):\n        \"\"\"A reviewer can review a candidate if they cover every skill the candidate lists.\"\"\"\n        self._known(candidate)\n        return set(candidate) <= self.covers(reviewer)\n\n    def reviewers(self, candidate, experts):\n        \"\"\"Names of the experts who can review `candidate`, sorted. experts: name -> list of skills.\"\"\"\n        return sorted(name for name, held in experts.items() if self.can_review(held, candidate))\n\n    def _known(self, skills):\n        for s in skills:\n            if s not in self.direct:\n                raise KeyError(f\"unknown skill: {s}\")\n\n    def requires_slow(self, skill):\n        \"\"\"First version: walk down from the skill on every call. O(skills + links) per call.\"\"\"\n        seen, stack = set(), list(self.direct[skill])\n        while stack:\n            s = stack.pop()\n            if s not in seen:\n                seen.add(s)\n                stack.extend(self.direct[s])\n        return sorted(seen)\n\n\n\ndef _clean(prereqs):\n    \"\"\"Check every name is a skill and drop repeats. A skill that needs an unknown name is a data error.\"\"\"\n    direct = {}\n    for s, ps in prereqs.items():\n        for p in ps:\n            if p not in prereqs:\n                raise KeyError(f\"{s} builds on {p}, which is not in the catalog\")\n        direct[s] = list(dict.fromkeys(ps))               # keeps the order, counts a repeat once\n    return direct\n\n\ndef _order(direct):\n    \"\"\"Skills with prerequisites first, by counting what each still waits for. A loop leaves skills over.\"\"\"\n    waiting = {s: len(ps) for s, ps in direct.items()}\n    users = {s: [] for s in direct}                        # users[p]: the skills that build on p\n    for s, ps in direct.items():\n        for p in ps:\n            users[p].append(s)\n    ready = deque(s for s in direct if waiting[s] == 0)\n    order = []\n    while ready:\n        s = ready.popleft()\n        order.append(s)\n        for u in users[s]:\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                ready.append(u)\n    if len(order) < len(direct):\n        raise CycleError(\" -> \".join(_find_loop(direct, waiting)))\n    return order\n\n\ndef _find_loop(direct, waiting):\n    \"\"\"Skills left over are on a loop or above one. Follow 'builds on' links until a name repeats.\"\"\"\n    path, s = [], next(s for s, n in waiting.items() if n > 0)\n    while s not in path:\n        path.append(s)\n        s = next(p for p in direct[s] if waiting[p] > 0)  # a left-over skill always has a left-over prerequisite\n    return path[path.index(s):] + [s]\n",
     "complexity": "Build O(skills + links) for the order plus the closure at worst O(skills x links) time and O(skills squared) space. requires O(answer log answer), needs and level O(1), covers O(held x skills), reviewers O(experts x held x skills).",
     "explain": [
      "_clean checks every name and removes repeats, so a typo fails at build time with both names.",
      "_order counts what each skill waits for and queues zeros, as in a task scheduler. Leftovers mean a loop.",
      "below[s] is the union of (below[p] + p) over its prerequisites; it is final because prerequisites come first in the order.",
      "level[s] is 1 + the highest level among prerequisites, so it is the longest chain under the skill.",
      "covers adds below[s] for each skill held. can_review is a subset test against it.",
      "requires_slow walks down on every call. It exists only to check the fast answer.",
      "What the checks print: levels: {0: ['http', 'python', 'sql'], 1: ['django', 'postgres'], 2: ['api', 'tuning']} | api requires: ['django', 'http', 'postgres', 'python', 'sql'] | reviewers for [django, postgres]: ['ana', 'bo', 'dee'] | reviewers for [tuning]: ['bo', 'dee'] | loop: a -> b -> c -> a | loop: a -> a | loop: a -> b -> a"
     ],
     "tests": "catalog = {\"python\": [], \"sql\": [], \"http\": [], \"django\": [\"python\", \"http\"],\n           \"postgres\": [\"sql\"], \"tuning\": [\"postgres\"], \"api\": [\"django\", \"postgres\"]}\ng = SkillGraph(catalog)\nprint(\"levels:\", g.by_level())\nprint(\"api requires:\", g.requires(\"api\"))\nassert g.needs(\"sql\", \"api\") and not g.needs(\"tuning\", \"api\") and not g.needs(\"api\", \"api\")\nassert g.level[\"tuning\"] == 2 and g.level[\"python\"] == 0\nexperts = {\"ana\": [\"api\"], \"bo\": [\"tuning\", \"django\"], \"cy\": [\"python\"], \"dee\": [\"api\", \"tuning\"]}\nprint(\"reviewers for [django, postgres]:\", g.reviewers([\"django\", \"postgres\"], experts))\nprint(\"reviewers for [tuning]:\", g.reviewers([\"tuning\"], experts))\nassert g.reviewers([], experts) == [\"ana\", \"bo\", \"cy\", \"dee\"]          # an empty candidate list: everyone can review\nfor bad in ({\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"a\"], \"d\": []}, {\"a\": [\"a\"]}, {\"x\": [\"a\"], \"a\": [\"b\"], \"b\": [\"a\"]}):\n    try:\n        SkillGraph(bad)\n    except CycleError as e:\n        print(\"loop:\", e)\ntry:\n    SkillGraph({\"a\": [\"zz\"]})\nexcept KeyError as e:\n    print(\"unknown:\", e)\ntry:\n    g.requires(\"rust\")\nexcept KeyError as e:\n    print(\"query:\", e)\nassert SkillGraph({\"a\": [], \"b\": [\"a\", \"a\"]}).level[\"b\"] == 1          # a repeated prerequisite counts once\n\nimport random\nrng = random.Random(11)\n\ndef reaches_self(direct):\n    \"\"\"The definition of a loop, the long way: some skill can walk down to itself.\"\"\"\n    for s in direct:\n        seen, stack = set(), list(direct[s])\n        while stack:\n            t = stack.pop()\n            if t == s:\n                return True\n            if t not in seen:\n                seen.add(t)\n                stack.extend(direct[t])\n    return False\n\ndef level_slow(direct, s):\n    return 0 if not direct[s] else 1 + max(level_slow(direct, p) for p in direct[s])\n\nfor trial in range(300):\n    names = [f\"s{i}\" for i in range(rng.randint(1, 9))]\n    cat = {s: [p for p in names if rng.random() < 0.2] for s in names}\n    try:\n        g2 = SkillGraph(cat)\n    except CycleError:\n        assert reaches_self(cat)\n        continue\n    assert not reaches_self(cat)\n    for s in names:\n        assert g2.requires(s) == g2.requires_slow(s)\n        assert g2.level[s] == level_slow(g2.direct, s)\nprint(\"300 random catalogs: loops found exactly when the definition says, fast requires equals slow, levels agree\")\n",
     "followups": [
      {
       "q": "Why is 'review' every skill and not one skill?",
       "a": "That was my assumption from the clarify stage. Reviewing a candidate on a skill you do not cover is a guess. If they say one skill is enough, can_review becomes an any() over the candidate's skills, and I would rename the method so nobody mistakes the two."
      },
      {
       "q": "What if the catalog has a million skills?",
       "a": "The closure is the first thing to break: it can be skills squared in a chain. I would stop storing it and answer needs by a search from b down to a, with a visited set, and cache the answers asked often. Or keep a compressed reachability index. I would measure the memory first."
      },
      {
       "q": "Why is the loop caught at build time and not at query time?",
       "a": "Every query assumes a DAG. If a loop got through, requires could return a skill as its own prerequisite and level would not exist. One check at the door keeps every later line simple."
      },
      {
       "q": "Could you use a depth-first search?",
       "a": "Yes. Three colours, new, visiting, done: meeting a visiting skill is a loop and the stack holds its path. The order falls out as post-order. It is recursive on a long chain, which is why I used the counting version."
      },
      {
       "q": "How would you rank reviewers, not only list them?",
       "a": "Add a score. The number of covered skills the candidate does not list is a rough measure of how senior the reviewer is, and the level of the highest skill held is another. Ask what 'better' means before choosing."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the class. The seven-skill example by hand, one assert for each error, the empty candidate case, and a random check on 300 catalogs: a loop is raised exactly when some skill can walk down to itself, fast requires equals the plain walk, and level equals a recursive longest chain."
      }
     ],
     "d": "medium",
     "lc": "course-schedule-iv",
     "yt": [
      "cEW05ofxhn0",
      "NeetCodeIO",
      18
     ]
    },
    {
     "t": "code",
     "id": "onsite-skillgraph-ext-code",
     "title": "Live extension: add a link online and suggest the next skills (runs together with the solution above)",
     "code": "def add_prereq(graph, skill, prereq):\n    \"\"\"A new link arrives: `skill` now builds on `prereq`. Return a new graph, or raise if it would close a loop.\"\"\"\n    graph._known([skill, prereq])\n    if skill == prereq or skill in graph.below[prereq]:     # prereq already builds on skill: this link makes a loop\n        raise CycleError(f\"{skill} -> {prereq} would close a loop\")\n    new = {s: list(ps) for s, ps in graph.direct.items()}\n    new[skill].append(prereq)\n    return SkillGraph(new)                                  # simplest correct: rebuild; the old graph is untouched\n\n\ndef next_skills(graph, held):\n    \"\"\"Skills not yet covered whose prerequisites are all covered: what to learn next, easiest levels first.\"\"\"\n    have = graph.covers(held)\n    return [s for s in graph.order if s not in have and all(p in have for p in graph.direct[s])]\n\n\ng = SkillGraph({\"python\": [], \"sql\": [], \"http\": [], \"django\": [\"python\", \"http\"],\n                \"postgres\": [\"sql\"], \"tuning\": [\"postgres\"], \"api\": [\"django\", \"postgres\"]})\nprint(\"cy holds python, next:\", next_skills(g, [\"python\"]))\ng2 = add_prereq(g, \"sql\", \"python\")                         # sql now builds on python\nprint(\"sql level before and after:\", g.level[\"sql\"], g2.level[\"sql\"], \"| tuning:\", g.level[\"tuning\"], g2.level[\"tuning\"])\nfor edge in ((\"python\", \"api\"), (\"python\", \"python\")):\n    try:\n        add_prereq(g, *edge)\n    except CycleError as e:\n        print(\"refused:\", e)\nassert g.level[\"sql\"] == 0                                  # the old graph did not change\n"
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
   "id": "onsite-planner",
   "title": "5. Project dependency planner",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** The task scheduler's older sibling. Tasks have a duration and wait for other tasks, and the question is how long the whole project takes and which tasks are the bottleneck. It is longest path in a DAG with a business name: earliest finish, critical path and slack. The solo hour grades whether you ask what 'bottleneck' means before you code. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"A project is a set of tasks. Each task takes some days and waits for other tasks to finish first. Work out how long the project takes, when each task can start and finish, and which tasks are the bottleneck. Refuse a plan that cannot be done.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** This is why you clarify first. Each line below changes the code."
    },
    {
     "t": "list",
     "items": [
      "Are there as many people as we need, or a fixed number?",
      "What are the units: whole days, fractions? Can a task take zero days?",
      "'The bottleneck': one path, every task on any longest path, or how much each task can slip?",
      "If two chains tie for longest, which one do you return?",
      "What is a plan that cannot be done: a loop, a wait on a task that does not exist, negative days?",
      "Can there be several tasks with nothing before them, or several at the end?",
      "How many tasks? What should an empty plan return?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-planner-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: the input shape, units, people, what 'bottleneck' returns, ties. Errors: loop, unknown wait, negative days. Scope: how many tasks, fixed people, the later question of fewer people.",
     "solution": "1. Primary capabilities\n- What does a task look like?  Likely: a dict, name -> (days, list of names it waits for).\n- How many people?  As many as needed, so independent tasks overlap. Say that fewer people is a different problem, and offer it as the extension.\n- Units?  Whole days, zero allowed (a milestone).\n- What is 'the bottleneck'?  Return the project length and one critical path, and also the slack of every task: 0 slack means critical. That covers the one-path and the all-tasks readings.\n- A tie between two longest chains?  Return the first in input order; slack still shows both.\n- What does the empty plan return?  Length 0, no critical path.\n\n2. Error handling\n- A loop?  CycleError that names the loop, before computing anything.\n- A wait on a task that is not there?  KeyError naming both.\n- Negative days?  ValueError.\n- A wait listed twice?  Count it once.\n\n3. Scope boundaries\n- How many tasks?  Say up to 100,000. That rules out recursion.\n- Dates, calendars, weekends, costs?  Out of scope.\n- Resource limits and re-planning when a task slips?  Out of scope for the first version; fewer people is the likely extension.",
     "why": "'As many people as needed' is the answer that makes this a longest-path problem and not a packing problem. 'Slack for every task' answers the bottleneck question in both readings with one extra pass. The tie rule makes the output the same every run.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First I ask how many people there are, because with as many as needed this is longest path, and with a fixed number it is much harder. Then what bottleneck means. I would return the length, one critical path, and the slack of each task, so both readings are covered. Then the bad plans: a loop, an unknown wait, negative days. I would like each to fail before anything is computed."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-planner-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One for the refusals, one each for start and finish, the length, the critical path, slack, determinism, size, and the empty plan.",
     "solution": "1. plan(tasks) refuses a bad plan before computing.\n   - A loop raises CycleError naming it (a -> b -> c -> a)\n   - An unknown wait raises KeyError naming both; negative days raise ValueError\n2. start[t] is the largest finish among the tasks t waits for, or 0 with none. finish[t] is start[t] + days.\n   - Test: nothing starts before everything it waits for has finished\n3. length is the largest finish. An empty plan has length 0.\n   - Test: it equals the longest chain of durations found the long way on random plans\n4. slack[t] is how many days t can slip without moving the end. It is never negative.\n5. critical is one chain of tasks whose days add up to the length, and every task on it has slack 0.\n6. Ties go to the first task in input order, so two runs give the same answer.\n7. A chain of 100,000 tasks does not hit the recursion limit.\n8. Out of scope: fixed workers, calendars, cost (workers is the extension).",
     "why": "3 is the check without an answer key: the fast length against a brute-force longest chain. 5 is two checks at once: the sum and the zero slack. 7 decides an iterative order.",
     "say": "From the answers I get eight requirements and can test each one. **The two I would not skip are the length equalling a brute-force longest chain on random plans, and the critical path summing to the length with zero slack all along.** Out of scope: calendars, cost, and a fixed number of people, which I will offer as the extension."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Here only the answer earns a class."
    },
    {
     "t": "write",
     "id": "onsite-planner-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Task: \nWait (dependency): \nDuration: \nStart, finish: \nSlack: \nCritical path: \nOrder: \nPlan (the answer): \nLoop: ",
     "hint": "The input is plain data. What is returned together and read by name may be a small class.",
     "solution": "Task: drop as a class. A dict key with a (days, waits) pair, so the data is easy to write in a test.\nWait: keep as data. The list in the pair; the reverse map users[t], the tasks that wait for t, is built once because both passes need it.\nDuration: drop. An int in the pair.\nStart, finish: keep as two dicts, filled in one pass over the order. They are the forward pass.\nSlack: keep as a dict from the backward pass: latest finish minus earliest finish.\nCritical path: drop as stored state. A list traced back from the task that finishes last, because it can be read off start and finish.\nOrder: keep as a local list. Waits first, so each pass reads values that are already final.\nPlan: keep. A small dataclass of length, start, finish, slack and critical, so the caller reads by name.\nLoop: drop. A reason to raise.",
     "why": "No class for tasks, one dataclass for the answer. The two dicts and the order are the forward pass. The reverse map is shared by the order and the backward pass, so it is built in one helper.",
     "say": "I underline the nouns. **Only the plan earns a class, because it is what the caller reads and it has five named parts.** A task is a pair, so I can write test data in one line. The order and the reverse map are the two structures that matter: the forward pass goes through the order, the backward pass goes through it in reverse, and both use the reverse map. The critical path I do not store, because I can read it off the finishes."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-planner-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "plan:\n  1.\n\n_order:\n  1.\n  Edge cases:\n\n_slack:\n  1.\n\n_critical_path:\n  1.\n",
     "hint": "Forward pass in order: start is the largest finish of the waits. Backward pass in reverse: late finish is the smallest late start of the users. The path walks back from the last finisher to a wait that ends when it starts.",
     "solution": "plan(tasks):\n  1. _check: unknown waits and negative days fail first\n  2. _order: waits first, or CycleError\n  3. Forward: for each task in order, start = the largest finish among its waits (0 if none); finish = start + days\n  4. length = the largest finish (0 if empty)\n  5. _slack: backward pass\n  6. _critical_path: trace back\n  Edge cases: a zero-day task has start equal to finish; a task with no waits starts at 0\n\n_order(tasks):\n  1. open_waits[t] = number of different tasks t waits for; users = reverse map\n  2. Queue tasks with 0 open waits, in input order\n  3. Pop, append to the order, lower the count of its users, queue at 0\n  4. Fewer in the order than tasks: raise CycleError with the loop\n  Edge case: a repeated wait counts once (set)\n\n_slack(tasks, order, finish, length):\n  1. Go through the order in reverse, so the users of a task are done first\n  2. late finish = the smallest of (late finish of a user minus the user's days); with no users, the project length\n  3. slack = late finish minus earliest finish\n  Edge case: a task with no users and not on the longest chain gets slack = length minus its finish\n\n_critical_path(tasks, start, finish):\n  1. Pick the task with the largest finish; ties go to the first in input order\n  2. While the task has a wait whose finish equals its start, step back to the first such wait\n  3. Return the steps reversed\n  Edge case: empty plan gives []",
     "why": "Slack is the quiet hero: it needs no new idea, only the same order walked backwards. And 'a wait whose finish equals my start' is the exact test for 'this wait is what held me up'.",
     "say": "**Before any code I write the steps for each function.** Forward pass, in order: a task starts when its last wait finishes. Backward pass, in reverse order: a task can finish as late as the earliest start of anything that waits for it. The difference is the slack. For the path, I start at the task that finishes last and step back to a wait that ends exactly when this task starts. That is the wait that held it up."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast where it teaches. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-planner-e1",
     "q": "Code, top-down. The Plan dataclass, then plan() with the forward pass, naming _check, _order, _slack and _critical_path.",
     "starter": "@dataclass\nclass Plan:\n    ...\n\ndef plan(tasks):\n    ...\n",
     "hint": "Order first. Then one loop over the order for start and finish. The helpers do the rest.",
     "solution": "from collections import deque\nfrom dataclasses import dataclass\n\nclass CycleError(ValueError):\n    \"\"\"The tasks wait for each other in a loop. The message names it.\"\"\"\n\n\n@dataclass\nclass Plan:\n    length: int        # days from the first start to the last finish\n    start: dict        # task -> earliest start day\n    finish: dict       # task -> earliest finish day\n    slack: dict        # task -> days it can slip without moving the end; 0 means critical\n    critical: list     # one longest chain of tasks, first to last\n\n\ndef plan(tasks):\n    \"\"\"tasks: name -> (days, [names it waits for]). Assumes as many people as you need.\n    Raises KeyError, ValueError or CycleError on bad input, before computing anything.\"\"\"\n    _check(tasks)\n    order = _order(tasks)                                   # every task after the tasks it waits for\n    start, finish = {}, {}\n    for t in order:                                         # waits come first, so their finish is known\n        days, waits = tasks[t]\n        start[t] = max((finish[w] for w in waits), default=0)\n        finish[t] = start[t] + days\n    length = max(finish.values(), default=0)\n    slack = _slack(tasks, order, finish, length)\n    return Plan(length, start, finish, slack, _critical_path(tasks, start, finish))\n",
     "why": "plan reads like the steps: check, order, forward pass, length, then the two helpers. The forward pass is four lines because the order already guarantees every wait is final.",
     "say": "I write the answer class and then plan itself, and I name the helpers before I write them. **The forward pass is one loop over the order, and it is short because the order guarantees that every wait has already finished.** Length is the largest finish. The slack and the path come from helpers that I write next."
    },
    {
     "t": "write",
     "id": "onsite-planner-e2",
     "q": "The helpers: _check, _order (and its reverse map and loop name), _slack (the backward pass) and _critical_path. Then the slow longest chain for checking.",
     "starter": "def _check(tasks):\n    ...\n\ndef _order(tasks):\n    ...\n\ndef _slack(tasks, order, finish, length):\n    ...\n\ndef _critical_path(tasks, start, finish):\n    ...\n",
     "hint": "_slack walks reversed(order) and takes a min over the users. _critical_path is a loop that stops when no wait ends at the start. The slow version is a recursive max with no memo.",
     "solution": "\n\ndef _check(tasks):\n    for t, (days, waits) in tasks.items():\n        if days < 0:\n            raise ValueError(f\"{t} has negative days: {days}\")\n        for w in waits:\n            if w not in tasks:\n                raise KeyError(f\"{t} waits for {w}, which is not a task\")\n\n\ndef _order(tasks):\n    \"\"\"Tasks with what they wait for first, by counting open waits. A loop leaves tasks over.\"\"\"\n    open_waits = {t: len(set(waits)) for t, (days, waits) in tasks.items()}   # set: a repeat counts once\n    users = _users(tasks)\n    ready = deque(t for t in tasks if open_waits[t] == 0)\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:\n            open_waits[u] -= 1\n            if open_waits[u] == 0:\n                ready.append(u)\n    if len(order) < len(tasks):\n        raise CycleError(\" -> \".join(_find_loop(tasks, open_waits)))\n    return order\n\n\ndef _users(tasks):\n    \"\"\"users[t]: the tasks that wait for t.\"\"\"\n    users = {t: [] for t in tasks}\n    for t, (days, waits) in tasks.items():\n        for w in set(waits):\n            users[w].append(t)\n    return users\n\n\ndef _find_loop(tasks, open_waits):\n    path, t = [], next(t for t, n in open_waits.items() if n > 0)\n    while t not in path:\n        path.append(t)\n        t = next(w for w in tasks[t][1] if open_waits[w] > 0)   # a left-over task waits for a left-over task\n    return path[path.index(t):] + [t]\n\n\ndef _slack(tasks, order, finish, length):\n    \"\"\"Backward pass. late[t] is the latest finish that still ends the project on time.\"\"\"\n    users = _users(tasks)\n    late = {}\n    for t in reversed(order):                                # the tasks that wait for t are done first\n        late[t] = min((late[u] - tasks[u][0] for u in users[t]), default=length)\n    return {t: late[t] - finish[t] for t in tasks}\n\n\ndef _critical_path(tasks, start, finish):\n    \"\"\"Start at the task that finishes last, then step back to a wait that ends exactly when this one starts.\"\"\"\n    if not tasks:\n        return []\n    t = max(tasks, key=lambda x: finish[x])                  # ties: the first in input order\n    path = [t]\n    while True:\n        prev = next((w for w in tasks[t][1] if finish[w] == start[t]), None)\n        if prev is None:\n            return path[::-1]\n        path.append(prev)\n        t = prev\n\n\ndef longest_slow(tasks):\n    \"\"\"Every chain, the long way, with no memory. Exponential: for checking tiny cases only.\"\"\"\n    def ending_at(t):\n        days, waits = tasks[t]\n        return days + max((ending_at(w) for w in waits), default=0)\n    return max((ending_at(t) for t in tasks), default=0)\n",
     "why": "Both passes are the same walk in opposite directions. The slow version is three lines and exponential, which is fine for a check on nine tasks.",
     "say": "The order is the counting queue again, and it also builds the reverse map. **The backward pass is the same order read backwards: a task can finish as late as the earliest late start among the tasks that wait for it.** The path steps back through exact fits. For the check I write the longest chain the long way, a recursive maximum with no memory, which is exponential and fine for nine tasks."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** plan is O(tasks + waits) time and space: one order, one forward pass, one backward pass, one trace. _critical_path is O(path length x waits per task). longest_slow is exponential in the worst case and is for checking only. schedule (the extension) is O((tasks + waits) log tasks) because of the heaps."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-planner-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: why max with a default, why set in the count, why reversed, what slack zero means, why input order breaks ties.",
     "solution": "1. Why max(..., default=0) for the start?  A task with no waits has nothing to take a maximum of. It starts at day 0.\n2. Why set(waits) in the count?  A wait listed twice would never reach zero and the task would look like part of a loop.\n3. Why is the forward pass correct in one loop?  The order puts every wait before the task, so every finish it reads is already final.\n4. Why reversed(order) for slack?  A task's late finish needs the late start of everything that waits for it. In reverse order those are done first.\n5. What does a slack of 0 mean?  Delaying that task by a day delays the whole project by a day. It sits on some longest chain.\n6. Can two chains tie, and what do you return?  Yes. critical is the first by input order; every task with slack 0 is on some longest chain, so slack shows both.\n7. Why does _critical_path compare finish[w] == start[t]?  That is the wait that ended exactly when this task began: it is what held the task up. A wait that ended earlier did not.\n8. Why default=length for a task nothing waits for?  The project ends at the length, so the latest it may finish is the length.\n9. What happens to a zero-day task?  It starts and finishes the same day and can sit on a critical path with no length of its own.\n10. What did you not test?  A chain of 100,000 for speed, and a plan with several tied critical paths for the tie rule.",
     "why": "These are the questions asked of the code on screen. The workbench has the follow-ups about fewer people, a task slipping and dates.",
     "say": "**In the review I answer from the lines on the screen.** The default is there because a task with no waits has nothing to take a maximum of. The forward pass is one loop because the order puts every wait first. Slack is the backward pass, and zero slack means the task is critical. The path compares a wait's finish with this task's start, which finds the wait that held it up. What I did not test is a long chain for speed and a tie between two longest chains."
    },
    {
     "t": "p",
     "text": "**Live extension.** In the 30-minute review the reviewer changes the problem and watches how your code takes it. Try the box first."
    },
    {
     "t": "write",
     "id": "onsite-planner-ext",
     "q": "Live extension. The reviewer says: 'You assumed as many people as needed. Now there are only w people. How long does the project take?' Write how your design takes it, then the code.",
     "starter": "def schedule(tasks, workers):\n    ...\n",
     "hint": "You already have the order, the reverse map and the open-wait counts. Add two heaps: tasks that are ready, most urgent first, and tasks running, earliest finish first. 'Most urgent' is the longest chain still behind it.",
     "solution": "Why the design takes it: the order, the reverse map and the counts of open waits are exactly what a simulation needs. The new parts are two heaps. Ready tasks sit in one, with the longest chain behind them first. Running tasks sit in another, by finish day. When someone is free, start the most urgent ready task. Then jump to the next finish, free that person and release the tasks that were waiting.\n\nThe urgent-first rule is a heuristic: with a limit on people, the best schedule is NP-hard in general. Say that, and say the guarantee: any greedy that never leaves a person idle while a task is ready takes at most total days / w + the critical path. Graham's bound says it is within a factor 2 - 1/w of the best.\n\nOn the example it prints 20 days for 1 person (the sum), 13 for 2, 11 for 3 and for 7. A better order for 2 people exists in this example (api and db first, then ui, which gives 11), so the greedy is not optimal, and it is good to say that before they find it.",
     "why": "The extension tests whether you kept the order and the counts as separate pieces. It also tests honesty: a greedy rule is a heuristic, and you name what it guarantees and what it does not.",
     "say": "**I already have the order, the reverse map and the open-wait counts, so I only add two heaps: ready tasks, most urgent first, and running tasks, by finish day.** When someone is free I start the most urgent ready task, then I jump to the next finish. This is a heuristic. With a limit on people the best schedule is a hard problem, so I say what the greedy guarantees: no more than total over w plus the critical path. And I say that on this example it is not the best."
    },
    {
     "t": "problem",
     "id": "onsite-planner-p",
     "title": "Project dependency planner",
     "source": "Mercor-style planning prompt, rebuilt (left vague on purpose)",
     "minutes": 60,
     "why": "Longest path in a DAG with a business name. The round grades whether you ask what the bottleneck is and how many people there are before you code.",
     "statement": "\"A project is a set of tasks. Each task takes some days and waits for other tasks to finish first. Work out how long the project takes, when each task can start and finish, and which tasks are the bottleneck. Refuse a plan that cannot be done.\"",
     "examples": [
      {
       "input": "design 3d; api 4d, ui 5d, db 2d wait for design; tests 3d waits for api, db; deploy 1d waits for tests, ui; docs 2d waits for nothing",
       "output": "length 11; critical: design, api, tests, deploy",
       "note": "3 + 4 + 3 + 1 = 11."
      },
      {
       "input": "slack of ui, db, docs in that plan",
       "output": "ui 2, db 2, docs 9",
       "note": "ui can slip 2 days before deploy is held up."
      },
      {
       "input": "a waits for b, b for c, c for a, d waits for nothing",
       "output": "CycleError: a -> b -> c -> a",
       "note": "Nothing is computed."
      },
      {
       "input": "an empty plan",
       "output": "length 0, no critical path",
       "note": "Say it aloud; it is a decision."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 100,000 tasks, so no recursion",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "def plan(tasks):\n    ...",
     "hints": [
      "Level 1: put the tasks in an order where each comes after the tasks it waits for. A task starts when the last of its waits finishes.",
      "Level 2: for slack, walk the same order backwards. A task may finish as late as the earliest late start among the tasks that wait for it.",
      "Level 3: the critical path starts at the task that finishes last and steps back to a wait whose finish equals this task's start. Zero slack means critical."
     ],
     "solution": "from collections import deque\nfrom dataclasses import dataclass\n\nclass CycleError(ValueError):\n    \"\"\"The tasks wait for each other in a loop. The message names it.\"\"\"\n\n\n@dataclass\nclass Plan:\n    length: int        # days from the first start to the last finish\n    start: dict        # task -> earliest start day\n    finish: dict       # task -> earliest finish day\n    slack: dict        # task -> days it can slip without moving the end; 0 means critical\n    critical: list     # one longest chain of tasks, first to last\n\n\ndef plan(tasks):\n    \"\"\"tasks: name -> (days, [names it waits for]). Assumes as many people as you need.\n    Raises KeyError, ValueError or CycleError on bad input, before computing anything.\"\"\"\n    _check(tasks)\n    order = _order(tasks)                                   # every task after the tasks it waits for\n    start, finish = {}, {}\n    for t in order:                                         # waits come first, so their finish is known\n        days, waits = tasks[t]\n        start[t] = max((finish[w] for w in waits), default=0)\n        finish[t] = start[t] + days\n    length = max(finish.values(), default=0)\n    slack = _slack(tasks, order, finish, length)\n    return Plan(length, start, finish, slack, _critical_path(tasks, start, finish))\n\n\n\ndef _check(tasks):\n    for t, (days, waits) in tasks.items():\n        if days < 0:\n            raise ValueError(f\"{t} has negative days: {days}\")\n        for w in waits:\n            if w not in tasks:\n                raise KeyError(f\"{t} waits for {w}, which is not a task\")\n\n\ndef _order(tasks):\n    \"\"\"Tasks with what they wait for first, by counting open waits. A loop leaves tasks over.\"\"\"\n    open_waits = {t: len(set(waits)) for t, (days, waits) in tasks.items()}   # set: a repeat counts once\n    users = _users(tasks)\n    ready = deque(t for t in tasks if open_waits[t] == 0)\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:\n            open_waits[u] -= 1\n            if open_waits[u] == 0:\n                ready.append(u)\n    if len(order) < len(tasks):\n        raise CycleError(\" -> \".join(_find_loop(tasks, open_waits)))\n    return order\n\n\ndef _users(tasks):\n    \"\"\"users[t]: the tasks that wait for t.\"\"\"\n    users = {t: [] for t in tasks}\n    for t, (days, waits) in tasks.items():\n        for w in set(waits):\n            users[w].append(t)\n    return users\n\n\ndef _find_loop(tasks, open_waits):\n    path, t = [], next(t for t, n in open_waits.items() if n > 0)\n    while t not in path:\n        path.append(t)\n        t = next(w for w in tasks[t][1] if open_waits[w] > 0)   # a left-over task waits for a left-over task\n    return path[path.index(t):] + [t]\n\n\ndef _slack(tasks, order, finish, length):\n    \"\"\"Backward pass. late[t] is the latest finish that still ends the project on time.\"\"\"\n    users = _users(tasks)\n    late = {}\n    for t in reversed(order):                                # the tasks that wait for t are done first\n        late[t] = min((late[u] - tasks[u][0] for u in users[t]), default=length)\n    return {t: late[t] - finish[t] for t in tasks}\n\n\ndef _critical_path(tasks, start, finish):\n    \"\"\"Start at the task that finishes last, then step back to a wait that ends exactly when this one starts.\"\"\"\n    if not tasks:\n        return []\n    t = max(tasks, key=lambda x: finish[x])                  # ties: the first in input order\n    path = [t]\n    while True:\n        prev = next((w for w in tasks[t][1] if finish[w] == start[t]), None)\n        if prev is None:\n            return path[::-1]\n        path.append(prev)\n        t = prev\n\n\ndef longest_slow(tasks):\n    \"\"\"Every chain, the long way, with no memory. Exponential: for checking tiny cases only.\"\"\"\n    def ending_at(t):\n        days, waits = tasks[t]\n        return days + max((ending_at(w) for w in waits), default=0)\n    return max((ending_at(t) for t in tasks), default=0)\n",
     "complexity": "O(tasks + waits) time and space for plan. _critical_path is O(path x waits per task). longest_slow is exponential and only a check.",
     "explain": [
      "_check rejects unknown waits and negative days before anything is computed.",
      "_order counts open waits and queues zeros. A repeated wait counts once. Leftovers mean a loop and are named.",
      "The forward loop sets start to the largest finish among the waits and finish to start + days.",
      "_slack is the backward pass: latest finish = the smallest latest start of the users, or the length for the last tasks.",
      "_critical_path starts at the last finisher and steps back to the wait that ended exactly when this task started.",
      "longest_slow tries every chain with no memory and exists only to check plan on small random plans.",
      "What the checks print: length: 11 | critical: ['design', 'api', 'tests', 'deploy'] | finish: {'design': 3, 'docs': 2, 'api': 7, 'ui': 8, 'db': 5, 'tests': 10, 'deploy': 11} | slack: {'design': 0, 'api': 0, 'ui': 2, 'db': 2, 'tests': 0, 'deploy': 0, 'docs': 9} | loop: a -> b -> c -> a | loop: a -> a | KeyError: 'a waits for zz, which is not a task'"
     ],
     "tests": "tasks = {\"design\": (3, []), \"api\": (4, [\"design\"]), \"ui\": (5, [\"design\"]), \"db\": (2, [\"design\"]),\n         \"tests\": (3, [\"api\", \"db\"]), \"deploy\": (1, [\"tests\", \"ui\"]), \"docs\": (2, [])}\np = plan(tasks)\nprint(\"length:\", p.length)\nprint(\"critical:\", p.critical)\nprint(\"finish:\", p.finish)\nprint(\"slack:\", p.slack)\nassert p.length == 11 and p.critical == [\"design\", \"api\", \"tests\", \"deploy\"]\nassert p.slack[\"ui\"] == 2 and p.slack[\"db\"] == 2 and p.slack[\"docs\"] == 9\nassert sum(tasks[t][0] for t in p.critical) == p.length\nassert plan({}).length == 0 and plan({\"a\": (0, [])}).critical == [\"a\"]\nfor bad in ({\"a\": (1, [\"b\"]), \"b\": (1, [\"c\"]), \"c\": (1, [\"a\"]), \"d\": (1, [])}, {\"a\": (1, [\"a\"])}):\n    try:\n        plan(bad)\n    except CycleError as e:\n        print(\"loop:\", e)\nfor bad in ({\"a\": (1, [\"zz\"])}, {\"a\": (-1, [])}):\n    try:\n        plan(bad)\n    except (KeyError, ValueError) as e:\n        print(type(e).__name__ + \":\", e)\n\nimport random\nrng = random.Random(21)\nfor trial in range(300):\n    n = rng.randint(1, 9)\n    names = [f\"t{i}\" for i in range(n)]\n    ts = {names[i]: (rng.randint(0, 5), [w for w in names[:i] if rng.random() < 0.3]) for i in range(n)}\n    pl = plan(ts)\n    assert pl.length == longest_slow(ts)                                   # fast equals the long way\n    assert all(pl.slack[t] >= 0 for t in ts)\n    assert sum(ts[t][0] for t in pl.critical) == pl.length                 # the path really is that long\n    assert all(pl.slack[t] == 0 for t in pl.critical)\n    assert all(pl.finish[w] <= pl.start[t] for t in ts for w in ts[t][1])   # nothing starts before its waits end\nprint(\"300 random plans: length equals the long way, critical tasks have no slack, no task starts early\")\n",
     "followups": [
      {
       "q": "How many people do you need so that nothing waits for a person?",
       "a": "The most tasks running at once in the earliest-start plan. Sweep over the start and finish days and count. For the example that is 3 at day 3: api, ui and db."
      },
      {
       "q": "A task slips by 3 days. What happens to the end?",
       "a": "If its slack is 3 or more, nothing. Otherwise the end moves by 3 minus the slack. That is the whole use of slack: you answer without re-planning. To be sure, add 3 to its days and run plan again, and compare."
      },
      {
       "q": "What if durations are uncertain?",
       "a": "Give each task an optimistic, likely and pessimistic number, plan with the mean, and report the chance a near-critical path overtakes the critical one. That is the idea behind PERT. Ask first whether they want a single number or a range."
      },
      {
       "q": "Why not a recursive longest path with memory?",
       "a": "It is shorter and also correct. At 100,000 tasks in a chain it hits Python's recursion limit. The order-based pass has no such limit and does the same work."
      },
      {
       "q": "What does the plan look like with calendar dates?",
       "a": "Keep the day numbers as they are and map them to dates at the end, skipping weekends. Do not mix calendars into the algorithm: it makes every comparison harder to test."
      },
      {
       "q": "How did you test it, with no framework?",
       "a": "Plain asserts under the code. The seven-task example by hand, one assert for each error, empty and zero-day cases, and a random check on 300 plans: length equals the brute-force longest chain, the critical path sums to the length with zero slack, no task starts before its waits finish."
      }
     ],
     "d": "hard",
     "lc": "parallel-courses-iii",
     "yt": [
      "a_NlRPnqCrg",
      "NeetCodeIO",
      12
     ]
    },
    {
     "t": "code",
     "id": "onsite-planner-ext-code",
     "title": "Live extension: only w people (runs together with the solution above)",
     "code": "import heapq\n\n\ndef schedule(tasks, workers):\n    \"\"\"Only `workers` people. Greedy: when someone is free, start the ready task with the longest chain behind it.\n    Returns (days in all, start day of each task).\"\"\"\n    if workers < 1:\n        raise ValueError(\"workers must be at least 1\")\n    _check(tasks)\n    order = _order(tasks)\n    users = _users(tasks)\n    tail = {}                                                # task -> its own days plus the longest chain after it\n    for t in reversed(order):\n        tail[t] = tasks[t][0] + max((tail[u] for u in users[t]), default=0)\n    pos = {t: i for i, t in enumerate(tasks)}                # input order breaks ties, so runs repeat\n    open_waits = {t: len(set(tasks[t][1])) for t in tasks}\n    ready = [(-tail[t], pos[t], t) for t in tasks if open_waits[t] == 0]\n    heapq.heapify(ready)\n    running, start, now, free = [], {}, 0, workers\n    while ready or running:\n        while ready and free:                                # give every free person the most urgent ready task\n            _, _, t = heapq.heappop(ready)\n            start[t] = now\n            heapq.heappush(running, (now + tasks[t][0], pos[t], t))\n            free -= 1\n        now = running[0][0]                                  # jump to the next finish\n        while running and running[0][0] == now:              # all that end now free a person and release waiters\n            _, _, t = heapq.heappop(running)\n            free += 1\n            for u in users[t]:\n                open_waits[u] -= 1\n                if open_waits[u] == 0:\n                    heapq.heappush(ready, (-tail[u], pos[u], u))\n    return max((start[t] + tasks[t][0] for t in tasks), default=0), start\n\n\ntasks = {\"design\": (3, []), \"api\": (4, [\"design\"]), \"ui\": (5, [\"design\"]), \"db\": (2, [\"design\"]),\n         \"tests\": (3, [\"api\", \"db\"]), \"deploy\": (1, [\"tests\", \"ui\"]), \"docs\": (2, [])}\ntotal = sum(d for d, _ in tasks.values())\nfor w in (1, 2, 3, 7):\n    days, st = schedule(tasks, w)\n    print(w, \"people:\", days, \"days\")\nassert schedule(tasks, 1)[0] == total and schedule(tasks, 7)[0] == plan(tasks).length\n\nimport random\nrng = random.Random(8)\nfor trial in range(300):\n    n = rng.randint(1, 10)\n    names = [f\"t{i}\" for i in range(n)]\n    ts = {names[i]: (rng.randint(0, 5), [w for w in names[:i] if rng.random() < 0.3]) for i in range(n)}\n    w = rng.randint(1, 4)\n    days, st = schedule(ts, w)\n    cp = plan(ts).length\n    assert days >= cp and days * w >= sum(d for d, _ in ts.values())       # no schedule beats these two limits\n    assert days <= sum(d for d, _ in ts.values()) / w + cp                 # list scheduling never does worse than this\n    assert all(st[x] >= st[y] + ts[y][0] for x in ts for y in ts[x][1])    # waits respected\n    for t in ts:                                                           # never more than w people at once\n        busy = sum(1 for u in ts if st[u] <= st[t] < st[u] + ts[u][0])\n        assert busy <= w\nprint(\"300 random plans with 1 to 4 people: waits respected, never more than w at once, within the known bound\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Course Schedule II",
       "d": "medium",
       "lc": "course-schedule-ii",
       "yt": [
        "Akt3glAwyfY",
        "NeetCode",
        18
       ],
       "why": "The order itself. The first pass of plan, before any durations."
      },
      {
       "n": "Find All Possible Recipes from Given Supplies",
       "d": "medium",
       "lc": "find-all-possible-recipes-from-given-supplies",
       "yt": [
        "AQrsAc3EcyQ",
        "NeetCodeIO",
        20
       ],
       "why": "A counting order with starting items and a name-to-index map. The same queue, with real-world names."
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
       "why": "Earliest finish with durations and as many people as needed. This is plan's forward pass, nearly line for line."
      },
      {
       "n": "Longest Increasing Path in a Matrix",
       "d": "hard",
       "lc": "longest-increasing-path-in-a-matrix",
       "yt": [
        "wCc_nd-GiEc",
        "NeetCode",
        18
       ],
       "why": "Longest path in a DAG you have to find first: cells are tasks, 'bigger neighbour' is the wait. Memory or an order, as here."
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
       "why": "The harder follow-up: a table carried along the order, and -1 for a loop. It is the same pass with more to carry."
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
     "text": "**What it is.** A one-way street of spots. Each car tries its preferred spot and, if it is taken, only moves forward. The question is whether everyone parks, and where. It looks like a loop, and it is one, until the input is large: then the walk forward is the cost. PracHub lists it as a Mercor question (a reconstruction, 25 Sep 2026); the round it belonged to is not stated, so practise it here and do not assume it is the solo hour."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** \"Cars arrive one at a time on a one-way street with numbered spots. Each car tries its preferred spot first and moves only forward when it is taken. Decide whether every car can park.\""
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** Each line changes the code."
    },
    {
     "t": "list",
     "items": [
      "How many spots and how many cars? Can there be more cars than spots?",
      "What happens to a car that reaches the end: it leaves, or is that an error?",
      "Is a preference always a valid spot? What if it is not?",
      "Do you return only yes or no, or the spot each car got?",
      "Can cars leave? (The live extension.)",
      "How large is the input: is walking forward spot by spot fast enough?"
     ]
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets."
    },
    {
     "t": "write",
     "id": "onsite-carpark-clarify",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- \n",
     "hint": "Spots and cars, what the output is, the end of the street, invalid preferences, departures, input size.",
     "solution": "1. Primary capabilities\n- n spots numbered 0 to n-1, m cars in arrival order, each with a preferred spot. -> yes\n- Output: the spot each car got (None if it could not park), and whether all parked. -> both\n\n2. Error handling\n- A car that runs off the end does not park; it is not an error. -> None for that car\n- A preference outside 0..n-1 is invalid input. -> raise ValueError\n\n3. Scope boundaries\n- Cars never leave in the base problem. -> departures are the extension\n- n and m up to about a million: walking forward may be too slow. -> needs the fast version",
     "why": "The end-of-street rule and the input size decide the code: one says None instead of an error, the other says the walk forward needs a shortcut.",
     "say": "**I want to pin down the output and the scale first.** Do you want yes or no, or where each car parked? And how big can this get, because walking forward spot by spot is fine for a hundred cars and not for a million."
    },
    {
     "t": "p",
     "text": "**b) Requirements.**"
    },
    {
     "t": "write",
     "id": "onsite-carpark-reqs",
     "q": "Write the requirements, numbered, each one testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Preferred spot first, forward only, None off the end, all_park, invalid input.",
     "solution": "1. Each car takes its preferred spot if free.\n2. Otherwise it takes the first free spot after it, never one before.\n3. A car with no free spot at or after its preference gets None.\n4. all_park(n, prefs) is True exactly when no car gets None.\n5. A preference outside 0..n-1 raises ValueError.\n6. Fast enough for about a million cars.\nOut of scope: cars leaving (extension), spot sizes.",
     "why": "Requirement 2 is the whole rule; requirement 6 is why the fast version exists.",
     "say": "**Six requirements; the second is the rule and the sixth is the trap.** Forward only, never back, and it has to be fast for big inputs."
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "onsite-carpark-entities",
     "q": "List the nouns. For each: keep or drop, why, and the data structure.",
     "starter": "Spot: \nCar: \nStreet: \n",
     "hint": "No class is needed. What remembers which spots are taken, and how do you find the next free one quickly?",
     "solution": "Spot: a number 0..n-1. Taken or free: a list of booleans (slow), or a next-free pointer per spot (fast).\nCar: only its preference; a number in a list. Drop as a class.\nStreet: the n spots. A function's state, not a class, in the base problem.\nNext-free pointer: nxt[i] = the first free spot at or after i, with n as 'off the end'. This is the structure that makes it fast.",
     "why": "Choosing no class is a decision to say out loud. The one structure that matters is the next-free pointer.",
     "say": "**I don't think this needs classes: it's a function over a list.** The interesting structure is a pointer per spot to the next free one, so a car can jump there."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English.**"
    },
    {
     "t": "write",
     "id": "onsite-carpark-logic",
     "q": "Write the steps for the slow version, then the fast one, then the insight about yes or no.",
     "starter": "Slow:\n1. \n\nFast:\n1. \n\nInsight:\n",
     "hint": "Slow: walk forward. Fast: union-find on 'next free'. Insight: count how many cars prefer each prefix of spots.",
     "solution": "Slow:\n1. For each car, start at its preference and step forward while the spot is taken.\n2. Take the first free spot, or None if you pass the end.\nCost: O(n x m) in the worst case (every car prefers spot 0).\n\nFast:\n1. nxt[i] starts as i for every spot, and nxt[n] = n is the end.\n2. A car finds the root of its preference: follow nxt until a spot points to itself.\n3. Compress the path so the next car jumps straight there.\n4. Taking spot s sets nxt[s] = s + 1.\nCost: about O(m + n) (union-find with path compression).\n\nInsight (n cars, n spots): everyone parks if and only if, for every k, at least k cars prefer one of the first k spots. So arrival order never changes the yes or no; only the counts do.",
     "why": "Saying the slow version and its worst case first earns the fast one. The counting insight is the line that sets you apart.",
     "say": "**First the obvious version: walk forward. Its worst case is everyone wanting spot zero, which is quadratic.** So I keep a pointer to the next free spot and compress it as I go, which is union-find. And for yes or no there's a neat fact: it only depends on how many cars want each prefix, not on the order they arrive."
    },
    {
     "t": "p",
     "text": "**e) Code.** Main function first."
    },
    {
     "t": "write",
     "id": "onsite-carpark-code",
     "q": "Write park_fast, then all_park. Name the helper, then write it.",
     "starter": "def park_fast(n, prefs):\n    ...\n",
     "hint": "A list nxt of n + 1 pointers; first_free(i) follows and compresses; taking s sets nxt[s] = s + 1.",
     "solution": "import random\n\n\ndef park_slow(n: int, prefs: list) -> list:\n    \"\"\"Spots 0..n-1 on a one-way street. Car i tries prefs[i], then only moves forward.\n    Returns the spot each car got, None for a car that could not park.\"\"\"\n    taken = [False] * n\n    got = []\n    for p in prefs:\n        if not 0 <= p < n:\n            raise ValueError(f\"no spot {p}\")\n        s = p\n        while s < n and taken[s]:          # walk forward past taken spots\n            s += 1\n        if s < n:\n            taken[s] = True\n            got.append(s)\n        else:\n            got.append(None)                # fell off the end of the street\n    return got\n\n\ndef park_fast(n: int, prefs: list) -> list:\n    \"\"\"Same rule. nxt[i] points at the first free spot at or after i (n means past the end),\n    so a car jumps straight there instead of walking spot by spot.\"\"\"\n    nxt = list(range(n + 1))                # every spot is free at first; n is the sentinel\n\n    def first_free(i: int) -> int:\n        root = i\n        while nxt[root] != root:            # follow the pointers to a free spot\n            root = nxt[root]\n        while nxt[i] != root:               # path compression: point the whole chain at it\n            nxt[i], i = root, nxt[i]\n        return root\n\n    got = []\n    for p in prefs:\n        if not 0 <= p < n:\n            raise ValueError(f\"no spot {p}\")\n        s = first_free(p)\n        if s == n:\n            got.append(None)\n        else:\n            got.append(s)\n            nxt[s] = s + 1                  # taken: the next free spot is at or after s + 1\n    return got\n\n\ndef all_park(n: int, prefs: list) -> bool:\n    return None not in park_fast(n, prefs)\n\n\ndef all_park_by_counting(n: int, prefs: list) -> bool:\n    \"\"\"The insight: for n cars and n spots, everyone parks iff, for every k,\n    at least k cars prefer one of the first k spots. Order of arrival does not matter.\"\"\"\n    if len(prefs) != n:\n        return all_park(n, prefs)\n    count = [0] * n\n    for p in prefs:\n        count[p] += 1\n    seen = 0\n    for k in range(n):\n        seen += count[k]\n        if seen < k + 1:\n            return False\n    return True\n",
     "why": "Both versions are kept so the review can compare them, and all_park_by_counting shows the insight in code.",
     "say": "**The slow one is the spec; the fast one must give the same answers.** I check them against each other on random inputs."
    },
    {
     "t": "p",
     "text": "**f) Review.**"
    },
    {
     "t": "write",
     "id": "onsite-carpark-review",
     "q": "What would the reviewer ask, line by line?",
     "starter": "",
     "hint": "Why n + 1 pointers? Why path compression? What if a preference is invalid? Prove the counting rule.",
     "solution": "Why n + 1 pointers? The extra one is 'off the end', so first_free never needs a bounds check.\nWhy compress the path? Without it, the pointers form long chains and the worst case is quadratic again.\nWhy set nxt[s] = s + 1 and not find the next free now? Lazy: the next car that needs it finds it and compresses.\nInvalid preference? Raises ValueError: a typo in the input should not silently park a car somewhere.\nWhy does order not matter for yes or no? Every spot ends up taken by someone whenever enough cars want it or an earlier spot; the counting rule depends only on the multiset of preferences. Tested by shuffling.\nHow did you test it? 500 random cases, slow against fast, counting against simulation, and a shuffle check.",
     "why": "These are the questions a reviewer asks when the code is right: why each line exists.",
     "say": "**The n plus one is the end-of-street sentinel, and compression is what keeps it fast.** I tested fast against slow on random inputs, and shuffled the arrival order to check the yes-or-no never changes."
    },
    {
     "t": "p",
     "text": "**Live extension: cars leave.** Union-find cannot un-take a spot, so the structure changes: a sorted set of free spots, where 'first free at or after p' is a search. With a balanced tree or a segment tree each arrival and departure is O(log n)."
    },
    {
     "t": "write",
     "id": "onsite-carpark-ext",
     "q": "Cars can now leave. What changes, and what is the cost?",
     "starter": "",
     "hint": "Union-find only merges. Keep the free spots sorted.",
     "solution": "import bisect\n\n\nclass Street:\n    \"\"\"Cars arrive and leave. A sorted list of free spots answers 'first free at or after p'.\"\"\"\n\n    def __init__(self, n: int):\n        self.n = n\n        self.free = list(range(n))           # sorted; a balanced tree or segment tree makes each step O(log n)\n        self.where = {}                      # car id -> spot, so leaving is one lookup\n\n    def arrive(self, car, pref: int):\n        i = bisect.bisect_left(self.free, pref)   # first free spot at or after pref\n        if i == len(self.free):\n            return None\n        spot = self.free.pop(i)\n        self.where[car] = spot\n        return spot\n\n    def leave(self, car) -> None:\n        spot = self.where.pop(car)\n        bisect.insort(self.free, spot)       # the spot is free again; later cars can take it\n\n\nst = Street(4)\nprint(st.arrive(\"a\", 1), st.arrive(\"b\", 1), st.arrive(\"c\", 1))   # 1 2 3\nst.leave(\"b\")\nprint(st.arrive(\"d\", 1), st.arrive(\"e\", 3))                       # 2 None\n",
     "why": "The extension changes the data structure, not the rule: that is the point to say.",
     "say": "**Departures break union-find, because it can only merge.** So I keep the free spots sorted and search for the first one at or after the preference: log n each way with a proper tree."
    },
    {
     "t": "problem",
     "id": "onsite-carpark-p",
     "title": "Car parking, forward only",
     "source": "PracHub reconstruction, 25 Sep 2026 (round not stated)",
     "minutes": "45",
     "d": "medium",
     "why": "Rule-following and efficient spot handling for large inputs.",
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
       "note": "Only one car wants spot 0 or earlier in the first case, but spot 0 needs a car."
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
      "Level 3: follow the pointers and compress the path (union-find); taking s sets its pointer to s + 1."
     ],
     "solution": "import random\n\n\ndef park_slow(n: int, prefs: list) -> list:\n    \"\"\"Spots 0..n-1 on a one-way street. Car i tries prefs[i], then only moves forward.\n    Returns the spot each car got, None for a car that could not park.\"\"\"\n    taken = [False] * n\n    got = []\n    for p in prefs:\n        if not 0 <= p < n:\n            raise ValueError(f\"no spot {p}\")\n        s = p\n        while s < n and taken[s]:          # walk forward past taken spots\n            s += 1\n        if s < n:\n            taken[s] = True\n            got.append(s)\n        else:\n            got.append(None)                # fell off the end of the street\n    return got\n\n\ndef park_fast(n: int, prefs: list) -> list:\n    \"\"\"Same rule. nxt[i] points at the first free spot at or after i (n means past the end),\n    so a car jumps straight there instead of walking spot by spot.\"\"\"\n    nxt = list(range(n + 1))                # every spot is free at first; n is the sentinel\n\n    def first_free(i: int) -> int:\n        root = i\n        while nxt[root] != root:            # follow the pointers to a free spot\n            root = nxt[root]\n        while nxt[i] != root:               # path compression: point the whole chain at it\n            nxt[i], i = root, nxt[i]\n        return root\n\n    got = []\n    for p in prefs:\n        if not 0 <= p < n:\n            raise ValueError(f\"no spot {p}\")\n        s = first_free(p)\n        if s == n:\n            got.append(None)\n        else:\n            got.append(s)\n            nxt[s] = s + 1                  # taken: the next free spot is at or after s + 1\n    return got\n\n\ndef all_park(n: int, prefs: list) -> bool:\n    return None not in park_fast(n, prefs)\n\n\ndef all_park_by_counting(n: int, prefs: list) -> bool:\n    \"\"\"The insight: for n cars and n spots, everyone parks iff, for every k,\n    at least k cars prefer one of the first k spots. Order of arrival does not matter.\"\"\"\n    if len(prefs) != n:\n        return all_park(n, prefs)\n    count = [0] * n\n    for p in prefs:\n        count[p] += 1\n    seen = 0\n    for k in range(n):\n        seen += count[k]\n        if seen < k + 1:\n            return False\n    return True\n",
     "tests": "print(park_fast(5, [2, 2, 0, 4, 4]))    # [2, 3, 0, 4, None]\nprint(park_fast(3, [0, 0, 0]))          # [0, 1, 2]\nprint(all_park(3, [1, 1, 2]), all_park(3, [1, 0, 0]))   # False True\n",
     "complexity": "Slow: O(n x m) worst case. Fast: about O(n + m) with path compression. The counting check is O(n).",
     "explain": [
      "The sentinel spot n means no bounds check.",
      "Path compression keeps every later car's jump short.",
      "For n cars and n spots, all park iff for every k at least k cars prefer one of the first k spots, so arrival order never changes the yes or no."
     ],
     "followups": [
      {
       "q": "Cars can leave.",
       "a": "Union-find cannot un-take a spot; use a sorted set of free spots (a balanced tree or segment tree), O(log n) per arrival or departure."
      },
      {
       "q": "Cars may also move backward when the end is full.",
       "a": "Wrap around: treat the street as a circle, nxt of n - 1 points to 0, and stop when you return to the start."
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
       "why": "Union-find warm-up: the same find with path compression."
      },
      {
       "n": "Redundant Connection",
       "d": "medium",
       "lc": "redundant-connection",
       "yt": [
        "FXWRE67PLL0",
        "NeetCode",
        17
       ],
       "why": "Union-find as the main idea, with the same find."
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
       "why": "Harder: union-find over keys you discover as you go."
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
  }
 ]
});
