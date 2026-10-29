"""Amazon, Software Development Engineer (new grad, L4 shape), via Amazon Student Programs. The loop: four 60-minute
virtual rounds (2 coding, 1 object-oriented design, 1 behavioral / Bar Raiser), in a window from 2 November 2026; you
offered 6, 9, 10 or 11 November on 21 October; on 22 October they scheduled Monday 9 and Tuesday 10 November. Last year (2025) you cleared this pipeline's three-round loop.

This page is the wildcard's weeks 6 and 7: the day-by-day plan (Plan), two problems a day with the topic hidden (Daily
two, from interviews/coding/amazon-daily-*.js), the object-oriented design kit (LLD, from amazon-lld-*.js), the
leadership principles and the story bank (Leadership; the stories themselves live in the gitignored
private/loops/amazon.js because they hold alfred_ internals and your words), and a printable loop-day card. Weeks 4
and 5 of milestone 1 stay as they are; their two mathematics sessions are scheduled on weekends here.

Facts about the loop come from the research dossier you sent on 21 October 2026 (amazon-sde-loop-2026-research.html)
and from SOURCES, every link opened 21 October 2026. Logistics answers (location, pay, work authorization, start date)
stay in chat.
"""

LOOP = {
    "id": "amazon",
    "title": "Amazon, Software Development Engineer",
    "company": "Amazon",
    "subtitle": "The loop: four rounds, Monday 9 and Tuesday 10 November",
    # #FF9900 is Amazon's orange (its logo smile); a lighter tone for dark mode.
    "brand": "#FF9900", "brand_dark": "#FFB84D",
    "when_iso": "2026-11-09",
    "when": "Monday 9 and Tuesday 10 November 2026, on Zoom with LiveCode; exact times confirmed no later than two business days before",
    "who": "Four interviewers, one of them a Bar Raiser from outside the team (Amazon does not say which). Scheduling through Amazon Student Programs.",
    "format": ("Four 60-minute rounds on Zoom, coding in Amazon LiveCode (the interviewer sees the editor live, no screen share), often with no way to run code. "
               "Not confirmed for your loop: two coding rounds are near certain; the other two are the Bar Raiser and one of an object-oriented design round, "
               "a GenAI round (leadership questions, GenAI concepts, then a LeetCode problem) or a hiring-manager round with GenAI questions. "
               "Leadership principle questions in every round. No AI tools."),
    "bar": ("A medium solved to working, dry-run code in 25 to 30 minutes while talking, then two more layers of follow-up; "
            "GenAI answers drawn from what you built; a design you can extend without rewriting; and eight deep, true stories that survive five layers of why."),
    "plan_kicker": "The next two weeks",
    "extra": ("<b>Start with the Plan tab: it says what to do today.</b> Every day has the daily two (35 minutes), a problem "
              "reported from a 2026 loop, a module of the GenAI tab, and a story or a design. Two to three hours a day until 31 October, "
              "four or more from 1 November."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, why Amazon, the AI-tools answer, last year, and the questions to ask. The GenAI round has its own tab; the stories are on Leadership."

SHOW_UP = [
    ("Think out loud from the first second.", "Silence is the most reported way to fail a coding round. Say the brute force, get a nod, then improve. A 2026 candidate froze for five minutes, coded the brute force, found the better answer late, and still got the offer."),
    ("Clarify first, and say you are doing it.", "Input size, duplicates, empty input, sorted or not, what to return. In the design round, the requirements are often not given on purpose: asking for them is part of the score."),
    ("Dry-run before you say done.", "There may be no way to run code. Walk a small example through your code out loud, then state time and space without being asked."),
    ("Expect three layers.", "After the solve: make it faster, change a constraint (a stream, duplicates, out-of-order times), then justify. That is where rounds are won."),
    ("Spend each story once.", "Interviewers compare notes. Keep the matrix on the Loop day card and cross off what you used."),
    ("GenAI questions: answer from what you built.", "If a round turns to GenAI, it is talk, not code: hallucinations, RAG, how you check AI output, how you use the tools. Give the mechanism, then what you did and the number. The coding in that round is still LeetCode."),
    ("No AI, anywhere.", "Amazon's rule for the live rounds. If an interviewer asks how you use AI tools at work, answer it as a conversation; never open one."),
]

STORY_BLURB = "Your intro, why Amazon, the AI-tools question, last year, and logistics."

# Every outside link opened 2026-10-21 and 2026-10-29. Medium and LeetCode refuse scripted requests; the 2026 reports below
# were read through a text reader on 29 Oct and their round breakdowns checked against what they say.
SOURCES = [
    {"label": "Amazon: how we hire", "url": "https://www.amazon.jobs/content/en/how-we-hire",
     "why": "The official shape: four to six interviews of 45 to 60 minutes, the Bar Raiser, the leadership principles, STAR."},
    {"label": "Amazon: leadership principles", "url": "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
     "why": "The sixteen, in Amazon's words."},
    {"label": "Amazon: SDE 2026 (US) posting", "url": "https://www.amazon.jobs/en/jobs/3177934/software-development-engineer-2026-us",
     "why": "The role asks you to use and build GenAI tools for developer productivity: why GenAI questions appear at all."},
    {"label": "Amazon: software development interview topics", "url": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
     "why": "Object-oriented design is on Amazon's own topic list; generative AI is not named there."},
    {"label": "A 2026 university-hire loop with a GenAI round", "url": "https://medium.com/@kamaan551/amazon-sde-1-interview-experience-2026-all-4-rounds-the-new-genai-round-and-a-1-month-wait-208de067d1d4",
     "why": "Final round May 2026: rotting oranges; Course Schedule II and domino tiling; a hybrid round of Ownership and Dive Deep stories, GenAI concepts and Next Permutation; a Bar Raiser with a Celebrity variant. No design round."},
    {"label": "An AUTA SDE I loop, April 2026", "url": "https://leetcode.com/discuss/post/8430457/amazon-sde-1auta-interview-experience-20-eqxs/",
     "why": "Coding with a heap; a streaming logger design (Chain of Responsibility); a hiring-manager round of GenAI questions then Merge and Insert Interval; a Bar Raiser of seven or eight LP questions."},
    {"label": "A 2026 SDE I loop with a GenAI fluency round", "url": "https://leetcode.com/discuss/post/7623949/amazon-sde-1-application-interview-exper-92xt/",
     "why": "The round labelled GenAI was a LeetCode problem: all nodes at distance K, in O(n). Offer."},
    {"label": "A 2026 SDE I loop with a file-system design", "url": "https://medium.com/@shivam.edu4348/amazon-sde-1-interview-experience-182cf3f46460",
     "why": "October 2026: design a file management system with no requirements given; a hiring-manager round on how he used GenAI."},
    {"label": "A 2026 SDE I offer with a cart design", "url": "https://medium.com/@guptasameer533/how-i-cracked-amazon-sde-1-off-campus-in-2026-my-interview-experience-75c3dd67e844",
     "why": "August 2026: a shopping cart with percentage, flat and no discount, scored on SOLID and code quality. No GenAI questions."},
    {"label": "Hello Interview: Amazon L4 (SDE I) guide", "url": "https://www.hellointerview.com/guides/amazon/l4",
     "why": "For L4 the design interview covers object-oriented design instead of large-scale systems."},
    {"label": "TechPrep: Amazon interview process", "url": "https://www.techprep.app/blog/amazon-interview-process",
     "why": "System design is aimed at SDE II and above; at SDE I the design round tends to be object-oriented."},
    {"label": "ITPro: Amazon's AI rule for interviews", "url": "https://www.itpro.com/business/careers-and-training/amazon-bans-ai-tools-during-job-interviews",
     "why": "Press report of Amazon's guidance: no GenAI tools in interviews unless explicitly permitted."},
    {"label": "Lodely: Amazon interview questions", "url": "https://www.lodely.com/companies-interview-questions/amazon",
     "why": "181 tracked questions: about 78% medium; trees, graphs and heaps lead."},
    {"label": "Stackademic: a 2025 new-grad loop", "url": "https://stackademic.com/blog/my-amazon-software-development-engineer-new-grad-interview-experience",
     "why": "Strong technical rounds, rejected on story depth: the post-mortem behind 'treat LP as half'."},
]

COMPANY = [
    "Your loop is four rounds of 60 minutes, and Amazon has not said what each one is. Two coding rounds and a Bar Raiser are near certain. The fourth varies across the 2026 reports: an object-oriented (low-level) design round in some, a GenAI round in the closest match to your pipeline (leadership questions, then GenAI concepts, then a LeetCode problem), a hiring-manager round with GenAI questions in others. No 2026 SDE I report had a full high-level system design round. So the plan is DSA first, then GenAI answers, then design, with stories in every round. One line to your recruiter can settle the fourth slot.",
    "Leadership principles are about half the decision. Each interviewer is assigned two or three principles; coding rounds spend 10 to 15 minutes on them, the behavioral round all of it, with each story probed for five to ten minutes. One interviewer is a Bar Raiser from outside the team, who can run any round and whose view carries the most weight in the debrief.",
    "Coding: about 78% of tracked Amazon questions are medium, often dressed as an Amazon scenario (product categories as a tree, delivery routes as a graph). Trees, graphs and heaps lead, then hash-map designs (LRU, time-based store), stacks, greedy, and dynamic programming when it lands. A fast, clean medium often earns a harder second problem.",
    "No AI tools in any live round: Amazon's guidance forbids them unless explicitly permitted, and a former Bar Raiser told GeekWire that using one gets you no-hired. The only AI-assisted task was in the online assessment, which is behind you. GenAI questions are another matter: most 2026 SDE I reports had them, as a round or 15 to 20 minutes of one. They are talk, not code: hallucinations, RAG, how you check AI output, how you use the tools, a time a tool got it wrong. Prep has the GenAI round question by question.",
]

POSTING = {
    "url": "https://www.amazon.jobs/content/en/how-we-hire",
    "label": "Amazon: how we hire",
    "lead": "Software Development Engineer, new grad, through Amazon Student Programs: the L4 (SDE I) loop.",
    "facts": [["Rounds", "4 x 60 minutes over 9 and 10 November, Zoom and LiveCode"], ["Coding", "2 rounds, medium with harder follow-ups"],
              ["The fourth round", "Not confirmed: object-oriented design, GenAI, or the hiring manager with GenAI questions"], ["Behavioral", "The Bar Raiser, plus LP in every round"],
              ["GenAI", "Concepts and your own use of the tools, talked through"], ["AI tools", "Not allowed"]],
    "does": [
        "Solve medium problems in a shared editor, talking, and dry-run them without running code.",
        "Explain how LLMs fail and how you build and check systems around them, from your own work.",
        "If there is a design round: design classes for a concrete system (parking lot, file system, cart) and extend them.",
        "Tell true stories with your own actions and numbers, and hold up under follow-ups.",
    ],
    "wants": [
        "Clean, working code and stated complexity.",
        "Requirements asked for, not assumed.",
        "Ownership, customer obsession, diving deep, backbone: in stories, not adjectives.",
    ],
}

ROUNDS = [
    {"title": "2026 loop: four rounds",
     "when": "Monday 9 and Tuesday 10 November 2026 (scheduled 22 October; times to come)",
     "who": "Four interviewers, one a Bar Raiser",
     "format": "Coding, coding, the Bar Raiser, and one of: object-oriented design, a GenAI round, or the hiring manager with GenAI questions (not confirmed). LP in every round.",
     "outcome": "Not yet held.",
     "notes": ["From the invitation: GenAI tools not allowed unless explicitly permitted.",
               "From the scheduling email (22 Oct): you may be asked about your experience with GenAI tools. Prepare a few examples: the situation, what went well, what you would do differently, and how it changed your outcome or speed.",
               "Zoom on the device you will use (camera, headphones); a waiting room of up to 10 minutes. LiveCode: open the link from the email, wait for the interviewer to open the session, refresh; turn the ad blocker off.",
               "Research, 29 Oct: across about fifteen 2026 SDE I reports, every loop had coding and a Bar Raiser; GenAI questions appeared in most (a full round in the closest match to your pipeline, 15 to 20 minutes of a hiring-manager round in others) and their coding was always LeetCode; a design round appeared in some, always object-oriented (file system, cart with discounts, a logger). Ask the recruiter which the fourth slot is."],
     "asked": []},
    {"title": "2025 loop: three rounds",
     "when": "2025",
     "who": "Three interviewers; by your account the first was a Bar Raiser",
     "format": "Three one-hour rounds on Chime and LiveCode: one half behavioral, half coding or design; one pure leadership deep-dive; one object-oriented design.",
     "outcome": "Cleared the technical bar; the offer was lost to layoffs, per the dossier. Confirm the wording you want to use.",
     "notes": ["Your behavioral prep from last year (Amazon Behavioral Interview Preparation, PDF, August 2025) had eight story groups; they are candidates in the story bank, to be retold in your words."],
     "asked": []},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "The start of most rounds; the Bar Raiser may skip it.",
     "probes": ["What do you own at alfred_?", "What are you proudest of?"],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end, and that's a big part of why I'm excited about Amazon: building for customers at a scale where every decision shows up."],
     "swaps": [{"when": "In a coding round, keep it to two sentences", "line": "I'm a founding LLM engineer at alfred_, an AI assistant with 5,000-plus users; I own the agent's reliability, memory and evaluation. Before that, WheelPrice and research at UIC."}],
     "land": "Production systems end to end, and why Amazon: customers at scale.",
     "notes": ["The first paragraph and the first two sentences of the second are yours from INTRO.md, unchanged. The last clause is new for Amazon: make it yours."]},
    {"id": "why-amazon", "title": "Why Amazon?", "length": "about 30 seconds",
     "when": "Possible in any round, often the hiring manager.",
     "probes": ["Why not stay at a startup?", "Which team would you want?"],
     "vname": "A",
     "say": [
         "Two reasons. I've spent the last year owning systems end to end at a startup, and what I want next is to do that at a scale where the engineering bar is the product: where a design gets reviewed hard, and a mistake reaches millions of people, so you learn to build it right.",
         "And the way Amazon works, writing things down, owning what you ship, working backwards from the customer, is already how I try to work. I'd like to learn it from people who do it best."],
     "variants": [
         {"name": "B, the customer", "land": "Customer obsession at a scale you cannot get anywhere else.",
          "say": ["Honestly, the customer part. At alfred_ I've seen how much one small change in reliability changes how people trust a product, with a few thousand users. Amazon is that lesson at a scale nobody else has.",
                  "I want to be an engineer who's had to build for that, and I think the bar here would make me better faster than anywhere."]},
         {"name": "C, last year", "land": "You came this far before; you want to finish it.",
          "say": ["I went through this process last year, and the interviews were the part I enjoyed most: the depth of the follow-ups, the way the questions were about what I actually did.",
                  "Since then I've owned a production AI system end to end, and I'd like to bring that here."]}],
     "land": "Scale and a hard engineering bar, and a way of working you already share.",
     "notes": ["Written in your voice; INTRO.md has no Amazon line. Make it yours. Version C only if last year comes up naturally."]},
    {"id": "ai-tools", "title": "How do you use AI tools in your development work?", "length": "about 60 seconds",
     "when": "Reported in some 2026 hiring-manager rounds. A conversation; never open a tool.",
     "probes": ["Where do they fail?", "How do you check what they write?", "Would you trust AI-written code in production?"],
     "say": [
         "Every day, but as a tool I check, not an author I trust. I use coding agents for the parts that are well specified: a migration, a test scaffold, a refactor I've already decided on. I read every diff, and nothing ships without tests or a real run against production-shaped data.",
         "Where they fail is the same place my own agent at work fails: they're confident about things they never checked. They'll say a function exists or a test passed when it didn't. So I ask for evidence, the command and its output, and I keep the design decisions myself.",
         "Building an AI product also taught me to measure it like a product: an eval set of real cases before a change ships, not a vibe check."],
     "land": "AI speeds up the well-specified parts; the design and the checking stay yours.",
     "notes": ["Your own practice; adjust to what you actually do. Never offer to use AI in the loop."]},
    {"id": "last-year", "title": "You interviewed with us last year. What happened?", "length": "about 20 seconds",
     "when": "Possible if an interviewer sees your history.",
     "probes": ["What did you learn from it?"],
     "say": [
         "I did the loop last year and it went well, but the role was affected by headcount changes, so it didn't turn into an offer. Since then I've been a founding engineer on a production AI product, and I'm glad to be back."],
     "land": "Brief, factual, forward.",
     "notes": ["From the dossier: you cleared the technical bar and lost the offer to layoffs. Confirm the exact facts and wording before you use this."]},
    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "If asked.",
     "probes": [],
     "say": [
         "I’m not looking to leave because there’s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent — evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome. Amazon seems particularly aligned with that."],
     "vname": "Yours",
     "variants": [
         {"name": "B, the bar", "land": "From a startup's speed to a large company's engineering bar.",
          "say": ["Nothing's wrong at alfred_. I've owned a lot of the system there, and moved fast. What I want next is the other half: building at a scale and with a review bar where the craft gets pushed, by people who've done it for years."]}],
     "land": "Not away from alfred_; toward scale and a harder bar.",
     "notes": ["Your words from INTRO.md; only the company name changed."]},
    {"id": "logistics", "title": "Logistics they may ask", "length": "a line each",
     "when": "Usually the recruiter, not the loop. Your answers are in chat, not on this page.",
     "probes": ["Location?", "Start date?", "Work authorization?"],
     "say": [],
     "land": "One sentence each.",
     "notes": ["Location, start date, work authorization: your answers from chat."]},
]

