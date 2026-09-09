import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <Section className="py-24 md:py-40">
      <Container>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-4xl md:text-7xl font-semibold tracking-tight text-foreground mb-6" style={{ letterSpacing: "-0.02em" }}>
              Your health.<br />
              <span className="text-muted-foreground">One connected ecosystem.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.2} className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group h-12 px-8 text-base" asChild>
              <Link href="/register">
                Start your care journey
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
              <Link href="/how-it-works">Explore how CARE360 works</Link>
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
