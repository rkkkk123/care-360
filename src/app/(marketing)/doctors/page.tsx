import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { verifiedDoctors } from "@/features/doctors/data/doctorsData";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Building2,
  Video,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorsPage() {
  return (
    <div className="pt-24 pb-20">
      
      {/* Hero */}
      <Section className="pt-16 pb-12">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>CARE360 Verified Physician Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-foreground">
              Medicine grounded in data. Led by <span className="font-medium text-primary">verified doctors</span>.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Every clinician on CARE360 is board-certified, credential-verified, and directly connected to your continuous health reports and timeline.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button size="lg" className="rounded-full group" asChild>
                <Link href="/login">
                  Find a Doctor
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/how-it-works">
                  How Verification Works
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Verification Trust Bar */}
      <Section className="py-8 bg-secondary/30 border-y border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Multi-Stage Licensure Check</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Primary-source verified NPI, state licenses, and clean disciplinary record.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Board-Certified Specialists</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Physicians from Stanford, Johns Hopkins, Harvard, and UCLA health systems.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">AI-Assisted Briefings</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Doctors receive structured lab summaries before calls so consultations are focused on care.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Doctors Showcase */}
      <Section className="py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Featured Providers
              </span>
              <h2 className="text-3xl font-light tracking-tight text-foreground mt-1">
                Consult with our leading specialists
              </h2>
            </div>
            <Button variant="outline" className="rounded-full text-xs" asChild>
              <Link href="/login">
                View All Network Physicians
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedDoctors.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center font-medium text-foreground text-lg border border-border shadow-inner shrink-0">
                      {doc.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-medium text-foreground text-base">{doc.name}</h3>
                        <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-background shrink-0" />
                      </div>
                      <p className="text-xs font-medium text-primary">{doc.specialization}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {doc.rating}
                        </span>
                        <span>•</span>
                        <span>{doc.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {doc.bio}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{doc.hospitalAffiliations[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-3.5 w-3.5 text-primary" />
                      <span>Next available: {doc.nextAvailableSlot}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full rounded-full text-xs group" asChild>
                  <Link href="/login">
                    Book Consultation (${doc.consultationFee})
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

    </div>
  );
}
