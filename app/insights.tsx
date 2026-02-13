import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function InsightsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const categories = [
        { name: "Food & Dining", amount: 12450, percentage: 35, color: "#f97316", icon: "restaurant" },
        { name: "Shopping", amount: 8900, percentage: 25, color: "#8b5cf6", icon: "cart" },
        { name: "Transport", amount: 5340, percentage: 15, color: "#3b82f6", icon: "car" },
        { name: "Entertainment", amount: 4450, percentage: 12, color: "#ec4899", icon: "game-controller" },
        { name: "Bills & Utilities", amount: 4560, percentage: 13, color: "#10b981", icon: "receipt" },
    ];

    const insights = [
        {
            icon: "trending-up",
            color: "#f97316",
            title: "High Spending Alert",
            description: "You spent 23% more on dining this month compared to last month",
            action: "View Details",
        },
        {
            icon: "bulb",
            color: "#10b981",
            title: "Savings Opportunity",
            description: "You could save ₹2,500/month by reducing food delivery orders",
            action: "See Tips",
        },
        {
            icon: "shield-checkmark",
            color: "#3b82f6",
            title: "Unusual Activity Detected",
            description: "A transaction of ₹5,000 at 2:30 AM was flagged for review",
            action: "Review",
        },
        {
            icon: "calendar",
            color: "#8b5cf6",
            title: "Upcoming Bills",
            description: "You have 3 bills totaling ₹8,450 due in the next 5 days",
            action: "Pay Now",
        },
    ];

    const predictions = [
        { month: "Feb", predicted: 35600, actual: 35600 },
        { month: "Mar", predicted: 38200, actual: null },
        { month: "Apr", predicted: 36800, actual: null },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => { Haptics.impactAsync(); router.back(); }}
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>AI Insights</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.summaryHeader}>
                            <View>
                                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Spending This Month</Text>
                                <Text style={[styles.summaryAmount, { color: colors.text }]}>₹35,700</Text>
                            </View>
                            <View style={[styles.aiIcon, { backgroundColor: colors.primary + "15" }]}>
                                <Ionicons name="sparkles" size={28} color={colors.primary} />
                            </View>
                        </View>
                        <View style={styles.comparisonRow}>
                            <View style={styles.comparison}>
                                <Ionicons name="arrow-up" size={16} color={colors.error} />
                                <Text style={[styles.comparisonText, { color: colors.error }]}>12% vs last month</Text>
                            </View>
                            <View style={styles.comparison}>
                                <Ionicons name="arrow-down" size={16} color={colors.success} />
                                <Text style={[styles.comparisonText, { color: colors.success }]}>8% below budget</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending by Category</Text>

                        {categories.map((category, index) => (
                            <View key={category.name} style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <View style={[styles.categoryIcon, { backgroundColor: category.color + "15" }]}>
                                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                                </View>
                                <View style={styles.categoryInfo}>
                                    <View style={styles.categoryHeader}>
                                        <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                                        <Text style={[styles.categoryAmount, { color: colors.text }]}>₹{category.amount.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                            <View style={[styles.progressFill, { width: `${category.percentage}%`, backgroundColor: category.color }]} />
                                        </View>
                                        <Text style={[styles.categoryPercentage, { color: colors.textMuted }]}>{category.percentage}%</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI-Powered Insights</Text>

                        {insights.map((insight, index) => (
                            <Pressable
                                key={index}
                                onPress={() => Haptics.impactAsync()}
                                style={[styles.insightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={[styles.insightIcon, { backgroundColor: insight.color + "15" }]}>
                                    <Ionicons name={insight.icon as any} size={24} color={insight.color} />
                                </View>
                                <View style={styles.insightContent}>
                                    <Text style={[styles.insightTitle, { color: colors.text }]}>{insight.title}</Text>
                                    <Text style={[styles.insightDescription, { color: colors.textSecondary }]}>{insight.description}</Text>
                                    <Text style={[styles.insightAction, { color: colors.primary }]}>{insight.action} →</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending Forecast</Text>

                        <View style={[styles.forecastCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.forecastHeader}>
                                <Ionicons name="analytics" size={24} color={colors.primary} />
                                <Text style={[styles.forecastTitle, { color: colors.text }]}>Next 3 Months Prediction</Text>
                            </View>

                            <View style={styles.forecastChart}>
                                {predictions.map((pred, index) => (
                                    <View key={pred.month} style={styles.forecastBar}>
                                        <View style={styles.barContainer}>
                                            <View
                                                style={[
                                                    styles.bar,
                                                    {
                                                        height: (pred.predicted / 40000) * 120,
                                                        backgroundColor: pred.actual ? colors.primary : colors.primary + "40",
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.forecastMonth, { color: colors.text }]}>{pred.month}</Text>
                                        <Text style={[styles.forecastAmount, { color: colors.textMuted }]}>
                                            ₹{(pred.predicted / 1000).toFixed(0)}k
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View style={[styles.forecastNote, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Ionicons name="information-circle" size={16} color={colors.primary} />
                                <Text style={[styles.forecastNoteText, { color: colors.textSecondary }]}>
                                    Based on your spending patterns and upcoming bills
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(500)}>
                    <View style={[styles.recommendationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.recommendationIcon, { backgroundColor: colors.success + "15" }]}>
                            <Ionicons name="trophy" size={32} color={colors.success} />
                        </View>
                        <Text style={[styles.recommendationTitle, { color: colors.text }]}>Recommended Budget</Text>
                        <Text style={[styles.recommendationDescription, { color: colors.textSecondary }]}>
                            Based on your income and spending habits, we recommend a monthly budget of ₹38,000
                        </Text>
                        <Pressable
                            onPress={() => { Haptics.impactAsync(); router.push("/budget-tracker"); }}
                            style={[styles.recommendationButton, { backgroundColor: colors.primary }]}
                        >
                            <Text style={styles.recommendationButtonText}>Set Budget</Text>
                        </Pressable>
                    </View>
                </Animated.View>
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
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    headerTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
        flex: 1,
        textAlign: "center",
    },
    summaryCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    summaryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    summaryLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
        marginBottom: 6,
    },
    summaryAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 32,
    },
    aiIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    comparisonRow: {
        flexDirection: "row",
        gap: 16,
    },
    comparison: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    comparisonText: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    sectionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
        marginBottom: 16,
    },
    categoryCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    categoryName: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
    },
    categoryAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
    },
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
    },
    categoryPercentage: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 12,
        width: 35,
    },
    insightCard: {
        flexDirection: "row",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    insightIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        marginBottom: 4,
    },
    insightDescription: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 8,
    },
    insightAction: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
    },
    forecastCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    forecastHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 24,
    },
    forecastTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
    },
    forecastChart: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        height: 160,
        marginBottom: 16,
    },
    forecastBar: {
        alignItems: "center",
        flex: 1,
    },
    barContainer: {
        height: 120,
        justifyContent: "flex-end",
        marginBottom: 8,
    },
    bar: {
        width: 40,
        borderRadius: 8,
    },
    forecastMonth: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
        marginBottom: 4,
    },
    forecastAmount: {
        fontFamily: "Inter_500Medium",
        fontSize: 11,
    },
    forecastNote: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    forecastNoteText: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        flex: 1,
    },
    recommendationCard: {
        marginHorizontal: 20,
        marginTop: 32,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
    },
    recommendationIcon: {
        width: 72,
        height: 72,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    recommendationTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 20,
        marginBottom: 8,
    },
    recommendationDescription: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 20,
    },
    recommendationButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    recommendationButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        color: "#fff",
    },
});
