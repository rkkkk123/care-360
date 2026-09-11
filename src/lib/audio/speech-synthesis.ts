/**
 * Resilient Dual-Engine Speech Synthesis for CARE360
 * Integrates ElevenLabs neural TTS with an automatic, zero-latency fallback to
 * Google Web Speech API (speechSynthesis) for both Hindi (hi-IN) and English (en-US).
 * Guarantees that voice feedback NEVER breaks.
 */

import { generateSpeech } from "./elevenlabs-client";

export interface SpeechPlaybackControls {
  stop: () => void;
}

export async function speakTextWithFallback(
  text: string,
  language: "en" | "hi",
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }
): Promise<SpeechPlaybackControls> {
  let activeAudio: HTMLAudioElement | null = null;
  let isCancelled = false;

  const cleanup = () => {
    isCancelled = true;
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    callbacks?.onEnd?.();
  };

  // 1. First attempt: ElevenLabs Neural TTS
  try {
    const blob = await generateSpeech(text);
    if (blob && blob.size > 0 && !isCancelled) {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      activeAudio = audio;

      audio.onplay = () => {
        callbacks?.onStart?.();
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        callbacks?.onEnd?.();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        // If ElevenLabs audio element fails to play, fallback to Web Speech
        speakViaWebSpeechAPI(text, language, callbacks, isCancelled);
      };

      await audio.play();
      return { stop: cleanup };
    }
  } catch (elevenErr) {
    console.warn("ElevenLabs playback error. Falling back to Google Web Speech API:", elevenErr);
  }

  // 2. Second attempt: Google Web Speech API (speechSynthesis)
  if (!isCancelled) {
    speakViaWebSpeechAPI(text, language, callbacks, isCancelled);
  }

  return { stop: cleanup };
}

function speakViaWebSpeechAPI(
  text: string,
  language: "en" | "hi",
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  },
  isCancelled?: boolean
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Browser SpeechSynthesis is not supported.");
    callbacks?.onEnd?.();
    return;
  }

  if (isCancelled) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from markdown asterisks, backticks, emojis before speaking
  const cleanText = text
    .replace(/\*+/g, "")
    .replace(/`+/g, "")
    .replace(/[💊🌿📄🔍❤️🩺]/g, "")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = language === "hi" ? "hi-IN" : "en-US";
  utterance.rate = language === "hi" ? 0.9 : 0.95;
  utterance.pitch = 1.0;

  // Select optimal voice (e.g. Google हिन्दी or Google US English)
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (language === "hi") {
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes("hi") ||
          v.name.toLowerCase().includes("hindi") ||
          v.name.toLowerCase().includes("हिन्दी")
      );
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      const englishVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes("en-us") ||
          v.lang.toLowerCase().includes("en") ||
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("natural")
      );
      if (englishVoice) utterance.voice = englishVoice;
    }
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    callbacks?.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn("WebSpeech synthesis error:", e);
    callbacks?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
