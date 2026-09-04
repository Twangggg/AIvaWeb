import { beforeEach, describe, expect, it } from "vitest";

import {
  addJarStars,
  allPacks,
  deleteCustomPack,
  loadCustomPacks,
  loadJar,
  loadRoundHistory,
  appendRoundHistory,
  upsertCustomPack,
} from "./play.storage";
import type { PlayPack } from "./play.types";

beforeEach(() => {
  window.localStorage.clear();
});

describe("play.storage packs", () => {
  it("starts with builtin packs only", async () => {
    const packs = await allPacks();
    expect(packs.length).toBeGreaterThanOrEqual(4);
    expect(await loadCustomPacks()).toEqual([]);
  });

  it("upserts and deletes a custom pack", async () => {
    const custom: PlayPack = {
      id: "hunt-custom",
      kind: "hunt",
      title: "Pack test",
      items: [
        {
          id: "1",
          label: "bút",
          prompt: "Tìm bút.",
          hint: "viết",
          aliases: [],
        },
      ],
    };
    await upsertCustomPack(custom);
    expect((await loadCustomPacks()).map((p) => p.id)).toContain("hunt-custom");
    expect((await allPacks()).find((p) => p.id === "hunt-custom")?.title).toBe("Pack test");

    await deleteCustomPack("hunt-custom");
    expect(await loadCustomPacks()).toEqual([]);
  });
});

describe("play.storage jar + history", () => {
  it("adds jar stars for today", async () => {
    const jar = await addJarStars(2);
    expect(jar.stars).toBe(2);
    expect((await loadJar()).stars).toBe(2);
    expect((await addJarStars(1)).stars).toBe(3);
  });

  it("appends round history capped at 50", async () => {
    for (let i = 0; i < 3; i++) {
      await appendRoundHistory({
        id: `r-${i}`,
        at: new Date().toISOString(),
        kind: "quiz",
        packId: "quiz-starter",
        packTitle: "Quiz",
        mode: "solo",
        scores: { solo: i },
        winnerId: null,
        jarStars: i,
      });
    }
    const rows = await loadRoundHistory();
    expect(rows).toHaveLength(3);
    expect(rows[0]?.id).toBe("r-2");
  });
});
