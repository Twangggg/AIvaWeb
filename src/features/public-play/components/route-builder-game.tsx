"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
    <section className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Kỹ sư đường đi</h2>
          <p className="mt-1 text-sm text-slate-300">{message}</p>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Tuyến {missionIndex + 1}</span>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid aspect-square max-w-md grid-cols-6 gap-1 rounded-2xl bg-white/10 p-2">
          {Array.from({ length: 36 }, (_, index) => {
            const point = { x: index % 6, y: Math.floor(index / 6) };
            const isBlock = mission.blocks.includes(key(point));
            const isStart = key(point) === key(mission.start);
            const isGoal = key(point) === key(mission.goal);
            const isBot = key(point) === key(position);
            return (
              <div key={key(point)} className={`relative flex min-h-10 items-center justify-center overflow-hidden rounded-lg text-xs font-black ${isBlock ? "bg-slate-950" : isGoal ? "bg-violet-400/20" : isBot ? "bg-cyan-300/20" : "bg-emerald-400/30 text-transparent"}`} aria-label={isGoal ? "Cổng không gian" : isBot ? "AIVA" : isBlock ? "Chướng ngại" : undefined}>
                {isGoal ? <Image src="/games/portal-sprite.webp" alt="" fill unoptimized sizes="72px" className="object-contain p-0.5" /> : isBot ? <Image src="/games/robot-sprite.webp" alt="" fill unoptimized sizes="72px" className="object-contain p-0.5" /> : isStart ? "Bắt đầu" : ""}
              </div>
            );
          })}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-200">Chuỗi lệnh</p>
          <div className="mt-3 min-h-14 rounded-2xl border border-white/15 bg-slate-950/30 p-3 text-sm text-slate-300">{commands.length ? commands.map((command, index) => <span key={`${command}-${index}`} className="mr-2 inline-block rounded-lg bg-white/10 px-2 py-1">{COMMANDS.find((item) => item.id === command)?.label}</span>) : "Chưa có lệnh"}</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {COMMANDS.map((command) => <button key={command.id} type="button" disabled={running || commands.length >= 14} onClick={() => setCommands((items) => [...items, command.id])} className="min-h-11 rounded-xl border border-white/20 px-3 text-sm font-bold transition hover:bg-white/10 disabled:opacity-40">{command.label}</button>)}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" disabled={running} onClick={() => setCommands((items) => items.slice(0, -1))} className="min-h-11 flex-1 rounded-xl border border-white/20 px-3 text-sm font-bold disabled:opacity-40">Xóa lệnh</button>
            <button type="button" disabled={running || !commands.length} onClick={run} className="min-h-11 flex-1 rounded-xl bg-yellow-300 px-3 text-sm font-bold text-slate-950 disabled:opacity-40">Chạy</button>
          </div>
          {completed && <button type="button" onClick={nextMission} className="mt-3 min-h-11 w-full rounded-xl bg-cyan-300 px-3 text-sm font-bold text-slate-950">Tuyến tiếp theo</button>}
          {!completed && <button type="button" disabled={running} onClick={reset} className="mt-3 min-h-11 w-full rounded-xl text-sm font-bold text-slate-300 disabled:opacity-40">Làm lại</button>}
        </div>
      </div>
    </section>
  );
}
