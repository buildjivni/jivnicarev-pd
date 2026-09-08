import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Share2,
  User,
  Building2,
  Check,
  Radio,
  Users,
  Sparkles,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { GeneratedToken, useBookingStore } from "../../store/useBookingStore";
import { trackQueueTokenApi } from "../../api/queueApi";

interface QueueTrackingScreenProps {
  token: GeneratedToken;
  onPressBack: () => void;
  onViewBookings: () => void;
}

const BRAND_BLUE = "#5696C7";
const NAVY_TEXT = "#0F172A";
const VERIFIED_GREEN = "#047857";
const DEFAULT_DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80";

const VerifiedBadge = () => (
  <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
      fill="#1D9BF0"
    />
    <Path
      d="M9.85 16.35l-3.5-3.5 1.41-1.41 2.09 2.08 6.5-6.49 1.41 1.41-7.91 7.91z"
      fill="#FFFFFF"
    />
  </Svg>
);

export const QueueTrackingScreen: React.FC<QueueTrackingScreenProps> = ({
  token,
  onPressBack,
  onViewBookings,
}) => {
  const { selectedDoctor } = useBookingStore();
  const doctorAvatar = token.doctorImage || selectedDoctor?.image || DEFAULT_DOCTOR_AVATAR;
  const [currentServing, setCurrentServing] = useState(
    token.currentTokenNumber || 14
  );
  const [liveTokensAhead, setLiveTokensAhead] = useState<number | null>(null);
  const [liveEstimatedWait, setLiveEstimatedWait] = useState<number | null>(null);
  const [tokenStatus, setTokenStatus] = useState(token.status);
  const [refreshing, setRefreshing] = useState(false);

  const tokensAhead = liveTokensAhead !== null ? liveTokensAhead : Math.max(0, token.tokenNumber - currentServing);
  const estimatedWait = liveEstimatedWait !== null ? liveEstimatedWait : tokensAhead * 15;
  const isMyTurn = tokensAhead <= 1;

  const fetchLiveStatus = async (showLoading = false) => {
    if (showLoading) setRefreshing(true);
    try {
      const res = await trackQueueTokenApi(token.id);
      if (res.success && res.data) {
        if (res.data.queue) {
          setCurrentServing(res.data.queue.currentToken);
          setLiveTokensAhead(res.data.queue.tokensAhead);
          setLiveEstimatedWait(res.data.queue.estimatedWaitMinutes);
        }
        if (res.data.token?.status) {
          setTokenStatus(res.data.token.status as any);
        }
      }
    } catch {}
    if (showLoading) setRefreshing(false);
  };

  React.useEffect(() => {
    fetchLiveStatus();
    const interval = setInterval(() => {
      fetchLiveStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [token.id]);

  const handleRefresh = () => {
    fetchLiveStatus(true);
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
        message: `My Live Consultation Token is #${token.tokenNumber} for ${token.doctorName} at ${token.clinicName}. Live queue status: Currently serving #${currentServing}, ${tokensAhead} patients ahead.`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Navigation Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color={NAVY_TEXT} />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.navTitle}>Live Queue Tracker</Text>
          <Text style={styles.navSubtitle}>{token.clinicName || "Clinic OPD"}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleShareToken}
          activeOpacity={0.7}
        >
          <Share2 size={18} color={NAVY_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Status Beacon */}
        <View style={styles.liveBanner}>
          <View style={styles.livePill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.livePillText}>LIVE IN CABIN</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
            activeOpacity={0.8}
          >
            <RefreshCw
              size={13}
              color={BRAND_BLUE}
              style={refreshing ? styles.rotating : undefined}
            />
            <Text style={styles.refreshButtonText}>
              {refreshing ? "Updating..." : "Refresh Queue"}
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
              <AlertTriangle size={16} color="#B45309" />
              <Text style={styles.urgentNoticeText}>
                Your turn is next! Please be present outside the doctor's cabin.
              </Text>
            </View>
          ) : null}

          <View style={styles.mainTokenSection}>
            <Text style={styles.tokenLabel}>YOUR CONSULTATION TOKEN</Text>
            <Text style={styles.myTokenNumber}>#{token.tokenNumber}</Text>
            <View style={styles.patientNamePill}>
              <User size={13} color={BRAND_BLUE} style={{ marginRight: 4 }} />
              <Text style={styles.patientNameText}>{token.patientName}</Text>
            </View>
          </View>

          {/* Live 3-Metric Queue Status Cards */}
          <View style={styles.tokenComparisonRow}>
            {/* Serving Now */}
            <View style={[styles.queueStatCard, styles.statCardServing]}>
              <View style={styles.statLabelRow}>
                <CheckCircle2 size={11} color="#059669" style={{ marginRight: 3 }} />
                <Text style={[styles.comparisonLabel, { color: "#047857" }]}>Serving</Text>
              </View>
              <Text style={[styles.comparisonValue, { color: "#047857" }]}>
                #{currentServing}
              </Text>
            </View>

            {/* In Queue Ahead */}
            <View style={[styles.queueStatCard, styles.statCardAhead]}>
              <View style={styles.statLabelRow}>
                <Users size={11} color="#64748B" style={{ marginRight: 3 }} />
                <Text style={styles.comparisonLabel}>Ahead</Text>
              </View>
              <Text style={[styles.comparisonValue, { color: NAVY_TEXT }]}>
                {tokensAhead === 0 ? "Next" : `${tokensAhead}`}
              </Text>
            </View>

            {/* Est. Wait Time */}
            <View style={[styles.queueStatCard, styles.statCardWait]}>
              <View style={styles.statLabelRow}>
                <Clock size={11} color={BRAND_BLUE} style={{ marginRight: 3 }} />
                <Text style={[styles.comparisonLabel, { color: BRAND_BLUE }]}>Est. Wait</Text>
              </View>
              <Text style={[styles.comparisonValue, { color: BRAND_BLUE }]}>
                {tokensAhead === 0 ? "Now" : `~${estimatedWait}m`}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor & Clinic Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeading}>Consultation Details</Text>
          <View style={styles.doctorMetaRow}>
            <View style={styles.docAvatarWrapper}>
              <Image
                source={{ uri: doctorAvatar }}
                style={styles.docAvatarImage}
                resizeMode="cover"
              />
              <View style={styles.docOnlineDot} />
            </View>
            <View style={styles.doctorMetaText}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.doctorName}>{token.doctorName}</Text>
                <VerifiedBadge />
              </View>
              <Text style={styles.specialty}>{token.specialty}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.clinicMetaRow}>
            <MapPin size={16} color="#64748B" style={{ marginTop: 2 }} />
            <View style={styles.clinicMetaText}>
              <Text style={styles.clinicName}>{token.clinicName}</Text>
              <Text style={styles.clinicAddress}>{token.clinicAddress}</Text>
            </View>
          </View>

          {/* Directions Button */}
          <TouchableOpacity
            style={styles.directionsBtn}
            onPress={handleOpenDirections}
            activeOpacity={0.8}
          >
            <Navigation size={15} color={BRAND_BLUE} />
            <Text style={styles.directionsBtnText}>Get Directions to Clinic</Text>
          </TouchableOpacity>
        </View>

        {/* Queue Protocol Notice */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={18} color={VERIFIED_GREEN} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Live Clinic Queue Guidance</Text>
            <Text style={styles.guaranteeDesc}>
              Queue updates live as clinic staff calls each token at the counter. Please keep this screen open and remain attentive for counter announcements.
            </Text>
          </View>
        </View>

        {/* Back to Visits Button */}
        <TouchableOpacity
          style={styles.viewVisitsBtn}
          onPress={onViewBookings}
          activeOpacity={0.8}
        >
          <Text style={styles.viewVisitsBtnText}>View All My Appointments</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
  navSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
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
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: VERIFIED_GREEN,
  },
  livePillText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: VERIFIED_GREEN,
    letterSpacing: 0.5,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  refreshButtonText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: BRAND_BLUE,
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  trackerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  trackerCardTurnSoon: {
    borderColor: "#A7F3D0",
    backgroundColor: "#F0FDF4",
  },
  urgentNoticeBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 14,
  },
  urgentNoticeText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: "700",
    color: "#92400E",
    lineHeight: 16,
  },
  mainTokenSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 4,
  },
  myTokenNumber: {
    fontSize: 56,
    fontWeight: "900",
    color: BRAND_BLUE,
    letterSpacing: -1,
  },
  patientNamePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 4,
  },
  patientNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: NAVY_TEXT,
  },
  tokenComparisonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    justifyContent: "space-between",
  },
  queueStatCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
  },
  statCardServing: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  statCardAhead: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  statCardWait: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  comparisonLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: "900",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
  doctorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  docAvatarWrapper: {
    position: "relative",
    width: 44,
    height: 44,
  },
  docAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
    borderWidth: 1.5,
    borderColor: "#EFF6FF",
  },
  docOnlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  docVerifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BRAND_BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  doctorMetaText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14.5,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
  specialty: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_BLUE,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  clinicMetaRow: {
    flexDirection: "row",
    gap: 8,
  },
  clinicMetaText: {
    flex: 1,
    gap: 2,
  },
  clinicName: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
  clinicAddress: {
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16,
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7FF",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginTop: 4,
  },
  directionsBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: BRAND_BLUE,
  },
  guaranteeBox: {
    flexDirection: "row",
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "flex-start",
  },
  guaranteeTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 2,
  },
  guaranteeDesc: {
    fontSize: 11,
    color: "#047857",
    lineHeight: 16,
  },
  viewVisitsBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  viewVisitsBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
});
