import { AdminAuthError, assertAdminAccess } from "@/lib/admin/server";
import { invalidateAdminUsersCache, loadAdminUsers } from "@/lib/admin/users-data";

export async function GET(request: Request) {
  try {
    await assertAdminAccess(request.headers.get("authorization"));

    const url = new URL(request.url);
    const roleFilter = url.searchParams.get("role")?.trim().toLowerCase() || null;
    const bypassCache = url.searchParams.get("refresh") === "1";
    if (bypassCache) invalidateAdminUsersCache();

    const items = (await loadAdminUsers({ bypassCache })).filter((u) =>
      roleFilter ? u.role === roleFilter : true
    );

    return Response.json({ items, total: items.length });
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return Response.json({ message: e.message }, { status: e.status });
    }
    const message = e instanceof Error ? e.message : "Failed to load users";
    return Response.json({ message }, { status: 500 });
  }
}
