/* What to read and watch for each topic in the inference field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("inference", {
 "what-is-inference": [
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
 "benchmarking": [],
 "continuous-batching": [
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
