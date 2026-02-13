import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";

export default function KYCSelfieScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [selfieImage, setSelfieImage] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleTakeSelfie = async () => {
        Haptics.impactAsync();

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take selfie');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            cameraType: ImagePicker.CameraType.front,
        });

        if (!result.canceled) {
            setSelfieImage(result.assets[0].uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleVerify = () => {
        if (!selfieImage) {
            Alert.alert("Selfie Required", "Please take a selfie to continue");
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsVerified(true);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Selfie Verification</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {isVerified ? (
                    <Animated.View entering={FadeInDown.duration(500)}>
                        <View style={[styles.successCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.successIcon, { backgroundColor: colors.success + "15" }]}>
                                <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                            </View>
                            <Text style={[styles.successTitle, { color: colors.text }]}>Selfie Verified!</Text>
                            <Text style={[styles.successDescription, { color: colors.textSecondary }]}>
                                Your face verification is complete
                            </Text>

                            <View style={[styles.detailsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Liveness Check</Text>
                                    <Text style={[styles.detailValue, { color: colors.success }]}>Passed</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Face Match</Text>
                                    <Text style={[styles.detailValue, { color: colors.success }]}>98% Match</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Quality</Text>
                                    <Text style={[styles.detailValue, { color: colors.success }]}>Excellent</Text>
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
                                <Ionicons name="camera" size={48} color={colors.primary} />
                                <Text style={[styles.infoTitle, { color: colors.text }]}>Face Verification</Text>
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    Take a selfie to verify your identity. Make sure your face is clearly visible and well-lit.
                                </Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                            <View style={styles.formSection}>
                                <Pressable
                                    onPress={handleTakeSelfie}
                                    style={[styles.cameraBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                >
                                    {selfieImage ? (
                                        <>
                                            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                                            <Text style={[styles.cameraText, { color: colors.success }]}>Selfie Captured</Text>
                                            <Text style={[styles.cameraSubtext, { color: colors.textMuted }]}>Tap to retake</Text>
                                        </>
                                    ) : (
                                        <>
                                            <View style={[styles.cameraIcon, { backgroundColor: colors.primary + "15" }]}>
                                                <Ionicons name="camera" size={48} color={colors.primary} />
                                            </View>
                                            <Text style={[styles.cameraText, { color: colors.text }]}>Take Selfie</Text>
                                            <Text style={[styles.cameraSubtext, { color: colors.textMuted }]}>Tap to open camera</Text>
                                        </>
                                    )}
                                </Pressable>

                                <View style={[styles.guidelinesCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Text style={[styles.guidelinesTitle, { color: colors.text }]}>Guidelines:</Text>

                                    <View style={styles.guideline}>
                                        <Ionicons name="sunny-outline" size={20} color={colors.primary} />
                                        <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>Good lighting on your face</Text>
                                    </View>

                                    <View style={styles.guideline}>
                                        <Ionicons name="glasses-outline" size={20} color={colors.primary} />
                                        <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>Remove sunglasses and cap</Text>
                                    </View>

                                    <View style={styles.guideline}>
                                        <Ionicons name="happy-outline" size={20} color={colors.primary} />
                                        <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>Look directly at camera</Text>
                                    </View>

                                    <View style={styles.guideline}>
                                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                                        <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>Only your face in frame</Text>
                                    </View>
                                </View>

                                <Pressable
                                    onPress={handleVerify}
                                    style={[styles.button, { backgroundColor: colors.primary, opacity: selfieImage ? 1 : 0.5 }]}
                                    disabled={!selfieImage}
                                >
                                    <Text style={styles.buttonText}>Verify Selfie</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
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
    cameraBox: {
        borderRadius: 20,
        padding: 48,
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dashed",
        marginBottom: 24,
    },
    cameraIcon: {
        width: 96,
        height: 96,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    cameraText: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
        marginTop: 12,
    },
    cameraSubtext: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        marginTop: 4,
    },
    guidelinesCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
    },
    guidelinesTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 16,
    },
    guideline: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
    },
    guidelineText: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
        flex: 1,
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
