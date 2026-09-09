"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  FileText,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Languages,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceOrb } from "@/components/ui/VoiceOrb";
import { generateText } from "@/lib/ai/gemini-client";
import { generateSpeech } from "@/lib/audio/elevenlabs-client";

import { useAIHistoryStore, ChatMessage } from "@/lib/ai/ai-history-store";

export default function AIPage() {
  const [language, setLanguage] = React.useState<"en" | "hi">("en");
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState<string | null>(null);
  
  const { chatMessages: messages, addChatMessage, clearChatHistory } = useAIHistoryStore();
  
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [wasLastInputVoice, setWasLastInputVoice] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Bilingual prompts matching hackathon poster
  const quickPrompts = {
    en: [
      {
        text: "Which doctor should I see for my Vitamin D levels?",
        response:
          "Based on your March 2026 lab report showing Vitamin D at 24 ng/mL (insufficient), we recommend consulting Dr. Ananya Sharma (Internal Medicine & Metabolic Health, 98% AI Match) or Dr. Elena Rostova (Endocrinologist).",
        action: { label: "Discover Recommended Doctors", href: "/patient/doctors" },
      },
      {
        text: "Summarize my recent metabolic panel",
        response:
          "Your Comprehensive Metabolic Panel from CityPath Labs shows overall normal organ function. Fasting glucose (85 mg/dL) and Total Cholesterol (175 mg/dL) are optimal. The primary finding is mildly low 25-OH Vitamin D (24 ng/mL).",
        action: { label: "View Full Lab Report", href: "/patient/reports/rep_1" },
      },
      {
        text: "What are the precautions for Vitamin D3 50,000 IU?",
        response:
          "Take this high-potency capsule once weekly with a fat-containing meal for optimal absorption. Avoid taking multiple calcium supplements concurrently without physician advice.",
        action: { label: "Scan Medicine with Vision AI", href: "/patient/ai/scanner" },
      },
    ],
    hi: [
      {
        text: "विटामिन डी के लिए मुझे किस डॉक्टर से मिलना चाहिए?",
        response:
          "आपकी हालिया रिपोर्ट में विटामिन डी का स्तर 24 ng/mL (सामान्य से कम) है। हम डॉ. अनन्या शर्मा (आंतरिक चिकित्सा, 98% AI मिलान) से परामर्श करने की सलाह देते हैं।",
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
          "यह दवा सप्ताह में एक बार भोजन के साथ लें। डॉक्टर की सलाह के बिना अत्यधिक कैल्शियम सप्लीमेंट न लें।",
        action: { label: "दवा स्कैनर का उपयोग करें", href: "/patient/ai/scanner" },
      },
    ],
  };

  // Web Speech Recognition for Voice Input
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "hi" ? "hi-IN" : "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setWasLastInputVoice(true);
        handleSend(transcript, true);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Graceful fallback for non-supported browsers
      setIsListening(true);
      setTimeout(() => {
        const simulated =
          language === "hi"
            ? "मेरी लैब रिपोर्ट समझाएं"
            : "Which doctor should I see for my Vitamin D levels?";
        setInput(simulated);
        setIsListening(false);
        setWasLastInputVoice(true);
        handleSend(simulated, true);
      }, 1500);
    }
  };

  const [audioPlayer, setAudioPlayer] = React.useState<HTMLAudioElement | null>(null);

  // Web Speech Synthesis for Voice Output
  const speakText = async (msgId: string, text: string) => {
    if (isSpeaking === msgId) {
      if (audioPlayer) {
        audioPlayer.pause();
        setAudioPlayer(null);
      }
      setIsSpeaking(null);
      return;
    }

    if (audioPlayer) {
      audioPlayer.pause();
    }

    setIsSpeaking(msgId);
    try {
      const blob = await generateSpeech(text);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        setIsSpeaking(null);
        setAudioPlayer(null);
      };
      audio.onerror = () => {
        setIsSpeaking(null);
        setAudioPlayer(null);
      };
      
      setAudioPlayer(audio);
      audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsSpeaking(null);
    }
  };

  const handleSend = async (textToSend?: string, isVoice: boolean = false) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend && !isVoice) {
      setWasLastInputVoice(false);
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: Date.now(),
    };

    addChatMessage(userMsg);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const geminiResponse = await generateText(
        `You are CARE360 AI Health Assistant. The user says: "${query}". Keep your response under 3 sentences, empathetic, and strictly related to health or app navigation. Respond in ${language === 'hi' ? 'Hindi' : 'English'}.`
      );
      
      const assistantId = `a_${Date.now()}`;
      addChatMessage({
        id: assistantId,
        role: "assistant",
        content: geminiResponse,
        timestamp: Date.now(),
      });
      
      if (isVoice) {
        speakText(assistantId, geminiResponse);
      }
      
    } catch (error) {
      console.error("Gemini AI error:", error);
      const errId = `a_${Date.now()}`;
      addChatMessage({
        id: errId,
        role: "assistant",
        content: language === "hi" 
          ? "क्षमा करें, मुझे इस समय आपसे जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।" 
          : "I'm sorry, I'm having trouble connecting to my intelligence network right now. Please try again.",
        timestamp: Date.now(),
      });
      if (isVoice) {
        speakText(errId, language === "hi" ? "क्षमा करें, मुझे इस समय आपसे जुड़ने में समस्या हो रही है।" : "I'm sorry, I'm having trouble right now.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Immersive Voice Orb Overlay */}
      <AnimatePresence>
        {(isListening || !!isSpeaking) && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-8 right-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsListening(false);
                  if (audioPlayer) {
                    audioPlayer.pause();
                    setAudioPlayer(null);
                  }
                  setIsSpeaking(null);
                }}
                className="rounded-full bg-secondary/50 hover:bg-secondary"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center gap-12">
              <VoiceOrb 
                isListening={isListening}
                isSpeaking={!!isSpeaking}
                isProcessing={isTyping}
                onClick={toggleListening}
                className="w-64 h-64 [&_button]:w-56 [&_button]:h-56 [&_svg]:w-16 [&_svg]:h-16"
              />
              <motion.div
                className="text-center space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-light tracking-tight text-foreground">
                  {isListening ? (language === "hi" ? "सुन रहा हूँ..." : "Listening...") : (language === "hi" ? "बोल रहा हूँ..." : "Speaking...")}
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {input || (language === "hi" ? "अपने स्वास्थ्य से जुड़ा सवाल पूछें" : "Ask anything about your health")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-8 max-w-4xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
      {/* Header with Language Switcher & Clear History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Bilingual Voice & Chat AI Assistant
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              AI Health Copilot
            </h1>
            <button onClick={clearChatHistory} className="text-[10px] text-muted-foreground hover:text-foreground underline">
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
          {/* Language Toggle */}
          <div className="flex items-center bg-secondary p-1 rounded-2xl border border-border text-xs">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-xl font-medium transition ${
                language === "en" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              English
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

          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/ai/scanner">
              <Camera className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Vision Scanners
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Chat Conversation Surface */}
      <div className="rounded-3xl border border-border bg-card shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div ref={scrollRef} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const textToDisplay =
              language === "hi" && msg.hindiContent ? msg.hindiContent : msg.content;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-primary border border-border"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary/40 border border-border text-foreground rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{textToDisplay}</p>

                    {/* Audio TTS button on assistant replies */}
                    {!isUser && (
                      <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-2 text-[11px] text-muted-foreground">
                        <button
                          onClick={() => speakText(msg.id, textToDisplay)}
                          className="flex items-center gap-1 hover:text-primary transition"
                        >
                          {isSpeaking === msg.id ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5 text-primary animate-pulse" />
                              <span className="text-primary font-medium">Mute Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5" />
                              <span>Listen (TTS)</span>
                            </>
                          )}
                        </button>
                        <span className="text-[10px] text-muted-foreground/80">
                          {language === "hi" ? "हिन्दी आवाज़" : "Voice Output"}
                        </span>
                      </div>
                    )}
                  </div>

                  {msg.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs h-7 bg-card hover:bg-secondary/60 text-primary border-primary/20 shadow-sm"
                      asChild
                    >
                      <Link href={msg.action.href}>
                        {msg.action.label}
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

        {/* Listening Active Waveform Overlay */}
        {isListening && (
          <div className="bg-primary/10 border-t border-primary/20 p-3 flex items-center justify-between text-xs text-primary px-6 animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary animate-bounce" />
              <span className="font-semibold">
                {language === "hi" ? "सुन रहा हूँ... बोलिए" : "Listening... Speak your question"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-1 bg-primary rounded-full animate-pulse" />
              <span className="h-5 w-1 bg-primary rounded-full animate-pulse [animation-delay:0.1s]" />
              <span className="h-4 w-1 bg-primary rounded-full animate-pulse [animation-delay:0.2s]" />
              <span className="h-6 w-1 bg-primary rounded-full animate-pulse [animation-delay:0.3s]" />
              <span className="h-3 w-1 bg-primary rounded-full animate-pulse [animation-delay:0.15s]" />
            </div>
            <button
              onClick={() => setIsListening(false)}
              className="text-[11px] underline font-medium hover:text-foreground"
            >
              Stop
            </button>
          </div>
        )}

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

        {/* Input Bar with Voice Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-border bg-card flex items-center gap-2"
        >
          {/* Voice Dictation Button */}
          <VoiceOrb
            isListening={isListening}
            isProcessing={isTyping}
            isSpeaking={!!isSpeaking}
            onClick={toggleListening}
            className="shrink-0"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "hi"
                ? "यहाँ टाइप करें या माइक दबाकर बोलें..."
                : "Type your health question or press microphone to speak..."
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
