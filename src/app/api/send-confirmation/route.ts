import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    if (!email || !fullName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "AIVA <onboarding@resend.dev>",
      to: email,
      subject: "Xác nhận đăng ký pre-order AIVA",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://aiva.id.vn/AIVALogo.png" alt="AIVA" style="height: 40px;" />
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
            Cảm ơn bạn, ${fullName}!
          </h1>
          <p style="font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
            Chúng tôi đã nhận được thông tin đăng ký pre-order của bạn dành cho <strong>AIVA</strong> – chiếc kính thông minh giúp trẻ học từ thế giới thật.
          </p>
          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">
              Chúng tôi sẽ gửi thông báo qua email này khi có hàng.
            </p>
          </div>
          <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 8px;">
            Theo dõi AIVA trên Facebook để cập nhật tin tức mới nhất:
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
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
