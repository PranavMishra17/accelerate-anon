"""Coframe, recruiter screen, Thursday 1 October 2026: Agent Platform Engineer.

Fifteen minutes on Google Meet with Neesha Malik, Founding Talent. She checks the resume is
real, gauges communication and seniority, sells the role and decides whether to pitch him to
the team. So the page is short: the story in outcomes, the questions after it, and what to ask.

Facts about Coframe are only what Coframe publishes (its site, blog and the Ashby posting) and
two news items, all in SOURCES, checked 2026-09-29. Pranav's facts come from his existing prep:
the alfred_ answers in zenml_round3.py and the master reference. Logistics answers (location,
pay, work authorization, start date) are kept in chat, never on this public page.
"""

LOOP = {
    "id": "coframe",
    "title": "Coframe, Agent Platform Engineer",
    "subtitle": "Round 2: a technical exercise with the technical co-founder",
    # Brand colour for the hub's wordmark. Coframe's violet: background:#5A52EC on the buttons
    # and labels of coframe.com (the most used accent in its inline styles; the logo SVG is
    # white and the favicon near-black). 5.4:1 on the light surface. brand_dark: the same hue
    # lightened to 7:1 on the dark surface, a step lighter than Oxus's indigo so the two read apart.
    "brand": "#5A52EC", "brand_dark": "#B79CF7",
    # Round 2 is the next call. The time is booked through Ashby's link; noon Eastern is a placeholder.
    "when_iso": "2026-10-09T12:00:00-04:00",
    "when": "Round 2: Friday 9 October, one hour (time from your booking)",
    "who": ("Round 2: Pavlo Razumovskyi, Coframe's technical co-founder. Round 1 (done, 1 October) was Neesha "
            "Malik, Founding Talent, who moved you forward."),
    "format": ("Round 2 is one hour with the technical co-founder: coding, system design and technical conversation, in Python and TypeScript. "
               "Coding plus technical conversation. AI tools you use daily are encouraged (Claude Code, Codex and so on). "
               "Have an environment ready to read and run Python and TypeScript scripts (VS Code or Cursor), and a setup "
               "that shares microphone, camera and screen (allow the browser to screen share)."),
    "bar": ("Working code, shown running, with your reasoning out loud: how you read an unfamiliar script, how you "
            "use the AI tool and check what it gives you, and the platform judgement from round 1 (isolation, "
            "retries and durability, latency and cost) applied to real code."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Work in this order.</b> 1. Skim <a href=\"#/overview/onepage\">the one page</a>. "
              "2. Learn, a module at a time: the round and Coframe, then Python, TypeScript and async, then the live builds "
              "(each in Python and TypeScript; run the tests in interviews/coframe_builds/), then platform and Coframe-shaped design. "
              "3. 'Test me' until the weak squares turn. 4. Round 1's questions are on the Rounds tab. "
              "5. Say 'run the Coframe mock' in chat for a live coding and design rehearsal. "
              "Your own system at depth is on the <a href=\"../ALFRED.html\" target=\"_blank\" rel=\"noopener\">alfred_ page</a>."),
}

SESSION_IDS = []

PREP_LEAD = ("Fifteen minutes. Read how to show up, then say your story out loud: the intro in ninety seconds and "
             "in thirty, why Coframe, why leave, and the one story. The banks are for the questions after.")

SHOW_UP = [
    ("Have the bench ready.", "A clean repo open in VS Code or Cursor, a terminal, Python 3.12 and Node 22 working, Claude Code or Codex logged in, font size up, screen share tested."),
    ("Clarify before you build.", "Restate the task, ask the one or two questions that change the design (the limit, the input, what 'done' looks like), then say your plan in three steps."),
    ("Drive the tool, don't follow it.", "Small, testable asks; read every diff; run it yourself; say what you are checking while it works, and what you would never hand it (auth, money, deletes, migrations)."),
    ("Ship something that runs, then improve it.", "A working thin version early beats a perfect half; keep a fallback for the hard limit (a timeout and a default)."),
    ("Close with productionization.", "Where the state lives, what breaks first at 100x, timeouts, idempotency, tracing, cost: the question every Coframe take-home ends on."),
    ("Have opinions, and say the gaps.", "Pick an approach and say why; name what you haven't built (a sandbox fleet, remote browsers, a bandit in production) and how you'd learn it."),
    ("End with a real question.", "Ask about their stack for durable agent runs and remote browsers, or what the first 90 days of this role would fix."),
]

STORY_BLURB = "Your career in ninety seconds and in thirty, why Coframe, why leave alfred_, what you are working on, your days at alfred_, the background, and logistics."

# Every outside link, checked 2026-09-29. Coframe's own pages first, then the news.
SOURCES = [
    {"label": "Agent Platform Engineer: the job post (Ashby)", "url": "https://jobs.ashbyhq.com/Coframe/9edc35b8-e381-4c93-b9d9-ed6ac5c578de",
     "why": "On site in the SF Bay Area (Burlingame on the posting). Infrastructure for long-running agents, isolated execution, tracing and evaluation, durable workers and remote browsers, CI/CD, and internal platforms for non-engineering teams. Names Dropbox, Replit and Intuit as customers."},
    {"label": "Agent Engineer: the sibling role's post (Ashby)", "url": "https://jobs.ashbyhq.com/Coframe/c20a12c1-0aa6-4e37-80ef-63b3fbd48d47",
     "why": "The engineers who build what the agents do. The platform role builds what they run on."},
    {"label": "Coframe: company site", "url": "https://coframe.com/",
     "why": "Agents that generate, test and personalize website variations: copy, code and visuals. Case studies for Replit and StartEngine."},
    {"label": "Coframe careers: values", "url": "https://coframe.com/careers",
     "why": "Agency, Velocity, Truth-seeking, Growth. 'A small, talent-dense team'."},
    {"label": "Coframe and OpenAI: a UI code generation model and benchmark (1 October 2024)", "url": "https://coframe.com/post/coframe-openai-ui-code-generation-model",
     "why": "A fine-tuned GPT-4o vision model for on-brand UI code; BrandBench, an LLM-as-judge benchmark of 194 held-out sites; 26% better than the base model."},
    {"label": "Predicting website experiment winners (7 August 2026)", "url": "https://coframe.com/post/predicting-website-experiment-winners",
     "why": "Each design pair judged in both orders so a model gets no credit for position bias; 57.28% on the benchmark, 36 to 40% on production data, and they say so."},
    {"label": "Replit case study (23 March 2026)", "url": "https://coframe.com/post/driving-410-conversion-lift-for-replit",
     "why": "410% conversion lift on the enterprise funnel; experiments shipped in hours, not sprints."},
    {"label": "Coframe acquires Haystacks (4 March 2026)", "url": "https://coframe.com/post/coframe-acquires-haystacks",
     "why": "Names the AI Growth Agent: ideas, design, engineering, QA and analysis end to end. Mentions Dropbox and Replit."},
    {"label": "Coframe raises $9.3 million seed (Yahoo Finance, 29 October 2024)", "url": "https://finance.yahoo.com/news/coframe-raises-9-million-websites-130406581.html",
     "why": "Led by Khosla Ventures and NFDG (Nat Friedman and Daniel Gross). Josh Payne is the CEO."},
    {"label": "Coframe appoints a Chief Business Officer (press release, 3 November 2025)", "url": "https://natlawreview.com/press-releases/coframe-appoints-scott-tieman-chief-business-officer-accelerate-growth-and",
     "why": "Josh Payne previously co-founded Autograph. Expanding into e-commerce, retail, travel and financial services."},
]

# The Overview: the company and the role, from the posting (Ashby's public feed, read 2026-10-01).
COMPANY = [
    "Coframe builds agents that optimize websites: they come up with ideas, then design, code, test and ship A/B tests, landing pages and personalization, without the customer's engineers building each one. Customers include Dropbox, Replit and Intuit; they report $221.4M in incremental revenue for customers over six months, and 120% growth a quarter.",
    "Small and talent-dense, primarily in person in San Francisco, before its Series A. Backed by Khosla Ventures, Nat Friedman and Rich Miner. They co-train a model with OpenAI for UI code. The CEO, Josh Payne, co-founded a unicorn before.",
]

POSTING = {
    "url": "https://jobs.ashbyhq.com/Coframe/9edc35b8-e381-4c93-b9d9-ed6ac5c578de",
    "label": "Agent Platform Engineer, on Ashby",
    "checked": "1 October 2026",
    "lead": "Build the infrastructure, tooling and workflows that let AI agents run safely, reliably and at scale: agents that build customer interfaces, agents that work on Coframe's own codebase, and agents that automate engineering, go-to-market and operations.",
    "facts": [["Where", "SF Bay Area, on site; primarily in person"], ["Pay", "$180K to $300K, plus equity (the posting)"], ["Stage", "Before Series A; Khosla Ventures, Nat Friedman, Rich Miner"]],
    "does": [
        "Infrastructure for long-running agent execution, memory, planning, and stop-and-resume workflows.",
        "Platforms where agents implement features, run tests in isolated environments, read their execution traces and improve their own output.",
        "Secure, isolated execution environments.",
        "Tracing, observability, evaluation and monitoring for autonomous agents.",
        "Durable workers, serverless compute and remote browsers.",
        "Developer tooling for engineers working with agents; CI/CD, testing, deployment and dev environments.",
        "Internal AI platforms so non-engineering teams build their own agents.",
        "Production incidents: the immediate fix and the long-term one.",
    ],
    "wants": [
        "A strong platform or infrastructure background and solid fundamentals.",
        "Distributed systems, developer platforms, internal tooling or compute infrastructure.",
        "Cloud, serverless, CI/CD, end-to-end testing and production deployment.",
        "Deploying, scaling, profiling and operating agents or LLM systems in production.",
        "Long-running execution, durable workers, isolated environments, remote browsers, stateful workflows.",
        "Judgement across security, reliability, performance, cost and iteration speed.",
        "High ownership in ambiguous, fast-moving work. Infrastructure for AI agents is a major plus.",
    ],
}

