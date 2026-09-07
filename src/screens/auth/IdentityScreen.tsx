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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  MapPin,
  Hash,
  Mail,
  Calendar,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react-native";
import { colors, radius, shadows } from "../../theme";

interface IdentityScreenProps {
  phone: string;
  onSaveProfile: (profileData: {
    name: string;
    location: string;
    pincode?: string;
    email?: string;
    dob: string;
    gender: string;
    address: string;
  }) => void;
  onBack: () => void;
}

export const IdentityScreen: React.FC<IdentityScreenProps> = ({
  phone,
  onSaveProfile,
  onBack,
}) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("1995-05-15");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!location.trim()) {
      setError("Please enter your city or village name");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSaveProfile({
        name,
        location,
        pincode,
        email,
        dob,
        gender,
        address,
      });
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headlineBlock}>
            <Text style={styles.headlineTitle}>Complete Your Profile</Text>
            <Text style={styles.headlineSubtitle}>
              Verified <Text style={styles.phoneHighlight}>+91 {phone}</Text> —
              add your details
            </Text>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <View style={styles.inputBox}>
                <User size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Your Name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (error) setError(null);
                  }}
                />
              </View>
            </View>

            {/* City / Village */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CITY / VILLAGE NAME</Text>
              <View style={styles.inputBox}>
                <MapPin size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your city or village"
                  placeholderTextColor={colors.textMuted}
                  value={location}
                  onChangeText={(t) => {
                    setLocation(t);
                    if (error) setError(null);
                  }}
                />
              </View>
            </View>

            {/* PIN Code */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                PIN CODE{" "}
                <Text style={styles.optionalText}>(optional)</Text>
              </Text>
              <View style={styles.inputBox}>
                <Hash size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 811307"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                EMAIL{" "}
                <Text style={styles.optionalText}>(optional)</Text>
              </Text>
              <View style={styles.inputBox}>
                <Mail size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="you@email.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Date of Birth & Gender Row */}
            <View style={styles.twoColRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
                <View style={styles.inputBox}>
                  <Calendar size={18} color={colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textMuted}
                    value={dob}
                    onChangeText={setDob}
                  />
                </View>
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>GENDER</Text>
                <View style={styles.genderOptions}>
                  {["Male", "Female"].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderChip,
                        gender === g ? styles.genderChipActive : null,
                      ]}
                      onPress={() => setGender(g)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          gender === g ? styles.genderChipTextActive : null,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FULL ADDRESS</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Street / Ward / Landmark"
                  placeholderTextColor={colors.textMuted}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                name.trim() && location.trim()
                  ? styles.primaryButtonActive
                  : styles.primaryButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading || !name.trim() || !location.trim()}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Save & Continue</Text>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <View style={styles.trustBadge}>
              <ShieldCheck size={16} color="#059669" />
              <Text style={styles.trustBadgeText}>
                Your information is safe and secure
              </Text>
            </View>
            <Text style={styles.copyrightText}>
              © 2026 JivniCare • Made with ❤️ in Bharat
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  headlineBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  headlineTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headlineSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    marginTop: 6,
  },
  phoneHighlight: {
    fontWeight: "800",
    color: colors.primary,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#991B1B",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
    ...shadows.card,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  optionalText: {
    fontWeight: "500",
    color: colors.textMuted,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderOptions: {
    flexDirection: "row",
    gap: 6,
    height: 48,
    alignItems: "center",
  },
  genderChip: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  genderChipActive: {
    borderColor: colors.primary,
    backgroundColor: "#EFF6FF",
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  genderChipTextActive: {
    color: colors.primary,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    gap: 8,
    marginTop: 10,
    ...shadows.button,
  },
  primaryButtonActive: {
    opacity: 1,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textWhite,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  copyrightText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
