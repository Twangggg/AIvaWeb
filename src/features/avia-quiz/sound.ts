// Web Audio API Sound Synthesizer for Avia Quiz Game
// Hoạt động độc lập không cần file mp3, hỗ trợ chime, ting ting cao độ, buzzer nhẹ, và fanfare vỗ tay.

class QuizSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Âm Chime trong trẻo khi trả lời đúng
  playCorrect(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });
  }

  // Âm "Ting Ting" nâng cao cao độ theo các mốc Combo (x3, x5, x10)
  playCombo(combo: number): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Hợp âm arpeggio thăng hoa theo cấp độ combo
    const notes =
      combo >= 10
        ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Chiến thắng vang dội!)
        : combo >= 5
        ? [587.33, 739.99, 880.0] // D5, F#5, A5 (Sôi nổi)
        : combo >= 3
        ? [523.25, 659.25, 783.99] // C5, E5, G5 (Hào hứng)
        : [587.33, 880.0]; // D5, A5 (Combo x2)

    notes.forEach((freq, idx) => {
      const delay = idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = combo >= 5 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.25, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.4);
    });
  }

  // Âm "Negative Error" nhẹ nhàng khi chọn sai (không gây áp lực tiêu cực cho bé)
  playWrong(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Âm thanh chiến thắng + hiệu ứng vỗ tay / hò reo
  playVictory(isPerfect: boolean): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Hợp âm chiến thắng rực rỡ
    const victoryNotes = isPerfect
      ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      : [523.25, 659.25, 783.99];

    victoryNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.7);
    });

    // Nếu đạt 100%, tạo tiếng vỗ tay mô phỏng bằng noise bursts
    if (isPerfect) {
      for (let i = 0; i < 8; i++) {
        const clapTime = now + 0.4 + i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(300 + Math.random() * 400, clapTime);

        gain.gain.setValueAtTime(0.08, clapTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(clapTime);
        osc.stop(clapTime + 0.08);
      }
    }
  }
}

export const quizSound = new QuizSoundEngine();
