"use client";

import Link from "next/link";

import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

export default function ConsoleHomePage() {
  const user = useAuthStore((s) => s.tokens?.user);
  const { locale } = useI18n();
  const en = locale === "en";
  const isAdmin = user?.role === "admin";

  const cards = [
    {
      href: "/console/play",
      eyebrow: en ? "Core" : "Lõi",
      title: en ? "Play" : "Chơi",
      desc: en
        ? "Hunt, cards, quiz, story — solo or teams."
        : "Săn đồ, thẻ, đố, chuyện — solo hoặc đội.",
    },
    {
      href: "/console/safety",
      eyebrow: en ? "Care" : "Chăm sóc",
      title: en ? "Safety" : "An toàn",
      desc: en
        ? "Child profile, bedtime and school gates."
        : "Hồ sơ bé, giờ ngủ và school mode.",
    },
    {
      href: "/console/history",
      eyebrow: en ? "Log" : "Nhật ký",
      title: en ? "History" : "Lịch sử",
      desc: en ? "Recent rounds on this tablet." : "Các ván gần đây trên tablet này.",
    },
    {
      href: "/console/device",
      eyebrow: en ? "Device" : "Thiết bị",
      title: en ? "IoT bot" : "IoT bot",
      desc: en ? "Link bot, speak / volume / find." : "Gắn bot, speak / volume / find.",
    },
    ...(isAdmin
      ? [
          {
            href: "/console/admin",
            eyebrow: "Admin",
            title: en ? "Operations" : "Điều hành",
            desc: en ? "Pre-orders, teachers, parents…" : "Đặt trước, giáo viên, phụ huynh…",
          },
        ]
      : []),
  ];

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
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-black/8 bg-white/70 p-5 transition hover:border-black/20 hover:bg-white"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">
              {card.eyebrow}
            </p>
            <p className="mt-2 text-lg font-semibold">{card.title}</p>
            <p className="mt-2 text-sm text-[#6b7280]">{card.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
