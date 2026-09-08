import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Linking,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Heart,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Users,
  Globe,
  MessageCircle,
  PhoneCall,
  Sparkles,
  X,
  MoreVertical,
  Settings,
  ExternalLink,
  Star,
  BookOpen,
  Info,
  ShieldAlert,
  Check,
  MessageSquareQuote,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react-native";
import {
  useAuthStore,
  FamilyMember,
  DoctorReview,
  PlatformFeedback,
} from "../../store/useAuthStore";
import { useBookingStore } from "../../store/useBookingStore";
import { MOCK_DOCTORS } from "../../data/mockDoctors";
import { Doctor } from "../../types/doctor";
import {
  submitDoctorReviewApi,
  submitPlatformFeedbackApi,
} from "../../api/ratingsApi";
import { updateProfileApi } from "../../api/authApi";

interface PatientProfileScreenProps {
  onNavigateHome: () => void;
  onNavigateDoctors: () => void;
  onNavigateBooking?: (doctor: Doctor) => void;
  onNavigateLogin?: () => void;
  onLogoutSuccess: () => void;
}

const BRAND_BLUE = "#5696C7";
const BRAND_NAVY = "#0F172A";
const VERIFIED_GREEN = "#059669";
const GOLD_STAR = "#F59E0B";

type RelationType = "Self" | "Father" | "Mother" | "Spouse" | "Child" | "Sibling" | "Other";
type GenderType = "Male" | "Female" | "Other";
type FeedbackCategoryType =
  | "Queue Accuracy"
  | "App Experience"
  | "Clinic Coordination"
  | "General Feedback";

