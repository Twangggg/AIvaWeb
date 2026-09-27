"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
      title: "AIVA Dành Cho Trẻ Em: Chiếc Kính AI Giúp Con Học Mà Không Cần Màn Hình",
      desc: "Giải pháp kính thông minh nhận diện môi trường thực, hỗ trợ trẻ học song ngữ Việt - Anh và bảo vệ thị lực tối đa.",
      href: "/news/aiva-for-kids"
    }
  ];

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen pt-24 pb-20">
        <section id="news-hub" className="py-12 md:py-20 px-6 relative">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/8 blur-[80px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div
                className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 border"
                style={{
                  backgroundColor: "var(--ocean-alpha)",
                  borderColor: "var(--ocean)",
                  color: "var(--ocean)"
                }}
              >
                TIN TỨC & NỘI DUNG AIVA
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight" style={{ color: "var(--text-on-glass)" }}>
                Tin Tức & Thông Tin AIVA
              </h1>
              <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-dim)" }}>
                Cập nhật các tin tức mới nhất, hướng dẫn sản phẩm và thông tin công nghệ từ AIVA.
              </p>
            </div>

            {/* PURE NEWS ARTICLES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {NEWS_ARTICLES.map((article) => (
                <Link
                  key={article.id}
                  href={article.href}
                  className="group relative rounded-3xl overflow-hidden border backdrop-blur p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:border-[var(--ocean)]"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderColor: "var(--glass-border)"
                  }}
                >
                  <div>
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border" style={{ borderColor: "var(--glass-border)" }}>
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-md backdrop-blur-md"
                        style={{
                          backgroundColor: "rgba(10, 14, 20, 0.85)",
                          borderColor: "var(--ocean)",
                          color: "var(--ocean)"
                        }}
                      >
                        #{article.tag}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-[var(--ocean)] transition-colors text-white">
                      {article.title}
                    </h3>
                    <p className="text-xs line-clamp-3 leading-relaxed mb-4 text-slate-300">
                      {article.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-[var(--ocean)]">
                    <span>Đọc Bài Viết ➔</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
