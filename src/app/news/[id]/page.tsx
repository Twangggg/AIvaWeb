"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = use(params);
  const { t } = useI18n();
  const [preorderOpen, setPreorderOpen] = useState(false);

  const ARTICLE_SECTIONS = [
    {
      title: t.kidsPost1Title,
      desc: t.kidsPost1Desc,
      image: "/bai-dang-1.png",
      highlights: [
        t.kidsPost1HL1,
        t.kidsPost1HL2,
        t.kidsPost1HL3,
        t.kidsPost1HL4,
        t.kidsPost1HL5
      ]
    },
    {
      title: t.kidsPost2Title,
      desc: t.kidsPost2Desc,
      image: "/bai-dang-2.png",
      highlights: null
    },
    {
      title: t.kidsPost3Title,
      desc: t.kidsPost3Desc,
      image: "/bai-dang-3.png",
      highlights: null
    },
    {
      title: t.kidsPost4Title,
      desc: t.kidsPost4Desc,
      image: "/bai-dang-4.png",
      highlights: [
        t.kidsPost4HL1,
        t.kidsPost4HL3,
        t.kidsPost4HL4
      ]
    },
    {
      title: t.kidsPost5Title,
      desc: t.kidsPost5Desc,
      image: "/bai-dang-5.png",
      highlights: [
        t.kidsPost5HL1,
        t.kidsPost5HL2,
        t.kidsPost5HL3,
        t.kidsPost5HL4
      ]
    },
    {
      title: t.kidsPost6Title,
      desc: t.kidsPost6Desc,
      image: "/bai-dang-6.png",
      highlights: [
        t.kidsPost6HL1,
        t.kidsPost6HL2,
        t.kidsPost6HL3
      ]
    }
  ];

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-6 py-10 relative">
          {/* Breadcrumb & Navigation Back */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ocean)] hover:underline"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại Trang Tin Tức
            </Link>
            <div className="text-xs text-[var(--text-dim)] font-medium">
              Chuyên mục: Tin Tức & Thông Tin AIVA
            </div>
          </div>

          {/* Article Header */}
          <div className="mb-10 text-center">
            <div
              className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border"
              style={{
                backgroundColor: "var(--ocean-alpha)",
                borderColor: "var(--ocean)",
                color: "var(--ocean)"
              }}
            >
              #TIN TỨC AIVA
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight text-[var(--text-on-glass)]">
              AIVA Dành Cho Trẻ Em: Chiếc Kính AI Giúp Con Học Mà Không Cần Màn Hình
            </h1>
            <p className="text-base text-[var(--text-dim)] max-w-2xl mx-auto leading-relaxed">
              Giải pháp kính thông minh nhận diện môi trường thực, hỗ trợ trẻ học song ngữ Việt - Anh, bảo vệ thị lực và thắp lên trí tò mò tự nhiên.
            </p>
          </div>

          {/* Featured Header Banner Image */}
          <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden mb-12 border shadow-2xl" style={{ borderColor: "var(--border-subtle)" }}>
            <Image
              src="/bai-dang-1.png"
              alt="AIVA Dành Cho Trẻ Em"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content Rendered as 6 Sections */}
          <div className="space-y-14">
            {ARTICLE_SECTIONS.map((sec, index) => (
              <section
                key={sec.title}
                className="p-6 md:p-8 rounded-3xl border backdrop-blur shadow-lg transition-all"
                style={{
                  backgroundColor: "var(--glass-bg)",
                  borderColor: "var(--glass-border)"
                }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden border shadow-md" style={{ borderColor: "var(--border-subtle)" }}>
                      <Image
                        src={sec.image}
                        alt={sec.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[var(--ocean)]">
                      Phần {index + 1} / 6
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 text-[var(--text-on-glass)] leading-snug">
                      {sec.title}
                    </h2>
                    <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-4">
                      {sec.desc}
                    </p>

                    {sec.highlights && (
                      <ul className="space-y-2 pt-3 border-t text-xs text-[var(--text-on-glass)]" style={{ borderColor: "var(--border-subtle)" }}>
                        {sec.highlights.map((hl) => (
                          <li key={hl} className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--ocean)] mt-1 shrink-0" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Preorder CTA */}
          <div className="mt-14 p-8 rounded-3xl border text-center bg-[linear-gradient(90deg,rgba(234,179,8,.13),rgba(255,255,255,.72),rgba(234,179,8,.13))] border-amber-500/30 shadow-2xl dark:bg-[linear-gradient(90deg,#0f172a,rgba(120,53,15,.3),#0f172a)]">
            <h3 className="text-2xl font-bold text-[var(--text-on-glass)] mb-2">
              Sẵn Sàng Đồng Hành Cùng Trí Tuệ Con?
            </h3>
            <p className="text-sm text-[var(--text-dim)] max-w-md mx-auto mb-6">
              Đặt trước kính thông minh AIVA ngay hôm nay để nhận ưu đãi đặc biệt cho phụ huynh.
            </p>
            <button
              onClick={() => setPreorderOpen(true)}
              className="px-8 py-3.5 rounded-full font-bold text-sm text-black shadow-lg hover:scale-105 transition-transform"
              style={{ background: "var(--gradient-ocean)" }}
            >
              Đặt Trước Kính AIVA Ngay ➔
            </button>
          </div>
        </article>
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
