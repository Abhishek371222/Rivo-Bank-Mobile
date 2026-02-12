import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { User } from "@/lib/types";
import { KEYS, getItem, setItem, removeItem } from "@/lib/storage";
import { seedData, defaultUser } from "@/lib/seed-data";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
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
      await seedData();
      const stored = await getItem<User>(KEYS.USER);
      const loggedIn = await getItem<boolean>("@rivo_logged_in");
      if (stored && loggedIn) {
        setUser(stored);
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, _password: string): Promise<boolean> {
    try {
      const stored = await getItem<User>(KEYS.USER);
      if (stored && stored.email === email) {
        setUser(stored);
        await setItem("@rivo_logged_in", true);
        return true;
      }
      if (email === defaultUser.email) {
        setUser(defaultUser);
        await setItem(KEYS.USER, defaultUser);
        await setItem("@rivo_logged_in", true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async function signup(fullName: string, email: string, _password: string, phone: string): Promise<boolean> {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        fullName,
        email,
        phone,
        balance: 1000,
        rewardPoints: 100,
      };
      await setItem(KEYS.USER, newUser);
      await setItem("@rivo_logged_in", true);
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  }

  async function logout(): Promise<void> {
    await removeItem("@rivo_logged_in");
    setUser(null);
  }

  async function updateUser(updates: Partial<User>): Promise<void> {
    if (!user) return;
    const updated = { ...user, ...updates };
    await setItem(KEYS.USER, updated);
    setUser(updated);
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
