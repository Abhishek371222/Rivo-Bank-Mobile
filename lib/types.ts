export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  balance: number;
  rewardPoints: number;
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
  type: "transaction" | "bill" | "promo" | "security";
  isRead: boolean;
  createdAt: string;
}
