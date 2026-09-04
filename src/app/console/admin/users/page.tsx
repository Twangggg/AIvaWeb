"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {
  adminCard,
  adminInput,
  adminMuted,
  adminRow,
  adminTableWrap,
  adminThead,
} from "@/features/admin/admin-ui";
import { fetchAdminUsers } from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

type RoleFilter = "all" | "teacher" | "parent" | "admin";

type UserRow = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  emailConfirmed: boolean;
  createdAt: string;
};

function AdminUsersInner() {
  const { locale } = useI18n();
  const en = locale === "en";
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");
  const token = useAuthStore((s) => s.tokens?.accessToken);
  const [filter, setFilter] = useState<RoleFilter>(
    initialRole === "teacher" || initialRole === "parent" || initialRole === "admin" ? initialRole : "all",
  );
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UserRow[]>([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminUsers(token);
        if (!cancelled) setItems(data.items);
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

  const counts = useMemo(() => {
    const base = { teacher: 0, parent: 0, admin: 0, unverified: 0 };
    for (const u of items) {
      if (u.role in base) base[u.role as keyof typeof base] += 1;
      if (!u.emailConfirmed) base.unverified += 1;
    }
    return base;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((u) => {
      if (filter !== "all" && u.role !== filter) return false;
      if (!q) return true;
      return (
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  return (
    <div className="flex flex-col gap-5 text-[var(--console-fg)]">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label={en ? "Total" : "Tổng"} value={String(items.length)} />
        <MiniStat label={en ? "Teachers" : "Giáo viên"} value={String(counts.teacher)} />
        <MiniStat label={en ? "Parents" : "Phụ huynh"} value={String(counts.parent)} />
        <MiniStat label={en ? "Unverified" : "Chưa xác nhận"} value={String(counts.unverified)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "teacher", "parent", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilter(r)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === r
                  ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
                  : "border border-[var(--console-border)] bg-[var(--console-chip)] text-[var(--console-fg)]"
              }`}
            >
              {r === "all" ? (en ? "All" : "Tất cả") : r}
              {r !== "all" ? ` · ${counts[r]}` : ` · ${items.length}`}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] ${adminMuted}`}>
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en ? "Search name or email…" : "Tìm tên hoặc email…"}
            className={adminInput}
          />
        </label>
      </div>

      {error && (
        <div className="space-y-2">
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
          {error.includes("SUPABASE_SERVICE_ROLE_KEY") && (
            <p className={`text-sm ${adminMuted}`}>
              {en
                ? "Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API)."
                : "Thêm SUPABASE_SERVICE_ROLE_KEY vào .env.local (Supabase → Settings → API)."}
            </p>
          )}
        </div>
      )}
      {loading && <p className={`text-sm ${adminMuted}`}>{en ? "Loading…" : "Đang tải…"}</p>}

      {!loading && !error && (
        <div className={adminTableWrap}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={adminThead}>
                <tr>
                  <th className="px-4 py-3 font-semibold">{en ? "Person" : "Người dùng"}</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">{en ? "Status" : "Trạng thái"}</th>
                  <th className="px-4 py-3 font-semibold">{en ? "Created at" : "Tạo lúc"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className={adminRow}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--console-fg)]">{u.displayName || "—"}</p>
                      <a href={`mailto:${u.email}`} className={`${adminMuted} hover:underline`}>
                        {u.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      {u.emailConfirmed ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          {en ? "Verified" : "Đã xác nhận"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
                          <span className="material-symbols-outlined text-[14px]">mark_email_unread</span>
                          {en ? "Pending" : "Chờ xác nhận"}
                        </span>
                      )}
                    </td>
                    <td className={`whitespace-nowrap px-4 py-3 ${adminMuted}`}>
                      {new Date(u.createdAt).toLocaleString(en ? "en" : "vi")}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className={`px-4 py-12 text-center ${adminMuted}`}>
                      {en ? "No accounts match." : "Không có tài khoản khớp."}
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

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<p className={`text-sm ${adminMuted}`}>Đang tải…</p>}>
      <AdminUsersInner />
    </Suspense>
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

function RoleBadge({ role }: { role: string }) {
  const tone =
    role === "admin"
      ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
      : role === "teacher"
        ? "bg-[var(--console-accent)]/25 text-[#5c4a00] dark:text-[#f5e6a3]"
        : "bg-black/5 text-[var(--console-fg)] dark:bg-white/10";
  return <span className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${tone}`}>{role}</span>;
}
