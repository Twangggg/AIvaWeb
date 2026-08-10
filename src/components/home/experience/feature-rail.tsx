"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";
import { useFpSectionEnter } from "@/hooks/use-fp-section-enter";

/**
 * Flat 2D rotating circle — cards stay upright around the rim,
 * active card sits at the bottom; detail panel animates below.
 */
export function FeatureRail() {
  const { t } = useI18n();
  const [userDriven, setUserDriven] = useState(false);
  const { entered } = useFpSectionEnter("features");

  const features = [
    { icon: "visibility_off", title: t.homeFeature1Title, desc: t.homeFeature1Desc },
    { icon: "photo_camera", title: t.homeFeature2Title, desc: t.homeFeature2Desc },
    { icon: "memory", title: t.homeFeature3Title, desc: t.homeFeature3Desc },
    { icon: "battery_charging_full", title: t.homeFeature4Title, desc: t.homeFeature4Desc }
  ];

  const { step: active, dir, setScene } = useFpSceneSync("features", features.length);
  const feature = features[active] ?? features[0];
  const n = features.length;
  const stepDeg = 360 / n;

  useEffect(() => {
    if (userDriven || !entered) return;
    const id = window.setInterval(() => {
      setScene((active + 1) % features.length, 1);
    }, 4800);
    return () => window.clearInterval(id);
  }, [active, entered, features.length, setScene, userDriven]);

  useEffect(() => {
    const el = document.getElementById("features");
    if (!el) return;
    const onScene = () => setUserDriven(true);
    el.addEventListener("fp-scene", onScene);
    return () => el.removeEventListener("fp-scene", onScene);
  }, []);

  return (
    <section
      className="feature-wheel"
      data-entered={entered ? "true" : "false"}
      data-dir={dir}
    >
      <div className="feature-wheel-glow" aria-hidden />

      <header className="feature-wheel-head" data-fp-rise style={{ ["--fp-delay" as string]: "60ms" }}>
        <h2 className="font-display font-bold tracking-tight leading-[1.08]">
          {t.homeFeaturesTitle}{" "}
          <span className="text-gradient-ocean">{t.homeFeaturesTitleAccent}</span>
        </h2>
        <p>{t.homeFeaturesDesc}</p>
      </header>

      <div
        className="feature-wheel-stage"
        data-fp-rise="scale"
        style={{ ["--fp-delay" as string]: "160ms" }}
      >
        {/* Rotate so active seat (index 0 angle) lands at bottom (180°) */}
        <div
          className="feature-wheel-disc"
          style={{ transform: `rotate(${180 - active * stepDeg}deg)` }}
        >
          <div className="feature-wheel-rim" aria-hidden />
          <div className="feature-wheel-rim-inner" aria-hidden />

          {features.map((f, i) => {
            const isActive = i === active;
            const seat = i * stepDeg;
            return (
              <button
                key={f.title}
                type="button"
                className="feature-wheel-slot"
                data-active={isActive ? "true" : "false"}
                aria-label={f.title}
                aria-current={isActive}
                style={{
                  transform: `rotate(${seat}deg) translateY(calc(var(--wheel-r) * -1))`
                }}
                onClick={() => {
                  setUserDriven(true);
                  setScene(i);
                }}
              >
                {/* Counter-rotate so face stays upright */}
                <span
                  className="feature-wheel-card"
                  style={{
                    transform: `rotate(${-(180 - active * stepDeg + seat)}deg)`
                  }}
                >
                  <span className="material-symbols-outlined feature-wheel-icon" aria-hidden>
                    {f.icon}
                  </span>
                  <span className="feature-wheel-card-title font-display font-bold">
                    {f.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="feature-wheel-hub" aria-hidden>
          <span className="feature-wheel-hub-index">{String(active + 1).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="feature-wheel-detail-wrap" data-fp-rise style={{ ["--fp-delay" as string]: "280ms" }}>
        <article
          key={`${feature.title}-${active}`}
          className="feature-wheel-detail"
          data-dir={dir}
          aria-live="polite"
        >
          <span className="material-symbols-outlined" aria-hidden>
            {feature.icon}
          </span>
          <div>
            <h3 className="font-display font-bold">{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
