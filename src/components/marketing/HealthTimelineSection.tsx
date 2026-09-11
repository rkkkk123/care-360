"use client";

import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { mockTimeline } from "@/features/landing/data/demo-data";
import { FileText, Stethoscope, Pill, PackageCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Jan', val: 180 },
  { name: 'Feb', val: 175 },
  { name: 'Mar', val: 168 },
  { name: 'Apr', val: 160 },
  { name: 'May', val: 155 },
  { name: 'Jun', val: 145 },
];

export function HealthTimelineSection() {
  const getIcon = (type: string) => {
    switch(type) {
      case "report": return <FileText className="w-4 h-4 text-primary" />;
      case "consultation": return <Stethoscope className="w-4 h-4 text-primary" />;
      case "prescription": return <Pill className="w-4 h-4 text-primary" />;
      case "medicine": return <PackageCheck className="w-4 h-4 text-primary" />;
      default: return <div className="w-2 h-2 rounded-full bg-primary" />;
    }
  };

  return (
    <Section id="timeline" className="scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading 
            title="Your health has a history." 
            subtitle="View your entire care journey on one continuous timeline. See trends, track improvements, and never lose a record."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Timeline */}
          <div className="relative ml-4 sm:ml-0 pl-6 md:pl-8 border-l border-border space-y-12">
            <Stagger>
              {mockTimeline.map((item, idx) => (
                <StaggerItem key={item.id} className="relative">
                  <div className="absolute -left-10 md:-left-12 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center shadow-sm">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                      {item.date}
                    </span>
                    <h4 className="text-lg font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Trend Chart Mockup */}
          <Reveal direction="left" delay={0.3} className="flex flex-col h-full">
            <div className="bg-background border border-border rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
              <div className="mb-8">
                <h4 className="text-lg font-semibold">Cholesterol Trend</h4>
                <p className="text-sm text-muted-foreground">LDL levels over the past 6 months</p>
              </div>
              
              <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#8e8e93', fontSize: 12}}
                      dy={10}
                    />
                    <YAxis 
                      domain={[120, 200]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#8e8e93', fontSize: 12}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5ea', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ color: '#8e8e93', fontSize: '12px' }}
                      itemStyle={{ color: '#171717', fontWeight: 600, fontSize: '14px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#34c759" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#34c759', strokeWidth: 0 }} 
                      activeDot={{ r: 6, fill: '#1B8A3E' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
