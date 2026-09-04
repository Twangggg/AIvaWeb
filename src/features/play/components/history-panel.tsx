"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  loadRoundHistory,
  type RoundHistoryEntry,
} from "@/features/play/play.storage";
import { useI18n } from "@/lib/i18n/provider";

export function HistoryPanel() {
  const { locale } = useI18n();
  const en = locale === "en";
  const [items, setItems] = useState<RoundHistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void loadRoundHistory().then((rows) => {
      setItems(rows);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <p className="text-sm text-[var(--console-muted)]">{en ? "Loading…" : "Đang tải…"}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {en ? "History" : "Lịch sử"}
            </h1>
            <p className="mt-2 max-w-xl text-base text-[var(--console-muted)]">
              {en
                ? "Recent play rounds on this device (local only)."
                : "Các ván chơi gần đây trên máy này (chỉ local)."}
            </p>
          </div>
          <Link
            href="/console/play"
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-semibold hover:opacity-90"
          >
            {en ? "Play" : "Chơi"}
          </Link>
        </div>
      </section>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5 text-sm text-[var(--console-muted)]">
          {en ? "No rounds yet. Finish a play session to see it here." : "Chưa có ván nào. Kết thúc một phiên chơi để xem tại đây."}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--console-border)] rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)]">
          {items.map((row) => {
            const when = new Date(row.at);
            const scoreText = Object.entries(row.scores)
              .map(([id, n]) => `${id}: ${n}★`)
              .join(" · ");
            return (
              <li key={`${row.id}-${row.at}`} className="px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{row.packTitle}</p>
                  <p className="text-xs text-[var(--console-muted)]">
                    {when.toLocaleString(en ? "en" : "vi")}
                  </p>
                </div>
                <p className="mt-1 text-sm text-[var(--console-muted)]">
                  {row.kind} · {row.mode}
                  {row.winnerId ? ` · winner: ${row.winnerId}` : ""}
                  {` · jar ${row.jarStars}★`}
                </p>
                <p className="mt-1 text-sm text-[var(--console-fg)]">{scoreText}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
