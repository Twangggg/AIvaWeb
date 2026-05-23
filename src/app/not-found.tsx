import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/15 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <h1 className="text-8xl md:text-[10rem] font-bold leading-[0.8] mb-6 select-none">
          <span className="text-gradient-sun">4</span>
          <span className="text-white/10">0</span>
          <span className="text-gradient-ocean">4</span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          AIva{" "}
          <span className="text-gradient-ocean">không thấy</span>
        </h2>

        <p className="text-white/50 leading-relaxed mb-10">
          Trang bạn tìm không tồn tại hoặc đã bị di dời.
          <br />
          Có thể AIva chưa kịp nhìn thấy nó.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent)] text-black font-semibold hover:scale-105 transition-transform glow-sun"
        >
          ← Quay về trang chủ
        </Link>
      </div>
    </main>
  );
}
