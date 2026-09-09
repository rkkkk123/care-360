"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Activity,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Plus,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthorizedHealthContext,
  ConsultationNotes,
  AICopilotResponse,
} from "@/types/models/consultation";
import { formatDisplayDate } from "@/lib/utils";

interface DoctorContextDrawerProps {
  consultationId: string;
  context: AuthorizedHealthContext | null;
  notes: ConsultationNotes;
  isFinalized: boolean;
  onSaveNotes: (updatedNotes: Partial<ConsultationNotes>) => Promise<void>;
  onOpenFinalizeDialog: () => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSavedTime?: string;
}

type TabType = "patient" | "reports" | "timeline" | "copilot" | "notes";

export function DoctorContextDrawer({
  consultationId,
  context,
  notes,
  isFinalized,
  onSaveNotes,
  onOpenFinalizeDialog,
  saveStatus,
  lastSavedTime,
}: DoctorContextDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("copilot");

  // Local draft notes state
  const [draftNotes, setDraftNotes] = React.useState<ConsultationNotes>(notes);

  // Sync incoming notes when they change from server
  React.useEffect(() => {
    setDraftNotes(notes);
  }, [notes]);

  // Debounced Autosave for Notes
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleNoteFieldChange = (field: keyof ConsultationNotes, value: string) => {
    if (isFinalized) return;

    const updated = { ...draftNotes, [field]: value };
    setDraftNotes(updated);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSaveNotes({ [field]: value });
    }, 1000);
  };

  // AI Copilot State
  const [copilotLoading, setCopilotLoading] = React.useState(false);
  const [copilotHistory, setCopilotHistory] = React.useState<
    Array<{
      query: string;
      response: AICopilotResponse;
    }>
  >([]);
  const [copilotInput, setCopilotInput] = React.useState("");

  const handleQueryCopilot = async (
    queryType: "overview" | "report_summary" | "report_diff" | "questions" | "draft_notes" | "custom",
    customPrompt?: string
  ) => {
    setCopilotLoading(true);
    try {
      const res = await fetch(`/api/consultation/${consultationId}/ai-copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryType,
          customPrompt: customPrompt || copilotInput,
          currentDraftNotes: draftNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setCopilotHistory((prev) => [
            {
              query:
                customPrompt ||
                (queryType === "report_summary"
                  ? "Summarize latest lab report"
                  : queryType === "report_diff"
                  ? "Compare reports over time"
                  : queryType === "draft_notes"
                  ? "Draft consultation notes"
                  : queryType === "questions"
                  ? "Suggested clinical questions"
                  : "Clinical Overview"),
              response: data.result,
            },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      console.error("AI Copilot request error:", err);
    } finally {
      setCopilotLoading(false);
      setCopilotInput("");
    }
  };

  // Insert AI draft notes into clinician form
  const handleApplyAIDraft = (draft: Partial<ConsultationNotes>) => {
    if (isFinalized) return;
    const merged: ConsultationNotes = {
      ...draftNotes,
      chiefConcern: draft.chiefConcern || draftNotes.chiefConcern,
      historyOfPresentIllness: draft.historyOfPresentIllness || draftNotes.historyOfPresentIllness,
      observations: draft.observations || draftNotes.observations,
      assessment: draft.assessment || draftNotes.assessment,
      plan: draft.plan || draftNotes.plan,
      followUp: draft.followUp || draftNotes.followUp,
      patientVisibleSummary: draft.patientVisibleSummary || draftNotes.patientVisibleSummary,
    };
    setDraftNotes(merged);
    onSaveNotes(merged);
    setActiveTab("notes");
  };

  return (
    <div className="w-full h-full flex flex-col bg-card border-l border-border text-card-foreground shadow-2xl overflow-hidden">
      {/* Drawer Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("copilot")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "copilot"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Copilot
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "notes"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Notes
            {isFinalized && <span className="text-[10px] bg-white/20 px-1 rounded ml-0.5">Locked</span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("patient")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "patient"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Patient
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "reports"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Reports
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "timeline"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Timeline
          </button>
        </div>
      </div>

      {/* Drawer Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* ================= TAB 1: PATIENT OVERVIEW ================= */}
        {activeTab === "patient" && context && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-foreground">
                  {context.patient.firstName} {context.patient.lastName}
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  38 yrs • Blood: {context.patient.bloodType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <p>DOB: {context.patient.dateOfBirth}</p>
                <p>ID: {context.patient.id}</p>
              </div>
            </div>

            {/* Allergies Warning */}
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
              <div className="flex items-center gap-2 font-medium mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Known Allergies</span>
              </div>
              <p className="text-xs font-mono">{context.patient.allergies.join(", ") || "None recorded"}</p>
            </div>

            {/* Vitals */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 font-medium text-foreground mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <span>Recorded Vital Signs</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 rounded-xl bg-background border border-border/70">
                  <span className="text-[10px] text-muted-foreground block font-sans">Blood Pressure</span>
                  <span className="font-semibold text-foreground">{context.patient.metrics.bloodPressure}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">mmHg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background border border-border/70">
                  <span className="text-[10px] text-muted-foreground block font-sans">Resting HR</span>
                  <span className="font-semibold text-foreground">{context.patient.metrics.heartRate}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">bpm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background border border-border/70">
                  <span className="text-[10px] text-muted-foreground block font-sans">Weight</span>
                  <span className="font-semibold text-foreground">{context.patient.metrics.weight}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background border border-border/70">
                  <span className="text-[10px] text-muted-foreground block font-sans">Height</span>
                  <span className="font-semibold text-foreground">{context.patient.metrics.height}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">cm</span>
                </div>
              </div>
            </div>

            {/* Stated Concern */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Patient Stated Concern
              </h4>
              <p className="text-foreground leading-relaxed italic">
                &ldquo;{context.patientStatedConcern}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SHARED LAB REPORTS ================= */}
        {activeTab === "reports" && context && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Authorized Lab Results ({context.authorizedReports.length})
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Patient Authorized
              </span>
            </div>

            {context.authorizedReports.map((report) => (
              <div key={report.id} className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{report.title}</h4>
                    <p className="text-muted-foreground text-[11px]">
                      {report.providerName} • {formatDisplayDate(report.date)}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {report.type}
                  </span>
                </div>

                {report.extractedMetrics && report.extractedMetrics.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Biomarkers & Ranges
                    </span>
                    {report.extractedMetrics.map((metric, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/60 text-[11px]"
                      >
                        <span className="font-medium text-foreground">{metric.name}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span>
                            {metric.value} {metric.unit}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                              metric.status === "normal"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : metric.status === "low"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {metric.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {report.summary && (
                  <p className="text-[11px] text-muted-foreground bg-background/50 p-2.5 rounded-xl border border-border/40">
                    {report.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 3: AUTHORIZED TIMELINE ================= */}
        {activeTab === "timeline" && context && (
          <div className="space-y-4 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Authorized Longitudinal Events
            </span>
            <div className="space-y-3 pl-2 border-l-2 border-primary/30 ml-2">
              {context.authorizedTimelineEvents.map((evt) => (
                <div key={evt.id} className="relative pl-4 space-y-1">
                  <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatDisplayDate(evt.date)}
                  </span>
                  <h4 className="font-medium text-foreground">{evt.title}</h4>
                  <p className="text-muted-foreground text-[11px]">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: AI COPILOT ================= */}
        {activeTab === "copilot" && (
          <div className="space-y-4 text-xs">
            {/* Disclaimer Banner */}
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-[11px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                <strong>AI Doctor Copilot:</strong> Clinician-assisted intelligence. AI never diagnoses or prescribes.
              </span>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Clinical Intelligence Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={copilotLoading}
                  onClick={() => handleQueryCopilot("report_summary")}
                  className="p-2.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-left transition-all text-[11px] font-medium text-foreground hover:border-primary/40 disabled:opacity-50"
                >
                  📄 Summarize Latest Lab
                </button>
                <button
                  type="button"
                  disabled={copilotLoading}
                  onClick={() => handleQueryCopilot("report_diff")}
                  className="p-2.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-left transition-all text-[11px] font-medium text-foreground hover:border-primary/40 disabled:opacity-50"
                >
                  📊 Compare 2025 vs 2026
                </button>
                <button
                  type="button"
                  disabled={copilotLoading}
                  onClick={() => handleQueryCopilot("questions")}
                  className="p-2.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-left transition-all text-[11px] font-medium text-foreground hover:border-primary/40 disabled:opacity-50"
                >
                  💡 Suggested Questions
                </button>
                <button
                  type="button"
                  disabled={copilotLoading}
                  onClick={() => handleQueryCopilot("draft_notes")}
                  className="p-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-left transition-all text-[11px] font-medium text-primary hover:border-primary/50 disabled:opacity-50"
                >
                  ✍️ Draft Clinical Note
                </button>
              </div>
            </div>

            {/* Freeform Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (copilotInput.trim()) {
                  handleQueryCopilot("custom", copilotInput);
                }
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask Copilot about authorized records..."
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                className="text-xs rounded-xl h-9 bg-background"
                disabled={copilotLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-xl h-9 px-3 shrink-0"
                disabled={copilotLoading || !copilotInput.trim()}
              >
                {copilotLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </Button>
            </form>

            {/* Copilot Answers Stream */}
            <div className="space-y-3 pt-2">
              {copilotLoading && (
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 flex items-center justify-center gap-2 text-muted-foreground animate-pulse text-xs">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  <span>Synthesizing authorized health records...</span>
                </div>
              )}

              {copilotHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="font-semibold text-foreground text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      {item.query}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.response.aiModel}
                    </span>
                  </div>

                  <p className="text-foreground leading-relaxed text-xs whitespace-pre-wrap">
                    {item.response.answer}
                  </p>

                  {/* Suggested Clinical Questions */}
                  {item.response.suggestedQuestions && item.response.suggestedQuestions.length > 0 && (
                    <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary block">
                        Consider Inquiring:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
                        {item.response.suggestedQuestions.map((q, qi) => (
                          <li key={qi}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Draft Note Button if present */}
                  {item.response.draftNote && (
                    <div className="pt-2 border-t border-border/50 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleApplyAIDraft(item.response.draftNote!)}
                        className="rounded-xl text-xs h-8 px-3 gap-1.5 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Apply Draft into Clinical Notes
                      </Button>
                    </div>
                  )}

                  {/* Non-Negotiable Safety Watermark */}
                  <div className="text-[10px] text-muted-foreground/80 italic text-right">
                    {item.response.disclaimer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: CLINICAL NOTES ================= */}
        {activeTab === "notes" && (
          <div className="space-y-4 text-xs">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2">
                {saveStatus === "saving" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span className="text-muted-foreground text-[11px]">Saving notes...</span>
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-destructive text-[11px]">Save failed. Retrying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-muted-foreground text-[11px]">
                      {lastSavedTime ? `Autosaved at ${new Date(lastSavedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "All changes saved"}
                    </span>
                  </>
                )}
              </div>

              {isFinalized ? (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  FINALIZED • READ ONLY
                </span>
              ) : (
                <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                  Drafting Active
                </span>
              )}
            </div>

            {/* Field 1: Chief Concern */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground text-[11px] block">Chief Concern</label>
              <Input
                disabled={isFinalized}
                value={draftNotes.chiefConcern}
                onChange={(e) => handleNoteFieldChange("chiefConcern", e.target.value)}
                className="text-xs rounded-xl bg-background"
                placeholder="Reason for visit..."
              />
            </div>

            {/* Field 2: History of Present Illness (HPI) */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground text-[11px] block">
                History of Present Illness (HPI)
              </label>
              <textarea
                disabled={isFinalized}
                rows={3}
                value={draftNotes.historyOfPresentIllness}
                onChange={(e) => handleNoteFieldChange("historyOfPresentIllness", e.target.value)}
                className="w-full text-xs rounded-xl bg-background border border-border p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                placeholder="Onset, duration, severity, modifying factors..."
              />
            </div>

            {/* Field 3: Observations & Exam */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground text-[11px] block">
                Observations & Telehealth Exam
              </label>
              <textarea
                disabled={isFinalized}
                rows={2}
                value={draftNotes.observations}
                onChange={(e) => handleNoteFieldChange("observations", e.target.value)}
                className="w-full text-xs rounded-xl bg-background border border-border p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                placeholder="Physical observations, affect, connected vital trends..."
              />
            </div>

            {/* Field 4: Assessment (REQUIRED) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-[11px] block">
                  Clinical Assessment <span className="text-destructive">*</span>
                </label>
                <span className="text-[10px] text-muted-foreground">Required to finalize</span>
              </div>
              <textarea
                disabled={isFinalized}
                rows={3}
                value={draftNotes.assessment}
                onChange={(e) => handleNoteFieldChange("assessment", e.target.value)}
                className="w-full text-xs rounded-xl bg-background border border-border p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                placeholder="Clinical impressions, differential, severity..."
              />
            </div>

            {/* Field 5: Plan (REQUIRED) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-[11px] block">
                  Management Plan <span className="text-destructive">*</span>
                </label>
                <span className="text-[10px] text-muted-foreground">Required to finalize</span>
              </div>
              <textarea
                disabled={isFinalized}
                rows={3}
                value={draftNotes.plan}
                onChange={(e) => handleNoteFieldChange("plan", e.target.value)}
                className="w-full text-xs rounded-xl bg-background border border-border p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                placeholder="Interventions, lifestyle, supplements, monitoring..."
              />
            </div>

            {/* Field 6: Follow-up */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground text-[11px] block">
                Follow-up Interval
              </label>
              <Input
                disabled={isFinalized}
                value={draftNotes.followUp}
                onChange={(e) => handleNoteFieldChange("followUp", e.target.value)}
                className="text-xs rounded-xl bg-background"
                placeholder="e.g. 3 months with repeat labs"
              />
            </div>

            {/* Field 7: Doctor Private Notes (STRICT PRIVACY) */}
            <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
                <span className="font-semibold text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Clinician Private Notes
                </span>
                <span className="text-[10px] uppercase font-bold">Strictly Private</span>
              </div>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                These notes will NEVER be shown to the patient or included in summaries.
              </p>
              <textarea
                disabled={isFinalized}
                rows={2}
                value={draftNotes.doctorPrivateNotes}
                onChange={(e) => handleNoteFieldChange("doctorPrivateNotes", e.target.value)}
                className="w-full text-xs rounded-xl bg-background/80 border border-amber-500/30 p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-60"
                placeholder="Internal clinical impressions, compliance observations..."
              />
            </div>

            {/* Field 8: Patient-Visible Summary (SHARED) */}
            <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span className="font-semibold text-[11px] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Patient-Visible Summary
                </span>
                <span className="text-[10px] uppercase font-bold">Shared With Patient</span>
              </div>
              <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                This summary will be published to the patient&apos;s portal & health timeline upon finalization.
              </p>
              <textarea
                disabled={isFinalized}
                rows={3}
                value={draftNotes.patientVisibleSummary}
                onChange={(e) => handleNoteFieldChange("patientVisibleSummary", e.target.value)}
                className="w-full text-xs rounded-xl bg-background/80 border border-emerald-500/30 p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                placeholder="Clear, patient-friendly summary of findings, guidance, and next steps..."
              />
            </div>

            {/* Prescribe / Finalize Action Bar */}
            <div className="pt-2 space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-2xl border-primary/30 text-primary hover:bg-primary/10 text-xs gap-2 py-2"
                asChild
              >
                <Link
                  href={`/doctor/prescriptions/new?consultationId=${consultationId}&diagnosis=${encodeURIComponent(
                    draftNotes.assessment || "Clinical Consultation"
                  )}`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  Issue Digital e-Prescription (Rx)
                </Link>
              </Button>

              {!isFinalized && (
                <Button
                  size="lg"
                  onClick={onOpenFinalizeDialog}
                  className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 font-medium text-xs gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Review & Finalize Consultation
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
