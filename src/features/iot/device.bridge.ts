"use client";

import { clearIotBotUrl, loadIotBotUrl, saveIotBotUrl } from "./iot.storage";
import { useDeviceStore } from "./device.store";
import type {
  ChildDeviceProfile,
  DeviceCommand,
  DeviceEvent,
  DeviceHealth,
  DeviceStatusExt,
} from "./protocol";
import { newCmdId } from "./protocol";

type EventCb = (event: DeviceEvent) => void;

let instance: DeviceBridge | null = null;

export class DeviceBridge {
  static getShared(): DeviceBridge {
    if (!instance) instance = new DeviceBridge();
    return instance;
  }

  private botUrl = "";
  private wsUrlOverride = "";
  private ws: WebSocket | null = null;
  private poll: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<EventCb>();
  private lastEvtId = "";

  get url(): string {
    return this.botUrl;
  }

  get linked(): boolean {
    return useDeviceStore.getState().linked;
  }

  /** Linked IoT bot (web has no BLE). */
  get ready(): boolean {
    return useDeviceStore.getState().linked;
  }

  onEvent(cb: EventCb): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit(event: DeviceEvent): void {
    useDeviceStore.getState().setLastEvent(event.event);
    this.listeners.forEach((cb) => cb(event));
  }

  async hydrate(): Promise<void> {
    const saved = loadIotBotUrl();
    const fallback = saved || (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_IOT_BOT_URL || "" : "");
    const url = (fallback || "").replace(/\/$/, "");
    if (url) useDeviceStore.getState().setBotUrl(url);
    this.botUrl = url;
    if (!url) return;
    try {
      await this.linkBot(url);
    } catch {
      useDeviceStore.getState().setLinked(false);
      useDeviceStore.getState().setOnline(false);
    }
  }

  async linkBot(url: string): Promise<void> {
    const base = url.trim().replace(/\/$/, "");
    if (!base) throw new Error("URL bot trống");

    const res = await fetch(`${base}/health`);
    if (!res.ok) throw new Error(`Health thất bại (${res.status})`);
    const body = (await res.json()) as DeviceHealth;
    if (!body.ok) throw new Error("Bot trả về ok=false");

    this.botUrl = base;
    saveIotBotUrl(base);
    useDeviceStore.getState().setBotUrl(base);
    useDeviceStore.getState().setLinked(true);
    useDeviceStore.getState().setOnline(true);
    useDeviceStore.getState().setLastError(null);
    this.wsUrlOverride = typeof body.ws === "string" ? body.ws : "";
    if (body.name) {
      useDeviceStore.getState().applyStatus({ name: body.name, play: body.play, session_id: body.session_id });
    } else {
      useDeviceStore.getState().applyStatus({ play: body.play, session_id: body.session_id });
    }

    this.openWs();
    this.startPoll();
  }

  unlinkBot(): void {
    this.closeWs();
    if (this.poll) {
      clearInterval(this.poll);
      this.poll = null;
    }
    clearIotBotUrl();
    this.botUrl = "";
    this.wsUrlOverride = "";
    useDeviceStore.getState().resetConnection();
    useDeviceStore.getState().setBotUrl("");
  }

