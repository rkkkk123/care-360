import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";

export default function PharmaciesPage() {
  return (
    <Section className="pt-32">
      <Container>
        <h1 className="text-5xl font-bold tracking-tight mb-6">Pharmacy Network</h1>
        <p className="text-xl text-muted-foreground">Seamless fulfillment from prescription to your door.</p>
        <div className="mt-16 h-96 rounded-3xl border border-border bg-secondary/30 flex items-center justify-center">
          <p className="text-muted-foreground">Full page content belongs to a future phase.</p>
        </div>
      </Container>
    </Section>
  );
}
