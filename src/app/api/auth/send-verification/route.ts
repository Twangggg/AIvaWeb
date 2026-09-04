import { Resend } from "resend";
import { z } from "zod";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const bodySchema = z.object({
  email: z.string().trim().email(),
  displayName: z.string().trim().min(1).max(128),
  token: z.string().trim().min(16).max(256),
});

const RATE = new Map<string, { count: number; resetAt: number }>();

function allowSend(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const row = RATE.get(key);
  if (!row || row.resetAt < now) {
    RATE.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (row.count >= 3) return false;
  row.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { email, displayName, token } = parsed.data;
    if (!allowSend(email)) {
      return Response.json({ error: "Too many verification emails. Try again later." }, { status: 429 });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
    const verifyUrl = `${siteUrl}/console/verify?token=${encodeURIComponent(token)}`;

    const resend = getResendClient();
    if (!resend) {
      console.warn("RESEND_API_KEY missing — verification email skipped", { email, verifyUrl });
      return Response.json({ success: true, skipped: true, verifyUrl });
    }

    const from = process.env.RESEND_FROM_EMAIL || "AIVA <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "Xác nhận email AIva Console",
      html: `
        <div style="font-family: 'Be Vietnam Pro', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0c0f10; color: #e1e3e4;">
          <div style="text-align: center; margin-bottom: 28px;">
            <img src="${siteUrl}/AIVALogo.png" alt="AIVA" style="height: 36px;" />
          </div>
          <h1 style="font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 12px;">Xin chào ${escapeHtml(displayName)},</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #c6c6cb; margin: 0 0 24px;">
            Cảm ơn bạn đã đăng ký AIva Console. Nhấn nút bên dưới để xác nhận email — liên kết có hiệu lực trong 24 giờ.
          </p>
          <p style="text-align: center; margin: 0 0 28px;">
            <a href="${verifyUrl}"
               style="display: inline-block; background: #eab308; color: #1a1400; text-decoration: none; font-weight: 700; padding: 14px 28px; border-radius: 12px;">
              Xác nhận email
            </a>
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #9ca3af; margin: 0 0 8px;">
            Nếu nút không hoạt động, mở liên kết này:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #fde68a; margin: 0 0 28px;">${verifyUrl}</p>
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            Nếu bạn không tạo tài khoản, hãy bỏ qua email này.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("verification email failed", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("send-verification error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
