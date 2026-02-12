import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useData } from "@/contexts/DataContext";
import { Transaction } from "@/lib/types";

const categoryIcons: Record<string, { name: string; color: string; bg: string }> = {
  food: { name: "restaurant-outline", color: "#f97316", bg: "#fff7ed" },
  shopping: { name: "bag-handle-outline", color: "#8b5cf6", bg: "#f5f3ff" },
  entertainment: { name: "game-controller-outline", color: "#ec4899", bg: "#fdf2f8" },
  bills: { name: "flash-outline", color: "#eab308", bg: "#fefce8" },
  transfer: { name: "swap-horizontal-outline", color: "#6366f1", bg: "#eef2ff" },
  salary: { name: "briefcase-outline", color: "#10b981", bg: "#ecfdf5" },
  cashback: { name: "gift-outline", color: "#14b8a6", bg: "#f0fdfa" },
};

const filters = ["All", "Sent", "Received", "Bills"];

function TransactionItem({ item }: { item: Transaction }) {
  const catInfo = categoryIcons[item.category] || categoryIcons.transfer;
  return (
    <View style={styles.txnItem}>
      <View style={[styles.txnIcon, { backgroundColor: catInfo.bg }]}>
        <Ionicons name={catInfo.name as any} size={22} color={catInfo.color} />
      </View>
      <View style={styles.txnDetails}>
        <Text style={styles.txnMerchant} numberOfLines={1}>{item.merchant}</Text>
        <Text style={styles.txnCategory}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Text>
      </View>
      <View style={styles.txnRight}>
        <Text style={[styles.txnAmount, { color: item.type === "credit" ? Colors.success : Colors.text }]}>
          {item.type === "credit" ? "+" : "-"}${item.amount.toFixed(2)}
        </Text>
        <Text style={styles.txnDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );
}

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const { transactions } = useData();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (activeFilter === "Sent") filtered = filtered.filter((t) => t.type === "debit" && t.category === "transfer");
    if (activeFilter === "Received") filtered = filtered.filter((t) => t.type === "credit");
    if (activeFilter === "Bills") filtered = filtered.filter((t) => t.category === "bills");
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t) => t.merchant.toLowerCase().includes(q) || t.category.includes(q));
    }
    return filtered;
  }, [transactions, activeFilter, search]);

  const totalSpent = useMemo(
    () => transactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalReceived = useMemo(
    () => transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
        <Text style={styles.headerTitle}>Activity</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="arrow-up-circle" size={20} color={Colors.error} />
            <View>
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={styles.statValue}>${totalSpent.toFixed(0)}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="arrow-down-circle" size={20} color={Colors.success} />
            <View>
              <Text style={styles.statLabel}>Received</Text>
              <Text style={styles.statValue}>${totalReceived.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search transactions..."
            placeholderTextColor={Colors.textMuted}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          {filters.map((f) => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        contentContainerStyle={{ paddingBottom: 100 + webBottomInset }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, marginBottom: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterChipTextActive: { color: "#fff" },
  txnItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  txnIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  txnDetails: { flex: 1 },
  txnMerchant: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  txnCategory: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txnRight: { alignItems: "flex-end" },
  txnAmount: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  txnDate: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.textMuted },
});
