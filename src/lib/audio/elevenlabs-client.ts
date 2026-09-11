// ElevenLabs TTS Client for CARE360
// Supports natural voice synthesis via server route with zero CORS issues

export async function generateSpeech(
  text: string,
  voiceId = "EXAVITQu4vr4xnSDxMaL"
): Promise<Blob | null> {
  if (!text || !text.trim()) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch("/api/ai/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voiceId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.includes("audio")) {
      return await response.blob();
    }

    // If server responded with json fallback
    return null;
  } catch (error) {
    console.warn("[ElevenLabs Client] TTS request aborted or network failed. Using Web Speech API fallback.");
    return null;
  }
}

