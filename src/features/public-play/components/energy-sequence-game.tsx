"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameHeaderBar } from "@/features/public-play/components/game-fullscreen-wrapper";

type Difficulty = "easy" | "medium" | "hard";

const ALL_PADS = [
  { id: 0, label: "Xanh dương", color: "#38bdf8", shade: "#075985", freq: 261.63 }, // C4
  { id: 1, label: "Vàng", color: "#facc15", shade: "#a16207", freq: 329.63 }, // E4
  { id: 2, label: "Hồng", color: "#f472b6", shade: "#9d174d", freq: 392.0 }, // G4
  { id: 3, label: "Tím", color: "#a78bfa", shade: "#5b21b6", freq: 523.25 }, // C5
  { id: 4, label: "Xanh lá", color: "#4ade80", shade: "#15803d", freq: 440.0 }, // A4
  { id: 5, label: "Cam", color: "#fb923c", shade: "#c2410c", freq: 587.33 }, // D5
];

type Mode = "idle" | "showing" | "input" | "failed";

export function EnergySequenceGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [sequence, setSequence] = useState<number[]>([]);
  const [entered, setEntered] = useState<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [best, setBest] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [failReason, setFailReason] = useState<"wrong" | "timeout">("wrong");

  const timers = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const activePads = difficulty === "easy" ? ALL_PADS.slice(0, 4) : ALL_PADS;

  const playTone = useCallback((freq: number, durationMs = 250) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Audio fallback
    }
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startTurnTimer = useCallback((durationSec: number) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    const startTime = Date.now();
    const totalMs = durationSec * 1000;
    setTimeLeft(100);

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / totalMs) * 100);
      setTimeLeft(remainingPct);

      if (remainingPct <= 0) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setFailReason("timeout");
        setMode("failed");
      }
    }, 50);
  }, []);

  const showSequence = useCallback(
    (next: number[], padPoolCount: number) => {
      clearTimers();
      setLit(null);
      setMode("showing");
      setTimeLeft(100);

      // Speed ramp: gets faster as sequence grows!
      const baseDuration = difficulty === "hard" ? 380 : difficulty === "medium" ? 500 : 640;
      const stepSpeed = Math.max(220, baseDuration - next.length * 24);
      const litTime = Math.round(stepSpeed * 0.65);

      next.forEach((padId, index) => {
        timers.current.push(
          window.setTimeout(() => {
            setLit(padId);
            const padObj = ALL_PADS.find((p) => p.id === padId);
            if (padObj) playTone(padObj.freq, litTime);
          }, 450 + index * stepSpeed)
        );

        timers.current.push(
          window.setTimeout(() => {
            setLit(null);
          }, 450 + index * stepSpeed + litTime)
        );
      });

      const totalShowingTime = 450 + next.length * stepSpeed + litTime + 100;
      timers.current.push(
        window.setTimeout(() => {
          setMode("input");
          // Turn time limit: 5s base + length * 1.5s
          const timeLimit = difficulty === "hard" ? Math.min(8, 3.5 + next.length * 0.8) : difficulty === "medium" ? Math.min(10, 4.5 + next.length * 1) : Math.min(12, 6 + next.length * 1.2);
          startTurnTimer(timeLimit);
        }, totalShowingTime)
      );
    },
    [clearTimers, difficulty, playTone, startTurnTimer]
  );

  const start = useCallback(() => {
    clearTimers();
    const padCount = activePads.length;
    const firstPad = Math.floor(Math.random() * padCount);
    const next = [firstPad];
    setSequence(next);
    setEntered([]);
    setScore(0);
    setFailReason("wrong");
    showSequence(next, padCount);
  }, [activePads.length, clearTimers, showSequence]);

  const choose = useCallback((padId: number) => {
    if (mode !== "input") return;
    const padObj = ALL_PADS.find((p) => p.id === padId);
    if (padObj) playTone(padObj.freq, 180);

    const nextEntered = [...entered, padId];
    setEntered(nextEntered);

    if (sequence[nextEntered.length - 1] !== padId) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setLit(padId);
      setFailReason("wrong");
      setMode("failed");
      setBest((value) => Math.max(value, sequence.length - 1));
      return;
    }

    if (nextEntered.length === sequence.length) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      const newScore = score + sequence.length * (difficulty === "hard" ? 30 : difficulty === "medium" ? 20 : 10);
      setScore(newScore);
      setBest((value) => Math.max(value, sequence.length));

      const nextPad = Math.floor(Math.random() * activePads.length);
      const next = [...sequence, nextPad];
      setMode("showing");

      timers.current.push(
        window.setTimeout(() => {
          setSequence(next);
          setEntered([]);
          showSequence(next, activePads.length);
        }, 600)
      );
    }
  }, [activePads.length, difficulty, entered, mode, playTone, score, sequence, showSequence]);

  const status =
    mode === "idle"
      ? "Chọn cấp độ & bắt đầu"
      : mode === "showing"
      ? "AIVA đang phát chuỗi mã..."
      : mode === "input"
      ? "Đến lượt bạn lặp lại!"
      : failReason === "timeout"
      ? "Hết thời gian phản xạ!"
      : "Chuỗi tín hiệu bị ngắt!";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 sm:space-y-4">
      <GameHeaderBar
        title="Mật Mã Năng Lượng"
        subtitle="Ghi nhớ & phản xạ chuỗi ánh sáng tăng tốc"
        icon="psychology"
        stats={
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap">
              Điểm: <strong className="font-mono text-amber-600 dark:text-amber-400">{score}</strong>
            </span>
            <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap">
              Kỷ lục: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{best}</strong>
            </span>
          </div>
        }
        onReset={start}
      />

      <section className="overflow-hidden rounded-2xl sm:rounded-[2rem] border border-fuchsia-300/30 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.12),transparent_42%),rgba(255,255,255,.9)] p-3.5 sm:p-5 md:p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-fuchsia-200/15 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.18),transparent_42%),rgba(255,255,255,.05)] dark:shadow-black/20">
        {/* Difficulty Selectors (Only shown in idle/failed mode) */}
        {mode === "idle" && (
          <div className="mb-3.5 flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
            {(
              [
                { id: "easy", label: "Tập Sự (4 Ô)", desc: "Tốc độ chuẩn" },
                { id: "medium", label: "Chuyên Gia (6 Ô)", desc: "Tốc độ nhanh" },
                { id: "hard", label: "Siêu Trí Nhớ 🔥", desc: "Chớp nhoáng" },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  difficulty === d.id
                    ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Status + Progress Bar Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
            <span
              className={
                mode === "failed"
                  ? "text-rose-600 dark:text-rose-300 flex items-center gap-1"
                  : mode === "input"
                  ? "text-amber-600 dark:text-amber-300 animate-pulse"
                  : "text-slate-800 dark:text-slate-200"
              }
            >
              {status}
            </span>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
              <span>Cấp {difficulty.toUpperCase()}</span>
              <span>•</span>
              <span>Độ dài: <strong className="text-amber-600 dark:text-amber-400 font-bold">{sequence.length}</strong></span>
            </div>
          </div>

          {/* Turn Countdown Progress Bar */}
          {mode === "input" && (
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-75 rounded-full ${
                  timeLeft > 40 ? "bg-amber-400" : "bg-rose-500 animate-pulse"
                }`}
                style={{ width: `${timeLeft}%` }}
              />
            </div>
          )}
        </div>

        {/* Dynamic Pads Grid: 2 columns for 4 pads, 3 columns for 6 pads */}
        <div
          className={`mx-auto mt-3 sm:mt-4 grid gap-2.5 sm:gap-3.5 max-w-lg ${
            activePads.length === 6 ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {activePads.map((pad) => {
            const isLit = lit === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => choose(pad.id)}
                disabled={mode !== "input"}
                aria-label={`Chọn ${pad.label}`}
                className={`rounded-2xl sm:rounded-3xl border border-white/50 transition duration-150 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:border-white/20 dark:focus-visible:outline-white disabled:cursor-default ${
                  activePads.length === 6
                    ? "h-16 sm:h-24 md:h-28 max-h-[16vh]"
                    : "h-20 sm:h-28 md:h-32 max-h-[22vh]"
                }`}
                style={{
                  background: `radial-gradient(circle at 50% 35%, ${pad.color}, ${pad.shade})`,
                  boxShadow: isLit
                    ? `0 0 0 5px rgba(255,255,255,.9), 0 0 45px ${pad.color}`
                    : "inset 0 -8px 20px rgba(0,0,0,.25)",
                  filter: isLit
                    ? "brightness(1.4) saturate(1.2)"
                    : mode === "showing"
                    ? "brightness(.42) saturate(.5)"
                    : "none",
                  transform: isLit ? "scale(1.04)" : "scale(1)",
                }}
              />
            );
          })}
        </div>

        {mode === "failed" && (
          <div className="mt-3 rounded-xl sm:rounded-2xl border border-rose-300/40 bg-rose-400/15 px-4 py-2.5 sm:px-5 sm:py-3 animate-fadeIn" role="alert">
            <p className="font-black text-xs sm:text-sm text-rose-700 dark:text-rose-200">
              {failReason === "timeout" ? "Hết thời gian suy nghĩ!" : "Chưa chính xác rồi!"}
            </p>
            <p className="mt-0.5 text-xs text-rose-800/85 dark:text-rose-100/85">
              Bạn đã ghi nhớ được chuỗi {Math.max(0, sequence.length - 1)} tín hiệu. Nhấn bắt đầu để thử thách lại!
            </p>
          </div>
        )}

        <div className="mt-3.5 sm:mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {difficulty === "hard"
              ? "⚡ Tốc độ chớp nhoáng & giới hạn thời gian phản xạ!"
              : "Quan sát các ô sáng và âm thanh, sau đó lặp lại đúng thứ tự."}
          </p>
          <button
            type="button"
            onClick={start}
            className="min-h-10 sm:min-h-11 rounded-full bg-yellow-300 hover:bg-yellow-200 px-5 sm:px-6 font-bold text-xs text-slate-950 transition active:scale-95 shadow-md inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">
              {mode === "idle" ? "play_arrow" : mode === "failed" ? "replay" : "restart_alt"}
            </span>
            <span>{mode === "idle" ? "Bắt đầu thử thách" : mode === "failed" ? "Thử lại ngay" : "Làm mới"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