# What each round asked, as he reported it. A record, not a mock.
ROUNDS = [
    {"title": "Round 1: recruiter screen",
     "when": "Thursday 1 October 2026, 2:20 PM Eastern",
     "who": "Neesha Malik, Founding Talent",
     "format": "Fifteen minutes on Google Meet, quick-fire: six questions, most of them technical for a recruiter screen.",
     "outcome": "You think it landed and expect to be put forward.",
     "notes": ["She opened on why you're looking, which took you aback; you handled it. Expect the same opener from the team, so the answer below is worth having cold."],
     "asked": [
         {"q": "Why are you looking for a new opportunity?", "short": "The opener",
          "said": ["Handled, after a moment's surprise that it came first."],
          "land": "Not away from alfred_; toward the platform under agents as the whole job.",
          "keep": ["There's nothing particularly wrong with alfred_. I've learned a lot there and I still enjoy the work.",
                   "What I'm increasingly interested in is the platform underneath agents: execution, isolation, evaluation and reliability that many agents depend on, not one. That's this role. So it's less getting away from alfred_ and more a direction I want to go deeper into."],
          "prep": "say-leave"},
         {"q": "What have you personally shipped in orchestration, delegation, and isolation or sandboxing?", "short": "Shipped, by name",
          "said": ["Orchestration and delegation at alfred_, the workers, and isolation."],
          "land": "One shipped thing for each word she used, then the gap.",
          "keep": ["Orchestration: the agent loop and its multi-turn rewrite, which I signed off with the eval bench.",
                   "Delegation: the voice agent, where a lean agent answers on the call while our main agent works the same request in parallel; and lean Python workers on Railway, each with one job, claiming work from a queue.",
                   "Isolation: each worker job runs in its own environment, and the eval harness runs the real agent against an isolated copy of a user's world with no path to live systems. Sandboxed code execution and remote browsers I haven't built yet."],
          "prep": "q-what-platform-and-agent-engineering-experience-do-you-have-a"},
         {"q": "What evaluation harness have you worked on?", "short": "The eval harness",
          "said": ["The alfred_ eval harness."],
          "land": "Real failures become cases; the real agent runs on a frozen copy of the user's world; it signed off a rewrite.",
          "keep": ["At alfred_ I built a harness that replays real user tasks against a new version of the agent before it ships: a little over a hundred cases, each from a real production failure, each running the real agent against a frozen copy of that user's email and calendar.",
                   "That's how we signed off the multi-turn rewrite: we could see which cases got better and which got worse, and tool calls per task went from about 2.5 to 2.2. A scanner reads real conversations every day, so the set grows with what users actually hit."],
          "prep": "say-now"},
         {"q": "What have you personally owned in these projects?", "short": "Ownership",
          "said": ["What you owned across them."],
          "land": "Name the things that are yours, plainly, and say the team is four.",
          "keep": ["We're four engineers, so ownership is real. Mine: the eval harness and the production failure scanner, working memory, the voice agent end to end, and a lot of the worker infrastructure underneath. I decided what to build in each, built it, and run it in production."]},
         {"q": "How do you think about latency and cost, and how do you design for them?", "short": "Latency and cost",
          "said": ["Workflows: creating one is the expensive part; running it is cheaper because the steps are known and mostly deterministic. Start from the most expensive setup to make it as good as possible, harden the workflow, then scale back and decide where you need what."],
          "land": "Spend where the thinking is, make the repeat cheap, step down only where evals say quality holds.",
          "keep": ["I start from where the thinking actually happens. In our workflows, creating one is the expensive part, so it gets the strongest model. Running it is cheap, because the steps are known and mostly deterministic.",
                   "So I start with the best model everywhere to get it right, harden the workflow, then step down stage by stage where the evals say quality holds. Latency works the same way: keep the critical path small and stream it, and push slow work off it. On voice, a lean agent answers on the call while the heavy one works in parallel."],
          "notes": ["Name the check that makes stepping down safe: the evals. Without it, 'scale back' sounds like a guess."]},
         {"q": "How do you make agent runs retryable and durable?", "short": "Retries and durability",
          "said": ["A policy matrix of what a run does: native or third-party integrations, delivering somewhere else, research such as web search, read-only or writing, and if writing, whether a rewrite is OK. The retry design follows from that."],
          "land": "Classify what the run touches; the class decides the retry; writes carry a key; the queue makes it durable.",
          "keep": ["I start by classifying what the run touches: only our own system, third-party integrations, or delivering somewhere outside; and whether it reads, does research like web search, or writes, and if it writes, whether doing it twice is harmless.",
                   "That decides the retry. Reads and research retry freely with backoff. A write carries an idempotency key, so a retry returns the stored result instead of acting twice. Anything that can't safely repeat waits for the person to confirm.",
                   "Durability is the queue: jobs sit in Postgres, a worker claims one with SKIP LOCKED, a job that dies becomes claimable again, and a scheduled sweep catches anything missed."],
          "notes": ["Check before the next round: how alfred_ marks a job claimable again after a crash (pgmq's visibility timeout or your own sweep), so you say it exactly."]},
     ]},
    {"title": "Round 2: technical exercise",
     "when": "Friday 9 October 2026, one hour (time from your booking)",
     "who": "Pavlo Razumovskyi, technical co-founder",
     "format": "One hour: coding, system design and technical conversation, in Python and TypeScript. AI tools encouraged; read and run Python and TypeScript; share microphone, camera and screen.",
     "outcome": "Not yet held.",
     "notes": ["Before the day: an editor (VS Code or Cursor) with Python 3 and Node with TypeScript (tsx or ts-node) that run a script in one command; Claude Code signed in and working in that folder; a screen share tested in the browser with camera and microphone.",
               "Expect to read, run, fix or extend Python and TypeScript, and to talk through the agent-platform judgement from round 1 on real code: isolated execution, retries and durability, tracing, latency and cost. Round 1's questions below are the ones most likely to come back in more depth.",
               "Say out loud how you use the AI tool and how you check its output: run it, read the diff, test it. That is part of what they are watching."],
     "asked": []},
]

