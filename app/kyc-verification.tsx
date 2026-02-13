import React from "react";
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

interface KYCStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    status: "pending" | "in-progress" | "completed" | "rejected";
    route: string;
}

export default function KYCVerificationScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const kycSteps: KYCStep[] = [
        {
            id: "aadhaar",
            title: "Aadhaar Verification",
            description: "Verify your identity with Aadhaar",
            icon: "card-outline",
            status: "completed",
            route: "/kyc-aadhaar",
        },
        {
            id: "pan",
            title: "PAN Card Verification",
            description: "Link your PAN card",
            icon: "document-text-outline",
            status: "completed",
            route: "/kyc-pan",
        },
        {
            id: "selfie",
            title: "Selfie Verification",
            description: "Take a selfie for face verification",
            icon: "camera-outline",
            status: "pending",
            route: "/kyc-selfie",
        },
    ];

    const overallStatus: "pending" | "in-progress" | "verified" | "rejected" = "in-progress";

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return colors.success;
            case "in-progress":
                return colors.warning;
            case "rejected":
                return colors.error;
            default:
                return colors.textMuted;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return "checkmark-circle";
            case "in-progress":
                return "time";
            case "rejected":
                return "close-circle";
            default:
                return "ellipse-outline";
        }
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>KYC Verification</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.statusIcon, { backgroundColor: getStatusColor(overallStatus) + "15" }]}>
                            <Ionicons name={getStatusIcon(overallStatus)} size={40} color={getStatusColor(overallStatus)} />
                        </View>
                        <Text style={[styles.statusTitle, { color: colors.text }]}>
                            {overallStatus === "verified" ? "KYC Verified" : overallStatus === "in-progress" ? "KYC In Progress" : "KYC Pending"}
                        </Text>
                        <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                            {overallStatus === "verified"
                                ? "Your account is fully verified"
                                : overallStatus === "in-progress"
                                    ? "Complete the remaining steps to verify your account"
                                    : "Start your KYC verification to unlock all features"}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.stepsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Verification Steps</Text>

                        {kycSteps.map((step, index) => (
                            <Pressable
                                key={step.id}
                                onPress={() => { Haptics.impactAsync(); router.push(step.route as any); }}
                                style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={[styles.stepIcon, { backgroundColor: getStatusColor(step.status) + "15" }]}>
                                    <Ionicons name={step.icon as any} size={28} color={getStatusColor(step.status)} />
                                </View>

                                <View style={styles.stepInfo}>
                                    <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>{step.description}</Text>
                                </View>

                                <View style={styles.stepStatus}>
                                    <Ionicons
                                        name={getStatusIcon(step.status)}
                                        size={24}
                                        color={getStatusColor(step.status)}
                                    />
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Ionicons name="information-circle" size={24} color={colors.primary} />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoTitle, { color: colors.text }]}>Why KYC?</Text>
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                KYC verification is mandatory as per RBI guidelines. It helps us ensure the security of your account and enables you to access all banking features.
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={[styles.benefitsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.benefitsTitle, { color: colors.text }]}>Benefits of KYC Verification</Text>

                        <View style={styles.benefit}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                            <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Higher transaction limits</Text>
                        </View>

                        <View style={styles.benefit}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                            <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Access to all banking features</Text>
                        </View>

                        <View style={styles.benefit}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                            <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Enhanced account security</Text>
                        </View>

                        <View style={styles.benefit}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                            <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Faster loan approvals</Text>
                        </View>
                    </View>
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
    statusCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
    },
    statusIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    statusTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        marginBottom: 8,
    },
    statusDescription: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
    },
    stepsSection: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    sectionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
        marginBottom: 16,
    },
    stepCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    stepIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    stepInfo: {
        flex: 1,
    },
    stepTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 4,
    },
    stepDescription: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
    },
    stepStatus: {
        marginLeft: 12,
    },
    infoCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        gap: 14,
        borderWidth: 1,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 6,
    },
    infoText: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        lineHeight: 22,
    },
    benefitsCard: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    benefitsTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 16,
    },
    benefit: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    benefitText: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
    },
});
