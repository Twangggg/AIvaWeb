"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ScoreBoard } from "@/features/play/components/score-board";
import { DeviceBridge } from "@/features/iot/device.bridge";
import { currentPrompt, progressTotal, usePlayStore } from "@/features/play/play.store";
import { useI18n } from "@/lib/i18n/provider";

export function PlaySession() {
  const router = useRouter();
  const { locale } = useI18n();
  const en = locale === "en";

  const running = usePlayStore((s) => s.running);
  const finished = usePlayStore((s) => s.finished);
  const pack = usePlayStore((s) => s.pack);
  const mode = usePlayStore((s) => s.mode);
  const teams = usePlayStore((s) => s.teams);
  const scores = usePlayStore((s) => s.scores);
  const turnTeamId = usePlayStore((s) => s.turnTeamId);
  const jarStars = usePlayStore((s) => s.jarStars);
  const rules = usePlayStore((s) => s.rules);
  const index = usePlayStore((s) => s.index);
  const storyNodeId = usePlayStore((s) => s.storyNodeId);
  const attempt = usePlayStore((s) => s.attempt);
  const pendingMatch = usePlayStore((s) => s.pendingMatch);
  const lastMessage = usePlayStore((s) => s.lastMessage);
  const winnerId = usePlayStore((s) => s.winnerId);
  const phoneOnly = usePlayStore((s) => s.phoneOnly);
  const sessionId = usePlayStore((s) => s.sessionId);

  const stop = usePlayStore((s) => s.stop);
  const markCorrect = usePlayStore((s) => s.markCorrect);
  const markWrong = usePlayStore((s) => s.markWrong);
  const chooseStory = usePlayStore((s) => s.chooseStory);
  const capture = usePlayStore((s) => s.capture);
  const speakAgain = usePlayStore((s) => s.speakAgain);
  const onDeviceMatch = usePlayStore((s) => s.onDeviceMatch);
  const restart = usePlayStore((s) => s.restart);

  useEffect(() => {
    if (!running && !finished && !sessionId) {
      router.replace("/console/play");
    }
  }, [running, finished, sessionId, router]);

  useEffect(() => {
    const bridge = DeviceBridge.getShared();
    return bridge.onEvent((ev) => {
      if (ev.event === "capture_match") {
        void onDeviceMatch(Boolean(ev.payload?.matched ?? true));
      } else if (ev.event === "session_timeout") {
        void stop();
      }
    });
  }, [onDeviceMatch, stop]);

  if (!running && !finished) {
    return <p className="text-sm text-[#6b7280]">{en ? "Loading…" : "Đang tải…"}</p>;
  }

  const prompt = currentPrompt({ pack, index, storyNodeId });
  const total = progressTotal(pack);
  const quiz = pack.kind === "quiz" ? pack.quiz?.[index] : undefined;
  const storyNode = pack.kind === "story" ? pack.story?.find((n) => n.id === storyNodeId) : undefined;
  const winner = winnerId ? teams.find((t) => t.id === winnerId) : null;
  const live = running && !finished;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">
            {pack.kind} · {mode}
            {phoneOnly ? ` · ${en ? "tablet" : "tablet"}` : ""}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{pack.title}</h1>
          {total > 0 && (
            <p className="mt-1 text-sm text-[#6b7280]">
              {en ? "Item" : "Câu"} {Math.min(index + 1, total)}/{total}
              {attempt === 2 ? ` · ${en ? "retry" : "thử lại"}` : ""}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {live && (
            <button
              type="button"
              onClick={() => void stop()}
              className="min-h-10 rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
            >
              {en ? "End round" : "Kết thúc"}
            </button>
          )}
          <Link
            href="/console/play"
            className="inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
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

      <section className="rounded-2xl border border-black/8 bg-white/70 p-5 sm:p-8">
        {finished ? (
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight">
              {winner
                ? `${winner.emoji} ${winner.name} ${en ? "wins!" : "thắng!"}`
                : en
                  ? "Round over"
                  : "Hết ván"}
            </p>
            <p className="mt-2 text-[#6b7280]">{lastMessage || (en ? "Nice work." : "Giỏi lắm.")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => void restart()}
                className="min-h-11 rounded-lg bg-[#1a1a1a] px-4 text-sm font-semibold text-white hover:bg-black"
              >
                {en ? "Play again" : "Chơi lại"}
              </button>
              <Link
                href="/console/play"
                className="inline-flex min-h-11 items-center rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold hover:bg-black/5"
              >
                {en ? "Back to hub" : "Về hub"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {pack.kind === "quiz" && quiz && (
              <p className="mb-4 text-center text-6xl leading-none sm:text-7xl" aria-hidden>
                {quiz.emoji}
              </p>
            )}
            <p className="text-center text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{prompt}</p>
            {lastMessage && lastMessage !== prompt && (
              <p className="mt-4 text-center text-sm text-[#6b7280]">{lastMessage}</p>
            )}

            {pendingMatch && (
              <div className="mt-6 rounded-xl bg-[#1a1a1a] p-4 text-white">
                <p className="text-center text-sm font-medium">{en ? "Which team matched?" : "Đội nào khớp?"}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => void markCorrect(t.id)}
                      className="min-h-11 rounded-lg bg-white px-4 text-sm font-semibold text-[#1a1a1a]"
                    >
                      {t.emoji} {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pack.kind === "story" && storyNode && !storyNode.end && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {storyNode.choices.map((c) => (
                  <button
                    key={c.nextId}
                    type="button"
                    onClick={() => void chooseStory(c.nextId)}
                    className="min-h-12 min-w-[8rem] rounded-lg bg-[#1a1a1a] px-5 text-base font-semibold text-white hover:bg-black"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {live && !pendingMatch && pack.kind !== "story" && (
        <section className="rounded-2xl border border-black/8 bg-white/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a7a4a]">
            {en ? "Teacher controls" : "Điều khiển cô"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void speakAgain()}
              className="min-h-11 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold hover:bg-black/5"
            >
              {en ? "Say again" : "Nói lại"}
            </button>
            <button
              type="button"
              onClick={() => void DeviceBridge.getShared().quiet().catch(() => undefined)}
              className="min-h-11 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold hover:bg-black/5"
            >
              Quiet
            </button>
            <button
              type="button"
              onClick={() => void DeviceBridge.getShared().find().catch(() => undefined)}
              className="min-h-11 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold hover:bg-black/5"
            >
              Find
            </button>
            {(pack.kind === "hunt" || pack.kind === "cards") && (
              <button
                type="button"
                onClick={() => void capture()}
                className="min-h-11 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold hover:bg-black/5"
              >
                {en ? "Capture" : "Chụp"}
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {mode === "solo" ? (
              <button
                type="button"
                onClick={() => void markCorrect(teams[0].id)}
                className="min-h-12 rounded-lg bg-[#1a1a1a] px-5 text-base font-semibold text-white hover:bg-black"
              >
                {en ? "Correct ★" : "Đúng ★"}
              </button>
            ) : (
              teams.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => void markCorrect(t.id)}
                  className="min-h-12 rounded-lg bg-[#1a1a1a] px-4 text-sm font-semibold text-white hover:bg-black"
                >
                  {en ? "Correct" : "Đúng"} · {t.emoji} {t.name}
                </button>
              ))
            )}
            <button
              type="button"
              onClick={() => void markWrong()}
              className="min-h-12 rounded-lg border border-black/15 bg-white px-5 text-base font-semibold hover:bg-black/5"
            >
              {en ? "Wrong · retry" : "Sai · thử lại"}
            </button>
          </div>

          {pack.kind === "quiz" && quiz && (
            <p className="mt-4 text-xs text-[#6b7280]">
              {en ? "Hint (teacher only)" : "Gợi ý (chỉ cô)"}: {quiz.answers[quiz.correctIndex]}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
