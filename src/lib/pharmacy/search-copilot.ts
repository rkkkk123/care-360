import { z } from "zod";

export const PharmacySearchPreferencesSchema = z.object({
  completePrescriptionRequired: z.boolean().default(true),
  fulfillmentType: z.enum(["any", "pickup", "delivery"]).default("any"),
  sort: z.enum(["best_match", "price", "distance", "fastest"]).default("best_match"),
  maxDistanceMiles: z.number().optional(),
  queryExplanation: z.string(),
});

export type PharmacySearchPreferences = z.infer<typeof PharmacySearchPreferencesSchema>;

export class PharmacySearchCopilot {
  static async parseNaturalLanguageQuery(query: string): Promise<PharmacySearchPreferences> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        return await this.callGeminiParser(apiKey, query);
      } catch (e) {
        console.warn("Gemini query parser failed, using deterministic rule engine:", e);
      }
    }

    return this.parseDeterministicQuery(query);
  }

  private static async callGeminiParser(
    apiKey: string,
    query: string
  ): Promise<PharmacySearchPreferences> {
    const systemInstruction = `You are a medical search intent parser.
Your role is solely to extract search preferences from the patient's query into pure valid JSON.
DO NOT diagnose, prescribe, change medication, or determine medical equivalence.
Required JSON schema:
{
  "completePrescriptionRequired": boolean,
  "fulfillmentType": "any" | "pickup" | "delivery",
  "sort": "best_match" | "price" | "distance" | "fastest",
  "maxDistanceMiles": number or null,
  "queryExplanation": "string explaining how preferences were structured"
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: `Parse patient search query: "${query}"` }] }],
        generationConfig: { response_mime_type: "application/json", temperature: 0.1 },
      }),
    });

    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Empty response");

    return PharmacySearchPreferencesSchema.parse(JSON.parse(raw));
  }

  private static parseDeterministicQuery(query: string): PharmacySearchPreferences {
    const q = query.toLowerCase();

    let fulfillmentType: "any" | "pickup" | "delivery" = "any";
    if (q.includes("pickup") || q.includes("pick up") || q.includes("drive-thru")) {
      fulfillmentType = "pickup";
    } else if (q.includes("deliver") || q.includes("courier") || q.includes("doorstep") || q.includes("ship")) {
      fulfillmentType = "delivery";
    }

    let sort: "best_match" | "price" | "distance" | "fastest" = "best_match";
    if (q.includes("cheap") || q.includes("lowest price") || q.includes("cost") || q.includes("afford")) {
      sort = "price";
    } else if (q.includes("close") || q.includes("near") || q.includes("distance") || q.includes("nearby")) {
      sort = "distance";
    } else if (q.includes("fast") || q.includes("quick") || q.includes("urgent") || q.includes("soon")) {
      sort = "fastest";
    }

    return {
      completePrescriptionRequired: true,
      fulfillmentType,
      sort,
      queryExplanation: `Parsed natural query: sorted by ${sort}, fulfillment preference: ${fulfillmentType}. Filtered using deterministic catalog & inventory data.`,
    };
  }
}
