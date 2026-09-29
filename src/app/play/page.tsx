"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Footer } from "@/components/common/footer";
import { Nav } from "@/components/common/nav";
import { AivaGardenGame } from "@/features/public-play/components/aiva-garden-game";
import { AivaVisionQuestGame } from "@/features/public-play/components/aiva-vision-quest-game";
import { EnergySequenceGame } from "@/features/public-play/components/energy-sequence-game";
import { RouteBuilderGame } from "@/features/public-play/components/route-builder-game";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";

type GameId = "vision-quest" | "garden" | "sequence" | "route";

const GAMES: { id: GameId; title: string; description: string; accent: string; image: string }[] = [
  { id: "vision-quest", title: "AIVA Vision Quest", description: "Dùng ống kính AIVA quét đồ vật & nhận Bằng Khám Phá Nhí.", accent: "border-amber-400/50 hover:bg-amber-400/10", image: "/games/robot-portal.webp" },
  { id: "garden", title: "Giải cứu khu vườn", description: "Tìm đường, nhặt năng lượng và mở cổng.", accent: "border-emerald-300/50 hover:bg-emerald-300/10", image: "/games/garden-maze.webp" },
  { id: "sequence", title: "Mật mã năng lượng", description: "Ghi nhớ chuỗi ánh sáng ngày một dài hơn.", accent: "border-fuchsia-300/50 hover:bg-fuchsia-300/10", image: "/games/energy-code.webp" },
  { id: "route", title: "Kỹ sư đường đi", description: "Xếp lệnh để dẫn AIVA tránh chướng ngại.", accent: "border-cyan-300/50 hover:bg-cyan-300/10", image: "/games/route-builder.webp" },
];

export default function PublicPlayPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [round, setRound] = useState(0);
  const [level, setLevel] = useState(1);
  const [collected, setCollected] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("Chạm vào ô cỏ để AIVA tự tìm đường.");

  useEffect(() => () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const restartGarden = () => {
    setRound((value) => value + 1);
    setCollected(0);
    setCompleted(false);
    setMessage("Chạm vào ô cỏ để AIVA tự tìm đường.");
  };

  const openGame = (game: GameId) => {
    if (game === "garden") restartGarden();
    setSelectedGame(game);
  };

  const nextLevel = () => {
    setLevel((value) => value + 1);
    restartGarden();
  };

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="ui-page min-h-screen overflow-hidden px-4 pb-12 pt-28 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-[100px]" />
        <section className="relative mx-auto max-w-5xl">
          {!selectedGame ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Chơi cùng AIVA</h1>
                <p className="ui-muted mt-3 text-base">Chọn một thử thách để bắt đầu trải nghiệm ống kính AI thông minh.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {GAMES.map((game) => (
                  <button key={game.id} type="button" onClick={() => openGame(game.id)} className={`ui-surface ui-border min-h-80 rounded-[2rem] border p-5 text-left shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${game.accent}`}>
                    <div className="ui-surface-soft relative mb-2 h-36 overflow-hidden rounded-2xl">
                      <Image src={game.image} alt="" fill unoptimized sizes="(min-width: 768px) 30vw, 100vw" className="object-contain object-center" />
                    </div>
                    <p className="text-xl font-black">{game.title}</p>
                    <p className="ui-muted mt-2 text-xs leading-relaxed">{game.description}</p>
                    <span className="ui-accent mt-6 inline-block text-xs font-bold">Chơi ngay ➔</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setSelectedGame(null)} className="ui-border ui-surface min-h-11 mb-6 rounded-full border px-5 text-sm font-bold transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                ← Danh sách trò chơi
              </button>

              {selectedGame === "vision-quest" && (
                <>
                  <div className="mb-7 text-center">
                    <h1 className="text-3xl font-black tracking-tight sm:text-5xl">AIVA Vision Quest</h1>
                    <p className="ui-muted mt-2 text-sm">Quét 5 vật thể trong phòng để học từ vựng song ngữ & nhận Bằng Khám Phá Nhí.</p>
                  </div>
                  <AivaVisionQuestGame />
                </>
              )}

              {selectedGame === "garden" && (
                <>
                  <div className="mb-7 text-center">
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Giải cứu khu vườn AIVA</h1>
                    <p className="ui-muted mt-3 text-base">Màn {level}: tìm 3 mảnh năng lượng, rồi đưa AIVA đến cổng.</p>
                  </div>
                  <div className="ui-surface ui-border rounded-[2rem] border p-4 shadow-xl backdrop-blur-xl sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
                      <span className="ui-surface-soft rounded-full px-4 py-2">Năng lượng: {collected}/3</span>
                      <button type="button" onClick={restartGarden} className="ui-border ui-text min-h-11 rounded-full border px-5 font-bold transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Chơi lại</button>
                    </div>
                    <AivaGardenGame round={round} onUpdate={({ collected: nextCollected, completed: nextCompleted, message: nextMessage }) => { setCollected(nextCollected); setCompleted(nextCompleted); setMessage(nextMessage); }} />
                    <p className="ui-muted mt-4 text-center text-sm" aria-live="polite">{message}</p>
                    {completed && <div className="ui-accent-soft mt-4 rounded-2xl border border-[var(--ocean)]/40 px-5 py-4 text-center" role="status"><p className="ui-accent font-black">Qua màn {level}</p><button type="button" onClick={nextLevel} className="mt-3 min-h-11 rounded-full bg-[var(--ocean)] px-5 text-sm font-bold text-[var(--text-on-accent)] transition hover:brightness-110">Vào màn {level + 1}</button></div>}
                    <p className="ui-muted mt-3 text-center text-xs">Có thể dùng phím mũi tên hoặc W, A, S, D để di chuyển từng ô.</p>
                  </div>
                </>
              )}
              {selectedGame === "sequence" && <EnergySequenceGame />}
              {selectedGame === "route" && <RouteBuilderGame />}
            </>
          )}
        </section>
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}
