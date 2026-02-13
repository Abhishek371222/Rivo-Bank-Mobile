import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import * as Haptics from "expo-haptics";

const categoryIcons: Record<string, { name: string; color: string; bg: string }> = {
  food: { name: "restaurant-outline", color: "#f97316", bg: "#fff7ed" },
  shopping: { name: "bag-handle-outline", color: "#8b5cf6", bg: "#f5f3ff" },
  entertainment: { name: "game-controller-outline", color: "#ec4899", bg: "#fdf2f8" },
  bills: { name: "flash-outline", color: "#eab308", bg: "#fefce8" },
  transfer: { name: "swap-horizontal-outline", color: "#6366f1", bg: "#eef2ff" },
  salary: { name: "briefcase-outline", color: "#10b981", bg: "#ecfdf5" },
  cashback: { name: "gift-outline", color: "#14b8a6", bg: "#f0fdfa" },
};

function AnimatedBalance({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = value;
    const step = target / 30;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplay(current);
    }, 20);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <Text style={styles.balanceAmount}>
      ${display.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </Text>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { transactions, card, unreadCount, refreshData, isLoading } = useData();
  const [showCvv, setShowCvv] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const recentTransactions = transactions.slice(0, 5);

  async function onRefresh() {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }

  const quickActions = [
    { icon: "send" as const, label: "Send", color: Colors.primary, onPress: () => router.push("/send-money") },
    { icon: "download" as const, label: "Request", color: Colors.success, onPress: () => Haptics.impactAsync() },
    { icon: "add-circle" as const, label: "Add", color: Colors.secondary, onPress: () => Haptics.impactAsync() },
    { icon: "flash" as const, label: "Pay Bills", color: Colors.warning, onPress: () => Haptics.impactAsync() },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + webBottomInset }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={[styles.headerContainer, { paddingTop: insets.top + webTopInset + 8 }]}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
            <Text style={styles.userName}>{user?.fullName?.split(" ")[0] || "User"}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(); router.push("/notifications"); }}
            style={styles.notifButton}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <Pressable
            onPress={() => { setShowCvv(!showCvv); Haptics.impactAsync(); }}
            style={({ pressed }) => [styles.cardPressable, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <LinearGradient
              colors={[Colors.cardGradientStart, Colors.cardGradientEnd, "#a78bfa"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
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
                {card ? `${card.cardNumber.slice(0, 4)}  ${card.cardNumber.slice(5, 9)}  ${card.cardNumber.slice(10, 14)}  ${card.cardNumber.slice(15)}` : "**** **** **** ****"}
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
                <View>
                  <Text style={styles.cardLabel}>CVV</Text>
                  <Text style={styles.cardValue}>{showCvv ? card?.cvv : "***"}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <View style={styles.balanceLive}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
          <AnimatedBalance value={user?.balance || 0} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.quickActionsContainer}>
          {quickActions.map((action, i) => (
            <Pressable
              key={action.label}
              onPress={() => { Haptics.impactAsync(); action.onPress(); }}
              style={({ pressed }) => [styles.quickAction, pressed && { transform: [{ scale: 0.92 }] }]}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + "15" }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Borrow Money Widget */}
        <Animated.View entering={FadeInDown.duration(500).delay(350)}>
          <Pressable
            onPress={() => { Haptics.impactAsync(); router.push("/borrow"); }}
            style={({ pressed }) => [styles.borrowCard, pressed && { opacity: 0.9 }]}
          >
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.borrowGradient}
            >
              <View style={styles.borrowLeft}>
                <View style={styles.borrowIcon}>
                  <Ionicons name="cash" size={28} color="#fff" />
                </View>
                <View>
                  <Text style={styles.borrowTitle}>Need Quick Cash?</Text>
                  <Text style={styles.borrowSubtitle}>Get instant loans up to ₹50,000</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Scan & Pay Widget */}
        <Animated.View entering={FadeInDown.duration(500).delay(375)}>
          <Pressable
            onPress={() => { Haptics.impactAsync(); router.push("/scan-pay"); }}
            style={({ pressed }) => [styles.scanCard, pressed && { opacity: 0.9 }]}
          >
            <LinearGradient
              colors={["#6366f1", "#4f46e5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanGradient}
            >
              <View style={styles.scanLeft}>
                <View style={styles.scanIcon}>
                  <Ionicons name="scan" size={28} color="#fff" />
                </View>
                <View>
                  <Text style={styles.scanTitle}>Scan & Pay</Text>
                  <Text style={styles.scanSubtitle}>Pay merchants instantly with QR</Text>
                </View>
              </View>
              <Ionicons name="qr-code" size={32} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable onPress={() => router.push("/(tabs)/transactions")}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            recentTransactions.map((txn, i) => {
              const catInfo = categoryIcons[txn.category] || categoryIcons.transfer;
              return (
                <Animated.View key={txn.id} entering={FadeInRight.duration(400).delay(i * 80)}>
                  <View style={styles.txnItem}>
                    <View style={[styles.txnIcon, { backgroundColor: catInfo.bg }]}>
                      <Ionicons name={catInfo.name as any} size={22} color={catInfo.color} />
                    </View>
                    <View style={styles.txnDetails}>
                      <Text style={styles.txnMerchant} numberOfLines={1}>{txn.merchant}</Text>
                      <Text style={styles.txnDate}>{formatDate(txn.date)}</Text>
                    </View>
                    <Text style={[styles.txnAmount, { color: txn.type === "credit" ? Colors.success : Colors.text }]}>
                      {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                    </Text>
                  </View>
                </Animated.View>
              );
            })
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  userName: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.text },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff" },
  cardPressable: { marginHorizontal: 20, marginBottom: 16 },
  card: {
    borderRadius: 20,
    padding: 24,
    minHeight: 200,
    justifyContent: "space-between",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardBrandText: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff" },
  cardChip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    paddingHorizontal: 4,
    gap: 3,
    marginTop: 16,
  },
  chipLine: { height: 2, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 1 },
  cardNumber: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#fff",
    letterSpacing: 2,
    marginTop: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 2 },
  cardValue: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  balanceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  balanceLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.textSecondary },
  balanceLive: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.success },
  balanceAmount: { fontFamily: "Inter_700Bold", fontSize: 36, color: Colors.text },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  quickAction: { alignItems: "center", gap: 8 },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  seeAll: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.primary },
  txnItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
  },
  txnIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  txnDetails: { flex: 1 },
  txnMerchant: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  txnDate: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  txnAmount: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textMuted },
  borrowCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  borrowGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  borrowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  borrowIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  borrowTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  borrowSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  scanCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  scanGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  scanLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  scanIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  scanSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
});
