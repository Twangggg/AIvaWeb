"use client";

import { useState, type ReactElement } from "react";
import { ApiError } from "@/lib/api/errors";
import { authService, type OAuthProvider } from "@/features/auth/auth.service";
import { useI18n } from "@/lib/i18n/provider";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.16 7.16 0 0 1 4.88 12c0-.8.14-1.57.39-2.29V6.62H1.29a12.01 12.01 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.78L20.09 3A11.95 11.95 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

const PROVIDERS: { id: OAuthProvider; labelKey: "consoleContinueWithGoogle" | "consoleContinueWithFacebook"; Icon: () => ReactElement }[] = [
  { id: "google", labelKey: "consoleContinueWithGoogle", Icon: GoogleIcon },
];

export function SocialLoginButtons() {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<OAuthProvider | null>(null);
  const [stuck, setStuck] = useState(false);

  const handleClick = async (provider: OAuthProvider) => {
    setError(null);
    setStuck(false);
    setLoading(provider);
    const timer = window.setTimeout(() => setStuck(true), 9000);
    try {
      await authService.signInWithOAuth(provider);
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : t.consoleSocialLoginFailed);
    } finally {
      window.clearTimeout(timer);
      setLoading(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[#c9b896]/60" />
        <span className="text-xs font-medium uppercase tracking-wide text-[#8a7a62]">
          {t.consoleOrContinueWith}
        </span>
        <span className="h-px flex-1 bg-[#c9b896]/60" />
      </div>

      <div className="grid gap-2.5">
        {PROVIDERS.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={loading !== null}
            onClick={() => handleClick(id)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#c9b896] bg-[#faf6ec] px-4 text-sm font-semibold text-[#2a241c] transition hover:bg-[#fffdf6] hover:border-[#eab308] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === id ? (
              <span className="size-5 animate-spin rounded-full border-2 border-[#2a241c]/30 border-t-[#2a241c]" aria-hidden="true" />
            ) : (
              <Icon />
            )}
            {t[labelKey]}
          </button>
        ))}
      </div>

      {stuck && (
        <div className="rounded-xl border border-[#eab308]/40 bg-[#fdf6e3] px-3.5 py-3 text-sm text-[#7a5b12]" role="status">
          <p className="font-medium">{t.consoleSsoSlow}</p>
          <p className="mt-1 text-[#8a6d1e]">{t.consoleSsoHint}</p>
          <button
            type="button"
            onClick={() => handleClick("google")}
            disabled={loading !== null}
            className="mt-2.5 rounded-lg bg-[#eab308] px-3.5 py-1.5 text-sm font-semibold text-[#241a00] transition hover:bg-[#f5c410] disabled:opacity-60"
          >
            {t.consoleSsoRetry}
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-200/80 bg-[#fde8e6] px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
