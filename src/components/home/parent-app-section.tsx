"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";
import { useFpSectionEnter } from "@/hooks/use-fp-section-enter";

type AppScreen = "dashboard" | "safety" | "location";

const SCREENS: { id: AppScreen; image: string; icon: string }[] = [
  { id: "dashboard", image: "/app-mock/dashboard.webp", icon: "grid_view" },
  { id: "safety", image: "/app-mock/safety.webp", icon: "shield" },
  { id: "location", image: "/app-mock/location.webp", icon: "location_on" }
];

export function ParentAppSection() {
  const { t } = useI18n();
  const { entered } = useFpSectionEnter("companion");
  const { step, dir, setScene } = useFpSceneSync("companion", SCREENS.length);

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

  return (
    <section
      className="cx-fp-panel parent-app relative overflow-hidden"
      data-entered={entered ? "true" : "false"}
      data-dir={dir}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 right-0 w-[420px] h-[420px] rounded-full bg-[var(--ocean)]/10 blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-sky-400/10 blur-[90px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <header data-fp-rise style={{ ["--fp-delay" as string]: "40ms" }}>
          <h2 className="font-display font-bold tracking-tight leading-[1.1] text-[clamp(1.65rem,3.6vw,2.6rem)]">
            {t.homeAppTitle}{" "}
            <span className="text-gradient-ocean">{t.homeAppTitleAccent}</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed" style={{ color: "var(--text-dim)" }}>
            {t.homeAppDesc}
          </p>
        </header>

        <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] gap-10 lg:gap-14 items-center">
          <div
            className="flex flex-col gap-3.5"
            data-fp-rise="left"
            style={{ ["--fp-delay" as string]: "120ms" }}
          >
            {highlights.map((item, i) => {
              // Pair highlights loosely with screens: 0–1 dashboard, 2 safety, 3 location
              const tied = i <= 1 ? 0 : i === 2 ? 1 : 2;
              const lit = tied === step;
              return (
                <div
                  key={item.title}
                  className="parent-app-hl flex gap-4 p-4 md:p-5 rounded-2xl transition-all duration-500"
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
          </div>

          <div
            className="flex flex-col items-center gap-5"
            data-fp-rise="right"
            style={{ ["--fp-delay" as string]: "180ms" }}
          >
            <div className="app-phone-frame motion-float relative mx-auto w-[min(100%,280px)]">
              <div className="app-phone-bezel relative rounded-[2.1rem] p-[10px]" style={{ background: "#111827" }}>
                <div
                  className="relative overflow-hidden rounded-[1.55rem] bg-[#f7f9fb]"
                  style={{ aspectRatio: "9 / 19.2" }}
                >
                  <Image
                    key={screen.id}
                    src={screen.image}
                    alt={labels[screen.id]}
                    fill
                    sizes="280px"
                    className="parent-app-screen object-cover object-top"
                    data-dir={dir}
                    priority={screen.id === "dashboard"}
                  />
                </div>
              </div>
              <div
                className="pointer-events-none absolute -bottom-4 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-full blur-2xl"
                style={{ background: "rgba(234,179,8,0.35)" }}
                aria-hidden
              />
            </div>

            <div
              className="flex w-full max-w-[280px] gap-1 rounded-2xl p-1"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)"
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
          </div>
        </div>
      </div>
    </section>
  );
}
