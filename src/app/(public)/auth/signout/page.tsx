"use client";

import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function SignOut() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <div>Signing out...</div>;
}
