"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Phone,
  Navigation,
  Activity,
  UserCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeVisitBookingPage() {
  const [selectedService, setSelectedService] = React.useState("service_blood");
  const [selectedDate, setSelectedDate] = React.useState("Tomorrow, 9:00 AM – 11:00 AM");
  const [address, setAddress] = React.useState("1248 Waverley St, Palo Alto, CA 94301");
  const [patientNotes, setPatientNotes] = React.useState("Fasting blood draw for repeat metabolic & Vitamin D panel.");
  
  // States for confirmation sequence
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    // Simulate API call and dispatch logic
    setTimeout(() => {
      setIsConfirming(false);
      setBookingConfirmed(true);
    }, 2000);
  };

  const homeServices = [
    {
      id: "service_blood",
      title: "Home Phlebotomy & Blood Draw",
      description: "Certified phlebotomist arrives with sterile cold-chain kit to collect lab samples at your kitchen table.",
      duration: "20 mins",
      fee: "$45.00",
      clinicianTitle: "Licensed Clinical Phlebotomist",
    },
    {
      id: "service_doctor",
      title: "In-Person Home Doctor Visit",
      description: "Board-certified internal medicine or family GP visits your home for physical evaluation & vitals check.",
      duration: "45 mins",
      fee: "$120.00",
      clinicianTitle: "Attending Physician, MD",
    },
    {
      id: "service_nurse",
      title: "Post-Op Wound & Nursing Care",
      description: "Registered nurse arrives for sterile wound redressing, suture inspection, and post-discharge recovery monitoring.",
      duration: "30 mins",
      fee: "$65.00",
      clinicianTitle: "Registered Nurse (RN)",
    },
    {
      id: "service_elderly",
      title: "Elderly Vital & Mobility Assessment",
      description: "Comprehensive geriatric screening: blood pressure, SpO2, blood glucose, fall risk evaluation.",
      duration: "40 mins",
      fee: "$55.00",
      clinicianTitle: "Geriatric Care Specialist",
    },
  ];

  const timeSlots = [
    "Tomorrow, 8:00 AM – 10:00 AM",
    "Tomorrow, 10:00 AM – 12:00 PM",
    "Tomorrow, 1:00 PM – 3:00 PM",
    "Tomorrow, 4:00 PM – 6:00 PM",
  ];

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Home Healthcare Dispatch
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
            Premium Care
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Deploy verified clinical professionals directly to your location. Fast, sterile, and perfectly integrated with your health timeline.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {bookingConfirmed ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Live Tracking Map UI Mock */}
            <div className="relative rounded-3xl overflow-hidden border border-border h-[400px] lg:h-[500px] bg-[#1A1C23] shadow-xl group">
              {/* Simulated Map Background */}
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity"
                style={{
                  backgroundImage: `radial-gradient(circle at center, transparent 0%, #1A1C23 70%), 
                  repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.05) 40px),
                  repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.05) 40px)`
                }}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Route Line Mock */}
                <svg className="absolute w-full h-full opacity-30" preserveAspectRatio="none">
                  <path d="M 100,300 C 200,300 200,200 300,200 S 400,100 500,150" stroke="#34C759" strokeWidth="4" strokeDasharray="8 8" fill="none" className="animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* Clinician Marker */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative z-10 -mt-20 ml-20"
                >
                  <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping" />
                  <div className="relative h-12 w-12 rounded-full border-4 border-[#1A1C23] bg-primary flex items-center justify-center shadow-2xl">
                    <Navigation className="h-5 w-5 text-white -mt-0.5 ml-0.5 fill-current" />
                  </div>
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5 border border-border whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    En Route
                  </div>
                </motion.div>

                {/* Home Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 -ml-32">
                  <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-[#1A1C23] shadow-lg" />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/50">Destination</div>
                </div>
              </div>

              {/* ETA Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between p-4 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Estimated Arrival</p>
                    <p className="text-white font-bold text-lg">14 Minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Distance</p>
                  <p className="text-white font-medium text-sm">3.2 mi</p>
                </div>
              </div>
            </div>

            {/* Clinician Profile & Details */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Dispatch Confirmed
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Your clinician is on the way.</h2>
                <p className="text-sm text-muted-foreground">
                  The clinical team has been dispatched and your home environment requirements have been securely transmitted.
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card/50 shadow-sm backdrop-blur-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                        <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border-2 border-background flex items-center justify-center">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Sarah Jenkins, RN</h3>
                      <p className="text-xs text-muted-foreground">Verified Phlebotomist • #CA-RN-88192</p>
                    </div>
                  </div>
                  <Button size="icon" variant="outline" className="rounded-full shadow-sm h-10 w-10">
                    <Phone className="h-4 w-4 text-primary" />
                  </Button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold text-foreground text-right w-1/2 truncate">
                      {homeServices.find((s) => s.id === selectedService)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-semibold text-foreground text-right w-1/2 truncate">
                      {address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button className="rounded-full flex-1 shadow-md text-xs font-semibold" asChild>
                  <Link href="/patient/timeline">View Health Timeline</Link>
                </Button>
                <Button variant="outline" className="rounded-full flex-1 text-xs" onClick={() => setBookingConfirmed(false)}>
                  Cancel Dispatch
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Service Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                Step 1: Select Care Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeServices.map((service) => {
                  const isSelected = selectedService === service.id;
                  return (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative rounded-3xl p-5 cursor-pointer transition-all overflow-hidden border ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/30 shadow-sm"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                      )}
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${
                                isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-primary"
                              }`}
                            >
                              <Activity className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground leading-tight">{service.title}</h4>
                              <span className="text-[10px] font-medium text-primary uppercase tracking-wide">{service.clinicianTitle}</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-foreground text-sm bg-secondary px-2 py-1 rounded-lg">{service.fee}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium bg-secondary/50 inline-flex px-2 py-1 rounded-md">
                          <Clock className="h-3 w-3" /> ~{service.duration}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Time & Destination Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Slot Picker */}
              <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Step 2: Arrival Window</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {timeSlots.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDate(slot)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all ${
                        selectedDate === slot
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-md"
                          : "border-border bg-secondary/20 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address & Notes */}
              <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-sm text-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Step 3: Location Details</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-medium ml-1">Secure Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-medium ml-1">Clinical Access Instructions</label>
                      <textarea
                        rows={3}
                        value={patientNotes}
                        onChange={(e) => setPatientNotes(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-secondary/20 p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        placeholder="E.g., Gate code is 1234. Fasting since midnight."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <p className="text-[10px] leading-tight font-medium">
                    CARE360 strictly deploys background-checked, licensed clinical staff. 
                    All data is end-to-end encrypted under HIPAA standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Action Bar */}
            <div className="sticky bottom-20 md:bottom-8 z-20">
              <motion.div 
                className="rounded-full border border-border/50 bg-background/80 backdrop-blur-xl p-2 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="hidden sm:flex items-center gap-3 px-4 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Selected: {homeServices.find((s) => s.id === selectedService)?.title}
                  </span>
                </div>

                <Button
                  size="lg"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-sm font-bold shadow-lg shadow-primary/20 w-full sm:w-auto h-12 md:h-14 transition-all"
                >
                  {isConfirming ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Dispatching Clinical Team...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Confirm Dispatch
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
