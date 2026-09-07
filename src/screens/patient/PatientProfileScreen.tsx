import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Heart,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useBookingStore } from "../../store/useBookingStore";
import { usePatientLocationStore } from "../../store/usePatientLocationStore";
import { colors, radius, shadows, typography } from "../../theme";

interface PatientProfileScreenProps {
  onNavigateHome: () => void;
  onNavigateDoctors: () => void;
  onLogoutSuccess: () => void;
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  onNavigateHome,
  onNavigateDoctors,
  onLogoutSuccess,
}) => {
  const { user, updateUser, logout } = useAuthStore();
  const { activeBookings } = useBookingStore();
  const { savedDoctorIds } = usePatientLocationStore();

  const [name, setName] = useState(user?.name || "Rahul Kumar");
  const [phone, setPhone] = useState(user?.phone || "9876543210");
  const [email, setEmail] = useState(user?.email || "rahul.kumar@jivnicare.com");
  const [address, setAddress] = useState(
    user?.address || "Station Road, Jamui, Bihar"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = () => {
    updateUser({
      name,
      phone,
      email,
      address,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleOpenLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      // Ignored
    }
  };

  const handleLogoutPrompt = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out from JivniCare?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            logout();
            onLogoutSuccess();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patient Account</Text>
        <Text style={styles.headerSubtitle}>
          Manage your personal details and app settings
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLetter}>
              {name.charAt(0).toUpperCase() || "P"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userPhone}>+91 {phone}</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color={colors.emerald700} />
              <Text style={styles.verifiedBadgeText}>Verified Patient</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeBookings.length}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{savedDoctorIds.length}</Text>
            <Text style={styles.statLabel}>Saved Doctors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Zero Wait</Text>
          </View>
        </View>

        {/* Success Alert */}
        {saveSuccess && (
          <View style={styles.successBox}>
            <CheckCircle2 size={16} color={colors.emerald700} />
            <Text style={styles.successText}>
              Profile details updated successfully!
            </Text>
          </View>
        )}

        {/* Profile Details Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <Text style={styles.editActionText}>
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={styles.fieldValue}>{name}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>+91 {phone}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{email || "Not specified"}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Primary Address & District</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={address}
                onChangeText={setAddress}
              />
            ) : (
              <Text style={styles.fieldValue}>{address}</Text>
            )}
          </View>
        </View>

        {/* Legal & App Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support & Policies</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => handleOpenLink("https://jivnicare.com/help-support")}
          >
            <View style={styles.menuIconWrapper}>
              <HelpCircle size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Help & Patient Support</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => handleOpenLink("https://jivnicare.com/terms")}
          >
            <View style={styles.menuIconWrapper}>
              <FileText size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Terms of Service</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => handleOpenLink("https://jivnicare.com/privacy")}
          >
            <View style={styles.menuIconWrapper}>
              <Lock size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Privacy Policy</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPrompt}>
          <LogOut size={18} color={colors.rose600} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version Info */}
        <Text style={styles.versionText}>
          JivniCare Patient App • Version 1.0.0 (Beta)
        </Text>

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.emerald800,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.emerald50,
    padding: 12,
    borderRadius: radius.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.emerald100,
  },
  successText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.emerald800,
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  editActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  formGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  fieldInput: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  menuIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: radius.lg,
    backgroundColor: colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.rose50,
    paddingVertical: 14,
    borderRadius: radius.full,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.rose100,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.rose600,
  },
  versionText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
  },
});
