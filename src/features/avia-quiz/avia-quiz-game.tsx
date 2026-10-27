"use client";

import { useState } from "react";
import { useQuizGame } from "./use-quiz-game";
import { GradeSelectScreen } from "./components/grade-select-screen";
import { BookSelectScreen } from "./components/book-select-screen";
import { LessonSelectScreen } from "./components/lesson-select-screen";
import { QuizPlayScreen } from "./components/quiz-play-screen";
import { QuizResultScreen } from "./components/quiz-result-screen";
import { quizSound } from "./sound";

interface AviaQuizGameProps {
  onBackToLobby?: () => void;
}

export function AviaQuizGame({ onBackToLobby }: AviaQuizGameProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    quizSound.enabled = nextState;
  };

  const {
    screen,
    selectedGrade,
    selectedBook,
    selectedChapter,
    isLoadingBook,
    availableBooks,
    currentQuestion,
    currentIndex,
    questions,
    selectedAnswer,
    isAnswered,
    frogState,
    score,
    currentCombo,
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
    nextLessonInfo,
    startNextLesson,
  } = useQuizGame();

  return (
    <div className="relative min-h-[580px] w-full rounded-3xl bg-gradient-to-b from-[#B5EAD7]/30 via-white to-emerald-50/50 p-2 sm:p-4 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      {/* Screen Router */}
      {screen === "grade-select" && (
        <GradeSelectScreen
          onSelectGrade={selectGrade}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onExit={onBackToLobby}
        />
      )}

      {screen === "book-select" && (
        <BookSelectScreen
          grade={selectedGrade}
          books={availableBooks}
          isLoadingBook={isLoadingBook}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onSelectBook={selectBook}
          onBack={backToGradeSelect}
        />
      )}

      {screen === "lesson-select" && selectedBook && (
        <LessonSelectScreen
          book={selectedBook}
          initialChapterId={selectedChapter?.id}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onSelectLesson={startLesson}
          onSelectChapterReview={startChapterReview}
          onBack={backToBookSelect}
        />
      )}

      {screen === "playing" && currentQuestion && (
        <QuizPlayScreen
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          score={score}
          currentCombo={currentCombo}
          lastReward={lastReward}
          frogState={frogState}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          elapsedSeconds={elapsedSeconds}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onSelectAnswer={answerQuestion}
          onExit={backToLessonSelect}
        />
      )}

      {screen === "summary" && summary && (
        <QuizResultScreen
          summary={summary}
          nextLessonTitle={nextLessonInfo?.title}
          onNextLesson={nextLessonInfo ? startNextLesson : undefined}
          onRestart={restartCurrent}
          onChooseOtherLesson={backToLessonSelect}
        />
      )}
    </div>
  );
}
