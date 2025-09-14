import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("client" | "driver" | "admin")[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = ["client", "driver", "admin"],
  requireAuth = false,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ocean"></div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
    // Special handling for driver role - always redirect to driver-panel
    if (user.role === "driver") {
      return <Navigate to="/driver-panel" replace />;
    }

    // For other unauthorized roles, redirect to appropriate default page
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Default redirects based on role
    switch (user.role) {
      case "client":
        return <Navigate to="/" replace />;
      case "admin":
        return <Navigate to="/admin-panel" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