QA = []  # the GenAI round lives on the GenAI tab: interviews/amazon.learn.json
TABS = ["overview", "plan", "daily", "learn", "lld", "lp", "prep", "rounds", "card"]

ASK_3C = [
    {"id": "clarify", "title": "In the round: clarifying", "when": "At the start of every problem and design. Short, on the problem.",
     "why": "Clarifying is scored. It also stops you solving the wrong problem.",
     "how": ["Input size and range; duplicates; empty input; sorted or not; ties; what exactly to return.",
             "Design round: actors, core use cases, scale, concurrency, money, what is out of scope."],
     "items": [
         {"to": "Interviewer", "q": "Before I start, can I check the input: how large can it get, can values repeat, and what should I return if it's empty?",
          "loop": "Every coding problem.", "why": "Three facts that change the solution."},
         {"to": "Interviewer", "q": "Who uses this system, and what are the two or three things they must be able to do? What can I leave out for now?",
          "loop": "The design round, first minute.", "why": "Eliciting requirements is the test when none are given."}]},
    {"id": "collab", "title": "At the end of a round: about the work", "when": "When they ask for your questions. One.",
     "why": "Shows you want the job, not only the offer.",
     "how": ["Ask one, listen, and say in a sentence what you would bring."],
     "items": [
         {"to": "Any interviewer", "q": "What's a problem your team is working on right now that you find interesting?",
          "loop": "Coding rounds.", "why": "Engineers like talking about their work."},
         {"to": "Hiring manager", "q": "What does a new engineer on your team own in the first six months?",
          "loop": "If the manager runs a round.", "why": "The real job."},
         {"to": "Any interviewer", "q": "How do you decide when something is ready to ship on your team: what has to be true?",
          "loop": "The design round.", "why": "Insist on the Highest Standards, asked back."}]},
    {"id": "contribute", "title": "Closing", "when": "The last minute of each round.",
     "why": "A clean exit; each round is scored on its own.",
     "how": ["Thank them, one line on what you enjoyed, then let them close. Then reset before the next round: water, stand up, breathe."],
     "items": [
         {"to": "Any interviewer", "q": "Thanks, I enjoyed working through that with you.",
          "loop": "Every round.", "why": "Nothing more is needed."}]},
]
ASK = []
TRAPS = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
    {"id": "why-amazon", "prompt": "Why Amazon?", "target": "30 seconds", "seconds": 30, "ref": "#say-why-amazon"},
    {"id": "ai-tools", "prompt": "How do you use AI tools in your development work?", "target": "60 seconds", "seconds": 60, "ref": "#say-ai-tools"},
]

