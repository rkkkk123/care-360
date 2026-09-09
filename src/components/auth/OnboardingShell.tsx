"use client";

import * as React from "react";
import { FadeIn } from "@/components/motion/FadeIn";

interface OnboardingShellProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export function OnboardingShell({
  title,
  description,
  currentStep,
  totalSteps,
  children,
}: OnboardingShellProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-4">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <FadeIn>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light tracking-tight text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
          {children}
        </div>
      </FadeIn>
    </div>
  );
}
