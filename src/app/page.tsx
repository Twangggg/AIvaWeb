"use client";

import { useState, Suspense } from "react";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { SiteIntro, useSiteIntro } from "@/components/home/site-intro";
import { OAuthErrorBanner } from "@/components/home/oauth-error-banner";
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
import { GlassesExperience } from "@/components/home/glasses-experience";
import { FeatureRail } from "@/components/home/experience/feature-rail";
import { CinematicCta } from "@/components/home/experience/cinematic-cta";
import { useFullpageScroll } from "@/hooks/use-fullpage-scroll";
import { SitePreloader } from "@/components/common/site-preloader";


export default function HomePage() {
  const [preorderOpen, setPreorderOpen] = useState(false);
  const { showIntro, completeIntro } = useSiteIntro();
  useFullpageScroll(!showIntro);

  return (
    <>
      <SitePreloader />
      {showIntro ? (
        <SiteIntro onComplete={completeIntro} />
      ) : (
        <>
          <Suspense fallback={null}>
            <OAuthErrorBanner />
          </Suspense>
          <PageMouseGlow />
          <Nav onPreorder={() => setPreorderOpen(true)} />

          <main className="cx-main min-h-screen w-full max-w-full overflow-x-hidden">
            <div id="hero" data-fp-section data-fp-mobile-lock className="cx-fp-section">
              <CinematicHero onPreorder={() => setPreorderOpen(true)} />
            </div>

            <div id="statement" data-fp-section data-fp-mobile-lock data-fp-scenes="3" data-fp-scene="0" className="cx-fp-section min-h-[100svh] lg:min-h-[110vh] relative">
              <div className="sticky top-0 h-[100svh] lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                <StatementChapter />
              </div>
            </div>

            <div id="experience" data-fp-section data-fp-mobile-lock data-fp-scenes="4" data-fp-scene="0" className="cx-fp-section">
              <GlassesExperience />
            </div>

            <div id="vision" data-fp-section data-fp-mobile-lock data-fp-scenes="3" data-fp-scene="0" className="cx-fp-section min-h-[100svh] lg:min-h-[120vh] relative">
              <div className="sticky top-0 h-[100svh] lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                <VisionDemoSection />
              </div>
            </div>

            <div id="features" data-fp-section data-fp-mobile-lock data-fp-scenes="4" data-fp-scene="0" className="cx-fp-section min-h-[100svh] lg:min-h-[130vh] relative">
              <div className="sticky top-0 h-[100svh] lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                <FeatureRail />
              </div>
            </div>

            <div id="compare" data-fp-section data-fp-mobile-lock className="cx-fp-section relative">
              <CompareSection />
            </div>

            <div id="companion" data-fp-section data-fp-mobile-lock data-fp-scenes="3" data-fp-scene="0" className="cx-fp-section relative min-h-0 lg:min-h-[120vh]">
              <div className="relative lg:sticky lg:top-0 h-auto lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                <ParentAppSection />
              </div>
            </div>

            <div id="color" data-fp-section data-fp-mobile-lock className="cx-fp-section">
              <ColorPickerSection />
            </div>

            <div id="video" data-fp-section data-fp-mobile-lock className="cx-fp-section">
              <VideoDemoSection />
            </div>

            <div id="mission" data-fp-section data-fp-mobile-lock className="cx-fp-section">
              <MissionSection />
            </div>

            <div id="cta" data-fp-section data-fp-mobile-lock className="cx-fp-section">
              <CinematicCta onPreorder={() => setPreorderOpen(true)} />
            </div>

            <div id="faq" data-fp-section data-fp-mobile-lock className="cx-fp-section">
              <div className="cx-faq-shell">
                <FaqSection />
                <div className="hidden lg:block">
                  <Footer />
                </div>
              </div>
            </div>

            <div id="footer" data-fp-section className="cx-fp-section lg:hidden">
              <Footer />
            </div>
          </main>

          <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
        </>
      )}
    </>
  );
}
