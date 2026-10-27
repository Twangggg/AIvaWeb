import { create } from "zustand";

export type GardenMode = "garden" | "scroll";

export type GardenStationId =
  | "gate"
  | "glasses"
  | "vision"
  | "features"
  | "safety"
  | "parent"
  | "colors"
  | "minigames"
  | "preorder";

export interface GardenStationMeta {
  id: GardenStationId;
  index: number;
  number: string;
  title: string;
  tagline: string;
  emoji: string;
  themeColor: string;
  position: [number, number, number];
  storyDescription: string;
}

export const GARDEN_STATIONS: GardenStationMeta[] = [
  {
    id: "gate",
    index: 0,
    number: "01",
    title: "Cổng Chào & Sứ Mệnh AIva",
    tagline: "Người bạn AI thông minh cùng bé lớn khôn",
    emoji: "🌱",
    themeColor: "#10b981", // Emerald
    position: [0, 0, 26],
    storyDescription:
      "Chào mừng bé và gia đình đến với Khu Vườn Khám Phá! AIva ra đời với sứ mệnh mang đến người bạn đồng hành trí tuệ nhân tạo nhân văn, bảo vệ trẻ thơ và nuôi dưỡng trí tò mò.",
  },
  {
    id: "glasses",
    index: 1,
    number: "02",
    title: "Xưởng Kính Thông Minh 3D",
    tagline: "Thiết kế siêu nhẹ, công nghệ thị giác máy tính",
    emoji: "👓",
    themeColor: "#06b6d4", // Cyan
    position: [-10, 0, 19],
    storyDescription:
      "Chiếc kính AIva chỉ nặng 32 gram với khung titan mềm mại, tích hợp camera quang học góc rộng và loa truyền âm định hướng an toàn cho màng nhĩ bé.",
  },
  {
    id: "vision",
    index: 2,
    number: "03",
    title: "Đồi Khám Phá Tri Thức",
    tagline: "AI nhận diện vạn vật & giải đáp triệu câu hỏi",
    emoji: "🔍",
    themeColor: "#f59e0b", // Amber
    position: [10, 0, 12],
    storyDescription:
      "Bé chỉ cần nhìn vào bông hoa, chú bọ rùa hay vì sao trên trời, AIva sẽ thì thầm kể cho bé nghe những kiến thức khoa học kỳ thú bằng ngôn ngữ trẻ thơ.",
  },
  {
    id: "features",
    index: 3,
    number: "04",
    title: "Ngôi Nhà Tính Năng Đột Phá",
    tagline: "Trò chuyện giọng nói cảm xúc & Gia sư SGK",
    emoji: "⚡",
    themeColor: "#8b5cf6", // Purple
    position: [-11, 0, 5],
    storyDescription:
      "Gia sư đồng hành bám sát chương trình SGK Lớp 1 - 5, luyện nói tiếng Anh tự nhiên và rèn luyện tư duy phản biện qua các cuộc trò chuyện hàng ngày.",
  },
  {
    id: "safety",
    index: 4,
    number: "05",
    title: "Trạm Bảo Vệ Thị Lực & An Toàn",
    tagline: "Nói không với màn hình phát sáng hại mắt",
    emoji: "🛡️",
    themeColor: "#14b8a6", // Teal
    position: [11, 0, -2],
    storyDescription:
      "Không phát ánh sáng xanh trực tiếp vào võng mạc, khuyến khích bé vận động ngoài trời và tự động lọc nội dung độc hại 100% bằng bộ lọc an toàn AI.",
  },
  {
    id: "parent",
    index: 5,
    number: "06",
    title: "Góc Bố Mẹ Đồng Hành",
    tagline: "Thấu hiểu hành trình lớn khôn của con mỗi ngày",
    emoji: "🏡",
    themeColor: "#f97316", // Orange
    position: [-10, 0, -9],
    storyDescription:
      "Ứng dụng phụ huynh thông minh: xem báo cáo câu hỏi trong ngày của bé, biểu đồ năng khiếu nổi trội và thiết lập giới hạn giờ sử dụng an tâm.",
  },
  {
    id: "colors",
    index: 6,
    number: "07",
    title: "Xưởng Sắc Màu Cá Tính",
    tagline: "3 gam màu ngọt ngào thời trang cho bé yêu",
    emoji: "🎨",
    themeColor: "#ec4899", // Pink
    position: [10, 0, -16],
    storyDescription:
      "Chọn ngay phong cách của bé: Xanh Bạc Hà Năng Động (Mint Green), Hồng Kẹo Ngọt (Pastel Pink) hay Vàng Kem Hoàng Tử (Butter Yellow).",
  },
  {
    id: "minigames",
    index: 7,
    number: "08",
    title: "Lối Rẽ Vào Khu Trò Chơi",
    tagline: "Học mà chơi cùng Ếch Avia và Đấu trí trí tuệ",
    emoji: "🎡",
    themeColor: "#6366f1", // Indigo
    position: [-9, 0, -23],
    storyDescription:
      "Kho mini-games bổ ích: Vượt chướng ngại vật Quiz SGK, Mê cung năng lượng và Lập trình đường đi thông minh.",
  },
  {
    id: "preorder",
    index: 8,
    number: "09",
    title: "Vườn Ước Mơ & Đặt Hàng Trước",
    tagline: "Mở hộp tương lai - Nhận bộ quà tặng độc quyền",
    emoji: "🎁",
    themeColor: "#e11d48", // Rose
    position: [0, 0, -29],
    storyDescription:
      "Trở thành 500 gia đình đầu tiên tại Việt Nam sở hữu AIva với gói quà tặng 1 năm học tiếng Anh và ốp bảo vệ silicon phong cách.",
  },
];