# Your story, in your words. Items marked "verbatim" are Pranav's own text: never polish them.
SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. She is checking the resume is real and how clearly you tell it. It should land on why this role.",
     "probes": ["What does alfred_ do?", "What do you own there?", "Why are you looking?", "Why Coframe?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And that's pretty much why Coframe is interesting to me. At alfred_ I've ended up working on the layer underneath the agent: the evals, the reliability, the infrastructure it runs on. The Agent Platform role is that layer, at a company where the whole product is agents."],
     "swaps": [{"when": "If she asks what alfred_ is, in a line", "line": "An AI executive assistant that works over text message. It handles people's email and calendar end to end, for 5,000-plus active users."},
               {"when": "If she asks what you own", "line": "The reliability side of the agent: the eval harness, the scanner that catches production failures, working memory, and a lot of the infrastructure it runs on."}],
     "land": "Research, then shipping products, then the layer under a production agent. Coframe is that layer where the whole product is agents.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged from ZenML. Only the last line is new, pointed at Coframe.",
               "About ninety seconds. Stop after the last line and let her pick where to go.",
               "Numbers if she asks: 5,000-plus active users at alfred_; 10 to 20 thousand daily readers on the WheelPrice blog."],
     "never": ["Never mention alfred_'s funding, a crunch, or colleagues' names.", "No filler: 'so to say', 'essentially', 'in a sense'."]},

    {"id": "intro-short", "title": "The thirty-second version", "length": "about 30 seconds",
     "when": "If she says 'briefly', or the call starts late. Same arc, outcomes only.",
     "probes": ["Give me the short version.", "What do you do now?"],
     "say": [
         "I'm a founding LLM engineer at alfred_, an AI executive assistant that works over text message. It handles people's email and calendar end to end, for 5,000-plus active users.",
         "I own a lot of what sits under the agent: the eval harness, a scanner that catches production failures, working memory, and the reliability work.",
         "Before that I shipped products at WheelPrice, a small startup, and did applied ML and LLM research at UIC.",
         "The Agent Platform role is pretty much the layer I already work at, and I'd like to build it where the whole product is agents."],
     "land": "Founding LLM engineer, the layer under a production agent, and this role is that layer.",
     "notes": ["New, in your voice, from his brief's pitch. Four sentences; stop after the last one."]},

    {"id": "why-coframe", "title": "Why Coframe? Why this role?", "length": "about 60 seconds",
     "when": "Straight after the intro, or when she finishes her pitch. She wants to hear you know what they do and why it fits you.",
     "probes": ["What do you know about us?", "Why Agent Platform and not Agent Engineer?", "What would you want to work on first?", "Are you talking to other companies?"],
     "say": [
         "Honestly, a couple of things. The first is that at Coframe the agents are the product. From what I read, your agents design, code, test and ship website experiments for companies like Dropbox, Replit and Intuit. So the platform they run on isn't a side project; everything else stands on it.",
         "The second is the role itself. The posting talks about long-running agent execution, stop-and-resume, isolated environments, tracing and evaluation. That's pretty much the layer I've been working at, at alfred_: the agent loop, the workers for long jobs, the eval harness and the failure scanner. I've built it for one assistant. Here it would serve every agent you run, including the ones working on your own codebase.",
         "And I like that the work gets measured. Your product is judged on conversion lift, which is a real number, and I think that's the right pressure for an agent platform.",
         "So it's a problem I already care about, with a lot more agents on top of it."],
     "swaps": [{"when": "If she asks what stood out from what you read", "line": "The post on predicting experiment winners. They judged each pair of designs in both orders so a model couldn't score on position bias, and they said openly that accuracy dropped on production data. That's the kind of eval honesty I care about."},
               {"when": "If she asks why platform and not agent engineer", "line": "The agent engineers build what the agents do. The platform is what they run on: execution, isolation, tracing, evals. At alfred_ the part I've owned most is the second one, so that's where I'd add the most."}],
     "land": "The agents are the product, and the platform is the layer I already work at.",
     "notes": ["New, in your voice. Facts from the posting and Coframe's own posts (Sources): agents that design, code, debug and deploy tests, landing pages and personalization; customers Dropbox, Replit and Intuit; agents also contribute to Coframe's own codebase.",
               "Say 'from what I read', not 'I know'."],
     "never": ["Don't quote their revenue claims as fact. If you use one, 'they report'."]},

    {"id": "leave", "title": "Why are you looking to leave alfred_?", "length": "about 45 seconds",
     "when": "You are exploring while employed. Make that clear without sounding defensive.",
     "probes": ["Is something wrong at alfred_?", "You've only been there since April. Why move so soon?", "Will you leave us quickly too?"],
     "say": [
         "There's nothing particularly wrong with alfred_. I've actually learned a lot there and I still enjoy the work.",  # verbatim
         "I'm mostly looking at what I want the next few years of my career to look like. At alfred_, I've had a lot of ownership because it's a small team, and that's been great. But the work is ultimately internal to one product.",  # verbatim
         "What I'm increasingly interested in is the platform underneath agents: the execution, evaluation and reliability layer that a lot of agents depend on, not one. That's why this role caught my attention. It's very close to problems I've already been solving, but the platform is the thing I'd be building.",
         "So it's less “I need to get away from Alfred” and more “I've found a direction I want to go deeper into.”"],  # verbatim
     "swaps": [{"when": "If she asks bluntly: why not stay?", "line": "I could. And that's why I'm being selective about what I talk to. I'm not looking to leave just to change companies. It has to give me a meaningfully different scope, and going from one agent to a platform that every agent runs on does."},
               {"when": "If she asks: only since April, why so soon?", "line": "Fair question. It's been a very dense six months, and the reliability pieces I built there are running. I'm not in a rush; I'm talking to very few places, because the scope has to be genuinely different."}],
     "land": "Less “get away from alfred_”, more “a direction I want to go deeper into”.",
     "notes": ["Paragraphs 1, 2 and 4 are your words, unchanged. Paragraph 3 named Kitaru's developer infrastructure; it now names the agent platform.",
               "Pay, visa and start date are prepared in chat, not on this public page."]},

    {"id": "now", "title": "What are you working on right now?", "length": "about 60 seconds",
     "when": "One concrete production story, told for someone who isn't an engineer. Outcome first, then how, then the number.",
     "probes": ["What was the result?", "What was your part?", "How do you know it worked?"],
     "say": [
         "Right now most of my work is about making sure a change to our agent actually makes it better, not worse.",
         "The clearest example: we rewrote how the agent handles back-and-forth conversations. That's too big a change to test by trying it a few times. So I built a way to replay real user tasks against the new version before it ships: a little over a hundred cases, each one taken from a real failure in production, each running the real agent against a frozen copy of that user's email and calendar.",
         "That's how we signed off the rewrite. We could point at exactly which cases got better and which got worse, and the agent got to the same results in fewer steps: about 2.5 tool calls per task, down to 2.2.",
         "And the cases keep coming from production. A scanner reads real conversations every day and flags the ones that went wrong, so the test set grows with what users actually hit."],
     "swaps": [{"when": "If she wants a win users felt", "line": "Texts about important emails used to arrive about ninety seconds after the email. The delay was a timer, not the work, so I made the text go out the moment it's queued. It's about three seconds now."},
               {"when": "If she asks what 'tool calls per task' means", "line": "How many actions the agent takes to finish a job. Fewer, for the same result, means it found the answer more directly."}],
     "land": "We shipped a full rewrite of the agent with evidence it got better, because every change runs against real cases first.",
     "notes": ["New, in your voice, from the bench story. Keep the words 'SQLite', 'snapshot' and 'harness mode' out of it unless she asks how.",
               "Facts: a little over a hundred cases; the scanner runs daily; 2.5 to 2.2 tool calls per completed task; it signed off the multi-turn orchestration rewrite; notifications about 90 seconds to about 3."]},

    {"id": "alfred-day", "title": "What does your day-to-day look like at alfred_?", "length": "about 60 seconds",
     "when": "How much you code, what 'founding LLM engineer' means, what you personally own.",
     "probes": ["How much do you actually code?", "What does “founding LLM engineer” mean?", "What did you personally own?"],
     "say": [  # verbatim
         "It's pretty varied, which is one of the things I like about the role.",
         "A typical piece of work might start with a production failure. I'll look at the conversation and the tool trace, figure out whether it's a model problem, a tool problem, or something in our orchestration or memory layer.",
         "If it's something we need to reproduce, I'll add it to the eval harness. The harness takes a snapshot of the relevant user environment — email, calendar, whatever the task needs — and lets the actual agent code run against that state. So we're testing the same tool paths we use in production rather than mocking the whole agent.",
         "Then I'll usually build the fix, run the regression set, and look at whether we've actually improved the behavior without breaking something else.",
         "I've also worked on the production failure scanner, working memory, reliability infrastructure, and some of the cost and orchestration pieces.",
         "So it's a mix of debugging production behavior, building infrastructure, writing product code, and figuring out what we should build next."],
     "swaps": [{"when": "If she asks “how much coding?”", "line": "A lot. I'm usually in the codebase every day. The difference is that because we're a small team, the coding is usually preceded by figuring out what the right thing to build is."}],  # verbatim
     "land": "The coding is usually preceded by figuring out what the right thing to build is.",
     "notes": ["Your own words, unchanged from ZenML.", "For a recruiter, the swap line is the one to keep: it says senior without saying senior."]},

    {"id": "background", "title": "Walk me through your background", "length": "about 60 seconds",
     "when": "The resume, in order, with a reason for each move. She is checking the dates and titles line up.",
     "probes": ["What did you do at UIC?", "Why did you leave WheelPrice?", "Why alfred_?", "Are you a job hopper?"],
     "say": [
         "At UIC I did my master's and worked in a research lab on applied ML and LLM systems. One project, MetaRAG, a retrieval framework for enterprise knowledge, ran in a production code-translation use case at about ten thousand queries a day, and the paper was accepted at IEEE CAI. Another was multi-agent reasoning for medicine.",
         "Then WheelPrice. It was two engineers, so I owned a lot: a blog and content system that got to 10 to 20 thousand daily readers, and an AI fitment assistant that could only answer through tools against verified data.",
         "But the work I kept enjoying most was the AI systems side, and there it was one of many hats. alfred_ was a founding team with an agent in production and real users, and the reliability of that agent was mine to own. So it was a move toward depth in the same direction, not away from anything."],
     "swaps": [{"when": "If she asks whether you're a job hopper", "line": "Fair question. Both moves were toward the same thing, more depth in AI systems and more ownership, and each one widened the scope. This one would make the platform the whole job."},
               {"when": "If she asks the dates", "line": "WheelPrice from July 2025 to March 2026; alfred_ since April 2026."}],
     "land": "Research, then broad ownership at a two-person startup, then depth in agents in production.",
     "notes": ["From your WheelPrice and MetaRAG answers, in your voice. Say it plainly and move on.",
               "If she asks for MetaRAG's numbers: 82.5% precision, 0.925 Hit@10, 25% fewer hallucinations."]},

    {"id": "logistics", "title": "Logistics she will ask", "length": "a line each",
     "when": "Usually near the end. Your answers are in chat, not on this public page. How to handle each is below.",
     "probes": ["Where are you based, and would you relocate?", "The role is on site. Does that work?", "What are you looking for in compensation?",
                "Do you need sponsorship?", "When could you start?", "Are you interviewing elsewhere?"],
     "say": [],
     "land": "Say each once, in one sentence, then go back to the role.",
     "notes": ["**Location and relocation:** one sentence with your answer from chat; if she asks about timing, give it, then stop.",
               "**On site:** the posting says on site in the SF Bay Area and 'primarily in-person'. Ask her to confirm the office and the days, then answer in one sentence.",
               "**Compensation:** have your number ready; say it once; ask about the range for the role. Don't negotiate on this call.",
               "**Work authorization:** only if she asks. One sentence, then back to the role.",
               "**Start date:** your answer from chat, in one line.",
               "**Other interviews:** 'A few conversations, and I'm being selective.' No names."],
     "never": ["Don't raise work authorization, pay or relocation before she does.", "Don't explain or justify a logistics answer; the explanation invites the next question."]},
]

# The questions after the story. Each answer is short and in plain words.
# The Prep bank now lives in one learning path with the round-2 research: interviews/coframe.learn.json
# (Learn tab), built 3 October 2026; code in interviews/coframe_builds/. The old bank is in git history.
QA = []
TABS = ["overview", "learn", "live", "rounds", "mocks"]

LIVE_LEAD = [
    "The invite: a technical exercise of about 30 to 40 minutes with Pavlo, in Python and TypeScript, with your own AI tools. Each repo below is handed over the way he might hand one over: a short, vague request, working but naive code, and a harness that shows what is wrong. The design is yours to find.",
    "Run one: open a new Claude Code session in the repo's folder, then say **start mock: <name>** in this chat. Here I play Pavlo: ask him anything you would ask in the room, and he answers like he would, which is not with the design. Say **debrief** when you stop; the critique comes then.",
]

LIVE = [
    {"id": "storefront", "title": "Storefront: pages that fit the visitor", "lang": "TypeScript", "minutes": 40,
     "ask": "Here's a little storefront. Visitors show up with some context about who they are, and right now everyone gets the same page. Make the page fit the visitor. Oh, and the whole page has to render in under five seconds.",
     "start": ["Folder: `E:\\coframe-live\\storefront-ts`. Run `npm install` once.",
               "Open a new Claude Code session there. In this chat: **start mock: storefront**.",
               "Read the README, ask Pavlo what you need, then build. `npm run harness` is the scoreboard."],
     "after": ["How you would run this at thousands of visitors a minute.", "How you would know the tailored page is better than the default."]},
    {"id": "jobs", "title": "Agent jobs: make them reliable", "lang": "Python", "minutes": 40,
     "ask": "We run coding agents as background jobs on a few workers. It mostly works, but jobs go missing and some pull requests get the same comment twice. We deploy a few times a day. Make it reliable.",
     "start": ["Folder: `E:\\coframe-live\\agent-jobs-py`. Python only, nothing to install.",
               "Open a new Claude Code session there. In this chat: **start mock: jobs**.",
               "`python harness.py` runs the fleet under deploys and reports stuck jobs and duplicate comments."],
     "after": ["The same design on Postgres with many machines.", "What you would still worry about."]},
    {"id": "experiments", "title": "Experiments: fix the loop end to end", "lang": "TypeScript and Python", "minutes": 40,
     "ask": "A customer is running a three-variant test. The edge picks the variant, an hourly job updates the weights. They say visitors see different versions when they come back, and our numbers are higher than theirs. Also they'd like the winner found sooner. Can you fix it?",
     "start": ["Folder: `E:\\coframe-live\\experiments-mixed`. Node 22 and Python 3.12, nothing to install.",
               "Open a new Claude Code session there. In this chat: **start mock: experiments**.",
               "`python sim.py` runs 12 simulated hours and reports flips, counted against real conversions, and the winner's share."],
     "after": ["Hundreds of experiments and millions of visits a day.", "How the edge gets new weights, and two experiments on one page."]},
]

