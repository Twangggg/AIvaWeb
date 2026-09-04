"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { fetchAdminUsers } from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

type RoleFilter = "all" | "teacher" | "parent" | "admin";

export default function AdminUsersPage() {
  const { locale } = useI18n();
  const en = locale === "en";
  const token = useAuthStore((s) => s.tokens?.accessToken);
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<
    {
      id: string;
      email: string;
      displayName: string;
      role: string;
      emailConfirmed: boolean;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const role = filter === "all" ? undefined : filter;
        const data = await fetchAdminUsers(token, role);
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
  }, [token, filter]);

  const counts = useMemo(() => {
    const base = { teacher: 0, parent: 0, admin: 0 };
    for (const u of items) {
      if (u.role in base) base[u.role as keyof typeof base] += 1;
    }
    return base;
  }, [items]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/console/admin" className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a]">
            ← Admin
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {en ? "Accounts" : "Tài khoản"}
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {en ? "Teachers, parents, and admins." : "Giáo viên, phụ huynh và admin."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "teacher", "parent", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilter(r)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === r ? "bg-[#1a1a1a] text-white" : "border border-black/10 bg-white text-[#3f3f46]"
              }`}
            >
              {r === "all" ? (en ? "All" : "Tất cả") : r}
            </button>
          ))}
        </div>
      </div>

      {filter === "all" && !loading && (
        <div className="grid grid-cols-3 gap-3">
          {(["teacher", "parent", "admin"] as const).map((r) => (
            <div key={r} className="rounded-xl border border-black/8 bg-white/70 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-[#8a7a4a]">{r}</p>
              <p className="mt-1 text-xl font-bold">{counts[r]}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="space-y-2">
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          {error.includes("SUPABASE_SERVICE_ROLE_KEY") && (
            <p className="text-sm text-[#6b7280]">
              {en
                ? "Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API)."
                : "Thêm SUPABASE_SERVICE_ROLE_KEY vào .env.local (Supabase → Settings → API)."}
            </p>
          )}
        </div>
      )}
      {loading && <p className="text-sm text-[#6b7280]">{en ? "Loading…" : "Đang tải…"}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white/80">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-[#8a7a4a]">
              <tr>
                <th className="px-4 py-3 font-semibold">{en ? "Name" : "Tên"}</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Email OK</th>
                <th className="px-4 py-3 font-semibold">{en ? "Created" : "Tạo lúc"}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium">{u.displayName}</td>
                  <td className="px-4 py-3 text-[#3f3f46]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-black/5 px-2 py-1 text-xs font-semibold">{u.role}</span>
                  </td>
                  <td className="px-4 py-3">{u.emailConfirmed ? "✓" : "—"}</td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {new Date(u.createdAt).toLocaleString(en ? "en" : "vi")}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#6b7280]">
                    {en ? "No accounts." : "Chưa có tài khoản."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
