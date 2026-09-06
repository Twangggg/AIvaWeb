"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  fetchAdminStudy,
  type StudyMetrics,
} from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

export default function StudyDashboardPage() {
  const { locale } = useI18n();
  const en = locale === "en";
  const token = useAuthStore((s) => s.tokens?.accessToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudyMetrics | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminStudy(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAdminStudy(token);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const { c0, c2, delta } = data?.metrics ?? {
    c0: null,
    c2: null,
    delta: null,
  };

  const goldilocks = useMemo(() => {
    if (!c0 || !c2) return null;
    return {
      frustrationC0: c0.frustrationSignalsTotal,
      frustrationC2: c2.frustrationSignalsTotal,
      boredomC0: c0.boredomRate,
      boredomC2: c2.boredomRate,
    };
  }, [c0, c2]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--console-fg)]">
            {en ? "Curiosity Study Dashboard" : "Dashboard đo lường thí nghiệm"}
          </h1>
          <p className="mt-1 text-sm text-[var(--console-muted)]">
            {en
              ? "Measures for H1–H3 + Goldilocks check · C0 (Direct Answer) vs C2 (Curiosity-Adaptive)"
              : "Chỉ số H1–H3 + kiểm tra Goldilocks · C0 (Trả lời trực tiếp) vs C2 (Thích nghi tò mò)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/console/admin/study/chat"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)] hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            {en ? "Chat sandbox" : "Chat thử nghiệm"}
          </Link>
          <button
            type="button"
            disabled={loading || !token}
            onClick={() => void load()}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            {en ? "Refresh" : "Làm mới"}
          </button>
        </div>
      </header>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && !data ? (
        <p className="text-sm text-[var(--console-muted)]">
          {en ? "Loading…" : "Đang tải…"}
        </p>
      ) : !data ? (
        <p className="text-sm text-[var(--console-muted)]">
          {en
            ? "No study data yet. Run scripts/seed-study-data.mjs after applying supabase/005_study_tables.sql."
            : "Chưa có dữ liệu thí nghiệm. Chạy scripts/seed-study-data.mjs sau khi apply supabase/005_study_tables.sql."}
        </p>
      ) : (
        <>
          {/* Summary cards */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={en ? "Enrollments" : "Người tham gia"}
              value={String(data.summary.enrollments.total)}
              hint={en ? "Consented participants" : "Đã đồng thuận"}
              icon="groups"
            />
            <StatCard
              label={en ? "Sessions" : "Phiên"}
              value={String(data.summary.totalSessions)}
              hint={
                en
                  ? `C0 ${c0?.nSessions ?? 0} · C2 ${c2?.nSessions ?? 0}`
                  : `C0 ${c0?.nSessions ?? 0} · C2 ${c2?.nSessions ?? 0}`
              }
              icon="event_available"
            />
            <StatCard
              label="C2 / C0"
              value={delta ? delta.chainDepthMean.toFixed(1) : "—"}
              hint={
                en
                  ? "Δ mean chain depth (H1)"
                  : "Δ độ sâu chuỗi trung bình (H1)"
              }
              icon="trending_up"
            />
            <StatCard
              label={en ? "Events" : "Sự kiện"}
              value={String(data.summary.totalEvents)}
              hint={en ? "Logged policy decisions" : "Quyết định policy đã log"}
              icon="data_object"
            />
          </section>

          {/* H1 / H2 comparison bars */}
          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title={en ? "H1 · Curiosity" : "H1 · Tò mò"}>
              {c0 && c2 && (
                <div className="flex flex-col gap-4">
                  <MetricBar
                    label={
                      en ? "Chain depth (mean)" : "Độ sâu chuỗi (trung bình)"
                    }
                    c0={c0.chainDepthMean}
                    c2={c2.chainDepthMean}
                    format={(v) => v.toFixed(1)}
                  />
                  <MetricBar
                    label={
                      en
                        ? "Oracle ratio (lower = better)"
                        : "Tỷ lệ oracle (thấp = tốt hơn)"
                    }
                    c0={c0.oracleRatio}
                    c2={c2.oracleRatio}
                    format={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                  <MetricBar
                    label={en ? "Deep question rate" : "Tỷ lệ câu hỏi sâu"}
                    c0={c0.deepQuestionRate}
                    c2={c2.deepQuestionRate}
                    format={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                </div>
              )}
            </Panel>

            <Panel title={en ? "H2 · Exploration" : "H2 · Khám phá"}>
              {c0 && c2 && (
                <div className="flex flex-col gap-4">
                  <MetricBar
                    label={en ? "Explore start rate" : "Tỷ lệ bắt đầu khám phá"}
                    c0={c0.exploreStartRate}
                    c2={c2.exploreStartRate}
                    format={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                  <MetricBar
                    label={
                      en
                        ? "Verify count (mean)"
                        : "Số lần xác minh (trung bình)"
                    }
                    c0={c0.verifyCountMean}
                    c2={c2.verifyCountMean}
                    format={(v) => v.toFixed(1)}
                  />
                  <MetricBar
                    label={en ? "Escape used (count)" : "Số lần thoát (count)"}
                    c0={c0.escapeUsed}
                    c2={c2.escapeUsed}
                    format={(v) => String(v)}
                  />
                </div>
              )}
            </Panel>
          </section>

          {/* H3 + Goldilocks */}
          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title={en ? "H3 · Learning gain" : "H3 · Mức học"} highlight>
              {c0 && c2 && (
                <div className="flex flex-col gap-4">
                  <MetricBar
                    label={
                      en ? "Learning gain (post − pre)" : "Mức học (post − pre)"
                    }
                    c0={c0.learningGainMean ?? 0}
                    c2={c2.learningGainMean ?? 0}
                    format={(v) => v.toFixed(2)}
                    note={
                      en
                        ? `Valid sessions: C0 ${c0.learningGainSessionCount} · C2 ${c2.learningGainSessionCount}`
                        : `Phiên hợp lệ: C0 ${c0.learningGainSessionCount} · C2 ${c2.learningGainSessionCount}`
                    }
                  />
                  {delta?.learningGainMean != null && (
                    <p className="text-sm text-[var(--console-muted)]">
                      Δ {delta.learningGainMean.toFixed(2)}{" "}
                      {en
                        ? "(secondary, effect expected smaller)"
                        : "(thứ cấp, hiệu ứng nhỏ hơn)"}
                    </p>
                  )}
                </div>
              )}
            </Panel>

            <Panel
              title={en ? "Goldilocks check (B6)" : "Kiểm tra Goldilocks (B6)"}
            >
              {goldilocks ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <GoldilocksCell
                      label={en ? "Frustration signals" : "Dấu hiệu bực bội"}
                      c0={goldilocks.frustrationC0}
                      c2={goldilocks.frustrationC2}
                      format={(v) => String(v)}
                    />
                    <GoldilocksCell
                      label={en ? "Boredom rate" : "Tỷ lệ nhàm chán"}
                      c0={goldilocks.boredomC0}
                      c2={goldilocks.boredomC2}
                      format={(v) => `${(v * 100).toFixed(0)}%`}
                    />
                  </div>
                  <Note
                    text={
                      en
                        ? "Keeps the child in the moderate (inverted-U) zone. High frustration or high boredom in C2 indicates the friction is mis-tuned (Kidd & Hayden)."
                        : "Giữ trẻ trong vùng vừa phải (inverted-U). C2 mà bực bội hoặc nhàm chán cao cho thấy friction bị chỉnh sai (Kidd & Hayden)."
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-[var(--console-muted)]">
                  {en ? "No data." : "Không có dữ liệu."}
                </p>
              )}
            </Panel>
          </section>

          {/* Sessions table */}
          <Panel title={en ? "Sessions" : "Các phiên"}>
            {data.sessions.length === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--console-muted)]">
                {en ? "No sessions yet." : "Chưa có phiên."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--console-border)] text-xs uppercase tracking-wider text-[var(--console-muted)]">
                      <th className="py-2 pr-3 font-semibold">
                        {en ? "Participant" : "Người tham gia"}
                      </th>
                      <th className="py-2 pr-3 font-semibold">
                        {en ? "Cond." : "ĐK"}
                      </th>
                      <th className="py-2 pr-3 font-semibold">
                        {en ? "Depth" : "Độ sâu"}
                      </th>
                      <th className="py-2 pr-3 font-semibold">
                        {en ? "Explore" : "Khám phá"}
                      </th>
                      <th className="py-2 pr-3 font-semibold">
                        {en ? "Verify" : "Xác minh"}
                      </th>
                      <th className="py-2 font-semibold">
                        {en ? "Δ learn" : "Δ học"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sessions.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--console-border)]/60 last:border-0"
                      >
                        <td className="py-2 pr-3 font-medium text-[var(--console-fg)]">
                          {row.participant_code}
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              row.condition === "C2"
                                ? "bg-[var(--console-accent)]/25 text-[#5c4a00] dark:text-[#f5e6a3]"
                                : "bg-black/5 text-[var(--console-fg)] dark:bg-white/10"
                            }`}
                          >
                            {row.condition}
                          </span>
                        </td>
                        <td className="py-2 pr-3 tabular-nums text-[var(--console-fg)]">
                          {row.chainDepth}
                        </td>
                        <td className="py-2 pr-3 tabular-nums">
                          {row.exploreCompleted}
                        </td>
                        <td className="py-2 pr-3 tabular-nums">
                          {row.verifyCount}
                        </td>
                        <td className="py-2 tabular-nums text-[var(--console-fg)]">
                          {row.learningGain != null
                            ? row.learningGain.toFixed(2)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--console-muted)]">
          {label}
        </p>
        <span className="material-symbols-outlined text-[20px] text-[var(--console-muted)]">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-[var(--console-fg)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--console-muted)]">{hint}</p>
    </div>
  );
}

function Panel({
  title,
  highlight,
  children,
}: {
  title: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border bg-[var(--console-card)] p-5 ${
        highlight
          ? "border-[var(--console-accent)]/40"
          : "border-[var(--console-border)]"
      }`}
    >
      <h2 className="mb-4 text-lg font-semibold text-[var(--console-fg)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MetricBar({
  label,
  c0,
  c2,
  format,
  note,
}: {
  label: string;
  c0: number;
  c2: number;
  format: (v: number) => string;
  note?: string;
}) {
  const max = Math.max(c0, c2, 1);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-[var(--console-fg)]">{label}</p>
        {note && <p className="text-xs text-[var(--console-muted)]">{note}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <BarRow color="c0" value={c0} max={max} format={format} label="C0" />
        <BarRow color="c2" value={c2} max={max} format={format} label="C2" />
      </div>
    </div>
  );
}

