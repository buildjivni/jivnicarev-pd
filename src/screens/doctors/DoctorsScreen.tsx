import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import {
  Search,
  X,
  MapPin,
  Stethoscope,
  ChevronDown,
  Sparkles,
  RefreshCw,
  MessageCircle,
  Building2,
  Heart,
} from "lucide-react-native";
import { DoctorCard } from "../../components/shared/DoctorCard";
import { usePatientLocationStore, SERVICEABLE_CITIES } from "../../store/usePatientLocationStore";
import { useAuthStore } from "../../store/useAuthStore";
import { MOCK_DOCTORS } from "../../data/mockDoctors";
import { searchDoctorsApi } from "../../api/doctorsApi";
import { Doctor } from "../../types/doctor";
import { colors, radius, shadows, typography } from "../../theme";

interface DoctorsScreenProps {
  initialSpecialty?: string;
  initialQuery?: string;
  initialEmergencyOnly?: boolean;
  initialSavedOnly?: boolean;
  onPressDoctor: (doctor: Doctor) => void;
  onPressBook: (doctor: Doctor) => void;
  onPressBack?: () => void;
}

const ALL_SPECIALTIES = [
  "All",
  "❤️ Saved",
  "General Physician",
  "Dentist",
  "Dermatologist",
  "Gynecologist",
  "Pediatrician",
  "Orthopedic",
  "ENT Specialist",
  "Ophthalmologist",
  "Cardiologist",
  "Neurologist",
  "Gastroenterologist",
  "Urologist",
  "Pulmonologist",
];

