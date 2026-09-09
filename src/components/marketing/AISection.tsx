import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FileUp, Sparkles, Languages, Activity } from "lucide-react";

export function AISection() {
  return (
    <Section className="bg-secondary/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right" className="order-2 lg:order-1">
            <div className="relative rounded-3xl border border-border bg-card shadow-xl overflow-hidden p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/50">
                  <FileUp className="w-6 h-6 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-border rounded-full mb-2"></div>
                    <div className="h-2 w-16 bg-border/50 rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Upload</span>
                </div>
                
                <div className="flex justify-center -my-2">
                  <div className="w-px h-8 bg-border"></div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-[0_0_15px_rgba(52,199,89,0.1)]">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">AI Extraction</p>
                    <p className="text-xs text-muted-foreground mt-1">Processing complex medical terms...</p>
                  </div>
                </div>

                <div className="flex justify-center -my-2">
                  <div className="w-px h-8 bg-border"></div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-secondary/50">
                  <Languages className="w-6 h-6 text-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed">
                      &quot;Your LDL cholesterol is slightly elevated. The doctor might suggest dietary changes or medication.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" className="order-1 lg:order-2">
            <div className="flex flex-col space-y-6">
              <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium w-fit">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                AI Assistant
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                AI that helps you understand your health.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Medical reports shouldn&apos;t require a medical degree to read. AI helps organize and explain health information in plain language.
              </p>
              <ul className="space-y-4 mt-4">
                {[
                  "Upload any lab report or document",
                  "Get a plain-language explanation",
                  "Identify key health insights",
                  "Prepare questions for your doctor"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-foreground">
                    <Activity className="w-5 h-5 mr-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
