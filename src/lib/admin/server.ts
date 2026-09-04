import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import type { UserRole } from "@/features/auth/auth.types";

export function getSupabaseServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getSupabaseAnonClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Anon client that forwards the caller's JWT (for RLS-scoped profile reads). */
function getSupabaseUserClient(authHeader: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authHeader } },
  });
}

function normalizeRole(value: unknown): UserRole | undefined {
  if (value === "teacher" || value === "parent" || value === "admin") return value;
  return undefined;
}

export function roleFromUser(user: User): UserRole | undefined {
  const meta = user.user_metadata ?? {};
  return normalizeRole(meta.role) ?? normalizeRole(meta.user_role);
}

/** Prefer public.profiles.role; fall back to auth user_metadata. */
export async function resolveUserRole(
  user: User,
  authHeader?: string | null
): Promise<UserRole | undefined> {
  // Service role (admin routes) — bypass RLS, authoritative.
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = getSupabaseServiceClient();
      const { data } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
      const fromProfile = normalizeRole(data?.role);
      if (fromProfile) return fromProfile;
    }
  } catch {
    // missing/invalid service key — fall through
  }

  // Caller's JWT — can read own profile via RLS.
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const sb = getSupabaseUserClient(authHeader);
      const { data } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
      const fromProfile = normalizeRole(data?.role);
      if (fromProfile) return fromProfile;
    } catch {
      // ignore
    }
  }

  return roleFromUser(user);
}

export async function assertAdminAccess(authHeader: string | null): Promise<User> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AdminAuthError("Missing bearer token", 401);
  }

  const jwt = authHeader.slice("Bearer ".length).trim();
  if (!jwt) {
    throw new AdminAuthError("Missing bearer token", 401);
  }

  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data.user) {
    throw new AdminAuthError("Invalid session", 401);
  }

  const role = await resolveUserRole(data.user, authHeader);
  if (role !== "admin") {
    throw new AdminAuthError("Admin access required", 403);
  }

  return data.user;
}

export class AdminAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
