BASELINE.field({
  id: "overview", name: "The fields, and how they fit", short: "Overview", layer: "Start",
  ink: "#6B5B3E", inkDark: "#C9B48A",
  lede: "Sixteen fields of software engineering, each drawn as a map: what its parts are, where you meet them in real products, the nuance that separates knowing the word from knowing the thing, and what to read when you want depth.",
  overview: [
    "Every field here rests on the ones below it. **Foundations** is how computers, networks and data actually behave: processes and memory, the network stack, what happens when one machine becomes many, and how data is stored and kept correct. **Building** is how software reaches people: the backend that holds state and logic, the frontend and mobile apps people touch, the cloud it runs on, and the practice of shipping and running it safely. **Intelligence** is models: how they learn, how they are built into products, how they are served fast and cheaply, and two special cases: sound and speech, and language and conversation. **Worlds** is real-time pictures and play: rendering on the GPU, and the engines and loops that make games.",
    "Most real systems cross three or four fields at once. A voice agent is audio and speech, AI engineering, inference, backend and cloud in one call. A game's online mode is game development, graphics, networking and distributed systems. The map below is drawn that way.",
    "Each field opens to its About: what the field is, its map, where to start, and every topic as a name and a line. Pick a topic from the outline on the left and it reads on its own: what it is, where it is used, an example, the catch, and what to read. The arrow keys walk a field's topics in order."
  ],
  diagram: {
    nodes: [
      { id: "systems", label: "Systems", sub: "how computers run code", col: 0, row: 0 },
      { id: "distributed", label: "Distributed systems", sub: "many machines, one answer", col: 0, row: 1 },
      { id: "data", label: "Data", sub: "storing and moving it", col: 0, row: 2 },
      { id: "backend", label: "Backend", sub: "state, logic, APIs", col: 1, row: 0 },
      { id: "frontend", label: "Frontend", sub: "the web people touch", col: 1, row: 1 },
      { id: "mobile", label: "Mobile", sub: "apps in a pocket", col: 1, row: 2 },
      { id: "cloud", label: "Cloud", sub: "renting the machines", col: 1, row: 3 },
      { id: "devops", label: "DevOps, security", sub: "shipping and running", col: 1, row: 4 },
      { id: "ml", label: "ML and deep learning", sub: "how models learn", col: 2, row: 0 },
      { id: "ai", label: "AI engineering", sub: "models in products", col: 2, row: 1 },
      { id: "inference", label: "Inference", sub: "serving them fast", col: 2, row: 2 },
      { id: "audio", label: "Audio and speech", sub: "sound as data", col: 2, row: 3 },
      { id: "graphics", label: "Graphics", sub: "pictures on the GPU", col: 2, row: 4 },
      { id: "games", label: "Game development", sub: "loops, engines, play", col: 2, row: 5 }
    ],
    edges: [
      ["systems", "backend"], ["data", "backend"], ["distributed", "cloud"], ["backend", "frontend"],
      ["backend", "ai"], ["cloud", "inference"], ["ml", "ai"], ["inference", "ai"], ["graphics", "games"]
    ],
    cap: "**Read it left to right: foundations, then what gets built on them, then the model and real-time fields.** An arrow points from a field to one that builds on it; these are a few of the strongest, not all. Hover a field to preview its own map beside this one; click to keep it there, and open the field from the preview."
  },
  sections: [
    { title: "The bar worth aiming at",
      body: [
        "A real loop, written up by the candidate: an ML engineer role at Sarvam AI, an Indian lab building speech and language models. No DSA round. The first round was a proctored 2.5-hour build: a voice activity detector from scratch on about fifty audio files, judged on how accurately it found speech, the quality of the code, and the improvements the candidate could name but not finish.",
        "The second round was with the head of the speech recognition team: the candidate's own work in depth (an STT pipeline held under 800 ms at p95, and how it was benchmarked and stress-tested), how Whisper processes audio in chunks, gradient descent written from scratch, perplexity and LLM benchmarks, self-attention, encoder-decoder against decoder-only, the linear algebra under transformers, and why their TTS models separate speech content from speaker and style.",
        "The pattern is the point. Build the thing from scratch, measure it, and explain the internals of the models you use. Every field below is where some of that comes from."
      ],
      read: [{ label: "Harsh Rana: my interview experience with Sarvam AI for an ML engineer role", url: "https://x.com/ranaharshraj7/status/2065801122494001516", m: 8 }] },
    { title: "On doing the work",
      body: [
        "A map only helps if you walk it. Two pieces worth rereading when the plan feels heavy. Paul Graham's essay argues for choosing work you are curious about, working at its frontier, and being consistent: small daily progress compounds into the ability to do great work. The second, on getting ahead, is about leverage: make things in public, keep promises, combine skills, and give luck more surface to land on."
      ],
      read: [
        { label: "Paul Graham, How to Do Great Work (2023): the sections on choosing work, curiosity, consistency and morale", url: "https://paulgraham.com/greatwork.html", m: 40 },
        { label: "Hades, The Principles of Getting Ahead: seven principles, from asymmetric bets to surface area for luck", url: "https://x.com/0xhvdes/status/2098009222302540086", m: 8 }
      ] }
  ],
  see: [
    { label: "System design guide", href: "SYSTEM%20DESIGN.html" },
    { label: "Coding primer", href: "CODING.html" },
    { label: "Deep learning from scratch", href: "DEEP-LEARNING.html" }
  ]
});
