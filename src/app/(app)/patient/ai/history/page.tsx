"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Clock, Pill, Leaf, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIHistoryStore } from "@/lib/ai/ai-history-store";

export default function AIHistoryPage() {
  const { scanHistory, clearScanHistory } = useAIHistoryStore();

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-4 pl-0" asChild>
            <Link href="/patient/ai/scanner">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scanners
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI Scanner History
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Past Analysis Log
            </h1>
            {scanHistory.length > 0 && (
              <button onClick={clearScanHistory} className="text-[10px] text-muted-foreground hover:text-foreground underline mt-1">
                Clear History
              </button>
            )}
          </div>
        </div>
      </div>

      {scanHistory.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-3">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="text-base font-medium text-foreground">No Scan History</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven't scanned any medicines, plants, or skin conditions yet. 
            Upload an image to the Vision AI to get started.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/patient/ai/scanner">Go to Scanners</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {scanHistory.map((scan) => (
            <div key={scan.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-apple-sm transition flex flex-col md:flex-row md:items-center gap-5">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                scan.type === 'medicine' ? 'bg-primary/10 text-primary border-primary/20' :
                scan.type === 'leaf' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                'bg-purple-500/10 text-purple-600 border-purple-500/20'
              }`}>
                {scan.type === 'medicine' && <Pill className="h-6 w-6" />}
                {scan.type === 'leaf' && <Leaf className="h-6 w-6" />}
                {scan.type === 'skin' && <Scan className="h-6 w-6" />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-foreground">
                    {scan.type === 'medicine' ? scan.data.name : scan.type === 'leaf' ? scan.data.name : scan.data.condition}
                  </h4>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(scan.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {scan.type === 'medicine' ? scan.data.genericName : scan.type === 'leaf' ? scan.data.botanicalName : scan.data.riskLevel}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground uppercase">
                    {scan.type}
                  </span>
                  {scan.imagePreviewName && (
                    <span className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">
                      File: {scan.imagePreviewName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
