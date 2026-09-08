import { create } from "zustand";
import { Doctor } from "../types/doctor";

export interface BookingPatientDetails {
  name: string;
  phone: string;
  age: string;
  gender: string;
  problem?: string;
}

export interface GeneratedToken {
  id: string;
  tokenNumber: number;
  doctorId: string;
  doctorName: string;
  doctorImage?: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  currentTokenNumber: number;
  patientsAhead: number;
  estimatedWaitMinutes: number;
  paymentMode: "CASH" | "ONLINE";
  status: "WAITING" | "BOOKED" | "READY" | "CALLED" | "IN_CONSULTATION" | "COMPLETED" | "CANCELLED";
  isEmergency: boolean;
  bookedAt: string;
  patientName: string;
  patientPhone: string;
  fee: string;
}

interface BookingState {
  selectedDoctor: Doctor | null;
  selectedService: "clinic" | "emergency";
  patientDetails: BookingPatientDetails;
  paymentMode: "CASH" | "ONLINE";
  generatedToken: GeneratedToken | null;
  activeBookings: GeneratedToken[];

  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedService: (service: "clinic" | "emergency") => void;
  setPatientDetails: (details: Partial<BookingPatientDetails>) => void;
  setPaymentMode: (mode: "CASH" | "ONLINE") => void;
  setGeneratedToken: (token: GeneratedToken | null) => void;
  addActiveBooking: (token: GeneratedToken) => void;
  cancelBooking: (tokenId: string) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedDoctor: null,
  selectedService: "clinic",
  patientDetails: {
    name: "",
    phone: "",
    age: "",
    gender: "Male",
    problem: "",
  },
  paymentMode: "CASH",
  generatedToken: null,
  activeBookings: [],

  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  setSelectedService: (service) => set({ selectedService: service }),
  setPatientDetails: (details) =>
    set((state) => ({
      patientDetails: { ...state.patientDetails, ...details },
    })),
  setPaymentMode: (paymentMode) => set({ paymentMode }),
  setGeneratedToken: (generatedToken) => set({ generatedToken }),

  addActiveBooking: (token) =>
    set((state) => ({
      activeBookings: [token, ...state.activeBookings],
      generatedToken: token,
    })),

  cancelBooking: (tokenId) =>
    set((state) => ({
      activeBookings: state.activeBookings.map((b) =>
        b.id === tokenId ? { ...b, status: "CANCELLED" } : b
      ),
      generatedToken:
        state.generatedToken?.id === tokenId
          ? { ...state.generatedToken, status: "CANCELLED" }
          : state.generatedToken,
    })),

  clearBooking: () =>
    set({
      selectedDoctor: null,
      selectedService: "clinic",
      generatedToken: null,
    }),
}));
