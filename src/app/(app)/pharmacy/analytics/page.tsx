"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  Package,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Pill,
  Truck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PharmacyAnalyticsPage() {
  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Dispensing Analytics & Performance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Turnaround metrics, prescription fulfillment volume, and patient satisfaction scores.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Average Ready Time</span>
          <p className="text-2xl font-bold text-foreground">22 mins</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">8 mins faster than average</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Monthly Rx Volume</span>
          <p className="text-2xl font-bold text-foreground">428 orders</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">+14% vs last month</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Stock Fill Rate</span>
          <p className="text-2xl font-bold text-foreground">99.4%</p>
          <p className="text-[11px] text-muted-foreground">Zero out-of-stock cancellations</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Courier Delivery</span>
          <p className="text-2xl font-bold text-foreground">1.4 hrs</p>
          <p className="text-[11px] text-muted-foreground">Average doorstep arrival</p>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Dispensed Drugs */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Pill className="h-4 w-4 text-primary" />
            <span>Top Dispensed Medications</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { name: "Vitamin D3 (Cholecalciferol 50,000 IU)", count: "142 fills", share: "33%" },
              { name: "Metformin HCl (500mg Extended Release)", count: "98 fills", share: "23%" },
              { name: "Atorvastatin Calcium (20mg Oral)", count: "74 fills", share: "17%" },
              { name: "Amoxicillin Trihydrate (500mg)", count: "61 fills", share: "14%" },
              { name: "Lisinopril (10mg Oral)", count: "53 fills", share: "13%" },
            ].map((drug, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-foreground font-medium">
                  <span className="truncate pr-2">{drug.name}</span>
                  <span className="font-mono shrink-0">{drug.count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: drug.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Channels */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Fulfillment Channel Split</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">In-Store Pickup & Drive-Thru</p>
                  <p className="text-muted-foreground text-[11px]">278 orders (65%)</p>
                </div>
              </div>
              <span className="font-bold text-sm font-mono text-foreground">65%</span>
            </div>

            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-semibold text-foreground">Doorstep Same-Day Courier</p>
                  <p className="text-muted-foreground text-[11px]">150 orders (35%)</p>
                </div>
              </div>
              <span className="font-bold text-sm font-mono text-foreground">35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
