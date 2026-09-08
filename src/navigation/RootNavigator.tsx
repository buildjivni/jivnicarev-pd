import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { X, Check, Crosshair } from "lucide-react-native";
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
import { SplashScreen } from "../screens/splash/SplashScreen";
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
import { colors, radius, shadows } from "../theme";

type NavigationScreen =
  | { type: "SPLASH" }
  | { type: "TAB"; tab: TabName }
  | { type: "PROFILE" }
  | { type: "DOCTOR_DETAIL"; doctor: Doctor }
  | { type: "CHECKOUT"; doctor: Doctor }
  | { type: "CONFIRMATION"; token: GeneratedToken }
  | { type: "QUEUE_TRACKING"; token: GeneratedToken }
  | { type: "AUTH_LOGIN" }
  | { type: "AUTH_OTP"; phone?: string; email?: string; sessionId?: string }
  | { type: "AUTH_IDENTITY"; phone?: string; email?: string; token?: string; user?: any };

export const RootNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>({
    type: "SPLASH",
  });
  const [doctorFilter, setDoctorFilter] = useState<{
    specialty?: string;
    search?: string;
    savedOnly?: boolean;
  }>({});

  const { login, isAuthenticated } = useAuthStore();
  const { setSelectedDoctor } = useBookingStore();
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
        {/* SPLASH SCREEN */}
        {currentScreen.type === "SPLASH" && (
          <SplashScreen
            onFinish={() => {
              if (isAuthenticated) {
                setCurrentScreen({ type: "TAB", tab: "home" });
              } else {
                setCurrentScreen({ type: "AUTH_LOGIN" });
              }
            }}
          />
        )}

        {/* TAB SCREENS (Kept mounted for 0ms instantaneous tab switching) */}
        <View
          style={[
            styles.tabScreenContainer,
            { display: isTabActive && activeTabName === "home" ? "flex" : "none" },
          ]}
        >
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
              setCurrentScreen({ type: "PROFILE" });
            }}
            onNavigateEmergency={() => {
              setCurrentScreen({ type: "TAB", tab: "emergency" });
            }}
          />
        </View>

        <View
          style={[
            styles.tabScreenContainer,
            { display: isTabActive && activeTabName === "doctors" ? "flex" : "none" },
          ]}
        >
          <DoctorsScreen
            initialSpecialty={doctorFilter.specialty || "All"}
            initialQuery={doctorFilter.search || ""}
            initialSavedOnly={doctorFilter.savedOnly || false}
            onPressDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "DOCTOR_DETAIL", doctor });
            }}
            onPressBook={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
          />
        </View>

        <View
          style={[
            styles.tabScreenContainer,
            { display: isTabActive && activeTabName === "emergency" ? "flex" : "none" },
          ]}
        >
          <EmergencyScreen
            onBookEmergencyDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
            onPressDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "DOCTOR_DETAIL", doctor });
            }}
          />
        </View>

        <View
          style={[
            styles.tabScreenContainer,
            { display: isTabActive && activeTabName === "my-bookings" ? "flex" : "none" },
          ]}
        >
          <MyBookingsScreen
            onTrackQueue={(token) => {
              setCurrentScreen({ type: "QUEUE_TRACKING", token });
            }}
            onExploreDoctors={() => {
              setDoctorFilter({});
              setCurrentScreen({ type: "TAB", tab: "doctors" });
            }}
          />
        </View>

        {/* PUSH SCREENS */}
        {currentScreen.type === "PROFILE" && (
          <PatientProfileScreen
            onNavigateHome={() => setCurrentScreen({ type: "TAB", tab: "home" })}
            onNavigateDoctors={() => setCurrentScreen({ type: "TAB", tab: "doctors" })}
            onNavigateBooking={(doctor) => {
              setSelectedDoctor(doctor);
              setCurrentScreen({ type: "CHECKOUT", doctor });
            }}
            onNavigateLogin={() => {
              setCurrentScreen({ type: "AUTH_LOGIN" });
            }}
            onLogoutSuccess={() => {
              setCurrentScreen({ type: "AUTH_LOGIN" });
            }}
          />
        )}
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
            onSendEmailCode={(email) => {
              setCurrentScreen({ type: "AUTH_OTP", email });
            }}
            onSendOtp={(phone, sessionId) => {
              setCurrentScreen({ type: "AUTH_OTP", phone, sessionId });
            }}
            onGoogleSuccess={(data) => {
              if (data.needsProfile) {
                setCurrentScreen({
                  type: "AUTH_IDENTITY",
                  phone: data.user?.phone || "",
                  email: data.user?.email || "",
                  token: data.token,
                  user: data.user,
                });
              } else {
                login(data.user, data.token);
                if (data.user?.location || data.user?.address) {
                  setSelectedDistrict(data.user.location || data.user.address);
                }
                setCurrentScreen({ type: "TAB", tab: "home" });
              }
            }}
            onSkip={() => {
              setCurrentScreen({ type: "TAB", tab: "home" });
            }}
          />
        )}

        {currentScreen.type === "AUTH_OTP" && (
          <OtpScreen
            phone={currentScreen.phone}
            email={currentScreen.email}
            sessionId={currentScreen.sessionId}
            onVerifySuccess={(result) => {
              if (result?.needsProfile) {
                setCurrentScreen({
                  type: "AUTH_IDENTITY",
                  phone: currentScreen.phone || result.user?.phone || "",
                  email: currentScreen.email || (result.user as any)?.email || "",
                  token: result.token,
                  user: result.user,
                });
              } else if (result?.user) {
                const userObj = {
                  id: result.user.id,
                  name: result.user.name || "Patient",
                  phone: result.user.phone || currentScreen.phone || "",
                  email: (result.user as any).email || currentScreen.email || "",
                  role: result.user.role || "PATIENT",
                  location: (result.user as any).location || "Jamui",
                  address: (result.user as any).address || "Jamui",
                };
                login(userObj, result.token);
                if ((result.user as any).location) {
                  setSelectedDistrict((result.user as any).location);
                }
                setCurrentScreen({ type: "TAB", tab: "home" });
              } else {
                setCurrentScreen({
                  type: "AUTH_IDENTITY",
                  phone: currentScreen.phone || "",
                  email: currentScreen.email || "",
                });
              }
            }}
            onBack={() => setCurrentScreen({ type: "AUTH_LOGIN" })}
          />
        )}

        {currentScreen.type === "AUTH_IDENTITY" && (
          <IdentityScreen
            phone={currentScreen.phone || currentScreen.email || ""}
            initialName={currentScreen.user?.name && currentScreen.user.name !== "Patient" ? currentScreen.user.name : ""}
            token={currentScreen.token}
            onSaveProfile={(profile) => {
              const updatedUser = {
                id: currentScreen.user?.id || `pat_${Date.now()}`,
                name: profile.name,
                phone: currentScreen.phone || currentScreen.user?.phone || "",
                email: currentScreen.email || currentScreen.user?.email || "",
                role: "PATIENT",
                age: profile.age,
                gender: profile.gender,
                address: profile.address,
                pincode: profile.pincode,
                location: profile.address,
              };
              login(updatedUser, currentScreen.token || "patient_jwt_token");
              setSelectedDistrict(profile.address);
              setCurrentScreen({ type: "TAB", tab: "home" });
            }}
            onSkip={() => {
              login(
                {
                  id: currentScreen.user?.id || `pat_${Date.now()}`,
                  name: currentScreen.user?.name || "Patient",
                  phone: currentScreen.phone || currentScreen.email || "",
                  email: currentScreen.email || currentScreen.user?.email || "",
                  role: "PATIENT",
                  address: "Jamui, Bihar",
                  pincode: "811307",
                  location: "Jamui, Bihar",
                },
                currentScreen.token || "patient_jwt_token"
              );
              setCurrentScreen({ type: "TAB", tab: "home" });
            }}
            onBack={() =>
              setCurrentScreen({
                type: "AUTH_LOGIN",
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
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* GPS Auto-Detect Option */}
            <TouchableOpacity
              style={styles.gpsOption}
              onPress={() => {
                setSelectedDistrict("Deoghar");
                setIsLocationSheetVisible(false);
              }}
            >
              <View style={styles.gpsIconCircle}>
                <Crosshair size={18} color="#5696C7" />
              </View>
              <View style={styles.gpsTextContainer}>
                <Text style={styles.gpsTitle}>Use Current Location (GPS)</Text>
                <Text style={styles.gpsSubtitle}>
                  Auto-detect nearest OPD clinics & hospitals
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>SERVICEABLE CITIES & DISTRICTS</Text>

            {/* District List */}
            <FlatList
              data={SERVICEABLE_CITIES}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cityList}
              renderItem={({ item }) => {
                const isSelected = selectedDistrict === item.name;
                return (
                  <TouchableOpacity
                    style={[
                      styles.cityItem,
                      isSelected && styles.cityItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedDistrict(item.name);
                      setIsLocationSheetVisible(false);
                    }}
                  >
                    <View style={styles.cityInfo}>
                      <Text
                        style={[
                          styles.cityName,
                          isSelected && styles.cityNameSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.cityState}>
                        {item.state} • {item.status === "ACTIVE" ? "OPD Active" : "Coming Soon"}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
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
  tabScreenContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  bottomSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: "75%",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.slate300,
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
    fontWeight: "800",
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
    backgroundColor: colors.slate100,
    justifyContent: "center",
    alignItems: "center",
  },
  gpsOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginBottom: 16,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  gpsTextContainer: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B3F6B",
  },
  gpsSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.slate200,
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  cityList: {
    paddingBottom: 10,
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    marginBottom: 4,
  },
  cityItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cityNameSelected: {
    fontWeight: "800",
    color: "#1B3F6B",
  },
  cityState: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
