import { create } from "zustand";

export type PlayMode = "3d" | "scroll";

export type StationId =
  | "avia-quiz"
  | "vision-quest"
  | "garden"
  | "sequence"
  | "route"
  | "du-ky";

export interface StationMeta {
  id: StationId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  position: [number, number, number];
}

export const STATIONS: StationMeta[] = [
  {
    id: "avia-quiz",
    title: "Tháp Đố Vui Avia",
    subtitle: "Thử thách kiến thức SGK Lớp 1 - 5 cùng Ếch Avia",
    emoji: "🐸",
    color: "#10b981", // Emerald
    position: [0, 0, -8],
  },
  {
    id: "vision-quest",
    title: "Kính Khám Phá AI",
    subtitle: "Ống kính thông minh quét và nhận diện đồ vật",
    emoji: "🔍",
    color: "#f59e0b", // Amber
    position: [8, 0, -4],
  },
  {
    id: "garden",
    title: "Giải Cứu Khu Vườn",
    subtitle: "Né bọ tuần tra, nhặt mảnh ghép năng lượng",
    emoji: "🌸",
    color: "#34d399", // Mint green
    position: [-8, 0, -4],
  },
  {
    id: "sequence",
    title: "Mật Mã Năng Lượng",
    subtitle: "Ghi nhớ chuỗi quang học mở khóa bí mật",
    emoji: "⚡",
    color: "#d946ef", // Fuchsia
    position: [7, 0, 5],
  },
  {
    id: "route",
    title: "Kỹ Sư Đường Đi",
    subtitle: "Lập trình dẫn đường vượt qua chướng ngại vật",
    emoji: "🗺️",
    color: "#06b6d4", // Cyan
    position: [-7, 0, 5],
  },
  {
    id: "du-ky",
    title: "Cuốn Sổ Du Ký & Tủ Tem",
    subtitle: "Nhật ký hành trình và bộ sưu tập tem thưởng của bé",
    emoji: "📖",
    color: "#e11d48", // Rose
    position: [0, 0, 1],
  },
];

interface PlayModeState {
  mode: PlayMode;
  setMode: (mode: PlayMode) => void;
  nearbyStation: StationId | null;
  setNearbyStation: (station: StationId | null) => void;
  dukyOpen: boolean;
  setDukyOpen: (open: boolean) => void;
  unlockedStamps: string[];
  addStamp: (stampId: string) => void;
  joystick: { x: number; y: number };
  setJoystick: (vec: { x: number; y: number }) => void;
  jumpCount: number;
  triggerJump: () => void;
  kidName: string;
  setKidName: (name: string) => void;
  isHydrated: boolean;
  hydrateFromStorage: () => void;
}

const STORAGE_MODE_KEY = "aiva_play_mode_v1";
const STORAGE_STAMPS_KEY = "aiva_unlocked_stamps_v1";
const STORAGE_NAME_KEY = "aiva_kid_name_v1";

export const usePlayModeStore = create<PlayModeState>((set) => ({
  mode: "3d", // Deterministic initial value across SSR and initial client render
  setMode: (mode) => {
    set({ mode });
    try {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch {}
  },
  nearbyStation: null,
  setNearbyStation: (nearbyStation) => set({ nearbyStation }),
  dukyOpen: false,
  setDukyOpen: (dukyOpen) => set({ dukyOpen }),
  unlockedStamps: ["du-ky"],
  addStamp: (stampId) => {
    set((state) => {
      if (state.unlockedStamps.includes(stampId)) return state;
      const next = [...state.unlockedStamps, stampId];
      try {
        localStorage.setItem(STORAGE_STAMPS_KEY, JSON.stringify(next));
      } catch {}
      return { unlockedStamps: next };
    });
  },
  joystick: { x: 0, y: 0 },
  setJoystick: (joystick) => set({ joystick }),
  jumpCount: 0,
  triggerJump: () => set((state) => ({ jumpCount: state.jumpCount + 1 })),
  kidName: "Bé Yêu",
  setKidName: (kidName) => {
    set({ kidName });
    try {
      localStorage.setItem(STORAGE_NAME_KEY, kidName);
    } catch {}
  },
  isHydrated: false,
  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
      const savedStamps = localStorage.getItem(STORAGE_STAMPS_KEY);
      const savedName = localStorage.getItem(STORAGE_NAME_KEY);
      const updates: Partial<PlayModeState> = { isHydrated: true };
      if (savedMode === "3d" || savedMode === "scroll") {
        updates.mode = savedMode;
      }
      if (savedStamps) {
        const parsed = JSON.parse(savedStamps);
        if (Array.isArray(parsed)) updates.unlockedStamps = parsed;
      }
      if (savedName) {
        updates.kidName = savedName;
      }
      set(updates);
    } catch {
      set({ isHydrated: true });
    }
  },
}));
