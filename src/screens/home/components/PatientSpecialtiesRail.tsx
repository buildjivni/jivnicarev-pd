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
  Baby,
  Bone,
  Ear,
  Eye,
  HeartPulse,
  Syringe,
  Brain,
  BrainCircuit,
  Activity,
  Droplets,
  Wind,
  Pill,
  Ribbon,
  Salad,
  Scissors,
  Leaf,
  Droplet,
  Users,
  Siren,
  ChevronRight,
  Flame,
  Landmark,
  TreePine,
  Flower2,
  Accessibility,
  UserRound,
  FlaskConical,
  UtensilsCrossed,
  Dumbbell,
} from "lucide-react-native";
import { colors, typography, radius } from "../../../theme";

export interface SpecialtyItem {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
}

/**
 * Exact 30 items matching web `src/lib/constants/specialties.ts` getSpecialtyCarouselItems()
 */
export const ALL_SPECIALTIES_CAROUSEL: SpecialtyItem[] = [
  { id: "all-specialities", name: "All Specialities", shortName: "All Specialities", iconName: "layout-grid" },
  { id: "general-physician", name: "General Physician", shortName: "General Physician", iconName: "stethoscope" },
  { id: "dentist", name: "Dentist", shortName: "Dentist", iconName: "sparkles" },
  { id: "dermatologist-cosmetologist", name: "Dermatologist & Cosmetologist", shortName: "Dermatologist", iconName: "sparkles" },
  { id: "gynecologist-obstetrician", name: "Gynecologist & Obstetrician", shortName: "Gynecology", iconName: "users" },
  { id: "pediatrician", name: "Pediatrician", shortName: "Pediatrics", iconName: "baby" },
  { id: "orthopedic-surgeon", name: "Orthopedic Surgeon", shortName: "Orthopedic", iconName: "bone" },
  { id: "ent-specialist", name: "ENT Specialist", shortName: "ENT", iconName: "ear" },
  { id: "ophthalmologist", name: "Ophthalmologist", shortName: "Ophthalmology", iconName: "eye" },
  { id: "cardiologist", name: "Cardiologist", shortName: "Cardiology", iconName: "heart-pulse" },
  { id: "diabetologist", name: "Diabetologist", shortName: "Diabetology", iconName: "syringe" },
  { id: "psychiatrist-psychologist", name: "Psychiatrist & Psychologist", shortName: "Psychiatry", iconName: "brain" },
  { id: "physiotherapist", name: "Physiotherapist", shortName: "Physiotherapy", iconName: "dumbbell" },
  { id: "neurologist", name: "Neurologist", shortName: "Neurology", iconName: "brain-circuit" },
  { id: "gastroenterologist", name: "Gastroenterologist", shortName: "Gastroenterology", iconName: "utensils" },
  { id: "urologist", name: "Urologist", shortName: "Urology", iconName: "droplets" },
  { id: "pulmonologist", name: "Pulmonologist", shortName: "Pulmonology", iconName: "wind" },
  { id: "endocrinologist", name: "Endocrinologist", shortName: "Endocrinology", iconName: "flask" },
  { id: "nephrologist", name: "Nephrologist", shortName: "Nephrology", iconName: "pill" },
  { id: "oncologist", name: "Oncologist", shortName: "Oncology", iconName: "ribbon" },
  { id: "rheumatologist", name: "Rheumatologist", shortName: "Rheumatology", iconName: "accessibility" },
  { id: "dietitian-nutritionist", name: "Dietitian & Nutritionist", shortName: "Nutrition", iconName: "salad" },
  { id: "sexologist", name: "Sexologist", shortName: "Sexology", iconName: "flame" },
  { id: "hair-skin-specialist", name: "Hair & Skin Specialist", shortName: "Hair & Skin", iconName: "scissors" },
  { id: "ayurvedic-doctor", name: "Ayurvedic Doctor", shortName: "Ayurveda", iconName: "leaf" },
  { id: "homeopathic-doctor", name: "Homeopathic Doctor", shortName: "Homeopathy", iconName: "droplet" },
  { id: "unani-specialist", name: "Unani Specialist", shortName: "Unani", iconName: "landmark" },
  { id: "siddha-specialist", name: "Siddha Specialist", shortName: "Siddha", iconName: "treepine" },
  { id: "naturopath", name: "Naturopath", shortName: "Naturopathy", iconName: "flower" },
  { id: "geriatrician", name: "Geriatrician", shortName: "Geriatrics", iconName: "user-round" },
  { id: "emergency-medicine-specialist", name: "Emergency Medicine Specialist", shortName: "Emergency", iconName: "siren" },
];

