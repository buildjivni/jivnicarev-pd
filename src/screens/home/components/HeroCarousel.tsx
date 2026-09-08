import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { colors, radius } from "../../../theme";

interface HeroCarouselProps {
  onPressExplore?: () => void;
  onPressEmergency?: () => void;
  onPressTrack?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 32; // 16px padding on both sides
const BANNER_ASPECT_RATIO = 1080 / 500; // 2.16

const MARKETING_SLIDES = [
  {
    id: "1",
    type: "explore",
    title: "Find Verified Doctors Nearby",
    image: require("../../../../assets/images/marketing_banner_1.png"),
  },
  {
    id: "2",
    type: "explore",
    title: "Book Before You Visit Clinic",
    image: require("../../../../assets/images/marketing_banner_2.png"),
  },
  {
    id: "3",
    type: "track",
    title: "Arrive at Clinic Right on Time",
    image: require("../../../../assets/images/marketing_banner_3.png"),
  },
  {
    id: "4",
    type: "emergency",
    title: "Instant 24/7 Emergency Care",
    image: require("../../../../assets/images/marketing_banner_4.png"),
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onPressExplore,
  onPressEmergency,
  onPressTrack,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0.15,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setActiveIndex((prev) => (prev + 1) % MARKETING_SLIDES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const slide = MARKETING_SLIDES[activeIndex];

  const handleAction = () => {
    if (slide.type === "emergency" && onPressEmergency) onPressEmergency();
    else if (slide.type === "track" && onPressTrack) onPressTrack();
    else if (onPressExplore) onPressExplore();
  };

  const handleSelectSlide = (index: number) => {
    if (index === activeIndex) return;
    Animated.timing(fadeAnim, {
      toValue: 0.2,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setActiveIndex(index);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {/* ── FULL-BLEED MARKETING BANNER CARD ── */}
      <TouchableOpacity
        style={styles.bannerTouchable}
        activeOpacity={0.93}
        onPress={handleAction}
      >
        <Animated.View style={[styles.bannerContainer, { opacity: fadeAnim }]}>
          <Image
            source={slide.image}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* ── PAGINATION INDICATOR CAPSULES ── */}
      <View style={styles.indicatorsRow}>
        {MARKETING_SLIDES.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelectSlide(i)}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              style={[
                styles.indicatorDot,
                isActive ? styles.indicatorActive : styles.indicatorInactive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  bannerTouchable: {
    width: BANNER_WIDTH,
    height: BANNER_WIDTH / BANNER_ASPECT_RATIO,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F0F7FD", // soft light brand fallback
    borderWidth: 1,
    borderColor: "rgba(86, 150, 199, 0.22)",
    ...Platform.select({
      ios: {
        shadowColor: "#1B3F6B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  bannerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  indicatorsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  indicatorDot: {
    height: 5,
    borderRadius: 3,
  },
  indicatorInactive: {
    width: 6,
    backgroundColor: "#CBD5E1",
  },
  indicatorActive: {
    width: 22,
    backgroundColor: colors.primary, // #5696C7
  },
});

