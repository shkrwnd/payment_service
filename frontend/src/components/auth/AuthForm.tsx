import React, { useState } from "react";
import { Button, Input } from "../ui";
import { validateLoginForm, validateRegisterForm } from "../../utils/validation.utils";
import { UserLogin, UserRegister } from "../../types";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: UserLogin | UserRegister) => Promise<void>;
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validation =
      mode === "login"
        ? validateLoginForm(email, password)
        : validateRegisterForm(email, password, confirmPassword);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await onSubmit({ email, password });
      } else {
        await onSubmit({ email, password });
      }
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : "An error occurred";
      setErrors({ submit: String(message) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1.5 text-sm text-destructive">{errors.password}</p>}
      </div>
      {mode === "register" && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      )}
      {errors.submit && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}
      <Button type="submit" className="w-full mt-6" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
      </Button>
      <div className="text-center text-sm text-muted-foreground pt-2">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button type="button" onClick={onToggleMode} className="text-primary font-medium hover:underline">
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" onClick={onToggleMode} className="text-primary font-medium hover:underline">
              Sign in
            </button>
          </>
        )}
      </div>
    </form>
  );
};
