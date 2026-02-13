import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

const CATEGORIES = [
    { id: "food", label: "Food & Dining", icon: "restaurant-outline", color: "#f97316" },
    { id: "shopping", label: "Shopping", icon: "bag-handle-outline", color: "#8b5cf6" },
    { id: "entertainment", label: "Entertainment", icon: "game-controller-outline", color: "#ec4899" },
    { id: "bills", label: "Bills & Utilities", icon: "flash-outline", color: "#eab308" },
    { id: "transfer", label: "Transfers", icon: "swap-horizontal-outline", color: "#6366f1" },
];

export default function BudgetTrackerScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [budgets, setBudgets] = useState([
        { category: "food", limit: 500, spent: 342, period: "monthly" },
        { category: "shopping", limit: 300, spent: 180, period: "monthly" },
        { category: "entertainment", limit: 200, spent: 195, period: "monthly" },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const getProgress = (spent: number, limit: number) => {
        return Math.min((spent / limit) * 100, 100);
    };

    const getStatusColor = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return colors.error;
        if (percentage >= 80) return colors.warning;
        return colors.success;
    };

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync();
                            router.back();
                        }}
                        style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Budget Tracker</Text>
                    <Pressable
                        onPress={() => Haptics.impactAsync()}
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </Pressable>
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                            Monthly Budget Overview
                        </Text>
                        <View style={styles.overviewRow}>
                            <View style={styles.overviewItem}>
                                <Text style={[styles.overviewAmount, { color: colors.text }]}>
                                    ${totalSpent.toFixed(0)}
                                </Text>
                                <Text style={[styles.overviewSubtext, { color: colors.textMuted }]}>Spent</Text>
                            </View>
                            <View style={styles.overviewDivider} />
                            <View style={styles.overviewItem}>
                                <Text style={[styles.overviewAmount, { color: colors.text }]}>
                                    ${totalBudget.toFixed(0)}
                                </Text>
                                <Text style={[styles.overviewSubtext, { color: colors.textMuted }]}>Budget</Text>
                            </View>
                            <View style={styles.overviewDivider} />
                            <View style={styles.overviewItem}>
                                <Text style={[styles.overviewAmount, { color: colors.success }]}>
                                    ${(totalBudget - totalSpent).toFixed(0)}
                                </Text>
                                <Text style={[styles.overviewSubtext, { color: colors.textMuted }]}>Left</Text>
                            </View>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: colors.inputBg }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${getProgress(totalSpent, totalBudget)}%`,
                                        backgroundColor: getStatusColor(totalSpent, totalBudget),
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Budgets</Text>
                    {budgets.map((budget, index) => {
                        const category = CATEGORIES.find((c) => c.id === budget.category);
                        if (!category) return null;

                        const progress = getProgress(budget.spent, budget.limit);
                        const statusColor = getStatusColor(budget.spent, budget.limit);
                        const remaining = budget.limit - budget.spent;

                        return (
                            <Animated.View
                                key={budget.category}
                                entering={FadeInDown.duration(500).delay(200 + index * 100)}
                            >
                                <Pressable
                                    onPress={() => Haptics.impactAsync()}
                                    style={[styles.budgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                >
                                    <View style={styles.budgetHeader}>
                                        <View style={styles.budgetLeft}>
                                            <View style={[styles.categoryIcon, { backgroundColor: category.color + "15" }]}>
                                                <Ionicons name={category.icon as any} size={22} color={category.color} />
                                            </View>
                                            <View>
                                                <Text style={[styles.categoryLabel, { color: colors.text }]}>
                                                    {category.label}
                                                </Text>
                                                <Text style={[styles.budgetPeriod, { color: colors.textMuted }]}>
                                                    {budget.period}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.budgetRight}>
                                            <Text style={[styles.budgetAmount, { color: colors.text }]}>
                                                ${budget.spent.toFixed(0)} / ${budget.limit.toFixed(0)}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.budgetRemaining,
                                                    { color: remaining >= 0 ? colors.success : colors.error },
                                                ]}
                                            >
                                                {remaining >= 0 ? `$${remaining.toFixed(0)} left` : `$${Math.abs(remaining).toFixed(0)} over`}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.progressTrack, { backgroundColor: colors.inputBg }]}>
                                        <Animated.View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${progress}%`,
                                                    backgroundColor: statusColor,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <View style={styles.budgetFooter}>
                                        <Text style={[styles.progressText, { color: colors.textMuted }]}>
                                            {progress.toFixed(0)}% used
                                        </Text>
                                        {progress >= 80 && (
                                            <View style={[styles.warningBadge, { backgroundColor: statusColor + "15" }]}>
                                                <Ionicons name="warning" size={12} color={statusColor} />
                                                <Text style={[styles.warningText, { color: statusColor }]}>
                                                    {progress >= 100 ? "Exceeded" : "Near limit"}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, flex: 1, textAlign: "center" },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    overviewCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
    },
    overviewLabel: { fontFamily: "Inter_500Medium", fontSize: 14, marginBottom: 16 },
    overviewRow: { flexDirection: "row", marginBottom: 16 },
    overviewItem: { flex: 1, alignItems: "center" },
    overviewAmount: { fontFamily: "Inter_700Bold", fontSize: 24, marginBottom: 4 },
    overviewSubtext: { fontFamily: "Inter_400Regular", fontSize: 12 },
    overviewDivider: { width: 1, backgroundColor: "#e5e7eb", marginHorizontal: 12 },
    progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
    progressFill: { height: 8, borderRadius: 4 },
    section: { paddingHorizontal: 20 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, marginBottom: 16 },
    budgetCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    budgetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    budgetLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    categoryIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    budgetPeriod: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    budgetRight: { alignItems: "flex-end" },
    budgetAmount: { fontFamily: "Inter_600SemiBold", fontSize: 14, marginBottom: 4 },
    budgetRemaining: { fontFamily: "Inter_500Medium", fontSize: 12 },
    budgetFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    progressText: { fontFamily: "Inter_400Regular", fontSize: 12 },
    warningBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    warningText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
});
