"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LOCALES, messages, type Locale } from "@/lib/i18n/messages";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof messages)[Locale];
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "aiva_locale";
const DEFAULT_LOCALE: Locale = "vi";
const LOCALE_CODES = new Set(LOCALES.map((l) => l.code));

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && LOCALE_CODES.has(saved as Locale) ? (saved as Locale) : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start with the same default on server + first client paint to avoid hydration mismatch.
  // Restore localStorage preference after mount (same pattern as ThemeProvider).
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const initial = readStoredLocale();
    // Restore persisted locale after hydration — intentional one-time sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydrate
    setLocaleState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: messages[locale],
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
