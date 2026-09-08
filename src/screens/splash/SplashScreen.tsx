import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { ShieldCheck, Activity } from "lucide-react-native";
import { colors, radius, shadows, typography } from "../../theme";

const { width } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bottomFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(bottomFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Gentle heartbeat pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulseLoop.start();

    // 3. Auto-transition after 1.8s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start(() => {
        onFinish();
      });
    }, 1800);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Brand Emblem */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.glowCircle} />
          <View style={styles.logoBadge}>
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.splashIconImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Brand Name & Tagline */}
        <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
          <Text style={styles.brandTitle}>
            Jivni<Text style={styles.brandTitleAccent}>Care</Text>
          </Text>
          <Text style={styles.brandSubtitle}>Zero-Wait Live OPD Tracking</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.trustPill}>
              <Activity size={12} color="#059669" />
              <Text style={styles.trustPillText}>Live OPD Queue</Text>
            </View>
            <View style={styles.trustPill}>
              <ShieldCheck size={12} color="#5696C7" />
              <Text style={styles.trustPillText}>Verified Doctor Profiles</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Footer Branding */}
      <Animated.View style={[styles.footer, { opacity: bottomFadeAnim }]}>
        <Text style={styles.footerTagline}>Digital Healthcare for Bharat</Text>
        <Text style={styles.footerVersion}>v1.0.0 (Beta Preview) • Made with ❤️ in Bharat</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  glowCircle: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(86, 150, 199, 0.15)",
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
  },
  splashIconImage: {
    width: 80,
    height: 80,
  },
  textBlock: {
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  brandTitleAccent: {
    color: "#5696C7",
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 6,
    letterSpacing: 0.2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
  },
  trustPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...shadows.sm,
  },
  trustPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  footer: {
    paddingBottom: 24,
    alignItems: "center",
  },
  footerTagline: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  footerVersion: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
});
