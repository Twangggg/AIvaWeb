"use client";

import { useEffect, useRef, useState } from "react";
import AivaGlasses3D from "@/components/AivaGlasses3D";

const SECTIONS = [
  {
    tag: "Giới thiệu",
    title: "Gặp AIva — đôi mắt AI của bạn",
    desc: "AIva là chiếc kính thông minh nhìn vào màn hình của bạn, hiểu bạn đang ở đâu trong ứng dụng, và nói cho bạn biết bước tiếp theo."
  },
  {
    tag: "Camera",
    title: "Camera đọc màn hình thời gian thực",
    desc: "Cảm biến 12MP chống loá hướng xuống màn hình điện thoại hoặc laptop."
  },
  {
    tag: "AI xử lý",
    title: "Phân tích bằng Neural Engine",
    desc: "Chip AIva NPU phân tích layout, OCR đa ngôn ngữ và đối chiếu ngữ cảnh ứng dụng."
  },
  {
    tag: "Loa định hướng",
    title: "Hướng dẫn từng bước qua loa",
    desc: "Hai loa MEMS định hướng thì thầm chỉ dẫn ngay khi bạn thao tác sai hoặc bị kẹt luồng."
  }
];

export function Home3DScroll() {
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      scrollY.current = p;
      const idx = Math.min(SECTIONS.length - 1, Math.floor(p * SECTIONS.length + 0.0001));
      setActive(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={stageRef} id="features" className="relative" style={{ height: `${SECTIONS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] rounded-full bg-[var(--ocean)]/25 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-[var(--accent)]/15 blur-3xl" />
        </div>

        <div className="absolute inset-0">
          <AivaGlasses3D scrollY={scrollY} />
        </div>

        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center pointer-events-none">
            <div className="relative h-[55vh]">
              {SECTIONS.map((s, i) => (
                <div
                  key={s.tag}
                  className="absolute inset-0 flex flex-col justify-center transition-all duration-700"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translateY(${(i - active) * 30}px)`
                  }}
                >
                  <div className="inline-block w-fit px-3 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-medium tracking-wider uppercase mb-5">
                    {s.tag}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold leading-[1.05] mb-6">{s.title}</h2>
                  <p className="text-lg text-gray-300 max-w-lg">{s.desc}</p>
                </div>
              ))}
            </div>
            <div />
          </div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-500 ${
                i === active ? "bg-[var(--accent)] h-10" : "bg-white/30 h-4"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
