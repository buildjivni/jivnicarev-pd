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
import { colors, radius, shadows } from "../../../theme";
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
  onQueryChange?: (q: string) => void;
  onPressSearch?: () => void;
  onPressSaved?: () => void;
  onPressProfile?: () => void;
}

export const PatientUnifiedSearchRow: React.FC<
  PatientUnifiedSearchRowProps
> = ({
  query = "",
  onQueryChange,
  onPressSearch,
  onPressSaved,
  onPressProfile,
}) => {
  const { savedDoctorIds } = usePatientLocationStore();
  const savedCount = savedDoctorIds.length;

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (query.length > 0) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setPlaceholderIndex(
        (prev) => (prev + 1) % WEB_EXACT_PLACEHOLDERS.length
      );
    }, 3200);

    return () => clearInterval(interval);
  }, [fadeAnim, query]);

  return (
    <View style={styles.container}>
      {/* ── Search Input Field ── */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPressSearch}
        style={[styles.searchField, shadows.soft]}
      >
        <Search
          size={18}
          color={colors.primary}
          strokeWidth={2.4}
          style={styles.searchIcon}
        />

        {query.length === 0 ? (
          <Animated.View
            style={[styles.placeholderContainer, { opacity: fadeAnim }]}
            pointerEvents="none"
          >
            <Text style={styles.placeholderText} numberOfLines={1}>
              {WEB_EXACT_PLACEHOLDERS[placeholderIndex]}
            </Text>
          </Animated.View>
        ) : null}

        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder=""
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={onPressSearch}
        />

        {query.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onQueryChange && onQueryChange("")}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={15} color={colors.textMuted} strokeWidth={2.4} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* ── Saved Wishlist Action ── */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressSaved}
        style={[styles.actionButton, shadows.soft]}
        accessibilityLabel="Saved Doctors"
      >
        <Heart
          size={19}
          color={savedCount > 0 ? colors.destructive : colors.textSecondary}
          fill={savedCount > 0 ? colors.destructive : "transparent"}
          strokeWidth={2.2}
        />
        {savedCount > 0 && (
          <View style={styles.savedBadge}>
            <Text style={styles.savedBadgeText}>{savedCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── Profile Entry Action ── */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressProfile}
        style={[styles.actionButton, shadows.soft]}
        accessibilityLabel="Patient Profile"
      >
        <User size={19} color={colors.textSecondary} strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  searchField: {
    flex: 1,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.inputSurface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    position: "relative",
  },
  searchIcon: {
    marginRight: 8,
  },
  placeholderContainer: {
    position: "absolute",
    left: 40,
    right: 36,
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.inputSurface,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  savedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.destructive,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  savedBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
