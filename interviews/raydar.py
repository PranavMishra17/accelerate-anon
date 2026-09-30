"""Raydar, first round, Wednesday 30 September 2026: Founding Forward Deployed Engineer.

A 10 to 15 minute screen with the Raydar Interview Agent, an AI interviewer, on Google Meet.
Raydar is a recruiting agency; the role is for a client it does not name. The agent covers the
background, what you want next and pay, and its transcript is also used to match you to other
Raydar clients. David Phillips (founder) then connects fits to the hiring manager.

Facts about Raydar and the posting are only what is in SOURCES, checked 2026-09-29. Pranav's facts
come from his existing prep (coframe.py, zenml_round3.py) and the master reference. Logistics
answers (pay, location, work authorization, start date) are kept in chat, never on this page.
"""

LOOP = {
    "id": "raydar",
    "title": "Raydar, Founding FDE",
    "subtitle": "AI screen, 15 minutes",
    # Brand colour for the hub's wordmark. Raydar's orange: --rd-orange-700: #B75204 in
    # raydar.xyz/shared/brand.css (5:1 on the light surface). brand_dark: --rd-orange #FF6E00,
    # 5.7:1 on the dark surface. Their violet is too close to Coframe's.
    "brand": "#B75204", "brand_dark": "#FF6E00",
    "when_iso": "2026-09-30T09:00:00-05:00",
    "when": "Wednesday 30 September, morning (the time on your booking), Google Meet",
    "who": ("The Raydar Interview Agent, an AI. A human at Raydar reviews the recording; David Phillips, "
            "the founder, then introduces fits to the hiring manager."),
    "format": ("Ten to fifteen minutes on Google Meet, recorded and transcribed. Your background, what you want "
               "next, and pay (base, separate from equity). You can ask for a human at any point."),
    "bar": ("The transcript is scored against a rubric and read by a person. Clear structure, a number in every "
            "story, the posting's own words used naturally. One or two minutes an answer, then stop."),
    "plan_kicker": "Before the call",
    "extra": ("The posting and what Raydar publishes are under <b>What this rests on</b> on the Prep tab."),
}

SESSION_IDS = []

PREP_LEAD = ("One hour. Read how to talk to an AI interviewer, then say four things out loud with a timer: the "
             "intro, why FDE, the one story, and what you want next. Have your pay number written down.")

SHOW_UP = [
    ("It is an AI, and a person reads the transcript.", "Talk to it as you would to a recruiter. Each answer is scored against a rubric that quotes you, so the words matter more than the delivery."),
    ("Structure every answer.", "What the situation was, what you did, what changed, with a number. Say the result out loud; it cannot infer it."),
    ("One to two minutes, then stop.", "It asks follow-ups when it needs more. A long answer buries the line it would have quoted."),
    ("Wait a beat before you speak.", "Voice agents take a moment to finish and can cut in on a pause. If it interrupts, finish your sentence and carry on; if it mishears, correct it plainly."),
    ("Use the posting's words.", "Forward deployed, discovery, deployment through adoption, full stack, data pipelines, LLM workflows, executives. Where they are true, not as a list."),
    ("Pay: one number, base.", "It asks base separately from equity. Say your number once, from chat. Don't give a range you would regret."),
    ("Say what else you would take.", "It also matches you to other Raydar clients. One sentence on the kind of role you want widens that net."),
    ("Room, sound, camera.", "Quiet room, wired or close to the router, headphones so it doesn't hear itself. Join two minutes early."),
]

STORY_BLURB = "Your intro, why FDE, the one story in STAR shape, what you want next, and logistics."

