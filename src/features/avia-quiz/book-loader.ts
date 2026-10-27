import { GradeLevel, QuizBook } from "./types";

// In-memory cache for loaded books to prevent redundant fetches
const bookCache = new Map<string, QuizBook>();

// Dynamic code-split loaders for each book JSON
// Next.js Webpack automatically splits each into its own async chunk
const BOOK_MODULE_LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
  "g1-tnxh": () => import("./data/grade1-tnxh.json"),
  "g1-hdtn": () => import("./data/grade1-hdtn.json"),
  "g2-tnxh": () => import("./data/grade2-tnxh.json"),
  "g2-hdtn": () => import("./data/grade2-hdtn.json"),
  "g3-tnxh": () => import("./data/grade3-tnxh.json"),
  "g3-hdtn": () => import("./data/grade3-hdtn.json"),
  "g3-congnghe": () => import("./data/grade3-congnghe.json"),
  "g3-tinhoc": () => import("./data/grade3-tinhoc.json"),
  "g4-congnghe": () => import("./data/grade4-congnghe.json"),
  "g4-tinhoc": () => import("./data/grade4-tinhoc.json"),
  "g4-hdtn": () => import("./data/grade4-hdtn.json"),
  "g5-congnghe": () => import("./data/grade5-congnghe.json"),
  "g5-tinhoc": () => import("./data/grade5-tinhoc.json"),
  "g5-hdtn": () => import("./data/grade5-hdtn.json"),
  "g5-khoahoc": () => import("./data/grade5-khoahoc.json"),
};

// Map grade to book IDs for background preloading
export const GRADE_BOOK_IDS: Record<GradeLevel, string[]> = {
  1: ["g1-tnxh", "g1-hdtn"],
  2: ["g2-tnxh", "g2-hdtn", "g2-daoduc", "g2-amnhac"],
  3: ["g3-tnxh", "g3-hdtn", "g3-congnghe", "g3-tinhoc"],
  4: ["g4-hdtn", "g4-congnghe", "g4-tinhoc"],
  5: ["g5-congnghe", "g5-tinhoc", "g5-hdtn", "g5-khoahoc"],
};

/**
 * Loads a quiz book by its ID dynamically from JSON chunk.
 * Returns cached instance if already loaded.
 */
export async function loadQuizBook(bookId: string): Promise<QuizBook | null> {
  if (bookCache.has(bookId)) {
    return bookCache.get(bookId)!;
  }

  const loader = BOOK_MODULE_LOADERS[bookId];
  if (!loader) {
    return null;
  }

  try {
    const mod = await loader();
    const book = mod.default as unknown as QuizBook;
    bookCache.set(bookId, book);
    return book;
  } catch (error) {
    console.error(`Failed to load quiz book ${bookId}:`, error);
    return null;
  }
}

/**
 * Preloads all books for a specific grade in the background
 * to ensure instant transition when the user taps on any book.
 */
export function preloadQuizBooksForGrade(grade: GradeLevel): void {
  const bookIds = GRADE_BOOK_IDS[grade] || [];
  for (const id of bookIds) {
    if (!bookCache.has(id) && BOOK_MODULE_LOADERS[id]) {
      // Fire-and-forget background load
      loadQuizBook(id).catch(() => {});
    }
  }
}

/**
 * Check if a book is already loaded in memory
 */
export function isQuizBookLoaded(bookId: string): boolean {
  return bookCache.has(bookId);
}

/**
 * Register a book directly into cache (useful for SSR, mock or test data)
 */
export function cacheQuizBook(book: QuizBook): void {
  bookCache.set(book.id, book);
}
