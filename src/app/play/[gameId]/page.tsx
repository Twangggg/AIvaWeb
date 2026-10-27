import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  GAMES,
  getGameById,
  isValidGameId,
} from "@/features/public-play/games-data";
import { GamePageClient } from "./game-page-client";

interface GameDetailPageProps {
  params: Promise<{ gameId: string }>;
}

export function generateStaticParams() {
  return GAMES.map((g) => ({ gameId: g.id }));
}

export async function generateMetadata({
  params,
}: GameDetailPageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return {
      title: "Trò chơi không tồn tại | AIVA",
    };
  }

  return {
    title: `${game.title} | Khu Vui Chơi AIVA`,
    description: game.description,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameId } = await params;

  if (!isValidGameId(gameId)) {
    notFound();
  }

  return <GamePageClient gameId={gameId} />;
}
