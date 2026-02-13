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
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

interface Participant {
    id: string;
    name: string;
    amount: number;
}

export default function SplitBillScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [totalAmount, setTotalAmount] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([
        { id: "1", name: "", amount: 0 },
    ]);
    const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal");

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const addParticipant = () => {
        Haptics.impactAsync();
        setParticipants([
            ...participants,
            { id: Date.now().toString(), name: "", amount: 0 },
        ]);
    };

    const removeParticipant = (id: string) => {
        Haptics.impactAsync();
        setParticipants(participants.filter((p) => p.id !== id));
    };

    const updateParticipantName = (id: string, name: string) => {
        setParticipants(
            participants.map((p) => (p.id === id ? { ...p, name } : p))
        );
    };

    const updateParticipantAmount = (id: string, amount: string) => {
        setParticipants(
            participants.map((p) =>
                p.id === id ? { ...p, amount: parseFloat(amount) || 0 } : p
            )
        );
    };

    const calculateSplit = () => {
        const total = parseFloat(totalAmount) || 0;
        if (splitMethod === "equal") {
            const perPerson = total / participants.length;
            return participants.map((p) => ({ ...p, amount: perPerson }));
        }
        return participants;
    };

    const splits = calculateSplit();
    const totalAssigned = splits.reduce((sum, p) => sum + p.amount, 0);
    const remaining = (parseFloat(totalAmount) || 0) - totalAssigned;

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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Split Bill</Text>
                    <View style={{ width: 44 }} />
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Total Amount</Text>
                        <View style={styles.amountContainer}>
                            <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                            <TextInput
                                style={[styles.amountInput, { color: colors.text }]}
                                value={totalAmount}
                                onChangeText={setTotalAmount}
                                keyboardType="decimal-pad"
                                placeholder="0.00"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Split Method</Text>
                        <View style={styles.methodButtons}>
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync();
                                    setSplitMethod("equal");
                                }}
                                style={[
                                    styles.methodButton,
                                    { borderColor: colors.border },
                                    splitMethod === "equal" && {
                                        backgroundColor: colors.primary + "15",
                                        borderColor: colors.primary,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="people"
                                    size={20}
                                    color={splitMethod === "equal" ? colors.primary : colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.methodText,
                                        { color: splitMethod === "equal" ? colors.primary : colors.textSecondary },
                                    ]}
                                >
                                    Equal Split
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync();
                                    setSplitMethod("custom");
                                }}
                                style={[
                                    styles.methodButton,
                                    { borderColor: colors.border },
                                    splitMethod === "custom" && {
                                        backgroundColor: colors.primary + "15",
                                        borderColor: colors.primary,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="calculator"
                                    size={20}
                                    color={splitMethod === "custom" ? colors.primary : colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.methodText,
                                        { color: splitMethod === "custom" ? colors.primary : colors.textSecondary },
                                    ]}
                                >
                                    Custom
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Participants ({participants.length})
                            </Text>
                            <Pressable onPress={addParticipant} style={styles.addButton}>
                                <Ionicons name="add-circle" size={24} color={colors.primary} />
                            </Pressable>
                        </View>

                        {participants.map((participant, index) => (
                            <Animated.View
                                key={participant.id}
                                entering={FadeInRight.duration(400).delay(index * 50)}
                                style={[styles.participantRow, { borderBottomColor: colors.borderLight }]}
                            >
                                <View style={[styles.participantIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Text style={[styles.participantNumber, { color: colors.primary }]}>
                                        {index + 1}
                                    </Text>
                                </View>
                                <TextInput
                                    style={[styles.participantName, { color: colors.text }]}
                                    value={participant.name}
                                    onChangeText={(name) => updateParticipantName(participant.id, name)}
                                    placeholder="Name"
                                    placeholderTextColor={colors.textMuted}
                                />
                                {splitMethod === "custom" ? (
                                    <TextInput
                                        style={[styles.participantAmount, { color: colors.text, backgroundColor: colors.inputBg }]}
                                        value={participant.amount > 0 ? participant.amount.toString() : ""}
                                        onChangeText={(amount) => updateParticipantAmount(participant.id, amount)}
                                        keyboardType="decimal-pad"
                                        placeholder="$0"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                ) : (
                                    <Text style={[styles.calculatedAmount, { color: colors.success }]}>
                                        ${splits[index]?.amount.toFixed(2) || "0.00"}
                                    </Text>
                                )}
                                {participants.length > 1 && (
                                    <Pressable
                                        onPress={() => removeParticipant(participant.id)}
                                        style={styles.removeButton}
                                    >
                                        <Ionicons name="close-circle" size={20} color={colors.error} />
                                    </Pressable>
                                )}
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {splitMethod === "custom" && Math.abs(remaining) > 0.01 && (
                    <Animated.View entering={FadeInDown.duration(500)}>
                        <View style={[styles.warningCard, { backgroundColor: colors.warning + "15", borderColor: colors.warning }]}>
                            <Ionicons name="warning" size={20} color={colors.warning} />
                            <Text style={[styles.warningText, { color: colors.warning }]}>
                                {remaining > 0
                                    ? `$${remaining.toFixed(2)} remaining to assign`
                                    : `Over by $${Math.abs(remaining).toFixed(2)}`}
                            </Text>
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <Pressable
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            // TODO: Send split requests
                            router.back();
                        }}
                        style={[styles.sendButton, { backgroundColor: colors.primary }]}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.sendButtonText}>Send Requests</Text>
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
    card: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    label: { fontFamily: "Inter_500Medium", fontSize: 14, marginBottom: 8 },
    amountContainer: { flexDirection: "row", alignItems: "center" },
    currencySymbol: { fontFamily: "Inter_700Bold", fontSize: 36, marginRight: 8 },
    amountInput: {
        fontFamily: "Inter_700Bold",
        fontSize: 36,
        flex: 1,
    },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    addButton: { padding: 4 },
    methodButtons: { flexDirection: "row", gap: 12 },
    methodButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    methodText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
    participantRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    participantIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    participantNumber: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
    participantName: {
        flex: 1,
        fontFamily: "Inter_500Medium",
        fontSize: 15,
    },
    participantAmount: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 80,
        textAlign: "right",
    },
    calculatedAmount: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    removeButton: { padding: 4 },
    warningCard: {
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
    },
    warningText: { fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1 },
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
