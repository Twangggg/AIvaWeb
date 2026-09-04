import { AdminAuthError, assertAdminAccess, getSupabaseServiceClient, roleFromUser } from "@/lib/admin/server";

export async function GET(request: Request) {
  try {
    await assertAdminAccess(request.headers.get("authorization"));

    const url = new URL(request.url);
    const roleFilter = url.searchParams.get("role")?.trim().toLowerCase() || null;

    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

    if (error) {
      return Response.json({ message: error.message }, { status: 502 });
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,email,display_name,role");

    const profileById = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        {
          email: p.email as string | null,
          displayName: p.display_name as string | null,
          role: p.role as string | null,
        },
      ])
    );

    const items = (data.users ?? [])
      .map((user) => {
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
      })
      .filter((u) => (roleFilter ? u.role === roleFilter : true));

    return Response.json({ items, total: items.length });
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return Response.json({ message: e.message }, { status: e.status });
    }
    const message = e instanceof Error ? e.message : "Failed to load users";
    return Response.json({ message }, { status: 500 });
  }
}
