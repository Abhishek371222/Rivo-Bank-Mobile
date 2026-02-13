export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  balance: number;
  rewardPoints: number;
  referralCode?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  transaction: boolean;
  bill: boolean;
  promo: boolean;
  security: boolean;
  budget: boolean;
  achievement: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "08:00"
}

export interface Card {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isFrozen: boolean;
  spendingLimit: number;
  onlineEnabled: boolean;
  atmEnabled: boolean;
  contactlessEnabled: boolean;
  cardType: "debit" | "credit" | "virtual";
  isPrimary: boolean;
  color?: string;
  nickname?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "debit" | "credit";
  amount: number;
  category: "food" | "shopping" | "entertainment" | "bills" | "transfer" | "salary" | "cashback";
  merchant: string;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  splitWith?: string[]; // User IDs
  billId?: string;
  recurringId?: string;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  bankName: string;
  initial: string;
  color: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "transaction" | "bill" | "promo" | "security" | "budget" | "achievement";
  isRead: boolean;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: "food" | "shopping" | "entertainment" | "bills" | "transfer";
  limit: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: string;
  alertThreshold: number; // percentage (e.g., 80 for 80%)
  isActive: boolean;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  frequency?: "weekly" | "monthly" | "yearly";
  isPaid: boolean;
  reminderDays: number; // days before due date
  autoPayEnabled: boolean;
  lastPaidDate?: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  category: "vacation" | "emergency" | "purchase" | "other";
  createdAt: string;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "spending" | "saving" | "social" | "streak";
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  rewardPoints: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  progress: number;
  unlockedAt?: string;
}

export interface Referral {
  id: string;
  userId: string;
  referralCode: string;
  referredUsers: ReferredUser[];
  totalRewards: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export interface ReferredUser {
  id: string;
  name: string;
  joinedAt: string;
  rewardEarned: number;
  status: "pending" | "active";
}

export interface RecurringPayment {
  id: string;
  userId: string;
  beneficiaryId: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly";
  nextPaymentDate: string;
  isActive: boolean;
  note: string;
  startDate: string;
}

export interface MoneyRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  note: string;
  status: "pending" | "paid" | "declined";
  createdAt: string;
  paidAt?: string;
}

export interface SplitBill {
  id: string;
  createdBy: string;
  totalAmount: number;
  participants: SplitParticipant[];
  description: string;
  createdAt: string;
  status: "pending" | "completed";
}

export interface SplitParticipant {
  userId: string;
  name: string;
  amount: number;
  isPaid: boolean;
}
