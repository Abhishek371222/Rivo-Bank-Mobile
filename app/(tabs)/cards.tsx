import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useData } from "@/contexts/DataContext";
import * as Haptics from "expo-haptics";

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const { card, toggleCardFreeze, updateSpendingLimit, toggleCardControl } = useData();
  const [isFlipped, setIsFlipped] = useState(false);
  const [localLimit, setLocalLimit] = useState(card?.spendingLimit || 5000);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const limitOptions = [1000, 2500, 5000, 10000, 25000];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + webBottomInset }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <Text style={styles.headerTitle}>My Card</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(600)}>
          <Pressable
            onPress={() => { setIsFlipped(!isFlipped); Haptics.impactAsync(); }}
            style={({ pressed }) => [styles.cardPressable, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            {!isFlipped ? (
              <LinearGradient
                colors={[Colors.cardGradientStart, Colors.cardGradientEnd, "#a78bfa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                {card?.isFrozen && (
                  <View style={styles.frozenOverlay}>
                    <Ionicons name="snow" size={32} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.frozenText}>Card Frozen</Text>
                  </View>
                )}
                <View style={styles.cardHeader}>
                  <View style={styles.cardBrand}>
                    <Ionicons name="wallet" size={28} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.cardBrandText}>Rivo</Text>
                  </View>
                  <MaterialCommunityIcons name="contactless-payment" size={28} color="rgba(255,255,255,0.7)" />
                </View>
                <View style={styles.cardChip}>
                  <View style={styles.chipLine} />
                  <View style={styles.chipLine} />
                  <View style={styles.chipLine} />
                </View>
                <Text style={styles.cardNumber}>
                  {card ? card.cardNumber : "**** **** **** ****"}
                </Text>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardLabel}>CARDHOLDER</Text>
                    <Text style={styles.cardValue}>{card?.cardHolder || "YOUR NAME"}</Text>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>EXPIRES</Text>
                    <Text style={styles.cardValue}>{card?.expiryDate || "MM/YY"}</Text>
                  </View>
                </View>
                <Text style={styles.tapHint}>Tap to flip</Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={["#4f46e5", "#6366f1", "#818cf8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardBack}
              >
                <View style={styles.magStripe} />
                <View style={styles.cvvStrip}>
                  <Text style={styles.cvvLabel}>CVV</Text>
                  <View style={styles.cvvBox}>
                    <Text style={styles.cvvValue}>{card?.cvv || "***"}</Text>
                  </View>
                </View>
                <Text style={styles.tapHint}>Tap to flip back</Text>
              </LinearGradient>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Controls</Text>

            <View style={styles.controlItem}>
              <View style={styles.controlLeft}>
                <View style={[styles.controlIcon, { backgroundColor: "#eef2ff" }]}>
                  <Ionicons name="snow" size={22} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.controlLabel}>Freeze Card</Text>
                  <Text style={styles.controlDesc}>Temporarily disable transactions</Text>
                </View>
              </View>
              <Switch
                value={card?.isFrozen || false}
                onValueChange={() => { toggleCardFreeze(); Haptics.impactAsync(); }}
                trackColor={{ false: Colors.border, true: Colors.primary + "60" }}
                thumbColor={card?.isFrozen ? Colors.primary : "#f4f3f4"}
              />
            </View>

            <View style={styles.controlItem}>
              <View style={styles.controlLeft}>
                <View style={[styles.controlIcon, { backgroundColor: "#ecfdf5" }]}>
                  <Ionicons name="globe-outline" size={22} color={Colors.success} />
                </View>
                <View>
                  <Text style={styles.controlLabel}>Online Payments</Text>
                  <Text style={styles.controlDesc}>Allow online transactions</Text>
                </View>
              </View>
              <Switch
                value={card?.onlineEnabled || false}
                onValueChange={() => { toggleCardControl("onlineEnabled"); Haptics.impactAsync(); }}
                trackColor={{ false: Colors.border, true: Colors.success + "60" }}
                thumbColor={card?.onlineEnabled ? Colors.success : "#f4f3f4"}
              />
            </View>

            <View style={styles.controlItem}>
              <View style={styles.controlLeft}>
                <View style={[styles.controlIcon, { backgroundColor: "#fef3c7" }]}>
                  <MaterialCommunityIcons name="atm" size={22} color={Colors.warning} />
                </View>
                <View>
                  <Text style={styles.controlLabel}>ATM Withdrawals</Text>
                  <Text style={styles.controlDesc}>Allow ATM cash withdrawals</Text>
                </View>
              </View>
              <Switch
                value={card?.atmEnabled || false}
                onValueChange={() => { toggleCardControl("atmEnabled"); Haptics.impactAsync(); }}
                trackColor={{ false: Colors.border, true: Colors.warning + "60" }}
                thumbColor={card?.atmEnabled ? Colors.warning : "#f4f3f4"}
              />
            </View>

            <View style={styles.controlItem}>
              <View style={styles.controlLeft}>
                <View style={[styles.controlIcon, { backgroundColor: "#fdf2f8" }]}>
                  <MaterialCommunityIcons name="contactless-payment" size={22} color="#ec4899" />
                </View>
                <View>
                  <Text style={styles.controlLabel}>Contactless</Text>
                  <Text style={styles.controlDesc}>Tap-to-pay transactions</Text>
                </View>
              </View>
              <Switch
                value={card?.contactlessEnabled || false}
                onValueChange={() => { toggleCardControl("contactlessEnabled"); Haptics.impactAsync(); }}
                trackColor={{ false: Colors.border, true: "#ec4899" + "60" }}
                thumbColor={card?.contactlessEnabled ? "#ec4899" : "#f4f3f4"}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending Limit</Text>
            <Text style={styles.limitDisplay}>
              ${(card?.spendingLimit || localLimit).toLocaleString()} / day
            </Text>
            <View style={styles.limitOptions}>
              {limitOptions.map((limit) => (
                <Pressable
                  key={limit}
                  onPress={() => {
                    setLocalLimit(limit);
                    updateSpendingLimit(limit);
                    Haptics.impactAsync();
                  }}
                  style={[
                    styles.limitChip,
                    (card?.spendingLimit || localLimit) === limit && styles.limitChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.limitChipText,
                      (card?.spendingLimit || localLimit) === limit && styles.limitChipTextActive,
                    ]}
                  >
                    ${(limit / 1000).toFixed(0)}K
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text },
  cardPressable: { marginHorizontal: 20, marginBottom: 20 },
  card: { borderRadius: 20, padding: 24, minHeight: 210, justifyContent: "space-between" },
  cardBack: { borderRadius: 20, paddingVertical: 30, minHeight: 210, justifyContent: "space-between" },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    gap: 8,
  },
  frozenText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardBrandText: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff" },
  cardChip: {
    width: 40, height: 28, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center", paddingHorizontal: 4, gap: 3, marginTop: 16,
  },
  chipLine: { height: 2, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 1 },
  cardNumber: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: "#fff", letterSpacing: 2, marginTop: 16 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cardLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 2 },
  cardValue: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
  tapHint: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 8 },
  magStripe: { height: 48, backgroundColor: "rgba(0,0,0,0.3)", marginBottom: 20 },
  cvvStrip: { paddingHorizontal: 24, flexDirection: "row", alignItems: "center", gap: 12 },
  cvvLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.6)" },
  cvvBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cvvValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff", letterSpacing: 4 },
  section: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text, marginBottom: 16 },
  controlItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  controlLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  controlIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  controlLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  controlDesc: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  limitDisplay: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.primary, marginBottom: 16 },
  limitOptions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  limitChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  limitChipActive: { backgroundColor: Colors.primary + "15", borderColor: Colors.primary },
  limitChipText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.textSecondary },
  limitChipTextActive: { color: Colors.primary },
});
