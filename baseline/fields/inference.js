BASELINE.field({
  id: "inference", name: "Inference engineering", short: "Inference", layer: "Intelligence",
  ink: "#8C2F3E", inkDark: "#E3909C",
  lede: "Running trained models in production: the most useful tokens per second, per GPU, per dollar, at a latency users accept.",
  overview: [
    "Training happens once; inference happens on every request, for as long as the model is in use. Inference engineering is making that fast and cheap: choosing the engine and hardware, quantizing the model, tuning batching and caching, benchmarking honestly, and scaling GPUs up and down with traffic. The people who do it are inference engineers, ML infrastructure and platform engineers, and performance engineers, at model labs, at inference providers such as Baseten, Together, Fireworks and Modal, at NVIDIA, and at any company self-hosting open-weight models.",
    "It sits between ML (the model's architecture decides the costs) and AI engineering (whose latency and bill it sets), on top of GPUs, systems and cloud. Open-weight models made it a discipline of its own: once anyone can download a strong model, the difference is how well it is served. The open engines vLLM, SGLang and TensorRT-LLM lead, NVIDIA Dynamo orchestrates them across nodes, and custom chips from Groq and Cerebras compete with NVIDIA and AMD GPUs on speed.",
    "Two ideas explain most of this tab: generating text has a compute-bound phase and a memory-bound phase, and the KV cache is the memory that grows with every token. Read those two topics first; almost every other technique answers one of them."
  ],
  diagram: {
    nodes: [
      { id: "continuous-batching", label: "Scheduler", sub: "continuous batching", col: 0, row: 0 },
      { id: "prefill-decode", label: "Prefill", sub: "whole prompt at once", col: 0, row: 1 },
      { id: "decode", label: "Decode loop", sub: "one token per step", col: 0, row: 2 },
      { id: "metrics", label: "TTFT, TPOT", sub: "what users feel", col: 0, row: 3 },
      { id: "prefix-caching", label: "Prefix cache", sub: "reuse shared prompts", col: 1, row: 0 },
      { id: "kv-cache", label: "KV cache", sub: "memory per token", col: 1, row: 1 },
      { id: "paged-attention", label: "PagedAttention", sub: "KV memory in pages", col: 1, row: 2 },
      { id: "speculative-decoding", label: "Speculative decoding", sub: "draft, then verify", col: 1, row: 3 },
      { id: "disaggregation", label: "Disaggregated P/D", sub: "prefill and decode apart", col: 2, row: 0 },
      { id: "quantization", label: "Quantization", sub: "fewer bits per weight", col: 2, row: 1 },
      { id: "roofline", label: "GPU and roofline", sub: "compute or memory bound", col: 2, row: 2 },
      { id: "parallelism", label: "Parallelism", sub: "tensor, pipeline, expert", col: 2, row: 3 }
    ],
    edges: [
      ["continuous-batching", "prefill-decode", "admits"], ["prefill-decode", "decode", "first token"],
      ["decode", "metrics", "measured as"], ["prefill-decode", "kv-cache", "writes"],
      ["prefix-caching", "kv-cache", "reuses"], ["kv-cache", "paged-attention", "stored as"],
      ["decode", "speculative-decoding", "fewer steps"], ["kv-cache", "disaggregation", "shipped between"],
      ["kv-cache", "quantization", "shrunk by"], ["quantization", "roofline", "fewer bytes"],
      ["roofline", "parallelism", "too big: split"]
    ],
    cap: "**A request's path down the left column, the memory it builds in the middle, the hardware answers on the right.** The scheduler admits requests into a running batch; prefill processes the prompt and writes the KV cache; decode reads that cache once per token until the answer ends. Each technique in the middle and right columns makes one of those steps cheaper."
  },
  start: [
    { label: "Philip Kiely, Inference Engineering (free PDF from Baseten): chapters 1 and 2, then 6", url: "https://www.baseten.co/inference-engineering/", m: 120, why: "The one book on the field, written from production practice." },
    { label: "learn-inference.com: the interactive companion to the book, by chapter", url: "https://learn-inference.com/", m: 60, why: "Simulators for batching, caching and quantization that you learn by turning a dial." },
    { label: "Karan, How to start learning inference engineering", url: "https://x.com/kmeanskaran/status/2097327050566852931", m: 7, why: "The map and the order to learn it in, in seven minutes." }
  ],
  clusters: [
    { name: "The basics", line: "What inference costs, where the time goes, and how to measure it.",
      topics: [
        { id: "what-is-inference", name: "What inference engineering is",
          line: "Maximise useful tokens per second, per GPU, per dollar, inside a latency budget.",
          body: [
            "Inference is running a trained model on new input. For a language model that means turning a prompt into output tokens, one at a time. The engineering problem has three numbers in tension: **latency** for each user, **throughput** across all users, and **cost** per million tokens. Batching more requests together raises throughput and lowers cost but slows each one; the job is finding the point that meets the product's latency target at the lowest cost.",
            "The levers sit at three levels. **Model**: a smaller or distilled model, quantized weights, a draft model for speculation. **Runtime**: the engine's batching, caching and kernels. **Infrastructure**: which GPUs, how many, in which region, and how fast they scale. A good inference engineer can estimate from first principles what the hardware should deliver, then find why it does not."
          ],
          uses: [
            "**Baseten, Together, Fireworks, Modal and Groq**: inference providers that sell fast, cheap serving of open and custom models as their product.",
            "**Frontier labs**: OpenAI, Anthropic and Google serve their own models to millions of users, where small efficiency gains save large sums.",
            "**Self-hosting companies**: run open-weight models on their own GPUs for cost at volume, data privacy, or a latency target an API cannot meet."
          ],
          example: "Say a chat product needs TTFT under 1 second and under 50 ms per token at p95. At batch 8 one GPU meets both at 400 tokens per second. At batch 64 it reaches 2,000 tokens per second but TPOT slips to 70 ms. The engineer picks batch 32, the largest that still meets the target, and the cost per million tokens falls with it.",
          nuance: "Useful tokens is the honest unit. A configuration with record throughput that misses the latency target, or a quantized model that answers worse, has not saved anything.",
          read: [{ label: "100 days of inference: days 1 to 10", url: "https://github.com/elizabetht/100-days-of-inference", m: 90 }],
          tags: ["latency", "throughput", "cost", "tokens per second"] },
        { id: "prefill-decode", name: "Prefill and decode",
          line: "Reading the prompt is compute-bound; writing the answer is memory-bound. Different bottlenecks.",
          body: [
            "Generation has two phases. **Prefill** processes the whole prompt in one forward pass: thousands of tokens multiplied against the weights at once, so the GPU's maths units are busy; it is **compute-bound**. It produces the first token and the KV cache. **Decode** then generates one token per forward pass. Each step must read every weight from GPU memory to produce a single token per sequence, so the maths units mostly wait on memory; it is **memory-bound**.",
            "A rough ceiling follows. An 8B-parameter model in 16-bit is about 16 GB; an H100 reads memory at about 3.35 TB/s; so one sequence decodes at most around 200 tokens per second. Batching helps because one read of the weights serves every sequence in the batch."
          ],
          uses: [
            "**Long-document RAG**: prompts of thousands of tokens and short answers make it prefill-heavy, so TTFT dominates.",
            "**Chat and agents**: long streamed answers make them decode-heavy, so tokens per second dominate.",
            "**vLLM and SGLang**: schedule the two phases differently, with chunked prefill so one long prompt does not stall other streams."
          ],
          example: "A 2,000-token prompt and a 300-token answer on an 8B model. Prefill runs all 2,000 tokens in one pass, on the order of 50 to 100 ms, and emits the first token. Decode then runs 299 more passes, each reading all 16 GB of weights; at the 200 tokens per second ceiling that is about 1.5 seconds. The answer, not the prompt, takes most of the time.",
          nuance: "Because the phases have different bottlenecks, running them on the same GPU makes them interfere: a big prefill stalls everyone's decode. Chunked prefill and disaggregation both exist to fix that.",
          read: [{ label: "Databricks, LLM inference performance engineering: best practices", url: "https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices", m: 25 }],
          tags: ["prefill", "decode", "compute-bound", "memory-bound", "autoregressive"] },
        { id: "kv-cache", name: "The KV cache and its memory maths",
          line: "Each token's keys and values, stored so attention never recomputes the past.",
          body: [
            "Attention needs the keys and values of every earlier token. Recomputing them each step would make generation quadratic, so the engine stores them: the **KV cache**. Its size per token is `2 (K and V) x layers x KV heads x head dim x bytes`. Llama 3 8B has 32 layers, 8 KV heads of dimension 128, in 16-bit: 2 x 32 x 8 x 128 x 2 = 128 KiB per token. An 8,000-token conversation needs about 1 GiB, per user.",
            "So the KV cache, not the weights, often decides how many requests fit on a GPU, and therefore throughput. Architectures shrink it: **grouped-query attention** shares KV heads across query heads (Llama 3 uses 8 KV heads for 32 query heads), and DeepSeek's multi-head latent attention compresses it further. Engines quantize it to FP8 and page it."
          ],
          uses: [
            "**vLLM and SGLang**: give the GPU memory left after the weights to the KV cache, which sets how many requests run at once.",
            "**Llama 3**: grouped-query attention with 8 KV heads for 32 query heads cuts the cache to a quarter of full multi-head attention.",
            "**DeepSeek-V3**: multi-head latent attention stores a compressed latent per token instead of full keys and values."
          ],
          example: "Llama 3 8B on an 80 GB H100: 16 GB of weights leaves about 60 GB for cache after overhead. At 128 KiB per token that is roughly 480,000 tokens, so sixty users with 8,000-token conversations fill it. Grow every conversation to 32,000 tokens and only fifteen fit, however fast the maths is.",
          nuance: "Long context is a memory problem before it is a compute problem. Doubling context length doubles KV memory per request and halves how many requests fit.",
          read: [{ label: "kipply, Transformer inference arithmetic: the KV cache and capacity sections", url: "https://kipp.ly/transformer-inference-arithmetic/", m: 30 }],
          tags: ["kv cache", "gqa", "mla", "memory", "context length"] },
        { id: "roofline", name: "GPUs and the roofline",
          line: "Whether a kernel is limited by maths speed or memory speed, from one ratio.",
          body: [
            "A GPU has two speed limits: how many operations per second it can compute, and how many bytes per second it can read from memory (HBM). The **roofline model** compares a workload's **arithmetic intensity**, operations per byte read, with the ratio of those two limits. An H100 does roughly 1,000 dense 16-bit TFLOPS against 3.35 TB/s, a ridge point near 300 operations per byte. Below it, memory bound; above it, compute bound.",
            "Decode at batch size 1 does about 2 operations per 2-byte weight, an intensity near 1, far below the ridge: the GPU is starved. Batching raises intensity, which is the whole case for it. Prefill sits well above the ridge. The same lens explains why quantization helps decode and FlashAttention helps attention: both cut bytes moved."
          ],
          uses: [
            "**NVIDIA H100, H200 and B200**: dominate serving; the H200 keeps the H100's compute but raises memory to 141 GB at 4.8 TB/s, which speeds decode.",
            "**AMD MI300X and MI355X**: compete on memory, 192 GB and 288 GB of HBM per GPU, so larger models and caches fit on fewer GPUs.",
            "**Nsight Compute**: NVIDIA's profiler places a kernel on the roofline, showing whether memory or compute limits it."
          ],
          example: "An 8B model decoding one sequence on an H100: each token reads 16 GB of weights and does about 16 GFLOPs, an intensity of 1. Memory allows about 200 tokens per second; compute alone would allow tens of thousands. At batch 64 one read serves 64 sequences: intensity near 64, still memory bound, but about 64 times the tokens per read.",
          nuance: "Spec-sheet numbers are peaks. Real kernels reach a fraction of them, and HBM capacity (80 GB against 141 or 192 GB) often matters more than FLOPS, because it decides how much KV cache fits.",
          read: [
            { label: "Modal GPU glossary: the roofline model", url: "https://modal.com/gpu-glossary/perf/roofline-model", m: 10 },
            { label: "Horace He, Making deep learning go brrrr from first principles", url: "https://horace.io/brrr_intro.html", m: 25 }
          ],
          tags: ["roofline", "arithmetic intensity", "hbm", "h100", "memory bandwidth"] },
        { id: "metrics", name: "Metrics: TTFT, TPOT and throughput",
          line: "Time to first token, time between tokens, and total tokens per second per GPU.",
          body: [
            "**Time to first token** (TTFT) is the wait before anything appears: queueing plus prefill. **Time per output token** (TPOT), also called **inter-token latency** (ITL), is the gap between streamed tokens after the first, set by decode. End-to-end latency is roughly TTFT plus output length times TPOT. **Throughput** is output tokens per second across all requests, per GPU or per replica; **goodput** counts only requests that met their latency targets.",
            "Which matters depends on the product. A voice agent lives on TTFT, since speech can start with the first words. A chat UI needs TPOT comfortably faster than reading: 50 ms per token, 20 tokens per second, already outpaces most readers. A batch summarisation job cares only about throughput and cost."
          ],
          uses: [
            "**Voice agents**: live on TTFT, because speech synthesis can start as soon as the first words arrive.",
            "**Chat interfaces**: need TPOT comfortably faster than reading speed, so the text never stalls.",
            "**Artificial Analysis**: publishes TTFT and output tokens per second for every major API, measured continuously."
          ],
          example: "A request with 500 output tokens, TTFT 400 ms and TPOT 25 ms: end to end is `0.4 + 500 x 0.025 = 12.9` seconds, yet the user sees text after 0.4. If the target is TTFT under 1 second and 30 of 1,000 requests in a minute miss it, goodput counts 970 requests, whatever the raw throughput says.",
          nuance: "Always quote percentiles under a stated load. A p50 TTFT at one request per second says nothing about p99 at the traffic you expect.",
          read: [{ label: "NVIDIA NIM docs: LLM benchmarking metrics", url: "https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html", m: 15 }],
          tags: ["ttft", "tpot", "itl", "throughput", "goodput", "latency"] },
        { id: "benchmarking", name: "Benchmarking honestly",
          line: "Load the server like real traffic, sweep concurrency, and report the latency-throughput curve.",
          body: [
            "A single number from a single request means little. A useful benchmark fixes the model, hardware and engine version, then replays a realistic mix of input and output lengths (a RAG workload with 4,000-token prompts and 200-token answers behaves nothing like chat), and sweeps the number of concurrent requests. The result is a curve: as concurrency rises, throughput climbs and latency worsens, until throughput flattens. The operating point is where latency still meets the target.",
            "Warm up first (CUDA graphs, caches), run long enough to reach steady state, and check output quality alongside speed, especially after quantization or speculative decoding changes."
          ],
          uses: [
            "**vLLM and SGLang benchmark scripts**: replay a dataset of prompts at a chosen request rate and report TTFT, TPOT and throughput.",
            "**AIPerf and GuideLLM**: load-test any OpenAI-compatible endpoint, sweeping concurrency to draw the latency and throughput curve.",
            "**MLPerf Inference**: the audited industry benchmark that hardware vendors publish results against."
          ],
          example: "Sweep concurrency 1, 8, 32, 64 and 128 on a RAG workload of 4,000-token prompts and 200-token answers. Say throughput climbs from 60 to 2,400 tokens per second and flattens past 64, while p99 TTFT stays under 800 ms until 32, then jumps to 3 seconds. With a 1-second target the operating point is 32 concurrent requests, not the peak.",
          nuance: "Benchmarks with random or repeated prompts flatter engines with prefix caching, and short outputs flatter prefill-heavy setups. Ask what traffic a published number assumed before comparing it with yours.",
          tags: ["benchmark", "load test", "concurrency", "latency curve", "mlperf"] }
      ] },
    { name: "Engines and scheduling", line: "The serving software: how it batches, stores and reuses work.",
      topics: [
        { id: "continuous-batching", name: "Static and continuous batching",
          line: "Swap finished requests out and new ones in at every step, not once per batch.",
          body: [
            "**Static batching** groups requests and runs them together until all finish. Answers have different lengths, so short ones sit idle while the longest completes, and new requests wait for the whole batch. **Continuous batching**, from the Orca paper (2022), schedules at the level of single decode steps: when a sequence finishes, its slot is filled by a waiting request on the next iteration. The GPU stays full and short requests leave early.",
            "Anyscale measured continuous batching at up to 23 times the throughput of naive batching when combined with vLLM's memory management, with lower median latency as well. Engines also use **chunked prefill**: split a long prompt into pieces mixed into decode steps, so one huge prompt does not freeze every other user's stream."
          ],
          uses: [
            "**vLLM and SGLang**: rebuild the batch at every decode step, adding waiting requests the moment a slot frees.",
            "**TensorRT-LLM**: NVIDIA's engine, which calls the same idea in-flight batching.",
            "**Hosted APIs**: the serving stacks behind OpenAI, Anthropic and Google batch continuously so one GPU serves many users at once."
          ],
          example: "A static batch of four answers of 20, 50, 80 and 400 tokens runs 400 steps, and the first slot sits idle for 380 of them while new requests queue. Continuous batching hands that slot to a waiting request at step 21, and does the same whenever any sequence finishes. Over the same 400 steps the GPU can finish a dozen requests instead of four.",
          nuance: "Bigger batches always trade per-request latency for throughput. The scheduler's limits (maximum batch size, maximum tokens per step) are the dial that sets where on that curve you sit.",
          read: [{ label: "Anyscale, How continuous batching enables 23x throughput in LLM inference", url: "https://www.anyscale.com/blog/continuous-batching-llm-inference", m: 20 }],
          tags: ["continuous batching", "orca", "in-flight batching", "chunked prefill", "scheduler"] },
        { id: "paged-attention", name: "PagedAttention and vLLM",
          line: "Store the KV cache in fixed-size pages, like virtual memory, so none is wasted.",
          body: [
            "Early engines reserved one contiguous block of KV memory per request, sized for the longest possible output. Most of it sat empty, and fragmentation wasted the rest, so few requests fit. **PagedAttention** borrows the operating system's answer: split the KV cache into small fixed-size blocks, keep a block table per sequence mapping logical positions to physical blocks, and allocate blocks only as tokens are generated. Waste falls to near zero, and sequences can share blocks (for a common prompt prefix or parallel samples) with copy on write.",
            "The paper reported 2 to 4 times the throughput of earlier systems at the same latency. **vLLM**, the engine built around it at UC Berkeley, is now one of the most widely used open-source LLM servers."
          ],
          uses: [
            "**vLLM**: the open-source engine from UC Berkeley built around PagedAttention, now shipped by Red Hat, IBM and cloud providers.",
            "**SGLang and TensorRT-LLM**: both adopted paged KV caches as standard.",
            "**Parallel sampling**: several answers to one prompt share the prompt's blocks instead of copying them."
          ],
          example: "Blocks hold 16 tokens. A request with a 1,000-token prompt gets 63 blocks, and takes a new one every 16 generated tokens. Finishing at 1,300 tokens it holds 82 blocks, wasting 12 slots. The old way reserved room for the prompt plus a 4,000-token maximum output: 5,000 slots, of which 3,700 sat empty.",
          nuance: "Paging fixes waste, not size. A long-context workload still needs the full KV memory; PagedAttention lets you use all of the GPU, not more than it has.",
          read: [{ label: "vLLM paper (Kwon et al.): Efficient memory management for LLM serving with PagedAttention", url: "https://arxiv.org/abs/2309.06180", m: 30 }],
          tags: ["pagedattention", "vllm", "block table", "fragmentation"] },
        { id: "prefix-caching", name: "SGLang and prefix caching",
          line: "Keep the KV cache of shared prompt prefixes and reuse it across requests.",
          body: [
            "Many requests start the same way: one system prompt, the same tool definitions, a shared document, or a growing conversation whose earlier turns were already processed. **Prefix caching** keeps the KV cache of those tokens after a request ends and reuses it when a new request starts with the same tokens, skipping their prefill. TTFT and compute drop sharply for agents and multi-turn chat.",
            "**SGLang** (from the LMSYS group) built its runtime around this with **RadixAttention**, which stores cached prefixes in a radix tree and evicts least-recently-used branches; its paper reported up to 6.4 times the throughput of earlier systems on workloads with structure to reuse. vLLM has automatic prefix caching too. Across many replicas, the router must send a request to the replica that already holds its prefix (KV-aware routing)."
          ],
          uses: [
            "**SGLang**: RadixAttention keeps cached prefixes in a radix tree; a common choice for serving DeepSeek and other large mixture-of-experts models.",
            "**vLLM**: automatic prefix caching hashes KV blocks so any request with a matching prefix reuses them.",
            "**Anthropic, OpenAI and Google APIs**: prompt caching is the same idea, sold as a discount on cached input tokens."
          ],
          example: "An agent sends a 6,000-token system prompt and tool list, then 500 new tokens each turn. Without prefix caching every turn prefills 6,500 tokens. With it, from turn two only the new 500 are prefilled, and TTFT falls by roughly that factor. Put today's date in the first line of the system prompt and every turn misses.",
          nuance: "A cache hit needs an exact token prefix. Put stable content first and anything that changes per request (a timestamp, a user name) last, or the cache never hits.",
          read: [{ label: "SGLang paper: Efficient execution of structured language model programs", url: "https://arxiv.org/abs/2312.07104", m: 30 }],
          tags: ["sglang", "radixattention", "prefix caching", "kv reuse", "kv-aware routing"] },
        { id: "engines", name: "TensorRT-LLM, llama.cpp and choosing an engine",
          line: "Which serving engine fits which hardware, scale and team.",
          body: [
            "**vLLM** and **SGLang** are the open, Python-first defaults for GPU serving: fast, broad model support, OpenAI-compatible APIs. **TensorRT-LLM** is NVIDIA's engine, with hand-tuned kernels, FP8 and FP4 support and in-flight batching; it often wins on NVIDIA hardware at the price of more setup. **llama.cpp** is a C/C++ engine with few dependencies that runs quantized models (GGUF files, 2 to 8 bits) on CPUs, Apple silicon and consumer GPUs; Ollama and LM Studio build on it for local use.",
            "Above the engines sit orchestration layers. **NVIDIA Dynamo** coordinates vLLM, SGLang or TensorRT-LLM workers across nodes with disaggregated serving and KV-aware routing; **llm-d** does similar work on Kubernetes."
          ],
          uses: [
            "**vLLM and SGLang**: Python-first defaults for GPU serving with OpenAI-compatible APIs, run by many inference providers.",
            "**TensorRT-LLM**: NVIDIA's engine with hand-tuned kernels and FP8 and FP4 support, often fastest on NVIDIA GPUs.",
            "**llama.cpp, Ollama and LM Studio**: run GGUF-quantized models on laptops, Apple silicon and consumer GPUs.",
            "**NVIDIA Dynamo and llm-d**: orchestrate engine workers across nodes with disaggregation and KV-aware routing."
          ],
          example: "Three settings, three choices. A startup serving Llama on rented H100s starts with vLLM: one command, an OpenAI-compatible API. A provider squeezing cost on a fixed NVIDIA fleet tries TensorRT-LLM and keeps it only if it wins on their own traffic. A developer working offline runs a 4-bit GGUF model in Ollama on a MacBook.",
          nuance: "Benchmark the engine on your model and traffic; rankings flip between versions and workloads. Engine releases ship every few weeks, and a version bump can matter more than a config change.",
          read: [
            { label: "TensorRT-LLM repository: overview and feature list", url: "https://github.com/NVIDIA/TensorRT-LLM", m: 10 },
            { label: "llama.cpp repository: description and supported backends", url: "https://github.com/ggml-org/llama.cpp", m: 10 }
          ],
          tags: ["tensorrt-llm", "llama.cpp", "gguf", "ollama", "dynamo", "vllm", "sglang"] }
      ] },
    { name: "Making it faster", line: "Fewer bytes, fewer steps, and better kernels.",
      topics: [
        { id: "quantization", name: "Quantization",
          line: "Store weights, and sometimes activations and KV cache, in fewer bits.",
          body: [
            "Quantization maps 16-bit numbers to 8, 4 or fewer bits with a scale factor per group of values. **Weight-only** quantization (INT4 with GPTQ or AWQ, which protects the small share of weights that matter most) shrinks the model and speeds memory-bound decode, since fewer bytes are read per token; the maths still runs in 16-bit. **Weights and activations** in FP8 (Hopper GPUs) or FP4 (Blackwell's NVFP4) also use faster tensor cores, so prefill speeds up too. **KV cache** quantization to FP8 doubles how many tokens fit."
          ],
          uses: [
            "**FP8 on H100s**: routine for serving large models; DeepSeek-V3 and many open models ship official FP8 weights.",
            "**AWQ and GPTQ**: INT4 weight-only methods behind many 4-bit checkpoints on Hugging Face, served by vLLM and SGLang.",
            "**llama.cpp GGUF**: quantization levels from 2 to 8 bits are how models run on laptops and phones."
          ],
          example: "Llama 3 70B in 16-bit is 140 GB: two 80 GB GPUs before any KV cache. At FP8 it is 70 GB; at 4-bit about 35 GB, leaving 40 GB of one 80 GB GPU for cache. Decode then reads a quarter of the bytes, so at small batch it can run up to roughly four times faster, if quality on your eval holds.",
          nuance: "Know what it fixes. Weight-only INT4 helps decode at small batch and does little for compute-bound prefill. Quality loss is uneven: check your own task, especially maths, code and long context, not only perplexity.",
          read: [{ label: "AWQ paper: activation-aware weight quantization (abstract and figure 1)", url: "https://arxiv.org/abs/2306.00978", m: 15 }],
          tags: ["int8", "fp8", "int4", "nvfp4", "gptq", "awq", "gguf"] },
        { id: "speculative-decoding", name: "Speculative decoding",
          line: "A cheap draft guesses several tokens; the big model checks them all in one pass.",
          body: [
            "Decode is memory-bound, so the big model has spare compute at each step. **Speculative decoding** uses it: a small draft model (or extra heads on the big one) proposes the next few tokens, then the big model scores all of them in a single forward pass, accepting the longest prefix it agrees with. A rejection-sampling rule makes the output distribution identical to the big model's alone. When drafts are usually right, each expensive pass yields several tokens.",
            "The original paper reported 2 to 3 times faster decoding; **EAGLE**, which drafts from the big model's own hidden features, reported 2.7 to 3.5 times on a 70B model. N-gram drafting, which copies likely continuations from the prompt, works well for editing and code."
          ],
          uses: [
            "**vLLM, SGLang and TensorRT-LLM**: support draft models, EAGLE heads and n-gram drafting.",
            "**Code editors**: use it for fast edits, where most of the output repeats the input and n-gram drafts are usually right.",
            "**DeepSeek-V3**: its multi-token prediction module can act as a built-in draft; the report puts acceptance of the extra token at 85 to 90%."
          ],
          example: "A draft model proposes `the cat sat on`. The big model scores all four positions in one pass and agrees with `the cat sat`, but would have said `in` where the draft said `on`. It keeps three tokens, adds its own `in`, and the next round starts from there. One expensive pass yielded four tokens instead of one.",
          nuance: "Speedup depends on how predictable the text is and on load. At large batch sizes the GPU is no longer idle, verification competes with real work, and the gain shrinks or disappears.",
          read: [
            { label: "Leviathan et al., Fast inference from transformers via speculative decoding: abstract and section 2", url: "https://arxiv.org/abs/2211.17192", m: 20 },
            { label: "EAGLE paper: abstract", url: "https://arxiv.org/abs/2401.15077", m: 10 }
          ],
          tags: ["speculative decoding", "draft model", "eagle", "medusa", "n-gram"] },
        { id: "attention-kernels", name: "Attention kernels and FlashAttention",
          line: "Compute attention in tiles held in fast on-chip memory, never writing the full matrix out.",
          body: [
            "Naive attention writes an n by n score matrix to GPU memory, reads it back for the softmax, and again to apply it. For long sequences that traffic, not the maths, is the cost. **FlashAttention** is an exact algorithm that splits queries, keys and values into tiles that fit in on-chip SRAM, computes softmax incrementally per tile, and never stores the full matrix. Memory use becomes linear in sequence length and speed rises several times.",
            "Later versions target newer GPUs (FlashAttention-3 for Hopper). Decode-time kernels such as FlashInfer and FlashMLA handle paged KV caches and batches of different lengths. Kernel work also includes fusing operations so data is read once, and capturing CUDA graphs to cut launch overhead at small batch."
          ],
          uses: [
            "**PyTorch**: `scaled_dot_product_attention` dispatches to FlashAttention kernels when the inputs allow.",
            "**FlashInfer and FlashMLA**: decode-time kernels for paged KV caches inside vLLM and SGLang; FlashMLA is DeepSeek's, for latent attention.",
            "**Triton**: OpenAI's Python-like language for writing GPU kernels, used for fused operations in many engines."
          ],
          example: "Sequence length 32,000 in 16-bit. Naive attention writes a score matrix of `32,000 x 32,000 x 2` bytes, about 2 GB per head per layer, then reads it back twice. FlashAttention loads 128 by 128 tiles into SRAM, keeps a running maximum and sum for the softmax, and writes only the output, so the 2 GB matrix never exists.",
          nuance: "FlashAttention changes how attention is computed, not what is computed: results match standard attention up to floating-point rounding. It saves memory traffic, not FLOPs.",
          read: [{ label: "FlashAttention paper (Dao et al.): abstract and figure 1", url: "https://arxiv.org/abs/2205.14135", m: 15 }],
          tags: ["flashattention", "kernels", "sram", "tiling", "cuda", "triton"] }
      ] },
    { name: "Scaling out and production", line: "Many GPUs, separate phases, changing traffic, and models that are not text.",
      topics: [
        { id: "parallelism", name: "Parallelism: tensor, pipeline, expert",
          line: "Split a model too big or too slow for one GPU across several.",
          body: [
            "**Tensor parallelism** splits each weight matrix across GPUs; every layer ends with an all-reduce to combine partial results. It cuts per-token latency but needs fast links (NVLink), so it usually stays inside one 8-GPU node. **Pipeline parallelism** gives each GPU a contiguous block of layers and passes activations along; it needs little bandwidth and can span nodes, but adds latency and idle bubbles. **Data parallelism** runs full copies behind a load balancer.",
            "**Expert parallelism** is for mixture-of-experts models, where each token uses only a few experts: place experts on different GPUs and route tokens to them. DeepSeek-V3 has 671B parameters but activates about 37B per token, so it is cheap to compute yet needs many GPUs to hold."
          ],
    uses: [
      "**70B dense models**: commonly served with tensor parallelism across 2 to 8 GPUs inside one NVLink node.",
      "**DeepSeek, Qwen and Kimi MoE models**: served with expert parallelism across nodes, each GPU holding a subset of experts.",
      "**Models too big for one node**: pipeline parallelism between nodes, tensor parallelism within each."
    ],
    example: "Llama 3 70B in 16-bit is 140 GB. Tensor parallelism across four 80 GB H100s gives each 35 GB of weights and about 45 GB for KV cache, with two all-reduces over NVLink per layer. Across eight GPUs per-token latency drops a little more but communication grows; two replicas of four often serve more users than one of eight.",
          nuance: "More GPUs per replica is not free speed. Communication grows with the split, so the best setup is often the smallest number of GPUs that fits the model and its KV cache, replicated.",
          read: [
            { label: "How to Scale Your Model: chapter 7, all about transformer inference", url: "https://jax-ml.github.io/scaling-book/", m: 60 },
            { label: "wafer on Efficiently Scaling Transformer Inference: the partitioning trade-offs (advanced)", url: "https://x.com/wafer_ai/status/2105092095786762676", m: 6 }
          ],
          tags: ["tensor parallel", "pipeline parallel", "expert parallel", "moe", "nvlink"] },
        { id: "disaggregation", name: "Disaggregated prefill and decode",
          line: "Run prefill and decode on separate GPU pools, and ship the KV cache between them.",
          body: [
            "Prefill is compute-bound and bursty; decode is memory-bound and steady. On shared GPUs a long prefill stalls every decode in the batch, and one setting cannot suit both. **Disaggregation** splits them: prefill workers process prompts and transfer the resulting KV cache over a fast interconnect to decode workers, which generate. Each pool scales, batches and parallelises independently against its own target, TTFT for prefill and TPOT for decode.",
            "DistServe (2024) reported serving up to 7.4 times more requests within latency targets. The cost is moving the KV cache, which needs fast networking such as InfiniBand or NVLink and a router that knows where caches live."
          ],
          uses: [
            "**Mooncake at Moonshot AI**: serves Kimi on a KV-cache-centred design with separate prefill and decode clusters.",
            "**DeepSeek**: describes separate prefill and decode deployments, each with its own parallelism, for serving V3.",
            "**NVIDIA Dynamo and llm-d**: orchestrate disaggregated vLLM, SGLang or TensorRT-LLM workers with KV transfer and routing."
          ],
          example: "A RAG service takes 8,000-token prompts and writes 300-token answers. Two prefill GPUs run large compute-bound batches and keep TTFT under 500 ms. Each finished prompt's KV cache, about 1 GB on an 8B model, moves over InfiniBand to one of six decode GPUs tuned for steady TPOT. A burst of long prompts now slows the prefill pool, not everyone's stream.",
          nuance: "It pays at scale with long prompts and strict latency targets. For a small deployment, chunked prefill on shared GPUs gets much of the benefit with none of the transfer machinery.",
          read: [{ label: "DistServe paper: disaggregating prefill and decoding (abstract and figure 1)", url: "https://arxiv.org/abs/2401.09670", m: 15 }],
          tags: ["disaggregation", "dynamo", "kv transfer", "distserve", "mooncake"] },
        { id: "autoscaling", name: "Autoscaling and cold starts",
          line: "Add GPUs before the queue backs up, because a new replica takes minutes to start.",
          body: [
            "A new LLM replica must get a GPU node, pull a container, load tens to hundreds of gigabytes of weights into GPU memory, and warm up (CUDA graphs, compilation). That **cold start** commonly takes a minute to several minutes, so you cannot scale up reactively once latency is already bad. Scale on a leading signal such as in-flight requests or queue depth per replica, not GPU utilisation, which can read busy while the queue is fine or moderate while it overflows. Scale up fast and down slowly to avoid repeated cold starts.",
            "Cold starts shrink with weights cached on local NVMe, streaming weights straight to the GPU, smaller images, and snapshots of a warmed process."
          ],
          uses: [
            "**Modal, Baseten and Replicate**: serverless GPU platforms that compete on cold-start time and scale to zero.",
            "**KEDA and Knative on Kubernetes**: scale replicas on queue depth or in-flight requests instead of CPU.",
            "**Run:ai Model Streamer**: NVIDIA's open loader that streams weights from storage into GPU memory concurrently, shortening cold starts."
          ],
          example: "Traffic doubles at 9am. Each replica handles 20 concurrent requests, and the rule adds one at 15 in flight. A new replica takes 3 minutes: 40 seconds for a node, 30 to pull the image, 90 to load 140 GB of weights, 20 to warm up. A rule on GPU utilisation would fire only once queues were long; queue depth fires minutes earlier.",
          nuance: "Scale to zero saves money and costs a cold start on the next request. For anything user-facing, keep a warm minimum and budget for it.",
          read: [
            { label: "Together AI, Autoscaling endpoints for LLM inference", url: "https://www.together.ai/blog/autoscaling-endpoints-for-llm-inference", m: 15 },
            { label: "NVIDIA, Reducing cold start latency with the Run:ai Model Streamer", url: "https://developer.nvidia.com/blog/reducing-cold-start-latency-for-llm-inference-with-nvidia-runai-model-streamer", m: 15 }
          ],
          tags: ["autoscaling", "cold start", "scale to zero", "kubernetes", "keda"] },
        { id: "modalities", name: "Serving speech and other modalities",
          line: "Speech, images and embeddings have different bottlenecks from text generation.",
          body: [
            "**Speech to text** models like Whisper are encoder-decoder: the encoder processes audio in 30-second windows (compute-bound, like prefill), then a small decoder writes text. Streaming recognition processes short chunks as they arrive. **Text to speech** often generates audio tokens autoregressively, so it inherits decode's memory-bound profile; what matters is time to first audio byte and real-time factor (seconds of compute per second of audio, which must stay well under 1). **Image diffusion** runs the same network for 20 to 50 denoising steps and is compute-bound. **Embedding** models are prefill only, with no decode at all.",
            "In a voice agent these chain together (speech recognition, an LLM, speech synthesis), so latency adds up and every stage must stream."
          ],
          uses: [
            "**LiveKit, Pipecat and Vapi**: voice agent platforms that chain streaming speech recognition, an LLM and speech synthesis.",
            "**Deepgram, Cartesia and ElevenLabs**: speech model providers competing on time to first audio and real-time factor.",
            "**Embedding APIs**: prefill-only workloads, batched heavily because there is no decode to wait on."
          ],
          example: "One voice agent turn: the user stops speaking, turn detection waits 200 ms, streaming recognition finalises in 100 ms, the LLM's TTFT is 300 ms, and synthesis produces first audio in 150 ms. That is 750 ms before the caller hears anything, so each stage must stream into the next instead of waiting for it to finish.",
          nuance: "Batching is harder for audio streams: each user produces audio in real time, so you trade per-stream latency against GPU efficiency differently than for text.",
          read: [{ label: "Kiely, Inference Engineering: chapter 6, modalities", url: "https://www.baseten.co/inference-engineering/", m: 40 }],
          tags: ["speech", "asr", "tts", "whisper", "diffusion", "embeddings", "voice agents"] }
      ] }
  ],
  see: [
    { label: "Coding primer: serving", href: "CODING.html#serving" },
    { label: "System design guide: token streaming", href: "SYSTEM%20DESIGN.html#/patterns/llm-cost/streaming" }
  ]
});
