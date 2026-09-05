import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getSupabaseServiceClient } from "@/lib/admin/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HeartbeatBody = {
  server_key?: string;
  lan_ip?: string;
  http_port?: number;
  ws_port?: number;
  fw?: string;
  wifi_ssid?: string;
  battery?: number;
  mac?: string;
};

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function getHeartbeatClient(): SupabaseClient {
  try {
    return getSupabaseServiceClient();
  } catch {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Missing Supabase env for device heartbeat");
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
}

/**
 * ESP (or companion app) posts presence here.
 * Writes lan_ip via Supabase RPC so AIvaWeb can show Online without a separate AIva.Api process.
 */
export async function POST(request: Request) {
  let body: HeartbeatBody;
  try {
    body = (await request.json()) as HeartbeatBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400, headers: corsHeaders() });
  }

  const serverKey = (body.server_key || "").trim();
  const lanIp = (body.lan_ip || "").trim();
  if (!serverKey) {
    return NextResponse.json({ ok: false, error: "server_key required" }, { status: 400, headers: corsHeaders() });
  }
  if (!lanIp) {
    return NextResponse.json({ ok: false, error: "lan_ip required" }, { status: 400, headers: corsHeaders() });
  }

  try {
    const supabase = getHeartbeatClient();
    const { data, error } = await supabase.rpc("device_heartbeat", {
      p_server_key: serverKey,
      p_lan_ip: lanIp,
      p_http_port: body.http_port ?? 8040,
      p_ws_port: body.ws_port ?? 8041,
      p_fw: body.fw ?? null,
      p_wifi_ssid: body.wifi_ssid ?? null,
      p_battery: body.battery ?? null,
      p_mac: body.mac ?? null,
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          hint: "Apply supabase/004_devices_presence.sql if RPC is missing",
        },
        { status: 502, headers: corsHeaders() },
      );
    }

    const result = (data ?? {}) as { ok?: boolean; error?: string };
    if (result.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          cloud_ok: false,
          ...result,
          hint: result.error === "unknown_server_key" ? "Pair in app or claim on web first" : undefined,
        },
        { status: 404, headers: corsHeaders() },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        cloud_ok: true,
        server_key: serverKey,
        lan_ip: lanIp,
        http_port: body.http_port ?? 8040,
        ws_port: body.ws_port ?? 8041,
        seen_at: new Date().toISOString(),
        cloud: data,
      },
      { headers: corsHeaders() },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "heartbeat_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
