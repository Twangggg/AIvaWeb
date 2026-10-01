"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GameHeaderBar } from "@/features/public-play/components/game-fullscreen-wrapper";

type Point = { x: number; y: number };
type Command = "up" | "right" | "down" | "left";

const MISSIONS = [
  { start: { x: 0, y: 5 }, goal: { x: 5, y: 0 }, blocks: ["1:4", "2:4", "4:3", "1:2", "3:1"] },
  { start: { x: 0, y: 0 }, goal: { x: 5, y: 5 }, blocks: ["2:0", "2:1", "2:2", "3:4", "4:4"] },
  { start: { x: 5, y: 5 }, goal: { x: 0, y: 0 }, blocks: ["3:5", "3:4", "1:3", "2:3", "4:1"] },
];

const COMMANDS: { id: Command; label: string; step: Point }[] = [
  { id: "up", label: "Lên", step: { x: 0, y: -1 } },
  { id: "right", label: "Phải", step: { x: 1, y: 0 } },
  { id: "down", label: "Xuống", step: { x: 0, y: 1 } },
  { id: "left", label: "Trái", step: { x: -1, y: 0 } },
];

const key = (point: Point) => `${point.x}:${point.y}`;

export function RouteBuilderGame() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [commands, setCommands] = useState<Command[]>([]);
  const [position, setPosition] = useState<Point>(MISSIONS[0].start);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("Xếp lệnh rồi chạy chương trình.");
  const timers = useRef<number[]>([]);
  const mission = MISSIONS[missionIndex];

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const reset = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setCommands([]);
    setPosition(mission.start);
    setRunning(false);
    setCompleted(false);
    setMessage("Xếp lệnh rồi chạy chương trình.");
  };

  const run = () => {
    if (!commands.length || running) return;
    setRunning(true);
    setCompleted(false);
    setPosition(mission.start);
    let current = mission.start;
    const execute = (index: number) => {
      if (index === commands.length) {
        const success = key(current) === key(mission.goal);
        setRunning(false);
        setCompleted(success);
        setMessage(success ? "AIVA đã tới đích." : "Chưa tới đích. Hãy thử một chuỗi lệnh khác.");
        return;
      }
      const command = COMMANDS.find((item) => item.id === commands[index])!;
      const next = { x: current.x + command.step.x, y: current.y + command.step.y };
      const valid = next.x >= 0 && next.x < 6 && next.y >= 0 && next.y < 6 && !mission.blocks.includes(key(next));
      if (!valid) {
        setRunning(false);
        setMessage("AIVA gặp chướng ngại. Hãy sửa lệnh.");
        return;
      }
      current = next;
      setPosition(next);
      timers.current.push(window.setTimeout(() => execute(index + 1), 360));
    };
    execute(0);
  };

  const nextMission = () => {
    setMissionIndex((value) => (value + 1) % MISSIONS.length);
    setCommands([]);
    setPosition(MISSIONS[(missionIndex + 1) % MISSIONS.length].start);
    setCompleted(false);
    setMessage("Một tuyến mới đã sẵn sàng.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4">
      <GameHeaderBar
        title="Kỹ Sư Đường Đi"
        subtitle={message}
        icon="alt_route"
        stats={
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap">
            <span>Tuyến</span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{missionIndex + 1}/{MISSIONS.length}</span>
          </div>
        }
        onReset={reset}
      />

      <section className="ui-surface ui-border rounded-2xl sm:rounded-[2rem] border p-3.5 sm:p-5 md:p-6 shadow-xl backdrop-blur-xl">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_300px] items-start">
        <div className="ui-surface-soft grid aspect-square w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto grid-cols-6 gap-1 rounded-2xl p-1.5 sm:p-2">
          {Array.from({ length: 36 }, (_, index) => {
            const point = { x: index % 6, y: Math.floor(index / 6) };
            const isBlock = mission.blocks.includes(key(point));
            const isStart = key(point) === key(mission.start);
            const isGoal = key(point) === key(mission.goal);
            const isBot = key(point) === key(position);
            return (
              <div key={key(point)} className={`relative flex min-h-8 sm:min-h-10 items-center justify-center overflow-hidden rounded-lg text-[10px] font-black sm:text-xs ${isBlock ? "ui-surface-overlay" : isGoal ? "bg-[var(--game-cards-bg)]" : isBot ? "bg-[var(--ocean-alpha)]" : "bg-[var(--game-hunt-bg)] text-transparent"}`} aria-label={isGoal ? "Cổng không gian" : isBot ? "AIVA" : isBlock ? "Chướng ngại" : undefined}>
                {isGoal ? <Image src="/games/portal-sprite.webp" alt="" fill unoptimized sizes="72px" className="object-contain p-0.5" /> : isBot ? <Image src="/games/robot-sprite.webp" alt="" fill unoptimized sizes="72px" className="object-contain p-0.5" /> : isStart ? "Bắt đầu" : ""}
              </div>
            );
          })}
        </div>
        <div>
          <p className="ui-text text-xs sm:text-sm font-bold">Chuỗi lệnh</p>
          <div className="ui-surface-soft ui-border ui-muted mt-2 min-h-12 rounded-xl border p-2.5 text-xs sm:text-sm">{commands.length ? commands.map((command, index) => <span key={`${command}-${index}`} className="ui-surface mr-1.5 mb-1 inline-block rounded-lg px-2 py-0.5">{COMMANDS.find((item) => item.id === command)?.label}</span>) : "Chưa có lệnh"}</div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
            {COMMANDS.map((command) => <button key={command.id} type="button" disabled={running || commands.length >= 14} onClick={() => setCommands((items) => [...items, command.id])} className="ui-border min-h-9 sm:min-h-10 rounded-xl border px-2.5 text-xs sm:text-sm font-bold transition hover:opacity-75 disabled:opacity-40">{command.label}</button>)}
          </div>
          <div className="mt-2.5 flex gap-2">
            <button type="button" disabled={running} onClick={() => setCommands((items) => items.slice(0, -1))} className="ui-border min-h-9 sm:min-h-10 flex-1 rounded-xl border px-2.5 text-xs sm:text-sm font-bold disabled:opacity-40">Xóa lệnh</button>
            <button type="button" disabled={running || !commands.length} onClick={run} className="min-h-9 sm:min-h-10 flex-1 rounded-xl bg-[var(--ocean)] px-2.5 text-xs sm:text-sm font-bold text-[var(--text-on-accent)] disabled:opacity-40">Chạy</button>
          </div>
          {completed && <button type="button" onClick={nextMission} className="min-h-9 sm:min-h-10 ui-success-soft ui-success mt-2.5 w-full rounded-xl px-2.5 text-xs sm:text-sm font-bold">Tuyến tiếp theo</button>}
          {!completed && <button type="button" disabled={running} onClick={reset} className="ui-muted mt-2.5 min-h-9 sm:min-h-10 w-full rounded-xl text-xs sm:text-sm font-bold disabled:opacity-40">Làm lại</button>}
        </div>
      </div>
    </section>
    </div>
  );
}
