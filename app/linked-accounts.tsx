import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Platform,
    Alert,
    Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

interface LinkedAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    isPrimary: boolean;
}

export default function LinkedAccountsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [showAddModal, setShowAddModal] = useState(false);
    const [accounts, setAccounts] = useState<LinkedAccount[]>([
        {
            id: "1",
            bankName: "State Bank of India",
            accountNumber: "1234567890",
            ifsc: "SBIN0001234",
            isPrimary: true,
        },
        {
            id: "2",
            bankName: "HDFC Bank",
            accountNumber: "9876543210",
            ifsc: "HDFC0004567",
            isPrimary: false,
        },
    ]);

    const [newAccount, setNewAccount] = useState({
        bankName: "",
        accountNumber: "",
        ifsc: "",
    });

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleAddAccount = () => {
        if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.ifsc) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        const account: LinkedAccount = {
            id: Date.now().toString(),
            ...newAccount,
            isPrimary: accounts.length === 0,
        };

        setAccounts([...accounts, account]);
        setNewAccount({ bankName: "", accountNumber: "", ifsc: "" });
        setShowAddModal(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleRemoveAccount = (id: string) => {
        Alert.alert(
            "Remove Account",
            "Are you sure you want to remove this account?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        setAccounts(accounts.filter((acc) => acc.id !== id));
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    },
                },
            ]
        );
    };

    const handleSetPrimary = (id: string) => {
        setAccounts(
            accounts.map((acc) => ({
                ...acc,
                isPrimary: acc.id === id,
            }))
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Linked Accounts</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {accounts.map((account, index) => (
                    <Animated.View
                        key={account.id}
                        entering={FadeInDown.duration(500).delay(100 * (index + 1))}
                    >
                        <View style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.accountHeader}>
                                <View style={[styles.bankIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name="business" size={24} color={colors.primary} />
                                </View>
                                <View style={styles.accountInfo}>
                                    <Text style={[styles.bankName, { color: colors.text }]}>{account.bankName}</Text>
                                    <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                                        •••• {account.accountNumber.slice(-4)}
                                    </Text>
                                    <Text style={[styles.ifsc, { color: colors.textMuted }]}>IFSC: {account.ifsc}</Text>
                                </View>
                                {account.isPrimary && (
                                    <View style={[styles.primaryBadge, { backgroundColor: colors.success + "15" }]}>
                                        <Text style={[styles.primaryText, { color: colors.success }]}>Primary</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.accountActions}>
                                {!account.isPrimary && (
                                    <Pressable
                                        onPress={() => { Haptics.impactAsync(); handleSetPrimary(account.id); }}
                                        style={[styles.actionButton, { backgroundColor: colors.primary + "10", borderColor: colors.primary }]}
                                    >
                                        <Text style={[styles.actionButtonText, { color: colors.primary }]}>Set as Primary</Text>
                                    </Pressable>
                                )}
                                <Pressable
                                    onPress={() => { Haptics.impactAsync(); handleRemoveAccount(account.id); }}
                                    style={[styles.actionButton, { backgroundColor: colors.error + "10", borderColor: colors.error }]}
                                >
                                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                                    <Text style={[styles.actionButtonText, { color: colors.error }]}>Remove</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                ))}

                <Animated.View entering={FadeInDown.duration(500).delay(100 * (accounts.length + 1))}>
                    <Pressable
                        onPress={() => { Haptics.impactAsync(); setShowAddModal(true); }}
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add New Account</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>

            {/* Add Account Modal */}
            <Modal
                visible={showAddModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)}>
                    <Animated.View
                        entering={FadeInDown.duration(300)}
                        style={[styles.modalContent, { backgroundColor: colors.surface }]}
                    >
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Account</Text>

                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            placeholder="Bank Name"
                            placeholderTextColor={colors.textMuted}
                            value={newAccount.bankName}
                            onChangeText={(text) => setNewAccount({ ...newAccount, bankName: text })}
                        />

                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            placeholder="Account Number"
                            placeholderTextColor={colors.textMuted}
                            value={newAccount.accountNumber}
                            onChangeText={(text) => setNewAccount({ ...newAccount, accountNumber: text })}
                            keyboardType="number-pad"
                        />

                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            placeholder="IFSC Code"
                            placeholderTextColor={colors.textMuted}
                            value={newAccount.ifsc}
                            onChangeText={(text) => setNewAccount({ ...newAccount, ifsc: text.toUpperCase() })}
                            autoCapitalize="characters"
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                onPress={() => { Haptics.impactAsync(); setShowAddModal(false); }}
                                style={[styles.modalButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => { Haptics.impactAsync(); handleAddAccount(); }}
                                style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add Account</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>
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
    accountCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    accountHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    bankIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    accountInfo: {
        flex: 1,
    },
    bankName: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 4,
    },
    accountNumber: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
        marginBottom: 2,
    },
    ifsc: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
    },
    primaryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    primaryText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 11,
    },
    accountActions: {
        flexDirection: "row",
        gap: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    actionButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
    },
    addButton: {
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 16,
        borderRadius: 12,
    },
    addButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#fff",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 20,
    },
    modalContent: {
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 20,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        fontFamily: "Inter_500Medium",
        fontSize: 15,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
    },
    modalButtonPrimary: {
        borderWidth: 0,
    },
    modalButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
    },
});
