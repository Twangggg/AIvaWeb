"use client";

import { useState } from "react";

interface ComponentLayer {
  id: string;
  name: string;
  category: string;
  spec: string;
  description: string;
  icon: string;
}

const LAYERS: ComponentLayer[] = [
  {
    id: "frame",
    name: "Gọng Kính Ergonomic Siêu Nhẹ 42g",
    category: "Cấu Trúc Phần Cứng Siêu Nhẹ",
    spec: "Titanium - Polycarbonate Hợp Kim",
    description: "Cấu trúc thiết kế siêu nhẹ phân bổ lực tối ưu, ôm nhẹ tai và sống mũi cho phép trẻ đeo học tập liên tục cả ngày.",
    icon: "glasses",
  },
  {
    id: "camera",
    name: "Cảm Biến AI Camera 12MP Anti-Glare",
    category: "Thị Giác Máy Tính (OCR & Vision)",
    spec: "12MP Wide-Angle + Cảm Biến Ánh Sáng",
    description: "Nhận diện bối cảnh môi trường thực tế, quét chữ viết (OCR), và phát hiện tư thế ngồi học của trẻ.",
    icon: "photo_camera",
  },
  {
    id: "optics",
    name: "Màn Hình Quang Học AR Thích Ứng",
    category: "Hiển Thị Quang Học Đa Lớp",
    spec: "Waveguide Display + Tự Động Dimming",
    description: "Màn hình chiếu quang học siêu nét tự động làm mờ thích ứng với ánh sáng tự nhiên phòng học hoặc ngoài trời.",
    icon: "visibility",
  },
  {
    id: "npu",
    name: "Chip Xử Lý AI Neural Engine 4.0",
    category: "Vi Xử Lý Trí Tuệ Nhân Tạo",
    spec: "Chip NPU Đa Nhân <100ms Reaction",
    description: "Xử lý giọng nói song ngữ Việt - Anh tức thì và phân tích hình ảnh trực tiếp không độ trễ.",
    icon: "memory",
  },
  {
    id: "speakers",
    name: "Loa Định Hướng MEMS Crystal Clear",
    category: "Âm Thanh Trường Mở",
    spec: "Dual MEMS Directional Speakers",
    description: "Truyền âm thanh riêng tư trực tiếp tới tai bé mà không cần đeo tai nghe nhét tai bảo vệ màng nhĩ.",
    icon: "graphic_eq",
  },
];

export function ExplodedGlassesShowcase() {
  const [explodeFactor, setExplodeFactor] = useState(0.6); // 0 (assembled) to 1 (exploded gap)
  const [activeLayerId, setActiveLayerId] = useState<string>("optics");

  const activeLayer = LAYERS.find((l) => l.id === activeLayerId) || LAYERS[2];

  return (
    <section id="exploded-view" className="py-16 md:py-24 px-6 relative overflow-hidden bg-slate-950/90 border-y border-slate-800/80">
      {/* Ambient Radial Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--ocean)]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
            style={{
              backgroundColor: "var(--ocean-alpha)",
              borderColor: "var(--ocean)",
              color: "var(--ocean)",
            }}
          >
            CÔNG NGHỆ BỘ PHẬN ĐỘT PHÁ
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Khám Phá Cấu Trúc Kính AIVA
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
            Điều chỉnh độ phân tách để khám phá từng lớp linh kiện quang học & chip AI bên trong kính.
          </p>
        </div>

        {/* Explode Distance Slider */}
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Lắp Ráp
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider shrink-0">
            Phân Tách 3D
          </span>
        </div>

        {/* 2-Column Grid: Left Layer Tree list (NO OVERLAP) & Right Spec Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Left Column: Clean non-overlapping layer list */}
          <div className="lg:col-span-7 space-y-3">
            {LAYERS.map((layer) => {
              const isSelected = activeLayerId === layer.id;
              // Dynamic gap spacing based on explode slider factor without overlap
              const marginSpacing = Math.round(explodeFactor * 12);

              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  style={{
                    marginBottom: `${marginSpacing}px`,
                  }}
                  className={`w-full p-4 rounded-2xl border backdrop-blur-xl text-left transition-all duration-300 flex items-center justify-between gap-4 shadow-lg group focus:outline-none ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/15 ring-2 ring-amber-400/50 shadow-amber-500/20 translate-x-2"
                      : "border-slate-800/90 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                        isSelected
                          ? "bg-amber-400 text-black border-amber-300 font-bold"
                          : "bg-slate-800 text-amber-400 border-slate-700"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{layer.icon}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? "text-amber-300" : "text-white"}`}>
                        {layer.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{layer.spec}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? "bg-amber-400 animate-ping" : "bg-slate-700"
                      }`}
                    />
                    <span className="material-symbols-outlined text-base text-slate-400 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Specification Details Card */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 rounded-3xl border border-amber-400/40 bg-slate-900/95 backdrop-blur-xl shadow-2xl space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black border border-amber-300 flex items-center justify-center shadow-lg shrink-0">
                  <span className="material-symbols-outlined text-2xl">{activeLayer.icon}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    {activeLayer.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {activeLayer.name}
                  </h3>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/70 border border-slate-800 font-mono text-xs text-amber-300">
                THÔNG SỐ: {activeLayer.spec}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeLayer.description}
              </p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Chọn các lớp linh kiện bên cạnh để khám phá</span>
                <span className="text-amber-400 font-bold">AIVA Engineering ➔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
