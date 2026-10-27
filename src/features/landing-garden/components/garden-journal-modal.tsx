"use client";

import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  GARDEN_STATIONS,
  GARDEN_SHARDS,
  useGardenStore,
  type GardenStationId,
} from "../store/useGardenStore";
import { gardenSound } from "../audio/garden-soundscape";

interface GardenJournalModalProps {
  open: boolean;
  onClose: () => void;
  onSelectStation?: (stationId: GardenStationId) => void;
}

export function GardenJournalModal({
  open,
  onClose,
  onSelectStation,
}: GardenJournalModalProps) {
  const {
    unlockedStamps,
    collectedShards,
    kidName,
    setKidName,
    setAutoWalkTarget,
  } = useGardenStore();

  const allStampsUnlocked = unlockedStamps.length === GARDEN_STATIONS.length;
  const allShardsCollected = collectedShards.length === GARDEN_SHARDS.length;
  const isMasterExplorer = allStampsUnlocked && allShardsCollected;

  const handleCelebrate = () => {
    gardenSound.playCollectShard();
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#10b981", "#06b6d4", "#f59e0b", "#ec4899", "#8b5cf6", "#fbbf24"],
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
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
            <div className="absolute top-0 bottom-0 left-0 w-3 sm:w-4 bg-gradient-to-r from-emerald-800 to-teal-700 shadow-inner z-20" />

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-emerald-100 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b-2 border-emerald-950/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">📖</span>
                <div>
                  <h2 className="text-base sm:text-xl font-black tracking-wide text-emerald-200">
                    Sổ Du Ký Khu Vườn AIva
                  </h2>
                  <p className="text-xs text-emerald-300/80 font-medium">
                    Hành trình 9 chặng khám phá & 12 Hạt mầm tri thức
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Kid Name & Master Progress Plate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-emerald-950">
                    Nhà thám hiểm nhí:
                  </span>
                  <input
                    type="text"
                    value={kidName}
                    maxLength={20}
                    onChange={(e) => setKidName(e.target.value)}
                    placeholder="Tên của bé"
                    className="font-bold text-emerald-800 bg-white/90 px-3 py-1 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[180px]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-stone-700 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                    🏛️ <b>{unlockedStamps.length}</b>/{GARDEN_STATIONS.length} Tem
                  </span>
                  <span className="text-xs font-semibold text-stone-700 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                    🌱 <b>{collectedShards.length}</b>/{GARDEN_SHARDS.length} Hạt Mầm
                  </span>
                  {isMasterExplorer && (
                    <button
                      type="button"
                      onClick={handleCelebrate}
                      className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-stone-900 px-3 py-1 rounded-full shadow transition-transform active:scale-95 cursor-pointer"
                    >
                      👑 Hiệp Sĩ AIva!
                    </button>
                  )}
                </div>
              </div>

              {/* Master Trophy Banner (When All Collected) */}
              {isMasterExplorer && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-100 border-2 border-amber-400 text-center shadow-md">
                  <div className="text-3xl mb-1">🏆✨🐸</div>
                  <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                    Chứng Chỉ Hiệp Sĩ Khám Phá AIva
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 max-w-lg mx-auto">
                    Chúc mừng <b>{kidName}</b> đã mở khóa trọn vẹn 9 trạm câu chuyện và thu thập đủ 12 hạt mầm tri thức! Bé đã sẵn sàng bước vào tương lai kỳ diệu cùng AIva.
                  </p>
                </div>
              )}

              {/* 12 Shards Progress Row */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-black text-emerald-900/70 mb-3 flex items-center gap-2">
                  <span>🌱 12 HẠT MẦM TRI THỨC ĐÃ THU THẬP</span>
                  <span className="flex-1 h-px bg-emerald-900/20" />
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                  {GARDEN_SHARDS.map((shard) => {
                    const isCollected = collectedShards.includes(shard.id);
                    return (
                      <div
                        key={shard.id}
                        className={`rounded-xl p-2.5 flex flex-col items-center text-center border transition-all ${
                          isCollected
                            ? "bg-white/95 border-emerald-400 shadow-sm"
                            : "bg-stone-200/40 border-stone-300 opacity-55"
                        }`}
                      >
                        <span
                          className={`text-xl transition-transform ${
                            isCollected ? "scale-110 drop-shadow" : "grayscale"
                          }`}
                        >
                          {isCollected ? "💎" : "🔒"}
                        </span>
                        <p className="text-[10px] font-bold text-stone-800 truncate w-full mt-1">
                          {shard.name}
                        </p>
                        <p className="text-[9px] text-stone-500 truncate w-full">
                          {isCollected ? "✓ Đã nhặt" : shard.stationHint}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 9 Stamps Grid */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-black text-emerald-900/70 mb-3 flex items-center gap-2">
                  <span>🏛️ BỘ SƯU TẬP 9 TEM KHU VƯỜN</span>
                  <span className="flex-1 h-px bg-emerald-900/20" />
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {GARDEN_STATIONS.map((st) => {
                    const isUnlocked = unlockedStamps.includes(st.id);

                    return (
                      <div
                        key={st.id}
                        className={`relative rounded-2xl p-4 flex flex-col justify-between border-2 transition-all ${
                          isUnlocked
                            ? "bg-white/95 border-emerald-400/80 shadow-md hover:shadow-lg hover:-translate-y-1"
                            : "bg-stone-200/50 border-dashed border-stone-400/60 opacity-70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-3xl filter drop-shadow-sm">
                            {st.emoji}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isUnlocked
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-stone-300 text-stone-600"
                            }`}
                          >
                            {isUnlocked ? "✓ Đã nhận" : `Chặng ${st.number}`}
                          </span>
                        </div>

                        <div className="mt-2.5">
                          <h4 className="text-xs sm:text-sm font-black text-stone-900 line-clamp-1">
                            {st.title}
                          </h4>
                          <p className="text-[11px] text-stone-600 leading-snug line-clamp-2 mt-0.5">
                            {st.tagline}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              setAutoWalkTarget(st.position);
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                          >
                            Đi tới trạm này ➔
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