  private openWs(): void {
    this.closeWs();
    if (!this.botUrl || typeof window === "undefined") return;
    const wsUrl =
      this.wsUrlOverride ||
      `${this.botUrl.replace(/^http/, "ws")}/ws`;
    try {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(String(ev.data)) as DeviceEvent & {
            type?: string;
            status?: DeviceStatusExt;
          };
          if (msg.status) this.applyStatus(msg.status);
          if (msg.type === "event" && msg.event) {
            this.lastEvtId = msg.id;
            this.emit(msg);
          }
        } catch {
          // ignore malformed frames
        }
      };
      ws.onopen = () => {
        useDeviceStore.getState().setOnline(true);
      };
      ws.onclose = () => {
        if (this.ws === ws) this.ws = null;
      };
      ws.onerror = () => {
        // status poll will reflect offline
      };
    } catch {
      this.ws = null;
    }
  }

  private closeWs(): void {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
  }

  private startPoll(): void {
    if (this.poll) clearInterval(this.poll);
    this.poll = setInterval(() => {
      void this.refreshStatus();
    }, 2500);
    void this.refreshStatus();
  }

  async refreshStatus(): Promise<void> {
    if (!this.botUrl || !this.linked) return;
    try {
      const res = await fetch(`${this.botUrl}/status`);
      if (!res.ok) {
        useDeviceStore.getState().setOnline(false);
        return;
      }
      const status = (await res.json()) as DeviceStatusExt;
      this.applyStatus(status);
      if (status.evt && status.evt_id && status.evt_id !== this.lastEvtId) {
        this.lastEvtId = status.evt_id;
        this.emit({
          type: "event",
          event: status.evt,
          id: status.evt_id,
          session_id: status.session_id,
          payload: status.evt_payload,
        });
      }
    } catch {
      useDeviceStore.getState().setOnline(false);
    }
  }

  private applyStatus(status: DeviceStatusExt): void {
    useDeviceStore.getState().applyStatus(status);
  }

  async send(command: DeviceCommand | string): Promise<void> {
    if (!this.linked || !this.botUrl) {
      throw new Error("Chưa gắn bot");
    }
    const res = await fetch(`${this.botUrl}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof command === "string" ? JSON.stringify(command) : JSON.stringify(command),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `Lệnh thất bại (${res.status})`);
    }
  }

  async speak(text: string): Promise<string> {
    const id = newCmdId();
    const trimmed = text.trim();
    if (!trimmed) throw new Error("Câu nói trống");

    // PC synthesizes TTS then pushes WAV to ESP (works when Wi‑Fi blocks ESP→PC).
    try {
      const ttsRes = await fetch("/api/devices/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server_key: "AIVA-2024", text: trimmed }),
      });
      if (ttsRes.ok) {
        const wav = await ttsRes.arrayBuffer();
        if (wav.byteLength >= 44 && this.botUrl) {
          const fd = new FormData();
          fd.append("id", id);
          fd.append("text", trimmed);
          fd.append("audio", new Blob([wav], { type: "audio/wav" }), "speak.wav");
          const playRes = await fetch(`${this.botUrl}/play_wav`, { method: "POST", body: fd });
          if (playRes.ok) {
            useDeviceStore.getState().applyStatus({ last_spoken: trimmed, play: "speaking" });
            return id;
          }
        }
      }
    } catch {
      // fall through to on-device speak
    }

    await this.send({ cmd: "speak", id, text: trimmed, interrupt: true });
    return id;
  }

  async announce(text: string): Promise<void> {
    await this.speak(text);
  }

  async quiet(): Promise<void> {
    await this.send("quiet");
  }

  async find(): Promise<void> {
    await this.send("find");
  }

  async setVolume(volume: number): Promise<void> {
    await this.send({ cmd: "set_volume", id: newCmdId(), volume });
  }

  async setTarget(labels: string[], prompt?: string): Promise<void> {
    await this.send({ cmd: "set_target", id: newCmdId(), labels, prompt });
  }

  async captureFor(kind: "hunt" | "cards", labels: string[]): Promise<void> {
    await this.send({
      cmd: "capture",
      id: newCmdId(),
      expect_labels: labels,
      activity_kind: kind,
    });
  }

  async startSession(sessionId: string, profile: ChildDeviceProfile): Promise<void> {
    await this.send({
      cmd: "start_session",
      id: newCmdId(),
      session_id: sessionId,
      profile,
    });
  }

  async endSession(): Promise<void> {
    await this.send({ cmd: "end_session", id: newCmdId() });
  }

  async heartbeat(): Promise<void> {
    await this.send({ cmd: "heartbeat", id: newCmdId() });
  }
}
