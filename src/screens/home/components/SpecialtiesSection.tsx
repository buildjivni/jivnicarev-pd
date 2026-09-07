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
  ChevronRight,
} from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

interface SpecialtiesSectionProps {
  onSelectSpecialty?: (specialty: string) => void;
  onPressSeeAll?: () => void;
}

const WEB_SPECIALTIES = [
  { id: "1", name: "General Physician", icon: "Stethoscope" },
  { id: "2", name: "Dentist", icon: "Sparkles" },
  { id: "3", name: "Dermatologist", icon: "Sparkles" },
  { id: "4", name: "Gynecologist", icon: "HeartPulse" },
  { id: "5", name: "Pediatrician", icon: "Baby" },
  { id: "6", name: "Orthopedic", icon: "Bone" },
  { id: "7", name: "ENT Specialist", icon: "Ear" },
  { id: "8", name: "Ophthalmologist", icon: "Eye" },
  { id: "9", name: "Cardiologist", icon: "HeartPulse" },
  { id: "10", name: "Neurologist", icon: "Brain" },
  { id: "11", name: "Gastroenterologist", icon: "Activity" },
  { id: "12", name: "Urologist", icon: "Droplets" },
  { id: "13", name: "Pulmonologist", icon: "Wind" },
  { id: "14", name: "Nephrologist", icon: "Pill" },
  { id: "15", name: "Oncologist", icon: "Ribbon" },
];

const renderIcon = (name: string) => {
  const props = { size: 22, color: colors.primary, strokeWidth: 2.2 };
  switch (name) {
    case "Stethoscope":
      return <Stethoscope {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
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
            Explore 30+ medical specialties
          </Text>
        </View>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onPressSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={colors.primary} strokeWidth={2.5} />
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
            <Text style={styles.itemLabel} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    width: 74,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    ...shadows.soft,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 14,
  },
});
