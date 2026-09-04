import type { Tokens } from "./auth.types";
import { createAuthWebStorage, getRememberMe } from "./auth.persist";

const STORAGE_KEY = "aiva_auth_tokens";
const webStorage = createAuthWebStorage();

export function loadTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = webStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export function saveTokens(tokens: Tokens | null): void {
  if (typeof window === "undefined") return;
  if (!tokens) {
    webStorage.removeItem(STORAGE_KEY);
    return;
  }
  // Re-read remember flag so login without “remember me” stays in sessionStorage.
  void getRememberMe();
  webStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}
