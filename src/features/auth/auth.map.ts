import type { Session, User } from "@supabase/supabase-js";

import type { Tokens, UserInfo, UserRole } from "./auth.types";
import { loadUserRole } from "./role.storage";

function normalizeRole(value: unknown): UserRole | undefined {
  if (value === "teacher" || value === "parent" || value === "admin") return value;
  return undefined;
}

export function mapSupabaseUser(user: User | null | undefined): UserInfo | undefined {
  if (!user) return undefined;

  const meta = user.user_metadata ?? {};
  const role =
    normalizeRole(meta.role) ??
    normalizeRole(meta.user_role) ??
    loadUserRole(user.id);

  const displayName =
    (typeof meta.display_name === "string" && meta.display_name) ||
    (typeof meta.displayName === "string" && meta.displayName) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    user.email?.split("@")[0] ||
    "User";

  return {
    id: user.id,
    email: user.email ?? "",
    displayName,
    role,
    emailConfirmed: Boolean(user.email_confirmed_at),
  };
}

export function mapSessionToTokens(session: Session | null): Tokens | null {
  if (!session?.access_token || !session.refresh_token) return null;
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: mapSupabaseUser(session.user),
  };
}

/** Enrich role/displayName from public.profiles when the table exists. Never throws. */
export async function enrichTokensFromProfile(tokens: Tokens | null): Promise<Tokens | null> {
  if (!tokens?.user?.id) return tokens;
  try {
    const { getSupabaseClient } = await import("@/lib/supabase/client");
    const { data, error } = await getSupabaseClient()
      .from("profiles")
      .select("display_name,role")
      .eq("id", tokens.user.id)
      .maybeSingle();
    if (error || !data) return tokens;
    const role = tokens.user.role ?? normalizeRole(data.role);
    return {
      ...tokens,
      user: {
        ...tokens.user,
        displayName: (typeof data.display_name === "string" && data.display_name) || tokens.user.displayName,
        role,
      },
    };
  } catch {
    return tokens;
  }
}
