"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authPrimaryBtnClass,
} from "@/features/auth/components/auth-layout";
import { PasswordEyeToggle } from "@/features/auth/components/password-eye-toggle";
import { useI18n } from "@/lib/i18n/provider";

type FormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  embedded = false,
  onSwitch,
}: {
  embedded?: boolean;
  onSwitch?: () => void;
}) {
  const { t, locale } = useI18n();
  const login = useAuthStore((s) => s.login);
  const setPendingVerificationEmail = useAuthStore((s) => s.setPendingVerificationEmail);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(t.consoleEmailInvalid),
        password: z.string().min(6, t.consolePasswordMin),
      }),
    [t.consoleEmailInvalid, t.consolePasswordMin]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      router.replace("/console");
    } catch (e) {
      const raw = e instanceof ApiError ? e.message : e instanceof Error ? e.message : t.consoleLoginFailed;
      if (/failed to fetch|networkerror|load failed|fetch/i.test(raw)) {
        setError(
          locale === "en"
            ? "Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL / network."
            : "Không kết nối được Supabase. Kiểm tra NEXT_PUBLIC_SUPABASE_URL / mạng."
        );
      } else if (/email not confirmed|not verified|chưa xác nhận/i.test(raw)) {
        setPendingVerificationEmail(values.email);
        router.replace("/console/verify-pending");
        return;
      } else if (/invalid login credentials|invalid email or password/i.test(raw)) {
        setError(t.consoleBadCredentials);
      } else {
        setError(raw);
      }
    }
  });

  const loading = status === "loading";

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
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

      <label className="flex flex-col gap-1.5">
        <span className={authLabelClass}>{t.consolePassword}</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t.consolePasswordPlaceholder}
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

      {error && (
        <p className="rounded-xl border border-red-200/80 bg-[#fde8e6] px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className={authPrimaryBtnClass}>
        {loading ? t.consoleLoginLoading : t.consoleLoginSubmit}
      </button>

      {!embedded && (
        <p className="text-center text-sm text-[#8a7a62]">
          {t.consoleNoAccount}{" "}
          <button type="button" onClick={onSwitch} className="font-semibold text-[#2a241c] underline-offset-2 hover:underline">
            {t.consoleRegister}
          </button>
        </p>
      )}
    </form>
  );
}
