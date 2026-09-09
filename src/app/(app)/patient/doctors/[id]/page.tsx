"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifiedDoctors } from "@/features/doctors/data/doctorsData";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import { BookingModal } from "@/features/appointments/components/BookingModal";
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  Building2,
  GraduationCap,
  Award,
  Globe2,
  Clock,
  Video,
  MapPin,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const doctor = verifiedDoctors.find((d) => d.id === doctorId) || verifiedDoctors[0];

  const { isBookingModalOpen, setIsBookingModalOpen, selectedDoctorForBooking, setSelectedDoctorForBooking } = useAppointments();

  const [selectedDayIdx, setSelectedDayIdx] = React.useState(0);

  const handleOpenBooking = () => {
    setSelectedDoctorForBooking(doctor.id);
    setIsBookingModalOpen(true);
  };

  const activeDay = doctor.weeklySchedule[selectedDayIdx] || doctor.weeklySchedule[0];

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/patient/doctors"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Doctors</span>
        </Link>
      </div>

      {/* Doctor Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary font-medium text-foreground text-2xl border-2 border-background shadow-md overflow-hidden relative">
                <img src={doctor.avatar} alt={doctor.name} className="h-full w-full object-cover" />
              </div>
              {doctor.verified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 fill-emerald-500 text-background" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
                  {doctor.name}
                </h1>
                <span className="text-sm font-normal text-muted-foreground">
                  {doctor.title}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  {doctor.verificationBadge}
                </span>
              </div>

              <p className="text-sm font-medium text-primary">
                {doctor.specialization}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {doctor.rating} ({doctor.reviewCount} reviews)
                </span>
                <span className="text-border">•</span>
                <span>{doctor.experienceYears} Years Experience</span>
                <span className="text-border">•</span>
                <span>License: {doctor.licenseNumber}</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="rounded-full group shrink-0 w-full sm:w-auto shadow-sm"
            onClick={handleOpenBooking}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Consultation
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Bio, AI Match, Credentials, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Match Context Callout */}
          {doctor.aiMatchScore && (
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>AI Health Record Compatibility ({doctor.aiMatchScore}% Match)</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doctor.aiMatchReason}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-primary font-medium">
                <FileText className="h-3.5 w-3.5" />
                <span>Compatible with: Comprehensive Metabolic Panel (March 2026)</span>
              </div>
            </div>
          )}

          {/* About / Biography */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-medium text-foreground">About the Physician</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {doctor.bio}
            </p>

            <div className="pt-4 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Clinical Focus Areas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {doctor.clinicalFocus.map((focus) => (
                  <div
                    key={focus}
                    className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-3.5 py-2 text-xs text-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Credentials & Education */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-medium text-foreground">Credentials & Board Certifications</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Medical Education & Training</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {doctor.credentials.map((cred, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Hospital Affiliations</span>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {doctor.hospitalAffiliations.map((hosp, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>{hosp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Globe2 className="h-4 w-4 text-primary" />
                  <span>Languages Spoken</span>
                </div>
                <p className="text-sm text-foreground">
                  {doctor.languages.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Reviews */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Verified Patient Reviews</h2>
              <span className="flex items-center gap-1 text-amber-500 font-medium text-sm">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {doctor.rating} rating out of 5
              </span>
            </div>

            <div className="space-y-4 divide-y divide-border">
              {doctor.reviews.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{rev.patientName}</span>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground uppercase">
                        {rev.consultationType} Consultation
                      </span>
                    </div>
                    <span className="text-muted-foreground">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sticky Column: Availability & Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* Booking Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Consultation Pricing
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-light text-foreground">
                    ${doctor.consultationFee}
                  </span>
                  <span className="text-xs text-muted-foreground">/ session</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Eligible for HSA / FSA reimbursement.
                </p>
              </div>

              {/* Schedule Quick Preview */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Availability</span>
                  <span className="text-muted-foreground">Next: {doctor.nextAvailableSlot}</span>
                </div>

                {/* Day selector */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {doctor.weeklySchedule.map((day, idx) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDayIdx(idx)}
                      className={`flex-1 min-w-[55px] rounded-xl py-2 px-1 text-center border text-[11px] transition-all ${
                        selectedDayIdx === idx
                          ? "border-primary bg-primary text-primary-foreground font-medium"
                          : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <div>{day.displayDate.split(",")[0]}</div>
                      <div className="font-bold text-xs mt-0.5">{day.displayDate.split(" ")[2]}</div>
                    </button>
                  ))}
                </div>

                {/* Quick Slots */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Available times for {activeDay.displayDate}:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {activeDay.slots.filter((s) => s.available).slice(0, 4).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={handleOpenBooking}
                        className="rounded-xl border border-border bg-secondary/30 py-1.5 text-xs text-foreground hover:border-primary hover:text-primary transition-colors text-center"
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full rounded-full group"
                onClick={handleOpenBooking}
              >
                Book with Dr. {doctor.name.split(" ").slice(-1)[0]}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>

              {/* Security & Guarantee */}
              <div className="space-y-2 pt-2 text-[11px] text-muted-foreground border-t border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Verified Medical License & Board Credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>HIPAA-Compliant High Definition Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>Pre-consultation AI record sync included</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={doctor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

    </div>
  );
}
