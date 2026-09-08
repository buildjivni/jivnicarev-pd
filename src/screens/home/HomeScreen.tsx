import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeHeader } from "./components/HomeHeader";
import { HeroCarousel } from "./components/HeroCarousel";
import { SpecialtiesSection } from "./components/SpecialtiesSection";
import { VerifiedDoctorsSection } from "./components/VerifiedDoctorsSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { TrustSection } from "./components/TrustSection";
import { FaqTrustSection } from "./components/FaqTrustSection";
import { AppFooterBranding } from "../../components/layout/AppFooterBranding";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";
import { Doctor } from "../../types/doctor";
import { MOCK_DOCTORS } from "../../data/mockDoctors";
import { colors } from "../../theme";

interface HomeScreenProps {
  onNavigateDoctors: (query?: { specialty?: string; search?: string; savedOnly?: boolean }) => void;
  onNavigateDoctorDetail: (doctor: Doctor) => void;
  onNavigateBooking: (doctor: Doctor) => void;
  onNavigateProfile: () => void;
  onNavigateEmergency: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateDoctors,
  onNavigateDoctorDetail,
  onNavigateBooking,
  onNavigateProfile,
  onNavigateEmergency,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { selectedDistrict } = usePatientLocationStore();

  const districtDoctors = useMemo(() => {
    const list = MOCK_DOCTORS.filter(
      (d) => d.district?.toLowerCase() === selectedDistrict.toLowerCase()
    );
    return list.length > 0 ? list : MOCK_DOCTORS.filter((d) => d.district === "Deoghar");
  }, [selectedDistrict]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <HomeHeader
        onPressSearch={() => onNavigateDoctors()}
        onPressFavorites={() => onNavigateDoctors({ savedOnly: true })}
        onPressProfile={onNavigateProfile}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero Carousel */}
        <HeroCarousel
          onPressExplore={() => onNavigateDoctors()}
          onPressEmergency={onNavigateEmergency}
        />

        {/* Popular Specialties */}
        <SpecialtiesSection
          onSelectSpecialty={(specialty) => onNavigateDoctors({ specialty })}
          onPressSeeAll={() => onNavigateDoctors()}
        />

        {/* Verified Recommended Doctors in District */}
        <VerifiedDoctorsSection
          district={selectedDistrict}
          doctors={districtDoctors}
          onPressDoctor={onNavigateDoctorDetail}
          onPressBook={onNavigateBooking}
          onPressSeeAll={() => onNavigateDoctors()}
        />

        {/* How OPD Booking & Live Queue Works */}
        <HowItWorksSection />

        {/* Trust & Transparency Pillars */}
        <TrustSection />

        {/* FAQ & Zero-Wait Experience */}
        <FaqTrustSection />

        {/* Footer Branding */}
        <AppFooterBranding />

        {/* Bottom spacing for bottom nav */}
        <View style={styles.bottomNavSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  bottomNavSpacer: {
    height: 80,
  },
});
