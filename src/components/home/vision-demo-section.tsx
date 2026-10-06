"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";
import { useFpSectionEnter } from "@/hooks/use-fp-section-enter";

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

/**
 * Vision chapter — 3 frames on a depth circle.
 * Scroll rotates the ring; the front card is the active scene.
 */
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

export function VisionDemoSection() {
  const { t } = useI18n();
  const [phase, setPhase] = useState(0);
  const [userDriven, setUserDriven] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: "plant",
      image: "/vision/cayxanh.jpg",
      detections: [
        { label: t.homeVisionDetect1, confidence: 97, top: "18%", left: "8%", width: "42%", height: "70%" },
        { label: t.homeVisionDetect2, confidence: 91, top: "8%", left: "22%", width: "18%", height: "22%" }
      ],
      voice: t.homeVisionVoice1
    },
    {
      id: "book",
      image: "/vision/quyensach.jpg",
      detections: [
        { label: t.homeVisionDetect3, confidence: 95, top: "10%", left: "18%", width: "64%", height: "78%" }
      ],
      voice: t.homeVisionVoice2
    },
    {
      id: "toy",
      image: "/vision/dochoi.jpg",
      detections: [
        { label: t.homeVisionDetect4, confidence: 93, top: "22%", left: "34%", width: "30%", height: "42%" },
        { label: t.homeVisionDetect5, confidence: 88, top: "48%", left: "14%", width: "62%", height: "42%" }
      ],
      voice: t.homeVisionVoice3
    }
  ];

  const { step: active, dir, setScene } = useFpSceneSync("vision", scenarios.length);
  const { entered } = useFpSectionEnter("vision");
  const scenario = scenarios[active] ?? scenarios[0];
  const stepDeg = 360 / scenarios.length;

  useEffect(() => {
    const reset = window.setTimeout(() => setPhase(0), 0);
    const id = window.setTimeout(() => setPhase(3), 850);
    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(id);
    };
  }, [active]);

  // Only auto-rotate when section is actively entered by the user
  useEffect(() => {
    if (userDriven || !entered) return;
    const interval = window.setInterval(() => {
      setScene((active + 1) % scenarios.length, 1);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [active, entered, scenarios.length, setScene, userDriven]);

  useEffect(() => {
    const el = document.getElementById("vision");
    if (!el) return;
    const onScene = () => setUserDriven(true);
    const onEnter = (e: Event) => {
      const detail = (e as CustomEvent<{ dir?: number }>).detail;
      if (detail?.dir === 1 && !userDriven) {
        setScene(0, 1);
      }
    };
    el.addEventListener("fp-scene", onScene);
    el.addEventListener("fp-enter", onEnter);
    return () => {
      el.removeEventListener("fp-scene", onScene);
      el.removeEventListener("fp-enter", onEnter);
    };
  }, [setScene, userDriven]);

  return (
    <section className="vision-orbit cx-fp-panel" data-entered={entered ? "true" : "false"}>
      <div className="vision-orbit-glow" aria-hidden />

      <Reveal direction="up" delay={0}>
        <header className="vision-orbit-head flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display font-bold tracking-tight leading-[1.1]">
              {t.homeVisionTitle}{" "}
              <span className="text-gradient-ocean">{t.homeVisionTitleAccent}</span>
            </h2>
            <p>{t.homeVisionDesc}</p>
          </div>
          <div className="hidden sm:flex shrink-0 w-20 h-20 md:w-24 md:h-24 animate-float">
            <Image
              src="/mascots/frog-camera.webp"
              alt="AIva nhận diện thị giác"
              width={96}
              height={96}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </header>
      </Reveal>

      <Reveal direction="scale" delay={120}>
        <div
          className="vision-ring-stage"
          data-dir={dir}
        >
        <div className="vision-ring-floor" aria-hidden />
        <div className="vision-ring-orbit" aria-hidden />

        <div
          className="vision-ring"
          style={{ transform: `rotateY(${-active * stepDeg}deg)` }}
        >
          {scenarios.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                type="button"
                className="vision-ring-card"
                data-active={isActive ? "true" : "false"}
                aria-label={`${t.homeVisionScenario} ${i + 1}`}
                aria-current={isActive}
                style={{
                  transform: `rotateY(${i * stepDeg}deg) translateZ(var(--ring-r))`
                }}
                onClick={() => {
                  setUserDriven(true);
                  setScene(i);
                }}
              >
                <span className="vision-ring-card-face">
                  <Image
                    src={s.image}
                    alt={s.detections[0]?.label ?? t.homeVisionTitle}
                    fill
                    sizes="(max-width: 768px) 70vw, 420px"
                    priority={i === 0}
                    className="object-cover object-center"
                  />

                  {isActive && (
                    <>
                      <div className="vision-ring-hud" aria-hidden>
                        <div className="vision-scanline" />
                        {s.detections.map((det, di) => (
                          <div
                            key={det.label}
                            className="vision-detection"
                            style={{
                              top: det.top,
                              left: det.left,
                              width: det.width,
                              height: det.height,
                              transitionDelay: `${di * 140}ms`
                            }}
                          >
                            <span className="vision-detection-label">
                              {det.label}
                              <em>{det.confidence}%</em>
                            </span>
                          </div>
                        ))}
                        <div className="vision-hud-corner vision-hud-corner-tl" />
                        <div className="vision-hud-corner vision-hud-corner-tr" />
                        <div className="vision-hud-corner vision-hud-corner-bl" />
                        <div className="vision-hud-corner vision-hud-corner-br" />
                      </div>
                    </>
                  )}

                  <span className="vision-ring-card-num">{String(i + 1).padStart(2, "0")}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={`voice-${scenario.id}`}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="vision-orbit-voice"
        >
          <div className="voice-wave-bars" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="voice-wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
          <p>{scenario.voice}</p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
