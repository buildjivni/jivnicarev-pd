import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  LayoutGrid,
  Stethoscope,
  Sparkles,
  HeartPulse,
  Baby,
  Bone,
  Ear,
  Eye,
  Syringe,
  Brain,
  Dumbbell,
  BrainCircuit,
  Activity,
  Droplets,
  Wind,
  FlaskConical,
  Pill,
  Ribbon,
  Accessibility,
  UtensilsCrossed,
  UserRound,
  Scissors,
  Leaf,
  Droplet,
  Siren,
  ChevronRight,
} from "lucide-react-native";
import { colors, typography, radius } from "../../../theme";

export interface SpecialtyItem {
  id: string;
  name: string;
  shortName: string;
  hindiName: string;
  iconName: string;
  bg: string;
  accent: string;
  border: string;
}

/**
 * All 30 specialties from web `src/lib/constants/specialties.ts`
 * Using systematic non-adjacent color distribution
 */
export const ALL_SPECIALTIES_CAROUSEL: SpecialtyItem[] = [
  {
    id: "all",
    name: "All Specialities",
    shortName: "All",
    hindiName: "Sabhi Rog",
    iconName: "LayoutGrid",
    bg: "#F1F5F9",
    accent: "#1B3F6B",
    border: "rgba(27, 63, 107, 0.15)",
  },
  {
    id: "general-physician",
    name: "General Physician",
    shortName: "Physician",
    hindiName: "Aam Rog",
    iconName: "Stethoscope",
    bg: "#EFF6FF",
    accent: "#0284C7",
    border: "rgba(2, 132, 199, 0.20)",
  },
  {
    id: "dentist",
    name: "Dentist",
    shortName: "Dentist",
    hindiName: "Daant Rog",
    iconName: "Sparkles",
    bg: "#F0FDFA",
    accent: "#0D9488",
    border: "rgba(13, 148, 136, 0.20)",
  },
  {
    id: "dermatologist-cosmetologist",
    name: "Dermatologist",
    shortName: "Skin",
    hindiName: "Twacha Rog",
    iconName: "Sparkles",
    bg: "#FAF5FF",
    accent: "#7C3AED",
    border: "rgba(124, 58, 237, 0.20)",
  },
  {
    id: "gynecologist-obstetrician",
    name: "Gynecologist",
    shortName: "Gynecology",
    hindiName: "Mahila Rog",
    iconName: "HeartPulse",
    bg: "#FFF1F2",
    accent: "#E11D48",
    border: "rgba(225, 29, 72, 0.20)",
  },
  {
    id: "pediatrician",
    name: "Pediatrician",
    shortName: "Child",
    hindiName: "Shishu Rog",
    iconName: "Baby",
    bg: "#FFFBEB",
    accent: "#D97706",
    border: "rgba(217, 119, 6, 0.20)",
  },
  {
    id: "orthopedic-surgeon",
    name: "Orthopedic",
    shortName: "Bones",
    hindiName: "Haddi Rog",
    iconName: "Bone",
    bg: "#EEF2FF",
    accent: "#4F46E5",
    border: "rgba(79, 70, 229, 0.20)",
  },
  {
    id: "ent-specialist",
    name: "ENT Specialist",
    shortName: "ENT",
    hindiName: "Kaan Naak",
    iconName: "Ear",
    bg: "#ECFEFF",
    accent: "#0891B2",
    border: "rgba(8, 145, 178, 0.20)",
  },
  {
    id: "ophthalmologist",
    name: "Ophthalmologist",
    shortName: "Eye",
    hindiName: "Aankh Rog",
    iconName: "Eye",
    bg: "#ECFDF5",
    accent: "#059669",
    border: "rgba(5, 150, 105, 0.20)",
  },
  {
    id: "cardiologist",
    name: "Cardiologist",
    shortName: "Heart",
    hindiName: "Dil Rog",
    iconName: "HeartPulse",
    bg: "#FEF2F2",
    accent: "#DC2626",
    border: "rgba(220, 38, 38, 0.20)",
  },
  {
    id: "diabetologist",
    name: "Diabetologist",
    shortName: "Diabetes",
    hindiName: "Sugar Rog",
    iconName: "Syringe",
    bg: "#FFF7ED",
    accent: "#EA580C",
    border: "rgba(234, 88, 12, 0.20)",
  },
  {
    id: "psychiatrist-psychologist",
    name: "Psychiatrist",
    shortName: "Mind",
    hindiName: "Mansik",
    iconName: "Brain",
    bg: "#FDF2F8",
    accent: "#C026D3",
    border: "rgba(192, 38, 211, 0.20)",
  },
  {
    id: "physiotherapist",
    name: "Physiotherapy",
    shortName: "Physio",
    hindiName: "Exercise",
    iconName: "Dumbbell",
    bg: "#F7FEE7",
    accent: "#65A30D",
    border: "rgba(101, 163, 13, 0.20)",
  },
  {
    id: "neurologist",
    name: "Neurologist",
    shortName: "Brain",
    hindiName: "Nas Rog",
    iconName: "BrainCircuit",
    bg: "#F5F3FF",
    accent: "#7E22CE",
    border: "rgba(126, 34, 206, 0.20)",
  },
  {
    id: "gastroenterologist",
    name: "Gastroenterology",
    shortName: "Stomach",
    hindiName: "Pet Rog",
    iconName: "Activity",
    bg: "#FEFCE8",
    accent: "#CA8A04",
    border: "rgba(202, 138, 4, 0.20)",
  },
  {
    id: "urologist",
    name: "Urologist",
    shortName: "Urology",
    hindiName: "Mutra Rog",
    iconName: "Droplets",
    bg: "#F0F9FF",
    accent: "#0284C7",
    border: "rgba(2, 132, 199, 0.20)",
  },
  {
    id: "pulmonologist",
    name: "Pulmonologist",
    shortName: "Lungs",
    hindiName: "Fefda Rog",
    iconName: "Wind",
    bg: "#FFF1F2",
    accent: "#BE123C",
    border: "rgba(190, 18, 60, 0.20)",
  },
  {
    id: "endocrinologist",
    name: "Endocrinologist",
    shortName: "Hormone",
    hindiName: "Thyroid",
    iconName: "FlaskConical",
    bg: "#FAF5FF",
    accent: "#9333EA",
    border: "rgba(147, 51, 234, 0.20)",
  },
  {
    id: "nephrologist",
    name: "Nephrologist",
    shortName: "Kidney",
    hindiName: "Kidney Rog",
    iconName: "Pill",
    bg: "#ECFDF5",
    accent: "#047857",
    border: "rgba(4, 120, 87, 0.20)",
  },
  {
    id: "oncologist",
    name: "Oncologist",
    shortName: "Cancer",
    hindiName: "Cancer",
    iconName: "Ribbon",
    bg: "#FEF2F2",
    accent: "#B91C1C",
    border: "rgba(185, 28, 28, 0.20)",
  },
  {
    id: "rheumatologist",
    name: "Rheumatologist",
    shortName: "Joints",
    hindiName: "Gathiya",
    iconName: "Accessibility",
    bg: "#FFF7ED",
    accent: "#C2410C",
    border: "rgba(194, 65, 12, 0.20)",
  },
  {
    id: "dietitian-nutritionist",
    name: "Dietitian",
    shortName: "Diet",
    hindiName: "Aahar",
    iconName: "UtensilsCrossed",
    bg: "#F0FDF4",
    accent: "#16A34A",
    border: "rgba(22, 163, 74, 0.20)",
  },
  {
    id: "sexologist",
    name: "Sexologist",
    shortName: "Sexology",
    hindiName: "Gupt Rog",
    iconName: "UserRound",
    bg: "#FDF2F8",
    accent: "#DB2777",
    border: "rgba(219, 39, 119, 0.20)",
  },
  {
    id: "hair-skin-specialist",
    name: "Hair & Skin",
    shortName: "Trichology",
    hindiName: "Baal Twacha",
    iconName: "Scissors",
    bg: "#F5F3FF",
    accent: "#6D28D9",
    border: "rgba(109, 40, 217, 0.20)",
  },
  {
    id: "ayurvedic-doctor",
    name: "Ayurveda",
    shortName: "Ayurveda",
    hindiName: "Ayurvedic",
    iconName: "Leaf",
    bg: "#F0FDF4",
    accent: "#15803D",
    border: "rgba(21, 128, 61, 0.20)",
  },
  {
    id: "homeopathic-doctor",
    name: "Homeopathy",
    shortName: "Homeopathy",
    hindiName: "Homeopathy",
    iconName: "Droplet",
    bg: "#ECFEFF",
    accent: "#0E7490",
    border: "rgba(14, 116, 144, 0.20)",
  },
  {
    id: "general-surgeon",
    name: "General Surgeon",
    shortName: "Surgeon",
    hindiName: "Surgery",
    iconName: "Activity",
    bg: "#EFF6FF",
    accent: "#1D4ED8",
    border: "rgba(29, 78, 216, 0.20)",
  },
  {
    id: "pediatric-specialist",
    name: "Child Specialist",
    shortName: "Pediatrics",
    hindiName: "Bacho Ke",
    iconName: "Baby",
    bg: "#FFFBEB",
    accent: "#B45309",
    border: "rgba(180, 83, 9, 0.20)",
  },
  {
    id: "internal-medicine",
    name: "Internal Medicine",
    shortName: "Medicine",
    hindiName: "Chikitsa",
    iconName: "Stethoscope",
    bg: "#F0F9FF",
    accent: "#0369A1",
    border: "rgba(3, 105, 161, 0.20)",
  },
  {
    id: "emergency-medicine",
    name: "Emergency",
    shortName: "Emergency",
    hindiName: "Aapatkaleen",
    iconName: "Siren",
    bg: "#FEF2F2",
    accent: "#E11D48",
    border: "rgba(225, 29, 72, 0.20)",
  },
];

