"use client";

import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  GARDEN_STATIONS,
  useGardenStore,
  type GardenStationId,
} from "../store/useGardenStore";
import Link from "next/link";

interface GardenStationModalProps {
  onOpenPreorder?: () => void;
}

export function GardenStationModal({ onOpenPreorder }: GardenStationModalProps) {
  const {
    activeStationId,
    setActiveStationId,
    addStamp,
    unlockedStamps,
    setAutoWalkTarget,
  } = useGardenStore();

  const station = GARDEN_STATIONS.find((s) => s.id === activeStationId);
  if (!station) return null;

  const isStamped = unlockedStamps.includes(station.id);
  const nextStation = GARDEN_STATIONS[station.index + 1] ?? null;

  const handleCollectStamp = () => {
    addStamp(station.id);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: [station.themeColor, "#fbbf24", "#34d399", "#f43f5e"],
    });
  };

  const handleGoNext = () => {
    if (nextStation) {
      setActiveStationId(null);
      setAutoWalkTarget(nextStation.position);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveStationId(null)}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/30 bg-[#fbf6ea] text-stone-900 my-auto"
          style={{
            backgroundImage:
              "radial-gradient(rgba(120, 90, 60, 0.08) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        >
          {/* Header Bar */}
          <div
            className="px-6 py-4 flex items-center justify-between text-white"
            style={{ backgroundColor: station.themeColor }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{station.emoji}</span>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest opacity-80 block">
                  CHẶNG {station.number} / 09 · KHU VƯỜN KHÁM PHÁ
                </span>
                <h2 className="text-base sm:text-xl font-black leading-tight">
                  {station.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveStationId(null)}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Tagline & Story */}
            <div>
              <p className="text-sm sm:text-base font-bold text-amber-900 mb-2">
                “{station.tagline}”
              </p>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {station.storyDescription}
              </p>
            </div>

            {/* Station-specific interactive preview */}
            {station.id === "gate" && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-2">
                <p className="font-bold">🌟 Điểm đến đầu tiên của hành trình:</p>
                <p className="text-xs text-emerald-800">
                  Hãy cùng chú ếch Avia bước qua các chặng kế tiếp trên con đường lát đá để khám phá bí mật của chiếc kính thần kỳ nhé!
                </p>
              </div>
            )}

            {station.id === "glasses" && (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs">
                <div className="p-2.5 rounded-xl bg-white/80">
                  <span className="font-bold text-cyan-900 block">🪶 Siêu Nhẹ 32g</span>
                  <span className="text-cyan-800 text-[11px]">Bé đeo cả ngày êm ái, không đè sống mũi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80">
                  <span className="font-bold text-cyan-900 block">🔊 Loa Định Hướng</span>
                  <span className="text-cyan-800 text-[11px]">Âm thanh trong trẻo, không hại màng nhĩ</span>
                </div>
              </div>
            )}

            {station.id === "vision" && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                <p className="font-bold">📸 Khám phá thế giới qua lăng kính AI:</p>
                <p className="text-xs text-amber-800">
                  “Tại sao lá cây màu xanh?”, “Chú chim này tên là gì?” — AIva nhận diện thị giác thời gian thực và trả lời bé như một người bạn tri thức!
                </p>
              </div>
            )}

            {station.id === "features" && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-2">
                <p className="font-bold">📚 Gia sư học tập & Trò chuyện:</p>
                <p className="text-xs text-purple-800">
                  Đồng hành cùng bé ôn luyện Toán, Tiếng Việt, Tiếng Anh theo chuẩn SGK, giải thích dễ hiểu từng bước không làm hộ bài.
                </p>
              </div>
            )}

            {station.id === "safety" && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-2">
                <p className="font-bold">🛡️ An toàn tuyệt đối cho mắt:</p>
                <p className="text-xs text-teal-800">
                  Thay vì dán mắt vào màn hình phát ánh sáng xanh gây cận thị, kính AIva mở rộng tầm nhìn thực tế, khuyến khích bé ngắm nhìn thiên nhiên.
                </p>
              </div>
            )}

            {station.id === "parent" && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-2">
                <p className="font-bold">📱 Đồng hành cùng cha mẹ:</p>
                <p className="text-xs text-orange-800">
                  Báo cáo tổng kết mỗi tối gửi về điện thoại bố mẹ: Bé đã hỏi những gì, quan tâm chủ đề nào, và thời gian hoạt động trong ngày.
                </p>
              </div>
            )}

            {station.id === "colors" && (
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-pink-950 space-y-3">
                <p className="font-bold">🎨 3 Phiên bản màu sắc cá tính:</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">Xanh Bạc Hà</span>
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 font-bold border border-pink-300">Hồng Pastel</span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">Vàng Bơ</span>
                </div>
              </div>
            )}

            {station.id === "minigames" && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-3">
                <p className="font-bold">🎮 Đấu trí minigames trí tuệ:</p>
                <Link
                  href="/play"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  <span>Mở Khu Vui Chơi Game</span>
                  <span>➔</span>
                </Link>
              </div>
            )}

            {station.id === "preorder" && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-3">
                <p className="font-bold">🎁 Ưu đãi độc quyền cho 500 gia đình đầu tiên:</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStationId(null);
                    onOpenPreorder?.();
                  }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  🚀 Đặt Trước Nhận Quà Ngay
                </button>
              </div>
            )}

            {/* Stamp & Next buttons */}
            <div className="pt-4 border-t border-stone-300/80 flex flex-wrap items-center justify-between gap-3">
              {/* Stamp button */}
              <button
                type="button"
                onClick={handleCollectStamp}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  isStamped
                    ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                    : "bg-white text-stone-900 border-stone-300 hover:bg-stone-100"
                }`}
              >
                <span>{isStamped ? "✓ Đã dán tem trạm này" : "🔖 Dán tem vào Sổ Du Ký"}</span>
              </button>

              {/* Next Station Auto-walk */}
              {nextStation && (
                <button
                  type="button"
                  onClick={handleGoNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Đi tiếp tới {nextStation.title}</span>
                  <span>➔</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
