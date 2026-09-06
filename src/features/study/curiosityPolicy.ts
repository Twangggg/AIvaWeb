export type Condition = "C0" | "C1" | "C2";

export type QuestionDepthGuess = "shallow" | "deep" | "unknown";

export type ExploreStatus =
  | "none"
  | "assigned"
  | "started"
  | "done"
  | "failed"
  | "skipped";

export type PolicyAction =
  | "SAFETY_BLOCK"
  | "ASK_BACK"
  | "ASSIGN_EXPLORE"
  | "REQUEST_VERIFY"
  | "ANSWER_BRIEF"
  | "ANSWER_FULL"
  | "HINT"
  | "CONSOLIDATE"
  | "SEED_NEXT";

export type SessionState = {
  condition: Condition;
  turnCount: number;
  chainDepth: number;
  shallowStreak: number;
  depthGuess: QuestionDepthGuess;
  exploreStatus: ExploreStatus;
  scaffoldsSinceAnswer: number;
  escapeUsed: boolean;
  oneShotUnansweredReached: boolean;
  curiositySeededSinceLastAnswer: boolean;
  frustrated: boolean;
  oracleRisk: number;
  lastAction?: string;
};

export const POLICY_VERSION = "v1.0";

export type PolicyIntent =
  | "question"
  | "dont_know"
  | "request_answer_now"
  | "explore_done"
  | "explore_failed";

export type PolicyInput = {
  text: string;
  intent: PolicyIntent;
  worldGroundable: boolean;
};

export type PolicyLogEvent = {
  event_type: string;
  actor?: "child" | "ai" | "system";
  utterance_text?: string | null;
  explore_task_id?: string | null;
  verify_method?: string | null;
  meta?: Record<string, unknown>;
};

export type PolicyDecision = {
  state: SessionState;
  actions: PolicyAction[];
  reason: string;
  log: PolicyLogEvent[];
  consolidationDone: boolean;
  seedIOffered: boolean;
};

const DEEP_RE = /tại sao|vì sao|như thế nào|khác gì|nếu /i;
const SHALLOW_RE = /là gì|bao nhiêu|ở đâu|khi nào/i;
const TOXIC_RE = /địt|đm|cc |ặc|cặp đôi|t.tục/i;

export function guessDepth(text: string): QuestionDepthGuess {
  const clean = text.trim();
  if (!clean) return "unknown";
  if (DEEP_RE.test(clean)) return "deep";
  if (SHALLOW_RE.test(clean)) return "shallow";
  return "unknown";
}

export function computeOracleRisk(
  state: Pick<SessionState, "shallowStreak" | "escapeUsed">
): number {
  const risk =
    0.4 * (Math.min(state.shallowStreak, 3) / 3) +
    0.2 * (state.escapeUsed ? 1 : 0);
  return Math.max(0, Math.min(1, risk));
}

export function createSessionState(condition: Condition): SessionState {
  return {
    condition,
    turnCount: 0,
    chainDepth: 0,
    shallowStreak: 0,
    depthGuess: "unknown",
    exploreStatus: "none",
    scaffoldsSinceAnswer: 0,
    escapeUsed: false,
    oneShotUnansweredReached: false,
    curiositySeededSinceLastAnswer: false,
    frustrated: false,
    oracleRisk: 0,
  };
}

export function isSafetyBlocked(text: string): boolean {
  return TOXIC_RE.test(text.trim());
}

const SCAFFOLD_ACTIONS: PolicyAction[] = [
  "ASK_BACK",
  "HINT",
  "ASSIGN_EXPLORE",
  "REQUEST_VERIFY",
];

function postDecide(
  state: SessionState,
  actions: PolicyAction[]
): SessionState {
  let next: SessionState = { ...state };
  const answered =
    actions.includes("ANSWER_FULL") || actions.includes("ANSWER_BRIEF");
  if (answered) {
    next = {
      ...next,
      scaffoldsSinceAnswer: 0,
      chainDepth: 0,
      oneShotUnansweredReached: false,
      frustrated: false,
      curiositySeededSinceLastAnswer: actions.includes("SEED_NEXT"),
    };
  } else if (actions.includes("SEED_NEXT")) {
    next = { ...next, curiositySeededSinceLastAnswer: true };
  }
  if (actions.some((a) => SCAFFOLD_ACTIONS.includes(a))) {
    next = { ...next, scaffoldsSinceAnswer: next.scaffoldsSinceAnswer + 1 };
  }
  if (actions.includes("ASSIGN_EXPLORE"))
    next = { ...next, exploreStatus: "assigned" };
  next.lastAction = actions[0] ?? undefined;
  next.oracleRisk = computeOracleRisk(next);
  return next;
}

function decideC0(): {
  actions: PolicyAction[];
  reason: string;
  escape?: boolean;
} {
  return { actions: ["ANSWER_FULL"], reason: "c0_always_answer" };
}

