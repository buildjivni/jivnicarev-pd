import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Search, Heart, User, X } from "lucide-react-native";
import { colors, typography, radius } from "../../../theme";
import { usePatientLocationStore } from "../../../store/usePatientLocationStore";

/**
 * Exact rotating placeholders from web `src/components/shared/SmartSearchBar.tsx` (lines 86-89)
 */
const WEB_EXACT_PLACEHOLDERS = [
  "Search General Physicians, Cardiologists...",
  "Search symptoms like fever, headache...",
  "Find Top Verified Clinics & Hospitals...",
  "Search by doctor name (e.g. Dr. Sharma)...",
];

export interface PatientUnifiedSearchRowProps {
  query?: string;
  onQueryChange?: (text: string) => void;
  onPressSearch?: () => void;
  onPressSaved?: () => void;
  onPressProfile?: () => void;
}

export const PatientUnifiedSearchRow: React.FC<PatientUnifiedSearchRowProps> = ({
  query = "",
  onQueryChange,
  onPressSearch,
  onPressSaved,
  onPressProfile,
}) => {
  const { savedDoctorIds } = usePatientLocationStore();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % WEB_EXACT_PLACEHOLDERS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const hasSavedItems = savedDoctorIds.length > 0;

  return (
    <View style={styles.container}>
      {/* ── UNIFIED SEARCH INPUT BOX ── */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.9}
        onPress={onPressSearch}
      >
        <Search size={17} color={colors.primary} strokeWidth={2.2} />

        <View style={styles.inputContainer}>
          {query.length === 0 ? (
            <Animated.Text
              style={[styles.animatedPlaceholder, { opacity: fadeAnim }]}
              numberOfLines={1}
            >
              {WEB_EXACT_PLACEHOLDERS[placeholderIndex]}
            </Animated.Text>
          ) : null}

          <TextInput
            style={styles.nativeInput}
            value={query}
            onChangeText={onQueryChange}
            placeholder=""
            placeholderTextColor="transparent"
            returnKeyType="search"
          />
        </View>

        {query.length > 0 ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => onQueryChange?.("")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={14} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {/* ── RIGHT ACTION 1: SAVED / WISHLIST HEART ── */}
      <TouchableOpacity
        style={[styles.actionBtn, hasSavedItems && styles.savedActiveBtn]}
        onPress={onPressSaved}
        activeOpacity={0.75}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Heart
          size={18}
          color={hasSavedItems ? colors.destructive : colors.navy}
          fill={hasSavedItems ? colors.destructive : "none"}
          strokeWidth={2}
        />
        {hasSavedItems && (
          <View style={styles.badgeCount}>
            <Text style={styles.badgeText}>{savedDoctorIds.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── RIGHT ACTION 2: PROFILE ENTRY ICON ── */}
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={onPressProfile}
        activeOpacity={0.75}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <View style={styles.avatarWrap}>
          <User size={16} color={colors.primary} strokeWidth={2.2} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 46,
    backgroundColor: colors.mutedBackground,
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  inputContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    position: "relative",
  },
  animatedPlaceholder: {
    ...typography.bodySmall,
    fontSize: 12.5,
    color: colors.textMuted,
    fontWeight: "600",
    position: "absolute",
    left: 0,
    right: 0,
  },
  nativeInput: {
    flex: 1,
    ...typography.bodySmall,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "700",
    padding: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.mutedBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  savedActiveBtn: {
    backgroundColor: colors.destructiveBg,
    borderColor: colors.destructiveBorder,
  },
  badgeCount: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.destructive,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 11,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.mutedBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: "rgba(86, 150, 199, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
});
