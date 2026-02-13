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
import * as ImagePicker from "expo-image-picker";

export default function KYCPANScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [panNumber, setPanNumber] = useState("");
    const [panImage, setPanImage] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleUploadPAN = async () => {
        Haptics.impactAsync();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 10],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPanImage(result.assets[0].uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleVerify = () => {
        if (panNumber.length !== 10) {
            Alert.alert("Invalid PAN", "Please enter a valid 10-character PAN number");
            return;
        }
        if (!panImage) {
            Alert.alert("Upload Required", "Please upload a photo of your PAN card");
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsVerified(true);
    };

    const formatPAN = (text: string) => {
        return text.toUpperCase().slice(0, 10);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>PAN Verification</Text>
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
                            <Text style={[styles.successTitle, { color: colors.text }]}>PAN Verified!</Text>
                            <Text style={[styles.successDescription, { color: colors.textSecondary }]}>
                                Your PAN card has been successfully verified
                            </Text>

                            <View style={[styles.detailsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Name</Text>
                                    <Text style={[styles.detailValue, { color: colors.text }]}>John Doe</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>PAN</Text>
                                    <Text style={[styles.detailValue, { color: colors.text }]}>{panNumber}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Status</Text>
                                    <Text style={[styles.detailValue, { color: colors.success }]}>Active</Text>
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
                                <Ionicons name="document-text" size={48} color={colors.primary} />
                                <Text style={[styles.infoTitle, { color: colors.text }]}>PAN Card Verification</Text>
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    Enter your PAN number and upload a clear photo of your PAN card for verification.
                                </Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                            <View style={styles.formSection}>
                                <Text style={[styles.label, { color: colors.text }]}>PAN Number</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                                    placeholder="ABCDE1234F"
                                    placeholderTextColor={colors.textMuted}
                                    value={panNumber}
                                    onChangeText={(text) => setPanNumber(formatPAN(text))}
                                    autoCapitalize="characters"
                                    maxLength={10}
                                />

                                <Text style={[styles.label, { color: colors.text }]}>Upload PAN Card</Text>
                                <Pressable
                                    onPress={handleUploadPAN}
                                    style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                >
                                    {panImage ? (
                                        <>
                                            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                                            <Text style={[styles.uploadText, { color: colors.success }]}>PAN Card Uploaded</Text>
                                            <Text style={[styles.uploadSubtext, { color: colors.textMuted }]}>Tap to change</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="cloud-upload-outline" size={48} color={colors.primary} />
                                            <Text style={[styles.uploadText, { color: colors.text }]}>Upload PAN Card Photo</Text>
                                            <Text style={[styles.uploadSubtext, { color: colors.textMuted }]}>JPG, PNG (Max 5MB)</Text>
                                        </>
                                    )}
                                </Pressable>

                                <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips for clear photo:</Text>
                                    <View style={styles.tip}>
                                        <Ionicons name="checkmark" size={16} color={colors.success} />
                                        <Text style={[styles.tipText, { color: colors.textSecondary }]}>Ensure all details are visible</Text>
                                    </View>
                                    <View style={styles.tip}>
                                        <Ionicons name="checkmark" size={16} color={colors.success} />
                                        <Text style={[styles.tipText, { color: colors.textSecondary }]}>Good lighting, no glare</Text>
                                    </View>
                                    <View style={styles.tip}>
                                        <Ionicons name="checkmark" size={16} color={colors.success} />
                                        <Text style={[styles.tipText, { color: colors.textSecondary }]}>Place on flat surface</Text>
                                    </View>
                                </View>

                                <Pressable
                                    onPress={handleVerify}
                                    style={[styles.button, { backgroundColor: colors.primary }]}
                                >
                                    <Text style={styles.buttonText}>Verify PAN</Text>
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
    label: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        marginBottom: 24,
    },
    uploadBox: {
        borderRadius: 16,
        padding: 32,
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dashed",
        marginBottom: 20,
    },
    uploadText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        marginTop: 12,
    },
    uploadSubtext: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        marginTop: 4,
    },
    tipsCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
    },
    tipsTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        marginBottom: 12,
    },
    tip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    tipText: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
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
