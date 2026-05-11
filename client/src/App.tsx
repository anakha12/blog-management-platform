import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { container } from "tsyringe";
import { Tokens } from "./di/tokens";
import { IAuthRepository } from "./domain/repositories/IAuthRepository";
import { useAuthStore } from "./application/state/authStore";
import { Navbar } from "./presentation/components/layout/Navbar";
import { LoginPage } from "./presentation/pages/LoginPage";
import { RegisterPage } from "./presentation/pages/RegisterPage";
import { DashboardPage } from "./presentation/pages/DashboardPage";
import { ProtectedRoute } from "./presentation/routes/ProtectedRoute";
import { PublicRoute } from "./presentation/routes/PublicRoute";

// Initialize DI container
import "./di/container";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const AppContent: React.FC = () => {
  const { isLoading, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRepo = container.resolve<IAuthRepository>(Tokens.AuthRepository);
        const { user, accessToken } = await authRepo.refresh();
        setAuth(user, accessToken);
      } catch (error) {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuth, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-500 text-5xl animate-spin">⟳</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
