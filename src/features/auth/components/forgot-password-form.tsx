"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/features/auth/auth.store";
import {
  AuthLayout,
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authPrimaryBtnClass,
} from "@/features/auth/components/auth-layout";
import { useI18n } from "@/lib/i18n/provider";

type FormValues = { email: string };

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(t.consoleEmailInvalid),
      }),
    [t.consoleEmailInvalid],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.consoleResetSendFailed);
    } finally {
      setBusy(false);
    }
  });

  return (
    <AuthLayout title={t.consoleForgotPasswordTitle}>
      {sent ? (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-900">
            {t.consoleResetEmailSent}
          </p>
          <Link href="/console/login" className={`${authPrimaryBtnClass} text-center`}>
            {t.consoleBackToLogin}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
          <p className="text-sm text-[#6b5f4a]">{t.consoleForgotPasswordHint}</p>
          <label className="flex flex-col gap-1.5">
            <span className={authLabelClass}>{t.consoleEmail}</span>
            <input
              type="email"
              autoComplete="email"
              placeholder={t.consoleEmailPlaceholder}
              className={authFieldClass}
              {...register("email")}
            />
            {errors.email && <span className={authErrorClass}>{errors.email.message}</span>}
          </label>
          {error && (
            <p className="rounded-xl border border-red-200/80 bg-[#fde8e6] px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className={authPrimaryBtnClass}>
            {busy ? t.consoleResetSending : t.consoleResetSend}
          </button>
          <p className="text-center text-sm text-[#8a7a62]">
            <Link href="/console/login" className="font-semibold text-[#2a241c] underline-offset-2 hover:underline">
              {t.consoleBackToLogin}
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
