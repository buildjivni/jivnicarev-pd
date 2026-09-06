import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../../theme";
import { DoctorCard } from "../../../components/shared/DoctorCard";
import { Doctor } from "../../../types/doctor";
import { usePatientLocationStore } from "../../../store/usePatientLocationStore";

export const SAMPLE_RECOMMENDED_DOCTORS: Doctor[] = [
  {
    id: "doc-rajesh-01",
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "12 Years",
    clinic: "Jamui City OPD & Clinic",
    location: "Main Hospital Road, Jamui",
    rating: 4.9,
    reviewCount: 128,
    fee: "₹500",
    verificationStatus: "VERIFIED",
    isEmergencySupported: true,
    availabilityStatus: "ONLINE",
    nextAvailable: "Tokens Calling Now",
  },
  {
    id: "doc-sneha-02",
    name: "Dr. Sneha Sharma",
    specialty: "Pediatrician (Child Specialist)",
    experience: "9 Years",
    clinic: "Sharma Child Care & Vaccination",
    location: "Station Road, Jamui",
    rating: 4.8,
    reviewCount: 94,
    fee: "₹400",
    verificationStatus: "VERIFIED",
    isEmergencySupported: false,
    availabilityStatus: "ONLINE",
    nextAvailable: "5 Slots Left Today",
  },
  {
    id: "doc-amit-03",
    name: "Dr. Amit Verma",
    specialty: "Cardiologist (Heart Specialist)",
    experience: "15 Years",
    clinic: "Verma Heart & Diabetes Care",
    location: "VIP Chowk, Deoghar",
    rating: 5.0,
    reviewCount: 210,
    fee: "₹700",
    verificationStatus: "VERIFIED",
    isEmergencySupported: true,
    availabilityStatus: "QUEUE_FULL",
    nextAvailable: "Opens Tomorrow 10:00 AM",
  },
  {
    id: "doc-danish-04",
    name: "Dr. Danish Khan",
    specialty: "Orthopedic Surgeon",
    experience: "11 Years",
    clinic: "LifeCare Bone & Joint Clinic",
    location: "Court Road, Jamui",
    rating: 4.7,
    reviewCount: 65,
    fee: "₹450",
    verificationStatus: "VERIFIED",
    isEmergencySupported: false,
    availabilityStatus: "OFFLINE",
    nextAvailable: "Opens at 05:00 PM Today",
  },
];

export interface RecommendedDoctorsSectionProps {
  doctors?: Doctor[];
  onSeeAll?: () => void;
  onDoctorPress?: (doctor: Doctor) => void;
  onBookDoctor?: (doctor: Doctor) => void;
}

export const RecommendedDoctorsSection: React.FC<
  RecommendedDoctorsSectionProps
> = ({
  doctors = SAMPLE_RECOMMENDED_DOCTORS,
  onSeeAll,
  onDoctorPress,
  onBookDoctor,
}) => {
  const { selectedDistrict } = usePatientLocationStore();

  return (
    <View style={styles.container}>
      {/* ── Section Header ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Recommended Doctors</Text>
          <Text style={styles.sectionSubtitle}>
            Top rated verified specialists in {selectedDistrict}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSeeAll}
          style={styles.seeAllButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={15} color={colors.primary} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* ── Horizontal Doctors Carousel ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={330 + 16}
        snapToAlignment="start"
      >
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onPress={() => onDoctorPress && onDoctorPress(doctor)}
            onBook={() => onBookDoctor && onBookDoctor(doctor)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    backgroundColor: colors.mutedBackground,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.navy,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(86, 150, 199, 0.2)",
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
});
