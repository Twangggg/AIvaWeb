"use client";

import { HeroGlasses3D } from "@/components/home/hero-glasses-3d";
import { Reveal } from "@/components/ui/reveal";

/**
 * Interactive 3D glasses showcase section placed right after the Manifesto / Statement.
 */
export function GlassesShowcaseSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-6 py-16 md:py-24">
      {/* Ambient glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(234,179,8,0.08) 0%, transparent 70%)"
        }}
      />

      {/* Heading */}
      <Reveal direction="up" delay={0}>
        <div className="text-center mb-8 z-10">
          <p
            className="text-[0.7rem] uppercase tracking-[0.24em] mb-3 font-semibold"
            style={{ color: "var(--accent)" }}
          >
            AIVA — TRẢI NGHIỆM KÍNH 3D
          </p>
          <h2
            className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-none"
            style={{ color: "var(--text-on-glass)" }}
          >
            Thiết kế <span className="text-gradient-ocean">đột phá</span>
          </h2>
          <p
            className="mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--text-dim)" }}
          >
            Xoay và tương tác 360° với chiếc kính thông minh AIVA siêu nhẹ, bền bỉ và sẵn sàng đồng hành cùng trẻ khám phá thế giới.
          </p>
        </div>
      </Reveal>

      {/* 3D canvas */}
      <Reveal direction="scale" delay={120} className="w-full max-w-3xl mx-auto z-10">
        <HeroGlasses3D
          className="w-full"
          style={{
            height: "min(55vh, 480px)",
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "1.5rem",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--shadow-modal)"
          }}
        />
      </Reveal>
    </section>
  );
}
