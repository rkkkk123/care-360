"use client";

import * as React from "react";
import Link from "next/link";
import { DoctorProfile } from "@/types/models/doctor";
import { ArrowRight, X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorCompareBarProps {
  selectedDoctors: DoctorProfile[];
  onRemove: (doctor: DoctorProfile) => void;
  onClear: () => void;
}

export function DoctorCompareBar({
  selectedDoctors,
  onRemove,
  onClear,
}: DoctorCompareBarProps) {
  if (selectedDoctors.length === 0) return null;

  const compareUrl = `/patient/doctors/compare?ids=${selectedDoctors.map((d) => d.id).join(",")}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 rounded-full border border-border/80 bg-background/90 px-4 sm:px-6 py-3 shadow-2xl backdrop-blur-xl max-w-2xl w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">
              Compare Doctors ({selectedDoctors.length}/3)
            </p>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Side-by-side credentials, AI match & fees
            </p>
          </div>
        </div>

        {/* Selected Avatars */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {selectedDoctors.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-foreground"
              title={doc.name}
            >
              <span>{doc.avatar}</span>
              <button
                onClick={() => onRemove(doc)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${doc.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
          >
            Clear
          </Button>

          <Button
            size="sm"
            className="rounded-full text-xs h-8 group"
            disabled={selectedDoctors.length < 2}
            asChild={selectedDoctors.length >= 2}
          >
            {selectedDoctors.length >= 2 ? (
              <Link href={compareUrl}>
                Compare Now
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <span>Select {2 - selectedDoctors.length} more</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
