import type { PreorderInput } from "@/features/preorder/schema/preorder-schema";

interface PreorderResponse {
  success: boolean;
  message: string;
}

export async function submitPreorder(payload: PreorderInput, locale: string = "vi"): Promise<PreorderResponse> {
  const res = await fetch("/api/preorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      note: payload.note ?? null,
      locale
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to submit pre-order");
  }

  return {
    success: true,
    message: "Pre-order submitted"
  };
}
