"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { GradeLevel } from "../types";
import { GRADE_METAS } from "../mock-data";

interface GradeSelectScreenProps {
  onSelectGrade: (grade: GradeLevel) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onExit?: () => void;
}

export function GradeSelectScreen({
  onSelectGrade,
  soundEnabled,
  onToggleSound,
  onExit,
}: GradeSelectScreenProps) {
  return (
    <div className="relative mx-auto w-full max-w-4xl xl:max-w-5xl px-3 py-6 sm:px-6">
      {/* Top Bar: Back Button (Left) | Title & Subtitle (Center) | Sound Toggle (Right) */}
      <div className="mb-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back Button */}
        <div className="flex shrink-0">
          {onExit ? (
            <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/90 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
            >
              <span>←</span>
              <span>Quay lại</span>
            </button>
          ) : (
            <div className="w-9 sm:w-10" />
          )}
        </div>

        {/* Center: Title & Subtitle pushed up */}
        <div className="flex-1 text-center min-w-0 px-1">
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate"
          >
            Chọn khối lớp
          </motion.h1>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
            Chọn khối lớp để bắt đầu luyện tập
          </p>
        </div>

        {/* Right: Sound Toggle */}
        <div className="flex shrink-0 justify-end">
          {onToggleSound ? (
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-sm shadow-xs transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          ) : (
            <div className="w-9 sm:w-10" />
          )}
        </div>
      </div>

      {/* 5 Grades Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {GRADE_METAS.map((item, idx) => (
          <motion.button
            key={item.grade}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectGrade(item.grade)}
            className="group relative flex flex-col items-center justify-between rounded-3xl border-2 border-emerald-600/20 bg-gradient-to-b from-white via-emerald-50/40 to-emerald-100/30 p-5 text-center shadow-md transition-all hover:border-emerald-500 hover:shadow-xl dark:border-emerald-700/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/40"
          >
            {/* Top Grade Badge */}
            <div className="mb-3 flex w-full items-center justify-between">
              <span className="rounded-xl bg-emerald-600 px-2.5 py-1 text-xs font-black text-white shadow-sm">
                {item.title}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Khối {item.grade}
              </span>
            </div>

            {/* Mascot Image (Growing frog illustration - transparent background) */}
            {item.mascotImage ? (
              <div className="relative my-2 h-36 w-36 transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
                <Image
                  src={item.mascotImage}
                  alt={item.mascotTitle}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 150px, 150px"
                />
              </div>
            ) : (
              <div className="relative my-2 flex h-36 w-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/50 bg-emerald-50/50 p-2 text-center shadow-inner dark:border-emerald-600/40 dark:bg-slate-800/60">
                <span className="text-3xl">🐸</span>
                <span className="mt-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Đang cập nhật
                </span>
              </div>
            )}

            {/* Mascot Info */}
            <div className="mt-3 w-full">
              <p className="text-sm sm:text-base font-black leading-tight text-emerald-950 group-hover:text-emerald-700 dark:text-emerald-100 dark:group-hover:text-emerald-300">
                {item.mascotTitle}
              </p>
            </div>

            {/* Action CTA */}
            <div className="mt-4 w-full rounded-xl bg-emerald-600/10 py-1.5 text-xs font-bold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-400/10 dark:text-emerald-300">
              Khám phá ngay ➔
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
