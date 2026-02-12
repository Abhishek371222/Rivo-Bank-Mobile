import { User, Card, Transaction, Beneficiary, AppNotification } from "./types";
import { KEYS, setItem, getItem } from "./storage";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const defaultUser: User = {
  id: "user_1",
  fullName: "Alex Morgan",
  email: "alex@rivo.com",
  phone: "+1 (555) 123-4567",
  balance: 24850.75,
  rewardPoints: 3420,
};

const defaultCard: Card = {
  id: "card_1",
  userId: "user_1",
  cardNumber: "4532 7891 2345 6789",
  cardHolder: "ALEX MORGAN",
  expiryDate: "12/28",
  cvv: "847",
  isFrozen: false,
  spendingLimit: 5000,
  onlineEnabled: true,
  atmEnabled: true,
  contactlessEnabled: true,
};

const categories: Transaction["category"][] = ["food", "shopping", "entertainment", "bills", "transfer", "salary", "cashback"];

const merchants: Record<string, { names: string[]; type: "debit" | "credit" }> = {
  food: { names: ["Whole Foods", "Starbucks", "Chipotle", "DoorDash", "Uber Eats"], type: "debit" },
  shopping: { names: ["Amazon", "Apple Store", "Nike", "Target", "Best Buy"], type: "debit" },
  entertainment: { names: ["Netflix", "Spotify", "AMC Theaters", "Steam", "PlayStation"], type: "debit" },
  bills: { names: ["Electric Co.", "AT&T", "Comcast", "Water Utility", "Insurance"], type: "debit" },
  transfer: { names: ["John Smith", "Sarah Wilson", "Mike Chen", "Emily Davis", "Chris Lee"], type: "debit" },
  salary: { names: ["Payroll Deposit", "Freelance Payment", "Consulting Fee"], type: "credit" },
  cashback: { names: ["Cashback Reward", "Signup Bonus", "Referral Bonus"], type: "credit" },
};

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const now = Date.now();

  for (let i = 0; i < 25; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const merchantData = merchants[cat];
    const merchant = merchantData.names[Math.floor(Math.random() * merchantData.names.length)];
    const type = merchantData.type;
    const amount = type === "credit"
      ? Math.floor(Math.random() * 3000) + 500
      : Math.floor(Math.random() * 200) + 5;

    txns.push({
      id: `txn_${i}`,
      userId: "user_1",
      type,
      amount: amount + Math.random() * 0.99,
      category: cat,
      merchant,
      description: `Payment to ${merchant}`,
      date: new Date(now - i * 86400000 * Math.random() * 3).toISOString(),
      status: Math.random() > 0.05 ? "completed" : "pending",
    });
  }

  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const defaultBeneficiaries: Beneficiary[] = [
  { id: "ben_1", userId: "user_1", name: "John Smith", accountNumber: "****4521", bankName: "Chase", initial: "J", color: "#6366f1" },
  { id: "ben_2", userId: "user_1", name: "Sarah Wilson", accountNumber: "****7832", bankName: "Bank of America", initial: "S", color: "#8b5cf6" },
  { id: "ben_3", userId: "user_1", name: "Mike Chen", accountNumber: "****2198", bankName: "Wells Fargo", initial: "M", color: "#10b981" },
  { id: "ben_4", userId: "user_1", name: "Emily Davis", accountNumber: "****5643", bankName: "Citi Bank", initial: "E", color: "#f59e0b" },
  { id: "ben_5", userId: "user_1", name: "Chris Lee", accountNumber: "****9876", bankName: "Capital One", initial: "C", color: "#ef4444" },
];

const defaultNotifications: AppNotification[] = [
  { id: "notif_1", userId: "user_1", title: "Payment Received", message: "You received $1,250.00 from Payroll Deposit", type: "transaction", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "notif_2", userId: "user_1", title: "Bill Due Soon", message: "Your Electric Co. bill of $85.40 is due in 3 days", type: "bill", isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "notif_3", userId: "user_1", title: "Cashback Earned", message: "You earned $12.50 cashback on your Amazon purchase", type: "promo", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "notif_4", userId: "user_1", title: "Security Alert", message: "New device login detected from iPhone 15", type: "security", isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "notif_5", userId: "user_1", title: "Card Transaction", message: "Purchase of $42.99 at Netflix", type: "transaction", isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

export async function seedData(): Promise<void> {
  const seeded = await getItem<boolean>(KEYS.SEEDED);
  if (seeded) return;

  await setItem(KEYS.USER, defaultUser);
  await setItem(KEYS.CARD, defaultCard);
  await setItem(KEYS.TRANSACTIONS, generateTransactions());
  await setItem(KEYS.BENEFICIARIES, defaultBeneficiaries);
  await setItem(KEYS.NOTIFICATIONS, defaultNotifications);
  await setItem(KEYS.SEEDED, true);
}

export { defaultUser, defaultCard, generateId };
