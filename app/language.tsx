import React, { useState } from "react";
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

const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
];

export default function LanguageScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleSelectLanguage = (code: string) => {
        Haptics.impactAsync();
        setSelectedLanguage(code);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Ionicons name="information-circle" size={24} color={colors.primary} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Select your preferred language. The app will restart to apply the changes.
                        </Text>
                    </View>
                </Animated.View>

                {languages.map((language, index) => (
                    <Animated.View
                        key={language.code}
                        entering={FadeInDown.duration(500).delay(100 * (index + 2))}
                    >
                        <Pressable
                            onPress={() => handleSelectLanguage(language.code)}
                            style={[
                                styles.languageCard,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: selectedLanguage === language.code ? colors.primary : colors.border,
                                    borderWidth: selectedLanguage === language.code ? 2 : 1,
                                }
                            ]}
                        >
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, { color: colors.text }]}>{language.name}</Text>
                                <Text style={[styles.languageNative, { color: colors.textSecondary }]}>{language.nativeName}</Text>
                            </View>

                            {selectedLanguage === language.code && (
                                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                </View>
                            )}
                        </Pressable>
                    </Animated.View>
                ))}
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
    languageCard: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 4,
    },
    languageNative: {
        fontFamily: "Inter_500Medium",
        fontSize: 14,
    },
    checkIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
});
