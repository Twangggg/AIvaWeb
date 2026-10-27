"use client";

import { useState } from "react";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { GameId } from "@/features/public-play/games-data";
import { GameRunner } from "@/features/public-play/components/game-runner";

interface GamePageClientProps {
  gameId: GameId;
}

export function GamePageClient({ gameId }: GamePageClientProps) {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      {/* Retain top site header across all games */}
      <Nav onPreorder={() => setPreorderOpen(true)} />

      <main className="ui-page min-h-screen overflow-x-hidden px-3 sm:px-6 family-page pt-24 sm:pt-28 pb-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-[100px]" />
        <section className="relative mx-auto w-full max-w-4xl xl:max-w-5xl">
          <GameRunner gameId={gameId} />
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
