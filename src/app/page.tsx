"use client";

import { useState, Suspense } from "react";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { OAuthErrorBanner } from "@/components/home/oauth-error-banner";
import { StatementChapter } from "@/components/home/experience/statement-chapter";
import { GlassesExperience } from "@/components/home/glasses-experience";
import { useFullpageScroll } from "@/hooks/use-fullpage-scroll";
import {
  FriendlyVisionChapter,
  FriendlyFeaturesChapter,
  FriendlyCompareChapter,
  FriendlyParentChapter,
  FriendlyColorChapter,
  FriendlyMissionChapter,
  FriendlySpecsChapter,
} from "@/components/home/friendly-story-chapters";
import { FriendlyHome } from "@/components/home/friendly-home";
import { SiteIntro, useSiteIntro } from "@/components/home/site-intro";

export default function HomePage() {
  const [preorderOpen, setPreorderOpen] = useState(false);
  const { showIntro, completeIntro } = useSiteIntro();
  useFullpageScroll(!showIntro);
  return (
    <>
      {showIntro && <SiteIntro onComplete={completeIntro} />}
      <div inert={showIntro} aria-hidden={showIntro || undefined}>
        <Suspense fallback={null}>
          <OAuthErrorBanner />
        </Suspense>
        <Nav onPreorder={() => setPreorderOpen(true)} />
        <FriendlyHome
          onPreorder={() => setPreorderOpen(true)}
          story={
            <div className="garden-story">
              <div
                id="statement"
                data-fp-section
                data-fp-mobile-lock
                data-fp-scenes="3"
                data-fp-scene="0"
                className="cx-fp-section min-h-[100svh] lg:min-h-[110vh] relative"
              >
                <div className="sticky top-0 h-[100svh] lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                  <StatementChapter />
                </div>
              </div>
              <div
                id="experience"
                data-fp-section
                data-fp-mobile-lock
                data-fp-scenes="4"
                data-fp-scene="0"
                className="cx-fp-section"
              >
                <GlassesExperience />
              </div>
              <div
                id="vision"
                data-fp-section
                data-fp-mobile-lock
                data-fp-scenes="3"
                data-fp-scene="0"
                className="cx-fp-section min-h-[100svh] lg:min-h-[120vh] relative"
              >
                <div className="sticky top-0 h-[100svh] lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                  <FriendlyVisionChapter />
                </div>
              </div>
              <div
                id="features"
                data-fp-section
                data-fp-mobile-lock
                data-fp-scenes="4"
                data-fp-scene="0"
                className="cx-fp-section min-h-[100svh] lg:min-h-[130vh] relative"
              >
                <div className="sticky top-0 h-[100svh] lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                  <FriendlyFeaturesChapter />
                </div>
              </div>
              <div
                id="compare"
                data-fp-section
                data-fp-mobile-lock
                className="cx-fp-section relative"
              >
                <FriendlyCompareChapter />
              </div>
              <div
                id="companion"
                data-fp-section
                data-fp-mobile-lock
                data-fp-scenes="3"
                data-fp-scene="0"
                className="cx-fp-section relative min-h-0 lg:min-h-[120vh]"
              >
                <div className="relative lg:sticky lg:top-0 h-auto lg:h-[100dvh] w-full flex items-center justify-center overflow-hidden">
                  <FriendlyParentChapter />
                </div>
              </div>
              <div
                id="color"
                data-fp-section
                data-fp-mobile-lock
                className="cx-fp-section"
              >
                <FriendlyColorChapter />
              </div>
              <div
                id="specs"
                data-fp-section
                data-fp-native
                className="cx-fp-section"
              >
                <FriendlySpecsChapter />
              </div>
              <div id="mission" data-fp-section className="cx-fp-section">
                <FriendlyMissionChapter />
              </div>
            </div>
          }
        />
        <Footer showIntroToggle={false} />
        <PreorderModal
          open={preorderOpen}
          onClose={() => setPreorderOpen(false)}
        />
      </div>
    </>
  );
}
