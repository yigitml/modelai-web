"use client";

import React from "react";
import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/AppContext";

export const Header: React.FC = () => {
  const { user } = useAppContext();
  const { signIn, signOut } = useAuth();

  return (
    <header className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 mb-4 px-6 pt-4">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">◆</span> ModelAI
        </h1>
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  {user ? (
                    <>
                      <Avatar>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <Button onClick={() => signOut()} variant="outline">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => signIn()} variant="default">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
                <Button onClick={() => signOut()} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn()} variant="default">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-seperation-line" />
    </header>
  );
};
