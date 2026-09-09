export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  verified: boolean;
  availability: string;
  fee: string;
  rating: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  distance: string;
  verified: boolean;
  price: string;
  rating: number;
  fulfillment: string[];
}

export interface HealthEvent {
  id: string;
  type: "report" | "consultation" | "prescription" | "medicine" | "follow-up";
  date: string;
  title: string;
  description: string;
}
