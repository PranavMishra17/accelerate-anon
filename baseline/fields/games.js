BASELINE.field({
  id: "games", name: "Game development", short: "Games", layer: "Worlds",
  ink: "#A0472A", inkDark: "#EB9C82",
  lede: "Making interactive worlds that run in real time and are worth playing: the engine and simulation underneath, and the design that decides what the player feels.",
  overview: [
    "Game development is two crafts in one team. **Engineering** builds a program that reads input, simulates a world and draws it every 16 milliseconds, then keeps several machines in agreement over a network. **Design** decides the rules, the spaces and the pacing, and finds out by playtesting whether any of it is fun. Job titles: gameplay, engine, tools, network, AI and graphics programmer; game, systems, level, combat and UX designer; technical designer and technical artist in between; producer.",
    "It borrows from almost every other field here. The renderer is graphics; multiplayer is distributed systems with a 100 ms deadline; live games are backend and data engineering; consoles and phones are performance engineering under fixed budgets. The industry in 2026 is large and uneven: a few platform holders (Valve, Sony, Microsoft, Nintendo, Apple, Google), engines dominated by Unity, Unreal and a fast-growing Godot, big studios cutting staff after the pandemic boom, and small teams shipping hits on Steam.",
    "If you are aiming at design, read the design cluster first and treat the engineering clusters as the material you design with. If you are aiming at programming, start with the loop and the engine, but do not skip design: the best gameplay programmers can say why a mechanic feels wrong."
  ],
  diagram: {
    nodes: [
      { id: "input", label: "Input", sub: "devices to actions", col: 0, row: 0 },
      { id: "game-loop", label: "Game loop", sub: "fixed update, render", col: 0, row: 1 },
      { id: "ecs", label: "Entities and systems", sub: "the world as data", col: 0, row: 2 },
      { id: "game-ai", label: "Game AI", sub: "what the NPCs decide", col: 1, row: 0 },
      { id: "physics", label: "Physics", sub: "move, collide, resolve", col: 1, row: 1 },
      { id: "animation", label: "Animation", sub: "poses from state", col: 1, row: 2 },
      { id: "netcode", label: "Netcode", sub: "agree across machines", col: 2, row: 0 },
      { id: "graphics", label: "Rendering", sub: "see the Graphics field", col: 2, row: 1 },
      { id: "game-audio", label: "Audio", sub: "events mixed in 3D", col: 2, row: 2 },
      { id: "mda", label: "Mechanics to feelings", sub: "the MDA lens", col: 0, row: 3 },
      { id: "core-loops", label: "Core loop", sub: "what players repeat", col: 1, row: 3 },
      { id: "playtesting", label: "Playtesting", sub: "watch, then change", col: 2, row: 3 }
    ],
    edges: [
      ["input", "game-loop", "commands"], ["game-loop", "ecs", "tick"], ["ecs", "game-ai"], ["ecs", "physics"],
      ["ecs", "animation", "state"], ["physics", "netcode", "state to sync"], ["physics", "graphics", "transforms"],
      ["animation", "graphics", "poses"], ["animation", "game-audio", "footsteps"],
      ["mda", "ecs", "mechanics"], ["mda", "core-loops", "dynamics"], ["core-loops", "playtesting", "build, test"]
    ],
    cap: "**Three rows of engine, one row of design: a frame flows from input through the loop to the world's data, which every system reads and rendering, audio and the network consume.** The bottom row is why any of it exists: mechanics are written in code, and only playtesting shows the feelings they produce. Click a box to open it."
  },
  start: [
    { label: "Robert Nystrom, Game Programming Patterns (free online): Game Loop, Update Method, Component, State", url: "https://gameprogrammingpatterns.com/contents.html", m: 90,
      why: "The engine's skeleton explained by a former EA engineer, one pattern per chapter, with the trade-offs." },
    { label: "Hunicke, LeBlanc and Zubek, MDA: a formal approach to game design and game research (2004)", url: "https://users.cs.northwestern.edu/~hunicke/MDA.pdf", m: 20,
      why: "Five pages that give designers and programmers one vocabulary for why rules produce feelings." },
    { label: "The Level Design Book: what is level design, then the blockout chapter", url: "https://book.leveldesignbook.com/", m: 40,
      why: "A free, practical design text on building spaces, built around playtesting rough versions early." },
    { label: "Gabriel Gambetta, Fast-paced multiplayer (parts 1 to 4)", url: "https://www.gabrielgambetta.com/client-server-game-architecture.html", m: 40,
      why: "The clearest short explanation of prediction, reconciliation, interpolation and lag compensation." }
  ],
  clusters: [
    { name: "The engine underneath", line: "The loop, the world's data, input and the tools that feed them.",
      topics: [
        { id: "game-loop", name: "The game loop and frame timing",
          line: "Read input, advance the world, draw it, repeat, at a steady pace whatever the hardware.",
          body: [
            "Every game runs one loop: **process input, update the simulation, render**. At 60 frames a second each pass has 16.7 ms. The question is how the update step handles time. A **variable time step** multiplies movement by the frame's elapsed time, which is simple but makes physics differ with frame rate. A **fixed time step** advances the simulation in equal slices (often 1/50 or 1/60 s) and runs as many as real time requires.",
            "The standard pattern is an **accumulator**: add each frame's real time to it, run fixed updates while it holds a whole step, and render with an interpolation factor for the leftover fraction, so motion stays smooth even when render and update rates differ. Frame **pacing**, delivering frames at even intervals, matters as much as the average rate."
          ],
          where: "Unity separates Update from FixedUpdate (0.02 s by default); Godot separates _process from _physics_process; every netcode and replay system depends on a fixed, deterministic step.",
          nuance: "A game at a steady 30 fps feels better than one swinging between 40 and 60. Players feel uneven frame times as stutter even when the average looks fine.",
          read: [
            { label: "Robert Nystrom, Game Programming Patterns: Game Loop", url: "https://gameprogrammingpatterns.com/game-loop.html", m: 25 },
            { label: "Glenn Fiedler, Gaffer On Games: Fix your timestep!", url: "https://gafferongames.com/post/fix_your_timestep/", m: 15 }
          ],
          tags: ["game loop", "delta time", "fixed timestep", "accumulator", "interpolation", "frame pacing", "vsync"] },
        { id: "engines", name: "Engines: Unity, Unreal, Godot, or your own",
          line: "The runtime, editor and pipeline you build a game on, and when to write one.",
          body: [
            "An engine bundles a renderer, physics, audio, animation, input, a scene editor, an asset pipeline and builds for each platform. **Unreal** (C++ and Blueprints visual scripting) leads in high-end 3D, with Nanite geometry and Lumen lighting; Epic takes a 5% royalty above a revenue threshold. **Unity** (C#) dominates mobile and is common in indie and mid-size studios. **Godot** (MIT licensed, GDScript and C#) grew fast after Unity's 2023 runtime fee announcement, which Unity later withdrew.",
            "Studios build their own engines when they need something the general ones do badly (huge simulations, unusual rendering, long-lived franchises): id Tech, EA's Frostbite, Guerrilla's Decima, Capcom's RE Engine. Small teams do it for games whose core is unusual, such as Factorio or Noita."
          ],
          where: "Fortnite and many AAA titles run on Unreal; Genshin Impact, Hollow Knight and most mobile hits on Unity; Brotato and Buckshot Roulette on Godot.",
          nuance: "Engine choice is mostly a decision about people, platforms and tools, not features: who you can hire, which consoles you must ship on, and how fast designers can iterate in the editor.",
          read: [{ label: "Godot docs: introduction, key concepts and design philosophy", url: "https://docs.godotengine.org/en/stable/getting_started/introduction/index.html", m: 30 }],
          tags: ["unity", "unreal", "godot", "engine", "custom engine", "blueprints"] },
        { id: "ecs", name: "Entity component systems",
          line: "Entities as plain ids, components as data in arrays, systems as loops over them.",
          body: [
            "Deep class hierarchies (a FlyingEnemy that is an Enemy that is an Actor) break down when designers want a flying chest. The **component** pattern composes an entity from parts instead: a transform, a sprite, a health value. **ECS** goes further and separates data from behaviour completely: an **entity** is only an id, **components** are plain data stored in tightly packed arrays, and **systems** are functions that run over every entity holding a given set of components.",
            "Packing each component type together makes the CPU cache work for you, and systems can run in parallel when they touch different data. Implementations group entities by their exact component set (**archetypes**, fast iteration) or keep one sparse set per component (fast adding and removing)."
          ],
          where: "Unity's Entities package, Bevy (Rust), flecs and EnTT (used in Minecraft Bedrock); Overwatch's gameplay is built on an ECS.",
          nuance: "Most shipped games use components on objects (Unity GameObjects, Unreal Actors), not pure ECS. ECS pays off with many similar entities; for a few dozen unique ones it adds indirection without speed.",
          read: [
            { label: "Robert Nystrom, Game Programming Patterns: Component", url: "https://gameprogrammingpatterns.com/component.html", m: 20 },
            { label: "Sander Mertens, ECS FAQ: what is ECS, archetypes and sparse sets", url: "https://github.com/SanderMertens/ecs-faq", m: 25 }
          ],
          tags: ["ecs", "component", "entity", "archetype", "sparse set", "bevy", "data-oriented"] },
        { id: "input", name: "Input",
          line: "Turning presses and stick angles into game actions that feel immediate.",
          body: [
            "Input code reads devices (keyboard, mouse, gamepad, touch, motion) by polling each frame or handling events, and maps them to **actions** ('jump', 'aim') so players can rebind keys and the same code serves every device. Analogue sticks need **dead zones** so a worn stick does not drift, and response curves so small movements aim finely.",
            "Feel lives in small rules. **Input buffering** accepts a press a few frames before it becomes legal, so a jump pressed a moment before landing still happens. **Coyote time** allows a jump a few frames after walking off a ledge. Fighting games read motion inputs ('quarter-circle forward') from a short history of directions."
          ],
          where: "Unity's Input System, Unreal's Enhanced Input and Steam Input all work on action maps; Celeste is the standard example of forgiving input rules done well.",
          nuance: "Input latency is the sum of the controller, the game's frame or two of processing, rendering and the display. Players cannot name it but feel it as heaviness, and it is decided by engine structure, not by input code.",
          read: [{ label: "Robert Nystrom, Game Programming Patterns: Command (configuring input)", url: "https://gameprogrammingpatterns.com/command.html", m: 20 }],
          tags: ["input", "action mapping", "dead zone", "input buffering", "coyote time", "latency"] },
        { id: "tools-pipelines", name: "Tools and asset pipelines",
          line: "How art, levels and data get from the people who make them into the running game.",
          body: [
            "Artists build in **DCC tools** (Blender, Maya, Houdini, Substance, ZBrush) and export to interchange formats such as FBX, glTF or USD. The engine **imports** each asset and **cooks** it into a platform-specific form: compressed textures, meshes with levels of detail, baked lighting, packed audio. Builds bundle the result per platform, often on a farm of build machines, because a full AAA cook can take hours.",
            "Tools programmers build the editors, importers and validators that make this fast: level editors, dialogue tools, data tables, hot reload so a change appears without restarting. Version control is usually **Perforce**, because it handles terabytes of binary files and file locking; Git with LFS suits smaller teams."
          ],
          where: "Unreal's cook step, Unity's import pipeline and Pixar's USD (now standard across film and moving into games) are the common backbones.",
          nuance: "The number that decides a team's speed is iteration time: how long from changing something to seeing it in the game. Shaving it from minutes to seconds is worth more than most runtime optimisations.",
          tags: ["asset pipeline", "dcc", "fbx", "gltf", "usd", "perforce", "cooking", "build"] }
      ] },
    { name: "Simulation and life", line: "The systems that make a world move, react, think and sound.",
      topics: [
        { id: "physics", name: "Physics and collision",
          line: "Integrating motion each step, finding what touches, and pushing it apart.",
          body: [
            "A physics step does three things. It **integrates**: apply forces to velocities and velocities to positions, usually with semi-implicit Euler at a fixed rate. It **detects collisions** in two phases: a broad phase (spatial grids, sweep and prune, bounding volume trees) finds pairs that might touch, and a narrow phase (separating axis test, GJK) computes exact contacts. Then it **resolves** them, solving all contacts and joints together with an iterative solver that applies impulses.",
            "Fast, thin objects can pass straight through walls between steps (**tunnelling**), so engines add continuous collision detection for bullets and fast bodies. Player characters are usually **kinematic**: moved by gameplay code with collision checks, not by forces, because pure physics movement feels floaty and unpredictable."
          ],
          where: "Box2D (2D), PhysX (Unity and older Unreal), Chaos (Unreal 5), Havok, and Jolt, written for Horizon Forbidden West and now built into Godot.",
          nuance: "Physics is rarely bit-identical across machines, because floating-point results differ by compiler and CPU. Lockstep and rollback netcode need determinism, so those games often write their own simpler physics.",
          read: [{ label: "Erin Catto (Box2D), publications: GDC talks on sequential impulses, contacts and continuous collision", url: "https://box2d.org/publications/", m: 45 }],
          tags: ["physics", "collision", "broad phase", "gjk", "impulse", "solver", "tunnelling", "box2d", "jolt"] },
        { id: "animation", name: "Animation",
          line: "Skeletons, blends and state machines that turn movement state into a believable pose.",
          body: [
            "Characters are animated through a **skeleton**: a hierarchy of bones, with each mesh vertex weighted to a few bones (**skinning**, done on the GPU). An animation clip stores keyframed bone rotations, interpolated each frame. **Blending** mixes clips: a blend space picks between walk and run by speed and direction, and layers let the upper body reload while the legs run.",
            "An **animation state machine** decides which clips play (idle, walk, jump, land) and how transitions blend. **Inverse kinematics** adjusts the result to the world: feet planted on stairs, hands on a ledge. **Motion matching** replaces hand-built state machines by searching a large motion-capture database each frame for the pose that best fits the desired movement."
          ],
          where: "Unreal's Animation Blueprints and Unity's Animator are state machines; motion matching shipped in Ubisoft's For Honor and is now built into Unreal 5.",
          nuance: "Realism and responsiveness pull against each other. Root motion (the animation moves the character) looks right but reacts late; code-driven movement responds at once but slides. Most games use code-driven movement and correct the animation to match.",
          read: [
            { label: "Robert Nystrom, Game Programming Patterns: State (FSMs, hierarchical, pushdown)", url: "https://gameprogrammingpatterns.com/state.html", m: 25 },
            { label: "Daniel Holden, Code vs data driven displacement", url: "https://theorangeduck.com/page/code-vs-data-driven-displacement", m: 20 }
          ],
          tags: ["skeletal animation", "skinning", "blend space", "state machine", "ik", "motion matching", "root motion"] },
        { id: "game-ai", name: "AI for games",
          line: "Pathfinding plus decision structures that make characters act readably, not optimally.",
          body: [
            "**Pathfinding** finds a route: A* searches a graph by cost so far plus an estimate to the goal, over a grid or, more often in 3D, a **navigation mesh** of walkable polygons. **Decision-making** picks what to do. Finite state machines are simple and become tangled past a dozen states. **Behaviour trees**, popularised by Halo 2, compose behaviour from sequences, selectors and conditions, ticked each frame. **Utility AI** scores every option on curves (hunger, danger, distance) and picks the best, as in The Sims. **GOAP** plans a sequence of actions to reach a goal, as in F.E.A.R.",
            "Machine learning appears mostly in tools, testing and animation; shipped enemies are still hand-authored, because designers need to control them."
          ],
          where: "Recast and Detour generate navmeshes for most engines; Unreal ships behaviour trees and StateTree; Game AI Pro collects production techniques from shipped games.",
          nuance: "The goal is a fun opponent, not a winning one. Good game AI telegraphs its intentions, makes believable mistakes and quietly cheats when that serves the player's experience.",
          read: [
            { label: "Amit Patel, Red Blob Games: Introduction to A*", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html", m: 30 },
            { label: "Chris Simpson, Behavior trees for AI: how they work", url: "https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work", m: 20 }
          ],
          tags: ["pathfinding", "a*", "navmesh", "behaviour tree", "utility ai", "goap", "fsm"] },
        { id: "game-audio", name: "Audio in games",
          line: "Sound authored as events, placed in 3D, and mixed live as the game changes.",
          body: [
            "Game audio is driven by **events**: code says 'footstep on gravel at this position', and an audio designer decides in a middleware tool what that sounds like, with random variations, pitch shifts and layers. **Spatialisation** places sounds in 3D with distance attenuation, panning, and binaural filtering (HRTFs) for headphones; occlusion muffles sounds behind walls.",
            "**Adaptive music** follows the game state, fading in layers as combat intensifies or switching sections at the next bar. A live **mix** handles priorities and voice limits (only so many sounds play at once) and **ducking**, lowering music under dialogue."
          ],
          where: "FMOD and Audiokinetic's Wwise are the two middleware standards; Unreal also ships its own MetaSounds system; Hades and DOOM (2016) are well-known adaptive soundtracks.",
          nuance: "Sound carries much of a game's feedback: a hit, a pickup or an enemy behind you is often heard before it is seen. Cutting audio polish makes mechanics feel unresponsive even when the code has not changed.",
          tags: ["game audio", "fmod", "wwise", "spatial audio", "hrtf", "adaptive music", "mixing"] }
      ] },
    { name: "Playing together", line: "Keeping several machines in one world when the network is slow and unreliable.",
      topics: [
        { id: "netcode", name: "Client-server netcode",
          line: "An authoritative server, clients that predict, and tricks that hide the delay between them.",
          body: [
            "In most online games the **server is authoritative**: clients send inputs, the server simulates at a fixed **tick rate** and sends snapshots of the world back. Waiting a round trip to see your own move feels awful, so the client uses **prediction**: it applies your input at once, and when the server's answer arrives it **reconciles**, rewinding to the server's state and replaying the inputs the server has not yet processed.",
            "Other players are shown slightly in the past with **entity interpolation**, smoothly between two received snapshots. To make shooting fair, the server uses **lag compensation**: when your shot arrives it rewinds other players to where you saw them. Traffic goes over UDP with the game's own reliability, because a late packet is worse than a lost one."
          ],
          where: "Counter-Strike, Valorant (128-tick servers), Overwatch and Fortnite all use this design; Unreal's replication and Unity's Netcode for GameObjects package it.",
          nuance: "Lag compensation is a choice of who suffers: the shooter sees fair hits, so the target sometimes dies after reaching cover. Every competitive shooter tunes that trade-off rather than escaping it.",
          read: [
            { label: "Glenn Fiedler, What every programmer needs to know about game networking", url: "https://gafferongames.com/post/what_every_programmer_needs_to_know_about_game_networking/", m: 15 },
            { label: "Gabriel Gambetta, Lag compensation", url: "https://www.gabrielgambetta.com/lag-compensation.html", m: 15 }
          ],
          tags: ["netcode", "authoritative server", "prediction", "reconciliation", "interpolation", "lag compensation", "tick rate", "udp"] },
        { id: "rollback", name: "Lockstep and rollback",
          line: "Sending only inputs, simulating identically everywhere, and rewinding when a guess was wrong.",
          body: [
            "**Lockstep** sends only player inputs and has every machine run the same deterministic simulation; it waits for everyone's input each step. It carries huge worlds on little bandwidth, which is why real-time strategy games use it, but the game runs at the speed of the slowest connection.",
            "**Rollback** removes the wait. Each machine predicts the remote player's input (usually 'same as last frame'), runs ahead, and when the real input arrives and differs, it restores a saved state and re-simulates the missed frames within one frame's time. Delay-based netcode, the older alternative, adds a few frames of input lag instead."
          ],
          where: "GGPO (now MIT licensed) popularised rollback; Street Fighter 6, Guilty Gear Strive and many indie fighters use it; Age of Empires and StarCraft are lockstep.",
          nuance: "Rollback demands a fully deterministic simulation and a state you can save and restore many times per frame. Retrofitting either onto an engine not built for it is where most rollback projects stall.",
          read: [{ label: "GGPO: rollback networking, the overview", url: "https://www.ggpo.net/", m: 10 }],
          tags: ["rollback", "lockstep", "ggpo", "determinism", "fighting games", "delay-based"] }
      ] },
    { name: "Game design", line: "Deciding what the player does, feels and learns, and checking it with real players.",
      topics: [
        { id: "mda", name: "Mechanics, dynamics, aesthetics",
          line: "A lens that links the rules you write to the feelings players have.",
          body: [
            "The MDA framework splits a game into three layers. **Mechanics** are the rules and code: what actions exist, what numbers change. **Dynamics** are the behaviour that emerges when players use those mechanics against each other and the system over time: bluffing, rushing, camping. **Aesthetics** are the emotional responses the game aims for; the paper lists eight, including challenge, fellowship, discovery, expression and fantasy.",
            "The point is direction. A designer works from mechanics toward aesthetics, but a player meets the aesthetics first and the mechanics last. So you name the feeling you want, then ask which dynamics produce it, then which rules produce those dynamics, and test whether they actually do."
          ],
          where: "Taught in most game design courses and used in design reviews to argue about changes in terms of feelings rather than features.",
          nuance: "Dynamics are the hard layer: you cannot write them directly, only rules that make them likely. That is why design changes must be judged in play, not on paper.",
          read: [{ label: "Hunicke, LeBlanc and Zubek, MDA (the whole paper)", url: "https://users.cs.northwestern.edu/~hunicke/MDA.pdf", m: 20 }],
          tags: ["mda", "mechanics", "dynamics", "aesthetics", "game design"] },
        { id: "core-loops", name: "Core loops and progression",
          line: "The action players repeat every minute, and the longer loops that give it meaning.",
          body: [
            "The **core loop** is what the player does moment to moment and keeps doing: in a roguelike, enter a room, fight, take a reward, choose the next room. Around it sit slower **meta loops** that change the core over hours: upgrades, unlocks, a base to build. Hades is the textbook case: each run is the core loop, and dying returns you to a hub where permanent upgrades and story move forward, so failure still advances something.",
            "Daniel Cook separates **loops**, which players repeat and master by building a better mental model each time, from **arcs**, which deliver content once (a cutscene, a scripted level). Most games mix both; the balance sets how replayable a game is."
          ],
          where: "Every pitch and design document names a core loop; live-service games add daily and seasonal loops on top.",
          nuance: "A loop that is only rewarding because of its rewards (numbers going up, timers, streaks) becomes a compulsion loop. The test is whether the core action is enjoyable with the rewards removed.",
          read: [{ label: "Daniel Cook, Lost Garden: Loops and arcs", url: "https://lostgarden.com/2012/04/30/loops-and-arcs/", m: 20 }],
          tags: ["core loop", "meta loop", "progression", "loops and arcs", "roguelike", "retention"] },
        { id: "level-design", name: "Level design",
          line: "Building the spaces where mechanics happen, and guiding players through them without signs.",
          body: [
            "A level designer turns mechanics into situations. Work starts as a **blockout**: the level built from plain boxes and ramps, sized by the game's **metrics** (jump height, character size, weapon ranges), and playable from day one. Only after it plays well does it get art.",
            "Players are guided without words: **landmarks** visible from afar, light and colour drawing the eye toward the path, sightlines that preview the next area, and **gating** that opens new routes once an ability is learned. **Pacing** alternates tension and rest, and good levels teach a mechanic safely before testing it under pressure."
          ],
          where: "Valve's Half-Life levels, Nintendo's Mario stages (introduce, develop, twist, conclude) and FromSoftware's interconnected maps are the most studied examples.",
          nuance: "Art applied too early makes a bad layout expensive to change, so teams keep living with it. Blockouts stay ugly on purpose.",
          read: [{ label: "The Level Design Book: Blockout", url: "https://book.leveldesignbook.com/process/blockout", m: 25 }],
          tags: ["level design", "blockout", "greybox", "metrics", "pacing", "landmarks", "gating"] },
        { id: "playtesting", name: "Playtesting and iteration",
          line: "Watching real players to find where the design does not do what you intended.",
          body: [
            "A playtest puts the game in front of people who did not make it and **watches** them. Designers note where players get lost, what they ignore, where they die and what they try that the game does not allow. Think-aloud sessions capture confusion as it happens; short questionnaires afterwards capture what they felt. Telemetry (where players quit, how long each level takes) shows the same at scale.",
            "Iteration is the method: prototype the core mechanic cheaply, test, change one thing, test again. Early tests ask 'is this fun at all?' with grey boxes; later ones tune difficulty, onboarding and clarity."
          ],
          where: "Valve, Nintendo and Supercell are known for heavy internal testing; Steam Playtest and closed betas run it at scale.",
          nuance: "Players are reliable about where a problem is and unreliable about how to fix it. Treat their suggestions as symptoms, and never explain the game to a tester mid-session: the real player will not have you there.",
          read: [{ label: "The Level Design Book: Blockout, the section on playtesting a blockout", url: "https://book.leveldesignbook.com/process/blockout", m: 10 }],
          tags: ["playtesting", "iteration", "prototype", "telemetry", "user research", "find the fun"] }
      ] },
    { name: "Shipping it", line: "Running on real hardware, and getting a game in front of players who pay.",
      topics: [
        { id: "performance", name: "Performance on consoles and mobile",
          line: "Fixed hardware, fixed frame budgets, and memory, heat and battery as hard limits.",
          body: [
            "A console game must hold its frame rate on one fixed machine (PlayStation 5, Xbox Series X and S, Switch 2), so teams budget every millisecond and megabyte per system: so much for rendering, so much for animation, so much for gameplay. Platform holders run **certification** checks (crashes, save handling, suspend and resume, accessibility) before release.",
            "Phones add **thermal throttling**: a game that runs at 60 fps for five minutes may drop to 40 once the chip heats, and battery drain decides reviews. Common work: cutting draw calls, levels of detail for far objects, streaming assets instead of loading them all, and **data-oriented** layouts that keep hot data contiguous in memory."
          ],
          where: "Unreal Insights, the Unity Profiler, PIX on Xbox and Sony's Razor are the daily tools; the Switch 2 and phones are where most budgets are tightest.",
          nuance: "Mobile games are judged by sustained performance on mid-range hardware, not peak speed on a flagship. Test on a two-year-old phone after ten minutes of play.",
          read: [{ label: "Richard Fabian, Data-Oriented Design (free online edition): the introduction and data layout chapters", url: "https://www.dataorienteddesign.com/dodbook/", m: 45 }],
          tags: ["performance", "frame budget", "console", "mobile", "thermal throttling", "certification", "data-oriented", "lod"] },
        { id: "business", name: "Platforms, business models and live service",
          line: "Where games are sold, how they earn, and what running one for years involves.",
          body: [
            "Games reach players through a few storefronts: **Steam** on PC (a 30% revenue share, dropping to 25% and 20% at high sales), the PlayStation, Xbox and Nintendo stores, the Epic Games Store, and Apple's and Google's app stores on mobile. Models are **premium** (pay once), **free-to-play** (earn from in-game purchases and passes), and **subscription** catalogues such as Game Pass.",
            "**Live service** games are run like online products: seasons, battle passes, events, balance patches and analytics, served by backend teams for years. On Steam, visibility at launch follows how many people **wishlisted** the game, which is why indie marketing starts with a store page long before release."
          ],
          where: "Fortnite, Genshin Impact and Roblox are the large live services; most indie revenue comes from Steam; most mobile revenue from free-to-play.",
          nuance: "Live service is expensive to start and hard to win: players stay with a few games for years. Sony's Concord went offline two weeks after its 2024 launch, and many others have shut within a year.",
          read: [{ label: "Steamworks documentation: visibility on Steam", url: "https://partner.steamgames.com/doc/marketing/visibility", m: 20 }],
          tags: ["steam", "free-to-play", "premium", "live service", "battle pass", "wishlists", "game pass"] }
      ] }
  ]
});
