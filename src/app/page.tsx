import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Welcome to ModelAI</h1>
        <p className="text-xl mb-8">
          Create stunning AI-generated images with ease.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/plans">View Plans</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/features">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
