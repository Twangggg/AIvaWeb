"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { QuizQuestion, FrogState } from "../types";
import { FROG_REACTION_IMAGES } from "../mock-data";

interface QuizPlayScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  currentCombo: number;
  lastReward?: { points: number; bonus: number; combo: number } | null;
  frogState: FrogState;
  selectedAnswer: number | null;
  isAnswered: boolean;
  elapsedSeconds: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onSelectAnswer: (index: number) => void;
  onExit: () => void;
}

export function QuizPlayScreen({
  question,
  questionIndex,
  totalQuestions,
  score,
  currentCombo,
  lastReward,
  frogState,
  selectedAnswer,
  isAnswered,
  elapsedSeconds,
  soundEnabled,
  onToggleSound,
  onSelectAnswer,
  onExit,
}: QuizPlayScreenProps) {
  // Format elapsed seconds (mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Determine frog image and speech bubble based on state
  let frogImage = FROG_REACTION_IMAGES.idle;
  let frogSpeech = "Cố lên bé ơi, đọc kỹ câu hỏi nhé!";

  if (frogState === "correct") {
    frogImage = FROG_REACTION_IMAGES.correct;
    frogSpeech = currentCombo >= 3
      ? `Tuyệt đỉnh! Chuỗi x${currentCombo} rực cháy rồi! 🔥`
      : "Chính xác rồi! Bé giỏi quá! ⭐";
  } else if (frogState === "wrong") {
    frogImage = FROG_REACTION_IMAGES.wrong;
    frogSpeech = "Tiếc quá, đừng nản lòng nhé! Câu sau sẽ làm tốt hơn! 💚";
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl xl:max-w-4xl px-3 py-4 sm:px-6">
      {/* Top Status Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-600/20 bg-white/90 p-3 shadow-sm dark:border-emerald-700/30 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ✕ Thoát bài
        </button>

        {/* Progress & Stats */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Question Index Badge */}
          <span className="rounded-xl bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Câu {questionIndex + 1}/{totalQuestions}
          </span>

          {/* Timer */}
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {formatTime(elapsedSeconds)}
          </span>

          {/* Score */}
          <span className="rounded-xl bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {score} Điểm
          </span>

          {/* Combo Badge with dynamic spring & glow */}
          {currentCombo > 0 && (
            <motion.span
              key={currentCombo}
              initial={{ scale: 0.75, y: -4 }}
              animate={{ scale: [0.75, 1.25, 1], y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`rounded-xl px-3 py-1 text-xs font-black shadow-md flex items-center gap-1.5 ${
                currentCombo >= 10
                  ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white shadow-orange-500/50 ring-2 ring-amber-300 animate-pulse"
                  : currentCombo >= 5
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/40 ring-1 ring-orange-300"
                  : currentCombo >= 3
                  ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 shadow-amber-400/30"
                  : "bg-emerald-500 text-white shadow-emerald-500/20"
              }`}
            >
              <span className={currentCombo >= 3 ? "animate-bounce" : ""}>
                {currentCombo >= 10 ? "👑" : "🔥"}
              </span>
              <span>Chuỗi x{currentCombo}</span>
            </motion.span>
          )}

          {/* Sound Toggle */}
          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs shadow-xs transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-[#B5EAD7] to-[#2C5E3B]"
          initial={{ width: 0 }}
          animate={{
            width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
        {/* Left Column: Mascot Frog with Reactions */}
        <div className="flex flex-col items-center justify-center md:col-span-5 lg:col-span-4">
          {/* Speech bubble */}
          <motion.div
            key={frogSpeech}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative mb-3 w-full rounded-2xl border-2 border-emerald-600/30 bg-white p-3.5 text-center text-xs font-bold leading-relaxed text-emerald-950 shadow-md dark:border-emerald-700/40 dark:bg-slate-800 dark:text-emerald-100 sm:text-sm"
          >
            {frogSpeech}
            {/* Bubble arrow pointing down */}
            <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-slate-800" />
          </motion.div>

          {/* Frog Mascot Display with dynamic Combo Aura */}
          <div
            className={`relative flex h-52 w-52 flex-col items-center justify-center rounded-3xl p-3 transition-all duration-500 sm:h-56 sm:w-56 md:h-60 md:w-60 ${
              currentCombo >= 5
                ? "border-2 border-orange-500 bg-gradient-to-b from-orange-100/40 via-amber-50/40 to-emerald-100/30 shadow-[0_0_35px_rgba(249,115,22,0.45)] ring-4 ring-orange-400/40 dark:from-slate-800 dark:to-orange-950/40"
                : currentCombo >= 3
                ? "border-2 border-amber-400 bg-gradient-to-b from-amber-100/40 to-emerald-100/30 shadow-[0_0_25px_rgba(251,191,36,0.35)] ring-2 ring-amber-300/40 dark:from-slate-800 dark:to-amber-950/40"
                : currentCombo >= 2
                ? "border-2 border-emerald-500 bg-gradient-to-b from-[#B5EAD7]/30 to-emerald-100/40 shadow-lg ring-2 ring-emerald-400/30 dark:from-slate-800 dark:to-emerald-950/40"
                : "border-2 border-emerald-600/20 bg-gradient-to-b from-[#B5EAD7]/30 to-emerald-100/40 shadow-inner dark:from-slate-800 dark:to-emerald-950/40"
            }`}
          >
            {/* Animated floating sparkle/fire particles when Combo is active */}
            {currentCombo >= 2 && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <motion.span
                  initial={{ opacity: 0, y: 15, x: -10 }}
                  animate={{ opacity: [0, 1, 0], y: [-5, -45], x: [-10, -25] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                  className="absolute bottom-5 left-6 text-base"
                >
                  {currentCombo >= 5 ? "🔥" : "✨"}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 15, x: 10 }}
                  animate={{ opacity: [0, 1, 0], y: [-5, -50], x: [10, 25] }}
                  transition={{ repeat: Infinity, duration: 1.9, delay: 0.4, ease: "easeOut" }}
                  className="absolute bottom-5 right-6 text-base"
                >
                  {currentCombo >= 5 ? "⚡" : "⭐"}
                </motion.span>
                {currentCombo >= 5 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 1, 0], y: [0, -55], scale: [0.8, 1.3, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: 0.7 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 text-lg"
                  >
                    🔥
                  </motion.span>
                )}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={frogState}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{
                  scale: frogState === "correct" ? (currentCombo >= 3 ? [1, 1.15, 1.05] : [1, 1.08, 1]) : 1,
                  opacity: 1,
                  rotate: frogState === "wrong" ? [-4, 4, -4, 0] : 0,
                }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={frogImage}
                  alt={
                    frogState === "correct"
                      ? "Ếch nhắm mắt cười tươi"
                      : frogState === "wrong"
                      ? "Ếch biểu cảm buồn"
                      : "Ếch vui vẻ thân thiện"
                  }
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 220px, 280px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Question Box & 4 Answer Options */}
        <div className="relative flex flex-col md:col-span-7 lg:col-span-8">
          {/* Celebratory Combo Milestone Toast / Banner */}
          <AnimatePresence>
            {isAnswered && frogState === "correct" && currentCombo >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4, y: 15 }}
                animate={{ opacity: 1, scale: [0.4, 1.1, 1], y: -8 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-max max-w-[95%]"
              >
                <div
                  className={`flex items-center gap-2.5 rounded-2xl px-4 py-2 shadow-2xl backdrop-blur-md font-black text-xs sm:text-sm border-2 ${
                    currentCombo >= 10
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white border-amber-300 shadow-purple-500/50"
                      : currentCombo >= 5
                      ? "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white border-yellow-300 shadow-orange-500/50"
                      : currentCombo >= 3
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-200 shadow-amber-500/40"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-200 shadow-emerald-500/40"
                  }`}
                >
                  <span className="text-lg sm:text-xl">
                    {currentCombo >= 10 ? "👑" : currentCombo >= 5 ? "⚡" : "🔥"}
                  </span>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90">
                      {currentCombo >= 10
                        ? "Bất Khả Chiến Bại"
                        : currentCombo >= 5
                        ? "Chuỗi Thần Tốc"
                        : currentCombo >= 3
                        ? "Siêu Chuỗi Thưởng"
                        : "Khởi Đầu Chuỗi"}
                    </span>
                    <span className="text-xs sm:text-sm">
                      COMBO x{currentCombo}!
                      {lastReward?.bonus ? ` (+${lastReward.bonus} điểm thưởng)` : ""}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Prompt Card (Cleaned: redundant 10 điểm + Thưởng Combo removed) */}
          <div className="relative mb-4 overflow-hidden rounded-3xl border-2 border-emerald-600/30 bg-gradient-to-br from-white via-emerald-50/30 to-[#B5EAD7]/20 p-5 shadow-md dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-lg bg-emerald-600/10 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
                {question.typeLabel || `Câu ${questionIndex + 1}`}
              </span>
            </div>

            <h3 className="text-lg font-black leading-snug text-slate-900 sm:text-xl dark:text-white">
              {question.prompt}
            </h3>
          </div>

          {/* 4 Answer Options */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectAnswer = idx === question.correctIndex;

              // Visual styling logic:
              // - Normal state: standard soft emerald/white border
              // - If answered:
              //   - Correct answer becomes GREEN
              //   - Selected wrong answer becomes RED + shake
              let buttonStyle =
                "border-emerald-600/20 bg-white/95 text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700";
              let shakeAnimation = false;

              if (isAnswered) {
                if (isCorrectAnswer) {
                  buttonStyle =
                    "border-emerald-500 bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/30 dark:bg-emerald-600";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle =
                    "border-red-500 bg-red-500 text-white font-black shadow-lg shadow-red-500/30";
                  shakeAnimation = true;
                } else {
                  buttonStyle = "opacity-40 border-slate-200 bg-slate-100 text-slate-400 dark:bg-slate-800/40";
                }
              }

              const labelPrefix = ["A", "B", "C", "D"][idx];

              return (
                <motion.button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => onSelectAnswer(idx)}
                  whileHover={!isAnswered ? { y: -3, scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  animate={
                    shakeAnimation
                      ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`relative flex items-center gap-3.5 rounded-2xl border-2 p-4 text-left text-sm font-bold shadow-sm transition-all sm:text-base ${buttonStyle}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-inner ${
                      isAnswered && isCorrectAnswer
                        ? "bg-white text-emerald-700"
                        : isAnswered && isSelected && !isCorrectAnswer
                        ? "bg-white text-red-700"
                        : "bg-emerald-100 text-emerald-800 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {labelPrefix}
                  </span>
                  <span className="flex-1 leading-snug">{option}</span>

                  {/* Floating Points Pop on Correct Answer */}
                  {isAnswered && isCorrectAnswer && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.4, y: 8 }}
                      animate={{ opacity: 1, scale: [0.4, 1.2, 1], y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="ml-auto rounded-xl bg-white px-2.5 py-1 text-xs font-black text-emerald-700 shadow-sm shrink-0"
                    >
                      +{lastReward?.points || 10}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation reveal when answered (Cleaned: concise label) */}
          <AnimatePresence>
            {isAnswered && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                <span className="font-bold">💡 Giải thích: </span>
                {question.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
