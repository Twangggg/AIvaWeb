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
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#0a0c0e] text-[#e1e3e4]">
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
        className="pointer-events-none absolute left-1/2 top-[18%] h-[42vw] max-h-[420px] w-[42vw] max-w-[420px] -translate-x-1/2 rounded-full bg-[#eab308]/20 blur-[100px]"
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
            className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#d4c4a8]/40 bg-[#efe6d4] text-[#2a241c] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.7)]"
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.85 }}
          >
            <div className="flex items-center justify-between border-b border-[#cbb892]/35 bg-[#e8dcc4]/55 px-5 py-3 sm:px-6">
              <Link
                href="/"
                className="text-sm font-medium text-[#6b5f4a] transition hover:text-[#2a241c]"
              >
                {t.consoleBackHome}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
                  className="rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#6b5f4a] transition hover:bg-black/[0.04] hover:text-[#2a241c]"
                >
                  {t.consoleLang}
                </button>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7b2f]">
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
                    className="absolute inset-x-0 text-2xl font-bold tracking-tight text-[#2a241c]"
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
  "min-h-12 w-full rounded-xl border border-[#c9b896] bg-[#faf6ec] px-3.5 text-base text-[#2a241c] outline-none transition placeholder:text-[#9a8b72] focus:border-[#eab308] focus:bg-[#fffdf6] focus:ring-2 focus:ring-[#eab308]/25";

export const authLabelClass = "text-sm font-medium text-[#5c5346]";

export const authErrorClass = "text-sm text-[#b91c1c]";

export const authPrimaryBtnClass =
  "mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#eab308] px-4 text-base font-semibold text-[#1a1400] shadow-[0_10px_24px_-12px_rgba(234,179,8,0.85)] transition hover:bg-[#fbbf24] disabled:cursor-not-allowed disabled:opacity-60";
