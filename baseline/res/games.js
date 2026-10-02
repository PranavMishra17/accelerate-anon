/* What to read and watch for each topic in the games field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("games", {
 "game-loop": [
  {
   "kind": "video",
   "req": true,
   "label": "Getting the game loop right",
   "url": "https://www.youtube.com/watch?v=lW6ZtvQVzyg",
   "m": 9,
   "why": "Fixed versus variable timestep and why they differ.",
   "yt": {
    "id": "lW6ZtvQVzyg",
    "ch": "Vittorio Romeo"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Glenn Fiedler, Gaffer On Games: Fix your timestep!",
   "url": "https://gafferongames.com/post/fix_your_timestep/",
   "m": 15,
   "why": "The standard answer to frame-rate independent updates."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Robert Nystrom, Game Programming Patterns: Game Loop",
   "url": "https://gameprogrammingpatterns.com/game-loop.html",
   "m": 25,
   "why": "The loop variants side by side."
  }
 ],
 "engines": [
  {
   "kind": "video",
   "req": true,
   "label": "Choosing a game engine is easy, actually",
   "url": "https://www.youtube.com/watch?v=aMgB018o71U",
   "m": 16,
   "why": "What actually separates the engines when you pick one.",
   "yt": {
    "id": "aMgB018o71U",
    "ch": "samyam"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Godot docs: introduction, key concepts and design philosophy",
   "url": "https://docs.godotengine.org/en/stable/getting_started/introduction/index.html",
   "m": 30,
   "why": "What one engine bundles and how it is organised."
  }
 ],
 "ecs": [
  {
   "kind": "video",
   "req": true,
   "label": "Entity component system overview in 7 minutes",
   "url": "https://www.youtube.com/watch?v=2rW7ALyHaas",
   "m": 8,
   "why": "Entities, components and systems with a small example.",
   "yt": {
    "id": "2rW7ALyHaas",
    "ch": "Board To Bits Games"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Is there more to game architecture than ECS?",
   "url": "https://www.youtube.com/watch?v=JxI3Eu5DPwE",
   "m": 24,
   "why": "Bob Nystrom on where ECS fits and where it does not.",
   "yt": {
    "id": "JxI3Eu5DPwE",
    "ch": "Roguelike Celebration"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Robert Nystrom, Game Programming Patterns: Component",
   "url": "https://gameprogrammingpatterns.com/component.html",
   "m": 20,
   "why": "Why components beat deep class hierarchies."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Sander Mertens, ECS FAQ: what is ECS, archetypes and sparse sets",
   "url": "https://github.com/SanderMertens/ecs-faq",
   "m": 25,
   "why": "How real ECS libraries store data."
  }
 ],
 "input": [
  {
   "kind": "video",
   "req": true,
   "label": "How to use coyote time and input buffering in Unity",
   "url": "https://www.youtube.com/watch?v=XGxkFe0KcnU",
   "m": 7,
   "why": "The two small rules that make jumps feel fair.",
   "yt": {
    "id": "XGxkFe0KcnU",
    "ch": "Damm Labs"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Robert Nystrom, Game Programming Patterns: Command (configuring input)",
   "url": "https://gameprogrammingpatterns.com/command.html",
   "m": 20,
   "why": "Mapping devices to actions so keys can be rebound."
  }
 ],
 "tools-pipelines": [
  {
   "kind": "video",
   "req": true,
   "label": "Complete game art pipeline",
   "url": "https://www.youtube.com/watch?v=8rOuRgDTjNY",
   "m": 9,
   "why": "From sculpt and model to textured asset in an engine.",
   "yt": {
    "id": "8rOuRgDTjNY",
    "ch": "Chrismartinartist"
   }
  }
 ],
 "physics": [
  {
   "kind": "video",
   "req": true,
   "label": "Collision detection (an overview)",
   "url": "https://www.youtube.com/watch?v=oOEnWQZIePs",
   "m": 8,
   "why": "Broad phase, narrow phase and common shapes.",
   "yt": {
    "id": "oOEnWQZIePs",
    "ch": "MacroPixel"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Improving an iterative physics solver using a direct method",
   "url": "https://www.youtube.com/watch?v=P-WP1yMOkc4",
   "m": 38,
   "why": "Erin Catto on solver stability; watch the first 15 minutes.",
   "yt": {
    "id": "P-WP1yMOkc4",
    "ch": "GDC Festival of Gaming"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Erin Catto (Box2D), publications: GDC talks on sequential impulses, contacts and continuous collision",
   "url": "https://box2d.org/publications/",
   "m": 45,
   "why": "The primary source for the solver Box2D uses."
  }
 ],
 "animation": [
  {
   "kind": "video",
   "req": true,
   "label": "How skeletal animations and skinning work in games",
   "url": "https://www.youtube.com/watch?v=sgM1FpPd-Eo",
   "m": 11,
   "why": "Bones, weights and how a pose moves the mesh.",
   "yt": {
    "id": "sgM1FpPd-Eo",
    "ch": "Dzima"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Robert Nystrom, Game Programming Patterns: State (FSMs, hierarchical, pushdown)",
   "url": "https://gameprogrammingpatterns.com/state.html",
   "m": 25,
   "why": "State machines, the shape behind animation graphs."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Daniel Holden, Code vs data driven displacement",
   "url": "https://theorangeduck.com/page/code-vs-data-driven-displacement",
   "m": 20,
   "why": "Authored clips against procedural motion."
  }
 ],
 "game-ai": [
  {
   "kind": "video",
   "req": true,
   "label": "A* pathfinding: algorithm explanation",
   "url": "https://www.youtube.com/watch?v=-L-WgKMFuhE",
   "m": 12,
   "why": "Open and closed sets and the f = g + h cost, drawn on a grid.",
   "yt": {
    "id": "-L-WgKMFuhE",
    "ch": "Sebastian Lague"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "Behaviour trees: the cornerstone of modern game AI",
   "url": "https://www.youtube.com/watch?v=6VBCXvfNlCM",
   "m": 10,
   "why": "Selectors, sequences and how a tree picks an action.",
   "yt": {
    "id": "6VBCXvfNlCM",
    "ch": "AI and Games"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Amit Patel, Red Blob Games: Introduction to A*",
   "url": "https://www.redblobgames.com/pathfinding/a-star/introduction.html",
   "m": 30,
   "why": "Interactive A* with the heuristic you can change."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Chris Simpson, Behavior trees for AI: how they work",
   "url": "https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work",
   "m": 20,
   "why": "The node types in text."
  }
 ],
 "game-audio": [
  {
   "kind": "video",
   "req": true,
   "label": "Adaptive soundtracks in games",
   "url": "https://www.youtube.com/watch?v=b0gvM4q2hdI",
   "m": 10,
   "why": "Layers and transitions that follow what the player does.",
   "yt": {
    "id": "b0gvM4q2hdI",
    "ch": "Game Maker's Toolkit"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Wwise basics explained: a beginner's guide to game audio",
   "url": "https://www.youtube.com/watch?v=g_kPWMSNxIQ",
   "m": 11,
   "why": "Events, buses and mixing in middleware.",
   "yt": {
    "id": "g_kPWMSNxIQ",
    "ch": "Care Does Music"
   }
  }
 ],
 "netcode": [
  {
   "kind": "video",
   "req": true,
   "label": "Lag, and how game devs try to fix it",
   "url": "https://www.youtube.com/watch?v=-ZMZGslaBjg",
   "m": 12,
   "why": "Prediction, interpolation and lag compensation in plain terms.",
   "yt": {
    "id": "-ZMZGslaBjg",
    "ch": "Htwo"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Gabriel Gambetta, Lag compensation",
   "url": "https://www.gabrielgambetta.com/lag-compensation.html",
   "m": 15,
   "why": "How the server rewinds time to judge a shot."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Glenn Fiedler, What every programmer needs to know about game networking",
   "url": "https://gafferongames.com/post/what_every_programmer_needs_to_know_about_game_networking/",
   "m": 15,
   "why": "Why games chose UDP and how state is sent."
  }
 ],
 "rollback": [
  {
   "kind": "video",
   "req": true,
   "label": "Understanding rollback netcode in fighting games",
   "url": "https://www.youtube.com/watch?v=_-k5iiccjQA",
   "m": 8,
   "why": "Predict, rewind and resimulate, shown with examples.",
   "yt": {
    "id": "_-k5iiccjQA",
    "ch": "Kilfane"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Analysis: why rollback netcode is better",
   "url": "https://www.youtube.com/watch?v=0NLe4IpdS1w",
   "m": 9,
   "why": "Input delay against rollback, side by side.",
   "yt": {
    "id": "0NLe4IpdS1w",
    "ch": "Core-A Gaming"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "GGPO: rollback networking, the overview",
   "url": "https://www.ggpo.net/",
   "m": 10,
   "why": "The original library's idea in its own words."
  }
 ],
 "mda": [
  {
   "kind": "video",
   "req": true,
   "label": "Explaining the MDA design framework",
   "url": "https://www.youtube.com/watch?v=NxiGduvDJ8s",
   "m": 10,
   "why": "Mechanics, dynamics and aesthetics with game examples.",
   "yt": {
    "id": "NxiGduvDJ8s",
    "ch": "The Last Bacon"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Hunicke, LeBlanc and Zubek, MDA (the whole paper)",
   "url": "https://users.cs.northwestern.edu/~hunicke/MDA.pdf",
   "m": 20,
   "why": "The framework in its authors' words."
  }
 ],
 "core-loops": [
  {
   "kind": "video",
   "req": true,
   "label": "Core game loops",
   "url": "https://www.youtube.com/watch?v=aDE69s3pp7M",
   "m": 14,
   "why": "Timothy Cain on the loop that carries a whole game.",
   "yt": {
    "id": "aDE69s3pp7M",
    "ch": "Timothy Cain"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Daniel Cook, Lost Garden: Loops and arcs",
   "url": "https://lostgarden.com/2012/04/30/loops-and-arcs/",
   "m": 20,
   "why": "How short loops chain into longer arcs."
  }
 ],
 "level-design": [
  {
   "kind": "video",
   "req": true,
   "label": "Super Mario 3D World's 4 step level design",
   "url": "https://www.youtube.com/watch?v=dBmIkEvEBtA",
   "m": 6,
   "why": "Introduce, develop, twist and conclude an idea in a level.",
   "yt": {
    "id": "dBmIkEvEBtA",
    "ch": "Game Maker's Toolkit"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "5 tips for great level design",
   "url": "https://www.youtube.com/watch?v=LBtucVc8l0M",
   "m": 13,
   "why": "Practical guidance on leading the player.",
   "yt": {
    "id": "LBtucVc8l0M",
    "ch": "Apox Fox"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "The Level Design Book: Blockout",
   "url": "https://book.leveldesignbook.com/process/blockout",
   "m": 25,
   "why": "How to block out a space before art."
  }
 ],
 "playtesting": [
  {
   "kind": "video",
   "req": true,
   "label": "Playtesting: how to get good feedback on your game",
   "url": "https://www.youtube.com/watch?v=on7endO4lPY",
   "m": 7,
   "why": "What to watch and what to ask, from Extra Credits.",
   "yt": {
    "id": "on7endO4lPY",
    "ch": "Extra Credits"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "The ultimate playtest guide",
   "url": "https://www.youtube.com/watch?v=zXNRJuc48Ek",
   "m": 40,
   "why": "A full process; watch the planning and observing parts.",
   "yt": {
    "id": "zXNRJuc48Ek",
    "ch": "Indie Game Clinic"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "The Level Design Book: Blockout, the section on playtesting a blockout",
   "url": "https://book.leveldesignbook.com/process/blockout",
   "m": 10,
   "why": "Testing a space while it is still grey boxes."
  }
 ],
 "performance": [
  {
   "kind": "video",
   "req": true,
   "label": "Data-oriented design: the future of game development",
   "url": "https://www.youtube.com/watch?v=wG2Y42qArHY",
   "m": 6,
   "why": "Why layout in memory sets the frame time.",
   "yt": {
    "id": "wG2Y42qArHY",
    "ch": "VisualDecomplicator"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Deep dive guide to Unity optimisation, part 1: CPU bottlenecks",
   "url": "https://www.youtube.com/watch?v=kTz50ORsoyU",
   "m": 14,
   "why": "Finding what the CPU spends the frame on.",
   "yt": {
    "id": "kTz50ORsoyU",
    "ch": "SiriusGaming"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Richard Fabian, Data-Oriented Design (free online edition): the introduction and data layout chapters",
   "url": "https://www.dataorienteddesign.com/dodbook/",
   "m": 45,
   "why": "The long argument for data layout."
  }
 ],
 "business": [
  {
   "kind": "read",
   "req": true,
   "label": "Steamworks documentation: visibility on Steam",
   "url": "https://partner.steamgames.com/doc/marketing/visibility",
   "m": 20,
   "why": "How store visibility works and what you control."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What it's like to release a game on Steam",
   "url": "https://www.youtube.com/watch?v=5ycSvC0ZM0k",
   "m": 40,
   "why": "A real launch told step by step; watch the launch and results parts.",
   "yt": {
    "id": "5ycSvC0ZM0k",
    "ch": "Game Maker's Toolkit"
   }
  }
 ]
});
