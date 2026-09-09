import * as React from "react";
import { Pill, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Prescription {
  id: string;
  medication: string;
  doctorName: string;
  date: string;
  status: string;
}

interface RecentPrescriptionsProps {
  prescriptions: Prescription[];
}

export function RecentPrescriptions({ prescriptions }: RecentPrescriptionsProps) {
  if (prescriptions.length === 0) {
    return (
      <div className="h-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
        <Pill className="w-8 h-8 text-muted-foreground/30 mb-4" />
        <p className="text-sm text-foreground mb-4">No prescriptions yet.</p>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href="/patient/doctors">View doctors</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Prescriptions</span>
        <Link href="/patient/prescriptions" className="text-xs font-medium text-primary hover:underline flex items-center">
          View all <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {prescriptions.slice(0, 3).map(rx => (
          <div key={rx.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-secondary/50 transition-colors group cursor-pointer border border-transparent hover:border-border/50">
            <div className="bg-background border border-border p-2 rounded-xl shrink-0 group-hover:bg-orange-500/5 group-hover:border-orange-500/20 transition-colors">
              <Pill className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{rx.medication}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{rx.doctorName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