# Every outside link, checked 2026-09-29.
SOURCES = [
    {"label": "Founding Forward Deployed Engineer: the job post (Workable)", "url": "https://jobs.workable.com/view/4KUx4od5tWQuAWeMoxENqF/founding-forward-deployed-engineer-in-chicago-at-raydar",
     "why": "For an unnamed AI-first permanent-capital group that buys vertical SaaS companies: $50M+ raised, 8 businesses in under 2 years. Build the forward-deployed function, run discovery with executives, own deployments through adoption, build shared data infrastructure. 3 to 5 years; full stack, systems, data pipelines, LLM workflows. New York or Chicago, in office, travel."},
    {"label": "The same posting on Raydar's Workable page", "url": "https://apply.workable.com/raydar/j/6198E62EFE/",
     "why": "The original; the mirror above has the full text."},
    {"label": "Raydar: how it works", "url": "https://www.raydar.xyz/how-it-works",
     "why": "Free for candidates. The agent: Google Meet, 15 minutes, background, what you want next, base pay separate from equity; recorded and transcribed; ask for a human any time."},
    {"label": "Raydar: company site", "url": "https://www.raydar.xyz",
     "why": "An AI-powered recruiting agency. The team reviews every application; strong ones get the AI interview, then placement support."},
    {"label": "Raydar: open roles", "url": "https://www.raydar.xyz/open-roles",
     "why": "Other roles it may match you to, including a Forward Deployed ML Engineer."},
    {"label": "The Palantirization of everything (a16z)", "url": "https://a16z.com/the-palantirization-of-everything/",
     "why": "What an FDE is: embedded with the customer, wiring systems together, driving adoption, feeding back to product, and saying no to one-off custom work."},
    {"label": "Forward deployed engineers (The Pragmatic Engineer)", "url": "https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers",
     "why": "How FDEs are screened: shipped work owned end to end, ambiguity, technical depth and communication."},
    {"label": "AI interviews explained (HeyMilo, an AI interview vendor)", "url": "https://blog.heymilo.ai/ai-interviews-explained-what-candidates-and-recruiters-need-to-know",
     "why": "The agent scores each answer against a rubric, with a rationale and timestamped quotes; a person decides."},
]

