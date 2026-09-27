"use client";

import { useEffect, useRef, useState } from "react";

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
    <section className="overflow-hidden rounded-[2rem] border border-fuchsia-200/20 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.22),transparent_42%),rgba(255,255,255,.07)] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200">Thử thách trí nhớ</p>
          <h2 className="mt-2 text-2xl font-black">Mật mã năng lượng</h2>
        </div>
        <div className="rounded-2xl border border-white/15 bg-slate-950/30 px-4 py-2 text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Cao nhất</p>
          <p className="mt-0.5 text-xl font-black text-yellow-200">{best}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/35 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-sm font-bold">
          <span className={mode === "failed" ? "text-rose-300" : "text-slate-200"}>{status}</span>
          <span className="text-slate-400">Mã: {sequence.length || "–"}</span>
        </div>
        <div className="mx-auto mt-5 grid max-w-lg grid-cols-2 gap-4 sm:gap-5">
          {PADS.map((pad) => {
            const isLit = lit === pad.id;
            return (
              <button key={pad.id} type="button" onClick={() => choose(pad.id)} disabled={mode !== "input"} aria-label={`Chọn ${pad.label}`} className="min-h-32 rounded-[1.7rem] border border-white/20 transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-default sm:min-h-40" style={{ background: `radial-gradient(circle at 50% 35%, ${pad.color}, ${pad.shade})`, boxShadow: isLit ? `0 0 0 5px rgba(255,255,255,.88), 0 0 52px ${pad.color}` : "inset 0 -10px 24px rgba(0,0,0,.2)", filter: isLit ? "brightness(1.35) saturate(1.1)" : mode === "showing" ? "brightness(.48) saturate(.6)" : "none", transform: isLit ? "scale(1.035)" : "scale(1)" }} />
            );
          })}
        </div>
      </div>

      {mode === "failed" && (
        <div className="mt-4 rounded-2xl border border-rose-300/40 bg-rose-400/15 px-5 py-4" role="alert">
          <p className="font-black text-rose-200">Chưa đúng rồi</p>
          <p className="mt-1 text-sm text-rose-100/85">Bạn đã nhớ đúng {Math.max(0, sequence.length - 1)} lượt. Nhấn chơi lại để thử một mã mới.</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-300">Quan sát các ô sáng, rồi lặp lại đúng thứ tự.</p>
        <button type="button" onClick={start} className="min-h-12 rounded-full bg-yellow-300 px-7 font-bold text-slate-950 transition hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-200">
          {mode === "idle" || mode === "failed" ? "Bắt đầu" : "Chơi lại"}
        </button>
      </div>
    </section>
  );
}
