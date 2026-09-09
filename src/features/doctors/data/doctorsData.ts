import { DoctorProfile, DaySchedule } from "@/types/models/doctor";

// Helper to generate dynamic upcoming dates
const getUpcomingDate = (offsetDays: number): { date: string; displayDate: string } => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const dateStr = d.toISOString().split("T")[0];
  const displayStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return { date: dateStr, displayDate: displayStr };
};

const createSchedule = (offsetStart: number): DaySchedule[] => {
  return [0, 1, 2, 3, 4].map((offset) => {
    const { date, displayDate } = getUpcomingDate(offsetStart + offset);
    return {
      date,
      displayDate,
      slots: [
        { id: `${date}-0900`, time: "09:00 AM", period: "morning", available: true },
        { id: `${date}-1030`, time: "10:30 AM", period: "morning", available: offset % 2 === 0 },
        { id: `${date}-1145`, time: "11:45 AM", period: "morning", available: true },
        { id: `${date}-0200`, time: "02:00 PM", period: "afternoon", available: true },
        { id: `${date}-0330`, time: "03:30 PM", period: "afternoon", available: offset % 3 !== 0 },
        { id: `${date}-0445`, time: "04:45 PM", period: "afternoon", available: true },
        { id: `${date}-0615`, time: "06:15 PM", period: "evening", available: true },
      ],
    };
  });
};

