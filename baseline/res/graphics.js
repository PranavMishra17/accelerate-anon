/* What to read and watch for each topic in the graphics field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("graphics", {
 "rendering-pipeline": [
  {
   "kind": "video",
   "req": true,
   "label": "How do video game graphics work?",
   "url": "https://www.youtube.com/watch?v=C8YtdC8mxTU",
   "m": 21,
   "why": "Vertices to pixels, drawn stage by stage.",
   "yt": {
    "id": "C8YtdC8mxTU",
    "ch": "Branch Education"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Scratchapixel: the rasterization stage (edge functions, barycentric coordinates)",
   "url": "https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-stage.html",
   "m": 30,
   "why": "How a triangle becomes covered pixels."
  }
 ],
 "gpu": [
  {
   "kind": "video",
   "req": true,
   "label": "GPU warps explained: how SIMT really works",
   "url": "https://www.youtube.com/watch?v=GveaLmXPJEY",
   "m": 11,
   "why": "Why threads run in lockstep groups and what divergence costs.",
   "yt": {
    "id": "GveaLmXPJEY",
    "ch": "Parallel Routines"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Horace He, Making deep learning go brrrr from first principles (compute, bandwidth, overhead)",
   "url": "https://horace.io/brrr_intro.html",
   "m": 20,
   "why": "Compute, bandwidth and overhead as the three limits."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How do graphics cards work? Exploring GPU architecture",
   "url": "https://www.youtube.com/watch?v=h9Z4oGN89MU",
   "m": 29,
   "why": "A tour of the hardware; watch the cores and memory parts.",
   "yt": {
    "id": "h9Z4oGN89MU",
    "ch": "Branch Education"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Modal, GPU glossary: device hardware and the performance section",
   "url": "https://modal.com/gpu-glossary",
   "m": 30,
   "why": "Short definitions of every GPU term."
  }
 ],
 "shaders": [
  {
   "kind": "video",
   "req": true,
   "label": "Understanding shaders is easy, actually",
   "url": "https://www.youtube.com/watch?v=xnZfMRTmfJY",
   "m": 7,
   "why": "What vertex and fragment programs each do.",
   "yt": {
    "id": "xnZfMRTmfJY",
    "ch": "tEEvy"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Gonzalez Vivo and Lowe, The Book of Shaders: chapters 1 to 5",
   "url": "https://thebookofshaders.com/",
   "m": 45,
   "why": "Write shaders in the page and see them run."
  }
 ],
 "graphics-apis": [
  {
   "kind": "video",
   "req": true,
   "label": "Every graphics API explained in 8 minutes",
   "url": "https://www.youtube.com/watch?v=geY7rsLYdl0",
   "m": 8,
   "why": "OpenGL, Vulkan, Direct3D, Metal and WebGPU compared.",
   "yt": {
    "id": "geY7rsLYdl0",
    "ch": "Techlogicguy"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "WebGPU fundamentals: the fundamentals lesson",
   "url": "https://webgpufundamentals.org/",
   "m": 30,
   "why": "The modern web API from the first triangle."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Vulkan tutorial: overview and drawing a triangle",
   "url": "https://vulkan-tutorial.com/",
   "m": 60,
   "why": "Why explicit APIs take so much setup."
  }
 ],
 "transforms": [
  {
   "kind": "video",
   "req": true,
   "label": "The math behind (most) 3D games: perspective projection",
   "url": "https://www.youtube.com/watch?v=U0_ONQQ5ZNM",
   "m": 14,
   "why": "How a camera turns 3D points into screen positions.",
   "yt": {
    "id": "U0_ONQQ5ZNM",
    "ch": "Brendan Galea"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "LearnOpenGL: Coordinate Systems",
   "url": "https://learnopengl.com/Getting-started/Coordinate-Systems",
   "m": 30,
   "why": "Local, world, view, clip and screen spaces in order."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Three-dimensional linear transformations",
   "url": "https://www.youtube.com/watch?v=rHLEWRxRGiM",
   "m": 5,
   "why": "3Blue1Brown on matrices as moves of space.",
   "yt": {
    "id": "rHLEWRxRGiM",
    "ch": "3Blue1Brown"
   }
  }
 ],
 "lighting-pbr": [
  {
   "kind": "video",
   "req": true,
   "label": "Computer graphics tutorial: PBR (physically based rendering)",
   "url": "https://www.youtube.com/watch?v=RRE-F57fbXw",
   "m": 14,
   "why": "Diffuse, specular, roughness and metalness in a shader.",
   "yt": {
    "id": "RRE-F57fbXw",
    "ch": "Victor Gordan"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "LearnOpenGL: PBR theory",
   "url": "https://learnopengl.com/PBR/Theory",
   "m": 35,
   "why": "The reflectance equation and its BRDF terms."
  }
 ],
 "textures": [
  {
   "kind": "video",
   "req": true,
   "label": "The math of computer graphics: textures and samplers",
   "url": "https://www.youtube.com/watch?v=DuQDx0ZIxa8",
   "m": 17,
   "why": "UV coordinates, filtering and wrap modes.",
   "yt": {
    "id": "DuQDx0ZIxa8",
    "ch": "FloatyMonkey"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "LearnOpenGL: Textures (wrapping, filtering, mipmaps)",
   "url": "https://learnopengl.com/Getting-started/Textures",
   "m": 30,
   "why": "The same ideas with code you can run."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What are mipmaps? Texture filtering in GLSL",
   "url": "https://www.youtube.com/watch?v=qMCOX3m-R28",
   "m": 22,
   "why": "Why distant textures shimmer without them.",
   "yt": {
    "id": "qMCOX3m-R28",
    "ch": "GSN Composer"
   }
  }
 ],
 "ray-tracing": [
  {
   "kind": "video",
   "req": true,
   "label": "How path tracing makes computer graphics look awesome",
   "url": "https://www.youtube.com/watch?v=3OKj0SQ_UTw",
   "m": 22,
   "why": "Rays, bounces and noise, explained by a researcher.",
   "yt": {
    "id": "3OKj0SQ_UTw",
    "ch": "Computerphile"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Disney's practical guide to path tracing",
   "url": "https://www.youtube.com/watch?v=frLwRLS_ZR0",
   "m": 10,
   "why": "How a film renderer samples light.",
   "yt": {
    "id": "frLwRLS_ZR0",
    "ch": "Walt Disney Animation Studios"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ray Tracing in One Weekend: chapters 1 to 9",
   "url": "https://raytracing.github.io/books/RayTracingInOneWeekend.html",
   "m": 120,
   "why": "Build a small ray tracer; read the first chapters."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Pharr, Jakob and Humphreys, Physically Based Rendering 4e: ch. 13 Light Transport I (path tracing)",
   "url": "https://pbr-book.org/4ed/contents",
   "m": 60,
   "why": "The full theory of path tracing."
  }
 ],
 "shadows": [
  {
   "kind": "video",
   "req": true,
   "label": "How shadows work in games",
   "url": "https://www.youtube.com/watch?v=TXI8rWiOF0k",
   "m": 7,
   "why": "Shadow maps, acne and softness in one pass.",
   "yt": {
    "id": "TXI8rWiOF0k",
    "ch": "Dzima"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "LearnOpenGL: Shadow mapping (acne, bias, peter-panning, PCF)",
   "url": "https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping",
   "m": 30,
   "why": "Depth from the light, then a per-pixel test."
  }
 ],
 "deferred-rendering": [
  {
   "kind": "video",
   "req": true,
   "label": "The graphics pipeline and rendering types",
   "url": "https://www.youtube.com/watch?v=27Am6QaH_Hc",
   "m": 18,
   "why": "Forward and deferred rendering and their costs.",
   "yt": {
    "id": "27Am6QaH_Hc",
    "ch": "Ben Cloward"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Forward and deferred rendering (Cambridge Computer Science talks)",
   "url": "https://www.youtube.com/watch?v=n5OiqJP2f7w",
   "m": 28,
   "why": "A talk that compares G-buffers with forward passes.",
   "yt": {
    "id": "n5OiqJP2f7w",
    "ch": "Ben Andrew"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "LearnOpenGL: Deferred shading",
   "url": "https://learnopengl.com/Advanced-Lighting/Deferred-Shading",
   "m": 30,
   "why": "A G-buffer and a lighting pass, built."
  }
 ],
 "anti-aliasing": [
  {
   "kind": "video",
   "req": true,
   "label": "What the heck are MSAA, FXAA, SMAA and TXAA?",
   "url": "https://www.youtube.com/watch?v=T9OBDscbHwY",
   "m": 5,
   "why": "How each method trades edge quality for cost.",
   "yt": {
    "id": "T9OBDscbHwY",
    "ch": "Greg Salazar"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Tech focus: TAA, blessing or curse? Temporal anti-aliasing deep dive",
   "url": "https://www.youtube.com/watch?v=WG8w9Yg5B3g",
   "m": 29,
   "why": "Digital Foundry on temporal methods and their blur.",
   "yt": {
    "id": "WG8w9Yg5B3g",
    "ch": "Digital Foundry"
   }
  }
 ],
 "post-processing": [
  {
   "kind": "video",
   "req": true,
   "label": "OpenGL: gamma correction, HDR tone mapping, bloom",
   "url": "https://www.youtube.com/watch?v=iikdcAA7cww",
   "m": 16,
   "why": "HDR buffers, tone mapping and a bloom pass.",
   "yt": {
    "id": "iikdcAA7cww",
    "ch": "Brian Will"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "LearnOpenGL: Bloom",
   "url": "https://learnopengl.com/Advanced-Lighting/Bloom",
   "m": 25,
   "why": "Threshold, blur and add, step by step."
  }
 ],
 "performance": [
  {
   "kind": "read",
   "req": true,
   "label": "RenderDoc: the home page and getting started",
   "url": "https://renderdoc.org/",
   "m": 15,
   "why": "The frame debugger used to see every draw call."
  },
  {
   "kind": "video",
   "req": false,
   "label": "RenderDoc: the GPU profiler Unity should have built",
   "url": "https://www.youtube.com/watch?v=asUybHWUv2k",
   "m": 17,
   "why": "Reading a frame capture to find what is slow.",
   "yt": {
    "id": "asUybHWUv2k",
    "ch": "The Gamedev Guru | Unity Performance Expertise"
   }
  }
 ],
 "canvas-2d": [
  {
   "kind": "video",
   "req": true,
   "label": "Comparing SVG, Canvas, and WebGL",
   "url": "https://www.youtube.com/watch?v=h6iliGRC0Ec",
   "m": 3,
   "yt": {
    "id": "h6iliGRC0Ec",
    "ch": "yWorks"
   },
   "why": "Retained versus immediate mode and when each starts to slow down."
  },
  {
   "kind": "read",
   "req": true,
   "label": "MDN: Canvas API tutorial (basic usage through transformations)",
   "url": "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial",
   "m": 45,
   "why": "Paths, fills, text and transforms on the 2D context."
  }
 ],
 "neural-rendering": [
  {
   "kind": "video",
   "req": true,
   "label": "3D Gaussian splatting",
   "url": "https://www.youtube.com/watch?v=VkIJbpdTujE",
   "m": 18,
   "why": "Computerphile on how splats are placed, sorted and drawn.",
   "yt": {
    "id": "VkIJbpdTujE",
    "ch": "Computerphile"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "NeRF: neural radiance fields",
   "url": "https://www.youtube.com/watch?v=JuH79E8rdKc",
   "m": 5,
   "why": "The authors' own video of the original method.",
   "yt": {
    "id": "JuH79E8rdKc",
    "ch": "Matthew Tancik"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kerbl et al., 3D Gaussian splatting for real-time radiance field rendering: abstract and section 1",
   "url": "https://arxiv.org/abs/2308.04079",
   "m": 15,
   "why": "The claim and the pipeline from the paper."
  }
 ]
});
