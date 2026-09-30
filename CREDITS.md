# Credits

The public pages draw on the work below. Every link was checked when this list was written.

## Frameworks and ideas

- [System Design in a Hurry: Delivery Framework](https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery), Hello Interview. The system design guide's six steps and their timings follow it; the guide's footer says so.
- [System Design in a Hurry: common patterns](https://www.hellointerview.com/learn/system-design/in-a-hurry/patterns), Hello Interview. The groups under Core patterns in the guide's deep-dive patterns follow it; the other groups are our additions.
- [TinyTorch](https://mlsysbook.ai/tinytorch/), Vijay Janapa Reddi and the ML Systems Book community, Harvard CS249r (MIT licence). The curriculum TrenTorch's command-line course implements, and so the order of the deep learning path's build stages.
- [TrenTorch](https://github.com/TrenTorch/TrenTorch), TrenTorch (PolyForm Noncommercial License 1.0.0). The framework the deep learning path builds module by module in NumPy; each build stage names a module, lists what is inside it and links its folder.
- [Alaap](https://github.com/PranavMishra17/alaap), by the author of this toolkit (CC BY 4.0). The voice design system the third part of the deep learning path reads, with its architecture figures and the papers in its source list.
- Classic coding problems, written in our own words. The algorithms page and the cheat sheet use well-known interview problems such as Two Sum, Number of islands and Coin change. They are known from public sets like [LeetCode](https://leetcode.com/problemset/), the [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) list and [NeetCode 150](https://neetcode.io/practice). Statements, examples, constraints and code are our own; no single site is copied.

## Books and courses

- [Designing Data-Intensive Applications, 2nd edition](https://dataintensive.net/), Martin Kleppmann and Chris Riccomini (O'Reilly). Background reading behind the system design material; the chapter titles are checked against [ddia2-references](https://github.com/ept/ddia2-references).
- [AI Engineering from Scratch](https://aiengineeringfromscratch.com/), Rohit Ghumare ([repository](https://github.com/rohitg00/ai-engineering-from-scratch), MIT licence). The lessons linked from figure notes and from the deep learning path's stages; the pages below say which phases.

## Reading linked from the pages

### System design guide

References at the end of a design:

- NotebookLM: [source and notebook limits by plan](https://elephas.app/blog/notebooklm-source-limits) and [free versus paid tiers](https://elephas.app/blog/notebooklm-free-vs-plus), Elephas. The plan limits the NotebookLM design sizes against.
- Prior authorization validator: [CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F) fact sheet](https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f), Centers for Medicare and Medicaid Services, and [SB 1120, Physicians Make Decisions Act](https://sd13.senate.ca.gov/news/press-release/december-9-2024/landmark-law-prohibits-health-insurance-companies-using-ai-to), California State Senate. The rules the design has to meet.
- Ticketmaster: [Design Ticketmaster](https://www.hellointerview.com/learn/system-design/problem-breakdowns/ticketmaster), Hello Interview. The classic baseline design, for contrast.
- Kitaru: [the repository](https://github.com/zenml-io/kitaru) (Apache-2.0), [Introducing the new Kitaru](https://www.zenml.io/blog/introducing-the-new-kitaru), [deterministic evaluations](https://docs.zenml.io/kitaru/guides/deterministic-evaluations), [replay](https://docs.zenml.io/kitaru/core-concepts/replay) and [replay and overrides](https://docs.zenml.io/kitaru/guides/replay-and-overrides), ZenML. The product the Kitaru design is read from.

Links in the diagram notes:

- [Temporal: what durable execution is](https://docs.temporal.io/evaluate/understanding-temporal) and [workflow execution](https://docs.temporal.io/workflow-execution), Temporal Technologies. Durable execution and replay behind an agent loop.
- [Designing robust and predictable APIs with idempotency](https://stripe.com/blog/idempotency), Stripe, and [Implementing Stripe-like idempotency keys in Postgres](https://brandur.org/idempotency-keys), Brandur Leach. The idempotency technique.
- [What is object storage](https://aws.amazon.com/what-is/object-storage/), Amazon Web Services. Why bulk content sits outside the database.
- [Dead letter queues for error handling](https://www.conduktor.io/glossary/dead-letter-queues-for-error-handling), Conduktor. Retries and dead-letter queues.
- [SELECT, the locking clause](https://www.postgresql.org/docs/current/sql-select.html) and [template databases](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html), the PostgreSQL documentation. FOR UPDATE SKIP LOCKED for job claims, and cheap environment snapshots.
- [Your AI product needs evals](https://hamel.dev/blog/posts/evals/), Hamel Husain. The evaluation gate.
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), Anthropic. The evaluation gate.
- [How to sandbox untrusted code](https://www.pandastack.ai/blog/how-to-sandbox-untrusted-code/), Pandastack. What running a subprocess without a sandbox gives away.
- [Docling: an efficient open-source toolkit for AI-driven document conversion](https://arxiv.org/html/2501.17887v1), Livathinos et al. The provenance model behind a citation check.
- [The illustrated word2vec](https://jalammar.github.io/illustrated-word2vec/), Jay Alammar. What an embedding is.
- AI Engineering from Scratch: 16 lessons in phases 11 (LLM engineering), 14 (agent engineering), 15 (autonomous systems) and 18 (ethics, safety and alignment), and one in phase 6 (speech and audio). [Example lesson](https://aiengineeringfromscratch.com/lesson?path=phases%2F11-llm-engineering%2F06-rag).

### Algorithms and coding page, and the cheat sheet

- [tau-bench: a benchmark for tool-agent-user interaction in real-world domains](https://arxiv.org/abs/2406.12045), Yao et al. The shape of a multi-turn agent evaluation.
- [The illustrated word2vec](https://jalammar.github.io/illustrated-word2vec/), Jay Alammar. What an embedding is.
- AI Engineering from Scratch: five lessons, on norms and distances, the chain rule and autodiff, optimisation, self-attention and speaker recognition (phases 1, 6 and 7). [Example lesson](https://aiengineeringfromscratch.com/lesson?path=phases%2F01-math-foundations%2F05-chain-rule-and-autodiff).

### Deep learning path

- TrenTorch module folders: one link per module, 01 tensor to 20 capstone, on the [TrenTorch-Main branch](https://github.com/TrenTorch/TrenTorch/tree/TrenTorch-Main/TrenTorch_CLI/). Where each build stage's code lives.
- AI Engineering from Scratch: 26 lessons in phases 1 (math foundations), 3 (deep learning core), 5 (NLP), 6 (speech and audio) and 7 (transformers). [Example lesson](https://aiengineeringfromscratch.com/lesson?path=phases%2F01-math-foundations%2F12-tensor-operations).
- Speaker space papers, the core of the voice design stages:
  - [Transfer learning from speaker verification to multispeaker text-to-speech synthesis](https://arxiv.org/abs/1806.04558), Jia et al., NeurIPS 2018.
  - [Speaker generation](https://arxiv.org/abs/2111.05095), Stanton et al.
  - [Speaker anonymization with phonetic intermediate representations](https://arxiv.org/abs/2207.04834), Meyer et al.
  - [Improving multi-speaker TTS prosody variance with a residual encoder and normalizing flows](https://arxiv.org/abs/2106.05762), Vallés-Pérez et al.
  - [Latent filling: latent space data augmentation for zero-shot speech synthesis](https://arxiv.org/abs/2310.03538), Bae et al.
  - [Interpolating speaker identities in embedding space for data expansion](https://arxiv.org/abs/2508.19210), Liu et al.
  - [Design choices for x-vector based speaker anonymization](https://arxiv.org/abs/2005.08601), Srivastava et al.
  - [Generating speakers by prompting listener impressions for pre-trained multi-speaker text-to-speech systems](https://arxiv.org/abs/2406.08812), Chen et al., Interspeech 2024.
- [PromptTTS++: controlling speaker identity in prompt-based text-to-speech using natural language descriptions](https://arxiv.org/abs/2309.08140), Shimizu et al., and its [reference implementation](https://github.com/line/promptttspp), LINE (Apache-2.0). The reference system a stage reads.
- [The sampling theorem](https://ccrma.stanford.edu/~jos/mdft/Sampling_Theorem.html) and [digital audio resampling](https://ccrma.stanford.edu/~jos/resample/), Julius O. Smith III, Stanford CCRMA. Why a sample rate holds frequencies up to half itself, and why to filter before resampling.
- [scipy.signal.resample](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.resample.html), the SciPy documentation. Resampling in code.
- [The source-filter model](https://www.phon.ox.ac.uk/source_filter_model), Oxford University Phonetics Laboratory. Formants and vocal tract length.

## Code and assets

The icons and typefaces are bundled, so the pages load nothing from another site; the one outside request is the landing page's star count from the GitHub API.

- [Lucide](https://lucide.dev/), Lucide Contributors, with portions from Feather by Cole Bemis (ISC licence; Feather portions MIT). 75 icons from lucide-static 0.469.0, fetched from [jsDelivr](https://www.jsdelivr.com/package/npm/lucide-static) and bundled with the licence in `figures/icons.js`. Used in the diagrams and the README art.
- [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/), Braille Institute of America (SIL Open Font License 1.1). The text typeface, bundled in `fonts/`.
- [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), the JetBrains Mono Project Authors (SIL Open Font License 1.1). The code typeface, bundled in `fonts/`.
- [Kalam](https://github.com/itfoundry/kalam), Indian Type Foundry (SIL Open Font License 1.1). A handwritten face bundled in `fonts/fonts.css`; no public page sets it today.
- [Google Fonts](https://fonts.google.com/), Google. Where `fonts/fetch.py` downloads the three typefaces from; licences confirmed in the [google/fonts](https://github.com/google/fonts/blob/main/ofl/atkinsonhyperlegible/OFL.txt) repository.

## Tools used to build and document it

- [Python](https://www.python.org/), Python Software Foundation. The build scripts, the public site build and the tests that run every code block on the coding page.
- [Python-Markdown](https://python-markdown.github.io/), the Python-Markdown project (BSD-3-Clause). Renders the deep learning path's plan into `DEEP-LEARNING.html`.
- [Node.js](https://nodejs.org/), the OpenJS Foundation. Checks that every shared figure renders and that page scripts parse.
- [Playwright for Python](https://playwright.dev/python/), Microsoft (Apache-2.0). Takes the README screenshots from the live site.
- [Shields.io](https://shields.io/), the Shields.io project (Apache-2.0). The README badges.
- [Pillow](https://python-pillow.org/), Alex Clark and contributors (MIT-CMU licence). Builds the site icon file.
- [Microsoft Edge](https://www.microsoft.com/en-us/edge), Microsoft. Renders the icon SVG to PNG, headless, before Pillow packs it.
- [GitHub Pages](https://docs.github.com/en/pages) and [GitHub Actions](https://github.com/features/actions), GitHub. Build and host the public site on every push to `main`.
- [Claude Code](https://claude.com/product/claude-code), Anthropic. The coding agent used to write and check much of the site.
