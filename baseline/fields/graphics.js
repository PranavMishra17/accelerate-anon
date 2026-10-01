BASELINE.field({
  id: "graphics", name: "Graphics", short: "Graphics", layer: "Worlds",
  ink: "#8C6A1E", inkDark: "#E2C27A",
  lede: "How a computer turns a description of a scene (triangles, materials, lights, a camera) into the pixels of an image, sixty or more times a second, on the GPU.",
  overview: [
    "Graphics programming is the work of getting a scene onto a screen: the rendering pipeline, the shaders that run in it, the maths of cameras and transforms, and the physics of light that makes surfaces look real. Job titles are graphics programmer, rendering engineer, engine programmer, technical artist (the bridge between art and shaders), and GPU driver or tools engineer at NVIDIA, AMD, Apple, Qualcomm and Arm.",
    "It is the field that made the GPU, and the GPU then became the engine of machine learning: the same parallel hardware that shades two million pixels a frame now multiplies matrices for LLMs. So graphics sits beside game development (engines are mostly renderers), inference (CUDA and compute shaders), and the web (Canvas, WebGL, WebGPU). In 2026 real-time rendering is moving from pure rasterisation toward hybrid ray tracing, AI upscaling and neural scene representations such as Gaussian splats.",
    "Read the pipeline cluster first: it is the frame in order. The rest are the techniques that go into each stage, and what it costs to run them in 16 milliseconds."
  ],
  diagram: {
    nodes: [
      { id: "graphics-apis", label: "Graphics API", sub: "Vulkan, D3D12, Metal", col: 0, row: 0 },
      { id: "performance", label: "Draw calls", sub: "the CPU's side of a frame", col: 0, row: 1 },
      { id: "gpu", label: "The GPU", sub: "thousands of lanes", col: 0, row: 2 },
      { id: "transforms", label: "Vertex stage", sub: "model to clip space", col: 1, row: 0 },
      { id: "rendering-pipeline", label: "Rasteriser", sub: "triangles to fragments", col: 1, row: 1 },
      { id: "shaders", label: "Fragment stage", sub: "a colour per pixel", col: 1, row: 2 },
      { id: "post-processing", label: "Post-processing", sub: "tone map, bloom, AA", col: 1, row: 3 },
      { id: "shadows", label: "Shadows", sub: "depth from the light", col: 2, row: 0 },
      { id: "lighting-pbr", label: "Lighting and materials", sub: "PBR, BRDFs", col: 2, row: 1 },
      { id: "textures", label: "Textures", sub: "sampled, filtered, mipped", col: 2, row: 2 },
      { id: "ray-tracing", label: "Ray tracing", sub: "rays instead of triangles", col: 2, row: 3 }
    ],
    edges: [
      ["graphics-apis", "performance"], ["performance", "gpu", "command buffers"], ["gpu", "transforms", "vertices"],
      ["transforms", "rendering-pipeline", "clip space"], ["rendering-pipeline", "shaders", "fragments"],
      ["shaders", "post-processing", "frame buffer"], ["shadows", "shaders", "shadow map"],
      ["lighting-pbr", "shaders"], ["textures", "shaders", "samples"], ["ray-tracing", "post-processing", "traced light"]
    ],
    cap: "**One frame, top to bottom: the CPU records commands, the GPU transforms vertices, rasterises triangles, shades every pixel, then post-processes the image.** The right column feeds the fragment stage: that is where light, shadow and texture become colour. Ray tracing enters as a second way of computing light. Click a box to open it."
  },
  start: [
    { label: "LearnOpenGL: Getting started, through Hello Triangle and Coordinate Systems", url: "https://learnopengl.com/Getting-started/Hello-Triangle", m: 90,
      why: "The pipeline in working code, stage by stage, with the clearest diagrams on the web." },
    { label: "Scratchapixel: rasterization, a practical implementation (overview and the rasterization stage)", url: "https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/overview-rasterization-algorithm.html", m: 45,
      why: "What the hardware does for you, written as plain code: projection, edge functions, the depth buffer." },
    { label: "Shirley, Black and Hollasch, Ray Tracing in One Weekend", url: "https://raytracing.github.io/books/RayTracingInOneWeekend.html", m: 240,
      why: "Build a path tracer from nothing in an afternoon or two; the other half of rendering." },
    { label: "Fabian Giesen, A trip through the graphics pipeline 2011 (parts 1 to 3)", url: "https://fgiesen.wordpress.com/2011/07/09/a-trip-through-the-graphics-pipeline-2011-index/", m: 60,
      why: "What actually happens in the driver and the GPU when you issue a draw. Read after the first two." }
  ],
  clusters: [
    { name: "The pipeline and the GPU", line: "The machine, the programs that run on it, and the APIs that drive it.",
      topics: [
        { id: "rendering-pipeline", name: "The rendering pipeline",
          line: "Vertices in, pixels out: the fixed sequence of stages every rasterised frame goes through.",
          body: [
            "The application hands the GPU **vertices** (positions plus attributes such as normals and texture coordinates) grouped into triangles. A **vertex shader** moves each one into clip space. Fixed hardware then clips triangles to the view, divides by depth for perspective, and maps them to the screen. The **rasteriser** finds which pixels each triangle covers, using edge functions, and interpolates the vertex attributes across it with barycentric weights.",
            "Each covered pixel sample becomes a **fragment**, which a fragment shader colours. A **depth test** against the z-buffer discards fragments behind what is already drawn, and **blending** combines transparent ones. The result lands in a frame buffer that is shown on screen. Mobile GPUs (Apple, Arm Mali, Qualcomm Adreno) do the same work in screen tiles held on chip to save memory bandwidth."
          ],
          where: "Every game, map, CAD tool and browser that draws 3D runs this pipeline, through D3D12 on Xbox and Windows, Metal on Apple devices, Vulkan on Android and Linux.",
          nuance: "Rasterisation is fast because it never asks where light comes from; every pixel is shaded alone. Shadows, reflections and indirect light have to be faked or computed by extra passes, which is most of what real-time rendering techniques are.",
          read: [{ label: "Scratchapixel: the rasterization stage (edge functions, barycentric coordinates)", url: "https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-stage.html", m: 30 }],
          tags: ["rasterization", "vertex", "fragment", "z-buffer", "depth test", "tile-based"] },
        { id: "gpu", name: "The GPU and why it is parallel",
          line: "Thousands of simple lanes running the same program on different data at once.",
          body: [
            "A CPU has a few large cores tuned to finish one thread fast. A GPU has many small ones that run the **same instruction across a group of threads** (32 on NVIDIA, called a warp; 32 or 64 on AMD). Shading is a perfect fit: a 1080p frame is about two million pixels, each running the same fragment shader with different inputs.",
            "GPUs hide slow memory by keeping many groups in flight and switching to another whenever one waits for data, so they need a lot of independent work to be fast. Threads in a group that take different branches run both paths one after the other (**divergence**). Most real workloads are limited by memory bandwidth, not arithmetic, which is why data layout and texture compression matter so much."
          ],
          where: "The same hardware renders games and trains models: CUDA, ROCm and compute shaders all program it; NVIDIA's RTX cards add dedicated ray tracing and tensor units.",
          nuance: "A GPU is slow at anything that is not wide. A loop over 100 items, or work that needs a round trip to the CPU each frame, will often run faster on the CPU.",
          read: [
            { label: "Modal, GPU glossary: device hardware and the performance section", url: "https://modal.com/gpu-glossary", m: 30 },
            { label: "Horace He, Making deep learning go brrrr from first principles (compute, bandwidth, overhead)", url: "https://horace.io/brrr_intro.html", m: 20 }
          ],
          tags: ["gpu", "simt", "warp", "wavefront", "divergence", "bandwidth", "cuda"] },
        { id: "shaders", name: "Shaders and shading languages",
          line: "Small programs the GPU runs per vertex, per pixel, or per workgroup of threads.",
          body: [
            "A **vertex shader** runs once per vertex and outputs a clip-space position plus values to interpolate. A **fragment** (pixel) shader runs once per covered sample and outputs a colour, reading textures and lighting inputs. A **compute shader** is not tied to the pipeline at all: it runs a grid of threads over buffers, and engines use it for culling, particles, skinning and post-processing.",
            "Shaders are written in **GLSL** (OpenGL, Vulkan), **HLSL** (Direct3D, and Vulkan through compilers), **MSL** (Metal) or **WGSL** (WebGPU), and compiled to an intermediate form such as SPIR-V or DXIL that the driver turns into machine code. Inputs that are the same for a whole draw (matrices, light positions) are passed as uniforms or constant buffers."
          ],
          where: "Unreal's material graph and Unity's Shader Graph generate shaders for artists; Shadertoy is where people share fragment shader experiments.",
          nuance: "On PC, shaders are compiled for the user's exact GPU, often the first time an effect appears, which causes the 'shader compilation stutter' many recent PC games ship with. Precompiling during loading is the fix and it is easy to skip.",
          read: [
            { label: "Gonzalez Vivo and Lowe, The Book of Shaders: chapters 1 to 5", url: "https://thebookofshaders.com/", m: 45 },
            { label: "Pramod Goyal, CUDA from zero to hero #1: the thread model compute shaders share", url: "https://x.com/goyal__pramod/status/2103565642800431533", m: 10 }
          ],
          tags: ["glsl", "hlsl", "wgsl", "msl", "spir-v", "compute shader", "vertex shader", "fragment shader"] },
        { id: "graphics-apis", name: "Graphics APIs",
          line: "OpenGL, Vulkan, Direct3D 12, Metal and WebGPU: how a program talks to the GPU.",
          body: [
            "**OpenGL** (1992) is a state machine: you set state and issue draws, and the driver works out memory, synchronisation and ordering for you. That convenience cost CPU time and predictability, so the **explicit** generation (Direct3D 12 in 2015, Vulkan in 2016, Metal in 2014) hands those jobs to the application: you record **command buffers**, build **pipeline state objects** up front, manage memory and insert barriers yourself. The reward is lower driver overhead and recording commands on many threads.",
            "**WebGPU** brings that model to browsers in a safer, smaller form, with WGSL shaders and compute; it is a W3C Candidate Recommendation and ships in Chrome, Edge, Safari and Firefox. **WebGL 2** (OpenGL ES 3.0 in the browser) is still the most widely deployed."
          ],
          where: "Unreal, Unity and Godot hide all of them behind one rendering interface; Apple platforms are Metal only; Android and Linux use Vulkan; Windows and Xbox use Direct3D 12.",
          nuance: "Explicit APIs are faster only if you do the driver's old job well. Drawing a first triangle in Vulkan takes many hundreds of lines, and a naive Vulkan renderer can be slower than OpenGL.",
          read: [
            { label: "Vulkan tutorial: overview and drawing a triangle", url: "https://vulkan-tutorial.com/", m: 60 },
            { label: "WebGPU fundamentals: the fundamentals lesson", url: "https://webgpufundamentals.org/", m: 30 }
          ],
          tags: ["opengl", "vulkan", "directx", "d3d12", "metal", "webgpu", "webgl"] }
      ] },
    { name: "Space, light and surfaces", line: "The maths and physics that decide where things are and what colour they appear.",
      topics: [
        { id: "transforms", name: "Coordinate spaces and transforms",
          line: "Matrices that move points from a model's own space to a pixel on screen.",
          body: [
            "A vertex passes through a chain of spaces: **local** (as modelled), **world** (placed in the scene), **view** (relative to the camera), **clip** (after projection), then normalised device coordinates and screen pixels. Each step is a 4x4 matrix, so the whole chain is one multiplication: projection times view times model.",
            "4x4 matrices on **homogeneous coordinates** (x, y, z, w) let one matrix express rotation, scale and translation together. The perspective matrix puts depth into w; dividing by w afterwards makes far things small. Rotations are often stored as **quaternions**, which interpolate smoothly and avoid gimbal lock. Normals need the inverse transpose of the model matrix, or non-uniform scaling bends lighting."
          ],
          where: "Every engine and 3D library (glm, DirectXMath, three.js, Unity's Transform) exposes exactly this chain; AR frameworks such as ARKit hand you the camera's view and projection matrices.",
          nuance: "Most 'my object is invisible' bugs are a convention mismatch: row against column vectors, left against right-handed axes, or depth ranging 0 to 1 against -1 to 1. Matrix order matters and is not commutative.",
          read: [{ label: "LearnOpenGL: Coordinate Systems", url: "https://learnopengl.com/Getting-started/Coordinate-Systems", m: 30 }],
          tags: ["matrix", "mvp", "projection", "homogeneous", "quaternion", "clip space"] },
        { id: "lighting-pbr", name: "Lighting and physically based materials",
          line: "Modelling how surfaces reflect light, with rules that conserve energy.",
          body: [
            "Light at a surface splits into **diffuse** (scattered evenly; Lambert's law, brightness follows the cosine of the angle to the light) and **specular** (mirror-like, concentrated around the reflection direction). Older models such as Blinn-Phong tuned these by eye. **Physically based rendering** treats a surface as tiny mirrors (microfacets) and uses a BRDF, usually Cook-Torrance, built from a distribution of microfacet normals, a Fresnel term (more reflection at grazing angles) and a geometry term for self-shadowing.",
            "Materials are described by a few measurable inputs: base colour, **metallic**, **roughness** and normal maps. Because the model conserves energy, one material looks right under any lighting, which is what lets artists share assets across scenes. Image-based lighting adds light from an environment map."
          ],
          where: "Disney's principled BRDF (2012) and Epic's Unreal Engine 4 (2013) set the standard; glTF, Unity, Unreal, Blender and Substance all use the metallic-roughness workflow.",
          nuance: "Lighting maths must run in linear colour, while textures and screens store sRGB (gamma-encoded) values. Forgetting the conversion gives washed-out or harsh lighting that no material tweak will fix.",
          read: [{ label: "LearnOpenGL: PBR theory", url: "https://learnopengl.com/PBR/Theory", m: 35 }],
          tags: ["pbr", "brdf", "cook-torrance", "fresnel", "metallic", "roughness", "gamma", "srgb"] },
        { id: "textures", name: "Textures and sampling",
          line: "Images wrapped onto surfaces, read with filtering so they do not shimmer or blur.",
          body: [
            "A texture is an image the shader reads at **UV coordinates** interpolated across a triangle. Since a pixel rarely lands exactly on a texel, the sampler **filters**: nearest picks one texel, bilinear blends four. When a texture is shown smaller than its resolution, many texels fall in one pixel and it shimmers, so GPUs keep **mipmaps**, a chain of half-size copies costing a third more memory, and pick the level that matches. Trilinear blends between levels; anisotropic filtering takes extra samples along slanted surfaces such as a floor seen from a low angle.",
            "Textures also hold data that is not colour: normals, roughness, depth, shadow maps. GPUs read them in **block-compressed** formats (BC on desktop, ASTC on mobile) that decode in hardware."
          ],
          where: "Textures are usually the largest share of a game's video memory and download size; engines stream mip levels in and out as the camera moves.",
          nuance: "Normal and roughness maps must be stored as linear data, not sRGB, and compressed with formats meant for them. Treating every texture like a photo is a quiet, common source of wrong shading.",
          read: [{ label: "LearnOpenGL: Textures (wrapping, filtering, mipmaps)", url: "https://learnopengl.com/Getting-started/Textures", m: 30 }],
          tags: ["texture", "uv", "mipmap", "filtering", "anisotropic", "bc7", "astc"] }
      ] },
    { name: "Making the image", line: "Techniques that turn a shaded frame into a convincing one.",
      topics: [
        { id: "ray-tracing", name: "Ray tracing and path tracing",
          line: "Following rays of light through the scene instead of projecting triangles onto the screen.",
          body: [
            "A ray tracer shoots a ray through each pixel, finds the nearest surface it hits, and shades that point by casting more rays: to lights for shadows, along the mirror direction for reflections. Finding hits fast needs an **acceleration structure**, usually a bounding volume hierarchy, so each ray tests a few boxes instead of every triangle.",
            "**Path tracing** solves the full lighting equation by Monte Carlo: at each hit, bounce in a random direction and average many such paths per pixel. It captures soft shadows, colour bleeding and caustics with one algorithm, but converges slowly and looks noisy with few samples. Real-time games use one or two rays per pixel plus a **denoiser**, often a neural one, and dedicated RT hardware (NVIDIA since 2018, AMD, Apple and Intel since)."
          ],
          where: "Film rendering (Pixar's RenderMan, Blender Cycles, Arnold) is path traced; games mix rasterised visibility with traced reflections, shadows and global illumination, and Cyberpunk 2077 ships a full path-traced mode.",
          nuance: "Noise and bias are the real trade-off: a few samples per pixel are noisy, and denoising or caching trades that noise for blur and lag. Most 'ray traced' games are hybrids, not pure ray tracers.",
          read: [
            { label: "Ray Tracing in One Weekend: chapters 1 to 9", url: "https://raytracing.github.io/books/RayTracingInOneWeekend.html", m: 120 },
            { label: "Pharr, Jakob and Humphreys, Physically Based Rendering 4e: ch. 13 Light Transport I (path tracing)", url: "https://pbr-book.org/4ed/contents", m: 60 }
          ],
          tags: ["ray tracing", "path tracing", "bvh", "monte carlo", "denoising", "rtx", "global illumination"] },
        { id: "shadows", name: "Shadows",
          line: "Working out, per pixel, whether the light can see this point.",
          body: [
            "The standard real-time method is **shadow mapping**: render the scene's depth from the light's point of view into a texture, then, when shading a pixel, transform it into the light's view and compare its depth with the stored one. If something nearer was recorded, the pixel is in shadow.",
            "The artefacts are the subject: **shadow acne** (surfaces shadowing themselves from limited depth precision), fixed by a small bias, which in excess causes **peter-panning** (shadows detaching from objects). Edges are softened by percentage-closer filtering, sampling the map several times. A sun over a large world uses **cascaded shadow maps**: several maps covering nearer and farther slices of the view, so detail goes where the camera is."
          ],
          where: "Every rasterised game engine ships cascaded shadow maps for the sun; Unreal's virtual shadow maps and ray-traced shadows are the current high end.",
          nuance: "Shadow maps are a resolution budget: a texel covers more ground the farther it is from the camera's focus. Almost every shadow technique is a scheme for spending those texels where the viewer will notice.",
          read: [{ label: "LearnOpenGL: Shadow mapping (acne, bias, peter-panning, PCF)", url: "https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping", m: 30 }],
          tags: ["shadow mapping", "shadow acne", "pcf", "cascaded shadow maps", "csm"] },
        { id: "deferred-rendering", name: "Forward and deferred rendering",
          line: "Lighting each object as it is drawn, or storing surfaces first and lighting the screen after.",
          body: [
            "**Forward** rendering shades each object as it is drawn, looping over the lights that touch it; cost grows with objects times lights, and hidden surfaces are shaded for nothing. **Deferred** rendering first draws every surface's properties (colour, normal, roughness, depth) into a set of screen-sized textures, the **G-buffer**, then runs lighting once per pixel per light. Hundreds of lights become affordable.",
            "Deferred has costs: the G-buffer eats memory and bandwidth, transparency does not fit (only the nearest surface is stored), and hardware MSAA no longer works directly. **Forward+** (tiled or clustered forward) bins lights into screen tiles or 3D clusters first and keeps forward's flexibility."
          ],
          where: "Unreal Engine renders deferred by default; Doom (2016) used clustered forward; mobile engines lean forward because G-buffers cost too much bandwidth on tile-based GPUs.",
          nuance: "Every deferred engine still needs a forward pass for glass, particles and hair. The real choice is which path most of the scene takes, not one or the other.",
          read: [{ label: "LearnOpenGL: Deferred shading", url: "https://learnopengl.com/Advanced-Lighting/Deferred-Shading", m: 30 }],
          tags: ["deferred", "g-buffer", "forward+", "clustered", "tiled"] },
        { id: "anti-aliasing", name: "Anti-aliasing and upscaling",
          line: "Removing jagged edges and shimmer, and rendering fewer pixels than you display.",
          body: [
            "A pixel tests coverage at one point, so edges come out as stairs and thin details flicker between frames: **aliasing**. Supersampling renders more samples and averages them (correct, expensive). **MSAA** tests coverage at several points per pixel but shades once, cheap for edges but blind to shader aliasing. **FXAA** and **SMAA** find edges in the final image and blur along them.",
            "**Temporal anti-aliasing** jitters the camera by a fraction of a pixel each frame and blends with previous frames, reprojected using motion vectors, so samples accumulate over time. **Upscalers** build on the same idea to render at a lower resolution and reconstruct a higher one: DLSS (a neural network on NVIDIA's tensor cores), AMD's FSR and Intel's XeSS. Frame generation goes further and synthesises whole in-between frames."
          ],
          where: "Most current PC and console games ship TAA with DLSS, FSR or XeSS; the PlayStation 5 Pro adds its own learned upscaler, PSSR.",
          nuance: "Temporal methods trade aliasing for ghosting and softness when motion vectors are wrong or something new appears. Many players' complaints about blurry modern games are TAA complaints.",
          tags: ["aliasing", "msaa", "fxaa", "taa", "dlss", "fsr", "upscaling", "frame generation"] },
        { id: "post-processing", name: "Post-processing",
          line: "Full-screen passes over the finished image: exposure, bloom, depth of field, colour.",
          body: [
            "Modern renderers light in **high dynamic range**, storing colour in floating-point buffers where the sun can be thousands of times brighter than a wall. **Tone mapping** compresses that range to what a display shows, the way a camera's exposure does (ACES and AgX are common curves). Around it sit passes that read the frame and write a new one: **bloom** (bright areas glow), depth of field, motion blur, screen-space ambient occlusion (darkening creases from the depth buffer), and **colour grading** through a lookup table.",
            "Each pass is a fragment or compute shader over every pixel, so its cost scales with resolution, not scene complexity."
          ],
          where: "Unreal's post-process volumes and Unity's URP and HDRP volumes expose these as artist controls; HDR displays now need separate tone mapping paths.",
          nuance: "Post effects are cheap to add and expensive in total: ten full-screen passes at 4K read and write over 300 MB of pixels a frame. Teams cap them by merging passes into one shader.",
          tags: ["hdr", "tone mapping", "bloom", "ssao", "depth of field", "color grading", "lut"] }
      ] },
    { name: "Performance and other kinds of pictures", line: "Hitting the frame budget, and graphics outside the 3D game pipeline.",
      topics: [
        { id: "performance", name: "Draw calls, overdraw and GPU profiling",
          line: "Finding whether the CPU or the GPU limits a frame, then cutting what costs most.",
          body: [
            "A frame has a budget: 16.7 ms at 60 fps, 8.3 ms at 120. First find which side is the limit. A frame is **CPU-bound** when the game logic or the cost of issuing **draw calls** (each one validated by the driver) runs long; the fixes are fewer, larger draws through batching and **instancing**, and culling what the camera cannot see. It is **GPU-bound** when shading or memory traffic runs long; the usual culprits are **overdraw** (the same pixel shaded many times, typically by particles and transparent layers), expensive fragment shaders, and too many full-screen passes.",
            "Measure with a frame capture: **RenderDoc** (free, Vulkan, D3D11, D3D12, OpenGL), PIX on Windows and Xbox, NVIDIA Nsight, Xcode's Metal debugger. They show each pass's time, each draw's state and every texture read."
          ],
          where: "Console certification and mobile thermal limits make this daily work for engine teams; Unreal's Nanite and GPU-driven rendering move culling and draw submission onto the GPU itself.",
          nuance: "Optimising the wrong side does nothing: halving shader cost on a CPU-bound frame gains zero milliseconds. Profile, find the bound, then change one thing.",
          read: [{ label: "RenderDoc: the home page and getting started", url: "https://renderdoc.org/", m: 15 }],
          tags: ["draw calls", "instancing", "batching", "overdraw", "cpu-bound", "gpu-bound", "renderdoc", "profiling"] },
        { id: "canvas-2d", name: "2D graphics and the web canvas",
          line: "Paths, fills and text drawn by a 2D library, in the browser or in an app.",
          body: [
            "2D graphics draws **vectors**: paths made of lines and curves, filled or stroked, plus images and text. A rasteriser turns each path into pixel coverage with anti-aliased edges. On the web there are three routes. **Canvas 2D** is immediate mode: you call drawing commands and get pixels, with nothing remembered. **SVG** is retained: shapes live in the DOM, can be styled and clicked, and get slow in the many thousands. **WebGL and WebGPU** hand you the GPU for large or animated scenes.",
            "Underneath, browsers use 2D engines such as **Skia** (Chrome, Android, Flutter) and Core Graphics (Safari, iOS), which increasingly rasterise on the GPU."
          ],
          where: "Charting libraries pick canvas or SVG by data size; Figma and Google Maps draw through the GPU in the browser; Flutter paints every widget with Skia or its newer Impeller renderer.",
          nuance: "Canvas is fast but invisible to screen readers and search, since it is only pixels. Anything people must read or click needs an accessible layer alongside it.",
          read: [{ label: "MDN: Canvas API tutorial (basic usage through transformations)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial", m: 45 }],
          tags: ["canvas", "svg", "skia", "vector", "2d", "webgl"] },
        { id: "neural-rendering", name: "Gaussian splatting and neural rendering",
          line: "Scenes learned from photographs, and networks that help draw ordinary frames.",
          body: [
            "**NeRF** (2020) trained a small network to map a 3D position and view direction to colour and density, then rendered by marching rays through it: photoreal, but seconds per frame. **3D Gaussian splatting** (2023) replaced the network with millions of small, coloured, semi-transparent 3D Gaussians fitted to photos, which a rasteriser can sort and blend at 30 fps or more at 1080p. Capture a room with a phone, get a navigable 3D scene.",
            "Neural networks also enter conventional pipelines: denoisers for ray tracing, upscalers such as DLSS, and neural texture compression."
          ],
          where: "Polycam, Luma and Niantic's Scaniverse capture splats; real estate, heritage scanning and film previsualisation use them; game engines are adding splat renderers.",
          nuance: "A splat captures how a scene looked under the light it was photographed in. Relighting it, editing it or making it collide like geometry is still hard, which keeps it out of most game worlds.",
          read: [{ label: "Kerbl et al., 3D Gaussian splatting for real-time radiance field rendering: abstract and section 1", url: "https://arxiv.org/abs/2308.04079", m: 15 }],
          tags: ["gaussian splatting", "nerf", "neural rendering", "radiance field", "3dgs"] }
      ] }
  ]
});
