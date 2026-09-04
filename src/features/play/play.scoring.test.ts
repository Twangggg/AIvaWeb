import { describe, expect, it } from "vitest";

import { starsForCorrect } from "./play.scoring";
import { DEFAULT_SCORE_RULES } from "./play.types";

describe("starsForCorrect", () => {
  it("gives 2 stars on first attempt within speed window", () => {
    expect(
      starsForCorrect({
        attempt: 1,
        elapsedMs: 3000,
        rules: DEFAULT_SCORE_RULES,
      }),
    ).toBe(2);
  });

  it("gives 1 star on first attempt after speed window", () => {
    expect(
      starsForCorrect({
        attempt: 1,
        elapsedMs: 5001,
        rules: DEFAULT_SCORE_RULES,
      }),
    ).toBe(1);
  });

  it("never gives speed bonus on second attempt", () => {
    expect(
      starsForCorrect({
        attempt: 2,
        elapsedMs: 100,
        rules: DEFAULT_SCORE_RULES,
      }),
    ).toBe(1);
  });

  it("respects speedBonus=false", () => {
    expect(
      starsForCorrect({
        attempt: 1,
        elapsedMs: 100,
        rules: { ...DEFAULT_SCORE_RULES, speedBonus: false },
      }),
    ).toBe(1);
  });
});
