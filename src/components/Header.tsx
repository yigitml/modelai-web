"use client";

import React from "react";
import { LogOut, Plus, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/AppContext";
import { usePathname, useRouter } from "next/navigation";
import GoogleAuthButton from "./GoogleAuthButton";

export const Header: React.FC = () => {
  const { user, credits } = useAppContext();
  const { signIn, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const shouldShowBack = !["/home", "/"].includes(pathname);

  return (
    <header className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-3 sm:py-6 flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          {shouldShowBack && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => {router.back()}}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <span className="text-xl sm:text-2xl font-bold">ModelAI</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <>
              <Button 
                variant="outline" 
                className="flex items-center text-sm sm:text-base px-2 sm:px-4"
                onClick={() => {router.push("/new-model")}}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text animate-flow">New Model</span>
                <span className="sm:hidden">New</span>
              </Button>
              {credits.map(credit => {
                return (
                  <span key={credit.type} className="flex items-center gap-1 text-s sm:text-sm text-emerald-500 whitespace-nowrap">
                    <Zap className="w-4 h-4 sm:w-4 sm:h-4" />
                    {credit.amount}
                  </span>
                )
              })}
            </>
          )}
          {user ? (
            <>
              <Avatar 
                className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer" 
                onClick={() => {router.push("/profile")}}
              >
                <AvatarImage src={user?.image || ""} alt={user.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <GoogleAuthButton 
              onClick={() => signIn()} 
              variant="outline"
            />
          )}
        </div>
      </div>
      <hr className="w-full border-t border-white/10" />
    </header>
  );
};
