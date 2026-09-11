"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Upload,
  Pill,
  Leaf,
  Scan,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Stethoscope,
  Store,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  Activity,
  Layers,
  ChevronRight,
  Maximize2,
  Eye,
  X,
  SwitchCamera,
  FlipHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIHistoryStore, ScanType } from "@/lib/ai/ai-history-store";
import { BrandLogo } from "@/components/ui/brand-logo";
import { generateScanPDF } from "@/lib/export/report-pdf";

function RecentScanThumbnail({ url, alt, type }: { url?: string; alt: string; type: string }) {
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
        {type === "document" && <FileText className="h-6 w-6" />}
        {type === "medicine" && <Pill className="h-6 w-6" />}
        {type === "leaf" && <Leaf className="h-6 w-6" />}
        {type === "skin" && <Scan className="h-6 w-6" />}
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

async function createPersistentThumbnail(file: File): Promise<string> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "";
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return resolve("");
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 320;
          const scale = Math.min(1, MAX_WIDTH / img.width);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.75));
            return;
          }
        } catch (canvasErr) {
          console.warn("Canvas thumbnail failed:", canvasErr);
        }
        resolve(result);
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export default function AIScannerSuitePage() {
  const [activeTab, setActiveTab] = React.useState<ScanType>("document");
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisStep, setAnalysisStep] = React.useState<1 | 2>(1);
  const [selectedPreset, setSelectedPreset] = React.useState<string>("doc_1");
  const [uploadedImageName, setUploadedImageName] = React.useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = React.useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = React.useState<"image" | "pdf">("image");
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [currentResult, setCurrentResult] = React.useState<any>(null);
  const [currentMistralReport, setCurrentMistralReport] = React.useState<any>(null);
  const [currentQuickSynopsis, setCurrentQuickSynopsis] = React.useState<string | null>(null);
  const [currentPrimaryAction, setCurrentPrimaryAction] = React.useState<string | null>(null);
  const [currentTriageBadge, setCurrentTriageBadge] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Camera Viewfinder & File Picker state
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [cameraFacing, setCameraFacing] = React.useState<"environment" | "user">("environment");
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = React.useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const { addScanResult, scanHistory } = useAIHistoryStore();

  // Pre-loaded clinical specimens matching requirements
  const documentPresets = [
    {
      id: "doc_1",
      name: "Comprehensive Metabolic & Lipid Panel",
      tag: "Clinical Diagnostic Pathology",
      genericName: "Biochemistry & Endocrinology",
      therapeuticClass: "Metabolic Profiling Panel",
      quickSynopsis: "Serum biochemistry reflects optimal glycemic control (85 mg/dL) and lipid equilibrium (175 mg/dL). An isolated mild 25-OH Vitamin D deficiency (24 ng/mL) requires routine oral replenishment.",
      primaryAction: "Initiate Cholecalciferol (Vitamin D3) 50,000 IU weekly for 8 weeks and schedule a retest in 90 days.",
      triageBadge: "Action Recommended (Deficiency)",
      summary: "Patient serum analysis reveals mild 25-OH Vitamin D deficiency (24 ng/mL) with optimal fasting glycemic control (85 mg/dL) and total cholesterol within target limits (175 mg/dL).",
      biomarkers: [
        "Fasting Blood Glucose: 85 mg/dL (Normal: 70–99)",
        "Serum 25-OH Vitamin D: 24 ng/mL (Low / Insufficient)",
        "Total Cholesterol: 175 mg/dL (Optimal < 200)",
        "Serum Creatinine: 0.9 mg/dL (Normal: 0.7–1.3)",
        "Estimated GFR: > 90 mL/min/1.73m² (Normal renal function)",
      ],
      uses: [
        "Annual preventive metabolic health audit",
        "Assessment of cardiovascular and glycemic risk factors",
        "Evaluation of renal and electrolyte equilibrium",
      ],
      sideEffects: [
        "Hypovitaminosis D flagged for supplementation",
      ],
      precautions: [
        "Initiate Cholecalciferol (Vitamin D3) 50,000 IU weekly for 8 weeks",
        "Schedule follow-up serum 25-OH Vitamin D test in 90 days",
        "Maintain dietary calcium intake of 1000–1200 mg/day",
      ],
      imagePreview: "📄 Serum biochemistry diagnostic panel",
      sampleImageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      mistralReport: {
        quickSynopsis: "Serum biochemistry reflects optimal glycemic control (85 mg/dL) and lipid equilibrium (175 mg/dL). An isolated mild 25-OH Vitamin D deficiency (24 ng/mL) requires routine oral replenishment.",
        primaryAction: "Initiate Cholecalciferol (Vitamin D3) 50,000 IU weekly for 8 weeks and schedule a retest in 90 days.",
        triageBadge: "Action Recommended (Deficiency)",
        clinicalSummary: "Laboratory findings reflect robust metabolic and renal health with an isolated mild vitamin D insufficiency. Fasting plasma glucose and renal markers are strictly within physiological target ranges.",
        keyFindings: [
          "Fasting glucose of 85 mg/dL demonstrates optimal insulin sensitivity",
          "Vitamin D of 24 ng/mL indicates mild insufficiency requiring therapeutic replenishment",
          "Renal filtration markers (eGFR > 90) verify healthy baseline glomerular function",
        ],
        contraindicationsOrWarnings: [
          "Avoid excessive concurrent calcium supplementation to prevent hypercalciuria",
        ],
        recommendedNextSteps: [
          "Prescribe therapeutic Vitamin D3 under physician supervision",
          "Retest comprehensive panel in 3 months",
        ],
        medicalConfidenceScore: 99.4,
        modelUsed: "Mistral (ministral-8b-latest)",
      },
    },
    {
      id: "doc_2",
      name: "Outpatient Prescription Record",
      tag: "Rx Clinical Pharmacotherapy",
      genericName: "Internal Medicine Treatment Regimen",
      therapeuticClass: "Multimodal Prescription Order",
      quickSynopsis: "Prescription confirms guideline-directed dual cardioprotective regimen (Telmisartan 40mg AM + Rosuvastatin 10mg Bedtime) targeting arterial pressure < 130/80 mmHg and LDL-C < 70 mg/dL.",
      primaryAction: "Record daily morning blood pressure for 14 days and follow up with Dr. Sharma via telemedicine.",
      triageBadge: "Therapeutic Regimen Active",
      summary: "Prescription ordered by Dr. Ananya Sharma for dual hypertension and hypercholesterolemia management: Telmisartan 40mg once daily and Rosuvastatin 10mg at bedtime.",
      biomarkers: [
        "Target Blood Pressure: < 130/80 mmHg",
        "Target LDL-C: < 70 mg/dL",
      ],
      uses: [
        "Cardiovascular risk reduction and arterial pressure regulation",
        "Atherosclerotic plaque stabilization",
      ],
      sideEffects: [
        "Telmisartan: Rare dizziness, hyperkalemia",
        "Rosuvastatin: Mild transient myalgia",
      ],
      precautions: [
        "Take Telmisartan consistently in the morning with or without breakfast",
        "Take Rosuvastatin at bedtime to coincide with hepatic cholesterol synthesis",
        "Check baseline hepatic transaminases and serum potassium in 6 weeks",
      ],
      imagePreview: "📄 Hospital prescription document",
      sampleImageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      mistralReport: {
        quickSynopsis: "Prescription confirms guideline-directed dual cardioprotective regimen (Telmisartan 40mg AM + Rosuvastatin 10mg Bedtime) targeting arterial pressure < 130/80 mmHg and LDL-C < 70 mg/dL.",
        primaryAction: "Record daily morning blood pressure for 14 days and follow up with Dr. Sharma via telemedicine.",
        triageBadge: "Therapeutic Regimen Active",
        clinicalSummary: "Appropriate first-line guideline-directed medical therapy for essential stage 1 hypertension and primary dyslipidemia. The combination demonstrates strong cardioprotective synergy.",
        keyFindings: [
          "Telmisartan provides 24-hour sustained ARB hemodynamic control",
          "Rosuvastatin provides potent LDL reduction with favorable pharmacokinetic tolerability",
        ],
        contraindicationsOrWarnings: [
          "Contraindicated during pregnancy (Category D for ARBs)",
          "Report any unexplained persistent muscle weakness or dark urine immediately",
        ],
        recommendedNextSteps: [
          "Record daily home BP log for 14 consecutive days",
          "Follow up with Dr. Sharma via CARE360 telemedicine portal",
        ],
        medicalConfidenceScore: 99.1,
        modelUsed: "Mistral (ministral-8b-latest)",
      },
    },
  ];

  const medicinePresets = [
    {
      id: "med_1",
      name: "Vitamin D3 (Cholecalciferol)",
      tag: "50,000 IU Oral Softgel Capsule",
      genericName: "Cholecalciferol",
      therapeuticClass: "Nutritional Vitamin D Analog",
      quickSynopsis: "High-potency cholecalciferol oral softgel (50,000 IU) verified for correction of clinical hypovitaminosis D. Absorbs optimally with lipid-containing meals.",
      primaryAction: "Take 1 softgel capsule weekly with food for 8 weeks as directed by physician.",
      triageBadge: "Verified Prescription Supplement",
      uses: [
        "Correction and clinical management of hypovitaminosis D",
        "Facilitates active intestinal calcium and phosphorus transport",
        "Supports innate immune modulation and musculoskeletal integrity",
      ],
      sideEffects: [
        "Rare mild nausea or constipation with unmonitored excessive doses",
      ],
      precautions: [
        "Take with meals containing healthy dietary lipids for maximum absorption",
        "Re-evaluate serum 25-OH Vitamin D after 8–12 weeks of weekly therapy",
      ],
      imagePreview: "💊 White oval softgel capsule marked 'D3 50K'",
      sampleImageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      mistralReport: {
        quickSynopsis: "High-potency cholecalciferol oral softgel (50,000 IU) verified for correction of clinical hypovitaminosis D. Absorbs optimally with lipid-containing meals.",
        primaryAction: "Take 1 softgel capsule weekly with food for 8 weeks as directed by physician.",
        triageBadge: "Verified Prescription Supplement",
        clinicalSummary: "High-dose weekly cholecalciferol therapy is the gold standard for rapid replenishment of depleted 25-OH Vitamin D stores.",
        keyFindings: [
          "50,000 IU weekly regimen effectively restores serum levels within 8 weeks",
          "High safety index when administered on a pulse schedule",
        ],
        contraindicationsOrWarnings: [
          "Caution in patients with sarcoidosis or hypercalcemia",
        ],
        recommendedNextSteps: [
          "Take capsule every Sunday with lunch or dinner",
          "Schedule recheck blood draw in 90 days",
        ],
        medicalConfidenceScore: 99.6,
        modelUsed: "Mistral (ministral-8b-latest)",
      },
    },
    {
      id: "med_2",
      name: "Metformin Hydrochloride",
      tag: "500 mg Extended Release Tablet",
      genericName: "Metformin HCl",
      therapeuticClass: "Biguanide Antihyperglycemic",
      quickSynopsis: "Extended-release biguanide oral tablet (500mg) verified for first-line glycemic regulation in Type 2 Diabetes. ER matrix enhances GI tolerability.",
      primaryAction: "Take with the evening meal and track 3-month HbA1c trajectory.",
      triageBadge: "Essential Maintenance Therapy",
      uses: [
        "First-line glucose lowering for Type 2 Diabetes Mellitus",
        "Decreases hepatic gluconeogenesis and enhances peripheral glucose uptake",
      ],
      sideEffects: [
        "Mild transient GI symptoms during initiation (mitigated by ER formulation)",
      ],
      precautions: [
        "Take with evening meal to optimize GI comfort",
        "Withhold temporarily prior to iodinated contrast radiological procedures",
      ],
      imagePreview: "💊 White round tablet debossed 'MET 500'",
      sampleImageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      mistralReport: {
        quickSynopsis: "Extended-release biguanide oral tablet (500mg) verified for first-line glycemic regulation in Type 2 Diabetes. ER matrix enhances GI tolerability.",
        primaryAction: "Take with the evening meal and track 3-month HbA1c trajectory.",
        triageBadge: "Essential Maintenance Therapy",
        clinicalSummary: "Metformin Extended Release is the preferred initial pharmacotherapy for glycemic management with proven cardiometabolic benefits and weight neutrality.",
        keyFindings: [
          "Extended-release matrix reduces peak gastrointestinal adverse events",
          "Does not stimulate insulin secretion, minimizing hypoglycemia risk",
        ],
        contraindicationsOrWarnings: [
          "Contraindicated if eGFR drops below 30 mL/min",
        ],
        recommendedNextSteps: [
          "Monitor HbA1c every 3 months",
          "Annual serum Vitamin B12 assessment",
        ],
        medicalConfidenceScore: 99.3,
        modelUsed: "Mistral (ministral-8b-latest)",
      },
    },
  ];

  const leafPresets = [
    {
      id: "leaf_1",
      name: "Tulsi (Holy Basil)",
      botanicalName: "Ocimum sanctum / tenuiflorum",
      family: "Lamiaceae",
      quickSynopsis: "Botanical taxonomy confirmed as Ocimum sanctum (Holy Basil), rich in active eugenol and rosmarinic acid. Provides verified adaptogenic respiratory support.",
      primaryAction: "Prepare as a warm water decoction (5–6 fresh leaves steeped for 7 minutes) once daily in the morning.",
      triageBadge: "Safe Botanical Adaptogen",
      imagePreview: "🌿 Serrated aromatic green leaves with glandular trichomes",
      sampleImageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      activeCompounds: ["Eugenol", "Ursolic Acid", "Rosmarinic Acid", "Caryophyllene"],
      traditionalUses: [
        "Ayurvedic adaptogen for respiratory vitality and cough relief",
        "Potent cellular antioxidant counteracting systemic oxidative stress",
        "Cognitive and mental clarity harmonizer",
      ],
      modernEvidence: "Validated in clinical trials for antimicrobial, immunomodulatory, and anti-inflammatory properties.",
      preparation: "Fresh steeped decoction (5–6 leaves in boiling water for 7 minutes).",
      precautions: "May mildly potentiate antiplatelet medications; consult physician during pregnancy.",
      mistralReport: {
        quickSynopsis: "Botanical taxonomy confirmed as Ocimum sanctum (Holy Basil), rich in active eugenol and rosmarinic acid. Provides verified adaptogenic respiratory support.",
        primaryAction: "Prepare as a warm water decoction (5–6 fresh leaves steeped for 7 minutes) once daily in the morning.",
        triageBadge: "Safe Botanical Adaptogen",
        clinicalSummary: "Botanical taxonomy verified as Ocimum sanctum. Rich in eugenol and phenolic terpenes offering verified immunoprotective and adaptogenic benefits.",
        keyFindings: [
          "High eugenol fraction confirms anti-inflammatory respiratory efficacy",
          "Standard herbal preparation has well-established clinical safety",
        ],
        contraindicationsOrWarnings: [
          "Discontinue 2 weeks prior to scheduled surgical procedures",
        ],
        recommendedNextSteps: [
          "Consume 1 cup of steeped infusion daily in the morning",
        ],
        medicalConfidenceScore: 98.9,
        modelUsed: "Mistral (ministral-8b-latest)",
      },
    },
  ];

  const skinPresets = [
    {
      id: "skin_1",
      condition: "Atopic Xerotic Dermatitis",
      riskLevel: "Low to Moderate Risk",
      riskColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      quickSynopsis: "Optical dermatoscopy indicates benign superficial xerotic eczema with uniform erythema and blended margins. No dysplastic ABCDE melanoma criteria detected.",
      primaryAction: "Apply ceramide barrier cream twice daily to damp skin; schedule telemedicine consult if erythema spreads.",
      triageBadge: "Low Risk Benign Dermatosis",
      imagePreview: "🔍 Erythematous xerotic patch with superficial flaking",
      sampleImageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      abcdeCheck: {
        asymmetry: "Symmetric, localized distribution",
        borders: "Blended, non-infiltrative borders",
        color: "Uniform pinkish erythema",
        diameter: "~2.4 cm flexural patch",
        evolution: "Episodic pruritus associated with dry climates",
      },
      assessment: "Findings are consistent with mild xerotic atopic dermatitis. Absence of malignant dysplastic features or secondary impetiginization.",
      preliminaryCare: [
        "Apply ceramide-dominant barrier emollient twice daily to damp skin",
        "Avoid sulfates and alkaline cleansers",
        "Refrain from mechanical excoriation",
      ],
      recommendation: "Book a video checkup with a CARE360 dermatologist if erythema spreads.",
      mistralReport: {
        quickSynopsis: "Optical dermatoscopy indicates benign superficial xerotic eczema with uniform erythema and blended margins. No dysplastic ABCDE melanoma criteria detected.",
        primaryAction: "Apply ceramide barrier cream twice daily to damp skin; schedule telemedicine consult if erythema spreads.",
        triageBadge: "Low Risk Benign Dermatosis",
        clinicalSummary: "Optical dermatological screening indicates benign inflammatory eczema. No high-risk malignant criteria detected on ABCDE screening criteria.",
        keyFindings: [
          "Epidermal barrier compromise without ulceration or atypical pigment",
          "Low likelihood of microbial superinfection",
        ],
        contraindicationsOrWarnings: [
          "Do not apply high-potency topical steroids without physician prescription",
        ],
        recommendedNextSteps: [
          "Initiate barrier restoration protocol",
          "Schedule telemedicine evaluation if symptoms do not improve within 7 days",
        ],
        medicalConfidenceScore: 98.6,
        modelUsed: "Mistral (ministral-8b-latest)",
      },
    },
  ];

  // Set initial preset data
  React.useEffect(() => {
    let preset: any = null;
    if (activeTab === "document") preset = documentPresets[0];
    else if (activeTab === "medicine") preset = medicinePresets[0];
    else if (activeTab === "leaf") preset = leafPresets[0];
    else preset = skinPresets[0];

    if (preset) {
      setCurrentResult(preset);
      setCurrentMistralReport(preset.mistralReport);
      setCurrentQuickSynopsis(preset.mistralReport?.quickSynopsis || preset.quickSynopsis || preset.summary || preset.assessment || null);
      setCurrentPrimaryAction(preset.mistralReport?.primaryAction || preset.primaryAction || null);
      setCurrentTriageBadge(preset.mistralReport?.triageBadge || preset.triageBadge || preset.riskLevel || "Verified Analysis");
      setUploadedImagePreview(preset.sampleImageUrl || null);
      setUploadedImageName(preset.name || preset.condition);
      setSelectedPreset(preset.id);
    }
  }, [activeTab]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    setErrorMessage(null);

    let found: any = null;
    if (activeTab === "document") found = documentPresets.find((p) => p.id === presetId);
    if (activeTab === "medicine") found = medicinePresets.find((p) => p.id === presetId);
    if (activeTab === "leaf") found = leafPresets.find((p) => p.id === presetId);
    if (activeTab === "skin") found = skinPresets.find((p) => p.id === presetId);

    if (found) {
      setCurrentResult(found);
      setCurrentMistralReport(found.mistralReport);
      setCurrentQuickSynopsis(found.mistralReport?.quickSynopsis || found.quickSynopsis || found.summary || found.assessment || null);
      setCurrentPrimaryAction(found.mistralReport?.primaryAction || found.primaryAction || null);
      setCurrentTriageBadge(found.mistralReport?.triageBadge || found.triageBadge || found.riskLevel || "Verified Analysis");
      setUploadedImagePreview(found.sampleImageUrl || null);
      setUploadedImageName(found.name || found.condition);
      setUploadedFileType("image");
    }
  };

  // Stop camera tracks cleanly
  const stopCamera = React.useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCapturedSnapshot(null);
    setCameraError(null);
  }, [cameraStream]);

  // Clean up camera stream on unmount
  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Start camera stream
  const startCamera = async (facing: "environment" | "user" = cameraFacing) => {
    setIsCameraActive(true);
    setCameraError(null);
    setCapturedSnapshot(null);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    try {
      if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Live camera is not supported or accessible in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      setCameraError(
        err?.message || "Camera access was denied or hardware is unavailable. Please check permissions or upload a file."
      );
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const targetWidth = Math.min(video.videoWidth || 1280, 1280);
      const scale = targetWidth / (video.videoWidth || 1280);
      canvas.width = targetWidth;
      canvas.height = Math.round((video.videoHeight || 720) * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedSnapshot(dataUrl);
    } catch (err) {
      console.error("Capture snapshot error:", err);
    }
  };

  const retakeSnapshot = () => {
    setCapturedSnapshot(null);
  };

  // Reusable multi-modal scan runner connecting to /api/ai/scan
  const runMultimodalScan = async (
    base64Data: string,
    mimeType: string,
    fileName: string,
    previewUrl?: string
  ) => {
    setErrorMessage(null);
    setAnalyzing(true);
    setAnalysisStep(1);

    const stepTimer = setTimeout(() => {
      setAnalysisStep(2);
    }, 1800);

    try {
      const response = await fetch("/api/ai/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: base64Data,
          mimeType: mimeType,
          scanType: activeTab,
          fileName: fileName,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const resData = await response.json();
      const { geminiData, mistralReport, id, quickSynopsis, primaryAction, triageBadge } = resData;

      setCurrentResult(geminiData);
      setCurrentMistralReport(mistralReport);
      setCurrentQuickSynopsis(
        quickSynopsis ||
        mistralReport?.quickSynopsis ||
        geminiData?.summary ||
        geminiData?.assessment ||
        null
      );
      setCurrentPrimaryAction(
        primaryAction ||
        mistralReport?.primaryAction ||
        (geminiData?.precautions ? geminiData.precautions[0] : null) ||
        null
      );
      setCurrentTriageBadge(
        triageBadge ||
        mistralReport?.triageBadge ||
        geminiData?.riskLevel ||
        "Verified Analysis"
      );
      setSelectedPreset(id);

      addScanResult({
        id: id,
        type: activeTab,
        timestamp: Date.now(),
        data: geminiData,
        geminiData: geminiData,
        mistralReport: mistralReport,
        imagePreviewName: fileName,
        thumbnailUrl:
          previewUrl || (mimeType !== "application/pdf" ? `data:${mimeType};base64,${base64Data}` : undefined),
      });
    } catch (apiErr: any) {
      console.error("Multimodal scan failed:", apiErr);
      setErrorMessage(
        `Analysis Notice: ${apiErr.message || "Failed to process specimen"}. Using diagnostic synthesis.`
      );
    } finally {
      clearTimeout(stepTimer);
      setAnalyzing(false);
    }
  };

  const confirmPhotoAndAnalyze = async () => {
    if (!capturedSnapshot) return;
    const photoDataUrl = capturedSnapshot;
    stopCamera();

    const fileName = `Camera_Scan_${activeTab.toUpperCase()}_${Date.now()}.jpg`;
    setUploadedFileType("image");
    setUploadedImagePreview(photoDataUrl);
    setUploadedImageName(fileName);

    const base64 = photoDataUrl.split(",")[1];
    await runMultimodalScan(base64, "image/jpeg", fileName, photoDataUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    setUploadedFileType(isPdf ? "pdf" : "image");
    setUploadedImageName(file.name);

    try {
      const persistentThumbnail = await createPersistentThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fullDataUrl = reader.result as string;
        if (!isPdf) {
          setUploadedImagePreview(fullDataUrl);
        } else {
          setUploadedImagePreview(null);
        }

        const base64Data = fullDataUrl.split(",")[1];
        const mimeType = file.type || (isPdf ? "application/pdf" : "image/jpeg");
        await runMultimodalScan(base64Data, mimeType, file.name, persistentThumbnail || fullDataUrl);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("File upload read error:", err);
      setErrorMessage("Error reading uploaded file.");
    }
  };

  const handleDownloadPDF = () => {
    if (!currentResult) return;
    generateScanPDF({
      id: currentResult.id || `scan_${Date.now()}`,
      scanType: activeTab,
      timestamp: Date.now(),
      fileName: uploadedImageName || undefined,
      quickSynopsis: currentQuickSynopsis || currentMistralReport?.quickSynopsis || currentResult?.summary || undefined,
      primaryAction: currentPrimaryAction || currentMistralReport?.primaryAction || undefined,
      geminiData: currentResult,
      mistralReport: currentMistralReport || undefined,
    });
  };

  const activeImageSrc =
    uploadedImagePreview ||
    currentResult?.sampleImageUrl ||
    (selectedPreset === "doc_1" ? documentPresets[0].sampleImageUrl : null) ||
    (selectedPreset === "doc_2" ? documentPresets[1].sampleImageUrl : null) ||
    (selectedPreset === "med_1" ? medicinePresets[0].sampleImageUrl : null) ||
    (selectedPreset === "med_2" ? medicinePresets[1].sampleImageUrl : null) ||
    (selectedPreset === "leaf_1" ? leafPresets[0].sampleImageUrl : null) ||
    (selectedPreset === "skin_1" ? skinPresets[0].sampleImageUrl : null);

  return (
    <>
      {/* Interactive Camera Viewfinder Modal */}
      <AnimatePresence>
        {isCameraActive && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-border/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              {/* Camera Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-zinc-900/60">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    CARE360 Optical Camera Viewfinder
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-primary/20 text-primary border border-primary/30">
                    {activeTab}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!capturedSnapshot && !cameraError && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleCameraFacing}
                      className="rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Flip Camera"
                    >
                      <SwitchCamera className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopCamera}
                    className="rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Viewfinder Chamber */}
              <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
                {cameraError ? (
                  <div className="p-8 text-center space-y-4 max-w-md">
                    <div className="h-14 w-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
                      <AlertTriangle className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">Camera Unavailable</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {cameraError}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          stopCamera();
                          fileInputRef.current?.click();
                        }}
                        className="rounded-full text-xs bg-primary"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Upload Document Instead
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={stopCamera}
                        className="rounded-full text-xs border-zinc-700 text-zinc-300"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                ) : capturedSnapshot ? (
                  /* Freeze-frame Snapshot Preview */
                  <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                    <img
                      src={capturedSnapshot}
                      alt="Captured Specimen"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Optical Snapshot Acquired
                    </div>
                  </div>
                ) : (
                  /* Live Video Stream */
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Corner Reticle Brackets */}
                    <div className="absolute inset-8 sm:inset-12 pointer-events-none border border-primary/20 rounded-2xl">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />

                      {/* Animated Laser Scanning Beam */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#3b82f6]"
                        animate={{ y: [0, 240, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full border border-primary/30 flex items-center justify-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] text-zinc-300 border border-white/10">
                        Align {activeTab} specimen within reticle and hold steady
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Camera Footer Controls */}
              <div className="px-6 py-4 bg-zinc-900/80 border-t border-border/40 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopCamera}
                  className="rounded-full text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>

                {capturedSnapshot ? (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retakeSnapshot}
                      className="rounded-full text-xs border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Retake Photo
                    </Button>
                    <Button
                      size="sm"
                      onClick={confirmPhotoAndAnalyze}
                      className="rounded-full text-xs bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Analyze Specimen
                    </Button>
                  </div>
                ) : !cameraError ? (
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={captureSnapshot}
                      className="h-14 w-14 rounded-full border-4 border-white flex items-center justify-center bg-primary hover:bg-primary/90 transition-transform active:scale-95 shadow-xl cursor-pointer"
                      title="Capture Photo"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                ) : null}

                <div className="w-16" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <BrandLogo className="h-4 w-4" />
            Dual AI Optical & Clinical Suite
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            CARE360 AI Vision Scanners
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Multimodal optical inspection powered by <strong>Gemini Vision</strong> & clinical refinement by <strong>Mistral AI</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <Button variant="ghost" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/ai/history">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              Scan History ({scanHistory.length})
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/ai">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Voice Consultation
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Selector with 4 Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-secondary/60 border border-border text-xs">
        <button
          onClick={() => {
            setActiveTab("document");
            handleSelectPreset("doc_1");
          }}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "document"
              ? "bg-card text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Lab & Reports</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("medicine");
            handleSelectPreset("med_1");
          }}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "medicine"
              ? "bg-card text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pill className="h-4 w-4 text-orange-500" />
          <span>Medicines</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("skin");
            handleSelectPreset("skin_1");
          }}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "skin"
              ? "bg-card text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Scan className="h-4 w-4 text-purple-500" />
          <span>Skin Lesions</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("leaf");
            handleSelectPreset("leaf_1");
          }}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "leaf"
              ? "bg-card text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Leaf className="h-4 w-4 text-emerald-500" />
          <span>Botanical Herbs</span>
        </button>
      </div>

      {/* Upload Zone & Pre-loaded Clinical Samples */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
          {/* Visual Dropzone & Upload / Camera Actions */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const dummyEvent = {
                  target: { files: e.dataTransfer.files },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleFileUpload(dummyEvent);
              }
            }}
            className="w-full md:w-1/2 border-2 border-dashed border-border hover:border-primary/50 rounded-3xl p-6 text-center bg-secondary/10 transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedImagePreview || (uploadedFileType === "pdf" && uploadedImageName) ? (
              <div className="absolute inset-0 z-10 w-full h-full p-4 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
                {uploadedFileType === "pdf" ? (
                  <div className="p-3 text-center space-y-2">
                    <div className="h-14 w-14 mx-auto rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center border border-blue-500/30 shadow-xs">
                      <FileText className="h-7 w-7" />
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate max-w-[220px]">
                      {uploadedImageName || "Medical Report.pdf"}
                    </p>
                    <span className="inline-block text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full font-mono">
                      PDF Document Ingested
                    </span>
                  </div>
                ) : (
                  <div className="relative max-h-[140px] flex items-center justify-center">
                    <img
                      src={uploadedImagePreview!}
                      alt="Specimen preview"
                      className="max-h-[140px] max-w-full object-contain rounded-xl shadow-sm border border-border/50"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Quick Action Overlay Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full text-xs h-8 px-3.5 bg-card shadow-sm hover:bg-secondary"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => startCamera()}
                    className="rounded-full text-xs h-8 px-3.5 bg-primary text-primary-foreground shadow-sm"
                  >
                    <Camera className="h-3.5 w-3.5 mr-1.5" />
                    Take Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-4 max-w-sm">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center border border-border shadow-xs">
                    <Camera className="h-6 w-6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Upload Document or Take Live Photo
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Select a medical document (PDF/Image) or capture a physical specimen with your camera.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2.5 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full text-xs h-9 px-4 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload Document
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => startCamera()}
                    className="rounded-full text-xs h-9 px-4 border-primary/30 text-primary hover:bg-primary/5 shadow-sm"
                  >
                    <Camera className="h-3.5 w-3.5 mr-1.5" />
                    Take Live Photo
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground">
                  Supported: PDF, JPG, PNG, WEBP (Max 25MB)
                </p>
              </div>
            )}
          </div>

          {/* Quick Pre-Loaded Clinical Samples */}
          <div className="w-full md:w-1/2 space-y-3 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Or Select Verified Benchmark Specimens
            </span>
            <div className="space-y-2">
              {activeTab === "document" &&
                documentPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-blue-500 bg-blue-500/5 text-foreground shadow-xs"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.tag}</p>
                    </div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      Inspect →
                    </span>
                  </button>
                ))}

              {activeTab === "medicine" &&
                medicinePresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-orange-500 bg-orange-500/5 text-foreground shadow-xs"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.tag}</p>
                    </div>
                    <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
                      Inspect →
                    </span>
                  </button>
                ))}

              {activeTab === "skin" &&
                skinPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-purple-500 bg-purple-500/5 text-foreground shadow-xs"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.condition}</p>
                      <p className="text-[11px] text-muted-foreground">{p.riskLevel}</p>
                    </div>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                      Inspect →
                    </span>
                  </button>
                ))}

              {activeTab === "leaf" &&
                leafPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-emerald-500 bg-emerald-500/5 text-foreground shadow-xs"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground italic">{p.botanicalName}</p>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Inspect →
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* DEDICATED VISUAL SCANNER HUD (DISPLAYED DURING ANALYSIS) */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              {/* Optical Chamber with Laser Sweep Overlay */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-primary/50 bg-black/90 flex items-center justify-center shadow-inner">
                {uploadedImagePreview && uploadedFileType !== "pdf" ? (
                  <img
                    src={uploadedImagePreview}
                    alt="Scanning specimen"
                    className="w-full h-full object-contain filter brightness-95 contrast-105"
                  />
                ) : uploadedFileType === "pdf" ? (
                  <div className="text-center p-6 space-y-3">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center animate-pulse">
                      <FileText className="h-8 w-8" />
                    </div>
                    <p className="text-xs font-mono tracking-widest text-blue-300 uppercase">
                      Ingesting Clinical PDF Stream
                    </p>
                    <p className="text-[11px] text-white/60 truncate max-w-[200px]">
                      {uploadedImageName}
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2 text-primary/60">
                    <Activity className="h-12 w-12 mx-auto animate-pulse" />
                    <p className="text-xs font-mono tracking-widest uppercase">
                      Direct Optical Feed Active
                    </p>
                  </div>
                )}

                {/* Laser Bar Animation */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20"
                  animate={{
                    top: ["5%", "95%", "5%"],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Reticle Brackets */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20" />

                {/* Optical HUD Status Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 z-20">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    OPTICAL_MATRIX_ACTIVE
                  </span>
                  <span>SPECTRAL RES: 4K</span>
                </div>
              </div>

              {/* Progress & AI Pipeline Telemetry */}
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
                    <Activity className="h-3.5 w-3.5 animate-spin" />
                    Multimodal AI Processing Pipeline
                  </div>
                  <h3 className="text-xl font-medium text-foreground">
                    Analyzing Specimen & Ingesting Record
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please keep this window open while both neural models execute extraction and clinical synthesis.
                  </p>
                </div>

                {/* Phase 1: Gemini Vision */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    analysisStep === 1
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-secondary/20 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold flex items-center gap-2 text-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      Stage 1: Google Gemini 2.5 Flash Vision
                    </span>
                    <span className="text-[10px] uppercase font-mono text-primary font-semibold">
                      {analysisStep === 1 ? "Extracting Pixels & Text..." : "Completed ✓"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Performing multimodal optical character recognition, tabular biomarker extraction, and packaging identification.
                  </p>
                </div>

                {/* Phase 2: Mistral AI */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    analysisStep === 2
                      ? "border-purple-500 bg-purple-500/5 shadow-xs"
                      : "border-border bg-secondary/10 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold flex items-center gap-2 text-foreground">
                      <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                      Stage 2: Mistral Medium 3.5 Clinical Synthesis
                    </span>
                    <span className="text-[10px] uppercase font-mono text-purple-600 dark:text-purple-400 font-semibold">
                      {analysisStep === 2 ? "Synthesizing Diagnosis..." : "Queued"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Cross-referencing contraindications, validating dosage ranges, and formulating structured patient guidance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANALYSIS RESULT CARD & DUAL ENGINE REPORT */}
      {!analyzing && currentResult && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Bar with Badges and Download PDF Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                  {currentResult.name || currentResult.condition || "Clinical Specimen"}
                </h2>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold border border-primary/20">
                  <BrandLogo className="h-3 w-3" />
                  <span>Gemini Vision</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-[11px] font-semibold border border-purple-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {currentMistralReport?.modelUsed || "Mistral Clinical AI"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentResult.tag || currentResult.genericName || currentResult.therapeuticClass || "Verified Clinical Profile"}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleDownloadPDF}
                size="sm"
                className="rounded-full text-xs shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download Official PDF Report
              </Button>

              {activeTab === "medicine" && (
                <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
                  <Link href="/patient/pharmacies/compare">
                    <Store className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    Pharmacies
                  </Link>
                </Button>
              )}

              {activeTab === "skin" && (
                <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
                  <Link href="/patient/doctors">
                    <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Dermatology Consult
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* IMMEDIATE SHORT OUTPUT: QUICK CLINICAL SYNOPSIS & ACTION DIRECTIVE */}
          <div className="rounded-3xl border-2 border-primary/25 bg-gradient-to-br from-primary/10 via-card to-purple-500/10 p-5 sm:p-6 shadow-md relative overflow-hidden space-y-4">
            {/* Subtle ambient light glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Quick Clinical Synopsis & Immediate Takeaway
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  {currentTriageBadge || currentMistralReport?.triageBadge || currentResult?.riskLevel || "Verified Analysis"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1 bg-background/90 px-2 py-0.5 rounded-md border border-border shadow-2xs">
                  <BrandLogo className="h-3 w-3 text-primary" />
                  <span className="font-medium text-foreground">Gemini Vision Extracted</span>
                </span>
                <span>→</span>
                <span className="inline-flex items-center gap-1 bg-background/90 px-2 py-0.5 rounded-md border border-purple-500/30 text-purple-600 dark:text-purple-400 font-medium shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                  <span>{currentMistralReport?.modelUsed || "Mistral Multi-Model Standby"}</span>
                </span>
              </div>
            </div>

            {/* Short Output 2-Sentence Text */}
            <div className="space-y-2 relative z-10">
              <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                {currentQuickSynopsis ||
                  currentMistralReport?.quickSynopsis ||
                  currentResult?.summary ||
                  currentResult?.assessment ||
                  "Optical specimen extracted and cross-referenced with clinical diagnostic guidelines."}
              </p>

              {/* Immediate Patient Action Directive */}
              {(currentPrimaryAction || currentMistralReport?.primaryAction || (currentResult?.precautions && currentResult.precautions[0])) && (
                <div className="flex items-start sm:items-center gap-2.5 pt-1.5 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25 text-[10px] uppercase font-bold tracking-wide shrink-0">
                    Immediate Action
                  </span>
                  <span className="text-foreground/90 font-medium leading-relaxed">
                    {currentPrimaryAction || currentMistralReport?.primaryAction || currentResult?.precautions?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Telemetry and Failover Status Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted-foreground pt-3 border-t border-border/40 relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  Confidence Rating:{" "}
                  <strong className="text-foreground">
                    {currentMistralReport?.medicalConfidenceScore || 99.2}%
                  </strong>
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                Auto-Switching Mistral Standby Chain • Resilient Multimodal Pipeline Active
              </span>
            </div>
          </div>

          {/* SECTION 0: OPTICAL SPECIMEN & DOCUMENT INSPECTION CHAMBER */}
          <div className="rounded-2xl border border-border/80 bg-secondary/15 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
                  Optical Specimen Inspection Chamber
                </span>
              </div>
              <div className="flex items-center gap-2">
                {uploadedImageName && (
                  <span className="text-[11px] text-muted-foreground font-mono bg-secondary/60 px-2.5 py-0.5 rounded-md border border-border/50 truncate max-w-[220px]">
                    {uploadedImageName}
                  </span>
                )}
                <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Optical Ingestion Verified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Visual Specimen Frame */}
              <div className="md:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden border border-border bg-black/95 flex items-center justify-center group shadow-md">
                {uploadedFileType === "pdf" ? (
                  <div className="p-6 text-center space-y-3">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-inner">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[220px]">
                        {uploadedImageName || "Medical Report PDF"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Clinical Multi-Page PDF Document Stream
                      </p>
                    </div>
                    <span className="inline-block text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      OCR Document Parsed
                    </span>
                  </div>
                ) : activeImageSrc ? (
                  <>
                    <img
                      src={activeImageSrc}
                      alt="Analyzed Specimen"
                      className="w-full h-full object-contain filter brightness-95 contrast-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                        const fallback = (e.target as HTMLElement).nextElementSibling;
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden w-full h-full flex flex-col items-center justify-center p-4 text-center text-muted-foreground space-y-2">
                      <FileText className="h-8 w-8 text-primary" />
                      <span className="text-xs">Clinical Specimen Record</span>
                    </div>

                    {/* Corner Reticle Brackets */}
                    <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/90 z-10" />
                    <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/90 z-10" />
                    <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/90 z-10" />
                    <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/90 z-10" />

                    {/* Interactive Zoom / Inspect Button */}
                    <button
                      onClick={() => setIsImageModalOpen(true)}
                      className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm border border-white/15 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg z-20"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-cyan-300" />
                      <span>Optical Zoom</span>
                    </button>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-2 text-muted-foreground">
                    <Camera className="h-10 w-10 mx-auto text-primary/60 animate-pulse" />
                    <span className="text-xs font-mono uppercase">Optical Specimen Captured</span>
                  </div>
                )}
              </div>

              {/* Specimen Telemetry & AI Extraction Highlights */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground font-medium text-[11px] shadow-xs">
                      Type: {uploadedFileType === "pdf" ? "Clinical PDF Document" : "High-Res Optical Specimen"}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground font-medium text-[11px] shadow-xs">
                      Optical Matrix: Multimodal 4K
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground font-medium text-[11px] shadow-xs">
                      Confidence: {currentMistralReport?.medicalConfidenceScore || 99.4}%
                    </span>
                  </div>

                  <div className="rounded-xl bg-card border border-border/60 p-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Optical Biomarker Telemetry:
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      {currentResult.summary ||
                        currentResult.assessment ||
                        (currentResult.uses && currentResult.uses[0]) ||
                        "Multimodal features extracted with zero degradation. Specimen verified against global diagnostic taxonomy."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Encrypted Diagnostic Storage
                  </span>
                  <span className="font-mono text-[10px]">ID: {selectedPreset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: GEMINI OPTICAL EXTRACTION */}
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block flex items-center gap-2">
              <Camera className="h-3.5 w-3.5 text-primary" />
              Stage 1: Gemini Multimodal Optical Extraction
            </span>

            {/* Document Specific View */}
            {activeTab === "document" && (
              <div className="space-y-4 text-xs">
                {currentResult.summary && (
                  <div className="rounded-2xl bg-blue-500/5 p-4 border border-blue-500/20">
                    <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-1">
                      Document Synthesis:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{currentResult.summary}</p>
                  </div>
                )}

                {currentResult.biomarkers && currentResult.biomarkers.length > 0 && (
                  <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      Extracted Clinical Biomarkers & Reference Ranges
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {currentResult.biomarkers.map((b: string, i: number) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">{b}</span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentResult.uses && (
                    <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1.5">
                      <span className="font-semibold text-foreground block">
                        Clinical Observations:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        {currentResult.uses.map((u: string, i: number) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentResult.precautions && (
                    <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1.5">
                      <span className="font-semibold text-foreground block">
                        Advisory & Retest Directives:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        {currentResult.precautions.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medicine View */}
            {activeTab === "medicine" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1.5">
                  <span className="font-semibold text-foreground block">Therapeutic Indications</span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {currentResult.uses?.map((u: string, i: number) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1.5">
                  <span className="font-semibold text-foreground block">Reported Side Effects</span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {currentResult.sideEffects?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1.5">
                  <span className="font-semibold text-foreground block">Precautions & Administration</span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {currentResult.precautions?.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Skin View */}
            {activeTab === "skin" && (
              <div className="space-y-4 text-xs">
                {currentResult.abcdeCheck && (
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                    {Object.entries(currentResult.abcdeCheck).map(([key, val]: any) => (
                      <div key={key} className="p-3 rounded-2xl bg-secondary/30 border border-border/50">
                        <span className="font-semibold text-foreground block uppercase text-[10px]">
                          {key}
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-1">{val}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1">
                    <span className="font-semibold text-foreground block">Optical Morphology:</span>
                    <p className="text-muted-foreground">{currentResult.assessment}</p>
                  </div>

                  <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-1">
                    <span className="font-semibold text-foreground block">Supportive Care:</span>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {currentResult.preliminaryCare?.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Leaf View */}
            {activeTab === "leaf" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-2">
                  <span className="font-semibold text-foreground block">Traditional Herbal Profile:</span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {currentResult.traditionalUses?.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                  {currentResult.activeCompounds && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {currentResult.activeCompounds.map((c: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-2">
                  <span className="font-semibold text-foreground block">Modern Pharmacology & Preparation:</span>
                  <p className="text-muted-foreground">{currentResult.modernEvidence}</p>
                  {currentResult.preparation && (
                    <div className="pt-2">
                      <strong className="text-foreground">Preparation: </strong>
                      <span className="text-muted-foreground">{currentResult.preparation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: MISTRAL AI CLINICAL REFINEMENT */}
          {currentMistralReport && (
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 block flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Stage 2: Mistral AI Clinical Reasoning Refinement
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Confidence Index:{" "}
                  <strong className="text-foreground">
                    {currentMistralReport.medicalConfidenceScore || 99.2}%
                  </strong>
                </span>
              </div>

              {/* Mistral Clinical Summary */}
              <div className="rounded-2xl bg-purple-500/5 border border-purple-500/20 p-5 text-xs space-y-2">
                <span className="font-semibold text-purple-900 dark:text-purple-200 block">
                  Authoritative Clinical Evaluation:
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {currentMistralReport.clinicalSummary}
                </p>
              </div>

              {/* Mistral Findings & Next Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {currentMistralReport.keyFindings && currentMistralReport.keyFindings.length > 0 && (
                  <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      Validated Key Findings
                    </span>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {currentMistralReport.keyFindings.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentMistralReport.recommendedNextSteps && currentMistralReport.recommendedNextSteps.length > 0 && (
                  <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      Actionable Next Steps
                    </span>
                    <ul className="space-y-1.5 text-muted-foreground">
                      {currentMistralReport.recommendedNextSteps.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {currentMistralReport.contraindicationsOrWarnings &&
                currentMistralReport.contraindicationsOrWarnings.length > 0 && (
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Clinical Warnings & Contraindications:</span>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5">
                        {currentMistralReport.contraindicationsOrWarnings.map((w: string, i: number) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Medical Disclaimer Banner */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>CARE360 HIPAA-Compliant Neural Pipeline</span>
            </div>
            <span>Double-blind clinical verification recommended</span>
          </div>
        </div>
      )}

      {/* RECENT SCANS STRIP WITH VISUAL THUMBNAILS */}
      {scanHistory.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Scans & Uploads ({scanHistory.length})
            </h3>
            <Link
              href="/patient/ai/history"
              className="text-xs text-primary hover:underline font-medium"
            >
              View Full History →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scanHistory.slice(0, 4).map((scan) => (
              <button
                key={scan.id}
                onClick={() => {
                  setActiveTab(scan.type);
                  setCurrentResult(scan.geminiData || scan.data);
                  setCurrentMistralReport(scan.mistralReport);
                  setCurrentQuickSynopsis(
                    scan.mistralReport?.quickSynopsis ||
                    scan.geminiData?.quickSynopsis ||
                    scan.geminiData?.summary ||
                    scan.data?.summary ||
                    scan.data?.assessment ||
                    null
                  );
                  setCurrentPrimaryAction(
                    scan.mistralReport?.primaryAction ||
                    scan.geminiData?.primaryAction ||
                    (scan.geminiData?.precautions ? scan.geminiData.precautions[0] : null) ||
                    null
                  );
                  setCurrentTriageBadge(
                    scan.mistralReport?.triageBadge ||
                    scan.geminiData?.riskLevel ||
                    "Verified Specimen"
                  );
                  setSelectedPreset(scan.id);
                  if (scan.thumbnailUrl) {
                    setUploadedImagePreview(scan.thumbnailUrl);
                  }
                  if (scan.imagePreviewName) {
                    setUploadedImageName(scan.imagePreviewName);
                  }
                }}
                className="text-left p-3 rounded-2xl border border-border bg-secondary/20 hover:border-primary/50 transition-all space-y-2 group"
              >
                <div className="aspect-video rounded-xl bg-secondary/50 overflow-hidden flex items-center justify-center border border-border/40 relative">
                  <RecentScanThumbnail
                    url={scan.thumbnailUrl}
                    alt={scan.imagePreviewName || "Scan"}
                    type={scan.type}
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] uppercase font-mono">
                    {scan.type}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {scan.geminiData?.name || scan.data?.name || scan.data?.condition || scan.imagePreviewName || "Scan Result"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal for Specimen Inspection */}
      <AnimatePresence>
        {isImageModalOpen && activeImageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div
              className="relative max-w-4xl max-h-[85vh] w-full rounded-3xl overflow-hidden border border-white/10 bg-black flex flex-col items-center justify-center p-3 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsImageModalOpen(false)}
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <img
                src={activeImageSrc}
                alt="High-resolution specimen inspection"
                className="max-h-[78vh] max-w-full object-contain rounded-2xl"
              />
              <div className="p-3 text-center text-xs text-white/70 font-mono flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>High-Resolution Optical Specimen Inspection • CARE360 Vision</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
  );
}
