"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorReviewsPage() {
  const reviews = [
    {
      id: "rev_1",
      patientName: "Jane D.",
      date: "March 5, 2026",
      rating: 5,
      consultationType: "Telehealth Video Consultation",
      tag: "Metabolic & Vitamin D Evaluation",
      comment:
        "Dr. Sharma was exceptionally thorough. She explained my 25-OH Vitamin D deficit in clear, actionable terms, calibrated the exact prescription dose, and routed it to my local Walgreens immediately. The consultation felt attentive and reassuring.",
    },
    {
      id: "rev_2",
      patientName: "Robert K.",
      date: "February 22, 2026",
      rating: 5,
      consultationType: "Annual Preventive Care Review",
      tag: "Lipid Panel & Cholesterol",
      comment:
        "Outstanding clinical insight. She reviewed my longitudinal cardiovascular trends and adjusted my regimen without rushing. The post-consultation summary appeared in my health timeline within minutes.",
    },
    {
      id: "rev_3",
      patientName: "Sunita M.",
      date: "February 14, 2026",
      rating: 5,
      consultationType: "Endocrine & Metabolic Health",
      tag: "HbA1c Glycemic Optimization",
      comment:
        "Dr. Sharma took the time to listen to my lifestyle factors before prescribing. Very knowledgeable in holistic preventive medicine combined with modern pharmacology.",
    },
    {
      id: "rev_4",
      patientName: "David S.",
      date: "January 28, 2026",
      rating: 4,
      consultationType: "Follow-up Consultation",
      tag: "Blood Pressure Monitoring",
      comment:
        "Punctual and very polite doctor. Clear next steps and great prescription follow-up service.",
    },
  ];

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <Link
          href="/doctor"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Patient Ratings & Clinical Reviews
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verified patient feedback from completed CARE360 consultations.
        </p>
      </div>

      {/* Aggregate Score Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center sm:text-left">
            <span className="text-5xl font-light tracking-tight text-foreground">4.94</span>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on 186 verified reviews</p>
          </div>

          <div className="hidden sm:block h-16 w-px bg-border" />

          {/* Star Distribution */}
          <div className="space-y-1.5 text-xs text-muted-foreground w-48">
            <div className="flex items-center gap-2">
              <span>5 ★</span>
              <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "94%" }} />
              </div>
              <span className="text-[10px] font-mono">94%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>4 ★</span>
              <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "5%" }} />
              </div>
              <span className="text-[10px] font-mono">5%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>3 ★</span>
              <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "1%" }} />
              </div>
              <span className="text-[10px] font-mono">1%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-primary/5 p-4 border border-primary/20 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-primary font-semibold">
            <Award className="h-4 w-4" />
            <span>Top Tier Care Provider</span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            In top 2% of internal medicine specialists on CARE360 for patient satisfaction.
          </p>
        </div>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Verified Reviews ({reviews.length})
        </h3>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-secondary text-primary font-semibold flex items-center justify-center text-xs">
                    {rev.patientName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">{rev.patientName}</p>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Verified Patient
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>

              <div className="inline-block rounded-lg bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground">
                {rev.tag} • {rev.consultationType}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
