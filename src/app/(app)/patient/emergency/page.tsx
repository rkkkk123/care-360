"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  ShieldAlert,
  Clock,
  User,
  CheckCircle2,
  Ambulance,
  ArrowLeft,
  Navigation,
  FileText,
  Hospital,
  Activity,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencyCarePage() {
  const [dispatchState, setDispatchState] = React.useState<"idle" | "dispatching" | "en_route">("idle");
  const [eta, setEta] = React.useState(360); // 6 minutes in seconds

  React.useEffect(() => {
    if (dispatchState === "en_route") {
      const interval = setInterval(() => setEta((prev) => Math.max(0, prev - 1)), 1000);
      return () => clearInterval(interval);
    }
  }, [dispatchState]);

  const emergencyHospitals = [
    {
      name: "Stanford Health Care Emergency Department",
      address: "900 Quarry Rd, Palo Alto, CA 94304",
      distance: "0.9 miles away",
      erStatus: "24/7 Level 1 Adult & Pediatric Trauma Center",
      waitTime: "~14 mins est. triage",
      phone: "(650) 723-5111",
    },
    {
      name: "Palo Alto Medical Foundation (PAMF) Urgent Care",
      address: "795 El Camino Real, Palo Alto, CA 94301",
      distance: "0.8 miles away",
      erStatus: "Walk-In Urgent Care • Open 7:00 AM – 10:00 PM Daily",
      waitTime: "~8 mins est. triage",
      phone: "(650) 321-4121",
    },
    {
      name: "El Camino Hospital Emergency Care",
      address: "2500 Grant Rd, Mountain View, CA 94040",
      distance: "4.5 miles away",
      erStatus: "Comprehensive 24/7 Emergency & Cardiac Center",
      waitTime: "~20 mins est. triage",
      phone: "(650) 940-7055",
    },
  ];

  const handleTriggerDispatch = () => {
    if (dispatchState !== "idle") return;
    setDispatchState("dispatching");
    setTimeout(() => {
      setDispatchState("en_route");
    }, 2000);
  };

  const formatETA = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Emergency SOS Response
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground ml-[52px]">
          Instant paramedical dispatch mapped to your geolocation. Do not close this application if you have triggered a dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dispatch & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Action Banner */}
          <motion.div 
            animate={{ 
              borderColor: dispatchState === "idle" ? "rgba(244, 63, 94, 0.3)" : "rgba(244, 63, 94, 0.8)",
              boxShadow: dispatchState === "idle" ? "0 10px 30px -10px rgba(244, 63, 94, 0.1)" : "0 0 40px -10px rgba(244, 63, 94, 0.4)"
            }}
            className="rounded-3xl border-2 bg-gradient-to-br from-rose-500/5 to-background p-6 sm:p-8 relative overflow-hidden transition-all duration-500"
          >
            {dispatchState === "idle" ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wide uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                    Rapid Paramedic Dispatch
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Require immediate medical intervention?</h2>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto sm:mx-0 leading-relaxed">
                    Tap to instantly transmit your live GPS coordinates, Digital Medical ID, and vital anomalies to the nearest dispatch center.
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTriggerDispatch}
                  className="h-32 w-32 rounded-full bg-rose-600 hover:bg-rose-500 shadow-2xl shadow-rose-600/50 flex flex-col items-center justify-center gap-2 text-white border-4 border-rose-400/30 transition-colors shrink-0"
                >
                  <ShieldAlert className="h-10 w-10" />
                  <span className="font-bold tracking-widest text-sm uppercase">SOS</span>
                </motion.button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 space-y-6"
              >
                <div className="flex items-start justify-between border-b border-rose-500/20 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <Ambulance className="h-6 w-6 animate-pulse" />
                      <h2 className="text-xl font-bold uppercase tracking-widest">
                        {dispatchState === "dispatching" ? "Locating Nearest Unit..." : "Unit MED-402 En Route"}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">GPS: 37.4419° N, 122.1430° W (Accuracy: 4m)</p>
                  </div>
                  {dispatchState === "en_route" && (
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Estimated Arrival</p>
                      <p className="text-4xl font-mono font-light text-foreground">{formatETA(eta)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 mt-0.5 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Medical ID Transmitted</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Allergies and conditions securely sent to MED-402.</p>
                    </div>
                  </div>
                  <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 mt-0.5 shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Contacts Alerted</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Spouse & Primary Care Physician notified via SMS.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Warning BG element */}
            <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
              <ShieldAlert className="h-64 w-64 text-rose-500" />
            </div>
          </motion.div>

          {/* Hospitals */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-semibold text-foreground">Nearest Emergency Centers</h3>
                <p className="text-xs text-muted-foreground">Pre-cleared with your insurance profile</p>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground opacity-50" />
            </div>

            <div className="space-y-4">
              {emergencyHospitals.map((hosp, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-border/60 bg-secondary/10 p-4 space-y-4 hover:border-primary/30 hover:bg-secondary/30 transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Hospital className="h-4 w-4 text-primary" />
                        {hosp.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{hosp.erStatus}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {hosp.waitTime}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {hosp.distance}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs flex-1 h-9 bg-background/50" asChild>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(hosp.name + " " + hosp.address)}`} target="_blank" rel="noopener noreferrer">
                        <Navigation className="h-3.5 w-3.5 mr-1.5" /> Navigate
                      </a>
                    </Button>
                    <Button size="sm" className="rounded-xl text-xs flex-1 h-9 bg-primary text-primary-foreground shadow-sm" asChild>
                      <a href={`tel:${hosp.phone.replace(/[^0-9]/g, "")}`}>
                        <Phone className="h-3.5 w-3.5 mr-1.5" /> Call {hosp.phone}
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Medical ID */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-1 shadow-sm overflow-hidden">
            <div className="bg-[#1A1C23] text-white p-6 rounded-[22px] relative overflow-hidden">
              {/* Card texture overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffffff 0%, transparent 50%)" }} />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <User className="h-5 w-5" />
                    <span className="text-xs font-bold tracking-widest uppercase">Medical ID</span>
                  </div>
                  <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded bg-white/10 border border-white/20">
                    Auto-Shared
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase font-semibold tracking-wider">Patient Name</p>
                    <p className="text-2xl font-light tracking-tight mt-0.5">Jane Doe</p>
                    <p className="text-xs text-white/70 font-mono mt-1">DOB: 04/12/1988 (38y)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[10px] text-white/50 uppercase font-semibold">Blood Type</p>
                      <p className="text-lg font-bold font-mono text-rose-400">O+ Pos</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[10px] text-white/50 uppercase font-semibold">Donor</p>
                      <p className="text-lg font-bold font-mono text-emerald-400">Yes</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-semibold mb-1">Critical Allergies</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium">Penicillin (Severe)</span>
                        <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium">Peanuts</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-semibold mb-1">Medical Conditions</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-1 rounded bg-white/10 border border-white/20 text-[11px] font-medium text-white/90">Mild Asthma</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Emergency Contacts</h4>
              
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">John Doe</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Spouse • (555) 349-1029</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-card hover:bg-primary/10 hover:text-primary shadow-sm border border-border/50">
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dr. Sharma</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">PCP • (650) 498-3200</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-card hover:bg-primary/10 hover:text-primary shadow-sm border border-border/50">
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
