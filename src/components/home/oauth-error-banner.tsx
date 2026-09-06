"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

export function OAuthErrorBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();

  const errorCode = params.get("error_code") ?? params.get("error");
  const hasDescription = Boolean(params.get("error_description"));
  if (!errorCode && !hasDescription) return null;

  const dismiss = () => {
    router.replace("/", { scroll: false });
  };

  return (
    <div
      className="fixed left-1/2 top-4 z-[9999] w-[min(94vw,34rem)] -translate-x-1/2 rounded-2xl border border-[#eab308]/45 bg-[#fdf6e3] px-4 py-3 shadow-xl"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined mt-0.5 text-lg text-[#b45309]" aria-hidden="true">
          error
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#7a5b12]">{t.homeOauthErrorTitle}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8a6d1e]">{t.homeOauthErrorHint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/console/login"
            className="rounded-lg bg-[#eab308] px-3 py-1.5 text-xs font-semibold text-[#241a00] transition hover:bg-[#f5c410]"
          >
            {t.homeOauthRetry}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t.homeOauthDismiss}
            className="rounded-lg p-1 text-[#8a6d1e] transition hover:bg-[#eab308]/15"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}