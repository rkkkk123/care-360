"use client";

import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Patient, Mumbai",
    image: "https://i.pravatar.cc/600?img=11",
    thought: "The AI symptom scanner helped me understand my condition instantly. Booking a doctor nearby was incredibly seamless. Truly a modern care ecosystem."
  },
  {
    id: 2,
    name: "Dr. Ananya Gupta",
    role: "Cardiologist, Delhi",
    image: "https://i.pravatar.cc/600?img=32",
    thought: "CARE360 has bridged the gap between patient history and actionable insights. The digitized timeline is a lifesaver during critical consultations."
  },
  {
    id: 3,
    name: "Rohan Desai",
    role: "Pharmacy Owner, Gujarat",
    image: "https://i.pravatar.cc/600?img=33",
    thought: "Managing e-prescriptions and local inventory integration has doubled my pharmacy's efficiency. Patients find us easily through the platform."
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Caregiver, Pune",
    image: "https://i.pravatar.cc/600?img=34",
    thought: "The multilingual voice assistant allowed my grandmother to communicate her health issues in her native tongue without feeling overwhelmed."
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Software Engineer, Bengaluru",
    image: "https://i.pravatar.cc/600?img=53",
    thought: "The privacy and HIPAA compliant infrastructure gave me the confidence to store my entire family's medical records here without a second thought."
  },
  {
    id: 6,
    name: "Priya Nair",
    role: "Patient, Kerala",
    image: "https://i.pravatar.cc/600?img=47",
    thought: "I used the Ayurvedic plant scanner feature and it accurately identified my herbs. This platform is bridging traditional wisdom and modern tech."
  },
  {
    id: 7,
    name: "Rajiv Menon",
    role: "Health Administrator, Chennai",
    image: "https://i.pravatar.cc/600?img=59",
    thought: "An absolute game changer for rural and urban healthcare alike. CARE360 proves that India is ready to lead the global health-tech revolution."
  }
];

export function TestimonialSection() {
  // Duplicate array to create an infinite scroll illusion
  const scrollItems = [...testimonials, ...testimonials];

  return (
    <Section className="py-24 md:py-32 bg-secondary/20 overflow-hidden relative border-y border-border/50">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <Container className="relative z-10 mb-16 text-center">
        <Reveal>
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Voices of Bharat
          </h2>
          <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Loved by the people of India.
          </h3>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            From patients to doctors, see how CARE360 is transforming the healthcare landscape across the nation with trust and technology.
          </p>
        </Reveal>
      </Container>

      {/* Marquee Container */}
      <div className="relative flex overflow-hidden w-full group py-6">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] gap-4 sm:gap-6 px-4">
          {scrollItems.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="relative w-[260px] sm:w-[310px] md:w-[350px] h-[380px] md:h-[480px] shrink-0 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 duration-500 group/card"
            >
              {/* Full Background Image */}
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                loading="lazy"
              />
              
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-500" />
              
              {/* Content Box */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-white/95 text-sm md:text-base leading-relaxed font-medium mb-6 line-clamp-4">
                  "{testimonial.thought}"
                </p>
                
                <div className="flex flex-col border-t border-white/20 pt-4">
                  <h4 className="text-base font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-xs font-medium text-white/70">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Global CSS for Marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}} />
    </Section>
  );
}
