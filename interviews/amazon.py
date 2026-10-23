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
    "format": ("Four 60-minute rounds on Zoom, coding in Amazon LiveCode (the interviewer sees the editor live, no screen share), often with no way to run code: two coding rounds, one "
               "object-oriented design round, one behavioral round. Leadership principle questions in every round. No AI tools."),
    "bar": ("A medium solved to working, dry-run code in 25 to 30 minutes while talking, then two more layers of follow-up; "
            "a design you can extend without rewriting; and eight deep, true stories that survive five layers of why."),
    "plan_kicker": "The next two weeks",
    "extra": ("<b>Start with the Plan tab: it says what to do today.</b> Every day has the daily two (35 minutes), one "
              "design or revision block, and one story to capture with me in chat. Two to three hours a day until 31 October, "
              "four or more from 1 November."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, why Amazon, the AI-tools answer, last year, and the questions to ask. The stories are on the Leadership tab."

SHOW_UP = [
    ("Think out loud from the first second.", "Silence is the most reported way to fail a coding round. Say the brute force, get a nod, then improve. A 2026 candidate froze for five minutes, coded the brute force, found the better answer late, and still got the offer."),
    ("Clarify first, and say you are doing it.", "Input size, duplicates, empty input, sorted or not, what to return. In the design round, the requirements are often not given on purpose: asking for them is part of the score."),
    ("Dry-run before you say done.", "There may be no way to run code. Walk a small example through your code out loud, then state time and space without being asked."),
    ("Expect three layers.", "After the solve: make it faster, change a constraint (a stream, duplicates, out-of-order times), then justify. That is where rounds are won."),
    ("Spend each story once.", "Interviewers compare notes. Keep the matrix on the Loop day card and cross off what you used."),
    ("No AI, anywhere.", "Amazon's rule for the live rounds. If an interviewer asks how you use AI tools at work, answer it as a conversation; never open one."),
]

STORY_BLURB = "Your intro, why Amazon, the AI-tools question, last year, and logistics."

# Every outside link opened 2026-10-21 (Medium and LeetCode posts cited in the dossier refuse scripted requests, so they are left out).
SOURCES = [
    {"label": "Amazon: how we hire", "url": "https://www.amazon.jobs/content/en/how-we-hire",
     "why": "The official shape: four to six interviews of 45 to 60 minutes, the Bar Raiser, the leadership principles, STAR."},
    {"label": "Amazon: leadership principles", "url": "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
     "why": "The sixteen, in Amazon's words."},
    {"label": "Hello Interview: Amazon L4 (SDE I) guide", "url": "https://www.hellointerview.com/guides/amazon/l4",
     "why": "The 2026 four-round shape: two coding, one design, one behavioral; behavioral weighs most at this level."},
    {"label": "Lodely: Amazon interview questions", "url": "https://www.lodely.com/companies-interview-questions/amazon",
     "why": "181 tracked questions: about 78% medium; trees, graphs and heaps lead."},
    {"label": "Taro: US new grad, July 2025", "url": "https://www.jointaro.com/interviews/companies/amazon/experiences/software-development-engineer-united-states-july-1-2025-no-offer-neutral-9d3c90f7/",
     "why": "A 2025 three-round loop: the personal-sacrifice question in the Bar Raiser round."},
    {"label": "Stackademic: a 2025 new-grad loop", "url": "https://stackademic.com/blog/my-amazon-software-development-engineer-new-grad-interview-experience",
     "why": "Strong technical rounds, rejected on story depth: the post-mortem behind 'treat LP as half'."},
]

COMPANY = [
    "Your loop this year is four rounds, not last year's three: two coding rounds, one object-oriented (low-level) design round, and one behavioral round, each 60 minutes. The content is last year's, unpacked; the new weight is a standalone design round and deeper follow-ups everywhere. No high-level system design at this level.",
    "Leadership principles are about half the decision. Each interviewer is assigned two or three principles; coding rounds spend 10 to 15 minutes on them, the behavioral round all of it, with each story probed for five to ten minutes. One interviewer is a Bar Raiser from outside the team, who can run any round and whose view carries the most weight in the debrief.",
    "Coding: about 78% of tracked Amazon questions are medium, often dressed as an Amazon scenario (product categories as a tree, delivery routes as a graph). Trees, graphs and heaps lead, then hash-map designs (LRU, time-based store), stacks, greedy, and dynamic programming when it lands. A fast, clean medium often earns a harder second problem.",
    "No AI tools in any live round: Amazon's guidance forbids them unless explicitly permitted, and a former Bar Raiser told GeekWire that using one gets you no-hired. The only AI-assisted task was in the online assessment, which is behind you. Some 2026 loops (reported from India) included a conversation about how you use AI at work: you have an answer for that on Prep.",
]

POSTING = {
    "url": "https://www.amazon.jobs/content/en/how-we-hire",
    "label": "Amazon: how we hire",
    "lead": "Software Development Engineer, new grad, through Amazon Student Programs: the L4 (SDE I) loop.",
    "facts": [["Rounds", "4 x 60 minutes over 9 and 10 November, Zoom and LiveCode"], ["Coding", "2 rounds, medium with harder follow-ups"],
              ["Design", "1 object-oriented design round"], ["Behavioral", "1 round, plus LP in every round"], ["AI tools", "Not allowed"]],
    "does": [
        "Solve medium problems in a shared editor, talking, and dry-run them without running code.",
        "Design classes for a concrete system (parking lot, file system, cart) and extend them.",
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
     "format": "Coding, coding, object-oriented design, behavioral. LP in every round.",
     "outcome": "Not yet held.",
     "notes": ["From the invitation: GenAI tools not allowed unless explicitly permitted.",
               "From the scheduling email (22 Oct): you may be asked about your experience with GenAI tools. Prepare a few examples: the situation, what went well, what you would do differently, and how it changed your outcome or speed.",
               "Zoom on the device you will use (camera, headphones); a waiting room of up to 10 minutes. LiveCode: open the link from the email, wait for the interviewer to open the session, refresh; turn the ad blocker off."],
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

QA = []
TABS = ["overview", "plan", "daily", "lld", "lp", "prep", "rounds", "card"]

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
        "Never the same story twice in one loop: interviewers compare notes. The matrix below plans which story goes where.",
        "Situation in under 30 seconds: most of the time goes to your actions and the decisions inside them.",
    ],
    "capture": [
        "The stories are not written for you. You tell each one to me in chat, the way you remember it; I record that version as the truth, then ask the follow-ups a Bar Raiser would (what exactly did you do, why that, who disagreed, what was the number, what would you change), and we add what that digs out.",
        "To start one, say `capture` and the story's id (for example `capture notify`). The page then shows your version, what we dug out, and the do-differently line. Facts you are unsure of stay marked until you confirm them.",
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
CAP = lambda sid, label, m="30 min, in chat": ("story", "Capture: " + label, "#/lp/story-" + sid, m)
MATH = lambda sid, label, m="45 min": ("plan", label, "../index.html#/s/" + sid, m)

PLAN = {
    "title": "Weeks 6 and 7, then the loop",
    "lead": ("Two weeks of the wildcard, day by day, then the loop week. Weeks 4 and 5 stay where they are; their two mathematics "
             "sessions are on weekends here, because you said you would finish them. Tick items as you go. The problems are in "
             "Daily two, the design drills in LLD, the stories on Leadership."),
    "split": [
        ["Coding", "about 45%", "The daily two, plus pattern revision on the coding page; trees, graphs and heaps first."],
        ["Leadership stories", "about 25%", "One story captured with me in chat most days, then drilled under follow-ups."],
        ["Object-oriented design", "about 20%", "Seven drills, then the same ones again from a blank page, timed."],
        ["The full loop", "about 10%", "Two self-run loops, timed, in a plain editor with no running code."],
    ],
    "weeks": [
        {"id": "week6", "title": "Week 6: shake off the rust", "note": "Two to three hours a day. Overjoy on Thursday and the Mercor screen on Friday share these days.",
         "days": [
             _d("2026-10-22", "2 h", "Overjoy call today. Start small and start daily.",
                DAILY("2026-10-22"), LLD("lld-round", "LLD: how the design round runs", "30 min"),
                ("story", "Read the Leadership tab: the rules and the sixteen", "#/lp", "20 min"),
                ("other", "Mercor: the coding problems you started", "mercor.html#/coding/problems", "40 min")),
             _d("2026-10-23", "1.5 h", "Mercor screen at 6 PM Eastern. Keep Amazon light today.",
                DAILY("2026-10-23"), CODE("trees", "trees"), CAP("notify", "the 90 seconds to 3 seconds story")),
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
                DAILY("2026-10-27"), CODE("order", "topological order"), CAP("advisor", "disagreeing with your advisor"),
                CAP("yesbind", "the seven patches (a failure)")),
             _d("2026-10-28", "2.5 h", "The cache, layered, which ties to week 5's systems session.",
                DAILY("2026-10-28"), LLD("lld-kvstore", "LLD: a key-value cache in layers"), CAP("leak", "the data leak you caught"),
                MATH("w5a", "Optional: week 5 systems, caching (pairs with the cache drill)", "45 min")),
         ]},
        {"id": "week7", "title": "Week 7: depth, then speed", "note": "Two to three hours until 31 October; four or more from 1 November, Amazon only.",
         "days": [
             _d("2026-10-29", "2.5 h", "Stacks and the elevator.",
                DAILY("2026-10-29"), LLD("lld-elevator", "LLD: elevator system"), CODE("stack", "stacks"), CAP("cold", "why every turn booted cold")),
             _d("2026-10-30", "3 h", "Library, and the second mathematics session.",
                DAILY("2026-10-30"), LLD("lld-library", "LLD: library management", "35 min"), CAP("rules", "the rules matcher cost cut"),
                MATH("w5b", "Week 5 mathematics: probability, first half")),
             _d("2026-10-31", "3 h", "Redo from blank: the first test of speed.",
                DAILY("2026-10-31"), ("design", "LLD from a blank page: parking lot, timed", "#/lld/lld-parking", "35 min"),
                MATH("w5b", "Week 5 mathematics: probability, second half"), CAP("wpcms", "WheelPrice: 1.5 s to 300 ms")),
             _d("2026-11-01", "4 h", "From today, Amazon only.",
                DAILY("2026-11-01"), CODE("dp", "dynamic programming", "30 min"),
                ("design", "LLD from a blank page: file system and cart, timed", "#/lld/lld-files", "70 min"),
                CAP("mentor", "helping a teammate grow"), CODE("concurrency", "concurrency, for design follow-ups"),
                ("story", "Resume walk-through: every project survives ten minutes of why", "#/lp/lp-stories", "30 min")),
             _d("2026-11-02", "4 h", "The loop window opens. Practise as if it were today.",
                DAILY("2026-11-02"), ("loop", "Two mediums from the coding page, 25 minutes each, out loud, no running code", "../CODING.html", "60 min"),
                ("design", "LLD from a blank page: the cache in layers", "#/lld/lld-kvstore", "40 min"),
                ("story", "Fix the story-per-round plan; tell four stories aloud, 3 minutes each", "#/lp/lp-rounds", "60 min")),
             _d("2026-11-03", "4 h", "Follow-up depth everywhere.",
                DAILY("2026-11-03"), ("design", "LLD from a blank page: elevator and library", "#/lld/lld-elevator", "70 min"),
                CODE("graphs", "graphs and heaps again", "40 min"),
                ("story", "Bar Raiser drill: five layers of why on three stories", "#/lp/lp-matrix", "60 min")),
             _d("2026-11-04", "4.5 h", "The full loop, alone, timed.",
                DAILY("2026-11-04"),
                ("loop", "Self-run loop: two coding rounds of 45 minutes (from the coding page), one design (a drill you have not redone), 45 minutes of stories, back to back, in a plain editor", "../CODING.html", "3 h"),
                ("loop", "Write down what broke; nothing new after today", "", "15 min")),
         ]},
        {"id": "loopweek", "title": "The loop week", "note": "Your loop is Monday 9 and Tuesday 10 November. Two full days, a calm weekend, a light Sunday, then two rounds a day.",
         "days": [
             _d("2026-11-05", "3 h", "Four days out. Sharp, not new.",
                DAILY("2026-11-05"), ("revise", "Redo two daily problems you found hardest", "#/daily", "40 min"),
                ("design", "One design from a blank page", "#/lld", "40 min"), ("story", "Two GenAI-tools examples aloud: situation, what went well, what you'd change, the effect", "#/lp/lp-rounds", "30 min")),
             _d("2026-11-06", "3 h", "Three days out. Last full day.",
                ("revise", "Two mediums out loud, timed, in a plain editor", "../CODING.html", "60 min"), ("design", "One design from a blank page", "#/lld", "40 min"),
                ("story", "Three stories aloud with their follow-ups", "#/lp/lp-rounds", "30 min"),
                ("loop", "Install Zoom on the interview device; open the LiveCode link with the ad blocker off", "", "15 min")),
             _d("2026-11-07", "2 h", "Weekend: keep warm, do not cram.",
                ("revise", "Redo two daily problems you found hardest", "#/daily", "40 min"), ("design", "One design from a blank page", "#/lld", "40 min"),
                ("story", "Two stories aloud with their follow-ups", "#/lp/lp-rounds", "30 min")),
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
        {"name": "Design", "firstLabel": "First eight minutes", "first": ["Ask who uses it and the two or three things they must do.", "Scale, concurrency, money, persistence; what is out of scope.",
                                       "Write the agreed requirements where they can see them."],
         "show": "Entities, relationships, the core code; for each extension say which class changes and which does not."},
        {"name": "Behavioral", "firstLabel": "Every story", "first": ["Situation in under 30 seconds.", "I, not we: the decision inside each action.",
                                       "A number, then what you would do differently. Stop at three minutes."],
         "show": "Three or four stories, each dug into for five to ten minutes. If you do not remember a detail, say so."},
    ],
    "between": ["Stand up, water, breathe. The last round is over.", "Cross off the stories you spent.", "Read the next round's column, nothing else."],
    "rules": ["No AI, no second screen, no notes in view.", "No silence: think out loud, even when stuck.", "Never invent a detail in a story."],
}
