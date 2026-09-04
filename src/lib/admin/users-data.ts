import type { User } from "@supabase/supabase-js";

import { getSupabaseServiceClient, roleFromUser } from "@/lib/admin/server";

export type AdminUserItem = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

const CACHE_TTL_MS = 20_000;

let cache: { expires: number; items: AdminUserItem[] } | null = null;

/** Drop cached admin user list (e.g. after explicit refresh). */
export function invalidateAdminUsersCache() {
  cache = null;
}

/**
 * Auth Admin listUsers is the slow hop — cache briefly and fetch profiles in parallel.
 */
export async function loadAdminUsers(options?: { bypassCache?: boolean }): Promise<AdminUserItem[]> {
  if (!options?.bypassCache && cache && cache.expires > Date.now()) {
    return cache.items;
  }

  const supabase = getSupabaseServiceClient();

  const [authResult, profilesResult] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 200 }),
    supabase.from("profiles").select("id,email,display_name,role"),
  ]);

  if (authResult.error) {
    throw new Error(authResult.error.message);
  }

  const profileById = new Map(
    (profilesResult.data ?? []).map((p) => [
      p.id as string,
      {
        email: p.email as string | null,
        displayName: p.display_name as string | null,
        role: p.role as string | null,
      },
    ])
  );

  const items = (authResult.data.users ?? []).map((user: User) => {
    const meta = user.user_metadata ?? {};
    const profile = profileById.get(user.id);
    const role =
      (profile?.role === "teacher" || profile?.role === "parent" || profile?.role === "admin"
        ? profile.role
        : undefined) ??
      roleFromUser(user) ??
      "teacher";
    const displayName =
      (profile?.displayName && profile.displayName) ||
      (typeof meta.display_name === "string" && meta.display_name) ||
      (typeof meta.displayName === "string" && meta.displayName) ||
      (typeof meta.full_name === "string" && meta.full_name) ||
      user.email?.split("@")[0] ||
      "User";

    return {
      id: user.id,
      email: profile?.email || user.email || "",
      displayName,
      role,
      emailConfirmed: Boolean(user.email_confirmed_at),
      createdAt: user.created_at,
      updatedAt: user.updated_at ?? null,
    };
  });

  cache = { expires: Date.now() + CACHE_TTL_MS, items };
  return items;
}
