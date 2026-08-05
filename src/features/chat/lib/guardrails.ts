import { FAQ_PAIRS, type ChatLocale } from "./knowledge";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?)/i,
  /forget\s+(everything|all|your)\s+(instructions?|rules?|prompt)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+(a\s+)?(?!aiva)/i,
  /system\s*prompt/i,
  /reveal\s+(your\s+)?(prompt|instructions?|rules?)/i,
  /jailbreak/i,
  /\bdan\s+mode\b/i,
  /override\s+(your\s+)?(rules?|instructions?)/i,
  /new\s+instructions?:/i,
  /\[system\]/i,
  /<\/?system>/i,
  /developer\s+mode/i,
  /bypass\s+(your\s+)?(rules?|restrictions?|guardrails?)/i,
  /do\s+anything\s+now/i,
  /roleplay\s+as/i
];

const OFF_TOPIC_PATTERNS = [
  /\b(write|generate|create)\s+(me\s+)?(a\s+)?(code|script|program|essay|poem|story)\b/i,
  /\b(homework|bài tập|làm hộ)\b/i,
  /\b(chính trị|politics|election|bầu cử)\b/i,
  /\b(cờ bạc|gambling|casino)\b/i,
  /\b(hack|crack|exploit|malware)\b/i,
  /\b(làm bài|giải bài|solve this)\b/i
];

const GREETING_PATTERNS = [
  /^(hi|hello|hey|chào|xin chào|chao|yo)\b/i,
  /^(cảm ơn|thank|thanks|ok|oke|okay)\b/i
];

const TOPIC_KEYWORDS = [
  "aiva",
  "aíva",
  "kính",
  "glasses",
  "pre-order",
  "preorder",
  "đặt trước",
  "đặt hàng",
  "pin",
  "battery",
  "sạc",
  "charge",
  "trẻ em",
  "trẻ",
  "kids",
  "children",
  "child",
  "camera",
  "micro",
  "microphone",
  "esp32",
  "wifi",
  "bluetooth",
  "màn hình",
  "screen",
  "phụ huynh",
  "parent",
  "app",
  "ứng dụng",
  "giá",
  "price",
  "cost",
  "liên hệ",
  "contact",
  "support",
  "hỗ trợ",
  "faq",
  "hỏi",
  "tuổi",
  "age",
  "website",
  "facebook",
  "email",
  "sản phẩm",
  "product",
  "tính năng",
  "feature",
  "loa",
  "speaker",
  "audio",
  "âm thanh",
  "thông số",
  "spec",
  "mua",
  "buy",
  "order"
];

export type GuardrailResult =
  | { allowed: true; sanitized: string }
  | { allowed: false; reason: "empty" | "too_long" | "injection" | "off_topic" | "invalid_history" };

export function sanitizeInput(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkMessage(message: string): GuardrailResult {
  const sanitized = sanitizeInput(message);

  if (!sanitized) {
    return { allowed: false, reason: "empty" };
  }

  if (sanitized.length > MAX_MESSAGE_LENGTH) {
    return { allowed: false, reason: "too_long" };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      return { allowed: false, reason: "injection" };
    }
  }

  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(sanitized)) {
      return { allowed: false, reason: "off_topic" };
    }
  }

  const lower = sanitized.toLowerCase();

  const isGreeting = GREETING_PATTERNS.some((p) => p.test(lower));
  const hasTopicKeyword = TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
  const matchesFaq = FAQ_PAIRS.vi.some((f) => lower.includes(f.q)) || FAQ_PAIRS.en.some((f) => lower.includes(f.q));

  if (!isGreeting && !hasTopicKeyword && !matchesFaq) {
    return { allowed: false, reason: "off_topic" };
  }

  return { allowed: true, sanitized };
}

export function validateHistory(
  history: unknown
): { role: "user" | "assistant"; content: string }[] | null {
  if (!Array.isArray(history)) return [];

  if (history.length > MAX_HISTORY_TURNS) {
    return null;
  }

  const valid: { role: "user" | "assistant"; content: string }[] = [];

  for (const item of history) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("role" in item) ||
      !("content" in item) ||
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string"
    ) {
      return null;
    }

    const content = sanitizeInput(item.content).slice(0, MAX_MESSAGE_LENGTH);
    if (!content) continue;
    valid.push({ role: item.role, content });
  }

  return valid;
}

export function tryFaqMatch(message: string, locale: ChatLocale): string | null {
  const lower = message.toLowerCase();
  const pairs = FAQ_PAIRS[locale];

  for (const { q, a } of pairs) {
    if (lower.includes(q)) return a;
  }

  return null;
}

const LEAK_PATTERNS = [
  /system\s*prompt/i,
  /AIVA_KNOWLEDGE/i,
  /you are an AI assistant/i,
  /bạn là trợ lý AI/i,
  /\[INST\]/i
];

export function validateOutput(reply: string): boolean {
  if (!reply || reply.length > 2000) return false;
  return !LEAK_PATTERNS.some((p) => p.test(reply));
}
