BASELINE.field({
  id: "nlp", name: "NLP and conversational AI", short: "NLP", layer: "Intelligence",
  ink: "#3F4A8C", inkDark: "#A3ADE6",
  lede: "How text becomes numbers, how models classify and label it, how transformers and LLMs work underneath, and how a virtual assistant is built and improved in production.",
  overview: [
    "Natural language processing covers turning text into units and vectors, the tasks done on it (classification, entity extraction, question answering, summarisation, translation, retrieval, dialogue) and the models that do them, from TF-IDF and logistic regression to BERT and LLMs. Conversational AI is the applied branch that builds virtual assistants: intents and entities, dialogue state, conversation design, and the loop of error analysis that improves an assistant after launch. Job titles are NLP engineer, conversational AI engineer, NLU or dialogue engineer, and conversation designer.",
    "It sits on top of ML, where the transformer and embeddings live in general, and beside AI engineering, where RAG, tool calling and evals live. Since 2023 the industry has moved from trained intent classifiers on Dialogflow, Lex, CLU and Rasa toward hybrids: a fast classifier or rules for the confident and the high-risk paths, an LLM to understand the long tail, retrieval for FAQ, and deterministic code for anything that moves money. The older ideas did not go away; they became the routers and the guard rails.",
    "Read it in four parts, in order: text as data, then classifying and labelling, then transformers and LLMs, then virtual assistants. The map follows one user message through an assistant. If you can explain TF-IDF, contrastive embeddings, calibration, the three confidence bands and containment against resolution in a sentence each, most interview questions here become follow-ups."
  ],
  diagram: {
    nodes: [
      { id: "bow-tfidf", label: "TF-IDF baseline", sub: "sparse word counts", col: 0, row: 0 },
      { id: "word-embeddings", label: "Word vectors", sub: "word2vec, GloVe", col: 0, row: 1 },
      { id: "attention", label: "Attention", sub: "the encoder inside", col: 0, row: 2 },
      { id: "encoders-decoders", label: "BERT or GPT", sub: "encoder or decoder", col: 0, row: 3 },
      { id: "tokenization", label: "Tokens", sub: "text to subword ids", col: 1, row: 0 },
      { id: "sentence-embeddings", label: "Embedding", sub: "one vector per message", col: 1, row: 1 },
      { id: "text-classification", label: "Intent classifier", sub: "top intent and score", col: 1, row: 2 },
      { id: "out-of-scope", label: "Confidence bands", sub: "act, confirm, fall back", col: 1, row: 3 },
      { id: "dialogue-state", label: "Dialogue state", sub: "slots filled so far", col: 1, row: 4 },
      { id: "conversation-design", label: "Next prompt", sub: "ask, confirm, repair", col: 1, row: 5 },
      { id: "sequence-labelling", label: "Entity spans", sub: "a label per token", col: 2, row: 2 },
      { id: "nlu-llm-hybrid", label: "LLM fallback", sub: "uncertain turns only", col: 2, row: 3 },
      { id: "assistant-metrics", label: "Metrics", sub: "containment, resolution", col: 2, row: 4 },
      { id: "error-analysis", label: "Error analysis", sub: "confusions, clusters", col: 2, row: 5 }
    ],
    edges: [
      ["bow-tfidf", "word-embeddings", "dense"], ["word-embeddings", "attention", "in context"], ["attention", "encoders-decoders"],
      ["word-embeddings", "sentence-embeddings", "pooled, trained"], ["encoders-decoders", "text-classification", "fine-tuned"],
      ["tokenization", "sentence-embeddings"], ["sentence-embeddings", "text-classification"],
      ["text-classification", "out-of-scope", "score"], ["out-of-scope", "dialogue-state", "intent"],
      ["tokenization", "sequence-labelling", "tokens"], ["sequence-labelling", "dialogue-state", "slot values"],
      ["out-of-scope", "nlu-llm-hybrid", "unsure"], ["nlu-llm-hybrid", "dialogue-state"],
      ["dialogue-state", "conversation-design"], ["conversation-design", "error-analysis", "transcripts"],
      ["assistant-metrics", "error-analysis", "where it fails"]
    ],
    cap: "**One user message through a virtual assistant: down the middle from text to tokens, a vector, an intent with a score, a state and the next prompt.** The left column is the theory inside the classifier; the right column is what runs beside it: entity extraction, an LLM for the turns the classifier is unsure of, and the metrics and error analysis that improve it after launch. Click a box to open it."
  },
  start: [
    { label: "Jurafsky and Martin, Speech and Language Processing (3e draft, August 2026): ch. 2 Words and Tokens, 4 Text Classification, 5 Embeddings, 7 Transformers", url: "https://web.stanford.edu/~jurafsky/slp3/", m: 150,
      why: "The textbook map of the field, free as PDFs. Chapter numbers changed in the 2026 release; use these, not older ones." },
    { label: "Hugging Face LLM course, chapter 1: how transformers work (encoder, decoder, encoder-decoder)", url: "https://huggingface.co/learn/llm-course/chapter1/4", m: 15,
      why: "Which architecture fits which NLP task, in plain terms, with runnable notebooks in the chapters after it." },
    { label: "Microsoft Learn: CLU best practices (intent and entity schema, balance, out-of-scope)", url: "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/best-practices", m: 12,
      why: "How a production NLU team designs intents and entities, balances data and handles overconfident models." },
    { label: "Google conversation design: errors (no-input, no-match, escalation)", url: "https://developers.google.com/assistant/conversation-design/errors", m: 10,
      why: "The core of conversation design in one page: how an assistant recovers when it did not understand." }
  ],
  clusters: [
    { name: "Text as data", line: "How raw text becomes units, then numbers a model can use.",
      topics: [
        { id: "tokenization", name: "Tokenization: BPE, WordPiece, SentencePiece",
          line: "Splitting text into subword pieces from a fixed vocabulary, the first step of every model.",
          body: [
            "Models read integer ids, not words. Word vocabularies explode and cannot cover unseen words; characters make sequences long. **Subword** tokenizers sit between: a vocabulary of 30,000 to 200,000 pieces that composes any word. **BPE** starts from characters (or the 256 bytes) and repeatedly merges the most frequent adjacent pair; the ordered merge list is the tokenizer. **Byte-level BPE** never meets an unknown token.",
            "**WordPiece** (BERT) picks merges by likelihood and marks continuations with `##`. **SentencePiece** reads the raw stream, spaces included, so it needs no language-specific pre-splitting, and implements BPE or unigram. Token count sets cost, context use and latency."
          ],
          uses: [
            "**BERT**: a 30,000-piece WordPiece vocabulary, so `playing` can become `play` and `##ing`.",
            "**GPT-2 and RoBERTa**: byte-level BPE over 256 base bytes, so code, emoji and typos always encode.",
            "**T5 and the first Llama models**: SentencePiece trained on raw text, with spaces kept as a visible symbol.",
            "**OpenAI tiktoken**: the byte-level BPE tokenizers that API usage is counted and billed in."
          ],
          example: "Corpus: `low` x5, `lower` x2, `newest` x6, `widest` x3, split into characters. The pairs `e s` and `s t` tie at 9 occurrences, so merge `e s` into `es`, then `es t` into `est`. After a few more merges `newest` is `new` + `est`, and an unseen word like `lowest` still encodes as `low` + `est`, with no unknown token.",
          nuance: "Tokenization explains many LLM quirks: miscounted letters, shaky arithmetic on numbers split at odd places, and non-English text costing more tokens for the same meaning. When a model fails on spelling or digits, look at the tokens first.",
          read: [
            { label: "Hugging Face LLM course ch. 6: byte-pair encoding tokenization", url: "https://huggingface.co/learn/llm-course/chapter6/5", m: 20 },
            { label: "Sennrich et al., Neural machine translation of rare words with subword units (BPE)", url: "https://arxiv.org/abs/1508.07909", m: 20 }
          ],
          see: [
            { label: "Coding primer: a BPE tokenizer in code", href: "CODING.html#bpe" },
            { label: "Deep learning path: stage 12, tokens and embeddings", href: "DEEP-LEARNING.html#/plan/stage-12" }
          ],
          tags: ["bpe", "wordpiece", "sentencepiece", "subword", "vocabulary", "tiktoken"] },
        { id: "bow-tfidf", name: "Bag of words, n-grams and TF-IDF",
          line: "Count words, weight the rare ones up: the sparse baseline that still often wins.",
          body: [
            "**Bag of words** turns a text into a vector of word counts over the vocabulary, ignoring order. **N-grams** add local order by counting pairs or triples, so `not good` becomes one feature. **TF-IDF** weights each count by how rare the term is across documents, tf x log(N / df): `the` scores near zero and `chargeback` scores high. The vectors are sparse, tens of thousands of dimensions with a few dozen non-zero.",
            "TF-IDF with logistic regression or a linear SVM trains in seconds on a CPU, is readable through its weights, and is the baseline every text classifier should beat. **BM25** is its retrieval cousin, adding saturation on term frequency and length normalisation. It fails on synonyms and paraphrase, which is what dense embeddings fix."
          ],
          uses: [
            "**scikit-learn**: `TfidfVectorizer` with `LogisticRegression` is the standard first text classifier, a few lines of code.",
            "**Elasticsearch, OpenSearch and Lucene**: rank documents with BM25 by default.",
            "**Hybrid retrieval**: BM25 runs beside dense vectors so exact terms such as order numbers and product codes still match."
          ],
          example: "Ten thousand support tickets; `refund` appears in 500 of them. In one ticket it occurs 3 times, so its weight is 3 x ln(10,000 / 500) = 3 x 3.0 = 9.0. `the` appears in all 10,000, so its idf is ln(1) = 0 and it drops out. A logistic regression on these vectors learns that `refund` and `money back` both point to the billing intent.",
          nuance: "A strong TF-IDF baseline tells you how hard the problem is. If it reaches 90% and a fine-tuned encoder reaches 92%, the extra latency and serving work may not be worth two points. Run it first, always.",
          read: [{ label: "Jurafsky and Martin, SLP 3e: ch. 4 Logistic Regression and Text Classification (skim)", url: "https://web.stanford.edu/~jurafsky/slp3/4.pdf", m: 30 }],
          see: [
            { label: "AI engineering: hybrid search and reranking", href: "BASELINE.html#/ai/hybrid-search-reranking" },
            { label: "System design guide: inverted index", href: "SYSTEM%20DESIGN.html#/patterns/search/inverted" }
          ],
          tags: ["bag of words", "n-grams", "tf-idf", "bm25", "sparse", "baseline"] },
        { id: "word-embeddings", name: "Word embeddings: word2vec, GloVe, fastText",
          line: "One dense vector per word, learned from the company the word keeps.",
          body: [
            "The **distributional hypothesis**: words used in similar contexts have similar meanings. **word2vec** (2013) learns a vector per word by prediction: skip-gram predicts context words from the centre word, CBOW the reverse. A full softmax over the vocabulary is expensive, so **negative sampling** turns it into binary classification: raise the score of a true (word, context) pair, lower it for k random words. Typical settings are 300 dimensions and a window of about 5.",
            "**GloVe** factorises a global co-occurrence matrix so dot products approximate log co-occurrence counts. **fastText** builds a word from character n-grams, so it embeds typos and unseen words. All three are **static**: `bank` has one vector, river or lender. Contextual models (ELMo, then BERT) give a vector per occurrence."
          ],
          uses: [
            "**fastText**: Meta's library, with pretrained vectors for many languages and fast supervised text classifiers.",
            "**spaCy**: ships static word vectors in its medium and large English pipelines, used for similarity and as features.",
            "**Gensim**: trains word2vec and fastText on your own corpus, useful for domain vocabularies such as clinical or legal text."
          ],
          example: "Skip-gram with window 2 on `the bank approved my loan`: the centre word `approved` yields the pairs (approved, the), (approved, bank), (approved, my), (approved, loan). For each true pair the model also scores, say, 5 random words such as (approved, giraffe) and pushes those down. After millions of sentences `loan` and `mortgage` sit close, because they share contexts.",
          nuance: "Similar contexts do not mean the same meaning: antonyms like `hot` and `cold` land close because they appear in the same places. Static vectors also carry corpus biases and cannot separate senses, which is why contextual encoders replaced them for most tasks.",
          read: [
            { label: "Jay Alammar, The Illustrated Word2vec", url: "https://jalammar.github.io/illustrated-word2vec/", m: 35 },
            { label: "Mikolov et al., Distributed representations of words and phrases (negative sampling)", url: "https://arxiv.org/abs/1310.4546", m: 20 }
          ],
          see: [
            { label: "ML: embeddings, the general idea", href: "BASELINE.html#/ml/embeddings" },
            { label: "Deep learning path: stage 12, tokens and embeddings", href: "DEEP-LEARNING.html#/plan/stage-12" }
          ],
          tags: ["word2vec", "skip-gram", "negative sampling", "glove", "fasttext", "distributional hypothesis"] },
        { id: "sentence-embeddings", name: "Sentence embeddings and contrastive training",
          line: "One vector per sentence, trained so that cosine similarity tracks meaning.",
          body: [
            "Mean-pooled raw BERT gives poor similarity: it was trained to fill masked tokens, and its vectors crowd into a narrow cone (anisotropy). **Sentence-BERT** fine-tunes a siamese encoder on sentence pairs so cosine works, and cut finding the closest pair among 10,000 sentences from about 65 hours to about 5 seconds. Modern models train **contrastively** with an InfoNCE loss: pull a query and its positive together, push other texts apart. With **in-batch negatives** every other example in the batch is a free negative, so large batches and mined **hard negatives** help.",
            "**Matryoshka** training makes the first k dimensions usable on their own, so a vector can be cut to 256 dimensions and renormalised. On unit vectors, dot product, cosine and L2 give the same ranking."
          ],
          uses: [
            "**Sentence-Transformers**: the open library for training and running these models, with contrastive losses and MatryoshkaLoss.",
            "**OpenAI, Cohere and Voyage embedding APIs**: hosted models; open ones include BGE, E5 and GTE.",
            "**FAISS and pgvector**: store the vectors and find nearest neighbours with flat, HNSW or IVF indexes.",
            "**Intent routers**: embed each user message and compare it with labelled examples or class centroids."
          ],
          example: "A batch of 64 (question, answer) pairs. For question 1 its own answer is the positive and the other 63 answers are negatives. At temperature 0.05, a positive at cosine 0.80 and a negative at 0.70 differ by 2.0 in logits, so the loss pushes hard on that near miss. Truncating the trained 768-dimension vectors to 256 cuts index memory by two thirds.",
          nuance: "Leaderboard gaps of a point or two on MTEB rarely survive on your data. Build 100 to 300 labelled queries from real traffic and compare recall at k. Switching models later means re-embedding everything, since vectors from two models do not share a space.",
          read: [
            { label: "Reimers and Gurevych, Sentence-BERT (abstract and section 3)", url: "https://arxiv.org/abs/1908.10084", m: 25 },
            { label: "Sentence Transformers: training overview, losses and MatryoshkaLoss", url: "https://www.sbert.net/docs/sentence_transformer/training_overview.html", m: 20 }
          ],
          see: [
            { label: "ML: embeddings", href: "BASELINE.html#/ml/embeddings" },
            { label: "AI engineering: chunking and embeddings", href: "BASELINE.html#/ai/chunking-embeddings" },
            { label: "Data: vector databases and indexes", href: "BASELINE.html#/data/vector-db" },
            { label: "Coding primer: embeddings and vector search", href: "CODING.html#embed" }
          ],
          tags: ["sbert", "contrastive", "infonce", "in-batch negatives", "matryoshka", "mteb", "cosine"] }
      ] },
    { name: "Classifying and labelling text", line: "Labels on whole texts and on single tokens, and knowing when to trust them.",
      topics: [
        { id: "text-classification", name: "Text classification: the ladder of models",
          line: "From TF-IDF to SetFit to an LLM prompt: pick the cheapest rung that works.",
          body: [
            "Climb from the cheapest. **TF-IDF with logistic regression**: seconds on a CPU. **Frozen sentence embeddings with a logistic head or kNN**: strong with little data, and new classes are cheap. **SetFit**: contrastively fine-tunes a sentence transformer on pairs built from 8 to 64 examples per class, then fits a head. A **fine-tuned encoder** (BERT, RoBERTa, DeBERTa, or DistilBERT when latency matters) once you have thousands of examples. **Zero-shot NLI**: one forward pass per label. **LLM prompting** with structured output: no training, handles changing labels, slower and paid per call.",
            "Multi-class means one label, softmax and cross-entropy. Multi-label means independent sigmoids, binary cross-entropy and a threshold per label. For hundreds of overlapping labels, retrieve the top 10 candidates by embedding, then let a reranker or LLM choose."
          ],
          uses: [
            "**SetFit**: few-shot classifiers competitive with much larger models at 8 to 64 examples per class, with no prompts.",
            "**Hugging Face Trainer**: fine-tunes DistilBERT or RoBERTa for sequence classification in one short script.",
            "**Dialogflow CX, Amazon Lex and Microsoft CLU**: train intent classifiers from tens of example phrases per intent, behind a console.",
            "**LLM labelling, then distillation**: label with a large model, then train a small encoder that serves in milliseconds."
          ],
          example: "200 intents, 50 examples each, a 50 ms budget. TF-IDF with logistic regression gives a baseline in a minute. Sentence embeddings with a logistic head train in seconds and handle paraphrases better. A fine-tuned DistilBERT on the 10,000 examples serves on a CPU in tens of milliseconds. Score each on the same stratified test set by macro-F1 and keep the cheapest within a point of the best.",
          nuance: "Most production gains come from data, not model size: fixing the few percent of mislabelled examples, merging intents that collide, adding real utterances from logs. An LLM wins when labels change or data is scarce; an encoder wins on volume, latency and cost.",
          read: [
            { label: "Hugging Face blog: SetFit, efficient few-shot learning without prompts", url: "https://huggingface.co/blog/setfit", m: 10 },
            { label: "Hugging Face docs: text classification with the Trainer (DistilBERT on IMDb)", url: "https://huggingface.co/docs/transformers/tasks/sequence_classification", m: 15 }
          ],
          see: [
            { label: "ML: linear models, trees and gradient boosting", href: "BASELINE.html#/ml/classic-models" },
            { label: "AI engineering: when fine-tuning beats prompting", href: "BASELINE.html#/ai/fine-tuning-vs-prompting" }
          ],
          tags: ["classification", "setfit", "distilbert", "logistic regression", "multi-label", "zero-shot", "distillation"] },
        { id: "classification-metrics", name: "Precision, recall, F1, confusion matrices and calibration",
          line: "Per-class scores, the matrix of which classes collide, and whether confidence means anything.",
          body: [
            "**Precision** is how much of what you flagged was right; **recall** is how much of what was there you found; **F1** is their harmonic mean. **Micro** averaging pools all decisions, so big classes dominate; **macro** averages per-class F1, so a rare intent counts as much as a common one. Report macro when classes are imbalanced. The **confusion matrix** puts true labels on rows and predictions on columns; its off-diagonal cells name which classes get mistaken for each other.",
            "A model is **calibrated** if its 80% predictions are right 80% of the time. Fine-tuned networks are overconfident. Measure with a reliability diagram and **expected calibration error**; fix with **temperature scaling**, one scalar fitted on validation data that leaves the top prediction unchanged."
          ],
          uses: [
            "**Microsoft CLU**: reports per-intent and per-entity precision, recall and F1, with a confusion matrix, after every training run.",
            "**Kore.ai and Cognigy**: flag overlapping and weak intents from confusion matrices and per-intent scores.",
            "**scikit-learn**: `classification_report` and `confusion_matrix` give the same numbers for any model in two calls."
          ],
          example: "1,000 test messages: 950 `check_balance`, 50 `report_fraud`. A model that always says `check_balance` scores 95% accuracy and 95% micro-F1, but macro-F1 is about 0.49: 0.97 for balance, 0 for fraud. A real model catches 40 of the 50 fraud messages with 10 false alarms: fraud precision 0.80, recall 0.80. The rare class is the one that matters.",
          nuance: "Every downstream rule (route, confirm, escalate) reads the confidence, so an uncalibrated model makes thresholds meaningless. Recalibrate after every retrain: vendor scores such as Lex's are comparative, not probabilities, and shift between versions.",
          read: [
            { label: "Microsoft Learn: CLU evaluation metrics (precision, recall, F1, confusion matrix, None threshold)", url: "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/evaluation-metrics", m: 12 },
            { label: "Guo et al., On calibration of modern neural networks", url: "https://arxiv.org/abs/1706.04599", m: 25 }
          ],
          see: [
            { label: "ML: evaluation and data splits", href: "BASELINE.html#/ml/evaluation-splits" },
            { label: "AI engineering: evaluation", href: "BASELINE.html#/ai/evaluation" }
          ],
          tags: ["precision", "recall", "f1", "macro", "micro", "confusion matrix", "calibration", "ece", "temperature scaling"] },
        { id: "out-of-scope", name: "Out-of-scope detection and confidence thresholds",
          line: "Knowing when a message matches none of your intents, and what to do near the line.",
          body: [
            "Users ask for things the assistant does not support. **CLINC150** (2019) showed that classifiers doing well on supported intents struggle on out-of-scope queries. Options, often combined: a threshold on the top softmax score (needs calibration); an explicit **none** class trained on near misses, greetings, bare yes or no and numbers; distance from the nearest class centroid in embedding space; and an LLM judge for borderline cases.",
            "Production systems use **three bands**: act above a high threshold, confirm or disambiguate in the middle, fall back below. Cognigy's defaults are 0.4 to accept and 0.2 to reconfirm. Check the **margin** between the top two intents as well: 0.75 against 0.72 is ambiguous, 0.95 against 0.65 is not. Evaluate with out-of-scope recall and false-accept rate at a fixed in-scope accuracy."
          ],
          uses: [
            "**Microsoft CLU**: a None intent with a None score threshold; a top intent scoring below it is replaced by None.",
            "**Amazon Lex V2**: AMAZON.FallbackIntent fires when every intent scores below the confidence threshold; up to four alternates come back too.",
            "**Dialogflow CX**: a default negative intent holds out-of-scope phrases, and no-match events fire when nothing matches.",
            "**Cognigy**: three thresholds per flow or project: confidence, reconfirmation, and not found below."
          ],
          example: "A bank bot with thresholds 0.70 and 0.40. `What's my balance` scores 0.93 on `check_balance`: act. `I lost it` scores 0.55 on `report_lost_card`: ask `Do you mean your card?`. `Can you book me a flight` scores 0.22 on its best intent: fall back with options. Lowering the top threshold to 0.60 raises containment and wrong actions together, so set it per intent from the precision curve.",
          nuance: "A threshold is useless if the model is overconfident: CLU warns a model can predict the wrong intent at 1.00. Train the none class with near misses from your own domain, such as `buy a book` in a flight bot, not random sentences that are easy to reject.",
          read: [
            { label: "Larson et al., An evaluation dataset for intent classification and out-of-scope prediction (CLINC150)", url: "https://arxiv.org/abs/1909.02027", m: 15 },
            { label: "AWS docs: Lex V2 intent confidence scores", url: "https://docs.aws.amazon.com/lexv2/latest/dg/using-intent-confidence-scores.html", m: 5 }
          ],
          see: [
            { label: "System design guide: enterprise virtual assistant", href: "SYSTEM%20DESIGN.html#/designs/virtual-assistant" },
            { label: "AI engineering: guardrails and prompt injection", href: "BASELINE.html#/ai/guardrails" }
          ],
          tags: ["out-of-scope", "fallback", "none intent", "threshold", "ood", "clinc150", "disambiguation"] },
        { id: "sequence-labelling", name: "Sequence labelling: NER and slot filling",
          line: "A label per token, which is how entities and slot values are pulled out of text.",
          body: [
            "Where classification labels a whole message, **sequence labelling** labels each token. The **BIO** scheme marks the beginning, inside and outside of spans: in `fly from New York`, `New` is B-from_city, `York` is I-from_city, the rest O. Classic models were HMMs and **CRFs** over hand-built features, then BiLSTM-CRF; now a fine-tuned encoder with a token-classification head, often trained jointly with the intent head. Subwords complicate it: label the first piece of each word and ignore the rest in the loss.",
            "Score at the **entity** level (exact span and type), not per token. In assistants, learned extraction handles context-dependent entities, while dates, numbers and IDs go to deterministic parsers and regex with validation. LLMs now extract slots through a JSON schema."
          ],
          uses: [
            "**spaCy**: production NER pipelines, with rule-based entity patterns and trained models side by side.",
            "**Hugging Face token classification**: fine-tunes BERT-style models for NER, with the label alignment step in its course.",
            "**Microsoft CLU**: entities combine prebuilt, list, regex and learned components, with required components to stop false matches.",
            "**Amazon Lex slots**: custom slot types with synonyms resolve values such as `NYC` to one reference value."
          ],
          example: "`Book 3 tickets to Boston at 3 PM`. A prebuilt number entity alone fires on both 3s. CLU's fix: make ticket quantity a learned entity that requires the number component, so only the 3 before `tickets` counts. Entity-level scoring then marks a predicted span `Boston at` as wrong, even though one of its two tokens is right.",
          nuance: "A right intent with a wrong entity still fails the task, so evaluate entities separately. For account numbers, order IDs and card digits, do not trust a learned model: extract with a pattern and validate against the system of record.",
          read: [
            { label: "Hugging Face LLM course ch. 7: main NLP tasks, token classification first", url: "https://huggingface.co/learn/llm-course/chapter7/1", m: 5 },
            { label: "Microsoft Learn: CLU best practices, entity components", url: "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/best-practices", m: 12 }
          ],
          see: [
            { label: "AI engineering: structured output", href: "BASELINE.html#/ai/structured-output" },
            { label: "Coding primer: structured output and function calling", href: "CODING.html#structured" }
          ],
          tags: ["ner", "bio", "crf", "token classification", "slot filling", "entities"] }
      ] },
    { name: "Transformers and LLMs", line: "The architecture under every modern NLP model, at the depth an interview probes.",
      topics: [
        { id: "attention", name: "Attention, the details interviews probe",
          line: "Why attention replaced recurrence, and the reasons behind scaling, heads, positions and norms.",
          body: [
            "RNN encoder-decoders squeezed a sentence into one fixed vector, and long sentences lost detail. **Attention**, first used for translation, let the decoder look back at every encoder state; the 2017 Transformer kept only attention. Scores are query-key dot products **divided by sqrt(d_k)**: with unit-variance entries a dot product has variance d_k, and large scores saturate softmax and kill gradients. **Multi-head** attention splits d_model into h heads of d_model / h at the same total cost.",
            "Order comes from position: sinusoidal, learned (BERT, capped at 512), or **RoPE**, which rotates queries and keys so scores depend on relative distance (Llama). A **causal mask** hides future tokens. **Pre-LN** normalises before each sublayer and trains stably without warmup. Per layer, about 4d² weights sit in attention and 8d² in the feed-forward block."
          ],
          uses: [
            "**BERT-base**: 12 layers, hidden size 768, 12 heads, about 110M parameters, learned positions up to 512 tokens.",
            "**Llama models**: decoder-only with RoPE, pre-normalisation (RMSNorm) and, in larger versions, grouped-query attention to shrink the KV cache.",
            "**FlashAttention**: computes exact attention in tiles held in fast GPU memory, cutting memory traffic rather than the quadratic arithmetic."
          ],
          example: "Check the 12d² rule on GPT-3: 96 layers, d_model 12,288. 12 x 96 x 12,288² is about 174 billion, against the published 175B; embeddings make up most of the rest. With d_k = 64, raw dot products have a standard deviation of 8; dividing by sqrt(64) = 8 brings them back to about 1, where softmax still has useful gradients.",
          nuance: "Interviewers probe the why, not the formula: why scale by sqrt(d_k), why several heads, why RoPE stretches to longer context better than learned positions, and why attention is quadratic in length while the KV cache grows linearly.",
          read: [
            { label: "Sebastian Raschka, Understanding and coding self-attention, multi-head, causal and cross-attention", url: "https://magazine.sebastianraschka.com/p/understanding-and-coding-self-attention", m: 25 },
            { label: "Vaswani et al., Attention is all you need (skim sections 3.1 to 3.5)", url: "https://arxiv.org/abs/1706.03762", m: 15 }
          ],
          see: [
            { label: "ML: transformers and attention, the core", href: "BASELINE.html#/ml/transformers" },
            { label: "Coding primer: a transformer block in code", href: "CODING.html#transformer" },
            { label: "Inference: attention kernels and FlashAttention", href: "BASELINE.html#/inference/attention-kernels" },
            { label: "Deep learning path: stage 13, attention and transformers", href: "DEEP-LEARNING.html#/plan/stage-13" }
          ],
          tags: ["attention", "sqrt dk", "multi-head", "rope", "pre-ln", "causal mask", "rmsnorm"] },
        { id: "encoders-decoders", name: "Encoders, decoders and encoder-decoders",
          line: "BERT reads, GPT writes, T5 does both: which shape fits which NLP task.",
          body: [
            "**Encoder-only** models (BERT, RoBERTa, DeBERTa) attend in both directions and are pretrained with **masked language modelling**: hide about 15% of tokens and predict them. They give rich token and sentence representations, so they own classification, NER, embeddings and reranking. **Decoder-only** models (GPT, Llama, Claude) use a causal mask and next-token prediction; they generate, and at scale do most tasks from a prompt. **Encoder-decoder** models (T5, BART) read the input with an encoder and generate with a decoder that cross-attends to it; T5 pretrains with span corruption and casts every task as text to text.",
            "For a classifier inside a tight latency budget, an encoder still wins. For changing tasks and generation, a decoder."
          ],
          uses: [
            "**Cross-encoder rerankers**: BERT-style encoders that read a query and a passage together and output one relevance score.",
            "**Production NLU**: fine-tuned encoders such as DistilBERT classify intents and tag entities in milliseconds.",
            "**T5 and BART**: encoder-decoders for summarisation, translation and structured rewriting.",
            "**GPT, Llama and Claude**: decoder-only models that classify, extract and hold dialogue from instructions."
          ],
          example: "Label 2 million support messages a day into 40 intents. A 66M-parameter DistilBERT fine-tuned on 20,000 labels runs one forward pass over a short message. A decoder LLM must read a prompt listing all 40 intents for every message, with billions of parameters, far more compute per message. Teams often label with the LLM, then train the encoder.",
          nuance: "BERT cannot generate fluently, and GPT-style models see only left context in training. Instruction-tuned decoders blurred the line, but for high-volume understanding a small encoder remains the cheaper tool.",
          read: [
            { label: "Hugging Face LLM course ch. 1: how do transformers work?", url: "https://huggingface.co/learn/llm-course/chapter1/4", m: 15 },
            { label: "Jay Alammar, The Illustrated BERT, ELMo, and co.", url: "https://jalammar.github.io/illustrated-bert/", m: 25 }
          ],
          see: [
            { label: "ML: pretraining and scaling", href: "BASELINE.html#/ml/pretraining" },
            { label: "AI engineering: hybrid search and reranking", href: "BASELINE.html#/ai/hybrid-search-reranking" }
          ],
          tags: ["bert", "gpt", "t5", "mlm", "causal lm", "encoder-decoder", "cross-encoder"] },
        { id: "llm-training", name: "How an LLM is made: pretraining to preference tuning",
          line: "Next-token pretraining, then instructions, then preferences: what each stage adds.",
          body: [
            "**Pretraining** predicts the next token over trillions of tokens; loss falls as a power law in parameters, data and compute (Kaplan, 2020). **Chinchilla** (2022) showed compute-optimal training scales data with model size, about 20 tokens per parameter (70B on 1.4T tokens), so earlier models were undertrained; labs now train small models far past that because serving cost dominates. Training compute is about 6 x parameters x tokens FLOPs.",
            "**Instruction tuning** (SFT) on prompt and response pairs teaches format and following more than knowledge. **RLHF** trains a reward model on human rankings, then optimises the policy with PPO and a KL penalty; InstructGPT's 1.3B model was preferred over 175B GPT-3. **DPO** drops the reward model and RL loop for a classification-style loss on preferred against rejected pairs."
          ],
          uses: [
            "**InstructGPT and ChatGPT**: SFT then RLHF turned GPT-3 into an assistant people preferred.",
            "**Llama, Qwen and Mistral**: ship base and instruct versions, so you can compare what post-training adds.",
            "**Hugging Face TRL**: trainers for SFT, DPO and PPO on open models."
          ],
          example: "A 7B model trained compute-optimally wants about 140B tokens (20 per parameter): 6 x 7e9 x 1.4e11, about 5.9e21 FLOPs. Llama-style models of that size are trained on trillions of tokens instead, many times the optimum, buying a better small model that is cheap to serve.",
          nuance: "Fine-tuning on facts the model does not know teaches it to guess confidently, one cause of hallucination. Put knowledge in retrieval and behaviour in tuning, and try prompting before either.",
          read: [
            { label: "Jurafsky and Martin, SLP 3e: ch. 8 Post-training (instruction and preference tuning)", url: "https://web.stanford.edu/~jurafsky/slp3/8.pdf", m: 25 },
            { label: "Rafailov et al., Direct preference optimization (DPO)", url: "https://arxiv.org/abs/2305.18290", m: 25 }
          ],
          see: [
            { label: "ML: pretraining and scaling", href: "BASELINE.html#/ml/pretraining" },
            { label: "ML: RLHF and preference tuning", href: "BASELINE.html#/ml/preference-tuning" },
            { label: "ML: fine-tuning and LoRA", href: "BASELINE.html#/ml/fine-tuning-lora" },
            { label: "AI engineering: when fine-tuning beats prompting", href: "BASELINE.html#/ai/fine-tuning-vs-prompting" }
          ],
          tags: ["pretraining", "scaling laws", "chinchilla", "sft", "rlhf", "dpo", "instruction tuning"] },
        { id: "decoding", name: "Decoding: greedy, beam, temperature, top-p",
          line: "How a model turns next-token probabilities into text, and what each setting is for.",
          body: [
            "A decoder outputs a probability over the vocabulary for the next token. **Greedy** takes the top one: deterministic and prone to loops. **Beam search** keeps the b best partial sequences: good for translation, bland for open text. **Temperature** divides logits before softmax: below 1 sharpens, above 1 flattens, near 0 approaches greedy. **Top-k** samples from the k best; **top-p** (nucleus) from the smallest set whose probability reaches p, so it adapts to how peaked the distribution is.",
            "Generation runs one token per step. The **KV cache** stores past keys and values so each step computes only the new token, at a memory cost that grows with layers, context and batch. For classification and extraction use temperature 0 or **constrained decoding** against a schema."
          ],
          uses: [
            "**OpenAI, Anthropic and Gemini APIs**: expose temperature and top-p per request, plus structured output modes for schemas.",
            "**vLLM and SGLang**: manage the KV cache in pages and support grammar-constrained decoding.",
            "**Translation models such as MarianMT**: decode with beam search, where one faithful output matters more than variety."
          ],
          example: "Logits 2.0, 1.0 and 0.1 for `yes`, `no`, `maybe`. At temperature 1, softmax gives 0.66, 0.24, 0.10. At 0.5 the logits double to 4.0, 2.0, 0.2: 0.86, 0.12, 0.02. Top-p 0.9 at temperature 1 keeps `yes` and `no` (0.90), so `maybe` is never sampled. KV cache for a 7B model, 32 layers, hidden size 4,096, fp16: 0.5 MB per token, 2 GB for 4,000 tokens.",
          nuance: "Temperature 0 is not fully deterministic on most hosted APIs: batching and floating-point order shift logits slightly. For a classifier inside an assistant, constrain the output to the label set rather than trusting the sampler.",
          read: [
            { label: "Holtzman et al., The curious case of neural text degeneration (nucleus sampling)", url: "https://arxiv.org/abs/1904.09751", m: 25 },
            { label: "Lilian Weng, Large transformer model inference optimization (KV cache cost)", url: "https://lilianweng.github.io/posts/2023-01-10-inference-optimization/", m: 9 }
          ],
          see: [
            { label: "Inference: prefill and decode", href: "BASELINE.html#/inference/prefill-decode" },
            { label: "Inference: the KV cache and its memory maths", href: "BASELINE.html#/inference/kv-cache" },
            { label: "AI engineering: structured output", href: "BASELINE.html#/ai/structured-output" }
          ],
          tags: ["greedy", "beam search", "temperature", "top-p", "top-k", "kv cache", "constrained decoding"] }
      ] },
    { name: "Virtual assistants", line: "Intents, state, design, and the loop that improves an assistant in production.",
      topics: [
        { id: "intents-entities", name: "Intents and entities: designing the taxonomy",
          line: "Actions become intents, the details they need become entities, and the taxonomy sets accuracy.",
          body: [
            "An **intent** is what the user wants done; an **entity** is the information needed to do it. Microsoft's rule: cancel is one intent and the product is an entity, never `cancel_contoso` as its own intent. Keep one schema style across the project. A good test: if two intents get the same flow and the same API call, merge them and use an entity; if the same words need different handling (card lost, card declined), split.",
            "Past a few hundred intents a flat list breaks down, so route by **domain** first (accounts, cards, loans) and classify within it. Start from logs ranked by volume and risk, not the product catalogue. Platforms ask for roughly 10 to 25 varied, balanced phrases per intent, drawn from real traffic, with a held-out test set that covers every intent."
          ],
          uses: [
            "**Dialogflow CX**: intents with training phrases (10 to 20 recommended), entity types with synonyms, and flows that split by domain.",
            "**Microsoft CLU**: intents and entities with components, orchestrated with question answering across apps.",
            "**Amazon Lex V2**: intents with slots and slot types, filled through Lambda code hooks.",
            "**Rasa**: intents and entities in classic NLU, optional under CALM's LLM-driven commands."
          ],
          example: "A bank's first draft has `check_savings_balance`, `check_checking_balance` and `check_card_balance`. All three call one balance API, so they merge into `check_balance` with an `account_type` entity. Meanwhile `card_problem` hides two flows, lost and declined, with different urgency, so it splits into `report_lost_card` and `card_declined`. The confusion matrix confirms both changes.",
          nuance: "Unbalanced training data biases the classifier toward big intents, and a stray pattern (every example lowercase, one shared prefix) teaches a shortcut. Vary the phrasing, not only the word order, and source examples from production, not only from the design team.",
          read: [
            { label: "Microsoft Learn: CLU best practices (schema design, balance, near misses)", url: "https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/best-practices", m: 12 },
            { label: "Google Cloud: Dialogflow CX intents", url: "https://docs.cloud.google.com/dialogflow/cx/docs/concept/intent", m: 5 }
          ],
          see: [
            { label: "System design guide: enterprise virtual assistant", href: "SYSTEM%20DESIGN.html#/designs/virtual-assistant" },
            { label: "Sequence labelling: NER and slot filling", href: "BASELINE.html#/nlp/sequence-labelling" }
          ],
          tags: ["intent", "entity", "taxonomy", "training phrases", "nlu", "schema"] },
        { id: "dialogue-state", name: "Dialogue state and slot filling",
          line: "The structured record of what the conversation has settled so far, turn by turn.",
          body: [
            "**Dialogue state tracking** keeps the slot values the conversation has established, updated every turn. Classic platforms make state explicit: Dialogflow CX **pages** are states whose forms collect required parameters, prefilled from the session or the matched intent; Lex elicits slots with code hooks; Rasa flows collect slots step by step. A good tracker accepts **over-answering** (`Friday to Boston` fills two slots), **corrections** (`actually make it Saturday`) and **digressions** that return to the interrupted task.",
            "Measure with **joint goal accuracy**: the share of turns where every slot is right. In LLM stacks function calling plays the same role: each tool is an intent and its typed arguments are slots. FnCTOD reported zero-shot gains of 5.6 points joint goal accuracy for ChatGPT and 14 for GPT-4."
          ],
          uses: [
            "**Dialogflow CX**: pages, forms and session parameters, with reprompt handlers for invalid input.",
            "**Rasa CALM**: collect steps and slot corrections inside deterministic flows; persisted slots carry over after a flow ends.",
            "**LLM function calling**: a tool schema such as `book_table(date, time, party_size)` doubles as the slot set."
          ],
          example: "Turn 1, `table for four tomorrow`: party_size 4, date 2 Oct. Turn 2, `7 pm`: time 19:00, all three slots filled, so the bot confirms implicitly. Turn 3, `actually make it five`: a correction updates party_size to 5 and re-runs only the availability check. Joint goal accuracy counts turn 3 right only if all three slots are right.",
          nuance: "Decide what must be remembered deterministically (account, order ID, authentication state) and what the model may infer from the transcript. LLMs carry context easily but do not guarantee it, so keep authoritative state in code, not only in the prompt.",
          read: [
            { label: "Google Cloud: Dialogflow CX pages, forms and parameters", url: "https://docs.cloud.google.com/dialogflow/cx/docs/concept/page", m: 5 },
            { label: "Li et al., LLMs as zero-shot dialogue state trackers through function calling (FnCTOD)", url: "https://arxiv.org/abs/2402.10466", m: 25 }
          ],
          see: [
            { label: "AI engineering: tool calling", href: "BASELINE.html#/ai/tool-calling" },
            { label: "AI engineering: agent memory", href: "BASELINE.html#/ai/agent-memory" },
            { label: "Coding primer: structured output and function calling", href: "CODING.html#structured" }
          ],
          tags: ["dst", "slot filling", "joint goal accuracy", "forms", "corrections", "function calling"] },
        { id: "conversation-design", name: "Conversation design: prompts, repair, confirmation, handoff",
          line: "Writing the turns: how the assistant asks, confirms, recovers and hands off.",
          body: [
            "Design starts from the top tasks: write happy-path sample dialogs aloud, then the failure paths. Errors come in three kinds: **no-input**, **no-match** and system error. Escalate per state: first a short rephrase, then options or examples, then an exit to an alternative after about two failures. Never blame the user; never repeat a prompt word for word.",
            "**Confirmation** is implicit by default (`So, a table for two...`) and explicit for irreversible or costly actions: payments, deletions, names, addresses, or low ASR and NLU confidence. Confirm in proportion to the cost of being wrong times the chance of being wrong. **Handoff** triggers on an explicit request (at once), a second failure, high-stakes topics or frustration, and passes a summary, identifiers and what was tried. In voice, keep prompts short, the question last, lists to three."
          ],
          uses: [
            "**Google's conversation design guidelines**: personas, confirmations and error handling, still the clearest public text.",
            "**Dialogflow CX event handlers**: numbered no-match and no-input handlers (sys.no-match-1 to 6) at flow, page or parameter level.",
            "**Rasa CALM patterns**: correction, clarification, cancel, chitchat, human handoff and user silence as reusable system flows.",
            "**Twilio's handoff guidance**: send an AI summary with the transfer, not a 40-turn transcript; warm transfer for high stakes."
          ],
          example: "Collecting a date. No-match 1: `Sorry, which day works for you?` No-match 2: `You can say a day like Friday, or a date like October 9th.` No-match 3: `I'm having trouble with the date. Let me connect you to someone who can help.` An explicit `agent` at any point goes straight to transfer, passing the intent and the filled slots.",
          nuance: "Over-confirming costs turns and patience; under-confirming costs money. A handoff with no agents online needs a callback or ticket, never a dead end. Measure the repeat-explanation rate after transfer: a bad handoff hurts satisfaction without showing up as a bot failure.",
          read: [
            { label: "Google conversation design: errors", url: "https://developers.google.com/assistant/conversation-design/errors", m: 10 },
            { label: "Google conversation design: confirmations", url: "https://developers.google.com/assistant/conversation-design/confirmations", m: 6 }
          ],
          see: [
            { label: "System design guide: enterprise virtual assistant", href: "SYSTEM%20DESIGN.html#/designs/virtual-assistant" },
            { label: "Audio: turn-taking and barge-in", href: "BASELINE.html#/audio/turn-taking" }
          ],
          tags: ["conversation design", "reprompt", "no-match", "no-input", "confirmation", "handoff", "persona"] },
        { id: "nlu-llm-hybrid", name: "LLMs in the NLU stack: hybrid routing, function calling, RAG",
          line: "Where an LLM replaces, sits beside, or stays out of a classic intent classifier.",
          body: [
            "Four patterns, often combined. **Hybrid routing**: a fast classifier handles confident turns and only uncertain ones go to an LLM; Amazon's study used SetFit with Monte Carlo dropout and stayed within 2% of LLM accuracy at half the latency. **LLM as NLU, deterministic logic**: Rasa CALM has the LLM emit commands (start flow, set slot, correct slot, clarify) while flows run the business rules. **Function calling as intents**: tools are intents and arguments are slots, validated in code. **RAG for FAQ intents**: dozens of FAQ intents become retrieval over a curated knowledge base with citations, while transactional intents stay routed so documents never answer account questions.",
            "One 2026 preprint found fine-tuned RoBERTa beat an LLM on ATIS (95.9 against 84.1), while the LLM caught far more out-of-scope queries (85.6 against 58.1)."
          ],
          uses: [
            "**Dialogflow CX**: generative fallback on no-match handlers, and LLM playbooks beside deterministic flows for authentication and payment.",
            "**Copilot Studio**: an LLM planner picks topics and tools by name and description, with a deterministic layer for irreversible actions.",
            "**Rasa CALM**: LLM-based dialogue understanding over deterministic flows, optionally hybrid with classic NLU.",
            "**Amazon Lex**: KendraSearchIntent answers FAQ questions from a search index instead of authored intents."
          ],
          example: "A telecom bot with 120 intents. Say a SetFit router answers 80% of turns above its threshold in under 10 ms. The other 20% go to an LLM with the top five candidate intents and a JSON schema. Roaming FAQs go to retrieval with citations. `Change my plan` still runs a flow that authenticates and asks for explicit confirmation before it calls the billing API.",
          nuance: "The LLM proposes; deterministic code authorises. Keep money-moving and data-changing tools behind server-side checks and a confirmation turn, and treat retrieved text as untrusted. An LLM call costs around a second against milliseconds for an encoder, so route, do not replace.",
          read: [
            { label: "Arora et al., Intent detection in the age of LLMs (hybrid SetFit and LLM routing)", url: "https://arxiv.org/abs/2410.01627", m: 25 },
            { label: "Rasa docs: CALM overview", url: "https://rasa.com/docs/rasa-pro/calm/", m: 3 }
          ],
          see: [
            { label: "AI engineering: tool calling", href: "BASELINE.html#/ai/tool-calling" },
            { label: "AI engineering: retrieval-augmented generation", href: "BASELINE.html#/ai/rag" },
            { label: "AI engineering: guardrails and prompt injection", href: "BASELINE.html#/ai/guardrails" },
            { label: "System design guide: enterprise virtual assistant", href: "SYSTEM%20DESIGN.html#/designs/virtual-assistant" }
          ],
          tags: ["hybrid", "llm routing", "calm", "function calling", "rag", "generative fallback", "setfit"] },
        { id: "error-analysis", name: "Error analysis for assistants",
          line: "Finding why conversations fail, from the confusion matrix to clustering the misses.",
          body: [
            "Start per utterance: per-intent precision and recall, the **confusion matrix**, and the **margin** between the top two scores, which flags conflicting intents. Fix by merging, splitting or adding contrastive examples, then re-run the frozen test set so errors do not move to a neighbour.",
            "Then per conversation. Sample by stratum: every escalation, abandoned sessions, low-confidence turns, negative feedback, plus a random slice. Label one primary cause: ASR, NLU miss, entity error, dialog design, backend failure, content gap, policy, or abandonment. To find missing intents, **embed fallback utterances and cluster them** (HDBSCAN or k-means), let an LLM name each cluster, rank by volume times cost, then decide: new intent, existing intent, none class, or RAG content. Every finding becomes a regression test."
          ],
          uses: [
            "**Rasa conversation-driven development**: review real conversations, tag them, find patterns and fix in batches.",
            "**Dialogflow CX test cases**: golden conversations with turn-level expectations for intent, page and response.",
            "**Amazon Lex Test Workbench**: builds test sets from transcripts and scores intent and slot performance.",
            "**Kore.ai and Cognigy**: flag overlapping intents, weak examples and untrained intents before release."
          ],
          example: "Fallback rate rose from 8% to 12%. 3,000 fallback utterances are embedded and clustered into 25 groups. The largest, 600 messages, an LLM names `asking about the new rewards card`, a product launched last week: a content gap, fixed with a knowledge article. The second, 400 messages, splits between `transfer` and `pay_bill`: an intent overlap, fixed with contrastive examples and a disambiguation question.",
          nuance: "Review whole conversations, not isolated turns: many failures are dialog failures that per-utterance metrics never show. Double-label a subset and measure agreement, because label noise sets the ceiling on every fix.",
          read: [
            { label: "Rasa docs: conversation-driven development", url: "https://rasa.com/docs/rasa/conversation-driven-development/", m: 4 },
            { label: "Kore.ai docs: training validations (confusion matrix, k-fold, conflict warnings)", url: "https://docs.kore.ai/xo/automation/natural-language/training/training-validations/", m: 5 }
          ],
          see: [
            { label: "AI engineering: evaluation", href: "BASELINE.html#/ai/evaluation" },
            { label: "AI engineering: LLM-as-judge and its calibration", href: "BASELINE.html#/ai/llm-as-judge" },
            { label: "Coding primer: evals", href: "CODING.html#evals" }
          ],
          tags: ["error analysis", "confusion matrix", "clustering", "transcript review", "regression tests", "cdd"] },
        { id: "assistant-metrics", name: "Assistant metrics: containment, resolution and the rest",
          line: "What to report about a live assistant, and which numbers a bad bot can game.",
          body: [
            "**Containment** (or deflection) is the share of conversations that never reached a human. Alone it misleads: a bot that is a wall contains everything. Pair it with **resolution**: the customer confirms the task is done, or does not come back on another channel within 24 to 72 hours. Compute resolution from outcomes, not as one minus escalation.",
            "Also track **fallback rate** by page or state, **escalation rate** by intent, task-completion **funnels** (intent recognised, slots filled, authenticated, backend succeeded, done), CSAT, and handle time for escalated contacts, which should drop when the handoff carries context. Filter out tests, greetings and spam first. For LLM agents, **tau-bench** adds pass^k, the chance all k runs of a task succeed: GPT-4o agents had pass^8 under 25% in retail."
          ],
          uses: [
            "**Dialogflow CX analytics and experiments**: no-match, escalation and exit rates per page, and live A/B splits with up to four variants.",
            "**Rasa's KPI guidance**: separates deflection, containment, automation rate, solution rate and CSAT.",
            "**tau-bench**: simulated users, tools and policies, scored on the final database state across repeated runs."
          ],
          example: "Containment rose from 60% to 70% after a release, but repeat contacts within 72 hours rose from 10% to 18% of contained sessions. Resolved in the bot went from 54 to 57 per 100 conversations, while customers coming back rose from 6 to 13 per 100. Containment says plus 10 points; resolution says plus 3, at twice the repeat traffic.",
          nuance: "Run A/B tests by user, not by turn, through full weekly cycles, with task completion as the primary metric and escalation, CSAT and repeat contact as guardrails. Turn count alone misleads: shorter can mean faster or abandoned.",
          read: [
            { label: "Rasa blog: measuring AI agent performance in the contact center", url: "https://rasa.com/blog/measure-ai-agent-performance-in-the-contact-center", m: 6 },
            { label: "Yao et al., tau-bench: tool-agent-user interaction benchmark", url: "https://arxiv.org/abs/2406.12045", m: 30 }
          ],
          see: [
            { label: "AI engineering: evaluation", href: "BASELINE.html#/ai/evaluation" },
            { label: "System design guide: enterprise virtual assistant", href: "SYSTEM%20DESIGN.html#/designs/virtual-assistant" }
          ],
          tags: ["containment", "deflection", "resolution", "fallback rate", "csat", "funnel", "pass^k", "a/b test"] }
      ] }
  ],
  see: [
    { label: "System design guide: enterprise virtual assistant", href: "SYSTEM%20DESIGN.html#/designs/virtual-assistant" },
    { label: "Coding primer: attention and a transformer block", href: "CODING.html#transformer" }
  ]
});
