import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Zap, Home } from "lucide-react";
import { Header } from "../components/shared/Header";

const Sidebar: React.FC = () => (
  <aside className="w-56 shrink-0 border-r border-border bg-background min-h-full pt-6 px-3">
    <nav className="space-y-1">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <Home size={15} />
        Home
      </NavLink>
      <NavLink
        to="/agent-settings"
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`
        }
      >
        <Zap size={15} />
        Agent Settings
      </NavLink>
    </nav>
  </aside>
);

export const MainLayout: React.FC = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 min-w-0 px-6 py-6 overflow-x-hidden overflow-y-auto" style={{ backgroundColor: "#F5F5F3" }}>
        <Outlet />
      </main>
    </div>
  </div>
);
