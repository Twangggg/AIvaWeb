import { GradeLevel, QuizBook } from "./types";
import { GRADE_1_TNXH_BOOK } from "./data/grade1-tnxh";
import { GRADE_1_HDTN_BOOK } from "./data/grade1-hdtn";
import { GRADE_2_TNXH_BOOK } from "./data/grade2-tnxh";
import { GRADE_2_HDTN_BOOK } from "./data/grade2-hdtn";

export interface GradeMeta {
  grade: GradeLevel;
  title: string;
  mascotTitle: string;
  mascotImage: string;
  assetStatus: "available";
}

// 5 Khối lớp theo GDD mục 2.1 với các hình ảnh chính xác được chỉ định:
// Ảnh 1: /mascots/trực diện.jpg
// Hình 2: /mascots/ech-non-la.png
// Hình 3: /mascots/ech-khan-quang-do.png
// Hình 4: /mascots/ech-tham-hiem.png
// Hình 5: /mascots/ech-tham-tu.png
export const GRADE_METAS: GradeMeta[] = [
  {
    grade: 1,
    title: "Lớp 1",
    mascotTitle: "Ếch Đeo Cặp Mầm Non",
    mascotImage: "/mascots/trực diện.jpg",
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

// Hình ảnh biểu cảm của Ếch theo đúng chỉ định người dùng:
// Hình 7: Ếch vui vẻ (trạng thái bình thường)
// Hình 8: Ếch cười tươi (khi trả lời đúng / tổng kết)
// Hình 9: Ếch buồn (khi trả lời sai)
export const FROG_REACTION_IMAGES = {
  idle: "/mascots/ech-vui-ve.png",
  correct: "/mascots/ech-cuoi-tuoi.png",
  wrong: "/mascots/ech-buon.png",
};

// Danh sách sách môn học theo GDD mục 2.2:
// Bìa sách dùng Hình 6: /mascots/bia-sach-mon-hoc.png
export const MOCK_QUIZ_BOOKS: QuizBook[] = [
  GRADE_1_TNXH_BOOK,
  GRADE_1_HDTN_BOOK,
  GRADE_2_TNXH_BOOK,
  GRADE_2_HDTN_BOOK,
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
          {
            id: "l1-daoduc",
            lessonNumber: 1,
            title: "Bài 1",
            questions: [], // BỎ TRỐNG: Chờ người dùng nạp bộ câu hỏi
          },
          {
            id: "l2-daoduc",
            lessonNumber: 2,
            title: "Bài 2",
            questions: [], // BỎ TRỐNG: Chờ người dùng nạp bộ câu hỏi
          },
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
        lessons: [
          {
            id: "l1-amnhac",
            lessonNumber: 1,
            title: "Bài 1",
            questions: [], // BỎ TRỐNG: Chờ người dùng nạp bộ câu hỏi
          },
        ],
      },
    ],
  },
];
