"use client";

import Link from "next/link";

import { ScoreBoard } from "@/features/play/components/score-board";
import { DeviceBridge } from "@/features/iot/device.bridge";
import { usePlayStore } from "@/features/play/play.store";
import { useI18n } from "@/lib/i18n/provider";

export function PlayStorySession() {
  const { locale } = useI18n();
  const en = locale === "en";

  const pack = usePlayStore((s) => s.pack);
  const mode = usePlayStore((s) => s.mode);
  const teams = usePlayStore((s) => s.teams);
  const scores = usePlayStore((s) => s.scores);
  const turnTeamId = usePlayStore((s) => s.turnTeamId);
  const jarStars = usePlayStore((s) => s.jarStars);
  const rules = usePlayStore((s) => s.rules);
  const storyNodeId = usePlayStore((s) => s.storyNodeId);
  const pendingMatch = usePlayStore((s) => s.pendingMatch);
  const lastMessage = usePlayStore((s) => s.lastMessage);
  const finished = usePlayStore((s) => s.finished);
  const winnerId = usePlayStore((s) => s.winnerId);
  const running = usePlayStore((s) => s.running);

  const stop = usePlayStore((s) => s.stop);
  const chooseStory = usePlayStore((s) => s.chooseStory);
  const speakAgain = usePlayStore((s) => s.speakAgain);

  const storyNode = pack.story?.find((n) => n.id === storyNodeId);
  const live = running && !finished;
  const winner = winnerId ? teams.find((t) => t.id === winnerId) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{
                background: "var(--game-story-bg)",
                color: "var(--game-story)",
                border: "1px solid var(--game-story-border)",
              }}
            >
              📖 {en ? "Story" : "Chuyện kể"}
            </span>
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

      <section
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style={{
          borderColor: "var(--game-story-border)",
          background: "var(--game-story-bg)",
        }}
      >
        {finished ? (
          <div className="text-center">
            <p className="text-5xl" aria-hidden>
              📖✨
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight">
              {winner
                ? `${winner.emoji} ${winner.name} ${en ? "wins!" : "thắng!"}`
                : en
                  ? "The End"
                  : "Hết chuyện"}
            </p>
            <p className="mt-2 text-[var(--console-muted)]">
              {lastMessage || (en ? "What a great story!" : "Chuyện hay quá!")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => void usePlayStore.getState().restart()}
                className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90"
              >
                {en ? "Read again" : "Đọc lại"}
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
            {/* Story character + bubble */}
            <div className="flex items-start gap-4">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-3xl"
                style={{
                  background: "var(--game-story)",
                  boxShadow: "0 4px 20px rgba(236, 72, 153, 0.3)",
                }}
              >
                🐰
              </div>
              <div className="flex-1">
                <div
                  className="relative rounded-2xl rounded-tl-sm border p-5"
                  style={{
                    borderColor: "var(--game-story-border)",
                    background: "var(--console-card)",
                  }}
                >
                  <p className="text-lg font-medium leading-relaxed tracking-tight sm:text-xl">
                    {storyNode?.text || lastMessage || "..."}
                  </p>
                  {/* Speech triangle */}
                  <div
                    className="absolute -left-2 top-4 h-4 w-4 rotate-45 border-l border-b"
                    style={{
                      borderColor: "var(--game-story-border)",
                      background: "var(--console-card)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Story choices */}
            {live && storyNode && !storyNode.end && (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {storyNode.choices.map((c, i) => (
                  <button
                    key={c.nextId}
                    type="button"
                    onClick={() => void chooseStory(c.nextId)}
                    className="group relative min-h-14 min-w-[10rem] rounded-xl px-6 text-base font-semibold transition-all hover:scale-105"
                    style={{
                      background: i === 0 ? "var(--game-story)" : "var(--console-inverse)",
                      color: i === 0 ? "#fff" : "var(--console-inverse-fg)",
                      boxShadow: i === 0 ? "0 4px 20px rgba(236, 72, 153, 0.3)" : undefined,
                    }}
                  >
                    {i === 0 ? "🌿" : "🏠"} {c.label}
                  </button>
                ))}
              </div>
            )}

            {pendingMatch && (
              <div
                className="mt-6 rounded-xl p-4"
                style={{ background: "var(--game-story)", color: "#fff" }}
              >
                <p className="text-center text-sm font-medium">
                  {en ? "Which team matched?" : "Đội nào khớp?"}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => void usePlayStore.getState().markCorrect(t.id)}
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
            style={{ color: "var(--game-story)" }}
          >
            {en ? "Controls" : "Điều khiển"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void speakAgain()}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
            >
              🔊 {en ? "Read again" : "Đọc lại"}
            </button>
            <button
              type="button"
              onClick={() => void DeviceBridge.getShared().quiet().catch(() => undefined)}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
            >
              Quiet
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
