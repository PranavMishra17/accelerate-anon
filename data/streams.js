/* The streams: everything you are getting good at, as one trunk, three rivers, a bridge, your edge and two
   far rivers. A view over the plan, never a second plan: the milestones in index.html stay the order you
   study in. Drawn by the tracker at #/streams.

   Each stream: id, name, kind (trunk | river | bridge | edge | far), what (one line), why (why it matters
   for you), tracks (tracker session tracks that feed it), sessions (session ids that feed it, plan or
   wildcard), loops (interview loop ids), fields (Baseline field ids), on (pages on this site), backlog
   (whole courses for later: {label, url, m, why, src}; m is hours here, not minutes), research (far rivers
   only: the questions a research week would answer). Every outside link was opened on 3 Oct 2026. */
var STREAMS = [
  { id: "foundations", name: "Foundations", kind: "trunk",
    what: "Mathematics, data structures and algorithms, how a computer and a network work.",
    why: "It feeds every river, the far ones included: linear algebra is graphics and robotics, signals are audio and defence, probability is ML and evals. The charter makes mathematics weekly and permanent for this reason.",
    tracks: ["Mathematics"], sessions: ["wc25", "wc26", "wc27"], loops: [], fields: ["systems"],
    on: [{ label: "Coding page: patterns from zero", url: "CODING.html" }],
    backlog: [
      { label: "AI Engineering from Scratch, phase 1: math foundations (22 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F01-math-foundations%2F01-linear-algebra-intuition", m: 12, why: "The pull you feel on maths steps; this is the whole phase, for after milestone 1.", src: "aieng" },
      { label: "3Blue1Brown, Essence of Linear Algebra (playlist)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", m: 3, why: "The geometry under every matrix in ML and graphics.", src: "course" },
      { label: "3Blue1Brown, Essence of Calculus (playlist)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", m: 3, why: "Derivatives as limits of approximations, then integrals.", src: "course" },
      { label: "Mathematics for Machine Learning (Deisenroth, Faisal, Ong)", url: "https://mml-book.github.io/", m: 40, why: "The reference book once the visual intuition is there.", src: "course" },
      { label: "Seeing Theory: probability, visually", url: "https://seeing-theory.brown.edu/", m: 4, why: "Probability and statistics you can poke.", src: "course" },
      { label: "NeetCode roadmap", url: "https://neetcode.io/roadmap", m: 60, why: "DSA patterns in order, for milestone 2 onwards.", src: "roadmap" }
    ] },

  { id: "systems", name: "Systems", kind: "river",
    what: "System design, distributed systems, backend, cloud and DevOps, data. Full-stack and frontend as upkeep.",
    why: "Where most technical rounds go, and the vocabulary for systems you already ship. Frontend and full-stack only need upkeep: you build them at work.",
    tracks: ["Systems"], sessions: ["wc19", "wc21", "wc22", "wc1", "wc15", "wc16", "wc8", "wc9", "wc17"], loops: ["coframe", "commure", "raydar", "oxus"],
    fields: ["distributed", "backend", "cloud", "devops", "data", "frontend", "mobile"],
    on: [{ label: "System design guide", url: "SYSTEM%20DESIGN.html" }],
    backlog: [
      { label: "System design primer", url: "https://github.com/donnemartin/system-design-primer", m: 20, why: "The broad reference behind the guide's patterns.", src: "tutorial" },
      { label: "Learn to Cloud", url: "https://learntocloud.guide/", m: 60, why: "Linux, networking, a cloud provider and DevOps, phase by phase.", src: "roadmap" },
      { label: "roadmap.sh: backend", url: "https://roadmap.sh/backend", m: 40, why: "The backend map: databases, caching, queues, auth, APIs.", src: "roadmap" },
      { label: "MIT 6.5840 Distributed Systems (lectures and labs)", url: "https://pdos.csail.mit.edu/6.824/", m: 80, why: "Raft, replication and consistency, built, not described.", src: "course" },
      { label: "Full Stack Open", url: "https://fullstackopen.com/en/", m: 60, why: "Upkeep for frontend and full-stack when a role asks for it.", src: "course" },
      { label: "DDIA, 2e", book: "DDIA, 2e: the reference hung off the systems sessions", m: 30, why: "Not a reading schedule: chapters as sessions call for them.", src: "book" }
    ] },

  { id: "ml", name: "ML, by mechanism", kind: "river",
    what: "Machine learning, deep learning, PyTorch from scratch, training.",
    why: "Milestones 2 and 3: machine learning stops being metaphor, and you can derive rather than describe. TrenTorch is the spine.",
    tracks: ["Requeue"], sessions: ["wc26", "wc27"], loops: [], fields: ["ml"],
    on: [{ label: "Alaap and TrenTorch plan", url: "ALAAP.html" }],
    backlog: [
      { label: "Karpathy, Neural Networks: Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html", m: 25, why: "Backprop, then a GPT, built line by line.", src: "course" },
      { label: "Dive into Deep Learning", url: "https://d2l.ai/", m: 60, why: "The textbook the maths steps already point into, with code.", src: "course" },
      { label: "AI Engineering from Scratch, phase 2: ML fundamentals (18 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F02-ml-fundamentals%2F01-what-is-machine-learning", m: 10, why: "Classical ML before deep learning.", src: "aieng" },
      { label: "AI Engineering from Scratch, phase 3: deep learning core (13 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F03-deep-learning-core%2F01-the-perceptron", m: 8, why: "Perceptron to training loop.", src: "aieng" },
      { label: "PyTorch: learn the basics", url: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html", m: 3, why: "Tensors to the optimisation loop, the official way.", src: "tutorial" },
      { label: "Pramod Goyal: Reinforcement learning from scratch #1 (an X article)", url: "https://x.com/goyal__pramod/status/2106244243727507733", m: 2, why: "Problem first: a casino of slot machines becomes the multi-armed bandit, then Sutton and Barto chapters 2 to 4, with a long reference list.", src: "tutorial" },
      { label: "Cameron Wolfe: Proximal Policy Optimization (PPO)", url: "https://cameronrwolfe.substack.com/p/proximal-policy-optimization-ppo", m: 1, why: "Policy gradients to PPO, the algorithm under RLHF.", src: "tutorial" },
      { label: "Schulman et al., Proximal Policy Optimization Algorithms (the paper)", url: "https://arxiv.org/abs/1707.06347", m: 2, why: "The source, once the explainer above makes sense.", src: "tutorial" }
    ] },

  { id: "ai", name: "AI engineering", kind: "river",
    what: "Applied AI, LLM systems, retrieval, agentic AI, harness engineering and evals.",
    why: "Your job and most of your loops. It arrives mostly through interviews and work, so it grows fastest; the risk is that it grows without the mechanism underneath.",
    tracks: ["Interview"], sessions: ["wc23", "wc24", "wc25", "wc26", "wc27", "wc28", "wc29", "wc30", "wc31", "wc18", "wc13", "wc15", "wc16", "wc8", "wc9"],
    loops: ["vanguard", "coframe", "zenml-r3", "commure", "river", "raydar", "mphasis"], fields: ["ai", "nlp"],
    on: [{ label: "Coding page: AI systems", url: "CODING.html#ai" }, { label: "Interviews hub", url: "INTERVIEWS.html" }],
    backlog: [
      { label: "AI Engineering from Scratch, phase 11: LLM engineering (17 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F11-llm-engineering%2F01-prompt-engineering", m: 10, why: "Prompting, retrieval, structured output, the production basics.", src: "aieng" },
      { label: "AI Engineering from Scratch, phase 14: agent engineering (54 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F14-agent-engineering%2F01-the-agent-loop", m: 30, why: "The agent loop to multi-step tools; the agentic stream in full.", src: "aieng" },
      { label: "AI Engineering from Scratch, phase 7: transformers deep dive (16 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F07-transformers-deep-dive%2F01-why-transformers", m: 9, why: "Where AI engineering meets the ML river.", src: "aieng" },
      { label: "AI Engineering from Scratch, phase 5: NLP foundations to advanced (29 lessons; 10 are in the Vanguard path)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F05-nlp-foundations-to-advanced%2F01-text-processing", m: 15, why: "Tokenisation to dialogue state tracking; the rest of the phase after the Vanguard call.", src: "aieng" },
      { label: "Hugging Face LLM course", url: "https://huggingface.co/learn/llm-course/chapter1/1", m: 20, why: "Transformers, tokenizers, fine-tuning, hands on.", src: "course" },
      { label: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", m: 1, why: "Workflows against agents, and when each is right.", src: "tutorial" },
      { label: "Learn Harness Engineering (14 lectures)", url: "https://walkinglabs.github.io/learn-harness-engineering/en/", m: 10, why: "Why capable agents still fail, and what the loop around the model must do: instructions, state, memory, validation, observability. Intuitive on why some things work and others do not.", src: "course" },
      { label: "Hamel Husain: Your AI product needs evals", url: "https://hamel.dev/blog/posts/evals/", m: 1, why: "Harness engineering as error analysis first.", src: "tutorial" }
    ] },

  { id: "inference", name: "Inference engineering", kind: "bridge",
    what: "Serving models: batching, KV cache, quantisation, latency, throughput and cost.",
    why: "Where systems, ML and your voice work meet: latency budgets are the whole game in a live voice agent. A parked track in the roadmap, touched by every voice and agent loop.",
    tracks: [], sessions: ["wc20", "wc22"], loops: ["commure", "coframe"], fields: ["inference"],
    on: [],
    backlog: [
      { label: "100 days of inference", url: "https://github.com/elizabetht/100-days-of-inference", m: 50, why: "The inference engineering roadmap, a day at a time.", src: "roadmap" },
      { label: "AI Engineering from Scratch, phase 17: infrastructure and production (28 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F17-infrastructure-and-production%2F01-managed-llm-platforms", m: 15, why: "Serving, scaling and cost in production.", src: "aieng" },
      { label: "Karan: everything an AI engineer needs to know about GPUs (an X article)", url: "https://x.com/kmeanskaran/status/2105635344385450151", m: 1, why: "Prefill is bound by compute, decode by memory bandwidth, and two divisions before renting a GPU (weights over VRAM, active weights over bandwidth): step 1 of the roadmap's inference sketch.", src: "tutorial" },
      { label: "Hugging Face: model memory anatomy", url: "https://huggingface.co/docs/transformers/main/en/model_memory_anatomy", m: 1, why: "Where training memory goes: weights, gradients, optimiser states, activations.", src: "tutorial" },
      { label: "Pope et al., Efficiently Scaling Transformer Inference (MLSys 2023)", url: "https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf", m: 3, why: "Why prefill and decode batch differently, multi-chip layouts, and the KV cache as the capacity limit.", src: "tutorial" },
      { label: "Wafer: the paper above as deployment checks (an X post)", url: "https://x.com/wafer_ai/status/2105092095786762676", m: 1, why: "A short way into Pope et al. before the PDF.", src: "tutorial" }
    ] },

  { id: "audio", name: "Audio and voice", kind: "edge",
    what: "Audio ML, speech, voice systems.",
    why: "What makes you rare: a live voice agent at work and Alaap, an acoustics project. Few engineers have both.",
    tracks: ["Alaap"], sessions: ["wc19", "wc20", "wc23", "wc24"], loops: ["commure"], fields: ["audio"],
    on: [{ label: "Alaap and TrenTorch plan", url: "ALAAP.html" }],
    backlog: [
      { label: "AI Engineering from Scratch, phase 6: speech and audio (17 lessons)", url: "https://aiengineeringfromscratch.com/lesson?path=phases%2F06-speech-and-audio%2F01-audio-fundamentals", m: 10, why: "Audio fundamentals to speech models.", src: "aieng" },
      { label: "Hugging Face audio course", url: "https://huggingface.co/learn/audio-course/chapter0/introduction", m: 15, why: "Audio data, ASR, TTS and classification with transformers.", src: "course" },
      { label: "LiveKit Agents docs", url: "https://docs.livekit.io/agents/", m: 4, why: "The real-time voice stack you work in, end to end.", src: "tutorial" }
    ] },

  { id: "hardware", name: "Space, defence and hardware", kind: "far",
    what: "Signals and control, estimation, embedded systems, electronics and mechanics, robotics.",
    why: "A real interest, and Indian space and defence startups are newly hiring. Parked in the roadmap until it gets one honest research week.",
    tracks: [], sessions: [], loops: [], fields: [],
    on: [],
    research: [
      "Which Indian space and defence companies (startups and private) hire software and ML engineers, and for what roles?",
      "What do those roles ask for that you do not have: embedded C, real-time systems, control, estimation, clearances or citizenship rules?",
      "Which of your streams transfer directly (Foundations, Systems, ML) and which gap needs its own study?",
      "What one small artifact would show the interest is real (a Kalman filter on real sensor data, a flight-software toy)?"
    ],
    backlog: [
      { label: "MIT OCW 6.003 Signals and Systems", url: "https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/", m: 60, why: "Shared with audio: the bridge from your voice work to control and sensing.", src: "course" },
      { label: "Kalman and Bayesian Filters in Python", url: "https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python", m: 30, why: "Estimation, the core of guidance and navigation, built in notebooks.", src: "course" },
      { label: "Introduction to Robotics and Perception", url: "https://www.roboticsbook.org/", m: 30, why: "State, actions, sensing and planning, with code.", src: "course" }
    ] },

  { id: "graphics", name: "Graphics, games and XR", kind: "far",
    what: "Computer graphics, game design, virtual reality.",
    why: "A long-held interest. It shares the trunk (linear algebra, geometry) and parts of systems (real-time loops, performance); it gets a research week before study time.",
    tracks: [], sessions: [], loops: [], fields: ["graphics", "games"],
    on: [],
    research: [
      "Which roles join graphics or XR with what you already do (tools, ML for graphics, real-time engines, simulation)?",
      "Is the path hobby projects alongside the main plan, or a career pivot later, and what would decide it?",
      "What one small artifact would teach the most: a ray tracer, a tiny engine loop, a WebXR scene?"
    ],
    backlog: [
      { label: "Ray Tracing in One Weekend (series)", url: "https://raytracing.github.io/", m: 15, why: "A renderer from nothing; linear algebra made visible.", src: "course" },
      { label: "Scratchapixel", url: "https://www.scratchapixel.com/", m: 40, why: "Graphics fundamentals explained from first principles.", src: "course" },
      { label: "Game Programming Patterns", url: "https://gameprogrammingpatterns.com/", m: 12, why: "The game loop, components and the patterns engines are made of.", src: "course" }
    ] }
];
