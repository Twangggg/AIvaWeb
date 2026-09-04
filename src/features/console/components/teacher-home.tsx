"use client";

import Link from "next/link";

import { useAuthStore } from "@/features/auth/auth.store";
import { useDeviceStore } from "@/features/iot/device.store";
import { useI18n } from "@/lib/i18n/provider";

export function TeacherHome() {
  const user = useAuthStore((s) => s.tokens?.user);
  const { locale } = useI18n();
  const en = locale === "en";
  const linked = useDeviceStore((s) => s.linked);
  const online = useDeviceStore((s) => s.online);

  const cards = [
    {
      href: "/console/play",
      icon: "sports_esports",
      eyebrow: en ? "Start class" : "Bắt đầu lớp",
      title: en ? "Play round" : "Chạy ván chơi",
      desc: en
        ? "Hunt, cards, quiz, story — solo or teams on tablet."
        : "Săn đồ, thẻ, đố, chuyện — solo hoặc đội trên tablet.",
      primary: true,
    },
    {
      href: "/console/device",
      icon: "devices",
      eyebrow: en ? "Hardware" : "Phần cứng",
      title: en ? "Link device" : "Gắn thiết bị",
      desc: linked
        ? en
          ? `Bot ${online ? "online" : "offline"} — speak / volume / find.`
          : `Bot ${online ? "online" : "offline"} — speak / volume / find.`
        : en
          ? "Attach IoT bot on the same LAN before play."
          : "Gắn IoT bot cùng LAN trước khi chơi.",
    },
    {
      href: "/console/play/packs",
      icon: "inventory_2",
      eyebrow: en ? "Content" : "Nội dung",
      title: en ? "Edit packs" : "Sửa pack",
      desc: en
        ? "Customize prompts and quiz items for your class."
        : "Tùy chỉnh câu nói và câu đố cho lớp.",
    },
    {
      href: "/console/safety",
      icon: "shield_with_heart",
      eyebrow: en ? "Classroom" : "Lớp",
      title: en ? "Safety & profile" : "An toàn & hồ sơ",
      desc: en
        ? "Bedtime, school mode, classroom override."
        : "Giờ ngủ, school mode, classroom mode.",
    },
    {
      href: "/console/history",
      icon: "history",
      eyebrow: en ? "Review" : "Xem lại",
      title: en ? "Round history" : "Lịch sử ván",
      desc: en ? "Scores and packs from recent sessions." : "Điểm và pack các phiên gần đây.",
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-[var(--console-fg)]">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--console-accent)]">
            {en ? "Teacher console" : "Console giáo viên"}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {en ? "Classroom" : "Lớp học"}
            {user?.displayName ? ` · ${user.displayName}` : ""}
          </h1>
          <p className="mt-2 text-base text-[var(--console-muted)]">
            {en
              ? "Run play sessions, control the device, and tune class content."
              : "Chạy phiên chơi, điều khiển thiết bị và chỉnh nội dung lớp."}
          </p>
        </div>
        <Link
          href="/console/play"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--console-inverse)] px-5 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
          {en ? "Start play" : "Bắt đầu chơi"}
        </Link>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`rounded-2xl border p-5 transition hover:opacity-95 sm:p-6 ${
              card.primary
                ? "border-[var(--console-inverse)] bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
                : "border-[var(--console-border)] bg-[var(--console-card)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p
                className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                  card.primary ? "opacity-60" : "text-[var(--console-muted)]"
                }`}
              >
                {card.eyebrow}
              </p>
              <span
                className={`material-symbols-outlined text-[22px] ${
                  card.primary ? "text-[var(--console-accent)]" : "text-[var(--console-muted)]"
                }`}
              >
                {card.icon}
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold">{card.title}</p>
            <p className={`mt-2 text-sm leading-relaxed ${card.primary ? "opacity-70" : "text-[var(--console-muted)]"}`}>
              {card.desc}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
