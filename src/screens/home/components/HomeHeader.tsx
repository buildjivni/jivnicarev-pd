import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Search, Menu, User, Bell } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

interface HomeHeaderProps {
  district?: string;
  onPressSearch?: () => void;
  onPressMenu?: () => void;
  onPressProfile?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  district,
  onPressSearch,
  onPressMenu,
  onPressProfile,
}) => {
  return (
    <View style={styles.header}>
      {/* ── Left: Real Web Brand Logo + Beta Badge ── */}
      <View style={styles.leftBrand}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.betaBadge}>
          <Text style={styles.betaText}>BETA</Text>
        </View>
      </View>

      {/* ── Right: Search + Profile / Menu Actions ── */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPressSearch}
          activeOpacity={0.7}
        >
          <Search size={18} color="#64748B" strokeWidth={2.2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPressProfile}
          activeOpacity={0.7}
        >
          <User size={18} color="#64748B" strokeWidth={2.2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPressMenu}
          activeOpacity={0.7}
        >
          <Menu size={20} color="#64748B" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  leftBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 125,
    height: 32,
  },
  betaBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: radius.xs,
  },
  betaText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
});
