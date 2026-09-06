"use client";

import { useCallback, useState } from "react";

import {
  postAdminStudyChat,
  type StudyChatTurn,
} from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

const ACTION_STYLES: Record<string, string> = {
  SAFETY_BLOCK: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  ANSWER_FULL: "bg-black/10 text-[var(--console-fg)] dark:bg-white/10",
  ANSWER_BRIEF: "bg-black/10 text-[var(--console-fg)] dark:bg-white/10",
  CONSOLIDATE: "bg-black/5 text-[var(--console-muted)] dark:bg-white/5",
  ASK_BACK: "bg-[var(--console-accent)]/20 text-[#5c4a00] dark:text-[#f5e6a3]",
  HINT: "bg-[var(--console-accent)]/20 text-[#5c4a00] dark:text-[#f5e6a3]",
  ASSIGN_EXPLORE:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  REQUEST_VERIFY:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  SEED_NEXT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

function ActionBadge({ action }: { action: string }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
        ACTION_STYLES[action] ?? "bg-black/5 text-[var(--console-muted)]"
      }`}
    >
      {action}
    </span>
  );
}

export default function StudyChatPage() {
  const { locale } = useI18n();
  const en = locale === "en";
  const token = useAuthStore((s) => s.tokens?.accessToken);

  const [condition, setCondition] = useState<"C0" | "C2">("C2");
  const [participant, setParticipant] = useState("P900");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<
    { kind: "child" | "ai" | "system"; text: string; actions?: string[] }[]
  >([]);
  const [lastState, setLastState] = useState<StudyChatTurn["state"] | null>(
    null
  );

  const runTurn = useCallback(
    async (payload: {
      text?: string;
      intent?: Parameters<typeof postAdminStudyChat>[1]["intent"];
    }) => {
      if (!token) return;
      setBusy(true);
      setError(null);
      try {
        const result = await postAdminStudyChat(token, {
          participant_code: participant,
          condition,
          session_id: sessionId,
          ...payload,
        });
        setSessionId(result.session_id);
        setLastState(result.state);

        const nextTurns: typeof turns = [];
        if (payload.text?.trim()) {
          nextTurns.push({ kind: "child", text: payload.text.trim() });
        }
        if (result.actions.length > 0) {
          nextTurns.push({
            kind: "system",
            text: result.reason ?? "",
            actions: result.actions,
          });
        }
        if (result.reply) {
          nextTurns.push({ kind: "ai", text: result.reply });
        }
        setTurns((prev) => [...prev, ...nextTurns]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setBusy(false);
      }
    },
    [token, participant, condition, sessionId]
  );

  const startSession = async () => {
    setSessionId(null);
    setTurns([]);
    setLastState(null);
    const result = await postAdminStudyChat(token!, {
      participant_code: participant,
      condition,
      session_id: null,
      text: "Xin chào AIVA!",
      intent: "question",
    });
    setSessionId(result.session_id);
    setLastState(result.state);
    setTurns([
      { kind: "child", text: "Xin chào AIVA!" },
      {
        kind: "system",
        text: result.reason ?? "",
        actions: result.actions,
      },
      ...(result.reply ? [{ kind: "ai" as const, text: result.reply }] : []),
    ]);
  };

  const submitText = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    void runTurn({ text, intent: "question" });
  };

  const quickIntent = (
    intent: Parameters<typeof postAdminStudyChat>[1]["intent"]
  ) => {
    void runTurn({ text: "", intent });
  };

  const labelEn = {
    title: "Study Chat Sandbox",
    sub: "Run the v1 curiosity policy live · C0 packs the answer, C2 adapts (ask-back → explore → verify → close)",
    start: "Start session",
    condition: "Condition",
    participant: "Participant",
    send: "Send",
    dontKnow: "Em không biết",
    answerNow: "Trả lời ngay",
    exploreDone: "Đã khám phá xong",
    exploreFailed: "Khám phá thất bại",
    end: "Kết thúc phiên",
    reset: "Reset",
    emptySession: "Bắt đầu một phiên mới để chat với policy.",
    state: "Session state",
    policyDecision: "Policy decision",
  };
  const labelVi = {
    title: "Chat thử nghiệm study",
    sub: "Chạy policy tò mò v1 trực tiếp · C0 luôn trả lời đủ, C2 thích nghi (gợi mở → khám phá → xác minh → chốt)",
    start: "Bắt đầu phiên",
    condition: "Điều kiện",
    participant: "Người tham gia",
    send: "Gửi",
    dontKnow: "Em không biết",
    answerNow: "Trả lời ngay",
    exploreDone: "Đã khám phá xong",
    exploreFailed: "Khám phá thất bại",
    end: "Kết thúc phiên",
    reset: "Làm mới",
    emptySession: "Bấm “Bắt đầu phiên” để chat với policy.",
    state: "Trạng thái phiên",
    policyDecision: "Quyết định policy",
  };
  const L = en ? labelEn : labelVi;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-[var(--console-fg)]">
          {L.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--console-muted)]">{L.sub}</p>
      </header>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--console-muted)]">
          {L.condition}
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as "C0" | "C2")}
            disabled={busy || !!sessionId}
            className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)]"
          >
            <option value="C0">C0 · Direct</option>
            <option value="C2">C2 · Curiosity-adaptive</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--console-muted)]">
          {L.participant}
          <input
            value={participant}
            onChange={(e) => setParticipant(e.target.value.trim())}
            disabled={busy || !!sessionId}
            className="min-h-10 w-28 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)]"
          />
        </label>
        <button
          type="button"
          onClick={() => void startSession()}
          disabled={busy || !token || !!sessionId}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--console-accent)] px-4 text-sm font-semibold text-[var(--console-accent-fg)] hover:opacity-90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            play_arrow
          </span>
          {L.start}
        </button>
        {sessionId && (
          <button
            type="button"
            onClick={() => void quickIntent("end")}
            disabled={busy}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">stop</span>
            {L.end}
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="flex flex-col gap-3 rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
          {turns.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--console-muted)]">
              {L.emptySession}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {turns.map((turn, i) =>
                turn.kind === "system" ? (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[var(--console-muted)]">
                      {L.policyDecision}
                    </span>
                    {turn.actions?.map((a) => (
                      <ActionBadge key={a} action={a} />
                    ))}
                  </div>
                ) : (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      turn.kind === "child"
                        ? "self-end rounded-br-sm bg-[var(--console-accent)] text-[var(--console-accent-fg)]"
                        : "self-start rounded-bl-sm bg-black/[0.04] text-[var(--console-fg)] dark:bg-white/[0.06]"
                    }`}
                  >
                    {turn.text}
                  </div>
                )
              )}
              {busy && <p className="text-xs text-[var(--console-muted)]">…</p>}
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => quickIntent("dont_know")}
              disabled={busy || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.dontKnow}
            </button>
            <button
              type="button"
              onClick={() => quickIntent("request_answer_now")}
              disabled={busy || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.answerNow}
            </button>
            <button
              type="button"
              onClick={() => quickIntent("explore_done")}
              disabled={busy || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.exploreDone}
            </button>
            <button
              type="button"
              onClick={() => quickIntent("explore_failed")}
              disabled={busy || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.exploreFailed}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitText();
              }}
              placeholder={
                sessionId
                  ? en
                    ? "Type a child question… (e.g. “Tại sao trời mưa?”)"
                    : "Gõ câu hỏi của trẻ… (vd “Tại sao trời mưa?”)"
                  : en
                    ? "Start a session first"
                    : "Bắt đầu phiên trước"
              }
              disabled={busy || !sessionId || !token}
              className="min-h-10 flex-1 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm text-[var(--console-fg)] outline-none placeholder:text-[var(--console-muted)] focus:border-[var(--console-accent)]"
            />
            <button
              type="button"
              onClick={submitText}
              disabled={busy || !sessionId || !input.trim()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[var(--console-accent)] px-4 text-sm font-semibold text-[var(--console-accent-fg)] hover:opacity-90 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                send
              </span>
              {L.send}
            </button>
          </div>
        </section>

        <aside className="flex flex-col gap-3 rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
          <h2 className="text-sm font-semibold text-[var(--console-fg)]">
            {L.state}
          </h2>
          {!lastState ? (
            <p className="text-xs text-[var(--console-muted)]">
              {en ? "No state yet." : "Chưa có trạng thái."}
            </p>
          ) : (
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <StateCell
                label="turnCount"
                value={String(lastState.turnCount)}
              />
              <StateCell
                label="chainDepth"
                value={String(lastState.chainDepth)}
              />
              <StateCell label="depthGuess" value={lastState.depthGuess} />
              <StateCell
                label="exploreStatus"
                value={lastState.exploreStatus}
              />
              <StateCell
                label="scaffolds"
                value={String(lastState.scaffoldsSinceAnswer)}
              />
              <StateCell
                label="oracleRisk"
                value={lastState.oracleRisk.toFixed(2)}
              />
              <StateCell
                label="frustrated"
                value={String(lastState.frustrated)}
              />
              <StateCell
                label="escapeUsed"
                value={String(lastState.escapeUsed)}
              />
              <StateCell
                label="seeded"
                value={String(lastState.curiositySeededSinceLastAnswer)}
              />
              <StateCell
                label="lastAction"
                value={lastState.lastAction ?? "—"}
              />
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}

function StateCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/[0.03] px-2.5 py-2 dark:bg-white/[0.04]">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
        {label}
      </dt>
      <dd className="mt-0.5 truncate font-medium text-[var(--console-fg)]">
        {value}
      </dd>
    </div>
  );
}
