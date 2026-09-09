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
  timestamp: number;
}

export type ScanType = "medicine" | "leaf" | "skin";

export interface ScanResult {
  id: string;
  type: ScanType;
  timestamp: number;
  data: any; // Flexible to accommodate medicine/leaf/skin parsed JSON
  imagePreviewName?: string;
}

interface AIHistoryState {
  chatMessages: ChatMessage[];
  scanHistory: ScanResult[];
  addChatMessage: (msg: ChatMessage) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
  clearChatHistory: () => void;
  addScanResult: (scan: ScanResult) => void;
  clearScanHistory: () => void;
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
        set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      setChatMessages: (msgs) => set({ chatMessages: msgs }),
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
          scanHistory: [scan, ...state.scanHistory],
        })),
      clearScanHistory: () => set({ scanHistory: [] }),
    }),
    {
      name: "care360-ai-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
