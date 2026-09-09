"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/lib/utils";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = (params?.id as string) || "app_1";

  const { appointments, cancelAppointment } = useAppointments();
  const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];

  if (!appointment) {
    return (
      <div className="py-12 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-foreground">Appointment Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-6">
          The requested consultation could not be located.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/patient/appointments">Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";
  const canJoin = !isCancelled;

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CARE360//Healthcare Consultation//EN
BEGIN:VEVENT
SUMMARY:CARE360 Consultation with ${appointment.doctorName}
DESCRIPTION:Video consultation with ${appointment.doctorName} (${appointment.specialization}). Reason: ${appointment.notes || "Medical Consultation"}
DTSTART:${appointment.date.replace(/-/g, "")}T090000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CARE360_${appointment.doctorId}_Appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="rounded-xl h-8 px-2 text-xs" asChild>
          <Link href="/patient/appointments">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            All Appointments
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : isCancelled
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                : "bg-primary/10 text-primary border-primary/20"
            }`}
          >
            {isCompleted ? "Completed & Finalized" : isCancelled ? "Cancelled" : "Confirmed Consultation"}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-serif text-xl font-medium text-primary shrink-0">
              {appointment.doctorAvatar || "DR"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-light tracking-tight text-foreground">
                  {appointment.doctorName}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  CARE360 Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{appointment.specialization}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Stanford Health Care • Sutter Health</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadICS}
              className="rounded-xl text-xs h-9 px-3 gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Add to Calendar (.ics)
            </Button>
          </div>
        </div>

        {/* Schedule & Telehealth Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Date</span>
              <span className="text-sm font-medium text-foreground" suppressHydrationWarning>
                {formatDisplayDate(appointment.date)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Time</span>
              <span className="text-sm font-medium text-foreground">
                {appointment.time || "10:30 AM (PST)"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Channel</span>
              <span className="text-sm font-medium text-foreground">Encrypted Telehealth</span>
            </div>
          </div>
        </div>

        {/* Consultation Call Launcher Card */}
        {canJoin && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/30 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-medium text-foreground">
                  {isCompleted ? "Consultation Finalized" : "Virtual Consultation Room Ready"}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                {isCompleted
                  ? "Your consultation with Dr. Sharma has been completed. You can review your verified clinical visit summary."
                  : "Complete your hardware check and enter the virtual waiting room. Dr. Sharma will admit you when ready."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button size="lg" className="rounded-full px-8 shadow-md gap-2" asChild>
                <Link href={`/patient/consultation/${appointment.id}`}>
                  <Video className="w-4 h-4" />
                  {isCompleted ? "View Visit Summary" : "Join Consultation Now"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Attached Records & AI Briefing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium text-sm">
              <FileText className="w-4 h-4 text-primary" />
              <span>Authorized Health Records</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {appointment.attachedReportTitle || "Comprehensive Metabolic Panel"}
            </p>
            <div className="pt-2">
              <Link
                href="/patient/reports/rep_1"
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                Inspect Attached Lab Report
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Pre-Visit Clinical Intelligence</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {appointment.aiPrepSummary ||
                "Patient's recent panel shows Vitamin D insufficiency (24 ng/mL) and normal lipid profiles. Focus discussion on optimal D3 supplementation strategy."}
            </p>
          </div>
        </div>

        {/* Chief Concern */}
        <div className="p-5 rounded-2xl bg-secondary/20 border border-border/70 space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Stated Consultation Concern
          </span>
          <p className="text-xs text-foreground leading-relaxed">
            {appointment.notes || "Follow up on recent blood work."}
          </p>
        </div>

        {/* Cancel Action if scheduled */}
        {!isCompleted && !isCancelled && (
          <div className="pt-4 border-t border-border/60 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Need to cancel or reschedule?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to cancel this appointment?")) {
                  cancelAppointment(appointment.id);
                  router.push("/patient/appointments");
                }
              }}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl h-8 px-3 text-xs"
            >
              Cancel Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
