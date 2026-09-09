import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Accessibility, Eye, Hand, Type } from "lucide-react";

export function AccessibilitySection() {
  return (
    <Section className="bg-secondary/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right">
            <div className="relative rounded-3xl border border-border bg-background p-8 md:p-12 shadow-xl">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Accessibility className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Accessibility Mode</h3>
                  <p className="text-sm text-muted-foreground">Tailor the experience to your needs.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Large Text</span>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">High Contrast</span>
                  </div>
                  <div className="w-12 h-6 bg-secondary rounded-full relative shadow-inner border border-border">
                    <div className="absolute left-1 top-1 bottom-1 w-4 bg-white border border-border rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hand className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Reduced Motion</span>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Designed for everyone.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Healthcare should be accessible. CARE360 includes readable typography, simple modes, large touch targets, and full screen-reader support out of the box.
            </p>
            <div className="inline-flex items-center font-medium text-primary hover:underline underline-offset-4 cursor-pointer">
              View accessibility statement
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
