"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { QuizBook, GradeLevel } from "../types";
import { GRADE_METAS } from "../mock-data";

interface BookSelectScreenProps {
  grade: GradeLevel;
  books: QuizBook[];
  isLoadingBook?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onSelectBook: (book: QuizBook) => void;
  onBack: () => void;
}

export function BookSelectScreen({
  grade,
  books,
  isLoadingBook,
  soundEnabled,
  onToggleSound,
  onSelectBook,
  onBack,
}: BookSelectScreenProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const gradeMeta = GRADE_METAS.find((g) => g.grade === grade);

  return (
    <div className="relative mx-auto w-full max-w-3xl xl:max-w-4xl px-3 py-6 sm:px-6">
      {/* Top Bar: Back Button (Left) | Title & Subtitle (Center) | Sound Toggle (Right) */}
      <div className="mb-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back Button */}
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/90 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
          >
            <span>←</span>
            <span>Chọn lại Lớp</span>
          </button>
        </div>

        {/* Center: Title & Subtitle pushed up */}
        <div className="flex-1 text-center min-w-0 px-1">
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate">
            Chọn môn học
          </h2>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
            Chọn môn học để bắt đầu luyện tập
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

      {/* Books Grid or Empty State */}
      {books.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
          <span className="text-4xl">📖</span>
          <p className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">
            Chưa có danh sách môn học cho {gradeMeta?.title}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dữ liệu môn học đang được cập nhật.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {books.map((book, idx) => (
            <motion.button
              key={book.id}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setLoadingId(book.id);
                onSelectBook(book);
              }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-emerald-600/30 bg-gradient-to-br from-emerald-50 via-white to-[#B5EAD7]/30 p-6 text-left shadow-lg transition-all hover:border-emerald-500 hover:shadow-2xl dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/60"
            >
              {/* Lotus & Water Lily decorative SVG watermark */}
              <div className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 opacity-20 transition-transform group-hover:scale-110 group-hover:opacity-30">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M50 8C48 25 30 40 15 50C30 60 48 75 50 92C52 75 70 60 85 50C70 40 52 25 50 8Z"
                    fill="#2C5E3B"
                  />
                  <circle cx="50" cy="50" r="10" fill="#B5EAD7" />
                </svg>
              </div>



              {/* Book Cover Container with exact 3:4 aspect ratio matching the 1792x2400 cover image */}
              {book.coverImage ? (
                <div className="relative mb-4 w-full aspect-[3/4] overflow-hidden rounded-2xl border border-emerald-600/20 shadow-md group-hover:scale-[1.02] transition-transform">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>
              ) : (
                <div className="relative mb-4 flex w-full aspect-[3/4] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-600/30 bg-emerald-50/50 p-4 text-center shadow-inner dark:bg-slate-800/60">
                  <span className="text-4xl">📖</span>
                  <p className="mt-3 text-base font-black tracking-wide text-emerald-950 dark:text-emerald-100">
                    {book.title}
                  </p>
                </div>
              )}

              {/* Book Title & Info */}
              <div className="mb-4">
                <p className="text-base sm:text-lg font-black text-emerald-950 group-hover:text-emerald-700 dark:text-emerald-100 dark:group-hover:text-emerald-300">
                  {book.title}
                </p>
                <p className="mt-0.5 text-xs font-medium text-emerald-800/70 dark:text-emerald-300/70">
                  Chương trình SGK Tiểu học
                </p>
              </div>

              {/* Chapters & Lessons count */}
              <div className="mt-auto flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>{book.chapters.length} Chương học</span>
                <span className="text-emerald-700 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                  {loadingId === book.id && isLoadingBook ? (
                    <>
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <span>Xem bài học ➔</span>
                  )}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
