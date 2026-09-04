"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/features/auth/auth.store";
import { PasswordEyeToggle } from "@/features/auth/components/password-eye-toggle";
import { useI18n } from "@/lib/i18n/provider";

type FormValues = {
  password: string;
  confirm: string;
};

const fieldClass =
  "min-h-12 w-full rounded-xl border border-[var(--console-border)] bg-[var(--console-chip)] px-3.5 text-base text-[var(--console-fg)] outline-none ring-[var(--console-accent)]/35 placeholder:text-[var(--console-muted)] focus:ring-2";

export function ChangePasswordForm() {
  const { t, locale } = useI18n();
  const en = locale === "en";
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const user = useAuthStore((s) => s.tokens?.user);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      await updatePassword(values.password);
      setDone(true);
      reset({ password: "", confirm: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.consoleResetFailed);
    } finally {
      setBusy(false);
    }
  });

  const initials = (user?.displayName || user?.email || "A").trim().charAt(0).toUpperCase();
  const roleLabel =
    user?.role === "parent"
      ? en
        ? "Parent"
        : "Phụ huynh"
      : user?.role === "admin"
        ? "Admin"
        : en
          ? "Teacher"
          : "Giáo viên";

  return (
    <div className="flex flex-col gap-8 text-[var(--console-fg)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.consoleAccountTitle}</h1>
        <p className="mt-2 text-base text-[var(--console-muted)]">
          {en ? "Profile details and password." : "Thông tin tài khoản và mật khẩu."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(17rem,20rem)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-6">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--console-inverse)] text-xl font-semibold text-[var(--console-inverse-fg)]">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{user?.displayName || "—"}</p>
              <p className="mt-0.5 truncate text-sm text-[var(--console-muted)]">{user?.email || "—"}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3 border-t border-[var(--console-border)] pt-4">
              <dt className="text-[var(--console-muted)]">{en ? "Role" : "Vai trò"}</dt>
              <dd className="font-medium">{roleLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--console-border)] pt-4">
              <dt className="text-[var(--console-muted)]">{en ? "Email status" : "Email"}</dt>
              <dd className="font-medium">
                {user?.emailConfirmed === false
                  ? en
                    ? "Unverified"
                    : "Chưa xác nhận"
                  : en
                    ? "Verified"
                    : "Đã xác nhận"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{t.consoleChangePassword}</h2>
          <p className="mt-2 text-sm text-[var(--console-muted)]">{t.consoleChangePasswordHint}</p>

          <form onSubmit={onSubmit} className="mt-6 grid max-w-xl gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-[var(--console-fg)]">{t.consoleNewPassword}</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`${fieldClass} pr-12`}
                  {...register("password")}
                />
                <PasswordEyeToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  showLabel={t.consoleShowPassword}
                  hideLabel={t.consoleHidePassword}
                />
              </div>
              {errors.password && (
                <span className="text-sm text-red-600 dark:text-red-300">{errors.password.message}</span>
              )}
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-[var(--console-fg)]">{t.consoleConfirmPassword}</span>
              <input
                type="password"
                autoComplete="new-password"
                className={fieldClass}
                {...register("confirm")}
              />
              {errors.confirm && (
                <span className="text-sm text-red-600 dark:text-red-300">{errors.confirm.message}</span>
              )}
            </label>

            {error && (
              <p
                className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                {error}
              </p>
            )}
            {done && (
              <p className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                {t.consoleResetSuccess}
              </p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--console-accent)] px-6 text-base font-semibold text-[#1a1400] transition hover:brightness-110 disabled:opacity-60"
              >
                {busy ? t.consoleResetSaving : t.consoleResetSave}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
