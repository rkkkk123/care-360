"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GlobalAIButton() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="hidden sm:flex gap-2 rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary transition-colors group"
      asChild
    >
      <Link href="/patient/ai">
        <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Ask CARE360</span>
      </Link>
    </Button>
  );
}
