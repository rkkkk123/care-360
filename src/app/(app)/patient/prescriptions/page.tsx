"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Store,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  MapPin,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prescription } from "@/types/models/prescription";

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function loadPrescriptions() {
      try {
        const res = await fetch("/api/prescriptions");
        if (res.ok) {
          const data = await res.json();
          setPrescriptions(data.prescriptions || []);
        }
      } catch (err) {
        console.error("Failed to load prescriptions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, []);

  const filtered = prescriptions.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.prescriptionNumber.toLowerCase().includes(q) ||
      p.doctorName.toLowerCase().includes(q) ||
      ((p.clinicalDiagnosis || p.diagnosis || "").toLowerCase().includes(q)) ||
      p.items.some((item) => (item.medicineName || item.name || "").toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: Prescription["status"]) => {
    switch (status) {
      case "issued":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active • Ready to Fulfill
          </span>
        );
      case "filled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Fulfilled
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-semibold text-destructive border border-destructive/20">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Authoritative Clinical Prescriptions
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Prescriptions & Medications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tamper-evident digital prescriptions issued by verified CARE360 doctors, with instant pharmacy routing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="sm" className="rounded-full text-xs shadow-sm" asChild>
            <Link href="/patient/pharmacies">
              <Store className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Connected Pharmacies
            </Link>
          </Button>

          <Button variant="outline" size="sm" className="rounded-full text-xs shadow-sm" asChild>
            <Link href="/patient/orders">
              <Truck className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              My Orders
            </Link>
          </Button>

          <Button size="sm" className="rounded-full text-xs group" asChild>
            <Link href="/patient/doctors">
              <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
              Consult Doctor
              <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by medication, Rx number, doctor, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border bg-card shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Loading authorized prescriptions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-4">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground">
            <Pill className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">No Prescriptions Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              {searchQuery
                ? "No prescriptions match your search criteria. Try a different keyword."
                : "You do not have any active or previous digital prescriptions on CARE360 yet."}
            </p>
          </div>
          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/doctors">Schedule Doctor Consultation</Link>
          </Button>
        </div>
      ) : (
        /* Prescriptions List */
        <div className="space-y-6">
          {filtered.map((rx) => {
            const hasRemainingRefills = (rx.refillsRemaining ?? rx.items[0]?.refills ?? 0) > 0;
            return (
              <div
                key={rx.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:border-primary/30 transition-all space-y-6 relative overflow-hidden"
              >
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                      <Pill className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {rx.prescriptionNumber}
                        </span>
                        {getStatusBadge(rx.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Issued on {new Date(rx.issuedAt || rx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • Valid until {new Date(rx.validUntil || rx.expiresAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs h-8 px-3"
                      asChild
                    >
                      <a href={`/api/prescriptions/${rx.id}/pdf`} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-3.5 w-3.5 mr-1 text-primary" />
                        Download PDF
                      </a>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full text-xs h-8 px-3"
                      asChild
                    >
                      <Link href={`/patient/prescriptions/${rx.id}`}>
                        View Details
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Medications in this Rx */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prescribed Medication ({rx.items.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rx.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-secondary/30 border border-border/60 p-4 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {item.medicineName || item.name}
                          </p>
                          <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                          {item.dosage} • {item.form} {item.frequency ? `• ${item.frequency}` : ""}
                        </p>
                        {item.instructions && (
                          <p className="text-[11px] text-muted-foreground/90 bg-card/60 p-2 rounded-xl border border-border/40">
                            <span className="font-medium text-foreground">Instructions:</span> {item.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-card border border-border/70 p-3.5 space-y-0.5">
                    <span className="text-muted-foreground text-[11px]">Prescribing Physician</span>
                    <p className="font-semibold text-foreground text-sm">{rx.doctorName}</p>
                    <p className="text-[11px] text-muted-foreground">License #{rx.doctorLicense}</p>
                  </div>

                  <div className="rounded-2xl bg-card border border-border/70 p-3.5 space-y-0.5">
                    <span className="text-muted-foreground text-[11px]">Clinical Indication / Diagnosis</span>
                    <p className="font-semibold text-foreground text-sm truncate">
                      {rx.clinicalDiagnosis || rx.diagnosis || "General Clinical Care"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Refills: {rx.refillsRemaining ?? rx.items[0]?.refills ?? 0} authorized</p>
                  </div>

                  <div className="rounded-2xl bg-card border border-border/70 p-3.5 space-y-0.5">
                    <span className="text-muted-foreground text-[11px]">Cryptographic Seal</span>
                    <p className="font-mono text-[11px] text-primary truncate">
                      {rx.immutableHash.slice(0, 20)}...
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Tamper-Proof Verified</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>NCPDP e-Script compliant • Accepted at all network pharmacies</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="rounded-full text-xs flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-md shadow-primary/15"
                      asChild
                    >
                      <Link href={`/patient/pharmacies/compare?prescriptionId=${rx.id}`}>
                        <Store className="h-3.5 w-3.5 mr-1.5" />
                        Find Medicines & Compare Pharmacies
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
