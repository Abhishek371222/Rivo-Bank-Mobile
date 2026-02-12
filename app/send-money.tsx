import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn, ZoomIn } from "react-native-reanimated";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useData } from "@/contexts/DataContext";
import { Beneficiary } from "@/lib/types";
import * as Haptics from "expo-haptics";

export default function SendMoneyScreen() {
  const insets = useSafeAreaInsets();
  const { beneficiaries, sendMoney } = useData();
  const [selectedBen, setSelectedBen] = useState<Beneficiary | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"select" | "amount" | "success">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  function selectBeneficiary(ben: Beneficiary) {
    setSelectedBen(ben);
    setStep("amount");
    Haptics.impactAsync();
  }

  async function handleSend() {
    if (!selectedBen) return;
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Enter a valid amount");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setError("");
    setIsSubmitting(true);
    const success = await sendMoney(selectedBen.id, numAmount, note);
    setIsSubmitting(false);
    if (success) {
      setStep("success");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setError("Insufficient balance or transfer failed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  if (step === "success") {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <Animated.View entering={ZoomIn.duration(500)} style={styles.successContent}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Transfer Successful!</Text>
          <Text style={styles.successAmount}>${parseFloat(amount).toFixed(2)}</Text>
          <Text style={styles.successTo}>sent to {selectedBen?.name}</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(); router.back(); }}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
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
            { paddingTop: insets.top + webTopInset + 8, paddingBottom: insets.bottom + webBottomInset + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable onPress={() => { if (step === "amount") { setStep("select"); } else { router.back(); } }} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
            <Text style={styles.topTitle}>Send Money</Text>
            <View style={{ width: 44 }} />
          </View>

          {step === "select" && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.sectionTitle}>Choose Recipient</Text>
              <View style={styles.benGrid}>
                {beneficiaries.map((ben, i) => (
                  <Animated.View key={ben.id} entering={FadeInDown.duration(400).delay(i * 80)}>
                    <Pressable
                      onPress={() => selectBeneficiary(ben)}
                      style={({ pressed }) => [styles.benCard, pressed && { transform: [{ scale: 0.95 }] }]}
                    >
                      <View style={[styles.benAvatar, { backgroundColor: ben.color }]}>
                        <Text style={styles.benInitial}>{ben.initial}</Text>
                      </View>
                      <Text style={styles.benName} numberOfLines={1}>{ben.name}</Text>
                      <Text style={styles.benBank} numberOfLines={1}>{ben.bankName}</Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}

          {step === "amount" && selectedBen && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <View style={styles.recipientCard}>
                <View style={[styles.benAvatarSmall, { backgroundColor: selectedBen.color }]}>
                  <Text style={styles.benInitialSmall}>{selectedBen.initial}</Text>
                </View>
                <View>
                  <Text style={styles.recipientName}>{selectedBen.name}</Text>
                  <Text style={styles.recipientBank}>{selectedBen.bankName} {selectedBen.accountNumber}</Text>
                </View>
              </View>

              <Text style={styles.amountLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>

              <Text style={styles.noteLabel}>Add a note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="What's this for?"
                placeholderTextColor={Colors.textMuted}
                multiline
              />

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleSend}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && { opacity: 0.9 },
                  isSubmitting && { opacity: 0.7 },
                ]}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendButtonGradient}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#fff" />
                      <Text style={styles.sendButtonText}>Send Money</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surface,
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: Colors.border,
  },
  topTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 20, color: Colors.text, marginBottom: 20 },
  benGrid: { gap: 12 },
  benCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benAvatar: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  benInitial: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff" },
  benName: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text, flex: 1 },
  benBank: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted },
  recipientCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benAvatarSmall: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  benInitialSmall: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
  recipientName: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text },
  recipientBank: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  amountLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text, marginBottom: 8 },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySymbol: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text },
  amountInput: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
    paddingVertical: 18,
    paddingLeft: 8,
  },
  noteLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text, marginBottom: 8 },
  noteInput: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    padding: 16,
    minHeight: 60,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: "top" as const,
  },
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
  sendButton: { borderRadius: 14, overflow: "hidden" },
  sendButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  sendButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  successContainer: { justifyContent: "center", alignItems: "center" },
  successContent: { alignItems: "center", padding: 40 },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.text, marginBottom: 8 },
  successAmount: { fontFamily: "Inter_700Bold", fontSize: 36, color: Colors.primary },
  successTo: { fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.textSecondary, marginTop: 4, marginBottom: 32 },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  doneButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
