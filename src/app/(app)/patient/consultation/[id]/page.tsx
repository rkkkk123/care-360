"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DeviceCheckModal } from "@/features/consultation/components/DeviceCheckModal";
import { WaitingRoom } from "@/features/consultation/components/WaitingRoom";
import { VideoStage } from "@/features/consultation/components/VideoStage";
import { PatientConsultationSummary } from "@/features/consultation/components/PatientConsultationSummary";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import { Consultation, VideoConnectionState } from "@/types/models/consultation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verifiedDoctors } from "@/features/doctors/data/doctorsData";

type FlowStep = "device_check" | "waiting_room" | "in_call" | "completed";

export default function PatientConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = (params?.id as string) || "app_1";

  const { appointments } = useAppointments();
  const matchedAppointment = appointments.find(
    (a) => a.id === consultationId || a.consultationId === consultationId
  );

  const [step, setStep] = React.useState<FlowStep>("device_check");
  const [consultation, setConsultation] = React.useState<Consultation | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [connectionState, setConnectionState] = React.useState<VideoConnectionState>("connected");
  const [doctorIsReady, setDoctorIsReady] = React.useState(false);

  // Fetch Consultation info from Server API
  React.useEffect(() => {
    async function loadConsultation() {
      try {
        setLoading(true);
        const res = await fetch(`/api/consultation/${consultationId}/auth`);
        if (res.ok) {
          const data = await res.json();
          if (data.consultation) {
            setConsultation(data.consultation);

            // If already finalized, show completed summary directly
            if (data.consultation.isFinalized || data.consultation.status === "completed") {
              setStep("completed");
            } else if (
              data.consultation.status === "doctor_ready" ||
              data.consultation.status === "in_progress"
            ) {
              setDoctorIsReady(true);
            }
          }
        } else {
          // If auth API returns error (e.g. In mock demo environment)
          console.warn("Could not load from API, falling back to local context");
        }
      } catch (err) {
        console.warn("Error fetching consultation auth:", err);
      } finally {
        setLoading(false);
      }
    }

    loadConsultation();
  }, [consultationId]);

  // Check if doctor joins periodically while in waiting room
  React.useEffect(() => {
    if (step !== "waiting_room") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/consultation/${consultationId}/auth`);
        if (res.ok) {
          const data = await res.json();
          if (
            data.consultation?.status === "doctor_ready" ||
            data.consultation?.status === "in_progress"
          ) {
            setDoctorIsReady(true);
          }
          if (data.consultation?.isFinalized) {
            setConsultation(data.consultation);
            setStep("completed");
          }
        }
      } catch (e) {}
    }, 4000);

    return () => clearInterval(interval);
  }, [step, consultationId]);

  const handleDeviceCheckComplete = async () => {
    try {
      // Notify server patient is ready
      await fetch(`/api/consultation/${consultationId}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "patient_ready" }),
      });
    } catch (e) {}

    setStep("waiting_room");
  };

  const handleEnterCall = () => {
    setStep("in_call");
  };

  const handleLeaveCall = async () => {
    // Hackathon Mock: Automatically generate PDF prescription on call end
    const doctor = verifiedDoctors.find((d: any) => d.name === (matchedAppointment?.doctorName || "Dr. Ananya Sharma")) || verifiedDoctors[0];
    
    import("@/lib/pdf/generatePrescription").then(({ generateAndDownloadPrescription }) => {
       const prescriptionData = {
        prescriptionId: `RX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        doctorName: doctor.name,
        doctorTitle: doctor.title || "MD",
        doctorSpecialization: doctor.specialization || "Internal Medicine",
        clinicAddress: doctor.clinicAddress ? `${doctor.clinicAddress.street}, ${doctor.clinicAddress.city}` : "CARE360 Virtual Clinic",
        patientName: "Jane Doe",
        patientAge: 32,
        patientGender: "Female",
        date: new Date().toLocaleDateString(),
        medicines: [
          {
            name: "Cholecalciferol (Vitamin D3) 50,000 IU",
            dosage: "1 Capsule",
            frequency: "Once a week",
            duration: "8 weeks",
            instructions: "Take with a heavy meal containing fat for better absorption."
          },
          {
            name: "Omega-3 Fish Oil 1000mg",
            dosage: "1 Softgel",
            frequency: "Daily",
            duration: "3 Months",
            instructions: "Take after breakfast."
          }
        ],
        notes: "Patient exhibits mild Vitamin D insufficiency (24 ng/mL). Prescribed high-dose D3 therapy to replenish stores. Advised to get 15-20 mins of midday sun exposure if possible. Follow up with a repeat Vitamin D 25-OH panel in 10 weeks to verify absorption."
      };
      generateAndDownloadPrescription(prescriptionData);
    });

    setStep("completed");
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Initializing secure consultation environment...</p>
      </div>
    );
  }

  const doctorName = matchedAppointment?.doctorName || consultation?.doctorName || "Dr. Ananya Sharma";
  const specialization =
    matchedAppointment?.specialization || "Internal Medicine & Metabolic Health";
  const scheduledTime = matchedAppointment?.time || "10:30 AM";
  const attachedReportTitle =
    matchedAppointment?.attachedReportTitle || "Comprehensive Metabolic Panel";

  return (
    <div className="w-full flex-1 flex flex-col max-w-6xl mx-auto py-2">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl h-8 px-2 text-xs" asChild>
            <Link href="/patient/appointments">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Appointments
            </Link>
          </Button>
          <div className="h-4 w-px bg-border/80" />
          <span className="text-xs font-medium text-foreground">
            CARE360 Clinical Telehealth • {doctorName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Session ID:</span>
          <code className="bg-secondary/60 px-2 py-0.5 rounded text-[11px] font-mono text-foreground">
            {consultationId}
          </code>
        </div>
      </div>

      {/* Main Flow Stages */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {step === "device_check" && (
          <DeviceCheckModal
            userName="Jane Doe"
            userRole="patient"
            onReadyToJoin={handleDeviceCheckComplete}
          />
        )}

        {step === "waiting_room" && (
          <WaitingRoom
            doctorName={doctorName}
            specialization={specialization}
            doctorAvatar="AS"
            scheduledTime={scheduledTime}
            authorizedReportTitle={attachedReportTitle}
            doctorReady={doctorIsReady}
            onEnterRoom={handleEnterCall}
          />
        )}

        {step === "in_call" && (
          <div className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] min-h-[450px] md:min-h-[550px] flex flex-col">
            <VideoStage
              userRole="patient"
              localUserName="Jane Doe"
              remoteUserName={doctorName}
              remoteSubtext={specialization}
              isDemoMode={true}
              connectionState={connectionState}
              onLeaveCall={handleLeaveCall}
            />
          </div>
        )}

        {step === "completed" && (
          <PatientConsultationSummary
            doctorName={doctorName}
            specialization={specialization}
            completedAt={consultation?.completedAt || new Date().toISOString()}
            summaryText={
              consultation?.patientVisibleSummary ||
              matchedAppointment?.patientVisibleSummary ||
              "Reviewed Comprehensive Metabolic Panel. All kidney and metabolic functions are normal. Mild Vitamin D insufficiency (24 ng/mL) noted. Recommended Vitamin D3 (2,000 IU daily) with dietary fat and re-evaluation in 3 months."
            }
            planText={consultation?.notes.plan}
            followUpText={consultation?.notes.followUp}
          />
        )}
      </div>
    </div>
  );
}
