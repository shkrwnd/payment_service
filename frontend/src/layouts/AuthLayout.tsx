import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-muted/30">
    <div className="w-full max-w-md p-8 bg-background rounded-xl border border-border shadow-lg">
      {children}
    </div>
  </div>
);
