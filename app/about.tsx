import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

export default function AboutScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleOpenLink = (url: string) => {
        Haptics.impactAsync();
        Linking.openURL(url);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>About Rivo</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={styles.logoSection}>
                        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
                            <Text style={styles.logoText}>R</Text>
                        </View>
                        <Text style={[styles.appName, { color: colors.text }]}>Rivo Bank</Text>
                        <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
                        <Text style={[styles.tagline, { color: colors.textMuted }]}>Banking Made Simple</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>About Us</Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            Rivo Bank is India's leading digital banking platform, offering seamless financial services to millions of users. We're committed to making banking accessible, secure, and delightful for everyone.
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>

                        <Pressable
                            onPress={() => handleOpenLink("https://rivobank.com/terms")}
                            style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.linkContent}>
                                <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                                <Text style={[styles.linkText, { color: colors.text }]}>Terms & Conditions</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </Pressable>

                        <Pressable
                            onPress={() => handleOpenLink("https://rivobank.com/privacy")}
                            style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.linkContent}>
                                <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
                                <Text style={[styles.linkText, { color: colors.text }]}>Privacy Policy</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </Pressable>

                        <Pressable
                            onPress={() => handleOpenLink("https://rivobank.com/licenses")}
                            style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <View style={styles.linkContent}>
                                <Ionicons name="ribbon-outline" size={24} color={colors.primary} />
                                <Text style={[styles.linkText, { color: colors.text }]}>Licenses</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </Pressable>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Company</Text>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Registered Name</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>Rivo Digital Banking Pvt. Ltd.</Text>
                        </View>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>CIN</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>U65999KA2020PTC123456</Text>
                        </View>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Registered Office</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>
                                123 MG Road, Bangalore{"\n"}Karnataka 560001, India
                            </Text>
                        </View>

                        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>RBI License</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>NBFC-P2P-2020-001234</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(500)}>
                    <Text style={[styles.copyright, { color: colors.textMuted }]}>
                        © 2026 Rivo Digital Banking Pvt. Ltd.{"\n"}All rights reserved.
                    </Text>
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
    logoSection: {
        alignItems: "center",
        paddingVertical: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    logoText: {
        fontFamily: "Inter_700Bold",
        fontSize: 40,
        color: "#fff",
    },
    appName: {
        fontFamily: "Inter_700Bold",
        fontSize: 28,
        marginBottom: 4,
    },
    version: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
        marginBottom: 8,
    },
    tagline: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 18,
        marginBottom: 16,
    },
    description: {
        fontFamily: "Inter_400Regular",
        fontSize: 15,
        lineHeight: 24,
    },
    linkCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    linkContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    linkText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    infoLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
        marginBottom: 6,
    },
    infoValue: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        lineHeight: 22,
    },
    copyright: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
});
