"use client";

import { useState } from "react";
import Image from "next/image";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { useI18n } from "@/lib/i18n/provider";

function AboutUs() {
  const { t } = useI18n();

  const TEAM = [
    { image: "/3.png", name: t.teamMember1Name, role: t.teamMember1Role, desc: t.teamMember1Desc },
    { image: "/6.png", name: t.teamMember2Name, role: t.teamMember2Role, desc: t.teamMember2Desc },
    { image: "/4.png", name: t.teamMember3Name, role: t.teamMember3Role, desc: t.teamMember3Desc },
    { image: "/1.png", name: t.teamMember4Name, role: t.teamMember4Role, desc: t.teamMember4Desc },
    { image: "/2.png", name: t.teamMember5Name, role: t.teamMember5Role, desc: t.teamMember5Desc },
    { image: "/5.png", name: t.teamMember6Name, role: t.teamMember6Role, desc: t.teamMember6Desc }
  ];

  return (
    <section id="about" className="py-28 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/8 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
            style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean-glow)" }}
          >
            {t.aboutTag}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            {t.aboutTitle} <span className="text-gradient-ocean">{t.aboutTitleAccent}</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "var(--text-dim)" }}>
            {t.aboutDesc}
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
            style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean-glow)" }}
          >
            {t.aboutTeamTitle}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl p-6 backdrop-blur transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid",
                borderColor: "var(--glass-border)"
              }}
            >
              <div className="rounded-xl overflow-hidden mb-5 aspect-[4/3] bg-[var(--bg-subtle)]"
                style={{ border: "1px solid", borderColor: "var(--glass-border)" }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-bold mb-1" style={{ color: "var(--text-on-glass)" }}>
                {member.name}
              </h4>
              <p className="text-sm font-medium mb-3 text-gradient-ocean">
                {member.role}
              </p>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                {member.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-8"
            style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean-glow)" }}
          >
            {t.aboutContact}
          </div>
          <div className="rounded-2xl p-8 backdrop-blur max-w-2xl mx-auto"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid",
              borderColor: "var(--glass-border)"
            }}
          >
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5" style={{ color: "var(--ocean-glow)" }}>location_on</span>
                <span style={{ color: "var(--text-dim)" }}>{t.aboutAddress}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5" style={{ color: "var(--ocean-glow)" }}>mail</span>
                <span style={{ color: "var(--text-dim)" }}>{t.aboutEmail}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5" style={{ color: "var(--ocean-glow)" }}>language</span>
                <span style={{ color: "var(--text-dim)" }}>{t.aboutWebsite}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5" style={{ color: "var(--ocean-glow)" }}>facebook</span>
                <a href="https://www.facebook.com/AIVAGlass/" target="_blank" rel="noopener noreferrer"
                  className="hover:underline" style={{ color: "var(--ocean-glow)" }}
                >
                  {t.aboutFanpage}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen pt-24">
        <AboutUs />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
