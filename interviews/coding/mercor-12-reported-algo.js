/* Mercor onsite, reported prompts not yet covered. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-reported-algo",
 "n": 12,
 "flow": true,
 "title": "Reported prompts not yet covered: algorithms",
 "minutes": 150,
 "lead": "After this part you can answer four reported Mercor prompts that the earlier parts leave open: the shortest path between two users within k hops, whether every car can park when each accepts a list of spots, unique usernames in memory and on disk, and the votes and cost of a paid comparator for a target accuracy. Each goes in the order you solve it: clarify, requirements, entities, the logic in English with numbers, the code for after, the review, and what the interviewer pushes on next. The prompts are not public, so these are rebuilt from candidate reports, and each links to the chapter that covers its base.",
 "sections": [
  {
   "id": "ra-intro",
   "title": "0. What is here, and what it leaves to other chapters",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Candidates have reported four prompts for the Mercor onsite that the earlier parts do not fully cover. The prompts are not public and the wording is rebuilt from the reports, so learn the shape and not a sentence. Each problem goes in the order you solve it: clarify, requirements, entities, the logic in English with numbers, the code for after, the review, and what the interviewer pushes on next. Every code sample was run with Python 3.12 and the printed output is the real one."
    },
    {
     "t": "list",
     "items": [
      "**1. The shortest path between two users, within k hops.** The report stops mid-sentence at 'of length k or', so the first thing to ask is whether the limit is at most k or exactly k. Coding 8 chapter 3 covers the friend network through a limited API (everyone within k hops, pages, rate limits, batching). This chapter adds the path itself, the hop cap and the two cost models side by side.",
      "**2. Cars with a list of acceptable spots.** Coding 7 chapter 12 solves the forward-only street. The reported follow-up is whether every car can park when each car accepts a list of spots. That is a different problem: a search, then a matching.",
      "**3. Unique usernames.** Coding 8 chapter 4 covers check-and-insert for a million IDs and Coding 9 chapter 6 covers the Bloom filter. This chapter covers what is new for names: two spellings of one name, two registrations at once, and reserved names.",
      "**4. A paid comparator that is right 90 percent of the time.** Coding 8 chapter 1 has the full treatment. This chapter keeps only the planning question: given a target accuracy, how many votes, and what does it cost in calls."
     ]
    },
    {
     "t": "p",
     "text": "**How to use it.** Say each answer aloud before you open the solution. The talk-only round is described in Coding 8 chapter 0: three minutes of clarifying, the slow answer with its cost as a number, one improvement with its new number, a small example, then change the goal."
    }
   ]
  },
  {
   "id": "ra-paid",
   "title": "4. A paid comparator, planned from a target accuracy",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** There is a hidden order over n items. You have a call before(a, b) that is right 90 percent of the time and costs one cent. Sort the items, or find the best one, and tell me the algorithm, how accurate it is and what it costs. Reported variants: part 1 is one call per comparison (what is fatal, how does accuracy change as n grows), part 2 repeats and votes to get the same accuracy for fewer calls, and the follow-up is what happens if the same pair always gets the same answer."
    },
    {
     "t": "skim",
     "clarify": [
      [
       "Random or repeatable errors?",
       "Random: a fresh coin each ask, so voting works. Repeatable: back to ranking by wins."
      ],
      [
       "Accurate means what?",
       "The whole order, the best one, or the top k. Each needs a different number of correct comparisons."
      ],
      [
       "What chance of any mistake is allowed?",
       "A number like 5 percent. It sets the votes per comparison."
      ],
      [
       "Is 90 percent the same for every pair?",
       "If close items are worse, spend the votes there."
      ]
     ],
     "road": [
      [
       "One call per comparison fails as n grows.",
       "A sort makes about n log2 n decisions; at 10 percent each, some are wrong."
      ],
      [
       "Vote to cut the error.",
       "A majority of m asks is a binomial tail: 3 asks give 0.028, 5 give 0.0086, 15 give 0.000034."
      ],
      [
       "Union bound sets m.",
       "With c decisive comparisons, make each wrong with chance at most delta / c."
      ],
      [
       "Count the decisive comparisons.",
       "A full sort needs about n log2 n, the best item about log2 n. At n = 64: 4,992 cents against 441."
      ],
      [
       "Spend where it matters.",
       "For top k, vote hardest near the boundary."
      ]
     ],
     "cost": "sort n ceil(log2 n) comparisons x m votes · best item n - 1 matches x m · each extra pair of votes cuts the error by about a third",
     "limit": "Voting needs fresh errors. If the same pair always answers the same, more cents buy nothing."
    },
    {
     "t": "table",
     "head": [
      "Ask",
      "If they say",
      "Then I"
     ],
     "rows": [
      [
       "Random or repeatable errors?",
       "Random, a fresh coin each ask",
       "Vote. Majority of m asks, m odd, with m chosen from the budget formula."
      ],
      [
       "",
       "Same pair, same answer",
       "Voting does nothing. Compare each item with many others and rank by win count (chapter 3)."
      ],
      [
       "What does accurate mean?",
       "The whole list exactly right",
       "About n log2 n comparisons must all be right. n = 64, delta 5 percent: 13 votes, 4,992 cents."
      ],
      [
       "",
       "The best one right",
       "A bracket: only the best item's own matches matter, about log2 n of them. n = 64: 7 votes, 441 cents."
      ],
      [
       "",
       "The top k",
       "A bracket, then replay one path per next winner: about (n-1) + (k-1) log2 n matches, each voted. I would size delta over roughly k log2 n decisive matches."
      ],
      [
       "",
       "Mostly sorted is fine",
       "One vote, merge sort, about n log2 n cents. I report the fraction of pairs in order, not an exact guarantee."
      ],
      [
       "What is the budget?",
       "A fixed number of cents",
       "Work backwards: cents divided by comparisons gives the votes, the votes give the per-pair error. If the budget is below the plan, I say the accuracy I can actually reach."
      ],
      [
       "What chance of any mistake?",
       "A number like 5 percent",
       "That is delta. Per comparison I allow delta divided by the number of comparisons that matter."
      ],
      [
       "Is 90 percent the same for every pair?",
       "Yes",
       "Plan with 0.9 and say near-equal items are likely worse."
      ],
      [
       "",
       "No, close items are worse",
       "Measure accuracy on pairs of known order, by gap, and plan with the worst gap I care about."
      ],
      [
       "Is wall time a cost too?",
       "Yes",
       "Batch each bracket round into parallel calls. Wall time is rounds, not calls."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Voting turns a 10 percent error into a tiny one, and the exact chance is a binomial tail. A majority of 1 ask is wrong 0.1 of the time, 3 asks 0.028, 5 asks 0.0086, 15 asks 0.000034. Each extra pair of votes cuts the error by about a third. Then decide which comparisons must be right. A union bound says: if each of c decisive comparisons is wrong with chance at most delta divided by c, some one is wrong with chance at most delta. A full sort has about n log2 n of them. The best item has only about log2 n. That gap, 4,992 cents against 441 at n = 64, is the answer to the budget question."
    },
    {
     "t": "write",
     "id": "ra-pd-clarify-w",
     "q": "Try it first. Write your questions, each with the answer you expect.",
     "starter": "1. \n2. \n3. \n4. ",
     "hint": "Random or repeatable errors; what accurate means; what is paid; the size.",
     "solution": "Is the error random, a fresh coin each ask? Likely yes here. If the same pair always gets the same answer, voting does nothing.\nWhat does accurate mean: the whole list exact, or the best one? It changes the votes a lot.\nWhat chance of any mistake is allowed? A number like 5 percent, which I call delta.\nIs 90 percent the same for every pair, and how many items? Likely the same, hundreds to thousands.",
     "say": [
      "**I ask whether the errors are random, what accurate means, and how much risk of a mistake is allowed.** Those three set every number I give."
     ]
    },
    {
     "t": "problem",
     "id": "ra-paid-p",
     "title": "Votes and cents for a target accuracy",
     "source": "Core of the paid-comparator answer, run with Python 3",
     "d": "medium",
     "minutes": 25,
     "why": "The error of a majority, the votes that reach a target, two planners and a simulation that checks the plan.",
     "statement": "Given n items, a call that is right with chance p, and a target delta, return the votes per comparison and the cents for (a) the whole list sorted and (b) the best one found. Check (b) by simulation.",
     "examples": [
      {
       "input": "n = 64, p = 0.9, delta = 0.05",
       "output": "whole list: 13 votes, 4,992 cents; best one: 7 votes, 441 cents",
       "note": "The measured success of the bracket at 7 votes is above 95 percent."
      }
     ],
     "constraints": [
      "standard library only",
      "errors are independent, a fresh coin each ask"
     ],
     "starter": "def votes_needed(p, err):\n    ...\n",
     "hints": [
      "A majority of m is wrong when at most m // 2 asks are right: a sum of binomial terms.",
      "Divide delta by the number of comparisons that must all be right."
     ],
     "solution": "from math import ceil, comb, log2\nimport random\n\n\ndef p_wrong_majority(p, m):\n    \"\"\"Chance that a majority of m asks (m odd) is wrong, each ask right with chance p.\"\"\"\n    return sum(comb(m, r) * p ** r * (1 - p) ** (m - r) for r in range(m // 2 + 1))\n\n\ndef votes_needed(p, err):\n    \"\"\"Smallest odd m whose majority is wrong with chance at most err.\"\"\"\n    m = 1\n    while p_wrong_majority(p, m) > err:\n        m += 2\n    return m\n\n\ndef plan_sort(n, p, delta):\n    \"\"\"Whole list right with chance >= 1 - delta. Merge sort makes at most c comparisons;\n    if each is wrong with chance <= delta / c, some one is wrong with chance <= delta (union bound).\"\"\"\n    c = n * ceil(log2(n))\n    m = votes_needed(p, delta / c)\n    return m, c * m\n\n\ndef plan_best(n, p, delta):\n    \"\"\"Best one right with chance >= 1 - delta. The best item plays only ceil(log2 n) bracket matches.\"\"\"\n    m = votes_needed(p, delta / ceil(log2(n)))\n    return m, (n - 1) * m\n\n\ndef bracket_best(items, less):\n    alive = list(items)\n    while len(alive) > 1:\n        nxt = [a if less(a, b) else b for a, b in zip(alive[::2], alive[1::2])]\n        alive = nxt + (alive[-1:] if len(alive) % 2 else [])\n    return alive[0]\n\n\ndef paid_api(p=0.9, seed=0):\n    rng, spent = random.Random(seed), [0]\n    def before(a, b):\n        spent[0] += 1                              # one cent an ask\n        return (a < b) if rng.random() < p else (a >= b)\n    return before, spent\n\n\ndef voted(before, m):\n    return lambda a, b: sum(before(a, b) for _ in range(m)) * 2 > m",
     "complexity": "votes_needed loops over odd m and each m sums O(m) terms. Merge sort uses at most n ceil(log2 n) comparisons; the bracket uses n - 1 matches.",
     "explain": [
      "The measured 98 percent beats the planned 95 because the union bound allows for every decisive comparison being wrong together, so the plan is safe and a little wasteful.",
      "paid_api counts one cent per ask and returns a fresh coin each time, so voting is legitimate."
     ],
     "tests": "for m in (1, 3, 5, 15):\n    print(\"majority of\", m, \"wrong:\", round(p_wrong_majority(0.9, m), 6))\nfor n in (64, 1000):\n    print(\"n =\", n, \"(votes, cents): whole list\", plan_sort(n, 0.9, 0.05), \"| best one\", plan_best(n, 0.9, 0.05))\n\nm, _ = plan_best(64, 0.9, 0.05)\nhits = cents = 0\nfor seed in range(1000):\n    before, spent = paid_api(seed=seed)\n    # \"a is ahead of b\" means a is larger here; less() says the first argument wins\n    hits += bracket_best(list(range(64)), voted(lambda a, b: before(b, a), m)) == 63\n    cents += spent[0]\nprint(\"bracket, planned votes:\", m, \"| found the best in\", hits / 10, \"% of 1000 runs | average cents\", cents / 1000)"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "majority of 1 wrong: 0.1\nmajority of 3 wrong: 0.028\nmajority of 5 wrong: 0.00856\nmajority of 15 wrong: 3.4e-05\nn = 64 (votes, cents): whole list (13, 4992) | best one (7, 441)\nn = 1000 (votes, cents): whole list (19, 190000) | best one (7, 6993)\nbracket, planned votes: 7 | found the best in 98.0 % of 1000 runs | average cents 441.0"
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
       "Same accuracy for fewer cents?",
       "Vote sequentially: keep asking until one answer leads by 3, so easy pairs stop early. Or give more votes in the late rounds, where few matches are left.",
       "Cheaper on average. Coding 8 chapter 1 has the numbers: 4,859 cents against 6,464 with five fixed votes."
      ],
      [
       "The budget is 1,000 cents for n = 64",
       "The best one fits (441). The whole list does not (4,992). I give the best one exactly and a one-vote sort at about 384 cents, mostly sorted.",
       "Accuracy is stated, not promised."
      ],
      [
       "Same pair, same answer",
       "Voting is useless. Compare against many different items and rank by wins.",
       "n(n-1)/2 calls for all pairs."
      ],
      [
       "Not 90 percent for every pair",
       "Measure by gap on known pairs, plan with the worst gap I care about.",
       "A calibration run of paid calls."
      ],
      [
       "n grows",
       "Whole list: votes grow with log n and calls with n log n, so cost grows like n log squared n. Best one: close to linear.",
       "n = 1,000: 19 votes, 190,000 cents for the list; 7 votes, 6,993 for the best."
      ],
      [
       "Calls are slow",
       "Batch every match of a bracket round into one parallel step.",
       "Same cents, wall time is the number of rounds."
      ],
      [
       "A call can fail or time out",
       "Retry without paying twice: key the request by the pair so a retry is free.",
       "A small cache or an idempotency key."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "Why an odd number of votes?",
       "a": "**Decided.** m is odd.\n\n**Instead of.** Four or six votes.\n\n**Why.** No ties. An even count needs a rule for a split, and the extra vote buys almost nothing.\n\n**What it costs.** Cost steps by two votes, not one.\n\n**If they push.** An even count is fine if one more ask breaks ties."
      },
      {
       "q": "Why divide delta by the number of comparisons?",
       "a": "**Decided.** A union bound over the comparisons that must be right.\n\n**Instead of.** Aiming for delta on each one.\n\n**Why.** The list is right only if every decisive comparison is right. If each fails with chance at most delta over c, the chance that some one fails is at most delta.\n\n**What it costs.** It is safe and a little wasteful: the measured success was 98 percent against a 95 percent plan.\n\n**If they push.** A tighter bound is possible, but it needs more careful counting for little gain."
      },
      {
       "q": "Why is the best one so much cheaper?",
       "a": "**Decided.** Only the best item's matches can lose it, about log2 n.\n\n**Instead of.** Sorting everything.\n\n**Why.** A full sort needs about n log2 n comparisons all right, so the allowed error per comparison is far smaller and the votes are higher.\n\n**What it costs.** None, as long as I only need the best.\n\n**If they push.** Top k sits between the two: about k log2 n decisive matches."
      },
      {
       "q": "Why a bracket, not a scan for the best?",
       "a": "**Decided.** A knockout bracket.\n\n**Instead of.** Walking the list and keeping the champion.\n\n**Why.** Both use n-1 matches. In a scan the champion plays up to n-1 of them, so the best item has up to n-1 chances to lose. In a bracket it plays only about log2 n.\n\n**What it costs.** The same n-1 matches.\n\n**If they push.** Odd ones out get a bye."
      },
      {
       "q": "Is 90 percent the accuracy of the sort?",
       "a": "**Decided.** No, I never say that.\n\n**Instead of.** Reporting 90 percent.\n\n**Why.** One wrong comparison can break an exact order. With one vote the chance that all of them are right is about 0.9 to the power of the comparison count.\n\n**What it costs.** I always state what accurate means before giving a number.\n\n**If they push.** If they want a soft measure, report the fraction of pairs in order."
      },
      {
       "q": "What if the asks are not independent?",
       "a": "**Decided.** I check the claim before I rely on it.\n\n**Instead of.** Assuming a fresh coin.\n\n**Why.** If an ask repeats the same answer, votes buy less than the formula says. A short repeat test shows it.\n\n**What it costs.** A calibration run.\n\n**If they push.** If it turns out fixed, I switch to ranking by wins."
      },
      {
       "q": "What I would do with another hour",
       "a": "**Decided.** Calibrate p by gap and add the sequential vote.\n\n**Instead of.** More theory.\n\n**Why.** Real comparators are worse on close items, and early stopping is where the money is.\n\n**What it costs.** Time and more calls to calibrate.\n\n**If they push.** A test that the planned cost matches the measured average, as in the output above."
      }
     ]
    }
   ]
  }
 ]
});
