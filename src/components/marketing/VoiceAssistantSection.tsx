"use client";

import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Mic, Waves, Sparkles, Volume2 } from "lucide-react";
import { motion } from "motion/react";

export function VoiceAssistantSection() {
  return (
    <Section className="bg-gradient-to-b from-secondary/40 via-background to-secondary/30 relative overflow-hidden py-24 md:py-32">
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4 shadow-xs">
              <Mic className="h-3.5 w-3.5" />
              Bilingual Voice Healthcare Assistant
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
              Just ask in English or हिन्दी.
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Interact with your medical records conversationally. CARE360 Voice understands your health context, answers questions, and speaks back naturally.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-16 w-full max-w-3xl">
            <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl backdrop-blur-xl relative text-left">
              {/* Floating Tricolor Orb */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center">
                {/* Outer animated rings */}
                <motion.div
                  className="absolute w-24 h-24 rounded-full border border-orange-500/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-24 h-24 rounded-full border border-green-500/30"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.1, 0, 0.1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                
                {/* Main Orb */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.4)] border-4 border-background z-10 group cursor-pointer"
                >
                  {/* Tricolor Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Inner glow / wave effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    animate={{ y: ["0%", "10%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <Mic className="w-8 h-8 text-slate-800 drop-shadow-sm z-10 relative" />
                </motion.button>
              </div>
              
              <div className="space-y-6 mt-10">
                {/* User Prompt Bubble */}
                <div className="flex flex-col items-end">
                  <div className="bg-secondary/80 border border-border text-foreground px-6 py-4 rounded-3xl rounded-tr-none max-w-[85%] shadow-xs">
                    <p className="text-sm sm:text-base font-normal text-foreground">
                      &ldquo;Explain my latest Comprehensive Metabolic Panel. What does elevated HbA1c mean?&rdquo;
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      या बोलें: &ldquo;मुझे मेरी पिछली ब्लड टेस्ट रिपोर्ट सरल हिंदी में समझाएं&rdquo;
                    </p>
                  </div>
                </div>
                
                {/* AI Response Bubble */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 ml-2">
                    <Waves className="w-4 h-4 text-[#FF9933] animate-pulse" />
                    <span className="text-xs text-[#FF9933] font-bold tracking-wide uppercase">CARE360 Voice AI</span>
                    <span className="text-[10px] rounded-full bg-[#138808]/10 text-[#138808] px-2 py-0.2 border border-[#138808]/20">
                      Bilingual TTS Ready
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-[#FF9933]/5 via-white/5 to-[#138808]/5 border border-border text-foreground px-6 py-4 rounded-3xl rounded-tl-none max-w-[92%] shadow-xs backdrop-blur-sm">
                    <p className="text-sm sm:text-base font-normal leading-relaxed text-foreground">
                      Your blood work shows overall kidney and liver function are within normal limits. Your HbA1c is <strong>6.8%</strong>, which is slightly elevated and suggests pre-diabetes monitoring. Dr. Sharma has scheduled a follow-up and recommended dietary adjustments with Metformin 500mg.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Audio Visualizer Waves (Tricolor) */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-10 h-10 pt-4 border-t border-border/50 overflow-hidden">
                {[...Array(32)].map((_, i) => {
                  // Determine color based on position (Saffron, White, Green)
                  const isSaffron = i < 11;
                  const isWhite = i >= 11 && i < 21;
                  const colorClass = isSaffron ? "bg-[#FF9933]" : isWhite ? "bg-slate-300" : "bg-[#138808]";
                  
                  return (
                    <motion.div 
                      key={i}
                      className={`w-1 sm:w-1.5 ${colorClass} rounded-full ${i >= 20 ? "hidden sm:block" : ""}`}
                      animate={{
                        height: ["20%", "100%", "30%", "90%", "20%"]
                      }}
                      transition={{
                        duration: 1.2 + Math.random() * 0.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