function BarRow({
  color,
  value,
  max,
  format,
  label,
}: {
  color: "c0" | "c2";
  value: number;
  max: number;
  format: (v: number) => string;
  label: string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 4 : 0) : 0;
  const bg =
    color === "c2"
      ? "bg-gradient-to-r from-[var(--console-accent)] to-[var(--console-accent-soft,#d9a93b)]"
      : "bg-black/35 dark:bg-white/25";
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 shrink-0 text-xs font-semibold text-[var(--console-muted)]">
        {label}
      </span>
      <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-black/[0.05] dark:bg-white/[0.06]">
        <div
          className={`absolute inset-y-0 left-0 rounded-md ${bg}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-sm tabular-nums font-semibold text-[var(--console-fg)]">
        {format(value)}
      </span>
    </div>
  );
}

function GoldilocksCell({
  label,
  c0,
  c2,
  format,
}: {
  label: string;
  c0: number;
  c2: number;
  format: (v: number) => string;
}) {
  return (
    <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--console-muted)]">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-2xl font-bold tabular-nums text-[var(--console-fg)]">
          {format(c2)}
        </span>
        <span className="text-xs text-[var(--console-muted)]">C2</span>
      </div>
      <div className="mt-1 flex items-center gap-3 text-sm text-[var(--console-muted)]">
        <span className="font-semibold text-[var(--console-fg)]">
          {format(c0)}
        </span>
        <span>C0</span>
      </div>
    </div>
  );
}

function Note({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-[var(--console-border)] bg-black/[0.02] px-3 py-2 text-xs leading-relaxed text-[var(--console-muted)] dark:bg-white/[0.03]">
      {text}
    </p>
  );
}
