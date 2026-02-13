import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    isUnlocked: boolean;
    unlockedAt?: string;
    progress?: number;
    maxProgress?: number;
}

export default function AchievementsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [achievements] = useState<Achievement[]>([
        {
            id: "1",
            title: "First Transaction",
            description: "Complete your first transaction",
            icon: "rocket",
            color: "#3b82f6",
            isUnlocked: true,
            unlockedAt: "2026-01-10",
        },
        {
            id: "2",
            title: "Savings Master",
            description: "Save $1,000 in your account",
            icon: "trophy",
            color: "#f59e0b",
            isUnlocked: true,
            unlockedAt: "2026-01-25",
        },
        {
            id: "3",
            title: "Social Butterfly",
            description: "Refer 5 friends to Rivo Bank",
            icon: "people",
            color: "#ec4899",
            isUnlocked: false,
            progress: 3,
            maxProgress: 5,
        },
        {
            id: "4",
            title: "Budget Pro",
            description: "Stay within budget for 3 months",
            icon: "bar-chart",
            color: "#10b981",
            isUnlocked: false,
            progress: 1,
            maxProgress: 3,
        },
        {
            id: "5",
            title: "Early Bird",
            description: "Pay all bills before due date for a month",
            icon: "time",
            color: "#8b5cf6",
            isUnlocked: false,
            progress: 18,
            maxProgress: 30,
        },
        {
            id: "6",
            title: "Big Spender",
            description: "Make a transaction over $500",
            icon: "cash",
            color: "#ef4444",
            isUnlocked: true,
            unlockedAt: "2026-02-01",
        },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
    const totalCount = achievements.length;

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Achievements</Text>
                    <View style={{ width: 44 }} />
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.progressHeader}>
                            <View>
                                <Text style={[styles.progressTitle, { color: colors.text }]}>Your Progress</Text>
                                <Text style={[styles.progressSubtitle, { color: colors.textMuted }]}>
                                    Keep unlocking achievements!
                                </Text>
                            </View>
                            <View style={[styles.progressBadge, { backgroundColor: colors.primary + "15" }]}>
                                <Text style={[styles.progressCount, { color: colors.primary }]}>
                                    {unlockedCount}/{totalCount}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.progressBar, { backgroundColor: colors.inputBg }]}>
                            <Animated.View
                                entering={FadeInDown.duration(800).delay(200)}
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${(unlockedCount / totalCount) * 100}%`,
                                        backgroundColor: colors.primary,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Unlocked ({unlockedCount})
                    </Text>
                    {achievements
                        .filter((a) => a.isUnlocked)
                        .map((achievement, index) => (
                            <Animated.View
                                key={achievement.id}
                                entering={ZoomIn.duration(500).delay(200 + index * 100)}
                            >
                                <AchievementCard achievement={achievement} colors={colors} />
                            </Animated.View>
                        ))}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        Locked ({totalCount - unlockedCount})
                    </Text>
                    {achievements
                        .filter((a) => !a.isUnlocked)
                        .map((achievement, index) => (
                            <Animated.View
                                key={achievement.id}
                                entering={FadeInDown.duration(400).delay(index * 50)}
                            >
                                <AchievementCard achievement={achievement} colors={colors} />
                            </Animated.View>
                        ))}
                </View>
            </ScrollView>
        </View>
    );
}

function AchievementCard({ achievement, colors }: { achievement: Achievement; colors: any }) {
    return (
        <Pressable
            onPress={() => Haptics.impactAsync()}
            style={[
                styles.achievementCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                !achievement.isUnlocked && { opacity: 0.6 },
            ]}
        >
            <View
                style={[
                    styles.achievementIcon,
                    {
                        backgroundColor: achievement.isUnlocked
                            ? achievement.color + "15"
                            : colors.inputBg,
                    },
                ]}
            >
                <Ionicons
                    name={achievement.icon as any}
                    size={32}
                    color={achievement.isUnlocked ? achievement.color : colors.textMuted}
                />
                {achievement.isUnlocked && (
                    <View style={[styles.checkBadge, { backgroundColor: achievement.color }]}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                    </View>
                )}
            </View>
            <View style={styles.achievementContent}>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                    {achievement.title}
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textMuted }]}>
                    {achievement.description}
                </Text>
                {achievement.isUnlocked && achievement.unlockedAt && (
                    <Text style={[styles.achievementDate, { color: colors.success }]}>
                        Unlocked on{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </Text>
                )}
                {!achievement.isUnlocked && achievement.progress !== undefined && (
                    <View style={styles.achievementProgress}>
                        <View style={[styles.achievementProgressBar, { backgroundColor: colors.inputBg }]}>
                            <View
                                style={[
                                    styles.achievementProgressFill,
                                    {
                                        width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                                        backgroundColor: achievement.color,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[styles.achievementProgressText, { color: colors.textMuted }]}>
                            {achievement.progress}/{achievement.maxProgress}
                        </Text>
                    </View>
                )}
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
    headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
    progressCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    progressTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 4 },
    progressSubtitle: { fontFamily: "Inter_400Regular", fontSize: 13 },
    progressBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    progressCount: { fontFamily: "Inter_700Bold", fontSize: 18 },
    progressBar: {
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: 10,
        borderRadius: 5,
    },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12 },
    achievementCard: {
        flexDirection: "row",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        gap: 16,
    },
    achievementIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    checkBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    achievementContent: { flex: 1, justifyContent: "center" },
    achievementTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 4 },
    achievementDescription: { fontFamily: "Inter_400Regular", fontSize: 13, marginBottom: 6 },
    achievementDate: { fontFamily: "Inter_500Medium", fontSize: 12 },
    achievementProgress: { marginTop: 8, gap: 6 },
    achievementProgressBar: {
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
    },
    achievementProgressFill: {
        height: 6,
        borderRadius: 3,
    },
    achievementProgressText: { fontFamily: "Inter_500Medium", fontSize: 11 },
});
