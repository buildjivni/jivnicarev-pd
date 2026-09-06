import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  Heart,
  Star,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react-native";
import { colors, radius, shadows } from "../../theme";
import { Doctor } from "../../types/doctor";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = Math.min(SCREEN_WIDTH - 36, 320);

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
  onBook?: () => void;
  onNotify?: () => void;
}

function formatExperience(exp: string): string {
  if (!exp) return "10+ Years Exp.";
  const num = parseInt(exp, 10);
  if (isNaN(num)) return exp.includes("Exp") ? exp : `${exp} Exp.`;
  return `${num}+ Years Exp.`;
}

function displayName(name: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  return /^Dr\.?\s/i.test(trimmed) ? trimmed : `Dr. ${trimmed}`;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onPress,
  onBook,
  onNotify,
}) => {
  const { savedDoctorIds, toggleSavedDoctor } = usePatientLocationStore();
  const isSaved = savedDoctorIds.includes(doctor.id);
  const [notified, setNotified] = useState(false);

  const isVerified = doctor.verificationStatus !== "UNVERIFIED";
  const rating = doctor.rating ?? 4.9;
  const reviewCount = doctor.reviewCount ?? doctor.reviews ?? 48;
  const hasReviews = reviewCount > 0 && rating > 0;
  const isEmergency = Boolean(
    doctor.emergencyAvailable ||
      doctor.isEmergencySupported ||
      doctor.isEmergencyAvailable
  );

  // Availability state
  const isOffline = doctor.availabilityStatus === "OFFLINE";
  const isQueueFull = doctor.availabilityStatus === "QUEUE_FULL";
  const isOnBreak = doctor.availabilityStatus === "ON_BREAK";
  const isAvailable = !isOffline && !isQueueFull && !isOnBreak;

  const handleNotifyPress = () => {
    setNotified(true);
    if (onNotify) onNotify();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.96}
      onPress={onPress}
      style={[styles.container, shadows.card]}
    >
      {/* ── 1. COVER IMAGE & FLOATING BADGES ── */}
      <View style={styles.coverWrapper}>
        {doctor.clinicImage ? (
          <Image
            source={{ uri: doctor.clinicImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverFallback}>
            <Text style={styles.coverFallbackText}>
              {doctor.clinic || "JivniCare Partner Clinic"}
            </Text>
          </View>
        )}

        {/* Emergency Badge (Top-Left) */}
        {isEmergency && (
          <View style={styles.emergencyBadge}>
            <View style={styles.emergencyDot} />
            <Text style={styles.emergencyText}>EMERGENCY</Text>
          </View>
        )}

        {/* Floating Wishlist Heart (Top-Right) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleSavedDoctor(doctor.id)}
          style={[styles.wishlistButton, shadows.soft]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={17}
            color={isSaved ? colors.destructive : colors.textMuted}
            fill={isSaved ? colors.destructive : "transparent"}
            strokeWidth={2.2}
          />
        </TouchableOpacity>
      </View>

      {/* ── 2. TIER 1: OVERLAPPING DOCTOR AVATAR & RATING ── */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarWrapper}>
          {doctor.image ? (
            <Image
              source={{ uri: doctor.image }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {doctor.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Live Online Status Dot */}
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isAvailable
                  ? colors.success
                  : isOnBreak
                  ? colors.warning
                  : colors.offline,
              },
            ]}
          />
        </View>

        {/* Rating Pill */}
        {hasReviews ? (
          <View style={styles.ratingPill}>
            <Star size={12} color="#D97706" fill="#FBBF24" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviewCountText}>({reviewCount})</Text>
          </View>
        ) : (
          <View style={styles.verifiedClinicPill}>
            <ShieldCheck size={13} color={colors.primary} />
            <Text style={styles.verifiedClinicText}>Verified Clinic</Text>
          </View>
        )}
      </View>

      {/* ── 3. TIER 2: DOCTOR IDENTITY & SPECIALTY ── */}
      <View style={styles.contentBody}>
        {/* Doctor Name & Verified Badge */}
        <View style={styles.nameRow}>
          <Text style={styles.doctorName} numberOfLines={1}>
            {displayName(doctor.name)}
          </Text>
          {isVerified && (
            <CheckCircle2
              size={16}
              color={colors.primary}
              fill={colors.primaryLight}
            />
          )}
        </View>

        {/* Specialty & Experience Tag */}
        <View style={styles.tagsRow}>
          <View style={styles.specialtyTag}>
            <Text style={styles.specialtyTagText}>{doctor.specialty}</Text>
          </View>
          <Text style={styles.experienceText}>
            {formatExperience(doctor.experience)}
          </Text>
        </View>

        {/* Clinic & Location Box */}
        <View style={styles.clinicBox}>
          <MapPin
            size={14}
            color={colors.primary}
            strokeWidth={2.4}
            style={styles.clinicPinIcon}
          />
          <View style={styles.clinicTextCol}>
            <Text style={styles.clinicNameText} numberOfLines={1}>
              {doctor.clinic || "City Care Clinic"}
            </Text>
            <Text style={styles.clinicLocationText} numberOfLines={1}>
              {doctor.location || "Main Road, Hospital Area"}
            </Text>
          </View>
        </View>

        {/* ── 4. APPROVED CHANGE: OPD AVAILABILITY & EMERGENCY INDICATOR ── */}
        <View style={styles.opdIndicatorBox}>
          <View style={styles.opdLeftCol}>
            <View style={styles.opdTitleRow}>
              <View
                style={[
                  styles.opdPulseDot,
                  {
                    backgroundColor: isAvailable
                  ? colors.success
                  : isOnBreak
                  ? colors.warning
                  : colors.offline,
                  },
                ]}
              />
              <Text style={styles.opdTitleText}>
                {isAvailable
                  ? "Live OPD Active"
                  : isOnBreak
                  ? "Walk-in Paused"
                  : isQueueFull
                  ? "OPD Queue Full"
                  : "OPD Closed"}
              </Text>
            </View>
            <Text style={styles.opdSubtitleText}>
              {doctor.nextAvailable ||
                (isAvailable ? "Tokens Calling Now" : "Opens at 05:00 PM")}
            </Text>
          </View>

          {isEmergency && (
            <View style={styles.emergencyChip}>
              <Zap size={11} color={colors.destructive} />
              <Text style={styles.emergencyChipText}>24/7 ER</Text>
            </View>
          )}
        </View>

        {/* ── 5. TIER 3: ACTION BAR (FEE + DYNAMIC CTA) ── */}
        <View style={styles.actionBar}>
          <View style={styles.feeCol}>
            <Text style={styles.feeLabel}>FEE</Text>
            <Text style={styles.feeAmount}>{doctor.fee || "₹500"}</Text>
          </View>

          {/* Dynamic Action Button */}
          {isAvailable && (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onBook || onPress}
              style={[styles.ctaButton, styles.ctaBookButton, shadows.button]}
            >
              <Calendar size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.ctaButtonText}>Book OPD Token</Text>
            </TouchableOpacity>
          )}

          {isQueueFull && (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleNotifyPress}
              disabled={notified}
              style={[
                styles.ctaButton,
                styles.ctaNotifyButton,
                notified && styles.ctaNotifiedButton,
              ]}
            >
              <Clock size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.ctaButtonText}>
                {notified ? "We'll Notify You ✓" : "Notify When Slot Opens"}
              </Text>
            </TouchableOpacity>
          )}

          {(isOffline || isOnBreak) && (
            <View style={[styles.ctaButton, styles.ctaClosedButton]}>
              <Text style={styles.ctaClosedText}>
                {isOnBreak ? "Doctor on Break" : "Currently Closed"}
              </Text>
            </View>
          )}
        </View>

        {/* Next Open Text when Closed */}
        {(isOffline || isOnBreak) && (
          <Text style={styles.nextOpenSubtext}>
            {doctor.nextAvailable ? `Next: ${doctor.nextAvailable}` : "Next: Today at 05:00 PM"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.07)",
    overflow: "hidden",
    marginRight: 14,
  },
  coverWrapper: {
    height: 115,
    width: "100%",
    backgroundColor: colors.accent,
    position: "relative",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  coverFallbackText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  emergencyBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.destructiveBorder,
  },
  emergencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.destructive,
  },
  emergencyText: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.destructive,
    letterSpacing: 0.4,
  },
  wishlistButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  avatarRow: {
    paddingHorizontal: 14,
    marginTop: -26,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    zIndex: 10,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primary,
  },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    gap: 3,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#78350F",
  },
  reviewCountText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#92400E",
  },
  verifiedClinicPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputSurface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    gap: 4,
    marginBottom: 2,
  },
  verifiedClinicText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  contentBody: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  doctorName: {
    fontSize: 15.5,
    fontWeight: "800",
    color: colors.textPrimary,
    flexShrink: 1,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 9,
    flexWrap: "wrap",
  },
  specialtyTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  specialtyTagText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.navy,
  },
  experienceText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  clinicBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.inputSurface,
    borderRadius: radius.md,
    padding: 8,
    gap: 6,
    marginBottom: 9,
  },
  clinicPinIcon: {
    marginTop: 1,
  },
  clinicTextCol: {
    flex: 1,
  },
  clinicNameText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  clinicLocationText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 1,
  },
  opdIndicatorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: "rgba(86, 150, 199, 0.15)",
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 10,
  },
  opdLeftCol: {
    flex: 1,
  },
  opdTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  opdPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  opdTitleText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: colors.navy,
  },
  opdSubtitleText: {
    fontSize: 9.5,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 1,
  },
  emergencyChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.destructiveBg,
    borderWidth: 1,
    borderColor: colors.destructiveBorder,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: radius.xs,
    gap: 3,
  },
  emergencyChipText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.destructive,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.inputSurface,
    gap: 8,
  },
  feeCol: {
    justifyContent: "center",
  },
  feeLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  feeAmount: {
    fontSize: 15.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  ctaButton: {
    flex: 1,
    minHeight: 38,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  ctaBookButton: {
    backgroundColor: colors.primary,
  },
  ctaNotifyButton: {
    backgroundColor: colors.warning,
  },
  ctaNotifiedButton: {
    backgroundColor: colors.success,
  },
  ctaClosedButton: {
    backgroundColor: colors.inputSurface,
  },
  ctaButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  ctaClosedText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.textMuted,
  },
  nextOpenSubtext: {
    fontSize: 9.5,
    fontWeight: "700",
    color: colors.textMuted,
    textAlign: "right",
    marginTop: 3,
  },
});
