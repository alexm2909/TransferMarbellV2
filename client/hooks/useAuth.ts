import { useState, useEffect } from "react";

export interface User {
  email: string;
  name: string;
  role: "client" | "driver" | "fleet-manager" | "admin" | "business";
  phone?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (authStatus === "true" && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    // Solo limpiar datos de autenticación, mantener datos de reserva
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    // Comentamos estas líneas para mantener los datos de reserva durante navegación
    // localStorage.removeItem("preBookingData");
    // localStorage.removeItem("bookingData");
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };
}
