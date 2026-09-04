"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { fetchAdminOverview } from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

type PreorderRow = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  note: string | null;
  created_at: string;
};

type UserRow = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  emailConfirmed: boolean;
  createdAt: string;
};

export default function AdminHomePage() {
  const { locale } = useI18n();
  const en = locale === "en";
  const token = useAuthStore((s) => s.tokens?.accessToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preorders, setPreorders] = useState<PreorderRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [itemsAnchorMs, setItemsAnchorMs] = useState(0);

  const load = useCallback(
    async (refresh = false) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminOverview(token, { refresh });
        setPreorders(data.preorders.items);
        setUsers(data.users.items);
        setItemsAnchorMs(Date.now());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminOverview(token, { refresh: false });
        if (cancelled) return;
        setPreorders(data.preorders.items);
        setUsers(data.users.items);
        setItemsAnchorMs(Date.now());
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

  const stats = useMemo(() => {
    const loadedAt = itemsAnchorMs;
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const preordersWeek = preorders.filter((r) => loadedAt - new Date(r.created_at).getTime() < weekMs).length;
    const unverified = users.filter((u) => !u.emailConfirmed).length;
    const byRole = { teacher: 0, parent: 0, admin: 0 };
    for (const u of users) {
      if (u.role in byRole) byRole[u.role as keyof typeof byRole] += 1;
    }
    return {
      preordersTotal: preorders.length,
      preordersWeek,
      usersTotal: users.length,
      unverified,
      byRole,
    };
  }, [preorders, users, itemsAnchorMs]);

  const recentPreorders = preorders.slice(0, 5);
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          type="button"
          disabled={loading || !token}
          onClick={() => void load(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          {en ? "Refresh" : "Làm mới"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={en ? "Pre-orders" : "Đặt trước"}
          value={loading ? "…" : String(stats.preordersTotal)}
          hint={en ? `${stats.preordersWeek} in last 7 days` : `${stats.preordersWeek} trong 7 ngày`}
          href="/console/admin/preorders"
          icon="shopping_bag"
        />
        <StatCard
          label={en ? "Accounts" : "Tài khoản"}
          value={loading ? "…" : String(stats.usersTotal)}
          hint={en ? `${stats.unverified} unverified email` : `${stats.unverified} chưa xác nhận email`}
          href="/console/admin/users"
          icon="group"
        />
        <StatCard
          label={en ? "Teachers" : "Giáo viên"}
          value={loading ? "…" : String(stats.byRole.teacher)}
          hint={en ? "Classroom operators" : "Điều hành lớp"}
          href="/console/admin/users?role=teacher"
          icon="school"
        />
        <StatCard
          label={en ? "Parents" : "Phụ huynh"}
          value={loading ? "…" : String(stats.byRole.parent)}
          hint={en ? "Family companions" : "Cổng gia đình"}
          href="/console/admin/users?role=parent"
          icon="family_restroom"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel
          title={en ? "Latest pre-orders" : "Đặt trước mới nhất"}
          actionHref="/console/admin/preorders"
          actionLabel={en ? "Open all" : "Xem tất cả"}
        >
          {loading ? (
            <p className="text-sm text-[var(--console-muted)]">{en ? "Loading…" : "Đang tải…"}</p>
          ) : recentPreorders.length === 0 ? (
            <Empty hint={en ? "No pre-orders yet." : "Chưa có đơn đặt trước."} />
          ) : (
            <ul className="divide-y divide-[var(--console-border)]">
              {recentPreorders.map((row) => (
                <li key={row.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--console-fg)]">{row.full_name}</p>
                    <p className="truncate text-sm text-[var(--console-muted)]">{row.email}</p>
                  </div>
                  <p className="shrink-0 text-xs text-[var(--console-muted)]">
                    {new Date(row.created_at).toLocaleString(en ? "en" : "vi")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title={en ? "Newest accounts" : "Tài khoản mới"}
          actionHref="/console/admin/users"
          actionLabel={en ? "Open all" : "Xem tất cả"}
        >
          {loading ? (
            <p className="text-sm text-[var(--console-muted)]">{en ? "Loading…" : "Đang tải…"}</p>
          ) : recentUsers.length === 0 ? (
            <Empty hint={en ? "No accounts yet." : "Chưa có tài khoản."} />
          ) : (
            <ul className="divide-y divide-[var(--console-border)]">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--console-fg)]">{u.displayName || u.email}</p>
                    <p className="truncate text-sm text-[var(--console-muted)]">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={u.role} />
                    {!u.emailConfirmed && (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                        {en ? "Unverified" : "Chưa xác nhận"}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <section className="rounded-2xl border border-dashed border-[var(--console-border)] bg-[var(--console-card)]/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--console-muted)]">
          {en ? "Roadmap" : "Lộ trình"}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
            <p className="font-semibold">{en ? "Device fleet" : "Đội thiết bị"}</p>
            <p className="mt-1 text-sm text-[var(--console-muted)]">
              {en ? "Roster and health across schools — coming later." : "Danh sách và tình trạng theo trường — sắp có."}
            </p>
          </div>
          <div className="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
            <p className="font-semibold">{en ? "Usage analytics" : "Phân tích sử dụng"}</p>
            <p className="mt-1 text-sm text-[var(--console-muted)]">
              {en ? "Play sessions and engagement charts — coming later." : "Phiên chơi và mức tương tác — sắp có."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  href,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-4 transition hover:opacity-95"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--console-muted)]">{label}</p>
        <span className="material-symbols-outlined text-[20px] text-[var(--console-muted)]">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-[var(--console-fg)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--console-muted)]">{hint}</p>
    </Link>
  );
}

function Panel({
  title,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  actionHref: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--console-fg)]">{title}</h2>
        <Link href={actionHref} className="text-sm font-semibold text-[var(--console-muted)] hover:text-[var(--console-fg)]">
          {actionLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

function Empty({ hint }: { hint: string }) {
  return <p className="py-6 text-center text-sm text-[var(--console-muted)]">{hint}</p>;
}

function RoleBadge({ role }: { role: string }) {
  const tone =
    role === "admin"
      ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
      : role === "teacher"
        ? "bg-[var(--console-accent)]/25 text-[#5c4a00] dark:text-[#f5e6a3]"
        : "bg-black/5 text-[var(--console-fg)] dark:bg-white/10";
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${tone}`}>{role}</span>;
}
