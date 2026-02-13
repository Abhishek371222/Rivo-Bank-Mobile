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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

export default function KYCAadhaarScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"input" | "otp" | "verified">("input");

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleSendOTP = () => {
        if (aadhaarNumber.length !== 12) {
            Alert.alert("Invalid Aadhaar", "Please enter a valid 12-digit Aadhaar number");
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep("otp");
    };

    const handleVerifyOTP = () => {
        if (otp.length !== 6) {
            Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP");
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep("verified");
    };

    const formatAadhaar = (text: string) => {
        const cleaned = text.replace(/\D/g, "");
        const limited = cleaned.slice(0, 12);
        const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ");
        return formatted;
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Aadhaar Verification</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {step === "verified" ? (
                    <Animated.View entering={FadeInDown.duration(500)}>
                        <View style={[styles.successCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.successIcon, { backgroundColor: colors.success + "15" }]}>
                                <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                            </View>
                            <Text style={[styles.successTitle, { color: colors.text }]}>Aadhaar Verified!</Text>
                            <Text style={[styles.successDescription, { color: colors.textSecondary }]}>
                                Your Aadhaar has been successfully verified
                            </Text>

                            <View style={[styles.detailsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Name</Text>
                                    <Text style={[styles.detailValue, { color: colors.text }]}>John Doe</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Aadhaar</Text>
                                    <Text style={[styles.detailValue, { color: colors.text }]}>XXXX XXXX {aadhaarNumber.slice(-4)}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Address</Text>
                                    <Text style={[styles.detailValue, { color: colors.text }]}>123 MG Road, Bangalore</Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={() => { Haptics.impactAsync(); router.back(); }}
                                style={[styles.doneButton, { backgroundColor: colors.primary }]}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                ) : (
                    <>
                        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
                                <Text style={[styles.infoTitle, { color: colors.text }]}>Secure Verification</Text>
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    Your Aadhaar details are encrypted and stored securely. We use UIDAI's official API for verification.
                                </Text>
                            </View>
                        </Animated.View>

                        {step === "input" ? (
                            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                                <View style={styles.formSection}>
                                    <Text style={[styles.label, { color: colors.text }]}>Aadhaar Number</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                                        placeholder="XXXX XXXX XXXX"
                                        placeholderTextColor={colors.textMuted}
                                        value={formatAadhaar(aadhaarNumber)}
                                        onChangeText={(text) => setAadhaarNumber(text.replace(/\s/g, ""))}
                                        keyboardType="number-pad"
                                        maxLength={14}
                                    />

                                    <Pressable
                                        onPress={handleSendOTP}
                                        style={[styles.button, { backgroundColor: colors.primary }]}
                                    >
                                        <Text style={styles.buttonText}>Send OTP</Text>
                                    </Pressable>
                                </View>
                            </Animated.View>
                        ) : (
                            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                                <View style={styles.formSection}>
                                    <Text style={[styles.label, { color: colors.text }]}>Enter OTP</Text>
                                    <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
                                        OTP sent to mobile linked with Aadhaar ••••••{aadhaarNumber.slice(-4)}
                                    </Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                                        placeholder="Enter 6-digit OTP"
                                        placeholderTextColor={colors.textMuted}
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />

                                    <Pressable
                                        onPress={handleVerifyOTP}
                                        style={[styles.button, { backgroundColor: colors.primary }]}
                                    >
                                        <Text style={styles.buttonText}>Verify OTP</Text>
                                    </Pressable>

                                    <Pressable onPress={() => { Haptics.impactAsync(); Alert.alert("OTP Resent", "A new OTP has been sent"); }}>
                                        <Text style={[styles.resendText, { color: colors.primary }]}>Resend OTP</Text>
                                    </Pressable>
                                </View>
                            </Animated.View>
                        )}
                    </>
                )}
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
    infoCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
    },
    infoTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    infoText: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
    },
    formSection: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    label: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 8,
    },
    sublabel: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        marginBottom: 12,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#fff",
    },
    resendText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        textAlign: "center",
        marginTop: 16,
    },
    successCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 32,
        alignItems: "center",
        borderWidth: 1,
    },
    successIcon: {
        width: 96,
        height: 96,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    successTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 24,
        marginBottom: 8,
    },
    successDescription: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
    },
    detailsCard: {
        width: "100%",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    detailLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
    },
    detailValue: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
    },
    doneButton: {
        width: "100%",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    doneButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        color: "#fff",
    },
});
