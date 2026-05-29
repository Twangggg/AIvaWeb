"use client";

import { useTheme } from "@/lib/providers/theme-provider";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";

export function ThemeLanguageControls() {
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-on-glass)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        {locale === "vi" ? "EN" : "VI"}
      </button>

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-on-glass)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        <span className="material-symbols-outlined text-lg">
          {theme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </button>
    </div>
  );
}
