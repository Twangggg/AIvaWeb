"use client";

import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";
import { useI18n } from "@/lib/i18n/provider";

/** Manifesto — wheel reveals / hides each line (forward & reverse). */
export function StatementChapter() {
  const { t } = useI18n();
  const { step, dir } = useFpSceneSync("statement", 3);

  const lines = [
    { text: t.cxStatement1, tone: "dim" as const, scene: 0 },
    { text: t.cxStatement2, tone: "bright" as const, scene: 1 },
    { text: t.cxStatement3, tone: "accent" as const, scene: 2 }
  ];

  return (
    <section className="cx-statement-frame" data-fp-scene-dir={dir}>
      <div className="cx-statement-veil" aria-hidden />

      <div
        className="cx-statement-copy relative z-10 max-w-4xl mx-auto px-6 text-center"
        data-fp-rise="scale"
        style={{ ["--fp-delay" as string]: "80ms" }}
      >
        <div className="cx-statement-lines flex flex-col items-center gap-5 md:gap-7">
          {lines.map((line) => {
            const visible = step >= line.scene;
            const current = step === line.scene;
            return (
              <p
                key={line.text}
                className={`font-display font-bold leading-[1.05] tracking-tight cx-statement-line cx-statement-${line.tone}`}
                data-visible={visible ? "true" : "false"}
                data-current={current ? "true" : "false"}
                style={{ fontSize: "clamp(1.75rem, 5.5vw, 4.25rem)" }}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>

      <p className="cx-statement-progress" aria-live="polite">
        <span>{String(step + 1).padStart(2, "0")}</span>
        <i aria-hidden />
        <small>{String(lines.length).padStart(2, "0")}</small>
      </p>
    </section>
  );
}
