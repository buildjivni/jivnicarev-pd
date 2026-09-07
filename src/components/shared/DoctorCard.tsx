import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  MapPin,
  Clock,
  Heart,
  Star,
  Calendar,
  CheckCircle2,
  Zap,
} from "lucide-react-native";
import { colors, radius, shadows } from "../../theme";
import { Doctor } from "../../types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: (doctor: Doctor) => void;
  onPressCard?: (doctor: Doctor) => void;
  onBook?: (doctor: Doctor) => void;
  onPressBook?: (doctor: Doctor) => void;
  onToggleWishlist?: (doctorId: string) => void;
  isWishlisted?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onPress,
  onPressCard,
  onBook,
  onPressBook,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const isEmergency = doctor.emergencyAvailable || doctor.isEmergencySupported;
  const handleCardPress = () => {
    if (onPress) onPress(doctor);
    else if (onPressCard) onPressCard(doctor);
  };
  const handleBookPress = () => {
    if (onBook) onBook(doctor);
    else if (onPressBook) onPressBook(doctor);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={handleCardPress}
    >
      {/* ── 1. Top Cover Banner ── */}
      <View style={styles.coverBanner}>
        <View style={styles.coverOverlay}>
          {isEmergency && (
            <View style={styles.emergencyBadge}>
              <View style={styles.emergencyDot} />
              <Text style={styles.emergencyText}>EMERGENCY</Text>
            </View>
          )}
          <Text style={styles.coverClinicName} numberOfLines={1}>
            {doctor.clinicName || "JivniCare Partner Clinic"}
          </Text>
        </View>

        {/* Floating Heart Button */}
        <TouchableOpacity
          style={styles.floatingHeart}
          onPress={() => onToggleWishlist && onToggleWishlist(doctor.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={18}
            color={isWishlisted ? "#EF4444" : "#64748B"}
            fill={isWishlisted ? "#EF4444" : "none"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* ── 2. Doctor Info Body ── */}
      <View style={styles.cardBody}>
        {/* Avatar & Rating Row */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {doctor.name ? doctor.name.replace(/^Dr\.\s*/i, "")[0] : "D"}
              </Text>
            </View>
            <View style={styles.onlineStatusDot} />
          </View>

          <View style={styles.ratingBadge}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>
              {doctor.rating?.toFixed(1) || "4.9"}{" "}
              <Text style={styles.reviewCountText}>
                ({doctor.reviewCount || 128})
              </Text>
            </Text>
          </View>
        </View>

        {/* Doctor Name & Verified Badge */}
        <View style={styles.nameRow}>
          <Text style={styles.doctorName} numberOfLines={1}>
            {doctor.name}
          </Text>
          <CheckCircle2 size={16} color="#0284C7" fill="#E0F2FE" />
        </View>

        {/* Specialty & Experience */}
        <View style={styles.specialtyRow}>
          <View style={styles.specialtyPill}>
            <Text style={styles.specialtyText}>{doctor.specialty}</Text>
          </View>
          <Text style={styles.expText}>
            {doctor.experienceYears || 10}+ Years Exp.
          </Text>
        </View>

        {/* Clinic & Address Box */}
        <View style={styles.clinicInfoBox}>
          <MapPin size={14} color="#0284C7" strokeWidth={2.2} />
          <View style={styles.clinicTextCol}>
            <Text style={styles.clinicTitle} numberOfLines={1}>
              {doctor.clinicName || "Jamui City OPD & Clinic"}
            </Text>
            <Text style={styles.clinicAddress} numberOfLines={1}>
              {doctor.clinicAddress || "Main Hospital Road, Jamui"}
            </Text>
          </View>
        </View>

        {/* Availability Status Chip */}
        <View style={styles.statusBox}>
          <View style={styles.statusLeft}>
            <View style={styles.liveDot} />
            <Text style={styles.statusText}>Live OPD Active</Text>
          </View>
          {isEmergency && (
            <View style={styles.erTag}>
              <Zap size={11} color="#DC2626" />
              <Text style={styles.erTagText}>24/7 ER</Text>
            </View>
          )}
        </View>

        {/* Fee & Action CTA Row */}
        <View style={styles.actionRow}>
          <View style={styles.feeCol}>
            <Text style={styles.feeLabel}>FEE</Text>
            <Text style={styles.feeAmount}>
              ₹{doctor.consultationFee || 500}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookPress}
            activeOpacity={0.85}
          >
            <Calendar size={15} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.bookButtonText}>Book OPD Token</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 290,
    backgroundColor: "#FFFFFF",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
    ...shadows.card,
  },
  coverBanner: {
    height: 100,
    backgroundColor: "#EFF6FF",
    justifyContent: "space-between",
    padding: 12,
  },
  coverOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 40,
  },
  emergencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 4,
  },
  emergencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  emergencyText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#DC2626",
  },
  coverClinicName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.navy,
  },
  floatingHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: -26,
    marginBottom: 8,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#E0F2FE",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  onlineStatusDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  reviewCountText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#B45309",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  specialtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  specialtyPill: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  expText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  clinicInfoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: radius.md,
    gap: 8,
    marginBottom: 10,
  },
  clinicTextCol: {
    flex: 1,
  },
  clinicTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  clinicAddress: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    marginBottom: 14,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },
  erTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.xs,
    gap: 2,
  },
  erTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#DC2626",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  feeCol: {
    alignItems: "flex-start",
  },
  feeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  bookButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    height: 42,
    borderRadius: radius.md,
    gap: 6,
    ...shadows.button,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textWhite,
  },
});
