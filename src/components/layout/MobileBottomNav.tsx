import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

export type TabName = "home" | "doctors" | "emergency" | "my-bookings" | "profile";

interface MobileBottomNavProps {
  activeTab: TabName;
  onSelectTab: (tab: TabName) => void;
}

const BRAND_BLUE = "#5696C7";
const BRAND_NAVY = "#1B3F6B";
const ACTIVE_ICON_COLOR = "#FFFFFF";
const INACTIVE_GRAY = "#64748B";

// ── Custom Reference Icons ──────────────────────────────────────────

const HomeIcon = ({ active }: { active: boolean }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? ACTIVE_ICON_COLOR : INACTIVE_GRAY}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4 10.5L12 3L20 10.5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V10.5Z" />
    <Path d="M9.5 14C9.5 15.4 10.6 16.5 12 16.5C13.4 16.5 14.5 15.4 14.5 14" />
  </Svg>
);

const DoctorsIcon = ({ active }: { active: boolean }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? ACTIVE_ICON_COLOR : INACTIVE_GRAY}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4.8 2.5v3.5a5 5 0 0 0 10 0V2.5" />
    <Path d="M2.5 2.5h4.6" />
    <Path d="M12.5 2.5h4.6" />
    <Path d="M9.8 11v3a5 5 0 0 0 9.8 1.4" />
    <Circle cx="20" cy="14" r="2" />
  </Svg>
);

const EmergencyIcon = ({ active }: { active: boolean }) => (
  <Svg
    width={26}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? ACTIVE_ICON_COLOR : INACTIVE_GRAY}
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Ambulance Body */}
    <Path d="M3 7C3 5.9 3.9 5 5 5H13V16H3V7Z" />
    <Path d="M13 8H16.5L20 11.5V16H13V8Z" />
    {/* Wheels */}
    <Circle cx="6.5" cy="16.5" r="2" />
    <Circle cx="16.5" cy="16.5" r="2" />
    {/* Medical Cross */}
    <Path d="M8 8V12" />
    <Path d="M6 10H10" />
  </Svg>
);

const MyVisitIcon = ({ active }: { active: boolean }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? ACTIVE_ICON_COLOR : INACTIVE_GRAY}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Rect x="4" y="4" width="16" height="16" rx="4" />
    <Path d="M4 9H20" />
    <Path d="M7 13H10" />
    <Path d="M7 16.5H9" />
    <Circle cx="15" cy="15" r="2" />
    <Path d="M13 15C13 13.8 14 13 15 13C16 13 17 13.8 17 15C17 16.2 16 17 15 17C14 17 13 16.2 13 15Z" />
  </Svg>
);

const TABS: { id: TabName; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  { id: "home", label: "Home", icon: (active) => <HomeIcon active={active} /> },
  { id: "doctors", label: "Doctor's", icon: (active) => <DoctorsIcon active={active} /> },
  { id: "emergency", label: "Emergency", icon: (active) => <EmergencyIcon active={active} /> },
  { id: "my-bookings", label: "My Visit", icon: (active) => <MyVisitIcon active={active} /> },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.8}
            >
              {isActive ? (
                // ── Active Floating Circle State ──
                <View style={styles.activeWrapper}>
                  <View style={styles.activeCircle}>
                    {tab.icon(true)}
                  </View>
                  <Text style={styles.activeLabel}>{tab.label}</Text>
                </View>
              ) : (
                // ── Inactive Normal State ──
                <View style={styles.inactiveWrapper}>
                  <View style={styles.inactiveIconBox}>
                    {tab.icon(false)}
                  </View>
                  <Text style={styles.inactiveLabel}>{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    backgroundColor: "transparent",
    position: "relative",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    height: 64,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  activeWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    position: "relative",
  },
  activeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BRAND_BLUE, // #5696C7
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    marginTop: -22, // Rises above the top edge of the navigation container
    shadowColor: BRAND_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  activeLabel: {
    fontSize: 11.5,
    fontWeight: "800",
    color: BRAND_NAVY, // #1B3F6B
    letterSpacing: -0.2,
  },
  inactiveWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 4,
  },
  inactiveIconBox: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  inactiveLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: INACTIVE_GRAY, // #64748B
  },
});
