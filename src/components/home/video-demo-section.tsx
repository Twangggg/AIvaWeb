"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { AmbientBg } from "@/components/ui/ambient-bg";

/**
 * When the demo video is ready, put the file at `public/videos/demo.mp4`
 * (or another path) and set this to that public URL, e.g. "/videos/demo.mp4".
 */
export const HOME_DEMO_VIDEO_SRC: string | null = "/videos/aiva-demo.mp4";

export function VideoDemoSection() {
  const { t } = useI18n();
  const hasVideo = Boolean(HOME_DEMO_VIDEO_SRC);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => {
      const active = document.fullscreenElement === videoFrameRef.current;
      setIsFullscreen(active);
      if (!active) {
        const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void };
        orientation.unlock?.();
      }
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    if (!videoFrameRef.current) return;
    if (document.fullscreenElement === videoFrameRef.current) {
      await document.exitFullscreen();
      return;
    }

    await videoFrameRef.current.requestFullscreen();
    const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: "landscape") => Promise<void> };
    if (orientation.lock) await orientation.lock("landscape").catch(() => undefined);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden h-full w-full flex flex-col justify-center">
      <AmbientBg variant="section" />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <Reveal direction="up" delay={0}>
          <SectionHeader
            title={
              <>
                {t.homeVideoTitle}{" "}
                <span className="text-gradient-sun">{t.homeVideoTitleAccent}</span>
              </>
            }
            description={t.homeVideoDesc}
          />
        </Reveal>

        <Reveal direction="scale" delay={120}>
          <div
            className="mt-6 sm:mt-10 md:mt-12 relative rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--shadow-glow)"
            }}
          >
            <div ref={videoFrameRef} className="relative aspect-video bg-[var(--bg-subtle)]">
              {hasVideo ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster="/vision/cayxanh.jpg"
                  src={HOME_DEMO_VIDEO_SRC!}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      background:
                        "radial-gradient(ellipse at 30% 20%, rgba(234,179,8,0.18), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(56,189,248,0.12), transparent 50%)"
                    }}
                    aria-hidden
                  />
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      background: "var(--gradient-ocean)",
                      color: "var(--text-on-accent)",
                      boxShadow: "0 12px 40px -12px rgba(234,179,8,0.55)"
                    }}
                    aria-hidden
                  >
                    <span className="material-symbols-outlined text-3xl ml-0.5">play_arrow</span>
                  </div>
                  <div className="relative">
                    <p className="font-display text-xl md:text-2xl font-bold" style={{ color: "var(--text-on-glass)" }}>
                      {t.homeVideoComingSoon}
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="mobile-fullscreen-control absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
                style={{
                  backgroundColor: "var(--modal-bg)",
                  borderColor: "var(--glass-border)",
                  color: "var(--text-on-glass)"
                }}
                aria-label={isFullscreen ? "Exit full screen" : "View video in full screen"}
              >
                <span className="material-symbols-outlined text-xl" aria-hidden>
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
