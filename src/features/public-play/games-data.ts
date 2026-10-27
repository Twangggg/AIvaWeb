export type GameId =
  | "avia-quiz"
  | "vision-quest"
  | "garden"
  | "sequence"
  | "route";

export interface GameItem {
  id: GameId;
  title: string;
  description: string;
  accent: string;
  borderGlow: string;
  image: string;
}

export const GAMES: GameItem[] = [
  {
    id: "avia-quiz",
    title: "Avia Quiz Game 🐸",
    description:
      "Cùng Ếch Avia vượt mốc bài học SGK Lớp 1 - 5, bứt phá chuỗi combo đúng rực lửa và chinh phục các huy hiệu danh giá!",
    accent: "border-emerald-400/60 hover:bg-emerald-400/10",
    borderGlow:
      "border-emerald-400/50 hover:border-emerald-400 hover:shadow-emerald-500/20",
    image: "/games/avia-quiz.webp",
  },
  {
    id: "vision-quest",
    title: "AIVA Vision Quest",
    description:
      "Dùng ống kính AI quét và nhận diện đồ vật quanh bé, tích lũy điểm nhận Bằng Khám Phá Nhí.",
    accent: "border-amber-400/50 hover:bg-amber-400/10",
    borderGlow:
      "border-amber-400/50 hover:border-amber-400 hover:shadow-amber-500/20",
    image: "/games/robot-portal.webp",
  },
  {
    id: "garden",
    title: "Giải cứu khu vườn",
    description:
      "Né bọ tuần tra, gỡ bẫy thông minh, nhặt đủ mảnh năng lượng và mở cánh cổng bí mật.",
    accent: "border-emerald-300/50 hover:bg-emerald-300/10",
    borderGlow:
      "border-emerald-400/40 hover:border-emerald-400 hover:shadow-emerald-500/20",
    image: "/games/garden-maze.webp",
  },
  {
    id: "sequence",
    title: "Mật mã năng lượng",
    description:
      "Quan sát và ghi nhớ chuỗi ánh sáng quang học ngày một dài hơn để mở khóa mật mã.",
    accent: "border-fuchsia-300/50 hover:bg-fuchsia-300/10",
    borderGlow:
      "border-fuchsia-400/40 hover:border-fuchsia-400 hover:shadow-fuchsia-500/20",
    image: "/games/energy-code.webp",
  },
  {
    id: "route",
    title: "Kỹ sư đường đi",
    description:
      "Kéo thả và sắp xếp các khối lệnh điều hướng để dẫn AIVA vượt qua mọi chướng ngại.",
    accent: "border-cyan-300/50 hover:bg-cyan-300/10",
    borderGlow:
      "border-cyan-400/40 hover:border-cyan-400 hover:shadow-cyan-500/20",
    image: "/games/route-builder.webp",
  },
];

export function getGameById(id: string): GameItem | undefined {
  return GAMES.find((g) => g.id === id);
}

export function isValidGameId(id: string): id is GameId {
  return GAMES.some((g) => g.id === id);
}
