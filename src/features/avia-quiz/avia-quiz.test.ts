import { describe, it, expect } from "vitest";
import { MOCK_QUIZ_BOOKS, GRADE_METAS } from "./mock-data";
import { ALL_QUIZ_BOOKS } from "./data/all-books";
import { loadQuizBook, preloadQuizBooksForGrade } from "./book-loader";

describe("Avia Quiz GDD Compliance Check", () => {
  it("should have 5 grade definitions matching GDD Grade 1 to 5", () => {
    expect(GRADE_METAS.length).toBe(5);
    const gradeNumbers = GRADE_METAS.map((g) => g.grade);
    expect(gradeNumbers).toEqual([1, 2, 3, 4, 5]);

    // Check mascot titles per GDD
    expect(GRADE_METAS[0].mascotTitle).toBe("Ếch Đeo Cặp Mầm Non");
    expect(GRADE_METAS[1].mascotTitle).toBe("Ếch Đội Nón Lá");
    expect(GRADE_METAS[2].mascotTitle).toBe("Ếch Đeo Khăn Quàng Đỏ");
    expect(GRADE_METAS[3].mascotTitle).toBe("Ếch Nhà Khai Phá");
    expect(GRADE_METAS[4].mascotTitle).toBe("Ếch Thám Tử");
  });

  it("loads question bank correctly for Grade 1 TNXH with 28 lessons and 6 questions per lesson", () => {
    const grade1Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g1-tnxh");
    expect(grade1Book).toBeDefined();
    expect(grade1Book?.chapters.length).toBe(6);

    let totalQuestions = 0;
    for (const chapter of grade1Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      }
    }
    expect(totalQuestions).toBe(168);
  });

  it("loads question bank correctly for Grade 1 HDTN with 9 chapters, 21 lessons and 126 questions", () => {
    const hdtnBook = ALL_QUIZ_BOOKS.find((b) => b.id === "g1-hdtn");
    expect(hdtnBook).toBeDefined();
    expect(hdtnBook?.chapters.length).toBe(9);

    let totalLessons = 0;
    let totalQuestions = 0;
    for (const chapter of hdtnBook!.chapters) {
      totalLessons += chapter.lessons.length;
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      }
    }
    expect(totalLessons).toBe(21);
    expect(totalQuestions).toBe(126);
  });

  it("loads question bank correctly for Grade 2 TNXH with 6 chapters, 31 lessons and 186 questions", () => {
    const tnxhG2Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g2-tnxh");
    expect(tnxhG2Book).toBeDefined();
    expect(tnxhG2Book?.chapters.length).toBe(6);

    let totalLessons = 0;
    let totalQuestions = 0;
    for (const chapter of tnxhG2Book!.chapters) {
      totalLessons += chapter.lessons.length;
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      }
    }
    expect(totalLessons).toBe(31);
    expect(totalQuestions).toBe(186);
  });

  it("loads question bank correctly for Grade 2 HDTN (Chapters 1 to 4 with 17 lessons and 102 questions)", () => {
    const hdtnG2Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g2-hdtn");
    expect(hdtnG2Book).toBeDefined();
    expect(hdtnG2Book?.chapters.length).toBe(5);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of hdtnG2Book!.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.questions.length > 0) {
          expect(lesson.questions.length).toBe(6);
          completedLessons++;
          totalQuestions += lesson.questions.length;
          for (const q of lesson.questions) {
            expect(q.options.length).toBe(4);
            expect(q.correctIndex).toBeGreaterThanOrEqual(0);
            expect(q.correctIndex).toBeLessThanOrEqual(3);
          }
        }
      }
    }
    expect(completedLessons).toBe(17);
    expect(totalQuestions).toBe(102);
  });

  it("loads question bank correctly for Grade 3 Cong Nghe (2 chapters with 10 lessons and 60 questions)", () => {
    const congngheG3Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g3-congnghe");
    expect(congngheG3Book).toBeDefined();
    expect(congngheG3Book?.grade).toBe(3);
    expect(congngheG3Book?.chapters.length).toBe(2);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of congngheG3Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      }
    }
    expect(completedLessons).toBe(10);
    expect(totalQuestions).toBe(60);
  });

  it("loads question bank correctly for Grade 3 Tin học with 6 chapters, 16 lessons and 96 questions from JSON", () => {
    const tinhocBook = ALL_QUIZ_BOOKS.find((b) => b.id === "g3-tinhoc");
    expect(tinhocBook).toBeDefined();
    expect(tinhocBook?.grade).toBe(3);
    expect(tinhocBook?.subjectKey).toBe("tinhoc");
    expect(tinhocBook?.chapters.length).toBe(6);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of tinhocBook!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(16);
    expect(totalQuestions).toBe(96);
  });

  it("loads question bank correctly for Grade 3 Tự nhiên và Xã hội with 6 chapters, 30 lessons and 180 questions from JSON", () => {
    const tnxhG3Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g3-tnxh");
    expect(tnxhG3Book).toBeDefined();
    expect(tnxhG3Book?.grade).toBe(3);
    expect(tnxhG3Book?.subjectKey).toBe("tnxh");
    expect(tnxhG3Book?.chapters.length).toBe(6);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of tnxhG3Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(30);
    expect(totalQuestions).toBe(180);
  });

  it("loads question bank correctly for Grade 3 Hoạt động trải nghiệm with 9 chapters, 35 lessons and 210 questions from JSON", () => {
    const hdtnG3Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g3-hdtn");
    expect(hdtnG3Book).toBeDefined();
    expect(hdtnG3Book?.grade).toBe(3);
    expect(hdtnG3Book?.subjectKey).toBe("hdtn");
    expect(hdtnG3Book?.chapters.length).toBe(9);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of hdtnG3Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(35);
    expect(totalQuestions).toBe(210);
  });

  it("loads question bank correctly for Grade 4 Công nghệ with 2 chapters, 12 lessons and 72 questions from JSON", () => {
    const congngheG4Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g4-congnghe");
    expect(congngheG4Book).toBeDefined();
    expect(congngheG4Book?.grade).toBe(4);
    expect(congngheG4Book?.subjectKey).toBe("congnghe");
    expect(congngheG4Book?.chapters.length).toBe(2);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of congngheG4Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(12);
    expect(totalQuestions).toBe(72);
  });

  it("loads question bank correctly for Grade 4 Tin học with 6 chapters, 17 lessons and 102 questions from JSON", () => {
    const tinhocG4Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g4-tinhoc");
    expect(tinhocG4Book).toBeDefined();
    expect(tinhocG4Book?.grade).toBe(4);
    expect(tinhocG4Book?.subjectKey).toBe("tinhoc");
    expect(tinhocG4Book?.chapters.length).toBe(6);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of tinhocG4Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(17);
    expect(totalQuestions).toBe(102);
  });

  it("loads question bank correctly for Grade 4 Hoạt động trải nghiệm with 9 chapters, 35 lessons and 210 questions from JSON", () => {
    const hdtnG4Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g4-hdtn");
    expect(hdtnG4Book).toBeDefined();
    expect(hdtnG4Book?.grade).toBe(4);
    expect(hdtnG4Book?.subjectKey).toBe("hdtn");
    expect(hdtnG4Book?.chapters.length).toBe(9);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of hdtnG4Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(35);
    expect(totalQuestions).toBe(210);
  });

  it("loads question bank correctly for Grade 5 Công nghệ with 2 chapters, 9 lessons and 54 questions from JSON", () => {
    const congngheG5Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g5-congnghe");
    expect(congngheG5Book).toBeDefined();
    expect(congngheG5Book?.grade).toBe(5);
    expect(congngheG5Book?.subjectKey).toBe("congnghe");
    expect(congngheG5Book?.chapters.length).toBe(2);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of congngheG5Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(9);
    expect(totalQuestions).toBe(54);
  });

  it("loads question bank correctly for Grade 5 Tin học with 6 chapters, 18 lessons and 108 questions from JSON", () => {
    const tinhocG5Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g5-tinhoc");
    expect(tinhocG5Book).toBeDefined();
    expect(tinhocG5Book?.grade).toBe(5);
    expect(tinhocG5Book?.subjectKey).toBe("tinhoc");
    expect(tinhocG5Book?.chapters.length).toBe(6);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of tinhocG5Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(18);
    expect(totalQuestions).toBe(108);
  });

  it("loads question bank correctly for Grade 5 Hoạt động trải nghiệm with 9 chapters, 32 lessons and 192 questions from JSON", () => {
    const hdtnG5Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g5-hdtn");
    expect(hdtnG5Book).toBeDefined();
    expect(hdtnG5Book?.grade).toBe(5);
    expect(hdtnG5Book?.subjectKey).toBe("hdtn");
    expect(hdtnG5Book?.chapters.length).toBe(9);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of hdtnG5Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(32);
    expect(totalQuestions).toBe(192);
  });

  it("loads question bank correctly for Grade 5 Khoa học with 6 chapters, 30 lessons and 180 questions from JSON", () => {
    const khoahocG5Book = ALL_QUIZ_BOOKS.find((b) => b.id === "g5-khoahoc");
    expect(khoahocG5Book).toBeDefined();
    expect(khoahocG5Book?.grade).toBe(5);
    expect(khoahocG5Book?.subjectKey).toBe("khoahoc");
    expect(khoahocG5Book?.chapters.length).toBe(6);

    let completedLessons = 0;
    let totalQuestions = 0;
    for (const chapter of khoahocG5Book!.chapters) {
      for (const lesson of chapter.lessons) {
        expect(lesson.questions.length).toBe(6);
        completedLessons++;
        totalQuestions += lesson.questions.length;
        for (const q of lesson.questions) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation).toBeDefined();
          expect((q.explanation ?? "").length).toBeGreaterThan(5);
        }
      }
    }
    expect(completedLessons).toBe(30);
    expect(totalQuestions).toBe(180);
  });

  it("reduces client payload: catalog has 0 bundled questions and loads dynamically via book-loader", async () => {
    // 1. Client catalog check: 0 questions bundled upfront
    const catalogQuestionsCount = MOCK_QUIZ_BOOKS.reduce(
      (sum, b) =>
        sum +
        b.chapters.reduce(
          (cSum, c) =>
            cSum + c.lessons.reduce((lSum, l) => lSum + l.questions.length, 0),
          0
        ),
      0
    );
    expect(catalogQuestionsCount).toBe(0);

    // 2. Dynamic load check: loadQuizBook fetches full JSON chunk with questions on demand
    const loadedTinhoc = await loadQuizBook("g3-tinhoc");
    expect(loadedTinhoc).toBeDefined();
    expect(loadedTinhoc?.title).toBe("Tin học lớp 3");
    const qCount = loadedTinhoc!.chapters.reduce(
      (sum, c) =>
        sum + c.lessons.reduce((lSum, l) => lSum + l.questions.length, 0),
      0
    );
    expect(qCount).toBe(96);

    // 3. Preload check for Grade 1
    preloadQuizBooksForGrade(1);
    const loadedTnxh1 = await loadQuizBook("g1-tnxh");
    expect(loadedTnxh1).toBeDefined();
    expect(loadedTnxh1?.title).toBe("Tự nhiên và Xã hội lớp 1");
    const tnxh1Count = loadedTnxh1!.chapters.reduce(
      (sum, c) =>
        sum + c.lessons.reduce((lSum, l) => lSum + l.questions.length, 0),
      0
    );
    expect(tnxh1Count).toBe(168);
  });

  it("calculates 2/3 questions correctly for Chapter Review formula", () => {
    const calculateReviewQuestions = (total: number) => Math.max(1, Math.round((total * 2) / 3));

    // If chapter has 6 questions -> review has 4 questions (2/3)
    expect(calculateReviewQuestions(6)).toBe(4);
    // If chapter has 12 questions -> review has 8 questions (2/3)
    expect(calculateReviewQuestions(12)).toBe(8);
    // If chapter has 18 questions -> review has 12 questions (2/3)
    expect(calculateReviewQuestions(18)).toBe(12);
  });
});