const DOCTOR_REVIEW_TAGS = [
  "Punctual Doctor",
  "Clear Explanation",
  "Polite Clinic Staff",
  "Accurate Diagnosis",
  "Minimal Wait Time",
  "Clean & Sanitized Clinic",
];

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  onNavigateHome,
  onNavigateDoctors,
  onNavigateBooking,
  onNavigateLogin,
  onLogoutSuccess,
}) => {
  const {
    user,
    isAuthenticated,
    familyMembers,
    savedDoctorIds,
    language,
    userSettings,
    doctorReviews,
    platformFeedbacks,
    updateUser,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    toggleSaveDoctor,
    setLanguage,
    updateUserSettings,
    addDoctorReview,
    addPlatformFeedback,
    logout,
    deleteAccount,
  } = useAuthStore();

  const { activeBookings } = useBookingStore();

  // ── 3-Dots Action Menu State ─────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ── Settings Modal State ─────────────────────────────────────────────
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ── Personal Details Edit State ──────────────────────────────────────
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [ageInput, setAgeInput] = useState(user?.age ? String(user.age) : "");
  const [genderInput, setGenderInput] = useState<GenderType>(
    (user?.gender as GenderType) || "Male"
  );
  const [addressInput, setAddressInput] = useState(user?.address || "");

  // ── Family Member Modal State ────────────────────────────────────────
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState("");
  const [familyRelation, setFamilyRelation] = useState<RelationType>("Spouse");
  const [familyAge, setFamilyAge] = useState("");
  const [familyGender, setFamilyGender] = useState<GenderType>("Female");

  // ── Doctor Rate & Review Modal State ─────────────────────────────────
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedDoctorForReview, setSelectedDoctorForReview] = useState<{
    id: string;
    name: string;
    specialty: string;
    clinicName: string;
    visitId?: string;
  } | null>(null);
  const [docRatingScore, setDocRatingScore] = useState<number>(5);
  const [selectedDocTags, setSelectedDocTags] = useState<string[]>([
    "Clear Explanation",
    "Minimal Wait Time",
  ]);
  const [docReviewComment, setDocReviewComment] = useState("");

  // ── In-App Platform Feedback State ───────────────────────────────────
  const [platformRating, setPlatformRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategoryType>(
    "Queue Accuracy"
  );
  const [feedbackComment, setFeedbackComment] = useState("");
  const [allowPatientStories, setAllowPatientStories] = useState(true);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  // ── Toast Notification State ─────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // ── Handlers: Personal Details ───────────────────────────────────────
  const handleSavePersonal = () => {
    if (!nameInput.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }
    updateUser({
      name: nameInput.trim(),
      age: ageInput.trim(),
      gender: genderInput,
      address: addressInput.trim(),
    });
    setIsEditingPersonal(false);
    showToast("Profile details updated successfully!");
  };

  // ── Handlers: Family Members ─────────────────────────────────────────
  const handleOpenAddFamily = () => {
    setEditingFamilyId(null);
    setFamilyName("");
    setFamilyRelation("Spouse");
    setFamilyAge("");
    setFamilyGender("Female");
    setFamilyModalVisible(true);
  };

  const handleOpenEditFamily = (member: FamilyMember) => {
    setEditingFamilyId(member.id);
    setFamilyName(member.name);
    setFamilyRelation(member.relation);
    setFamilyAge(member.age);
    setFamilyGender(member.gender);
    setFamilyModalVisible(true);
  };

  const handleSaveFamilyMember = () => {
    if (!familyName.trim()) {
      Alert.alert("Required", "Please enter family member's name.");
      return;
    }
    const parsedAge = parseInt(familyAge.trim(), 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      Alert.alert("Invalid Age", "Please enter a valid age (1-120).");
      return;
    }

    if (editingFamilyId) {
      updateFamilyMember(editingFamilyId, {
        name: familyName.trim(),
        relation: familyRelation,
        age: familyAge.trim(),
        gender: familyGender,
      });
      showToast(`${familyName.trim()} updated`);
    } else {
      addFamilyMember({
        name: familyName.trim(),
        relation: familyRelation,
        age: familyAge.trim(),
        gender: familyGender,
      });
      showToast(`${familyName.trim()} added to family`);
    }
    setFamilyModalVisible(false);
  };

  const handleDeleteFamily = (id: string, memberName: string) => {
    Alert.alert(
      "Remove Family Member",
      `Are you sure you want to remove ${memberName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeFamilyMember(id);
            showToast(`Removed ${memberName}`);
          },
        },
      ]
    );
  };

  // ── Handlers: Saved Doctors ──────────────────────────────────────────
  const savedDoctorsList = MOCK_DOCTORS.filter((doc) =>
    savedDoctorIds.includes(doc.id)
  );

  const handleUnsaveDoctor = (doctorId: string, doctorName: string) => {
    toggleSaveDoctor(doctorId);
    showToast(`Removed Dr. ${doctorName} from saved doctors`);
  };

  // ── Handlers: External Web Links ─────────────────────────────────────
  const handleOpenWebUrl = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Open Web Page", `Please visit ${url} in your browser.`);
        }
      })
      .catch(() => {
        Alert.alert("Open Web Page", `Please visit ${url} in your browser.`);
      });
  };

  // ── Handlers: WhatsApp & Phone Helpline ──────────────────────────────
  const handleOpenWhatsApp = () => {
    const url = "whatsapp://send?phone=919876543210&text=Hi%20JivniCare%20Support,%20I%20need%20assistance";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL("https://wa.me/919876543210?text=Hi%20JivniCare%20Support");
        }
      })
      .catch(() => {
        Alert.alert("Support Desk", "WhatsApp Helpline: +91 98765 43210");
      });
  };

  const handleCallHelpline = () => {
    Linking.openURL("tel:+919876543210").catch(() => {
      Alert.alert("Support Helpline", "Please call: +91 98765 43210");
    });
  };

  // ── Handlers: Doctor Rating & Review ─────────────────────────────────
  const handleOpenDoctorReview = (doctor: {
    id: string;
    name: string;
    specialty: string;
    clinicName: string;
    visitId?: string;
  }) => {
    const existing = doctorReviews[doctor.id];
    setSelectedDoctorForReview(doctor);
    if (existing) {
      setDocRatingScore(existing.rating);
      setSelectedDocTags(existing.tags || []);
      setDocReviewComment(existing.comment || "");
    } else {
      setDocRatingScore(5);
      setSelectedDocTags(["Clear Explanation", "Minimal Wait Time"]);
      setDocReviewComment("");
    }
    setReviewModalVisible(true);
  };

  const handleToggleDocTag = (tag: string) => {
    if (selectedDocTags.includes(tag)) {
      setSelectedDocTags(selectedDocTags.filter((t) => t !== tag));
    } else {
      setSelectedDocTags([...selectedDocTags, tag]);
    }
  };

  const handleSubmitDoctorReview = () => {
    if (!selectedDoctorForReview) return;
    const review: DoctorReview = {
      doctorId: selectedDoctorForReview.id,
      doctorName: selectedDoctorForReview.name,
      visitId: selectedDoctorForReview.visitId,
      rating: docRatingScore,
      tags: selectedDocTags,
      comment: docReviewComment.trim(),
      createdAt: new Date().toISOString(),
    };
    addDoctorReview(review);
    setReviewModalVisible(false);
    showToast(`Thank you! Review for ${selectedDoctorForReview.name} saved.`);

    // Dispatch to backend API asynchronously
    submitDoctorReviewApi({
      doctorId: selectedDoctorForReview.id,
      rating: docRatingScore,
      tags: selectedDocTags,
      comment: docReviewComment.trim(),
      visitId: selectedDoctorForReview.visitId,
    }).catch(() => {});
  };

  // ── Handlers: In-App Platform Feedback ───────────────────────────────
  const handleSubmitPlatformFeedback = () => {
    if (!feedbackComment.trim()) {
      Alert.alert("Feedback Required", "Please share a brief comment about your experience.");
      return;
    }
    setIsFeedbackSubmitting(true);
    addPlatformFeedback({
      patientName: user?.name || "Dharmendra Kumar",
      rating: platformRating,
      category: feedbackCategory,
      comment: feedbackComment.trim(),
      allowStories: allowPatientStories,
    });

    // Dispatch to backend API asynchronously
    submitPlatformFeedbackApi({
      rating: platformRating,
      category: feedbackCategory,
      comment: feedbackComment.trim(),
      allowStories: allowPatientStories,
    }).catch(() => {});

    setTimeout(() => {
      setFeedbackComment("");
      setIsFeedbackSubmitting(false);
      showToast("Thank you for sharing your feedback!");
    }, 300);
  };

  // ── Handlers: Logout & Delete Account ────────────────────────────────
  const handleLogout = () => {
    setIsMenuOpen(false);
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your JivniCare patient account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            onLogoutSuccess();
          },
        },
      ]
    );
  };

  const handleConfirmDeleteAccount = () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      Alert.alert("Confirmation Required", "Please type DELETE to confirm.");
      return;
    }
    setDeleteModalVisible(false);
    setSettingsModalVisible(false);
    deleteAccount();
    onLogoutSuccess();
    Alert.alert(
      "Account Deleted",
      "Your patient profile, saved doctors, and family members have been permanently removed."
    );
  };

  // Completed past visits list (only real visits from store/backend)
  const pastVisits = activeBookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CANCELLED"
  );
  const completedVisits = pastVisits;

  const primaryPhone = user?.phone || "";
  const patientInitials = (user?.name || "Patient")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── Minimal Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onNavigateHome}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={20} color={BRAND_NAVY} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <TouchableOpacity
          style={styles.headerSettingsBtn}
          onPress={() => setSettingsModalVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Settings size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* ── Toast Notification ──────────────────────────────────── */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Sparkles size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SECTION 1: PROFILE IDENTITY CARD (Guest vs Authenticated) ── */}
        {!isAuthenticated || !user ? (
          <>
            {/* ── GUEST WELCOME & LOGIN CTA CARD ── */}
            <View style={styles.guestCard}>
              <View style={styles.guestTopRow}>
                <View style={styles.guestAvatarCircle}>
                  <UserIcon size={28} color="#0284C7" />
                </View>
                <View style={styles.guestTextCol}>
                  <Text style={styles.guestWelcomeTitle}>Welcome to JivniCare</Text>
                  <Text style={styles.guestWelcomeSub}>
                    Sign in to track live OPD tokens, manage family profiles, and save favorite doctors.
                  </Text>
                </View>
              </View>

              {onNavigateLogin && (
                <TouchableOpacity
                  style={styles.guestLoginBtn}
                  onPress={onNavigateLogin}
                  activeOpacity={0.85}
                >
                  <Text style={styles.guestLoginBtnText}>Login / Create Account</Text>
                  <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              )}

              <View style={styles.guestBenefitsRow}>
                <View style={styles.guestBenefitPill}>
                  <Sparkles size={12} color="#0284C7" />
                  <Text style={styles.guestBenefitText}>Zero-Wait OPD</Text>
                </View>
                <View style={styles.guestBenefitPill}>
                  <Users size={12} color="#059669" />
                  <Text style={styles.guestBenefitText}>Family Profiles</Text>
                </View>
                <View style={styles.guestBenefitPill}>
                  <ShieldCheck size={12} color="#6366F1" />
                  <Text style={styles.guestBenefitText}>Private & Secure</Text>
                </View>
              </View>
            </View>

            {/* ── GUEST BENEFIT HIGHLIGHTS CARD ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Sparkles size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Why Create an Account?</Text>
                </View>
              </View>

              <View style={styles.detailList}>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Clock size={16} color="#0284C7" style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailLabel, { fontWeight: "700", color: "#0F172A", marginBottom: 2 }]}>
                        Live OPD Queue Tracking
                      </Text>
                      <Text style={[styles.detailValue, { fontSize: 12, color: "#64748B" }]}>
                        Track live token position in real-time and skip waiting room delays.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Users size={16} color="#059669" style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailLabel, { fontWeight: "700", color: "#0F172A", marginBottom: 2 }]}>
                        Family Medical Profiles
                      </Text>
                      <Text style={[styles.detailValue, { fontSize: 12, color: "#64748B" }]}>
                        Manage consultations for parents, children & family with 1 tap.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <ShieldCheck size={16} color="#6366F1" style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailLabel, { fontWeight: "700", color: "#0F172A", marginBottom: 2 }]}>
                        Encrypted & Private
                      </Text>
                      <Text style={[styles.detailValue, { fontSize: 12, color: "#64748B" }]}>
                        Your phone and appointments are AES-256 protected with zero spam.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.identityCard}>
              <View style={styles.identityTopRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>{patientInitials}</Text>
                </View>
                <View style={styles.identityInfo}>
                  <View style={styles.patientNameRow}>
                    <Text style={styles.patientName}>{user?.name || "Patient"}</Text>
                    <View style={styles.verifiedTag}>
                      <ShieldCheck size={11} color={VERIFIED_GREEN} />
                      <Text style={styles.verifiedTagText}>Verified</Text>
                    </View>
                  </View>
                  <View style={styles.phoneRow}>
                    <Phone size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.phoneText}>{primaryPhone || "Phone not set"}</Text>
                  </View>
                </View>

                {/* 3-DOTS BUTTON */}
                <TouchableOpacity
                  style={styles.threeDotsBtn}
                  onPress={() => setIsMenuOpen(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                >
                  <MoreVertical size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── SECTION 2: PERSONAL DETAILS ───────────────────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <UserIcon size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Personal Details</Text>
                </View>
                <TouchableOpacity
                  style={styles.editToggleBtn}
                  onPress={() => {
                    if (isEditingPersonal) {
                      handleSavePersonal();
                    } else {
                      setIsEditingPersonal(true);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editToggleText}>
                    {isEditingPersonal ? "Save" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isEditingPersonal ? (
                <View style={styles.editForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={nameInput}
                      onChangeText={setNameInput}
                      placeholder="Full Name"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                      <Text style={styles.inputLabel}>Age</Text>
                      <TextInput
                        style={styles.textInput}
                        value={ageInput}
                        onChangeText={setAgeInput}
                        placeholder="Age"
                        keyboardType="numeric"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1.5 }]}>
                      <Text style={styles.inputLabel}>Gender</Text>
                      <View style={styles.genderSelectRow}>
                        {(["Male", "Female", "Other"] as GenderType[]).map((g) => (
                          <TouchableOpacity
                            key={g}
                            style={[
                              styles.genderPill,
                              genderInput === g && styles.genderPillActive,
                            ]}
                            onPress={() => setGenderInput(g)}
                          >
                            <Text
                              style={[
                                styles.genderPillText,
                                genderInput === g && styles.genderPillTextActive,
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
                    <Text style={styles.inputLabel}>District / City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={addressInput}
                      onChangeText={setAddressInput}
                      placeholder="e.g. Jamui, Bihar"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.detailList}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Full Name</Text>
                    <Text style={styles.detailValue}>{user?.name || "Not set"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Age & Gender</Text>
                    <Text style={styles.detailValue}>
                      {user?.age ? `${user.age} yrs` : "—"}, {user?.gender || "—"}
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel}>District / City</Text>
                    <Text style={styles.detailValue}>{user?.address || user?.location || "Not set"}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* ── SECTION 3: FAMILY MEMBERS ─────────────────────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Users size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Family Members</Text>
                </View>
                <TouchableOpacity
                  style={styles.addFamilyBtn}
                  onPress={handleOpenAddFamily}
                  activeOpacity={0.8}
                >
                  <Plus size={14} color="#FFFFFF" style={{ marginRight: 3 }} />
                  <Text style={styles.addFamilyBtnText}>Add</Text>
                </TouchableOpacity>
              </View>

              {/* Primary User Card */}
              <View style={styles.primaryFamilyCard}>
                <View style={styles.familyInfo}>
                  <View style={styles.familyHeaderRow}>
                    <Text style={styles.familyName}>{user?.name || "Self"}</Text>
                    <View style={styles.selfBadge}>
                      <Text style={styles.selfBadgeText}>Self</Text>
                    </View>
                  </View>
                  <Text style={styles.familyMeta}>
                    {user?.age ? `${user.age} yrs` : "Primary Account"} • {user?.gender || "Male"}
                  </Text>
                </View>
              </View>

              {/* Family Members List */}
              {familyMembers.length === 0 ? (
                <View style={styles.emptyFamilyBox}>
                  <Text style={styles.emptyFamilyText}>
                    Add family members for 1-tap patient selection during clinic booking.
                  </Text>
                </View>
              ) : (
                familyMembers.map((member) => (
                  <View key={member.id} style={styles.familyCard}>
                    <View style={styles.familyInfo}>
                      <View style={styles.familyHeaderRow}>
                        <Text style={styles.familyName}>{member.name}</Text>
                        <View style={styles.relationBadge}>
                          <Text style={styles.relationBadgeText}>{member.relation}</Text>
                        </View>
                      </View>
                      <Text style={styles.familyMeta}>
                        {member.age} yrs • {member.gender}
                      </Text>
                    </View>
                    <View style={styles.familyActionRow}>
                      <TouchableOpacity
                        style={styles.familyActionBtn}
                        onPress={() => handleOpenEditFamily(member)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Edit2 size={15} color={BRAND_BLUE} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.familyActionBtn, { marginLeft: 10 }]}
                        onPress={() => handleDeleteFamily(member.id, member.name)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* ── SECTION 4: PAST VISITS & DOCTOR RATE/REVIEW ────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Calendar size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Past Visits & Reviews</Text>
                </View>
              </View>

              {completedVisits.length === 0 ? (
                <View style={styles.emptyFamilyBox}>
                  <Text style={styles.emptyFamilyText}>
                    No past visits recorded yet. When you complete an OPD appointment, your history and review options will appear here.
                  </Text>
                </View>
              ) : (
                completedVisits.map((visit) => {
                  const review = doctorReviews[visit.doctorId];
                  return (
                    <View key={visit.id} style={styles.pastVisitCard}>
                      <View style={styles.pastVisitTop}>
                        <View style={styles.pastVisitDocBox}>
                          <Text style={styles.pastVisitDocName}>{visit.doctorName}</Text>
                          <Text style={styles.pastVisitDocSpec}>{visit.specialty}</Text>
                          <Text style={styles.pastVisitClinic} numberOfLines={1}>
                            {visit.clinicName}
                          </Text>
                        </View>
                        <View style={styles.pastVisitBadgeBox}>
                          <View style={styles.completedBadge}>
                            <CheckCircle2 size={11} color="#059669" style={{ marginRight: 3 }} />
                            <Text style={styles.completedBadgeText}>COMPLETED</Text>
                          </View>
                          <Text style={styles.pastTokenText}>Token #{visit.tokenNumber}</Text>
                        </View>
                      </View>

                      <View style={styles.pastVisitMetaRow}>
                        <View style={styles.metaItem}>
                          <Clock size={12} color="#64748B" style={{ marginRight: 4 }} />
                          <Text style={styles.metaText}>{visit.bookedAt}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <UserIcon size={12} color="#64748B" style={{ marginRight: 4 }} />
                          <Text style={styles.metaText}>{visit.patientName}</Text>
                        </View>
                      </View>

                      {/* Rating Action */}
                      <View style={styles.pastVisitActionRow}>
                        {review ? (
                          <View style={styles.reviewedBadgeBox}>
                            <View style={styles.starRowInline}>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={14}
                                  color={s <= review.rating ? GOLD_STAR : "#CBD5E1"}
                                  fill={s <= review.rating ? GOLD_STAR : "transparent"}
                                />
                              ))}
                            </View>
                            <Text style={styles.reviewedScoreText}>
                              Rated {review.rating}/5
                            </Text>
                            <TouchableOpacity
                              style={styles.editReviewLink}
                              onPress={() =>
                                handleOpenDoctorReview({
                                  id: visit.doctorId,
                                  name: visit.doctorName,
                                  specialty: visit.specialty,
                                  clinicName: visit.clinicName,
                                  visitId: visit.id,
                                })
                              }
                            >
                              <Text style={styles.editReviewLinkText}>Edit</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.rateDoctorBtn}
                            onPress={() =>
                              handleOpenDoctorReview({
                                id: visit.doctorId,
                                name: visit.doctorName,
                                specialty: visit.specialty,
                                clinicName: visit.clinicName,
                                visitId: visit.id,
                              })
                            }
                            activeOpacity={0.8}
                          >
                            <Star size={14} color="#D97706" style={{ marginRight: 6 }} />
                            <Text style={styles.rateDoctorBtnText}>Rate Consultation Experience</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* ── SECTION 5: APP FEEDBACK & STORIES ─────────────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <MessageSquareQuote size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.sectionTitle}>Share Your Feedback</Text>
                    <Text style={styles.sectionSubtitle}>
                      Help improve healthcare access in Jamui
                    </Text>
                  </View>
                </View>
              </View>

              {/* Feedback Form */}
              <View style={styles.feedbackFormBox}>
                <Text style={styles.feedbackFormLabel}>How is your JivniCare experience?</Text>

                {/* Star Selector */}
                <View style={styles.feedbackStarsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      style={styles.starSelectBtn}
                      onPress={() => setPlatformRating(star)}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={26}
                        color={star <= platformRating ? GOLD_STAR : "#CBD5E1"}
                        fill={star <= platformRating ? GOLD_STAR : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.ratingScoreLabel}>
                    {platformRating === 5
                      ? "⭐ Excellent"
                      : platformRating === 4
                      ? "⭐ Very Good"
                      : platformRating === 3
                      ? "⭐ Good"
                      : "⭐ Needs Work"}
                  </Text>
                </View>

                {/* Category Pills */}
                <View style={styles.categoryPillsRow}>
                  {(
                    [
                      "Queue Accuracy",
                      "App Experience",
                      "Clinic Coordination",
                      "General Feedback",
                    ] as FeedbackCategoryType[]
                  ).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        feedbackCategory === cat && styles.catPillActive,
                      ]}
                      onPress={() => setFeedbackCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          feedbackCategory === cat && styles.catPillTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Textarea */}
                <TextInput
                  style={styles.feedbackTextInput}
                  value={feedbackComment}
                  onChangeText={setFeedbackComment}
                  placeholder="Tell us what you liked or how we can improve..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                {/* Community Stories Toggle */}
                <View style={styles.storiesOptInRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.storiesOptInTitle}>Share in Community Stories</Text>
                    <Text style={styles.storiesOptInSub}>
                      Allow other patients to view your helpful feedback.
                    </Text>
                  </View>
                  <Switch
                    value={allowPatientStories}
                    onValueChange={setAllowPatientStories}
                    trackColor={{ false: "#CBD5E1", true: BRAND_BLUE }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitFeedbackBtn,
                    isFeedbackSubmitting && { opacity: 0.6 },
                  ]}
                  onPress={handleSubmitPlatformFeedback}
                  disabled={isFeedbackSubmitting}
                  activeOpacity={0.85}
                >
                  <Sparkles size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.submitFeedbackBtnText}>
                    {isFeedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submitted Feedbacks */}
              {platformFeedbacks.length > 0 && (
                <View style={styles.submittedFeedbacksContainer}>
                  <Text style={styles.submittedFeedbacksTitle}>My Submitted Feedback</Text>
                  {platformFeedbacks.map((fb) => (
                    <View key={fb.id} style={styles.submittedFeedbackCard}>
                      <View style={styles.submittedFeedbackTop}>
                        <View style={styles.starRowInline}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              color={s <= fb.rating ? GOLD_STAR : "#CBD5E1"}
                              fill={s <= fb.rating ? GOLD_STAR : "transparent"}
                            />
                          ))}
                          <Text style={styles.submittedFbCat}>{fb.category}</Text>
                        </View>
                        <View style={styles.communityTag}>
                          <Text style={styles.communityTagText}>✓ Shared</Text>
                        </View>
                      </View>
                      <Text style={styles.submittedFbText}>"{fb.comment}"</Text>
                      <Text style={styles.submittedFbDate}>
                        {new Date(fb.createdAt).toLocaleDateString()} • {fb.patientName}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {/* ── SECTION 6: SAVED DOCTORS ──────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Heart size={17} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Saved Doctors</Text>
            </View>
          </View>

          {savedDoctorsList.length === 0 ? (
            <View style={styles.emptySavedBox}>
              <Text style={styles.emptySavedTitle}>No saved doctors</Text>
              <Text style={styles.emptySavedDesc}>
                Tap the heart icon on any doctor card to quickly book them here.
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={onNavigateDoctors}
                activeOpacity={0.8}
              >
                <Text style={styles.exploreBtnText}>Browse Doctors</Text>
                <ChevronRight size={15} color={BRAND_BLUE} />
              </TouchableOpacity>
            </View>
          ) : (
            savedDoctorsList.map((doc) => (
              <View key={doc.id} style={styles.savedDocCard}>
                <View style={styles.savedDocTop}>
                  <View style={styles.savedDocInfo}>
                    <Text style={styles.savedDocName}>{doc.name}</Text>
                    <Text style={styles.savedDocSpec}>
                      {doc.specialty} • {doc.experienceYears} yrs exp
                    </Text>
                    <Text style={styles.savedDocClinic} numberOfLines={1}>
                      {doc.clinicName || "Jamui Medical Centre"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.unsaveHeartBtn}
                    onPress={() => handleUnsaveDoctor(doc.id, doc.name)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Heart size={18} color="#EF4444" fill="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.savedDocBottom}>
                  <View style={styles.savedDocPriceRow}>
                    <Text style={styles.savedDocFee}>₹{doc.consultationFee}</Text>
                    <Text style={styles.savedDocFeeSub}> Consultation</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookSlotBtn}
                    onPress={() => {
                      if (onNavigateBooking) {
                        onNavigateBooking(doc);
                      } else {
                        onNavigateDoctors();
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bookSlotBtnText}>Book Slot</Text>
                    <ChevronRight size={13} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── SECTION 7: EXPLORE ON WEB ─────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Globe size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Explore on Web</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.webLinkRow}
            onPress={() => handleOpenWebUrl("https://jivnicare.com/about")}
            activeOpacity={0.7}
          >
            <View style={styles.webLinkLeft}>
              <View style={[styles.webIconBox, { backgroundColor: "#E0F2FE" }]}>
                <Info size={17} color={BRAND_BLUE} />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.webLinkLabel}>About JivniCare</Text>
                <Text style={styles.webLinkSub}>Mission, verified doctors & district clinics</Text>
              </View>
            </View>
            <ExternalLink size={15} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.webLinkRow}
            onPress={() => handleOpenWebUrl("https://jivnicare.com/articles")}
            activeOpacity={0.7}
          >
            <View style={styles.webLinkLeft}>
              <View style={[styles.webIconBox, { backgroundColor: "#DCFCE7" }]}>
                <BookOpen size={17} color="#16A34A" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.webLinkLabel}>Health Articles & OPD Guides</Text>
                <Text style={styles.webLinkSub}>Preventative care, seasonal health & OPD tips</Text>
              </View>
            </View>
            <ExternalLink size={15} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.webLinkRow}
            onPress={() => handleOpenWebUrl("https://jivnicare.com/privacy")}
            activeOpacity={0.7}
          >
            <View style={styles.webLinkLeft}>
              <View style={[styles.webIconBox, { backgroundColor: "#F1F5F9" }]}>
                <Lock size={17} color="#475569" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.webLinkLabel}>Privacy Policy</Text>
                <Text style={styles.webLinkSub}>AES-256 data protection & health privacy</Text>
              </View>
            </View>
            <ExternalLink size={15} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.webLinkRow, { borderBottomWidth: 0 }]}
            onPress={() => handleOpenWebUrl("https://jivnicare.com/terms")}
            activeOpacity={0.7}
          >
            <View style={styles.webLinkLeft}>
              <View style={[styles.webIconBox, { backgroundColor: "#F1F5F9" }]}>
                <FileText size={17} color="#475569" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.webLinkLabel}>Terms of Service</Text>
                <Text style={styles.webLinkSub}>Platform usage guidelines & booking rules</Text>
              </View>
            </View>
            <ExternalLink size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* Prototype & Medical Disclaimer Notice */}
          <View style={styles.legalDisclaimerBox}>
            <Text style={styles.legalDisclaimerTitle}>Medical Disclaimer & Beta Notice</Text>
            <Text style={styles.legalDisclaimerText}>
              JivniCare is a digital queue facilitation tool in prototype testing. JivniCare does not provide medical diagnosis, treatment, or emergency ambulance dispatch. All medical advice and prescriptions are provided solely by consulting practitioners.
            </Text>
          </View>
        </View>

        {/* ── SECTION 8: HELP & SUPPORT ─────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <HelpCircle size={17} color={BRAND_BLUE} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Help & Support</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.supportRow}
            onPress={handleOpenWhatsApp}
            activeOpacity={0.7}
          >
            <View style={styles.supportLeft}>
              <View style={[styles.supportIconBox, { backgroundColor: "#DCFCE7" }]}>
                <MessageCircle size={17} color="#16A34A" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.supportLabel}>WhatsApp Support Desk</Text>
                <Text style={styles.supportSub}>Instant patient assistance</Text>
              </View>
            </View>
            <ChevronRight size={17} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.supportRow, { borderBottomWidth: 0 }]}
            onPress={handleCallHelpline}
            activeOpacity={0.7}
          >
            <View style={styles.supportLeft}>
              <View style={[styles.supportIconBox, { backgroundColor: "#E0F2FE" }]}>
                <PhoneCall size={17} color={BRAND_BLUE} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.supportLabel}>Helpline Support</Text>
                <Text style={styles.supportSub}>+91 98765 43210 (9 AM - 8 PM)</Text>
              </View>
            </View>
            <ChevronRight size={17} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.versionFooter}>
            <Text style={styles.versionText}>
              JivniCare Patient App • v1.0.0 (Beta Preview)
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── 3-DOTS ACTION POPUP MENU MODAL ───────────────────────── */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.menuSheet}>
            <View style={styles.menuDragHandle} />

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setIsMenuOpen(false);
                setSettingsModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuOptionIconBox, { backgroundColor: "#EFF6FF" }]}>
                <Settings size={18} color={BRAND_BLUE} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.menuOptionTitle}>Settings & Preferences</Text>
                <Text style={styles.menuOptionSub}>
                  Alerts, language & privacy controls
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuOption, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={[styles.menuOptionIconBox, { backgroundColor: "#FEE2E2" }]}>
                <LogOut size={18} color="#DC2626" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.menuOptionTitle, { color: "#DC2626" }]}>Log Out</Text>
                <Text style={styles.menuOptionSub}>
                  Sign out safely from this device
                </Text>
              </View>
              <ChevronRight size={16} color="#DC2626" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCancelBtn}
              onPress={() => setIsMenuOpen(false)}
            >
              <Text style={styles.menuCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── SETTINGS & PREFERENCES MODAL ─────────────────────────── */}
      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModalCard}>
            {/* Modal Header */}
            <View style={styles.settingsModalHeader}>
              <View>
                <Text style={styles.settingsModalTitle}>Settings</Text>
                <Text style={styles.settingsModalSubtitle}>Preferences & account controls</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSettingsModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.closeModalCircle}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.settingsModalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Language Section */}
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupHeader}>Language</Text>
                <View style={styles.settingsOptionBox}>
                  <TouchableOpacity
                    style={[
                      styles.langToggleItem,
                      language === "Eng" && styles.langToggleItemActive,
                    ]}
                    onPress={() => {
                      setLanguage("Eng");
                      showToast("Language set to English");
                    }}
                  >
                    <View style={styles.langToggleLeft}>
                      <View
                        style={[
                          styles.radioCircle,
                          language === "Eng" && styles.radioCircleActive,
                        ]}
                      >
                        {language === "Eng" && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.langToggleLabel}>English</Text>
                    </View>
                    {language === "Eng" && <Check size={16} color={BRAND_BLUE} />}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.langToggleItem,
                      language === "Hin" && styles.langToggleItemActive,
                      { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      setLanguage("Hin");
                      showToast("Language set to Hinglish");
                    }}
                  >
                    <View style={styles.langToggleLeft}>
                      <View
                        style={[
                          styles.radioCircle,
                          language === "Hin" && styles.radioCircleActive,
                        ]}
                      >
                        {language === "Hin" && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.langToggleLabel}>Hinglish (Hindi + English)</Text>
                    </View>
                    {language === "Hin" && <Check size={16} color={BRAND_BLUE} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notifications & Queue Alerts */}
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupHeader}>Notifications</Text>
                <View style={styles.settingsOptionBox}>
                  <View style={styles.settingsSwitchRow}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.switchRowTitle}>Live Queue Alerts (SMS & WhatsApp)</Text>
                      <Text style={styles.switchRowSub}>
                        Receive live token arrival reminders before consultation.
                      </Text>
                    </View>
                    <Switch
                      value={userSettings.smsAlerts}
                      onValueChange={(val) => updateUserSettings({ smsAlerts: val })}
                      trackColor={{ false: "#CBD5E1", true: BRAND_BLUE }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={[styles.settingsSwitchRow, { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.switchRowTitle}>Clinic OPD Delay Updates</Text>
                      <Text style={styles.switchRowSub}>
                        Notify instantly if the clinic has unexpected emergencies.
                      </Text>
                    </View>
                    <Switch
                      value={userSettings.delayNotifications}
                      onValueChange={(val) =>
                        updateUserSettings({ delayNotifications: val })
                      }
                      trackColor={{ false: "#CBD5E1", true: BRAND_BLUE }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              {/* Privacy & Security */}
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupHeader}>Privacy & Security</Text>
                <View style={styles.settingsOptionBox}>
                  <View style={styles.settingsSwitchRow}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.switchRowTitle}>Share Profile with Attending Doctor</Text>
                      <Text style={styles.switchRowSub}>
                        Allow verified doctors to see age, gender & token history.
                      </Text>
                    </View>
                    <Switch
                      value={userSettings.dataSharing}
                      onValueChange={(val) =>
                        updateUserSettings({ dataSharing: val })
                      }
                      trackColor={{ false: "#CBD5E1", true: BRAND_BLUE }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={[styles.settingsSwitchRow, { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.switchRowTitle}>Biometric Lock</Text>
                      <Text style={styles.switchRowSub}>
                        Require biometric verification to view medical tokens.
                      </Text>
                    </View>
                    <Switch
                      value={userSettings.biometricLock}
                      onValueChange={(val) =>
                        updateUserSettings({ biometricLock: val })
                      }
                      trackColor={{ false: "#CBD5E1", true: BRAND_BLUE }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              {/* Danger Zone: Delete Account */}
              <View style={styles.settingsGroup}>
                <Text style={[styles.settingsGroupHeader, { color: "#DC2626" }]}>
                  Account Management
                </Text>
                <View style={styles.dangerZoneBox}>
                  <View style={styles.dangerZoneInfo}>
                    <AlertTriangle size={18} color="#DC2626" style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dangerZoneTitle}>Delete Patient Account</Text>
                      <Text style={styles.dangerZoneSub}>
                        Permanently remove profile, saved doctors & family records.
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteAccountBtn}
                    onPress={() => setDeleteModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Trash2 size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.deleteAccountBtnText}>Delete Account</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── DELETE ACCOUNT CONFIRMATION MODAL ────────────────────── */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteIconCircle}>
              <ShieldAlert size={26} color="#DC2626" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Account?</Text>
            <Text style={styles.deleteModalDesc}>
              This will permanently remove your profile, saved doctors, and family members.
            </Text>

            <Text style={styles.deletePromptText}>
              Type <Text style={{ fontWeight: "700", color: "#DC2626" }}>DELETE</Text> to confirm:
            </Text>
            <TextInput
              style={styles.deleteConfirmInput}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder="DELETE"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />

            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteCancelBtn}
                onPress={() => {
                  setDeleteConfirmText("");
                  setDeleteModalVisible(false);
                }}
              >
                <Text style={styles.deleteCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.deleteSubmitBtn,
                  deleteConfirmText.trim().toUpperCase() !== "DELETE" && {
                    opacity: 0.5,
                  },
                ]}
                onPress={handleConfirmDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE"}
              >
                <Text style={styles.deleteSubmitBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── DOCTOR RATE & REVIEW MODAL ───────────────────────────── */}
      <Modal
        visible={reviewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reviewModalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Rate Consultation</Text>
                <Text style={styles.modalSub}>
                  {selectedDoctorForReview?.name} • {selectedDoctorForReview?.specialty}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setReviewModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.reviewModalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Stars */}
              <View style={styles.reviewStarsBox}>
                <Text style={styles.reviewStarsPrompt}>How was your consultation?</Text>
                <View style={styles.reviewStarsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setDocRatingScore(star)}
                      style={styles.reviewStarTouch}
                    >
                      <Star
                        size={30}
                        color={star <= docRatingScore ? GOLD_STAR : "#CBD5E1"}
                        fill={star <= docRatingScore ? GOLD_STAR : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.reviewScoreBadge}>
                  {docRatingScore === 5
                    ? "⭐⭐⭐⭐⭐ Excellent"
                    : docRatingScore === 4
                    ? "⭐⭐⭐⭐ Very Good"
                    : docRatingScore === 3
                    ? "⭐⭐⭐ Good"
                    : "⭐⭐ Needs Improvement"}
                </Text>
              </View>

              {/* Tag Highlights */}
              <Text style={styles.reviewSectionLabel}>Highlights</Text>
              <View style={styles.tagWrapRow}>
                {DOCTOR_REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedDocTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagPill, isSelected && styles.tagPillActive]}
                      onPress={() => handleToggleDocTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagPillText,
                          isSelected && styles.tagPillTextActive,
                        ]}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Review Comment */}
              <Text style={styles.reviewSectionLabel}>Your Experience (Optional)</Text>
              <TextInput
                style={styles.reviewTextInput}
                value={docReviewComment}
                onChangeText={setDocReviewComment}
                placeholder="Share your doctor consultation feedback..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View style={{ height: 16 }} />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setReviewModalVisible(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={handleSubmitDoctorReview}
              >
                <Text style={styles.saveModalText}>Save Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── ADD / EDIT FAMILY MEMBER MODAL ───────────────────────── */}
      <Modal
        visible={familyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFamilyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFamilyId ? "Edit Family Member" : "Add Family Member"}
              </Text>
              <TouchableOpacity
                onPress={() => setFamilyModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={familyName}
                  onChangeText={setFamilyName}
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relationship</Text>
                <View style={styles.relationPillRow}>
                  {(["Spouse", "Child", "Parent", "Sibling", "Other"] as RelationType[]).map((rel) => (
                    <TouchableOpacity
                      key={rel}
                      style={[
                        styles.relationPill,
                        familyRelation === rel && styles.relationPillActive,
                      ]}
                      onPress={() => setFamilyRelation(rel)}
                    >
                      <Text
                        style={[
                          styles.relationPillText,
                          familyRelation === rel && styles.relationPillTextActive,
                        ]}
                      >
                        {rel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.textInput}
                    value={familyAge}
                    onChangeText={setFamilyAge}
                    placeholder="e.g. 24"
                    keyboardType="numeric"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1.5 }]}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderSelectRow}>
                    {(["Male", "Female", "Other"] as GenderType[]).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.genderPill,
                          familyGender === g && styles.genderPillActive,
                        ]}
                        onPress={() => setFamilyGender(g)}
                      >
                        <Text
                          style={[
                            styles.genderPillText,
                            familyGender === g && styles.genderPillTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setFamilyModalVisible(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={handleSaveFamilyMember}
              >
                <Text style={styles.saveModalText}>
                  {editingFamilyId ? "Save Changes" : "Add Member"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleBox: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  headerSettingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  // ── SECTION 1: IDENTITY CARD ─────────────────────────────────────────
  identityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  identityTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 17,
    fontWeight: "800",
    color: BRAND_BLUE,
  },
  identityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: VERIFIED_GREEN,
    marginLeft: 2,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  phoneText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  threeDotsBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── SECTION CARD COMMON ──────────────────────────────────────────────
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  editToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
  },
  editToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_BLUE,
  },

  // ── PERSONAL DETAILS ─────────────────────────────────────────────────
  detailList: {
    marginTop: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  editForm: {
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: BRAND_NAVY,
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderSelectRow: {
    flexDirection: "row",
  },
  genderPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    marginHorizontal: 2,
  },
  genderPillActive: {
    borderColor: BRAND_BLUE,
    backgroundColor: "#EFF6FF",
  },
  genderPillText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  genderPillTextActive: {
    color: BRAND_BLUE,
    fontWeight: "700",
  },

  // ── FAMILY MEMBERS ───────────────────────────────────────────────────
  addFamilyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BRAND_BLUE,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },
  addFamilyBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  primaryFamilyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 6,
  },
  familyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 6,
  },
  familyInfo: {
    flex: 1,
  },
  familyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  familyName: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  selfBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  selfBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: BRAND_BLUE,
  },
  relationBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  relationBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
  },
  familyMeta: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  familyActionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  familyActionBtn: {
    padding: 4,
  },
  emptyFamilyBox: {
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyFamilyText: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 15,
  },

  // ── PAST VISITS ──────────────────────────────────────────────────────
  pastVisitCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  pastVisitTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pastVisitDocBox: {
    flex: 1,
    marginRight: 8,
  },
  pastVisitDocName: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  pastVisitDocSpec: {
    fontSize: 11,
    fontWeight: "600",
    color: BRAND_BLUE,
    marginTop: 1,
  },
  pastVisitClinic: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  pastVisitBadgeBox: {
    alignItems: "flex-end",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#059669",
  },
  pastTokenText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 3,
  },
  pastVisitMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  metaText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  pastVisitActionRow: {
    marginTop: 8,
  },
  rateDoctorBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  rateDoctorBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  reviewedBadgeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  starRowInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewedScoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_NAVY,
    marginLeft: 6,
  },
  editReviewLink: {
    marginLeft: "auto",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editReviewLinkText: {
    fontSize: 11,
    fontWeight: "600",
    color: BRAND_BLUE,
  },

  // ── IN-APP FEEDBACK ──────────────────────────────────────────────────
  feedbackFormBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  feedbackFormLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  feedbackStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  starSelectBtn: {
    padding: 3,
    marginRight: 3,
  },
  ratingScoreLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
    marginLeft: 6,
  },
  categoryPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 5,
  },
  catPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  catPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: BRAND_BLUE,
  },
  catPillText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#64748B",
  },
  catPillTextActive: {
    color: BRAND_BLUE,
    fontWeight: "700",
  },
  feedbackTextInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
    color: BRAND_NAVY,
    marginTop: 8,
    minHeight: 60,
  },
  storiesOptInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  storiesOptInTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  storiesOptInSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  submitFeedbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BRAND_BLUE,
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 10,
  },
  submitFeedbackBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── SUBMITTED FEEDBACKS ──────────────────────────────────────────────
  submittedFeedbacksContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  submittedFeedbacksTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_NAVY,
    marginBottom: 6,
  },
  submittedFeedbackCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  submittedFeedbackTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submittedFbCat: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
    marginLeft: 4,
  },
  communityTag: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  communityTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#047857",
  },
  submittedFbText: {
    fontSize: 11,
    color: BRAND_NAVY,
    fontStyle: "italic",
    marginTop: 4,
    lineHeight: 15,
  },
  submittedFbDate: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 3,
  },

  // ── SAVED DOCTORS ────────────────────────────────────────────────────
  emptySavedBox: {
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    alignItems: "center",
  },
  emptySavedTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_NAVY,
    marginBottom: 2,
  },
  emptySavedDesc: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 15,
    marginBottom: 8,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
  },
  exploreBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND_BLUE,
    marginRight: 3,
  },
  savedDocCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  savedDocTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  savedDocInfo: {
    flex: 1,
    marginRight: 8,
  },
  savedDocName: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  savedDocSpec: {
    fontSize: 11,
    color: BRAND_BLUE,
    fontWeight: "600",
    marginTop: 1,
  },
  savedDocClinic: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  unsaveHeartBtn: {
    padding: 4,
  },
  savedDocBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  savedDocPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  savedDocFee: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_NAVY,
  },
  savedDocFeeSub: {
    fontSize: 10,
    color: "#64748B",
  },
  bookSlotBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BRAND_BLUE,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  bookSlotBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 2,
  },

  // ── EXPLORE ON WEB ───────────────────────────────────────────────────
  webLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  webLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  webIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  webLinkLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  webLinkSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  legalDisclaimerBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  legalDisclaimerTitle: {
    fontSize: 11.5,
    fontWeight: "800",
    color: BRAND_NAVY,
    marginBottom: 4,
  },
  legalDisclaimerText: {
    fontSize: 10.5,
    color: "#64748B",
    lineHeight: 15,
  },

  // ── HELP & SUPPORT ───────────────────────────────────────────────────
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  supportLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  supportLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  supportSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  versionFooter: {
    marginTop: 12,
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  versionText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // ── 3-DOTS ACTION SHEET MODAL ────────────────────────────────────────
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
  },
  menuDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  menuOptionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuOptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  menuOptionSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  menuCancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  menuCancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },

  // ── SETTINGS MODAL ───────────────────────────────────────────────────
  settingsModalCard: {
    width: "100%",
    height: "88%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 14,
    paddingHorizontal: 18,
  },
  settingsModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingsModalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  settingsModalSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  closeModalCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsModalScroll: {
    flex: 1,
    marginTop: 8,
  },
  settingsGroup: {
    marginBottom: 16,
  },
  settingsGroupHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_NAVY,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  settingsOptionBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  langToggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  langToggleItemActive: {},
  langToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioCircleActive: {
    borderColor: BRAND_BLUE,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_BLUE,
  },
  langToggleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  settingsSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  switchRowTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  switchRowSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
    lineHeight: 14,
  },
  dangerZoneBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerZoneInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dangerZoneTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
  },
  dangerZoneSub: {
    fontSize: 10,
    color: "#7F1D1D",
    marginTop: 1,
    lineHeight: 14,
  },
  deleteAccountBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    borderRadius: 7,
    marginTop: 10,
  },
  deleteAccountBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── DELETE CONFIRMATION MODAL ────────────────────────────────────────
  deleteModalCard: {
    width: "86%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  deleteIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  deleteModalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  deleteModalDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
    lineHeight: 16,
  },
  deletePromptText: {
    fontSize: 12,
    color: BRAND_NAVY,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  deleteConfirmInput: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
    marginTop: 5,
  },
  deleteModalActions: {
    flexDirection: "row",
    marginTop: 14,
    width: "100%",
    gap: 8,
  },
  deleteCancelBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  deleteCancelBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  deleteSubmitBtn: {
    flex: 1.2,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    alignItems: "center",
  },
  deleteSubmitBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── REVIEW MODAL ─────────────────────────────────────────────────────
  reviewModalCard: {
    width: "90%",
    maxHeight: "82%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  reviewModalScroll: {
    marginTop: 8,
  },
  reviewStarsBox: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  reviewStarsPrompt: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_NAVY,
  },
  reviewStarsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  reviewStarTouch: {
    padding: 3,
    marginHorizontal: 1,
  },
  reviewScoreBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
    marginTop: 4,
  },
  reviewSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_NAVY,
    marginBottom: 6,
    marginTop: 2,
  },
  tagWrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 10,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tagPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: BRAND_BLUE,
  },
  tagPillText: {
    fontSize: 10,
    color: "#475569",
    fontWeight: "500",
  },
  tagPillTextActive: {
    color: BRAND_BLUE,
    fontWeight: "700",
  },
  reviewTextInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
    color: BRAND_NAVY,
    minHeight: 60,
  },

  // ── FAMILY MODAL COMMON ──────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BRAND_NAVY,
  },
  modalSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  modalBody: {
    marginBottom: 8,
  },
  relationPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  relationPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  relationPillActive: {
    borderColor: BRAND_BLUE,
    backgroundColor: "#EFF6FF",
  },
  relationPillText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  relationPillTextActive: {
    color: BRAND_BLUE,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  cancelModalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 7,
    backgroundColor: "#F1F5F9",
  },
  cancelModalText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  saveModalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    backgroundColor: BRAND_BLUE,
  },
  saveModalText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── GUEST CARD STYLES ────────────────────────────────────────────────
  guestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  guestTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  guestAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
  },
  guestTextCol: {
    flex: 1,
  },
  guestWelcomeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: BRAND_NAVY,
  },
  guestWelcomeSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 16,
  },
  guestLoginBtn: {
    backgroundColor: "#4C92E8",
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    shadowColor: "#4C92E8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  guestLoginBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  guestBenefitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  guestBenefitPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  guestBenefitText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#334155",
  },
});

