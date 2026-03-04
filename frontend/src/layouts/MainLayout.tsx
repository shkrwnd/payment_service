import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/shared/Header";

export const MainLayout: React.FC = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-6">
      <Outlet />
    </main>
  </div>
);
