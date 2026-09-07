import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, X, Check, Crosshair } from "lucide-react-native";
import {
  MobileBottomNav,
  TabName,
} from "../components/layout/MobileBottomNav";
import { HomeScreen } from "../screens/home/HomeScreen";
import { DoctorsScreen } from "../screens/doctors/DoctorsScreen";
import { DoctorDetailScreen } from "../screens/doctors/DoctorDetailScreen";
import { CheckoutScreen } from "../screens/booking/CheckoutScreen";
import { ConfirmationScreen } from "../screens/booking/ConfirmationScreen";
import { QueueTrackingScreen } from "../screens/tracking/QueueTrackingScreen";
import { MyBookingsScreen } from "../screens/patient/MyBookingsScreen";
import { PatientProfileScreen } from "../screens/patient/PatientProfileScreen";
import { EmergencyScreen } from "../screens/emergency/EmergencyScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { OtpScreen } from "../screens/auth/OtpScreen";
import { IdentityScreen } from "../screens/auth/IdentityScreen";
import { useAuthStore } from "../store/useAuthStore";
import { useBookingStore, GeneratedToken } from "../store/useBookingStore";
import {
  usePatientLocationStore,
  SERVICEABLE_CITIES,
} from "../store/usePatientLocationStore";
import { Doctor } from "../types/doctor";
import { colors, radius, shadows, typography } from "../theme";

type NavigationScreen =
  | { type: "TAB"; tab: TabName }
  | { type: "DOCTOR_DETAIL"; doctor: Doctor }
  | { type: "CHECKOUT"; doctor: Doctor }
  | { type: "CONFIRMATION"; token: GeneratedToken }
  | { type: "QUEUE_TRACKING"; token: GeneratedToken }
  | { type: "AUTH_LOGIN" }
  | { type: "AUTH_OTP"; phone: string }
  | { type: "AUTH_IDENTITY"; phone: string };

