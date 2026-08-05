import { buildSystemPrompt } from "./prompts";
import type { ChatLocale } from "./knowledge";

type ChatTurn = { role: "user" | "assistant"; content: string };

export type GeminiResult =
  | { ok: true; text: string }
  | { ok: false; reason: "no_key" | "quota" | "error" };

const MODEL_FALLBACKS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-lite-latest"
].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);

async function callModel(
  apiKey: string,
  model: string,
  locale: ChatLocale,
  message: string,
  history: ChatTurn[]
): Promise<GeminiResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }]
    })),
    { role: "user", parts: [{ text: message }] }
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemPrompt(locale) }]
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 400
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Gemini API error (${model}):`, response.status, body);

    if (response.status === 429) {
      return { ok: false, reason: "quota" };
    }

    return { ok: false, reason: "error" };
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) return { ok: false, reason: "error" };

  return { ok: true, text };
}

export async function callGemini(
  locale: ChatLocale,
  message: string,
  history: ChatTurn[]
): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, reason: "no_key" };

  let lastResult: GeminiResult = { ok: false, reason: "error" };

  for (const model of MODEL_FALLBACKS) {
    const result = await callModel(apiKey, model, locale, message, history);
    if (result.ok) return result;

    lastResult = result;
    if (result.reason === "quota") continue;
    if (result.reason === "error") continue;
  }

  return lastResult;
}
