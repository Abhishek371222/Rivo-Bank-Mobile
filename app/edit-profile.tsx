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
import { useAuth } from "@/contexts/AuthContext";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const { user } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto);

    const webTopInset = Platform.OS === "web" ? 67 : 0;

    const handlePickImage = async () => {
        Haptics.impactAsync();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfilePhoto(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            if (!user) return;

            Haptics.impactAsync();

            // Update user in database with all changes including avatar
            const { updateUser } = useAuth();
            await updateUser({
                fullName,
                email,
                phone,
                profilePhoto: profilePhoto || null,
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error) {
            console.error("Error saving profile:", error);
            Alert.alert("Error", "Failed to update profile");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync();
                            router.back();
                        }}
                        style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                        <Ionicons name="close" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                    <Pressable
                        onPress={handleSave}
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                </View>

                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <View style={styles.avatarSection}>
                        <Pressable onPress={handlePickImage} style={styles.avatarContainer}>
                            {profilePhoto ? (
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarPlaceholder}>
                                        {fullName.split(" ").map((n) => n[0]).join("")}
                                    </Text>
                                </View>
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.avatarPlaceholder}>
                                        {fullName.split(" ").map((n) => n[0]).join("")}
                                    </Text>
                                </View>
                            )}
                            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        </Pressable>
                        <Text style={[styles.avatarLabel, { color: colors.textMuted }]}>
                            Tap to change photo
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                                <Ionicons name="person-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                                <Ionicons name="call-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(500).delay(300)}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Pressable
                            onPress={() => Haptics.impactAsync()}
                            style={styles.dangerButton}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.error} />
                            <Text style={[styles.dangerButtonText, { color: colors.error }]}>
                                Delete Account
                            </Text>
                        </Pressable>
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
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, flex: 1, textAlign: "center" },
    saveButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    saveButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        color: "#fff",
    },
    avatarSection: {
        alignItems: "center",
        paddingVertical: 24,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarPlaceholder: {
        fontFamily: "Inter_700Bold",
        fontSize: 36,
        color: "#fff",
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    avatarLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
    card: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    inputGroup: { marginBottom: 20 },
    label: { fontFamily: "Inter_500Medium", fontSize: 14, marginBottom: 8 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    input: {
        fontFamily: "Inter_400Regular",
        fontSize: 15,
        flex: 1,
    },
    dangerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 14,
    },
    dangerButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
});
