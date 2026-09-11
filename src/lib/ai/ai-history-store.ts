import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  hindiContent?: string;
  action?: {
    label: string;
    href: string;
    icon?: string;
  };
  modelUsed?: string;
  timestamp: number;
}

export type ScanType = "medicine" | "leaf" | "skin" | "document";

export interface ScanResult {
  id: string;
  type: ScanType;
  timestamp: number;
  data: any; // Flexible for medicine/leaf/skin/document
  geminiData?: any;
  quickSynopsis?: string;
  primaryAction?: string;
  triageBadge?: string;
  mistralReport?: {
    quickSynopsis?: string;
    primaryAction?: string;
    triageBadge?: string;
    clinicalSummary?: string;
    keyFindings?: string[];
    contraindicationsOrWarnings?: string[];
    recommendedNextSteps?: string[];
    lifestyleOrDietaryGuidance?: string[];
    medicalConfidenceScore?: number;
    modelUsed?: string;
  };
  imagePreviewName?: string;
  thumbnailUrl?: string;
}

interface AIHistoryState {
  chatMessages: ChatMessage[];
  scanHistory: ScanResult[];
  addChatMessage: (msg: ChatMessage) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
  clearChatHistory: () => void;
  addScanResult: (scan: ScanResult) => void;
  deleteScanResult: (id: string) => void;
  clearScanHistory: () => void;
}

// Helper to sanitize chat messages and guarantee action.href is always a valid string
export function sanitizeChatMessage(msg: any): ChatMessage {
  if (!msg || typeof msg !== "object") {
    return {
      id: `m_${Date.now()}`,
      role: "assistant",
      content: "Hello, how can I assist your health journey today?",
      timestamp: Date.now(),
    };
  }

  let sanitizedAction: ChatMessage["action"] = undefined;
  if (msg.action && typeof msg.action === "object") {
    const rawHref = msg.action.href || msg.action.url || msg.action.link;
    if (typeof rawHref === "string" && rawHref.trim() !== "") {
      const cleanHref = rawHref.trim().startsWith("/") ? rawHref.trim() : `/${rawHref.trim()}`;
      sanitizedAction = {
        label: String(msg.action.label || msg.action.title || "View Details"),
        href: cleanHref,
        icon: msg.action.icon,
      };
    }
  }

  return {
    id: String(msg.id || `m_${Date.now()}`),
    role: msg.role === "user" ? "user" : "assistant",
    content: String(msg.content || ""),
    hindiContent: msg.hindiContent ? String(msg.hindiContent) : undefined,
    action: sanitizedAction,
    modelUsed: msg.modelUsed ? String(msg.modelUsed) : undefined,
    timestamp: typeof msg.timestamp === "number" ? msg.timestamp : Date.now(),
  };
}

export const useAIHistoryStore = create<AIHistoryState>()(
  persist(
    (set) => ({
      chatMessages: [
        {
          id: "m_1",
          role: "assistant",
          content:
            "Hello Jane. I'm your CARE360 AI Health Assistant. I have secure, read-only access to your health timeline, lab reports, and doctor consultations. How can I assist your health journey today?",
          hindiContent:
            "नमस्ते जेन। मैं आपका CARE360 AI स्वास्थ्य सहायक हूँ। मेरे पास आपकी स्वास्थ्य समयरेखा, लैब रिपोर्ट और डॉक्टर परामर्श का सुरक्षित विवरण है। आज मैं आपकी क्या सहायता कर सकता हूँ?",
          timestamp: Date.now(),
        },
      ],
      scanHistory: [],
      addChatMessage: (msg) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, sanitizeChatMessage(msg)],
        })),
      setChatMessages: (msgs) =>
        set({ chatMessages: Array.isArray(msgs) ? msgs.map(sanitizeChatMessage) : [] }),
      clearChatHistory: () =>
        set({
          chatMessages: [
            {
              id: "m_1",
              role: "assistant",
              content:
                "Hello Jane. I'm your CARE360 AI Health Assistant. I have secure, read-only access to your health timeline, lab reports, and doctor consultations. How can I assist your health journey today?",
              hindiContent:
                "नमस्ते जेन। मैं आपका CARE360 AI स्वास्थ्य सहायक हूँ। मेरे पास आपकी स्वास्थ्य समयरेखा, लैब रिपोर्ट और डॉक्टर परामर्श का सुरक्षित विवरण है। आज मैं आपकी क्या सहायता कर सकता हूँ?",
              timestamp: Date.now(),
            },
          ],
        }),
      addScanResult: (scan) =>
        set((state) => ({
          scanHistory: [scan, ...state.scanHistory.filter((s) => s.id !== scan.id)],
        })),
      deleteScanResult: (id) =>
        set((state) => ({
          scanHistory: state.scanHistory.filter((s) => s.id !== id),
        })),
      clearScanHistory: () => set({ scanHistory: [] }),
    }),
    {
      name: "care360-ai-history",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.chatMessages)) {
          state.chatMessages = state.chatMessages.map(sanitizeChatMessage);
        }
      },
    }
  )
);

