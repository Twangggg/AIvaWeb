"use client";

/**
 * Web Audio API Sound Engine for AIva 3D Experience Garden
 * Zero external audio files required — 100% procedurally synthesized,
 * ultra-lightweight, 0 latency, responsive to environment and actions.
 */

class GardenSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmTimer: number | null = null;
  private footstepTimer: number = 0;
  private isInitialized: boolean = false;

  private initContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmTimer) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    } else if (!muted && !this.bgmTimer) {
      this.startAmbientMusic();
    }
  }

  public enableOnUserInteraction() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    const ctx = this.initContext();
    if (ctx && !this.isMuted) {
      this.startAmbientMusic();
    }
  }

  /**
   * Procedural peaceful Kalimba BGM
   * Pentatonic scale (C major pentatonic / Ghibli feel)
   */
  public startAmbientMusic() {
    if (typeof window === "undefined" || this.isMuted) return;
    if (this.bgmTimer) return;

    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C4, D4, E4, G4, A4, C5, D5, E5
    let step = 0;

    this.bgmTimer = window.setInterval(() => {
      if (this.isMuted) return;
      const ctx = this.initContext();
      if (!ctx || ctx.state !== "running") return;

      // 60% chance to play a note per tick to create a gentle, sparse acoustic rhythm
      if (Math.random() > 0.4) {
        const noteIndex = Math.floor(Math.random() * scale.length);
        const freq = scale[noteIndex];
        this.playKalimbaNote(freq, 0.045);
      }

      step++;
      // Every 8 ticks, play a gentle bass root note
      if (step % 8 === 0) {
        this.playSoftBass(130.81, 0.06); // C3
      }
    }, 1400);
  }

  private playKalimbaNote(freq: number, volume = 0.05) {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch {}
  }

  private playSoftBass(freq: number, volume = 0.06) {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch {}
  }

  /**
   * Footstep sound on grass/stone
   */
  public playFootstep() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.footstepTimer < 280) return; // Debounce cadence
    this.footstepTimer = now;

    const ctx = this.initContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Subtle pitch variation for organic footstep
      const pitch = 90 + Math.random() * 30;
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  /**
   * Frog Jump SFX
   */
  public playJump() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  /**
   * Bouncy Mushroom High Trampoline Jump
   */
  public playMushroomBounce() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(720, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch {}
  }

  /**
   * Energy Shard Collected (Sparkling chime)
   */
  public playCollectShard() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || ctx.state !== "running") return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      } catch {}
    });
  }

  /**
   * Station Fanfare (Approaching or opening pavilion)
   */
  public playStationArrival() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || ctx.state !== "running") return;

    const notes = [440.0, 554.37, 659.25]; // A4, C#5, E5
    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        const startTime = ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.07, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      } catch {}
    });
  }

  public cleanup() {
    if (this.bgmTimer) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const gardenSound = new GardenSoundEngine();
