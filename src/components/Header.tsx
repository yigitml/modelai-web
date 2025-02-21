"use client";

import React, { useState } from "react";
import { LogOut, Plus, Zap, ArrowLeft, Video, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/AppContext";
import { usePathname, useRouter } from "next/navigation";
import GoogleAuthButton from "./GoogleAuthButton";
import HelpModal from "@/components/HelpModal";

export const Header: React.FC = () => {
  const { user, credits } = useAppContext();
  const { signIn, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const shouldShowBack = !["/home", "/"].includes(pathname);

  return (
    <>
      <header className="flex flex-col w-full">
        <div className="container mx-auto px-4 py-3 sm:py-6 flex items-center justify-between w-full gap-4 overflow-hidden">
          <div className="flex items-center gap-2">
            {shouldShowBack && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => {
                  if (window.history.state?.idx > 0) {
                    router.back();
                  } else {
                    router.push("/home");
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span
              className="hidden lg:inline text-xl sm:text-2xl font-bold cursor-pointer"
              onClick={() => router.push("/home")}
            >
              TakeAIPhotos
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center text-sm sm:text-base px-2 sm:px-4"
                  onClick={() => router.push("/new-model")}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text">
                    <span className="hidden sm:inline">New Model</span>
                    <span className="sm:hidden">New</span>
                  </span>
                </Button>
                {credits.map((credit) => {
                  let IconComponent;
                  let labelText;

                  // Determine which icon and label to use based on the credit type
                  switch (credit.type) {
                    case "VIDEO":
                      IconComponent = Video;
                      labelText = "Video";
                      break;
                    case "PHOTO":
                      IconComponent = Image;
                      labelText = "Photo";
                      break;
                    case "MODEL":
                    default:
                      IconComponent = Zap;
                      labelText = "Model";
                      break;
                  }

                  return (
                    <span
                      key={credit.id || `${credit.amount}-${credit.type}`}
                      className="flex items-center text-s sm:text-sm text-emerald-400 cursor-pointer rounded-lg font-semibold opacity-100 hover:opacity-100 transition-opacity duration-200"
                      onClick={() => router.push("/credits")}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="ml-2">{credit.amount}</span>
                    </span>
                  );
                })}
              </>
            )}
            {user ? (
              <>
                {/*
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelp(true)}
                  title="Help"
                >
                  Help
                </Button>
                */}
                <Avatar
                  className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user.name}
                    className="object-cover h-full w-full"
                  />
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
              <GoogleAuthButton onClick={() => signIn()} variant="outline" />
            )}
          </div>
        </div>
        <hr className="w-full border-t border-white/10" />
      </header>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};