# ------------------------------------------------------------------ Leadership
LP = {
    "lead": ("About half the decision. Every interviewer carries two or three principles; the behavioral round probes three or "
             "four stories for five to ten minutes each. What wins is depth and truth: your own actions, a number, and what you "
             "would do differently, holding up under five layers of why."),
    "rules": [
        "Eight deep stories, not sixteen thin ones: each two to three minutes, each able to carry two or three principles.",
        "I, not we: say what you did. 'We' is the most common way a good story scores low.",
        "A number in the result: latency, cost, users, time saved, errors removed. If there is no number, say what changed and how you knew.",
        "What you would do differently: every story, one line. It is how 'learn and be curious' shows.",
        "Never the same story twice in one loop: interviewers compare notes. The matrix below sorts every story by hub, so any question finds a story you have not spent yet.",
        "Situation in under 30 seconds: most of the time goes to your actions and the decisions inside them.",
    ],
    "capture": [
        "Each story starts as your own telling, in chat. That telling is kept word for word under View your transcript. The answer above it is the same story shaped to two minutes of STAR, using only your telling and your own work; what does not fit two minutes moves into the follow-ups.",
        "A follow-up with no answer is one only you can answer. Tell it in chat (`capture` and the story's id, for example `capture blog`) and it goes in, in your words.",
    ],
    "probe": {
        "lead": ("Two or three principle questions per interviewer, about 25 minutes each with follow-ups. Your first telling is about "
                 "two minutes; the rest is them digging. The Bar Raiser is a trained interviewer from another team who can ask about "
                 "any principle and may stay on one story for 15 minutes or more."),
        "points": [
            "Situation first: why it mattered, what the goal was, what would have happened if nobody acted. Say the goal clearly, because the last question compares your result against it.",
            "Then your actions: what you did versus the team, your biggest contribution, the hardest obstacle, which decisions you challenged and how you got buy-in.",
            "Then the result: why those numbers, what other results mattered, what trade-off you accepted. Expect 'I'm concerned about the time it took' or 'the volume': answer with the number and the trade-off, not a defence.",
            "Layers of why: how did you know it was the cause, what else did you consider, what would have proved you wrong. Have the root cause, the component names and one number ready for every story.",
            "Another example: 'What other story shows this?' or 'something more recent?' tests a pattern, not a one-off. That is why every hub keeps two stories.",
            "Interruptions are normal: they cut in to ask how you knew something, or say you answered a softer question. Answer the sharper question; do not restart the story.",
            "The close: what you would do differently, would you make the same call again, how you would do it at Amazon. Name a changed mechanism (a check, a monitor, an earlier test), not 'communicate more'.",
            "What sinks a story: 'we' with no 'I', no number, blaming someone, a hypothetical instead of a real case, a hero story with no tension, a conflict that arrives late.",
            "When you do not know: say the limit plainly and offer a second story on the same principle. A short honest answer beats a padded one, once.",
        ],
    },
    "hubs": [
        {"id": "cust", "name": "Customer", "lps": ["cust", "trust"],
         "asks": ["A time you used customer feedback to drive an improvement.",
                  "A customer wanted one thing, but you felt they needed something else.",
                  "You saw around the corner and gave customers something they did not know they needed.",
                  "Balancing the needs of the customer against the needs of the business."]},
        {"id": "own", "name": "Ownership", "lps": ["own", "scale"],
         "asks": ["You took on something significant outside your area of responsibility.",
                  "A hard decision to sacrifice short-term gain for a longer-term goal.",
                  "You saw you would miss a commitment: how you found the risk and told people.",
                  "You protected users from a risk nobody had asked about."]},
        {"id": "deep", "name": "Dive deep", "lps": ["deep", "right"],
         "asks": ["You went down several layers to understand a problem. What information proved most valuable?",
                  "You linked two or more problems and found the underlying issue.",
                  "It took asking why five times to reach the root cause.",
                  "A decision where the data was not enough and you relied on judgment."]},
        {"id": "simp", "name": "Simplify and frugality", "lps": ["invent", "frugal"],
         "asks": ["A complex problem you solved with a simple solution.",
                  "A trade-off between quality and cost: how you weighed it.",
                  "A creative solution that needed no extra resources.",
                  "The usual approach was not going to work. What did you do instead?"]},
        {"id": "std", "name": "High standards", "lps": ["std", "results"],
         "asks": ["You would not compromise on a great outcome when others felt it was good enough.",
                  "You improved something that was already getting good feedback.",
                  "You were unsatisfied with the status quo and changed it.",
                  "A goal that took a long time to reach. How did you stay on it?"]},
        {"id": "act", "name": "Speed and results", "lps": ["bias", "results", "big"],
         "asks": ["A calculated risk where speed was critical. How did you limit the risk?",
                  "A tight deadline with no time to consider every option.",
                  "Moving forward versus gathering more information: what you did.",
                  "You saw a chance to do something much bigger than the first ask."]},
        {"id": "back", "name": "Conflict", "lps": ["backbone", "trust", "hire", "employer"],
         "asks": ["You strongly disagreed with your manager on something important.",
                  "You took an unpopular stance and were the outlier.",
                  "You felt strongly but lost the argument. What did you do after?",
                  "You needed the cooperation of a peer who was resistant."]},
        {"id": "fail", "name": "Failure and learning", "lps": ["trust", "learn", "right"],
         "asks": ["A significant professional failure. What led to the wrong decision?",
                  "An error in judgment in the last year or two, and its impact.",
                  "You took on work outside your comfort area and found it rewarding.",
                  "The coolest thing you learned on your own that made you better at your job."]},
    ],
    "principles": [
        {"id": "cust", "name": "Customer Obsession", "top": True,
         "plain": "Start from what the customer needs and work backwards; earn and keep their trust, even when it costs you.",
         "probe": "A real customer, what they needed, what you changed because of it, and how you knew it worked.",
         "asks": ["Tell me about a time you went above and beyond for a customer.", "A time you put the customer's need ahead of what was convenient for the team.", "A difficult customer, and what you did."]},
        {"id": "own", "name": "Ownership", "top": True,
         "plain": "Act for the long term, beyond your own task; never say 'that's not my job'.",
         "probe": "Something outside your remit you took on, why, and what it cost you.",
         "asks": ["A time you did something that wasn't your responsibility.", "A time you took on a problem nobody owned.", "A personal sacrifice to meet a deadline; did you tell your lead?"]},
        {"id": "invent", "name": "Invent and Simplify",
         "plain": "Find simpler ways; take ideas from anywhere; accept being misunderstood for a while.",
         "probe": "The complex thing before, the simple thing after, and why simple was right.",
         "asks": ["A simple solution to a complex problem.", "A time you invented something new to solve a problem."]},
        {"id": "right", "name": "Are Right, A Lot",
         "plain": "Good judgment: seek views that disagree with yours, and change your mind when the evidence says so.",
         "probe": "A call you made with others against it, how you tested it, and a time you were wrong.",
         "asks": ["A time you made a decision with incomplete information.", "A time you were wrong. What did you do?"]},
        {"id": "learn", "name": "Learn and Be Curious", "top": True,
         "plain": "Keep learning; go after new things and what you do not understand yet.",
         "probe": "How you learned it fast, and what you do differently since.",
         "asks": ["A time you had to learn something quickly.", "Your biggest failure and what you learned."]},
        {"id": "hire", "name": "Hire and Develop the Best",
         "plain": "Raise the bar of the people around you; coach and help others grow.",
         "probe": "Someone you helped get better, how, and what changed for them.",
         "asks": ["A time you helped a teammate grow.", "A time you gave someone hard feedback."]},
        {"id": "std", "name": "Insist on the Highest Standards", "top": True,
         "plain": "Keep the bar high when it would be easier not to; fix problems so they stay fixed.",
         "probe": "Where you refused 'good enough', what it cost, and the evidence it was worth it.",
         "asks": ["A time you refused to compromise on quality despite a deadline.", "A time you cut corners under pressure.", "A time you pushed back on a solution others thought was good enough."]},
        {"id": "big", "name": "Think Big",
         "plain": "Set a bold direction that inspires results; look around corners.",
         "probe": "A plan bigger than the ask, how you sold it, what it led to.",
         "asks": ["A time you proposed something more ambitious than asked.", "A long-term vision you pushed for."]},
        {"id": "bias", "name": "Bias for Action", "top": True,
         "plain": "Speed matters; many decisions are reversible, so act on them without endless study, and take calculated risks.",
         "probe": "What you decided fast, with what information, and how you limited the risk.",
         "asks": ["A time you made a quick decision with little information.", "A time you acted before you had all the data.", "A decision under a tight deadline."]},
        {"id": "frugal", "name": "Frugality",
         "plain": "More with less: constraints breed resourcefulness; no points for headcount or budget.",
         "probe": "What you did not spend, and what you got anyway.",
         "asks": ["A time you delivered with limited resources.", "A time you cut a cost."]},
        {"id": "trust", "name": "Earn Trust",
         "plain": "Listen, speak candidly, admit your mistakes, treat others respectfully.",
         "probe": "A mistake you owned in front of people, and how trust came back.",
         "asks": ["A time you made a mistake. How did you handle it?", "A time you had to rebuild trust."]},
        {"id": "deep", "name": "Dive Deep", "top": True,
         "plain": "Stay connected to the details; audit often; be skeptical when numbers and stories differ.",
         "probe": "The detail everyone missed, how you found it, and the data.",
         "asks": ["A time you dug into details to solve a problem others couldn't.", "A time the data told a different story than people believed."]},
        {"id": "backbone", "name": "Have Backbone; Disagree and Commit", "top": True,
         "plain": "Challenge decisions you disagree with, respectfully, even when it is uncomfortable; once decided, commit fully.",
         "probe": "Who disagreed, what you said, what happened, and whether you committed when you lost.",
         "asks": ["A time you disagreed with your manager.", "A time you committed to a decision you disagreed with.", "An independent decision your manager questioned."]},
        {"id": "results", "name": "Deliver Results", "top": True,
         "plain": "Focus on what matters and deliver it on time with quality; rise to setbacks.",
         "probe": "The goal, the obstacle, what you did, the result in numbers, and a time you missed.",
         "asks": ["A time you delivered under significant pressure.", "A time you missed a deadline.", "Your proudest project."]},
        {"id": "employer", "name": "Strive to be Earth's Best Employer",
         "plain": "Make the work environment better, safer and more inclusive for the people around you.",
         "probe": "A specific thing you did for a teammate or the team's way of working.",
         "asks": ["A time you improved how your team works.", "A time you supported a teammate who was struggling."]},
        {"id": "scale", "name": "Success and Scale Bring Broad Responsibility",
         "plain": "Think about the effects of your work beyond the obvious: on users, privacy, security, the wider world.",
         "probe": "A second-order effect you caught and acted on.",
         "asks": ["A time you considered the wider impact of a decision.", "A time you protected users from a risk nobody had asked about."]},
    ],
}

