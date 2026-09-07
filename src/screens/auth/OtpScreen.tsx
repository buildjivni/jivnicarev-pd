import React, { useState, useRef, useEffect } from "react";
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
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react-native";
import { colors, radius, shadows } from "../../theme";

interface OtpScreenProps {
  phone: string;
  onVerifySuccess: () => void;
  onBack: () => void;
  onResendOtp?: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  phone,
  onVerifySuccess,
  onBack,
  onResendOtp,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (error) setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    if (onResendOtp) onResendOtp();
  };

  const handleVerify = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerifySuccess();
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
          {/* Top Back Action */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Headline */}
          <View style={styles.headlineBlock}>
            <Text style={styles.headlineTitle}>Verify WhatsApp OTP</Text>
            <Text style={styles.headlineSubtitle}>
              We sent a 6-digit code to{" "}
              <Text style={styles.phoneHighlight}>+91 {phone}</Text>
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.formContainer}>
            <Text style={styles.inputPrompt}>ENTER 6-DIGIT CODE</Text>

            <View style={styles.otpBoxesRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                    error ? styles.otpBoxError : null,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Resend Action */}
            <View style={styles.resendRow}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                  <Text style={styles.resendAction}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                </Text>
              )}
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                otp.join("").length === 6
                  ? styles.primaryButtonActive
                  : styles.primaryButtonDisabled,
              ]}
              onPress={handleVerify}
              disabled={loading || otp.join("").length !== 6}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Verify & Sign In</Text>
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
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  topRow: {
    marginBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headlineBlock: {
    alignItems: "center",
    marginBottom: 24,
  },
  headlineTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headlineSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    marginTop: 6,
    textAlign: "center",
  },
  phoneHighlight: {
    fontWeight: "700",
    color: colors.navy,
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
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
    ...shadows.card,
  },
  inputPrompt: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 16,
  },
  otpBoxesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    fontSize: 20,
    fontWeight: "800",
    color: colors.navy,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
  },
  otpBoxError: {
    borderColor: colors.destructive,
  },
  resendRow: {
    alignItems: "center",
    marginBottom: 20,
  },
  resendAction: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  timerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
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
