"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifiedDoctors } from "@/features/doctors/data/doctorsData";
import { DoctorProfile } from "@/types/models/doctor";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import { BookingModal } from "@/features/appointments/components/BookingModal";
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  Sparkles,
  Building2,
  GraduationCap,
  Clock,
  Video,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function DoctorCompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");

  const { isBookingModalOpen, setIsBookingModalOpen, selectedDoctorForBooking, setSelectedDoctorForBooking } = useAppointments();

  // Get selected doctors from param or fallback to first 2
  const selectedDoctors = React.useMemo(() => {
    if (idsParam) {
      const ids = idsParam.split(",");
      const docs = verifiedDoctors.filter((d) => ids.includes(d.id));
      if (docs.length >= 2) return docs.slice(0, 3);
    }
    return [verifiedDoctors[0], verifiedDoctors[1]];
  }, [idsParam]);

  const activeDoctorForModal = React.useMemo(() => {
    return verifiedDoctors.find((d) => d.id === selectedDoctorForBooking) || null;
  }, [selectedDoctorForBooking]);

  const handleBook = (doctor: DoctorProfile) => {
    setSelectedDoctorForBooking(doctor.id);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header & Back */}
      <div>
        <Link
          href="/patient/doctors"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Doctors</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Compare Specialists Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Evaluate credentials, clinical focus, AI match justifications, and real-time availability.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        
        {/* Doctors Header Row */}
        <div className="grid grid-cols-12 border-b border-border bg-secondary/30">
          <div className="col-span-3 p-4 sm:p-6 flex items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Physician Profile
            </span>
          </div>

          {selectedDoctors.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 sm:p-6 border-l border-border flex flex-col justify-between ${
                selectedDoctors.length === 2 ? "col-span-4 sm:col-span-4" : "col-span-3"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary font-medium text-foreground text-sm border border-border shadow-inner shrink-0">
                    {doc.avatar}
                  </div>
                  <div>
                    <Link
                      href={`/patient/doctors/${doc.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors text-sm sm:text-base line-clamp-1"
                    >
                      {doc.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{doc.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {doc.rating}
                  </span>
                  <span className="text-border">•</span>
                  <span className="text-muted-foreground">{doc.experienceYears} yrs</span>
                  <span className="text-border">•</span>
                  <span className="font-medium text-foreground">${doc.consultationFee}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="sm"
                  className="w-full rounded-full text-xs group shadow-sm"
                  onClick={() => handleBook(doc)}
                >
                  Book with Dr. {doc.name.split(" ").slice(-1)[0]}
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border text-xs">
          
          {/* AI Compatibility Row */}
          <div className="grid grid-cols-12 items-start hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>AI Match Justification</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                <div className="rounded-2xl bg-primary/[0.06] border border-primary/15 p-3 space-y-1">
                  <span className="font-semibold text-primary block">
                    {doc.aiMatchScore}% Match Score
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {doc.aiMatchReason}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Earliest Availability Row */}
          <div className="grid grid-cols-12 items-center hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Next Available Slot</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                <span className="font-medium text-foreground bg-secondary/50 px-2.5 py-1 rounded-lg">
                  {doc.nextAvailableSlot}
                </span>
              </div>
            ))}
          </div>

          {/* Consultation Formats Row */}
          <div className="grid grid-cols-12 items-center hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground flex items-center gap-1.5">
              <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Visit Formats & Fee</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">${doc.consultationFee} / consultation</p>
                  <p className="text-muted-foreground">
                    {doc.consultationTypes.includes("video") && "• Telehealth Video Call "}
                    {doc.consultationTypes.includes("in_person") && "• In-Person Clinic"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Education & Board Certification Row */}
          <div className="grid grid-cols-12 items-start hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Education & Credentials</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                <ul className="space-y-1 text-muted-foreground">
                  {doc.credentials.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Hospital Affiliations Row */}
          <div className="grid grid-cols-12 items-center hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Hospital Affiliations</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                <span className="text-foreground">
                  {doc.hospitalAffiliations.join(", ")}
                </span>
              </div>
            ))}
          </div>

          {/* Clinical Focus Areas Row */}
          <div className="grid grid-cols-12 items-start hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground">
              <span>Clinical Focus Areas</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                <div className="flex flex-wrap gap-1">
                  {doc.clinicalFocus.map((focus) => (
                    <span
                      key={focus}
                      className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] text-foreground"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Languages Row */}
          <div className="grid grid-cols-12 items-center hover:bg-secondary/10 transition-colors">
            <div className="col-span-3 p-4 sm:p-6 font-medium text-foreground">
              <span>Languages</span>
            </div>
            {selectedDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 sm:p-6 border-l border-border text-muted-foreground ${
                  selectedDoctors.length === 2 ? "col-span-4" : "col-span-3"
                }`}
              >
                {doc.languages.join(", ")}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={activeDoctorForModal}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

    </div>
  );
}

export default function DoctorComparePage() {
  return (
    <React.Suspense fallback={<div className="py-12 text-center text-muted-foreground text-sm">Loading comparison matrix...</div>}>
      <DoctorCompareContent />
    </React.Suspense>
  );
}
