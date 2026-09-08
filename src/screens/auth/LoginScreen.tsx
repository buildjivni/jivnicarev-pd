import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
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
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { ArrowLeft, Check, Mail, ShieldCheck } from "lucide-react-native";
import { sendEmailOtpApi } from "../../api/authApi";
import { getApiBaseUrl } from "../../api/client";

try {
  WebBrowser.maybeCompleteAuthSession();
} catch {}

const { width } = Dimensions.get("window");

interface LoginScreenProps {
  onSendEmailCode?: (email: string) => void;
  onSendOtp?: (target: string, sessionId?: string) => void;
  onGoogleSuccess: (data: { token: string; user: any; needsProfile: boolean }) => void;
  onSkip?: () => void;
  onBack?: () => void;
}

// ── Google 4-Color Icon ──
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

// ── Trust Lock Icon ──
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

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSendEmailCode,
  onSendOtp,
  onGoogleSuccess,
  onSkip,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const emailInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSendEmail = async () => {
    if (!agreed) {
      setError("Please agree to the Terms of Service, Privacy Policy, and Beta Notice.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com)");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await sendEmailOtpApi(cleanEmail);
      setLoading(false);
      if (res.success) {
        if (onSendEmailCode) {
          onSendEmailCode(cleanEmail);
        } else if (onSendOtp) {
          onSendOtp(cleanEmail);
        }
      } else {
        setError(res.error || "Could not send verification code. Please check your email.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network connection error. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    if (!agreed) {
      setError("Please agree to the Terms of Service, Privacy Policy, and Beta Notice.");
      return;
    }
    setError(null);
    setGoogleLoading(true);

    try {
      const redirectUrl = Linking.createURL("auth-callback");
      const authUrl = `${getApiBaseUrl()}/api/auth/mobile-start?flow=patient&redirect_uri=${encodeURIComponent(
        redirectUrl
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const token = (parsed.queryParams?.token as string) || "";
        const userId = (parsed.queryParams?.userId as string) || "";
        const name = (parsed.queryParams?.name as string) || "Patient";
        const emailParam = (parsed.queryParams?.email as string) || "";
        const needsProfile = parsed.queryParams?.needsProfile === "true";

        if (token) {
          onGoogleSuccess({
            token,
            user: {
              id: userId || `pat_${Date.now()}`,
              name,
              email: emailParam,
              role: "PATIENT",
            },
            needsProfile,
          });
          return;
        } else {
          setError("Google authentication was incomplete. Please try again.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleOpenTerms = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://www.jivnicare.com/terms");
    } catch {}
  };

  const handleOpenPrivacy = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://www.jivnicare.com/privacy");
    } catch {}
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
          {/* ── Top Hero: Authentic Doctor Team Banner ── */}
          <View style={styles.heroContainer}>
            <Image
              source={require("../../../assets/images/doctors_team_real.jpg")}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Seamless Bottom Gradient Fade into Card */}
            <View style={styles.gradientOverlay}>
              <Svg width={width} height={90} viewBox="0 0 400 90" fill="none">
                <Defs>
                  <LinearGradient id="heroFade" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#F8FAFC" stopOpacity={0} />
                    <Stop offset="70%" stopColor="#F1F5F9" stopOpacity={0.6} />
                    <Stop offset="100%" stopColor="#F1F5F9" stopOpacity={1} />
                  </LinearGradient>
                </Defs>
                <Rect width="400" height="90" fill="url(#heroFade)" />
              </Svg>
            </View>

            {/* Top Navigation Row: Back & Skip */}
            <View style={[styles.topBarRow, { paddingTop: Math.max(insets.top + 6, 24) }]}>
              {onBack ? (
                <TouchableOpacity
                  onPress={onBack}
                  style={styles.frostedBackButton}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <ArrowLeft size={20} color="#1B3F6B" strokeWidth={2.5} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 44 }} />
              )}

              {onSkip && (
                <TouchableOpacity
                  onPress={onSkip}
                  style={styles.skipButton}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Skip sign-in"
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Floating Modern Login Card ── */}
          <View style={styles.cardContainer}>
            <View style={styles.loginCard}>
              <Text style={styles.cardTitle}>Welcome to JivniCare</Text>
              <Text style={styles.cardSubtitle}>
                Sign in with Google or Email to manage your OPD appointments & live queue
              </Text>

              {/* ── 1-TAP GOOGLE OAUTH PRIMARY ACTION ── */}
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleLogin}
                disabled={googleLoading || loading}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
              >
                {googleLoading ? (
                  <ActivityIndicator color="#1B3F6B" size="small" />
                ) : (
                  <>
                    <View style={styles.googleIconBox}>
                      <GoogleIcon />
                    </View>
                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* ── DIVIDER: Or continue with email ── */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR SIGN IN WITH EMAIL</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ── EMAIL INPUT & SUBMIT ── */}
              <View style={{ width: "100%" }}>
                <Pressable
                  onPress={() => emailInputRef.current?.focus()}
                  style={[
                    styles.emailInputRow,
                    isFocused && styles.emailInputRowFocused,
                    error ? styles.emailInputRowError : null,
                  ]}
                >
                  <View style={styles.mailIconBox}>
                    <Mail size={18} color="#1B3F6B" strokeWidth={2.2} />
                  </View>

                  <TextInput
                    ref={emailInputRef}
                    style={styles.textInput}
                    placeholder="Enter your email (e.g. name@example.com)"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    returnKeyType="send"
                    onSubmitEditing={handleSendEmail}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError(null);
                    }}
                  />
                </Pressable>

                {/* Primary Email Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.sendEmailBtn,
                    (loading || !email.trim()) && styles.sendEmailBtnDisabled,
                  ]}
                  onPress={handleSendEmail}
                  disabled={loading || !email.trim()}
                  activeOpacity={0.88}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Email"
                >
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={styles.sendEmailBtnText}>Sending code...</Text>
                    </View>
                  ) : (
                    <Text style={styles.sendEmailBtnText}>Continue with Email</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Error Banner */}
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* ── Terms & Privacy Consent Checkbox ── */}
              <View style={styles.termsWrapper}>
                <TouchableOpacity
                  style={styles.checkboxTouchable}
                  onPress={() => setAgreed(!agreed)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: agreed }}
                >
                  <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                    {agreed && <Check size={12} color="#FFFFFF" strokeWidth={3.5} />}
                  </View>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  I agree to JivniCare's{" "}
                  <Text style={styles.termsLink} onPress={handleOpenTerms}>
                    Terms of Service
                  </Text>
                  ,{" "}
                  <Text style={styles.termsLink} onPress={handleOpenPrivacy}>
                    Privacy Policy
                  </Text>
                  , and{" "}
                  <Text style={styles.termsLink} onPress={handleOpenTerms}>
                    Beta Notice
                  </Text>
                  .
                </Text>
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1, minHeight: 30 }} />

          {/* ── Footer Trust Section ── */}
          <View style={[styles.footerSection, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
            <View style={styles.trustBadgeRow}>
              <UserLockIcon />
              <Text style={styles.trustBadgeText}>
                Protected with secure data transmission • Private & Confidential
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
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
  skipButton: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(27, 63, 107, 0.16)",
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  skipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1B3F6B",
    letterSpacing: 0.2,
  },
  cardContainer: {
    paddingHorizontal: 18,
    marginTop: -42,
    zIndex: 20,
  },
  loginCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 26,
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  googleBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(27, 63, 107, 0.16)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  googleIconBox: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },
  emailInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    height: 54,
    paddingHorizontal: 14,
    width: "100%",
  },
  emailInputRowFocused: {
    borderColor: "#5696C7",
    backgroundColor: "#FFFFFF",
    shadowColor: "#5696C7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  emailInputRowError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  mailIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F0F7FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    height: "100%",
  },
  sendEmailBtn: {
    backgroundColor: "#1B3F6B",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    shadowColor: "#1B3F6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  sendEmailBtnDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sendEmailBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
    textAlign: "center",
    lineHeight: 16,
  },
  termsWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 18,
    width: "100%",
    gap: 10,
  },
  checkboxTouchable: {
    paddingTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#1B3F6B",
    borderColor: "#1B3F6B",
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    fontWeight: "500",
  },
  termsLink: {
    color: "#1B3F6B",
    fontWeight: "700",
    textDecorationLine: "underline",
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
    fontSize: 11.5,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
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
