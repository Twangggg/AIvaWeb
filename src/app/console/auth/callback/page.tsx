"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { needsRoleOnboarding } from "@/features/auth/role.storage";
import type { UserInfo } from "@/features/auth/auth.types";
import { AuthLayout, authPrimaryBtnClass } from "@/features/auth/components/auth-layout";
import { useI18n } from "@/lib/i18n/provider";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();
  const applyTokens = useAuthStore((s) => s.applyTokens);
  const [error, setError] = useState<string | null>(null);

  const routeAfterLogin = (user: UserInfo | undefined, fallback: string): string => {
    if (user?.role === "admin") return "/console/admin";
    if (needsRoleOnboarding(user)) return "/console/role";
    return fallback || "/console";
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const code = params.get("code");
      const tokenHash = params.get("token_hash");
      const type = params.get("type");
      const next = params.get("next");
      const isRecovery = type === "recovery" || next === "/console/reset-password";
      const destination = isRecovery ? "/console/reset-password" : next || "/console";
      try {
        const errorCode = params.get("error_code");
        const errorDescription = params.get("error_description") || "";
        if (errorCode) {
          const tokens = await authService.getSessionTokens();
          if (cancelled) return;
          if (tokens) {
            applyTokens(tokens);
            router.replace(
              isRecovery ? destination : routeAfterLogin(tokens?.user, destination),
            );
            return;
          }
          setError(
            /code_not_found|code already used|verifier|expired|suddenly discovered/i.test(
              errorDescription,
            )
              ? t.consoleCallbackSessionExpired
              : t.consoleCallbackFailed,
          );
          return;
        }

        if (code) {
          const tokens = await authService.exchangeCode(code);
          if (cancelled) return;
          applyTokens(tokens);
          router.replace(isRecovery ? destination : routeAfterLogin(tokens?.user, destination));
          return;
        }

        if (tokenHash) {
          const otpType =
            type === "recovery" ? "recovery" : type === "email" ? "email" : "signup";
          const tokens = await authService.verifyEmailOtp(tokenHash, otpType);
          if (cancelled) return;
          applyTokens(tokens);
          router.replace(isRecovery ? destination : routeAfterLogin(tokens?.user, destination));
          return;
        }

        const tokens = await authService.getSessionTokens();
        if (cancelled) return;
        if (tokens) {
          applyTokens(tokens);
          router.replace(isRecovery ? destination : routeAfterLogin(tokens?.user, destination));
          return;
        }

        setError(t.consoleCallbackMissingCode);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "";
        if (/code verifier|verifier not found|PKCE/i.test(message)) {
          const tokens = await authService.getSessionTokens();
          if (cancelled) return;
          if (tokens) {
            applyTokens(tokens);
            router.replace(
              isRecovery ? destination : routeAfterLogin(tokens?.user, destination),
            );
            return;
          }
        }
        const reusedOrExpired =
          /auth_code|reuse|already been used|expired|suddenly discovered/i.test(
            message,
          );
        const rawHttpCode = /^400|bad request|\d{3}\b/i.test(message);
        setError(
          reusedOrExpired
            ? t.consoleCallbackSessionExpired
            : rawHttpCode || !message
              ? t.consoleCallbackFailed
              : message,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, applyTokens, router, t.consoleCallbackMissingCode, t.consoleCallbackFailed, t.consoleCallbackSessionExpired]);

  return (
    <AuthLayout title={t.consoleCallbackTitle}>
      {error ? (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
            {error}
          </p>
          <button type="button" className={authPrimaryBtnClass} onClick={() => router.replace("/console/login")}>
            {t.consoleLogin}
          </button>
        </div>
      ) : (
        <p className="text-sm text-[#6b7280]">{t.consoleCallbackLoading}</p>
      )}
    </AuthLayout>
  );
}

export default function AuthCallbackPage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <AuthLayout title={t.consoleCallbackTitle}>
          <p className="text-sm text-[#6b7280]">{t.consoleCallbackLoading}</p>
        </AuthLayout>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