export const RootNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>({
    type: "TAB",
    tab: "home",
  });
  const [doctorFilter, setDoctorFilter] = useState<{
    specialty?: string;
    search?: string;
  }>({});

  const { isAuthenticated, login, updateUser } = useAuthStore();
  const { setSelectedDoctor, activeBookings } = useBookingStore();
  const {
    selectedDistrict,
    setSelectedDistrict,
    isLocationSheetVisible,
    setIsLocationSheetVisible,
  } = usePatientLocationStore();

  const handleSelectTab = (tab: TabName) => {
    setCurrentScreen({ type: "TAB", tab });
  };

  const isTabActive = currentScreen.type === "TAB";
  const activeTabName: TabName =
    currentScreen.type === "TAB" ? currentScreen.tab : "home";

  return (
    <View style={styles.container}>
      {/* ── Screen Switcher ─────────────────────────────────────── */}
      <View style={styles.screenContent}>
        {/* TAB SCREENS */}
        {currentScreen.type === "TAB" && currentScreen.tab === "home" && (
          <HomeScreen
            onNavigateDoctors={(query) => {
              setDoctorFilter(query || {});
              setCurrentScreen({ type: "TAB", tab: "doctors" });
            }}
            onNavigateDoctorDetail={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "DOCTOR_DETAIL", doctor });
            }}
            onNavigateBooking={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
            onNavigateProfile={() => {
              setCurrentScreen({ type: "TAB", tab: "profile" });
            }}
            onNavigateEmergency={() => {
              setCurrentScreen({ type: "TAB", tab: "emergency" });
            }}
          />
        )}

        {currentScreen.type === "TAB" && currentScreen.tab === "doctors" && (
          <DoctorsScreen
            initialSpecialty={doctorFilter.specialty}
            initialQuery={doctorFilter.search}
            onPressDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "DOCTOR_DETAIL", doctor });
            }}
            onPressBook={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
          />
        )}

        {currentScreen.type === "TAB" && currentScreen.tab === "emergency" && (
          <EmergencyScreen
            onBookEmergencyDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
            onExploreAllDoctors={() => {
              setDoctorFilter({});
              setCurrentScreen({ type: "TAB", tab: "doctors" });
            }}
          />
        )}

        {currentScreen.type === "TAB" && currentScreen.tab === "my-bookings" && (
          <MyBookingsScreen
            onTrackQueue={(token) => {
              setCurrentScreen({ type: "QUEUE_TRACKING", token });
            }}
            onExploreDoctors={() => {
              setDoctorFilter({});
              setCurrentScreen({ type: "TAB", tab: "doctors" });
            }}
          />
        )}

        {currentScreen.type === "TAB" && currentScreen.tab === "profile" && (
          <PatientProfileScreen
            onNavigateHome={() =>
              setCurrentScreen({ type: "TAB", tab: "home" })
            }
            onNavigateDoctors={() =>
              setCurrentScreen({ type: "TAB", tab: "doctors" })
            }
            onLogoutSuccess={() => {
              setCurrentScreen({ type: "AUTH_LOGIN" });
            }}
          />
        )}

        {/* PUSH SCREENS */}
        {currentScreen.type === "DOCTOR_DETAIL" && (
          <DoctorDetailScreen
            doctor={currentScreen.doctor}
            onPressBack={() => setCurrentScreen({ type: "TAB", tab: "doctors" })}
            onPressBook={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
          />
        )}

        {currentScreen.type === "CHECKOUT" && (
          <CheckoutScreen
            doctor={currentScreen.doctor}
            onPressBack={() =>
              setCurrentScreen({
                type: "DOCTOR_DETAIL",
                doctor: currentScreen.doctor,
              })
            }
            onBookingSuccess={(token) => {
              setCurrentScreen({ type: "CONFIRMATION", token });
            }}
          />
        )}

        {currentScreen.type === "CONFIRMATION" && (
          <ConfirmationScreen
            token={currentScreen.token}
            onTrackQueue={(token) => {
              setCurrentScreen({ type: "QUEUE_TRACKING", token });
            }}
            onViewBookings={() => {
              setCurrentScreen({ type: "TAB", tab: "my-bookings" });
            }}
            onGoHome={() => {
              setCurrentScreen({ type: "TAB", tab: "home" });
            }}
          />
        )}

        {currentScreen.type === "QUEUE_TRACKING" && (
          <QueueTrackingScreen
            token={currentScreen.token}
            onPressBack={() => {
              setCurrentScreen({ type: "TAB", tab: "my-bookings" });
            }}
            onViewBookings={() => {
              setCurrentScreen({ type: "TAB", tab: "my-bookings" });
            }}
          />
        )}

        {/* AUTH SCREENS */}
        {currentScreen.type === "AUTH_LOGIN" && (
          <LoginScreen
            onSendOtp={(phone) => {
              setCurrentScreen({ type: "AUTH_OTP", phone });
            }}
            onSkip={() => {
              setCurrentScreen({ type: "TAB", tab: "home" });
            }}
          />
        )}

        {currentScreen.type === "AUTH_OTP" && (
          <OtpScreen
            phone={currentScreen.phone}
            onVerifySuccess={() => {
              setCurrentScreen({
                type: "AUTH_IDENTITY",
                phone: currentScreen.phone,
              });
            }}
            onBack={() => setCurrentScreen({ type: "AUTH_LOGIN" })}
          />
        )}

        {currentScreen.type === "AUTH_IDENTITY" && (
          <IdentityScreen
            phone={currentScreen.phone}
            onSaveProfile={(profile) => {
              login({
                id: `pat_${Date.now()}`,
                name: profile.name,
                phone: currentScreen.phone,
                location: profile.location,
                address: profile.address,
                pincode: profile.pincode,
                email: profile.email,
                dateOfBirth: profile.dob,
                gender: profile.gender,
              });
              setCurrentScreen({ type: "TAB", tab: "home" });
            }}
            onBack={() =>
              setCurrentScreen({
                type: "AUTH_OTP",
                phone: currentScreen.phone,
              })
            }
          />
        )}
      </View>

      {/* ── Bottom Navigation Bar (Visible on Tab Screens) ──────── */}
      {isTabActive && (
        <MobileBottomNav
          activeTab={activeTabName}
          onSelectTab={handleSelectTab}
        />
      )}

      {/* ── Location Selector Bottom Sheet Modal ───────────────── */}
      <Modal
        visible={isLocationSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLocationSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsLocationSheetVisible(false)}
        >
          <View
            style={styles.bottomSheetContainer}
            onStartShouldSetResponder={() => true}
          >
            {/* Sheet Handle */}
            <View style={styles.sheetHandle} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Select Your District</Text>
                <Text style={styles.sheetSubtitle}>
                  Choose your city for OPD queues & verified clinics
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsLocationSheetVisible(false)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Current GPS Location Action */}
            <TouchableOpacity
              style={styles.gpsRow}
              onPress={() => {
                setSelectedDistrict("Jamui");
                setIsLocationSheetVisible(false);
              }}
            >
              <View style={styles.gpsIconCircle}>
                <Crosshair size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.gpsTitle}>Use Current GPS Location</Text>
                <Text style={styles.gpsSubtitle}>Detect nearest clinic district</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetDivider} />

            {/* Serviceable Cities List */}
            <FlatList
              data={SERVICEABLE_CITIES}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isSelected = selectedDistrict.toLowerCase() === item.name.toLowerCase();
                const isComingSoon = item.status === "COMING_SOON";

                return (
                  <TouchableOpacity
                    style={[
                      styles.cityRow,
                      isSelected && styles.cityRowSelected,
                    ]}
                    onPress={() => {
                      if (!isComingSoon) {
                        setSelectedDistrict(item.name);
                        setIsLocationSheetVisible(false);
                      }
                    }}
                    disabled={isComingSoon}
                  >
                    <View style={styles.cityInfo}>
                      <View style={styles.cityNameRow}>
                        <Text style={styles.cityName}>{item.name}</Text>
                        <Text style={styles.cityState}>, {item.state}</Text>
                        {isComingSoon && (
                          <View style={styles.comingSoonBadge}>
                            <Text style={styles.comingSoonText}>Coming Soon</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cityDesc}>{item.description}</Text>
                    </View>

                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Check size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  bottomSheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    maxHeight: "80%",
    ...shadows.elevated,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary50,
    padding: 12,
    borderRadius: radius.xl,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  gpsSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
  },
  cityRowSelected: {
    backgroundColor: colors.primary50,
  },
  cityInfo: {
    flex: 1,
    gap: 2,
  },
  cityNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  cityState: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  comingSoonBadge: {
    backgroundColor: colors.slate100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
  },
  cityDesc: {
    fontSize: 11,
    color: colors.textMuted,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
