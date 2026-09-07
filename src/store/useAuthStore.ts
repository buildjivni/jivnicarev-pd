import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  location?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token?: string) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "pat_demo_01",
    name: "Rahul Kumar",
    phone: "9876543210",
    email: "rahul.kumar@jivnicare.com",
    role: "PATIENT",
    dateOfBirth: "1995-05-15",
    gender: "Male",
    location: "Jamui",
    address: "Station Road, Near Main Market, Jamui",
    pincode: "811307",
  },
  token: "demo_token_authenticated",
  isAuthenticated: true,

  login: (user, token = "demo_jwt_token") =>
    set({ user, token, isAuthenticated: true }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : (partial as UserProfile),
    })),

  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
