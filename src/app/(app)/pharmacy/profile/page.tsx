"use client";

import * as React from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PharmacyProfilePage() {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
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
          Pharmacy Profile & Operating Parameters
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Public directory presentation, fulfillment capabilities, and state regulatory license records.
        </p>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Walgreens Digital Care #4190</h3>
              <p className="text-xs text-muted-foreground">Palo Alto Network Hub</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified License
          </span>
        </div>

        {/* Regulatory License Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 space-y-1">
            <span className="text-muted-foreground">California State Board License</span>
            <p className="font-mono font-bold text-foreground text-sm">CA-PHY-99214</p>
            <p className="text-[11px] text-muted-foreground">Expiration: Dec 31, 2027 • Verified by Admin</p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 space-y-1">
            <span className="text-muted-foreground">NABP / NCPDP Identifier</span>
            <p className="font-mono font-bold text-foreground text-sm">0582910</p>
            <p className="text-[11px] text-muted-foreground">Active for electronic e-prescriptions</p>
          </div>
        </div>

        {/* Location & Hours Fields */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-muted-foreground font-medium mb-1">Street Address</label>
            <input
              type="text"
              defaultValue="859 El Camino Real"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">City</label>
              <input
                type="text"
                defaultValue="Palo Alto"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground font-medium mb-1">State</label>
              <input
                type="text"
                defaultValue="CA"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                defaultValue="94301"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Phone Number</label>
              <input
                type="text"
                defaultValue="(650) 326-3876"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="paloalto4190@care360.health"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Operating Hours</label>
            <input
              type="text"
              defaultValue="Open 24 Hours • Drive-Thru Available"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Courier Delivery Fee ($)</label>
            <input
              type="number"
              step="0.01"
              defaultValue="4.99"
              className="w-36 rounded-xl border border-border bg-card px-3 py-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="rounded-full text-xs bg-primary shadow-md shadow-primary/20"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Profile Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
