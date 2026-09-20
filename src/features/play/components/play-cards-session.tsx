"use client";

import Link from "next/link";

import { ScoreBoard } from "@/features/play/components/score-board";
import { DeviceBridge } from "@/features/iot/device.bridge";
import { currentPrompt, progressTotal, usePlayStore } from "@/features/play/play.store";
import { useI18n } from "@/lib/i18n/provider";

export function PlayCardsSession() {
  const { locale } = useI18n();
  const en = locale === "en";

  const pack = usePlayStore((s) => s.pack);
  const mode = usePlayStore((s) => s.mode);
  const teams = usePlayStore((s) => s.teams);
  const scores = usePlayStore((s) => s.scores);
  const turnTeamId = usePlayStore((s) => s.turnTeamId);
  const jarStars = usePlayStore((s) => s.jarStars);
  const rules = usePlayStore((s) => s.rules);
  const index = usePlayStore((s) => s.index);
  const attempt = usePlayStore((s) => s.attempt);
  const pendingMatch = usePlayStore((s) => s.pendingMatch);
  const lastMessage = usePlayStore((s) => s.lastMessage);
  const finished = usePlayStore((s) => s.finished);
  const winnerId = usePlayStore((s) => s.winnerId);
  const running = usePlayStore((s) => s.running);

  const stop = usePlayStore((s) => s.stop);
  const markCorrect = usePlayStore((s) => s.markCorrect);
  const markWrong = usePlayStore((s) => s.markWrong);
  const capture = usePlayStore((s) => s.capture);
  const speakAgain = usePlayStore((s) => s.speakAgain);

  const prompt = currentPrompt({ pack, index, storyNodeId: "" });
  const total = progressTotal(pack);
  const live = running && !finished;
  const winner = winnerId ? teams.find((t) => t.id === winnerId) : null;
  const item = pack.items?.[index];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{
                background: "var(--game-cards-bg)",
                color: "var(--game-cards)",
                border: "1px solid var(--game-cards-border)",
              }}
            >
              🃏 {en ? "Cards" : "Thẻ"}
            </span>
            {total > 0 && (
              <span className="text-xs text-[var(--console-muted)]">
                {Math.min(index + 1, total)}/{total}
                {attempt === 2 ? ` · ${en ? "retry" : "thử lại"}` : ""}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{pack.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {live && (
            <button
              type="button"
              onClick={() => void stop()}
              className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-semibold hover:opacity-90"
            >
              {en ? "End round" : "Kết thúc"}
            </button>
          )}
          <Link
            href="/console/play"
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-semibold hover:opacity-90"
          >
            {en ? "Hub" : "Hub"}
          </Link>
        </div>
      </div>

      <ScoreBoard
        teams={teams}
        scores={scores}
        turnTeamId={turnTeamId}
        jarStars={jarStars}
        jarGoal={rules.jarGoal}
        jarEnabled={rules.jarEnabled}
        roundGoal={rules.roundGoal}
      />

      <section className="relative overflow-hidden rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-6 sm:p-8">
        {finished ? (
          <div className="text-center">
            <p className="text-5xl" aria-hidden>
              🃏✨
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight">
              {winner
                ? `${winner.emoji} ${winner.name} ${en ? "wins!" : "thắng!"}`
                : en
                  ? "Round over"
                  : "Hết ván"}
            </p>
            <p className="mt-2 text-[var(--console-muted)]">{lastMessage || (en ? "Nice work." : "Giỏi lắm.")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => void usePlayStore.getState().restart()}
                className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90"
              >
                {en ? "Play again" : "Chơi lại"}
              </button>
              <Link
                href="/console/play"
                className="inline-flex min-h-11 items-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
              >
                {en ? "Back to hub" : "Về hub"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Card flip visual */}
            <div className="mx-auto mb-6 w-full max-w-sm">
              <div
                className="relative rounded-2xl border-2 p-8 text-center shadow-lg"
                style={{
                  borderColor: "var(--game-cards-border)",
                  background: "var(--game-cards-bg)",
                  boxShadow: "0 12px 40px rgba(139, 92, 246, 0.15)",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--game-cards)" }}>
                  {en ? "Card" : "Thẻ"} {Math.min(index + 1, total)}/{total}
                </p>
                <p className="mt-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                  {prompt}
                </p>
                {item?.hint && (
                  <p className="mt-3 text-sm italic text-[var(--console-muted)]">
                    💡 {item.hint}
                  </p>
                )}
                <div
                  className="mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: "var(--game-cards)",
                    color: "#fff",
                  }}
                >
                  🃏 {item?.label ?? "..."}
                </div>
              </div>
            </div>

            {lastMessage && lastMessage !== prompt && (
              <p className="mt-2 text-center text-sm text-[var(--console-muted)]">{lastMessage}</p>
            )}

            {pendingMatch && (
              <div
                className="mt-6 rounded-xl p-4"
                style={{ background: "var(--game-cards)", color: "#fff" }}
              >
                <p className="text-center text-sm font-medium">
                  {en ? "Which team matched?" : "Đội nào khớp?"}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => void markCorrect(t.id)}
                      className="min-h-11 rounded-lg bg-white px-4 text-sm font-semibold text-gray-900"
                    >
                      {t.emoji} {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {live && !pendingMatch && (
        <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
          <h2
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: "var(--game-cards)" }}
          >
            {en ? "Teacher controls" : "Điều khiển cô"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void speakAgain()}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
            >
              🔊 {en ? "Say again" : "Nói lại"}
            </button>
            <button
              type="button"
              onClick={() => void DeviceBridge.getShared().quiet().catch(() => undefined)}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
            >
              Quiet
            </button>
            <button
              type="button"
              onClick={() => void DeviceBridge.getShared().find().catch(() => undefined)}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
            >
              Find
            </button>
            <button
              type="button"
              onClick={() => void capture()}
              className="min-h-11 rounded-lg px-4 text-sm font-semibold text-white hover:opacity-90"
              style={{ background: "var(--game-cards)" }}
            >
              📷 {en ? "Capture" : "Chụp"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {mode === "solo" ? (
              <button
                type="button"
                onClick={() => void markCorrect(teams[0].id)}
                className="min-h-12 rounded-lg bg-[var(--console-inverse)] px-5 text-base font-semibold text-[var(--console-inverse-fg)] hover:opacity-90"
              >
                {en ? "Correct ★" : "Đúng ★"}
              </button>
            ) : (
              teams.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => void markCorrect(t.id)}
                  className="min-h-12 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90"
                >
                  {en ? "Correct" : "Đúng"} · {t.emoji} {t.name}
                </button>
              ))
            )}
            <button
              type="button"
              onClick={() => void markWrong()}
              className="min-h-12 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-5 text-base font-semibold hover:opacity-90"
            >
              {en ? "Wrong · retry" : "Sai · thử lại"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
