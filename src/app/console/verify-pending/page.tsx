"use client";

import Link from "next/link";
import { useState } from "react";

import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { AuthLayout, authPrimaryBtnClass } from "@/features/auth/components/auth-layout";

export default function VerifyPendingPage() {
  const email = useAuthStore((s) => s.pendingVerificationEmail || s.tokens?.user?.email);
  const logout = useAuthStore((s) => s.logout);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const resend = async () => {
    if (!email) {
      setError("Thiếu email để gửi lại.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await authService.resendVerification(email);
      setMessage("Đã gửi lại email xác nhận qua Supabase.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gửi lại thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Xác nhận email">
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-[#3f3f46]">
        <p>
          Chúng tôi đã gửi link xác nhận tới{" "}
          <strong className="text-[#111]">{email || "email của bạn"}</strong>. Hãy mở hộp thư và
          nhấn liên kết trong email (Supabase).
        </p>
        <p className="text-[#6b7280]">Không thấy mail? Kiểm tra Spam / Quảng cáo.</p>

        {message && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-emerald-800">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[#b91c1c]" role="alert">
            {error}
          </p>
        )}

        <button type="button" disabled={busy || !email} onClick={() => void resend()} className={authPrimaryBtnClass}>
          {busy ? "Đang gửi…" : "Gửi lại email"}
        </button>

        <button
          type="button"
          onClick={() => void logout()}
          className="min-h-11 rounded-xl border border-black/10 bg-white text-sm font-semibold text-[#3f3f46] hover:bg-black/[0.03]"
        >
          Đăng xuất
        </button>

        <p className="text-center text-[#6b7280]">
          Đã xác nhận xong?{" "}
          <Link href="/console/login" className="font-semibold text-[#111] underline-offset-2 hover:underline">
            Đăng nhập lại
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
