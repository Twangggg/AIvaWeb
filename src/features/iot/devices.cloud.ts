import { ENV } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase/client";

export type CloudDevice = {
  id: string;
  name: string;
  macAddress: string;
  firmwareVersion: string;
  batteryLevel: number;
  wifiSsid: string;
  serverKey: string;
  isConnected: boolean;
  lastSeenAt: string;
  lanIp: string;
  httpPort: number;
  wsPort: number;
};

/** How web learned (or failed to learn) LAN presence. */
export type PresenceStatus =
  | { state: "ok"; count: number }
  | { state: "empty"; count: 0 }
  | { state: "unreachable"; detail: string }
  | { state: "error"; detail: string };

export type DeviceListResult = {
  devices: CloudDevice[];
  presence: PresenceStatus;
};

type DeviceRow = {
  id: string;
  name: string | null;
  mac_address: string | null;
  firmware_version: string | null;
  battery_level: number | null;
  wifi_ssid: string | null;
  server_key: string | null;
  is_connected: boolean | null;
  last_seen_at: string | null;
  lan_ip?: string | null;
  http_port?: number | null;
  ws_port?: number | null;
};

type PresenceRow = {
  server_key: string;
  lan_ip: string;
  http_port?: number;
  ws_port?: number;
  fw?: string | null;
  wifi_ssid?: string | null;
  seen_at: string;
};

const BASE_SELECT =
  "id,name,mac_address,firmware_version,battery_level,wifi_ssid,server_key,is_connected,last_seen_at";
const PRESENCE_SELECT = `${BASE_SELECT},lan_ip,http_port,ws_port`;

function mapRow(row: DeviceRow): CloudDevice {
  return {
    id: row.id,
    name: row.name || "AIVA",
    macAddress: row.mac_address || "",
    firmwareVersion: row.firmware_version || "",
    batteryLevel: row.battery_level ?? 0,
    wifiSsid: row.wifi_ssid || "",
    serverKey: row.server_key || "",
    isConnected: Boolean(row.is_connected),
    lastSeenAt: row.last_seen_at || "",
    lanIp: row.lan_ip || "",
    httpPort: row.http_port ?? 8040,
    wsPort: row.ws_port ?? 8041,
  };
}

/** Online if last heartbeat within 90s and we have a LAN IP. */
export function isDeviceOnline(d: CloudDevice, nowMs = Date.now()): boolean {
  if (!d.lastSeenAt || !d.lanIp) return false;
  const t = Date.parse(d.lastSeenAt);
  if (Number.isNaN(t)) return false;
  return nowMs - t < 90_000;
}

export function deviceLanUrl(d: CloudDevice): string | null {
  if (!d.lanIp) return null;
  return `http://${d.lanIp}:${d.httpPort || 8040}`;
}

async function fetchPresenceFrom(url: string): Promise<{
  map: Map<string, PresenceRow>;
  ok: boolean;
  statusCode?: number;
  error?: string;
}> {
  const map = new Map<string, PresenceRow>();
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { map, ok: false, statusCode: res.status };
    const body = (await res.json()) as { devices?: PresenceRow[] };
    for (const row of body.devices ?? []) {
      if (row?.server_key && row.lan_ip) map.set(row.server_key.trim(), row);
    }
    return { map, ok: true };
  } catch (e) {
    return { map, ok: false, error: e instanceof Error ? e.message : "fetch_failed" };
  }
}

/**
 * Prefer same-origin Next route (writes/reads Supabase), then optional AIva.Api.
 */
