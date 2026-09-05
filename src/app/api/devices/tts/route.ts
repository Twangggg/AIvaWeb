import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

const execFileAsync = promisify(execFile);

type TtsBody = {
  server_key?: string;
  text?: string;
};

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function ttsUpstreamUrl(): string {
  const raw = (process.env.AIVA_TTS_URL || process.env.NEXT_PUBLIC_AIVA_TTS_URL || "http://127.0.0.1:8000").replace(
    /\/$/,
    "",
  );
  if (raw.endsWith("/api/v1/tts/synthesize")) return raw;
  return `${raw}/api/v1/tts/synthesize`;
}

async function synthesizeUpstream(text: string): Promise<Buffer | null> {
  const upstream = ttsUpstreamUrl();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const demo = (process.env.AIVA_DEMO_TOKEN || "").trim();
  if (demo) headers["X-AIVA-Demo-Token"] = demo;

  const res = await fetch(upstream, {
    method: "POST",
    headers,
    body: JSON.stringify({ text }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 44) return null;
  return buf;
}

async function mp3ToWav16k(mp3: string, wav: string): Promise<void> {
  await execFileAsync(
    "ffmpeg",
    ["-y", "-i", mp3, "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", wav],
    { timeout: 30_000, maxBuffer: 8 * 1024 * 1024 },
  );
}

/** Lab fallback — gTTS Vietnamese + ffmpeg → 16k mono WAV (ESP-friendly). */
async function synthesizeGttsFallback(text: string): Promise<Buffer> {
  const id = randomBytes(6).toString("hex");
  const mp3 = join(tmpdir(), `aiva-tts-${id}.mp3`);
  const wav = join(tmpdir(), `aiva-tts-${id}.wav`);
  try {
    await execFileAsync("uv", ["run", "--with", "gTTS", "gtts-cli", text, "--lang", "vi", "-o", mp3], {
      timeout: 60_000,
      maxBuffer: 8 * 1024 * 1024,
    });
    await mp3ToWav16k(mp3, wav);
    return await fs.readFile(wav);
  } finally {
    await fs.unlink(mp3).catch(() => undefined);
    await fs.unlink(wav).catch(() => undefined);
  }
}

/**
 * Device-facing TTS: ESP posts {server_key, text}, returns audio/wav.
 * Prefer AIvaAI VieNeu; fall back to gTTS so Speak works without conda TTS.
 */
export async function POST(request: Request) {
  let body: TtsBody;
  try {
    body = (await request.json()) as TtsBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400, headers: corsHeaders() });
  }

  const serverKey = (body.server_key || "").trim();
  const text = (body.text || "").trim();
  if (!serverKey) {
    return NextResponse.json({ ok: false, error: "server_key required" }, { status: 400, headers: corsHeaders() });
  }
  if (!text) {
    return NextResponse.json({ ok: false, error: "text required" }, { status: 400, headers: corsHeaders() });
  }
  if (text.length > 500) {
    return NextResponse.json({ ok: false, error: "text too long" }, { status: 422, headers: corsHeaders() });
  }

  let audio: Buffer | null = null;
  let backend = "aivaai";
  try {
    audio = await synthesizeUpstream(text);
  } catch {
    audio = null;
  }

  if (!audio) {
    try {
      audio = await synthesizeGttsFallback(text);
      backend = "gtts";
    } catch (e) {
      const msg = e instanceof Error ? e.message : "tts_failed";
      return NextResponse.json(
        {
          ok: false,
          error: msg.slice(0, 500),
          hint: "Start AIvaAI on :8000, or ensure uv+ffmpeg+gTTS work on this host",
        },
        { status: 503, headers: corsHeaders() },
      );
    }
  }

  return new NextResponse(new Uint8Array(audio), {
    status: 200,
    headers: {
      ...corsHeaders(),
      "Content-Type": "audio/wav",
      "Content-Length": String(audio.length),
      "X-TTS-Backend": backend,
      "Cache-Control": "no-store",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
