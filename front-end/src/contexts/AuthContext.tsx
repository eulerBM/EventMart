import React, { createContext, useContext, useState, useCallback } from "react";
import { loginService, registerService } from "@/services/AuthService";
import { toast } from "sonner";
import { alertError } from "@/alert/alertError";
import { loginFieldsValidation } from "@/validation/loginFields";
import { registerFieldsValidation } from "@/validation/registerFields";

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

    //Validation
    if(!loginFieldsValidation(email, password)){
      setIsLoading(false);
      return;
    }

    try{

        // API call
      const response = await loginService(email.trim(), password.trim());

      const newUser = {
        id: "user_" + response.user.idPublic,
        name: response.user.name,
        email: response.user.email
      };

      setUser(newUser);
      localStorage.setItem("eventmart_user", JSON.stringify(newUser));
      localStorage.setItem("token", response.token);

      toast.success("Bem vindo de volta!");
      setIsLoading(false);
      return true;
      
    } catch (error){

      alertError(
        error.response?.data.status ?? 500,
        error.response?.data?.nameError ?? "Erro inesperado"
      );

      setIsLoading(false);
      return false;
      
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);

    //Validation
    if(!registerFieldsValidation(name, email, password)){
      setIsLoading(false);
      return;
    }

    try{

      // API call
      const response = await registerService(name.trim() ,email.trim(), password.trim());

      const newUser = {
        id: "user_" + Date.now(),
        name,
        email,
      };
      setUser(newUser);
      localStorage.setItem("eventmart_user", JSON.stringify(newUser));
      toast.success("Conta criada com sucesso!");
      setIsLoading(false);
      return true;

    } catch(error){

      toast.error("Tente mais tarde!");
      setIsLoading(false);
      return false;

    }
    
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
