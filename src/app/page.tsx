"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { StickyCta } from "@/components/common/sticky-cta";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { Hero3DPreview } from "@/components/hero-3d-preview";
import { FeaturesSection } from "@/components/home/features-section";
import { VisionDemoSection } from "@/components/home/vision-demo-section";
import { MissionSection } from "@/components/home/mission-section";
import { OverviewSection } from "@/components/home/overview-section";
import { FaqSection } from "@/components/home/faq-section";
import { Reveal } from "@/components/ui/reveal";
import { AmbientBg } from "@/components/ui/ambient-bg";
import { HeroMouseFx } from "@/components/ui/hero-mouse-fx";
import { PageMouseGlow } from "@/components/ui/page-mouse-glow";
import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { SiteIntro, useSiteIntro } from "@/components/home/site-intro";

function Hero({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();

  return (
    <HeroMouseFx className="relative min-h-screen flex flex-col justify-center overflow-x-hidden pt-24 pb-16 px-6">
      <AmbientBg variant="hero" />
      <div className="absolute inset-0 pointer-events-none hero-mouse-orbs">
        <div className="hero-orb hero-orb-primary absolute top-1/4 left-1/2 w-[600px] h-[600px] rounded-full bg-[var(--ocean)]/20 blur-[100px]" />
        <div className="hero-orb hero-orb-accent absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-6 items-center">
        <div className="text-center lg:text-left">
          <Reveal direction="left">
            <span className="section-tag mb-8">{t.heroTagline}</span>
          </Reveal>
          <Reveal direction="left" delay={100}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-shimmer hero-title-glow">AIva</span>
              <br />
              <span className="hero-suffix">{t.heroSuffix}</span>
            </h1>
          </Reveal>
          <Reveal direction="left" delay={200}>
            <p className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed" style={{ color: "var(--text-dim)" }}>
              {t.heroSubtitle}
            </p>
          </Reveal>
          <Reveal direction="left" delay={300}>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Magnetic>
                <Button onClick={onPreorder}>{t.ctaPrimary}</Button>
              </Magnetic>
              <Link href="/product"><Button variant="ghost">{t.ctaSecondary}</Button></Link>
            </div>
          </Reveal>
          <Reveal direction="left" delay={400}>
            <div className="mt-12 stat-bar max-w-md mx-auto lg:mx-0">
              {[[t.stat1Value, t.stat1Label], [t.stat2Value, t.stat2Label], [t.stat3Value, t.stat3Label]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-lg font-bold" style={{ color: "var(--text-on-glass)" }}>{v}</p>
                  <p className="text-[0.65rem] mt-1 uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal direction="right" delay={150}>
          <Hero3DPreview />
        </Reveal>
      </div>
    </HeroMouseFx>
  );
}

function FinalCta({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <AmbientBg variant="cta" />
      <Reveal>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t.preorderHeading} <span className="text-gradient-sun">{t.preorderHeadingAccent}</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "var(--text-dim)" }}>{t.preorderDesc}</p>
          <Button onClick={onPreorder} className="text-lg px-12 py-4">{t.preorderCta}</Button>
        </div>
      </Reveal>
    </section>
  );
}

export default function HomePage() {
  const [preorderOpen, setPreorderOpen] = useState(false);
  const { showIntro, completeIntro } = useSiteIntro();

  if (showIntro) {
    return <SiteIntro onComplete={completeIntro} />;
  }

  return (
    <>
      <PageMouseGlow />
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen">
        <Hero onPreorder={() => setPreorderOpen(true)} />
        <FeaturesSection />
        <VisionDemoSection />
        <MissionSection />
        <OverviewSection />
        <FaqSection />
        <FinalCta onPreorder={() => setPreorderOpen(true)} />
      </main>
      <Footer />
      <StickyCta onPreorder={() => setPreorderOpen(true)} />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
