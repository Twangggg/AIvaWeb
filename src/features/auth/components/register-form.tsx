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
import { SocialLoginButtons } from "@/features/auth/components/social-login-buttons";
import { useI18n } from "@/lib/i18n/provider";

type FormValues = {
  displayName: string;
  email: string;
  password: string;
};

export function RegisterForm({
  embedded = false,
  onSwitch,
}: {
  embedded?: boolean;
  onSwitch?: () => void;
}) {
  const { t } = useI18n();
  const registerUser = useAuthStore((s) => s.register);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        displayName: z.string().min(2, t.consoleNameMin),
        email: z.string().trim().email(t.consoleEmailInvalid),
        password: z.string().min(6, t.consolePasswordMin),
      }),
    [t.consoleNameMin, t.consoleEmailInvalid, t.consolePasswordMin]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      // Role is assigned by DB trigger / profiles — not chosen in the form.
      const result = await registerUser(values);
      if (result.needsEmailConfirmation || !result.accessToken) {
        router.replace("/console/verify-pending");
        return;
      }
      router.replace(result.user?.role === "admin" ? "/console/admin" : "/console/role");
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : t.consoleRegisterFailed);
    }
  });

  const loading = status === "loading";

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className={authLabelClass}>{t.consoleDisplayName}</span>
        <input
          type="text"
          autoComplete="name"
          placeholder={t.consoleNamePlaceholder}
          className={authFieldClass}
          {...register("displayName")}
        />
        {errors.displayName && <span className={authErrorClass}>{errors.displayName.message}</span>}
      </label>

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
            autoComplete="new-password"
            placeholder={t.consolePasswordHint}
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
        {loading ? t.consoleRegisterLoading : t.consoleRegisterSubmit}
      </button>

      <SocialLoginButtons />

      {!embedded && (
        <p className="text-center text-sm text-[#8a7a62]">
          {t.consoleHasAccount}{" "}
          <button type="button" onClick={onSwitch} className="font-semibold text-[#2a241c] underline-offset-2 hover:underline">
            {t.consoleLogin}
          </button>
        </p>
      )}
    </form>
  );
}
