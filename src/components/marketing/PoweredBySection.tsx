"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Cpu, ShieldCheck, Zap, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PartnerLogo {
  id: string;
  name: string;
  category: string;
  badge: string;
  src: string;
  aspect: string;
  role: string;
  latency: string;
}

const PARTNERS: PartnerLogo[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    category: "Multimodal Vision & Clinical OCR",
    badge: "Diagnostic AI",
    src: "/logos/powered-by/gemini.png",
    aspect: "w-8 h-8",
    role: "Extracts 40+ clinical biomarkers from lab reports & scans",
    latency: "~850ms Vision OCR"
  },
  {
    id: "mistral",
    name: "Mistral AI",
    category: "Edge Clinical Reasoning",
    badge: "Edge Intelligence",
    src: "/logos/powered-by/mistral.png",
    aspect: "w-8 h-8",
    role: "Ultra-fast, privacy-preserving on-premise clinical reasoning",
    latency: "<80ms Inference"
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    category: "Accelerated Healthcare Compute",
    badge: "Tensor Acceleration",
    src: "/logos/powered-by/nvidia.png",
    aspect: "h-6 w-auto",
    role: "BioNeMo protein acceleration & real-time EHR processing",
    latency: "TensorRT Optimized"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Clinical Voice Synthesis",
    badge: "Voice Assistant",
    src: "/logos/powered-by/elevenlabs.png",
    aspect: "h-5 w-auto",
    role: "Ultra-low latency empathic voice intake for patient triage",
    latency: "<150ms Stream"
  },
  {
    id: "corsair",
    name: "Corsair",
    category: "Sub-50ms Edge Engine & MCP",
    badge: "Clinical HealthOps",
    src: "/logos/powered-by/corsair.png",
    aspect: "w-8 h-8",
    role: "Local edge database cache & Model Context Protocol agent tools",
    latency: "<50ms Query Latency"
  }
];

export function PoweredBySection() {
  // Duplicate partner list multiple times for an infinite, gapless marquee loop
  const marqueeItems = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-background via-secondary/40 to-background border-y border-border/60">
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-4 shadow-apple-sm">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>Powered By Industry-Leading Intelligence &amp; Compute Foundations</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Engineered on World-Class AI Infrastructure
        </h2>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          CARE360 seamlessly orchestrates multimodal medical vision, privacy-preserving reasoning, GPU compute, voice synthesis, and sub-50ms edge databases.
        </p>
      </div>

      {/* ── Infinite Marquee Moving from Left to Right ───────────── */}
      <div className="relative w-full overflow-hidden">
        {/* Left Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />

        {/* Right Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />

        {/* Marquee Track (Left to Right Animation) */}
        <div className="animate-marquee-ltr flex items-center gap-4 sm:gap-6 py-2">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group relative flex items-center gap-4 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-card border border-border shadow-apple-sm hover:shadow-apple-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm cursor-pointer shrink-0 select-none"
            >
              {/* Logo container */}
              <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border/60 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={item.src}
                  alt={item.name}
                  width={48}
                  height={48}
                  className={`${item.aspect} object-contain transition-opacity duration-200`}
                />
              </div>

              {/* Partner Meta */}
              <div className="flex flex-col text-left pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1 max-w-[220px]">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-primary/80 mt-1 font-semibold">
                  ⚡ {item.latency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Micro-Ribbon ──────────────────────────────────── */}
      <div className="mt-8 text-center">
        <Link
          href="/architecture"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <span>Explore how each model &amp; engine is connected in our Full Architecture</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
