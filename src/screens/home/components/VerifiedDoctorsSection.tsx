import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { DoctorCard } from "../../../components/shared/DoctorCard";
import { Doctor } from "../../../types/doctor";
import { colors, radius } from "../../../theme";

interface VerifiedDoctorsSectionProps {
  doctors?: Doctor[];
  district?: string;
  onPressDoctor?: (doctor: Doctor) => void;
  onPressBook?: (doctor: Doctor) => void;
  onPressSeeAll?: () => void;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 128,
    clinicName: "Jamui City OPD & Clinic",
    clinicAddress: "Main Hospital Road, Jamui",
    consultationFee: 500,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-2",
    name: "Dr. Sneha Verma",
    specialty: "Pediatrician",
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 94,
    clinicName: "Shishu Kalyan Clinic",
    clinicAddress: "Station Road, Jamui",
    consultationFee: 400,
    emergencyAvailable: false,
    isEmergencySupported: false,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-3",
    name: "Dr. Amit Roy",
    specialty: "Cardiologist",
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 210,
    clinicName: "Roy Heart Center",
    clinicAddress: "Court Road, Jamui",
    consultationFee: 700,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
];

export const VerifiedDoctorsSection: React.FC<VerifiedDoctorsSectionProps> = ({
  doctors = MOCK_DOCTORS,
  district = "Jamui",
  onPressDoctor,
  onPressBook,
  onPressSeeAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Recommended Doctors</Text>
          <Text style={styles.subtitle}>
            Top rated verified specialists in {district}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onPressSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onPressCard={onPressDoctor}
            onPressBook={onPressBook}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
});
