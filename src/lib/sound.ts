/** Synthesised ambience + UI blips with the Web Audio API (no audio files). Off until the user enables it. */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private drone: { stop: () => void } | null = null;
  enabled = false;

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  async enable() {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") await ctx.resume();
    this.enabled = true;
    if (!this.drone) this.drone = this.startDrone(ctx, this.master);
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.8);
  }

  disable() {
    this.enabled = false;
    if (!this.ctx || !this.master) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
  }

  private startDrone(ctx: AudioContext, out: GainNode) {
    const bus = ctx.createGain();
    bus.gain.value = 0.11;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 6;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(filter.frequency);
    filter.connect(bus).connect(out);
    // A minor-ish pad: A1, E2, A2, C3 with slight detune
    const freqs = [55, 82.41, 110, 130.81];
    const oscs = freqs.flatMap((f, i) =>
      [-6, 6].map((det) => {
        const o = ctx.createOscillator();
        o.type = i === 0 ? "sine" : "sawtooth";
        o.frequency.value = f;
        o.detune.value = det;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.6 : 0.12;
        o.connect(g).connect(filter);
        o.start();
        return o;
      }),
    );
    lfo.start();
    return { stop: () => { oscs.forEach((o) => o.stop()); lfo.stop(); } };
  }

  /** Short UI blip; `pitch` in Hz. */
  blip(pitch = 880, dur = 0.09, vol = 0.07) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(pitch, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + dur);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  /** Rising whoosh for camera zooms. */
  whoosh() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const len = 0.6;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 2;
    f.frequency.setValueAtTime(300, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + len);
    const g = ctx.createGain();
    g.gain.value = 0.12;
    src.connect(f).connect(g).connect(this.master);
    src.start();
  }
}

export const sound = new SoundEngine();
