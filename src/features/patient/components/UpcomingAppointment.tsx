import * as React from "react";
import { Appointment } from "@/types/models/appointment";
import { Calendar, Video, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/utils";

interface UpcomingAppointmentProps {
  appointment?: Appointment;
}

export function UpcomingAppointment({ appointment }: UpcomingAppointmentProps) {
  if (!appointment) {
    return (
      <div className="h-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
        <Calendar className="w-10 h-10 text-muted-foreground/30 mb-4" />
        <h3 className="font-medium text-foreground">Nothing scheduled yet.</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">You have no upcoming appointments.</p>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/patient/doctors">Find a doctor</Link>
        </Button>
      </div>
    );
  }

  // Formatting date for demo
  const dateStr = formatDisplayDate(appointment.date);
  const timeStr = (appointment as any).time || "10:30 AM";

  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-br from-card to-secondary/30 border border-border rounded-3xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Upcoming Consultation</span>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-medium text-foreground">{appointment.doctorName}</h3>
        <p className="text-sm text-muted-foreground">{appointment.specialization}</p>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-background border border-border p-2 rounded-xl">
              <Calendar className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{dateStr}</p>
              <p className="text-muted-foreground">{timeStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="bg-background border border-border p-2 rounded-xl">
              {appointment.type === "video" ? <Video className="w-4 h-4 text-foreground" /> : <MapPin className="w-4 h-4 text-foreground" />}
            </div>
            <div>
              <p className="font-medium text-foreground">{appointment.type === "video" ? "Video call" : "In-person"}</p>
              <p className="text-muted-foreground">CARE360 Secure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button className="rounded-full flex-1 group" asChild>
          <Link href={`/patient/consultation/${appointment.id}`}>
            Join Consultation
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button variant="outline" className="rounded-full bg-background border border-border flex-1" asChild>
          <Link href={`/patient/appointments/${appointment.id}`}>
            Prepare Records
          </Link>
        </Button>
      </div>
    </div>
  );
}
