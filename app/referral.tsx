import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Share,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";

export default function ReferralScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [referralCode] = useState("RIVO2026");
    const [referredUsers] = useState([
        { id: "1", name: "Sarah Johnson", joinedAt: "2026-01-15", rewardEarned: 25, status: "active" },
        { id: "2", name: "Mike Chen", joinedAt: "2026-01-22", rewardEarned: 25, status: "active" },
        { id: "3", name: "Emma Davis", joinedAt: "2026-02-05", rewardEarned: 0, status: "pending" },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const totalRewards = referredUsers.reduce((sum, u) => sum + u.rewardEarned, 0);
    const activeReferrals = referredUsers.filter((u) => u.status === "active").length;

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(referralCode);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join Rivo Bank with my referral code ${referralCode} and we both get $25! Download the app now.`,
            });
            Haptics.impactAsync();
        } catch (error) {
            console.error(error);
        }
    };

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Refer & Earn</Text>
                    <View style={{ width: 44 }} />
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.codeCard, { backgroundColor: colors.primary }]}>
                        <Text style={styles.codeLabel}>Your Referral Code</Text>
                        <Text style={styles.code}>{referralCode}</Text>
                        <View style={styles.codeActions}>
                            <Pressable
                                onPress={handleCopyCode}
                                style={[styles.codeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
                            >
                                <Ionicons name="copy" size={18} color="#fff" />
                                <Text style={styles.codeButtonText}>Copy Code</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleShare}
                                style={[styles.codeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
                            >
                                <Ionicons name="share-social" size={18} color="#fff" />
                                <Text style={styles.codeButtonText}>Share</Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
                                <Ionicons name="people" size={24} color={colors.success} />
                            </View>
                            <Text style={[styles.statValue, { color: colors.text }]}>{activeReferrals}</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Active Referrals</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: colors.warning + "15" }]}>
                                <Ionicons name="gift" size={24} color={colors.warning} />
                            </View>
                            <Text style={[styles.statValue, { color: colors.text }]}>${totalRewards}</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Earned</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.infoTitle, { color: colors.text }]}>How it Works</Text>
                        <View style={styles.infoSteps}>
                            <View style={styles.infoStep}>
                                <View style={[styles.stepNumber, { backgroundColor: colors.primary + "15" }]}>
                                    <Text style={[styles.stepNumberText, { color: colors.primary }]}>1</Text>
                                </View>
                                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                                    Share your referral code with friends
                                </Text>
                            </View>
                            <View style={styles.infoStep}>
                                <View style={[styles.stepNumber, { backgroundColor: colors.primary + "15" }]}>
                                    <Text style={[styles.stepNumberText, { color: colors.primary }]}>2</Text>
                                </View>
                                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                                    They sign up and make their first transaction
                                </Text>
                            </View>
                            <View style={styles.infoStep}>
                                <View style={[styles.stepNumber, { backgroundColor: colors.primary + "15" }]}>
                                    <Text style={[styles.stepNumberText, { color: colors.primary }]}>3</Text>
                                </View>
                                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                                    You both get $25 as a reward!
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {referredUsers.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Your Referrals ({referredUsers.length})
                            </Text>
                            {referredUsers.map((user, index) => (
                                <Animated.View
                                    key={user.id}
                                    entering={FadeIn.duration(400).delay(index * 50)}
                                    style={[styles.referralCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                >
                                    <View style={styles.referralLeft}>
                                        <View style={[styles.referralAvatar, { backgroundColor: colors.primary }]}>
                                            <Text style={styles.referralInitial}>
                                                {user.name.split(" ").map((n) => n[0]).join("")}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.referralName, { color: colors.text }]}>{user.name}</Text>
                                            <Text style={[styles.referralDate, { color: colors.textMuted }]}>
                                                Joined {new Date(user.joinedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.referralRight}>
                                        {user.status === "active" ? (
                                            <>
                                                <Text style={[styles.referralReward, { color: colors.success }]}>
                                                    +${user.rewardEarned}
                                                </Text>
                                                <View style={[styles.statusBadge, { backgroundColor: colors.success + "15" }]}>
                                                    <Text style={[styles.statusText, { color: colors.success }]}>Active</Text>
                                                </View>
                                            </>
                                        ) : (
                                            <View style={[styles.statusBadge, { backgroundColor: colors.warning + "15" }]}>
                                                <Text style={[styles.statusText, { color: colors.warning }]}>Pending</Text>
                                            </View>
                                        )}
                                    </View>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>
                )}
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
    headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
    codeCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 28,
        marginBottom: 16,
        alignItems: "center",
    },
    codeLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 12,
    },
    code: {
        fontFamily: "Inter_700Bold",
        fontSize: 32,
        color: "#fff",
        letterSpacing: 4,
        marginBottom: 20,
    },
    codeActions: { flexDirection: "row", gap: 12 },
    codeButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    codeButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        color: "#fff",
    },
    statsCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        flexDirection: "row",
    },
    statItem: { flex: 1, alignItems: "center" },
    statIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statValue: { fontFamily: "Inter_700Bold", fontSize: 24, marginBottom: 4 },
    statLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
    statDivider: { width: 1, marginHorizontal: 16 },
    infoCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    infoTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 16 },
    infoSteps: { gap: 16 },
    infoStep: { flexDirection: "row", alignItems: "center", gap: 14 },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    stepNumberText: { fontFamily: "Inter_700Bold", fontSize: 14 },
    stepText: { fontFamily: "Inter_400Regular", fontSize: 14, flex: 1 },
    section: { paddingHorizontal: 20 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12 },
    referralCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    referralLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
    referralAvatar: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    referralInitial: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
    referralName: { fontFamily: "Inter_600SemiBold", fontSize: 15, marginBottom: 2 },
    referralDate: { fontFamily: "Inter_400Regular", fontSize: 12 },
    referralRight: { alignItems: "flex-end", gap: 6 },
    referralReward: { fontFamily: "Inter_700Bold", fontSize: 16 },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
});
