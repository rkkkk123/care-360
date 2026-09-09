"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pill,
  ShieldCheck,
  FileText,
  Store,
  Stethoscope,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prescription } from "@/types/models/prescription";

export default function PatientPrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params?.id as string;

  const [prescription, setPrescription] = React.useState<Prescription | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPrescription() {
      try {
        const res = await fetch(`/api/prescriptions/${prescriptionId}`);
        if (!res.ok) {
          throw new Error("Failed to load prescription or access denied.");
        }
        const data = await res.json();
        setPrescription(data.prescription);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    if (prescriptionId) {
      loadPrescription();
    }
  }, [prescriptionId]);

  if (loading) {
    return (
      <div className="py-16 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Verifying and retrieving prescription records...</p>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-medium text-foreground">Prescription Not Found</h2>
        <p className="text-sm text-muted-foreground">{error || "Could not find the requested prescription."}</p>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push("/patient/prescriptions")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Prescriptions
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/patient/prescriptions"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prescriptions
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <a href={`/api/prescriptions/${prescription.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Download Official PDF
            </a>
          </Button>

          <Button size="sm" className="rounded-full text-xs shadow-md shadow-primary/20" asChild>
            <Link href={`/patient/pharmacies/compare?prescriptionId=${prescription.id}`}>
              <Store className="h-3.5 w-3.5 mr-1.5" />
              Find Pharmacies & Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Prescription Paper Document Style */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg relative overflow-hidden space-y-8">
        {/* Top Watermark / Security Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold tracking-tight text-foreground">
                {prescription.prescriptionNumber}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {prescription.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Official Electronic Medical Prescription • CARE360 Connected Care Network
            </p>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div className="text-left sm:text-right text-xs">
              <p className="font-semibold text-foreground">Cryptographically Sealed</p>
              <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[180px]">
                {prescription.immutableHash.slice(0, 18)}...
              </p>
            </div>
          </div>
        </div>

        {/* Doctor & Patient Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Info */}
          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <Stethoscope className="h-3.5 w-3.5" />
              Prescribing Physician
            </div>
            <p className="text-base font-semibold text-foreground">{prescription.doctorName}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Medical License: <span className="font-mono text-foreground">{prescription.doctorLicense}</span></p>
              <p>NPI Registry: <span className="font-mono text-foreground">{prescription.doctorNpi}</span></p>
              <p>Clinic: CARE360 Telehealth Clinical Practice</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <User className="h-3.5 w-3.5" />
              Patient Information
            </div>
            <p className="text-base font-semibold text-foreground">{prescription.patientName}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Patient ID: <span className="font-mono text-foreground">{prescription.patientId}</span></p>
              <p>Clinical Diagnosis: <span className="font-medium text-foreground">{prescription.clinicalDiagnosis || prescription.diagnosis || "General Clinical Evaluation"}</span></p>
              <p>Issued Date: <span className="text-foreground">{new Date(prescription.issuedAt || prescription.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</span></p>
            </div>
          </div>
        </div>

        {/* Prescription Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Prescribed Medications ({prescription.items.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              Valid until: {new Date(prescription.validUntil || prescription.expiresAt || Date.now()).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </span>
          </div>

          <div className="space-y-4">
            {prescription.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card/80 p-5 space-y-4 hover:border-primary/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-foreground">
                        {item.medicineName}
                      </h4>
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {item.form}
                      </span>
                    </div>
                    {item.genericName && (
                      <p className="text-xs text-muted-foreground">Generic: {item.genericName}</p>
                    )}
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-muted-foreground">Dispense Quantity:</span>
                    <p className="font-mono font-bold text-foreground text-sm">{item.quantity} units</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Strength</span>
                    <span className="font-medium text-foreground">{item.dosage}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Route</span>
                    <span className="font-medium text-foreground capitalize">{item.route}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Frequency</span>
                    <span className="font-medium text-foreground">{item.frequency}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Duration</span>
                    <span className="font-medium text-foreground">{item.duration}</span>
                  </div>
                </div>

                {item.instructions && (
                  <div className="rounded-xl bg-secondary/40 p-3 text-xs space-y-1">
                    <span className="font-semibold text-foreground">Patient Instructions:</span>
                    <p className="text-muted-foreground">{item.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Refills & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-border">
          <div className="space-y-1">
            <span className="text-muted-foreground">Authorized Refills</span>
            <p className="font-semibold text-foreground text-sm">
              {prescription.refillsRemaining} remaining of {prescription.refillsAllowed} authorized
            </p>
          </div>
          {prescription.notes && (
            <div className="space-y-1">
              <span className="text-muted-foreground">Physician Notes</span>
              <p className="text-foreground">{prescription.notes}</p>
            </div>
          )}
        </div>

        {/* Security Audit Badge */}
        <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Tamper-Evident SHA-256 Audit Seal: <code className="font-mono text-foreground text-[11px]">{prescription.immutableHash}</code>
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground shrink-0">
            Compliant with SCRIPT v2017071
          </span>
        </div>
      </div>
    </div>
  );
}
