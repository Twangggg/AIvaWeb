"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DeviceBridge } from "@/features/iot/device.bridge";
import {
  claimDevice,
  deviceLanUrl,
  isDeviceOnline,
  listMyDevicesWithPresence,
  type CloudDevice,
  type PresenceStatus,
} from "@/features/iot/devices.cloud";
import { useDeviceStore } from "@/features/iot/device.store";
import { ENV } from "@/lib/env";

const IS_DEV = process.env.NODE_ENV === "development";

type ConnectHint =
  | { kind: "ready" }
  | { kind: "waiting"; title: string; detail: string }
  | { kind: "offline"; title: string; detail: string }
  | { kind: "linked" };

function deviceConnectHint(d: CloudDevice, live: boolean, active: boolean): ConnectHint {
  if (active) return { kind: "linked" };
  if (live && deviceLanUrl(d)) return { kind: "ready" };
  if (!d.lanIp) {
    return {
      kind: "waiting",
      title: "Đang chờ máy sẵn sàng",
      detail:
        "Mở app AIva trên điện thoại, chắc chắn máy đã kết nối Wi‑Fi nhà, rồi quay lại đây và bấm Làm mới. Không cần nhập địa chỉ mạng.",
    };
  }
  return {
    kind: "offline",
    title: "Máy đang tắt hoặc khác mạng",
    detail:
      "Bật máy AIva và để điện thoại/máy tính cùng Wi‑Fi nhà với máy. Sau đó bấm Làm mới.",
  };
}

function friendlyLinkError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("failed to fetch") || m.includes("networkerror") || m.includes("load failed")) {
    return "Không tới được máy trên Wi‑Fi. Kiểm tra cùng mạng với máy tính, hoặc cấu hình lại Wi‑Fi bằng app AIva.";
  }
  if (m.includes("health")) {
    return "Máy không phản hồi health. Thử Làm mới; nếu vẫn lỗi, cấu hình lại Wi‑Fi bằng app.";
  }
  return raw;
}

