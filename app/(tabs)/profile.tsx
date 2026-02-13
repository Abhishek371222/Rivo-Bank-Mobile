import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

interface MenuItemProps {
  icon: string;
  label: string;
  color: string;
  bg: string;
  onPress?: () => void;
  rightText?: string;
  danger?: boolean;
}

function MenuItem({ icon, label, color, bg, onPress, rightText, danger }: MenuItemProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(); onPress?.(); }}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.menuIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={[styles.menuLabel, { color: colors.text }, danger && { color: colors.error }]}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {rightText ? <Text style={[styles.menuRightText, { color: colors.textMuted }]}>{rightText}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  function handleLogout() {
    if (Platform.OS === "web") {
      logout();
      router.replace("/(auth)/login");
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  const handleTakePhoto = async () => {
    setShowPhotoModal(false);
    Haptics.impactAsync();

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleChooseFromGallery = async () => {
    setShowPhotoModal(false);
    Haptics.impactAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const initials = user?.fullName
    ? user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + webBottomInset }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <ThemeToggle />
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable onPress={() => { Haptics.impactAsync(); setShowPhotoModal(true); }} style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{initials}</Text>
                )}
              </View>
              <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </Pressable>
            <Text style={[styles.profileName, { color: colors.text }]}>{user?.fullName || "User"}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email || ""}</Text>
            <View style={[styles.profileBadge, { backgroundColor: colors.success + "15" }]}>
              <Ionicons name="shield-checkmark" size={14} color={colors.success} />
              <Text style={[styles.profileBadgeText, { color: colors.success }]}>Verified Account</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Account</Text>
            <MenuItem
              icon="person-outline"
              label="Personal Details"
              color="#6366f1"
              bg="#eef2ff"
              onPress={() => router.push("/personal-details")}
            />
            <MenuItem
              icon="card-outline"
              label="Linked Accounts"
              color="#8b5cf6"
              bg="#f5f3ff"
              onPress={() => router.push("/linked-accounts")}
            />
            <MenuItem
              icon="document-text-outline"
              label="Statements"
              color="#0ea5e9"
              bg="#e0f2fe"
              onPress={() => router.push("/statements")}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              label="KYC Verification"
              color="#10b981"
              bg="#ecfdf5"
              onPress={() => router.push("/kyc-verification")}
              rightText="Pending"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Security</Text>
            <MenuItem
              icon="lock-closed-outline"
              label="Change Password"
              color="#10b981"
              bg="#ecfdf5"
            />
            <MenuItem
              icon="finger-print"
              label="Biometric Login"
              color="#f97316"
              bg="#fff7ed"
              rightText="Disabled"
              onPress={() => router.push("/biometric-settings")}
            />
            <MenuItem
              icon="key-outline"
              label="Card PIN"
              color="#eab308"
              bg="#fefce8"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Preferences</Text>
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              color="#ec4899"
              bg="#fdf2f8"
              onPress={() => router.push("/notification-settings")}
            />
            <MenuItem
              icon="globe-outline"
              label="Language"
              color="#14b8a6"
              bg="#f0fdfa"
              rightText="English"
              onPress={() => router.push("/language")}
            />
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              color="#6366f1"
              bg="#eef2ff"
              onPress={() => router.push("/help-support")}
            />
            <MenuItem
              icon="information-circle-outline"
              label="About Rivo"
              color="#8b5cf6"
              bg="#f5f3ff"
              onPress={() => router.push("/about")}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(500)}>
          <View style={styles.section}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.error} />
              <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Text style={[styles.version, { color: colors.textMuted }]}>Rivo v1.0.0</Text>
      </ScrollView>

      {/* Photo Upload Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPhotoModal(false)}
        >
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Profile Photo</Text>

            <Pressable
              onPress={handleTakePhoto}
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>Take Photo</Text>
            </Pressable>

            <Pressable
              onPress={handleChooseFromGallery}
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>Choose from Gallery</Text>
            </Pressable>

            <Pressable
              onPress={() => { Haptics.impactAsync(); setShowPhotoModal(false); }}
              style={styles.modalCancel}
            >
              <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28 },
  profileCard: {
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 72,
    height: 72,
  },
  cameraIcon: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 26, color: "#fff" },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 22 },
  profileEmail: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 4 },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  profileBadgeText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  menuIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  menuLabel: { fontFamily: "Inter_500Medium", fontSize: 15 },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuRightText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  version: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  modalCancel: {
    paddingVertical: 18,
    alignItems: "center",
  },
  modalCancelText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
