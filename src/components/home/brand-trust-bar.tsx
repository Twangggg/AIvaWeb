"use client";

import { useI18n } from "@/lib/i18n/provider";

export function BrandTrustBar() {
  const BADGES = [
    {
      icon: "visibility_off",
      title: "Không màn hình",
      desc: "Bảo vệ tối đa thị lực của trẻ"
    },
    {
      icon: "translate",
      title: "AI Song Ngữ Việt - Anh",
      desc: "Khám phá từ vựng qua thế giới thật"
    },
    {
      icon: "verified_user",
      title: "Chuẩn an toàn COPPA",
      desc: "Bảo vệ quyền riêng tư & dữ liệu trẻ"
    },
    {
      icon: "phonelink_setup",
      title: "App Phụ Huynh 24/7",
      desc: "Theo dõi hành trình khám phá thời gian thực"
    }
  ];

  const PRESS = ["VTV Digital", "Báo Tuổi Trẻ", "VnExpress", "Báo Cần Thơ", "Sài Gòn Giải Phóng"];

  return (
    <section className="relative py-12 px-6 overflow-hidden border-y"
      style={{
        borderColor: "var(--glass-border)",
        backgroundColor: "var(--glass-bg)"
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-32 blur-[100px] pointer-events-none opacity-20"
        style={{ background: "var(--ocean)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* 4 Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((b) => (
            <div
              key={b.title}
              className="p-4 rounded-2xl border transition-all duration-300 group hover:-translate-y-1"
              style={{
                backgroundColor: "var(--glass-bg)",
                borderColor: "var(--glass-border)"
              }}
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "var(--ocean-alpha)",
                  borderColor: "var(--ocean)",
                  color: "var(--ocean)"
                }}
              >
                <span className="material-symbols-outlined text-xl">{b.icon}</span>
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-on-glass)" }}>{b.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Press & Media Mention Ticker */}
        <div className="pt-6 border-t flex flex-wrap items-center justify-center gap-6 text-xs"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-dim)" }}
        >
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Báo chí & Truyền thông đưa tin:
          </span>
          <div className="flex flex-wrap items-center gap-6">
            {PRESS.map((item) => (
              <span
                key={item}
                className="font-medium hover:opacity-100 transition-opacity cursor-default"
                style={{ color: "var(--text-dim)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
