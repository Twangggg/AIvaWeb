"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Footer } from "@/components/common/footer";
import { FamilyGreeting } from "@/components/common/family-greeting";
import { Nav } from "@/components/common/nav";
import { motion } from "motion/react";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { PlayModeSwitcher } from "@/features/public-play/components/play-mode-switcher";
import { KidDukyModal } from "@/features/public-play/components/duky/kid-duky-modal";
import {
  IS_PLAY_3D_ENABLED,
  usePlayModeStore,
  type StationId,
} from "@/features/public-play/store/usePlayModeStore";
import {
  GAMES,
  type GameId,
} from "@/features/public-play/games-data";

// Dynamically import 3D Canvas to prevent SSR WebGL issues
const PlaygroundCanvas = dynamic(
  () =>
    import(
      "@/features/public-play/components/playground-3d/playground-canvas"
    ).then((m) => m.PlaygroundCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-sky-200 to-emerald-100 text-stone-800">
        <div className="text-4xl animate-bounce">🎡</div>
        <p className="mt-4 font-bold text-base text-emerald-900">
          Đang mở cổng Khu Vui Chơi 3D…
        </p>
      </div>
    ),
  }
);

export default function PublicPlayPage() {
  const router = useRouter();
  const {
    mode,
    isHydrated,
    hydrateFromStorage,
    setDukyOpen,
    addStamp,
    unlockedStamps,
  } = usePlayModeStore();
  const [preorderOpen, setPreorderOpen] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const is3DActive = IS_PLAY_3D_ENABLED && isHydrated && mode === "3d";

  // Manage body scroll based on 3D mode vs Scroll mode
  useEffect(() => {
    if (is3DActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [is3DActive]);

  const openGame = (game: GameId) => {
    addStamp(game);
    router.push(`/play/${game}`);
  };

  const handleInteractStation = (stationId: StationId) => {
    if (stationId === "du-ky") {
      setDukyOpen(true);
    } else {
      openGame(stationId as GameId);
    }
  };

  const heroGame = GAMES[0];
  const companionGames = GAMES.slice(1);

  return (
    <>
      {/* Floating Switcher & Kid's Notebook Modal */}
      <PlayModeSwitcher />
      <KidDukyModal onSelectStation={handleInteractStation} />

      {/* MODE 1: 3D PLAYGROUND (Disabled while under development) */}
      {is3DActive ? (
        <main className="fixed inset-0 h-screen w-screen overflow-hidden">
          <PlaygroundCanvas onInteractStation={handleInteractStation} />
        </main>
      ) : (
        /* MODE 2: SCROLL VIEW (Traditional smooth scrolling page) */
        <>
          <Nav onPreorder={() => setPreorderOpen(true)} />
          <main className="ui-page min-h-screen overflow-x-hidden px-3 sm:px-6 family-page pt-24 sm:pt-28 pb-12">
            <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-[100px]" />
            <section className="relative mx-auto max-w-6xl play-lobby space-y-6">
              <FamilyGreeting topic="play" />

              {/* Maintenance & Development Notice Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border border-amber-500/25 text-stone-800 dark:text-stone-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛠️</span>
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      Khu Vui Chơi 3D đang được đóng để nâng cấp &amp; phát triển
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                      AIVA đang hoàn thiện không gian 3D tương tác. Bé và gia đình hãy cùng khám phá các trò chơi học tập bên dưới!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDukyOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-600/30 bg-white dark:bg-stone-900 px-3.5 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 shadow-sm transition hover:bg-amber-50 dark:hover:bg-stone-800 active:scale-95 shrink-0 cursor-pointer"
                >
                  <span>📖</span>
                  <span>Sổ Du Ký &amp; Tem ({unlockedStamps.length}/6)</span>
                </button>
              </div>

              {/* Game Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-fr">
                {/* Hero Card: Avia Quiz */}
                <motion.button
                  key={heroGame.id}
                  type="button"
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  onClick={() => openGame(heroGame.id)}
                  className="group relative sm:col-span-2 lg:col-span-2 lg:row-span-2 ui-surface ui-border rounded-[2.25rem] border p-6 sm:p-7 text-left shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between border-emerald-400/50 hover:border-emerald-400 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-amber-500/[0.05] dark:from-emerald-950/40 dark:to-slate-900/40"
                >
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        {heroGame.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                        {heroGame.description}
                      </p>
                    </div>

                    <div className="relative flex flex-1 items-center justify-center my-3 sm:my-4 w-full">
                      <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[420px] xl:max-w-[460px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 group-hover:scale-[1.03] transition-transform duration-500">
                        <Image
                          src={heroGame.image}
                          alt={heroGame.title}
                          fill
                          priority
                          sizes="(min-width: 1280px) 480px, (min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>

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

                {/* Companion Game Cards */}
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

                      <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {game.title}
                      </p>
                      <p className="ui-muted mt-1 text-xs leading-relaxed line-clamp-2">
                        {game.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                      <span className="ui-accent text-xs font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Chơi ngay ➔
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}

      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
