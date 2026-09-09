// This is a wrapper for ElevenLabs TTS API

const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY || "";
// Default voice ID for a natural sounding assistant (Sarah - Free Tier)
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; 

export async function generateSpeech(text: string, voiceId = DEFAULT_VOICE_ID): Promise<Blob> {
  if (!API_KEY) {
    console.warn("ELEVENLABS_API_KEY is not set. Returning empty blob.");
    return new Blob();
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2", // Best for Hindi/English mixes
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    throw error;
  }
}
