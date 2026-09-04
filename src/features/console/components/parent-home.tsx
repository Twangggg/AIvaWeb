"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/auth.store";
import { evaluateSafetyGateSync } from "@/features/safety/safety.policy";
import { getActiveChild, loadSafetySettings } from "@/features/safety/safety.storage";
import { loadRoundHistory, type RoundHistoryEntry } from "@/features/play/play.storage";
import { useI18n } from "@/lib/i18n/provider";

export function ParentHome() {
  const user = useAuthStore((s) => s.tokens?.user);
  const { locale } = useI18n();
  const en = locale === "en";
  const [childName, setChildName] = useState("—");
  const [gateOk, setGateOk] = useState(true);
  const [gateMsg, setGateMsg] = useState("");
  const [recent, setRecent] = useState<RoundHistoryEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [child, safety, history] = await Promise.all([
        getActiveChild(),
        loadSafetySettings(),
        loadRoundHistory(),
      ]);
      if (cancelled) return;
      setChildName(child.name);
      const gate = evaluateSafetyGateSync(safety);
      setGateOk(gate.allowed);
      setGateMsg(en ? gate.messageEn : gate.messageVi);
      setRecent(history.slice(0, 4));
    })();
    return () => {
      cancelled = true;
    };
  }, [en]);

  return (
    <div className="flex flex-col gap-8 text-[var(--console-fg)]">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
            {en ? "Parent companion" : "Cổng phụ huynh"}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {en ? "Family care" : "Chăm sóc gia đình"}
            {user?.displayName ? ` · ${user.displayName}` : ""}
          </h1>
          <p className="mt-2 text-base text-[var(--console-muted)]">
            {en
              ? "Follow your child’s safety settings, activity log, and device — play is run by teachers in class."
              : "Theo dõi an toàn, nhật ký và thiết bị của bé — phần chơi do giáo viên chạy trên lớp."}
          </p>
        </div>
        <Link
          href="/console/safety"
          className="inline-flex min-h-11 items-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-500 dark:bg-sky-500"
        >
          {en ? "Manage safety" : "Chỉnh an toàn"}
        </Link>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400">
            {en ? "Active child" : "Bé đang theo dõi"}
          </p>
          <p className="mt-3 text-2xl font-semibold">{childName}</p>
          <p
            className={`mt-3 text-sm leading-relaxed ${
              gateOk ? "text-emerald-700 dark:text-emerald-300" : "text-amber-800 dark:text-amber-200"
            }`}
          >
            {gateOk
              ? en
                ? "Safety gates allow play right now."
                : "Cổng an toàn đang cho phép chơi."
              : gateMsg || (en ? "Play is currently blocked." : "Hiện đang chặn chơi.")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/console/history"
              className="flex flex-col items-start gap-2 rounded-xl border border-[var(--console-border)] bg-[var(--console-chip)] px-4 py-4 text-sm font-medium hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[22px] leading-none text-[var(--console-muted)]">
                history
              </span>
              <span className="leading-none">{en ? "History" : "Nhật ký"}</span>
            </Link>
            <Link
              href="/console/device"
              className="flex flex-col items-start gap-2 rounded-xl border border-[var(--console-border)] bg-[var(--console-chip)] px-4 py-4 text-sm font-medium hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[22px] leading-none text-[var(--console-muted)]">
                devices
              </span>
              <span className="leading-none">{en ? "Device" : "Thiết bị"}</span>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{en ? "Recent rounds" : "Ván gần đây"}</h2>
            <Link
              href="/console/history"
              className="text-sm font-semibold text-[var(--console-muted)] hover:text-[var(--console-fg)]"
            >
              {en ? "See all" : "Xem hết"}
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--console-muted)]">
              {en ? "No rounds logged on this browser yet." : "Chưa có ván nào trên trình duyệt này."}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--console-border)]">
              {recent.map((row) => (
                <li key={`${row.id}-${row.at}`} className="flex flex-wrap justify-between gap-2 py-3.5 text-sm">
                  <span className="font-medium">{row.packTitle}</span>
                  <span className="text-[var(--console-muted)]">
                    {row.kind} · {new Date(row.at).toLocaleString(en ? "en" : "vi")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
