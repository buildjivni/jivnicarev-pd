import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { Bell, Heart, User } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";
import { useAuthStore } from "../../../store/useAuthStore";
import { usePatientLocationStore } from "../../../store/usePatientLocationStore";

interface HomeHeaderProps {
  onPressSearch?: () => void;
  onPressFavorites?: () => void;
  onPressProfile?: () => void;
  onPressNotification?: () => void;
}

const SEARCH_PLACEHOLDERS = [
  "Search doctors by symptoms...",
  "Search doctors by name...",
  "Search doctors by location...",
  "Search doctors by hospital / clinic...",
];

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onPressSearch,
  onPressFavorites,
  onPressProfile,
  onPressNotification,
}) => {
  const { user } = useAuthStore();
  const { selectedDistrict, setIsLocationSheetVisible } = usePatientLocationStore();

  // Language selector state: English ('Eng') vs Hinglish ('Hin')
  const [language, setLanguage] = useState<"Hin" | "Eng">("Hin");

  // Rotating search placeholder logic
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "Hin" ? "Eng" : "Hin"));
  };

  const greetingHeading = user?.name ? `Hii, ${user.name}` : "Welcome to JivniCare";
  const displayDistrict = selectedDistrict || "Jamui";

  return (
    <View style={styles.container}>
      {/* ── ROW 1: [ Greeting + Location ] [ Language ] [ Notification ] ── */}
      <View style={styles.row1}>
        <TouchableOpacity
          style={styles.greetingLocationCol}
          onPress={() => setIsLocationSheetVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.greetingText}>{greetingHeading}</Text>
          <Text style={styles.locationText}>{displayDistrict}</Text>
        </TouchableOpacity>

        <View style={styles.row1Right}>
          {/* Small Language Selector (English / Hinglish) */}
          <TouchableOpacity
            style={styles.languagePill}
            onPress={toggleLanguage}
            activeOpacity={0.75}
          >
            <Text style={styles.languageText}>{language}</Text>
          </TouchableOpacity>

          {/* Simple Bell Notification Icon */}
          <TouchableOpacity
            style={styles.circleIconButton}
            onPress={onPressNotification}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── ROW 2: [ Smart Search ................. ] [ Heart ] [ Profile ] ── */}
      <View style={styles.row2}>
        {/* Smart Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onPressSearch}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../../../assets/brand/brand-icon.png")}
            style={styles.searchLogo}
            resizeMode="contain"
          />
          <Animated.Text
            style={[styles.searchPlaceholder, { opacity: fadeAnim }]}
            numberOfLines={1}
          >
            {SEARCH_PLACEHOLDERS[placeholderIndex]}
          </Animated.Text>
        </TouchableOpacity>

        {/* Saved Doctors Heart Icon */}
        <TouchableOpacity
          style={styles.actionCircleBtn}
          onPress={onPressFavorites || onPressSearch}
          activeOpacity={0.7}
        >
          <Heart size={19} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>

        {/* Profile Icon */}
        <TouchableOpacity
          style={styles.actionCircleBtn}
          onPress={onPressProfile}
          activeOpacity={0.7}
        >
          <User size={19} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  greetingLocationCol: {
    flex: 1,
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.navy, // Deep Navy Blue (#0F172A)
    letterSpacing: -0.3,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary, // Brand Blue (#5297ce)
    marginTop: 2,
  },
  row1Right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  languagePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  languageText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.primary,
  },
  circleIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchBar: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  searchLogo: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "400",
  },
  actionCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
});
