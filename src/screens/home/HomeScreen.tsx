import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeHeader } from "./components/HomeHeader";
import { LocationSelector } from "./components/LocationSelector";
import { HeroCarousel } from "./components/HeroCarousel";
import { SpecialtiesSection } from "./components/SpecialtiesSection";
import { VerifiedDoctorsSection } from "./components/VerifiedDoctorsSection";
import { TrustSection } from "./components/TrustSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { FaqTrustSection } from "./components/FaqTrustSection";
import { CtaBannerSection } from "./components/CtaBannerSection";
import { AppFooterBranding } from "../../components/layout/AppFooterBranding";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";
import { Doctor } from "../../types/doctor";
import { colors } from "../../theme";

interface HomeScreenProps {
  onNavigateDoctors: (query?: { specialty?: string; search?: string }) => void;
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
        {/* Location Picker Row */}
        <LocationSelector />

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
          onPressDoctor={onNavigateDoctorDetail}
          onPressBook={onNavigateBooking}
          onPressSeeAll={() => onNavigateDoctors()}
        />

        {/* Trust & Guarantee Section */}
        <TrustSection />

        {/* 3-Step How It Works */}
        <HowItWorksSection />

        {/* Zero-Wait Guarantee & FAQ Accordion */}
        <FaqTrustSection />

        {/* Ready to see a Doctor CTA */}
        <CtaBannerSection onPressCta={() => onNavigateDoctors()} />

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
