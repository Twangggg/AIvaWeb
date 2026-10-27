"use client";

import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useGardenStore } from "../store/useGardenStore";

export function PhotoModeOverlay() {
  const { photoMode, setPhotoMode, kidName } = useGardenStore();

  if (!photoMode) return null;

  const handleCapture = () => {
    try {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.download = `aiva-garden-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#10b981", "#fbbf24", "#38bdf8", "#ec4899"],
        });
      }
    } catch (e) {
      console.error("Capture failed:", e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-4 sm:p-8">
        {/* Viewfinder Corner Brackets */}
        <div className="absolute inset-4 sm:inset-8 border-2 border-white/40 rounded-3xl pointer-events-none transition-all">
          {/* Top-Left Corner */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
          {/* Top-Right Corner */}
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
          {/* Bottom-Left Corner */}
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
          {/* Bottom-Right Corner */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

          {/* Center Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-8 h-8 border border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Top Header Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="relative z-10 flex items-center justify-between w-full max-w-md mx-auto rounded-full px-5 py-2.5 bg-slate-950/70 backdrop-blur-xl border border-white/20 text-white shadow-xl pointer-events-auto"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📷</span>
            <div>
              <p className="text-xs font-bold leading-none">Chế Độ Chụp Ảnh Kỷ Niệm</p>
              <p className="text-[10px] text-amber-300 font-mono mt-0.5">
                Nhiếp ảnh gia: {kidName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhotoMode(false)}
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Đóng chế độ chụp ảnh"
          >
            ✕
          </button>
        </motion.div>

        {/* Bottom Shutter & Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="relative z-10 flex items-center justify-center gap-4 pointer-events-auto pb-4"
        >
          <button
            type="button"
            onClick={() => setPhotoMode(false)}
            className="px-5 py-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/15 hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            Quay lại vườn
          </button>

          {/* Big Shutter Button */}
          <button
            type="button"
            onClick={handleCapture}
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white text-slate-950 shadow-2xl hover:scale-105 active:scale-90 transition-all cursor-pointer border-4 border-amber-400"
            aria-label="Bấm chụp ảnh"
          >
            <div className="w-11 h-11 rounded-full bg-amber-400 group-hover:bg-amber-300 flex items-center justify-center text-xl shadow-inner transition-colors">
              📸
            </div>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
