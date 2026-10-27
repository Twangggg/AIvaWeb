"use client";

import { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
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
import { useGardenStore } from "@/features/landing-garden/store/useGardenStore";
import { GardenJournalModal } from "@/features/landing-garden/components/garden-journal-modal";
import { LandingModePill } from "@/features/landing-garden/components/landing-mode-pill";

// Dynamically import 3D Canvas to prevent SSR WebGL mismatch
const LandingGardenCanvas = dynamic(
  () =>
    import(
      "@/features/landing-garden/components/landing-garden-canvas"
    ).then((m) => m.LandingGardenCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-50 text-stone-800">
        <div className="text-4xl animate-bounce">🌸</div>
        <p className="mt-4 font-bold text-base text-emerald-950">
          Đang mở cổng Khu Vườn Khám Phá AIva…
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  const { mode, journalOpen, setJournalOpen, initHydration } = useGardenStore();
  const [preorderOpen, setPreorderOpen] = useState(false);
  const { showIntro, completeIntro } = useSiteIntro();

  // Restore client preferences from localStorage without causing SSR hydration mismatch
  useEffect(() => {
    initHydration();
  }, [initHydration]);

  // Only enable fullpage scroll coordinator when in standard scroll mode
  useFullpageScroll(!showIntro && mode === "scroll");

  // Lock body scroll in 3D garden mode
  useEffect(() => {
    if (mode === "garden") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mode]);

  return (
    <>
      {showIntro && <SiteIntro onComplete={completeIntro} />}

      <div inert={showIntro} aria-hidden={showIntro || undefined}>
        <Suspense fallback={null}>
          <OAuthErrorBanner />
        </Suspense>

        {/* Animated View Transition between 3D Garden and Scroll Landing (framer-motion-aiva tokens) */}
        <AnimatePresence mode="wait">
          {mode === "garden" ? (
            /* MODE 1: 3D DISCOVERY GARDEN (Khu Vườn Khám Phá 3D) */
            <motion.main
              key="garden-mode-view"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 h-screen w-screen overflow-hidden"
            >
              <LandingGardenCanvas
                onOpenPreorder={() => setPreorderOpen(true)}
                onOpenJournal={() => setJournalOpen(true)}
              />
            </motion.main>
          ) : (
            /* MODE 2: STANDARD SCROLL LANDING (Trang Cuộn Chuẩn) */
            <motion.div
              key="scroll-mode-view"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
            {/* Corner Mode Switcher */}
            <LandingModePill />
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Modals */}
        <GardenJournalModal
          open={journalOpen}
          onClose={() => setJournalOpen(false)}
        />
        <PreorderModal
          open={preorderOpen}
          onClose={() => setPreorderOpen(false)}
        />
      </div>
    </>
  );
}
