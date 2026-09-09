"use client";

import * as React from "react";
import Link from "next/link";
import { DoctorProfile } from "@/types/models/doctor";
import {
  Star,
  CheckCircle2,
  Video,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: DoctorProfile;
  onBook: (doctor: DoctorProfile) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (doctor: DoctorProfile) => void;
}

export function DoctorCard({
  doctor,
  onBook,
  isSelectedForCompare,
  onToggleCompare,
}: DoctorCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md">
      
      {/* Top Header: Avatar + Info + Compare Toggle */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar badge */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary font-medium text-foreground text-lg border-2 border-background shadow-md overflow-hidden relative">
                <img src={doctor.avatar} alt={doctor.name} className="h-full w-full object-cover" />
              </div>
              {doctor.verified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-background" />
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/patient/doctors/${doctor.id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors text-base sm:text-lg"
                >
                  {doctor.name}
                </Link>
                <span className="text-xs text-muted-foreground font-normal">
                  {doctor.title}
                </span>
              </div>
              <p className="text-xs font-medium text-primary mt-0.5">
                {doctor.specialization}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {doctor.rating}
                  <span className="text-muted-foreground font-normal">
                    ({doctor.reviewCount})
                  </span>
                </span>
                <span className="text-border">•</span>
                <span>{doctor.experienceYears} yrs exp</span>
              </div>
            </div>
          </div>

          {/* Compare Checkbox / Button */}
          <button
            onClick={() => onToggleCompare(doctor)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all ${
              isSelectedForCompare
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            title="Add to doctor comparison"
            aria-label={`Compare ${doctor.name}`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="h-3 w-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" />
                <span className="hidden sm:inline">Compare</span>
              </>
            )}
          </button>
        </div>

        {/* AI Match Badge (if score > 85) */}
        {doctor.aiMatchScore && doctor.aiMatchScore >= 85 && (
          <div className="mt-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex items-center gap-2 font-semibold text-primary mb-1.5">
              <Sparkles className="h-4 w-4 fill-primary/20" />
              <span>{doctor.aiMatchScore}% AI Match Recommendation</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed italic">
              "{doctor.aiMatchReason}"
            </p>
          </div>
        )}

        {/* Hospital Affiliation & Focus Tags */}
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{doctor.hospitalAffiliations[0]}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {doctor.subspecialties.slice(0, 2).map((sub) => (
              <span
                key={sub}
                className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Next slot + Pricing & Action Buttons */}
      <div className="mt-6 pt-4 border-t border-border flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Next: <strong className="text-foreground font-medium">{doctor.nextAvailableSlot}</strong></span>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">${doctor.consultationFee}</span>
            <span className="text-[10px] text-muted-foreground ml-1">/ visit</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-xs"
            asChild
          >
            <Link href={`/patient/doctors/${doctor.id}`}>
              View Profile
            </Link>
          </Button>

          <Button
            size="sm"
            className="flex-1 rounded-full text-xs group"
            onClick={() => onBook(doctor)}
          >
            Book Now
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
