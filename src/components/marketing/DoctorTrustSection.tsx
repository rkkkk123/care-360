import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Video, Stethoscope, ArrowRight } from "lucide-react";
import { mockDoctors } from "@/features/landing/data/demo-data";

export function DoctorTrustSection() {
  const doctor = mockDoctors[0];

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right">
            <div className="flex flex-col space-y-6">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                AI assists.<br />Doctors decide.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                AI creates a comprehensive summary of your health data, allowing verified doctors to focus entirely on your care, not on reading paperwork.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h4 className="font-semibold text-foreground">Verified Network</h4>
                  <p className="text-sm text-muted-foreground">Every doctor is rigorously vetted and verified.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Stethoscope className="w-8 h-8 text-primary" />
                  <h4 className="font-semibold text-foreground">Clinical Responsibility</h4>
                  <p className="text-sm text-muted-foreground">Decisions are always made by a human doctor.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.2}>
            <div className="relative rounded-3xl border border-border bg-background p-6 md:p-8 shadow-xl overflow-hidden flex flex-col gap-6">
              {/* Doctor Card Mockup */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">
                  {doctor.name.charAt(4)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    {doctor.verified && (
                      <Badge variant="default" className="h-5 px-1.5 py-0">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-4 bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Availability</p>
                  <p className="text-sm font-medium text-foreground">{doctor.availability}</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Consultation Fee</p>
                  <p className="text-sm font-medium text-foreground">{doctor.fee}</p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold tracking-wide text-primary uppercase">AI Patient Summary</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Patient presents with elevated LDL. Previous history of hypertension well-managed. Seeking review of recent lab work.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors bg-foreground text-background shadow hover:bg-foreground/90 h-10 px-6">
                  <Video className="w-4 h-4 mr-2" />
                  Book Video Consult
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
