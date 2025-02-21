"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/dist/client/components/navigation";

const plans = [
  {
    name: "Free",
    price: "FREE!",
    features: [
      "50 AI photos",
      "Access to legacy models",
      <span
        key="highlight1"
        className="bg-red-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        Low Quality Photos
      </span>,
      <span
        key="highlight2"
        className="bg-red-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        Low Resemblance
      </span>,
      "Take 1 photo at a time",
      "Limited access to premium and ultra packs",
      "Watermarked photo",
      "No free auto-generated photos"
    ],
  },
  {
    name: "Premium",
    price: "$14.99/month",
    features: [
      "50 AI photos",
      "1 AI Model",
      <span
        key="highlight1"
        className="bg-yellow-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        High Quality Photos
      </span>,
      <span
        key="highlight2"
        className="bg-yellow-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        High Resemblance
      </span>,
      "Take 4 photo at a time",
      "Full access to packs",
      "No watermark",
      "Free auto-generated photos"
    ],
  }
];

export default function FeaturesPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const { user, accessToken } = useAppContext();
  
  const handlePlanSelect = () => {
    if (user && accessToken) {
      router.push("/home")
    } else {
      signIn()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
        </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center tracking-tight">
            Choose Your <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Plan</span>
          </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
              <Card onClick={handlePlanSelect} className="cursor-pointer hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="text-lg">{plan.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="text-center">
                  <Button onClick={handlePlanSelect}>Select Plan</Button>
                </CardFooter>
              </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
