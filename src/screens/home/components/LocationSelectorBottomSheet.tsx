import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  MapPin,
  Crosshair,
  Check,
  X,
  Building2,
  Sparkles,
} from "lucide-react-native";
import { colors, typography, radius, shadows } from "../../../theme";
import {
  usePatientLocationStore,
  SERVICEABLE_CITIES,
} from "../../../store/usePatientLocationStore";

export const LocationSelectorBottomSheet: React.FC = () => {
  const {
    selectedDistrict,
    setSelectedDistrict,
    isLocationSheetVisible,
    setIsLocationSheetVisible,
  } = usePatientLocationStore();

  const [isDetecting, setIsDetecting] = useState(false);

  const activeCities = SERVICEABLE_CITIES.filter((c) => c.status === "ACTIVE");
  const upcomingCities = SERVICEABLE_CITIES.filter((c) => c.status === "COMING_SOON");

  const handleSelectCity = (cityName: string) => {
    setSelectedDistrict(cityName);
    setIsLocationSheetVisible(false);
  };

  const handleDetectGPS = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      setSelectedDistrict("Jamui");
      setIsLocationSheetVisible(false);
    }, 600);
  };

  return (
    <Modal
      visible={isLocationSheetVisible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={() => setIsLocationSheetVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={() => setIsLocationSheetVisible(false)}
        />

        <View style={styles.sheetContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Select Location</Text>
              <Text style={styles.sheetSubtitle}>
                Choose your city to view available doctors
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsLocationSheetVisible(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Auto-detect GPS button (Matching web verbatim: "Auto-detect location using GPS") */}
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={handleDetectGPS}
            disabled={isDetecting}
            activeOpacity={0.75}
          >
            <View style={styles.gpsIconWrap}>
              {isDetecting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Crosshair size={18} color={colors.primary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsTitle}>Auto-detect location using GPS</Text>
              <Text style={styles.gpsSub}>Find verified doctors near you</Text>
            </View>
          </TouchableOpacity>

          <ScrollView style={styles.cityList} showsVerticalScrollIndicator={false}>
            {/* Active Launch Districts (Matching web: ACTIVE_LAUNCH_DISTRICTS) */}
            <View style={styles.sectionHeaderWrap}>
              <View style={styles.statusDotActive} />
              <Text style={styles.sectionHeaderTitle}>Active Launch Districts</Text>
            </View>

            {activeCities.map((city) => {
              const isSelected = selectedDistrict.toLowerCase() === city.name.toLowerCase();
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityCard, isSelected && styles.cityCardSelected]}
                  onPress={() => handleSelectCity(city.name)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.cityIconWrap, isSelected && styles.cityIconWrapSelected]}>
                    <MapPin size={18} color={isSelected ? "#FFFFFF" : colors.secondary} />
                  </View>

                  <View style={styles.cityTextCol}>
                    <View style={styles.cityNameRow}>
                      <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                        {city.name}
                      </Text>
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>ACTIVE</Text>
                      </View>
                    </View>
                    <Text style={styles.cityState}>
                      {city.state}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkWrap}>
                      <Check size={16} color={colors.primary} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Upcoming Expansion (Matching web: FUTURE_EXPANSION_DISTRICTS) */}
            <View style={[styles.sectionHeaderWrap, { marginTop: 16 }]}>
              <Sparkles size={13} color={colors.warning} />
              <Text style={styles.sectionHeaderTitle}>Upcoming Expansion</Text>
            </View>

            {upcomingCities.map((city) => {
              const isSelected = selectedDistrict.toLowerCase() === city.name.toLowerCase();
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityCard, styles.upcomingCard, isSelected && styles.cityCardSelected]}
                  onPress={() => handleSelectCity(city.name)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.cityIconWrap, { backgroundColor: colors.mutedBackground }]}>
                    <Building2 size={18} color={colors.textMuted} />
                  </View>

                  <View style={styles.cityTextCol}>
                    <View style={styles.cityNameRow}>
                      <Text style={[styles.cityName, { color: colors.textSecondary }]}>
                        {city.name}
                      </Text>
                      <View style={styles.upcomingPill}>
                        <Text style={styles.upcomingPillText}>EXPANSION</Text>
                      </View>
                    </View>
                    <Text style={styles.cityState}>
                      {city.state}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkWrap}>
                      <Check size={16} color={colors.primary} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  backdropTouch: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius["2xl"],
    borderTopRightRadius: radius["2xl"],
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: "80%",
    ...shadows.premium,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  sheetTitle: {
    ...typography.titleMedium,
    color: colors.navy,
    fontWeight: "900",
  },
  sheetSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.xl,
    backgroundColor: "#F0F9FF",
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
    marginBottom: 14,
  },
  gpsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  gpsTitle: {
    ...typography.titleSmall,
    fontSize: 13,
    color: colors.navy,
    fontWeight: "800",
  },
  gpsSub: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
    textTransform: "none",
  },
  cityList: {
    maxHeight: 380,
  },
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  statusDotActive: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  sectionHeaderTitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
  },
  cityCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(86, 150, 199, 0.05)",
  },
  upcomingCard: {
    opacity: 0.85,
  },
  cityIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cityIconWrapSelected: {
    backgroundColor: colors.primary,
  },
  cityTextCol: {
    flex: 1,
  },
  cityNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cityName: {
    ...typography.titleSmall,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "800",
  },
  cityNameSelected: {
    color: colors.navy,
  },
  activePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  activePillText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: "900",
    color: colors.success,
  },
  upcomingPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radius.full,
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  upcomingPillText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: "900",
    color: colors.warning,
  },
  cityState: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: "none",
  },
  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