export type TimeOfDay = "day" | "sunset" | "night";

export interface GardenShardMeta {
  id: string;
  name: string;
  stationHint: string;
  position: [number, number, number];
  color: string;
}

export const GARDEN_SHARDS: GardenShardMeta[] = [
  { id: "shard-1", name: "Hạt Bình Minh", stationHint: "Cổng Chào AIva", position: [3.5, 0.7, 25.5], color: "#fef08a" },
  { id: "shard-2", name: "Hạt Pha Lê Xanh", stationHint: "Ven Đường Đá Sỏi", position: [-5.5, 0.7, 22], color: "#38bdf8" },
  { id: "shard-3", name: "Hạt Thị Giác Quang Học", stationHint: "Sau Xưởng Kính", position: [-14, 0.7, 18], color: "#06b6d4" },
  { id: "shard-4", name: "Hạt Suối Mơ", stationHint: "Lối Lên Đồi Cỏ", position: [4.8, 0.7, 15.5], color: "#a7f3d0" },
  { id: "shard-5", name: "Hạt Ngôi Sao Tri Thức", stationHint: "Đồi Thiên Văn", position: [14, 0.7, 11], color: "#f59e0b" },
  { id: "shard-6", name: "Hạt Nấm Nhún", stationHint: "Nấm Bật Nhảy Phía Tây", position: [-5.5, 0.7, 9], color: "#ec4899" },
  { id: "shard-7", name: "Hạt Gia Sư Tí Hon", stationHint: "Cạnh Nhà Tính Năng", position: [-15, 0.7, 4.5], color: "#8b5cf6" },
  { id: "shard-8", name: "Hạt Khiên Bảo Vệ", stationHint: "Hồ Sen & Trạm Bảo Vệ", position: [9.5, 0.7, 1.5], color: "#14b8a6" },
  { id: "shard-9", name: "Hạt Trà Ấm Áp", stationHint: "Chòi Nghỉ Chân Gia Đình", position: [-14, 0.7, -9.5], color: "#f97316" },
  { id: "shard-10", name: "Hạt Cọ Vẽ Cầu Vồng", stationHint: "Xưởng Sắc Màu", position: [14, 0.7, -16.5], color: "#f43f5e" },
  { id: "shard-11", name: "Hạt Đấu Trường Vui Nhộn", stationHint: "Cổng Hội Trò Chơi", position: [-6.5, 0.7, -24], color: "#6366f1" },
  { id: "shard-12", name: "Hạt Ước Mơ Tương Lai", stationHint: "Đài Phun Nước Nguyện Ước", position: [0, 0.8, -31], color: "#fbbf24" },
];

interface GardenState {
  mode: GardenMode;
  setMode: (mode: GardenMode) => void;
  activeStationId: GardenStationId | null;
  setActiveStationId: (id: GardenStationId | null) => void;
  nearbyStationId: GardenStationId | null;
  setNearbyStationId: (id: GardenStationId | null) => void;
  currentStationIndex: number;
  setCurrentStationIndex: (idx: number) => void;
  autoWalkTarget: [number, number, number] | null;
  setAutoWalkTarget: (target: [number, number, number] | null) => void;
  clickMoveTarget: [number, number, number] | null;
  setClickMoveTarget: (target: [number, number, number] | null) => void;
  unlockedStamps: string[];
  addStamp: (stationId: string) => void;
  collectedShards: string[];
  addShard: (shardId: string) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  cycleTimeOfDay: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playerModelType: "arms-down-2d" | "3d-mascot";
  setPlayerModelType: (type: "arms-down-2d" | "3d-mascot") => void;
  togglePlayerModelType: () => void;
  photoMode: boolean;
  setPhotoMode: (val: boolean) => void;
  selectedGlassesColor: string;
  setSelectedGlassesColor: (color: string) => void;
  journalOpen: boolean;
  setJournalOpen: (open: boolean) => void;
  kidName: string;
  setKidName: (name: string) => void;
  joystick: { x: number; y: number };
  setJoystick: (vec: { x: number; y: number }) => void;
  jumpCount: number;
  triggerJump: () => void;
  initHydration: () => void;
}

