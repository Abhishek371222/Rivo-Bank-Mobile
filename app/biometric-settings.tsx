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
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BIOMETRIC_ENABLED_KEY = "@rivo_biometric_enabled";

export default function BiometricSettingsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    useEffect(() => {
        checkBiometricAvailability();
        loadBiometricPreference();
    }, []);

    const checkBiometricAvailability = async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

            setIsAvailable(compatible && enrolled);

            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setBiometricType("Face ID");
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometricType("Fingerprint");
            } else {
                setBiometricType("Biometric");
            }
        } catch (error) {
            console.error("Error checking biometric:", error);
            setIsAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    const loadBiometricPreference = async () => {
        try {
            const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
            setIsEnabled(enabled === "true");
        } catch (error) {
            console.error("Error loading preference:", error);
        }
    };

    const handleToggleBiometric = async () => {
        try {
            if (!isAvailable) {
                Alert.alert(
                    "Not Available",
                    "Biometric authentication is not available on this device"
                );
                return;
            }

            if (!isEnabled) {
                // Enabling - authenticate first
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: `Enable ${biometricType} Login`,
                    fallbackLabel: "Use Password",
                });

                if (result.success) {
                    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
                    setIsEnabled(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert("Success", `${biometricType} login enabled successfully`);
                } else {
                    Alert.alert("Authentication Failed", "Please try again");
                }
            } else {
                // Disabling
                Alert.alert(
                    "Disable Biometric Login",
                    `Are you sure you want to disable ${biometricType} login?`,
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Disable",
                            style: "destructive",
                            onPress: async () => {
                                await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, "false");
                                setIsEnabled(false);
                                Haptics.impactAsync();
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            console.error("Error toggling biometric:", error);
            Alert.alert("Error", "Failed to update biometric settings");
        }
    };

    const testBiometric = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: `Test ${biometricType}`,
                fallbackLabel: "Cancel",
            });

            if (result.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Authentication successful!");
            } else {
                Alert.alert("Failed", "Authentication failed");
            }
        } catch (error) {
            console.error("Error testing biometric:", error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Biometric Login</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.statusIcon, { backgroundColor: isEnabled ? colors.success + "15" : colors.textMuted + "15" }]}>
                            <Ionicons
                                name={isEnabled ? "shield-checkmark" : "shield-outline"}
                                size={48}
                                color={isEnabled ? colors.success : colors.textMuted}
                            />
                        </View>
                        <Text style={[styles.statusTitle, { color: colors.text }]}>
                            {isEnabled ? `${biometricType} Enabled` : `${biometricType} Disabled`}
                        </Text>
                        <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                            {isEnabled
                                ? `You can use ${biometricType} to login quickly and securely`
                                : `Enable ${biometricType} for quick and secure login`}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Pressable
                            onPress={handleToggleBiometric}
                            disabled={!isAvailable}
                            style={[styles.toggleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.toggleLeft}>
                                <Ionicons
                                    name={biometricType === "Face ID" ? "scan" : "finger-print"}
                                    size={24}
                                    color={isAvailable ? colors.primary : colors.textMuted}
                                />
                                <View style={styles.toggleText}>
                                    <Text style={[styles.toggleTitle, { color: colors.text }]}>
                                        Enable {biometricType}
                                    </Text>
                                    <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>
                                        {isAvailable ? "Use biometric to login" : "Not available on this device"}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.toggle, { backgroundColor: isEnabled ? colors.primary : colors.border }]}>
                                <View style={[styles.toggleThumb, { transform: [{ translateX: isEnabled ? 20 : 0 }] }]} />
                            </View>
                        </Pressable>
                    </View>
                </Animated.View>

                {isEnabled && (
                    <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                        <View style={styles.section}>
                            <Pressable
                                onPress={testBiometric}
                                style={[styles.testButton, { backgroundColor: colors.primary }]}
                            >
                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                <Text style={styles.testButtonText}>Test {biometricType}</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>How it Works</Text>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.infoItem}>
                                <View style={[styles.infoIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name="lock-closed" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={[styles.infoTitle, { color: colors.text }]}>Secure</Text>
                                    <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                                        Your biometric data never leaves your device
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={[styles.infoIcon, { backgroundColor: colors.success + "15" }]}>
                                    <Ionicons name="flash" size={20} color={colors.success} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={[styles.infoTitle, { color: colors.text }]}>Fast</Text>
                                    <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                                        Login instantly without typing your password
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={[styles.infoIcon, { backgroundColor: colors.warning + "15" }]}>
                                    <Ionicons name="key" size={20} color={colors.warning} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={[styles.infoTitle, { color: colors.text }]}>Fallback</Text>
                                    <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                                        You can always use your password as backup
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(500)}>
                    <View style={[styles.noteCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning }]}>
                        <Ionicons name="information-circle" size={20} color={colors.warning} />
                        <Text style={[styles.noteText, { color: colors.text }]}>
                            Make sure you have set up {biometricType} in your device settings before enabling this feature.
                        </Text>
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
    loadingText: {
        fontFamily: "Inter_500Medium",
        fontSize: 16,
        textAlign: "center",
        marginTop: 100,
    },
    statusCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 32,
        alignItems: "center",
        borderWidth: 1,
    },
    statusIcon: {
        width: 96,
        height: 96,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    statusTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 22,
        marginBottom: 8,
    },
    statusSubtitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    toggleCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    toggleLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flex: 1,
    },
    toggleText: {
        flex: 1,
    },
    toggleTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 2,
    },
    toggleSubtitle: {
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
    testButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 14,
        borderRadius: 12,
    },
    testButtonText: {
        fontFamily: "Inter_700Bold",
        fontSize: 15,
        color: "#fff",
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
    infoItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    infoText: {
        flex: 1,
    },
    infoTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 4,
    },
    infoDescription: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        lineHeight: 20,
    },
    noteCard: {
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    noteText: {
        flex: 1,
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        lineHeight: 20,
    },
});
