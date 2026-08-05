import {
  checkMessage,
  tryFaqMatch,
  validateHistory,
  validateOutput
} from "@/features/chat/lib/guardrails";
import { tryKnowledgeMatch } from "@/features/chat/lib/knowledge-match";
import { callGemini } from "@/features/chat/lib/gemini";
import { checkRateLimit, getClientIp } from "@/features/chat/lib/rate-limit";
import type { ChatLocale } from "@/features/chat/lib/knowledge";

const BLOCKED_MESSAGES: Record<ChatLocale, Record<string, string>> = {
  vi: {
    injection:
      "Tôi chỉ có thể trả lời các câu hỏi về sản phẩm AIva. Bạn có thể hỏi về tính năng, đặt trước, pin, hoặc liên hệ hỗ trợ.",
    off_topic:
      "Xin lỗi, tôi chỉ hỗ trợ thông tin về kính thông minh AIva (tính năng, đặt trước, thông số, liên hệ). Bạn cần hỗ trợ gì về AIva?",
    too_long: "Tin nhắn quá dài. Vui lòng rút gọn dưới 500 ký tự.",
    empty: "Vui lòng nhập câu hỏi của bạn.",
    rate_limit: "Bạn đang gửi tin nhắn quá nhanh. Vui lòng thử lại sau vài giây.",
    error: "Đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ aivisionassistance@gmail.com.",
    quota:
      "Hệ thống AI đang quá tải. Tôi trả lời tạm theo thông tin sản phẩm — nếu cần hỗ trợ thêm, email aivisionassistance@gmail.com."
  },
  en: {
    injection:
      "I can only answer questions about AIva products. Feel free to ask about features, pre-order, battery, or support.",
    off_topic:
      "Sorry, I only support questions about AIva smart glasses (features, pre-order, specs, contact). How can I help with AIva?",
    too_long: "Message is too long. Please keep it under 500 characters.",
    empty: "Please enter your question.",
    rate_limit: "You're sending messages too quickly. Please wait a few seconds.",
    error: "Something went wrong. Please try again or contact aivisionassistance@gmail.com.",
    quota:
      "The AI service is busy. Here's what I know about the product — for more help, email aivisionassistance@gmail.com."
  }
};

const GREETING_REPLIES: Record<ChatLocale, string> = {
  vi: "Xin chào! Tôi là trợ lý AIva. Tôi có thể giúp bạn tìm hiểu về kính thông minh AIva, đặt trước, tính năng và liên hệ hỗ trợ. Bạn muốn biết điều gì?",
  en: "Hello! I'm the AIva assistant. I can help you learn about AIva smart glasses, pre-order, features, and support. What would you like to know?"
};

function resolveLocale(value: unknown): ChatLocale {
  return value === "en" ? "en" : "vi";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);

    const body = await request.json();
    const locale = resolveLocale(body.locale);
    const msgs = BLOCKED_MESSAGES[locale];

    if (!rateCheck.allowed) {
      return Response.json(
        { reply: msgs.rate_limit, blocked: true, reason: "rate_limit" },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter ?? 60) } }
      );
    }

    const history = validateHistory(body.history);
    if (history === null) {
      return Response.json({ error: "Invalid history" }, { status: 400 });
    }

    const guard = checkMessage(body.message ?? "");
    if (!guard.allowed) {
      const reason = guard.reason;
      return Response.json({
        reply: msgs[reason === "injection" ? "injection" : reason === "off_topic" ? "off_topic" : reason],
        blocked: true,
        reason
      });
    }

    const { sanitized } = guard;

    if (/^(hi|hello|hey|chào|xin chào|chao)\b/i.test(sanitized)) {
      return Response.json({ reply: GREETING_REPLIES[locale] });
    }

    const faqAnswer = tryFaqMatch(sanitized, locale);
    if (faqAnswer) {
      return Response.json({ reply: faqAnswer });
    }

    const knowledgeAnswer = tryKnowledgeMatch(sanitized, locale);
    if (knowledgeAnswer) {
      return Response.json({ reply: knowledgeAnswer });
    }

    const gemini = await callGemini(locale, sanitized, history);

    if (gemini.ok && validateOutput(gemini.text)) {
      return Response.json({ reply: gemini.text });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        reply:
          locale === "vi"
            ? "Tôi chưa thể trả lời câu hỏi này tự động. Vui lòng xem mục FAQ trên trang chủ hoặc liên hệ aivisionassistance@gmail.com."
            : "I can't answer this automatically yet. Please check the FAQ on the homepage or contact aivisionassistance@gmail.com."
      });
    }

    if (!gemini.ok && gemini.reason === "quota") {
      return Response.json({ reply: msgs.quota });
    }

    return Response.json({ reply: msgs.error }, { status: 500 });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ reply: BLOCKED_MESSAGES.vi.error }, { status: 500 });
  }
}
