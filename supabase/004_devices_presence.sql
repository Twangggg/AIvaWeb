-- Device presence for one-click web connect (AIVA)
-- Run in Supabase SQL Editor after core schema.

alter table public.devices
  add column if not exists lan_ip text not null default '',
  add column if not exists http_port int not null default 8040,
  add column if not exists ws_port int not null default 8041;

create index if not exists devices_server_key_nonzero_idx
  on public.devices (server_key)
  where server_key <> '';

-- ESP / backend / mobile can call this without user JWT (server_key is the shared secret).
create or replace function public.device_heartbeat(
  p_server_key text,
  p_lan_ip text,
  p_http_port int default 8040,
  p_ws_port int default 8041,
  p_fw text default null,
  p_wifi_ssid text default null,
  p_battery int default null,
  p_mac text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text;
  v_user uuid;
begin
  if p_server_key is null or length(trim(p_server_key)) = 0 then
    return jsonb_build_object('ok', false, 'error', 'missing server_key');
  end if;

  update public.devices d
  set
    lan_ip = coalesce(nullif(trim(p_lan_ip), ''), d.lan_ip),
    http_port = coalesce(p_http_port, d.http_port),
    ws_port = coalesce(p_ws_port, d.ws_port),
    firmware_version = coalesce(nullif(trim(p_fw), ''), d.firmware_version),
    wifi_ssid = coalesce(nullif(trim(p_wifi_ssid), ''), d.wifi_ssid),
    battery_level = coalesce(p_battery, d.battery_level),
    mac_address = case
      when p_mac is not null and length(trim(p_mac)) > 0 then trim(p_mac)
      else d.mac_address
    end,
    is_connected = true,
    last_seen_at = now()
  where d.server_key = trim(p_server_key)
  returning d.id, d.name, d.user_id into v_id, v_name, v_user;

  if v_id is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'unknown_server_key',
      'hint', 'Pair device once (mobile) or claim on web with this secret'
    );
  end if;

  return jsonb_build_object(
    'ok', true,
    'device_id', v_id,
    'name', v_name,
    'user_id', v_user,
    'lan_ip', p_lan_ip,
    'http_port', coalesce(p_http_port, 8040)
  );
end;
$$;

revoke all on function public.device_heartbeat(text, text, int, int, text, text, int, text) from public;
grant execute on function public.device_heartbeat(text, text, int, int, text, text, int, text) to anon, authenticated, service_role;