# ------------------------------------------------------------------ the plan: wildcard weeks 6 and 7, then the loop week
def _d(date, hours, focus, *items):
    return {"date": date, "hours": hours, "focus": focus,
            "items": [dict(zip(("k", "t", "href", "m"), it)) for it in items]}

DAILY = lambda date: ("daily", "The daily two", "#/daily/" + date, "35 min")
CODE = lambda pid, label, m="20 min": ("revise", "Coding page: " + label, "../CODING.html#" + pid, m)
LLD = lambda pid, label, m="40 min": ("design", label, "#/lld/" + pid, m)
CAP = lambda sid, label, m="30 min, in chat": ("story", "Story: " + label, "#/lp/story-" + sid, m)
MATH = lambda sid, label, m="45 min": ("plan", label, "../index.html#/s/" + sid, m)
# GenAI round questions on Prep, and the problems reported from 2026 loops (LeetCode slugs checked 29 Oct; 277 is paid, 997 is the free twin).
GQ = lambda mod, label, m="45 min": ("genai", "GenAI tab: " + label, "#/learn/m-" + mod, m)
LC = lambda slug, label, m="25 min": ("revise", "Reported in 2026: " + label, "https://leetcode.com/problems/" + slug + "/", m)

PLAN = {
    "title": "Weeks 6 and 7, then the loop",
    "lead": ("Two weeks of the wildcard, day by day, then the loop week. Weeks 4 and 5 stay where they are; their two mathematics "
             "sessions are on weekends here, because you said you would finish them. Tick items as you go. The problems are in "
             "Daily two, the design drills in LLD, the stories on Leadership."),
    "split": [
        ["Coding", "about 45%", "The daily two, the problems reported from 2026 loops, and pattern revision on the coding page."],
        ["Leadership stories", "about 20%", "One story most days, then drilled under follow-ups. They come up in every round."],
        ["GenAI", "about 15%", "One module of the GenAI tab a day, in order; two tool-use stories in your words."],
        ["Object-oriented design", "about 15%", "Four drills from a blank page with their extension follow-ups; one evening of HLD-lite as insurance."],
        ["The full loop", "about 5%", "One self-run loop, timed, in a plain editor with no running code."],
    ],
    "weeks": [
        {"id": "week6", "title": "Week 6: shake off the rust", "note": "Two to three hours a day. Overjoy on Thursday and the Mercor screen on Friday share these days.",
         "days": [
             _d("2026-10-22", "2 h", "Overjoy call today. Start small and start daily.",
                DAILY("2026-10-22"), ("design", "LLD foundations: do it as w5d in the plan (it reads this page's part 1), then tick both", "../index.html#/s/w5d", "75 min"),
                ("story", "Read the Leadership tab: the rules and the sixteen", "#/lp", "20 min"),
                ("other", "Mercor: the coding problems you started", "mercor.html#/coding/problems", "40 min")),
             _d("2026-10-23", "1.5 h", "Mercor screen at 6 PM Eastern. Keep Amazon light today.",
                DAILY("2026-10-23"), CODE("trees", "trees"), CAP("precision", "the notification precision fix")),
             _d("2026-10-24", "3 h", "First full day. Trees and the first design.",
                DAILY("2026-10-24"), LLD("lld-parking", "LLD: parking lot"), CODE("heap", "heaps"),
                MATH("w4b", "Week 4 mathematics: gradients and descent, first half")),
             _d("2026-10-25", "3 h", "Graphs and a design you have to elicit.",
                DAILY("2026-10-25"), LLD("lld-files", "LLD: file system, no requirements given"), CAP("v8", "the V8 rebuild"),
                MATH("w4b", "Week 4 mathematics: gradients and descent, second half")),
             _d("2026-10-26", "2.5 h", "Hash-map designs.",
                DAILY("2026-10-26"), LLD("lld-cart", "LLD: shopping cart with discounts"), CAP("wm", "working memory"),
                CODE("graphs", "graphs")),
             _d("2026-10-27", "2.5 h", "Backbone and a failure, the two stories people dodge.",
                DAILY("2026-10-27"), CODE("order", "topological order"), CAP("teammed", "TeamMedAgents: building from scratch"),
                CAP("catalog", "correcting your own numbers (a failure)")),
             _d("2026-10-28", "2.5 h", "The cache, layered, which ties to week 5's systems session.",
                DAILY("2026-10-28"), LLD("lld-kvstore", "LLD: a key-value cache in layers"), CAP("leak", "the data leak you caught"),
                MATH("w5a", "Optional: week 5 systems, caching (pairs with the cache drill)", "45 min")),
         ]},
        {"id": "week7", "title": "Week 7: depth, then speed", "note": "Re-planned 29 Oct from 2026 reports: a GenAI module a day, the reported problems, four designs instead of seven. Two to three hours until 31 October; four or more from 1 November.",
         "days": [
             _d("2026-10-29", "3 h", "Re-plan day: the reported problems and the GenAI round begin.",
                DAILY("2026-10-29"), LC("next-permutation", "Next Permutation (31)"), CODE("stack", "stacks"),
                GQ("llm", "module 1, how LLMs work (five topics)", "50 min"), CAP("memjobs", "the duplicate-jobs bug"),
                ("other", "Ask the recruiter which the fourth round is: object-oriented design, system design or GenAI (the line is in chat)", "", "5 min")),
             _d("2026-10-30", "3 h", "Graph order, RAG, and the second mathematics session.",
                DAILY("2026-10-30"), LC("course-schedule-ii", "Course Schedule II (210), the order itself"),
                GQ("prompt", "module 2, prompting and structured output", "40 min"), CAP("funnel", "the email rules funnel"),
                MATH("w5b", "Week 5 mathematics: probability, first half")),
             _d("2026-10-31", "3 h", "Redo from blank: the first test of speed.",
                DAILY("2026-10-31"), ("design", "LLD from a blank page: parking lot, timed", "#/lld/lld-parking", "35 min"),
                LC("find-the-town-judge", "the celebrity problem: Find the Town Judge (997), then the two-pointer celebrity elimination", "20 min"),
                MATH("w5b", "Week 5 mathematics: probability, second half"), CAP("blog", "the WheelPrice blog"),
                GQ("rag", "module 3, embeddings and RAG", "50 min")),
             _d("2026-11-01", "4 h", "From today, Amazon only.",
                DAILY("2026-11-01"), CODE("dp", "dynamic programming", "30 min"), LC("domino-and-tromino-tiling", "Domino and Tromino Tiling (790)", "30 min"),
                ("design", "LLD from a blank page: file system with no requirements given, then the cart with discounts", "#/lld/lld-files", "70 min"),
                GQ("agent", "module 4, agents and tools"),
                CAP("weekend", "the savings were weekends"), CAP("metarag", "MetaRAG redone for research"),
                ("genai", "GenAI: tell me a time a tool got it wrong, in chat (capture genai-wrong)", "#/learn/g-tool-wrong", "20 min, in chat")),
             _d("2026-11-02", "4 h", "The loop window opens. Practise as if it were today.",
                DAILY("2026-11-02"), LC("all-nodes-distance-k-in-binary-tree", "All Nodes Distance K (863), out loud, no running code"),
                LC("search-in-rotated-sorted-array", "Search in Rotated Sorted Array (33), out loud"),
                ("design", "LLD from a blank page: the cache in layers (LRU)", "#/lld/lld-kvstore", "40 min"),
                GQ("eval", "module 5, evaluation and validation, your strongest"),
                ("story", "Resume walk-through: every project survives ten minutes of why", "#/lp/lp-stories", "30 min"),
                ("genai", "GenAI: a time a tool made you faster, in chat (capture genai-win)", "#/learn/g-tool-win", "20 min, in chat")),
             _d("2026-11-03", "4 h", "Follow-up depth everywhere, and one HLD-lite evening.",
                DAILY("2026-11-03"), LC("insert-interval", "Insert Interval (57), the follow-up to merge intervals"), CODE("heap", "heaps: merge k sorted lists", "20 min"),
                ("design", "Extension follow-ups on the four designs: a new vehicle type, a new discount type, a second garage; say which class changes", "#/lld", "45 min"),
                ("design", "HLD-lite: TinyURL at API, data model and cache level, then what breaks at 10x", "https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly", "30 min"),
                GQ("prod", "module 6, production", "50 min"),
                CAP("eval", "eval onto production"), CAP("mockflow", "MockFlow-AI")),
             _d("2026-11-04", "4.5 h", "The full loop, alone, timed.",
                DAILY("2026-11-04"),
                ("loop", "Self-run loop: two coding rounds of 45 minutes (from the coding page), then a GenAI round (two stories, four GenAI questions aloud, Next Permutation from blank), then 30 minutes of one design; back to back, in a plain editor", "../CODING.html", "3.5 h"),
                ("story", "Bar Raiser drill: five layers of why on three stories", "#/lp/lp-matrix", "45 min"),
                ("loop", "Write down what broke; nothing new after today", "", "15 min")),
         ]},
        {"id": "loopweek", "title": "The loop week", "note": "Your loop is Monday 9 and Tuesday 10 November. Two full days, a calm weekend, a light Sunday, then two rounds a day.",
         "days": [
             _d("2026-11-05", "3 h", "Four days out. Sharp, not new.",
                DAILY("2026-11-05"), ("revise", "Redo two problems you found hardest (daily two or reported)", "#/daily", "40 min"),
                ("design", "One design from a blank page", "#/lld", "40 min"),
                ("genai", "GenAI tab: module 7, fine-tuning; then your two tool-use stories aloud", "#/learn/m-ft", "40 min")),
             _d("2026-11-06", "3 h", "Three days out. Last full day.",
                ("revise", "Two mediums out loud, timed, in a plain editor", "../CODING.html", "60 min"), ("design", "One design from a blank page", "#/lld", "40 min"),
                ("story", "Three stories aloud with their follow-ups", "#/lp/lp-stories", "30 min"),
                ("genai", "GenAI tab: Test me on everything, then explain your two weakest topics aloud", "#/learn", "30 min"),
                ("loop", "Install Zoom on the interview device; open the LiveCode link with the ad blocker off", "", "15 min")),
             _d("2026-11-07", "2 h", "Weekend: keep warm, do not cram.",
                ("revise", "Redo two problems you found hardest", "#/daily", "40 min"), ("design", "One design from a blank page", "#/lld", "40 min"),
                ("story", "Two stories aloud with their follow-ups", "#/lp/lp-stories", "30 min")),
             _d("2026-11-08", "1.5 h", "Light. The loop is tomorrow.",
                ("loop", "Read the Loop day card", "#/card", "20 min"), ("revise", "One medium, out loud", "../CODING.html", "30 min"), ("loop", "Sleep early", "", "")),
             _d("2026-11-09", "", "Loop day 1.", ("loop", "The Loop day card, nothing new", "#/card", ""),
                ("loop", "Tonight: rest; reread the card and two stories you have not told yet", "#/card", "20 min"), ("loop", "Sleep early", "", "")),
             _d("2026-11-10", "", "Loop day 2.", ("loop", "The Loop day card, nothing new", "#/card", "")),
         ]},
    ],
}

