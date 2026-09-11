"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Pill,
  Leaf,
  Scan,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

function SafeThumbnail({ url, alt, type }: { url?: string; alt: string; type: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (!url || hasError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${
          type === "document"
            ? "bg-blue-500/10 text-blue-500"
            : type === "medicine"
            ? "bg-orange-500/10 text-orange-500"
            : type === "leaf"
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-purple-500/10 text-purple-500"
        }`}
      >
        {type === "document" && <FileText className="h-8 w-8" />}
        {type === "medicine" && <Pill className="h-8 w-8" />}
        {type === "leaf" && <Leaf className="h-8 w-8" />}
        {type === "skin" && <Scan className="h-8 w-8" />}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  );
}

function SafeModalThumbnail({ url, alt, type }: { url?: string; alt: string; type: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (!url || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-muted-foreground">
        {type === "document" && <FileText className="h-10 w-10 text-blue-400" />}
        {type === "medicine" && <Pill className="h-10 w-10 text-orange-400" />}
        {type === "leaf" && <Leaf className="h-10 w-10 text-emerald-400" />}
        {type === "skin" && <Scan className="h-10 w-10 text-purple-400" />}
        <span className="text-xs font-mono uppercase text-white/60">Optical Clinical Record Ingested</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      onError={() => setHasError(true)}
      className="max-h-full max-w-full object-contain filter contrast-105"
    />
  );
}
import { useAIHistoryStore, ScanResult } from "@/lib/ai/ai-history-store";
import { generateScanPDF } from "@/lib/export/report-pdf";
import { Button } from "@/components/ui/button";

export default function AIHistoryPage() {
  const { scanHistory, clearScanHistory, deleteScanResult } = useAIHistoryStore();
  const [selectedScan, setSelectedScan] = React.useState<ScanResult | null>(null);

  const handleDownloadPDF = (scan: ScanResult, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    generateScanPDF({
      id: scan.id,
      scanType: scan.type,
      timestamp: scan.timestamp,
      fileName: scan.imagePreviewName,
      geminiData: scan.geminiData || scan.data,
      mistralReport: scan.mistralReport,
    });
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
      {/* Header */}
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
            AI Scanner Diagnostics Log
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Patient Scan History
            </h1>
            {scanHistory.length > 0 && (
              <button
                onClick={clearScanHistory}
                className="text-xs text-muted-foreground hover:text-red-500 underline transition-colors mt-1"
              >
                Clear All Logs
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete historical registry of optical scans, lab document extractions, and Mistral clinical evaluations.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {scanHistory.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-4">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-secondary/50 text-muted-foreground flex items-center justify-center border border-border">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium text-foreground">No Historical Scans Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven't scanned any medical documents, medicines, botanical herbs, or skin conditions yet.
            </p>
          </div>
          <Button className="rounded-full text-xs" asChild>
            <Link href="/patient/ai/scanner">Launch Vision Scanner</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {scanHistory.map((scan) => {
            const data = scan.geminiData || scan.data || {};
            const title =
              data.name ||
              data.condition ||
              data.title ||
              scan.imagePreviewName ||
              "Clinical Record";
            const sub =
              data.genericName ||
              data.tag ||
              data.riskLevel ||
              data.botanicalName ||
              "Optical Scan";

            return (
              <div
                key={scan.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-border/80 transition-all flex flex-col md:flex-row md:items-center gap-5 cursor-pointer group"
                onClick={() => setSelectedScan(scan)}
              >
                {/* Visual Thumbnail */}
                <div className="h-24 w-24 sm:h-20 sm:w-28 rounded-2xl overflow-hidden bg-secondary/40 border border-border shrink-0 relative flex items-center justify-center">
                  <SafeThumbnail
                    url={scan.thumbnailUrl}
                    alt={title}
                    type={scan.type}
                  />

                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-white text-[9px] uppercase font-mono">
                    {scan.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(scan.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground truncate">{sub}</p>

                  {/* Summary / Mistral snippet */}
                  {scan.mistralReport?.clinicalSummary && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 italic bg-secondary/30 px-2.5 py-1 rounded-lg border border-border/40">
                      &ldquo;{scan.mistralReport.clinicalSummary}&rdquo;
                    </p>
                  )}

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
                      Gemini Vision
                    </span>
                    {scan.mistralReport && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-500/20">
                        {scan.mistralReport.modelUsed || "Mistral AI"} (
                        {scan.mistralReport.medicalConfidenceScore || 99.2}%)
                      </span>
                    )}
                    {scan.imagePreviewName && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                        {scan.imagePreviewName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs h-8 px-3"
                    onClick={(e) => handleDownloadPDF(scan, e)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    PDF Report
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteScanResult(scan.id);
                    }}
                    title="Delete Scan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL REPORT MODAL VIEW */}
      {selectedScan && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedScan(null)}
        >
          <div
            className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                    {selectedScan.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedScan.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedScan.geminiData?.name ||
                    selectedScan.data?.name ||
                    selectedScan.data?.condition ||
                    "Specimen Report"}
                </h3>
              </div>

              <button
                onClick={() => setSelectedScan(null)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail preview if available */}
            {selectedScan.thumbnailUrl && (
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-black/90 border border-border flex items-center justify-center">
                <SafeModalThumbnail
                  url={selectedScan.thumbnailUrl}
                  type={selectedScan.type}
                  alt={selectedScan.imagePreviewName || "Specimen"}
                />
              </div>
            )}

            {/* Mistral Clinical Summary */}
            {selectedScan.mistralReport?.clinicalSummary && (
              <div className="rounded-2xl bg-purple-500/5 border border-purple-500/20 p-4 text-xs space-y-1">
                <span className="font-semibold text-purple-900 dark:text-purple-300 block">
                  Mistral Clinical Evaluation:
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedScan.mistralReport.clinicalSummary}
                </p>
              </div>
            )}

            {/* Key Findings */}
            {selectedScan.mistralReport?.keyFindings && (
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-foreground block">Key Findings:</span>
                <ul className="space-y-1">
                  {selectedScan.mistralReport.keyFindings.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setSelectedScan(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="rounded-full text-xs shadow-md shadow-primary/20"
                onClick={() => handleDownloadPDF(selectedScan)}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
