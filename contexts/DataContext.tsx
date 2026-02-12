import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { Transaction, Card, Beneficiary, AppNotification } from "@/lib/types";
import { KEYS, getItem, setItem } from "@/lib/storage";
import { generateId } from "@/lib/seed-data";
import { useAuth } from "./AuthContext";

interface DataContextValue {
  transactions: Transaction[];
  card: Card | null;
  beneficiaries: Beneficiary[];
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  toggleCardFreeze: () => Promise<void>;
  updateSpendingLimit: (limit: number) => Promise<void>;
  toggleCardControl: (control: "onlineEnabled" | "atmEnabled" | "contactlessEnabled") => Promise<void>;
  addTransaction: (txn: Omit<Transaction, "id" | "userId" | "date" | "status">) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  sendMoney: (beneficiaryId: string, amount: number, note: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [card, setCard] = useState<Card | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [txns, c, bens, notifs] = await Promise.all([
        getItem<Transaction[]>(KEYS.TRANSACTIONS),
        getItem<Card>(KEYS.CARD),
        getItem<Beneficiary[]>(KEYS.BENEFICIARIES),
        getItem<AppNotification[]>(KEYS.NOTIFICATIONS),
      ]);
      setTransactions(txns || []);
      setCard(c);
      setBeneficiaries(bens || []);
      setNotifications(notifs || []);
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await loadData();
  }, [loadData]);

  const toggleCardFreeze = useCallback(async () => {
    if (!card) return;
    const updated = { ...card, isFrozen: !card.isFrozen };
    await setItem(KEYS.CARD, updated);
    setCard(updated);
  }, [card]);

  const updateSpendingLimit = useCallback(async (limit: number) => {
    if (!card) return;
    const updated = { ...card, spendingLimit: limit };
    await setItem(KEYS.CARD, updated);
    setCard(updated);
  }, [card]);

  const toggleCardControl = useCallback(async (control: "onlineEnabled" | "atmEnabled" | "contactlessEnabled") => {
    if (!card) return;
    const updated = { ...card, [control]: !card[control] };
    await setItem(KEYS.CARD, updated);
    setCard(updated);
  }, [card]);

  const addTransaction = useCallback(async (txn: Omit<Transaction, "id" | "userId" | "date" | "status">) => {
    const newTxn: Transaction = {
      ...txn,
      id: generateId(),
      userId: user?.id || "",
      date: new Date().toISOString(),
      status: "completed",
    };
    const updated = [newTxn, ...transactions];
    await setItem(KEYS.TRANSACTIONS, updated);
    setTransactions(updated);
  }, [transactions, user]);

  const markNotificationRead = useCallback(async (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    await setItem(KEYS.NOTIFICATIONS, updated);
    setNotifications(updated);
  }, [notifications]);

  const sendMoney = useCallback(async (beneficiaryId: string, amount: number, note: string): Promise<boolean> => {
    if (!user || !card || user.balance < amount) return false;
    const ben = beneficiaries.find((b) => b.id === beneficiaryId);
    if (!ben) return false;

    await addTransaction({
      type: "debit",
      amount,
      category: "transfer",
      merchant: ben.name,
      description: note || `Transfer to ${ben.name}`,
    });

    await updateUser({ balance: user.balance - amount });
    return true;
  }, [user, card, beneficiaries, addTransaction, updateUser]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      transactions,
      card,
      beneficiaries,
      notifications,
      unreadCount,
      isLoading,
      refreshData,
      toggleCardFreeze,
      updateSpendingLimit,
      toggleCardControl,
      addTransaction,
      markNotificationRead,
      sendMoney,
    }),
    [transactions, card, beneficiaries, notifications, unreadCount, isLoading, refreshData, toggleCardFreeze, updateSpendingLimit, toggleCardControl, addTransaction, markNotificationRead, sendMoney]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
