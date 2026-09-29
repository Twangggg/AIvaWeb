"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

import { useI18n } from "@/lib/i18n/provider";

type AuthLayoutProps = {
  title: string;
  mode?: "login" | "register";
  children: React.ReactNode;
};

export function AuthLayout({ title, mode = "login", children }: AuthLayoutProps) {
  const reduceMotion = useReducedMotion();
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="auth-canvas relative flex min-h-dvh flex-col overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(234,179,8,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(255,216,77,0.08), transparent 50%)",
        }}
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] h-[42vw] max-h-[420px] w-[42vw] max-w-[420px] -translate-x-1/2 rounded-full bg-[var(--ocean-alpha)] blur-[100px]"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: mode === "register" ? 1.15 : 1,
                x: mode === "register" ? 40 : -20,
                opacity: mode === "register" ? 0.45 : 0.28,
              }
        }
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-12">
        <LayoutGroup>
          <motion.div
            layout
            className="auth-surface auth-border w-full max-w-[420px] overflow-hidden rounded-2xl border shadow-[var(--shadow-modal)]"
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.85 }}
          >
            <div className="auth-surface-tint auth-border flex items-center justify-between border-b px-5 py-3 sm:px-6">
              <Link
                href="/"
                className="auth-muted text-sm font-medium transition hover:opacity-70"
              >
                {t.consoleBackHome}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
                  className="auth-muted rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide transition hover:opacity-70"
                >
                  {t.consoleLang}
                </button>
                <span className="ui-accent text-[11px] font-semibold uppercase tracking-[0.18em]">
                  {t.consoleBadge}
                </span>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
              <div className="relative mb-5 h-8 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={`${locale}-${title}`}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "-90%" }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="auth-text absolute inset-x-0 text-2xl font-bold tracking-tight"
                  >
                    {title}
                  </motion.h2>
                </AnimatePresence>
              </div>
              {children}
            </div>
          </motion.div>
        </LayoutGroup>
      </main>
    </div>
  );
}

export const authFieldClass =
  "auth-surface-soft auth-border auth-text min-h-12 w-full rounded-xl border px-3.5 text-base outline-none transition placeholder:text-[var(--auth-placeholder)] focus:border-[var(--ocean)] focus:ring-2 focus:ring-[var(--ocean-alpha)]";

export const authLabelClass = "auth-text text-sm font-medium";

export const authErrorClass = "ui-danger text-sm";

export const authPrimaryBtnClass =
  "mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--ocean)] px-4 text-base font-semibold text-[var(--text-on-accent)] shadow-[var(--shadow-glow)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";
