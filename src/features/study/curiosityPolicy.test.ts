import { describe, expect, it } from "vitest";

import {
  createSessionState,
  guessDepth,
  policyStep,
} from "./curiosityPolicy";

describe("guessDepth", () => {
  it("classifies deep questions", () => {
    expect(guessDepth("Tại sao trời mưa?")).toBe("deep");
    expect(guessDepth("Vì sao cây lớn lên?")).toBe("deep");
    expect(guessDepth("Nếu con thả quả bóng thì sao?")).toBe("deep");
  });

  it("classifies shallow fact questions", () => {
    expect(guessDepth("Đây là gì?")).toBe("shallow");
    expect(guessDepth("Trên trời có bao nhiêu ngôi sao?")).toBe("shallow");
  });

  it("returns unknown otherwise", () => {
    expect(guessDepth("Xin chào")).toBe("unknown");
  });
});

describe("C2 policy test cases (09-policy-v1.md)", () => {
  it("first ask 'Đây là gì?' on groundable topic -> ASSIGN_EXPLORE", () => {
    const state = createSessionState("C2");
    const decision = policyStep(state, { text: "Đây là gì?", intent: "question", worldGroundable: true });
    expect(decision.actions).toEqual(["ASSIGN_EXPLORE"]);
    expect(decision.state.exploreStatus).toBe("assigned");
  });

  it("after verify done -> ANSWER_BRIEF + CONSOLIDATE + SEED_NEXT", () => {
    let state = createSessionState("C2");
    state = policyStep(state, {
      text: "Cái này là gì?",
      intent: "question",
      worldGroundable: true,
    }).state;
    const decision = policyStep(state, {
      text: "",
      intent: "explore_done",
      worldGroundable: true,
    });
    expect(decision.actions).toEqual(["ANSWER_BRIEF", "CONSOLIDATE", "SEED_NEXT"]);
    expect(decision.consolidationDone).toBe(true);
    expect(decision.seedIOffered).toBe(true);
    expect(decision.log.map((l) => l.event_type)).toContain("explore_completed");
  });

  it("child asks escape after 2 scaffolds -> ANSWER_FULL + CONSOLIDATE + escape_used", () => {
    let state = createSessionState("C2");
    state = policyStep(state, { text: "Cái này là gì?", intent: "question", worldGroundable: true }).state;
    state = policyStep(state, { text: "", intent: "request_answer_now", worldGroundable: true }).state;
    const decision = policyStep(state, { text: "", intent: "request_answer_now", worldGroundable: true });
    expect(decision.actions).toEqual(["ANSWER_FULL", "CONSOLIDATE"]);
    expect(decision.state.escapeUsed).toBe(true);
    expect(decision.log.map((l) => l.event_type)).toContain("escape_used");
  });

  it("child says 'Con không biết' hard -> ANSWER_FULL + CONSOLIDATE (Goldilocks escape)", () => {
    const state = createSessionState("C2");
    const decision = policyStep(state, {
      text: "Con không biết",
      intent: "dont_know",
      worldGroundable: true,
    });
    expect(decision.actions).toEqual(["ANSWER_FULL", "CONSOLIDATE"]);
    expect(decision.state.escapeUsed).toBe(true);
    expect(decision.state.frustrated).toBe(false);
  });

  it("safety toxic -> SAFETY_BLOCK", () => {
    const state = createSessionState("C2");
    const decision = policyStep(state, { text: "địt user", intent: "question", worldGroundable: true });
    expect(decision.actions).toEqual(["SAFETY_BLOCK"]);
    expect(decision.log.map((l) => l.event_type)).toContain("safety_block");
  });

  it("deep 'Tại sao…?' mid-chain -> not an essay dump (ASK_BACK or BRIEF)", () => {
    let state = createSessionState("C2");
    state = policyStep(state, { text: "Em muốn chơi", intent: "question", worldGroundable: false }).state;
    const deepDecision = policyStep(state, {
      text: "Tại sao bầu trời có màu xanh?",
      intent: "question",
      worldGroundable: true,
    });
    expect(deepDecision.actions.includes("ASK_BACK") || deepDecision.actions.includes("ANSWER_BRIEF")).toBe(true);
  });
});

describe("C0 policy", () => {
  it("always ANSWER_FULL, never ASSIGN_EXPLORE", () => {
    const state = createSessionState("C0");
    const decision = policyStep(state, { text: "Cái này là gì?", intent: "question", worldGroundable: true });
    expect(decision.actions).toEqual(["ANSWER_FULL"]);
    expect(decision.state.exploreStatus).toBe("none");
  });
});

describe("chain depth", () => {
  it("increments on deep follow-ups and resets after an answer closes the run", () => {
    let state = createSessionState("C2");
    state = policyStep(state, { text: "Em chơi", intent: "question", worldGroundable: false }).state;
    state = policyStep(state, { text: "Tại sao lá xanh?", intent: "question", worldGroundable: false }).state;
    expect(state.chainDepth).toBeGreaterThanOrEqual(1);
    state = policyStep(state, { text: "", intent: "request_answer_now", worldGroundable: false }).state;
    expect(state.chainDepth).toBe(0);
  });
});