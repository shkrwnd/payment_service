import React from "react";
import { useAuth } from "../hooks/useAuth";

export const HomePage: React.FC = () => {
  const { authenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-12">Loading...</div>;
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-foreground mb-4">Navout Payments</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {authenticated
          ? "Welcome back."
          : "Sign in or create an account to get started."}
      </p>
    </div>
  );
};
