import type { PreorderInput } from "@/features/preorder/schema/preorder-schema";
import { getSupabaseClient } from "@/lib/supabase/client";

interface PreorderResponse {
  success: boolean;
  message: string;
}

export async function submitPreorder(payload: PreorderInput): Promise<PreorderResponse> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("preorders").insert({
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    note: payload.note ?? null
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message: "Pre-order submitted"
  };
}