const STORAGE_MODE_KEY = "aiva_home_view_mode_v2";
const STORAGE_STAMPS_KEY = "aiva_garden_stamps_v2";
const STORAGE_SHARDS_KEY = "aiva_garden_shards_v2";
const STORAGE_SOUND_KEY = "aiva_garden_sound_v2";
const STORAGE_NAME_KEY = "aiva_garden_kid_name_v2";

export const useGardenStore = create<GardenState>((set) => ({
  mode: "garden",
  setMode: (mode) => {
    set({ mode });
    try {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch {}
  },
  initHydration: () => {
    if (typeof window === "undefined") return;
    try {
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
      const savedStamps = localStorage.getItem(STORAGE_STAMPS_KEY);
      const savedShards = localStorage.getItem(STORAGE_SHARDS_KEY);
      const savedSound = localStorage.getItem(STORAGE_SOUND_KEY);
      const savedName = localStorage.getItem(STORAGE_NAME_KEY);

      set((state) => ({
        mode:
          savedMode === "garden" || savedMode === "scroll"
            ? (savedMode as GardenMode)
            : state.mode,
        unlockedStamps: savedStamps ? JSON.parse(savedStamps) : state.unlockedStamps,
        collectedShards: savedShards ? JSON.parse(savedShards) : state.collectedShards,
        soundEnabled: savedSound !== null ? savedSound === "true" : state.soundEnabled,
        kidName: savedName || state.kidName,
      }));
    } catch {}
  },
  activeStationId: null,
  setActiveStationId: (activeStationId) => set({ activeStationId }),
  nearbyStationId: null,
  setNearbyStationId: (nearbyStationId) => set({ nearbyStationId }),
  currentStationIndex: 0,
  setCurrentStationIndex: (currentStationIndex) => set({ currentStationIndex }),
  autoWalkTarget: null,
  setAutoWalkTarget: (autoWalkTarget) => set({ autoWalkTarget }),
  clickMoveTarget: null,
  setClickMoveTarget: (clickMoveTarget) => set({ clickMoveTarget }),
  unlockedStamps: ["gate"],
  addStamp: (stationId) => {
    set((state) => {
      if (state.unlockedStamps.includes(stationId)) return state;
      const next = [...state.unlockedStamps, stationId];
      try {
        localStorage.setItem(STORAGE_STAMPS_KEY, JSON.stringify(next));
      } catch {}
      return { unlockedStamps: next };
    });
  },
  collectedShards: [],
  addShard: (shardId) => {
    set((state) => {
      if (state.collectedShards.includes(shardId)) return state;
      const next = [...state.collectedShards, shardId];
      try {
        localStorage.setItem(STORAGE_SHARDS_KEY, JSON.stringify(next));
      } catch {}
      return { collectedShards: next };
    });
  },
  timeOfDay: "day",
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  cycleTimeOfDay: () =>
    set((state) => {
      const order: TimeOfDay[] = ["day", "sunset", "night"];
      const nextIndex = (order.indexOf(state.timeOfDay) + 1) % order.length;
      return { timeOfDay: order[nextIndex] };
    }),
  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    try {
      localStorage.setItem(STORAGE_SOUND_KEY, String(soundEnabled));
    } catch {}
  },
  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      try {
        localStorage.setItem(STORAGE_SOUND_KEY, String(next));
      } catch {}
      return { soundEnabled: next };
    }),
  playerModelType: "arms-down-2d",
  setPlayerModelType: (playerModelType) => set({ playerModelType }),
  togglePlayerModelType: () =>
    set((state) => ({
      playerModelType:
        state.playerModelType === "arms-down-2d" ? "3d-mascot" : "arms-down-2d",
    })),
  photoMode: false,
  setPhotoMode: (photoMode) => set({ photoMode }),
  selectedGlassesColor: "#06b6d4",
  setSelectedGlassesColor: (selectedGlassesColor) => set({ selectedGlassesColor }),
  journalOpen: false,
  setJournalOpen: (journalOpen) => set({ journalOpen }),
  kidName: "Bé Khám Phá",
  setKidName: (kidName) => {
    set({ kidName });
    try {
      localStorage.setItem(STORAGE_NAME_KEY, kidName);
    } catch {}
  },
  joystick: { x: 0, y: 0 },
  setJoystick: (joystick) => set({ joystick }),
  jumpCount: 0,
  triggerJump: () => set((state) => ({ jumpCount: state.jumpCount + 1 })),
}));
