import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react-native";
import { colors, radius, shadows } from "../../../theme";

const FAQS = [
  {
    q: "How does live OPD queue tracking work?",
    a: "Once you book a token, you get a unique token number and live queue link. You can see which token is currently inside the doctor's room and your estimated consultation time.",
  },
  {
    q: "Do I have to pay online or at clinic?",
    a: "You can choose to pay the consultation fee in cash at the clinic reception or pay securely online during booking.",
  },
  {
    q: "What if the doctor is running late?",
    a: "Our queue system automatically recalculates wait times in real time so you are notified before you leave home.",
  },
  {
    q: "How are doctors verified on JivniCare?",
    a: "Every doctor undergoes identity and medical registration verification along with physical clinic inspection.",
  },
];

export const FaqTrustSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <View style={styles.container}>
      {/* Zero Wait Guarantee Banner */}
      <View style={styles.guaranteeBox}>
        <ShieldCheck size={24} color="#059669" />
        <View style={styles.guaranteeTextCol}>
          <Text style={styles.guaranteeTitle}>
            JivniCare Zero-Wait Guarantee
          </Text>
          <Text style={styles.guaranteeDesc}>
            Real-time queue tracking protects your precious time.
          </Text>
        </View>
      </View>

      <Text style={styles.title}>Frequently Asked Questions</Text>

      <View style={styles.faqList}>
        {FAQS.map((faq, i) => {
          const isOpen = expandedIndex === i;
          return (
            <View key={i} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggle(i)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                {isOpen ? (
                  <ChevronUp size={18} color={colors.primary} />
                ) : (
                  <ChevronDown size={18} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
              {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  guaranteeTextCol: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#065F46",
  },
  guaranteeDesc: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 14,
    ...shadows.soft,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
});