# ------------------------------------------------------------------ the loop-day card (one screen; prints on one landscape page)
CARD = {
    "title": "Loop day",
    "lead": "Read it the night before and in each break. Keep it out of your eyeline in the rounds.",
    "bar": [["Clarify", 5], ["Approach", 5], ["Code and dry-run", 25], ["Follow-ups", 10], ["Story", 15]],
    "rounds": [
        {"name": "Coding 1", "first": ["Restate the problem in one sentence.", "Ask: size, duplicates, empty, sorted, ties, what to return.",
                                       "Say the brute force and its cost, then the better idea. Get a nod."],
         "show": "Working code by minute 35, a dry run out loud, the cost said before they ask."},
        {"name": "Coding 2", "first": ["Treat it as a fresh start: the last round is scored on its own.", "Clarify, then translate the Amazon story into the pattern in the first three minutes.",
                                       "Brute force first if the better idea is not there yet."],
         "show": "If you finish early, a harder second problem often follows. That is good news."},
        {"name": "Design or GenAI", "firstLabel": "First minutes", "first": ["Design: ask who uses it and the two or three things they must do; write the requirements where they can see them.",
                                       "GenAI: the mechanism in a sentence, then what you built, the check you ran, the number.",
                                       "Either way, a LeetCode problem or LP questions may follow."],
         "show": "Design: for each extension say which class changes. GenAI: never open a tool; your own failures and checks beat definitions."},
        {"name": "Behavioral", "firstLabel": "Every story", "first": ["Situation in under 30 seconds.", "I, not we: the decision inside each action.",
                                       "A number, then what you would do differently. Stop at three minutes."],
         "show": "Three or four stories, each dug into for five to ten minutes. If you do not remember a detail, say so."},
    ],
    "between": ["Stand up, water, breathe. The last round is over.", "Cross off the stories you spent.", "Read the next round's column, nothing else."],
    "rules": ["No AI, no second screen, no notes in view.", "No silence: think out loud, even when stuck.", "Never invent a detail in a story."],
}
