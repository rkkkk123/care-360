"use client";

import * as React from "react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIDoctorRecommendationBannerProps {
  onFilterAIMatches: () => void;
  isFilteredToAI: boolean;
  onResetFilter: () => void;
}

export function AIDoctorRecommendationBanner({
  onFilterAIMatches,
  isFilteredToAI,
  onResetFilter,
}: AIDoctorRecommendationBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-background p-6 sm:p-8 shadow-sm">
      {/* Decorative ambient blur */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Health Context Match</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-foreground">
            Specialists matched to your <span className="font-medium text-primary">Metabolic Panel</span>
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            CARE360 AI analyzed your recent lab results (<span className="text-foreground font-medium">Vitamin D: 24 ng/mL</span>, <span className="text-foreground font-medium">Lipid profile</span>). We recommend consulting an <span className="text-foreground font-medium">Internal Medicine</span> or <span className="text-foreground font-medium">Endocrinology</span> specialist to calibrate optimal supplementation and longitudinal monitoring.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              100% Board-Certified & Verified
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Direct access to lab history
            </span>
            <span className="text-border">•</span>
            <span>Zero redundant paperwork</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Button
            onClick={isFilteredToAI ? onResetFilter : onFilterAIMatches}
            className={`rounded-full group shadow-sm transition-all ${
              isFilteredToAI
                ? "bg-secondary text-foreground hover:bg-secondary/80"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isFilteredToAI ? "Showing AI Matches (Clear Filter)" : "Filter by AI Recommendations"}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          {isFilteredToAI && (
            <p className="text-xs text-center text-muted-foreground">
              Showing specialists matching your specific biomarkers
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
