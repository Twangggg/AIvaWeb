import { NextResponse } from "next/server";

import { getSupabaseServiceClient } from "@/lib/admin/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Recent device heartbeats from Supabase (for web merge by server_key). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxAgeSec = Math.min(600, Math.max(15, Number(searchParams.get("maxAgeSec") || 90)));
  const cutoff = new Date(Date.now() - maxAgeSec * 1000).toISOString();

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("devices")
      .select("server_key,lan_ip,http_port,ws_port,firmware_version,wifi_ssid,battery_level,mac_address,last_seen_at,is_connected")
      .neq("server_key", "")
      .neq("lan_ip", "")
      .gte("last_seen_at", cutoff)
      .order("last_seen_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message, devices: [] }, { status: 502 });
    }

    const devices = (data ?? []).map((row) => ({
      server_key: row.server_key,
      lan_ip: row.lan_ip,
      http_port: row.http_port ?? 8040,
      ws_port: row.ws_port ?? 8041,
      fw: row.firmware_version,
      wifi_ssid: row.wifi_ssid,
      battery: row.battery_level,
      mac: row.mac_address,
      seen_at: row.last_seen_at,
      cloud_synced: true,
    }));

    return NextResponse.json({ ok: true, devices });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "presence_failed";
    return NextResponse.json({ ok: false, error: msg, devices: [] }, { status: 500 });
  }
}