# Questions you ask, three groups: for Neesha and the process, about the Agent Platform team,
# and about the company. One or two in total on a fifteen-minute call; the rest are spares.
ASK_3C = [
    {"id": "process", "title": "For Neesha, and the process", "when": "At the end, first. Around minute eleven.",
     "why": "She decides whether to pitch you. Asking how she decides, and inviting a concern, is what senior candidates do: it shows you want to meet the bar, not only pass the call.",
     "how": ["Ask one, then listen fully.", "If she raises a concern, answer it in two sentences; don't argue it."],
     "items": [
         {"to": "Neesha", "q": "What does the rest of the loop look like after today, and roughly what's the timeline?",
          "loop": "Your first question at the end, always.", "why": "Practical, and shows you're planning to go further."},
         {"to": "Neesha", "q": "When you bring someone to the team, what makes them stand out?",
          "loop": "After the timeline, if there's a minute.", "why": "It tells you what to lead with in the next round."},
         {"to": "Neesha", "q": "Is there anything in my background you'd want me to make clearer before you put me forward?",
          "loop": "Last, before she closes.", "why": "Inviting a concern while there's time to answer it is the most senior move on a screen."}]},
    {"id": "team", "title": "About the Agent Platform team", "when": "If she has sold the role and there's time. One question.",
     "why": "It shows you think about scope and how the work gets judged. If she doesn't know, that's fine: ask who in the loop would.",
     "how": ["Bridge from her pitch: 'You mentioned X...'", "If she says it's a question for the team, ask who you'd meet."],
     "items": [
         {"to": "Neesha", "q": "What does the platform team own, compared with the engineers building the agents themselves?",
          "loop": "After she describes the role.", "why": "Scope first: it shows you know there are two roles and where the line sits."},
         {"to": "Neesha", "q": "What's the hardest problem on the agent platform right now?",
          "loop": "If she's technical enough to answer; otherwise save it for the team.", "why": "You want the hard problem, not the perks."},
         {"to": "Neesha", "q": "How do agents get checked before a change ships, and how do you catch a regression after?",
          "loop": "Save for the technical rounds if she hesitates.", "why": "Your strongest area, asked as curiosity."},
         {"to": "Neesha", "q": "How big is the team, and who would I work with most?",
          "loop": "Any time she mentions the team.", "why": "Plain and useful; tells you the size of the job."}]},
    {"id": "company", "title": "About the company", "when": "Only if she opens the door, or there's time left over.",
     "why": "It shows you think about the customer, not only the code. Keep it to one.",
     "how": ["One question, then let her talk."],
     "items": [
         {"to": "Neesha", "q": "What do customers actually buy: the experiments, the lift, or the time saved?",
          "loop": "After she mentions a customer.", "why": "Commercial sense; it tells you what the platform is measured against."},
         {"to": "Neesha", "q": "Beyond the product, where do agents run inside Coframe today: your own codebase, go-to-market?",
          "loop": "If she talks about how the company works.", "why": "The posting says the platform serves both; you read it."},
         {"to": "Neesha", "q": "What's next for the product over the next year?",
          "loop": "Last, if nothing else fits.", "why": "Shows you're thinking about staying, not only joining."}]},
]
ASK = []

TRAPS = [
    ("Going deep technically", "She is listening for outcomes and scope. Leave out frameworks, queues and table names unless she asks how."),
    ("Rambling past ninety seconds", "Stop after the last line of the intro. Fifteen minutes has no room for a three-minute answer."),
    ("Raising work authorization first", "Only if she asks. One sentence, then back to the role."),
    ("Bluffing about Coframe", "Say 'from what I read'. If you don't know, ask; she is there to tell you."),
    ("Confusing her with someone else", "Another Neesha Malik works at a different company in New York. Nothing about her applies; use only what Coframe publishes."),
    ("Quoting their numbers as fact", "Revenue and lift figures are theirs: 'they report'."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "intro-short", "prompt": "Tell me about yourself, briefly.", "target": "30 seconds", "seconds": 30, "ref": "#say-intro-short"},
    {"id": "why-coframe", "prompt": "Why Coframe, and why Agent Platform?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-coframe"},
    {"id": "leave", "prompt": "Why leave alfred_ after six months?", "target": "45 seconds", "seconds": 45, "ref": "#say-leave"},
    {"id": "now", "prompt": "What are you working on right now? For someone who isn't an engineer.", "target": "60 seconds", "seconds": 60, "ref": "#say-now"},
]

MOCK_HOW = "For a live build with Pavlo, use the Live build tab. For the whole hour, say 'run the Coframe mock' in chat: Pavlo, technical, about 45 minutes: a small live build in Python or TypeScript with AI tools, then productionization and platform design."

WATCH = {"title": "System design refreshers, in order", "layout": "rows",
    "lead": "Watch in this order: vocabulary, then contracts and safe retries, then multi-step work and durable execution, then two full designs on rate and events, then tracing and isolation, then delivery and deployment. Each card says how it ties to Coframe and this role. Caching and failure are left for weeks 4 and 5.",
    "items": [
        {"kind": "video", "req": False, "label": '1. Top 7 most-used distributed system patterns', "url": "https://www.youtube.com/watch?v=nH4qjmP2KEE", "m": 7, "why": "Start here: seven minutes of vocabulary (circuit breakers, sidecars, sharding, pub-sub and more) that every later video assumes. For Coframe it is the language Pavlo will use when he asks how you would scale a pipeline that generates and ships hundreds of thousands of interfaces, so you can answer in patterns instead of your own stack's names.", "yt": {"id": "nH4qjmP2KEE", "ch": 'ByteByteGo'}},
        {"kind": "video", "req": False, "label": '2. API design in system design interviews', "url": "https://www.youtube.com/watch?v=DQ57zYedMdQ", "m": 29, "why": 'Next, the contracts between services: resources, 202 Accepted with polling for slow work, pagination, idempotency keys. Agent jobs are slow and retried, so every Coframe endpoint that starts a generation or a deploy needs exactly these choices, and his take-homes end by asking you to defend yours.', "yt": {"id": "DQ57zYedMdQ", "ch": 'Hello Interview'}},
        {"kind": "video", "req": False, "label": '3. Payments with idempotency keys', "url": "https://www.youtube.com/watch?v=m6DtqSb1BDM", "m": 17, "why": "Then the one idea that makes retries safe, shown on payments where getting it wrong costs money. An agent that opens a pull request, posts a comment or pushes a variant live does side effects under at-least-once delivery; this is the fix for alfred_'s duplicate reply and for the agent-jobs live repo.", "yt": {"id": "m6DtqSb1BDM", "ch": 'Arpit Bhayani'}},
        {"kind": "video", "req": False, "label": '4. Concurrency in low-level design interviews', "url": "https://www.youtube.com/watch?v=d8rmosXttTE", "m": 23, "why": 'Concurrency at the code level: races, check-then-act, locks and atomic claims. Two workers grabbing the same agent job, or two agents editing the same variant, are this bug; it is what Pavlo can watch you catch in an AI-written diff on Friday.', "yt": {"id": "d8rmosXttTE", "ch": 'Hello Interview'}},
        {"kind": "video", "req": False, "label": '5. Distributed transactions: 2PC against Saga', "url": "https://www.youtube.com/watch?v=DOFflggE_0Q", "m": 15, "why": 'How a multi-step change stays consistent across services: two-phase commit against sagas with compensation. A Coframe run (generate, approve, deploy, monitor) is a saga: when a later step fails, the earlier ones need undoing, such as rolling a variant back.', "yt": {"id": "DOFflggE_0Q", "ch": 'Hello Interview'}},
        {"kind": "video", "req": False, "label": '6. Durable execution: Temporal and Inngest', "url": "https://www.youtube.com/watch?v=GT9k8OSjzX8", "m": 19, "why": "Sagas made into a runtime: event history, replay and steps that survive crashes. This is the posting's first line, long-running agent execution with stop and resume, and the clean contrast with alfred_'s claim-and-lease jobs.", "yt": {"id": "GT9k8OSjzX8", "ch": 'Jordan has no life'}},
        {"kind": "video", "req": False, "label": "7. Temporal's durable execution at Stripe", "url": "https://www.youtube.com/watch?v=0yZAqIsyskA", "m": 23, "why": 'The same idea in production at a company where correctness is money. Watch it for the operational side (versioning running workflows, retries, visibility), which is what an agent platform engineer owns after the first demo works.', "yt": {"id": "0yZAqIsyskA", "ch": 'Stripe Developers'}},
        {"kind": "video", "req": False, "label": '8. Design a distributed rate limiter', "url": "https://www.youtube.com/watch?v=MIJFyUPG4Z4", "m": 56, "why": "The first full design: counters, token buckets, consistency across nodes. An agent fleet lives under model-provider rate limits and needs per-tenant quotas so one customer's batch cannot starve the rest, so this design maps straight onto Coframe's model gateway.", "yt": {"id": "MIJFyUPG4Z4", "ch": 'Hello Interview'}},
        {"kind": "video", "req": False, "label": '9. Design an ad click aggregator', "url": "https://www.youtube.com/watch?v=Zcv_899yqhI", "m": 63, "why": 'Ingesting a firehose of events and counting them exactly once, in batch and stream. Coframe counts exposures and conversions for its Thompson sampler every hour; double counting skews which variant wins, as the experiments live repo shows.', "yt": {"id": "Zcv_899yqhI", "ch": 'Hello Interview'}},
        {"kind": "video", "req": False, "label": '10. Distributed tracing in microservices', "url": "https://www.youtube.com/watch?v=XYvQHjWJJTE", "m": 8, "why": 'Spans, trace ids and following one request through many services. The posting asks for agents that analyse their own execution traces, and a trace per agent run is how you debug a fleet; your alfred_ tracing story starts here.', "yt": {"id": "XYvQHjWJJTE", "ch": 'ByteMonk'}},
        {"kind": "video", "req": False, "label": "11. How AWS's Firecracker virtual machines work", "url": "https://www.youtube.com/watch?v=BIRv2FnHJAg", "m": 22, "why": "Why a microVM is the boundary for running code you did not write, from the team that built Lambda's isolation. Coframe's agents write and run code; the posting's 'secure, isolated execution environments' is this.", "yt": {"id": "BIRv2FnHJAg", "ch": 'Amazon Science'}},
        {"kind": "video", "req": False, "label": '12. VMs against containers against Firecracker', "url": "https://www.youtube.com/watch?v=pTQ_jVYhAoc", "m": 30, "why": 'The trade-off laid side by side: start time, density, isolation. If Pavlo asks how you would sandbox agent code, the answer is a choice on this spectrum with reasons, not a product name.', "yt": {"id": "pTQ_jVYhAoc", "ch": 'Cloud Native Rejekts'}},
        {"kind": "video", "req": False, "label": '13. Design LeetCode (online judge)', "url": "https://www.youtube.com/watch?v=1xHADtekTNg", "m": 64, "why": 'The full design that combines the last three: queue submissions, run untrusted code in isolation, return results under load. It is the closest standard interview design to an agent platform that executes tests in isolated environments.', "yt": {"id": "1xHADtekTNg", "ch": 'Hello Interview'}},
        {"kind": "video", "req": False, "label": '14. What is a CDN? How does it work?', "url": "https://www.youtube.com/watch?v=RI9np1LWzqw", "m": 5, "why": "Edges, caches and why distance matters. Coframe delivers variants onto customers' pages through a script at the edge, and the 5 second just-in-time page in his take-home only works with cached results near the visitor.", "yt": {"id": "RI9np1LWzqw", "ch": 'ByteByteGo'}},
        {"kind": "video", "req": False, "label": '15. A/B testing and experimentation platform', "url": "https://www.youtube.com/watch?v=YlIQ9GcRYXk", "m": 84, "why": "Coframe's product as a design question: assignment, exposure logging, metrics, guardrails. Long, so skim it for the assignment and logging parts; it frames everything the optimiser and the experiments repo do.", "yt": {"id": "YlIQ9GcRYXk", "ch": 'System Design Fight Club'}},
        {"kind": "video", "req": False, "label": '16. Top 5 most-used deployment strategies', "url": "https://www.youtube.com/watch?v=AWVTKBUnoIg", "m": 10, "why": "Rolling, blue-green, canary and feature flags. Shipping a new agent version, or a new variant onto a revenue page, is a canary judged on outcomes; the posting's CI/CD and production deployment lines.", "yt": {"id": "AWVTKBUnoIg", "ch": 'ByteByteGo'}},
        {"kind": "video", "req": False, "label": '17. Kubernetes explained in 6 minutes', "url": "https://www.youtube.com/watch?v=TlHvYWVUZyc", "m": 7, "why": 'Last, the scheduler many platforms run on: pods, nodes, deployments, autoscaling. Enough to follow if it comes up and to say honestly that alfred_ runs on managed runtimes and when you would want it.', "yt": {"id": "TlHvYWVUZyc", "ch": 'ByteByteGo'}},
    ]}

