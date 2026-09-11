import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { mockPharmacies } from "@/features/landing/data/demo-data";
import { MapPin, Truck, Store, ChevronRight } from "lucide-react";

export function PharmacySection() {
  return (
    <Section id="pharmacy" className="bg-secondary/30 scroll-mt-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <Reveal direction="right" className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden sm:block"></div>
              
              {mockPharmacies.map((pharmacy, idx) => (
                <div key={pharmacy.id} className="relative bg-background border border-border rounded-2xl p-5 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{pharmacy.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {pharmacy.distance}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{pharmacy.price}</div>
                      <div className="text-xs text-muted-foreground">Total cost</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    {pharmacy.fulfillment.map(opt => (
                      <Badge key={opt} variant="secondary" className="font-normal text-xs bg-secondary/60">
                        {opt.includes("delivery") ? <Truck className="w-3 h-3 mr-1" /> : <Store className="w-3 h-3 mr-1" />}
                        {opt}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="relative bg-background/50 border border-border/50 border-dashed rounded-2xl p-5 text-center flex items-center justify-center group cursor-pointer hover:bg-background/80 transition-colors">
                <span className="text-sm font-medium text-primary flex items-center">
                  View 12 more options nearby
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" className="w-full lg:w-1/2 order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              From prescription to medicine.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Compare participating pharmacies by availability, listed price, distance, and fulfillment options. Send your prescription directly with one tap.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center text-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                  <Store className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Compare Options</h4>
                  <p className="text-sm text-muted-foreground">Find the best price and location</p>
                </div>
              </div>
              <div className="flex items-center text-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Seamless Fulfillment</h4>
                  <p className="text-sm text-muted-foreground">Choose pickup or home delivery</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
