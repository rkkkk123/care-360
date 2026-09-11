import { NextResponse } from "next/server";

const getApiKey = () =>
  process.env.ELEVENLABS_API_KEY ||
  process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
  "sk_40c03d9bbdf8d5ce33d7ee61252ed1d07aaef318b65f7e2f";

// Default voice ID: Sarah (EXAVITQu4vr4xnSDxMaL) or Rachel (21m00Tcm4TlvDq8ikWAM)
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export async function POST(request: Request) {
  try {
    const { text, voiceId = DEFAULT_VOICE_ID } = await request.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json({ fallback: true, reason: "No API key configured" }, { status: 200 });
    }

    // Clean text of markdown asterisks, backticks, emojis before sending to TTS
    const cleanText = text
      .replace(/[*_~`#]/g, "")
      .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim()
      .slice(0, 1000); // Guard against overly long payloads

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.warn(`[API /api/ai/tts] ElevenLabs returned ${response.status}:`, errText);
      return NextResponse.json({ fallback: true, status: response.status }, { status: 200 });
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.warn("[API /api/ai/tts] ElevenLabs proxy error:", error?.message || error);
    return NextResponse.json({ fallback: true, reason: error?.message || "Timeout" }, { status: 200 });
  }
}
