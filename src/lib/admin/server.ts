import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import type { UserRole } from "@/features/auth/auth.types";

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  serviceClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

function getSupabaseAnonClient(): SupabaseClient {
  if (anonClient) return anonClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  anonClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonClient;
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

/**
 * Verify JWT locally via getClaims (JWKS-cached on reused client), then one profiles role check.
 * Falls back to Auth getUser if claims verification fails (e.g. legacy HS256 without JWKS).
 */
export async function assertAdminAccess(authHeader: string | null): Promise<User> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AdminAuthError("Missing bearer token", 401);
  }

  const jwt = authHeader.slice("Bearer ".length).trim();
  if (!jwt) {
    throw new AdminAuthError("Missing bearer token", 401);
  }

  const anon = getSupabaseAnonClient();
  let user: User | null = null;

  const claimsResult = await anon.auth.getClaims(jwt);
  if (claimsResult.data?.claims?.sub) {
    const claims = claimsResult.data.claims;
    const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
    user = {
      id: claims.sub,
      aud: typeof claims.aud === "string" ? claims.aud : "authenticated",
      role: typeof claims.role === "string" ? claims.role : "authenticated",
      email: typeof claims.email === "string" ? claims.email : undefined,
      app_metadata: (claims.app_metadata ?? {}) as User["app_metadata"],
      user_metadata: meta,
      created_at: "",
    } as User;
  } else {
    const { data, error } = await anon.auth.getUser(jwt);
    if (error || !data.user) {
      throw new AdminAuthError("Invalid session", 401);
    }
    user = data.user;
  }

  const role = await resolveUserRole(user, authHeader);
  if (role !== "admin") {
    throw new AdminAuthError("Admin access required", 403);
  }

  return user;
}

export class AdminAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
