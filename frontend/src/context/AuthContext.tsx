/*
 * Auth context for sharing the signed-in user and auth actions across the app.
 * The initial session is resolved from GET /api/profile using the auth cookie.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ message: string; user: AuthUser }>;
  register: (name: string, email: string, password: string) => Promise<{ message: string; user: AuthUser }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await apiFetch<{ message: string; user: AuthUser }>("/profile", {
        method: "GET",
      });
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ message: string; user: AuthUser }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data;
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ message: string; user: AuthUser }>("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiFetch<{ message: string }>("/logout", {
      method: "POST",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}