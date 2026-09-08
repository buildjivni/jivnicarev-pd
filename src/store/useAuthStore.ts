import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export interface FamilyMember {
  id: string;
  name: string;
  relation: "Self" | "Father" | "Mother" | "Spouse" | "Child" | "Sibling" | "Other";
  age: string;
  gender: "Male" | "Female" | "Other";
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  age?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  location?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DoctorReview {
  doctorId: string;
  doctorName: string;
  visitId?: string;
  rating: number;
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface PlatformFeedback {
  id: string;
  patientName: string;
  rating: number;
  category: "App Experience" | "Queue Accuracy" | "Clinic Coordination" | "General Feedback";
  comment: string;
  allowStories: boolean;
  status: "SUBMITTED" | "FEATURED";
  createdAt: string;
}

export interface UserSettings {
  smsAlerts: boolean;
  delayNotifications: boolean;
  biometricLock: boolean;
  dataSharing: boolean;
}

const TOKEN_KEY = "jivnicare_patient_token";
const USER_KEY = "jivnicare_patient_user";
const FAMILY_KEY = "jivnicare_patient_family";
const SAVED_DOCTORS_KEY = "jivnicare_patient_saved_doctors";
const LANG_KEY = "jivnicare_patient_lang";
const FEEDBACK_KEY = "jivnicare_patient_feedbacks";
const DOCTOR_REVIEWS_KEY = "jivnicare_patient_doc_reviews";
const SETTINGS_KEY = "jivnicare_patient_settings";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  familyMembers: FamilyMember[];
  savedDoctorIds: string[];
  language: "Hin" | "Eng";
  userSettings: UserSettings;
  doctorReviews: Record<string, DoctorReview>;
  platformFeedbacks: PlatformFeedback[];
  login: (user: UserProfile, token?: string) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  logout: () => void;
  deleteAccount: () => void;
  setInitialized: (initialized: boolean) => void;
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  updateFamilyMember: (id: string, partial: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  toggleSaveDoctor: (doctorId: string) => boolean;
  isDoctorSaved: (doctorId: string) => boolean;
  setLanguage: (lang: "Hin" | "Eng") => void;
  updateUserSettings: (partial: Partial<UserSettings>) => void;
  addDoctorReview: (review: DoctorReview) => void;
  addPlatformFeedback: (feedback: Omit<PlatformFeedback, "id" | "createdAt" | "status">) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  familyMembers: [],
  savedDoctorIds: [],
  language: "Hin",
  userSettings: {
    smsAlerts: true,
    delayNotifications: true,
    biometricLock: false,
    dataSharing: true,
  },
  doctorReviews: {},
  platformFeedbacks: [],

  login: (user: UserProfile, token = "patient_jwt_token") => {
    try {
      SecureStore.setItemAsync(TOKEN_KEY, token);
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (e) {
      // SecureStore storage fallback
    }
    set({ user, token, isAuthenticated: true, isLoading: false, isInitialized: true });
  },

  updateUser: (partial: Partial<UserProfile>) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...partial };
      try {
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { user: updated };
    });
  },

  logout: () => {
    try {
      SecureStore.deleteItemAsync(TOKEN_KEY);
      SecureStore.deleteItemAsync(USER_KEY);
      SecureStore.deleteItemAsync(FAMILY_KEY);
      SecureStore.deleteItemAsync(SAVED_DOCTORS_KEY);
    } catch (e) {
      // SecureStore cleanup fallback
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
      familyMembers: [],
      savedDoctorIds: [],
    });
  },

  deleteAccount: () => {
    try {
      SecureStore.deleteItemAsync(TOKEN_KEY);
      SecureStore.deleteItemAsync(USER_KEY);
      SecureStore.deleteItemAsync(FAMILY_KEY);
      SecureStore.deleteItemAsync(SAVED_DOCTORS_KEY);
      SecureStore.deleteItemAsync(FEEDBACK_KEY);
      SecureStore.deleteItemAsync(DOCTOR_REVIEWS_KEY);
      SecureStore.deleteItemAsync(SETTINGS_KEY);
    } catch (e) {}
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
      familyMembers: [],
      savedDoctorIds: [],
      doctorReviews: {},
      platformFeedbacks: [],
    });
  },

  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized });
  },

  addFamilyMember: (memberData) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: `fam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    const updated = [...get().familyMembers, newMember];
    set({ familyMembers: updated });
    try {
      SecureStore.setItemAsync(FAMILY_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  updateFamilyMember: (id, partial) => {
    const updated = get().familyMembers.map((m) =>
      m.id === id ? { ...m, ...partial } : m
    );
    set({ familyMembers: updated });
    try {
      SecureStore.setItemAsync(FAMILY_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  removeFamilyMember: (id) => {
    const updated = get().familyMembers.filter((m) => m.id !== id);
    set({ familyMembers: updated });
    try {
      SecureStore.setItemAsync(FAMILY_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  toggleSaveDoctor: (doctorId) => {
    const { savedDoctorIds } = get();
    const isSaved = savedDoctorIds.includes(doctorId);
    const updated = isSaved
      ? savedDoctorIds.filter((id) => id !== doctorId)
      : [...savedDoctorIds, doctorId];
    set({ savedDoctorIds: updated });
    try {
      SecureStore.setItemAsync(SAVED_DOCTORS_KEY, JSON.stringify(updated));
    } catch (e) {}
    return !isSaved;
  },

  isDoctorSaved: (doctorId) => {
    return get().savedDoctorIds.includes(doctorId);
  },

  setLanguage: (lang) => {
    set({ language: lang });
    try {
      SecureStore.setItemAsync(LANG_KEY, lang);
    } catch (e) {}
  },

  updateUserSettings: (partial) => {
    const updated = { ...get().userSettings, ...partial };
    set({ userSettings: updated });
    try {
      SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  addDoctorReview: (review) => {
    const updated = { ...get().doctorReviews, [review.doctorId]: review };
    set({ doctorReviews: updated });
    try {
      SecureStore.setItemAsync(DOCTOR_REVIEWS_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  addPlatformFeedback: (feedbackData) => {
    const newFeedback: PlatformFeedback = {
      ...feedbackData,
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };
    const updated = [newFeedback, ...get().platformFeedbacks];
    set({ platformFeedbacks: updated });
    try {
      SecureStore.setItemAsync(FEEDBACK_KEY, JSON.stringify(updated));
    } catch (e) {}
  },
}));

// Hydrate stored patient session and preferences on app startup
export async function initializePatientAuthSession() {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userStr = await SecureStore.getItemAsync(USER_KEY);
    const familyStr = await SecureStore.getItemAsync(FAMILY_KEY);
    const savedStr = await SecureStore.getItemAsync(SAVED_DOCTORS_KEY);
    const langStr = await SecureStore.getItemAsync(LANG_KEY);
    const feedbackStr = await SecureStore.getItemAsync(FEEDBACK_KEY);
    const docReviewStr = await SecureStore.getItemAsync(DOCTOR_REVIEWS_KEY);
    const settingsStr = await SecureStore.getItemAsync(SETTINGS_KEY);

    const partialState: Partial<AuthState> = {
      isInitialized: true,
    };

    if (token && userStr) {
      partialState.user = JSON.parse(userStr) as UserProfile;
      partialState.token = token;
      partialState.isAuthenticated = true;
    }

    if (familyStr) {
      partialState.familyMembers = JSON.parse(familyStr) as FamilyMember[];
    }

    if (savedStr) {
      partialState.savedDoctorIds = JSON.parse(savedStr) as string[];
    }

    if (langStr === "Hin" || langStr === "Eng") {
      partialState.language = langStr;
    }

    if (feedbackStr) {
      partialState.platformFeedbacks = JSON.parse(feedbackStr) as PlatformFeedback[];
    }

    if (docReviewStr) {
      partialState.doctorReviews = JSON.parse(docReviewStr) as Record<string, DoctorReview>;
    }

    if (settingsStr) {
      partialState.userSettings = JSON.parse(settingsStr) as UserSettings;
    }

    useAuthStore.setState(partialState);
  } catch (e) {
    useAuthStore.getState().setInitialized(true);
  }
}
