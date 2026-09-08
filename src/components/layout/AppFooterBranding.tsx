import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { ShieldCheck } from "lucide-react-native";

interface AppFooterBrandingProps {
  style?: object;
}

export const AppFooterBranding: React.FC<AppFooterBrandingProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.brandRow}>
        <ShieldCheck size={13} color={colors.primary} />
        <Text style={styles.brandText}>JIVNICARE HEALTHCARE NETWORK</Text>
      </View>
      <Text style={styles.subText}>
        Patient Beta • v1.0.0 • Partner Clinics
      </Text>
      <Text style={styles.disclaimerText}>
        Digital OPD queue assistant. Clinical care is provided by independent practitioners.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  brandText: {
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  subText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "600",
  },
  disclaimerText: {
    fontSize: 9,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 13,
  },
});

