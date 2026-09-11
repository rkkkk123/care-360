"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  Users,
  Video,
  Pill,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Camera,
  Mic,
  ArrowUpRight,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Weekly activity trend
const weeklyTrendData = [
  { day: "Mon", consultations: 480, prescriptions: 620, aiScans: 1840 },
  { day: "Tue", consultations: 530, prescriptions: 710, aiScans: 2100 },
  { day: "Wed", consultations: 620, prescriptions: 790, aiScans: 2450 },
  { day: "Thu", consultations: 590, prescriptions: 840, aiScans: 2310 },
  { day: "Fri", consultations: 680, prescriptions: 920, aiScans: 2680 },
  { day: "Sat", consultations: 490, prescriptions: 640, aiScans: 1720 },
  { day: "Sun", consultations: 422, prescriptions: 580, aiScans: 1540 },
];

// AI tool breakdown data for Bar Chart
const aiToolData = [
  { name: "Pill OCR", scans: 5820, target: 5000, fill: "#F97316" },
  { name: "Ayurvedic", scans: 4120, target: 4000, fill: "#10B981" },
  { name: "Skin Screen", scans: 4350, target: 4500, fill: "#8B5CF6" },
  { name: "Voice AI", scans: 8640, target: 7000, fill: "#3B82F6" },
];

// Telehealth specialty distribution
const specialtyData = [
  { name: "General Practice", value: 38, color: "#3B82F6" },
  { name: "Cardiology", value: 24, color: "#EF4444" },
  { name: "Dermatology", value: 18, color: "#8B5CF6" },
  { name: "Pediatrics", value: 12, color: "#10B981" },
  { name: "Orthopedics", value: 8, color: "#F59E0B" },
];

// Delivery time distribution
const fulfillmentSpeedData = [
  { bracket: "< 15m", orders: 1240, percent: "32%" },
  { bracket: "15-30m", orders: 1580, percent: "42%" },
  { bracket: "30-45m", orders: 690, percent: "18%" },
  { bracket: "45m+", orders: 302, percent: "8%" },
];

// Custom sleek tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-3.5 shadow-apple-lg text-xs space-y-1.5 min-w-[140px]">
        <p className="font-semibold text-foreground tracking-tight border-b border-border/60 pb-1">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-muted-foreground capitalize">{item.name}:</span>
            </div>
            <span className="font-mono font-bold text-foreground">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState<"7d" | "30d" | "90d">("7d");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header & Controls */}
      <div className="space-y-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Control Center
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Telemetry & Ecosystem Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Platform Activity & Health Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Telemetry across patient consultations, digital e-Rx fulfillment, multi-modal AI utilization, and distributed microservices.
            </p>
          </div>

          {/* Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe selector */}
            <div className="bg-secondary/60 p-1 rounded-2xl border border-border/60 flex items-center gap-1 text-xs">
              {(["7d", "30d", "90d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    timeframe === t
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "7d" ? "Last 7 Days" : t === "30d" ? "Last 30 Days" : "Quarterly"}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="rounded-2xl border-border bg-card hover:bg-secondary text-xs h-9 gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
              <span>Live Sync</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-primary">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Consultations
            </span>
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">3,812</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+18.4% vs last week</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/80 font-light">
            Average duration: 18.4 mins
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              e-Rx Speed
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">38 min</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>98.6% on-time dispatch</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/80 font-light">
            Doctor digital sign to patient door
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Scans Processed
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">14,290</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3 w-3" />
              <span>+32% multi-modal growth</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/80 font-light">
            Vision OCR & Botanical AI models
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Voice Assistant
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600">
              <Mic className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">8,640</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
              <Zap className="h-3 w-3" />
              <span>58% English • 42% हिन्दी</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/80 font-light">
            Sub-120ms neural speech synthesis
          </p>
        </div>
      </div>

      {/* Row 1: Main Platform Activity Trend Area Chart & Bar Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Platform Activity Trend (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Ecosystem Activity & Consultation Velocity
                </h3>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily volume comparison between doctor consultations and e-Rx pharmacy fulfillments.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                <span className="text-muted-foreground font-medium">Consultations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-muted-foreground font-medium">Prescriptions</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPrescriptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="consultations"
                    name="Consultations"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorConsultations)"
                  />
                  <Area
                    type="monotone"
                    dataKey="prescriptions"
                    name="Prescriptions"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPrescriptions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-2xl animate-pulse">
                <span className="text-xs text-muted-foreground">Loading interactive chart...</span>
              </div>
            )}
          </div>
        </div>

        {/* Bar Graph: AI Model Utilization (1 Col) */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Tool Invocations
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                14.2k Total
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Relative volume breakdown by multi-modal AI scanner engine.
            </p>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiToolData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="scans"
                    name="Scans"
                    radius={[8, 8, 0, 0]}
                  >
                    {aiToolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-2xl animate-pulse">
                <span className="text-xs text-muted-foreground">Loading bar graph...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Specialty Breakdown Donut & Fulfillment Speed Bar Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialty Distribution Donut */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Consultations by Clinical Specialty
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Breakdown of 3,812 completed telehealth sessions across medical disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
            <div className="h-56 w-full relative">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={specialtyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {specialtyData.map((entry, index) => (
                        <Cell key={`slice-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-2xl animate-pulse" />
              )}
              {/* Center Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-foreground">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Specialties</span>
              </div>
            </div>

            {/* Specialty Legend Badges */}
            <div className="space-y-2 text-xs">
              {specialtyData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-secondary/30 border border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* e-Rx Fulfillment Speed Distribution Bar Graph */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Pill className="h-4 w-4 text-emerald-600" />
              Prescription Fulfillment Speed Distribution
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Time elapsed from doctor cryptographic signature to pharmacy counter dispatch.
            </p>
          </div>

          <div className="h-56 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fulfillmentSpeedData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} opacity={0.5} />
                  <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="bracket" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" name="Orders Fulfilled" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-2xl animate-pulse" />
            )}
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>Median Fulfillment: <strong className="text-foreground">22.4 mins</strong></span>
            <span>Fastest Courier: <strong className="text-emerald-600">8.1 mins</strong></span>
          </div>
        </div>
      </div>

      {/* Row 3: Security & Infrastructure Telemetry Audit */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            HIPAA, Corsair DB & Cryptographic Audit Scorecard
          </h3>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
            All Systems Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1.5">
            <span className="text-muted-foreground font-medium">Prescription Tamper Verification</span>
            <p className="font-bold text-foreground text-base">100.0% Validated</p>
            <p className="text-[11px] text-emerald-600 font-medium">Zero hash collisions or signature mismatches</p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1.5">
            <span className="text-muted-foreground font-medium">Corsair HealthOps Sync Latency</span>
            <p className="font-bold text-foreground text-base">42 ms Average</p>
            <p className="text-[11px] text-emerald-600 font-medium">Sub-50ms cryptographic audit pipeline active</p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1.5">
            <span className="text-muted-foreground font-medium">Emergency SOS Dispatch Availability</span>
            <p className="font-bold text-foreground text-base">99.999% High Availability</p>
            <p className="text-[11px] text-emerald-600 font-medium">Mean connection dispatch: 1.4 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}

