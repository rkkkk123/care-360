"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
  Award,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Video,
  FileCheck,
  Hospital,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { auth } from "@/lib/auth/auth-service";

export default function DoctorOnboarding() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isEntering, setIsEntering] = React.useState(false);

  // Doctor Form State
  const [doctorName, setDoctorName] = React.useState("Dr. Priya Sharma, MD");
  const [specialty, setSpecialty] = React.useState("Cardiology & Internal Medicine");
  const [experienceYears, setExperienceYears] = React.useState("14");
  const [affiliation, setAffiliation] = React.useState("Stanford Health Care");

  const [licenseNumber, setLicenseNumber] = React.useState("CA-MED-928410");
  const [npiNumber, setNpiNumber] = React.useState("1948201948");
  const [medicalSchool, setMedicalSchool] = React.useState("Harvard Medical School");

  const [consultFee, setConsultFee] = React.useState("150");
  const [consultModes, setConsultModes] = React.useState<string[]>(["Video Telehealth", "In-Person Clinic"]);

  const toggleMode = (m: string) => {
    setConsultModes((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsEntering(true);
      try {
        await auth.updateProfile({
          firstName: doctorName.split(" ")[0] || "Doctor",
          lastName: doctorName.split(" ").slice(1).join(" ") || "User",
          onboardingStatus: "completed",
        });
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        router.push("/doctor");
      }, 400);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const titles = [
    "Physician Identity & Affiliation",
    "Medical Licensing & Board Credentialing",
    "Clinical Practice & Telehealth Parameters",
    "Review & Launch Clinical Portal",
  ];

  const descriptions = [
    "Enter your professional credentials and hospital health system affiliations.",
    "Verify state medical board license, National Provider ID (NPI), and medical degree.",
    "Configure consultation fees, telehealth video settings, and appointment availability.",
    "Your provider credentials are verified. Access your doctor clinical workspace.",
  ];

  return (
    <OnboardingShell
      title={titles[step - 1]}
      description={descriptions[step - 1]}
      currentStep={step}
      totalSteps={4}
    >
      <div className="space-y-6 mb-8">
        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Physician Full Name & Degree
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Specialty
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hospital Affiliation
                </label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CREDENTIALS */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                State Medical Board License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                National Provider Identifier (NPI)
              </label>
              <input
                type="text"
                value={npiNumber}
                onChange={(e) => setNpiNumber(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Medical School & Residency
              </label>
              <input
                type="text"
                value={medicalSchool}
                onChange={(e) => setMedicalSchool(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PRACTICE DETAILS */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Consultation Fee (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={consultFee}
                  onChange={(e) => setConsultFee(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-border bg-secondary/30 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Authorized Consultation Modes
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Video Telehealth", "In-Person Clinic"].map((mode) => {
                  const isSelected = consultModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleMode(mode)}
                      className={`p-3.5 rounded-2xl text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{mode}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & LAUNCH */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{doctorName}</h3>
                    <p className="text-xs text-muted-foreground">{specialty} • {affiliation}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Board Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-card p-3 border border-border space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">License</span>
                  <p className="font-semibold text-foreground">{licenseNumber}</p>
                </div>
                <div className="rounded-2xl bg-card p-3 border border-border space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">NPI</span>
                  <p className="font-semibold text-foreground">{npiNumber}</p>
                </div>
                <div className="rounded-2xl bg-card p-3 border border-border space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">Session Fee</span>
                  <p className="font-semibold text-emerald-600">${consultFee} / 30m</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Clinical Room Ready</p>
              <p>You can now conduct encrypted WebRTC sessions, review patient histories, and issue digital prescriptions.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
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
          className="rounded-full text-xs px-6 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 cursor-pointer"
        >
          {isEntering ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Entering Workspace...</span>
            </span>
          ) : step === 4 ? (
            <span className="flex items-center gap-1.5">
              <span>Enter Doctor Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </div>
    </OnboardingShell>
  );
}
