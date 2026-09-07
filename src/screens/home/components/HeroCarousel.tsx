import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ArrowRight, Sparkles, Shield, Clock, Zap } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

interface HeroCarouselProps {
  onPressExplore?: () => void;
  onPressEmergency?: () => void;
  onPressTrack?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    tag: "VERIFIED HEALTHCARE",
    title: "Find the Right Doctor\nwith Confidence",
    subtitle:
      "Explore 30+ verified medical specialties available for instant booking.",
    action: "Explore Doctors",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    accent: colors.primary,
    type: "explore",
  },
  {
    id: "2",
    tag: "ZERO WAITING",
    title: "Book Before\nYou Visit",
    subtitle:
      "Reserve your OPD token from home and skip crowded clinic waiting rooms.",
    action: "Book OPD Token",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    accent: "#16A34A",
    type: "explore",
  },
  {
    id: "3",
    tag: "LIVE QUEUE",
    title: "Arrive at the\nRight Time",
    subtitle:
      "Track live OPD queue token movements in real time with accurate ETA.",
    action: "Track Live Queue",
    bg: "#FAF5FF",
    border: "#E9D5FF",
    accent: "#9333EA",
    type: "track",
  },
  {
    id: "4",
    tag: "EMERGENCY OPD",
    title: "Every Second\nMatters",
    subtitle:
      "Direct 24/7 emergency care access and immediate walk-in guidance.",
    action: "Emergency Care",
    bg: "#FEF2F2",
    border: "#FECACA",
    accent: "#DC2626",
    type: "emergency",
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onPressExplore,
  onPressEmergency,
  onPressTrack,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeIndex];

  const handleAction = () => {
    if (slide.type === "emergency" && onPressEmergency) onPressEmergency();
    else if (slide.type === "track" && onPressTrack) onPressTrack();
    else if (onPressExplore) onPressExplore();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: slide.bg, borderColor: slide.border },
        ]}
      >
        {/* Top Tag Pill */}
        <View style={styles.tagRow}>
          <View style={[styles.tagPill, { borderColor: slide.border }]}>
            <Text style={[styles.tagText, { color: slide.accent }]}>
              {slide.tag}
            </Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        {/* Action Button & Indicator Row */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: slide.accent }]}
            onPress={handleAction}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonText}>{slide.action}</Text>
            <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Indicators */}
          <View style={styles.indicatorsRow}>
            {SLIDES.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveIndex(i)}
                style={[
                  styles.indicatorDot,
                  i === activeIndex
                    ? [styles.indicatorActive, { backgroundColor: slide.accent }]
                    : null,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  card: {
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1.5,
    ...shadows.card,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tagPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.md,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  indicatorsRow: {
    flexDirection: "row",
    gap: 5,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  indicatorActive: {
    width: 18,
    borderRadius: 3,
  },
});
