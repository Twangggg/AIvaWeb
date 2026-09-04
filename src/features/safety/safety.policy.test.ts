import { describe, expect, it } from "vitest";

import {
  evaluateSafetyGateSync,
  isInTimeWindow,
} from "@/features/safety/safety.policy";
import { DEFAULT_SAFETY } from "@/features/safety/safety.storage";

describe("isInTimeWindow", () => {
  it("handles same-day window", () => {
    expect(isInTimeWindow(10 * 60, "09:00", "17:00")).toBe(true);
    expect(isInTimeWindow(8 * 60, "09:00", "17:00")).toBe(false);
    expect(isInTimeWindow(17 * 60, "09:00", "17:00")).toBe(false);
  });

  it("handles overnight bedtime window", () => {
    // 20:00–07:00
    expect(isInTimeWindow(21 * 60, "20:00", "07:00")).toBe(true);
    expect(isInTimeWindow(2 * 60, "20:00", "07:00")).toBe(true);
    expect(isInTimeWindow(12 * 60, "20:00", "07:00")).toBe(false);
    expect(isInTimeWindow(7 * 60, "20:00", "07:00")).toBe(false);
  });

  it("returns false when start equals end", () => {
    expect(isInTimeWindow(12 * 60, "12:00", "12:00")).toBe(false);
  });
});

describe("evaluateSafetyGateSync", () => {
  it("allows play with default settings at noon", () => {
    const noon = new Date("2026-09-04T12:00:00");
    expect(evaluateSafetyGateSync(DEFAULT_SAFETY, noon).allowed).toBe(true);
  });

  it("blocks during bedtime", () => {
    const night = new Date("2026-09-04T22:00:00");
    const result = evaluateSafetyGateSync(
      {
        ...DEFAULT_SAFETY,
        bedtime: true,
        bedtimeStart: "20:00",
        bedtimeEnd: "07:00",
      },
      night,
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("bedtime");
  });

  it("blocks school mode without classroom override", () => {
    const result = evaluateSafetyGateSync(
      { ...DEFAULT_SAFETY, schoolMode: true, classroomMode: false },
      new Date("2026-09-04T12:00:00"),
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("school");
  });

  it("allows school mode when classroom mode is on", () => {
    const result = evaluateSafetyGateSync(
      { ...DEFAULT_SAFETY, schoolMode: true, classroomMode: true },
      new Date("2026-09-04T12:00:00"),
    );
    expect(result.allowed).toBe(true);
  });

  it("blocks when daily limit reached", () => {
    const result = evaluateSafetyGateSync(
      {
        ...DEFAULT_SAFETY,
        dailyLimitMinutes: 30,
        usageMinutesToday: 30,
      },
      new Date("2026-09-04T12:00:00"),
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("dailyLimit");
  });
});
