import React from "react";
import { Header } from "./Header";
import ModelAI from "../ModelAI";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  activeTab,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <ModelAI activeTab={activeTab}>{children}</ModelAI>
    </div>
  );
};
