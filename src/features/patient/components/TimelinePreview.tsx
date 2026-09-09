import * as React from "react";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatMonthDay } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

interface TimelinePreviewProps {
  events: TimelineEvent[];
}

export function TimelinePreview({ events }: TimelinePreviewProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Health Timeline
        </span>
        <Link href="/patient/timeline" className="text-xs font-medium text-primary hover:underline flex items-center">
          Full timeline <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="relative pl-4 border-l-2 border-border/50 space-y-8">
        {events.slice(0, 3).map((event, i) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-background border-2 border-primary rounded-full ring-4 ring-card" />
            <div>
              <p className="text-xs text-muted-foreground mb-1" suppressHydrationWarning>
                {formatMonthDay(event.date)}
              </p>
              <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
