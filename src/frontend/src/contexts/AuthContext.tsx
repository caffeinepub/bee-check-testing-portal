import type React from "react";
import { createContext, useContext, useState } from "react";

export type UserRole =
  | "director"
  | "official"
  | "purchaser"
  | "lab"
  | "labcoordinator"
  | "complianceofficer"
  | "financialofficial";

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
}

const demoAccounts: AuthUser[] = [
  { email: "director@bee.gov.in", role: "director", name: "BEE Director" },
  { email: "official@bee.gov.in", role: "official", name: "BEE Official" },
  { email: "purchaser@bee.gov.in", role: "purchaser", name: "SDA Purchaser" },
  { email: "lab@bee.gov.in", role: "lab", name: "NABL Lab Delhi" },
  {
    email: "labcoordinator@bee.gov.in",
    role: "labcoordinator",
    name: "Lab Coordinator",
  },
  {
    email: "complianceofficer@bee.gov.in",
    role: "complianceofficer",
    name: "Compliance Officer",
  },
  {
    email: "financial@bee.gov.in",
    role: "financialofficial",
    name: "Financial Official",
  },
];

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    if (password !== "Password@123") return false;
    const account = demoAccounts.find((a) => a.email === email);
    if (!account) return false;
    setUser(account);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { demoAccounts };
