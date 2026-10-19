import { describe, it, expect } from "vitest";
import { MOCK_QUIZ_BOOKS, GRADE_METAS } from "./mock-data";

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
    const grade1Book = MOCK_QUIZ_BOOKS.find((b) => b.id === "g1-tnxh");
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
    const hdtnBook = MOCK_QUIZ_BOOKS.find((b) => b.id === "g1-hdtn");
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
    const tnxhG2Book = MOCK_QUIZ_BOOKS.find((b) => b.id === "g2-tnxh");
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
    const hdtnG2Book = MOCK_QUIZ_BOOKS.find((b) => b.id === "g2-hdtn");
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
