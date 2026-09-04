"use client";

export function ScoreBoard({
  teams,
  scores,
  turnTeamId,
  jarStars,
  jarGoal,
  jarEnabled,
  roundGoal,
}: {
  teams: { id: string; name: string; emoji: string }[];
  scores: Record<string, number>;
  turnTeamId: string;
  jarStars: number;
  jarGoal: number;
  jarEnabled: boolean;
  roundGoal: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {teams.map((t) => {
          const active = t.id === turnTeamId;
          return (
            <div
              key={t.id}
              className={`rounded-xl px-3 py-2.5 ${active ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]" : "bg-black/[0.03]"}`}
            >
              <p className="text-sm font-semibold">
                {t.emoji} {t.name}
              </p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${active ? "text-white" : "text-[var(--console-fg)]"}`}>
                {scores[t.id] ?? 0}
                <span className={`ml-1 text-sm font-medium ${active ? "text-white/70" : "text-[var(--console-muted)]"}`}>
                  / {roundGoal} ★
                </span>
              </p>
            </div>
          );
        })}
      </div>
      {jarEnabled && (
        <p className="text-sm text-[var(--console-muted)]">
          Hũ lớp:{" "}
          <span className="font-semibold text-[var(--console-fg)]">
            {jarStars} / {jarGoal} ★
          </span>
        </p>
      )}
    </div>
  );
}