interface PatientSpecialtiesRailProps {
  onSelectSpecialty?: (specialty: SpecialtyItem) => void;
  onPressSeeAll?: () => void;
}

const renderVectorIcon = (iconName: string, color: string, size = 22) => {
  const props = { size, color, strokeWidth: 2.2 };
  switch (iconName) {
    case "LayoutGrid":
      return <LayoutGrid {...props} />;
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
    case "Syringe":
      return <Syringe {...props} />;
    case "Brain":
      return <Brain {...props} />;
    case "Dumbbell":
      return <Dumbbell {...props} />;
    case "BrainCircuit":
      return <BrainCircuit {...props} />;
    case "Activity":
      return <Activity {...props} />;
    case "Droplets":
      return <Droplets {...props} />;
    case "Wind":
      return <Wind {...props} />;
    case "FlaskConical":
      return <FlaskConical {...props} />;
    case "Pill":
      return <Pill {...props} />;
    case "Ribbon":
      return <Ribbon {...props} />;
    case "Accessibility":
      return <Accessibility {...props} />;
    case "UtensilsCrossed":
      return <UtensilsCrossed {...props} />;
    case "UserRound":
      return <UserRound {...props} />;
    case "Scissors":
      return <Scissors {...props} />;
    case "Leaf":
      return <Leaf {...props} />;
    case "Droplet":
      return <Droplet {...props} />;
    case "Siren":
      return <Siren {...props} />;
    default:
      return <Stethoscope {...props} />;
  }
};

