"use client";

import { useState } from "react";
import Image from "next/image";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { useI18n } from "@/lib/i18n/provider";

export default function NewsPage() {
  const { t } = useI18n();
  const [preorderOpen, setPreorderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const POSTS_PER_PAGE = 2;

  const HIGHLIGHTS = [
    t.kidsPost1HL1,
    t.kidsPost1HL2,
    t.kidsPost1HL3,
    t.kidsPost1HL4,
    t.kidsPost1HL5
  ];

  const HIGHLIGHTS4 = [
    t.kidsPost4HL1,
    t.kidsPost4HL2,
    t.kidsPost4HL3,
    t.kidsPost4HL4
  ];

  const HIGHLIGHTS5 = [
    t.kidsPost5HL1,
    t.kidsPost5HL2,
    t.kidsPost5HL3,
    t.kidsPost5HL4
  ];

  const HIGHLIGHTS6 = [
    t.kidsPost6HL1,
    t.kidsPost6HL2,
    t.kidsPost6HL3
  ];

  const POSTS = [
    {
      image: "/bai-dang-1.png",
      title: t.kidsPost1Title,
      desc: t.kidsPost1Desc,
      highlights: HIGHLIGHTS,
      imageLeft: true
    },
    {
      image: "/bai-dang-2.png",
      title: t.kidsPost2Title,
      desc: t.kidsPost2Desc,
      highlights: null,
      imageLeft: false
    },
    {
      image: "/bai-dang-3.png",
      title: t.kidsPost3Title,
      desc: t.kidsPost3Desc,
      highlights: null,
      imageLeft: true
    },
    {
      image: "/bai-dang-4.png",
      title: t.kidsPost4Title,
      desc: t.kidsPost4Desc,
      highlights: HIGHLIGHTS4,
      imageLeft: false
    },
    {
      image: "/bai-dang-5.png",
      title: t.kidsPost5Title,
      desc: t.kidsPost5Desc,
      highlights: HIGHLIGHTS5,
      imageLeft: true
    },
    {
      image: "/bai-dang-6.png",
      title: t.kidsPost6Title,
      desc: t.kidsPost6Desc,
      highlights: HIGHLIGHTS6,
      imageLeft: false
    }
  ];

  const totalPages = Math.ceil(POSTS.length / POSTS_PER_PAGE);
  const currentPosts = POSTS.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen pt-24">
        <section id="for-kids" className="py-28 px-6 relative">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/8 blur-[80px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
                style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean-glow)" }}
              >
                {t.kidsTag}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                {t.kidsTitle}
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "var(--text-dim)" }}>
                {t.kidsDesc}
              </p>
            </div>

            <div className="flex flex-col gap-12">
              {currentPosts.map((post) => (
                <div
                  key={post.title}
                  className="flex flex-col md:flex-row gap-8 items-center"
                  style={{ flexDirection: post.imageLeft ? undefined : "row-reverse" }}
                >
                  <div className="w-full md:w-1/2">
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid",
                        borderColor: "var(--glass-border)"
                      }}
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div
                      className="rounded-2xl p-8 backdrop-blur"
                      style={{
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid",
                        borderColor: "var(--glass-border)"
                      }}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-snug" style={{ color: "var(--text-on-glass)" }}>
                        {post.title}
                      </h3>
                      <p style={{ color: "var(--text-dim)" }}>
                        {post.desc}
                      </p>
                      {post.highlights && (
                        <ul className="mt-6 flex flex-col gap-3">
                          {post.highlights.map((hl) => (
                            <li key={hl} className="flex items-start gap-3">
                              <span
                                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: "var(--accent)" }}
                              />
                              <span className="text-sm" style={{ color: "var(--text-on-glass)" }}>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className="w-10 h-10 rounded-full font-medium transition-all"
                    style={{
                      backgroundColor: currentPage === i ? "var(--accent)" : "var(--bg-subtle)",
                      color: currentPage === i ? "var(--text-on-accent)" : "var(--text-dim)",
                      border: "1px solid",
                      borderColor: currentPage === i ? "var(--accent)" : "var(--border-subtle)"
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
