import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ShieldCheck, Lock, Eye } from "lucide-react";

export function TrustSection() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Healthcare needs trust.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              CARE360 is built on a foundation of verification, privacy, and transparent information sharing.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Network</h3>
              <p className="text-muted-foreground">
                Every doctor and pharmacy on the platform undergoes strict verification before they can participate.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy-Conscious</h3>
              <p className="text-muted-foreground">
                Your health data belongs to you. Our architecture is designed to keep your sensitive information strictly protected.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent AI</h3>
              <p className="text-muted-foreground">
                AI assists by organizing and explaining data, but human clinical responsibility remains the core of your care.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
