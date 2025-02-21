"use client";

import React, { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
export default function OnboardingPage() {
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
          <h1 className="text-3xl font-bold mb-4">Welcome to TakeAIPhotos!</h1>
        <p className="mb-4">
          It looks like you're new here. As a premium subscriber, you have access to exclusive features.
          Let us guide you through how to create your models, train them with your photos, and generate stunning AI images.
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Create and train models with your own images</li>
          <li>Access our AI-powered prediction tools</li>
          <li>Enjoy exclusive premium content and features</li>
        </ul>
          <Button onClick={handleCompleteOnboarding} className="w-full">
            Start Using TakeAIPhotos
          </Button>
      </Card>
    </div>
    </AuthenticatedLayout>
  );
}