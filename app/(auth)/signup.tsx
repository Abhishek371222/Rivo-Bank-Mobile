import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import * as Haptics from "expo-haptics";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  async function handleSignup() {
    if (!fullName || !email || !password || !phone) {
      setError("Please fill in all fields");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const success = await signup(fullName, email, password, phone);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        setError("Failed to create account");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400)}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your financial journey with Rivo</Text>
          </Animated.View>

          {error ? (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(500)}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(600)}>
            <Pressable
              onPress={handleSignup}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.signupButtonPressed,
                isSubmitting && styles.signupButtonDisabled,
              ]}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signupButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, marginBottom: 4 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.textSecondary, marginBottom: 28 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  errorText: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.error },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text, marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: { marginLeft: 14 },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  signupButton: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
  signupButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  signupButtonDisabled: { opacity: 0.7 },
  signupButtonGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  signupButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  loginText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.primary },
});
