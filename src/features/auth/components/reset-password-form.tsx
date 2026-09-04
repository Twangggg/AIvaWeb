"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";
import {
  AuthLayout,
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authPrimaryBtnClass,
} from "@/features/auth/components/auth-layout";
import { PasswordEyeToggle } from "@/features/auth/components/password-eye-toggle";
import { useI18n } from "@/lib/i18n/provider";

type FormValues = {
  password: string;
  confirm: string;
};

export function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const applyTokens = useAuthStore((s) => s.applyTokens);
  const [ready, setReady] = useState(false);
  const [sessionOk, setSessionOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const tokens = await authService.getSessionTokens();
        if (cancelled) return;
        if (tokens) {
          applyTokens(tokens);
          setSessionOk(true);
        } else {
          setSessionOk(false);
        }
      } catch {
        if (!cancelled) setSessionOk(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyTokens]);

  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, t.consolePasswordMin),
          confirm: z.string().min(6, t.consolePasswordMin),
        })
        .refine((v) => v.password === v.confirm, {
          message: t.consolePasswordMismatch,
          path: ["confirm"],
        }),
    [t.consolePasswordMin, t.consolePasswordMismatch],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true);
    setError(null);
    try {
      await updatePassword(values.password);
      setDone(true);
      setTimeout(() => router.replace("/console"), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.consoleResetFailed);
    } finally {
      setBusy(false);
    }
  });

  if (!ready) {
    return (
      <AuthLayout title={t.consoleResetPasswordTitle}>
        <p className="text-sm text-[#6b7280]">{t.consoleSessionChecking}</p>
      </AuthLayout>
    );
  }

  if (!sessionOk) {
    return (
      <AuthLayout title={t.consoleResetPasswordTitle}>
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-[#b91c1c]">
            {t.consoleResetLinkInvalid}
          </p>
          <button type="button" className={authPrimaryBtnClass} onClick={() => router.replace("/console/forgot-password")}>
            {t.consoleForgotPassword}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t.consoleResetPasswordTitle}>
      {done ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-900">
          {t.consoleResetSuccess}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
          <p className="text-sm text-[#6b5f4a]">{t.consoleResetPasswordHint}</p>
          <label className="flex flex-col gap-1.5">
            <span className={authLabelClass}>{t.consoleNewPassword}</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`${authFieldClass} pr-12`}
                {...register("password")}
              />
              <PasswordEyeToggle
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                showLabel={t.consoleShowPassword}
                hideLabel={t.consoleHidePassword}
              />
            </div>
            {errors.password && <span className={authErrorClass}>{errors.password.message}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={authLabelClass}>{t.consoleConfirmPassword}</span>
            <input type="password" autoComplete="new-password" className={authFieldClass} {...register("confirm")} />
            {errors.confirm && <span className={authErrorClass}>{errors.confirm.message}</span>}
          </label>
          {error && (
            <p className="rounded-xl border border-red-200/80 bg-[#fde8e6] px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className={authPrimaryBtnClass}>
            {busy ? t.consoleResetSaving : t.consoleResetSave}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
