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
            "A microphone's voltage follows air pressure. An analogue-to-digital converter reads it at a fixed **sample rate** and stores each reading as an integer of fixed **bit depth**. Phone audio is 8 kHz, speech models mostly expect 16 kHz, music uses 44.1 or 48 kHz. Each bit adds about 6 dB of dynamic range, so 16-bit gives about 96 dB.",
            "The **Nyquist** limit says a rate can only represent frequencies below half of itself, so 8 kHz audio carries nothing above 4 kHz. Higher frequencies fold back as false tones (aliasing), so a low-pass filter runs before sampling. Models then work on **frames** of 10 to 30 ms, over which speech is roughly stable."
          ],
          uses: [
            "**Twilio media streams**: deliver phone audio to your server at 8 kHz, which is why an 's' and an 'f' blur on a call.",
            "**Whisper**: resamples every input to 16 kHz mono before computing features, whatever the original rate.",
            "**WebRTC in the browser**: captures at 48 kHz and processes audio in 10 ms frames for echo cancellation and encoding."
          ],
          example: "One second of 16 kHz, 16-bit mono audio is 16,000 samples, 32,000 bytes. A 20 ms frame is 320 samples (640 bytes). The same 20 ms of phone audio at 8 kHz mu-law is 160 samples in 160 bytes, so feeding it to a 16 kHz model means decoding to PCM and producing 320 samples from every 160.",
          nuance: "Most silent bugs in audio pipelines are a sample rate mismatch: 8 kHz audio fed to a 16 kHz model without resampling plays at double speed to the model and still produces confident text.",
          read: [{ label: "Smith, The Scientist and Engineer's Guide to DSP: ch. 3 ADC and DAC (quantization, the sampling theorem)", url: "https://www.dspguide.com/ch3.htm", m: 30 }],
          see: [{ label: "Deep learning from scratch: stage 2, sound as data", href: "DEEP-LEARNING.html#/plan/stage-2" }],
          tags: ["nyquist", "sample rate", "bit depth", "aliasing", "pcm"] },
        { id: "spectrograms", name: "Spectrograms, mel and MFCC",
          line: "The frequency picture of sound over time, which is what speech models actually read.",
          body: [
            "The **Fourier transform** rewrites a frame of samples as the strength of each frequency in it; the **FFT** computes it in n log n. Slide a 25 ms window in 10 ms steps, take an FFT of each, and stack them: a **spectrogram**, with time across, frequency up and energy as brightness.",
            "Hearing resolves low frequencies finely and high ones coarsely, so speech systems map the frequency axis onto the **mel scale** with 80 or 128 triangular filters, then take the log. The **log-mel spectrogram** is the standard input to ASR and a common output of TTS acoustic models. **MFCCs** (a cosine transform of the log-mels) were the default feature before neural networks."
          ],
          uses: [
            "**Whisper**: reads 80 log-mel channels per 10 ms step, 128 in large-v3.",
            "**Tacotron 2 and FastSpeech 2**: predict a mel spectrogram from text and leave a vocoder to render it as sound.",
            "**Kaldi recipes**: fed MFCCs to Gaussian mixture and hidden Markov models, the standard ASR pipeline before end-to-end networks."
          ],
          example: "Take 30 seconds of 16 kHz audio: 480,000 samples. A 25 ms window (400 samples) stepping 10 ms (160 samples) gives 3,000 frames. Each FFT yields 201 frequency bins, and 80 mel filters reduce them to 80 values. The model sees an 80 by 3,000 grid, which is exactly Whisper's input.",
          nuance: "A spectrogram keeps magnitude and throws away phase, so you cannot play it back directly. Turning mels back into sound is a hard problem of its own, which is what vocoders exist for.",
          read: [{ label: "Haytham Fayek, Speech processing for machine learning: filter banks, MFCCs and what is in between", url: "https://haythamfayek.com/2016/04/21/speech-processing-for-machine-learning.html", m: 20 }],
          tags: ["fft", "stft", "mel", "mfcc", "fourier"] },
        { id: "codecs", name: "Codecs: PCM, mu-law and Opus",
          line: "How audio is packed for storage and the network, and what each choice costs.",
          body: [
            "**PCM** is raw samples, the WAV format: 16 kHz 16-bit mono is 256 kbit/s. **G.711 mu-law** (A-law in Europe) stores each sample in 8 bits on a logarithmic curve that keeps quiet sounds precise; at 8 kHz that is the 64 kbit/s of the public phone network.",
            "**Opus** is the modern codec for real-time audio and the default in WebRTC. It switches between a speech mode built on linear prediction (SILK) and a music mode built on a transform (CELT), runs from 6 to 510 kbit/s, and uses frames of 2.5 to 60 ms, 20 ms typical. Neural codecs such as EnCodec compress further by learning the representation."
          ],
          uses: [
            "**Twilio and Telnyx**: hand phone calls to a voice agent as 8 kHz mu-law, the format of the public network.",
            "**WebRTC and Discord**: encode voice as Opus, typically in 20 ms packets.",
            "**WAV files and model inputs**: carry plain PCM, so every speech pipeline decodes to it before computing features."
          ],
          example: "A 10-minute call at 8 kHz mu-law is 64 kbit/s, about 4.8 MB. The same call as 16 kHz 16-bit PCM for a model is 256 kbit/s, about 19 MB. Wideband Opus at 24 kbit/s holds a call of the same length in 1.8 MB, and sounds better than the phone version.",
          nuance: "Every decode and re-encode costs quality and a few milliseconds. A pipeline that converts mu-law to PCM to Opus and back on every hop loses both, so pick one format per leg and resample once.",
          read: [{ label: "RFC 6716, Definition of the Opus audio codec: section 2, overview", url: "https://datatracker.ietf.org/doc/html/rfc6716", m: 15 }],
          tags: ["pcm", "wav", "mulaw", "g711", "opus", "silk", "celt"] },
        { id: "signal-processing", name: "Filters, noise suppression and echo cancellation",
          line: "Classic signal processing that cleans audio before a model hears it.",
          body: [
            "A **filter** keeps some frequencies and removes others: a high-pass at 80 Hz drops rumble, a low-pass before downsampling prevents aliasing. A filter is a convolution with a short kernel, a CNN layer with fixed weights.",
            "**Noise suppression** estimates the noise and attenuates it band by band; RNNoise uses a small recurrent network that predicts a gain for each of 22 bands, cheap on a CPU. **Acoustic echo cancellation** removes the agent's own voice coming back through the caller's microphone: an adaptive filter learns the echo path from the known outgoing audio and subtracts its prediction. **Automatic gain control** evens out loud and quiet talkers."
          ],
          uses: [
            "**WebRTC in browsers**: runs AEC3 echo cancellation, noise suppression and gain control on every call before the audio is encoded.",
            "**Krisp and NVIDIA Broadcast**: sell neural noise removal that sits between the microphone and any call app.",
            "**OBS Studio**: offers RNNoise as a CPU-cheap noise suppression filter for streamers."
          ],
          example: "A caller on speakerphone hears the agent say 'Your appointment is on Tuesday'. The sound leaks back into their microphone a moment later. Without echo cancellation, VAD marks it as speech, ASR transcribes 'appointment is on Tuesday', and the agent stops to answer its own sentence. With AEC, the filter predicts that echo from the outgoing signal and subtracts it first.",
          nuance: "Without echo cancellation a voice agent hears itself and interrupts itself. Aggressive noise suppression can also clip the start of soft words, which then shows up as ASR errors no model change will fix.",
          read: [{ label: "Jean-Marc Valin, RNNoise: learning noise suppression (the demo page)", url: "https://jmvalin.ca/demo/rnnoise/", m: 15 }],
          tags: ["aec", "echo cancellation", "noise suppression", "agc", "rnnoise", "filter"] }
      ] },
    { name: "Listening", line: "Models that find speech, transcribe it and tell speakers apart.",
      topics: [
        { id: "vad", name: "Voice activity detection",
          line: "A small classifier that labels each frame as speech or not speech.",
          body: [
            "A VAD outputs a speech probability for every 10 to 30 ms frame. The oldest version is an energy threshold; the WebRTC VAD uses a Gaussian mixture model over band energies; Silero VAD is a small neural network that handles noise far better and runs on a CPU in under a millisecond per chunk.",
            "The model is the easy part. The decisions around it are **thresholds with hysteresis** (a higher bar to start speech than to keep it), a minimum speech length to ignore coughs, padding so word onsets are not cut, and how much trailing silence ends an utterance. Those settings decide whether an agent feels interrupting or sluggish."
          ],
          uses: [
            "**Pipecat and LiveKit Agents**: run Silero VAD in front of streaming ASR to decide when speech starts and when the user may be done.",
            "**faster-whisper**: offers a Silero VAD filter that drops silence before transcription, which also cuts hallucinated text.",
            "**py-webrtcvad**: wraps the GMM detector from Google's WebRTC code, still used where a few kilobytes and no model file matter."
          ],
          example: "One set of settings for a phone agent: speech starts when the probability passes 0.5, and continues while it stays above 0.35. Bursts under 250 ms are dropped, 200 ms of padding is kept before each onset, and 600 ms below threshold ends the utterance. A 150 ms cough is ignored; a 400 ms pause mid-sentence does not split it.",
          nuance: "VAD says someone is making speech sounds, not that they have finished their thought. Treating 'VAD went quiet for 500 ms' as 'the user is done' is the most common cause of an agent talking over people.",
          read: [{ label: "Silero VAD: the README, metrics and examples", url: "https://github.com/snakers4/silero-vad", m: 10 }],
          tags: ["vad", "silero", "endpointing", "hysteresis"] },
        { id: "asr", name: "Speech recognition: CTC, transducers, encoder-decoder",
          line: "The three ways a network turns a sequence of audio frames into a sequence of text.",
          body: [
            "Audio has far more frames than its transcript has letters, and nobody labels which frame is which letter. **CTC** emits a token or a special blank per frame and sums over every alignment that collapses (merge repeats, drop blanks) to the right text. It is fast and parallel but treats each frame's output as independent.",
            "The **transducer** (RNN-T) adds a prediction network that conditions on text already emitted, and still streams. The **encoder-decoder** (Whisper) lets a decoder attend to the whole utterance and write like a language model: most accurate offline, hardest to stream. Encoders are usually Conformers, transformers with convolution blocks for local detail."
          ],
          uses: [
            "**NVIDIA Parakeet**: ships one FastConformer encoder with CTC, transducer and TDT heads, trading accuracy against speed.",
            "**Google's on-device recognition**: runs a streaming transducer on the phone, so dictation works without a server.",
            "**Whisper**: is an encoder-decoder, which is why it is accurate on recorded audio and awkward to stream."
          ],
          example: "CTC collapse, frame by frame: the encoder emits `c c _ a a _ _ t t`. Merge repeats to `c _ a _ t`, drop blanks, and it reads `cat`. To spell `hello`, the two l's need a blank between them (`l _ l`), or they would merge into one. The loss adds up the probability of every frame path that collapses to the target.",
          nuance: "Encoder-decoder models can produce fluent text that was never said, because the decoder is a language model. CTC fails more honestly: it misspells. That difference matters more in medical or legal transcripts than a point of WER.",
          read: [
            { label: "Awni Hannun, Sequence modeling with CTC (Distill)", url: "https://distill.pub/2017/ctc/", m: 25 },
            { label: "Gulati et al., Conformer: the abstract and section 2", url: "https://arxiv.org/abs/2005.08100", m: 15 }
          ],
          tags: ["asr", "stt", "ctc", "rnn-t", "transducer", "conformer", "attention"] },
        { id: "whisper", name: "Whisper",
          line: "OpenAI's encoder-decoder ASR, trained on 680,000 hours of weakly labelled web audio.",
          body: [
            "Whisper cuts audio into **30-second windows**, pads short ones with silence, turns each into a log-mel spectrogram and runs a transformer encoder over it. A decoder writes text token by token, steered by special tokens: the language, the task (transcribe or translate to English) and whether to emit timestamps. Long files slide the window and condition on the previous text.",
            "Its strength is data, not architecture: varied web audio made it hold up across accents and noise without fine-tuning. large-v3-turbo cuts the decoder from 32 layers to 4; faster-whisper and whisper.cpp reimplement it for CPUs and quantized GPUs."
          ],
          uses: [
            "**Meeting notes and podcast tools**: transcribe recorded audio offline, where a few seconds of delay costs nothing.",
            "**Subtitle tools**: use its timestamp tokens to align text to stretches of video.",
            "**The Open ASR Leaderboard**: lists Whisper models as the baseline every new recognizer reports against."
          ],
          example: "The decoder's prompt for a Spanish clip with timestamps is `<|startoftranscript|><|es|><|transcribe|>`, and it continues with text between time tokens, such as `<|0.00|> Hola, buenos días <|1.80|>`. Swap `<|transcribe|>` for `<|translate|>` and the same model writes the English instead. One network, steered by four tokens.",
          nuance: "Whisper was not built to stream: the 30-second window and autoregressive decoder add delay, and on silence or music it can invent sentences. Production systems put a VAD in front and use a streaming model where latency matters.",
          read: [{ label: "Radford et al., the Whisper paper (2022): sections 2 and 3, data and model", url: "https://arxiv.org/abs/2212.04356", m: 30 }],
          see: [{ label: "Deep learning from scratch: stage 15, a speech system end to end", href: "DEEP-LEARNING.html#/plan/stage-15" }],
          tags: ["whisper", "openai", "log-mel", "faster-whisper"] },
        { id: "streaming-asr", name: "Streaming ASR",
          line: "Transcribing while the person is still talking, with partial results that later firm up.",
          body: [
            "A streaming recognizer consumes audio in chunks of tens of milliseconds and emits **partial** hypotheses that may change, then a **final** result once it is confident. The encoder can only look a bounded distance ahead (chunked or limited-context attention), and the decoder is usually CTC or a transducer rather than full attention.",
            "Two numbers describe it: WER, usually a little worse than the same model offline, and **finalization latency**, the time from the end of a word to its final text. Providers also offer endpointing, which overlaps with turn-taking."
          ],
          uses: [
            "**Deepgram and AssemblyAI**: stream audio over a WebSocket and return interim and final transcripts plus end-of-utterance events.",
            "**Google Cloud Speech, Azure and Speechmatics**: offer the same pattern inside their speech APIs.",
            "**NVIDIA Riva**: serves streaming Parakeet models self-hosted, for teams that keep audio on their own GPUs."
          ],
          example: "A caller says 'I need to reschedule'. Partials arrive as 'I', 'I need', 'I need to read', 'I need to reschedule', then a final 'I need to reschedule.' shortly after the last word. The third partial was wrong and got corrected. An agent can start fetching appointments on the partial, but commits its reply only on the final.",
          nuance: "Acting on partials saves hundreds of milliseconds but means acting on words that may change. Agents usually start preparing on partials and commit only on finals.",
          tags: ["streaming", "partials", "endpointing", "deepgram", "assemblyai"] },
        { id: "speaker-diarization", name: "Speaker recognition and diarization",
          line: "Who is speaking: verifying one voice, or splitting a recording by speaker.",
          body: [
            "A speaker encoder maps a few seconds of speech to a fixed vector, an **embedding**, so one voice lands in the same place whatever is said; x-vectors and ECAPA-TDNN are the standard architectures. **Verification** compares two embeddings against a threshold and is scored by equal error rate.",
            "**Diarization** answers 'who spoke when' without knowing the speakers in advance: segment the audio, embed each segment, cluster the embeddings and handle overlapping speech. It is scored by **diarization error rate**, the share of time that is missed speech, false speech or the wrong speaker."
          ],
          uses: [
            "**pyannote.audio**: the open default diarization pipeline, used under many transcription tools.",
            "**Meeting note tools such as Otter**: label each transcript line with a speaker and remember a voice once a user names it.",
            "**Bank voice biometrics**: compare a caller's embedding with an enrolled voiceprint to verify identity.",
            "**Voice cloning and multi-speaker TTS**: condition generation on the same kind of speaker embedding."
          ],
          example: "A 30-minute two-person interview is cut into 1.5-second segments, about 1,200 of them. Each becomes a 192-dimension ECAPA embedding. Clustering finds two groups, and segments are labelled A or B and merged into turns. If 90 seconds go to the wrong speaker and 60 seconds of speech are missed, DER is 150 over 1,800 seconds, about 8%.",
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
            "The classic neural pipeline has three stages. A **front end** normalizes text ('Dr.' to 'doctor', '$5' to 'five dollars') and may convert it to phonemes. An **acoustic model** predicts a mel spectrogram, deciding duration, pitch and energy (Tacotron 2 autoregressively, FastSpeech 2 in parallel). A **vocoder** turns the mel into a waveform.",
            "Since 2023 the leading systems instead generate **discrete audio tokens** from a neural codec with a language model, or continuous latents with flow matching or diffusion. Good TTS keeps content, speaker and prosody separable, so each can change alone."
          ],
          uses: [
            "**ElevenLabs and Cartesia**: sell streaming TTS APIs used in most voice agent stacks, judged on time to first audio.",
            "**OpenAI, Deepgram Aura and Sarvam's Bulbul**: offer TTS beside their other speech models, Bulbul for Indian languages.",
            "**Kokoro, F5-TTS and XTTS**: open models that teams self-host for cost or privacy."
          ],
          example: "Input: 'Your balance is $1,250 as of 3/4.' The front end must say 'one thousand two hundred fifty dollars', and decide whether 3/4 is 'March fourth', 'the third of April' or 'three quarters'. A voice that reads 'three slash four' sounds broken however natural it is. Many agent teams normalize numbers and dates in the LLM's output before TTS sees them.",
          nuance: "For an agent the metric is **time to first audio**, not total synthesis time: a model must stream its first 100 ms of sound before it has read the whole sentence, which rules out designs that need the full text up front.",
          read: [{ label: "Jurafsky and Martin, SLP3 ch. 17 Text-to-Speech", url: "https://web.stanford.edu/~jurafsky/slp3/", m: 45 }],
          see: [{ label: "Deep learning from scratch: stage 19, how a TTS model works", href: "DEEP-LEARNING.html#/plan/stage-19" }],
          tags: ["tts", "tacotron", "fastspeech", "prosody", "elevenlabs", "cartesia"] },
        { id: "vocoders", name: "Vocoders",
          line: "The network that turns a spectrogram or codec tokens back into a playable waveform.",
          body: [
            "A mel spectrogram has no phase and far fewer numbers than its audio, so reconstructing sound means inventing detail plausibly. **WaveNet** (2016) generated sample by sample with dilated convolutions: excellent, far too slow for real time. **GAN vocoders** such as HiFi-GAN generate all samples in parallel, trained against discriminators that judge the waveform at several periods and scales; HiFi-GAN runs about 168 times faster than real time on a V100 GPU.",
            "In codec-based TTS the codec's own decoder plays this role. Vocos predicts Fourier coefficients instead of samples; BigVGAN scales the GAN up for any speaker and recording condition."
          ],
          uses: [
            "**Open TTS stacks**: end in HiFi-GAN or a descendant, which turns predicted mels into 22 or 24 kHz audio.",
            "**NVIDIA's BigVGAN**: an open universal vocoder trained to render voices and recording conditions it never saw.",
            "**On-device assistants**: run small GAN vocoders on a phone CPU so speech works offline."
          ],
          example: "At 22,050 Hz with a hop of 256 samples, one second of audio is about 86 mel frames of 80 values: some 6,900 numbers. The vocoder must produce 22,050 samples from them, 256 per frame, with a phase it has to invent. That gap is why vocoder faults sound like buzz or metallic hiss.",
          nuance: "Many 'robotic' or buzzy artefacts people blame on the TTS model come from a vocoder that saw too little data like the target voice. Fine-tuning the vocoder alone is often the cheapest quality fix.",
          read: [
            { label: "Kong et al., HiFi-GAN: the abstract and section 2", url: "https://arxiv.org/abs/2010.05646", m: 20 },
            { label: "van den Oord et al., WaveNet: the abstract and section 2", url: "https://arxiv.org/abs/1609.03499", m: 20 }
          ],
          tags: ["vocoder", "hifi-gan", "wavenet", "gan", "bigvgan"] },
        { id: "neural-codecs", name: "Neural codecs and audio tokens",
          line: "Learned compression that turns audio into integer tokens a language model can generate.",
          body: [
            "A neural codec is an autoencoder: an encoder squeezes audio into a short sequence of vectors, a quantizer turns each into integers, and a decoder rebuilds the waveform. **Residual vector quantization** does the quantizing: the first codebook picks the nearest code, the second encodes what it missed, and so on, so early codebooks carry coarse content and later ones detail. Bitrate is set by how many codebooks you keep.",
            "Once audio is tokens, speech generation becomes next-token prediction, which is why TTS and speech-to-speech models now look like LLMs."
          ],
          uses: [
            "**Meta's EnCodec**: an open codec for 24 kHz audio at 1.5 to 24 kbit/s, and the tokenizer under VALL-E and MusicGen.",
            "**Google's SoundStream**: the early residual-quantized codec behind AudioLM and the Lyra voice codec.",
            "**Kyutai's Mimi**: the codec inside Moshi, at 12.5 frames a second so a transformer can model speech live."
          ],
          example: "EnCodec at 24 kHz produces 75 frames a second, and each codebook has 1,024 entries, 10 bits. Keep 8 codebooks: 75 x 8 x 10 = 6,000 bits, 6 kbit/s. Keep 2: 1.5 kbit/s, still intelligible but rougher. A TTS model generating 8 codebooks must predict 600 tokens for every second of speech.",
          nuance: "Lower frame rates make sequences short enough for a transformer but lose fine timing. Codec choice quietly sets the ceiling on the quality of everything generated through it.",
          read: [{ label: "Défossez et al., High fidelity neural audio compression (EnCodec): sections 1 to 3", url: "https://arxiv.org/abs/2210.13438", m: 25 }],
          tags: ["codec", "rvq", "encodec", "soundstream", "mimi", "audio tokens"] },
        { id: "voice-cloning", name: "Voice cloning",
          line: "Speaking in a new voice from a few seconds of reference audio.",
          body: [
            "Zero-shot cloning conditions a TTS model on a short sample of the target speaker. Older systems pass a speaker embedding from a verification model; codec language models such as VALL-E put the reference audio's tokens in the prompt and continue in that voice, from as little as 3 seconds. Fine-tuned cloning trains on minutes or hours of one speaker for closer similarity.",
            "Quality is judged on two axes at once: **speaker similarity** (cosine similarity between embeddings of real and cloned speech) and naturalness."
          ],
          uses: [
            "**ElevenLabs and Resemble AI**: sell instant cloning from a short sample and professional cloning from longer recordings.",
            "**Dubbing and audiobooks**: keep an actor's or narrator's voice across languages and across a long book.",
            "**Voice banking**: lets people losing speech to illnesses such as ALS keep a synthetic version of their own voice."
          ],
          example: "A 6-second reference clip recorded in a moving car goes in with the text 'Thanks for calling.' The output matches the speaker's pitch and accent, and also the road hum, because the model continues the prompt's acoustics. Re-record the reference in a quiet room and the clone comes out cleaner with no change to the model.",
          nuance: "Cloning is also the engine of voice fraud. Responsible products require consent checks, watermark generated audio, and refuse public figures. It is also why a voice alone is now a weak way to prove identity.",
          read: [{ label: "Wang et al., Neural codec language models are zero-shot TTS synthesizers (VALL-E): abstract and section 1", url: "https://arxiv.org/abs/2301.02111", m: 15 }],
          tags: ["voice cloning", "zero-shot", "speaker embedding", "vall-e", "watermark"] },
        { id: "speech-to-speech", name: "Speech-to-speech and full-duplex models",
          line: "One model that listens and speaks directly, without a text step in between.",
          body: [
            "A cascade turns speech into text, text into a reply and the reply into speech, losing tone and adding delay at each hand-off. A **speech-to-speech** model takes audio tokens in and produces audio tokens out, so it can hear hesitation and answer with emotion. **Full-duplex** models treat the user's and the assistant's audio as two parallel streams, so they can listen while talking, backchannel ('mm-hm') and be interrupted naturally.",
            "Kyutai's Moshi is the open reference: it predicts aligned text tokens before audio tokens (an 'inner monologue') and reports about 200 ms practical latency."
          ],
          uses: [
            "**OpenAI's Realtime API**: streams audio in and out of one model over WebRTC or WebSocket, with tool calling.",
            "**ChatGPT voice and Gemini Live**: the consumer voice modes, interruptible mid-sentence.",
            "**Kyutai's Moshi**: open weights, so teams can run and study a full-duplex model themselves."
          ],
          example: "A user says 'yeah... I guess that works' slowly and flatly. A cascade passes the text 'yeah I guess that works' to the LLM, which reads agreement and moves on. A speech-to-speech model hears the hesitation in the audio and can ask 'You sound unsure. Want another time?'. The cost: there is no transcript to check before it speaks.",
          nuance: "You give up control: no transcript to inspect before speaking, weaker tool calling and instruction following, harder evaluation, and usually higher cost per minute. That is why regulated domains still prefer cascades.",
          read: [{ label: "Défossez et al., Moshi: a speech-text foundation model for real-time dialogue (abstract and section 1)", url: "https://arxiv.org/abs/2410.00037", m: 20 }],
          tags: ["speech-to-speech", "full duplex", "moshi", "realtime api", "gemini live"] }
      ] },
    { name: "Voice agents in production", line: "Running the whole loop live, on a call, under a latency budget.",
      topics: [
        { id: "voice-agent-pipeline", name: "The voice agent pipeline",
          line: "VAD, streaming ASR, an LLM and streaming TTS, wired so every stage overlaps.",
          body: [
            "A cascaded voice agent is a pipeline of frames: VAD marks speech, streaming ASR produces text, a turn detector decides the user has finished, an LLM writes a reply (and may call tools), and TTS speaks it. Each stage **streams**: the LLM's first sentence goes to TTS before the second is written, and audio reaches the caller before synthesis is finished.",
            "Frameworks provide the frame bus, interruption handling and provider plugins, so the work moves to policy: what to say while a slow tool runs, when to hand off to a human, and how to keep a long call's context small."
          ],
          uses: [
            "**Vapi, Retell and Bland**: host the whole cascade, so a team configures prompts, voices and phone numbers instead of media servers.",
            "**Pipecat and LiveKit Agents**: open frameworks where each stage is a swappable provider plugin.",
            "**Clinics, contact centres and restaurants**: the early buyers, for booking, reminders and first-line support calls."
          ],
          example: "A caller asks 'Do you have anything Friday?'. Their speech ends at 0 ms; the turn is confirmed at 300 ms and the final transcript lands at 350. The LLM starts streaming 'Let me check that' at 700 and calls the calendar tool; TTS sends first audio at 800, so the caller hears a reply in under a second while the tool runs.",
          nuance: "The cascade wins on control and debuggability: every turn leaves a transcript and an LLM call you can replay. Teams that need it to feel instant often run a small fast model to talk and a larger one to think in parallel.",
          read: [{ label: "Voice AI and Voice Agents primer: section 4, the basic conversational loop", url: "https://voiceaiandvoiceagents.com/", m: 20 }],
          see: [{ label: "System design guide: voice agent for patient calls", href: "SYSTEM%20DESIGN.html#/designs/voice-agent" }],
          tags: ["voice agent", "pipecat", "livekit", "cascade", "vapi"] },
        { id: "telephony-webrtc", name: "Telephony and WebRTC",
          line: "The two ways audio reaches an agent: the phone network, or a browser or app.",
          body: [
            "**Telephony** means the public phone network. A call reaches a provider (Twilio, Telnyx, Vonage) over a SIP trunk, and the provider hands audio to your server, often as 8 kHz mu-law over a WebSocket, or as RTP if you speak SIP yourself. Expect narrowband audio, extra delay and DTMF keypresses.",
            "**WebRTC** is the browser and app standard: Opus at 48 kHz over UDP, so a lost packet is skipped rather than resent. ICE, STUN and TURN find a path through NATs, a **jitter buffer** smooths packet timing, and the browser runs echo cancellation and noise suppression for you."
          ],
          uses: [
            "**Twilio Media Streams**: forward a live call's audio to your WebSocket as base64 mu-law, and accept audio back the same way.",
            "**LiveKit and Daily**: run the WebRTC media servers most voice agents connect to.",
            "**ChatGPT's voice mode**: carries its audio over WebRTC on LiveKit's infrastructure."
          ],
          example: "One 20 ms packet is lost on a mobile network. Over WebRTC, the Opus decoder conceals the gap and playback continues; the caller hears a tiny glitch. Over a TCP WebSocket, every packet behind it waits for the retransmission, perhaps a few hundred milliseconds, and the agent hears a stall followed by a burst of late audio.",
          nuance: "Running audio over a TCP WebSocket works on a good network and degrades badly on a bad one: one lost packet stalls everything behind it. WebRTC exists to avoid exactly that.",
          read: [{ label: "WebRTC for the Curious: ch. 6, media communication (RTP, RTCP, congestion control)", url: "https://webrtcforthecurious.com/docs/06-media-communication/", m: 25 }],
          tags: ["sip", "pstn", "twilio", "webrtc", "rtp", "jitter buffer", "dtmf"] },
        { id: "turn-taking", name: "Turn-taking and barge-in",
          line: "Deciding when the caller has finished, and stopping cleanly when they interrupt.",
          body: [
            "**Endpointing** decides the user's turn is over. The simple rule is a fixed silence after VAD; 300 to 800 ms is common, trading cut-offs against slowness. **Semantic turn detection** adds a small model that reads the transcript (and sometimes the audio) to judge whether the sentence sounds complete.",
            "**Barge-in** is the reverse: the user talks while the agent speaks. The agent must stop audio within a couple of hundred milliseconds, cancel the LLM and TTS in flight, and record what was actually heard, not what was generated, in its history. **Backchannels** ('yeah', 'right') should not count as interruptions."
          ],
          uses: [
            "**LiveKit's turn detector**: a small language model that reads the transcript and extends the silence wait when a sentence sounds unfinished.",
            "**Pipecat's smart-turn**: an open model that judges the end of a turn from the audio itself.",
            "**Deepgram and AssemblyAI**: expose endpointing settings and end-of-turn events in their streaming APIs."
          ],
          example: "The caller says 'my number is 4 1 5' and pauses to read the rest. A 500 ms silence rule ends the turn, and the agent replies to half a phone number. A semantic detector sees an unfinished number and keeps waiting. A caller who says 'yes' and stops still gets an answer at once, because 'yes' is complete.",
          nuance: "An agent that remembers saying a sentence the caller cut off halfway will refer back to something they never heard. Truncating the history at the barge-in point is the fix and is often missed.",
          read: [{ label: "LiveKit docs: turn detection and interruptions", url: "https://docs.livekit.io/agents/logic/turns", m: 15 }],
          tags: ["endpointing", "turn detection", "barge-in", "interruption", "backchannel"] },
        { id: "latency-budget", name: "The latency budget",
          line: "Where the milliseconds go between the caller stopping and the agent's first sound.",
          body: [
            "The number that matters is **voice-to-voice latency**: from the end of the user's speech to the first audio they hear back. Every stage spends some: network in, the endpointing wait, ASR finalization, the LLM's time to first token, TTS time to first byte, network out, and buffers in between. The voice agents primer puts a typical cascade at about 1.3 seconds and treats 1.5 seconds as the target to stay under.",
            "Budget it per stage from the first design, measured at p95. The levers: shorter endpointing with a semantic turn model, streaming everything, a fast first-token LLM, services in one region, and filler speech while a slow tool runs."
          ],
          uses: [
            "**Voice agent vendors**: publish latency claims; the honest ones measure from recorded calls at the caller's side, not from server logs.",
            "**Pipecat and LiveKit Agents**: emit per-service timing metrics such as time to first byte, so each hop can be budgeted."
          ],
          example: "An illustrative p95 budget: network in 40 ms, endpointing wait 400, ASR final 100, LLM first token 350, TTS first byte 150, network out 40, buffers 60. Total 1,140 ms. The endpointing wait is the largest item, so a semantic turn model that safely cuts it to 200 ms saves more than any model upgrade.",
          nuance: "The endpointing wait is usually the largest single item and it is a setting, not a model. Cutting it is cheap until the agent starts interrupting people mid-sentence.",
          read: [{ label: "Voice AI and Voice Agents primer: the latency section and its table", url: "https://voiceaiandvoiceagents.com/", m: 15 }],
          see: [{ label: "System design guide: voice agent for patient calls", href: "SYSTEM%20DESIGN.html#/designs/voice-agent" }],
          tags: ["latency", "ttfb", "ttft", "voice-to-voice", "p95"] },
        { id: "evaluation", name: "Evaluation: WER, MOS and beyond",
          line: "How speech systems are scored, and why the headline numbers mislead.",
          body: [
            "**Word error rate** aligns the hypothesis to the reference and counts substitutions, deletions and insertions over the number of reference words; it can exceed 100%. Text normalization (case, punctuation, 'ten' against '10') moves it by points, so compare only under one normalizer. Languages without spaces use character error rate; speed is reported as real-time factor.",
            "TTS is judged by listeners: **MOS**, a 1 to 5 naturalness rating averaged over many raters, and preference tests. Learned predictors such as UTMOS estimate MOS cheaply. Agents add task success, p95 latency and interruption rate on real calls."
          ],
          uses: [
            "**Hugging Face's Open ASR Leaderboard**: ranks open and commercial models by WER across datasets and by speed (RTFx).",
            "**TTS papers and model cards**: report MOS from listener panels, often with UTMOS beside it.",
            "**Voice agent teams**: replay recorded calls through each new version and compare task success before shipping."
          ],
          example: "Reference: 'call me at five fifteen'. Hypothesis: 'call me at 515 please'. Scored raw, the best alignment is two substitutions over five reference words: 40% WER. Normalize numbers in both first, so the reference reads 'call me at 515', and only the inserted 'please' remains: 1 of 4, 25%. Same audio, same model, different number.",
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
