"use client";

import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { usePlayModeStore, STATIONS, type StationId } from "../../store/usePlayModeStore";

interface KidDukyModalProps {
  onSelectStation?: (stationId: StationId) => void;
}

export function KidDukyModal({ onSelectStation }: KidDukyModalProps) {
  const { dukyOpen, setDukyOpen, unlockedStamps, kidName, setKidName, addStamp } =
    usePlayModeStore();

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6"],
    });
  };

  return (
    <AnimatePresence>
      {dukyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDukyOpen(false)}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
          />

          {/* Book Wrapper */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/40 bg-[#fbf6ea] text-stone-900 my-auto"
            style={{
              backgroundImage:
                "radial-gradient(rgba(120, 90, 60, 0.08) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          >
            {/* Book Spine Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-3 sm:w-4 bg-gradient-to-r from-amber-800 to-amber-700 shadow-inner z-20" />

            {/* Header / Book Cover Ribbon */}
            <div className="bg-gradient-to-r from-amber-900 via-stone-800 to-amber-900 text-amber-100 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b-2 border-amber-950/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">📖</span>
                <div>
                  <h2 className="text-base sm:text-xl font-black tracking-wide text-amber-200">
                    Sổ Du Ký & Tủ Tem Của Bé
                  </h2>
                  <p className="text-xs text-amber-300/80 font-medium">
                    Lưu giữ những chuyến thám hiểm kỳ thú tại Khu Vui Chơi AIVA
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDukyOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-lg cursor-pointer"
                aria-label="Đóng sổ"
              >
                ✕
              </button>
            </div>

            {/* Book Content */}
            <div className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Kid Name Plate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-100/70 border border-amber-300/60 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-amber-900">Sổ này của nhà thám hiểm:</span>
                  <input
                    type="text"
                    value={kidName}
                    maxLength={20}
                    onChange={(e) => setKidName(e.target.value)}
                    placeholder="Tên của bé"
                    className="font-bold text-emerald-800 bg-white/80 px-3 py-1 rounded-xl border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[180px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600">
                    Đã thu thập: <b>{unlockedStamps.length}</b>/{STATIONS.length} Tem
                  </span>
                  {unlockedStamps.length === STATIONS.length && (
                    <button
                      type="button"
                      onClick={handleCelebrate}
                      className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-stone-900 px-3 py-1 rounded-full shadow transition-transform active:scale-95 cursor-pointer"
                    >
                      🎉 Chúc mừng!
                    </button>
                  )}
                </div>
              </div>

              {/* Stamp Cabinet Grid */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-black text-amber-900/70 mb-3 flex items-center gap-2">
                  <span>🏛️ TỦ TEM THƯỞNG KHU VUI CHƠI</span>
                  <span className="flex-1 h-px bg-amber-900/20" />
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {STATIONS.map((st) => {
                    const isUnlocked = unlockedStamps.includes(st.id);

                    return (
                      <div
                        key={st.id}
                        className={`relative rounded-2xl p-4 flex flex-col justify-between border-2 transition-all ${
                          isUnlocked
                            ? "bg-white/95 border-amber-400/80 shadow-md hover:shadow-lg hover:-translate-y-1"
                            : "bg-stone-200/50 border-dashed border-stone-400/60 opacity-70"
                        }`}
                      >
                        {/* Stamp perforated edge visual effect */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-3xl sm:text-4xl filter drop-shadow-sm">
                            {st.emoji}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isUnlocked
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-stone-300 text-stone-600"
                            }`}
                          >
                            {isUnlocked ? "✓ Đã nhận" : "Khóa"}
                          </span>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-sm font-black text-stone-900 line-clamp-1">
                            {st.title}
                          </h4>
                          <p className="text-[11px] text-stone-600 leading-snug line-clamp-2 mt-0.5">
                            {st.subtitle}
                          </p>
                        </div>

                        {/* Action inside stamp */}
                        <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between gap-1">
                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => {
                                setDukyOpen(false);
                                onSelectStation?.(st.id);
                              }}
                              className="text-xs font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
                            >
                              Chơi lại ➔
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                addStamp(st.id);
                                handleCelebrate();
                              }}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 cursor-pointer"
                            >
                              + Nhận tem
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Letter from Bà / Mascot note */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic">
                “Mỗi bước chân của con qua từng trạm trò chơi là một hành trình ghi dấu sự trưởng thành và học hỏi. Hãy thu thập đủ bộ 6 con tem để trở thành Đại Sứ Thám Hiểm Nhí của AIVA nhé!”
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
