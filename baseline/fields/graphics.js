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
            "The application hands the GPU **vertices** (positions plus attributes such as normals and texture coordinates) grouped into triangles. A **vertex shader** moves each one into clip space; fixed hardware clips triangles to the view, divides by depth for perspective and maps them to the screen. The **rasteriser** finds which pixels each triangle covers and interpolates the vertex attributes across it with barycentric weights.",
            "Each covered sample becomes a **fragment**, coloured by a fragment shader. A **depth test** against the z-buffer discards what is hidden, and **blending** combines transparent layers into the frame buffer shown on screen."
          ],
          uses: [
            "**Every game and 3D app**: runs this pipeline through Direct3D 12 on Windows and Xbox, Metal on Apple devices, Vulkan on Android and Linux.",
            "**Google Maps and Figma in the browser**: draw through WebGL, the same pipeline exposed to JavaScript.",
            "**Apple, Arm Mali and Qualcomm Adreno GPUs**: run it tile by tile, keeping colour and depth in on-chip memory to save bandwidth."
          ],
          example: "One triangle covering 1,000 pixels: the vertex shader runs 3 times, the rasteriser emits 1,000 fragments, and the fragment shader would run 1,000 times. If a nearer wall has already been drawn over 600 of those pixels, an early depth test skips them and only 400 are shaded. That ratio of per-pixel to per-vertex work is why fragment shading dominates most frames.",
          nuance: "Rasterisation is fast because it never asks where light comes from; every pixel is shaded alone. Shadows, reflections and indirect light have to be faked or computed by extra passes, which is most of what real-time rendering techniques are.",
          read: [{ label: "Scratchapixel: the rasterization stage (edge functions, barycentric coordinates)", url: "https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-stage.html", m: 30 }],
          tags: ["rasterization", "vertex", "fragment", "z-buffer", "depth test", "tile-based"] },
        { id: "gpu", name: "The GPU and why it is parallel",
          line: "Thousands of simple lanes running the same program on different data at once.",
          body: [
            "A CPU has a few large cores tuned to finish one thread fast. A GPU has many small ones that run the **same instruction across a group of threads** (32 on NVIDIA, called a warp; 32 or 64 on AMD). Shading fits perfectly: a 1080p frame is about two million pixels, each running the same fragment shader on different inputs.",
            "GPUs hide slow memory by keeping many groups in flight and switching whenever one waits for data, so they need lots of independent work. Threads in a group that take different branches run both paths in turn (**divergence**). Most workloads are limited by memory bandwidth, not arithmetic."
          ],
          uses: [
            "**Games**: shade millions of pixels a frame on the same SIMT hardware that trains models.",
            "**CUDA and ROCm**: program NVIDIA and AMD GPUs directly for machine learning, simulation and video.",
            "**NVIDIA RTX cards**: add dedicated ray tracing cores and tensor cores beside the shader cores."
          ],
          example: "A shader does `if (inShadow) cheapPath(); else fullLighting();`. Along a shadow edge, one warp of 32 pixels holds both kinds, so all 32 lanes step through both branches and the warp pays cheap plus full. Warps entirely in light or entirely in shadow pay for one branch. Divergence costs only where branches disagree inside a group.",
          nuance: "A GPU is slow at anything that is not wide. A loop over 100 items, or work that needs a round trip to the CPU each frame, will often run faster on the CPU.",
          read: [
            { label: "Modal, GPU glossary: device hardware and the performance section", url: "https://modal.com/gpu-glossary", m: 30 },
            { label: "Horace He, Making deep learning go brrrr from first principles (compute, bandwidth, overhead)", url: "https://horace.io/brrr_intro.html", m: 20 }
          ],
          tags: ["gpu", "simt", "warp", "wavefront", "divergence", "bandwidth", "cuda"] },
        { id: "shaders", name: "Shaders and shading languages",
          line: "Small programs the GPU runs per vertex, per pixel, or per workgroup of threads.",
          body: [
            "A **vertex shader** runs once per vertex and outputs a clip-space position plus values to interpolate. A **fragment** shader runs once per covered sample and outputs a colour, reading textures and lighting inputs. A **compute shader** runs a grid of threads over buffers, outside the pipeline; engines use it for culling, particles, skinning and post-processing.",
            "Shaders are written in **GLSL**, **HLSL**, **MSL** (Metal) or **WGSL** (WebGPU) and compiled to an intermediate form such as SPIR-V or DXIL, which the driver turns into machine code. Values shared by a whole draw (matrices, light positions) arrive as uniforms or constant buffers."
          ],
          uses: [
            "**Unreal's material editor and Unity's Shader Graph**: let artists build node graphs that the engine compiles into shader code.",
            "**Shadertoy**: hosts fragment shaders that draw whole scenes from one function of the pixel coordinate.",
            "**Unreal's Nanite and Niagara**: cull and rasterise triangles and simulate particles in compute shaders."
          ],
          example: "A minimal GLSL fragment shader, lit by the angle to one light: `float d = max(dot(normalize(normal), lightDir), 0.0); colour = vec4(vec3(d), 1.0);`. It runs once per fragment. A surface facing the light gets 1.0 and comes out white; one seen edge-on gets 0 and comes out black. That cosine is Lambert's law in two lines.",
          nuance: "On PC, shaders are compiled for the user's exact GPU, often the first time an effect appears, which causes the 'shader compilation stutter' many recent PC games ship with. Precompiling during loading is the fix and it is easy to skip.",
          read: [
            { label: "Gonzalez Vivo and Lowe, The Book of Shaders: chapters 1 to 5", url: "https://thebookofshaders.com/", m: 45 },
            { label: "Pramod Goyal, CUDA from zero to hero #1: the thread model compute shaders share", url: "https://x.com/goyal__pramod/status/2103565642800431533", m: 10 }
          ],
          tags: ["glsl", "hlsl", "wgsl", "msl", "spir-v", "compute shader", "vertex shader", "fragment shader"] },
        { id: "graphics-apis", name: "Graphics APIs",
          line: "OpenGL, Vulkan, Direct3D 12, Metal and WebGPU: how a program talks to the GPU.",
          body: [
            "**OpenGL** (1992) is a state machine: you set state and issue draws, and the driver works out memory, synchronisation and ordering. That convenience cost CPU time and predictability, so the **explicit** generation (Metal in 2014, Direct3D 12 in 2015, Vulkan in 2016) hands those jobs to the application: record **command buffers**, build **pipeline state objects** up front, manage memory and insert barriers yourself. The reward is lower driver overhead and recording commands on many threads.",
            "**WebGPU** brings that model to browsers in a safer, smaller form, with WGSL and compute. **WebGL 2** is still the most widely deployed."
          ],
          uses: [
            "**Unreal, Unity and Godot**: hide all of them behind one rendering interface and pick a backend per platform.",
            "**Apple platforms**: support Metal for new work; OpenGL has been deprecated there since 2018.",
            "**Valve's Proton**: translates Direct3D calls to Vulkan so Windows games run on Linux and the Steam Deck."
          ],
          example: "Drawing 5,000 objects. In OpenGL each draw makes the driver validate state and track resources, on one thread. In Vulkan the engine builds pipeline objects at load time, splits the 5,000 draws across 8 threads that each record a command buffer, and submits them together. The draws are identical; the CPU cost per draw falls and spreads across cores.",
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
            "A vertex passes through a chain of spaces: **local** (as modelled), **world** (placed in the scene), **view** (relative to the camera), **clip** (after projection), then normalised device coordinates and screen pixels. Each step is a 4x4 matrix, so the whole chain is one product: projection times view times model.",
            "**Homogeneous coordinates** (x, y, z, w) let one matrix hold rotation, scale and translation together. The projection puts depth into w; dividing by w afterwards makes far things small. Rotations are often stored as **quaternions**, which interpolate smoothly and avoid gimbal lock. Normals need the inverse transpose of the model matrix, or non-uniform scaling bends lighting."
          ],
          uses: [
            "**glm, DirectXMath and three.js**: provide these matrices and the model, view and projection chain ready-made.",
            "**Unity's Transform and Unreal's FTransform**: store position, quaternion rotation and scale per object and build the matrix when needed.",
            "**ARKit and ARCore**: hand you the camera's view and projection matrices each frame so virtual objects line up with the room."
          ],
          example: "A point 1 m right of a model's centre, with the model placed 5 m in front of the camera. The model and view matrices put it at (1, 0, -5) in view space. The projection copies the distance, 5, into w. Dividing by w gives x = 0.2 times the lens scale. Move the model to 10 m and the same point lands at 0.1: half as far from the centre, so it looks half as big.",
          nuance: "Most 'my object is invisible' bugs are a convention mismatch: row against column vectors, left against right-handed axes, or depth ranging 0 to 1 against -1 to 1. Matrix order matters and is not commutative.",
          read: [{ label: "LearnOpenGL: Coordinate Systems", url: "https://learnopengl.com/Getting-started/Coordinate-Systems", m: 30 }],
          tags: ["matrix", "mvp", "projection", "homogeneous", "quaternion", "clip space"] },
        { id: "lighting-pbr", name: "Lighting and physically based materials",
          line: "Modelling how surfaces reflect light, with rules that conserve energy.",
          body: [
            "Light at a surface splits into **diffuse** (scattered evenly; brightness follows the cosine of the angle to the light) and **specular** (concentrated around the mirror direction). **Physically based rendering** treats a surface as tiny mirrors (microfacets) and uses a BRDF, usually Cook-Torrance: a distribution of microfacet normals, a Fresnel term (more reflection at grazing angles) and a geometry term for self-shadowing.",
            "Materials are a few measurable inputs: base colour, **metallic**, **roughness** and normal maps. Because the model conserves energy, one material looks right under any lighting, so artists can share assets across scenes."
          ],
          uses: [
            "**Unreal Engine 4 (2013)**: brought Disney's 2012 principled BRDF to real time, and the industry followed.",
            "**glTF, Unity, Blender and Substance**: share the metallic-roughness workflow, so one material moves between tools intact.",
            "**Image-based lighting**: lights objects in most engines from an environment map captured or rendered around them."
          ],
          example: "Two balls with the same base colour. Roughness 0.1: a small, sharp highlight with the room visibly reflected. Roughness 0.8: a broad, dim highlight spread across the surface. Set metallic to 1 and the reflection takes the base colour, like gold; at 0 the highlight stays white, like plastic. Move them into a darker room and both still look right.",
          nuance: "Lighting maths must run in linear colour, while textures and screens store sRGB (gamma-encoded) values. Forgetting the conversion gives washed-out or harsh lighting that no material tweak will fix.",
          read: [{ label: "LearnOpenGL: PBR theory", url: "https://learnopengl.com/PBR/Theory", m: 35 }],
          tags: ["pbr", "brdf", "cook-torrance", "fresnel", "metallic", "roughness", "gamma", "srgb"] },
        { id: "textures", name: "Textures and sampling",
          line: "Images wrapped onto surfaces, read with filtering so they do not shimmer or blur.",
          body: [
            "A texture is an image the shader reads at **UV coordinates** interpolated across a triangle. A pixel rarely lands exactly on a texel, so the sampler **filters**: nearest takes one texel, bilinear blends four. Shown smaller than its resolution, a texture shimmers, so GPUs keep **mipmaps**, a chain of half-size copies costing a third more memory, and pick the level that fits. Anisotropic filtering adds samples along slanted surfaces such as a floor.",
            "Textures also hold normals, roughness, depth and shadow maps, in **block-compressed** formats (BC on desktop, ASTC on mobile) decoded in hardware."
          ],
          uses: [
            "**Game installs**: textures are usually the largest share of a game's download size and video memory.",
            "**Unreal's texture streaming**: loads only the mip levels the camera needs and evicts the rest as it moves.",
            "**Phones**: sample ASTC-compressed textures, cutting memory and bandwidth several times over against raw images."
          ],
          example: "A 2048 by 2048 RGBA texture is 16 MB raw; its mip chain adds a third, about 21 MB. As BC7, one byte per texel, it is about 5.3 MB with mips. Drawn on a distant wall 128 pixels wide, the GPU samples the 128 by 128 mip level, reading kilobytes rather than the whole image.",
          nuance: "Normal and roughness maps must be stored as linear data, not sRGB, and compressed with formats meant for them. Treating every texture like a photo is a quiet, common source of wrong shading.",
          read: [{ label: "LearnOpenGL: Textures (wrapping, filtering, mipmaps)", url: "https://learnopengl.com/Getting-started/Textures", m: 30 }],
          tags: ["texture", "uv", "mipmap", "filtering", "anisotropic", "bc7", "astc"] }
      ] },
    { name: "Making the image", line: "Techniques that turn a shaded frame into a convincing one.",
      topics: [
        { id: "ray-tracing", name: "Ray tracing and path tracing",
          line: "Following rays of light through the scene instead of projecting triangles onto the screen.",
          body: [
            "A ray tracer shoots a ray through each pixel, finds the nearest surface it hits, and shades that point by casting more rays: to lights for shadows, along the mirror direction for reflections. An **acceleration structure**, usually a bounding volume hierarchy, lets each ray test a few boxes instead of every triangle.",
            "**Path tracing** solves the full lighting equation by Monte Carlo: at each hit, bounce in a random direction and average many paths per pixel. One algorithm captures soft shadows, colour bleeding and caustics, but few samples look noisy. Real-time games use one or two rays per pixel, a **denoiser** and dedicated RT hardware."
          ],
          uses: [
            "**Pixar's RenderMan, Blender Cycles and Arnold**: path trace film and animation frames, spending minutes to hours on each.",
            "**Cyberpunk 2077**: ships a full path-traced mode on NVIDIA RTX cards, with DLSS ray reconstruction as its denoiser.",
            "**Most current games**: rasterise visibility and trace only reflections, shadows or global illumination."
          ],
          example: "A 1080p frame at one sample per pixel is about two million primary rays, plus a shadow ray and one bounce each: some six million rays. A BVH over a million triangles is about 20 levels deep, so each ray tests a few dozen boxes, not a million triangles. The raw image is grainy; the denoiser fills in the rest.",
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
            "The artefacts are the subject. **Shadow acne** (surfaces shadowing themselves through limited depth precision) is fixed with a small bias, which in excess causes **peter-panning** (shadows detaching from objects). Percentage-closer filtering softens edges. A sun over a large world uses **cascaded shadow maps**, several maps for nearer and farther slices of the view."
          ],
          uses: [
            "**Rasterised game engines**: ship cascaded shadow maps for the sun, typically three or four cascades.",
            "**Unreal Engine 5**: uses virtual shadow maps, one very large map paged in tiles only where the camera needs detail.",
            "**RTX titles**: trace one ray per pixel toward the light and denoise, giving soft edges that harden near contact."
          ],
          example: "One 2048-texel shadow map stretched over a 1 km world gives each texel half a metre: a character's shadow is a blob. Cascades fix it. The first covers the nearest 20 m at about 1 cm per texel; the last reaches out to 1 km at half a metre per texel, where the coarse shadows are too far away to notice.",
          nuance: "Shadow maps are a resolution budget: a texel covers more ground the farther it is from the camera's focus. Almost every shadow technique is a scheme for spending those texels where the viewer will notice.",
          read: [{ label: "LearnOpenGL: Shadow mapping (acne, bias, peter-panning, PCF)", url: "https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping", m: 30 }],
          tags: ["shadow mapping", "shadow acne", "pcf", "cascaded shadow maps", "csm"] },
        { id: "deferred-rendering", name: "Forward and deferred rendering",
          line: "Lighting each object as it is drawn, or storing surfaces first and lighting the screen after.",
          body: [
            "**Forward** rendering shades each object as it is drawn, looping over the lights that touch it; cost grows with objects times lights, and hidden surfaces are shaded for nothing. **Deferred** rendering first writes every surface's properties (colour, normal, roughness, depth) into screen-sized textures, the **G-buffer**, then lights once per pixel per light. Hundreds of lights become affordable.",
            "Deferred has costs: the G-buffer eats memory and bandwidth, transparency does not fit, and hardware MSAA no longer works directly. **Forward+** bins lights into screen tiles or 3D clusters first and keeps forward's flexibility."
          ],
          uses: [
            "**Unreal Engine**: renders deferred by default and offers a forward path for VR, where MSAA matters.",
            "**Doom (2016)**: used clustered forward rendering, with lights binned into a 3D grid over the view.",
            "**Mobile engines**: lean forward, because writing a large G-buffer out of on-chip tile memory costs too much bandwidth."
          ],
          example: "A scene with 200 objects and 100 small lights at 1080p. Forward, naively: 200 x 100 object-light pairs, and overdraw shades hidden pixels too. Deferred: draw the 200 objects once into four 1080p targets (about 33 MB), then for each light shade only the pixels inside its radius. Glass and smoke still need a forward pass afterwards.",
          nuance: "Every deferred engine still needs a forward pass for glass, particles and hair. The real choice is which path most of the scene takes, not one or the other.",
          read: [{ label: "LearnOpenGL: Deferred shading", url: "https://learnopengl.com/Advanced-Lighting/Deferred-Shading", m: 30 }],
          tags: ["deferred", "g-buffer", "forward+", "clustered", "tiled"] },
        { id: "anti-aliasing", name: "Anti-aliasing and upscaling",
          line: "Removing jagged edges and shimmer, and rendering fewer pixels than you display.",
          body: [
            "A pixel tests coverage at one point, so edges come out as stairs and thin details flicker: **aliasing**. Supersampling renders more samples and averages them (correct, expensive). **MSAA** tests coverage at several points per pixel but shades once. **FXAA** and **SMAA** find edges in the final image and blur along them.",
            "**Temporal anti-aliasing** jitters the camera a fraction of a pixel each frame and blends with earlier frames, reprojected by motion vectors. **Upscalers** extend it: render fewer pixels and reconstruct more. DLSS (a neural network on tensor cores), AMD's FSR and Intel's XeSS do this; frame generation synthesises whole in-between frames."
          ],
          uses: [
            "**Most PC and console games**: ship TAA with an upscaler option, usually DLSS, FSR or XeSS.",
            "**PlayStation 5 Pro**: adds Sony's own learned upscaler, PSSR.",
            "**Nintendo Switch 2**: supports DLSS on its NVIDIA chip, so games render below the output resolution."
          ],
          example: "4K output is 8.3 million pixels. DLSS in Performance mode renders 1080p, 2.1 million pixels, a quarter of the shading work, and reconstructs 4K from that frame plus jittered samples from earlier ones. When a character turns and reveals a wall that was hidden, there is no history for it, and that patch looks soft for a few frames.",
          nuance: "Temporal methods trade aliasing for ghosting and softness when motion vectors are wrong or something new appears. Many players' complaints about blurry modern games are TAA complaints.",
          tags: ["aliasing", "msaa", "fxaa", "taa", "dlss", "fsr", "upscaling", "frame generation"] },
        { id: "post-processing", name: "Post-processing",
          line: "Full-screen passes over the finished image: exposure, bloom, depth of field, colour.",
          body: [
            "Modern renderers light in **high dynamic range**, storing colour in floating-point buffers where the sun can be thousands of times brighter than a wall. **Tone mapping** compresses that range to what a display shows, the way a camera's exposure does (ACES and AgX are common curves). Around it sit passes that read the frame and write a new one: **bloom**, depth of field, motion blur, screen-space ambient occlusion and **colour grading** through a lookup table.",
            "Each pass is a shader over every pixel, so its cost scales with resolution, not scene complexity."
          ],
          uses: [
            "**Unreal's post-process volumes and Unity's URP and HDRP volumes**: expose these passes as artist controls that blend as the camera moves between areas.",
            "**Blender**: uses AgX as its default view transform since version 4.0.",
            "**HDR displays**: need their own tone mapping path, with the screen's peak brightness as an input."
          ],
          example: "A sunlit window measures 50.0 in linear HDR; a shaded wall, 0.2. A display tops out at 1.0. Clamping turns the window into a flat white block and leaves the wall murky. A tone curve rolls 50.0 down to about 0.98 and lifts 0.2 toward the mid-tones, so both stay readable, as a camera exposed for the room would show them.",
          nuance: "Post effects are cheap to add and expensive in total: ten full-screen passes at 4K read and write over 300 MB of pixels a frame. Teams cap them by merging passes into one shader.",
          tags: ["hdr", "tone mapping", "bloom", "ssao", "depth of field", "color grading", "lut"] }
      ] },
    { name: "Performance and other kinds of pictures", line: "Hitting the frame budget, and graphics outside the 3D game pipeline.",
      topics: [
        { id: "performance", name: "Draw calls, overdraw and GPU profiling",
          line: "Finding whether the CPU or the GPU limits a frame, then cutting what costs most.",
          body: [
            "A frame has a budget: 16.7 ms at 60 fps, 8.3 ms at 120. First find which side is the limit. **CPU-bound** means game logic or issuing **draw calls** (each validated by the driver) runs long; the fixes are batching, **instancing** and culling what the camera cannot see. **GPU-bound** means shading or memory traffic runs long; the usual culprits are **overdraw** (the same pixel shaded many times, typically by particles and transparency), heavy fragment shaders and too many full-screen passes.",
            "Measure with a frame capture: it shows each pass's time and each draw's state."
          ],
          uses: [
            "**RenderDoc**: free frame capture for Vulkan, D3D11, D3D12 and OpenGL, the first tool most graphics programmers open.",
            "**PIX, NVIDIA Nsight and Xcode's Metal debugger**: the platform profilers for Xbox and Windows, NVIDIA GPUs and Apple devices.",
            "**Unreal's Nanite**: moves culling and triangle submission onto the GPU, so draw call counts stop limiting dense scenes."
          ],
          example: "A frame takes 22 ms against a 16.7 ms target. The CPU finishes its part in 9 ms; the GPU takes 22. The frame is GPU-bound, so cutting draw calls changes nothing. A capture shows a smoke effect covering the screen 12 layers deep; halving the layers and drawing particles at half resolution brings the frame under budget.",
          nuance: "Optimising the wrong side does nothing: halving shader cost on a CPU-bound frame gains zero milliseconds. Profile, find the bound, then change one thing.",
          read: [{ label: "RenderDoc: the home page and getting started", url: "https://renderdoc.org/", m: 15 }],
          tags: ["draw calls", "instancing", "batching", "overdraw", "cpu-bound", "gpu-bound", "renderdoc", "profiling"] },
        { id: "canvas-2d", name: "2D graphics and the web canvas",
          line: "Paths, fills and text drawn by a 2D library, in the browser or in an app.",
          body: [
            "2D graphics draws **vectors** (paths of lines and curves, filled or stroked) plus images and text, rasterised into anti-aliased pixel coverage. On the web there are three routes. **Canvas 2D** is immediate mode: you issue commands and get pixels, with nothing remembered. **SVG** is retained: shapes live in the DOM, can be styled and clicked, and slow down in the many thousands. **WebGL and WebGPU** hand you the GPU.",
            "Underneath, browsers use 2D engines such as **Skia** (Chrome, Android) and Core Graphics (Safari), increasingly on the GPU."
          ],
          uses: [
            "**Charting libraries**: pick SVG for a few hundred marks and canvas for tens of thousands.",
            "**Figma and Google Maps**: draw through the GPU in the browser for smooth zoom over very large documents and maps.",
            "**Flutter**: paints every widget itself, with Skia or its newer Impeller renderer."
          ],
          example: "A chart with 50,000 points. As SVG that is 50,000 DOM nodes, and each hover restyle triggers style and layout work that stutters. As canvas it is one element and a loop of `ctx.arc` calls, redrawn whole in a few milliseconds. The cost: the browser no longer knows what a point is, so hit testing and screen-reader labels become your job.",
          nuance: "Canvas is fast but invisible to screen readers and search, since it is only pixels. Anything people must read or click needs an accessible layer alongside it.",
          read: [{ label: "MDN: Canvas API tutorial (basic usage through transformations)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial", m: 45 }],
          tags: ["canvas", "svg", "skia", "vector", "2d", "webgl"] },
        { id: "neural-rendering", name: "Gaussian splatting and neural rendering",
          line: "Scenes learned from photographs, and networks that help draw ordinary frames.",
          body: [
            "**NeRF** (2020) trained a small network to map a 3D position and view direction to colour and density, then rendered by marching rays through it: photoreal, but seconds per frame. **3D Gaussian splatting** (2023) replaced the network with millions of small, coloured, semi-transparent 3D Gaussians fitted to photos, which a rasteriser can sort and blend at 30 fps or more at 1080p.",
            "Neural networks also enter conventional pipelines: denoisers for ray tracing, upscalers such as DLSS, and neural texture compression."
          ],
          uses: [
            "**Polycam, Luma and Niantic's Scaniverse**: capture splats from a phone walk-around.",
            "**Real estate, heritage scanning and film previsualisation**: use splats as navigable records of real places.",
            "**Game engines**: are adding splat renderers, so captured scenes can sit beside ordinary geometry."
          ],
          example: "Walk around a statue filming with a phone for two minutes and keep about 200 frames. Software estimates each frame's camera position, then optimises a few million Gaussians (position, shape, colour, opacity) until renders match the photos, under an hour on one GPU. The result plays back in real time from any nearby viewpoint, but cannot be relit.",
          nuance: "A splat captures how a scene looked under the light it was photographed in. Relighting it, editing it or making it collide like geometry is still hard, which keeps it out of most game worlds.",
          read: [{ label: "Kerbl et al., 3D Gaussian splatting for real-time radiance field rendering: abstract and section 1", url: "https://arxiv.org/abs/2308.04079", m: 15 }],
          tags: ["gaussian splatting", "nerf", "neural rendering", "radiance field", "3dgs"] }
      ] }
  ]
});