describe("Avia Quiz Combo & Scoring Rules (GDD Section 4.1)", () => {
  function calculatePoints(combo: number): number {
    let pts = 10; // Base points
    if (combo === 3) pts += 10;
    else if (combo === 5) pts += 20;
    else if (combo === 10) pts += 30;
    else if (combo > 10 && (combo - 10) % 5 === 0) pts += 30;
    return pts;
  }

  it("correctly awards combo bonuses according to GDD", () => {
    expect(calculatePoints(1)).toBe(10);
    expect(calculatePoints(2)).toBe(10);
    expect(calculatePoints(3)).toBe(20); // 10 base + 10 bonus
    expect(calculatePoints(4)).toBe(10);
    expect(calculatePoints(5)).toBe(30); // 10 base + 20 bonus
    expect(calculatePoints(9)).toBe(10);
    expect(calculatePoints(10)).toBe(40); // 10 base + 30 bonus
    expect(calculatePoints(15)).toBe(40); // 10 base + 30 bonus (every 5 after 10)
    expect(calculatePoints(20)).toBe(40); // 10 base + 30 bonus
    expect(calculatePoints(14)).toBe(10);
  });

  it("correctly assigns praise by elapsed time according to GDD", () => {
    function getPraise(seconds: number) {
      if (seconds < 60) return "Quá nhanh quá nguy hiểm!!";
      if (seconds < 90) return "Tuyệt đỉnh, không ai làm lại!!";
      return "Bé quá giỏi!";
    }

    expect(getPraise(45)).toBe("Quá nhanh quá nguy hiểm!!");
    expect(getPraise(59)).toBe("Quá nhanh quá nguy hiểm!!");
    expect(getPraise(60)).toBe("Tuyệt đỉnh, không ai làm lại!!");
    expect(getPraise(89)).toBe("Tuyệt đỉnh, không ai làm lại!!");
    expect(getPraise(90)).toBe("Bé quá giỏi!");
    expect(getPraise(120)).toBe("Bé quá giỏi!");
  });
});