export function DevicePanel() {
  const bridge = DeviceBridge.getShared();
  const botUrl = useDeviceStore((s) => s.botUrl);
  const linked = useDeviceStore((s) => s.linked);
  const online = useDeviceStore((s) => s.online);
  const playState = useDeviceStore((s) => s.playState);
  const sessionId = useDeviceStore((s) => s.sessionId);
  const name = useDeviceStore((s) => s.name);
  const lastSpoken = useDeviceStore((s) => s.lastSpoken);
  const lastError = useDeviceStore((s) => s.lastError);
  const lastEvent = useDeviceStore((s) => s.lastEvent);
  const setBotUrl = useDeviceStore((s) => s.setBotUrl);
  const setLastError = useDeviceStore((s) => s.setLastError);

  const [urlInput, setUrlInput] = useState("");
  const [speakText, setSpeakText] = useState("Xin chào các bạn, mình là AIva!");
  const [volumeInput, setVolumeInput] = useState(55);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [devices, setDevices] = useState<CloudDevice[]>([]);
  const [presence, setPresence] = useState<PresenceStatus | null>(null);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [claimName, setClaimName] = useState("AIVA-01");
  const [claimKey, setClaimKey] = useState("AIVA-2024");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const refreshDevices = useCallback(async () => {
    setDevicesLoading(true);
    try {
      const { devices: rows, presence: p } = await listMyDevicesWithPresence();
      setDevices(rows);
      setPresence(p);
      setLastError(null);
      // Lab only: surface manual URL when presence backend is down.
      if (IS_DEV && rows.some((d) => !d.lanIp) && (p.state === "unreachable" || p.state === "empty")) {
        setShowAdvanced(true);
      }
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Không tải được danh sách thiết bị");
    } finally {
      setDevicesLoading(false);
    }
  }, [setLastError]);

  useEffect(() => {
    void (async () => {
      await bridge.hydrate();
      const current = useDeviceStore.getState().botUrl || "";
      setUrlInput(current);
      const v = useDeviceStore.getState().volume;
      if (typeof v === "number") setVolumeInput(v);
      setHydrated(true);
      await refreshDevices();
    })();
  }, [bridge, refreshDevices]);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      void refreshDevices();
    }, 15_000);
    return () => clearInterval(t);
  }, [refreshDevices]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setLastError(null);
    try {
      await fn();
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Lỗi không xác định";
      setLastError(friendlyLinkError(raw));
    } finally {
      setBusy(false);
    }
  };

  const onConnectDevice = (d: CloudDevice) =>
    run(async () => {
      const url = deviceLanUrl(d);
      if (!url) {
        throw new Error("Máy chưa sẵn sàng trên web. Mở app AIva kiểm tra Wi‑Fi, đợi rồi bấm Làm mới.");
      }
      await bridge.linkBot(url);
      setUrlInput(url);
      setBotUrl(url);
    });

  const onClaim = () =>
    run(async () => {
      await claimDevice({ name: claimName, serverKey: claimKey });
      await refreshDevices();
      setShowClaim(false);
    });

  const onLink = () =>
    run(async () => {
      await bridge.linkBot(urlInput);
    });

  const onUnlink = () => {
    bridge.unlinkBot();
    setUrlInput("");
    setBotUrl("");
  };

  const liveCount = useMemo(
    () => devices.filter((d) => isDeviceOnline(d, now)).length,
    [devices, now],
  );
  const needsWifiSetup = devices.some((d) => !isDeviceOnline(d, now));
  const emptyDevices = devices.length === 0;
  const autoLinkedRef = useRef<string>("");

  // Complete path: when exactly one device is online, attach automatically.
  useEffect(() => {
    if (!hydrated || linked || busy) return;
    const live = devices.filter((d) => isDeviceOnline(d, now) && deviceLanUrl(d));
    if (live.length !== 1) return;
    const url = deviceLanUrl(live[0]!);
    if (!url || autoLinkedRef.current === url) return;
    autoLinkedRef.current = url;
    void (async () => {
      setBusy(true);
      setLastError(null);
      try {
        await bridge.linkBot(url);
        setUrlInput(url);
        setBotUrl(url);
      } catch (e) {
        autoLinkedRef.current = "";
        const raw = e instanceof Error ? e.message : "Lỗi không xác định";
        setLastError(friendlyLinkError(raw));
      } finally {
        setBusy(false);
      }
    })();
  }, [hydrated, linked, busy, devices, now, bridge, setBotUrl, setLastError]);

  if (!hydrated) {
    return <p className="text-sm text-[var(--console-muted)]">Đang tải cấu hình thiết bị…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Thiết bị của tôi</h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--console-muted)]">
              Máy mới: dùng app AIva để chọn Wi‑Fi nhà. Sau đó trên web chỉ cần đợi Online và bấm Kết
              nối — không phải nhập địa chỉ mạng.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refreshDevices()}
            disabled={devicesLoading || busy}
            className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {devicesLoading ? "Đang tải…" : "Làm mới"}
          </button>
        </div>

        <ol className="mt-4 grid gap-2 sm:grid-cols-3">
          <StepCard
            n={1}
            title="Mở app AIva"
            body="Gần máy, bật Bluetooth, chọn Wi‑Fi nhà. App lo phần còn lại."
          />
          <StepCard
            n={2}
            title="Đợi máy online"
            body="Bật máy AIva. Khi trạng thái chuyển Online, có thể kết nối."
          />
          <StepCard
            n={3}
            title="Bấm Kết nối"
            body="Điều khiển speak / quiet / find ngay trên web."
          />
        </ol>

        {IS_DEV && presence && (presence.state === "unreachable" || presence.state === "error") && (
          <aside
            className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            <p className="font-semibold">[Dev] Presence API chưa chạy</p>
            <p className="mt-1 leading-relaxed opacity-90">
              {"detail" in presence ? presence.detail : null} Người dùng cuối không thấy khối này —
              production phải có API + app tự ghi app_url khi pair.
            </p>
          </aside>
        )}

        {(emptyDevices || needsWifiSetup) && (
          <WifiSetupBanner
            empty={emptyDevices}
            hasOffline={needsWifiSetup && !emptyDevices}
            noneLive={liveCount === 0 && !emptyDevices}
            presence={presence}
          />
        )}

        <ul className="mt-5 flex flex-col gap-3">
          {emptyDevices && (
            <li className="rounded-xl border border-dashed border-[var(--console-border)] px-4 py-4 text-sm text-[var(--console-muted)]">
              Chưa có thiết bị. Dùng app để gắn máy với tài khoản, hoặc nhập mã trên hộp ở mục{" "}
              <button type="button" className="font-semibold underline" onClick={() => setShowClaim(true)}>
                Nhận thiết bị
              </button>{" "}
              bên dưới.
            </li>
          )}
          {devices.map((d) => {
            const live = isDeviceOnline(d, now);
            const url = deviceLanUrl(d);
            const active = linked && botUrl === url;
            const hint = deviceConnectHint(d, live, active);
            return (
              <li
                key={d.id}
                className="flex flex-col gap-3 rounded-xl border border-[var(--console-border)] bg-[var(--console-chip)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--console-fg)]">{d.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--console-muted)]">
                      {live ? (
                        <span className="font-semibold text-emerald-700">Online · sẵn sàng</span>
                      ) : hint.kind === "waiting" ? (
                        <span className="font-semibold text-amber-800">Đang chờ sẵn sàng</span>
                      ) : (
                        <span className="font-semibold text-amber-800">Offline</span>
                      )}
                      {IS_DEV && (d.lanIp ? ` · ${d.lanIp}:${d.httpPort}` : " · chưa có IP")}
                      {d.wifiSsid ? ` · ${d.wifiSsid}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {active ? (
                      <button
                        type="button"
                        onClick={onUnlink}
                        disabled={busy}
                        className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-card)] px-4 text-sm font-semibold disabled:opacity-60"
                      >
                        Ngắt kết nối
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy || hint.kind !== "ready"}
                        onClick={() => void onConnectDevice(d)}
                        className="min-h-10 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90 disabled:opacity-60"
                        title={hint.kind === "ready" ? "Kết nối" : hint.title}
                      >
                        {busy ? "Đang nối…" : "Kết nối"}
                      </button>
                    )}
                  </div>
                </div>
                {(hint.kind === "waiting" || hint.kind === "offline") && (
                  <div
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950"
                    role="status"
                  >
                    <p className="font-semibold">{hint.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed opacity-90">{hint.detail}</p>
                    <AppDownloadLinks className="mt-2" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <button
            type="button"
            className="text-sm font-semibold text-[var(--console-muted)] underline"
            onClick={() => setShowClaim((v) => !v)}
          >
            {showClaim ? "Ẩn nhận thiết bị" : "Nhận thiết bị vào tài khoản"}
          </button>
          {showClaim && (
            <div className="mt-3 rounded-xl border border-dashed border-[var(--console-border)] p-4">
              <h3 className="text-sm font-semibold">Nhận thiết bị</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--console-muted)]">
                Nhập mã in trên hộp máy (thường đã có sẵn khi mua). Việc này gắn máy với tài khoản của
                bạn.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  placeholder="Tên hiển thị"
                  className="min-h-10 flex-1 rounded-lg border border-[var(--console-border)] bg-[var(--console-card)] px-3 text-sm outline-none"
                />
                <input
                  value={claimKey}
                  onChange={(e) => setClaimKey(e.target.value)}
                  placeholder="Mã bí mật"
                  className="min-h-10 flex-1 rounded-lg border border-[var(--console-border)] bg-[var(--console-card)] px-3 font-mono text-sm outline-none"
                />
                <button
                  type="button"
                  disabled={busy || !claimKey.trim()}
                  onClick={() => void onClaim()}
                  className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-card)] px-4 text-sm font-semibold disabled:opacity-60"
                >
                  Nhận máy
                </button>
              </div>
            </div>
          )}
        </div>

        {linked && (
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatusRow label="Phiên gắn" value={online ? "Online" : "Offline"} />
            <StatusRow label="Play" value={playState} />
            <StatusRow label="Tên" value={name || "—"} />
            <StatusRow label="Session" value={sessionId || "—"} />
            <StatusRow label="URL Wi‑Fi" value={botUrl || "—"} mono />
            <StatusRow label="Event" value={lastEvent || "—"} />
          </dl>
        )}

        {lastError && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">
            <p>{lastError}</p>
            <AppDownloadLinks className="mt-2" tone="danger" />
          </div>
        )}

        {IS_DEV && (
          <>
            <button
              type="button"
              className="mt-4 text-xs font-semibold text-[var(--console-muted)] underline"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "Ẩn công cụ lab" : "Dành cho kỹ thuật viên / lab"}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-2 rounded-xl border border-dashed border-[var(--console-border)] p-3">
                <p className="text-xs leading-relaxed text-[var(--console-muted)]">
                  Chỉ dùng khi đang phát triển. Người dùng cuối không cần bước này — app sẽ cấu hình
                  backend khi pair.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="http://192.168.x.x:8040"
                    className="min-h-11 flex-1 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 font-mono text-sm outline-none"
                    disabled={linked || busy}
                  />
                  {linked ? (
                    <button
                      type="button"
                      onClick={onUnlink}
                      className="min-h-11 rounded-lg border border-[var(--console-border)] px-4 text-sm font-semibold"
                    >
                      Gỡ
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void onLink()}
                      disabled={busy || !urlInput.trim()}
                      className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] disabled:opacity-60"
                    >
                      Gắn URL
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <h2 className="text-lg font-semibold">Điều khiển nhanh</h2>
        <p className="mt-1 text-sm text-[var(--console-muted)]">
          {linked
            ? "Speak / Quiet / Find / Volume qua Wi‑Fi"
            : "Cần Kết nối Wi‑Fi ở trên trước khi điều khiển."}
        </p>

        {!linked && (
          <p className="mt-3 rounded-lg bg-black/[0.03] px-3 py-2 text-sm text-[var(--console-muted)]">
            Chưa gắn phiên Wi‑Fi — các nút bên dưới tạm khóa.
          </p>
        )}

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium">Câu nói</span>
          <textarea
            value={speakText}
            onChange={(e) => setSpeakText(e.target.value)}
            rows={3}
            disabled={!linked || busy}
            className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-2 text-base outline-none disabled:opacity-50"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium">
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
            className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] disabled:opacity-60"
          >
            Speak
          </button>
          <button
            type="button"
            disabled={!linked || busy}
            onClick={() => void run(() => bridge.quiet())}
            className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold disabled:opacity-60"
          >
            Quiet
          </button>
          <button
            type="button"
            disabled={!linked || busy}
            onClick={() => void run(() => bridge.find())}
            className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-4 text-sm font-semibold disabled:opacity-60"
          >
            Find
          </button>
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

function StepCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="rounded-xl bg-black/[0.03] px-3.5 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--console-muted)]">Bước {n}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--console-fg)]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--console-muted)]">{body}</p>
    </li>
  );
}

function WifiSetupBanner({
  empty,
  hasOffline,
  noneLive,
  presence,
}: {
  empty: boolean;
  hasOffline: boolean;
  noneLive: boolean;
  presence: PresenceStatus | null;
}) {
  let title = "Cần app AIva cho lần đầu";
  let body =
    "Trình duyệt không cấu hình Wi‑Fi cho máy mới. Dùng app trên điện thoại một lần, sau đó web tự nhận máy khi online.";

  if (empty) {
    title = "Chưa có thiết bị trên tài khoản";
    body =
      "Mở app AIva → gắn máy (Bluetooth + Wi‑Fi nhà) → quay lại trang này. Hoặc nhập mã trên hộp ở mục Nhận thiết bị.";
  } else if (noneLive) {
    title = "Đang chờ máy online";
    body =
      "Máy có thể đã có Wi‑Fi trên app. Hãy để máy bật, đợi vài phút, rồi bấm Làm mới. Bạn không cần nhập IP hay cấu hình mạng trên web.";
  } else if (hasOffline) {
    title = "Một số máy chưa sẵn sàng";
    body = "Bật máy và mở app để kiểm tra Wi‑Fi. Khi Online, bấm Kết nối.";
  }

  return (
    <aside
      className="mt-5 rounded-xl border border-[var(--console-border)] bg-[var(--console-chip)] p-4"
      role="note"
    >
      <p className="text-sm font-semibold text-[var(--console-fg)]">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--console-muted)]">{body}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-[var(--console-muted)]">
        <li>Điện thoại gần máy, mở app AIva</li>
        <li>Chọn Wi‑Fi nhà trong app (chỉ lần đầu hoặc khi đổi mạng)</li>
        <li>Quay lại web → Làm mới → Kết nối khi thấy Online</li>
      </ul>
      {IS_DEV && presence?.state === "empty" && (
        <p className="mt-2 text-xs text-[var(--console-muted)]">
          [Dev] API chạy nhưng chưa có heartbeat — kiểm tra app tự ghi{" "}
          <code className="text-[11px]">server.app_url</code> khi pair.
        </p>
      )}
      <AppDownloadLinks className="mt-3" />
    </aside>
  );
}

function AppDownloadLinks({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "danger";
}) {
  const links = [
    { href: ENV.MOBILE_APP_IOS_URL, label: "App Store" },
    { href: ENV.MOBILE_APP_ANDROID_URL, label: "Google Play" },
    { href: ENV.MOBILE_APP_URL, label: "Tải app AIva" },
  ].filter((l) => Boolean(l.href));

  if (links.length === 0) {
    return (
      <p className={`text-xs ${tone === "danger" ? "text-red-700" : "text-[var(--console-muted)]"} ${className}`}>
        Ứng dụng AIva (iOS / Android) dùng để cấu hình Wi‑Fi qua Bluetooth — hỏi nhà cung cấp link tải
        nếu chưa có trên cửa hàng.
      </p>
    );
  }

  const linkClass =
    tone === "danger"
      ? "font-semibold text-red-800 underline"
      : "font-semibold text-[var(--console-fg)] underline";

  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${className}`}>
      {links.map((l) => (
        <a key={l.href + l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {l.label}
        </a>
      ))}
    </p>
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
