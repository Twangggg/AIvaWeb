"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { QuizScoreSummary } from "../types";

interface QuizResultScreenProps {
  summary: QuizScoreSummary;
  nextLessonTitle?: string | null;
  onNextLesson?: () => void;
  onRestart: () => void;
  onChooseOtherLesson: () => void;
}

export function QuizResultScreen({
  summary,
  nextLessonTitle,
  onNextLesson,
  onRestart,
  onChooseOtherLesson,
}: QuizResultScreenProps) {
  const percentCorrect = Math.round(
    (summary.correctAnswers / summary.totalQuestions) * 100
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} phút ${s < 10 ? "0" : ""}${s} giây`;
  };

  return (
    <div className="relative mx-auto w-full max-w-xl xl:max-w-2xl px-4 py-8">
      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`relative overflow-hidden rounded-3xl border-2 p-6 text-center shadow-2xl transition-all sm:p-8 ${
          summary.isPerfect
            ? "border-amber-400 bg-gradient-to-b from-amber-50 via-white to-orange-50/70 shadow-amber-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40"
            : "border-emerald-600/30 bg-white/95 dark:border-emerald-700/40 dark:bg-slate-900"
        }`}
      >
        {/* Perfect 100% Fire Glow Effect */}
        {summary.isPerfect && (
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-400/40 to-red-500/0 blur-2xl" />
        )}

        {/* Mascot Celebration */}
        <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="relative h-full w-full"
          >
            <Image
              src={summary.isPerfect ? "/mascots/ech-cuoi-tuoi.png" : "/mascots/ech-vui-ve.png"}
              alt="Avia Mascot Celebration"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 150px, 150px"
              priority
            />
          </motion.div>
        </div>

        {/* Praise Banner (Theo chuẩn GDD) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2"
        >
          <span
            className={`inline-block rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
              summary.isPerfect
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {summary.isPerfect ? "HOÀN HẢO 100%" : "HOÀN THÀNH BÀI HỌC"}
          </span>

          <h2
            className={`mt-2 text-2xl font-black sm:text-3xl ${
              summary.isPerfect
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-900 dark:text-white"
            }`}
          >
            “{summary.praise}”
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {summary.bookTitle} • {summary.lessonTitle}
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Metric 1: % Correct */}
          <div
            className={`rounded-2xl border p-3 ${
              summary.isPerfect
                ? "border-amber-400/80 bg-amber-50/80 dark:border-amber-500/50 dark:bg-amber-950/40"
                : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60"
            }`}
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Đúng / Tổng
            </span>
            <p
              className={`text-xl font-black ${
                summary.isPerfect
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {summary.correctAnswers}/{summary.totalQuestions}
            </p>
            <span className="text-[11px] font-semibold text-slate-500">
              ({percentCorrect}%)
            </span>
          </div>

          {/* Metric 2: Max Combo Streak (Highlighted with Fire if 100%) */}
          <div
            className={`rounded-2xl border p-3 ${
              summary.isPerfect || summary.maxCombo >= 3
                ? "border-orange-400/80 bg-gradient-to-br from-orange-50 to-amber-100/60 shadow-md shadow-orange-500/10 dark:border-orange-500/50 dark:from-orange-950/40 dark:to-amber-950/30"
                : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60"
            }`}
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Chuỗi Kỷ Lục
            </span>
            <p className="text-xl font-black text-orange-600 dark:text-orange-400">
              x{summary.maxCombo}
            </p>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
              Chuỗi
            </span>
          </div>

          {/* Metric 3: Total Score */}
          <div
            className={`rounded-2xl border p-3 ${
              summary.isPerfect
                ? "border-amber-400/80 bg-amber-50/80 dark:border-amber-500/50 dark:bg-amber-950/40"
                : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60"
            }`}
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Tổng Điểm
            </span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">
              {summary.score}
            </p>
            <span className="text-[11px] font-semibold text-slate-500">
              Điểm thưởng
            </span>
          </div>

          {/* Metric 4: Elapsed Time */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Thời Gian
            </span>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">
              {summary.elapsedSeconds}s
            </p>
            <span className="text-[11px] font-semibold text-slate-500">
              {formatTime(summary.elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          {onNextLesson && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextLesson}
              className="group relative flex w-full items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] px-5 sm:px-6 py-3.5 text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-right hover:shadow-orange-500/40 active:scale-95 cursor-pointer text-left"
            >
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-100/95">
                  Bài học tiếp theo
                </span>
                <span className="text-sm sm:text-base md:text-lg font-black text-white truncate w-full mt-0.5 drop-shadow-xs">
                  {nextLessonTitle || "Tiếp tục bài mới"}
                </span>
              </div>
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs text-white shadow-inner group-hover:bg-white group-hover:text-orange-600 transition-colors">
                <span className="text-lg sm:text-xl font-black transform group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </div>
            </motion.button>
          )}

          {!onNextLesson && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/80 dark:border-amber-700/60 dark:bg-amber-950/30 p-3 text-center">
              <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-200">
                Bé đã hoàn thành tất cả các bài học trong sách này! Xuất sắc!
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-700 active:scale-95 cursor-pointer"
            >
              Chơi lại bài này
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onChooseOtherLesson}
              className="flex-1 rounded-2xl border-2 border-emerald-600/30 bg-white py-3 text-sm font-black text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-95 dark:border-emerald-700 dark:bg-slate-800 dark:text-emerald-200 cursor-pointer"
            >
              Danh sách bài học
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
