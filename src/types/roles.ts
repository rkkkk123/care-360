export type Role = "patient" | "doctor" | "pharmacy" | "admin";

export const ROLES: Record<string, Role> = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  PHARMACY: "pharmacy",
  ADMIN: "admin",
} as const;
