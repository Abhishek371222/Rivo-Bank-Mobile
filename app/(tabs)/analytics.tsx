import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  food: { label: "Food & Dining", icon: "restaurant-outline", color: "#f97316" },
  shopping: { label: "Shopping", icon: "bag-handle-outline", color: "#8b5cf6" },
  entertainment: { label: "Entertainment", icon: "game-controller-outline", color: "#ec4899" },
  bills: { label: "Bills & Utilities", icon: "flash-outline", color: "#eab308" },
  transfer: { label: "Transfers", icon: "swap-horizontal-outline", color: "#6366f1" },
};

function SpendingBar({ label, amount, total, color, icon }: { label: string; amount: number; total: number; color: string; icon: string }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <View style={styles.barItem}>
      <View style={styles.barHeader}>
        <View style={styles.barLeft}>
          <View style={[styles.barIcon, { backgroundColor: color + "15" }]}>
            <Ionicons name={icon as any} size={18} color={color} />
          </View>
          <Text style={styles.barLabel}>{label}</Text>
        </View>
        <Text style={styles.barAmount}>${amount.toFixed(0)}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.max(pct, 2)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { transactions } = useData();
  const { user } = useAuth();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const stats = useMemo(() => {
    const debitTxns = transactions.filter((t) => t.type === "debit");
    const creditTxns = transactions.filter((t) => t.type === "credit");
    const totalSpent = debitTxns.reduce((s, t) => s + t.amount, 0);
    const totalReceived = creditTxns.reduce((s, t) => s + t.amount, 0);
    const cashbackTxns = transactions.filter((t) => t.category === "cashback");
    const cashbackTotal = cashbackTxns.reduce((s, t) => s + t.amount, 0);

    const categoryBreakdown: Record<string, number> = {};
    debitTxns.forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    return { totalSpent, totalReceived, cashbackTotal, categoryBreakdown, txnCount: transactions.length };
  }, [transactions]);

  const sortedCategories = useMemo(() => {
    return Object.entries(stats.categoryBreakdown)
      .filter(([cat]) => categoryConfig[cat])
      .sort(([, a], [, b]) => b - a);
  }, [stats.categoryBreakdown]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + webBottomInset }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSubtitle}>This month's overview</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: Colors.error }]}>
            <Ionicons name="arrow-up-circle" size={24} color={Colors.error} />
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>${stats.totalSpent.toFixed(0)}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.success }]}>
            <Ionicons name="arrow-down-circle" size={24} color={Colors.success} />
            <Text style={styles.statLabel}>Received</Text>
            <Text style={styles.statValue}>${stats.totalReceived.toFixed(0)}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.warning }]}>
            <Ionicons name="gift" size={24} color={Colors.warning} />
            <Text style={styles.statLabel}>Cashback</Text>
            <Text style={styles.statValue}>${stats.cashbackTotal.toFixed(0)}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
            <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{stats.txnCount}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending Breakdown</Text>
            {sortedCategories.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bar-chart-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No spending data yet</Text>
              </View>
            ) : (
              sortedCategories.map(([cat, amount], i) => {
                const config = categoryConfig[cat];
                return (
                  <Animated.View key={cat} entering={FadeInDown.duration(400).delay(i * 100)}>
                    <SpendingBar
                      label={config.label}
                      amount={amount}
                      total={stats.totalSpent}
                      color={config.color}
                      icon={config.icon}
                    />
                  </Animated.View>
                );
              })
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rewards Summary</Text>
            <View style={styles.rewardRow}>
              <View style={styles.rewardCircle}>
                <Text style={styles.rewardPoints}>{user?.rewardPoints || 0}</Text>
                <Text style={styles.rewardLabel}>Points</Text>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardInfoTitle}>Keep earning!</Text>
                <Text style={styles.rewardInfoDesc}>
                  You're {Math.max(0, 5000 - (user?.rewardPoints || 0))} points away from your next reward tier.
                </Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(((user?.rewardPoints || 0) / 5000) * 100, 100)}%` },
                    ]}
                  />
                </View>
              </View>
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
  headerSubtitle: { fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.textSecondary, marginTop: 4 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "47%" as any,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    gap: 6,
  },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.text },
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
  barItem: { marginBottom: 16 },
  barHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  barLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  barIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  barLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  barAmount: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: Colors.inputBg },
  barFill: { height: 8, borderRadius: 4 },
  rewardRow: { flexDirection: "row", gap: 20, alignItems: "center" },
  rewardCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  rewardPoints: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.primary },
  rewardLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.primary },
  rewardInfo: { flex: 1 },
  rewardInfoTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text, marginBottom: 4 },
  rewardInfoDesc: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted, marginBottom: 10 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: Colors.inputBg },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  emptyState: { alignItems: "center", paddingVertical: 30, gap: 8 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textMuted },
});
