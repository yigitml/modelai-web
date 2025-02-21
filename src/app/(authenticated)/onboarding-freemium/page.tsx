"use client";

import React, { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
export default function OnboardingFreemiumPage() {
  const { updateUser } = useAppContext();
  const router = useRouter();

  const handleCompleteOnboarding = async () => {
    await updateUser({ isOnboarded: true });
    router.push("/home");
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Card className="p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-4">Welcome to TakeAIPhotos Freemium!</h1>
        <p className="mb-4">
          As a freemium user, you have access to our free base models for generating photos. Explore our ready-made base models, or create your own custom models to unlock even more possibilities!
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Generate stunning photos with free base models</li>
          <li>Create your own custom models for a personalized experience</li>
          <li>Upgrade anytime to access exclusive premium features</li>
        </ul>
        <Button onClick={handleCompleteOnboarding} className="w-full">
          Get Started with Freemium
        </Button>
      </Card>
    </div>
    </AuthenticatedLayout>
  );
} 