describe("Avia Quiz Progression & Next Lesson Logic", () => {
  it("determines next lesson accurately within chapter, to chapter review, and across chapters", () => {
    const mockBook = {
      id: "mock-book",
      grade: 1 as const,
      subjectKey: "mock",
      title: "Sách thử nghiệm",
      color: "#10B981",
      chapters: [
        {
          id: "c1",
          chapterNumber: 1,
          title: "Chủ đề 1",
          lessons: [
            { id: "l1", lessonNumber: 1, title: "Bài 1", questions: [] },
            { id: "l2", lessonNumber: 2, title: "Bài 2", questions: [] },
          ],
        },
        {
          id: "c2",
          chapterNumber: 2,
          title: "Chủ đề 2",
          lessons: [
            { id: "l3", lessonNumber: 3, title: "Bài 3", questions: [] },
          ],
        },
      ],
    };

    function getNext(
      chapterId: string,
      lessonId: string | null,
      isReview: boolean
    ) {
      const curChapterIndex = mockBook.chapters.findIndex((c) => c.id === chapterId);
      if (curChapterIndex === -1) return null;

      const currentChapter = mockBook.chapters[curChapterIndex];

      if (!isReview && lessonId) {
        const curLessonIndex = currentChapter.lessons.findIndex((l) => l.id === lessonId);
        // Next lesson in same chapter
        if (curLessonIndex >= 0 && curLessonIndex < currentChapter.lessons.length - 1) {
          return {
            type: "lesson",
            title: currentChapter.lessons[curLessonIndex + 1].title,
          };
        }
        // Last lesson of multi-lesson chapter -> review
        if (currentChapter.lessons.length > 1) {
          return {
            type: "chapter-review",
            title: `Ôn tập ${currentChapter.title}`,
          };
        }
        // Move to next chapter
        if (curChapterIndex < mockBook.chapters.length - 1) {
          return {
            type: "lesson",
            title: mockBook.chapters[curChapterIndex + 1].lessons[0].title,
          };
        }
        return null;
      }

      if (isReview) {
        if (curChapterIndex < mockBook.chapters.length - 1) {
          return {
            type: "lesson",
            title: mockBook.chapters[curChapterIndex + 1].lessons[0].title,
          };
        }
        return null;
      }

      return null;
    }

    // From Bài 1 -> Next is Bài 2
    expect(getNext("c1", "l1", false)).toEqual({
      type: "lesson",
      title: "Bài 2",
    });

    // From Bài 2 (last of c1) -> Next is Ôn tập Chủ đề 1
    expect(getNext("c1", "l2", false)).toEqual({
      type: "chapter-review",
      title: "Ôn tập Chủ đề 1",
    });

    // From Ôn tập Chủ đề 1 -> Next is Bài 3 in Chủ đề 2
    expect(getNext("c1", null, true)).toEqual({
      type: "lesson",
      title: "Bài 3",
    });

    // From Bài 3 (last in book, single lesson) -> null (completed book)
    expect(getNext("c2", "l3", false)).toBeNull();
  });
});
