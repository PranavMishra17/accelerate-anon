BASELINE.field({
  id: "ml", name: "ML and deep learning", short: "ML", layer: "Intelligence",
  ink: "#7A3B5C", inkDark: "#D59ABB",
  lede: "How models learn from data: a loss that says how wrong they are, gradients that say which way to move, and the architectures those gradients flow through.",
  overview: [
    "Machine learning fits a function to examples instead of writing it by hand. Deep learning is the branch where that function is a large neural network trained by gradient descent. The people who do it are ML engineers, research engineers, applied scientists and data scientists. Day to day the work is less about inventing models than about data: cleaning it, splitting it honestly, launching training runs, reading loss curves, finding why a run diverged, and proving the new model beats the old one on data it never saw.",
    "This field sits under the other three in the Intelligence layer. AI engineering builds products on models trained here; inference engineering serves them; audio and speech is one of its modalities. In 2026 pretraining frontier models is concentrated in a few labs (OpenAI, Anthropic, Google DeepMind, Meta, and open-weight labs such as DeepSeek, Qwen and Mistral), while post-training, fine-tuning and evaluation happen everywhere. On tabular business data, gradient-boosted trees still win more often than neural networks.",
    "Read the tab bottom up: how learning works, then the models, then training at scale, then adapting large models. Interviews for ML roles test the first cluster hardest: write gradient descent from scratch, explain backpropagation and attention, and say why a model overfits. The site's [deep learning path](DEEP-LEARNING.html) builds each of these by hand."
  ],
  diagram: {
    nodes: [
      { id: "evaluation-splits", label: "Data and splits", sub: "train, validation, test", col: 0, row: 0 },
      { id: "building-blocks", label: "Forward pass", sub: "layers turn x into y", col: 0, row: 1 },
      { id: "loss-functions", label: "Loss", sub: "one number: how wrong", col: 0, row: 2 },
      { id: "backpropagation", label: "Backpropagation", sub: "a gradient per weight", col: 0, row: 3 },
      { id: "optimisers", label: "Optimiser step", sub: "SGD, Adam: move weights", col: 0, row: 4 },
      { id: "classic-models", label: "Linear and trees", sub: "tabular data, baselines", col: 1, row: 0 },
      { id: "transformers", label: "Transformers", sub: "attention over tokens", col: 1, row: 1 },
      { id: "cnns", label: "CNNs", sub: "shared filters, images", col: 1, row: 2 },
      { id: "rnns", label: "RNNs", sub: "state through time", col: 1, row: 3 },
      { id: "pretraining", label: "Pretraining", sub: "predict the next token", col: 2, row: 1 },
      { id: "fine-tuning-lora", label: "Fine-tuning, LoRA", sub: "adapt to a task", col: 2, row: 2 },
      { id: "preference-tuning", label: "Preference tuning", sub: "RLHF, DPO", col: 2, row: 3 }
    ],
    edges: [
      ["evaluation-splits", "building-blocks", "batches"], ["building-blocks", "loss-functions", "predictions"],
      ["loss-functions", "backpropagation", "error"], ["backpropagation", "optimisers", "gradients"],
      ["evaluation-splits", "classic-models", "tabular"], ["building-blocks", "transformers", "stacked into"],
      ["transformers", "pretraining", "trained as"], ["pretraining", "fine-tuning-lora", "then"],
      ["fine-tuning-lora", "preference-tuning", "then"]
    ],
    cap: "**The left column is the training loop every model runs, millions of times.** Batches go forward, the loss scores them, backpropagation turns the score into gradients, and the optimiser moves the weights; then the loop repeats. The middle column is what the forward pass can be. The right column is how a large language model is made: pretrained, then adapted, then tuned to preferences."
  },
  start: [
    { label: "3Blue1Brown, Neural networks: chapters 1 to 4 (what a network is, gradient descent, backpropagation)", url: "https://www.3blue1brown.com/lessons/neural-networks", m: 60, why: "The clearest pictures of what training does, before any code." },
    { label: "Andrej Karpathy, Neural Networks: Zero to Hero: lecture 1 (micrograd) and lecture 7 (build GPT)", url: "https://karpathy.ai/zero-to-hero.html", m: 260, why: "Backpropagation and a transformer written from scratch, line by line." },
    { label: "Google, Machine Learning Crash Course: the ML models and data modules", url: "https://developers.google.com/machine-learning/crash-course", m: 240, why: "Short modules on the classic models, data and overfitting." },
    { label: "Dive into Deep Learning (free book, PyTorch code): chapters 2 to 5", url: "https://d2l.ai/", m: 300, why: "The reference to come back to: maths, code and exercises together." }
  ],
  clusters: [
    { name: "How learning works", line: "The loop under every model: a loss, its gradient, a step, and an honest test.",
      topics: [
        { id: "learning-paradigms", name: "Supervised, unsupervised, self-supervised",
          line: "Where the training signal comes from: human labels, structure in the data, or the data itself.",
          body: [
            "**Supervised** learning trains on inputs paired with the right answer: an email and its spam label, a house and its price. Labels are expensive, so the dataset is usually the limit. **Unsupervised** learning has no labels and looks for structure: clusters (k-means), lower-dimensional summaries (PCA), anomalies.",
            "**Self-supervised** learning manufactures labels from the data itself: hide part of the input and predict it. GPT-style models predict the next token; BERT predicted masked words; image models predict a hidden patch or match two crops of one picture. Because the label is free, the dataset can be most of the public internet, which is why every foundation model is pretrained this way. **Reinforcement learning** is a fourth kind: no right answer, only a reward after acting."
          ],
          where: "Fraud and churn models at banks and SaaS companies are supervised. Customer segmentation is often k-means. Every large language model and speech encoder (Whisper's successors, wav2vec-style models) starts self-supervised.",
          nuance: "The line blurs in practice: a modern LLM is self-supervised in pretraining, supervised in instruction tuning and trained with reinforcement learning in preference tuning. Say which stage you mean.",
          read: [{ label: "BERT paper: the abstract and section 3.1 on masked-language pretraining", url: "https://arxiv.org/abs/1810.04805", m: 15 }],
          tags: ["labels", "clustering", "pretext task", "reinforcement learning"] },
        { id: "loss-functions", name: "Loss functions",
          line: "One number that says how wrong the model is, chosen so its gradient is useful.",
          body: [
            "A loss turns predictions and targets into a single number to minimise. **Mean squared error** suits regression: it averages squared differences, so large errors dominate. **Cross-entropy** suits classification: it is the negative log of the probability the model gave the right class, so a confident wrong answer costs a lot and a confident right answer costs almost nothing. Language models use cross-entropy over the vocabulary at every position; perplexity is the exponential of that average loss.",
            "The loss is what training optimises, not what you care about. Accuracy is not differentiable, so you train on cross-entropy and report accuracy. Other losses encode other goals: contrastive losses pull matching pairs together for embeddings, and the diffusion loss is the error in predicting added noise."
          ],
          where: "Cross-entropy trains every LLM and classifier. Contrastive loss trains CLIP and the embedding models behind search. Ranking losses train recommendation systems at Netflix and Spotify.",
          nuance: "A falling loss is not a better model. Validation loss can rise while training loss falls (overfitting), and a lower loss can still miss the metric that matters, such as recall on the rare class.",
          see: [{ label: "Deep learning path: stage 6, losses", href: "DEEP-LEARNING.html#/plan/stage-6" }],
          tags: ["cross-entropy", "mse", "perplexity", "contrastive"] },
        { id: "gradient-descent", name: "Gradient descent",
          line: "Move each weight a small step against the slope of the loss, and repeat.",
          body: [
            "The gradient of the loss with respect to the weights points uphill, so subtracting a small multiple of it lowers the loss: `w = w - lr * grad`. The **learning rate** sets the step size. Too large and the loss bounces or diverges; too small and training crawls. Computing the gradient over the whole dataset is too slow, so **stochastic gradient descent** estimates it on a mini-batch of, say, 32 to a few thousand examples. The noise in that estimate turns out to help generalisation.",
            "Real training adds a **schedule**: warm the learning rate up over the first steps, then decay it (cosine decay is common). Being able to write this loop from scratch in NumPy, with the gradient of a linear model derived by hand, is a standard interview task."
          ],
          where: "Every neural network, from a fraud model to a frontier LLM, is trained by some variant of it. Gradient-boosted trees use the same idea in function space: each new tree fits the gradient of the loss.",
          nuance: "The loss surface of a deep network is not a bowl. Gradient descent finds a good enough region, not the global minimum, and the learning rate matters more than almost any other setting.",
          read: [{ label: "3Blue1Brown: gradient descent, how neural networks learn", url: "https://www.3blue1brown.com/lessons/gradient-descent", m: 20 }],
          see: [{ label: "Deep learning path: stage 9, optimisers and the training loop", href: "DEEP-LEARNING.html#/plan/stage-9" }],
          tags: ["sgd", "learning rate", "mini-batch", "schedule"] },
        { id: "backpropagation", name: "Backpropagation",
          line: "The chain rule applied backwards through the network, giving every weight its gradient in one pass.",
          body: [
            "A network is a chain of functions. The chain rule says the derivative of the loss with respect to an early weight is the product of local derivatives along the path to the loss. Backpropagation computes these efficiently: run the forward pass and keep the intermediate values, then walk backwards from the loss, multiplying each node's local derivative by the gradient flowing into it. One backward pass costs about twice the forward pass and yields the gradient for every weight.",
            "Frameworks do this through **autograd**: each operation records how to compute its local gradient, building a graph during the forward pass that `loss.backward()` walks in reverse. Two classic failures live here: **vanishing gradients** (many small factors multiply towards zero) and **exploding gradients** (large factors blow up). Residual connections, normalisation and gradient clipping exist largely to fix them."
          ],
          where: "Inside `loss.backward()` in PyTorch and `jax.grad` in JAX. Karpathy's micrograd implements it in about a hundred lines, which is the version worth writing yourself.",
          nuance: "Backpropagation computes gradients; it does not update weights. The optimiser does that. Mixing the two up in an interview is a quick tell.",
          read: [{ label: "3Blue1Brown: what is backpropagation really doing?", url: "https://www.3blue1brown.com/lessons/backpropagation", m: 15 }],
          see: [{ label: "Deep learning path: stage 8, autograd", href: "DEEP-LEARNING.html#/plan/stage-8" }],
          tags: ["chain rule", "autograd", "vanishing gradients", "micrograd"] },
        { id: "overfitting-regularisation", name: "Overfitting and regularisation",
          line: "When a model memorises its training data, and the tools that push it to generalise.",
          body: [
            "A model **overfits** when it fits the noise in its training set: training loss keeps falling while validation loss turns up. It **underfits** when it is too simple to fit even the training data. The old framing is the bias-variance trade-off.",
            "**Regularisation** is anything that makes the simpler explanation cheaper. L2 penalty (weight decay) shrinks weights; dropout randomly zeroes activations so no unit can be relied on alone; data augmentation shows the model flipped, cropped or noised copies; early stopping halts training when validation loss stops improving. More data beats all of them.",
            "Very large networks complicate the story: they can fit random labels perfectly, yet generalise well on real data, and test error can fall again past the point where the model interpolates the training set (double descent)."
          ],
          where: "Weight decay is on by default in AdamW, the optimiser behind most LLM training. Dropout appears in many classic architectures; augmentation is standard in vision and speech (SpecAugment).",
          nuance: "Most overfitting in practice is leakage, not model capacity: the test set shares users, duplicates or future information with the training set. Fix the split before adding dropout.",
          read: [{ label: "Google ML Crash Course: datasets, generalisation and overfitting module", url: "https://developers.google.com/machine-learning/crash-course/overfitting", m: 60 }],
          tags: ["bias-variance", "dropout", "weight decay", "early stopping", "augmentation"] },
        { id: "evaluation-splits", name: "Evaluation and data splits",
          line: "Train, tune and test on separate data, with a metric that matches the cost of mistakes.",
          body: [
            "Split data three ways. The **training set** fits weights, the **validation set** chooses hyperparameters and when to stop, and the **test set** is looked at once, at the end. Every time you tune against the test set it stops being a test. With little data, k-fold cross-validation rotates the validation fold.",
            "The split must mirror deployment: split by time for anything that forecasts, by user or patient when one person has many rows, and deduplicate first. Then choose a metric. Accuracy hides a 1% positive class; precision and recall (and their trade-off curve) do not. For ranking use NDCG or recall at k; for language models perplexity in training and task benchmarks after."
          ],
          where: "Kaggle's private leaderboard is a held-out test set; teams that overfit the public board drop places. LLM labs fight benchmark contamination, where test questions leak into pretraining data.",
          nuance: "Offline metrics are a proxy. A model that wins on the test set can lose in an A/B test because the data shifted or the metric did not match what users value.",
          tags: ["validation", "cross-validation", "precision", "recall", "leakage", "contamination"] }
      ] },
    { name: "Models and architectures", line: "What sits inside the forward pass, from a linear model to a transformer.",
      topics: [
        { id: "classic-models", name: "Linear models, trees and gradient boosting",
          line: "The models that still win on tables: fast, cheap, and easy to explain.",
          body: [
            "**Linear regression** fits a weighted sum of features; **logistic regression** passes it through a sigmoid to get a probability. Both train in seconds and their weights can be read. A **decision tree** splits the data on one feature at a time; alone it overfits. A **random forest** averages many trees grown on random samples. **Gradient boosting** adds trees one at a time, each fitted to the errors (the gradient of the loss) of the ensemble so far.",
            "XGBoost, LightGBM and CatBoost are the gradient-boosting libraries in use. On structured, tabular data with a few hundred features they usually match or beat neural networks, train on a CPU, and handle missing values and mixed feature types with little preparation."
          ],
          where: "Credit scoring, fraud detection, ad click prediction and demand forecasting at banks, Stripe, Uber and retailers commonly run on gradient-boosted trees. Logistic regression is the baseline every new model must beat.",
          nuance: "Start here. A model that cannot beat logistic regression or LightGBM on a tabular task is not ready, and the simpler one is easier to monitor, explain to a regulator and retrain.",
          read: [{ label: "XGBoost docs: introduction to boosted trees", url: "https://xgboost.readthedocs.io/en/stable/tutorials/model.html", m: 20 }],
          tags: ["logistic regression", "random forest", "xgboost", "lightgbm", "tabular"] },
        { id: "building-blocks", name: "Neural network building blocks",
          line: "Linear layers, nonlinear activations, normalisation and residual connections, stacked.",
          body: [
            "A **linear layer** multiplies its input by a weight matrix and adds a bias. Stacking linear layers alone is still one linear function, so each is followed by a nonlinear **activation**: ReLU, or GELU and SwiGLU in modern transformers. That pairing is what lets a network approximate curved functions.",
            "Depth needs two more parts. **Normalisation** (batch norm in CNNs, layer norm or RMSNorm in transformers) keeps activations in a stable range. **Residual connections** add a block's input to its output, `x + f(x)`, giving gradients a direct path back so networks with a hundred layers still train. A final **softmax** turns scores into probabilities. Nearly every architecture is these parts arranged differently."
          ],
          where: "`nn.Linear`, `nn.LayerNorm` and `nn.GELU` in PyTorch. A Llama-style transformer block is RMSNorm, attention, a residual add, RMSNorm, a SwiGLU feed-forward layer and another residual add.",
          nuance: "Most of the parameters in a transformer sit in the plain feed-forward layers, not in attention. Attention gets the attention; matrix multiplies get the compute.",
          see: [{ label: "Deep learning path: stage 5, activations and layers", href: "DEEP-LEARNING.html#/plan/stage-5" }],
          tags: ["relu", "layer norm", "residual", "softmax", "mlp"] },
        { id: "cnns", name: "Convolutional networks (CNNs)",
          line: "Small filters slid across an image, sharing weights so a pattern is found anywhere.",
          body: [
            "A convolutional layer slides a small filter, say 3 by 3, across the input and takes a dot product at each position. The same filter weights are used everywhere, so a CNN needs far fewer parameters than a dense layer on raw pixels, and an edge detector learned in one corner works in every corner. Stacked layers see wider regions: early filters find edges, later ones textures, parts and objects. Pooling or strided convolutions shrink the spatial size as depth grows.",
            "ResNet (2015) made CNNs very deep with residual connections and set the pattern for years. Vision transformers have since taken over large-scale vision, but CNNs remain common where compute is tight."
          ],
          where: "On-device vision in phones and cameras, medical imaging, and industrial inspection. In audio, CNN front ends turn spectrograms into features, and Whisper's encoder starts with two convolution layers.",
          nuance: "A convolution's strength is its built-in assumption that nearby pixels relate and patterns repeat. With enough data a transformer learns that itself; with little data the assumption wins.",
          read: [{ label: "Stanford CS231n notes: convolutional networks", url: "https://cs231n.github.io/convolutional-networks/", m: 40 }],
          see: [{ label: "Deep learning path: stage 11, convolutions and batch norm", href: "DEEP-LEARNING.html#/plan/stage-11" }],
          tags: ["convolution", "resnet", "pooling", "vision"] },
        { id: "rnns", name: "Recurrent networks (RNNs, LSTMs)",
          line: "A network that reads a sequence one step at a time, carrying a hidden state forward.",
          body: [
            "An RNN applies the same cell at every time step, combining the current input with a hidden state from the previous step. That state is the model's memory. Plain RNNs forget fast because gradients vanish over long sequences. **LSTMs** and **GRUs** add gates that learn what to keep, write and forget, which made them the standard for speech recognition and translation until about 2017.",
            "Their weakness is the sequence itself: step 100 cannot start before step 99, so training does not parallelise across time. Transformers removed that limit and replaced RNNs for most language work. The idea survives in state-space models such as Mamba, which keep a recurrent state for cheap inference but train in parallel."
          ],
          where: "Older on-device keyboards and speech systems ran LSTMs. Streaming speech models and some time-series forecasters still use recurrent or state-space layers because each new step costs the same, however long the history.",
          nuance: "Transformers cost more per token as context grows; recurrent models do not. That trade-off is why recurrent ideas keep returning for long, streaming inputs.",
          read: [{ label: "Christopher Olah, Understanding LSTM networks", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", m: 20 }],
          tags: ["lstm", "gru", "sequence", "mamba", "state space"] },
        { id: "transformers", name: "Transformers and attention",
          line: "Every token looks at every other token and takes a weighted mix of what it finds.",
          body: [
            "In **self-attention** each token makes three vectors: a query, a key and a value. A token's query is compared with every key by dot product; softmax turns the scores into weights; the output is the weighted sum of values. **Multi-head** attention runs several of these in parallel so different heads track different relations. A transformer block is attention plus a feed-forward layer, each wrapped in normalisation and a residual connection, stacked dozens of times.",
            "Attention has no sense of order, so position is added, today usually with rotary embeddings (RoPE). **Decoder-only** models (GPT, Llama, Claude) use a causal mask so a token sees only the past, and generate one token at a time. **Encoder-decoder** models (the original 2017 design, T5, Whisper) encode the whole input, then decode while attending to it."
          ],
          where: "Every frontier LLM, Whisper and most speech models, vision transformers, and protein models such as AlphaFold all use attention.",
          nuance: "Attention compares every pair of tokens, so its cost grows with the square of context length. Most long-context work (FlashAttention, sparse or sliding-window attention, grouped-query attention) is about that cost.",
          read: [
            { label: "Jay Alammar, The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", m: 30 },
            { label: "3Blue1Brown: attention in transformers, step by step", url: "https://www.3blue1brown.com/lessons/attention", m: 25 }
          ],
          see: [
            { label: "Deep learning path: stage 13, attention and transformers", href: "DEEP-LEARNING.html#/plan/stage-13" },
            { label: "Coding primer: a transformer block in code", href: "CODING.html#transformer" }
          ],
          tags: ["self-attention", "qkv", "decoder-only", "encoder-decoder", "rope"] },
        { id: "embeddings", name: "Embeddings",
          line: "Things turned into vectors, so that similar things land close together.",
          body: [
            "An embedding maps a discrete thing (a token, a word, a product, a user, a sentence) to a dense vector of a few hundred to a few thousand numbers. Nobody sets the numbers; they are learned so that items used in similar contexts end up near each other. word2vec (2013) showed that directions in this space can carry meaning.",
            "There are two common kinds. **Token embeddings** are the first layer of every language model: a lookup table from token id to vector. **Sentence or document embeddings** come from a model trained, usually with a contrastive loss, so that a question and its answer land close by cosine similarity. These second kind power semantic search, retrieval for RAG, clustering, deduplication and recommendations."
          ],
          where: "Embedding APIs from OpenAI, Cohere and Voyage, and open models such as BGE and E5. YouTube and Spotify recommendations match user and item embeddings. Vector databases (pgvector, Pinecone, Qdrant) store them.",
          nuance: "Close in embedding space means similar in whatever the training objective rewarded, which is not always what your users mean. Measure retrieval quality on your own queries before trusting a leaderboard.",
          read: [{ label: "Jay Alammar, The Illustrated Word2vec", url: "https://jalammar.github.io/illustrated-word2vec/", m: 30 }],
          see: [
            { label: "Deep learning path: stage 12, tokens and embeddings", href: "DEEP-LEARNING.html#/plan/stage-12" },
            { label: "Coding primer: embeddings and similarity", href: "CODING.html#embed" }
          ],
          tags: ["word2vec", "vectors", "cosine similarity", "semantic search"] }
      ] },
    { name: "Training at scale", line: "What changes when the model and data no longer fit on one GPU.",
      topics: [
        { id: "optimisers", name: "Batches and optimisers (SGD, Adam)",
          line: "How the gradient becomes a weight update: momentum, per-weight step sizes, and batch size.",
          body: [
            "Plain SGD steps every weight by the same learning rate. **Momentum** keeps a running average of past gradients so the update rolls through noise. **Adam** also tracks a running average of squared gradients and divides by its square root, giving each weight its own step size; **AdamW** applies weight decay separately and is the default for transformers. The cost is memory: Adam keeps two extra numbers per weight, so optimiser state can take more memory than the model.",
            "**Batch size** trades noise for throughput. Larger batches use the GPU better and give smoother gradients, but past a point they stop speeding up learning per example, and the learning rate usually has to rise with them. When a batch does not fit in memory, **gradient accumulation** sums gradients over several small batches before one step."
          ],
          where: "AdamW trains most published LLMs. Newer optimisers such as Muon have been used in some 2025 open-weight models; SGD with momentum is still common for CNNs.",
          nuance: "If training diverges, lower the learning rate and check the data before blaming the optimiser. Swapping optimisers rarely fixes what a bad learning rate or a bad batch broke.",
          read: [{ label: "Adam paper (Kingma and Ba): sections 1 and 2, the algorithm", url: "https://arxiv.org/abs/1412.6980", m: 20 }],
          see: [{ label: "Deep learning path: stage 9, optimisers and the training loop", href: "DEEP-LEARNING.html#/plan/stage-9" }],
          tags: ["adam", "adamw", "momentum", "batch size", "gradient accumulation"] },
        { id: "mixed-precision", name: "Mixed precision and distributed training",
          line: "Fewer bits per number and more GPUs per run, without changing what the model learns.",
          body: [
            "**Mixed precision** runs most of the maths in 16-bit floats (bfloat16 or float16) while keeping a 32-bit master copy of the weights. Tensor cores run 16-bit matrix multiplies far faster, and activations take half the memory. bfloat16 keeps float32's range, so it rarely overflows; float16 has more precision but a small range, so it needs **loss scaling** to stop small gradients underflowing to zero. Recent GPUs add FP8 for training too.",
            "When one GPU is not enough, **data parallelism** gives each GPU a copy of the model and a slice of the batch, then averages gradients. **FSDP** and ZeRO shard weights, gradients and optimiser state across GPUs so large models fit. Tensor and pipeline parallelism split the model itself; frontier runs combine all of these across thousands of GPUs."
          ],
          where: "`torch.autocast` and FSDP in PyTorch, DeepSpeed, and Megatron-LM. Hugging Face Accelerate wraps them for smaller teams.",
          nuance: "Most training throughput problems are not the maths but the data loader starving the GPU or communication between GPUs. Measure GPU utilisation before tuning anything else.",
          read: [{ label: "PyTorch docs: automatic mixed precision (autocast and GradScaler)", url: "https://docs.pytorch.org/docs/stable/amp.html", m: 15 }],
          tags: ["bf16", "fp16", "fp8", "fsdp", "zero", "data parallel"] },
        { id: "frameworks", name: "Frameworks: PyTorch and JAX",
          line: "The libraries that hold tensors, compute gradients and run the maths on GPUs.",
          body: [
            "**PyTorch** runs eagerly: each line executes as Python runs it, which makes debugging ordinary. Autograd records operations and `backward()` computes gradients. `torch.compile` traces the code and fuses operations for speed when you want it. It is the default in research papers, in Hugging Face, and in most companies.",
            "**JAX** looks like NumPy but is functional: you write pure functions and transform them. `jax.grad` returns a function's gradient, `jax.jit` compiles it with XLA, and `jax.vmap` vectorises it over a batch. Arrays are immutable and randomness is passed explicitly as keys. It shines on TPUs and in large-scale training at Google DeepMind and some other labs."
          ],
          where: "PyTorch underlies Meta's Llama, most open-weight models and vLLM. JAX trains Gemini. TensorFlow survives mainly in older production systems.",
          nuance: "The framework matters less than the habits: shapes printed, gradients checked, seeds fixed, and a tiny batch overfit first to prove the loop works.",
          read: [
            { label: "PyTorch tutorial: learn the basics (tensors to the optimisation loop)", url: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html", m: 60 },
            { label: "JAX docs: quickstart (jit, grad, vmap)", url: "https://docs.jax.dev/en/latest/notebooks/thinking_in_jax.html", m: 25 }
          ],
          see: [
            { label: "Deep learning path: stage 10, the same things in real PyTorch", href: "DEEP-LEARNING.html#/plan/stage-10" },
            { label: "Coding primer: PyTorch", href: "CODING.html#torch" }
          ],
          tags: ["pytorch", "jax", "autograd", "xla", "torch.compile"] }
      ] },
    { name: "Large models: pretrain, adapt, generate", line: "How foundation models are made and adapted, and how diffusion generates images.",
      topics: [
        { id: "pretraining", name: "Pretraining and scaling",
          line: "Next-token prediction on trillions of tokens, where loss falls predictably with scale.",
          body: [
            "A base model is pretrained by self-supervised next-token prediction over a huge text corpus: web pages, books, code, filtered and deduplicated. Loss falls smoothly and predictably as parameters, data and compute grow, which is what **scaling laws** describe. Chinchilla (2022) showed that for a fixed compute budget, parameters and training tokens should grow together, about 20 tokens per parameter; earlier models were too big for their data.",
            "Since then labs train well past that ratio, because a smaller model trained longer is cheaper to serve. The result is a base model that continues text well but does not follow instructions; that comes from post-training. Pretraining a frontier model costs tens to hundreds of millions of dollars, which is why few organisations do it."
          ],
          where: "OpenAI, Anthropic, Google DeepMind, Meta, xAI, DeepSeek, Qwen and Mistral pretrain foundation models. Smaller teams pretrain domain models (code, biology, speech) at far smaller scale.",
          nuance: "Data quality now matters as much as quantity. Much of the gain in recent models came from filtering, deduplication and synthetic data, not from more raw tokens.",
          read: [{ label: "Chinchilla paper: Training compute-optimal large language models (abstract and figure 1)", url: "https://arxiv.org/abs/2203.15556", m: 15 }],
          tags: ["scaling laws", "chinchilla", "base model", "next-token prediction"] },
        { id: "fine-tuning-lora", name: "Fine-tuning and LoRA",
          line: "Continue training a pretrained model on your data, often by training a small add-on.",
          body: [
            "**Full fine-tuning** updates every weight on a smaller, task-specific dataset. It works, but you need memory for the whole model, its gradients and optimiser state, and you get a full-size copy per task. **Supervised fine-tuning** (SFT) on instruction and answer pairs is how a base model becomes a chat model.",
            "**LoRA** freezes the base weights and learns a low-rank update beside chosen weight matrices: two thin matrices whose product is added to the original. The paper cut trainable parameters by up to 10,000 times for GPT-3 with quality close to full fine-tuning. **QLoRA** does the same on a 4-bit quantized base, so a model with tens of billions of parameters can be tuned on one large GPU. Adapters are a few megabytes, so one server can host many on one base model."
          ],
          where: "OpenAI, Google and Together offer fine-tuning APIs; Hugging Face PEFT, Unsloth and Axolotl are the common open tools. Serving engines such as vLLM load many LoRA adapters on one base model.",
          nuance: "Fine-tuning teaches format, style and narrow skills well and new facts badly. For knowledge that changes, retrieval is usually the better tool.",
          read: [{ label: "LoRA paper (Hu et al.): abstract and section 4", url: "https://arxiv.org/abs/2106.09685", m: 20 }],
          see: [{ label: "Coding primer: LoRA in code", href: "CODING.html#lora" }],
          tags: ["sft", "lora", "qlora", "peft", "adapters"] },
        { id: "preference-tuning", name: "RLHF and preference tuning",
          line: "Teach a model which of two answers people prefer, beyond what a correct answer looks like.",
          body: [
            "After SFT, a model can follow instructions but has no sense of which answer is better. **RLHF** collects pairs of model answers ranked by people, trains a **reward model** to predict the preferred one, then optimises the language model against that reward with reinforcement learning (PPO), with a penalty for drifting far from the SFT model. InstructGPT (2022) showed a 1.3B model tuned this way was preferred over the 175B GPT-3.",
            "**DPO** (2023) reaches a similar result without a separate reward model or RL loop: a classification-style loss directly on preference pairs. It is simpler and now common. Labs also use AI feedback (constitutional AI, RLAIF) and **reinforcement learning with verifiable rewards**, where the reward is a passing test or a correct maths answer; that is how 2025's reasoning models were trained."
          ],
          where: "Every chat assistant (ChatGPT, Claude, Gemini) is preference-tuned. Open-source recipes in Hugging Face TRL implement SFT, DPO and PPO.",
          nuance: "The model optimises the reward, not the intent behind it. Reward hacking shows up as longer answers, flattery or confident tone when those scored well with raters.",
          read: [
            { label: "InstructGPT paper: abstract and figure 2, the three steps", url: "https://arxiv.org/abs/2203.02155", m: 15 },
            { label: "DPO paper: abstract and section 4", url: "https://arxiv.org/abs/2305.18290", m: 20 }
          ],
          tags: ["rlhf", "dpo", "ppo", "reward model", "rlvr", "post-training"] },
        { id: "diffusion", name: "Diffusion models",
          line: "Generate an image by learning to remove noise, step by step, from pure static.",
          body: [
            "A diffusion model is trained on a simple task: take a real image, add a known amount of Gaussian noise, and predict the noise. Repeat across every noise level. To generate, start from pure noise and apply the model many times, each step removing a little noise, until an image appears. Text conditioning (through cross-attention to a text encoder) steers what the image becomes; **classifier-free guidance** turns up how strongly.",
            "**Latent diffusion** runs the process in the compressed latent space of an autoencoder rather than on pixels, which made it affordable; Stable Diffusion works this way. Newer models replace the U-Net with a transformer (diffusion transformers) and use flow matching, a close relative that learns straighter paths from noise to data."
          ],
          where: "Image and video generators: Stable Diffusion and FLUX, Midjourney, DALL-E 3, Google's Imagen and Veo, OpenAI's Sora. Some text-to-speech and music models use diffusion or flow matching too.",
          nuance: "Generation is slow because it takes many sequential steps, often 20 to 50 instead of the 1,000 used in training. Distillation and consistency models cut that to a few steps at some cost in quality.",
          read: [{ label: "Lilian Weng, What are diffusion models? (the forward and reverse process sections)", url: "https://lilianweng.github.io/posts/2021-07-11-diffusion-models/", m: 30 }],
          tags: ["ddpm", "latent diffusion", "flow matching", "guidance", "image generation"] }
      ] }
  ],
  see: [
    { label: "Deep learning from scratch", href: "DEEP-LEARNING.html" },
    { label: "Coding primer: AI systems", href: "CODING.html#ai-systems" }
  ]
});
