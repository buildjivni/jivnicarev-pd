import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MapPin, ChevronDown, Bell, Globe } from "lucide-react-native";
import { colors, typography, radius } from "../../../theme";
import { usePatientLocationStore } from "../../../store/usePatientLocationStore";

export interface PatientHomeHeaderProps {
  onPressNotifications?: () => void;
}

export const PatientHomeHeader: React.FC<PatientHomeHeaderProps> = ({
  onPressNotifications,
}) => {
  const {
    selectedDistrict,
    language,
    setLanguage,
    setIsLocationSheetVisible,
  } = usePatientLocationStore();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hinglish" : "en");
  };

  return (
    <View style={styles.headerContainer}>
      {/* ── LEFT: Location Selector Pill (Matching web: "Location: [District]") ── */}
      <TouchableOpacity
        style={styles.locationPill}
        onPress={() => setIsLocationSheetVisible(true)}
        activeOpacity={0.75}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.pinCircle}>
          <MapPin size={14} color={colors.secondary} strokeWidth={2.5} />
        </View>
        <View style={styles.locationTextWrap}>
          <Text style={styles.locationLabelText}>
            {selectedDistrict ? `Location: ${selectedDistrict}` : "Select Location"}
          </Text>
        </View>
        <ChevronDown size={14} color={colors.navy} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* ── RIGHT: Language Toggle + Notifications ── */}
      <View style={styles.rightActions}>
        {/* Language Toggle Pill (English / Hinglish only as approved) */}
        <TouchableOpacity
          style={styles.langPill}
          onPress={toggleLanguage}
          activeOpacity={0.75}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Globe size={13} color={colors.primary} />
          <Text style={styles.langText}>
            {language === "en" ? "English" : "Hinglish"}
          </Text>
        </TouchableOpacity>

        {/* Notifications Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressNotifications}
          activeOpacity={0.75}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Bell size={18} color={colors.navy} strokeWidth={2} />
          <View style={styles.unreadDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.surface,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.mutedBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexShrink: 1,
  },
  pinCircle: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  locationTextWrap: {
    flexShrink: 1,
  },
  locationLabelText: {
    ...typography.titleSmall,
    fontSize: 13,
    fontWeight: "800",
    color: colors.navy,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  langText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "800",
    color: colors.navy,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.mutedBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.destructive,
  },
});
