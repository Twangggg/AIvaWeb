import { GradeLevel, QuizBook } from "./types";

export interface GradeMeta {
  grade: GradeLevel;
  title: string;
  mascotTitle: string;
  mascotImage: string;
  assetStatus: "available";
}

// 5 Khối lớp theo GDD mục 2.1 với các hình ảnh chính xác được chỉ định:
export const GRADE_METAS: GradeMeta[] = [
  {
    grade: 1,
    title: "Lớp 1",
    mascotTitle: "Ếch Đeo Cặp Mầm Non",
    mascotImage: "/mascots/ech-lop-1.png",
    assetStatus: "available",
  },
  {
    grade: 2,
    title: "Lớp 2",
    mascotTitle: "Ếch Đội Nón Lá",
    mascotImage: "/mascots/ech-non-la.png",
    assetStatus: "available",
  },
  {
    grade: 3,
    title: "Lớp 3",
    mascotTitle: "Ếch Đeo Khăn Quàng Đỏ",
    mascotImage: "/mascots/ech-khan-quang-do.png",
    assetStatus: "available",
  },
  {
    grade: 4,
    title: "Lớp 4",
    mascotTitle: "Ếch Nhà Khai Phá",
    mascotImage: "/mascots/ech-tham-hiem.png",
    assetStatus: "available",
  },
  {
    grade: 5,
    title: "Lớp 5",
    mascotTitle: "Ếch Thám Tử",
    mascotImage: "/mascots/ech-tham-tu.png",
    assetStatus: "available",
  },
];

// Hình ảnh biểu cảm của Ếch:
export const FROG_REACTION_IMAGES = {
  idle: "/mascots/ech-vui-ve.png",
  correct: "/mascots/ech-cuoi-tuoi.png",
  wrong: "/mascots/ech-buon.png",
};

/**
 * Danh mục sách môn học nhẹ (Lightweight Book Catalog).
 * Chỉ chứa thông tin tổng quan phục vụ màn hình chọn môn học của Client.
 * Nội dung chi tiết các câu hỏi sẽ được tải động (dynamic lazy-load) theo nhu cầu
 * khi học sinh chọn sách, giúp giảm >90% dung lượng tải ban đầu cho client.
 */
export const QUIZ_BOOK_CATALOG: QuizBook[] = [
  {
    id: "g1-tnxh",
    grade: 1,
    subjectKey: "tnxh",
    title: "Tự nhiên và Xã hội lớp 1",
    color: "#4CAF50",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-tnxh1`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g1-hdtn",
    grade: 1,
    subjectKey: "hdtn",
    title: "Hoạt động trải nghiệm lớp 1",
    color: "#FF9800",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 9 }, (_, i) => ({
      id: `c${i + 1}-hdtn1`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g2-tnxh",
    grade: 2,
    subjectKey: "tnxh",
    title: "Tự nhiên và Xã hội lớp 2",
    color: "#2E7D32",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-tnxh2`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g2-hdtn",
    grade: 2,
    subjectKey: "hdtn",
    title: "Hoạt động trải nghiệm lớp 2",
    color: "#F57C00",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 5 }, (_, i) => ({
      id: `c${i + 1}-hdtn2`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g2-daoduc",
    grade: 2,
    subjectKey: "daoduc",
    title: "Đạo đức lớp 2",
    color: "#2C5E3B",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: [
      {
        id: "c1-daoduc",
        chapterNumber: 1,
        title: "Chương 1",
        lessons: [
          { id: "l1-daoduc", lessonNumber: 1, title: "Bài 1", questions: [] },
          { id: "l2-daoduc", lessonNumber: 2, title: "Bài 2", questions: [] },
        ],
      },
    ],
  },
  {
    id: "g2-amnhac",
    grade: 2,
    subjectKey: "amnhac",
    title: "Âm nhạc lớp 2",
    color: "#B5EAD7",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: [
      {
        id: "c1-amnhac",
        chapterNumber: 1,
        title: "Chương 1",
        lessons: [{ id: "l1-amnhac", lessonNumber: 1, title: "Bài 1", questions: [] }],
      },
    ],
  },
  {
    id: "g3-tnxh",
    grade: 3,
    subjectKey: "tnxh",
    title: "Tự nhiên và Xã hội lớp 3",
    color: "#10B981",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-tnxh3`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g3-hdtn",
    grade: 3,
    subjectKey: "hdtn",
    title: "Hoạt động trải nghiệm lớp 3",
    color: "#F59E0B",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 9 }, (_, i) => ({
      id: `c${i + 1}-hdtn3`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g3-congnghe",
    grade: 3,
    subjectKey: "congnghe",
    title: "Công nghệ lớp 3",
    color: "#0284C7",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 2 }, (_, i) => ({
      id: `c${i + 1}-congnghe3`,
      chapterNumber: i + 1,
      title: `Phần ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g3-tinhoc",
    grade: 3,
    subjectKey: "tinhoc",
    title: "Tin học lớp 3",
    color: "#2563EB",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-tinhoc3`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g4-hdtn",
    grade: 4,
    subjectKey: "hdtn",
    title: "Hoạt động trải nghiệm lớp 4",
    color: "#F59E0B",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 9 }, (_, i) => ({
      id: `c${i + 1}-hdtn4`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g4-congnghe",
    grade: 4,
    subjectKey: "congnghe",
    title: "Công nghệ lớp 4",
    color: "#0284C7",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 2 }, (_, i) => ({
      id: `c${i + 1}-congnghe4`,
      chapterNumber: i + 1,
      title: `Phần ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g4-tinhoc",
    grade: 4,
    subjectKey: "tinhoc",
    title: "Tin học lớp 4",
    color: "#2563EB",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-tinhoc4`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g5-congnghe",
    grade: 5,
    subjectKey: "congnghe",
    title: "Công nghệ lớp 5",
    color: "#0284C7",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 2 }, (_, i) => ({
      id: `c${i + 1}-congnghe5`,
      chapterNumber: i + 1,
      title: `Phần ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g5-tinhoc",
    grade: 5,
    subjectKey: "tinhoc",
    title: "Tin học lớp 5",
    color: "#2563EB",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-tinhoc5`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g5-hdtn",
    grade: 5,
    subjectKey: "hdtn",
    title: "Hoạt động trải nghiệm lớp 5",
    color: "#F59E0B",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 9 }, (_, i) => ({
      id: `c${i + 1}-hdtn5`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
  {
    id: "g5-khoahoc",
    grade: 5,
    subjectKey: "khoahoc",
    title: "Khoa học lớp 5",
    color: "#10B981",
    coverImage: "/mascots/bia-sach-mon-hoc.png",
    chapters: Array.from({ length: 6 }, (_, i) => ({
      id: `c${i + 1}-kh5`,
      chapterNumber: i + 1,
      title: `Chủ đề ${i + 1}`,
      lessons: [],
    })),
  },
];

// Alias MOCK_QUIZ_BOOKS to QUIZ_BOOK_CATALOG for backward compatibility
export const MOCK_QUIZ_BOOKS = QUIZ_BOOK_CATALOG;