async function fetchApiPresence(): Promise<{
  map: Map<string, PresenceRow>;
  status: PresenceStatus;
}> {
  const map = new Map<string, PresenceRow>();
  const sources = [
    "/api/devices/presence?maxAgeSec=90",
    `${ENV.API_URL}/api/devices/presence?maxAgeSec=90`,
  ];

  let lastError = "";
  for (const url of sources) {
    const result = await fetchPresenceFrom(url);
    if (!result.ok) {
      lastError = result.error || `HTTP ${result.statusCode ?? "?"}`;
      continue;
    }
    for (const [k, v] of result.map) map.set(k, v);
    if (map.size > 0) {
      return { map, status: { state: "ok", count: map.size } };
    }
  }

  if (map.size === 0 && !lastError) {
    return { map, status: { state: "empty", count: 0 } };
  }
  if (lastError && map.size === 0) {
    // Supabase device rows may still have lan_ip — presence API is optional.
    return {
      map,
      status: {
        state: "empty",
        count: 0,
      },
    };
  }
  return { map, status: { state: "empty", count: 0 } };
}

function mergePresence(devices: CloudDevice[], presence: Map<string, PresenceRow>): CloudDevice[] {
  return devices.map((d) => {
    const p = d.serverKey ? presence.get(d.serverKey.trim()) : undefined;
    if (!p) return d;
    return {
      ...d,
      lanIp: p.lan_ip || d.lanIp,
      httpPort: p.http_port ?? d.httpPort,
      wsPort: p.ws_port ?? d.wsPort,
      lastSeenAt: p.seen_at || d.lastSeenAt,
      firmwareVersion: p.fw || d.firmwareVersion,
      wifiSsid: p.wifi_ssid || d.wifiSsid,
      isConnected: true,
    };
  });
}

export async function listMyDevices(): Promise<CloudDevice[]> {
  const { devices } = await listMyDevicesWithPresence();
  return devices;
}

export async function listMyDevicesWithPresence(): Promise<DeviceListResult> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const uid = userData.user?.id;
  if (!uid) throw new Error("Chưa đăng nhập");

  let rows: DeviceRow[] | null = null;
  const withPresence = await supabase
    .from("devices")
    .select(PRESENCE_SELECT)
    .eq("user_id", uid)
    .order("paired_at", { ascending: false });

  if (withPresence.error) {
    const base = await supabase
      .from("devices")
      .select(BASE_SELECT)
      .eq("user_id", uid)
      .order("paired_at", { ascending: false });
    if (base.error) throw base.error;
    rows = base.data as DeviceRow[] | null;
  } else {
    rows = withPresence.data as DeviceRow[] | null;
  }

  const devices = (rows ?? []).map(mapRow);
  const { map, status } = await fetchApiPresence();
  const merged = mergePresence(devices, map);

  // Presence status for UX: ok if any device looks live from Supabase alone.
  const liveFromDb = merged.filter((d) => isDeviceOnline(d)).length;
  if (liveFromDb > 0) {
    return { devices: merged, presence: { state: "ok", count: liveFromDb } };
  }
  return { devices: merged, presence: status };
}

/** Claim / register a device to the current user using the BLE secret (server_key). */
export async function claimDevice(payload: {
  name: string;
  serverKey: string;
  macAddress?: string;
}): Promise<CloudDevice> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const uid = userData.user?.id;
  if (!uid) throw new Error("Chưa đăng nhập");

  const serverKey = payload.serverKey.trim();
  const mac = (payload.macAddress || serverKey).trim();
  const name = payload.name.trim() || "AIVA";

  const { data: existing } = await supabase
    .from("devices")
    .select("id")
    .eq("user_id", uid)
    .eq("server_key", serverKey)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from("devices")
      .update({ name, mac_address: mac })
      .eq("id", existing.id)
      .select(BASE_SELECT)
      .single();
    if (error) throw error;
    const claimed = mapRow(data as DeviceRow);
    const { map } = await fetchApiPresence();
    return mergePresence([claimed], map)[0]!;
  }

  const { data, error } = await supabase
    .from("devices")
    .insert({
      user_id: uid,
      name,
      mac_address: mac,
      server_key: serverKey,
      is_connected: false,
    })
    .select(BASE_SELECT)
    .single();

  if (error) throw error;
  const claimed = mapRow(data as DeviceRow);
  const { map } = await fetchApiPresence();
  return mergePresence([claimed], map)[0]!;
}
