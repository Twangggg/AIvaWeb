"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { AuthLayout, authPrimaryBtnClass } from "@/features/auth/components/auth-layout";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const applyTokens = useAuthStore((s) => s.applyTokens);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const code = params.get("code");
        const tokenHash = params.get("token_hash");
        const type = params.get("type");

        if (code) {
          const tokens = await authService.exchangeCode(code);
          if (cancelled) return;
          applyTokens(tokens);
          router.replace("/console");
          return;
        }

        if (tokenHash) {
          const otpType = type === "email" ? "email" : "signup";
          const tokens = await authService.verifyEmailOtp(tokenHash, otpType);
          if (cancelled) return;
          applyTokens(tokens);
          router.replace("/console");
          return;
        }

        // Hash-based redirects (legacy) — supabase client may already have session
        const tokens = await authService.getSessionTokens();
        if (cancelled) return;
        if (tokens) {
          applyTokens(tokens);
          router.replace("/console");
          return;
        }

        setError("Thiếu mã xác nhận từ email.");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Xác nhận thất bại");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, applyTokens, router]);

  return (
    <AuthLayout title="Xác nhận email">
      {error ? (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
            {error}
          </p>
          <button type="button" className={authPrimaryBtnClass} onClick={() => router.replace("/console/login")}>
            Đăng nhập
          </button>
        </div>
      ) : (
        <p className="text-sm text-[#6b7280]">Đang xác nhận email…</p>
      )}
    </AuthLayout>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Xác nhận email">
          <p className="text-sm text-[#6b7280]">Đang tải…</p>
        </AuthLayout>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
