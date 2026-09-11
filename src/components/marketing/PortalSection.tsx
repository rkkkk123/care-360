import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { User, Stethoscope, Store, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export function PortalSection() {
  const portals = [
    {
      title: "Patient Portal",
      tagline: "Your Health in Your Hands",
      href: "/patient",
      icon: User,
      features: [
        "AI Health Tools & Vision Scanner",
        "Find & Book Verified Doctors",
        "Encrypted HD Video Consultation",
        "Buy Medicines with Stock Checking",
        "Longitudinal Health Timeline",
        "In-Home Healthcare Visit Booking",
        "Rapid SOS Emergency Hub",
        "Voice Assistant (Hindi / English)",
      ],
    },
    {
      title: "Doctor Portal",
      tagline: "Care More. Reach More.",
      href: "/doctor",
      icon: Stethoscope,
      features: [
        "Register & Get Verified Credentialing",
        "Manage Appointments & Waiting Room",
        "WebRTC Telehealth Consultation Room",
        "View Comprehensive Patient History",
        "AI Patient Clinical Summary Copilot",
        "Issue Digital Prescriptions & Vector PDF",
        "Set Availability & Fee Schedule",
        "View Verified Ratings & Reviews",
      ],
    },
    {
      title: "Pharmacy Portal",
      tagline: "Connect Care to Community",
      href: "/pharmacy",
      icon: Store,
      features: [
        "State Board Registration & Verification",
        "Add & Update Medicine Inventory",
        "Real-Time Price & Stock Availability",
        "Receive Electronic Prescription Orders",
        "Accept / Reject Dispense Orders",
        "Manage Courier Dispatch & In-Store Pickup",
        "Customer Ratings & Verified Feedback",
      ],
    },
    {
      title: "Admin Portal",
      tagline: "A Safer, Trusted Healthcare Network",
      href: "/admin",
      icon: Shield,
      features: [
        "Verify Doctors (Medical Board & DEA)",
        "Verify Pharmacies & Board Licenses",
        "Manage Users Across All 4 Roles",
        "Handle Support Tickets & Complaints",
        "Monitor Real-Time Platform Activity",
        "View Analytics & Telemetry Metrics",
        "Ensure Safety & HIPAA Compliance",
      ],
    },
  ];

  return (
    <Section className="bg-background py-24 md:py-32">
      <Container>
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Four Tailored Portals.
              <br />
              One Integrated Platform.
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
              Every stakeholder in the care continuum has a purpose-built workspace connected to the same authoritative data source.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-24">
          {portals.map((portal, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-card rounded-[2rem] p-8 h-full flex flex-col justify-between transition-all duration-300 shadow-apple-sm hover:shadow-apple-md border border-border/50 group">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border bg-secondary shadow-apple-sm text-foreground">
                    <portal.icon className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">
                      {portal.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground mt-1">
                      {portal.tagline}
                    </p>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-border/50 text-xs text-muted-foreground font-medium">
                    {portal.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 leading-snug">
                        <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 stroke-[1.5]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6 border-t border-border/50">
                  <Link
                    href={portal.href}
                    className="inline-flex items-center justify-center w-full rounded-full bg-secondary hover:bg-foreground text-foreground hover:text-background px-4 py-3 text-sm font-semibold transition-colors duration-200"
                  >
                    <span>Enter {portal.title}</span>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
