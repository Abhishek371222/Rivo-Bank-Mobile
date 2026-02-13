import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER: "@rivo_user",
  TRANSACTIONS: "@rivo_transactions",
  CARD: "@rivo_card",
  CARDS: "@rivo_cards",
  BENEFICIARIES: "@rivo_beneficiaries",
  NOTIFICATIONS: "@rivo_notifications",
  BUDGETS: "@rivo_budgets",
  BILLS: "@rivo_bills",
  SAVINGS_GOALS: "@rivo_savings_goals",
  ACHIEVEMENTS: "@rivo_achievements",
  USER_ACHIEVEMENTS: "@rivo_user_achievements",
  REFERRAL: "@rivo_referral",
  RECURRING_PAYMENTS: "@rivo_recurring_payments",
  MONEY_REQUESTS: "@rivo_money_requests",
  SPLIT_BILLS: "@rivo_split_bills",
  SEEDED: "@rivo_seeded",
};

export async function getItem<T>(key: string): Promise<T | null> {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export { KEYS };
