"use client";

import { Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import Loading from "@/components/Loading";

function SignInContent() {
  const { signIn } = useAuth();

  return (
    <GoogleAuthButton
      variant="outline"
      size="default"
      onClick={() => {signIn()}}
    />
  );
}

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex items-center gap-2 mb-12">
        <h1 className="text-4xl font-bold">Sign In to</h1>
        <span className="text-4xl font-bold bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text selection:text-transparent selection:bg-clip-text">TakeAIPhotos</span>
      </div>
      <Suspense fallback={<Loading />}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
