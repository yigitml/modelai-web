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
    name: "Basic",
    price: "$9.99/month",
    features: ["100 images/month", "Basic editing tools", "Email support"],
  },
  {
    name: "Pro",
    price: "$19.99/month",
    features: [
      "500 images/month",
      "Advanced editing tools",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited images",
      "Full feature set",
      "24/7 dedicated support",
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
                <h2 className="text-2xl font-bold">{plan.name}</h2>
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
                <Button className="w-full">Choose Plan</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
