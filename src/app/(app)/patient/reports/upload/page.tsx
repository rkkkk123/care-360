"use client";

import * as React from "react";
import { Upload, FileText, CheckCircle2, ArrowRight, Sparkles, Loader2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { motionConfig } from "@/lib/motion";

type UploadState = "idle" | "uploading" | "processing" | "complete";

export default function UploadReportPage() {
  const router = useRouter();
  const [uploadState, setUploadState] = React.useState<UploadState>("idle");
  const [progress, setProgress] = React.useState(0);

  const handleSimulateUpload = () => {
    setUploadState("uploading");
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadState("processing");
          
          // Simulate AI processing
          setTimeout(() => {
            setUploadState("complete");
          }, 3000);
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/patient/reports" className="hover:text-foreground transition-colors">Reports</Link>
            <span>/</span>
            <span className="text-foreground">Upload</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Upload Medical Report</h1>
          <p className="mt-2 text-base text-muted-foreground">Upload lab results, clinical notes, or imaging reports.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-1 shadow-sm overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* IDLE STATE */}
          {uploadState === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={motionConfig.transition}
              className="p-8 sm:p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/60 rounded-[28px] bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
              onClick={handleSimulateUpload}
            >
              <div className="bg-background border border-border p-4 rounded-2xl mb-6 shadow-sm">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Click or drag file to upload</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Securely upload your medical documents. CARE360 AI will automatically extract key insights and metrics.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border">
                <FileCheck className="w-3 h-3" />
                Supports PDF, JPG, PNG (Max 10MB)
              </div>
            </motion.div>
          )}

          {/* UPLOADING STATE */}
          {uploadState === "uploading" && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={motionConfig.transition}
              className="p-8 sm:p-12 flex flex-col items-center justify-center text-center"
            >
              <div className="relative mb-6">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-secondary" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    className="text-primary transition-all duration-100 ease-linear"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * progress) / 100}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-medium">{progress}%</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Uploading Document...</h3>
              <p className="text-sm text-muted-foreground">Securely transferring your file.</p>
            </motion.div>
          )}

          {/* PROCESSING STATE */}
          {uploadState === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={motionConfig.transition}
              className="p-8 sm:p-12 flex flex-col items-center justify-center text-center"
            >
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-6 relative overflow-hidden">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                AI Processing
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Extracting biomarkers and generating a clinical summary. This usually takes a few seconds.
              </p>
            </motion.div>
          )}

          {/* COMPLETE STATE */}
          {uploadState === "complete" && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={motionConfig.transition}
              className="p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-green-500/5"
            >
              <div className="bg-green-500/20 text-green-600 p-4 rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Report Processed Successfully</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Your report has been analyzed and added to your health timeline.
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-full" onClick={() => setUploadState("idle")}>
                  Upload another
                </Button>
                <Button className="rounded-full group" asChild>
                  <Link href="/patient/reports/rep_1">
                    View Results
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3" />
          CARE360 AI uses advanced optical character recognition (OCR) and clinical NLP to structure your health data.
        </p>
      </div>
    </div>
  );
}
