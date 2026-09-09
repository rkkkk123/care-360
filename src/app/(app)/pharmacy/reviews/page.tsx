"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  Store,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PharmacyReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  orderType: "Pickup" | "Courier Delivery";
  comment: string;
  verified: boolean;
  dispensedMedications: string[];
}

const mockPharmacyReviews: PharmacyReview[] = [
  {
    id: "rev-1",
    patientName: "Jane Doe",
    rating: 5,
    date: "2 days ago",
    orderType: "Courier Delivery",
    comment:
      "Arrived in under 45 minutes! The pharmacist even included a printed medication schedule and verified there were no interactions with my supplements. Outstanding service.",
    verified: true,
    dispensedMedications: ["Metformin 500mg", "Lisinopril 10mg"],
  },
  {
    id: "rev-2",
    patientName: "David K.",
    rating: 5,
    date: "1 week ago",
    orderType: "Pickup",
    comment:
      "Seamless pickup. My doctor sent the digital prescription during our telehealth call, and by the time I drove over, the prescription was packed and waiting with zero wait time.",
    verified: true,
    dispensedMedications: ["Atorvastatin 20mg"],
  },
  {
    id: "rev-3",
    patientName: "Maria G.",
    rating: 4,
    date: "2 weeks ago",
    orderType: "Courier Delivery",
    comment:
      "Very fast courier delivery. The cold pack packaging for my temperature-sensitive eye drops was completely intact. Will order all my refills here.",
    verified: true,
    dispensedMedications: ["Olopatadine Ophthalmic Solution"],
  },
];

export default function PharmacyReviewsPage() {
  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pharmacy Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              Verified Patient Feedback
            </div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Customer Ratings & Dispensing Reviews
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct reviews from verified patients who received prescriptions fulfilled by your pharmacy.
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Rating Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overall Patient Rating
          </span>
          <div className="text-5xl font-light text-foreground tracking-tight flex items-baseline gap-1">
            4.9 <span className="text-base text-muted-foreground font-normal">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Based on 148 verified fulfillments</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fulfillment Benchmarks
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Dispensing Accuracy</span>
              <span className="font-semibold text-foreground">100%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full rounded-full" />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-muted-foreground">Courier On-Time Delivery</span>
              <span className="font-semibold text-foreground">98.4%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[98.4%] rounded-full" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-center space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Community Care Badge</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your pharmacy is in the top 5% of Northern California network pharmacies for rapid fulfillment and patient satisfaction.
          </p>
          <div className="pt-2">
            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold border border-primary/20">
              Top Rated Partner
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Recent Verified Reviews</h3>

        <div className="space-y-3">
          {mockPharmacyReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{review.patientName}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Patient
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">• {review.orderType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {review.dispensedMedications.map((med, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-secondary/60 text-muted-foreground px-2.5 py-0.5 rounded-full border border-border/40"
                  >
                    {med}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
