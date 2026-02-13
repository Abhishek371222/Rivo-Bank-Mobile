import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Platform,
    Alert,
    TextInput,
    Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getCurrentUser, updateUserBalance, saveTransaction, Transaction } from "@/services/database";

export default function ScanPayScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [merchantData, setMerchantData] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        Haptics.impactAsync();

        try {
            // Parse QR code data (UPI format: upi://pay?pa=merchant@upi&pn=MerchantName&am=amount)
            const upiData = parseUPIData(data);
            setMerchantData(upiData);
            setShowPaymentModal(true);
        } catch (error) {
            Alert.alert("Invalid QR Code", "Please scan a valid payment QR code");
            setScanned(false);
        }
    };

    const parseUPIData = (data: string) => {
        // Demo parser - in production, properly parse UPI QR codes
        return {
            merchantName: "Demo Merchant",
            upiId: "merchant@upi",
            amount: "",
        };
    };

    const handlePayment = async () => {
        try {
            const paymentAmount = parseFloat(amount);
            if (!paymentAmount || paymentAmount <= 0) {
                Alert.alert("Invalid Amount", "Please enter a valid amount");
                return;
            }

            const user = await getCurrentUser();
            if (!user) {
                Alert.alert("Error", "Please login first");
                return;
            }

            if (paymentAmount > user.balance) {
                Alert.alert("Insufficient Balance", "You don't have enough balance");
                return;
            }

            Haptics.impactAsync();

            // Deduct from balance
            const newBalance = user.balance - paymentAmount;
            await updateUserBalance(user.id, newBalance);

            // Create transaction
            const transaction: Transaction = {
                id: `txn-${Date.now()}`,
                userId: user.id,
                type: 'debit',
                amount: paymentAmount,
                category: 'Payment',
                description: `Payment to ${merchantData.merchantName}`,
                merchant: merchantData.merchantName,
                date: new Date().toISOString(),
                balance: newBalance,
            };
            await saveTransaction(transaction);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            setShowPaymentModal(false);

            Alert.alert(
                "Payment Successful! 🎉",
                `₹${paymentAmount.toLocaleString()} paid to ${merchantData.merchantName}`,
                [
                    {
                        text: "Done",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error("Error processing payment:", error);
            Alert.alert("Error", "Failed to process payment. Please try again.");
        }
    };

    if (!permission) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                    <Pressable
                        onPress={() => { Haptics.impactAsync(); router.back(); }}
                        style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Scan & Pay</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={64} color={colors.textMuted} />
                    <Text style={[styles.permissionTitle, { color: colors.text }]}>Camera Permission Required</Text>
                    <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
                        We need camera access to scan QR codes for payments
                    </Text>
                    <Pressable
                        onPress={requestPermission}
                        style={[styles.permissionButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </Pressable>
                </View>
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Scan & Pay</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                />

                <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                        <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
                        <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
                        <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
                        <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
                    </View>

                    <Text style={styles.scanText}>Align QR code within the frame</Text>
                </View>
            </View>

            {scanned && (
                <Pressable
                    onPress={() => setScanned(false)}
                    style={[styles.rescanButton, { backgroundColor: colors.primary }]}
                >
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.rescanText}>Scan Again</Text>
                </Pressable>
            )}

            <Modal
                visible={showPaymentModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowPaymentModal(false)}>
                    <Animated.View
                        entering={FadeInDown.duration(300)}
                        style={[styles.modalContent, { backgroundColor: colors.surface }]}
                    >
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Payment Details</Text>
                            <Pressable onPress={() => setShowPaymentModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </Pressable>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={[styles.merchantCard, { backgroundColor: colors.background }]}>
                                <View style={[styles.merchantIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name="storefront" size={32} color={colors.primary} />
                                </View>
                                <Text style={[styles.merchantName, { color: colors.text }]}>{merchantData?.merchantName}</Text>
                                <Text style={[styles.merchantUPI, { color: colors.textSecondary }]}>{merchantData?.upiId}</Text>
                            </View>

                            <View style={styles.amountSection}>
                                <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Enter Amount</Text>
                                <View style={[styles.amountInputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                    <Text style={[styles.rupeeSymbol, { color: colors.text }]}>₹</Text>
                                    <TextInput
                                        style={[styles.amountInput, { color: colors.text }]}
                                        placeholder="0"
                                        placeholderTextColor={colors.textMuted}
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={setAmount}
                                        autoFocus
                                    />
                                </View>
                            </View>

                            <Pressable
                                onPress={handlePayment}
                                style={[styles.payButton, { backgroundColor: colors.primary }]}
                            >
                                <Text style={styles.payButtonText}>Pay Now</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
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
    loadingText: {
        fontFamily: "Inter_500Medium",
        fontSize: 16,
        textAlign: "center",
        marginTop: 100,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    permissionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    permissionText: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
    },
    permissionButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    permissionButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        color: "#fff",
    },
    cameraContainer: {
        flex: 1,
        position: "relative",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    scanArea: {
        width: 280,
        height: 280,
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 40,
        height: 40,
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
    },
    scanText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        color: "#fff",
        marginTop: 40,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    rescanButton: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    rescanText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        color: "#fff",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
    },
    modalBody: {
        padding: 20,
    },
    merchantCard: {
        alignItems: "center",
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
    },
    merchantIcon: {
        width: 72,
        height: 72,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    merchantName: {
        fontFamily: "Inter_700Bold",
        fontSize: 20,
        marginBottom: 6,
    },
    merchantUPI: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
    },
    amountSection: {
        marginBottom: 24,
    },
    amountLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 13,
        marginBottom: 10,
    },
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 2,
        paddingHorizontal: 16,
    },
    rupeeSymbol: {
        fontFamily: "Inter_700Bold",
        fontSize: 28,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontFamily: "Inter_700Bold",
        fontSize: 28,
        paddingVertical: 16,
    },
    payButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 16,
        borderRadius: 12,
    },
    payButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#fff",
    },
});
