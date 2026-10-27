"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { usePlayModeStore } from "../store/usePlayModeStore";

// Tokens from framer-motion-aiva skill
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const DUR_FAST = 0.35;

const emptySubscribe = () => () => {};

export function PlayModeSwitcher() {
  const { mode, setMode, hydrateFromStorage } = usePlayModeStore();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const is3D = mode === "3d";

  // Before hydration, render with deterministic SSR state without animation mismatch
  return (
    <div className="fixed top-3.5 right-4 sm:top-4 sm:right-6 z-50 pointer-events-none">
      <div
        role="group"
        aria-label="Chế độ hiển thị trò chơi"
        className="pointer-events-auto inline-flex items-center rounded-full p-1 shadow-sm backdrop-blur-xl transition-colors"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div className="relative flex items-center rounded-full p-0.5 bg-black/[0.04] dark:bg-white/[0.06]">
          {/* 3D Option - Minimum 44px touch target */}
          <button
            type="button"
            onClick={() => setMode("3d")}
            aria-pressed={is3D}
            className={`relative flex min-h-[44px] min-w-[54px] items-center justify-center rounded-full px-3.5 text-xs font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
              is3D
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {is3D && (
              <motion.div
                layoutId={mounted ? "play-mode-pill-active" : undefined}
                className="absolute inset-0 rounded-full bg-white dark:bg-slate-800 shadow-sm"
                transition={{ duration: DUR_FAST, ease: EASE_OUT_EXPO }}
              />
            )}
            <span className="relative z-10">3D</span>
          </button>

          {/* Scroll Option - Minimum 44px touch target */}
          <button
            type="button"
            onClick={() => setMode("scroll")}
            aria-pressed={!is3D}
            className={`relative flex min-h-[44px] min-w-[54px] items-center justify-center rounded-full px-3.5 text-xs font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
              !is3D
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {!is3D && (
              <motion.div
                layoutId={mounted ? "play-mode-pill-active" : undefined}
                className="absolute inset-0 rounded-full bg-white dark:bg-slate-800 shadow-sm"
                transition={{ duration: DUR_FAST, ease: EASE_OUT_EXPO }}
              />
            )}
            <span className="relative z-10">Cuộn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
