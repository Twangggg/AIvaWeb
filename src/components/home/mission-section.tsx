"use client";

import { useI18n } from "@/lib/i18n/provider";

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
        <div data-fp-rise style={{ ["--fp-delay" as string]: "40ms" }}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
            {t.homeMissionHeadline}{" "}
            <span className="text-gradient-sun">{t.homeMissionHeadlineAccent}</span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: "var(--text-dim)" }}
          >
            {t.aboutMissionDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-left">
          {pillars.map((p, i) => (
            <div
              key={p.badge}
              className="rounded-2xl p-5 md:p-6"
              data-fp-rise
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                ["--fp-delay" as string]: `${140 + i * 90}ms`
              }}
            >
              <div
                className={`mb-3 flex h-11 items-center justify-center rounded-lg font-bold ${
                  p.badge === "AI" ? "min-w-[2.75rem] px-2 text-sm w-fit" : "w-11 text-lg"
                }`}
                style={{ background: "var(--gradient-ocean)", color: "var(--text-on-accent)" }}
              >
                {p.badge}
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text-on-glass)" }}>
                {p.label}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
