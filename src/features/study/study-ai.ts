import type { Condition, PolicyAction } from "./curiosityPolicy";

export type StudyReply =
  | { ok: true; text: string }
  | { ok: false; fallback: string };

const MODEL_FALLBACKS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-lite-latest",
].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);

export function buildActionInstruction(
  actions: PolicyAction[],
  condition: Condition
): string {
  const parts: string[] = [];
  for (const action of actions) {
    switch (action) {
      case "ASK_BACK":
        parts.push(
          "ASK_BACK: Đặt đúng MỘT câu hỏi gợi mở ngắn gọn, KHÔNG đưa đáp án."
        );
        break;
      case "HINT":
        parts.push("HINT: Đưa một gợi ý nhẹ; cố gắng không chốt đáp án cuối.");
        break;
      case "ASSIGN_EXPLORE":
        parts.push(
          "ASSIGN_EXPLORE: Giao cho trẻ một nhiệm vụ khám phá ngắn (đếm, so sánh, quan sát) liên quan câu hỏi, mời trẻ tìm ra bằng tự quan sát."
        );
        break;
      case "REQUEST_VERIFY":
        parts.push(
          "REQUEST_VERIFY: Hỏi trẻ đã khám phá xong chưa / mô tả điều trẻ vừa tìm thấy."
        );
        break;
      case "ANSWER_BRIEF":
        parts.push(
          "ANSWER_BRIEF: Trả lời ngắn gọn, tối đa 2 câu, mời trẻ tự quan sát tiếp."
        );
        break;
      case "ANSWER_FULL":
        parts.push("ANSWER_FULL: Trả lời rõ ràng, phù hợp trẻ em, dễ hiểu.");
        break;
      case "CONSOLIDATE":
        parts.push(
          "CONSOLIDATE: Chốt lại điều mình vừa học bằng một câu tổng kết ngắn."
        );
        break;
      case "SEED_NEXT":
        parts.push(
          "SEED_NEXT: Đặt một câu hỏi tò mò thú vị để rủ trẻ khám phá tiếp (không phải câu kiểm tra)."
        );
        break;
      case "SAFETY_BLOCK":
        parts.push("SAFETY_BLOCK: Từ chối nhẹ nhàng, không vào nội dung.");
        break;
    }
  }
  return `Trả lời theo đúng các hành động sau (theo thứ tự): ${parts.join(" ")}`;
}

function fallbackFor(actions: PolicyAction[], childText: string): string {
  if (actions.includes("SAFETY_BLOCK")) {
    return "AIVA chưa trả lời được câu này. Con mình chơi một thứ khác nhé!";
  }
  if (actions.includes("ASSIGN_EXPLORE")) {
    return `Con thử quan sát xung quanh xem: điều gì liên quan chữ "${childText.slice(0, 40)}" mà con nhìn thấy được nào?`;
  }
  if (actions.includes("ANSWER_FULL") || actions.includes("ANSWER_BRIEF")) {
    return "AIVA sẽ trả lời con trong phiên bản đầy đủ — thử câu hỏi khác thú vị hơn nhé! (offline)";
  }
  if (actions.includes("ASK_BACK")) {
    return "Con nghĩ điều gì xảy ra nếu mình thử khác đi một chút?";
  }
  if (actions.includes("HINT")) {
    return "Gợi ý nhỏ: con thử nhìn kỹ hơn xem có chi tiết nào bất thường không?";
  }
  if (actions.includes("REQUEST_VERIFY")) {
    return "Con đã khám phá xong chưa? Nói cho AIVA nghe con nhìn thấy gì nhé!";
  }
  return "AIVA đã nhận câu hỏi của con!";
}

export async function generateStudyReply(
  childText: string,
  actions: PolicyAction[],
  condition: Condition
): Promise<StudyReply> {
  const apiKey = process.env.GEMINI_API_KEY;
  const instruction = buildActionInstruction(actions, condition);
  const fallback = fallbackFor(actions, childText);

  if (!apiKey) return { ok: false, fallback };

  const systemPrompt = [
    "Bạn là AIVA, bạn đồng hành tò mò cho trẻ em Việt Nam (7-10 tuổi).",
    "Giọng thân mật, ngắn gọn, dễ hiểu, tiếng Việt.",
    "Không đưa đoạn văn dài. Luôn giữ trẻ ở vùng hứng thú vừa phải — kích thích nhưng không gây bực bội.",
    "Thí nghiệm đang so sánh trả lời trực tiếp (C0) và trả lời thích nghi theo tò mò (C2).",
    `Điều kiện hiện tại: ${condition}.`,
    "KHÔNG giải thích về bản thân thí nghiệm cho trẻ.",
  ].join("\n");

  for (const model of MODEL_FALLBACKS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [
              {
                role: "user",
                parts: [
                  { text: `${instruction}\n\nCâu hỏi của trẻ: ${childText}` },
                ],
              },
            ],
            generationConfig: { temperature: 0.5, maxOutputTokens: 320 },
          }),
        }
      );
      if (!res.ok) {
        if (res.status === 429) continue;
        continue;
      }
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) continue;
      return { ok: true, text: text.slice(0, 600) };
    } catch {
      continue;
    }
  }

  return { ok: false, fallback };
}
