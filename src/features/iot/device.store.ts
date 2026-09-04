"use client";

import { create } from "zustand";

import type { DevicePlayState, DeviceStatusExt } from "./protocol";

type DeviceState = {
  botUrl: string;
  linked: boolean;
  online: boolean;
  playState: DevicePlayState;
  sessionId: string | null;
  name: string;
  lastSpoken: string;
  volume: number | null;
  lastError: string | null;
  lastEvent: string | null;
  setBotUrl: (url: string) => void;
  setLinked: (linked: boolean) => void;
  setOnline: (online: boolean) => void;
  applyStatus: (status: DeviceStatusExt & { name?: string }) => void;
  setLastError: (message: string | null) => void;
  setLastEvent: (event: string | null) => void;
  resetConnection: () => void;
};

export const useDeviceStore = create<DeviceState>((set) => ({
  botUrl: "",
  linked: false,
  online: false,
  playState: "idle",
  sessionId: null,
  name: "",
  lastSpoken: "",
  volume: null,
  lastError: null,
  lastEvent: null,

  setBotUrl: (botUrl) => set({ botUrl }),

  setLinked: (linked) =>
    set((s) => ({
      linked,
      online: linked ? s.online : false,
    })),

  setOnline: (online) => set({ online }),

  applyStatus: (status) =>
    set((s) => ({
      playState: status.play ?? s.playState,
      sessionId: status.session_id !== undefined ? status.session_id : s.sessionId,
      name: typeof status.name === "string" && status.name ? status.name : s.name,
      lastSpoken: typeof status.last_spoken === "string" ? status.last_spoken : s.lastSpoken,
      volume: typeof status.volume === "number" ? status.volume : s.volume,
      online: true,
    })),

  setLastError: (lastError) => set({ lastError }),
  setLastEvent: (lastEvent) => set({ lastEvent }),

  resetConnection: () =>
    set({
      linked: false,
      online: false,
      playState: "idle",
      sessionId: null,
      name: "",
      lastSpoken: "",
      volume: null,
      lastEvent: null,
    }),
}));
