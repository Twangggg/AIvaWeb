"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

interface Detection {
  label: string;
  confidence: number;
  top: string;
  left: string;
  width: string;
  height: string;
}

interface Scenario {
  id: string;
  image: string;
  detections: Detection[];
  voice: string;
}

export function VisionDemoSection() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(0);

  const scenarios: Scenario[] = [
    {
      id: "plant",
      image: "/vision/cayxanh.jpg",
      detections: [
        { label: t.homeVisionDetect1, confidence: 97, top: "16%", left: "6%", width: "44%", height: "72%" },
        { label: t.homeVisionDetect2, confidence: 91, top: "6%", left: "20%", width: "20%", height: "24%" }
      ],
      voice: t.homeVisionVoice1
    },
    {
      id: "book",
      image: "/vision/quyensach.jpg",
      detections: [
        { label: t.homeVisionDetect3, confidence: 95, top: "10%", left: "18%", width: "64%", height: "82%" }
      ],
      voice: t.homeVisionVoice2
    },
    {
      id: "toy",
      image: "/vision/dochoi.jpg",
      detections: [
        { label: t.homeVisionDetect4, confidence: 93, top: "26%", left: "36%", width: "30%", height: "38%" },
        { label: t.homeVisionDetect5, confidence: 88, top: "48%", left: "14%", width: "68%", height: "44%" }
      ],
      voice: t.homeVisionVoice3
    }
  ];

  const scenario = scenarios[active];

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 400),
      window.setTimeout(() => setPhase(2), 1200),
      window.setTimeout(() => setPhase(3), 2200)
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhase(0);
      setActive((prev) => (prev + 1) % scenarios.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [scenarios.length]);

  const selectScenario = (index: number) => {
    setPhase(0);
    setActive(index);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/8 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <SectionHeader
            tag={t.homeVisionTag}
            title={
              <>
                {t.homeVisionTitle}{" "}
                <span className="text-gradient-ocean">{t.homeVisionTitleAccent}</span>
              </>
            }
            description={t.homeVisionDesc}
          />
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <Reveal direction="left">
            <div className="flex flex-col gap-3">
              {scenarios.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectScenario(i)}
                  className="vision-scenario-tab text-left p-4 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: active === i ? "var(--glass-bg)" : "transparent",
                    border: "1px solid",
                    borderColor: active === i ? "rgba(234, 179, 8, 0.35)" : "var(--glass-border)"
                  }}
                >
                  <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--ocean-glow)" }}>
                    {t.homeVisionScenario} {i + 1}
                  </span>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-dim)" }}>
                    {s.voice}
                  </p>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <div className="vision-hud relative rounded-2xl overflow-hidden glass-panel">
              <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
                <Image
                  src={scenario.image}
                  alt={scenario.detections[0]?.label ?? t.homeVisionTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-opacity duration-500"
                  priority={active === 0}
                />

                <div className="vision-scanline" style={{ opacity: phase >= 1 ? 1 : 0 }} />

                {scenario.detections.map((det, i) => (
                  <div
                    key={det.label}
                    className="vision-detection"
                    style={{
                      top: det.top,
                      left: det.left,
                      width: det.width,
                      height: det.height,
                      opacity: phase >= 2 ? 1 : 0,
                      transitionDelay: `${i * 200}ms`
                    }}
                  >
                    <span className="vision-detection-label">
                      {det.label}
                      <em>{det.confidence}%</em>
                    </span>
                  </div>
                ))}

                <div
                  className="vision-voice-bubble"
                  style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(12px)" }}
                >
                  <div className="voice-wave-bars" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="voice-wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed">{scenario.voice}</p>
                </div>

                <div className="vision-hud-corner vision-hud-corner-tl" />
                <div className="vision-hud-corner vision-hud-corner-tr" />
                <div className="vision-hud-corner vision-hud-corner-bl" />
                <div className="vision-hud-corner vision-hud-corner-br" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
