export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type QuestionType = "fill-blank" | "knowledge" | "scenario";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number; // 0..3
  explanation?: string;
  typeLabel?: string;
}

export interface QuizLesson {
  id: string;
  lessonNumber: number;
  title: string;
  description?: string;
  questions: QuizQuestion[]; // Tối thiểu 6 câu hỏi
}

export interface QuizChapter {
  id: string;
  chapterNumber: number;
  title: string;
  lessons: QuizLesson[];
}

export interface QuizBook {
  id: string;
  grade: GradeLevel;
  subjectKey: string;
  title: string;
  color: string;
  badge?: string;
  coverImage?: string;
  chapters: QuizChapter[];
}

export type FrogState = "idle" | "correct" | "wrong";

export type GameScreen =
  | "grade-select"
  | "book-select"
  | "lesson-select"
  | "playing"
  | "summary";

export interface QuizScoreSummary {
  grade: GradeLevel;
  bookTitle: string;
  lessonTitle: string;
  isReview: boolean;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  maxCombo: number;
  elapsedSeconds: number;
  praise: string;
  isPerfect: boolean;
}

export interface NextLessonInfo {
  type: "lesson" | "chapter-review";
  chapter: QuizChapter;
  lesson?: QuizLesson;
  title: string;
}