export const PatientSpecialtiesRail: React.FC<PatientSpecialtiesRailProps> = ({
  onSelectSpecialty,
  onPressSeeAll,
}) => {
  return (
    <View style={styles.container}>
      {/* ── Section Header ── */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Popular Specialities</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressSeeAll}
          style={styles.seeAllButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={colors.primary} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* ── Squircles Specialty Carousel ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ALL_SPECIALTIES_CAROUSEL.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.82}
            onPress={() => onSelectSpecialty && onSelectSpecialty(item)}
            style={styles.itemWrapper}
          >
            {/* Medical Squircle Container */}
            <View
              style={[
                styles.iconSquircle,
                {
                  backgroundColor: item.bg,
                  borderColor: item.border,
                },
              ]}
            >
              {renderVectorIcon(item.iconName, item.accent, 22)}
            </View>

            {/* Clean 2-Line Formatted Label */}
            <Text style={styles.labelText} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Hindi Subtitle */}
            <Text style={styles.hindiText} numberOfLines={1}>
              {item.hindiName}
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
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.navy,
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(86, 150, 199, 0.15)",
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
  itemWrapper: {
    width: 76,
    alignItems: "center",
  },
  iconSquircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 14,
    minHeight: 28,
  },
  hindiText: {
    fontSize: 9.5,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 1,
  },
});
