import { router } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="compass-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.title}>Page not found</Text>
      <Pressable onPress={() => router.replace("/")} style={styles.button}>
        <Text style={styles.buttonText}>Go Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: Colors.background, gap: 16 },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 20, color: Colors.text },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  buttonText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
