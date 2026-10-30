// Sound Engine for AIVA Games (Avia Quiz & Mini-Games)
// Tích hợp toàn bộ sound effects chính thức và nhạc nền (BGM) từ public/games/
// Đồng thời giữ Web Audio API procedural synthesis làm phương án dự phòng (fallback).

export const GAME_AUDIO_PATHS = {
  bgm: "/games/BGM_BackGroundMusic.mp3",
  correct: "/games/SFX_CorrectAnswer.mp3",
  wrong: "/games/SFX_WrongAnswer.mp3",
  streak: "/games/SFX_Streak.mp3",
  finishLesson: "/games/SFX_FinishLesson.mp3",
  finishLessonAllCorrect: "/games/SFX_FinishLessonWithAllCorrect.mp3",
  miniGameMove: "/games/SFX_MiniGameFrogMove.mp3",
  miniGameFall: "/games/SFX_MiniGameFrogFallIntoWater.mp3",
  miniGameWin: "/games/SFX_WinMiniGame.mp3",
  miniGameLose: "/games/SFX_LoseMiniGame.mp3",
} as const;

class AudioEffectPool {
  private src: string;
  private volume: number;
  private pool: HTMLAudioElement[] = [];
  private poolSize: number;
  private poolIndex = 0;

  constructor(src: string, volume = 0.8, poolSize = 3) {
    this.src = src;
    this.volume = volume;
    this.poolSize = poolSize;
  }

  private getAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined" || typeof Audio === "undefined") return null;

    if (this.pool.length < this.poolSize) {
      try {
        const audio = new Audio(this.src);
        audio.preload = "auto";
        audio.volume = this.volume;
        this.pool.push(audio);
        return audio;
      } catch {
        return null;
      }
    }

    const audio = this.pool[this.poolIndex];
    this.poolIndex = (this.poolIndex + 1) % this.pool.length;
    return audio;
  }

  play(): boolean {
    try {
      const audio = this.getAudio();
      if (!audio) return false;

      audio.currentTime = 0;
      audio.volume = this.volume;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
      return true;
    } catch {
      return false;
    }
  }
}

export class GameSoundEngine {
  private _enabled = true;
  private ctx: AudioContext | null = null;

  // Background Music State
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmPlaying = false;
  private bgmVolume = 0.25;
  private unlockListener: (() => void) | null = null;
  private duckTimer: NodeJS.Timeout | null = null;

  // Audio Pool instances for all official game sounds
  private correctSound = new AudioEffectPool(GAME_AUDIO_PATHS.correct, 0.85);
  private wrongSound = new AudioEffectPool(GAME_AUDIO_PATHS.wrong, 0.7);
  private streakSound = new AudioEffectPool(GAME_AUDIO_PATHS.streak, 0.9);
  private finishLessonSound = new AudioEffectPool(GAME_AUDIO_PATHS.finishLesson, 0.85);
  private finishLessonAllCorrectSound = new AudioEffectPool(
    GAME_AUDIO_PATHS.finishLessonAllCorrect,
    0.95,
    1
  );
  private frogMoveSound = new AudioEffectPool(GAME_AUDIO_PATHS.miniGameMove, 0.65, 4);
  private frogFallSound = new AudioEffectPool(GAME_AUDIO_PATHS.miniGameFall, 0.75);
  private winMiniGameSound = new AudioEffectPool(GAME_AUDIO_PATHS.miniGameWin, 0.85);
  private loseMiniGameSound = new AudioEffectPool(GAME_AUDIO_PATHS.miniGameLose, 0.8);

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(val: boolean) {
    this._enabled = val;
    if (!val) {
      this.pauseBgm();
    } else if (this.bgmPlaying) {
      this.resumeBgm();
    }
  }

  // --- Background Music (BGM) Controls ---
  private initBgm(): HTMLAudioElement | null {
    if (typeof window === "undefined" || typeof Audio === "undefined") return null;
    if (!this.bgmAudio) {
      try {
        const bgm = new Audio(GAME_AUDIO_PATHS.bgm);
        bgm.loop = true;
        bgm.volume = this.bgmVolume;
        bgm.preload = "auto";
        this.bgmAudio = bgm;
      } catch {
        return null;
      }
    }
    return this.bgmAudio;
  }

