// This is a wrapper for Google Gemini API
// Ensure you have installed `@google/genai` or use fetch directly

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function generateText(prompt: string): Promise<string> {
  if (!API_KEY) {
    console.warn("GOOGLE_GEMINI_API_KEY is not set. Returning mock data.");
    return "This is a mock response from Gemini API. Please set your GOOGLE_GEMINI_API_KEY.";
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function analyzeImage(fileBase64: string, mimeType: string, prompt: string): Promise<string> {
  if (!API_KEY) {
    console.warn("GOOGLE_GEMINI_API_KEY is not set. Returning mock data.");
    return `\`\`\`json
{
  "name": "Simulated Upload (No API Key)",
  "tag": "Mock Analysis",
  "genericName": "Mock Generic",
  "therapeuticClass": "Mock Class",
  "uses": ["Mock use 1", "Mock use 2"],
  "sideEffects": ["Mock side effect 1"],
  "precautions": ["Mock precaution 1"],
  "imagePreview": "📸 Image uploaded successfully",
  "botanicalName": "Mock Botanical Name",
  "family": "Mock Family",
  "activeCompounds": ["Compound 1", "Compound 2"],
  "traditionalUses": ["Traditional Use 1"],
  "modernEvidence": "Modern Evidence 1",
  "preparation": "Preparation 1",
  "condition": "Mock Condition",
  "riskLevel": "Low Risk",
  "riskColor": "text-green-500 bg-green-500/10 border-green-500/20",
  "abcdeCheck": {
    "asymmetry": "Mock Asymmetry",
    "borders": "Mock Borders",
    "color": "Mock Color",
    "diameter": "Mock Diameter",
    "evolution": "Mock Evolution"
  },
  "assessment": "Mock Assessment",
  "preliminaryCare": ["Mock Care 1"],
  "recommendation": "Mock Recommendation"
}
\`\`\``;
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: fileBase64
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Multimodal API Error:", error);
    throw error;
  }
}
