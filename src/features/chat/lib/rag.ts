import { KNOWLEDGE_CHUNKS, type ChatLocale, type KnowledgeChunk } from "./knowledge";

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  const tokens = normalizeText(text).split(" ").filter(Boolean);
  return Array.from(new Set(tokens));
}

const KEYWORD_WEIGHT = 4;
const TITLE_WEIGHT = 2;
const CONTENT_WEIGHT = 1;

export function retrieveChunks(
  locale: ChatLocale,
  query: string,
  topK = 4,
  minScore = 1
): RetrievalResult[] {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];

  const results: RetrievalResult[] = [];

  for (const chunk of KNOWLEDGE_CHUNKS[locale]) {
    const kwSet = new Set(tokenize(chunk.keywords.join(" ")));
    const titleSet = new Set(tokenize(chunk.title));
    const contentSet = new Set(tokenize(chunk.content));

    let score = 0;
    for (const token of qTokens) {
      if (kwSet.has(token)) score += KEYWORD_WEIGHT;
      if (titleSet.has(token)) score += TITLE_WEIGHT;
      if (contentSet.has(token)) score += CONTENT_WEIGHT;
    }

    if (score >= minScore) results.push({ chunk, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

export function buildRagContext(results: RetrievalResult[]): string {
  return results.map((r) => `${r.chunk.title}:\n${r.chunk.content}`).join("\n\n");
}