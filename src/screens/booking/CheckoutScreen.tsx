import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  User,
  Phone,
  Calendar,
  AlertCircle,
  CreditCard,
  Banknote,
  Stethoscope,
} from "lucide-react-native";
import { Doctor } from "../../types/doctor";
import { useAuthStore } from "../../store/useAuthStore";
import { useBookingStore, GeneratedToken } from "../../store/useBookingStore";
import { colors, radius, shadows } from "../../theme";

interface CheckoutScreenProps {
  doctor: Doctor;
  onPressBack: () => void;
  onBookingSuccess: (token: GeneratedToken) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  doctor,
  onPressBack,
  onBookingSuccess,
}) => {
  const { user } = useAuthStore();
  const { addActiveBooking } = useBookingStore();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [problem, setProblem] = useState("");
  const [paymentMode, setPaymentMode] = useState<"CASH" | "ONLINE">("CASH");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee =
    typeof doctor.consultationFee === "number"
      ? `₹${doctor.consultationFee}`
      : doctor.fee || "₹500";

  const handleConfirmBooking = () => {
    if (!name.trim()) {
      setError("Please enter patient's full name");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!age.trim() || isNaN(Number(age))) {
      setError("Please enter a valid age");
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const randomTokenNum = Math.floor(Math.random() * 10) + 12;
      const newToken: GeneratedToken = {
        id: `tok_${Date.now()}`,
        tokenNumber: randomTokenNum,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        clinicName: doctor.clinicName || "City Health Clinic",
        clinicAddress: doctor.clinicAddress || "Main Hospital Road, Jamui",
        currentTokenNumber: Math.max(1, randomTokenNum - 4),
        patientsAhead: 4,
        estimatedWaitMinutes: 20,
        paymentMode: paymentMode,
        status: "WAITING",
        isEmergency: false,
        bookedAt: new Date().toISOString(),
        patientName: name.trim(),
        patientPhone: phone.trim(),
        fee: fee,
      };

      addActiveBooking(newToken);
      onBookingSuccess(newToken);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Navigation Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Confirm OPD Token</Text>
        <View style={styles.securePill}>
          <ShieldCheck size={14} color={colors.emerald600} />
          <Text style={styles.securePillText}>100% Safe</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Doctor Brief Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorAvatar}>
              <Stethoscope size={24} color={colors.primary} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <Text style={styles.clinicName} numberOfLines={1}>
                {doctor.clinicName || "City Health Clinic"}
              </Text>
            </View>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={colors.rose600} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form: Patient Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Patient Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Patient Full Name *</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Rahul Kumar"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (error) setError(null);
                  }}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number (for SMS & WhatsApp) *</Text>
              <View style={styles.inputWrapper}>
                <Phone size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (error) setError(null);
                  }}
                />
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Age *</Text>
                <TextInput
                  style={[styles.textInput, styles.borderedInput]}
                  placeholder="e.g. 28"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={3}
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1.4 }]}>
                <Text style={styles.inputLabel}>Gender *</Text>
                <View style={styles.genderRow}>
                  {["Male", "Female", "Other"].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderChip,
                        gender === g && styles.genderChipActive,
                      ]}
                      onPress={() => setGender(g)}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          gender === g && styles.genderChipTextActive,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Health Problem / Symptoms (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. Fever, cough for 2 days"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={problem}
                onChangeText={setProblem}
              />
            </View>
          </View>

          {/* Payment Method Selector */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Select Payment Option</Text>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMode === "CASH" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMode("CASH")}
            >
              <Banknote
                size={22}
                color={paymentMode === "CASH" ? colors.primary : colors.textMuted}
              />
              <View style={styles.paymentTextWrapper}>
                <Text style={styles.paymentOptionTitle}>
                  Pay at Clinic (Cash / UPI)
                </Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Zero advance needed — pay directly at the doctor's counter
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  paymentMode === "CASH" && styles.radioCircleActive,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMode === "ONLINE" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMode("ONLINE")}
            >
              <CreditCard
                size={22}
                color={paymentMode === "ONLINE" ? colors.primary : colors.textMuted}
              />
              <View style={styles.paymentTextWrapper}>
                <Text style={styles.paymentOptionTitle}>Pay Online (Instant Token)</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  UPI (GPay, PhonePe, Paytm) & Cards
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  paymentMode === "ONLINE" && styles.radioCircleActive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Bill Summary */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Consultation Fee</Text>
              <Text style={styles.summaryValue}>{fee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Zero-Wait Booking Fee</Text>
              <Text style={styles.freeBadge}>FREE (Beta)</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>{fee}</Text>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Confirmation Action */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarSummary}>
          <Text style={styles.bottomBarFeeLabel}>Total Amount</Text>
          <Text style={styles.bottomBarFeeValue}>{fee}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.buttonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>Book Token Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  securePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.emerald100,
  },
  securePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.emerald700,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  doctorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: colors.primary50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  doctorInfo: {
    flex: 1,
    gap: 2,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  clinicName: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.rose50,
    padding: 12,
    borderRadius: radius.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.rose100,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.rose700,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  borderedInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 12,
  },
  genderRow: {
    flexDirection: "row",
    gap: 6,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  genderChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  genderChipTextActive: {
    color: "#FFFFFF",
  },
  textArea: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: 12,
    height: 70,
    textAlignVertical: "top",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary50,
  },
  paymentTextWrapper: {
    flex: 1,
    gap: 2,
  },
  paymentOptionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  paymentOptionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  radioCircleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  freeBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.emerald600,
    backgroundColor: colors.emerald50,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.elevated,
  },
  bottomBarSummary: {
    gap: 2,
  },
  bottomBarFeeLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  bottomBarFeeValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: radius.full,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
