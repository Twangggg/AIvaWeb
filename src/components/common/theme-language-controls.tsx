"use client";

import { useTheme } from "@/lib/providers/theme-provider";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";

export function ThemeLanguageControls() {
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <button
        type="button"
        onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all hover:bg-[var(--bg-subtle)]"
        style={{ color: "var(--text-muted)" }}
        aria-label={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      >
        {locale === "vi" ? "EN" : "VI"}
      </button>

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-subtle)]"
        style={{ color: "var(--text-muted)" }}
        aria-label={theme === "dark" ? "Switch to Light mode" : "Chuyển sang Giao diện tối"}
      >
        <span className="material-symbols-outlined text-base sm:text-lg">
          {theme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </button>
    </div>
  );
}
