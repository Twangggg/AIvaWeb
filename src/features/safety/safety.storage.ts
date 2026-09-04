export type PersonaId = "robot" | "bear" | "mentor";

export type SafetySettings = {
  dailyLimitMinutes: number;
  bedtime: boolean;
  bedtimeStart: string;
  bedtimeEnd: string;
  schoolMode: boolean;
  toxicBlock: boolean;
  ageVoice: boolean;
  safeSearch: boolean;
  persona: PersonaId;
  classroomMode: boolean;
  usageMinutesToday: number;
  usageDate: string;
};

export type ChildProfile = {
  id: string;
  name: string;
  persona: PersonaId;
  ageYears: number;
};

type ChildrenState = {
  children: ChildProfile[];
  activeChildId: string;
};

const SAFETY_KEY = "aiva_safety_settings";
const CHILDREN_KEY = "aiva_children";

export const DEFAULT_SAFETY: SafetySettings = {
  dailyLimitMinutes: 120,
  bedtime: false,
  bedtimeStart: "20:00",
  bedtimeEnd: "07:00",
  schoolMode: false,
  toxicBlock: true,
  ageVoice: true,
  safeSearch: true,
  persona: "mentor",
  classroomMode: false,
  usageMinutesToday: 0,
  usageDate: new Date().toISOString().slice(0, 10),
};

export const DEFAULT_CHILD: ChildProfile = {
  id: "child-1",
  name: "Lớp",
  persona: "mentor",
  ageYears: 7,
};

const DEFAULT_CHILDREN: ChildrenState = {
  children: [DEFAULT_CHILD],
  activeChildId: DEFAULT_CHILD.id,
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export async function loadSafetySettings(): Promise<SafetySettings> {
  const parsed = { ...DEFAULT_SAFETY, ...readJson<Partial<SafetySettings>>(SAFETY_KEY, {}) };
  const today = new Date().toISOString().slice(0, 10);
  if (parsed.usageDate !== today) {
    parsed.usageDate = today;
    parsed.usageMinutesToday = 0;
  }
  return parsed;
}

export async function saveSafetySettings(settings: SafetySettings): Promise<void> {
  writeJson(SAFETY_KEY, settings);
}

export async function loadChildrenState(): Promise<ChildrenState> {
  const parsed = readJson<ChildrenState>(CHILDREN_KEY, DEFAULT_CHILDREN);
  if (!parsed.children?.length) return DEFAULT_CHILDREN;
  if (!parsed.children.some((c) => c.id === parsed.activeChildId)) {
    parsed.activeChildId = parsed.children[0].id;
  }
  return parsed;
}

export async function saveChildrenState(state: ChildrenState): Promise<void> {
  writeJson(CHILDREN_KEY, state);
}

export async function getActiveChild(): Promise<ChildProfile> {
  const state = await loadChildrenState();
  return state.children.find((c) => c.id === state.activeChildId) ?? state.children[0] ?? DEFAULT_CHILD;
}

export async function upsertChild(child: ChildProfile): Promise<ChildrenState> {
  const state = await loadChildrenState();
  const idx = state.children.findIndex((c) => c.id === child.id);
  const children =
    idx >= 0 ? state.children.map((c) => (c.id === child.id ? child : c)) : [...state.children, child];
  const next = { ...state, children, activeChildId: child.id };
  await saveChildrenState(next);
  return next;
}
