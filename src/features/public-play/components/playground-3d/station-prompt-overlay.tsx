"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePlayModeStore, STATIONS, type StationId } from "../../store/usePlayModeStore";

// Tokens from framer-motion-aiva skill
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const DUR_FAST = 0.35;

interface StationPromptOverlayProps {
  onInteractStation: (stationId: StationId) => void;
}

export function StationPromptOverlay({ onInteractStation }: StationPromptOverlayProps) {
  const { nearbyStation } = usePlayModeStore();

  const station = STATIONS.find((s) => s.id === nearbyStation);

  return (
    <AnimatePresence>
      {station && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: DUR_FAST, ease: EASE_OUT_EXPO }}
          className="fixed bottom-8 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto flex items-center justify-between gap-4 rounded-2xl p-3.5 shadow-lg backdrop-blur-xl max-w-sm w-full"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {station.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {station.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onInteractStation(station.id)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 px-4 text-xs font-bold text-white dark:text-slate-900 hover:opacity-90 active:scale-95 transition-all flex-shrink-0 cursor-pointer shadow-sm"
            >
              Chơi ngay
              <kbd className="ml-1.5 font-mono text-[10px] opacity-60">
                E
              </kbd>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
