import React, { useState, useEffect } from "react";
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
import Slider from "@react-native-community/slider";
import { getCurrentUser, getActiveLoan, saveLoan, updateUserBalance, saveTransaction, Transaction } from "@/services/database";
import { checkLoanEligibility, createLoan, calculateEMI, calculateTotalInterest } from "@/services/loanService";

export default function BorrowScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [amount, setAmount] = useState(15000);
    const [tenure, setTenure] = useState(3);
    const [loading, setLoading] = useState(true);
    const [eligible, setEligible] = useState(false);
    const [maxAmount, setMaxAmount] = useState(50000);
    const [interestRate, setInterestRate] = useState(12);
    const [creditScore, setCreditScore] = useState(0);
    const [hasActiveLoan, setHasActiveLoan] = useState(false);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    useEffect(() => {
        checkEligibility();
    }, []);

    const checkEligibility = async () => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                Alert.alert("Error", "Please login first");
                router.back();
                return;
            }

            const activeLoan = await getActiveLoan(user.id);
            const eligibility = checkLoanEligibility(
                user.creditScore,
                50000, // Assuming monthly income
                !!activeLoan,
                user.kycStatus
            );

            setCreditScore(user.creditScore);
            setHasActiveLoan(!!activeLoan);
            setEligible(eligibility.eligible);
            setMaxAmount(eligibility.maxAmount);
            setInterestRate(eligibility.interestRate);

            if (!eligibility.eligible && eligibility.reason) {
                Alert.alert("Not Eligible", eligibility.reason);
            }
        } catch (error) {
            console.error("Error checking eligibility:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async () => {
        try {
            Haptics.impactAsync();

            const user = await getCurrentUser();
            if (!user) return;

            const loan = createLoan(user.id, amount, tenure, interestRate);
            await saveLoan(loan);

            // Credit amount to user's account
            const newBalance = user.balance + amount;
            await updateUserBalance(user.id, newBalance);

            // Create transaction record
            const transaction: Transaction = {
                id: `txn-${Date.now()}`,
                userId: user.id,
                type: 'credit',
                amount,
                category: 'Loan',
                description: `Loan disbursed - ${tenure} months`,
                merchant: 'Rivo Bank',
                date: new Date().toISOString(),
                balance: newBalance,
            };
            await saveTransaction(transaction);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Alert.alert(
                "Loan Approved! 🎉",
                `₹${amount.toLocaleString()} has been credited to your account`,
                [
                    {
                        text: "View Details",
                        onPress: () => router.push("/loan-details"),
                    },
                ]
            );
        } catch (error) {
            console.error("Error processing loan:", error);
            Alert.alert("Error", "Failed to process loan. Please try again.");
        }
    };

    const emi = calculateEMI(amount, interestRate, tenure);
    const totalInterest = calculateTotalInterest(emi, tenure, amount);
    const totalRepayment = amount + totalInterest;

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Checking eligibility...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => { Haptics.impactAsync(); router.back(); }}
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Borrow Money</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.creditScoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.scoreHeader}>
                            <View>
                                <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Your Credit Score</Text>
                                <Text style={[styles.scoreValue, { color: colors.success }]}>{creditScore}</Text>
                            </View>
                            <View style={[styles.scoreIcon, { backgroundColor: colors.success + "15" }]}>
                                <Ionicons name="shield-checkmark" size={32} color={colors.success} />
                            </View>
                        </View>
                        <Text style={[styles.scoreSubtext, { color: colors.textSecondary }]}>
                            Excellent! You qualify for instant loans up to ₹{maxAmount.toLocaleString()}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Loan Amount</Text>
                        <View style={[styles.amountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.amountValue, { color: colors.primary }]}>₹{amount.toLocaleString()}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={5000}
                                maximumValue={maxAmount}
                                step={1000}
                                value={amount}
                                onValueChange={setAmount}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor={colors.border}
                                thumbTintColor={colors.primary}
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={[styles.sliderLabel, { color: colors.textMuted }]}>₹5,000</Text>
                                <Text style={[styles.sliderLabel, { color: colors.textMuted }]}>₹{maxAmount.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Repayment Tenure</Text>
                        <View style={styles.tenureGrid}>
                            {[1, 2, 3, 4, 5, 6].map((months) => (
                                <Pressable
                                    key={months}
                                    onPress={() => { Haptics.impactAsync(); setTenure(months); }}
                                    style={[
                                        styles.tenureButton,
                                        {
                                            backgroundColor: tenure === months ? colors.primary : colors.surface,
                                            borderColor: tenure === months ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={[styles.tenureText, { color: tenure === months ? "#fff" : colors.text }]}>
                                        {months} {months === 1 ? "Month" : "Months"}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.detailsTitle, { color: colors.text }]}>Loan Details</Text>

                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Interest Rate</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{interestRate}% p.a.</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Monthly EMI</Text>
                            <Text style={[styles.detailValue, { color: colors.primary }]}>₹{emi.toLocaleString()}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total Interest</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>₹{totalInterest.toLocaleString()}</Text>
                        </View>

                        <View style={[styles.detailRow, styles.totalRow, { borderTopColor: colors.border }]}>
                            <Text style={[styles.detailLabel, styles.totalLabel, { color: colors.text }]}>Total Repayment</Text>
                            <Text style={[styles.detailValue, styles.totalValue, { color: colors.text }]}>₹{totalRepayment.toLocaleString()}</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(500)}>
                    <View style={[styles.infoCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning }]}>
                        <Ionicons name="information-circle" size={20} color={colors.warning} />
                        <Text style={[styles.infoText, { color: colors.text }]}>
                            Interest is calculated daily. Early repayment reduces total interest and improves your credit limit.
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(600)}>
                    <Pressable
                        onPress={handleBorrow}
                        disabled={!eligible}
                        style={[
                            styles.borrowButton,
                            { backgroundColor: eligible ? colors.primary : colors.border },
                        ]}
                    >
                        <Text style={[styles.borrowButtonText, { color: eligible ? "#fff" : colors.textMuted }]}>
                            {eligible ? "Get Instant Loan" : "Not Eligible"}
                        </Text>
                        {eligible && <Ionicons name="arrow-forward" size={20} color="#fff" />}
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
    creditScoreCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    scoreHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    scoreLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
        marginBottom: 6,
    },
    scoreValue: {
        fontFamily: "Inter_700Bold",
        fontSize: 36,
    },
    scoreIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    scoreSubtext: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        lineHeight: 20,
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
    amountCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    amountValue: {
        fontFamily: "Inter_700Bold",
        fontSize: 40,
        textAlign: "center",
        marginBottom: 20,
    },
    slider: {
        width: "100%",
        height: 40,
    },
    sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    sliderLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
    },
    tenureGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    tenureButton: {
        flex: 1,
        minWidth: "30%",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 2,
    },
    tenureText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
    },
    detailsCard: {
        marginHorizontal: 20,
        marginTop: 32,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    detailsTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    detailLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
    },
    detailValue: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
    },
    totalRow: {
        borderTopWidth: 1,
        paddingTop: 14,
        marginTop: 6,
    },
    totalLabel: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
    },
    totalValue: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
    },
    infoCard: {
        marginHorizontal: 20,
        marginTop: 20,
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
    borrowButton: {
        marginHorizontal: 20,
        marginTop: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 16,
        borderRadius: 12,
    },
    borrowButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
    },
});
