import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MapPin, ChevronDown, Bell, Globe } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";
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
    <View style={styles.container}>
      {/* ── Left: Location Selector Chip ── */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsLocationSheetVisible(true)}
        style={[styles.locationChip, shadows.soft]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <MapPin
          size={15}
          color={colors.primary}
          strokeWidth={2.4}
          style={styles.pinIcon}
        />
        <Text style={styles.locationText} numberOfLines={1}>
          Location: <Text style={styles.districtName}>{selectedDistrict}</Text>
        </Text>
        <ChevronDown size={14} color={colors.navy} strokeWidth={2.4} />
      </TouchableOpacity>

      {/* ── Right: Language & Notification Actions ── */}
      <View style={styles.rightActions}>
        {/* Dual Language Switch */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleLanguage}
          style={[styles.langChip, shadows.soft]}
        >
          <Globe size={13} color={colors.primary} strokeWidth={2.2} />
          <Text style={styles.langText}>
            {language === "en" ? "ENGLISH" : "HINGLISH"}
          </Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressNotifications}
          style={[styles.bellButton, shadows.soft]}
          accessibilityLabel="Notifications"
        >
          <Bell size={18} color={colors.navy} strokeWidth={2.2} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputSurface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    gap: 5,
    maxWidth: "58%",
  },
  pinIcon: {
    marginRight: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  districtName: {
    fontWeight: "800",
    color: colors.navy,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(86, 150, 199, 0.20)",
  },
  langText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: colors.navy,
    letterSpacing: 0.3,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.inputSurface,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.destructive,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
