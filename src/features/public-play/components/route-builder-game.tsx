"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { GameHeaderBar } from "@/features/public-play/components/game-fullscreen-wrapper";

type Point = { x: number; y: number };
type Command = "up" | "right" | "down" | "left";

interface Mission {
  id: number;
  title: string;
  start: Point;
  goal: Point;
  blocks: string[];
  gems?: Point[];
  portalA?: Point;
  portalB?: Point;
  optimalCommands: number;
}

const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Khởi Đầu Thẳng Tuyến",
    start: { x: 0, y: 5 },
    goal: { x: 5, y: 0 },
    blocks: ["1:4", "2:4", "4:3", "1:2", "3:1"],
    optimalCommands: 6,
  },
  {
    id: 2,
    title: "Vượt Dải Núi Đá",
    start: { x: 0, y: 0 },
    goal: { x: 5, y: 5 },
    blocks: ["2:0", "2:1", "2:2", "3:4", "4:4", "0:3", "1:3"],
    optimalCommands: 7,
  },
  {
    id: 3,
    title: "Thu Thập Lõi Năng Lượng ⚡",
    start: { x: 0, y: 5 },
    goal: { x: 5, y: 0 },
    blocks: ["1:5", "1:3", "3:4", "4:2", "2:1"],
    gems: [{ x: 3, y: 2 }],
    optimalCommands: 8,
  },
  {
    id: 4,
    title: "Mê Cung 2 Tinh Thể Pha Lê 💎",
    start: { x: 5, y: 5 },
    goal: { x: 0, y: 0 },
    blocks: ["4:5", "4:4", "2:4", "2:3", "4:1", "1:2"],
    gems: [{ x: 1, y: 4 }, { x: 4, y: 2 }],
    optimalCommands: 10,
  },
  {
    id: 5,
    title: "Cổng Dịch Chuyển Không Gian 🌀",
    start: { x: 0, y: 4 },
    goal: { x: 5, y: 1 },
    blocks: ["1:3", "2:3", "3:3", "4:3", "2:1", "3:1"],
    portalA: { x: 1, y: 4 },
    portalB: { x: 4, y: 2 },
    optimalCommands: 6,
  },
  {
    id: 6,
    title: "Thử Thách Kỹ Sư Siêu Cấp 🏆",
    start: { x: 0, y: 5 },
    goal: { x: 5, y: 0 },
    blocks: ["0:4", "1:2", "2:2", "3:2", "4:4", "3:4", "2:5"],
    gems: [{ x: 2, y: 3 }, { x: 5, y: 3 }],
    portalA: { x: 1, y: 3 },
    portalB: { x: 4, y: 1 },
    optimalCommands: 9,
  },
];

const COMMANDS: { id: Command; label: string; icon: string; step: Point }[] = [
  { id: "up", label: "Lên", icon: "arrow_upward", step: { x: 0, y: -1 } },
  { id: "right", label: "Phải", icon: "arrow_forward", step: { x: 1, y: 0 } },
  { id: "down", label: "Xuống", icon: "arrow_downward", step: { x: 0, y: 1 } },
  { id: "left", label: "Trái", icon: "arrow_back", step: { x: -1, y: 0 } },
];

const key = (point: Point) => `${point.x}:${point.y}`;

