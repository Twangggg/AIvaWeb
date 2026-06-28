"use client";

import { useState } from "react";
import Image from "next/image";
import { Home3DScroll } from "@/components/home-3d-scroll";
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
          <span className="text-gradient-sun">AIva</span>
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
          <a
            href="#how"
            className="px-8 py-3.5 rounded-full backdrop-blur font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-dim)",
              borderWidth: 1
            }}
          >
            {t.ctaSecondary}
          </a>
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

function HowItWorks() {
  const { t } = useI18n();

  const STEPS = [
    { num: "01", title: t.step1Title, desc: t.step1Desc },
    { num: "02", title: t.step2Title, desc: t.step2Desc },
    { num: "03", title: t.step3Title, desc: t.step3Desc }
  ];

  return (
    <section id="how" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
            style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean-glow)" }}
          >
            {t.howTitle}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold">
            {t.howHeading} <span className="text-gradient-ocean">{t.howHeadingAccent}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="relative p-8 rounded-2xl backdrop-blur transition-colors"
              style={{
                backgroundColor: "var(--bg-subtle)",
                border: "1px solid",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div className="text-6xl font-bold text-gradient-sun mb-4">{s.num}</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-on-glass)" }}>{s.title}</h3>
              <p style={{ color: "var(--text-dim)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForKids() {
  const { t } = useI18n();

  const HIGHLIGHTS = [
    t.kidsPost1HL1,
    t.kidsPost1HL2,
    t.kidsPost1HL3,
    t.kidsPost1HL4,
    t.kidsPost1HL5
  ];

  const POSTS = [
    {
      image: "/bai-dang-1.png",
      title: t.kidsPost1Title,
      desc: t.kidsPost1Desc,
      highlights: HIGHLIGHTS,
      imageLeft: true
    },
    {
      image: "/bai-dang-2.png",
      title: t.kidsPost2Title,
      desc: t.kidsPost2Desc,
      highlights: null,
      imageLeft: false
    },
    {
      image: "/bai-dang-3.png",
      title: t.kidsPost3Title,
      desc: t.kidsPost3Desc,
      highlights: null,
      imageLeft: true
    }
  ];

  return (
    <section id="for-kids" className="py-28 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/8 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
            style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean-glow)" }}
          >
            {t.kidsTag}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            {t.kidsTitle}
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "var(--text-dim)" }}>
            {t.kidsDesc}
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {POSTS.map((post, i) => (
            <div
              key={post.title}
              className="flex flex-col md:flex-row gap-8 items-center"
              style={{ flexDirection: post.imageLeft ? undefined : "row-reverse" }}
            >
              <div className="w-full md:w-1/2">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid",
                    borderColor: "var(--glass-border)"
                  }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div
                  className="rounded-2xl p-8 backdrop-blur"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    border: "1px solid",
                    borderColor: "var(--glass-border)"
                  }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-snug" style={{ color: "var(--text-on-glass)" }}>
                    {post.title}
                  </h3>
                  <p style={{ color: "var(--text-dim)" }}>
                    {post.desc}
                  </p>
                  {post.highlights && (
                    <ul className="mt-6 flex flex-col gap-3">
                      {post.highlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-3">
                          <span
                            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: "var(--accent)" }}
                          />
                          <span className="text-sm" style={{ color: "var(--text-on-glass)" }}>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Specs() {
  const { t } = useI18n();

  const SPECS: [string, string][] = [
    [t.specLabel1, t.specValue1],
    [t.specLabel2, t.specValue2],
    [t.specLabel3, t.specValue3],
    [t.specLabel4, t.specValue4],
    [t.specLabel5, t.specValue5],
    [t.specLabel6, t.specValue6]
  ];

  return (
    <section id="specs" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-14">
          {t.specsTitle} <span className="text-gradient-sun">{t.specsTitleAccent}</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-px rounded-2xl overflow-hidden"
          style={{ backgroundColor: "var(--border-subtle)" }}
        >
          {SPECS.map(([k, v]) => (
            <div key={k} className="p-6 flex justify-between items-center"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <span style={{ color: "var(--text-dim)" }}>{k}</span>
              <span className="font-medium" style={{ color: "var(--text-on-glass)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreorderTrigger({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();

  return (
    <section id="reserve" className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {t.preorderHeading} <span className="text-gradient-ocean">{t.preorderHeadingAccent}</span>
        </h2>
        <p className="mb-10" style={{ color: "var(--text-dim)" }}>
          {t.preorderDesc}
        </p>
        <button
          onClick={onPreorder}
          className="px-10 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform glow-sun"
          style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          {t.preorderCta}
        </button>
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
        <Home3DScroll />
        <HowItWorks />
        <ForKids />
        <Specs />
        <PreorderTrigger onPreorder={() => setPreorderOpen(true)} />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
