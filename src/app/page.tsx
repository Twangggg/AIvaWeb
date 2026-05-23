import { Home3DScroll } from "@/components/home-3d-scroll";
import { PreorderFormNoSSR } from "@/features/preorder/components/preorder-form-no-ssr";

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
  ["Cảm biến", "Sony IMX 12MP, 120° FOV"],
  ["Chip xử lý", "AIva NPU 8-core"],
  ["Loa", "Stereo MEMS định hướng"],
  ["Pin", "14 giờ sử dụng liên tục"],
  ["Kết nối", "Wi-Fi 6E · Bluetooth 5.4"],
  ["Trọng lượng", "42 gram"]
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <Hero />
        <Home3DScroll />
        <HowItWorks />
        <Specs />
        <Preorder />
      </main>
    </>
  );
}

function Nav() {
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
          <a href="#how" className="hover:text-white transition">Cách hoạt động</a>
          <a href="#specs" className="hover:text-white transition">Thông số</a>
          <a href="#reserve" className="hover:text-white transition">Đặt trước</a>
        </div>

        <a
          href="#reserve"
          className="px-5 py-2 rounded-full bg-[var(--accent)] text-black font-medium text-sm hover:scale-105 transition-transform glow-sun"
        >
          Đặt trước
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-24 pb-16 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--ocean)]/30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[var(--accent)]/15 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur text-xs text-gray-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          Trợ lý hình ảnh thế hệ mới · 2026
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
          AI<span className="text-gradient-sun">va</span>
          <br />
          <span className="text-gradient-ocean">nhìn cùng bạn.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Mắt kính AIva dùng camera đọc màn hình điện thoại của bạn, phân tích giao diện
          và hướng dẫn từng bước qua loa định hướng.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#reserve"
            className="px-8 py-3.5 rounded-full bg-[var(--accent)] text-black font-semibold hover:scale-105 transition-transform glow-sun"
          >
            Đặt trước · 9.990.000 ₫
          </a>
          <a
            href="#how"
            className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur font-medium hover:bg-white/10 transition"
          >
            Xem chi tiết ↓
          </a>
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

function Preorder() {
  return (
    <section id="reserve" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Sẵn sàng <span className="text-gradient-ocean">trải nghiệm AIva?</span>
        </h2>
        <p className="text-center text-gray-300 mb-10">
          Để lại thông tin để nhận ưu đãi đợt mở bán đầu tiên.
        </p>
        <PreorderFormNoSSR />
      </div>
    </section>
  );
}