// ── Friendly Positive Medical Radar Illustration for Empty State ──
const PositiveSearchIllustration = () => (
  <Svg width={96} height={96} viewBox="0 0 96 96" fill="none">
    <Circle cx="48" cy="48" r="44" fill="#E0F2FE" opacity={0.6} />
    <Circle cx="48" cy="48" r="34" fill="#BAE6FD" opacity={0.4} />
    <Circle cx="48" cy="48" r="24" fill="#FFFFFF" />
    
    {/* Stethoscope & Magnifying Glass Center Graphic */}
    <Path
      d="M38 48c0 5.5 4.5 10 10 10s10-4.5 10-10V36h-4v12c0 3.3-2.7 6-6 6s-6-2.7-6-6V36h-4v12z"
      fill="#0284C7"
    />
    <Circle cx="36" cy="34" r="3" fill="#0369A1" />
    <Circle cx="60" cy="34" r="3" fill="#0369A1" />
    <Path
      d="M48 58v8m-6 0h12"
      stroke="#0284C7"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    
    {/* Compass / Sparkle accents */}
    <Circle cx="72" cy="28" r="3" fill="#38BDF8" />
    <Circle cx="24" cy="68" r="2.5" fill="#38BDF8" />
    <Path d="M70 64l4 4M74 64l-4 4" stroke="#0284C7" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const DoctorsScreen: React.FC<DoctorsScreenProps> = ({
  initialSpecialty,
  initialQuery = "",
  initialEmergencyOnly = false,
  initialSavedOnly = false,
  onPressDoctor,
  onPressBook,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    initialSavedOnly ? "❤️ Saved" : initialSpecialty || "All"
  );
  const [emergencyOnly, setEmergencyOnly] = useState(initialEmergencyOnly);
  const { selectedDistrict, setSelectedDistrict, setIsLocationSheetVisible } =
    usePatientLocationStore();
  const { savedDoctorIds, toggleSaveDoctor, isDoctorSaved } = useAuthStore();

  // ── Scroll Direction & Collapsible Header Animation ────────────────
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const lastScrollY = useRef(0);
  const headerAnim = useRef(new Animated.Value(1)).current; // 1: expanded, 0: compact

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY <= 10) {
      // At the very top: always expand
      if (!isHeaderExpanded) {
        setIsHeaderExpanded(true);
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    } else if (diff > 8 && currentY > 60) {
      // Scrolling DOWN: collapse secondary filter rail
      if (isHeaderExpanded) {
        setIsHeaderExpanded(false);
        Animated.timing(headerAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    } else if (diff < -12) {
      // Scrolling UP: smoothly expand secondary filter rail
      if (!isHeaderExpanded) {
        setIsHeaderExpanded(true);
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }

    lastScrollY.current = currentY;
  };

  const [doctorsList, setDoctorsList] = useState<Doctor[]>(MOCK_DOCTORS);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveDoctors = useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) setRefreshing(true);
    else setLoadingDoctors(true);

    try {
      const res = await searchDoctorsApi({
        q: searchQuery,
        specialty: selectedSpecialty === "❤️ Saved" ? undefined : selectedSpecialty,
        district: selectedDistrict,
      });
      if (res.doctors && res.doctors.length > 0) {
        setDoctorsList(res.doctors);
      }
    } catch {
      // Keep existing list on error
    } finally {
      setLoadingDoctors(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedSpecialty, selectedDistrict]);

  useEffect(() => {
    fetchLiveDoctors();
  }, [fetchLiveDoctors]);

  // ── Filter Doctors List ───────────────────────────────────────────
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      const matchSearch =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.clinicName &&
          doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchSpecialty = true;
      if (selectedSpecialty === "❤️ Saved") {
        matchSpecialty = isDoctorSaved(doc.id) || savedDoctorIds.includes(doc.id);
      } else if (selectedSpecialty !== "All") {
        matchSpecialty = doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
      }

      const matchEmergency = !emergencyOnly || doc.emergencyAvailable || doc.isEmergencySupported;

      return matchSearch && matchSpecialty && matchEmergency;
    });
  }, [doctorsList, searchQuery, selectedSpecialty, emergencyOnly, savedDoctorIds, isDoctorSaved]);

  // ── Intelligent City/Location Search Detection ───────────────────
  const matchedCity = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 3) return null;
    return (
      SERVICEABLE_CITIES.find(
        (c) =>
          c.name.toLowerCase() === q ||
          c.id.toLowerCase() === q ||
          q.includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(q)
      ) || null
    );
  }, [searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All");
    setEmergencyOnly(false);
  };

  const handleOpenWhatsAppSupport = () => {
    const url = `whatsapp://send?phone=919876543210&text=Hi%20JivniCare,%20I%20am%20looking%20for%20a%20doctor%20in%20${selectedDistrict}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) Linking.openURL(url);
        else Linking.openURL(`https://wa.me/919876543210`);
      })
      .catch(() => {});
  };

  // Secondary rail height animation interpolation
  const secondaryRailHeight = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 52],
  });

  const secondaryRailOpacity = headerAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ── STICKY TOP COMPACT SEARCH BAR ── */}
      <View style={styles.stickyHeader}>
        <View style={styles.searchBar}>
          <Search size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctor, clinic or specialty..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* District Filter Trigger */}
        <TouchableOpacity
          style={styles.districtBadge}
          onPress={() => setIsLocationSheetVisible(true)}
          activeOpacity={0.8}
        >
          <MapPin size={13} color="#5696C7" />
          <Text style={styles.districtBadgeText} numberOfLines={1}>
            {selectedDistrict}
          </Text>
          <ChevronDown size={12} color="#5696C7" />
        </TouchableOpacity>
      </View>

      {/* ── INTELLIGENT CITY SEARCH SUGGESTION BANNER ── */}
      {matchedCity && matchedCity.name.toLowerCase() !== selectedDistrict.toLowerCase() && (
        <View style={styles.citySuggestionBanner}>
          <View style={styles.citySuggestionLeft}>
            <View style={styles.cityIconBadge}>
              <MapPin size={16} color="#5696C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.citySuggestionTitle}>
                Looking for clinics in {matchedCity.name}?
              </Text>
              <Text style={styles.citySuggestionSubtitle} numberOfLines={1}>
                {matchedCity.status === "ACTIVE"
                  ? "Live OPD Queues & Verified Clinics available"
                  : "Expanding Soon — Hospital Network Onboarding"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.citySwitchBtn}
            onPress={() => {
              setSelectedDistrict(matchedCity.name);
              setSearchQuery("");
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.citySwitchBtnText}>Switch to {matchedCity.name}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── COLLAPSIBLE SECONDARY SPECIALTIES RAIL ── */}
      <Animated.View
        style={[
          styles.collapsibleRail,
          {
            height: secondaryRailHeight,
            opacity: secondaryRailOpacity,
            overflow: "hidden",
          },
        ]}
      >
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ALL_SPECIALTIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.specialtiesList}
          renderItem={({ item }) => {
            const isSelected = selectedSpecialty === item;
            return (
              <TouchableOpacity
                style={[
                  styles.specialtyChip,
                  isSelected && styles.specialtyChipActive,
                ]}
                onPress={() => setSelectedSpecialty(item)}
              >
                <Text
                  style={[
                    styles.specialtyChipText,
                    isSelected && styles.specialtyChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </Animated.View>

      {/* ── FILTER META ROW & EMERGENCY TOGGLE ── */}
      <View style={styles.filterMetaRow}>
        <Text style={styles.resultsCountText}>
          {filteredDoctors.length} {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Available in {selectedDistrict}
        </Text>
        <TouchableOpacity
          style={[
            styles.emergencyToggle,
            emergencyOnly && styles.emergencyToggleActive,
          ]}
          onPress={() => setEmergencyOnly(!emergencyOnly)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.emergencyToggleText,
              emergencyOnly && styles.emergencyToggleTextActive,
            ]}
          >
            {emergencyOnly ? "🚑 Urgent Care" : "All OPD"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Life-Safety Triage Notice for Emergency View */}
      {emergencyOnly && (
        <View style={styles.emergencyAdvisoryBanner}>
          <Text style={styles.emergencyAdvisoryTitle}>⚠️ Urgent Care Notice</Text>
          <Text style={styles.emergencyAdvisoryText}>
            For critical, life-threatening conditions, please visit the nearest hospital emergency room or dial 112 immediately.
          </Text>
        </View>
      )}

      {/* ── DOCTORS LIST / POSITIVE EMPTY STATE ── */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorsListContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLiveDoctors(true)}
            colors={["#5696C7"]}
            tintColor="#5696C7"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <DoctorCard
              doctor={item}
              onPress={() => onPressDoctor(item)}
              onBook={() => onPressBook(item)}
              isWishlisted={isDoctorSaved(item.id) || savedDoctorIds.includes(item.id)}
              onToggleWishlist={() => toggleSaveDoctor(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            {/* Friendly Radar Illustration */}
            <View style={styles.emptyIllustrationBox}>
              <PositiveSearchIllustration />
            </View>

            {/* Positive Headline */}
            <Text style={styles.emptyTitle}>
              {matchedCity
                ? `Looking for clinics in ${matchedCity.name}?`
                : searchQuery.trim()
                ? `No clinics found for "${searchQuery}" in ${selectedDistrict}`
                : `No ${selectedSpecialty !== "All" ? selectedSpecialty : ""} doctors currently available in ${selectedDistrict}`}
            </Text>

            <Text style={styles.emptySubtitle}>
              {matchedCity
                ? matchedCity.status === "ACTIVE"
                  ? `We have active verified clinic partnerships in ${matchedCity.name}. Switch your city to view them.`
                  : `${matchedCity.name} is currently expanding clinic onboarding. You can explore active clinics in Deoghar or Jamui.`
                : `We are actively expanding clinic partnerships in ${selectedDistrict}. You can explore nearby verified specialists or reset your search filters.`}
            </Text>

            {/* 1-Tap Switch District Suggestions */}
            {matchedCity && matchedCity.name.toLowerCase() !== selectedDistrict.toLowerCase() ? (
              <TouchableOpacity
                style={styles.switchDistrictCard}
                onPress={() => {
                  setSelectedDistrict(matchedCity.name);
                  setSearchQuery("");
                }}
                activeOpacity={0.8}
              >
                <MapPin size={16} color="#5696C7" />
                <Text style={styles.switchDistrictText}>
                  Switch location to <Text style={styles.boldText}>{matchedCity.name}</Text> ➔
                </Text>
              </TouchableOpacity>
            ) : selectedDistrict !== "Deoghar" ? (
              <TouchableOpacity
                style={styles.switchDistrictCard}
                onPress={() => {
                  setSelectedDistrict("Deoghar");
                  setSearchQuery("");
                }}
                activeOpacity={0.8}
              >
                <Building2 size={16} color="#5696C7" />
                <Text style={styles.switchDistrictText}>
                  View Top Specialists in <Text style={styles.boldText}>Deoghar (Active OPD)</Text> ➔
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.switchDistrictCard}
                onPress={() => {
                  setSelectedDistrict("Jamui");
                  setSearchQuery("");
                }}
                activeOpacity={0.8}
              >
                <Building2 size={16} color="#5696C7" />
                <Text style={styles.switchDistrictText}>
                  View Verified Clinics in <Text style={styles.boldText}>Jamui City</Text> ➔
                </Text>
              </TouchableOpacity>
            )}

            {/* Quick Specialty Suggestions */}
            <View style={styles.suggestionsBox}>
              <Text style={styles.suggestionsLabel}>POPULAR SPECIALTIES IN BIHAR</Text>
              <View style={styles.suggestionChipsRow}>
                {["General Physician", "Pediatrician", "Dentist", "Gynecologist"].map(
                  (spec) => (
                    <TouchableOpacity
                      key={spec}
                      style={styles.suggestionChip}
                      onPress={() => {
                        setSelectedSpecialty(spec);
                        setSearchQuery("");
                      }}
                    >
                      <Text style={styles.suggestionChipText}>{spec}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Primary Reset Filters Action */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetFilters}
              activeOpacity={0.85}
            >
              <RefreshCw size={15} color="#FFFFFF" />
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>

            {/* Direct WhatsApp Helpdesk */}
            <TouchableOpacity
              style={styles.helpdeskLink}
              onPress={handleOpenWhatsAppSupport}
              activeOpacity={0.7}
            >
              <MessageCircle size={15} color="#059669" />
              <Text style={styles.helpdeskLinkText}>
                Need urgent help? Chat with JivniCare Helpdesk
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  stickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
    padding: 0,
  },
  districtBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    maxWidth: 110,
  },
  districtBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5696C7",
  },
  citySuggestionBanner: {
    backgroundColor: "#F0F7FC",
    borderBottomWidth: 1,
    borderBottomColor: "#DCECF8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  citySuggestionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cityIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B9DCF1",
  },
  citySuggestionTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#1B3F6B",
  },
  citySuggestionSubtitle: {
    fontSize: 10.5,
    color: "#64748B",
    marginTop: 1,
  },
  citySwitchBtn: {
    backgroundColor: "#5696C7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    shadowColor: "#5696C7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  citySwitchBtnText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  collapsibleRail: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  specialtiesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  specialtyChipActive: {
    backgroundColor: "#5696C7",
  },
  specialtyChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  specialtyChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  emergencyToggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emergencyToggleActive: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  emergencyToggleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  emergencyToggleTextActive: {
    color: "#DC2626",
  },
  emergencyAdvisoryBanner: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emergencyAdvisoryTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B91C1C",
    marginBottom: 2,
  },
  emergencyAdvisoryText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#7F1D1D",
    lineHeight: 15,
  },
  doctorsListContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 14,
  },

  // ── POSITIVE EMPTY STATE STYLES ──
  emptyStateContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyIllustrationBox: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B3F6B",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 23,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  switchDistrictCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0F7FC",
    borderWidth: 1,
    borderColor: "#B9DCF1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    width: "100%",
    justifyContent: "center",
  },
  switchDistrictText: {
    fontSize: 12.5,
    color: "#1B3F6B",
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "800",
    color: "#5696C7",
  },
  suggestionsBox: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  suggestionsLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  suggestionChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  suggestionChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#5696C7",
    width: "100%",
    height: 48,
    borderRadius: 14,
    shadowColor: "#5696C7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 14,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  helpdeskLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  helpdeskLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
});
