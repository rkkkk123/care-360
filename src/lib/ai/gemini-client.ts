// Google Gemini API Client for CARE360
// Supports multimodal visual analysis (Images & Documents/PDFs) and clinical text extraction

const getApiKey = () =>
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY ||
  process.env.GOOGLE_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "";

const GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.6-flash",
];

export async function generateText(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("GOOGLE_GEMINI_API_KEY is not set. Returning mock data.");
    return "This is a mock response from Gemini API. Please set your GOOGLE_GEMINI_API_KEY.";
  }

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini model ${model} failed with status: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (error) {
      console.warn(`Gemini generation error with ${model}:`, error);
    }
  }

  throw new Error("Gemini generateContent failed across all models.");
}

export async function analyzeImage(
  fileBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("GOOGLE_GEMINI_API_KEY is not set. Returning mock data.");
    return `\`\`\`json
{
  "name": "Simulated Analysis (Offline Mode)",
  "tag": "Mock Verification",
  "genericName": "Medical Specimen",
  "therapeuticClass": "Clinical Diagnostic",
  "uses": ["General therapeutic usage documented in clinical guidelines."],
  "sideEffects": ["Mild transient discomfort"],
  "precautions": ["Follow standard physician instructions."],
  "imagePreview": "📸 Optical specimen analyzed"
}
\`\`\``;
  }

  // Normalize mime type for Gemini multimodal inlineData
  let effectiveMime = mimeType;
  if (!effectiveMime || effectiveMime === "application/octet-stream") {
    effectiveMime = "image/jpeg";
  }

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: effectiveMime,
                    data: fileBase64,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Gemini model ${model} multimodal failed (${response.status}):`, errText);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) {
        return text;
      }
    } catch (error) {
      console.warn(`Gemini Multimodal API Error with ${model}:`, error);
    }
  }

  throw new Error("Gemini Multimodal Vision API failed across all available models.");
}
