import * as React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AIInsightCardProps {
  title: string;
  description: string;
  actionText: string;
  actionHref?: string;
}

export function AIInsightCard({ title, description, actionText, actionHref = "/patient/reports/rep_1" }: AIInsightCardProps) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI Insight (Demo)</span>
        </div>
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <Button variant="outline" className="rounded-full shrink-0 group border-primary/30 text-primary hover:bg-primary/10" asChild>
        <Link href={actionHref}>
          {actionText}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  );
}
