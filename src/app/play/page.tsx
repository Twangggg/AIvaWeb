"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Footer } from "@/components/common/footer";
import { FamilyGreeting } from "@/components/common/family-greeting";
import { Nav } from "@/components/common/nav";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { AivaGardenGame } from "@/features/public-play/components/aiva-garden-game";
import { AivaVisionQuestGame } from "@/features/public-play/components/aiva-vision-quest-game";
import { EnergySequenceGame } from "@/features/public-play/components/energy-sequence-game";
import { RouteBuilderGame } from "@/features/public-play/components/route-builder-game";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { AviaQuizGame } from "@/features/avia-quiz/avia-quiz-game";

import {
  GameFullscreenWrapper,
  GameHeaderBar,
} from "@/features/public-play/components/game-fullscreen-wrapper";

type GameId = "avia-quiz" | "vision-quest" | "garden" | "sequence" | "route";

interface GameItem {
  id: GameId;
  title: string;
  description: string;
  accent: string;
  borderGlow: string;
  image: string;
}

const GAMES: GameItem[] = [
  {
    id: "avia-quiz",
    title: "Avia Quiz Game 🐸",
    description:
      "Cùng Ếch Avia vượt mốc bài học SGK Lớp 1 - 5, bứt phá chuỗi combo đúng rực lửa và chinh phục các huy hiệu danh giá!",
    accent: "border-emerald-400/60 hover:bg-emerald-400/10",
    borderGlow: "border-emerald-400/50 hover:border-emerald-400 hover:shadow-emerald-500/20",
    image: "/MASCOT ko nền.png",
  },
  {
    id: "vision-quest",
    title: "AIVA Vision Quest",
    description:
      "Dùng ống kính AI quét và nhận diện đồ vật quanh bé, tích lũy điểm nhận Bằng Khám Phá Nhí.",
    accent: "border-amber-400/50 hover:bg-amber-400/10",
    borderGlow: "border-amber-400/50 hover:border-amber-400 hover:shadow-amber-500/20",
    image: "/games/robot-portal.webp",
  },
  {
    id: "garden",
    title: "Giải cứu khu vườn",
    description:
      "Né bọ tuần tra, gỡ bẫy thông minh, nhặt đủ mảnh năng lượng và mở cánh cổng bí mật.",
    accent: "border-emerald-300/50 hover:bg-emerald-300/10",
    borderGlow: "border-emerald-400/40 hover:border-emerald-400 hover:shadow-emerald-500/20",
    image: "/games/garden-maze.webp",
  },
  {
    id: "sequence",
    title: "Mật mã năng lượng",
    description:
      "Quan sát và ghi nhớ chuỗi ánh sáng quang học ngày một dài hơn để mở khóa mật mã.",
    accent: "border-fuchsia-300/50 hover:bg-fuchsia-300/10",
    borderGlow: "border-fuchsia-400/40 hover:border-fuchsia-400 hover:shadow-fuchsia-500/20",
    image: "/games/energy-code.webp",
  },
  {
    id: "route",
    title: "Kỹ sư đường đi",
    description:
      "Kéo thả và sắp xếp các khối lệnh điều hướng để dẫn AIVA vượt qua mọi chướng ngại.",
    accent: "border-cyan-300/50 hover:bg-cyan-300/10",
    borderGlow: "border-cyan-400/40 hover:border-cyan-400 hover:shadow-cyan-500/20",
    image: "/games/route-builder.webp",
  },
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
  const [hearts, setHearts] = useState(3);
  const [maxHearts, setMaxHearts] = useState(3);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState(
    "Chạm vào ô cỏ hoặc dùng phím điều hướng để di chuyển."
  );

  useEffect(
    () => () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
    []
  );

  useEffect(() => {
    if (selectedGame) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedGame]);

  const restartGarden = () => {
    setRound((value) => value + 1);
    setCollected(0);
    setHearts(3);
    setCompleted(false);
    setFailed(false);
    setMessage("Chạm vào ô cỏ hoặc dùng phím điều hướng để di chuyển.");
  };

  const openGame = (game: GameId) => {
    if (game === "garden") {
      setLevel(1);
      restartGarden();
    }
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const selectGardenLevel = (lvl: number) => {
    setLevel(lvl);
    setRound((value) => value + 1);
    setCollected(0);
    setHearts(3);
    setCompleted(false);
    setFailed(false);
  };

  const nextLevel = () => {
    setLevel((value) => Math.min(5, value + 1));
    restartGarden();
  };

  const heroGame = GAMES[0];
  const companionGames = GAMES.slice(1);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main
        className={`ui-page min-h-screen overflow-x-hidden px-3 sm:px-6 ${selectedGame ? "pt-24 sm:pt-28 lg:pt-32 pb-8" : "family-page pt-24 sm:pt-28 pb-12"}`}
      >
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-[100px]" />
        <section className={`relative mx-auto ${selectedGame ? "max-w-5xl" : "max-w-6xl play-lobby"}`}>
          {!selectedGame ? (
            <>
              <FamilyGreeting topic="play" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-fr">
                  {/* Hero Card: Avia Quiz Game (Spans 2 cols x 2 rows on desktop) */}
                  <motion.button
                    key={heroGame.id}
                    type="button"
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    onClick={() => openGame(heroGame.id)}
                    className="group relative sm:col-span-2 lg:col-span-2 lg:row-span-2 ui-surface ui-border rounded-[2.25rem] border p-6 sm:p-7 text-left shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between border-emerald-400/50 hover:border-emerald-400 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-amber-500/[0.05] dark:from-emerald-950/40 dark:to-slate-900/40"
                  >
                    {/* Decorative ambient glows */}
                    <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl group-hover:bg-emerald-400/30 transition-all duration-500" />
                    <div className="pointer-events-none absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl group-hover:bg-amber-400/25 transition-all duration-500" />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Top content & Mascot */}
                      <div className="flex flex-col sm:flex-row lg:flex-col justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            {heroGame.title}
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                            {heroGame.description}
                          </p>
                        </div>

                        {/* Mascot Showcase Illustration */}
                        <div className="relative shrink-0 flex items-center justify-center self-center my-2 sm:my-0 lg:my-3">
                          <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/25 to-amber-300/20 blur-2xl scale-95" />
                            <Image
                              src={heroGame.image}
                              alt={heroGame.title}
                              fill
                              unoptimized
                              sizes="(min-width: 1024px) 30vw, 50vw"
                              className="object-contain object-center drop-shadow-xl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTA Bar */}
                      <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <span>Thử thách cùng Ếch Avia</span>
                          <span className="inline-block transform group-hover:translate-x-1.5 transition-transform">
                            ➔
                          </span>
                        </div>
                        <span
                          className="rounded-full px-5 py-2 text-xs font-black text-slate-950 shadow-md group-hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                          style={{ background: "var(--gradient-ocean)" }}
                        >
                          Chơi Ngay 🎮
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  {/* The 4 Companion Cards (Filled 2x2 on desktop) */}
                  {companionGames.map((game) => (
                    <motion.button
                      key={game.id}
                      type="button"
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      onClick={() => openGame(game.id)}
                      className={`group relative lg:col-span-1 ui-surface ui-border rounded-[2rem] border p-4 sm:p-5 text-left shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${game.borderGlow} ${game.accent}`}
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="ui-surface-soft relative mb-3 h-32 sm:h-36 overflow-hidden rounded-2xl group-hover:scale-[1.02] transition-transform duration-300">
                          <Image
                            src={game.image}
                            alt={game.title}
                            fill
                            unoptimized
                            sizes="(min-width: 1024px) 20vw, 50vw"
                            className="object-contain object-center p-2"
                          />
                        </div>

                        {/* Title & Desc */}
                        <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          {game.title}
                        </p>
                        <p className="ui-muted mt-1 text-xs leading-relaxed line-clamp-2">
                          {game.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                        <span className="ui-accent text-xs font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Chơi ngay ➔
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
            </>
          ) : (
            <>
              {selectedGame === "avia-quiz" && (
                <GameFullscreenWrapper onBack={() => setSelectedGame(null)}>
                  <AviaQuizGame onBackToLobby={() => setSelectedGame(null)} />
                </GameFullscreenWrapper>
              )}

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
                          {
                            id: 4,
                            label: "Màn 4 🌙",
                            desc: "Màn đêm sương mù",
                          },
                          {
                            id: 5,
                            label: "Màn 5 🔥",
                            desc: "Ác mộng siêu cấp",
                          },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => selectGardenLevel(lvl.id)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                              level === lvl.id
                                ? "bg-amber-400 text-black shadow-sm font-black ring-2 ring-amber-400/50"
                                : "bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                            }`}
                            title={lvl.desc}
                          >
                            <span>{lvl.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-full">
                      <AivaGardenGame
                        round={round}
                        level={level}
                        onUpdate={({
                          collected: nextCollected,
                          totalShards: nextTotal,
                          stepsRemaining: nextSteps,
                          maxSteps: nextMax,
                          hearts: nextHearts,
                          maxHearts: nextMaxHearts,
                          completed: nextCompleted,
                          failed: nextFailed,
                          message: nextMessage,
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
                                particleCount: 90,
                                spread: 75,
                                origin: { y: 0.6 },
                                colors: ["#10b981", "#38bdf8", "#fbbf24", "#f43f5e", "#a855f7"],
                              });
                            } catch {}
                          }
                          setCompleted(nextCompleted);
                          setFailed(nextFailed);
                          setMessage(nextMessage);
                        }}
                      />
                    </div>
                    <p
                      className="mt-1.5 text-center text-xs text-slate-600 dark:text-slate-400"
                      aria-live="polite"
                    >
                      {message}
                    </p>

                    {completed && (
                      <div className="mt-2 rounded-2xl border border-emerald-400/50 bg-emerald-400/15 p-3.5 text-center shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-2.5 text-left">
                          <div className="w-12 h-12 shrink-0">
                            <Image
                              src="/mascots/frog-success.webp"
                              alt="Chiến thắng"
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                              🎉 Xuất sắc vượt qua Màn {level}!
                            </p>
                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                              Bé và AIva đã giải cứu thành công khu vườn!
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={nextLevel}
                          className="rounded-full px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-95 whitespace-nowrap"
                          style={{ background: "var(--gradient-ocean)" }}
                        >
                          Vào Màn {Math.min(5, level + 1)} ➔
                        </button>
                      </div>
                    )}

                    {failed && (
                      <div className="mt-2 rounded-2xl border border-rose-400/50 bg-rose-400/15 p-3.5 text-center shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-2.5 text-left">
                          <div className="w-12 h-12 shrink-0">
                            <Image
                              src="/mascots/frog-thinking.webp"
                              alt="Thử lại"
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-rose-800 dark:text-rose-300">
                              💥 AIVA chưa thể vượt qua thử thách!
                            </p>
                            <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
                              Đừng nản lòng nhé, cùng thử lại một lần nữa nào!
                            </p>
                          </div>
                        </div>
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
      <PreorderModal
        open={preorderOpen}
        onClose={() => setPreorderOpen(false)}
      />
    </>
  );
}