TIMELINE = {"title": "Coframe in public: a timeline",
    "lead": "Everything Coframe and its people have put out, oldest first, from a search on 8 October 2026 (the blog, press, podcasts, GitHub, the job board, LinkedIn). Read it for the shape of the product, then use the questions at the end. Blog dates are often a site-wide stamp, so most posts sit in the product list instead.",
    "events": [
        {"when": "23 May 2023", "what": "The Coframe GitHub organisation is created.", "src": "https://github.com/Coframe"},
        {"when": "Nov to Dec 2023", "what": "**Coffee**, an open-source tool that generates React components on save, built mostly by Josh Payne and Pavlo (about 1.5k stars); posted to Hacker News 13 Dec 2023.", "src": "https://github.com/Coframe/coffee"},
        {"when": "Date unclear, about 2024", "what": "**A UI-code model with OpenAI**: GPT-4o Vision fine-tuned on many websites, measured on their own **BrandBench** (194 held-out sites, a section removed and regenerated, a GPT-4o judge scoring style match): +26% over base GPT-4o.", "src": "https://www.coframe.com/post/coframe-openai-ui-code-generation-model"},
        {"when": "29 Oct 2024", "what": "**$9.3M seed**, co-led by Khosla Ventures and NFDG (Nat Friedman, Daniel Gross); still in limited testing with growth teams; a 42% average click-through lift reported for one large customer.", "src": "https://www.aol.com/news/coframe-raises-9-million-websites-130406960.html"},
        {"when": "10 Sep 2025", "what": "Josh Payne on the Making Sense of Martech podcast: 'living interfaces', the OpenAI collaboration, automating about 90% of conversion-rate work, optimising for AI search.", "src": "https://msom.transistor.fm/episodes/living-interfaces-openai-collabs-enterprise-ai-with-josh-payne-ceo-of-coframe"},
        {"when": "20 Apr 2026", "what": "**Engineering hiring push**: Applied Scientist (Experimentation), Product Engineer, Agent Engineer, **Agent Platform Engineer** and Integrations Engineer posted within about 90 minutes.", "src": "https://jobs.ashbyhq.com/Coframe"},
        {"when": "31 May 2026", "what": "**Pavlo writes the three public take-homes in one evening**: agent engineer (a just-in-time page for a TV store in under 5 seconds), forward-deployed engineer (Google Sheet to variants API sync) and applied science (an experimentation ROI simulator).", "src": "https://github.com/Coframe/agent-engineer-take-home"},
        {"when": "7 and 16 Jun 2026", "what": "Aleksey Korshuk makes the applied-science take-home open-ended and adds a personalization take-home.", "src": "https://github.com/Coframe"},
        {"when": "Jul 2026", "what": "Enterprise Product Engineer, Solutions Engineer and an SEO and AI-search strategist posted; the agent-engineer take-home last updated 13 Jul.", "src": "https://jobs.ashbyhq.com/Coframe"},
        {"when": "Aug 2026", "what": "**Forks that hint at the agent platform**: Vercel's agent-browser (6 Aug) and Cloudflare's agents SDK (13 Aug).", "src": "https://github.com/Coframe"},
        {"when": "16 Sep 2026", "what": "**Backend System Architect** posted.", "src": "https://jobs.ashbyhq.com/Coframe"},
        {"when": "22 Sep 2026", "what": "**More browser forks**: kernel-images (browsers as a service) and neko (a self-hosted browser streamed over WebRTC); a burst of go-to-market and finance hiring the same week.", "src": "https://github.com/Coframe"},
        {"when": "7 Oct 2026", "what": "**Coframe acquires HaystacksAI**; its founder Bo Mohazzabi (ex-Optimizely, Amplitude) becomes VP of GTM, toward an autonomous 'Growth Agent'. The post claims $150M+ incremental revenue for customers in six months.", "src": "https://www.coframe.com/post/coframe-acquires-haystacks"},
        {"when": "7 Oct 2026", "what": "**Predicting experiment winners from screenshots**: 57% consistent accuracy on a public benchmark with Sonnet 5 and nine-vote majority, but only 36 to 40% on 278 of their real experiments, with strong position bias. Their conclusion: a screening tool, not a replacement for live tests.", "src": "https://www.coframe.com/post/predicting-website-experiment-winners"}
    ],
    "product": [
        {"t": "**Ideas and variants**: generative models propose variants for a page; a person approves before anything ships.", "src": "https://www.coframe.com/post/how-coframe-finds-winners-90-percent-of-the-time"},
        {"t": "**Design and code**: their fine-tuned vision model writes on-brand UI code, measured with BrandBench.", "src": "https://www.coframe.com/post/coframe-openai-ui-code-generation-model"},
        {"t": "**The optimiser**: Thompson sampling with a Beta prior per variant, updated hourly; losing variants are replaced by new generated ones, which get an incubation period first.", "src": "https://www.coframe.com/post/the-math-behind-coframes-optimizers"},
        {"t": "**A prior before traffic**: the screenshot winner predictor screens candidates; weak on real experiments, so live tests stay the judge.", "src": "https://www.coframe.com/post/predicting-website-experiment-winners"},
        {"t": "**Personalization**: segments, and an upstream agent that profiles each visitor and passes context on the URL (the take-home's q= and ids=).", "src": "https://github.com/Coframe/agent-engineer-take-home"},
        {"t": "**Approvals as state**: reviews that are invalidated when engineering changes a variant.", "src": "https://www.coframe.com/answers/ai-ab-tests-with-human-approval"},
        {"t": "**Agents on their own code and an internal agent platform**: the Agent Platform Engineer posting (long-running runs with stop and resume, isolated environments, remote browsers, tracing and evals, CI/CD), toward 'hundreds of thousands of interfaces'.", "src": "https://jobs.ashbyhq.com/Coframe"},
        {"t": "**A Growth Agent**: the new direction after Haystacks, agents on outbound and go-to-market signals.", "src": "https://www.coframe.com/post/coframe-acquires-haystacks"}
    ],
    "team": [
        {"name": "Josh Payne", "role": "Founder and CEO", "note": "Co-founded Autograph before; lectures on AI at Stanford; most commits on Coffee; the 2025 podcast above.", "url": "https://www.linkedin.com/in/joshpxyne/"},
        {"name": "Pavlo Razumovskyi", "role": "Technical co-founder (your round 2)", "note": "GitHub `1um`; wrote Coffee's model strategies and all three take-homes; still maintains repos himself (latest Mar 2026). No public talks found.", "url": "https://www.linkedin.com/in/pavlorazumovskyi/"},
        {"name": "Aleksey Korshuk", "role": "AI engineer and researcher", "note": "Wrote the applied-science and personalization take-homes.", "url": "https://www.linkedin.com/in/aleksey-korshuk/"},
        {"name": "Glavin Wiechert", "role": "Founding AI engineer (LinkedIn)", "note": "Bio: production AI agents, harnesses, evals, agent reliability. Whether he is still there is not confirmed.", "url": "https://www.linkedin.com/in/glavin/"},
        {"name": "Bo Mohazzabi", "role": "VP of GTM, from 7 Oct 2026", "note": "Came with the Haystacks acquisition.", "url": "https://www.coframe.com/post/coframe-acquires-haystacks"},
        {"name": "Neesha Malik", "role": "Founding Talent", "note": "Your round 1.", "url": "https://www.linkedin.com/in/neesha-malik/"},
        {"name": "Michael Choi", "role": "Solutions engineering", "note": "", "url": "https://www.linkedin.com/in/michaelchoi7/"},
        {"name": "Ryan Krebs", "role": "Go-to-market", "note": "", "url": "https://www.linkedin.com/in/ryankrebs/"}
    ],
    "ask": [
        {"q": "What does one generation job look like today, and what breaks first at 10 times the volume?", "why": "The posting aims at hundreds of thousands of interfaces.", "src": "https://jobs.ashbyhq.com/Coframe"},
        {"q": "You forked kernel-images, neko, agent-browser and Cloudflare's agents in August and September. Which are you building on, and which did you rule out?", "why": "Remote browsers are a line in the posting.", "src": "https://github.com/Coframe"},
        {"q": "The screenshot predictor dropped from 57% on the benchmark to under 40% on your real experiments. How does that change what agents may ship without a person?", "why": "", "src": "https://www.coframe.com/post/predicting-website-experiment-winners"},
        {"q": "Is just-in-time generation under 5 seconds real in production, or cached per segment? Where does the latency budget go?", "why": "Your take-home sets the 5 second limit.", "src": "https://github.com/Coframe/agent-engineer-take-home"},
        {"q": "When the optimiser replaces a losing arm with a generated one, how does the new arm get its incubation traffic, and what happens if generation fails mid-experiment?", "why": "", "src": "https://www.coframe.com/post/the-math-behind-coframes-optimizers"},
        {"q": "Agents contribute to Coframe's own codebase. How do you trace, evaluate and gate those pull requests, and what does an agent regression look like?", "why": "", "src": "https://jobs.ashbyhq.com/Coframe"},
        {"q": "For stop-and-resume runs, did you build your own durable execution or use something like Temporal, Durable Objects or Inngest? What failed first?", "why": "", "src": ""},
        {"q": "Is the Growth Agent from Haystacks a separate product or the same platform, and what does it ask of the platform?", "why": "", "src": "https://www.coframe.com/post/coframe-acquires-haystacks"},
        {"q": "Approvals are invalidated when engineering changes a variant. How is that modelled as state in the pipeline?", "why": "", "src": "https://www.coframe.com/answers/ai-ab-tests-with-human-approval"},
        {"q": "How do you judge a take-home, and what separated the best submissions from the rest?", "why": "Aleksey rewrote one to be open-ended in June.", "src": "https://github.com/Coframe"}
    ],
    "unknown": [
        "Real publication dates for most blog posts (the site stamps October 2026 on all of them).",
        "Incremental revenue: the job posting says $221.4M in six months, the Haystacks post $150M+; which is current is unclear.",
        "How variants are delivered on customers' pages (the edge script) and the analytics architecture: no public source.",
        "A YC batch for Coframe (the YC page returned 404), Pavlo's background before Coframe (LinkedIn is gated), and whether the forks run in production."
    ]}

