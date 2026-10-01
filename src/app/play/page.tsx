"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Footer } from "@/components/common/footer";
import { Nav } from "@/components/common/nav";
import { AivaGardenGame } from "@/features/public-play/components/aiva-garden-game";
import { AivaVisionQuestGame } from "@/features/public-play/components/aiva-vision-quest-game";
import { EnergySequenceGame } from "@/features/public-play/components/energy-sequence-game";
import { RouteBuilderGame } from "@/features/public-play/components/route-builder-game";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";

import { GameFullscreenWrapper, GameHeaderBar } from "@/features/public-play/components/game-fullscreen-wrapper";

type GameId = "vision-quest" | "garden" | "sequence" | "route";

const GAMES: { id: GameId; title: string; description: string; accent: string; image: string }[] = [
  { id: "vision-quest", title: "AIVA Vision Quest", description: "Dùng ống kính AIVA quét đồ vật & nhận Bằng Khám Phá Nhí.", accent: "border-amber-400/50 hover:bg-amber-400/10", image: "/games/robot-portal.webp" },
  { id: "garden", title: "Giải cứu khu vườn", description: "Tìm đường, nhặt năng lượng và mở cổng.", accent: "border-emerald-300/50 hover:bg-emerald-300/10", image: "/games/garden-maze.webp" },
  { id: "sequence", title: "Mật mã năng lượng", description: "Ghi nhớ chuỗi ánh sáng ngày một dài hơn.", accent: "border-fuchsia-300/50 hover:bg-fuchsia-300/10", image: "/games/energy-code.webp" },
  { id: "route", title: "Kỹ sư đường đi", description: "Xếp lệnh để dẫn AIVA tránh chướng ngại.", accent: "border-cyan-300/50 hover:bg-cyan-300/10", image: "/games/route-builder.webp" },
];

export default function PublicPlayPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [round, setRound] = useState(0);
  const [level, setLevel] = useState(1);
  const [collected, setCollected] = useState(0);
  const [totalShards, setTotalShards] = useState(3);
  const [stepsRemaining, setStepsRemaining] = useState(35);
  const [maxSteps, setMaxSteps] = useState(35);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("Chạm vào ô cỏ để AIVA tự tìm đường.");

  useEffect(() => () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  useEffect(() => {
    if (selectedGame) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedGame]);

  const restartGarden = () => {
    setRound((value) => value + 1);
    setCollected(0);
    setCompleted(false);
    setFailed(false);
    setMessage("Chạm vào ô cỏ để AIVA tự tìm đường.");
  };

  const openGame = (game: GameId) => {
    if (game === "garden") {
      setLevel(1);
      restartGarden();
    }
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const nextLevel = () => {
    setLevel((value) => value + 1);
    restartGarden();
  };

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className={`ui-page min-h-screen overflow-x-hidden px-3 sm:px-6 ${selectedGame ? "pt-16 sm:pt-20 pb-4" : "pt-20 sm:pt-28 pb-12"}`}>
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-[100px]" />
        <section className="relative mx-auto max-w-5xl">
          {!selectedGame ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Chơi cùng AIVA</h1>
                <p className="ui-muted mt-3 text-base">Chọn một thử thách để bắt đầu trải nghiệm ống kính AI thông minh.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {GAMES.map((game) => (
                  <button key={game.id} type="button" onClick={() => openGame(game.id)} className={`ui-surface ui-border min-h-64 rounded-[2rem] border p-5 text-left shadow-lg transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-80 ${game.accent}`}>
                    <div className="ui-surface-soft relative mb-2 h-36 overflow-hidden rounded-2xl">
                      <Image src={game.image} alt="" fill unoptimized sizes="(min-width: 768px) 30vw, 100vw" className="object-contain object-center" />
                    </div>
                    <p className="text-xl font-black">{game.title}</p>
                    <p className="ui-muted mt-2 text-xs leading-relaxed">{game.description}</p>
                    <span className="ui-accent mt-6 inline-block text-xs font-bold">Chơi ngay ➔</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {selectedGame === "vision-quest" && (
                <GameFullscreenWrapper onBack={() => setSelectedGame(null)}>
                  <AivaVisionQuestGame />
                </GameFullscreenWrapper>
              )}

              {selectedGame === "garden" && (
                <GameFullscreenWrapper onBack={() => setSelectedGame(null)}>
                  <div className="w-full max-w-2xl mx-auto space-y-3 sm:space-y-4">
                    <GameHeaderBar
                      title="Vườn Thông Minh AIVA"
                      subtitle="Thu thập tinh thể & mở cổng không gian"
                      icon="potted_plant"
                      stats={
                        <div className="flex items-center gap-1.5 sm:gap-2">
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
                          <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap">
                            Màn {level}
                          </span>
                        </div>
                      }
                      onReset={restartGarden}
                    />
                    <div className="w-full">
                      <AivaGardenGame
                        round={round}
                        level={level}
                        onUpdate={({
                          collected: nextCollected,
                          totalShards: nextTotal,
                          stepsRemaining: nextSteps,
                          maxSteps: nextMax,
                          completed: nextCompleted,
                          failed: nextFailed,
                          message: nextMessage,
                        }) => {
                          setCollected(nextCollected);
                          setTotalShards(nextTotal);
                          setStepsRemaining(nextSteps);
                          setMaxSteps(nextMax);
                          setCompleted(nextCompleted);
                          setFailed(nextFailed);
                          setMessage(nextMessage);
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-center text-xs text-slate-600 dark:text-slate-400" aria-live="polite">
                      {message}
                    </p>

                    {completed && (
                      <div className="mt-2 rounded-2xl border border-emerald-400/50 bg-emerald-400/15 p-3 text-center shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                          🎉 Xuất sắc vượt qua màn {level}!
                        </span>
                        <button
                          type="button"
                          onClick={nextLevel}
                          className="rounded-full px-4 py-1.5 text-xs font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-95"
                          style={{ background: "var(--gradient-ocean)" }}
                        >
                          Vào Màn {level + 1} ➔
                        </button>
                      </div>
                    )}

                    {failed && (
                      <div className="mt-2 rounded-2xl border border-rose-400/50 bg-rose-400/15 p-3 text-center shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                          ⚡ Hết pin năng lượng!
                        </span>
                        <button
                          type="button"
                          onClick={restartGarden}
                          className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-md transition hover:bg-rose-700 active:scale-95"
                        >
                          Thử Lại Màn {level} ↺
                        </button>
                      </div>
                    )}
                  </div>
                </GameFullscreenWrapper>
              )}

              {selectedGame === "sequence" && (
                <GameFullscreenWrapper onBack={() => setSelectedGame(null)}>
                  <EnergySequenceGame />
                </GameFullscreenWrapper>
              )}

              {selectedGame === "route" && (
                <GameFullscreenWrapper onBack={() => setSelectedGame(null)}>
                  <RouteBuilderGame />
                </GameFullscreenWrapper>
              )}
            </>
          )}
        </section>
      </main>
      {!selectedGame && <Footer />}
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
