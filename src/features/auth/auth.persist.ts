const REMEMBER_KEY = "aiva_auth_remember";
const EMAIL_KEY = "aiva_auth_remembered_email";

/** Default true — keep session across browser restarts unless user opts out. */
export function getRememberMe(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(REMEMBER_KEY) !== "0";
}

export function setRememberMe(remember: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
}

export function loadRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(EMAIL_KEY) || "";
  } catch {
    return "";
  }
}

export function saveRememberedEmail(email: string | null): void {
  if (typeof window === "undefined") return;
  if (!email) {
    window.localStorage.removeItem(EMAIL_KEY);
    return;
  }
  window.localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
}

function activeStore(): Storage {
  return getRememberMe() ? window.localStorage : window.sessionStorage;
}

function otherStore(): Storage {
  return getRememberMe() ? window.sessionStorage : window.localStorage;
}

/** Supabase-compatible storage that honors “remember me”. */
export function createAuthWebStorage(): {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
} {
  const isCodeVerifier = (key: string) => key.endsWith("-code-verifier");
  return {
    getItem: (key) => {
      if (typeof window === "undefined") return null;
      if (isCodeVerifier(key)) return window.localStorage.getItem(key);
      return activeStore().getItem(key) ?? otherStore().getItem(key);
    },
    setItem: (key, value) => {
      if (typeof window === "undefined") return;
      if (isCodeVerifier(key)) {
        window.localStorage.setItem(key, value);
        window.sessionStorage.removeItem(key);
        return;
      }
      activeStore().setItem(key, value);
      otherStore().removeItem(key);
    },
    removeItem: (key) => {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    },
  };
}

export function clearAuthWebStorageKeys(keys: string[]): void {
  if (typeof window === "undefined") return;
  for (const key of keys) {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }
}
