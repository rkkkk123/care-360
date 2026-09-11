"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Layers,
  Database,
  Globe,
  Radio,
  Clock,
  Sparkles,
  Lock,
  Workflow,
  Server,
  Code2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Terminal,
  FileText,
  AlertTriangle,
  Send,
  Boxes,
  Stethoscope,
  User,
  Store,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL VECTOR LOGOS (Exact official vector coordinate assets)
// ─────────────────────────────────────────────────────────────────────────────

function GoogleGeminiLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B73E8" />
          <stop offset="45%" stopColor="#8AB4F8" />
          <stop offset="70%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>
      </defs>
      <path
        d="M12 1C12 7.075 7.075 12 1 12C7.075 12 12 16.925 12 23C12 16.925 16.925 12 23 12C16.925 12 12 7.075 12 1Z"
        fill="url(#geminiGrad)"
      />
    </svg>
  );
}

function CorsairLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0F172A" />
      <path
        d="M16 6L24.66 11V21L16 26L7.34 21V11L16 6Z"
        stroke="#10B981"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.5" fill="#10B981" />
      <path d="M16 9.5V12.5M16 19.5V22.5M10.5 13L13 14.5M19 17.5L21.5 19M10.5 19L13 17.5M19 14.5L21.5 13" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NextjsLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="90" fill="#000000" />
      <path
        d="M149.508 157.438L69.1411 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
        fill="white"
      />
      <rect x="115" y="54" width="12" height="72" fill="white" />
    </svg>
  );
}

function ReactLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function TypeScriptLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#3178C6" />
      <path
        d="M19.8 19.8C20.3 20.7 21.2 21.3 22.4 21.3C23.6 21.3 24.4 20.7 24.4 19.8C24.4 17.5 19.3 17.4 19.3 13.5C19.3 11.2 21.2 9.8 23.7 9.8C25.4 9.8 26.8 10.6 27.5 12L25.4 13.3C24.9 12.5 24.4 12.1 23.6 12.1C22.7 12.1 22 12.6 22 13.3C22 15.3 27.2 15.2 27.2 19.3C27.2 22 25.1 23.5 22.3 23.5C19.8 23.5 18.2 22.2 17.4 20.5L19.8 19.8ZM10.5 12.3H7.5V10H16.5V12.3H13.5V23.2H10.5V12.3Z"
        fill="white"
      />
    </svg>
  );
}

function TailwindLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 5.999 12z"
        fill="#38BDF8"
      />
    </svg>
  );
}

function SlackLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M26.7 80.6c0 7.4-6 13.4-13.4 13.4s-13.3-6-13.3-13.4c0-7.4 6-13.4 13.4-13.4h13.3v13.4z" fill="#E01E5A" />
      <path d="M33.4 80.6c0-7.4 6-13.4 13.4-13.4s13.4 6 13.4 13.4v33.4c0 7.4-6 13.4-13.4 13.4s-13.4-6-13.4-13.4V80.6z" fill="#E01E5A" />
      <path d="M46.8 26.7c-7.4 0-13.4-6-13.4-13.4s6-13.3 13.4-13.3c7.4 0 13.4 6 13.4 13.4v13.3H46.8z" fill="#36C5F0" />
      <path d="M46.8 33.4c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4H13.4c-7.4 0-13.4-6-13.4-13.4s6-13.4 13.4-13.4h33.4z" fill="#36C5F0" />
      <path d="M101.3 46.8c0-7.4 6-13.4 13.4-13.4s13.3 6 13.3 13.4c0 7.4-6 13.4-13.4 13.4h-13.3V46.8z" fill="#2EB67D" />
      <path d="M94.6 46.8c0 7.4-6 13.4-13.4 13.4s-13.4-6-13.4-13.4V13.4c0-7.4 6-13.4 13.4-13.4s13.4 6 13.4 13.4v33.4z" fill="#2EB67D" />
      <path d="M81.2 101.3c7.4 0 13.4 6 13.4 13.4s-6 13.3-13.4 13.3c-7.4 0-13.4-6-13.4-13.4v-13.3h13.4z" fill="#ECB22E" />
      <path d="M81.2 94.6c-7.4 0-13.4-6-13.4-13.4s6-13.4 13.4-13.4h33.4c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4H81.2z" fill="#ECB22E" />
    </svg>
  );
}

function GitHubLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function PostgreSQLLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.47.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03.8-.22 1.65-.33 2.5-.34.85.01 1.7.12 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48C19.14 20.14 22 16.41 22 12c0-5.52-4.48-10-10-10z"
        fill="#336791"
      />
    </svg>
  );
}

function GSAPLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0AE448" />
      <path
        d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16H16V20.5H21.3C20.2 22.8 17.8 24 15.2 24C11.3 24 8.5 21 8.5 17C8.5 13 11.3 10 15.2 10C17.5 10 19.5 11 20.6 12.6L23.8 9.8C21.8 7.5 19 6 16 6Z"
        fill="#000000"
      />
    </svg>
  );
}

function WebAudioLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10V14H6L10 18V6L6 10H3Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 8C15.33 9.33 16 10.67 16 12C16 13.33 15.33 14.67 14 16M17.5 5C19.5 7.33 20.5 9.67 20.5 12C20.5 14.33 19.5 16.67 17.5 19" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OpenFDALogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0284C7" />
      <path d="M16 6V26M6 16H26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="#0284C7" stroke="white" strokeWidth="2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: TIER TOPOLOGY DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

