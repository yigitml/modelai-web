import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  SignInOptions,
} from "next-auth/react";
import { useAppContext } from "@/contexts/AppContext";

const useAuth = () => {
  const { setJwtToken, fetchUser } = useAppContext();

  const signIn = async (provider: string, options?: SignInOptions) => {
    const result = await nextAuthSignIn(provider, options);
    if (result?.ok) {
      const tokenResponse = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const { token } = await tokenResponse.json();
      setJwtToken(token);
      await fetchUser();
    }
    return result;
  };

  const signOut = async () => {
    await nextAuthSignOut();
    setJwtToken(null);
  };

  return { signIn, signOut };
};

export default useAuth;
