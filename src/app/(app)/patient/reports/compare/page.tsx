import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReportComparisonView } from "@/features/patient/components/ReportComparisonView";

export default function CompareReportsPage() {
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/patient/reports" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Reports
            </Link>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Compare Results</h1>
          <p className="mt-2 text-base text-muted-foreground">Analyze changes in your biomarkers over time.</p>
        </div>
      </div>

      <ReportComparisonView />
      
      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">AI Summary</h4>
        <p className="text-sm text-foreground leading-relaxed">
          Your total cholesterol has improved significantly since your last annual physical, dropping by 35 mg/dL. 
          Your Vitamin D levels remain low and have decreased slightly. Fasting glucose remains stable and excellent.
        </p>
      </div>
    </div>
  );
}
