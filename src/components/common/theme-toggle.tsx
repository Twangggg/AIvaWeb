"use client";

import { useTheme } from "@/lib/providers/theme-provider";
import { useI18n } from "@/lib/i18n/provider";

/** Animated sun ↔ moon theme toggle. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? t.light : t.dark}
      aria-label={isDark ? t.light : t.dark}
      aria-pressed={isDark}
      className="theme-toggle group relative inline-flex size-9 items-center justify-center overflow-hidden rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] transition hover:border-[var(--console-accent)]/40"
    >
      <span className="theme-toggle__glow" aria-hidden />
      <svg
        className={`theme-toggle__icon ${isDark ? "is-dark" : "is-light"}`}
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        aria-hidden
      >
        {/* Sun core */}
        <circle className="theme-toggle__sun" cx="12" cy="12" r="4.2" />
        {/* Rays */}
        <g className="theme-toggle__rays">
          <line x1="12" y1="2.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21.5" y2="12" />
          <line x1="4.9" y1="4.9" x2="6.7" y2="6.7" />
          <line x1="17.3" y1="17.3" x2="19.1" y2="19.1" />
          <line x1="4.9" y1="19.1" x2="6.7" y2="17.3" />
          <line x1="17.3" y1="6.7" x2="19.1" y2="4.9" />
        </g>
        {/* Moon (crescent via overlapping circles) */}
        <g className="theme-toggle__moon">
          <path d="M14.2 4.4a7.2 7.2 0 1 0 5.4 12.1A6.2 6.2 0 0 1 14.2 4.4Z" />
        </g>
        {/* Stars */}
        <g className="theme-toggle__stars">
          <circle cx="7.2" cy="7" r="0.7" />
          <circle cx="9.5" cy="4.8" r="0.45" />
          <circle cx="5.5" cy="10.5" r="0.55" />
        </g>
      </svg>
    </button>
  );
}
