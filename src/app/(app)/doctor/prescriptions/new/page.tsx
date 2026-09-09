"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Pill,
  ArrowLeft,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/motion/FadeIn";
import { medicineCatalog } from "@/lib/pharmacy/pharmacy-store";
import { PrescriptionItem, MedicationForm } from "@/types/models/prescription";

function NewPrescriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultationId") || "app_1";

  const [patientName, setPatientName] = React.useState("Jane Doe");
  const [patientId, setPatientId] = React.useState("pat_123");
  const [clinicalDiagnosis, setClinicalDiagnosis] = React.useState("Hypovitaminosis D (ICD-10: E55.9)");
  const [doctorNotes, setDoctorNotes] = React.useState(
    "Prescribed following clinical consultation review of Comprehensive Metabolic Panel. Monitor 25-OH Vitamin D level in 90 days."
  );

  // Selected Items to Prescribe
  const [items, setItems] = React.useState<Array<Omit<PrescriptionItem, "id">>>([
    {
      medicineId: "med_vitd3_50k",
      name: "Vitamin D3 (Cholecalciferol)",
      dosage: "50,000 IU",
      strength: "50,000 IU",
      form: "capsule",
      quantity: 12,
      refills: 3,
      instructions: "Take 1 capsule orally once weekly with dietary fat for 12 weeks.",
      indication: "Hypovitaminosis D (25-OH Vitamin D 24 ng/mL)",
      substitutionAllowed: false,
    },
  ]);

  const [catalogSearch, setCatalogSearch] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const filteredCatalog = medicineCatalog.filter((med) =>
    med.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    med.genericName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    med.therapeuticClass.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const handleAddMedicine = (med: (typeof medicineCatalog)[0]) => {
    setItems((prev) => [
      ...prev,
      {
        medicineId: med.id,
        name: med.name,
        dosage: med.strength,
        strength: med.strength,
        form: (med.form.toLowerCase() as MedicationForm) || "capsule",
        quantity: med.packageSize || 30,
        refills: 1,
        instructions: `Take 1 ${med.form} daily as directed.`,
        indication: clinicalDiagnosis || "Clinical Care Plan",
        substitutionAllowed: true,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleIssuePrescription = async () => {
    if (items.length === 0) {
      setErrorMessage("At least one medication is required to issue a prescription.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: consultationId,
          consultationId,
          patientId,
          patientName,
          clinicalDiagnosis,
          doctorNotes,
          items,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.prescription?.id) {
          router.push(`/doctor/prescriptions/${data.prescription.id}`);
        } else {
          router.push("/doctor/prescriptions");
        }
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to issue prescription.");
      }
    } catch (e: any) {
      setErrorMessage("Network error while issuing prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="rounded-xl h-8 px-2 text-xs" asChild>
            <Link href="/doctor/prescriptions">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              All Prescriptions
            </Link>
          </Button>
          <span className="text-xs text-muted-foreground font-mono">
            Attending: Dr. Ananya Sharma, MD • CA-MED-491028
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Issue Digital Prescription
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create an immutable e-prescription compliant with NCPDP standards and connect directly to the verified pharmacy network.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Patient & Consultation Meta Card */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Patient & Clinical Indication
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-medium">Patient</label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="rounded-xl bg-background text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-medium">Clinical Diagnosis / Indication</label>
              <Input
                value={clinicalDiagnosis}
                onChange={(e) => setClinicalDiagnosis(e.target.value)}
                className="rounded-xl bg-background text-xs"
                placeholder="e.g. Hypovitaminosis D (ICD-10: E55.9)"
              />
            </div>
          </div>
        </div>

        {/* Controlled Catalog Search Drawer */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Prescribed Medications ({items.length})
              </h3>
              <p className="text-xs text-muted-foreground">Select from verified national drug catalog</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search drug catalog..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="text-xs pl-9 h-8 rounded-xl bg-background"
              />
            </div>
          </div>

          {/* Catalog Quick Pills */}
          {catalogSearch.trim() && (
            <div className="p-3 rounded-2xl bg-secondary/30 border border-border space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Catalog Matches:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredCatalog.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => handleAddMedicine(med)}
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary/60 text-left transition-all text-xs flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-foreground block">{med.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {med.strength} • NDC: {med.ndc} • {med.schedule}
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Items Form */}
          <div className="space-y-4 pt-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-secondary/20 border border-border/80 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{item.name}</span>
                    <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {item.strength}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-7 px-2 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-semibold">Quantity</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(idx, "quantity", Number(e.target.value))}
                      className="rounded-xl bg-background text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-semibold">Refills Allowed</label>
                    <Input
                      type="number"
                      value={item.refills}
                      onChange={(e) => handleUpdateItem(idx, "refills", Number(e.target.value))}
                      className="rounded-xl bg-background text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-semibold">Form</label>
                    <Input
                      value={item.form}
                      onChange={(e) => handleUpdateItem(idx, "form", e.target.value)}
                      className="rounded-xl bg-background text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-semibold">DAW (Dispense as Written)</label>
                    <select
                      value={item.substitutionAllowed ? "yes" : "no"}
                      onChange={(e) =>
                        handleUpdateItem(idx, "substitutionAllowed", e.target.value === "yes")
                      }
                      className="w-full rounded-xl bg-background border border-border text-xs h-8 px-2 text-foreground"
                    >
                      <option value="no">Dispense as Written (No Sub)</option>
                      <option value="yes">Generic Substitution Allowed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Sig / Patient Instructions
                  </label>
                  <Input
                    value={item.instructions}
                    onChange={(e) => handleUpdateItem(idx, "instructions", e.target.value)}
                    className="rounded-xl bg-background text-xs"
                    placeholder="e.g. Take 1 capsule weekly with meals"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Instructions & Notice */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-sm text-xs">
          <label className="text-sm font-semibold text-foreground uppercase tracking-wider block">
            Physician Consultation Notes & Care Guidance
          </label>
          <textarea
            rows={2}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full rounded-2xl bg-background border border-border p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Clinical guidance, dietary instructions, repeat lab testing schedule..."
          />
        </div>

        {/* Action Button */}
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              Once issued, this prescription is immutable and verifiable across all CARE360 network pharmacies.
            </span>
          </div>

          <Button
            size="lg"
            onClick={handleIssuePrescription}
            disabled={isSubmitting || items.length === 0}
            className="rounded-full px-8 shadow-lg shadow-primary/25 gap-2 shrink-0 w-full sm:w-auto"
          >
            <FileCheck className="w-4 h-4" />
            {isSubmitting ? "Signing & Issuing..." : "Sign & Issue Prescription"}
          </Button>
        </div>
      </div>
    </FadeIn>
  );
}

export default function NewPrescriptionPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Loading prescription authoring workspace...</div>}>
      <NewPrescriptionContent />
    </React.Suspense>
  );
}
