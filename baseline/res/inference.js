/* What to read and watch for each topic in the inference field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("inference", {
 "what-is-inference": [
  {
   "kind": "video",
   "req": true,
   "label": "Why Inference is hard..",
   "url": "https://www.youtube.com/watch?v=B18zBnjZKmc",
   "m": 16,
   "yt": {
    "id": "B18zBnjZKmc",
    "ch": "Caleb Writes Code"
   },
   "why": "Why serving a language model is hard: memory, batching and the latency trade."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Mastering LLM Inference Optimization From Theory to Cost Effective Deployment: Mark Moyou",
   "url": "https://www.youtube.com/watch?v=9tvJ_GYJA-o",
   "m": 34,
   "yt": {
    "id": "9tvJ_GYJA-o",
    "ch": "AI Engineer"
   },
   "why": "The whole optimisation map from a practitioner; skim for the cost and latency framing."
  },
  {
   "kind": "keep",
   "src": "roadmap",
   "req": true,
   "label": "100 days of inference: days 1 to 10",
   "m": 90,
   "why": "A daily path through the whole field.",
   "url": "https://github.com/elizabetht/100-days-of-inference"
  }
 ],
 "prefill-decode": [
  {
   "kind": "video",
   "req": true,
   "label": "LLM Inference Explained: Prefill vs Decode and Why Latency Matters",
   "url": "https://www.youtube.com/watch?v=HRKFa8LIAQg",
   "m": 15,
   "yt": {
    "id": "HRKFa8LIAQg",
    "ch": "Ready Tensor"
   },
   "why": "Prefill and decode as two phases with different bottlenecks, and what each does to latency."
  },
  {
   "kind": "video",
   "req": false,
   "label": "AI Optimization Lecture 01 -  Prefill vs Decode - Mastering LLM Techniques from NVIDIA",
   "url": "https://www.youtube.com/watch?v=3SBUCJzogj4",
   "m": 18,
   "yt": {
    "id": "3SBUCJzogj4",
    "ch": "Faradawn Yang"
   },
   "why": "A lecture on the same split, with the arithmetic behind compute-bound against memory-bound."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Databricks, LLM inference performance engineering: best practices",
   "url": "https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices",
   "m": 25,
   "why": "Prefill, decode and the metrics that follow from them."
  }
 ],
 "kv-cache": [
  {
   "kind": "video",
   "req": true,
   "label": "The KV Cache: Memory Usage in Transformers",
   "url": "https://www.youtube.com/watch?v=80bIUggRJf4",
   "m": 9,
   "yt": {
    "id": "80bIUggRJf4",
    "ch": "Efficient NLP"
   },
   "why": "What the cache holds and why it grows with context."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How KV Cache Speeds Up LLMs for Faster AI Models on GPUs",
   "url": "https://www.youtube.com/watch?v=o0gkdZBtwEg",
   "m": 12,
   "yt": {
    "id": "o0gkdZBtwEg",
    "ch": "IBM Technology and Red Hat"
   },
   "why": "How the cache cuts recomputation and where it sits in GPU memory."
  },
  {
   "kind": "read",
   "req": true,
   "label": "kipply, Transformer inference arithmetic: the KV cache and capacity sections",
   "url": "https://kipp.ly/transformer-inference-arithmetic/",
   "m": 30,
   "why": "The arithmetic: bytes per token and how many fit."
  }
 ],
 "roofline": [
  {
   "kind": "video",
   "req": true,
   "label": "A very short intro to the Roofline model",
   "url": "https://www.youtube.com/watch?v=IrkNZG8MJ64",
   "m": 19,
   "yt": {
    "id": "IrkNZG8MJ64",
    "ch": "NHR@FAU"
   },
   "why": "The roofline model drawn out: arithmetic intensity against the two ceilings."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LLM Inference Lecture: Roofline Analysis for GPU (arithmetic intensity, compute and memory bound)",
   "url": "https://www.youtube.com/watch?v=7EJjdDLK4cg",
   "m": 24,
   "yt": {
    "id": "7EJjdDLK4cg",
    "ch": "Faradawn Yang"
   },
   "why": "The same analysis applied to LLM inference, to see why decode is memory-bound."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Modal GPU glossary: the roofline model",
   "url": "https://modal.com/gpu-glossary/perf/roofline-model",
   "m": 10,
   "why": "The roofline in a page, with the GPU terms defined."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Horace He, Making deep learning go brrrr from first principles",
   "url": "https://horace.io/brrr_intro.html",
   "m": 25,
   "why": "Compute, memory and overhead on a real model."
  }
 ],
 "metrics": [
  {
   "kind": "read",
   "req": true,
   "label": "NVIDIA NIM docs: LLM benchmarking metrics",
   "url": "https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html",
   "m": 15,
   "why": "TTFT, inter-token latency and throughput defined exactly."
  }
 ],
 "benchmarking": [
  {
   "kind": "video",
   "req": true,
   "label": "Exploring the Latency/Throughput & Cost Space for LLM Inference // Timothée Lacroix // CTO Mistral",
   "url": "https://www.youtube.com/watch?v=mYRqvB1_gRk",
   "m": 31,
   "yt": {
    "id": "mYRqvB1_gRk",
    "ch": "AAIF Live"
   },
   "why": "The latency, throughput and cost space for serving, from an inference provider's CTO."
  }
 ],
 "continuous-batching": [
  {
   "kind": "video",
   "req": true,
   "label": "Continuous Batching - How LLM Servers Keep the GPU Full",
   "url": "https://www.youtube.com/watch?v=X8CwAqYxH1E",
   "m": 5,
   "yt": {
    "id": "X8CwAqYxH1E",
    "ch": "DataMListic"
   },
   "why": "Why swapping requests per step keeps the GPU full."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How to Scale LLM Applications With Continuous Batching!",
   "url": "https://www.youtube.com/watch?v=PqHVpvvHLpE",
   "m": 7,
   "yt": {
    "id": "PqHVpvvHLpE",
    "ch": "The ML Tech Lead!"
   },
   "why": "Continuous batching walked through for scaling an LLM application."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Anyscale, How continuous batching enables 23x throughput in LLM inference",
   "url": "https://www.anyscale.com/blog/continuous-batching-llm-inference",
   "m": 20,
   "why": "Why swapping requests per step multiplies throughput."
  }
 ],
 "paged-attention": [
  {
   "kind": "video",
   "req": true,
   "label": "PagedAttention: Behind vLLM's Insane Speed",
   "url": "https://www.youtube.com/watch?v=6uPnLkCiy5g",
   "m": 7,
   "yt": {
    "id": "6uPnLkCiy5g",
    "ch": "Tales Of Tensors"
   },
   "why": "How paging the KV cache removes fragmentation and waste."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Fast LLM Serving with vLLM and PagedAttention",
   "url": "https://www.youtube.com/watch?v=5ZlavKF_98U",
   "m": 33,
   "yt": {
    "id": "5ZlavKF_98U",
    "ch": "Anyscale"
   },
   "why": "The vLLM and PagedAttention talk; watch the first part on the memory problem."
  },
  {
   "kind": "read",
   "req": true,
   "label": "vLLM paper (Kwon et al.): Efficient memory management for LLM serving with PagedAttention",
   "url": "https://arxiv.org/abs/2309.06180",
   "m": 30,
   "why": "Paging the KV cache; read the abstract and figures."
  }
 ],
 "prefix-caching": [
  {
   "kind": "video",
   "req": true,
   "label": "What is Prompt Caching? Optimize LLM Latency with AI Transformers",
   "url": "https://www.youtube.com/watch?v=u57EnkQaUTY",
   "m": 10,
   "yt": {
    "id": "u57EnkQaUTY",
    "ch": "IBM Technology"
   },
   "why": "Reusing the cached prefix across requests and what it saves in latency and cost."
  },
  {
   "kind": "read",
   "req": true,
   "label": "SGLang paper: Efficient execution of structured language model programs",
   "url": "https://arxiv.org/abs/2312.07104",
   "m": 30,
   "why": "RadixAttention and reusing shared prefixes."
  }
 ],
 "engines": [
  {
   "kind": "video",
   "req": true,
   "label": "Why so many inference engines..?",
   "url": "https://www.youtube.com/watch?v=_xM8scs4_x4",
   "m": 11,
   "yt": {
    "id": "_xM8scs4_x4",
    "ch": "Caleb Writes Code"
   },
   "why": "Why there are so many inference engines and what each one is built for."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Llama.cpp vs vLLM: Which Local LLM Engine Actually Scales?",
   "url": "https://www.youtube.com/watch?v=0ujh7hfutq0",
   "m": 11,
   "yt": {
    "id": "0ujh7hfutq0",
    "ch": "IBM Technology"
   },
   "why": "llama.cpp against vLLM: where each one scales and where it does not."
  },
  {
   "kind": "read",
   "req": true,
   "label": "TensorRT-LLM repository: overview and feature list",
   "url": "https://github.com/NVIDIA/TensorRT-LLM",
   "m": 10,
   "why": "What NVIDIA's engine optimises for."
  },
  {
   "kind": "read",
   "req": false,
   "label": "llama.cpp repository: description and supported backends",
   "url": "https://github.com/ggml-org/llama.cpp",
   "m": 10,
   "why": "The same job on CPUs and small GPUs."
  }
 ],
 "quantization": [
  {
   "kind": "video",
   "req": true,
   "label": "How LLMs survive in low precision | Quantization Fundamentals",
   "url": "https://www.youtube.com/watch?v=qoQJq5UwV1c",
   "m": 21,
   "yt": {
    "id": "qoQJq5UwV1c",
    "ch": "Julia Turc"
   },
   "why": "How weights are mapped to fewer bits and where accuracy is lost."
  },
  {
   "kind": "video",
   "req": false,
   "label": "AWQ for LLM Quantization",
   "url": "https://www.youtube.com/watch?v=3dYLj9vjfA0",
   "m": 21,
   "yt": {
    "id": "3dYLj9vjfA0",
    "ch": "MIT HAN Lab"
   },
   "why": "AWQ from its authors: protecting the salient weights."
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWQ paper: activation-aware weight quantization (abstract and figure 1)",
   "url": "https://arxiv.org/abs/2306.00978",
   "m": 15,
   "why": "Why protecting a few salient weights keeps accuracy."
  }
 ],
 "speculative-decoding": [
  {
   "kind": "video",
   "req": true,
   "label": "Faster LLMs: Accelerate Inference with Speculative Decoding",
   "url": "https://www.youtube.com/watch?v=VkWlLSTdHs8",
   "m": 10,
   "yt": {
    "id": "VkWlLSTdHs8",
    "ch": "IBM Technology"
   },
   "why": "A draft model proposes tokens and the big model verifies them in one pass."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Speculative Decoding: When Two LLMs are Faster than One",
   "url": "https://www.youtube.com/watch?v=S-8yr_RibJ4",
   "m": 13,
   "yt": {
    "id": "S-8yr_RibJ4",
    "ch": "Efficient NLP"
   },
   "why": "Why two models can be faster than one with the same output distribution."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Leviathan et al., Fast inference from transformers via speculative decoding: abstract and section 2",
   "url": "https://arxiv.org/abs/2211.17192",
   "m": 20,
   "why": "Draft, verify in one pass, same output distribution."
  },
  {
   "kind": "read",
   "req": false,
   "label": "EAGLE paper: abstract",
   "url": "https://arxiv.org/abs/2401.15077",
   "m": 10,
   "why": "A drafter that works on features."
  }
 ],
 "attention-kernels": [
  {
   "kind": "video",
   "req": true,
   "label": "How FlashAttention Accelerates Generative AI Revolution",
   "url": "https://www.youtube.com/watch?v=gBMO1JZav44",
   "m": 12,
   "yt": {
    "id": "gBMO1JZav44",
    "ch": "Jia-Bin Huang"
   },
   "why": "Tiling attention in on-chip memory so the full matrix is never written out."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Flash Attention Runs Softmax One Tile at a Time",
   "url": "https://www.youtube.com/watch?v=CX1WtsdMFh8",
   "m": 15,
   "yt": {
    "id": "CX1WtsdMFh8",
    "ch": "DataMListic"
   },
   "why": "The online softmax trick that makes tiling exact."
  },
  {
   "kind": "read",
   "req": true,
   "label": "FlashAttention paper (Dao et al.): abstract and figure 1",
   "url": "https://arxiv.org/abs/2205.14135",
   "m": 15,
   "why": "Tiling attention so the full matrix never leaves the chip."
  }
 ],
 "parallelism": [
  {
   "kind": "video",
   "req": true,
   "label": "How LLMs use multiple GPUs",
   "url": "https://www.youtube.com/watch?v=4i76hmmnJEo",
   "m": 13,
   "yt": {
    "id": "4i76hmmnJEo",
    "ch": "Simon Oz"
   },
   "why": "How a model is split across GPUs and what the split costs in communication."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LLM Inference Optimization: Tensor, Data & Expert Parallelism (TP, DP, EP, MoE)",
   "url": "https://www.youtube.com/watch?v=DdmgD5RMe1U",
   "m": 21,
   "yt": {
    "id": "DdmgD5RMe1U",
    "ch": "Faradawn Yang"
   },
   "why": "Tensor, data and expert parallelism side by side for inference."
  },
  {
   "kind": "read",
   "req": true,
   "label": "How to Scale Your Model: chapter 7, all about transformer inference",
   "url": "https://jax-ml.github.io/scaling-book/",
   "m": 60,
   "why": "Chapter on inference: how to split a model and what each split costs."
  }
 ],
 "disaggregation": [
  {
   "kind": "video",
   "req": true,
   "label": "OSDI '24 - DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language...",
   "url": "https://www.youtube.com/watch?v=WwJvecXOeUA",
   "m": 15,
   "yt": {
    "id": "WwJvecXOeUA",
    "ch": "USENIX"
   },
   "why": "DistServe from its authors: why prefill and decode interfere and how splitting them helps."
  },
  {
   "kind": "video",
   "req": false,
   "label": "DistServe: disaggregating prefill and decoding for goodput-optimized LLM inference",
   "url": "https://www.youtube.com/watch?v=Bh-jlh5vlF0",
   "m": 33,
   "yt": {
    "id": "Bh-jlh5vlF0",
    "ch": "PyTorch"
   },
   "why": "The longer DistServe talk with the goodput argument and results."
  },
  {
   "kind": "read",
   "req": true,
   "label": "DistServe paper: disaggregating prefill and decoding (abstract and figure 1)",
   "url": "https://arxiv.org/abs/2401.09670",
   "m": 15,
   "why": "Splitting prefill and decode onto separate GPUs."
  }
 ],
 "autoscaling": [
  {
   "kind": "video",
   "req": false,
   "label": "Kubernetes GPU Autoscaling: Why Scale to Zero Costs You 10 Minutes Per Request",
   "url": "https://www.youtube.com/watch?v=wwrPwU-JCMw",
   "m": 37,
   "yt": {
    "id": "wwrPwU-JCMw",
    "ch": "DevOps & AI Toolkit"
   },
   "why": "Why a new GPU replica takes minutes to serve and what scale to zero costs."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Together AI, Autoscaling endpoints for LLM inference",
   "url": "https://www.together.ai/blog/autoscaling-endpoints-for-llm-inference",
   "m": 15,
   "why": "What to scale on for LLM endpoints."
  },
  {
   "kind": "read",
   "req": false,
   "label": "NVIDIA, Reducing cold start latency with the Run:ai Model Streamer",
   "url": "https://developer.nvidia.com/blog/reducing-cold-start-latency-for-llm-inference-with-nvidia-runai-model-streamer",
   "m": 15,
   "why": "Streaming weights to cut cold start."
  }
 ],
 "modalities": [
  {
   "kind": "keep",
   "src": "book",
   "req": true,
   "label": "Kiely, Inference Engineering: ch. 6 Modalities",
   "m": 40,
   "why": "Where speech and image models differ from text.",
   "book": "Kiely, Inference Engineering: ch. 6 Modalities"
  }
 ]
});
