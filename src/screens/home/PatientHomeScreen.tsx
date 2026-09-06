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

export interface PatientHomeScreenProps {
  onNavigateDoctors?: (filter?: { specialty?: string; isEmergency?: boolean }) => void;
  onNavigateSaved?: () => void;
  onNavigateProfile?: () => void;
  onNavigateNotifications?: () => void;
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({
  onNavigateDoctors,
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

        {/* Placeholder section indicator for next incremental steps */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTag}>NEXT INCREMENTAL PHASES</Text>
          <Text style={styles.placeholderTitle}>
            Awareness Carousel & Recommended Doctors
          </Text>
          <Text style={styles.placeholderSub}>
            Doctor card visual layout awaiting reference image upload.
          </Text>
        </View>
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
