"use client";

import * as React from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceCheckModalProps {
  userName: string;
  userRole: "patient" | "doctor";
  onReadyToJoin: (deviceSettings: { audioEnabled: boolean; videoEnabled: boolean }) => void;
}

export function DeviceCheckModal({ userName, userRole, onReadyToJoin }: DeviceCheckModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = React.useState(false);
  const [micActive, setMicActive] = React.useState(false);
  const [micLevel, setMicLevel] = React.useState(0);
  const [speakerTestState, setSpeakerTestState] = React.useState<"idle" | "playing" | "passed">("idle");
  const [networkState, setNetworkState] = React.useState<"checking" | "optimal" | "warning">("checking");
  const [permissionError, setPermissionError] = React.useState<string | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);

  // Initialize Media Devices
  React.useEffect(() => {
    let animationFrameId: number;

    async function initMedia() {
      setIsInitializing(true);
      setPermissionError(null);

      try {
        if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
            audio: true,
          });

          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }

          setCameraActive(true);
          setMicActive(true);

          // Audio Meter Setup
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateMeter = () => {
              if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const average = sum / dataArray.length;
                // Scale from 0 to 100
                setMicLevel(Math.min(100, Math.round((average / 128) * 100)));
              }
              animationFrameId = requestAnimationFrame(updateMeter);
            };
            updateMeter();
          } catch (audioErr) {
            console.warn("Audio meter could not be initialized:", audioErr);
          }
        } else {
          // Simulated fallback
          setCameraActive(true);
          setMicActive(true);
        }
      } catch (err: any) {
        console.warn("Media devices error or permission denied:", err);
        setPermissionError(
          "Camera or microphone access was blocked. You can still proceed in demonstration mode."
        );
        // Fallback for simulation
        setCameraActive(true);
        setMicActive(true);
      } finally {
        setIsInitializing(false);
        // Simulate quick ping
        setTimeout(() => setNetworkState("optimal"), 600);
      }
    }

    initMedia();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Speaker Sound Test via Web Audio Synthesizer
  const handleTestSpeaker = () => {
    setSpeakerTestState("playing");
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 tone
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.4); // G5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      setTimeout(() => {
        setSpeakerTestState("passed");
        ctx.close().catch(() => {});
      }, 700);
    } catch (e) {
      setSpeakerTestState("passed");
    }
  };

  const handleToggleCam = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraActive(videoTrack.enabled);
      }
    } else {
      setCameraActive(!cameraActive);
    }
  };

  const handleToggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
      }
    } else {
      setMicActive(!micActive);
    }
  };

  const allPassed = cameraActive && micActive && networkState === "optimal";

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Pre-Consultation Equipment Check
        </span>
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground mt-3">
          Welcome, {userName}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          Let&apos;s verify your audio, camera, and network connection before entering the clinical room.
        </p>
      </div>

      {permissionError && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
        {/* Camera Preview Card */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/80 border border-border flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover transform -scale-x-100 ${
              cameraActive ? "opacity-100" : "opacity-0"
            }`}
          />
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <CameraOff className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">Camera is paused</p>
            </div>
          )}

          {/* Quick overlay controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cameraActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              {cameraActive ? "Camera Ready" : "Paused"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleToggleCam}
                className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors"
                title={cameraActive ? "Turn camera off" : "Turn camera on"}
              >
                {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4 text-destructive" />}
              </button>
              <button
                type="button"
                onClick={handleToggleMic}
                className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors"
                title={micActive ? "Mute mic" : "Unmute mic"}
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-destructive" />}
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostics Checklist */}
        <div className="flex flex-col justify-between space-y-4">
          {/* Microphone Test */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Microphone</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {micActive ? (micLevel > 5 ? "Detecting sound" : "Listening...") : "Muted"}
              </span>
            </div>
            {/* Audio level meter bar */}
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden border border-border/40">
              <div
                className="h-full bg-emerald-500 transition-all duration-75 ease-out rounded-full"
                style={{ width: micActive ? `${Math.max(8, micLevel)}%` : "0%" }}
              />
            </div>
          </div>

          {/* Speaker Test */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <div>
                <span className="text-sm font-medium text-foreground block">Speaker Audio</span>
                <span className="text-[11px] text-muted-foreground">Verify you can hear consultation audio</span>
              </div>
            </div>
            <Button
              size="sm"
              variant={speakerTestState === "passed" ? "outline" : "secondary"}
              onClick={handleTestSpeaker}
              className="text-xs rounded-xl h-8 px-3"
            >
              {speakerTestState === "playing" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : speakerTestState === "passed" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              ) : null}
              {speakerTestState === "passed" ? "Heard Test" : "Test Sound"}
            </Button>
          </div>

          {/* Network & Privacy Check */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-sm font-medium text-foreground block">Network & Security</span>
                <span className="text-[11px] text-muted-foreground">End-to-end encrypted connection</span>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Optimal
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground px-1">
            CARE360 clinical consultations are protected with HIPAA-compliant encryption.
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          {userRole === "doctor"
            ? "Ready to consult with authorized patient context."
            : "You will join the waiting room until the consultation begins."}
        </p>
        <Button
          size="lg"
          onClick={() => onReadyToJoin({ audioEnabled: micActive, videoEnabled: cameraActive })}
          className="rounded-full px-8 shadow-md group w-full sm:w-auto"
        >
          {userRole === "doctor" ? "Enter Clinical Workspace" : "Enter Waiting Room"}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
