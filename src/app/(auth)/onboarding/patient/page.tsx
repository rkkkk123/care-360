"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Heart,
  Activity,
  ShieldCheck,
  MapPin,
  Sparkles,
  CheckCircle2,
  Video,
  Home,
  Store,
  Pill,
  ArrowRight,
  ArrowLeft,
  Mic,
  Calendar,
  Stethoscope,
  Clock,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { auth } from "@/lib/auth/auth-service";

export default function PatientOnboarding() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isEntering, setIsEntering] = React.useState(false);

  // Form State
  const [fullName, setFullName] = React.useState("Jane Doe");
  const [focusArea, setFocusArea] = React.useState("Managing a Chronic Condition");
  const [language, setLanguage] = React.useState("English");

  const [dob, setDob] = React.useState("1994-06-15");
  const [gender, setGender] = React.useState("Female");
  const [bloodType, setBloodType] = React.useState("O+");
  const [allergies, setAllergies] = React.useState<string[]>(["Penicillin"]);

  const [consultType, setConsultType] = React.useState("Video Telehealth");
  const [devices, setDevices] = React.useState<string[]>(["Apple Health", "Dexcom CGM"]);

  const [aiEnabled, setAiEnabled] = React.useState(true);
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [interactionAlerts, setInteractionAlerts] = React.useState(true);

  const [location, setLocation] = React.useState("Palo Alto, CA 94301");
  const [preferredPharmacy, setPreferredPharmacy] = React.useState(
    "Walgreens Digital Care #4190 (859 El Camino Real)"
  );
  const [deliveryMode, setDeliveryMode] = React.useState("Same-Day Courier Delivery");

  const toggleAllergy = (item: string) => {
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const toggleDevice = (item: string) => {
    setDevices((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setIsEntering(true);
      try {
        await auth.updateProfile({
          firstName: fullName.split(" ")[0],
          lastName: fullName.split(" ").slice(1).join(" "),
          onboardingStatus: "completed",
          // We can also pass other custom fields to Supabase user_metadata if needed
        });
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        router.push("/patient");
      }, 400);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepTitles = [
    "Welcome & Health Focus",
    "Demographics & Vitals Baseline",
    "Care Delivery Preferences",
    "AI Intelligence & Accessibility",
    "Pharmacy & Delivery Geo-Location",
    "Review & Launch Your Care Ecosystem",
  ];

  const stepDescriptions = [
    "Tell us what brings you to CARE360 so we can personalize your health loop.",
    "Essential biological parameters for personalized dosages and lab evaluations.",
    "Choose how you prefer to consult with physicians and connect your devices.",
    "Tailor Gemini clinical intelligence, speech recognition, and allergy safety flags.",
    "Pinpoint your dispensing pharmacy for real-time inventory and instant fulfillment.",
    "Your personalized profile is configured and ready. Enter your complete ecosystem.",
  ];

  return (
    <OnboardingShell
      title={stepTitles[step - 1]}
      description={stepDescriptions[step - 1]}
      currentStep={step}
      totalSteps={6}
    >
      <div className="space-y-6 mb-8">
        {/* STEP 1: IDENTITY & HEALTH FOCUS */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Health Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Managing a Chronic Condition",
                  "Preventative Wellness & Vitals",
                  "Routine Prescriptions & Refills",
                  "Specialist Consultation & Second Opinion",
                ].map((focus) => (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => setFocusArea(focus)}
                    className={`p-3.5 rounded-2xl text-left border text-xs font-medium transition-all ${
                      focusArea === focus
                        ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                        : "border-border/70 bg-card hover:bg-secondary/40 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{focus}</span>
                      {focusArea === focus && <CheckCircle2 className="h-4 w-4 text-primary shrink-0 ml-2" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred Language for AI & Consultation
              </label>
              <div className="flex flex-wrap gap-2">
                {["English", "हिन्दी (Hindi)", "Español (Spanish)"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      language === lang
                        ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DEMOGRAPHICS & VITALS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Biological Sex
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other / Non-Binary</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Blood Type
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                >
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Known Allergies & Contraindications</span>
                <span className="text-[10px] text-rose-500 font-normal">Included on emergency Medical ID</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Penicillin",
                  "Sulfa Drugs",
                  "Aspirin",
                  "Latex",
                  "Peanuts",
                  "Shellfish",
                  "No Known Allergies",
                ].map((item) => {
                  const isSelected = allergies.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAllergy(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-600 font-bold"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CARE DELIVERY PREFERENCES */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred Consultation Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    type: "Video Telehealth",
                    icon: Video,
                    badge: "Fastest • Zero Wait",
                    desc: "Encrypted WebRTC call from home with live AI copilot.",
                  },
                  {
                    type: "In-Person Clinic",
                    icon: Stethoscope,
                    badge: "Stanford & Bay Area",
                    desc: "Hospital clinics and private specialist offices.",
                  },
                  {
                    type: "In-Home Healthcare",
                    icon: Home,
                    badge: "Bedside Care",
                    desc: "Nurse/doctor visits and phlebotomy blood draws at your door.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = consultType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setConsultType(item.type)}
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                          : "border-border/70 bg-card hover:bg-secondary/40 text-foreground"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-foreground">{item.type}</h4>
                        <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sync Health Devices & Biomarkers
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Apple Health", "Fitbit", "Dexcom CGM", "Omron BP Cuff", "Withings Scale"].map(
                  (dev) => {
                    const isSelected = devices.includes(dev);
                    return (
                      <button
                        key={dev}
                        type="button"
                        onClick={() => toggleDevice(dev)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                          isSelected
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold"
                            : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{dev}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: AI & ACCESSIBILITY */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">
                    Gemini Clinical Intelligence & Lab OCR
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Generate plain-language explanations of blood tests and drug interactions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="h-4 w-4 accent-primary cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-semibold text-foreground">
                    Bilingual Voice Assistant (English / हिन्दी)
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Voice-activated speech dictation and audio responses for hands-free health queries.
                </p>
              </div>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="h-4 w-4 accent-primary cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <p className="text-xs font-semibold text-foreground">
                    Prescription & Allergy Interaction Alarms
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Real-time warning if a prescribed drug clashes with your food intake or medical history.
                </p>
              </div>
              <input
                type="checkbox"
                checked={interactionAlerts}
                onChange={(e) => setInteractionAlerts(e.target.checked)}
                className="h-4 w-4 accent-primary cursor-pointer rounded"
              />
            </div>
          </div>
        )}

        {/* STEP 5: PHARMACY & DISPATCH GEO-LOCATION */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Your Location (For Doctor Matching & Delivery)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred Connected Dispensing Pharmacy
              </label>
              <div className="space-y-2">
                {[
                  "Walgreens Digital Care #4190 (859 El Camino Real, 0.8 mi • In Stock)",
                  "CVS Health Pharmacy #9120 (352 University Ave, 1.2 mi • 24 Hours)",
                  "Stanford Health Care Outpatient Pharmacy (Blake Wilbur Dr, 2.1 mi)",
                ].map((pharm) => (
                  <button
                    key={pharm}
                    type="button"
                    onClick={() => setPreferredPharmacy(pharm)}
                    className={`w-full p-3 rounded-2xl text-left border text-xs font-medium transition-all ${
                      preferredPharmacy === pharm
                        ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                        : "border-border/70 bg-card hover:bg-secondary/40 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{pharm}</span>
                      {preferredPharmacy === pharm && <CheckCircle2 className="h-4 w-4 text-primary shrink-0 ml-2" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prescription Delivery Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Same-Day Courier Delivery", "In-Store Express Pickup"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDeliveryMode(mode)}
                    className={`p-3 rounded-2xl text-xs font-medium border text-center transition-all ${
                      deliveryMode === mode
                        ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW, SUMMARY & COMPLETE PORTAL ACCESS HUB */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Health Passport Card */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-primary/5 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
                    {fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{fullName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {gender}, 32 yrs • Blood: <span className="font-mono font-bold text-primary">{bloodType}</span>
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Profile Ready
                </span>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-secondary/40 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                    Primary Health Focus
                  </span>
                  <p className="font-semibold text-foreground">{focusArea}</p>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                    Allergies & Contraindications
                  </span>
                  <p className="font-semibold text-rose-600">
                    {allergies.length > 0 ? allergies.join(", ") : "None reported"}
                  </p>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                    Consultation & Language
                  </span>
                  <p className="font-semibold text-foreground">
                    {consultType} • {language}
                  </p>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                    Dispensing Pharmacy & Mode
                  </span>
                  <p className="font-semibold text-foreground truncate">{preferredPharmacy.split("(")[0]}</p>
                  <p className="text-[10px] text-primary">{deliveryMode}</p>
                </div>
              </div>
            </div>

            {/* Direct Portal Access Launchpad */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Direct Portal Access Launchpad
                </h4>
                <span className="text-[11px] text-primary font-medium">All 4 portals unlocked</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <Link
                  href="/patient"
                  className="rounded-2xl border border-primary/40 bg-primary/10 p-3 text-center space-y-1 hover:bg-primary/20 transition-all group"
                >
                  <Heart className="h-5 w-5 text-primary mx-auto" />
                  <p className="font-bold text-foreground group-hover:text-primary">Patient Hub</p>
                  <p className="text-[10px] text-muted-foreground">Main Dashboard</p>
                </Link>

                <Link
                  href="/patient/ai/scanner"
                  className="rounded-2xl border border-border bg-card p-3 text-center space-y-1 hover:border-primary/40 hover:bg-secondary/40 transition-all group"
                >
                  <Sparkles className="h-5 w-5 text-purple-500 mx-auto" />
                  <p className="font-semibold text-foreground group-hover:text-primary">AI Scanners</p>
                  <p className="text-[10px] text-muted-foreground">Pills • Leaves • Skin</p>
                </Link>

                <Link
                  href="/patient/doctors"
                  className="rounded-2xl border border-border bg-card p-3 text-center space-y-1 hover:border-primary/40 hover:bg-secondary/40 transition-all group"
                >
                  <Stethoscope className="h-5 w-5 text-emerald-500 mx-auto" />
                  <p className="font-semibold text-foreground group-hover:text-primary">Find Doctors</p>
                  <p className="text-[10px] text-muted-foreground">Book Consultations</p>
                </Link>

                <Link
                  href="/patient/pharmacies"
                  className="rounded-2xl border border-border bg-card p-3 text-center space-y-1 hover:border-primary/40 hover:bg-secondary/40 transition-all group"
                >
                  <Store className="h-5 w-5 text-blue-500 mx-auto" />
                  <p className="font-semibold text-foreground group-hover:text-primary">Pharmacies</p>
                  <p className="text-[10px] text-muted-foreground">Stock & Delivery</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="rounded-full text-xs px-5"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={isEntering}
          className="rounded-full text-xs px-6 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 cursor-pointer"
        >
          {isEntering ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Entering Dashboard...</span>
            </span>
          ) : step === 6 ? (
            <span className="flex items-center gap-1.5">
              <span>Enter CARE360 Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Continue to Step {step + 1}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </div>
    </OnboardingShell>
  );
}
