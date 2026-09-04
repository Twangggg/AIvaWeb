"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useI18n } from "@/lib/i18n/provider";

type Mode = "login" | "register";

export function AuthPanel() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const mode: Mode = pathname?.includes("/register") ? "register" : "login";
  const title = mode === "login" ? t.consoleLogin : t.consoleRegister;
  const direction = mode === "register" ? 1 : -1;

  const switchMode = (next: Mode) => {
    router.push(next === "login" ? "/console/login" : "/console/register");
  };

  return (
    <AuthLayout title={title} mode={mode}>
      <div className="mb-5 flex rounded-xl bg-[#e2d5b8]/55 p-1">
        {(
          [
            { id: "login" as const, label: t.consoleLogin },
            { id: "register" as const, label: t.consoleRegister },
          ]
        ).map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchMode(tab.id)}
              className={`relative min-h-10 flex-1 rounded-lg text-sm font-semibold transition ${
                active ? "text-[#1a1400]" : "text-[#6b5f4a] hover:text-[#2a241c]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 rounded-lg bg-[#eab308]"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={mode}
            custom={direction}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    clipPath:
                      direction > 0
                        ? "inset(0 0 100% 0 round 12px)"
                        : "inset(100% 0 0 0 round 12px)",
                  }
            }
            animate={{
              opacity: 1,
              clipPath: "inset(0 0 0 0 round 12px)",
            }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    clipPath:
                      direction > 0
                        ? "inset(100% 0 0 0 round 12px)"
                        : "inset(0 0 100% 0 round 12px)",
                  }
            }
            transition={{
              duration: reduceMotion ? 0.15 : 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
            layout
          >
            {mode === "login" ? (
              <LoginForm embedded onSwitch={() => switchMode("register")} />
            ) : (
              <RegisterForm embedded onSwitch={() => switchMode("login")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
