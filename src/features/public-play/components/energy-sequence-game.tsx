"use client";

import { useEffect, useRef, useState } from "react";
import { GameHeaderBar } from "@/features/public-play/components/game-fullscreen-wrapper";

const PADS = [
  { id: 0, label: "Xanh dương", color: "#38bdf8", shade: "#075985" },
  { id: 1, label: "Vàng", color: "#facc15", shade: "#a16207" },
  { id: 2, label: "Hồng", color: "#f472b6", shade: "#9d174d" },
  { id: 3, label: "Tím", color: "#a78bfa", shade: "#5b21b6" },
];
const randomPad = () => Math.floor(Math.random() * PADS.length);

type Mode = "idle" | "showing" | "input" | "failed";

export function EnergySequenceGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [entered, setEntered] = useState<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [best, setBest] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const showSequence = (next: number[]) => {
    clearTimers();
    setLit(null);
    setMode("showing");
    next.forEach((pad, index) => {
      timers.current.push(window.setTimeout(() => setLit(pad), 500 + index * 720));
      timers.current.push(window.setTimeout(() => setLit(null), 960 + index * 720));
    });
    timers.current.push(window.setTimeout(() => setMode("input"), 1120 + next.length * 720));
  };

  const start = () => {
    const next = [randomPad()];
    setSequence(next);
    setEntered([]);
    setBest(0);
    showSequence(next);
  };

  const choose = (pad: number) => {
    if (mode !== "input") return;
    const nextEntered = [...entered, pad];
    setEntered(nextEntered);
    if (sequence[nextEntered.length - 1] !== pad) {
      setLit(pad);
      setMode("failed");
      setBest((value) => Math.max(value, sequence.length - 1));
      return;
    }
    if (nextEntered.length === sequence.length) {
      setBest(sequence.length);
      const next = [...sequence, randomPad()];
      setMode("showing");
      timers.current.push(window.setTimeout(() => {
        setSequence(next);
        setEntered([]);
        showSequence(next);
      }, 700));
    }
  };

  const status = mode === "idle" ? "Sẵn sàng" : mode === "showing" ? "AIVA đang phát mã" : mode === "input" ? "Đến lượt bạn" : "Chuỗi bị ngắt";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 sm:space-y-4">
      <GameHeaderBar
        title="Mật Mã Năng Lượng"
        subtitle="Ghi nhớ chuỗi tín hiệu ánh sáng"
        icon="psychology"
        stats={
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap">
            <span>Cao nhất:</span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{best}</span>
          </div>
        }
        onReset={start}
      />

      <section className="overflow-hidden rounded-2xl sm:rounded-[2rem] border border-fuchsia-300/30 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.12),transparent_42%),rgba(255,255,255,.9)] p-3.5 sm:p-5 md:p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-fuchsia-200/15 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.18),transparent_42%),rgba(255,255,255,.05)] dark:shadow-black/20">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
          <span className={mode === "failed" ? "text-rose-600 dark:text-rose-300" : "text-slate-800 dark:text-slate-200"}>{status}</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">Mã: {sequence.length || "–"}</span>
        </div>
        <div className="mx-auto mt-3 sm:mt-4 grid max-w-md sm:max-w-lg grid-cols-2 gap-2.5 sm:gap-4">
          {PADS.map((pad) => {
            const isLit = lit === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => choose(pad.id)}
                disabled={mode !== "input"}
                aria-label={`Chọn ${pad.label}`}
                className="h-20 sm:h-28 md:h-32 max-h-[22vh] sm:max-h-[25vh] rounded-2xl sm:rounded-[1.7rem] border border-white/50 transition duration-150 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:border-white/20 dark:focus-visible:outline-white disabled:cursor-default"
                style={{
                  background: `radial-gradient(circle at 50% 35%, ${pad.color}, ${pad.shade})`,
                  boxShadow: isLit ? `0 0 0 5px rgba(255,255,255,.88), 0 0 52px ${pad.color}` : "inset 0 -10px 24px rgba(0,0,0,.2)",
                  filter: isLit ? "brightness(1.35) saturate(1.1)" : mode === "showing" ? "brightness(.48) saturate(.6)" : "none",
                  transform: isLit ? "scale(1.035)" : "scale(1)",
                }}
              />
            );
          })}
        </div>

        {mode === "failed" && (
          <div className="mt-3 rounded-xl sm:rounded-2xl border border-rose-300/40 bg-rose-400/15 px-4 py-2.5 sm:px-5 sm:py-3" role="alert">
            <p className="font-black text-xs sm:text-sm text-rose-700 dark:text-rose-200">Chưa đúng rồi</p>
            <p className="mt-0.5 text-xs text-rose-800/85 dark:text-rose-100/85">Bạn đã nhớ đúng {Math.max(0, sequence.length - 1)} lượt. Nhấn chơi lại để thử một mã mới.</p>
          </div>
        )}

        <div className="mt-3.5 sm:mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Quan sát các ô sáng, rồi lặp lại đúng thứ tự.</p>
          <button
            type="button"
            onClick={start}
            className="min-h-10 sm:min-h-11 rounded-full bg-yellow-300 hover:bg-yellow-200 px-5 sm:px-6 font-bold text-xs text-slate-950 transition active:scale-95 shadow-md inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">
              {mode === "idle" ? "play_arrow" : mode === "failed" ? "replay" : "restart_alt"}
            </span>
            <span>{mode === "idle" ? "Bắt đầu chơi" : mode === "failed" ? "Chơi lại" : "Làm mới"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
