import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_SAFETY, saveSafetySettings } from "@/features/safety/safety.storage";
import { defaultPackFor } from "./play.packs";
import { loadRoundHistory } from "./play.storage";
import { usePlayStore } from "./play.store";
import { DEFAULT_TEAMS, SOLO_TEAM } from "./play.types";

vi.mock("@/features/iot/device.bridge", () => {
  const bridge = {
    ready: false,
    speak: vi.fn(async () => "id"),
    announce: vi.fn(async () => undefined),
    setTarget: vi.fn(async () => undefined),
    captureFor: vi.fn(async () => undefined),
    startSession: vi.fn(async () => undefined),
    endSession: vi.fn(async () => undefined),
    quiet: vi.fn(async () => undefined),
    find: vi.fn(async () => undefined),
    onEvent: vi.fn(() => () => undefined),
    getShared() {
      return bridge;
    },
  };
  return { DeviceBridge: { getShared: () => bridge } };
});

vi.mock("@/features/auth/auth.store", () => ({
  useAuthStore: {
    getState: () => ({
      tokens: { user: { role: "teacher", displayName: "Cô Test" } },
    }),
  },
}));

beforeEach(async () => {
  window.localStorage.clear();
  await saveSafetySettings({
    ...DEFAULT_SAFETY,
    bedtime: false,
    schoolMode: false,
    classroomMode: true,
    usageMinutesToday: 0,
  });

  usePlayStore.setState({
    running: false,
    finished: false,
    sessionId: "",
    scores: { [SOLO_TEAM.id]: 0 },
    jarStars: 0,
    pendingMatch: false,
    winnerId: null,
    lastMessage: "",
    phoneOnly: false,
  });

  // Avoid SpeechSynthesis noise in happy-dom
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: {
      cancel: vi.fn(),
      speak: vi.fn(),
    },
  });
});

describe("phone-only play smoke", () => {
  it("runs hunt solo and awards stars", async () => {
    const pack = defaultPackFor("hunt");
    await usePlayStore.getState().start({ mode: "solo", pack, phoneOnly: true });
    const live = usePlayStore.getState();
    expect(live.running).toBe(true);
    expect(live.phoneOnly).toBe(true);
    expect(live.pack.kind).toBe("hunt");

    // Force slow answer → 1 star
    usePlayStore.setState({ promptAt: Date.now() - 10_000 });
    await usePlayStore.getState().markCorrect(SOLO_TEAM.id);
    expect(usePlayStore.getState().scores[SOLO_TEAM.id]).toBe(1);
    expect(usePlayStore.getState().index).toBe(1);
  });

  it("runs cards and wrong→retry→advance", async () => {
    await usePlayStore.getState().start({
      mode: "solo",
      pack: defaultPackFor("cards"),
      phoneOnly: true,
    });
    await usePlayStore.getState().markWrong();
    expect(usePlayStore.getState().attempt).toBe(2);
    await usePlayStore.getState().markWrong();
    expect(usePlayStore.getState().index).toBe(1);
    expect(usePlayStore.getState().attempt).toBe(1);
  });

  it("runs quiz teams and pending match path via markCorrect", async () => {
    await usePlayStore.getState().start({
      mode: "teams",
      pack: defaultPackFor("quiz"),
      teams: DEFAULT_TEAMS,
      phoneOnly: true,
    });
    expect(usePlayStore.getState().teams).toHaveLength(2);
    usePlayStore.setState({ promptAt: Date.now() });
    await usePlayStore.getState().markCorrect("fox");
    expect(usePlayStore.getState().scores.fox).toBeGreaterThanOrEqual(1);
  });

  it("runs story choices to an end node", async () => {
    await usePlayStore.getState().start({
      mode: "solo",
      pack: defaultPackFor("story"),
      phoneOnly: true,
    });
    // start → home (end)
    await usePlayStore.getState().chooseStory("home");
    expect(usePlayStore.getState().finished).toBe(true);
    const history = await loadRoundHistory();
    expect(history.some((h) => h.kind === "story")).toBe(true);
  });

  it("blocks start when bedtime gate is active", async () => {
    await saveSafetySettings({
      ...DEFAULT_SAFETY,
      bedtime: true,
      bedtimeStart: "00:00",
      bedtimeEnd: "23:59",
    });
    await expect(
      usePlayStore.getState().start({
        mode: "solo",
        pack: defaultPackFor("hunt"),
        phoneOnly: true,
      }),
    ).rejects.toThrow(/giờ ngủ|Bedtime/i);
    expect(usePlayStore.getState().running).toBe(false);
  });
});
