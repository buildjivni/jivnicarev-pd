import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Stethoscope,
  Sparkles,
  HeartPulse,
  Baby,
  Bone,
  Ear,
  Eye,
  Brain,
  Activity,
  Droplets,
  Wind,
  Pill,
  Ribbon,
  ScanFace,
  ChevronRight,
} from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

interface SpecialtiesSectionProps {
  onSelectSpecialty?: (specialty: string) => void;
  onPressSeeAll?: () => void;
}

const WEB_SPECIALTIES = [
  { id: "1", name: "General Physician", hindi: "Samanya Dekhbhal", icon: "Stethoscope" },
  { id: "2", name: "Dentist", hindi: "Daanton ki Care", icon: "Sparkles" },
  { id: "3", name: "Dermatologist", hindi: "Twacha ki Care", icon: "ScanFace" },
  { id: "4", name: "Gynecologist", hindi: "Mahila Swasthya", icon: "HeartPulse" },
  { id: "5", name: "Pediatrician", hindi: "Bachhon ki Care", icon: "Baby" },
  { id: "6", name: "Orthopedic", hindi: "Haddi & Jod", icon: "Bone" },
  { id: "7", name: "ENT Specialist", hindi: "Kaan Naak Gala", icon: "Ear" },
  { id: "8", name: "Ophthalmologist", hindi: "Aankhon ki Care", icon: "Eye" },
  { id: "9", name: "Cardiologist", hindi: "Dil ki Dekhbhal", icon: "HeartPulse" },
  { id: "10", name: "Neurologist", hindi: "Dimag & Nas", icon: "Brain" },
  { id: "11", name: "Gastroenterologist", hindi: "Pet ki Dekhbhal", icon: "Activity" },
  { id: "12", name: "Urologist", hindi: "Kidney & Mutra", icon: "Droplets" },
  { id: "13", name: "Pulmonologist", hindi: "Saans & Fefde", icon: "Wind" },
  { id: "14", name: "Nephrologist", hindi: "Kidney Care", icon: "Pill" },
  { id: "15", name: "Oncologist", hindi: "Cancer Care", icon: "Ribbon" },
];

const renderIcon = (name: string) => {
  const props = { size: 21, color: colors.primary, strokeWidth: 2.1 };
  switch (name) {
    case "Stethoscope":
      return <Stethoscope {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "ScanFace":
      return <ScanFace {...props} />;
    case "HeartPulse":
      return <HeartPulse {...props} />;
    case "Baby":
      return <Baby {...props} />;
    case "Bone":
      return <Bone {...props} />;
    case "Ear":
      return <Ear {...props} />;
    case "Eye":
      return <Eye {...props} />;
    case "Brain":
      return <Brain {...props} />;
    case "Activity":
      return <Activity {...props} />;
    case "Droplets":
      return <Droplets {...props} />;
    case "Wind":
      return <Wind {...props} />;
    case "Pill":
      return <Pill {...props} />;
    case "Ribbon":
      return <Ribbon {...props} />;
    default:
      return <Stethoscope {...props} />;
  }
};

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  onSelectSpecialty,
  onPressSeeAll,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Popular Specialities</Text>
          <Text style={styles.sectionSubtitle}>
            Explore 30+ verified medical specialties
          </Text>
        </View>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onPressSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={13} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {WEB_SPECIALTIES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => onSelectSpecialty && onSelectSpecialty(item.name)}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>{renderIcon(item.icon)}</View>
            <Text style={styles.itemLabel} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemHindi} numberOfLines={1}>
              {item.hindi}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.navy, // #0F172A
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary, // #475569
    fontWeight: "500",
    marginTop: 1,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: radius.full,
    gap: 2,
  },
  seeAllText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    width: 84,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F7FC",
    borderWidth: 1,
    borderColor: "#DCECF8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    ...shadows.soft,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.navy, // #0F172A
    textAlign: "center",
    lineHeight: 14,
  },
  itemHindi: {
    fontSize: 9.5,
    color: colors.textSecondary, // #475569
    textAlign: "center",
    marginTop: 1,
  },
});
