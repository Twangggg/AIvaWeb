import type { Tokens } from "./auth.types";

const STORAGE_KEY = "aiva_auth_tokens";

export function loadTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export function saveTokens(tokens: Tokens | null): void {
  if (typeof window === "undefined") return;
  if (!tokens) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}
