import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    Linking,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

const faqs = [
    {
        question: "How do I reset my password?",
        answer: "Go to Settings > Security > Change Password. You'll need to verify your identity via OTP before setting a new password.",
    },
    {
        question: "How long does a transaction take?",
        answer: "Instant transfers within Rivo are immediate. Bank transfers typically take 1-2 business days depending on the receiving bank.",
    },
    {
        question: "What are the transaction limits?",
        answer: "Daily limit is ₹1,00,000 for verified accounts. Monthly limit is ₹5,00,000. You can request higher limits by contacting support.",
    },
    {
        question: "How do I link a bank account?",
        answer: "Go to Profile > Linked Accounts > Add New Account. Enter your account details and verify via micro-deposit.",
    },
    {
        question: "Is my money safe with Rivo?",
        answer: "Yes! Rivo is RBI regulated and your deposits are insured up to ₹5,00,000 by DICGC. We use bank-grade encryption for all transactions.",
    },
];

export default function HelpSupportScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleCall = () => {
        Haptics.impactAsync();
        Linking.openURL("tel:1800-123-4567");
    };

    const handleEmail = () => {
        Haptics.impactAsync();
        Linking.openURL("mailto:support@rivobank.com");
    };

    const handleChat = () => {
        Haptics.impactAsync();
        Alert.alert("Live Chat", "Chat support is available Mon-Sat, 9 AM - 6 PM");
    };

    const toggleFaq = (index: number) => {
        Haptics.impactAsync();
        setExpandedFaq(expandedFaq === index ? null : index);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={styles.contactSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>

                        <View style={styles.contactGrid}>
                            <Pressable
                                onPress={handleCall}
                                style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={[styles.contactIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name="call" size={24} color={colors.primary} />
                                </View>
                                <Text style={[styles.contactLabel, { color: colors.text }]}>Call Us</Text>
                                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>1800-123-4567</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleEmail}
                                style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={[styles.contactIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name="mail" size={24} color={colors.primary} />
                                </View>
                                <Text style={[styles.contactLabel, { color: colors.text }]}>Email</Text>
                                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>support@rivo.com</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleChat}
                                style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={[styles.contactIcon, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                                </View>
                                <Text style={[styles.contactLabel, { color: colors.text }]}>Live Chat</Text>
                                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>9 AM - 6 PM</Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.faqSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>

                        {faqs.map((faq, index) => (
                            <Pressable
                                key={index}
                                onPress={() => toggleFaq(index)}
                                style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                                    <Ionicons
                                        name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={colors.textMuted}
                                    />
                                </View>

                                {expandedFaq === index && (
                                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={[styles.hoursCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Ionicons name="time-outline" size={24} color={colors.primary} />
                        <View style={styles.hoursInfo}>
                            <Text style={[styles.hoursTitle, { color: colors.text }]}>Support Hours</Text>
                            <Text style={[styles.hoursText, { color: colors.textSecondary }]}>Monday - Saturday: 9:00 AM - 6:00 PM</Text>
                            <Text style={[styles.hoursText, { color: colors.textSecondary }]}>Sunday: Closed</Text>
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
    contactSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 20,
        marginBottom: 16,
    },
    contactGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    contactCard: {
        flex: 1,
        minWidth: "30%",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
    },
    contactIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    contactLabel: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        marginBottom: 4,
    },
    contactValue: {
        fontFamily: "Inter_400Regular",
        fontSize: 11,
        textAlign: "center",
    },
    faqSection: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    faqCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    faqQuestion: {
        flex: 1,
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginRight: 12,
    },
    faqAnswer: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        lineHeight: 22,
        marginTop: 12,
    },
    hoursCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        gap: 16,
        borderWidth: 1,
    },
    hoursInfo: {
        flex: 1,
    },
    hoursTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 8,
    },
    hoursText: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        marginBottom: 4,
    },
});
