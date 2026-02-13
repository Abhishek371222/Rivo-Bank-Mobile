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
import Svg, { Circle } from "react-native-svg";

const GOAL_ICONS = [
    { id: "airplane", name: "airplane", color: "#3b82f6" },
    { id: "home", name: "home", color: "#10b981" },
    { id: "car", name: "car-sport", color: "#f59e0b" },
    { id: "gift", name: "gift", color: "#ec4899" },
    { id: "school", name: "school", color: "#8b5cf6" },
    { id: "medical", name: "medical", color: "#ef4444" },
];

interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    icon: string;
    color: string;
}

export default function SavingsGoalsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [goals] = useState<SavingsGoal[]>([
        {
            id: "1",
            name: "Summer Vacation",
            targetAmount: 3000,
            currentAmount: 1850,
            deadline: "2026-06-01",
            icon: "airplane",
            color: "#3b82f6",
        },
        {
            id: "2",
            name: "Emergency Fund",
            targetAmount: 10000,
            currentAmount: 6200,
            deadline: "2026-12-31",
            icon: "shield-checkmark",
            color: "#10b981",
        },
        {
            id: "3",
            name: "New Laptop",
            targetAmount: 1500,
            currentAmount: 450,
            deadline: "2026-04-15",
            icon: "laptop",
            color: "#8b5cf6",
        },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Savings Goals</Text>
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
                            Total Savings Progress
                        </Text>
                        <View style={styles.overviewRow}>
                            <View style={styles.overviewItem}>
                                <Text style={[styles.overviewAmount, { color: colors.success }]}>
                                    ${totalSaved.toLocaleString()}
                                </Text>
                                <Text style={[styles.overviewSubtext, { color: colors.textMuted }]}>Saved</Text>
                            </View>
                            <View style={styles.overviewDivider} />
                            <View style={styles.overviewItem}>
                                <Text style={[styles.overviewAmount, { color: colors.text }]}>
                                    ${totalTarget.toLocaleString()}
                                </Text>
                                <Text style={[styles.overviewSubtext, { color: colors.textMuted }]}>Target</Text>
                            </View>
                            <View style={styles.overviewDivider} />
                            <View style={styles.overviewItem}>
                                <Text style={[styles.overviewAmount, { color: colors.primary }]}>
                                    {((totalSaved / totalTarget) * 100).toFixed(0)}%
                                </Text>
                                <Text style={[styles.overviewSubtext, { color: colors.textMuted }]}>Complete</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Goals</Text>
                    {goals.map((goal, index) => (
                        <Animated.View
                            key={goal.id}
                            entering={FadeInDown.duration(500).delay(200 + index * 100)}
                        >
                            <GoalCard goal={goal} colors={colors} />
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function GoalCard({ goal, colors }: { goal: SavingsGoal; colors: any }) {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;

    const radius = 50;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Pressable
            onPress={() => Haptics.impactAsync()}
            style={[styles.goalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
            <View style={styles.goalLeft}>
                <View style={styles.progressCircle}>
                    <Svg width={120} height={120}>
                        <Circle
                            cx={60}
                            cy={60}
                            r={radius}
                            stroke={colors.inputBg}
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        <Circle
                            cx={60}
                            cy={60}
                            r={radius}
                            stroke={goal.color}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform={`rotate(-90 60 60)`}
                        />
                    </Svg>
                    <View style={styles.progressContent}>
                        <Ionicons name={goal.icon as any} size={32} color={goal.color} />
                        <Text style={[styles.progressPercent, { color: colors.text }]}>
                            {progress.toFixed(0)}%
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.goalRight}>
                <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
                <View style={styles.goalAmounts}>
                    <Text style={[styles.goalCurrent, { color: colors.success }]}>
                        ${goal.currentAmount.toLocaleString()}
                    </Text>
                    <Text style={[styles.goalTarget, { color: colors.textMuted }]}>
                        {" "}/ ${goal.targetAmount.toLocaleString()}
                    </Text>
                </View>
                <Text style={[styles.goalRemaining, { color: colors.textSecondary }]}>
                    ${remaining.toLocaleString()} to go
                </Text>
                <Text style={[styles.goalDeadline, { color: colors.textMuted }]}>
                    Target: {new Date(goal.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Text>
                <Pressable
                    onPress={() => Haptics.impactAsync()}
                    style={[styles.contributeButton, { backgroundColor: goal.color }]}
                >
                    <Ionicons name="add-circle" size={16} color="#fff" />
                    <Text style={styles.contributeText}>Contribute</Text>
                </Pressable>
            </View>
        </Pressable>
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
    overviewRow: { flexDirection: "row" },
    overviewItem: { flex: 1, alignItems: "center" },
    overviewAmount: { fontFamily: "Inter_700Bold", fontSize: 24, marginBottom: 4 },
    overviewSubtext: { fontFamily: "Inter_400Regular", fontSize: 12 },
    overviewDivider: { width: 1, backgroundColor: "#e5e7eb", marginHorizontal: 12 },
    section: { paddingHorizontal: 20 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, marginBottom: 16 },
    goalCard: {
        flexDirection: "row",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        gap: 20,
    },
    goalLeft: { justifyContent: "center" },
    progressCircle: { position: "relative", width: 120, height: 120 },
    progressContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    progressPercent: { fontFamily: "Inter_700Bold", fontSize: 16 },
    goalRight: { flex: 1, justifyContent: "center" },
    goalName: { fontFamily: "Inter_700Bold", fontSize: 18, marginBottom: 8 },
    goalAmounts: { flexDirection: "row", alignItems: "baseline", marginBottom: 4 },
    goalCurrent: { fontFamily: "Inter_700Bold", fontSize: 20 },
    goalTarget: { fontFamily: "Inter_500Medium", fontSize: 14 },
    goalRemaining: { fontFamily: "Inter_500Medium", fontSize: 13, marginBottom: 4 },
    goalDeadline: { fontFamily: "Inter_400Regular", fontSize: 12, marginBottom: 12 },
    contributeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    contributeText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        color: "#fff",
    },
});