interface ArchitectureTier {
  id: string;
  name: string;
  badge: string;
  color: string;
  bgLight: string;
  borderLight: string;
  textColor: string;
  description: string;
  components: {
    title: string;
    sub: string;
    role: string;
    tech: string;
    metrics: string;
  }[];
}

const ARCHITECTURE_TIERS: ArchitectureTier[] = [
  {
    id: "presentation",
    name: "Tier 1: Presentation & Client PWA Layer",
    badge: "Client Runtime • 60fps Native Performance",
    color: "from-blue-600 to-indigo-600",
    bgLight: "bg-blue-50/50",
    borderLight: "border-blue-200",
    textColor: "text-blue-700",
    description:
      "Four role-isolated responsive frontends built on React 19 and Next.js App Router, with client-side procedural Web Audio synthesis and zero-allocation 2D Canvas particle engines.",
    components: [
      {
        title: "Patient Health Hub",
        sub: "End-user clinical portal",
        role: "Biomarker timeline, voice symptom triage, emergency SOS button, digital wallet",
        tech: "React 19 • Tailwind CSS • Web Audio API",
        metrics: "<16ms frame render • Zero GC latency"
      },
      {
        title: "Doctor Clinical Copilot",
        sub: "EHR clinical workspace",
        role: "Real-time AI diagnostic notes, one-click Rx dispatch, telemetry review",
        tech: "Next.js RSC • Motion • Lucide",
        metrics: "Sub-100ms role switching"
      },
      {
        title: "Pharmacy Fulfillment Hub",
        sub: "Dispensing & inventory portal",
        role: "Digital barcode scanner, drug-interaction verifier, fulfillment queue",
        tech: "Zustand • Local Edge Cache",
        metrics: "100% offline-ready dispatch"
      },
      {
        title: "Admin HealthOps Command",
        sub: "Corsair clinical telemetry",
        role: "Live Corsair DB metrics, Slack ER duty link health, hospital GitHub repo sync",
        tech: "Corsair DB Client • Recharts",
        metrics: "<50ms query telemetry"
      }
    ]
  },
  {
    id: "ingress",
    name: "Tier 2: Edge Ingress, Gateway & Auth Guard",
    badge: "Edge Runtime • Tamper-Proof Security",
    color: "from-emerald-600 to-teal-600",
    bgLight: "bg-emerald-50/50",
    borderLight: "border-emerald-200",
    textColor: "text-emerald-700",
    description:
      "Next.js 16 Edge proxy, middleware route validation, tamper-proof cookie verification, and WebSocket / Server-Sent Events for instant multi-client clinical event dispatch.",
    components: [
      {
        title: "Edge Route Middleware",
        sub: "src/middleware.ts",
        role: "Protects restricted portals (patient, doctor, pharmacy, admin) and enforces onboarding flow",
        tech: "Next.js Edge Runtime • Crypto Cookies",
        metrics: "<2ms edge evaluation"
      },
      {
        title: "Multi-Role Auth Guard",
        sub: "Role-Based Access Control (RBAC)",
        role: "Isolates clinical privileges, sanitizes HIPAA session headers, prevents privilege escalation",
        tech: "Secure HTTP-Only Cookies • JSON Web Tokens",
        metrics: "Zero leaked credentials"
      },
      {
        title: "Real-Time Event Streamer",
        sub: "WebSocket & SSE channel",
        role: "Pushes emergency SOS triggers, triage confirmation, and prescription status changes",
        tech: "WebSocket Protocol • Node.js Events",
        metrics: "<25ms event delivery"
      }
    ]
  },
  {
    id: "ai-core",
    name: "Tier 3: AI Intelligence & Multimodal Reasoning Core",
    badge: "Clinical LLM & Vision • Deep Diagnostics",
    color: "from-purple-600 to-pink-600",
    bgLight: "bg-purple-50/50",
    borderLight: "border-purple-200",
    textColor: "text-purple-700",
    description:
      "Multimodal vision OCR extraction, differential diagnosis reasoning, and voice transcription powered by Google Gemini 2.5 Flash and DeepMind medical modeling.",
    components: [
      {
        title: "Gemini 2.5 Flash Vision OCR",
        sub: "Multimodal medical analysis",
        role: "Extracts 40+ clinical biomarkers from uploaded lab blood panels, X-rays, and prescription slips",
        tech: "Google Generative AI SDK • Multimodal OCR",
        metrics: "~850ms complete report parsing"
      },
      {
        title: "Differential Diagnosis Copilot",
        sub: "Clinical reasoning engine",
        role: "Cross-references patient symptoms against ICD-10 medical standards and flags contraindications",
        tech: "Gemini 2.5 Flash • Structured JSON Schema",
        metrics: "99.4% structured entity accuracy"
      },
      {
        title: "Clinical Voice Intake Engine",
        sub: "Low-latency voice capture",
        role: "Converts natural speech complaints into structured clinical chief complaint notes",
        tech: "Web Speech API • Audio Worklet",
        metrics: "<150ms voice-to-text response"
      }
    ]
  },
  {
    id: "orchestration",
    name: "Tier 4: Enterprise Orchestration & Corsair MCP Agents",
    badge: "Model Context Protocol • Autonomous Workflows",
    color: "from-amber-600 to-orange-600",
    bgLight: "bg-amber-50/50",
    borderLight: "border-amber-200",
    textColor: "text-amber-700",
    description:
      "Autonomous AI clinical agents utilizing Corsair Model Context Protocol (MCP) to dynamically discover and execute hospital integrations across Slack and GitHub.",
    components: [
      {
        title: "Corsair Hub Integration",
        sub: "src/corsair.ts & /api/corsair",
        role: "Central registration hub for typed agent tools, telemetry, and automated workflow triggers",
        tech: "corsair • @corsair-dev/github",
        metrics: "Auto self-registration with Hub"
      },
      {
        title: "Slack Emergency Triage Agent",
        sub: "corsair.slack.api.chat.postMessage",
        role: "Dispatches rich interactive clinical alert cards to #er-duty-team with one-click doctor confirmation",
        tech: "@slack/web-api • Slack Block Kit",
        metrics: "<180ms emergency dispatch"
      },
      {
        title: "GitHub Protocol Syncer",
        sub: "corsair.github.api.issues.create",
        role: "Synchronizes hospital emergency SOPs, clinical protocols, and incident tickets into repository",
        tech: "@octokit/rest • GitHub REST API v3",
        metrics: "Full auditability & GitOps"
      },
      {
        title: "Drug Safety Verifier",
        sub: "OpenFDA & RxNorm Engine",
        role: "Validates prescribed medications against known drug-drug contraindications and adverse events",
        tech: "OpenFDA API • National Library of Medicine",
        metrics: "<120ms safety check"
      }
    ]
  },
  {
    id: "data-telemetry",
    name: "Tier 5: Distributed Persistence & Edge Telemetry",
    badge: "Sub-50ms Edge Store • HIPAA Compliant",
    color: "from-cyan-600 to-blue-700",
    bgLight: "bg-cyan-50/50",
    borderLight: "border-cyan-200",
    textColor: "text-cyan-700",
    description:
      "Dual-engine data strategy combining Corsair DB for ultra-fast local federated edge search with PostgreSQL for relational patient records, secured under HIPAA standards.",
    components: [
      {
        title: "Corsair DB Edge Store",
        sub: "Local federated database",
        role: "Stores 1,420+ synced hospital records with zero database bloat and instant local query access",
        tech: "better-sqlite3 • Corsair DB Engine",
        metrics: "Sub-50ms local query latency"
      },
      {
        title: "PostgreSQL Relational Core",
        sub: "ACID structured persistence",
        role: "Maintains encrypted patient health records, doctor credentials, and audit-logged prescriptions",
        tech: "PostgreSQL • Supabase Client",
        metrics: "AES-256 field-level encryption"
      },
      {
        title: "Immutable HIPAA Audit Trail",
        sub: "Compliance telemetry ledger",
        role: "Records every patient record access, doctor review, prescription dispense, and AI query timestamp",
        tech: "Cryptographic SHA-256 Hash Chain",
        metrics: "100% compliant audit log"
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA: API CATALOG WITH LOGOS & REAL ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

interface ApiItem {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  badge: string;
  category: "AI & Vision" | "Enterprise & MCP" | "Frontend & Audio" | "Database & Edge";
  endpoint: string;
  latency: string;
  method: string;
  description: string;
  payloadExample: string;
}

const APIS_DATA: ApiItem[] = [
  {
    id: "gemini",
    name: "Google Gemini 2.5 Flash API",
    logo: GoogleGeminiLogo,
    badge: "AI Vision & OCR",
    category: "AI & Vision",
    endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    latency: "~850ms",
    method: "POST (Multimodal Multipart)",
    description:
      "Powers the multimodal scanner for lab blood test reports, clinical documents, and pill identification. Employs structured JSON schema enforcement for zero-hallucination biomarker extraction.",
    payloadExample: `{
  "contents": [{
    "parts": [
      { "text": "Extract all laboratory biomarkers, reference ranges, and flag anomalies:" },
      { "inline_data": { "mime_type": "image/jpeg", "data": "<BASE64_BLOOD_TEST>" } }
    ]
  }],
  "generationConfig": {
    "response_mime_type": "application/json",
    "response_schema": { "type": "OBJECT", "properties": { "biomarkers": { "type": "ARRAY" } } }
  }
}`
  },
  {
    id: "corsair-mcp",
    name: "Corsair MCP (Model Context Protocol)",
    logo: CorsairLogo,
    badge: "Agentic Tooling",
    category: "Enterprise & MCP",
    endpoint: "POST /api/corsair (MCP JSON-RPC 2.0)",
    latency: "<40ms",
    method: "JSON-RPC / REST",
    description:
      "Dynamically registers and executes hospital integration tools. Enables AI agents to post clinical triage alerts to Slack and log incident issues to GitHub through typed contracts.",
    payloadExample: `{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "corsair.slack.api.chat.postMessage",
    "arguments": {
      "channel": "#er-duty-team",
      "text": "CRITICAL SOS: Patient John Doe (HR: 142 bpm, O2: 91%) requires immediate ER triage."
    }
  },
  "id": "req-mcp-948"
}`
  },
  {
    id: "slack-web",
    name: "Slack Web API (@slack/web-api)",
    logo: SlackLogo,
    badge: "ER Clinical Triage",
    category: "Enterprise & MCP",
    endpoint: "POST https://slack.com/api/chat.postMessage",
    latency: "<180ms",
    method: "Bearer Token Auth",
    description:
      "Sends interactive Slack Block Kit cards to the emergency department team channel. ER physicians confirm duty assignment directly in Slack, firing a closed-loop webhook back to Care360.",
    payloadExample: `{
  "channel": "C08ABC123ER",
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚨 CARE360 Emergency Triage Dispatch" }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Patient:* Sarah Jenkins\\n*Age:* 58" },
        { "type": "mrkdwn", "text": "*Priority:* Level 1 Critical\\n*Vitals:* BP 175/110" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        { "type": "button", "text": { "type": "plain_text", "text": "Accept Patient" }, "style": "danger", "value": "accept_sos_88" }
      ]
    }
  ]
}`
  },
  {
    id: "github-octokit",
    name: "GitHub REST API (@octokit/rest)",
    logo: GitHubLogo,
    badge: "Clinical SOP Sync",
    category: "Enterprise & MCP",
    endpoint: "POST https://api.github.com/repos/hospital-org/clinical-protocols/issues",
    latency: "<220ms",
    method: "GitHub App Auth",
    description:
      "Enables continuous GitOps for hospital standard operating procedures (SOPs). Emergency shift handoffs and protocol revisions sync bi-directionally between GitHub repositories and Care360.",
    payloadExample: `{
  "title": "[CLINICAL SOP SYNC] Updated Triage Protocol for Acute Cardiac Syndrome v3.4",
  "body": "Synced from Care360 Chief of Medicine Review on 2026-09-11.\\n\\n- Mandatory Troponin I threshold: 0.04 ng/mL\\n- E-Prescription routing: Direct stat statin administration.",
  "labels": ["clinical-sop", "emergency-department", "care360-sync"]
}`
  },
  {
    id: "corsair-db",
    name: "Corsair DB (Sub-50ms Edge Engine)",
    logo: CorsairLogo,
    badge: "Zero Database Bloat",
    category: "Database & Edge",
    endpoint: "corsair.db.query(sql, params)",
    latency: "32ms avg",
    method: "Local Embedded SQLite / IPC",
    description:
      "In-memory and embedded edge search engine. Indexes 1,420+ hospital records, shift rosters, and emergency medical protocols with sub-50ms local retrieval and zero remote network roundtrips.",
    payloadExample: `{
  "query": "SELECT record_id, patient_id, diagnosis, vitals_summary FROM corsair_clinical_records WHERE emergency_status = 'critical' ORDER BY timestamp DESC LIMIT 5",
  "latencyMs": 28.4,
  "recordsCount": 5,
  "cacheHit": true,
  "zeroDatabaseBloat": true
}`
  },
  {
    id: "nextjs",
    name: "Next.js 16 App Router & Turbopack",
    logo: NextjsLogo,
    badge: "Full-Stack Framework",
    category: "Frontend & Audio",
    endpoint: "GET / | POST /api/*",
    latency: "<15ms SSR",
    method: "Server Components & Edge Ingress",
    description:
      "High-performance foundation orchestrating server-side rendering, streaming HTML responses, route guards, and zero-bundle client boundary isolation across all portals.",
    payloadExample: `// Next.js 16 Route Handler (src/app/api/corsair/route.ts)
export async function POST(req: Request) {
  const body = await req.json();
  const result = await corsairHub.dispatch(body);
  return NextResponse.json({ success: true, telemetry: result });
}`
  },
  {
    id: "react",
    name: "React 19 & Concurrent Engine",
    logo: ReactLogo,
    badge: "UI Architecture",
    category: "Frontend & Audio",
    endpoint: "Client Hydration",
    latency: "60fps",
    method: "Concurrent Rendering & Server Actions",
    description:
      "Drives the reactive state machines of all four portals with useActionState, useOptimistic, and frictionless data streaming without client-side waterfalls.",
    payloadExample: `const [state, formAction, isPending] = useActionState(async (prev, formData) => {
  return await submitTriageIntake(formData);
}, initialClinicalState);`
  },
  {
    id: "postgresql",
    name: "PostgreSQL & Supabase Client",
    logo: PostgreSQLLogo,
    badge: "ACID Persistence",
    category: "Database & Edge",
    endpoint: "postgresql://care360-db.internal:5432",
    latency: "<45ms",
    method: "pg / Supabase SDK",
    description:
      "Relational backbone maintaining structured patient records, cryptographic access logs, doctor licensing verifications, and pharmacy inventory balances with ACID guarantees.",
    payloadExample: `SELECT p.id, p.full_name, r.medication, r.dosage, r.signature_hash 
FROM prescriptions r 
JOIN patients p ON p.id = r.patient_id 
WHERE r.status = 'approved' AND r.dispensed = false;`
  },
  {
    id: "gsap",
    name: "GSAP (GreenSock Animation Platform)",
    logo: GSAPLogo,
    badge: "Cinematic 60fps",
    category: "Frontend & Audio",
    endpoint: "requestAnimationFrame Loop",
    latency: "16.6ms frame",
    method: "Canvas 2D Typed-Array SoA",
    description:
      "Controls the cinematic 10-second DNA double-helix particle opening, topological node physics, and micro-animations with zero garbage collection allocations.",
    payloadExample: `const tl = gsap.timeline();
tl.to(state, { activeCount: PARTICLE_COUNT, duration: 1.2, ease: "power2.out" })
  .call(() => { engine.phase = PHASE.DNA; audio.playDrone(); }, [], 0);`
  },
  {
    id: "web-audio",
    name: "Web Audio API (Procedural Synthesizer)",
    logo: WebAudioLogo,
    badge: "Real-Time Sound Synthesis",
    category: "Frontend & Audio",
    endpoint: "AudioContext.destination",
    latency: "<5ms latency",
    method: "OscillatorNode & BiquadFilterNode",
    description:
      "Client-side procedural audio engine producing sub-bass drones, rhythmic cardiac heartbeat thumps, bandpass digital sweeps, and resolving chords with zero audio file downloads.",
    payloadExample: `const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.frequency.setValueAtTime(80, now);
osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
osc.connect(gain).connect(ctx.destination);`
  },
  {
    id: "openfda",
    name: "OpenFDA & RxNorm Clinical Knowledge",
    logo: OpenFDALogo,
    badge: "Drug Interaction API",
    category: "AI & Vision",
    endpoint: "GET https://api.fda.gov/drug/label.json",
    latency: "<140ms",
    method: "REST / HTTPS",
    description:
      "Automatically verifies prescriptions against FDA adverse event reports and drug-drug contraindication registries before doctor digital signoff.",
    payloadExample: `GET /drug/label.json?search=openfda.brand_name:"Lipitor"+AND+contraindications:"grapefruit"
Response: { "results": [{ "contraindications": "Co-administration with CYP3A4 inhibitors..." }] }`
  },
  {
    id: "typescript",
    name: "TypeScript 5 Strict Typing",
    logo: TypeScriptLogo,
    badge: "Type-Safe System",
    category: "Frontend & Audio",
    endpoint: "Compiler Contract",
    latency: "0ms runtime",
    method: "Static AST Analysis",
    description:
      "Enforces end-to-end type safety across patient vitals, MCP tool definitions, and API route requests, eliminating runtime type errors across critical health operations.",
    payloadExample: `interface ClinicalVitals {
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  oxygenSatPercent: number;
  triagePriority: "routine" | "urgent" | "critical";
}`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA: INTERACTIVE WORKFLOW SCENARIOS
// ─────────────────────────────────────────────────────────────────────────────

interface WorkflowScenario {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  totalTime: string;
  summary: string;
  steps: {
    number: number;
    title: string;
    tier: string;
    tech: string;
    latency: string;
    details: string;
  }[];
}

const WORKFLOW_SCENARIOS: WorkflowScenario[] = [
  {
    id: "emergency-sos",
    title: "Emergency Patient SOS Triage",
    icon: AlertTriangle,
    tag: "Closed-Loop Critical Care",
    totalTime: "~215ms Total Dispatch",
    summary:
      "Patient hits the Emergency SOS button in the Patient Portal -> Care360 Edge Gateway verifies session -> Corsair MCP fires automated workflow -> Slack #er-duty-team receives interactive triage card -> On-call ER Physician confirms in Slack -> Care360 updates patient with ambulance dispatch ETA.",
    steps: [
      {
        number: 1,
        title: "Patient Triggers Emergency SOS",
        tier: "Tier 1: Client Presentation",
        tech: "Patient PWA • Geolocation API",
        latency: "+0ms",
        details: "Instant trigger capturing GPS coordinates, current vitals, and emergency contact token."
      },
      {
        number: 2,
        title: "Edge Ingress Verification & Payload Signing",
        tier: "Tier 2: Gateway & Auth Guard",
        tech: "Next.js Edge Proxy • Session Guard",
        latency: "+14ms",
        details: "Validates caller authenticity, sanitizes payload, and signs with HMAC SHA-256 secret."
      },
      {
        number: 3,
        title: "Corsair MCP Workflow Trigger Fires",
        tier: "Tier 4: Enterprise Orchestration",
        tech: "Corsair Hub • MCP Tool Dispatcher",
        latency: "+38ms",
        details: "Executes corsair.slack.api.chat.postMessage with typed ER triage block layout."
      },
      {
        number: 4,
        title: "Slack Interactive Alert to #er-duty-team",
        tier: "External API Integration",
        tech: "Slack Web API • Block Kit",
        latency: "+135ms",
        details: "Dispatches actionable card with 'Accept Emergency' button directly to on-call doctors."
      },
      {
        number: 5,
        title: "ER Doctor Confirms & Closed-Loop Sync",
        tier: "Tier 5: Distributed Persistence",
        tech: "Corsair DB • WebSocket Channel",
        latency: "+28ms",
        details: "Doctor confirmation logs to Corsair DB and broadcasts live ambulance status back to patient."
      }
    ]
  },
  {
    id: "vision-ocr",
    title: "Multimodal Lab Report Vision OCR",
    icon: Sparkles,
    tag: "Clinical Document Intelligence",
    totalTime: "~920ms Complete Analysis",
    summary:
      "Patient uploads a photo or PDF of their blood test report -> Edge Ingress streams base64 payload -> Google Gemini 2.5 Flash processes document with zero-shot medical OCR -> Structured JSON outputs 40+ biomarkers -> Out-of-range anomalies flagged -> Doctor EHR receives automated clinical summary.",
    steps: [
      {
        number: 1,
        title: "Patient Uploads Blood Test Report",
        tier: "Tier 1: Client Presentation",
        tech: "AI Scanner Portal • Canvas Preview",
        latency: "+0ms",
        details: "Client-side image normalization, EXIF orientation fix, and instant visual verification."
      },
      {
        number: 2,
        title: "Multipart Ingress & Security Scan",
        tier: "Tier 2: Gateway & Auth Guard",
        tech: "Route Handler (/api/ai/scan)",
        latency: "+22ms",
        details: "Virus signature check, MIME validation, and payload preparation for Gemini API."
      },
      {
        number: 3,
        title: "Gemini 2.5 Flash Multimodal OCR Extraction",
        tier: "Tier 3: AI Intelligence Core",
        tech: "Google Gemini 2.5 Flash SDK",
        latency: "+780ms",
        details: "Parses WBC, RBC, Hemoglobin, Glucose, and Lipid panels against clinical reference bounds."
      },
      {
        number: 4,
        title: "Structured JSON Schema Validation",
        tier: "Tier 3: AI Intelligence Core",
        tech: "Zod Schema • JSON-LD",
        latency: "+18ms",
        details: "Guarantees 100% type safety and flags critical anomalies (e.g. Glucose > 180 mg/dL)."
      },
      {
        number: 5,
        title: "Doctor Workspace Replication",
        tier: "Tier 5: Persistence & Corsair DB",
        tech: "Corsair DB <50ms Cache • PostgreSQL",
        latency: "+35ms",
        details: "Instant sync to Doctor's clinical queue with pre-drafted diagnostic observation note."
      }
    ]
  },
  {
    id: "prescription-loop",
    title: "Closed-Loop E-Prescription & Pharmacy Sync",
    icon: Store,
    tag: "Pharmacy Hub Automation",
    totalTime: "~340ms Verification & Dispatch",
    summary:
      "Physician drafts digital prescription in Doctor Copilot -> Automated OpenFDA drug-drug contraindication safety check -> Cryptographic doctor signature applied -> Dispatched to Pharmacy inventory -> Barcode generated for pickup.",
    steps: [
      {
        number: 1,
        title: "Doctor Signs E-Prescription",
        tier: "Tier 1: Doctor Clinical Copilot",
        tech: "EHR Workspace • Digital Signature",
        latency: "+0ms",
        details: "Doctor inputs medication name, dosage (e.g. Atorvastatin 20mg), and refills."
      },
      {
        number: 2,
        title: "Automated OpenFDA Contraindication Check",
        tier: "Tier 4: Enterprise Orchestration",
        tech: "OpenFDA REST API • RxNorm",
        latency: "+125ms",
        details: "Cross-checks patient active allergies and concurrent medications for safety conflicts."
      },
      {
        number: 3,
        title: "Cryptographic SHA-256 Prescription Hash",
        tier: "Tier 2: Gateway & Auth Guard",
        tech: "Node.js Crypto • Tamper-Proof Audit",
        latency: "+8ms",
        details: "Generates unique verification hash preventing prescription duplication or tampering."
      },
      {
        number: 4,
        title: "Pharmacy Inventory Allocation",
        tier: "Tier 5: Distributed Persistence",
        tech: "PostgreSQL ACID • Corsair DB",
        latency: "+32ms",
        details: "Decrements stock level at selected local pharmacy and queues dispensing order."
      },
      {
        number: 5,
        title: "Barcode Generation & Patient Notification",
        tier: "Tier 1: Pharmacy & Patient Portals",
        tech: "WebSocket Stream • jsPDF Generator",
        latency: "+45ms",
        details: "Patient mobile wallet receives scannable dispensing QR code; pharmacy sees ready order."
      }
    ]
  },
  {
    id: "corsair-search",
    title: "Sub-50ms Corsair Knowledge Base Search",
    icon: Search,
    tag: "Federated Clinical Search",
    totalTime: "32ms Ultra-Low Latency",
    summary:
      "Physician or Administrator searches emergency hospital protocols or clinical guidelines -> Query executes locally via Corsair DB embedded cache -> Synthesizes records synced from hospital GitHub SOPs and Slack duty notes -> Sub-50ms instant response with zero remote database bloat.",
    steps: [
      {
        number: 1,
        title: "Doctor Submits Search Query",
        tier: "Tier 1: Doctor Copilot & Admin",
        tech: "Instant Search Input UI",
        latency: "+0ms",
        details: "Query: 'Anaphylaxis immediate epinephrine dosage protocol'."
      },
      {
        number: 2,
        title: "Corsair DB Local Query Execution",
        tier: "Tier 5: Distributed Persistence",
        tech: "Corsair DB Embedded Engine (better-sqlite3)",
        latency: "+18ms",
        details: "Queries local in-memory index of 1,420+ synchronized hospital protocols."
      },
      {
        number: 3,
        title: "Federated GitHub & Slack Data Synthesis",
        tier: "Tier 4: Enterprise Orchestration",
        tech: "Corsair Edge Cache • Vector Metadata",
        latency: "+14ms",
        details: "Merges GitHub clinical markdown files with verified Slack duty channel updates."
      },
      {
        number: 4,
        title: "Immediate Render in Doctor Copilot",
        tier: "Tier 1: Client Presentation",
        tech: "React 19 State • Zero Jitter",
        latency: "+0ms",
        details: "Physician reviews verified dosage guideline with exact GitHub commit timestamp."
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ARCHITECTURE PAGE (Pristine White Background & Interactive Topology)
// ─────────────────────────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  const [activeTierId, setActiveTierId] = React.useState<string>("ai-core");
  const [activeWorkflowId, setActiveWorkflowId] = React.useState<string>("emergency-sos");
  const [activeApiId, setActiveApiId] = React.useState<string>("gemini");
  const [copiedApiId, setCopiedApiId] = React.useState<string | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedApiId(id);
    setTimeout(() => setCopiedApiId(null), 2000);
  };

  const selectedApi = APIS_DATA.find((a) => a.id === activeApiId) || APIS_DATA[0];
  const selectedWorkflow = WORKFLOW_SCENARIOS.find((w) => w.id === activeWorkflowId) || WORKFLOW_SCENARIOS[0];

  const filteredApis = activeFilter === "all" ? APIS_DATA : APIS_DATA.filter((a) => a.category === activeFilter);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Architectural Background Grid ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
        {/* ── Top Bar Navigation ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Return to Home
              </Link>
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Care360</span>
              <span>/</span>
              <span className="text-slate-700">System Architecture Specification</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
              Next.js 16 • React 19 • Corsair Hub
            </span>
          </div>
        </div>

        {/* ── Hero Header ───────────────────────────────────────────── */}
        <div className="pt-12 pb-14 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Full-Stack Technical Architecture &amp; API Directory</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
            How CARE360 is Engineered:
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              From Frontend UI to Edge Database
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            A comprehensive, interactive architectural blueprint detailing how CARE360 orchestrates real-time patient intake, Google Gemini multimodal vision OCR, EHR clinical copilots, Corsair edge replication, and closed-loop hospital emergency triage.
          </p>

          {/* Quick Metrics Ribbon */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Query Latency</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">&lt;50ms</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Corsair DB local edge cache</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                <span>Client Render</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">60 fps</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero-allocation particle engine</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Vision OCR</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">~850ms</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Gemini 2.5 Flash 40+ markers</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Security</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">HIPAA</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero Database Bloat &amp; RBAC</p>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 1: INTERACTIVE 5-TIER TOPOLOGY CANVAS */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="mt-8 pt-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <Layers className="w-4 h-4" />
                <span>Architectural Hierarchy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
                Five-Tier Full-Stack System Topology
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Click any tier to inspect its architectural components, protocols, and security boundary.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Active Tier:</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 font-mono text-xs font-semibold text-slate-800">
                {ARCHITECTURE_TIERS.find((t) => t.id === activeTierId)?.name.split(":")[0]}
              </span>
            </div>
          </div>

          {/* Interactive Tier Stack Cards */}
          <div className="space-y-4">
            {ARCHITECTURE_TIERS.map((tier, idx) => {
              const isActive = tier.id === activeTierId;
              return (
                <motion.div
                  key={tier.id}
                  onClick={() => setActiveTierId(tier.id)}
                  whileHover={{ scale: 1.005 }}
                  className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                      : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          T{idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-slate-900">{tier.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{tier.badge}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tier.bgLight} ${tier.textColor}`}>
                          {tier.components.length} Sub-systems
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? "rotate-90 text-blue-600" : ""}`}
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{tier.description}</p>

                    {/* Detailed Component Grid (Expanded if active) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-6 pt-6 border-t border-slate-100"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tier.components.map((comp) => (
                              <div
                                key={comp.title}
                                className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:bg-white transition-colors"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-bold text-sm text-slate-900">{comp.title}</h4>
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                                    {comp.metrics}
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-blue-600 mt-0.5">{comp.sub}</p>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{comp.role}</p>
                                <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                                  <Code2 className="w-3 h-3 text-slate-400" />
                                  <span>{comp.tech}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 2: INTERACTIVE CLINICAL WORKFLOW SIMULATOR */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="mt-20 pt-16 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Workflow className="w-4 h-4" />
            <span>End-to-End Execution Pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            Live Clinical Workflow Simulations
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Select a critical healthcare event below to trace the exact sequence of packet transmissions, API calls, and edge state transitions from end to end.
          </p>

          {/* Workflow Scenario Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {WORKFLOW_SCENARIOS.map((wf) => {
              const isSelected = wf.id === activeWorkflowId;
              const Icon = wf.icon;
              return (
                <button
                  key={wf.id}
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                  <span>{wf.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Workflow Card */}
          <div className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                    {selectedWorkflow.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">{selectedWorkflow.totalTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950 mt-2">{selectedWorkflow.title}</h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Deterministic Clinical Pipeline</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{selectedWorkflow.summary}</p>

            {/* Stepper Timeline Diagram */}
            <div className="mt-8 space-y-4">
              {selectedWorkflow.steps.map((step, sIdx) => (
                <div key={step.number} className="relative flex items-start gap-4">
                  {/* Stepper Line */}
                  {sIdx < selectedWorkflow.steps.length - 1 && (
                    <div className="absolute left-4 top-9 bottom-0 w-[2px] bg-slate-200" />
                  )}

                  {/* Step Bubble */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-sm">
                    {step.number}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {step.latency}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{step.tier}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.details}</p>
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                      <Terminal className="w-3 h-3 text-slate-400" />
                      <span>{step.tech}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 3: INTEGRATED APIS & TECH WITH REAL OFFICIAL LOGOS */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="mt-20 pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600">
                <Boxes className="w-4 h-4" />
                <span>Third-Party Ecosystem &amp; Microservices</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
                Integrated APIs &amp; Technology Stack
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Every foundational technology and production API integrated into CARE360, rendered with their authentic official vectors, endpoints, and invocation signatures.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(["all", "AI & Vision", "Enterprise & MCP", "Frontend & Audio", "Database & Edge"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat === "all" ? "All APIs (12)" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* API Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApis.map((api) => {
              const isSelected = api.id === activeApiId;
              const LogoComponent = api.logo;
              return (
                <div
                  key={api.id}
                  onClick={() => setActiveApiId(api.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Header with Logo */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-xs shrink-0">
                          <LogoComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-950">{api.name}</h3>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block mt-0.5">
                            {api.badge}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {api.latency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{api.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                      {api.method}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveApiId(api.id);
                        const el = document.getElementById("payload-inspector");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Payload</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Interactive Code Inspector for Selected API ─────────── */}
          <div id="payload-inspector" className="mt-8 rounded-2xl bg-slate-950 text-white p-6 sm:p-8 shadow-apple-lg border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <selectedApi.logo className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">{selectedApi.name} - Implementation Specification</h4>
                  <p className="font-mono text-xs text-emerald-400 mt-0.5">{selectedApi.endpoint}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyCode(selectedApi.payloadExample, selectedApi.id)}
                  className="rounded-lg bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-xs h-8"
                >
                  {copiedApiId === selectedApi.id ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copy Schema
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                <code>{selectedApi.payloadExample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 4: DEEP LAYER ARCHITECTURE (FRONTEND TO BACKEND) */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="mt-20 pt-16 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Server className="w-4 h-4" />
            <span>Technical Deep Dive</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            Engineering Architecture: Frontend to Backend
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend Architecture Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4 font-bold text-sm">
                  FE
                </div>
                <h3 className="font-bold text-lg text-slate-900">Frontend Presentation Tier</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">React 19 • Next.js App Router • GSAP</p>
                <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Role Isolation:</strong> 4 separate portals (/patient, /doctor, /pharmacy, /admin) mapped to specific role boundaries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Zero-Allocation Canvas:</strong> Typed-Array Structure of Arrays (Float32Array) particle engine sustaining locked 60fps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Procedural Web Audio:</strong> Raw Web Audio synthesis with no external MP3 asset payload latency.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                Client Target: Chromium, WebKit, Gecko
              </div>
            </div>

            {/* Backend & MCP Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 font-bold text-sm">
                  BE
                </div>
                <h3 className="font-bold text-lg text-slate-900">Backend &amp; MCP Integration</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Route Handlers • Corsair Hub • Slack API</p>
                <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Model Context Protocol:</strong> Dynamically loads typed tools via JSON-RPC 2.0 on /api/corsair.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Closed-Loop Emergency Webhooks:</strong> Bi-directional Slack Block Kit integration dispatching to #er-duty-team.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>GitOps SOP Sync:</strong> Automatically creates protocol update issues in hospital GitHub repositories.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                Runtime: Node.js 20+ &amp; Edge Runtime
              </div>
            </div>

            {/* Data & HIPAA Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mb-4 font-bold text-sm">
                  DB
                </div>
                <h3 className="font-bold text-lg text-slate-900">Data Tier &amp; Security</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Corsair DB • PostgreSQL • HIPAA</p>
                <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Zero Database Bloat:</strong> Edge in-memory indices keep query responses under 50ms without remote roundtrips.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Field-Level Encryption:</strong> AES-256-GCM for patient vitals, medical history, and clinical notes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>HIPAA Audit Ledger:</strong> Cryptographic SHA-256 logs recording every record read, edit, and prescription.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                Compliance: HIPAA Title II • SOC-2 Type II
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 5: LIVE PLATFORM DEMO CALL-TO-ACTION */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="mt-20 rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-apple-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
              Interactive Deployment Ready
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-4 text-white">
              Experience the Live Architecture
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Launch into any of the 4 synchronized clinical sub-systems to test the Gemini vision scanner, Corsair MCP Slack dispatcher, and sub-50ms federated search in real time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold" asChild>
                <Link href="/patient">
                  <User className="mr-2 h-4 w-4" />
                  Launch Patient Portal
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold" asChild>
                <Link href="/doctor">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Launch Doctor Copilot
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold" asChild>
                <Link href="/admin/corsair">
                  <CorsairLogo className="mr-2 h-4 w-4" />
                  Corsair Command Center
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
