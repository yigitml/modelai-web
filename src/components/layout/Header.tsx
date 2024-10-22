"use client";

import React, { useState, useEffect } from "react";
import { LogOut, LogIn, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useAppContext } from "@/contexts/AppContext";

export const Header: React.FC = () => {
  const { user } = useAppContext();
  const { isAuthenticated, signIn, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [user]);

  useEffect(() => {
    // This will cause the component to re-render when the user changes
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <header className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 mb-4 px-6 pt-4">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">◆</span> ModelAI
        </h1>
        <div className="flex items-center space-x-4">
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          {isAuthenticated && user ? (
            <>
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
              <Button onClick={signOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={signIn} variant="default">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
      <hr className="w-full border-t border-seperation-line" />
    </header>
  );
};
