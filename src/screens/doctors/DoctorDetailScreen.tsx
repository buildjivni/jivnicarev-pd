import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Share2,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Phone,
  Heart,
  Award,
  Stethoscope,
} from "lucide-react-native";
import { Doctor } from "../../types/doctor";
import { colors, radius, shadows, typography } from "../../theme";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";

interface DoctorDetailScreenProps {
  doctor: Doctor;
  onPressBack: () => void;
  onPressBook: (doctor: Doctor) => void;
}

const WEEKDAYS = [
  { day: "Monday", hours: "09:00 AM - 02:00 PM", isOpen: true },
  { day: "Tuesday", hours: "09:00 AM - 02:00 PM", isOpen: true },
  { day: "Wednesday", hours: "09:00 AM - 02:00 PM", isOpen: true },
  { day: "Thursday", hours: "09:00 AM - 02:00 PM", isOpen: true },
  { day: "Friday", hours: "09:00 AM - 02:00 PM", isOpen: true },
  { day: "Saturday", hours: "09:00 AM - 01:00 PM", isOpen: true },
  { day: "Sunday", hours: "Emergency Only", isOpen: false },
];

export const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({
  doctor,
  onPressBack,
  onPressBook,
}) => {
  const { toggleSavedDoctor, isDoctorSaved } = usePatientLocationStore();
  const isSaved = isDoctorSaved(doctor.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Book OPD Token for ${doctor.name} (${doctor.specialty}) at ${doctor.clinicName || "JivniCare Clinic"} on JivniCare. Zero-Wait Live Tracking guaranteed!`,
      });
    } catch {
      // Ignored
    }
  };

  const experience =
    typeof doctor.experienceYears === "number"
      ? `${doctor.experienceYears} Years Exp.`
      : doctor.experience || "10+ Years Exp.";

  const fee =
    typeof doctor.consultationFee === "number"
      ? `₹${doctor.consultationFee}`
      : doctor.fee || "₹500";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Navigation Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onPressBack}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Doctor Profile
        </Text>
        <View style={styles.navRightActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleSavedDoctor(doctor.id)}
          >
            <Heart
              size={20}
              color={isSaved ? colors.rose600 : colors.textPrimary}
              fill={isSaved ? colors.rose600 : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Share2 size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarLarge}>
            <Stethoscope size={36} color={colors.primary} />
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={14} color="#FFFFFF" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.specialtyText}>{doctor.specialty}</Text>
            <Text style={styles.expText}>{experience}</Text>

            {/* Ratings & Patients Count */}
            <View style={styles.ratingMetaRow}>
              <View style={styles.ratingPill}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingValue}>{doctor.rating || 4.9}</Text>
                <Text style={styles.reviewsCount}>
                  ({doctor.reviewCount || 120}+ reviews)
                </Text>
              </View>
              <View style={styles.experiencePill}>
                <Award size={13} color={colors.primary} />
                <Text style={styles.experiencePillText}>Top Rated</Text>
              </View>
            </View>
          </View>
        </View>

        {/* OPD & Emergency Status Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>OPD & Service Status</Text>
          <View style={styles.statusChipsGrid}>
            <View style={styles.statusChip}>
              <View style={styles.statusDotLive} />
              <View>
                <Text style={styles.statusChipTitle}>OPD Queue Active</Text>
                <Text style={styles.statusChipSubtitle}>
                  Token booking open today
                </Text>
              </View>
            </View>
            {doctor.emergencyAvailable && (
              <View style={[styles.statusChip, styles.statusChipEmergency]}>
                <View style={styles.statusDotEmergency} />
                <View>
                  <Text style={styles.statusChipTitleEmergency}>
                    24x7 Emergency Available
                  </Text>
                  <Text style={styles.statusChipSubtitle}>
                    Priority emergency tokens accepted
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Clinic & Location Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Clinic & Hospital Address</Text>
          <View style={styles.clinicInfoRow}>
            <MapPin size={20} color={colors.primary} style={styles.pinIcon} />
            <View style={styles.clinicTextWrapper}>
              <Text style={styles.clinicName}>
                {doctor.clinicName || "City Health Clinic"}
              </Text>
              <Text style={styles.clinicAddress}>
                {doctor.clinicAddress || "Main Hospital Road, Jamui, Bihar - 811307"}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly OPD Schedule */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly OPD Timings</Text>
          <View style={styles.scheduleTable}>
            {WEEKDAYS.map((item, idx) => (
              <View
                key={item.day}
                style={[
                  styles.scheduleRow,
                  idx === WEEKDAYS.length - 1 && styles.scheduleRowLast,
                ]}
              >
                <Text style={styles.scheduleDay}>{item.day}</Text>
                <Text
                  style={[
                    styles.scheduleHours,
                    !item.isOpen && styles.scheduleHoursClosed,
                  ]}
                >
                  {item.hours}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Consultation Fee & Guarantees */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Consultation Fee & Policy</Text>
          <View style={styles.feeBreakdownRow}>
            <Text style={styles.feeLabel}>OPD Consultation Fee</Text>
            <Text style={styles.feeAmount}>{fee}</Text>
          </View>
          <View style={styles.guaranteeRow}>
            <CheckCircle2 size={16} color={colors.emerald600} />
            <Text style={styles.guaranteeText}>
              Pay at Clinic (Cash) or Online UPI supported
            </Text>
          </View>
          <View style={styles.guaranteeRow}>
            <CheckCircle2 size={16} color={colors.emerald600} />
            <Text style={styles.guaranteeText}>
              Zero-Wait Live Queue Tracking included free
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.feeContainer}>
          <Text style={styles.bottomBarFeeLabel}>Consultation Fee</Text>
          <Text style={styles.bottomBarFeeValue}>{fee}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onPressBook(doctor)}
        >
          <Text style={styles.bookButtonText}>Book OPD Token</Text>
        </TouchableOpacity>
      </View>
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
  navRightActions: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  avatarLarge: {
    width: 74,
    height: 74,
    borderRadius: radius.xl,
    backgroundColor: colors.primary50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  profileDetails: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 3,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  expText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  ratingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.amber50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  reviewsCount: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  experiencePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  experiencePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statusChipsGrid: {
    gap: 8,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.emerald100,
    gap: 10,
  },
  statusChipEmergency: {
    backgroundColor: colors.rose50,
    borderColor: colors.rose100,
  },
  statusDotLive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.emerald600,
  },
  statusDotEmergency: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.rose600,
  },
  statusChipTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.emerald800,
  },
  statusChipTitleEmergency: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.rose800,
  },
  statusChipSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  clinicInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  pinIcon: {
    marginTop: 2,
  },
  clinicTextWrapper: {
    flex: 1,
    gap: 2,
  },
  clinicName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  clinicAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  scheduleTable: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scheduleRowLast: {
    borderBottomWidth: 0,
  },
  scheduleDay: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  scheduleHours: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.emerald700,
  },
  scheduleHoursClosed: {
    color: colors.rose600,
  },
  feeBreakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  feeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.elevated,
  },
  feeContainer: {
    gap: 2,
  },
  bottomBarFeeLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  bottomBarFeeValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: radius.full,
    ...shadows.soft,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
