import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import {
  MapPin,
  Star,
  Calendar,
  Zap,
  Heart,
  ChevronRight,
} from "lucide-react-native";
import { Doctor } from "../../types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
  variant?: "horizontal" | "vertical";
  onPress?: (doctor: Doctor) => void;
  onPressCard?: (doctor: Doctor) => void;
  onBook?: (doctor: Doctor) => void;
  onPressBook?: (doctor: Doctor) => void;
  onToggleWishlist?: (doctorId: string) => void;
  isWishlisted?: boolean;
}

// High-quality hospital / clinic exterior cover image fallback matching reference
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80";

// High-quality doctor portrait fallback matching reference
const DEFAULT_DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80";

const VerifiedBadge = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
    {/* Twitter / Instagram style scalloped starburst badge */}
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

const ClinicLocationIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C7.86 2 4.5 5.36 4.5 9.5C4.5 14.86 12 22 12 22C12 22 19.5 14.86 19.5 9.5C19.5 5.36 16.14 2 12 2Z"
      fill="#5696C7"
    />
    <Path
      d="M12 6.5V12.5"
      stroke="#FFFFFF"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Path
      d="M9 9.5H15"
      stroke="#FFFFFF"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  variant = "vertical",
  onPress,
  onPressCard,
  onBook,
  onPressBook,
  onToggleWishlist,
  isWishlisted: propIsWishlisted = false,
}) => {
  const [internalWishlisted, setInternalWishlisted] = useState(propIsWishlisted);
  const [imgError, setImgError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  React.useEffect(() => {
    setInternalWishlisted(propIsWishlisted);
  }, [propIsWishlisted]);

  const isEmergency =
    doctor.emergencyAvailable ?? doctor.isEmergencySupported ?? true;

  const handleCardPress = () => {
    if (onPress) onPress(doctor);
    else if (onPressCard) onPressCard(doctor);
  };

  const handleBookPress = () => {
    if (onBook) onBook(doctor);
    else if (onPressBook) onPressBook(doctor);
  };

  const handleHeartPress = (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const next = !internalWishlisted;
    setInternalWishlisted(next);
    if (onToggleWishlist) {
      onToggleWishlist(doctor.id);
    }
  };

  const isCardHorizontal = variant === "horizontal";
  const doctorName = doctor.name || "Dr. Rajesh Kumar";
  const specialty = doctor.specialty || "General Physician";
  const expYears = doctor.experienceYears || 12;
  const rating = Number(doctor.rating || 4.9).toFixed(1);
  const clinicName = doctor.clinicName || doctor.clinic || "JivniCare Partner Clinic";
  const clinicAddress = doctor.clinicAddress || doctor.location || (doctor.district ? `${doctor.district} Medical Center` : "Main Road");
  const fee = doctor.consultationFee || doctor.fee || 500;

  const coverUri =
    !coverError && (doctor.clinicImage || DEFAULT_COVER_IMAGE)
      ? doctor.clinicImage || DEFAULT_COVER_IMAGE
      : DEFAULT_COVER_IMAGE;

  const avatarUri =
    !imgError && (doctor.image || DEFAULT_DOCTOR_AVATAR)
      ? doctor.image || DEFAULT_DOCTOR_AVATAR
      : DEFAULT_DOCTOR_AVATAR;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCardHorizontal ? styles.horizontalCard : styles.verticalCard,
      ]}
      activeOpacity={0.94}
      onPress={handleCardPress}
    >
      {/* ── 1. COVER / HOSPITAL IMAGE AREA ── */}
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: coverUri }}
          style={styles.coverImage}
          resizeMode="cover"
          onError={() => setCoverError(true)}
        />

        {/* ── 2. Top-Left: EMERGENCY BADGE ── */}
        {isEmergency && (
          <View style={styles.emergencyBadge}>
            <View style={styles.redDot} />
            <Text style={styles.ambulanceEmoji}>🚑</Text>
            <Text style={styles.emergencyBadgeText}>EMERGENCY</Text>
          </View>
        )}

        {/* ── 3. Top-Right: FAVORITE / HEART BUTTON ── */}
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={handleHeartPress}
          activeOpacity={0.8}
        >
          <Heart
            size={18}
            color={internalWishlisted ? "#EF4444" : "#475569"}
            fill={internalWishlisted ? "#EF4444" : "none"}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* ── 7. RATING BADGE (Lower-Right of Cover Image) ── */}
        <View style={styles.ratingBadge}>
          <Star size={13} color="#FBBF24" fill="#FBBF24" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>

      {/* ── CARD CONTENT AREA ── */}
      <View style={styles.contentContainer}>
        {/* ── 4 & 5. DOCTOR AVATAR + IDENTITY ROW ── */}
        <View style={styles.identityRow}>
          {/* Circular Avatar with Overlap & Green Availability Indicator */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
            {/* Green Availability Indicator */}
            <View style={styles.greenAvailabilityDot} />
          </View>

          {/* Doctor Name & Specialty/Experience */}
          <View style={styles.doctorInfoCol}>
            {/* Doctor Name + Verified Badge */}
            <View style={styles.nameWithBadge}>
              <Text style={styles.doctorNameText} numberOfLines={1}>
                {doctorName}
              </Text>
              <View style={styles.verifiedBadgeContainer}>
                <VerifiedBadge />
              </View>
            </View>

            {/* 6. Specialty • Experience Line */}
            <Text style={styles.specialtyExpText} numberOfLines={1}>
              {specialty}  •  {expYears}+ Years Exp.
            </Text>
          </View>
        </View>

        {/* ── 8. CLINIC / HOSPITAL LOCATION SECTION ── */}
        <View style={styles.locationSectionCard}>
          <View style={styles.locationPinBox}>
            <ClinicLocationIcon />
          </View>

          <View style={styles.locationTextCol}>
            <Text style={styles.hospitalNameText} numberOfLines={1}>
              {clinicName}
            </Text>
            <Text style={styles.hospitalAddressText} numberOfLines={1}>
              {clinicAddress}
            </Text>
          </View>
        </View>

        {/* ── 9 & 10. OPD STATUS & EMERGENCY AVAILABILITY ── */}
        <View style={styles.statusPillsRow}>
          {/* 9. OPD Status */}
          <View style={styles.opdStatusPill}>
            <View style={styles.opdGreenDot} />
            <Text style={styles.opdStatusText}>OPD: Open Today</Text>
          </View>

          {/* 10. Emergency Availability */}
          {isEmergency && (
            <View style={styles.emergencyStatusPill}>
              <Zap size={13} color="#E11D48" fill="#E11D48" />
              <Text style={styles.emergencyStatusText}>24/7 Emergency</Text>
            </View>
          )}
        </View>

        {/* ── 11 & 12. CONSULTATION FEE & BOOK SLOT CTA ── */}
        <View style={styles.bottomActionRow}>
          {/* 11. Consultation Fee */}
          <View style={styles.consultationFeeCol}>
            <Text style={styles.feeLabel}>Consultation Fee</Text>
            <Text style={styles.feeAmount}>₹{fee}</Text>
          </View>

          {/* 12. Book Slot CTA Button */}
          <TouchableOpacity
            style={styles.bookSlotButton}
            onPress={handleBookPress}
            activeOpacity={0.88}
          >
            <Calendar size={17} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.bookSlotButtonText}>Book Slot</Text>
            <ChevronRight size={17} color="#FFFFFF" strokeWidth={2.8} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  verticalCard: {
    width: "100%",
    marginBottom: 16,
  },
  horizontalCard: {
    width: 340,
    marginRight: 14,
  },

  /* ── 1. Cover Image ── */
  coverWrapper: {
    width: "100%",
    height: 165,
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },

  /* ── 2. Emergency Badge ── */
  emergencyBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    backgroundColor: "#EF4444",
  },
  ambulanceEmoji: {
    fontSize: 11,
    marginRight: 1,
  },
  emergencyBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#DC2626",
    letterSpacing: 0.3,
  },

  /* ── 3. Favourite Button ── */
  favouriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  /* ── Rating Badge on Cover Image ── */
  ratingBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.88)", // Dark slate container
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* ── Card Content Container ── */
  contentContainer: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 0,
  },

  /* ── Doctor Identity Area ── */
  identityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3.5,
    borderColor: "#FFFFFF",
    backgroundColor: "#E2E8F0",
    marginTop: -48, // Exact overlap across cover boundary
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
  greenAvailabilityDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  doctorInfoCol: {
    flex: 1,
    marginLeft: 12,
    marginTop: 6,
    gap: 2,
  },
  nameWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  doctorNameText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  verifiedBadgeContainer: {
    justifyContent: "center",
  },
  specialtyExpText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 1,
  },

  /* ── Location / Clinic Section ── */
  locationSectionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  locationPinBox: {
    marginRight: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  locationTextCol: {
    flex: 1,
    gap: 1,
  },
  hospitalNameText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  hospitalAddressText: {
    fontSize: 11.5,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 1,
  },

  /* ── Availability Status Pills ── */
  statusPillsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 11,
  },
  opdStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  opdGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  opdStatusText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#065F46",
  },
  emergencyStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FFE4E6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  emergencyStatusText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#BE123C",
  },

  /* ── Bottom Fee & Booking CTA ── */
  bottomActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 13,
    paddingTop: 2,
  },
  consultationFeeCol: {
    flex: 1,
    alignItems: "flex-start",
  },
  feeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  feeAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 1,
  },
  bookSlotButton: {
    flex: 0,
    paddingHorizontal: 20,
    height: 44,
    backgroundColor: "#5696C7", // JivniCare Brand Blue
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#5696C7",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  bookSlotButtonText: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#FFFFFF",
    marginHorizontal: 6,
  },
});
