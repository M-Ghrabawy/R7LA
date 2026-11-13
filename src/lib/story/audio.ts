import type { AudioTheme } from "./schema";

type SoundName =
  | "click"
  | "advance"
  | "success"
  | "error"
  | "reveal"
  | "boot"
  | "transmit"
  | "complete"
  | "brush";

const themes: Record<
  AudioTheme,
  { root: number; fifth: number; cutoff: number; noise: number }
> = {
  observatory: { root: 110, fifth: 164.81, cutoff: 420, noise: 0.018 },
  lunar: { root: 82.41, fifth: 123.47, cutoff: 330, noise: 0.026 },
  martian: { root: 98, fifth: 146.83, cutoff: 300, noise: 0.032 },
  archive: { root: 130.81, fifth: 196, cutoff: 520, noise: 0.014 },
  tension: { root: 73.42, fifth: 110, cutoff: 240, noise: 0.038 },
  triumph: { root: 146.83, fifth: 220, cutoff: 760, noise: 0.012 },
};

export class RexAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private theme: AudioTheme = "observatory";
  private enabled = false;
  private started = false;

  get isEnabled() {
    return this.enabled;
  }

  get isStarted() {
    return this.started;
  }

  async unlock() {
    if (typeof window === "undefined") return false;
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return false;
    if (!this.context) {
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.context.destination);
      this.ambientGain = this.context.createGain();
      this.ambientGain.gain.value = 0;
      this.ambientGain.connect(this.master);
    }
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
    this.started = true;
    this.enabled = true;
    this.setTheme(this.theme);
    this.sfx("boot");
    return true;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(enabled ? 0.22 : 0, now, 0.12);
    if (enabled && this.context.state === "suspended") {
      void this.context.resume();
    }
  }

  setTheme(theme: AudioTheme) {
    this.theme = theme;
    if (!this.context || !this.ambientGain || !this.enabled) return;
    this.stopAmbient();
    const config = themes[theme];
    const now = this.context.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setTargetAtTime(1, now, 0.8);

    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = config.cutoff;
    filter.Q.value = 0.7;
    filter.connect(this.ambientGain);

    const root = this.context.createOscillator();
    root.type = "sine";
    root.frequency.value = config.root;
    const rootGain = this.context.createGain();
    rootGain.gain.value = 0.045;
    root.connect(rootGain);
    rootGain.connect(filter);

    const fifth = this.context.createOscillator();
    fifth.type = "triangle";
    fifth.frequency.value = config.fifth;
    fifth.detune.value = theme === "tension" ? -8 : 4;
    const fifthGain = this.context.createGain();
    fifthGain.gain.value = 0.018;
    fifth.connect(fifthGain);
    fifthGain.connect(filter);

    const shimmer = this.context.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = config.root * 4.01;
    const shimmerGain = this.context.createGain();
    shimmerGain.gain.value = 0.006;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(filter);

    const lfo = this.context.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    lfoGain.connect(rootGain.gain);

    const noiseBuffer = this.context.createBuffer(
      1,
      this.context.sampleRate * 2,
      this.context.sampleRate,
    );
    const data = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[index] = last * 3.5;
    }
    const noise = this.context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseGain = this.context.createGain();
    noiseGain.gain.value = config.noise;
    noise.connect(noiseGain);
    noiseGain.connect(filter);

    root.start();
    fifth.start();
    shimmer.start();
    lfo.start();
    noise.start();
    this.ambientNodes = [
      root,
      rootGain,
      fifth,
      fifthGain,
      shimmer,
      shimmerGain,
      lfo,
      lfoGain,
      noise,
      noiseGain,
      filter,
    ];
  }

  private stopAmbient() {
    for (const node of this.ambientNodes) {
      try {
        if ("stop" in node && typeof node.stop === "function") node.stop();
        node.disconnect();
      } catch {
        // Already stopped.
      }
    }
    this.ambientNodes = [];
  }

  sfx(name: SoundName) {
    if (!this.context || !this.master || !this.enabled) return;
    const context = this.context;
    const now = context.currentTime;
    const config: Record<
      SoundName,
      { frequency: number; end: number; duration: number; gain: number; type: OscillatorType }
    > = {
      click: { frequency: 540, end: 620, duration: 0.06, gain: 0.035, type: "sine" },
      advance: { frequency: 320, end: 480, duration: 0.18, gain: 0.045, type: "triangle" },
      success: { frequency: 440, end: 880, duration: 0.42, gain: 0.05, type: "sine" },
      error: { frequency: 180, end: 120, duration: 0.22, gain: 0.04, type: "sawtooth" },
      reveal: { frequency: 720, end: 980, duration: 0.3, gain: 0.025, type: "sine" },
      boot: { frequency: 110, end: 660, duration: 0.9, gain: 0.045, type: "sine" },
      transmit: { frequency: 660, end: 1320, duration: 0.6, gain: 0.035, type: "sine" },
      complete: { frequency: 330, end: 990, duration: 1.2, gain: 0.045, type: "triangle" },
      brush: { frequency: 130, end: 90, duration: 0.08, gain: 0.012, type: "sawtooth" },
    };
    const preset = config[name];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = preset.type;
    oscillator.frequency.setValueAtTime(preset.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(40, preset.end),
      now + preset.duration,
    );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(preset.gain, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + preset.duration + 0.05);

    if (name === "complete" || name === "success") {
      const second = context.createOscillator();
      const secondGain = context.createGain();
      second.type = "sine";
      second.frequency.setValueAtTime(preset.frequency * 1.5, now + 0.08);
      second.frequency.exponentialRampToValueAtTime(
        preset.end * 1.4,
        now + preset.duration,
      );
      secondGain.gain.setValueAtTime(0.0001, now + 0.05);
      secondGain.gain.exponentialRampToValueAtTime(0.018, now + 0.1);
      secondGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + preset.duration + 0.25,
      );
      second.connect(secondGain);
      secondGain.connect(this.master);
      second.start(now + 0.05);
      second.stop(now + preset.duration + 0.3);
    }
  }
}

let engine: RexAudioEngine | null = null;

export function getRexAudio() {
  if (!engine) engine = new RexAudioEngine();
  return engine;
}
