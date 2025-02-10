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
      key="highlight1"
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
      key="highlight1"
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
            <Card key={plan.name} className="bg-white/5 backdrop-blur-sm border-0 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <h2
                  className={`text-2xl font-bold ${
                    plan.name === "Premium"
                      ? "bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                      : plan.name === "Pro"
                        ? "bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                        : ""
                  }`}
                >
                  {plan.name}
                </h2>
                <p className="text-xl text-gray-400">{plan.price}</p>

                <Button 
                  className={`w-full h-16 font-semibold text-white border-3 border-transparent bg-transparent hover:bg-white/5 transition-all duration-300 ease-in-out transform hover:scale-105 relative
                    before:absolute before:inset-0 before:p-[2px] before:rounded-md before:bg-gradient-to-r ${
                      plan.name === "Premium"
                        ? "before:from-sky-500 before:via-purple-500 before:to-pink-500"
                        : plan.name === "Pro"
                          ? "before:from-sky-500 before:via-purple-500 before:to-pink-500"
                          : "before:from-sky-500 before:via-purple-500 before:to-pink-500"
                    } before:content-[""] before:-z-10 before:mask-button`}
                  onClick={handlePlanSelect}
                >
                  Subscribe
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-sky-500">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
