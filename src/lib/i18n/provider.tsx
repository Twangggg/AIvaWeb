"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { messages, type Locale } from "@/lib/i18n/messages";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof messages)[Locale];
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "aiva_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "vi";
    }

    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    return saved === "vi" || saved === "en" ? saved : "vi";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: messages[locale]
    }),
    [locale]
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
