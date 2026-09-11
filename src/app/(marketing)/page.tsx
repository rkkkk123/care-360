"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hero } from "@/components/marketing/Hero";
import { MedicalEvolutionSection } from "@/components/marketing/MedicalEvolutionSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { CareLoop } from "@/components/marketing/CareLoop";
import { AISection } from "@/components/marketing/AISection";
import { CareConnectSection } from "@/components/marketing/CareConnectSection";
import { DoctorTrustSection } from "@/components/marketing/DoctorTrustSection";
import { PharmacySection } from "@/components/marketing/PharmacySection";
import { HealthTimelineSection } from "@/components/marketing/HealthTimelineSection";
import { VoiceAssistantSection } from "@/components/marketing/VoiceAssistantSection";
import { PortalSection } from "@/components/marketing/PortalSection";
import { TrustSection } from "@/components/marketing/TrustSection";
import { AccessibilitySection } from "@/components/marketing/AccessibilitySection";
import { TestimonialSection } from "@/components/marketing/TestimonialSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PoweredBySection } from "@/components/marketing/PoweredBySection";
import Care360Intro from "@/components/intro/Care360Intro";

export default function Home() {
  const [showIntro, setShowIntro] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    // Use sessionStorage so it only plays once per browser session (perfect for demoing)
    const hasPlayed = sessionStorage.getItem("care360_intro_played");
    if (!hasPlayed) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("care360_intro_played", "true");
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <Care360Intro key="intro" onComplete={handleIntroComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`bg-background min-h-screen text-foreground transition-colors duration-200 ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
        <Hero />
        <PoweredBySection />
        <MedicalEvolutionSection />
        <ProblemSection />
        <CareLoop />
        <AISection />
        <CareConnectSection />
        <DoctorTrustSection />
        <PharmacySection />
        <HealthTimelineSection />
        <VoiceAssistantSection />
        <PortalSection />
        <TrustSection />
        <AccessibilitySection />
        <TestimonialSection />
        <FinalCTA />
      </div>
    </>
  );
}
