import { beforeEach, describe, expect, it } from "vitest";
import {
  GLOBAL_VIEW_MODE_KEY,
  GARDEN_STORAGE_MODE_KEY,
  PLAY_STORAGE_MODE_KEY,
  getSavedGlobalViewMode,
  saveGlobalViewMode,
} from "./view-mode-preference";
import { usePlayModeStore } from "@/features/public-play/store/usePlayModeStore";
import { useGardenStore } from "@/features/landing-garden/store/useGardenStore";

beforeEach(() => {
  window.localStorage.clear();
});

describe("view-mode-preference", () => {
  it("defaults to scroll mode when no preference has been saved", () => {
    expect(getSavedGlobalViewMode()).toBe("scroll");
  });

  it("saves global scroll mode across all storage keys", () => {
    saveGlobalViewMode("scroll");
    expect(localStorage.getItem(GLOBAL_VIEW_MODE_KEY)).toBe("scroll");
    expect(localStorage.getItem(PLAY_STORAGE_MODE_KEY)).toBe("scroll");
    expect(localStorage.getItem(GARDEN_STORAGE_MODE_KEY)).toBe("scroll");
    expect(getSavedGlobalViewMode()).toBe("scroll");
  });

  it("saves global 3d mode across all storage keys", () => {
    saveGlobalViewMode("3d");
    expect(localStorage.getItem(GLOBAL_VIEW_MODE_KEY)).toBe("3d");
    expect(localStorage.getItem(PLAY_STORAGE_MODE_KEY)).toBe("3d");
    expect(localStorage.getItem(GARDEN_STORAGE_MODE_KEY)).toBe("garden");
    expect(getSavedGlobalViewMode()).toBe("3d");
  });

  it("reads legacy garden storage key when global key is absent", () => {
    localStorage.setItem(GARDEN_STORAGE_MODE_KEY, "garden");
    expect(getSavedGlobalViewMode()).toBe("3d");

    localStorage.setItem(GARDEN_STORAGE_MODE_KEY, "scroll");
    expect(getSavedGlobalViewMode()).toBe("scroll");
  });

  it("reads legacy play storage key when global key is absent", () => {
    localStorage.setItem(PLAY_STORAGE_MODE_KEY, "3d");
    expect(getSavedGlobalViewMode()).toBe("3d");

    localStorage.setItem(PLAY_STORAGE_MODE_KEY, "scroll");
    expect(getSavedGlobalViewMode()).toBe("scroll");
  });

  it("synchronizes usePlayModeStore to scroll mode on hydration without defaulting to 3d", () => {
    const playStore = usePlayModeStore.getState();
    expect(playStore.mode).toBe("scroll");

    saveGlobalViewMode("scroll");
    playStore.hydrateFromStorage();
    expect(usePlayModeStore.getState().mode).toBe("scroll");
  });

  it("synchronizes useGardenStore and usePlayModeStore when toggled", () => {
    const gardenStore = useGardenStore.getState();
    const playStore = usePlayModeStore.getState();

    gardenStore.setMode("scroll");
    expect(useGardenStore.getState().mode).toBe("scroll");

    playStore.hydrateFromStorage();
    expect(usePlayModeStore.getState().mode).toBe("scroll");
  });
});
