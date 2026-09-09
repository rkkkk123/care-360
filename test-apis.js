const dotenv = require("dotenv");
dotenv.config();

const testGemini = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (!API_KEY) {
    console.log("❌ NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY is missing in .env");
    return;
  }
  
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say 'Hello World' in two words." }] }]
      })
    });
    const data = await res.json();
    if (res.ok && data.candidates) {
      console.log("✅ Gemini API Test Passed. Response:", data.candidates[0].content.parts[0].text.trim());
    } else {
      console.log("❌ Gemini API Test Failed. Status:", res.status, data);
    }
  } catch (error) {
    console.log("❌ Gemini API Test Exception:", error.message);
  }
};

const testElevenLabs = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
  if (!API_KEY) {
    console.log("❌ NEXT_PUBLIC_ELEVENLABS_API_KEY is missing in .env");
    return;
  }
  
  // Using Sarah (free-tier default voice) instead of a library voice
  const voiceId = "EXAVITQu4vr4xnSDxMaL"; 

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
      },
      body: JSON.stringify({
        text: "Hello",
        model_id: "eleven_multilingual_v2"
      })
    });
    
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      console.log("✅ ElevenLabs API Test Passed. Received audio bytes:", buffer.byteLength);
    } else {
      const data = await res.json().catch(() => null);
      console.log("❌ ElevenLabs API Test Failed. Status:", res.status, data);
    }
  } catch (error) {
    console.log("❌ ElevenLabs API Test Exception:", error.message);
  }
};

async function run() {
  await testGemini();
  await testElevenLabs();
}

run();
