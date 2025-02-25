"use client";

import { Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import Loading from "@/components/Loading";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
function SignInContent() {
  const { signIn } = useAuth();
  
  return (
    <GoogleAuthButton
      variant="outline"
      size="lg"
      onClick={signIn}
    />
  );
}

export default function SignIn() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="absolute top-0 left-4 z-50">
        <button 
          onClick={() => router.back()}
          className="w-18 h-18 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
      </div>
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
