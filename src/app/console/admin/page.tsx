"use client";

import Link from "next/link";

import { ADMIN_MODULES } from "@/features/admin/admin.modules";
import { useI18n } from "@/lib/i18n/provider";

export default function AdminHomePage() {
  const { locale } = useI18n();
  const en = locale === "en";

  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {en ? "Operations console" : "Bảng điều hành"}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[#6b7280]">
          {en
            ? "Manage pre-orders and accounts. Extra modules can plug into this hub later."
            : "Xem đặt trước và tài khoản. Các module mới có thể gắn vào khu vực này sau."}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {ADMIN_MODULES.map((mod) => {
          const title = en ? mod.titleEn : mod.title;
          const desc = en ? mod.descEn : mod.desc;
          if (!mod.ready) {
            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-dashed border-black/15 bg-white/40 p-5 opacity-70"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">
                  {en ? "Soon" : "Sắp có"}
                </p>
                <p className="mt-2 text-lg font-semibold">{title}</p>
                <p className="mt-2 text-sm text-[#6b7280]">{desc}</p>
              </div>
            );
          }
          return (
            <Link
              key={mod.id}
              href={mod.href}
              className="rounded-2xl border border-black/8 bg-white/70 p-5 transition hover:border-black/20 hover:bg-white"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">Module</p>
              <p className="mt-2 text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm text-[#6b7280]">{desc}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
