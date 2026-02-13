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
import { useData } from "@/contexts/DataContext";
import * as Haptics from "expo-haptics";

export default function RequestMoneyScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const { beneficiaries } = useData();
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleSendRequest = () => {
        if (!selectedBeneficiary || !amount) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // TODO: Send money request
        router.back();
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
                        <Ionicons name="close" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Request Money</Text>
                    <View style={{ width: 44 }} />
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.amountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Amount to Request</Text>
                        <View style={styles.amountContainer}>
                            <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                            <TextInput
                                style={[styles.amountInput, { color: colors.text }]}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                placeholder="0.00"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Request From</Text>
                        {beneficiaries.slice(0, 5).map((beneficiary, index) => (
                            <Pressable
                                key={beneficiary.id}
                                onPress={() => {
                                    Haptics.impactAsync();
                                    setSelectedBeneficiary(beneficiary.id);
                                }}
                                style={[
                                    styles.beneficiaryRow,
                                    { borderBottomColor: colors.borderLight },
                                    selectedBeneficiary === beneficiary.id && {
                                        backgroundColor: colors.primary + "10",
                                    },
                                ]}
                            >
                                <View style={[styles.avatar, { backgroundColor: beneficiary.color }]}>
                                    <Text style={styles.avatarText}>{beneficiary.initial}</Text>
                                </View>
                                <View style={styles.beneficiaryInfo}>
                                    <Text style={[styles.beneficiaryName, { color: colors.text }]}>
                                        {beneficiary.name}
                                    </Text>
                                    <Text style={[styles.beneficiaryBank, { color: colors.textMuted }]}>
                                        {beneficiary.bankName}
                                    </Text>
                                </View>
                                {selectedBeneficiary === beneficiary.id && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Add a Note</Text>
                        <TextInput
                            style={[
                                styles.noteInput,
                                { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border },
                            ]}
                            value={note}
                            onChangeText={setNote}
                            placeholder="What's this for?"
                            placeholderTextColor={colors.textMuted}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <Pressable
                        onPress={handleSendRequest}
                        disabled={!selectedBeneficiary || !amount}
                        style={[
                            styles.sendButton,
                            { backgroundColor: colors.primary },
                            (!selectedBeneficiary || !amount) && { opacity: 0.5 },
                        ]}
                    >
                        <Ionicons name="download" size={20} color="#fff" />
                        <Text style={styles.sendButtonText}>Send Request</Text>
                    </Pressable>
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
    amountCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
    },
    label: { fontFamily: "Inter_500Medium", fontSize: 14, marginBottom: 12 },
    amountContainer: { flexDirection: "row", alignItems: "center" },
    currencySymbol: { fontFamily: "Inter_700Bold", fontSize: 42, marginRight: 8 },
    amountInput: { fontFamily: "Inter_700Bold", fontSize: 42, flex: 1 },
    card: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 16 },
    beneficiaryRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
    beneficiaryInfo: { flex: 1 },
    beneficiaryName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    beneficiaryBank: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
    noteInput: {
        fontFamily: "Inter_400Regular",
        fontSize: 15,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        minHeight: 100,
        textAlignVertical: "top",
    },
    sendButton: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 8,
    },
    sendButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        color: "#fff",
    },
});
