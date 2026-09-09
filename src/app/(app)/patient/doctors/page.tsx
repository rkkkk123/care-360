"use client";

import * as React from "react";
import Link from "next/link";
import { verifiedDoctors } from "@/features/doctors/data/doctorsData";
import { DoctorProfile } from "@/types/models/doctor";
import { DoctorCard } from "@/features/doctors/components/DoctorCard";
import { AIDoctorRecommendationBanner } from "@/features/doctors/components/AIDoctorRecommendationBanner";
import { DoctorCompareBar } from "@/features/doctors/components/DoctorCompareBar";
import { BookingModal } from "@/features/appointments/components/BookingModal";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import {
  Search,
  Filter,
  Sparkles,
  Calendar,
  Video,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorsDiscoveryPage() {
  const { isBookingModalOpen, setIsBookingModalOpen, selectedDoctorForBooking, setSelectedDoctorForBooking } = useAppointments();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<string>("All");
  const [filterAIOnly, setFilterAIOnly] = React.useState(false);
  const [filterVideoOnly, setFilterVideoOnly] = React.useState(false);
  const [selectedForCompare, setSelectedForCompare] = React.useState<DoctorProfile[]>([]);

  // Active doctor for booking modal
  const activeDoctorForModal = React.useMemo(() => {
    return verifiedDoctors.find((d) => d.id === selectedDoctorForBooking) || null;
  }, [selectedDoctorForBooking]);

  const specialties = [
    "All",
    "Internal Medicine",
    "Endocrinology",
    "Preventive Cardiology",
    "Family Medicine",
    "Gastroenterology",
  ];

  // Filtering logic
  const filteredDoctors = React.useMemo(() => {
    return verifiedDoctors.filter((doc) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialization.toLowerCase().includes(q);
        const matchesHospital = doc.hospitalAffiliations.some((h) => h.toLowerCase().includes(q));
        const matchesFocus = doc.clinicalFocus.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesSpec && !matchesHospital && !matchesFocus) {
          return false;
        }
      }

      // Specialty filter
      if (selectedSpecialty !== "All") {
        if (!doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
          return false;
        }
      }

      // AI Match filter
      if (filterAIOnly) {
        if (!doc.aiMatchScore || doc.aiMatchScore < 90) {
          return false;
        }
      }

      // Video consultation filter
      if (filterVideoOnly) {
        if (!doc.consultationTypes.includes("video")) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedSpecialty, filterAIOnly, filterVideoOnly]);

  const handleBookDoctor = (doc: DoctorProfile) => {
    setSelectedDoctorForBooking(doc.id);
    setIsBookingModalOpen(true);
  };

  const handleToggleCompare = (doc: DoctorProfile) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      if (exists) {
        return prev.filter((d) => d.id !== doc.id);
      }
      if (prev.length >= 3) {
        return prev; // limit to 3
      }
      return [...prev, doc];
    });
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Discover Verified Doctors
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect with board-certified physicians matched to your health records.
          </p>
        </div>

        <Button variant="outline" className="rounded-full shrink-0 group text-xs" asChild>
          <Link href="/patient/appointments">
            <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
            My Appointments
          </Link>
        </Button>
      </div>

      {/* AI Recommendation Banner */}
      <AIDoctorRecommendationBanner
        onFilterAIMatches={() => setFilterAIOnly(true)}
        isFilteredToAI={filterAIOnly}
        onResetFilter={() => setFilterAIOnly(false)}
      />

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, condition, or hospital..."
              className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Toggle Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={filterAIOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterAIOnly(!filterAIOnly)}
              className="rounded-full text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              AI Match
            </Button>

            <Button
              variant={filterVideoOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterVideoOnly(!filterVideoOnly)}
              className="rounded-full text-xs"
            >
              <Video className="h-3.5 w-3.5 mr-1.5" />
              Video Only
            </Button>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {specialties.map((spec) => {
            const isSelected = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground font-medium">{filteredDoctors.length}</strong> verified specialists
        </span>

        {(selectedSpecialty !== "All" || filterAIOnly || filterVideoOnly || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSpecialty("All");
              setFilterAIOnly(false);
              setFilterVideoOnly(false);
              setSearchQuery("");
            }}
            className="text-primary hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={handleBookDoctor}
              isSelectedForCompare={selectedForCompare.some((d) => d.id === doc.id)}
              onToggleCompare={handleToggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/10 p-12 text-center">
          <SlidersHorizontal className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-medium text-foreground">No specialists found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search query or removing specialty filters to see all available verified physicians.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSpecialty("All");
              setFilterAIOnly(false);
              setFilterVideoOnly(false);
              setSearchQuery("");
            }}
            className="rounded-full text-xs mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Floating Doctor Comparison Bar */}
      <DoctorCompareBar
        selectedDoctors={selectedForCompare}
        onRemove={(doc) => setSelectedForCompare((prev) => prev.filter((d) => d.id !== doc.id))}
        onClear={() => setSelectedForCompare([])}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        doctor={activeDoctorForModal}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

    </div>
  );
}
