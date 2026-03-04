import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
import { useAuth } from "../../hooks/useAuth";

export const Header: React.FC = () => {
  const { authenticated, logout, userEmail } = useAuth();
  return (
    <header className="border-b border-border bg-background px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-foreground">
        Navout Payments
      </Link>
      <nav className="flex items-center gap-4">
        {authenticated ? (
          <>
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </>
        ) : null}
      </nav>
    </header>
  );
};
