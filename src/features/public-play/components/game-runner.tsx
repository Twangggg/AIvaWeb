"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import confetti from "canvas-confetti";

import { GameId, getGameById } from "../games-data";
import { AviaQuizGame } from "@/features/avia-quiz/avia-quiz-game";
import { AivaGardenGame } from "./aiva-garden-game";
import { AivaVisionQuestGame } from "./aiva-vision-quest-game";
import { EnergySequenceGame } from "./energy-sequence-game";
import { RouteBuilderGame } from "./route-builder-game";
import {
  GameFullscreenWrapper,
  GameHeaderBar,
} from "./game-fullscreen-wrapper";

interface GameRunnerProps {
  gameId: GameId;
}

export function GameRunner({ gameId }: GameRunnerProps) {
  const router = useRouter();
  const game = getGameById(gameId);

  // State for Garden Game
  const [round, setRound] = useState(0);
  const [level, setLevel] = useState(1);
  const [collected, setCollected] = useState(0);
  const [totalShards, setTotalShards] = useState(3);
  const [stepsRemaining, setStepsRemaining] = useState(35);
  const [maxSteps, setMaxSteps] = useState(35);
  const [hearts, setHearts] = useState(3);
  const [maxHearts, setMaxHearts] = useState(3);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState(
    "Chạm vào ô cỏ hoặc dùng phím điều hướng để di chuyển."
  );

  const restartGarden = () => {
    setRound((val) => val + 1);
    setCollected(0);
    setHearts(3);
    setCompleted(false);
    setFailed(false);
    setMessage("Chạm vào ô cỏ hoặc dùng phím điều hướng để di chuyển.");
  };

  const selectGardenLevel = (lvl: number) => {
    setLevel(lvl);
    setRound((val) => val + 1);
    setCollected(0);
    setHearts(3);
    setCompleted(false);
    setFailed(false);
  };

  const nextGardenLevel = () => {
    setLevel((val) => Math.min(5, val + 1));
    restartGarden();
  };

  const handleBackToLobby = () => {
    router.push("/play");
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Breadcrumb & Quick Back Navigation */}
      <div className="flex items-center justify-between gap-3 border-b border-emerald-500/20 dark:border-slate-800 pb-3">
        <Link
          href="/play"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-95"
        >
          <span>←</span>
          <span>Quay lại Khu Vui Chơi</span>
        </Link>

        {game && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300">
              Trò chơi: {game.title}
            </span>
          </div>
        )}
      </div>

      {/* Main Game Renderer */}
      <div className="w-full">
        {gameId === "avia-quiz" && (
          <AviaQuizGame onBackToLobby={handleBackToLobby} />
        )}

        {gameId === "vision-quest" && (
          <GameFullscreenWrapper onBack={handleBackToLobby}>
            <AivaVisionQuestGame />
          </GameFullscreenWrapper>
        )}

        {gameId === "garden" && (
          <GameFullscreenWrapper onBack={handleBackToLobby}>
            <div className="w-full max-w-[720px] mx-auto space-y-3 sm:space-y-3.5">
              <GameHeaderBar
                title="Vườn Thông Minh AIVA"
                subtitle="Né bọ tuần tra, gỡ bẫy & giải cứu khu vườn"
                icon="potted_plant"
                stats={
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 shadow-sm whitespace-nowrap">
                      ❤️ {hearts}/{maxHearts}
                    </span>
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-sm whitespace-nowrap">
                      ⚡ {collected}/{totalShards}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm whitespace-nowrap ${
                        stepsRemaining <= 8
                          ? "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse"
                          : "border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      🔋 {stepsRemaining}/{maxSteps}
                    </span>
                  </div>
                }
                onReset={restartGarden}
              />

              {/* Level Selector Pills */}
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-0.5">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 1, label: "Màn 1", desc: "Tập sự" },
                    { id: 2, label: "Màn 2 🚨", desc: "1 Bọ tuần tra" },
                    { id: 3, label: "Màn 3 ⚡", desc: "2 Bọ + Bẫy điện" },
                    { id: 4, label: "Màn 4 🌙", desc: "Màn đêm sương mù" },
                    { id: 5, label: "Màn 5 🔥", desc: "Ác mộng siêu cấp" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => selectGardenLevel(lvl.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        level === lvl.id
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garden Board Game */}
              <AivaGardenGame
                level={level}
                round={round}
                onUpdate={({
                  collected: nextCollected,
                  totalShards: nextTotal,
                  stepsRemaining: nextSteps,
                  maxSteps: nextMax,
                  hearts: nextHearts,
                  maxHearts: nextMaxHearts,
                  completed: nextCompleted,
                  failed: nextFailed,
                  message: nextMsg,
                }) => {
                  setCollected(nextCollected);
                  setTotalShards(nextTotal);
                  setStepsRemaining(nextSteps);
                  setMaxSteps(nextMax);
                  setHearts(nextHearts);
                  setMaxHearts(nextMaxHearts);
                  if (nextCompleted && !completed) {
                    try {
                      confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 },
                      });
                    } catch {}
                  }
                  setCompleted(nextCompleted);
                  setFailed(nextFailed);
                  setMessage(nextMsg);
                }}
              />

              {/* Win message */}
              {completed && (
                <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400 text-emerald-950 dark:text-emerald-200">
                  <p className="text-xs sm:text-sm font-bold">
                    🎉 Tuyệt vời! Bạn đã mở khóa cánh cổng thành công!
                  </p>
                  <button
                    type="button"
                    onClick={nextGardenLevel}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-95 whitespace-nowrap"
                  >
                    Màn Kế Tiếp ➔
                  </button>
                </div>
              )}

              {/* Fail message */}
              {failed && (
                <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-400 text-rose-950 dark:text-rose-200">
                  <p className="text-xs sm:text-sm font-bold">
                    💥 Chưa vượt qua được thử thách, hãy thử lại nhé!
                  </p>
                  <button
                    type="button"
                    onClick={restartGarden}
                    className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-rose-700 active:scale-95 whitespace-nowrap"
                  >
                    Thử Lại Màn {level} ↺
                  </button>
                </div>
              )}
            </div>
          </GameFullscreenWrapper>
        )}

        {gameId === "sequence" && (
          <GameFullscreenWrapper onBack={handleBackToLobby}>
            <EnergySequenceGame />
          </GameFullscreenWrapper>
        )}

        {gameId === "route" && (
          <GameFullscreenWrapper onBack={handleBackToLobby}>
            <RouteBuilderGame />
          </GameFullscreenWrapper>
        )}
      </div>
    </div>
  );
}
