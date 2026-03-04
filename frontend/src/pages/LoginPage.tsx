import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AuthForm } from "../components/auth";
import { useAuth } from "../hooks/useAuth";
import { UserLogin, UserRegister } from "../types";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: UserLogin | UserRegister) => {
    await login(data as UserLogin);
    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Navout Payments</h1>
        <p className="text-muted-foreground mt-2">Sign in to your account</p>
      </div>
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        onToggleMode={() => navigate("/signup")}
      />
    </AuthLayout>
  );
};
