import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar,
  Clock,
  MapPin,
  Activity,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Stethoscope,
} from "lucide-react-native";
import { useBookingStore, GeneratedToken } from "../../store/useBookingStore";
import { colors, radius, shadows, typography } from "../../theme";

interface MyBookingsScreenProps {
  onTrackQueue: (token: GeneratedToken) => void;
  onExploreDoctors: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  onTrackQueue,
  onExploreDoctors,
}) => {
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "PAST">("ACTIVE");
  const { activeBookings, cancelBooking } = useBookingStore();

  const filteredBookings = activeBookings.filter((b) => {
    const isPast =
      b.status === "COMPLETED" ||
      b.status === "CANCELLED";
    return activeTab === "ACTIVE" ? !isPast : isPast;
  });

  const handleCancelPrompt = (token: GeneratedToken) => {
    Alert.alert(
      "Cancel Token",
      `Are you sure you want to cancel Token #${token.tokenNumber} with ${token.doctorName}?`,
      [
        { text: "No, Keep Token", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => cancelBooking(token.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Visits & Tokens</Text>
        <Text style={styles.headerSubtitle}>
          Track your live OPD tokens & consultation history
        </Text>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "ACTIVE" && styles.tabBtnActive]}
          onPress={() => setActiveTab("ACTIVE")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ACTIVE" && styles.tabTextActive,
            ]}
          >
            Active Tokens ({activeBookings.filter((b) => b.status !== "CANCELLED" && b.status !== "COMPLETED").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "PAST" && styles.tabBtnActive]}
          onPress={() => setActiveTab("PAST")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "PAST" && styles.tabTextActive,
            ]}
          >
            Past History ({activeBookings.filter((b) => b.status === "CANCELLED" || b.status === "COMPLETED").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCancelled = item.status === "CANCELLED";
          const isCompleted = item.status === "COMPLETED";

          return (
            <View style={styles.tokenCard}>
              {/* Card Header */}
              <View style={styles.tokenCardHeader}>
                <View style={styles.tokenNumberWrapper}>
                  <Text style={styles.tokenNumberPrefix}>TOKEN</Text>
                  <Text style={styles.tokenNumber}>#{item.tokenNumber}</Text>
                </View>

                <View style={styles.statusBadge}>
                  {isCancelled ? (
                    <View style={styles.statusCancelledPill}>
                      <XCircle size={12} color={colors.rose600} />
                      <Text style={styles.statusCancelledText}>Cancelled</Text>
                    </View>
                  ) : isCompleted ? (
                    <View style={styles.statusCompletedPill}>
                      <CheckCircle2 size={12} color={colors.emerald600} />
                      <Text style={styles.statusCompletedText}>Completed</Text>
                    </View>
                  ) : (
                    <View style={styles.statusLivePill}>
                      <View style={styles.livePulseDot} />
                      <Text style={styles.statusLiveText}>In Live Queue</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Doctor Details */}
              <View style={styles.doctorInfoRow}>
                <View style={styles.doctorAvatar}>
                  <Stethoscope size={20} color={colors.primary} />
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{item.doctorName}</Text>
                  <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                </View>
              </View>

              {/* Clinic Address & Patient */}
              <View style={styles.clinicRow}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={styles.clinicText} numberOfLines={1}>
                  {item.clinicName}, {item.clinicAddress}
                </Text>
              </View>

              {/* Patient and Payment Info */}
              <View style={styles.metaRow}>
                <Text style={styles.metaPatient}>
                  Patient: {item.patientName}
                </Text>
                <Text style={styles.metaFee}>{item.fee}</Text>
              </View>

              {/* Action Buttons */}
              {!isCancelled && !isCompleted ? (
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelPrompt(item)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => onTrackQueue(item)}
                  >
                    <Activity size={15} color="#FFFFFF" />
                    <Text style={styles.trackBtnText}>Track Queue</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.rebookBtn}
                  onPress={onExploreDoctors}
                >
                  <Text style={styles.rebookBtnText}>Book Again</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {activeTab === "ACTIVE"
                ? "No active OPD tokens"
                : "No past consultation history"}
            </Text>
            <Text style={styles.emptyDesc}>
              {activeTab === "ACTIVE"
                ? "You don't have any pending OPD appointments right now. Book a doctor to skip waiting."
                : "Your completed and past doctor visits will appear here."}
            </Text>
            <TouchableOpacity
              style={styles.findDoctorBtn}
              onPress={onExploreDoctors}
            >
              <Text style={styles.findDoctorBtnText}>Find Verified Doctors</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 90,
  },
  tokenCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
    gap: 12,
  },
  tokenCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 10,
  },
  tokenNumberWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  tokenNumberPrefix: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  tokenNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
  },
  statusBadge: {},
  statusLivePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 5,
    borderWidth: 1,
    borderColor: colors.emerald100,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald600,
  },
  statusLiveText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.emerald800,
  },
  statusCancelledPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.rose50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  statusCancelledText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.rose700,
  },
  statusCompletedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.slate100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  statusCompletedText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.slate700,
  },
  doctorInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  doctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.xl,
    backgroundColor: colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  clinicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clinicText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: radius.lg,
  },
  metaPatient: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  metaFee: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.rose600,
  },
  trackBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    gap: 6,
    ...shadows.soft,
  },
  trackBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  rebookBtn: {
    backgroundColor: colors.primary50,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  rebookBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  emptyState: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  findDoctorBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  findDoctorBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
