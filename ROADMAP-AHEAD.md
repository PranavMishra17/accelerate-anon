# Roadmap ahead

Detail decays with distance on purpose. Milestone 2 is intent without a schedule.
Milestone 3 is a sketch. Everything after is a parked list.

At the end of each milestone this file gets rewritten: the next one is detailed out
into its own file, the one after is promoted to planned, and a new sketch appears at
the back. Check every rewrite against `CHARTER.md` and record deviations in
`CHANGELOG.md`.

---

## Milestone 2 — Mechanism · planned, not scheduled

Roughly six to seven weeks. Likely late October to mid December, though that is a
guess and the gate decides.

**The capability:** machine learning stops being metaphor. You can derive rather
than describe. And you can write PyTorch without guessing what a line does.

**TrenTorch is the spine.** Roughly twenty hours, and it works precisely because it
makes you build the thing rather than read about it — tensors, autograd, modules,
the training loop. Milestone 1's mathematics is what makes this affordable: going in
with the chain rule and matrix shapes already in hand is the difference between
learning PyTorch and fighting it.

**Alongside it, the mechanism questions get answered properly.** What an embedding
is at the level of weights. Why attention scales by the square root of `d_k`. What
batch normalisation actually does — you picked one of its two real effects on
14 September and there were two. Why cross-entropy's gradient survives saturation
when squared error's does not.

**DSA foundation begins here.** Not random LeetCode. Patterns from zero: arrays and
two pointers first, because the sorted-array question you missed is exactly that
pattern; then hashing, binary search, recursion and trees — maximum depth of a binary
tree came back blank and it is the gateway to every tree problem — then BFS and DFS,
then a first look at dynamic programming. Requeued Q18 and Q20 clear here. The material
is `CODING.html`: Core, then Structures, then Techniques. Requeued Q17 to Q20 map to
`#pointers`, `#hashing`, `#trees` and the Start tab's `#bigo`.

**Systems drops to one drill a week** so it does not rot. One scaling question,
answered out loud, fifteen minutes.

**Alaap** opens up: Part 1's exit checklist becomes checkable because TrenTorch
covers it, and Part 3 on speaker identity becomes readable because the mathematics
is there. The three navigability papers are the intellectual core of the project and
the reward for the work of milestone 1.

**The sequence** lives in `ALAAP.html`, the Alaap and TrenTorch plan: stages 3 to 15 are this
milestone, TrenTorch modules 01 to 13 interleaved with Alaap's Part 1, the rest of Part 2,
and Part 3. As sequenced it is about 40 hours, twice the twenty for TrenTorch alone, so
the re-plan that details this milestone decides what moves to milestone 3.

**Gate:** a timed quiz plus something built. Probably a small network trained from
scratch in PyTorch on something trivial, with you able to explain every line and
what the gradients are doing.

---

## Milestone 3 — Training · sketch

Roughly eight weeks. Somewhere in the first quarter of 2027.

Alaap becomes the from-scratch artifact rather than an assembly of other people's
models. You train something. Mathematics becomes applied rather than studied — MDNs,
per-dimension rescaling, the actual loss functions, understood as mathematics
because by then they are. Alaap's Parts 4 through 6 become readable: codecs, flow
matching, and the evaluation traps, which is the part of that project with the
highest ratio of hard-won knowledge to published literature.

In the plan these are stages 16 to 21, including TrenTorch's optimisation modules 14 to
19, which are the skills Alaap's blocked platform track needs, and its capstone.

DSA moves to maintenance, two problems a week, permanently.

The second artifact starts taking shape here: the open-source tool extracted from
the production agent work. Eval harness, decision layer or memory system, generalised out of
the product and made usable by strangers.

---

## Beyond · parked, not scheduled

Named so they stop being background anxiety. Nothing here has a date.

- **The open-source tool**, finished and actually used by someone who is not you.
- **The India move.** Companies worth targeting, what each interviews on, and when
  applications should start. This becomes a real workstream once milestones 2 and 3
  have landed, not before.
- **Space and defence.** A genuine interest, newly viable as a sector, and entirely
  unexamined. At some point it deserves a week of proper research rather than a
  recurring daydream.
- **Writing.** The film criticism, the screenwriting. Tracked in the life strip as a
  binary, never planned, never assigned a target.
- **Inference engineering, and the backend and cloud underneath it.** After the deep
  learning and PyTorch track, when the mathematics and the model internals are solid.
  Learn it by doing: take a small open model, preferably a voice one, host it yourself,
  batch it, quantize it, and measure time to first token, time per token and throughput
  as each knob moves. Alongside it, the fundamentals the serving sits on, in depth rather
  than definitions: processes and sockets, a job queue on Postgres, Docker, then
  Kubernetes, metrics and a load test. A sketch, about twenty weeks part-time:
  1. The mental model, 2 weeks. Prefill is bound by compute, decode by memory bandwidth;
     the KV cache and GPU memory worked by hand. Kiely's *Inference Engineering*
     (baseten.co/inference-engineering/book), kipply's inference arithmetic, the
     Anyscale post on continuous batching.
  2. Host and measure, 4 weeks. A small model on vLLM on a free or cheap GPU
     (Modal, Kaggle, Lightning), benchmarked with `vllm bench serve`, then the same
     model on SGLang or llama.cpp, compared.
  3. Backend core, alongside, 6 weeks. An HTTP server on raw sockets, a Postgres queue
     with `SKIP LOCKED` and retries, Docker; OSTEP's processes and concurrency, the
     transport and application layers of Kurose and Ross, DDIA's replication and
     transactions.
  4. Run it like production, 4 weeks. The model server on Kubernetes (minikube), metrics
     in Prometheus, a load test, autoscaling; the SRE book on SLOs and overload.
  5. Voice, 3 weeks. faster-whisper and Kokoro behind a streaming socket, with a latency
     budget per stage.
  6. Depth, after. The PagedAttention paper, speculative decoding, the roofline and
     inference chapters of *How to Scale Your Model*.

  Time to useful competence (can serve, benchmark and explain the trade-offs) is
  probably two to three months of this; kernels and multi-node serving are longer.
  Placement is decided at the re-plan after Milestone 3.
- **Systems depth beyond interview level.** Consensus, distributed transactions, the
  back half of DDIA. Only if it stays interesting.
