"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">Sign In to ModelAI</h1>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/camera" })}
        className="w-64 h-12 text-white font-bold relative overflow-hidden group"
      >
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 animate-flow"></span>
        <span className="relative z-10 flex items-center justify-center">
          Sign in with Google
        </span>
      </Button>
    </div>
  );
}
