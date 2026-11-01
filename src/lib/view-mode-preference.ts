export const GLOBAL_VIEW_MODE_KEY = "aiva_global_view_mode";
export const GARDEN_STORAGE_MODE_KEY = "aiva_home_view_mode_v2";
export const PLAY_STORAGE_MODE_KEY = "aiva_play_mode_v1";
export const VIEW_MODE_CHANGE_EVENT = "aiva-view-mode-change";

export type ViewMode = "scroll" | "3d";

/**
 * Reads the user's unified view preference across pages.
 * Defaults to "scroll" mode.
 */
export function getSavedGlobalViewMode(): ViewMode {
  if (typeof window === "undefined") return "scroll";
  try {
    const globalMode = localStorage.getItem(GLOBAL_VIEW_MODE_KEY);
    if (globalMode === "3d" || globalMode === "scroll") return globalMode;

    const playMode = localStorage.getItem(PLAY_STORAGE_MODE_KEY);
    if (playMode === "3d" || playMode === "scroll") return playMode;

    const gardenMode = localStorage.getItem(GARDEN_STORAGE_MODE_KEY);
    if (gardenMode === "garden") return "3d";
    if (gardenMode === "scroll") return "scroll";
  } catch {}
  return "scroll";
}

/**
 * Saves view preference and keeps both home garden and play lobby in sync.
 */
export function saveGlobalViewMode(mode: ViewMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GLOBAL_VIEW_MODE_KEY, mode);
    localStorage.setItem(PLAY_STORAGE_MODE_KEY, mode);
    localStorage.setItem(GARDEN_STORAGE_MODE_KEY, mode === "3d" ? "garden" : "scroll");
    window.dispatchEvent(
      new CustomEvent(VIEW_MODE_CHANGE_EVENT, { detail: mode })
    );
  } catch {}
}
