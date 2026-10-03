/* What to read and watch for each topic in the ml field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("ml", {
 "learning-paradigms": [
  {
   "kind": "video",
   "req": true,
   "label": "Large language models explained briefly",
   "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
   "m": 8,
   "why": "Self-supervised next-token learning shown end to end, in eight minutes.",
   "yt": {
    "id": "LPZh9BOjkQs",
    "ch": "3Blue1Brown"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "BERT paper: the abstract and section 3.1 on masked-language pretraining",
   "url": "https://arxiv.org/abs/1810.04805",
   "m": 15,
   "why": "Masked-language pretraining: the self-supervised idea in the BERT paper."
  }
 ],
 "loss-functions": [
  {
   "kind": "video",
   "req": true,
   "label": "Intuitively Understanding the Cross Entropy Loss",
   "url": "https://www.youtube.com/watch?v=Pwgpl9mKars",
   "m": 6,
   "yt": {
    "id": "Pwgpl9mKars",
    "ch": "Adian Liusie"
   },
   "why": "Why cross-entropy measures how surprised the model is by the right answer."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Loss Functions - EXPLAINED!",
   "url": "https://www.youtube.com/watch?v=QBbC3Cjsnjg",
   "m": 9,
   "yt": {
    "id": "QBbC3Cjsnjg",
    "ch": "CodeEmporium"
   },
   "why": "MSE, MAE and cross-entropy side by side, with when to use each."
  }
 ],
 "gradient-descent": [
  {
   "kind": "video",
   "req": true,
   "label": "Gradient descent, how neural networks learn",
   "url": "https://www.youtube.com/watch?v=IHZwWFHWa-w",
   "m": 21,
   "why": "The slope picture of the loss and why small steps work.",
   "yt": {
    "id": "IHZwWFHWa-w",
    "ch": "3Blue1Brown"
   }
  }
 ],
 "backpropagation": [
  {
   "kind": "video",
   "req": true,
   "label": "Backpropagation, intuitively",
   "url": "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
   "m": 13,
   "why": "How the chain rule gives every weight its gradient.",
   "yt": {
    "id": "Ilg3gGewQ5U",
    "ch": "3Blue1Brown"
   }
  }
 ],
 "overfitting-regularisation": [
  {
   "kind": "video",
   "req": true,
   "label": "Machine learning fundamentals: bias and variance",
   "url": "https://www.youtube.com/watch?v=EuBBz3bI-aA",
   "m": 7,
   "why": "Overfitting as bias and variance, in six minutes.",
   "yt": {
    "id": "EuBBz3bI-aA",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google ML Crash Course: datasets, generalisation and overfitting module",
   "url": "https://developers.google.com/machine-learning/crash-course/overfitting",
   "m": 30,
   "why": "Generalisation and overfitting with exercises."
  }
 ],
 "evaluation-splits": [
  {
   "kind": "video",
   "req": true,
   "label": "Machine learning fundamentals: cross validation",
   "url": "https://www.youtube.com/watch?v=fSytzGwwBVw",
   "m": 7,
   "why": "Why we hold data out, and how cross validation reuses it.",
   "yt": {
    "id": "fSytzGwwBVw",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Machine learning fundamentals: the confusion matrix",
   "url": "https://www.youtube.com/watch?v=Kdsp6soqA7o",
   "m": 8,
   "why": "Reading a confusion matrix: the base of precision and recall.",
   "yt": {
    "id": "Kdsp6soqA7o",
    "ch": "StatQuest with Josh Starmer"
   }
  }
 ],
 "classic-models": [
  {
   "kind": "video",
   "req": true,
   "label": "Gradient Boost part 1: regression main ideas",
   "url": "https://www.youtube.com/watch?v=3CC4N4z3GJc",
   "m": 16,
   "why": "How boosting adds small trees that fix the last errors.",
   "yt": {
    "id": "3CC4N4z3GJc",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "XGBoost docs: introduction to boosted trees",
   "url": "https://xgboost.readthedocs.io/en/stable/tutorials/model.html",
   "m": 20,
   "why": "The boosted-trees model written out step by step."
  }
 ],
 "building-blocks": [
  {
   "kind": "video",
   "req": true,
   "label": "But what is a neural network?",
   "url": "https://www.youtube.com/watch?v=aircAruvnKk",
   "m": 19,
   "why": "Layers, weights and activations drawn out.",
   "yt": {
    "id": "aircAruvnKk",
    "ch": "3Blue1Brown"
   }
  }
 ],
 "cnns": [
  {
   "kind": "video",
   "req": true,
   "label": "Neural networks part 8: image classification with CNNs",
   "url": "https://www.youtube.com/watch?v=HGwBXDKFk9I",
   "m": 16,
   "why": "Filters, pooling and why weight sharing finds a pattern anywhere.",
   "yt": {
    "id": "HGwBXDKFk9I",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Stanford CS231n notes: convolutional networks",
   "url": "https://cs231n.github.io/convolutional-networks/",
   "m": 40,
   "why": "The standard notes on layers, strides and architectures."
  }
 ],
 "rnns": [
  {
   "kind": "video",
   "req": true,
   "label": "Long Short-Term Memory (LSTM), clearly explained",
   "url": "https://www.youtube.com/watch?v=YCzL96nL7j0",
   "m": 21,
   "why": "The gates of an LSTM and what each one keeps or forgets.",
   "yt": {
    "id": "YCzL96nL7j0",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Christopher Olah, Understanding LSTM networks",
   "url": "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
   "m": 20,
   "why": "Olah's diagrams of the cell state and gates."
  }
 ],
 "transformers": [
  {
   "kind": "video",
   "req": false,
   "label": "Transformers, the tech behind LLMs",
   "url": "https://www.youtube.com/watch?v=wjZofJX0v4M",
   "m": 28,
   "why": "The whole transformer as a data flow, from tokens to next-token odds.",
   "yt": {
    "id": "wjZofJX0v4M",
    "ch": "3Blue1Brown"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Attention in transformers, step-by-step",
   "url": "https://www.youtube.com/watch?v=eMlx5fFNoYc",
   "m": 27,
   "why": "The attention step with queries, keys and values drawn.",
   "yt": {
    "id": "eMlx5fFNoYc",
    "ch": "3Blue1Brown"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Jay Alammar, The Illustrated Transformer",
   "url": "https://jalammar.github.io/illustrated-transformer/",
   "m": 30,
   "why": "The best picture-by-picture walk through the architecture."
  }
 ],
 "embeddings": [
  {
   "kind": "video",
   "req": true,
   "label": "Word embedding and Word2Vec, clearly explained",
   "url": "https://www.youtube.com/watch?v=viZrOnJclY0",
   "m": 17,
   "why": "How a network learns word vectors from context.",
   "yt": {
    "id": "viZrOnJclY0",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Jay Alammar, The Illustrated Word2vec",
   "url": "https://jalammar.github.io/illustrated-word2vec/",
   "m": 30,
   "why": "Illustrated: vectors, analogies and training."
  }
 ],
 "optimisers": [
  {
   "kind": "video",
   "req": true,
   "label": "Optimization for Deep Learning (Momentum, RMSprop, AdaGrad, Adam)",
   "url": "https://www.youtube.com/watch?v=NE88eqLngkg",
   "m": 16,
   "yt": {
    "id": "NE88eqLngkg",
    "ch": "DeepBean"
   },
   "why": "Builds from SGD to momentum to per-weight step sizes to Adam."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Adam Optimization Algorithm (C2W2L08)",
   "url": "https://www.youtube.com/watch?v=JXQT_vxqwIs",
   "m": 8,
   "yt": {
    "id": "JXQT_vxqwIs",
    "ch": "DeepLearningAI"
   },
   "why": "The Adam update written out step by step."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Adam paper (Kingma and Ba): sections 1 and 2, the algorithm",
   "url": "https://arxiv.org/abs/1412.6980",
   "m": 20,
   "why": "The Adam algorithm: moments and bias correction."
  }
 ],
 "mixed-precision": [
  {
   "kind": "video",
   "req": true,
   "label": "Mixed Precision Training - Explained",
   "url": "https://www.youtube.com/watch?v=87GhCIQudEA",
   "m": 11,
   "yt": {
    "id": "87GhCIQudEA",
    "ch": "DataMListic"
   },
   "why": "Which maths runs in 16-bit, the fp32 master weights, and loss scaling."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How Fully Sharded Data Parallel (FSDP) works?",
   "url": "https://www.youtube.com/watch?v=By_O0k102PY",
   "m": 33,
   "yt": {
    "id": "By_O0k102PY",
    "ch": "Ahmed Taha"
   },
   "why": "How sharding weights, grads and optimizer state fits bigger models; watch the first 15 minutes."
  },
  {
   "kind": "read",
   "req": true,
   "label": "PyTorch docs: automatic mixed precision (autocast and GradScaler)",
   "url": "https://docs.pytorch.org/docs/stable/amp.html",
   "m": 15,
   "why": "Autocast and GradScaler in practice."
  }
 ],
 "frameworks": [
  {
   "kind": "video",
   "req": true,
   "label": "Understanding JAX: JIT, XLA, and Pure Functions Explained",
   "url": "https://www.youtube.com/watch?v=SMAsCd4W5Z0",
   "m": 11,
   "yt": {
    "id": "SMAsCd4W5Z0",
    "ch": "Google for Developers"
   },
   "why": "What jit, grad and vmap do, and why JAX wants pure functions."
  },
  {
   "kind": "video",
   "req": false,
   "label": "PyTorch vs TensorFlow vs JAX: The Ultimate Comparison",
   "url": "https://www.youtube.com/watch?v=mf2oCBeg7T8",
   "m": 4,
   "yt": {
    "id": "mf2oCBeg7T8",
    "ch": "The Program One"
   },
   "why": "Eager PyTorch against compiled JAX in a few minutes."
  },
  {
   "kind": "keep",
   "src": "tutorial",
   "req": true,
   "label": "PyTorch tutorial: learn the basics (tensors to the optimisation loop)",
   "url": "https://docs.pytorch.org/tutorials/beginner/basics/intro.html",
   "m": 60,
   "why": "Tensors to the training loop in PyTorch."
  },
  {
   "kind": "read",
   "req": false,
   "label": "JAX docs: quickstart (jit, grad, vmap)",
   "url": "https://docs.jax.dev/en/latest/notebooks/thinking_in_jax.html",
   "m": 25,
   "why": "jit, grad and vmap: how JAX differs from eager PyTorch."
  }
 ],
 "pretraining": [
  {
   "kind": "video",
   "req": true,
   "label": "Large language models explained briefly",
   "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
   "m": 8,
   "why": "What pretraining on next-token prediction produces.",
   "yt": {
    "id": "LPZh9BOjkQs",
    "ch": "3Blue1Brown"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Chinchilla paper: Training compute-optimal large language models (abstract and figure 1)",
   "url": "https://arxiv.org/abs/2203.15556",
   "m": 15,
   "why": "Compute-optimal scaling: loss against parameters and tokens."
  }
 ],
 "fine-tuning-lora": [
  {
   "kind": "video",
   "req": true,
   "label": "What is Low-Rank Adaptation (LoRA) | explained by the inventor",
   "url": "https://www.youtube.com/watch?v=DhRoTONcyZE",
   "m": 8,
   "yt": {
    "id": "DhRoTONcyZE",
    "ch": "Edward Hu"
   },
   "why": "Why a small low-rank add-on is enough, from the author."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LoRA: Low-Rank Adaptation of Large Language Models - Explained visually + PyTorch code from scratch",
   "url": "https://www.youtube.com/watch?v=PXWYUTMt-AU",
   "m": 27,
   "yt": {
    "id": "PXWYUTMt-AU",
    "ch": "Umar Jamil"
   },
   "why": "The A and B matrices and parameter counts, then the code."
  },
  {
   "kind": "read",
   "req": true,
   "label": "LoRA paper (Hu et al.): abstract and section 4",
   "url": "https://arxiv.org/abs/2106.09685",
   "m": 20,
   "why": "Low-rank updates: the idea and why it matches full fine-tuning."
  }
 ],
 "preference-tuning": [
  {
   "kind": "video",
   "req": true,
   "label": "Reinforcement Learning with Human Feedback (RLHF), Clearly Explained!!!",
   "url": "https://www.youtube.com/watch?v=qPN_XZcJf_s",
   "m": 19,
   "yt": {
    "id": "qPN_XZcJf_s",
    "ch": "StatQuest with Josh Starmer"
   },
   "why": "The SFT, reward model and policy steps in plain terms."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Direct Preference Optimization: Your Language Model is Secretly a Reward Model | DPO paper explained",
   "url": "https://www.youtube.com/watch?v=XZLc09hkMwA",
   "m": 9,
   "yt": {
    "id": "XZLc09hkMwA",
    "ch": "AI Coffee Break with Letitia"
   },
   "why": "How DPO skips the reward model and trains on preference pairs."
  },
  {
   "kind": "read",
   "req": true,
   "label": "InstructGPT paper: abstract and figure 2, the three steps",
   "url": "https://arxiv.org/abs/2203.02155",
   "m": 15,
   "why": "The three steps: SFT, reward model, RL against it."
  },
  {
   "kind": "read",
   "req": false,
   "label": "DPO paper: abstract and section 4",
   "url": "https://arxiv.org/abs/2305.18290",
   "m": 20,
   "why": "DPO: preference tuning without a separate reward model."
  }
 ],
 "diffusion": [
  {
   "kind": "video",
   "req": true,
   "label": "How AI image generators work (Stable Diffusion / DALL-E)",
   "url": "https://www.youtube.com/watch?v=1CIpzeNxIhU",
   "m": 18,
   "why": "Noise added then removed, step by step, to make an image.",
   "yt": {
    "id": "1CIpzeNxIhU",
    "ch": "Computerphile"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Lilian Weng, What are diffusion models? (the forward and reverse process sections)",
   "url": "https://lilianweng.github.io/posts/2021-07-11-diffusion-models/",
   "m": 30,
   "why": "The forward and reverse process written out."
  }
 ]
});
