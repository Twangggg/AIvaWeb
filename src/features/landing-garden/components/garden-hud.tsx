"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  GARDEN_STATIONS,
  GARDEN_SHARDS,
  useGardenStore,
  type GardenStationId,
} from "../store/useGardenStore";
import { VirtualJoystick } from "@/features/public-play/components/playground-3d/virtual-joystick";
import { LandingModePill } from "./landing-mode-pill";
import { gardenSound } from "../audio/garden-soundscape";

// Tokens from framer-motion-aiva skill
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const DUR_FAST = 0.35;

interface GardenHUDProps {
  onOpenJournal?: () => void;
  onOpenPreorder?: () => void;
}

export function GardenHUD({ onOpenJournal }: GardenHUDProps) {
  const {
    nearbyStationId,
    setActiveStationId,
    currentStationIndex,
    setAutoWalkTarget,
    timeOfDay,
    cycleTimeOfDay,
    soundEnabled,
    toggleSound,
    photoMode,
    setPhotoMode,
    collectedShards,
    playerModelType,
    togglePlayerModelType,
  } = useGardenStore();

  const currentStation =
    GARDEN_STATIONS.find((s) => s.id === nearbyStationId) ??
    GARDEN_STATIONS[currentStationIndex] ??
    GARDEN_STATIONS[0];

  const nextStation = GARDEN_STATIONS[currentStation.index + 1] ?? null;

  // In Photo Mode, hide HUD completely to allow clean screenshots
  if (photoMode) return null;

  const timeIcons = {
    day: "☀️ Ngày",
    sunset: "🌅 Hoàng Hôn",
    night: "🌙 Đêm",
  };

  return (
    <>
      {/* Top-Right Toggle Pill (3D / Cuộn) */}
      <LandingModePill />

      {/* Top-Left Action Bar: Station Indicator + Shard Progress + Controls */}
      <div className="fixed top-3.5 left-4 sm:top-4 sm:left-6 z-50 pointer-events-none flex flex-wrap items-center gap-2 max-w-[calc(100vw-140px)]">
        {/* Station Indicator */}
        <div
          className="pointer-events-auto inline-flex min-h-[44px] items-center rounded-full px-4 text-xs font-semibold backdrop-blur-xl shadow-sm"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
        >
          <span className="font-mono text-slate-400 mr-2">{currentStation.number}</span>
          <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
            {currentStation.title}
          </span>
        </div>

        {/* Shards Progress Counter */}
        <button
          type="button"
          onClick={onOpenJournal}
          className="pointer-events-auto inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-xs font-bold backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
          title="Nhấn để xem Sổ Tay Khám Phá"
        >
          <span>🌱</span>
          <span className="font-mono">
            {collectedShards.length}/{GARDEN_SHARDS.length}
          </span>
        </button>

        {/* Time of Day Cycle Button */}
        <button
          type="button"
          onClick={() => {
            gardenSound.enableOnUserInteraction();
            cycleTimeOfDay();
          }}
          className="pointer-events-auto inline-flex min-h-[44px] items-center rounded-full px-3 text-xs font-semibold backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
          title="Chuyển đổi thời gian: Ngày / Hoàng Hôn / Đêm"
        >
          <span>{timeIcons[timeOfDay]}</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={() => {
            gardenSound.enableOnUserInteraction();
            toggleSound();
          }}
          className="pointer-events-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-sm backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>

        {/* Mascot Model Type Toggle Button (Xuôi Tay 2D vs 3D) */}
        <button
          type="button"
          onClick={togglePlayerModelType}
          className="pointer-events-auto inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-xs font-bold backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
          title={
            playerModelType === "arms-down-2d"
              ? "Đang dùng Ếch Xuôi Tay (chuẩn Rig). Nhấn để chuyển sang 3D Mascot"
              : "Đang dùng 3D Mascot. Nhấn để chuyển sang Ếch Xuôi Tay (chuẩn Rig)"
          }
        >
          <span>🐸</span>
          <span>{playerModelType === "arms-down-2d" ? "Xuôi Tay" : "3D"}</span>
        </button>

        {/* Photo Mode Button */}
        <button
          type="button"
          onClick={() => setPhotoMode(true)}
          className="pointer-events-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-sm backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
          title="Chụp ảnh kỷ niệm"
          aria-label="Chụp ảnh kỷ niệm"
        >
          📷
        </button>

        {/* Journal Button */}
        <button
          type="button"
          onClick={onOpenJournal}
          className="pointer-events-auto inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer hidden md:inline-flex"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-on-glass, #0f172a)",
          }}
        >
          📖 Sổ Tay
        </button>
      </div>

      {/* Station Action Prompt */}
      <AnimatePresence>
        {nearbyStationId && (
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
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Chặng {currentStation.number}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentStation.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveStationId(nearbyStationId)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 px-4 text-xs font-bold text-white dark:text-slate-900 hover:opacity-90 active:scale-95 transition-all flex-shrink-0 cursor-pointer shadow-sm"
              >
                Khám phá
                <kbd className="ml-1.5 font-mono text-[10px] opacity-60">E</kbd>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-walk button to next station */}
      {nextStation && !nearbyStationId && (
        <div className="fixed bottom-8 right-4 sm:right-6 z-40 hidden sm:block pointer-events-none">
          <button
            type="button"
            onClick={() => setAutoWalkTarget(nextStation.position)}
            className="pointer-events-auto inline-flex min-h-[44px] items-center rounded-full px-4 text-xs font-semibold backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            Đến {nextStation.title} ➔
          </button>
        </div>
      )}

      {/* Desktop Controls Hint */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-2 text-[11px] text-slate-500 pointer-events-none select-none backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40">
        <span>WASD: Di chuyển</span>
        <span className="opacity-40">•</span>
        <span>Chuột phải + Kéo: Xoay Camera</span>
        <span className="opacity-40">•</span>
        <span>Phím C: Đặt lại góc nhìn</span>
      </div>

      {/* Virtual Joystick for Mobile Touch Controls */}
      <VirtualJoystick />
    </>
  );
}
