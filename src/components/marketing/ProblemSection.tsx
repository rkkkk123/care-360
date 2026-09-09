import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FileText, UserSquare2, Pill, Store, ActivitySquare } from "lucide-react";

export function ProblemSection() {
  const items = [
    { icon: FileText, label: "Health records" },
    { icon: UserSquare2, label: "Doctor" },
    { icon: Pill, label: "Prescription" },
    { icon: Store, label: "Pharmacy" },
    { icon: ActivitySquare, label: "Reports" },
  ];

  return (
    <Section className="bg-secondary/30">
      <Container>
        <Reveal>
          <SectionHeading 
            title="Your health shouldn't live in disconnected apps." 
            subtitle="The healthcare experience is often fragmented. Reports are in one place, doctors in another, and pharmacies in yet another."
          />
        </Reveal>

        <div className="mt-16 flex flex-col items-center">
          <Stagger className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
            {items.map((item, i) => (
              <StaggerItem key={i} className="flex flex-col items-center gap-3 opacity-50 grayscale">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-dashed border-border flex items-center justify-center bg-background shadow-sm">
                  <item.icon className="w-8 h-8 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.4} className="w-full max-w-3xl">
            <div className="relative rounded-3xl border border-border bg-background p-8 md:p-12 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-3xl md:text-5xl font-bold tracking-tight mb-4">CARE<span className="font-light">360</span></span>
                <p className="text-xl md:text-2xl text-foreground font-medium">One connected ecosystem.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
