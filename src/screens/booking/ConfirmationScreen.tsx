import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ShieldCheck,
  Calendar,
  Home,
  Check,
  Building2,
  User,
  Share2,
  Sparkles,
  Radio,
  BellRing,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { GeneratedToken, useBookingStore } from "../../store/useBookingStore";

interface ConfirmationScreenProps {
  token: GeneratedToken;
  onTrackQueue: (token: GeneratedToken) => void;
  onViewBookings: () => void;
  onGoHome: () => void;
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

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  token,
  onTrackQueue,
  onViewBookings,
  onGoHome,
}) => {
  const { selectedDoctor } = useBookingStore();
  const doctorAvatar = token.doctorImage || selectedDoctor?.image || DEFAULT_DOCTOR_AVATAR;
  const handleShare = async () => {
    try {
      await Share.share({
        message: `JivniCare Appointment Confirmed!\nDoctor: ${token.doctorName}\nToken: #${token.tokenNumber}\nClinic: ${token.clinicName}, ${token.clinicAddress}\nPatient: ${token.patientName}`,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── TOP HEADER ── */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeftBox}>
          <ShieldCheck size={18} color={VERIFIED_GREEN} />
          <Text style={styles.headerBrandText}>JivniCare Verified</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
          <Share2 size={18} color={NAVY_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PREMIUM DIGITAL CLINIC PASS TICKET ── */}
        <View style={styles.ticketContainer}>
          {/* Ticket Header: Doctor Info */}
          <View style={styles.ticketTopSection}>
            <View style={styles.ticketDocRow}>
              <View style={styles.docAvatarWrapper}>
                <Image
                  source={{ uri: doctorAvatar }}
                  style={styles.docAvatarImage}
                  resizeMode="cover"
                />
                <View style={styles.docOnlineDot} />
              </View>

              <View style={styles.ticketDocCol}>
                <View style={styles.docNameVerifiedRow}>
                  <Text style={styles.ticketDocName} numberOfLines={1}>
                    {token.doctorName}
                  </Text>
                  <VerifiedBadge />
                </View>
                <Text style={styles.ticketDocSpec}>{token.specialty}</Text>
                <View style={styles.ticketClinicRow}>
                  <Building2 size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.ticketClinicText} numberOfLines={1}>
                    {token.clinicName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ticket Dashed Perforation with Side Cutouts */}
          <View style={styles.perforationRow}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedDivider} />
            <View style={styles.notchRight} />
          </View>

          {/* Ticket Body: Hero Token Number */}
          <View style={styles.ticketMiddleSection}>
            <View style={styles.tokenTagBadge}>
              <Sparkles size={12} color={BRAND_BLUE} style={{ marginRight: 4 }} />
              <Text style={styles.tokenTagText}>YOUR LIVE CONSULTATION TOKEN</Text>
            </View>

            <Text style={styles.heroTokenNumber}>#{token.tokenNumber}</Text>

            <View style={styles.patientPillBox}>
              <User size={13} color={BRAND_BLUE} style={{ marginRight: 5 }} />
              <Text style={styles.patientPillName}>
                Patient: <Text style={styles.patientPillBold}>{token.patientName}</Text>
              </Text>
            </View>

            {/* 3-Metric Real-Time Queue Status Cards */}
            <View style={styles.queueStatsContainer}>
              {/* Serving Now */}
              <View style={[styles.queueStatCard, styles.statCardServing]}>
                <View style={styles.statLabelRow}>
                  <CheckCircle2 size={11} color="#059669" style={{ marginRight: 3 }} />
                  <Text style={[styles.queueStatLabel, { color: "#047857" }]}>Serving</Text>
                </View>
                <Text style={[styles.queueStatValue, { color: "#047857" }]}>
                  #{token.currentTokenNumber || 13}
                </Text>
              </View>

              {/* In Queue Ahead */}
              <View style={[styles.queueStatCard, styles.statCardAhead]}>
                <View style={styles.statLabelRow}>
                  <Users size={11} color="#64748B" style={{ marginRight: 3 }} />
                  <Text style={styles.queueStatLabel}>Ahead</Text>
                </View>
                <Text style={[styles.queueStatValue, { color: NAVY_TEXT }]}>
                  {token.patientsAhead ?? 4}
                </Text>
              </View>

              {/* Est. Wait Time */}
              <View style={[styles.queueStatCard, styles.statCardWait]}>
                <View style={styles.statLabelRow}>
                  <Clock size={11} color={BRAND_BLUE} style={{ marginRight: 3 }} />
                  <Text style={[styles.queueStatLabel, { color: BRAND_BLUE }]}>Est. Wait</Text>
                </View>
                <Text style={[styles.queueStatValue, { color: BRAND_BLUE }]}>
                  ~{token.estimatedWaitMinutes || 20}m
                </Text>
              </View>
            </View>
            <Text style={styles.waitFootnoteText}>
              *Wait times are approximate and vary based on patient clinical needs
            </Text>
          </View>

          {/* Ticket Bottom Section: Address & Payment Info */}
          <View style={styles.ticketBottomSection}>
            <View style={styles.ticketMetaRow}>
              <Text style={styles.ticketMetaLabel}>Payment Status</Text>
              <Text style={styles.ticketMetaValue}>Pay at Clinic Counter (Cash / UPI)</Text>
            </View>
            <View style={styles.ticketMetaRow}>
              <Text style={styles.ticketMetaLabel}>Consultation Fee</Text>
              <Text style={styles.ticketMetaFee}>{token.fee || "₹500"}</Text>
            </View>
          </View>
        </View>

        {/* ── CLINIC ARRIVAL & SMS NOTICE ── */}
        <View style={styles.guidanceCard}>
          <View style={styles.guidanceIconBox}>
            <BellRing size={17} color={BRAND_BLUE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.guidanceTitle}>Live SMS & WhatsApp Alerts Active</Text>
            <Text style={styles.guidanceDesc}>
              Real-time token call updates are sent directly to your phone. Please reach {token.clinicName || "the clinic"} 10-15 minutes prior to your turn.
            </Text>
          </View>
        </View>

        {/* ── ACTION BUTTONS ── */}
        <View style={styles.actionContainer}>
          {/* Primary CTA: Track Live Queue with Live Telemetry Radio Badge */}
          <TouchableOpacity
            style={styles.primaryTrackBtn}
            onPress={() => onTrackQueue(token)}
            activeOpacity={0.88}
          >
            <View style={styles.liveBeaconPill}>
              <View style={styles.livePulsingDot} />
              <Radio size={16} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.primaryTrackText}>Track Live OPD Queue</Text>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.8} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBookingsBtn}
            onPress={onViewBookings}
            activeOpacity={0.8}
          >
            <Calendar size={17} color={BRAND_BLUE} />
            <Text style={styles.secondaryBookingsText}>View in My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textHomeBtn}
            onPress={onGoHome}
            activeOpacity={0.7}
          >
            <Home size={16} color="#64748B" />
            <Text style={styles.textHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

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
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerLeftBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerBrandText: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 12,
    alignItems: "center",
  },

  // ── Ticket Container ──
  ticketContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  ticketTopSection: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  ticketDocRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  docAvatarWrapper: {
    position: "relative",
    width: 48,
    height: 48,
  },
  docAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
    borderWidth: 1.5,
    borderColor: "#EFF6FF",
  },
  docOnlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  ticketDocCol: {
    marginLeft: 12,
    flex: 1,
  },
  docNameVerifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketDocName: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY_TEXT,
    marginRight: 6,
  },
  docVerifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BRAND_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketDocSpec: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_BLUE,
    marginTop: 1,
  },
  ticketClinicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  ticketClinicText: {
    fontSize: 11.5,
    color: "#64748B",
    flex: 1,
  },

  // Perforation
  perforationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    height: 24,
    backgroundColor: "#FFFFFF",
  },
  notchLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    marginLeft: -10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dashedDivider: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    marginHorizontal: 8,
  },
  notchRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    marginRight: -10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  // Ticket Middle Body
  ticketMiddleSection: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  tokenTagBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 4,
  },
  tokenTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: BRAND_BLUE,
    letterSpacing: 0.8,
  },
  heroTokenNumber: {
    fontSize: 52,
    fontWeight: "900",
    color: BRAND_BLUE,
    letterSpacing: -1,
  },
  patientPillBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 2,
    marginBottom: 14,
  },
  patientPillName: {
    fontSize: 12,
    color: "#64748B",
  },
  patientPillBold: {
    fontWeight: "800",
    color: NAVY_TEXT,
  },

  // 3-Metric Queue Status Cards
  queueStatsContainer: {
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
  queueStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  queueStatValue: {
    fontSize: 16,
    fontWeight: "900",
  },
  waitFootnoteText: {
    fontSize: 9.5,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },

  // Ticket Bottom Meta
  ticketBottomSection: {
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 6,
  },
  ticketMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketMetaLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  ticketMetaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: NAVY_TEXT,
  },
  ticketMetaFee: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_BLUE,
  },

  // Guidance Card
  guidanceCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F7FF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    gap: 12,
    marginBottom: 16,
  },
  guidanceIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  guidanceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY_TEXT,
    marginBottom: 2,
  },
  guidanceDesc: {
    fontSize: 11.5,
    color: "#475569",
    lineHeight: 16,
  },

  // Action Container & Buttons
  actionContainer: {
    width: "100%",
    gap: 10,
  },
  primaryTrackBtn: {
    width: "100%",
    backgroundColor: BRAND_BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: BRAND_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  liveBeaconPill: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    gap: 5,
  },
  livePulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#4ADE80",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  primaryTrackText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  secondaryBookingsBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryBookingsText: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_BLUE,
  },
  textHomeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  textHomeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
});

