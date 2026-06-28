import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }
  return createClient(url, key);
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }
  return new Resend(key);
}

const CONTENT: Record<string, { subject: string; heading: string; message: string; notice: string; follow: string }> = {
  vi: {
    subject: "Xác nhận đăng ký pre-order AIVA",
    heading: "Cảm ơn bạn, {{name}}!",
    message:
      "Chúng tôi đã nhận được thông tin đăng ký pre-order của bạn dành cho <strong>AIVA</strong> – chiếc kính thông minh giúp trẻ học từ thế giới thật.",
    notice: "Chúng tôi sẽ gửi thông báo qua email này khi có hàng.",
    follow: "Theo dõi AIVA trên Facebook để cập nhật tin tức mới nhất:"
  },
  en: {
    subject: "AIVA Pre-order Confirmation",
    heading: "Thank you, {{name}}!",
    message:
      "We have received your pre-order registration for <strong>AIVA</strong> – the smart glasses that help children learn from the real world.",
    notice: "We will send a notification to this email when stock is available.",
    follow: "Follow AIVA on Facebook for the latest updates:"
  }
};

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, note, locale = "vi" } = await request.json();

    if (!fullName || !email || !phone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("preorders").insert({
      full_name: fullName,
      email,
      phone,
      note: note ?? null
    });

    if (dbError) {
      return Response.json({ error: dbError.message }, { status: 500 });
    }

    const content = CONTENT[locale] ?? CONTENT.vi;

    await getResend().emails.send({
      from: "AIVA <onboarding@resend.dev>",
      to: email,
      subject: content.subject,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://aiva.id.vn/AIVALogo.png" alt="AIVA" style="height: 40px;" />
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
            ${content.heading.replace("{{name}}", fullName)}
          </h1>
          <p style="font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
            ${content.message}
          </p>
          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">
              ${content.notice}
            </p>
          </div>
          <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 8px;">
            ${content.follow}
          </p>
          <a href="https://www.facebook.com/AIVAGlass/" style="color: #2f86ff; font-size: 14px;">
            facebook.com/AIVAGlass
          </a>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            AIVA — AI, Vision &amp; Assistant
          </p>
        </div>
      `
    }).catch(() => {});

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
