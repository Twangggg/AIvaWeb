import { AdminAuthError, assertAdminAccess, getSupabaseServiceClient } from "@/lib/admin/server";
import { invalidateAdminUsersCache, loadAdminUsers } from "@/lib/admin/users-data";

export async function GET(request: Request) {
  try {
    await assertAdminAccess(request.headers.get("authorization"));

    const url = new URL(request.url);
    const bypassCache = url.searchParams.get("refresh") === "1";
    if (bypassCache) invalidateAdminUsersCache();

    const supabase = getSupabaseServiceClient();
    const [preordersResult, users] = await Promise.all([
      supabase
        .from("preorders")
        .select("id, full_name, email, phone, note, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      loadAdminUsers({ bypassCache }),
    ]);

    if (preordersResult.error) {
      return Response.json({ message: preordersResult.error.message }, { status: 502 });
    }

    return Response.json({
      preorders: { items: preordersResult.data ?? [], total: preordersResult.data?.length ?? 0 },
      users: { items: users, total: users.length },
    });
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return Response.json({ message: e.message }, { status: e.status });
    }
    const message = e instanceof Error ? e.message : "Failed to load overview";
    return Response.json({ message }, { status: 500 });
  }
}
