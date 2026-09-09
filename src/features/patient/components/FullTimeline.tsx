"use client";

import * as React from "react";
import Link from "next/link";
import { demoTimelineEvents } from "@/features/patient/data/demoData";
import { FileText, Pill, Stethoscope, Clock } from "lucide-react";
import { formatDisplayDate } from "@/lib/utils";

export function FullTimeline() {
  const [events, setEvents] = React.useState(demoTimelineEvents);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("care360_timeline_events");
      if (stored) {
        const customEvents = JSON.parse(stored);
        const merged = [...customEvents, ...demoTimelineEvents.filter(e => !customEvents.some((c: any) => c.id === e.id))];
        setEvents(merged);
      }
    } catch (e) {}
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "report_ready": return <FileText className="w-4 h-4 text-blue-500" />;
      case "prescription_issued": return <Pill className="w-4 h-4 text-orange-500" />;
      case "consultation": return <Stethoscope className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-10">
      <div className="relative pl-6 border-l-2 border-border space-y-12">
        {events.map((event, i) => (
          <div key={event.id} className="relative group">
            {/* Timeline dot */}
            <div className="absolute -left-[35px] top-0 w-4 h-4 bg-background border-2 border-border group-hover:border-primary rounded-full ring-4 ring-card transition-colors flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-32 shrink-0 pt-1">
                <span className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                  {formatDisplayDate(event.date)}
                </span>
              </div>
              
              <div className="flex-1 bg-secondary/30 border border-border p-5 rounded-2xl group-hover:bg-secondary/50 group-hover:border-border/80 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(event.type)}
                  <h4 className="text-base font-medium text-foreground">{event.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                
                {event.type === "report_ready" && (
                  <Link href="/patient/reports/rep_1" className="mt-4 inline-block text-xs font-medium text-primary hover:underline">
                    View Report
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Origin dot */}
        <div className="relative">
          <div className="absolute -left-[35px] top-0 w-4 h-4 bg-background border-2 border-border rounded-full ring-4 ring-card flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-border" />
          </div>
          <p className="text-sm text-muted-foreground pt-1 ml-4 sm:ml-[144px]">Joined CARE360</p>
        </div>
      </div>
    </div>
  );
}
