"use client";

import { useEffect, useState } from "react";

import { DeviceBridge } from "@/features/iot/device.bridge";
import { useDeviceStore } from "@/features/iot/device.store";
import { ENV } from "@/lib/env";

export function DevicePanel() {
  const bridge = DeviceBridge.getShared();
  const botUrl = useDeviceStore((s) => s.botUrl);
  const linked = useDeviceStore((s) => s.linked);
  const online = useDeviceStore((s) => s.online);
  const playState = useDeviceStore((s) => s.playState);
  const sessionId = useDeviceStore((s) => s.sessionId);
  const name = useDeviceStore((s) => s.name);
  const lastSpoken = useDeviceStore((s) => s.lastSpoken);
  const volume = useDeviceStore((s) => s.volume);
  const lastError = useDeviceStore((s) => s.lastError);
  const lastEvent = useDeviceStore((s) => s.lastEvent);
  const setBotUrl = useDeviceStore((s) => s.setBotUrl);
  const setLastError = useDeviceStore((s) => s.setLastError);

  const [urlInput, setUrlInput] = useState("");
  const [speakText, setSpeakText] = useState("Xin chào các bạn, mình là AIva!");
  const [volumeInput, setVolumeInput] = useState(55);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void (async () => {
      await bridge.hydrate();
      const current = useDeviceStore.getState().botUrl || ENV.IOT_BOT_URL;
      setUrlInput(current);
      const v = useDeviceStore.getState().volume;
      if (typeof v === "number") setVolumeInput(v);
      setHydrated(true);
    })();
  }, [bridge]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setLastError(null);
    try {
      await fn();
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setBusy(false);
    }
  };

  const onLink = () =>
    run(async () => {
      await bridge.linkBot(urlInput);
    });

  const onUnlink = () => {
    bridge.unlinkBot();
    setUrlInput(ENV.IOT_BOT_URL);
    setBotUrl("");
  };

  if (!hydrated) {
    return <p className="text-sm text-[var(--console-muted)]">Đang tải cấu hình thiết bị…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <h2 className="text-lg font-semibold">Kết nối IoT bot</h2>
        <p className="mt-1 text-sm text-[var(--console-muted)]">
          Nhập URL bot trên cùng LAN (vd <code className="text-xs">http://192.168.x.x:8040</code>).
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="http://127.0.0.1:8040"
            className="min-h-11 flex-1 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 font-mono text-sm outline-none ring-brand-gold/40 focus:ring-2"
            disabled={linked || busy}
          />
          {linked ? (
            <button
              type="button"
              onClick={onUnlink}
              disabled={busy}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              Gỡ
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void onLink()}
              disabled={busy || !urlInput.trim()}
              className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Đang gắn…" : "Gắn"}
            </button>
          )}
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <StatusRow label="Trạng thái" value={linked ? (online ? "Online" : "Offline") : "Chưa gắn"} />
          <StatusRow label="Play" value={linked ? playState : "—"} />
          <StatusRow label="Tên" value={name || "—"} />
          <StatusRow label="Session" value={sessionId || "—"} />
          <StatusRow label="Volume" value={typeof volume === "number" ? String(volume) : "—"} />
          <StatusRow label="URL" value={botUrl || "—"} mono />
          <StatusRow label="Event gần nhất" value={lastEvent || "—"} />
        </dl>

        {lastError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {lastError}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <h2 className="text-lg font-semibold">Điều khiển nhanh</h2>
        <p className="mt-1 text-sm text-[var(--console-muted)]">
          Speak / Quiet / Find / Volume — kiểm tra lệnh trước khi vào Chơi.
        </p>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#3f3f46]">Câu nói</span>
          <textarea
            value={speakText}
            onChange={(e) => setSpeakText(e.target.value)}
            rows={3}
            disabled={!linked || busy}
            className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-2 text-base outline-none ring-brand-gold/40 focus:ring-2 disabled:opacity-50"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#3f3f46]">
            Âm lượng <span className="font-mono text-[var(--console-muted)]">{volumeInput}</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={volumeInput}
            disabled={!linked || busy}
            onChange={(e) => setVolumeInput(Number(e.target.value))}
            onMouseUp={() => void run(() => bridge.setVolume(volumeInput))}
            onTouchEnd={() => void run(() => bridge.setVolume(volumeInput))}
            className="w-full accent-[#1a1a1a] disabled:opacity-50"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!linked || busy || !speakText.trim()}
            onClick={() => void run(() => bridge.speak(speakText.trim()))}
            className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90 disabled:opacity-60"
          >
            Speak
          </button>
          <button
            type="button"
            disabled={!linked || busy}
            onClick={() => void run(() => bridge.quiet())}
            className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Quiet
          </button>
          <button
            type="button"
            disabled={!linked || busy}
            onClick={() => void run(() => bridge.find())}
            className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Find
          </button>
          <button
            type="button"
            disabled={!linked || busy}
            onClick={() => void run(() => bridge.setVolume(volumeInput))}
            className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Set volume
          </button>
          {linked && botUrl && (
            <a
              href={botUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold hover:opacity-90"
            >
              Mở dashboard bot
            </a>
          )}
        </div>

        {lastSpoken && (
          <p className="mt-4 text-sm text-[var(--console-muted)]">
            Last spoken: <span className="text-[var(--console-fg)]">{lastSpoken}</span>
          </p>
        )}
      </section>
    </div>
  );
}

function StatusRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-black/[0.03] px-3 py-2.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--console-muted)]">{label}</dt>
      <dd className={`mt-1 break-all text-sm ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
