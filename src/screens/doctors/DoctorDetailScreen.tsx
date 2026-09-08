import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Share,
  Platform,
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
  CalendarCheck,
  CheckCircle2,
  Phone,
  Heart,
  Award,
  Users,
  Zap,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Activity,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { Doctor } from "../../types/doctor";
import { colors, radius, shadows } from "../../theme";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";

interface DoctorDetailScreenProps {
  doctor: Doctor;
  onPressBack: () => void;
  onPressBook: (doctor: Doctor) => void;
}

const VerifiedBadge = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80";
const DEFAULT_DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80";

const WEEKDAYS_SCHEDULE = [
  { day: "Monday", hours: "10:00 AM - 02:00 PM", isOpen: true },
  { day: "Tuesday", hours: "10:00 AM - 02:00 PM", isOpen: true },
  { day: "Wednesday", hours: "10:00 AM - 02:00 PM", isOpen: true },
  { day: "Thursday", hours: "10:00 AM - 02:00 PM", isOpen: true },
  { day: "Friday", hours: "10:00 AM - 02:00 PM", isOpen: true },
  { day: "Saturday", hours: "10:00 AM - 01:00 PM", isOpen: true },
  { day: "Sunday", hours: "Closed (Emergency Only)", isOpen: false },
];

const MOCK_REVIEWS = [
  {
    id: "rev-1",
    author: "Rakesh Ranjan",
    rating: 5,
    date: "2 days ago",
    comment:
      "Very patient and accurate diagnosis. The digital live token system saved us over 2 hours of clinic waiting time in Jamui.",
  },
  {
    id: "rev-2",
    author: "Pooja Kumari",
    rating: 5,
    date: "1 week ago",
    comment:
      "Dr. Kumar explained the prescription clearly. Polite clinic staff and fast OPD consultation process.",
  },
];

