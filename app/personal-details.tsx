import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import * as Haptics from "expo-haptics";

export default function PersonalDetailsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "John Doe",
        email: user?.email || "john.doe@example.com",
        phone: "+91 98765 43210",
        dob: "15 Jan 1995",
        address: "123 MG Road, Bangalore, Karnataka 560001",
        accountNumber: "1234567890123456",
        ifsc: "RIVO0001234",
        kycStatus: "Verified",
    });

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsEditing(false);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Personal Details</Text>
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync();
                        if (isEditing) {
                            handleSave();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                    style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.6 }]}
                >
                    <Text style={[styles.editButtonText, { color: colors.primary }]}>
                        {isEditing ? "Save" : "Edit"}
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Basic Information</Text>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Name</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.fieldInput, { color: colors.text }]}
                                    value={formData.fullName}
                                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                                    placeholder="Enter full name"
                                    placeholderTextColor={colors.textMuted}
                                />
                            ) : (
                                <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.fullName}</Text>
                            )}
                        </View>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.fieldInput, { color: colors.text }]}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    placeholder="Enter email"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            ) : (
                                <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.email}</Text>
                            )}
                        </View>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Phone Number</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.fieldInput, { color: colors.text }]}
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    placeholder="Enter phone number"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="phone-pad"
                                />
                            ) : (
                                <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.phone}</Text>
                            )}
                        </View>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
                            <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.dob}</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Address</Text>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Residential Address</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.fieldInput, styles.textArea, { color: colors.text }]}
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                                    placeholder="Enter address"
                                    placeholderTextColor={colors.textMuted}
                                    multiline
                                    numberOfLines={3}
                                />
                            ) : (
                                <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.address}</Text>
                            )}
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Account Information</Text>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Account Number</Text>
                            <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.accountNumber}</Text>
                            <Ionicons name="copy-outline" size={20} color={colors.textMuted} style={styles.copyIcon} />
                        </View>

                        <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>IFSC Code</Text>
                            <Text style={[styles.fieldValue, { color: colors.text }]}>{formData.ifsc}</Text>
                            <Ionicons name="copy-outline" size={20} color={colors.textMuted} style={styles.copyIcon} />
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>KYC Status</Text>

                        <View style={[styles.kycCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.kycHeader}>
                                <View style={[styles.kycBadge, { backgroundColor: colors.success + "15" }]}>
                                    <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                                </View>
                                <View style={styles.kycInfo}>
                                    <Text style={[styles.kycTitle, { color: colors.text }]}>KYC Verified</Text>
                                    <Text style={[styles.kycSubtitle, { color: colors.textSecondary }]}>Your account is fully verified</Text>
                                </View>
                            </View>
                            <Pressable
                                onPress={() => { Haptics.impactAsync(); router.push("/kyc-verification" as any); }}
                                style={[styles.viewKycButton, { backgroundColor: colors.primary + "10", borderColor: colors.primary }]}
                            >
                                <Text style={[styles.viewKycButtonText, { color: colors.primary }]}>View KYC Details</Text>
                                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                            </Pressable>
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
    editButton: {
        width: 60,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    editButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionLabel: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    field: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        position: "relative",
    },
    fieldLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
        marginBottom: 6,
    },
    fieldValue: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
    },
    fieldInput: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        padding: 0,
    },
    textArea: {
        minHeight: 60,
        textAlignVertical: "top",
    },
    copyIcon: {
        position: "absolute",
        top: 16,
        right: 16,
    },
    kycCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    kycHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    kycBadge: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    kycInfo: {
        flex: 1,
    },
    kycTitle: {
        fontFamily: "Inter_700Bold",
        fontSize: 16,
        marginBottom: 2,
    },
    kycSubtitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
    },
    viewKycButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    viewKycButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
    },
});
