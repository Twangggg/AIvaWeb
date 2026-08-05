"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionHeader
            tag={t.homeFaqTag}
            title={
              <>
                {t.homeFaqTitle}{" "}
                <span className="text-gradient-ocean">{t.homeFaqTitleAccent}</span>
              </>
            }
          />
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={faq.q} delay={i * 40}>
                <div
                  className="rounded-xl overflow-hidden transition-colors"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    border: "1px solid",
                    borderColor: isOpen ? "rgba(234, 179, 8, 0.3)" : "var(--glass-border)"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-sm md:text-base" style={{ color: "var(--text-on-glass)" }}>
                      {faq.q}
                    </span>
                    <span
                      className="material-symbols-outlined shrink-0 text-xl transition-transform duration-300"
                      style={{
                        color: "var(--ocean-glow)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    >
                      expand_more
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isOpen ? "280px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
