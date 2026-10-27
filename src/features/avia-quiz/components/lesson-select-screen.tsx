"use client";

import { useState } from "react";
import { QuizBook, QuizChapter, QuizLesson } from "../types";

interface LessonSelectScreenProps {
  book: QuizBook;
  initialChapterId?: string;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onSelectLesson: (chapter: QuizChapter, lesson: QuizLesson) => void;
  onSelectChapterReview: (chapter: QuizChapter) => void;
  onBack: () => void;
}

export function LessonSelectScreen({
  book,
  initialChapterId,
  soundEnabled,
  onToggleSound,
  onSelectLesson,
  onSelectChapterReview,
  onBack,
}: LessonSelectScreenProps) {
  const [activeChapterId, setActiveChapterId] = useState<string>(() => {
    if (initialChapterId && book.chapters.some((c) => c.id === initialChapterId)) {
      return initialChapterId;
    }
    return book.chapters[0]?.id || "";
  });

  const activeChapter =
    book.chapters.find((c) => c.id === activeChapterId) || book.chapters[0];

  const totalQuestionsInChapter =
    activeChapter?.lessons.reduce((acc, l) => acc + l.questions.length, 0) || 0;
  const reviewCount = Math.max(1, Math.round((totalQuestionsInChapter * 2) / 3));

  return (
    <div className="relative mx-auto w-full max-w-2xl xl:max-w-3xl px-3 py-6 sm:px-6">
      {/* Top Bar: Back Button (Left) | Title & Subtitle (Center) | Sound Toggle (Right) */}
      <div className="mb-6 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back Button */}
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/90 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
          >
            <span>←</span>
            <span>Chọn sách khác</span>
          </button>
        </div>

        {/* Center: Title & Subtitle pushed up */}
        <div className="flex-1 text-center min-w-0 px-1">
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate">
            {book.title}
          </h2>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
            Chọn chủ đề và bài học để bắt đầu luyện tập
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

      {/* Chapter Tabs Selector */}
      {book.chapters.length > 1 && (
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {book.chapters.map((ch) => {
            const isActive = ch.id === activeChapter?.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapterId(ch.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                {ch.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Chapter Container */}
      {activeChapter && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {activeChapter.title}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {activeChapter.lessons.length} bài học
            </span>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {activeChapter.lessons.map((lesson) => {
              const hasQuestions = lesson.questions.length > 0;
              const cleanTitle = lesson.title.replace(/^Bài\s+\d+:\s*/i, "");

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => {
                    if (!hasQuestions) {
                      alert("Bài học này hiện chưa có bộ câu hỏi!");
                      return;
                    }
                    onSelectLesson(activeChapter, lesson);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition group cursor-pointer ${
                    hasQuestions
                      ? "border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-emerald-950/20"
                      : "border-dashed border-slate-200 bg-slate-50/20 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition shrink-0">
                      {lesson.lessonNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">
                        {cleanTitle}
                      </p>
                      {lesson.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition shrink-0 ml-3">
                    <span>Vào bài</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapter Review Bar */}
          {totalQuestionsInChapter > 0 && (
            <button
              type="button"
              onClick={() => onSelectChapterReview(activeChapter)}
              className="w-full mt-4 flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/15 text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition truncate">
                    Ôn tập tổng hợp {activeChapter.title}
                  </p>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 truncate mt-0.5">
                    Thử thách toàn diện ({reviewCount} câu hỏi)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0 ml-3">
                <span>Luyện tập</span>
                <span>➔</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
