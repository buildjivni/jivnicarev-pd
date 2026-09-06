import { create } from "zustand";

export type SupportedLanguage = "en" | "hinglish";

export interface ServiceableCity {
  id: string;
  name: string;
  state: string;
  status: "ACTIVE" | "COMING_SOON";
  description: string;
}

export const SERVICEABLE_CITIES: ServiceableCity[] = [
  {
    id: "jamui",
    name: "Jamui",
    state: "Bihar",
    status: "ACTIVE",
    description: "Live OPD Queues & Verified Clinics Active",
  },
  {
    id: "deoghar",
    name: "Deoghar",
    state: "Jharkhand",
    status: "ACTIVE",
    description: "Live OPD Queues & Verified Clinics Active",
  },
  {
    id: "patna",
    name: "Patna",
    state: "Bihar",
    status: "COMING_SOON",
    description: "Expanding Soon — Hospital Network Onboarding",
  },
  {
    id: "muzaffarpur",
    name: "Muzaffarpur",
    state: "Bihar",
    status: "COMING_SOON",
    description: "Expanding Soon",
  },
  {
    id: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    status: "COMING_SOON",
    description: "Expanding Soon",
  },
];

interface PatientLocationState {
  selectedDistrict: string;
  language: SupportedLanguage;
  savedDoctorIds: string[];
  isLocationSheetVisible: boolean;
  setSelectedDistrict: (district: string) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleSavedDoctor: (doctorId: string) => void;
  isDoctorSaved: (doctorId: string) => boolean;
  setIsLocationSheetVisible: (visible: boolean) => void;
}

export const usePatientLocationStore = create<PatientLocationState>((set, get) => ({
  selectedDistrict: "Jamui",
  language: "en",
  savedDoctorIds: [],
  isLocationSheetVisible: false,

  setSelectedDistrict: (district: string) => set({ selectedDistrict: district }),
  setLanguage: (lang: SupportedLanguage) => set({ language: lang }),
  
  toggleSavedDoctor: (doctorId: string) => {
    const { savedDoctorIds } = get();
    if (savedDoctorIds.includes(doctorId)) {
      set({ savedDoctorIds: savedDoctorIds.filter((id) => id !== doctorId) });
    } else {
      set({ savedDoctorIds: [...savedDoctorIds, doctorId] });
    }
  },

  isDoctorSaved: (doctorId: string) => {
    return get().savedDoctorIds.includes(doctorId);
  },

  setIsLocationSheetVisible: (visible: boolean) => set({ isLocationSheetVisible: visible }),
}));
