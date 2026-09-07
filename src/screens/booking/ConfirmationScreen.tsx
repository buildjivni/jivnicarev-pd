import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Activity,
  Home,
} from "lucide-react-native";
import { GeneratedToken } from "../../store/useBookingStore";
import { colors, radius, shadows, typography } from "../../theme";

interface ConfirmationScreenProps {
  token: GeneratedToken;
  onTrackQueue: (token: GeneratedToken) => void;
  onViewBookings: () => void;
  onGoHome: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  token,
  onTrackQueue,
  onViewBookings,
  onGoHome,
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTrackQueue(token);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [token, onTrackQueue]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Checkmark Badge */}
        <View style={styles.successIconWrapper}>
          <CheckCircle2 size={44} color={colors.emerald600} />
        </View>

        <Text style={styles.title}>Token Booked Successfully!</Text>
        <Text style={styles.subtitle}>
          Your OPD token has been registered in the live queue.
        </Text>

        {/* Doctor & Clinic Info */}
        <View style={styles.doctorHeader}>
          <Text style={styles.doctorName}>{token.doctorName}</Text>
          <Text style={styles.specialty}>{token.specialty}</Text>
        </View>

        {/* Big Token Number Card */}
        <View style={styles.tokenCard}>
          <Text style={styles.tokenLabel}>YOUR OPD TOKEN</Text>
          <Text style={styles.tokenNumber}>#{token.tokenNumber}</Text>

          <View style={styles.clinicAddressRow}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={styles.clinicAddressText}>
              {token.clinicName}, {token.clinicAddress}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Queue Estimation Summary */}
          <View style={styles.queueStatsRow}>
            <View style={styles.queueStatCol}>
              <Text style={styles.queueStatValue}>
                #{token.currentTokenNumber}
              </Text>
              <Text style={styles.queueStatLabel}>Current Serving</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.queueStatCol}>
              <Text style={styles.queueStatValue}>{token.patientsAhead}</Text>
              <Text style={styles.queueStatLabel}>Patients Ahead</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.queueStatCol}>
              <Text style={styles.queueStatValue}>
                ~{token.estimatedWaitMinutes}m
              </Text>
              <Text style={styles.queueStatLabel}>Est. Wait Time</Text>
            </View>
          </View>
        </View>

        {/* Payment & Patient Summary */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Patient Name</Text>
            <Text style={styles.metaValue}>{token.patientName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Payment Mode</Text>
            <Text style={styles.metaValue}>
              {token.paymentMode === "CASH"
                ? "Pay at Clinic (Cash)"
                : "Paid Online"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Consultation Fee</Text>
            <Text style={styles.metaValue}>{token.fee}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Live Tracking Status</Text>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>Active Now</Text>
            </View>
          </View>
        </View>

        {/* Countdown notice */}
        <Text style={styles.autoRedirectNotice}>
          Opening live queue tracker in {countdown}s...
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onTrackQueue(token)}
        >
          <Activity size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Track Live Queue</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onViewBookings}
        >
          <Calendar size={18} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>View in My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} onPress={onGoHome}>
          <Home size={18} color={colors.textSecondary} />
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.emerald50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.emerald100,
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  doctorHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  tokenCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary100,
    ...shadows.elevated,
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 4,
  },
  tokenNumber: {
    fontSize: 54,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -1,
  },
  clinicAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  clinicAddressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  queueStatsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  queueStatCol: {
    flex: 1,
    alignItems: "center",
  },
  queueStatValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  queueStatLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  metaCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald600,
  },
  livePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.emerald700,
  },
  autoRedirectNotice: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: radius.full,
    gap: 8,
    ...shadows.soft,
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: colors.primary50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: radius.full,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary100,
    marginBottom: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  outlineButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
