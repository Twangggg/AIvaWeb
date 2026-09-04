"use client";

import Link from "next/link";

import { useAuthStore } from "@/features/auth/auth.store";
import { ENV } from "@/lib/env";
import { useI18n } from "@/lib/i18n/provider";

export default function ConsoleHomePage() {
  const user = useAuthStore((s) => s.tokens?.user);
  const { locale } = useI18n();
  const en = locale === "en";
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {en ? "Hello" : "Xin chào"}
          {user?.displayName ? `, ${user.displayName}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-base text-[#6b7280]">
          {isAdmin
            ? en
              ? "Admin hub — manage pre-orders and accounts."
              : "Khu vực admin — quản lý đặt trước và tài khoản."
            : en
              ? "Tablet console for class play and device control."
              : "Bảng điều khiển tablet cho lớp và thiết bị."}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {isAdmin ? (
          <Link
            href="/console/admin"
            className="rounded-2xl border border-black/8 bg-white/70 p-5 transition hover:border-black/20 hover:bg-white"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">Admin</p>
            <p className="mt-2 text-lg font-semibold">
              {en ? "Operations" : "Điều hành"}
            </p>
            <p className="mt-2 text-sm text-[#6b7280]">
              {en ? "Pre-orders, teachers, parents…" : "Đặt trước, giáo viên, phụ huynh…"}
            </p>
          </Link>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">API</p>
            <p className="mt-2 break-all font-mono text-sm text-[#3f3f46]">{ENV.API_URL}</p>
            <p className="mt-3 text-sm text-[#6b7280]">
              {en ? "JWT auth connected to mobile backend." : "Auth JWT đã kết nối backend mobile."}
            </p>
          </div>
        )}
        <Link
          href="/console/device"
          className="rounded-2xl border border-black/8 bg-white/70 p-5 transition hover:border-black/20 hover:bg-white"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">
            {en ? "Next" : "Tiếp theo"}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {en ? "Device / IoT bot" : "Thiết bị / IoT bot"}
          </p>
          <p className="mt-2 text-sm text-[#6b7280]">
            {en ? "Link bot, health, speak / quiet / find." : "Gắn bot, health, speak / quiet / find."}
          </p>
        </Link>
      </section>
    </div>
  );
}
