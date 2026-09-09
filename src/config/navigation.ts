import {
  Home,
  Sparkles,
  Calendar,
  FileText,
  Stethoscope,
  Store,
  Pill,
  Clock,
  Activity,
  Bell,
  Settings,
  ShieldCheck,
  Camera,
  AlertCircle,
  Star,
  Users,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  section: "primary" | "secondary" | "mobile_only";
  mobileVisible?: boolean;
}

export const patientNavigation: NavItem[] = [
  // Primary
  { label: "Home", href: "/patient", icon: Home, section: "primary", mobileVisible: true },
  { label: "AI Care & Voice", href: "/patient/ai", icon: Sparkles, section: "primary", mobileVisible: true },
  { label: "AI Scanners", href: "/patient/ai/scanner", icon: Camera, section: "primary", mobileVisible: true },
  { label: "Appointments", href: "/patient/appointments", icon: Calendar, section: "primary", mobileVisible: true },
  { label: "Timeline", href: "/patient/timeline", icon: Clock, section: "primary", mobileVisible: true },
  { label: "Reports", href: "/patient/reports", icon: FileText, section: "primary" },
  { label: "Health", href: "/patient/health", icon: Activity, section: "primary" },
  
  // Care Network
  { label: "Doctors", href: "/patient/doctors", icon: Stethoscope, section: "primary" },
  { label: "Pharmacies", href: "/patient/pharmacies", icon: Store, section: "primary" },
  { label: "Prescriptions", href: "/patient/prescriptions", icon: Pill, section: "primary" },
  { label: "Home Visit", href: "/patient/home-visit", icon: Home, section: "primary" },
  { label: "Emergency SOS", href: "/patient/emergency", icon: AlertCircle, section: "primary" },
  
  // Secondary (Bottom of sidebar)
  { label: "Notifications", href: "/patient/notifications", icon: Bell, section: "secondary" },
  { label: "Settings", href: "/patient/settings", icon: Settings, section: "secondary" }
];

export const doctorNavigation: NavItem[] = [
  { label: "Home", href: "/doctor", icon: Home, section: "primary", mobileVisible: true },
  { label: "Consultations", href: "/doctor/appointments", icon: Calendar, section: "primary", mobileVisible: true },
  { label: "Prescriptions", href: "/doctor/prescriptions", icon: Pill, section: "primary", mobileVisible: true },
  { label: "Availability", href: "/doctor/availability", icon: Clock, section: "primary" },
  { label: "Reviews & Ratings", href: "/doctor/reviews", icon: Star, section: "primary" },
  { label: "Patients", href: "/doctor/patients", icon: FileText, section: "primary" },
  { label: "Notifications", href: "/doctor/notifications", icon: Bell, section: "secondary" },
  { label: "Settings", href: "/doctor/settings", icon: Settings, section: "secondary" }
];

export const pharmacyNavigation: NavItem[] = [
  { label: "Dashboard", href: "/pharmacy", icon: Home, section: "primary", mobileVisible: true },
  { label: "Orders Queue", href: "/pharmacy/orders", icon: Pill, section: "primary", mobileVisible: true },
  { label: "Inventory & Stock", href: "/pharmacy/inventory", icon: Store, section: "primary", mobileVisible: true },
  { label: "Customer Reviews", href: "/pharmacy/reviews", icon: Star, section: "primary" },
  { label: "Pharmacy Profile", href: "/pharmacy/profile", icon: FileText, section: "primary" },
  { label: "Analytics", href: "/pharmacy/analytics", icon: Activity, section: "primary" },
  { label: "Notifications", href: "/pharmacy/notifications", icon: Bell, section: "secondary" },
  { label: "Settings", href: "/pharmacy/settings", icon: Settings, section: "secondary" }
];

export const adminNavigation: NavItem[] = [
  { label: "Control Center", href: "/admin", icon: Home, section: "primary", mobileVisible: true },
  { label: "Pharmacy Verifications", href: "/admin/verifications/pharmacies", icon: ShieldCheck, section: "primary", mobileVisible: true },
  { label: "Doctor Verifications", href: "/admin/verifications", icon: Stethoscope, section: "primary" },
  { label: "User Management", href: "/admin/users", icon: Users, section: "primary" },
  { label: "Complaints & Disputes", href: "/admin/complaints", icon: AlertCircle, section: "primary" },
  { label: "Platform Analytics", href: "/admin/analytics", icon: Activity, section: "primary" },
  { label: "Settings", href: "/admin/settings", icon: Settings, section: "secondary" }
];

export const navigation = {
  main: [
    { name: "How it Works", href: "/how-it-works" },
    { name: "AI Care", href: "/ai" },
    { name: "Doctors", href: "/doctors" },
    { name: "Pharmacies", href: "/pharmacies" },
    { name: "Trust & Safety", href: "/trust" },
  ],
  footer: {
    product: [
      { name: "Features", href: "#" },
      { name: "AI Assistant", href: "#" },
      { name: "For Doctors", href: "#" },
      { name: "For Pharmacies", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  },
};
