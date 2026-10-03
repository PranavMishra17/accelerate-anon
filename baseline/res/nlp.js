/* What to read and watch for each topic in the nlp field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("nlp", {
 "tokenization": [
  {
   "kind": "video",
   "req": true,
   "label": "Byte Pair Encoding Tokenization",
   "url": "https://www.youtube.com/watch?v=HEikzVL-lZU",
   "m": 6,
   "yt": {
    "id": "HEikzVL-lZU",
    "ch": "Hugging Face"
   },
   "why": "The merge loop that builds a BPE vocabulary, worked on a small corpus."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LLM Tokenizers Explained: BPE Encoding, WordPiece and SentencePiece",
   "url": "https://www.youtube.com/watch?v=hL4ZnAWSyuU",
   "m": 6,
   "yt": {
    "id": "hL4ZnAWSyuU",
    "ch": "DataMListic"
   },
   "why": "BPE, WordPiece and SentencePiece compared in one pass."
  },
  {
   "kind": "keep",
   "src": "course",
   "req": true,
   "label": "Hugging Face LLM course ch. 6: byte-pair encoding tokenization",
   "url": "https://huggingface.co/learn/llm-course/chapter6/5",
   "m": 20,
   "why": "Byte-pair encoding worked by hand."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Sennrich et al., Neural machine translation of rare words with subword units (BPE)",
   "url": "https://arxiv.org/abs/1508.07909",
   "m": 20,
   "why": "The paper that brought BPE to neural models."
  }
 ],
 "bow-tfidf": [
  {
   "kind": "video",
   "req": true,
   "label": "Term Frequency Inverse Document Frequency (TF-IDF) Explained",
   "url": "https://www.youtube.com/watch?v=zLMEnNbdh4Q",
   "m": 9,
   "yt": {
    "id": "zLMEnNbdh4Q",
    "ch": "DataMListic"
   },
   "why": "Why rare words get more weight, with the formula worked through."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Natural Language Processing|Bag Of Words Intuition",
   "url": "https://www.youtube.com/watch?v=IKgBLTeQQL8",
   "m": 10,
   "yt": {
    "id": "IKgBLTeQQL8",
    "ch": "Krish Naik"
   },
   "why": "Turning text into count vectors over a vocabulary."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Jurafsky and Martin, SLP 3e: ch. 4 Logistic Regression and Text Classification (skim)",
   "url": "https://web.stanford.edu/~jurafsky/slp3/4.pdf",
   "m": 30,
   "why": "Bag of words and weighting in a text classifier."
  }
 ],
 "word-embeddings": [
  {
   "kind": "video",
   "req": true,
   "label": "Word embedding and Word2Vec, clearly explained",
   "url": "https://www.youtube.com/watch?v=viZrOnJclY0",
   "m": 17,
   "why": "How word2vec learns vectors from context.",
   "yt": {
    "id": "viZrOnJclY0",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Jay Alammar, The Illustrated Word2vec",
   "url": "https://jalammar.github.io/illustrated-word2vec/",
   "m": 35,
   "why": "Illustrated: training and what the vectors encode."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Mikolov et al., Distributed representations of words and phrases (negative sampling)",
   "url": "https://arxiv.org/abs/1310.4546",
   "m": 20,
   "why": "Negative sampling and phrases, from the source."
  }
 ],
 "sentence-embeddings": [
  {
   "kind": "video",
   "req": true,
   "label": "Sentence Transformers - EXPLAINED!",
   "url": "https://www.youtube.com/watch?v=O3xbVmpdJwU",
   "m": 18,
   "yt": {
    "id": "O3xbVmpdJwU",
    "ch": "CodeEmporium"
   },
   "why": "Siamese BERT with pooling, and why it beats raw BERT for similarity."
  },
  {
   "kind": "video",
   "req": false,
   "label": "SimCSE: Simple Contrastive Learning of Sentence Embeddings - EMNLP 2021",
   "url": "https://www.youtube.com/watch?v=u-OQVQSvx38",
   "m": 12,
   "yt": {
    "id": "u-OQVQSvx38",
    "ch": "Princeton NLP"
   },
   "why": "Contrastive training from the authors, positives and in-batch negatives."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Reimers and Gurevych, Sentence-BERT (abstract and section 3)",
   "url": "https://arxiv.org/abs/1908.10084",
   "m": 25,
   "why": "Siamese training that makes sentence vectors comparable."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Sentence Transformers: training overview, losses and MatryoshkaLoss",
   "url": "https://www.sbert.net/docs/sentence_transformer/training_overview.html",
   "m": 20,
   "why": "The losses to train an embedding model, MatryoshkaLoss included."
  }
 ],
 "text-classification": [
  {
   "kind": "video",
   "req": true,
   "label": "SetFit: Few Shot Learning for Text Classification",
   "url": "https://www.youtube.com/watch?v=Pg-smN4fUy0",
   "m": 12,
   "yt": {
    "id": "Pg-smN4fUy0",
    "ch": "Rajistics - data science, AI, and machine learning"
   },
   "why": "A mid-ladder rung: a few labelled examples, no prompts, small model."
  },
  {
   "kind": "video",
   "req": false,
   "label": "High quality text classification with few training examples with SetFit",
   "url": "https://www.youtube.com/watch?v=IHalt4Nbf_Q",
   "m": 7,
   "yt": {
    "id": "IHalt4Nbf_Q",
    "ch": "Cohere"
   },
   "why": "A shorter pass on how SetFit fine-tunes and where it fits."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Hugging Face blog: SetFit, efficient few-shot learning without prompts",
   "url": "https://huggingface.co/blog/setfit",
   "m": 10,
   "why": "SetFit: a few labelled examples, no prompts."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Hugging Face docs: text classification with the Trainer (DistilBERT on IMDb)",
   "url": "https://huggingface.co/docs/transformers/tasks/sequence_classification",
   "m": 15,
   "why": "Fine-tuning DistilBERT for classification with the Trainer."
  }
 ],
 "classification-metrics": [
  {
   "kind": "video",
   "req": true,
   "label": "Machine learning fundamentals: the confusion matrix",
   "url": "https://www.youtube.com/watch?v=Kdsp6soqA7o",
   "m": 8,
   "why": "Where precision and recall come from in the matrix.",
   "yt": {
    "id": "Kdsp6soqA7o",
    "ch": "StatQuest with Josh Starmer"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Microsoft Learn: CLU evaluation metrics (precision, recall, F1, confusion matrix, None threshold)",
   "url": "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/evaluation-metrics",
   "m": 12,
   "why": "The metrics applied to intents, with the None threshold."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Guo et al., On calibration of modern neural networks",
   "url": "https://arxiv.org/abs/1706.04599",
   "m": 25,
   "why": "Why confidence scores need calibrating."
  }
 ],
 "out-of-scope": [
  {
   "kind": "read",
   "req": true,
   "label": "Larson et al., An evaluation dataset for intent classification and out-of-scope prediction (CLINC150)",
   "url": "https://arxiv.org/abs/1909.02027",
   "m": 15,
   "why": "The CLINC150 dataset and how out-of-scope inputs are scored."
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS docs: Lex V2 intent confidence scores",
   "url": "https://docs.aws.amazon.com/lexv2/latest/dg/using-intent-confidence-scores.html",
   "m": 5,
   "why": "How a production bot uses confidence thresholds."
  }
 ],
 "sequence-labelling": [
  {
   "kind": "video",
   "req": true,
   "label": "Introduction to Named Entity Tagging",
   "url": "https://www.youtube.com/watch?v=7CRyqwCZFY0",
   "m": 6,
   "yt": {
    "id": "7CRyqwCZFY0",
    "ch": "From Languages to Information"
   },
   "why": "A label per token, BIO tags, and how entities are read off them."
  },
  {
   "kind": "keep",
   "src": "course",
   "req": true,
   "label": "Hugging Face LLM course ch. 7: main NLP tasks, token classification first",
   "url": "https://huggingface.co/learn/llm-course/chapter7/1",
   "m": 5,
   "why": "Token classification: the task and the training loop."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Microsoft Learn: CLU best practices, entity components",
   "url": "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/best-practices",
   "m": 12,
   "why": "How entities are defined and labelled for a bot."
  }
 ],
 "attention": [
  {
   "kind": "video",
   "req": false,
   "label": "Attention in transformers, step-by-step",
   "url": "https://www.youtube.com/watch?v=eMlx5fFNoYc",
   "m": 27,
   "why": "Queries, keys, values and masking drawn step by step.",
   "yt": {
    "id": "eMlx5fFNoYc",
    "ch": "3Blue1Brown"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Sebastian Raschka, Understanding and coding self-attention, multi-head, causal and cross-attention",
   "url": "https://magazine.sebastianraschka.com/p/understanding-and-coding-self-attention",
   "m": 25,
   "why": "Self-attention, multi-head and causal attention in code."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Vaswani et al., Attention is all you need (skim sections 3.1 to 3.5)",
   "url": "https://arxiv.org/abs/1706.03762",
   "m": 15,
   "why": "Sections 3.1 to 3.5: the original attention equations."
  }
 ],
 "encoders-decoders": [
  {
   "kind": "video",
   "req": true,
   "label": "Which transformer architecture is best? Encoder-only vs Encoder-decoder vs Decoder-only models",
   "url": "https://www.youtube.com/watch?v=wOcbALDw0bU",
   "m": 8,
   "yt": {
    "id": "wOcbALDw0bU",
    "ch": "Efficient NLP"
   },
   "why": "Which shape fits which task, and why decoder-only took over."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Transformers, explained: Understand the model behind GPT, BERT, and T5",
   "url": "https://www.youtube.com/watch?v=SZorAJ4I-sA",
   "m": 10,
   "yt": {
    "id": "SZorAJ4I-sA",
    "ch": "Google Cloud Tech"
   },
   "why": "BERT, GPT and T5 placed on the same transformer."
  },
  {
   "kind": "keep",
   "src": "course",
   "req": true,
   "label": "Hugging Face LLM course ch. 1: how do transformers work?",
   "url": "https://huggingface.co/learn/llm-course/chapter1/4",
   "m": 15,
   "why": "Encoder, decoder and encoder-decoder families."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Jay Alammar, The Illustrated BERT, ELMo, and co.",
   "url": "https://jalammar.github.io/illustrated-bert/",
   "m": 25,
   "why": "Illustrated BERT: what the encoder learns and how it is tuned."
  }
 ],
 "llm-training": [
  {
   "kind": "video",
   "req": true,
   "label": "Large language models explained briefly",
   "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
   "m": 8,
   "why": "Pretraining and tuning in a short picture.",
   "yt": {
    "id": "LPZh9BOjkQs",
    "ch": "3Blue1Brown"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Jurafsky and Martin, SLP 3e: ch. 8 Post-training (instruction and preference tuning)",
   "url": "https://web.stanford.edu/~jurafsky/slp3/8.pdf",
   "m": 25,
   "why": "Instruction and preference tuning, written for students."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Rafailov et al., Direct preference optimization (DPO)",
   "url": "https://arxiv.org/abs/2305.18290",
   "m": 25,
   "why": "The DPO derivation and result."
  }
 ],
 "decoding": [
  {
   "kind": "video",
   "req": true,
   "label": "Greedy? Min-p? Beam Search? How LLMs Actually Pick Words - Decoding Strategies Explained",
   "url": "https://www.youtube.com/watch?v=o-_SZ_itxeA",
   "m": 12,
   "yt": {
    "id": "o-_SZ_itxeA",
    "ch": "AI Coffee Break with Letitia"
   },
   "why": "Greedy, beam, temperature, top-k and top-p on one running example."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LLM Prompt Engineering with Random Sampling: Temperature, Top-k, Top-p",
   "url": "https://www.youtube.com/watch?v=-BBulGM6xF0",
   "m": 9,
   "yt": {
    "id": "-BBulGM6xF0",
    "ch": "DataMListic"
   },
   "why": "What each sampling knob does to the distribution."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Holtzman et al., The curious case of neural text degeneration (nucleus sampling)",
   "url": "https://arxiv.org/abs/1904.09751",
   "m": 25,
   "why": "Why greedy and beam search degrade, and nucleus sampling."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Lilian Weng, Large transformer model inference optimization (KV cache cost)",
   "url": "https://lilianweng.github.io/posts/2023-01-10-inference-optimization/",
   "m": 9,
   "why": "The KV cache cost behind long generations."
  }
 ],
 "intents-entities": [
  {
   "kind": "read",
   "req": true,
   "label": "Microsoft Learn: CLU best practices (schema design, balance, near misses)",
   "url": "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/best-practices",
   "m": 12,
   "why": "Schema design, balance and near-miss intents."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google Cloud: Dialogflow CX intents",
   "url": "https://docs.cloud.google.com/dialogflow/cx/docs/concept/intent",
   "m": 5,
   "why": "How a platform models an intent."
  }
 ],
 "dialogue-state": [
  {
   "kind": "video",
   "req": false,
   "label": "[DLHLP 2020] Dialogue State Tracking (as Question Answering)",
   "url": "https://www.youtube.com/watch?v=tRDF_w700Uw",
   "m": 43,
   "yt": {
    "id": "tRDF_w700Uw",
    "ch": "Hung-yi Lee"
   },
   "why": "What the state holds and how it is tracked turn by turn; watch the first 15 minutes."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google Cloud: Dialogflow CX pages, forms and parameters",
   "url": "https://docs.cloud.google.com/dialogflow/cx/docs/concept/page",
   "m": 5,
   "why": "Pages, forms and parameters as slot filling."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Li et al., LLMs as zero-shot dialogue state trackers through function calling (FnCTOD)",
   "url": "https://arxiv.org/abs/2402.10466",
   "m": 25,
   "why": "An LLM as the state tracker, through function calling."
  }
 ],
 "conversation-design": [
  {
   "kind": "video",
   "req": false,
   "label": "Everything You Ever Wanted to Know About Conversation Design - Cathy Pearl, Google",
   "url": "https://www.youtube.com/watch?v=vafh50qmWMM",
   "m": 26,
   "yt": {
    "id": "vafh50qmWMM",
    "ch": "SAIConference"
   },
   "why": "Sample dialogs, error recovery, confirmation and handoff from a Google conversation designer."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google conversation design: errors",
   "url": "https://developers.google.com/assistant/conversation-design/errors",
   "m": 10,
   "why": "How to recover from errors and no-matches."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google conversation design: confirmations",
   "url": "https://developers.google.com/assistant/conversation-design/confirmations",
   "m": 6,
   "why": "When and how to confirm."
  }
 ],
 "nlu-llm-hybrid": [
  {
   "kind": "video",
   "req": false,
   "label": "What is Tool Calling? Connecting LLMs to Your Data",
   "url": "https://www.youtube.com/watch?v=h8gMhXYAv1k",
   "m": 5,
   "yt": {
    "id": "h8gMhXYAv1k",
    "ch": "IBM Technology"
   },
   "why": "How an LLM picks and fills a function, the function-calling pattern."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Faster LLM Function Calling - Dynamic Routes",
   "url": "https://www.youtube.com/watch?v=QsZm0XCysoQ",
   "m": 7,
   "yt": {
    "id": "QsZm0XCysoQ",
    "ch": "James Briggs"
   },
   "why": "A fast embedding router in front of the LLM, the hybrid routing idea."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Arora et al., Intent detection in the age of LLMs (hybrid SetFit and LLM routing)",
   "url": "https://arxiv.org/abs/2410.01627",
   "m": 25,
   "why": "Routing between a small classifier and an LLM."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Rasa docs: CALM overview",
   "url": "https://rasa.com/docs/rasa-pro/calm/",
   "m": 3,
   "why": "How CALM puts an LLM beside business rules."
  }
 ],
 "error-analysis": [
  {
   "kind": "video",
   "req": true,
   "label": "Machine Learning Fundamentals: The Confusion Matrix",
   "url": "https://www.youtube.com/watch?v=Kdsp6soqA7o",
   "m": 8,
   "yt": {
    "id": "Kdsp6soqA7o",
    "ch": "StatQuest with Josh Starmer"
   },
   "why": "Reading a confusion matrix, the base for per-intent precision and recall."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Rasa docs: conversation-driven development",
   "url": "https://rasa.com/docs/rasa/conversation-driven-development/",
   "m": 4,
   "why": "Reading real conversations to decide what to fix."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kore.ai docs: training validations (confusion matrix, k-fold, conflict warnings)",
   "url": "https://docs.kore.ai/xo/automation/natural-language/training/training-validations/",
   "m": 5,
   "why": "Confusion matrices, k-fold and conflict warnings in a platform."
  }
 ],
 "assistant-metrics": [
  {
   "kind": "read",
   "req": true,
   "label": "Rasa blog: measuring AI agent performance in the contact center",
   "url": "https://rasa.com/blog/measure-ai-agent-performance-in-the-contact-center",
   "m": 6,
   "why": "Containment, resolution and the numbers a bad bot can game."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Yao et al., tau-bench: tool-agent-user interaction benchmark",
   "url": "https://arxiv.org/abs/2406.12045",
   "m": 30,
   "why": "A benchmark that scores task success, not just replies."
  }
 ]
});
