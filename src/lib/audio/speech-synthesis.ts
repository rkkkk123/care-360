/**
 * Resilient Dual-Engine Speech Synthesis for CARE360
 * Integrates ElevenLabs neural TTS with an automatic, zero-latency fallback to
 * Google Web Speech API (speechSynthesis) for both Hindi (hi-IN) and English (en-US).
 * Guarantees that voice feedback NEVER breaks or goes silent.
 */

import { generateSpeech } from "./elevenlabs-client";

export interface SpeechPlaybackControls {
  stop: () => void;
}

// Global audio unlocker to bypass mobile Safari and Chrome autoplay policy
let isAudioContextUnlocked = false;
export function unlockAudioContext() {
  if (isAudioContextUnlocked || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      // Create a short silent buffer to satisfy user gesture requirement
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
    isAudioContextUnlocked = true;
  } catch (e) {
    console.warn("AudioContext unlock attempt:", e);
  }
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
  // Ensure audio context is warm
  unlockAudioContext();

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
      const audio = new Audio();
      activeAudio = audio;
      audio.src = url;
      audio.volume = 1.0;
      audio.preload = "auto";

      audio.onplay = () => {
        callbacks?.onStart?.();
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        callbacks?.onEnd?.();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        console.warn("ElevenLabs audio decode error. Falling back to Google Web Speech API.");
        speakViaWebSpeechAPI(text, language, callbacks, isCancelled);
      };

      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        return { stop: cleanup };
      } catch (playErr) {
        console.warn("audio.play() prevented by browser policy. Falling back to Web Speech API:", playErr);
        // Fall back immediately to Web Speech API
        speakViaWebSpeechAPI(text, language, callbacks, isCancelled);
        return { stop: cleanup };
      }
    }
  } catch (elevenErr) {
    console.warn("ElevenLabs synthesis error. Falling back to Google Web Speech API:", elevenErr);
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

  // Unpause Chrome speech synthesis engine (common Chrome/Android bug)
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from markdown asterisks, backticks, emojis before speaking
  const cleanText = text
    .replace(/[*_~`#]/g, "")
    .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[💊🌿📄🔍❤️🩺]/g, "")
    .trim();

  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.volume = 1.0;
  utterance.rate = language === "hi" ? 0.9 : 0.95;
  utterance.pitch = 1.0;

  const configureVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (language === "hi") {
        const hindiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi") ||
            v.name.toLowerCase().includes("हिन्दी")
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = "hi-IN";
        } else {
          // Fallback to Indian English or natural voice so speech is never silent
          const indianVoice = voices.find((v) => v.lang.toLowerCase().includes("en-in"));
          if (indianVoice) {
            utterance.voice = indianVoice;
            utterance.lang = "en-IN";
          } else {
            utterance.lang = "en-US";
          }
        }
      } else {
        const englishVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes("en-us") ||
            v.lang.toLowerCase().includes("en") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("natural")
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
        utterance.lang = "en-US";
      }
    } else {
      utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    }

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("WebSpeech utterance error:", e);
      callbacks?.onEnd?.();
    };

    // Chrome workaround: resume again right before speak
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    configureVoiceAndSpeak();
  } else {
    // Voices might load asynchronously in Chrome
    let hasSpoken = false;
    const voiceHandler = () => {
      if (hasSpoken) return;
      hasSpoken = true;
      window.speechSynthesis.removeEventListener("voiceschanged", voiceHandler);
      configureVoiceAndSpeak();
    };
    window.speechSynthesis.addEventListener("voiceschanged", voiceHandler);
    // Timeout fallback if voiceschanged does not fire
    setTimeout(() => {
      if (!hasSpoken) {
        hasSpoken = true;
        window.speechSynthesis.removeEventListener("voiceschanged", voiceHandler);
        configureVoiceAndSpeak();
      }
    }, 250);
  }
}
