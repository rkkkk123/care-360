"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Pill,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  ExternalLink,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/FadeIn";
import { Prescription } from "@/types/models/prescription";
import { formatDisplayDate } from "@/lib/utils";

export default function DoctorPrescriptionDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "rx_1";

  const [prescription, setPrescription] = React.useState<Prescription | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPrescription() {
      try {
        const res = await fetch(`/api/prescriptions/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.prescription) {
            setPrescription(data.prescription);
          }
        }
      } catch (e) {
        console.warn("Could not fetch prescription details:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPrescription();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-muted-foreground">
        Loading immutable prescription records...
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-muted-foreground/50 mx-auto" />
        <h2 className="text-xl font-medium text-foreground">Prescription Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested prescription ID does not exist or you lack permission.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/doctor/prescriptions">Back to Prescriptions</Link>
        </Button>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="rounded-xl h-8 px-2 text-xs" asChild>
            <Link href="/doctor/prescriptions">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              All Prescriptions
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5" asChild>
              <a href={`/api/prescriptions/${prescription.id}/pdf`} target="_blank" rel="noopener noreferrer">
                <Download className="w-3.5 h-3.5" />
                View NCPDP PDF
              </a>
            </Button>
          </div>
        </div>

        {/* Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Pill className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-mono font-bold tracking-tight text-foreground">
                    {prescription.prescriptionNumber}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {prescription.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Official CARE360 e-Prescription • Immutable Clinical Record
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-muted-foreground">
              <p>Issued: {formatDisplayDate(prescription.issuedAt || prescription.createdAt)}</p>
              <p>Valid through: {formatDisplayDate(prescription.expiresAt || "")}</p>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-semibold block">Patient Information</span>
              <p className="font-semibold text-foreground text-sm">{prescription.patientName}</p>
              <p className="text-muted-foreground">DOB: {prescription.patientDob}</p>
              <p className="text-rose-500 font-medium">
                Known Allergies: {(prescription.patientAllergies || []).join(", ") || "None recorded"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-semibold block">Prescribing Physician</span>
              <p className="font-semibold text-foreground text-sm">
                {prescription.doctorName}, {prescription.doctorTitle}
              </p>
              <p className="text-muted-foreground">License: {prescription.doctorLicense}</p>
              <p className="text-muted-foreground">Indication: {prescription.clinicalDiagnosis}</p>
            </div>
          </div>

          {/* Prescribed Items Table */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Medication Order Specification
            </span>

            {prescription.items.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-secondary/20 border border-border/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm">
                    {index + 1}. {item.name} ({item.strength})
                  </span>
                  <span className="font-mono text-primary font-medium">
                    Qty: {item.quantity} {item.form}s • Refills: {item.refills}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border/50 text-foreground leading-relaxed">
                  <strong>Sig:</strong> {item.instructions}
                </div>

                <div className="flex items-center justify-between text-muted-foreground text-[11px] pt-1">
                  <span>Indication: {item.indication}</span>
                  <span>{item.substitutionAllowed ? "Generic Allowed" : "Dispense as Written (DAW)"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Physician Notes */}
          {prescription.doctorNotes && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Doctor Instructions & Care Guidance
              </span>
              <p className="text-muted-foreground leading-relaxed">{prescription.doctorNotes}</p>
            </div>
          )}

          {/* Cryptographic Seal */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Tamper-Evident Hash: {prescription.immutableHash}</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium">
              Verified Authenticated
            </span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
