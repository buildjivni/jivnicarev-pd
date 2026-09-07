import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MapPin, Crosshair } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

interface LocationSelectorProps {
  district?: string;
  onSelectDistrict?: (d: string) => void;
  onPressGPS?: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  district = "Jamui",
  onSelectDistrict,
  onPressGPS,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [val, setVal] = useState(district);

  const handleGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setVal("Jamui");
      if (onSelectDistrict) onSelectDistrict("Jamui");
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topLabel}>
        {val ? `LOCATION: ${val.toUpperCase()}` : "SELECT LOCATION"}
      </Text>

      <View style={styles.inputBox}>
        <View style={styles.mapPinCircle}>
          <MapPin size={16} color="#059669" strokeWidth={2.2} />
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Enter city or district..."
          placeholderTextColor={colors.textMuted}
          value={val}
          onChangeText={(t) => {
            setVal(t);
            if (onSelectDistrict) onSelectDistrict(t);
          }}
        />

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={handleGPS}
          disabled={isLocating}
          activeOpacity={0.7}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Crosshair size={18} color="#64748B" strokeWidth={2.2} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  topLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: radius.lg,
    paddingHorizontal: 10,
    height: 48,
    ...shadows.soft,
  },
  mapPinCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  gpsButton: {
    padding: 6,
    borderRadius: radius.md,
  },
});
