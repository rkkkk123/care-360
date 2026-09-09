export interface PatientMetrics {
  bloodPressure: string;
  heartRate: number;
  weight: number;
  height: number;
  lastUpdated: string;
}

export interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bloodType?: string;
  allergies: string[];
  metrics: PatientMetrics;
}