export function RouteBuilderGame() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [commands, setCommands] = useState<Command[]>([]);
  const [position, setPosition] = useState<Point>(MISSIONS[0].start);
  const [collectedGems, setCollectedGems] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [starsMap, setStarsMap] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("Xếp lệnh để đưa robot AIVA về đích.");

  const timers = useRef<number[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mission = MISSIONS[missionIndex];

  const playTone = useCallback((freq: number, duration = 0.2) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }, []);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const resetMission = useCallback((idx: number) => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const target = MISSIONS[idx];
    setCommands([]);
    setPosition(target.start);
    setCollectedGems([]);
    setRunning(false);
    setCompleted(false);
    setEarnedStars(0);
    setMessage(`Tuyến ${target.id}: ${target.title}`);
  }, []);

  const selectMission = useCallback(
    (idx: number) => {
      setMissionIndex(idx);
      resetMission(idx);
    },
    [resetMission]
  );

  const run = () => {
    if (!commands.length || running) return;
    setRunning(true);
    setCompleted(false);
    setEarnedStars(0);
    setPosition(mission.start);
    setCollectedGems([]);

    let current = { ...mission.start };
    const currentGems: string[] = [];

    const execute = (index: number) => {
      if (index === commands.length) {
        const requiredGems = mission.gems ? mission.gems.length : 0;
        const gotAllGems = currentGems.length >= requiredGems;
        const reachedGoal = key(current) === key(mission.goal);

        setRunning(false);
        if (reachedGoal && gotAllGems) {
          playTone(659.25, 0.4);
          let stars = 2;
          if (commands.length <= mission.optimalCommands) {
            stars = 3;
          }
          setEarnedStars(stars);
          setStarsMap((prev) => ({ ...prev, [mission.id]: Math.max(prev[mission.id] || 0, stars) }));
          setCompleted(true);
          setMessage(stars === 3 ? "Xuất sắc! Lộ trình tối ưu đạt 3 Sao ⭐⭐⭐" : "Hoàn thành! Bạn nhận 2 Sao ⭐⭐");
        } else if (reachedGoal && !gotAllGems) {
          playTone(220, 0.3);
          setMessage(`Chưa đủ năng lượng! Cần nhặt đủ ${requiredGems} tinh thể năng lượng trước khi vào cổng.`);
        } else {
          playTone(220, 0.3);
          setMessage("Chưa tới cổng không gian. Hãy điều chỉnh chuỗi lệnh.");
        }
        return;
      }

      const command = COMMANDS.find((item) => item.id === commands[index])!;
      let next = { x: current.x + command.step.x, y: current.y + command.step.y };
      const valid = next.x >= 0 && next.x < 6 && next.y >= 0 && next.y < 6 && !mission.blocks.includes(key(next));

      if (!valid) {
        setRunning(false);
        playTone(180, 0.35);
        setMessage("AIVA gặp chướng ngại vật hoặc va vào tường! Hãy sửa lại lệnh.");
        return;
      }

      // Check Warp Portal
      if (mission.portalA && key(next) === key(mission.portalA)) {
        playTone(880, 0.3);
        next = { ...mission.portalB! };
      } else {
        playTone(440 + index * 40, 0.15);
      }

      // Check Gem Collection
      if (mission.gems) {
        const gemHit = mission.gems.find((g) => key(g) === key(next));
        if (gemHit && !currentGems.includes(key(gemHit))) {
          currentGems.push(key(gemHit));
          setCollectedGems([...currentGems]);
          playTone(783.99, 0.25);
        }
      }

      current = next;
      setPosition(next);
      timers.current.push(window.setTimeout(() => execute(index + 1), 320));
    };

    execute(0);
  };

  const nextMission = useCallback(() => {
    const nextIdx = (missionIndex + 1) % MISSIONS.length;
    selectMission(nextIdx);
  }, [missionIndex, selectMission]);

  const totalStars = Object.values(starsMap).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4">
      <GameHeaderBar
        title="Kỹ Sư Đường Đi"
        subtitle={message}
        icon="alt_route"
        stats={
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-sm whitespace-nowrap">
              ⭐ {totalStars}/{MISSIONS.length * 3}
            </span>
            <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap">
              Tuyến {missionIndex + 1}/{MISSIONS.length}
            </span>
          </div>
        }
        onReset={() => resetMission(missionIndex)}
      />

      <section className="ui-surface ui-border rounded-2xl sm:rounded-[2rem] border p-3.5 sm:p-5 md:p-6 shadow-xl backdrop-blur-xl">
        {/* Mission Level Navigation Pills */}
        <div className="mb-3 flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5">
            {MISSIONS.map((m, idx) => {
              const stars = starsMap[m.id] || 0;
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={running}
                  onClick={() => selectMission(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                    missionIndex === idx
                      ? "bg-amber-400 text-black shadow-sm font-black ring-2 ring-amber-400/50"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Màn {m.id}</span>
                  {stars > 0 && <span className="text-[10px] text-amber-600 dark:text-amber-300">{"⭐".repeat(stars)}</span>}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
            Tối ưu 3⭐: <strong>≤{mission.optimalCommands} lệnh</strong>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_300px] items-start">
          {/* 6x6 Grid Interactive Map */}
          <div className="ui-surface-soft grid aspect-square w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto grid-cols-6 gap-1 rounded-2xl p-1.5 sm:p-2 border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
            {Array.from({ length: 36 }, (_, index) => {
              const point = { x: index % 6, y: Math.floor(index / 6) };
              const isBlock = mission.blocks.includes(key(point));
              const isStart = key(point) === key(mission.start);
              const isGoal = key(point) === key(mission.goal);
              const isBot = key(point) === key(position);
              const isGem = mission.gems?.some((g) => key(g) === key(point));
              const isGemCollected = collectedGems.includes(key(point));
              const isPortalA = mission.portalA && key(point) === key(mission.portalA);
              const isPortalB = mission.portalB && key(point) === key(mission.portalB);

              return (
                <div
                  key={key(point)}
                  className={`relative flex min-h-8 sm:min-h-10 items-center justify-center overflow-hidden rounded-lg text-[10px] font-black transition-colors ${
                    isBlock
                      ? "bg-slate-800/80 dark:bg-slate-950 border border-slate-700/50"
                      : isGoal
                      ? "bg-emerald-500/20 border border-emerald-500/40"
                      : isPortalA || isPortalB
                      ? "bg-fuchsia-500/20 border border-fuchsia-400/50 animate-pulse"
                      : isBot
                      ? "bg-[var(--ocean-alpha)] border border-[var(--ocean)]"
                      : "bg-slate-100/70 dark:bg-slate-900/60"
                  }`}
                  aria-label={
                    isGoal
                      ? "Cổng không gian"
                      : isBot
                      ? "AIVA Robot"
                      : isBlock
                      ? "Chướng ngại vật"
                      : isGem
                      ? "Tinh thể năng lượng"
                      : undefined
                  }
                >
                  {isGoal ? (
                    <Image src="/games/portal-sprite.webp" alt="" fill unoptimized sizes="72px" className="object-contain p-0.5" />
                  ) : isBot ? (
                    <Image src="/games/robot-sprite.webp" alt="" fill unoptimized sizes="72px" className="object-contain p-0.5 z-20" />
                  ) : isPortalA ? (
                    <span className="text-xs font-black text-fuchsia-600 dark:text-fuchsia-300 font-mono">🌀 A</span>
                  ) : isPortalB ? (
                    <span className="text-xs font-black text-fuchsia-600 dark:text-fuchsia-300 font-mono">🌀 B</span>
                  ) : isGem && !isGemCollected ? (
                    <span className="text-base animate-bounce">⚡</span>
                  ) : isStart ? (
                    <span className="text-[9px] font-mono text-slate-400">START</span>
                  ) : isBlock ? (
                    <span className="material-symbols-outlined text-sm text-slate-400">landscape</span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Programming Control Tray */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span>Chuỗi lệnh ({commands.length}/14)</span>
              {mission.gems && (
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                  Lõi: {collectedGems.length}/{mission.gems.length} ⚡
                </span>
              )}
            </div>

            <div className="ui-surface-soft ui-border ui-muted mt-2 min-h-12 max-h-24 overflow-y-auto rounded-xl border p-2 text-xs sm:text-sm flex flex-wrap gap-1">
              {commands.length ? (
                commands.map((cmdId, index) => {
                  const cmdObj = COMMANDS.find((item) => item.id === cmdId);
                  return (
                    <span
                      key={`${cmdId}-${index}`}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[11px]">{cmdObj?.icon}</span>
                      <span>{cmdObj?.label}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-slate-400 text-xs italic">Bấm các nút bên dưới để lên lộ trình cho AIVA...</span>
              )}
            </div>

            {/* Command Buttons */}
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
              {COMMANDS.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  disabled={running || commands.length >= 14}
                  onClick={() => setCommands((items) => [...items, command.id])}
                  className="ui-border min-h-9 sm:min-h-10 rounded-xl border px-2.5 text-xs sm:text-sm font-bold transition hover:opacity-75 disabled:opacity-40 inline-flex items-center justify-center gap-1 bg-white/80 dark:bg-slate-900/80 active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">{command.icon}</span>
                  <span>{command.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                disabled={running || !commands.length}
                onClick={() => setCommands((items) => items.slice(0, -1))}
                className="ui-border min-h-9 sm:min-h-10 flex-1 rounded-xl border px-2 text-xs sm:text-sm font-bold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
              >
                Xóa lệnh
              </button>
              <button
                type="button"
                disabled={running || !commands.length}
                onClick={run}
                className="min-h-9 sm:min-h-10 flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs sm:text-sm text-slate-950 disabled:opacity-40 transition active:scale-95 shadow-md inline-flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Chạy mã</span>
              </button>
            </div>

            {completed ? (
              <div className="mt-2.5 space-y-2 animate-fadeIn">
                <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-center">
                  <p className="text-xs font-black text-amber-700 dark:text-amber-300">
                    {"⭐".repeat(earnedStars)} {earnedStars === 3 ? "Hoàn Hảo (Tối ưu nhất)!" : "Đạt Chuẩn!"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={nextMission}
                  className="min-h-9 sm:min-h-10 bg-emerald-500 hover:bg-emerald-400 text-black w-full rounded-xl px-2.5 text-xs sm:text-sm font-bold transition active:scale-95 shadow-md flex items-center justify-center gap-1"
                >
                  <span>Sang Tuyến {missionIndex + 2 <= MISSIONS.length ? missionIndex + 2 : 1} ➔</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={running}
                onClick={() => resetMission(missionIndex)}
                className="ui-muted mt-2.5 min-h-9 sm:min-h-10 w-full rounded-xl text-xs sm:text-sm font-bold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Đặt lại ban đầu
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
