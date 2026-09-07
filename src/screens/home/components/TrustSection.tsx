import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ShieldCheck, Clock, Zap, Award } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

const PILLARS = [
  {
    id: "1",
    title: "100% Verified Doctors",
    desc: "Every doctor is physically verified with valid medical credentials.",
    icon: ShieldCheck,
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    id: "2",
    title: "Live Queue Tracking",
    desc: "Know your exact position in the OPD queue with live token updates.",
    icon: Clock,
    color: colors.primary,
    bg: "#EFF6FF",
  },
  {
    id: "3",
    title: "Zero Waiting in Clinic",
    desc: "Arrive just when your turn comes. Say goodbye to crowded waiting rooms.",
    icon: Zap,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: "4",
    title: "Transparent Pricing",
    desc: "Clear OPD consultation fees upfront with zero hidden charges.",
    icon: Award,
    color: "#7C3AED",
    bg: "#FAF5FF",
  },
];

export const TrustSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why Choose JivniCare</Text>
      <Text style={styles.subtitle}>
        Built to transform your clinic OPD experience
      </Text>

      <View style={styles.grid}>
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <View key={p.id} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: p.bg }]}>
                <Icon size={20} color={p.color} strokeWidth={2.2} />
              </View>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardDesc}>{p.desc}</Text>
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
  grid: {
    gap: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...shadows.soft,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
