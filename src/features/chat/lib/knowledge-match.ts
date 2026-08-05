import { AIVA_KNOWLEDGE, FAQ_PAIRS, type ChatLocale } from "./knowledge";

const FEATURE_PATTERNS =
  /làm được gì|làm gì|tính năng|chức năng|công dụng|dùng để|hoạt động|what can|features|what does|how does it work/i;

const PREORDER_PATTERNS = /đặt trước|đặt hàng|mua|pre-?order|buy|reserve/i;

const CAMERA_PATTERNS = /camera|nhận diện|nhìn|vision|thị giác/i;

export function tryFaqMatch(message: string, locale: ChatLocale): string | null {
  const lower = message.toLowerCase();
  const pairs = FAQ_PAIRS[locale];

  for (const { q, a } of pairs) {
    if (lower.includes(q)) return a;
  }

  return null;
}

export function tryKnowledgeMatch(message: string, locale: ChatLocale): string | null {
  const lower = message.toLowerCase();

  if (FEATURE_PATTERNS.test(lower)) {
    return locale === "vi"
      ? "AIva là kính thông minh cho trẻ 4–12 tuổi, không có màn hình. Camera hướng ra ngoài nhận diện vật thể, AI phản hồi bằng giọng nói giúp trẻ học từ thế giới thật. Phụ huynh kiểm soát qua app đi kèm. Pin LiPo 800 mAh (~100g), dùng cả ngày."
      : "AIva are smart glasses for children aged 4–12 with no screen. An outward-facing camera recognizes objects and AI responds by voice to help kids learn from the real world. Parents control usage via the companion app. 800 mAh battery (~100g), all-day use.";
  }

  if (PREORDER_PATTERNS.test(lower)) {
    return locale === "vi"
      ? 'Nhấn "Đặt trước ngay" trên website aiva.id.vn, điền họ tên, email và số điện thoại. Chúng tôi sẽ email khi mở bán chính thức.'
      : 'Click "Pre-order Now" on aiva.id.vn and fill in your name, email, and phone. We\'ll email you when official sales open.';
  }

  if (CAMERA_PATTERNS.test(lower)) {
    return locale === "vi"
      ? "AIva có camera hướng ra ngoài để nhận diện vật thể xung quanh. AI phân tích hình ảnh và kể cho trẻ nghe qua loa — không có màn hình điện tử."
      : "AIva has an outward-facing camera to recognize objects around the child. AI analyzes what it sees and tells the child through speakers — no electronic display.";
  }

  if (/kính|glasses|aiva/i.test(lower) && /là gì|what is|giới thiệu|about/i.test(lower)) {
    return locale === "vi"
      ? "AIva (AIVA) là kính thông minh dành cho trẻ em, giúp trẻ học hỏi từ thế giới thực qua giọng nói AI — không màn hình, bảo vệ thị lực."
      : "AIva (AIVA) are smart glasses for children that help kids learn from the real world through AI voice — screen-free, protecting eyesight.";
  }

  if (lower.includes("kính") || lower.includes("aiva") || lower.includes("glasses")) {
    const snippet = AIVA_KNOWLEDGE[locale].split("\n").slice(0, 8).join(" ").replace(/\s+/g, " ").trim();
    if (snippet.length > 40) {
      return snippet.slice(0, 320) + (snippet.length > 320 ? "..." : "");
    }
  }

  return null;
}
