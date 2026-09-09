import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import {
  UploadCloud,
  Cpu,
  Search,
  CalendarCheck,
  Video,
  FileCheck2,
  Store,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function CareLoop() {
  const steps = [
    {
      number: "1",
      icon: UploadCloud,
      title: "Patient Input",
      subtitle: "Share Your Health Data",
      items: ["Lab Report Upload (Blood test, etc.)", "Medicine / Pill Photo Scan", "Ayurvedic Leaf / Plant Photo", "Dermatology Skin Image", "Voice Assistant (Hindi / English)"],
      href: "/patient/ai/scanner",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      number: "2",
      icon: Cpu,
      title: "AI Analysis",
      subtitle: "Get Instant Insights",
      items: ["Report OCR & Plain Language Explanations", "Drug Uses, Side Effects & Interactions", "Botanical Benefits & Phytochemicals", "Skin ABCDE Preliminary Screening", "Longitudinal Trend Comparison"],
      href: "/patient/reports",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      number: "3",
      icon: Search,
      title: "Find & Choose Doctor",
      subtitle: "Get the Best Match",
      items: ["Search by Specialization & Hospital", "Real-Time Slot Availability", "Compare Doctors (Fee, Experience, Rating)", "AI Doctor Recommendation with Clinical Rationale"],
      href: "/patient/doctors",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    {
      number: "4",
      icon: CalendarCheck,
      title: "Book Appointment",
      subtitle: "Consult with Ease",
      items: ["Select Preferred Date & Time", "Video Call or In-Person Clinic", "Intake Health Questionnaire", "Instant Booking Confirmation Token"],
      href: "/patient/appointments",
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      number: "5",
      icon: Video,
      title: "Video Consultation",
      subtitle: "Connect with Doctor",
      items: ["Encrypted HD WebRTC Video Room", "Doctor Context Drawer & Patient History", "In-Session Gemini Clinical Copilot", "Collaborative Discussion & Advice"],
      href: "/doctor/appointments",
      badgeColor: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    },
    {
      number: "6",
      icon: FileCheck2,
      title: "Prescription",
      subtitle: "Digital & Secure",
      items: ["Doctor Authoring with Catalog Drug Search", "NCPDP SCRIPT / Vector PDF Generation", "SHA-256 Tamper-Evident Audit Seal", "Auto-Stored to Patient Health Timeline"],
      href: "/patient/prescriptions",
      badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    },
    {
      number: "7",
      icon: Store,
      title: "Buy Medicines",
      subtitle: "Find Nearby Pharmacies",
      items: ["Live Geo-Location & Distance Ranking", "Real-Time Stock Availability Matrix", "Compare Price, Distance & Rating", "Atomic Reservation • Courier Delivery or Pickup"],
      href: "/patient/pharmacies",
      badgeColor: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    {
      number: "8",
      icon: TrendingUp,
      title: "Track & Follow-up",
      subtitle: "Stay on Top of Your Health",
      items: ["Chronological Health Timeline", "Biomarker Trends (HbA1c, Cholesterol, BP)", "Status: Improving / Stable / Attention", "Automated Medication Refill Reminders"],
      href: "/patient/timeline",
      badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    },
  ];

  return (
    <Section className="relative bg-secondary/20 py-24">
      <Container>
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Continuous Connected Care Journey
            </div>
            <SectionHeading 
              title="8 Steps. One Complete Connected Ecosystem." 
              subtitle="From the moment you have a health question to continuous longitudinal tracking, every step informs the next in an unbroken circle of care."
            />
          </div>
        </Reveal>

        {/* 8-Step Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step number badge & icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-sm">
                        {step.number}
                      </span>
                      <div className={`p-2 rounded-2xl border ${step.badgeColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      Step 0{step.number}
                    </span>
                  </div>

                  {/* Titles */}
                  <div>
                    <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-1.5 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                    {step.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Link */}
                <div className="pt-5 mt-4 border-t border-border/40">
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Launch Step</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continuous Care Ribbon Banner */}
        <Reveal delay={0.2}>
          <div className="mt-14 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 sm:p-8 text-center space-y-3 shadow-sm">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>A Complete Circle of Care • Prevent • Consult • Treat • Track • Live Better</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-foreground tracking-wide">
              DISCOVER &rarr; UNDERSTAND &rarr; CONSULT &rarr; PRESCRIBE &rarr; PURCHASE &rarr; TRACK &rarr; FOLLOW-UP
            </p>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              No silos, no lost paper documents, no guesswork. Every consultation, prescription, lab test, and vitals reading is securely connected.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
