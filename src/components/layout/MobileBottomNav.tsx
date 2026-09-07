import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Home,
  Stethoscope,
  AlertTriangle,
  CalendarDays,
  User,
} from "lucide-react-native";
import { colors, radius, shadows } from "../../theme";

export type TabName = "home" | "doctors" | "emergency" | "my-bookings" | "profile";

interface MobileBottomNavProps {
  activeTab: TabName;
  onSelectTab: (tab: TabName) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab("home")}
        activeOpacity={0.7}
      >
        <Home
          size={22}
          color={activeTab === "home" ? colors.primary : colors.textSecondary}
          strokeWidth={activeTab === "home" ? 2.5 : 2}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "home" ? styles.tabLabelActive : null,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* 2. Doctors */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab("doctors")}
        activeOpacity={0.7}
      >
        <Stethoscope
          size={22}
          color={activeTab === "doctors" ? colors.primary : colors.textSecondary}
          strokeWidth={activeTab === "doctors" ? 2.5 : 2}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "doctors" ? styles.tabLabelActive : null,
          ]}
        >
          Doctors
        </Text>
      </TouchableOpacity>

      {/* 3. Emergency */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab("emergency")}
        activeOpacity={0.7}
      >
        <View style={styles.emergencyIconContainer}>
          <AlertTriangle size={20} color="#DC2626" strokeWidth={2.5} />
        </View>
        <Text style={[styles.tabLabel, styles.emergencyLabel]}>Emergency</Text>
      </TouchableOpacity>

      {/* 4. My Bookings */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab("my-bookings")}
        activeOpacity={0.7}
      >
        <CalendarDays
          size={22}
          color={
            activeTab === "my-bookings" ? colors.primary : colors.textSecondary
          }
          strokeWidth={activeTab === "my-bookings" ? 2.5 : 2}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "my-bookings" ? styles.tabLabelActive : null,
          ]}
        >
          Visits
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab("profile")}
        activeOpacity={0.7}
      >
        <User
          size={22}
          color={activeTab === "profile" ? colors.primary : colors.textSecondary}
          strokeWidth={activeTab === "profile" ? 2.5 : 2}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "profile" ? styles.tabLabelActive : null,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    height: 62,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    ...shadows.card,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  emergencyIconContainer: {
    backgroundColor: "#FEF2F2",
    padding: 3,
    borderRadius: radius.sm,
  },
  emergencyLabel: {
    color: "#DC2626",
    fontWeight: "700",
  },
});