function getSpecialtyIcon(iconName: string) {
  const iconProps = { size: 22, color: colors.primary, strokeWidth: 2 };
  switch (iconName) {
    case "layout-grid":
      return <LayoutGrid {...iconProps} />;
    case "stethoscope":
      return <Stethoscope {...iconProps} />;
    case "baby":
      return <Baby {...iconProps} />;
    case "bone":
      return <Bone {...iconProps} />;
    case "ear":
      return <Ear {...iconProps} />;
    case "eye":
      return <Eye {...iconProps} />;
    case "heart-pulse":
      return <HeartPulse {...iconProps} color="#E11D48" />;
    case "syringe":
      return <Syringe {...iconProps} />;
    case "brain":
      return <Brain {...iconProps} />;
    case "brain-circuit":
      return <BrainCircuit {...iconProps} />;
    case "dumbbell":
      return <Dumbbell {...iconProps} />;
    case "utensils":
      return <UtensilsCrossed {...iconProps} />;
    case "droplets":
      return <Droplets {...iconProps} />;
    case "wind":
      return <Wind {...iconProps} />;
    case "flask":
      return <FlaskConical {...iconProps} />;
    case "pill":
      return <Pill {...iconProps} />;
    case "ribbon":
      return <Ribbon {...iconProps} />;
    case "accessibility":
      return <Accessibility {...iconProps} />;
    case "salad":
      return <Salad {...iconProps} />;
    case "flame":
      return <Flame {...iconProps} color="#EA580C" />;
    case "scissors":
      return <Scissors {...iconProps} />;
    case "leaf":
      return <Leaf {...iconProps} color={colors.secondary} />;
    case "droplet":
      return <Droplet {...iconProps} />;
    case "landmark":
      return <Landmark {...iconProps} />;
    case "treepine":
      return <TreePine {...iconProps} />;
    case "flower":
      return <Flower2 {...iconProps} />;
    case "user-round":
      return <UserRound {...iconProps} />;
    case "siren":
      return <Siren {...iconProps} color={colors.destructive} />;
    case "users":
      return <Users {...iconProps} color="#BE185D" />;
    case "sparkles":
    default:
      return <Sparkles {...iconProps} />;
  }
}

export interface PatientSpecialtiesRailProps {
  onSelectSpecialty?: (specialty: SpecialtyItem) => void;
  onPressSeeAll?: () => void;
}

export const PatientSpecialtiesRail: React.FC<PatientSpecialtiesRailProps> = ({
  onSelectSpecialty,
  onPressSeeAll,
}) => {
  return (
    <View style={styles.container}>
      {/* ── SECTION HEADER (Matching web: "Popular Specialities" + "See All →") ── */}
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>Popular Specialities</Text>
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={onPressSeeAll}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── HORIZONTAL SCROLLING SPECIALTY CAROUSEL ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {ALL_SPECIALTIES_CAROUSEL.map((spec) => (
          <TouchableOpacity
            key={spec.id}
            style={styles.specialtyCard}
            onPress={() => onSelectSpecialty?.(spec)}
            activeOpacity={0.75}
          >
            <View style={styles.iconCircle}>
              {getSpecialtyIcon(spec.iconName)}
            </View>
            <Text style={styles.specialtyLabel} numberOfLines={2}>
              {spec.shortName}
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
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleText: {
    ...typography.titleMedium,
    fontSize: 18,
    fontWeight: "900",
    color: colors.navy,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  seeAllText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  specialtyCard: {
    alignItems: "center",
    width: 76,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F9FF",
    borderWidth: 1.5,
    borderColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  specialtyLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 14,
  },
});
