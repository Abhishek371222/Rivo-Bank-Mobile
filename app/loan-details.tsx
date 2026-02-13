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
import { getCurrentUser, getActiveLoan, Loan } from "@/services/database";
import { getNextEMIDetails } from "@/services/loanService";

export default function LoanDetailsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [loan, setLoan] = useState<Loan | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading || !loan) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
            </View>
        );
    }

    const nextEMI = getNextEMIDetails(loan);
    const progress = ((loan.amount - loan.outstandingBalance) / loan.amount) * 100;
    const paidAmount = loan.amount - loan.outstandingBalance;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => { Haptics.impactAsync(); router.back(); }}
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Loan Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.outstandingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.outstandingLabel, { color: colors.textMuted }]}>Outstanding Balance</Text>
                        <Text style={[styles.outstandingAmount, { color: colors.error }]}>₹{loan.outstandingBalance.toLocaleString()}</Text>

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.success }]} />
                            </View>
                            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                {progress.toFixed(0)}% repaid
                            </Text>
                        </View>

                        <View style={styles.amountRow}>
                            <View>
                                <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Borrowed</Text>
                                <Text style={[styles.amountValue, { color: colors.text }]}>₹{loan.amount.toLocaleString()}</Text>
                            </View>
                            <View>
                                <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Paid</Text>
                                <Text style={[styles.amountValue, { color: colors.success }]}>₹{paidAmount.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={[styles.emiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.emiHeader}>
                            <View>
                                <Text style={[styles.emiLabel, { color: colors.textMuted }]}>Next EMI</Text>
                                <Text style={[styles.emiAmount, { color: colors.primary }]}>₹{nextEMI.amount.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.daysIcon, { backgroundColor: colors.warning + "15" }]}>
                                <Text style={[styles.daysValue, { color: colors.warning }]}>{nextEMI.daysRemaining}</Text>
                                <Text style={[styles.daysLabel, { color: colors.warning }]}>days</Text>
                            </View>
                        </View>
                        <Text style={[styles.emiDate, { color: colors.textSecondary }]}>
                            Due on {new Date(nextEMI.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Loan Information</Text>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Interest Rate</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{loan.interestRate}% p.a.</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Tenure</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{loan.tenure} months</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Monthly EMI</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>₹{loan.emiAmount.toLocaleString()}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Borrowed Date</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>
                                    {new Date(loan.borrowedDate).toLocaleDateString('en-IN')}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Final Due Date</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>
                                    {new Date(loan.dueDate).toLocaleDateString('en-IN')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {loan.payments.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment History</Text>

                            {loan.payments.map((payment, index) => (
                                <View key={payment.id} style={[styles.paymentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <View style={[styles.paymentIcon, { backgroundColor: colors.success + "15" }]}>
                                        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                                    </View>
                                    <View style={styles.paymentInfo}>
                                        <Text style={[styles.paymentAmount, { color: colors.text }]}>₹{payment.amount.toLocaleString()}</Text>
                                        <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
                                            {new Date(payment.date).toLocaleDateString('en-IN')} • {payment.type}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(500).delay(500)}>
                    <Pressable
                        onPress={() => { Haptics.impactAsync(); router.push("/repay-loan"); }}
                        style={[styles.repayButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.repayButtonText}>Make Payment</Text>
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
    outstandingCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
    },
    outstandingLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
        marginBottom: 8,
    },
    outstandingAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 40,
        marginBottom: 20,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
    progressText: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
    },
    amountRow: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    amountLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
        marginBottom: 4,
    },
    amountValue: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
    },
    emiCard: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    emiHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    emiLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
        marginBottom: 6,
    },
    emiAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 28,
    },
    daysIcon: {
        width: 64,
        height: 64,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    daysValue: {
        fontFamily: "Inter_700Bold",
        fontSize: 24,
    },
    daysLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 11,
    },
    emiDate: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
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
    infoCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    infoLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
    },
    infoValue: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
    },
    paymentCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentAmount: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 4,
    },
    paymentDate: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
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
