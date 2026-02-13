import AsyncStorage from '@react-native-async-storage/async-storage';

// User Interface
export interface User {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    password: string;
    profilePhoto: string | null;
    balance: number;
    creditScore: number;
    kycStatus: 'pending' | 'verified';
    biometricEnabled: boolean;
    createdAt: string;
}

// Loan Interface
export interface Loan {
    id: string;
    userId: string;
    amount: number;
    tenure: number; // months
    interestRate: number;
    status: 'active' | 'repaid' | 'defaulted';
    borrowedDate: string;
    dueDate: string;
    outstandingBalance: number;
    emiAmount: number;
    payments: Payment[];
}

// Payment Interface
export interface Payment {
    id: string;
    loanId: string;
    amount: number;
    date: string;
    type: 'auto-debit' | 'manual' | 'prepayment';
}

// Transaction Interface
export interface Transaction {
    id: string;
    userId: string;
    type: 'debit' | 'credit';
    amount: number;
    category: string;
    description: string;
    merchant: string;
    date: string;
    balance: number;
}

const USERS_KEY = '@rivo_users';
const CURRENT_USER_KEY = '@rivo_current_user';
const LOANS_KEY = '@rivo_loans';
const TRANSACTIONS_KEY = '@rivo_transactions';

// User Operations
export const saveUser = async (user: User): Promise<void> => {
    try {
        const usersJson = await AsyncStorage.getItem(USERS_KEY);
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];

        const existingIndex = users.findIndex(u => u.id === user.id);
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }

        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const usersJson = await AsyncStorage.getItem(USERS_KEY);
        if (!usersJson) return null;

        const users: User[] = JSON.parse(usersJson);
        return users.find(u => u.email === email) || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const setCurrentUser = async (user: User | null): Promise<void> => {
    try {
        if (user) {
            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            await AsyncStorage.removeItem(CURRENT_USER_KEY);
        }
    } catch (error) {
        console.error('Error setting current user:', error);
        throw error;
    }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
    try {
        const usersJson = await AsyncStorage.getItem(USERS_KEY);
        if (!usersJson) return;

        const users: User[] = JSON.parse(usersJson);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex >= 0) {
            users[userIndex].balance = newBalance;
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

            // Update current user if it's the same
            const currentUser = await getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                currentUser.balance = newBalance;
                await setCurrentUser(currentUser);
            }
        }
    } catch (error) {
        console.error('Error updating balance:', error);
        throw error;
    }
};

// Loan Operations
export const saveLoan = async (loan: Loan): Promise<void> => {
    try {
        const loansJson = await AsyncStorage.getItem(LOANS_KEY);
        const loans: Loan[] = loansJson ? JSON.parse(loansJson) : [];

        const existingIndex = loans.findIndex(l => l.id === loan.id);
        if (existingIndex >= 0) {
            loans[existingIndex] = loan;
        } else {
            loans.push(loan);
        }

        await AsyncStorage.setItem(LOANS_KEY, JSON.stringify(loans));
    } catch (error) {
        console.error('Error saving loan:', error);
        throw error;
    }
};

export const getUserLoans = async (userId: string): Promise<Loan[]> => {
    try {
        const loansJson = await AsyncStorage.getItem(LOANS_KEY);
        if (!loansJson) return [];

        const loans: Loan[] = JSON.parse(loansJson);
        return loans.filter(l => l.userId === userId);
    } catch (error) {
        console.error('Error getting loans:', error);
        return [];
    }
};

export const getActiveLoan = async (userId: string): Promise<Loan | null> => {
    try {
        const loans = await getUserLoans(userId);
        return loans.find(l => l.status === 'active') || null;
    } catch (error) {
        console.error('Error getting active loan:', error);
        return null;
    }
};

// Transaction Operations
export const saveTransaction = async (transaction: Transaction): Promise<void> => {
    try {
        const transactionsJson = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        const transactions: Transaction[] = transactionsJson ? JSON.parse(transactionsJson) : [];

        transactions.unshift(transaction); // Add to beginning

        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw error;
    }
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
    try {
        const transactionsJson = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        if (!transactionsJson) return [];

        const transactions: Transaction[] = JSON.parse(transactionsJson);
        return transactions.filter(t => t.userId === userId);
    } catch (error) {
        console.error('Error getting transactions:', error);
        return [];
    }
};

// Initialize demo user
export const initializeDemoUser = async (): Promise<User> => {
    const demoUser: User = {
        id: 'demo-user-1',
        email: 'demo@rivobank.com',
        fullName: 'John Doe',
        phone: '+91 98765 43210',
        password: 'demo123', // In production, this should be hashed
        profilePhoto: null,
        balance: 50000,
        creditScore: 750,
        kycStatus: 'verified',
        biometricEnabled: false,
        createdAt: new Date().toISOString(),
    };

    await saveUser(demoUser);
    return demoUser;
};

// Ensure demo user exists without resetting data
export const ensureDemoUser = async (): Promise<User> => {
    const existing = await getUserByEmail('demo@rivobank.com');
    if (existing) {
        return existing; // Return existing user with all their saved data
    }

    // Only create if doesn't exist
    return await initializeDemoUser();
};

