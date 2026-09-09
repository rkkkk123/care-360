"use client";

import * as React from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  PhoneOff,
  ShieldCheck,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  AlertCircle,
  Wifi,
  PanelRightOpen,
  PanelRightClose,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoConnectionState } from "@/types/models/consultation";

interface VideoStageProps {
  userRole: "patient" | "doctor";
  localUserName: string;
  remoteUserName: string;
  remoteSubtext: string;
  isDemoMode: boolean;
  connectionState: VideoConnectionState;
  onLeaveCall: () => void;
  onToggleDrawer?: () => void;
  isDrawerOpen?: boolean;
}

export function VideoStage({
  userRole,
  localUserName,
  remoteUserName,
  remoteSubtext,
  isDemoMode,
  connectionState,
  onLeaveCall,
  onToggleDrawer,
  isDrawerOpen = false,
}: VideoStageProps) {
  const localVideoRef = React.useRef<HTMLVideoElement>(null);

  const [isAudioMuted, setIsAudioMuted] = React.useState(false);
  const [isVideoPaused, setIsVideoPaused] = React.useState(false);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [isLocalPipMinimized, setIsLocalPipMinimized] = React.useState(false);
  const [durationSeconds, setDurationSeconds] = React.useState(0);
  const [showConfirmLeave, setShowConfirmLeave] = React.useState(false);

  // Timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Duration
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Local camera stream initialization
  React.useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          activeStream = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(() => {});
          }
        }
      } catch (err) {
        console.warn("Could not start local camera stream:", err);
      }
    }
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
    setIsAudioMuted(!isAudioMuted);
  };

  const handleToggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
    setIsVideoPaused(!isVideoPaused);
  };

  return (
    <div className="relative flex-1 h-full min-h-[500px] w-full bg-card rounded-3xl overflow-hidden border border-border flex flex-col shadow-xl">
      {/* Top Overlay Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Remote participant badge */}
        <div className="flex items-center gap-3 bg-card/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-border/80 shadow-sm pointer-events-auto transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-tight">{remoteUserName}</h4>
            <p className="text-[10px] text-muted-foreground">{remoteSubtext}</p>
          </div>
        </div>

        {/* Center Timer & Encryption */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-border/80 shadow-sm text-foreground text-xs font-mono pointer-events-auto transition-all">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{formatTime(durationSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-border/80 shadow-sm text-emerald-600 text-xs pointer-events-auto transition-all">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline font-medium">256-Bit Encrypted</span>
            {isDemoMode && (
              <span className="text-[9px] uppercase tracking-wider font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded ml-1">
                Demo
              </span>
            )}
          </div>
        </div>

        {/* Drawer toggle (Doctor or Mobile) */}
        {onToggleDrawer && (
          <button
            type="button"
            onClick={onToggleDrawer}
            className="flex items-center gap-1.5 bg-card/95 hover:bg-secondary backdrop-blur-md px-3 py-1.5 rounded-2xl border border-border/80 shadow-sm text-foreground text-xs font-medium pointer-events-auto transition-all duration-200"
          >
            {isDrawerOpen ? (
              <>
                <PanelRightClose className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Hide Records</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Open Records & AI</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Reconnection Alert Banner if applicable */}
      {connectionState === "reconnecting" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-white px-4 py-2 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-lg backdrop-blur-md animate-pulse">
          <AlertCircle className="w-4 h-4" />
          <span>Connection interrupted. Reconnecting automatically...</span>
        </div>
      )}

      {/* Dominant Peer Video Feed */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-secondary/30">
        {isScreenSharing ? (
          // Screen share presentation view
          <div className="w-full h-full p-6 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-card border border-border rounded-2xl p-6 shadow-xl text-card-foreground">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Shared Clinical Artifact
                </span>
                <span className="text-xs text-muted-foreground">Comprehensive Metabolic Panel</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-secondary/50 border border-border/50">
                  <span className="text-foreground">Fasting Glucose</span>
                  <span className="text-emerald-600 font-semibold">85 mg/dL (Normal)</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-secondary/50 border border-border/50">
                  <span className="text-foreground">25-OH Vitamin D</span>
                  <span className="text-amber-600 font-semibold">24 ng/mL (Mild Low)</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-secondary/50 border border-border/50">
                  <span className="text-foreground">Total Cholesterol</span>
                  <span className="text-emerald-600 font-semibold">175 mg/dL (Normal)</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-4 text-center">
                Presenter is sharing authorized lab records in real-time.
              </p>
            </div>
          </div>
        ) : (
          // Clinician / Patient Virtual Feed
          <div className="relative w-full h-full flex items-center justify-center">
            {userRole === "patient" ? (
              // Patient sees Dr. Ananya Sharma
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
                {/* Clinical Office Ambient Background Simulation */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-sky-500/5 to-transparent" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4 overflow-hidden">
                    <span className="font-serif text-3xl sm:text-4xl font-semibold text-emerald-700 tracking-wider">
                      AS
                    </span>
                    {/* Subtle Speaking Wave Ring */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/30 animate-ping opacity-30 pointer-events-none" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Dr. Ananya Sharma</h3>
                  <p className="text-xs text-muted-foreground mt-1">Internal Medicine & Metabolic Health</p>
                  <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-medium px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Clinical Consultation</span>
                  </div>
                </div>
              </div>
            ) : (
              // Doctor sees Jane Doe
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-emerald-500/5 to-transparent" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10 mb-4 overflow-hidden">
                    <span className="font-serif text-3xl sm:text-4xl font-semibold text-primary tracking-wider">
                      JD
                    </span>
                    <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 animate-ping opacity-30 pointer-events-none" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Jane Doe (Patient)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Authorized health context attached</p>
                  <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-medium px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Patient Video Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local Picture-in-Picture Self View */}
        <div
          className={`absolute bottom-20 right-4 z-30 transition-all duration-300 rounded-2xl overflow-hidden border-2 border-border bg-card shadow-xl ${
            isLocalPipMinimized
              ? "w-20 h-16 opacity-85 hover:opacity-100"
              : "w-36 h-28 sm:w-48 sm:h-36"
          }`}
        >
          <video
            ref={localVideoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover transform -scale-x-100 ${
              isVideoPaused ? "opacity-0" : "opacity-100"
            }`}
          />
          {isVideoPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground text-xs">
              <VideoOff className="w-5 h-5 mb-1" />
            </div>
          )}

          {/* Local Name Badge & Minimize Button */}
          <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[10px] text-foreground font-medium bg-card/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-border/40">
            <span className="truncate max-w-[80px]">{localUserName} (You)</span>
            <button
              type="button"
              onClick={() => setIsLocalPipMinimized(!isLocalPipMinimized)}
              className="p-0.5 hover:text-primary transition-colors"
              title={isLocalPipMinimized ? "Expand" : "Minimize"}
            >
              {isLocalPipMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-30 px-4 py-3 bg-card/95 backdrop-blur-xl border-t border-border flex items-center justify-center gap-3 sm:gap-4 shadow-sm">
        {/* Audio Mute Button */}
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center ${
            isAudioMuted
              ? "bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20"
              : "bg-secondary text-foreground hover:bg-secondary/80 border border-border shadow-sm"
          }`}
          title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle Button */}
        <button
          type="button"
          onClick={handleToggleVideo}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center ${
            isVideoPaused
              ? "bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20"
              : "bg-secondary text-foreground hover:bg-secondary/80 border border-border shadow-sm"
          }`}
          title={isVideoPaused ? "Turn camera on" : "Turn camera off"}
        >
          {isVideoPaused ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
        </button>

        {/* Screen Share Button */}
        <button
          type="button"
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center ${
            isScreenSharing
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-secondary text-foreground hover:bg-secondary/80 border border-border shadow-sm"
          }`}
          title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        {/* Leave / End Call Button */}
        <button
          type="button"
          onClick={() => setShowConfirmLeave(true)}
          className="p-3 sm:p-3.5 px-4 sm:px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all duration-200"
        >
          <PhoneOff className="w-4 h-4" />
          <span>{userRole === "doctor" ? "End Call" : "Leave"}</span>
        </button>
      </div>

      {/* Confirm Leave Modal */}
      {showConfirmLeave && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl text-foreground">
            <h3 className="text-lg font-medium mb-2">
              {userRole === "doctor" ? "End Consultation Call?" : "Leave Consultation?"}
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              {userRole === "doctor"
                ? "Ending the video call will not finalize your notes. You can still review, complete your assessment, and finalize records."
                : "You can rejoin this consultation as long as your scheduled appointment window remains open."}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs"
                onClick={() => setShowConfirmLeave(false)}
              >
                Stay in Call
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl text-xs"
                onClick={() => {
                  setShowConfirmLeave(false);
                  onLeaveCall();
                }}
              >
                {userRole === "doctor" ? "End Call" : "Leave Now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
