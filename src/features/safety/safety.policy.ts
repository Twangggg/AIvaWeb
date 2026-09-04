import {
  loadSafetySettings,
  saveSafetySettings,
  type SafetySettings,
} from "./safety.storage";

export type SafetyBlockReason = "bedtime" | "school" | "dailyLimit" | null;

export type SafetyGateResult = {
  allowed: boolean;
  reason: SafetyBlockReason;
  messageVi: string;
  messageEn: string;
};

/** Parse "HH:MM" → minutes from midnight. */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => Number(x));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

/** True if `now` is inside [start, end), supporting overnight windows. */
export function isInTimeWindow(nowMinutes: number, start: string, end: string): boolean {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s === e) return false;
  if (s < e) return nowMinutes >= s && nowMinutes < e;
  return nowMinutes >= s || nowMinutes < e;
}

export function evaluateSafetyGateSync(settings: SafetySettings, now = new Date()): SafetyGateResult {
  const mins = now.getHours() * 60 + now.getMinutes();

  if (settings.bedtime && isInTimeWindow(mins, settings.bedtimeStart, settings.bedtimeEnd)) {
    return {
      allowed: false,
      reason: "bedtime",
      messageVi: `Đang giờ ngủ (${settings.bedtimeStart}–${settings.bedtimeEnd}).`,
      messageEn: `Bedtime window (${settings.bedtimeStart}–${settings.bedtimeEnd}).`,
    };
  }

  if (settings.schoolMode && !settings.classroomMode) {
    // School mode without classroom override blocks casual play outside class control.
    // Teachers on console typically enable classroomMode when running a lesson.
    return {
      allowed: false,
      reason: "school",
      messageVi: "School mode đang bật — bật Classroom mode để chơi trên console.",
      messageEn: "School mode is on — enable Classroom mode to play on console.",
    };
  }

  if (settings.usageMinutesToday >= settings.dailyLimitMinutes) {
    return {
      allowed: false,
      reason: "dailyLimit",
      messageVi: `Đã hết ${settings.dailyLimitMinutes} phút hôm nay.`,
      messageEn: `Daily limit of ${settings.dailyLimitMinutes} minutes reached.`,
    };
  }

  return { allowed: true, reason: null, messageVi: "", messageEn: "" };
}

export async function evaluateSafetyGate(): Promise<SafetyGateResult> {
  const settings = await loadSafetySettings();
  return evaluateSafetyGateSync(settings);
}

export async function recordUsageMinutes(minutes: number): Promise<SafetySettings> {
  const settings = await loadSafetySettings();
  const today = new Date().toISOString().slice(0, 10);
  const next: SafetySettings = {
    ...settings,
    usageDate: today,
    usageMinutesToday:
      settings.usageDate === today
        ? settings.usageMinutesToday + Math.max(1, minutes)
        : Math.max(1, minutes),
  };
  await saveSafetySettings(next);
  return next;
}
