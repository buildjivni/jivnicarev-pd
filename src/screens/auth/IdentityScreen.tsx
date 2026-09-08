import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  User,
  Calendar,
  ChevronDown,
  ArrowLeft,
  Check,
  BookUser,
  MapPin,
} from "lucide-react-native";
import { updateProfileApi } from "../../api/authApi";

const { width } = Dimensions.get("window");

interface IdentityScreenProps {
  phone: string;
  initialName?: string;
  token?: string;
  onSaveProfile: (profileData: {
    name: string;
    age: string;
    gender: "Male" | "Female" | "Other";
    address: string;
    pincode: string;
  }) => Promise<void> | void;
  onSkip?: () => void;
  onBack?: () => void;
}

// ── Custom Gender Icon matching Reference ──
const GenderSymbolIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4.5" stroke="#64748B" strokeWidth={1.8} />
    <Path d="M12 7.5V2.5M9.5 4.5h5" stroke="#64748B" strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M15.5 15.5l4 4M19.5 15.5v4h-4" stroke="#64748B" strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

// ── User Lock Icon ──
const UserLockIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="#64748B"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="9"
      cy="7"
      r="4"
      stroke="#64748B"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="15"
      y="11"
      width="8"
      height="6"
      rx="1.2"
      stroke="#64748B"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 11V9a2 2 0 0 1 4 0v2"
      stroke="#64748B"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IdentityScreen: React.FC<IdentityScreenProps> = ({
  phone,
  initialName = "",
  token,
  onSaveProfile,
  onSkip,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(initialName);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [address, setAddress] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (!age.trim() || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("Please enter a valid age (1-120)");
      return;
    }

    const safeAddress = address.trim() || "Jamui, Bihar";
    setError(null);
    setLoading(true);

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - ageNum;
    const approximateDob = `${birthYear}-01-01`;

    try {
      await updateProfileApi({
        name: name.trim(),
        gender,
        dateOfBirth: approximateDob,
        address: safeAddress,
        location: safeAddress,
        pincode: "811307",
      });
    } catch {
      // Continue even if network error so patient isn't stuck
    }

    setLoading(false);
    await onSaveProfile({
      name: name.trim(),
      age: age.trim(),
      gender,
      address: safeAddress,
      pincode: "811307",
    });
  };

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── Top Hero: Realistic Patient Smartphone Banner ── */}
          <View style={styles.heroContainer}>
            <Image
              source={require("../../../assets/images/patient_profile_real.jpg")}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Seamless Bottom Gradient Fade into Card */}
            <View style={styles.gradientOverlay}>
              <Svg width={width} height={90} viewBox="0 0 400 90" fill="none">
                <Defs>
                  <LinearGradient id="profileHeroFade" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#F8FAFC" stopOpacity={0} />
                    <Stop offset="70%" stopColor="#F1F5F9" stopOpacity={0.6} />
                    <Stop offset="100%" stopColor="#F1F5F9" stopOpacity={1} />
                  </LinearGradient>
                </Defs>
                <Rect width="400" height="90" fill="url(#profileHeroFade)" />
              </Svg>
            </View>

            {/* Frosted Back Button Top-Left */}
            <View style={[styles.topBarRow, { paddingTop: Math.max(insets.top + 6, 24) }]}>
              {onBack ? (
                <TouchableOpacity
                  onPress={onBack}
                  style={styles.frostedBackButton}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 40 }} />
              )}
            </View>
          </View>

          {/* ── Floating Setup Profile Card (Natural Overlap) ── */}
          <View style={styles.cardContainer}>
            <View style={styles.profileCard}>
              <Text style={styles.cardTitle}>Set up your profile</Text>
              <Text style={styles.cardSubtitle}>
                Add a few details to get started
              </Text>

              {/* Field 1: Full Name */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === "name" && styles.inputRowFocused,
                  ]}
                >
                  <User size={18} color="#64748B" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(val) => {
                      setName(val);
                      if (error) setError(null);
                    }}
                  />
                </View>
              </View>

              {/* Field 2: Age */}
              <View style={styles.fieldBlock}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={styles.fieldLabel}>Age</Text>
                  <Text style={styles.fieldHelperLabel}>For doctor's prescription</Text>
                </View>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === "age" && styles.inputRowFocused,
                  ]}
                >
                  <Calendar size={18} color="#64748B" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter patient age (e.g. 28)"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={3}
                    value={age}
                    onFocus={() => setFocusedField("age")}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(val) => {
                      setAge(val);
                      if (error) setError(null);
                    }}
                  />
                </View>
              </View>

              {/* Field 3: Gender Dropdown */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <TouchableOpacity
                  style={styles.inputRow}
                  onPress={() => setShowGenderModal(true)}
                  activeOpacity={0.7}
                >
                  <GenderSymbolIcon />
                  <Text
                    style={[
                      styles.textInput,
                      styles.pickerText,
                      !gender && { color: "#94A3B8" },
                    ]}
                  >
                    {gender || "Select gender"}
                  </Text>
                  <ChevronDown size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Field 4: Address */}
              <View style={styles.fieldBlock}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={styles.fieldLabel}>Location / Address</Text>
                  <Text style={styles.fieldHelperLabel}>Optional</Text>
                </View>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === "address" && styles.inputRowFocused,
                  ]}
                >
                  <BookUser size={18} color="#64748B" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Locality / Village / Area"
                    placeholderTextColor="#94A3B8"
                    value={address}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(val) => {
                      setAddress(val);
                      if (error) setError(null);
                    }}
                  />
                </View>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueBtn,
                  loading && styles.continueBtnDisabled,
                ]}
                onPress={handleContinue}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.continueBtnText}>Continue</Text>
                )}
              </TouchableOpacity>

              {/* Skip for now text link */}
              {onSkip && (
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={onSkip}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipBtnText}>Skip</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1, minHeight: 30 }} />

          {/* ── Footer Trust Section ── */}
          <View style={[styles.footerSection, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
            <View style={styles.trustBadgeRow}>
              <UserLockIcon />
              <Text style={styles.trustBadgeText}>
                Your health profile is strictly confidential & private
              </Text>
            </View>
            <Text style={styles.copyrightText}>
              © 2026 <Text style={styles.brandAccent}>JivniCare</Text> • Made with{" "}
              <Text style={{ color: "#EF4444" }}>❤️</Text> in Bharat
            </Text>
          </View>
        </ScrollView>

        {/* Gender Selection Bottom Sheet Modal */}
        <Modal
          visible={showGenderModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowGenderModal(false)}
          >
            <View style={styles.genderModalContent}>
              <Text style={styles.genderModalTitle}>Select Gender</Text>
              {(["Male", "Female", "Other"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderOptionRow,
                    gender === g && styles.genderOptionRowActive,
                  ]}
                  onPress={() => {
                    setGender(g);
                    setShowGenderModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      gender === g && styles.genderOptionTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                  {gender === g && (
                    <Check size={18} color="#1B3F6B" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  heroContainer: {
    position: "relative",
    width: width,
    height: 275,
    backgroundColor: "#E2E8F0",
  },
  heroImage: {
    width: width,
    height: 275,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  topBarRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    zIndex: 20,
  },
  frostedBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(27, 63, 107, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContainer: {
    paddingHorizontal: 18,
    marginTop: -40,
    zIndex: 30,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  fieldBlock: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  fieldHelperLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inputRowFocused: {
    borderColor: "#5696C7",
    backgroundColor: "#FFFFFF",
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    height: "100%",
  },
  pickerText: {
    lineHeight: 52,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EF4444",
    marginBottom: 10,
    marginLeft: 4,
  },
  continueBtn: {
    backgroundColor: "#1B3F6B",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  continueBtnDisabled: {
    opacity: 0.7,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  skipBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 6,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  footerSection: {
    alignItems: "center",
    gap: 8,
  },
  trustBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  copyrightText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  brandAccent: {
    color: "#0284C7",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  genderModalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  genderModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },
  genderOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  genderOptionRowActive: {
    backgroundColor: "#EFF6FF",
  },
  genderOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  genderOptionTextActive: {
    color: "#1B3F6B",
    fontWeight: "700",
  },
});

