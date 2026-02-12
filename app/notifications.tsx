import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useData } from "@/contexts/DataContext";
import { AppNotification } from "@/lib/types";
import * as Haptics from "expo-haptics";

const notifIcons: Record<string, { icon: string; color: string; bg: string }> = {
  transaction: { icon: "swap-horizontal", color: "#6366f1", bg: "#eef2ff" },
  bill: { icon: "receipt", color: "#eab308", bg: "#fefce8" },
  promo: { icon: "gift", color: "#ec4899", bg: "#fdf2f8" },
  security: { icon: "shield-checkmark", color: "#ef4444", bg: "#fef2f2" },
};

function NotificationItem({ item, onRead }: { item: AppNotification; onRead: (id: string) => void }) {
  const config = notifIcons[item.type] || notifIcons.transaction;
  const timeAgo = getTimeAgo(item.createdAt);

  return (
    <Pressable
      onPress={() => { if (!item.isRead) { onRead(item.id); Haptics.impactAsync(); } }}
      style={[styles.notifItem, !item.isRead && styles.notifUnread]}
    >
      <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon as any} size={22} color={config.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.notifTime}>{timeAgo}</Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead } = useData();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.duration(400).delay(index * 60)}>
            <NotificationItem item={item} onRead={markNotificationRead} />
          </Animated.View>
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surface,
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  notifItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  notifUnread: { backgroundColor: Colors.primary + "06" },
  notifIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  notifTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notifMessage: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary, marginTop: 4, lineHeight: 20 },
  notifTime: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted, marginTop: 6 },
  emptyState: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.textMuted },
});
