"use client";

import { useCallback, useRef, useState } from "react";

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

// From docs/research/15-topic-packs.md. groundable drives C2's
// explore-vs-ask-back branch (T07 is deliberately non-groundable).
const TOPICS: { id: string; label: string; groundable: boolean }[] = [
  { id: "T01", label: "Lá cây", groundable: true },
  { id: "T02", label: "Bóng", groundable: true },
  { id: "T03", label: "Nam châm", groundable: true },
  { id: "T04", label: "Côn trùng sân", groundable: true },
  { id: "T05", label: "Nổi / chìm", groundable: true },
  { id: "T06", label: "Âm thanh", groundable: true },
  { id: "T07", label: "Đường tới trường", groundable: false },
  { id: "T08", label: "Thời tiết", groundable: true },
  { id: "T09", label: "Chậu cây", groundable: true },
  { id: "T10", label: "Phân loại rác", groundable: true },
];

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
  const [topicId, setTopicId] = useState("T02");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const startingRef = useRef(false);
  const dryRef = useRef(false);
  const [dryrunning, setDryrunning] = useState(false);
  const [dryLog, setDryLog] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<
    { kind: "child" | "ai" | "system"; text: string; actions?: string[] }[]
  >([]);
  const [lastState, setLastState] = useState<StudyChatTurn["state"] | null>(
    null
  );

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[1];
  const running = busy || dryrunning;

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
          topic_id: topicId,
          topic_groundable: topic.groundable,
          ...payload,
        });
        if (result.session_ended) setSessionId(null);
        setLastState(result.state);

        const nextTurns: typeof turns = [];
        if (result.session_ended) {
          nextTurns.push({
            kind: "system",
            text: en ? "Session ended." : "Đã kết thúc phiên.",
          });
        }
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
    [token, participant, condition, sessionId, topic, topicId, en]
  );

  const startSession = async () => {
    if (startingRef.current) return; // guard double-click race
    startingRef.current = true;
    setBusy(true);
    setError(null);
    setSessionId(null);
    setTurns([]);
    setLastState(null);
    try {
      const result = await postAdminStudyChat(token!, {
        participant_code: participant,
        condition,
        session_id: null,
        topic_id: topicId,
        topic_groundable: topic.groundable,
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
      startingRef.current = false;
    }
  };

  const runAutoDryRun = async () => {
    if (dryRef.current || !token) return;
    dryRef.current = true;
    setDryrunning(true);
    setDryLog([]);
    setError(null);
    const log: string[] = [];
    const stamp = () => new Date().toISOString().slice(11, 19);
    const line = (s: string) => {
      log.push(s);
      setDryLog([...log]);
    };
    let pass = 0;
    let fail = 0;
    const check = (name: string, ok: boolean, extra = "") => {
      if (ok) {
        pass += 1;
        line(`  [PASS] ${name}`);
      } else {
        fail += 1;
        line(`  [FAIL] ${name} ${extra}`);
      }
    };
    const base = (participant.trim() || "PDRY").replace(/[^A-Za-z0-9_-]/g, "");
    const api = async (
      part: string,
      cond: "C0" | "C2",
      sid: string | null,
      payload: { text?: string; intent?: Parameters<typeof postAdminStudyChat>[1]["intent"] },
      tid: string
    ) =>
      postAdminStudyChat(token, {
        participant_code: part,
        condition: cond,
        session_id: sid,
        topic_id: tid,
        topic_groundable: true,
        ...payload,
      });

    try {
      // ---- C0 · Direct: always ANSWER_FULL, never explore ----
      line(`${stamp()} C0 → ${base}-C0 · topic T02 (groundable)`);
      let r = await api(`${base}-C0`, "C0", null, {
        text: "Tại sao quả bóng lại nảy lên?",
        intent: "question",
      }, "T02");
      check(
        "C0 #1 ANSWER_FULL",
        r.actions[0] === "ANSWER_FULL",
        `→ got ${r.actions.join(",")}`
      );
      check("C0 #1 reason c0_always_answer", r.reason === "c0_always_answer", `→ got ${r.reason}`);
      r = await api(`${base}-C0`, "C0", r.session_id, {
        text: "Quả bóng to nảy có cao hơn quả bóng nhỏ không?",
        intent: "question",
      }, "T02");
      check(
        "C0 #2 ANSWER_FULL",
        r.actions[0] === "ANSWER_FULL",
        `→ got ${r.actions.join(",")}`
      );
      r = await api(`${base}-C0`, "C0", r.session_id, { intent: "end" }, "T02");
      check("C0 session 1 ended (session_end fired)", !!r.session_ended);

      r = await api(`${base}-C0`, "C0", null, {
        text: "con đm khó quá",
        intent: "question",
      }, "T02");
      check(
        "C0 #3 toxic text → SAFETY_BLOCK",
        r.actions[0] === "SAFETY_BLOCK",
        `→ got ${r.actions.join(",")}`
      );
      check("C0 #3 reason safety_block", r.reason === "safety_block", `→ got ${r.reason}`);
      r = await api(`${base}-C0`, "C0", r.session_id, { intent: "end" }, "T02");
      check("C0 session 2 ended", !!r.session_ended);

      // ---- C2 · curiosity-adaptive: open assign → explore → close ----
      line(`${stamp()} C2 → ${base}-C2 · topic T02 (groundable)`);
      r = await api(`${base}-C2`, "C2", null, {
        text: "Tại sao quả bóng lại nảy lên?",
        intent: "question",
      }, "T02");
      check(
        "C2 #1 ASSIGN_EXPLORE (opening)",
        r.actions[0] === "ASSIGN_EXPLORE",
        `→ got ${r.actions.join(",")}`
      );
      check(
        "C2 #1 reason opening_assign_explore",
        r.reason === "opening_assign_explore",
        `→ got ${r.reason}`
      );
      r = await api(`${base}-C2`, "C2", r.session_id, { intent: "explore_done" }, "T02");
      check(
        "C2 #2 explore_done → ANSWER_BRIEF+CONSOLIDATE+SEED_NEXT",
        r.actions.includes("ANSWER_BRIEF") &&
          r.actions.includes("CONSOLIDATE") &&
          r.actions.includes("SEED_NEXT"),
        `→ got ${r.actions.join(",")}`
      );
      check(
        "C2 #2 reason close_after_explore",
        r.reason === "close_after_explore",
        `→ got ${r.reason}`
      );
      check("C2 #2 seed_i_type_offered=true", r.seed_i_type_offered === true);
      r = await api(`${base}-C2`, "C2", r.session_id, { intent: "end" }, "T02");
      check("C2 session 1 ended", !!r.session_ended);

      // ---- C2 · escape path: assign → verify ×2 → force answer ----
      line(`${stamp()} C2 escape → ${base}-C2 · session 2`);
      r = await api(`${base}-C2`, "C2", null, {
        text: "Vì sao quả bóng nảy?",
        intent: "question",
      }, "T02");
      check(
        "C2-esc #1 ASSIGN_EXPLORE",
        r.actions[0] === "ASSIGN_EXPLORE",
        `→ got ${r.actions.join(",")}`
      );
      r = await api(`${base}-C2`, "C2", r.session_id, { intent: "request_answer_now" }, "T02");
      check(
        "C2-esc #2 REQUEST_VERIFY (scaffold<2 → chưa escape)",
        r.actions[0] === "REQUEST_VERIFY",
        `→ got ${r.actions.join(",")}`
      );
      r = await api(`${base}-C2`, "C2", r.session_id, { intent: "request_answer_now" }, "T02");
      check(
        "C2-esc #3 ANSWER_FULL (escape_request_answer)",
        r.actions[0] === "ANSWER_FULL" && r.reason === "escape_request_answer",
        `→ got ${r.actions.join(",")} ${r.reason}`
      );
      check("C2-esc #3 escape_used=true", r.state.escapeUsed === true);
      r = await api(`${base}-C2`, "C2", r.session_id, { intent: "end" }, "T02");
      check("C2 session 2 ended", !!r.session_ended);
    } catch (e) {
      line(`[ERROR] ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      line(`${stamp()} done — PASS=${pass} FAIL=${fail}`);
      if (fail === 0) {
        line("Toàn bộ assertions OK. Giờ chạy:");
        line(" 1) check_logging.sql trong SQL Editor (kỳ vọng L1–L14 = 0)");
        line(" 2) export_session_features → check_logging.py (kỳ vọng FAIL=0)");
        line(" 3) cleanup_test_data.sql để dọn participant test.");
      }
      setDryrunning(false);
      dryRef.current = false;
    }
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
    auto: "Auto dry-run (C0+C2)",
    autoLog: "Dry-run log",
    condition: "Condition",
    participant: "Participant",
    topic: "Topic",
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
    auto: "Auto dry-run (C0+C2)",
    autoLog: "Log dry-run",
    condition: "Điều kiện",
    participant: "Người tham gia",
    topic: "Topic",
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

      {(dryrunning || dryLog.length > 0) && (
        <div className="rounded-2xl border border-dashed border-[var(--console-border)] bg-[var(--console-card)] p-4">
          <h2 className="mb-2 text-sm font-semibold text-[var(--console-fg)]">
            {L.autoLog}
            {dryrunning && (
              <span className="ml-2 text-xs font-normal text-[var(--console-muted)]">
                …
              </span>
            )}
          </h2>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--console-fg)]">
            {dryLog.join("\n")}
          </pre>
        </div>
      )}

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
            disabled={running || !!sessionId}
            className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)]"
          >
            <option value="C0">C0 · Direct</option>
            <option value="C2">C2 · Curiosity-adaptive</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--console-muted)]">
          {L.topic}
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            disabled={running || !!sessionId}
            className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)]"
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} · {t.label}
                {t.groundable ? "" : " (không groundable)"}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--console-muted)]">
          {L.participant}
          <input
            value={participant}
            onChange={(e) => setParticipant(e.target.value.trim())}
            disabled={running || !!sessionId}
            className="min-h-10 w-28 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-medium text-[var(--console-fg)]"
          />
        </label>
        <button
          type="button"
          onClick={() => void startSession()}
          disabled={running || !token || !!sessionId}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--console-accent)] px-4 text-sm font-semibold text-[var(--console-accent-fg)] hover:opacity-90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            play_arrow
          </span>
          {L.start}
        </button>
        <button
          type="button"
          onClick={() => void runAutoDryRun()}
          disabled={running || !token}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-dashed border-[var(--console-accent)] bg-transparent px-4 text-sm font-medium text-[var(--console-accent)] hover:opacity-80 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            auto_awesome
          </span>
          {L.auto}
        </button>
        {sessionId && (
          <button
            type="button"
            onClick={() => void quickIntent("end")}
            disabled={running}
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
              {running && <p className="text-xs text-[var(--console-muted)]">…</p>}
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => quickIntent("dont_know")}
              disabled={running || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.dontKnow}
            </button>
            <button
              type="button"
              onClick={() => quickIntent("request_answer_now")}
              disabled={running || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.answerNow}
            </button>
            <button
              type="button"
              onClick={() => quickIntent("explore_done")}
              disabled={running || !sessionId}
              className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-1.5 text-xs font-medium text-[var(--console-fg)] hover:opacity-90 disabled:opacity-50"
            >
              {L.exploreDone}
            </button>
            <button
              type="button"
              onClick={() => quickIntent("explore_failed")}
              disabled={running || !sessionId}
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
              disabled={running || !sessionId || !token}
              className="min-h-10 flex-1 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm text-[var(--console-fg)] outline-none placeholder:text-[var(--console-muted)] focus:border-[var(--console-accent)]"
            />
            <button
              type="button"
              onClick={submitText}
              disabled={running || !sessionId || !input.trim()}
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