  public startBgm(): void {
    if (!this._enabled) return;
    this.bgmPlaying = true;
    const bgm = this.initBgm();
    if (!bgm) return;

    bgm.volume = this.bgmVolume;
    const playPromise = bgm.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Trình duyệt chặn autoplay khi chưa có tương tác từ người dùng.
        // Tự động kích hoạt khi người dùng chạm hoặc click vào màn hình.
        if (this.bgmPlaying && !this.unlockListener && typeof window !== "undefined") {
          const unlock = () => {
            this.cleanupUnlock();
            if (this.bgmPlaying && this._enabled && this.bgmAudio) {
              this.bgmAudio.play().catch(() => {});
            }
          };
          this.unlockListener = unlock;
          window.addEventListener("pointerdown", unlock, { once: true, passive: true });
          window.addEventListener("keydown", unlock, { once: true, passive: true });
          window.addEventListener("click", unlock, { once: true, passive: true });
        }
      });
    }
  }

  public stopBgm(): void {
    this.bgmPlaying = false;
    this.cleanupUnlock();
    if (this.duckTimer) {
      clearTimeout(this.duckTimer);
      this.duckTimer = null;
    }
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch {}
    }
  }

  public pauseBgm(): void {
    this.cleanupUnlock();
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
      } catch {}
    }
  }

  public resumeBgm(): void {
    if (!this._enabled || !this.bgmPlaying) return;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.volume = this.bgmVolume;
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch {}
    } else {
      this.startBgm();
    }
  }

  // Tạm thời hạ âm lượng nhạc nền khi có âm thanh chúc mừng chiến thắng lớn
  public duckBgm(durationMs: number): void {
    if (!this.bgmAudio || !this.bgmPlaying) return;
    if (this.duckTimer) clearTimeout(this.duckTimer);

    try {
      this.bgmAudio.volume = Math.max(0.04, this.bgmVolume * 0.2);
    } catch {}

    this.duckTimer = setTimeout(() => {
      if (this.bgmAudio && this.bgmPlaying) {
        try {
          this.bgmAudio.volume = this.bgmVolume;
        } catch {}
      }
      this.duckTimer = null;
    }, durationMs);
  }

  private cleanupUnlock(): void {
    if (this.unlockListener && typeof window !== "undefined") {
      window.removeEventListener("pointerdown", this.unlockListener);
      window.removeEventListener("keydown", this.unlockListener);
      window.removeEventListener("click", this.unlockListener);
      this.unlockListener = null;
    }
  }

  // --- Sound Effects (SFX) ---

  /** Âm thanh khi trả lời đúng câu hỏi */
  playCorrect(): void {
    if (!this._enabled) return;
    const played = this.correctSound.play();
    if (!played) {
      this.playCorrectSynth();
    }
  }

  /** Âm thanh chuỗi đúng liên tiếp (Combo / Streak) */
  playCombo(_combo?: number): void {
    if (!this._enabled) return;
    const played = this.streakSound.play();
    if (!played) {
      this.playComboSynth(_combo ?? 3);
    }
  }

  /** Âm thanh khi chọn sai câu hỏi */
  playWrong(): void {
    if (!this._enabled) return;
    const played = this.wrongSound.play();
    if (!played) {
      this.playWrongSynth();
    }
  }

  /** Âm thanh khi hoàn thành bài học (chiến thắng) */
  playVictory(isPerfect: boolean): void {
    if (!this._enabled) return;

    if (isPerfect) {
      // Âm thanh hoàn thành 100% đúng (fanfare rực rỡ dài 6.1s)
      this.duckBgm(6200);
      const played = this.finishLessonAllCorrectSound.play();
      if (!played) {
        this.playVictorySynth(true);
      }
    } else {
      // Âm thanh hoàn thành bài học thông thường (2.3s)
      this.duckBgm(2500);
      const played = this.finishLessonSound.play();
      if (!played) {
        this.playVictorySynth(false);
      }
    }
  }

  /** Âm thanh Ếch bước đi / nhảy trong mini-game */
  playMiniGameMove(): void {
    if (!this._enabled) return;
    const played = this.frogMoveSound.play();
    if (!played) {
      this.playMiniMoveSynth();
    }
  }

  /** Âm thanh Ếch rơi xuống nước / dẫm bẫy trong mini-game */
  playMiniGameFall(): void {
    if (!this._enabled) return;
    const played = this.frogFallSound.play();
    if (!played) {
      this.playMiniFallSynth();
    }
  }

  /** Âm thanh chiến thắng màn chơi Mini Game */
  playMiniGameWin(): void {
    if (!this._enabled) return;
    const played = this.winMiniGameSound.play();
    if (!played) {
      this.playVictorySynth(false);
    }
  }

  /** Âm thanh thua cuộc màn chơi Mini Game */
  playMiniGameLose(): void {
    if (!this._enabled) return;
    const played = this.loseMiniGameSound.play();
    if (!played) {
      this.playWrongSynth();
    }
  }

  // --- Web Audio API Procedural Fallback Synthesizer ---
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

  private playCorrectSynth(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
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

  private playComboSynth(combo: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes =
      combo >= 10
        ? [523.25, 659.25, 783.99, 1046.5]
        : combo >= 5
        ? [587.33, 739.99, 880.0]
        : [523.25, 659.25, 783.99];
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

  private playWrongSynth(): void {
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

  private playVictorySynth(isPerfect: boolean): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const victoryNotes = isPerfect
      ? [523.25, 659.25, 783.99, 1046.5]
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
  }

  private playMiniMoveSynth(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  private playMiniFallSynth(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }
}

// Singleton instances for seamless imports across the app
export const gameAudio = new GameSoundEngine();
export const quizSound = gameAudio;
