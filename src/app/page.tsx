"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { useI18n } from "@/lib/i18n/provider";

function Hero({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-6">
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--ocean)]/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[var(--text-dim)]" />
          <span className="text-xs uppercase tracking-[0.15em] font-medium" style={{ color: "var(--text-dim)" }}>
            {t.heroTagline}
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[var(--text-dim)]" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.92] mb-6">
          <span className="text-gradient-ocean">AIva</span>
          <br />
          <span className="text-gradient-ocean">{t.heroSuffix}</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {t.heroSubtitle}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onPreorder}
            className="px-8 py-3.5 rounded-full font-semibold hover:scale-105 transition-transform glow-sun"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
          >
            {t.ctaPrimary}
          </button>
          <Link
            href="/product"
            className="px-8 py-3.5 rounded-full backdrop-blur font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-dim)",
              borderWidth: 1
            }}
          >
            {t.ctaSecondary}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            [t.stat1Value, t.stat1Label],
            [t.stat2Value, t.stat2Label],
            [t.stat3Value, t.stat3Label]
          ].map(([v, l]) => (
            <div key={l} className="glass-panel rounded-xl py-3 px-2">
              <p className="text-lg font-bold" style={{ color: "var(--text-on-glass)" }}>{v}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
  const { t } = useI18n();

  const sections = [
    {
      title: t.navExperience,
      desc: "Khám phá công nghệ đằng sau AIva với trải nghiệm 3D tương tác.",
      href: "/product",
      image: "/bai-dang-1.png"
    },
    {
      title: t.navKids,
      desc: "Tìm hiểu cách AIVA giúp trẻ em học hỏi từ thế giới thực.",
      href: "/news",
      image: "/bai-dang-2.png"
    },
    {
      title: t.navAbout,
      desc: "Gặp gỡ đội ngũ đằng sau sứ mệnh đưa công nghệ đến với trẻ em.",
      href: "/about",
      image: "/3.png"
    }
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Khám phá <span className="text-gradient-ocean">AIva</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-dim)" }}>
            Tìm hiểu thêm về sản phẩm, sứ mệnh và đội ngũ của chúng tôi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl overflow-hidden backdrop-blur transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid",
                borderColor: "var(--glass-border)"
              }}
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-on-glass)" }}>
                  {section.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  {section.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen">
        <Hero onPreorder={() => setPreorderOpen(true)} />
        <OverviewSection />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
