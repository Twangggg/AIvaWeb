"use client";

import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { AmbientBg } from "@/components/ui/ambient-bg";

export function MissionSection() {
  const { t } = useI18n();

  const pillars = [
    { badge: "AI", label: t.homeMissionAILabel, desc: t.homeMissionAIDesc },
    { badge: "V", label: t.homeMissionVisionLabel, desc: t.homeMissionVisionDesc },
    { badge: "A", label: t.homeMissionAssistantLabel, desc: t.homeMissionAssistantDesc }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <AmbientBg variant="section" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="section-tag mb-5 inline-flex">{t.aboutMissionTitle}</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-snug mb-5">
                {t.homeMissionHeadline}{" "}
                <span className="text-gradient-sun">{t.homeMissionHeadlineAccent}</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {t.aboutMissionDesc}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {pillars.map((p, i) => (
                <Reveal key={p.badge} delay={i * 80}>
                  <div
                    className="flex items-start gap-4 p-5 rounded-2xl transition-colors duration-300"
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      border: "1px solid",
                      borderColor: "var(--glass-border)"
                    }}
                  >
                    <div
                      className={`shrink-0 h-11 rounded-lg flex items-center justify-center font-bold ${
                        p.badge === "AI" ? "min-w-[2.75rem] px-2 text-sm" : "w-11 text-base"
                      }`}
                      style={{
                        background: "var(--gradient-ocean)",
                        color: "var(--text-on-accent)"
                      }}
                    >
                      {p.badge}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-on-glass)" }}>
                        {p.label}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
