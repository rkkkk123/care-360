"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { VideoStage } from "@/features/consultation/components/VideoStage";
import { DoctorContextDrawer } from "@/features/consultation/components/DoctorContextDrawer";
import { FinalizeConsultationDialog } from "@/features/consultation/components/FinalizeConsultationDialog";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import {
  Consultation,
  AuthorizedHealthContext,
  ConsultationNotes,
  VideoConnectionState,
} from "@/types/models/consultation";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
  PanelRightOpen,
  PanelRightClose,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const initialDefaultNotes: ConsultationNotes = {
  chiefConcern: "Follow up on recent Comprehensive Metabolic Panel and Vitamin D insufficiency.",
  historyOfPresentIllness: "38-year-old female presents for scheduled follow-up. Reports mild seasonal fatigue over past 8 weeks. No systemic symptoms.",
  observations: "Alert and conversational. Connected vitals show BP 118/76 mmHg, resting HR 68 bpm. BMI normal.",
  assessment: "1. Mild 25-hydroxy Vitamin D insufficiency (24 ng/mL).\n2. Normal metabolic and renal function.\n3. Excellent fasting glycemic control (85 mg/dL).",
  plan: "1. Initiate Vitamin D3 supplementation (2,000 IU daily with meals).\n2. Continue daily balanced aerobic activity.\n3. Repeat metabolic panel and 25-OH Vitamin D in 90 days.",
  followUp: "Routine 3-month follow-up.",
  doctorPrivateNotes: "Patient is highly compliant. Good candidate for continuous wellness tracking.",
  patientVisibleSummary: "We reviewed your recent Comprehensive Metabolic Panel. All metabolic markers are healthy. Vitamin D was mildly low at 24 ng/mL. We agreed on daily Vitamin D3 (2,000 IU) and a 3-month routine re-check.",
  isDraft: true,
};

