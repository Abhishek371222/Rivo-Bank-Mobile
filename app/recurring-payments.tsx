import React from "react";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

interface RecurringPayment {
    id: string;
    name: string;
    amount: number;
    frequency: "weekly" | "monthly" | "yearly";
    nextPayment: string;
    category: string;
    isActive: boolean;
}

export default function RecurringPaymentsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [payments] = React.useState<RecurringPayment[]>([
        {
            id: "1",
            name: "Netflix Subscription",
            amount: 15.99,
            frequency: "monthly",
            nextPayment: "2026-02-20",
            category: "entertainment",
            isActive: true,
        },
        {
            id: "2",
            name: "Gym Membership",
            amount: 49.99,
            frequency: "monthly",
            nextPayment: "2026-02-25",
            category: "health",
            isActive: true,
        },
        {
            id: "3",
            name: "Cloud Storage",
            amount: 9.99,
            frequency: "monthly",
            nextPayment: "2026-02-15",
            category: "utilities",
            isActive: true,
        },
        {
            id: "4",
            name: "Spotify Premium",
            amount: 10.99,
            frequency: "monthly",
            nextPayment: "2026-03-01",
            category: "entertainment",
            isActive: false,
        },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const activePayments = payments.filter((p) => p.isActive);
    const inactivePayments = payments.filter((p) => !p.isActive);
    const monthlyTotal = activePayments.reduce((sum, p) => {
        if (p.frequency === "monthly") return sum + p.amount;
        if (p.frequency === "yearly") return sum + p.amount / 12;
        if (p.frequency === "weekly") return sum + p.amount * 4;
        return sum;
    }, 0);

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Recurring Payments</Text>
                    <Pressable
                        onPress={() => Haptics.impactAsync()}
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </Pressable>
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                            Monthly Total
                        </Text>
                        <Text style={[styles.summaryAmount, { color: colors.text }]}>
                            ${monthlyTotal.toFixed(2)}
                        </Text>
                        <Text style={[styles.summarySubtext, { color: colors.textMuted }]}>
                            {activePayments.length} active subscription{activePayments.length !== 1 ? "s" : ""}
                        </Text>
                    </View>
                </Animated.View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Active ({activePayments.length})
                    </Text>
                    {activePayments.map((payment, index) => (
                        <Animated.View
                            key={payment.id}
                            entering={FadeInDown.duration(400).delay(200 + index * 50)}
                        >
                            <PaymentCard payment={payment} colors={colors} />
                        </Animated.View>
                    ))}
                </View>

                {inactivePayments.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            Paused ({inactivePayments.length})
                        </Text>
                        {inactivePayments.map((payment) => (
                            <PaymentCard key={payment.id} payment={payment} colors={colors} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function PaymentCard({ payment, colors }: { payment: RecurringPayment; colors: any }) {
    const getDaysUntilNext = () => {
        const next = new Date(payment.nextPayment);
        const today = new Date();
        const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const daysUntil = getDaysUntilNext();

    return (
        <Pressable
            onPress={() => Haptics.impactAsync()}
            style={[
                styles.paymentCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                !payment.isActive && { opacity: 0.6 },
            ]}
        >
            <View style={styles.paymentLeft}>
                <View
                    style={[
                        styles.paymentIcon,
                        {
                            backgroundColor: payment.isActive
                                ? colors.primary + "15"
                                : colors.inputBg,
                        },
                    ]}
                >
                    <Ionicons
                        name="repeat"
                        size={24}
                        color={payment.isActive ? colors.primary : colors.textMuted}
                    />
                </View>
                <View style={styles.paymentInfo}>
                    <Text style={[styles.paymentName, { color: colors.text }]}>{payment.name}</Text>
                    <View style={styles.paymentMeta}>
                        <Text style={[styles.paymentAmount, { color: colors.text }]}>
                            ${payment.amount.toFixed(2)}
                        </Text>
                        <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                        <Text style={[styles.paymentFrequency, { color: colors.textMuted }]}>
                            {payment.frequency}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.paymentRight}>
                {payment.isActive && (
                    <>
                        <Text style={[styles.nextPayment, { color: colors.textMuted }]}>
                            {daysUntil === 0
                                ? "Today"
                                : daysUntil === 1
                                    ? "Tomorrow"
                                    : `In ${daysUntil} days`}
                        </Text>
                        <Pressable
                            onPress={() => Haptics.impactAsync()}
                            style={[styles.pauseButton, { borderColor: colors.border }]}
                        >
                            <Ionicons name="pause" size={16} color={colors.textSecondary} />
                        </Pressable>
                    </>
                )}
                {!payment.isActive && (
                    <Pressable
                        onPress={() => Haptics.impactAsync()}
                        style={[styles.resumeButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.resumeText}>Resume</Text>
                    </Pressable>
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
    headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, flex: 1, textAlign: "center" },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    summaryCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        alignItems: "center",
    },
    summaryLabel: { fontFamily: "Inter_500Medium", fontSize: 14, marginBottom: 8 },
    summaryAmount: { fontFamily: "Inter_700Bold", fontSize: 36, marginBottom: 4 },
    summarySubtext: { fontFamily: "Inter_400Regular", fontSize: 13 },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12 },
    paymentCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    paymentLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    paymentInfo: { flex: 1 },
    paymentName: { fontFamily: "Inter_600SemiBold", fontSize: 15, marginBottom: 4 },
    paymentMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
    paymentAmount: { fontFamily: "Inter_500Medium", fontSize: 13 },
    dot: { width: 3, height: 3, borderRadius: 1.5 },
    paymentFrequency: { fontFamily: "Inter_400Regular", fontSize: 12 },
    paymentRight: { alignItems: "flex-end", gap: 8 },
    nextPayment: { fontFamily: "Inter_500Medium", fontSize: 12 },
    pauseButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    resumeButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
    },
    resumeText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
        color: "#fff",
    },
});
