BASELINE.field({
  id: "audio", name: "Audio and speech", short: "Audio", layer: "Intelligence",
  ink: "#2F7A73", inkDark: "#86CFC6",
  lede: "How sound becomes numbers, how models turn those numbers into words and words back into a voice, and how that runs live on a phone call.",
  overview: [
    "Audio and speech covers the signal (samples, spectra, codecs, filters), the models that listen (voice activity detection, speech recognition, speaker recognition) and the models that speak (text to speech, vocoders, neural codecs). Job titles are speech engineer, ASR or TTS research engineer, audio ML engineer, and more and more often voice AI engineer: the person who builds a voice agent and owns its latency.",
    "It sits between machine learning and real-time systems. The models are transformers like the rest of AI, but the input arrives as a stream at 8,000 to 48,000 numbers a second and a caller notices a pause of one second. So the field also pulls in networking (WebRTC, SIP telephony), inference (time to first byte) and backend work. In 2026 the industry splits two ways: cascades of speech recognition, an LLM and text to speech (Deepgram, AssemblyAI, ElevenLabs, Cartesia, orchestrated with Pipecat or LiveKit) and single speech-to-speech models (OpenAI Realtime, Gemini Live, Kyutai's Moshi).",
    "Read it in the order a call flows: the signal first, then listening, then speaking, then the agent that ties them together. If you can explain a mel spectrogram, CTC and a vocoder in a sentence each, most interview questions in this field become follow-ups."
  ],
  diagram: {
    nodes: [
      { id: "sampling", label: "Samples", sub: "16 kHz, 20 ms frames", col: 0, row: 0 },
      { id: "codecs", label: "Codecs", sub: "mu-law, Opus", col: 0, row: 1 },
      { id: "signal-processing", label: "Clean-up", sub: "echo, noise, gain", col: 0, row: 2 },
      { id: "vad", label: "Voice activity", sub: "is anyone speaking?", col: 0, row: 3 },
      { id: "streaming-asr", label: "Streaming ASR", sub: "audio to text, live", col: 1, row: 3 },
      { id: "turn-taking", label: "Turn-taking", sub: "has the caller finished?", col: 1, row: 2 },
      { id: "ai", label: "LLM and tools", sub: "see AI engineering", col: 1, row: 1 },
      { id: "tts", label: "Text to speech", sub: "text to acoustic tokens", col: 2, row: 1 },
      { id: "vocoders", label: "Vocoder", sub: "tokens back to a waveform", col: 2, row: 2 },
      { id: "telephony-webrtc", label: "Back to the caller", sub: "SIP or WebRTC", col: 2, row: 3 }
    ],
    edges: [
      ["sampling", "codecs", "encode"], ["codecs", "signal-processing"], ["signal-processing", "vad"],
      ["vad", "streaming-asr", "speech only"], ["streaming-asr", "turn-taking", "partials"],
      ["turn-taking", "ai", "final text"], ["ai", "tts", "reply, streamed"],
      ["tts", "vocoders"], ["vocoders", "telephony-webrtc", "audio frames"]
    ],
    cap: "**One turn of a voice agent, as a U: down the left as audio arrives, up the middle as it becomes meaning, down the right as a reply is spoken.** Every arrow costs milliseconds, which is why the field is as much about latency as about models. A speech-to-speech model replaces the middle and right columns with one network. Click a box to open it."
  },
  start: [
    { label: "Harsh Rana: interview experience with Sarvam AI, ML engineer", url: "https://x.com/ranaharshraj7/status/2065801122494001516", m: 8,
      why: "The bar: a voice activity detector from scratch in 2.5 hours, then Whisper internals, attention and TTS design from the head of ASR." },
    { label: "Voice AI and Voice Agents: an illustrated primer (sections 4 and 5)", url: "https://voiceaiandvoiceagents.com/", m: 60,
      why: "The whole production picture in one place: the loop, latency, STT, TTS, turn detection, telephony." },
    { label: "Hugging Face audio course: unit 1, working with audio data", url: "https://huggingface.co/learn/audio-course/chapter1/introduction", m: 45,
      why: "Waveforms, sample rates and spectrograms in runnable code, then ASR and TTS units after it." },
    { label: "Jurafsky and Martin, Speech and Language Processing (3e draft): ch. 16 ASR and ch. 17 TTS", url: "https://web.stanford.edu/~jurafsky/slp3/", m: 120,
      why: "The textbook treatment of CTC, encoder-decoder ASR, WER and vocoders, free as PDFs." }
  ],
  clusters: [
    { name: "Sound as data", line: "What a recording is before any model touches it.",
      topics: [
        { id: "sampling", name: "Samples, rates and frames",
          line: "Audio is a list of amplitude readings taken thousands of times a second.",
          body: [
            "A microphone produces a voltage that moves with air pressure. An analogue-to-digital converter reads it at a fixed **sample rate** and stores each reading as an integer of fixed **bit depth**. Telephone audio is 8 kHz, speech models mostly expect 16 kHz, music is 44.1 or 48 kHz. Sixteen-bit samples give about 96 dB of dynamic range, roughly 6 dB per bit.",
            "The **Nyquist** limit says a sample rate can only represent frequencies below half of itself, so 8 kHz phone audio carries nothing above 4 kHz, which is why an 's' and an 'f' blur on a call. Frequencies above the limit do not vanish: they fold back as false tones (aliasing), so a low-pass filter runs before sampling. Models and codecs then work on **frames**: short slices of 10 to 30 ms, often overlapping, because speech is roughly stable over that span."
          ],
          where: "Twilio media streams deliver 8 kHz audio; Whisper resamples everything to 16 kHz; WebRTC captures at 48 kHz and processes in 10 ms frames.",
          nuance: "Most silent bugs in audio pipelines are a sample rate mismatch: 8 kHz audio fed to a 16 kHz model without resampling plays at double speed to the model and still produces confident text.",
          read: [{ label: "Smith, The Scientist and Engineer's Guide to DSP: ch. 3 ADC and DAC (quantization, the sampling theorem)", url: "https://www.dspguide.com/ch3.htm", m: 30 }],
          see: [{ label: "Deep learning from scratch: stage 2, sound as data", href: "DEEP-LEARNING.html#/plan/stage-2" }],
          tags: ["nyquist", "sample rate", "bit depth", "aliasing", "pcm"] },
        { id: "spectrograms", name: "Spectrograms, mel and MFCC",
          line: "The frequency picture of sound over time, which is what speech models actually read.",
          body: [
            "The **Fourier transform** rewrites a frame of samples as the strength of each frequency in it; the **FFT** is the fast algorithm that does it in n log n. Slide a window (25 ms, stepping 10 ms) along the signal, take the FFT of each, and stack the results: that is the short-time Fourier transform, drawn as a **spectrogram** with time across, frequency up, and energy as brightness.",
            "Human hearing resolves low frequencies finely and high ones coarsely, so speech systems squash the frequency axis onto the **mel scale** with a bank of 80 or 128 triangular filters, then take the log. The result, the **log-mel spectrogram**, is the standard input to ASR and the standard output target of many TTS acoustic models. **MFCCs** go one step further (a cosine transform of the log-mels) and were the default feature before neural networks."
          ],
          where: "Whisper reads 80 log-mel channels (128 in large-v3); Tacotron 2 and FastSpeech 2 predict mel spectrograms for a vocoder to render.",
          nuance: "A spectrogram keeps magnitude and throws away phase, so you cannot play it back directly. Turning mels back into sound is a hard problem of its own, which is what vocoders exist for.",
          read: [{ label: "Haytham Fayek, Speech processing for machine learning: filter banks, MFCCs and what is in between", url: "https://haythamfayek.com/2016/04/21/speech-processing-for-machine-learning.html", m: 20 }],
          tags: ["fft", "stft", "mel", "mfcc", "fourier"] },
        { id: "codecs", name: "Codecs: PCM, mu-law and Opus",
          line: "How audio is packed for storage and the network, and what each choice costs.",
          body: [
            "**PCM** is raw samples, the WAV format: 16 kHz 16-bit mono is 256 kbit/s. **G.711 mu-law** (A-law in Europe) compresses each sample to 8 bits on a logarithmic curve that keeps quiet sounds precise; at 8 kHz that is the 64 kbit/s of the public phone network, unchanged since the 1970s.",
            "**Opus** is the modern codec for real-time audio and the default in WebRTC. It switches between a speech mode built on linear prediction (SILK) and a music mode built on a transform (CELT), runs from 6 to 510 kbit/s, and uses frames from 2.5 to 60 ms (20 ms is typical). Neural codecs such as EnCodec compress further by learning the representation, and are now the vocabulary that TTS models generate."
          ],
          where: "Phone calls reach a voice agent as mu-law through Twilio or Telnyx; Discord, WhatsApp calls and browsers use Opus.",
          nuance: "Every decode and re-encode costs quality and a few milliseconds. A pipeline that converts mu-law to PCM to Opus and back on every hop loses both, so pick one format per leg and resample once.",
          read: [{ label: "RFC 6716, Definition of the Opus audio codec: section 2, overview", url: "https://datatracker.ietf.org/doc/html/rfc6716", m: 15 }],
          tags: ["pcm", "wav", "mulaw", "g711", "opus", "silk", "celt"] },
        { id: "signal-processing", name: "Filters, noise suppression and echo cancellation",
          line: "Classic signal processing that cleans audio before a model hears it.",
          body: [
            "A **filter** keeps some frequencies and removes others: a high-pass at 80 Hz drops rumble, a low-pass before downsampling prevents aliasing. Filters are convolutions with a short kernel, the same operation as a CNN layer with fixed weights.",
            "**Noise suppression** estimates the noise spectrum and attenuates it band by band; RNNoise does this with a small recurrent network that predicts a gain for each of 22 bands, cheap enough for a CPU. **Acoustic echo cancellation** solves a different problem: the agent's own voice comes out of the caller's speaker and back into their microphone. An adaptive filter learns the echo path from the known outgoing signal and subtracts its prediction. **Automatic gain control** evens out loud and quiet talkers."
          ],
          where: "Browsers run WebRTC's AEC3 and noise suppression on every call; Krisp and NVIDIA Broadcast sell noise removal; RNNoise ships inside many open-source apps.",
          nuance: "Without echo cancellation a voice agent hears itself and interrupts itself. Aggressive noise suppression can also clip the start of soft words, which then shows up as ASR errors no model change will fix.",
          read: [{ label: "Jean-Marc Valin, RNNoise: learning noise suppression (the demo page)", url: "https://jmvalin.ca/demo/rnnoise/", m: 15 }],
          tags: ["aec", "echo cancellation", "noise suppression", "agc", "rnnoise", "filter"] }
      ] },
    { name: "Listening", line: "Models that find speech, transcribe it and tell speakers apart.",
      topics: [
        { id: "vad", name: "Voice activity detection",
          line: "A small classifier that labels each frame as speech or not speech.",
          body: [
            "A VAD runs on every frame (10 to 30 ms) and outputs a speech probability. The oldest version is an energy threshold; the WebRTC VAD uses a Gaussian mixture model over band energies; Silero VAD is a small neural network that handles noise far better and runs on a CPU in well under a millisecond per chunk.",
            "The model is the easy part. The decisions around it are **thresholds with hysteresis** (a higher bar to start speech than to keep it), a minimum speech length to ignore coughs and clicks, padding so word onsets are not cut, and how much trailing silence counts as the end of an utterance. Those settings decide whether an agent feels interrupting or sluggish."
          ],
          where: "Every voice agent framework (Pipecat, LiveKit Agents, Vapi) runs Silero or similar in front of ASR; Whisper pipelines use VAD to skip silence, which also reduces hallucinated text.",
          nuance: "VAD says someone is making speech sounds, not that they have finished their thought. Treating 'VAD went quiet for 500 ms' as 'the user is done' is the most common cause of an agent talking over people.",
          read: [{ label: "Silero VAD: the README, metrics and examples", url: "https://github.com/snakers4/silero-vad", m: 10 }],
          tags: ["vad", "silero", "endpointing", "hysteresis"] },
        { id: "asr", name: "Speech recognition: CTC, transducers, encoder-decoder",
          line: "The three ways a network turns a sequence of audio frames into a sequence of text.",
          body: [
            "Audio has far more frames than the transcript has characters, and nobody labels which frame belongs to which letter. **CTC** solves the alignment: the encoder emits a token or a special blank per frame, and the loss sums over every alignment that collapses (merge repeats, drop blanks) to the right text. It is fast and parallel but assumes each frame's output is independent of the others.",
            "The **transducer** (RNN-T) adds a small prediction network that conditions on text already emitted, which fixes that assumption and still streams; it is the default for on-device and streaming ASR. The **encoder-decoder** with attention (Whisper, Listen-Attend-Spell) lets a decoder attend to the whole utterance and write text like a language model: most accurate offline, hardest to stream. Encoders today are usually Conformers, transformers with convolution blocks added for local detail."
          ],
          where: "NVIDIA's Parakeet models use CTC and transducer heads; Google's on-device recognition uses transducers; Whisper and its descendants are encoder-decoders.",
          nuance: "Encoder-decoder models can produce fluent text that was never said, because the decoder is a language model. CTC fails more honestly: it misspells. That difference matters more in medical or legal transcripts than a point of WER.",
          read: [
            { label: "Awni Hannun, Sequence modeling with CTC (Distill)", url: "https://distill.pub/2017/ctc/", m: 25 },
            { label: "Gulati et al., Conformer: the abstract and section 2", url: "https://arxiv.org/abs/2005.08100", m: 15 }
          ],
          tags: ["asr", "stt", "ctc", "rnn-t", "transducer", "conformer", "attention"] },
        { id: "whisper", name: "Whisper",
          line: "OpenAI's encoder-decoder ASR, trained on 680,000 hours of weakly labelled web audio.",
          body: [
            "Whisper cuts audio into **30-second windows**, pads short ones with silence, turns each into a log-mel spectrogram, and runs a transformer encoder over it. A decoder then writes text token by token, steered by special tokens at the start: the language, the task (transcribe or translate to English) and whether to emit timestamps. Long files are handled by sliding the window and conditioning on the previous text.",
            "Its strength is data, not architecture: training on so much varied audio made it hold up across accents and noise without fine-tuning. Variants trade size for speed: large-v3-turbo cuts the decoder from 32 layers to 4, and faster-whisper and whisper.cpp reimplement it for CPUs and quantized GPUs."
          ],
          where: "Used for offline transcription almost everywhere: meeting notes, podcasts, subtitle tools, and as the baseline every new ASR model reports against.",
          nuance: "Whisper was not built to stream: the 30-second window and autoregressive decoder add delay, and on silence or music it can invent sentences. Production systems put a VAD in front and use a streaming model where latency matters.",
          read: [{ label: "Radford et al., the Whisper paper (2022): sections 2 and 3, data and model", url: "https://arxiv.org/abs/2212.04356", m: 30 }],
          see: [{ label: "Deep learning from scratch: stage 15, a speech system end to end", href: "DEEP-LEARNING.html#/plan/stage-15" }],
          tags: ["whisper", "openai", "log-mel", "faster-whisper"] },
        { id: "streaming-asr", name: "Streaming ASR",
          line: "Transcribing while the person is still talking, with partial results that later firm up.",
          body: [
            "A streaming recognizer consumes audio in chunks of tens of milliseconds and emits **partial** hypotheses that may change, then a **final** result for a stretch of speech once it is confident. To do that the encoder can only look a bounded distance ahead, using chunked or limited-context attention, and the decoder is usually CTC or a transducer rather than full attention.",
            "Two numbers describe it: accuracy (WER, usually a little worse than the same model offline) and **finalization latency**, the time from the end of a word to its final text. Providers also expose endpointing, deciding when an utterance has ended, which overlaps with turn-taking."
          ],
          where: "Deepgram, AssemblyAI, Google Cloud Speech, Azure and Speechmatics all sell streaming APIs over WebSockets; NVIDIA Riva and Parakeet serve it self-hosted.",
          nuance: "Acting on partials saves hundreds of milliseconds but means acting on words that may change. Agents usually start preparing on partials and commit only on finals.",
          tags: ["streaming", "partials", "endpointing", "deepgram", "assemblyai"] },
        { id: "speaker-diarization", name: "Speaker recognition and diarization",
          line: "Who is speaking: verifying one voice, or splitting a recording by speaker.",
          body: [
            "A speaker encoder maps a few seconds of speech to a fixed vector, an **embedding**, so that the same voice lands close together whatever is said. x-vectors and ECAPA-TDNN are the standard architectures. **Verification** compares two embeddings against a threshold and is scored by equal error rate.",
            "**Diarization** answers 'who spoke when' without knowing the speakers in advance: segment the audio, embed each segment, cluster the embeddings, and handle overlapping speech. It is scored by **diarization error rate**, the share of time that is missed speech, false speech or the wrong speaker. On the AMI meeting corpus, open models sit in the high teens of percent."
          ],
          where: "pyannote.audio is the open default; meeting tools such as Otter and Zoom label speakers this way; voice cloning and TTS use the same embeddings to condition on a voice.",
          nuance: "Embeddings capture the channel as well as the voice, so the same person on a phone and a studio mic can look like two people. Overlapping speech is where every system still loses most of its errors.",
          read: [
            { label: "pyannote.audio: the README and benchmark table", url: "https://github.com/pyannote/pyannote-audio", m: 10 },
            { label: "Desplanques et al., ECAPA-TDNN: the abstract and architecture section", url: "https://arxiv.org/abs/2005.07143", m: 20 }
          ],
          see: [{ label: "Deep learning from scratch: stage 17, speaker identity", href: "DEEP-LEARNING.html#/plan/stage-17" }],
          tags: ["diarization", "speaker verification", "x-vector", "ecapa", "der", "pyannote"] }
      ] },
    { name: "Speaking", line: "Models that turn text, or another voice, into sound.",
      topics: [
        { id: "tts", name: "Text to speech",
          line: "Text in, waveform out, through a front end, an acoustic model and a vocoder.",
          body: [
            "The classic neural pipeline has three stages. A **front end** normalizes text ('Dr.' to 'doctor', '$5' to 'five dollars') and may convert it to phonemes. An **acoustic model** predicts a mel spectrogram from that text, deciding duration, pitch and energy (Tacotron 2 did it autoregressively with attention, FastSpeech 2 predicts durations and generates in parallel). A **vocoder** turns the mel into a waveform.",
            "Since 2023 the leading systems instead generate **discrete audio tokens** from a neural codec with a language model, or generate continuous latents with flow matching or diffusion. Good TTS separates *what is said* from *who says it* and *how*: content, speaker and prosody live in different parts of the representation, so each can be changed alone."
          ],
          where: "ElevenLabs, Cartesia, OpenAI, Deepgram Aura and Sarvam's Bulbul sell it as an API; open models include Kokoro, F5-TTS and XTTS.",
          nuance: "For an agent the metric is **time to first audio**, not total synthesis time: a model must stream its first 100 ms of sound before it has read the whole sentence, which rules out designs that need the full text up front.",
          read: [{ label: "Jurafsky and Martin, SLP3 ch. 17 Text-to-Speech", url: "https://web.stanford.edu/~jurafsky/slp3/", m: 45 }],
          see: [{ label: "Deep learning from scratch: stage 19, how a TTS model works", href: "DEEP-LEARNING.html#/plan/stage-19" }],
          tags: ["tts", "tacotron", "fastspeech", "prosody", "elevenlabs", "cartesia"] },
        { id: "vocoders", name: "Vocoders",
          line: "The network that turns a spectrogram or codec tokens back into a playable waveform.",
          body: [
            "A mel spectrogram has no phase and far fewer numbers than the audio it describes, so reconstructing sound means inventing detail plausibly. **WaveNet** (2016) did it sample by sample with dilated convolutions: excellent quality, far too slow for real time. **GAN vocoders** such as HiFi-GAN generate all samples in parallel, trained against discriminators that judge the waveform at several periods and scales; HiFi-GAN runs about 168 times faster than real time on a V100 GPU.",
            "In codec-based TTS the codec's own decoder plays the vocoder's role, turning tokens into audio. Newer vocoders (Vocos, BigVGAN) predict Fourier coefficients or scale up the GAN for any speaker and any recording condition."
          ],
          where: "HiFi-GAN and its descendants sit at the end of most open TTS stacks; on-device assistants use small GAN vocoders to run on a phone CPU.",
          nuance: "Many 'robotic' or buzzy artefacts people blame on the TTS model come from a vocoder that saw too little data like the target voice. Fine-tuning the vocoder alone is often the cheapest quality fix.",
          read: [
            { label: "Kong et al., HiFi-GAN: the abstract and section 2", url: "https://arxiv.org/abs/2010.05646", m: 20 },
            { label: "van den Oord et al., WaveNet: the abstract and section 2", url: "https://arxiv.org/abs/1609.03499", m: 20 }
          ],
          tags: ["vocoder", "hifi-gan", "wavenet", "gan", "bigvgan"] },
        { id: "neural-codecs", name: "Neural codecs and audio tokens",
          line: "Learned compression that turns audio into integer tokens a language model can generate.",
          body: [
            "A neural codec is an autoencoder: an encoder squeezes audio into a short sequence of vectors, a quantizer turns each vector into integers, and a decoder rebuilds the waveform. The trick is **residual vector quantization**: the first codebook picks the nearest code, the second encodes what the first missed, and so on, so a few codebooks carry coarse content and later ones fine detail. Bitrate is set by how many codebooks you keep.",
            "SoundStream and EnCodec (24 kHz audio at 1.5 to 24 kbit/s) started this; Mimi, the codec inside Moshi, runs at 12.5 frames a second. Once audio is tokens, speech generation becomes next-token prediction, which is why TTS and speech-to-speech models now look like LLMs."
          ],
          where: "VALL-E, Moshi, many current TTS models and music generators all generate codec tokens; Meta's EnCodec is open source.",
          nuance: "Lower frame rates make sequences short enough for a transformer but lose fine timing. Codec choice quietly sets the ceiling on the quality of everything generated through it.",
          read: [{ label: "Défossez et al., High fidelity neural audio compression (EnCodec): sections 1 to 3", url: "https://arxiv.org/abs/2210.13438", m: 25 }],
          tags: ["codec", "rvq", "encodec", "soundstream", "mimi", "audio tokens"] },
        { id: "voice-cloning", name: "Voice cloning",
          line: "Speaking in a new voice from a few seconds of reference audio.",
          body: [
            "Zero-shot cloning conditions a TTS model on a short sample of the target speaker. Older systems pass a speaker embedding from a verification model; codec language models such as VALL-E put the reference audio's tokens in the prompt and continue in that voice, from as little as 3 seconds. Fine-tuned cloning trains on minutes or hours of one speaker for higher similarity.",
            "Quality is judged on two axes at once: **speaker similarity** (cosine distance between embeddings of real and cloned speech) and naturalness. Pushing one often hurts the other: copying the reference closely also copies its room noise and microphone."
          ],
          where: "ElevenLabs and Resemble sell it; dubbing, audiobooks and accessibility (people losing their voice to illness) are the main legitimate uses.",
          nuance: "Cloning is also the engine of voice fraud. Responsible products require consent checks, watermark generated audio, and refuse public figures. It is also why a voice alone is now a weak way to prove identity.",
          read: [{ label: "Wang et al., Neural codec language models are zero-shot TTS synthesizers (VALL-E): abstract and section 1", url: "https://arxiv.org/abs/2301.02111", m: 15 }],
          tags: ["voice cloning", "zero-shot", "speaker embedding", "vall-e", "watermark"] },
        { id: "speech-to-speech", name: "Speech-to-speech and full-duplex models",
          line: "One model that listens and speaks directly, without a text step in between.",
          body: [
            "A cascade turns speech into text, text into a reply, and the reply into speech, losing tone and adding delay at each hand-off. A **speech-to-speech** model takes audio tokens in and produces audio tokens out, so it can hear hesitation and answer with emotion. **Full-duplex** models go further: they model the user's and the assistant's audio as two parallel streams at once, so they can listen while talking, backchannel ('mm-hm') and be interrupted naturally.",
            "Kyutai's Moshi is the open reference: it predicts aligned text tokens before audio tokens (an 'inner monologue') and reports about 200 ms practical latency. Commercial versions are OpenAI's Realtime API and Gemini Live."
          ],
          where: "Consumer voice modes in ChatGPT and Gemini; most enterprise agents still run cascades and trial speech-to-speech for open conversation.",
          nuance: "You give up control: no transcript to inspect before speaking, weaker tool calling and instruction following, harder evaluation, and usually higher cost per minute. That is why regulated domains still prefer cascades.",
          read: [{ label: "Défossez et al., Moshi: a speech-text foundation model for real-time dialogue (abstract and section 1)", url: "https://arxiv.org/abs/2410.00037", m: 20 }],
          tags: ["speech-to-speech", "full duplex", "moshi", "realtime api", "gemini live"] }
      ] },
    { name: "Voice agents in production", line: "Running the whole loop live, on a call, under a latency budget.",
      topics: [
        { id: "voice-agent-pipeline", name: "The voice agent pipeline",
          line: "VAD, streaming ASR, an LLM and streaming TTS, wired so every stage overlaps.",
          body: [
            "A cascaded voice agent is a pipeline of frames. Audio arrives, VAD marks speech, streaming ASR produces text, a turn detector decides the user has finished, an LLM writes a reply (and may call tools), and TTS speaks it back. Each stage **streams**: the LLM's first sentence goes to TTS before the second is written, and TTS audio goes to the caller before synthesis is finished.",
            "Frameworks such as Pipecat and LiveKit Agents provide the frame bus, interruption handling and provider plugins, so the work moves to policy: what to say while a slow tool runs, when to hand off to a human, and how to keep a long call's context small."
          ],
          where: "Vapi, Retell, Bland and Sierra sell hosted agents; Pipecat and LiveKit Agents are the open frameworks; contact centres, clinics and restaurants are the early buyers.",
          nuance: "The cascade wins on control and debuggability: every turn leaves a transcript and an LLM call you can replay. Teams that need it to feel instant often run a small fast model to talk and a larger one to think in parallel.",
          read: [{ label: "Voice AI and Voice Agents primer: section 4, the basic conversational loop", url: "https://voiceaiandvoiceagents.com/", m: 20 }],
          see: [{ label: "System design guide: voice agent for patient calls", href: "SYSTEM%20DESIGN.html#/designs/voice-agent" }],
          tags: ["voice agent", "pipecat", "livekit", "cascade", "vapi"] },
        { id: "telephony-webrtc", name: "Telephony and WebRTC",
          line: "The two ways audio reaches an agent: the phone network, or a browser or app.",
          body: [
            "**Telephony** means the public phone network. A call reaches a provider (Twilio, Telnyx, Vonage) over a SIP trunk, and the provider hands audio to your server, often as 8 kHz mu-law over a WebSocket, or as RTP if you speak SIP yourself. Expect narrowband audio, extra network delay and DTMF keypresses.",
            "**WebRTC** is the browser and app standard: Opus at 48 kHz over UDP, so a lost packet is skipped rather than resent. ICE, STUN and TURN find a path through NATs, a **jitter buffer** reorders and smooths packets, and the browser runs echo cancellation and noise suppression for you. LiveKit and Daily run the media servers most agents use."
          ],
          where: "Phone agents for clinics and banks ride SIP through Twilio or Telnyx; in-app voice modes (ChatGPT, Gemini) use WebRTC.",
          nuance: "Running audio over a TCP WebSocket works on a good network and degrades badly on a bad one: one lost packet stalls everything behind it. WebRTC exists to avoid exactly that.",
          read: [{ label: "WebRTC for the Curious: ch. 6, media communication (RTP, RTCP, congestion control)", url: "https://webrtcforthecurious.com/docs/06-media-communication/", m: 25 }],
          tags: ["sip", "pstn", "twilio", "webrtc", "rtp", "jitter buffer", "dtmf"] },
        { id: "turn-taking", name: "Turn-taking and barge-in",
          line: "Deciding when the caller has finished, and stopping cleanly when they interrupt.",
          body: [
            "**Endpointing** decides the user's turn is over. The simple rule is silence after VAD for a fixed time; 300 to 800 ms is common, trading cut-offs against slowness. **Semantic turn detection** adds a small model that reads the transcript (and sometimes the audio) to judge whether the sentence sounds complete, so 'my number is 4 1 5...' waits and 'yes' does not.",
            "**Barge-in** is the reverse: the user talks while the agent speaks. The agent must stop audio within a couple of hundred milliseconds, cancel the LLM and TTS in flight, and record what was actually heard, not what was generated, in its history. **Backchannels** ('yeah', 'right') should not count as interruptions."
          ],
          where: "LiveKit's turn detector model, Pipecat's smart-turn, and endpointing options in Deepgram and AssemblyAI all address this.",
          nuance: "An agent that remembers saying a sentence the caller cut off halfway will refer back to something they never heard. Truncating the history at the barge-in point is the fix and is often missed.",
          read: [{ label: "LiveKit docs: turn detection and interruptions", url: "https://docs.livekit.io/agents/logic/turns", m: 15 }],
          tags: ["endpointing", "turn detection", "barge-in", "interruption", "backchannel"] },
        { id: "latency-budget", name: "The latency budget",
          line: "Where the milliseconds go between the caller stopping and the agent's first sound.",
          body: [
            "The number that matters is **voice-to-voice latency**: from the end of the user's speech to the first audio they hear back. Every stage spends some: network in, the endpointing wait, ASR finalization, the LLM's time to first token, TTS time to first byte, and network out, plus buffers in between. The voice agents primer puts a typical cascade at about 1.3 seconds and treats 1.5 seconds as the target to stay under.",
            "Budget it per stage from the first design, measured at p95, not the average. The levers: shorter endpointing with a semantic turn model, streaming everything, a fast first-token LLM, co-locating services in one region, and filler speech while a slow tool call runs."
          ],
          where: "Every voice agent vendor publishes latency claims; the honest ones measure from recorded calls at the caller's side, not from server logs.",
          nuance: "The endpointing wait is usually the largest single item and it is a setting, not a model. Cutting it is cheap until the agent starts interrupting people mid-sentence.",
          read: [{ label: "Voice AI and Voice Agents primer: the latency section and its table", url: "https://voiceaiandvoiceagents.com/", m: 15 }],
          see: [{ label: "System design guide: voice agent for patient calls", href: "SYSTEM%20DESIGN.html#/designs/voice-agent" }],
          tags: ["latency", "ttfb", "ttft", "voice-to-voice", "p95"] },
        { id: "evaluation", name: "Evaluation: WER, MOS and beyond",
          line: "How speech systems are scored, and why the headline numbers mislead.",
          body: [
            "**Word error rate** aligns the hypothesis to the reference and counts substitutions, deletions and insertions over the number of reference words; it can exceed 100%. Text normalization (case, punctuation, 'ten' against '10') changes it by points, so compare only under one normalizer. Languages without spaces use character error rate. Speed is reported as real-time factor; the Open ASR Leaderboard ranks models on both.",
            "TTS is judged by listeners: **MOS**, a 1 to 5 naturalness rating averaged over many raters, and preference tests between systems. Learned predictors such as UTMOS estimate MOS cheaply. Add speaker similarity for cloning, and for agents, task success, latency at p95 and interruption rate on real calls."
          ],
          where: "Hugging Face's Open ASR Leaderboard reports WER and RTFx across datasets; TTS papers report MOS; agent teams replay recorded calls through new versions.",
          nuance: "Average WER hides what matters: names, numbers and domain terms carry most of the meaning and most of the errors. Measure entity accuracy on your own audio, not LibriSpeech.",
          read: [
            { label: "Open ASR Leaderboard: the README, metrics and method", url: "https://github.com/huggingface/open_asr_leaderboard", m: 10 },
            { label: "Saeki et al., UTMOS: MOS prediction (abstract)", url: "https://arxiv.org/abs/2204.02152", m: 10 }
          ],
          see: [{ label: "Deep learning from scratch: stage 21, evaluation", href: "DEEP-LEARNING.html#/plan/stage-21" }],
          tags: ["wer", "cer", "mos", "utmos", "rtf", "benchmark"] }
      ] }
  ],
  see: [
    { label: "Deep learning from scratch: the audio stages", href: "DEEP-LEARNING.html#/plan/stage-15" },
    { label: "System design guide: voice agent for patient calls", href: "SYSTEM%20DESIGN.html#/designs/voice-agent" }
  ]
});