# Your story, in your words. Items marked "verbatim" are Pranav's own text: never polish them.
SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. The agent will quote from it, so land on the FDE line.",
     "probes": ["What does alfred_ do?", "What did you own?", "What are you looking for?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And that's pretty much what a forward deployed role is: sit with the business, figure out what's actually broken, and ship AI that people use, from the first deployment to adoption."],
     "swaps": [{"when": "If it asks what alfred_ is, in a line", "line": "An AI executive assistant that works over text message. It handles people's email and calendar end to end, for 5,000-plus active users."}],
     "land": "Research, then shipping for customers, then owning a production agent. FDE is that, across several businesses.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged. Only the last line is new.", "Stop after the last line."]},

    {"id": "why-fde", "title": "Why this role? Why forward deployed?", "length": "about 60 seconds",
     "when": "Straight after the intro. It checks you understand the job and that it fits.",
     "probes": ["What do you know about the role?", "Have you worked with customers directly?", "Why founding?"],
     "say": [
         "From the posting, it's for a group that buys vertical software companies and wants to make each of them AI-first. The job is to build the forward deployed function: go into each business, run discovery with the people running it, and ship AI into real workflows, then stay until it's adopted.",
         "That's pretty close to how I already work. At WheelPrice we were two engineers, so I was building straight for customers: a content system that got to 10 to 20 thousand daily readers, and an AI assistant that could only answer through tools against verified data, because a wrong answer to a customer is worse than no answer.",
         "At alfred_ I work from real users' failures: I read the conversation, find what broke, fix it, and make sure it stays fixed with an eval case. That's the loop an FDE runs, with the customer in the room.",
         "And founding appeals to me because there's no playbook yet. I like building the thing and the way it gets built."],
     "swaps": [{"when": "If it asks about working with executives", "line": "At a small company you're never far from the person who owns the outcome. I've learned to start from what they measure, and to say plainly what AI will and won't do for it."},
               {"when": "If it asks why founding", "line": "I've been a founding engineer at alfred_. I like owning the first version and deciding what gets built, not only building it."}],
     "land": "Discovery, ship into real workflows, stay until adoption; that's how I already work.",
     "notes": ["New, in your voice. Facts from the posting (Sources) and your master reference.", "Say 'from the posting', not 'I know'."],
     "never": ["Don't guess the client's name.", "Don't claim executive discovery work you haven't done."]},

    {"id": "story", "title": "The one story, in STAR shape", "length": "about 90 seconds",
     "when": "Any 'tell me about a time' question: an impact, a hard problem, owning something end to end.",
     "probes": ["What was the result?", "What was your part?", "How did you measure it?"],
     "say": [
         "Situation: at alfred_, when I joined, nobody could say whether a new version of the agent was better than the old one. People tried it and had opinions.",
         "Task: we were about to rewrite how the agent handles back-and-forth conversations, and that's too big to check by trying it a few times.",
         "Action: I built a way to replay real user tasks against the new version before it ships. A little over a hundred cases, each from a real production failure, each running the real agent against a frozen copy of that user's email and calendar. A scanner reads real conversations daily, so new failures keep becoming cases.",
         "Result: that's how we signed off the rewrite. We could point at which cases got better and which got worse, and the agent reached the same results in fewer steps, about 2.5 tool calls per task down to 2.2."],
     "swaps": [{"when": "If it wants a win users felt", "line": "Texts about important emails used to arrive about ninety seconds after the email. The delay was a timer, not the work, so I triggered on the event instead. About three seconds now."},
               {"when": "If it asks about cost or pragmatism", "line": "Not everything needs a model. Email rules were a model call on every message; I replaced that with a deterministic matcher and cut per-user LLM cost by about 30%."},
               {"when": "If it asks about a hard technical problem", "line": "The model kept inventing email threads. Instead of prompting harder, I made it pick from a list of real items while code attaches the ids. It can't invent a thread anymore."}],
     "land": "Real failures became tests, and a full rewrite shipped with evidence.",
     "notes": ["Say the four labels in your head, not out loud, unless it asks for STAR.", "The swaps are three more stories in one line each."]},

    {"id": "next", "title": "What are you looking for next?", "length": "about 45 seconds",
     "when": "It asks this for matching across its clients too, so be specific and a little broad.",
     "probes": ["What kind of company?", "What kind of role?", "What matters most?"],
     "say": [
         "An early team shipping AI that people actually use. Forward deployed or applied AI engineering, where I'm close to the users and own things from the first version into production.",
         "The work I'm strongest at is agents in production: evaluation, reliability, and the infrastructure under them. I've also built real-time voice, a mock interview platform on LiveKit at under 400 milliseconds end to end.",
         "What matters most is ownership and a real problem. Stage matters less than that."],
     "land": "Early team, AI people use, close to users, owning it into production.",
     "notes": ["New, in your voice. MockFlow-AI facts from the master reference: LiveKit, Deepgram, sub-400ms latency.",
               "Location: the posting says New York or Chicago. Your answer is in chat."]},

    {"id": "logistics", "title": "Logistics it will ask", "length": "a line each",
     "when": "Pay for certain; the rest maybe. Your answers are in chat, not on this public page.",
     "probes": ["What base salary are you looking for?", "Equity expectations?", "Where are you based? In office five days?", "Travel?", "Work authorization?", "When could you start?"],
     "say": [],
     "land": "Say each once, in one sentence, then stop.",
     "notes": ["**Base:** one number, from chat. The posting lists $200K to $300K base plus equity.",
               "**Equity:** 'Open, depending on the stage and the grant.'",
               "**Location and office:** the posting says New York or Chicago, five days in office, with frequent travel. Your answer from chat.",
               "**Work authorization and start date:** your answers from chat, one sentence each."],
     "never": ["Don't explain a logistics answer; the explanation becomes the transcript."]},
]

