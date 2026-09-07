import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PhoneCall,
  AlertTriangle,
  ShieldCheck,
  Clock,
  MapPin,
  Stethoscope,
  ChevronRight,
  Ambulance,
} from "lucide-react-native";
import { Doctor } from "../../types/doctor";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";
import { colors, radius, shadows, typography } from "../../theme";

interface EmergencyScreenProps {
  onBookEmergencyDoctor: (doctor: Doctor) => void;
  onExploreAllDoctors: () => void;
}

const EMERGENCY_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician & Emergency Care",
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 128,
    clinicName: "Jamui City OPD & 24x7 Emergency",
    clinicAddress: "Main Hospital Road, Jamui",
    consultationFee: 500,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-3",
    name: "Dr. Amit Roy",
    specialty: "Cardiologist & Cardiac Emergency",
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 210,
    clinicName: "Roy Heart & Critical Care",
    clinicAddress: "Gandhi Chowk, Jamui",
    consultationFee: 700,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-4",
    name: "Dr. Priya Sharma",
    specialty: "Gynecologist & Maternal Emergency",
    experienceYears: 11,
    rating: 4.8,
    reviewCount: 156,
    clinicName: "Matri Seva Hospital 24x7",
    clinicAddress: "Court Road, Jamui",
    consultationFee: 600,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
];

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  onBookEmergencyDoctor,
  onExploreAllDoctors,
}) => {
  const { selectedDistrict } = usePatientLocationStore();

  const handleCallHelpline = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <AlertTriangle size={14} color={colors.rose600} />
          <Text style={styles.headerBadgeText}>24x7 EMERGENCY CARE</Text>
        </View>
        <Text style={styles.headerTitle}>Urgent Medical Assistance</Text>
        <Text style={styles.headerSubtitle}>
          Immediate care doctors & ambulance network in {selectedDistrict}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Emergency Call Buttons */}
        <View style={styles.hotlinesRow}>
          <TouchableOpacity
            style={styles.ambulanceCard}
            onPress={() => handleCallHelpline("102")}
          >
            <View style={styles.ambulanceIconCircle}>
              <PhoneCall size={20} color="#FFFFFF" />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={styles.hotlineTitle}>Ambulance</Text>
              <Text style={styles.hotlineNumber}>Call 102</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hospitalCard}
            onPress={() => handleCallHelpline("108")}
          >
            <View style={styles.hospitalIconCircle}>
              <PhoneCall size={20} color="#FFFFFF" />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={styles.hotlineTitle}>Disaster / Emergency</Text>
              <Text style={styles.hotlineNumber}>Call 108</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Doctors Available Now */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Emergency Doctors on Duty</Text>
          <Text style={styles.sectionSubtitle}>
            Direct priority OPD consultation
          </Text>
        </View>

        {EMERGENCY_DOCTORS.map((doctor) => (
          <View key={doctor.id} style={styles.doctorCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.doctorAvatar}>
                <Stethoscope size={22} color={colors.rose600} />
              </View>
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.specialtyText}>{doctor.specialty}</Text>
                <View style={styles.openPill}>
                  <View style={styles.openPulseDot} />
                  <Text style={styles.openPillText}>24x7 Emergency Ready</Text>
                </View>
              </View>
            </View>

            <View style={styles.clinicAddressRow}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={styles.clinicAddressText} numberOfLines={1}>
                {doctor.clinicName}, {doctor.clinicAddress}
              </Text>
            </View>

            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={styles.callClinicBtn}
                onPress={() => handleCallHelpline("+919876543210")}
              >
                <PhoneCall size={14} color={colors.textPrimary} />
                <Text style={styles.callClinicBtnText}>Call Clinic</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bookEmergencyBtn}
                onPress={() => onBookEmergencyDoctor(doctor)}
              >
                <Text style={styles.bookEmergencyBtnText}>
                  Book Priority Token
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Emergency Notice */}
        <View style={styles.noticeBox}>
          <ShieldCheck size={18} color={colors.emerald700} />
          <Text style={styles.noticeText}>
            For critical, life-threatening trauma or accidents, please call 102 or proceed immediately to the nearest District Hospital emergency ward.
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
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
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 4,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.rose50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 5,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.rose700,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  hotlinesRow: {
    flexDirection: "row",
    gap: 12,
  },
  ambulanceCard: {
    flex: 1,
    backgroundColor: colors.rose600,
    padding: 14,
    borderRadius: radius.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...shadows.soft,
  },
  ambulanceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  hospitalCard: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: radius.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...shadows.soft,
  },
  hospitalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  hotlineTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
  hotlineNumber: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  sectionHeaderRow: {
    marginTop: 4,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  doctorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  doctorAvatar: {
    width: 46,
    height: 46,
    borderRadius: radius.xl,
    backgroundColor: colors.rose50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.rose100,
  },
  doctorDetails: {
    flex: 1,
    gap: 2,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  openPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 3,
  },
  openPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald600,
  },
  openPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.emerald800,
  },
  clinicAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clinicAddressText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  callClinicBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 6,
  },
  callClinicBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  bookEmergencyBtn: {
    flex: 1.6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.rose600,
    ...shadows.soft,
  },
  bookEmergencyBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  noticeBox: {
    flexDirection: "row",
    backgroundColor: colors.emerald50,
    padding: 12,
    borderRadius: radius.xl,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.emerald100,
    alignItems: "flex-start",
  },
  noticeText: {
    fontSize: 11,
    color: colors.emerald900,
    lineHeight: 16,
    flex: 1,
  },
});
