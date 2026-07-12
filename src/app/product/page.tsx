"use client";

import { useState } from "react";
import Image from "next/image";
import { Home3DScroll } from "@/components/home-3d-scroll";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { useI18n } from "@/lib/i18n/provider";

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

export default function ProductPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen pt-24">
        <Home3DScroll />
        <HowItWorks />
        <Specs />
        <PreorderTrigger onPreorder={() => setPreorderOpen(true)} />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
