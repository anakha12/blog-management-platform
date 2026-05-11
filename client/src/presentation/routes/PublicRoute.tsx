import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../application/state/authStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // If user is already logged in, send them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
