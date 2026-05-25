"use client";

import { useState } from "react";
import { Home3DScroll } from "@/components/home-3d-scroll";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";

const STEPS = [
  {
    n: "01",
    t: "Hướng camera vào màn hình",
    d: "AIva tự nhận biết bạn đang nhìn vào điện thoại, laptop hay TV."
  },
  {
    n: "02",
    t: "AI đọc & hiểu giao diện",
    d: "Neural Engine phân tích nội dung, nút bấm và trạng thái app trong dưới 100ms."
  },
  {
    n: "03",
    t: "Nghe hướng dẫn qua loa",
    d: "Loa định hướng hướng dẫn từng bước riêng tư, không cần tai nghe."
  }
];

const SPECS = [
  ["Cảm biến", "Đang cập nhật"],
  ["Chip xử lý", "Đang cập nhật"],
  ["Loa", "Đang cập nhật"],
  ["Pin", "Đang cập nhật"],
  ["Kết nối", "Đang cập nhật"],
  ["Trọng lượng", "Đang cập nhật"]
];

export default function HomePage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen">
        <Hero onPreorder={() => setPreorderOpen(true)} />
        <Home3DScroll />
        <HowItWorks />
        <Specs />
        <PreorderTrigger onPreorder={() => setPreorderOpen(true)} />
      </main>
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}

function Nav({ onPreorder }: { onPreorder: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[var(--ocean)] to-[var(--accent)] glow-ocean" />
          <span className="font-bold tracking-tight text-lg">
            AI<span className="text-[var(--accent)]">va</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition">Chức năng</a>
          <a href="#how" className="hover:text-white transition">Cách hoạt động</a>
          <a href="#specs" className="hover:text-white transition">Thông số</a>
          <button onClick={onPreorder} className="hover:text-white transition">Đặt trước</button>
        </div>

        <button
          onClick={onPreorder}
          className="px-5 py-2 rounded-full bg-[var(--accent)] text-black font-medium text-sm hover:scale-105 transition-transform glow-sun"
        >
          Đặt trước
        </button>
      </div>
    </nav>
  );
}

function Hero({ onPreorder }: { onPreorder: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-6">
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--ocean)]/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/30" />
          <span className="text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
            Trợ lý hình ảnh thế hệ mới
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/30" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.92] mb-6">
          <span className="text-gradient-sun">AIva</span>
          <br />
          <span className="text-gradient-ocean">nhìn cùng bạn.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Mắt kính AIva dùng camera đọc màn hình điện thoại của bạn, phân tích giao diện
          và hướng dẫn từng bước qua loa định hướng.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onPreorder}
            className="px-8 py-3.5 rounded-full bg-[var(--accent)] text-black font-semibold hover:scale-105 transition-transform glow-sun"
          >
            Đặt trước
          </button>
          <a
            href="#how"
            className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur font-medium hover:bg-white/10 transition"
          >
            Xem chi tiết ↓
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            ["Đang cập nhật", "Siêu nhẹ"],
            ["Đang cập nhật", "Phản hồi AI"],
            ["Đang cập nhật", "Pin liên tục"]
          ].map(([v, l]) => (
            <div key={l} className="glass-panel rounded-xl py-3 px-2">
              <p className="text-lg font-bold text-white">{v}</p>
              <p className="text-xs text-white/40 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--ocean)]/20 text-[var(--ocean-glow)] text-xs font-medium tracking-wider uppercase mb-5">
            Cách hoạt động
          </div>
          <h2 className="text-4xl md:text-6xl font-bold">
            Ba bước. <span className="text-gradient-ocean">Tức thì.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="relative p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-[var(--ocean)]/50 transition-colors"
              style={{ transform: `translateY(${i * 10}px)` }}
            >
              <div className="text-6xl font-bold text-gradient-sun mb-4">{s.n}</div>
              <h3 className="text-2xl font-bold mb-3">{s.t}</h3>
              <p className="text-gray-300">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Specs() {
  return (
    <section id="specs" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-14">
          Thông số <span className="text-gradient-sun">kỹ thuật</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {SPECS.map(([k, v]) => (
            <div key={k} className="bg-black/30 p-6 flex justify-between items-center">
              <span className="text-gray-400">{k}</span>
              <span className="font-medium text-white">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreorderTrigger({ onPreorder }: { onPreorder: () => void }) {
  return (
    <section id="reserve" className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Sẵn sàng <span className="text-gradient-ocean">trải nghiệm AIva?</span>
        </h2>
        <p className="text-gray-300 mb-10">
          Để lại thông tin để nhận ưu đãi đợt mở bán đầu tiên.
        </p>
        <button
          onClick={onPreorder}
          className="px-10 py-4 rounded-full bg-[var(--accent)] text-black font-semibold text-lg hover:scale-105 transition-transform glow-sun"
        >
          Đặt trước ngay
        </button>
      </div>
    </section>
  );
}
