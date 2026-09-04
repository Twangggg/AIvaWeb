/** Shared Tailwind class snippets for admin pages (theme-aware via --console-* vars). */

export const adminBtn =
  "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50";

export const adminBtnPrimary =
  "inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[var(--console-inverse)] px-3 text-sm font-medium text-[var(--console-inverse-fg)] hover:opacity-90 disabled:opacity-50";

export const adminCard =
  "rounded-xl border border-[var(--console-border)] bg-[var(--console-card)] px-4 py-3 text-[var(--console-fg)]";

export const adminInput =
  "min-h-11 w-full rounded-xl border border-[var(--console-border)] bg-[var(--console-chip)] py-2 pl-10 pr-3 text-sm text-[var(--console-fg)] outline-none ring-[var(--console-accent)]/40 placeholder:text-[var(--console-muted)] focus:ring-2";

export const adminTableWrap =
  "overflow-hidden rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] text-[var(--console-fg)] shadow-sm";

export const adminThead =
  "bg-[#1a1814] text-xs uppercase tracking-wide text-[var(--console-accent)] dark:bg-[#0a0c10]";

export const adminRow =
  "border-b border-[var(--console-border)] last:border-0 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]";

export const adminMuted = "text-[var(--console-muted)]";
