import React from "react";
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
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import * as Haptics from "expo-haptics";

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
  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(); onPress?.(); }}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.menuIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {rightText ? <Text style={styles.menuRightText}>{rightText}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

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

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + webBottomInset }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.profileName}>{user?.fullName || "User"}</Text>
            <Text style={styles.profileEmail}>{user?.email || ""}</Text>
            <View style={styles.profileBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
              <Text style={styles.profileBadgeText}>Verified Account</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Account</Text>
            <MenuItem icon="person-outline" label="Personal Details" color="#6366f1" bg="#eef2ff" />
            <MenuItem icon="card-outline" label="Linked Accounts" color="#8b5cf6" bg="#f5f3ff" />
            <MenuItem icon="document-text-outline" label="Statements" color="#0ea5e9" bg="#e0f2fe" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Security</Text>
            <MenuItem icon="lock-closed-outline" label="Change Password" color="#10b981" bg="#ecfdf5" />
            <MenuItem icon="finger-print" label="Biometric Login" color="#f97316" bg="#fff7ed" rightText="Enabled" />
            <MenuItem icon="key-outline" label="Card PIN" color="#eab308" bg="#fefce8" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Preferences</Text>
            <MenuItem icon="notifications-outline" label="Notifications" color="#ec4899" bg="#fdf2f8" />
            <MenuItem icon="globe-outline" label="Language" color="#14b8a6" bg="#f0fdfa" rightText="English" />
            <MenuItem icon="help-circle-outline" label="Help & Support" color="#6366f1" bg="#eef2ff" />
            <MenuItem icon="information-circle-outline" label="About Rivo" color="#8b5cf6" bg="#f5f3ff" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(500)}>
          <View style={styles.section}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="log-out-outline" size={22} color={Colors.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Text style={styles.version}>Rivo v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text },
  profileCard: {
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 26, color: "#fff" },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.text },
  profileEmail: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  profileBadgeText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.success },
  section: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textMuted,
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
  menuLabel: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.text },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuRightText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.error },
  version: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
});
