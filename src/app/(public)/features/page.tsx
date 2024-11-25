import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$19.99/month",
    features: ["100 images/month", "Basic editing tools", "Email support"],
  },
  {
    name: "Pro",
    price: "$49.99/month",
    features: [
      "500 images/month",
      "Advanced editing tools",
      <span
        key="highlight1"
        className="bg-yellow-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        NEW: Priority support
      </span>,
    ],
  },
  {
    name: "Premium",
    price: "$99.99/month",
    features: [
      "Unlimited images",
      "Full feature set",
      <span
        key="highlight2"
        className="bg-yellow-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        NEW: 24/7 dedicated support
      </span>,
    ],
  },
];

export default function SubscriptionPlansPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Subscription Plans
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <h2
                  className={`text-2xl font-bold ${
                    plan.name === "Premium"
                      ? "bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text"
                      : plan.name === "Pro"
                        ? "bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500 text-transparent bg-clip-text"
                        : ""
                  }`}
                >
                  {plan.name}
                </h2>
                <p className="text-xl">{plan.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">FEATURES PAGE</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
