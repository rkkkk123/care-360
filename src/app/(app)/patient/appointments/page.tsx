"use client";

import * as React from "react";
import Link from "next/link";
import { useAppointments, StoredAppointment } from "@/features/appointments/context/AppointmentsContext";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  FileText,
  Sparkles,
  ArrowRight,
  Download,
  Plus,
  CheckCircle2,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Share2,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/lib/utils";

export default function AppointmentsPage() {
  const { appointments, cancelAppointment } = useAppointments();

  const [activeTab, setActiveTab] = React.useState<"upcoming" | "past">("upcoming");
  const [activeVideoCallAppointment, setActiveVideoCallAppointment] = React.useState<StoredAppointment | null>(null);
  const [prepAppointment, setPrepAppointment] = React.useState<StoredAppointment | null>(null);

  // Video call controls state
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  const upcomingAppointments = appointments.filter((a) => a.status === "scheduled");
  const pastAppointments = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  const handleDownloadICS = (app: StoredAppointment) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CARE360//Healthcare Consultation//EN
BEGIN:VEVENT
SUMMARY:CARE360 Consultation with ${app.doctorName}
DESCRIPTION:Video consultation with ${app.doctorName} (${app.specialization}). Reason: ${app.notes || "Medical Consultation"}
DTSTART:${app.date.replace(/-/g, "")}T090000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CARE360_${app.doctorId}_Appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your verified doctor consultations, telehealth sessions, and visit summaries.
          </p>
        </div>

        <Button className="rounded-full shrink-0 group text-xs shadow-sm" asChild>
          <Link href="/patient/doctors">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Book New Consultation
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`relative pb-2 text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Upcoming Consultations</span>
          {upcomingAppointments.length > 0 && (
            <span className="ml-2 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
              {upcomingAppointments.length}
            </span>
          )}
          {activeTab === "upcoming" && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`relative pb-2 text-sm font-medium transition-colors ${
            activeTab === "past"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Past Consultations & Notes</span>
          {activeTab === "past" && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {/* UPCOMING TAB */}
      {activeTab === "upcoming" && (
        <div className="space-y-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all hover:border-border/80 space-y-6"
              >
                {/* Consultation Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary font-medium text-foreground text-lg border border-border shrink-0 overflow-hidden">
                      {app.doctorAvatar?.startsWith("http") ? (
                        <img src={app.doctorAvatar} alt={app.doctorName} className="h-full w-full object-cover" />
                      ) : (
                        app.doctorAvatar || "DR"
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground text-lg">{app.doctorName}</h3>
                        <span className="text-xs text-muted-foreground">{app.doctorTitle || "MD"}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Confirmed
                        </span>
                      </div>
                      <p className="text-xs font-medium text-primary mt-0.5">{app.specialization}</p>
                    </div>
                  </div>

                  {/* Consultation Mode Tag */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">
                      {app.type === "video" ? (
                        <>
                          <Video className="h-3.5 w-3.5 text-primary" />
                          Telehealth Video Call
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          In-Person Clinic Visit
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-2xl bg-secondary/20 border border-border/50 p-4 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Scheduled Date & Time
                    </span>
                    <p className="font-medium text-foreground text-sm mt-1" suppressHydrationWarning>
                      {formatDisplayDate(app.date)}
                    </p>
                    <p className="text-muted-foreground">{app.time || "10:30 AM"}</p>
                  </div>

                  <div className="rounded-2xl bg-secondary/20 border border-border/50 p-4 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Attached Health Records
                    </span>
                    <p className="font-medium text-foreground text-sm mt-1 truncate">
                      {app.attachedReportTitle || "Comprehensive Metabolic Panel"}
                    </p>
                    <p className="text-muted-foreground">Synced to doctor portal</p>
                  </div>

                  <div className="rounded-2xl bg-secondary/20 border border-border/50 p-4 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Consultation Security
                    </span>
                    <p className="font-medium text-foreground text-sm mt-1">
                      HIPAA End-to-End Encrypted
                    </p>
                    <p className="text-muted-foreground">Fee: ${app.fee || 85} • HSA Eligible</p>
                  </div>
                </div>

                {/* AI Pre-Consultation Summary Preview */}
                {app.aiPrepSummary && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Pre-Consultation Clinical Briefing</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {app.aiPrepSummary}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="rounded-full text-xs shadow-sm bg-primary text-primary-foreground hover:opacity-90"
                      asChild
                    >
                      <Link href={`/patient/consultation/${app.id}`}>
                        <Video className="h-3.5 w-3.5 mr-1.5" />
                        Join Video Consultation
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      asChild
                    >
                      <Link href={`/patient/appointments/${app.id}`}>
                        View Details & Records
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleDownloadICS(app)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Add to Calendar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => cancelAppointment(app.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-secondary/10 p-12 text-center space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-medium text-foreground">No upcoming appointments</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You do not have any scheduled consultations at this time. Browse our verified physician network to book a visit.
              </p>
              <Button asChild className="rounded-full text-xs mt-2" size="sm">
                <Link href="/patient/doctors">
                  Browse Verified Doctors
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* PAST TAB */}
      {activeTab === "past" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div>
                <h4 className="font-medium text-foreground text-base">Annual Physical & Wellness Consultation</h4>
                <p className="text-xs text-muted-foreground">Dr. David Chen • May 12, 2025</p>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                Completed
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reviewed annual preventative blood panel. Recommended maintaining aerobic exercise 4x weekly, monitoring fasting glucose, and rechecking lipid profile in 12 months.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <Link href="/patient/reports/rep_2" className="text-primary hover:underline font-medium flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> View Annual Physical Panel (2025)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          INTERACTIVE TELEHEALTH VIDEO CALL MODAL
      ══════════════════════════════════════════════ */}
      {activeVideoCallAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-4xl h-[80vh] rounded-3xl border border-border bg-card text-foreground overflow-hidden flex flex-col shadow-2xl">
            
            {/* Call Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/40">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{activeVideoCallAppointment.doctorName}</h3>
                  <p className="text-xs text-muted-foreground">{activeVideoCallAppointment.specialization} • Telehealth Video Call</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Encrypted Video Room
                </span>
                <button
                  onClick={() => setActiveVideoCallAppointment(null)}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Video Main Feed */}
            <div className="flex-1 relative flex items-center justify-center p-6 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
              
              {/* Doctor Video Area */}
              <div className="relative flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-32 w-32 rounded-3xl bg-secondary border border-border flex items-center justify-center text-3xl font-bold text-primary shadow-lg overflow-hidden">
                  {activeVideoCallAppointment.doctorAvatar?.startsWith("http") ? (
                    <img src={activeVideoCallAppointment.doctorAvatar} alt={activeVideoCallAppointment.doctorName} className="h-full w-full object-cover" />
                  ) : (
                    activeVideoCallAppointment.doctorAvatar || "DR"
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{activeVideoCallAppointment.doctorName}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Connected • High Definition Telehealth Audio & Video</p>
                </div>

                {/* Attached Report Pill */}
                {activeVideoCallAppointment.attachedReportTitle && (
                  <div className="rounded-2xl border border-border bg-card shadow-xs px-4 py-2 text-xs text-foreground flex items-center gap-2 max-w-sm">
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">Shared: {activeVideoCallAppointment.attachedReportTitle}</span>
                  </div>
                )}
              </div>

              {/* Patient Self-View Picture-in-Picture */}
              <div className="absolute bottom-6 right-6 h-28 w-40 rounded-2xl border border-border bg-card shadow-xl overflow-hidden flex flex-col items-center justify-center text-xs text-muted-foreground">
                {isVideoOff ? (
                  <div className="flex flex-col items-center gap-1">
                    <VideoOff className="h-5 w-5 text-muted-foreground" />
                    <span>Camera off</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-secondary/50">
                    <span className="font-semibold text-foreground text-xs">You (Jane Doe)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Call Action Bar Controls */}
            <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-border bg-secondary/40">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`rounded-full p-3.5 transition-all shadow-xs border ${
                  isMuted ? "bg-rose-500 text-white border-rose-500" : "bg-card text-foreground hover:bg-secondary border-border"
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`rounded-full p-3.5 transition-all shadow-xs border ${
                  isVideoOff ? "bg-rose-500 text-white border-rose-500" : "bg-card text-foreground hover:bg-secondary border-border"
                }`}
                title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setActiveVideoCallAppointment(null)}
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <PhoneOff className="h-4 w-4" />
                End Consultation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          AI CONSULTATION PREPARATION NOTES MODAL
      ══════════════════════════════════════════════ */}
      {prepAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4" />
                <span>AI Consultation Preparation</span>
              </div>
              <button
                onClick={() => setPrepAppointment(null)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-light text-foreground">
                Questions for Dr. {prepAppointment.doctorName.split(" ").slice(-1)[0]}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Generated from your attached lab results (Vitamin D: 24 ng/mL).
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                "1. Should I take Vitamin D3 with K2 for optimal calcium absorption?",
                "2. What is the recommended dosage (e.g. 2,000 IU vs 5,000 IU daily or 50,000 IU weekly)?",
                "3. In how many months should we repeat the metabolic panel to check response?",
                "4. Are there specific dietary fat sources that enhance uptake given my normal lipid profile?",
              ].map((q, i) => (
                <div key={i} className="p-3 rounded-2xl bg-secondary/30 border border-border text-foreground leading-relaxed">
                  {q}
                </div>
              ))}
            </div>

            <Button
              className="w-full rounded-full text-xs"
              onClick={() => setPrepAppointment(null)}
            >
              Done Reviewing
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
