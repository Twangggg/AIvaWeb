"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function OverviewSection() {
  const { t } = useI18n();

  const sections = [
    { title: t.navExperience, desc: t.homeExploreExperienceDesc, href: "/product", image: "/bai-dang-1.png" },
    { title: t.navKids, desc: t.homeExploreKidsDesc, href: "/news", image: "/bai-dang-2.png" },
    { title: t.navAbout, desc: t.homeExploreAboutDesc, href: "/about", image: "/3.png" }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeader
            title={
              <>
                {t.homeExploreTitle}{" "}
                <span className="text-gradient-ocean">AIva</span>
              </>
            }
            description={t.homeExploreDesc}
          />
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {sections.map((section, i) => (
            <Reveal key={section.href} delay={i * 80} className="h-full">
              <Link href={section.href} className="group block h-full">
                <article
                  className="h-full flex flex-col rounded-2xl overflow-hidden transition-colors duration-300 group-hover:border-[rgba(234,179,8,0.28)]"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    border: "1px solid",
                    borderColor: "var(--glass-border)"
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-subtle)]">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-on-glass)" }}>
                      {section.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "var(--text-dim)" }}>
                      {section.desc}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                      style={{ color: "var(--ocean-glow)" }}
                    >
                      {t.ctaSecondary}
                      <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
