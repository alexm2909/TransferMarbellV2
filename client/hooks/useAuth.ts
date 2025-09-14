import { useState, useEffect } from "react";
import { database, type DatabaseUser } from "@/services/database";

export interface User {
  email: string;
  name: string;
  role: "client" | "driver" | "admin";
  phone?: string;
  driverStatus?: "pending" | "approved" | "rejected";
  id?: string;
}

// Simplified auth shim: the app no longer requires users to sign in.
// Returns a default 'guest' client user so pages that expect a user remain functional.
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure there is a guest user in the in-memory/local DB and expose it to the app
    const guestEmail = "guest@transfermarbell.local";
    let guest = database.getUserByEmail(guestEmail);
    if (!guest) {
      guest = database.createUser({
        email: guestEmail,
        name: "Cliente Invitado",
        role: "client",
        phone: "",
      });
    }
    setUser(guest);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const login = async () => ({ success: false, error: "Autenticación deshabilitada" });
  const register = async () => ({ success: false, error: "Registro deshabilitado" });
  const logout = () => {
    // no-op: keep the guest session
    setIsAuthenticated(true);
  };

  const updateUserProfile = (updates: Partial<DatabaseUser>) => {
    if (user && user.id) {
      const success = database.updateUser(user.id, updates);
      if (success) {
        const updated = database.getUserById(user.id);
        if (updated) {
          setUser(updated);
        }
      }
      return success;
    }
    return false;
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
  };
}
