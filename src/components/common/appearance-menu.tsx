"use client";

import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { LOCALES, type Locale } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/provider";

/** Settings: language list + animated sun/moon theme toggle. */
export function AppearanceMenu({ align = "right" }: { align?: "left" | "right" }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative flex items-center gap-1.5" ref={rootRef}>
      <ThemeToggle />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={t.langLabel}
        aria-label={t.langLabel}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] text-[var(--console-muted)] transition hover:text-[var(--console-fg)]"
      >
        <span className="material-symbols-outlined text-[20px]">translate</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.langLabel}
          className={`absolute top-[calc(100%+0.5rem)] z-50 w-[14rem] rounded-xl border border-[var(--console-border)] bg-[var(--console-rail)] p-1.5 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--console-muted)]">
            {t.langLabel}
          </p>
          <ul className="flex flex-col gap-0.5">
            {LOCALES.map((item) => {
              const active = locale === item.code;
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLocale(item.code as Locale);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      active
                        ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
                        : "text-[var(--console-fg)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="font-medium">{item.nativeLabel}</span>
                    <span className={`text-xs ${active ? "opacity-80" : "text-[var(--console-muted)]"}`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
