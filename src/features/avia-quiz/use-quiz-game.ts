"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  GradeLevel,
  QuizBook,
  QuizChapter,
  QuizLesson,
  QuizQuestion,
  GameScreen,
  FrogState,
  QuizScoreSummary,
  NextLessonInfo,
} from "./types";
import { MOCK_QUIZ_BOOKS } from "./mock-data";
import { loadQuizBook, preloadQuizBooksForGrade } from "./book-loader";
import { quizSound } from "./sound";
import confetti from "canvas-confetti";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useQuizGame() {
  const [screen, setScreen] = useState<GameScreen>("grade-select");
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(2);
  const [selectedBook, setSelectedBook] = useState<QuizBook | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<QuizLesson | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<QuizChapter | null>(null);
  const [isChapterReview, setIsChapterReview] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(false);

  // Background preload books for the currently active grade
  useEffect(() => {
    preloadQuizBooksForGrade(selectedGrade);
  }, [selectedGrade]);

  // Playing state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [frogState, setFrogState] = useState<FrogState>("idle");

  // Scoring & Stats
  const [score, setScore] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Summary
  const [summary, setSummary] = useState<QuizScoreSummary | null>(null);
  const [lastReward, setLastReward] = useState<{
    points: number;
    bonus: number;
    combo: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter books by selected grade
  const availableBooks = MOCK_QUIZ_BOOKS.filter(
    (b) => b.grade === selectedGrade
  );

  // Navigation actions
  const selectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    preloadQuizBooksForGrade(grade);
    setScreen("book-select");
  };

  const selectBook = async (book: QuizBook) => {
    setIsLoadingBook(true);
    try {
      const fullBook = await loadQuizBook(book.id);
      setSelectedBook(fullBook ?? book);
      setScreen("lesson-select");
    } finally {
      setIsLoadingBook(false);
    }
  };

  const backToGradeSelect = () => {
    setScreen("grade-select");
    setSelectedBook(null);
    setSelectedLesson(null);
  };

  const backToBookSelect = () => {
    setScreen("book-select");
    setSelectedLesson(null);
  };

  const backToLessonSelect = () => {
    setScreen("lesson-select");
    setSelectedLesson(null);
    setIsChapterReview(false);
  };

  // Find information about the next lesson or chapter review in progression
  const getNextLessonInfo = useCallback((): NextLessonInfo | null => {
    if (!selectedBook) return null;

    if (!isChapterReview && selectedChapter && selectedLesson) {
      const curChapterIndex = selectedBook.chapters.findIndex(
        (c) => c.id === selectedChapter.id
      );
      if (curChapterIndex === -1) return null;

      const currentChapter = selectedBook.chapters[curChapterIndex];
      const curLessonIndex = currentChapter.lessons.findIndex(
        (l) => l.id === selectedLesson.id
      );

      // 1. Next lesson within the same chapter
      if (curLessonIndex >= 0 && curLessonIndex < currentChapter.lessons.length - 1) {
        const nextLesson = currentChapter.lessons[curLessonIndex + 1];
        return {
          type: "lesson",
          chapter: currentChapter,
          lesson: nextLesson,
          title: nextLesson.title,
        };
      }

      // 2. Last lesson of chapter -> Offer chapter review if chapter has multiple lessons
      if (currentChapter.lessons.length > 1) {
        return {
          type: "chapter-review",
          chapter: currentChapter,
          title: `Ôn tập ${currentChapter.title}`,
        };
      }

      // 3. Move to lesson 1 of next chapter
      if (curChapterIndex < selectedBook.chapters.length - 1) {
        const nextChapter = selectedBook.chapters[curChapterIndex + 1];
        if (nextChapter.lessons.length > 0) {
          const nextLesson = nextChapter.lessons[0];
          return {
            type: "lesson",
            chapter: nextChapter,
            lesson: nextLesson,
            title: nextLesson.title,
          };
        }
      }

      return null;
    }

    if (isChapterReview && selectedChapter) {
      const curChapterIndex = selectedBook.chapters.findIndex(
        (c) => c.id === selectedChapter.id
      );
      if (curChapterIndex >= 0 && curChapterIndex < selectedBook.chapters.length - 1) {
        const nextChapter = selectedBook.chapters[curChapterIndex + 1];
        if (nextChapter.lessons.length > 0) {
          const nextLesson = nextChapter.lessons[0];
          return {
            type: "lesson",
            chapter: nextChapter,
            lesson: nextLesson,
            title: nextLesson.title,
          };
        }
      }
      return null;
    }

    return null;
  }, [selectedBook, selectedChapter, selectedLesson, isChapterReview]);

  const startNextLesson = () => {
    const next = getNextLessonInfo();
    if (!next) return;

    if (next.type === "lesson" && next.lesson) {
      startLesson(next.chapter, next.lesson);
    } else if (next.type === "chapter-review") {
      startChapterReview(next.chapter);
    }
  };

  // Start regular lesson quiz: Random 4 out of 6 questions
  const startLesson = (chapter: QuizChapter, lesson: QuizLesson) => {
    setSelectedChapter(chapter);
    setSelectedLesson(lesson);
    setIsChapterReview(false);

    // Shuffle and pick 4 questions
    const shuffled = shuffleArray(lesson.questions);
    const selected = shuffled.slice(0, Math.min(4, shuffled.length));

    initGameSession(selected);
  };

  // Start chapter review: 2/3 of total questions in all chapter lessons
  const startChapterReview = (chapter: QuizChapter) => {
    setSelectedChapter(chapter);
    setSelectedLesson(null);
    setIsChapterReview(true);

    const allChapterQuestions = chapter.lessons.flatMap((l) => l.questions);
    const count = Math.max(1, Math.round((allChapterQuestions.length * 2) / 3));
    const selected = shuffleArray(allChapterQuestions).slice(0, count);

    initGameSession(selected);
  };

  const initGameSession = (selectedQuestions: QuizQuestion[]) => {
    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFrogState("idle");
    setScore(0);
    setCurrentCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSummary(null);

    const now = Date.now();
    setStartTime(now);
    setElapsedSeconds(0);
    setScreen("playing");
  };

  // Timer loop while playing
  useEffect(() => {
    if (screen === "playing") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // Handle user selecting an answer
  const answerQuestion = (answerIndex: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    const currentQ = questions[currentIndex];
    const isCorrect = answerIndex === currentQ.correctIndex;

    let transitionDelay = 1300;

    if (isCorrect) {
      setFrogState("correct");
      const nextCombo = currentCombo + 1;
      setCurrentCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      setCorrectCount((prev) => prev + 1);

      // Điểm cơ bản
      let pointsEarned = 10;
      let bonus = 0;

      // Thưởng combo theo GDD:
      // x3: +10, x5: +20, x10: +30, sau x10 mỗi 5 chuỗi: +30
      if (nextCombo === 3) {
        bonus = 10;
      } else if (nextCombo === 5) {
        bonus = 20;
      } else if (nextCombo === 10) {
        bonus = 30;
      } else if (nextCombo > 10 && (nextCombo - 10) % 5 === 0) {
        bonus = 30;
      }

      pointsEarned += bonus;
      setLastReward({ points: pointsEarned, bonus, combo: nextCombo });

      if (nextCombo >= 2) {
        quizSound.playCombo(nextCombo);
      } else {
        quizSound.playCorrect();
      }

      setScore((prev) => prev + pointsEarned);

      // Cho thêm thời gian chiêm ngưỡng hiệu ứng combo đặc sắc
      if (nextCombo >= 2) {
        transitionDelay = 1600;
      }
    } else {
      setFrogState("wrong");
      // Mất chuỗi khi sai
      setCurrentCombo(0);
      setWrongCount((prev) => prev + 1);
      setLastReward(null);
      quizSound.playWrong();
    }

    // Chuyển câu hỏi sau transitionDelay
    setTimeout(() => {
      proceedToNext(isCorrect);
    }, transitionDelay);
  };

  const finishGame = useCallback(
    (finalCorrect: number, finalWrong: number, finalMaxCombo: number, finalScore: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const totalTime = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const totalQ = questions.length;
      const isPerfect = finalCorrect === totalQ;

      // Lời khen theo thời gian (theo chuẩn GDD)
      let praise = "Bé quá giỏi!";
      if (totalTime < 60) {
        praise = "Quá nhanh quá nguy hiểm!!";
      } else if (totalTime < 90) {
        praise = "Tuyệt đỉnh, không ai làm lại!!";
      }

      const sum: QuizScoreSummary = {
        grade: selectedGrade,
        bookTitle: selectedBook?.title || "",
        lessonTitle: isChapterReview
          ? `Ôn tập ${selectedChapter?.title || ""}`
          : selectedLesson?.title || "",
        isReview: isChapterReview,
        totalQuestions: totalQ,
        correctAnswers: finalCorrect,
        wrongAnswers: finalWrong,
        score: finalScore,
        maxCombo: finalMaxCombo,
        elapsedSeconds: totalTime,
        praise,
        isPerfect,
      };

      setSummary(sum);
      setScreen("summary");
      quizSound.playVictory(isPerfect);

      if (isPerfect) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti fails
        }
      }
    },
    [startTime, questions.length, selectedGrade, selectedBook?.title, isChapterReview, selectedChapter?.title, selectedLesson?.title]
  );

  const proceedToNext = (wasCorrect: boolean) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFrogState("idle");
      setLastReward(null);
    } else {
      const finalCorrect = correctCount + (wasCorrect ? 1 : 0);
      const finalWrong = wrongCount + (wasCorrect ? 0 : 1);
      const finalMaxCombo = maxCombo;
      const finalScore = score;
      finishGame(finalCorrect, finalWrong, finalMaxCombo, finalScore);
    }
  };

  const restartCurrent = () => {
    if (isChapterReview && selectedChapter) {
      startChapterReview(selectedChapter);
    } else if (selectedChapter && selectedLesson) {
      startLesson(selectedChapter, selectedLesson);
    }
  };

  return {
    screen,
    selectedGrade,
    selectedBook,
    selectedLesson,
    selectedChapter,
    isChapterReview,
    isLoadingBook,
    availableBooks,
    questions,
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    selectedAnswer,
    isAnswered,
    frogState,
    score,
    currentCombo,
    maxCombo,
    correctCount,
    wrongCount,
    elapsedSeconds,
    summary,
    lastReward,
    selectGrade,
    selectBook,
    backToGradeSelect,
    backToBookSelect,
    backToLessonSelect,
    startLesson,
    startChapterReview,
    answerQuestion,
    restartCurrent,
    nextLessonInfo: getNextLessonInfo(),
    startNextLesson,
  };
}
