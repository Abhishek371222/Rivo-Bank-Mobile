import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
  User,
  getCurrentUser,
  setCurrentUser,
  getUserByEmail,
  saveUser,
  ensureDemoUser,
  updateUserBalance
} from "@/services/database";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      // Ensure demo user exists (won't reset if already exists)
      await ensureDemoUser();

      // Load current logged-in user
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const dbUser = await getUserByEmail(email);

      if (dbUser && dbUser.password === password) {
        // Set as current user in database
        await setCurrentUser(dbUser);
        setUser(dbUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  async function signup(fullName: string, email: string, password: string, phone: string): Promise<boolean> {
    try {
      // Check if user already exists
      const existing = await getUserByEmail(email);
      if (existing) {
        return false; // User already exists
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        phone,
        password,
        profilePhoto: null,
        balance: 1000, // Starting balance
        creditScore: 650, // Default credit score
        kycStatus: 'pending',
        biometricEnabled: false,
        createdAt: new Date().toISOString(),
      };

      await saveUser(newUser);
      await setCurrentUser(newUser);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  }

  async function logout(): Promise<void> {
    await setCurrentUser(null);
    setUser(null);
  }

  async function updateUser(updates: Partial<User>): Promise<void> {
    if (!user) return;

    const updated = { ...user, ...updates };
    await saveUser(updated);
    await setCurrentUser(updated);
    setUser(updated);
  }

  async function refreshUser(): Promise<void> {
    if (!user) return;

    // Reload user from database to get latest data
    const fresh = await getUserByEmail(user.email);
    if (fresh) {
      await setCurrentUser(fresh);
      setUser(fresh);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
