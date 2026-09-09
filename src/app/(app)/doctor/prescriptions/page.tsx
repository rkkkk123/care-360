"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pill,
  Plus,
  Search,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowRight,
  User,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/motion/FadeIn";
import { Prescription } from "@/types/models/prescription";
import { formatDisplayDate } from "@/lib/utils";

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function loadPrescriptions() {
      try {
        const res = await fetch("/api/prescriptions");
        if (res.ok) {
          const data = await res.json();
          if (data.prescriptions) {
            setPrescriptions(data.prescriptions);
          }
        }
      } catch (e) {
        console.warn("Could not load prescriptions:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, []);

  const filtered = prescriptions.filter(
    (rx) =>
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Prescription Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Issue and track authenticated digital prescriptions connected to verified pharmacies.
            </p>
          </div>

          <Button className="rounded-full shadow-sm text-xs gap-1.5" asChild>
            <Link href="/doctor/prescriptions/new">
              <Plus className="w-3.5 h-3.5" />
              Issue New Prescription
            </Link>
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Prescriptions: {prescriptions.length}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Rx#, patient, or medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-9 h-9 rounded-xl bg-background"
            />
          </div>
        </div>

        {/* Prescriptions Table / Cards */}
        <div className="space-y-4">
          {filtered.map((rx) => (
            <div
              key={rx.id}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-border/80"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Pill className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded-lg border border-border">
                      {rx.prescriptionNumber}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Patient: {rx.patientName}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        rx.status === "issued"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>

                  <div className="text-xs text-foreground font-medium">
                    {rx.items.map((item, idx) => (
                      <span key={idx} className="mr-2">
                        {item.name} ({item.strength}) • Qty: {item.quantity} • Refills: {item.refills}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Issued {formatDisplayDate(rx.issuedAt || rx.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Indication: {rx.clinicalDiagnosis}
                    </span>
                    {rx.fulfillmentPharmacyName && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Fulfillment: {rx.fulfillmentPharmacyName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
                  <a href={`/api/prescriptions/${rx.id}/pdf`} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Print PDF
                  </a>
                </Button>

                <Button size="sm" className="rounded-full text-xs" asChild>
                  <Link href={`/doctor/prescriptions/${rx.id}`}>
                    Inspect Prescription
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No prescriptions found.
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
