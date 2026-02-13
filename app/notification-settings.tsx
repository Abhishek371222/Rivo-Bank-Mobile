import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Switch,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    category: string;
}

export default function NotificationSettingsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: "transactions",
            title: "Transaction Alerts",
            description: "Get notified for every transaction",
            enabled: true,
            category: "activity",
        },
        {
            id: "large_transactions",
            title: "Large Transactions",
            description: "Alerts for transactions over $100",
            enabled: true,
            category: "activity",
        },
        {
            id: "low_balance",
            title: "Low Balance",
            description: "Alert when balance falls below $50",
            enabled: true,
            category: "activity",
        },
        {
            id: "bill_reminders",
            title: "Bill Reminders",
            description: "Reminders for upcoming bills",
            enabled: true,
            category: "bills",
        },
        {
            id: "bill_due",
            title: "Bill Due Today",
            description: "Alert on the day a bill is due",
            enabled: true,
            category: "bills",
        },
        {
            id: "budget_alerts",
            title: "Budget Alerts",
            description: "Notify when approaching budget limits",
            enabled: true,
            category: "budgets",
        },
        {
            id: "savings_goals",
            title: "Savings Goals",
            description: "Updates on savings goal progress",
            enabled: false,
            category: "goals",
        },
        {
            id: "achievements",
            title: "Achievement Unlocked",
            description: "Celebrate when you unlock achievements",
            enabled: true,
            category: "engagement",
        },
        {
            id: "referrals",
            title: "Referral Updates",
            description: "Notifications about your referrals",
            enabled: true,
            category: "engagement",
        },
        {
            id: "promotions",
            title: "Promotions & Offers",
            description: "Special offers and promotions",
            enabled: false,
            category: "marketing",
        },
    ]);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const toggleSetting = (id: string) => {
        Haptics.impactAsync();
        setSettings((prev) =>
            prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
        );
    };

    const categories = [
        { id: "activity", title: "Account Activity", icon: "pulse" },
        { id: "bills", title: "Bills & Payments", icon: "flash" },
        { id: "budgets", title: "Budgets", icon: "bar-chart" },
        { id: "goals", title: "Goals", icon: "trophy" },
        { id: "engagement", title: "Engagement", icon: "star" },
        { id: "marketing", title: "Marketing", icon: "megaphone" },
    ];

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                    <View style={{ width: 44 }} />
                </View>

                {categories.map((category, catIndex) => {
                    const categorySettings = settings.filter((s) => s.category === category.id);
                    if (categorySettings.length === 0) return null;

                    return (
                        <Animated.View
                            key={category.id}
                            entering={FadeInDown.duration(400).delay(catIndex * 100)}
                        >
                            <View style={styles.section}>
                                <View style={styles.categoryHeader}>
                                    <Ionicons name={category.icon as any} size={20} color={colors.primary} />
                                    <Text style={[styles.categoryTitle, { color: colors.text }]}>
                                        {category.title}
                                    </Text>
                                </View>
                                <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    {categorySettings.map((setting, index) => (
                                        <View
                                            key={setting.id}
                                            style={[
                                                styles.settingRow,
                                                { borderBottomColor: colors.borderLight },
                                                index === categorySettings.length - 1 && { borderBottomWidth: 0 },
                                            ]}
                                        >
                                            <View style={styles.settingInfo}>
                                                <Text style={[styles.settingTitle, { color: colors.text }]}>
                                                    {setting.title}
                                                </Text>
                                                <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                                    {setting.description}
                                                </Text>
                                            </View>
                                            <Switch
                                                value={setting.enabled}
                                                onValueChange={() => toggleSetting(setting.id)}
                                                trackColor={{ false: colors.inputBg, true: colors.primary + "60" }}
                                                thumbColor={setting.enabled ? colors.primary : colors.textMuted}
                                                ios_backgroundColor={colors.inputBg}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </Animated.View>
                    );
                })}
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
    section: { paddingHorizontal: 20, marginBottom: 24 },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    categoryTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    settingsCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
    },
    settingInfo: { flex: 1, marginRight: 16 },
    settingTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, marginBottom: 4 },
    settingDescription: { fontFamily: "Inter_400Regular", fontSize: 13 },
});
