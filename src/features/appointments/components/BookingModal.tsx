"use client";

import * as React from "react";
import { DoctorProfile, DaySchedule, TimeSlot } from "@/types/models/doctor";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import { demoReports } from "@/features/patient/data/demoData";
import {
  X,
  Video,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/utils";

interface BookingModalProps {
  doctor: DoctorProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ doctor, isOpen, onClose }: BookingModalProps) {
  const { bookAppointment } = useAppointments();

  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [selectedType, setSelectedType] = React.useState<"video" | "in_person">("video");
  const [selectedDayIndex, setSelectedDayIndex] = React.useState(0);
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null);

  // Step 2 Form States
  const [reason, setReason] = React.useState("Review recent Comprehensive Metabolic Panel and Vitamin D");
  const [attachReport, setAttachReport] = React.useState(true);
  const [selectedReportId, setSelectedReportId] = React.useState(demoReports[0]?.id || "");
  const [patientNotes, setPatientNotes] = React.useState("");

  // Step 3 Submission State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmedAppointmentId, setConfirmedAppointmentId] = React.useState<string | null>(null);

  // Reset states when doctor changes
  React.useEffect(() => {
    if (doctor) {
      setStep(1);
      setSelectedType(doctor.consultationTypes.includes("video") ? "video" : "in_person");
      setSelectedDayIndex(0);
      const firstAvailable = doctor.weeklySchedule[0]?.slots.find((s) => s.available);
      setSelectedSlot(firstAvailable || null);
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

  const currentSchedule: DaySchedule = doctor.weeklySchedule[selectedDayIndex] || doctor.weeklySchedule[0];
  const selectedReport = demoReports.find((r) => r.id === selectedReportId);

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const booked = bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorTitle: doctor.title,
        doctorAvatar: doctor.avatar,
        specialization: doctor.specialization,
        date: currentSchedule.date,
        time: selectedSlot.time,
        type: selectedType,
        reason,
        attachedReportId: attachReport ? selectedReport?.id : undefined,
        attachedReportTitle: attachReport ? selectedReport?.title : undefined,
        notes: patientNotes,
        aiPrepSummary: `Patient's recent ${selectedReport?.title || "panel"} showed mild Vitamin D insufficiency (24 ng/mL). Patient requests follow-up guidance on supplementation and general metabolic wellness.`,
        fee: doctor.consultationFee,
      });

      setConfirmedAppointmentId(booked.id);
      setIsSubmitting(false);
      setStep(4);
    }, 800);
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CARE360//Healthcare Consultation//EN
BEGIN:VEVENT
SUMMARY:CARE360 Consultation with ${doctor.name}
DESCRIPTION:Video consultation with ${doctor.name} (${doctor.specialization}). Reason: ${reason}
DTSTART:${currentSchedule.date.replace(/-/g, "")}T090000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CARE360_${doctor.id}_Appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary font-medium text-foreground text-sm border border-border overflow-hidden relative">
              <img src={doctor.avatar} alt={doctor.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{doctor.name}</h3>
              <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step < 4 && (
              <span className="text-xs font-medium text-muted-foreground">
                Step {step} of 3
              </span>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* ══════════════════════════════════════════════
              STEP 1: FORMAT & SLOT SELECTION
          ══════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-light tracking-tight text-foreground">
                  Select Consultation Format & Time
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose between high-definition encrypted video or clinic visit.
                </p>
              </div>

              {/* Consultation Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                {doctor.consultationTypes.map((type) => {
                  const isVideo = type === "video";
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/[0.06] shadow-sm"
                          : "border-border bg-secondary/30 hover:bg-secondary/60"
                      }`}
                    >
                      <div className={`mt-0.5 rounded-xl p-2 ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {isVideo ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {isVideo ? "Telehealth Video Call" : "In-Person Clinic Visit"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isVideo ? "Join from phone or computer" : `${doctor.clinicAddress?.city || "Local Clinic"}`}
                        </p>
                        <p className="text-xs font-medium text-primary mt-2">
                          ${doctor.consultationFee}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Date Tabs */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Select Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {doctor.weeklySchedule.map((day, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => {
                          setSelectedDayIndex(idx);
                          setSelectedSlot(day.slots.find((s) => s.available) || null);
                        }}
                        className={`flex flex-col items-center justify-center min-w-[90px] rounded-2xl border p-3 transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground font-medium shadow-sm"
                            : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        <span className="text-[11px] opacity-80">
                          {day.displayDate.split(",")[0]}
                        </span>
                        <span className="text-sm font-semibold mt-0.5">
                          {day.displayDate.split(",")[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Available Slots ({currentSchedule.displayDate})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentSchedule.slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl border py-2 px-3 text-xs font-medium transition-all ${
                          !slot.available
                            ? "border-transparent bg-secondary/20 text-muted-foreground/40 cursor-not-allowed line-through"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-secondary/30 hover:bg-secondary/70 text-foreground"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              STEP 2: CLINICAL REASON & REPORT ATTACHMENT
          ══════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-light tracking-tight text-foreground">
                  Consultation Purpose & Health Context
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect your recent lab reports so Dr. {doctor.name.split(" ").slice(-1)[0]} can review them prior to your call.
                </p>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Primary Reason for Visit
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Discuss Vitamin D lab results, medication review"
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Lab Results Review",
                    "Annual Physical Follow-up",
                    "Prescription Refill",
                    "Fatigue & Nutrition",
                  ].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setReason(quick)}
                      className="rounded-lg bg-secondary/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attach Lab Report */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Attach Recent Health Report
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="attachReportToggle"
                    checked={attachReport}
                    onChange={(e) => setAttachReport(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </div>

                {attachReport && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Doctor will securely receive structured biomarkers and summary:
                    </p>
                    <div className="space-y-1.5">
                      {demoReports.map((rep) => (
                        <label
                          key={rep.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            selectedReportId === rep.id
                              ? "border-primary/40 bg-primary/5 text-foreground"
                              : "border-border bg-card text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="reportSelection"
                              checked={selectedReportId === rep.id}
                              onChange={() => setSelectedReportId(rep.id)}
                              className="accent-primary"
                            />
                            <span className="font-medium text-foreground">{rep.title}</span>
                          </div>
                          <span suppressHydrationWarning>{formatDisplayDate(rep.date)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Pre-Consultation Summary Preview */}
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Pre-Consultation Briefing</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CARE360 AI will automatically generate a concise clinical summary from your attached {selectedReport?.title} (highlighting Vitamin D: 24 ng/mL and stable metabolic vitals). Dr. {doctor.name.split(" ").slice(-1)[0]} can review it before the call starts.
                </p>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Any symptoms, medications, or questions you'd like to ask..."
                  rows={2}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              STEP 3: REVIEW & CONFIRM
          ══════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-light tracking-tight text-foreground">
                  Review & Confirm Appointment
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Review consultation details before finalizing your booking.
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                <div className="flex items-start justify-between pb-4 border-b border-border">
                  <div>
                    <h5 className="font-medium text-foreground text-base">{doctor.name}</h5>
                    <p className="text-xs text-muted-foreground">{doctor.specialization} • {doctor.hospitalAffiliations[0]}</p>
                  </div>
                  <span className="text-xs font-medium text-primary px-2.5 py-1 rounded-full bg-primary/10">
                    {selectedType === "video" ? "Video Telehealth" : "In-Person Clinic"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Date & Time:</span>
                    <p className="font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {currentSchedule.displayDate} at {selectedSlot?.time}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Patient:</span>
                    <p className="font-medium text-foreground mt-0.5">Jane Doe (Self)</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Attached Records:</span>
                    <p className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {attachReport && selectedReport ? selectedReport.title : "None"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Consultation Fee:</span>
                    <p className="font-medium text-foreground text-sm mt-0.5">
                      ${doctor.consultationFee} <span className="text-[10px] text-muted-foreground font-normal">(Card on file / HSA eligible)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Notes */}
              <div className="rounded-2xl bg-secondary/30 border border-border p-4 text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5 text-foreground font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Free cancellation up to 24 hours prior
                </p>
                <p>
                  You will receive an email reminder with the secure video call link 30 minutes before the scheduled time.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              STEP 4: CONFIRMED SUCCESS
          ══════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="max-w-md space-y-1.5">
                <h4 className="text-2xl font-light tracking-tight text-foreground">
                  Appointment Confirmed
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your consultation with <strong className="text-foreground font-medium">{doctor.name}</strong> is booked for <strong className="text-foreground font-medium">{currentSchedule.displayDate} at {selectedSlot?.time}</strong>.
                </p>
              </div>

              {/* Quick Details Capsule */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-4 max-w-sm w-full text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Type:</span>
                  <span className="font-medium text-foreground capitalize">{selectedType} Telehealth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-emerald-600 uppercase tracking-wider text-[10px]">Confirmed & Synced</span>
                </div>
                {attachReport && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Records Transferred:</span>
                    <span className="font-medium text-foreground truncate max-w-[180px]">{selectedReport?.title}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-sm">
                <Button
                  variant="outline"
                  onClick={handleDownloadICS}
                  className="rounded-full text-xs flex-1"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Add to Calendar
                </Button>

                {selectedType === "video" && confirmedAppointmentId ? (
                  <Button
                    asChild
                    className="rounded-full text-xs flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={onClose}
                  >
                    <Link href={`/patient/consultation/${confirmedAppointmentId}?docId=${doctor.id}`}>
                      <Video className="h-3.5 w-3.5 mr-1.5" />
                      Join Video Call Now
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="rounded-full text-xs flex-1"
                    onClick={onClose}
                  >
                    <Link href="/patient/appointments">
                      View Appointments
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls (Steps 1 to 3) */}
        {step < 4 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-secondary/10">
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="rounded-full text-xs"
              >
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full text-xs text-muted-foreground"
              >
                Cancel
              </Button>
            )}

            {step < 3 ? (
              <Button
                size="sm"
                disabled={!selectedSlot}
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="rounded-full text-xs group"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="rounded-full text-xs bg-primary text-primary-foreground"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Confirm & Schedule (${doctor.consultationFee})
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
