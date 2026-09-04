"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchAdminPreorders } from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

export default function AdminPreordersPage() {
  const { locale } = useI18n();
  const en = locale === "en";
  const token = useAuthStore((s) => s.tokens?.accessToken);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<
    {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      note: string | null;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminPreorders(token);
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

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link href="/console/admin" className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a]">
          ← Admin
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {en ? "Pre-orders" : "Đặt trước"}
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          {en
            ? "Customers from the landing form (Supabase)."
            : "Khách từ form landing (Supabase)."}
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
      {loading && <p className="text-sm text-[#6b7280]">{en ? "Loading…" : "Đang tải…"}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white/80">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-[#8a7a4a]">
              <tr>
                <th className="px-4 py-3 font-semibold">{en ? "Name" : "Họ tên"}</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">{en ? "Phone" : "SĐT"}</th>
                <th className="px-4 py-3 font-semibold">{en ? "Note" : "Ghi chú"}</th>
                <th className="px-4 py-3 font-semibold">{en ? "Created" : "Thời gian"}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium">{row.full_name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.phone}</td>
                  <td className="max-w-[14rem] truncate px-4 py-3 text-[#6b7280]">
                    {row.note || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {new Date(row.created_at).toLocaleString(en ? "en" : "vi")}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#6b7280]">
                    {en ? "No pre-orders yet." : "Chưa có đơn đặt trước."}
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