export const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({
  doctor,
  onPressBack,
  onPressBook,
}) => {
  const { toggleSavedDoctor, isDoctorSaved } = usePatientLocationStore();
  const isSaved = isDoctorSaved(doctor.id);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const isEmergency =
    doctor.emergencyAvailable ?? doctor.isEmergencySupported ?? true;

  const doctorName = doctor.name || "Dr. Rajesh Kumar";
  const specialty = doctor.specialty || "General Physician";
  const expYears = doctor.experienceYears || 12;
  const rating = Number(doctor.rating || 4.9).toFixed(1);
  const reviewCount = doctor.reviewCount || doctor.reviews || 128;
  const clinicName = doctor.clinicName || doctor.clinic || "Jamui City OPD & Clinic";
  const clinicAddress =
    doctor.clinicAddress || doctor.location || "Main Hospital Road, Jamui, Bihar - 811307";
  const fee = doctor.consultationFee || doctor.fee || 500;

  const coverUri = doctor.clinicImage || DEFAULT_COVER_IMAGE;
  const avatarUri = doctor.image || DEFAULT_DOCTOR_AVATAR;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Book OPD Token for ${doctorName} (${specialty}) at ${clinicName} via JivniCare. Zero-Wait Live OPD Tracking!`,
      });
    } catch {
      // Ignore
    }
  };

  const bioText =
    doctor.about ||
    `${doctorName} is a senior ${specialty} specialist practicing at ${clinicName}, ${clinicAddress}. With over ${expYears}+ years of clinical experience, they specialize in comprehensive diagnostic consultations, routine care, and emergency stabilization.`;

  const tags = [
    specialty,
    "General Health",
    "Viral Fever",
    "Preventive Care",
    "Clinical Diagnostics",
    "Chronic Care",
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── STICKY TOP NAV BAR ── */}
      <View style={styles.topNavBar}>
        <TouchableOpacity
          style={styles.navIconButton}
          onPress={onPressBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.navCenterInfo}>
          <Text style={styles.navDoctorName} numberOfLines={1}>
            {doctorName}
          </Text>
          <Text style={styles.navSpecialty} numberOfLines={1}>
            {specialty} • Jamui
          </Text>
        </View>

        <View style={styles.navRightActions}>
          <TouchableOpacity
            style={styles.navIconButton}
            onPress={() => toggleSavedDoctor(doctor.id)}
            activeOpacity={0.7}
          >
            <Heart
              size={19}
              color={isSaved ? colors.rose600 : colors.slate500}
              fill={isSaved ? colors.rose600 : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={19} color={colors.slate500} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── SCROLLABLE PROFILE CONTENT ── */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SECTION 1: HERO IDENTITY CARD (Exact Web Structure) ── */}
        <View style={styles.heroCard}>
          {/* Banner Cover Image */}
          <View style={styles.bannerWrapper}>
            <Image
              source={{ uri: coverUri }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {isEmergency && (
              <View style={styles.emergencyPillBadge}>
                <View style={styles.redDot} />
                <Text style={styles.emergencyText}>🚑 EMERGENCY</Text>
              </View>
            )}
          </View>

          {/* Identity Body */}
          <View style={styles.heroBody}>
            {/* Avatar & Rating Row */}
            <View style={styles.avatarRatingRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
                <View style={styles.activeStatusDot} />
              </View>

              <View style={styles.ratingBadge}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingValueText}>{rating}</Text>
                <Text style={styles.reviewCountText}>({reviewCount} reviews)</Text>
              </View>
            </View>

            {/* Doctor Name & Verified Badge */}
            <View style={styles.nameRow}>
              <Text style={styles.doctorNameHeading}>{doctorName}</Text>
              <VerifiedBadge />
            </View>

            {/* Service Chips (OPD + Emergency) */}
            <View style={styles.serviceChipsRow}>
              <View style={styles.opdServiceChip}>
                <View style={styles.greenServiceDot} />
                <Text style={styles.opdServiceText}>OPD Available</Text>
              </View>
              {isEmergency && (
                <View style={styles.emergencyServiceChip}>
                  <Zap size={12} color="#E11D48" fill="#E11D48" />
                  <Text style={styles.emergencyServiceText}>24/7 Emergency</Text>
                </View>
              )}
            </View>

            {/* Specialty Subtitle */}
            <Text style={styles.specialtyHeading}>{specialty}</Text>

            {/* Trust Block */}
            <View style={styles.trustBlock}>
              <View style={styles.trustItem}>
                <ShieldCheck size={16} color={colors.emerald600} />
                <Text style={styles.trustItemBold}>Verified Profile</Text>
              </View>
              <View style={styles.trustItem}>
                <Award size={16} color={colors.slate500} />
                <Text style={styles.trustItemText}>{expYears}+ Yrs Exp.</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={styles.languageEmoji}>🗣️</Text>
                <Text style={styles.trustItemText}>Hindi, English</Text>
              </View>
            </View>

            {/* 3-Column Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Users size={18} color={colors.primary} />
                <Text style={styles.statValue}>2.5k+</Text>
                <Text style={styles.statLabel}>PATIENTS SERVED</Text>
              </View>
              <View style={styles.statBox}>
                <Zap size={18} color={colors.emerald600} />
                <Text style={styles.statValue}>Live Queue</Text>
                <Text style={styles.statLabel}>OPD ACTIVE</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.rupeeIcon}>₹</Text>
                <Text style={styles.statValue}>{fee}</Text>
                <Text style={styles.statLabel}>CONSULT FEE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── SECTION 2: ABOUT THE DOCTOR ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>ABOUT THE DOCTOR</Text>
          <Text
            style={styles.bioText}
            numberOfLines={isBioExpanded ? undefined : 3}
          >
            {bioText}
          </Text>
          <TouchableOpacity
            onPress={() => setIsBioExpanded(!isBioExpanded)}
            style={styles.readMoreBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.readMoreText}>
              {isBioExpanded ? "Show less" : "Read more"}
            </Text>
            {isBioExpanded ? (
              <ChevronUp size={16} color={colors.primary} />
            ) : (
              <ChevronDown size={16} color={colors.primary} />
            )}
          </TouchableOpacity>

          {/* Expertise Tags */}
          <View style={styles.tagsContainer}>
            <Text style={styles.subHeading}>EXPERTISE & TAGS</Text>
            <View style={styles.tagsList}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Education & Qualifications */}
          <View style={styles.educationBlock}>
            <View style={styles.eduHeader}>
              <GraduationCap size={16} color={colors.primary} />
              <Text style={styles.subHeading}>EDUCATION & QUALIFICATIONS</Text>
            </View>
            <View style={styles.eduCard}>
              <Text style={styles.eduText}>
                MBBS, MD - General Medicine (AIIMS / PMCH Certified)
              </Text>
            </View>
          </View>

          {/* Medical Registration */}
          <View style={styles.regBlock}>
            <View style={styles.regHeader}>
              <ShieldCheck size={16} color={colors.emerald600} />
              <Text style={styles.subHeading}>MEDICAL REGISTRATION</Text>
            </View>
            <View style={styles.regCard}>
              <Text style={styles.regLabel}>
                Reg. No: <Text style={styles.regValue}>BMR-84920-IND</Text>
              </Text>
              <Text style={styles.regCouncil}>
                Bihar Medical Council (NMC Registered)
              </Text>
            </View>
          </View>
        </View>

        {/* ── SECTION 3: OPD SCHEDULE & TIMINGS ── */}
        <View style={styles.sectionCard}>
          {/* Availability Alert Header */}
          <View style={styles.availAlertCard}>
            <View style={styles.availIconBox}>
              <CalendarCheck size={20} color={colors.primary} />
            </View>
            <View style={styles.availAlertTextCol}>
              <Text style={styles.availAlertTitle}>Slots Available Today</Text>
              <Text style={styles.availAlertSub}>
                Live token generation active • Next slot at 10:00 AM
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionHeading, { marginTop: 14 }]}>
            WEEKLY OPD TIMINGS
          </Text>
          <View style={styles.scheduleTable}>
            {WEEKDAYS_SCHEDULE.map((item, idx) => (
              <View
                key={item.day}
                style={[
                  styles.scheduleRow,
                  idx === WEEKDAYS_SCHEDULE.length - 1 && styles.scheduleRowLast,
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

        {/* ── SECTION 4: CLINIC & HOSPITAL LOCATION ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>CLINIC & HOSPITAL LOCATION</Text>
          <View style={styles.clinicLocationCard}>
            <View style={styles.clinicIconBox}>
              <MapPin size={22} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={styles.clinicDetailCol}>
              <Text style={styles.clinicTitle}>{clinicName}</Text>
              <Text style={styles.clinicSubText}>{clinicAddress}</Text>
            </View>
          </View>
        </View>

        {/* ── SECTION 5: PATIENT REVIEWS & RATINGS ── */}
        <View style={styles.sectionCard}>
          <View style={styles.reviewsHeaderRow}>
            <Text style={styles.sectionHeading}>PATIENT REVIEWS</Text>
            <View style={styles.ratingBadgeSmall}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingBadgeText}>{rating} / 5.0</Text>
            </View>
          </View>

          <View style={styles.reviewsList}>
            {MOCK_REVIEWS.map((rev) => (
              <View key={rev.id} style={styles.reviewItemCard}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewAuthorCol}>
                    <Text style={styles.reviewAuthorName}>{rev.author}</Text>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  <View style={styles.reviewStarsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        color="#F59E0B"
                        fill="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Clinical Transparency & Disclaimer Card */}
        <View style={styles.detailDisclaimerCard}>
          <Text style={styles.detailDisclaimerTitle}>Important Clinical Information</Text>
          <Text style={styles.detailDisclaimerText}>
            Consultation fee, schedule, and treatment plans are determined solely by the consulting practitioner. JivniCare assists with digital queue token reservations and does not provide direct medical treatment or diagnosis.
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FIXED BOTTOM CTA BAR (Brand Blue #5297ce) ── */}
      <View style={styles.bottomBar}>
        <View style={styles.feeInfoCol}>
          <Text style={styles.bottomFeeLabel}>CONSULTATION FEE</Text>
          <Text style={styles.bottomFeeAmount}>₹{fee}</Text>
          <View style={styles.bottomLiveStatusRow}>
            <View style={styles.miniGreenDot} />
            <Text style={styles.bottomLiveStatusText}>OPD: Open Today</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookSlotCTAButton}
          onPress={() => onPressBook(doctor)}
          activeOpacity={0.88}
        >
          <Calendar size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.bookSlotCTAText}>Book OPD Token</Text>
          <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.8} />
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
  topNavBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  navIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  navCenterInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  navDoctorName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  navSpecialty: {
    fontSize: 11.5,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 1,
  },
  navRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 14,
    gap: 14,
  },

  /* ── SECTION 1: HERO CARD ── */
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    ...shadows.soft,
  },
  bannerWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  emergencyPillBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E11D48",
  },
  emergencyText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#E11D48",
    letterSpacing: 0.4,
  },

  heroBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  avatarRatingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "#E2E8F0",
    marginTop: -48,
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },
  activeStatusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    marginBottom: 6,
  },
  ratingValueText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  reviewCountText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  doctorNameHeading: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  serviceChipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  opdServiceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    gap: 5,
  },
  greenServiceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  opdServiceText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.3,
  },
  emergencyServiceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FFE4E6",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    gap: 4.5,
  },
  emergencyServiceText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#BE123C",
    letterSpacing: 0.3,
  },

  specialtyHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 8,
  },

  trustBlock: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trustItemBold: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.emerald700,
  },
  trustItemText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  languageEmoji: {
    fontSize: 13,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 3,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  rupeeIcon: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.primary,
  },

  /* ── SECTION 2: ABOUT CARD ── */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...shadows.soft,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 13.5,
    lineHeight: 21,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  readMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },

  tagsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  subHeading: {
    fontSize: 10.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagPill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  educationBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  eduHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eduCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
  },
  eduText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  regBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  regHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  regCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
  },
  regLabel: {
    fontSize: 12.5,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  regValue: {
    fontWeight: "800",
    color: colors.textPrimary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  regCouncil: {
    fontSize: 11.5,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: 2,
  },

  /* ── SECTION 3: OPD SCHEDULE ── */
  availAlertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  availIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  availAlertTextCol: {
    flex: 1,
  },
  availAlertTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  availAlertSub: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 1,
  },
  scheduleTable: {
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  scheduleRowLast: {
    borderBottomWidth: 0,
  },
  scheduleDay: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scheduleHours: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.emerald700,
  },
  scheduleHoursClosed: {
    color: colors.rose600,
  },

  /* ── SECTION 4: CLINIC LOCATION ── */
  clinicLocationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  clinicIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    alignItems: "center",
    justifyContent: "center",
  },
  clinicDetailCol: {
    flex: 1,
  },
  clinicTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  clinicSubText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },

  /* ── SECTION 5: REVIEWS ── */
  reviewsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ratingBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  reviewsList: {
    gap: 10,
  },
  reviewItemCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  reviewTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reviewAuthorCol: {},
  reviewAuthorName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
  reviewStarsRow: {
    flexDirection: "row",
    gap: 2,
  },
  reviewComment: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  detailDisclaimerCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 14,
    marginTop: 4,
  },
  detailDisclaimerTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 4,
  },
  detailDisclaimerText: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
  },

  /* ── BOTTOM CTA BAR ── */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  feeInfoCol: {
    alignItems: "flex-start",
  },
  bottomFeeLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  bottomFeeAmount: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 1,
  },
  bottomLiveStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  miniGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  bottomLiveStatusText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#065F46",
  },
  bookSlotCTAButton: {
    flex: 1,
    marginLeft: 16,
    height: 48,
    backgroundColor: "#5297ce",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#5297ce",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bookSlotCTAText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    marginHorizontal: 8,
  },
});

