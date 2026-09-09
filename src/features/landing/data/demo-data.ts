import { Doctor, Pharmacy, HealthEvent } from "@/types";

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Jenkins",
    specialization: "Cardiology",
    verified: true,
    availability: "Available today, 2:00 PM",
    fee: "$120",
    rating: 4.9,
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialization: "General Practice",
    verified: true,
    availability: "Available tomorrow, 10:00 AM",
    fee: "$80",
    rating: 4.8,
  },
];

export const mockPharmacies: Pharmacy[] = [
  {
    id: "p1",
    name: "CarePlus Pharmacy",
    distance: "0.8 miles",
    verified: true,
    price: "$24.50",
    rating: 4.7,
    fulfillment: ["Pickup in 1h", "Same-day delivery"],
  },
  {
    id: "p2",
    name: "City Health Meds",
    distance: "1.2 miles",
    verified: true,
    price: "$22.00",
    rating: 4.5,
    fulfillment: ["Pickup today"],
  },
];

export const mockTimeline: HealthEvent[] = [
  {
    id: "e1",
    type: "report",
    date: "Oct 12",
    title: "Annual Blood Work",
    description: "Complete blood count and lipid panel.",
  },
  {
    id: "e2",
    type: "consultation",
    date: "Oct 14",
    title: "Consultation with Dr. Jenkins",
    description: "Reviewed lab results, discussed cholesterol management.",
  },
  {
    id: "e3",
    type: "prescription",
    date: "Oct 14",
    title: "New Prescription",
    description: "Atorvastatin 20mg added to daily routine.",
  },
  {
    id: "e4",
    type: "medicine",
    date: "Oct 15",
    title: "Medicine Delivered",
    description: "CarePlus Pharmacy delivered prescription.",
  },
];
