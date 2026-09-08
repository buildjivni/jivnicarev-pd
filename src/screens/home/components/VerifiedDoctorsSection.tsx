import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { DoctorCard } from "../../../components/shared/DoctorCard";
import { Doctor } from "../../../types/doctor";
import { MOCK_DOCTORS } from "../../../data/mockDoctors";
import { useAuthStore } from "../../../store/useAuthStore";
import { colors, radius } from "../../../theme";

interface VerifiedDoctorsSectionProps {
  doctors?: Doctor[];
  district?: string;
  onPressDoctor?: (doctor: Doctor) => void;
  onPressBook?: (doctor: Doctor) => void;
  onPressSeeAll?: () => void;
}

export const VerifiedDoctorsSection: React.FC<VerifiedDoctorsSectionProps> = ({
  doctors = MOCK_DOCTORS,
  district = "Deoghar",
  onPressDoctor,
  onPressBook,
  onPressSeeAll,
}) => {
  const { savedDoctorIds, toggleSaveDoctor } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Doctors in {district}</Text>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onPressSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={13} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.verticalList}>
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            variant="vertical"
            isWishlisted={savedDoctorIds.includes(doc.id)}
            onToggleWishlist={(id) => toggleSaveDoctor(id)}
            onPressCard={onPressDoctor}
            onPressBook={onPressBook}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.navy, // #0F172A
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    gap: 2,
  },
  seeAllText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.primary,
  },
  verticalList: {
    gap: 16,
  },
});
