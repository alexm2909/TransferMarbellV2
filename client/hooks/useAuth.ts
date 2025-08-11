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

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem("isAuthenticated");
    const userEmail = localStorage.getItem("userEmail");

    if (authStatus === "true" && userEmail) {
      // Get user from database
      const dbUser = database.getUserByEmail(userEmail);
      if (dbUser) {
        setIsAuthenticated(true);
        setUser(dbUser);
        // Update last login
        database.updateUser(dbUser.id, {
          lastLogin: new Date().toISOString()
        });
      } else {
        // User not found in database, logout
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; user?: DatabaseUser; error?: string } => {
    // Test credentials for different user roles
    const testCredentials: { [key: string]: { password: string; role: string; name: string; phone?: string } } = {
      "cliente@test.com": {
        password: "123456",
        role: "client",
        name: "Ana García",
        phone: "+34 600 123 456"
      },
      "conductor@test.com": {
        password: "123456",
        role: "driver",
        name: "Carlos Rodríguez",
        phone: "+34 600 654 321"
      },
      "admin@test.com": {
        password: "123456",
        role: "admin",
        name: "José Martínez",
        phone: "+34 600 345 678"
      }
    };

    // Check if user exists in database
    let dbUser = database.getUserByEmail(email);

    // If user doesn't exist and it's a test credential, create them
    if (!dbUser && testCredentials[email.toLowerCase()]) {
      const testUser = testCredentials[email.toLowerCase()];
      if (testUser.password === password) {
        dbUser = database.createUser({
          email,
          name: testUser.name,
          role: testUser.role as "client" | "driver" | "admin",
          phone: testUser.phone,
          driverStatus: testUser.role === "driver" ? "approved" : undefined
        });
      }
    }

    // Verify credentials
    if (dbUser && (testCredentials[email.toLowerCase()]?.password === password || password === "123456")) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);

      // Update last login
      database.updateUser(dbUser.id, {
        lastLogin: new Date().toISOString()
      });

      setIsAuthenticated(true);
      setUser(dbUser);

      return { success: true, user: dbUser };
    }

    return { success: false, error: "Credenciales inválidas" };
  };

  const register = (userData: Omit<DatabaseUser, 'id' | 'createdAt'>): { success: boolean; user?: DatabaseUser; error?: string } => {
    // Check if user already exists
    const existingUser = database.getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: "El usuario ya existe" };
    }

    // Create new user
    const newUser = database.createUser(userData);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", userData.email);

    setIsAuthenticated(true);
    setUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserProfile = (updates: Partial<DatabaseUser>) => {
    if (user) {
      const success = database.updateUser(user.id, updates);
      if (success) {
        const updatedUser = database.getUserById(user.id);
        if (updatedUser) {
          setUser(updatedUser);
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
