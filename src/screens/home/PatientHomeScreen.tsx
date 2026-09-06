import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { colors, typography, radius } from "../../theme";
import { PatientHomeHeader } from "./components/PatientHomeHeader";
import { LocationSelectorBottomSheet } from "./components/LocationSelectorBottomSheet";
import { PatientUnifiedSearchRow } from "./components/PatientUnifiedSearchRow";
import {
  PatientSpecialtiesRail,
  SpecialtyItem,
} from "./components/PatientSpecialtiesRail";
import { RecommendedDoctorsSection } from "./components/RecommendedDoctorsSection";
import { Doctor } from "../../types/doctor";

export interface PatientHomeScreenProps {
  onNavigateDoctors?: (filter?: { specialty?: string; isEmergency?: boolean }) => void;
  onNavigateDoctorDetail?: (doctor: Doctor) => void;
  onNavigateBooking?: (doctor: Doctor) => void;
  onNavigateSaved?: () => void;
  onNavigateProfile?: () => void;
  onNavigateNotifications?: () => void;
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({
  onNavigateDoctors,
  onNavigateDoctorDetail,
  onNavigateBooking,
  onNavigateSaved,
  onNavigateProfile,
  onNavigateNotifications,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectSpecialty = (specialty: SpecialtyItem) => {
    if (onNavigateDoctors) {
      onNavigateDoctors({ specialty: specialty.name });
    } else {
      Alert.alert(
        "Specialty Selected",
        `Selected: ${specialty.name}\n(Will navigate to doctor directory pre-filtered for ${specialty.shortName})`
      );
    }
  };

  const handleDoctorPress = (doctor: Doctor) => {
    if (onNavigateDoctorDetail) {
      onNavigateDoctorDetail(doctor);
    } else {
      Alert.alert(
        doctor.name,
        `Clinic: ${doctor.clinic}\nSpecialty: ${doctor.specialty}\nFee: ${doctor.fee}`
      );
    }
  };

  const handleBookDoctor = (doctor: Doctor) => {
    if (onNavigateBooking) {
      onNavigateBooking(doctor);
    } else {
      Alert.alert(
        "Booking OPD Token",
        `Starting token booking for ${doctor.name} at ${doctor.clinic}.`
      );
    }
  };

  return (
    <ScreenContainer style={styles.safeArea}>
      {/* ── 1. HEADER LAYER ── */}
      <PatientHomeHeader
        onPressNotifications={onNavigateNotifications}
      />

      {/* ── 2. UNIFIED SEARCH ROW LAYER ── */}
      <PatientUnifiedSearchRow
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onPressSearch={() => onNavigateDoctors?.()}
        onPressSaved={onNavigateSaved}
        onPressProfile={onNavigateProfile}
      />

      {/* ── LOCATION SELECTOR BOTTOM SHEET ── */}
      <LocationSelectorBottomSheet />

      {/* ── MAIN SCROLLABLE CONTENT ── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── 3. POPULAR SPECIALITIES RAIL ── */}
        <PatientSpecialtiesRail
          onSelectSpecialty={handleSelectSpecialty}
          onPressSeeAll={() => onNavigateDoctors?.()}
        />

        {/* ── 4. RECOMMENDED DOCTORS SECTION ── */}
        <RecommendedDoctorsSection
          onSeeAll={() => onNavigateDoctors?.()}
          onDoctorPress={handleDoctorPress}
          onBookDoctor={handleBookDoctor}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: colors.mutedBackground,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  placeholderCard: {
    margin: 16,
    padding: 16,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.cardBorder,
    alignItems: "center",
  },
  placeholderTag: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  placeholderTitle: {
    ...typography.titleSmall,
    fontSize: 13,
    fontWeight: "800",
    color: colors.navy,
    textAlign: "center",
  },
  placeholderSub: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 3,
    textTransform: "none",
  },
});
