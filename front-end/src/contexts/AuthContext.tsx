import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("eventmart_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6) {
      const newUser = {
        id: "user_" + Date.now(),
        name: email.split("@")[0],
        email,
      };
      setUser(newUser);
      localStorage.setItem("eventmart_user", JSON.stringify(newUser));
      toast.success("Welcome back!");
      setIsLoading(false);
      return true;
    }
    
    toast.error("Invalid credentials");
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (name && email && password.length >= 6) {
      const newUser = {
        id: "user_" + Date.now(),
        name,
        email,
      };
      setUser(newUser);
      localStorage.setItem("eventmart_user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      setIsLoading(false);
      return true;
    }
    
    toast.error("Please fill all fields correctly");
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("eventmart_user");
    toast.info("You've been logged out");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
