"use client";

import * as React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationNotes } from "@/types/models/consultation";

interface FinalizeConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notes: ConsultationNotes;
  onConfirmFinalize: () => Promise<void>;
  isSubmitting: boolean;
}

export function FinalizeConsultationDialog({
  isOpen,
  onClose,
  notes,
  onConfirmFinalize,
  isSubmitting,
}: FinalizeConsultationDialogProps) {
  if (!isOpen) return null;

  const hasAssessment = !!notes.assessment?.trim();
  const hasPlan = !!notes.plan?.trim();
  const hasPatientSummary = !!notes.patientVisibleSummary?.trim();
  const canFinalize = hasAssessment && hasPlan && hasPatientSummary && !isSubmitting;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-card-foreground space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">Finalize Clinical Consultation</h3>
            <p className="text-xs text-muted-foreground">
              Verify documentation before publishing and locking records.
            </p>
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground">Clinical Assessment recorded</span>
            {hasAssessment ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <span className="text-destructive text-[11px] font-medium">Missing</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground">Management Plan recorded</span>
            {hasPlan ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <span className="text-destructive text-[11px] font-medium">Missing</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground">Patient-Visible Summary authored</span>
            {hasPatientSummary ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <span className="text-destructive text-[11px] font-medium">Missing</span>
            )}
          </div>
        </div>

        {/* Preview of Patient Summary */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
            <Eye className="w-3.5 h-3.5" />
            <span>Summary Shared with Patient:</span>
          </div>
          <p className="text-muted-foreground leading-relaxed italic bg-background/60 p-2.5 rounded-xl border border-border/40">
            {notes.patientVisibleSummary || "No patient summary authored yet."}
          </p>
        </div>

        {/* Phase 7 Prescription-Ready Notice */}
        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground flex items-center gap-2.5">
          <Pill className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Prescription-Ready Contract:</strong> Vitamin D3 recommendation structured for Phase 7 connected pharmacy linkage.
          </span>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            Once finalized, consultation notes become permanent and read-only. Private notes remain strictly confidential.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-xs"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel & Return
          </Button>
          <Button
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-md"
            onClick={onConfirmFinalize}
            disabled={!canFinalize}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Finalizing...
              </>
            ) : (
              <>
                <FileCheck className="w-3.5 h-3.5" />
                Confirm & Finalize
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
