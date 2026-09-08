import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Search, Calendar, Activity } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

const STEPS = [
  {
    step: "1",
    title: "Choose Your Doctor",
    desc: "Search by specialty, location, or symptom from verified doctor profiles.",
    icon: Search,
  },
  {
    step: "2",
    title: "Book OPD Token",
    desc: "Reserve your consultation token instantly without visiting clinic in advance.",
    icon: Calendar,
  },
  {
    step: "3",
    title: "Track Live Queue",
    desc: "Watch real-time token calling and arrive right before your turn.",
    icon: Activity,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthcare Made Simple</Text>
      <Text style={styles.subtitle}>Three easy steps to your OPD consult</Text>

      <View style={styles.stepsContainer}>
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <View key={s.step} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{s.step}</Text>
                </View>
                <View style={styles.iconBox}>
                  <Icon size={18} color={colors.primary} />
                </View>
              </View>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 14,
  },
  stepsContainer: {
    gap: 10,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...shadows.soft,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
