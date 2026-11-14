import { ActPhase, LaunchPhase } from '../store/useAppStore';

export interface EchoAudioMetrics {
  amplitude: number; // 0..1
  bass: number; // 0..1
  mid: number; // 0..1
  high: number; // 0..1
  bands: number[]; // 16 normalized bands 0..1
  isMp3Active: boolean;
}

class AudioEngineImpl {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private rumbleGain: GainNode | null = null;
  private spaceGain: GainNode | null = null;
  private echoGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private windFilter: BiquadFilterNode | null = null;
  private rumbleFilter: BiquadFilterNode | null = null;
  private spaceOsc1: OscillatorNode | null = null;
  private spaceOsc2: OscillatorNode | null = null;

  private freqData: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(32));
  private isEnabled = true;
  private unlocked = false;
  private currentAct: ActPhase = 'launchpad';
  private currentLaunchPhase: LaunchPhase = 'idle';

  // Team MP3 voiceover sync
  private manifestLoaded = false;
  private manifestTracks: Record<string, string> = {};
  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private activeMp3MissionId: string | null = null;
  private mp3Playing = false;

  // Procedural vocal formant synth (fallback when team MP3 is not yet supplied)
  private synthFormantOsc: OscillatorNode | null = null;
  private synthSubOsc: OscillatorNode | null = null;
  private synthFilter: BiquadFilterNode | null = null;
  private synthGain: GainNode | null = null;
  private synthActive = false;
  private synthSeedTime = 0;

  // SpeechSynthesis tracking (optional spoken readout synced with stage)
  private lastSpokenKey: string | null = null;

  private createNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
    const length = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public async unlock(): Promise<boolean> {
    if (this.unlocked && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume().catch(() => {});
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      this.ctx = ctx;

      // Master bus
      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = this.isEnabled ? 0.85 : 0;
      this.masterGain.connect(ctx.destination);

      // Noise source for pad wind & rocket rumble
      const noiseBuffer = this.createNoiseBuffer(ctx, 4);

      // 1. Launchpad Wind
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.value = this.currentAct === 'launchpad' ? 0.18 : 0.0;
      const windSource = ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;
      this.windFilter = ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.value = 260;
      this.windFilter.Q.value = 0.9;
      windSource.connect(this.windFilter);
      this.windFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);
      windSource.start();

      // 2. Rocket Engine Rumble
      this.rumbleGain = ctx.createGain();
      this.rumbleGain.gain.value = 0;
      const rumbleSource = ctx.createBufferSource();
      rumbleSource.buffer = noiseBuffer;
      rumbleSource.loop = true;
      this.rumbleFilter = ctx.createBiquadFilter();
      this.rumbleFilter.type = 'lowpass';
      this.rumbleFilter.frequency.value = 140;
      rumbleSource.connect(this.rumbleFilter);
      this.rumbleFilter.connect(this.rumbleGain);
      this.rumbleGain.connect(this.masterGain);
      rumbleSource.start();

      // 3. Deep Space Ambient Harmonic Pad
      this.spaceGain = ctx.createGain();
      this.spaceGain.gain.value = this.currentAct !== 'launchpad' ? 0.08 : 0;
      const spaceFilter = ctx.createBiquadFilter();
      spaceFilter.type = 'lowpass';
      spaceFilter.frequency.value = 220;

      this.spaceOsc1 = ctx.createOscillator();
      this.spaceOsc1.type = 'sine';
      this.spaceOsc1.frequency.value = 55; // A1

      this.spaceOsc2 = ctx.createOscillator();
      this.spaceOsc2.type = 'triangle';
      this.spaceOsc2.frequency.value = 82.41; // E2

      this.spaceOsc1.connect(spaceFilter);
      this.spaceOsc2.connect(spaceFilter);
      spaceFilter.connect(this.spaceGain);
      this.spaceGain.connect(this.masterGain);
      this.spaceOsc1.start();
      this.spaceOsc2.start();

      // 4. Echo Voiceover Bus + AnalyserNode
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.78;
      this.freqData = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));

      this.echoGain = ctx.createGain();
      this.echoGain.gain.value = 1.0;
      this.echoGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);

      // 5. Procedural Vocal-Cadence Formant Synth (routed into AnalyserNode)
      this.synthGain = ctx.createGain();
      this.synthGain.gain.value = 0;
      this.synthFilter = ctx.createBiquadFilter();
      this.synthFilter.type = 'bandpass';
      this.synthFilter.frequency.value = 950;
      this.synthFilter.Q.value = 2.4;

      this.synthFormantOsc = ctx.createOscillator();
      this.synthFormantOsc.type = 'sawtooth';
      this.synthFormantOsc.frequency.value = 215;

      this.synthSubOsc = ctx.createOscillator();
      this.synthSubOsc.type = 'sine';
      this.synthSubOsc.frequency.value = 430;

      this.synthFormantOsc.connect(this.synthFilter);
      this.synthSubOsc.connect(this.synthFilter);
      this.synthFilter.connect(this.synthGain);
      this.synthGain.connect(this.analyser);

      this.synthFormantOsc.start();
      this.synthSubOsc.start();

      this.unlocked = true;
      this.loadManifest();
      this.syncMix();
      return true;
    } catch {
      return false;
    }
  }

  private async loadManifest() {
    if (this.manifestLoaded) return;
    this.manifestLoaded = true;
    try {
      const res = await fetch('/audio/echo/manifest.json');
      if (res.ok) {
        const json = (await res.json()) as { tracks?: Record<string, string> };
        if (json?.tracks) {
          this.manifestTracks = json.tracks;
        }
      }
    } catch {
      // Manifest unavailable; fall back to procedural cadence
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(enabled ? 0.85 : 0, this.ctx.currentTime, 0.08);
    }
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setState(act: ActPhase, launchPhase: LaunchPhase) {
    this.currentAct = act;
    this.currentLaunchPhase = launchPhase;
    this.syncMix();
  }

  private syncMix() {
    if (!this.ctx || !this.ambientGain || !this.rumbleGain || !this.spaceGain) return;
    const now = this.ctx.currentTime;

    if (this.currentAct === 'launchpad') {
      if (this.currentLaunchPhase === 'idle') {
        this.ambientGain.gain.setTargetAtTime(0.18, now, 0.3);
        this.rumbleGain.gain.setTargetAtTime(0, now, 0.2);
        this.spaceGain.gain.setTargetAtTime(0, now, 0.3);
      } else if (this.currentLaunchPhase === 'igniting') {
        this.ambientGain.gain.setTargetAtTime(0.05, now, 0.2);
        this.rumbleGain.gain.setTargetAtTime(0.55, now, 0.35);
        if (this.rumbleFilter) this.rumbleFilter.frequency.setTargetAtTime(220, now, 0.4);
        this.spaceGain.gain.setTargetAtTime(0, now, 0.2);
      } else if (this.currentLaunchPhase === 'ascending') {
        this.ambientGain.gain.setTargetAtTime(0.0, now, 0.4);
        this.rumbleGain.gain.setTargetAtTime(0.66, now, 0.4);
        if (this.rumbleFilter) this.rumbleFilter.frequency.setTargetAtTime(340, now, 0.8);
        this.spaceGain.gain.setTargetAtTime(0.04, now, 1.0);
      } else if (this.currentLaunchPhase === 'meco') {
        this.ambientGain.gain.setTargetAtTime(0, now, 0.3);
        this.rumbleGain.gain.setTargetAtTime(0.06, now, 0.25);
        this.spaceGain.gain.setTargetAtTime(0.08, now, 0.6);
      } else {
        // pullback into Solar System
        this.ambientGain.gain.setTargetAtTime(0, now, 0.3);
        this.rumbleGain.gain.setTargetAtTime(0, now, 0.4);
        this.spaceGain.gain.setTargetAtTime(0.09, now, 0.6);
      }
    } else {
      this.ambientGain.gain.setTargetAtTime(0, now, 0.4);
      this.rumbleGain.gain.setTargetAtTime(0, now, 0.4);
      this.spaceGain.gain.setTargetAtTime(0.08, now, 0.6);
    }
  }

  public startEchoNarration(
    missionId: string,
    stageKey: string,
    narrationText: string,
    customUrl?: string,
    seekTimeSec?: number
  ) {
    const trackUrl = customUrl || this.manifestTracks[missionId] || null;

    if (trackUrl && this.ctx && this.echoGain) {
      this.stopSynth();
      this.playMp3Track(missionId, trackUrl, seekTimeSec);
      return;
    }

    // No MP3 supplied yet: use procedural vocal-cadence synth into AnalyserNode + optional Web Speech
    this.stopMp3();
    this.startSynth();

    if (
      this.isEnabled &&
      this.lastSpokenKey !== stageKey &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      this.lastSpokenKey = stageKey;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(narrationText);
        utter.rate = 0.96;
        utter.pitch = 1.05;
        utter.volume = 0.68;
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            /female|samantha|victoria|karen|ava|allison|zira|google us english/i.test(v.name)
        );
        if (femaleVoice) utter.voice = femaleVoice;
        window.speechSynthesis.speak(utter);
      } catch {
        // Ignore speech synthesis errors on headless browsers
      }
    }
  }

  public pauseEchoNarration() {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
    this.mp3Playing = false;
    this.stopSynth();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopEchoNarration() {
    this.pauseEchoNarration();
    this.lastSpokenKey = null;
    if (this.audioEl) {
      this.audioEl.currentTime = 0;
    }
  }

  private playMp3Track(missionId: string, url: string, seekTimeSec?: number) {
    if (!this.ctx || !this.echoGain) return;

    if (!this.audioEl || this.activeMp3MissionId !== missionId || this.audioEl.src !== url) {
      this.stopMp3();
      const el = new Audio(url);
      el.crossOrigin = 'anonymous';
      el.preload = 'auto';
      this.mediaSource = this.ctx.createMediaElementSource(el);
      this.mediaSource.connect(this.echoGain);
      this.audioEl = el;
      this.activeMp3MissionId = missionId;
    }

    if (typeof seekTimeSec === 'number' && Number.isFinite(seekTimeSec)) {
      this.audioEl.currentTime = seekTimeSec;
    }

    this.audioEl
      .play()
      .then(() => {
        this.mp3Playing = true;
      })
      .catch(() => {
        this.mp3Playing = false;
        this.startSynth();
      });
  }

  private stopMp3() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
      this.audioEl = null;
    }
    if (this.mediaSource) {
      try {
        this.mediaSource.disconnect();
      } catch {
        // ignore
      }
      this.mediaSource = null;
    }
    this.activeMp3MissionId = null;
    this.mp3Playing = false;
  }

  private startSynth() {
    this.synthActive = true;
    this.synthSeedTime = performance.now() * 0.001;
  }

  private stopSynth() {
    this.synthActive = false;
    if (this.synthGain && this.ctx) {
      this.synthGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Called each animation frame by EchoHost to drive the visor waveform, head tilts, and gestures
   * using real Web Audio API AnalyserNode frequency & amplitude data.
   */
  public getEchoAudioMetrics(timeSec: number): EchoAudioMetrics {
    const bands = new Array(16).fill(0);

    // Modulate procedural cadence synth softly if active (keeps AnalyserNode alive with real speech-like syllables)
    if (this.synthActive && this.ctx && this.synthGain && this.synthFormantOsc && this.synthSubOsc && this.synthFilter) {
      const t = timeSec - this.synthSeedTime;
      // Natural syllable envelope (~3.6 syllables/sec with micro-pauses)
      const phraseGate = Math.sin(t * 1.1) > -0.65 ? 1 : 0.08;
      const syllable = Math.max(
        0,
        Math.sin(t * 11.4) * 0.55 + Math.sin(t * 18.7) * 0.35 + 0.35
      );
      const env = phraseGate * Math.min(1, syllable) * 0.018; // subtle audible formant presence if speechSynthesis isn't speaking, mostly driving analyser
      const now = this.ctx.currentTime;
      this.synthGain.gain.setTargetAtTime(env, now, 0.025);
      this.synthFormantOsc.frequency.setTargetAtTime(205 + Math.sin(t * 4.2) * 28, now, 0.04);
      this.synthSubOsc.frequency.setTargetAtTime(410 + Math.cos(t * 6.1) * 55, now, 0.04);
      this.synthFilter.frequency.setTargetAtTime(750 + Math.sin(t * 7.8) * 380, now, 0.03);
    }

    if (this.analyser && this.unlocked && (this.mp3Playing || this.synthActive)) {
      this.analyser.getByteFrequencyData(this.freqData);
      let sum = 0;
      let bassSum = 0;
      let midSum = 0;
      let highSum = 0;

      const binCount = this.freqData.length; // 32
      for (let i = 0; i < 16; i++) {
        const idx = Math.min(binCount - 1, Math.floor((i / 16) * binCount));
        const val = this.freqData[idx] / 255;
        // Boost slightly for visual clarity on soft tracks
        const norm = Math.min(1, val * 1.65);
        bands[i] = norm;
        sum += norm;
        if (i < 4) bassSum += norm;
        else if (i < 11) midSum += norm;
        else highSum += norm;
      }

      const amp = Math.min(1, sum / 16);
      if (amp > 0.01) {
        return {
          amplitude: amp,
          bass: bassSum / 4,
          mid: midSum / 7,
          high: highSum / 5,
          bands,
          isMp3Active: this.mp3Playing,
        };
      }
    }

    // Fallback when AudioContext is locked before first user gesture during active playback
    if (this.synthActive) {
      const t = timeSec;
      for (let i = 0; i < 16; i++) {
        const bell = Math.exp(-Math.pow((i - 6.5) / 5.2, 2));
        bands[i] =
          bell *
          (0.25 + 0.55 * Math.abs(Math.sin(t * (4.5 + i * 0.4) + i * 0.6)));
      }
      const amp = bands.reduce((a, b) => a + b, 0) / 16;
      return {
        amplitude: amp,
        bass: (bands[1] + bands[2]) * 0.5,
        mid: (bands[5] + bands[6] + bands[7]) / 3,
        high: (bands[11] + bands[12]) * 0.5,
        bands,
        isMp3Active: false,
      };
    }

    return {
      amplitude: 0,
      bass: 0,
      mid: 0,
      high: 0,
      bands,
      isMp3Active: false,
    };
  }
}

export const AudioEngine = new AudioEngineImpl();
