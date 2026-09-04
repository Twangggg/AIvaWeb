import { BUILTIN_PACKS } from "./play.packs";
import { DEFAULT_SCORE_RULES, type PlayPack, type ScoreRules } from "./play.types";

const PACKS_KEY = "aiva_play_packs_custom";
const RULES_KEY = "aiva_play_rules";
const JAR_KEY = "aiva_play_jar";
const HISTORY_KEY = "aiva_play_history";

export type JarState = {
  date: string;
  stars: number;
};

export type RoundHistoryEntry = {
  id: string;
  at: string;
  kind: PlayPack["kind"];
  packId: string;
  packTitle: string;
  mode: "solo" | "teams";
  scores: Record<string, number>;
  winnerId: string | null;
  jarStars: number;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

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

export async function loadCustomPacks(): Promise<PlayPack[]> {
  const parsed = readJson<PlayPack[]>(PACKS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export async function saveCustomPacks(packs: PlayPack[]): Promise<void> {
  writeJson(PACKS_KEY, packs);
}

export async function upsertCustomPack(pack: PlayPack): Promise<PlayPack[]> {
  const packs = await loadCustomPacks();
  const next = packs.some((p) => p.id === pack.id)
    ? packs.map((p) => (p.id === pack.id ? pack : p))
    : [...packs, pack];
  await saveCustomPacks(next);
  return next;
}

export async function deleteCustomPack(id: string): Promise<PlayPack[]> {
  const packs = await loadCustomPacks();
  const next = packs.filter((p) => p.id !== id);
  await saveCustomPacks(next);
  return next;
}

export async function allPacks(): Promise<PlayPack[]> {
  const custom = await loadCustomPacks();
  const customIds = new Set(custom.map((p) => p.id));
  return [...custom, ...BUILTIN_PACKS.filter((p) => !customIds.has(p.id))];
}

export async function loadScoreRules(): Promise<ScoreRules> {
  const parsed = readJson<Partial<ScoreRules> | null>(RULES_KEY, null);
  if (!parsed) return DEFAULT_SCORE_RULES;
  return { ...DEFAULT_SCORE_RULES, ...parsed };
}

export async function saveScoreRules(rules: ScoreRules): Promise<void> {
  writeJson(RULES_KEY, rules);
}

export async function loadJar(): Promise<JarState> {
  const parsed = readJson<JarState | null>(JAR_KEY, null);
  if (!parsed) return { date: today(), stars: 0 };
  if (parsed.date !== today()) return { date: today(), stars: 0 };
  return parsed;
}

export async function saveJar(jar: JarState): Promise<void> {
  writeJson(JAR_KEY, jar);
}

export async function addJarStars(delta: number): Promise<JarState> {
  const jar = await loadJar();
  const next = { date: today(), stars: Math.max(0, jar.stars + delta) };
  await saveJar(next);
  return next;
}

export async function loadRoundHistory(): Promise<RoundHistoryEntry[]> {
  const parsed = readJson<RoundHistoryEntry[]>(HISTORY_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export async function appendRoundHistory(entry: RoundHistoryEntry): Promise<void> {
  const prev = await loadRoundHistory();
  writeJson(HISTORY_KEY, [entry, ...prev].slice(0, 50));
}
