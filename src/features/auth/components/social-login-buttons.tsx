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
        <span className="auth-border h-px flex-1 border-t" />
        <span className="auth-muted text-xs font-medium uppercase tracking-wide">
          {t.consoleOrContinueWith}
        </span>
        <span className="auth-border h-px flex-1 border-t" />
      </div>

      <div className="grid gap-2.5">
        {PROVIDERS.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={loading !== null}
            onClick={() => handleClick(id)}
            className="auth-surface-soft auth-border auth-text inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border px-4 text-sm font-semibold transition hover:border-[var(--ocean)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === id ? (
              <span className="auth-border size-5 animate-spin rounded-full border-2 border-t-[var(--auth-text)]" aria-hidden="true" />
            ) : (
              <Icon />
            )}
            {t[labelKey]}
          </button>
        ))}
      </div>

      {stuck && (
        <div className="ui-accent-soft ui-accent rounded-xl border border-[var(--ocean)]/40 px-3.5 py-3 text-sm" role="status">
          <p className="font-medium">{t.consoleSsoSlow}</p>
          <p className="ui-accent mt-1">{t.consoleSsoHint}</p>
          <button
            type="button"
            onClick={() => handleClick("google")}
            disabled={loading !== null}
            className="mt-2.5 rounded-lg bg-[var(--ocean)] px-3.5 py-1.5 text-sm font-semibold text-[var(--text-on-accent)] transition hover:brightness-110 disabled:opacity-60"
          >
            {t.consoleSsoRetry}
          </button>
        </div>
      )}

      {error && (
        <p className="ui-danger-soft ui-danger rounded-xl border border-red-500/30 px-3.5 py-2.5 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