function decideC2(
  state: SessionState,
  userRequestsAnswerNow: boolean,
  worldGroundable: boolean
): { actions: PolicyAction[]; reason: string; escape?: boolean } {
  if (state.frustrated) {
    return {
      actions: ["ANSWER_FULL", "CONSOLIDATE"],
      reason: "goldilocks_escape_frustrated",
      escape: true,
    };
  }
  if (state.exploreStatus === "failed") {
    return {
      actions: ["ANSWER_FULL", "CONSOLIDATE"],
      reason: "escape_after_failed_explore",
      escape: true,
    };
  }
  if (state.exploreStatus === "assigned" || state.exploreStatus === "started") {
    if (userRequestsAnswerNow && state.scaffoldsSinceAnswer >= 2) {
      return {
        actions: ["ANSWER_FULL", "CONSOLIDATE"],
        reason: "escape_request_answer",
        escape: true,
      };
    }
    return { actions: ["REQUEST_VERIFY"], reason: "awaiting_verify" };
  }
  if (state.exploreStatus === "done") {
    return {
      actions: ["ANSWER_BRIEF", "CONSOLIDATE", "SEED_NEXT"],
      reason: "close_after_explore",
    };
  }
  if (state.turnCount <= 1 && state.depthGuess !== "deep") {
    if (worldGroundable) {
      return { actions: ["ASSIGN_EXPLORE"], reason: "opening_assign_explore" };
    }
    return { actions: ["ASK_BACK"], reason: "opening_ask_back" };
  }
  if (state.scaffoldsSinceAnswer >= 2) {
    return { actions: ["ANSWER_FULL", "CONSOLIDATE"], reason: "soft_unlock" };
  }
  if (state.oracleRisk >= 0.6) {
    return { actions: ["HINT"], reason: "high_oracle_risk_hint" };
  }
  if (state.chainDepth >= 3 && state.depthGuess === "deep") {
    return {
      actions: ["ANSWER_BRIEF", "CONSOLIDATE", "SEED_NEXT"],
      reason: "deep_chain_brief",
    };
  }
  return { actions: ["ASK_BACK"], reason: "default_ask_back" };
}

export function policyStep(
  previous: SessionState,
  input: PolicyInput
): PolicyDecision {
  const log: PolicyLogEvent[] = [];
  let state: SessionState = { ...previous };

  if (input.intent === "question" && isSafetyBlocked(input.text)) {
    const blocked = { ...state, turnCount: state.turnCount + 1 };
    blocked.lastAction = "SAFETY_BLOCK";
    blocked.oracleRisk = computeOracleRisk(blocked);
    return {
      state: blocked,
      actions: ["SAFETY_BLOCK"],
      reason: "safety_block",
      log: [{ event_type: "safety_block", actor: "system" }],
      consolidationDone: false,
      seedIOffered: false,
    };
  }

  state = { ...state, turnCount: state.turnCount + 1 };

  if (input.text.trim()) {
    const guess = guessDepth(input.text);
    state = {
      ...state,
      depthGuess: guess,
      shallowStreak: guess === "shallow" ? state.shallowStreak + 1 : 0,
    };
  }

  if (
    input.intent === "question" &&
    input.text.trim() &&
    state.depthGuess === "deep"
  ) {
    state = { ...state, chainDepth: state.chainDepth + 1 };
  }

  if (input.intent === "question" && input.text.trim()) {
    log.push({
      event_type: "child_utterance",
      actor: "child",
      utterance_text: input.text,
    });
  }

  if (input.intent === "dont_know") {
    state = { ...state, frustrated: true, oneShotUnansweredReached: true };
  }

  const userRequestsAnswerNow = input.intent === "request_answer_now";

  if (input.intent === "question" && input.text.trim()) {
    const mid = ["assigned", "started"] as ExploreStatus[];
    if (mid.includes(state.exploreStatus)) {
      log.push({
        event_type: "verify_submitted",
        actor: "child",
        utterance_text: input.text,
        verify_method: "self_report",
      });
      state = { ...state, exploreStatus: "done" };
    }
  }

  if (input.intent === "explore_done") {
    if (
      state.exploreStatus === "assigned" ||
      state.exploreStatus === "started"
    ) {
      log.push({
        event_type: "explore_completed",
        actor: "child",
        verify_method: "parent_confirm",
      });
      state = { ...state, exploreStatus: "done" };
    }
  }

  if (input.intent === "explore_failed") {
    if (
      state.exploreStatus === "assigned" ||
      state.exploreStatus === "started"
    ) {
      log.push({ event_type: "explore_failed", actor: "child" });
      state = { ...state, exploreStatus: "failed" };
    }
  }

  const decision =
    state.condition === "C0"
      ? decideC0()
      : decideC2(state, userRequestsAnswerNow, input.worldGroundable);

  if (decision.escape) {
    state = { ...state, escapeUsed: true };
    log.push({ event_type: "escape_used", actor: "system" });
  }

  if (decision.actions.includes("ASSIGN_EXPLORE")) {
    log.push({
      event_type: "explore_assigned",
      actor: "ai",
      explore_task_id: `explore-${state.turnCount}`,
    });
  }

  state = postDecide(state, decision.actions);

  const consolidationDone = decision.actions.includes("CONSOLIDATE");
  const seedIOffered = decision.actions.includes("SEED_NEXT");

  log.push({
    event_type: "policy_decision",
    actor: "system",
    meta: {
      policy_version: POLICY_VERSION,
      policy_action: decision.actions[0] ?? null,
      policy_reason: decision.reason,
      state_snapshot: { ...state, chain_depth: state.chainDepth },
      consolidation_done: consolidationDone,
      seed_i_type_offered: seedIOffered,
    },
  });

  return {
    state,
    actions: decision.actions,
    reason: decision.reason,
    log,
    consolidationDone,
    seedIOffered,
  };
}
