"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EditorialPanel } from "@/components/ui/narrative-motion";
import { FamilyGreeting } from "@/components/common/family-greeting";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";

interface ArticleCard {
  id: string;
  tag: string;
  image: string;
  title: string;
  desc: string;
  href: string;
}

export default function NewsPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  // Pure News Articles Array
  const NEWS_ARTICLES: ArticleCard[] = [
    {
      id: "aiva-for-kids",
      tag: "Giới Thiệu Thương Hiệu",
      image: "/bai-dang-1.png",
      title:
        "AIVA Dành Cho Trẻ Em: Chiếc Kính AI Giúp Con Học Mà Không Cần Màn Hình",
      desc: "Giải pháp kính thông minh nhận diện môi trường thực, hỗ trợ trẻ học song ngữ Việt - Anh và bảo vệ thị lực tối đa.",
      href: "/news/aiva-for-kids",
    },
  ];

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="family-page min-h-screen pb-20">
        <section id="news-hub" className="pb-12 md:pb-20 px-6 relative">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/8 blur-[80px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <FamilyGreeting topic="news" label="TIN TỨC & NỘI DUNG AIVA" />

            <div className="grid grid-cols-1 gap-8">
              {NEWS_ARTICLES.map((article, index) => (
                <EditorialPanel key={article.id} index={index} kind="print">
                  <Link
                    href={article.href}
                    className="group grid min-w-0 overflow-hidden rounded-[28px] border lg:grid-cols-[1.1fr_1fr]"
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      borderColor: "var(--glass-border)",
                    }}
                  >
                    <div className="flex min-w-0 items-center bg-[var(--bg-subtle)] p-3 sm:p-5 lg:p-6">
                      <Image
                        src={article.image}
                        alt="Giới thiệu AIVA: kính AI giúp bé khám phá thế giới, học tiếng Anh và đồng hành cùng ba mẹ"
                        width={1462}
                        height={846}
                        sizes="(max-width: 1023px) calc(100vw - 88px), 560px"
                        className="h-auto w-full rounded-2xl border border-[var(--border-subtle)]"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7 lg:p-8">
                      <span className="mb-4 self-start rounded-full bg-[var(--ocean-alpha)] px-3 py-1.5 text-[11px] font-bold text-[var(--ocean)]">
                        {String(index + 1).padStart(2, "0")} / {article.tag}
                      </span>
                      <h3 className="text-2xl font-bold leading-tight text-[var(--text-on-glass)] transition-colors group-hover:text-[var(--ocean)] lg:text-[26px]">
                        {article.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--text-dim)]">
                        {article.desc}
                      </p>
                      <div
                        className="mt-6 flex items-center justify-between border-t pt-5 text-sm font-bold text-[var(--ocean)]"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        <span>Đọc bài viết</span>
                        <span
                          aria-hidden="true"
                          className="text-2xl transition-transform group-hover:translate-x-2"
                        >
                          ↗
                        </span>
                      </div>
                    </div>
                  </Link>
                </EditorialPanel>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PreorderModal
        open={preorderOpen}
        onClose={() => setPreorderOpen(false)}
      />
    </>
  );
}
