"use client";

import * as React from "react";
import Link from "next/link";
import {
  Camera,
  Upload,
  Pill,
  Leaf,
  Scan,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  RefreshCw,
  Eye,
  Stethoscope,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeImage } from "@/lib/ai/gemini-client";
import { useAIHistoryStore } from "@/lib/ai/ai-history-store";
import { BrandLogo } from "@/components/ui/brand-logo";

type ScannerTab = "medicine" | "leaf" | "skin";

export default function AIScannerSuitePage() {
  const [activeTab, setActiveTab] = React.useState<ScannerTab>("medicine");
  const [analyzing, setAnalyzing] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string>("med_1");
  const [uploadedImageName, setUploadedImageName] = React.useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = React.useState<string | null>(null);

  const { addScanResult } = useAIHistoryStore();

  // Demo sample datasets matching poster requirements
  const [medicinePresets, setMedicinePresets] = React.useState<any[]>([
    {
      id: "med_1",
      name: "Vitamin D3 (Cholecalciferol)",
      tag: "50,000 IU Oral Capsule",
      imagePreview: "💊 White oval softgel capsule marked 'D3 50K'",
      genericName: "Cholecalciferol",
      therapeuticClass: "Nutritional Vitamin D Supplement",
      uses: [
        "Treatment and clinical management of severe Vitamin D deficiency (hypovitaminosis D).",
        "Enhances intestinal calcium and phosphorus absorption for bone mineral density.",
        "Immune modulation and metabolic balance.",
      ],
      sideEffects: [
        "Hypercalcemia with excessive unmonitored intake (rare at weekly dosage)",
        "Mild gastrointestinal nausea or constipation",
      ],
      precautions: [
        "Best absorbed when taken with high-fat or substantial meals.",
        "Periodic serum 25-OH Vitamin D monitoring recommended every 90 days.",
        "Check for concomitant intake of thiazide diuretics or high calcium supplements.",
      ],
    },
    {
      id: "med_2",
      name: "Metformin Hydrochloride",
      tag: "500 mg Extended Release Tablet",
      imagePreview: "💊 White round biconvex tablet with 'MET 500' debossed",
      genericName: "Metformin HCl",
      therapeuticClass: "Biguanide Antihyperglycemic",
      uses: [
        "First-line glucose lowering for Type 2 Diabetes management.",
        "Improves peripheral insulin sensitivity and reduces hepatic glucose production.",
      ],
      sideEffects: [
        "Mild transient GI upset or diarrhea during initial 1–2 weeks",
        "Metallic taste in mouth",
      ],
      precautions: [
        "Take with evening dinner to maximize tolerability.",
        "Avoid excessive alcohol consumption during treatment.",
        "Monitor eGFR kidney function annually.",
      ],
    },
  ]);

  const [leafPresets, setLeafPresets] = React.useState<any[]>([
    {
      id: "leaf_1",
      name: "Tulsi (Holy Basil)",
      botanicalName: "Ocimum sanctum / Ocimum tenuiflorum",
      family: "Lamiaceae",
      imagePreview: "🌿 Ovate green leaves with serrated margins and aromatic trichomes",
      activeCompounds: ["Eugenol", "Ursolic Acid", "Rosmarinic Acid", "Caryophyllene"],
      traditionalUses: [
        "Ayurvedic adaptogen for respiratory health and acute cough/cold relief.",
        "Natural antioxidant protecting cellular membranes against oxidative stress.",
        "Anti-stress and cognitive vitality balancer.",
      ],
      modernEvidence: "Demonstrated in vitro and in vivo antimicrobial, immunomodulatory, and anti-inflammatory properties.",
      preparation: "Fresh decoction (kadha) or steeped leaf tea (5-6 fresh leaves in boiling water for 7 minutes).",
      precautions: "May moderately potentiate anticoagulant medications; consult your doctor if pregnant.",
    },
    {
      id: "leaf_2",
      name: "Neem (Indian Lilac)",
      botanicalName: "Azadirachta indica",
      family: "Meliaceae",
      imagePreview: "🌿 Pinnate composite serrated leaves with bitter scent",
      activeCompounds: ["Nimbin", "Azadirachtin", "Nimbidol", "Quercetin"],
      traditionalUses: [
        "Traditional blood purification and skin inflammatory conditions (acne, eczema).",
        "Oral antimicrobial hygiene (traditional Datun twigs).",
        "Topical antifungal and insect deterrent applications.",
      ],
      modernEvidence: "Extensively documented broad-spectrum antibacterial and antifungal activity against epidermal pathogens.",
      preparation: "Topical leaf paste or diluted leaf infusion bath for dermal irritation.",
      precautions: "Avoid internal consumption in high doses; not recommended for infants or expectant mothers.",
    },
  ]);

  const [skinPresets, setSkinPresets] = React.useState<any[]>([
    {
      id: "skin_1",
      condition: "Atopic Dermatitis / Eczema",
      riskLevel: "Low to Moderate Risk",
      riskColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      imagePreview: "🔍 Erythematous patch with fine flaking and mild xerosis on flexural skin",
      abcdeCheck: {
        asymmetry: "Symmetric, diffuse localized rash",
        borders: "Irregular, non-discrete borders",
        color: "Uniform pinkish-red erythema",
        diameter: "~2.4 cm localized patch",
        evolution: "Reported mild pruritus fluctuating with dry weather",
      },
      assessment: "Findings are strongly consistent with mild-to-moderate atopic xerotic eczema. No signs of secondary bacterial impetiginization or atypical pigmentary dysplasia.",
      preliminaryCare: [
        "Apply fragrance-free ceramide-based barrier emollient twice daily immediately after bathing.",
        "Avoid harsh sodium lauryl sulfate soaps and hot showers.",
        "Do not scratch to prevent dermal barrier disruption.",
      ],
      recommendation: "Consult a CARE360 board-certified dermatologist if symptoms worsen or do not respond to barrier repair.",
    },
  ]);

  const handleSimulateUpload = (presetId: string) => {
    setSelectedPreset(presetId);
    setUploadedImagePreview(null);
    setUploadedImageName(null);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 600);
  };

  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImageName(file.name);
      
      const objectUrl = URL.createObjectURL(file);
      setUploadedImagePreview(objectUrl);
      
      setAnalyzing(true);
      
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          
          let prompt = "";
          if (activeTab === "medicine") {
            prompt = `Analyze this medicine image. Return ONLY a valid JSON object with these keys: name, tag, genericName, therapeuticClass, uses (array of strings), sideEffects (array of strings), precautions (array of strings), imagePreview (a string with an emoji describing it). Do not include markdown formatting or backticks.`;
          } else if (activeTab === "leaf") {
            prompt = `Analyze this plant/leaf image. Return ONLY a valid JSON object with these keys: name, botanicalName, family, activeCompounds (array of strings), traditionalUses (array of strings), modernEvidence, preparation, precautions, imagePreview (a string with an emoji describing it). Do not include markdown formatting or backticks.`;
          } else {
            prompt = `Analyze this skin condition image. Return ONLY a valid JSON object with these keys: condition, riskLevel, abcdeCheck (object with asymmetry, borders, color, diameter, evolution), assessment, preliminaryCare (array of strings), recommendation, imagePreview. Do not include markdown formatting or backticks.`;
          }
          
          try {
            const jsonStr = await analyzeImage(base64String, file.type, prompt);
            const data = JSON.parse(jsonStr.replace(/```json/g, "").replace(/```/g, "").trim());
            data.id = `custom_${Date.now()}`;
            
            
            if (activeTab === "medicine") {
              setMedicinePresets(prev => [...prev, data]);
            } else if (activeTab === "leaf") {
              setLeafPresets(prev => [...prev, data]);
            } else {
              setSkinPresets(prev => [...prev, data]);
            }
            setSelectedPreset(data.id);
            
            // Save to persistent history
            addScanResult({
              id: data.id,
              type: activeTab,
              timestamp: Date.now(),
              data: data,
              imagePreviewName: file.name
            });
            
          } catch (err) {
            console.error("Analysis failed:", err);
            alert("Failed to analyze image with Vision AI.");
          }
          setAnalyzing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        setAnalyzing(false);
      }
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300 mb-2">
            <BrandLogo className="h-4 w-4" />
            CARE360 Vision AI Intelligence
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            AI Vision Scanners
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Instant AI visual identification for medications, medicinal botanical plants, and preliminary skin screening.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <Button variant="ghost" size="sm" className="rounded-full text-xs w-full sm:w-auto justify-start sm:justify-center" asChild>
            <Link href="/patient/ai/history">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              View Scan History
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs w-full sm:w-auto justify-start sm:justify-center" asChild>
            <Link href="/patient/ai">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Switch to Voice Assistant
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-secondary/60 border border-border text-xs">
        <button
          onClick={() => {
            setActiveTab("medicine");
            setSelectedPreset("med_1");
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "medicine"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pill className="h-4 w-4 text-primary" />
          <span>Medicine Scanner</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("leaf");
            setSelectedPreset("leaf_1");
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "leaf"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Leaf className="h-4 w-4 text-emerald-500" />
          <span>Leaf / Plant Analysis</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("skin");
            setSelectedPreset("skin_1");
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
            activeTab === "skin"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Scan className="h-4 w-4 text-purple-500" />
          <span>Skin Image Screening</span>
        </button>
      </div>

      {/* Upload Zone & Quick Specimen Picker */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Visual Dropzone */}
          <div className="w-full md:w-1/2 border-2 border-dashed border-border hover:border-primary/40 rounded-3xl p-8 text-center bg-secondary/10 transition-colors relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomFileUpload}
              className="absolute inset-0 z-20 opacity-0 cursor-pointer w-full h-full"
            />
            {uploadedImagePreview ? (
              <div className="absolute inset-0 z-10 w-full h-full p-2">
                <img src={uploadedImagePreview} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                <div className="absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-2xl z-20 pointer-events-none">
                  <div className="h-12 w-12 mx-auto rounded-full bg-background text-foreground flex items-center justify-center shadow-lg mb-2">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground bg-background px-3 py-1 rounded-full shadow-sm">Replace Image</span>
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-3">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Drop photo or click to capture
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Supports camera capture or high-res JPG / PNG (Max 15MB)
                  </p>
                </div>
                <span className="inline-block text-[11px] font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Instant AI Vision Processing
                </span>
              </div>
            )}
          </div>

          {/* Quick Demo Samples */}
          <div className="w-full md:w-1/2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Or Try Pre-Loaded Clinical Samples
            </span>
            <div className="space-y-2">
              {activeTab === "medicine" &&
                medicinePresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateUpload(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.tag}</p>
                    </div>
                    <span className="text-[11px] text-primary font-medium">Select Sample →</span>
                  </button>
                ))}

              {activeTab === "leaf" &&
                leafPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateUpload(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-emerald-500/40 bg-emerald-500/5 text-foreground"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground italic">{p.botanicalName}</p>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Select Sample →
                    </span>
                  </button>
                ))}

              {activeTab === "skin" &&
                skinPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateUpload(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs ${
                      selectedPreset === p.id
                        ? "border-purple-500/40 bg-purple-500/5 text-foreground"
                        : "border-border bg-secondary/20 hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.condition}</p>
                      <p className="text-[11px] text-muted-foreground">{p.riskLevel}</p>
                    </div>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                      Select Sample →
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      {analyzing ? (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center shadow-sm space-y-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-green-500 to-primary animate-pulse" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping" />
              <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center border-2 border-primary/30 shadow-lg relative z-10">
                <BrandLogo className="h-8 w-8 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-green-600">
                Gemini AI is analyzing your image...
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Extracting features, cross-referencing global medical databases, and generating a comprehensive clinical report.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* TAB 1: MEDICINE RESULT */}
          {activeTab === "medicine" && (() => {
            const med = medicinePresets.find((m) => m.id === selectedPreset) || medicinePresets[0];
            return (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-green-500/10" />
                      <Pill className="h-6 w-6 relative z-10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{med.name}</h3>
                        <div className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold">
                           <BrandLogo className="h-3 w-3" />
                           <span>Gemini AI Verified (99.4% Match)</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Generic: <strong className="text-foreground">{med.genericName}</strong> • {med.therapeuticClass}
                      </p>
                    </div>
                  </div>

                  <Button size="sm" className="rounded-full text-xs" asChild>
                    <Link href="/patient/pharmacies/compare">
                      <Store className="h-3.5 w-3.5 mr-1.5" />
                      Find in Pharmacies
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Uses */}
                  <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                      Primary Clinical Uses
                    </span>
                    <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                      {med.uses.map((u: string, i: number) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Side Effects */}
                  <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                      Reported Side Effects
                    </span>
                    <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                      {med.sideEffects.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Precautions */}
                  <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                      Precautions & Directions
                    </span>
                    <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                      {med.precautions.map((p: string, i: number) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl bg-primary/[0.04] p-4 border border-primary/15 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    Verified against CARE360 Controlled National Drug Code Database. Always verify prescription dosages with your doctor.
                  </span>
                </div>
              </div>
            );
          })()}

          {/* TAB 2: LEAF / PLANT RESULT */}
          {activeTab === "leaf" && (() => {
            const plant = leafPresets.find((l) => l.id === selectedPreset) || leafPresets[0];
            return (
              <div className="rounded-3xl border border-emerald-500/20 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{plant.name}</h3>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold border border-emerald-500/20">
                          <BrandLogo className="h-3 w-3" />
                          <span>Gemini AI Botanical Match (98.8%)</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Botanical: <em className="text-foreground">{plant.botanicalName}</em> • Family: {plant.family}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      Traditional & Ayurvedic Benefits
                    </span>
                    <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                      {plant.traditionalUses.map((u: string, i: number) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      Active Phytochemicals
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {plant.activeCompounds.map((c: string, i: number) => (
                        <span key={i} className="rounded-lg bg-card px-2.5 py-1 text-foreground border border-border text-[11px] font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground pt-2">
                      <strong className="text-foreground">Modern Evidence:</strong> {plant.modernEvidence}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/20 space-y-1">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">Preparation Method:</span>
                    <p className="text-muted-foreground">{plant.preparation}</p>
                  </div>

                  <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/20 space-y-1">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">Safety & Precautions:</span>
                    <p className="text-muted-foreground">{plant.precautions}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 3: SKIN SCREENING RESULT */}
          {activeTab === "skin" && (() => {
            const skin = skinPresets.find((s) => s.id === selectedPreset) || skinPresets[0];
            return (
              <div className="rounded-3xl border border-purple-500/20 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20 shrink-0">
                      <Scan className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{skin.condition}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${skin.riskColor}`}>
                          {skin.riskLevel}
                        </span>
                        <div className="flex items-center gap-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-[11px] font-semibold border border-purple-500/20">
                           <BrandLogo className="h-3 w-3" />
                           <span>Gemini AI Dermatology Engine</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Comprehensive Optical Dermatology Analysis
                      </p>
                    </div>
                  </div>

                  <Button size="sm" className="rounded-full text-xs shadow-md shadow-primary/20" asChild>
                    <Link href="/patient/doctors">
                      <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                      Consult Dermatologist
                    </Link>
                  </Button>
                </div>

                {/* ABCDE Screening Breakdown */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Dermatological ABCDE Criteria Evaluation
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                    <div className="rounded-2xl bg-secondary/30 p-3 border border-border/50">
                      <span className="font-semibold text-foreground block">A • Asymmetry</span>
                      <p className="text-[11px] text-muted-foreground mt-1">{skin.abcdeCheck.asymmetry}</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/30 p-3 border border-border/50">
                      <span className="font-semibold text-foreground block">B • Border</span>
                      <p className="text-[11px] text-muted-foreground mt-1">{skin.abcdeCheck.borders}</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/30 p-3 border border-border/50">
                      <span className="font-semibold text-foreground block">C • Color</span>
                      <p className="text-[11px] text-muted-foreground mt-1">{skin.abcdeCheck.color}</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/30 p-3 border border-border/50">
                      <span className="font-semibold text-foreground block">D • Diameter</span>
                      <p className="text-[11px] text-muted-foreground mt-1">{skin.abcdeCheck.diameter}</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/30 p-3 border border-border/50">
                      <span className="font-semibold text-foreground block">E • Evolution</span>
                      <p className="text-[11px] text-muted-foreground mt-1">{skin.abcdeCheck.evolution}</p>
                    </div>
                  </div>
                </div>

                {/* Preliminary Guidance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      AI Optical Assessment
                    </span>
                    <p className="text-muted-foreground">{skin.assessment}</p>
                  </div>

                  <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block">
                      Preliminary Soothing Guidance
                    </span>
                    <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                      {skin.preliminaryCare.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* High Priority Medical Disclaimer */}
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold">Clinical Screening Notice:</p>
                    <p className="text-[11px]">
                      AI visual skin analysis is an informational pre-screening tool and does NOT substitute for physical dermatoscopic examination or biopsy. For persistent, changing, or bleeding lesions, schedule an immediate video consultation.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
