export interface Doctor {
  id: string;
  name: string;
  slug?: string;
  specialty: string;
  experience: string;
  clinic: string;
  location: string;
  fullAddress?: string;
  image?: string;
  clinicImage?: string;
  rating: number;
  reviewCount?: number;
  reviews?: number;
  fee: string;
  verificationStatus?: string;
  isEmergencySupported?: boolean;
  emergencyAvailable?: boolean;
  isEmergencyAvailable?: boolean;
  isAcceptingBookings?: boolean;
  availabilityStatus?: "ONLINE" | "OFFLINE" | "ON_BREAK" | "QUEUE_FULL";
  nextAvailable?: string;
  weeklySchedule?: Record<string, { start?: string; end?: string; isAvailable?: boolean }>;
  holidayOverride?: { isHoliday?: boolean; reason?: string };
}