WATCH_PLATFORM = {"title": "Agent platform: the ten that matter most",
    "lead": "Ranked for this role: running agents as infrastructure (durable runs, sandboxes, remote browsers, tracing and evals, deploying and operating), the part a little beyond your edge functions and workers. The top four are about an hour together. Compute and cloud infrastructure are left out on purpose: say plainly you have not run them.",
    "items": [
        {"kind": "video", "req": True, "label": '1. How Ramp built a background coding agent that writes over half of its pull requests', "url": "https://www.youtube.com/watch?v=ii9E5z8Gsrc", "m": 21, "why": "Agents that contribute to their own company's codebase, in isolated environments: the posting's second line, as a real system.", "yt": {"id": "ii9E5z8Gsrc", "ch": 'Modal'}},
        {"kind": "video", "req": True, "label": '2. Scaling AI agents without breaking reliability (Preeti Somal, Temporal)', "url": "https://www.youtube.com/watch?v=1izYWsokr9s", "m": 16, "why": 'Long-running agent execution with stop and resume, and what breaks at scale.', "yt": {"id": "1izYWsokr9s", "ch": 'AI Engineer'}},
        {"kind": "video", "req": True, "label": '3. Make your AI agent durable in 8 minutes', "url": "https://www.youtube.com/watch?v=3nhRaJ3eOS8", "m": 8, "why": 'Steps, retries and resume for an agent loop, the serverless way: compare with your edge function and workers.', "yt": {"id": "3nhRaJ3eOS8", "ch": 'Inngest'}},
        {"kind": "video", "req": True, "label": '4. Why 99% accurate browser agents still fail (Derek Meegan, Browserbase)', "url": "https://www.youtube.com/watch?v=5xi_S1f9sDU", "m": 17, "why": 'Remote browsers for agents, and why per-step accuracy compounds; Coframe forked four browser repos in August and September.', "yt": {"id": "5xi_S1f9sDU", "ch": 'AI Engineer'}},
        {"kind": "video", "req": False, "label": '5. Inside Modal sandboxes: how agents code at scale', "url": "https://www.youtube.com/watch?v=jXxEwK-W4Og", "m": 55, "why": 'Secure, isolated execution for agent code at fleet scale: start-up time, snapshots, isolation.', "yt": {"id": "jXxEwK-W4Og", "ch": 'Modal'}},
        {"kind": "video", "req": False, "label": '6. LLM evals: common mistakes (Hamel Husain)', "url": "https://www.youtube.com/watch?v=GL0XhAj5LPE", "m": 29, "why": 'Evaluation infrastructure with judgment: error analysis before metrics, and evals as a gate.', "yt": {"id": "GL0XhAj5LPE", "ch": 'Hamel Husain'}},
        {"kind": "video", "req": False, "label": '7. Practical AI-enabled observability for agents and LLMs', "url": "https://www.youtube.com/watch?v=Xe60gkyDtGw", "m": 28, "why": 'Tracing and monitoring autonomous agents: what to record per step and what to alert on.', "yt": {"id": "Xe60gkyDtGw", "ch": 'Datadog'}},
        {"kind": "video", "req": False, "label": '8. How Claude Code works (Jared Zoneraich, PromptLayer)', "url": "https://www.youtube.com/watch?v=RFKCzGlAU6Q", "m": 66, "why": 'The harness of a coding agent from the inside: developer tooling for engineers working with agents.', "yt": {"id": "RFKCzGlAU6Q", "ch": 'AI Engineer'}},
        {"kind": "video", "req": False, "label": '9. The production AI playbook: deploying agents at enterprise scale (Databricks)', "url": "https://www.youtube.com/watch?v=ObTPqBGsEbA", "m": 38, "why": "Deploying, operating and governing agents in production: the operator's view.", "yt": {"id": "ObTPqBGsEbA", "ch": 'AI Engineer'}},
        {"kind": "video", "req": False, "label": '10. Events are the wrong abstraction for your AI agents (Mason Egger, Temporal)', "url": "https://www.youtube.com/watch?v=KJ9eZYTWS1Y", "m": 15, "why": 'Stateful workflows against event chains: an opinion to have when he asks how you would build it.', "yt": {"id": "KJ9eZYTWS1Y", "ch": 'AI Engineer'}},
    ]}
WATCH = [WATCH_PLATFORM, WATCH]

