"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { AuthLayout, authPrimaryBtnClass } from "@/features/auth/components/auth-layout";

function VerifyInner() {
  const params = useSearchParams();
  const router = useRouter();
  const applyTokens = useAuthStore((s) => s.applyTokens);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const code = params.get("code");
      const tokenHash = params.get("token_hash") || params.get("token");
      const type = params.get("type");

      if (!code && !tokenHash) {
        setStatus("error");
        setError("Thiếu mã xác nhận. Hãy mở link trong email Supabase.");
        return;
      }

      try {
        const tokens = code
          ? await authService.exchangeCode(code)
          : await authService.verifyEmailOtp(tokenHash!, type === "email" ? "email" : "signup");
        if (cancelled) return;
        applyTokens(tokens);
        setStatus("ok");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Xác nhận thất bại");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params, applyTokens]);

  return (
    <AuthLayout title="Xác nhận email">
      {status === "loading" && <p className="text-sm text-[#6b7280]">Đang xác nhận…</p>}
      {status === "ok" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-[#3f3f46]">
            Email đã được xác nhận. Bạn có thể vào Console.
          </p>
          <button type="button" className={authPrimaryBtnClass} onClick={() => router.replace("/console")}>
            Vào Console
          </button>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
            {error || "Link không hợp lệ hoặc đã hết hạn."}
          </p>
          <Link href="/console/verify-pending" className={`${authPrimaryBtnClass} text-center`}>
            Gửi lại email
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Xác nhận email">
          <p className="text-sm text-[#6b7280]">Đang tải…</p>
        </AuthLayout>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
