import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight, Stethoscope } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

interface CtaBannerSectionProps {
  onPressFindDoctors?: () => void;
  onPressCta?: () => void;
}

export const CtaBannerSection: React.FC<CtaBannerSectionProps> = ({
  onPressFindDoctors,
  onPressCta,
}) => {
  const handlePress = onPressCta || onPressFindDoctors;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Stethoscope size={24} color="#FFFFFF" strokeWidth={2.2} />
        </View>

        <Text style={styles.title}>Ready to See a Doctor Today?</Text>
        <Text style={styles.subtitle}>
          Book verified OPD tokens in your district without waiting.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Find Doctors Now</Text>
          <ArrowRight size={16} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: 22,
    alignItems: "center",
    ...shadows.card,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "#BAE6FD",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 18,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: 8,
    ...shadows.soft,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
});