LIVE_GUIDES = {
 "storefront": [
  {
   "title": "Learn the domain: a page render inside a budget",
   "lead": "You don't need frontend depth for this. You need the shape of a page render and a latency budget.",
   "items": [
    "A render is a function: visitor in, HTML string out. In a real Next.js app it is the same idea on the server (server-side rendering): fetch data, render components, send HTML.",
    "Client-side rendering, server-side rendering, streaming: CSR ships an empty shell and JavaScript that builds the page in the browser; SSR sends finished HTML; streaming sends the shell first and fills slow parts later. Here the harness times the whole page, so ask whether streaming counts.",
    "Why the model should not write the page: generating a page of markup token by token is slow and unsafe (anything the model writes ends up in the HTML). The usual pattern: the model returns a small layout spec (which sections, which products, in what order) and your own components render it.",
    "The budget: the model is the slowest and least reliable part. Give it a deadline below the limit, and have a good answer ready when it misses: a fallback that still uses what you know about the visitor.",
    "Validation: model output is untrusted. Parse it against a schema; unknown products or section types are dropped, not rendered.",
    "Caching: many visitors say similar things; a key made from the normalised q plus the sorted ids can reuse a layout."
   ],
   "res": [
    {
     "kind": "video",
     "req": True,
     "label": "Server-side rendering and client-side rendering, pros and cons",
     "url": "https://www.youtube.com/watch?v=ObrSuDYMl1s",
     "m": 5,
     "why": "The two ways a page gets built, in five minutes.",
     "yt": {
      "id": "ObrSuDYMl1s",
      "ch": "Smoljames"
     }
    },
    {
     "kind": "video",
     "req": True,
     "label": "10 rendering patterns for web apps",
     "url": "https://www.youtube.com/watch?v=Dkx5ydvtpCA",
     "m": 7,
     "why": "Static, SSR, streaming, islands: the vocabulary.",
     "yt": {
      "id": "Dkx5ydvtpCA",
      "ch": "Beyond Fireship"
     }
    },
    {
     "kind": "video",
     "req": True,
     "label": "Structured outputs: specifying a JSON schema for LLM outputs",
     "url": "https://www.youtube.com/watch?v=mIZHRqMoJec",
     "m": 7,
     "why": "Getting a model to return a shape you can validate.",
     "yt": {
      "id": "mIZHRqMoJec",
      "ch": "VectorLab"
     }
    }
   ]
  },
  {
   "title": "Look around the repo, systematically",
   "lead": "The same method works for any repo you are handed. Then answer the questions below for this one, from the code.",
   "items": [
    "Read the README twice: once for the ask, once for every noun in it; the nouns are the files and the constraints.",
    "Run it before reading any code: the commands in the README. Write down what the output measures; the harness is the scoreboard you will be judged on.",
    "Sort the files into five piles: the entry point the harness calls, the file you are meant to change, the pieces given to you, the data and contracts, and the harness or tests.",
    "Read only the entry point, then follow one level down. Stop there.",
    "Read the contracts: types, schemas, docs, data files. They tell you what valid looks like.",
    "Read anything stubbed, simulated or 'flaky' to the very end. That is where an exercise hides its trap.",
    "Write four lines before planning: what is given, what you must change, how success is measured, what can go wrong."
   ],
   "ordered": True,
   "prompts": [
    {
     "when": "Ask Claude Code to map it (read, don't change)",
     "text": "Map this repo for me before we change anything: the entry point the harness calls, what the harness measures and how, which file I am expected to change, which modules are given, the data and contracts, and anything stubbed or simulated (read those to the end and tell me how they misbehave). Do not edit files."
    }
   ]
  },
  {
   "title": "Questions to answer from the code (not from Pavlo)",
   "items": [
    "What does `renderVisitorPage` return today, and who calls it?",
    "How does the harness decide a page was 'tailored', and what counts as too slow?",
    "What does the layout service return, how long can it take, and in which ways can it be wrong? (Read the stub to its last line.)",
    "Does the layout service honour the abort signal it accepts?",
    "Which components exist, and what does each need?",
    "Where could the visitor's `q` end up on the page, and is it escaped?"
   ]
  },
  {
   "title": "Clarify with Pavlo",
   "lead": "Ask the ones that change the design; skip the ones the code already answered. In mock mode, ask me.",
   "items": [
    "Is the 5 seconds to the first byte or to the full page?",
    "Can I stream or render a shell first?",
    "How reliable is the layout service in practice?",
    "What should an empty or garbage `q` get?",
    "May I change the layout format or add components? May I add a library like zod?",
    "Is falling back to the default page acceptable, or should every visitor get something tailored?",
    "Is caching across visitors allowed?"
   ]
  },
  {
   "title": "Decisions to discover",
   "lead": "Pick an option for each before opening the strong choice. Say your reason out loud; that's what he scores.",
   "decisions": [
    {
     "q": "What should the model produce?",
     "opts": [
      "A whole page of HTML or JSX",
      "A layout spec that our components render",
      "Only a reordered list of product ids"
     ],
     "pick": "A layout spec rendered by our components.",
     "why": "Small, fast to generate, checkable against a schema, and safe because only trusted components touch the HTML. Ids alone lose the headline and the section choice; a whole page is slow and an injection risk."
    },
    {
     "q": "How long do you wait for the layout service?",
     "opts": [
      "As long as it takes",
      "About 3.5 to 4 seconds, then fall back",
      "One second"
     ],
     "pick": "About 3.5 to 4 seconds, leaving headroom for rendering.",
     "why": "One second wastes most good answers; no deadline breaks the limit. The stub ignores its abort signal, so the deadline must race the call, not wait for it to stop."
    },
    {
     "q": "What happens on a timeout or invalid output?",
     "opts": [
      "Show an error",
      "Render the default catalog page",
      "Build a deterministic page from q and ids (flagged products, a comparison when q asks to compare)"
     ],
     "pick": "A deterministic fallback that still uses q and ids.",
     "why": "The procurement buyer still sees their three flagged sets, the enthusiast still gets a comparison. Falling back to everything for everyone throws away what the upstream agent already knew."
    },
    {
     "q": "The output parses but names an unknown product or section type. Then?",
     "opts": [
      "Reject the whole layout",
      "Drop the bad parts and keep the rest",
      "Render it as is"
     ],
     "pick": "Drop the bad parts; if nothing useful is left, fall back.",
     "why": "One hallucinated id should not cost the visitor a tailored page, and nothing unvalidated should reach the renderer."
    },
    {
     "q": "Caching?",
     "opts": [
      "None",
      "By the exact q",
      "By the normalised q plus sorted ids, with a time limit"
     ],
     "pick": "Normalised q plus sorted ids, with a TTL.",
     "why": "Visitors phrase the same intent differently; normalising raises hits, and the TTL lets the catalog change. A cache hit also removes the model from the latency path."
    }
   ]
  },
  {
   "title": "Build it with Claude Code",
   "lead": "You decide, the tool types. Small asks, read every diff, run the harness yourself.",
   "prompts": [
    {
     "when": "Say your plan and get it challenged",
     "text": "My plan in three steps: (1) ... (2) ... (3) .... Push back on anything risky or missing, especially timeouts, retries and bad input. Don't write code yet."
    },
    {
     "when": "Test first for the first behaviour",
     "text": "Write a small failing test for this behaviour: when the layout service takes longer than the deadline, renderVisitorPage still returns a page built from q and ids within 5 seconds. Use the repo's existing style, run it, and show me that it fails. Don't implement yet."
    },
    {
     "when": "Implement one small step",
     "text": "Implement only step 1 of the plan. Keep the diff small (under about 60 lines), no new dependencies unless I say so, then run `npm run harness` and show me the output."
    },
    {
     "when": "Review the diff with me",
     "text": "Walk me through this diff where it matters. Then list what could go wrong with it: slow calls, timeouts, retries, races, bad input. Be specific to this code."
    },
    {
     "when": "Run the scoreboard",
     "text": "Run `npm run harness` three times and summarise the numbers. Did anything get worse?"
    },
    {
     "when": "When it works: edge cases",
     "text": "Add tests for: an empty q, a q containing <script>, an unknown id in ids, the layout service returning prose around the JSON, and a section type we don't have. Run them."
    }
   ]
  },
  {
   "title": "Verify",
   "items": [
    "`npm run harness`: zero over 5 seconds, zero errors, every visitor tailored, across several runs (the stub is random).",
    "Open `out/page.html` for each example visitor and look: does each page fit its visitor?",
    "Try an empty q, a hostile q and an unknown id by hand with `npm run page`.",
    "Read the final diff yourself once, top to bottom."
   ]
  },
  {
   "title": "Discuss: what he will ask after the build",
   "items": [
    "How would you know the tailored page is better than the default? (What is the metric, and how would you test it?)",
    "Ten thousand requests a minute: what breaks first, and what changes?",
    "Could a visitor's q steer the model into something harmful? What stops it?",
    "In a real Next.js app, would you stream a shell first? What would the visitor see?",
    "What would you log for every request?"
   ]
  }
 ],
 "jobs": [
  {
   "title": "Learn the domain: a job queue that survives crashes",
   "items": [
    "A queue in a database: a table of jobs with a status; workers claim one at a time and run it. The claim has to be atomic, or two workers take the same job.",
    "Leases: a claim that expires unless the worker keeps renewing it (a heartbeat). When a worker dies, its job becomes claimable again.",
    "At-least-once: in a system like this anything can run twice, so steps that change the outside world need to be safe to repeat.",
    "Idempotency without the provider's help: check before acting (has this comment already been posted?) and record that you did it.",
    "Checkpoints: store each step's result so a resumed job skips what already finished.",
    "Retries: only for errors that can succeed later, with backoff, and a maximum after which the job is marked dead for a person to look at."
   ],
   "res": [
    {
     "kind": "video",
     "req": True,
     "label": "The SKIP LOCKED feature in Postgres",
     "url": "https://www.youtube.com/watch?v=m6-63kpttQk",
     "m": 4,
     "why": "How workers claim rows without stepping on each other.",
     "yt": {
      "id": "m6-63kpttQk",
      "ch": "PG Casts by Hashrocket"
     }
    },
    {
     "kind": "video",
     "req": True,
     "label": "Using your database as a queue: good or bad idea?",
     "url": "https://www.youtube.com/watch?v=DOaDpHh1FsQ",
     "m": 10,
     "why": "The trade-offs of a table as a queue.",
     "yt": {
      "id": "DOaDpHh1FsQ",
      "ch": "CodeOpinion"
     }
    },
    {
     "kind": "video",
     "req": True,
     "label": "Idempotency: what it is and how to implement it",
     "url": "https://www.youtube.com/watch?v=XAccGbtl3Z8",
     "m": 9,
     "why": "Making a repeated step harmless.",
     "yt": {
      "id": "XAccGbtl3Z8",
      "ch": "Alex Hyett"
     }
    }
   ]
  },
  {
   "title": "Look around the repo, systematically",
   "items": [
    "Read the README twice: once for the ask, once for every noun in it; the nouns are the files and the constraints.",
    "Run it before reading any code: the commands in the README. Write down what the output measures; the harness is the scoreboard you will be judged on.",
    "Sort the files into five piles: the entry point the harness calls, the file you are meant to change, the pieces given to you, the data and contracts, and the harness or tests.",
    "Read only the entry point, then follow one level down. Stop there.",
    "Read the contracts: types, schemas, docs, data files. They tell you what valid looks like.",
    "Read anything stubbed, simulated or 'flaky' to the very end. That is where an exercise hides its trap.",
    "Write four lines before planning: what is given, what you must change, how success is measured, what can go wrong."
   ],
   "ordered": True,
   "prompts": [
    {
     "when": "Ask Claude Code to map it (read, don't change)",
     "text": "Map this repo for me before we change anything: the entry point the harness calls, what the harness measures and how, which file I am expected to change, which modules are given, the data and contracts, and anything stubbed or simulated (read those to the end and tell me how they misbehave). Do not edit files."
    }
   ]
  },
  {
   "title": "Questions to answer from the code (not from Pavlo)",
   "items": [
    "How does a worker pick its next job? Could two workers pick the same one?",
    "What happens to a job whose worker is killed halfway through?",
    "Which of the four steps change the outside world?",
    "What does the GitHub stub do just after it records a comment?",
    "What happens to a job when any step raises?",
    "What exactly does the harness count, and when does it stop?"
   ]
  },
  {
   "title": "Clarify with Pavlo",
   "items": [
    "May I change the database schema?",
    "Is production on SQLite or Postgres?",
    "Does GitHub support idempotency keys? Can I read a pull request's comments?",
    "How long do real jobs take?",
    "Is a failed test a failed job, or a result to report?",
    "How many retries are acceptable?"
   ]
  },
  {
   "title": "Decisions to discover",
   "decisions": [
    {
     "q": "How does a worker claim a job?",
     "opts": [
      "SELECT a queued job, then UPDATE it",
      "One atomic UPDATE ... WHERE status = 'queued' ... RETURNING (or a write transaction)",
      "A lock file per job"
     ],
     "pick": "One atomic statement.",
     "why": "Between a SELECT and an UPDATE another worker can read the same row. In SQLite use a write transaction or UPDATE ... RETURNING; in Postgres, SELECT ... FOR UPDATE SKIP LOCKED."
    },
    {
     "q": "How does a killed worker's job come back?",
     "opts": [
      "It doesn't",
      "A lease with an expiry, renewed by a heartbeat, reclaimed once it expires",
      "Reset every running job when a worker starts"
     ],
     "pick": "A lease with expiry and heartbeat.",
     "why": "Resetting at start-up steals jobs that live workers are running; a lease only frees work whose owner stopped renewing it."
    },
    {
     "q": "How do you stop the double comment?",
     "opts": [
      "Retry less",
      "Send an idempotency key to GitHub",
      "Put the job id in the comment, check for it before posting, and record that it was sent"
     ],
     "pick": "Check before posting, and record it.",
     "why": "GitHub takes no idempotency key, and the stub posts and then loses the response. Reading first closes the window the record alone cannot."
    },
    {
     "q": "After a crash, resume or restart the job?",
     "opts": [
      "Restart from the first step",
      "Store each step's result and skip finished steps"
     ],
     "pick": "Checkpoint and skip finished steps.",
     "why": "It saves the model call and the test run; restarting is acceptable only if every step is safe to repeat, so say the trade-off."
    },
    {
     "q": "Which failures are retried?",
     "opts": [
      "All of them, forever",
      "Transient ones (timeouts, resets) with backoff and a maximum, then dead",
      "None"
     ],
     "pick": "Transient, bounded, then dead.",
     "why": "Forever hides real bugs and burns money; none turns every hiccup into a lost job."
    }
   ]
  },
  {
   "title": "Build it with Claude Code",
   "prompts": [
    {
     "when": "Say your plan and get it challenged",
     "text": "My plan in three steps: (1) ... (2) ... (3) .... Push back on anything risky or missing, especially timeouts, retries and bad input. Don't write code yet."
    },
    {
     "when": "Test first for the first behaviour",
     "text": "Write a small failing test for this behaviour: two workers calling next_job at the same time never get the same job. Use the repo's existing style, run it, and show me that it fails. Don't implement yet."
    },
    {
     "when": "Implement one small step",
     "text": "Implement only step 1 of the plan. Keep the diff small (under about 60 lines), no new dependencies unless I say so, then run `python harness.py` and show me the output."
    },
    {
     "when": "Review the diff with me",
     "text": "Walk me through this diff where it matters. Then list what could go wrong with it: slow calls, timeouts, retries, races, bad input. Be specific to this code."
    },
    {
     "when": "Run the scoreboard",
     "text": "Run `python harness.py` three times and summarise the numbers. Did anything get worse?"
    },
    {
     "when": "When it works: the hard cases",
     "text": "Add tests for: a worker killed after post_comment but before the job is marked done, a model timeout on the first attempt, and the same job claimed after its lease expired. Run them with python -m unittest."
    }
   ]
  },
  {
   "title": "Verify",
   "items": [
    "`python harness.py`: every job done, none stuck, no pull request with more than one comment, across several runs.",
    "Kill a worker by hand mid-job and watch its job come back.",
    "Read the final diff once yourself."
   ]
  },
  {
   "title": "Discuss: what he will ask after the build",
   "items": [
    "The same claim on Postgres with many machines?",
    "A 20-minute job during a deploy: drain it or resume it?",
    "How do you see a job that is stuck?",
    "Workers on different machines: where does the workspace live?",
    "When would you use a workflow engine like Temporal or Inngest instead?"
   ]
  }
 ],
 "experiments": [
  {
   "title": "Learn the domain: experiments, bandits, and the edge",
   "items": [
    "An experiment: variants A, B and C; each visitor is assigned once and keeps that variant; exposures and conversions are counted per variant.",
    "Sticky assignment: hash the experiment id and the visitor id into a number between 0 and 1; the same input always lands in the same bucket, with no lookup. Store the first assignment too, because the weights it is compared against move.",
    "Counting once: the hourly job may rerun on the same file, so it must remember what it already counted (event ids or files).",
    "Thompson sampling: each variant keeps a Beta(1 + conversions, 1 + non-conversions) belief; draw one sample from each and the highest wins. Better variants win more often as evidence grows, but no variant is starved early by luck.",
    "Edge against batch: the edge can only read what is pushed to it (here `weights.json`); the hourly job does the maths. The file between them is the contract."
   ],
   "res": [
    {
     "kind": "video",
     "req": True,
     "label": "Thompson sampling",
     "url": "https://www.youtube.com/watch?v=Zgwfw3bzSmQ",
     "m": 14,
     "why": "The Beta belief and the draw, clearly.",
     "yt": {
      "id": "Zgwfw3bzSmQ",
      "ch": "ritvikmath"
     }
    },
    {
     "kind": "video",
     "req": True,
     "label": "Multi-armed bandit",
     "url": "https://www.youtube.com/watch?v=e3L4VocZnnQ",
     "m": 12,
     "why": "Explore against exploit, the problem Thompson sampling solves.",
     "yt": {
      "id": "e3L4VocZnnQ",
      "ch": "ritvikmath"
     }
    },
    {
     "kind": "video",
     "req": False,
     "label": "The ultimate guide to A/B testing (Ronny Kohavi)",
     "url": "https://www.youtube.com/watch?v=hEzpiDuYFoE",
     "m": 84,
     "why": "Assignment, sample ratio checks, trustworthy results; long, so skim.",
     "yt": {
      "id": "hEzpiDuYFoE",
      "ch": "Lenny's Podcast"
     }
    }
   ]
  },
  {
   "title": "Look around the repo, systematically",
   "items": [
    "Read the README twice: once for the ask, once for every noun in it; the nouns are the files and the constraints.",
    "Run it before reading any code: the commands in the README. Write down what the output measures; the harness is the scoreboard you will be judged on.",
    "Sort the files into five piles: the entry point the harness calls, the file you are meant to change, the pieces given to you, the data and contracts, and the harness or tests.",
    "Read only the entry point, then follow one level down. Stop there.",
    "Read the contracts: types, schemas, docs, data files. They tell you what valid looks like.",
    "Read anything stubbed, simulated or 'flaky' to the very end. That is where an exercise hides its trap.",
    "Write four lines before planning: what is given, what you must change, how success is measured, what can go wrong."
   ],
   "ordered": True,
   "prompts": [
    {
     "when": "Ask Claude Code to map it (read, don't change)",
     "text": "Map this repo for me before we change anything: the entry point the harness calls, what the harness measures and how, which file I am expected to change, which modules are given, the data and contracts, and anything stubbed or simulated (read those to the end and tell me how they misbehave). Do not edit files."
    }
   ]
  },
  {
   "title": "Questions to answer from the code (not from Pavlo)",
   "items": [
    "How does `assign.ts` choose a variant? Does a returning visitor keep theirs?",
    "What does `update.py` do with a file it has already processed once?",
    "How are the weights computed from the counts?",
    "Who writes `weights.json` and who reads it?",
    "What does `sim.py` measure, and which numbers say 'fixed'?"
   ]
  },
  {
   "title": "Clarify with Pavlo",
   "items": [
    "Is the visitor id stable for a returning visitor?",
    "Can the edge keep state or call a database?",
    "Do events carry ids?",
    "Why does the hourly job get rerun?",
    "What does 'find the winner sooner' mean in numbers?",
    "May I change the weights format? Should a returning visitor ever switch variant?"
   ]
  },
  {
   "title": "Decisions to discover",
   "decisions": [
    {
     "q": "How do you make assignment sticky?",
     "opts": [
      "Keep picking at random",
      "Hash experiment and visitor against the current weights",
      "Keep the first assignment (a cookie), hash only for new visitors"
     ],
     "pick": "Keep the first assignment; hash only new visitors.",
     "why": "Hashing against weights that move every hour still moves returning visitors when the weights change; the stored first assignment never does."
    },
    {
     "q": "How do you stop the double counting?",
     "opts": [
      "Make sure the job never reruns",
      "Record processed event ids (or files) in the job's state",
      "Recompute the totals from all the event files every run"
     ],
     "pick": "Record what was processed (recomputing from scratch also works).",
     "why": "Reruns will happen. Remembering event ids makes a rerun a no-op; recomputing from every file is idempotent too but grows with history."
    },
    {
     "q": "How are weights computed?",
     "opts": [
      "Proportional to each variant's conversion rate",
      "Thompson sampling: the share of many draws each variant wins",
      "Epsilon-greedy"
     ],
     "pick": "Thompson sampling shares.",
     "why": "Proportional weights barely move (3.6% against 3.0% is close to a third each), so the winner never gets traffic; Thompson moves traffic as the evidence firms up."
    },
    {
     "q": "What does the edge receive?",
     "opts": [
      "Raw counts",
      "Posterior parameters, and the edge samples per request",
      "Precomputed traffic shares in a versioned file"
     ],
     "pick": "Precomputed shares in a versioned file (parameters also defensible).",
     "why": "The edge stays simple and fast; the maths lives in one place you can test. Sampling at the edge is fine too if you can say why."
    },
    {
     "q": "Any guardrail?",
     "opts": [
      "None",
      "A floor per variant while it is new",
      "A holdout share kept at fixed weights"
     ],
     "pick": "A floor for new variants, and say why a holdout matters.",
     "why": "A floor stops early bad luck starving a variant; a fixed holdout keeps an unbiased comparison and a place to run sample-ratio checks."
    }
   ]
  },
  {
   "title": "Build it with Claude Code",
   "prompts": [
    {
     "when": "Say your plan and get it challenged",
     "text": "My plan in three steps: (1) ... (2) ... (3) .... Push back on anything risky or missing, especially timeouts, retries and bad input. Don't write code yet."
    },
    {
     "when": "Test first for the first behaviour",
     "text": "Write a small failing test for this behaviour: running update.py twice on the same hour file leaves the counts unchanged. Use the repo's existing style, run it, and show me that it fails. Don't implement yet."
    },
    {
     "when": "Implement one small step",
     "text": "Implement only step 1 of the plan. Keep the diff small (under about 60 lines), no new dependencies unless I say so, then run `python sim.py` and show me the output."
    },
    {
     "when": "Review the diff with me",
     "text": "Walk me through this diff where it matters. Then list what could go wrong with it: slow calls, timeouts, retries, races, bad input. Be specific to this code."
    },
    {
     "when": "Run the scoreboard",
     "text": "Run `python sim.py` three times and summarise the numbers. Did anything get worse?"
    },
    {
     "when": "Across the two languages",
     "text": "We are changing the contract between edge/assign.ts and optimizer/update.py. Show me the new weights.json shape first, then update the Python writer, then the TypeScript reader, and run python sim.py."
    }
   ]
  },
  {
   "title": "Verify",
   "items": [
    "`python sim.py`: returning visitors seeing a different variant near 0%, counted conversions equal to real ones, and B's traffic share clearly above a third by the end.",
    "Run it a few times; read the final diff once yourself."
   ]
  },
  {
   "title": "Discuss: what he will ask after the build",
   "items": [
    "Hundreds of experiments: how does the edge get new weights?",
    "Two experiments on one page: how do you keep them independent?",
    "Conversions that arrive a day late?",
    "How would you check assignment is healthy (a sample ratio check)?",
    "Cookies blocked: where does stickiness live then?"
   ]
  }
 ]
}
for _x in LIVE:
    _x["guide"] = LIVE_GUIDES[_x["id"]]
