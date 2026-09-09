"use client";

import * as React from "react";
import {
  ShieldCheck,
  Clock,
  UserCheck,
  Video,
  FileCheck,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WaitingRoomProps {
  doctorName: string;
  specialization: string;
  doctorAvatar: string;
  scheduledTime: string;
  authorizedReportTitle?: string;
  doctorReady: boolean;
  onEnterRoom: () => void;
}

export function WaitingRoom({
  doctorName,
  specialization,
  doctorAvatar,
  scheduledTime,
  authorizedReportTitle,
  doctorReady,
  onEnterRoom,
}: WaitingRoomProps) {
  // Auto-redirect if doctor is ready after 2.5 seconds
  React.useEffect(() => {
    if (doctorReady) {
      const timer = setTimeout(() => {
        onEnterRoom();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [doctorReady, onEnterRoom]);

  return (
    <div className="max-w-2xl mx-auto bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl text-center">
      {/* Reassurance Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Secure Virtual Waiting Suite</span>
      </div>

      <h2 className="text-3xl font-light tracking-tight text-foreground mb-2">
        You&apos;re Checked In
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
        We&apos;ve informed {doctorName} that you are ready. Please remain on this screen.
      </p>

      {/* Doctor Card */}
      <div className="bg-secondary/40 border border-border/70 rounded-2xl p-6 text-left mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-serif text-lg font-medium text-primary shrink-0">
            {doctorAvatar || "DR"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground truncate">{doctorName}</h3>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{specialization}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Scheduled for {scheduledTime}
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-primary" />
                Encrypted Video
              </span>
            </div>
          </div>
        </div>

        {authorizedReportTitle && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
            <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Authorized Health Record: <strong className="text-foreground">{authorizedReportTitle}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Waiting Status Card */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 mb-8">
        {doctorReady ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 animate-bounce">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">{doctorName} is in the room!</h4>
              <p className="text-xs text-muted-foreground mt-1">Connecting to your clinical session...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Waiting for clinician to connect</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated wait time: less than 1 minute.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={onEnterRoom}
          className="rounded-full px-8 shadow-md group w-full sm:w-auto"
        >
          <Video className="w-4 h-4 mr-2" />
          Join Consultation Room Now
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground mt-6">
        Leaving this page will retain your place in line.
      </p>
    </div>
  );
}
