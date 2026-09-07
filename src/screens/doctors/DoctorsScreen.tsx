import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  AlertCircle,
  Stethoscope,
  ChevronDown,
} from "lucide-react-native";
import { DoctorCard } from "../../components/shared/DoctorCard";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";
import { Doctor } from "../../types/doctor";
import { colors, radius, shadows, typography } from "../../theme";

interface DoctorsScreenProps {
  initialSpecialty?: string;
  initialQuery?: string;
  onPressDoctor: (doctor: Doctor) => void;
  onPressBook: (doctor: Doctor) => void;
  onPressBack?: () => void;
}

const ALL_SPECIALTIES = [
  "All",
  "General Physician",
  "Dentist",
  "Dermatologist",
  "Gynecologist",
  "Pediatrician",
  "Orthopedic",
  "ENT Specialist",
  "Ophthalmologist",
  "Cardiologist",
  "Neurologist",
  "Gastroenterologist",
  "Urologist",
  "Pulmonologist",
];

const MOCK_DOCTOR_LIST: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 128,
    clinicName: "Jamui City OPD & Clinic",
    clinicAddress: "Main Hospital Road, Jamui",
    consultationFee: 500,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-2",
    name: "Dr. Sneha Verma",
    specialty: "Pediatrician",
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 94,
    clinicName: "Shishu Kalyan Clinic",
    clinicAddress: "Station Road, Jamui",
    consultationFee: 400,
    emergencyAvailable: false,
    isEmergencySupported: false,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-3",
    name: "Dr. Amit Roy",
    specialty: "Cardiologist",
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 210,
    clinicName: "Roy Heart Center",
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
    specialty: "Gynecologist",
    experienceYears: 11,
    rating: 4.8,
    reviewCount: 156,
    clinicName: "Matri Seva Hospital",
    clinicAddress: "Court Road, Jamui",
    consultationFee: 600,
    emergencyAvailable: true,
    isEmergencySupported: true,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-5",
    name: "Dr. Manoj Gupta",
    specialty: "Orthopedic",
    experienceYears: 14,
    rating: 4.7,
    reviewCount: 88,
    clinicName: "Bone & Joint Care",
    clinicAddress: "Hospital Road, Jamui",
    consultationFee: 500,
    emergencyAvailable: false,
    isEmergencySupported: false,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-6",
    name: "Dr. Kavita Singh",
    specialty: "Dermatologist",
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 112,
    clinicName: "Glow Skin & Laser Clinic",
    clinicAddress: "Main Market, Jamui",
    consultationFee: 450,
    emergencyAvailable: false,
    isEmergencySupported: false,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
  {
    id: "doc-7",
    name: "Dr. Vivek Anand",
    specialty: "Dentist",
    experienceYears: 10,
    rating: 4.8,
    reviewCount: 76,
    clinicName: "Smile Dental Care",
    clinicAddress: "Station Road, Jamui",
    consultationFee: 350,
    emergencyAvailable: false,
    isEmergencySupported: false,
    availabilityStatus: "AVAILABLE",
    isAcceptingBookings: true,
  },
];

export const DoctorsScreen: React.FC<DoctorsScreenProps> = ({
  initialSpecialty,
  initialQuery = "",
  onPressDoctor,
  onPressBook,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    initialSpecialty || "All"
  );
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const { selectedDistrict, setIsLocationSheetVisible } =
    usePatientLocationStore();

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTOR_LIST.filter((doc) => {
      const matchSearch =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.clinicName &&
          doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSpecialty =
        selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

      const matchEmergency = !emergencyOnly || doc.emergencyAvailable;

      return matchSearch && matchSpecialty && matchEmergency;
    });
  }, [searchQuery, selectedSpecialty, emergencyOnly]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctor, clinic or specialty..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* District Filter Trigger */}
        <TouchableOpacity
          style={styles.districtBadge}
          onPress={() => setIsLocationSheetVisible(true)}
        >
          <MapPin size={13} color={colors.primary} />
          <Text style={styles.districtBadgeText}>{selectedDistrict}</Text>
          <ChevronDown size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Specialties Horizontal Scroll Rail */}
      <View style={styles.specialtiesRailWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ALL_SPECIALTIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.specialtiesList}
          renderItem={({ item }) => {
            const isSelected = selectedSpecialty === item;
            return (
              <TouchableOpacity
                style={[
                  styles.specialtyChip,
                  isSelected && styles.specialtyChipActive,
                ]}
                onPress={() => setSelectedSpecialty(item)}
              >
                <Text
                  style={[
                    styles.specialtyChipText,
                    isSelected && styles.specialtyChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Filter Info & Emergency Toggle Bar */}
      <View style={styles.filterMetaRow}>
        <Text style={styles.resultsCountText}>
          {filteredDoctors.length} {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Available in {selectedDistrict}
        </Text>
        <TouchableOpacity
          style={[
            styles.emergencyToggle,
            emergencyOnly && styles.emergencyToggleActive,
          ]}
          onPress={() => setEmergencyOnly(!emergencyOnly)}
        >
          <Text
            style={[
              styles.emergencyToggleText,
              emergencyOnly && styles.emergencyToggleTextActive,
            ]}
          >
            {emergencyOnly ? "Emergency Only" : "All OPD"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Doctors FlatList */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorsListContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <DoctorCard
              doctor={item}
              onPress={() => onPressDoctor(item)}
              onBook={() => onPressBook(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AlertCircle size={44} color={colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No doctors found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your search query or selecting a different specialty or district.
            </Text>
            <TouchableOpacity
              style={styles.clearFiltersBtn}
              onPress={() => {
                setSearchQuery("");
                setSelectedSpecialty("All");
                setEmergencyOnly(false);
              }}
            >
              <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  districtBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  districtBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  specialtiesRailWrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  specialtiesList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  specialtyChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  specialtyChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  specialtyChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCountText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  emergencyToggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emergencyToggleActive: {
    backgroundColor: colors.rose50,
    borderColor: colors.rose300,
  },
  emergencyToggleText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
  emergencyToggleTextActive: {
    color: colors.rose600,
  },
  doctorsListContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 90,
  },
  cardContainer: {
    marginBottom: 16,
  },
  emptyState: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  clearFiltersBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  clearFiltersBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
