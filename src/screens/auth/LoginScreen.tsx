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
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { ArrowRight, ShieldCheck, MessageCircle } from "lucide-react-native";
import { colors, typography, radius, shadows } from "../../theme";

interface LoginScreenProps {
  onSendOtp: (phone: string) => void;
  onGoogleLogin?: () => void;
  onSkip?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSendOtp,
  onGoogleLogin,
  onSkip,
}) => {
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!agreed) {
      setError(
        "Please agree to the Terms of Service, Privacy Policy, and Beta Notice to continue."
      );
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSendOtp(cleaned);
    }, 400);
  };

  const handleOpenLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      // Fallback
    }
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
          {/* ── Top Header with Real Web Brand Logo ── */}
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <Image
                source={require("../../../assets/brand/primary-logo/primary logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.betaBadge}>
                <Text style={styles.betaBadgeText}>BETA</Text>
              </View>
            </View>

            {onSkip && (
              <TouchableOpacity
                onPress={onSkip}
                style={styles.skipButton}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Headline Block (Exact Web Copy) ── */}
          <View style={styles.headlineBlock}>
            <Text style={styles.headlineTitle}>Welcome</Text>
            <Text style={styles.headlineSubtitle}>
              Enter your mobile number to receive a WhatsApp OTP or continue
              with Google.
            </Text>
          </View>

          {/* ── Error Banner ── */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* ── Phone Input Form ── */}
          <View style={styles.formContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>WHATSAPP NUMBER</Text>
              <View style={styles.whatsappPill}>
                <MessageCircle size={12} color="#047857" />
                <Text style={styles.whatsappPillText}>WhatsApp OTP</Text>
              </View>
            </View>

            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="98765 43210"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/\D/g, ""));
                  if (error) setError(null);
                }}
              />
            </View>

            {/* Consent Checkbox */}
            <TouchableOpacity
              style={styles.consentRow}
              onPress={() => {
                setAgreed(!agreed);
                if (error) setError(null);
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  agreed ? styles.checkboxChecked : null,
                ]}
              >
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                I understand JivniCare is in an early testing/pilot phase and
                agree to the{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => handleOpenLink("https://jivnicare.com/terms")}
                >
                  Terms of Service
                </Text>
                ,{" "}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    handleOpenLink("https://jivnicare.com/privacy")
                  }
                >
                  Privacy Policy
                </Text>
                , and{" "}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    handleOpenLink("https://jivnicare.com/beta-notice")
                  }
                >
                  Beta Notice
                </Text>
                .
              </Text>
            </TouchableOpacity>

            {/* Primary Action Button (Web: Send WhatsApp OTP) */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                phone.length === 10 && agreed
                  ? styles.primaryButtonActive
                  : styles.primaryButtonDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={loading || phone.length < 10 || !agreed}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    Send WhatsApp OTP
                  </Text>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orDividerRow}>
              <View style={styles.orDividerLine} />
              <Text style={styles.orDividerText}>OR CONTINUE WITH</Text>
              <View style={styles.orDividerLine} />
            </View>

            {/* Google OAuth Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={onGoogleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.googleIconText}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer Trust Tagline ── */}
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
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 140,
    height: 36,
  },
  betaBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  betaBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: "#F1F5F9",
  },
  skipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  headlineBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  headlineTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headlineSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
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
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
    ...shadows.card,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  whatsappPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.xs,
    gap: 4,
  },
  whatsappPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#047857",
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 54,
  },
  countryCodeBox: {
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#CBD5E1",
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
    marginBottom: 18,
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  consentText: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    gap: 8,
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
  orDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 10,
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  orDividerText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    height: 48,
    borderRadius: radius.md,
    gap: 10,
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#4285F4",
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
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
