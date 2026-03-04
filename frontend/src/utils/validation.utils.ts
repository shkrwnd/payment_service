import { validateEmail, validatePassword } from "./validators";

export const validateLoginForm = (
  email: string,
  password: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  if (!email || !validateEmail(email)) errors.email = "Please enter a valid email address";
  if (!password || password.length === 0) errors.password = "Password is required";
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  if (!email || !validateEmail(email)) errors.email = "Please enter a valid email address";
  const pv = validatePassword(password);
  if (!password || !pv.valid) errors.password = pv.error || "Password is required";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  return { valid: Object.keys(errors).length === 0, errors };
};
