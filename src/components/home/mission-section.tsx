"use client";

import { useI18n } from "@/lib/i18n/provider";

import { Reveal } from "@/components/ui/reveal";

/** Mission pillars — single fullpage panel, vertically centered under nav. */
export function MissionSection() {
  const { t } = useI18n();

  const pillars = [
    { badge: "AI", label: t.homeMissionAILabel, desc: t.homeMissionAIDesc },
    { badge: "V", label: t.homeMissionVisionLabel, desc: t.homeMissionVisionDesc },
    { badge: "A", label: t.homeMissionAssistantLabel, desc: t.homeMissionAssistantDesc }
  ];

  return (
    <section className="cx-fp-panel relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(234,179,8,0.14), transparent 55%)"
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <Reveal>
          <div>
            <h2 className="font-display text-[1.2rem] sm:text-3xl md:text-5xl font-bold leading-tight mb-1.5 sm:mb-4">
              {t.homeMissionHeadline}{" "}
              <span className="text-gradient-sun">{t.homeMissionHeadlineAccent}</span>
            </h2>
            <p
              className="text-[0.75rem] leading-relaxed sm:text-base sm:leading-relaxed md:text-lg max-w-2xl mx-auto mb-3 sm:mb-8 md:mb-10"
              style={{ color: "var(--text-dim)" }}
            >
              {t.aboutMissionDesc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-2 sm:gap-3 text-left md:grid-cols-3 md:gap-4">
          {pillars.map((p, i) => (
            <Reveal key={p.badge} delay={80 + i * 80} direction="up">
              <div
                className="rounded-xl sm:rounded-2xl p-2.5 sm:p-5 md:p-6 h-full flex flex-row items-center gap-2.5 sm:gap-3 md:flex-col md:items-start transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)"
                }}
              >
                <div
                  className={`flex h-8 sm:h-11 items-center justify-center rounded-lg font-bold shrink-0 ${
                    p.badge === "AI" ? "w-8 px-1.5 text-xs sm:min-w-[2.75rem] sm:text-sm" : "w-8 text-sm sm:w-11 sm:text-lg"
                  }`}
                  style={{ background: "var(--gradient-ocean)", color: "var(--text-on-accent)" }}
                >
                  {p.badge}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xs sm:text-base mb-0.5 sm:mb-2" style={{ color: "var(--text-on-glass)" }}>
                    {p.label}
                  </h3>
                  <p className="text-[0.68rem] leading-snug sm:text-sm sm:leading-relaxed" style={{ color: "var(--text-dim)" }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
