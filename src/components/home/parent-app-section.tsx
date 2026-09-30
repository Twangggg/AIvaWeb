"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";
import { useFpSectionEnter } from "@/hooks/use-fp-section-enter";
import { AppDownloadModal } from "@/components/common/app-download-modal";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

type AppScreen = "dashboard" | "safety" | "location";

const SCREENS: { id: AppScreen; image: string; icon: string }[] = [
  { id: "dashboard", image: "/app/bbfc1941ca204a7e1331.jpg", icon: "grid_view" },
  { id: "safety", image: "/app/9ec4b67e651fe541bc0e.jpg", icon: "shield" },
  { id: "location", image: "/app/0ad97e66ad072d597416.jpg", icon: "location_on" }
];

const screenVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : direction < 0 ? -60 : 0,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)"
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      filter: { duration: 0.3 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -60 : direction < 0 ? 60 : 0,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      scale: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      filter: { duration: 0.25 }
    }
  })
};

export function ParentAppSection() {
  const { t } = useI18n();
  const { entered } = useFpSectionEnter("companion");
  const { step, dir, setScene } = useFpSceneSync("companion", SCREENS.length);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [directDownloading, setDirectDownloading] = useState(false);

  const labels: Record<AppScreen, string> = {
    dashboard: t.homeAppScreenDashboard,
    safety: t.homeAppScreenSafety,
    location: t.homeAppScreenLocation
  };

  const highlights = [
    { icon: "menu_book", title: t.homeAppHL1Title, desc: t.homeAppHL1Desc },
    { icon: "timer", title: t.homeAppHL2Title, desc: t.homeAppHL2Desc },
    { icon: "tune", title: t.homeAppHL3Title, desc: t.homeAppHL3Desc },
    { icon: "notifications_active", title: t.homeAppHL4Title, desc: t.homeAppHL4Desc }
  ];

  const screen = SCREENS[step] ?? SCREENS[0];

  const handleTriggerDirectDownload = () => {
    setDirectDownloading(true);
    const link = document.createElement("a");
    link.href = "/api/download/app?platform=android";
    link.download = "AIVA_Companion_v1.0.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDirectDownloading(false);
    }, 1500);
  };

  return (
    <>
      <section
        className="cx-fp-panel parent-app relative overflow-hidden"
        data-entered={entered ? "true" : "false"}
        data-dir={dir}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/3 right-0 w-[420px] h-[420px] rounded-full bg-[var(--ocean)]/10 blur-[110px]" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-amber-400/10 blur-[90px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 w-full px-2 sm:px-4">
          <Reveal direction="up" delay={0}>
            <header>
              <h2 className="font-display font-bold tracking-tight leading-[1.1] text-[clamp(1.5rem,3.4vw,2.5rem)]">
                {t.homeAppTitle}{" "}
                <span className="text-gradient-ocean">{t.homeAppTitleAccent}</span>
              </h2>
              <p className="mt-2 sm:mt-3 max-w-2xl text-[clamp(0.85rem,1.3vw,1.02rem)] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {t.homeAppDesc}
              </p>

              {/* Direct App Download Action Bar */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={handleTriggerDirectDownload}
                  disabled={directDownloading}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: "var(--gradient-ocean)",
                    color: "var(--text-on-accent)",
                    boxShadow: "var(--shadow-glow)"
                  }}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    {directDownloading ? "sync" : "download"}
                  </span>
                  <span>{directDownloading ? "Đang tự động tải APK..." : "Tải Trực Tiếp APK (Android)"}</span>
                </button>

                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 border"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderColor: "var(--glass-border)",
                    color: "var(--text-on-glass)"
                  }}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">qr_code_scanner</span>
                  <span>Quét mã QR & Tải App</span>
                </button>
              </div>
            </header>
          </Reveal>

          <div className="mt-6 sm:mt-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] gap-6 lg:gap-12 items-center">
            <Reveal direction="left" delay={100} className="flex flex-col gap-2.5 sm:gap-3.5">
              {highlights.map((item, i) => {
                const tied = i <= 1 ? 0 : i === 2 ? 1 : 2;
                const lit = tied === step;
                return (
                  <div
                    key={item.title}
                    className="parent-app-hl flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => setScene(tied)}
                    data-active={lit ? "true" : "false"}
                    style={{
                      backgroundColor: lit
                        ? "color-mix(in srgb, var(--ocean) 12%, var(--glass-bg))"
                        : "var(--glass-bg)",
                      border: lit
                        ? "1px solid color-mix(in srgb, var(--ocean) 45%, var(--glass-border))"
                        : "1px solid var(--glass-border)"
                    }}
                  >
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-500"
                      style={{
                        background: lit ? "var(--gradient-ocean)" : "color-mix(in srgb, var(--ocean) 22%, var(--glass-bg))",
                        color: lit ? "var(--text-on-accent)" : "var(--ocean-glow)"
                      }}
                    >
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base mb-1" style={{ color: "var(--text-on-glass)" }}>
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Reveal>

            {/* Interactive Visual Phone Demo */}
            <Reveal direction="right" delay={160} className="flex flex-col items-center gap-5">
              <div className="app-phone-frame motion-float relative mx-auto w-[min(100%,280px)] group">
                <div className="app-phone-bezel relative rounded-[2.1rem] p-[10px] shadow-2xl" style={{ background: "#111827" }}>
                  <div
                    className="relative overflow-hidden rounded-[1.55rem] bg-[#0c1222] w-full"
                    style={{ aspectRatio: "9 / 19.2" }}
                  >
                    <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                      <motion.div
                        key={screen.id}
                        custom={dir}
                        variants={screenVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={screen.image}
                          alt={labels[screen.id]}
                          fill
                          sizes="280px"
                          className="object-cover object-top select-none pointer-events-none"
                          priority={screen.id === "dashboard"}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Interactive Click Overlay Badge */}
                    <button
                      onClick={() => setDownloadModalOpen(true)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-all hover:scale-105 border"
                      style={{
                        backgroundColor: "var(--modal-bg)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-on-glass)"
                      }}
                    >
                      <span className="material-symbols-outlined text-sm" style={{ color: "var(--ocean)" }}>download</span>
                      Tải App Xem Trực Tiếp
                    </button>
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute -bottom-4 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-full blur-2xl opacity-40"
                  style={{ background: "var(--ocean)" }}
                  aria-hidden
                />
              </div>

              {/* Tab Switcher */}
              <div
                className="flex w-full max-w-[280px] gap-1 rounded-2xl p-1 border"
                style={{
                  backgroundColor: "var(--glass-bg)",
                  borderColor: "var(--glass-border)"
                }}
                role="tablist"
                aria-label={t.homeAppScreensLabel}
              >
                {SCREENS.map((s, i) => {
                  const selected = i === step;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setScene(i)}
                      className="flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 text-[0.65rem] font-medium transition-all duration-300"
                      style={{
                        background: selected ? "var(--gradient-ocean)" : "transparent",
                        color: selected ? "var(--text-on-accent)" : "var(--text-dim)"
                      }}
                    >
                      <span className="material-symbols-outlined text-base">{s.icon}</span>
                      {labels[s.id]}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* App Download Modal */}
      <AppDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
}
