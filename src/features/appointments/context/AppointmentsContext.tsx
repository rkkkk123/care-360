"use client";

import * as React from "react";
import { Appointment } from "@/types/models/appointment";
import { demoAppointments } from "@/features/patient/data/demoData";

export interface BookAppointmentInput {
  doctorId: string;
  doctorName: string;
  specialization: string;
  doctorTitle: string;
  doctorAvatar: string;
  date: string; // ISO date or "2026-03-10"
  time: string; // e.g. "10:30 AM"
  type: "video" | "in_person";
  reason: string;
  attachedReportId?: string;
  attachedReportTitle?: string;
  notes?: string;
  aiPrepSummary?: string;
  fee: number;
}

export interface StoredAppointment extends Appointment {
  doctorTitle?: string;
  doctorAvatar?: string;
  time?: string;
  attachedReportTitle?: string;
  aiPrepSummary?: string;
  fee?: number;
  meetingLink?: string;
}

interface AppointmentsContextType {
  appointments: StoredAppointment[];
  bookAppointment: (input: BookAppointmentInput) => StoredAppointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  updateAppointmentStatus: (id: string, status: StoredAppointment["status"], patientSummary?: string) => void;
  selectedDoctorForBooking: string | null;
  setSelectedDoctorForBooking: (id: string | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  openBookingForDoctor: (doctorId: string) => void;
}

const AppointmentsContext = React.createContext<AppointmentsContextType | undefined>(undefined);

const STORAGE_KEY = "care360_patient_appointments";

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = React.useState<StoredAppointment[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = React.useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);

  // Initialize from storage or fallback to demo
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAppointments(JSON.parse(stored));
      } else {
        // Initial setup with default demo appointment
        const initialList: StoredAppointment[] = demoAppointments.map((app) => ({
          ...app,
          doctorTitle: "MD, FACP",
          doctorAvatar: "AS",
          time: "10:30 AM",
          fee: 85,
          meetingLink: "https://meet.care360.health/room/app-sharma-123",
          attachedReportTitle: "Comprehensive Metabolic Panel",
          aiPrepSummary: "Patient's recent panel shows Vitamin D insufficiency (24 ng/mL) and normal lipid profiles. Focus discussion on optimal D3 supplementation strategy.",
        }));
        setAppointments(initialList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
      }
    } catch (e) {
      setAppointments(demoAppointments);
    }
    setIsInitialized(true);
  }, []);

  // Sync to storage
  const saveAppointments = (newList: StoredAppointment[]) => {
    setAppointments(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to save appointments to localStorage", e);
    }
  };

  const bookAppointment = (input: BookAppointmentInput): StoredAppointment => {
    const newAppointment: StoredAppointment = {
      id: `app_${Date.now()}`,
      patientId: "pat_123",
      doctorId: input.doctorId,
      doctorName: input.doctorName,
      doctorTitle: input.doctorTitle,
      doctorAvatar: input.doctorAvatar,
      specialization: input.specialization,
      date: input.date,
      time: input.time,
      type: input.type,
      status: "scheduled",
      notes: input.notes || input.reason,
      attachedReportTitle: input.attachedReportTitle,
      aiPrepSummary: input.aiPrepSummary,
      fee: input.fee,
      meetingLink: `https://meet.care360.health/room/${input.doctorId}-${Date.now().toString().slice(-4)}`,
    };

    const updated = [newAppointment, ...appointments];
    saveAppointments(updated);
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map((app) =>
      app.id === id ? { ...app, status: "cancelled" as const } : app
    );
    saveAppointments(updated);
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    const updated = appointments.map((app) =>
      app.id === id ? { ...app, date: newDate, time: newTime } : app
    );
    saveAppointments(updated);
  };

  const updateAppointmentStatus = (
    id: string,
    status: StoredAppointment["status"],
    patientSummary?: string
  ) => {
    let completedApp: StoredAppointment | undefined;

    const updated = appointments.map((app) => {
      if (app.id === id) {
        completedApp = {
          ...app,
          status,
          isFinalized: status === "completed",
          patientVisibleSummary: patientSummary || app.patientVisibleSummary,
          finalizedAt: status === "completed" ? new Date().toISOString() : app.finalizedAt,
        };
        return completedApp;
      }
      return app;
    });

    saveAppointments(updated);

    // If completed, record to Health Timeline in localStorage
    if (status === "completed" && completedApp) {
      try {
        const storedTimeline = localStorage.getItem("care360_timeline_events");
        const events = storedTimeline ? JSON.parse(storedTimeline) : [];
        const newEvent = {
          id: `tl_consultation_${id}`,
          type: "consultation",
          title: `Consultation with ${completedApp.doctorName}`,
          description:
            patientSummary ||
            "Clinical consultation completed. Doctor visit summary and care guidance published.",
          date: new Date().toISOString(),
        };

        // Filter duplicates and prepend
        const filtered = events.filter((e: any) => e.id !== newEvent.id);
        const updatedEvents = [newEvent, ...filtered];
        localStorage.setItem("care360_timeline_events", JSON.stringify(updatedEvents));
      } catch (err) {
        console.warn("Could not append timeline event:", err);
      }
    }
  };

  const openBookingForDoctor = (doctorId: string) => {
    setSelectedDoctorForBooking(doctorId);
    setIsBookingModalOpen(true);
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        openBookingForDoctor,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = React.useContext(AppointmentsContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }
  return context;
}
