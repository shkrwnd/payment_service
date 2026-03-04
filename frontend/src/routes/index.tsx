import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { AgentSettingsPage } from "../pages/AgentSettingsPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes: React.FC = () => {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={authenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="signup"
          element={authenticated ? <Navigate to="/" replace /> : <SignupPage />}
        />
        <Route
          path="agent-settings"
          element={
            <ProtectedRoute>
              <AgentSettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