QA = [
    {"group": "The role", "blurb": "What an FDE does, and how your work maps to it.", "items": [
        {"q": "What does a forward deployed engineer do?", "short": "What an FDE is", "tests": "Do you understand the job?",
         "a": ["An engineer who sits with the customer instead of behind a product team. You find what's actually broken in their workflow, wire their systems together, ship something they use, and stay until it's adopted. Then you feed what you learned back, so the next deployment is faster.",
               "The hard part isn't the code. It's saying no to one-off custom work and building the pieces that carry over to the next customer."],
         "land": "Sit with the customer, ship what they use, stay until adoption, and reuse what you learn."},
        {"q": "How would you approach a new portfolio company?", "short": "A new company, day one", "tests": "Discovery before building.",
         "a": ["Start with the people running it: what they measure, where time goes, and which work is repeated. Then read the data, because the workflow on paper is never the real one.",
               "Pick one workflow where AI saves real hours and a wrong answer is cheap to catch. Ship a small version in weeks, measure it against what they measure, and only then widen it. And check it against real cases before it goes live, the same way I do at alfred_."],
         "land": "Listen, read the data, ship one small thing that's measured, then widen."},
        {"q": "Tell me about working with data pipelines and messy data.", "short": "Data and integrations", "tests": "The posting's data infrastructure line.",
         "a": ["At alfred_ everything the agent knows comes from people's real inboxes and calendars across Gmail, Outlook and IMAP, so most of my data work is making messy sources reliable: queues for long jobs, scheduled backstops so nothing gets dropped, and checks that the result is complete, not just well shaped.",
               "The lesson that stuck: a test once passed a financial ledger that left out two refunds. Now we check against the ground truth we hold."],
         "land": "Messy real sources, made reliable, checked against ground truth."},
    ]},
]

QA_ORDER = ["The role"]

ASK_3C = [
    {"id": "agent", "title": "For the agent, at the end", "when": "When it asks if you have questions.",
     "why": "It records these, and David reads them. Keep them practical.",
     "how": ["One or two, short."],
     "items": [
         {"to": "Agent", "q": "What happens after this call, and when would I hear back?",
          "loop": "First.", "why": "Practical, and it tells you the timeline."},
         {"to": "Agent", "q": "Can you tell me more about the company behind the role, and how the FDE team would be set up?",
          "loop": "If there's time.", "why": "The client isn't named; this invites David to tell you."},
         {"to": "Agent", "q": "Are there other roles you'd match me with, in applied AI or forward deployed work?",
          "loop": "Last.", "why": "Uses the matching it offers."}]},
    {"id": "david", "title": "For David or the hiring manager, later", "when": "The next call, not this one.",
     "why": "Keep them for a person.",
     "how": ["Save these."],
     "items": [
         {"to": "Hiring manager", "q": "Which workflows in the portfolio do you expect AI to change first?", "loop": "Early.", "why": "Shows you think in outcomes."},
         {"to": "Hiring manager", "q": "How is an FDE's work measured: adoption, hours saved, revenue?", "loop": "Middle.", "why": "What you'd be judged on."},
         {"to": "Hiring manager", "q": "How do you decide what becomes shared across companies and what stays custom?", "loop": "Middle.", "why": "The hard part of the job, asked as curiosity."}]},
]
ASK = []

TRAPS = [
    ("Reading a script aloud", "It hears the flatness and the rubric rewards substance, not polish. Know the points; say them."),
    ("Keyword stuffing", "Use the posting's words where they're true. A list of terms reads badly in a transcript."),
    ("Talking over it", "Wait a beat after it stops. If you cut each other off, let it finish, then answer."),
    ("Leaving the result unsaid", "It can't infer 'and it worked'. Say the number."),
    ("A vague pay answer", "It asks base directly. One number."),
    ("Raising logistics first", "Work authorization and relocation only if asked. One sentence each."),
    ("The wrong posting", "Another 'Founding Forward Deployed Engineer' in New York is at Frontdesk, a different company."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "why-fde", "prompt": "Why this role, and why forward deployed?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-fde"},
    {"id": "story", "prompt": "Tell me about something you owned end to end, and the result.", "target": "90 seconds", "seconds": 90, "ref": "#say-story"},
    {"id": "next", "prompt": "What are you looking for next?", "target": "45 seconds", "seconds": 45, "ref": "#say-next"},
]

MOCK_HOW = "Say 'run the Raydar mock' in chat: an AI-style screener, fifteen minutes, background, goals and pay."
