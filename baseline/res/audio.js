/* What to read and watch for each topic in the audio field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("audio", {
 "sampling": [
  {
   "kind": "video",
   "req": true,
   "label": "The intuition behind the Nyquist-Shannon sampling theorem",
   "url": "https://www.youtube.com/watch?v=Jv5FU8oUWEY",
   "m": 12,
   "why": "Why twice the highest frequency is enough, and what aliasing is.",
   "yt": {
    "id": "Jv5FU8oUWEY",
    "ch": "Zach Star"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Smith, The Scientist and Engineer's Guide to DSP: ch. 3 ADC and DAC",
   "url": "https://www.dspguide.com/ch3.htm",
   "m": 30,
   "why": "Quantization and the sampling theorem in full."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How digital audio works",
   "url": "https://www.youtube.com/watch?v=1RIA9U5oXro",
   "m": 13,
   "why": "Samples, bit depth and rates from the audio side.",
   "yt": {
    "id": "1RIA9U5oXro",
    "ch": "Computerphile"
   }
  }
 ],
 "spectrograms": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a mel spectrogram?",
   "url": "https://www.youtube.com/watch?v=MtvD2zyZE0M",
   "m": 9,
   "why": "How frames, the Fourier transform and the mel scale make the picture speech models read.",
   "yt": {
    "id": "MtvD2zyZE0M",
    "ch": "DrawTheLogic"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Haytham Fayek, Speech processing for machine learning: filter banks, MFCCs and what is in between",
   "url": "https://haythamfayek.com/2016/04/21/speech-processing-for-machine-learning.html",
   "m": 20,
   "why": "The full recipe from framing to MFCCs, step by step."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Mel frequency cepstral coefficients (MFCC) explained",
   "url": "https://www.youtube.com/watch?v=SJo7vPgRlBQ",
   "m": 6,
   "why": "The last step from mel bands to MFCCs, in short.",
   "yt": {
    "id": "SJo7vPgRlBQ",
    "ch": "DataMListic"
   }
  }
 ],
 "codecs": [
  {
   "kind": "video",
   "req": true,
   "label": "Every audio codec explained in 12 minutes",
   "url": "https://www.youtube.com/watch?v=fcy5eEkgFBE",
   "m": 13,
   "why": "A tour of PCM, MP3, AAC and Opus and what each trades away.",
   "yt": {
    "id": "fcy5eEkgFBE",
    "ch": "Pfyre Explainer"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "RFC 6716, Definition of the Opus audio codec: section 2, overview",
   "url": "https://datatracker.ietf.org/doc/html/rfc6716",
   "m": 15,
   "why": "How Opus mixes SILK and CELT, from its own spec."
  },
  {
   "kind": "video",
   "req": false,
   "label": "But what is digital audio? (The FLAC codec #1)",
   "url": "https://www.youtube.com/watch?v=jOewLgvH_js",
   "m": 12,
   "why": "What raw PCM is, before any compression.",
   "yt": {
    "id": "jOewLgvH_js",
    "ch": "kleines Filmröllchen"
   }
  }
 ],
 "signal-processing": [
  {
   "kind": "video",
   "req": true,
   "label": "RNNoise, neural speech enhancement, and the browser",
   "url": "https://www.youtube.com/watch?v=nsscrYdrGRE",
   "m": 8,
   "why": "How a small network cleans noise in real time, with demos.",
   "yt": {
    "id": "nsscrYdrGRE",
    "ch": "W3C"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Jean-Marc Valin, RNNoise: learning noise suppression (the demo page)",
   "url": "https://jmvalin.ca/demo/rnnoise/",
   "m": 15,
   "why": "The design behind RNNoise, with audio to listen to."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Audio conferencing pre-requisites: intro to echo cancellation",
   "url": "https://www.youtube.com/watch?v=BEBXj9A8jC8",
   "m": 11,
   "why": "Why echo happens and how a canceller subtracts it.",
   "yt": {
    "id": "BEBXj9A8jC8",
    "ch": "ClearOne"
   }
  }
 ],
 "vad": [
  {
   "kind": "video",
   "req": true,
   "label": "Voice activity detection: the key to realtime voice chat (Silero VAD)",
   "url": "https://www.youtube.com/watch?v=HUbYXGeR8_c",
   "m": 9,
   "why": "What a VAD does per frame and how it gates a voice pipeline.",
   "yt": {
    "id": "HUbYXGeR8_c",
    "ch": "HelloWrld"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Silero VAD: the README, metrics and examples",
   "url": "https://github.com/snakers4/silero-vad",
   "m": 10,
   "why": "Frame size, thresholds and accuracy numbers."
  }
 ],
 "asr": [
  {
   "kind": "video",
   "req": true,
   "label": "Connectionist temporal classification (CTC) explained",
   "url": "https://www.youtube.com/watch?v=jDPl1QJGLpE",
   "m": 21,
   "why": "Blanks, alignments and how the loss sums over them.",
   "yt": {
    "id": "jDPl1QJGLpE",
    "ch": "DataMListic"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "CTC vs RNN-T explained: speed vs accuracy in speech recognition",
   "url": "https://www.youtube.com/watch?v=VxaEms3GcPI",
   "m": 8,
   "why": "Where CTC, transducers and encoder-decoder differ.",
   "yt": {
    "id": "VxaEms3GcPI",
    "ch": "DrawTheLogic"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Awni Hannun, Sequence modeling with CTC (Distill)",
   "url": "https://distill.pub/2017/ctc/",
   "m": 25,
   "why": "Interactive figures of the CTC alignment idea."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Gulati et al., Conformer: the abstract and section 2",
   "url": "https://arxiv.org/abs/2005.08100",
   "m": 15,
   "why": "The encoder most modern ASR models use."
  }
 ],
 "whisper": [
  {
   "kind": "video",
   "req": true,
   "label": "OpenAI's Whisper model explained",
   "url": "https://www.youtube.com/watch?v=uFOkMme19Zs",
   "m": 6,
   "why": "The 30-second windows, the encoder-decoder and the task tokens.",
   "yt": {
    "id": "uFOkMme19Zs",
    "ch": "What's AI by Louis-François Bouchard"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Whisper paper explained: robust speech recognition via large-scale weak supervision",
   "url": "https://www.youtube.com/watch?v=Kh058oMt-08",
   "m": 34,
   "why": "A walk through the paper; watch the data and model parts.",
   "yt": {
    "id": "Kh058oMt-08",
    "ch": "Aladdin Persson"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Radford et al., the Whisper paper (2022): sections 2 and 3, data and model",
   "url": "https://arxiv.org/abs/2212.04356",
   "m": 30,
   "why": "The 680,000 hours and the model sizes from the source."
  }
 ],
 "streaming-asr": [
  {
   "kind": "video",
   "req": true,
   "label": "CTC vs RNN-T explained: speed vs accuracy in speech recognition",
   "url": "https://www.youtube.com/watch?v=VxaEms3GcPI",
   "m": 8,
   "why": "Why transducers suit streaming and how they emit partial text.",
   "yt": {
    "id": "VxaEms3GcPI",
    "ch": "DrawTheLogic"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "How streaming ASR inference differs from LLM serving",
   "url": "https://www.youtube.com/watch?v=8HJWwD5Uacc",
   "m": 13,
   "why": "Chunks, state and latency in a streaming recognizer.",
   "yt": {
    "id": "8HJWwD5Uacc",
    "ch": "Efficient NLP"
   }
  }
 ],
 "speaker-diarization": [
  {
   "kind": "video",
   "req": true,
   "label": "pyannote audio: neural building blocks for speaker diarization",
   "url": "https://www.youtube.com/watch?v=37R_R82lfwA",
   "m": 8,
   "why": "How segmentation, embeddings and clustering fit together.",
   "yt": {
    "id": "37R_R82lfwA",
    "ch": "Hervé Bredin"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "pyannote.audio: the README and benchmark table",
   "url": "https://github.com/pyannote/pyannote-audio",
   "m": 10,
   "why": "The pipeline you would actually run and its error rates."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Desplanques et al., ECAPA-TDNN: the abstract and architecture section",
   "url": "https://arxiv.org/abs/2005.07143",
   "m": 20,
   "why": "The speaker encoder behind most embeddings."
  }
 ],
 "tts": [
  {
   "kind": "read",
   "req": true,
   "label": "Jurafsky and Martin, SLP3 ch. 17 Text-to-Speech",
   "url": "https://web.stanford.edu/~jurafsky/slp3/",
   "m": 45,
   "why": "The front end, acoustic model and vocoder as one pipeline."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Text-to-speech and voice cloning course: neural TTS revolution",
   "url": "https://www.youtube.com/watch?v=4Lbox-d0UcE",
   "m": 41,
   "why": "A course opener on how neural TTS got here; watch the first 15 minutes.",
   "yt": {
    "id": "4Lbox-d0UcE",
    "ch": "Valerio Velardo - The Sound of AI"
   }
  }
 ],
 "vocoders": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a neural vocoder?",
   "url": "https://www.youtube.com/watch?v=wkZSfzr9AP4",
   "m": 5,
   "why": "Why a mel spectrogram needs a network to become a waveform.",
   "yt": {
    "id": "wkZSfzr9AP4",
    "ch": "Standarity"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kong et al., HiFi-GAN: the abstract and section 2",
   "url": "https://arxiv.org/abs/2010.05646",
   "m": 20,
   "why": "The GAN vocoder that made fast, clean synthesis common."
  },
  {
   "kind": "read",
   "req": false,
   "label": "van den Oord et al., WaveNet: the abstract and section 2",
   "url": "https://arxiv.org/abs/1609.03499",
   "m": 20,
   "why": "Where autoregressive waveform generation began."
  }
 ],
 "neural-codecs": [
  {
   "kind": "video",
   "req": true,
   "label": "Neural audio codecs: how to get audio into LLMs",
   "url": "https://www.youtube.com/watch?v=f_oh1x9j8Dg",
   "m": 8,
   "why": "Encoder, quantizer and decoder, and why tokens matter.",
   "yt": {
    "id": "f_oh1x9j8Dg",
    "ch": "Vinh Nguyen"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Residual vector quantization for audio and speech embeddings",
   "url": "https://www.youtube.com/watch?v=Xt9S74BHsvc",
   "m": 14,
   "why": "How stacked codebooks turn one frame into several tokens.",
   "yt": {
    "id": "Xt9S74BHsvc",
    "ch": "Efficient NLP"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Défossez et al., High fidelity neural audio compression (EnCodec): sections 1 to 3",
   "url": "https://arxiv.org/abs/2210.13438",
   "m": 25,
   "why": "The codec design and its training losses."
  }
 ],
 "voice-cloning": [
  {
   "kind": "video",
   "req": true,
   "label": "Understand Microsoft's VALL-E in 3 minutes (zero-shot TTS)",
   "url": "https://www.youtube.com/watch?v=_A1kLbW18fU",
   "m": 7,
   "why": "How a few seconds of audio prompts a codec language model.",
   "yt": {
    "id": "_A1kLbW18fU",
    "ch": "Olewave"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "How voice cloning works: explained easily",
   "url": "https://www.youtube.com/watch?v=qiKsbhxNCtQ",
   "m": 40,
   "why": "The longer tour of cloning approaches; watch the first half.",
   "yt": {
    "id": "qiKsbhxNCtQ",
    "ch": "Valerio Velardo - The Sound of AI"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Wang et al., Neural codec language models are zero-shot TTS synthesizers (VALL-E): abstract and section 1",
   "url": "https://arxiv.org/abs/2301.02111",
   "m": 15,
   "why": "The claim and the setup, from the paper."
  }
 ],
 "speech-to-speech": [
  {
   "kind": "video",
   "req": true,
   "label": "How to run real-time voice AI locally: Moshi, Mimi and PersonaPlex explained",
   "url": "https://www.youtube.com/watch?v=Qnx1-FDMJy4",
   "m": 7,
   "why": "How full-duplex models listen and speak at once.",
   "yt": {
    "id": "Qnx1-FDMJy4",
    "ch": "Samarth Kamath"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Moshi: a speech-text foundation model for real-time dialogue (paper explained)",
   "url": "https://www.youtube.com/watch?v=PO4EO7kUUQQ",
   "m": 41,
   "why": "Mimi codec and the inner monologue; watch the first 20 minutes.",
   "yt": {
    "id": "PO4EO7kUUQQ",
    "ch": "Julien Hauret"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Défossez et al., Moshi: a speech-text foundation model for real-time dialogue (abstract and section 1)",
   "url": "https://arxiv.org/abs/2410.00037",
   "m": 20,
   "why": "The design and latency claims from the paper."
  }
 ],
 "voice-agent-pipeline": [
  {
   "kind": "video",
   "req": true,
   "label": "Voice agent pipeline explained: VAD, STT, LLM and TTS",
   "url": "https://www.youtube.com/watch?v=SPB2T-eLrOg",
   "m": 11,
   "why": "How the four stages hand frames to each other.",
   "yt": {
    "id": "SPB2T-eLrOg",
    "ch": "LiveKit"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Voice AI and Voice Agents primer: section 4, the basic conversational loop",
   "url": "https://voiceaiandvoiceagents.com/",
   "m": 20,
   "why": "The loop with streaming at every stage."
  }
 ],
 "telephony-webrtc": [
  {
   "kind": "video",
   "req": true,
   "label": "WebRTC for beginners: the complete protocol breakdown",
   "url": "https://www.youtube.com/watch?v=Ivh8eps-Tic",
   "m": 19,
   "why": "Signalling, ICE, SRTP and how media flows.",
   "yt": {
    "id": "Ivh8eps-Tic",
    "ch": "Tsahi Levent-Levi"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "WebRTC for the Curious: ch. 6, media communication (RTP, RTCP, congestion control)",
   "url": "https://webrtcforthecurious.com/docs/06-media-communication/",
   "m": 25,
   "why": "How audio packets are sent and kept in time."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Introducing SIP and RTP in VoIP",
   "url": "https://www.youtube.com/watch?v=VlQ3XQiCJGM",
   "m": 6,
   "why": "The phone-network side: call setup and media packets.",
   "yt": {
    "id": "VlQ3XQiCJGM",
    "ch": "Matt Explains Systems"
   }
  }
 ],
 "turn-taking": [
  {
   "kind": "video",
   "req": true,
   "label": "Fix AI voice interruptions with semantic turn detection",
   "url": "https://www.youtube.com/watch?v=XbrlOY4Z-Ow",
   "m": 6,
   "why": "Why silence alone mis-cuts a turn and what a model adds.",
   "yt": {
    "id": "XbrlOY4Z-Ow",
    "ch": "LiveKit"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "LiveKit docs: turn detection and interruptions",
   "url": "https://docs.livekit.io/agents/logic/turns",
   "m": 15,
   "why": "The knobs for endpointing and barge-in in a real framework."
  },
  {
   "kind": "video",
   "req": false,
   "label": "STT, TTS, VAD, TTFB: voice agent terms you must know",
   "url": "https://www.youtube.com/watch?v=xw7vzHsvurw",
   "m": 11,
   "why": "The vocabulary around turns and first-byte time.",
   "yt": {
    "id": "xw7vzHsvurw",
    "ch": "Cartesia AI"
   }
  }
 ],
 "latency-budget": [
  {
   "kind": "video",
   "req": true,
   "label": "Voice AI latency explained: where the time goes",
   "url": "https://www.youtube.com/watch?v=qNnldHJ_8oA",
   "m": 5,
   "why": "Where each stage spends its milliseconds.",
   "yt": {
    "id": "qNnldHJ_8oA",
    "ch": "Voice AI Space"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Voice AI and Voice Agents primer: the latency section and its table",
   "url": "https://voiceaiandvoiceagents.com/",
   "m": 15,
   "why": "A per-stage budget table to reason from."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Engineering voice agents: latency, quality, and scale",
   "url": "https://www.youtube.com/watch?v=N7b1PJc7SFc",
   "m": 25,
   "why": "A production view of trading latency against quality.",
   "yt": {
    "id": "N7b1PJc7SFc",
    "ch": "AI Engineer"
   }
  }
 ],
 "evaluation": [
  {
   "kind": "video",
   "req": true,
   "label": "Word error rate (WER) explained",
   "url": "https://www.youtube.com/watch?v=hoEWRdHi7dI",
   "m": 3,
   "why": "Substitutions, deletions and insertions over reference words.",
   "yt": {
    "id": "hoEWRdHi7dI",
    "ch": "DataMListic"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Open ASR Leaderboard: the README, metrics and method",
   "url": "https://github.com/huggingface/open_asr_leaderboard",
   "m": 10,
   "why": "How models are compared and normalised in practice."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Saeki et al., UTMOS: MOS prediction (abstract)",
   "url": "https://arxiv.org/abs/2204.02152",
   "m": 10,
   "why": "Predicting listener scores without listeners."
  }
 ]
});
