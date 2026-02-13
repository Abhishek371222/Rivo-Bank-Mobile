import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

export default function StatementsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const statements = [
        { month: "January 2026", size: "245 KB", date: "01 Feb 2026" },
        { month: "December 2025", size: "312 KB", date: "01 Jan 2026" },
        { month: "November 2025", size: "198 KB", date: "01 Dec 2025" },
        { month: "October 2025", size: "267 KB", date: "01 Nov 2025" },
        { month: "September 2025", size: "289 KB", date: "01 Oct 2025" },
    ];

    const handleDownload = (month: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Download Started", `Downloading statement for ${month}`);
    };

    const handleEmail = (month: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Email Sent", `Statement for ${month} has been sent to your registered email`);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => { Haptics.impactAsync(); router.back(); }}
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Statements</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={styles.periodSelector}>
                        <Pressable
                            onPress={() => { Haptics.impactAsync(); setSelectedPeriod("monthly"); }}
                            style={[
                                styles.periodButton,
                                { backgroundColor: selectedPeriod === "monthly" ? colors.primary : colors.surface, borderColor: colors.border }
                            ]}
                        >
                            <Text style={[styles.periodButtonText, { color: selectedPeriod === "monthly" ? "#fff" : colors.text }]}>
                                Monthly
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => { Haptics.impactAsync(); setSelectedPeriod("quarterly"); }}
                            style={[
                                styles.periodButton,
                                { backgroundColor: selectedPeriod === "quarterly" ? colors.primary : colors.surface, borderColor: colors.border }
                            ]}
                        >
                            <Text style={[styles.periodButtonText, { color: selectedPeriod === "quarterly" ? "#fff" : colors.text }]}>
                                Quarterly
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => { Haptics.impactAsync(); setSelectedPeriod("yearly"); }}
                            style={[
                                styles.periodButton,
                                { backgroundColor: selectedPeriod === "yearly" ? colors.primary : colors.surface, borderColor: colors.border }
                            ]}
                        >
                            <Text style={[styles.periodButtonText, { color: selectedPeriod === "yearly" ? "#fff" : colors.text }]}>
                                Yearly
                            </Text>
                        </Pressable>
                    </View>
                </Animated.View>

                {statements.map((statement, index) => (
                    <Animated.View
                        key={statement.month}
                        entering={FadeInDown.duration(500).delay(100 * (index + 2))}
                    >
                        <View style={[styles.statementCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.pdfIcon, { backgroundColor: colors.error + "15" }]}>
                                <Ionicons name="document-text" size={28} color={colors.error} />
                            </View>

                            <View style={styles.statementInfo}>
                                <Text style={[styles.statementMonth, { color: colors.text }]}>{statement.month}</Text>
                                <View style={styles.statementMeta}>
                                    <Text style={[styles.statementSize, { color: colors.textSecondary }]}>{statement.size}</Text>
                                    <Text style={[styles.statementDate, { color: colors.textMuted }]}>Generated on {statement.date}</Text>
                                </View>
                            </View>

                            <View style={styles.statementActions}>
                                <Pressable
                                    onPress={() => { Haptics.impactAsync(); handleDownload(statement.month); }}
                                    style={[styles.iconButton, { backgroundColor: colors.primary + "15" }]}
                                >
                                    <Ionicons name="download-outline" size={20} color={colors.primary} />
                                </Pressable>

                                <Pressable
                                    onPress={() => { Haptics.impactAsync(); handleEmail(statement.month); }}
                                    style={[styles.iconButton, { backgroundColor: colors.primary + "15" }]}
                                >
                                    <Ionicons name="mail-outline" size={20} color={colors.primary} />
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                ))}

                <Animated.View entering={FadeInDown.duration(500).delay(100 * (statements.length + 2))}>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Ionicons name="information-circle" size={24} color={colors.primary} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Statements are generated on the 1st of every month. You can download or email them to your registered email address.
                        </Text>
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
    periodSelector: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
    },
    periodButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
    },
    statementCard: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
    },
    pdfIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    statementInfo: {
        flex: 1,
    },
    statementMonth: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 6,
    },
    statementMeta: {
        gap: 4,
    },
    statementSize: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
    },
    statementDate: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
    },
    statementActions: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    infoCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        gap: 12,
        borderWidth: 1,
    },
    infoText: {
        flex: 1,
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        lineHeight: 20,
    },
});
