"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mic, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceOrbProps {
  isListening: boolean;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceOrb({ isListening, isProcessing, isSpeaking, onClick, className }: VoiceOrbProps) {
  // Simulate audio visualizer data when listening or speaking
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!isListening && !isSpeaking) {
      setVolume(1);
      return;
    }

    // A fake audio visualizer effect using setInterval to pulse the orb
    const interval = setInterval(() => {
      setVolume(1 + Math.random() * (isSpeaking ? 0.6 : 0.4));
    }, isSpeaking ? 100 : 150);

    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  const isActive = isListening || isProcessing || isSpeaking;

  return (
    <div 
      className={cn("relative flex items-center justify-center w-12 h-12", className)}
      onClick={onClick}
    >
      {/* Outer Tricolor Glow / Audio Wave */}
      <motion.div
        className="absolute inset-[-20%] rounded-full bg-gradient-to-tr from-[#138808] via-white to-[#FF9933] blur-xl opacity-50"
        animate={{
          scale: isActive && !isProcessing ? volume * 1.4 : 1,
          opacity: isActive ? 0.8 : 0,
          rotate: isActive ? 360 : 0,
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { duration: 8, repeat: Infinity, ease: "linear" }
        }}
      />

      {/* Core Orb Base */}
      <motion.button
        type="button"
        onClick={onClick}
        className="relative z-10 w-full h-full rounded-full flex items-center justify-center cursor-pointer overflow-hidden bg-background shadow-lg border border-border/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Dynamic Wave Mesh Background */}
        <div className="absolute inset-0 bg-zinc-900" />
        
        {/* Saffron Wave */}
        <motion.div
          className="absolute inset-[-40%] bg-[#FF9933]/80 mix-blend-screen"
          style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
          animate={{
            rotate: isActive ? 360 : 0,
            scale: isActive ? [1, 1.2, 1] : 1,
            y: isActive ? ["-10%", "10%", "-10%"] : "0%",
          }}
          transition={{
            rotate: { duration: isSpeaking ? 3 : 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* White Wave */}
        <motion.div
          className="absolute inset-[-30%] bg-white/90 mix-blend-overlay"
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          animate={{
            rotate: isActive ? -360 : 0,
            scale: isActive ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: isSpeaking ? 4 : 7, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Green Wave */}
        <motion.div
          className="absolute inset-[-50%] bg-[#138808]/80 mix-blend-screen"
          style={{ borderRadius: "30% 70% 50% 50% / 50% 50% 70% 30%" }}
          animate={{
            rotate: isActive ? 360 : 0,
            scale: isActive ? [1, 1.3, 1] : 1,
            y: isActive ? ["10%", "-10%", "10%"] : "0%",
          }}
          transition={{
            rotate: { duration: isSpeaking ? 4.5 : 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Inner shadow to give 3D spherical depth */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_20px_rgba(255,255,255,0.2)] z-10 pointer-events-none" />

        {/* Processing Spinner / Mic / Speaker Icon */}
        <div className="relative z-20 text-white drop-shadow-md">
          {isProcessing ? (
            <Loader2 className="w-1/3 h-1/3 animate-spin mx-auto text-white" />
          ) : isSpeaking ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Volume2 className="w-1/3 h-1/3 mx-auto text-white/90" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: isListening ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Mic className="w-1/3 h-1/3 mx-auto text-white/90" />
            </motion.div>
          )}
        </div>
      </motion.button>
    </div>
  );
}
