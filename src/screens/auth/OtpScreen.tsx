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
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  ArrowLeft,
  Edit3,
  ShieldCheck,
  Smartphone,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Mail,
} from "lucide-react-native";
import {
  verifyOtpApi,
  sendOtpApi,
  verifyEmailOtpApi,
  sendEmailOtpApi,
  VerifyOtpResult,
} from "../../api/authApi";

const { width } = Dimensions.get("window");

interface OtpScreenProps {
  phone?: string;
  email?: string;
  sessionId?: string;
  onVerifySuccess: (result?: VerifyOtpResult) => void;
  onBack: () => void;
  onResendOtp?: () => void;
}

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

export const OtpScreen: React.FC<OtpScreenProps> = ({
  phone,
  email,
  sessionId,
  onVerifySuccess,
  onBack,
  onResendOtp,
}) => {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState(60); // 60-second debounce visual countdown
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  const inputRef = useRef<TextInput>(null);

  const isEmailMode = Boolean(email || (phone && phone.includes("@")));
  const target = (email || phone || "").trim();
  const formattedTarget = isEmailMode
    ? target
    : target.length === 10
    ? `+91 ${target.slice(0, 5)} ${target.slice(5)}`
    : `+91 ${target}`;

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

  // Subtle pulsing blinking cursor for current active cell
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 550);
    return () => clearInterval(cursorInterval);
  }, []);

  // Core verification function
  const executeVerify = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6 || loading) return;
    setError(null);
    setLoading(true);

    try {
      if (isEmailMode) {
        const res = await verifyEmailOtpApi(target, codeToVerify);
        setLoading(false);

        if (res.success && res.data) {
          onVerifySuccess(res.data);
        } else {
          setError(res.error || "Invalid or expired verification code. Please check and try again.");
        }
      } else {
        const activeSessionId = sessionId || `session_${Date.now()}`;
        const res = await verifyOtpApi(target, codeToVerify, activeSessionId);
        setLoading(false);

        if (res.success && res.data) {
          onVerifySuccess(res.data);
        } else {
          setError(res.error || "Invalid or expired OTP code. Please check and try again.");
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error while verifying code. Please try again.");
    }
  };

  const handleOtpChange = (value: string) => {
    const cleanDigits = value.replace(/\D/g, "").slice(0, 6);
    setOtp(cleanDigits);
    if (error) setError(null);

    // Auto-verify when 6 digits are completely entered
    if (cleanDigits.length === 6) {
      executeVerify(cleanDigits);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(60); // 60s debounce enforced
    setCanResend(false);
    setOtp("");
    setError(null);

    inputRef.current?.focus();

    if (isEmailMode) {
      setResendStatus("New verification code sent to your email.");
      setTimeout(() => setResendStatus(null), 4000);

      try {
        const res = await sendEmailOtpApi(target);
        if (!res.success) {
          setError(res.error || "Could not send verification code. Please check your email.");
        }
      } catch (err: any) {
        setError(err.message || "Network error. Please try again.");
      }
    } else {
      setResendStatus("OTP requested via SMS.");
      setTimeout(() => setResendStatus(null), 4000);

      try {
        const res = await sendOtpApi(target);
        if (!res.success) {
          setError(res.error || "Could not deliver OTP. Please verify your number.");
        }
      } catch (err: any) {
        setError(err.message || "Network error. Please try again.");
      }
    }
    if (onResendOtp) onResendOtp();
  };

  const isComplete = otp.length === 6;

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
          keyboardShouldPersistTaps="always"
          bounces={false}
        >
          {/* ── Top Hero: Realistic Doctor Verification Hero ── */}
          <View style={styles.heroContainer}>
            <Image
              source={require("../../../assets/images/doctor_otp_real.jpg")}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Seamless Bottom Gradient Fade into Screen Background */}
            <View style={styles.gradientOverlay}>
              <Svg width={width} height={90} viewBox="0 0 400 90" fill="none">
                <Defs>
                  <LinearGradient id="otpHeroFade" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#F8FAFC" stopOpacity={0} />
                    <Stop offset="65%" stopColor="#F1F5F9" stopOpacity={0.7} />
                    <Stop offset="100%" stopColor="#F1F5F9" stopOpacity={1} />
                  </LinearGradient>
                </Defs>
                <Rect width="400" height="90" fill="url(#otpHeroFade)" />
              </Svg>
            </View>

            {/* Frosted Back Button Top-Left (Matches LoginScreen) */}
            <View style={[styles.topBarRow, { paddingTop: Math.max(insets.top + 6, 24) }]}>
              <TouchableOpacity
                onPress={onBack}
                style={styles.frostedBackButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={20} color="#1B3F6B" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Floating Modern OTP Card ── */}
          <View style={styles.cardContainer}>
            <View style={styles.otpCard}>
              {/* Header Row: Title & Trust Badge */}
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>
                  {isEmailMode ? "Verify Email" : "Verify Mobile"}
                </Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={13} color="#059669" strokeWidth={2.5} />
                  <Text style={styles.verifiedBadgeText}>256-bit Secure</Text>
                </View>
              </View>

              <Text style={styles.cardSubtitle}>
                {isEmailMode
                  ? "Please enter the 6-digit verification code sent to your email address."
                  : "Please enter the 6-digit verification code sent to your registered mobile."}
              </Text>

              {/* Contact Pill with Quick Edit Button */}
              <View style={styles.phonePillCard}>
                <View style={styles.phoneLeft}>
                  <View style={styles.phoneIconBox}>
                    {isEmailMode ? (
                      <Mail size={15} color="#1B3F6B" strokeWidth={2.2} />
                    ) : (
                      <Smartphone size={15} color="#1B3F6B" strokeWidth={2.2} />
                    )}
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.phonePillLabel}>
                      {isEmailMode ? "Sent to email" : "Sent to mobile"}
                    </Text>
                    <Text
                      style={styles.phoneHighlight}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {formattedTarget}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={onBack}
                  style={styles.editPhoneBtn}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={isEmailMode ? "Change email" : "Change phone number"}
                >
                  <Edit3 size={13} color="#1B3F6B" strokeWidth={2.2} />
                  <Text style={styles.editPhoneText}>Change</Text>
                </TouchableOpacity>
              </View>

              {/* 6 OTP Boxes with Single Rock-Solid Native Input (No focus jumping or keyboard dismiss) */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                style={styles.otpBoxesWrapper}
              >
                {/* Native TextInput overlaid with 0.01 opacity so taps immediately focus it and keyboard stays up */}
                <TextInput
                  ref={inputRef}
                  value={otp}
                  onChangeText={handleOtpChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  autoFocus={true}
                  caretHidden={true}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  style={styles.hiddenNativeInput}
                  accessibilityLabel="6 digit verification code"
                />

                <View style={styles.otpBoxesRow} pointerEvents="none">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = otp[index] || "";
                    const isCurrent =
                      isInputFocused &&
                      (otp.length === index || (index === 5 && otp.length === 6));
                    const isFilled = digit.length > 0;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpBoxWrapper,
                          isCurrent && styles.otpBoxWrapperActive,
                        ]}
                      >
                        <View
                          style={[
                            styles.otpBox,
                            isFilled && styles.otpBoxFilled,
                            isCurrent && styles.otpBoxFocused,
                            error ? styles.otpBoxError : null,
                          ]}
                        >
                          {digit ? (
                            <Text
                              style={[
                                styles.otpBoxText,
                                isFilled && styles.otpBoxTextFilled,
                              ]}
                            >
                              {digit}
                            </Text>
                          ) : isCurrent && cursorVisible ? (
                            <View style={styles.blinkingCursor} />
                          ) : (
                            <View style={styles.placeholderDot} />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>

              {/* Resend Success Toast */}
              {resendStatus && (
                <View style={styles.statusToast}>
                  <CheckCircle2 size={14} color="#059669" />
                  <Text style={styles.statusToastText}>{resendStatus}</Text>
                </View>
              )}

              {/* Error Banner */}
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Anti-fraud Security Notice */}
              <View style={styles.securityAlertBox}>
                <ShieldAlert size={14} color="#D97706" strokeWidth={2} />
                <Text style={styles.securityAlertText}>
                  Never share this code. JivniCare will never call or message to request your OTP.
                </Text>
              </View>

              {/* Verify & Continue Button */}
              <TouchableOpacity
                style={[
                  styles.verifyBtn,
                  (!isComplete || loading) && styles.verifyBtnDisabled,
                ]}
                onPress={() => executeVerify(otp)}
                disabled={!isComplete || loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.verifyBtnText}>Verifying securely...</Text>
                  </View>
                ) : (
                  <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
                )}
              </TouchableOpacity>

              {/* Resend OTP Section */}
              <View style={styles.resendSection}>
                {canResend ? (
                  <View style={styles.resendActionsCol}>
                    <Text style={styles.didNotReceiveText}>Didn't receive the code?</Text>
                    <TouchableOpacity
                      onPress={handleResend}
                      style={styles.resendActionBtn}
                      activeOpacity={0.75}
                    >
                      <RotateCcw size={14} color="#1B3F6B" strokeWidth={2.2} />
                      <Text style={styles.resendActionBtnText}>
                        {isEmailMode ? "Resend Code to Email" : "Resend Code via SMS"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.timerPill}>
                    <RotateCcw size={13} color="#64748B" />
                    <Text style={styles.timerText}>
                      Resend code in{" "}
                      <Text style={styles.timerBold}>
                        00:{timer < 10 ? `0${timer}` : timer}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1, minHeight: 24 }} />

          {/* ── Footer Trust Section ── */}
          <View style={[styles.footerSection, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
            <View style={styles.trustBadgeRow}>
              <UserLockIcon />
              <Text style={styles.trustBadgeText}>
                Protected with healthcare-grade data safety
              </Text>
            </View>
            <Text style={styles.copyrightText}>
              © 2026 <Text style={styles.brandAccent}>JivniCare</Text> • Made with{" "}
              <Text style={{ color: "#EF4444" }}>❤️</Text> in Bharat
            </Text>
          </View>
        </ScrollView>
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
    height: 280,
    backgroundColor: "#E2E8F0",
  },
  heroImage: {
    width: width,
    height: 280,
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
    paddingHorizontal: 20,
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
    marginTop: -42,
    zIndex: 30,
  },
  otpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(27, 63, 107, 0.08)",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 18,
  },
  phonePillCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(27, 63, 107, 0.08)",
  },
  phoneLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  phoneIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F0F7FD",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(86, 150, 199, 0.2)",
  },
  phonePillLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  phoneHighlight: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.3,
  },
  editPhoneBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F0F7FD",
    borderWidth: 1,
    borderColor: "rgba(27, 63, 107, 0.12)",
  },
  editPhoneText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B3F6B",
  },
  otpBoxesWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 14,
  },
  hiddenNativeInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.01,
    color: "transparent",
    zIndex: 10,
  },
  otpBoxesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpBoxWrapper: {
    flex: 1,
    borderRadius: 14,
  },
  otpBoxWrapperActive: {
    shadowColor: "#5696C7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  otpBox: {
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  otpBoxFocused: {
    borderColor: "#5696C7",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
  },
  otpBoxFilled: {
    borderColor: "#1B3F6B",
    backgroundColor: "#F0F7FD",
  },
  otpBoxError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  otpBoxText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  otpBoxTextFilled: {
    color: "#1B3F6B",
  },
  blinkingCursor: {
    width: 2.5,
    height: 24,
    backgroundColor: "#1B3F6B",
    borderRadius: 1.5,
  },
  placeholderDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#CBD5E1",
  },
  statusToast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  statusToastText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
    textAlign: "center",
  },
  errorActionBtn: {
    marginTop: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    alignSelf: "center",
  },
  errorActionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DC2626",
  },
  securityAlertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.25)",
  },
  securityAlertText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: "#92400E",
    lineHeight: 16,
  },
  verifyBtn: {
    backgroundColor: "#1B3F6B",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  verifyBtnDisabled: {
    opacity: 0.55,
    shadowOpacity: 0.1,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  resendSection: {
    marginTop: 18,
    alignItems: "center",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  timerBold: {
    fontWeight: "800",
    color: "#0F172A",
  },
  resendActionsCol: {
    alignItems: "center",
    width: "100%",
  },
  didNotReceiveText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 8,
  },
  resendActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0F7FD",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(27, 63, 107, 0.12)",
  },
  resendActionBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1B3F6B",
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
    color: "#1B3F6B",
    fontWeight: "700",
  },
});
