"""Clarion (clarionhealth.com), Software Engineer (Fullstack). Round 1: an intro chat booked on 9 November 2026 for the
same afternoon through Ryan McCord's Ashby link. Pranav named Jared Yanis, a founding engineer, as the person to research.

Page only, kept short (like Heard, Overjoy and EcoGPT): what Clarion is, the role, your intro and story in versions,
why Clarion and why this role as pointers, the base questions, and questions to ask. Project stories about alfred_
internals live in the gitignored private/loops/clarion.js and show on the Prep tab when present.

Facts about Clarion come from SOURCES, every link opened 9 November 2026. The posting and the interview process are from
Ashby's public job board API. Pranav's words are from E:/_Resume-Curator/INTRO.md, verbatim where marked. Logistics answers
(location, in-person NYC, pay, work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "clarion",
    "title": "Clarion, Software Engineer",
    "company": "Clarion",
    "subtitle": "Round 1: intro chat, 20 to 30 minutes",
    # clarionhealth.com: a deep teal, #072d35, on its marks (read 2026-11-09); lighter for dark mode.
    "brand": "#0B4A57", "brand_dark": "#6FB8C6",
    "when_iso": "2026-11-09",
    "when": "Monday 9 November, the afternoon slot you booked on Ryan McCord's Ashby link",
    "who": ("Most likely Jared Yanis, a founding engineer at Clarion: joined about a year ago after five years at Amazon building web "
            "applications for Amazon Advertising, on developer velocity and platform tools. Booked through Ryan McCord. The founders are "
            "Dr. Ryan Gallagher, CEO (a Stanford and Harvard trained physician, founding team at Two Chairs and Ophelia) and "
            "Jeffrey Lamothe, CTO (the posting says ex-Amazon Alexa, led AI and ML teams at Salesforce)."),
    "format": ("Intro chat, 20 to 30 minutes, video: your background, context on the role and team, mutual fit. "
               "Next, if it goes well: a one-hour technical interview (practical system design and coding with an engineer), then a "
               "half-day onsite team day in New York. They decide within 24 hours of each stage."),
    "bar": ("Can you ship full-stack features in TypeScript, Node, React and Postgres, have you put LLM agents and real-time voice in front of "
            "real users, and do you own reliability when a wrong action matters? Lead with the alfred_ voice agent and the write path behind it, "
            "then say your stack is theirs."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Thirty minutes of prep.</b> "
              "1. Prep tab: your intro out loud (45 seconds), then pick three Why Clarion pointers. "
              "2. Your projects: the voice agent, then the write path (no double sends). "
              "3. Pick one question from each group; lead with the Amazon one for Jared. "
              "Light review if you have time: the <a href=\"commure.html\">Commure page</a> (the same product, healthcare voice agents) and the guide's "
              "<a href=\"../SYSTEM%20DESIGN.html#/designs/voice-agent\">voice agent platform</a> (per-tenant agents, phone numbers, tools: Clarion's per-practice setup)."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, why Clarion, why this role, the base questions, your projects, and the questions to ask."

SHOW_UP = [
    ("Know the product in one line.", "AI agents for a clinic's front office: they answer every call, book and reschedule, handle refills, referrals and billing questions, and write the outcome into the EHR (Epic, athenahealth, eClinicalWorks, NextGen, ModMed, Healthie). Voice and SMS. Priced per resolved call."),
    ("Lead with the alfred_ voice agent.", "Phone over SIP and web over WebRTC into LiveKit, one Python worker, a lean agent on the call with the main agent working in parallel. Reads answer fast; anything that writes waits for the person. That is Clarion's job too: an agent on a live call that changes real records."),
    ("Then the write path.", "An intent row with an idempotency key before every provider call, reconcile before retry, zero duplicate sends. EHR write-back has the same shape: a booking must happen once."),
    ("Your stack is theirs.", "TypeScript, Node and Deno, Postgres on Supabase, React admin and monitoring UIs at alfred_; React and Node at WheelPrice, 1.5 s to 300 ms. Say it plainly once."),
    ("Jared is an engineer, ex-Amazon.", "Expect a friendly technical skim, not a recruiter checklist: what you built, how it works, what you owned. Two or three sentences per answer; keep five minutes for your questions."),
]

STORY_BLURB = "Your intro, why Clarion, why this role, why leave alfred_, what you want next, and logistics."

# Every outside link opened 2026-11-09.
SOURCES = [
    {"label": "Clarion", "url": "https://www.clarionhealth.com/", "why": "The front office that runs itself: inbound receptionist, documents and referrals, outbound engagement; EHR and phone integrations; HIPAA, SOC 2, HITRUST; pay per resolved call."},
    {"label": "Software Engineer (Fullstack), the posting", "url": "https://jobs.ashbyhq.com/clarion/ea6f2fc5-7808-42c4-946f-83b4b10f2085", "why": "The role, the stack (Node.js, TypeScript, React, PostgreSQL), 160K to 190K plus equity, the interview process."},
    {"label": "Clarion on Y Combinator", "url": "https://www.ycombinator.com/companies/clarion", "why": "W24; the AI communication layer for healthcare; founders Ryan Gallagher (CEO) and Jeffrey Lamothe (CTO)."},
    {"label": "Clarion jobs on Ashby", "url": "https://jobs.ashbyhq.com/clarion", "why": "The other open roles: senior fullstack, senior backend (workflow orchestration, EHR via API and RPA), forward deployed engineer."},
    {"label": "Jared Yanis on LinkedIn", "url": "https://www.linkedin.com/in/jared-yanis-52b46b157/", "why": "Founding engineer at Clarion; five years at Amazon on Amazon Advertising web apps."},
]

COMPANY = [
    "Clarion builds AI agents for a medical practice's front office. Clinics miss 30 to 40% of inbound calls, so Clarion's agents answer every call and complete the workflow: scheduling and rescheduling, prescription refills, referrals from faxes, billing and insurance questions, reminders and no-show rebooking, by voice and SMS. They follow each practice's own rules and write the outcome into the EHR. Pricing is per resolved call, not per seat or minute.",
    "Integrations are the moat and the grind: Epic, athenahealth, eClinicalWorks, NextGen, ModMed and Healthie on the EHR side; RingCentral, Nextiva, Genesys, 8x8, Weave and others on the phone side. The senior backend posting says some EHRs are reached by API and some by RPA. Specialties include cardiology, dermatology, gastroenterology, ophthalmology, orthopedics, primary care and women's health; logos include Oscar and Herself Health.",
    "The company: New York, in person, YC W24. About $10M raised from Accel, Y Combinator and Sequoia scouts, plus healthcare founders. Dozens of paying customers and hundreds of thousands of patient interactions across virtual care companies, health systems and a $5B health insurer. Their own site claims 60% of calls resolved end to end, a 71% drop in no-shows and twice the referral conversion (vendor numbers, no method given).",
    "The founders: Dr. Ryan Gallagher, CEO, a Stanford and Harvard trained physician who was on the founding teams of Two Chairs and Ophelia; and Jeffrey Lamothe, CTO, who the postings say is an ex-Amazon Alexa engineer who led AI and ML teams at Salesforce. Jared Yanis, founding engineer, came from five years at Amazon.",
    "The hard parts, which are your opening: an agent that changes real records on a live call (a booking must happen once, the right slot, the right provider), each practice's rules without a rebuild per customer, fragmented and slow EHRs, latency on the phone, HIPAA on every log and transcript, and knowing when an agent handled a call badly.",
]

POSTING = {
    "url": "https://jobs.ashbyhq.com/clarion/ea6f2fc5-7808-42c4-946f-83b4b10f2085",
    "lead": "Software Engineer (Fullstack): build and operate production features that power AI-driven healthcare communication.",
    "facts": [["Location", "New York office, in person"], ["Range", "160K to 190K USD plus equity"],
              ["Stack", "Node.js, TypeScript, React, PostgreSQL"], ["Experience", "3 to 5 years shipping production software"]],
    "does": ["Build and operate production full-stack features for AI-driven healthcare communication.",
             "Integrate with EHRs, legacy healthcare systems and real-time voice infrastructure.",
             "Support and extend LLM-driven workflows used in live patient interactions.",
             "Debug and improve reliability, performance and scalability across live systems."],
    "wants": ["Strong full-stack work in Node.js, TypeScript, React and PostgreSQL.",
              "Comfort in ambiguity, learning quickly.",
              "Ownership: you care about quality, reliability and real-world impact.",
              "Clear communication and a collaborative mindset."],
}

ROUNDS = [
    {"title": "Round 1: intro chat",
     "when": "Monday 9 November 2026, afternoon",
     "who": "Jared Yanis (likely), booked through Ryan McCord",
     "format": "20 to 30 minutes, video: background, role context, mutual fit.",
     "outcome": "Not yet held.",
     "notes": ["Ryan wrote on 9 November; you booked the same afternoon."],
     "asked": []},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "First, almost certainly. The short one, then stop.",
     "probes": ["What do you own at alfred_?", "Tell me about the voice agent.", "What's your stack day to day?"],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end. And Clarion is pretty much what I do every day: a voice agent on a live call that has to take real actions, correctly, on systems it doesn't control."],
     "swaps": [{"when": "If he asks for one line", "line": "I build production AI agents, including a voice agent on phone and web, in TypeScript and Postgres, with the evals and the write path that make them safe to act."},
               {"when": "If he asks about healthcare", "line": "My research is on multi-agent medical reasoning, TeamMedAgents, and at the UIC lab I worked on voice for patients in the hospital."}],
     "land": "Production agents that act, real-time voice, and a full stack that matches theirs.",
     "notes": ["The first paragraph and the first two sentences of the second are yours from INTRO.md, unchanged. The last line is new: make it yours."]},

    {"id": "why-clarion", "title": "Why Clarion?", "length": "about 40 seconds",
     "when": "Likely. Pick three of these pointers and say them in your words.",
     "probes": ["What do you know about us?", "Why healthcare?", "Why not a general voice AI company?"],
     "vname": "Pointers",
     "say": [
         "**I've built this loop, and the hard part is the same.** An agent on a live call that changes real records. At alfred_ the voice agent answers fast on reads, and anything that writes waits for the person. Clarion's agents book, refill and write to the EHR, where a wrong write lands on a patient.",
         "**Completing the workflow, not answering the phone.** Pricing per resolved call means you measure the outcome, not the conversation. That's how I grade agents: on what got written to the database, not on how the reply reads.",
         "**Integrations are where reliability lives.** Fragmented EHRs and phone systems, some by API and some by RPA. I've built the write path for that kind of world: an intent row before every external call, an idempotency key, reconcile before retry. Zero duplicate sends.",
         "**Healthcare isn't new to me.** My research is on multi-agent medical reasoning, and at UIC I worked on voice for patients in the hospital. Missed calls are missed care, which is a problem I'd like to spend my time on.",
         "**The stage.** Real traction, dozens of paying customers and hundreds of thousands of patient calls, a physician and an engineer as founders, in person in New York. Fast enough to own things, big enough that the work is real usage."],
     "variants": [
         {"name": "A, said straight", "land": "You have built the loop, you grade by outcome, and healthcare is close to your research.",
          "say": ["Honestly, because I've been building the same loop. My voice agent at alfred_ sits on a live call and takes real actions, and the hard part was never the model; it was making the action happen once, correctly, with the person's yes.",
                  "Clarion has that problem with higher stakes: a booking or a refill in someone's EHR. And healthcare is close to my research, multi-agent medical reasoning at UIC. I'd like to build that properly, with a team that's already in front of real clinics."]}],
     "land": "You have built the loop, the stakes here are higher, and you measure by outcome.",
     "notes": ["Pointers are written from the research and your facts; pick three and say them your way. Version A is one way to string them together."]},

    {"id": "why-role", "title": "Why this role?", "length": "about 30 seconds",
     "when": "Possible, often folded into Why Clarion.",
     "probes": ["Fullstack or backend: which do you prefer?", "How much frontend have you done?"],
     "vname": "Pointers",
     "say": [
         "**The stack is mine.** TypeScript, Node and Deno, Postgres on Supabase, React admin and monitoring UIs at alfred_; React and Node at WheelPrice, where I took an API from 1.5 seconds to 300 milliseconds.",
         "**The three challenges in the posting are my last year.** LLM-driven workflows, low-latency voice, and integrations with systems I don't control.",
         "**Features used daily, owned end to end.** I like owning a feature from the customer's problem to the dashboard that proves it works, and the posting says that's the job.",
         "**Learning from people who've done it.** Founders and senior engineers on healthcare, AI and real-time systems. On a team as small as alfred_'s I'm the most senior engineer; here I'd learn from people who've built at scale."],
     "variants": [],
     "land": "Your stack, your last year's problems, and people to learn from.",
     "notes": ["Pick two. Do not argue level: the posting asks 3 to 5 years; let them place you."]},

    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "Likely in an intro chat.",
     "probes": ["Why now?", "Is the company doing well?", "How do we know you won't leave us too?"],
     "say": [
         "I\u2019m not looking to leave because there\u2019s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent \u2014 evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome. Clarion seems particularly aligned with that."],
     "vname": "Yours",
     "variants": [
         {"name": "B, a stage fit", "land": "You did the 0-to-1; you are moving toward real usage and people to learn from.",
          "say": ["I joined alfred_ as a founding engineer to do the zero-to-one, and I gave it a full build cycle: the agent engine, memory, the evals.",
                  "What I want next is the part that only exists further along: real usage every day, on-call, and senior engineers to learn from. On a team that small I'm the most senior engineer. Clarion is a deliberate move toward that, on a problem I already know well."]}],
     "land": "Not away from alfred_; toward real usage and people to learn from.",
     "notes": ["Your words from INTRO.md; only the company name changed. 20% on leaving, 80% on where you are going. Never funding, usage numbers, or anything but respect for the founders."]},

    {"id": "next", "title": "What are you looking for next?", "length": "about 40 seconds",
     "when": "Possible.",
     "probes": ["IC or lead?", "Where do you see yourself in a few years?"],
     "say": [
         "Short term, I want to be somewhere the agentic engineering is actually at the frontier \u2014 not a demo, but running against real stakes, where getting it wrong has weight. That's the fastest way I know to get good, seriously good, at this.",  # verbatim
         "Long term, I want to understand this domain and this kind of engineering deeply enough that I can actually lead it \u2014 see where the real bottlenecks are, and push us toward the better one before it costs months. But I don't want that to mean stepping back from the actual work."],  # verbatim
     "vname": "Yours",
     "variants": [],
     "land": "Agents against real stakes now; lead it later, hands in the code. Patient calls are real stakes.",
     "notes": ["Your goals from INTRO.md."]},

    {"id": "reliable", "title": "How do you make an AI agent reliable when it takes real actions?", "length": "about 60 seconds",
     "when": "Likely from an engineer, in some form: how it works, what breaks.",
     "probes": ["What happens on a retry?", "How do you know a change made it better?", "What stays in code, not the prompt?"],
     "vname": "Pointers",
     "say": [
         "**The model proposes, code decides.** Every write goes through one gate in code: a send to someone else, a delete or an unknown tool waits for the person's yes.",
         "**Every action happens once.** An intent row with an idempotency key before the provider call; after a crash, reconcile with the provider before retrying. Zero duplicate sends.",
         "**Grade on what happened.** Evals count 'I sent it' only if a row shows the send: several trials per case, a blind grader, a bar set in advance.",
         "**For a clinic call,** the same shape: the booking is the write, the slot comes from the EHR not the model, and the confirmation read back to the patient comes from the record."],
     "variants": [],
     "land": "Gates in code, once-only writes, evals graded on outcomes.",
     "notes": ["Numbers are from your GenAI answers on the Amazon page; keep to the ones you can defend."]},

    {"id": "fullstack", "title": "Tell me about something full-stack you shipped", "length": "about 45 seconds",
     "when": "Possible: the posting is fullstack.",
     "probes": ["What was slow, and how did you find it?", "What did the frontend look like?"],
     "vname": "Pointers",
     "say": [
         "**WheelPrice: a CMS blog subsystem from scratch, React, Node and MongoDB,** customer-facing, 10 to 20 thousand daily users.",
         "**The fix I'm proudest of:** API response time from 1.5 seconds to 300 milliseconds, by fixing the queries and pooling database connections, with Redis caching and server-side rendering for SEO.",
         "**At alfred_,** the React admin and monitoring UIs on top of Postgres: the screens I use to see what the agent did on a turn and why."],
     "variants": [],
     "land": "You ship the whole slice and you measure the slow part.",
     "notes": ["Master reference 3.1 and 3.2."]},

    {"id": "logistics", "title": "Logistics he may ask", "length": "a line each",
     "when": "Likely at the end. Your answers are in chat, not on this page.",
     "probes": ["Are you in New York, or open to relocating? The role is in person.", "Start date?", "Work authorization?", "Compensation?", "Where else are you interviewing?"],
     "say": [],
     "land": "One sentence each.",
     "notes": ["In person in New York, five days by the look of the posting: decide your answer before the call. Pay, authorization and timing: your answers from chat."]},
]

QA = []
TABS = ["overview", "prep", "rounds"]

ASK_3C = [
    {"id": "clarify", "title": "While he talks: clarifying", "when": "During his part on the role. One or two, on his words.",
     "why": "Shows you are mapping the system as he describes it.",
     "how": ["Ask on his words: 'when you said X, do you mean...'"],
     "items": [
         {"to": "Jared", "q": "What does a week look like for an engineer in this role: how much is product features, voice infrastructure, or EHR integrations?",
          "loop": "When he describes the role.", "why": "Where the fullstack title actually sits."},
         {"to": "Jared", "q": "When a practice comes on board, how much of their setup is configuration, and how much ends up as code?",
          "loop": "When he mentions customers or onboarding.", "why": "Each practice's rules without a rebuild per customer: their stated hard problem."}]},
    {"id": "collab", "title": "Before the end: collaborating", "when": "When he asks for questions. Pick one.",
     "why": "Thinks with him about a real problem.",
     "how": ["Ask one, listen, then say in a sentence how you have handled the same thing."],
     "items": [
         {"to": "Jared", "q": "You came from five years at Amazon to a founding engineer role here. What's been the biggest difference in how you build?",
          "loop": "Lead with this one for Jared.", "why": "He gets to talk about himself, and you learn how the team works."},
         {"to": "Jared", "q": "When an agent handles a call badly, a wrong slot or a missed refill, how do you find out, and how do you prove a fix before it reaches every practice?",
          "loop": "If he talks about quality or incidents.", "why": "Your eval bench: graded on what was written, replayed before a change ships."},
         {"to": "Jared", "q": "Writing back to the EHR, some by API and some by RPA: how do you make a booking safe to retry?",
          "loop": "If he talks about integrations.", "why": "Your write path: intent row, idempotency key, reconcile before retry."}]},
    {"id": "contribute", "title": "At the end: next steps", "when": "The last two minutes.",
     "why": "Leaves you knowing where you would add.",
     "how": ["Two at most, then close in your words from INTRO.md: \u201cReally appreciate you taking the time today. This was helpful \u2014 honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them.\u201d"],
     "items": [
         {"to": "Jared", "q": "What does success look like for this role in the first 90 days?", "loop": "First.", "why": "Your question from INTRO.md."},
         {"to": "Jared", "q": "What does the process look like from here, and the rough timeline?", "loop": "Last.", "why": "Your question from INTRO.md. The posting says a technical hour, then an onsite in New York."}]},
]
ASK = []
TRAPS = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
    {"id": "voice", "prompt": "Tell me about the voice agent you built.", "target": "90 seconds", "seconds": 90, "ref": "#say-voice"},
    {"id": "why-clarion", "prompt": "Why Clarion?", "target": "40 seconds", "seconds": 40, "ref": "#say-why-clarion"},
]
