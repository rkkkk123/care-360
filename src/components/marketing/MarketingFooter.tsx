"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Heart, 
  Globe, 
  Lock,
  ArrowUpRight
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-[#FAFAFC] text-foreground">
      {/* Upper Navigation Grid Section with clean light Apple canvas */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-20 sm:pb-14 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-border/70">
          {/* Column 1: Care Continuum */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Care Continuum
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/patient/ai/scanner" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Patient Input & Scanner
                </Link>
              </li>
              <li>
                <Link href="/patient/reports" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  AI Report Analysis & OCR
                </Link>
              </li>
              <li>
                <Link href="/patient/doctors" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Find & Choose Doctor
                </Link>
              </li>
              <li>
                <Link href="/patient/appointments" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Book Consultations
                </Link>
              </li>
              <li>
                <Link href="/patient/prescriptions" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Digital Prescriptions (e-Rx)
                </Link>
              </li>
              <li>
                <Link href="/patient/pharmacies" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Buy Medicines & Stock
                </Link>
              </li>
              <li>
                <Link href="/patient/timeline" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Health Timeline & Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Ecosystem Portals */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Ecosystem Portals
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/patient" className="hover:text-primary transition-colors font-semibold text-foreground">
                  Patient Portal (Jane Doe)
                </Link>
              </li>
              <li>
                <Link href="/doctor" className="hover:text-primary transition-colors font-semibold text-foreground">
                  Doctor Portal (Dr. Sharma)
                </Link>
              </li>
              <li>
                <Link href="/pharmacy" className="hover:text-primary transition-colors font-semibold text-foreground">
                  Pharmacy Portal (Walgreens)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors font-semibold text-foreground">
                  Admin Portal (Governance)
                </Link>
              </li>
              <li>
                <Link href="/patient/emergency" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Rapid SOS Emergency Hub
                </Link>
              </li>
              <li>
                <Link href="/patient/home-visit" className="hover:text-primary transition-colors">
                  Home Healthcare Visits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: AI Intelligence */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              AI Intelligence Suite
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/patient/ai/scanner" className="hover:text-primary transition-colors">
                  Medicine & Pill Scanner
                </Link>
              </li>
              <li>
                <Link href="/patient/ai/scanner" className="hover:text-primary transition-colors">
                  Ayurvedic Leaf & Plant Vision
                </Link>
              </li>
              <li>
                <Link href="/patient/ai/scanner" className="hover:text-primary transition-colors">
                  Dermatology Skin Image AI
                </Link>
              </li>
              <li>
                <Link href="/patient/ai" className="hover:text-primary transition-colors">
                  Bilingual Voice Assistant (AI)
                </Link>
              </li>
              <li>
                <Link href="/patient/health/trends" className="hover:text-primary transition-colors">
                  Biomarker Trends (HbA1c, BP)
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-primary transition-colors">
                  Gemini Clinical Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Trust */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Safety & Governance
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/trust" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  HIPAA & 256-Bit Encryption
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-blue-600" />
                  Universal Accessibility
                </Link>
              </li>
              <li>
                <Link href="/admin/verifications" className="hover:text-primary transition-colors">
                  Medical Board Provider Audits
                </Link>
              </li>
              <li>
                <Link href="/admin/verifications/pharmacies" className="hover:text-primary transition-colors">
                  State Pharmacy Board Licenses
                </Link>
              </li>
              <li>
                <Link href="/admin/complaints" className="hover:text-primary transition-colors">
                  Patient Safety Grievances
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 
        Full Visual Heritage Artwork
      */}
      <div className="w-full relative bg-background/50 border-t border-border/50">
        <img
          src="/footer-heritage.jpg"
          alt="CARE360 Bharat Heritage Artwork"
          className="w-full h-auto max-h-[400px] object-contain object-bottom filter saturate-110"
        />
      </div>

      {/* 
        Bottom Copyright & Quick Links Bar
      */}
      <div className="relative border-t border-border/80 bg-secondary/30">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 sm:py-7 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left: Logo & Slogan */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Logo size="sm" />
            </Link>
            <div className="hidden sm:block h-4 w-px bg-border/80" />
            <p className="text-xs text-foreground/90 font-medium tracking-tight">
              &ldquo;Care Beyond Hospitals&rdquo; &mdash; Your Health | Our Technology | A Healthier Tomorrow
            </p>
          </div>

          {/* Right: Copyright & Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs text-foreground/80 font-medium">
            <span>&copy; {new Date().getFullYear()} CARE360 Health Ecosystem.</span>
            <Link href="/trust" className="hover:text-primary transition-colors">
              Privacy &amp; Trust
            </Link>
            <Link href="/trust" className="hover:text-primary transition-colors">
              Terms of Care
            </Link>
            <Link href="/accessibility" className="hover:text-primary transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
