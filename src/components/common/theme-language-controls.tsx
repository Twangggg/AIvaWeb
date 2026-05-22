"use client";

import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";

export function ThemeLanguageControls() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.08em] text-on-surface-variant outline-none transition-all focus-visible:border-brand-gold/30"
      >
        <option value="vi">VI</option>
        <option value="en">EN</option>
      </select>

      <select
        value={theme ?? "light"}
        onChange={(event) => setTheme(event.target.value)}
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.08em] text-on-surface-variant outline-none transition-all focus-visible:border-brand-gold/30"
      >
        <option value="light">{t.light}</option>
        <option value="dark">{t.dark}</option>
      </select>
    </div>
  );
}
