"use client";

import { useEffect, useMemo, useState } from "react";

import {
  adminBtn,
  adminBtnPrimary,
  adminCard,
  adminInput,
  adminMuted,
  adminRow,
  adminTableWrap,
  adminThead,
} from "@/features/admin/admin-ui";
import { fetchAdminPreorders } from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

type Row = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  note: string | null;
  created_at: string;
};

export default function AdminPreordersPage() {
  const { locale } = useI18n();
  const en = locale === "en";
  const token = useAuthStore((s) => s.tokens?.accessToken);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [anchorMs, setAnchorMs] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminPreorders(token);
        if (cancelled) return;
        setItems(data.items);
        setAnchorMs(Date.now());
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

  const reload = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPreorders(token);
      setItems(data.items);
      setAnchorMs(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.note || "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const weekCount = useMemo(() => {
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    if (!anchorMs) return 0;
    return items.filter((r) => anchorMs - new Date(r.created_at).getTime() < weekMs).length;
  }, [items, anchorMs]);

  const copyEmails = async () => {
    const emails = filtered.map((r) => r.email).join("\n");
    try {
      await navigator.clipboard.writeText(emails);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-5 text-[var(--console-fg)]">
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => void reload()} className={adminBtn}>
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          {en ? "Refresh" : "Làm mới"}
        </button>
        <button
          type="button"
          onClick={() => void copyEmails()}
          disabled={filtered.length === 0}
          className={adminBtnPrimary}
        >
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
          {copied ? (en ? "Copied" : "Đã copy") : en ? "Copy emails" : "Copy email"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label={en ? "Total" : "Tổng"} value={String(items.length)} />
        <MiniStat label={en ? "Last 7 days" : "7 ngày gần đây"} value={String(weekCount)} />
        <MiniStat label={en ? "Showing" : "Đang hiện"} value={String(filtered.length)} />
      </div>

      <label className="relative block">
        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] ${adminMuted}`}>
          search
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={en ? "Search name, email, phone, note…" : "Tìm tên, email, SĐT, ghi chú…"}
          className={adminInput}
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
          {error.includes("SUPABASE_SERVICE_ROLE_KEY") && (
            <span className="mt-1 block text-xs">
              {en
                ? "Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API)."
                : "Thêm SUPABASE_SERVICE_ROLE_KEY vào .env.local (Supabase → Settings → API)."}
            </span>
          )}
        </p>
      )}
      {loading && <p className={`text-sm ${adminMuted}`}>{en ? "Loading…" : "Đang tải…"}</p>}

      {!loading && !error && (
        <div className={adminTableWrap}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={adminThead}>
                <tr>
                  <th className="px-4 py-3 font-semibold">{en ? "Customer" : "Khách"}</th>
                  <th className="px-4 py-3 font-semibold">{en ? "Contact" : "Liên hệ"}</th>
                  <th className="px-4 py-3 font-semibold">{en ? "Note" : "Ghi chú"}</th>
                  <th className="px-4 py-3 font-semibold">{en ? "Created at" : "Tạo lúc"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className={adminRow}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--console-fg)]">{row.full_name}</p>
                      <p className={`text-xs ${adminMuted}`}>#{row.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${row.email}`}
                        className="font-medium text-[var(--console-fg)] hover:underline"
                      >
                        {row.email}
                      </a>
                      <p className={adminMuted}>{row.phone}</p>
                    </td>
                    <td className={`max-w-[16rem] px-4 py-3 ${adminMuted}`}>{row.note || "—"}</td>
                    <td className={`whitespace-nowrap px-4 py-3 ${adminMuted}`}>
                      {new Date(row.created_at).toLocaleString(en ? "en" : "vi")}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className={`px-4 py-12 text-center ${adminMuted}`}>
                      {items.length === 0
                        ? en
                          ? "No pre-orders yet."
                          : "Chưa có đơn đặt trước."
                        : en
                          ? "No rows match your search."
                          : "Không có dòng khớp tìm kiếm."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={adminCard}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${adminMuted}`}>{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--console-fg)]">{value}</p>
    </div>
  );
}
