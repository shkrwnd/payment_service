import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AuthForm } from "../components/auth";
import { UserLogin, UserRegister } from "../types";
import { useAuth } from "../hooks/useAuth";

export const SignupPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: UserLogin | UserRegister) => {
    await register(data as UserRegister);
    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Navout Payments</h1>
        <p className="text-muted-foreground mt-2">Create an account</p>
      </div>
      <AuthForm
        mode="register"
        onSubmit={handleSubmit}
        onToggleMode={() => navigate("/login")}
      />
    </AuthLayout>
  );
};
