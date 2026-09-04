const KEY = "aiva_iot_bot_url";

export function loadIotBotUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function saveIotBotUrl(url: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, url);
}

export function clearIotBotUrl(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
