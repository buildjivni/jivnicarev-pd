import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Share,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Share2,
} from "lucide-react-native";
import { GeneratedToken } from "../../store/useBookingStore";
import { colors, radius, shadows, typography } from "../../theme";

interface QueueTrackingScreenProps {
  token: GeneratedToken;
  onPressBack: () => void;
  onViewBookings: () => void;
}

export const QueueTrackingScreen: React.FC<QueueTrackingScreenProps> = ({
  token,
  onPressBack,
  onViewBookings,
}) => {
  const [currentServing, setCurrentServing] = useState(
    token.currentTokenNumber || 8
  );
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const tokensAhead = Math.max(0, token.tokenNumber - currentServing);
  const estimatedWait = tokensAhead * 5;
  const isMyTurn = tokensAhead <= 1;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed("Just now");
    }, 600);
  };

  const handleOpenDirections = () => {
    const query = encodeURIComponent(
      `${token.clinicName} ${token.clinicAddress}`
    );
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleShareToken = async () => {
    try {
      await Share.share({
        message: `My live OPD Token is #${token.tokenNumber} for ${token.doctorName} at ${token.clinicName}. Live queue status: Current serving #${currentServing}, ${tokensAhead} patients ahead.`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Navigation Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onPressBack}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Live OPD Queue</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleShareToken}>
          <Share2 size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Tracker Banner */}
        <View style={styles.liveBanner}>
          <View style={styles.livePill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.livePillText}>LIVE OPD TRACKER</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={14}
              color={colors.primary}
              style={refreshing ? styles.rotating : undefined}
            />
            <Text style={styles.refreshButtonText}>
              {refreshing ? "Updating..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Big Live Tracker Card */}
        <View
          style={[
            styles.trackerCard,
            isMyTurn && styles.trackerCardTurnSoon,
          ]}
        >
          {isMyTurn ? (
            <View style={styles.urgentNoticeBox}>
              <AlertTriangle size={16} color={colors.amber700} />
              <Text style={styles.urgentNoticeText}>
                Your turn is approaching! Please be present near the OPD room.
              </Text>
            </View>
          ) : null}

          <View style={styles.mainTokenSection}>
            <Text style={styles.tokenLabel}>YOUR TOKEN NUMBER</Text>
            <Text style={styles.myTokenNumber}>#{token.tokenNumber}</Text>
            <Text style={styles.patientName}>{token.patientName}</Text>
          </View>

          <View style={styles.tokenComparisonRow}>
            <View style={styles.comparisonCol}>
              <Text style={styles.comparisonLabel}>Currently Serving</Text>
              <Text style={styles.servingTokenNumber}>#{currentServing}</Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonCol}>
              <Text style={styles.comparisonLabel}>Patients Ahead</Text>
              <Text style={styles.aheadCount}>
                {tokensAhead === 0 ? "You're Next" : `${tokensAhead}`}
              </Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonCol}>
              <Text style={styles.comparisonLabel}>Est. Wait</Text>
              <Text style={styles.waitDuration}>
                {tokensAhead === 0 ? "Now" : `~${estimatedWait}m`}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor & Clinic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Consultation Details</Text>
          <View style={styles.doctorMetaRow}>
            <View style={styles.doctorBadgeIcon}>
              <CheckCircle2 size={18} color={colors.primary} />
            </View>
            <View style={styles.doctorMetaText}>
              <Text style={styles.doctorName}>{token.doctorName}</Text>
              <Text style={styles.specialty}>{token.specialty}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.clinicMetaRow}>
            <MapPin size={18} color={colors.textSecondary} />
            <View style={styles.clinicMetaText}>
              <Text style={styles.clinicName}>{token.clinicName}</Text>
              <Text style={styles.clinicAddress}>{token.clinicAddress}</Text>
            </View>
          </View>

          {/* Get Directions Button */}
          <TouchableOpacity
            style={styles.directionsBtn}
            onPress={handleOpenDirections}
          >
            <Navigation size={16} color={colors.primary} />
            <Text style={styles.directionsBtnText}>Get Directions to Clinic</Text>
          </TouchableOpacity>
        </View>

        {/* Zero-Wait Guarantee Notice */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={20} color={colors.emerald600} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>JivniCare Zero-Wait Guarantee</Text>
            <Text style={styles.guaranteeDesc}>
              This queue updates in real time as the doctor calls each patient. Reach the clinic 10 minutes before your token.
            </Text>
          </View>
        </View>

        {/* Back to Visits Button */}
        <TouchableOpacity style={styles.viewVisitsBtn} onPress={onViewBookings}>
          <Text style={styles.viewVisitsBtnText}>View All My Bookings</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  liveBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.emerald100,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emerald600,
  },
  livePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.emerald800,
    letterSpacing: 0.5,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  trackerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.elevated,
  },
  trackerCardTurnSoon: {
    borderColor: colors.emerald300,
    backgroundColor: colors.emerald50 + "30",
  },
  urgentNoticeBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.amber50,
    padding: 10,
    borderRadius: radius.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.amber200,
    marginBottom: 14,
  },
  urgentNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: colors.amber900,
  },
  mainTokenSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  myTokenNumber: {
    fontSize: 60,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -1,
  },
  patientName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 2,
  },
  tokenComparisonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  comparisonCol: {
    flex: 1,
    alignItems: "center",
  },
  comparisonLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 3,
  },
  servingTokenNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.emerald700,
  },
  aheadCount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  waitDuration: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  comparisonDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
    gap: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  doctorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  doctorBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorMetaText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  clinicMetaRow: {
    flexDirection: "row",
    gap: 10,
  },
  clinicMetaText: {
    flex: 1,
    gap: 2,
  },
  clinicName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  clinicAddress: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary50,
    paddingVertical: 10,
    borderRadius: radius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary100,
    marginTop: 4,
  },
  directionsBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  guaranteeBox: {
    flexDirection: "row",
    backgroundColor: colors.emerald50,
    padding: 14,
    borderRadius: radius.xl,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.emerald100,
    alignItems: "flex-start",
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.emerald900,
    marginBottom: 2,
  },
  guaranteeDesc: {
    fontSize: 11,
    color: colors.emerald800,
    lineHeight: 16,
  },
  viewVisitsBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  viewVisitsBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
