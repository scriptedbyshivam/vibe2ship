import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: "citizen" | "officer" | "admin" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const defaultRoute = user.role === "admin" 
      ? "/admin/dashboard" 
      : user.role === "officer" 
        ? "/officer/dashboard" 
        : "/citizen/dashboard";
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
}
