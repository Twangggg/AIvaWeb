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
            <h2 className="font-display text-[1.35rem] sm:text-3xl md:text-5xl font-bold leading-tight mb-2.5 sm:mb-4">
              {t.homeMissionHeadline}{" "}
              <span className="text-gradient-sun">{t.homeMissionHeadlineAccent}</span>
            </h2>
            <p
              className="line-clamp-3 text-[0.78rem] leading-[1.15rem] sm:line-clamp-none sm:text-base sm:leading-relaxed md:text-lg max-w-2xl mx-auto mb-4 sm:mb-8 md:mb-10"
              style={{ color: "var(--text-dim)" }}
            >
              {t.aboutMissionDesc}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 text-left md:grid-cols-3 md:gap-4">
          {pillars.map((p, i) => (
            <Reveal key={p.badge} delay={80 + i * 80} direction="up">
              <div
                className="rounded-2xl p-3.5 sm:p-5 md:p-6 h-full transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)"
                }}
              >
                <div
                  className={`mb-2 flex h-9 items-center justify-center rounded-lg font-bold sm:mb-3 sm:h-11 ${
                    p.badge === "AI" ? "min-w-9 px-2 text-xs w-fit sm:min-w-[2.75rem] sm:text-sm" : "w-9 text-base sm:w-11 sm:text-lg"
                  }`}
                  style={{ background: "var(--gradient-ocean)", color: "var(--text-on-accent)" }}
                >
                  {p.badge}
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2" style={{ color: "var(--text-on-glass)" }}>
                  {p.label}
                </h3>
                <p className="line-clamp-2 text-xs leading-[1.15rem] sm:line-clamp-none sm:text-sm sm:leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