export default function DoctorConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = (params?.id as string) || "app_1";

  const { updateAppointmentStatus } = useAppointments();

  const [consultation, setConsultation] = React.useState<Consultation | null>(null);
  const [context, setContext] = React.useState<AuthorizedHealthContext | null>(null);
  const [notes, setNotes] = React.useState<ConsultationNotes>(initialDefaultNotes);
  const [isFinalized, setIsFinalized] = React.useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedTime, setLastSavedTime] = React.useState<string | undefined>();
  const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = React.useState(false);
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  const [finalizedSuccessToast, setFinalizedSuccessToast] = React.useState(false);

  // Initialize Consultation and Authorized Context
  React.useEffect(() => {
    async function loadWorkspaceData() {
      try {
        setLoading(true);

        // Notify server doctor has entered
        await fetch(`/api/consultation/${consultationId}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "in_progress" }),
        });

        // 1. Fetch Consultation
        const authRes = await fetch(`/api/consultation/${consultationId}/auth`);
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.consultation) {
            setConsultation(authData.consultation);
            if (authData.consultation.notes) {
              setNotes(authData.consultation.notes);
            }
            if (authData.consultation.isFinalized) {
              setIsFinalized(true);
            }
          }
        }

        // 2. Fetch Authorized Patient Context
        const ctxRes = await fetch(`/api/consultation/${consultationId}/context`);
        if (ctxRes.ok) {
          const ctxData = await ctxRes.json();
          if (ctxData.context) {
            setContext(ctxData.context);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote consultation data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceData();
  }, [consultationId]);

  // Handle Save Notes
  const handleSaveNotes = async (updatedFields: Partial<ConsultationNotes>) => {
    if (isFinalized) return;
    setSaveStatus("saving");

    try {
      const res = await fetch(`/api/consultation/${consultationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveStatus("saved");
        setLastSavedTime(data.savedAt || new Date().toISOString());
        if (data.notes) {
          setNotes(data.notes);
        }
      } else {
        setSaveStatus("error");
      }
    } catch (e) {
      setSaveStatus("error");
    }
  };

  // Handle Finalize Consultation
  const handleConfirmFinalize = async () => {
    if (isFinalizing || isFinalized) return;
    setIsFinalizing(true);

    try {
      const res = await fetch(`/api/consultation/${consultationId}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          patientSummary: notes.patientVisibleSummary,
          medicationRecommendations: [
            {
              name: "Vitamin D3 (Cholecalciferol)",
              dosageRecommendation: "2,000 IU Oral Daily",
              intent: "Correction of mild 25-OH Vitamin D insufficiency",
              clinicianReviewRequired: true,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFinalized(true);
        setIsFinalizeDialogOpen(false);
        setFinalizedSuccessToast(true);

        // Synchronize with client appointments context and timeline
        updateAppointmentStatus(consultationId, "completed", notes.patientVisibleSummary);

        if (data.consultation) {
          setConsultation(data.consultation);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to finalize consultation.");
      }
    } catch (e) {
      console.error("Finalization error:", e);
      alert("Error finalizing consultation.");
    } finally {
      setIsFinalizing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading clinical workspace & authorized records...
        </p>
      </div>
    );
  }

  const patientName = context
    ? `${context.patient.firstName} ${context.patient.lastName}`
    : "Jane Doe";

  return (
    <div className="w-full flex-1 flex flex-col h-[calc(100vh-20px)] py-1">
      {/* Top Clinical Suite Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/80 backdrop-blur-md rounded-2xl mb-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl h-8 px-2 text-xs" asChild>
            <Link href="/doctor/appointments">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Schedule
            </Link>
          </Button>
          <div className="h-4 w-px bg-border/80" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground tracking-tight">
              Dr. Ananya Sharma, MD
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
              Verified Clinician
            </span>
          </div>
        </div>

        {/* Status / Finalized Banner */}
        <div className="flex items-center gap-2">
          {isFinalized ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Consultation Finalized & Locked
            </span>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsFinalizeDialogOpen(true)}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 gap-1.5 shadow-sm"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Finalize Consultation
            </Button>
          )}

          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-1.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-colors ml-2"
            title={isDrawerOpen ? "Collapse records panel" : "Expand records panel"}
          >
            {isDrawerOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>
      </div>

      {finalizedSuccessToast && (
        <div className="mb-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>
              <strong>Consultation Successfully Finalized!</strong> The patient-visible summary has been published to Jane Doe&apos;s health timeline. Private notes remain strictly confidential.
            </span>
          </div>
          <button
            onClick={() => setFinalizedSuccessToast(false)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Layout: Video (Dominant) + Context Drawer */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
        {/* Dominant Left/Main Video Stage */}
        <div className="flex-1 h-full min-h-[420px] flex flex-col">
          <VideoStage
            userRole="doctor"
            localUserName="Dr. Ananya Sharma"
            remoteUserName={patientName}
            remoteSubtext="Patient • Authorized Context Active"
            isDemoMode={true}
            connectionState="connected"
            onLeaveCall={() => router.push("/doctor/appointments")}
            onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            isDrawerOpen={isDrawerOpen}
          />
        </div>

        {/* Right Collapsible Clinical Context Panel */}
        {isDrawerOpen && (
          <div className="w-full lg:w-[440px] xl:w-[480px] h-full flex flex-col rounded-3xl overflow-hidden shadow-xl shrink-0">
            <DoctorContextDrawer
              consultationId={consultationId}
              context={context}
              notes={notes}
              isFinalized={isFinalized}
              onSaveNotes={handleSaveNotes}
              onOpenFinalizeDialog={() => setIsFinalizeDialogOpen(true)}
              saveStatus={saveStatus}
              lastSavedTime={lastSavedTime}
            />
          </div>
        )}
      </div>

      {/* Finalize Dialog */}
      <FinalizeConsultationDialog
        isOpen={isFinalizeDialogOpen}
        onClose={() => setIsFinalizeDialogOpen(false)}
        notes={notes}
        onConfirmFinalize={handleConfirmFinalize}
        isSubmitting={isFinalizing}
      />
    </div>
  );
}
