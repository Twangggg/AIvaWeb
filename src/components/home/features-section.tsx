"use client";

import type { CSSProperties } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { AmbientBg } from "@/components/ui/ambient-bg";

interface FeatureOrbitItem {
  icon: string;
  title: string;
  desc: string;
}

function FeatureOrbitHub({ features }: { features: FeatureOrbitItem[] }) {
  const duration = 56;

  return (
    <div className="feature-orbit-stage mx-auto">
      <div className="orbit-ring orbit-ring-outer feature-orbit-ring" aria-hidden />
      <div className="orbit-ring orbit-ring-inner feature-orbit-ring-reverse" aria-hidden />

      <div className="feature-orbit-hub">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--ocean-glow)" }}>
          AIva
        </span>
        <div className="w-10 h-px my-2 mx-auto" style={{ background: "var(--gradient-ocean)" }} />
        <span className="material-symbols-outlined text-3xl" style={{ color: "var(--accent)" }}>
          eyeglasses
        </span>
      </div>

      {features.map((f, i) => (
        <div
          key={f.title}
          className="feature-orbit-node"
          style={{ "--orbit-delay": `${-(i / features.length) * duration}s` } as CSSProperties}
        >
          <div className="feature-orbit-card glass-panel">
            <span className="material-symbols-outlined text-2xl mb-3" style={{ color: "var(--ocean-glow)" }}>
              {f.icon}
            </span>
            <h3 className="font-semibold text-sm mb-1.5 leading-snug" style={{ color: "var(--text-on-glass)" }}>
              {f.title}
            </h3>
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-dim)" }}>
              {f.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureList({ features }: { features: FeatureOrbitItem[] }) {
  return (
    <div className="flex flex-col gap-4 lg:hidden">
      {features.map((f) => (
        <div key={f.title} className="glass-panel rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-2xl shrink-0" style={{ color: "var(--ocean-glow)" }}>
            {f.icon}
          </span>
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-on-glass)" }}>{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeaturesSection() {
  const { t } = useI18n();

  const features: FeatureOrbitItem[] = [
    { icon: "visibility_off", title: t.homeFeature1Title, desc: t.homeFeature1Desc },
    { icon: "photo_camera", title: t.homeFeature2Title, desc: t.homeFeature2Desc },
    { icon: "memory", title: t.homeFeature3Title, desc: t.homeFeature3Desc },
    { icon: "battery_charging_full", title: t.homeFeature4Title, desc: t.homeFeature4Desc }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <AmbientBg />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <SectionHeader
            title={
              <>
                {t.homeFeaturesTitle}{" "}
                <span className="text-gradient-ocean">{t.homeFeaturesTitleAccent}</span>
              </>
            }
            description={t.homeFeaturesDesc}
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 hidden lg:block">
            <FeatureOrbitHub features={features} />
          </div>
          <div className="mt-10 lg:hidden">
            <FeatureList features={features} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
