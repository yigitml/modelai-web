"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import Loading from "@/components/Loading";

type AuthenticatedLayoutProps = {
  children: React.ReactElement;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { accessToken, fetchUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      try {
        const user = await fetchUser();
        if (!user || !accessToken) {
          router.push("/unauthorized");
        return;
      }

      if (!user.isOnboarded) {
        router.push("/onboarding-freemium");
        return;
      }

      if (user.isOnboarded && !user.isFirstModelCreated) {
        router.push("/new-model");
          return;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/unauthorized");
      }
    };

    fetchUserAndRedirect();
  }, [router, accessToken]);

  return children;
} 