export const verifiedDoctors: DoctorProfile[] = [
  {
    id: "doc_sharma",
    name: "Dr. Ananya Sharma",
    title: "MD, FACP",
    specialization: "Internal Medicine & Metabolic Health",
    subspecialties: ["Preventive Medicine", "Lipidology", "Micronutrient Optimization"],
    rating: 4.98,
    reviewCount: 214,
    experienceYears: 14,
    verified: true,
    verificationBadge: "CARE360 Verified Fellow",
    licenseNumber: "CA-MED-491028",
    credentials: [
      "MD — Johns Hopkins University School of Medicine",
      "Residency — Stanford University Medical Center",
      "Fellow — American College of Physicians (FACP)",
      "Board Certified — American Board of Internal Medicine"
    ],
    hospitalAffiliations: [
      "Stanford Health Care",
      "Sutter Health Medical Center"
    ],
    languages: ["English", "Hindi", "Spanish"],
    consultationFee: 85,
    consultationTypes: ["video", "in_person"],
    nextAvailableSlot: "Tomorrow at 10:30 AM",
    bio: "Dr. Sharma is a dedicated internist specializing in longevity medicine, evidence-based metabolic health, and preventive cardiovascular care. She takes a holistic, data-driven approach to analyzing patient lab trends, continuous biomarker monitoring, and personalized therapeutic interventions.",
    clinicalFocus: [
      "Metabolic Panel & Biomarker Analysis",
      "Vitamin D & Micronutrient Deficiencies",
      "Preventive Hypertension & Cardiovascular Risk",
      "Metabolic Syndrome & Glucose Regulation"
    ],
    aiMatchScore: 98,
    aiMatchReason: "98% Match: Top specialist for your March 2026 Metabolic Panel. Direct expertise in resolving Vitamin D insufficiency and long-term lipid optimization.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    clinicAddress: {
      street: "300 Pasteur Drive",
      suite: "Pavilion C, Suite 410",
      city: "Palo Alto",
      state: "CA",
      zip: "94304"
    },
    reviews: [
      {
        id: "rev_1",
        patientName: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Dr. Sharma spent 30 minutes going over my blood panel in detail. She explained how my Vitamin D and lipids interact in a way no doctor ever had. Truly exceptional care.",
        consultationType: "video"
      },
      {
        id: "rev_2",
        patientName: "Michael T.",
        rating: 5,
        date: "Last month",
        comment: "The video consultation was seamless. She had already reviewed my CARE360 lab upload before the call started. Very reassuring and thorough.",
        consultationType: "video"
      }
    ],
    weeklySchedule: createSchedule(1)
  },
  {
    id: "doc_rostova",
    name: "Dr. Elena Rostova",
    title: "MD, PhD",
    specialization: "Endocrinology & Micronutrient Biology",
    subspecialties: ["Bone Mineral Metabolism", "Hormonal Regulation", "Vitamin D Kinetics"],
    rating: 4.97,
    reviewCount: 168,
    experienceYears: 12,
    verified: true,
    verificationBadge: "CARE360 Verified Specialist",
    licenseNumber: "NY-MED-883491",
    credentials: [
      "MD/PhD — Columbia University Vagelos College of Physicians",
      "Fellowship in Endocrinology — UCSF Medical Center",
      "Endocrine Society Distinguished Scholar",
      "Board Certified — Endocrinology, Diabetes & Metabolism"
    ],
    hospitalAffiliations: [
      "Mount Sinai Hospital",
      "NewYork-Presbyterian"
    ],
    languages: ["English", "Russian", "French"],
    consultationFee: 95,
    consultationTypes: ["video"],
    nextAvailableSlot: "Today at 03:30 PM",
    bio: "Dr. Rostova is an endocrinologist and translational researcher focused on nutrient-endocrine interactions, thyroid regulation, and bone health. She works with patients to address chronic nutrient insufficiencies, subclinical metabolic shifts, and systemic fatigue.",
    clinicalFocus: [
      "25-OH Vitamin D & Calcium Homeostasis",
      "Thyroid Function & Metabolism",
      "Adrenal & Cortisol Rhythm Analysis",
      "Osteopenia & Bone Density Optimization"
    ],
    aiMatchScore: 95,
    aiMatchReason: "95% Match: Renowned endocrinologist specializing in Vitamin D deficiency, bone health, and metabolic balance.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    reviews: [
      {
        id: "rev_3",
        patientName: "David K.",
        rating: 5,
        date: "3 weeks ago",
        comment: "Dr. Rostova diagnosed the root cause of my fatigue when other doctors simply brushed it off. Her knowledge of micronutrients is unparalleled.",
        consultationType: "video"
      }
    ],
    weeklySchedule: createSchedule(0)
  },
  {
    id: "doc_vance",
    name: "Dr. Marcus Vance",
    title: "MD, FACC",
    specialization: "Preventive Cardiology & Lipidology",
    subspecialties: ["Atherosclerosis Prevention", "Advanced Lipid Profiling", "Vascular Ultrasound"],
    rating: 4.95,
    reviewCount: 182,
    experienceYears: 18,
    verified: true,
    verificationBadge: "CARE360 Verified Fellow",
    licenseNumber: "MA-MED-320911",
    credentials: [
      "MD — Harvard Medical School",
      "Cardiology Fellowship — Cleveland Clinic Heart Institute",
      "Fellow — American College of Cardiology (FACC)",
      "Board Certified — Cardiovascular Disease & Internal Medicine"
    ],
    hospitalAffiliations: [
      "Massachusetts General Hospital",
      "Brigham and Women's Hospital"
    ],
    languages: ["English"],
    consultationFee: 110,
    consultationTypes: ["video", "in_person"],
    nextAvailableSlot: "Wednesday at 02:00 PM",
    bio: "Dr. Vance is a leader in preventive cardiovascular health, focusing on early intervention through advanced biomarker tracking, ApoB and LDL particle quantification, and arterial health assessment before symptoms develop.",
    clinicalFocus: [
      "Advanced Lipid & Cholesterol Management",
      "Coronary Calcium & Arterial Health",
      "Blood Pressure Rhythm Optimization",
      "Exercise & Cardiorespiratory Fitness"
    ],
    aiMatchScore: 91,
    aiMatchReason: "91% Match: Ideal for cardiovascular risk prevention and long-term tracking of total cholesterol & LDL deltas.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    clinicAddress: {
      street: "55 Fruit Street",
      suite: "Cardiology Suite 800",
      city: "Boston",
      state: "MA",
      zip: "02114"
    },
    reviews: [
      {
        id: "rev_4",
        patientName: "Robert P.",
        rating: 5,
        date: "1 month ago",
        comment: "Dr. Vance looked at my multi-year lipid trends on CARE360 and put together a clear, actionable plan that brought my numbers right where they need to be.",
        consultationType: "in_person"
      }
    ],
    weeklySchedule: createSchedule(2)
  },
  {
    id: "doc_chen",
    name: "Dr. David Chen",
    title: "MD",
    specialization: "Family Medicine & Integrative Care",
    subspecialties: ["Preventive Health", "Chronic Care Coordination", "Lifestyle Medicine"],
    rating: 4.92,
    reviewCount: 142,
    experienceYears: 10,
    verified: true,
    verificationBadge: "CARE360 Verified Physician",
    licenseNumber: "CA-MED-771203",
    credentials: [
      "MD — Perelman School of Medicine at UPenn",
      "Residency — UCLA Ronald Reagan Medical Center",
      "Board Certified — American Board of Family Medicine"
    ],
    hospitalAffiliations: [
      "UCLA Health",
      "Cedars-Sinai Medical Care"
    ],
    languages: ["English", "Mandarin"],
    consultationFee: 75,
    consultationTypes: ["video", "in_person"],
    nextAvailableSlot: "Tomorrow at 09:00 AM",
    bio: "Dr. Chen believes that continuous healthcare relationships produce the best outcomes. He integrates modern clinical diagnostics with actionable nutrition and lifestyle advice, helping patients stay proactive about their overall wellness.",
    clinicalFocus: [
      "Annual Wellness & Preventative Screenings",
      "Holistic Lab Panel Interpretation",
      "Stress, Sleep & Metabolic Balance",
      "Family Health Coordination"
    ],
    aiMatchScore: 89,
    aiMatchReason: "89% Match: Comprehensive primary care physician who excels at annual physical reviews and coordinating specialist follow-ups.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    clinicAddress: {
      street: "200 UCLA Medical Plaza",
      suite: "Suite 220",
      city: "Los Angeles",
      state: "CA",
      zip: "90095"
    },
    reviews: [
      {
        id: "rev_5",
        patientName: "Amanda L.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Dr. Chen is so patient and empathetic. He answered all my questions without rushing me.",
        consultationType: "video"
      }
    ],
    weeklySchedule: createSchedule(1)
  },
  {
    id: "doc_jenkins",
    name: "Dr. Sarah Jenkins",
    title: "MD, FACG",
    specialization: "Gastroenterology & Digestive Wellness",
    subspecialties: ["Nutrient Malabsorption", "Microbiome & Liver Health", "Functional Gut Disorders"],
    rating: 4.94,
    reviewCount: 130,
    experienceYears: 15,
    verified: true,
    verificationBadge: "CARE360 Verified Fellow",
    licenseNumber: "IL-MED-550921",
    credentials: [
      "MD — Yale School of Medicine",
      "Gastroenterology Fellowship — Northwestern Memorial Hospital",
      "Fellow — American College of Gastroenterology (FACG)",
      "Board Certified — Gastroenterology & Hepatology"
    ],
    hospitalAffiliations: [
      "Northwestern Memorial Hospital",
      "Rush University Medical Center"
    ],
    languages: ["English"],
    consultationFee: 100,
    consultationTypes: ["video"],
    nextAvailableSlot: "Thursday at 11:45 AM",
    bio: "Dr. Jenkins focuses on how gut permeability and absorption directly influence systemic health, micronutrient uptake, and immune balance. She works with patients experiencing chronic nutrient deficiencies to evaluate digestive absorption efficiency.",
    clinicalFocus: [
      "Fat-Soluble Vitamin Uptake (A, D, E, K)",
      "Liver Enzymes & Metabolic Markers",
      "Gut Microbiome Optimization",
      "Food Intolerances & Inflammatory Response"
    ],
    aiMatchScore: 84,
    aiMatchReason: "84% Match: Specialist in nutrient absorption; valuable if Vitamin D levels do not respond to standard oral supplementation.",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    reviews: [
      {
        id: "rev_6",
        patientName: "Gregory H.",
        rating: 5,
        date: "3 weeks ago",
        comment: "Great consultation. She helped me realize my low vitamin levels were tied to gut absorption. Highly recommend.",
        consultationType: "video"
      }
    ],
    weeklySchedule: createSchedule(3)
  }
];
