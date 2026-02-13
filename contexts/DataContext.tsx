import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { Card, Beneficiary, AppNotification } from "@/lib/types";
import { Transaction, getUserTransactions, saveTransaction } from "@/services/database";
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
  addTransaction: (txn: Omit<Transaction, "id" | "userId" | "date" | "balance">) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  sendMoney: (beneficiaryId: string, amount: number, note: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, updateUser, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [card, setCard] = useState<Card | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      if (!user) return;

      // Load transactions from database service
      const txns = await getUserTransactions(user.id);

      // Load other data from old storage
      const [c, bens, notifs] = await Promise.all([
        getItem<Card>(KEYS.CARD),
        getItem<Beneficiary[]>(KEYS.BENEFICIARIES),
        getItem<AppNotification[]>(KEYS.NOTIFICATIONS),
      ]);

      setTransactions(txns);
      setCard(c);
      setBeneficiaries(bens || []);
      setNotifications(notifs || []);
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await refreshUser(); // Refresh user data from database
    await loadData();
  }, [loadData, refreshUser]);

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

  const addTransaction = useCallback(async (txn: Omit<Transaction, "id" | "userId" | "date" | "balance">) => {
    if (!user) return;

    const newTxn: Transaction = {
      ...txn,
      id: `txn-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      balance: user.balance, // Current balance after transaction
    };

    // Save to database service
    await saveTransaction(newTxn);

    // Reload transactions
    const txns = await getUserTransactions(user.id);
    setTransactions(txns);

    // Refresh user to get updated balance
    await refreshUser();
  }, [user, refreshUser]);

  const markNotificationRead = useCallback(async (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    await setItem(KEYS.NOTIFICATIONS, updated);
    setNotifications(updated);
  }, [notifications]);

  const sendMoney = useCallback(async (beneficiaryId: string, amount: number, note: string): Promise<boolean> => {
    if (!user) return false;
    if (amount > user.balance) return false;

    const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId);
    if (!beneficiary) return false;

    try {
      // Deduct from balance
      const newBalance = user.balance - amount;
      await updateUser({ balance: newBalance });

      // Create transaction
      const newTxn: Transaction = {
        id: `txn-${Date.now()}`,
        userId: user.id,
        type: "debit",
        amount,
        category: "Transfer",
        description: note,
        merchant: beneficiary.name,
        date: new Date().toISOString(),
        balance: newBalance,
      };

      await saveTransaction(newTxn);

      // Reload data
      await refreshData();
      return true;
    } catch (error) {
      console.error("Send money error:", error);
      return false;
    }
  }, [user, beneficiaries, updateUser, refreshData]);

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
    [
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
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
