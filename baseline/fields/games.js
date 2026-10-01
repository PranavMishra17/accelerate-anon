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
            "Every game runs one loop: **process input, update the simulation, render**. At 60 frames a second each pass has 16.7 ms. A **variable time step** multiplies movement by the frame's elapsed time, which is simple but makes physics differ with frame rate. A **fixed time step** advances the simulation in equal slices (often 1/50 or 1/60 s) and runs as many as real time requires.",
            "The standard pattern is an **accumulator**: add each frame's real time to it, run fixed updates while it holds a whole step, and render interpolated by the leftover fraction. Even frame **pacing** matters as much as the average rate."
          ],
          uses: [
            "**Unity**: separates Update, once per rendered frame, from FixedUpdate, every 0.02 s by default.",
            "**Godot**: splits _process from _physics_process, which runs at 60 ticks a second by default.",
            "**Netcode and replay systems**: depend on a fixed, deterministic step so the same inputs always produce the same world."
          ],
          example: "Fixed step 1/60 s (16.7 ms). A slow frame takes 40 ms: the accumulator holds 40, so two updates run (33.3 ms) and 6.7 ms is left over. The renderer draws the world 6.7 / 16.7 = 0.4 of the way between the last two states. On a 144 Hz screen most frames run zero or one update and interpolate the rest.",
          nuance: "A game at a steady 30 fps feels better than one swinging between 40 and 60. Players feel uneven frame times as stutter even when the average looks fine.",
          read: [
            { label: "Robert Nystrom, Game Programming Patterns: Game Loop", url: "https://gameprogrammingpatterns.com/game-loop.html", m: 25 },
            { label: "Glenn Fiedler, Gaffer On Games: Fix your timestep!", url: "https://gafferongames.com/post/fix_your_timestep/", m: 15 }
          ],
          tags: ["game loop", "delta time", "fixed timestep", "accumulator", "interpolation", "frame pacing", "vsync"] },
        { id: "engines", name: "Engines: Unity, Unreal, Godot, or your own",
          line: "The runtime, editor and pipeline you build a game on, and when to write one.",
          body: [
            "An engine bundles a renderer, physics, audio, animation, input, a scene editor, an asset pipeline and builds for each platform. **Unreal** (C++ and Blueprints visual scripting) leads high-end 3D with Nanite geometry and Lumen lighting; Epic takes a 5% royalty above a revenue threshold. **Unity** (C#) dominates mobile and is common in indie studios. **Godot** (MIT licensed, GDScript and C#) grew fast after Unity's 2023 runtime fee announcement, which Unity later withdrew.",
            "Studios build their own engines when they need something the general ones do badly: id Tech, EA's Frostbite, Guerrilla's Decima, Capcom's RE Engine."
          ],
          uses: [
            "**Unreal**: runs Fortnite and many AAA titles, chosen for its renderer and full C++ source access.",
            "**Unity**: runs Genshin Impact, Hollow Knight and most mobile hits, chosen for C# and mature mobile builds.",
            "**Godot**: runs Brotato and Buckshot Roulette, chosen by small teams for its light editor and open licence.",
            "**Custom engines**: Factorio and Noita simulate worlds (thousands of machines, every pixel as material) that general engines handle badly."
          ],
          example: "Three teams, three answers. Two people making a 2D roguelike for Steam: Godot or Unity, since the editor is light and the scope small. Forty people making a photoreal shooter for consoles: Unreal, for Nanite, Lumen and the hiring pool. A falling-sand game where every pixel is simulated: a custom engine, as Noita built.",
          nuance: "Engine choice is mostly a decision about people, platforms and tools, not features: who you can hire, which consoles you must ship on, and how fast designers can iterate in the editor.",
          read: [{ label: "Godot docs: introduction, key concepts and design philosophy", url: "https://docs.godotengine.org/en/stable/getting_started/introduction/index.html", m: 30 }],
          tags: ["unity", "unreal", "godot", "engine", "custom engine", "blueprints"] },
        { id: "ecs", name: "Entity component systems",
          line: "Entities as plain ids, components as data in arrays, systems as loops over them.",
          body: [
            "Deep class hierarchies (a FlyingEnemy that is an Enemy that is an Actor) break down when designers want a flying chest. The **component** pattern composes an entity from parts instead. **ECS** separates data from behaviour completely: an **entity** is only an id, **components** are plain data in tightly packed arrays, and **systems** are functions that run over every entity holding a given set of components.",
            "Packed arrays make the CPU cache work for you, and systems touching different data can run in parallel. Implementations group entities by exact component set (**archetypes**, fast iteration) or keep a sparse set per component (fast adding and removing)."
          ],
          uses: [
            "**Unity's Entities package**: stores components in archetype chunks so tens of thousands of units can update each frame.",
            "**Bevy**: a Rust engine built on ECS throughout, which schedules systems in parallel from the data they read and write.",
            "**EnTT in Minecraft Bedrock**: a sparse-set ECS library for C++ used by Mojang.",
            "**Overwatch**: built its gameplay on an ECS, as its team described at GDC 2017."
          ],
          example: "A movement system: `for each entity with (Position, Velocity): pos += vel * dt`. With 10,000 entities, positions sit in one array and velocities in another, read in order, so the CPU prefetches them. In an object hierarchy each update chases a pointer to a separate heap object, and cache misses dominate the loop.",
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
            "Feel lives in small rules. **Input buffering** accepts a press a few frames before it becomes legal. **Coyote time** allows a jump a few frames after walking off a ledge. Fighting games read motion inputs ('quarter-circle forward') from a short history of directions."
          ],
          uses: [
            "**Unity's Input System, Unreal's Enhanced Input and Steam Input**: map devices to named actions so players can rebind any control.",
            "**Celeste**: the standard example of forgiving rules, with coyote time and buffered jumps.",
            "**Street Fighter**: reads special moves from a buffer of recent stick directions with timing windows wide enough to perform."
          ],
          example: "At 60 fps a player presses jump 3 frames (50 ms) before landing. Without buffering the press is ignored, because the character is still airborne, and the player feels the game ate their input. With a 6-frame buffer, the press is stored and the jump fires on the landing frame. Neither rule is visible; both decide whether controls feel tight.",
          nuance: "Input latency is the sum of the controller, the game's frame or two of processing, rendering and the display. Players cannot name it but feel it as heaviness, and it is decided by engine structure, not by input code.",
          read: [{ label: "Robert Nystrom, Game Programming Patterns: Command (configuring input)", url: "https://gameprogrammingpatterns.com/command.html", m: 20 }],
          tags: ["input", "action mapping", "dead zone", "input buffering", "coyote time", "latency"] },
        { id: "tools-pipelines", name: "Tools and asset pipelines",
          line: "How art, levels and data get from the people who make them into the running game.",
          body: [
            "Artists build in **DCC tools** (Blender, Maya, Houdini, Substance, ZBrush) and export to formats such as FBX, glTF or USD. The engine **imports** each asset and **cooks** it into a platform-specific form: compressed textures, meshes with levels of detail, baked lighting, packed audio. A full AAA cook can take hours on a farm of build machines.",
            "Tools programmers build the editors, importers and validators that make this fast, with hot reload so a change appears without restarting. Version control is usually **Perforce**, which handles terabytes of binaries and file locking; Git with LFS suits smaller teams."
          ],
          uses: [
            "**Unreal's cook step**: converts editor assets into per-platform packages before a build ships.",
            "**Pixar's USD**: the scene format shared across film tools, now moving into game pipelines.",
            "**Perforce at large studios**: stores art and levels with exclusive locks so two artists never edit one binary file at once."
          ],
          example: "An artist changes a rock's texture. Without hot reload: export, wait for the reimport, restart the level, walk back to the rock: four minutes. With hot reload the change shows in two seconds. Across 50 artists making 30 changes a day, that is the difference between 100 hours and 50 minutes of waiting.",
          nuance: "The number that decides a team's speed is iteration time: how long from changing something to seeing it in the game. Shaving it from minutes to seconds is worth more than most runtime optimisations.",
          tags: ["asset pipeline", "dcc", "fbx", "gltf", "usd", "perforce", "cooking", "build"] }
      ] },
    { name: "Simulation and life", line: "The systems that make a world move, react, think and sound.",
      topics: [
        { id: "physics", name: "Physics and collision",
          line: "Integrating motion each step, finding what touches, and pushing it apart.",
          body: [
            "A physics step does three things. It **integrates**: forces to velocities, velocities to positions, usually with semi-implicit Euler at a fixed rate. It **detects collisions**: a broad phase (grids, sweep and prune, bounding volume trees) finds pairs that might touch, and a narrow phase (separating axis test, GJK) computes exact contacts. Then it **resolves** them with an iterative solver that applies impulses.",
            "Fast, thin objects can pass through walls between steps (**tunnelling**), so engines add continuous collision detection. Player characters are usually **kinematic**, moved by gameplay code with collision checks, because force-driven movement feels floaty."
          ],
          uses: [
            "**Box2D**: the 2D engine behind Angry Birds and many indie games.",
            "**Jolt**: written for Horizon Forbidden West, now open source and built into Godot.",
            "**Chaos in Unreal 5 and PhysX in Unity**: provide rigid bodies, ragdolls and vehicles as part of the engine."
          ],
          example: "A bullet travels at 900 m/s and physics runs at 60 Hz, so it moves 15 m per step. A 20 cm wall sits between two of its positions and no overlap is ever detected: it tunnels through. Continuous detection sweeps the shape along its path between steps; many shooters skip the body entirely and cast a ray along the path instead.",
          nuance: "Physics is rarely bit-identical across machines, because floating-point results differ by compiler and CPU. Lockstep and rollback netcode need determinism, so those games often write their own simpler physics.",
          read: [{ label: "Erin Catto (Box2D), publications: GDC talks on sequential impulses, contacts and continuous collision", url: "https://box2d.org/publications/", m: 45 }],
          tags: ["physics", "collision", "broad phase", "gjk", "impulse", "solver", "tunnelling", "box2d", "jolt"] },
        { id: "animation", name: "Animation",
          line: "Skeletons, blends and state machines that turn movement state into a believable pose.",
          body: [
            "Characters are animated through a **skeleton**: a hierarchy of bones, with each mesh vertex weighted to a few bones (**skinning**, done on the GPU). A clip stores keyframed bone rotations, interpolated each frame. **Blending** mixes clips: a blend space picks between walk and run by speed, and layers let the upper body reload while the legs run.",
            "An **animation state machine** chooses clips and how transitions blend. **Inverse kinematics** adapts the pose to the world, feet planted on stairs. **Motion matching** searches a large motion-capture database each frame for the pose that best fits the desired movement."
          ],
          uses: [
            "**Unreal's Animation Blueprints and Unity's Animator**: graph-based state machines that blend clips from gameplay variables.",
            "**For Honor**: shipped motion matching in 2017; Unreal 5 now builds it in.",
            "**Third-person games**: run foot IK so characters stand on slopes and stairs instead of floating or sinking."
          ],
          example: "A character moving at 3 m/s, with a walk clip at 1.5 m/s and a run at 6 m/s: the blend space weights walk two thirds and run one third, and keeps their cycles in phase so the feet stay in step. On a staircase, foot IK lifts the left foot 18 cm to meet a step the clip never knew about.",
          nuance: "Realism and responsiveness pull against each other. Root motion (the animation moves the character) looks right but reacts late; code-driven movement responds at once but slides. Most games use code-driven movement and correct the animation to match.",
          read: [
            { label: "Robert Nystrom, Game Programming Patterns: State (FSMs, hierarchical, pushdown)", url: "https://gameprogrammingpatterns.com/state.html", m: 25 },
            { label: "Daniel Holden, Code vs data driven displacement", url: "https://theorangeduck.com/page/code-vs-data-driven-displacement", m: 20 }
          ],
          tags: ["skeletal animation", "skinning", "blend space", "state machine", "ik", "motion matching", "root motion"] },
        { id: "game-ai", name: "AI for games",
          line: "Pathfinding plus decision structures that make characters act readably, not optimally.",
          body: [
            "**Pathfinding** finds a route: A* searches a graph by cost so far plus an estimate to the goal, usually over a **navigation mesh** of walkable polygons. **Decision-making** picks what to do. Finite state machines are simple and tangle past a dozen states. **Behaviour trees**, popularised by Halo 2, compose behaviour from sequences, selectors and conditions. **Utility AI** scores every option on curves. **GOAP** plans a sequence of actions toward a goal.",
            "Shipped enemies are still mostly hand-authored, because designers need to control them."
          ],
          uses: [
            "**Recast and Detour**: generate and query navigation meshes inside most engines, Unreal included.",
            "**Unreal**: ships behaviour trees and StateTree as built-in decision tools.",
            "**The Sims**: picks each Sim's next action by scoring needs such as hunger, fun and social.",
            "**F.E.A.R.**: used GOAP so soldiers planned flanking and cover from a small set of actions."
          ],
          example: "A guard's behaviour tree: a selector tries, in order, 'if player visible, attack', 'if heard a noise, investigate', 'else patrol'. Each tick it runs the first branch whose condition holds. A thrown bottle sets the noise flag; the guard walks there on an A* path over the navmesh, finds nothing, and the tree falls back to patrol.",
          nuance: "The goal is a fun opponent, not a winning one. Good game AI telegraphs its intentions, makes believable mistakes and quietly cheats when that serves the player's experience.",
          read: [
            { label: "Amit Patel, Red Blob Games: Introduction to A*", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html", m: 30 },
            { label: "Chris Simpson, Behavior trees for AI: how they work", url: "https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work", m: 20 }
          ],
          tags: ["pathfinding", "a*", "navmesh", "behaviour tree", "utility ai", "goap", "fsm"] },
        { id: "game-audio", name: "Audio in games",
          line: "Sound authored as events, placed in 3D, and mixed live as the game changes.",
          body: [
            "Game audio is driven by **events**: code says 'footstep on gravel at this position', and an audio designer decides in a middleware tool what that sounds like, with random variations, pitch shifts and layers. **Spatialisation** places sounds in 3D with distance attenuation, panning and binaural filtering (HRTFs) for headphones; occlusion muffles sounds behind walls.",
            "**Adaptive music** follows game state, fading in layers as combat intensifies. A live **mix** handles priorities, voice limits and **ducking**, lowering music under dialogue."
          ],
          uses: [
            "**FMOD and Audiokinetic's Wwise**: the two middleware standards, where designers author events that the game only triggers.",
            "**Unreal's MetaSounds**: procedural audio graphs built into the engine.",
            "**Hades and DOOM (2016)**: well-known soundtracks that rise and fall with the fighting."
          ],
          example: "The code calls `play('footstep', position, surface = 'gravel')`. The middleware picks one of eight gravel samples, shifts its pitch a few percent so repeats do not sound mechanical, attenuates it by distance, and drops it if 40 louder sounds are already playing. When the designer later adds wet gravel, no code changes.",
          nuance: "Sound carries much of a game's feedback: a hit, a pickup or an enemy behind you is often heard before it is seen. Cutting audio polish makes mechanics feel unresponsive even when the code has not changed.",
          tags: ["game audio", "fmod", "wwise", "spatial audio", "hrtf", "adaptive music", "mixing"] }
      ] },
    { name: "Playing together", line: "Keeping several machines in one world when the network is slow and unreliable.",
      topics: [
        { id: "netcode", name: "Client-server netcode",
          line: "An authoritative server, clients that predict, and tricks that hide the delay between them.",
          body: [
            "In most online games the **server is authoritative**: clients send inputs, the server simulates at a fixed **tick rate** and sends snapshots back. Waiting a round trip to see your own move feels awful, so the client **predicts**, applying input at once, and **reconciles** when the server answers: rewind to the server's state and replay the inputs it has not yet processed.",
            "Other players are shown slightly in the past with **entity interpolation** between snapshots. **Lag compensation** lets the server rewind targets to where the shooter saw them. Traffic goes over UDP with the game's own reliability, because a late packet is worse than a lost one."
          ],
          uses: [
            "**Valorant**: runs 128-tick authoritative servers for competitive play.",
            "**Counter-Strike 2 and Overwatch**: rely on prediction and lag compensation so shots feel instant on a normal connection.",
            "**Unreal replication and Unity's Netcode for GameObjects**: package this model for teams that do not write their own."
          ],
          example: "Ping 100 ms. You press forward and your client moves you at once. About 50 ms later the server applies that input; its snapshot reaches you 100 ms after the press, confirming your position as of input 41. Your client has since applied inputs 42 to 47, so it resets to the server's state and replays those six. If they agree, nothing visibly changes.",
          nuance: "Lag compensation is a choice of who suffers: the shooter sees fair hits, so the target sometimes dies after reaching cover. Every competitive shooter tunes that trade-off rather than escaping it.",
          read: [
            { label: "Glenn Fiedler, What every programmer needs to know about game networking", url: "https://gafferongames.com/post/what_every_programmer_needs_to_know_about_game_networking/", m: 15 },
            { label: "Gabriel Gambetta, Lag compensation", url: "https://www.gabrielgambetta.com/lag-compensation.html", m: 15 }
          ],
          tags: ["netcode", "authoritative server", "prediction", "reconciliation", "interpolation", "lag compensation", "tick rate", "udp"] },
        { id: "rollback", name: "Lockstep and rollback",
          line: "Sending only inputs, simulating identically everywhere, and rewinding when a guess was wrong.",
          body: [
            "**Lockstep** sends only player inputs and has every machine run the same deterministic simulation, waiting for everyone's input each step. It carries huge worlds on little bandwidth, which is why real-time strategy games use it, but the game runs at the speed of the slowest connection.",
            "**Rollback** removes the wait. Each machine predicts the remote player's input (usually 'same as last frame'), runs ahead, and when the real input arrives and differs, restores a saved state and re-simulates the missed frames within one frame's time. Delay-based netcode, the older alternative, adds input lag instead."
          ],
          uses: [
            "**GGPO**: the library that popularised rollback, now MIT licensed.",
            "**Street Fighter 6 and Guilty Gear Strive**: ship rollback, which fighting game players now expect.",
            "**Age of Empires and StarCraft**: use lockstep, sending commands instead of the positions of hundreds of units."
          ],
          example: "Frame 100: the opponent's input has not arrived, so you predict 'still holding back' and simulate frames 101 to 103. Their real input arrives: they pressed punch on 101. You restore the frame-100 save, replay 101 to 103 with the punch, and draw frame 104 from the corrected state. On screen the punch appears two frames in, which few players notice.",
          nuance: "Rollback demands a fully deterministic simulation and a state you can save and restore many times per frame. Retrofitting either onto an engine not built for it is where most rollback projects stall.",
          read: [{ label: "GGPO: rollback networking, the overview", url: "https://www.ggpo.net/", m: 10 }],
          tags: ["rollback", "lockstep", "ggpo", "determinism", "fighting games", "delay-based"] }
      ] },
    { name: "Game design", line: "Deciding what the player does, feels and learns, and checking it with real players.",
      topics: [
        { id: "mda", name: "Mechanics, dynamics, aesthetics",
          line: "A lens that links the rules you write to the feelings players have.",
          body: [
            "The MDA framework splits a game into three layers. **Mechanics** are the rules and code: what actions exist, what numbers change. **Dynamics** are the behaviour that emerges when players use those mechanics over time: bluffing, rushing, camping. **Aesthetics** are the emotional responses the game aims for; the paper lists eight, including challenge, fellowship, discovery and fantasy.",
            "A designer works from mechanics toward aesthetics, but a player meets the aesthetics first. So name the feeling you want, ask which dynamics produce it, then which rules produce those dynamics, and test whether they do."
          ],
          uses: [
            "**Game design courses**: teach MDA as the first shared vocabulary between designers and programmers.",
            "**Journey**: lets online strangers communicate only by moving and chiming, a mechanic aimed at one aesthetic, fellowship.",
            "**Dark Souls**: harsh death penalties (mechanic) produce cautious, observant play (dynamic) and the feeling of hard-won challenge (aesthetic)."
          ],
          example: "Goal: dread. A dynamic that produces it: players hoarding scarce resources and fearing every encounter. Mechanics that produce that: little ammo, enemies that take several shots, saving only in certain rooms. That is roughly Resident Evil. If playtesters stockpile 200 rounds and stop feeling threatened, the drop rate is wrong, not the goal.",
          nuance: "Dynamics are the hard layer: you cannot write them directly, only rules that make them likely. That is why design changes must be judged in play, not on paper.",
          read: [{ label: "Hunicke, LeBlanc and Zubek, MDA (the whole paper)", url: "https://users.cs.northwestern.edu/~hunicke/MDA.pdf", m: 20 }],
          tags: ["mda", "mechanics", "dynamics", "aesthetics", "game design"] },
        { id: "core-loops", name: "Core loops and progression",
          line: "The action players repeat every minute, and the longer loops that give it meaning.",
          body: [
            "The **core loop** is what the player does moment to moment and keeps doing. Around it sit slower **meta loops** that change the core over hours: upgrades, unlocks, a base to build. Failure inside the core can still advance the meta, which keeps players coming back.",
            "Daniel Cook separates **loops**, which players repeat and master by building a better mental model each time, from **arcs**, which deliver content once (a cutscene, a scripted level). Most games mix both; the balance sets how replayable a game is."
          ],
          uses: [
            "**Hades**: each run is the core loop, and dying returns you to a hub where permanent upgrades and story move forward.",
            "**Stardew Valley**: plant, tend, harvest and sell is the daily loop; expanding the farm over seasons is the meta loop.",
            "**Fortnite**: adds daily challenges and seasonal battle passes as loops on top of the match."
          ],
          example: "A roguelike run: enter a room, fight for 30 seconds, take one of three rewards, pick a door. That repeats about 30 times a run (core loop). Dying banks currency for permanent upgrades (meta loop). Test: remove the currency for one session. If players still want one more run, the core holds; if they stop, the rewards were carrying it.",
          nuance: "A loop that is only rewarding because of its rewards (numbers going up, timers, streaks) becomes a compulsion loop. The test is whether the core action is enjoyable with the rewards removed.",
          read: [{ label: "Daniel Cook, Lost Garden: Loops and arcs", url: "https://lostgarden.com/2012/04/30/loops-and-arcs/", m: 20 }],
          tags: ["core loop", "meta loop", "progression", "loops and arcs", "roguelike", "retention"] },
        { id: "level-design", name: "Level design",
          line: "Building the spaces where mechanics happen, and guiding players through them without signs.",
          body: [
            "A level designer turns mechanics into situations. Work starts as a **blockout**: the level built from plain boxes and ramps, sized by the game's **metrics** (jump height, character size, weapon ranges), and playable from day one. Art comes only after it plays well.",
            "Players are guided without words: **landmarks** visible from afar, light and colour drawing the eye, sightlines that preview the next area, and **gating** that opens routes once an ability is learned. **Pacing** alternates tension and rest, and good levels teach a mechanic safely before testing it under pressure."
          ],
          uses: [
            "**Super Mario stages**: introduce a mechanic safely, develop it, twist it, then conclude, often in four beats.",
            "**Half-Life 2**: guides players with light, landmarks and sightlines rather than waypoint markers.",
            "**Dark Souls**: loops its areas back to earlier ones through shortcuts that open from the far side."
          ],
          example: "Metrics first: the character jumps 4 m at most. A 3.5 m gap is comfortable, 3.9 m is tense, 4.2 m is impossible. The blockout puts the first 3 m gap over a safe floor to teach the jump, then a 3.8 m gap over a pit. If testers fall at the second gap twice, it shrinks before any art is placed.",
          nuance: "Art applied too early makes a bad layout expensive to change, so teams keep living with it. Blockouts stay ugly on purpose.",
          read: [{ label: "The Level Design Book: Blockout", url: "https://book.leveldesignbook.com/process/blockout", m: 25 }],
          tags: ["level design", "blockout", "greybox", "metrics", "pacing", "landmarks", "gating"] },
        { id: "playtesting", name: "Playtesting and iteration",
          line: "Watching real players to find where the design does not do what you intended.",
          body: [
            "A playtest puts the game in front of people who did not make it and **watches** them: where they get lost, what they ignore, where they die, what they try that the game does not allow. Think-aloud sessions capture confusion as it happens; short questionnaires afterwards capture what they felt. Telemetry (where players quit, how long each level takes) shows the same at scale.",
            "Iteration is the method: prototype the core cheaply, test, change one thing, test again. Early tests ask whether it is fun at all; later ones tune difficulty, onboarding and clarity."
          ],
          uses: [
            "**Supercell**: tests games in soft launch and cancels most of them before a global release.",
            "**Steam Playtest**: lets developers run open or invite-only tests from the game's store page.",
            "**Halo 3**: Microsoft's user research team mapped where testers died on each level and adjusted layouts from the patterns."
          ],
          example: "Five testers play the first level. Four miss the ledge you can climb, because it looks like scenery, and suggest a tutorial popup. The symptom is real; the fix is yours: give every climbable ledge the same worn paint stripe, then retest with five new people. Three of five climb it unprompted, with no popup.",
          nuance: "Players are reliable about where a problem is and unreliable about how to fix it. Treat their suggestions as symptoms, and never explain the game to a tester mid-session: the real player will not have you there.",
          read: [{ label: "The Level Design Book: Blockout, the section on playtesting a blockout", url: "https://book.leveldesignbook.com/process/blockout", m: 10 }],
          tags: ["playtesting", "iteration", "prototype", "telemetry", "user research", "find the fun"] }
      ] },
    { name: "Shipping it", line: "Running on real hardware, and getting a game in front of players who pay.",
      topics: [
        { id: "performance", name: "Performance on consoles and mobile",
          line: "Fixed hardware, fixed frame budgets, and memory, heat and battery as hard limits.",
          body: [
            "A console game must hold its frame rate on fixed hardware (PlayStation 5, Xbox Series X and S, Switch 2), so teams budget every millisecond and megabyte per system. Platform holders run **certification** checks (crashes, save handling, suspend and resume) before release.",
            "Phones add **thermal throttling**: a game at 60 fps for five minutes may drop to 40 once the chip heats, and battery drain decides reviews. Common work: fewer draw calls, levels of detail for far objects, streaming assets instead of loading them all, and **data-oriented** layouts that keep hot data contiguous in memory."
          ],
          uses: [
            "**Xbox Series S**: makes every Xbox game also fit a smaller GPU and 10 GB of memory.",
            "**Unreal Insights, the Unity Profiler and PIX**: the daily tools for finding which system overran its budget.",
            "**Sony, Microsoft and Nintendo certification**: rejects builds that crash, lose saves or mishandle suspend and resume."
          ],
          example: "A 60 fps console game's CPU budget per frame (16.7 ms): gameplay 4, animation 3, physics 3, AI 2, audio 1, streaming and the rest 2, leaving 1.7 spare. A crowd scene pushes animation to 6 ms. Rather than slow the whole game, the team updates distant characters' animation every other frame.",
          nuance: "Mobile games are judged by sustained performance on mid-range hardware, not peak speed on a flagship. Test on a two-year-old phone after ten minutes of play.",
          read: [{ label: "Richard Fabian, Data-Oriented Design (free online edition): the introduction and data layout chapters", url: "https://www.dataorienteddesign.com/dodbook/", m: 45 }],
          tags: ["performance", "frame budget", "console", "mobile", "thermal throttling", "certification", "data-oriented", "lod"] },
        { id: "business", name: "Platforms, business models and live service",
          line: "Where games are sold, how they earn, and what running one for years involves.",
          body: [
            "Games reach players through a few storefronts: **Steam** on PC (a 30% revenue share, dropping to 25% and 20% at high sales), the PlayStation, Xbox and Nintendo stores, the Epic Games Store, and Apple's and Google's app stores. Models are **premium** (pay once), **free-to-play** (in-game purchases and passes) and **subscription** catalogues such as Game Pass.",
            "**Live service** games are run like online products for years: seasons, battle passes, events, balance patches and analytics. On Steam, launch visibility follows **wishlists**, so indie marketing starts with a store page long before release."
          ],
          uses: [
            "**Fortnite, Genshin Impact and Roblox**: the large live services, free to play and funded by cosmetics, gacha pulls and creator economies.",
            "**Steam**: where most indie revenue comes from, with wishlists deciding how visible a launch is.",
            "**Game Pass**: pays studios to put games in a subscription catalogue instead of selling copies one by one."
          ],
          example: "An indie game priced at $20 sells 20,000 copies on Steam in its first year: $400,000 gross. Regional pricing, discounts and refunds bring that nearer $300,000. Steam's 30% leaves about $210,000, before tax and any publisher share, for a team that may have spent two years building it.",
          nuance: "Live service is expensive to start and hard to win: players stay with a few games for years. Sony's Concord went offline two weeks after its 2024 launch, and many others have shut within a year.",
          read: [{ label: "Steamworks documentation: visibility on Steam", url: "https://partner.steamgames.com/doc/marketing/visibility", m: 20 }],
          tags: ["steam", "free-to-play", "premium", "live service", "battle pass", "wishlists", "game pass"] }
      ] }
  ]
});
