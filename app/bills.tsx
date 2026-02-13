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
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    category: string;
    isRecurring: boolean;
    isPaid: boolean;
}

export default function BillsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [bills] = useState<Bill[]>([
        {
            id: "1",
            name: "Electricity Bill",
            amount: 85.50,
            dueDate: "2026-02-15",
            category: "utilities",
            isRecurring: true,
            isPaid: false,
        },
        {
            id: "2",
            name: "Internet",
            amount: 59.99,
            dueDate: "2026-02-18",
            category: "utilities",
            isRecurring: true,
            isPaid: false,
        },
        {
            id: "3",
            name: "Netflix",
            amount: 15.99,
            dueDate: "2026-02-20",
            category: "entertainment",
            isRecurring: true,
            isPaid: true,
        },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const upcomingBills = bills.filter((b) => !b.isPaid && getDaysUntilDue(b.dueDate) >= 0);
    const overdueBills = bills.filter((b) => !b.isPaid && getDaysUntilDue(b.dueDate) < 0);
    const paidBills = bills.filter((b) => b.isPaid);

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Bills & Payments</Text>
                    <Pressable
                        onPress={() => Haptics.impactAsync()}
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </Pressable>
                </View>

                {overdueBills.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.error }]}>
                                Overdue ({overdueBills.length})
                            </Text>
                            {overdueBills.map((bill) => (
                                <BillCard key={bill.id} bill={bill} colors={colors} isOverdue />
                            ))}
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Upcoming ({upcomingBills.length})
                        </Text>
                        {upcomingBills.map((bill, index) => (
                            <Animated.View key={bill.id} entering={FadeInDown.duration(400).delay(index * 50)}>
                                <BillCard bill={bill} colors={colors} />
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {paidBills.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                                Paid ({paidBills.length})
                            </Text>
                            {paidBills.map((bill) => (
                                <BillCard key={bill.id} bill={bill} colors={colors} isPaid />
                            ))}
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

function BillCard({
    bill,
    colors,
    isOverdue = false,
    isPaid = false,
}: {
    bill: Bill;
    colors: any;
    isOverdue?: boolean;
    isPaid?: boolean;
}) {
    const daysUntil = getDaysUntilDue(bill.dueDate);

    const getCountdownText = () => {
        if (isPaid) return "Paid";
        if (isOverdue) return `${Math.abs(daysUntil)} days overdue`;
        if (daysUntil === 0) return "Due today";
        if (daysUntil === 1) return "Due tomorrow";
        return `Due in ${daysUntil} days`;
    };

    const getCountdownColor = () => {
        if (isPaid) return colors.success;
        if (isOverdue) return colors.error;
        if (daysUntil <= 3) return colors.warning;
        return colors.textMuted;
    };

    return (
        <Pressable
            onPress={() => Haptics.impactAsync()}
            style={[
                styles.billCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isOverdue && { borderColor: colors.error, borderWidth: 2 },
            ]}
        >
            <View style={styles.billLeft}>
                <View
                    style={[
                        styles.billIcon,
                        {
                            backgroundColor: isOverdue
                                ? colors.error + "15"
                                : isPaid
                                    ? colors.success + "15"
                                    : colors.primary + "15",
                        },
                    ]}
                >
                    <Ionicons
                        name={isPaid ? "checkmark-circle" : "flash"}
                        size={24}
                        color={isOverdue ? colors.error : isPaid ? colors.success : colors.primary}
                    />
                </View>
                <View style={styles.billInfo}>
                    <Text style={[styles.billName, { color: colors.text }]}>{bill.name}</Text>
                    <View style={styles.billMeta}>
                        <Text style={[styles.billAmount, { color: colors.text }]}>
                            ${bill.amount.toFixed(2)}
                        </Text>
                        {bill.isRecurring && (
                            <>
                                <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                                <Ionicons name="repeat" size={12} color={colors.textMuted} />
                                <Text style={[styles.billRecurring, { color: colors.textMuted }]}>
                                    Monthly
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.billRight}>
                <Text style={[styles.countdown, { color: getCountdownColor() }]}>
                    {getCountdownText()}
                </Text>
                {!isPaid && (
                    <Pressable
                        onPress={() => Haptics.impactAsync()}
                        style={[styles.payButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.payButtonText}>Pay</Text>
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}

function getDaysUntilDue(dueDate: string) {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
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
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12 },
    billCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    billLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
    billIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    billInfo: { flex: 1 },
    billName: { fontFamily: "Inter_600SemiBold", fontSize: 15, marginBottom: 4 },
    billMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
    billAmount: { fontFamily: "Inter_500Medium", fontSize: 13 },
    dot: { width: 3, height: 3, borderRadius: 1.5 },
    billRecurring: { fontFamily: "Inter_400Regular", fontSize: 12 },
    billRight: { alignItems: "flex-end", gap: 8 },
    countdown: { fontFamily: "Inter_500Medium", fontSize: 12 },
    payButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
    },
    payButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
        color: "#fff",
    },
});
