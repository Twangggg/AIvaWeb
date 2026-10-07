"use client";

import { useState } from "react";
import {
  FloatingPortal,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { useFloatingSurface } from "@/hooks/use-floating-surface";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { LOCALES, type Locale } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/provider";

/** Settings: language list + animated sun/moon theme toggle. */
export function AppearanceMenu({
  align = "right",
}: {
  align?: "left" | "right";
}) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const { setReference, setFloating, floatingStyles, context, isPositioned } =
    useFloatingSurface({
      open,
      onOpenChange: setOpen,
      placement: align === "right" ? "bottom-end" : "bottom-start",
      width: 224,
    });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <div className="relative flex items-center gap-1.5">
      <ThemeToggle />

      <button
        ref={setReference}
        {...getReferenceProps()}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        title={t.langLabel}
        aria-label={t.langLabel}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] text-[var(--console-muted)] transition hover:text-[var(--console-fg)]"
      >
        <span className="material-symbols-outlined text-[20px]">translate</span>
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={setFloating}
            {...getFloatingProps()}
            style={{
              ...floatingStyles,
              visibility: isPositioned ? "visible" : "hidden",
            }}
            role="listbox"
            aria-label={t.langLabel}
            className="z-[70] overflow-y-auto rounded-xl border border-[var(--console-border)] bg-[var(--console-rail)] p-1.5 shadow-lg"
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
                      <span
                        className={`text-xs ${active ? "opacity-80" : "text-[var(--console-muted)]"}`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
