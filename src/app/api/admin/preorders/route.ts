import { AdminAuthError, assertAdminAccess, getSupabaseServiceClient } from "@/lib/admin/server";

export async function GET(request: Request) {
  try {
    await assertAdminAccess(request.headers.get("authorization"));
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("preorders")
      .select("id, full_name, email, phone, note, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return Response.json({ message: error.message }, { status: 502 });
    }

    return Response.json({ items: data ?? [], total: data?.length ?? 0 });
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return Response.json({ message: e.message }, { status: e.status });
    }
    const message = e instanceof Error ? e.message : "Failed to load preorders";
    return Response.json({ message }, { status: 500 });
  }
}
