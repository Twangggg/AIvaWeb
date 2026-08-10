"use client";

import { useState } from "react";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { StickyCta } from "@/components/common/sticky-cta";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { SiteIntro, useSiteIntro } from "@/components/home/site-intro";
import { VisionDemoSection } from "@/components/home/vision-demo-section";
import { VideoDemoSection } from "@/components/home/video-demo-section";
import { CompareSection } from "@/components/home/compare-section";
import { MissionSection } from "@/components/home/mission-section";
import { FaqSection } from "@/components/home/faq-section";
import { ParentAppSection } from "@/components/home/parent-app-section";
import { ColorPickerSection } from "@/components/home/color-picker-section";
import { PageMouseGlow } from "@/components/ui/page-mouse-glow";
import { CinematicHero } from "@/components/home/experience/cinematic-hero";
import { StatementChapter } from "@/components/home/experience/statement-chapter";
import { FeatureRail } from "@/components/home/experience/feature-rail";
import { CinematicCta } from "@/components/home/experience/cinematic-cta";
import { useFullpageScroll } from "@/hooks/use-fullpage-scroll";

export default function HomePage() {
  const [preorderOpen, setPreorderOpen] = useState(false);
  const { showIntro, completeIntro } = useSiteIntro();
  useFullpageScroll(!showIntro);

  if (showIntro) {
    return <SiteIntro onComplete={completeIntro} />;
  }

  return (
    <>
      <PageMouseGlow />
      <Nav onPreorder={() => setPreorderOpen(true)} />

      <main className="cx-main min-h-screen">
        <div id="hero" data-fp-section className="cx-fp-section">
          <CinematicHero onPreorder={() => setPreorderOpen(true)} />
        </div>

        <div id="statement" data-fp-section data-fp-scenes="3" data-fp-scene="0" className="cx-fp-section">
          <StatementChapter />
        </div>

        <div id="vision" data-fp-section data-fp-scenes="3" data-fp-scene="0" className="cx-fp-section">
          <VisionDemoSection />
        </div>

        <div id="features" data-fp-section data-fp-scenes="4" data-fp-scene="0" className="cx-fp-section">
          <FeatureRail />
        </div>

        <div id="compare" data-fp-section className="cx-fp-section">
          <CompareSection />
        </div>

        <div id="companion" data-fp-section className="cx-fp-section">
          <ParentAppSection />
        </div>

        <div id="color" data-fp-section className="cx-fp-section">
          <ColorPickerSection />
        </div>

        <div id="video" data-fp-section className="cx-fp-section">
          <VideoDemoSection />
        </div>

        <div id="mission" data-fp-section className="cx-fp-section">
          <MissionSection />
        </div>

        <div id="cta" data-fp-section className="cx-fp-section">
          <CinematicCta onPreorder={() => setPreorderOpen(true)} />
        </div>

        <div id="faq" data-fp-section className="cx-fp-section">
          <div className="cx-faq-shell">
            <FaqSection />
            <Footer />
          </div>
        </div>
      </main>

      <StickyCta onPreorder={() => setPreorderOpen(true)} />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
