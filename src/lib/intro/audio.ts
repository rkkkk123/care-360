/**
 * CARE360 Procedural Audio Engine
 *
 * Generates cinematic sound design using raw Web Audio API.
 * No external audio files — fully synthesised in real time.
 * Timeline-synced via method calls from GSAP.
 */

export class IntroAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private started = false;
  private muted = false;

  /** Must be called from a user gesture (click / keydown) */
  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
    this.started = true;
  }

  get isReady() {
    return this.started && !!this.ctx;
  }

  mute() {
    this.muted = true;
    if (this.master) this.master.gain.value = 0;
  }

  unmute() {
    this.muted = false;
    if (this.master) this.master.gain.value = 0.35;
  }

  /** 0–2 s: ultra-low frequency drone */
  playDrone() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = 55;

    filter.type = "lowpass";
    filter.frequency.value = 200;
    filter.Q.value = 1;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    gain.gain.linearRampToValueAtTime(0.06, now + 1.6);
    gain.gain.linearRampToValueAtTime(0, now + 2.2);

    osc.connect(filter).connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 2.3);
    this.nodes.push(osc, gain, filter);
  }

  /** ~0.2-1.2 s: subtle heartbeat pulse during DNA spin */
  playHeartbeat() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    const thumps = [now + 0.2, now + 0.9];
    thumps.forEach((t, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08 - i * 0.015, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain).connect(this.master!);
      osc.start(t);
      osc.stop(t + 0.32);
      this.nodes.push(osc, gain);
    });
  }

  /** 2.0–3.6 s: digital texture (filtered noise sweep) */
  playDigitalTexture() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * 1.8);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(3200, now + 1.0);
    filter.frequency.linearRampToValueAtTime(1400, now + 1.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.028, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.015, now + 1.1);
    gain.gain.linearRampToValueAtTime(0, now + 1.6);

    noise.connect(filter).connect(gain).connect(this.master);
    noise.start(now);
    noise.stop(now + 1.65);
    this.nodes.push(noise, filter, gain);
  }

  /** 4.8–6.6 s: rising intelligent network soundscape */
  playRiser() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    const freqs = [110, 165, 220, 330];
    for (const freq of freqs) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.setValueAtTime(-5 + Math.random() * 10, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(2200, now + 1.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.0);
      gain.gain.linearRampToValueAtTime(0.055, now + 1.5);
      gain.gain.linearRampToValueAtTime(0, now + 1.8);

      osc.connect(filter).connect(gain).connect(this.master);
      osc.start(now);
      osc.stop(now + 1.85);
      this.nodes.push(osc, gain, filter);
    }
  }

  /** 6.6–7.6 s: tension riser towards singularity */
  playTension() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.95);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(3200, now + 0.95);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.075, now + 0.7);
    gain.gain.linearRampToValueAtTime(0, now + 0.98);

    osc.connect(filter).connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 1.0);
    this.nodes.push(osc, gain, filter);
  }

  /** ~7.6 s: deep cinematic impact for CARE360 logo snap */
  playImpact() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    // Sub impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.7);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 1.3);

    // Noise transient
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const nGain = this.ctx.createGain();
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = "lowpass";
    nFilter.frequency.value = 300;
    nGain.gain.setValueAtTime(0.06, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    noise.connect(nFilter).connect(nGain).connect(this.master);
    noise.start(now);
    noise.stop(now + 0.4);

    this.nodes.push(osc, gain, noise, nGain, nFilter);
  }

  /** 8.8–10 s: tonal resolution (gentle major chord) */
  playResolution() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    // C major tones: C3, E3, G3, C4
    const freqs = [130.81, 164.81, 196.0, 261.63];
    for (const freq of freqs) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.8);
      gain.gain.linearRampToValueAtTime(0, now + 1.4);
      osc.connect(gain).connect(this.master);
      osc.start(now);
      osc.stop(now + 1.5);
      this.nodes.push(osc, gain);
    }
  }

  /** Hard stop all audio */
  silence() {
    if (!this.ctx || !this.master) return;
    this.master.gain.setValueAtTime(0, this.ctx.currentTime);
  }

  /** Clean up */
  destroy() {
    this.silence();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.nodes = [];
    this.started = false;
  }
}
