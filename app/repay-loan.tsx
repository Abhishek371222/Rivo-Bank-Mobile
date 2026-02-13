import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    Alert,
    TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { getCurrentUser, getActiveLoan, saveLoan, updateUserBalance, saveTransaction, Transaction, Loan } from "@/services/database";
import { processPayment, calculateEarlyRepaymentSavings } from "@/services/loanService";

export default function RepayLoanScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [loan, setLoan] = useState<Loan | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
    const [partialAmount, setPartialAmount] = useState('');
    const [autoDebit, setAutoDebit] = useState(false);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    useEffect(() => {
        loadLoanDetails();
    }, []);

    const loadLoanDetails = async () => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                router.back();
                return;
            }

            const activeLoan = await getActiveLoan(user.id);
            if (!activeLoan) {
                Alert.alert("No Active Loan", "You don't have any active loans");
                router.back();
                return;
            }

            setLoan(activeLoan);
        } catch (error) {
            console.error("Error loading loan:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRepayment = async () => {
        try {
            if (!loan) return;

            const user = await getCurrentUser();
            if (!user) return;

            const paymentAmount = paymentType === 'full'
                ? loan.outstandingBalance
                : parseInt(partialAmount) || 0;

            if (paymentAmount <= 0) {
                Alert.alert("Invalid Amount", "Please enter a valid payment amount");
                return;
            }

            if (paymentAmount > user.balance) {
                Alert.alert("Insufficient Balance", "You don't have enough balance to make this payment");
                return;
            }

            if (paymentAmount > loan.outstandingBalance) {
                Alert.alert("Invalid Amount", "Payment amount cannot exceed outstanding balance");
                return;
            }

            Haptics.impactAsync();

            const { updatedLoan, interestSaved } = processPayment(
                loan,
                paymentAmount,
                paymentType === 'full' ? 'prepayment' : autoDebit ? 'auto-debit' : 'manual'
            );

            await saveLoan(updatedLoan);

            // Deduct from user balance
            const newBalance = user.balance - paymentAmount;
            await updateUserBalance(user.id, newBalance);

            // Create transaction record
            const transaction: Transaction = {
                id: `txn-${Date.now()}`,
                userId: user.id,
                type: 'debit',
                amount: paymentAmount,
                category: 'Loan Repayment',
                description: `Loan payment - ${paymentType}`,
                merchant: 'Rivo Bank',
                date: new Date().toISOString(),
                balance: newBalance,
            };
            await saveTransaction(transaction);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            const message = updatedLoan.status === 'repaid'
                ? `Congratulations! Your loan is fully repaid. ${interestSaved > 0 ? `You saved ₹${interestSaved} in interest!` : ''}`
                : `Payment successful! ${interestSaved > 0 ? `Interest saved: ₹${interestSaved}` : ''}`;

            Alert.alert(
                "Payment Successful! 🎉",
                message,
                [
                    {
                        text: updatedLoan.status === 'repaid' ? "Done" : "View Details",
                        onPress: () => {
                            if (updatedLoan.status === 'repaid') {
                                router.back();
                            } else {
                                router.replace("/loan-details");
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Error processing payment:", error);
            Alert.alert("Error", "Failed to process payment. Please try again.");
        }
    };

    if (loading || !loan) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
            </View>
        );
    }

    const partialAmountNum = parseInt(partialAmount) || 0;
    const savings = paymentType === 'partial' && partialAmountNum > 0
        ? calculateEarlyRepaymentSavings(loan, partialAmountNum)
        : null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => { Haptics.impactAsync(); router.back(); }}
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Repay Loan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Outstanding Balance</Text>
                        <Text style={[styles.balanceAmount, { color: colors.error }]}>₹{loan.outstandingBalance.toLocaleString()}</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Type</Text>

                        <Pressable
                            onPress={() => { Haptics.impactAsync(); setPaymentType('full'); }}
                            style={[
                                styles.paymentTypeCard,
                                {
                                    backgroundColor: paymentType === 'full' ? colors.primary + "10" : colors.surface,
                                    borderColor: paymentType === 'full' ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <View style={styles.paymentTypeLeft}>
                                <View style={[styles.radio, { borderColor: paymentType === 'full' ? colors.primary : colors.border }]}>
                                    {paymentType === 'full' && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                                </View>
                                <View>
                                    <Text style={[styles.paymentTypeTitle, { color: colors.text }]}>Full Payment</Text>
                                    <Text style={[styles.paymentTypeSubtitle, { color: colors.textSecondary }]}>
                                        Pay entire outstanding amount
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.paymentTypeAmount, { color: colors.text }]}>₹{loan.outstandingBalance.toLocaleString()}</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => { Haptics.impactAsync(); setPaymentType('partial'); }}
                            style={[
                                styles.paymentTypeCard,
                                {
                                    backgroundColor: paymentType === 'partial' ? colors.primary + "10" : colors.surface,
                                    borderColor: paymentType === 'partial' ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <View style={styles.paymentTypeLeft}>
                                <View style={[styles.radio, { borderColor: paymentType === 'partial' ? colors.primary : colors.border }]}>
                                    {paymentType === 'partial' && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                                </View>
                                <View>
                                    <Text style={[styles.paymentTypeTitle, { color: colors.text }]}>Partial Payment</Text>
                                    <Text style={[styles.paymentTypeSubtitle, { color: colors.textSecondary }]}>
                                        Pay any amount you want
                                    </Text>
                                </View>
                            </View>
                        </Pressable>

                        {paymentType === 'partial' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <View style={[styles.amountInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Text style={[styles.rupeeSymbol, { color: colors.text }]}>₹</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Enter amount"
                                        placeholderTextColor={colors.textMuted}
                                        keyboardType="numeric"
                                        value={partialAmount}
                                        onChangeText={setPartialAmount}
                                    />
                                </View>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>

                {savings && savings.interestSaved > 0 && (
                    <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                        <View style={[styles.savingsCard, { backgroundColor: colors.success + "10", borderColor: colors.success }]}>
                            <Ionicons name="trending-down" size={24} color={colors.success} />
                            <View style={styles.savingsInfo}>
                                <Text style={[styles.savingsTitle, { color: colors.success }]}>Interest Savings</Text>
                                <Text style={[styles.savingsAmount, { color: colors.success }]}>
                                    Save ₹{savings.interestSaved.toLocaleString()} with this payment
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={styles.section}>
                        <Pressable
                            onPress={() => { Haptics.impactAsync(); setAutoDebit(!autoDebit); }}
                            style={[styles.autoDebitCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.autoDebitLeft}>
                                <Ionicons name="calendar" size={24} color={colors.primary} />
                                <View style={styles.autoDebitText}>
                                    <Text style={[styles.autoDebitTitle, { color: colors.text }]}>Enable Auto-Debit</Text>
                                    <Text style={[styles.autoDebitSubtitle, { color: colors.textSecondary }]}>
                                        Automatic payment on due date
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.toggle, { backgroundColor: autoDebit ? colors.primary : colors.border }]}>
                                <View style={[styles.toggleThumb, { transform: [{ translateX: autoDebit ? 20 : 0 }] }]} />
                            </View>
                        </Pressable>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(500)}>
                    <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary }]}>
                        <Ionicons name="information-circle" size={20} color={colors.primary} />
                        <Text style={[styles.infoText, { color: colors.text }]}>
                            Early repayment reduces total interest and improves your credit limit for future loans.
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(600)}>
                    <Pressable
                        onPress={handleRepayment}
                        style={[styles.repayButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.repayButtonText}>
                            Pay ₹{paymentType === 'full' ? loan.outstandingBalance.toLocaleString() : (partialAmountNum || 0).toLocaleString()}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
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
    loadingText: {
        fontFamily: "Inter_500Medium",
        fontSize: 16,
        textAlign: "center",
        marginTop: 100,
    },
    balanceCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
    },
    balanceLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
        marginBottom: 8,
    },
    balanceAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 40,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    sectionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 16,
    },
    paymentTypeCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
    },
    paymentTypeLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flex: 1,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    paymentTypeTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 2,
    },
    paymentTypeSubtitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
    },
    paymentTypeAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
    },
    amountInput: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 2,
        paddingHorizontal: 16,
        marginTop: 12,
    },
    rupeeSymbol: {
        fontFamily: "Inter_700Bold",
        fontSize: 24,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontFamily: "Inter_600SemiBold",
        fontSize: 24,
        paddingVertical: 16,
    },
    savingsCard: {
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    savingsInfo: {
        flex: 1,
    },
    savingsTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        marginBottom: 4,
    },
    savingsAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
    },
    autoDebitCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    autoDebitLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flex: 1,
    },
    autoDebitText: {
        flex: 1,
    },
    autoDebitTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 2,
    },
    autoDebitSubtitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
    },
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
    },
    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    infoCard: {
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    infoText: {
        flex: 1,
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        lineHeight: 20,
    },
    repayButton: {
        marginHorizontal: 20,
        marginTop: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 16,
        borderRadius: 12,
    },
    repayButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#fff",
    },
});
