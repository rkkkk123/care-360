"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  ArrowRight,
  ShieldCheck,
  Mic,
  Volume2,
  VolumeX,
  Camera,
  RotateCw,
  Cpu,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceOrb } from "@/components/ui/VoiceOrb";
import { speakTextWithFallback, unlockAudioContext, SpeechPlaybackControls } from "@/lib/audio/speech-synthesis";
import { useAIHistoryStore, ChatMessage } from "@/lib/ai/ai-history-store";

type VoiceSessionState = "idle" | "listening" | "processing" | "speaking";

export default function AIPage() {
  const [language, setLanguage] = React.useState<"en" | "hi">("en");
  const [voiceState, setVoiceState] = React.useState<VoiceSessionState>("idle");
  const [voiceTranscript, setVoiceTranscript] = React.useState("");
  const [voiceResponseText, setVoiceResponseText] = React.useState("");
  const [voiceResponseAction, setVoiceResponseAction] = React.useState<{ label: string; href: string } | null>(null);

  // Track specific message playing in chat list
  const [activeSpeakingMessageId, setActiveSpeakingMessageId] = React.useState<string | null>(null);

  const speechControllerRef = React.useRef<SpeechPlaybackControls | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const autoCloseTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const { chatMessages: messages, addChatMessage, clearChatHistory } = useAIHistoryStore();

  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Clean up any ongoing audio/recognition on unmount
  React.useEffect(() => {
    return () => {
      stopAllAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const stopAllAudio = () => {
    if (speechControllerRef.current) {
      speechControllerRef.current.stop();
      speechControllerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeakingMessageId(null);
  };

  const closeVoiceSession = () => {
    stopAllAudio();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setVoiceState("idle");
    setVoiceTranscript("");
    setVoiceResponseText("");
    setVoiceResponseAction(null);
  };

  // Bilingual prompts
  const quickPrompts = {
    en: [
      {
        text: "Which doctor should I see for my Vitamin D levels?",
        response:
          "Based on your lab report showing Vitamin D at 24 ng/mL (insufficient), we recommend consulting Dr. Ananya Sharma (Internal Medicine & Metabolic Health) or Dr. Elena Rostova (Endocrinologist).",
        action: { label: "Discover Recommended Doctors", href: "/patient/doctors" },
      },
      {
        text: "Summarize my recent metabolic panel",
        response:
          "Your Comprehensive Metabolic Panel from CityPath Labs shows overall normal organ function. Fasting glucose (85 mg/dL) and Total Cholesterol (175 mg/dL) are optimal. The primary finding is mildly low Vitamin D.",
        action: { label: "View Full Lab Report", href: "/patient/reports/rep_1" },
      },
      {
        text: "What are the precautions for Vitamin D3 50,000 IU?",
        response:
          "Take this high-potency capsule once weekly with a meal containing dietary fat for optimal absorption. Avoid taking multiple calcium supplements concurrently without physician advice.",
        action: { label: "Scan Medicine with Vision AI", href: "/patient/ai/scanner" },
      },
    ],
    hi: [
      {
        text: "विटामिन डी के लिए मुझे किस डॉक्टर से मिलना चाहिए?",
        response:
          "आपकी हालिया रिपोर्ट में विटामिन डी का स्तर 24 ng/mL (सामान्य से कम) है। हम डॉ. अनन्या शर्मा (आंतरिक चिकित्सा) या डॉ. एलेना रोस्तोवा से परामर्श करने की सलाह देते हैं।",
        action: { label: "डॉक्टर खोजें और बुक करें", href: "/patient/doctors" },
      },
      {
        text: "मेरी हालिया रक्त जांच रिपोर्ट का सारांश दें",
        response:
          "आपकी मेटाबॉलिक लैब रिपोर्ट के अनुसार ग्लूकोज (85 mg/dL) और कोलेस्ट्रॉल (175 mg/dL) सामान्य हैं। केवल विटामिन डी का स्तर कम पाया गया है।",
        action: { label: "पूरी लैब रिपोर्ट देखें", href: "/patient/reports/rep_1" },
      },
      {
        text: "विटामिन डी की दवा लेते समय क्या सावधानियां रखें?",
        response:
          "यह उच्च क्षमता वाला कैप्सूल सप्ताह में एक बार भोजन के साथ लें। डॉक्टर की सलाह के बिना अत्यधिक कैल्शियम सप्लीमेंट न लें।",
        action: { label: "दवा स्कैनर का उपयोग करें", href: "/patient/ai/scanner" },
      },
    ],
  };

  // Start Voice Session (Listening Mode)
  const startListening = () => {
    unlockAudioContext();
    stopAllAudio();
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }

    setVoiceState("listening");
    setVoiceTranscript("");
    setVoiceResponseText("");
    setVoiceResponseAction(null);

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === "hi" ? "hi-IN" : "en-US";

        recognition.onstart = () => {
          setVoiceState("listening");
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setVoiceTranscript(transcript);

          // If this is the final result, transition to processing immediately
          if (event.results[current].isFinal) {
            setVoiceState("processing");
            processVoiceQuery(transcript);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("[Voice AI] Speech recognition error:", e.error);
          if (voiceState === "listening" && !voiceTranscript) {
            // Fallback simulation if mic is blocked or unavailable
            simulateVoiceQuery();
          }
        };

        recognition.onend = () => {
          // If ended while still listening and we captured text
          if (voiceState === "listening" && voiceTranscript.trim()) {
            setVoiceState("processing");
            processVoiceQuery(voiceTranscript);
          }
        };

        recognition.start();
      } catch (err) {
        console.warn("[Voice AI] SpeechRecognition failed to initialize:", err);
        simulateVoiceQuery();
      }
    } else {
      // Fallback for browsers without Web Speech Recognition API
      simulateVoiceQuery();
    }
  };

  const simulateVoiceQuery = () => {
    const simulated =
      language === "hi"
        ? "मेरी लैब रिपोर्ट और विटामिन डी के बारे में बताएं"
        : "Which doctor should I see for my Vitamin D levels?";
    setVoiceTranscript(simulated);
    setTimeout(() => {
      setVoiceState("processing");
      processVoiceQuery(simulated);
    }, 1200);
  };

  const processVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      closeVoiceSession();
      return;
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: queryText.trim(),
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);

    const abortCtrl = new AbortController();
    abortControllerRef.current = abortCtrl;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText.trim(),
          language: language,
        }),
        signal: abortCtrl.signal,
      });

      const data = await response.json();
      const assistantId = `a_${Date.now()}`;
      const englishText = data.englishContent || data.content || "";
      const hindiText = data.hindiContent || (language === "hi" ? data.content : undefined);
      const textToSpeak = language === "hi" && hindiText ? hindiText : englishText;

      addChatMessage({
        id: assistantId,
        role: "assistant",
        content: englishText,
        hindiContent: hindiText,
        action: data.action,
        modelUsed: data.modelUsed,
        timestamp: Date.now(),
      });

      setVoiceResponseText(textToSpeak);
      if (data.action && typeof data.action.href === "string" && data.action.href.trim() !== "") {
        const cleanHref = data.action.href.trim().startsWith("/")
          ? data.action.href.trim()
          : `/${data.action.href.trim()}`;
        setVoiceResponseAction({
          label: String(data.action.label || (language === "hi" ? "विवरण देखें" : "View Action")),
          href: cleanHref,
        });
      } else {
        setVoiceResponseAction(null);
      }

      // Transition smoothly to speaking state
      setVoiceState("speaking");
      setActiveSpeakingMessageId(assistantId);

      const controller = await speakTextWithFallback(textToSpeak, language, {
        onStart: () => {
          setVoiceState("speaking");
          setActiveSpeakingMessageId(assistantId);
        },
        onEnd: () => {
          setActiveSpeakingMessageId(null);
          // Wait 3.5s before gently closing so user can read the response and action
          if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
          autoCloseTimerRef.current = setTimeout(() => {
            closeVoiceSession();
          }, 3500);
        },
        onError: () => {
          setActiveSpeakingMessageId(null);
          closeVoiceSession();
        },
      });

      speechControllerRef.current = controller;
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("[Voice AI] Query failed:", err);
      const fallbackText =
        language === "hi"
          ? "मैं आपकी स्वास्थ्य सहायता के लिए तत्पर हूँ। कृपया अपना प्रश्न पूछें।"
          : "I am ready to assist your health journey. Please ask your question.";
      setVoiceResponseText(fallbackText);
      setVoiceState("speaking");
      await speakTextWithFallback(fallbackText, language, {
        onEnd: () => closeVoiceSession(),
        onError: () => closeVoiceSession(),
      });
    }
  };

  // Speak specific text from message item
  const speakSpecificMessage = async (msgId: string, text: string) => {
    unlockAudioContext();
    if (activeSpeakingMessageId === msgId) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    setActiveSpeakingMessageId(msgId);

    const controller = await speakTextWithFallback(text, language, {
      onStart: () => setActiveSpeakingMessageId(msgId),
      onEnd: () => {
        setActiveSpeakingMessageId(null);
        speechControllerRef.current = null;
      },
      onError: () => {
        setActiveSpeakingMessageId(null);
        speechControllerRef.current = null;
      },
    });

    speechControllerRef.current = controller;
  };

  // Standard chat message submission (text box)
  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: Date.now(),
    };

    addChatMessage(userMsg);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          language: language,
        }),
      });

      const data = await response.json();
      const assistantId = `a_${Date.now()}`;
      const englishText = data.englishContent || data.content || "";
      const hindiText = data.hindiContent || (language === "hi" ? data.content : undefined);

      addChatMessage({
        id: assistantId,
        role: "assistant",
        content: englishText,
        hindiContent: hindiText,
        action: data.action,
        modelUsed: data.modelUsed,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Chat API error:", error);
      addChatMessage({
        id: `a_${Date.now()}`,
        role: "assistant",
        content:
          "I am monitoring your health indicators. Please verify your internet connection or ask about your lab results, doctor appointments, or medication schedules.",
        hindiContent:
          "मैं आपके स्वास्थ्य संकेतकों की निगरानी कर रहा हूँ। कृपया अपनी लैब रिपोर्ट, डॉक्टर परामर्श या दवाओं के बारे में पूछें।",
        modelUsed: "CARE360 Resilient Backup",
        timestamp: Date.now(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleOrbClick = () => {
    unlockAudioContext();
    if (voiceState === "idle") {
      startListening();
    } else {
      closeVoiceSession();
    }
  };

  return (
    <>
      {/* Immersive Apple-Grade Voice Orb Overlay */}
      <AnimatePresence>
        {voiceState !== "idle" && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl p-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Top Toolbar */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-secondary/80 p-1 rounded-2xl border border-border text-xs">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-xl font-medium transition ${
                    language === "en" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1 rounded-xl font-medium transition ${
                    language === "hi" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Close / Dismiss Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeVoiceSession}
                className="rounded-full bg-secondary/80 hover:bg-secondary text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Central Stage */}
            <div className="flex flex-col items-center gap-8 max-w-lg w-full text-center px-4">
              {/* Dynamic VoiceOrb */}
              <VoiceOrb
                isListening={voiceState === "listening"}
                isProcessing={voiceState === "processing"}
                isSpeaking={voiceState === "speaking"}
                onClick={handleOrbClick}
                className="w-56 h-56 sm:w-64 sm:h-64 [&_button]:w-48 [&_button]:h-48 sm:[&_button]:w-56 sm:[&_button]:h-56 [&_svg]:w-14 [&_svg]:h-14 sm:[&_svg]:w-16 sm:[&_svg]:h-16 shadow-2xl"
              />

              {/* State Indicator and Text */}
              <motion.div
                className="space-y-4 w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Status Heading */}
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground flex items-center justify-center gap-2">
                  {voiceState === "listening" && (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping inline-block mr-1" />
                      {language === "hi" ? "सुन रहा हूँ... बोलिए" : "Listening... Speak now"}
                    </>
                  )}
                  {voiceState === "processing" && (
                    <>
                      <RefreshCw className="h-5 w-5 text-primary animate-spin inline-block mr-1" />
                      {language === "hi" ? "उत्तर तैयार हो रहा है..." : "Analyzing Clinical Data..."}
                    </>
                  )}
                  {voiceState === "speaking" && (
                    <>
                      <Volume2 className="h-6 w-6 text-primary animate-pulse inline-block mr-1" />
                      {language === "hi" ? "CARE360 बोल रहा है..." : "Speaking..."}
                    </>
                  )}
                </h2>

                {/* Live Transcript / Response Preview */}
                <div className="min-h-[60px] max-h-[140px] overflow-y-auto px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-xs sm:text-sm text-foreground/90 backdrop-blur-sm">
                  {voiceState === "listening" && (
                    <p className="italic text-muted-foreground">
                      {voiceTranscript ||
                        (language === "hi"
                          ? "विटामिन डी, लैब रिपोर्ट या डॉक्टर के बारे में बोलें..."
                          : "Ask anything about symptoms, blood reports, or doctors...")}
                    </p>
                  )}

                  {voiceState === "processing" && (
                    <p className="text-foreground font-medium">
                      &ldquo;{voiceTranscript}&rdquo;
                    </p>
                  )}

                  {voiceState === "speaking" && (
                    <p className="leading-relaxed text-foreground">
                      {voiceResponseText}
                    </p>
                  )}
                </div>

                {/* Action Link in Voice Mode if present */}
                {voiceResponseAction &&
                  typeof voiceResponseAction.href === "string" &&
                  voiceResponseAction.href.trim() !== "" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-2 flex justify-center"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full text-xs h-8 px-5 bg-primary shadow-md hover:bg-primary/90"
                        asChild
                        onClick={closeVoiceSession}
                      >
                        <Link
                          href={
                            voiceResponseAction.href.startsWith("/")
                              ? voiceResponseAction.href
                              : `/${voiceResponseAction.href}`
                          }
                        >
                          {voiceResponseAction.label}
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}

                {/* Engine Badge & Tap to Stop */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {language === "hi"
                      ? "ElevenLabs व Google सुरक्षित आवाज़"
                      : "Dual-Engine Neural Speech"}
                  </span>
                  <button
                    onClick={closeVoiceSession}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline transition"
                  >
                    {language === "hi" ? "समाप्त करें" : "Tap to dismiss"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-8 max-w-4xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
        {/* Header with Bilingual Switcher & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Bilingual Voice & Chat AI Copilot
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light tracking-tight text-foreground">
                AI Health Assistant
              </h1>
              <button
                onClick={clearChatHistory}
                className="text-[11px] text-muted-foreground hover:text-foreground underline transition"
              >
                Clear History
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {language === "hi"
                ? "हिंदी और अंग्रेजी में आपकी स्वास्थ्य रिपोर्ट, दवाओं और डॉक्टर की सिफ़ारिशों के लिए बुद्धिमान सहायक।"
                : "Ask anything about your reports, medicines, doctors, and symptoms in English or Hindi."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Seamless Language Toggle */}
            <div className="flex items-center bg-secondary p-1 rounded-2xl border border-border text-xs">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  language === "en" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  language === "hi" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
            </div>

            <Button variant="outline" size="sm" className="rounded-2xl text-xs h-9" asChild>
              <Link href="/patient/ai/scanner">
                <Camera className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Vision Scanners
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Chat Conversation Surface */}
        <div className="rounded-3xl border border-border bg-card shadow-sm flex flex-col h-[580px] overflow-hidden">
          {/* Messages Scroll Area */}
          <div ref={scrollRef} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const textToDisplay =
                language === "hi" && msg.hindiContent ? msg.hindiContent : msg.content;
              const isThisMessageSpeaking = activeSpeakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isUser
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-primary border border-border"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                          : "bg-secondary/40 border border-border text-foreground rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{textToDisplay}</p>

                      {/* Assistant footer with TTS button & engine badge */}
                      {!isUser && (
                        <div className="pt-2.5 flex items-center justify-between border-t border-border/40 mt-2.5 text-[11px] text-muted-foreground">
                          <button
                            onClick={() => speakSpecificMessage(msg.id, textToDisplay)}
                            className="flex items-center gap-1.5 hover:text-primary transition font-medium"
                          >
                            {isThisMessageSpeaking ? (
                              <>
                                <VolumeX className="h-3.5 w-3.5 text-primary animate-pulse" />
                                <span className="text-primary font-semibold">
                                  {language === "hi" ? "रोकें (Stop)" : "Stop Voice"}
                                </span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3.5 w-3.5 text-primary" />
                                <span>{language === "hi" ? "बोलकर सुनें (Voice)" : "Listen (Speech)"}</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80">
                            {msg.modelUsed && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/80 border border-border/50 text-[10px]">
                                <Cpu className="h-2.5 w-2.5 text-primary" />
                                {msg.modelUsed}
                              </span>
                            )}
                            <span>{language === "hi" ? "हिन्दी" : "English"}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Guarded Action Button with strict prop-type check */}
                    {msg.action &&
                      typeof msg.action.href === "string" &&
                      msg.action.href.trim() !== "" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs h-7 bg-card hover:bg-secondary/60 text-primary border-primary/20 shadow-sm"
                          asChild
                        >
                          <Link
                            href={
                              msg.action.href.startsWith("/")
                                ? msg.action.href
                                : `/${msg.action.href}`
                            }
                          >
                            {msg.action.label || (language === "hi" ? "विवरण देखें" : "View Details")}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-secondary text-primary border border-border flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-2xl bg-secondary/40 border border-border p-3.5 rounded-tl-none">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 border-t border-border bg-secondary/20 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
            <span className="text-muted-foreground text-[11px] font-medium shrink-0">
              {language === "hi" ? "सुझाव:" : "Suggested:"}
            </span>
            {quickPrompts[language].map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.text)}
                className="rounded-full bg-card hover:bg-secondary border border-border/80 px-3 py-1 text-foreground transition whitespace-nowrap text-[11px] shadow-sm"
              >
                {qp.text}
              </button>
            ))}
          </div>

          {/* Input Bar with Voice Dictation Orb */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-card flex items-center gap-2"
          >
            {/* Voice Dictation Orb Trigger */}
            <VoiceOrb
              isListening={voiceState === "listening"}
              isProcessing={voiceState === "processing"}
              isSpeaking={voiceState === "speaking"}
              onClick={startListening}
              className="shrink-0"
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "hi"
                  ? "यहाँ टाइप करें या वॉइस असिस्टेंट से बात करें..."
                  : "Type your health question or tap the mic orb to speak..."
              }
              className="flex-1 bg-secondary/30 border border-border rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />

            <Button
              type="submit"
              size="sm"
              disabled={!input.trim()}
              className="rounded-2xl px-4 h-10 shrink-0 bg-primary shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
